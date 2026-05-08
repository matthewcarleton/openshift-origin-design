/**
 * Routes for Multi-cluster Alerting UI V2
 * 
 * This prototype provides comprehensive multi-cluster alerting capabilities
 * for OpenShift Advanced Cluster Manager with a three-tier navigation flow:
 * 
 * 1. Fleet Overview (Treemap) - /observe/alerting
 * 2. Cluster Components Health - /observe/alerting/:clusterId/components
 * 3. Component Alerts - /observe/alerting/:clusterId/:componentId
 * 
 * Navigation is configured for the Fleet Management perspective.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteConfig } from '@app/core/types';

// Import page components
import { MultiClusterAlertingDashboard } from './pages/MultiClusterAlertsPage';
import { OverviewPage } from './pages/OverviewPage';
import { CreateAlertRulePage } from './pages/CreateAlertRulePage';
import { CreateSilencePage } from './pages/CreateSilencePage';

/**
 * Routes for Multi-cluster Alerting UI V2
 * 
 * These routes are added to the Fleet Management perspective under "Observe" group.
 */
export const routes: RouteConfig[] = [
  // Default route - redirect to Alerting page (main landing page)
  {
    path: '/',
    element: <Navigate to="/observe/alerting" replace />,
  },
  
  // Home > Overview page - high-level cluster metrics and alerts summary
  {
    path: '/home/overview',
    element: <OverviewPage />,
    label: 'Overview',
    title: 'Fleet Overview | OpenShift ACM',
    navigation: {
      group: 'Home',
      order: 1
    }
  },
  
  // Multi-cluster Alerting - Main page (Fleet Overview with Treemap)
  {
    path: '/observe/alerting',
    element: <MultiClusterAlertingDashboard />,
    label: 'Alerting',
    title: 'Multi-cluster Alerting | OpenShift ACM',
    navigation: {
      group: 'Observe',
      order: 1
    }
  },
  // Redirect /core/observe/alerting to /observe/alerting (sidebar may use core path)
  {
    path: '/core/observe/alerting',
    element: <Navigate to="/observe/alerting" replace />,
    title: 'Redirect',
  },
  
  // V2: Cluster Components Health view
  // Note: The actual navigation is handled via state management in the component
  // These routes are here for deep-linking support
  {
    path: '/observe/alerting/:clusterId/components',
    element: <MultiClusterAlertingDashboard />,
    title: 'Cluster Components | OpenShift ACM',
  },
  
  // V2: Component Alerts view
  {
    path: '/observe/alerting/:clusterId/:componentId',
    element: <MultiClusterAlertingDashboard />,
    title: 'Component Alerts | OpenShift ACM',
  },
  
  // Create Alert Rule - Full page wizard
  {
    path: '/observe/alerting-v2/create-alert-rule',
    element: <CreateAlertRulePage />,
    title: 'Create Alert Rule | OpenShift ACM',
  },

  // Create Silence Rule - Full page form
  {
    path: '/observe/alerting-v2/create-silence',
    element: <CreateSilencePage />,
    title: 'Create Silence Rule | OpenShift ACM',
  },
  
  // Dashboards placeholder (for navigation structure)
  {
    path: '/observe/dashboards',
    element: <DashboardsPlaceholder />,
    label: 'Dashboards',
    title: 'Dashboards | OpenShift ACM',
    navigation: {
      group: 'Observe',
      order: 2
    }
  },
];

// Placeholder component for Dashboards
function DashboardsPlaceholder() {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Dashboards</h1>
      <p>Dashboards functionality coming soon.</p>
    </div>
  );
}
