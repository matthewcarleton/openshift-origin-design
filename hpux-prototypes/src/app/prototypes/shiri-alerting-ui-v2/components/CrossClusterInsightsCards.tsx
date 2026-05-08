import * as React from 'react';
import { Card, CardBody, CardHeader, CardTitle, StackItem, Flex, FlexItem, Tooltip, ToggleGroup, ToggleGroupItem, Button } from '@patternfly/react-core';
import { HelpIcon, InfoCircleIcon } from '@patternfly/react-icons';
import type { ClusterData } from '../data/types';
import { FleetHealthInsightsView } from './FleetHealthInsightsView';
import { FleetHealthChartView } from './FleetHealthChartView';
import { useFleetHealthData } from '../data/useFleetHealthData';

type ViewMode = 'chart' | 'table';
const CARD_MIN_HEIGHT = 420;

interface CrossClusterInsightsCardsProps {
  clusters: ClusterData[];
  onAlertRuleClick: (alertName: string) => void;
  onComponentClick: (componentName: string) => void;
  onClusterClick?: (clusterName: string) => void;
  onViewAllFiringAlerts?: () => void;
  onViewAllClusters?: () => void;
}

export const CrossClusterInsightsCards: React.FC<CrossClusterInsightsCardsProps> = ({
  clusters,
  onAlertRuleClick,
  onComponentClick,
  onViewAllFiringAlerts,
  onViewAllClusters,
}) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>('table');
  const [groupByComponent, setGroupByComponent] = React.useState(false);

  const data = useFleetHealthData(clusters, groupByComponent);

  return (
    <StackItem>
      <Card style={{ minHeight: CARD_MIN_HEIGHT, display: 'flex', flexDirection: 'column' }}>
        <CardHeader>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Flex gap={{ default: 'gapXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                <CardTitle>Fleet-wide alert impact</CardTitle>
                <Tooltip content="Unified view of top alerts and component impact. Use Insights or Chart view.">
                  <Button variant="plain" aria-label="More information" icon={<InfoCircleIcon />} />
                </Tooltip>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                <ToggleGroup isCompact aria-label="View mode">
                  <ToggleGroupItem text="Insights view" buttonId="insights" isSelected={viewMode === 'table'} onChange={() => setViewMode('table')} />
                  <ToggleGroupItem text="Chart view" buttonId="chart" isSelected={viewMode === 'chart'} onChange={() => setViewMode('chart')} />
                </ToggleGroup>
                <Tooltip content={<div><strong>Insights:</strong> Blast radius by alert. <strong>Chart:</strong> Stacked bar (Cluster-wide vs Namespace-specific). Toggle Group by Component for component view.</div>}>
                  <Button variant="plain" aria-label="View mode help" icon={<HelpIcon />} />
                </Tooltip>
              </Flex>
            </FlexItem>
          </Flex>
        </CardHeader>
        <CardBody style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {viewMode === 'chart' ? (
            <FleetHealthChartView
              option={data.stackedBarOption}
              fleetChartData={data.fleetChartData}
              groupByComponent={groupByComponent}
              onGroupByComponentChange={setGroupByComponent}
              onAlertRuleClick={onAlertRuleClick}
              onComponentClick={onComponentClick}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}>
              <FleetHealthInsightsView
                alertRuleData={data.alertRuleData}
                componentInsightsTop5={data.componentInsightsTop5}
                componentCount={data.fleetChartDataByComponent.length}
                totalFiringAlertsCount={data.totalFiringAlertsCount}
                hasAlertData={data.hasAlertData}
                onAlertRuleClick={onAlertRuleClick}
                onComponentClick={onComponentClick}
                onViewAllFiringAlerts={onViewAllFiringAlerts}
                onViewAllClusters={onViewAllClusters}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </StackItem>
  );
};
