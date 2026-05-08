# Prototype Development Workflow

## Overview
This repository uses feature-based folders that match remote branch names. Each feature folder contains isolated prototypes that don't depend on shared components.

## Folder Structure
```
src/app/prototypes/
  ├── _template/          # Template for new prototypes
  ├── anna-aaq/          # Anna's AAQ prototypes
  ├── stefan-rbac/       # Stefan's RBAC prototypes
  ├── stefan-cclm/       # Stefan's CCLM prototype
  └── kevin-operatorhub/ # Kevin's OperatorHub prototype
```

## Making Changes to a Specific Prototype

### ✅ Safe Changes (Won't Break Structure)

**1. Changes within a prototype's own folder:**
- ✅ Modify components within `src/app/prototypes/{feature}/{prototype-name}/`
- ✅ Update routes in `src/app/prototypes/{feature}/{prototype-name}/routes.tsx`
- ✅ Update config in `src/app/prototypes/{feature}/{prototype-name}/prototype.config.ts`
- ✅ Add new components/pages within the prototype folder
- ✅ Modify shared components that were copied to the prototype (e.g., `FleetVirtualization/`, `shared-virtual-machines/`)

**Example:**
```bash
# Working on fleet-admin-rbac prototype
cd src/app/prototypes/stefan-rbac/fleet-admin-rbac/
# Make changes to Clusters/Clusters.tsx, routes.tsx, etc.
```

**2. Changes to shared infrastructure (use with caution):**
- ⚠️ `src/app/core/` - Core prototype system (PrototypeLayout, PrototypeRegistry, etc.)
- ⚠️ `src/app/AppLayout/AppLayout.tsx` - Main layout (affects all prototypes)
- ⚠️ `src/app/data/` - Mock databases (shared across all prototypes)
- ⚠️ `src/app/shared/` - Shared utilities and contexts

### ❌ Avoid These Changes

**1. Don't modify other prototypes:**
- ❌ Don't edit files in other feature folders
- ❌ Don't create dependencies between prototypes

**2. Don't modify root-level components:**
- ❌ Don't create new folders in `src/app/` (outside of `prototypes/`)
- ❌ Don't modify `src/app/routes.tsx` (it's deprecated, prototypes handle their own routes)

## Workflow Steps

### 1. Making Changes to Your Prototype

```bash
# 1. Ensure you're on the correct branch
git checkout ux-prototypes  # or your feature branch

# 2. Make changes within your prototype folder
# Example: src/app/prototypes/stefan-rbac/fleet-admin-rbac/

# 3. Test your changes
npm run type-check
npm start

# 4. Commit changes
git add src/app/prototypes/stefan-rbac/fleet-admin-rbac/
git commit -m "Update fleet-admin-rbac: [description]"
```

### 2. Adding a New Prototype

```bash
# 1. Copy the template
cp -r src/app/prototypes/_template src/app/prototypes/{feature}/{new-prototype-name}

# 2. Update prototype.config.ts with your prototype details
# 3. Create routes.tsx with your routes
# 4. Add components as needed

# 5. Test
npm run type-check
npm start

# 6. Commit
git add src/app/prototypes/{feature}/{new-prototype-name}/
git commit -m "Add new prototype: {new-prototype-name}"
```

### 3. Making Changes to Shared Infrastructure

**⚠️ Warning: These changes affect ALL prototypes**

```bash
# 1. Test thoroughly before committing
npm run type-check
npm start

# 2. Test multiple prototypes to ensure nothing broke
# 3. Commit with clear message about impact

git add src/app/core/ src/app/AppLayout/
git commit -m "Update shared infrastructure: [description]

Affects all prototypes. Tested with [list prototypes tested]."
```

## Branch Strategy

### Remote Branches (Feature-Based)
- `anna-aaq` - Anna's AAQ work
- `stefan-rbac` - Stefan's RBAC work
- `stefan-cclm` - Stefan's CCLM work
- `kevin-operatorhub` - Kevin's OperatorHub work
- `ux-prototypes` - Main branch (all prototypes merged)

### Local Workflow

```bash
# Option 1: Work directly on ux-prototypes (for quick changes)
git checkout ux-prototypes
# Make changes, commit, push

# Option 2: Work on feature branch (for larger changes)
git checkout -b stefan-rbac-feature-name
# Make changes, commit
git push origin stefan-rbac-feature-name
# Create PR to merge into ux-prototypes
```

## Best Practices

1. **Isolation First**: Always work within your prototype's folder
2. **Test Before Committing**: Run `npm run type-check` and `npm start`
3. **Clear Commit Messages**: Describe what changed and why
4. **Don't Break Others**: If modifying shared code, test multiple prototypes
5. **Use Feature Branches**: For larger changes, create a feature branch

## Troubleshooting

### TypeScript Errors After Changes
```bash
# Clear cache and re-check
rm -rf node_modules/.cache
npm run type-check
```

### Prototype Not Showing Up
- Check `prototype.config.ts` exists and is valid
- Verify `routes.tsx` exports routes correctly
- Check browser console for errors

### Import Errors
- Use relative paths within prototype: `./Component/Component`
- Use absolute paths for shared data: `@app/data/queries`
- Don't import from other prototypes

## Questions?

If you're unsure whether a change is safe:
1. Check if it's within your prototype folder → ✅ Safe
2. Check if it affects `src/app/core/` or `AppLayout.tsx` → ⚠️ Test thoroughly
3. Check if it affects other prototypes → ❌ Don't do it

