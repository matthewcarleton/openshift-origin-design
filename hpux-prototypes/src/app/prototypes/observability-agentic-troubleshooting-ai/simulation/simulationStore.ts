import type { AgentPulseStatus, AlertRecord, ClusterRecord, ViewMode } from '../components/autonomousAiObserve/data';
import {
  INITIAL_SIMULATION_SNAPSHOT,
  type SimulationAlertBrief,
  type SimulationHandoff,
  type SimulationPlayAlong,
  type SimulationSnapshot,
} from './simulationTypes';

function toBrief(a: AlertRecord): SimulationAlertBrief {
  return {
    id: a.id,
    title: a.title,
    severity: a.severity,
    service: a.service,
    firedAt: a.firedAt,
    message: a.message,
    agentStatus: a.agentStatus,
    rcaSummary: a.rcaSummary,
    rootCauseRef: a.rootCauseRef,
    rootCauseTail: a.rootCauseTail,
    remediationSummary: a.remediationSummary,
    remediationCommands: a.remediationCommands,
    remediationRiskSummary: a.remediationRiskSummary,
    agentInvestigationNarrative: a.agentInvestigationNarrative,
    confidence: a.confidence,
    steps: a.steps.map((s) => ({
      id: s.id,
      time: s.time,
      title: s.title,
      status: s.status,
      detail: s.detail,
    })),
  };
}

export function isAgentHotAlert(a: AlertRecord): boolean {
  return (
    (a.severity === 'critical' || a.severity === 'warning') &&
    (a.agentStatus === 'investigating' || a.agentStatus === 'remediating')
  );
}

export interface ObserveSimulationSyncInput {
  viewMode: ViewMode;
  /** `null` when no cluster is chosen (Core platforms until user picks from the menu). */
  selectedCluster: ClusterRecord | null;
  clusterAlerts: AlertRecord[];
  expandedAlerts: Record<string, boolean>;
  observeWidgetExpanded: boolean;
  isMultiCluster: boolean;
  fleetAgentPulse: AgentPulseStatus;
  /** Optional: alert id when user engages an ambient sparkle target */
  ambientIndicatorAlertId?: string | null;
}

let snapshot: SimulationSnapshot = { ...INITIAL_SIMULATION_SNAPSHOT };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getSimulationSnapshot(): SimulationSnapshot {
  return snapshot;
}

export function subscribeSimulation(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Push latest Autonomous analysis scope into the shared simulation. */
export function syncObserveSimulationState(input: ObserveSimulationSyncInput): void {
  const expandedAlertIds = Object.entries(input.expandedAlerts)
    .filter(([, open]) => open)
    .map(([id]) => id);

  const isIncidentActive = input.clusterAlerts.some(isAgentHotAlert);

  const sc = input.selectedCluster;
  snapshot = {
    ...snapshot,
    viewMode: input.viewMode,
    selectedClusterId: sc?.id ?? '',
    selectedClusterName: sc?.name ?? '',
    selectedClusterHealth: sc?.health ?? 'healthy',
    selectedClusterAgentStatus: sc?.agentStatus ?? 'idle',
    fleetAgentPulse: input.fleetAgentPulse,
    isMultiCluster: input.isMultiCluster,
    isIncidentActive,
    alerts: input.clusterAlerts.map(toBrief),
    expandedAlertIds,
    observeWidgetExpanded: input.observeWidgetExpanded,
    ambientIndicatorAlertId:
      input.ambientIndicatorAlertId === undefined
        ? snapshot.ambientIndicatorAlertId
        : input.ambientIndicatorAlertId,
    updatedAt: Date.now(),
  };
  emit();
}

/**
 * Merge or replace “play along” context from any prototype (or new UI) so OLS can reference it in-character.
 * Pass `null` to clear. Call from `onActivate` / route mount / teardown as appropriate in other prototypes.
 */
export function mergeSimulationPlayAlong(partial: Partial<SimulationPlayAlong> | null): void {
  if (partial === null) {
    snapshot = { ...snapshot, playAlong: null, updatedAt: Date.now() };
    emit();
    return;
  }
  const prev = snapshot.playAlong ?? {};
  snapshot = {
    ...snapshot,
    playAlong: {
      ...prev,
      ...partial,
      contextBullets: partial.contextBullets ?? prev.contextBullets,
    },
    updatedAt: Date.now(),
  };
  emit();
}

export function clearSimulationPlayAlong(): void {
  mergeSimulationPlayAlong(null);
}

export function setSimulationAmbientAlert(alertId: string | null): void {
  snapshot = { ...snapshot, ambientIndicatorAlertId: alertId, updatedAt: Date.now() };
  emit();
}

export function setPendingSimulationHandoff(handoff: SimulationHandoff | null): void {
  snapshot = { ...snapshot, pendingHandoff: handoff, updatedAt: Date.now() };
  emit();
}

export function takePendingSimulationHandoff(): SimulationHandoff | null {
  const h = snapshot.pendingHandoff;
  if (!h) {
    return null;
  }
  snapshot = { ...snapshot, pendingHandoff: null, updatedAt: Date.now() };
  emit();
  return h;
}

export function peekPendingSimulationHandoff(): SimulationHandoff | null {
  return snapshot.pendingHandoff;
}

export function resetSimulationStore(): void {
  snapshot = { ...INITIAL_SIMULATION_SNAPSHOT, updatedAt: Date.now() };
  emit();
}
