---
name: prototype-contributor
description: >-
  Guides designers through contributing to the OpenShift UX design repo (hub
  listings, manifests, hpux-prototypes embeds, MRs). When the user says
  "I need to add to the design repo", start by asking the intake questions
  below before editing files. Also use for "add a prototype", "register my
  prototype", "update the hub", "update the manifest", "set up my branch",
  "how do I contribute", or "open an MR" for this repository.
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

2. **Product area** — which UX lane? (`teamId` must match an `id` in `teams` *or* `crossProducts` in the manifest, e.g. `rbac` for RBAC cross-lane listings; if missing, flag that a team or cross-product block may be needed first — coordinate maintainer / Matt per **When to ask for help**.)
3. **Card title** — should match the linked Jira issue **`summary`** (hub cards mirror the ticket title).
4. **What they’re shipping** — e.g. PatternFly prototype under `hpux-prototypes/` (embed link), static/site URL, OME/OSAC-style embed route, or **manifest-only** until hosted (`prototypeUrl: null`).
5. **Jira** — real issue key and `https://redhat.atlassian.net/browse/…` or `https://issues.redhat.com/browse/…` (avoid using registry slugs as `jiraKey` when a real ticket exists).
6. **Persona** (optional) — one line for the card; use **admin** not **administrator** per team wording norms.
7. **Design doc** (optional) — `designDocUrl`: link to the UX spec / problem statement (Confluence, Google Doc, in-repo doc, etc.).
8. **Recording** (optional) — `prototypeRecordingUrl`: link to a short walkthrough (Loom, Meet recording, Drive, etc.).
9. **Author** — full name; **updatedAt** — `YYYY-MM-DD` for today or last meaningful change.

Then: add the `prototypes` entry (and register in hpux or wire URL/embed as needed), follow **Manifest structure** and repo layout, draft commit + MR.

### After intake

- Confirm **manifest path**: `hub/src/data/prototypes.manifest.json`.
- For **hpux** screens: `hpux-prototypes/` app + registry; embed pattern `/embed/hpux-prototypes?prototype=<id>` when relevant.
- Point to **Contributor guide** in the hub (`/contributing`) for long-form context.

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

From `hpux-prototypes/` when editing embeds: use that package’s README/scripts (webpack build is wired via hub `build:hpux` when needed).

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

**Common fields:** `teamId`, `title` (Jira summary), `author`, `updatedAt`, `jiraKey`, `jiraUrl` (browse URL for the same issue), `prototypeUrl`. Optional: `description`, `persona`, **`designDocUrl`** (UX / design doc), **`prototypeRecordingUrl`** (walkthrough or demo recording). Hub cards **always** show both slots; empty fields appear as “Not linked” until URLs are set. **Do not** add manual `status` / `release`; run **`npm run sync:jira-manifest`** to fill `jiraIssueStatus` and `jiraIssueRelease`. If `jiraKey` / `jiraUrl` are missing or invalid, the hub shows a **Jira ticket needed** warning on the card.

Valid **`teamId`** values come from the manifest `teams` array (`acs`, `acm`, `virtualization`, …) **or** a `crossProducts` `id` when the prototype belongs on a cross-lane listing (e.g. **`rbac`** for ACM RBAC fleet/tenant/empty-state builds). New product areas need a `teams` entry and icon from `hub/src/iconImports.tsx`; cross-lanes are already defined under `crossProducts` and use the hub route `/cross-product/<id>`.

## Fullscreen embed versions (hub top bar)

All hub **fullscreen** prototype tabs (`/embed/…`) show a **version control** on the right of the top bar, next to the back link. If only one build exists, the UI shows the text **Latest version** (read-only). If multiple builds exist, it is a dropdown.

### When you ship a new hpux-prototypes iteration (same feature, new registry folder)

1. Add or copy the prototype under `hpux-prototypes/src/app/prototypes/<id>/` and register it in the app registry (same as today).
2. In **`hub/src/App.tsx`**, find `HPUX_PROTOTYPE_VERSION_GROUPS`. Either:
   - **Add a row** to an existing group’s `versions` array (put the newest first; label it with `(latest)`), or
   - **Create a new group** with `backTo`, `backLabel`, and `versions` if this is a new multi-build feature.
   - *Existing groups:* Observability alerting (`shiri-alerting-ui-v2` / `shiri-alerting-ui`) and RBAC cross-lane (`fleet-admin-rbac`, `fleet-admin-rbac-v1.1`, `tenant-admin-access`, `acm-empty-states`) — embed “back” goes to `/cross-product/rbac`. Extend those lists when you add siblings; don’t duplicate the in-iframe toolbar (it was removed from `hpux-prototypes`).
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

- **Intake phrase** (“I need to add to the design repo”) → run **Intake** questions first.
- **Share before merge** → push branch → GitHub Actions publishes hub preview to GitHub Pages (see workflow) + optional draft PR link.
- **New prototype** → branch → implement/register → manifest entry → PR.
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
