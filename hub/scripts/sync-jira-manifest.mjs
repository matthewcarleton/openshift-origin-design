#!/usr/bin/env node
/**
 * Pull Jira status + fixVersions into hub/src/data/prototypes.manifest.json
 * Auth: JIRA_EMAIL (default mcarleto@redhat.com) + ~/.jira-token (same as jira-api.sh)
 *
 * Usage: npm run sync:jira-manifest
 * Skip:  SKIP_JIRA_SYNC=1 npm run build  (leaves manifest unchanged)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, "..", "src", "data", "prototypes.manifest.json");
const JIRA_BASE = process.env.JIRA_BASE?.replace(/\/$/, "") || "https://redhat.atlassian.net/rest/api/3";
const ISSUE_KEY_RE = /^[A-Z][A-Z0-9_]+-\d+$/;

function parseIssueKey(entry) {
  const url = typeof entry.jiraUrl === "string" ? entry.jiraUrl.trim() : "";
  const browse = url.match(/\/browse\/([A-Za-z][A-Za-z0-9_]+-\d+)/);
  if (browse) return browse[1].toUpperCase();
  const k = typeof entry.jiraKey === "string" ? entry.jiraKey.trim() : "";
  if (ISSUE_KEY_RE.test(k)) return k;
  return null;
}

function authHeader() {
  const email = process.env.JIRA_EMAIL || "mcarleto@redhat.com";
  const tokenFile = process.env.JIRA_TOKEN_FILE || path.join(os.homedir(), ".jira-token");
  if (!fs.existsSync(tokenFile)) return null;
  const token = fs.readFileSync(tokenFile, "utf8").trim().replace(/\n/g, "");
  if (!token) return null;
  const b64 = Buffer.from(`${email}:${token}`, "utf8").toString("base64");
  return `Basic ${b64}`;
}

async function fetchIssueFields(key, authorization) {
  const u = new URL(`${JIRA_BASE}/issue/${encodeURIComponent(key)}`);
  u.searchParams.set("fields", "status,fixVersions");
  const res = await fetch(u, {
    headers: { Accept: "application/json", Authorization: authorization },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Jira ${key}: HTTP ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function releaseLabel(fixVersions) {
  if (!Array.isArray(fixVersions) || fixVersions.length === 0) return null;
  const names = fixVersions.map((v) => v?.name).filter(Boolean);
  if (names.length === 0) return null;
  return names.join(", ");
}

async function main() {
  if (process.env.SKIP_JIRA_SYNC === "1") {
    console.log("sync-jira-manifest: SKIP_JIRA_SYNC=1, skipping.");
    return;
  }
  const authorization = authHeader();
  if (!authorization) {
    console.warn(
      "sync-jira-manifest: No ~/.jira-token — manifest not updated. Set JIRA_TOKEN_FILE or add token file to sync from Jira.",
    );
    process.exit(0);
  }

  const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
  const data = JSON.parse(raw);

  for (const entry of data.prototypes) {
    delete entry.status;
    delete entry.release;
    const key = parseIssueKey(entry);
    if (!key) {
      delete entry.jiraIssueStatus;
      delete entry.jiraIssueRelease;
      continue;
    }
    try {
      const issue = await fetchIssueFields(key, authorization);
      const statusName = issue?.fields?.status?.name ?? null;
      const rel = releaseLabel(issue?.fields?.fixVersions);
      entry.jiraIssueStatus = statusName;
      entry.jiraIssueRelease = rel;
    } catch (e) {
      console.error(`sync-jira-manifest: ${key}:`, e.message);
      entry.jiraIssueStatus = null;
      entry.jiraIssueRelease = null;
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("sync-jira-manifest: updated", MANIFEST_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
