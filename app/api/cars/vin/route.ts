import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // cache 24h

interface NHTSADecodeVinValuesResult {
  Make: string;
  Model: string;
  ModelYear: string;
  FuelTypePrimary: string;
  TransmissionStyle: string;
  BodyClass: string;
  EngineCylinders: string;
  DisplacementL: string;
  DriveType: string;
  Doors: string;
  ErrorCode: string;
  [key: string]: string;
}

interface NHTSADecodeVinValuesResponse {
  Results: NHTSADecodeVinValuesResult[];
}

function mapFuel(fuelTypePrimary: string): string | undefined {
  if (!fuelTypePrimary) return undefined;
  const f = fuelTypePrimary.toLowerCase();
  if (f.includes('electric') && (f.includes('gas') || f.includes('gasoline'))) return 'hybrid';
  if (f.includes('electric')) return 'elektro';
  if (f.includes('diesel')) return 'diesel';
  if (f.includes('gasoline') || f === 'gas') return 'benzin';
  if (f.includes('propane') || f.includes('lpg')) return 'lpg';
  return undefined;
}

function mapTransmission(transmissionStyle: string): string | undefined {
  if (!transmissionStyle) return undefined;
  if (transmissionStyle.toLowerCase().includes('manual')) return 'manual';
  return 'auto';
}

export async function GET(req: NextRequest) {
  const rawVin = req.nextUrl.searchParams.get('vin') || '';
  const vin = rawVin.trim().toUpperCase().replace(/\s/g, '');

  if (!vin || vin.length < 11) {
    return NextResponse.json({ error: 'VIN muss mindestens 11 Zeichen haben' }, { status: 400 });
  }
  if (vin.length > 17) {
    return NextResponse.json({ error: 'VIN darf maximal 17 Zeichen haben' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'NHTSA API nicht erreichbar' }, { status: 502 });
    }

    const data = await res.json() as NHTSADecodeVinValuesResponse;
    const result = data.Results?.[0];

    if (!result) {
      return NextResponse.json({ error: 'Keine Daten zurückgegeben' }, { status: 422 });
    }

    const make = result.Make || '';
    const model = result.Model || '';
    const year = result.ModelYear || '';

    if (!make) {
      return NextResponse.json({ error: 'Fahrzeugmarke nicht erkannt' }, { status: 422 });
    }

    const isPartial = result.ErrorCode !== '0';

    const fuel = mapFuel(result.FuelTypePrimary);
    const transmission = mapTransmission(result.TransmissionStyle);

    const response: Record<string, string | boolean | undefined> = {
      make,
      model,
      year,
      rawMake: result.Make || undefined,
    };

    if (fuel) response.fuel = fuel;
    if (transmission) response.transmission = transmission;
    if (result.BodyClass) response.bodyClass = result.BodyClass;
    if (result.EngineCylinders) response.engineCylinders = result.EngineCylinders;
    if (result.DisplacementL) response.engineDisplacementL = result.DisplacementL;
    if (result.DriveType) response.driveType = result.DriveType;
    if (result.Doors) response.doors = result.Doors;
    if (isPartial) response.partial = true;

    return NextResponse.json(response);
  } catch (e) {
    console.error('[VIN] Error:', e);
    return NextResponse.json({ error: 'Verbindungsfehler' }, { status: 502 });
  }
}
