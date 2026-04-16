import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BookingSuccessPage({ searchParams }) {
  const { bookingId } = await searchParams;

  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { eventType: true }
      })
    : null;

  return (
    <main className="container py-12">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Booking confirmed</CardTitle>
          <p className="text-sm text-muted-foreground">
            {booking ? `${booking.eventType.name} is officially on the calendar.` : "Your meeting is now scheduled."}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {booking ? (
            <div className="rounded-[24px] bg-muted/60 p-5">
              <p className="font-medium">{booking.inviteeName}</p>
              <p className="text-sm text-muted-foreground">{booking.inviteeEmail}</p>
            </div>
          ) : null}
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

