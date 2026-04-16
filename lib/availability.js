import { addDays, addMinutes, isAfter } from "date-fns";
import { prisma } from "@/lib/prisma";
import { ACTIVE_BOOKING_STATUSES, SLOT_INTERVAL_MINUTES } from "@/lib/constants";
import {
  endOfTimezoneDay,
  formatDateInTimezone,
  getTodayInTimezone,
  localDateTimeToUtc,
  startOfTimezoneDay
} from "@/lib/dates";

function rangesOverlap(rangeA, rangeB) {
  return rangeA.start < rangeB.end && rangeA.end > rangeB.start;
}

function pickActiveSchedule(schedules, date) {
  return (
    schedules.find((schedule) => {
      const startsOkay = !schedule.effectiveFrom || schedule.effectiveFrom <= date;
      const endsOkay = !schedule.effectiveTo || schedule.effectiveTo >= date;
      return schedule.isActive && startsOkay && endsOkay;
    }) || schedules.find((schedule) => schedule.isDefault) || schedules[0]
  );
}

export async function getEventTypeBySlug(slug) {
  return prisma.eventType.findUnique({
    where: { slug },
    include: {
      user: true,
      customQuestions: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });
}

export async function getEventAvailabilityForDate({ eventTypeSlug, dateString }) {
  const eventType = await prisma.eventType.findUnique({
    where: { slug: eventTypeSlug },
    include: {
      user: {
        include: {
          availabilitySchedules: {
            where: { isActive: true },
            include: { slots: true },
            orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }]
          },
          dateOverrides: {
            include: { slots: true }
          }
        }
      }
    }
  });

  if (!eventType) {
    throw new Error("Event type not found.");
  }

  const timezone = eventType.user.defaultTimezone;
  const activeSchedule = pickActiveSchedule(eventType.user.availabilitySchedules, new Date(dateString));
  const override = eventType.user.dateOverrides.find(
    (entry) => formatDateInTimezone(entry.overrideDate, timezone) === dateString
  );

  let baseWindows = [];

  if (override?.type === "UNAVAILABLE") {
    return { eventType, timezone, slots: [] };
  }

  if (override?.type === "AVAILABLE") {
    baseWindows = override.slots.map((slot) => ({
      startMinute: slot.startMinute,
      endMinute: slot.endMinute
    }));
  } else if (activeSchedule) {
    const dayOfWeek = Number(formatDateInTimezone(startOfTimezoneDay(dateString, timezone), timezone, "i")) % 7;
    baseWindows = activeSchedule.slots
      .filter((slot) => slot.dayOfWeek === dayOfWeek)
      .map((slot) => ({
        startMinute: slot.startMinute,
        endMinute: slot.endMinute
      }));
  }

  const bookingStart = startOfTimezoneDay(dateString, timezone);
  const bookingEnd = endOfTimezoneDay(dateString, timezone);
  const existingBookings = await prisma.booking.findMany({
    where: {
      eventTypeId: eventType.id,
      status: { in: ACTIVE_BOOKING_STATUSES },
      startTimeUtc: {
        lte: bookingEnd
      },
      endTimeUtc: {
        gte: bookingStart
      }
    },
    orderBy: { startTimeUtc: "asc" }
  });

  const slots = [];
  const now = new Date();
  const noticeCutoff = addMinutes(now, eventType.bookingNoticeMins);

  for (const window of baseWindows) {
    for (
      let minute = window.startMinute;
      minute + eventType.durationMinutes <= window.endMinute;
      minute += SLOT_INTERVAL_MINUTES
    ) {
      const startUtc = localDateTimeToUtc(dateString, minute, timezone);
      const endUtc = addMinutes(startUtc, eventType.durationMinutes);
      const protectedRange = {
        start: addMinutes(startUtc, -eventType.bufferBeforeMins),
        end: addMinutes(endUtc, eventType.bufferAfterMins)
      };

      if (!isAfter(startUtc, noticeCutoff)) {
        continue;
      }

      const isBooked = existingBookings.some((booking) =>
        rangesOverlap(protectedRange, {
          start: addMinutes(booking.startTimeUtc, -eventType.bufferBeforeMins),
          end: addMinutes(booking.endTimeUtc, eventType.bufferAfterMins)
        })
      );

      if (isBooked) {
        continue;
      }

      slots.push({
        startUtc: startUtc.toISOString(),
        endUtc: endUtc.toISOString()
      });
    }
  }

  return {
    eventType,
    timezone,
    slots
  };
}

export async function getAvailabilityCalendar({ eventTypeSlug, days = 30 }) {
  const eventType = await getEventTypeBySlug(eventTypeSlug);

  if (!eventType) {
    throw new Error("Event type not found.");
  }

  const timezone = eventType.user.defaultTimezone;
  const start = getTodayInTimezone(timezone);
  const dates = [];

  for (let index = 0; index < days; index += 1) {
    const date = formatDateInTimezone(addDays(new Date(`${start}T00:00:00`), index), timezone);
    const availability = await getEventAvailabilityForDate({
      eventTypeSlug,
      dateString: date
    });

    dates.push({
      date,
      available: availability.slots.length > 0,
      count: availability.slots.length
    });
  }

  return {
    eventType,
    timezone,
    dates
  };
}

