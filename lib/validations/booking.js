import { z } from "zod";

export const bookingSchema = z.object({
  eventTypeId: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  date: z.string().min(10),
  slotStart: z.string().datetime(),
  timezone: z.string().min(2),
  answers: z
    .array(
      z.object({
        customQuestionId: z.string(),
        answer: z.string().max(1000)
      })
    )
    .optional()
});

