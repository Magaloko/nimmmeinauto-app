"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Role = "kunde" | "bewerter" | "admin";

export function Navbar({ app = "nimm" }: { app?: string }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const supabase = useMemo(() => getSupabaseBrowser(), []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (active) setRole((data?.role as Role) ?? "kunde");
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) {
        setEmail(data.user.email ?? null);
        loadProfile(data.user.id);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setEmail(session?.user.email ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setRole(null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const navLinks = [
    { href: "/auto-bewerten", label: "Auto bewerten" },
    { href: "/ratgeber", label: "Ratgeber" },
    { href: "/faq", label: "FAQ" },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <nav
      aria-label="Hauptnavigation"
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white shadow-soft border-b border-border" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="NimmMeinAuto Startseite" className="flex items-center gap-1 group">
          <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:opacity-90 transition-opacity">
            nimm<span className="text-amber">mein</span>auto
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-all"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA / User menu (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {email ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
              >
                <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {email.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[140px] truncate">{email}</span>
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-1 text-sm"
                >
                  <Link
                    href="/account"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-muted text-foreground"
                  >
                    Mein Konto
                  </Link>
                  {role === "bewerter" && (
                    <Link
                      href="/bewerter"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-muted text-foreground"
                    >
                      Bewerter-Queue
                    </Link>
                  )}
                  {role === "admin" && (
                    <Link
                      href="/admin"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-muted text-foreground font-semibold"
                    >
                      Admin-Konsole
                    </Link>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 hover:bg-muted text-foreground-muted border-t border-border"
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground rounded-lg transition-colors"
              >
                Anmelden
              </Link>
              <Link href="/auto-bewerten">
                <Button size="sm" className="bg-primary hover:bg-primary-dark text-white shadow-sm font-semibold">
                  Jetzt bewerten
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <svg aria-hidden="true" className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted transition-colors"
              >
                {l.label}
              </Link>
            ))}

            {email ? (
              <>
                <div className="border-t border-border my-2" />
                <div className="px-3 py-1 text-xs uppercase tracking-wide text-foreground-muted">
                  {email}
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted"
                >
                  Mein Konto
                </Link>
                {role === "bewerter" && (
                  <Link
                    href="/bewerter"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted"
                  >
                    Bewerter-Queue
                  </Link>
                )}
                {role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    Admin-Konsole
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted"
                >
                  Anmelden
                </Link>
                <Link href="/auto-bewerten" onClick={() => setMobileOpen(false)} className="mt-2">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                    Jetzt bewerten
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
