import type { Metadata } from "next";
import { Navbar } from "../../components/navbar";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen · NimmMeinAuto",
  description: "AGB der NimmMeinAuto-Plattform für Verkäufer und Händler in Österreich.",
  alternates: { canonical: "https://nimmmeinauto.at/agb" },
  robots: { index: true, follow: true },
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="space-y-8 text-foreground">
          <p className="text-sm text-foreground-muted">
            Stand: {new Date().toLocaleDateString("de-AT")}
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Geltungsbereich</h2>
            <p className="text-foreground-muted">
              Diese AGB regeln die Nutzung der Plattform nimmmeinauto.at der NimmMeinAuto GmbH
              (im Folgenden „NMA“) durch private Fahrzeuganbieter („Verkäufer“) und gewerbliche
              Kfz-Händler („Händler“) in Österreich.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Leistungsbeschreibung</h2>
            <p className="text-foreground-muted">
              NMA betreibt eine Online-Vermittlungsplattform für den Verkauf gebrauchter Kraftfahrzeuge.
              NMA kauft oder verkauft selbst keine Fahrzeuge und wird nicht Vertragspartei eines
              zwischen Verkäufer und Händler geschlossenen Kaufvertrags.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Registrierung und Inserat</h2>
            <p className="text-foreground-muted">
              Verkäufer können ohne Registrierung ein Inserat erstellen. Die übermittelten
              Fahrzeugdaten müssen wahrheitsgemäß und vollständig sein. Händler benötigen
              eine gewerberechtliche Befugnis und eine verifizierte Firmenidentität.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Kosten</h2>
            <p className="text-foreground-muted">
              Die Fahrzeugbewertung und das Einholen von Angeboten sind für Verkäufer kostenlos.
              Händler entrichten eine Vermittlungsgebühr gemäß separatem Händlervertrag.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Unverbindlichkeit der Bewertung</h2>
            <p className="text-foreground-muted">
              Die durch NMA bereitgestellte Fahrzeugbewertung ist eine unverbindliche
              Schätzung auf Basis der eingegebenen Daten und öffentlich verfügbarer
              Marktpreise. Der endgültige Kaufpreis ergibt sich aus den Angeboten
              der Händler nach Besichtigung des Fahrzeugs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Rücktrittsrecht</h2>
            <p className="text-foreground-muted">
              Verkäufer können den Vermittlungsauftrag jederzeit kostenlos widerrufen.
              Ein zwischen Verkäufer und Händler geschlossener Kaufvertrag fällt nicht
              unter das FAGG-Rücktrittsrecht, sofern die Besichtigung und Übergabe
              persönlich am Händlerstandort erfolgen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Haftung</h2>
            <p className="text-foreground-muted">
              NMA haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit. Für die
              Richtigkeit der von Verkäufern oder Händlern eingegebenen Daten sowie für
              die Durchführung des Kaufvertrags zwischen diesen Parteien übernimmt NMA
              keine Haftung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Anwendbares Recht und Gerichtsstand</h2>
            <p className="text-foreground-muted">
              Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand
              ist – soweit gesetzlich zulässig – das sachlich zuständige Gericht in Wien.
              Gegenüber Verbrauchern gilt der gesetzliche Gerichtsstand.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Salvatorische Klausel</h2>
            <p className="text-foreground-muted">
              Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein,
              bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
