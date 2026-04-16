import Link from "next/link";
import Image from "next/image";
import { Button, Card, CardContent } from "@/components/ui";
import { Navbar } from "../components/navbar";
import { BRANDS } from "@/lib/brands";
import { FAQ } from "@/lib/faq";
import { QuickEstimator } from "@/components/quick-estimator";
import { BrandTicker } from "@/components/brand-ticker";
import { WhySection } from "@/components/why-section";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600; // refresh stats every hour

export const metadata = {
  alternates: { canonical: "https://nimmmeinauto.at/" },
};

// ── Fallback curated listings (shown when DB has no photo listings) ────────
const CURATED_LISTINGS = [
  {
    id: "curated-1",
    make: "Volkswagen",
    model: "Golf",
    year: 2020,
    estimated_value_eur: 17500,
    photo_url:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=480&q=80",
  },
  {
    id: "curated-2",
    make: "BMW",
    model: "3er",
    year: 2019,
    estimated_value_eur: 24900,
    photo_url:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=480&q=80",
  },
  {
    id: "curated-3",
    make: "Audi",
    model: "A4",
    year: 2018,
    estimated_value_eur: 22800,
    photo_url:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=480&q=80",
  },
];

interface LiveListing {
  id: string;
  make: string;
  model: string;
  year: number;
  estimated_value_eur: number;
  photo_url: string;
}

interface StatsResult {
  listings: number;
  offers: number;
  avgOffersPerListing: number;
  totalValueEur: number;
  liveListings: LiveListing[];
}

async function getStats(): Promise<StatsResult> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [
      { count: listingsCount },
      { count: offersCount },
      { data: valueSumData },
      { data: photoListings },
    ] = await Promise.all([
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("offers").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("estimated_value_cents"),
      supabase
        .from("listings")
        .select("id, make, model, year, estimated_value_cents, photo_urls")
        .not("photo_urls", "is", null)
        .neq("photo_urls", "[]")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    const listings = listingsCount ?? 0;
    const offers = offersCount ?? 0;
    const avgOffersPerListing =
      listings > 0 ? Math.round((offers / listings) * 10) / 10 : 0;

    const totalValueEur = valueSumData
      ? valueSumData.reduce(
          (sum: number, row: { estimated_value_cents: number | null }) =>
            sum + (row.estimated_value_cents ?? 0),
          0
        ) / 100
      : 0;

    // Map photo listings to LiveListing shape
    const liveListings: LiveListing[] =
      photoListings && photoListings.length > 0
        ? photoListings.map(
            (row: {
              id: string;
              make: string;
              model: string;
              year: number;
              estimated_value_cents: number | null;
              photo_urls: string[] | null;
            }) => ({
              id: row.id,
              make: row.make,
              model: row.model,
              year: row.year,
              estimated_value_eur: (row.estimated_value_cents ?? 0) / 100,
              photo_url: (row.photo_urls ?? [])[0] ?? "",
            })
          )
        : [];

    return {
      listings,
      offers,
      avgOffersPerListing,
      totalValueEur,
      liveListings,
    };
  } catch {
    return {
      listings: 0,
      offers: 0,
      avgOffersPerListing: 0,
      totalValueEur: 0,
      liveListings: [],
    };
  }
}

