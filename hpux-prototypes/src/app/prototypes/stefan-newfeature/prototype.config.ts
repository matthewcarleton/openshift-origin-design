/**
 * Prototype Configuration Template
 * 
 * Copy this entire _template directory to create a new prototype.
 * Rename the directory and update this configuration file.
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'stefan-newfeature',
  
  // Display name (shown in prototype launcher)
  name: 'Stefan\'s New Feature',
  
  // Brief description (2-3 sentences max)
  description: 'A new feature prototype exploring [describe your feature here].',
  
  // Owner information
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
    email: 'skukla@redhat.com'
  },
  
  // Version (always start at 1.0.0 for new prototypes)
  version: '1.0.0',
  
  // Status: 'draft' | 'in-progress' | 'done' | 'paused' | 'archived'
  status: 'draft',
  
  // User persona for this prototype
  persona: {
    name: 'Administrator',
    role: 'Cluster Administrator',
  },
  
  // Which perspectives should be available
  // Options: 'core-platforms' | 'fleet-management' | 'fleet-virtualization'
  perspectives: ['core-platforms'],
  
  // Tags for filtering and discovery
  tags: ['draft', 'new-feature'],
  
  // Metadata
  createdAt: '2025-11-11',
  updatedAt: '2025-11-11',
};
