import type { AgentPulseStatus, AlertSeverity, ClusterHealth, ViewMode } from '../components/autonomousAiObserve/data';

/** Serialized alert slice shared between Autonomous analysis and OLS (no mock/fake wording in UX). */
export interface SimulationAlertBrief {
  id: string;
  title: string;
  severity: AlertSeverity;
  service: string;
  firedAt: string;
  message: string;
  agentStatus: AgentPulseStatus;
  rcaSummary: string;
  rootCauseRef: string;
  rootCauseTail: string;
  remediationSummary: string;
  remediationCommands: string;
  remediationRiskSummary: string;
  agentInvestigationNarrative: string;
  confidence: number;
  steps: Array<{ id: string; time?: string; title: string; status: string; detail?: string }>;
}

export interface SimulationHandoff {
  source: 'observe-widget' | 'discuss-rca' | 'discuss-remediation';
  alertId: string;
  cardId: string;
  diagnosisName: string;
}

/**
 * Cross-prototype “play along” layer: any prototype (or new screens in this one) can merge
 * free-form operational context so OLS stays in-character without hard-coding Observe-only shapes.
 */
export interface SimulationPlayAlong {
  /** e.g. "Observability agentic", "Cost management" — steers vocabulary when alerts are empty. */
  domainLabel?: string;
  /** Treat each line as live UI / API / incident context the user can see. */
  contextBullets?: string[];
  /** Short paragraph when the prototype does not expose alert-shaped data. */
  primaryEntitySummary?: string;
}

export interface SimulationSnapshot {
  viewMode: ViewMode;
  selectedClusterId: string;
  selectedClusterName: string;
  selectedClusterHealth: ClusterHealth;
  selectedClusterAgentStatus: AgentPulseStatus;
  /** Fleet aggregate when viewMode === 'fleet'. */
  fleetAgentPulse: AgentPulseStatus;
  isMultiCluster: boolean;
  /** True when the selected scope shows an agent actively working an incident. */
  isIncidentActive: boolean;
  /** Alerts in the current scope (fleet = union, cluster = filtered). */
  alerts: SimulationAlertBrief[];
  expandedAlertIds: string[];
  /** Main Autonomous analysis card expanded. */
  observeWidgetExpanded: boolean;
  /** Optional sparkle / ambient target (alert id) for pre-analyzed chain explanations. */
  ambientIndicatorAlertId: string | null;
  /** One-shot handoff consumed when OLS drawer opens or Discuss handler runs. */
  pendingHandoff: SimulationHandoff | null;
  /** Optional narrative from any prototype — see `mergeSimulationPlayAlong`. */
  playAlong: SimulationPlayAlong | null;
  updatedAt: number;
}

export const INITIAL_SIMULATION_SNAPSHOT: SimulationSnapshot = {
  viewMode: 'cluster',
  selectedClusterId: '',
  selectedClusterName: '',
  selectedClusterHealth: 'healthy',
  selectedClusterAgentStatus: 'idle',
  fleetAgentPulse: 'idle',
  isMultiCluster: false,
  isIncidentActive: false,
  alerts: [],
  expandedAlertIds: [],
  observeWidgetExpanded: true,
  ambientIndicatorAlertId: null,
  pendingHandoff: null,
  playAlong: null,
  updatedAt: 0,
};
