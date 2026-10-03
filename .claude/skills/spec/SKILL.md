---
description: Phase 0 (0:00–0:20). Start the event clock, turn a rough idea into a 1-page SPEC.md, critique it, and cut scope to 3 core features.
argument-hint: "<rough idea, target user, problem>"
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash(node .claude/hooks/clock.mjs *)
---
Idea from the human: $ARGUMENTS

1. Run `node .claude/hooks/clock.mjs start` (skip if the human says the clock is already running).
2. Write `SPEC.md` using the structure already in `SPEC.md` (fill every section; keep it under 60 lines). Constraints:
   - Theme: "The Living Tapestry: Weaving the Threads of Innovation and Heritage" — smart communities / LGU / heritage, Philippines (Eastern Visayas context welcome). If the organizers gave a specific problem statement, it overrides the theme defaults.
   - Exactly 3 core features forming ONE complete loop (e.g. citizen submits → official sees → status changes). Each has acceptance criteria a judge could verify live in 30 seconds.
   - One small in-app AI feature (summarize / classify / translate EN↔Filipino/Waray) behind `api/`, with a canned fallback.
   - Data model: tables, columns, RLS policy per table. Auth only if essential (default: none or one demo account).
   - Pages/routes, seed data (8–15 realistic local records), stretch goals (max 3, clearly marked).
3. Then critique it as a hackathon judge in ≤ 8 bullets: rubric fit (AI 20, innovation 20, function 20, UX 15, impact 15, poster 10), biggest risk, what to cut. Apply the cuts to SPEC.md.
4. Append to `AI_LOG.md`: `| <time> | Spec | Claude Code (/spec) | Drafted + critiqued SPEC.md | <1-line outcome> |`
5. Reply with: the 3 features (1 line each) + the one question that most affects the build, if any.
