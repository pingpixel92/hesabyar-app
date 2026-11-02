// ─── حساب‌یار ─── منطق مشترک مالی، دسته‌بندی‌ها و فرمت‌کننده‌های فارسی ───

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  deviceId: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: string;
  date: string; // ISO string
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDef {
  id: string;
  label: string;
  emoji: string;
}

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { id: "food", label: "خوراک", emoji: "🍔" },
  { id: "transport", label: "حمل‌ونقل", emoji: "🚕" },
  { id: "home", label: "خانه و اجاره", emoji: "🏠" },
  { id: "shopping", label: "خرید", emoji: "🛍️" },
  { id: "bills", label: "قبض‌ها", emoji: "🧾" },
  { id: "fun", label: "تفریح", emoji: "🎬" },
  { id: "health", label: "سلامت", emoji: "💊" },
  { id: "education", label: "آموزش", emoji: "📚" },
  { id: "other-expense", label: "سایر", emoji: "📦" },
];

export const INCOME_CATEGORIES: CategoryDef[] = [
  { id: "salary", label: "حقوق", emoji: "💼" },
  { id: "side", label: "پروژه جانبی", emoji: "💻" },
  { id: "gift", label: "هدیه", emoji: "🎁" },
  { id: "investment", label: "سود سرمایه", emoji: "📈" },
  { id: "sale", label: "فروش", emoji: "🏪" },
  { id: "other-income", label: "سایر", emoji: "📦" },
];

export function categoriesFor(type: TransactionType): CategoryDef[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function findCategory(id: string): CategoryDef {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  return all.find((c) => c.id === id) ?? { id, label: "سایر", emoji: "📦" };
}

// ─── تبدیل ارقام فارسی/عربی به لاتین ───
export function toEnDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

// ─── نمایش عدد با جداکننده و ارقام فارسی ───
export function faNumber(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

// ─── مبلغ + واحد پول ───
export function faMoney(value: number): string {
  return `${faNumber(value)} تومان`;
}

// ─── تاریخ شمسی از رشته ISO (بدون خطای منطقه زمانی) ───
export function faDate(iso: string): string {
  try {
    const d = new Date(iso);
    const local = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(local);
  } catch {
    return "—";
  }
}

// ─── امروز به شکل «سه‌شنبه ۱۲ آبان» برای چیپ هدر ───
export function faTodayLong(): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
  } catch {
    return "—";
  }
}

// ─── امروز به شکل YYYY-MM-DD (منطقه زمانی محلی) ───
export function todayInput(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ─── ISO به ورودی input[type=date] ───
export function isoToDateInput(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ─── شناسه دستگاه برای ذخیره‌سازی بدون لاگین ───
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  const KEY = "hesabyar-device-id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}
