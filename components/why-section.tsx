"use client";

import { useEffect, useRef, useState } from "react";

export interface WhyStats {
  listings: number;
  offers: number;
  avgOffersPerListing: number;
  totalValueEur: number;
}

interface WhySectionProps {
  stats: WhyStats;
}

// ── Sub-section A helpers ────────────────────────────────────────────────────

const STEPS = [
  {
    num: 1,
    title: "Fahrzeugdaten eingeben",
    desc: "Marke, Modell, Baujahr und Zustand in 2 Minuten erfassen.",
    icon: (
      <svg className="w-7 h-7 text-amber" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Online-Bewertung erhalten",
    desc: "Du bekommst sofort eine Preiseinschätzung auf Basis aktueller österreichischer Marktdaten.",
    icon: (
      <svg className="w-7 h-7 text-amber" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Termin zur Prüfung",
    desc: "Wir prüfen dein Fahrzeug vor Ort oder an einem unserer Standorte und machen dir ein verbindliches Festpreis-Angebot.",
    icon: (
      <svg className="w-7 h-7 text-amber" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Verkaufen & Geld erhalten",
    desc: "Angebot annehmen, Fahrzeug übergeben, Auszahlung noch am selben Tag. Fertig.",
    icon: (
      <svg className="w-7 h-7 text-amber" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

// ── Road background ──────────────────────────────────────────────────────────

function RoadBackground() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-72 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Fade to section color above */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1C1917] to-transparent z-10" />

      {/* Perspective container */}
      <div
        className="w-full h-full"
        style={{ perspective: "520px", perspectiveOrigin: "50% 0%" }}
      >
        <div
          className="w-full"
          style={{
            height: "420%",
            transformOrigin: "50% 0%",
            transform: "rotateX(74deg)",
            /* asphalt */
            background: "#1a1917",
            backgroundImage: [
              /* center divider dash */
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 52px, rgba(255,255,255,0.22) 52px, rgba(255,255,255,0.22) 72px)",
              /* left lane marker */
              "linear-gradient(90deg, transparent 27%, rgba(245,158,11,0.18) 27%, rgba(245,158,11,0.18) 28.2%, transparent 28.2%)",
              /* right lane marker */
              "linear-gradient(90deg, transparent 71.8%, rgba(245,158,11,0.18) 71.8%, rgba(245,158,11,0.18) 73%, transparent 73%)",
              /* road edge glow left */
              "linear-gradient(90deg, transparent 5%, rgba(245,158,11,0.06) 10%, transparent 18%)",
              /* road edge glow right */
              "linear-gradient(90deg, transparent 82%, rgba(245,158,11,0.06) 90%, transparent 95%)",
            ].join(", "),
            backgroundSize: "100% 124px, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
            animation: "roadScroll 0.9s linear infinite",
          }}
        />
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1C1917] to-transparent z-10" />

      <style>{`
        @keyframes roadScroll {
          from { background-position: 0 0, 0 0, 0 0, 0 0, 0 0; }
          to   { background-position: 0 124px, 0 0, 0 0, 0 0, 0 0; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-section B helpers ────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "Kostenlos & unverbindlich",
    desc: "Keine Gebühren, keine Verpflichtungen – du entscheidest.",
    colorClass: "bg-green-50 text-green-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Fairer Festpreis",
    desc: "Unser Angebot basiert auf aktuellen Marktdaten – kein Feilschen, keine versteckten Gebühren.",
    colorClass: "bg-amber/20 text-amber-dark",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Schnell — Ø 24 h",
    desc: "Unser Team meldet sich innerhalb eines Werktages mit deinem persönlichen Festpreis-Angebot.",
    colorClass: "bg-blue-50 text-blue-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Datenschutz",
    desc: "DSGVO-konform. Deine Daten werden nur für die Abwicklung genutzt.",
    colorClass: "bg-purple-50 text-purple-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Sichere Auszahlung",
    desc: "Wir kaufen dein Fahrzeug direkt. Auszahlung per Banküberweisung am Tag der Übergabe – kein Bargeld-Risiko.",
    colorClass: "bg-stone-100 text-stone-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    title: "Österreichweit",
    desc: "Fahrzeug-Prüfung und Abholung in allen 9 Bundesländern – wir kommen zu dir.",
    colorClass: "bg-red-50 text-red-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

// ── Sub-section C helpers ────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  "Kostenlos für den Verkäufer",
  "Keine Inserate & Besichtigungen",
  "Keine Verhandlungen",
  "Fairer Festpreis",
  "Sofortige Auszahlung",
  "Kein Betrugsrisiko",
];

type CellValue = true | false | "partial";

const COMPARISON_DATA: [CellValue, CellValue, CellValue][] = [
  [true, false, true],     // Kostenlos für den Verkäufer
  [true, false, true],     // Keine Inserate & Besichtigungen
  [true, false, "partial"],// Keine Verhandlungen
  [true, "partial", false],// Fairer Festpreis
  [true, false, "partial"],// Sofortige Auszahlung
  [true, false, true],     // Kein Betrugsrisiko
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function PartialIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function ComparisonCell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber/20 text-amber-dark"><CheckIcon /></span>
      </td>
    );
  }
  if (value === "partial") {
    return (
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-400"><PartialIcon /></span>
      </td>
    );
  }
  return (
    <td className="px-4 py-3 text-center">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-400"><XIcon /></span>
    </td>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function WhySection({ stats: _stats }: WhySectionProps) {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    const node = featuresRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setFeaturesVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Sub-section A: 4-step process + road bg ─── */}
      <section className="relative bg-[#1C1917] py-20 px-4 overflow-hidden">
        {/* Animated road background */}
        <RoadBackground />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-amber/20 text-amber text-xs font-semibold px-3 py-1 rounded-full mb-3">
              So funktioniert&apos;s
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              In 4 Schritten dein Auto direkt an uns verkaufen
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto">
              Bewertung, Termin, Festpreis-Angebot, Auszahlung – wir wickeln den kompletten Verkauf für dich ab.
            </p>
          </div>

          {/* Steps grid */}
          <div className="relative">
            {/* Desktop connector */}
            <div
              className="hidden md:block absolute top-[3.25rem] left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px"
              aria-hidden="true"
            >
              <svg className="w-full h-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 6">
                <line
                  x1="0" y1="3" x2="100" y2="3"
                  stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round"
                  style={{ animation: "dashMove 3s linear infinite" }}
                />
              </svg>
            </div>

            <style>{`
              @keyframes dashMove { to { stroke-dashoffset: -40; } }
              @keyframes stepFadeUp {
                from { opacity: 0; transform: translateY(24px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="relative flex flex-col items-center text-center"
                  style={{ opacity: 0, animation: `stepFadeUp 0.5s ease forwards`, animationDelay: `${i * 150}ms` }}
                >
                  {/* Mobile connector */}
                  {i < STEPS.length - 1 && (
                    <div className="md:hidden absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-px h-10" aria-hidden="true">
                      <svg className="w-4 h-10 overflow-visible" viewBox="0 0 4 40">
                        <line x1="2" y1="0" x2="2" y2="40" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" style={{ animation: "dashMove 2s linear infinite" }} />
                      </svg>
                    </div>
                  )}

                  <div className="w-full bg-[#292524]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-amber/40 transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-foreground font-bold text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-white font-semibold text-base leading-snug">{step.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sub-section B: 6 feature cards ── */}
      <section className="bg-white py-20 px-4" ref={featuresRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Deine Vorteile
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Warum NimmMeinAuto?
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Kein Stress mit Privatanzeigen. Keine Verhandlungen. Nur faire Preise.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="border border-border rounded-2xl p-6 bg-white hover:shadow-hover transition-all duration-300"
                style={{
                  opacity: featuresVisible ? 1 : 0,
                  transform: featuresVisible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.4s ease, transform 0.4s ease`,
                  transitionDelay: featuresVisible ? `${i * 100}ms` : "0ms",
                }}
              >
                <div className={`w-11 h-11 rounded-xl ${feat.colorClass} flex items-center justify-center mb-4`}>
                  {feat.icon}
                </div>
                <h3 className="text-foreground font-semibold text-sm md:text-base mb-1.5">{feat.title}</h3>
                <p className="text-foreground-muted text-xs md:text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sub-section C: Comparison table ── */}
      <section className="bg-[#FAFAF9] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-amber/10 text-amber-dark text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Vergleich
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              NimmMeinAuto vs. Alternativen
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Warum immer mehr Österreicher ihr Auto direkt an uns verkaufen.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 text-left text-foreground-muted font-medium w-1/4">Merkmal</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground bg-amber/5 border-x border-amber/20">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-amber-dark">NimmMeinAuto</span>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber text-white text-xs font-bold">✓</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-foreground-muted font-medium">Privatinserat</th>
                  <th className="px-4 py-4 text-center text-foreground-muted font-medium">Direkt zum Händler</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-stone-50/60"}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{row}</td>
                    <td className="px-4 py-3 text-center bg-amber/5 border-x border-amber/20">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber/20 text-amber-dark"><CheckIcon /></span>
                    </td>
                    <ComparisonCell value={COMPARISON_DATA[i][1]} />
                    <ComparisonCell value={COMPARISON_DATA[i][2]} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-foreground-muted text-xs mt-4">
            ✓ = Ja &nbsp;·&nbsp; — = Teilweise &nbsp;·&nbsp; ✗ = Nein
          </p>
        </div>
      </section>
    </>
  );
}
