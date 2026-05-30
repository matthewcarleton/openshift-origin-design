# RHACS UX prototypes (vendored static site)

Static GitHub Pages–style bundles for **Red Hat Advanced Cluster Security (RHACS)** UX explorations. Originally published alongside a separate remote; the **canonical copy for the OpenShift UX Prototype Hub** now lives in this repository under `openshift-origin-design/rhacs-ux-prototypes/`.

- **Saved Filters v1** — `saved-filters/` (built app + MSW; paths under `/rhacs-ux-prototypes/saved-filters/`).
- **Catalog** — `catalog.html` (searchable gallery of prototypes).
- **Root** — `index.html` redirects into `saved-filters/`; optional link to the catalog.

## Hub embed

From `hub/`, `npm run build:rhacs` copies this tree to `hub/public/rhacs-ux-prototypes/` (gitignored build output). `npm run dev` serves it at `/rhacs-ux-prototypes/…` after a build.

The hub opens the prototype via **`/embed/rhacs-ux-prototypes?surface=baseline`** or **`?surface=saved-filters`** (iframe → deep link under `saved-filters/`).

## Refreshing assets

Replace files under `saved-filters/` (and `404.html` if needed) when a new static build is produced from the RHACS UI prototype toolchain. Re-run `npm run build:rhacs` from `hub/` before `npm run build` or Netlify publish.

`build-rhacs-embed.mjs` strips the in-app **prototype version dropdown** (Baseline vs Saved filters) from the main JS chunk after copy, so each hub card stays on its chosen variant. If the upstream bundle renames `VmPrototypeVersionSwitcher` or `LinkShim`, update the patch in that script.
