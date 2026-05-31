---
name: prototype-contributor
description: >-
  Guides designers through contributing to the OpenShift UX design repo (hub
  listings, manifests, hpux-prototypes embeds, MRs). When the user says
  "I need to add to the design repo", start by asking the intake questions
  below before editing files. Also use for "add a prototype", "register my
  prototype", "update the hub", "update the manifest", "set up my branch",
  "how do I contribute", "create a prototype", "new prototype for [product]",
  or "open an MR" for this repository.
---

# Prototype contributor

Help designers contribute to this design repository. **Prefer a short question-and-answer intake** so you know whether work is **new** or an **update** before you touch the tree.

## Intake: start here when they add to the design repo

When the user says **"I need to add to the design repo"** (or equivalent), **do not jump straight to edits.** Run through this intake, **one or a few questions at a time** so it stays conversational. Summarize answers before implementation.

### Step 0 — Branch sanity

Confirm they are on a branch (not `main`), or offer: `git checkout main && git pull && git checkout -b name/short-description` — see **Branch conventions** below.

### Step 1 — New or update?

Ask:

1. **Is this a brand-new listing/prototype in the hub, or an update to something already listed?**

### If **update existing**

Ask (skip what they already answered):

2. **Which entry?** — hub card title, `jiraKey`, team page, `prototypeUrl`, or path under `hpux-prototypes/`.
3. **What changes?** — hub manifest only (`prototypes.manifest.json`), prototype code/assets, embed URL, copy/metadata (title, persona, Jira link, design doc / recording URLs), or several of these.
4. **Jira** — does the ticket / fixVersion / workflow status need refreshing on the card? Run **`npm run sync:jira-manifest`** from `hub/` after manifest edits (needs `~/.jira-token`).

Then: locate the manifest entry (and code paths if any), apply edits, bump `updatedAt`, run checks from **Running locally** if relevant, draft commit + MR notes.

### If **brand new**

Ask (skip what they already answered):

2. **Product area** — pick from the table in **Product area → teamId mapping** below. This sets `teamId` in the manifest.
3. **Card title** — should match the linked Jira issue **`summary`** (hub cards mirror the ticket title).
4. **What they're shipping** — e.g. PatternFly prototype under `hpux-prototypes/` (embed link), static/site URL, OME/OSAC-style embed route, or **manifest-only** until hosted (`prototypeUrl: null`). If the answer is **hpux-prototypes**, continue to **hpux-prototypes scaffold flow** below.
5. **Jira ticket number** (e.g. `ACM-1234`) — run the Jira lookup in **Pulling Jira info** to auto-fill title, description, assignee, and status.
6. **Persona** — one line for the card (e.g. "Cluster admin", "SRE", "Developer"). Use **admin** not **administrator** per team wording norms.
7. **Design doc URL** (optional) — `designDocUrl`: link to the UX spec / problem statement (Confluence, Google Doc, in-repo doc, etc.).
8. **Recording URL** (optional) — `prototypeRecordingUrl`: link to a short walkthrough (Loom, Meet recording, Drive, YouTube, etc.).
9. **Author** — full name; **updatedAt** — `YYYY-MM-DD` for today or last meaningful change.

Then: add the `prototypes` entry (and register in hpux or wire URL/embed as needed), follow **Manifest structure** and repo layout, draft commit + MR.

### After intake

- Confirm **manifest path**: `hub/src/data/prototypes.manifest.json`.
- For **hpux** screens: `hpux-prototypes/` app + registry; embed pattern `/embed/hpux-prototypes?prototype=<id>` when relevant.
- Point to **Contributor guide** in the hub (`/contributing`) for long-form context.

---

## Product area → teamId mapping

Use this table to resolve the designer's product area choice to the correct `teamId` for the manifest and the correct section in the hub.

| Product area | `teamId` | Hub maintainer |
|---|---|---|
| ACS / RHACS | `acs` | Mansur Syed |
| ACM | `acm` | Joy Jean |
| Virtualization / CNV | `virtualization` | Yifat Menchik |
| Core OpenShift / OCP | `core-openshift` | Kevin Hatchoua |
| Sovereign Cloud / OSAC | `sovereign-cloud` | Ethan Kim |
| Migration Advisor | `migration-advisor` | Margot Menestrot |
| OME | `ome` | Joy Jean |
| Observability | `observability` | Shiri Mordechay Sofer |
| OCM | `ocm` | Peter Kreuser |
| RBAC (cross-product) | `rbac` | Štefan Kukla |
| Upgrades (cross-product) | `upgrades` | Kevin Hatchoua |
| Agentic (cross-product) | `agentic` | Peter Kreuser |
| Install (cross-product) | `install` | Peter Kreuser |

