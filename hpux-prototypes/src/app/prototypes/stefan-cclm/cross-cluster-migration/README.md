# CCLM (Cross Cluster Live Migration) - Dedicated Prototype

## Purpose
This is a **100% COMPLETELY ISOLATED** prototype for Cross Cluster Live Migration (CCLM) use case.

## Complete Isolation Guarantee
**IMPORTANT**: This directory is a SELF-CONTAINED prototype. Any changes made to ANY file in this directory will ONLY affect the CCLM prototype (`use-case-cclm`). They will NOT affect:
- Use Case 1 (Fleet admin → Tenant delegation)
- Use Case 2 (Tenant admin → Project access)
- ACM RBAC Empty States
- AAQ (Application Aware Quota)
- AAQ Empty States
- Any shared components in `/src/app/FleetVirtualization/` or `/src/app/VirtualMachines/`

## How It Works
The `useCaseComponents.tsx` file conditionally renders components based on the active use case:
- When `useCase === 'use-case-cclm'`, it renders components from this directory
- When using other use cases, they render their own dedicated components or shared components
- This ensures **complete separation and isolation**

## 🎉 **TRUE COMPLETE ISOLATION - ACHIEVED!**

CCLM uses the **ORIGINAL files** exclusively:
- `/src/app/VirtualMachines/*` ← Used ONLY by CCLM
- `/src/app/FleetVirtualization/*` ← Used ONLY by CCLM

All other routes use isolated copies:
- `/src/app/shared-fleet-virtualization/*` ← Used by non-CCLM routes
- `/src/app/shared-virtual-machines/*` ← Used by non-CCLM routes

## ✅ **YOU CAN NOW EDIT THESE FILES - ONLY AFFECTS CCLM:**
- `/src/app/VirtualMachines/VirtualMachines.tsx` 
- `/src/app/VirtualMachines/MigrateVMsWizard.tsx`
- `/src/app/FleetVirtualization/Settings.tsx`
- `/src/app/FleetVirtualization/Catalog.tsx`
- `/src/app/FleetVirtualization/Overview.tsx`
- `/src/app/FleetVirtualization/Templates.tsx`
- `/src/app/FleetVirtualization/InstanceTypes.tsx`
- `/src/app/FleetVirtualization/TopConsumers.tsx`
- `/src/app/FleetVirtualization/Migrations.tsx`
- `/src/app/FleetVirtualization/Virtualization.tsx`
- **ALL files in `/src/app/VirtualMachines/` and `/src/app/FleetVirtualization/`**

## ❌ **DO NOT EDIT (used by non-CCLM routes):**
- `/src/app/shared-fleet-virtualization/*` ← Non-CCLM copies
- `/src/app/shared-virtual-machines/*` ← Non-CCLM copies

## Structure - TRUE COMPLETE ISOLATION
```
use-case-cclm/
├── README.md (this file - documentation)
├── CCLMOverview.tsx (CCLM overview page)
├── VirtualMachines.tsx (CCLM Virtual Machines page - ISOLATED)
├── VirtualMachines.css (CCLM styles - ISOLATED)
├── MigrateVMsWizard.tsx (CCLM migration wizard - ISOLATED)
└── FleetVirtualization/ (CCLM-specific copies - ALL ISOLATED)
    ├── Catalog.tsx
    ├── EmptyPages.tsx
    ├── InstanceTypes.tsx
    ├── Migrations.tsx
    ├── Overview.tsx
    ├── Settings.tsx
    ├── Templates.tsx
    ├── TopConsumers.tsx
    └── Virtualization.tsx
```

## 🎉 YOU CAN SAFELY EDIT - 100% ISOLATED:
✅ **ALL 12 files in this directory** - Changes apply ONLY to CCLM
✅ **ZERO dependencies on shared FleetVirtualization or VirtualMachines directories**
✅ **CCLM is now TRULY COMPLETELY ISOLATED**

### Specifically, you can edit:
- `/src/app/use-case-cclm/VirtualMachines.tsx`
- `/src/app/use-case-cclm/MigrateVMsWizard.tsx`
- `/src/app/use-case-cclm/FleetVirtualization/Settings.tsx`
- `/src/app/use-case-cclm/FleetVirtualization/Catalog.tsx`
- **ANY file in `/src/app/use-case-cclm/`**

### ❌ DO NOT EDIT (these are shared by other prototypes):
- `/src/app/FleetVirtualization/*` (shared originals)
- `/src/app/VirtualMachines/*` (shared originals)

## Persona
- **User**: Nelson Gardner (Platform Administrator)
- **Company**: Petemobile (Telco)
- **Goal**: Move 80 running VMs from core-billing project in us-east-prod-02 cluster to us-west-prod-01 cluster

## Access
Navigate to the CCLM prototype by:
1. Go to the Use Case Selector page
2. Find the "Cross cluster live migration" card under "ACM Cross cluster live migration"
3. Click "Explore"
4. You'll land on the Virtual Machines page in Fleet Virtualization perspective

