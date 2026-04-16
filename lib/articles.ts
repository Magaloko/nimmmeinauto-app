export interface Article {
  slug: string;
  title: string;
  description: string;
  category: "Verkauf" | "Steuer" | "Bewertung" | "Recht";
  readMinutes: number;
  publishedAt: string; // ISO
  body: string; // markdown-ish plain text blocks separated by \n\n
}

export const ARTICLES: Article[] = [
  {
    slug: "auto-verkaufen-oesterreich-leitfaden",
    title: "Auto verkaufen in Österreich – der vollständige Leitfaden 2026",
    description:
      "Alles, was du beim Verkauf eines Gebrauchtwagens in Österreich beachten musst: Unterlagen, NoVA, Abmeldung, Steuern.",
    category: "Verkauf",
    readMinutes: 8,
    publishedAt: "2026-01-15",
    body: `Ein Auto in Österreich zu verkaufen ist unkompliziert, wenn du die wichtigsten Schritte kennst. In diesem Leitfaden zeigen wir dir, worauf du achten musst – von der Vorbereitung der Unterlagen bis zur Abmeldung bei der Zulassungsstelle.

**Notwendige Unterlagen**

Halte für den Verkauf folgende Dokumente bereit: Zulassungsschein (Typenschein bzw. Teil I und II), Pickerl-Bescheinigung (§57a), Servicebuch, Kaufvertrag, und gegebenenfalls ein aktuelles Gutachten.

**Fahrzeugbewertung**

Beginne mit einer ehrlichen Einschätzung des Fahrzeugzustands. Online-Tools wie NimmMeinAuto liefern dir eine kostenlose Marktpreisschätzung auf Basis aktueller österreichischer Händlerdaten.

**Kaufvertrag aufsetzen**

Nutze einen Musterkaufvertrag (z. B. ÖAMTC-Vorlage) und halte Mängel schriftlich fest. Der Zusatz „gekauft wie besichtigt, unter Ausschluss jeglicher Gewährleistung“ ist bei Privatverkäufen zwischen Privatpersonen üblich – zwischen Händler und Konsument ist der Gewährleistungsausschluss jedoch unzulässig.

**Fahrzeug abmelden**

Nach Übergabe des Fahrzeugs kannst du dieses bei deiner Versicherung oder der Zulassungsstelle abmelden. Die Versicherungsprämie wird anteilig rückerstattet.`,
  },
  {
    slug: "nova-berechnen-gebrauchtwagen",
    title: "NoVA bei Gebrauchtwagen: So wird sie berechnet",
    description:
      "Die Normverbrauchsabgabe betrifft den Import von Gebrauchtwagen nach Österreich. Wir erklären die Berechnung 2026.",
    category: "Steuer",
    readMinutes: 6,
    publishedAt: "2026-02-03",
    body: `Die Normverbrauchsabgabe (NoVA) fällt an, wenn ein Fahrzeug erstmalig in Österreich zum Verkehr zugelassen wird. Beim Inlands-Verkauf eines bereits in Österreich zugelassenen Gebrauchtwagens fällt sie nicht erneut an.

**Wer zahlt NoVA?**

Die NoVA wird vom Käufer geschuldet, wenn dieser einen Gebrauchtwagen aus dem EU-Ausland importiert und erstmalig in Österreich anmeldet.

**Berechnung 2026**

Der NoVA-Satz richtet sich nach dem CO₂-Ausstoß des Fahrzeugs. Die Formel für PKW lautet sinngemäß: (CO₂-Wert – Abzug) / Divisor = Steuersatz in %, begrenzt mit einem Höchstsatz.

**Malus-Betrag**

Ab einem CO₂-Wert über einem Schwellenwert wird zusätzlich ein Malus pro g/km CO₂ aufgeschlagen. Dies führt bei Fahrzeugen mit hohem Verbrauch zu deutlich höheren Abgaben.

**NoVA bei E-Autos**

Reine Elektrofahrzeuge sind von der NoVA befreit. Plug-in-Hybride profitieren von niedrigeren Sätzen.`,
  },
  {
    slug: "fahrzeug-wert-ermitteln",
    title: "Fahrzeugwert ermitteln: Welche Methoden gibt es?",
    description:
      "Eurotax, Schwacke, Online-Tools oder Händlerangebote – welche Bewertungsmethode ist die beste?",
    category: "Bewertung",
    readMinutes: 5,
    publishedAt: "2026-02-20",
    body: `Den realistischen Wert eines Gebrauchtwagens zu kennen, ist der wichtigste Hebel für einen fairen Verkauf. Es gibt mehrere Methoden, die sich in Genauigkeit und Kosten unterscheiden.

**Online-Bewertung**

Plattformen wie NimmMeinAuto liefern in zwei Minuten eine kostenlose Schätzung auf Basis aktueller österreichischer Marktpreise. Ideal als Startpunkt und für einen realistischen Preisanker.

**Eurotax / Schwacke**

Professionelle Bewertungsinstitute mit historisch gewachsenen Datenbanken. Wird vor allem vom Handel genutzt. Kostenpflichtig, aber sehr präzise.

**Händlerangebote einholen**

Die verlässlichste Methode: Mehrere Händler abgeben lassen und vergleichen. Bei NimmMeinAuto erhältst du dies automatisiert von geprüften österreichischen Händlern.

**Sachverständigen-Gutachten**

Bei Oldtimern, Unfallfahrzeugen oder Streitfällen empfiehlt sich ein Gutachten durch einen zertifizierten Kfz-Sachverständigen (z. B. ÖAMTC, ARBÖ, TÜV).`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
