import { NextResponse } from "next/server";
import { notifyNewListing } from "@/lib/notify";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.TELEGRAM_SETUP_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await notifyNewListing({
    make: "BMW",
    model: "3er",
    year: 2021,
    mileage: 62000,
    estimated_value_cents: 2290000,
    first_name: "Max",
    last_name: "Mustermann",
    phone: "+43 677 12345678",
    email: "test@nimmmeinauto.at",
    postal_code: "1010",
    listingId: "test-123",
  });

  return NextResponse.json({ ok: true, message: "Test-E-Mail gesendet!" });
}
