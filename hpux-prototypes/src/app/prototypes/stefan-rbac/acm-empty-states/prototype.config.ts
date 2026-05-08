import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'acm-empty-states',
  parentId: 'acm-rbac-parent',
  childOrder: 3,
  name: 'RBAC Empty States',
  description: 'Explore and evaluate ACM RBAC empty state designs across clusters, users, groups, roles, and projects pages.',
  owner: {
    name: 'Stefan Kukla',
    slack: '@stefan',
  },
  version: '1.0.0',
  status: 'in-progress',
  persona: {
    name: 'Adrian Veidt',
    role: 'Fleet admin',
    organization: 'Red Hat'
  },
  task: {
    title: 'Review Empty States',
    description: 'Explore and evaluate ACM RBAC empty state designs.',
  },
  perspectives: ['fleet-management'],
  tags: ['empty-states', 'ux', 'design-patterns', 'rbac'],
  createdAt: '2024-04-01',
  updatedAt: '2024-11-06'
};

