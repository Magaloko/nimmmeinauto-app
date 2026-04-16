"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { Navbar } from "@/components/navbar";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("next") || "/account";
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-Mail oder Passwort falsch."
          : error.message
      );
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Anmelden</h1>
        <p className="text-sm text-foreground-muted mb-6">
          Willkommen zurück – melde dich an, um deine Inserate und Nachrichten zu sehen.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold"
          >
            {loading ? "Wird angemeldet…" : "Anmelden"}
          </Button>
        </form>
        <p className="text-sm text-foreground-muted mt-6 text-center">
          Noch kein Konto?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16">
        <Suspense fallback={<div className="text-center text-foreground-muted">Lädt…</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
