"use client";

// ─── حساب‌یار ─── نمودار ترکیب هزینه‌ها (SVG دست‌ساز، بدون کتابخانهٔ نمودار) ───

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChartPie } from "lucide-react";
import { faNumber, findCategory, type Transaction } from "@/lib/finance";
import { AnimatedNumber } from "./animated-number";

// پالت خانوادهٔ برنز + یک لهجهٔ زمردی — نه رنگین‌کمان شلوغ
const SLICE_COLORS = [
  "#c08a3e",
  "#a06a28",
  "#8a5720",
  "#5f4425",
  "#34d399",
  "#e0b06a",
  "#8f8778",
  "#64748b",
  "#475569",
];

const RADIUS = 15.9155; // محیط = ۱۰۰ واحد → درصد = واحد

interface ExpenseDonutProps {
  transactions: Transaction[];
}

export function ExpenseDonut({ transactions }: ExpenseDonutProps) {
  const data = useMemo(() => {
    const byCategory = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
      });
    const total = [...byCategory.values()].reduce((a, b) => a + b, 0);
    return [...byCategory.entries()]
      .map(([id, value]) => {
        const cat = findCategory(id);
        return {
          id,
          name: cat.label,
          emoji: cat.emoji,
          value,
          percent: total > 0 ? Math.round((value / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpense = useMemo(
    () => data.reduce((s, d) => s + d.value, 0),
    [data]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      aria-label="ترکیب هزینه‌ها"
      className="panel p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-bronze-soft text-bronze">
          <ChartPie className="size-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-extrabold sm:text-lg">
            ترکیب هزینه‌ها
          </h2>
          <p className="text-xs text-muted-foreground">
            پول‌ات کجاها می‌ره؟
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <span className="text-4xl" aria-hidden>
            📊
          </span>
          <p className="text-sm font-bold">هنوز هزینه‌ای ثبت نشده</p>
          <p className="text-xs text-muted-foreground">
            با ثبت اولین هزینه، نمودار همین‌جا ساخته می‌شه
          </p>
        </div>
      ) : (
        <div className="mt-2 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          {/* دونات */}
          <div
            className="relative h-48 w-48 shrink-0"
            role="img"
            aria-label={`نمودار دایره‌ای هزینه‌ها به مجموع ${faNumber(totalExpense)} تومان`}
          >
            <svg viewBox="0 0 42 42" className="size-full -rotate-0">
              <circle
                cx="21"
                cy="21"
                r={RADIUS}
                fill="none"
                stroke="var(--muted)"
                strokeWidth="5.5"
              />
              {(() => {
                let acc = 0;
                return data.map((d, i) => {
                  const dash = Math.max(d.percent - 1.4, 0.6);
                  const offset = (25 - acc + 100) % 100;
                  acc += d.percent;
                  const color = SLICE_COLORS[i % SLICE_COLORS.length];
                  return (
                    <motion.circle
                      key={d.id}
                      cx="21"
                      cy="21"
                      r={RADIUS}
                      fill="none"
                      stroke={color}
                      strokeWidth="5.5"
                      style={{ strokeDashoffset: offset }}
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{
                        strokeDasharray: `${dash} ${100 - dash}`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 55,
                        damping: 15,
                        delay: 0.1 + i * 0.09,
                      }}
                    />
                  );
                });
              })()}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-muted-foreground">
                جمع هزینه
              </span>
              <AnimatedNumber
                value={totalExpense}
                className="text-sm font-extrabold text-expense"
              />
              <span className="text-[10px] text-muted-foreground">تومان</span>
            </div>
          </div>

          {/* راهنما — پنج خرجِ بزرگ‌تر */}
          <ul className="w-full space-y-2.5">
            {data.slice(0, 5).map((d, i) => {
              const color = SLICE_COLORS[i % SLICE_COLORS.length];
              return (
                <li key={d.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                    <span className="text-xs" aria-hidden>
                      {d.emoji}
                    </span>
                    <span className="flex-1 truncate text-xs font-bold">
                      {d.name}
                    </span>
                    <span
                      className="text-xs font-extrabold text-foreground/80"
                      dir="ltr"
                    >
                      {faNumber(d.percent)}٪
                    </span>
                  </div>
                  <div className="relative h-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="absolute inset-y-0 start-0 rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${d.percent}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.25 + i * 0.09,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </motion.section>
  );
}
