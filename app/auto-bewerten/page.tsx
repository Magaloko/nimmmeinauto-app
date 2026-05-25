"use client";

import { useState, useCallback, useEffect } from "react";
import type { CarSpecs } from "@/app/api/cars/specs/route";
import { Button, Card, CardContent, Input, Label } from "@/components/ui";
import { Navbar } from "../../components/navbar";
import { PhotoUpload, type UploadedPhoto } from "../../components/photo-upload";
import { submitListing } from "../actions";

// ─── Valuation engine ───────────────────────────────────────────────────────
// Model names match the API output (NHTSA English names for major brands,
// local names for European brands served from LOCAL_MODELS in /api/cars/models)
const BASE_PRICES: Record<string, Record<string, number>> = {
  // BMW – NHTSA returns "3 Series", "5 Series", etc.
  "BMW": {
    "1 Series": 2200000, "2 Series": 2500000, "3 Series": 2800000,
    "4 Series": 3200000, "5 Series": 4500000, "7 Series": 6500000,
    "X1": 2800000, "X2": 2600000, "X3": 3800000, "X4": 4000000,
    "X5": 5500000, "X6": 5800000, "i3": 2400000, "i4": 4500000,
  },
  // Mercedes-Benz – NHTSA returns "C-Class", "E-Class", etc.
  "Mercedes-Benz": {
    "A-Class": 2500000, "B-Class": 2300000, "C-Class": 3200000,
    "E-Class": 4800000, "S-Class": 8000000, "GLA": 3000000,
    "GLB": 3400000, "GLC": 4200000, "GLE": 5500000, "GLS": 7000000,
    "Sprinter": 3500000, "Vito": 3000000, "CLA": 3000000, "CLS": 5000000,
  },
  // Audi – NHTSA returns "A3", "A4", etc. (already matching)
  "Audi": {
    "A1": 1800000, "A3": 2400000, "A4": 3200000, "A5": 3800000,
    "A6": 4500000, "A7": 5500000, "A8": 7000000,
    "Q2": 2400000, "Q3": 3000000, "Q5": 4000000, "Q7": 5500000, "Q8": 6500000,
    "TT": 3800000, "e-tron": 4800000,
  },
  // Volkswagen – model names match NHTSA
  "Volkswagen": {
    "Polo": 1800000, "Golf": 2200000, "Golf Plus": 2000000,
    "Passat": 2800000, "Tiguan": 3200000, "Touareg": 5000000,
    "T-Roc": 2600000, "T-Cross": 2200000, "ID.3": 3200000, "ID.4": 4000000,
    "Caddy": 2400000, "Transporter": 3000000, "Sharan": 2800000, "Touran": 2500000,
  },
  // European brands – names match LOCAL_MODELS in /api/cars/models
  "Skoda": {
    "Fabia": 1600000, "Octavia": 2000000, "Superb": 2800000,
    "Kamiq": 2000000, "Karoq": 2400000, "Kodiaq": 3000000,
    "Scala": 1900000, "Enyaq": 3800000, "Rapid": 1500000,
  },
  "Seat": {
    "Mii": 1200000, "Ibiza": 1700000, "Leon": 1900000,
    "Arona": 2100000, "Ateca": 2500000, "Tarraco": 2900000,
  },
  "Cupra": { "Born": 3500000, "Formentor": 3200000, "Leon": 2800000, "Ateca": 3000000 },
  "Opel": {
    "Corsa": 1500000, "Astra": 1700000, "Insignia": 2400000,
    "Crossland": 1900000, "Grandland": 2600000, "Mokka": 2200000, "Zafira": 2000000,
  },
  "Renault": {
    "Twingo": 1200000, "Clio": 1600000, "Megane": 1900000,
    "Captur": 2100000, "Kadjar": 2300000, "Scenic": 2200000,
    "Laguna": 1800000, "Koleos": 2600000, "Zoe": 2100000, "Kangoo": 2200000,
  },
  "Peugeot": {
    "107": 900000, "108": 1000000, "206": 900000, "207": 1100000,
    "208": 1700000, "308": 2100000, "2008": 2200000,
    "3008": 2800000, "5008": 3200000, "508": 3500000,
  },
  "Citroën": {
    "C1": 1000000, "C2": 1000000, "C3": 1400000, "C4": 2000000,
    "C5": 2400000, "Berlingo": 2000000, "Picasso": 1800000,
    "DS3": 1800000, "DS5": 2800000,
  },
  "Dacia": {
    "Logan": 1000000, "Sandero": 1200000, "Duster": 1700000,
    "Jogger": 1800000, "Spring": 1400000,
  },
  // Common makes with NHTSA-aligned names
  "Ford": {
    "Ka": 900000, "Fiesta": 1500000, "Focus": 1800000,
    "Mondeo": 2200000, "Kuga": 2600000, "Edge": 3200000,
    "Puma": 2200000, "Explorer": 4000000, "Mustang": 5000000,
  },
  "Toyota": {
    "Aygo": 1100000, "Yaris": 1600000, "Corolla": 2100000,
    "Auris": 1800000, "Avensis": 2200000, "C-HR": 2600000,
    "RAV4": 3200000, "Land Cruiser": 5500000, "Prius": 2200000, "Camry": 3000000,
  },
  "Hyundai": {
    "i10": 1200000, "i20": 1600000, "i30": 1900000,
    "Tucson": 2800000, "Santa Fe": 3800000, "Kona": 2400000, "Ioniq": 2800000,
  },
  "Kia": {
    "Picanto": 1200000, "Rio": 1500000, "Ceed": 1900000,
    "Stonic": 2200000, "Sportage": 2600000, "Sorento": 3400000, "Niro": 2600000,
  },
  "Mazda": {
    "Mazda2": 1600000, "Mazda3": 2200000, "Mazda6": 2800000,
    "CX-3": 2200000, "CX-5": 3000000, "CX-30": 2800000, "MX-5": 3200000,
  },
  "Honda": {
    "Jazz": 1700000, "Civic": 2200000, "Accord": 2800000,
    "CR-V": 3200000, "HR-V": 2400000, "e": 2800000,
  },
  "Fiat": {
    "500": 1400000, "Panda": 1200000, "Tipo": 1600000,
    "500X": 2000000, "500L": 1800000,
  },
  "Volvo": {
    "V40": 2800000, "V60": 3800000, "V90": 5000000,
    "S60": 3500000, "S90": 5500000, "XC40": 3800000, "XC60": 4800000, "XC90": 6000000,
  },
  "Porsche": {
    "911": 10000000, "Cayenne": 8000000, "Macan": 5500000,
    "Panamera": 9000000, "Taycan": 9500000, "Boxster": 6000000,
  },
  "Tesla": {
    "Model 3": 4500000, "Model S": 7000000,
    "Model X": 8000000, "Model Y": 5000000,
  },
  "MINI": {
    "Mini": 2200000, "Countryman": 2800000, "Clubman": 2500000, "Paceman": 2400000,
  },
  "Nissan": {
    "Micra": 1400000, "Note": 1500000, "Juke": 2200000,
    "Qashqai": 2800000, "X-Trail": 3200000, "Leaf": 2500000, "GT-R": 8000000,
  },
  "Suzuki": {
    "Swift": 1500000, "Ignis": 1400000, "Vitara": 2200000,
    "SX4": 1900000, "Jimny": 2200000,
  },
  "Mitsubishi": {
    "Colt": 1300000, "ASX": 2000000, "Outlander": 2800000,
    "Eclipse Cross": 2800000, "Space Star": 1300000,
  },
  "Subaru": {
    "Impreza": 2200000, "Legacy": 2500000, "Outback": 3000000,
    "Forester": 2800000, "XV": 2400000, "WRX": 3800000,
  },
  "Jeep": {
    "Renegade": 2500000, "Compass": 2800000,
    "Cherokee": 3500000, "Grand Cherokee": 4800000, "Wrangler": 4500000,
  },
  "Land Rover": {
    "Defender": 6500000, "Discovery": 5500000, "Discovery Sport": 4200000,
    "Range Rover": 9000000, "Range Rover Sport": 7000000, "Range Rover Evoque": 4500000, "Freelander": 3000000,
  },
  // Alfa Romeo – names match LOCAL_MODELS
  "Alfa Romeo": {
    "MiTo": 1500000, "Giulietta": 1900000, "Giulia": 3200000,
    "Stelvio": 4000000, "147": 1200000, "156": 1300000, "159": 1600000,
    "Brera": 2200000, "Spider": 2800000,
  },
  "Smart": {
    "Fortwo": 1200000, "Forfour": 1400000, "#1": 2800000,
  },
  "Lexus": {
    "IS": 3500000, "ES": 4000000, "LS": 6500000,
    "NX": 4000000, "RX": 5000000, "UX": 3200000,
  },
  "Jaguar": {
    "XE": 3200000, "XF": 4200000, "XJ": 6000000,
    "E-Pace": 3800000, "F-Pace": 5000000, "I-Pace": 4500000, "F-Type": 6000000,
  },
};

