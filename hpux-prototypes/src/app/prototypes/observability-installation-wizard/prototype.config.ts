/**
 * Prototype Configuration Template
 * 
 * Copy this entire _template directory to create a new prototype.
 * Rename the directory and update this configuration file.
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'observability-installation-wizard',
  
  // Display name (shown in prototype launcher)
  name: '🔍 Cluster Observability Operator Installation Wizard',
  
  // Brief description (2-3 sentences max)
  description: 'Interactive prototype for the Cluster Observability Operator (COO) installation wizard. Demonstrates persona-based configuration and unified observability component installation flow.',
  
  // Owner information
  owner: {
    name: 'Foday Kargbo',
    slack: '@Foday',
    email: 'fkargbo@redhat.com'
  },
  
  // Version group - links related versions together in the dropdown
  versionGroup: 'observability-installation-wizard',
  version: 'v1.0',
  versionLabel: 'Current',
  
  // Status: 'draft' | 'in-progress' | 'done' | 'paused' | 'archived'
  status: 'in-progress',
  
  // User persona for this prototype
  persona: {
    name: 'Cluster Administrator / SRE / Developer',
    role: 'Operators Hub User',
  },
  
  // Which perspectives should be available
  // Core platforms is enabled, others are disabled
  perspectives: ['core-platforms'],
  
  // Tags for filtering and discovery
  tags: ['Observability', 'Operators', 'Wizard', 'Installation'],
  
  // Metadata
  createdAt: '2025-01-27',
  updatedAt: '2025-01-27',
};
