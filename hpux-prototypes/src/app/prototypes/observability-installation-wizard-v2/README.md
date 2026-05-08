# Observability Installation Wizard — Version 2

This is **Version 2** of the Cluster Observability Operator Installation Wizard. It is a full copy of the current (v1) prototype. All changes in this directory are isolated: they do not affect the original `observability-installation-wizard` prototype. Use v2 for new iterations and experiments.

## Quick Start

**⚠️ IMPORTANT:** Follow the optimal workflow in `guides/getting-started/COLLABORATOR_WORKFLOW.md`

### Recommended Workflow

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kuklas/HPUX-Prototypes.git
   cd HPUX-Prototypes
   ```

2. **Create your feature branch FIRST:**
   ```bash
   git checkout ux-prototypes
   git pull origin ux-prototypes
   git checkout -b your-name-prototype-name
   ```

3. **Copy the template:**
   ```bash
   cp -r src/app/prototypes/_template src/app/prototypes/your-prototype-name
   ```

4. **Update `prototype.config.ts`:**
   - Change `id`, `name`, `description`
   - Set `owner`, `persona`, `status`
   - Configure `perspectives` and `tags`

5. **Customize your prototype:**
   - Edit `pages/HomePage.tsx` for your landing page
   - Add routes in `routes.tsx`
   - Create your components in `components/`

6. **Test your prototype:**
   - Run `npm start`
   - Navigate to the prototype launcher
   - Click on your prototype card

**See `guides/getting-started/COLLABORATOR_WORKFLOW.md` for complete workflow details.**

## Structure

```
_template/
├── README.md                          # This file
├── WIZARD_PATTERN.md                  # Wizard pattern guidelines
├── PAGE_TEMPLATE.md                   # Standard page layout pattern (MANDATORY)
├── PAGE_TEMPLATE_BOILERPLATE.tsx      # Copy-paste template for new pages
├── prototype.config.ts                 # Prototype configuration
├── routes.tsx                         # Route definitions
├── pages/
│   ├── HomePage.tsx                   # Landing page
│   ├── NewPage.tsx                    # Example page with standard layout
│   └── OverviewPage.tsx               # Example page with buttons (uses template)
└── components/
    └── ExampleWizard.tsx               # Example wizard component
```

## Components

### ExampleWizard

A complete example of the CCLM-style wizard pattern. See `WIZARD_PATTERN.md` for details.

**Usage:**
```typescript
import { ExampleWizard } from '../components/ExampleWizard';

const [isWizardOpen, setIsWizardOpen] = useState(false);

<Button onClick={() => setIsWizardOpen(true)}>Open Wizard</Button>
<ExampleWizard
  isOpen={isWizardOpen}
  onClose={() => setIsWizardOpen(false)}
  onFinish={(data) => {
    console.log('Wizard completed:', data);
  }}
