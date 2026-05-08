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
import { InstallationWizard } from './pages/InstallationWizard';
import { InstalledOperatorsPage } from './pages/InstalledOperatorsPage';

/**
 * Routes for Observability Installation Wizard
 * 
 * This wizard demonstrates the Cluster Observability Operator installation flow
 * with persona-based configuration and unified observability component installation.
 */
export const routes: RouteConfig[] = [
  // OperatorHub - appears in Operators sub-menu
  {
    path: '/core/operators/operatorhub/install-observability',
    element: <InstallationWizard />,
    label: 'OperatorHub',
    title: 'Install Cluster Observability Operator',
    navigation: {
      group: 'Operators',
      order: 3
    }
  },
  // Installed Operators - appears in Operators sub-menu
  {
    path: '/core/operators/installed',
    element: <InstalledOperatorsPage />,
    label: 'Installed Operators',
    title: 'Installed Operators',
    navigation: {
      group: 'Operators',
      order: 4
    }
  },
];
