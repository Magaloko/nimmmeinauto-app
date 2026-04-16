"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Label } from "@/components/ui";
import { Navbar } from "../../components/navbar";

function formatEur(cents: number): string {
  return (cents / 100).toLocaleString("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

interface CarRequest {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  fuel: string;
  plz: string;
  city: string;
  distance: number;
  estimatedValue: number;
  hasAccident: boolean;
  createdAt: string;
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
};

const MOCK_REQUESTS: CarRequest[] = [
  {
    id: "req-001",
    make: "Volkswagen",
    model: "Golf",
    year: 2019,
    mileage: 82000,
    condition: "GOOD",
    fuel: "benzin",
    plz: "1010",
    city: "Wien",
    distance: 12,
    estimatedValue: 1540000,
    hasAccident: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-002",
    make: "BMW",
    model: "3er",
    year: 2017,
    mileage: 115000,
    condition: "GOOD",
    fuel: "diesel",
    plz: "1220",
    city: "Wien",
    distance: 18,
    estimatedValue: 2100000,
    hasAccident: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req-003",
    make: "Skoda",
    model: "Octavia",
    year: 2020,
    mileage: 61000,
    condition: "EXCELLENT",
    fuel: "benzin",
    plz: "2340",
    city: "Mödling",
    distance: 25,
    estimatedValue: 1780000,
    hasAccident: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Vor wenigen Minuten";
  if (h === 1) return "Vor 1 Stunde";
  return `Vor ${h} Stunden`;
}

export default function DealerPage() {
  const [openOffer, setOpenOffer] = useState<string | null>(null);
  const [offerAmounts, setOfferAmounts] = useState<Record<string, string>>({});
  const [submittedOffers, setSubmittedOffers] = useState<Record<string, number>>({});
  const [offerErrors, setOfferErrors] = useState<Record<string, string>>({});

  function handleSubmitOffer(req: CarRequest) {
    const raw = offerAmounts[req.id];
    const amount = Number(raw?.replace(/[^0-9]/g, ""));
    if (!amount || amount < 100) {
      setOfferErrors((prev) => ({ ...prev, [req.id]: "Bitte gültigen Betrag eingeben (mind. € 100)" }));
      return;
    }
    // Store in cents
    setSubmittedOffers((prev) => ({ ...prev, [req.id]: amount * 100 }));
    setOpenOffer(null);
    setOfferErrors((prev) => { const n = { ...prev }; delete n[req.id]; return n; });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar app="nimm" />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Händler-Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Neue Kaufanfragen in deiner Nähe — mach dein Angebot.
            </p>
          </div>
          <div className="text-right">
            <div className="bg-accent border border-primary/20 rounded-lg px-4 py-2">
              <div className="text-xs text-muted-foreground">Angemeldet als</div>
              <div className="font-semibold text-sm">Autohaus Müller Wien</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Neue Anfragen", value: "3", color: "text-primary" },
            { label: "Abgegebene Angebote", value: Object.keys(submittedOffers).length.toString(), color: "text-green-600" },
            { label: "Angenommene Angebote", value: "12", color: "text-foreground" },
            { label: "Ø Angebotspreis", value: "€ 18.200", color: "text-foreground" },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-5 text-center">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Requests */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Neue Anfragen</h2>
          <Badge className="bg-red-100 text-red-700 border-0">{MOCK_REQUESTS.length} neu</Badge>
        </div>

        <div className="space-y-5">
          {MOCK_REQUESTS.map((req) => {
            const submitted = submittedOffers[req.id];
            const isOpen = openOffer === req.id;

            return (
              <Card key={req.id} className={`transition-all ${submitted ? "border-green-300" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          {req.make} {req.model} {req.year}
                        </CardTitle>
                        {submitted ? (
                          <Badge className="bg-green-100 text-green-700 border-0">Angebot abgegeben</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700 border-0">Neu</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {timeAgo(req.createdAt)} · {req.city} ({req.plz}) · {req.distance} km von dir
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Schätzwert</div>
                      <div className="text-xl font-bold text-green-600">{formatEur(req.estimatedValue)}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Car details */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gray-100 text-gray-700 border-0">
                      {req.mileage.toLocaleString("de-AT")} km
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-700 border-0">
                      {conditionLabels[req.condition] ?? req.condition}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-700 border-0">
                      {fuelLabels[req.fuel] ?? req.fuel}
                    </Badge>
                    {req.hasAccident && (
                      <Badge className="bg-red-100 text-red-700 border-0">Unfallfahrzeug</Badge>
                    )}
                    <Badge className="bg-gray-100 text-gray-700 border-0">
                      PLZ {req.plz}
                    </Badge>
                  </div>

                  {/* Suggested price range */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>Empfohlene Preisspanne:</span>
                      <span className="font-medium text-foreground">
                        {formatEur(Math.round(req.estimatedValue * 0.85))} – {formatEur(Math.round(req.estimatedValue * 0.93))}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Basierend auf aktuellen Marktdaten für {req.make} {req.model} {req.year}
                    </div>
                  </div>

                  {/* Submitted offer display */}
                  {submitted ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <span className="text-xl">✓</span>
                        <div>
                          <div className="font-semibold">Angebot abgegeben</div>
                          <div className="text-sm">Der Verkäufer wird benachrichtigt.</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-700">{formatEur(submitted)}</div>
                    </div>
                  ) : isOpen ? (
                    /* Inline offer form */
                    <div className="border-2 border-primary/30 rounded-lg p-4 bg-accent/30">
                      <h4 className="font-semibold mb-3">Angebot erstellen</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor={`offer-${req.id}`}>Ihr Angebotspreis (€)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">€</span>
                            <Input
                              id={`offer-${req.id}`}
                              type="number"
                              placeholder={String(Math.round(req.estimatedValue * 0.9 / 100))}
                              value={offerAmounts[req.id] ?? ""}
                              onChange={(e) => {
                                setOfferAmounts((prev) => ({ ...prev, [req.id]: e.target.value }));
                                setOfferErrors((prev) => { const n = { ...prev }; delete n[req.id]; return n; });
                              }}
                              className="pl-8"
                              min={100}
                            />
                          </div>
                          {offerErrors[req.id] && (
                            <p className="text-destructive text-xs">{offerErrors[req.id]}</p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Schätzwert: {formatEur(req.estimatedValue)} · Ihr Angebot wird direkt an den Verkäufer übermittelt.
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleSubmitOffer(req)} className="flex-1">
                            Angebot abgeben
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => { setOpenOffer(null); setOfferErrors((prev) => { const n = { ...prev }; delete n[req.id]; return n; }); }}
                          >
                            Abbrechen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button onClick={() => setOpenOffer(req.id)} className="flex-1">
                        Angebot erstellen
                      </Button>
                      <Button variant="outline" size="default">
                        Details ansehen
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state hint */}
        <Card className="mt-8 bg-accent border-accent">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-semibold mb-1">Mehr Anfragen in deiner Region</h3>
                <p className="text-sm text-muted-foreground">
                  Erweitere deinen Suchradius oder aktiviere Push-Benachrichtigungen, um keine Anfrage zu verpassen.
                  Im Demo-Modus werden Anfragen simuliert.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
