# Vendoring / OpenShift UX hub embed

`hpux-prototypes/` is maintained in **[github.com/matthewcarleton/openshift-origin-design](https://github.com/matthewcarleton/openshift-origin-design)** alongside **`hub/`**. There is no separate upstream repository to sync from.

Standalone deploy: **[matthewcarleton.github.io/openshift-origin-design/hpux-prototypes](https://matthewcarleton.github.io/openshift-origin-design/hpux-prototypes/)**

## Hub integration

1. **`hub/scripts/build-hpux-prototypes-embed.mjs`** — `npm ci` + **`npm run build`** with **`ASSET_PATH`** set so Webpack **`publicPath`** and React Router **`basename`** match **`{hubBase}/hpux-prototypes/`** (see **`webpack.common.js`** + **`DefinePlugin`** for **`__ROUTER_BASENAME__`**).
2. Output is copied to **`hub/public/hpux-prototypes/`** — gitignored locally; rebuilt on **`npm run prebuild`**.

After changes under **`hpux-prototypes/`**, run **`cd hub && npm run build:hpux`** (or **`npm run build`**) before shipping hub changes.

## Standalone deploy (outside the hub)

Standalone GitHub Pages: **`ASSET_PATH`** unset → production build uses **`/openshift-origin-design/hpux-prototypes/`** (see **`webpack.common.js`**). Hub embed builds set **`ASSET_PATH`** via **`hub/scripts/build-hpux-prototypes-embed.mjs`**.
