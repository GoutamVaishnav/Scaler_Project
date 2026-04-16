import { z } from "zod";

export const eventTypeSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional().or(z.literal("")),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
  durationMinutes: z.coerce.number().int().min(15).max(240),
  bufferBeforeMins: z.coerce.number().int().min(0).max(120),
  bufferAfterMins: z.coerce.number().int().min(0).max(120),
  bookingNoticeMins: z.coerce.number().int().min(0).max(10080),
  locationType: z.string().max(50).optional().or(z.literal("")),
  locationValue: z.string().max(255).optional().or(z.literal(""))
});

