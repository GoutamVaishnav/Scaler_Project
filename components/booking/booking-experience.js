"use client";

import { useEffect, useState, useTransition } from "react";
import { CalendarClock, Globe2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { BookingForm } from "@/components/booking/booking-form";

export function BookingExperience({
  eventType,
  initialDates,
  initialDate,
  initialSlots,
  initialTimezone
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [slots, setSlots] = useState(initialSlots);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/public/${eventType.slug}/slots?date=${selectedDate}`, {
        cache: "no-store"
      });
      const payload = await response.json();

      if (!response.ok) {
        setSlots([]);
        return;
      }

      setSlots(payload.slots || []);
      setTimezone(payload.timezone || initialTimezone);
    });
  }, [eventType.slug, initialTimezone, selectedDate]);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.95fr_1.25fr]">
      <Card className="glass-panel h-fit overflow-hidden">
        <CardHeader>
          <Badge className="w-fit">{eventType.durationMinutes} minutes</Badge>
          <CardTitle className="mt-2 text-4xl">{eventType.name}</CardTitle>
          <p className="text-base text-muted-foreground">{eventType.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                Duration
              </div>
              <p className="mt-2 font-medium">{eventType.durationMinutes} mins</p>
            </div>
            <div className="rounded-[24px] bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Globe2 className="h-4 w-4" />
                Host timezone
              </div>
              <p className="mt-2 font-medium">{eventType.user.defaultTimezone}</p>
            </div>
            <div className="rounded-[24px] bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                Booking rule
              </div>
              <p className="mt-2 font-medium">Conflict-safe slots</p>
            </div>
          </div>

          <BookingCalendar
            availability={initialDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Step 2</p>
          <CardTitle className="text-3xl">Complete your booking</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a slot, answer the invite questions, and we will confirm instantly.
          </p>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="mb-4 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Updating available slots...
            </div>
          ) : null}
          <BookingForm
            eventType={eventType}
            selectedDate={selectedDate}
            slots={slots}
            timezone={timezone}
          />
        </CardContent>
      </Card>
    </div>
  );
}

