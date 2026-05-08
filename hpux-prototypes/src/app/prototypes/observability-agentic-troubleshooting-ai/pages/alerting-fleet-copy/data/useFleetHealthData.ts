import * as React from 'react';
import type { ClusterData } from './types';
import { buildFleetHealthChartOption } from './fleetHealthChartOption';

export function useFleetHealthData(clusters: ClusterData[], groupByComponent: boolean) {
  const alertRuleData = React.useMemo(() => {
    const byRule: Record<string, {
      name: string;
      component: string;
      critical: number;
      warning: number;
      info: number;
      clusters: string[];
      clusterWideClusters: string[];
      namespaceClusters: string[];
    }> = {};
    clusters.forEach(cluster => {
      cluster.alerts.filter(a => a.status === 'firing').forEach(alert => {
        if (!byRule[alert.alertName]) {
          byRule[alert.alertName] = {
            name: alert.alertName,
            component: alert.component,
            critical: 0,
            warning: 0,
            info: 0,
            clusters: [],
            clusterWideClusters: [],
            namespaceClusters: [],
          };
        }
        const r = byRule[alert.alertName];
        if (alert.severity === 'Critical') r.critical++;
        else if (alert.severity === 'Warning') r.warning++;
        else r.info++;
        if (!r.clusters.includes(cluster.name)) r.clusters.push(cluster.name);
        if (alert.group === 'Cluster' && !r.clusterWideClusters.includes(cluster.name)) r.clusterWideClusters.push(cluster.name);
        if (alert.group === 'Namespace' && !r.namespaceClusters.includes(cluster.name)) r.namespaceClusters.push(cluster.name);
      });
    });
    return Object.values(byRule)
      .sort((a, b) => (b.critical + b.warning + b.info) - (a.critical + a.warning + a.info))
      .slice(0, 8);
  }, [clusters]);

  const fleetChartDataByAlert = React.useMemo(() => {
    return [...alertRuleData]
      .map(r => ({
        id: r.name,
        label: `${r.name} (${r.component})`,
        component: r.component,
        clusterWide: r.clusterWideClusters.length,
        namespace: r.namespaceClusters.length,
        total: r.clusterWideClusters.length + r.namespaceClusters.length,
      }))
      .filter(d => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [alertRuleData]);

  const fleetChartDataByComponent = React.useMemo(() => {
    const byComp: Record<string, { clusterWideSet: Set<string>; namespaceSet: Set<string> }> = {};
    clusters.forEach(cluster => {
      cluster.alerts.filter(a => a.status === 'firing').forEach(alert => {
        if (!byComp[alert.component]) {
          byComp[alert.component] = { clusterWideSet: new Set(), namespaceSet: new Set() };
        }
        if (alert.group === 'Cluster') byComp[alert.component].clusterWideSet.add(cluster.name);
        if (alert.group === 'Namespace') byComp[alert.component].namespaceSet.add(cluster.name);
      });
    });
    return Object.entries(byComp)
      .map(([name, sets]) => ({
        id: name,
        label: name,
        clusterWide: sets.clusterWideSet.size,
        namespace: sets.namespaceSet.size,
        total: sets.clusterWideSet.size + sets.namespaceSet.size,
      }))
      .filter(d => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [clusters]);

  const totalClusters = clusters.length;
  const fleetChartData = groupByComponent ? fleetChartDataByComponent : fleetChartDataByAlert;

  const componentInsightsTop5 = React.useMemo(() => {
    const byComp: Record<string, { name: string; critical: number; warning: number; info: number; clusters: string[] }> = {};
    clusters.forEach(cluster => {
      cluster.alerts.filter(a => a.status === 'firing').forEach(alert => {
        if (!byComp[alert.component]) {
          byComp[alert.component] = { name: alert.component, critical: 0, warning: 0, info: 0, clusters: [] };
        }
        const c = byComp[alert.component];
        if (alert.severity === 'Critical') c.critical++;
        else if (alert.severity === 'Warning') c.warning++;
        else c.info++;
        if (!c.clusters.includes(cluster.name)) c.clusters.push(cluster.name);
      });
    });
    return Object.values(byComp)
      .sort((a, b) => b.clusters.length - a.clusters.length)
      .slice(0, 5);
  }, [clusters]);

  const stackedBarOption = React.useMemo(
    () => buildFleetHealthChartOption(fleetChartData, totalClusters),
    [fleetChartData, totalClusters]
  );

  const totalFiringAlertsCount = React.useMemo(
    () => clusters.reduce((s, c) => s + c.alerts.filter(a => a.status === 'firing').length, 0),
    [clusters]
  );

  const hasAlertData = alertRuleData.some(r => r.critical + r.warning + r.info > 0);

  return {
    alertRuleData,
    fleetChartDataByAlert,
    fleetChartDataByComponent,
    fleetChartData,
    componentInsightsTop5,
    stackedBarOption,
    totalFiringAlertsCount,
    hasAlertData,
    totalClusters,
  };
}
