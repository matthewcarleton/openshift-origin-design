# ✅ Single Card Versioning - How It Works

## The Problem You Identified

You expected: **ONE card with a version toggle**  
What I initially described: **Multiple cards (one per version)**

You were absolutely right! The system now works exactly as you expected.

---

## **How It Works Now**

### **One Card, Multiple Versions**

```
┌─────────────────────────────────────────────────────┐
│ Cross Cluster Live Migration        [2 versions]    │  ← Single card
│                                                      │
│ Description...                                       │
│                                                      │
│ ┌────────────────────────┬──┐                       │
│ │ Initial Design         │▼ │  ← Version toggle     │
│ └────────────────────────┴──┘                       │
└──────────────────────────────────────────────────────┘

Click dropdown:
├─ Initial Design (current)
└─ Enhanced Progress Tracking
```

---

## **What Changed**

### **Before:**
- `cross-cluster-migration` → Separate card
- `cross-cluster-migration-v1.1` → Separate card

❌ **Two cards for the same prototype**

### **After:**
- Both versions grouped into **ONE card**
- Split button to toggle between versions
- Badge shows "2 versions"

✅ **One card with version selector**

---

## **The Technical Solution**

### **1. Version Grouping**

The launcher now **automatically groups** prototypes by their `versionGroup`:

```typescript
// These two prototypes...
{
  id: 'cross-cluster-migration',
  versionGroup: 'cross-cluster-migration',
  version: 'v1.0',
}

{
  id: 'cross-cluster-migration-v1.1',
  versionGroup: 'cross-cluster-migration',  // Same group!
  version: 'v1.1',
}

// ...become ONE card with 2 versions
```

### **2. Card Types**

The launcher now recognizes three card types:

1. **`parent`** - Has children (like ACM RBAC)
   - Shows: "X variants"
   - Split button lists children

2. **`versionGroup`** - Has versions (like Cross Cluster Migration)
   - Shows: "X versions"
   - Split button lists versions

3. **`standalone`** - Single prototype (like Operator Lifecycle, if no versions)
   - No badge
   - Direct launch button

---

## **UI Behavior**

### **Cross Cluster Live Migration Card**

**Card Header:**
```
┌─────────────────────────────────────────┐
│ [Active]                                │
│                                         │
│ Cross Cluster Live Migration [2 versions]
│                                         │
│ Move 80 running VMs from...            │
└─────────────────────────────────────────┘
```

**Split Button (Footer):**
```
┌────────────────────────┬──┐
│ Initial Design         │▼ │  ← Launches last-used version
└────────────────────────┴──┘
      ↑                    ↑
   Primary button      Dropdown
```

**Dropdown Options:**
```
╔═══════════════════════════════════╗
║ Initial Design (current)          ║  ← Currently selected
║ Enhanced Progress Tracking        ║  ← Switch to v1.1
╚═══════════════════════════════════╝
```

---

## **User Experience**

### **First Time:**
1. See card with "2 versions" badge
2. Click primary button → Launches v1.0 (first version)
3. System remembers your choice

### **Next Time:**
1. Card shows last-used version on button: "Initial Design"
2. Click to launch v1.0 again
3. Or click dropdown to switch to v1.1

### **After Switching to v1.1:**
1. Return to launcher
2. Card now shows: "Enhanced Progress Tracking"
3. That's your new default until you switch again

---

## **Version Management**

### **Memory System**

The launcher uses `localStorage` to remember your last choice:

```javascript
localStorage.setItem('lastUsedChild_cross-cluster-migration', 'cross-cluster-migration-v1.1');
```

**Key:** `lastUsedChild_{versionGroup}`  
**Value:** ID of last launched version

This persists across:
- Browser refreshes
- Switching to other prototypes
- Days/weeks of usage

---

## **Comparison: Parents vs Version Groups**

### **ACM RBAC (Parent)**

```
┌─────────────────────────────────────┐
│ ACM RBAC Prototypes   [3 variants]  │  ← Parent card
│                                     │
│ ┌──────────────────────────┬──┐    │
│ │ Fleet Admin - Tenant...  │▼ │    │  ← Dropdown shows:
│ └──────────────────────────┴──┘    │     - Fleet Admin
└─────────────────────────────────────┘     - Tenant Admin
                                            - RBAC Empty States
```

### **Cross Cluster Migration (Version Group)**

```
┌─────────────────────────────────────┐
│ Cross Cluster Migration [2 versions]│  ← Version group card
│                                     │
│ ┌──────────────────────────┬──┐    │
│ │ Initial Design           │▼ │    │  ← Dropdown shows:
│ └──────────────────────────┴──┘    │     - Initial Design
└─────────────────────────────────────┘     - Enhanced Progress
```

**Key Difference:**
- **Parents**: Different use cases/scenarios (Fleet Admin vs Tenant Admin)
- **Versions**: Different iterations of the same scenario (v1.0 vs v1.1)

---

## **Creating New Versions**

### **Step 1: Copy Prototype**
```bash
cp -r src/app/prototypes/cross-cluster-migration \
      src/app/prototypes/cross-cluster-migration-v1.2
```

### **Step 2: Update Config**
```typescript
// src/app/prototypes/cross-cluster-migration-v1.2/prototype.config.ts

export const config: PrototypeConfig = {
  id: 'cross-cluster-migration-v1.2',        // ⭐ New ID
  name: 'Cross Cluster Live Migration',     // Same name
  
  versionGroup: 'cross-cluster-migration',  // ⭐ Same group
  version: 'v1.2',                          // ⭐ New version
  versionLabel: 'Final Design',             // ⭐ New label
  
  // ... rest of config
};
```

### **Step 3: That's It!**

The launcher automatically:
- Detects the new version
- Groups it with v1.0 and v1.1
- Updates the badge to "3 versions"
- Adds it to the dropdown

---

## **Benefits**

### **For Designers:**
✅ One card per project, not per version  
✅ Easy to switch between iterations  
✅ Compare old vs new designs  
✅ Keep history without clutter  

### **For Stakeholders:**
✅ See all versions in one place  
✅ Clear "current" indicator  
✅ Easy to switch and review  
✅ Understand design evolution  

### **For the Launcher:**
✅ Cleaner grid (fewer cards)  
✅ Grouped by project, not version  
✅ Version count visible at a glance  
✅ Logical organization  

---

## **Current State**

### **Your Launcher Now Shows:**

1. **ACM RBAC Prototypes** [3 variants] ← Parent
   - Fleet Admin - Tenant Delegation
   - Tenant Admin - Project Access
   - RBAC Empty States

2. **Virtualization Admin Prototypes** [2 variants] ← Parent
   - Quotas & Resource Management
   - Virtualization Empty States

3. **Cross Cluster Live Migration** [2 versions] ← Version Group! 🎉
   - Initial Design (v1.0)
   - Enhanced Progress Tracking (v1.1)

4. **Operator Lifecycle** ← Standalone

---

**Refresh your browser to see the single-card version system in action!** 🚀

The Cross Cluster Live Migration card should now be:
- **One card** (not two)
- **Badge**: "2 versions"
- **Split button**: Toggle between v1.0 and v1.1
- **Blue left border**: Indicates it has multiple options

