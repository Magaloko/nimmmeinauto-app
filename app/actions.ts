"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase-server";

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
  // Wenn ein User eingeloggt ist, verknüpfen wir das Inserat mit seinem Account.
  // Gäste bleiben anonym erlaubt (user_id NULL).
  const session = await getSessionUser();
  const payload = session ? { ...data, user_id: session.id } : data;

  const { data: listing, error } = await supabase
    .from("listings")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
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
}
