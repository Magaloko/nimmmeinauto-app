"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase-server";
import { notifyNewListing, notifyNewOffer, notifyCustomer } from "@/lib/notify";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function submitListing(data: {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  condition: string;
  has_accident_history: boolean;
  tuv_date?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  postal_code: string;
  estimated_value_cents: number;
  photo_urls?: string[];
}) {
  const supabase = getServiceClient();
  const session = await getSessionUser();
  const payload = session ? { ...data, user_id: session.id } : data;

  const { data: listing, error } = await supabase
    .from("listings")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Fire-and-forget: don't block the redirect on notification delivery.
  notifyNewListing({ ...data, listingId: listing.id }).catch(console.error);

  // Confirm receipt to the customer.
  notifyCustomer({
    email: data.email,
    first_name: data.first_name,
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    estimated_value_cents: data.estimated_value_cents,
    listingId: listing.id,
  }).catch(console.error);

  redirect(`/bewertung?id=${listing.id}`);
}

export async function submitOffer(data: {
  listing_id: string;
  dealer_name: string;
  dealer_email?: string;
  amount_cents: number;
  message?: string;
}) {
  const supabase = getServiceClient();
  const { error } = await supabase.from("offers").insert(data);
  if (error) throw new Error(error.message);

  notifyNewOffer(data).catch(console.error);
}
