# Quick Start Guide: Creating a New Prototype

This guide gets you from zero to a working prototype in 15 minutes.

## Prerequisites

- Node.js 18+ installed
- Git access to this repository
- Basic React and TypeScript knowledge
- Familiarity with PatternFly (helpful but not required)

## 5-Minute Setup

### Step 1: Copy the Template (1 min)

```bash
# Navigate to prototypes directory
cd src/app/prototypes

# Copy the template
cp -r _template my-awesome-prototype

# Navigate to your new prototype
cd my-awesome-prototype
```

### Step 2: Configure Your Prototype (2 min)

Edit `prototype.config.ts`:

```typescript
import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'my-awesome-prototype',  // ← Change this (kebab-case)
  name: 'My Awesome Prototype',  // ← Change this
  description: 'Testing a new workflow for...',  // ← Describe your prototype
  
  owner: {
    name: 'Your Name',  // ← Your name
    slack: '@yourhandle',  // ← Your Slack handle
    email: 'you@redhat.com'  // ← Your email
  },
  
  version: '0.1.0',
  status: 'draft',  // Start with 'draft'
  
  persona: {
    name: 'Test User',  // ← Who is the user in your scenario?
    role: 'Administrator',  // ← What's their role?
  },
  
  perspectives: ['fleet-management'],  // Choose the right perspective
  tags: ['experiment', 'your-feature'],  // ← Add relevant tags
  
  createdAt: '2024-11-06',  // ← Today's date
  updatedAt: '2024-11-06'
};
```

### Step 3: Start Building (2 min)

Edit `pages/HomePage.tsx` to replace the template content:

```typescript
import React from 'react';
import {
  PageSection,
  Title,
  Content,
} from '@patternfly/react-core';

export const HomePage: React.FC = () => {
  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          My Awesome Feature
        </Title>
        <Content component="p">
          Description of what you're testing...
        </Content>
      </PageSection>

      <PageSection>
        {/* Your prototype content here */}
      </PageSection>
    </>
  );
};
```

### Step 4: Run and Test (30 seconds)

```bash
# From project root
npm run start:dev
```

Open http://localhost:8080

You should see:
1. The prototype launcher
2. Your prototype in the "Draft" tab
3. Click it to launch!

🎉 **Congratulations!** You now have a working prototype.

## Next Steps (10 minutes)

### Add More Pages

Create a new page in `pages/`:

```typescript
// pages/SettingsPage.tsx
import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

export const SettingsPage: React.FC = () => {
  return (
    <PageSection>
      <Title headingLevel="h1">Settings</Title>
      {/* Settings content */}
    </PageSection>
  );
};
```

Add it to `routes.tsx`:

```typescript
import { SettingsPage } from './pages/SettingsPage';

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    label: 'Home',
    navigation: { group: 'Main', order: 1 }
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    label: 'Settings',
    navigation: { group: 'Main', order: 2 }
  }
];
```

Navigation will automatically appear in the sidebar!

### Use Shared Components

Import from the shared library:

```typescript
import { TableLayout } from '@app/shared/components/layouts';
import { DataTable } from '@app/shared/components/tables';
import { useFilter, useSort } from '@app/shared/hooks';

<TableLayout
  title="My Data"
  description="List of items"
>
  <DataTable
    columns={columns}
    rows={data}
  />
</TableLayout>
```

See `src/app/shared/README.md` for the full catalog.

### Add Mock Data

Create `data/mockData.ts`:

```typescript
export const mockClusters = [
  {
    id: '1',
    name: 'prod-cluster-1',
    status: 'Ready',
    nodes: 5,
    created: '2024-01-15'
  },
  {
    id: '2',
    name: 'dev-cluster-1',
    status: 'Not Ready',
    nodes: 3,
    created: '2024-02-20'
  }
];
```

Import in your components:

```typescript
import { mockClusters } from '../data/mockData';
```

## Common Patterns

### List/Table Page

```typescript
import React from 'react';
import { TableLayout } from '@app/shared/components/layouts';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

export const ClustersPage: React.FC = () => {
  const clusters = [/* mock data */];

  return (
    <TableLayout
      title="Clusters"
      description="Manage your clusters"
    >
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Nodes</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clusters.map(cluster => (
            <Tr key={cluster.id}>
              <Td>{cluster.name}</Td>
              <Td>{cluster.status}</Td>
              <Td>{cluster.nodes}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableLayout>
  );
};
```

### Detail Page

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '@app/shared/components/layouts';
import { DescriptionList, DescriptionListGroup, DescriptionListTerm, DescriptionListDescription } from '@patternfly/react-core';

