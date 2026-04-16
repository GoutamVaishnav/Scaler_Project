import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/db";
import { buildPublicBookingUrl } from "@/lib/utils";
import { Topbar } from "@/components/dashboard/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EventTypesPage() {
  const user = await requireDashboardUser();
  const eventTypes = await prisma.eventType.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <Topbar title="Event Types" description="Create reusable meeting templates with their own duration, slug, and booking rules." />

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/event-types/new">
            <Plus className="h-4 w-4" />
            New event type
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {eventTypes.map((eventType) => (
          <Card key={eventType.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{eventType.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{eventType.description || "No description added yet."}</p>
              </div>
              <Badge>{eventType.durationMinutes} min</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground">
                <p>Slug: /book/{eventType.slug}</p>
                <p>Buffer: {eventType.bufferBeforeMins} min before / {eventType.bufferAfterMins} min after</p>
              </div>
              <Button asChild variant="outline">
                <Link href={buildPublicBookingUrl(eventType.slug)} target="_blank">
                  Preview booking page
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

