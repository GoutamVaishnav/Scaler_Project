import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/db";
import { Topbar } from "@/components/dashboard/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MeetingsPage() {
  const user = await requireDashboardUser();
  const bookings = await prisma.booking.findMany({
    where: { hostUserId: user.id },
    include: {
      eventType: true
    },
    orderBy: { startTimeUtc: "desc" }
  });

  return (
    <div className="space-y-6">
      <Topbar title="Meetings" description="Review upcoming and past meetings, including booking status and invitee details." />
      <Card>
        <CardHeader>
          <CardTitle>All meetings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookings.length ? (
            bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-3 rounded-[24px] border border-border p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{booking.inviteeName}</p>
                  <p className="text-sm text-muted-foreground">{booking.inviteeEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{booking.eventType.name}</p>
                  <p className="text-sm text-muted-foreground">{format(booking.startTimeUtc, "PPP p")}</p>
                </div>
                <Badge>{booking.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Bookings will appear here after people use your public event links.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

