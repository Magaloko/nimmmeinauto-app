import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "../../components/navbar";
import { Button } from "@/components/ui";
import { FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Häufige Fragen · NimmMeinAuto",
  description:
    "Antworten auf die häufigsten Fragen rund um die kostenlose Fahrzeugbewertung, den Verkauf an Händler und die Abwicklung in Österreich.",
  alternates: { canonical: "https://nimmmeinauto.at/faq" },
  robots: { index: true, follow: true },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Häufige Fragen</h1>
        <p className="text-foreground-muted mb-10">
          Alles, was du über NimmMeinAuto wissen musst – kurz und klar beantwortet.
        </p>

        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <details
              key={q}
              className="group border border-border rounded-xl bg-white overflow-hidden transition-shadow hover:shadow-soft"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between font-semibold text-foreground">
                <span>{q}</span>
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-foreground-muted transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-foreground-muted text-sm leading-relaxed">{a}</div>
            </details>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-xl text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Noch Fragen?</h2>
          <p className="text-foreground-muted text-sm mb-4">
            Starte einfach die Bewertung – sie ist kostenlos und unverbindlich.
          </p>
          <Link href="/auto-bewerten">
            <Button className="bg-primary hover:bg-primary-dark text-white font-semibold">
              Jetzt Auto bewerten
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

