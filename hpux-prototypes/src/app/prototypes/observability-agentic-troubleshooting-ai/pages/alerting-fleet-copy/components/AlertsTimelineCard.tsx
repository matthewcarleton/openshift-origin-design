import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
  Divider,
  Content,
  Label,
  Button,
  Stack,
  StackItem,
  Alert as PfAlert,
} from '@patternfly/react-core';
import { TimesIcon, ArrowRightIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import type { TrendData } from '../data/types';

interface AlertsTimelineCardProps {
  trendData: TrendData[];
  onAlertClick?: (alertName: string) => void;
  onViewContributingAlerts?: (alertNames: string[]) => void;
  triggeredFromDate?: string;
  triggeredFromTime?: string;
  triggeredToDate?: string;
  triggeredToTime?: string;
}

/** Convert a relative timestamp like "2h ago" into a formatted time like "2:00 PM". */
function toDisplayTime(relativeTs: string): string {
  const now = new Date();
  const match = relativeTs.match(/^(\d+)h?\s*ago$/i);
  if (match) {
    const hoursAgo = parseInt(match[1], 10);
    const d = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (/now/i.test(relativeTs)) {
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  return relativeTs;
}

/** Convert a relative timestamp to an absolute Date for comparison. */
function toAbsoluteDate(relativeTs: string): Date | null {
  const now = new Date();
  const match = relativeTs.match(/^(\d+)h?\s*ago$/i);
  if (match) return new Date(now.getTime() - parseInt(match[1], 10) * 60 * 60 * 1000);
  if (/now/i.test(relativeTs)) return now;
  return null;
}

export const AlertsTimelineCard: React.FC<AlertsTimelineCardProps> = ({ trendData: rawTrendData, onAlertClick, onViewContributingAlerts, triggeredFromDate, triggeredFromTime, triggeredToDate, triggeredToTime }) => {
  const trendData = React.useMemo(() => {
    if (!triggeredFromDate && !triggeredFromTime && !triggeredToDate && !triggeredToTime) return rawTrendData;
    const fromDt = (triggeredFromDate || triggeredFromTime)
      ? new Date(`${triggeredFromDate || new Date().toISOString().split('T')[0]}T${triggeredFromTime || '00:00'}`)
      : null;
    const toDt = (triggeredToDate || triggeredToTime)
      ? new Date(`${triggeredToDate || new Date().toISOString().split('T')[0]}T${triggeredToTime || '23:59'}`)
      : null;
    return rawTrendData.filter(d => {
      const dt = toAbsoluteDate(d.timestamp);
      if (!dt) return true;
      if (fromDt && dt < fromDt) return false;
      if (toDt && dt > toDt) return false;
      return true;
    });
  }, [rawTrendData, triggeredFromDate, triggeredFromTime, triggeredToDate, triggeredToTime]);
  const [selectedAnomaly, setSelectedAnomaly] = React.useState<{ timestamp: string; index: number } | null>(null);
  const chartRef = React.useRef<any>(null);

  const avgAlerts = React.useMemo(() => {
    const totals = trendData.map(d => d.critical + d.warning + d.info);
    return totals.reduce((a, b) => a + b, 0) / totals.length;
  }, [trendData]);

  const detectAnomalies = React.useMemo(() => {
    const threshold = avgAlerts * 2;
    return trendData.map((d, i) => {
      const total = d.critical + d.warning + d.info;
      return total > threshold ? { index: i, value: total, timestamp: d.timestamp, excess: total - Math.round(avgAlerts) } : null;
    }).filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [trendData, avgAlerts]);

  const hasAnomaly = detectAnomalies.length > 0;
  const mostSignificantAnomaly = detectAnomalies.length > 0 ? detectAnomalies[0] : null;
  const isPanelOpen = selectedAnomaly !== null;

  const intentLineData = React.useMemo(() => {
    const lines: any[] = [];
    if (selectedAnomaly) {
      lines.push({
        xAxis: selectedAnomaly.index,
        label: {
          show: true,
          formatter: '▼ Spike',
          position: 'start',
          color: '#c9190b',
          fontWeight: 'bold',
          fontSize: 11,
          fontFamily: 'RedHatText, sans-serif',
        },
        lineStyle: { color: '#c9190b', type: 'dashed' as const, width: 2 },
      });
    }
    return lines;
  }, [selectedAnomaly]);

  const option: any = React.useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#d2d2d2',
      borderWidth: 1,
      textStyle: { color: '#151515', fontFamily: 'RedHatText, sans-serif' },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const dataPoint = trendData[dataIndex];
        const displayTime = toDisplayTime(dataPoint.timestamp);
        let content = `<strong>${displayTime}</strong> <span style="color:#6a6e73">(${dataPoint.timestamp})</span><br/>`;
        params.forEach((param: any) => {
          if (param.seriesName !== 'Anomaly' && param.seriesName !== 'Baseline') {
            content += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
          }
        });
        const total = dataPoint.critical + dataPoint.warning + dataPoint.info;
        content += `<span style="color:#6a6e73">── Baseline: ~${Math.round(avgAlerts)} alerts</span><br/>`;
        if (total > avgAlerts * 1.5) {
          content += `<span style="color:#c9190b">Total: <strong>${total}</strong> (${Math.round((total / avgAlerts - 1) * 100)}% above baseline)</span><br/>`;
        }
        if (dataPoint.topAlerts && dataPoint.topAlerts.length > 0) {
          const total = dataPoint.critical + dataPoint.warning + dataPoint.info;
          const excess = total - Math.round(avgAlerts);
          content += `<br/><strong style="color: #c9190b;">⚠ Spike detected</strong><br/>`;
          content += `Exceeded baseline by <strong>${excess}</strong> alerts.<br/>`;
          content += `<span style="color: #06c; font-size: 11px;">Click to inspect</span>`;
        }
        return content;
      },
    },
    legend: {
      data: ['Critical', 'Warning', 'Info', 'Baseline'],
      bottom: 0,
      textStyle: { fontFamily: 'RedHatText, sans-serif' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.map(d => d.timestamp),
      axisLabel: { fontFamily: 'RedHatText, sans-serif' },
      axisPointer: { show: true, lineStyle: { color: '#6a6e73', type: 'dashed' as const, width: 1 } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontFamily: 'RedHatText, sans-serif' },
    },
    series: [
      {
        name: 'Critical',
        type: 'line',
        stack: 'Total',
        emphasis: { focus: 'series' },
        data: trendData.map(d => d.critical),
        itemStyle: { color: '#c9190b' },
        lineStyle: { color: '#c9190b' },
        areaStyle: { color: '#c9190b', opacity: 0.3 },
        markLine: intentLineData.length > 0 ? {
          silent: true,
          symbol: 'none',
          data: intentLineData,
        } : undefined,
      },
      {
        name: 'Warning',
        type: 'line',
        stack: 'Total',
        emphasis: { focus: 'series' },
        data: trendData.map(d => d.warning),
        itemStyle: { color: '#f0ab00' },
        lineStyle: { color: '#f0ab00' },
        areaStyle: { color: '#f0ab00', opacity: 0.3 },
      },
      {
        name: 'Info',
        type: 'line',
        stack: 'Total',
        emphasis: { focus: 'series' },
        data: trendData.map(d => d.info),
        itemStyle: { color: '#6753ac' },
        lineStyle: { color: '#6753ac' },
        areaStyle: { color: '#6753ac', opacity: 0.3 },
      },
      {
        name: 'Baseline',
        type: 'line',
        data: trendData.map(() => Math.round(avgAlerts)),
        itemStyle: { color: '#8a8d90' },
        lineStyle: { color: '#8a8d90', type: 'dashed' as const, width: 1.5, opacity: 0.5 },
        symbol: 'none',
        tooltip: { show: false },
        silent: true,
        z: 1,
      },
      ...(detectAnomalies.length > 0 ? [{
        name: 'Anomaly',
        type: 'scatter',
        data: detectAnomalies.map(anomaly => [anomaly.index, anomaly.value]),
        symbol: 'circle',
        symbolSize: 12,
        itemStyle: { color: '#c9190b', borderColor: '#fff', borderWidth: 2 },
        emphasis: {
          itemStyle: {
            color: '#c9190b',
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(201, 25, 11, 0.5)',
          },
        },
        zlevel: 10,
      }] : []),
    ],
  }), [trendData, detectAnomalies, intentLineData, avgAlerts]);

  const handleChartClick = React.useCallback((params: any) => {
    if (params.seriesName === 'Anomaly') {
      const anomaly = detectAnomalies[params.dataIndex];
      if (anomaly) {
        setSelectedAnomaly({ timestamp: anomaly.timestamp, index: anomaly.index });
      }
    } else if (params.dataIndex !== undefined) {
      const dp = trendData[params.dataIndex];
      if (dp?.topAlerts && dp.topAlerts.length > 0) {
        setSelectedAnomaly({ timestamp: dp.timestamp, index: params.dataIndex });
      }
    }
  }, [detectAnomalies, trendData]);


  const anomalyData = selectedAnomaly ? trendData[selectedAnomaly.index] : null;
  const topAlerts = anomalyData?.topAlerts || [];
  const totalAlerts = anomalyData ? anomalyData.critical + anomalyData.warning + anomalyData.info : 0;
  const excess = anomalyData ? totalAlerts - Math.round(avgAlerts) : 0;
  const spikeDisplayTime = mostSignificantAnomaly ? toDisplayTime(mostSignificantAnomaly.timestamp) : '';
  const selectedDisplayTime = selectedAnomaly ? toDisplayTime(selectedAnomaly.timestamp) : '';

  return (
    <Card>
      <CardHeader>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem><CardTitle>Alert velocity and trends</CardTitle></FlexItem>
          <FlexItem>
            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              Click anomaly markers to inspect
            </Content>
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardBody style={{ padding: 0 }}>
        {/* Full-height flex container: banner + chart on left, panel on right */}
        <div style={{ display: 'flex', minHeight: '380px' }}>
          {/* Left: banner + chart stacked */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '16px' }}>
            {hasAnomaly && mostSignificantAnomaly && (
              <div style={{ marginBottom: '12px' }}>
                <PfAlert
                  variant="warning"
                  isInline
                  title={`Spike detected at ${spikeDisplayTime}`}
                  style={{ cursor: 'pointer' }}
                  onMouseDown={() => setSelectedAnomaly({ timestamp: mostSignificantAnomaly.timestamp, index: mostSignificantAnomaly.index })}
                >
                  <Content component="p">
                    Alert volume exceeded the historical baseline by {mostSignificantAnomaly.excess} alert{mostSignificantAnomaly.excess !== 1 ? 's' : ''} during this window.
                    {!isPanelOpen && (
                      <Button variant="link" isInline style={{ marginLeft: '8px', fontSize: '13px' }}>
                        Inspect spike <ArrowRightIcon style={{ marginLeft: '4px', fontSize: '11px' }} />
                      </Button>
                    )}
                  </Content>
                </PfAlert>
              </div>
            )}
            <div style={{ flex: 1, minHeight: '300px' }}>
              <ReactECharts
                ref={chartRef}
                option={option}
                style={{ height: '100%', width: '100%', cursor: 'crosshair' }}
                    onEvents={{
                      click: handleChartClick,
                    }}
              />
            </div>
          </div>

          {/* Right: details panel spanning full card height */}
          {isPanelOpen && anomalyData && (
            <div style={{
              width: '300px',
              flexShrink: 0,
              borderLeft: '2px solid var(--pf-t--global--border--color--default)',
              backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Panel header */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Content component="p" style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>
                      Spike at {selectedDisplayTime}
                    </Content>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="plain" aria-label="Close panel" onClick={() => setSelectedAnomaly(null)} style={{ padding: '4px' }}>
                      <TimesIcon />
                    </Button>
                  </FlexItem>
                </Flex>
              </div>

              {/* Spike summary */}
              <div style={{ padding: '12px 16px' }}>
                <Content component="p" style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '10px' }}>
                  Exceeded baseline by <strong style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{excess}</strong> alert{excess !== 1 ? 's' : ''} ({totalAlerts} total vs ~{Math.round(avgAlerts)} avg).
                </Content>
                <Flex gap={{ default: 'gapSm' }} style={{ flexWrap: 'wrap' }}>
                  <Label color="red" isCompact>{anomalyData.critical} Critical</Label>
                  <Label color="orange" isCompact>{anomalyData.warning} Warning</Label>
                  <Label color="purple" isCompact>{anomalyData.info} Info</Label>
                </Flex>
              </div>

              <Divider />

              {/* Top contributing alerts */}
              {topAlerts.length > 0 && (
                <div style={{ padding: '12px 16px', flex: 1 }}>
                  <Content component="p" style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
                    Top contributing alerts
                  </Content>
                  <Stack>
                    {topAlerts.map((alertName, idx) => (
                      <StackItem key={idx}>
                        <div style={{
                          padding: '8px 0',
                          borderBottom: idx < topAlerts.length - 1 ? '1px solid var(--pf-t--global--border--color--default)' : undefined,
                        }}>
                          <Flex alignItems={{ default: 'alignItemsFlexStart' }} gap={{ default: 'gapSm' }}>
                            <FlexItem>
                              <Label color="red" isCompact style={{ minWidth: '22px', textAlign: 'center' }}>{idx + 1}</Label>
                            </FlexItem>
                            <FlexItem style={{ flex: 1, minWidth: 0 }}>
                              <Content component="p" style={{ fontWeight: 500, fontSize: '13px', marginBottom: '4px', wordBreak: 'break-word' }}>
                                {alertName}
                              </Content>
                              <Button
                                variant="link"
                                isInline
                                style={{ fontSize: '12px', padding: 0 }}
                                onClick={() => onAlertClick?.(alertName)}
                                icon={<ExternalLinkAltIcon style={{ fontSize: '10px' }} />}
                                iconPosition="end"
                              >
                                View in table
                              </Button>
                            </FlexItem>
                          </Flex>
                        </div>
                      </StackItem>
                    ))}
                  </Stack>
                </div>
              )}

              <Divider />

              {/* Panel footer actions */}
              <div style={{ padding: '12px 16px' }}>
                <Stack hasGutter>
                  <StackItem>
                    <Button
                      variant="secondary"
                      isBlock
                      size="sm"
                      onClick={() => {
                        if (onViewContributingAlerts && topAlerts.length > 0) {
                          onViewContributingAlerts(topAlerts);
                        }
                        setSelectedAnomaly(null);
                      }}
                    >
                      View all {topAlerts.length} contributing alerts in table
                    </Button>
                  </StackItem>
                  <StackItem>
                    <Button
                      variant="link"
                      isInline
                      style={{ fontSize: '13px' }}
                      onClick={() => setSelectedAnomaly(null)}
                    >
                      Review in Incidents tab
                    </Button>
                  </StackItem>
                </Stack>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
