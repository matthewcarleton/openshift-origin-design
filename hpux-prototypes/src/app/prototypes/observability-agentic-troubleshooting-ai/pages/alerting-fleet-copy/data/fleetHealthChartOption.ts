/**
 * Builds ECharts option for the Fleet Health stacked horizontal bar chart.
 * Isolated in a separate module to reduce IDE/TS load in CrossClusterInsightsCards.
 */
export interface FleetChartDataItem {
  label: string;
  clusterWide: number;
  namespace: number;
}

export function buildFleetHealthChartOption(
  fleetChartData: FleetChartDataItem[],
  totalClusters: number
): Record<string, unknown> {
  const yLabels = fleetChartData.map(d => d.label);
  const clusterWideValues = fleetChartData.map(d => d.clusterWide);
  const namespaceValues = fleetChartData.map(d => d.namespace);
  return {
    title: {
      text: 'Top alerts',
      subtext: 'Ranked by number of affected clusters',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 600 },
      subtextStyle: { fontSize: 11, color: '#6a6e73' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown) => {
        const arr = Array.isArray(params) ? params : [];
        const idx = (arr[0] as { dataIndex?: number } | undefined)?.dataIndex;
        if (idx == null || !fleetChartData[idx]) return '';
        const d = fleetChartData[idx];
        return `${d.label}<br/>` +
          `<span style="color:#2b9af3">●</span> Cluster-wide: ${d.clusterWide}<br/>` +
          `<span style="color:#73c872">●</span> Namespace-specific: ${d.namespace}`;
      },
    },
    legend: {
      data: ['Cluster-wide', 'Namespace-specific'],
      bottom: 0,
      left: 'center',
    },
    grid: { left: '3%', right: '12%', bottom: '15%', top: '15%', containLabel: true },
    xAxis: {
      type: 'value',
      name: 'Clusters',
      max: Math.max(45, totalClusters),
      boundaryGap: [0, 0.01],
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLabel: { fontSize: 10 },
      inverse: true,
    },
    series: [
      {
        name: 'Cluster-wide',
        type: 'bar',
        stack: 'total',
        data: clusterWideValues,
        itemStyle: { color: '#2b9af3' },
      },
      {
        name: 'Namespace-specific',
        type: 'bar',
        stack: 'total',
        data: namespaceValues,
        itemStyle: { color: '#73c872' },
      },
    ],
  };
}
