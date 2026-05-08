# Debugging Prototype Display

## Issue
Prototypes aren't showing in the "Active" tab despite being set to `status: 'active'`

## Quick Check

### 1. Open Browser Console
1. Go to http://localhost:3000
2. Press F12 (or right-click → Inspect)
3. Click the "Console" tab

### 2. Look for These Messages
You should see:
```
📦 Found X prototype configuration files
✅ Successfully registered prototype: fleet-admin-rbac
✅ Successfully registered prototype: tenant-admin-access
... (and 5 more)
```

### 3. Check the Active Tab Count
In the UI, you should see tabs like:
- All (8) - includes template
- Active (7) - your migrated prototypes
- Draft (1) - the template
- Archived (0)

## What Should Be in "Active" Tab

All 7 migrated prototypes:
1. ✅ fleet-admin-rbac
2. ✅ tenant-admin-access
3. ✅ virtualization-quotas
4. ✅ aaq-empty-states
5. ✅ cross-cluster-migration
6. ✅ acm-empty-states
7. ✅ operator-lifecycle

(The `_template` should be in "Draft" tab, not "Active")

## If You Don't See Them

### Possibility 1: Not Discovered
**Check console for errors** like:
- "⚠️ No config exported from..."
- "❌ Error loading prototype..."

**Solution**: Check that all `prototype.config.ts` files export a `config` object

### Possibility 2: Wrong Status Value
**Check if status is exactly** `'active'` (lowercase, as string)

**Run this check**:
```bash
grep "status:" src/app/prototypes/*/prototype.config.ts
```

All should show: `status: 'active',`

### Possibility 3: Type Mismatch
The PrototypeStatus type only allows: `'draft' | 'active' | 'paused' | 'archived'`

**Verify** all configs use one of these exact values

### Possibility 4: Filter is Stuck
**Try clicking** the "All" tab first, then the "Active" tab

**Or refresh** the page completely (Cmd+R or Ctrl+R)

## Manual Test

Run this in browser console when on http://localhost:3000:

```javascript
// This will show you what prototypes are loaded
console.log('Available prototypes:', window.__PROTOTYPE_REGISTRY__);
```

## Expected Behavior

When you click the "Active" tab:
- Should show 7 prototype cards
- Each card should have:
  - Prototype name
  - Description
  - Owner
  - Tags
  - "Launch" button

## If Still Not Working

1. **Clear browser cache** completely
2. **Restart dev server**:
   ```bash
   killall node
   npm run start:dev
   ```
3. **Check for JavaScript errors** in console
4. **Verify all files saved** correctly

## Quick Fix to Try

If prototypes still don't show, try adding debug logging:

Edit `src/app/core/PrototypeLauncher.tsx` around line 67:

```typescript
const filteredPrototypes = availablePrototypes.filter(prototype => {
  console.log('Filtering:', prototype.config.name, 'status:', prototype.config.status, 'activeTab:', activeTab);
  
  // Filter by status (tab)
  if (activeTab !== 'all' && prototype.config.status !== activeTab) {
    console.log('  ❌ Filtered out due to status');
    return false;
  }
  
  console.log('  ✅ Included');
  return true;
});
```

Then refresh and check the console to see what's happening.

---

**Let me know what you see in the browser console!** That will help us debug exactly what's happening.

