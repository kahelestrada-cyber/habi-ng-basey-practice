import { todayISO } from "@/lib/date";
import { PATTERNS, SIZES, type OrderStatus } from "@/types";

/** "2026-10-20" → "Oct 20, 2026" (parsed as a local date, not UTC). */
export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Timestamp → "Oct 3, 2:15 PM". */
export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const sizeLabel = (value: string): string =>
  SIZES.find((s) => s.value === value)?.label ?? value;

export const patternLabel = (value: string): string =>
  PATTERNS.find((p) => p.value === value)?.label ?? value;

export function isOverdue(neededBy: string, status: OrderStatus): boolean {
  return status !== "picked_up" && neededBy < todayISO();
}
