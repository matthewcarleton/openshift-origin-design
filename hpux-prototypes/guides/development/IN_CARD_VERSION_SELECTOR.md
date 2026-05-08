# ✅ In-Card Version Selector - Interactive UX

## **The New Design**

You asked for a **better UX**: instead of a split button at the bottom, the version selector is **inside the card** and **updates the description in real-time**!

---

## **How It Works**

### **Before (Old Split Button Approach):**
```
┌─────────────────────────────────────┐
│ Cross Cluster Live Migration        │
│                                     │
│ Generic description...              │
│                                     │
│ ┌──────────────────────────┬──┐    │
│ │ Initial Design           │▼ │    │  ← Had to click to see versions
│ └──────────────────────────┴──┘    │
└─────────────────────────────────────┘
```

### **After (New In-Card Selector):**
```
┌─────────────────────────────────────────────────────┐
│ [Active]                    [ Initial Design  ▼ ]   │  ← Version selector in header!
│                                                     │
│ Cross Cluster Live Migration         [2 versions]  │
│                                                     │
│ Move 80 running VMs from... (v1.0 description)     │  ← Description updates!
│                                                     │
│ Owner: Platform Team                                │
│ Persona: Nelson Gardner                             │
│                                                     │
│                               [ Launch ]            │  ← Single launch button
└─────────────────────────────────────────────────────┘

User clicks dropdown:
├─ Initial Design
└─ Enhanced Progress Tracking

User selects "Enhanced Progress Tracking":
→ Card description changes to v1.1's description
→ Card persona/owner update (if different)
→ Launch button now launches v1.1
```

---

## **User Flow**

### **1. See Card with Version Selector**
```
┌─────────────────────────────────────────────┐
│ [Active]            [ Initial Design  ▼ ]   │  ← Dropdown visible
│                                             │
│ Cross Cluster Live Migration  [2 versions] │
│                                             │
│ Description for Initial Design...           │
└─────────────────────────────────────────────┘
```

### **2. Click Version Dropdown**
```
╔═══════════════════════════════════╗
║ Initial Design          ✓         ║  ← Currently selected
║ Enhanced Progress Tracking        ║
╚═══════════════════════════════════╝
```

### **3. Select Different Version**
```
User clicks "Enhanced Progress Tracking"
↓
Card updates instantly:
┌─────────────────────────────────────────────────────┐
│ [Active]     [ Enhanced Progress Tracking  ▼ ]     │  ← Updated!
│                                                     │
│ Cross Cluster Live Migration         [2 versions]  │
│                                                     │
│ Enhanced migration flow with improved progress...  │  ← New description!
│                                                     │
│ Owner: Platform Team                                │
│ Persona: Nelson Gardner                             │
│                                                     │
│                               [ Launch ]            │
└─────────────────────────────────────────────────────┘
```

### **4. Click Launch**
```
Button launches the currently selected version (v1.1)
```

---

## **Benefits of This Design**

### **✅ Better User Experience**

1. **Preview before launch**
   - See each version's description without launching
   - Compare descriptions side-by-side (in your mind)
   - Make informed decision

2. **Clear selection state**
   - Dropdown shows current selection
   - Description matches selected version
   - No confusion about what will launch

3. **Cleaner UI**
   - Version selector integrated into card header
   - Single "Launch" button (not split)
   - Less visual clutter

4. **Interactive feedback**
   - Instant description updates
   - Metadata updates (persona, owner if different)
   - Tags update too

---

## **Technical Implementation**

### **1. State Management**

```typescript
// Track selected version for each version group
const [selectedVersions, setSelectedVersions] = useState<Map<string, string>>(new Map());

// Get selected version (or default to last used / first)
const getSelectedVersion = (cardId: string, versions: PrototypeModule[]): PrototypeModule => {
  // 1. Check session selection (user just picked it)
  // 2. Fall back to localStorage (last launched)
  // 3. Default to first version
};

// Handle version selection
const handleVersionSelect = (cardId: string, versionId: string) => {
  setSelectedVersions(prev => {
    const next = new Map(prev);
    next.set(cardId, versionId);
    return next;
  });
};
```

### **2. Card Rendering**

```typescript
// For version groups, get the selected version
const selectedVersion = card.type === 'versionGroup' 
  ? getSelectedVersion(cardId, children)
  : null;

// Use selected version's config for display
const displayPrototype = selectedVersion || prototype;

// Card shows:
// - displayPrototype.config.description  (updates!)
// - displayPrototype.config.persona      (updates!)
// - displayPrototype.config.owner        (updates!)
// - displayPrototype.config.tags         (updates!)
```

### **3. Version Selector in Header**

```typescript
<CardHeader>
  <Flex justifyContent="spaceBetween">
    <FlexItem>
      <Label color={getStatusColor(displayPrototype.config.status)}>
        {displayPrototype.config.status}
      </Label>
    </FlexItem>
    
    {/* Version selector for version groups */}
    {card.type === 'versionGroup' && (
      <FlexItem>
        <Select
          onSelect={(_, value) => {
            handleVersionSelect(cardId, value);
          }}
          toggle={
            <MenuToggle>
              {selectedVersion?.config.versionLabel || 'Select version'}
            </MenuToggle>
          }
        >
          <SelectList>
            {children.map(version => (
              <SelectOption value={version.config.id}>
                {version.config.versionLabel || version.config.version}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      </FlexItem>
    )}
  </Flex>
</CardHeader>
```

