"use client";

// ─── حساب‌یار ─── انتخابگر تاریخ شمسی ───
// سه انتخاب سادهٔ روز/ماه/سال با اعداد و ماه‌های فارسی؛
// مقدار ورودی و خروجی همیشه رشتهٔ میلادی ISO (YYYY-MM-DD) است
// تا مدل داده دست‌نخورده بماند و نمایش همه‌جا شمسی باشد.

import { useMemo } from "react";
import {
  JALALI_MONTHS,
  faNumber,
  isoToJalaliParts,
  jalaliMonthLength,
  jalaliPartsToIso,
  todayInput,
} from "@/lib/finance";

interface JalaliDatePickerProps {
  /** رشتهٔ میلادی YYYY-MM-DD */
  value: string;
  onChange: (iso: string) => void;
  id?: string;
}

const SELECT_CLASS =
  "h-12 rounded-2xl border-2 border-border bg-background/60 px-3 text-sm font-bold text-foreground outline-none transition-colors focus-visible:border-bronze/60 focus-visible:ring-2 focus-visible:ring-bronze/25";

export function JalaliDatePicker({ value, onChange, id }: JalaliDatePickerProps) {
  const parts = useMemo(() => {
    try {
      return isoToJalaliParts(value || todayInput());
    } catch {
      return isoToJalaliParts(todayInput());
    }
  }, [value]);

  const { jy, jm, jd } = parts;
  const maxDay = jalaliMonthLength(jy, jm);

  // بازهٔ سال‌ها: ۱۵ سال قبل تا یک سال بعد از امسال
  const years = useMemo(() => {
    const now = isoToJalaliParts(todayInput()).jy;
    const list: number[] = [];
    for (let y = now + 1; y >= now - 15; y -= 1) list.push(y);
    return list;
  }, []);

  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay]
  );

  /** با تغییر ماه/سال، روزِ خارج از محدوده جمع می‌شود */
  function emit(nextJy: number, nextJm: number, nextJd: number) {
    const clamped = Math.min(nextJd, jalaliMonthLength(nextJy, nextJm));
    onChange(jalaliPartsToIso(nextJy, nextJm, clamped));
  }

  return (
    <div className="grid grid-cols-[5.5rem_1fr_6.5rem] gap-2" dir="rtl">
      <select
        id={id}
        aria-label="روز"
        value={jd}
        onChange={(e) => emit(jy, jm, Number(e.target.value))}
        className={SELECT_CLASS}
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {faNumber(d)}
          </option>
        ))}
      </select>

      <select
        aria-label="ماه"
        value={jm}
        onChange={(e) => emit(jy, Number(e.target.value), jd)}
        className={SELECT_CLASS}
      >
        {JALALI_MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>
            {name}
          </option>
        ))}
      </select>

      <select
        aria-label="سال"
        value={jy}
        onChange={(e) => emit(Number(e.target.value), jm, jd)}
        className={SELECT_CLASS}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {faNumber(y)}
          </option>
        ))}
      </select>
    </div>
  );
}
