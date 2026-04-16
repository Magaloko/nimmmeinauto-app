"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie_consent")) {
        setVisible(true);
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem("cookie_consent", "accepted");
    } catch {}
    setVisible(false);
  }

  function decline() {
    try {
      localStorage.setItem("cookie_consent", "declined");
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-sm border-t border-stone-700 px-4 py-4 md:py-5"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="text-sm text-stone-300 flex-1">
          Wir verwenden ausschließlich technisch notwendige Cookies für den Betrieb dieser Website.
          Es werden keine Tracking- oder Marketing-Cookies gesetzt.{" "}
          <a
            href="/datenschutz"
            className="underline text-amber-400 hover:text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded"
          >
            Datenschutzerklärung
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg border border-stone-600 text-stone-300 hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500"
          >
            Ablehnen
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
