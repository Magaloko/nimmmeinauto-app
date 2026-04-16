"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";

export function Navbar({ app = "nimm" }: { app?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { href: "/auto-bewerten", label: "Auto bewerten" },
    { href: "/ratgeber", label: "Ratgeber" },
    { href: "/faq", label: "FAQ" },
  ];

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

        {/* CTA (desktop) */}
        <div className="hidden md:block">
          <Link href="/auto-bewerten">
            <Button size="sm" className="bg-primary hover:bg-primary-dark text-white shadow-sm font-semibold">
              Jetzt bewerten
            </Button>
          </Link>
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
            <Link href="/auto-bewerten" onClick={() => setMobileOpen(false)} className="mt-2">
              <Button size="sm" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                Jetzt bewerten
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
