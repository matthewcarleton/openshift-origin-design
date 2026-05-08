import { clearSimulationPlayAlong, mergeSimulationPlayAlong } from './simulation/simulationStore';

export type { SimulationPlayAlong } from './simulation/simulationTypes';

export { clearSimulationPlayAlong, mergeSimulationPlayAlong };

/**
 * Optional callbacks from Dashboards (Perses) so the globally mounted AI assistant
 * can drive Perses-only UI (notifications drawer, troubleshooting dashboard) without
 * coupling the shell layout.
 */
export const persesAgenticBridge = {
  setShowTroubleshootingDashboard: null as null | ((show: boolean) => void),
  setIsGeneratingDashboard: null as null | ((generating: boolean) => void),
  closeNotificationsDrawer: null as null | (() => void),
};

export type DiscussLightspeedContext = {
  alertId: string;
  /** e.g. `rca` | `remediation` — maps to diagnosis card scope. */
  cardId: string;
  /** Short label shown in the opening line (e.g. "Root cause analysis"). */
  diagnosisName: string;
};

export const agenticGlobalAiApi = {
  startTroubleshootingForAlert: null as null | ((alertName: string) => void),
  openDiscussWithLightspeed: null as null | ((ctx: DiscussLightspeedContext) => void),
};
