# 🎨 Prototype Versioning System

## Overview

The versioning system allows you to maintain multiple design iterations of the same scenario/use case while keeping them organized and easy to switch between.

---

## Concepts

### **Use Case / Scenario**
A specific user workflow or scenario (e.g., "Fleet Admin - Tenant Delegation")

### **Version**
A design iteration of that scenario (e.g., "v1", "v2", "final")

### **Version Group**
The identifier that links all versions together (e.g., "fleet-admin-rbac")

---

## Creating Versions

### **Step 1: Create Initial Version**

```bash
# Copy the template
cp -r src/app/prototypes/_template src/app/prototypes/fleet-admin-rbac-v1

# Edit the config
```

```typescript
// fleet-admin-rbac-v1/prototype.config.ts
export const config: PrototypeConfig = {
  id: 'fleet-admin-rbac-v1',
  name: 'Fleet Admin - Tenant Delegation',
  description: '...',
  
  // Parent relationship
  parentId: 'acm-rbac-parent',
  childOrder: 1,
  
  // VERSION FIELDS ⭐
  versionGroup: 'fleet-admin-rbac',  // Groups versions together
  version: 'v1',                      // Version identifier
  versionLabel: 'Initial Design',    // Optional: friendly label
  
  owner: { name: 'Your Name', ... },
  status: 'active',
  // ... rest of config
};
```

### **Step 2: Create New Version (Iteration)**

```bash
# Copy the existing version
cp -r src/app/prototypes/fleet-admin-rbac-v1 src/app/prototypes/fleet-admin-rbac-v2

# Update the config
```

```typescript
// fleet-admin-rbac-v2/prototype.config.ts
export const config: PrototypeConfig = {
  id: 'fleet-admin-rbac-v2',           // ⭐ New ID
  name: 'Fleet Admin - Tenant Delegation', // Same name
  description: '...',
  
  parentId: 'acm-rbac-parent',
  childOrder: 1,                        // Same order
  
  // VERSION FIELDS
  versionGroup: 'fleet-admin-rbac',     // ⭐ Same group
  version: 'v2',                        // ⭐ New version
  versionLabel: 'Design Iteration 2',  // ⭐ New label
  
  owner: { name: 'Your Name', ... },
  status: 'active',
  // ... rest
};
```

### **Step 3: Create Final Version**

```bash
cp -r src/app/prototypes/fleet-admin-rbac-v2 src/app/prototypes/fleet-admin-rbac-final
```

```typescript
// fleet-admin-rbac-final/prototype.config.ts
export const config: PrototypeConfig = {
  id: 'fleet-admin-rbac-final',
  name: 'Fleet Admin - Tenant Delegation',
  
  versionGroup: 'fleet-admin-rbac',
  version: 'final',                   // ⭐ Special 'final' version
  versionLabel: 'Final Design',
  
  // ... rest
};
```

---

## How It Appears in the UI

### **Launcher Card (Single Version):**
```
┌─────────────────────────────────────┐
│ ACM RBAC Prototypes [2 variants]   │
│                                     │
│ ┌──────────────────────────┬──┐    │
│ │ Tenant Admin Access  [v1]│▼ │    │ ← Version badge
│ └──────────────────────────┴──┘    │
└─────────────────────────────────────┘
```

### **Launcher Card (Multiple Versions):**
```
┌─────────────────────────────────────┐
│ ACM RBAC Prototypes [2 variants]   │
│                                     │
│ ┌──────────────────────────┬──┐    │
│ │ Fleet Admin...  [v2]     │▼ │    │ ← Shows last used version
│ └──────────────────────────┴──┘    │
└─────────────────────────────────────┘

Click dropdown:
├─ Fleet Admin - Tenant Delegation
│   ├─ Initial Design (v1)
│   ├─ Design Iteration 2 (v2) ← (current)
│   └─ Final Design (final)
└─ Tenant Admin Access [v1]
```

