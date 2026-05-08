import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const rhacsRoot = path.join(hubRoot, "..", "rhacs-ux-prototypes");
const outDir = path.join(hubRoot, "public", "rhacs-ux-prototypes");

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

if (!fs.existsSync(path.join(rhacsRoot, "saved-filters", "index.html"))) {
  console.error(`RHACS UX prototypes not found at ${rhacsRoot} (expected saved-filters/index.html)`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.dirname(outDir), { recursive: true });
fs.cpSync(rhacsRoot, outDir, { recursive: true });
patchRhacsHidePrototypeSwitcher(path.join(outDir, "saved-filters"));
console.log(`Embedded RHACS UX Prototypes static site → ${outDir}`);
