# Modular Prototype Architecture

## Overview
This architecture enables multiple developers to create and maintain isolated prototypes while sharing common components, all within the same GitHub repository without conflicts.

## Architecture Principles

### 1. **100% Prototype Isolation**
- Each prototype lives in its own directory with a complete manifest
- Prototypes cannot accidentally affect each other
- Developers own their prototype directory completely

### 2. **Shared Component Library**
- Common UI components in a centralized library
- Versioned and reusable across prototypes
- Clear API contracts

### 3. **Plugin-Based Registration**
- Prototypes self-register through a manifest file
- No need to modify core application files
- Dynamic discovery at runtime

### 4. **Clear Ownership**
- Each prototype has metadata about owner, purpose, status
- Easy to see who to contact for questions
- Clear lifecycle management

## Directory Structure

```
src/
├── app/
│   ├── core/                          # Core application (DO NOT MODIFY)
│   │   ├── AppShell.tsx              # Main app shell
│   │   ├── PrototypeLoader.tsx       # Dynamic prototype loader
│   │   ├── PrototypeRegistry.ts      # Prototype registration system
│   │   └── types.ts                  # Core type definitions
│   │
│   ├── shared/                        # Shared component library
│   │   ├── components/               # Reusable UI components
│   │   │   ├── tables/
│   │   │   ├── forms/
│   │   │   ├── layouts/
│   │   │   ├── wizards/
│   │   │   └── navigation/
│   │   ├── hooks/                    # Shared React hooks
│   │   ├── contexts/                 # Shared contexts
│   │   ├── utils/                    # Utility functions
│   │   └── types/                    # Shared TypeScript types
│   │
│   └── prototypes/                    # All prototypes live here
│       ├── fleet-admin-rbac/         # Example: Stefan's prototype
│       │   ├── prototype.config.ts   # REQUIRED: Prototype manifest
│       │   ├── README.md             # Prototype documentation
│       │   ├── routes.tsx            # Prototype-specific routes
│       │   ├── navigation.tsx        # Prototype-specific navigation
│       │   ├── components/           # Prototype-specific components
│       │   ├── contexts/             # Prototype-specific contexts
│       │   ├── data/                 # Prototype-specific mock data
│       │   └── assets/               # Prototype-specific assets
│       │
│       ├── virtualization-quotas/    # Example: Anna's prototype
│       │   ├── prototype.config.ts
│       │   ├── README.md
│       │   └── ...
│       │
│       └── operator-lifecycle/       # Example: Kevin's prototype
│           ├── prototype.config.ts
│           ├── README.md
│           └── ...
```

## Key Files Explained

### 1. Prototype Configuration (`prototype.config.ts`)

Every prototype MUST have this file. It's the prototype's "package.json":

```typescript
import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (no spaces, use kebab-case)
  id: 'fleet-admin-rbac',
  
  // Display name
  name: 'ACM RBAC: Fleet Admin - Tenant Delegation',
  
  // Brief description
  description: 'Explore how fleet administrators delegate access to tenant admins',
  
  // Owner information
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
    email: 'skukla@redhat.com'
  },
  
  // Prototype version (semver)
  version: '1.0.0',
  
  // Status
  status: 'active', // 'active' | 'archived' | 'draft'
  
  // User persona for this prototype
  persona: {
    name: 'Adrian Veidt',
    role: 'Fleet Administrator',
    organization: 'Petemobile (Telco)'
  },
  
  // Research task
  task: {
    title: 'Your task',
    description: 'Give user Walter Kovacs the Cluster set admin role on multiple cluster sets...'
  },
  
  // Which perspectives/navigation should be active
  perspectives: ['fleet-management'],
  
  // Tags for filtering/searching
  tags: ['rbac', 'multi-tenancy', 'acm', 'research-2024'],
  
  // Shared components this prototype depends on
  dependencies: [
    '@shared/components/DetailPageLayout',
    '@shared/components/TableLayout',
    '@shared/components/BaseWizard'
  ],
  
  // Created/updated timestamps (auto-managed)
  createdAt: '2024-01-15',
  updatedAt: '2024-11-06'
};
```

### 2. Prototype Routes (`routes.tsx`)

Each prototype defines its own routes:

```typescript
import React from 'react';
import { RouteConfig } from '@app/core/types';
import { ClustersPage } from './pages/ClustersPage';
import { ClusterDetail } from './pages/ClusterDetail';

export const routes: RouteConfig[] = [
  {
    path: '/clusters',
    element: <ClustersPage />,
    label: 'Clusters',
    navigation: {
      group: 'Infrastructure',
      order: 1
    }
  },
  {
    path: '/clusters/:clusterId',
    element: <ClusterDetail />,
    // No label = not shown in nav
  }
];
```

### 3. Prototype Navigation (`navigation.tsx`)

Optional: Define custom navigation structure:

```typescript
import { NavigationConfig } from '@app/core/types';

export const navigation: NavigationConfig = {
  groups: [
    {
      label: 'Home',
      routes: [
        { path: '/', label: 'Overview' }
      ]
    },
    {
      label: 'Infrastructure',
      routes: [
        { path: '/clusters', label: 'Clusters' },
        { path: '/automation', label: 'Automation' }
      ]
    }
  ]
};
```

## Developer Workflow

### Creating a New Prototype

1. **Create your prototype directory:**
```bash
cd src/app/prototypes
mkdir my-awesome-prototype
cd my-awesome-prototype
```

2. **Create prototype.config.ts:**
```typescript
export const config = {
  id: 'my-awesome-prototype',
  name: 'My Awesome Prototype',
  description: 'Testing a new interaction pattern',
  owner: {
    name: 'Your Name',
    slack: '@yourhandle'
  },
  version: '0.1.0',
  status: 'draft',
  persona: {
    name: 'Test User',
    role: 'Administrator'
  },
  perspectives: ['fleet-management'],
  tags: ['experiment']
};
```

