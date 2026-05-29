# Vendoring / OpenShift UX hub embed

Upstream source of truth remains **[github.com/kuklas/HPUX-Prototypes](https://github.com/kuklas/HPUX-Prototypes)** (`ux-prototypes` branch). Standalone deploy for this vendored copy is **[matthewcarleton.github.io/openshift-origin-design/hpux-prototypes](https://matthewcarleton.github.io/openshift-origin-design/hpux-prototypes/)** (not kuklas Pages).

This copy lives under **`openshift-origin-design/hpux-prototypes/`** next to **`hub/`**.

## Hub integration

1. **`hub/scripts/build-hpux-prototypes-embed.mjs`** — `npm ci` + **`npm run build`** with **`ASSET_PATH`** set so Webpack **`publicPath`** and React Router **`basename`** match **`{hubBase}/hpux-prototypes/`** (see **`webpack.common.js`** + **`DefinePlugin`** for **`__ROUTER_BASENAME__`**).
2. Output is copied to **`hub/public/hpux-prototypes/`** — gitignored locally; rebuilt on **`npm run prebuild`**.

## Syncing changes from upstream

Merge or cherry-pick from `kuklas/HPUX-Prototypes` (`ux-prototypes`), resolve conflicts, then **`cd hub && npm run build:hpux`** (or **`npm run build`**) before shipping hub changes.

## Standalone deploy (outside the hub)

Standalone GitHub Pages: **`ASSET_PATH`** unset → production build uses **`/openshift-origin-design/hpux-prototypes/`** (see **`webpack.common.js`**). Hub embed builds set **`ASSET_PATH`** via **`hub/scripts/build-hpux-prototypes-embed.mjs`**.
