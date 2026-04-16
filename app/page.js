import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Globe2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";

export default function HomePage() {
  return (
    <main className="container py-8 md:py-12">
      <div className="glass-panel flex items-center justify-between rounded-[28px] px-4 py-3 shadow-soft">
        <Logo />
        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost">
            <Link href="/book/intro-call">Public booking</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
        <Button asChild variant="outline" size="icon" className="md:hidden">
          <Link href="/dashboard" aria-label="Open dashboard">
            <Menu className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <section className="grid gap-8 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">A calmer way to schedule</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold tracking-tight md:text-7xl">
            Build a modern Calendly-style booking flow with full availability control.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Manage event types, recurring hours, override dates, public booking pages, and transactional email from one clean dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Launch dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/book/intro-call">Preview booking page</Link>
            </Button>
          </div>
        </div>

        <Card className="glass-panel overflow-hidden">
          <CardContent className="space-y-4 p-6">
            {[
              {
                icon: CalendarDays,
                title: "Event Types",
                copy: "Unique public links, custom durations, buffers, and booking notice rules."
              },
              {
                icon: Clock3,
                title: "Availability Engine",
                copy: "Weekly recurring slots, overrides, timezones, and conflict-safe slot generation."
              },
              {
                icon: Globe2,
                title: "Public Booking",
                copy: "Responsive booking pages that adjust to each invitee's timezone automatically."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[24px] border border-border/80 bg-background/80 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-semibold">{item.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.copy}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
