"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/db";
import { eventTypeSchema } from "@/lib/validations/event-type";

export async function createEventTypeAction(input) {
  const user = await requireDashboardUser();
  const data = eventTypeSchema.parse(input);

  await prisma.eventType.create({
    data: {
      userId: user.id,
      ...data,
      description: data.description || null,
      locationType: data.locationType || null,
      locationValue: data.locationValue || null
    }
  });

  revalidatePath("/dashboard/event-types");
}

