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

  designNotes: {
    designerNotes:
      'Summit demo prototype for AI-assisted troubleshooting in the Observability stack. The agent guides an SRE through a structured investigation flow — gathering evidence, correlating signals, and surfacing recommended next steps — without requiring deep Prometheus/OCP expertise.',
    navigationGuide: [
      {
        page: 'AI Hub entry point',
        path: '/core/observe/ai-hub',
        notes:
          'Landing page for the agentic session. Look for the "start new investigation" CTA and the recent sessions list — confirm with Foday whether session history is in scope for Summit.',
      },
      {
        page: 'Active Investigation',
        path: '/core/observe/ai-hub/investigation',
        notes:
          'Chat-style interface with step cards. Each agent action (query metrics, check events, correlate) surfaces as a collapsible card so the SRE can follow the reasoning chain.',
      },
      {
        page: 'Evidence Panel',
        path: '/core/observe/ai-hub/investigation/evidence',
        notes:
          'Side panel showing raw signal data the agent gathered. Review whether this should be a persistent panel or an on-demand drawer.',
      },
    ],
  },
};
