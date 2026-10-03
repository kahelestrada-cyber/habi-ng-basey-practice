import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { OrderForm } from "@/components/OrderForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PlacedOrder } from "@/lib/orders";
import { PATTERNS, SIZES } from "@/types";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

function OrderConfirmation({
  order,
  onReset,
}: {
  order: PlacedOrder;
  onReset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, []);

  const size = SIZES.find((s) => s.value === order.size)?.label ?? order.size;
  const pattern =
    PATTERNS.find((p) => p.value === order.pattern)?.label ?? order.pattern;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(order.code);
      toast.success("Order code copied");
    } catch {
      toast.error("Could not copy. Please write the code down.");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <CheckCircle2
          className="size-10 text-status-ready"
          aria-hidden="true"
        />
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-heading text-3xl font-bold tracking-tight outline-none"
        >
          Salamat, {order.buyer_name.split(" ")[0]}! Order received.
        </h1>
        <p className="text-muted-foreground">
          Keep this code. It is the only thing you need to check your order.
        </p>
      </div>

      <Card className="overflow-hidden py-0">
        <div className="banig-band h-2" aria-hidden="true" />
        <CardContent className="space-y-5 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Your order code</p>
              <p
                className="font-mono text-4xl font-bold tracking-wider text-primary"
                data-testid="order-code"
              >
                {order.code}
              </p>
            </div>
            <Button variant="outline" className="min-h-11" onClick={copyCode}>
              <Copy aria-hidden="true" /> Copy
            </Button>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Size</dt>
              <dd className="font-medium">{size}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pattern</dt>
              <dd className="font-medium">{pattern}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Quantity</dt>
              <dd className="font-medium">{order.quantity}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Needed by</dt>
              <dd className="font-medium">{formatDate(order.needed_by)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="min-h-11">
          <Link to={`/track/${order.code}`}>
            Track my order <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="min-h-11"
          onClick={onReset}
        >
          Place another order
        </Button>
      </div>
    </div>
  );
}

export function OrderPage() {
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  if (placed)
    return <OrderConfirmation order={placed} onReset={() => setPlaced(null)} />;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Order a banig
        </h1>
        <p className="text-muted-foreground">
          Takes about a minute. No account needed. You get an order code at the
          end.
        </p>
      </div>
      <Card>
        <CardContent>
          <OrderForm onPlaced={setPlaced} />
        </CardContent>
      </Card>
    </div>
  );
}
