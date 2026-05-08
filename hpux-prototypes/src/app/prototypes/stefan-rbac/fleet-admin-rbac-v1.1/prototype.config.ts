/**
 * Fleet Admin RBAC Prototype Configuration
 * 
 * Migrated from: use-case-1
 * Research: Fleet administrator delegating access to tenant admins
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  // Unique identifier
  id: 'fleet-admin-rbac-v1.1',
  
  // Hierarchy
  parentId: 'acm-rbac-parent',
  childOrder: 1,
  
  // Display name
  name: 'Fleet Admin - Tenant Delegation v1.1',
  
  // What this prototype explores
  description: 'Enhanced version: Explore how fleet administrators delegate cluster set access to tenant admins with improved workflows and better UX.',
  
  // Owner information
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
    email: 'skukla@redhat.com'
  },
  
  // Version (migrated from original use-case-1)
  versionGroup: 'fleet-admin-rbac',
  version: 'v1.1',
  versionLabel: 'Enhanced Design',
  
  // Status
  status: 'in-progress',
  
  // User persona
  persona: {
    name: 'Adrian Veidt',
    role: 'Fleet admin',
    organization: 'Petemobile (Telco)'
  },
  
  // Research task
  task: {
    title: 'Delegate Cluster Set Access',
    description: 'Give user Walter Kovacs the Cluster set admin role on production and development cluster sets (petemobile-na-prod, petemobile-eu-prod, petemobile-sa-prod, petemobile-apac-prod, petemobile-dev-clusters).',
  },
  
  // Available perspectives
  perspectives: ['fleet-management'],
  
  // Tags for discovery
  tags: ['rbac', 'multi-tenancy', 'acm', 'user-management', 'cluster-sets', 'user-research'],
  
  // Shared components used
  dependencies: [
    '@app/shared/components/layouts/DetailPageLayout',
    '@app/shared/components/layouts/TableLayout',
    '@app/shared/components/wizards/BaseWizard'
  ],
  
  // Dates
  createdAt: '2024-01-15',
  updatedAt: '2024-11-06'
};

