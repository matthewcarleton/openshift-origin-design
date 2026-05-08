# Nested Prototypes Implementation Plan

## Goal
Group related prototypes hierarchically instead of having them all at the same level.

## Proposed Structure

### ACM RBAC (Parent)
- **Fleet Admin - Tenant Delegation** (Use Case 1)
  - Fleet admins delegating access to tenant admins
  - Multi-cluster, multi-tenant scenarios
  
- **Tenant Admin Access** (Use Case 2)
  - Tenant admin managing their assigned clusters
  - Single tenant perspective
  
- **Empty States**
  - Empty state variants for RBAC flows

### Virtualization/AAQ (Parent)
- **Admin with Quotas** (Explore)
  - Virtualization admin managing quotas
  - Resource management flows
  
- **Empty States**
  - Empty state variants for virtualization

### Other Standalone Prototypes
- **Cross-Cluster Live Migration**
- **Operator Lifecycle**

## Implementation Options

### Option 1: Hierarchical Config (Recommended)
Add parent/child relationships to `PrototypeConfig`:

```typescript
// Parent prototype
{
  id: 'acm-rbac',
  name: 'ACM RBAC Prototypes',
  isParent: true,
  // ... other config
}

// Child prototype
{
  id: 'fleet-admin-rbac',
  name: 'Fleet Admin - Tenant Delegation',
  parentId: 'acm-rbac',
  // ... other config
}
```

**UI Behavior:**
- Parents show as expandable cards
- Click parent → shows its children
- Can still launch children directly from search

### Option 2: Categories/Tags
Use existing tags system more heavily:

```typescript
{
  id: 'fleet-admin-rbac',
  category: 'ACM RBAC',
  tags: ['rbac', 'multi-tenant', 'delegation'],
  // ...
}
```

**UI Behavior:**
- Group by category in the launcher
- Collapsible sections per category

### Option 3: Separate Parent Configs
Create meta-configs for parents:

```
src/app/prototypes/
  acm-rbac/
    prototype.group.ts  ← Defines the parent
    fleet-admin/        ← Child prototype
    tenant-admin/       ← Child prototype
    empty-states/       ← Child prototype
```

## Recommended Approach

**Use Option 1** because it:
- ✅ Minimal code changes
- ✅ Preserves existing structure
- ✅ Flexible (can be parent, child, or standalone)
- ✅ Easy to implement
- ✅ Backward compatible

## Changes Needed

### 1. Update Types
```typescript
// src/app/core/types.ts
export interface PrototypeConfig {
  // ... existing fields
  parentId?: string;
  isParent?: boolean;
  childOrder?: number; // Order within parent
}
```

### 2. Update Registry
```typescript
// Add methods to get children
getChildren(parentId: string): PrototypeModule[]
getParents(): PrototypeModule[]
```

### 3. Update Launcher UI
- Group prototypes by parent
- Show expandable cards for parents
- Show child count on parent cards
- Allow direct launch of children

### 4. Update Configs
Reorganize the 7 prototypes into the new structure.

## Migration

### Current → New

**Current:**
```
7 prototypes (all top-level)
```

**New:**
```
2 parent prototypes
  ↳ 5 child prototypes
2 standalone prototypes
= 4 top-level items (cleaner!)
```

## Benefits

1. **Better Organization** - Related prototypes grouped together
2. **Cleaner UI** - Fewer top-level items
3. **Easier Navigation** - Logical grouping
4. **Flexible** - Can add more children later
5. **Scalable** - Works with 20+ prototypes

## Questions

1. Should parents be launchable themselves?
   - Suggestion: No, parents are just containers
   
2. Should children show in "All" tab separately?
   - Suggestion: Yes, with parent indicator
   
3. Should search return both parents and children?
   - Suggestion: Yes, search across all

Would you like me to implement this?

