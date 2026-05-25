import type { Metadata } from "next";
import { Navbar } from "../../components/navbar";

export const metadata: Metadata = {
  title: "AGB NimmMeinAuto – Fahrzeug-Direktankauf in Österreich",
  description: "AGB der NimmMeinAuto GmbH für den direkten Fahrzeug-Ankauf in Österreich – Leistungen, Kosten, Auszahlung und Haftung klar geregelt.",
  alternates: { canonical: "https://nimmmeinauto.at/agb" },
  robots: { index: true, follow: true },
};

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          AGB NimmMeinAuto – Fahrzeug-Direktankauf
        </h1>

        <div className="space-y-8 text-foreground">
          <p className="text-sm text-foreground-muted">
            Stand: {new Date().toLocaleDateString("de-AT")}
          </p>

          <div className="rounded-xl bg-amber/10 border border-amber/30 p-4 text-sm text-foreground">
            <strong>Hinweis:</strong> Diese AGB sind ein Entwurf für das Direktankauf-Modell und müssen
            vor Veröffentlichung durch eine/n Anwält:in geprüft werden.
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Geltungsbereich</h2>
            <p className="text-foreground-muted">
              Diese AGB regeln den Vertrag über den Ankauf gebrauchter Kraftfahrzeuge zwischen der
              NimmMeinAuto GmbH (im Folgenden „NMA") als Käuferin und privaten oder gewerblichen
              Fahrzeuganbieter:innen (im Folgenden „Verkäufer:in") in Österreich.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Leistungsbeschreibung</h2>
            <p className="text-foreground-muted">
              NMA kauft gebrauchte Kraftfahrzeuge direkt von Verkäufer:innen an. NMA tritt selbst
              als Käuferin und Vertragspartei des Kaufvertrags auf. Vermittlungsleistungen an Dritte
              sind nicht Gegenstand dieser AGB.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Online-Bewertung und Festpreis-Angebot</h2>
            <p className="text-foreground-muted">
              Verkäufer:innen können ohne Registrierung eine kostenlose Online-Bewertung anfordern.
              Die übermittelten Fahrzeugdaten müssen wahrheitsgemäß und vollständig sein. Auf Basis
              der Daten erstellt NMA ein unverbindliches Online-Angebot. Das verbindliche Festpreis-Angebot
              erfolgt nach physischer Begutachtung des Fahrzeugs durch NMA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Kosten</h2>
            <p className="text-foreground-muted">
              Die Online-Bewertung, die Vor-Ort-Begutachtung und die Erstellung des Festpreis-Angebots
              sind für Verkäufer:innen vollständig kostenlos und unverbindlich. Es entstehen keine
              versteckten Gebühren, auch wenn der Verkauf nicht zustande kommt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Vor-Ort-Prüfung und verbindliches Angebot</h2>
            <p className="text-foreground-muted">
              Stimmen die im Bewertungsformular angegebenen Daten mit dem tatsächlichen Fahrzeugzustand
              überein, hält NMA das vorab kommunizierte Festpreis-Angebot aufrecht. Weichen die Angaben
              wesentlich ab (z. B. nicht angegebene Schäden, abweichender Kilometerstand), kann NMA das
              Angebot anpassen oder zurückziehen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Kaufvertrag und Auszahlung</h2>
            <p className="text-foreground-muted">
              Nach Annahme des Festpreis-Angebots wird ein schriftlicher Kfz-Kaufvertrag zwischen
              NMA und Verkäufer:in geschlossen. Die Auszahlung des Kaufpreises erfolgt per Banküberweisung
              am Tag der Fahrzeugübergabe. Die Eigentumsübertragung erfolgt mit Zahlungseingang und
              Übergabe von Fahrzeug, Schlüsseln und Papieren.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Rücktrittsrecht</h2>
            <p className="text-foreground-muted">
              Bis zur Übergabe des Fahrzeugs und Annahme des verbindlichen Angebots kann der/die
              Verkäufer:in jederzeit kostenlos vom Verkauf zurücktreten. Das FAGG-Rücktrittsrecht
              für Fernabsatz findet auf den Kfz-Kaufvertrag keine Anwendung, sofern Begutachtung
              und Übergabe persönlich erfolgen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Gewährleistung</h2>
            <p className="text-foreground-muted">
              Bei Ankauf von Privatpersonen gilt zwischen Verkäufer:in und NMA der Ausschluss
              jeglicher Gewährleistung, sofern keine arglistige Täuschung über Mängel vorliegt
              („gekauft wie besichtigt"). Bei Ankauf von Unternehmer:innen gelten die gesetzlichen
              Bestimmungen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Haftung</h2>
            <p className="text-foreground-muted">
              NMA haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit. Für die Richtigkeit
              der von Verkäufer:innen eingegebenen Daten übernimmt NMA keine Haftung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Anwendbares Recht und Gerichtsstand</h2>
            <p className="text-foreground-muted">
              Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist –
              soweit gesetzlich zulässig – das sachlich zuständige Gericht in Wien. Gegenüber
              Verbraucher:innen gilt der gesetzliche Gerichtsstand.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Salvatorische Klausel</h2>
            <p className="text-foreground-muted">
              Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein, bleibt
              die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
