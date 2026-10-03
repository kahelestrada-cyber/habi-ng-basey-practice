import { z } from "zod";
import { orderRowSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { NEXT_STATUS, type Order } from "@/types";

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

/**
 * Moves an order one step forward and records the event.
 * The `.eq("status", ...)` guard stops a double-tap or a second device from skipping a step.
 */
export async function advanceOrder(order: Order, note: string): Promise<Order> {
  const next = NEXT_STATUS[order.status];
  if (!next) throw new Error("This order is already picked up.");

  const { data, error } = await supabase
    .from("orders")
    .update({ status: next })
    .eq("id", order.id)
    .eq("status", order.status)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error("This order was already updated. Refresh the board.");
  }

  const trimmed = note.trim();
  const { error: eventError } = await supabase.from("order_events").insert({
    order_id: order.id,
    from_status: order.status,
    to_status: next,
    note: trimmed === "" ? null : trimmed,
  });
  if (eventError) {
    throw new Error(
      `Status changed, but the timeline entry was not saved: ${eventError.message}`,
    );
  }

  return { ...order, status: next };
}
