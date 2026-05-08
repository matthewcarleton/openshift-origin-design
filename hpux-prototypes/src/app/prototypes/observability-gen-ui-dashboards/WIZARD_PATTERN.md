# Modal and Wizard Patterns for Template

## Rule: Use Standard Components for Modals and Wizards

**When creating modals or wizards, ALWAYS use the provided standard components.**

This ensures consistency across all prototypes and matches the established design patterns. All components handle padding, spacing, and layout correctly.

## Three Pattern Types

### 1. Standard Modal (for simple dialogs)
Use `StandardModal` component for simple modals with text content and buttons.

**When to use:**
- Simple information dialogs
- Confirmation dialogs
- Single-action forms
- Text-only content

**Component:** `@app/shared/components/feedback/StandardModal`

### 2. Wizard in Modal (for multi-step workflows in dialogs)
Use `WizardTemplate` component for multi-step wizards that open in a modal dialog.

**When to use:**
- Multi-step forms in a modal
- Configuration wizards
- Setup workflows
- Any wizard that should appear in a modal overlay

**Component:** `components/WizardTemplate` (template-specific)

### 3. Full-Page Wizard (for full-page workflows)
Use `FullPageWizard` component for wizards that take up the entire page with breadcrumbs and header.

**When to use:**
- Complex multi-step workflows
- Wizards that need more space
- Wizards with breadcrumb navigation
- Full-page creation flows

**Component:** `components/FullPageWizard` (template-specific)

**CRITICAL:** Always use the provided components - they handle padding, spacing, and layout correctly. Don't create custom modal or wizard layouts.

## Quick Start Guide

### Standard Modal

**Use for:** Simple dialogs with text content and buttons.

```typescript
import { StandardModal } from '@app/shared/components/feedback';

const [isModalOpen, setIsModalOpen] = useState(false);

<Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
<StandardModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  content="This is the modal content text."
  actionButtonLabel="Close"
  buttonPosition="left"
/>
```

**See:** `pages/HomePage.tsx` for complete examples.

### Wizard in Modal

**Use for:** Multi-step workflows in a modal dialog.

```typescript
import { WizardTemplate } from '../components/WizardTemplate';

const [isWizardOpen, setIsWizardOpen] = useState(false);

<Button onClick={() => setIsWizardOpen(true)}>Open Wizard</Button>
<WizardTemplate
  isOpen={isWizardOpen}
  onClose={() => setIsWizardOpen(false)}
  onFinish={(data) => {
    console.log('Wizard completed:', data);
    setIsWizardOpen(false);
  }}
  title="My Wizard"
  description="This is a wizard in a modal."
  steps={[
    {
      number: 1,
      name: 'Step One',
      component: <div>Step one content</div>
    },
    {
      number: 2,
      name: 'Step Two',
      component: <div>Step two content</div>
    }
  ]}
/>
```

**See:** `components/WizardTemplate.tsx` and `pages/HomePage.tsx` for examples.

### Full-Page Wizard

**Use for:** Full-page workflows with breadcrumbs.

See the "Full-Page Wizard Pattern" section below for complete documentation.

## Required Structure

### 1. Modal Setup
```typescript
<Modal
  variant={ModalVariant.large}
  isOpen={isOpen}
  onClose={handleCancel}
  style={{ 
    '--pf-v6-c-modal-box--m-body--PaddingTop': '0',
    '--pf-v6-c-modal-box--m-body--PaddingRight': '0',
    '--pf-v6-c-modal-box--m-body--PaddingBottom': '0',
    '--pf-v6-c-modal-box--m-body--PaddingLeft': '0'
  } as React.CSSProperties}
>
```

### 2. Header Section
```typescript
<div style={{ 
  backgroundColor: '#f0f0f0', 
  padding: '1.5rem', 
  borderBottom: '1px solid #d2d2d2',
  flexShrink: 0
}}>
  <Title headingLevel="h1" size="2xl">
    Your Wizard Title
  </Title>
  <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
    Your wizard description
  </Content>
</div>
```

### 3. Body Layout
```typescript
<div style={{ 
  display: 'flex', 
  flex: 1, 
  minHeight: 0, 
  alignItems: 'stretch', 
  overflow: 'hidden',
  margin: 0,
  padding: 0
}}>
  {/* Left Navigation Panel - 300px */}
  <div style={{ 
    width: '300px', 
    padding: '1.5rem 1rem',
    borderRight: '1px solid #d2d2d2',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    margin: 0
  }}>
    {/* Step navigation items */}
  </div>
  
  {/* Right Content Area */}
  <div style={{ 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: 0, 
    overflow: 'hidden',
    margin: 0,
    padding: 0
  }}>
    {/* Scrollable content */}
    <div style={{ 
      flex: '1 1 0',
      padding: '1.5rem', 
      backgroundColor: '#ffffff',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      {/* Step content */}
    </div>
    
    {/* Footer */}
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      padding: '16px 24px', 
      borderTop: '1px solid #d2d2d2', 
      backgroundColor: '#fff',
      flexShrink: 0
    }}>
      {/* Buttons */}
    </div>
  </div>
</div>
```

### 4. Step Navigation Item
```typescript
<div
  onClick={() => setActiveStep(stepNumber)}
  style={{
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    backgroundColor: activeStep === stepNumber ? '#fafafa' : 'transparent',
    marginBottom: '0',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
  }}
>
  <span style={{ 
    marginRight: '12px', 
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: activeStep === stepNumber ? '#0066cc' : '#d2d2d2',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600'
  }}>
    {stepNumber}
  </span>
  <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
    Step Name
  </span>
</div>
```