> Cross-product `teamId` values come from the `crossProducts` array in the manifest — they route to `/cross-product/<id>` in the hub, not a team page. If the right area isn't listed, flag it: a new `teams` entry + icon in `hub/src/iconImports.tsx` is needed — coordinate with Matt.

---

## Pulling Jira info

When the designer provides a Jira ticket number, run this to auto-fill title, description, assignee, and status:

```bash
source /Users/matthew/jira/scripts/jira-api.sh
jira_get_issue "ACM-1234" | python3 -c "
import json, sys
d = json.load(sys.stdin)
f = d['fields']
print('summary:', f.get('summary',''))
print('assignee:', (f.get('assignee') or {}).get('displayName',''))
print('status:', f['status']['name'])
desc = f.get('description') or {}
# ADF description → plain text (best-effort)
texts = []
for b in desc.get('content', []):
    for c in b.get('content', []):
        if c.get('type') == 'text':
            texts.append(c['text'])
print('description:', ' '.join(texts)[:300])
"
```

Map the returned `status` to `PrototypeStatus`:

| Jira status | prototype.config.ts status |
|---|---|
| To Do / New / Open | `draft` |
| In Progress | `in-progress` |
| In Review / Review | `in-review` |
| Done / Closed | `done` |
| Blocked / Paused | `paused` |

Use `summary` as the hub card `title` (and the `name` in `prototype.config.ts`). Use `assignee` for `owner.name` and the manifest `author` field. Use the cleaned `description` as the prototype's `description` field (trim to 2–3 sentences).

---

## hpux-prototypes scaffold flow

Use this when the designer confirms they are building a **React/PatternFly prototype** under `hpux-prototypes/`. Run after collecting all intake answers.

### 1. Collect remaining inputs (if not already answered)

Before scaffolding, ensure you have:

- **Prototype slug** (kebab-case, e.g. `anna-aaq-v2`) — validate: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- **Designer notes** — one paragraph: what this design explores, key decisions, open questions
- **First page to review** — path (e.g. `/observe/alerting`) + page name (e.g. "Alert List") + what to look for (optional)
- **Persona name + role** (e.g. name: "Alex", role: "Cluster Admin")
- **Tags** — 2–4 keywords (product area, pattern type, etc.)
- **Design doc URL** and **recording URL** (optional)

### 2. Run the scaffold script

From `hpux-prototypes/`:

```bash
npm run create-prototype <prototype-slug>
```

The script copies `_template/`, patches `prototype.config.ts` with the slug and today's date, and interactively prompts for design notes (you can answer on their behalf or skip — we'll patch directly in the next step).

### 3. Patch prototype.config.ts

After scaffolding, directly edit `hpux-prototypes/src/app/prototypes/<slug>/prototype.config.ts` with all collected values. The full shape is:

```typescript
export const config: PrototypeConfig = {
  id: '<slug>',
  name: '<Jira summary or designer-provided title>',
  description: '<2–3 sentence description from Jira or designer>',
  version: '1.0.0',
  status: 'in-progress',          // from Jira status mapping above
  owner: {
    name: '<assignee from Jira>',
    slack: '@<handle>',           // ask if not provided
    email: '<name>@redhat.com',   // ask if not provided
  },
  persona: {
    name: '<persona name>',       // e.g. "Alex"
    role: '<role>',               // e.g. "Cluster Admin"
  },
  perspectives: ['core-platforms'],
  tags: ['<tag1>', '<tag2>'],
  jiraUrl: 'https://redhat.atlassian.net/browse/<JIRA-KEY>',
  designDocUrl: '<design doc URL or omit>',
  recordingUrl: '<recording URL or omit>',
  createdAt: '<YYYY-MM-DD>',
  updatedAt: '<YYYY-MM-DD>',
  designNotes: {
    designerNotes: '<designer notes paragraph>',
    navigationGuide: [
      {
        page: '<page name>',
        path: '<route path>',
        notes: '<what to look for>',   // optional
      },
    ],
  },
};
```

> `perspectives` options: `'fleet-management'`, `'fleet-virtualization'`, `'core-platforms'`. Default to `'core-platforms'` unless the prototype is fleet-scoped.

### 4. Add to hub manifest

Append to the `prototypes` array in `hub/src/data/prototypes.manifest.json`:

