"use client";

// ─── حساب‌یار ─── فوتر با واترمارک و پاک‌سازی داده ───

import { useState } from "react";
import { toast } from "sonner";
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
import { clearAllTransactions } from "@/lib/store";
import { LogoMark } from "./logo";

export function SiteFooter() {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60 bg-background/50 backdrop-blur">
      <span
        aria-hidden
        className="watermark absolute inset-x-0 -bottom-4 text-center text-[4.6rem] sm:-bottom-6 sm:text-[7.5rem]"
      >
        HESABYAR
      </span>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 pb-14 pt-8 text-center sm:pb-16">
        <div className="flex items-center gap-2">
          <LogoMark className="size-6" />
          <span className="text-sm font-extrabold">حساب‌یار</span>
        </div>
        <p className="max-w-md text-xs leading-6 text-muted-foreground">
          همراه دخل و خرجت 💚 همهٔ داده‌ها فقط روی همین دستگاه ذخیره می‌شن و
          جایی ارسال نمی‌شن.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="rounded-xl px-2 py-1 text-[11px] font-bold text-expense/70 transition-colors hover:bg-expense-soft hover:text-expense"
          >
            پاک کردن همهٔ داده‌ها
          </button>
          <span className="size-1 rounded-full bg-border" aria-hidden />
          <span className="font-display text-[10px] tracking-[0.32em] text-muted-foreground/60">
            LOCAL FIRST LEDGER
          </span>
        </div>

        {/* اعتبار سازندگان — خط ریز */}
        <p className="text-[10px] leading-5 text-muted-foreground/55">
          ساخته شده توسط سام الیاسی · دیزاین شده توسط سامیار احمدوند
        </p>
      </div>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent className="max-w-sm rounded-3xl border-border bg-popover">
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle>پاک کردن همهٔ داده‌ها؟</AlertDialogTitle>
            <AlertDialogDescription>
              همهٔ تراکنش‌های ثبت‌شده روی این مرورگر برای همیشه حذف می‌شن و
              دفتر از صفر شروع می‌شه. این کار قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="mt-0 flex-1 rounded-2xl border-border font-bold">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                setConfirmClear(false);
                clearAll();
              }}
              className="flex-1 rounded-2xl bg-expense font-bold text-white hover:bg-expense/90"
            >
              بله، همه‌ش پاک شه
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </footer>
  );
}

function clearAll() {
  clearAllTransactions();
  toast.success("همهٔ داده‌ها پاک شد 🧼");
}
