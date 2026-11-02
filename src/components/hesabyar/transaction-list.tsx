"use client";

// ─── حساب‌یار ─── تاریخچهٔ تراکنش‌ها ───

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, ReceiptText, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  faDate,
  faMoney,
  faNumber,
  findCategory,
  type Transaction,
} from "@/lib/finance";

type FilterKey = "all" | "income" | "expense";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "income", label: "درآمدها" },
  { key: "expense", label: "هزینه‌ها" },
];

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  const filtered = useMemo(
    () =>
      (filter === "all"
        ? transactions
        : transactions.filter((t) => t.type === filter)
      ).slice().sort(
        (a, b) =>
          b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
      ),
    [transactions, filter]
  );

  function confirmDelete() {
    if (!pendingDelete) return;
    onDelete(pendingDelete);
    setPendingDelete(null);
  }

  return (
    <div className="panel h-full p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-bronze-soft text-bronze">
            <ReceiptText className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-extrabold sm:text-lg">
              تاریخچهٔ تراکنش‌ها
            </h2>
            <p className="text-xs text-muted-foreground">
              ویرایش یا حذف هر ردیف
            </p>
          </div>
        </div>

        {/* فیلتر با قرصِ متحرک */}
        <div
          className="flex gap-1 rounded-2xl bg-muted p-1"
          role="tablist"
          aria-label="فیلتر تراکنش‌ها"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className="relative rounded-xl px-3 py-1.5 text-xs font-bold transition-colors sm:text-sm"
            >
              {filter === f.key && (
                <motion.span
                  layoutId="filter-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-background shadow-sm"
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  filter === f.key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
          <span className="text-5xl" aria-hidden>
            {transactions.length === 0 ? "👛" : "🔍"}
          </span>
          <p className="font-bold">
            {transactions.length === 0
              ? "هنوز تراکنشی ثبت نشده"
              : "تراکنشی با این فیلتر پیدا نشد"}
          </p>
          <p className="max-w-64 text-xs leading-6 text-muted-foreground">
            {transactions.length === 0
              ? "اولین دخل یا خرجت رو از فرم کنار صفحه ثبت کن!"
              : "یه فیلتر دیگه رو امتحان کن."}
          </p>
        </div>
      ) : (
        <ul className="scrollbar-thin max-h-[34rem] space-y-2 overflow-y-auto pe-1">
          <AnimatePresence initial={false}>
            {filtered.map((t) => {
              const cat = findCategory(t.category);
              const isIncome = t.type === "income";
              return (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group flex items-center gap-3 rounded-2xl border border-transparent bg-background/50 p-3 transition-colors hover:border-border hover:bg-muted/70"
                >
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full text-lg ${
                      isIncome
                        ? "bg-income-soft ring-1 ring-income/30"
                        : "bg-expense-soft ring-1 ring-expense/30"
                    }`}
                    aria-hidden
                  >
                    {cat.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold sm:text-base">
                        {t.title}
                      </p>
                      <span
                        className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline ${
                          isIncome
                            ? "bg-income-soft text-income"
                            : "bg-expense-soft text-expense"
                        }`}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {faDate(t.date)}
                    </p>
                  </div>

                  <div className="shrink-0 text-end">
                    <div
                      className={`text-sm font-extrabold sm:text-base ${
                        isIncome ? "text-income" : "text-expense"
                      }`}
                      dir="ltr"
                    >
                      {isIncome ? "+" : "−"} {faNumber(t.amount)}
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground">
                      تومان
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      aria-label={`ویرایش ${t.title}`}
                      title="ویرایش"
                      onClick={() => onEdit(t)}
                      className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-bronze-soft hover:text-bronze"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`حذف ${t.title}`}
                      title="حذف"
                      onClick={() => setPendingDelete(t)}
                      className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-expense-soft hover:text-expense"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      {/* دیالوگ تأیید حذف */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent className="max-w-sm rounded-3xl border-border bg-popover">
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="size-5 text-expense" aria-hidden />
              حذف تراکنش؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              «{pendingDelete?.title}» به مبلغ{" "}
              {pendingDelete ? faMoney(pendingDelete.amount) : ""} برای همیشه
              حذف می‌شود. این کار قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="mt-0 flex-1 rounded-2xl border-border font-bold">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="flex-1 rounded-2xl bg-expense font-bold text-white hover:bg-expense/90"
            >
              بله، حذف کن
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
