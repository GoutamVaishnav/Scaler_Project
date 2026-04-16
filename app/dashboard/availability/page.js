import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/db";
import { AvailabilityForm } from "@/components/availability/availability-form";
import { Topbar } from "@/components/dashboard/topbar";

export default async function AvailabilityPage() {
  const user = await requireDashboardUser();
  const schedule = await prisma.availabilitySchedule.findFirst({
    where: {
      userId: user.id,
      isDefault: true
    },
    include: {
      slots: {
        orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }]
      }
    }
  });

  return (
    <div className="space-y-6">
      <Topbar title="Availability" description="Manage weekly recurring hours. These windows power slot generation on public booking pages." />
      <AvailabilityForm schedule={schedule} />
    </div>
  );
}

