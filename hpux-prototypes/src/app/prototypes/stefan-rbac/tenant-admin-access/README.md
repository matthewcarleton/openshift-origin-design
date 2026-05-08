# Tenant Admin Access: Project Management

> **Owner:** Stefan Kukla (@stefan)  
> **Status:** Active  
> **Version:** 1.0.0  
> **Migrated from:** use-case-2

## Overview

This prototype explores how tenant administrators grant team access to projects that span multiple clusters within their delegated cluster set.

## Research Goals

- Validate project-scoped role assignment workflow
- Test understanding of project spanning multiple clusters
- Assess discoverability of team/group assignment features
- Understand mental models for project-level RBAC

## User Persona

- **Name:** Walter Joseph Kovacs
- **Role:** Tenant Administrator
- **Organization:** Petemobile (Telco)
- **Experience:** Experienced with Kubernetes, learning ACM
- **Responsibilities:** Managing access for development teams within assigned cluster sets

## User Task

Give group **dev-team-alpha** the **Virtualization admin** role on:
- **Project:** project-starlight-dev
- **Clusters:** dev-team-a and dev-team-b
- **Cluster Set:** petemobile-dev-clusters

## Key Features

### Implemented
- ✅ Project list and detail pages
- ✅ Group management
- ✅ Role assignment to groups
- ✅ Project-scoped permissions
- ✅ Multi-cluster project view
- ✅ Team access management

## Mock Data Scenario

- **Projects:** 10+ projects across dev/staging/prod
- **Teams:** Multiple dev teams (alpha, beta, gamma)
- **Cluster Sets:** petemobile-dev-clusters (delegated to Walter)
- **Clusters:** dev-team-a, dev-team-b (in dev cluster set)
- **Roles:** Virtualization admin, Developer, Viewer

## Related Work

- **Related Prototypes:** 
  - fleet-admin-rbac (fleet admin perspective)
  - Use case 1 shows delegation TO Walter
  - This prototype shows what Walter does WITH that access

## Version History

### v1.0.0 - 2024-11-06
- Migrated from use-case-2 to new modular architecture

### Original - 2024-01-20
- Initial prototype as use-case-2

