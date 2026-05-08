import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const omeRoot = path.join(hubRoot, "..", "ome-console");
const outDir = path.join(hubRoot, "public", "ome-console");

const rawBase = process.env.BASE_PATH ?? "/";
const hubBase =
  rawBase === "/" ? "/" : rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
/** Vite `base` for nested assets: matches hub deploy path + `/ome-console/`. */
const omeViteBase =
  hubBase === "/" ? "/ome-console/" : `${hubBase.replace(/\/$/, "")}/ome-console/`;

if (!fs.existsSync(path.join(omeRoot, "package.json"))) {
  console.error(`OME console package not found at ${omeRoot}`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });

execSync("npm ci", { cwd: omeRoot, stdio: "inherit" });
execSync("npm run build", {
  cwd: omeRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    VITE_OME_HASH_ROUTER: "true",
    GITHUB_PAGES_BASE: omeViteBase,
  },
});

const omeDist = path.join(omeRoot, "dist");
fs.mkdirSync(path.dirname(outDir), { recursive: true });
fs.cpSync(omeDist, outDir, { recursive: true });
console.log(`Embedded OME console build → ${outDir} (Vite base ${omeViteBase}, hash router)`);
