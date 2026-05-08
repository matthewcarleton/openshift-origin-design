/**
 * Virtualization Admin Parent Prototype Configuration
 * 
 * This is a parent/container prototype that groups virtualization/AAQ prototypes
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Identity
  id: 'virtualization-parent',
  
  // Display name
  name: 'Application aware quotas prototype',
  
  // What this prototype explores
  description: 'A collection of Application Aware Quotas (AAQ) prototypes exploring quota management, resource allocation, and admin workflows.',
  
  // This is a parent/container
  isParent: true,
  
  // Owner information
  owner: {
    name: 'Anna Walker',
    slack: '@Anna Walker',
    email: 'awalker@redhat.com'
  },
  
  // Version
  version: '1.0.0',
  
  // Status
  status: 'in-progress',
  
  // User persona (representative)
  persona: {
    name: 'Dan Dreiberg',
    role: 'Virtualization Administrator',
    organization: 'Petemobile (Telco)'
  },
  
  // Perspectives
  perspectives: ['core-platforms', 'fleet-virtualization'],
  
  // Tags
  tags: ['virtualization', 'quotas', 'resource-management', 'vm', 'aaq'],
  
  // Timestamps
  createdAt: '2024-11-06',
  updatedAt: '2024-11-06',
  
  // Research task
  task: {
    title: 'Virtualization Quota Management',
    description: 'Explore admin workflows for managing VM quotas and resources',
    steps: [
      'Test quota creation and enforcement',
      'Explore resource allocation patterns',
      'Validate empty state experiences'
    ]
  }
};

