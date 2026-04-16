"use server";

import { revalidatePath } from "next/cache";
import { cancelBooking, createBooking } from "@/lib/booking";

export async function createBookingAction(input) {
  const booking = await createBooking(input);
  revalidatePath("/dashboard/meetings");
  return booking;
}

export async function cancelBookingAction(input) {
  const booking = await cancelBooking(input);
  revalidatePath("/dashboard/meetings");
  return booking;
}
