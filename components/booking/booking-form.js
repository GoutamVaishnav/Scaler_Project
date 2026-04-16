"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock3, Globe2 } from "lucide-react";
import { bookingSchema } from "@/lib/validations/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BookingForm({ eventType, selectedDate, slots, timezone }) {
  const [isPending, startTransition] = useTransition();
  const [selectedSlot, setSelectedSlot] = useState("");
  const router = useRouter();

  const defaults = useMemo(
    () => ({
      eventTypeId: eventType.id,
      name: "",
      email: "",
      date: selectedDate || "",
      slotStart: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || timezone,
      answers: eventType.customQuestions.map((question) => ({
        customQuestionId: question.id,
        answer: ""
      }))
    }),
    [eventType, selectedDate, timezone]
  );

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: defaults
  });

  useEffect(() => {
    setSelectedSlot("");
  }, [selectedDate]);

  useEffect(() => {
    form.setValue("date", selectedDate || "");
    form.setValue("slotStart", selectedSlot || "");
    form.setValue("eventTypeId", eventType.id);
    form.setValue("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone || timezone);
  }, [eventType.id, form, selectedDate, selectedSlot, timezone]);

  function onSubmit(values) {
    startTransition(async () => {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const payload = await response.json();

      if (!response.ok) {
        alert(payload.error || "Unable to create booking.");
        return;
      }

      router.push(`/book/${eventType.slug}/success?bookingId=${payload.booking.id}`);
    });
  }

  const selectedSlotLabel = selectedSlot
    ? new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: timezone
      }).format(new Date(selectedSlot))
    : "Choose a slot to continue";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-[28px] border border-border bg-muted/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Selected meeting</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-background p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              Date & time
            </div>
            <p className="mt-2 text-sm font-semibold">{selectedSlotLabel}</p>
          </div>
          <div className="rounded-2xl bg-background p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              Duration
            </div>
            <p className="mt-2 text-sm font-semibold">{eventType.durationMinutes} minutes</p>
          </div>
          <div className="rounded-2xl bg-background p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Globe2 className="h-3.5 w-3.5" />
              Timezone
            </div>
            <p className="mt-2 text-sm font-semibold">{timezone}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Select a time</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {slots.length ? (
            slots.map((slot) => {
              const active = selectedSlot === slot.startUtc;
              return (
                <button
                  key={slot.startUtc}
                  type="button"
                  onClick={() => setSelectedSlot(slot.startUtc)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-background hover:border-primary/50 hover:bg-accent/40"
                  }`}
                >
                  <span>
                    {new Intl.DateTimeFormat(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: timezone
                    }).format(new Date(slot.startUtc))}
                  </span>
                  {active ? <CheckCircle2 className="h-4 w-4" /> : null}
                </button>
              );
            })
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No slots are available for this date. The booking page only shows the time ranges saved for that day, minus already booked intervals.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          <p className="text-xs text-destructive">{form.formState.errors.name?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
          <p className="text-xs text-destructive">{form.formState.errors.email?.message}</p>
        </div>
      </div>

      {eventType.customQuestions.map((question, index) => (
        <div key={question.id} className="space-y-2">
          <Label>{question.label}</Label>
          {question.type === "LONG_TEXT" ? (
            <Textarea {...form.register(`answers.${index}.answer`)} />
          ) : (
            <Input {...form.register(`answers.${index}.answer`)} />
          )}
        </div>
      ))}

      <Button type="submit" disabled={isPending || !selectedSlot} className="w-full sm:w-auto">
        {isPending ? "Confirming..." : "Confirm booking"}
      </Button>
    </form>
  );
}
