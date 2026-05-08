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
import TemplatesPage from './pages/TemplatesPage';
import JobsPage from './pages/JobsPage';
import TemplateDetailPage from './pages/TemplateDetailPage';
import JobDetailPage from './pages/JobDetailPage';
import RulebooksPage from './pages/RulebooksPage';
import EventsPage from './pages/EventsPage';
import RuleActivationsPage from './pages/RuleActivationsPage';
import DecisionEnvironmentsPage from './pages/DecisionEnvironmentsPage';
import RulebookDetailPage from './pages/RulebookDetailPage';
import RuleActivationDetailPage from './pages/RuleActivationDetailPage';
import EventSourceDetailPage from './pages/EventSourceDetailPage';

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
  // Fleet Management - Automation group
  // Organized by user journey: Setup → Create → Activate → Monitor
  
  // Phase 1: Setup & Infrastructure
  {
    path: '/automation/decision-environments',
    element: <DecisionEnvironmentsPage />,
    label: 'Decision Environments',
    title: 'Decision Environments',
    navigation: {
      group: 'Automation',
      order: 1
    }
  },
  
  // Phase 2: Create Automation Content
  {
    path: '/automation/templates',
    element: <TemplatesPage />,
    label: 'Templates',
    title: 'Templates',
    navigation: {
      group: 'Automation',
      order: 2
    }
  },
  {
    path: '/automation/events',
    element: <EventsPage />,
    label: 'Events',
    title: 'Events',
    navigation: {
      group: 'Automation',
      order: 3
    }
  },
  {
    path: '/automation/rulebooks',
    element: <RulebooksPage />,
    label: 'Rulebooks',
    title: 'Rulebooks',
    navigation: {
      group: 'Automation',
      order: 4
    }
  },
  
  // Phase 3: Activate & Execute
  {
    path: '/automation/rule-activations',
    element: <RuleActivationsPage />,
    label: 'Rule Activations',
    title: 'Rule Activations',
    navigation: {
      group: 'Automation',
      order: 5
    }
  },
  {
    path: '/automation/jobs',
    element: <JobsPage />,
    label: 'Jobs',
    title: 'Jobs',
    navigation: {
      group: 'Automation',
      order: 6
    }
  },
  
  // Phase 4: Monitor & Debug
  // Note: Event Stream and Event History are now tabs within the Events page
  
  // Detail pages (no navigation metadata - accessed via URL only)
  {
    path: '/automation/templates/:templateId',
    element: <TemplateDetailPage />,
    title: 'Template Details',
  },
  {
    path: '/automation/jobs/:jobId',
    element: <JobDetailPage />,
    title: 'Job Details',
  },
  {
    path: '/automation/rulebooks/:rulebookId',
    element: <RulebookDetailPage />,
    title: 'Rulebook Details',
  },
  {
    path: '/automation/rule-activations/:activationId',
    element: <RuleActivationDetailPage />,
    title: 'Rule Activation Details',
  },
  {
    path: '/automation/event-sources/:sourceId',
    element: <EventSourceDetailPage />,
    title: 'Event Source Details',
  },
  // Legacy routes - redirect to Events page with appropriate tab
  {
    path: '/automation/event-sources',
    element: <EventsPage />,
    title: 'Events',
  },
  {
    path: '/automation/event-stream',
    element: <EventsPage />,
    title: 'Events',
  },
  {
    path: '/automation/event-history',
    element: <EventsPage />,
    title: 'Events',
  },
];
