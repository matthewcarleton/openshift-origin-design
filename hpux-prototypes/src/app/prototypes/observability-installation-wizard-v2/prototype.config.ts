/**
 * Prototype Configuration - Observability Installation Wizard v2
 * Changes in this version do not affect the current (v1) prototype.
 */

import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'observability-installation-wizard-v2',
  name: '🔍 Cluster Observability Operator Installation Wizard v2',
  description: 'Version 2 of the Cluster Observability Operator (COO) installation wizard. Same persona-based configuration and unified observability flow as v1; iterate on this copy without affecting the current prototype.',
  owner: {
    name: 'Foday Kargbo',
    slack: '@Foday',
    email: 'fkargbo@redhat.com'
  },
  versionGroup: 'observability-installation-wizard',
  version: 'v2.0',
  versionLabel: 'Version 2',
  status: 'in-progress',
  persona: {
    name: 'Cluster Administrator / SRE / Developer',
    role: 'Operators Hub User',
  },
  perspectives: ['core-platforms'],
  tags: ['Observability', 'Operators', 'Wizard', 'Installation', 'v2'],
  createdAt: '2025-01-29',
  updatedAt: '2025-01-29',
};
