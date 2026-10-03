# AI_LOG — how AI built this app
> Feeds the poster and the "Effective use of AI" score (20%). One row per meaningful AI action. `/ailog <tool> - <what>` adds a row.

**Project:** Habi ng Basey · **Event:** rSCENE 2026 AI Vibe Coding Challenge · **Live URL:** https://habi-ng-basey-practice.vercel.app · **Repo:** https://github.com/kahelestrada-cyber/habi-ng-basey-practice

## Tool roster (fill before the event)
| Tool | Role | Why this tool |
|---|---|---|
| Claude Code (Opus/Sonnet) | Agentic coder: scaffold, features, fixes, deploy | Works on real files, runs commands |
| Claude subagents (ui-reviewer, bug-fixer, perf-auditor) | Automated QA / debugging / perf | Parallel, isolated context |
| Playwright MCP | Browser testing + screenshots | Verifies features like a user would |
| Context7 MCP | Up-to-date library docs | Prevents outdated/hallucinated APIs |
| Supabase MCP (optional) | Schema, RLS, SQL | DB work without leaving the editor |
| ui-ux-pro-max skill | Design system: palette, fonts, UX rules, accessibility checklist | Data-backed design choices instead of guesses |
| Claude.ai (Projects/Design) | Spec critique, poster, copy | Planning + visual output |
| <image generator> | Hero image / illustration | |
| <LLM API in app> | In-app AI feature | |

## Timeline
| Time | Phase | Tool | What it did | Outcome / evidence |
|---|---|---|---|---|
| 00:10 | Spec | Claude Code (/spec) | Drafted + critiqued SPEC.md | Habi ng Basey (replaces Pamana): banig order → coop board → status + code tracking; no in-app AI (practice rule); cut RPC for a public view, merged colors into notes |
| 00:24 | Scaffold | Claude Code (/scaffold) + Context7 + ui-ux-pro-max | Project setup, design system, schema, routes | Vite+TS+Tailwind v4+shadcn (14 components) shell builds clean; design-system/habi-ng-basey/MASTER.md generated (brief overrode its orange/Amatic SC with magenta/Inter+Fraunces); supabase/schema.sql with RLS + get_order() + 12 seed orders; 4 routes + 404; worked around npm 11 allow-scripts guard for shadcn CLI |
| 01:33 | Deploy | Claude Code (/deploy) + Vercel Git integration | Deployed https://habi-ng-basey-practice.vercel.app (auto-deploy on push to main) | Shell live: / returns 200, deep route /track/HB-K7P2 returns 200 (SPA rewrite works), title correct |
| 01:36 | Build | Claude Code (/feature) + Playwright MCP | F1 Place Order: RHF + Zod form (size/pattern chips, quantity, name, PH mobile, needed-by, notes), anon insert to Supabase with client-generated HB-XXXX code and retry on collision, confirmation screen with copy + track link | Playwright at 375px and 1280px: 5 validation errors shown on empty submit, bad mobile rejected, real inserts returned codes in 1.4 s and 0.3 s, track link opens /track/HB-XXXX, console clean, no horizontal overflow |
| 01:54 | Build | Claude Code (/feature) + Playwright MCP | F2 Coop Board: Supabase Auth email+password login, session hook, board of order cards sorted by needed-by with status filter chips + counts, overdue flag, skeleton / empty / error states, Zod-validated rows | Playwright at 375px and 1280px: login form renders, empty submit shows 2 field errors, dummy credentials rejected with toast, no board data shown while signed out, no overflow. Signed-in board check done by the human logging in (no password handled by AI) |
| 01:56 | Build | Claude Code (/feature) + Playwright MCP | F3 Status Update + Buyer Tracking: advance dialog with optional note (guarded update + event insert), /track/:code via SECURITY DEFINER get_order(), thread-and-knot stepper, timeline, code input on landing, not-found / invalid / error states | Playwright at 375px and 1280px against real Supabase: 4 seed/test codes show the right step, headline and timeline count, contact number never shown, unknown and invalid codes handled, landing input routes to the track page, console clean, no overflow. Officer advance step verified after the human logs in |
| 02:11 | Verify | Claude Code + built-in browser (human logged in; AI never handled the password) | Signed-in acceptance checks for F2 and F3; fixed mobile filter-row overlap found during the check | F2: 15 cards sorted by needed-by, finished orders last, 5 filter chips with correct counts, F1 order under Received with right size/pattern/date. F3: advanced test order HB-QEL9 Received to Weaving with a note; toast + counts updated; /track/HB-QEL9 shows Weaving step, note in timeline, no contact number. Checked at 375px and desktop width, no overflow |
| 02:17 | Build | Claude Code + built-in browser | Stretch S1: live price estimate on the order form (size price x quantity, sample price guide) | Browser check at 375px: 3 pcs of 4x6 ft shows PHP 3,300; display only, not stored |
| 02:17 | Perf | perf-auditor subagent | Lazy-loaded /order, /track, /coop; moved code + date helpers so Supabase stays off the landing page; non-blocking Google Fonts with trimmed axes; removed 3 unused template assets | Landing JS 220.3 KB gzip (one bundle) -> 111.5 KB gzip entry; Supabase (78.7 KB) and Zod (12.8 KB) now load only on inner routes |
| 02:17 | Polish | ui-reviewer subagent + Playwright MCP + ui-ux-pro-max skill | 8 UX fixes: distinct CSS swatch per pattern and all 6 shown, 2-column desktop hero with track card, How it works strip, quantity wording (20 pcs), lighter placeholders, 44px 404 buttons + track link, login copy + track link, pointer cursor + per-page titles | Reviewer score 7/10 before; fixes verified in browser at 375px (no overflow, console clean). Tracking load measured at about 2 s, not the 5-10 s the reviewer saw |

## AI inside the app
- None. Practice rule set by the human: no in-app AI feature for this build.

## Human decisions (what *I* did)
- 00:10 Replaced AI's first idea (Pamana, heritage-at-risk map) with Habi ng Basey (banig coop orders); set practice rule: no in-app AI
- 00:14 Officer access: rejected AI's Vercel function + service-role + PIN design and the client-side PIN option; chose Supabase Auth with one officer account (anon INSERT only; authenticated SELECT/UPDATE; buyer tracking via SECURITY DEFINER `get_order(code)` that hides contact numbers). Simpler deploy, real RLS, no secrets in the app
- 00:14 Marked the coop association name and the ~1,000-households stat as unverified; excluded both from UI copy

## Poster summary (generated by `/ailog summary`)
- Headline stats: <features built by AI> · <bugs auto-fixed> · <idea → live URL in hh:mm>
- By role:
