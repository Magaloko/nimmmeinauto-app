"use client";

import { useState, useCallback } from "react";
import { Button, Card, CardContent, Input, Label } from "@/components/ui";
import { Navbar } from "../../components/navbar";
import { submitListing } from "../actions";

// ─── Valuation engine ───────────────────────────────────────────────────────
const BASE_PRICES: Record<string, Record<string, number>> = {
  "BMW": { "3er": 2800000, "5er": 4500000, "1er": 2200000, "X3": 3800000, "X5": 5500000 },
  "Mercedes-Benz": { "A-Klasse": 2500000, "C-Klasse": 3200000, "E-Klasse": 4800000, "GLC": 4200000, "Sprinter": 3500000 },
  "Audi": { "A3": 2400000, "A4": 3200000, "A6": 4500000, "Q3": 3000000, "Q5": 4000000 },
  "Volkswagen": { "Golf": 2200000, "Passat": 2800000, "Tiguan": 3200000, "Polo": 1800000, "T-Roc": 2600000 },
  "Skoda": { "Octavia": 2000000, "Fabia": 1600000, "Superb": 2800000, "Karoq": 2400000, "Kodiaq": 3000000 },
  "Seat": { "Leon": 1900000, "Ibiza": 1700000, "Ateca": 2500000, "Tarraco": 2900000 },
  "Ford": { "Focus": 1800000, "Fiesta": 1500000, "Kuga": 2600000, "Mondeo": 2200000 },
  "Opel": { "Astra": 1700000, "Corsa": 1500000, "Insignia": 2400000, "Mokka": 2200000 },
  "Toyota": { "Corolla": 2100000, "Yaris": 1600000, "RAV4": 3200000, "C-HR": 2600000 },
  "Hyundai": { "i30": 1900000, "i20": 1600000, "Tucson": 2800000, "Kona": 2400000 },
  "Kia": { "Sportage": 2600000, "Ceed": 1900000, "Sorento": 3400000, "Stonic": 2200000 },
  "Renault": { "Clio": 1600000, "Megane": 1900000, "Kadjar": 2300000, "Zoe": 2100000 },
  "Peugeot": { "208": 1700000, "308": 2100000, "3008": 2800000, "5008": 3200000 },
  "Fiat": { "500": 1400000, "Punto": 1300000, "Tipo": 1600000, "Panda": 1200000 },
};

const CONDITION_FACTOR: Record<string, number> = {
  EXCELLENT: 1.0,
  GOOD: 0.85,
  FAIR: 0.65,
  DAMAGED: 0.40,
};

function calcValue(make: string, model: string, year: number, mileage: number, condition: string): number {
  const base = BASE_PRICES[make]?.[model] ?? 2000000;
  const age = new Date().getFullYear() - year;
  const avgKm = age * 15000;
  const kmFactor = Math.max(0.3, 1 - Math.max(0, ((mileage - avgKm) / 10000) * 0.01));
  const ageFactor = Math.max(0.3, 1 - age * 0.06);
  const cf = CONDITION_FACTOR[condition] ?? 0.85;
  return Math.round(base * kmFactor * ageFactor * cf);
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1
  make: string;
  model: string;
  year: string;
  fuel: string;
  transmission: string;
  // Step 2
  mileage: string;
  condition: string;
  hasAccident: boolean;
  nextTuev: string;
  // Step 3 — photos (mock)
  // Step 4
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  plz: string;
  agb: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2009 }, (_, i) => String(CURRENT_YEAR - i));

// Curated Austrian-market makes list (ordered by popularity)
const MAKES = [
  'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Skoda', 'Ford',
  'Opel', 'Toyota', 'Hyundai', 'Kia', 'Renault', 'Peugeot',
  'Seat', 'Cupra', 'Citroën', 'Fiat', 'Alfa Romeo', 'Mazda',
  'Honda', 'Nissan', 'Volvo', 'Jeep', 'Land Rover', 'Porsche',
  'Tesla', 'MINI', 'Suzuki', 'Dacia', 'Mitsubishi', 'Subaru',
  'Lexus', 'Jaguar', 'Smart', 'Saab', 'Lancia', 'Chrysler',
];

const conditionOptions = [
  {
    key: "EXCELLENT", label: "Sehr gut", desc: "Kein Schaden, wie neu",
    icon: <svg className="w-6 h-6 text-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>,
  },
  {
    key: "GOOD", label: "Gut", desc: "Normale Gebrauchsspuren",
    icon: <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    key: "FAIR", label: "Gebraucht", desc: "Sichtbare Mängel",
    icon: <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  },
  {
    key: "DAMAGED", label: "Beschädigt", desc: "Erhebliche Schäden",
    icon: <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  },
];

const fuelOptions = [
  {
    key: "benzin", label: "Benzin",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l2-7h10l2 7h2v10H3V10zm4 0h10M7 14h.01M17 14h.01"/></svg>,
  },
  {
    key: "diesel", label: "Diesel",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>,
  },
  {
    key: "elektro", label: "Elektro",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  },
  {
    key: "hybrid", label: "Hybrid",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  },
  {
    key: "lpg", label: "LPG",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>,
  },
];

