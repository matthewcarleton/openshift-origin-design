# Migration Progress Tracker

## Overview

Migrating existing use-case-* prototypes to new modular architecture.

**Started:** November 6, 2024  
**Target Completion:** 2 weeks  
**Status:** In Progress

---

## Migration Checklist

### ✅ Prototype 1: use-case-1 → fleet-admin-rbac

**Status:** 🟡 In Progress

- [x] Create prototype directory structure
- [x] Create `prototype.config.ts`
- [x] Create `README.md`
- [x] Create `routes.tsx`
- [x] Copy all component files
  - [x] Clusters/
  - [x] Identities/
  - [x] Roles/
  - [x] RoleAssignment/
  - [x] Projects/
  - [x] Governance/
  - [x] IdentityProvider/
  - [x] navigation/
  - [x] data/
- [ ] Update import paths (if needed)
- [ ] Test in launcher
- [ ] Verify all routes work
- [ ] Verify all features work
- [ ] Commit to git
- [ ] Mark as complete

**Location:** `src/app/prototypes/fleet-admin-rbac/`

---

### ⏳ Prototype 2: use-case-2 → tenant-admin-access

**Status:** ⏸️ Not Started

- [ ] Create prototype directory structure
- [ ] Create `prototype.config.ts`
- [ ] Create `README.md`
- [ ] Create `routes.tsx`
- [ ] Copy all component files
- [ ] Update import paths
- [ ] Test in launcher
- [ ] Commit to git

**Location:** `src/app/prototypes/tenant-admin-access/`

---

### ⏳ Prototype 3: use-case-aaq → virtualization-quotas

**Status:** ⏸️ Not Started

**Owner:** Anna Walker

- [ ] Create prototype directory structure
- [ ] Create `prototype.config.ts`
- [ ] Create `README.md`
- [ ] Create `routes.tsx`
- [ ] Copy all component files
- [ ] Update import paths
- [ ] Test in launcher
- [ ] Commit to git

**Location:** `src/app/prototypes/virtualization-quotas/`

---

### ⏳ Prototype 4: use-case-cclm → cross-cluster-migration

**Status:** ⏸️ Not Started

- [ ] Create prototype directory structure
- [ ] Create `prototype.config.ts`
- [ ] Create `README.md`
- [ ] Create `routes.tsx`
- [ ] Copy all component files
- [ ] Update import paths
- [ ] Test in launcher
- [ ] Commit to git

**Location:** `src/app/prototypes/cross-cluster-migration/`

---

### ⏳ Prototype 5: use-case-operator-lifecycle → operator-lifecycle

**Status:** ⏸️ Not Started

**Owner:** Kevin Hatchoua

- [ ] Create prototype directory structure
- [ ] Create `prototype.config.ts`
- [ ] Create `README.md`
- [ ] Create `routes.tsx`
- [ ] Copy all component files
- [ ] Update import paths
- [ ] Test in launcher
- [ ] Commit to git

**Location:** `src/app/prototypes/operator-lifecycle/`

---

### ⏳ Prototype 6: use-case-empty-states → acm-empty-states

**Status:** ⏸️ Not Started

- [ ] Create prototype directory structure
- [ ] Create `prototype.config.ts`
- [ ] Create `README.md`
- [ ] Create `routes.tsx`
- [ ] Copy all component files
- [ ] Update import paths
- [ ] Test in launcher
- [ ] Commit to git

**Location:** `src/app/prototypes/acm-empty-states/`

---

### ⏳ Prototype 7: use-case-aaq-empty-states → aaq-empty-states

**Status:** ⏸️ Not Started

- [ ] Create prototype directory structure
- [ ] Create `prototype.config.ts`
- [ ] Create `README.md`
- [ ] Create `routes.tsx`
- [ ] Copy all component files
- [ ] Update import paths
- [ ] Test in launcher
- [ ] Commit to git

