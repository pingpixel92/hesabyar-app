"use client";

// ─── حساب‌یار ─── کرسر سفارشی دو-حلقه‌ای ───
// نقطهٔ داخلی فوری می‌چسبد، حلقهٔ بیرونی با تأخیر نرم دنبال می‌کند؛
// روی عناصر تعاملی بزرگ می‌شود و روی فیلدهای متنی خودش را جمع می‌کند.

import { useEffect, useRef, useState } from "react";

export function CursorRing() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // فعال‌سازی فقط برای دسکتاپ با موس — با یک فریم تأخیر تا قانون
  // setState همگام در افکت نقض نشود
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const id = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let rx = cx;
    let ry = cy;
    let seen = false;
    let raf = 0;

    const apply = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      apply(dot, cx, cy);
      if (!seen) {
        seen = true;
        rx = cx;
        ry = cy;
        dot.classList.remove("is-hidden");
        ring.classList.remove("is-hidden");
      }
      const target = e.target as HTMLElement | null;
      const overField = !!target?.closest(
        "input, textarea, select, [contenteditable='true']"
      );
      const interactive = !!target?.closest(
        "a, button, [role='tab'], [data-cursor='hover'], label[for]"
      );
      dot.classList.toggle("is-hidden", overField);
      ring.classList.toggle("is-hidden", overField);
      ring.classList.toggle("is-hover", interactive && !overField);
    };

    const onLeave = () => {
      dot.classList.add("is-hidden");
      ring.classList.add("is-hidden");
      seen = false;
    };

    const loop = () => {
      rx += (cx - rx) * 0.18;
      ry += (cy - ry) * 0.18;
      apply(ring, rx, ry);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} aria-hidden className="cursor-dot is-hidden" />
      <div ref={ringRef} aria-hidden className="cursor-ring is-hidden" />
    </>
  );
}