const CONDITION_FACTOR: Record<string, number> = {
  EXCELLENT: 1.0,
  GOOD: 0.85,
  FAIR: 0.65,
  DAMAGED: 0.40,
};

// Make-level average base price fallback (cents)
const MAKE_DEFAULTS: Record<string, number> = {
  "Porsche": 8000000, "Land Rover": 5000000, "Jaguar": 4500000, "Lexus": 4000000,
  "Tesla": 5000000, "Volvo": 4000000, "BMW": 3500000, "Mercedes-Benz": 4000000,
  "Audi": 3200000, "Volkswagen": 2500000, "Toyota": 2500000, "Hyundai": 2200000,
  "Kia": 2200000, "Mazda": 2200000, "Honda": 2200000, "Skoda": 2000000,
  "Seat": 1900000, "Cupra": 2800000, "Alfa Romeo": 2200000, "Fiat": 1500000,
  "Opel": 1800000, "Ford": 1800000, "Renault": 1800000, "Peugeot": 1900000,
  "Citroën": 1700000, "Dacia": 1400000, "Suzuki": 1700000, "Nissan": 2000000,
  "Mitsubishi": 2000000, "Subaru": 2200000, "Jeep": 3200000, "MINI": 2400000,
};

function calcValue(make: string, model: string, year: number, mileage: number, condition: string): number {
  // Use specific model price, then make default, then global default
  const base = BASE_PRICES[make]?.[model] ?? MAKE_DEFAULTS[make] ?? 2000000;
  const age = Math.max(0, new Date().getFullYear() - year);
  const avgKm = age * 15000;
  const excessKm = Math.max(0, mileage - avgKm);
  // Low km is also a positive signal
  const savedKm = Math.max(0, avgKm - mileage);
  const kmFactor = Math.max(0.3, 1 - (excessKm / 10000) * 0.01 + (savedKm / 10000) * 0.005);
  const ageFactor = Math.max(0.2, 1 - age * 0.055);
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
  // Step 3 — photos
  photos: UploadedPhoto[];
  // Step 4
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  plz: string;
  agb: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => String(CURRENT_YEAR - i));

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
  const [vinInput, setVinInput] = useState('');
  const [vinOpen, setVinOpen] = useState(false);
  const [vinLoading, setVinLoading] = useState(false);
  const [vinResult, setVinResult] = useState<null | { label: string; type: 'success' | 'partial' | 'error'; specs?: string }>(null);
  const [carSpecs, setCarSpecs] = useState<CarSpecs | null>(null);
  const [specsLoading, setSpecsLoading] = useState(false);
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
    photos: [],
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

  function setPhotos(photos: UploadedPhoto[]) {
    setForm((prev) => ({ ...prev, photos }));
  }

  const fetchModels = useCallback(async (make: string, year?: string) => {
    if (!make) { setModels([]); return; }
    setLoadingModels(true);
    try {
      const params = new URLSearchParams({ make });
      if (year) params.set('year', year);
      const res = await fetch(`/api/cars/models?${params}`);
      const data = await res.json() as string[];
      setModels(Array.isArray(data) ? data : []);
    } catch {
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  }, []);

  async function fetchVIN() {
    const vin = vinInput.trim().toUpperCase().replace(/\s/g, '');
    if (vin.length < 11) {
      setVinResult({ label: 'VIN muss mindestens 11 Zeichen haben', type: 'error' });
      return;
    }
    setVinLoading(true);
    setVinResult(null);
    try {
      const res = await fetch(`/api/cars/vin?vin=${encodeURIComponent(vin)}`);
      const data = await res.json() as {
        make?: string; model?: string; year?: string; fuel?: string;
        transmission?: string; bodyClass?: string; engineCylinders?: string;
        engineDisplacementL?: string; driveType?: string; partial?: boolean; error?: string;
      };
      if (!res.ok) {
        setVinResult({ label: data.error || 'VIN nicht erkannt', type: 'error' });
        return;
      }
      // auto-fill
      if (data.make) set('make', data.make);
      if (data.year) set('year', data.year);
      if (data.fuel) set('fuel', data.fuel);
      if (data.transmission) set('transmission', data.transmission);
      if (data.make) fetchModels(data.make, data.year);
      // model: set after fetchModels has time to load
      if (data.model) setTimeout(() => set('model', data.model!), 600);

      const label = [data.make, data.model, data.year].filter(Boolean).join(' ');
      const fuel_label: Record<string, string> = { benzin: 'Benzin', diesel: 'Diesel', elektro: 'Elektro', hybrid: 'Hybrid', lpg: 'LPG' };
      const fuelStr = data.fuel ? (fuel_label[data.fuel] || '') : '';
      const transStr = data.transmission === 'auto' ? 'Automatik' : data.transmission === 'manual' ? 'Schaltgetriebe' : '';
      const specs = [
        data.engineDisplacementL ? `${data.engineDisplacementL}L` : '',
        data.engineCylinders ? `${data.engineCylinders} Zyl.` : '',
        data.bodyClass || '',
        data.driveType || '',
      ].filter(Boolean).join(' · ');

      setVinResult({
        label: `${label}${fuelStr ? ' · ' + fuelStr : ''}${transStr ? ' · ' + transStr : ''}`,
        type: data.partial || !data.model ? 'partial' : 'success',
        specs: specs || undefined,
      });
    } catch {
      setVinResult({ label: 'Verbindungsfehler', type: 'error' });
    } finally {
      setVinLoading(false);
    }
  }

  // Fetch vehicle specs from API Ninjas when make + model + year are all set
  const fetchSpecs = useCallback(async (make: string, model: string, year: string) => {
    if (!make || !model || !year) { setCarSpecs(null); return; }
    setSpecsLoading(true);
    try {
      const params = new URLSearchParams({ make, model, year });
      const res = await fetch(`/api/cars/specs?${params}`);
      const data = await res.json() as CarSpecs | null;
      setCarSpecs(data);
    } catch {
      setCarSpecs(null);
    } finally {
      setSpecsLoading(false);
    }
  }, []);

  // Auto-trigger specs fetch whenever make + model + year are all filled
  useEffect(() => {
    if (form.make && form.model && form.year) {
      fetchSpecs(form.make, form.model, form.year);
    } else {
      setCarSpecs(null);
    }
  }, [form.make, form.model, form.year, fetchSpecs]);

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
    const km = Number(form.mileage);
    if (!form.mileage || isNaN(km) || km < 0 || km > 999999) e.mileage = "Bitte gültigen Kilometerstand eingeben (0–999.999 km)";
    if (!form.condition) e.condition = "Bitte Fahrzeugzustand wählen";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep4(): boolean {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Pflichtfeld";
    if (!form.lastName.trim()) e.lastName = "Pflichtfeld";
    if (!/^[\d\s\+\-\(\)]{7,}$/.test(form.phone.trim())) e.phone = "Gültige Telefonnummer erforderlich";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Gültige E-Mail erforderlich";
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
        photo_urls: form.photos.map((p) => p.url),
        estimated_value_cents,
      });
    } catch (err) {
      // Next.js redirect() throws internally — let it propagate
      if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw err;
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

                {/* VIN Auto-Fill */}
                <div className="rounded-xl border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { setVinOpen(v => !v); setVinResult(null); }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted text-sm font-medium text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      VIN-Nummer bekannt? Fahrzeugdaten automatisch befüllen
                    </span>
                    <svg className={`w-4 h-4 text-foreground-muted transition-transform ${vinOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>

                  {vinOpen && (
                    <div className="p-4 space-y-3 border-t border-border bg-background">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="z.B. WBA3A5C50DF595962"
                          maxLength={17}
                          value={vinInput}
                          onChange={e => setVinInput(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && fetchVIN()}
                          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-1 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-ring uppercase tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={fetchVIN}
                          disabled={vinLoading || vinInput.length < 11}
                          className="px-4 h-10 rounded-md bg-primary hover:bg-primary-dark text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2 transition-colors"
                        >
                          {vinLoading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          ) : 'Dekodieren'}
                        </button>
                      </div>
                      <p className="text-xs text-foreground-muted">Die VIN (Fahrzeug-Identifizierungsnummer) findest du im Fahrzeugschein (Feld E) oder auf der Windschutzscheibe.</p>

                      {vinResult && (
                        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                          vinResult.type === 'success' ? 'bg-green-50 border border-green-200' :
                          vinResult.type === 'partial' ? 'bg-amber/10 border border-amber/30' :
                          'bg-red-50 border border-red-200'
                        }`}>
                          <span className="mt-0.5 flex-shrink-0">
                            {vinResult.type === 'success' ? '✓' : vinResult.type === 'partial' ? '⚠' : '✗'}
                          </span>
                          <div>
                            <div className={`font-medium ${
                              vinResult.type === 'success' ? 'text-green-700' :
                              vinResult.type === 'partial' ? 'text-amber-700' :
                              'text-red-700'
                            }`}>{vinResult.label}</div>
                            {vinResult.specs && <div className="text-xs text-foreground-muted mt-0.5">{vinResult.specs}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="make">Marke *</Label>
                    <select
                      id="make"
                      value={form.make}
                      onChange={(e) => { set("make", e.target.value); set("model", ""); fetchModels(e.target.value, form.year); }}
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
                    onChange={(e) => { set("year", e.target.value); if (form.make) fetchModels(form.make, e.target.value); }}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Jahr wählen</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <p className="text-destructive text-xs">{errors.year}</p>}
                </div>

                {/* ─── API Ninjas Fahrzeugdaten-Karte ─────────────────── */}
                {(specsLoading || carSpecs) && (
                  <div className={`rounded-xl border overflow-hidden transition-all ${
                    specsLoading ? 'border-border bg-muted/30 animate-pulse' : 'border-primary/20 bg-primary/5'
                  }`}>
                    {specsLoading ? (
                      <div className="px-4 py-3 text-sm text-foreground-muted flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Fahrzeugdaten werden geladen…
                      </div>
                    ) : carSpecs && (
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <span className="text-sm font-semibold text-primary">Technische Daten gefunden</span>
                          {carSpecs.year && <span className="text-xs text-foreground-muted ml-auto">Datenjahr {carSpecs.year}</span>}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {carSpecs.vehicleClass && (
                            <div className="bg-background rounded-lg p-2.5 text-center border border-border">
                              <div className="text-xs text-foreground-muted mb-0.5">Klasse</div>
                              <div className="text-xs font-semibold text-foreground">{carSpecs.vehicleClass}</div>
                            </div>
                          )}
                          {(carSpecs.displacementL || carSpecs.cylinders) && (
                            <div className="bg-background rounded-lg p-2.5 text-center border border-border">
                              <div className="text-xs text-foreground-muted mb-0.5">Motor</div>
                              <div className="text-xs font-semibold text-foreground">
                                {carSpecs.displacementL ? `${carSpecs.displacementL}L` : ''}{carSpecs.cylinders ? ` · ${carSpecs.cylinders} Zyl.` : ''}
                              </div>
                            </div>
                          )}
                          {carSpecs.drive && (
                            <div className="bg-background rounded-lg p-2.5 text-center border border-border">
                              <div className="text-xs text-foreground-muted mb-0.5">Antrieb</div>
                              <div className="text-xs font-semibold text-foreground">{carSpecs.drive}</div>
                            </div>
                          )}
                          {carSpecs.consumption.combined && (
                            <div className="bg-background rounded-lg p-2.5 text-center border border-border">
                              <div className="text-xs text-foreground-muted mb-0.5">Verbrauch</div>
                              <div className="text-xs font-semibold text-foreground">{carSpecs.consumption.combined} L/100km</div>
                            </div>
                          )}
                        </div>
                        {(carSpecs.consumption.urban || carSpecs.consumption.highway) && (
                          <div className="flex gap-3 mt-2">
                            {carSpecs.consumption.urban && (
                              <span className="text-xs text-foreground-muted">Stadt: <strong>{carSpecs.consumption.urban}</strong></span>
                            )}
                            {carSpecs.consumption.highway && (
                              <span className="text-xs text-foreground-muted">Autobahn: <strong>{carSpecs.consumption.highway}</strong></span>
                            )}
                            <span className="text-xs text-foreground-muted ml-auto">Quelle: EPA / API Ninjas</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
                  <p className="text-foreground-muted text-sm">
                    Gute Fotos = bessere Angebote. Fahrzeug im Tageslicht, sauber, alle vier Seiten plus Innenraum und Tacho.
                  </p>
                </div>

                <PhotoUpload photos={form.photos} onChange={setPhotos} max={12} />

                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <svg aria-hidden="true" className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p className="text-sm text-primary/80">
                    Fotos sind optional, erhöhen aber erfahrungsgemäß die Angebote um bis zu 12 %. Du kannst auch ohne Fotos fortfahren.
                  </p>
                </div>
              </div>
            )}

            {/* ─── Step 4: Kontakt ───────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Kontaktdaten</h2>
                  <p className="text-foreground-muted text-sm">Damit wir dir dein persönliches Festpreis-Angebot zuschicken können.</p>
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
                    <a href="/agb" target="_blank" rel="noopener noreferrer" className="text-primary underline">Allgemeinen Geschäftsbedingungen</a>{" "}
                    und der{" "}
                    <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-primary underline">Datenschutzerklärung</a>{" "}
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
