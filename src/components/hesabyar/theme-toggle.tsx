"use client";

// ─── حساب‌یار ─── سوییچ روز و شب ───

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const THUMB_TRAVEL_PX = 26;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={() => setHint(true)}
      onMouseLeave={() => setHint(false)}
      aria-label={isDark ? "رفتن به حالت روشن" : "رفتن به حالت تیره"}
      title={isDark ? "حالت روشن" : "حالت تیره"}
      className="relative inline-flex h-10 w-[4.4rem] items-center rounded-full border border-border bg-secondary/70 p-1 backdrop-blur transition-colors hover:border-bronze/60"
    >
      <motion.span
        animate={{ x: isDark ? 0 : -THUMB_TRAVEL_PX }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className={`flex size-8 items-center justify-center rounded-full shadow-md ${
          isDark
            ? "bg-[#17130e] text-[#e3ba7e] shadow-black/40"
            : "bg-[#a06a28] text-[#fff8ec] shadow-black/10"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -70, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 70, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex"
          >
            {isDark ? (
              <Moon className="size-4" aria-hidden />
            ) : (
              <Sun className="size-4" aria-hidden />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
      <AnimatePresence>
        {hint && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="pointer-events-none absolute -top-8 start-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-2 py-1 text-[10px] font-medium text-popover-foreground shadow-md"
          >
            {isDark ? "حالت روشن" : "حالت تیره"}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
