# Cleanup Checklist - Removing Old Structure

## What We're Removing

### Old Prototype Directories
- [x] `src/app/use-case-1/` → Migrated to `prototypes/fleet-admin-rbac/`
- [x] `src/app/use-case-2/` → Migrated to `prototypes/tenant-admin-access/`
- [x] `src/app/use-case-aaq/` → Migrated to `prototypes/virtualization-quotas/`
- [x] `src/app/use-case-cclm/` → Migrated to `prototypes/cross-cluster-migration/`
- [x] `src/app/use-case-operator-lifecycle/` → Migrated to `prototypes/operator-lifecycle/`
- [x] `src/app/use-case-empty-states/` → Migrated to `prototypes/acm-empty-states/`
- [x] `src/app/use-case-aaq-empty-states/` → Migrated to `prototypes/aaq-empty-states/`

### Files to Clean Up (References to Old System)
- [ ] `src/app/routes.tsx` - Remove old use-case routes
- [ ] `src/app/AppLayout/AppLayout.tsx` - Remove old use-case logic
- [ ] `src/app/contexts/UseCaseContext.tsx` - Deprecate or remove
- [ ] `src/app/utils/useCaseComponents.tsx` - Remove if exists

## Safety First

**Before deletion:**
- ✅ All 7 prototypes migrated
- ✅ New prototypes have config files
- ✅ Git status checked
- ✅ Ready to commit

**Backup plan:**
If something goes wrong: `git checkout -- .` to restore everything

## Deletion Steps

1. Delete old directories ✓
2. Update routes.tsx ⏳
3. Update AppLayout.tsx ⏳
4. Test everything ⏳
5. Commit changes ⏳

---

**Status:** In Progress

