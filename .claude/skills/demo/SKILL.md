---
description: Phase 5 (3:35–4:00). Produce DEMO.md — a live presentation script for the judging panel (3-min and 5-min versions), judge Q&A prep and a pre-demo checklist — and verify the live demo path works.
argument-hint: "[presentation length in minutes, if announced at orientation]"
disable-model-invocation: true
---
Presentation length announced at orientation (if given): $ARGUMENTS

1. Read SPEC.md, AI_LOG.md, and the live URL. Walk the demo path on the live URL with Playwright once; report anything broken FIRST.
2. Write `DEMO.md` (≤ 1 page):
   - If a length was given, write the script for that length. Otherwise write two versions with timings:
     - **3-minute:** hook (a real person + pain, 20 s) → live flow (90 s, exact clicks and sample inputs to type) → AI angle: built-with-AI + AI-inside-the-app (40 s) → impact + next steps: scale to other LGUs (30 s).
     - **5-minute:** same order, plus a second flow or the admin/official side (60 s), a mobile view on phone (20 s) and a slower AI-angle walkthrough of the poster's "Built with AI" section (40 s).
   - 6 likely judge questions with 2-line answers (data privacy / RA 10173, cost to run, how it scales, what AI did vs you, offline/low-signal use, why this over existing tools).
   - Pre-demo checklist: open live URL 2 min before · seeded data present · AI feature fallback works (test with network off) · backup screen recording ready · local `npm run preview -- --host` ready · phone hotspot on.
   - On-stage checklist: HDMI/USB-C adapter connected, display set to mirror · browser zoom 110–125% · clean browser profile, Do Not Disturb on, chat apps closed · tabs in order: live app → poster → AI_LOG.md.
3. Append to AI_LOG.md: `| <time> | Demo | Claude Code (/demo) | Demo script + Q&A | <live check result> |`
