# Modular Prototype Architecture - Summary

## The Problem

You have a growing prototype codebase where:
- Multiple developers work on different prototypes
- Everyone modifies the same large files (`routes.tsx`, `AppLayout.tsx`)
- Git conflicts are common
- Hard to know what's owned by whom
- Difficult to reuse components across prototypes
- No clear way to archive completed research

**Bottom line:** Collaboration is difficult and stepping on toes is inevitable.

## The Solution

A **plugin-based modular architecture** where:
- Each prototype is 100% isolated in its own directory
- Prototypes self-register automatically (no core changes needed)
- Shared components live in a centralized library
- Clear ownership and lifecycle management
- Work in parallel without conflicts

**Bottom line:** Work independently, share smartly.

## How It Works (5-Second Version)

1. **Create a prototype directory** with a config file
2. **Build your prototype** using shared components
3. **Prototype auto-registers** and appears in launcher
4. **Select it from the launcher** to test
5. **Archive it when done** (stays available for reference)

That's it. No need to modify core application files.

## Key Concepts

### 1. Prototypes are Plugins

Each prototype is a self-contained module:
```
prototypes/my-prototype/
├─ prototype.config.ts    # Manifest (required)
├─ README.md              # Documentation
├─ routes.tsx             # Routes
├─ pages/                 # Pages
├─ components/            # Components
└─ data/                  # Mock data
```

The config file tells the system everything about your prototype:
- Who owns it
- What it's for
- What persona it uses
- What routes it has
- What status it's in

### 2. Automatic Discovery

On app startup:
1. System scans `prototypes/` directory
2. Finds all `prototype.config.ts` files
3. Registers each prototype automatically
4. Shows them in the launcher

**You never modify core application code.**

### 3. Shared Component Library

Common components live in `shared/`:
```
shared/
├─ components/
│  ├─ layouts/
│  ├─ tables/
│  ├─ forms/
│  └─ wizards/
├─ hooks/
├─ utils/
└─ types/
```

Import them in your prototype:
```typescript
import { TableLayout } from '@app/shared/components/layouts';
import { BaseWizard } from '@app/shared/components/wizards';
```

### 4. Clear Ownership

Each prototype has metadata:
```typescript
owner: {
  name: 'Stefan Kukla',
  slack: '@stefan',
  email: 'skukla@redhat.com'
}
```

Know exactly who to contact about any prototype.

### 5. Lifecycle Management

Prototypes have a status:
- **draft** - Work in progress
- **active** - Ready for testing
- **paused** - On hold
- **archived** - Research complete

Filter prototypes in the launcher by status.

## Benefits

### For Developers

✅ **No Conflicts**
- Work in your own directory
- Push changes anytime
- No merge conflicts

✅ **Fast Setup**
- Copy template directory
- Update config
- Start building

✅ **Reuse Components**
- Import from shared library
- Don't reinvent the wheel
- Focus on what's unique

✅ **Easy Testing**
- Run dev server
- Select your prototype
- Test immediately

### For Teams

✅ **Parallel Development**
- Multiple prototypes in flight
- No blocking each other
- Everyone moves fast

✅ **Clear Ownership**
- See who owns what
- Know who to ask
- Easy handoffs

✅ **Knowledge Sharing**
- Shared components benefit everyone
- Learn from others' prototypes
- Build institutional knowledge

✅ **Easy Discovery**
- All prototypes in one launcher
- Filter by status, tags, owner
- Find relevant work quickly

### For Research

✅ **Isolated Testing**
- Each prototype is independent
- No cross-contamination
- Clean test environment

✅ **Version Control**
- Track prototype evolution
- See what changed when
- Reproduce past research

✅ **Documentation**
- Built-in metadata
- README for each prototype
- Track research findings

## File Structure

```
HPUX Prototypes/
│
├─ src/app/
│  │
│  ├─ core/                      ← Core system (rarely changes)
│  │  ├─ types.ts
│  │  ├─ PrototypeRegistry.ts
│  │  ├─ PrototypeContext.tsx
│  │  └─ PrototypeLauncher.tsx
│  │
│  ├─ shared/                    ← Shared components (coordinate changes)
│  │  ├─ components/
│  │  ├─ hooks/
│  │  └─ utils/
│  │
│  └─ prototypes/                ← All prototypes (isolated)
│     ├─ _template/              ← Copy this to start new prototype
│     ├─ fleet-admin-rbac/       ← Stefan's prototype
│     ├─ virtualization-quotas/  ← Anna's prototype
│     └─ operator-lifecycle/     ← Kevin's prototype
│
├─ PROTOTYPE_ARCHITECTURE.md     ← Full architecture docs
├─ MIGRATION_GUIDE.md            ← How to migrate
├─ QUICK_START.md                ← Getting started
├─ ARCHITECTURE_DIAGRAM.md       ← Visual diagrams
└─ SUMMARY.md                    ← This file
```

## Workflow

### Creating a New Prototype

