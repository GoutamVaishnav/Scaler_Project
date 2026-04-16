import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking";

export async function POST(request) {
  try {
    const body = await request.json();
    const booking = await createBooking(body);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create booking." }, { status: 400 });
  }
}

