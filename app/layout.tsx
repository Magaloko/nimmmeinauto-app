import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ContactWidget } from "@/components/contact-widget";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nimmmeinauto.at"),
  verification: {
    google: "GWkXoqnGP9eXyPVLtn25TOfzwVjAAoQlC5sy61xBCWE",
  },
  title: "NimmMeinAuto – Wir kaufen dein Auto direkt",
  description: "Wir kaufen dein Auto – schnell, sicher und unkompliziert. Kostenlose Online-Bewertung in 2 Minuten, fairer Festpreis, sichere Auszahlung. Direktankauf in ganz Österreich.",
  openGraph: {
    title: "NimmMeinAuto – Wir kaufen dein Auto direkt",
    description: "Direktankauf in ganz Österreich. Kostenlose Bewertung in 2 Minuten, Festpreis-Angebot, sichere Auszahlung. Keine Inserate, keine Verhandlungen.",
    url: "https://nimmmeinauto.at",
    siteName: "NimmMeinAuto",
    locale: "de_AT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NimmMeinAuto – Wir kaufen dein Auto direkt",
    description: "Direktankauf in ganz Österreich. Kostenlose Bewertung, Festpreis, sichere Auszahlung.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-stone-900 focus:font-semibold focus:rounded-lg focus:shadow-lg"
        >
          Zum Inhalt springen
        </a>
        {children}
        <ContactWidget />
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
