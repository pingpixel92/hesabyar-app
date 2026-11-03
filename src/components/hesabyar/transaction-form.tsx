"use client";

// ─── حساب‌یار ─── فرم ثبت و ویرایش تراکنش ───

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PencilLine,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  categoriesFor,
  faNumber,
  isoToDateInput,
  toEnDigits,
  todayInput,
  type Transaction,
  type TransactionType,
} from "@/lib/finance";
import type { NewTransactionInput } from "@/lib/store";

export type TransactionFormValues = NewTransactionInput;

interface TransactionFormProps {
  editing: Transaction | null;
  onSubmit: (values: TransactionFormValues) => void;
  onCancelEdit: () => void;
}

export function TransactionForm({
  editing,
  onSubmit,
  onCancelEdit,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amountText, setAmountText] = useState("");
  const [category, setCategory] = useState(
    () => categoriesFor("expense")[0].id
  );
  const [date, setDate] = useState(todayInput());
  const cardRef = useRef<HTMLDivElement>(null);

  // الگوی توصیه‌شدهٔ ری‌اکت: تنظیم state هنگام رندر وقتی prop تغییر می‌کند
  const [prevEditing, setPrevEditing] = useState<Transaction | null>(null);
  if (editing !== prevEditing) {
    setPrevEditing(editing);
    if (editing) {
      setType(editing.type);
      setTitle(editing.title);
      setAmountText(faNumber(editing.amount));
      setCategory(editing.category);
      setDate(isoToDateInput(editing.date));
    }
  }

  // آوردن فرم به مرکز دید هنگام ویرایش
  useEffect(() => {
    if (editing) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editing]);

  function handleTypeChange(next: TransactionType) {
    setType(next);
    const list = categoriesFor(next);
    if (!list.some((c) => c.id === category)) {
      setCategory(list[0].id);
    }
  }

  function handleAmountChange(raw: string) {
    const digits = toEnDigits(raw)
      .replace(/[^\d]/g, "")
      .slice(0, 15);
    setAmountText(digits ? Number(digits).toLocaleString("fa-IR") : "");
  }

  function resetFields() {
    setTitle("");
    setAmountText("");
    setCategory(categoriesFor(type)[0].id);
    setDate(todayInput());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(toEnDigits(amountText).replace(/[^\d]/g, ""));
    if (!amount || amount <= 0) {
      toast.error("یه مبلغ معتبر وارد کن 💰");
      return;
    }
    if (!title.trim()) {
      toast.error("عنوان تراکنش رو بنویس ✍️");
      return;
    }
    onSubmit({ type, title: title.trim(), amount, category, date });
    resetFields();
  }

  const isExpense = type === "expense";

  return (
    <div
      ref={cardRef}
      className={`panel h-full p-5 transition-shadow sm:p-6 ${
        editing ? "ring-2 ring-bronze/70" : ""
      }`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex size-11 items-center justify-center rounded-2xl ${
            editing
              ? "bg-bronze-soft text-bronze"
              : isExpense
                ? "bg-expense-soft text-expense"
                : "bg-income-soft text-income"
          }`}
        >
          {editing ? (
            <PencilLine className="size-5" aria-hidden />
          ) : (
            <Plus className="size-5" aria-hidden />
          )}
        </div>
        <div>
          <h2 className="text-base font-extrabold sm:text-lg">
            {editing ? "ویرایش تراکنش" : "تراکنش جدید"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {editing
              ? "تغییرات رو اعمال کن و ذخیره بزن"
              : "خرج و دخل زندگی رو همین‌جا ثبت کن"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* سوییچ نوع تراکنش */}
        <div
          className="grid grid-cols-2 gap-1.5 rounded-2xl bg-muted p-1.5"
          role="tablist"
          aria-label="نوع تراکنش"
        >
          {(
            [
              { key: "expense", label: "هزینه", Icon: ArrowUpRight },
              { key: "income", label: "درآمد", Icon: ArrowDownLeft },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={type === key}
              onClick={() => handleTypeChange(key)}
              className="relative rounded-xl px-4 py-2.5 text-sm font-bold"
            >
              {type === key && (
                <motion.span
                  layoutId="type-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className={`absolute inset-0 rounded-xl shadow-lg ${
                    key === "expense"
                      ? "bg-expense shadow-expense/30"
                      : "bg-income shadow-income/30"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex items-center justify-center gap-1.5 transition-colors ${
                  type === key
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* مبلغ */}
        <div className="space-y-2">
          <Label htmlFor="amount">مبلغ (تومان)</Label>
          <div className="relative">
            <Input
              id="amount"
              inputMode="numeric"
              placeholder="مثلاً ۲۵۰٬۰۰۰"
              value={amountText}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`h-12 rounded-2xl border-2 pe-16 text-lg font-bold ${
                isExpense
                  ? "border-expense/30 focus-visible:ring-expense/40"
                  : "border-income/30 focus-visible:ring-income/40"
              }`}
            />
            <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-muted-foreground">
              تومان
            </span>
          </div>
        </div>

        {/* عنوان */}
        <div className="space-y-2">
          <Label htmlFor="title">عنوان</Label>
          <Input
            id="title"
            placeholder="مثلاً خرید هفتگی، حقوق آبان…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="h-12 rounded-2xl"
          />
        </div>

        {/* دسته‌بندی */}
        <div className="space-y-2">
          <Label>دسته‌بندی</Label>
          <div className="flex flex-wrap gap-2">
            {categoriesFor(type).map((c) => {
              const selected = category === c.id;
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={selected}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className={`rounded-2xl border px-3 py-2 text-xs font-bold ${
                    selected
                      ? isExpense
                        ? "border-expense bg-expense-soft text-expense"
                        : "border-income bg-income-soft text-income"
                      : "border-border bg-background/50 text-muted-foreground hover:border-bronze/40 hover:text-foreground"
                  }`}
                >
                  <span className="me-1" aria-hidden>
                    {c.emoji}
                  </span>
                  {c.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* تاریخ */}
        <div className="space-y-2">
          <Label htmlFor="date">تاریخ</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 rounded-2xl"
          />
        </div>

        {/* دکمه‌ها */}
        <div className="flex gap-2 pt-1">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-extrabold text-white shadow-lg ${
              editing
                ? "bg-gradient-to-l from-[#8a5720] to-[#c08a3e] shadow-bronze/30"
                : isExpense
                  ? "bg-gradient-to-l from-red-600 to-rose-500 shadow-red-500/30"
                  : "bg-gradient-to-l from-emerald-600 to-emerald-500 shadow-emerald-500/30"
            }`}
          >
            {editing ? (
              <>
                <PencilLine className="size-5" aria-hidden />
                ذخیره تغییرات
              </>
            ) : (
              <>
                <Plus className="size-5" aria-hidden />
                ثبت {isExpense ? "هزینه" : "درآمد"}
              </>
            )}
          </motion.button>
          {editing && (
            <motion.button
              type="button"
              onClick={() => {
                resetFields();
                onCancelEdit();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="h-12 rounded-2xl border border-border bg-background/60 px-5 font-bold text-foreground/80 transition-colors hover:border-bronze/40 hover:text-foreground"
            >
              انصراف
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
}
