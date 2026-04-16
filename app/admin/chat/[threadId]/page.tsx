import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServer, getSessionUser } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export default async function AdminThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const supabase = await getSupabaseServer();
  const me = await getSessionUser();

  const { data: thread } = await supabase
    .from("threads")
    .select("id, subject, status, customer_id, listing_id, listings(make, model, year)")
    .eq("id", threadId)
    .single();

  if (!thread) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, body, sender_id, created_at, read_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  const listing = Array.isArray(thread.listings) ? thread.listings[0] : thread.listings;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/chat" className="text-xs text-foreground-muted hover:text-primary">
          ← Alle Nachrichten
        </Link>
        <h1 className="text-xl font-bold text-foreground mt-2">
          {thread.subject || "Kein Betreff"}
        </h1>
        <div className="flex items-center gap-3 mt-1 text-xs text-foreground-muted">
          <span
            className={`px-2 py-0.5 rounded-full font-medium ${
              thread.status === "open" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
            }`}
          >
            {thread.status}
          </span>
          {listing && (
            <Link href={`/bewertung?id=${thread.listing_id}`} className="text-primary hover:underline">
              {listing.make} {listing.model} · {listing.year}
            </Link>
          )}
          <span>Kunde: {thread.customer_id.slice(0, 8)}…</span>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-6">
        {messages?.map((m) => {
          const isAdmin = m.sender_id !== thread.customer_id;
          return (
            <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isAdmin
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-white border border-border text-foreground rounded-bl-sm"
                }`}
              >
                <div>{m.body}</div>
                <div className={`text-xs mt-1 ${isAdmin ? "text-white/60" : "text-foreground-muted"}`}>
                  {new Date(m.created_at).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}
                  {" · "}
                  {isAdmin ? "Admin" : "Kunde"}
                </div>
              </div>
            </div>
          );
        })}
        {!messages?.length && (
          <p className="text-sm text-foreground-muted text-center py-8">
            Noch keine Nachrichten in diesem Thread.
          </p>
        )}
      </div>

      {/* Reply form */}
      {thread.status === "open" && (
        <form
          action={async (formData: FormData) => {
            "use server";
            const body = (formData.get("body") as string)?.trim();
            if (!body || !me) return;
            const svc = getServiceClient();
            await svc.from("messages").insert({
              thread_id: threadId,
              sender_id: me.id,
              body,
            });
            revalidatePath(`/admin/chat/${threadId}`);
          }}
          className="flex gap-2"
        >
          <input
            name="body"
            required
            placeholder="Antwort schreiben…"
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Senden
          </button>
        </form>
      )}
    </div>
  );
}
