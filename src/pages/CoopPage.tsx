import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { CoopBoard } from "@/components/CoopBoard";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { signOutOfficer, useSession } from "@/lib/auth";

export function CoopPage() {
  const { session, loading } = useSession();

  const signOut = async () => {
    try {
      await signOutOfficer();
      toast.success("Signed out");
    } catch (err) {
      toast.error("Could not sign out", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Coop board
          </h1>
          <p className="text-muted-foreground">
            {session
              ? "All orders, soonest needed-by first."
              : "For the order officer. Sign in to see and update orders."}
          </p>
        </div>
        {session && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <Button
              variant="outline"
              className="min-h-11"
              onClick={() => void signOut()}
            >
              <LogOut aria-hidden="true" /> Sign out
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <Skeleton className="mx-auto h-72 max-w-md rounded-xl" />
      ) : session ? (
        <CoopBoard />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
