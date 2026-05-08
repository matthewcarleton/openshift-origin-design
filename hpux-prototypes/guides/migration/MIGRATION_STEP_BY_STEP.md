# Step-by-Step Migration Guide

## Current Status: Testing First Prototype

We've migrated `use-case-1` to `fleet-admin-rbac`. Now we need to test it.

---

## 🧪 Step 1: Test the Migrated Prototype

### Run the development server:

```bash
cd "/Users/skukla/Desktop/HPUX Prototypes"
npm run start:dev
```

### What should happen:

1. **Dev server starts** (might take 1-2 minutes first time)
2. **Browser opens** to `http://localhost:8080`
3. **Prototype Launcher appears**
4. **Look for "fleet-admin-rbac"** in the list

### ⚠️ Expected Issue:

The prototype **might NOT appear yet** because the `PrototypeRegistry` auto-discovery system needs to be initialized.

---

## 🔧 Step 2: Initialize the Registry

We need to integrate the prototype system into the app entry point.

### Check if this file exists:

```
src/app/core/AppShell.tsx
```

**If it DOESN'T exist**, we need to create it and update the main app entry.

### Current app structure uses:

- `src/app/index.tsx` - Main app component
- `src/app/routes.tsx` - Central routes
- `src/app/contexts/UseCaseContext.tsx` - Use case selector

---

## 🎯 Step 3: What You'll See

### Option A: If auto-discovery works

**In the launcher, you'll see:**
```
Active Prototypes:
- Fleet Admin RBAC: Tenant Delegation
  Owner: Stefan Kukla (@stefan)
  Status: Active
  [Click to launch]
```

### Option B: If you see this error

```
Error: Prototype registry not initialized
```

**Don't worry!** This means we need to integrate the new system with the existing app. See Step 4.

---

## 🔌 Step 4: Integration Options

We have two paths:

### Path A: Quick Test (Temporary)

Manually register the prototype for testing:

1. Open `src/app/core/PrototypeRegistry.ts`
2. Add manual registration at the end:

```typescript
// Temporary: Manual registration for testing
import { config as fleetAdminConfig } from '../prototypes/fleet-admin-rbac/prototype.config';
import { routes as fleetAdminRoutes } from '../prototypes/fleet-admin-rbac/routes';

prototypeRegistry.register({
  config: fleetAdminConfig,
  routes: fleetAdminRoutes
}, 'fleet-admin-rbac');
```

3. Restart dev server
4. Check launcher

### Path B: Full Integration (Recommended)

Integrate the new system alongside the existing one:

1. Update `src/index.tsx` to include `PrototypeProvider`
2. Add prototype launcher route
3. Keep existing use-case system running

---

## 📋 Testing Checklist

Once you can see and launch the prototype:

### Basic Tests:

- [ ] Prototype appears in launcher
- [ ] Can click and load prototype  
- [ ] Navigation sidebar appears
- [ ] Can see "Infrastructure > Clusters"
- [ ] Can see "User management > Identities"
- [ ] Can see "User management > Roles"

### Navigation Tests:

- [ ] Click "Clusters" → Clusters page loads
- [ ] Click a cluster → Detail page loads
- [ ] Click "Identities" → Identities page loads
- [ ] Click "Roles" → Roles page loads

### Feature Tests:

- [ ] Tables display data
- [ ] Buttons are clickable
- [ ] Wizards can open
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module" errors

**Symptom:** TypeScript/import errors in console

**Fix:** Update import paths in the migrated files:

```typescript
// If you see this error:
Cannot find module '@app/use-case-1/...'

// Find the file with the error
// Update the import to relative path:
import { Component } from './ComponentFolder/Component';
```

### Issue 2: Prototype doesn't appear

**Possible causes:**
1. `prototype.config.ts` not found
2. Config not exported correctly
3. Registry not initialized

**Fix:** Check the file exists and has:
```typescript
export const config: PrototypeConfig = { ... };
```

### Issue 3: Shared components missing

**Symptom:** `DetailPageLayout` or similar not found

**Fix:** The shared patterns need to be moved:

```bash
# Move shared components
cp -r src/app/use-case-1/shared/* src/app/shared/
```

Then update imports:
```typescript
import { DetailPageLayout } from '@app/shared/components/layouts';
```

### Issue 4: Routes lead to 404

**Symptom:** Clicking navigation shows blank page

**Fix:** 
1. Check `routes.tsx` exports the routes array
2. Verify all component imports resolve
3. Check paths match navigation items

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ See "Fleet Admin RBAC" in prototype launcher
2. ✅ Can click and launch it
3. ✅ See navigation sidebar with groups
4. ✅ Can navigate between pages
5. ✅ All features work as before
6. ✅ No console errors

---

## 📝 Once Working

### Commit the migration:

```bash
git add src/app/prototypes/fleet-admin-rbac
git commit -m "Migrate use-case-1 to fleet-admin-rbac prototype"
git push
```

### Update progress:

Edit `MIGRATION_PROGRESS.md`:
```markdown
### ✅ Prototype 1: use-case-1 → fleet-admin-rbac

**Status:** ✅ Complete

- [x] All tasks completed
- [x] Tested and working
- [x] Committed to git
```

### Move to next prototype!

Follow the same pattern for `use-case-2` → `tenant-admin-access`

---

## 🆘 Need Help?

If you're stuck:

1. **Check console errors** (F12 in browser)
2. **Check terminal output** (where dev server runs)
3. **Compare with template** (`_template` directory)
4. **Review this checklist** again

**Common questions:**

**Q: Do I delete use-case-1 now?**  
A: No! Keep it until ALL migrations are done and tested.

**Q: Should I test in the old launcher too?**  
A: Yes, use-case-1 should still work in old system during migration.

**Q: What if I need to roll back?**  
A: Just delete `src/app/prototypes/fleet-admin-rbac/` and you're back to original state.

---

## 🎯 Next Steps

1. **Test fleet-admin-rbac** (Steps above)
2. **If working:** Commit and move to prototype 2
3. **If not working:** Debug using troubleshooting section
4. **Repeat** for remaining 6 prototypes

---

**You're doing great! Let me know what you see when you run the dev server.** 🚀

