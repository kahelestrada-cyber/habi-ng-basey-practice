import type { ReactNode } from "react";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

interface ChipGroupProps {
  legend: string;
  error?: string;
  errorId: string;
  /** Four columns on wider screens instead of three. */
  wide?: boolean;
  children: ReactNode;
}

export function ChipGroup({
  legend,
  error,
  errorId,
  wide,
  children,
}: ChipGroupProps) {
  return (
    <fieldset
      className="space-y-2"
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div
        className={`grid grid-cols-2 gap-2 ${wide ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}
      >
        {children}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

/** Styles the visible part of a radio chip; pair with an `sr-only peer` input. */
export const chipClass =
  "flex min-h-14 cursor-pointer flex-col justify-center rounded-lg border bg-card px-3 py-2 text-sm transition-colors " +
  "hover:border-primary/60 peer-checked:border-primary peer-checked:bg-secondary peer-checked:text-secondary-foreground " +
  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2";
