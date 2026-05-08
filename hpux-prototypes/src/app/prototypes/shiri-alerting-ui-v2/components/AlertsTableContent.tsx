import * as React from 'react';
import {
  Content,
  Flex,
  FlexItem,
  Icon,
  Tooltip,
  Button,
  Label,
  Badge,
  Stack,
  StackItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Divider,
  EmptyState,
  EmptyStateBody,
  Checkbox,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InnerScrollContainer,
} from '@patternfly/react-table';
import {
  BellIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  EllipsisVIcon,
  AngleRightIcon,
  AngleDownIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';
import type {
  AlertSeverity,
  AlertComponent,
  AlertGroup,
  ClusterData,
  AlertData,
  AlertsGroupByOption,
  SortConfig,
  AggregatedAlert,
} from '../data/types';
import {
  getSeverityLabelColor,
  getStatusLabelColor,
  getSeverityIcon,
} from '../data/utils';

export interface ColumnConfig {
  key: string;
  label: string;
  isVisible: boolean;
  isLocked: boolean;
  order: number;
}

export interface AlertsTableContentProps {
  totalItems: number;
  isAggregated: boolean;
  groupBy: AlertsGroupByOption;
  groupedAlerts: { groupName: string; alerts: AggregatedAlert[]; totalCount: number }[] | null;
  groupedIndividualAlerts: { groupName: string; alerts: AlertData[] }[] | null;
  paginatedAggregatedAlerts: AggregatedAlert[];
  paginatedAlerts: (AlertData & { clusterName: string; cluster: ClusterData })[];
  expandedAlerts: string[];
  toggleExpanded: (alertKey: string) => void;
  expandedGroups: Set<string>;
  toggleGroupExpanded: (groupName: string) => void;
  severityFilter: AlertSeverity[];
  setSeverityFilter: React.Dispatch<React.SetStateAction<AlertSeverity[]>>;
  sortConfigs: SortConfig[];
  handleSort: (column: SortConfig['column']) => void;
  selectedAlertKeys: Set<string>;
  toggleSelectAll: () => void;
  toggleAlertSelection: (alertKey: string) => void;
  getVisibleColumns: () => ColumnConfig[];
  columns: ColumnConfig[];
  onAlertClick: (alert: AlertData, initialTab?: number) => void;
  onClusterClick: (cluster: ClusterData) => void;
  onAlertRuleClick: (alertName: string) => void;
  onComponentClick: (componentName: string) => void;
  openSilenceModal: (alertName: string, severity: string, clusterName: string) => void;
  openAcknowledgeModal: (alertName: string, severity: string, clusterName: string, alertId?: string) => void;
  acknowledgedAlerts?: Record<string, { by: string; at: Date }>;
  openActionMenuId: string | null;
  setOpenActionMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  singleClusterView?: boolean;
  onClusterFilterChange?: (clusters: string[]) => void;
  onNamespaceFilterChange?: (namespaces: string[]) => void;
}

const LEVEL_0_BG = 'var(--pf-t--global--background--color--secondary--default)';
const LEVEL_1_BG = '#f0f0f0';
const LEVEL_INDENT_1 = 16;
const LEVEL_INDENT_2 = 32;
const ZEBRA_EVEN = 'var(--pf-t--global--background--color--primary--default)';
const ZEBRA_ODD = '#fafafa';

const GROUP_BY_PREFIX: Record<string, string> = {
  severity: 'SEVERITY',
  alertName: 'ALERT',
  impact: 'SCOPE',
  component: 'COMPONENT',
  cluster: 'CLUSTER',
  time: 'TIME',
};

/** PatternFly Table `sort` expects `columnIndex` / `sortBy.index` as positions in the full `<Tr>` (including leading cells). */
function buildThSortParams(args: {
  columnKey: SortConfig['column'];
  visibleColKeys: string[];
  colIdx: number;
  headerOffset: number;
  sortConfigs: SortConfig[];
  handleSort: (column: SortConfig['column']) => void;
}) {
  const { columnKey, visibleColKeys, colIdx, headerOffset, sortConfigs, handleSort } = args;
  const primary = sortConfigs.find((s) => s.priority === 1);
  const primaryKey = primary?.column;
  const primaryVisibleIdx = primaryKey ? visibleColKeys.indexOf(primaryKey as string) : -1;
  const sortByIndex = primaryVisibleIdx >= 0 ? primaryVisibleIdx + headerOffset : -1;
  return {
    sortBy: {
      index: sortByIndex,
      direction: (primary?.direction ?? 'asc') as 'asc' | 'desc',
    },
    onSort: () => handleSort(columnKey),
    columnIndex: colIdx + headerOffset,
  };
}

const AlertsTableContent: React.FC<AlertsTableContentProps> = ({
  totalItems,
  isAggregated,
  groupBy,
  groupedAlerts,
  groupedIndividualAlerts,
  paginatedAggregatedAlerts,
  paginatedAlerts,
  expandedAlerts,
  toggleExpanded,
  expandedGroups,
  toggleGroupExpanded,
  severityFilter,
  setSeverityFilter,
  sortConfigs,
  handleSort,
  selectedAlertKeys,
  toggleSelectAll,
  toggleAlertSelection,
  getVisibleColumns,
  columns,
  onAlertClick,
  onClusterClick,
  onAlertRuleClick,
  onComponentClick,
  openSilenceModal,
  openAcknowledgeModal,
  acknowledgedAlerts = {},
  openActionMenuId,
  setOpenActionMenuId,
  singleClusterView = false,
  onClusterFilterChange,
  onNamespaceFilterChange,
}) => {

  const getAcknowledgeInfo = (alert: AlertData): { by: string; at: Date } | null => {
    if (acknowledgedAlerts[alert.id]) return acknowledgedAlerts[alert.id];
    if (alert.acknowledgedBy && alert.acknowledgedAt) return { by: alert.acknowledgedBy, at: alert.acknowledgedAt };
    if (alert.status === 'acknowledged') return { by: 'admin@nyf.com', at: new Date() };
    return null;
  };

  const formatAckDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' +
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const visibleCols = getVisibleColumns().filter(
    col => col.key !== 'flappingRate'
  );

  const renderAggCellContent = (col: ColumnConfig, agg: AggregatedAlert) => {
    const firstAlertInfo = agg.clusters[0];
    const firstAlert = firstAlertInfo?.cluster?.alerts?.find(
      a => a.alertName === agg.alertName && a.severity === agg.severity
    );
    switch (col.key) {
      case 'alertName':
        return (
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
            <FlexItem>
              <Badge style={{ backgroundColor: 'var(--pf-t--global--color--nonstatus--purple--default)', color: 'white' }}>A</Badge>
            </FlexItem>
            <FlexItem>{agg.alertName}</FlexItem>
          </Flex>
        );
      case 'severity':
        return <Label color={getSeverityLabelColor(agg.severity)} icon={getSeverityIcon(agg.severity)} isCompact>{agg.severity}</Label>;
      case 'total':
        return <Badge>{agg.totalCount}</Badge>;
      case 'state':
        return (
          <Tooltip content={`${agg.totalCount} alerts firing since ${firstAlertInfo?.lastFired || 'N/A'}`}>
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} style={{ cursor: 'help' }}>
              <Icon status="warning"><ExclamationTriangleIcon /></Icon>
              <span>Firing</span>
            </Flex>
          </Tooltip>
        );
      case 'group':
        return <Label isCompact>{agg.group}</Label>;
      case 'component':
        return <Label isCompact variant="outline">{agg.component}</Label>;
      case 'source':
        return firstAlert?.source || '-';
      case 'clusters':
        return (
          <Tooltip content={agg.clusters.map(c => c.name).join(', ')}>
            <Badge isRead>{agg.clusters.length} cluster{agg.clusters.length !== 1 ? 's' : ''}</Badge>
          </Tooltip>
        );
      case 'namespace':
      case 'resource':
      case 'description':
      case 'runbookUrl':
        return '-';
      case 'startTime':
        return firstAlertInfo?.lastFired || '-';
      default:
        return '-';
    }
  };

  const renderGroupCellContent = (col: ColumnConfig, group: { groupName: string; alerts: AggregatedAlert[]; totalCount: number }) => {
    const clustersInGroup = Array.from(new Set(group.alerts.flatMap(a => a.clusters.map(c => c.name))));
    switch (col.key) {
      case 'total':
        return <Badge isRead>{group.totalCount}</Badge>;
      case 'severity':
        if (groupBy === 'severity') return null;
        const criticalCount = group.alerts.filter(a => a.severity === 'Critical').length;
        const warningCount = group.alerts.filter(a => a.severity === 'Warning').length;
        const infoCount = group.alerts.filter(a => a.severity === 'Info').length;
        return (
          <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
            {criticalCount > 0 && <Label color="red" icon={<ExclamationCircleIcon />} isCompact>{criticalCount}</Label>}
            {warningCount > 0 && <Label color="orange" icon={<ExclamationTriangleIcon />} isCompact>{warningCount}</Label>}
            {infoCount > 0 && <Label color="blue" icon={<InfoCircleIcon />} isCompact>{infoCount}</Label>}
          </Flex>
        );
      default:
        return null;
    }
  };

  const renderInstanceActionMenu = (agg: AggregatedAlert, clusterInfo: AggregatedAlert['clusters'][0], instanceIdx: number) => {
    const menuId = `${agg.alertName}-${clusterInfo.name}-${instanceIdx}`;
    const alertForAction = clusterInfo.cluster?.alerts?.find(
      a => a.alertName === agg.alertName && a.severity === agg.severity
    );
    return (
      <Dropdown
        isOpen={openActionMenuId === menuId}
        onOpenChange={(isOpen) => setOpenActionMenuId(isOpen ? menuId : null)}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle ref={toggleRef} variant="plain" aria-label="Alert actions"
            onClick={() => setOpenActionMenuId(openActionMenuId === menuId ? null : menuId)}
            isExpanded={openActionMenuId === menuId}>
            <EllipsisVIcon />
          </MenuToggle>
        )}
        popperProps={{ position: 'right' }}
      >
        <DropdownList>
          <DropdownItem key="silence" onClick={() => openSilenceModal(agg.alertName, agg.severity, clusterInfo.name)}
            description="Temporarily stop notifications for this alert.">Silence alert</DropdownItem>
          <DropdownItem key="acknowledge" onClick={() => openAcknowledgeModal(agg.alertName, agg.severity, clusterInfo.name, alertForAction?.id)}
            description="Mark the alert as being addressed by your teammates.">Acknowledge</DropdownItem>
          <Divider component="li" />
          <DropdownItem key="rule" onClick={() => setOpenActionMenuId(null)}>View alert rule</DropdownItem>
          <DropdownItem key="logs" onClick={() => setOpenActionMenuId(null)}>View logs</DropdownItem>
          <DropdownItem key="metrics" onClick={() => setOpenActionMenuId(null)}>View metrics</DropdownItem>
          <DropdownItem key="incident" onClick={() => setOpenActionMenuId(null)}>See related incident</DropdownItem>
          <DropdownItem key="troubleshoot" onClick={() => setOpenActionMenuId(null)}>Troubleshoot</DropdownItem>
        </DropdownList>
      </Dropdown>
    );
  };

  const renderInstanceRow = (
    agg: AggregatedAlert,
    clusterInfo: AggregatedAlert['clusters'][0],
    instanceIdx: number,
    alertKey: string,
    leafIndex: number,
    indent: number,
  ) => {
    const alertInstance = clusterInfo.cluster?.alerts?.find(
      a => a.alertName === agg.alertName && a.severity === agg.severity
    );
    const zebraBg = leafIndex % 2 === 1 ? ZEBRA_ODD : ZEBRA_EVEN;
    return (
      <Tr key={`${alertKey}-${clusterInfo.name}-${instanceIdx}`} style={{ backgroundColor: zebraBg }}>
        <Td style={{ paddingLeft: `${indent + 8}px`, width: '40px', padding: '8px 4px' }} />
        <Td style={{ width: '40px', padding: '8px 4px' }}>
          <Checkbox id={`checkbox-${alertKey}-${instanceIdx}`} aria-label="Select instance" />
        </Td>
        <Td modifier="nowrap">
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'nowrap' }}>
            <Button variant="link" isInline onClick={() => { if (alertInstance) onAlertClick(alertInstance); }}>
              {agg.alertName}
            </Button>
            {alertInstance && getAcknowledgeInfo(alertInstance) && (() => {
              const ackInfo = getAcknowledgeInfo(alertInstance)!;
              return (
                <Tooltip content={`Acknowledged by ${ackInfo.by} at ${formatAckDate(ackInfo.at)}`}>
                  <Icon size="sm" status="info"><InfoCircleIcon /></Icon>
                </Tooltip>
              );
            })()}
          </Flex>
        </Td>
        <Td modifier="nowrap">
          <Label color={getSeverityLabelColor(agg.severity)} icon={getSeverityIcon(agg.severity)} isCompact>{agg.severity}</Label>
        </Td>
        {visibleCols.filter(c => c.key !== 'alertName' && c.key !== 'severity').map(col => {
          switch (col.key) {
            case 'total':
              return <Td key={col.key} modifier="nowrap">1</Td>;
            case 'state':
              return (
                <Td key={col.key} modifier="nowrap">
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                    <Icon status="warning"><BellIcon /></Icon>
                    <Stack>
                      <StackItem>Firing</StackItem>
                      <StackItem>
                        <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{clusterInfo.lastFired}</Content>
                      </StackItem>
                    </Stack>
                  </Flex>
                </Td>
              );
            case 'group':
              return <Td key={col.key} modifier="nowrap"><Label isCompact>{agg.group}</Label></Td>;
            case 'component':
              return <Td key={col.key} modifier="nowrap"><Label isCompact variant="outline">{agg.component}</Label></Td>;
            case 'source':
              return <Td key={col.key} modifier="nowrap">{alertInstance?.source || '-'}</Td>;
            case 'description':
              return <Td key={col.key} modifier="nowrap">{alertInstance?.description || '-'}</Td>;
            case 'startTime':
              return <Td key={col.key} modifier="nowrap">{clusterInfo.lastFired || '-'}</Td>;
            case 'runbookUrl':
              return <Td key={col.key} modifier="nowrap">
                {alertInstance?.runbookUrl
                  ? <Button variant="link" isInline component="a" href={alertInstance.runbookUrl} target="_blank" onClick={(e) => e.stopPropagation()} icon={<ExternalLinkAltIcon />} iconPosition="end">View runbook</Button>
                  : '-'}
              </Td>;
            case 'clusters':
              return (
                <Td key={col.key} modifier="nowrap">
                  <Button variant="link" isInline onClick={() => onClusterFilterChange && onClusterFilterChange([clusterInfo.name])}>
                    {clusterInfo.name}
                  </Button>
                </Td>
              );
            case 'namespace':
              return <Td key={col.key} modifier="nowrap">{alertInstance?.namespace || '-'}</Td>;
            case 'resource':
              return <Td key={col.key} modifier="nowrap">{alertInstance?.resource || '-'}</Td>;
            default:
              return <Td key={col.key} modifier="nowrap">-</Td>;
          }
        })}
        <Td modifier="nowrap">{renderInstanceActionMenu(agg, clusterInfo, instanceIdx)}</Td>
      </Tr>
    );
  };

  const renderTableHeader = (opts?: { withSelectAll?: boolean; stickyAlertName?: boolean }) => {
    const { withSelectAll = false, stickyAlertName = false } = opts || {};
    const visibleColKeys = visibleCols.map((c) => c.key);
    const aggregatedHeaderOffset = 2; // expand column + checkbox column
    return (
      <Thead style={{ position: 'sticky', top: 0, zIndex: 98, backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
        <Tr>
          <Th style={{ width: '40px', padding: '8px 4px' }} />
          <Th style={{ width: '40px', padding: '8px 4px' }}>
            {withSelectAll && (
              <Checkbox
                id="select-all-alerts"
                aria-label="Select all alerts"
                isChecked={paginatedAggregatedAlerts.length > 0 && paginatedAggregatedAlerts.every(agg => selectedAlertKeys.has(`${agg.alertName}-${agg.severity}`))}
                onChange={toggleSelectAll}
              />
            )}
          </Th>
          {visibleCols.map((col, colIdx) => {
            const columnKey = col.key as SortConfig['column'];
            const canSort = ['alertName', 'severity', 'total', 'group', 'component'].includes(col.key);
            const thProps: any = { key: col.key, modifier: 'nowrap' as const };
            if (stickyAlertName && col.key === 'alertName') { thProps.isStickyColumn = true; thProps.stickyMinWidth = '200px'; thProps.stickyLeftOffset = '80px'; }
            if (col.key === 'severity') { thProps.info = { tooltip: 'The impact level of the alert, categorized as Critical, Warning, or Info.', ariaLabel: 'More information about severity' }; }
            if (col.key === 'total') { thProps.info = { tooltip: 'The cumulative number of individual alert instances. In aggregated views, this represents the sum of all occurrences across your fleet.', ariaLabel: 'More information about total count' }; }
            if (col.key === 'group') { thProps.info = { tooltip: 'Indicates whether the alert affects the entire cluster or a specific namespace.', ariaLabel: 'More information about alert scope' }; }
            if (col.key === 'component') { thProps.info = { tooltip: 'The specific services, operators, or nodes affected by this alert.', ariaLabel: 'More information about affected component' }; }
            if (col.key === 'source') { thProps.info = { tooltip: 'Defines how the alert rule is managed. Platform alerts are default rules managed in the openshift-monitoring namespace as AlertingRules. User alerts are custom PrometheusRules created by users to monitor specific workloads.', ariaLabel: 'More information about source' }; }
            if (col.key === 'clusters') { thProps.info = { tooltip: 'The managed cluster where this alert instance is firing.', ariaLabel: 'More information about cluster' }; }
            if (col.key === 'namespace') { thProps.info = { tooltip: 'The Kubernetes namespace associated with this alert instance.', ariaLabel: 'More information about namespace' }; }
            if (col.key === 'resource') { thProps.info = { tooltip: 'The specific Kubernetes resource (e.g. node, pod) related to this alert.', ariaLabel: 'More information about resource' }; }
            if (canSort) {
              thProps.sort = buildThSortParams({
                columnKey,
                visibleColKeys,
                colIdx,
                headerOffset: aggregatedHeaderOffset,
                sortConfigs,
                handleSort,
              });
            }
            return <Th {...thProps}>{col.label}</Th>;
          })}
          <Th screenReaderText="Actions" />
        </Tr>
      </Thead>
    );
  };

  // ========== EMPTY STATE ==========
  if (totalItems === 0) {
    return (
      <EmptyState titleText="No alerts found" icon={CheckCircleIcon}>
        <EmptyStateBody>No alerts match the current filters.</EmptyStateBody>
      </EmptyState>
    );
  }

  // ========== GROUPED AGGREGATED: Hierarchical Tree Table ==========
  if (isAggregated && groupBy !== 'none' && groupedAlerts) {
    const prefix = GROUP_BY_PREFIX[groupBy] || groupBy.toUpperCase();
    return (
      <InnerScrollContainer>
        <Table aria-label="Grouped alerts tree table" variant="compact" isTreeTable>
          {renderTableHeader()}
          <Tbody>
            {groupedAlerts.map((group) => {
              const isGroupExpanded = expandedGroups.has(group.groupName);
              const clustersInGroup = Array.from(new Set(group.alerts.flatMap(a => a.clusters.map(c => c.name))));
              let leafCounter = 0;

              return (
                <React.Fragment key={group.groupName}>
                  {/* ===== LEVEL 0: Group Row — column-aligned, sticky ===== */}
                  <Tr
                    style={{
                      backgroundColor: LEVEL_0_BG,
                      cursor: 'pointer',
                      borderBottom: '2px solid var(--pf-t--global--border--color--default)',
                      position: 'sticky',
                      top: '37px',
                      zIndex: 97,
                    }}
                    onClick={() => toggleGroupExpanded(group.groupName)}
                  >
                    <Td style={{ width: '40px', padding: '8px 4px', paddingLeft: '8px' }}>
                      <Button variant="plain" aria-label="Toggle group" style={{ padding: '2px 4px' }}>
                        {isGroupExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                      </Button>
                    </Td>
                    <Td style={{ width: '40px', padding: '8px 4px' }} />
                    <Td modifier="nowrap">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <strong style={{ fontSize: '14px' }}>
                            {prefix}: {group.groupName} ({group.totalCount} alert{group.totalCount !== 1 ? 's' : ''})
                          </strong>
                        </FlexItem>
                      </Flex>
                    </Td>
                    {visibleCols.filter(c => c.key !== 'alertName').map(col => (
                      <Td key={col.key} modifier="nowrap">
                        {renderGroupCellContent(col, group)}
                      </Td>
                    ))}
                    <Td />
                  </Tr>

                  {/* ===== LEVEL 1 + LEVEL 2 ===== */}
                  {isGroupExpanded && group.alerts.map((agg) => {
                    const alertKey = `${group.groupName}-${agg.alertName}-${agg.severity}`;
                    const isAlertExpanded = expandedAlerts.includes(alertKey);

                    return (
                      <React.Fragment key={alertKey}>
                        {/* Level 1: Aggregated Alert Row — indented 16px */}
                        <Tr
                          style={{ cursor: 'pointer', backgroundColor: LEVEL_1_BG }}
                          onClick={(e) => {
                            const target = e.target as HTMLElement;
                            if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && target.tagName !== 'A' && !target.closest('button') && !target.closest('a')) {
                              toggleExpanded(alertKey);
                            }
                          }}
                        >
                          <Td style={{ paddingLeft: `${LEVEL_INDENT_1 + 8}px`, width: '40px', padding: '8px 4px' }}>
                            <Button variant="plain" aria-label="Toggle alert" style={{ padding: '2px 4px' }}
                              onClick={(e) => { e.stopPropagation(); toggleExpanded(alertKey); }}>
                              {isAlertExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                            </Button>
                          </Td>
                          <Td style={{ width: '40px', padding: '8px 4px' }} onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              id={`checkbox-${alertKey}`}
                              aria-label={`Select ${agg.alertName}`}
                              isChecked={selectedAlertKeys.has(`${agg.alertName}-${agg.severity}`)}
                              onChange={() => toggleAlertSelection(`${agg.alertName}-${agg.severity}`)}
                            />
                          </Td>
                          {visibleCols.map(col => (
                            <Td key={col.key} modifier="nowrap">{renderAggCellContent(col, agg)}</Td>
                          ))}
                          <Td modifier="nowrap" />
                        </Tr>

                        {/* Level 2: Individual Instances — indented 32px, zebra striped */}
                        {isAlertExpanded && agg.clusters.map((clusterInfo, instanceIdx) => {
                          const currentLeafIdx = leafCounter++;
                          return renderInstanceRow(agg, clusterInfo, instanceIdx, alertKey, currentLeafIdx, LEVEL_INDENT_2);
                        })}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </InnerScrollContainer>
    );
  }

  // ========== UNGROUPED AGGREGATED ==========
  if (isAggregated) {
    return (
      <InnerScrollContainer>
        <Table aria-label="Aggregated alerts table" variant="compact" isTreeTable>
          {renderTableHeader({ withSelectAll: true, stickyAlertName: true })}
          <Tbody>
            {paginatedAggregatedAlerts.map((agg) => {
              const alertKey = `${agg.alertName}-${agg.severity}`;
              const isExpanded = expandedAlerts.includes(alertKey);
              let leafCounter = 0;

              return (
                <React.Fragment key={alertKey}>
                  <Tr
                    style={{ cursor: 'pointer', backgroundColor: LEVEL_1_BG }}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && target.tagName !== 'A' && !target.closest('button') && !target.closest('a')) {
                        toggleExpanded(alertKey);
                      }
                    }}
                  >
                    <Td style={{ width: '40px', padding: '8px 4px' }}>
                      <Button variant="plain" aria-label="Toggle alert" style={{ padding: '2px 4px' }}
                        onClick={(e) => { e.stopPropagation(); toggleExpanded(alertKey); }}>
                        {isExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                      </Button>
                    </Td>
                    <Td style={{ width: '40px', padding: '8px 4px' }} onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id={`checkbox-${alertKey}`}
                        aria-label={`Select ${agg.alertName}`}
                        isChecked={selectedAlertKeys.has(alertKey)}
                        onChange={() => toggleAlertSelection(alertKey)}
                      />
                    </Td>
                    {visibleCols.map(col => {
                      const tdProps: any = { key: col.key, modifier: 'nowrap' as const };
                      if (col.key === 'alertName') { tdProps.isStickyColumn = true; tdProps.stickyMinWidth = '200px'; tdProps.stickyLeftOffset = '80px'; }
                      return <Td {...tdProps}>{renderAggCellContent(col, agg)}</Td>;
                    })}
                    <Td modifier="nowrap" />
                  </Tr>

                  {isExpanded && agg.clusters.map((clusterInfo, instanceIdx) => {
                    const currentLeafIdx = leafCounter++;
                    return renderInstanceRow(agg, clusterInfo, instanceIdx, alertKey, currentLeafIdx, LEVEL_INDENT_1);
                  })}
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </InnerScrollContainer>
    );
  }

  // ========== GROUPED INDIVIDUAL (non-aggregated) ==========
  if (!isAggregated && groupBy !== 'none' && groupedIndividualAlerts) {
    const indivVisibleCols = getVisibleColumns().filter(col => col.key !== 'total');
    const indivVisibleKeys = indivVisibleCols.map((c) => c.key);
    const groupedIndivHeaderOffset = 1; // tree expand column only
    const prefix = GROUP_BY_PREFIX[groupBy] || groupBy.toUpperCase();
    return (
      <InnerScrollContainer>
        <Table aria-label="Grouped individual alerts tree table" variant="compact" isTreeTable>
          <Thead style={{ position: 'sticky', top: 0, zIndex: 98, backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
            <Tr>
              <Th width={10} />
              {indivVisibleCols.map((col, colIdx) => {
                const columnKey = col.key as SortConfig['column'];
                const canSort = ['alertName', 'severity', 'clusters', 'group', 'component', 'startTime'].includes(col.key);
                const thProps: any = { key: col.key, modifier: 'nowrap' as const };
                if (col.key === 'group') { thProps.info = { tooltip: 'Indicates whether the alert affects the entire cluster or a specific namespace.', ariaLabel: 'More information about alert scope' }; }
                if (col.key === 'component') { thProps.info = { tooltip: 'The specific services, operators, or nodes affected by this alert.', ariaLabel: 'More information about affected component' }; }
                if (col.key === 'clusters') { thProps.info = { tooltip: 'The managed cluster where this alert instance is firing.', ariaLabel: 'More information about cluster' }; }
                if (col.key === 'namespace') { thProps.info = { tooltip: 'The Kubernetes namespace associated with this alert instance.', ariaLabel: 'More information about namespace' }; }
                if (col.key === 'resource') { thProps.info = { tooltip: 'The specific Kubernetes resource (e.g. node, pod) related to this alert.', ariaLabel: 'More information about resource' }; }
                if (canSort) {
                  thProps.sort = buildThSortParams({
                    columnKey,
                    visibleColKeys: indivVisibleKeys,
                    colIdx,
                    headerOffset: groupedIndivHeaderOffset,
                    sortConfigs,
                    handleSort,
                  });
                }
                return <Th {...thProps}>{col.label}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {groupedIndividualAlerts.map((group) => {
              const isGroupExpanded = expandedGroups.has(group.groupName);
              let leafCounter = 0;

              return (
                <React.Fragment key={group.groupName}>
                  {/* Level 0: Group row — column-aligned, sticky */}
                  <Tr
                    style={{
                      backgroundColor: LEVEL_0_BG,
                      cursor: 'pointer',
                      borderBottom: '2px solid var(--pf-t--global--border--color--default)',
                      position: 'sticky',
                      top: '37px',
                      zIndex: 97,
                    }}
                    onClick={() => toggleGroupExpanded(group.groupName)}
                  >
                    <Td style={{ width: '40px', padding: '8px 4px', paddingLeft: '8px' }}>
                      <Button variant="plain" aria-label="Toggle group" style={{ padding: '2px 4px' }}>
                        {isGroupExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                      </Button>
                    </Td>
                    <Td modifier="nowrap">
                      <strong style={{ fontSize: '14px' }}>
                        {prefix}: {group.groupName} ({group.alerts.length} alert{group.alerts.length !== 1 ? 's' : ''})
                      </strong>
                    </Td>
                    {indivVisibleCols.filter(c => c.key !== 'alertName').map(col => {
                      if (col.key === 'severity' && groupBy !== 'severity') {
                        const crit = group.alerts.filter(a => a.severity === 'Critical').length;
                        const warn = group.alerts.filter(a => a.severity === 'Warning').length;
                        const info = group.alerts.filter(a => a.severity === 'Info').length;
                        return (
                          <Td key={col.key} modifier="nowrap">
                            <Flex gap={{ default: 'gapSm' }}>
                              {crit > 0 && <Label color="red" icon={<ExclamationCircleIcon />} isCompact>{crit}</Label>}
                              {warn > 0 && <Label color="orange" icon={<ExclamationTriangleIcon />} isCompact>{warn}</Label>}
                              {info > 0 && <Label color="blue" icon={<InfoCircleIcon />} isCompact>{info}</Label>}
                            </Flex>
                          </Td>
                        );
                      }
                      return <Td key={col.key} modifier="nowrap" />;
                    })}
                  </Tr>

                  {/* Level 1 (leaf): Individual alert rows — indented 16px, zebra striped */}
                  {isGroupExpanded && group.alerts.map((alert, idx) => {
                    const currentLeafIdx = leafCounter++;
                    const zebraBg = currentLeafIdx % 2 === 1 ? ZEBRA_ODD : ZEBRA_EVEN;

                    const renderCellContent = (col: ColumnConfig) => {
                      switch (col.key) {
                        case 'alertName': {
                          const ackInfo = getAcknowledgeInfo(alert);
                          return (
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'nowrap' }}>
                              <Button variant="link" isInline onClick={() => onAlertClick(alert)}>{alert.alertName}</Button>
                              {ackInfo && (
                                <Tooltip content={`Acknowledged by ${ackInfo.by} at ${formatAckDate(ackInfo.at)}`}>
                                  <Icon size="sm" status="info"><InfoCircleIcon /></Icon>
                                </Tooltip>
                              )}
                            </Flex>
                          );
                        }
                        case 'severity':
                          return <Label color={getSeverityLabelColor(alert.severity)} icon={getSeverityIcon(alert.severity)} isCompact>{alert.severity}</Label>;
                        case 'clusters':
                          return <Button variant="link" isInline onClick={() => onClusterClick((alert as any).cluster)}>{alert.clusterName}</Button>;
                        case 'group':
                          return <Label isCompact>{alert.group}</Label>;
                        case 'component':
                          return <Label isCompact variant="outline">{alert.component}</Label>;
                        case 'state':
                          return <Label color={getStatusLabelColor(alert.status)} variant="outline" isCompact>{alert.status}</Label>;
                        case 'startTime':
                          return alert.lastFired;
                        case 'source':
                          return alert.source || '-';
                        case 'description':
                          return alert.description || '-';
                        case 'runbookUrl':
                          return alert.runbookUrl
                            ? <Button variant="link" isInline component="a" href={alert.runbookUrl} target="_blank" onClick={(e: React.MouseEvent) => e.stopPropagation()} icon={<ExternalLinkAltIcon />} iconPosition="end">View runbook</Button>
                            : '-';
                        case 'namespace':
                          return alert.namespace || '-';
                        case 'resource':
                          return alert.resource || '-';
                        default:
                          return '-';
                      }
                    };

                    return (
                      <Tr key={`${alert.id}-${idx}`} style={{ backgroundColor: zebraBg }}>
                        <Td style={{ paddingLeft: `${LEVEL_INDENT_1 + 8}px`, width: '40px', padding: '8px 4px' }} />
                        {indivVisibleCols.map(col => (
                          <Td key={col.key} modifier="nowrap">{renderCellContent(col)}</Td>
                        ))}
                      </Tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </InnerScrollContainer>
    );
  }

  // ========== FLAT INDIVIDUAL (no grouping) ==========
  const flatVisibleCols = getVisibleColumns().filter(col => col.key !== 'total');
  const flatVisibleKeys = flatVisibleCols.map((c) => c.key);
  const flatHeaderOffset = 0;
  return (
    <InnerScrollContainer>
      <Table aria-label="All alerts table" variant="compact">
        <Thead style={{ position: 'sticky', top: 0, zIndex: 98, backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
          <Tr>
            {flatVisibleCols.map((col, colIdx) => {
              const columnKey = col.key as SortConfig['column'];
              const canSort = ['alertName', 'severity', 'clusters', 'group', 'component', 'startTime'].includes(col.key);
              const thProps: any = { key: col.key, modifier: 'nowrap' as const };
              if (col.key === 'alertName') { thProps.isStickyColumn = true; thProps.stickyMinWidth = '200px'; thProps.stickyLeftOffset = '0px'; }
              if (col.key === 'severity') { thProps.isStickyColumn = true; thProps.stickyMinWidth = '120px'; thProps.stickyLeftOffset = '200px'; }
              if (col.key === 'severity') { thProps.info = { tooltip: 'The impact level of the alert, categorized as Critical, Warning, or Info.', ariaLabel: 'More information about severity' }; }
              if (col.key === 'total') { thProps.info = { tooltip: 'The cumulative number of individual alert instances. In aggregated views, this represents the sum of all occurrences across your fleet.', ariaLabel: 'More information about total count' }; }
              if (col.key === 'group') { thProps.info = { tooltip: 'Indicates whether the alert affects the entire cluster or a specific namespace.', ariaLabel: 'More information about alert scope' }; }
              if (col.key === 'component') { thProps.info = { tooltip: 'The specific services, operators, or nodes affected by this alert.', ariaLabel: 'More information about affected component' }; }
              if (col.key === 'source') { thProps.info = { tooltip: 'Defines how the alert rule is managed. Platform alerts are default rules managed in the openshift-monitoring namespace as AlertingRules. User alerts are custom PrometheusRules created by users to monitor specific workloads.', ariaLabel: 'More information about source' }; }
              if (col.key === 'clusters') { thProps.info = { tooltip: 'The managed cluster where this alert instance is firing.', ariaLabel: 'More information about cluster' }; }
              if (col.key === 'namespace') { thProps.info = { tooltip: 'The Kubernetes namespace associated with this alert instance.', ariaLabel: 'More information about namespace' }; }
              if (col.key === 'resource') { thProps.info = { tooltip: 'The specific Kubernetes resource (e.g. node, pod) related to this alert.', ariaLabel: 'More information about resource' }; }
              if (canSort) {
                thProps.sort = buildThSortParams({
                  columnKey,
                  visibleColKeys: flatVisibleKeys,
                  colIdx,
                  headerOffset: flatHeaderOffset,
                  sortConfigs,
                  handleSort,
                });
              }
              return <Th {...thProps}>{col.label}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {paginatedAlerts.map((alert, idx) => {
            const renderCellContent = (col: ColumnConfig) => {
              switch (col.key) {
                case 'alertName': {
                  const ackInfo = getAcknowledgeInfo(alert);
                  return (
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'nowrap' }}>
                      <Button variant="link" isInline onClick={() => onAlertClick(alert)}>{alert.alertName}</Button>
                      {ackInfo && (
                        <Tooltip content={`Acknowledged by ${ackInfo.by} at ${formatAckDate(ackInfo.at)}`}>
                          <Icon size="sm" status="info"><InfoCircleIcon /></Icon>
                        </Tooltip>
                      )}
                    </Flex>
                  );
                }
                case 'severity':
                  return <Label color={getSeverityLabelColor(alert.severity)} icon={getSeverityIcon(alert.severity)} isCompact>{alert.severity}</Label>;
                case 'clusters':
                  return <Button variant="link" isInline onClick={() => onClusterClick((alert as any).cluster)}>{alert.clusterName}</Button>;
                case 'group':
                  return <Label isCompact>{alert.group}</Label>;
                case 'component':
                  return <Label isCompact variant="outline">{alert.component}</Label>;
                case 'state':
                  return <Label color={getStatusLabelColor(alert.status)} variant="outline" isCompact>{alert.status}</Label>;
                case 'startTime':
                  return alert.lastFired;
                case 'source':
                  return alert.source || '-';
                case 'description':
                  return alert.description || '-';
                case 'runbookUrl':
                  return alert.runbookUrl
                    ? <Button variant="link" isInline component="a" href={alert.runbookUrl} target="_blank" onClick={(e: React.MouseEvent) => e.stopPropagation()} icon={<ExternalLinkAltIcon />} iconPosition="end">View runbook</Button>
                    : '-';
                case 'namespace':
                  return alert.namespace || '-';
                case 'resource':
                  return alert.resource || '-';
                default:
                  return '-';
              }
            };

            return (
              <Tr key={`${alert.id}-${idx}`}>
                {flatVisibleCols.map(col => {
                  const tdProps: any = { key: col.key, modifier: 'nowrap' as const };
                  if (col.key === 'alertName') { tdProps.isStickyColumn = true; tdProps.stickyMinWidth = '200px'; tdProps.stickyLeftOffset = '0px'; }
                  if (col.key === 'severity') { tdProps.isStickyColumn = true; tdProps.stickyMinWidth = '120px'; tdProps.stickyLeftOffset = '200px'; }
                  return <Td {...tdProps}>{renderCellContent(col)}</Td>;
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </InnerScrollContainer>
  );
};

export { AlertsTableContent };
