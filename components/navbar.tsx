"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

interface NavbarProps {
  app?: "nimm" | "auktionshaus";
}

export function Navbar({ app = "nimm" }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              {app === "nimm" ? "NimmMeinAuto" : "Auktionshaus"}
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {app === "nimm" ? (
              <>
                <Link
                  href="/auto-bewerten"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Bewertung
                </Link>
                <Link
                  href="#how"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  So funktioniert&apos;s
                </Link>
                <Link
                  href="/dealer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Für Händler
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auktionen"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Auktionen
                </Link>
                <Link
                  href="/meine-gebote"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Meine Gebote
                </Link>
              </>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link href="/seller" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Meine Inserate
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Anmelden
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
