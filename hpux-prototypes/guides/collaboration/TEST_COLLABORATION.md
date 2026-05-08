# Testing Collaboration Workflow

## Test Scenario: Simulate Multiple Designers Working

### Test 1: Stefan Works on RBAC Branch

```bash
# 1. Switch to Stefan's RBAC branch
git checkout stefan-rbac

# 2. Make a test change (simulate Stefan's work)
# Edit a file in one of Stefan's prototypes
# For example, add a comment to fleet-admin-rbac prototype.config.ts

# 3. Commit the change
git add src/app/prototypes/fleet-admin-rbac/prototype.config.ts
git commit -m "Test: Stefan updates RBAC prototype"

# 4. Push to Stefan's branch
git push origin stefan-rbac

# 5. Verify on GitHub
# Go to: https://github.com/kuklas/HPUX-Prototypes/tree/stefan-rbac
# You should see the change only on stefan-rbac branch
```

### Test 2: Anna Works on AAQ Branch (Simulate in Different Directory)

**Option A: Clone in Different Location (Best Test)**
```bash
# 1. Go to a different directory
cd ~/Desktop
git clone https://github.com/kuklas/HPUX-Prototypes.git HPUX-Prototypes-Test
cd HPUX-Prototypes-Test

# 2. Install dependencies
npm install

# 3. Switch to Anna's branch
git checkout anna-aaq

# 4. Make a test change
# Edit src/app/prototypes/virtualization-quotas/prototype.config.ts
# Add a comment or change description

# 5. Commit and push
git add src/app/prototypes/virtualization-quotas/prototype.config.ts
git commit -m "Test: Anna updates AAQ prototype"
git push origin anna-aaq

# 6. Verify: Check that ux-prototypes branch doesn't have this change
git checkout ux-prototypes
# The change should NOT be here
```

### Test 3: Merge Stefan's Work to Main

```bash
# 1. Go back to main repo
cd ~/Desktop/HPUX\ Prototypes

# 2. Switch to main branch
git checkout ux-prototypes
git pull origin ux-prototypes

# 3. Merge Stefan's branch (simulate PR merge)
git merge stefan-rbac --no-ff -m "Merge stefan-rbac: Add RBAC updates"

# 4. Push to main
git push origin ux-prototypes

# 5. Verify: All prototypes should still work
npm run start:dev
# Check launcher - all prototypes should be visible
```

### Test 4: Test Conflict Resolution

```bash
# 1. On stefan-rbac branch, modify a shared file
git checkout stefan-rbac
# Edit src/app/core/PrototypeLauncher.tsx (add a comment)

# 2. Commit
git add src/app/core/PrototypeLauncher.tsx
git commit -m "Stefan: Update launcher"
git push origin stefan-rbac

# 3. On anna-aaq branch, modify the same file
git checkout anna-aaq
# Edit src/app/core/PrototypeLauncher.tsx (add different comment)

# 4. Commit
git add src/app/core/PrototypeLauncher.tsx
git commit -m "Anna: Update launcher"
git push origin anna-aaq

# 5. Try to merge both (simulate conflict)
git checkout ux-prototypes
git merge stefan-rbac
git merge anna-aaq
# You'll get a conflict - resolve it, then commit
```

### Test 5: Verify Prototype Isolation

```bash
# 1. On stefan-rbac branch
git checkout stefan-rbac

# 2. Create a new test prototype
npm run create-prototype
# Name: test-rbac-feature

# 3. Commit only this prototype
git add src/app/prototypes/test-rbac-feature/
git commit -m "Add test RBAC feature prototype"
git push origin stefan-rbac

# 4. Switch to anna-aaq branch
git checkout anna-aaq

# 5. Verify: test-rbac-feature should NOT exist here
ls src/app/prototypes/ | grep test-rbac
# Should return nothing (or error)

# 6. Switch to ux-prototypes
git checkout ux-prototypes

# 7. Verify: test-rbac-feature should NOT exist here either
ls src/app/prototypes/ | grep test-rbac
# Should return nothing

# 8. Only after merging stefan-rbac will it appear
git merge stefan-rbac
ls src/app/prototypes/ | grep test-rbac
# Now it should exist
```

## Quick Test Checklist

- [ ] Create branches: `stefan-rbac`, `anna-aaq`, `kevin-operatorhub`
- [ ] Make changes on `stefan-rbac` branch
- [ ] Verify changes don't appear on `ux-prototypes`
- [ ] Merge `stefan-rbac` to `ux-prototypes`
- [ ] Verify changes now appear on `ux-prototypes`
- [ ] Test prototype isolation (changes in one branch don't affect others)
- [ ] Test conflict resolution (two people modify same shared file)

## Expected Results

✅ **Prototypes are isolated** - Changes in one branch don't affect others  
✅ **Merging works** - Changes appear in main branch after merge  
✅ **No conflicts for prototypes** - Each prototype in its own directory  
✅ **Conflicts only for shared files** - Easy to resolve

