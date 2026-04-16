import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deine Fahrzeugbewertung · NimmMeinAuto",
  description:
    "Ergebnis deiner kostenlosen Fahrzeugbewertung auf NimmMeinAuto.",
  robots: { index: false, follow: false }, // per-listing page – do not index
};

export default function BewertungLayout({ children }: { children: React.ReactNode }) {
  return children;
}
