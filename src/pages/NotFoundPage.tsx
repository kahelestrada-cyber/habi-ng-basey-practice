import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md space-y-5 py-12 text-center">
      <div
        className="banig-band mx-auto h-3 w-24 rounded-full"
        aria-hidden="true"
      />
      <h1 className="font-heading text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">
        Waray ini nga pahina. The page you were looking for does not exist.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="min-h-11">
          <Link to="/">Back to home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="min-h-11">
          <Link to="/track">Track my order</Link>
        </Button>
      </div>
    </div>
  );
}
