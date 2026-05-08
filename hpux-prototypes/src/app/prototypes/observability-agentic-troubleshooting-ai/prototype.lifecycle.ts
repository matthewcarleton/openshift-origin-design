import { ensureAgenticGlobalAiMounted, unmountAgenticGlobalAi } from './components/ensureAgenticGlobalAiMount';
import { clearFocusedClusterSession } from './components/autonomousAiObserve/focusClusterSession';
import { resetSimulationStore } from './simulation/simulationStore';

export function onActivate(): void {
  ensureAgenticGlobalAiMounted();
}

export function onDeactivate(): void {
  resetSimulationStore();
  clearFocusedClusterSession();
  unmountAgenticGlobalAi();
}
