# AAQ Empty States - Dedicated Project

## Purpose
This is a **dedicated, isolated project** for AAQ (Application Aware Quota) empty state designs.

## Isolation Guarantee
**IMPORTANT**: Any changes made to components in this directory will ONLY affect the AAQ Empty States use case (`use-case-aaq-empty-states`). They will NOT affect:
- The regular AAQ use case (`use-case-aaq`)
- Any other use cases (Use Case 1, Use Case 2, CCLM, ACM RBAC Empty States)

## How It Works
The `useCaseComponents.tsx` file conditionally renders components based on the active use case:
- When `useCase === 'use-case-aaq-empty-states'`, it renders components from this directory
- When `useCase === 'use-case-aaq'`, it renders components from `use-case-aaq` directory
- This ensures complete separation and isolation

## Structure
```
use-case-aaq-empty-states/
├── README.md (this file)
├── Quotas/
│   ├── QuotasPageEmpty.tsx (empty state for Quotas list)
│   ├── QuotaDetailEmpty.tsx (empty state for Quota detail)
│   └── CreateQuotaEmpty.tsx (empty state for Create quota form)
└── navigation/
    └── core-platforms/
        └── VirtualizationWrapperEmpty.tsx (empty state for Virtualization section)
```

## Adding New Empty States
1. Create your empty state component in the appropriate subdirectory
2. Update `useCaseComponents.tsx` to import and use your new component when `useCase === 'use-case-aaq-empty-states'`
3. Test that it ONLY appears in the AAQ Empty States use case

## Persona
- **User**: Jane Designer (UX Designer)
- **Goal**: Explore and evaluate AAQ empty state designs

## Access
Navigate to the AAQ Empty States use case by:
1. Go to the Use Case Selector page
2. Find the "AAQ" card under "Application Aware Quota"
3. Click the dropdown arrow next to "Explore"
4. Select "AAQ Empty states"

