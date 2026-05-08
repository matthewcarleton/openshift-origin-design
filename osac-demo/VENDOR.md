# Vendored OSAC demo

Synced from the public **[github.com/heyethankim/osac-demo](https://github.com/heyethankim/osac-demo)** prototype (Red Hat OSAC / sovereign cloud buyer flows).

- **`node_modules`** and **`dist`** are not committed here — run **`npm ci`** in this folder before `npm run dev` or `npm run build`, or rely on **`hub/scripts/build-osac-embed.mjs`** (`npm run build:osac` from `hub/`).
- Published reference: [heyethankim.github.io/osac-demo/](https://heyethankim.github.io/osac-demo/)
- If your team keeps a **GitLab mirror**, refresh this tree from that remote the same way — the hub embed only needs this source + `npm run build`.

**Embedded in the prototype hub:** see `hub/scripts/build-osac-embed.mjs`; output is copied to `hub/public/osac-demo/`. The **four-tile role landing** in this app was removed — personas are listed as cards on the hub **Sovereign Cloud** team page; each embed link passes `?entry=…&tenant=…` into the iframe (except **Infra Admin**, which still opens the separate [enclave demo](https://heyethankim.github.io/enclave-demo/) in a new tab).
