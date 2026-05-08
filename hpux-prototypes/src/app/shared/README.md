# Shared Component Library

This directory contains reusable components, hooks, utilities, and types that can be used across all prototypes.

## Philosophy

> **Share when mature, duplicate when iterating.**

When building a prototype:
1. Start with components in your prototype directory
2. When a component stabilizes and others might need it, move it here
3. Document it well so others can discover and use it

## Directory Structure

```
shared/
├── components/          # Reusable UI components
│   ├── layouts/        # Page layout components
│   ├── tables/         # Table components and patterns
│   ├── forms/          # Form components and patterns
│   ├── wizards/        # Wizard components
│   ├── navigation/     # Navigation components
│   ├── charts/         # Chart components
│   └── feedback/       # Alerts, toasts, modals, etc.
├── hooks/              # Custom React hooks
├── contexts/           # Shared React contexts
├── utils/              # Utility functions
├── types/              # Shared TypeScript types
└── data/               # Shared mock data and fixtures
```

## Usage

Import shared components using the `@app/shared` path alias:

```typescript
import { DetailPageLayout } from '@app/shared/components/layouts';
import { TableLayout } from '@app/shared/components/layouts';
import { BaseWizard } from '@app/shared/components/wizards';
import { useFilter } from '@app/shared/hooks';
```

## Component Catalog

### Layouts

#### DetailPageLayout

A standardized layout for detail pages with breadcrumbs, title, description, and action buttons.

**Location:** `components/layouts/DetailPageLayout.tsx`

**Usage:**
```typescript
import { DetailPageLayout } from '@app/shared/components/layouts';

<DetailPageLayout
  breadcrumbs={[
    { label: 'Clusters', path: '/clusters' },
    { label: clusterName }
  ]}
  title="Cluster Details"
  description="View and manage cluster configuration"
  actions={[
    <Button key="edit">Edit</Button>,
    <Button key="delete" variant="danger">Delete</Button>
  ]}
>
  {/* Page content */}
</DetailPageLayout>
```

**Props:**
- `breadcrumbs`: Array of breadcrumb items
- `title`: Page title (string)
- `description`: Optional page description
- `actions`: Optional array of action buttons
- `tabs`: Optional tab configuration
- `children`: Page content

**Dependencies:** PatternFly Breadcrumb, PageSection, Title

---

#### TableLayout

A standardized layout for list/table pages with toolbar, filters, and actions.

**Location:** `components/layouts/TableLayout.tsx`

**Usage:**
```typescript
import { TableLayout } from '@app/shared/components/layouts';

<TableLayout
  title="Clusters"
  description="Manage your OpenShift clusters"
  toolbarItems={[
    <SearchInput key="search" />,
    <Button key="create">Create cluster</Button>
  ]}
  filters={{
    status: ['Ready', 'Not Ready'],
    environment: ['Production', 'Development']
  }}
  onFilterChange={handleFilterChange}
>
  <Table>
    {/* Table content */}
  </Table>
</TableLayout>
```

**Props:**
- `title`: Page title
- `description`: Optional description
- `toolbarItems`: Toolbar action items
- `filters`: Filter configuration
- `onFilterChange`: Filter change handler
- `children`: Table or grid content

**Dependencies:** PatternFly Toolbar, PageSection

---

#### PageLayout

Generic page layout with consistent spacing and structure.

**Location:** `components/layouts/PageLayout.tsx`

**Usage:**
```typescript
import { PageLayout } from '@app/shared/components/layouts';

<PageLayout
  title="Settings"
  variant="light"
>
  {/* Page content */}
</PageLayout>
```

---

### Wizards

#### BaseWizard

A base wizard component with consistent styling and behavior.

**Location:** `components/wizards/BaseWizard.tsx`

**Usage:**
```typescript
import { BaseWizard } from '@app/shared/components/wizards';

const steps = [
  {
    name: 'Basic Information',
    component: <BasicInfoStep />
  },
  {
    name: 'Configuration',
    component: <ConfigStep />
  },
  {
    name: 'Review',
    component: <ReviewStep />
  }
];

<BaseWizard
  title="Create Cluster"
  steps={steps}
  onSave={handleSave}
  onClose={handleClose}
/>
```

**Props:**
- `title`: Wizard title
- `description`: Optional description
- `steps`: Array of wizard steps
- `onSave`: Save handler
- `onClose`: Close/cancel handler
- `isOpen`: Boolean to control visibility

**Dependencies:** PatternFly Wizard

---

### Tables

#### DataTable

Enhanced table with sorting, filtering, and selection.

**Location:** `components/tables/DataTable.tsx`

**Usage:**
```typescript
import { DataTable } from '@app/shared/components/tables';

<DataTable
  columns={[
    { key: 'name', label: 'Name', isSortable: true },
    { key: 'status', label: 'Status' },
    { key: 'created', label: 'Created', isSortable: true }
  ]}
  rows={data}
  onSort={handleSort}
  onSelect={handleSelect}
  actions={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete }
  ]}
/>
```

---

### Forms

#### FormField

Consistent form field wrapper with labels, help text, and validation.

**Location:** `components/forms/FormField.tsx`

**Usage:**
```typescript
import { FormField } from '@app/shared/components/forms';

<FormField
  label="Cluster Name"
  fieldId="cluster-name"
  isRequired
  helperText="Choose a unique name for your cluster"
  error={errors.name}
>
  <TextInput
    id="cluster-name"
    value={name}
    onChange={setName}
  />
</FormField>
```

---

## Custom Hooks

### useFilter

Hook for managing filter state and logic.

**Location:** `hooks/useFilter.ts`

