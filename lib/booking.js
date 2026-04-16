import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { ACTIVE_BOOKING_STATUSES } from "@/lib/constants";
import { bookingSchema } from "@/lib/validations/booking";
import { sendBookingEmail, sendCancellationEmail } from "@/lib/email";

export async function createBooking(input) {
  const parsed = bookingSchema.parse(input);

  const eventType = await prisma.eventType.findUnique({
    where: { id: parsed.eventTypeId },
    include: {
      user: true,
      customQuestions: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  if (!eventType) {
    throw new Error("Event type not found.");
  }

  const startUtc = new Date(parsed.slotStart);
  const endUtc = addMinutes(startUtc, eventType.durationMinutes);
  const bufferedStart = addMinutes(startUtc, -eventType.bufferBeforeMins);
  const bufferedEnd = addMinutes(endUtc, eventType.bufferAfterMins);

  const booking = await prisma.$transaction(async (tx) => {
    const conflictingBooking = await tx.booking.findFirst({
      where: {
        hostUserId: eventType.userId,
        status: { in: ACTIVE_BOOKING_STATUSES },
        startTimeUtc: { lt: bufferedEnd },
        endTimeUtc: { gt: bufferedStart }
      }
    });

    if (conflictingBooking) {
      throw new Error("That slot was just booked. Please choose another time.");
    }

    const created = await tx.booking.create({
      data: {
        eventTypeId: eventType.id,
        hostUserId: eventType.userId,
        inviteeName: parsed.name,
        inviteeEmail: parsed.email,
        inviteeTimezone: parsed.timezone,
        startTimeUtc: startUtc,
        endTimeUtc: endUtc,
        answers: parsed.answers?.length
          ? {
              createMany: {
                data: parsed.answers
                  .filter((answer) => answer.answer?.trim())
                  .map((answer) => ({
                    customQuestionId: answer.customQuestionId,
                    answer: answer.answer
                  }))
              }
            }
          : undefined
      }
    });

    return created;
  });

  await sendBookingEmail({
    to: parsed.email,
    booking,
    eventType,
    hostTimezone: eventType.user.defaultTimezone
  });

  return booking;
}

export async function cancelBooking({ bookingId, reason }) {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
      cancellationReason: reason || null
    },
    include: {
      eventType: true
    }
  });

  await sendCancellationEmail({
    to: booking.inviteeEmail,
    booking,
    eventType: booking.eventType
  });

  return booking;
}

