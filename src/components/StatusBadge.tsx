import { cn } from "@/lib/utils";
import { STATUS_LABEL, type OrderStatus } from "@/types";

const STATUS_CLASS: Record<OrderStatus, string> = {
  received:
    "border-status-received/30 bg-status-received/10 text-status-received",
  weaving: "border-status-weaving/30 bg-status-weaving/10 text-status-weaving",
  ready: "border-status-ready/30 bg-status-ready/10 text-status-ready",
  picked_up: "border-status-picked/30 bg-status-picked/10 text-status-picked",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STATUS_CLASS[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
