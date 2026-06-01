import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const hpuxRoot = path.join(hubRoot, "..", "hpux-prototypes");
const buildMarker = path.join(hubRoot, "public", "hpux-prototypes", "index.html");

function runBuild() {
  execSync("npm run build:hpux", { cwd: hubRoot, stdio: "inherit" });
}

/** Return the most-recent mtime (ms) across all files under `dir`, recursively. */
function newestMtime(dir) {
  let newest = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = newestMtime(full);
      if (sub > newest) newest = sub;
    } else {
      const { mtimeMs } = fs.statSync(full);
      if (mtimeMs > newest) newest = mtimeMs;
    }
  }
  return newest;
}

if (!fs.existsSync(buildMarker)) {
  console.log("hpux-prototypes: no build output found, running full build…");
  runBuild();
  process.exit(0);
}

const buildTime = fs.statSync(buildMarker).mtimeMs;

// Check package-lock.json — if deps changed, force rebuild
const lockFile = path.join(hpuxRoot, "package-lock.json");
if (fs.existsSync(lockFile) && fs.statSync(lockFile).mtimeMs > buildTime) {
  console.log("hpux-prototypes: package-lock.json changed, rebuilding…");
  runBuild();
  process.exit(0);
}

const srcDir = path.join(hpuxRoot, "src");
if (!fs.existsSync(srcDir)) {
  console.error(`hpux-prototypes src not found at ${srcDir}`);
  process.exit(1);
}

const newestSrc = newestMtime(srcDir);

if (newestSrc > buildTime) {
  console.log("hpux-prototypes: source files changed, rebuilding…");
  runBuild();
} else {
  console.log("hpux-prototypes build is up to date, skipping.");
}