```json
{
  "teamId": "<teamId from product area table>",
  "title": "<Jira summary>",
  "description": "<2–3 sentence description>",
  "persona": "<persona role>",
  "author": "<designer full name>",
  "updatedAt": "<YYYY-MM-DD>",
  "jiraKey": "<JIRA-KEY>",
  "jiraUrl": "https://redhat.atlassian.net/browse/<JIRA-KEY>",
  "prototypeUrl": "/embed/hpux-prototypes?prototype=<slug>",
  "designDocUrl": "<URL or omit field>",
  "prototypeRecordingUrl": "<URL or omit field>"
}
```

Do **not** add `jiraIssueStatus` or `jiraIssueRelease` manually — these are populated by `npm run sync:jira-manifest`.

### 5. Show summary

Tell the designer:
- Prototype folder: `hpux-prototypes/src/app/prototypes/<slug>/`
- What to finish: `owner.slack`, `owner.email`, pages under `/pages/`, routes in `routes.tsx`
- Preview locally: `npm start` from `hpux-prototypes/` → `http://localhost:3000`
- Hub preview: `npm run dev` from `hub/` → prototype appears under the correct team section
- Sync Jira status: `npm run sync:jira-manifest` from `hub/` (needs `~/.jira-token`)

---

## Repo orientation

This monorepo powers the **OpenShift UX Prototypes** hub (`hub/`). Listings are driven by:

```
hub/src/data/prototypes.manifest.json
```

PatternFly/console-style demos often live in **`hpux-prototypes/`** and are embedded from the hub. JTBD/research links for the home page live under `resourceLinks` in the same manifest.

Designers typically: work on a branch → change prototype and/or manifest → commit → open MR.

## Branch conventions

Create branches as: `name/short-description`

Examples:

- `joy/acm-cluster-overview`
- `ethan/sovereign-cloud-onboarding`
- `mansur/acs-vulnerability-dashboard`

Branch from default (usually `main`):

```bash
git checkout main && git pull
git checkout -b your-name/description
```

## Folder structure (high level)

- **`hub/`** — prototype hub site (Vite), manifest under `hub/src/data/`.
- **`hpux-prototypes/`** — shared PatternFly seed; prototypes under `src/app/prototypes/` with registry entries.

Group by feature or flow, not sprint folders.

## Running locally

From `hub/`:

```bash
npm ci          # first time or after dependency changes
npm run sync:jira-manifest   # pull Jira status + fix versions into the manifest (needs ~/.jira-token)
npm run dev     # local server with hot reload
npm run build   # production build → dist/
```

From `hpux-prototypes/` when editing embeds: use that package's README/scripts (webpack build is wired via hub `build:hpux` when needed).

## Manifest structure

Append to `prototypes` (and optionally `teams`). Example:

```json
{
  "teamId": "acs",
  "title": "[UX Spec] Show vulnerabilities by namespace view",
  "persona": "Security analyst",
  "author": "Mansur Syed",
  "updatedAt": "2026-04-28",
  "jiraKey": "ROX-22407",
  "jiraUrl": "https://redhat.atlassian.net/browse/ROX-22407",
  "prototypeUrl": null,
  "designDocUrl": "https://redhat.atlassian.net/wiki/spaces/...",
  "prototypeRecordingUrl": "https://www.loom.com/share/..."
}
```

**Common fields:** `teamId`, `title` (Jira summary), `author`, `updatedAt`, `jiraKey`, `jiraUrl` (browse URL for the same issue), `prototypeUrl`. Optional: `description`, `persona`, **`designDocUrl`** (UX / design doc), **`prototypeRecordingUrl`** (walkthrough or demo recording). Hub cards **always** show both slots; empty fields appear as "Not linked" until URLs are set. **Do not** add manual `status` / `release`; run **`npm run sync:jira-manifest`** to fill `jiraIssueStatus` and `jiraIssueRelease`. If `jiraKey` / `jiraUrl` are missing or invalid, the hub shows a **Jira ticket needed** warning on the card.

Valid **`teamId`** values come from the manifest `teams` array (`acs`, `acm`, `virtualization`, …) **or** a `crossProducts` `id` when the prototype belongs on a cross-lane listing (e.g. **`rbac`** for ACM RBAC fleet/tenant/empty-state builds). New product areas need a `teams` entry and icon from `hub/src/iconImports.tsx`; cross-lanes are already defined under `crossProducts` and use the hub route `/cross-product/<id>`.

## Fullscreen embed versions (hub top bar)

All hub **fullscreen** prototype tabs (`/embed/…`) show a **version control** on the right of the top bar, next to the back link. If only one build exists, the UI shows the text **Latest version** (read-only). If multiple builds exist, it is a dropdown.

