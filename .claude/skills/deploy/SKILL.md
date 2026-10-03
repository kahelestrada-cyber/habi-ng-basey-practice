---
description: Build, deploy to Vercel production, smoke-test the live URL in a real browser, and log the URL.
disable-model-invocation: true
---
1. `npm run build`. If it fails, fix the FIRST error (or hand it to the bug-fixer subagent), rebuild. Do not deploy a failing build.
2. Check `vercel.json` has the SPA rewrite and that the app doesn't reference `localhost` URLs.
3. Deploy: `vercel --prod --yes` (ask me to approve). If the project isn't linked, tell me to run `vercel link` and add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (+ any server secrets) in Vercel → Settings → Environment Variables, then stop.
4. Smoke test with Playwright on the production URL: load `/`, one deep route (refresh must not 404), the main flow's first step; read console errors; screenshot at 375px to `docs/screens/live-mobile.png`.
5. If the deploy fails on Vercel: case-sensitive imports, missing env vars, or type errors are the usual causes. Fallback: `npx wrangler pages deploy dist` (Cloudflare) — ask me first.
6. Append to AI_LOG.md: `| <time> | Deploy | Claude Code (/deploy) + Vercel CLI + Playwright MCP | Deployed <url> | <smoke test result> |`
Reply: live URL + pass/fail per smoke check (≤ 5 lines).
