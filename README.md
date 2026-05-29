# OpenShift Origin Design (HPUX mono-repo)

Mono-repo for the **Hybrid Platforms UX (HPUX)** design team at Red Hat. It holds design documentation, UX research, and interactive prototypes for OpenShift Container Platform, Advanced Cluster Management (ACM), Advanced Cluster Security (ACS/RHACS), Observability, and related Hybrid Platforms products.

This is an **internal design and prototyping workspace**, not a customer-facing product repository.

## Live sites

| Resource | URL |
|----------|-----|
| **Design documentation** (Jekyll) | [openshift.github.io/openshift-origin-design](https://openshift.github.io/openshift-origin-design/) |
| **Prototype hub** (`hub/`) | Branch previews via GitHub Actions: `https://<owner>.github.io/<repo>/preview/<branch-slug>/` (see [Hub branch preview workflow](.github/workflows/hub-github-pages-preview.yml); open the latest run's job summary for the exact link) |
| **HPUX Prototypes** (`hpux-prototypes/`) | [matthewcarleton.github.io/openshift-origin-design/hpux-prototypes](https://matthewcarleton.github.io/openshift-origin-design/hpux-prototypes/) (standalone GitHub Pages; also embedded in the hub) |

The Jekyll site uses `baseurl: /openshift-origin-design/` (see `_config.yml`). Prototype apps under this tree are excluded from the Jekyll build and ship separately.

## Product and team coverage

The **OpenShift Prototype Hub** (`hub/`) indexes prototypes by team and cross-cutting area. Teams in `hub/src/data/prototypes.manifest.json` include ACS, ACM, Virtualization, Core OpenShift, Sovereign Cloud, Migration Advisor, OME, Observability, and OCM. Cross-product groupings include RBAC, Upgrades, Agentic, and Install.

## Repository structure

```
openshift-origin-design/
├── designs/              # Design specs (administrator, developer, OCM, etc.)
├── conventions/          # UX conventions
├── research/             # User research artifacts
├── releases/             # Release-specific documentation
├── hpux-prototypes/      # Primary React prototype app (Webpack, PatternFly)
├── hub/                  # Prototype hub launcher (Vite); reads prototypes.manifest.json
├── rhacs-ux-prototypes/  # RHACS static prototypes (vendored)
├── ome-console/          # OME Console prototype (Vite)
└── osac-demo/            # OSAC static demo
```

## Contributing

### Design documentation

Edit Markdown under `designs/`, `conventions/`, or `research/`. The published site is built from the upstream [openshift/openshift-origin-design](https://github.com/openshift/openshift-origin-design) GitHub Pages configuration.

### New interactive prototype

1. Work in `hpux-prototypes/` (see `guides/` for architecture and setup).
2. Scaffold from the template: `npm run create-prototype` (runs `scripts/create-prototype.cjs`).
3. Follow branch and safety practices in [hpux-prototypes/SAFE_WORKFLOW.md](hpux-prototypes/SAFE_WORKFLOW.md).
4. Register the prototype in `hub/src/data/prototypes.manifest.json` so it appears on the hub (or ask a maintainer to add the entry).

**Private prototypes:** set `private: true` in the prototype's `prototype.config.ts` to hide it from the launcher and hub listing while keeping direct URL access. See `hpux-prototypes/src/app/prototypes/_template/prototype.config.ts` for the field.

**Hub embed & deploy:** `hpux-prototypes/` lives in this monorepo; see [hpux-prototypes/VENDOR.md](hpux-prototypes/VENDOR.md) for hub build paths and GitHub Pages deploy.

### Hub and embed builds

From `hub/`: `npm run dev` for local development; `npm run build` bundles vendored apps (`hpux-prototypes`, `rhacs-ux-prototypes`, `ome-console`, `osac-demo`, etc.) into `hub/dist/` for deploy.

There is no separate top-level CONTRIBUTORS file; contributor workflow lives in `hpux-prototypes/guides/` and the hub contributor copy in `hub/src/App.tsx`.

## Local development

**Jekyll design site** (from repo root):

```bash
bundle exec jekyll serve
```

**HPUX Prototypes** (from `hpux-prototypes/`):

```bash
npm start          # dev server
npm run type-check # before commit
```

**Hub** (from `hub/`):

```bash
npm run dev
```

## Reviewing design PRs

When reviewing pull requests with images, the [GitHub PR Image Inserter](https://andybraren.com/tools/gh-pr-image-inserter.html) utility makes inline image review easier.
