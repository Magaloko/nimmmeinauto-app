"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Navbar } from "../../components/navbar";
import { supabase, type Listing } from "@/lib/supabase";

const conditionLabels: Record<string, string> = {
  EXCELLENT: "Sehr gut",
  GOOD: "Gut",
  FAIR: "Gebraucht",
  DAMAGED: "Beschädigt",
};

const fuelLabels: Record<string, string> = {
  benzin: "Benzin",
  diesel: "Diesel",
  elektro: "Elektro",
  hybrid: "Hybrid",
  lpg: "LPG",
};

function formatEur(cents: number): string {
  return (cents / 100).toLocaleString("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

function BewertungContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setConfettiActive(true);
    const t1 = setTimeout(() => setConfettiActive(false), 3500);

    async function load() {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      setListing(data);
      setLoading(false);
    }

    load();
    return () => { clearTimeout(t1); };
  }, [id]);

  if (!id) {
    return (
      <div className="p-8 text-center">
        Keine Anfrage-ID gefunden.{" "}
        <a href="/auto-bewerten" className="text-primary underline">Neu starten</a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
              <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </div>
          <p>Lade deine Anfrage...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 text-center">
        Anfrage nicht gefunden.{" "}
        <a href="/auto-bewerten" className="text-primary underline">Neue Bewertung starten</a>
      </div>
    );
  }

  const value = listing.estimated_value_cents;
  const low = Math.round(value * 0.9);
  const high = Math.round(value * 1.1);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar app="nimm" />

      {/* CSS Confetti */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          <style>{`
            @keyframes confetti-fall {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
            .confetti-piece {
              position: absolute;
              width: 10px;
              height: 10px;
              animation: confetti-fall linear forwards;
            }
          `}</style>
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${2 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 1}s`,
                backgroundColor: ["#2563EB", "#22c55e", "#F59E0B", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Confirmation hero */}
        <Card className="border-2 border-amber/30 shadow-warm">
          <CardHeader className="text-center pb-2 bg-gradient-to-br from-amber/10 to-primary/10 rounded-t-xl">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl text-foreground">
              Deine Anfrage ist bei uns
            </CardTitle>
            <p className="text-foreground-muted mt-2 max-w-md mx-auto">
              Unser Team prüft dein Fahrzeug und meldet sich
              <strong className="text-foreground"> innerhalb von 24 Stunden</strong> mit deinem
              persönlichen Festpreis-Angebot per E-Mail und Telefon.
            </p>
          </CardHeader>

          <CardContent className="pt-6 pb-8">
            {/* Vehicle summary */}
            <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 text-center">
              Deine Anfrage
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
              <div className="bg-muted rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
                </div>
                <div className="text-xs font-medium text-foreground">{listing.make}</div>
                <div className="text-xs text-foreground-muted">{listing.model}</div>
              </div>
              <div className="bg-muted rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div className="text-xs font-medium text-foreground">{listing.year}</div>
                <div className="text-xs text-foreground-muted">Baujahr</div>
              </div>
              <div className="bg-muted rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <div className="text-xs font-medium text-foreground">{listing.mileage.toLocaleString("de-AT")} km</div>
                <div className="text-xs text-foreground-muted">{conditionLabels[listing.condition] ?? listing.condition}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge className="bg-blue-100 text-blue-700 border-0">{fuelLabels[listing.fuel] ?? listing.fuel}</Badge>
              <Badge className="bg-muted text-foreground-muted border-0">
                {listing.transmission === "auto" ? "Automatik" : "Schaltgetriebe"}
              </Badge>
              {listing.has_accident_history && <Badge className="bg-red-100 text-red-700 border-0">Unfallfahrzeug</Badge>}
              <Badge className="bg-green-100 text-green-700 border-0">PLZ {listing.postal_code}</Badge>
            </div>

            {/* Online orientation range — small and clearly non-binding */}
            {value > 0 && (
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 text-center">
                <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">
                  Unverbindliche Online-Orientierung
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {formatEur(low)} – {formatEur(high)}
                </div>
                <p className="text-xs text-foreground-muted mt-2 max-w-md mx-auto leading-relaxed">
                  Grobe Spanne auf Basis deiner Online-Angaben. Dein verbindliches
                  Festpreis-Angebot erhältst du nach Prüfung durch unser Team.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* What happens next */}
        <Card className="shadow-card">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-semibold text-lg text-foreground mb-5">So geht es weiter</h3>
            <ol className="space-y-5">
              {[
                {
                  title: "Wir prüfen deine Angaben",
                  desc: "Unser Team sichtet Fahrzeugdaten und Fotos und gleicht sie mit aktuellen Marktpreisen ab.",
                },
                {
                  title: "Dein Festpreis-Angebot kommt binnen 24 h",
                  desc: "Du bekommst per E-Mail und Telefon unser persönliches, verbindliches Kaufpreis-Angebot.",
                },
                {
                  title: "Termin zur Prüfung",
                  desc: "Wir vereinbaren einen kurzen Vor-Ort-Termin – bei dir zu Hause oder an einem unserer Standorte.",
                },
                {
                  title: "Übergabe & Auszahlung",
                  desc: "Bei Übergabe unterschreibt ihr den Kaufvertrag, wir überweisen den Kaufpreis sofort per Banküberweisung.",
                },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber text-foreground font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm md:text-base">{step.title}</div>
                    <div className="text-foreground-muted text-sm mt-0.5">{step.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Photos */}
        {listing.photo_urls && listing.photo_urls.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-4">
                Deine Fahrzeugfotos ({listing.photo_urls.length})
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {listing.photo_urls.map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-lg overflow-hidden border border-border bg-stone-100 hover:opacity-90 transition-opacity"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Fahrzeugfoto ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact box */}
        <Card className="shadow-card bg-[#1C1917] text-white border-0">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-semibold text-lg mb-2">Rückfragen?</h3>
            <p className="text-stone-300 text-sm mb-4">
              Falls du etwas zu deiner Anfrage ergänzen oder eine Frage hast, erreichst du uns direkt:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:nimmmeinauto@gmail.com"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                nimmmeinauto@gmail.com
              </a>
              <a
                href="https://t.me/nimmMeinAuto_Bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2AABEE] hover:bg-[#1d96d6] rounded-lg text-sm font-medium transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram-Bot
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              ← Zur Startseite
            </Button>
          </Link>
          <Link href="/auto-bewerten">
            <Button variant="outline" className="w-full sm:w-auto">
              Weiteres Fahrzeug bewerten
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-foreground-muted">
          Die unverbindliche Online-Orientierung basiert auf deinen Angaben. Verbindlich
          ist ausschließlich das Festpreis-Angebot, das du nach Prüfung durch unser Team erhältst.
        </p>
      </div>
    </div>
  );
}

export default function BewertungPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
              <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </div>
          <p>Laden...</p>
        </div>
      </div>
    }>
      <BewertungContent />
    </Suspense>
  );
}
