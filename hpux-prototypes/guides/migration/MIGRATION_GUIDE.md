# Migration Guide: From Current Structure to Modular Prototypes

This guide walks you through migrating the existing codebase to the new modular prototype architecture.

## Overview

We're refactoring from:
- ❌ Monolithic `routes.tsx` and `AppLayout.tsx`
- ❌ Use-case directories with mixed responsibilities
- ❌ Manual registration in `UseCaseContext`

To:
- ✅ Self-contained prototype modules
- ✅ Automatic discovery and registration
- ✅ Shared component library
- ✅ Plugin-based architecture

## Migration Strategy

We'll migrate in phases to avoid disrupting ongoing work:

### Phase 1: Setup Core Infrastructure (Week 1)
1. Create core system files
2. Set up prototype registry
3. Create shared component library structure

### Phase 2: Migrate One Prototype (Week 2)
1. Choose a pilot prototype (e.g., `use-case-1`)
2. Migrate it completely
3. Test thoroughly
4. Document learnings

### Phase 3: Migrate Remaining Prototypes (Weeks 3-4)
1. Migrate other use-cases one by one
2. Extract shared components as you go
3. Update documentation

### Phase 4: Cleanup (Week 5)
1. Remove old code
2. Update build system
3. Final testing

## Step-by-Step Migration

### Step 1: Create Core Infrastructure

**Already done!** The following files have been created:
- `src/app/core/types.ts`
- `src/app/core/PrototypeRegistry.ts`
- `src/app/core/PrototypeContext.tsx`
- `src/app/core/PrototypeLauncher.tsx`

### Step 2: Create Shared Component Library

Move commonly used components to `src/app/shared/`:

```bash
# Create directory structure
mkdir -p src/app/shared/{components/{layouts,tables,forms,wizards,navigation},hooks,contexts,utils,types}

# Move shared components
# Example:
mv src/app/use-case-1/shared/patterns/DetailPageLayout.tsx \
   src/app/shared/components/layouts/DetailPageLayout.tsx

mv src/app/use-case-1/shared/patterns/TableLayout.tsx \
   src/app/shared/components/layouts/TableLayout.tsx

mv src/app/use-case-1/shared/wizards/BaseWizard.tsx \
   src/app/shared/components/wizards/BaseWizard.tsx
```

**Create index files for easy imports:**

`src/app/shared/components/layouts/index.ts`:
```typescript
export { DetailPageLayout } from './DetailPageLayout';
export { TableLayout } from './TableLayout';
export { PageLayout } from './PageLayout';
```

`src/app/shared/components/wizards/index.ts`:
```typescript
export { BaseWizard } from './BaseWizard';
```

### Step 3: Migrate First Prototype (use-case-1)

Let's migrate `use-case-1` (Fleet Admin RBAC) as the pilot:

**3.1 Create prototype directory:**
```bash
mkdir -p src/app/prototypes/fleet-admin-rbac
```

**3.2 Copy files:**
```bash
# Copy everything from use-case-1
cp -r src/app/use-case-1/* src/app/prototypes/fleet-admin-rbac/
```

**3.3 Create `prototype.config.ts`:**

`src/app/prototypes/fleet-admin-rbac/prototype.config.ts`:
```typescript
import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'fleet-admin-rbac',
  name: 'ACM RBAC: Fleet Admin - Tenant Delegation',
  description: 'Explore how fleet administrators delegate access to tenant admins across cluster sets in a multi-tenant environment.',
  
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
    email: 'skukla@redhat.com'
  },
  
  version: '1.0.0',
  status: 'active',
  
  persona: {
    name: 'Adrian Veidt',
    role: 'Fleet Administrator',
    organization: 'Petemobile (Telco)'
  },
  
  task: {
    title: 'Delegate Cluster Set Access',
    description: 'Give user Walter Kovacs the Cluster set admin role on multiple production and development cluster sets.',
  },
  
  perspectives: ['fleet-management'],
  tags: ['rbac', 'multi-tenancy', 'acm', 'user-research'],
  
  dependencies: [
    '@app/shared/components/layouts/DetailPageLayout',
    '@app/shared/components/layouts/TableLayout',
    '@app/shared/components/wizards/BaseWizard'
  ],
  
  createdAt: '2024-01-15',
  updatedAt: '2024-11-06'
};
```

**3.4 Create routes file:**

