"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export function DashboardShell({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container py-4 md:py-6">
      <header className="glass-panel sticky top-4 z-40 mb-6 flex items-center justify-between rounded-[28px] px-4 py-3 shadow-soft">
        <Link href="/dashboard" className="min-w-0">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Button type="button" variant="outline" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-7rem)] gap-6 lg:grid-cols-[290px_1fr]">
        <div className="hidden lg:block lg:sticky lg:top-28 lg:h-fit">
          <Sidebar />
        </div>
        <div>{children}</div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          />
          <div className="absolute left-0 top-0 h-full w-[88%] max-w-sm bg-background p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button type="button" variant="outline" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
