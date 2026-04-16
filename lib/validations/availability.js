import { z } from "zod";

export const weeklySlotSchema = z
  .object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startMinute: z.coerce.number().int().min(0).max(1439),
    endMinute: z.coerce.number().int().min(1).max(1440)
  })
  .refine((value) => value.endMinute > value.startMinute, {
    message: "End time must be after start time.",
    path: ["endMinute"]
  });

export const availabilityScheduleSchema = z.object({
  name: z.string().min(2).max(80),
  timezone: z.string().min(2),
  slots: z.array(weeklySlotSchema).min(1)
});

