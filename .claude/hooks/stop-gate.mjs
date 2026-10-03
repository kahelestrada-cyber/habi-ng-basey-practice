// Stop hook: (1) type-check if TS files changed; block Claude (exit 2) with the first errors so it fixes them.
//            Gives up after 2 consecutive blocks to avoid loops.
//            (2) If the check passes, make an automatic git checkpoint commit ("undo button").
// Opt out of auto-commits: create an empty file .claude/no-auto-checkpoint
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";

const MAX_BLOCKS = 2;
let input = {};
try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch {}
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const stateDir = path.join(root, ".claude", ".cache");
const stateFile = path.join(stateDir, "stop-gate.json");

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const readState = () => { try { return JSON.parse(readFileSync(stateFile, "utf8")); } catch { return { blocks: 0 }; } };
const writeState = (s) => { try { mkdirSync(stateDir, { recursive: true }); writeFileSync(stateFile, JSON.stringify(s)); } catch {} };

// Not a git repo yet? Nothing to do.
try { git("rev-parse", "--is-inside-work-tree"); } catch { process.exit(0); }

const changed = git("status", "--porcelain", "-uall")
  .split("\n").filter(Boolean)
  .map((l) => l.slice(3).replace(/^"|"$/g, "").split(" -> ").pop());
if (changed.length === 0) { writeState({ blocks: 0 }); process.exit(0); }

// ---- 1. Type-check gate -------------------------------------------------
const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");
const tsChanged = changed.some((f) => /\.(tsx?|mts|cts)$/.test(f));
if (tsChanged && existsSync(tsc)) {
  const project = ["tsconfig.app.json", "tsconfig.json"].find((p) => existsSync(path.join(root, p)));
  if (project) {
    const r = spawnSync(process.execPath, [tsc, "-p", project, "--noEmit", "--pretty", "false"], {
      cwd: root, encoding: "utf8", timeout: 80000,
    });
    const out = `${r.stdout || ""}${r.stderr || ""}`.trim();
    if (r.status !== 0 && out) {
      const state = readState();
      if (input.stop_hook_active || state.blocks >= MAX_BLOCKS) {
        writeState({ blocks: 0 });
        process.stderr.write(`stop-gate: type errors remain after ${MAX_BLOCKS} attempts; not blocking again.\n`);
        process.exit(0); // don't loop forever, don't auto-commit broken code
      }
      writeState({ blocks: state.blocks + 1 });
      const lines = out.split("\n").filter((l) => /error TS/.test(l));
      process.stderr.write(
        `TypeScript errors (${lines.length}). Fix these before finishing, smallest change possible:\n` +
          lines.slice(0, 15).join("\n") + (lines.length > 15 ? `\n...and ${lines.length - 15} more` : "") + "\n"
      );
      process.exit(2);
    }
  }
}
writeState({ blocks: 0 });

// ---- 2. Auto checkpoint -------------------------------------------------
if (existsSync(path.join(root, ".claude", "no-auto-checkpoint"))) process.exit(0);

// Safety: never auto-commit if a .env file exists and is NOT git-ignored.
for (const f of [".env", ".env.local", ".env.production"]) {
  if (existsSync(path.join(root, f))) {
    const ignored = spawnSync("git", ["check-ignore", "-q", f], { cwd: root }).status === 0;
    if (!ignored) {
      process.stderr.write(`stop-gate: ${f} is not in .gitignore — auto-checkpoint skipped. Add ".env*" to .gitignore.\n`);
      process.exit(0);
    }
  }
}

try {
  git("add", "-A");
  const staged = git("diff", "--cached", "--name-only").split("\n").filter(Boolean);
  if (staged.length) {
    const hhmm = new Date().toTimeString().slice(0, 5);
    const summary = staged.slice(0, 3).map((f) => path.basename(f)).join(", ") + (staged.length > 3 ? ` +${staged.length - 3}` : "");
    git("commit", "-q", "--no-verify", "-m", `auto: checkpoint ${hhmm} (${summary})`);
  }
} catch { /* never fail the turn because of git */ }
process.exit(0);
