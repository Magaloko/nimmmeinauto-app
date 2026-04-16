import type { Metadata } from "next";
import { Navbar } from "../../components/navbar";

export const metadata: Metadata = {
  title: "Impressum NimmMeinAuto GmbH – Angaben gemäß ECG & MedienG",
  description: "Impressum der NimmMeinAuto GmbH Wien. Offenlegung gemäß § 5 ECG und § 25 MedienG – Kontakt, Firmenbuch, UID und Verantwortliche.",
  alternates: { canonical: "https://nimmmeinauto.at/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Impressum NimmMeinAuto GmbH</h1>

        <section className="prose prose-stone max-w-none space-y-6 text-foreground">
          <p className="text-sm text-foreground-muted">
            Offenlegung gemäß § 5 ECG und § 25 MedienG.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">Diensteanbieter</h2>
            <p className="text-foreground-muted">
              NimmMeinAuto GmbH<br />
              [Straße und Hausnummer]<br />
              [PLZ] Wien, Österreich
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
            <p className="text-foreground-muted">
              Telefon: [Telefonnummer]<br />
              E-Mail: office@nimmmeinauto.at<br />
              Web: https://nimmmeinauto.at
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Unternehmensdaten</h2>
            <p className="text-foreground-muted">
              Firmenbuchnummer: FN [xxxxxx x]<br />
              Firmenbuchgericht: Handelsgericht Wien<br />
              UID-Nummer: ATU[xxxxxxxx]<br />
              Rechtsform: Gesellschaft mit beschränkter Haftung
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Geschäftsführung</h2>
            <p className="text-foreground-muted">[Vor- und Nachname der Geschäftsführung]</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Aufsichtsbehörde / Gewerbebehörde</h2>
            <p className="text-foreground-muted">
              Magistratisches Bezirksamt [Bezirk], Wien
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Anwendbare Rechtsvorschriften</h2>
            <p className="text-foreground-muted">
              Gewerbeordnung (abrufbar unter{" "}
              <a href="https://www.ris.bka.gv.at" className="text-primary underline">ris.bka.gv.at</a>)
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Berufsbezeichnung</h2>
            <p className="text-foreground-muted">Dienstleistung in der automatischen Datenverarbeitung / Informationstechnik – Österreich</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Online-Streitbeilegung</h2>
            <p className="text-foreground-muted">
              Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr" className="text-primary underline">
                ec.europa.eu/consumers/odr
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Haftungsausschluss</h2>
            <p className="text-foreground-muted text-sm">
              Fahrzeugbewertungen auf NimmMeinAuto sind unverbindliche Schätzungen auf Basis von Marktdaten
              und Fahrzeugangaben. Der endgültige Verkaufspreis ergibt sich aus den Angeboten der
              teilnehmenden Händler und einer Fahrzeugbesichtigung vor Ort.
            </p>
          </div>
        </section>

        <p className="mt-12 text-xs text-foreground-muted">
          Zuletzt aktualisiert: {new Date().toLocaleDateString("de-AT")}
        </p>
      </main>
    </div>
  );
}