export default function AutoBewertenPage() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [form, setForm] = useState<FormData>({
    make: "",
    model: "",
    year: "",
    fuel: "",
    transmission: "",
    mileage: "",
    condition: "",
    hasAccident: false,
    nextTuev: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    plz: "",
    agb: false,
  });

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }

  const fetchModels = useCallback(async (make: string) => {
    if (!make) { setModels([]); return; }
    setLoadingModels(true);
    try {
      const res = await fetch(`/api/cars/models?make=${encodeURIComponent(make)}`);
      const data = await res.json() as string[];
      setModels(Array.isArray(data) ? data : []);
    } catch {
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  }, []);

  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!form.make) e.make = "Bitte Marke wählen";
    if (!form.model) e.model = "Bitte Modell wählen";
    if (!form.year) e.year = "Bitte Baujahr wählen";
    if (!form.fuel) e.fuel = "Bitte Kraftstoff wählen";
    if (!form.transmission) e.transmission = "Bitte Getriebe wählen";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {};
    if (!form.mileage || isNaN(Number(form.mileage))) e.mileage = "Bitte gültigen Kilometerstand eingeben";
    if (!form.condition) e.condition = "Bitte Fahrzeugzustand wählen";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep4(): boolean {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Pflichtfeld";
    if (!form.lastName.trim()) e.lastName = "Pflichtfeld";
    if (!form.phone.trim()) e.phone = "Pflichtfeld";
    if (!form.email.includes("@")) e.email = "Gültige E-Mail erforderlich";
    if (!/^\d{4}$/.test(form.plz)) e.plz = "4-stellige PLZ erforderlich";
    if (!form.agb) e.agb = "Bitte AGB zustimmen";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    if (!validateStep4()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const estimated_value_cents = calcValue(
      form.make,
      form.model,
      Number(form.year),
      Number(form.mileage),
      form.condition
    );

    try {
      await submitListing({
        make: form.make,
        model: form.model,
        year: Number(form.year),
        mileage: Number(form.mileage),
        fuel: form.fuel,
        transmission: form.transmission,
        condition: form.condition,
        has_accident_history: form.hasAccident,
        tuv_date: form.nextTuev || undefined,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        email: form.email,
        postal_code: form.plz,
        estimated_value_cents,
      });
    } catch (err) {
      setSubmitError("Fehler beim Speichern. Bitte erneut versuchen.");
      setIsSubmitting(false);
    }
  }

  const progressPct = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar app="nimm" />

      {/* Hero bar */}
      <div className="bg-[#1C1917] text-white py-3 px-4 text-center text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4 text-amber" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
          Bewertung in 2 Minuten · Kostenlos &amp; unverbindlich
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-primary">Schritt {step} von 4</span>
            <span className="text-sm text-foreground-muted">
              {step === 1 && "Fahrzeugdaten"}
              {step === 2 && "Fahrzeugzustand"}
              {step === 3 && "Fotos"}
              {step === 4 && "Kontaktdaten"}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-amber h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  s < step
                    ? "bg-amber border-amber text-foreground"
                    : s === step
                    ? "bg-primary border-primary text-white"
                    : "bg-muted border-border text-foreground-muted"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-card rounded-2xl">
          <CardContent className="p-8">
            {/* ─── Step 1: Fahrzeugdaten ─────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Fahrzeugdaten</h2>
                  <p className="text-foreground-muted text-sm">Erzähl uns von deinem Auto.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="make">Marke *</Label>
                    <select
                      id="make"
                      value={form.make}
                      onChange={(e) => { set("make", e.target.value); set("model", ""); fetchModels(e.target.value); }}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Marke wählen</option>
                      {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {errors.make && <p className="text-destructive text-xs">{errors.make}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="model">Modell *</Label>
                    <select
                      id="model"
                      value={form.model}
                      onChange={(e) => set("model", e.target.value)}
                      disabled={!form.make || loadingModels}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    >
                      <option value="">{loadingModels ? 'Lade Modelle...' : 'Modell wählen'}</option>
                      {models.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {errors.model && <p className="text-destructive text-xs">{errors.model}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="year">Baujahr *</Label>
                  <select
                    id="year"
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Jahr wählen</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <p className="text-destructive text-xs">{errors.year}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Kraftstoff *</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {fuelOptions.map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set("fuel", key)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all text-xs font-medium ${
                          form.fuel === key
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 text-foreground-muted"
                        }`}
                      >
                        <span className={form.fuel === key ? "text-primary" : "text-foreground-muted"}>{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.fuel && <p className="text-destructive text-xs">{errors.fuel}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Getriebe *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        key: "manual", label: "Schaltgetriebe",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path strokeLinecap="round" d="M7 9v3m5-3v3m5-3v3M7 15v-1m10-1v2"/></svg>,
                      },
                      {
                        key: "auto", label: "Automatik",
                        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
                      },
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set("transmission", key)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                          form.transmission === key
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 text-foreground-muted"
                        }`}
                      >
                        <span className={form.transmission === key ? "text-primary" : "text-foreground-muted"}>{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.transmission && <p className="text-destructive text-xs">{errors.transmission}</p>}
                </div>
              </div>
            )}

            {/* ─── Step 2: Zustand ───────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Fahrzeugzustand</h2>
                  <p className="text-foreground-muted text-sm">Je genauer, desto besser das Angebot.</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mileage">Kilometerstand *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="z.B. 85000"
                    value={form.mileage}
                    onChange={(e) => set("mileage", e.target.value)}
                    min={0}
                  />
                  {errors.mileage && <p className="text-destructive text-xs">{errors.mileage}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Fahrzeugzustand *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {conditionOptions.map(({ key, label, desc, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => set("condition", key)}
                        className={`flex flex-col gap-1 p-4 rounded-xl border-2 text-left transition-all ${
                          form.condition === key
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span>{icon}</span>
                        <span className="font-semibold text-sm text-foreground">{label}</span>
                        <span className="text-xs text-foreground-muted">{desc}</span>
                      </button>
                    ))}
                  </div>
                  {errors.condition && <p className="text-destructive text-xs">{errors.condition}</p>}
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/50">
                  <input
                    id="accident"
                    type="checkbox"
                    checked={form.hasAccident}
                    onChange={(e) => set("hasAccident", e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary"
                  />
                  <div>
                    <Label htmlFor="accident" className="cursor-pointer">Unfallfahrzeug?</Label>
                    <p className="text-xs text-foreground-muted">War das Fahrzeug in einen Unfall verwickelt?</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tuev">Nächste TÜV-Prüfung (optional)</Label>
                  <Input
                    id="tuev"
                    type="date"
                    value={form.nextTuev}
                    onChange={(e) => set("nextTuev", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ─── Step 3: Fotos ─────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Fotos hochladen</h2>
                  <p className="text-foreground-muted text-sm">Gute Fotos = bessere Angebote.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {["Vorne links", "Vorne rechts", "Hinten links", "Hinten rechts", "Innenraum", "Tacho"].map((label) => (
                    <div
                      key={label}
                      className="aspect-square border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <svg className="w-6 h-6 text-foreground-muted group-hover:text-primary group-hover:scale-110 transition-all" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      <span className="text-xs text-foreground-muted text-center px-2">Foto hinzufügen</span>
                      <span className="text-xs text-foreground-muted/60 text-center px-2">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p className="text-sm text-primary/80">
                    <strong>Demo-Hinweis:</strong> Fotos werden in der finalen Version direkt gespeichert. Du kannst jetzt ohne Fotos fortfahren.
                  </p>
                </div>
              </div>
            )}

            {/* ─── Step 4: Kontakt ───────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Kontaktdaten</h2>
                  <p className="text-foreground-muted text-sm">Damit Händler dich kontaktieren können.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      placeholder="Max"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                    />
                    {errors.firstName && <p className="text-destructive text-xs">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      placeholder="Mustermann"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                    />
                    {errors.lastName && <p className="text-destructive text-xs">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+43 664 123 4567"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="max@beispiel.at"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="plz">PLZ (Österreich) *</Label>
                  <Input
                    id="plz"
                    placeholder="1010"
                    maxLength={4}
                    value={form.plz}
                    onChange={(e) => set("plz", e.target.value.replace(/\D/g, ""))}
                  />
                  {errors.plz && <p className="text-destructive text-xs">{errors.plz}</p>}
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/50">
                  <input
                    id="agb"
                    type="checkbox"
                    checked={form.agb}
                    onChange={(e) => set("agb", e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary mt-0.5"
                  />
                  <Label htmlFor="agb" className="cursor-pointer text-sm font-normal leading-relaxed text-foreground">
                    Ich stimme den{" "}
                    <a href="#" className="text-primary underline">Allgemeinen Geschäftsbedingungen</a>{" "}
                    und der{" "}
                    <a href="#" className="text-primary underline">Datenschutzerklärung</a>{" "}
                    zu.
                  </Label>
                </div>
                {errors.agb && <p className="text-destructive text-xs -mt-4">{errors.agb}</p>}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={isSubmitting}>
                  ← Zurück
                </Button>
              ) : (
                <div />
              )}

              {step < 3 && (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary-dark text-white font-semibold">
                  Weiter
                </Button>
              )}

              {step === 3 && (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(4)}>
                    Weiter ohne Fotos
                  </Button>
                  <Button onClick={() => setStep(4)} className="bg-primary hover:bg-primary-dark text-white font-semibold">
                    Weiter
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col items-end gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    size="lg"
                    className="bg-amber hover:bg-amber-dark text-foreground font-bold"
                  >
                    {isSubmitting ? "Wird gespeichert..." : "Bewertung berechnen"}
                  </Button>
                  {submitError && <p className="text-destructive text-sm">{submitError}</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-foreground-muted mt-6 inline-flex items-center gap-1.5 justify-center w-full">
          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
          SSL-verschlüsselt · DSGVO-konform · Daten werden nicht ohne Zustimmung weitergegeben
        </p>
      </div>
    </div>
  );
}
