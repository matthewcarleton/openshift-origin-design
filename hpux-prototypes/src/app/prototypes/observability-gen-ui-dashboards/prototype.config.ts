/**
 * Prototype Configuration Template
 * 
 * Copy this entire _template directory to create a new prototype.
 * Rename the directory and update this configuration file.
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'observability-gen-ui-dashboards',
  
  // Display name (shown in prototype launcher)
  name: '📊 Observability Gen UI Dashboards + AI',
  
  // Brief description (2-3 sentences max)
  description: 'AI-generated UI dashboards for observability. Prototype for exploring dashboard layouts and data visualization patterns for observability components.',
  
  // Owner information
  owner: {
    name: 'Foday Kargbo',
    slack: '@Foday',
    email: 'fkargbo@redhat.com'
  },
  
  // Version (always start at 1.0.0 for new prototypes)
  version: '1.0.0',
  
  // Status: 'draft' | 'in-progress' | 'done' | 'paused' | 'archived'
  status: 'in-progress',
  
  // User persona for this prototype
  persona: {
    name: 'Cluster Administrator / SRE / Developer',
    role: 'Observability User',
  },
  
  // Which perspectives should be available
  // Core platforms is enabled, others are disabled
  perspectives: ['core-platforms'],
  
  // Tags for filtering and discovery
  tags: ['Observability', 'Dashboards', 'Data Visualization', 'AI-Generated'],
  
  // Metadata
  createdAt: '2025-01-27',
  updatedAt: '2025-01-27',
};
