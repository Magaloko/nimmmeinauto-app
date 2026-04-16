"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Navbar } from "../../components/navbar";
import { supabase, type Listing, type Offer } from "@/lib/supabase";

type ListingWithOffers = Listing & { offers: Offer[] };

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

export default function SellerPage() {
  const [listings, setListings] = useState<ListingWithOffers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("listings")
        .select("*, offers(*)")
        .order("created_at", { ascending: false })
        .limit(10);
      setListings((data as ListingWithOffers[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const totalOffers = listings.reduce((sum, l) => sum + (l.offers?.length ?? 0), 0);
  const activeListings = listings.filter((l) => l.status === "ACTIVE").length;

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
              <div className="text-3xl font-bold text-primary">{loading ? "—" : activeListings}</div>
              <div className="text-sm text-muted-foreground mt-1">Aktive Inserate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-bold text-green-600">{loading ? "—" : totalOffers}</div>
              <div className="text-sm text-muted-foreground mt-1">Angebote erhalten</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-bold text-foreground">{loading ? "—" : listings.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Inserate gesamt</div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-3xl mb-3">⏳</div>
            <p>Lade Inserate...</p>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold mb-2">Noch keine Inserate</h3>
              <p className="text-muted-foreground mb-6">Erstelle dein erstes Inserat und erhalte Angebote von Händlern.</p>
              <Link href="/auto-bewerten">
                <Button>Jetzt Fahrzeug bewerten</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && listings.length > 0 && (
          <div className="space-y-6">
            {listings.map((listing) => {
              const createdDate = new Date(listing.created_at).toLocaleDateString("de-AT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              const offerCount = listing.offers?.length ?? 0;

              return (
                <Card key={listing.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <CardTitle className="text-xl">
                            {listing.make} {listing.model} {listing.year}
                          </CardTitle>
                          <Badge className={`border-0 text-xs ${listing.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                            {listing.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Inserat erstellt am {createdDate} · PLZ {listing.postal_code}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{formatEur(listing.estimated_value_cents)}</div>
                        <div className="text-xs text-muted-foreground">Schätzwert</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-5">
                      <Badge className="bg-gray-100 text-gray-700 border-0">{listing.mileage.toLocaleString("de-AT")} km</Badge>
                      <Badge className="bg-gray-100 text-gray-700 border-0">{conditionLabels[listing.condition] ?? listing.condition}</Badge>
                      <Badge className="bg-gray-100 text-gray-700 border-0">{fuelLabels[listing.fuel] ?? listing.fuel}</Badge>
                      {listing.has_accident_history && <Badge className="bg-red-100 text-red-700 border-0">Unfallfahrzeug</Badge>}
                    </div>

                    {/* Offers table */}
                    {offerCount > 0 ? (
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-border flex items-center justify-between">
                          <span className="font-semibold text-sm">Händlerangebote</span>
                          <Badge className="bg-blue-100 text-blue-700 border-0">{offerCount} Angebote</Badge>
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
                            {listing.offers.map((offer) => (
                              <tr key={offer.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium">{offer.dealer_name}</td>
                                <td className="px-4 py-3 text-right font-semibold text-green-600">{formatEur(offer.amount_cents)}</td>
                                <td className="px-4 py-3 text-center">
                                  {offer.status === "ACCEPTED" ? (
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
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                        Noch keine Angebote — Händler werden benachrichtigt.
                      </div>
                    )}

                    <div className="flex gap-3 mt-5">
                      <Link href={`/bewertung?id=${listing.id}`}>
                        <Button variant="outline" size="sm">Angebote ansehen</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Tips */}
        <Card className="bg-accent border-accent mt-8">
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
