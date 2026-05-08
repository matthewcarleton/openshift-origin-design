# Quick Guide: Create a New Version

## 5-Minute Version Creation

### **Step 1: Copy Existing Prototype** (30 seconds)

```bash
cd "/Users/skukla/Desktop/HPUX Prototypes"

# Copy your existing prototype
cp -r src/app/prototypes/fleet-admin-rbac src/app/prototypes/fleet-admin-rbac-v2
```

### **Step 2: Update Config** (2 minutes)

Open `src/app/prototypes/fleet-admin-rbac-v2/prototype.config.ts`:

```typescript
export const config: PrototypeConfig = {
  // ⭐ CHANGE THESE:
  id: 'fleet-admin-rbac-v2',           // Add version to ID
  
  // ⭐ ADD THESE (if not present):
  versionGroup: 'fleet-admin-rbac',     // Base name (same for all versions)
  version: 'v2',                        // Version number
  versionLabel: 'Design Iteration 2',  // Friendly name
  
  // KEEP THESE THE SAME:
  name: 'Fleet Admin - Tenant Delegation',
  parentId: 'acm-rbac-parent',
  childOrder: 1,
  
  // ... rest stays the same
};
```

### **Step 3: Update Original (if needed)** (1 minute)

If your original doesn't have version fields, add them:

Open `src/app/prototypes/fleet-admin-rbac/prototype.config.ts`:

```typescript
export const config: PrototypeConfig = {
  id: 'fleet-admin-rbac',  // Keep original ID
  
  // ⭐ ADD THESE:
  versionGroup: 'fleet-admin-rbac',
  version: 'v1',
  versionLabel: 'Initial Design',
  
  // ... rest stays the same
};
```

### **Step 4: Make Your Changes** (1 minute)

Edit files in `fleet-admin-rbac-v2/` folder:
- Update components
- Change designs
- Modify flows

### **Step 5: See It in Action** (30 seconds)

1. **Refresh browser**
2. **Go to launcher**
3. **Look at ACM RBAC card**
4. **Click dropdown** - see your versions!

```
ACM RBAC Prototypes
├─ Fleet Admin - Tenant Delegation
│   ├─ Initial Design (v1)
│   └─ Design Iteration 2 (v2) ← Your new version!
```

---

## One-Liner (for quick iterations)

```bash
cp -r src/app/prototypes/MY-PROTO src/app/prototypes/MY-PROTO-v2 && \
code src/app/prototypes/MY-PROTO-v2/prototype.config.ts
```

Then just update: `id`, `version`, `versionLabel`

---

## Common Scenarios

### **Create v2 from v1:**
```bash
cp -r prototypes/my-proto-v1 prototypes/my-proto-v2
# Edit config: id → 'my-proto-v2', version → 'v2'
```

### **Create final version:**
```bash
cp -r prototypes/my-proto-v2 prototypes/my-proto-final
# Edit config: id → 'my-proto-final', version → 'final'
```

### **Create dated version:**
```bash
cp -r prototypes/my-proto prototypes/my-proto-2024-11-06
# Edit config: version → '2024-11-06', versionLabel → 'November Review'
```

---

## Checklist

Before creating a version:
- [ ] Original prototype works
- [ ] Know what changes you want to make
- [ ] Have a clear version identifier (v1, v2, etc.)

When creating:
- [ ] Copy folder
- [ ] Update `id` in config
- [ ] Add/update `versionGroup`
- [ ] Add/update `version`
- [ ] Add/update `versionLabel` (optional)
- [ ] Keep `name` the same
- [ ] Keep `parentId` the same
- [ ] Keep `childOrder` the same

After creating:
- [ ] Refresh browser
- [ ] Check dropdown shows both versions
- [ ] Test switching between versions
- [ ] Make your design changes in new version

---

**That's it!** You can now iterate on designs without losing old work. 🎨

