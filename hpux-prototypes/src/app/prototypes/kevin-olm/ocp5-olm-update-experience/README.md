# OCP 5.x — OLM update experience

Embedded PatternFly prototype for Operator Lifecycle Manager–driven update flows.

## Sync from GitHub

The canonical app lives at [github.com/kevinhatchoua/ocp5-olm-update-experience](https://github.com/kevinhatchoua/ocp5-olm-update-experience).

From `openshift-origin-design/hpux-prototypes/`, with SSH access to GitHub:

```bash
./scripts/sync-ocp5-olm-upstream.sh
```

This clones the repository into `upstream/` under this prototype directory. Adjust imports and replace or merge `pages/OlmUpdateExperiencePage.tsx` (and add routes) to match upstream navigation.

## Hub embed

`/embed/hpux-prototypes?prototype=ocp5-olm-update-experience`
