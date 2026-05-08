import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteConfig } from '@app/core/types';

import { QuotasPage, Overview, VirtualizationWrapper } from './navigation/core-platforms';
import { CreateQuota } from './Quotas/CreateQuota';
import { QuotaDetail } from './Quotas/QuotaDetail';

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="/core/virtualization/quotas" replace />,
    title: 'Quotas'
  },
  {
    path: '/core/virtualization/quotas',
    element: <QuotasPage />,
    label: 'Quotas',
    title: 'Quotas',
    navigation: {
      group: 'Virtualization',
      order: 10
    }
  },
  {
    path: '/core/virtualization/quotas/create',
    element: <CreateQuota />,
    title: 'Create Quota'
  },
  {
    path: '/core/virtualization/quotas/:quotaName',
    element: <QuotaDetail />,
    title: 'Quota Details'
  },
  // Blank page routes for other Virtualization nav items
  {
    path: '/core/virtualization/overview',
    element: <div />,
    title: 'Overview'
  },
  {
    path: '/core/virtualization/catalog',
    element: <div />,
    title: 'Catalog'
  },
  {
    path: '/core/virtualization/vms',
    element: <div />,
    title: 'VirtualMachines'
  },
  {
    path: '/core/virtualization/templates',
    element: <div />,
    title: 'Templates'
  },
  {
    path: '/core/virtualization/instancetypes',
    element: <div />,
    title: 'InstanceTypes'
  },
  {
    path: '/core/virtualization/preferences',
    element: <div />,
    title: 'Preferences'
  },
  {
    path: '/core/virtualization/bootable-volumes',
    element: <div />,
    title: 'Bootable volumes'
  },
  {
    path: '/core/virtualization/migration-policies',
    element: <div />,
    title: 'MigrationPolicies'
  },
  {
    path: '/core/virtualization/checkups',
    element: <div />,
    title: 'Checkups'
  },
];

