"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/db";
import { availabilityScheduleSchema } from "@/lib/validations/availability";

export async function saveAvailabilityScheduleAction(input) {
  const user = await requireDashboardUser();
  const data = availabilityScheduleSchema.parse(input);

  const currentDefault = await prisma.availabilitySchedule.findFirst({
    where: {
      userId: user.id,
      isDefault: true
    }
  });

  if (currentDefault) {
    await prisma.availabilitySlot.deleteMany({
      where: { scheduleId: currentDefault.id }
    });

    await prisma.availabilitySchedule.update({
      where: { id: currentDefault.id },
      data: {
        name: data.name,
        timezone: data.timezone,
        slots: {
          createMany: {
            data: data.slots
          }
        }
      }
    });
  } else {
    await prisma.availabilitySchedule.create({
      data: {
        userId: user.id,
        name: data.name,
        timezone: data.timezone,
        isDefault: true,
        slots: {
          createMany: {
            data: data.slots
          }
        }
      }
    });
  }

  revalidatePath("/dashboard/availability");
}

