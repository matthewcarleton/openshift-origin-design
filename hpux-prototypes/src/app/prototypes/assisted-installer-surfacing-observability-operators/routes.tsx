/**
 * Routes for [Prototype Name]
 * 
 * Define all routes for your prototype here.
 * 
 * ⚠️ IMPORTANT: Navigation Merging Behavior
 * 
 * Your prototype routes are MERGED with the default navigation, not replacing it.
 * This means:
 * 
 * 1. **Default Navigation is Always Present:**
 *    - Core platforms: Home, Virtualization, Operators, Workloads, etc.
 *    - Fleet virtualization: Overview, Catalog, Virtual machines, etc.
 *    - Fleet management: Infrastructure, Applications, Credentials, etc.
 * 
 * 2. **Your Routes Are Added On Top:**
 *    - Routes with `navigation` metadata will appear in the sidebar
 *    - Routes are filtered by perspective based on path:
 *      * Fleet management: paths NOT starting with `/core` or `/virtualization`
 *      * Fleet virtualization: paths starting with `/virtualization` or `/user-management`
 *      * Core platforms: paths starting with `/core`
 * 
 * 3. **Group Merging:**
 *    - If your route has `navigation.group: 'User management'` and a default group
 *      with the same label exists, your routes REPLACE that default group
 *    - If your route has a new group name, it's ADDED to the navigation
 * 
 * 4. **Routes Without Navigation Metadata:**
 *    - Routes without `navigation` metadata are still accessible via URL
 *    - They just won't appear in the sidebar navigation
 *    - Use this for detail pages, wizards, modals, etc.
 * 
 * Example:
 * ```typescript
 * {
 *   path: '/my-page',
 *   element: <MyPage />,
 *   label: 'My Page',           // Required for navigation
 *   title: 'My Page',           // Browser tab title
 *   navigation: {               // Required for navigation
 *     group: 'Main',            // Group name (empty string = top-level)
 *     order: 1,                 // Sort order within group
 *   }
 * }
 * ```
 */

import React from 'react';
import { RouteConfig } from '@app/core/types';

// Import your page components here when you add routes
import { OverviewPage } from './pages/OverviewPage';
import { OperatorHubPage } from './pages/OperatorHubPage';
import { InstalledOperatorsPage } from './pages/InstalledOperatorsPage';
import { ClusterListPage } from './pages/ClusterListPage';

/**
 * IMPORTANT: Template Isolation
 * 
 * This template has navigation routes ONLY for demonstration purposes.
 * These routes REPLACE the default "Overview" in Core platforms > Home group.
 * They only affect the template prototype when it's active.
 * 
 * When you copy this template to create your own prototype, you can add
 * navigation routes here. They will only affect YOUR prototype, not others.
 */
export const routes: RouteConfig[] = [
  // Core Platforms - Home - Overview (replaces default Overview)
  {
    path: '/core/home/overview',
    element: <OverviewPage />,
    label: 'Overview',
    title: 'Overview',
    navigation: {
      group: 'Home',
      order: 1
    }
  },
  
  // Operators menu items
  // Note: Routes with navigation.group: 'Operators' will replace the default Operators group
  // So we include OperatorHub, Installed Operators, and Cluster List to maintain all items
  {
    path: '/core/operators/hub',
    element: <OperatorHubPage />,
    label: 'OperatorHub',
    title: 'OperatorHub',
    navigation: {
      group: 'Operators',
      order: 1
    }
  },
  {
    path: '/core/operators/installed',
    element: <InstalledOperatorsPage />,
    label: 'Installed Operators',
    title: 'Installed Operators',
    navigation: {
      group: 'Operators',
      order: 2
    }
  },
  {
    path: '/core/operators/cluster-list',
    element: <ClusterListPage />,
    label: 'Cluster List',
    title: 'Cluster List',
    navigation: {
      group: 'Operators',
      order: 3
    }
  },
];