### When you ship a new hpux-prototypes iteration (same feature, new registry folder)

1. Add or copy the prototype under `hpux-prototypes/src/app/prototypes/<id>/` and register it in the app registry (same as today).
2. In **`hub/src/App.tsx`**, find `HPUX_PROTOTYPE_VERSION_GROUPS`. Either:
   - **Add a row** to an existing group's `versions` array (put the newest first; label it with `(latest)`), or
   - **Create a new group** with `backTo`, `backLabel`, and `versions` if this is a new multi-build feature.
   - *Existing groups:* Observability alerting (`shiri-alerting-ui-v2` / `shiri-alerting-ui`) and RBAC cross-lane (`fleet-admin-rbac`, `fleet-admin-rbac-v1.1`, `tenant-admin-access`, `acm-empty-states`) — embed "back" goes to `/cross-product/rbac`. Extend those lists when you add siblings; don't duplicate the in-iframe toolbar (it was removed from `hpux-prototypes`).
3. Update **`hub/src/data/prototypes.manifest.json`**: one card per feature is preferred when versions are grouped — set `prototypeUrl` to `/embed/hpux-prototypes?prototype=<id>` using the **default (latest)** registry id, refresh title/description, bump `updatedAt`, adjust `jiraKey` / `jiraUrl` if needed, then run **`npm run sync:jira-manifest`**.
4. Run hub locally and confirm the embed: back link, dropdown labels, and iframe all match.

### Other embed families (not hpux-prototypes)

- **RHACS** (`/embed/rhacs-ux-prototypes`): surfaces are listed in `RHACS_EMBED_VERSION_OPTIONS` in `App.tsx`; add or reorder there if a new surface should appear in the dropdown.
- **OME** (`/embed/ome/:mode`): modes are in `OME_EMBED_VERSION_OPTIONS`.
- **Single-build embeds** (OCP5, list-filter, OSAC, …): no code change when there is still only one build — the bar already shows **Latest version**.

## Committing and pushing

```bash
git add .
git commit -m "Add vulnerability dashboard prototype for ACS"
git push -u origin your-name/description
```

Commit messages: short, state **what** changed.

## Opening a pull request

Coach them to include:

1. **What** — one sentence on what the design/prototype shows
2. **Why** — Jira or design question
3. **Screenshot or preview link** — so others can scan the PR without running everything locally

**Merge policy:** no required approvers — they can merge when ready (after CI passes if the pipeline is configured). Optionally @mention the area maintainer from manifest `teams` for a voluntary design pass.

## Quick reference — decision tree

- **Intake phrase** ("I need to add to the design repo") → run **Intake** questions first.
- **Share before merge** → push branch → GitHub Actions publishes hub preview to GitHub Pages (see workflow) + optional draft PR link.
- **New hpux prototype** → branch → intake → Jira lookup → scaffold → patch config → manifest entry → PR.
- **New manifest-only listing** → branch → intake → Jira lookup → manifest entry → PR.
- **Update existing** → branch → edit listed files + bump `updatedAt` → PR.
- **New team/area** → add `teams` entry, align `id`/`maintainer`, then prototypes.
- **Hosted outside repo** → deploy elsewhere, set `prototypeUrl` in manifest.

## Sharing a preview (no merge required)

Designers can share work **from their branch** without waiting for `main`:

1. **Push the branch to GitHub** — `git push -u origin …`.
2. **Hub preview URL (no local build, no Netlify)** — Repo workflow **Hub branch preview (GitHub Pages)** (`.github/workflows/hub-github-pages-preview.yml`) runs on push, builds `hub/` with the right `BASE_PATH`, and deploys to the `gh-pages` branch under `preview/<branch-slug>/`. Tell them to open **Actions → latest run → job summary** for the exact link. URL pattern: `https://<owner>.github.io/<repo>/preview/<slug>/` (slug = branch name, lowercased, sanitized). **Org setup:** GitHub Pages must be enabled on branch `gh-pages` / root (Settings → Pages) once per repo.
3. **Pull request** — Draft or normal PR from the branch for review threads and diffs; optional alongside the Pages preview.
4. **Screenshots / short recording** — For quick async feedback without a live site.

Merge to `main` only when they want the change in the shared default branch / production hub — not as a prerequisite for showing progress.

## When to ask for help

Git/CI/build issues: troubleshoot in Cursor. **Area ownership**, new `teamId`, or stakeholder approval: area lead or Matt Carleton.
