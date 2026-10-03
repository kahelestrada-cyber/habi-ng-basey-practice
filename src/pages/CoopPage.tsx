import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CoopPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Coop board
        </h1>
        <p className="text-muted-foreground">
          For the order officer. Sign in to see and update orders.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Officer sign-in</CardTitle>
          <CardDescription>
            Coming in F2 — email + password login, then the order board.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder.
        </CardContent>
      </Card>
    </div>
  );
}
