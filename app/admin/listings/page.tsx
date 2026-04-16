import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase-server";
import { setListingStatus } from "../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "live", "sold", "archived"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  live: "bg-green-100 text-green-700",
  sold: "bg-blue-100 text-blue-700",
  archived: "bg-stone-100 text-stone-500",
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await getSupabaseServer();

  let query = supabase
    .from("listings")
    .select(
      "id, make, model, year, mileage, fuel, condition, status, estimated_value_cents, first_name, last_name, email, phone, postal_code, created_at, notes"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status && STATUSES.includes(status as typeof STATUSES[number])) {
    query = query.eq("status", status);
  }

  const { data: listings } = await query;

  const filtered = q
    ? listings?.filter(
        (l) =>
          `${l.make} ${l.model} ${l.first_name} ${l.last_name} ${l.email}`
            .toLowerCase()
            .includes(q.toLowerCase())
      )
    : listings;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Inserate</h1>
      <p className="text-sm text-foreground-muted mb-6">
        Alle eingereichten Fahrzeugbewertungen – Status setzen, Details prüfen.
      </p>

      {/* Filters */}
      <form method="GET" className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          name="q"
          defaultValue={q}
          placeholder="Marke, Name, E-Mail…"
          className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-60"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Alle Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Filtern
        </button>
        {(status || q) && (
          <Link href="/admin/listings" className="text-xs text-foreground-muted hover:underline">
            Filter zurücksetzen
          </Link>
        )}
      </form>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-[#FAFAF9]">
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Fahrzeug</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Einreicher</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Details</th>
              <th className="text-right px-4 py-3 text-xs text-foreground-muted font-medium">Bewertung</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Status setzen</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Datum</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-[#FAFAF9]">
                <td className="px-4 py-3">
                  <Link
                    href={`/bewertung?id=${l.id}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {l.make} {l.model}
                  </Link>
                  <div className="text-xs text-foreground-muted">
                    {l.year} · {l.mileage?.toLocaleString("de-AT")} km · {l.fuel}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{l.first_name} {l.last_name}</div>
                  <div className="text-xs text-foreground-muted">{l.email}</div>
                  <div className="text-xs text-foreground-muted">{l.phone}</div>
                </td>
                <td className="px-4 py-3 text-xs text-foreground-muted">
                  <div>{l.condition}</div>
                  <div>PLZ {l.postal_code}</div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {l.estimated_value_cents
                    ? `€ ${(l.estimated_value_cents / 100).toLocaleString("de-AT")}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[l.status] ?? ""}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const s = formData.get("status") as typeof STATUSES[number];
                      await setListingStatus(l.id, s);
                    }}
                    className="flex items-center gap-1"
                  >
                    <select
                      name="status"
                      defaultValue={l.status}
                      className="px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-2 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary-dark"
                    >
                      OK
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-xs text-foreground-muted whitespace-nowrap">
                  {new Date(l.created_at).toLocaleDateString("de-AT")}
                </td>
              </tr>
            ))}
            {!filtered?.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground-muted text-sm">
                  Keine Inserate gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
