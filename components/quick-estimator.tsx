"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { BRANDS } from "@/lib/brands";

// Basis-Restwertpreise je Marke (in Cent), falls avgPrice fehlt.
const FALLBACK_BASE = 12_000_00; // 12.000 €

function parseEurCents(s: string | undefined): number {
  if (!s) return FALLBACK_BASE;
  const num = Number(s.replace(/[€\s.]/g, "").replace(",", "."));
  return isNaN(num) ? FALLBACK_BASE : Math.round(num * 100);
}

const CONDITION_MULT: Record<string, number> = {
  "Sehr gut": 1.08,
  Gut: 1.0,
  Gebraucht: 0.86,
  "Stark gebraucht": 0.70,
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 26 }, (_, i) => CURRENT_YEAR - i);

function calcEstimate(
  brandSlug: string,
  year: number,
  km: number,
  condition: string
): { low: number; mid: number; high: number } | null {
  const brand = BRANDS.find((b) => b.slug === brandSlug);
  if (!brand) return null;

  const base = parseEurCents(brand.avgPrice);
  const age = CURRENT_YEAR - year;
  // Depreciation: 12 % first year, 8 % subsequent, floor at 25 % of base.
  const depreciationFactor = Math.max(0.25, 1 - (age > 0 ? 0.12 + (age - 1) * 0.08 : 0));
  // KM penalty: −0.8 % per 10 000 km above 15 000 (typical annual) * age
  const baseKm = 15_000 * Math.max(1, age);
  const kmPenalty = Math.max(0.65, 1 - Math.max(0, (km - baseKm) / 10_000) * 0.008);
  const condMult = CONDITION_MULT[condition] ?? 1.0;
  const mid = Math.round((base * depreciationFactor * kmPenalty * condMult) / 100) * 100;

  return {
    mid,
    low: Math.round((mid * 0.91) / 100) * 100,
    high: Math.round((mid * 1.09) / 100) * 100,
  };
}

function fmt(cents: number): string {
  return (cents / 100).toLocaleString("de-AT");
}

export function QuickEstimator() {
  const [brandSlug, setBrandSlug] = useState("vw");
  const [year, setYear] = useState(CURRENT_YEAR - 4);
  const [km, setKm] = useState(60000);
  const [condition, setCondition] = useState("Gut");
  const [showResult, setShowResult] = useState(false);

  const estimate = useMemo(
    () => calcEstimate(brandSlug, year, km, condition),
    [brandSlug, year, km, condition]
  );

  const brand = BRANDS.find((b) => b.slug === brandSlug);
  const conditions = Object.keys(CONDITION_MULT);

  function handleCalculate() {
    setShowResult(true);
  }

  const params = new URLSearchParams({
    marke: brandSlug,
    jahr: String(year),
    km: String(km),
    zustand: condition,
  });

  return (
    <div className="bg-[#292524]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-amber/10 w-full max-w-sm">
      <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
        Sofort-Schätzer
      </div>

      <div className="space-y-3 mb-4">
        {/* Marke */}
        <div>
          <label className="block text-xs text-stone-400 mb-1">Marke</label>
          <select
            value={brandSlug}
            onChange={(e) => { setBrandSlug(e.target.value); setShowResult(false); }}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber/50"
          >
            {BRANDS.map((b) => (
              <option key={b.slug} value={b.slug} className="bg-[#1C1917]">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Jahr + KM */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-stone-400 mb-1">Baujahr</label>
            <select
              value={year}
              onChange={(e) => { setYear(Number(e.target.value)); setShowResult(false); }}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber/50"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-[#1C1917]">
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Kilometer</label>
            <input
              type="number"
              min={0}
              max={500000}
              step={1000}
              value={km}
              onChange={(e) => { setKm(Number(e.target.value)); setShowResult(false); }}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber/50"
            />
          </div>
        </div>

        {/* Zustand */}
        <div>
          <label className="block text-xs text-stone-400 mb-1">Zustand</label>
          <div className="grid grid-cols-2 gap-1.5">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCondition(c); setShowResult(false); }}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  condition === c
                    ? "bg-amber text-[#1C1917] shadow-sm"
                    : "bg-black/20 border border-white/10 text-stone-300 hover:border-amber/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculate button or result */}
      {!showResult ? (
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full py-2.5 bg-amber hover:bg-amber-dark text-[#1C1917] font-bold rounded-lg text-sm transition-colors"
        >
          Wert schätzen
        </button>
      ) : estimate ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-black/30 rounded-xl p-4 mb-3 border border-white/5">
            <div className="text-stone-400 text-xs mb-0.5">
              {brand?.name} · {year} · {km.toLocaleString("de-AT")} km · {condition}
            </div>
            <div className="text-xs text-stone-500 mb-2">Geschätzter Marktwert</div>
            <div className="text-3xl font-bold text-amber">
              € {fmt(estimate.mid)}
            </div>
            <div className="text-stone-400 text-xs mt-1">
              Spanne: € {fmt(estimate.low)} – € {fmt(estimate.high)}
            </div>
          </div>
          <p className="text-xs text-stone-500 mb-3 text-center">
            Orientierungswert · Exaktes Angebot nach vollständiger Bewertung
          </p>
          <Link
            href={`/auto-bewerten?${params.toString()}`}
            className="block w-full py-2.5 bg-amber hover:bg-amber-dark text-[#1C1917] font-bold rounded-lg text-sm text-center transition-colors"
          >
            Vollständige Bewertung starten →
          </Link>
          <button
            type="button"
            onClick={() => setShowResult(false)}
            className="block w-full mt-2 text-xs text-stone-500 hover:text-stone-300 text-center transition-colors"
          >
            Andere Daten eingeben
          </button>
        </div>
      ) : null}
    </div>
  );
}
