import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { BookingExperience } from "@/components/booking/booking-experience";
import { getAvailabilityCalendar, getEventAvailabilityForDate, getEventTypeBySlug } from "@/lib/availability";

export default async function PublicBookingPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const selectedDate = resolvedSearchParams.date;
  const eventType = await getEventTypeBySlug(slug);

  if (!eventType) {
    notFound();
  }

  const calendar = await getAvailabilityCalendar({
    eventTypeSlug: slug,
    days: 35
  });

  const fallbackDate = calendar.dates.find((entry) => entry.available)?.date || calendar.dates[0]?.date;
  const activeDate = selectedDate || fallbackDate;
  const availability = activeDate
    ? await getEventAvailabilityForDate({
        eventTypeSlug: slug,
        dateString: activeDate
      })
    : { slots: [], timezone: eventType.user.defaultTimezone };

  return (
    <main className="container py-6 md:py-10">
      <div className="glass-panel mb-6 flex items-center justify-between rounded-[28px] px-4 py-3 shadow-soft">
        <Link href="/" className="min-w-0">
          <Logo />
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <BookingExperience
        eventType={eventType}
        initialDates={calendar.dates}
        initialDate={activeDate}
        initialSlots={availability.slots}
        initialTimezone={availability.timezone}
      />
    </main>
  );
}
