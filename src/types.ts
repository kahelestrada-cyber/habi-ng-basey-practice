export const ORDER_STATUSES = [
  "received",
  "weaving",
  "ready",
  "picked_up",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Received",
  weaving: "Weaving",
  ready: "Ready",
  picked_up: "Picked up",
};

export const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  received: "weaving",
  weaving: "ready",
  ready: "picked_up",
  picked_up: null,
};

export const SIZES = [
  { value: "2x3", label: "2 × 3 ft", hint: "Placemat / small" },
  { value: "3x5", label: "3 × 5 ft", hint: "Single sleeping mat" },
  { value: "4x6", label: "4 × 6 ft", hint: "Double" },
  { value: "5x7", label: "5 × 7 ft", hint: "Family / display" },
] as const;
export type BanigSize = (typeof SIZES)[number]["value"];

/** Sample price guide in PHP per piece. Demo values; the coop confirms the final price. */
export const SIZE_PRICE_PHP: Record<BanigSize, number> = {
  "2x3": 250,
  "3x5": 600,
  "4x6": 1100,
  "5x7": 1800,
};

export const PATTERNS = [
  { value: "bulaklak", label: "Bulaklak", hint: "Floral" },
  { value: "diamond", label: "Diamond", hint: "Classic lattice" },
  { value: "stripes", label: "Stripes", hint: "Tricolor bands" },
  { value: "dahon", label: "Dahon", hint: "Leaf" },
  { value: "church", label: "Church motif", hint: "Basey church" },
  { value: "lettering", label: "Lettering", hint: "Name or word" },
] as const;
export type BanigPattern = (typeof PATTERNS)[number]["value"];

export interface Order {
  id: string;
  code: string;
  created_at: string;
  buyer_name: string;
  contact: string;
  size: BanigSize;
  pattern: BanigPattern;
  quantity: number;
  needed_by: string;
  notes: string | null;
  status: OrderStatus;
}

/** What the buyer sees via get_order(code): no contact number. */
export type PublicOrder = Omit<Order, "contact">;

export interface OrderEvent {
  id: string;
  order_id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface TrackedOrder {
  order: PublicOrder;
  events: OrderEvent[];
}
