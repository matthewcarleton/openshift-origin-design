/**
 * Prototype Configuration Template
 * 
 * Copy this entire _template directory to create a new prototype.
 * Rename the directory and update this configuration file.
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'example-draft-prototype',
  
  // Display name (shown in prototype launcher)
  name: '📋 Prototype Template',
  
  // Brief description (2-3 sentences max)
  description: 'This is the template prototype. Explore it to see the structure and examples. Copy the _template directory to create your own prototype.',
  
  // Owner information
  owner: {
    name: 'Designers name',
    slack: '@yourhandle',
    email: 'your.email@redhat.com'
  },
  
  // Version (always start at 1.0.0 for new prototypes)
  version: '1.0.0',
  
  // Status: 'draft' | 'in-progress' | 'done' | 'paused' | 'archived'
  status: 'in-progress',
  
  // User persona for this prototype
  persona: {
    name: 'Personas name',
    role: 'Your Role Here',
  },
  
  // Which perspectives should be available
  // Core platforms is enabled, others are disabled
  perspectives: ['core-platforms'],
  
  // Tags for filtering and discovery
  tags: ['Draft', 'Template', 'Example'],
  
  // Metadata
  createdAt: '2025-01-10',
  updatedAt: '2025-01-10',
};
