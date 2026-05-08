# Draft Template System

## Overview

A new template system has been created for collaborators to easily create draft prototypes. The template provides a clean starting point with proper structure and guidelines.

## What's Been Done

### 1. Template Structure

**Location:** `src/app/prototypes/_template/`

The template includes:
- **prototype.config.ts** - Configuration with placeholder values
- **routes.tsx** - Route definitions
- **pages/HomePage.tsx** - Empty landing page
- **README.md** - Complete instructions for using the template

### 2. Template Features

#### Masthead Display
- Content name: "Your Name Here"
- Persona: "Your Persona Name Here" - "Your Role Here"

#### Perspective Selector
- **Core platforms**: ✅ Enabled (default)
- **Fleet management**: ❌ Disabled (shown as "Fleet management (Disabled)")
- **Fleet virtualization**: ❌ Disabled (shown as "Fleet virtualization (Disabled)")

#### Page Content
- Landing page has **no content** (ready for designers to add their own)
- All navigation pages are **empty by default**

#### Metadata
- Version: **1.0.0** (standard starting version)
- Status: **draft** (visible in Draft tab)

### 3. How Collaborators Use It

#### Step 1: Copy the template
```bash
cp -r src/app/prototypes/_template src/app/prototypes/my-new-prototype
```

#### Step 2: Update configuration
Edit `prototype.config.ts`:
- Change `id` to unique identifier
- Update `name` with prototype title
- Update `description`
- Change `owner.name`, `owner.slack`, `owner.email`
- Update `persona.name` and `persona.role`
- Adjust `perspectives` array if needed
- Add relevant `tags`

#### Step 3: Build pages
Add components in the `pages/` directory and update `routes.tsx`

#### Step 4: Save and test
The prototype will automatically appear in the launcher's "Draft" tab!

### 4. Perspective System

The new perspective system allows prototypes to enable/disable specific perspectives:

```typescript
// Example: Only Core platforms enabled
perspectives: ['core-platforms']

// Example: Multiple perspectives
perspectives: ['core-platforms', 'fleet-management']
```

**Disabled perspectives:**
- Show in dropdown with "(Disabled)" label
- Cannot be clicked
- Appear grayed out
- Help users understand what's available in this prototype

### 5. Changes to AppLayout

**New prop: `enabledPerspectives`**
- Accepts array of perspective keys
- Dynamically enables/disables perspectives
- Shows "(Disabled)" label in dropdown
- Sets initial active perspective to first enabled one

**Backward compatible:**
- If no `enabledPerspectives` provided, all perspectives are enabled
- Existing prototypes work without changes

## Example: Creating a New Draft

```bash
# 1. Copy template
cp -r src/app/prototypes/_template src/app/prototypes/cluster-wizard-v2

# 2. Edit src/app/prototypes/cluster-wizard-v2/prototype.config.ts
export const config: PrototypeConfig = {
  id: 'cluster-wizard-v2',
  name: 'Cluster Creation Wizard v2',
  description: 'Redesigned cluster creation wizard with improved UX.',
  
  owner: {
    name: 'Jane Designer',
    slack: '@jane',
    email: 'jane@redhat.com'
  },
  
  version: '1.0.0',
  status: 'draft',
  
  persona: {
    name: 'Alex the Admin',
    role: 'Cluster Administrator',
  },
  
  perspectives: ['fleet-management'], // Enable only Fleet management
  tags: ['clusters', 'wizard', 'ux-research'],
  
  createdAt: '2025-01-10',
  updatedAt: '2025-01-10',
};

# 3. Build your pages...
# 4. Save and refresh - it appears in the launcher!
```

## Testing the Template

1. Navigate to the launcher page
2. Click on "Draft" tab
3. You'll see "Example Draft Prototype"
4. Click "Explore" to launch it
5. Verify:
   - ✅ Masthead shows "Your Name Here" and "Your Persona Name Here"
   - ✅ Perspective selector shows Core platforms (enabled)
   - ✅ Fleet management shows "(Disabled)"
   - ✅ Fleet virtualization shows "(Disabled)"
   - ✅ Landing page is empty

## Benefits

### For Designers
- **Quick start** - Copy, configure, build
- **No setup required** - Template is ready to use
- **Clear structure** - Organized directory layout
- **Complete documentation** - README with examples

### For Developers
- **Consistent structure** - All prototypes follow same pattern
- **Auto-discovery** - Webpack automatically finds new prototypes
- **Type safety** - TypeScript catches config errors
- **Isolated** - Each prototype is independent

### For Team
- **Collaboration** - Multiple people can work simultaneously
- **Version control** - Each prototype tracks separately in git
- **Easy review** - Clear diff for each prototype
- **Organized** - Draft/Active/Archived status management

## Next Steps

1. ✅ Template created and tested
2. ✅ Documentation written
3. ✅ Perspective system implemented
4. ✅ Example draft visible in launcher
5. 📝 Team can now create new prototypes using the template!

---

**The template system is ready for collaboration!** 🎉

