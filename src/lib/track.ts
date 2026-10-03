import { trackedOrderSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import type { TrackedOrder } from "@/types";

const CODE_PATTERN = /^HB-[A-HJ-NP-Z2-9]{4}$/;

/** "hb-k7p2", " K7P2 " or "hbk7p2" → "HB-K7P2". Returns null when it cannot be a valid code. */
export function normalizeCode(input: string): string | null {
  const raw = input.trim().toUpperCase().replace(/\s+/g, "");
  const body = raw.replace(/^HB-?/, "");
  const code = `HB-${body}`;
  return CODE_PATTERN.test(code) ? code : null;
}

/**
 * Buyer lookup through the SECURITY DEFINER function get_order(code).
 * Anon has no SELECT on the tables; the function returns one order without the contact number.
 */
export async function fetchTrackedOrder(
  code: string,
): Promise<TrackedOrder | null> {
  const { data, error } = await supabase.rpc("get_order", { p_code: code });
  if (error) throw new Error(error.message);
  if (data === null || data === undefined) return null;
  return trackedOrderSchema.parse(data);
}
