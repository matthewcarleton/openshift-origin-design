/**
 * Prototype Configuration for Multi-cluster Alerting UI - Version 2.0
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'shiri-alerting-ui-v2',
  
  // Display name (shown in prototype launcher)
  name: '🔔 Multi-cluster Alerting v2',
  
  // Brief description (2-3 sentences max)
  description: 'Multi-cluster Alerting UI with filtering-based navigation. Click on a cluster from the heatmap to filter the Firing alerts tab - everything stays on the same page. Features Clusters health tab with insights and Firing alerts tab with full alert table.',
  
  // Owner information
  owner: {
    name: 'Shiri Mordechay',
    slack: '@shirimordechay',
    email: 'shiri.mordechay@redhat.com'
  },
  
  // Version group - links related versions together in the dropdown
  versionGroup: 'multi-cluster-alerting',
  version: 'v2.0',
  versionLabel: 'Enhanced Design',
  
  // Status: 'draft' | 'in-progress' | 'in-review' | 'done' | 'paused' | 'archived'
  status: 'in-review',
  
  // User persona for this prototype
  persona: {
    name: 'Fleet Administrator',
    role: 'SRE / Cluster Administrator',
  },
  
  // Which perspectives should be available
  // Fleet management for multi-cluster alerting
  perspectives: ['fleet-management'],
  
  // Tags for filtering and discovery
  tags: ['Alerting', 'Multi-cluster', 'Observability', 'ACM', 'Fleet Management', 'v2'],
  
  // Metadata
  createdAt: '2025-12-24',
  updatedAt: '2025-12-24',

  designNotes: {
    designerNotes:
      'v2 of the Multi-cluster Alerting UI. Navigation moves from a dedicated Alerting page to a filtering model: clicking a cluster in the heatmap filters the Firing alerts tab in place, keeping the SRE in one context rather than bouncing between views.',
    navigationGuide: [
      {
        page: 'Clusters Health',
        path: '/fleet-management/alerting',
        notes:
          'Heatmap entry point. Each cluster cell is clickable and sets the active filter for the Firing Alerts tab. Severity bands and cluster status badges are the primary scannable signal.',
      },
      {
        page: 'Firing Alerts',
        path: '/fleet-management/alerting/firing',
        notes:
          'Full alert table filtered by the selected cluster. Review the column set, sort order, and bulk-action affordances — confirm with Shiri before finalising.',
      },
    ],
  },
};