**Location:** `src/app/prototypes/aaq-empty-states/`

---

## Cleanup Tasks

**After ALL prototypes migrated:**

- [ ] Verify all prototypes work in launcher
- [ ] Update shared components
  - [ ] Move use-case-1/shared/* to src/app/shared/
  - [ ] Update imports in all prototypes
- [ ] Delete old directories
  - [ ] Delete src/app/use-case-1/
  - [ ] Delete src/app/use-case-2/
  - [ ] Delete src/app/use-case-aaq/
  - [ ] Delete src/app/use-case-cclm/
  - [ ] Delete src/app/use-case-operator-lifecycle/
  - [ ] Delete src/app/use-case-empty-states/
  - [ ] Delete src/app/use-case-aaq-empty-states/
- [ ] Update core files
  - [ ] Clean up routes.tsx (remove old routes)
  - [ ] Clean up AppLayout.tsx (remove old logic)
  - [ ] Update UseCaseContext.tsx (deprecate old types)
- [ ] Final testing
  - [ ] Test all prototypes
  - [ ] Test launcher
  - [ ] Test navigation
- [ ] Documentation update
  - [ ] Update README.md
  - [ ] Archive MIGRATION_PROGRESS.md

---

## Next Steps

### Immediate (Today):

1. **Test fleet-admin-rbac prototype:**
   ```bash
   npm run start:dev
   # Select "fleet-admin-rbac" from launcher
   # Test all routes and features
   ```

2. **If it works:**
   - Commit the migration
   - Move to next prototype

3. **If issues:**
   - Fix import paths
   - Debug and test again

### This Week:

- Complete prototypes 1-3
- Test thoroughly
- Commit each one

### Next Week:

- Complete prototypes 4-7
- Begin cleanup tasks
- Final testing

---

## Testing Checklist

For each migrated prototype, verify:

- [ ] Appears in prototype launcher
- [ ] Can select and load prototype
- [ ] All navigation items appear
- [ ] All routes load correctly
- [ ] All features function
- [ ] No console errors
- [ ] No broken imports
- [ ] Data loads correctly

---

## Common Issues & Solutions

### Issue: Import paths broken

**Symptom:** TypeScript errors, missing components

**Solution:** Update imports to use new path:
```typescript
// Before
import { Component } from '@app/use-case-1/...';

// After
import { Component } from './...';
```

### Issue: Shared components not found

**Symptom:** Can't find DetailPageLayout, etc.

**Solution:** These should be in `@app/shared`:
```typescript
import { DetailPageLayout } from '@app/shared/components/layouts';
```

### Issue: Prototype doesn't appear in launcher

**Symptom:** Don't see prototype in launcher

**Solution:** 
1. Check `prototype.config.ts` exists
2. Check `export const config = {...}`
3. Restart dev server
4. Check browser console for errors

### Issue: Routes don't work

**Symptom:** 404 or blank pages

**Solution:**
1. Check `routes.tsx` exports routes array
2. Verify all imports resolve
3. Check paths start with `/`

---

## Progress Summary

| Prototype | Status | Progress | Completion |
|-----------|--------|----------|------------|
| fleet-admin-rbac | 🟡 In Progress | Files copied | 70% |
| tenant-admin-access | ⏸️ Not Started | - | 0% |
| virtualization-quotas | ⏸️ Not Started | - | 0% |
| cross-cluster-migration | ⏸️ Not Started | - | 0% |
| operator-lifecycle | ⏸️ Not Started | - | 0% |
| acm-empty-states | ⏸️ Not Started | - | 0% |
| aaq-empty-states | ⏸️ Not Started | - | 0% |

**Overall Progress:** 10% complete (1/7 started)

---

## Notes

- Keep old `use-case-*` directories until ALL migrations complete and tested
- Test each prototype thoroughly before moving to next
- Commit after each successful migration
- Update this document as you progress

---

**Last Updated:** November 6, 2024

