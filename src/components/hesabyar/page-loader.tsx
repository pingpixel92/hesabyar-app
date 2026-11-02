"use client";

// ─── حساب‌یار ─── لودر ورود با شمارندهٔ ۰۰۰ → ۱۰۰ ───
// پردهٔ تمام‌صفحهٔ تیره که با اتمام شمارش، به بالا سُر می‌خورد.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "./logo";

const FILL_MS = 1300;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function toFa(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}
function paddedCounter(n: number): string {
  return toFa(String(Math.min(100, Math.max(0, n))).padStart(3, "0"));
}

export function PageLoader({
  onReveal,
  onFinish,
}: {
  onReveal: () => void;
  onFinish: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    if (reduced) {
      const timer = window.setTimeout(() => {
        setProgress(100);
        onReveal();
        onFinish();
      }, 200);
      return () => window.clearTimeout(timer);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / FILL_MS);
      // easeInOutCubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        onReveal();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  // با شروع خروج، اسکرول آزاد می‌شود
  useEffect(() => {
    if (leaving) document.documentElement.style.overflow = "";
  }, [leaving]);

  return (
    <motion.div
      role="status"
      aria-label="در حال بارگذاری حساب‌یار"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-9 rounded-b-[2rem] bg-[#0a0805] text-[#f3ede2]"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (leaving && !doneRef.current) {
          doneRef.current = true;
          onFinish();
        }
      }}
    >
      <motion.div
        animate={leaving ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <div className="flex items-center gap-3">
          <LogoMark className="size-10" />
          <span className="text-2xl font-extrabold tracking-tight">حساب‌یار</span>
        </div>
        <p className="max-w-[28ch] text-sm leading-6 text-white/55">
          دفتر دخل و خرجت — هر تومان، سرِ جایش.
        </p>
      </motion.div>

      <motion.div
        animate={leaving ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-[min(22rem,72vw)] space-y-3"
      >
        <div className="h-px w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[#8a5720] via-[#c08a3e] to-[#e0b06a]"
            style={{ width: `${progress}%`, transition: "width 0.1s ease-out" }}
          />
        </div>
        <div className="flex items-center justify-between text-[0.7rem] font-medium uppercase tracking-[0.08em] text-white/45">
          <span>در حال آماده‌سازی دفتر</span>
          <span className="tabular-fa text-white/85">{paddedCounter(progress)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
