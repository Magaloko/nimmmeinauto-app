import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // cache 24h

interface NinjasCar {
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
}

export interface CarSpecs {
  vehicleClass: string;
  cylinders: number | null;
  displacementL: number | null;
  drive: string;
  fuelType: string;
  transmission: string;
  consumption: {
    urban: string;      // L/100km
    highway: string;
    combined: string;
  };
  year: number;
}

// MPG → L/100km
function mpgToL100(mpg: number): string {
  if (!mpg || mpg <= 0) return '';
  return (235.214 / mpg).toFixed(1);
}

const DRIVE_LABELS: Record<string, string> = {
  fwd: 'Frontantrieb',
  rwd: 'Hinterradantrieb',
  awd: 'Allradantrieb',
  '4wd': '4WD',
};

const FUEL_LABELS: Record<string, string> = {
  gas: 'Benzin',
  diesel: 'Diesel',
  electricity: 'Elektro',
};

const CLASS_LABELS: Record<string, string> = {
  'compact car': 'Kompaktklasse',
  'midsize car': 'Mittelklasse',
  'large car': 'Oberklasse',
  'small car': 'Kleinwagen',
  'minicompact car': 'Kleinstwagen',
  'subcompact car': 'Kleinwagen',
  'small suv': 'Kleines SUV',
  'standard suv': 'SUV',
  'large suv': 'Großes SUV',
  'pickup truck': 'Pickup',
  van: 'Van',
  minivan: 'Minivan',
  'special purpose vehicle': 'Nutzfahrzeug',
  'two seater': 'Zweisitzer',
};

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get('make') || '';
  const model = req.nextUrl.searchParams.get('model') || '';
  const year = req.nextUrl.searchParams.get('year') || '';

  const key = process.env.API_NINJAS_KEY;
  if (!key) return NextResponse.json(null); // graceful: no key → skip silently

  if (!make || !model) return NextResponse.json(null);

  try {
    const params = new URLSearchParams({
      make: make.toLowerCase().replace(/-/g, ' '), // "mercedes-benz" → "mercedes benz"
      model: model.toLowerCase(),
      limit: '5',
    });
    if (year) params.set('year', year);

    const res = await fetch(
      `https://api.api-ninjas.com/v1/cars?${params}`,
      {
        headers: { 'X-Api-Key': key },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return NextResponse.json(null);

    const cars = (await res.json()) as NinjasCar[];
    if (!cars?.length) return NextResponse.json(null);

    // Prefer exact year match, then closest year, then first result
    let car = cars[0];
    if (year) {
      const yr = Number(year);
      const exact = cars.find(c => c.year === yr);
      if (exact) {
        car = exact;
      } else {
        // pick closest year
        car = cars.reduce((best, c) =>
          Math.abs(c.year - yr) < Math.abs(best.year - yr) ? c : best
        );
      }
    }

    const result: CarSpecs = {
      vehicleClass: CLASS_LABELS[car.class?.toLowerCase()] || car.class || '',
      cylinders: car.cylinders ?? null,
      displacementL: car.displacement ?? null,
      drive: DRIVE_LABELS[car.drive?.toLowerCase()] || car.drive || '',
      fuelType: FUEL_LABELS[car.fuel_type?.toLowerCase()] || car.fuel_type || '',
      transmission: car.transmission === 'a' ? 'Automatik' : car.transmission === 'm' ? 'Schaltgetriebe' : '',
      consumption: {
        urban: mpgToL100(car.city_mpg),
        highway: mpgToL100(car.highway_mpg),
        combined: mpgToL100(car.combination_mpg),
      },
      year: car.year,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error('[API Ninjas Specs]', e);
    return NextResponse.json(null);
  }
}
