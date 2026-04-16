import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Topbar({ title, description }) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-card/90 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <ThemeToggle />
    </div>
  );
}

