# DEMO — Habi ng Basey

Live: https://habi-ng-basey-practice.vercel.app · Officer login: your Supabase Auth account (never say the password aloud)

## 3-minute script

| Time                   | Say                                                                                                                                                                                                                                                                                           | Do                                                                                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:20 **Hook**     | "A weaver in Basey gets orders by Messenger, text and walk-in. They go in a notebook. A balikbayan flies home Friday, and nobody notices the mat is late."                                                                                                                                    | Show landing page                                                                                                                                                                      |
| 0:20–0:50 **Order**    | "A buyer orders in under a minute. No account."                                                                                                                                                                                                                                               | Tap **Order a banig** → 4 × 6 ft → Bulaklak → quantity 2 (estimate shows ₱2,200) → date next month → name `Maria Santos` → mobile `09171234567` → **Place order**. Read the code aloud |
| 0:50–1:20 **Coop**     | "The officer sees every order, soonest needed-by first. Overdue ones are flagged in red."                                                                                                                                                                                                     | Open **/coop** (already signed in on a second tab) → tap **Received** chip → find the new order → **Start weaving** → note `Loom 3, started today` → confirm                           |
| 1:20–1:50 **Track**    | "The buyer checks with the code. No login, and the phone number never leaves the coop."                                                                                                                                                                                                       | Back to first tab → **Track my order** → refresh → stepper shows Weaving + the note                                                                                                    |
| 1:50–2:30 **AI angle** | "Built in a 4-hour clock with Claude Code. I chose the idea and overruled its first auth design. Subagents reviewed the UI and halved the landing bundle. Playwright tested every flow at phone and desktop width. Every step is in AI_LOG.md. This practice build has no in-app AI by rule." | Show poster "Built with AI" block, then AI_LOG.md                                                                                                                                      |
| 2:30–3:00 **Impact**   | "Status texts become self-serve and overdue orders surface early. Any craft coop can reuse it by changing presets and one officer account."                                                                                                                                                   | Back to landing                                                                                                                                                                        |

## 5-minute additions

- **Officer side, slower (60 s):** show all five filter chips and counts, an overdue card, tap-to-call number, then advance one order to Ready with a pickup note.
- **Phone view (20 s):** open the live URL on a real phone, track `HB-K7P2` ("Ready for pickup!").
- **AI walkthrough (40 s):** poster timeline 0:10 spec → 1:33 live → 2:17 polish, and the "Human decisions" tile.

## Likely questions

1. **Data privacy (RA 10173)?** We collect only name, mobile and order details. Row Level Security blocks public reads; tracking returns the order without the contact number.
2. **Cost to run?** Supabase and Vercel free tiers cover a coop's volume. No paid APIs.
3. **How does it scale?** Sizes, patterns and prices are presets. A new coop needs its presets and one officer account. Multi-coop would add a coop column and policy.
4. **What did AI do vs you?** AI wrote the code, tests and reviews. I chose the problem, cut scope, picked the auth model, banned unverified claims and did the login myself.
5. **Offline or weak signal?** Landing is ~111 KB of script and inner pages load on demand. Orders need a connection; a failed submit shows an error and keeps the form filled.
6. **Why not Messenger or a Google Form?** Neither sorts by needed-by date, flags overdue orders, or gives the buyer self-serve status.

## Pre-demo checklist

- [ ] Open the live URL 2 minutes before; check `/track/HB-K7P2` loads (first request can take ~2 s)
- [ ] Sign in at `/coop` on a second tab ahead of time
- [ ] Seed orders present (15 cards); delete old test orders if cluttered
- [ ] Backup: screen recording in `video/`, local `npm run preview -- --host`, phone hotspot on
- [ ] No in-app AI in this build, so no fallback to test

## On stage

- [ ] HDMI/USB-C adapter in, display mirrored · browser zoom 110–125%
- [ ] Clean browser profile, Do Not Disturb on, chat apps closed
- [ ] Tabs in order: live app → coop board → poster → AI_LOG.md
