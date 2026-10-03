---
description: Phase 1 (0:20–0:40). Scaffold or adapt the Vite + React + TS + Tailwind v4 + shadcn/ui + Supabase project, generate the design system, push to GitHub and deploy the empty shell.
disable-model-invocation: true
---
Goal: a running app shell with live URL in ≤ 20 minutes. If `package.json` already exists (starter template), only do the missing steps.

1. Use Context7 for current setup docs of: Vite react-ts template, Tailwind CSS v4 Vite plugin, shadcn/ui Vite installation. Follow those docs, not memory.
2. This folder already holds kit files (`CLAUDE.md`, `SPEC.md`, `AI_LOG.md`, `.claude/`, `.mcp.json`, `gitignore-additions.txt`). **Never delete or overwrite them, and never use create-vite's overwrite option here.** Instead:
   - Run `npm create vite@latest -- --help` and pick the flags that make it fully non-interactive (template react-ts, no "install and start now" prompt).
   - Scaffold into a temp subfolder `_app`, move everything from `_app` up into the current folder (if a file name collides with a kit file, keep the kit file), then remove `_app`.
   - Install deps, set up Tailwind v4 + `@` path alias, run `npx shadcn@latest init` with non-interactive flags (check `--help`), then add: button card input textarea label select badge dialog sheet skeleton sonner tabs table dropdown-menu.
3. Install: `react-router-dom lucide-react @supabase/supabase-js react-hook-form zod @hookform/resolvers` and dev dep `prettier`. Add only what SPEC.md needs of: `recharts react-leaflet leaflet motion`.
4. Design system (ui-ux-pro-max skill): run `python .claude/skills/ui-ux-pro-max/scripts/search.py "<product type + users + mood from SPEC.md>" --design-system --persist -p "<App name>" --output-dir .` (try `py -3` if `python` fails). Read the generated `design-system/<slug>/MASTER.md`, map its colors to the shadcn CSS variables in `src/index.css`, load its fonts (max 2 families, few weights, `display=swap`). If its suggestion clashes with SPEC.md's design brief, the brief wins — say which you overrode.
5. Create: `src/lib/supabase.ts` (reads `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), `.env.example`, app layout with header/nav + routes from SPEC.md as placeholder pages, `vercel.json` with SPA rewrite (`{"rewrites":[{"source":"/((?!api/).*)","destination":"/index.html"}]}`), `supabase/schema.sql` from SPEC.md data model (tables + RLS + policies + seed inserts).
6. Append the lines in `gitignore-additions.txt` to `.gitignore` (and keep Vite's own entries such as `node_modules`, `dist`). If there's no git repo yet, run `git init`.
7. `npx tsc -p tsconfig.app.json --noEmit` and `npm run build` must pass.
8. Tell the human, in one short checklist, what THEY must do now: paste `supabase/schema.sql` into Supabase SQL editor (or approve me running it via the Supabase MCP) · put keys in `.env.local` · create GitHub repo + push · `vercel` link and add the two env vars in Vercel → then run `/deploy`.
9. Append to AI_LOG.md: `| <time> | Scaffold | Claude Code (/scaffold) + Context7 + ui-ux-pro-max | Project setup, design system, schema, routes | <outcome> |`
