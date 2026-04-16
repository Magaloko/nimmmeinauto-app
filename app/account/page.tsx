import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, Button } from "@/components/ui";
import { Navbar } from "@/components/navbar";
import { getSupabaseServer, getSessionUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  kunde: "Kunde",
  bewerter: "Bewerter",
  admin: "Administrator",
};

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  const supabase = await getSupabaseServer();
  const { data: listings } = await supabase
    .from("listings")
    .select("id, make, model, year, status, estimated_value_cents, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-8">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {ROLE_LABEL[user.role] ?? user.role}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
            Hallo {user.fullName || user.email || "👋"}
          </h1>
          <p className="text-foreground-muted">
            Hier findest du deine Inserate, Angebote und Nachrichten.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-foreground-muted uppercase tracking-wide">Inserate</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {listings?.length ?? 0}
              </div>
              <Link
                href="/auto-bewerten"
                className="text-sm text-primary font-medium hover:underline mt-2 inline-block"
              >
                Neues Auto bewerten →
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-foreground-muted uppercase tracking-wide">Nachrichten</div>
              <div className="text-2xl font-bold text-foreground mt-1">—</div>
              <p className="text-sm text-foreground-muted mt-2">Chat folgt in Kürze.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="text-xs text-foreground-muted uppercase tracking-wide">Rolle</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {ROLE_LABEL[user.role] ?? user.role}
              </div>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm text-primary font-medium hover:underline mt-2 inline-block"
                >
                  Zur Admin-Konsole →
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Deine Inserate</h2>
          {listings && listings.length > 0 ? (
            <div className="space-y-3">
              {listings.map((l) => (
                <Card key={l.id}>
                  <CardContent className="p-4 md:p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-foreground">
                        {l.make} {l.model} · {l.year}
                      </div>
                      <div className="text-sm text-foreground-muted">
                        Status: <span className="capitalize">{l.status}</span>
                        {l.estimated_value_cents ? (
                          <>
                            {" "}· Bewertung{" "}
                            <strong className="text-foreground">
                              € {(l.estimated_value_cents / 100).toLocaleString("de-AT")}
                            </strong>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <Link href={`/bewertung?id=${l.id}`}>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-foreground-muted mb-4">
                  Du hast noch keine Inserate erstellt.
                </p>
                <Link href="/auto-bewerten">
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    Jetzt kostenlos bewerten
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
