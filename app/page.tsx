import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { Navbar } from "../components/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar app="nimm" />

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Österreichs schnellste Fahrzeugbewertung
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
            Dein Auto –{" "}
            <span className="text-primary">fair bewertet.</span>
            <br />
            Sofort bezahlt.
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Kostenlose Schätzung in 2 Minuten. Echte Angebote von geprüften Händlern aus ganz Österreich.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auto-bewerten">
              <Button size="lg" className="text-base px-10 py-6 h-auto">
                Jetzt bewerten →
              </Button>
            </Link>
            <Link href="#how">
              <Button variant="outline" size="lg" className="text-base px-8 py-6 h-auto border-gray-600 text-white hover:bg-gray-800 hover:text-white">
                So funktioniert&apos;s
              </Button>
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            Kostenlos &amp; unverbindlich · Kein Verkaufszwang · 100% sicher
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-white py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">12.400+</div>
            <div className="text-primary-foreground/80 text-sm">verkaufte Fahrzeuge</div>
          </div>
          <div>
            <div className="text-2xl font-bold">340+</div>
            <div className="text-primary-foreground/80 text-sm">geprüfte Händler</div>
          </div>
          <div>
            <div className="text-2xl font-bold">2 Min.</div>
            <div className="text-primary-foreground/80 text-sm">bis zur Bewertung</div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Warum NimmMeinAuto?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Wir verbinden Verkäufer direkt mit seriösen Händlern – ohne Umwege, ohne versteckte Kosten.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🆓</div>
                <h3 className="text-xl font-semibold mb-2">Kostenlos &amp; unverbindlich</h3>
                <p className="text-muted-foreground text-sm">
                  Keine versteckten Gebühren. Bewertung und Angebotsvergleich sind vollständig gratis.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-primary/30 bg-accent">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Direkte Händlerangebote</h3>
                <p className="text-muted-foreground text-sm">
                  Geprüfte Autohändler aus Österreich machen dir direkt verbindliche Angebote.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Beste Preise aus Österreich</h3>
                <p className="text-muted-foreground text-sm">
                  Vergleiche mehrere Angebote und wähle das beste – wir helfen dir, den Höchstpreis zu erzielen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">So funktioniert&apos;s</h2>
          <p className="text-muted-foreground text-center mb-12">
            In 4 einfachen Schritten zum besten Angebot.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", icon: "📝", title: "Auto beschreiben", desc: "Marke, Modell, Baujahr, Kilometerstand und Zustand angeben." },
              { step: "2", icon: "📊", title: "Schätzwert erhalten", desc: "Unser Algorithmus berechnet sofort den fairen Marktwert deines Autos." },
              { step: "3", icon: "📬", title: "Angebote vergleichen", desc: "Innerhalb von 24 Stunden erhältst du echte Kaufangebote von Händlern." },
              { step: "4", icon: "✅", title: "Besten Deal wählen", desc: "Wähle das beste Angebot und vereinbare Übergabe und Zahlung direkt." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step}
                  </div>
                </div>
                <div className="text-3xl mb-2">{icon}</div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/auto-bewerten">
              <Button size="lg" className="text-base px-10">
                Jetzt kostenlos starten →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Was unsere Kunden sagen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Markus R.", city: "Wien", text: "Innerhalb von 2 Stunden hatte ich drei Angebote. Super schnell und unkompliziert!", stars: 5 },
              { name: "Sandra M.", city: "Graz", text: "Ich hab mehr bekommen als erwartet. Der Prozess war total einfach und transparent.", stars: 5 },
              { name: "Thomas K.", city: "Linz", text: "Kein Vergleich zu privaten Inseraten. Direkt, sicher und faire Preise.", stars: 5 },
            ].map(({ name, city, text, stars }) => (
              <Card key={name} className="text-left">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3 text-yellow-400">
                    {"★".repeat(stars)}
                  </div>
                  <p className="text-sm text-foreground mb-4 italic">&ldquo;{text}&rdquo;</p>
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-muted-foreground text-xs">{city}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Bereit, dein Auto zu verkaufen?</h2>
          <p className="text-gray-300 mb-8">
            Starte jetzt – kostenlos, unverbindlich und in weniger als 2 Minuten.
          </p>
          <Link href="/auto-bewerten">
            <Button size="lg" className="text-base px-12">
              Jetzt bewerten →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white font-bold text-lg">NimmMeinAuto</div>
          <div className="text-sm">
            © {new Date().getFullYear()} NimmMeinAuto GmbH · Alle Rechte vorbehalten
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link href="#" className="hover:text-white transition-colors">AGB</Link>
            <Link href="#" className="hover:text-white transition-colors">Impressum</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