---

## Version Sorting

Versions are automatically sorted:
1. **Alphabetically** (v1, v2, v3, etc.)
2. **'final' always last**

Example order:
```
v1 → v2 → v2.1 → v3 → final
```

---

## Best Practices

### **Version Naming:**
- ✅ **v1, v2, v3** - Simple iteration numbers
- ✅ **1.0.0, 1.1.0, 2.0.0** - Semantic versioning
- ✅ **draft, iteration, final** - Milestone names
- ✅ **2024-11-06** - Date-based versions
- ❌ Avoid spaces in version identifiers

### **Version Labels:**
- Use friendly names that describe the iteration
- Examples:
  - "Initial Concept"
  - "Stakeholder Review"
  - "Design Iteration 2"
  - "Final for Development"

### **Version Groups:**
- Use the base prototype name
- Lowercase, no spaces
- Examples:
  - `fleet-admin-rbac`
  - `tenant-admin-access`
  - `virtualization-quotas`

---

## File Structure

### **With Versions:**
```
src/app/prototypes/
├── acm-rbac-parent/
├── fleet-admin-rbac-v1/         ← Version 1
├── fleet-admin-rbac-v2/         ← Version 2
├── fleet-admin-rbac-final/      ← Final version
├── tenant-admin-access-v1/
└── tenant-admin-access-v2/
```

### **Without Versions (Single):**
```
src/app/prototypes/
├── acm-rbac-parent/
├── fleet-admin-rbac/            ← Only one version
└── tenant-admin-access/
```

---

## Workflows

### **Workflow 1: Iterative Design**
1. Create `my-prototype-v1`
2. Present to stakeholders
3. Copy to `my-prototype-v2`
4. Make changes in v2
5. Compare v1 vs v2 by switching in launcher
6. When ready: `my-prototype-final`

### **Workflow 2: A/B Testing**
1. Create `my-prototype-option-a`
2. Create `my-prototype-option-b`
3. User testers can switch between options
4. Pick winner → rename to `-final`

### **Workflow 3: Progressive Enhancement**
1. `my-prototype-basic` (core features)
2. `my-prototype-enhanced` (+ advanced features)
3. `my-prototype-full` (all bells and whistles)

---

## Memory & Persistence

### **Last Used Version:**
- Each parent remembers your last used version
- Stored in localStorage: `lastUsedChild_acm-rbac-parent`
- Persists across sessions

### **Switching Versions:**
1. Click dropdown
2. Select different version
3. That becomes your new default
4. Next time: button shows that version

---

## Quick Reference

### **Create New Version:**
```bash
# 1. Copy existing
cp -r prototypes/my-proto-v1 prototypes/my-proto-v2

# 2. Update config
# - Change id
# - Change version
# - Update versionLabel

# 3. Make your design changes

# 4. Refresh browser - new version appears in dropdown!
```

### **Config Template:**
```typescript
{
  id: 'my-prototype-v2',              // Unique ID
  name: 'My Prototype Name',          // Same for all versions
  versionGroup: 'my-prototype',       // Same for all versions
  version: 'v2',                      // Different for each
  versionLabel: 'Design Iteration 2', // Different for each
  parentId: 'my-parent',              // Same for all versions
  // ...
}
```

---

## Tips

✅ **Keep old versions** - Non-destructive iteration  
✅ **Use meaningful labels** - Easier to remember what changed  
✅ **Mark final clearly** - Use version: 'final'  
✅ **Document changes** - Update description field  
✅ **Compare easily** - Switch versions in launcher to see differences  

---

## Status

✅ **Type system** - versionGroup, version, versionLabel added  
✅ **UI grouping** - Versions grouped in dropdown  
✅ **Version badge** - Shows on split button  
✅ **Smart sorting** - Automatic version ordering  
✅ **Memory** - Remembers last used version  

---

**Ready to use!** Create your first versioned prototype and start iterating! 🚀

