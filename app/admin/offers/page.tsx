import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage() {
  const supabase = await getSupabaseServer();

  const { data: offers } = await supabase
    .from("offers")
    .select(
      "id, created_at, amount_cents, dealer_name, dealer_email, message, status, listing_id, listings(make, model, year)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const totalValueCents = offers?.reduce((sum, o) => sum + (o.amount_cents ?? 0), 0) ?? 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Angebote</h1>
      <p className="text-sm text-foreground-muted mb-6">
        Alle abgegebenen Händlerangebote.{" "}
        <span className="font-medium text-foreground">
          Gesamtvolumen: € {(totalValueCents / 100).toLocaleString("de-AT")}
        </span>
      </p>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-[#FAFAF9]">
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Händler</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Inserat</th>
              <th className="text-right px-4 py-3 text-xs text-foreground-muted font-medium">Betrag</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Nachricht</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Datum</th>
            </tr>
          </thead>
          <tbody>
            {offers?.map((o) => {
              const listing = Array.isArray(o.listings) ? o.listings[0] : o.listings;
              return (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-[#FAFAF9]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{o.dealer_name}</div>
                    {o.dealer_email && (
                      <div className="text-xs text-foreground-muted">{o.dealer_email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {listing ? (
                      <Link
                        href={`/bewertung?id=${o.listing_id}`}
                        className="text-primary hover:underline text-xs font-medium"
                      >
                        {listing.make} {listing.model} · {listing.year}
                      </Link>
                    ) : (
                      <span className="text-xs text-foreground-muted font-mono">{o.listing_id?.slice(0, 8)}…</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    € {(o.amount_cents / 100).toLocaleString("de-AT")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600">
                      {o.status ?? "offen"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted max-w-[200px] truncate">
                    {o.message || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground-muted whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString("de-AT")}
                  </td>
                </tr>
              );
            })}
            {!offers?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground-muted text-sm">
                  Noch keine Angebote vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
