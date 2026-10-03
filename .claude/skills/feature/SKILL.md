---
description: Phase 2 build loop. Implement ONE feature from SPEC.md end-to-end, verify it in the browser, then checkpoint.
argument-hint: "<feature number or name> [extra notes]"
disable-model-invocation: true
---
Implement feature: $ARGUMENTS (as defined in SPEC.md — read only that feature's section and the data model).

1. If it touches > 3 files, show a 5-line plan first and wait for "go".
2. Build it with shadcn components, Zod validation, loading skeleton, empty state and error toast, following `design-system/*/MASTER.md`. Real Supabase data (fall back to `src/data/seed.ts` only if SPEC says so). Check Context7 for any library API you're unsure of.
3. Verify: `npx tsc -p tsconfig.app.json --noEmit` passes. If the dev server is running (ask me if unsure, default http://localhost:5173), use Playwright to walk the acceptance criteria at 1280px and 375px; check the console is clean.
4. Tick the feature's checkbox in SPEC.md.
5. Append to AI_LOG.md: `| <time> | Build | Claude Code (/feature) [+ Playwright MCP / Context7 / Supabase MCP if used] | <what was built> | <verified how> |`
6. Commit: `git add -A && git commit -m "feat: <feature>"`.
7. Reply in ≤ 5 lines: what works, how I can see it, anything I must do (e.g. run SQL).
