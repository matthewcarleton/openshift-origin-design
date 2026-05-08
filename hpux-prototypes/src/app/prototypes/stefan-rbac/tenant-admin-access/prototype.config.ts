/**
 * Tenant Admin Access Prototype Configuration
 * 
 * Migrated from: use-case-2
 * Research: Tenant administrator managing project access
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'tenant-admin-access',
  parentId: 'acm-rbac-parent',
  childOrder: 2,
  
  name: 'Tenant Admin - Project Access',
  
  description: 'Explore how tenant administrators grant team access to projects spanning multiple clusters. Testing project-scoped role assignment and multi-cluster resource management.',
  
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
    email: 'skukla@redhat.com'
  },
  
  version: '1.0.0',
  status: 'in-progress',
  
  persona: {
    name: 'Walter Joseph Kovacs',
    role: 'Tenant admin',
    organization: 'Petemobile (Telco)'
  },
  
  task: {
    title: 'Grant Project Access',
    description: 'Give group dev-team-alpha the Virtualization admin role on project project-starlight-dev, which spans clusters dev-team-a and dev-team-b in the petemobile-dev-clusters cluster set.',
  },
  
  perspectives: ['fleet-management'],
  
  tags: ['rbac', 'multi-tenancy', 'acm', 'projects', 'team-access', 'user-research'],
  
  dependencies: [
    '@app/shared/components/layouts/DetailPageLayout',
    '@app/shared/components/layouts/TableLayout',
    '@app/shared/components/wizards/BaseWizard'
  ],
  
  createdAt: '2024-01-20',
  updatedAt: '2024-11-06'
};

