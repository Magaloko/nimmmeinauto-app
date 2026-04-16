import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nimmmeinauto.at"),
  title: "NimmMeinAuto – Auto verkaufen leicht gemacht",
  description: "Verkaufe dein Auto sicher und zum besten Preis. Kostenlose Bewertung in 2 Minuten. Echte Händlerangebote aus ganz Österreich.",
  openGraph: {
    title: "NimmMeinAuto – Auto verkaufen leicht gemacht",
    description: "Kostenlose Fahrzeugbewertung in 2 Minuten. Echte Angebote von geprüften Händlern.",
    url: "https://nimmmeinauto.at",
    siteName: "NimmMeinAuto",
    locale: "de_AT",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "NimmMeinAuto – modern · mobil · mühelos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NimmMeinAuto – Auto verkaufen leicht gemacht",
    description: "Kostenlose Bewertung in 2 Minuten. Echte Händlerangebote.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${jakarta.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
