/**
 * Scan hpux-prototypes prototype.config.* files for `private: true` and write ids for hub listing filters.
 * Run before hub dev/build (and from build-hpux-prototypes-embed.mjs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const hpuxPrototypesDir = path.join(hubRoot, "..", "hpux-prototypes", "src", "app", "prototypes");
const outPath = path.join(hubRoot, "src", "data", "hpux-private-prototype-ids.json");

const CONFIG_RE = /prototype\.config\.(ts|tsx|js)$/;
const ID_RE = /\bid:\s*['"]([^'"]+)['"]/;

/** Active `private: true` only — ignore `// private: true` template hints. */
function hasActivePrivateFlag(content) {
  return content
    .split("\n")
    .some((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return false;
      return /\bprivate:\s*true\b/.test(line);
    });
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, files);
    else if (CONFIG_RE.test(name.name)) files.push(full);
  }
  return files;
}

const privateIds = [];
for (const file of walk(hpuxPrototypesDir)) {
  const content = fs.readFileSync(file, "utf8");
  if (!hasActivePrivateFlag(content)) continue;
  const idMatch = content.match(ID_RE);
  if (!idMatch) {
    console.warn(`discover-hpux-private-prototypes: private: true but no id in ${file}`);
    continue;
  }
  privateIds.push(idMatch[1]);
}

privateIds.sort();
const payload = { ids: privateIds, generatedAt: new Date().toISOString() };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(
  `discover-hpux-private-prototypes: ${privateIds.length} private id(s) → ${path.relative(hubRoot, outPath)}`,
);
