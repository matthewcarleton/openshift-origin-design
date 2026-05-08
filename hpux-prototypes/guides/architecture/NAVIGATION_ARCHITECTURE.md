# 🧭 Navigation Architecture Guide

## Overview
This document explains the new modular navigation architecture for the ACM User Interface. Each navigation item is now a separate file, making it easy to add new pages while maintaining consistency through reusable patterns and components.

## 📁 Directory Structure

```
src/app/
├── navigation/                    # Navigation-specific pages
│   ├── infrastructure/           # Infrastructure section
│   │   ├── ClustersPage.tsx     # Main clusters page
│   │   └── ClusterDetailPage.tsx # Cluster detail page
│   ├── user-management/         # User management section
│   │   ├── IdentitiesPage.tsx   # Identities page
│   │   ├── RolesPage.tsx        # Roles page
│   │   └── IdentityProvidersPage.tsx # Identity providers page
│   └── index.ts                 # Export all navigation pages
├── shared/                      # Reusable components and patterns
│   ├── patterns/               # Layout patterns
│   │   ├── PageLayout.tsx      # Standard page layout
│   │   ├── TableLayout.tsx     # Table container layout
│   │   └── DetailPageLayout.tsx # Detail page layout
│   └── wizards/                # Reusable wizard components
│       └── BaseWizard.tsx      # Base wizard component
└── routes.tsx                  # Updated routes using new structure
```

## 🎨 Reusable Patterns

### 1. PageLayout
**File**: `src/app/shared/patterns/PageLayout.tsx`

A standard layout for pages with:
- White header section with title and tabs
- Grey content area
- Consistent spacing and styling

**Usage**:
```tsx
<PageLayout
  title="Page Title"
  activeTab={activeTab}
  onTabChange={handleTabChange}
  tabs={tabs}
/>
```

### 2. TableLayout
**File**: `src/app/shared/patterns/TableLayout.tsx`

A container for table content that:
- Wraps content in a card
- Applies consistent styling
- Fits within the grey content area

**Usage**:
```tsx
<TableLayout>
  <YourTableComponent />
</TableLayout>
```

### 3. DetailPageLayout
**File**: `src/app/shared/patterns/DetailPageLayout.tsx`

A layout for detail pages with:
- Breadcrumb navigation
- White header with title and tabs
- Grey content area

**Usage**:
```tsx
<DetailPageLayout
  title="Detail Title"
  breadcrumbs={breadcrumbs}
  activeTab={activeTab}
  onTabChange={handleTabChange}
  tabs={tabs}
/>
```

## 🧙‍♂️ Reusable Wizards

### BaseWizard
**File**: `src/app/shared/wizards/BaseWizard.tsx`

A flexible wizard component that:
- Handles step navigation
- Manages data flow between steps
- Provides consistent UI/UX

**Usage**:
```tsx
<BaseWizard
  isOpen={isWizardOpen}
  onClose={() => setIsWizardOpen(false)}
  title="Wizard Title"
  steps={wizardSteps}
  onFinish={handleWizardFinish}
  initialData={initialData}
/>
```

## 📄 Navigation Pages

### Infrastructure Section

#### ClustersPage
**File**: `src/app/navigation/infrastructure/ClustersPage.tsx`
- Main clusters management page
- Uses `PageLayout` pattern
- Contains tabs for different cluster views

#### ClusterDetailPage
**File**: `src/app/navigation/infrastructure/ClusterDetailPage.tsx`
- Individual cluster detail page
- Uses `DetailPageLayout` pattern
- Includes breadcrumb navigation

### User Management Section

#### IdentitiesPage
**File**: `src/app/navigation/user-management/IdentitiesPage.tsx`
- User, group, and service account management
- Uses `PageLayout` pattern
- Tabbed interface for different identity types

#### RolesPage
**File**: `src/app/navigation/user-management/RolesPage.tsx`
- Role-based access control
- Uses `PageLayout` pattern
- Manages roles and role bindings

#### IdentityProvidersPage
**File**: `src/app/navigation/user-management/IdentityProvidersPage.tsx`
- Identity provider configuration
- Uses `PageLayout` pattern
- Supports LDAP, OAuth, and other providers

## 🚀 Adding New Navigation Items

### Step 1: Create the Page File
Create a new file in the appropriate section directory:

```tsx
// src/app/navigation/[section]/[PageName].tsx
import React, { useState } from 'react';
import { PageLayout } from '@app/shared/patterns/PageLayout';
import { TableLayout } from '@app/shared/patterns/TableLayout';

export const YourNewPage: React.FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState('default');

  const handleTabChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTab(tabIndex.toString());
  };

  const tabs = [
    {
      key: 'default',
      title: 'Default Tab',
      content: (
        <TableLayout>
          <YourContentComponent />
        </TableLayout>
      )
    }
  ];

  return (
    <PageLayout
      title="Your Page Title"
      activeTab={activeTab}
      onTabChange={handleTabChange}
      tabs={tabs}
    />
  );
};
```

### Step 2: Export from Index
Add your new page to `src/app/navigation/index.ts`:

```tsx
export { YourNewPage } from './[section]/YourNewPage';
```

### Step 3: Add to Routes
Update `src/app/routes.tsx` to include your new page:

```tsx
{
  element: <YourNewPage />,
  label: 'Your Page',
  path: '/your-section/your-page',
  title: 'ACM | Your Page',
}
```

## 🎯 Benefits of This Architecture

1. **Modularity**: Each navigation item is self-contained
2. **Consistency**: Reusable patterns ensure uniform UI/UX
3. **Maintainability**: Easy to find and modify specific pages
4. **Scalability**: Simple to add new navigation items
5. **Reusability**: Shared components reduce code duplication
6. **Type Safety**: Full TypeScript support throughout

## 🔧 Customization

### Adding New Patterns
Create new pattern files in `src/app/shared/patterns/` and export them from the navigation index.

### Extending Wizards
Create specialized wizard components that extend `BaseWizard` for specific use cases.

### Styling
All patterns use CSS classes defined in `src/app/app.css` for consistent styling across the application.

## 📝 Best Practices

1. **Always use the provided patterns** for consistency
2. **Keep page components focused** on their specific functionality
3. **Use TypeScript interfaces** for props and data structures
4. **Follow the established naming conventions**
5. **Test each new page** in both development and production builds
6. **Document any new patterns** you create

This architecture makes it easy to maintain and extend the ACM User Interface while ensuring a consistent user experience across all pages.
