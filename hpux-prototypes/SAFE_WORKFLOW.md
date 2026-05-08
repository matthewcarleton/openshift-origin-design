# Safe Workflow for Prototype-Specific Changes

## Example: Changing "Explore quotas" Button Landing Page

## Branch Strategy Decision

**For small, isolated prototype changes:**
- ✅ **Work directly on `ux-prototypes` branch** (recommended)
- ✅ Safe because you're only modifying files in one prototype folder
- ✅ Simple: No branch switching needed
- ✅ Easy to revert if needed

**For larger changes or when you want review:**
- Create a feature branch: `git checkout -b anna-aaq/explore-quotas-landing`
- Make changes, test, then merge back to `ux-prototypes`

### Step 1: Verify Current State
```bash
# Check current branch
git branch --show-current  # Should be ux-prototypes

# Check for uncommitted changes
git status

# If you have uncommitted changes, commit or stash them first
git stash  # or git commit -am "WIP: current work"
```

### Step 2: Decide on Branch Strategy
```bash
# Option A: Work directly on ux-prototypes (RECOMMENDED for small changes)
# Just continue on current branch - no action needed

# Option B: Create a feature branch (for larger changes or review)
git checkout -b anna-aaq/explore-quotas-landing
```

### Step 3: Make Your Changes

**File to modify:** `src/app/prototypes/anna-aaq/virtualization-quotas/routes.tsx`

**Current state:**
- Root route (`/`) redirects to `/core/virtualization/quotas`
- This should already work, but let's verify

**What to change:**
- Ensure the root route redirects to `/core/virtualization/quotas` (Quotas page)
- This is already correct based on the routes file

**Alternative approach if needed:**
- Modify `PrototypeLauncher.tsx` to pass a specific route when loading the prototype
- But this is more complex and affects shared code

### Step 4: Test Locally
```bash
# Run type-check to ensure no TypeScript errors
npm run type-check

# Start the dev server
npm start

# Test the change:
# 1. Go to launcher page
# 2. Click "Explore quotas" button
# 3. Verify it lands on Quotas page in Core platforms perspective
# 4. Verify Virtualization navigation is expanded
# 5. Verify Quotas is selected/highlighted
```

### Step 5: Commit Your Changes
```bash
# Stage only the files you changed
git add src/app/prototypes/anna-aaq/virtualization-quotas/routes.tsx

# Commit with a clear message
git commit -m "Fix: Explore quotas button now lands directly on Quotas page

- Updated root route redirect in virtualization-quotas prototype
- Users now land directly on /core/virtualization/quotas
- No navigation required after clicking Explore quotas button"
```

### Step 6: Merge to ux-prototypes
```bash
# If you created a feature branch:
git checkout ux-prototypes
git merge anna-aaq/explore-quotas-landing

# Or if working directly on ux-prototypes:
# Your commit is already on ux-prototypes, you're done!
```

### Step 7: Push to Remote (When Ready)
```bash
git push origin ux-prototypes
```

## Safety Checklist

Before committing, verify:
- [ ] Only files in `src/app/prototypes/anna-aaq/` were modified
- [ ] No changes to shared code (`src/app/core/`, `src/app/AppLayout/`)
- [ ] Type-check passes: `npm run type-check`
- [ ] Dev server runs without errors: `npm start`
- [ ] Change works as expected in the browser
- [ ] Other prototypes still work (test at least one other prototype)

## What Makes This Safe?

1. **Isolated Changes**: Only modifying files within the `anna-aaq/virtualization-quotas/` folder
2. **No Shared Dependencies**: The routes.tsx file is prototype-specific
3. **Type Safety**: TypeScript will catch any errors before runtime
4. **Easy to Revert**: If something breaks, just revert the commit

## If Something Goes Wrong

```bash
# Revert the last commit
git revert HEAD

# Or reset to previous state (if you haven't pushed)
git reset --hard HEAD~1

# Or checkout the file from the previous commit
git checkout HEAD~1 -- src/app/prototypes/anna-aaq/virtualization-quotas/routes.tsx
```