## Color Palette

- **Header background**: `#f0f0f0`
- **Borders**: `#d2d2d2`
- **Active step circle**: `#0066cc`
- **Inactive step circle**: `#d2d2d2`
- **Active step background**: `#fafafa`
- **Text color**: `#151515`
- **Description text**: `#6a6e73`
- **Content background**: `#ffffff`

## Full-Page Wizard Pattern

**CRITICAL RULE:** When creating a full-page wizard (not in a modal), ALWAYS use the `FullPageWizard` component. It handles all padding, spacing, and layout correctly using CSS classes that won't be overridden.

### Quick Start for Full-Page Wizards

1. **Import the component:**
   ```typescript
   import { FullPageWizard } from '../components/FullPageWizard';
   ```

2. **Create a page route for your wizard:**
   ```typescript
   // In routes.tsx
   {
     path: '/my-wizard',
     element: <MyWizardPage />,
     title: 'My Wizard',
     // No navigation metadata - this is a detail page
   }
   ```

3. **Create the wizard page:**
   ```typescript
   // pages/MyWizardPage.tsx
   import * as React from 'react';
   import { useNavigate } from 'react-router-dom';
   import { FullPageWizard } from '../components/FullPageWizard';
   import { Title, Content } from '@patternfly/react-core';

   export const MyWizardPage: React.FC = () => {
     const navigate = useNavigate();

     return (
       <FullPageWizard
         onClose={() => navigate('/')}
         onFinish={(data) => {
           console.log('Wizard completed:', data);
           navigate('/');
         }}
         title="My Full Page Wizard"
         description="This is a full-page wizard that takes up the entire viewport."
         breadcrumbs={[
           { label: 'Home', path: '/' },
           { label: 'My Section' },
           { label: 'My Wizard' },
         ]}
         steps={[
           {
             name: 'Step One',
             id: 'step-one',
             component: (
               <div style={{ maxWidth: '600px' }}>
                 <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                   Step One
                 </Title>
                 <Content>
                   <p>This is step one content.</p>
                 </Content>
               </div>
             ),
           },
           {
             name: 'Step Two',
             id: 'step-two',
             component: (
               <div style={{ maxWidth: '600px' }}>
                 <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                   Step Two
                 </Title>
                 <Content>
                   <p>This is step two content.</p>
                 </Content>
               </div>
             ),
           },
         ]}
       />
     );
   };
   ```

### Full-Page Wizard Structure

The `FullPageWizard` component automatically handles:
- ✅ **Breadcrumb section** with 16px padding (using CSS class `create-policy-breadcrumb`)
- ✅ **Header section** with 24px padding (using CSS class `create-policy-header`)
- ✅ **Divider** between breadcrumbs and header (edge-to-edge)
- ✅ **Wizard content area** with proper scrolling
- ✅ **Footer** with Next/Back/Finish/Cancel buttons

**Key Points:**
- Uses CSS classes (`create-policy-breadcrumb`, `create-policy-header`) with `!important` flags
- Padding is handled automatically - **DO NOT** add padding to step components
- Breadcrumbs are optional - pass empty array `[]` if not needed
- Step components should have `maxWidth: '600px'` for content width
- Step components should **NOT** have padding - only breadcrumbs and header have padding

### Full-Page Wizard Props

```typescript
interface FullPageWizardProps {
  onClose?: () => void;              // Called when Cancel is clicked
  onFinish?: (data: any) => void;    // Called when Finish is clicked
  title?: string;                     // Header title
  description?: string;               // Header description
  breadcrumbs?: Array<{               // Breadcrumb navigation
    label: string;
    path?: string;                    // Optional - if provided, makes it clickable
  }>;
  steps?: Array<{                     // Wizard steps
    name: string;                     // Step name (shown in navigation)
    id: string;                       // Unique step ID
    component: React.ReactNode;       // Step content (no padding needed)
  }>;
}
```

### Example

See `pages/FullPageWizardPage.tsx` for a complete working example.

## Rules

### Standard Modals
1. **ALWAYS** use `StandardModal` component for simple modals
2. **NEVER** create custom modal layouts for simple dialogs
3. **ALWAYS** use the shared component from `@app/shared/components/feedback`
4. **NEVER** add custom padding - the component handles it correctly

### Modal Wizards
1. **ALWAYS** use `WizardTemplate` component for modal wizards
2. **ALWAYS** use the exact color values specified
3. **ALWAYS** use the 300px left navigation panel
4. **ALWAYS** use the same padding and spacing values
5. **NEVER** modify the core structure (only customize content)

### Full-Page Wizards
1. **ALWAYS** use `FullPageWizard` component - **DO NOT** create custom full-page wizard layouts
2. **ALWAYS** use CSS classes for padding (already handled by component)
3. **NEVER** add padding to step components - only breadcrumbs and header have padding
4. **ALWAYS** use `maxWidth: '600px'` for step content width
5. **NEVER** try to fix padding issues - the component handles it correctly

## Decision Tree

**Which component should I use?**

```
Do you need a modal or wizard?
│
├─ Simple dialog with text/buttons?
│  └─ Use StandardModal
│
├─ Multi-step workflow in a modal?
│  └─ Use WizardTemplate
│
└─ Full-page workflow with breadcrumbs?
   └─ Use FullPageWizard
```

## Benefits

- ✅ Consistent user experience across prototypes
- ✅ Matches established CCLM design pattern
- ✅ Professional, polished appearance
- ✅ Easy to maintain and update
- ✅ **No padding troubleshooting needed** - CSS classes handle it automatically

