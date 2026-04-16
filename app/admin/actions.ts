"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/supabase-server";

function adminGuard(user: Awaited<ReturnType<typeof getSessionUser>>) {
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function setUserRole(userId: string, role: "kunde" | "bewerter" | "admin") {
  const me = await getSessionUser();
  adminGuard(me);
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function setListingStatus(
  listingId: string,
  status: "pending" | "live" | "sold" | "archived"
) {
  const me = await getSessionUser();
  adminGuard(me);
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/listings");
  revalidatePath("/admin");
}

export async function setListingNotes(listingId: string, notes: string) {
  const me = await getSessionUser();
  adminGuard(me);
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("listings")
    .update({ notes })
    .eq("id", listingId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/listings");
}

export async function closeThread(threadId: string) {
  const me = await getSessionUser();
  adminGuard(me);
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("threads")
    .update({ status: "closed" })
    .eq("id", threadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/chat");
}
