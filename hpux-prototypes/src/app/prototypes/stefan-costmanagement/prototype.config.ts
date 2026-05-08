/**
 * Prototype Configuration Template
 * 
 * Copy this entire _template directory to create a new prototype.
 * Rename the directory and update this configuration file.
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'stefan-costmanagement',
  
  // Display name (shown in prototype launcher)
  name: 'Cost management integration in ACM',
  
  // Brief description (2-3 sentences max)
  description: 'Cost management integration in ACM prototype. Explore cost visibility, optimization, and governance across multi-cluster environments.',
  
  // Owner information
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
    email: 'skukla@redhat.com'
  },
  
  // Version (always start at 1.0.0 for new prototypes)
  version: '1.0.0',
  
  // Status: 'draft' | 'in-progress' | 'done' | 'paused' | 'archived'
  status: 'in-progress',
  
  // User persona for this prototype
  persona: {
    name: 'FinOps',
    role: 'FinOps',
  },
  
  // Which perspectives should be available
  // Core platforms is enabled, others are disabled
  perspectives: ['core-platforms', 'fleet-management', 'fleet-virtualization'],
  
  // Tags for filtering and discovery
  tags: ['in-progress', 'cost-management', 'acm', 'integration'],
  
  // Metadata
  createdAt: '2025-11-18',
  updatedAt: '2025-11-18',
};