```bash
# 1. Copy template
cp -r src/app/prototypes/_template src/app/prototypes/my-prototype

# 2. Edit config
vim src/app/prototypes/my-prototype/prototype.config.ts

# 3. Start building
# ... create pages, components, routes ...

# 4. Test
npm run start:dev
# Select your prototype from launcher

# 5. Push when ready
git add src/app/prototypes/my-prototype
git commit -m "Add my prototype"
git push
```

### Using Shared Components

```typescript
// Import from shared library
import { DetailPageLayout } from '@app/shared/components/layouts';
import { useFilter } from '@app/shared/hooks';

// Use in your prototype
<DetailPageLayout title="My Page">
  {/* Your content */}
</DetailPageLayout>
```

### Contributing a Shared Component

```bash
# 1. Create feature branch
git checkout -b shared/my-name/awesome-component

# 2. Add component to shared/
# ... create component ...

# 3. Open PR for review
git push origin shared/my-name/awesome-component

# 4. After approval, others can use it
```

## Git Strategy

**Your prototype = Your rules**
```bash
git checkout -b prototypes/stefan/my-prototype
# Work freely, merge when ready
```

**Shared components = Team review**
```bash
git checkout -b shared/stefan/new-component
# Open PR, get review, then merge
```

**Core infrastructure = Coordination**
```bash
# Discuss with team lead before changing
```

## Migration Path

Migrating existing `use-case-*` directories:

1. **Phase 1:** Setup core infrastructure ✅ (DONE)
2. **Phase 2:** Migrate one prototype (pilot)
3. **Phase 3:** Migrate remaining prototypes
4. **Phase 4:** Clean up old code

See `MIGRATION_GUIDE.md` for detailed steps.

## Documentation

| Document | Purpose |
|----------|---------|
| `SUMMARY.md` | Quick overview (this file) |
| `PROTOTYPE_ARCHITECTURE.md` | Complete architecture documentation |
| `MIGRATION_GUIDE.md` | Step-by-step migration instructions |
| `QUICK_START.md` | 15-minute tutorial for creating prototypes |
| `ARCHITECTURE_DIAGRAM.md` | Visual diagrams and flow charts |
| `src/app/shared/README.md` | Shared component catalog |

## Key Files Created

### Core Infrastructure

✅ `src/app/core/types.ts` - Type definitions
✅ `src/app/core/PrototypeRegistry.ts` - Auto-discovery system
✅ `src/app/core/PrototypeContext.tsx` - React context for prototypes
✅ `src/app/core/PrototypeLauncher.tsx` - Prototype selection UI

### Template

✅ `src/app/prototypes/_template/` - Template for new prototypes
✅ `src/app/prototypes/_template/prototype.config.ts` - Config template
✅ `src/app/prototypes/_template/README.md` - Documentation template
✅ `src/app/prototypes/_template/routes.tsx` - Routes template
✅ `src/app/prototypes/_template/pages/HomePage.tsx` - Example page

### Documentation

✅ `PROTOTYPE_ARCHITECTURE.md` - Full architecture
✅ `MIGRATION_GUIDE.md` - Migration instructions
✅ `QUICK_START.md` - Getting started guide
✅ `ARCHITECTURE_DIAGRAM.md` - Visual diagrams
✅ `SUMMARY.md` - This overview
✅ `src/app/shared/README.md` - Shared component catalog

## Next Steps

1. **Review the architecture** - Read `PROTOTYPE_ARCHITECTURE.md`
2. **Try the quick start** - Follow `QUICK_START.md` to create a test prototype
3. **Plan migration** - Review `MIGRATION_GUIDE.md` with your team
4. **Migrate one prototype** - Start with a pilot (e.g., `use-case-1`)
5. **Iterate and improve** - Gather feedback and refine
6. **Migrate remaining prototypes** - Once pilot is successful
7. **Clean up** - Remove old code

## Questions to Consider

Before implementing, discuss with your team:

- Which prototype should we migrate first?
- Who will own the migration process?
- What's our timeline?
- Do we need any custom functionality?
- Should we enhance the shared component library first?
- How will we handle ongoing research during migration?

## Success Metrics

You'll know this is working when:

- ✅ Developers create new prototypes in < 30 minutes
- ✅ No git conflicts on prototype work
- ✅ Shared components are being reused
- ✅ Everyone knows who owns what
- ✅ Easy to onboard new team members
- ✅ Research can run in parallel
- ✅ Old prototypes are properly archived

## Support

Need help?
- Read the docs (start with `QUICK_START.md`)
- Look at example prototypes
- Ask in Slack: #prototype-development
- Contact: Stefan Kukla (@stefan)

---

## TL;DR

**Old way:** Everyone editing the same files → conflicts
**New way:** Each prototype in its own directory → no conflicts

**Copy template → Edit config → Build prototype → Select from launcher → Test**

Simple. Isolated. Collaborative.

Ready to start? Read `QUICK_START.md`!

