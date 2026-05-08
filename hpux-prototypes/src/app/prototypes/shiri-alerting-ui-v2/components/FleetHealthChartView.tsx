import * as React from 'react';
import { Flex, Content, Checkbox } from '@patternfly/react-core';
import ReactECharts from 'echarts-for-react';
import { ChartErrorBoundary } from './ChartErrorBoundary';

interface FleetHealthChartViewProps {
  option: Record<string, unknown>;
  fleetChartData: Array<{ id: string }>;
  groupByComponent: boolean;
  onGroupByComponentChange: (checked: boolean) => void;
  onAlertRuleClick: (id: string) => void;
  onComponentClick: (id: string) => void;
}

export const FleetHealthChartView: React.FC<FleetHealthChartViewProps> = ({
  option,
  fleetChartData,
  groupByComponent,
  onGroupByComponentChange,
  onAlertRuleClick,
  onComponentClick,
}) => {
  const hasData = fleetChartData.length > 0;
  return (
    <>
      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} className="pf-v6-u-pb-sm">
        <Checkbox id="group-by-component" isChecked={groupByComponent} onChange={(_e, checked) => onGroupByComponentChange(!!checked)} label="Group by Component" />
      </Flex>
      <div style={{ flex: 1, minHeight: 200, minWidth: 0, width: '100%' }} aria-label="Fleet-wide alert impact and scope.">
        {hasData ? (
          <ChartErrorBoundary
            fallback={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
                <Content component="p" className="pf-v6-u-color-200">Chart failed to load.</Content>
              </div>
            }
          >
            <ReactECharts
              option={option}
              style={{ width: '100%', height: '100%', minHeight: 280 }}
              opts={{ renderer: 'canvas' }}
              onEvents={{
                click: (params: { dataIndex?: number }) => {
                  const idx = params.dataIndex;
                  if (idx == null || !fleetChartData[idx]) return;
                  const d = fleetChartData[idx];
                  if (groupByComponent) onComponentClick(d.id);
                  else onAlertRuleClick(d.id);
                },
              }}
            />
          </ChartErrorBoundary>
        ) : (
          <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentCenter' }} style={{ height: '100%' }}>
            <Content component="p" className="pf-v6-u-color-200">No data to display</Content>
          </Flex>
        )}
      </div>
    </>
  );
};