`src/app/prototypes/fleet-admin-rbac/routes.tsx`:
```typescript
import React from 'react';
import { RouteConfig } from '@app/core/types';

// Import from navigation (existing structure)
import {
  ClustersPage,
  ClusterDetailPage,
  IdentitiesPage,
  RolesPage,
  IdentityProvidersPage,
  ProjectsPage,
  GovernancePage,
  CreatePolicy,
  IdentityDetail,
  GroupDetail,
  CreateGroup,
  CreateRole,
  RoleDetail,
  IdentityProviderDetail,
  AddLDAPProvider,
  ProjectDetail,
} from './navigation';

export const routes: RouteConfig[] = [
  {
    path: '/infrastructure/clusters',
    element: <ClustersPage />,
    label: 'Clusters',
    title: 'ACM | Clusters',
    navigation: { group: 'Infrastructure', order: 1 }
  },
  {
    path: '/infrastructure/clusters/:clusterName',
    element: <ClusterDetailPage />,
    title: 'ACM | Cluster Detail'
  },
  {
    path: '/user-management/identities',
    element: <IdentitiesPage />,
    label: 'Identities',
    title: 'ACM | Identities',
    navigation: { group: 'User management', order: 1 }
  },
  {
    path: '/user-management/groups/create',
    element: <CreateGroup />,
    title: 'ACM | Create Group'
  },
  {
    path: '/user-management/groups/:groupName',
    element: <GroupDetail />,
    title: 'ACM | Group Detail'
  },
  {
    path: '/user-management/roles',
    element: <RolesPage />,
    label: 'Roles',
    title: 'ACM | Roles',
    navigation: { group: 'User management', order: 2 }
  },
  {
    path: '/user-management/roles/create',
    element: <CreateRole />,
    title: 'ACM | Create Role'
  },
  {
    path: '/user-management/roles/:roleName',
    element: <RoleDetail />,
    title: 'ACM | Role Detail'
  },
  {
    path: '/governance',
    element: <GovernancePage />,
    label: 'Governance',
    title: 'ACM | Governance',
    navigation: { group: 'Governance', order: 1 }
  },
  {
    path: '/governance/policies/create',
    element: <CreatePolicy />,
    title: 'ACM | Create Policy'
  }
  // ... add all other routes
];
```

**3.5 Create README:**

`src/app/prototypes/fleet-admin-rbac/README.md`:
```markdown
# ACM RBAC: Fleet Admin - Tenant Delegation

> **Owner:** Stefan Kukla (@stefan)
> **Status:** Active
> **Version:** 1.0.0

## Overview
This prototype explores how fleet administrators delegate cluster set access to tenant admins in a multi-tenant ACM environment.

## Research Goals
- Validate the cluster set role assignment workflow
- Test discoverability of role assignment features
- Assess clarity of permission models

## User Persona
- **Name:** Adrian Veidt
- **Role:** Fleet Administrator
- **Organization:** Petemobile (Telco)
- **Experience:** Expert with OpenShift, familiar with ACM

## User Task
Give user **Walter Kovacs** the **Cluster set admin** role on these cluster sets:
- petemobile-na-prod
- petemobile-eu-prod
- petemobile-sa-prod
- petemobile-apac-prod
- petemobile-dev-clusters
```

### Step 4: Update Application Entry Point

**4.1 Create new app entry:**

`src/app/core/AppShell.tsx`:
```typescript
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Spinner } from '@patternfly/react-core';
import { PrototypeProvider, usePrototype } from './PrototypeContext';
import { initializePrototypeRegistry } from './PrototypeRegistry';
import PrototypeLauncher from './PrototypeLauncher';
import { AppLayout } from './AppLayout';

const AppContent: React.FC = () => {
  const { currentPrototype, isLoading } = usePrototype();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="xl" />
      </div>
    );
  }

  // No prototype selected - show launcher
  if (!currentPrototype) {
    return <PrototypeLauncher />;
  }

  // Prototype selected - show its routes in the app layout
  return (
    <AppLayout prototype={currentPrototype}>
      <Routes>
        {currentPrototype.routes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </AppLayout>
  );
};

export const AppShell: React.FC = () => {
  const [registryReady, setRegistryReady] = useState(false);

  useEffect(() => {
    initializePrototypeRegistry()
      .then(() => setRegistryReady(true))
      .catch(error => {
        console.error('Failed to initialize prototype registry:', error);
      });
  }, []);

  if (!registryReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="xl" />
      </div>
    );
  }

  const basename = process.env.NODE_ENV === 'production' ? '/acm-user-interface' : '/';

  return (
    <Router basename={basename}>
      <PrototypeProvider>
        <AppContent />
      </PrototypeProvider>
    </Router>
  );
};
```

