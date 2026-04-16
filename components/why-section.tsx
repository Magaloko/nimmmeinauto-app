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
    title: "Auto-Daten eingeben",
    desc: "In 2 Minuten alle Fahrzeugdaten ausfüllen.",
    icon: (
      <svg
        className="w-7 h-7 text-amber"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Sofort-Schätzung",
    desc: "KI-gestützte Marktbewertung direkt anzeigen.",
    icon: (
      <svg
        className="w-7 h-7 text-amber"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Händler bieten",
    desc: "Geprüfte Händler aus ganz Österreich machen Angebote.",
    icon: (
      <svg
        className="w-7 h-7 text-amber"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    num: 4,
    title: "Bestes Angebot annehmen",
    desc: "Auszahlung direkt vom Händler, kein Stress.",
    icon: (
      <svg
        className="w-7 h-7 text-amber"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

// ── Sub-section B helpers ────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "Kostenlos & unverbindlich",
    desc: "Keine Gebühren, keine Verpflichtungen.",
    colorClass: "bg-green-50 text-green-600",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Beste Marktpreise",
    desc: "Händlerwettbewerb sorgt für faire Preise.",
    colorClass: "bg-amber/20 text-amber-dark",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    title: "Schnell — Ø 4h",
    desc: "Erste Angebote oft schon nach wenigen Stunden.",
    colorClass: "bg-blue-50 text-blue-600",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Datenschutz",
    desc: "DSGVO-konform. Deine Daten nur für verifizierte Händler.",
    colorClass: "bg-purple-50 text-purple-600",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Geprüfte Händler",
    desc: "Nur gewerberechtlich registrierte österreichische Kfz-Betriebe.",
    colorClass: "bg-stone-100 text-stone-600",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
  {
    title: "Österreichweit",
    desc: "Käufer aus allen 9 Bundesländern.",
    colorClass: "bg-red-50 text-red-600",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

// ── Sub-section C helpers ────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  "Kostenlos",
  "Mehrere Angebote gleichzeitig",
  "Keine Verhandlungen",
  "Faire Marktpreise",
  "Schnelle Abwicklung",
  "Geprüfte Käufer",
];

// true = checkmark, false = X, "partial" = partial
type CellValue = true | false | "partial";

const COMPARISON_DATA: [CellValue, CellValue, CellValue][] = [
  [true, true, false],
  [true, false, false],
  [true, false, false],
  [true, "partial", "partial"],
  [true, false, "partial"],
  [true, false, false],
];

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PartialIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ComparisonCell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber/20 text-amber-dark">
          <CheckIcon />
        </span>
      </td>
    );
  }
  if (value === "partial") {
    return (
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-400">
          <PartialIcon />
        </span>
      </td>
    );
  }
  return (
    <td className="px-4 py-3 text-center">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-400">
        <XIcon />
      </span>
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Sub-section A: 4-step process ─── */}
      <section className="bg-[#1C1917] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-amber/20 text-amber text-xs font-semibold px-3 py-1 rounded-full mb-3">
              So funktioniert&apos;s
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              In 4 Schritten zum besten Preis
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto">
              Schnell, einfach und ohne Stress – dein Auto verkaufen war noch nie so unkompliziert.
            </p>
          </div>

          {/* Steps grid */}
          <div className="relative">
            {/* Desktop connector line */}
            <div
              className="hidden md:block absolute top-[3.25rem] left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px"
              aria-hidden="true"
            >
              <svg
                className="w-full h-6 overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 6"
              >
                <line
                  x1="0"
                  y1="3"
                  x2="100"
                  y2="3"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  style={{
                    strokeDashoffset: 0,
                    animation: "dashMove 3s linear infinite",
                  }}
                />
              </svg>
            </div>

            <style>{`
              @keyframes dashMove {
                to { stroke-dashoffset: -40; }
              }
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
                  style={{
                    opacity: 0,
                    animation: `stepFadeUp 0.5s ease forwards`,
                    animationDelay: `${i * 150}ms`,
                  }}
                >
                  {/* Mobile vertical connector */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="md:hidden absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-px h-10"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-4 h-10 overflow-visible"
                        viewBox="0 0 4 40"
                      >
                        <line
                          x1="2"
                          y1="0"
                          x2="2"
                          y2="40"
                          stroke="#F59E0B"
                          strokeWidth="2"
                          strokeDasharray="5 4"
                          strokeLinecap="round"
                          style={{
                            animation: "dashMove 2s linear infinite",
                          }}
                        />
                      </svg>
                    </div>
                  )}

                  {/* Card */}
                  <div className="w-full bg-[#292524] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-amber/30 transition-colors duration-300">
                    {/* Step badge */}
                    <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-foreground font-bold text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-white font-semibold text-base leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-stone-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
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
                <div
                  className={`w-11 h-11 rounded-xl ${feat.colorClass} flex items-center justify-center mb-4`}
                >
                  {feat.icon}
                </div>
                <h3 className="text-foreground font-semibold text-sm md:text-base mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-foreground-muted text-xs md:text-sm leading-relaxed">
                  {feat.desc}
                </p>
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
              Warum immer mehr Österreicher auf uns setzen.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 text-left text-foreground-muted font-medium w-1/4">
                    Merkmal
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-foreground bg-amber/5 border-x border-amber/20">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-amber-dark">NimmMeinAuto</span>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber text-white text-xs font-bold">
                        ✓
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-foreground-muted font-medium">
                    Privatinserat
                  </th>
                  <th className="px-4 py-4 text-center text-foreground-muted font-medium">
                    Direktverkauf an Händler
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row}
                    className={`border-b border-border last:border-0 ${
                      i % 2 === 0 ? "bg-white" : "bg-stone-50/60"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row}
                    </td>
                    <td className="px-4 py-3 text-center bg-amber/5 border-x border-amber/20">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber/20 text-amber-dark">
                        <CheckIcon />
                      </span>
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
