---
description: Generate the competition poster as a print-ready HTML page from SPEC.md, AI_LOG.md and screenshots, then export PNG/PDF.
argument-hint: "[size, default A2 portrait] [team names]"
disable-model-invocation: true
---
Inputs: SPEC.md, AI_LOG.md (run the `/ailog summary` logic first if the Poster summary is empty), screenshots in `docs/screens/`, live URL from AI_LOG.md. Extra: $ARGUMENTS

1. Take fresh screenshots with Playwright of the 2–3 key screens (desktop 1280 + mobile 375) into `docs/screens/`.
2. Write `poster/poster.html` (single self-contained file, images referenced relatively): portrait, default A2 (420×594 mm) via `@page` + fixed-size container; readable from 2 m (title ≥ 90 px, body ≥ 28 px). Sections, in order: Title + one-line pitch · Problem (one local stat — mark it `[VERIFY]` if you are not sure it is real) · Solution with screenshots · "Built with AI" — tools by role from AI_LOG (this is 20% of the score, make it the visual centrepiece) · Process timeline (spec → scaffold → build → polish → deploy with actual clock times from AI_LOG) · Impact (who, how much time/cost saved) · QR code to the live URL (generate an inline SVG QR with a small script or the `qrcode` npm package via npx) · team names · rSCENE 2026 theme line.
   Use the app's own palette and fonts from `design-system/*/MASTER.md` so poster and app feel like one product.
3. Export with Playwright: open the file, set the viewport to the poster size in px (A2 at 96 dpi ≈ 1587×2245), full-page screenshot to `poster/poster.png`. Tell me to use Chrome → Print → Save as PDF (margins none, background graphics on) for the PDF.
4. Append to AI_LOG.md: `| <time> | Poster | Claude Code (/poster) + Playwright MCP | Poster generated | <files> |`
Reply: file paths + any `[VERIFY]` items I must check.
