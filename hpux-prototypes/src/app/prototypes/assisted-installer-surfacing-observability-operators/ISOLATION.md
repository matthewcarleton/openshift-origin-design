# Template Isolation Guarantee

## ✅ Complete Isolation Confirmed

This template prototype is **100% isolated**. Changes to this template will **ONLY** affect the template prototype itself, never other prototypes.

## How Isolation Works

### 1. **Navigation Isolation**
- ✅ Template routes are **only active** when template is the active prototype
- ✅ AppLayout uses `currentPrototypeId` to determine which prototype's routes to use
- ✅ When template is **not active**, its routes are **completely ignored**
- ✅ Template has **empty routes array** - no navigation impact even when active
- ✅ Navigation merging only happens for the **currently active prototype**

**Code Reference:**
- `AppLayout.tsx` lines 881-926: Only uses routes if `currentPrototypeId` matches
- `PrototypeLayout.tsx` line 237: Passes `currentPrototypeId` to AppLayout
- Template routes are filtered by `currentPrototypeId` check

### 2. **Masthead Isolation**
- ✅ Masthead receives `useCaseTitle` and `useCasePersona` from prototype config
- ✅ These values are **prototype-specific** and only affect the active prototype
- ✅ When template is **not active**, its config values are **not used**
- ✅ Masthead is rendered per-prototype, not globally

**Code Reference:**
- `PrototypeLayout.tsx` lines 183-186, 233-234: Formats owner/persona from prototype config
- `AppLayout.tsx` line 108: Receives `useCaseTitle` and `useCasePersona` as props
- Values are scoped to the active prototype only

### 3. **CSS Classes (template-page-*)**
- ✅ CSS classes are in **global CSS** (`app.css`)
- ✅ These are **styling utilities** that can be used by any prototype
- ✅ They don't create dependencies - they're just CSS
- ✅ Other prototypes can use these classes if they want (they're utilities)
- ✅ Template-specific documentation (PAGE_TEMPLATE.md) explains how to use them

**Note:** These classes are intentionally global utilities. They don't create dependencies or affect functionality.

### 4. **Rules and Templates Documentation**
- ✅ **PAGE_TEMPLATE.md** - Only in `_template/` directory
- ✅ **WIZARD_PATTERN.md** - Only in `_template/` directory  
- ✅ **README.md** - Only in `_template/` directory
- ✅ These are **documentation files only** - no code dependencies
- ✅ They're **copied** when someone copies the template directory
- ✅ They don't affect other prototypes at all

### 5. **Prototype Registry**
- ✅ Template is **discovered separately** by PrototypeRegistry
- ✅ Each prototype has its own entry in the registry
- ✅ Template's ID: `example-draft-prototype`
- ✅ Registry doesn't create dependencies between prototypes
- ✅ Prototypes are **loaded independently**

**Code Reference:**
- `PrototypeRegistry.ts` lines 225-305: Each prototype is loaded independently
- Template is just another entry in the registry
- No cross-prototype dependencies

### 6. **Component Isolation**
- ✅ All template components are in `_template/` directory
- ✅ Components use **relative imports** within the template
- ✅ No shared component dependencies (except safe shared library)
- ✅ Safe shared imports:
  - `@app/core/types` - Type definitions only (no runtime code)
  - `@app/shared/components` - Shared library (intentionally shared)
  - PatternFly components - External library

### 7. **State Isolation**
- ✅ Each prototype has its own React component tree
- ✅ No shared global state between prototypes
- ✅ Template's state is **completely separate** from other prototypes
- ✅ When template is unloaded, all its state is destroyed

**Code Reference:**
- `PrototypeContext.tsx`: Each prototype is loaded/unloaded independently
- `PrototypeLayout.tsx`: Creates separate component tree per prototype
- No global state sharing

## Verification Checklist

✅ **Navigation**: Only affects template when active (and template has no routes anyway)  
✅ **Masthead**: Only affects template when active  
✅ **CSS Classes**: Global utilities (intentional - no dependencies)  
✅ **Documentation**: Only in template directory  
✅ **Components**: All in template directory  
✅ **State**: Completely isolated  
✅ **Registry**: Independent entry  
✅ **Routes**: Empty array (no navigation impact)  

## Conclusion

**The template is 100% isolated.** 

- When template is **active**: Only its routes/config affect navigation/masthead
- When template is **not active**: It has **zero impact** on other prototypes
- Documentation and rules are **only in template directory**
- CSS classes are **global utilities** (intentional design)
- No cross-prototype dependencies or shared state

## For New Collaborators

When you copy the `_template` directory:
1. You get all the documentation (PAGE_TEMPLATE.md, WIZARD_PATTERN.md, README.md)
2. You get example pages (NewPage.tsx, ItemsPage.tsx, etc.)
3. You get example components (WizardTemplate.tsx, FullPageWizard.tsx)
4. You can use the CSS classes (template-page-*) - they're utilities
5. Your new prototype will be **completely isolated** from the template and other prototypes

