/**
 * Routes for Cross Cluster Live Migration Prototype
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteConfig } from '@app/core/types';
import { VirtualMachines } from './VirtualMachines/VirtualMachines';
import { HubVirtualMachines } from './CorePlatforms/HubVirtualMachines';
import { PageSection } from '@patternfly/react-core';
import { MigrationPlans } from './Migration/MigrationPlans';
import { MigrationPlanDetail } from './Migration/MigrationPlanDetail';
import { CreateMigrationPlan } from './Migration/CreateMigrationPlan';

export const routes: RouteConfig[] = [
  // Root route - redirect to Virtual machines in Fleet virtualization
  {
    path: '/',
    element: <Navigate to="/virtualization/virtual-machines" replace />,
    title: 'Virtual machines'
  },
  // Fleet Virtualization - Virtual machines
  {
    path: '/virtualization/virtual-machines',
    element: <VirtualMachines />,
    title: 'Virtual machines'
  },

  // Fleet Virtualization - Migration plans
  {
    path: '/virtualization/migration',
    element: <MigrationPlans />,
    title: 'Migration plans'
  },
  {
    path: '/virtualization/migration/create',
    element: <CreateMigrationPlan />,
    title: 'Create Migration Plan'
  },
  {
    path: '/virtualization/migration/:planId',
    element: <MigrationPlanDetail />,
    title: 'Migration Plan Details'
  },

  // Core Platforms - Virtualization - Virtual machines (Hub cluster only)
  {
    path: '/core/virtualization/vms',
    element: <HubVirtualMachines />,
    title: 'VirtualMachines'
  },

  // Blank pages for Fleet virtualization navigation items (except Virtual machines)
  {
    path: '/virtualization/overview',
    element: <PageSection />,
    title: 'Overview'
  },
  {
    path: '/virtualization/catalog',
    element: <PageSection />,
    title: 'Catalog'
  },
  {
    path: '/virtualization/instance-types',
    element: <PageSection />,
    title: 'InstanceTypes'
  },
  {
    path: '/virtualization/templates',
    element: <PageSection />,
    title: 'Templates'
  },

  // Blank pages for Core platforms Virtualization items (except VirtualMachines)
  {
    path: '/core/virtualization/overview',
    element: <PageSection />,
    title: 'Overview'
  },
  {
    path: '/core/virtualization/catalog',
    element: <PageSection />,
    title: 'Catalog'
  },
  {
    path: '/core/virtualization/templates',
    element: <PageSection />,
    title: 'Templates'
  },
  {
    path: '/core/virtualization/instancetypes',
    element: <PageSection />,
    title: 'InstanceTypes'
  },
  {
    path: '/core/virtualization/preferences',
    element: <PageSection />,
    title: 'Preferences'
  },
  {
    path: '/core/virtualization/bootable-volumes',
    element: <PageSection />,
    title: 'Bootable volumes'
  },
  {
    path: '/core/virtualization/migration-policies',
    element: <PageSection />,
    title: 'MigrationPolicies'
  },
  {
    path: '/core/virtualization/checkups',
    element: <PageSection />,
    title: 'Checkups'
  },
  {
    path: '/core/virtualization/quotas',
    element: <PageSection />,
    title: 'Quotas'
  },
];

