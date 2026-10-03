import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PatternSwatch } from "@/components/PatternSwatch";
import { TrackCodeInput } from "@/components/TrackCodeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PATTERNS } from "@/types";

const STEPS = [
  { n: "1", title: "Order", body: "Pick a size and pattern. Takes a minute." },
  { n: "2", title: "We weave", body: "The coop starts your banig by hand." },
  { n: "3", title: "Track", body: "Check progress any time with your code." },
];

export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 pt-4 sm:pt-10 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm font-medium text-primary">
            Basey, Samar · Banig Capital of the Philippines
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Order a handwoven banig straight from the weavers.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            The online order desk of the Basey weavers&apos; coop. Choose a size
            and pattern, tell us when you need it, and track your order with a
            short code. No account needed.
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
        </div>

        <Card className="overflow-hidden py-0">
          <div className="grid h-28 grid-cols-3" aria-hidden="true">
            <PatternSwatch pattern="diamond" />
            <PatternSwatch pattern="stripes" />
            <PatternSwatch pattern="bulaklak" />
          </div>
          <CardContent className="space-y-3 pb-6">
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

      <section aria-labelledby="how-heading" className="space-y-4">
        <h2 id="how-heading" className="font-heading text-2xl font-semibold">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-3 rounded-xl border bg-card p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-lg font-bold text-secondary-foreground">
                {s.n}
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="patterns-heading" className="space-y-4">
        <h2
          id="patterns-heading"
          className="font-heading text-2xl font-semibold"
        >
          Patterns the coop weaves
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PATTERNS.map((p) => (
            <Card key={p.value} className="overflow-hidden py-0">
              <PatternSwatch pattern={p.value} className="h-20" />
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
