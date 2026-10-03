import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES, STATUS_LABEL, type OrderStatus } from "@/types";

const KNOT_COLOR: Record<OrderStatus, string> = {
  received: "bg-status-received border-status-received",
  weaving: "bg-status-weaving border-status-weaving",
  ready: "bg-status-ready border-status-ready",
  picked_up: "bg-status-picked border-status-picked",
};

/** The order's journey drawn as a thread with a knot per status. */
export function OrderStepper({ status }: { status: OrderStatus }) {
  const current = ORDER_STATUSES.indexOf(status);

  return (
    <ol className="grid grid-cols-4" aria-label="Order progress">
      {ORDER_STATUSES.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const reached = done || active;
        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            {/* thread segment to the previous knot */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-1/2 top-4 h-1 w-full -translate-y-1/2 rounded-full",
                  reached ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-8 items-center justify-center rounded-full border-2 text-white transition-colors duration-300",
                reached ? KNOT_COLOR[step] : "border-border bg-card",
                active && "ring-4 ring-primary/20",
              )}
            >
              {done && <Check className="size-4" aria-hidden="true" />}
              {active && (
                <span
                  className="size-2.5 rounded-full bg-white"
                  aria-hidden="true"
                />
              )}
            </span>
            <span
              className={cn(
                "text-xs sm:text-sm",
                active
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {STATUS_LABEL[step]}
              <span className="sr-only">
                {done ? " (done)" : active ? " (current)" : " (not yet)"}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
