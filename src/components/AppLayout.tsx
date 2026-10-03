import { Suspense, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ClipboardList, Home, Search, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/order", label: "Order", icon: ClipboardList },
  { to: "/track", label: "Track", icon: Search },
  { to: "/coop", label: "Coop", icon: ShieldCheck },
];

const TITLES: Record<string, string> = {
  "": "Habi ng Basey · Order a handwoven banig",
  order: "Order a banig · Habi ng Basey",
  track: "Track your order · Habi ng Basey",
  coop: "Coop board · Habi ng Basey",
};

function PageFallback() {
  return (
    <div
      className="mx-auto max-w-xl space-y-4"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function AppLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname.split("/")[1] ?? ""] ?? "Habi ng Basey";
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="banig-band h-2 w-full" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span
              className="banig-band inline-block size-6 rounded-sm"
              aria-hidden="true"
            />
            <span className="font-heading text-lg font-semibold tracking-tight">
              Habi ng Basey
            </span>
          </NavLink>
          <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                    isActive && "bg-secondary text-secondary-foreground",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:pb-10">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="hidden border-t py-6 text-center text-xs text-muted-foreground sm:block">
        Handwoven tikog banig from Basey, Samar · Salamat sa pagsuporta!
      </footer>

      {/* Mobile bottom nav — 44px+ touch targets */}
      <nav
        aria-label="Main mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background/95 backdrop-blur sm:hidden"
      >
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground",
                isActive && "text-primary",
              )
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  );
}
