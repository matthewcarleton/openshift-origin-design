import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const osacRoot = path.join(hubRoot, "..", "osac-demo");
const outDir = path.join(hubRoot, "public", "osac-demo");

const rawBase = process.env.BASE_PATH ?? "/";
const hubBase =
  rawBase === "/" ? "/" : rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
/** Matches hub deploy base + `/osac-demo/` (same pattern as Pages `heyethankim.github.io/osac-demo/`). */
const osacBase =
  hubBase === "/" ? "/osac-demo/" : `${hubBase.replace(/\/$/, "")}/osac-demo/`;

if (!fs.existsSync(path.join(osacRoot, "package.json"))) {
  console.error(`OSAC demo not found at ${osacRoot}`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });

execSync("npm ci", { cwd: osacRoot, stdio: "inherit" });

/** OSAC vite uses BASE_PATH for GitHub Pages; match nested hub static path. */
execSync("npm run build", {
  cwd: osacRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    BASE_PATH: osacBase.startsWith("/") ? osacBase.slice(0, -1) : osacBase,
  },
});

const osacDist = path.join(osacRoot, "dist");
fs.mkdirSync(path.dirname(outDir), { recursive: true });
fs.cpSync(osacDist, outDir, { recursive: true });
console.log(`Embedded OSAC demo build → ${outDir} (Vite base ${osacBase})`);
