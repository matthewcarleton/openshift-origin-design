/**
 * Routes for Tenant Admin Access Prototype
 */

import React from 'react';
import { PageSection } from '@patternfly/react-core';
import { RouteConfig } from '@app/core/types';
import { VirtualMachines } from './VirtualMachines/VirtualMachines';
import { HubVirtualMachines } from './CorePlatforms/HubVirtualMachines';

// Import pages from navigation wrappers
import {
  ClustersPage,
  ClusterDetailPage,
  IdentitiesPage,
  RolesPage,
  IdentityProvidersPage,
  ProjectsPage,
  GovernancePage,
} from './navigation';

// Import detail/action pages
import { CreatePolicy } from './Governance/CreatePolicy';
import { IdentityDetail } from './Identities/IdentityDetail';
import { GroupDetail } from './Identities/GroupDetail';
import CreateGroup from './Identities/CreateGroup';
import { CreateRole } from './Roles/CreateRole';
import { RoleDetail } from './Roles/RoleDetail';
import { IdentityProviderDetail } from './IdentityProvider/IdentityProviderDetail';
import { AddLDAPProvider } from './IdentityProvider/AddLDAPProvider';
import { ProjectDetail } from './Projects/ProjectDetail';

export const routes: RouteConfig[] = [
  // Home
  {
    path: '/',
    element: <ProjectsPage />,
    label: 'Overview',
    title: 'ACM | Home',
    navigation: {
      group: 'Home',
      order: 1
    }
  },

  // Infrastructure
  {
    path: '/infrastructure/clusters',
    element: <ClustersPage />,
    label: 'Clusters',
    title: 'ACM | Clusters',
    navigation: {
      group: 'Infrastructure',
      order: 1
    }
  },
  {
    path: '/infrastructure/clusters/:clusterName',
    element: <ClusterDetailPage />,
    title: 'ACM | Cluster Detail'
  },

  // User Management - Identities (Fleet management perspective - no navigation, detail pages only)
  {
    path: '/user-management/identities',
    element: <IdentitiesPage />,
    label: 'Identities',
    title: 'ACM | Identities',
    // No navigation metadata - this route is only for Fleet virtualization perspective
  },
  {
    path: '/user-management/groups/create',
    element: <CreateGroup />,
    title: 'ACM | Create Group'
  },
  {
    path: '/user-management/groups/:groupName',
    element: <GroupDetail />,
    title: 'ACM | Group Detail'
  },
  {
    path: '/user-management/identities/:identityName',
    element: <IdentityDetail />,
    title: 'ACM | Identity Detail'
  },
  // User Management - Roles (Fleet management perspective - no navigation, detail pages only)
  {
    path: '/user-management/roles',
    element: <RolesPage />,
    label: 'Roles',
    title: 'ACM | Roles',
    // No navigation metadata - this route is only for Fleet virtualization perspective
  },
  {
    path: '/user-management/roles/create',
    element: <CreateRole />,
    title: 'ACM | Create Role'
  },
  {
    path: '/user-management/roles/:roleName',
    element: <RoleDetail />,
    title: 'ACM | Role Detail'
  },
  // User Management - Identity Providers (Fleet management perspective - no navigation, detail pages only)
  {
    path: '/user-management/identity-providers',
    element: <IdentityProvidersPage showClustersColumn={true} />,
    label: 'Identity providers',
    title: 'ACM | Identity Providers',
    // No navigation metadata - this route is only for Fleet virtualization perspective
  },

  // Projects (Fleet management perspective) - Hidden from navigation for tenant-admin-access
  {
    path: '/projects',
    element: <ProjectsPage />,
    label: 'Projects',
    title: 'ACM | Projects',
    // No navigation metadata - hidden from Fleet management navigation
  },
  {
    path: '/projects/:projectName',
    element: <ProjectDetail />,
    title: 'ACM | Project Detail'
  },

  // Governance - Show blank page (hidden from navigation)
  {
    path: '/governance',
    element: <PageSection />,
    title: 'ACM | Governance'
  },

  // Fleet Virtualization - Overview (Fleet virtualization perspective)
  {
    path: '/virtualization/overview',
    element: <PageSection />,
    label: 'Overview',
    title: 'Overview',
    navigation: {
      group: '',
      order: 1
    }
  },
  
  // Fleet Virtualization - Catalog (Fleet virtualization perspective)
  {
    path: '/virtualization/catalog',
    element: <PageSection />,
    label: 'Catalog',
    title: 'Catalog',
    navigation: {
      group: '',
      order: 2
    }
  },
  
  // Fleet Virtualization - Virtual machines (Fleet virtualization perspective)
  {
    path: '/virtualization/virtual-machines',
    element: <VirtualMachines />,
    label: 'Virtual machines',
    title: 'Virtual machines',
    navigation: {
      group: '',
      order: 3
    }
  },
  
  // Fleet Virtualization - InstanceTypes (Fleet virtualization perspective)
  {
    path: '/virtualization/instance-types',
    element: <PageSection />,
    label: 'InstanceTypes',
    title: 'InstanceTypes',
    navigation: {
      group: '',
      order: 4
    }
  },
  
  // Fleet Virtualization - Templates (Fleet virtualization perspective)
  {
    path: '/virtualization/templates',
    element: <PageSection />,
    label: 'Templates',
    title: 'Templates',
    navigation: {
      group: '',
      order: 5
    }
  },
  
  // Fleet Virtualization - User Management - Identities (Fleet virtualization perspective)
  {
    path: '/user-management/identities',
    element: <IdentitiesPage />,
    label: 'Identities',
    title: 'ACM | Identities',
    navigation: {
      group: 'User management',
      order: 1
    }
  },
  
  // Fleet Virtualization - User Management - Roles (Fleet virtualization perspective)
  {
    path: '/user-management/roles',
    element: <RolesPage />,
    label: 'Roles',
    title: 'ACM | Roles',
    navigation: {
      group: 'User management',
      order: 2
    }
  },
  
  // Fleet Virtualization - User Management - Identity Providers (Fleet virtualization perspective)
  {
    path: '/user-management/identity-providers',
    element: <IdentityProvidersPage showClustersColumn={true} />,
    label: 'Identity providers',
    title: 'ACM | Identity Providers',
    navigation: {
      group: 'User management',
      order: 3
    }
  },

  // Infrastructure - Automation (Fleet management perspective)
  {
    path: '/infrastructure/automation',
    element: <PageSection />,
    label: 'Automation',
    title: 'ACM | Automation',
    navigation: {
      group: 'Infrastructure',
      order: 2
    }
  },
  
  // Infrastructure - Host inventory (Fleet management perspective)
  {
    path: '/infrastructure/host-inventory',
    element: <PageSection />,
    label: 'Host inventory',
    title: 'ACM | Host Inventory',
    navigation: {
      group: 'Infrastructure',
      order: 3
    }
  },
  
  // Applications (Fleet management perspective)
  {
    path: '/applications/overview',
    element: <PageSection />,
    label: 'Applications',
    title: 'ACM | Applications',
    navigation: {
      group: 'Applications',
      order: 1
    }
  },
  
  // Credentials (Fleet management perspective)
  {
    path: '/credentials/overview',
    element: <PageSection />,
    label: 'Credentials',
    title: 'ACM | Credentials',
    navigation: {
      group: 'Credentials',
      order: 1
    }
  },
  
  // Observe (Fleet management perspective)
  {
    path: '/observe/overview',
    element: <PageSection />,
    label: 'Observe',
    title: 'ACM | Observe',
    navigation: {
      group: 'Observe',
      order: 1
    }
  },
  
  // Edge management (Fleet management perspective)
  {
    path: '/edge-management/overview',
    element: <PageSection />,
    label: 'Edge management',
    title: 'ACM | Edge Management',
    navigation: {
      group: 'Edge management',
      order: 1
    }
  },
  
  // Search (Fleet management perspective)
  {
    path: '/search',
    element: <PageSection />,
    label: 'Search',
    title: 'ACM | Search',
    navigation: {
      group: 'Search',
      order: 1
    }
  },

  // Core Platforms - Home - Overview (Core platforms perspective)
  {
    path: '/core/home/overview',
    element: <PageSection />,
    label: 'Overview',
    title: 'Overview',
    navigation: {
      group: 'Home',
      order: 1
    }
  },
  
  // Core Platforms - Home - Projects (Core platforms perspective)
  {
    path: '/core/home/projects',
    element: <ProjectsPage />,
    label: 'Projects',
    title: 'Projects',
    navigation: {
      group: 'Home',
      order: 2
    }
  },
  
  // Core Platforms - Home - Search (Core platforms perspective)
  {
    path: '/core/home/search',
    element: <PageSection />,
    label: 'Search',
    title: 'Search',
    navigation: {
      group: 'Home',
      order: 3
    }
  },
  
  // Core Platforms - Home - Software Catalog (Core platforms perspective)
  {
    path: '/core/home/catalog',
    element: <PageSection />,
    label: 'Software Catalog',
    title: 'Software Catalog',
    navigation: {
      group: 'Home',
      order: 4
    }
  },
  
  // Core Platforms - Home - API Explorer (Core platforms perspective)
  {
    path: '/core/home/api-explorer',
    element: <PageSection />,
    label: 'API Explorer',
    title: 'API Explorer',
    navigation: {
      group: 'Home',
      order: 5
    }
  },
  
  // Core Platforms - Home - Events (Core platforms perspective)
  {
    path: '/core/home/events',
    element: <PageSection />,
    label: 'Events',
    title: 'Events',
    navigation: {
      group: 'Home',
      order: 6
    }
  },
  
  // Core Platforms - Virtualization - Overview (Core platforms perspective)
  {
    path: '/core/virtualization/overview',
    element: <PageSection />,
    label: 'Overview',
    title: 'Overview',
    navigation: {
      group: 'Virtualization',
      order: 1
    }
  },
  
  // Core Platforms - Virtualization - Catalog (Core platforms perspective)
  {
    path: '/core/virtualization/catalog',
    element: <PageSection />,
    label: 'Catalog',
    title: 'Catalog',
    navigation: {
      group: 'Virtualization',
      order: 2
    }
  },
  
  // Core Platforms - Virtualization - Virtual machines (Core platforms perspective)
  {
    path: '/core/virtualization/vms',
    element: <HubVirtualMachines />,
    label: 'VirtualMachines',
    title: 'VirtualMachines',
    navigation: {
      group: 'Virtualization',
      order: 3
    }
  },
  
  // Core Platforms - Virtualization - Templates (Core platforms perspective)
  {
    path: '/core/virtualization/templates',
    element: <PageSection />,
    label: 'Templates',
    title: 'Templates',
    navigation: {
      group: 'Virtualization',
      order: 4
    }
  },
  
  // Core Platforms - Virtualization - InstanceTypes (Core platforms perspective)
  {
    path: '/core/virtualization/instancetypes',
    element: <PageSection />,
    label: 'InstanceTypes',
    title: 'InstanceTypes',
    navigation: {
      group: 'Virtualization',
      order: 5
    }
  },
  
  // Core Platforms - Virtualization - Preferences (Core platforms perspective)
  {
    path: '/core/virtualization/preferences',
    element: <PageSection />,
    label: 'Preferences',
    title: 'Preferences',
    navigation: {
      group: 'Virtualization',
      order: 6
    }
  },
  
  // Core Platforms - Virtualization - Bootable volumes (Core platforms perspective)
  {
    path: '/core/virtualization/bootable-volumes',
    element: <PageSection />,
    label: 'Bootable volumes',
    title: 'Bootable volumes',
    navigation: {
      group: 'Virtualization',
      order: 7
    }
  },
  
  // Core Platforms - Virtualization - MigrationPolicies (Core platforms perspective)
  {
    path: '/core/virtualization/migration-policies',
    element: <PageSection />,
    label: 'MigrationPolicies',
    title: 'MigrationPolicies',
    navigation: {
      group: 'Virtualization',
      order: 8
    }
  },
  
  // Core Platforms - Virtualization - Checkups (Core platforms perspective)
  {
    path: '/core/virtualization/checkups',
    element: <PageSection />,
    label: 'Checkups',
    title: 'Checkups',
    navigation: {
      group: 'Virtualization',
      order: 9
    }
  },
  
  // Core Platforms - Virtualization - Quotas (Core platforms perspective)
  {
    path: '/core/virtualization/quotas',
    element: <PageSection />,
    label: 'Quotas',
    title: 'Quotas',
    navigation: {
      group: 'Virtualization',
      order: 10
    }
  },
  
  // Core Platforms - Favorites (Core platforms perspective)
  {
    path: '/core/favorites/none',
    element: <PageSection />,
    label: 'No favorites added',
    title: 'No favorites added',
    navigation: {
      group: 'Favorites',
      order: 1
    }
  },
  
  // Core Platforms - Operators (Core platforms perspective)
  {
    path: '/core/operators/hub',
    element: <PageSection />,
    label: 'OperatorHub',
    title: 'OperatorHub',
    navigation: {
      group: 'Operators',
      order: 1
    }
  },
  {
    path: '/core/operators/installed',
    element: <PageSection />,
    label: 'Installed Operators',
    title: 'Installed Operators',
    navigation: {
      group: 'Operators',
      order: 2
    }
  },
  
  // Core Platforms - Helm (Core platforms perspective)
  {
    path: '/core/helm/repositories',
    element: <PageSection />,
    label: 'Repositories',
    title: 'Repositories',
    navigation: {
      group: 'Helm',
      order: 1
    }
  },
  {
    path: '/core/helm/releases',
    element: <PageSection />,
    label: 'Releases',
    title: 'Releases',
    navigation: {
      group: 'Helm',
      order: 2
    }
  },
  
  // Core Platforms - Workloads (Core platforms perspective)
  {
    path: '/core/workloads/topology',
    element: <PageSection />,
    label: 'Topology',
    title: 'Topology',
    navigation: {
      group: 'Workloads',
      order: 1
    }
  },
  {
    path: '/core/workloads/pods',
    element: <PageSection />,
    label: 'Pods',
    title: 'Pods',
    navigation: {
      group: 'Workloads',
      order: 2
    }
  },
  {
    path: '/core/workloads/deployments',
    element: <PageSection />,
    label: 'Deployments',
    title: 'Deployments',
    navigation: {
      group: 'Workloads',
      order: 3
    }
  },
  {
    path: '/core/workloads/deploymentconfigs',
    element: <PageSection />,
    label: 'DeploymentConfigs',
    title: 'DeploymentConfigs',
    navigation: {
      group: 'Workloads',
      order: 4
    }
  },
  {
    path: '/core/workloads/statefulsets',
    element: <PageSection />,
    label: 'StatefulSets',
    title: 'StatefulSets',
    navigation: {
      group: 'Workloads',
      order: 5
    }
  },
  {
    path: '/core/workloads/secrets',
    element: <PageSection />,
    label: 'Secrets',
    title: 'Secrets',
    navigation: {
      group: 'Workloads',
      order: 6
    }
  },
  {
    path: '/core/workloads/configmaps',
    element: <PageSection />,
    label: 'ConfigMaps',
    title: 'ConfigMaps',
    navigation: {
      group: 'Workloads',
      order: 7
    }
  },
  {
    path: '/core/workloads/cronjobs',
    element: <PageSection />,
    label: 'CronJobs',
    title: 'CronJobs',
    navigation: {
      group: 'Workloads',
      order: 8
    }
  },
  {
    path: '/core/workloads/jobs',
    element: <PageSection />,
    label: 'Jobs',
    title: 'Jobs',
    navigation: {
      group: 'Workloads',
      order: 9
    }
  },
  {
    path: '/core/workloads/daemonsets',
    element: <PageSection />,
    label: 'DaemonSets',
    title: 'DaemonSets',
    navigation: {
      group: 'Workloads',
      order: 10
    }
  },
  {
    path: '/core/workloads/replicasets',
    element: <PageSection />,
    label: 'ReplicaSets',
    title: 'ReplicaSets',
    navigation: {
      group: 'Workloads',
      order: 11
    }
  },
  {
    path: '/core/workloads/replicationcontrollers',
    element: <PageSection />,
    label: 'ReplicationControllers',
    title: 'ReplicationControllers',
    navigation: {
      group: 'Workloads',
      order: 12
    }
  },
  {
    path: '/core/workloads/hpas',
    element: <PageSection />,
    label: 'HorizontalPodAutoscalers',
    title: 'HorizontalPodAutoscalers',
    navigation: {
      group: 'Workloads',
      order: 13
    }
  },
  {
    path: '/core/workloads/pdbs',
    element: <PageSection />,
    label: 'PodDisruptionBudgets',
    title: 'PodDisruptionBudgets',
    navigation: {
      group: 'Workloads',
      order: 14
    }
  },
  
  // Core Platforms - Migration (Core platforms perspective)
  {
    path: '/core/migration/overview',
    element: <PageSection />,
    label: 'Overview',
    title: 'Overview',
    navigation: {
      group: 'Migration',
      order: 1
    }
  },
  {
    path: '/core/migration/providers',
    element: <PageSection />,
    label: 'Providers for virtualization',
    title: 'Providers for virtualization',
    navigation: {
      group: 'Migration',
      order: 2
    }
  },
  {
    path: '/core/migration/plans',
    element: <PageSection />,
    label: 'Plans for virtualization',
    title: 'Plans for virtualization',
    navigation: {
      group: 'Migration',
      order: 3
    }
  },
  {
    path: '/core/migration/storage-maps',
    element: <PageSection />,
    label: 'StorageMaps for virtualization',
    title: 'StorageMaps for virtualization',
    navigation: {
      group: 'Migration',
      order: 4
    }
  },
  {
    path: '/core/migration/network-maps',
    element: <PageSection />,
    label: 'NetworkMaps for virtualization',
    title: 'NetworkMaps for virtualization',
    navigation: {
      group: 'Migration',
      order: 5
    }
  },
  
  // Core Platforms - GitOps (Core platforms perspective)
  {
    path: '/core/gitops/applications',
    element: <PageSection />,
    label: 'Applications',
    title: 'Applications',
    navigation: {
      group: 'GitOps',
      order: 1
    }
  },
  {
    path: '/core/gitops/applicationsets',
    element: <PageSection />,
    label: 'ApplicationSets',
    title: 'ApplicationSets',
    navigation: {
      group: 'GitOps',
      order: 2
    }
  },
  
  // Core Platforms - Serverless (Core platforms perspective)
  {
    path: '/core/serverless/serving',
    element: <PageSection />,
    label: 'Serving',
    title: 'Serving',
    navigation: {
      group: 'Serverless',
      order: 1
    }
  },
  {
    path: '/core/serverless/functions',
    element: <PageSection />,
    label: 'Functions',
    title: 'Functions',
    navigation: {
      group: 'Serverless',
      order: 2
    }
  },
  
  // Core Platforms - Networking (Core platforms perspective)
  {
    path: '/core/networking/services',
    element: <PageSection />,
    label: 'Services',
    title: 'Services',
    navigation: {
      group: 'Networking',
      order: 1
    }
  },
  {
    path: '/core/networking/routes',
    element: <PageSection />,
    label: 'Routes',
    title: 'Routes',
    navigation: {
      group: 'Networking',
      order: 2
    }
  },
  {
    path: '/core/networking/ingresses',
    element: <PageSection />,
    label: 'Ingresses',
    title: 'Ingresses',
    navigation: {
      group: 'Networking',
      order: 3
    }
  },
  {
    path: '/core/networking/network-policies',
    element: <PageSection />,
    label: 'NetworkPolicies',
    title: 'NetworkPolicies',
    navigation: {
      group: 'Networking',
      order: 4
    }
  },
  {
    path: '/core/networking/network-attachment-definitions',
    element: <PageSection />,
    label: 'NetworkAttachmentDefinitions',
    title: 'NetworkAttachmentDefinitions',
    navigation: {
      group: 'Networking',
      order: 5
    }
  },
  {
    path: '/core/networking/user-defined-networks',
    element: <PageSection />,
    label: 'UserDefinedNetworks',
    title: 'UserDefinedNetworks',
    navigation: {
      group: 'Networking',
      order: 6
    }
  },
  
  // Core Platforms - Storage (Core platforms perspective)
  {
    path: '/core/storage/pvs',
    element: <PageSection />,
    label: 'PersistentVolumes',
    title: 'PersistentVolumes',
    navigation: {
      group: 'Storage',
      order: 1
    }
  },
  {
    path: '/core/storage/pvcs',
    element: <PageSection />,
    label: 'PersistentVolumeClaims',
    title: 'PersistentVolumeClaims',
    navigation: {
      group: 'Storage',
      order: 2
    }
  },
  {
    path: '/core/storage/classes',
    element: <PageSection />,
    label: 'StorageClasses',
    title: 'StorageClasses',
    navigation: {
      group: 'Storage',
      order: 3
    }
  },
  {
    path: '/core/storage/volume-snapshots',
    element: <PageSection />,
    label: 'VolumeSnapshots',
    title: 'VolumeSnapshots',
    navigation: {
      group: 'Storage',
      order: 4
    }
  },
  {
    path: '/core/storage/volume-snapshot-classes',
    element: <PageSection />,
    label: 'VolumeSnapshotClasses',
    title: 'VolumeSnapshotClasses',
    navigation: {
      group: 'Storage',
      order: 5
    }
  },
  {
    path: '/core/storage/volume-snapshot-contents',
    element: <PageSection />,
    label: 'VolumeSnapshotContents',
    title: 'VolumeSnapshotContents',
    navigation: {
      group: 'Storage',
      order: 6
    }
  },
  
  // Core Platforms - Builds (Core platforms perspective)
  {
    path: '/core/builds/configs',
    element: <PageSection />,
    label: 'BuildConfigs',
    title: 'BuildConfigs',
    navigation: {
      group: 'Builds',
      order: 1
    }
  },
  {
    path: '/core/builds/builds',
    element: <PageSection />,
    label: 'Builds',
    title: 'Builds',
    navigation: {
      group: 'Builds',
      order: 2
    }
  },
  {
    path: '/core/builds/image-streams',
    element: <PageSection />,
    label: 'ImageStreams',
    title: 'ImageStreams',
    navigation: {
      group: 'Builds',
      order: 3
    }
  },
  
  // Core Platforms - Pipelines (Core platforms perspective)
  {
    path: '/core/pipelines/overview',
    element: <PageSection />,
    label: 'Overview',
    title: 'Overview',
    navigation: {
      group: 'Pipelines',
      order: 1
    }
  },
  {
    path: '/core/pipelines/pipelines',
    element: <PageSection />,
    label: 'Pipelines',
    title: 'Pipelines',
    navigation: {
      group: 'Pipelines',
      order: 2
    }
  },
  {
    path: '/core/pipelines/tasks',
    element: <PageSection />,
    label: 'Tasks',
    title: 'Tasks',
    navigation: {
      group: 'Pipelines',
      order: 3
    }
  },
  {
    path: '/core/pipelines/triggers',
    element: <PageSection />,
    label: 'Triggers',
    title: 'Triggers',
    navigation: {
      group: 'Pipelines',
      order: 4
    }
  },
  
  // Core Platforms - Observe (Core platforms perspective)
  {
    path: '/core/observe/alerting',
    element: <PageSection />,
    label: 'Alerting',
    title: 'Alerting',
    navigation: {
      group: 'Observe',
      order: 1
    }
  },
  {
    path: '/core/observe/metrics',
    element: <PageSection />,
    label: 'Metrics',
    title: 'Metrics',
    navigation: {
      group: 'Observe',
      order: 2
    }
  },
  {
    path: '/core/observe/dashboards',
    element: <PageSection />,
    label: 'Dashboards',
    title: 'Dashboards',
    navigation: {
      group: 'Observe',
      order: 3
    }
  },
  {
    path: '/core/observe/targets',
    element: <PageSection />,
    label: 'Targets',
    title: 'Targets',
    navigation: {
      group: 'Observe',
      order: 4
    }
  },
  {
    path: '/core/observe/incidents',
    element: <PageSection />,
    label: 'Incidents',
    title: 'Incidents',
    navigation: {
      group: 'Observe',
      order: 5
    }
  },
  {
    path: '/core/observe/dashboards-perses',
    element: <PageSection />,
    label: 'Dashboards (Perses)',
    title: 'Dashboards (Perses)',
    navigation: {
      group: 'Observe',
      order: 6
    }
  },
  
  // Core Platforms - Compute (Core platforms perspective)
  {
    path: '/core/compute/nodes',
    element: <PageSection />,
    label: 'Nodes',
    title: 'Nodes',
    navigation: {
      group: 'Compute',
      order: 1
    }
  },
  {
    path: '/core/compute/hardware-devices',
    element: <PageSection />,
    label: 'Hardware Devices',
    title: 'Hardware Devices',
    navigation: {
      group: 'Compute',
      order: 2
    }
  },
  
  // Core Platforms - Administration (Core platforms perspective)
  {
    path: '/core/administration/settings',
    element: <PageSection />,
    label: 'Cluster Settings',
    title: 'Cluster Settings',
    navigation: {
      group: 'Administration',
      order: 1
    }
  },
  {
    path: '/core/administration/namespaces',
    element: <PageSection />,
    label: 'Namespaces',
    title: 'Namespaces',
    navigation: {
      group: 'Administration',
      order: 2
    }
  },
  {
    path: '/core/administration/resource-quotas',
    element: <PageSection />,
    label: 'ResourceQuotas',
    title: 'ResourceQuotas',
    navigation: {
      group: 'Administration',
      order: 3
    }
  },
  {
    path: '/core/administration/limit-ranges',
    element: <PageSection />,
    label: 'LimitRanges',
    title: 'LimitRanges',
    navigation: {
      group: 'Administration',
      order: 4
    }
  },
  {
    path: '/core/administration/image-vulnerabilities',
    element: <PageSection />,
    label: 'Image Vulnerabilities',
    title: 'Image Vulnerabilities',
    navigation: {
      group: 'Administration',
      order: 5
    }
  },
  {
    path: '/core/administration/crds',
    element: <PageSection />,
    label: 'CustomResourceDefinitions',
    title: 'CustomResourceDefinitions',
    navigation: {
      group: 'Administration',
      order: 6
    }
  },
  {
    path: '/core/administration/dynamic-plugins',
    element: <PageSection />,
    label: 'Dynamic Plugins',
    title: 'Dynamic Plugins',
    navigation: {
      group: 'Administration',
      order: 7
    }
  },
  
  // Core Platforms - User Management - Identity Providers (Core platforms perspective)
  {
    path: '/core/user-management/identity-providers',
    element: <IdentityProvidersPage showClustersColumn={false} />,
    label: 'Identity providers',
    title: 'ACM | Identity Providers',
    navigation: {
      group: 'User Management',
      order: 2
    }
  },
];

