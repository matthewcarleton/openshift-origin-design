/**
 * Routes for Cost Management Acm
 * 
 * Define all routes for your prototype here.
 */

import React from 'react';
import { RouteConfig } from '@app/core/types';

// Import Cost Management page components (Option A - Dedicated pages)
import { Overview } from './pages/CostManagement/Overview/Overview';
import { Optimizations } from './pages/CostManagement/Optimizations/Optimizations';
import OptimizationDetail from './pages/CostManagement/Optimizations/OptimizationDetail/OptimizationDetail';
import { CostManagementOpenShift } from './pages/CostManagement/OpenShift/CostManagementOpenShift';
import { ClusterDetail } from './pages/CostManagement/OpenShift/ClusterDetail/ClusterDetail';
import NodeDetail from './pages/CostManagement/OpenShift/NodeDetail/NodeDetail';
import { AWS } from './pages/CostManagement/AWS/AWS';
import { GCP } from './pages/CostManagement/GCP/GCP';
import { GCPAccountDetails } from './pages/CostManagement/GCP/GCPAccountDetails';
import { Azure } from './pages/CostManagement/Azure/Azure';
import { CostExplorer } from './pages/CostManagement/CostExplorer/CostExplorer';
import { CostManagementSettings } from './pages/CostManagement/Settings/CostManagementSettings';
import CostModelDetail from './pages/CostManagement/Settings/CostModelDetail/CostModelDetail';

// Import Cost Management page components (Option B - Integrated within ACM pages)
import { Overview as OverviewIntegrated } from './pages/cost-management-integrated/Overview/Overview';
import { Optimizations as OptimizationsIntegrated } from './pages/cost-management-integrated/Optimizations/Optimizations';
import OptimizationDetailIntegrated from './pages/cost-management-integrated/Optimizations/OptimizationDetail/OptimizationDetail';
import { CostManagementOpenShift as CostManagementOpenShiftIntegrated } from './pages/cost-management-integrated/OpenShift/OpenShift';
import { ClusterDetail as ClusterDetailIntegrated } from './pages/cost-management-integrated/OpenShift/ClusterDetail/ClusterDetail';
import NodeDetailIntegrated from './pages/cost-management-integrated/OpenShift/NodeDetail/NodeDetail';
import { AWS as AWSIntegrated } from './pages/cost-management-integrated/AWS/AWS';
import { GCP as GCPIntegrated } from './pages/cost-management-integrated/GCP/GCP';
import { GCPAccountDetails as GCPAccountDetailsIntegrated } from './pages/cost-management-integrated/GCP/GCPAccountDetails';
import { Azure as AzureIntegrated } from './pages/cost-management-integrated/Azure/Azure';
import { CostExplorer as CostExplorerIntegrated } from './pages/cost-management-integrated/CostExplorer/CostExplorer';
import { CostManagementSettings as CostManagementSettingsIntegrated } from './pages/cost-management-integrated/Settings/Settings';
import CostModelDetailIntegrated from './pages/cost-management-integrated/Settings/CostModelDetail/CostModelDetail';
import { ClustersPage } from './pages/cost-management-integrated/Infrastructure/ClustersPage';
import { ClusterDetail as ClusterDetailInfrastructureIntegrated } from './pages/cost-management-integrated/Infrastructure/Clusters/ClusterDetail';

/**
 * IMPORTANT: Template Isolation
 * 
 * All routes here are isolated to this prototype only.
 * They will only affect this prototype when it's active.
 */
