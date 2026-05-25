import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto bewerten – kostenlos in 2 Minuten · NimmMeinAuto",
  description:
    "Wir kaufen dein Auto direkt. Marke, Modell und Kilometerstand eingeben, kostenlose Online-Bewertung erhalten und unverbindliches Festpreis-Angebot bekommen.",
  alternates: { canonical: "https://nimmmeinauto.at/auto-bewerten" },
  openGraph: {
    title: "Auto bewerten – kostenlos in 2 Minuten",
    description:
      "Direktankauf in ganz Österreich. Online-Bewertung in 2 Minuten, Festpreis-Angebot, sichere Auszahlung.",
    url: "https://nimmmeinauto.at/auto-bewerten",
    locale: "de_AT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function AutoBewertenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
