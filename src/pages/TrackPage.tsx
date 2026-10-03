import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TrackPage() {
  const { code } = useParams<{ code: string }>();
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Track your order
        </h1>
        <p className="text-muted-foreground">
          Enter the code from your confirmation, like HB-K7P2.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {code ? `Order ${code.toUpperCase()}` : "Enter your code"}
          </CardTitle>
          <CardDescription>
            Coming in F3 — status stepper and timeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Placeholder.
        </CardContent>
      </Card>
    </div>
  );
}
