"use client";

import { useState, useTransition } from "react";
import { Copy } from "lucide-react";
import { saveAvailabilityScheduleAction } from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TIMEZONE_OPTIONS, WEEK_DAYS } from "@/lib/constants";
import { timeLabelToMinutes } from "@/lib/utils";

function buildSlotsByDay(slots) {
  return WEEK_DAYS.reduce((accumulator, day) => {
    accumulator[day.value] = slots
      .filter((slot) => slot.dayOfWeek === day.value)
      .map((slot) => ({
        start: String(Math.floor(slot.startMinute / 60)).padStart(2, "0") + ":" + String(slot.startMinute % 60).padStart(2, "0"),
        end: String(Math.floor(slot.endMinute / 60)).padStart(2, "0") + ":" + String(slot.endMinute % 60).padStart(2, "0")
      }));

    if (!accumulator[day.value].length) {
      accumulator[day.value] = [];
    }

    return accumulator;
  }, {});
}

function cloneSlotsToAllDays(daySlots) {
  return WEEK_DAYS.reduce((accumulator, day) => {
    accumulator[day.value] = daySlots.map((slot) => ({ ...slot }));
    return accumulator;
  }, {});
}

function inferSameHoursForAllDays(slotsByDay) {
  const populatedDays = Object.values(slotsByDay).filter((daySlots) => daySlots.length);

  if (!populatedDays.length) {
    return false;
  }

  const normalized = JSON.stringify(populatedDays[0]);
  return populatedDays.every((daySlots) => JSON.stringify(daySlots) === normalized);
}

export function AvailabilityForm({ schedule }) {
  const initialSlotsByDay = buildSlotsByDay(schedule?.slots || []);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(schedule?.name || "Default Weekly Hours");
  const [timezone, setTimezone] = useState(schedule?.timezone || "Asia/Kolkata");
  const [slotsByDay, setSlotsByDay] = useState(initialSlotsByDay);
  const [sameHoursForAllDays, setSameHoursForAllDays] = useState(inferSameHoursForAllDays(initialSlotsByDay));

  function updateSlot(dayOfWeek, index, key, value) {
    setSlotsByDay((current) => {
      const updatedDaySlots = current[dayOfWeek].map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot
      );

      if (sameHoursForAllDays) {
        return cloneSlotsToAllDays(updatedDaySlots);
      }

      return {
        ...current,
        [dayOfWeek]: updatedDaySlots
      };
    });
  }

  function addSlot(dayOfWeek) {
    setSlotsByDay((current) => {
      const updatedDaySlots = [...current[dayOfWeek], { start: "09:00", end: "17:00" }];

      if (sameHoursForAllDays) {
        return cloneSlotsToAllDays(updatedDaySlots);
      }

      return {
        ...current,
        [dayOfWeek]: updatedDaySlots
      };
    });
  }

  function removeSlot(dayOfWeek, index) {
    setSlotsByDay((current) => {
      const updatedDaySlots = current[dayOfWeek].filter((_, slotIndex) => slotIndex !== index);

      if (sameHoursForAllDays) {
        return cloneSlotsToAllDays(updatedDaySlots);
      }

      return {
        ...current,
        [dayOfWeek]: updatedDaySlots
      };
    });
  }

  function applyDayToAllDays(dayOfWeek) {
    setSlotsByDay((current) => cloneSlotsToAllDays(current[dayOfWeek]));
    setSameHoursForAllDays(true);
  }

  function handleSameHoursToggle(checked) {
    setSameHoursForAllDays(checked);

    if (!checked) {
      return;
    }

    const sourceDaySlots =
      WEEK_DAYS.map((day) => slotsByDay[day.value]).find((daySlots) => daySlots.length) || [{ start: "09:00", end: "17:00" }];

    setSlotsByDay(cloneSlotsToAllDays(sourceDaySlots));
  }

  function onSubmit(event) {
    event.preventDefault();
    const normalizedSlotsByDay = sameHoursForAllDays
      ? cloneSlotsToAllDays(WEEK_DAYS.map((day) => slotsByDay[day.value]).find((daySlots) => daySlots.length) || [])
      : slotsByDay;

    const slots = Object.entries(normalizedSlotsByDay).flatMap(([dayOfWeek, daySlots]) =>
      daySlots.map((slot) => ({
        dayOfWeek: Number(dayOfWeek),
        startMinute: timeLabelToMinutes(slot.start),
        endMinute: timeLabelToMinutes(slot.end)
      }))
    );

    startTransition(async () => {
      await saveAvailabilityScheduleAction({
        name,
        timezone,
        slots
      });
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Schedule name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <select
              className="flex h-11 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            >
              {TIMEZONE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">Use same hours for every day</p>
            <p className="text-sm text-muted-foreground">
              Turn this on if you want one range like 9 AM to 11 AM to show every day until you change it.
            </p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={sameHoursForAllDays}
              onChange={(event) => handleSameHoursToggle(event.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Same hours daily
          </label>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {WEEK_DAYS.map((day) => (
          <Card key={day.value}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">{day.label}</CardTitle>
              <div className="flex items-center gap-2">
                {!sameHoursForAllDays ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => applyDayToAllDays(day.value)}>
                    <Copy className="h-4 w-4" />
                    Apply to all days
                  </Button>
                ) : null}
                <Button type="button" variant="outline" size="sm" onClick={() => addSlot(day.value)}>
                  Add time range
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {slotsByDay[day.value].length ? (
                slotsByDay[day.value].map((slot, index) => (
                  <div key={`${day.value}-${index}`} className="flex flex-col gap-3 rounded-3xl border border-border p-4 sm:flex-row sm:items-center">
                    <Input
                      type="time"
                      value={slot.start}
                      onChange={(event) => updateSlot(day.value, index, "start", event.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={slot.end}
                      onChange={(event) => updateSlot(day.value, index, "end", event.target.value)}
                    />
                    <Button type="button" variant="ghost" onClick={() => removeSlot(day.value, index)}>
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Unavailable all day.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Meeting slot math uses this schedule timezone and applies event buffers automatically.
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save availability"}
        </Button>
      </div>
    </form>
  );
}