3. **Create README.md:**
```markdown
# My Awesome Prototype

## Purpose
Testing a new interaction pattern for...

## Research Questions
- Question 1
- Question 2

## Setup
1. Select this prototype from the launcher
2. ...

## Notes
...
```

4. **Build your prototype:**
- Add components in `components/`
- Add routes in `routes.tsx`
- Use shared components from `@app/shared`
- Add mock data in `data/`

5. **Test in isolation:**
Your prototype will appear in the prototype selector automatically!

### Using Shared Components

Import from the shared library:

```typescript
import { TableLayout } from '@app/shared/components/layouts/TableLayout';
import { DetailPageLayout } from '@app/shared/components/layouts/DetailPageLayout';
import { BaseWizard } from '@app/shared/components/wizards/BaseWizard';
import { useFilter } from '@app/shared/hooks/useFilter';
```

### Contributing Shared Components

When you create a component that others might need:

1. **Move it to shared:**
```bash
mv src/app/prototypes/my-prototype/components/AwesomeTable.tsx \
   src/app/shared/components/tables/AwesomeTable.tsx
```

2. **Export it:**
Add to `src/app/shared/components/tables/index.ts`:
```typescript
export { AwesomeTable } from './AwesomeTable';
```

3. **Document it:**
Add JSDoc comments and usage examples

4. **Update your prototype.config.ts:**
```typescript
dependencies: [
  '@shared/components/tables/AwesomeTable'
]
```

## Git Workflow

### Branch Strategy

```
main
├── shared/your-name/awesome-table-component
└── prototypes/your-name/my-prototype
```

**Rules:**
- **Shared components:** Create a feature branch, open PR, get review
- **Your prototype:** Work directly on a prototype branch, merge when ready
- **Others' prototypes:** Never modify without permission

### Example Workflow

```bash
# Working on your prototype
git checkout -b prototypes/stefan/fleet-admin-rbac
# ... make changes to src/app/prototypes/fleet-admin-rbac/ ...
git commit -m "Add cluster selection wizard"
git push origin prototypes/stefan/fleet-admin-rbac

# Contributing a shared component
git checkout -b shared/stefan/data-table-improvements
# ... make changes to src/app/shared/components/tables/ ...
git commit -m "Add sorting to DataTable"
git push origin shared/stefan/data-table-improvements
# Open PR for team review
```

### Avoiding Conflicts

**Safe to modify (your prototype):**
- ✅ `src/app/prototypes/your-prototype/**/*`
- ✅ Your prototype's README, config, routes, components

**Requires coordination:**
- ⚠️ `src/app/shared/**/*` (open PR, get review)
- ⚠️ `src/app/core/**/*` (discuss with team lead)

**Never modify:**
- ❌ Other people's prototypes
- ❌ Core without approval

## Prototype Lifecycle

### Status Values

- **`draft`**: Work in progress, not ready for research
- **`active`**: Ready for user research/testing
- **`paused`**: Temporarily on hold
- **`archived`**: Research complete, kept for reference

### Archiving Old Prototypes

When research is complete:

1. Update `prototype.config.ts`:
```typescript
status: 'archived'
```

2. Add research findings to README
3. Prototype still appears in "Archived" section of launcher

## Benefits of This Architecture

### For Developers
- ✅ **No conflicts:** Work in your own directory
- ✅ **Fast setup:** Copy template, start building
- ✅ **Reuse components:** Import from shared library
- ✅ **No core changes:** Add prototype without touching core app
- ✅ **Easy cleanup:** Archive or delete your prototype when done

### For Teams
- ✅ **Clear ownership:** Know who owns what
- ✅ **Easy discovery:** See all prototypes in launcher
- ✅ **Knowledge sharing:** Shared components benefit everyone
- ✅ **Parallel work:** Multiple prototypes in flight simultaneously
- ✅ **Research tracking:** Each prototype documents its purpose

### For Research
- ✅ **Isolated testing:** Each prototype is independent
- ✅ **Easy switching:** Switch between prototypes instantly
- ✅ **Version control:** Track prototype evolution over time
- ✅ **Documentation:** Built-in metadata and READMEs

## Migration Plan

See `MIGRATION_GUIDE.md` for step-by-step instructions to migrate existing use-cases to this architecture.

## FAQ

**Q: Can I use components from another prototype?**
A: Not directly. If you need a component from another prototype, discuss with the owner about moving it to shared.

**Q: What if I need to change a shared component?**
A: Create a PR with your changes. If it's a breaking change, discuss with the team first.

**Q: Can prototypes share data?**
A: Each prototype should have its own mock data. If you need shared data fixtures, put them in `src/app/shared/data/`.

**Q: How do I handle PatternFly version updates?**
A: Core team handles this. Shared components update first, then prototypes update as needed.

**Q: Can I have multiple personas in one prototype?**
A: Yes! Define them in your prototype.config.ts and handle switching in your components.

**Q: What if my prototype needs a custom layout?**
A: Build it in your prototype directory. If others need it, propose moving it to shared.

**Q: How do I test my prototype?**
A: Run `npm run start:dev`, select your prototype from the launcher, test!

**Q: Can prototypes communicate with each other?**
A: No. Keep them isolated. If you need shared state, use a shared context.

## Next Steps

1. Read `MIGRATION_GUIDE.md` to see how to migrate existing code
2. Review shared component catalog in `src/app/shared/README.md`
3. Check out example prototypes in `src/app/prototypes/examples/`
4. Start building!