**Usage:**
```typescript
import { useFilter } from '@app/shared/hooks';

const {
  filters,
  setFilter,
  clearFilter,
  clearAllFilters,
  filteredData
} = useFilter(data, filterConfig);
```

---

### useSort

Hook for managing table sorting.

**Location:** `hooks/useSort.ts`

**Usage:**
```typescript
import { useSort } from '@app/shared/hooks';

const {
  sortedData,
  sortBy,
  sortDirection,
  onSort
} = useSort(data, 'name', 'asc');
```

---

### usePagination

Hook for managing pagination state.

**Location:** `hooks/usePagination.ts`

**Usage:**
```typescript
import { usePagination } from '@app/shared/hooks';

const {
  currentPage,
  perPage,
  paginatedData,
  onSetPage,
  onPerPageSelect
} = usePagination(data, 20);
```

---

## Utility Functions

### formatDate

Format dates consistently across the app.

**Location:** `utils/dateUtils.ts`

**Usage:**
```typescript
import { formatDate, formatDateTime, formatRelative } from '@app/shared/utils/dateUtils';

formatDate(date); // "Nov 6, 2024"
formatDateTime(date); // "Nov 6, 2024, 3:45 PM"
formatRelative(date); // "2 hours ago"
```

---

### filterHelpers

Helper functions for filtering data.

**Location:** `utils/filterHelpers.ts`

**Usage:**
```typescript
import { matchesSearch, matchesFilter } from '@app/shared/utils/filterHelpers';

const filtered = data.filter(item =>
  matchesSearch(item.name, searchTerm) &&
  matchesFilter(item.status, statusFilter)
);
```

---

## Shared Types

Common TypeScript types used across prototypes.

**Location:** `types/`

**Usage:**
```typescript
import { User, Cluster, Role, Permission } from '@app/shared/types';
```

---

## Contributing

### Adding a New Shared Component

1. **Create the component** in the appropriate directory
2. **Document it** with JSDoc comments
3. **Add examples** in comments or storybook
4. **Export it** from the directory's `index.ts`
5. **Update this README** with usage information
6. **Open a PR** for team review

### Example Component Template

```typescript
/**
 * ComponentName
 * 
 * Brief description of what this component does.
 * 
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={123}
 * />
 * ```
 */

import React from 'react';

export interface ComponentNameProps {
  /** Description of prop1 */
  prop1: string;
  /** Description of prop2 */
  prop2?: number;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2 = 0
}) => {
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};
```

### Guidelines

- **Keep it generic:** Shared components should be reusable across contexts
- **Document thoroughly:** Others need to understand how to use it
- **Follow PatternFly patterns:** Use PatternFly components as building blocks
- **TypeScript all the things:** Strong typing prevents bugs
- **Test edge cases:** Shared code affects many prototypes
- **Version carefully:** Breaking changes require coordination

### When NOT to Share

Don't move a component to shared if:
- It's still being actively experimented with
- It's highly specific to one prototype
- It's tightly coupled to specific data structures
- You're not sure others will need it

It's okay to duplicate code across prototypes during exploration. Share when stable.

---

### Feedback Components

#### StandardModal

A standardized modal component with consistent layout matching the floating button modal style.

**Location:** `components/feedback/StandardModal.tsx`

**Usage:**
```typescript
import { StandardModal } from '@app/shared/components/feedback';

const [isOpen, setIsOpen] = useState(false);

<StandardModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Example modal title"
  content="This is the modal content text."
  actionButtonLabel="Close"
  buttonPosition="left"
/>
```

**Props:**
- `isOpen`: Whether the modal is open (boolean)
- `onClose`: Callback when modal should close
- `title`: Modal title (string)
- `content`: Modal content (string or ReactNode)
- `actionButtonLabel`: Button label (default: "Close")
- `onAction`: Action button callback (default: calls onClose)
- `actionButtonVariant`: Button variant (default: "primary")
- `buttonPosition`: Button position - "left" or "right" (default: "left")
- `ariaLabel`: ARIA label for accessibility

**Layout:**
- Padding: 24px
- Title: 2xl size with proper spacing
- Content: 16px font, 1.6 line height
- Button: Left-aligned by default

---

## Questions?

If you're not sure whether to share a component or how to use a shared component, ask in:
- Slack: #prototype-development
- Or contact: Stefan Kukla (@stefan)

---

## Component Inventory

Quick reference of all shared components:

| Component | Category | Status | Prototypes Using |
|-----------|----------|--------|------------------|
| DetailPageLayout | Layout | ✅ Stable | fleet-admin-rbac, tenant-admin-access |
| TableLayout | Layout | ✅ Stable | All |
| PageLayout | Layout | ✅ Stable | All |
| BaseWizard | Wizard | ✅ Stable | fleet-admin-rbac, virtualization-quotas |
| DataTable | Table | 🚧 Beta | fleet-admin-rbac |
| FormField | Form | ✅ Stable | All |
| StandardModal | Feedback | ✅ Stable | Template (example) |
| useFilter | Hook | ✅ Stable | fleet-admin-rbac, tenant-admin-access |
| useSort | Hook | ✅ Stable | All table pages |
| usePagination | Hook | ✅ Stable | All table pages |
| formatDate | Utility | ✅ Stable | All |

**Legend:**
- ✅ Stable: Production ready, breaking changes require major version
- 🚧 Beta: Functional but may change
- 🧪 Experimental: Use with caution, may be removed

---

## Version History

### v1.0.0 - 2024-11-06
- Initial shared component library
- Migrated core layouts from use-case-1
- Extracted BaseWizard
- Added core hooks and utilities

