import { z } from "zod";
import { orderRowSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types";

const ORDER_COLUMNS =
  "id, code, created_at, buyer_name, contact, size, pattern, quantity, needed_by, notes, status";

/** All orders, soonest needed-by first. Requires the officer session (RLS: authenticated SELECT). */
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("needed_by", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return z.array(orderRowSchema).parse(data);
}
