"use client";

// ─── حساب‌یار ─── فروشگاه داده محلی (localStorage) ───
// نسخه استاتیک گیت‌هاب پیجز سرور ندارد؛ همه‌چیز روی دستگاه خود کاربر می‌ماند.

import { useSyncExternalStore } from "react";
import { getDeviceId, type Transaction } from "./finance";

// نسخهٔ ۲: هر بازدیدکننده دفتر خالی خودش را شروع می‌کند.
// تغییر نسخه یعنی داده‌های دمو/قدیمی نادیده گرفته می‌شوند.
const STORAGE_KEY = "hesabyar:transactions:v2";

const EMPTY: Transaction[] = [];

let state: Transaction[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): Transaction[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // اولین بازدید؟ دفتر کاملاً خالی شروع می‌شود
      return EMPTY;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (t): t is Transaction =>
        t &&
        typeof t.id === "string" &&
        (t.type === "income" || t.type === "expense") &&
        typeof t.amount === "number" &&
        typeof t.title === "string"
    );
  } catch {
    return EMPTY;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // حافظه پر یا حالت خصوصی مرورگر — بی‌صدا رد می‌شویم
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function setState(next: Transaction[]) {
  state = next;
  emit();
}

/** روی سرور خالی؛ روی کلاینت اولین subscribe بعد از hydrateStore داده واقعی می‌دهد */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Transaction[] {
  return state;
}

function getServerSnapshot(): Transaction[] {
  return EMPTY;
}

/** در اولین useEffect کلاینت صدا زده می‌شود تا mismatch رخ ندهد */
export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = readStorage();
  listeners.forEach((l) => l());
}

export function useTransactions(): Transaction[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useHydrated(): boolean {
  return hydrated;
}

export interface NewTransactionInput {
  type: "income" | "expense";
  title: string;
  amount: number;
  category: string;
  date: string;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `tx-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function addTransaction(input: NewTransactionInput): Transaction {
  const now = new Date().toISOString();
  const record: Transaction = {
    id: newId(),
    deviceId: getDeviceId(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  setState([record, ...state]);
  return record;
}

export function updateTransaction(id: string, patch: NewTransactionInput) {
  setState(
    state.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    )
  );
}

export function deleteTransaction(id: string) {
  setState(state.filter((t) => t.id !== id));
}

export function clearAllTransactions() {
  setState([]);
}
