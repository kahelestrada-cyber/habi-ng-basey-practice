import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RefreshCw, SearchX } from "lucide-react";
import { toast } from "sonner";
import { EventTimeline } from "@/components/EventTimeline";
import { OrderStepper } from "@/components/OrderStepper";
import { TrackCodeInput } from "@/components/TrackCodeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, patternLabel, sizeLabel } from "@/lib/format";
import { fetchTrackedOrder, normalizeCode } from "@/lib/track";
import { cn } from "@/lib/utils";
import type { OrderStatus, TrackedOrder } from "@/types";

const HEADLINE: Record<OrderStatus, string> = {
  received: "We have your order. A weaver will start soon.",
  weaving: "Your banig is on the loom.",
  ready: "Ready for pickup!",
  picked_up: "Picked up. Salamat sa pagsuporta!",
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "missing" }
  | { kind: "found"; data: TrackedOrder };

function TrackedOrderView({ code }: { code: string }) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchTrackedOrder(code);
      setState(data ? { kind: "found", data } : { kind: "missing" });
    } catch (err) {
      setState((prev) => (prev.kind === "found" ? prev : { kind: "error" }));
      toast.error("Could not load your order", {
        description:
          err instanceof Error
            ? err.message
            : "Check your connection and try again.",
      });
    } finally {
      setRefreshing(false);
    }
  }, [code]);

  useEffect(() => {
    setState({ kind: "loading" });
    void load();
  }, [load]);

  if (state.kind === "loading") {
    return (
      <div
        className="space-y-4"
        aria-busy="true"
        aria-label="Loading your order"
      >
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="font-heading text-xl font-semibold">
            Your order did not load
          </p>
          <p className="text-sm text-muted-foreground">
            The connection may have dropped. Your order is safe.
          </p>
          <Button onClick={() => void load()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (state.kind === "missing") {
    return (
      <Card>
        <CardContent className="space-y-4 py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <SearchX
              className="size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="font-heading text-xl font-semibold">
              No order with code {code}
            </p>
            <p className="text-sm text-muted-foreground">
              Check the code on your confirmation and try again.
            </p>
          </div>
          <TrackCodeInput id="track-retry" label="Try another code" />
          <Button asChild variant="outline" className="min-h-11 w-full">
            <Link to="/order">Order a banig instead</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { order, events } = state.data;
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="font-mono text-sm font-semibold tracking-wider text-primary"
                data-testid="track-code"
              >
                {order.code}
              </p>
              <p
                className="font-heading text-2xl font-semibold leading-snug"
                data-testid="track-headline"
              >
                {HEADLINE[order.status]}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="size-11 shrink-0"
              onClick={() => void load()}
              disabled={refreshing}
              aria-label="Refresh status"
            >
              <RefreshCw
                className={cn(refreshing && "animate-spin")}
                aria-hidden="true"
              />
            </Button>
          </div>
          <OrderStepper status={order.status} />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 text-sm">
            <div>
              <dt className="text-muted-foreground">For</dt>
              <dd className="font-medium">{order.buyer_name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Needed by</dt>
              <dd className="font-medium">{formatDate(order.needed_by)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Banig</dt>
              <dd className="font-medium">
                {order.quantity} × {sizeLabel(order.size)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pattern</dt>
              <dd className="font-medium">{patternLabel(order.pattern)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <EventTimeline createdAt={order.created_at} events={events} />
        </CardContent>
      </Card>
    </div>
  );
}

export function TrackPage() {
  const { code: rawCode } = useParams<{ code: string }>();
  const code = rawCode ? normalizeCode(rawCode) : null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Track your order
        </h1>
        <p className="text-muted-foreground">
          No login needed. Your order code is all you need.
        </p>
      </div>

      {code ? (
        <TrackedOrderView key={code} code={code} />
      ) : (
        <Card>
          <CardContent className="space-y-3">
            {rawCode && (
              <p role="alert" className="text-sm font-medium text-destructive">
                “{rawCode}” is not a valid order code.
              </p>
            )}
            <TrackCodeInput />
            <p className="text-xs text-muted-foreground">
              You got this code right after placing your order.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
