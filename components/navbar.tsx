"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";

export function Navbar({ app = "nimm" }: { app?: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "bg-white shadow-soft border-b border-border" : "bg-white/95 backdrop-blur-sm"}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v4"/>
              <circle cx="16" cy="17" r="3"/><circle cx="7" cy="17" r="3"/>
              <path d="M16 5l-4 0M8 3l0 4"/>
            </svg>
          </div>
          <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            NimmMein<span className="text-primary">Auto</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/auto-bewerten" className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-all">
            Auto bewerten
          </Link>
          <Link href="#how" className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-all">
            So funktioniert&#39;s
          </Link>
          <Link href="/dealer" className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-all">
            Für Händler
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link href="/seller" className="hidden sm:block text-sm font-medium text-foreground-muted hover:text-foreground transition-colors">
            Meine Inserate
          </Link>
          <Link href="/auto-bewerten">
            <Button size="sm" className="bg-primary hover:bg-primary-dark text-white shadow-sm font-semibold">
              Jetzt bewerten
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