/>
```

## Patterns

### Standard Page Layout Pattern

**🚨 MANDATORY RULE FOR AI ASSISTANTS:** When creating ANY new page or navigation item, you MUST automatically use the standard page layout. Do NOT ask the user - just apply it automatically.

**This rule applies to:**
- All new pages
- All navigation items
- All subnav items
- Any page layout request

**There are NO exceptions. Every page MUST follow this pattern.**

**Required Structure:**
1. **Breadcrumbs Section** - 16px padding (`template-page-breadcrumb`)
2. **Heading Section** - 24px padding (`template-page-heading`)
   - Title (h1, 2xl)
   - Description
3. **Content Area** - 24px padding (`template-page-content`)
   - Card wrapper (`table-content-card`)
   - Toolbar (bulk selector, filter, search, primary button, pagination)
   - Table (with selection checkboxes)
   - Pagination (bottom)

**See `PAGE_TEMPLATE.md` for:**
- Complete structure requirements
- CSS classes and padding values
- Complete code example
- Quick reference guide
- Rules and best practices

**Key Rules:**
- ✅ **ALWAYS** use the exact CSS classes - they have `!important` flags
- ✅ **ALWAYS** include all three sections (breadcrumbs, heading, content)
- ✅ **ALWAYS** wrap table in `table-content-card` div
- ✅ **ALWAYS** include pagination at top and bottom
- ✅ **NEVER** use inline padding - use CSS classes
- ✅ **NEVER** skip any section

**Quick Start:**
1. **Copy the boilerplate:** Use `PAGE_TEMPLATE_BOILERPLATE.tsx` as your starting point
2. **Rename the component:** Change `YourNewPage` to your page name
3. **Customize the content:** Update title, description, table data, etc.
4. **Keep the structure:** DO NOT modify the layout structure or CSS classes

**Examples:**
- `pages/NewPage.tsx` - Complete working example with table
- `pages/OverviewPage.tsx` - Example with buttons (uses template structure)

### Modal and Wizard Patterns

**IMPORTANT:** When creating modals or wizards, ALWAYS use the provided standard components.

**Three Pattern Types:**

1. **Standard Modal** - Use `StandardModal` component (simple dialogs with text/buttons)
   - Location: `@app/shared/components/feedback/StandardModal`
   - Use for: Information dialogs, confirmations, simple forms

2. **Wizard in Modal** - Use `WizardTemplate` component (multi-step workflows in modal)
   - Location: `components/WizardTemplate`
   - Use for: Multi-step forms, configuration wizards, setup workflows

3. **Full-Page Wizard** - Use `FullPageWizard` component (full-page workflows with breadcrumbs)
   - Location: `components/FullPageWizard`
   - Use for: Complex workflows, creation flows, wizards needing more space

See `WIZARD_PATTERN.md` for:
- Complete structure requirements
- Color palette
- Step-by-step implementation guide
- Code examples for all three patterns
- Decision tree for choosing the right component

**Key Rules:**
- ✅ **ALWAYS** use the provided components - they handle padding, spacing, and layout correctly
- ✅ **NEVER** create custom modal or wizard layouts - you'll waste time troubleshooting padding issues
- ✅ **NEVER** add padding to step components in full-page wizards - only breadcrumbs and header have padding
- ✅ The components use CSS classes with `!important` flags to ensure padding works correctly

## Navigation System

### How Navigation Works

**CRITICAL:** Your prototype routes are **MERGED** with default navigation, not replacing it.

#### Default Navigation (Always Present)

The system provides default navigation for all three perspectives:

- **Core platforms:** Home, Virtualization, Operators, Workloads, Networking, Storage, etc.
- **Fleet virtualization:** Overview, Catalog, Virtual machines, Templates, InstanceTypes, etc.
- **Fleet management:** Infrastructure, Applications, Credentials, Observe, Edge management, etc.

#### Your Prototype Routes

When you define routes in `routes.tsx`:

1. **Routes with `navigation` metadata** appear in the sidebar
2. **Routes are filtered by perspective** based on path:
   - **Fleet management:** Routes NOT starting with `/core` or `/virtualization`
   - **Fleet virtualization:** Routes starting with `/virtualization` or `/user-management`
   - **Core platforms:** Routes starting with `/core`

3. **Group Merging:**
   - If your route has `navigation.group: 'User management'` and a default group with the same label exists, **your routes REPLACE that default group**
   - If your route has a new group name (e.g., `'Main'`), it's **ADDED to the navigation**

4. **Routes without `navigation` metadata:**
   - Still accessible via URL
   - Won't appear in sidebar navigation
   - Use for detail pages, wizards, modals, etc.

#### Example Route Configuration

```typescript
{
  path: '/my-page',
  element: <MyPage />,
  label: 'My Page',           // Required: Navigation label
  title: 'My Page',           // Required: Browser tab title
  navigation: {               // Required: Navigation metadata
    group: 'Main',            // Group name (empty string = top-level item)
    order: 1,                 // Sort order within group (lower = first)
  }
}
```

#### Common Mistakes to Avoid

❌ **Don't:** Define routes without `navigation` metadata and expect them in navigation
```typescript
// This route won't appear in navigation
{
  path: '/my-page',
  element: <MyPage />,
  // Missing navigation metadata!
}
```

❌ **Don't:** Use wrong path prefixes for the perspective
```typescript
// This won't show in Fleet management (starts with /core)
{
  path: '/core/my-page',  // Wrong! Use '/' or '/my-page' for Fleet management
  navigation: { group: 'Main' }
}
```

✅ **Do:** Always include `navigation` metadata for routes that should appear in sidebar
```typescript
{
  path: '/my-page',
  element: <MyPage />,
  label: 'My Page',
  title: 'My Page',
  navigation: {
    group: 'Main',
    order: 1,
  }
}
```

✅ **Do:** Use correct path prefixes for your target perspective
```typescript
// For Fleet management
{ path: '/my-page', navigation: { group: 'Main' } }

// For Core platforms
{ path: '/core/my-page', navigation: { group: 'My Group' } }

// For Fleet virtualization
{ path: '/virtualization/my-page', navigation: { group: 'My Group' } }
```

## Best Practices

1. **Isolation:** Keep all prototype-specific code within your prototype directory
2. **Consistency:** Use established patterns (wizards, modals, layouts)
3. **Navigation:** Always include `navigation` metadata for routes that should appear in sidebar
4. **Documentation:** Document any custom patterns or components
5. **Testing:** Test your prototype thoroughly before sharing

## Resources

- PatternFly Documentation: https://www.patternfly.org/
- Shared Components: `src/app/shared/`
- Example Wizard: `components/ExampleWizard.tsx`
- Wizard Pattern Guide: `WIZARD_PATTERN.md`
- **Page Template Guide: `PAGE_TEMPLATE.md` (MANDATORY - READ THIS FIRST)**
- **Page Template Boilerplate: `PAGE_TEMPLATE_BOILERPLATE.tsx` (COPY THIS FOR NEW PAGES)**
- Example Pages:
  - `pages/NewPage.tsx` - Complete example with table
  - `pages/OverviewPage.tsx` - Example with buttons
