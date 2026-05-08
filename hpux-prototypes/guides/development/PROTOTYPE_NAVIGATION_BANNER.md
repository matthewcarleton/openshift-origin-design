# ✅ Prototype Navigation Banner

## **What's New**

When you enter a prototype, there's now a **banner at the top** that provides:
1. **Back to Launcher** button
2. **Version selector** (dropdown if multiple versions, text if single version)
3. **Use case selector** (dropdown if prototype has siblings)

---

## **Banner Layout**

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Launcher          Version: v1.0 ▼  Use Case: ... ▼│
└─────────────────────────────────────────────────────────────┘
```

**Left side**: Back button  
**Right side**: Version + Use case selectors

---

## **Scenarios**

### **1. Version Group with Multiple Versions (Cross Cluster Migration)**

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to Launcher                    Version: v1.0 ▼        │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Back to Launcher button
- ✅ Version dropdown (v1.0, v1.1)
- ❌ No use case selector (not a child of parent)

**User Flow:**
1. Click "Version: v1.0 ▼" dropdown
2. Select v1.1
3. Prototype switches to v1.1 in place
4. Description/content updates

---

### **2. Parent Child with Multiple Use Cases (Fleet Admin)**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to Launcher   Version: 1.0.0   Use Case: Fleet Admin - Tenant... ▼│
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Back to Launcher button
- ✅ Version display (no dropdown, single version)
- ✅ Use case dropdown (Fleet Admin, Tenant Admin, Empty States)

**User Flow:**
1. Click "Use Case: Fleet Admin ▼" dropdown
2. Select "Tenant Admin - Project Access"
3. Switches to Tenant Admin prototype
4. Entire prototype changes

---

### **3. Standalone (Operator Lifecycle)**

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Launcher                    Version: 1.0.0        │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Back to Launcher button
- ✅ Version display (no dropdown, single version)
- ❌ No use case selector (no siblings)

**User Flow:**
1. Only option: Click "Back to Launcher"
2. Returns to launcher grid

---

## **Version Selector Logic**

### **Multiple Versions → Dropdown**
```typescript
// Has versions if versionGroup matches and > 1 exist
const versions = allPrototypes.filter(p => 
  p.config.versionGroup === prototype.config.versionGroup
);

if (versions.length > 1) {
  // Show dropdown
  <Select>
    <SelectOption>v1.0</SelectOption>
    <SelectOption>v1.1</SelectOption>
  </Select>
}
```

**Example**: Cross Cluster Migration
- Has `versionGroup: 'cross-cluster-migration'`
- Two versions exist: v1.0 and v1.1
- **Shows dropdown**

---

### **Single Version → Text Display**
```typescript
else {
  // Show plain text
  <span>Version: 1.0.0</span>
}
```

**Example**: Operator Lifecycle
- No `versionGroup` defined
- Only one prototype with this ID
- **Shows text**

---

## **Use Case Selector Logic**

### **Has Siblings → Dropdown**
```typescript
// Has siblings if parentId exists and > 1 children
const siblings = prototype.config.parentId 
  ? prototypeRegistry.getChildren(prototype.config.parentId)
  : [];

if (siblings.length > 1) {
  // Show dropdown
  <Select>
    <SelectOption>Fleet Admin - Tenant Delegation</SelectOption>
    <SelectOption>Tenant Admin - Project Access</SelectOption>
    <SelectOption>RBAC Empty States</SelectOption>
  </Select>
}
```

**Example**: Fleet Admin
- Has `parentId: 'acm-rbac-parent'`
- Parent has 3 children total
- **Shows dropdown** with all 3 siblings

---

### **No Siblings → No Selector**
```typescript
else {
  // Don't show use case selector at all
}
```

**Example**: Cross Cluster Migration (version group)
- No `parentId` defined
- Standalone prototype (with versions)
- **No use case dropdown**

---

## **Banner Behavior**

### **Back to Launcher**
- **Action**: Click button
- **Result**: Returns to launcher grid
- **State**: Remembers which prototype you were in
- **Next visit**: That prototype's card will be pre-selected

### **Version Dropdown**
- **Action**: Click "Version: v1.0 ▼"
- **Options**: Shows all versions in versionGroup
- **Select**: Click v1.1
- **Result**: 
  - Prototype switches to v1.1
  - Banner updates to "Version: v1.1"
  - Content updates to v1.1's routes/components
  - URL stays the same (seamless transition)

### **Use Case Dropdown**
- **Action**: Click "Use Case: Fleet Admin ▼"
- **Options**: Shows all sibling prototypes
- **Select**: Click "Tenant Admin - Project Access"
- **Result**:
  - Switches to Tenant Admin prototype
  - Banner updates to "Use Case: Tenant Admin..."
  - Content updates to Tenant Admin's routes/components
  - URL stays the same

---

## **Visual States**

### **Inactive (Plain Text)**
```
Version: 1.0.0    ← No dropdown arrow, not clickable
```

### **Active (Dropdown)**
```
Version: v1.0 ▼   ← Dropdown arrow, clickable
```

### **Dropdown Open**
```
Version: v1.0 ▼
    ╔═══════════╗
    ║ v1.0  ✓   ║  ← Current
    ║ v1.1      ║
    ╚═══════════╝
