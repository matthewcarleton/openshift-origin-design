/**
 * Prototype Configuration for Multi-cluster Alerting UI - Version 1.0
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'shiri-alerting-ui',
  
  // Display name (shown in prototype launcher)
  name: '🔔 Multi-cluster Alerting',
  
  // Brief description (2-3 sentences max)
  description: 'Multi-cluster Alerting UI with drill-down navigation. Click on a cluster from the heatmap to navigate to a dedicated single cluster page view with detailed alerts. Features Clusters health tab with insights and Firing alerts tab with full alert table.',
  
  // Owner information
  owner: {
    name: 'Shiri Mordechay',
    slack: '@shirimordechay',
    email: 'shiri.mordechay@redhat.com'
  },
  
  // Version group - links related versions together in the dropdown
  versionGroup: 'multi-cluster-alerting',
  version: 'v1.0',
  versionLabel: 'Initial Design',
  
  // Status: 'draft' | 'in-progress' | 'in-review' | 'done' | 'paused' | 'archived'
  status: 'archived',
  
  // User persona for this prototype
  persona: {
    name: 'Fleet Administrator',
    role: 'SRE / Cluster Administrator',
  },
  
  // Which perspectives should be available
  // Fleet management for multi-cluster alerting
  perspectives: ['fleet-management'],
  
  // Tags for filtering and discovery
  tags: ['Alerting', 'Multi-cluster', 'Observability', 'ACM', 'Fleet Management'],
  
  // Metadata
  createdAt: '2025-12-17',
  updatedAt: '2025-12-24',

  designNotes: {
    designerNotes:
      'This prototype (v1) explores multi-cluster alerting UX — how a Fleet Administrator monitors and responds to alerts firing across many clusters simultaneously, using a heatmap + drill-down pattern.',
    navigationGuide: [
      {
        page: 'Clusters Health',
        path: '/observe/alerting',
        notes:
          'Heatmap shows at-a-glance cluster health. Severity color bands (Critical / Warning / Info) are the primary scannable signal.',
      },
      {
        page: 'Single Cluster Detail',
        path: '/observe/alerting/cluster/:id',
        notes:
          'Drill-down from heatmap. The Firing Alerts table mirrors the OCP 4.x alerting UI so operators feel at home.',
      },
    ],
  },
};
