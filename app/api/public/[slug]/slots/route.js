import { NextResponse } from "next/server";
import { getEventAvailabilityForDate } from "@/lib/availability";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "date query param is required." }, { status: 400 });
    }

    const availability = await getEventAvailabilityForDate({
      eventTypeSlug: slug,
      dateString: date
    });

    return NextResponse.json(availability);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to load slots." }, { status: 500 });
  }
}

