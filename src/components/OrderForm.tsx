import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ChipGroup, FieldError, chipClass } from "@/components/FormBits";
import { PriceEstimate } from "@/components/PriceEstimate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  orderSchema,
  placeOrder,
  todayISO,
  type OrderFormValues,
  type PlacedOrder,
} from "@/lib/orders";
import { PATTERNS, SIZES } from "@/types";

interface OrderFormProps {
  onPlaced: (order: PlacedOrder) => void;
}

export function OrderForm({ onPlaced }: OrderFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      buyer_name: "",
      contact: "",
      needed_by: "",
      notes: "",
    },
  });

  const onSubmit = async (values: OrderFormValues) => {
    try {
      onPlaced(await placeOrder(values));
    } catch (err) {
      toast.error("Hindi naipadala ang order", {
        description:
          err instanceof Error
            ? err.message
            : "Please check your connection and try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <ChipGroup
        legend="Size"
        wide
        error={errors.size?.message}
        errorId="size-error"
      >
        {SIZES.map((s) => (
          <label key={s.value} className="relative">
            <input
              type="radio"
              value={s.value}
              className="peer sr-only"
              {...register("size")}
            />
            <span className={chipClass}>
              <span className="font-medium">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.hint}</span>
            </span>
          </label>
        ))}
      </ChipGroup>

      <ChipGroup
        legend="Pattern"
        error={errors.pattern?.message}
        errorId="pattern-error"
      >
        {PATTERNS.map((p) => (
          <label key={p.value} className="relative">
            <input
              type="radio"
              value={p.value}
              className="peer sr-only"
              {...register("pattern")}
            />
            <span className={chipClass}>
              <span className="font-medium">{p.label}</span>
              <span className="text-xs text-muted-foreground">{p.hint}</span>
            </span>
          </label>
        ))}
      </ChipGroup>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={500}
            className="h-11 placeholder:text-muted-foreground/60"
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? "quantity-error" : undefined}
            {...register("quantity", { valueAsNumber: true })}
          />
          <FieldError id="quantity-error" message={errors.quantity?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="needed_by">Needed by</Label>
          <Input
            id="needed_by"
            type="date"
            min={todayISO()}
            className="h-11 placeholder:text-muted-foreground/60"
            aria-invalid={Boolean(errors.needed_by)}
            aria-describedby={errors.needed_by ? "needed_by-error" : undefined}
            {...register("needed_by")}
          />
          <FieldError
            id="needed_by-error"
            message={errors.needed_by?.message}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="buyer_name">Your name</Label>
          <Input
            id="buyer_name"
            autoComplete="name"
            placeholder="Juana Dela Cruz"
            className="h-11 placeholder:text-muted-foreground/60"
            aria-invalid={Boolean(errors.buyer_name)}
            aria-describedby={
              errors.buyer_name ? "buyer_name-error" : undefined
            }
            {...register("buyer_name")}
          />
          <FieldError
            id="buyer_name-error"
            message={errors.buyer_name?.message}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Mobile number</Label>
          <Input
            id="contact"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="09171234567"
            className="h-11 placeholder:text-muted-foreground/60"
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "contact-error" : "contact-hint"}
            {...register("contact")}
          />
          {errors.contact ? (
            <FieldError id="contact-error" message={errors.contact.message} />
          ) : (
            <p id="contact-hint" className="text-xs text-muted-foreground">
              Only the coop sees this. We text you when it is ready.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          rows={3}
          className="placeholder:text-muted-foreground/60"
          placeholder="Colors you like, a name to weave in, pickup details…"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          {...register("notes")}
        />
        <FieldError id="notes-error" message={errors.notes?.message} />
      </div>

      <PriceEstimate control={control} />

      <Button
        type="submit"
        size="lg"
        className="min-h-12 w-full text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" /> Sending
            order…
          </>
        ) : (
          "Place order"
        )}
      </Button>
    </form>
  );
}
