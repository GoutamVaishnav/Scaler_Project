export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
        SC
      </div>
      <div>
        <p className="text-sm font-semibold tracking-wide">Scaler Scheduler</p>
        <p className="text-xs text-muted-foreground">Calendly-style booking platform</p>
      </div>
    </div>
  );
}

