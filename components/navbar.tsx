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
        {/* Logo – matches brand image */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:opacity-90 transition-opacity">
            nimm<span className="text-amber">mein</span>auto
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/auto-bewerten" className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-all">
            Auto bewerten
          </Link>
          <Link href="#how" className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-all">
            So funktioniert&apos;s
          </Link>
        </div>

        {/* CTA */}
        <Link href="/auto-bewerten">
          <Button size="sm" className="bg-primary hover:bg-primary-dark text-white shadow-sm font-semibold">
            Jetzt bewerten
          </Button>
        </Link>
      </div>
    </nav>
  );
}
