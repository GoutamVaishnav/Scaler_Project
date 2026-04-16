"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, Clock3, LayoutDashboard, Layers3 } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/event-types", label: "Event Types", icon: Layers3 },
  { href: "/dashboard/availability", label: "Availability", icon: Clock3 },
  { href: "/dashboard/meetings", label: "Meetings", icon: CalendarRange }
];

export function Sidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className="rounded-[32px] border border-border bg-card/90 p-6 shadow-soft">
      <Logo />
      <nav className="mt-8 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
