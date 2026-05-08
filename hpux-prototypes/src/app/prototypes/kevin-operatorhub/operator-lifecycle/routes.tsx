/**
 * Routes for Operator Lifecycle Management Prototype
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteConfig } from '@app/core/types';

// Import pages
import { OperatorHub } from './OperatorHub/OperatorHub';
import { InstalledSoftware } from './Ecosystem/InstalledSoftware/InstalledSoftware';
import { OperatorLifecycle } from './OperatorLifecycle/OperatorLifecycle';
import { MigrationGuide } from './OperatorHub/MigrationGuide';
import { PageSection } from '@patternfly/react-core';

// Wrapper component for MigrationGuide modal
const MigrationGuidePage: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <PageSection>
      <MigrationGuide isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </PageSection>
  );
};

export const routes: RouteConfig[] = [
  // Root route - redirect to OperatorHub in Core platforms
  {
    path: '/',
    element: <Navigate to="/core/operators/hub" replace />,
    title: 'OperatorHub'
  },
  // OperatorHub route for Core platforms > Operators > OperatorHub navigation
  {
    path: '/core/operators/hub',
    element: <OperatorHub />,
    label: 'OperatorHub',
    title: 'OperatorHub',
    navigation: {
      group: 'Operators',
      order: 1
    }
  },
  {
    path: '/ecosystem/softwarecatalog',
    element: <OperatorHub />,
    label: 'Catalog',
    title: 'Software Catalog',
    navigation: {
      group: 'Software',
      order: 1
    }
  },
  {
    path: '/ecosystem/installed',
    element: <InstalledSoftware />,
    label: 'Installed Software',
    title: 'Installed Software',
    navigation: {
      group: 'Software',
      order: 2
    }
  },
  {
    path: '/operator-lifecycle',
    element: <OperatorLifecycle />,
    title: 'Operator Lifecycle Management'
  },
  {
    path: '/migration-guide',
    element: <MigrationGuidePage />,
    title: 'Migration Guide'
  },
];

