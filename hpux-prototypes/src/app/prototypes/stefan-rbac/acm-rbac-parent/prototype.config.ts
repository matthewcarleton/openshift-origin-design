/**
 * ACM RBAC Parent Prototype Configuration
 * 
 * This is a parent/container prototype that groups related RBAC prototypes
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Identity
  id: 'acm-rbac-parent',
  
  // Display name
  name: 'ACM RBAC Prototypes',
  
  // What this prototype explores
  description: 'A collection of role-based access control (RBAC) prototypes for Advanced Cluster Management, exploring fleet admin and tenant admin workflows.',
  
  // This is a parent/container
  isParent: true,
  
  // Owner information
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
    email: 'skukla@redhat.com'
  },
  
  // Version
  version: '1.0.0',
  
  // Status
  status: 'in-progress',
  
  // User persona (representative)
  persona: {
    name: 'Various',
    role: 'Platform & Tenant Administrators',
    organization: 'Enterprise IT'
  },
  
  // Perspectives
  perspectives: ['fleet-management'],
  
  // Tags
  tags: ['rbac', 'access-control', 'multi-tenant', 'delegation', 'permissions'],
  
  // Timestamps
  createdAt: '2024-11-06',
  updatedAt: '2024-11-06',
  
  // Research task
  task: {
    title: 'RBAC Workflows Exploration',
    description: 'Explore different RBAC scenarios in multi-tenant environments',
    steps: [
      'Understand fleet admin delegation patterns',
      'Explore tenant admin self-service',
      'Test empty state flows for new environments'
    ]
  }
};

