"use client";

// ─── حساب‌یار ─── هدر چسبان با تاریخ شمسیِ زنده ───

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { faTodayLong } from "@/lib/finance";
import { LogoMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [today, setToday] = useState<string | null>(null);

  // تاریخ فقط روی کلاینت ساخته می‌شود تا با بیلد استاتیک قفل نشود
  useEffect(() => {
    const id = requestAnimationFrame(() => setToday(faTodayLong()));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <LogoMark className="size-10 drop-shadow-[0_2px_10px_rgba(192,138,62,0.35)]" />
          <div>
            <h1 className="text-lg font-black leading-tight sm:text-xl">
              حساب‌یار
            </h1>
            <p className="text-[11px] text-muted-foreground sm:text-xs">
              هر تومان، سرِ جایش
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {today && (
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs backdrop-blur sm:flex">
              <CalendarDays className="size-3.5 text-bronze" aria-hidden />
              <span className="font-medium text-foreground/80">{today}</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
