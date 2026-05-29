import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const hpuxRoot = path.join(hubRoot, "..", "hpux-prototypes");
const outDir = path.join(hubRoot, "public", "hpux-prototypes");

const rawBase = process.env.BASE_PATH ?? "/";
const hubBase =
  rawBase === "/" ? "/" : rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
/** Matches hub deploy base + `/hpux-prototypes/` static assets (Webpack `publicPath`). */
const hpuxAssetBase =
  hubBase === "/" ? "/hpux-prototypes/" : `${hubBase.replace(/\/$/, "")}/hpux-prototypes/`;
const hpuxAssetPath =
  hpuxAssetBase.endsWith("/") ? hpuxAssetBase.slice(0, -1) : hpuxAssetBase;

if (!fs.existsSync(path.join(hpuxRoot, "package.json"))) {
  console.error(`HPUX Prototypes bundle not found at ${hpuxRoot}`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });

execSync("npm ci", { cwd: hpuxRoot, stdio: "inherit" });

execSync("node ./scripts/discover-hpux-private-prototypes.mjs", {
  cwd: hubRoot,
  stdio: "inherit",
});

/** Webpack: `ASSET_PATH` trailing slash); hub iframe loads `hpux-prototypes/index.html`. */
execSync("npm run build", {
  cwd: hpuxRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    ASSET_PATH: hpuxAssetBase,
  },
});

const hpuxDist = path.join(hpuxRoot, "dist");
fs.mkdirSync(path.dirname(outDir), { recursive: true });
fs.cpSync(hpuxDist, outDir, { recursive: true });
console.log(`Embedded HPUX Prototypes build → ${outDir} (Webpack publicPath ${hpuxAssetPath}/)`);
