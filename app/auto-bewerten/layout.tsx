import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto bewerten – kostenlos in 2 Minuten · NimmMeinAuto",
  description:
    "Kostenlose Fahrzeugbewertung in Österreich. Marke, Modell und Kilometerstand eingeben, Marktwert erhalten und unverbindliche Händlerangebote vergleichen.",
  alternates: { canonical: "https://nimmmeinauto.at/auto-bewerten" },
  openGraph: {
    title: "Auto bewerten – kostenlos in 2 Minuten",
    description:
      "Schätzpreis in 2 Minuten. Echte Angebote geprüfter Händler aus ganz Österreich.",
    url: "https://nimmmeinauto.at/auto-bewerten",
    locale: "de_AT",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function AutoBewertenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
