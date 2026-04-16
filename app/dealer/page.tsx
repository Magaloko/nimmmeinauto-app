"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Label } from "@/components/ui";
import { Navbar } from "../../components/navbar";
import { supabase, type Listing } from "@/lib/supabase";
import { submitOffer } from "../actions";

function formatEur(cents: number): string {
  return (cents / 100).toLocaleString("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Vor wenigen Minuten";
  if (h === 1) return "Vor 1 Stunde";
  if (h < 24) return `Vor ${h} Stunden`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Vor 1 Tag" : `Vor ${d} Tagen`;
}

const DEALER_NAME = "Autohaus Müller Wien";

export default function DealerPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOffer, setOpenOffer] = useState<string | null>(null);
  const [offerAmounts, setOfferAmounts] = useState<Record<string, string>>({});
  const [offerMessages, setOfferMessages] = useState<Record<string, string>>({});
  const [submittedOffers, setSubmittedOffers] = useState<Record<string, number>>({});
  const [offerErrors, setOfferErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "ACTIVE")
        .order("created_at", { ascending: false })
        .limit(20);
      setListings(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmitOffer(listing: Listing) {
    const raw = offerAmounts[listing.id];
    const amount = Number(raw?.replace(/[^0-9]/g, ""));
    if (!amount || amount < 100) {
      setOfferErrors((prev) => ({ ...prev, [listing.id]: "Bitte gültigen Betrag eingeben (mind. € 100)" }));
      return;
    }

    setSubmitting(listing.id);
    try {
      await submitOffer({
        listing_id: listing.id,
        dealer_name: DEALER_NAME,
        amount_cents: amount * 100,
        message: offerMessages[listing.id] || undefined,
      });
      setSubmittedOffers((prev) => ({ ...prev, [listing.id]: amount * 100 }));
      setOpenOffer(null);
      setOfferErrors((prev) => { const n = { ...prev }; delete n[listing.id]; return n; });
    } catch {
      setOfferErrors((prev) => ({ ...prev, [listing.id]: "Fehler beim Speichern. Bitte erneut versuchen." }));
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar app="nimm" />

      {/* Professional header */}
      <div className="bg-[#1C1917] text-white py-8 px-4">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Händler-Dashboard</h1>
            <p className="text-stone-400 text-sm">
              Neue Kaufanfragen in deiner Nähe — mach dein Angebot.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
            <div className="text-xs text-stone-400 mb-0.5">Angemeldet als</div>
            <div className="font-semibold text-sm text-white">{DEALER_NAME}</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Neue Anfragen", value: loading ? "—" : listings.length.toString(), color: "text-primary", border: "border-l-primary" },
            { label: "Abgegebene Angebote", value: Object.keys(submittedOffers).length.toString(), color: "text-green-600", border: "border-l-green-500" },
            { label: "Angenommene Angebote", value: "—", color: "text-foreground", border: "border-l-border-strong" },
            { label: "Aktive Inserate (DB)", value: loading ? "—" : listings.length.toString(), color: "text-foreground", border: "border-l-border-strong" },
          ].map(({ label, value, color, border }) => (
            <Card key={label} className={`border-l-4 ${border}`}>
              <CardContent className="p-5">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-foreground-muted mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Requests header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Neue Anfragen</h2>
          {!loading && (
            <Badge className="bg-red-100 text-red-700 border-0 font-semibold">{listings.length} aktiv</Badge>
          )}
        </div>

        {loading && (
          <div className="text-center py-16 text-foreground-muted">
            <div className="text-3xl mb-3">⏳</div>
            <p>Lade Anfragen...</p>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <Card className="text-center py-16 shadow-card">
            <CardContent>
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Keine aktiven Anfragen</h3>
              <p className="text-foreground-muted text-sm">Momentan gibt es keine aktiven Inserate. Schau später wieder vorbei.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-5">
          {listings.map((listing) => {
            const submitted = submittedOffers[listing.id];
            const isOpen = openOffer === listing.id;
            const isSubmittingThis = submitting === listing.id;

            return (
              <Card key={listing.id} className={`shadow-card rounded-xl transition-all ${submitted ? "border-green-300" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <CardTitle className="text-lg text-foreground">
                          {listing.make} {listing.model} {listing.year}
                        </CardTitle>
                        {submitted ? (
                          <Badge className="bg-green-100 text-green-700 border-0 font-semibold">Angebot abgegeben</Badge>
                        ) : (
                          <Badge className="bg-primary/10 text-primary border-0 font-semibold">Neu</Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground-muted mt-1">
                        {timeAgo(listing.created_at)} · PLZ {listing.postal_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-foreground-muted mb-0.5">Schätzwert</div>
                      <div className="text-xl font-bold text-amber-dark">{formatEur(listing.estimated_value_cents)}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Car details */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-muted text-foreground-muted border-0">
                      {listing.mileage.toLocaleString("de-AT")} km
                    </Badge>
                    <Badge className="bg-muted text-foreground-muted border-0">
                      {conditionLabels[listing.condition] ?? listing.condition}
                    </Badge>
                    <Badge className="bg-muted text-foreground-muted border-0">
                      {fuelLabels[listing.fuel] ?? listing.fuel}
                    </Badge>
                    {listing.has_accident_history && (
                      <Badge className="bg-red-100 text-red-700 border-0">Unfallfahrzeug</Badge>
                    )}
                    <Badge className="bg-muted text-foreground-muted border-0">
                      PLZ {listing.postal_code}
                    </Badge>
                  </div>

                  {/* Suggested price range */}
                  <div className="bg-muted rounded-xl p-4 mb-4 text-sm">
                    <div className="flex justify-between text-foreground-muted mb-1">
                      <span>Empfohlene Preisspanne:</span>
                      <span className="font-semibold text-foreground">
                        {formatEur(Math.round(listing.estimated_value_cents * 0.85))} – {formatEur(Math.round(listing.estimated_value_cents * 0.93))}
                      </span>
                    </div>
                    <div className="text-xs text-foreground-muted">
                      Basierend auf aktuellen Marktdaten für {listing.make} {listing.model} {listing.year}
                    </div>
                  </div>

                  {/* Submitted offer display */}
                  {submitted ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3 text-green-700">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        </div>
                        <div>
                          <div className="font-semibold">Angebot gesendet!</div>
                          <div className="text-sm text-green-600">Der Verkäufer wird benachrichtigt.</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-700">{formatEur(submitted)}</div>
                    </div>
                  ) : isOpen ? (
                    /* Inline offer form */
                    <div className="border-2 border-primary/30 rounded-xl p-5 bg-primary/5">
                      <h4 className="font-semibold mb-4 text-foreground">Angebot erstellen</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor={`offer-${listing.id}`}>Ihr Angebotspreis (€)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted font-medium">€</span>
                            <Input
                              id={`offer-${listing.id}`}
                              type="number"
                              placeholder={String(Math.round(listing.estimated_value_cents * 0.9 / 100))}
                              value={offerAmounts[listing.id] ?? ""}
                              onChange={(e) => {
                                setOfferAmounts((prev) => ({ ...prev, [listing.id]: e.target.value }));
                                setOfferErrors((prev) => { const n = { ...prev }; delete n[listing.id]; return n; });
                              }}
                              className="pl-8"
                              min={100}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`msg-${listing.id}`}>Nachricht an Verkäufer (optional)</Label>
                          <Input
                            id={`msg-${listing.id}`}
                            type="text"
                            placeholder="z.B. Sofortige Abholung möglich"
                            value={offerMessages[listing.id] ?? ""}
                            onChange={(e) => setOfferMessages((prev) => ({ ...prev, [listing.id]: e.target.value }))}
                          />
                        </div>
                        {offerErrors[listing.id] && (
                          <p className="text-destructive text-xs">{offerErrors[listing.id]}</p>
                        )}
                        <div className="text-xs text-foreground-muted">
                          Schätzwert: {formatEur(listing.estimated_value_cents)} · Ihr Angebot wird direkt an den Verkäufer übermittelt.
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmitOffer(listing)}
                            disabled={isSubmittingThis}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold"
                          >
                            {isSubmittingThis ? "Wird gespeichert..." : "Angebot abgeben"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setOpenOffer(null);
                              setOfferErrors((prev) => { const n = { ...prev }; delete n[listing.id]; return n; });
                            }}
                          >
                            Abbrechen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setOpenOffer(listing.id)}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold"
                      >
                        Angebot erstellen
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state hint */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-semibold mb-1 text-foreground">Mehr Anfragen in deiner Region</h3>
                <p className="text-sm text-foreground-muted">
                  Erweitere deinen Suchradius oder aktiviere Push-Benachrichtigungen, um keine Anfrage zu verpassen.
                  Alle Inserate werden direkt aus der Datenbank geladen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