export const ClusterDetail: React.FC = () => {
  const { clusterId } = useParams();
  // Fetch cluster data...

  return (
    <DetailPageLayout
      breadcrumbs={[
        { label: 'Clusters', path: '/clusters' },
        { label: cluster.name }
      ]}
      title={cluster.name}
      description={cluster.description}
    >
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDescription>{cluster.status}</DescriptionListDescription>
        </DescriptionListGroup>
        {/* More fields... */}
      </DescriptionList>
    </DetailPageLayout>
  );
};
```

### Form/Wizard

```typescript
import React, { useState } from 'react';
import { BaseWizard } from '@app/shared/components/wizards';

export const CreateClusterWizard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({});

  const steps = [
    {
      name: 'Basic Info',
      component: <BasicInfoStep data={formData} onChange={setFormData} />
    },
    {
      name: 'Review',
      component: <ReviewStep data={formData} />
    }
  ];

  return (
    <BaseWizard
      title="Create Cluster"
      steps={steps}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSave={(data) => {
        console.log('Creating cluster:', data);
      }}
    />
  );
};
```

## Tips & Tricks

### Hot Reload

The dev server supports hot reload. Just save your files and changes appear instantly!

### Console Logs

Check the browser console for helpful debug info:
- Prototype registration status
- Route loading
- Any errors

### Switching Prototypes

Click your name in the top right → "Change Prototype" to switch without reloading.

### Debugging Routes

If a route doesn't work:
1. Check the path starts with `/`
2. Verify the component is imported
3. Check for console errors
4. Ensure `routes.tsx` exports `routes` array

### Using PatternFly

Browse components at: https://www.patternfly.org/components/

Import what you need:
```typescript
import { 
  Button, 
  Card, 
  CardBody,
  Title 
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
```

### TypeScript Errors

If TypeScript complains about imports:
```bash
# Restart TypeScript server in your editor
# Or restart the dev server
npm run start:dev
```

## Getting Help

### Documentation

- **Architecture:** `PROTOTYPE_ARCHITECTURE.md`
- **Shared components:** `src/app/shared/README.md`
- **Migration guide:** `MIGRATION_GUIDE.md`
- **PatternFly docs:** `ai-documentation/README.md`

### Examples

Look at existing prototypes for patterns:
- `prototypes/fleet-admin-rbac/` - Full-featured example
- `prototypes/virtualization-quotas/` - Forms and wizards
- `prototypes/operator-lifecycle/` - Custom layouts

### Ask for Help

- Slack: #prototype-development
- Or ping: Stefan Kukla (@stefan)

## Checklist

Before sharing your prototype for testing:

- [ ] `prototype.config.ts` has correct info
- [ ] README.md documents the purpose
- [ ] Routes work correctly
- [ ] Navigation labels are clear
- [ ] Mock data is realistic
- [ ] No console errors
- [ ] Status is set to 'active'
- [ ] Tags are relevant

## Common Mistakes

### ❌ Forgetting to export config
```typescript
// Wrong
const config = { ... };

// Right
export const config = { ... };
```

### ❌ Forgetting to export routes
```typescript
// Wrong
const routes = [ ... ];

// Right
export const routes = [ ... ];
```

### ❌ Wrong import paths
```typescript
// Wrong
import { Button } from 'patternfly';

// Right
import { Button } from '@patternfly/react-core';
```

### ❌ Paths without leading slash
```typescript
// Wrong
{ path: 'clusters', ... }

// Right
{ path: '/clusters', ... }
```

## What's Next?

Now that you have a basic prototype:

1. **Build your UI** - Add pages, components, interactions
2. **Add mock data** - Create realistic scenarios
3. **Test it yourself** - Walk through the user flow
4. **Get feedback** - Share with teammates
5. **Iterate** - Refine based on feedback
6. **Run research** - Test with real users
7. **Document findings** - Update README with learnings

## Example Prototypes

Study these for inspiration:

- **`fleet-admin-rbac`** - Complex multi-step wizards
- **`virtualization-quotas`** - Form validation patterns
- **`operator-lifecycle`** - Custom navigation
- **`acm-empty-states`** - Empty state patterns

## Advanced Topics

Once comfortable with basics, explore:

- Custom navigation structures
- Shared contexts
- Advanced routing patterns
- Custom hooks
- Complex wizards
- Real API integration (for later production)

See `PROTOTYPE_ARCHITECTURE.md` for advanced patterns.

---

**Happy prototyping! 🚀**

