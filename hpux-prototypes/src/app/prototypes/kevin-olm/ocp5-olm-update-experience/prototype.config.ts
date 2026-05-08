import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'ocp5-olm-update-experience',
  name: 'OCP 5.x — OLM update experience',
  description:
    'Console-style exploration of cluster and operator update flows with Operator Lifecycle Manager on OpenShift 5.x.',
  owner: {
    name: 'Kevin Hatchoua',
    slack: '@Kevin Hatchoua',
  },
  version: '1.0.0',
  status: 'in-progress',
  persona: {
    name: 'Cluster admin',
    role: 'Platform administration',
  },
  task: {
    title: 'Review OLM update experience',
    description: 'Walk through update messaging, sequencing, and operator surfaces aligned with OCP 5.x.',
  },
  perspectives: ['core-platforms'],
  tags: ['olm', 'operators', 'updates', 'ocp5', 'operator-lifecycle'],
  createdAt: '2026-05-07',
  updatedAt: '2026-05-07',
};
