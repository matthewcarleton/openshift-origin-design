# OpenShift Prototype Hub (HPUX)

Interactive prototype workspace for the **Hybrid Platforms UX (HPUX)** design team at Red Hat. Covers OpenShift Container Platform, Advanced Cluster Management (ACM), Advanced Cluster Security (ACS/RHACS), Observability, and related Hybrid Platforms products.

This is an **internal design and prototyping workspace**, not a customer-facing product repository.

## Product and team coverage

The **OpenShift Prototype Hub** (`hub/`) indexes prototypes by team and cross-cutting area. Teams in `hub/src/data/prototypes.manifest.json` include ACS, ACM, Virtualization, Core OpenShift, Sovereign Cloud, Migration Advisor, OME, Observability, and OCM. Cross-product groupings include RBAC, Upgrades, Agentic, and Install.

## Repository structure

```
openshift-origin-design/
├── hpux-prototypes/      # Primary React prototype app (Webpack, PatternFly)
├── hub/                  # Prototype hub launcher (Vite); reads prototypes.manifest.json
├── rhacs-ux-prototypes/  # RHACS static prototypes (vendored)
├── ome-console/          # OME Console prototype (Vite)
└── osac-demo/            # OSAC static demo
```

## Contributing a prototype

The fastest way to add a prototype is with **Cursor** and the built-in skill. No memorizing manifest fields or npm scripts.

1. **Clone the repo**
   ```bash
   git clone git@github.com:matthewcarleton/openshift-origin-design.git
   cd openshift-origin-design
   ```

2. **Open in Cursor** — `File → Open Folder`, select the `openshift-origin-design/` directory.

3. **Start the dev server**
   ```bash
   cd hub && npm run dev
   ```
   Opens the prototype hub at [http://localhost:5173](http://localhost:5173).

4. **Create your prototype** — in Cursor's chat panel, type:
   > I want to create a prototype

   Cursor will walk you through everything: product area, Jira ticket, persona, design notes, design doc link, and recording link.

The repo ships with a `prototype-contributor` skill at `.cursor/skills/prototype-contributor/` that loads automatically when you open this folder in Cursor. It handles branching, scaffolding, registering the prototype in the hub, and opening a pull request.