export const routes: RouteConfig[] = [
  // Cost Management - Fleet Management Perspective
  // All routes start without /core or /virtualization to appear in Fleet management
  {
    path: '/cost-management/overview',
    element: <Overview />,
    label: 'Overview',
    title: 'Cost Management | Overview',
    navigation: {
      group: 'Cost management',
      order: 1
    }
  },
  {
    path: '/cost-management/optimizations',
    element: <Optimizations />,
    label: 'Optimizations',
    title: 'Cost Management | Optimizations',
    navigation: {
      group: 'Cost management',
      order: 2
    }
  },
  {
    path: '/cost-management/optimizations/:id',
    element: <OptimizationDetail />,
    title: 'Cost Management | Optimization Details'
  },
  {
    path: '/cost-management/openshift',
    element: <CostManagementOpenShiftIntegrated />,
    label: 'OpenShift',
    title: 'Cost Management | OpenShift',
    navigation: {
      group: 'Cost management',
      order: 3
    }
  },
  {
    path: '/cost-management/openshift/cluster/:clusterId',
    element: <ClusterDetail />,
    title: 'Cost Management | Cluster Details'
  },
  {
    path: '/cost-management/openshift/node/:nodeId',
    element: <NodeDetail />,
    title: 'Cost Management | Node Details'
  },
  {
    path: '/cost-management/aws',
    element: <AWS />,
    label: 'Amazon Web Services',
    title: 'Cost Management | Amazon Web Services',
    navigation: {
      group: 'Cost management',
      order: 4
    }
  },
  {
    path: '/cost-management/gcp',
    element: <GCP />,
    label: 'Google Cloud',
    title: 'Cost Management | Google Cloud',
    navigation: {
      group: 'Cost management',
      order: 5
    }
  },
  {
    path: '/cost-management/gcp/account-details/:accountId',
    element: <GCPAccountDetails />,
    title: 'Cost Management | Google Cloud Account Details'
  },
  {
    path: '/cost-management/azure',
    element: <Azure />,
    label: 'Microsoft Azure',
    title: 'Cost Management | Microsoft Azure',
    navigation: {
      group: 'Cost management',
      order: 6
    }
  },
  {
    path: '/cost-management/explorer',
    element: <CostExplorer />,
    label: 'Cost Explorer',
    title: 'Cost Management | Cost Explorer',
    navigation: {
      group: 'Cost management',
      order: 7
    }
  },
  {
    path: '/cost-management/settings',
    element: <CostManagementSettingsIntegrated />,
    label: 'Settings',
    title: 'Cost Management | Settings',
    navigation: {
      group: 'Cost management',
      order: 8
    }
  },
  {
    path: '/cost-management/settings/cost-model/:costModelId',
    element: <CostModelDetail />,
    title: 'Cost Management | Cost Model Details'
  },
  
  // Option B: Integrated within ACM pages (cost-management-integrated routes)
  // These routes have navigation metadata and will only show when Option B is selected
  // The filtering logic in AppLayout.tsx ensures only the selected option's routes appear
  {
    path: '/cost-management-integrated/overview',
    element: <OverviewIntegrated />,
    label: 'Overview',
    title: 'Cost Management | Overview (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 1
    }
  },
  {
    path: '/cost-management-integrated/optimizations',
    element: <OptimizationsIntegrated />,
    label: 'Optimizations',
    title: 'Cost Management | Optimizations (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 2
    }
  },
  {
    path: '/cost-management-integrated/optimizations/:id',
    element: <OptimizationDetailIntegrated />,
    title: 'Cost Management | Optimization Details (Integrated)'
  },
  {
    path: '/cost-management-integrated/openshift',
    element: <CostManagementOpenShiftIntegrated />,
    label: 'OpenShift',
    title: 'Cost Management | OpenShift (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 3
    }
  },
  {
    path: '/cost-management-integrated/openshift/cluster/:clusterId',
    element: <ClusterDetailIntegrated />,
    title: 'Cost Management | Cluster Details (Integrated)'
  },
  {
    path: '/cost-management-integrated/openshift/node/:nodeId',
    element: <NodeDetailIntegrated />,
    title: 'Cost Management | Node Details (Integrated)'
  },
  {
    path: '/cost-management-integrated/aws',
    element: <AWSIntegrated />,
    label: 'Amazon Web Services',
    title: 'Cost Management | Amazon Web Services (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 4
    }
  },
  {
    path: '/cost-management-integrated/gcp',
    element: <GCPIntegrated />,
    label: 'Google Cloud',
    title: 'Cost Management | Google Cloud (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 5
    }
  },
  {
    path: '/cost-management-integrated/gcp/account-details/:accountId',
    element: <GCPAccountDetailsIntegrated />,
    title: 'Cost Management | Google Cloud Account Details (Integrated)'
  },
  {
    path: '/cost-management-integrated/azure',
    element: <AzureIntegrated />,
    label: 'Microsoft Azure',
    title: 'Cost Management | Microsoft Azure (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 6
    }
  },
  {
    path: '/cost-management-integrated/explorer',
    element: <CostExplorerIntegrated />,
    label: 'Cost Explorer',
    title: 'Cost Management | Cost Explorer (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 7
    }
  },
  {
    path: '/cost-management-integrated/settings',
    element: <CostManagementSettingsIntegrated />,
    label: 'Settings',
    title: 'Cost Management | Settings (Integrated)',
    navigation: {
      group: 'Cost management',
      order: 8
    }
  },
  {
    path: '/cost-management-integrated/settings/cost-model/:costModelId',
    element: <CostModelDetailIntegrated />,
    title: 'Cost Management | Cost Model Details (Integrated)'
  },
  
  // Infrastructure - Clusters (Fleet management perspective, Option B only)
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
    element: <ClusterDetailInfrastructureIntegrated />,
    title: 'ACM | Cluster Detail'
  },
];
