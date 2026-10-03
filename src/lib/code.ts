const CODE_PATTERN = /^HB-[A-HJ-NP-Z2-9]{4}$/;

/** "hb-k7p2", " K7P2 " or "hbk7p2" → "HB-K7P2". Returns null when it cannot be a valid code. */
export function normalizeCode(input: string): string | null {
  const raw = input.trim().toUpperCase().replace(/\s+/g, "");
  const body = raw.replace(/^HB-?/, "");
  const code = `HB-${body}`;
  return CODE_PATTERN.test(code) ? code : null;
}
