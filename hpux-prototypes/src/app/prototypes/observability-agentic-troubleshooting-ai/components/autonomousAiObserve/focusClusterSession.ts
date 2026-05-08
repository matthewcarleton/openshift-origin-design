import { CLUSTERS } from './data';

/** Session key for “zoom” handoff: same focused cluster after Fleet ↔ Core platforms switches. */
export const FOCUSED_CLUSTER_SESSION_KEY = 'hpux.observability-agentic-troubleshooting-ai.focused-cluster-id';

export function readFocusedClusterIdFromSession(): string | undefined {
  try {
    const v = sessionStorage.getItem(FOCUSED_CLUSTER_SESSION_KEY);
    if (v && CLUSTERS.some((c) => c.id === v)) {
      return v;
    }
  } catch {
    /* storage disabled / private mode */
  }
  return undefined;
}

export function writeFocusedClusterIdToSession(clusterId: string): void {
  try {
    if (CLUSTERS.some((c) => c.id === clusterId)) {
      sessionStorage.setItem(FOCUSED_CLUSTER_SESSION_KEY, clusterId);
    }
  } catch {
    /* ignore */
  }
}

export function clearFocusedClusterSession(): void {
  try {
    sessionStorage.removeItem(FOCUSED_CLUSTER_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
