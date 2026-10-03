import { useWatch, type Control } from "react-hook-form";
import type { OrderFormValues } from "@/lib/orders";
import { SIZE_PRICE_PHP } from "@/types";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

/** Live estimate from the sample price guide: size price × quantity. Display only, not stored. */
export function PriceEstimate({
  control,
}: {
  control: Control<OrderFormValues>;
}) {
  const size = useWatch({ control, name: "size" });
  const quantity = useWatch({ control, name: "quantity" });

  const unit = size ? SIZE_PRICE_PHP[size] : undefined;
  const valid =
    unit !== undefined &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= 500;

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg border border-dashed bg-muted/60 px-4 py-3"
      aria-live="polite"
      data-testid="price-estimate"
    >
      <div>
        <p className="text-sm font-medium">Estimated total</p>
        <p className="text-xs text-muted-foreground">
          {valid
            ? `${quantity} × ${peso.format(unit)} · pay at pickup, the coop confirms the final price`
            : "Pick a size and quantity to see an estimate"}
        </p>
      </div>
      <p className="font-heading text-2xl font-semibold tabular-nums text-primary">
        {valid ? peso.format(unit * quantity) : "—"}
      </p>
    </div>
  );
}
