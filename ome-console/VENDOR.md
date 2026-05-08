# Vendored copy

This tree is synced from **[github.com/itsptk/ome-console](https://github.com/itsptk/ome-console)** (OpenShift Management Engine console prototype).

- **`node_modules` is omitted** — the upstream repo currently tracks `node_modules` in git; we only keep source and config so this design repo stays small. Run `npm ci` here before `npm run dev` or `npm run build`.
- To refresh from upstream: clone or pull that repo separately and copy files (excluding `node_modules` and `.git`), or use `git remote` / subtree / submodule if you prefer a git link.
- Published preview (when Pages is enabled): [itsptk.github.io/ome-console/](https://itsptk.github.io/ome-console/)
- **Embedded in the prototype hub:** `hub/scripts/build-ome-embed.mjs` builds this app with `VITE_OME_HASH_ROUTER=true` and copies `dist/` to `hub/public/ome-console/` (see hub `prebuild`). Hash routing keeps deep links working on static hosts. The standalone marketing `TitlePage` landing was removed; entry is via hub cards (`/embed/ome/e2e` and `/embed/ome/day-one`). For full-console embeds, append a hash query to pre-select the header user switcher, e.g. `#/overview?persona=adi` or `?persona=sara` (IDs match `RootLayout` mock users).
