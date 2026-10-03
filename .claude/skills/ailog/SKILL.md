---
description: Append an entry to AI_LOG.md, or (with "summary") turn the log into poster-ready "AI tools used" copy.
argument-hint: "<tool> - <what it did>  |  summary"
disable-model-invocation: true
allowed-tools: Read, Edit
---
Input: $ARGUMENTS

- If the input is `summary`: read AI_LOG.md and fill its "Poster summary" section: tools grouped by role (build agent, docs lookup, testing, design, content, in-app AI), each with a count of uses and the single most impressive result; plus 3 headline stats (e.g. features built, bugs auto-fixed, time from idea to live URL). Max 12 lines.
- Otherwise: append one row to the Timeline table: `| <current HH:MM> | <phase from the status line or best guess> | <tool> | <what it did> | <outcome> |`. Keep my wording, just tidy it.
Reply with only the row(s) added.
