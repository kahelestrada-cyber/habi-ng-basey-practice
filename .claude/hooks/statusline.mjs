// Status line: event clock + branch + model + context % + Pro/Max 5-hour limit %. Costs zero tokens. Start the clock with: node .claude/hooks/clock.mjs start
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch {}
const root = input?.workspace?.project_dir || input?.workspace?.current_dir || input.cwd || process.cwd();
const TOTAL_MIN = 240;
const fmt = (m) => `${Math.floor(m / 60)}:${String(Math.floor(m % 60)).padStart(2, "0")}`;

let clock = "⏱ clock off";
try {
  const start = new Date(readFileSync(path.join(root, ".claude", "event-start"), "utf8").trim());
  const used = (Date.now() - start.getTime()) / 60000;
  const left = TOTAL_MIN - used;
  const phase =
    used < 20 ? "SPEC" : used < 40 ? "SCAFFOLD+DEPLOY" : used < 150 ? "BUILD" : used < 190 ? "POLISH" : used < 215 ? "POSTER+DEPLOY" : "DEMO PREP / FREEZE";
  clock = left > 0 ? `⏱ ${fmt(used)} used · ${fmt(left)} left · ${phase}` : `⏱ TIME UP (+${fmt(-left)})`;
} catch {}

let branch = "";
try {
  const b = execFileSync("git", ["branch", "--show-current"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  const dirty = execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").filter(Boolean).length;
  branch = ` | ${b}${dirty ? ` ✚${dirty}` : " ✓"}`;
} catch {}

const model = input?.model?.display_name ? ` | ${input.model.display_name}` : "";
const ctxPct = input?.context_window?.used_percentage;
const ctx = typeof ctxPct === "number" ? ` | ctx ${Math.round(ctxPct)}%${ctxPct > 60 ? " → /clear or /compact" : ""}` : "";
const limPct = input?.rate_limits?.five_hour?.used_percentage;
const lim = typeof limPct === "number" ? ` | 5h limit ${Math.round(limPct)}%${limPct > 80 ? " ⚠ switch to Sonnet/Haiku" : ""}` : "";
process.stdout.write(`${clock}${branch}${model}${ctx}${lim}\n`);
