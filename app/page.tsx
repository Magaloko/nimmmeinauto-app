import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { Navbar } from "../components/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar app="nimm" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-[#1C1917] text-white overflow-hidden">
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
            <span className="inline-flex items-center gap-1.5">
              <svg width="16" height="12" viewBox="0 0 16 12" className="rounded-sm flex-shrink-0">
                <rect width="16" height="4" fill="#ED2939"/>
                <rect y="4" width="16" height="4" fill="#ffffff"/>
                <rect y="8" width="16" height="4" fill="#ED2939"/>
              </svg>
              Österreichs schnellste Fahrzeugbewertung
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                Dein Auto –<br />
                <span className="text-amber">fair bewertet.</span><br />
                Sofort bezahlt.
              </h1>
              <p className="text-lg text-stone-300 mb-8 leading-relaxed">
                Kostenlose Schätzung in 2 Minuten. Echte Angebote von
                <strong className="text-white"> geprüften Händlern</strong> aus ganz Österreich.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/auto-bewerten">
                  <Button size="lg" className="bg-amber hover:bg-amber-dark text-foreground font-bold shadow-warm text-base px-8 h-12 w-full sm:w-auto">
                    Jetzt kostenlos bewerten
                  </Button>
                </Link>
                <Link href="#how">
                  <Button size="lg" className="bg-white/15 hover:bg-white/25 text-white border border-white/40 text-base h-12 w-full sm:w-auto backdrop-blur-sm">
                    Wie es funktioniert
                  </Button>
                </Link>
              </div>
              {/* Mini trust signals */}
              <div className="flex flex-wrap gap-4 text-sm text-stone-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Kostenlos & unverbindlich
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Kein Verkaufszwang
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  SSL-verschlüsselt
                </span>
              </div>
            </div>

            {/* Right: animated value card */}
            <div className="hidden md:block">
              <div className="bg-[#292524]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-amber/10">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Beispiel-Bewertung</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">VW Golf 2020</div>
                    <div className="text-stone-400 text-sm">45.000 km · Gut</div>
                  </div>
                </div>
                <div className="bg-black/20 rounded-xl p-4 mb-4 border border-white/5">
                  <div className="text-stone-400 text-xs mb-1">Geschätzter Marktwert</div>
                  <div className="text-3xl font-bold text-amber">€ 17.200</div>
                  <div className="text-stone-400 text-xs mt-1">Spanne: € 15.500 – € 18.900</div>
                </div>
                <div className="space-y-2">
                  {[
                    { dealer: "Autohaus Müller Wien", amount: "€ 16.800", pct: "98%", color: "bg-green-500" },
                    { dealer: "Fahrzeugcenter Graz", amount: "€ 16.100", pct: "94%", color: "bg-blue-500" },
                    { dealer: "AutoGroup Salzburg", amount: "€ 15.500", pct: "90%", color: "bg-purple-500" },
                  ].map((o) => (
                    <div key={o.dealer} className="flex items-center justify-between bg-black/15 rounded-lg px-3 py-2 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${o.color}`} />
                        <span className="text-xs text-stone-300">{o.dealer}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white">{o.amount}</span>
                        <span className="text-stone-500 text-xs ml-1">{o.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section className="bg-primary py-5 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "12.400+", label: "verkaufte Fahrzeuge" },
            { value: "340+", label: "geprüfte Händler" },
            { value: "Ø 94%", label: "des Schätzpreises erzielt" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-xl md:text-2xl font-bold text-white">{value}</div>
              <div className="text-primary-light/80 text-xs md:text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why NimmMeinAuto ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">Warum NimmMeinAuto?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Der einfachste Weg, dein Auto zu verkaufen</h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Kein Stress mit Privatanzeigen. Keine Verhandlungen. Nur echte Angebote von geprüften Händlern.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                ),
                color: "bg-green-50 text-green-600",
                title: "Kostenlos & unverbindlich",
                desc: "Keine versteckten Gebühren. Die Bewertung und der Angebotsvergleich sind vollständig gratis.",
                highlight: false,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                ),
                color: "bg-blue-50 text-blue-600",
                title: "Geprüfte Händler",
                desc: "Nur verifizierte Autohändler aus Österreich. Jeder Händler wird von uns geprüft, bevor er Angebote machen darf.",
                highlight: true,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                ),
                color: "bg-amber/20 text-amber-dark",
                title: "Beste Marktpreise",
                desc: "Durch den Wettbewerb unter Händlern erzielst du durchschnittlich 94% des Marktpreises.",
                highlight: false,
              },
            ].map(({ icon, color, title, desc, highlight }) => (
              <Card key={title} className={`border transition-shadow hover:shadow-hover ${highlight ? "border-primary/20 ring-1 ring-primary/10" : ""}`}>
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}>{icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how" className="py-20 px-4 bg-surface-warm border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-amber/20 text-amber-dark text-xs font-semibold px-3 py-1 rounded-full mb-3">So funktioniert&#39;s</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">In 4 Schritten zum besten Preis</h2>
            <p className="text-foreground-muted">Schnell, einfach, sicher.</p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Auto beschreiben", desc: "Marke, Modell, Baujahr und Zustand – in 2 Minuten erledigt." },
                { step: "02", title: "Schätzwert erhalten", desc: "Unser Algorithmus berechnet sofort deinen fairen Marktwert." },
                { step: "03", title: "Angebote vergleichen", desc: "Innerhalb von 24h erhältst du echte Angebote von Händlern." },
                { step: "04", title: "Besten Deal wählen", desc: "Wähle das beste Angebot. Abwicklung direkt mit dem Händler." },
              ].map(({ step, title, desc }, i) => (
                <div key={step} className="relative text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-sm shadow-blue relative z-10 ${i === 3 ? "bg-amber text-foreground" : "bg-primary text-white"}`}>
                    {step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-14">
            <Link href="/auto-bewerten">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold px-10 h-12 shadow-blue">
                Jetzt kostenlos starten
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-0.5 mb-3">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} className="w-5 h-5 text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Was unsere Kunden sagen</h2>
            <p className="text-foreground-muted text-sm">Über 12.000 erfolgreiche Verkäufe in Österreich</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Markus R.", city: "Wien", car: "BMW 3er 2018", text: "Innerhalb von 2 Stunden hatte ich drei Angebote. Super schnell und unkompliziert! Hab 500€ mehr bekommen als erwartet.", stars: 5 },
              { name: "Sandra M.", city: "Graz", car: "VW Golf 2020", text: "Der Prozess war total einfach und transparent. Ich wusste immer genau wo ich stehe. Klare Empfehlung!", stars: 5 },
              { name: "Thomas K.", city: "Linz", car: "Audi A4 2017", text: "Kein Vergleich zu privaten Inseraten. Direkter, sicherer und faire Preise von echten Händlern.", stars: 5 },
            ].map(({ name, city, car, text, stars }) => (
              <Card key={name} className="border hover:shadow-card transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({length: stars}).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-4">&#8220;{text}&#8221;</p>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                        {name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{name}</div>
                        <div className="text-foreground-muted text-xs">{city} · {car}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#1C1917] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <svg width="48" height="36" viewBox="0 0 48 36" className="rounded">
              <rect width="48" height="12" fill="#ED2939"/>
              <rect y="12" width="48" height="12" fill="#ffffff"/>
              <rect y="24" width="48" height="12" fill="#ED2939"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit, dein Auto zu verkaufen?</h2>
          <p className="text-stone-300 mb-8 text-lg">
            Starte jetzt – kostenlos, unverbindlich, in unter 2 Minuten.
          </p>
          <Link href="/auto-bewerten">
            <Button size="lg" className="bg-amber hover:bg-amber-dark text-foreground font-bold text-base px-12 h-12 shadow-warm">
              Jetzt bewerten
            </Button>
          </Link>
          <p className="text-stone-500 text-xs mt-6">Keine Registrierung nötig · DSGVO-konform · Made in Austria</p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-[#111110] text-stone-400 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 pb-6 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v4"/>
                  <circle cx="16" cy="17" r="3"/><circle cx="7" cy="17" r="3"/>
                </svg>
              </div>
              <span className="text-white font-bold">NimmMein<span className="text-primary">Auto</span></span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm justify-center">
              <Link href="#" className="hover:text-white transition-colors">Datenschutz</Link>
              <Link href="#" className="hover:text-white transition-colors">AGB</Link>
              <Link href="#" className="hover:text-white transition-colors">Impressum</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-stone-600">
            <span>© {new Date().getFullYear()} NimmMeinAuto GmbH · Wien, Österreich</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                SSL-Verschlüsselung
              </span>
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="9" viewBox="0 0 12 9" className="rounded-sm flex-shrink-0">
                  <rect width="12" height="3" fill="#ED2939"/>
                  <rect y="3" width="12" height="3" fill="#ffffff"/>
                  <rect y="6" width="12" height="3" fill="#ED2939"/>
                </svg>
                Österreich
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
