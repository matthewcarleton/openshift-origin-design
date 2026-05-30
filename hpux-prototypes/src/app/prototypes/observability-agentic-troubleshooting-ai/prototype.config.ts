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
    overview:
      'Summit demo prototype for AI-assisted troubleshooting in the Observability stack. The agent guides an SRE through a structured investigation flow — gathering evidence, correlating signals, and surfacing recommended next steps — without requiring deep Prometheus/OCP expertise.',
    pages: [
      {
        name: 'AI Hub entry point',
        path: '/core/observe/ai-hub',
        notes:
          'Landing page for the agentic session. Needs a clear "start new investigation" CTA. Current design shows recent sessions — confirm with Foday whether session history is in scope for Summit or a stretch goal.',
      },
      {
        name: 'Active Investigation',
        path: '/core/observe/ai-hub/investigation',
        notes:
          'Chat-style interface with step cards. Each agent action (query metrics, check events, correlate) surfaces as a collapsible card so the SRE can follow the reasoning chain. Open question: how do we handle the case where the agent hits a dead end?',
      },
      {
        name: 'Evidence Panel',
        notes:
          'Side panel showing raw signal data the agent gathered. Consider whether this should be a persistent panel or a drawer opened on demand. Currently designed as always-visible to anchor trust in the agent recommendations.',
      },
    ],
    figmaUrl: 'https://www.figma.com/file/placeholder-agentic-troubleshooting',
  },
};
