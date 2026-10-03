# CLAUDE.md — rSCENE 2026 Vibe Coding build

4-hour challenge build. Priorities, in order: **works live end-to-end → looks polished → fast → clever.**
Read `SPEC.md` for the product. Log AI usage in `AI_LOG.md`. Keep this file short; it loads every session.

## Stack (fixed — do not propose alternatives)
- Vite + React + TypeScript (strict) · Tailwind CSS v4 (`@tailwindcss/vite`) · shadcn/ui · lucide-react
- React Router · React Hook Form + Zod · Recharts (charts) · react-leaflet + OpenStreetMap (maps, no key)
- `motion` (import from `motion/react`) for animation, sparingly
- Supabase (Postgres + Auth + Storage), region Singapore, client in `src/lib/supabase.ts`
- Deploy: Vercel (`vercel --prod`). Server code (secret keys, AI calls) goes in `api/*.ts` (Vercel functions)

## Commands
- `npm run dev` · `npm run build` · `npm run preview -- --host` · `npx tsc -p tsconfig.app.json --noEmit`
- Add shadcn components: `npx shadcn@latest add <name>` — never hand-write a component shadcn provides
- Deploy: `/deploy` · Commit: `/checkpoint "msg"`

## Folder conventions
- `src/pages/` one file per route · `src/components/` reusable UI · `src/components/ui/` shadcn (don't edit unless asked)
- `src/lib/` clients/helpers · `src/types.ts` shared types · `supabase/schema.sql` = source of truth for tables + RLS
- `src/data/seed.ts` demo data · `api/` server functions
- Kit files that must never be deleted or overwritten: `CLAUDE.md`, `SPEC.md`, `AI_LOG.md`, `.claude/`, `.mcp.json`

## Design rules (UX = 15% of score)
- Design system comes from the **ui-ux-pro-max** skill: generated once at scaffold into `design-system/<slug>/MASTER.md`. Read MASTER.md before UI work and follow its palette, type and checklist. Map its colors onto the shadcn CSS variables in `src/index.css`
- Civic-tech look: one accent color (CSS var `--primary`), neutral grays, max 2 font families, shadcn radii/shadows
- Mobile-first; must work at 375px width. Clear header/nav, one primary action per screen
- Every data view has: skeleton loading, friendly empty state with a CTA, error toast (sonner)
- Motion 150–400 ms, `transform`/`opacity` only, respect `prefers-reduced-motion`
- Accessible: labels on inputs, contrast AA, focus rings kept, alt text on images, touch targets ≥ 44px
- Filipino-friendly copy where natural (e.g. "Barangay", "Salamat!"); no lorem ipsum — use realistic local seed data

## Code rules
- TypeScript strict, no `any`. Validate forms and API inputs with Zod
- Supabase: select only needed columns, RLS ON for every table; if a query returns `[]` check RLS first
- Env vars: public ones prefixed `VITE_`; secrets only in `api/` via `process.env`. Never print or commit `.env*`
- Any AI feature in the app: call from `api/`, 10 s timeout, and a canned fallback response if the call fails
- Keep files < 250 lines; extract components instead of growing pages

## Workflow rules
- One feature per task. Plan first (plan mode) if it touches > 3 files
- After a feature works: verify in the browser (Playwright MCP) at 375px and 1280px, then `/checkpoint`
- If a fix fails twice, stop and say so — suggest `git checkout .` or `/rewind` instead of stacking patches
- Look up library APIs with Context7 before guessing (Tailwind v4, shadcn, react-router, motion, supabase-js change often)
- Don't run `npm run dev` in the foreground inside a tool call; ask me to run it, or run it in the background
- Never run an interactive CLI that waits for input; pass flags (`--help` first) or ask me to run it

## Token rules
- Don't re-read files you just wrote. Read only the lines you need. Don't paste whole files back to me
- Delegate browser review/perf audits to subagents (`ui-reviewer`, `perf-auditor`); return summaries only
- Short answers: what changed + how to check it. No recap of steps

## Never
- Switch stack, add a new dependency > 50 KB without asking, add auth unless SPEC says so
- Edit `.env*`, `node_modules/`, `dist/`, lockfiles by hand; force-push; disable RLS; commit secrets
- Use Three.js, heavy UI kits (MUI/Chakra), or placeholder images from random URLs
