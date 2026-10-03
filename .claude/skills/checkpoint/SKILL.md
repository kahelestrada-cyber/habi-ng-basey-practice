---
description: Save a known-good checkpoint — type-check, build, commit with a meaningful message, log it.
argument-hint: "[commit message]"
disable-model-invocation: true
allowed-tools: Bash(git add *), Bash(git commit *), Bash(git status*), Bash(git diff*), Bash(npx tsc *), Bash(npm run build*)
---
Changes: !`git status --short`

1. Run `npx tsc -p tsconfig.app.json --noEmit`. If it fails, report the first 5 errors and STOP (do not commit).
2. Stage and commit with message: "$ARGUMENTS" — if empty, write a conventional message (feat/fix/style/chore) from the diff.
3. If the last `/deploy` was > 45 min ago (see AI_LOG.md), remind me to deploy.
Reply with one line: `✔ <hash> <message>`.
