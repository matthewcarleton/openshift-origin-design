/**
 * Virtualization Quotas Prototype Configuration
 * 
 * Migrated from: use-case-aaq
 * Research: AAQ (Advanced Allocation & Quotas) for virtualization
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'virtualization-quotas',
  parentId: 'virtualization-parent',
  childOrder: 1,
  
  name: 'Quotas & Resource Management',
  
  description: 'Explore how virtualization administrators create and manage resource quotas for VM workloads. Testing quota creation workflows and resource allocation patterns.',
  
  owner: {
    name: 'Anna Walker',
    slack: '@Anna Walker',
    email: 'awalker@redhat.com'
  },
  
  version: '1.0.0',
  status: 'in-progress',
  
  persona: {
    name: 'Dan Dreiberg',
    role: 'Virtualization Administrator',
    organization: 'Petemobile (Telco)'
  },
  
  task: {
    title: 'Create Resource Quota',
    description: 'Create a quota for virtualization resources based on team needs. Define CPU, memory, and storage limits for VM workloads.',
  },
  
  perspectives: ['core-platforms'],
  
  tags: ['aaq', 'virtualization', 'quotas', 'resource-management', 'cnv', 'user-research'],
  
  dependencies: [
    '@app/shared/components/layouts/DetailPageLayout',
    '@app/shared/components/wizards/BaseWizard'
  ],
  
  createdAt: '2024-02-01',
  updatedAt: '2024-11-06'
};

