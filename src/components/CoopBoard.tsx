import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { Inbox, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { OrderCard } from "@/components/OrderCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOrders } from "@/lib/coop";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUSES,
  STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "@/types";

type Filter = OrderStatus | "all";

interface CoopBoardProps {
  /** Renders the officer's action for a card; `onChanged` swaps the updated order into the board. */
  renderAction?: (
    order: Order,
    onChanged: (updated: Order) => void,
  ) => ReactNode;
}

export function CoopBoard({ renderAction }: CoopBoardProps) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setOrders(await fetchOrders());
    } catch (err) {
      setFailed(true);
      toast.error("Could not load orders", {
        description:
          err instanceof Error
            ? err.message
            : "Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: 0,
      received: 0,
      weaving: 0,
      ready: 0,
      picked_up: 0,
    };
    for (const o of orders ?? []) {
      base.all += 1;
      base[o.status] += 1;
    }
    return base;
  }, [orders]);

  // Already sorted by needed-by from the query. In "All", finished orders sink to the bottom.
  const visible = useMemo(() => {
    const list = orders ?? [];
    if (filter !== "all") return list.filter((o) => o.status === filter);
    return [
      ...list.filter((o) => o.status !== "picked_up"),
      ...list.filter((o) => o.status === "picked_up"),
    ];
  }, [orders, filter]);

  const replaceOrder = (updated: Order) =>
    setOrders(
      (prev) => prev?.map((o) => (o.id === updated.id ? updated : o)) ?? prev,
    );

  const filters: Filter[] = ["all", ...ORDER_STATUSES];

  return (
    <section aria-label="Orders" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter by status"
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                filter === f &&
                  "border-primary bg-secondary text-secondary-foreground",
              )}
            >
              {f === "all" ? "All" : STATUS_LABEL[f]}
              <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="size-11 shrink-0"
          onClick={() => void load()}
          disabled={loading}
          aria-label="Refresh orders"
        >
          <RefreshCw
            className={cn(loading && "animate-spin")}
            aria-hidden="true"
          />
        </Button>
      </div>

      {loading && !orders ? (
        <div
          className="grid gap-3 md:grid-cols-2"
          aria-busy="true"
          aria-label="Loading orders"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : failed && !orders ? (
        <EmptyState
          title="Orders did not load"
          body="The connection may have dropped. Your data is safe."
        >
          <Button onClick={() => void load()}>Try again</Button>
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState
          title={
            filter === "all"
              ? "No orders yet"
              : `Nothing in ${STATUS_LABEL[filter as OrderStatus]}`
          }
          body={
            filter === "all"
              ? "New orders from buyers will show up here."
              : "Orders move here as you update them."
          }
        >
          {filter === "all" ? (
            <Button asChild>
              <Link to="/order">Place a test order</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setFilter("all")}>
              Show all orders
            </Button>
          )}
        </EmptyState>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              action={renderAction?.(order, replaceOrder)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      <Inbox className="size-10 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="font-heading text-xl font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      {children}
    </div>
  );
}
