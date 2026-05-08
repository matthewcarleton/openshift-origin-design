# Fleet Admin RBAC: Tenant Delegation

> **Owner:** Stefan Kukla (@stefan)  
> **Status:** Active  
> **Version:** 1.0.0  
> **Migrated from:** use-case-1

## Overview

This prototype explores how fleet administrators delegate cluster set access to tenant admins in a multi-tenant ACM environment.

## Research Goals

- Validate the cluster set role assignment workflow
- Test discoverability of role assignment features
- Assess clarity of permission models
- Understand mental models for multi-cluster RBAC

## User Persona

- **Name:** Adrian Veidt
- **Role:** Fleet Administrator
- **Organization:** Petemobile (Telco)
- **Experience:** Expert with OpenShift, familiar with ACM
- **Responsibilities:** Managing access across 50+ clusters in multiple regions

## User Task

Give user **Walter Kovacs** the **Cluster set admin** role on these cluster sets:
- petemobile-na-prod (North America Production)
- petemobile-eu-prod (Europe Production)
- petemobile-sa-prod (South America Production)
- petemobile-apac-prod (Asia-Pacific Production)
- petemobile-dev-clusters (Development)

## Key Features

### Implemented
- ✅ Clusters list and detail pages
- ✅ Identities management (Users, Groups, Service Accounts)
- ✅ Roles management (create, edit, view)
- ✅ Identity Providers configuration
- ✅ Role assignment wizards
- ✅ Cluster set role delegation
- ✅ Projects view
- ✅ Governance policies

### Navigation Structure
- **Infrastructure:** Clusters, Automation, Host inventory
- **User Management:** Identities, Roles, Identity Providers
- **Governance:** Policies
- **Core Platforms:** Projects, Identity Providers

## Mock Data Scenario

- **Clusters:** 50+ clusters across 5 regions
- **Cluster Sets:** 
  - Production sets (NA, EU, SA, APAC)
  - Development sets
  - Staging sets
- **Users:** 100+ users across different teams
- **Groups:** Dev teams, Ops teams, Security teams
- **Roles:** Fleet admin, Cluster set admin, Viewer, Developer

## Shared Components Used

This prototype uses components from the shared library:
- `DetailPageLayout` - Consistent detail page structure
- `TableLayout` - List page structure
- `BaseWizard` - Multi-step wizards
- `PageLayout` - Generic page layout

## Directory Structure

```
fleet-admin-rbac/
├─ prototype.config.ts     Configuration
├─ README.md               This file
├─ routes.tsx              Route definitions
├─ Clusters/               Cluster pages
├─ Identities/             Identity management
├─ Roles/                  Role management
├─ RoleAssignment/         Role assignment wizards
├─ Projects/               Project pages
├─ Governance/             Policy pages
└─ data/                   Mock data queries
```

## Setup Instructions

1. Select this prototype from the launcher
2. Navigate to User Management → Identities
3. Try to assign a role to Walter Kovacs
4. Complete the role assignment wizard

## Research Findings

### Study Date: TBD

**Participants:** TBD

**Key Insights:**
- [To be filled after research sessions]

**Issues Found:**
- [To be documented]

**Recommendations:**
- [To be documented]

## Version History

### v1.0.0 - 2024-11-06
- Migrated from use-case-1 to new modular architecture
- Added prototype.config.ts
- Reorganized directory structure
- Documented research goals and features

### Original Version - 2024-01-15
- Initial prototype as use-case-1
- Core RBAC workflows implemented
- Role assignment wizards

## Related Work

- **Design Files:** [Link to Figma]
- **Jira Tickets:** [Link to Jira epic]
- **Related Prototypes:** 
  - tenant-admin-access (use-case-2)
  - User management patterns
- **Research Documentation:** [Link to research folder]

## Notes

This prototype focuses on the fleet admin persona delegating access. For the tenant admin perspective (receiving delegated access), see the `tenant-admin-access` prototype.

