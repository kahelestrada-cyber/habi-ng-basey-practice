# SPEC — Habi ng Basey
> One-line pitch: Buyers can place a custom banig order in under a minute and track it with a short code, so the Basey weavers' coop fills orders without lost texts and missed needed-by dates.

## Problem
- User: Order officer of a banig weavers' cooperative in Basey, Samar (association name UNVERIFIED — do not name it in UI copy; say "the weavers' coop") + buyers: tourists, balikbayan, Tacloban souvenir shops
- Pain today: orders arrive by FB Messenger, text and walk-in and go into a notebook; buyers text "ready na?" several times a day; balikbayan needed-by dates get missed because nothing is sorted by date
- Local stat: Basey is tagged the "Banig Capital of the Philippines"; the ~1,000-households figure is UNVERIFIED — poster/Q&A only if sourced, never in UI copy

## Core loop (3 features — nothing else until these work live)
- [x] F1 Place Order — `/order`: size (preset chips 2×3 / 3×5 / 4×6 / 5×7 ft), pattern (preset chips), quantity, name, PH mobile number, needed-by date, optional notes (colors go here); no login. **Done when:** submit → confirmation shows order code `HB-XXXX` within 3 s and the "Track" link opens `/track/HB-XXXX`
- [x] F2 Coop Board — `/coop` (officer login, Supabase Auth email + password): all orders as cards, sorted by needed-by soonest, filter chips Received / Weaving / Ready / Picked up. **Done when:** the F1 order appears under Received with the right size, pattern and date
- [x] F3 Status Update + Buyer Tracking — officer taps the next-step button (Received → Weaving → Ready → Picked up, optional note); buyer opens `/track/HB-XXXX` and sees a 4-step stepper + timeline. **Done when:** judge refreshes the track page after the officer's tap and sees the new step and note, no login

## Pages / routes
| Route | Purpose | Main components |
|---|---|---|
| `/` | Landing: what the coop makes, "Order a banig" CTA, "Track my order" code input | `Hero`, `PatternGallery` (4 preset patterns, CSS-drawn), `TrackCodeInput` |
| `/order` | Order form → confirmation | `OrderForm` (RHF + Zod), `SizeChips`, `PatternChips`, `OrderConfirmation` |
| `/track/:code` | Buyer status page | `OrderStepper`, `OrderSummary`, `EventTimeline`, not-found state |
| `/coop` | Officer login → board | `LoginForm` (RHF + Zod, email + password), `StatusFilterChips`, `OrderCard`, `AdvanceStatusDialog`, sign-out |

## Data model (Supabase, RLS on)
| Table | Columns | RLS policy |
|---|---|---|
| `orders` | id uuid pk, code text unique (`HB-` + 4 chars, no 0/O/1/I), created_at, buyer_name text, contact text, size text, pattern text, quantity int, needed_by date, notes text, status text default 'received' | anon: INSERT only (status forced 'received' by default + check). authenticated: SELECT + UPDATE. No anon SELECT (hides contact numbers). Buyer reads via `get_order(code)` — SECURITY DEFINER function, returns that one order without contact + its events as JSON; granted to anon |
| `order_events` | id uuid pk, order_id fk, from_status text, to_status text, note text, created_at | authenticated: INSERT + SELECT. anon: none (read only through `get_order`) |

Auth: Supabase Auth, one officer email + password account created in the dashboard (no sign-up UI). No Vercel functions, no service role key in the app · Seed: 12 orders — balikbayan from Daly City 4×6 bulaklak for a wedding (Ready); Tacloban souvenir shop 20× 2×3 stripes (Weaving); Cebu tourist 3×5 diamond (Received); Tacloban hotel 10× 3×5 dahon (Weaving); Manila café 2× 5×7 lettering "Kape" (Received); Basey resident for Sept 29 fiesta (Picked up); Catbalogan school 15× 2×3 (Ready); Samar tourism office exhibit 5×7 church motif (Weaving); Guiuan resort 8× 4×6 (Received); Ormoc balikbayan 3×5 (Picked up); Palo parish 4×6 (Ready); Calbayog shop 12× 2×3 (Received); 2 overdue needed-by dates to show the sort

## Design brief
Accent `--primary` Basey banig magenta `#9D174D` · Inter (UI) + Fraunces (headings) · warm civic-tech, cream neutrals, card-based, generous whitespace · heritage touch: woven tricolor stripe (magenta / green / yellow) as header band via CSS gradients; order stepper drawn as a thread with knots per status. Generate MASTER.md with ui-ux-pro-max at scaffold and map onto `src/index.css`

## Stretch (only after F1–F3 are live)
- [ ] S1 Price estimate shown on the form (size × quantity table)
- [ ] S2 Officer uploads a photo of the finished banig at Ready (Supabase Storage), shown on track page
- [ ] S3 SMS "Ready for pickup" via Semaphore when status → Ready

## Impact (for poster + Q&A)
- Time/cost saved: ~30 status texts/day answered by the officer → self-serve tracking; needed-by sorting cuts missed balikbayan pickups (assume 2–3/month) · Scale: same app for any craft coop in Region VIII (Tanauan pottery, Samar abaca) by changing presets + officer account
