---
description: Run the perf-auditor subagent on a production build and apply the safe top fixes.
disable-model-invocation: true
---
1. Delegate to the `perf-auditor` subagent. If I have `npm run preview` running, tell it the URL (default http://localhost:4173).
2. Show me its top 5 fixes. Apply only the ones that are low-risk and don't change features (lazy routes, image sizes/lazy loading, narrower imports, paginated selects). Ask before anything bigger.
3. `npm run build` again and report chunk sizes before → after.
4. Append to AI_LOG.md: `| <time> | Perf | perf-auditor subagent | <fixes> | <before → after KB> |`
5. Remind me: final Lighthouse score comes from Chrome DevTools → Lighthouse on the LIVE URL (mobile), for the poster.
