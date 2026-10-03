import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeCode } from "@/lib/track";

interface TrackCodeInputProps {
  /** Unique id prefix so the input can appear on more than one page. */
  id?: string;
  label?: string;
}

export function TrackCodeInput({
  id = "track-code",
  label = "Order code",
}: TrackCodeInputProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = normalizeCode(value);
    if (!code) {
      setError(
        "Codes look like HB-K7P2. Check your confirmation and try again.",
      );
      return;
    }
    setError(null);
    setValue("");
    void navigate(`/track/${code}`);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="HB-K7P2"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={9}
          className="h-11 font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Button type="submit" className="h-11 shrink-0">
          <Search aria-hidden="true" /> Track
        </Button>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </form>
  );
}
