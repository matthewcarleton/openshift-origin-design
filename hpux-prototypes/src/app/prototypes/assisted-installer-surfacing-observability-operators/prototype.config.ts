/**
 * Prototype Configuration
 * 
 * Assisted Installer - Surfacing Observability Operators
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier (use kebab-case, no spaces)
  id: 'assisted-installer-surfacing-observability-operators',
  
  // Display name (shown in prototype launcher)
  name: '🚀 Assisted Installer - Surfacing Observability Operators',
  
  // Brief description (2-3 sentences max)
  description: 'Exploration prototype for surfacing observability operators within the Assisted Installer flow. Demonstrates how to present and configure observability operators during cluster installation.',
  
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
    name: 'Cluster Administrator / SRE',
    role: 'Assisted Installer User',
  },
  
  // Which perspectives should be available
  // Core platforms is enabled, others are disabled
  perspectives: ['core-platforms'],
  
  // Tags for filtering and discovery
  tags: ['Assisted Installer', 'Observability', 'Operators', 'Installation', 'Exploration'],
  
  // Metadata
  createdAt: '2025-01-27',
  updatedAt: '2025-01-27',
};
