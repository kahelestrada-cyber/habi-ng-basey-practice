// PostToolUse (Edit|Write|MultiEdit): format the edited file with the project's local Prettier.
// Silent and non-blocking: never fails the edit. Cross-platform (runs Prettier's JS entry with node).
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const FORMATTABLE = /\.(tsx?|jsx?|mjs|cjs|css|json|md|html)$/i;

try {
  const input = JSON.parse(readFileSync(0, "utf8") || "{}");
  const file = input?.tool_input?.file_path;
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  if (!file || !FORMATTABLE.test(file) || !existsSync(file)) process.exit(0);
  if (/node_modules|[\\/]dist[\\/]|components[\\/]ui[\\/]/.test(file)) process.exit(0);

  const prettier = path.join(root, "node_modules", "prettier", "bin", "prettier.cjs");
  if (!existsSync(prettier)) process.exit(0); // Prettier not installed: skip quietly
  execFileSync(process.execPath, [prettier, "--write", "--log-level", "silent", file], {
    cwd: root,
    stdio: "ignore",
    timeout: 15000,
  });
} catch {
  /* formatting is best-effort */
}
process.exit(0);
