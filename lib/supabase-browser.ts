"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser-seitiger Supabase-Client mit Cookie-basierter Session.
// Nur in Client-Components oder Client-Hooks verwenden.
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
