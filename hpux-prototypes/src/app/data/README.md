# Mock Database Documentation

## Overview

This directory contains the complete mock database for the ACM User Interface. It serves as a **single source of truth** for all application data, making it easy to maintain consistency and relationships across the application.

## Structure

```
data/
├── schemas/              # TypeScript interfaces (like DB schemas)
│   ├── infrastructure.ts # ClusterSet, Cluster, Namespace
│   ├── virtualization.ts # VirtualMachine, InstanceType, Template
│   ├── identity.ts       # User, Group, ServiceAccount, IdentityProvider
│   └── access.ts         # Role, RoleBinding
├── mockDatabase.ts       # Main data store with all mock data
├── queries.ts            # Helper functions to query the data
├── index.ts              # Main export file
└── README.md             # This file
```

## Data Contents

### Infrastructure (150 clusters across 5 regions)
- **15 Cluster Sets** organized by region and purpose
  - petemobile-na-prod (North America)
  - petemobile-eu-prod (Europe)
  - petemobile-sa-prod (South America)
  - petemobile-apac-prod (Asia-Pacific)
  - petemobile-dev-clusters (Development)

- **~150 Clusters** distributed across regions
  - Production clusters (us-west-prod-01, eu-west-prod-01, etc.)
  - Development clusters (dev-team-a-cluster, dev-team-b-cluster)
  - Edge clusters (na-edge-ny-01, eu-edge-berlin-01)

- **Namespaces** (10-100 per cluster, varies)
  - Infrastructure: core-ntwk, core-billing, security-ops
  - Applications: 5g-api-prod, data-analytics, billing-api
  - Development: project-starlight-dev, project-pegasus-dev

### Virtualization (Sample of 15,000 VMs)
- **Virtual Machines** distributed across clusters and namespaces
  - Various operating systems (RHEL 8/9, Fedora, Ubuntu, Windows Server)
  - Different statuses (Running, Stopped, Error, Paused)
  - Realistic CPU, memory, and storage configurations

- **Instance Types**: small, medium, large, xlarge
- **Templates**: RHEL, Fedora, Ubuntu, Windows Server

### Identity & Access (~400 users, 13 groups)
- **Users** organized by teams and functions
  - **dev-team-alpha**: 60 users (primary development team)
  - **manager-project-starlight**: 5 users (project managers)
  - network-ops-team: 20 users
  - billing-api-team: 15 users
  - 5g-platform-developers: 25 users
  - And more...

- **Groups** organized by function and region
  - Team-based: dev-team-alpha, network-ops-team, security-ops-team
  - Project-based: manager-project-starlight
  - Regional: sa-region-ops, apac-region-ops, eu-region-ops

- **Service Accounts**: ci-cd-automation, monitoring-agent, backup-service, etc.

- **Identity Providers**: LDAP, SAML, GitHub Enterprise, Google Workspace

### Access Control
- **Roles** (default KubeVirt + custom)
  - Default: kubevirt-admin, kubevirt-edit, kubevirt-view, virtualmachine-admin
  - Custom: starlight-project-developer, billing-api-operator, network-infrastructure-admin

- **Role Bindings**: Assign roles to users/groups on specific scopes (cluster, namespace, clusterSet)

## Usage

### Basic Import

```typescript
// Import everything
import { mockDatabase } from '@app/data';

// Or import specific data
import { clusters, users, virtualMachines } from '@app/data';
```

### Using Query Functions

```typescript
import {
  getAllClusters,
  getClustersByRegion,
  getVirtualMachinesByCluster,
  getUsersByGroup,
  getClusterWithDetails,
} from '@app/data';

// Get all clusters
const clusters = getAllClusters();

// Get clusters in a specific region
const naClusters = getClustersByRegion('North America');

// Get VMs for a specific cluster
const vms = getVirtualMachinesByCluster('cluster-us-west-prod-01');

// Get users in dev-team-alpha group
const devTeam = getUsersByGroup('group-dev-team-alpha');

// Get cluster with full details (includes namespaces and VMs)
const clusterDetails = getClusterWithDetails('cluster-us-west-prod-01');
```

