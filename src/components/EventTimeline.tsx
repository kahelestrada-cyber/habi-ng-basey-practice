import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { OrderEvent, OrderStatus } from "@/types";

interface TimelineEntry {
  key: string;
  status: OrderStatus;
  at: string;
  note: string | null;
}

interface EventTimelineProps {
  createdAt: string;
  events: OrderEvent[];
}

/** Newest first. The first "Received" entry comes from the order itself, not an event row. */
export function EventTimeline({ createdAt, events }: EventTimelineProps) {
  const entries: TimelineEntry[] = [
    ...events.map((e) => ({
      key: e.id,
      status: e.to_status,
      at: e.created_at,
      note: e.note,
    })),
    {
      key: "created",
      status: "received" as const,
      at: createdAt,
      note: "Order placed",
    },
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <ol className="space-y-0" aria-label="Order timeline">
      {entries.map((entry, i) => (
        <li
          key={entry.key}
          className="relative flex gap-3 pb-5 last:pb-0"
          data-testid="timeline-entry"
        >
          {i < entries.length - 1 && (
            <span
              className="absolute left-[5px] top-4 h-full w-0.5 bg-border"
              aria-hidden="true"
            />
          )}
          <span
            className="relative z-10 mt-1.5 size-3 shrink-0 rounded-full border-2 border-primary bg-card"
            aria-hidden="true"
          />
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={entry.status} />
              <time
                dateTime={entry.at}
                className="text-xs text-muted-foreground"
              >
                {formatDateTime(entry.at)}
              </time>
            </div>
            {entry.note && <p className="text-sm">{entry.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
