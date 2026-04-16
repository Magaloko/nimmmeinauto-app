import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for our tables
export type Listing = {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  condition: string;
  has_accident_history: boolean;
  tuv_date: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  postal_code: string;
  estimated_value_cents: number;
  status: string;
  notes: string | null;
};

export type Offer = {
  id: string;
  created_at: string;
  listing_id: string;
  dealer_name: string;
  dealer_email: string | null;
  amount_cents: number;
  message: string | null;
  status: string;
};
