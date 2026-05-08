import React, { useSyncExternalStore } from 'react';
import { getSimulationSnapshot, subscribeSimulation } from './simulationStore';
import type { SimulationSnapshot } from './simulationTypes';

/**
 * Marks UI that participates in the shared observability simulation (same store as OLS).
 * OLS runs in a separate React root; both use `useSimulation()` backed by `simulationStore`.
 */
export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export function useSimulation(): SimulationSnapshot {
  return useSyncExternalStore(subscribeSimulation, getSimulationSnapshot, getSimulationSnapshot);
}
