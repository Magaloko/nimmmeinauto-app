import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Ratgeber · NimmMeinAuto",
  description:
    "Aktuelle Artikel rund um Fahrzeugverkauf, Bewertung, NoVA und Gebrauchtwagen in Österreich.",
  alternates: { canonical: "https://nimmmeinauto.at/ratgeber" },
  robots: { index: true, follow: true },
};

export default function RatgeberPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-16">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Ratgeber</h1>
          <p className="text-foreground-muted max-w-2xl">
            Praxisnahe Artikel zu Fahrzeugverkauf, Bewertung, NoVA und Rechtsfragen
            rund um Gebrauchtwagen in Österreich.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              href={`/ratgeber/${a.slug}`}
              className="group block p-6 rounded-xl bg-white border border-border hover:shadow-hover transition-shadow"
            >
              <div className="flex items-center gap-2 text-xs font-semibold mb-3">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{a.category}</span>
                <span className="text-foreground-muted">· {a.readMinutes} min</span>
              </div>
              <h2 className="font-semibold text-foreground text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                {a.title}
              </h2>
              <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
                {a.description}
              </p>
              <div className="text-xs text-foreground-muted mt-4">
                {new Date(a.publishedAt).toLocaleDateString("de-AT", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
