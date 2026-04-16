"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { Navbar } from "@/components/navbar";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!accepted) {
      setError("Bitte AGB und Datenschutzerklärung akzeptieren.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Mit E-Mail-Bestätigung: session === null → User muss Mail bestätigen.
    // Ohne E-Mail-Bestätigung: session vorhanden → direkt weiter.
    if (data.session) {
      router.push("/account");
      router.refresh();
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Konto erstellen</h1>
            <p className="text-sm text-foreground-muted mb-6">
              Kostenlos registrieren, um Inserate, Angebote und den Chat zu nutzen.
            </p>

            {sent ? (
              <div className="text-sm text-foreground bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                Wir haben dir eine Bestätigungs-Mail an <strong>{email}</strong> geschickt.
                Bitte klicke den Link, um dein Konto zu aktivieren.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                    Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <p className="text-xs text-foreground-muted mt-1">Mindestens 8 Zeichen.</p>
                </div>
                <label className="flex items-start gap-2 text-sm text-foreground-muted">
                  <input
                    type="checkbox"
                    required
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Ich akzeptiere die{" "}
                    <Link href="/agb" className="text-primary hover:underline">AGB</Link>
                    {" "}und habe die{" "}
                    <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>
                    {" "}gelesen.
                  </span>
                </label>
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
                  {loading ? "Wird erstellt…" : "Konto erstellen"}
                </Button>
              </form>
            )}

            <p className="text-sm text-foreground-muted mt-6 text-center">
              Bereits registriert?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Zur Anmeldung
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
