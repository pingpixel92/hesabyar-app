"use client";

// ─── حساب‌یار ─── هیروی ادیتوریال با ریویل کلمه‌به‌کلمه ───
// نکتهٔ تایپوگرافی: متن فارسی حرف‌به‌حرف شکسته نمی‌شود (اتصال حروف
// به‌هم می‌ریخت)؛ به‌جای آن واژه‌ها با بلور و خیزِ کوتاه از پایین ظاهر می‌شوند.

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function RevealWords({
  text,
  revealed,
  delay = 0,
  wordDelay = 0.09,
  className,
  wordClassName,
}: {
  text: string;
  revealed: boolean;
  delay?: number;
  wordDelay?: number;
  className?: string;
  /** کلاسی که روی هر واژه اعمال می‌شود (مثلاً گرادیان برنز) */
  wordClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName ?? ""}`}
              initial={{ y: "115%", opacity: 0, filter: "blur(10px)" }}
              animate={
                revealed
                  ? { y: "0%", opacity: 1, filter: "blur(0px)" }
                  : { y: "115%", opacity: 0, filter: "blur(10px)" }
              }
              transition={{
                duration: 0.85,
                delay: delay + i * wordDelay,
                ease: EASE,
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* فاصلهٔ واقعی بین واژه‌ها — خارج از قاب کلیپ */}
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

function FadeUp({
  revealed,
  delay,
  className,
  children,
}: {
  revealed: boolean;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Hero({ revealed }: { revealed: boolean }) {
  return (
    <section className="relative pt-6 sm:pt-12">
      {/* واترمارک لاتین برند */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: 24 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
        className="watermark absolute -top-2 left-1/2 -translate-x-1/2 text-[21vw] sm:-top-6 sm:text-[12.5rem]"
      >
        HESABYAR
      </motion.span>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <FadeUp revealed={revealed} delay={0.05}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bronze opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-bronze" />
            </span>
            دفتر دخل و خرج • بدون ثبت‌نام، بدون سرور
          </span>
        </FadeUp>

        <h2
          className="mt-6 text-4xl font-black leading-[1.18] tracking-tight sm:mt-8 sm:text-6xl lg:text-7xl"
          aria-label="هر تومان، سرِ جایش."
        >
          <RevealWords
            text="هر تومان،"
            revealed={revealed}
            delay={0.15}
          />{" "}
          <RevealWords
            text="سرِ جایش."
            revealed={revealed}
            delay={0.42}
            wordClassName="text-bronze-gradient"
          />
        </h2>

        <FadeUp
          revealed={revealed}
          delay={0.75}
          className="mx-auto mt-5 max-w-xl"
        >
          <p className="text-sm leading-8 text-muted-foreground sm:text-base">
            دخل و خرجت رو شفاف کن: سبز یعنی دخل، قرمز یعنی خرج. حساب‌یار
            همین‌جا کنارته — سریع، خوش‌ساخت و همیشه در دسترس.
          </p>
        </FadeUp>

        <FadeUp
          revealed={revealed}
          delay={0.9}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-income-soft px-3 py-1 text-xs font-bold text-income">
            <span className="size-1.5 rounded-full bg-income" aria-hidden />
            دخل = سبز
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-expense-soft px-3 py-1 text-xs font-bold text-expense">
            <span className="size-1.5 rounded-full bg-expense" aria-hidden />
            خرج = قرمز
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-bronze-soft px-3 py-1 text-xs font-bold text-bronze">
            <span className="size-1.5 rounded-full bg-bronze" aria-hidden />
            ذخیرهٔ محلی و خصوصی
          </span>
        </FadeUp>
      </div>
    </section>
  );
}
