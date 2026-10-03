import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { BanigPattern } from "@/types";

const M = "var(--banig-magenta)";
const G = "var(--banig-green)";
const Y = "var(--banig-yellow)";
const CREAM = "#fdf3e3";

/** CSS-only motifs so each pattern reads differently without image files. */
const SWATCH: Record<BanigPattern, CSSProperties> = {
  stripes: {
    background: `repeating-linear-gradient(90deg, ${M} 0 14px, ${Y} 14px 20px, ${G} 20px 34px, ${Y} 34px 40px)`,
  },
  diamond: {
    backgroundColor: Y,
    backgroundImage: `linear-gradient(135deg, ${M} 25%, transparent 25%), linear-gradient(225deg, ${M} 25%, transparent 25%), linear-gradient(315deg, ${M} 25%, transparent 25%), linear-gradient(45deg, ${M} 25%, transparent 25%)`,
    backgroundSize: "28px 28px",
    backgroundPosition: "-14px 0, -14px 0, 0 0, 0 0",
  },
  bulaklak: {
    backgroundColor: CREAM,
    backgroundImage: `radial-gradient(circle at 50% 50%, ${Y} 0 4px, transparent 5px), radial-gradient(circle at 50% 22%, ${M} 0 6px, transparent 7px), radial-gradient(circle at 50% 78%, ${M} 0 6px, transparent 7px), radial-gradient(circle at 22% 50%, ${M} 0 6px, transparent 7px), radial-gradient(circle at 78% 50%, ${M} 0 6px, transparent 7px)`,
    backgroundSize: "40px 40px",
  },
  dahon: {
    backgroundColor: "#e9f5ea",
    backgroundImage: `repeating-linear-gradient(60deg, ${G} 0 5px, transparent 5px 16px), repeating-linear-gradient(-60deg, ${G} 0 5px, transparent 5px 16px)`,
  },
  church: {
    backgroundColor: CREAM,
    backgroundImage: `radial-gradient(circle at 50% 100%, ${CREAM} 0 9px, ${M} 9px 14px, transparent 15px), linear-gradient(${Y} 0 4px, transparent 4px)`,
    backgroundSize: "36px 26px, 36px 26px",
  },
  lettering: {
    background: `repeating-linear-gradient(90deg, ${CREAM} 0 10px, #f6e3c5 10px 12px)`,
  },
};

export function PatternSwatch({
  pattern,
  className,
}: {
  pattern: BanigPattern;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={SWATCH[pattern]}
      aria-hidden="true"
      data-pattern={pattern}
    >
      {pattern === "lettering" && (
        <span className="font-heading text-2xl font-bold tracking-[0.3em] text-primary">
          HABI
        </span>
      )}
    </div>
  );
}
