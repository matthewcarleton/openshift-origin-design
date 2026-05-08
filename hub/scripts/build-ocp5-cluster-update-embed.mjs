import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hubRoot = path.join(__dirname, "..");
const prototypeRoot = path.join(hubRoot, "..", "ocp5-cluster-update-experience");
const outDir = path.join(hubRoot, "public", "ocp5-cluster-update-experience");
const VITE_BASE = "/ocp5-cluster-update-experience/";

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
console.log(`Embedded OCP 5 cluster update prototype → ${outDir}`);