```

---

## **Integration with Launcher**

### **Launcher → Prototype**
1. User clicks "Explore" on launcher card
2. Prototype loads
3. **Banner appears** with:
   - Back button
   - Version info
   - Use case selector (if applicable)

### **Prototype → Launcher**
1. User clicks "← Back to Launcher"
2. Prototype unloads
3. Returns to launcher grid
4. **Banner disappears**

### **Prototype → Prototype (Version Switch)**
1. User clicks "Version: v1.0 ▼"
2. Selects v1.1
3. Prototype v1.1 loads
4. **Banner stays** but updates to "Version: v1.1"
5. Content changes seamlessly

### **Prototype → Prototype (Use Case Switch)**
1. User clicks "Use Case: Fleet Admin ▼"
2. Selects "Tenant Admin"
3. Tenant Admin prototype loads
4. **Banner stays** but updates to "Use Case: Tenant Admin..."
5. Entire content changes

---

## **Examples**

### **Example 1: Cross Cluster Migration v1.0**

**Banner:**
```
← Back to Launcher          Version: v1.0 ▼
```

**User actions:**
- Click version dropdown → See v1.0 (current), v1.1
- Select v1.1 → Switch to enhanced version
- Click back button → Return to launcher

**No use case dropdown** because it's a standalone version group.

---

### **Example 2: Fleet Admin (ACM RBAC child)**

**Banner:**
```
← Back to Launcher    Version: 1.0.0    Use Case: Fleet Admin - Tenant... ▼
```

**User actions:**
- Version shows as text (no other versions)
- Click use case dropdown → See all ACM RBAC children
- Select Tenant Admin → Switch to that use case
- Click back button → Return to launcher

**Version is text** because ACM RBAC parent doesn't have versions.  
**Use case dropdown exists** because it's one of 3 siblings.

---

### **Example 3: Operator Lifecycle (Standalone)**

**Banner:**
```
← Back to Launcher          Version: 1.0.0
```

**User actions:**
- Only option: Click back button
- No version dropdown (no other versions)
- No use case dropdown (no siblings)

**Simplest banner** - just back button and version text.

---

## **Benefits**

### **✅ Easy Navigation**
- Always visible "Back to Launcher" button
- No need to use browser back button
- Clear exit path from any prototype

### **✅ Version Switching**
- Switch versions without leaving prototype
- Compare different iterations easily
- Seamless transitions

### **✅ Use Case Switching**
- Switch between related prototypes
- Stay in same parent context
- Quick comparison of different scenarios

### **✅ Context Awareness**
- Shows what's relevant for each prototype type
- Hides options that don't exist
- Clean, minimal interface

### **✅ Consistent Location**
- Always at top of page
- Same position in every prototype
- Predictable behavior

---

## **Technical Details**

### **Implementation**
- Lives in `PrototypeLayout.tsx`
- Wraps all prototype routes
- Uses `prototypeRegistry` to find versions/siblings
- Uses `usePrototype` hook for navigation

### **State Management**
- Version dropdown: Local state (`isVersionOpen`)
- Use case dropdown: Local state (`isUseCaseOpen`)
- Current prototype: Global context (`usePrototype`)

### **Performance**
- Versions computed once on render
- Siblings computed once on render
- No re-fetching on dropdown open
- Instant switching (local state)

---

## **Testing Steps**

1. **Launch any prototype** from launcher
2. **See banner** at top of page
3. **Check left**: "← Back to Launcher" button
4. **Check right**: Version + use case selectors
5. **Test version switching** (if available):
   - Click version dropdown
   - Select different version
   - See content update
6. **Test use case switching** (if available):
   - Click use case dropdown
   - Select different sibling
   - See prototype change
7. **Test back button**:
   - Click "← Back to Launcher"
   - Return to launcher grid

---

**Refresh and launch any prototype to see the new navigation banner!** 🚀

