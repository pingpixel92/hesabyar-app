"use client";

// ─── حساب‌یار ─── پنل آمار: موجودی کل (پنل تیرهٔ برنز) + درآمد و هزینه ───

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { faNumber, type Transaction } from "@/lib/finance";
import { AnimatedNumber } from "./animated-number";

const EASE = [0.22, 1, 0.36, 1] as const;

const cardMotion = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: EASE },
});

export function StatsCards({ transactions }: { transactions: Transaction[] }) {
  const { totalIncome, totalExpense, balance, isPositive } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    const balance = income - expense;
    return {
      totalIncome: income,
      totalExpense: expense,
      balance,
      isPositive: balance >= 0,
    };
  }, [transactions]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* پنل موجودی کل — مشکی با درخشش برنز، در هر دو تم */}
      <motion.section
        {...cardMotion(0)}
        aria-label="موجودی کل"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-bl from-[#1a150f] via-[#100d09] to-[#0c0a07] p-6 text-[#f3ede2] shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)] sm:p-8 md:col-span-2"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -start-24 -top-24 size-72 rounded-full bg-[#c08a3e]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -end-16 size-80 rounded-full bg-[#c08a3e]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(243,237,226,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(243,237,226,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 72%)",
          }}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/60">موجودی کل</p>
            <div className="mt-3 flex items-baseline gap-2.5">
              <AnimatedNumber
                value={balance}
                className={`text-4xl font-black tracking-tight sm:text-5xl ${
                  isPositive ? "text-white" : "text-red-300"
                }`}
              />
              <span className="text-sm font-medium text-white/60">تومان</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur">
                {faNumber(transactions.length)} تراکنش ثبت‌شده
              </span>
              <span
                className={`rounded-full px-3 py-1 font-medium backdrop-blur ${
                  isPositive
                    ? "bg-[#34d399]/15 text-[#8fe9c3]"
                    : "bg-[#f87171]/20 text-[#fecaca]"
                }`}
              >
                {isPositive ? "وضعیت مالی سبز ✅" : "خرج‌ها جلوتر از دخل‌ها ⚠️"}
              </span>
            </div>
          </div>
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
            <Wallet className="size-7 text-[#e3ba7e]" aria-hidden />
          </div>
        </div>
      </motion.section>

      {/* درآمد و هزینه */}
      <div className="grid gap-4">
        <motion.section
          {...cardMotion(0.08)}
          aria-label="مجموع درآمد"
          className="panel flex items-center justify-between gap-3 p-5"
        >
          <div>
            <p className="text-sm font-medium text-income/90">مجموع درآمد</p>
            <div className="mt-2 flex items-baseline gap-1.5" dir="ltr">
              <span className="text-xl font-extrabold text-income">+</span>
              <AnimatedNumber
                value={totalIncome}
                className="text-2xl font-extrabold text-income"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">تومان</p>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-income-soft">
            <TrendingUp className="size-6 text-income" aria-hidden />
          </div>
        </motion.section>

        <motion.section
          {...cardMotion(0.16)}
          aria-label="مجموع هزینه"
          className="panel flex items-center justify-between gap-3 p-5"
        >
          <div>
            <p className="text-sm font-medium text-expense/90">مجموع هزینه</p>
            <div className="mt-2 flex items-baseline gap-1.5" dir="ltr">
              <span className="text-xl font-extrabold text-expense">−</span>
              <AnimatedNumber
                value={totalExpense}
                className="text-2xl font-extrabold text-expense"
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">تومان</p>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-expense-soft">
            <TrendingDown className="size-6 text-expense" aria-hidden />
          </div>
        </motion.section>
      </div>

    </div>
  );
}
