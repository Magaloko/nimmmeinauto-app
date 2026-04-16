import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { ContactWidget } from "@/components/contact-widget";
import { CookieBanner } from "@/components/cookie-banner";
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
  title: "NimmMeinAuto – Auto verkaufen leicht gemacht",
  description: "Verkaufe dein Auto sicher und zum besten Preis. Kostenlose Bewertung in 2 Minuten. Echte Händlerangebote aus ganz Österreich.",
  openGraph: {
    title: "NimmMeinAuto – Auto verkaufen leicht gemacht",
    description: "Kostenlose Fahrzeugbewertung in 2 Minuten. Echte Angebote von geprüften Händlern.",
    url: "https://nimmmeinauto.at",
    siteName: "NimmMeinAuto",
    locale: "de_AT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NimmMeinAuto – Auto verkaufen leicht gemacht",
    description: "Kostenlose Bewertung in 2 Minuten. Echte Händlerangebote.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CNV2TR0MJB"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CNV2TR0MJB');
          `}
        </Script>
      </head>
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
      </body>
    </html>
  );
}
