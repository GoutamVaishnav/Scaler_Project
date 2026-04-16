"use client";

import { addMonths, endOfMonth, endOfWeek, format, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BookingCalendar({ availability, selectedDate, onSelectDate }) {
  const [month, setMonth] = useState(selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date());
  const availableDates = useMemo(() => new Set(availability.filter((item) => item.available).map((item) => item.date)), [availability]);

  const days = [];
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });

  for (let cursor = start; cursor <= end; cursor = new Date(cursor.getTime() + 86400000)) {
    const dateString = format(cursor, "yyyy-MM-dd");
    days.push({
      date: new Date(cursor),
      dateString,
      isAvailable: availableDates.has(dateString)
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="font-medium">{format(month, "MMMM yyyy")}</p>
        <Button type="button" variant="ghost" size="icon" onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <button
            key={day.dateString}
            type="button"
            className={cn(
              "flex aspect-square items-center justify-center rounded-2xl border text-sm font-medium transition",
              !isSameMonth(day.date, month) && "opacity-25",
              isSameMonth(day.date, month) && "hover:-translate-y-0.5",
              day.isAvailable
                ? "border-border bg-background shadow-sm hover:border-primary"
                : "border-dashed border-border/80 bg-muted/35 text-muted-foreground hover:border-border",
              selectedDate === day.dateString && "border-primary bg-primary text-primary-foreground",
              isToday(day.date) && day.isAvailable && selectedDate !== day.dateString && "border-primary/40"
            )}
            disabled={!isSameMonth(day.date, month)}
            onClick={() => {
              if (isSameMonth(day.date, month)) {
                onSelectDate(day.dateString);
              }
            }}
          >
            {format(day.date, "d")}
          </button>
        ))}
      </div>
    </div>
  );
}
