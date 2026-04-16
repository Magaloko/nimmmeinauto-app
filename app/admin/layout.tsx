import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase-server";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/users", label: "Benutzer", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/admin/listings", label: "Inserate", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/offers", label: "Angebote", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" },
  { href: "/admin/chat", label: "Nachrichten", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/unauthorized");

  return (
    <div className="min-h-screen flex bg-[#FAFAF9]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#1C1917] flex flex-col min-h-screen">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-white">
            nimm<span className="text-amber-400">mein</span>auto
          </Link>
          <span className="ml-2 text-xs font-semibold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin-Navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-300 hover:bg-white/10 hover:text-white transition-colors group"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5 shrink-0 text-stone-400 group-hover:text-amber-400 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-xs text-stone-500 truncate">{user.email}</div>
          <Link
            href="/"
            className="mt-2 text-xs text-stone-400 hover:text-white transition-colors"
          >
            ← Zur Website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
