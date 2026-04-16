import { Topbar } from "@/components/dashboard/topbar";
import { EventTypeForm } from "@/components/event-types/event-type-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewEventTypePage() {
  return (
    <div className="space-y-6">
      <Topbar title="Create Event Type" description="Define the public meeting experience, duration, location, and booking constraints." />
      <Card>
        <CardContent className="p-6">
          <EventTypeForm />
        </CardContent>
      </Card>
    </div>
  );
}

