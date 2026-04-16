import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await getSupabaseServer();

  const [
    { count: totalUsers },
    { count: totalListings },
    { count: pendingListings },
    { count: liveListings },
    { count: totalOffers },
    { data: recentListings },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "live"),
    supabase.from("offers").select("*", { count: "exact", head: true }),
    supabase
      .from("listings")
      .select("id, make, model, year, status, estimated_value_cents, created_at, first_name, last_name")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return { totalUsers, totalListings, pendingListings, liveListings, totalOffers, recentListings, recentUsers };
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  live: "bg-green-100 text-green-700",
  sold: "bg-blue-100 text-blue-700",
  archived: "bg-stone-100 text-stone-500",
};

const ROLE_STYLE: Record<string, string> = {
  kunde: "bg-stone-100 text-stone-600",
  bewerter: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};

export default async function AdminDashboard() {
  const { totalUsers, totalListings, pendingListings, liveListings, totalOffers, recentListings, recentUsers } =
    await getStats();

  const kpis = [
    { label: "Benutzer gesamt", value: totalUsers ?? 0, href: "/admin/users", color: "bg-blue-50 text-blue-600" },
    { label: "Inserate gesamt", value: totalListings ?? 0, href: "/admin/listings", color: "bg-amber-50 text-amber-600" },
    { label: "Ausstehend", value: pendingListings ?? 0, href: "/admin/listings?status=pending", color: "bg-yellow-50 text-yellow-600" },
    { label: "Live", value: liveListings ?? 0, href: "/admin/listings?status=live", color: "bg-green-50 text-green-600" },
    { label: "Angebote", value: totalOffers ?? 0, href: "/admin/offers", color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
      <p className="text-sm text-foreground-muted mb-8">Übersicht aller Aktivitäten auf NimmMeinAuto.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-lg ${k.color} flex items-center justify-center text-lg font-bold mb-3`}>
              {k.value}
            </div>
            <div className="text-xs text-foreground-muted">{k.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Neueste Inserate</h2>
            <Link href="/admin/listings" className="text-xs text-primary hover:underline">
              Alle anzeigen →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#FAFAF9]">
                  <th className="text-left px-4 py-2.5 text-xs text-foreground-muted font-medium">Fahrzeug</th>
                  <th className="text-left px-4 py-2.5 text-xs text-foreground-muted font-medium">Status</th>
                  <th className="text-right px-4 py-2.5 text-xs text-foreground-muted font-medium">Wert</th>
                </tr>
              </thead>
              <tbody>
                {recentListings?.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-[#FAFAF9]">
                    <td className="px-4 py-3">
                      <Link href={`/bewertung?id=${l.id}`} className="font-medium text-foreground hover:text-primary">
                        {l.make} {l.model} · {l.year}
                      </Link>
                      <div className="text-xs text-foreground-muted">{l.first_name} {l.last_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[l.status] ?? "bg-stone-100 text-stone-500"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {l.estimated_value_cents
                        ? `€ ${(l.estimated_value_cents / 100).toLocaleString("de-AT")}`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent users */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Neueste Benutzer</h2>
            <Link href="/admin/users" className="text-xs text-primary hover:underline">
              Alle anzeigen →
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#FAFAF9]">
                  <th className="text-left px-4 py-2.5 text-xs text-foreground-muted font-medium">Name</th>
                  <th className="text-right px-4 py-2.5 text-xs text-foreground-muted font-medium">Rolle</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers?.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-[#FAFAF9]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{u.full_name || "—"}</div>
                      <div className="text-xs text-foreground-muted">
                        {new Date(u.created_at).toLocaleDateString("de-AT")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_STYLE[u.role] ?? ""}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
