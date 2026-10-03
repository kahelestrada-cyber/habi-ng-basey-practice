import type { ReactNode } from "react";
import { CalendarClock, Phone, TriangleAlert } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, isOverdue, patternLabel, sizeLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderCardProps {
  order: Order;
  /** Slot for the officer's action (e.g. the "Move to Weaving" button). */
  action?: ReactNode;
}

export function OrderCard({ order, action }: OrderCardProps) {
  const overdue = isOverdue(order.needed_by, order.status);

  return (
    <Card className="py-0" data-testid="order-card" data-code={order.code}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-sm font-semibold tracking-wider text-primary">
              {order.code}
            </p>
            <p className="truncate font-medium">{order.buyer_name}</p>
          </div>
          <StatusBadge status={order.status} className="shrink-0" />
        </div>

        <p className="text-sm">
          <span className="font-semibold">
            {order.quantity} {order.quantity === 1 ? "pc" : "pcs"}
          </span>{" "}
          · {sizeLabel(order.size)} · {patternLabel(order.pattern)}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              overdue && "font-semibold text-destructive",
            )}
          >
            {overdue ? (
              <TriangleAlert className="size-4" aria-hidden="true" />
            ) : (
              <CalendarClock className="size-4" aria-hidden="true" />
            )}
            {overdue ? "Overdue · needed " : "Needed by "}
            {formatDate(order.needed_by)}
          </span>
          <a
            href={`tel:${order.contact}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring sm:min-h-0"
          >
            <Phone className="size-4" aria-hidden="true" />
            {order.contact}
          </a>
        </div>

        {order.notes && (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            “{order.notes}”
          </p>
        )}

        {action && <div className="pt-1">{action}</div>}
      </CardContent>
    </Card>
  );
}