### **4. Simple Launch Button**

```typescript
{card.type === 'versionGroup' ? (
  // Simple launch button for version groups
  <Button
    variant="primary"
    onClick={() => {
      if (selectedVersion) {
        handlePrototypeSelectWithMemory(selectedVersion.config.id, cardId);
      }
    }}
  >
    Launch
  </Button>
) : (
  // Split button for parent prototypes (ACM RBAC, etc.)
  <SplitButton ... />
)}
```

---

## **Comparison: Parents vs Version Groups**

### **Parent Prototypes (ACM RBAC)**
- **Split button** at bottom (Fleet Admin, Tenant Admin, Empty States)
- Each child is a **different scenario**
- No version selector in card
- Description doesn't change

### **Version Groups (Cross Cluster Migration)**
- **Dropdown** in card header (v1.0, v1.1, v1.2...)
- Each version is an **iteration of same scenario**
- Description **updates in real-time**
- Simple "Launch" button

---

## **What Updates When You Change Version**

When you select a different version from the dropdown:

### **Updates Instantly:**
✅ **Description text**  
✅ **Owner** (if different between versions)  
✅ **Persona** (if different between versions)  
✅ **Tags** (if different between versions)  
✅ **Dropdown label** (shows selected version)  

### **Stays Same:**
🔒 **Card title** (e.g., "Cross Cluster Live Migration")  
🔒 **Status badge** (Active/Draft/Archived)  
🔒 **Version count badge** (e.g., "2 versions")  
🔒 **Card position** in grid  

---

## **Memory System**

### **Session Memory (Immediate)**
When you select a version, it's stored in React state:
```typescript
selectedVersions.set('cross-cluster-migration', 'cross-cluster-migration-v1.1');
```

This persists:
- ✅ While browsing the launcher
- ✅ When switching between tabs (Active/Draft/etc.)
- ❌ On page refresh

### **Launch Memory (Persistent)**
When you click "Launch", it saves to localStorage:
```typescript
localStorage.setItem('lastUsedChild_cross-cluster-migration', 'cross-cluster-migration-v1.1');
```

This persists:
- ✅ On page refresh
- ✅ Across days/weeks
- ✅ Between browser sessions

---

## **Example: Switching Versions**

### **Step 1: Initial State**
```
Dropdown shows: "Initial Design"
Description: "Move 80 running VMs from core-billing..."
Persona: Nelson Gardner - Platform Administrator
```

### **Step 2: Click Dropdown**
```
╔═══════════════════════════════════╗
║ Initial Design          ✓         ║
║ Enhanced Progress Tracking        ║
╚═══════════════════════════════════╝
```

### **Step 3: Select v1.1**
```
Dropdown shows: "Enhanced Progress Tracking"
Description: "Enhanced migration flow with improved progress tracking and rollback options..."
Persona: Nelson Gardner - Platform Administrator
```

### **Step 4: Click Launch**
```
Launches: cross-cluster-migration-v1.1
Saves to localStorage for next time
```

---

## **Creating New Versions**

### **Add v1.2:**

```bash
# Copy existing version
cp -r src/app/prototypes/cross-cluster-migration-v1.1 \
      src/app/prototypes/cross-cluster-migration-v1.2
```

Update config:
```typescript
// src/app/prototypes/cross-cluster-migration-v1.2/prototype.config.ts

export const config: PrototypeConfig = {
  id: 'cross-cluster-migration-v1.2',
  name: 'Cross Cluster Live Migration',
  description: 'Final design with automated rollback and validation.',
  
  versionGroup: 'cross-cluster-migration',  // Same group!
  version: 'v1.2',
  versionLabel: 'Final Design',
  
  // ... rest
};
```

**Result:**
- Dropdown now shows 3 options
- Badge updates to "3 versions"
- Can select any version from dropdown
- Each shows its own description

---

## **Why This is Better**

### **Old Way (Split Button):**
```
1. See card with generic description
2. Click split button dropdown
3. See version names in list
4. Click one → launches immediately
5. Can't preview without launching
```

### **New Way (In-Card Selector):**
```
1. See card with current version's description
2. Click version dropdown in header
3. Select different version
4. See description update instantly
5. Read new description, decide
6. Click "Launch" when ready
```

---

## **Testing Steps**

1. **Refresh browser** (`⌘ + R`)
2. **Clear session** (F12 → Console → `sessionStorage.clear()`)
3. **Find Cross Cluster Live Migration card**
4. **Look at the header** → See version dropdown
5. **Current selection**: "Initial Design"
6. **Read description**: "Move 80 running VMs..."
7. **Click dropdown** → See both versions
8. **Select "Enhanced Progress Tracking"**
9. **Watch description change** → "Enhanced migration flow..."
10. **Click "Launch"** → Launches v1.1

---

## **Current State**

### **Your Launcher Shows:**

1. **ACM RBAC Prototypes** [3 variants]
   - Split button (Fleet Admin, Tenant Admin, Empty States)
   - No version selector

2. **Virtualization Admin Prototypes** [2 variants]
   - Split button (Quotas, Empty States)
   - No version selector

3. **Cross Cluster Live Migration** [2 versions] 🎉
   - **Version dropdown in header**
   - **Description updates on select**
   - **Simple Launch button**

4. **Operator Lifecycle**
   - Regular standalone
   - Direct launch button

---

**Refresh and try the new interactive version selector!** 🚀

The card will now update in real-time as you explore different versions.

