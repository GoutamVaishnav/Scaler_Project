import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/db";
import { Topbar } from "@/components/dashboard/topbar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireDashboardUser();

  const [eventTypesCount, upcomingBookings, recentBookings] = await Promise.all([
    prisma.eventType.count({ where: { userId: user.id } }),
    prisma.booking.count({
      where: {
        hostUserId: user.id,
        startTimeUtc: { gte: new Date() },
        status: { in: ["PENDING", "CONFIRMED"] }
      }
    }),
    prisma.booking.findMany({
      where: { hostUserId: user.id },
      include: { eventType: true },
      orderBy: { startTimeUtc: "asc" },
      take: 5
    })
  ]);

  return (
    <div className="space-y-6">
      <Topbar title="Dashboard" description="Track bookings, manage event types, and fine tune your availability." />
      <StatsCards
        stats={[
          { label: "Event Types", value: eventTypesCount, caption: "Public bookable meeting templates" },
          { label: "Upcoming Meetings", value: upcomingBookings, caption: "Confirmed or pending future bookings" },
          { label: "Timezone", value: user.defaultTimezone, caption: "Primary host scheduling timezone" }
        ]}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Next bookings</CardTitle>
          <Button asChild variant="outline">
            <Link href="/dashboard/meetings">View all meetings</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentBookings.length ? (
            recentBookings.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-2 rounded-[24px] border border-border p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{booking.inviteeName}</p>
                  <p className="text-sm text-muted-foreground">{booking.eventType.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">{format(booking.startTimeUtc, "PPP p")}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No meetings yet. Seed data or public bookings will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

