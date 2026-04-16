import { getSupabaseServer } from "@/lib/supabase-server";
import { setUserRole } from "../actions";

export const dynamic = "force-dynamic";

const ROLES = ["kunde", "bewerter", "admin"] as const;

const ROLE_STYLE: Record<string, string> = {
  kunde: "bg-stone-100 text-stone-600",
  bewerter: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await getSupabaseServer();

  // profiles join with auth.users via a view is not directly possible via anon key.
  // We use service-role from actions, but here we do a simple read from profiles.
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // Also fetch auth emails. We can't directly join, so we pass user IDs
  // to auth.admin via service role. For display simplicity, show what we have.
  // Full email display requires a dedicated endpoint — covered by the notes below.

  const filtered = q
    ? profiles?.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(q.toLowerCase()) ||
          p.role?.toLowerCase().includes(q.toLowerCase())
      )
    : profiles;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Benutzer</h1>
      <p className="text-sm text-foreground-muted mb-6">
        Alle registrierten Konten und ihre Rollen.{" "}
        <span className="text-xs text-amber-600">
          E-Mail-Adressen sind aus Datenschutzgründen in der Supabase-Konsole einsehbar (Authentication → Users).
        </span>
      </p>

      {/* Search */}
      <form method="GET" className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Name oder Rolle suchen…"
          className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-72"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Suchen
        </button>
      </form>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAFAF9]">
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Name</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Registriert</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Aktuelle Rolle</th>
              <th className="text-left px-4 py-3 text-xs text-foreground-muted font-medium">Rolle ändern</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-[#FAFAF9]">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{u.full_name || "—"}</div>
                  <div className="text-xs text-foreground-muted font-mono">{u.id.slice(0, 8)}…</div>
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {new Date(u.created_at).toLocaleDateString("de-AT")}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_STYLE[u.role] ?? ""}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const role = formData.get("role") as typeof ROLES[number];
                      await setUserRole(u.id, role);
                    }}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-2 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary-dark transition-colors"
                    >
                      Speichern
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {!filtered?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-foreground-muted text-sm">
                  Keine Benutzer gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
