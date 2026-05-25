import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card, CardContent } from "@/components/ui";
import { Navbar } from "../../../components/navbar";
import { BRANDS, getBrand } from "@/lib/brands";

export const dynamicParams = false; // only pre-rendered slugs exist

export function generateStaticParams() {
  return BRANDS.map((b) => ({ marke: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ marke: string }>;
}): Promise<Metadata> {
  const { marke } = await params;
  const brand = getBrand(marke);
  if (!brand) return {};

  const title = `${brand.name} verkaufen in Österreich · Wir kaufen dein ${brand.name}`;
  const description = `Wir kaufen deinen ${brand.name} direkt – kostenlose Online-Bewertung in 2 Minuten, fairer Festpreis, sichere Auszahlung. Direktankauf in ganz Österreich.`;

  return {
    title,
    description,
    alternates: { canonical: `https://nimmmeinauto.at/auto-bewerten/${brand.slug}` },
    openGraph: {
      title,
      description,
      url: `https://nimmmeinauto.at/auto-bewerten/${brand.slug}`,
      locale: "de_AT",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ marke: string }>;
}) {
  const { marke } = await params;
  const brand = getBrand(marke);
  if (!brand) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${brand.name} Direktankauf`,
    areaServed: { "@type": "Country", name: "Österreich" },
    serviceType: "Fahrzeug-Direktankauf",
    provider: {
      "@type": "Organization",
      name: "NimmMeinAuto",
      url: "https://nimmmeinauto.at",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      description: "Kostenlose, unverbindliche Fahrzeugbewertung",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-[#1C1917] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 py-20">
          <nav aria-label="Brotkrume" className="text-sm text-stone-400 mb-6">
            <Link href="/" className="hover:text-white">Startseite</Link>
            <span className="mx-2">/</span>
            <Link href="/auto-bewerten" className="hover:text-white">Auto bewerten</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{brand.name}</span>
          </nav>
          {brand.hasLogo && (
            <div className="mb-6 inline-flex items-center justify-center h-16 px-5 bg-white/95 rounded-xl shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${brand.slug}.svg`}
                alt={`${brand.name} Logo`}
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 tracking-tight">
            Wir kaufen deinen {brand.name}<br />
            <span className="text-amber">direkt, fair und sicher.</span>
          </h1>
          <p className="text-lg text-stone-300 mb-8 max-w-2xl">
            Kostenlose Online-Bewertung in 2 Minuten, persönliches Festpreis-Angebot innerhalb von 24 Stunden, Auszahlung am Tag der Übergabe – ohne Inserate, ohne Verhandlungen.
          </p>
          <Link href="/auto-bewerten">
            <Button
              size="lg"
              className="bg-amber hover:bg-amber-dark text-foreground font-bold shadow-warm text-base px-8 h-12"
            >
              Jetzt {brand.name} bewerten
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular models */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Beliebte {brand.name} Modelle bei NimmMeinAuto
          </h2>
          <p className="text-foreground-muted mb-8 max-w-2xl">
            Wir bewerten alle Baujahre, Kilometerstände und Ausstattungsvarianten – vom aktuellen
            Modell bis zum Youngtimer.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {brand.models.map((model) => (
              <Card key={model} className="border hover:shadow-hover transition-shadow">
                <CardContent className="p-4">
                  <div className="font-semibold text-foreground">{brand.name} {model}</div>
                  <Link
                    href="/auto-bewerten"
                    className="text-primary text-sm font-medium mt-1 inline-block hover:underline"
                  >
                    Bewertung starten
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why us for this brand */}
      <section className="py-16 px-4 bg-[#FAFAF9]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-1">In 2 Minuten fertig</h3>
              <p className="text-sm text-foreground-muted">Daten eingeben, Bewertung erhalten – ohne Account.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-border">
              <div className="w-10 h-10 rounded-lg bg-amber/20 text-amber-dark flex items-center justify-center mb-4">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Ø {brand.avgPrice ?? "marktgerecht"}</h3>
              <p className="text-sm text-foreground-muted">Realistische {brand.name}-Preise auf Basis aktueller österreichischer Marktdaten.</p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-border">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Sichere Auszahlung</h3>
              <p className="text-sm text-foreground-muted">Bezahlung per Banküberweisung am Tag der Fahrzeugübergabe – kein Bargeld-Risiko.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Other brands */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-5">Andere Marken bewerten</h2>
          <div className="flex flex-wrap gap-2">
            {BRANDS.filter((b) => b.slug !== brand.slug).map((b) => (
              <Link
                key={b.slug}
                href={`/auto-bewerten/${b.slug}`}
                className="px-4 py-2 rounded-full border border-border bg-white text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
