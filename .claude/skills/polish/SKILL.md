---
description: Phase 3 (2:30–3:10). Run the ui-reviewer subagent, then apply the top fixes in ONE batch, plus demo-data and empty/loading-state polish.
argument-hint: "[extra fixes you want, comma-separated]"
disable-model-invocation: true
---
1. Delegate to the `ui-reviewer` subagent: review http://localhost:5173 (or the URL I give) across the main flow. Get its fix table.
2. Merge its blockers/high items with my extra requests: $ARGUMENTS
3. Apply them as one batch (max 8 fixes). Priorities: mobile layout at 375px > consistency (one accent, spacing, radii) > loading/empty/error states > microcopy > subtle motion (150–300 ms, `motion/react`, respect reduced motion) > favicon + page titles. For any design question, query the ui-ux-pro-max skill with one `--domain` search (e.g. `"empty state call to action" --domain ux`) instead of guessing.
4. Run through the "Pre-delivery checklist" in `design-system/*/MASTER.md` and fix what fails.
5. Make sure seed data looks real (local names/places, recent dates) and the landing screen explains the app in one sentence.
6. Type-check, then commit `style: polish pass`.
7. Append to AI_LOG.md: `| <time> | Polish | ui-reviewer subagent + Playwright MCP + ui-ux-pro-max skill | <n> UX fixes | score before → after if re-checked |`
Reply: list of fixes applied (1 line each).
