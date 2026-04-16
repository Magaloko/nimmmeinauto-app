import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase-server";
import { closeThread } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminChatPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await getSupabaseServer();

  let query = supabase
    .from("threads")
    .select(
      "id, subject, status, last_message_at, created_at, customer_id, listing_id, listings(make, model, year)"
    )
    .order("last_message_at", { ascending: false })
    .limit(50);

  if (status === "open" || status === "closed") {
    query = query.eq("status", status);
  }

  const { data: threads } = await query;

  // Fetch last message per thread
  const threadIds = threads?.map((t) => t.id) ?? [];
  const { data: lastMsgs } = threadIds.length
    ? await supabase
        .from("messages")
        .select("thread_id, body, created_at, sender_id")
        .in("thread_id", threadIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  type LastMsg = { thread_id: string; body: string; created_at: string; sender_id: string };
  const lastByThread = new Map<string, LastMsg>();
  (lastMsgs as LastMsg[] | null)?.forEach((m) => {
    if (!lastByThread.has(m.thread_id)) lastByThread.set(m.thread_id, m);
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Nachrichten</h1>
      <p className="text-sm text-foreground-muted mb-6">
        Alle Support-Threads zwischen Kunden und dem Admin-Team.
      </p>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["", "open", "closed"].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/chat?status=${s}` : "/admin/chat"}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              (status ?? "") === s
                ? "bg-primary text-white"
                : "bg-white border border-border text-foreground-muted hover:border-primary hover:text-primary"
            }`}
          >
            {s === "" ? "Alle" : s === "open" ? "Offen" : "Geschlossen"}
          </Link>
        ))}
      </div>

      {threads?.length ? (
        <div className="space-y-3">
          {threads.map((t) => {
            const listing = Array.isArray(t.listings) ? t.listings[0] : t.listings;
            const last = lastByThread.get(t.id);
            return (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-border p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {t.status === "open" ? "Offen" : "Geschlossen"}
                    </span>
                    {listing && (
                      <Link
                        href={`/bewertung?id=${t.listing_id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {listing.make} {listing.model} · {listing.year}
                      </Link>
                    )}
                    <span className="text-xs text-foreground-muted">
                      {new Date(t.last_message_at).toLocaleDateString("de-AT")}
                    </span>
                  </div>
                  <div className="font-medium text-foreground truncate">
                    {t.subject || "Kein Betreff"}
                  </div>
                  {last && (
                    <div className="text-xs text-foreground-muted truncate mt-0.5">
                      {last.body}
                    </div>
                  )}
                  <div className="text-xs text-foreground-muted font-mono mt-1">
                    Kunde: {t.customer_id.slice(0, 8)}…
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    href={`/admin/chat/${t.id}`}
                    className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Öffnen
                  </Link>
                  {t.status === "open" && (
                    <form
                      action={async () => {
                        "use server";
                        await closeThread(t.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-medium border border-border text-foreground-muted rounded-lg hover:border-red-300 hover:text-red-600 transition-colors w-full"
                      >
                        Schließen
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-foreground-muted text-sm">
          Keine Nachrichten vorhanden.
        </div>
      )}
    </div>
  );
}
