// Event clock. `node .claude/hooks/clock.mjs start` (resets to now) | `status` (default)
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
const file = path.join(process.cwd(), ".claude", "event-start");
if (process.argv[2] === "start") {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, new Date().toISOString());
  console.log(`Clock started at ${new Date().toLocaleTimeString()} — 4:00 on the clock.`);
} else {
  try {
    const used = Math.round((Date.now() - new Date(readFileSync(file, "utf8").trim())) / 60000);
    console.log(`${Math.floor(used / 60)}h${String(used % 60).padStart(2, "0")}m used, ${240 - used} min left`);
  } catch { console.log("Clock not started. Run: node .claude/hooks/clock.mjs start"); }
}
