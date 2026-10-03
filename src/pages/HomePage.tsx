import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrackCodeInput } from "@/components/TrackCodeInput";
import { PATTERNS } from "@/types";

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 pt-4 sm:pt-10">
        <p className="text-sm font-medium text-primary">
          Basey, Samar · Banig Capital of the Philippines
        </p>
        <h1 className="font-heading max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Order a handwoven banig straight from the weavers.
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Pick a size and pattern, tell us when you need it, and track your
          order with a short code. No account needed.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-h-11">
            <Link to="/order">
              Order a banig <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-11">
            <Link to="/track">Track my order</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="track-heading">
        <Card className="max-w-xl">
          <CardContent className="space-y-3">
            <h2
              id="track-heading"
              className="font-heading text-xl font-semibold"
            >
              Already ordered?
            </h2>
            <TrackCodeInput
              id="home-track-code"
              label="Enter your order code"
            />
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="patterns-heading" className="space-y-4">
        <h2
          id="patterns-heading"
          className="font-heading text-2xl font-semibold"
        >
          Patterns the coop weaves
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PATTERNS.slice(0, 4).map((p) => (
            <Card key={p.value} className="overflow-hidden py-0">
              <div className="banig-band h-20" aria-hidden="true" />
              <CardContent className="py-3">
                <p className="font-medium">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
