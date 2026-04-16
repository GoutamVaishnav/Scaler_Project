"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventTypeAction } from "@/actions/event-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { eventTypeSchema } from "@/lib/validations/event-type";

export function EventTypeForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      durationMinutes: 30,
      bufferBeforeMins: 15,
      bufferAfterMins: 15,
      bookingNoticeMins: 60,
      locationType: "google-meet",
      locationValue: "Meeting link sent after confirmation."
    }
  });

  function onSubmit(values) {
    startTransition(async () => {
      await createEventTypeAction(values);
      form.reset();
      window.location.href = "/dashboard/event-types";
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          <p className="text-xs text-destructive">{form.formState.errors.name?.message}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} />
          <p className="text-xs text-destructive">{form.formState.errors.slug?.message}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register("description")} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duration (minutes)</Label>
          <Input id="durationMinutes" type="number" {...form.register("durationMinutes")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bufferBeforeMins">Buffer before</Label>
          <Input id="bufferBeforeMins" type="number" {...form.register("bufferBeforeMins")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bufferAfterMins">Buffer after</Label>
          <Input id="bufferAfterMins" type="number" {...form.register("bufferAfterMins")} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bookingNoticeMins">Minimum notice</Label>
          <Input id="bookingNoticeMins" type="number" {...form.register("bookingNoticeMins")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locationType">Location type</Label>
          <Input id="locationType" {...form.register("locationType")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationValue">Location details</Label>
        <Input id="locationValue" {...form.register("locationValue")} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Create event type"}
      </Button>
    </form>
  );
}
