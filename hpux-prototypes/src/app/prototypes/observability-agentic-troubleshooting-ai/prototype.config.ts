import { PrototypeConfig } from '@app/core/types';

export const config: PrototypeConfig = {
  id: 'observability-agentic-troubleshooting-ai',
  name: 'Observability Agentic Troubleshooting (Summit)',
  description:
    'Prototype for AI-assisted, agent-style troubleshooting flows in cluster observability—guided investigation, evidence gathering, and recommended next steps.',
  owner: {
    name: 'Foday Kargbo',
    slack: '@Foday',
    email: 'fkargbo@redhat.com',
  },
  version: '1.0.0',
  status: 'in-progress',
  persona: {
    name: 'SRE / Platform engineer',
    role: 'Diagnosing observability pipeline and workload issues',
  },
  perspectives: ['fleet-management', 'core-platforms'],
  tags: ['Observability', 'AI', 'Troubleshooting', 'Agents'],
  createdAt: '2026-04-23',
  updatedAt: '2026-04-23',
};
