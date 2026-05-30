import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const rhacsRoot = path.join(hubRoot, "..", "rhacs-ux-prototypes");
const outDir = path.join(hubRoot, "public", "rhacs-ux-prototypes");

/** Respect the same BASE_PATH convention the hub and other embed scripts use. */
const rawHubBase = process.env.BASE_PATH ?? "/";
const hubBase = rawHubBase === "/" ? "/" : rawHubBase.endsWith("/") ? rawHubBase : `${rawHubBase}/`;

/**
 * The absolute URL prefix for all RHACS saved-filters assets and the React Router
 * basename. The vendored bundle was originally built with base "/rhacs-ux-prototypes/saved-filters/"
 * which only works when deployed at the server root. For subdirectory previews (e.g.
 * /openshift-origin-design/preview/design-repo-2026/) we must patch this to the full path.
 */
const rhacsBase =
  hubBase === "/"
    ? "/rhacs-ux-prototypes/saved-filters"
    : `${hubBase.replace(/\/$/, "")}/rhacs-ux-prototypes/saved-filters`;

/** Remove in-app Baseline / Saved filters toggle; hub lists separate cards with fixed URLs. */
function patchRhacsHidePrototypeSwitcher(savedFiltersRoot) {
  const staticDir = path.join(savedFiltersRoot, "static");
  if (!fs.existsSync(staticDir)) return;

  const stub = "function VmPrototypeVersionSwitcher(){return null}";
  const afterMarker = "function LinkShim({children:e,href:t,...r})";

  for (const name of fs.readdirSync(staticDir)) {
    if (!/^index-.*\.js$/.test(name)) continue;
    const bundlePath = path.join(staticDir, name);
    let s = fs.readFileSync(bundlePath, "utf8");
    const fn = "function VmPrototypeVersionSwitcher(){";
    const start = s.indexOf(fn);
    if (start === -1) continue;
    if (s.slice(start, start + stub.length) === stub) continue;
    const end = s.indexOf(afterMarker, start);
    if (end === -1) {
      console.warn(`RHACS patch: could not find end marker after VmPrototypeVersionSwitcher in ${name}; skip`);
      continue;
    }
    s = s.slice(0, start) + stub + s.slice(end);
    fs.writeFileSync(bundlePath, s);
    console.log(`RHACS: removed prototype dropdown (${name})`);
    return;
  }
}

/**
 * Patch absolute /rhacs-ux-prototypes/saved-filters paths in the vendored bundle so
 * the prototype works when the hub is deployed to a subdirectory (GitHub Pages preview).
 *
 * The vendored static build hardcodes the original deployment base as absolute paths in:
 *   - index.html / 404.html  (script src, link href)
 *   - the main JS bundle     (React Router basename, mockServiceWorker path, SVG asset URLs)
 *
 * When BASE_PATH == "/" the replacement is a no-op, so local dev is unaffected.
 */
function patchRhacsAbsolutePaths(savedFiltersRoot) {
  const originalBase = "/rhacs-ux-prototypes/saved-filters";
  if (originalBase === rhacsBase) {
    console.log("RHACS: base path matches original; no absolute-path patching needed");
    return;
  }

  // Patch HTML files (index.html, 404.html)
  for (const name of ["index.html", "404.html"]) {
    const htmlPath = path.join(savedFiltersRoot, name);
    if (!fs.existsSync(htmlPath)) continue;
    let html = fs.readFileSync(htmlPath, "utf8");
    const patched = html.replaceAll(`${originalBase}/`, `${rhacsBase}/`);
    if (patched !== html) {
      fs.writeFileSync(htmlPath, patched);
      console.log(`RHACS: patched absolute asset paths in ${name}`);
    }
  }

  // Patch ALL index-*.js chunks (basename, mockServiceWorker path, SVG asset URLs).
  // The vendored build splits into several index-*.js files (main entry + lazy route chunks)
  // so we must iterate all of them rather than stopping at the first one found.
  const staticDir = path.join(savedFiltersRoot, "static");
  if (!fs.existsSync(staticDir)) return;
  let patchedBundleCount = 0;
  for (const name of fs.readdirSync(staticDir)) {
    if (!/^index-.*\.js$/.test(name)) continue;
    const bundlePath = path.join(staticDir, name);
    let s = fs.readFileSync(bundlePath, "utf8");
    // Replace both the base with trailing slash and without (for the basename string)
    let patched = s.replaceAll(`${originalBase}/`, `${rhacsBase}/`);
    // Basename is stored without trailing slash — replace occurrences bounded by quote/comma/whitespace
    patched = patched.replaceAll(`"${originalBase}"`, `"${rhacsBase}"`);
    patched = patched.replaceAll(`'${originalBase}'`, `'${rhacsBase}'`);
    if (patched !== s) {
      fs.writeFileSync(bundlePath, patched);
      console.log(`RHACS: patched absolute paths in JS bundle (${name})`);
      patchedBundleCount++;
    }
  }
  if (patchedBundleCount === 0) {
    console.log(`RHACS: no absolute-path replacements needed in any index-*.js bundle`);
  }
}

/**
 * GitHub Pages cannot fall back to index.html for deep SPA routes. Copy the (already
 * patched) index.html to every route path the hub iframe links to directly, so GitHub
 * Pages finds a real file and the RHACS React Router boots at the correct location.
 */
function createRhacsDeepRouteIndex(savedFiltersRoot) {
  const srcHtml = path.join(savedFiltersRoot, "index.html");
  if (!fs.existsSync(srcHtml)) return;

  // hub/src/App.tsx links to: rhacs-ux-prototypes/saved-filters/main/vulnerabilities/user-workloads
  const deepPath = path.join(savedFiltersRoot, "main", "vulnerabilities", "user-workloads");
  fs.mkdirSync(deepPath, { recursive: true });
  fs.copyFileSync(srcHtml, path.join(deepPath, "index.html"));
  console.log(`RHACS: created SPA fallback at main/vulnerabilities/user-workloads/index.html`);
}

if (!fs.existsSync(path.join(rhacsRoot, "saved-filters", "index.html"))) {
  console.error(`RHACS UX prototypes not found at ${rhacsRoot} (expected saved-filters/index.html)`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(outDir), { recursive: true });
fs.cpSync(rhacsRoot, outDir, { recursive: true });

const savedFiltersOut = path.join(outDir, "saved-filters");
patchRhacsHidePrototypeSwitcher(savedFiltersOut);
patchRhacsAbsolutePaths(savedFiltersOut);
createRhacsDeepRouteIndex(savedFiltersOut);

console.log(`Embedded RHACS UX Prototypes static site → ${outDir} (RHACS base ${rhacsBase})`);
