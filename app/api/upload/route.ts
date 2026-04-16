import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const BUCKET = "listing-photos";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Keine Datei gefunden." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Nur JPG, PNG, WebP oder HEIC erlaubt." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Datei ist zu groß (max. 10 MB)." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeExt = /^[a-z0-9]{2,5}$/.test(ext) ? ext : "jpg";
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

    const supabase = getServiceClient();
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(key, arrayBuffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload]", uploadError);
      return NextResponse.json(
        { error: "Upload fehlgeschlagen. Bucket 'listing-photos' vorhanden?" },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(key);
    return NextResponse.json({ url: publicUrl.publicUrl, key });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "Unerwarteter Fehler." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { key } = (await req.json()) as { key?: string };
    if (!key) return NextResponse.json({ error: "key erforderlich" }, { status: 400 });

    const supabase = getServiceClient();
    const { error } = await supabase.storage.from(BUCKET).remove([key]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
}
