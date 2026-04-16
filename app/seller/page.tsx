"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Navbar } from "../../components/navbar";

interface ListingData {
  make: string;
  model: string;
  year: string;
  fuel: string;
  mileage: string;
  condition: string;
  firstName: string;
  lastName: string;
  plz: string;
  value: number;
  createdAt?: string;
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

function formatEur(cents: number): string {
  return (cents / 100).toLocaleString("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

const MOCK_LISTING: ListingData = {
  make: "Volkswagen",
  model: "Golf",
  year: "2019",
  fuel: "benzin",
  mileage: "82000",
  condition: "GOOD",
  firstName: "Max",
  lastName: "Mustermann",
  plz: "1010",
  value: 1540000,
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

const MOCK_OFFERS = [
  { dealer: "Autohaus Müller Wien", amount: 1416800, status: "ANGENOMMEN" as const },
  { dealer: "Fahrzeugcenter Graz GmbH", amount: 1355200, status: "AUSSTEHEND" as const },
  { dealer: "AutoGroup Salzburg", amount: 1309000, status: "AUSSTEHEND" as const },
];

export default function SellerPage() {
  const [listing, setListing] = useState<ListingData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nimm_listing");
      setListing(raw ? (JSON.parse(raw) as ListingData) : MOCK_LISTING);
    } catch {
      setListing(MOCK_LISTING);
    }
  }, []);

  const data = listing ?? MOCK_LISTING;
  const createdDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";

  const offers = listing
    ? [
        { dealer: "Autohaus Müller Wien", amount: Math.round(listing.value * 0.92), status: "ANGENOMMEN" as const },
        { dealer: "Fahrzeugcenter Graz GmbH", amount: Math.round(listing.value * 0.88), status: "AUSSTEHEND" as const },
        { dealer: "AutoGroup Salzburg", amount: Math.round(listing.value * 0.85), status: "AUSSTEHEND" as const },
      ]
    : MOCK_OFFERS;

  return (
    <div className="min-h-screen bg-background">
      <Navbar app="nimm" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Meine Inserate</h1>
            <p className="text-muted-foreground mt-1">Übersicht aller deiner Fahrzeugangebote</p>
          </div>
          <Link href="/auto-bewerten">
            <Button>+ Neues Inserat</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-bold text-primary">1</div>
              <div className="text-sm text-muted-foreground mt-1">Aktive Inserate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-bold text-green-600">3</div>
              <div className="text-sm text-muted-foreground mt-1">Angebote erhalten</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-bold text-foreground">{formatEur(data.value)}</div>
              <div className="text-sm text-muted-foreground mt-1">Geschätzter Wert</div>
            </CardContent>
          </Card>
        </div>

        {/* Listing card */}
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <CardTitle className="text-xl">
                    {data.make} {data.model} {data.year}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">AKTIV</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Inserat erstellt am {createdDate} · PLZ {data.plz}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{formatEur(data.value)}</div>
                <div className="text-xs text-muted-foreground">Schätzwert</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge className="bg-gray-100 text-gray-700 border-0">{Number(data.mileage).toLocaleString("de-AT")} km</Badge>
              <Badge className="bg-gray-100 text-gray-700 border-0">{conditionLabels[data.condition] ?? data.condition}</Badge>
              <Badge className="bg-gray-100 text-gray-700 border-0">{fuelLabels[data.fuel] ?? data.fuel}</Badge>
            </div>

            {/* Offers table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm">Händlerangebote</span>
                <Badge className="bg-blue-100 text-blue-700 border-0">{offers.length} Angebote</Badge>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="text-left px-4 py-2 text-muted-foreground font-medium">Händler</th>
                    <th className="text-right px-4 py-2 text-muted-foreground font-medium">Angebot</th>
                    <th className="text-center px-4 py-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.dealer} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{offer.dealer}</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">{formatEur(offer.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        {offer.status === "ANGENOMMEN" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            ✓ ANGENOMMEN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                            ⏳ AUSSTEHEND
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 mt-5">
              <Link href="/bewertung">
                <Button variant="outline" size="sm">Angebote ansehen</Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => {
                  if (confirm("Inserat wirklich löschen?")) {
                    localStorage.removeItem("nimm_listing");
                    setListing(null);
                  }
                }}
              >
                Inserat löschen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-accent border-accent">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold mb-1">Tipp: Bessere Angebote erhalten</h3>
                <p className="text-sm text-muted-foreground">
                  Füge Fotos hinzu, um bis zu 25% mehr Angebote zu erhalten. Händler bevorzugen Inserate mit vollständiger Dokumentation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
