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
    <div className="min-h-screen bg-background font-sans">
      <Navbar app="nimm" />

      {/* Dark mini-header */}
      <div className="bg-[#1C1917] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Meine Inserate</h1>
            <p className="text-stone-400 text-sm">Übersicht aller deiner Fahrzeugangebote</p>
          </div>
          <Link href="/auto-bewerten">
            <Button className="bg-amber hover:bg-amber-dark text-foreground font-semibold">+ Neues Inserat</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-primary">{loading ? "—" : activeListings}</div>
              <div className="text-sm text-foreground-muted mt-1">Aktive Inserate</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-amber-dark">{loading ? "—" : totalOffers}</div>
              <div className="text-sm text-foreground-muted mt-1">Angebote erhalten</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-border-strong">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-foreground">{loading ? "—" : listings.length}</div>
              <div className="text-sm text-foreground-muted mt-1">Inserate gesamt</div>
            </CardContent>
          </Card>
        </div>

        {loading && (
          <div className="text-center py-16 text-foreground-muted">
            <div className="text-3xl mb-3">⏳</div>
            <p>Lade Inserate...</p>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <Card className="text-center py-16 shadow-card">
            <CardContent>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Noch keine Inserate</h3>
              <p className="text-foreground-muted mb-6 text-sm">Erstelle dein erstes Inserat und erhalte Angebote von geprüften Händlern.</p>
              <Link href="/auto-bewerten">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold">Jetzt Fahrzeug bewerten</Button>
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
                <Card key={listing.id} className="shadow-card rounded-xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <CardTitle className="text-xl text-foreground">
                            {listing.make} {listing.model} {listing.year}
                          </CardTitle>
                          <Badge className={`border-0 text-xs font-semibold ${listing.status === "ACTIVE" ? "bg-amber/20 text-amber-dark" : "bg-muted text-foreground-muted"}`}>
                            {listing.status === "ACTIVE" ? "Aktiv" : listing.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground-muted">
                          Inserat erstellt am {createdDate} · PLZ {listing.postal_code}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-dark">{formatEur(listing.estimated_value_cents)}</div>
                        <div className="text-xs text-foreground-muted">Schätzwert</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-5">
                      <Badge className="bg-muted text-foreground-muted border-0">{listing.mileage.toLocaleString("de-AT")} km</Badge>
                      <Badge className="bg-muted text-foreground-muted border-0">{conditionLabels[listing.condition] ?? listing.condition}</Badge>
                      <Badge className="bg-muted text-foreground-muted border-0">{fuelLabels[listing.fuel] ?? listing.fuel}</Badge>
                      {listing.has_accident_history && <Badge className="bg-red-100 text-red-700 border-0">Unfallfahrzeug</Badge>}
                    </div>

                    {/* Offers table */}
                    {offerCount > 0 ? (
                      <div className="border border-border rounded-xl overflow-hidden">
                        <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
                          <span className="font-semibold text-sm text-foreground">Händlerangebote</span>
                          <Badge className="bg-primary/10 text-primary border-0">{offerCount} Angebote</Badge>
                        </div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border">
                              <th className="text-left px-4 py-2 text-foreground-muted font-medium">Händler</th>
                              <th className="text-right px-4 py-2 text-foreground-muted font-medium">Angebot</th>
                              <th className="text-center px-4 py-2 text-foreground-muted font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listing.offers.map((offer) => (
                              <tr key={offer.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium text-foreground">{offer.dealer_name}</td>
                                <td className="px-4 py-3 text-right font-semibold text-amber-dark">{formatEur(offer.amount_cents)}</td>
                                <td className="px-4 py-3 text-center">
                                  {offer.status === "ACCEPTED" ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                      ✓ ANGENOMMEN
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/20 text-amber-dark text-xs font-medium">
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
                      <div className="text-sm text-foreground-muted text-center py-4 border border-dashed border-border rounded-xl">
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
        <Card className="bg-primary/5 border-primary/20 mt-8">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold mb-1 text-foreground">Tipp: Bessere Angebote erhalten</h3>
                <p className="text-sm text-foreground-muted">
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