**4.2 Update main index.tsx:**

`src/index.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@patternfly/react-core/dist/styles/base.css';
import { AppShell } from '@app/core/AppShell';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);
```

### Step 5: Update Webpack Configuration

**5.1 Update TypeScript paths:**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@shared/*": ["src/app/shared/*"],
      "@core/*": ["src/app/core/*"],
      "@prototypes/*": ["src/app/prototypes/*"]
    }
  }
}
```

### Step 6: Migrate Remaining Prototypes

Repeat Step 3 for each remaining use-case:

**Priority order:**
1. ✅ `use-case-1` → `prototypes/fleet-admin-rbac` (DONE)
2. `use-case-2` → `prototypes/tenant-admin-access`
3. `use-case-aaq` → `prototypes/virtualization-quotas`
4. `use-case-cclm` → `prototypes/cross-cluster-migration`
5. `use-case-operator-lifecycle` → `prototypes/operator-lifecycle`
6. `use-case-empty-states` → `prototypes/acm-empty-states`
7. `use-case-aaq-empty-states` → `prototypes/aaq-empty-states`

### Step 7: Clean Up Old Code

Once all prototypes are migrated and tested:

```bash
# Remove old use-case directories
rm -rf src/app/use-case-*

# Remove old contexts (if replaced)
# rm src/app/contexts/UseCaseContext.tsx

# Remove old routes file
# mv src/app/routes.tsx src/app/routes.tsx.old

# Update .gitignore
echo "*.old" >> .gitignore
```

### Step 8: Update Documentation

1. Update main README with new architecture
2. Create shared component catalog
3. Document prototype creation process
4. Update contributor guidelines

## Testing Checklist

After migration, verify:

- [ ] All prototypes appear in launcher
- [ ] Can select and load each prototype
- [ ] Routes work correctly
- [ ] Navigation renders properly
- [ ] Task modals display
- [ ] Switching between prototypes works
- [ ] Shared components work
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] Build succeeds

## Rollback Plan

If issues arise, you can quickly rollback:

```bash
# Revert to old entry point
git checkout src/index.tsx
git checkout src/app/index.tsx

# Keep new files for future use
git stash push src/app/core src/app/prototypes
```

## Common Migration Issues

### Issue: Import paths broken
**Solution:** Update imports to use new `@app/shared` path:
```typescript
// Before
import { TableLayout } from '@app/use-case-1/shared/patterns/TableLayout';

// After
import { TableLayout } from '@app/shared/components/layouts';
```

### Issue: Prototype not appearing in launcher
**Solution:** Check that:
1. `prototype.config.ts` exists and is correctly named
2. Config exports `config` object
3. No syntax errors in config file
4. Run `npm run start:dev` and check console

### Issue: Routes not working
**Solution:** Check that:
1. `routes.tsx` exports `routes` array
2. Paths start with `/`
3. Elements are React components

## Success Criteria

Migration is complete when:

1. ✅ All prototypes appear in launcher
2. ✅ All prototypes load and function correctly
3. ✅ Shared components are in `shared/` directory
4. ✅ No old use-case directories remain
5. ✅ Documentation is updated
6. ✅ Team is trained on new structure
7. ✅ CI/CD pipeline works

## Timeline

| Week | Tasks | Owner |
|------|-------|-------|
| 1 | Core infrastructure setup | Tech lead |
| 2 | Migrate pilot prototype (use-case-1) | Stefan |
| 3 | Migrate 3 more prototypes | Anna, Kevin |
| 4 | Migrate remaining prototypes | Team |
| 5 | Cleanup and documentation | Tech lead |

## Questions?

Contact the architecture team:
- Stefan Kukla (@stefan) - Lead architect
- [Add other contacts]

## Related Documents

- `PROTOTYPE_ARCHITECTURE.md` - Full architecture overview
- `src/app/shared/README.md` - Shared component catalog
- `src/app/prototypes/_template/README.md` - Template documentation

