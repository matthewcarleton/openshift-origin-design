# Collaboration Guide for Designers

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/kuklas/HPUX-Prototypes.git
cd HPUX-Prototypes
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Your Feature Branch
```bash
git checkout ux-prototypes
git pull origin ux-prototypes
git checkout -b your-name-feature
```

**Branch naming by feature domain:**
- `stefan-rbac` - RBAC prototypes (fleet-admin-rbac, tenant-admin-access, acm-empty-states)
- `stefan-cclm` - Cross Cluster Migration prototype
- `anna-aaq` - AAQ prototypes (virtualization-quotas, aaq-empty-states)
- `kevin-operatorhub` - Operator Lifecycle prototype

### 4. Start Development Server
```bash
npm run start:dev
```

## Creating a New Prototype

### Use the Template Script
```bash
npm run create-prototype
# or
npm run create-draft
```

Follow the prompts to create your prototype.

### Manual Creation
1. Copy the template:
```bash
cp -r src/app/prototypes/_template src/app/prototypes/your-prototype-name
```

2. Edit `src/app/prototypes/your-prototype-name/prototype.config.ts`
3. Edit `src/app/prototypes/your-prototype-name/routes.tsx`
4. Add your pages in `src/app/prototypes/your-prototype-name/pages/`

## Daily Workflow

### Start of Day
```bash
git checkout ux-prototypes
git pull origin ux-prototypes
git checkout your-name-prototype
git merge ux-prototypes  # Get latest changes
```

### During Work
- **ONLY edit files in your prototype directories**: `src/app/prototypes/your-prototype-name/`
- You can work on multiple related prototypes in the same branch (e.g., all RBAC prototypes in `stefan-rbac`)
- Avoid modifying shared files unless absolutely necessary
- Test your prototype: `npm run start:dev`

### End of Day
```bash
# Add all your prototype changes
git add src/app/prototypes/your-prototype-name/
# Or add multiple related prototypes:
git add src/app/prototypes/fleet-admin-rbac/
git add src/app/prototypes/tenant-admin-access/
git add src/app/prototypes/acm-empty-states/

git commit -m "Add/update [feature name] prototypes"
git push origin your-name-feature
```

## Creating Versions

To create version 1.1 of an existing prototype:

1. Copy the prototype:
```bash
cp -r src/app/prototypes/original-name src/app/prototypes/original-name-v1.1
```

2. Update the config:
```typescript
// In prototype.config.ts
{
  id: 'original-name-v1.1',
  versionGroup: 'original-name',  // ⚠️ Must match original
  version: 'v1.1',
  // ... rest of config
}
```

3. Push - it will automatically appear as a version selector in the same card!

## Pull Request Workflow

1. Push your feature branch:
```bash
git push origin your-name-feature
# Examples:
# git push origin stefan-rbac
# git push origin anna-aaq
# git push origin kevin-operatorhub
```

2. Go to GitHub → Create Pull Request
3. Select: `your-name-feature` → `ux-prototypes`
4. Add description (e.g., "Add RBAC prototypes: fleet admin, tenant admin, and empty states")
5. Request review (optional)
6. Merge when approved
7. Delete branch after merge (GitHub will prompt you)

## Branch Strategy

**Feature-based branches (one branch per feature domain):**
- `stefan-rbac` - All RBAC-related prototypes
- `stefan-cclm` - Cross Cluster Migration prototype
- `anna-aaq` - All AAQ-related prototypes
- `kevin-operatorhub` - Operator Lifecycle prototype

**Benefits:**
- Related prototypes grouped together
- Easier to review and manage
- Clear ownership per feature area

## Important Rules

✅ **DO:**
- Work in your own prototype directories
- Group related prototypes in the same branch
- Pull before starting work
- Commit frequently
- Use descriptive commit messages

❌ **DON'T:**
- Modify other designers' prototypes
- Modify shared files without discussion
- Force push (`git push --force`)
- Commit directly to `ux-prototypes` (use your feature branch)

## Getting Help

- Check existing prototypes for examples
- Review `src/app/prototypes/_template/` for structure
- Ask in GitHub Issues or team chat

## Troubleshooting

**"Prototype not showing in launcher"**
- Make sure `prototype.config.ts` exists
- Check that `status` is not `'archived'`
- Restart dev server: `npm run start:dev`

**"Merge conflict"**
- Pull latest: `git pull origin ux-prototypes`
- Resolve conflicts in the file
- Commit: `git add . && git commit`

**"Can't push"**
- Make sure you're on your branch: `git branch`
- Pull first: `git pull origin ux-prototypes`
- Try again: `git push origin your-branch`

