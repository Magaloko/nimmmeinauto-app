import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-seitiger Supabase-Client für Server Components, Route Handlers und Server Actions.
// Liest/schreibt die Session-Cookies über next/headers.
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components dürfen keine Cookies schreiben. Das ist OK –
            // die Session wird beim nächsten Request durch die Middleware refresht.
          }
        },
      },
    }
  );
}

export type UserRole = "kunde" | "bewerter" | "admin";

export interface SessionUser {
  id: string;
  email: string | null;
  role: UserRole;
  fullName: string | null;
}

// Gibt den eingeloggten User inklusive Rolle zurück, oder null.
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as UserRole) ?? "kunde",
    fullName: profile?.full_name ?? null,
  };
}