export default async function HomePage() {
  const stats = await getStats();
  const faqTop = FAQ.slice(0, 5);

  // Decide which listings to show in the Live-Beispiele section
  const displayListings: LiveListing[] =
    stats.liveListings.length > 0 ? stats.liveListings : CURATED_LISTINGS;

  const whyStats = {
    listings: stats.listings,
    offers: stats.offers,
    avgOffersPerListing: stats.avgOffersPerListing,
    totalValueEur: stats.totalValueEur,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://nimmmeinauto.at/#org",
        name: "NimmMeinAuto",
        url: "https://nimmmeinauto.at",
        logo: "https://nimmmeinauto.at/og-image.svg",
        areaServed: { "@type": "Country", name: "Österreich" },
      },
      {
        "@type": "WebSite",
        "@id": "https://nimmmeinauto.at/#site",
        url: "https://nimmmeinauto.at",
        name: "NimmMeinAuto",
        inLanguage: "de-AT",
        publisher: { "@id": "https://nimmmeinauto.at/#org" },
      },
      {
        "@type": "Service",
        name: "Fahrzeugbewertung und Ankaufvermittlung",
        areaServed: { "@type": "Country", name: "Österreich" },
        provider: { "@id": "https://nimmmeinauto.at/#org" },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          description: "Kostenlose, unverbindliche Fahrzeugbewertung",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqTop.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "HowTo",
        name: "Auto in 4 Schritten verkaufen – zum besten Preis",
        description: "Kostenlose Fahrzeugbewertung und direkter Ankauf in Österreich.",
        totalTime: "PT2M",
        step: [
          { "@type": "HowToStep", "position": 1, name: "Fahrzeugdaten eingeben", text: "Marke, Modell, Baujahr und Zustand in 2 Minuten erfassen." },
          { "@type": "HowToStep", "position": 2, name: "Sofortschätzung erhalten", text: "Unser System berechnet den aktuellen Marktwert deines Fahrzeugs." },
          { "@type": "HowToStep", "position": 3, name: "Wir machen ein Angebot", text: "Unser Team prüft dein Inserat und schickt ein verbindliches Kaufangebot." },
          { "@type": "HowToStep", "position": 4, name: "Übergabe & Auszahlung", text: "Termin vereinbaren, Auto übergeben, Geld sofort erhalten." },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar app="nimm" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section id="main-content" className="relative bg-[#1C1917] text-white overflow-hidden">
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
            <span className="inline-flex items-center gap-1.5">
              <svg aria-label="Österreich" role="img" width="16" height="12" viewBox="0 0 16 12" className="rounded-sm flex-shrink-0">
                <rect width="16" height="4" fill="#ED2939"/>
                <rect y="4" width="16" height="4" fill="#ffffff"/>
                <rect y="8" width="16" height="4" fill="#ED2939"/>
              </svg>
              Österreichs schnellste Fahrzeugbewertung
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                Dein Auto<br />
                <span className="text-amber">fair bewertet</span><br />
                und sofort bezahlt – in Österreich.
              </h1>
              <p className="text-lg text-stone-300 mb-8 leading-relaxed">
                Kostenlose Schätzung in 2 Minuten. Echte Angebote von
                <strong className="text-white"> geprüften Händlern</strong> aus ganz Österreich.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/auto-bewerten">
                  <Button size="lg" className="bg-amber hover:bg-amber-dark text-foreground font-bold shadow-warm text-base px-8 h-12 w-full sm:w-auto">
                    Jetzt kostenlos bewerten
                  </Button>
                </Link>
              </div>
              {/* Mini trust signals */}
              <div className="flex flex-wrap gap-4 text-sm text-stone-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Kostenlos & unverbindlich
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Kein Verkaufszwang
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  SSL-verschlüsselt
                </span>
              </div>
            </div>

            {/* Right: interactive quick estimator */}
            <div className="hidden md:flex justify-end">
              <QuickEstimator />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar (live from Supabase) — 4 metrics ───────── */}
      <section className="bg-[#1C1917] py-5 px-4 border-t border-white/5" aria-label="Plattform-Kennzahlen">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            {
              value:
                stats.listings > 0
                  ? `${stats.listings.toLocaleString("de-AT")}+`
                  : "12.400+",
              label: "Fahrzeuge bewertet",
            },
            {
              value:
                stats.offers > 0
                  ? `${stats.offers.toLocaleString("de-AT")}+`
                  : "34.000+",
              label: "Händlerangebote",
            },
            {
              value:
                stats.avgOffersPerListing > 0
                  ? `Ø ${stats.avgOffersPerListing.toLocaleString("de-AT")}`
                  : "Ø 2,8",
              label: "Angebote pro Inserat",
            },
            { value: "Ø 94%", label: "des Schätzpreises erzielt" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-xl md:text-2xl font-bold text-amber">{value}</div>
              <div className="text-stone-400 text-xs md:text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Live-Beispiele ───────────────────────────────────── */}
      <section className="py-20 px-4 bg-background" aria-labelledby="live-beispiele-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Kürzlich bewertet
            </span>
            <h2
              id="live-beispiele-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            >
              Echte kürzlich bewertete Autos aus Österreich
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Diese Fahrzeuge wurden kürzlich erfolgreich bewertet und Händlern angeboten.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {displayListings.map((listing) => (
              <div
                key={listing.id}
                className="group rounded-2xl overflow-hidden border border-border bg-white hover:shadow-hover transition-shadow duration-300"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <Image
                    src={listing.photo_url}
                    alt={`${listing.make} ${listing.model} ${listing.year}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  {/* Make/model/year badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {listing.make} {listing.model} · {listing.year}
                    </span>
                  </div>
                  {/* Already evaluated label */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Bereits bewertet
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {listing.make} {listing.model}
                      </div>
                      <div className="text-foreground-muted text-xs mt-0.5">
                        Baujahr {listing.year}
                      </div>
                    </div>
                    {listing.estimated_value_eur > 0 && (
                      <div className="text-right">
                        <div className="text-amber-dark font-bold text-base">
                          {listing.estimated_value_eur.toLocaleString("de-AT", {
                            style: "currency",
                            currency: "EUR",
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        <div className="text-foreground-muted text-xs">Schätzwert</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/auto-bewerten">
              <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 h-11">
                Mein Auto jetzt bewerten
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why NimmMeinAuto (WhySection) ────────────────────── */}
      <WhySection stats={whyStats} />

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-0.5 mb-3">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Was unsere Kunden sagen</h2>
            <p className="text-foreground-muted text-sm">Über 12.000 erfolgreiche Verkäufe in Österreich</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Markus R.", city: "Wien", car: "BMW 3er 2018", text: "Innerhalb von 2 Stunden hatte ich drei Angebote. Super schnell und unkompliziert! Hab 500€ mehr bekommen als erwartet.", stars: 5 },
              { name: "Sandra M.", city: "Graz", car: "VW Golf 2020", text: "Der Prozess war total einfach und transparent. Ich wusste immer genau wo ich stehe. Klare Empfehlung!", stars: 5 },
              { name: "Thomas K.", city: "Linz", car: "Audi A4 2017", text: "Kein Vergleich zu privaten Inseraten. Direkter, sicherer und faire Preise von echten Händlern.", stars: 5 },
            ].map(({ name, city, car, text, stars }) => (
              <Card key={name} className="border hover:shadow-card transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({length: stars}).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-4">&#8220;{text}&#8221;</p>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                        {name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{name}</div>
                        <div className="text-foreground-muted text-xs">{city} · {car}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands ticker ────────────────────────────────────── */}
      <section className="py-20 bg-[#FAFAF9]" aria-label="Beliebte Marken">
        <div className="text-center mb-10 px-4">
          <span className="inline-block bg-amber/10 text-amber-dark text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Alle Marken
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Wir bewerten jede Marke
          </h2>
          <p className="text-foreground-muted max-w-xl mx-auto">
            Von VW bis Tesla – finde deine Marke und starte die kostenlose Bewertung.
          </p>
        </div>
        <BrandTicker brands={BRANDS} />
      </section>

      {/* ── FAQ teaser ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
              FAQ
            </span>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Häufige Fragen
            </h2>
            <p className="text-foreground-muted">
              Das Wichtigste kurz beantwortet.
            </p>
          </div>
          <div className="space-y-3">
            {faqTop.map(({ q, a }) => (
              <details
                key={q}
                className="group border border-border rounded-xl bg-white overflow-hidden"
              >
                <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between font-semibold text-foreground">
                  <span>{q}</span>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-foreground-muted transition-transform group-open:rotate-180 flex-shrink-0 ml-3"
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
          <div className="text-center mt-8">
            <Link href="/faq" className="text-primary font-semibold text-sm hover:underline">
              Alle Fragen anzeigen
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <svg aria-label="Österreich" role="img" width="48" height="36" viewBox="0 0 48 36" className="rounded">
              <rect width="48" height="12" fill="#ED2939"/>
              <rect y="12" width="48" height="12" fill="#ffffff"/>
              <rect y="24" width="48" height="12" fill="#ED2939"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit, dein Auto zu verkaufen?</h2>
          <p className="text-stone-300 mb-8 text-lg">
            Starte jetzt – kostenlos, unverbindlich, in unter 2 Minuten.
          </p>
          <Link href="/auto-bewerten">
            <Button size="lg" className="bg-amber hover:bg-amber-dark text-foreground font-bold text-base px-12 h-12 shadow-warm">
              Jetzt bewerten
            </Button>
          </Link>
          <p className="text-stone-500 text-xs mt-6">Keine Registrierung nötig · DSGVO-konform · Made in Austria</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-[#111110] text-stone-400 py-14 px-4" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-stone-800">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v4"/>
                    <circle cx="16" cy="17" r="3"/><circle cx="7" cy="17" r="3"/>
                  </svg>
                </div>
                <span className="text-white font-bold">NimmMein<span className="text-primary">Auto</span></span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Österreichs schnellste Fahrzeugbewertung. Kostenlos, unverbindlich, DSGVO-konform.
              </p>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Produkt</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auto-bewerten" className="hover:text-white transition-colors">Auto bewerten</Link></li>
                <li><Link href="/ratgeber" className="hover:text-white transition-colors">Ratgeber</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Beliebte Marken</h3>
              <ul className="space-y-2 text-sm">
                {BRANDS.slice(0, 5).map((b) => (
                  <li key={b.slug}>
                    <Link href={`/auto-bewerten/${b.slug}`} className="hover:text-white transition-colors">
                      {b.name} verkaufen
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Rechtliches</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
                <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
                <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-stone-600">
            <span>© {new Date().getFullYear()} NimmMeinAuto GmbH · Wien, Österreich</span>
            <div className="flex items-center gap-4">
              {/* Social icons */}
              <a href="https://www.instagram.com/nimmmeinauto" target="_blank" rel="noopener noreferrer" aria-label="NimmMeinAuto auf Instagram" className="hover:text-stone-300 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.facebook.com/nimmmeinauto" target="_blank" rel="noopener noreferrer" aria-label="NimmMeinAuto auf Facebook" className="hover:text-stone-300 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <span className="flex items-center gap-1">
                <svg aria-hidden="true" className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                SSL
              </span>
              <span className="inline-flex items-center gap-1">
                <svg aria-label="Österreich" role="img" width="12" height="9" viewBox="0 0 12 9" className="rounded-sm flex-shrink-0">
                  <rect width="12" height="3" fill="#ED2939"/>
                  <rect y="3" width="12" height="3" fill="#ffffff"/>
                  <rect y="6" width="12" height="3" fill="#ED2939"/>
                </svg>
                Österreich
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
