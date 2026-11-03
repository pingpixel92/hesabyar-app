"use client";

// ─── حساب‌یار ─── پوستهٔ داشبورد: افکت‌ها + پردهٔ ورود + چیدمان اصلی ───

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Transaction } from "@/lib/finance";
import {
  addTransaction,
  deleteTransaction,
  hydrateStore,
  updateTransaction,
  useTransactions,
} from "@/lib/store";
import { BronzeWave } from "./bronze-wave";
import { GridOverlay } from "./grid-overlay";
import { Hero } from "./hero";
import { PageLoader } from "./page-loader";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { StatsCards } from "./stats-cards";
import {
  TransactionForm,
  type TransactionFormValues,
} from "./transaction-form";
import { TransactionList } from "./transaction-list";
import { ExpenseDonut } from "./expense-donut";

export function Dashboard() {
  const [revealed, setRevealed] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const transactions = useTransactions();

  // بارگذاری دادهٔ محلی بعد از اولین رندر (بدون mismatch)
  useEffect(() => {
    hydrateStore();
  }, []);

  function handleSubmit(values: TransactionFormValues) {
    if (editing) {
      updateTransaction(editing.id, values);
      toast.success("تغییرات با موفقیت ذخیره شد ✅");
      setEditing(null);
    } else {
      addTransaction(values);
      toast.success(
        values.type === "income"
          ? "درآمد جدید ثبت شد 🟢"
          : "هزینه جدید ثبت شد 🔴"
      );
    }
  }

  function handleDelete(t: Transaction) {
    deleteTransaction(t.id);
    toast.success("تراکنش حذف شد 🗑️");
    if (editing?.id === t.id) setEditing(null);
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-x-clip">
      {/* لایه‌های سینمایی */}
      <BronzeWave />
      <div aria-hidden className="grain-overlay" />
      <GridOverlay />

      {/* پردهٔ ورود */}
      {!loaderGone && (
        <PageLoader
          onReveal={() => setRevealed(true)}
          onFinish={() => setLoaderGone(true)}
        />
      )}

      <SiteHeader />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-8 sm:pt-10">
        <Hero revealed={revealed} />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 space-y-6"
        >
          <StatsCards transactions={transactions} />

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <TransactionForm
                editing={editing}
                onSubmit={handleSubmit}
                onCancelEdit={() => setEditing(null)}
              />
            </div>
            <div className="lg:col-span-3">
              <TransactionList
                transactions={transactions}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <ExpenseDonut transactions={transactions} />
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}
