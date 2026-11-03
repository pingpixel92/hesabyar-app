// ─── حساب‌یار ─── داده نمونه برای اولین باز شدن ───
// تاریخ‌ها نسبت به «امروز» ساخته می‌شوند تا دفتر همیشه تازه به نظر برسد.

import { getDeviceId, type Transaction, type TransactionType } from "./finance";

function iso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  // نیمه‌روز تصادفی برای تنوع ساعت
  d.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 59), 0, 0);
  return d.toISOString();
}

function isoDateOnly(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

let counter = 0;
function make(
  type: TransactionType,
  title: string,
  amount: number,
  category: string,
  daysAgo: number
): Transaction {
  counter += 1;
  const now = new Date().toISOString();
  return {
    id: `sample-${counter}`,
    deviceId: "sample-device",
    type,
    title,
    amount,
    category,
    date: isoDateOnly(daysAgo),
    createdAt: iso(daysAgo),
    updatedAt: now,
  };
}

/** ۱۴ تراکنش واقع‌گرایانه برای شروع — ۴ دخل و ۱۰ خرج */
export function buildSampleTransactions(): Transaction[] {
  counter = 0;
  const deviceId = getDeviceId();
  const items: Transaction[] = [
    // ── دخل‌ها ──
    make("income", "حقوق این ماه", 32500000, "salary", 0),
    make("income", "پروژه طراحی لوگو", 6800000, "side", 6),
    make("income", "سود سپرده بانکی", 1240000, "investment", 12),
    make("income", "فروش گوشی قدیمی", 4200000, "sale", 20),

    // ── خرج‌ها ──
    make("expense", "خرید هفتگی فروشگاه", 1860000, "food", 0),
    make("expense", "ناهار با بچه‌ها", 640000, "food", 1),
    make("expense", "تاکسی اینترنتی", 186000, "transport", 1),
    make("expense", "کافه‌نشینی جمعه‌ای", 220000, "fun", 2),
    make("expense", "قبض برق مهر", 486000, "bills", 3),
    make("expense", "اشتراک اینترنت خانه", 385000, "bills", 5),
    make("expense", "داروخانه", 342000, "health", 7),
    make("expense", "کتاب و لوازم تحریر", 415000, "education", 9),
    make("expense", "کت و شلوار عید", 1350000, "shopping", 14),
    make("expense", "اجاره خانه", 9500000, "home", 25),
  ];
  // داده نمونه هم به دستگاه همین مرورگر وصل می‌شود
  return items.map((t) => ({ ...t, deviceId }));
}
