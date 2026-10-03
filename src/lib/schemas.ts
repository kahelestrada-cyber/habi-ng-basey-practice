import { z } from "zod";
import { ORDER_STATUSES } from "@/types";

const statusSchema = z.enum(ORDER_STATUSES);

/** Row shapes coming back from Supabase, validated before the UI trusts them. */
export const orderRowSchema = z.object({
  id: z.string(),
  code: z.string(),
  created_at: z.string(),
  buyer_name: z.string(),
  contact: z.string(),
  size: z.enum(["2x3", "3x5", "4x6", "5x7"]),
  pattern: z.enum([
    "bulaklak",
    "diamond",
    "stripes",
    "dahon",
    "church",
    "lettering",
  ]),
  quantity: z.number(),
  needed_by: z.string(),
  notes: z.string().nullable(),
  status: statusSchema,
});

export const eventRowSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  from_status: statusSchema.nullable(),
  to_status: statusSchema,
  note: z.string().nullable(),
  created_at: z.string(),
});

/** get_order(code) payload: the order without the contact number, plus events. */
export const trackedOrderSchema = z.object({
  order: orderRowSchema.omit({ contact: true }),
  events: z.array(eventRowSchema),
});
