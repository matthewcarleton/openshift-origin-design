import React from 'react';
import { Content } from '@patternfly/react-core';
import type { AlertKpiBreakdownRow } from './data';

function severityLabel(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export interface AlertKpiTooltipProps {
  /** e.g. “Critical alerts”, “Warning alerts” */
  bucketLabel: string;
  rows: AlertKpiBreakdownRow[];
}

/**
 * Structured KPI breakdown for PatternFly `Tooltip` content (left-aligned, readable line length).
 */
export const AlertKpiTooltip: React.FC<AlertKpiTooltipProps> = ({ bucketLabel, rows }) => {
  if (rows.length === 0) {
    return (
      <div className="ols-aio-kpi-tooltip">
        <Content component="p" className="pf-v6-u-font-size-sm" style={{ margin: 0 }}>
          No {bucketLabel.toLowerCase()} in this scope.
        </Content>
      </div>
    );
  }

  return (
    <div className="ols-aio-kpi-tooltip">
      <Content
        component="p"
        className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold"
        style={{ margin: 0, marginBottom: 'var(--pf-t--global--spacer--xs)' }}
      >
        {bucketLabel} ({rows.length})
      </Content>
      <ul className="ols-aio-kpi-tooltip__list">
        {rows.map((r, i) => (
          <li key={`${r.title}-${r.component}-${i}`}>
            <span className="pf-v6-u-font-size-sm">
              <strong>{r.title}</strong>
              {' · '}
              Severity: {severityLabel(r.severity)}
              {' · '}
              Component: {r.component}
              {' · '}
              Category: {r.domainCategory}
              {' · '}
              Insight: {r.insightCategory}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
