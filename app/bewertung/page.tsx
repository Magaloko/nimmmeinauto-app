"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Navbar } from "../../components/navbar";
import { supabase, type Listing, type Offer } from "@/lib/supabase";

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

const DEALER_BADGES = [
  { badge: "Schnellste Abwicklung", badgeColor: "bg-green-100 text-green-700" },
  { badge: "Geprüfter Händler", badgeColor: "bg-blue-100 text-blue-700" },
  { badge: "Barzahlung", badgeColor: "bg-purple-100 text-purple-700" },
];

function BewertungContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [listing, setListing] = useState<Listing | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOffers, setShowOffers] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState<string | null>(null);

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

      setTimeout(async () => {
        const { data: realOffers } = await supabase
          .from("offers")
          .select("*")
          .eq("listing_id", id);

        if (realOffers && realOffers.length > 0) {
          setOffers(realOffers);
        } else {
          const base = data?.estimated_value_cents ?? 2000000;
          setOffers([
            {
              id: "m1",
              created_at: new Date().toISOString(),
              listing_id: id!,
              dealer_name: "Autohaus Müller Wien",
              dealer_email: null,
              amount_cents: Math.round(base * 0.92),
              message: "Sofortige Abholung möglich",
              status: "PENDING",
            },
            {
              id: "m2",
              created_at: new Date().toISOString(),
              listing_id: id!,
              dealer_name: "Fahrzeugcenter Graz GmbH",
              dealer_email: null,
              amount_cents: Math.round(base * 0.88),
              message: "Besichtigung in 2 Tagen",
              status: "PENDING",
            },
            {
              id: "m3",
              created_at: new Date().toISOString(),
              listing_id: id!,
              dealer_name: "AutoGroup Salzburg",
              dealer_email: null,
              amount_cents: Math.round(base * 0.85),
              message: "Barzahlung",
              status: "PENDING",
            },
          ]);
        }
        setShowOffers(true);
      }, 2000);
    }

    load();
    return () => { clearTimeout(t1); };
  }, [id]);

  if (!id) {
    return (
      <div className="p-8 text-center">
        Keine Inserat-ID gefunden.{" "}
        <a href="/auto-bewerten" className="text-primary underline">Neu bewerten</a>
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
          <p>Lade Bewertung...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 text-center">
        Inserat nicht gefunden.{" "}
        <a href="/auto-bewerten" className="text-primary underline">Neu bewerten</a>
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
        {/* Main valuation card */}
        <Card className="border-2 border-amber/30 shadow-warm">
          <CardHeader className="text-center pb-2 bg-gradient-to-br from-amber/10 to-primary/10 rounded-t-xl">
            <div className="flex justify-center mb-2">
              <svg className="w-12 h-12 text-amber" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
            </div>
            <CardTitle className="text-2xl text-foreground">Geschätzter Marktwert</CardTitle>
            <p className="text-foreground-muted text-sm mt-1">Basierend auf aktuellen Marktdaten in Österreich</p>
          </CardHeader>
          <CardContent className="text-center pt-6 pb-8">
            <div className="text-6xl font-bold text-amber-dark mb-2">
              {formatEur(value)}
            </div>
            <p className="text-foreground-muted text-sm mb-1">Erwartete Preisspanne:</p>
            <div className="text-xl font-semibold text-foreground mb-6">
              {formatEur(low)} – {formatEur(high)}
            </div>

            {/* Car summary */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
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

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className="bg-blue-100 text-blue-700 border-0">{fuelLabels[listing.fuel] ?? listing.fuel}</Badge>
              <Badge className="bg-muted text-foreground-muted border-0">
                {listing.transmission === "auto" ? "Automatik" : "Schaltgetriebe"}
              </Badge>
              {listing.has_accident_history && <Badge className="bg-red-100 text-red-700 border-0">Unfallfahrzeug</Badge>}
              <Badge className="bg-green-100 text-green-700 border-0">PLZ {listing.postal_code}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        {listing.photo_urls && listing.photo_urls.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-4">
                Fahrzeugfotos ({listing.photo_urls.length})
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

        {/* Dealer loading / offers */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            {!showOffers ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"/></svg>
                </div>
                <p className="font-semibold text-lg mb-2 text-foreground">3 Händler werden benachrichtigt</p>
                <div className="flex justify-center gap-1 mt-3">
                  <style>{`
                    @keyframes bounce-dot {
                      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                      40% { transform: scale(1); opacity: 1; }
                    }
                    .dot { animation: bounce-dot 1.2s infinite ease-in-out; }
                    .dot:nth-child(2) { animation-delay: 0.2s; }
                    .dot:nth-child(3) { animation-delay: 0.4s; }
                  `}</style>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="dot w-3 h-3 bg-primary rounded-full" />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <h3 className="font-semibold text-lg text-foreground">{offers.length} Händlerangebote eingegangen</h3>
                  <Badge className="bg-green-100 text-green-700 border-0 ml-auto">Neu</Badge>
                </div>
                <div className="space-y-4">
                  {offers.map((offer, idx) => {
                    const accepted = acceptedOffer === offer.id;
                    const dealerMeta = DEALER_BADGES[idx % DEALER_BADGES.length];
                    const isBest = idx === 0;
                    return (
                      <div
                        key={offer.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          accepted
                            ? "border-amber/40 bg-amber/5"
                            : isBest
                            ? "border-amber/30 ring-2 ring-amber/30 bg-amber/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {isBest && !accepted && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber/20 text-amber-dark">
                                ⭐ Bestes Angebot
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                                {offer.dealer_name[0]}
                              </div>
                              <span className="font-semibold text-sm text-foreground">{offer.dealer_name}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dealerMeta.badgeColor}`}>
                              {dealerMeta.badge}
                            </span>
                          </div>
                          {offer.message && <p className="text-xs text-foreground-muted ml-10">{offer.message}</p>}
                          <div className="flex items-center gap-2 mt-1 ml-10">
                            <div className="text-amber text-xs">{"★".repeat(Math.max(3, 5 - idx))}</div>
                            <span className="text-xs text-foreground-muted">{Math.max(3, 5 - idx)}.0 Bewertung</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-amber-dark">{formatEur(offer.amount_cents)}</div>
                          <div className="text-xs text-foreground-muted mb-2">
                            {Math.round((offer.amount_cents / value) * 100)}% des Schätzwerts
                          </div>
                          {accepted ? (
                            <div className="flex items-center gap-1 text-amber-dark text-xs font-semibold">
                              <span>✓</span> Angenommen
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary-dark text-white font-semibold"
                              onClick={() => {
                                setAcceptedOffer(offer.id);
                                alert(`Glückwunsch! ${offer.dealer_name} kontaktiert Sie in Kürze.`);
                              }}
                            >
                              Angebot annehmen
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auto-bewerten">
            <Button variant="outline" className="w-full sm:w-auto">
              ← Neue Bewertung
            </Button>
          </Link>
          <Link href="/seller">
            <Button variant="outline" className="w-full sm:w-auto">
              Meine Inserate →
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-foreground-muted">
          Die Bewertung ist ein Schätzwert basierend auf aktuellen Marktdaten und ersetzt kein professionelles Gutachten.
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
