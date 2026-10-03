import { z } from "zod";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { BanigPattern, BanigSize } from "@/types";

const SIZE_VALUES = [
  "2x3",
  "3x5",
  "4x6",
  "5x7",
] as const satisfies readonly BanigSize[];
const PATTERN_VALUES = [
  "bulaklak",
  "diamond",
  "stripes",
  "dahon",
  "church",
  "lettering",
] as const satisfies readonly BanigPattern[];

/** Local date as YYYY-MM-DD (date inputs use local time, not UTC). */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const orderSchema = z.object({
  size: z.enum(SIZE_VALUES, { error: "Choose a size" }),
  pattern: z.enum(PATTERN_VALUES, { error: "Choose a pattern" }),
  quantity: z
    .number({ error: "Enter how many you need" })
    .int("Whole numbers only")
    .min(1, "At least 1")
    .max(500, "For more than 500, please call the coop"),
  buyer_name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(80, "Name is too long"),
  contact: z
    .string()
    .trim()
    .regex(/^(09|\+639)\d{9}$/, "Use a PH mobile number, e.g. 09171234567"),
  needed_by: z
    .string()
    .min(1, "Pick the date you need it")
    .refine((d) => d >= todayISO(), "Date must be today or later"),
  notes: z.string().trim().max(500, "Keep notes under 500 characters"),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

export interface PlacedOrder extends OrderFormValues {
  code: string;
}

// No 0/O/1/I so codes are easy to read aloud. Matches the DB check constraint.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const chars = Array.from(
    bytes,
    (b) => CODE_ALPHABET[b % CODE_ALPHABET.length],
  );
  return `HB-${chars.join("")}`;
}

const UNIQUE_VIOLATION = "23505";

/**
 * Inserts the order as anon. No `.select()` — anon has INSERT only (RLS),
 * so the code is generated here and retried on the rare unique collision.
 */
export async function placeOrder(
  values: OrderFormValues,
): Promise<PlacedOrder> {
  if (!supabaseConfigured) {
    throw new Error("The app is not connected to the database yet.");
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateOrderCode();
    const { error } = await supabase.from("orders").insert({
      code,
      buyer_name: values.buyer_name,
      contact: values.contact,
      size: values.size,
      pattern: values.pattern,
      quantity: values.quantity,
      needed_by: values.needed_by,
      notes: values.notes === "" ? null : values.notes,
    });
    if (!error) return { ...values, code };
    if (error.code !== UNIQUE_VIOLATION) throw new Error(error.message);
  }
  throw new Error("Could not generate an order code. Please try again.");
}
