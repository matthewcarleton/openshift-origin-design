import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const prototypeRoot = path.join(hubRoot, "..", "ocp5-cluster-update-experience");
const outDir = path.join(hubRoot, "public", "ocp5-cluster-update-experience");

/** Respect the same BASE_PATH convention the hub and hpux-prototypes scripts use. */
const rawHubBase = process.env.BASE_PATH ?? "/";
const hubBase = rawHubBase === "/" ? "/" : rawHubBase.endsWith("/") ? rawHubBase : `${rawHubBase}/`;

/**
 * Vite base for the OCP5 prototype. Must match where the hub hosts it so that
 * import.meta.env.BASE_URL (used by the app's createBrowserRouter basename) is correct.
 */
const VITE_BASE = `${hubBase}ocp5-cluster-update-experience/`;

if (!fs.existsSync(path.join(prototypeRoot, "package.json"))) {
  console.error(`OCP 5 cluster update prototype not found at ${prototypeRoot} (expected package.json)`);
  process.exit(1);
}

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, {
    cwd,
    stdio: "inherit",
    shell: false,
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("npm", ["ci"], prototypeRoot);
run("npm", ["run", "build", "--", "--base", VITE_BASE], prototypeRoot);

const dist = path.join(prototypeRoot, "dist");
if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error(`Expected ${dist}/index.html after vite build`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(outDir), { recursive: true });
fs.cpSync(dist, outDir, { recursive: true });
console.log(`Embedded OCP 5 cluster update prototype → ${outDir} (Vite base ${VITE_BASE})`);

/**
 * GitHub Pages serves only static files — it cannot fall back to index.html for deep
 * client-side routes the way a server or Vite dev middleware can. Create index.html
 * copies at every route path the hub iframe links to directly, so GitHub Pages finds
 * a real file and the React Router (with the correct BASE_URL basename) boots at the
 * right location and renders the matching page.
 */
function createSpaFallback(targetRelPath) {
  const srcHtml = path.join(outDir, "index.html");
  const destDir = path.join(outDir, ...targetRelPath.split("/"));
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcHtml, path.join(destDir, "index.html"));
  console.log(`OCP5: created SPA fallback at ${targetRelPath}/index.html`);
}

createSpaFallback("administration/cluster-update");
