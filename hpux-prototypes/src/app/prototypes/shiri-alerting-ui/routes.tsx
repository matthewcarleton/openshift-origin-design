/**
 * Routes for Multi-cluster Alerting UI
 * 
 * This prototype provides comprehensive multi-cluster alerting capabilities
 * for OpenShift Advanced Cluster Manager.
 * 
 * Navigation is configured for the Fleet Management perspective.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteConfig } from '@app/core/types';

// Import page components
import { MultiClusterAlertingDashboard } from './pages/MultiClusterAlertsPage';
import { CreateAlertRulePage } from './pages/CreateAlertRulePage';

/**
 * Routes for Multi-cluster Alerting UI
 * 
 * These routes are added to the Fleet Management perspective under "Observe" group.
 */
export const routes: RouteConfig[] = [
  // Default route - redirect to Alerting page
  {
    path: '/',
    element: <Navigate to="/observe/alerting" replace />,
  },
  
  // Multi-cluster Alerting - Main page
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
  
  // Create Alert Rule - Full page wizard
  {
    path: '/observe/alerting/create-alert-rule',
    element: <CreateAlertRulePage />,
    title: 'Create Alert Rule | OpenShift ACM',
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

