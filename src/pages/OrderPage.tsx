import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OrderPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Order a banig
        </h1>
        <p className="text-muted-foreground">
          Takes about a minute. You get an order code at the end.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order form</CardTitle>
          <CardDescription>
            Coming in F1 — size, pattern, quantity, name, mobile, needed-by
            date.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder.
        </CardContent>
      </Card>
    </div>
  );
}