### Available Query Functions

#### Cluster Set Queries
- `getAllClusterSets()`
- `getClusterSetById(id)`
- `getClusterSetsByRegion(region)`
- `getClusterSetsByType(type)`

#### Cluster Queries
- `getAllClusters()`
- `getClusterById(id)`
- `getClustersByClusterSet(clusterSetId)`
- `getClustersByRegion(region)`
- `getClustersByStatus(status)`

#### Namespace Queries
- `getAllNamespaces()`
- `getNamespaceById(id)`
- `getNamespacesByCluster(clusterId)`
- `getNamespacesByType(type)`

#### Virtual Machine Queries
- `getAllVirtualMachines()`
- `getVirtualMachineById(id)`
- `getVirtualMachinesByCluster(clusterId)`
- `getVirtualMachinesByNamespace(namespaceId)`
- `getVirtualMachinesByStatus(status)`
- `getVirtualMachinesByOS(os)`
- `getVirtualMachinesByClusterSet(clusterSetId)`

#### User Queries
- `getAllUsers()`
- `getUserById(id)`
- `getUserByUsername(username)`
- `getUsersByGroup(groupId)`
- `getUsersByStatus(status)`

#### Group Queries
- `getAllGroups()`
- `getGroupById(id)`
- `getGroupByName(name)`
- `getGroupsByType(type)`
- `getGroupsForUser(userId)`

#### Role Queries
- `getAllRoles()`
- `getRoleById(id)`
- `getRoleByName(name)`
- `getRolesByType(type)`
- `getRolesByCategory(category)`

#### Complex Queries
- `getClusterWithDetails(clusterId)` - Returns cluster with clusterSet, namespaces, and VMs
- `getNamespaceWithDetails(namespaceId)` - Returns namespace with cluster and VMs
- `getUserWithDetails(userId)` - Returns user with groups and roleBindings
- `getGroupWithDetails(groupId)` - Returns group with users and roleBindings

#### Statistics
- `getStatistics()` - Returns overall statistics about the system

## Example: Using in a Component

```typescript
import React from 'react';
import { getClustersByRegion, getVirtualMachinesByCluster } from '@app/data';

export const ClusterList: React.FC = () => {
  // Get all North America clusters
  const clusters = getClustersByRegion('North America');
  
  return (
    <div>
      <h2>North America Clusters</h2>
      {clusters.map(cluster => {
        const vms = getVirtualMachinesByCluster(cluster.id);
        return (
          <div key={cluster.id}>
            <h3>{cluster.name}</h3>
            <p>Virtual Machines: {vms.length}</p>
            <p>Status: {cluster.status}</p>
          </div>
        );
      })}
    </div>
  );
};
```

## Data Relationships

The mock database maintains referential integrity:

1. **Clusters** reference their **ClusterSet** via `clusterSetId`
2. **Namespaces** reference their **Cluster** via `clusterId`
3. **VirtualMachines** reference their **Cluster** and **Namespace** via IDs
4. **Users** reference their **Groups** via `groupIds` array
5. **Groups** reference their **Users** via `userIds` array
6. **RoleBindings** connect **Roles** to **Users/Groups** on specific scopes

## Key Entities

### dev-team-alpha Group
- **60 users** - Primary development team
- Has role bindings for Project Starlight development

### manager-project-starlight Group
- **5 users** - Project management team for Starlight
- Has admin access to Starlight namespaces

### Project Starlight
- Development project running on dev-team-a-cluster
- Namespace: project-starlight-dev
- Multiple VMs for application and database

## Future Enhancements

When switching to a real API:
1. Replace query functions with API calls
2. Keep the same TypeScript interfaces
3. Components won't need to change since they use the same query functions
4. Add loading states and error handling

## Notes

- This is a **representative sample** - In production, there would be 15,000 VMs
- Currently includes ~100 users as samples - Full implementation would have ~400
- Data is intentionally realistic with proper naming conventions
- All IDs follow consistent patterns for easy identification

