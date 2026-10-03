import { trackedOrderSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import type { TrackedOrder } from "@/types";

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
