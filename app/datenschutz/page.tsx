import type { Metadata } from "next";
import { Navbar } from "../../components/navbar";

export const metadata: Metadata = {
  title: "Datenschutzerklärung NimmMeinAuto GmbH – DSGVO & DSG",
  description: "Datenschutzerklärung der NimmMeinAuto GmbH gemäß DSGVO und DSG. Erfahre, wie wir deine Fahrzeug- und Kontaktdaten beim Auto verkaufen schützen.",
  alternates: { canonical: "https://nimmmeinauto.at/datenschutz" },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Datenschutzerklärung NimmMeinAuto GmbH</h1>

        <div className="space-y-8 text-foreground">
          <p className="text-sm text-foreground-muted">
            Stand: {new Date().toLocaleDateString("de-AT")}. Diese Datenschutzerklärung informiert Sie
            über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten gemäß Art. 13 DSGVO.
          </p>

          <div className="rounded-xl bg-amber/10 border border-amber/30 p-4 text-sm text-foreground">
            <strong>Hinweis:</strong> Diese Datenschutzerklärung ist ein Entwurf für das Direktankauf-Modell
            und muss vor Veröffentlichung durch eine/n Anwält:in bzw. Datenschutzbeauftragte:n geprüft werden.
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Verantwortlicher</h2>
            <p className="text-foreground-muted">
              NimmMeinAuto GmbH, [Adresse], Wien, Österreich<br />
              E-Mail: datenschutz@nimmmeinauto.at
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Zwecke der Verarbeitung</h2>
            <ul className="list-disc pl-6 text-foreground-muted space-y-1">
              <li>Durchführung der Fahrzeugbewertung und Erstellung unseres Ankaufs-Angebots</li>
              <li>Kontaktaufnahme mit Ihnen zur Terminvereinbarung und Vertragsabwicklung</li>
              <li>Abschluss, Abwicklung und Dokumentation des Kfz-Kaufvertrags mit Ihnen</li>
              <li>Erfüllung gesetzlicher Aufbewahrungspflichten (UGB, BAO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Rechtsgrundlagen</h2>
            <p className="text-foreground-muted">
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
              (vorvertragliche Maßnahmen / Erfüllung des Kaufvertrags mit Ihnen) sowie Art. 6 Abs. 1
              lit. c DSGVO (Erfüllung rechtlicher Verpflichtungen). Wir geben Ihre Daten <strong>nicht</strong>
              zu Werbe- oder Vermittlungszwecken an Dritte weiter.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Erhobene Datenkategorien</h2>
            <ul className="list-disc pl-6 text-foreground-muted space-y-1">
              <li>Fahrzeugdaten: Marke, Modell, Baujahr, Kilometerstand, Ausstattung, Zustand</li>
              <li>Kontaktdaten: Vorname, Nachname, E-Mail, Telefonnummer, Postleitzahl</li>
              <li>Technische Daten: IP-Adresse, Browser, Zeitstempel (Server-Logs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Empfänger</h2>
            <p className="text-foreground-muted">
              Ihre Daten werden ausschließlich innerhalb der NimmMeinAuto GmbH zur Abwicklung
              Ihres Fahrzeugverkaufs an uns verarbeitet. Eine Weitergabe an Dritte zu Werbe- oder
              Vermittlungszwecken findet <strong>nicht</strong> statt. Auftragsverarbeiter im Sinne
              des Art. 28 DSGVO sind: Vercel Inc. (Hosting, USA – Standardvertragsklauseln) und
              Supabase (Datenbank, EU-Region). Eine Übermittlung an Finanzbehörden erfolgt im
              Rahmen gesetzlicher Pflichten (z. B. Rechnungs- und Belegaufbewahrung).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Speicherdauer</h2>
            <p className="text-foreground-muted">
              Inserats- und Kontaktdaten werden für 12 Monate gespeichert und anschließend gelöscht,
              sofern keine gesetzlichen Aufbewahrungspflichten (z. B. nach UGB / BAO) einer Löschung
              entgegenstehen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Ihre Rechte</h2>
            <ul className="list-disc pl-6 text-foreground-muted space-y-1">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
              <li>Beschwerderecht bei der Österreichischen Datenschutzbehörde (www.dsb.gv.at)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
            <p className="text-foreground-muted">
              NimmMeinAuto verwendet ausschließlich technisch notwendige Cookies zur
              Sitzungsverwaltung. Es werden keine Tracking- oder Marketing-Cookies ohne
              Einwilligung gesetzt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Externe API-Dienste</h2>
            <p className="text-foreground-muted">
              Für die Fahrzeugbewertung werden technische Fahrzeugdaten an folgende Dienste
              übermittelt: API Ninjas (USA) zur Abfrage von Fahrzeugspezifikationen, NHTSA VPIC
              (USA) zur VIN-Decodierung. Personenbezogene Daten werden dabei nicht übertragen.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
