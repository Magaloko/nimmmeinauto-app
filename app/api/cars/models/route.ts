import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // cache 24h

// Local fallback for brands with limited NHTSA coverage
const LOCAL_MODELS: Record<string, string[]> = {
  skoda: ['Octavia', 'Fabia', 'Superb', 'Karoq', 'Kodiaq', 'Scala', 'Kamiq', 'Enyaq', 'Rapid', 'Roomster'],
  opel: ['Astra', 'Corsa', 'Insignia', 'Mokka', 'Grandland', 'Crossland', 'Zafira', 'Vectra', 'Meriva', 'Agila'],
  renault: ['Clio', 'Megane', 'Kadjar', 'Zoe', 'Captur', 'Scenic', 'Laguna', 'Twingo', 'Koleos', 'Talisman', 'Kangoo'],
  peugeot: ['208', '308', '3008', '5008', '508', '2008', '107', '207', '407', '206', '106'],
  seat: ['Leon', 'Ibiza', 'Ateca', 'Tarraco', 'Arona', 'Toledo', 'Altea', 'Exeo', 'Mii'],
  cupra: ['Formentor', 'Leon', 'Ateca', 'Born'],
  citroen: ['C3', 'C4', 'C5', 'Berlingo', 'Picasso', 'C1', 'C2', 'DS3', 'DS5', 'Xsara'],
  dacia: ['Sandero', 'Duster', 'Logan', 'Spring', 'Jogger', 'Dokker', 'Lodgy'],
  smart: ['Fortwo', 'Forfour', '#1'],
  lancia: ['Ypsilon', 'Delta', 'Musa'],
  alfa_romeo: ['Giulia', 'Stelvio', 'Giulietta', '147', '156', '159', 'MiTo', 'Brera', 'Spider'],
};

function normalize(make: string): string {
  return make.toLowerCase().replace(/[-\s]/g, '_');
}

function toNHTSAName(make: string): string {
  // Map display names to NHTSA URL names
  const map: Record<string, string> = {
    'mercedes-benz': 'mercedes-benz',
    'land rover': 'land rover',
    'alfa romeo': 'alfa romeo',
    'alfa_romeo': 'alfa romeo',
  };
  return map[make.toLowerCase()] || make.toLowerCase();
}

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get('make') || '';
  const year = req.nextUrl.searchParams.get('year') || '';
  if (!make) return NextResponse.json([]);

  const key = normalize(make);

  // Try local first for European brands we know NHTSA won't cover well
  // (year doesn't change these lists, so skip year filtering for local brands)
  if (LOCAL_MODELS[key]) {
    return NextResponse.json(LOCAL_MODELS[key]);
  }

  // Try NHTSA — use year-specific endpoint when year is provided
  try {
    const nhtsa = toNHTSAName(make);
    const url = year
      ? `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(nhtsa)}/modelyear/${encodeURIComponent(year)}?format=json`
      : `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(nhtsa)}?format=json`;

    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json() as { Results?: { Model_Name: string }[] };
    const models = (data.Results || [])
      .map(r => r.Model_Name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    if (models.length > 0) {
      return NextResponse.json(models);
    }
  } catch (e) {
    console.error('[NHTSA] Error:', e);
  }

  // Fallback: empty
  return NextResponse.json([]);
}
