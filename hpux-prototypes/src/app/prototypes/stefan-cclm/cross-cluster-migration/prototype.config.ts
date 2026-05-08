import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'cross-cluster-migration',
  name: 'Cross Cluster Live Migration',
  description: 'Move 80 running VMs from core-billing project in us-east-prod-02 cluster to us-west-prod-01 cluster before decommissioning.',
  
  version: '1.0.0',
  
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
  },
  status: 'in-progress',
  persona: {
    name: 'Dan Dreiberg',
    role: 'Virtualization Administrator',
    organization: 'Petemobile (Telco)'
  },
  task: {
    title: 'Migrate VMs Across Clusters',
    description: 'Move 80 running VMs from core-billing project in us-east-prod-02 to us-west-prod-01 cluster.',
  },
  perspectives: ['fleet-virtualization'],
  tags: ['cclm', 'migration', 'virtualization', 'live-migration'],
  createdAt: '2024-03-01',
  updatedAt: '2024-11-06'
};

