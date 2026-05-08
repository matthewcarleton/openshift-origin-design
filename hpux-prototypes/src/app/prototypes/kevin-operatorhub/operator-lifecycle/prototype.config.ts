import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'operator-lifecycle',
  name: 'OpenShift Operator Lifecycle Management',
  description: 'Explore unified software catalog to discover and browse operators from multiple sources (Marketplace, Community, Red Hat).',
  owner: {
    name: 'Kevin Hatchoua',
    slack: '@Kevin Hatchoua',
  },
  version: '1.0.0',
  status: 'in-progress',
  persona: {
    name: 'Dan Dreiberg',
    role: 'Virtualization Administrator',
    organization: 'Petemobile (Telco)'
  },
  task: {
    title: 'Explore Software Catalog',
    description: 'Explore the unified software catalog to discover and browse operators available from multiple sources.',
  },
  perspectives: ['core-platforms'],
  tags: ['operators', 'olm', 'operator-lifecycle', 'software-catalog'],
  createdAt: '2024-03-15',
  updatedAt: '2024-11-06'
};

