/**
 * Prototype Configuration Template
 * 
 * Copy this entire _template directory to create a new prototype.
 * Rename the directory and update this configuration file.
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'stefans-acmintegration',
  
  // Display name (shown in prototype launcher)
  name: 'ACM Ansible integration',
  
  // Brief description (2-3 sentences max)
  description: 'A new prototype created from the template. Update this description with your prototype details.',
  
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
    name: 'Walter Joseph Kovacs',
    role: 'Developer',
  },
  
  // Which perspectives should be available
  // All perspectives enabled
  perspectives: ['core-platforms', 'fleet-management', 'fleet-virtualization'],
  
  // Tags for filtering and discovery
  tags: ['draft', 'acm', 'ansible', 'integration'],
  
  // Metadata
  createdAt: '2025-01-10',
  updatedAt: '2025-01-10',
};
