import React from 'react';
import { RouteConfig } from '@app/core/types';

import { QuotasPageEmpty } from './Quotas/QuotasPageEmpty';

export const routes: RouteConfig[] = [
  {
    path: '/quotas',
    element: <QuotasPageEmpty />,
    label: 'Quotas',
    title: 'Quotas',
    navigation: {
      group: 'Virtualization',
      order: 1
    }
  },
  {
    path: '/',
    element: <QuotasPageEmpty />,
    title: 'Quotas'
  },
];
