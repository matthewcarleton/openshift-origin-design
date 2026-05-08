import type { AlertData } from '../data/types';
import type {
  AlertKpiBreakdownRow,
  AlertSeverity as RowSeverity,
} from '../../../components/autonomousAiObserve/data';
import { alertDomainCategoryFromText } from '../../../components/autonomousAiObserve/data';

function fleetSeverityToRowSeverity(severity: AlertData['severity']): RowSeverity {
  if (severity === 'Critical') {
    return 'critical';
  }
  if (severity === 'Warning') {
    return 'warning';
  }
  return 'info';
}

function alertDataToRow(a: AlertData): AlertKpiBreakdownRow {
  const insightCategory = [a.group, a.source].filter(Boolean).join(' · ');
  return {
    title: a.alertName,
    severity: fleetSeverityToRowSeverity(a.severity),
    component: a.component,
    domainCategory: alertDomainCategoryFromText(a.alertName, a.component),
    insightCategory: insightCategory.length > 0 ? insightCategory : '—',
  };
}

export type FleetAlertKpiFilter = {
  severity?: AlertData['severity'];
  component?: string;
};

/** KPI tooltip rows for Fleet overview mock alerts (`AlertData`). */
export function buildFleetAlertKpiRows(firingAlerts: AlertData[], filter?: FleetAlertKpiFilter): AlertKpiBreakdownRow[] {
  let list = firingAlerts;
  if (filter?.severity) {
    list = list.filter((a) => a.severity === filter.severity);
  }
  if (filter?.component) {
    list = list.filter((a) => a.component === filter.component);
  }
  return list.map(alertDataToRow).sort((a, b) => a.title.localeCompare(b.title));
}

/** Shared PatternFly `Tooltip` props for KPI breakdown popovers (matches Autonomous analysis cards). */
export const FLEET_ALERT_KPI_TOOLTIP_PROPS = {
  position: 'top' as const,
  isContentLeftAligned: true,
  maxWidth: 'min(600px, 92vw)' as const,
};
