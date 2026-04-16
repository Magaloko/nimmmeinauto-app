"use client";

import { useState } from "react";
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

const MODELS: Record<string, string[]> = {
  "BMW": ["1er", "3er", "5er", "X3", "X5"],
  "Mercedes-Benz": ["A-Klasse", "C-Klasse", "E-Klasse", "GLC", "Sprinter"],
  "Audi": ["A3", "A4", "A6", "Q3", "Q5"],
  "Volkswagen": ["Golf", "Passat", "Tiguan", "Polo", "T-Roc"],
  "Skoda": ["Octavia", "Fabia", "Superb", "Karoq", "Kodiaq"],
  "Seat": ["Leon", "Ibiza", "Ateca", "Tarraco"],
  "Ford": ["Focus", "Fiesta", "Kuga", "Mondeo"],
  "Opel": ["Astra", "Corsa", "Insignia", "Mokka"],
  "Toyota": ["Corolla", "Yaris", "RAV4", "C-HR"],
  "Hyundai": ["i30", "i20", "Tucson", "Kona"],
  "Kia": ["Sportage", "Ceed", "Sorento", "Stonic"],
  "Renault": ["Clio", "Megane", "Kadjar", "Zoe"],
  "Peugeot": ["208", "308", "3008", "5008"],
  "Fiat": ["500", "Punto", "Tipo", "Panda"],
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
const MAKES = Object.keys(MODELS);

const conditionOptions = [
  { key: "EXCELLENT", label: "Sehr gut", desc: "Kein Schaden, wie neu", emoji: "⭐" },
  { key: "GOOD", label: "Gut", desc: "Normale Gebrauchsspuren", emoji: "👍" },
  { key: "FAIR", label: "Gebraucht", desc: "Sichtbare Mängel", emoji: "🔧" },
  { key: "DAMAGED", label: "Beschädigt", desc: "Erhebliche Schäden", emoji: "⚠️" },
];

const fuelOptions = [
  { key: "benzin", label: "Benzin", icon: "⛽" },
  { key: "diesel", label: "Diesel", icon: "🛢️" },
  { key: "elektro", label: "Elektro", icon: "⚡" },
  { key: "hybrid", label: "Hybrid", icon: "🔋" },
  { key: "lpg", label: "LPG", icon: "🔵" },
];

export default function AutoBewertenPage() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
        🚗 Bewertung in 2 Minuten · Kostenlos & unverbindlich
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
                      onChange={(e) => { set("make", e.target.value); set("model", ""); }}
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
                      disabled={!form.make}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    >
                      <option value="">Modell wählen</option>
                      {(MODELS[form.make] ?? []).map((m) => <option key={m} value={m}>{m}</option>)}
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
                        <span className="text-xl">{icon}</span>
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
                      { key: "manual", label: "Schaltgetriebe", icon: "⚙️" },
                      { key: "auto", label: "Automatik", icon: "🔄" },
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
                        <span className="text-2xl">{icon}</span>
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
                    {conditionOptions.map(({ key, label, desc, emoji }) => (
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
                        <span className="text-2xl">{emoji}</span>
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
                      <span className="text-2xl group-hover:scale-110 transition-transform">📷</span>
                      <span className="text-xs text-foreground-muted text-center px-2">Foto hinzufügen</span>
                      <span className="text-xs text-foreground-muted/60 text-center px-2">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <span className="text-primary text-lg mt-0.5">ℹ️</span>
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
                  Weiter →
                </Button>
              )}

              {step === 3 && (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(4)}>
                    Weiter ohne Fotos
                  </Button>
                  <Button onClick={() => setStep(4)} className="bg-primary hover:bg-primary-dark text-white font-semibold">
                    Weiter →
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
                    {isSubmitting ? "Wird gespeichert..." : "Bewertung berechnen →"}
                  </Button>
                  {submitError && <p className="text-destructive text-sm">{submitError}</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-foreground-muted mt-6">
          🔒 SSL-verschlüsselt · DSGVO-konform · Daten werden nicht ohne Zustimmung weitergegeben
        </p>
      </div>
    </div>
  );
}
