"use client";

// ─── حساب‌یار ─── عدد متحرک با شمارش نرم ───

import { useEffect, useRef, useState } from "react";
import { faNumber } from "@/lib/finance";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  className,
  duration = 750,
}: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const run = () => {
      if (cancelled) return;
      const from = fromRef.current;
      const to = value;

      if (
        from === to ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        fromRef.current = to;
        setDisplayed(to);
        return;
      }

      const startTime = performance.now();
      const step = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setDisplayed(from + (to - from) * eased);
        if (progress < 1) {
          raf = requestAnimationFrame(step);
        } else {
          fromRef.current = to;
          setDisplayed(to);
        }
      };
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(run);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span className={`tabular-fa ${className ?? ""}`} dir="ltr">
      {faNumber(displayed)}
    </span>
  );
}
