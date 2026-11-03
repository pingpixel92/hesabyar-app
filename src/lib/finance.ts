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

// ─── تاریخ شمسی از رشته ISO (بدون خطای منطقه زمانی، تقویم شمسی تضمین‌شده) ───
export function faDate(iso: string): string {
  try {
    const d = new Date(iso);
    const local = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
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
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
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

// ═══ تقویم شمسی (جلالی) ═══
// الگوریتم استاندارد تبدیل میلادی ↔ شمسی (خانوادهٔ jalaali) —
// بدون وابستگی خارجی، دقیق برای سال‌های ۱۱۷۸ تا ۱۶۳۳ شمسی.

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function jDiv(a: number, b: number): number {
  return ~~(a / b);
}

function jMod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jm = 0;
  let jump = 0;
  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }
  for (let i = 1; i < bl; i += 1) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + jDiv(jump, 33) * 8 + jDiv(jMod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + jDiv(n, 33) * 8 + jDiv(jMod(n, 33) + 3, 4);
  if (jMod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = jDiv(gy, 4) - jDiv((jDiv(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + jDiv(jump + 4, 33) * 33;
  let leap = jMod(jMod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    jDiv((gy + jDiv(gm - 8, 6) + 100100) * 1461, 4) +
    jDiv(153 * jMod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - jDiv(jDiv(gy + 100100 + jDiv(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + jDiv(jDiv(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = jDiv(jMod(j, 1461), 4) * 5 + 308;
  const gd = jDiv(jMod(i, 153), 5) + 1;
  const gm = jMod(jDiv(i, 153), 12) + 1;
  const gy = jDiv(j, 1461) - 100100 + jDiv(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - jDiv(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): { jy: number; jm: number; jd: number } {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(r.gy, 3, r.march);
  let jd: number;
  let jm: number;
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + jDiv(k, 31);
      jd = jMod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + jDiv(k, 30);
  jd = jMod(k, 30) + 1;
  return { jy, jm, jd };
}

/** میلادی → شمسی */
export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number
): { jy: number; jm: number; jd: number } {
  return d2j(g2d(gy, gm, gd));
}

/** شمسی → میلادی */
export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number
): { gy: number; gm: number; gd: number } {
  return d2g(j2d(jy, jm, jd));
}

/** سال کبیسهٔ شمسی؟ */
export function isJalaliLeap(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

/** تعداد روزهای ماه شمسی */
export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeap(jy) ? 30 : 29;
}

/** رشتهٔ YYYY-MM-DD میلادی → بخش‌های شمسی */
export function isoToJalaliParts(iso: string): {
  jy: number;
  jm: number;
  jd: number;
} {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return gregorianToJalali(y, m, d);
}

/** بخش‌های شمسی → رشتهٔ YYYY-MM-DD میلادی (فرمت ذخیره‌سازی) */
export function jalaliPartsToIso(
  jy: number,
  jm: number,
  jd: number
): string {
  const { gy, gm, gd } = jalaliToGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
}
