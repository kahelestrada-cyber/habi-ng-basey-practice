import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { advanceOrder } from "@/lib/coop";
import {
  NEXT_STATUS,
  STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "@/types";

const ACTION_LABEL: Record<OrderStatus, string> = {
  received: "Start weaving",
  weaving: "Mark as ready",
  ready: "Mark as picked up",
  picked_up: "",
};

const NOTE_MAX = 300;

interface AdvanceStatusDialogProps {
  order: Order;
  onChanged: (updated: Order) => void;
}

export function AdvanceStatusDialog({
  order,
  onChanged,
}: AdvanceStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const next = NEXT_STATUS[order.status];

  if (!next) {
    return <p className="text-sm text-muted-foreground">Completed. Salamat!</p>;
  }

  const confirm = async () => {
    setSaving(true);
    try {
      const updated = await advanceOrder(order, note);
      onChanged(updated);
      toast.success(`${order.code} is now ${STATUS_LABEL[next]}`);
      setOpen(false);
      setNote("");
    } catch (err) {
      toast.error("Could not update the order", {
        description:
          err instanceof Error
            ? err.message
            : "Check your connection and try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const noteId = `note-${order.id}`;

  return (
    <Dialog open={open} onOpenChange={(o) => !saving && setOpen(o)}>
      <DialogTrigger asChild>
        <Button className="min-h-11 w-full sm:w-auto">
          {ACTION_LABEL[order.status]} <ArrowRight aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Move {order.code} to {STATUS_LABEL[next]}?
          </DialogTitle>
          <DialogDescription>
            {order.buyer_name} will see this on their tracking page right away.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor={noteId}>
            Note for the buyer{" "}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Textarea
            id={noteId}
            rows={3}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Ready at the coop store, open 8am to 5pm"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="min-h-11"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="min-h-11"
            onClick={() => void confirm()}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" /> Saving…
              </>
            ) : (
              `Yes, ${ACTION_LABEL[order.status].toLowerCase()}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
