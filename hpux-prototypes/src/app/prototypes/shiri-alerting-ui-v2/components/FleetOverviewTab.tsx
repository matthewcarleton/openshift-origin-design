import * as React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Title,
  CardHeader,
  CardFooter,
  Flex,
  FlexItem,
  Icon,
  Stack,
  StackItem,
  Grid,
  GridItem,
  Content,
  Divider,
  Button,
  Label,
  Badge,
  ToggleGroup,
  ToggleGroupItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  Tooltip,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ThLargeIcon,
  ListIcon,
  EditAltIcon,
  CubesIcon,
  CubeIcon,
  CheckIcon,
  ClockIcon,
  SyncIcon,
  PauseCircleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import type {
  AlertSeverity,
  ACMClusterStatus,
  AlertGroup,
  AlertComponent,
  GroupByOption,
  SortByOption,
  ViewMode,
  ImportanceSizing,
  ClusterData,
  EnvironmentCategory,
  TeamCategory,
  SavedFilter,
} from '../data/types';
import { getClusterAlertStatus } from '../data/utils';
import { FilterPanel } from './FilterPanel';
import { TreemapHeatmap } from './TreemapHeatmap';
import { AlertsTimelineCard } from './AlertsTimelineCard';
import { CrossClusterInsightsCards } from './CrossClusterInsightsCards';
import { mockTrendData, mockClusters } from '../data/mockData';

export interface FleetOverviewTabProps {
  // Filter panel
  isFilterPanelOpen: boolean;
  setIsFilterPanelOpen: (v: boolean) => void;
  regionFilter: string[];
  setRegionFilter: (v: string[]) => void;
  clusterFilter: string[];
  setClusterFilter: (v: string[]) => void;
  namespaceFilter: string[];
  setNamespaceFilter: (v: string[]) => void;
  labelFilter: string[];
  setLabelFilter: (v: string[]) => void;
  severityFilter: AlertSeverity[];
  setSeverityFilter: (v: AlertSeverity[]) => void;
  groupFilter: AlertGroup[];
  setGroupFilter: (v: AlertGroup[]) => void;
  componentFilter: AlertComponent[];
  setComponentFilter: (v: AlertComponent[]) => void;
  regions: string[];
  clusterNames: string[];
  namespaces: string[];
  availableLabels: string[];
  regionCounts: Record<string, number>;
  clusterCounts: Record<string, number>;
  namespaceCounts: Record<string, number>;
  savedFilters: SavedFilter[];
  setSavedFilters: (v: SavedFilter[] | ((prev: SavedFilter[]) => SavedFilter[])) => void;
  searchValue: string;

  // Cluster card view
  clusterCardRef: React.RefObject<HTMLDivElement | null>;
  clusterCardView: 'all-clusters' | 'single-cluster-components';
  setClusterCardView: (v: 'all-clusters' | 'single-cluster-components') => void;
  selectedClusterInCard: ClusterData | null;
  setSelectedClusterInCard: (v: ClusterData | null) => void;

  // View mode and layout
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  sortBy: SortByOption;
  setSortBy: (v: SortByOption) => void;
  groupBy: GroupByOption;
  setGroupBy: (v: GroupByOption) => void;
  importanceSizing: ImportanceSizing;
  setImportanceSizing: (v: ImportanceSizing) => void;
  sizeByOptions: { value: string; label: string }[];
  isSortByOpen: boolean;
  setIsSortByOpen: (v: boolean) => void;
  isGroupByOpen: boolean;
  setIsGroupByOpen: (v: boolean) => void;
  isSizeByOpen: boolean;
  setIsSizeByOpen: (v: boolean) => void;

  // Environment/Team settings
  environmentCategories: EnvironmentCategory[];
  teamCategories: TeamCategory[];
  setTempTeamCategories: (v: TeamCategory[]) => void;
  setNewTeamPatternInputs: (v: Record<string, string>) => void;
  setIsTeamSettingsOpen: (v: boolean) => void;
  setTempEnvironmentCategories: (v: EnvironmentCategory[]) => void;
  setNewPatternInputs: (v: Record<string, string>) => void;
  setIsEnvironmentSettingsOpen: (v: boolean) => void;

  // Treemap legend
  treemapLegendFilters: ('Critical' | 'Warning' | 'Info' | 'Healthy')[];
  setTreemapLegendFilters: (v: React.SetStateAction<('Critical' | 'Warning' | 'Info' | 'Healthy')[]>) => void;

  // Table sorting
  activeSortIndex: number | null;
  setActiveSortIndex: (v: number | null) => void;
  activeSortDirection: 'asc' | 'desc';
  setActiveSortDirection: (v: 'asc' | 'desc') => void;

  // Pagination
  page: number;
  setPage: (v: number) => void;
  perPage: number;
  setPerPage: (v: number) => void;

  // Data
  filteredClusters: ClusterData[];
  sortedClusters: ClusterData[];
  clustersForDisplay: ClusterData[];
  totalAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
  infoAlerts: number;
  healthyClusters: number;

  // Handlers
  handleBackToAllClusters: () => void;
  handleDrillDown: (cluster: ClusterData) => void;
  handleComponentClickInCard: (cluster: ClusterData, component: AlertComponent) => void;

  // CrossClusterInsightsCards callbacks
  onAlertRuleClick: (alertName: string) => void;
  onComponentClick: (componentName: string) => void;
  onClusterClick?: (clusterName: string) => void;
  onViewAllFiringAlerts?: () => void;
  onViewAllClusters?: () => void;
  onViewContributingAlerts?: (alertNames: string[]) => void;
  triggeredFromDate?: string;
  triggeredFromTime?: string;
  triggeredToDate?: string;
  triggeredToTime?: string;
  timeFilteredClusters?: ClusterData[];
}

export const FleetOverviewTab: React.FunctionComponent<FleetOverviewTabProps> = (props) => {
  const {
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    regionFilter,
    setRegionFilter,
    clusterFilter,
    setClusterFilter,
    namespaceFilter,
    setNamespaceFilter,
    labelFilter,
    setLabelFilter,
    severityFilter,
    setSeverityFilter,
    groupFilter,
    setGroupFilter,
    componentFilter,
    setComponentFilter,
    regions,
    clusterNames,
    namespaces,
    availableLabels,
    regionCounts,
    clusterCounts,
    namespaceCounts,
    savedFilters,
    setSavedFilters,
    searchValue,
    clusterCardRef,
    clusterCardView,
    setClusterCardView,
    selectedClusterInCard,
    setSelectedClusterInCard,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    groupBy,
    setGroupBy,
    importanceSizing,
    setImportanceSizing,
    sizeByOptions,
    isSortByOpen,
    setIsSortByOpen,
    isGroupByOpen,
    setIsGroupByOpen,
    isSizeByOpen,
    setIsSizeByOpen,
    environmentCategories,
    teamCategories,
    setTempTeamCategories,
    setNewTeamPatternInputs,
    setIsTeamSettingsOpen,
    setTempEnvironmentCategories,
    setNewPatternInputs,
    setIsEnvironmentSettingsOpen,
    treemapLegendFilters,
    setTreemapLegendFilters,
    activeSortIndex,
    setActiveSortIndex,
    activeSortDirection,
    setActiveSortDirection,
    page,
    setPage,
    perPage,
    setPerPage,
    filteredClusters,
    sortedClusters,
    clustersForDisplay,
    totalAlerts,
    criticalAlerts,
    warningAlerts,
    infoAlerts,
    healthyClusters,
    handleBackToAllClusters,
    handleDrillDown,
    handleComponentClickInCard,
    onAlertRuleClick,
    onComponentClick,
    onClusterClick,
    onViewAllFiringAlerts,
    onViewAllClusters,
    onViewContributingAlerts,
    triggeredFromDate,
    triggeredFromTime,
    triggeredToDate,
    triggeredToTime,
    timeFilteredClusters,
  } = props;

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
      {/* Filter Side Panel - Sticky */}
      {isFilterPanelOpen && (
        <div style={{
          width: window.innerWidth < 1080 ? '320px' : '280px',
          minWidth: window.innerWidth < 1080 ? '320px' : '280px',
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '4px',
          borderRight: '1px solid var(--pf-t--global--border--color--default, #d2d2d2)',
        }}>
          <FilterPanel
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            clusterFilter={clusterFilter}
            setClusterFilter={setClusterFilter}
            namespaceFilter={namespaceFilter}
            setNamespaceFilter={setNamespaceFilter}
            labelFilter={labelFilter}
            setLabelFilter={setLabelFilter}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            groupFilter={groupFilter}
            setGroupFilter={setGroupFilter}
            componentFilter={componentFilter}
            setComponentFilter={setComponentFilter}
            regions={regions}
            clusterNames={clusterNames}
            clusters={mockClusters}
            namespaces={namespaces}
            availableLabels={availableLabels}
            regionCounts={regionCounts}
            clusterCounts={clusterCounts}
            namespaceCounts={namespaceCounts}
            onClose={() => setIsFilterPanelOpen(false)}
            savedFilters={savedFilters}
            onApplySavedFilter={(filter) => {
              setSeverityFilter(filter.filters.severity);
              setGroupFilter(filter.filters.group);
              setComponentFilter(filter.filters.component);
            }}
            onSaveFilter={(name) => {
              const newFilter: SavedFilter = {
                id: `sf-${Date.now()}`,
                name,
                filters: { severity: severityFilter, group: groupFilter, component: componentFilter, source: [], searchValue },
              };
              setSavedFilters([...savedFilters, newFilter]);
            }}
            onDeleteSavedFilter={(id) => setSavedFilters(savedFilters.filter(f => f.id !== id))}
            filterContext="fleet"
          />
        </div>
      )}

      {/* Main Content Area - Scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        <Stack hasGutter style={{ gap: '16px' }}>
          {/* Cluster Overview Card */}
          <StackItem>
            <div ref={clusterCardRef}>
              <Card>
                <CardHeader>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      {clusterCardView === 'all-clusters' ? (
                        <Flex gap={{ default: 'gapXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <CardTitle data-testid="fleet-alerts-card-title">Fleet alerts</CardTitle>
                          <Tooltip content="Overview of all clusters in your fleet. Each tile represents an individual cluster.">
                            <Button
                              variant="plain"
                              aria-label="More information about Fleet alerts"
                              icon={<InfoCircleIcon />}
                              data-testid="fleet-alerts-header-info"
                            />
                          </Tooltip>
                        </Flex>
                      ) : (
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                          <FlexItem>
                            <Button
                              variant="link"
                              isInline
                              onClick={handleBackToAllClusters}
                              icon={<ArrowLeftIcon />}
                            >
                              All clusters
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <CardTitle>{selectedClusterInCard?.name} - Component&apos;s health</CardTitle>
                          </FlexItem>
                        </Flex>
                      )}
                    </FlexItem>
                    {clusterCardView === 'all-clusters' && (
                      <FlexItem>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: '13px' }}>Clusters</span>
                          <strong>{filteredClusters.length}</strong>
                          <Tooltip content={`${filteredClusters.filter(c => c.alerts.some(a => a.severity === 'Critical' && a.status === 'firing')).length} critical clusters`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => { if (!severityFilter.includes('Critical')) { setSeverityFilter([...severityFilter, 'Critical']); } }}>
                              <Icon status="danger"><ExclamationCircleIcon /></Icon>
                              <strong style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>{filteredClusters.filter(c => c.alerts.some(a => a.severity === 'Critical' && a.status === 'firing')).length}</strong>
                              <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: '12px' }}>critical clusters</span>
                            </div>
                          </Tooltip>
                          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--pf-t--global--border--color--default)' }} />
                          <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: '13px' }}>Firing alerts</span>
                          <strong>{totalAlerts}</strong>
                          <Tooltip content={`Critical: ${criticalAlerts}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => { if (!severityFilter.includes('Critical')) { setSeverityFilter([...severityFilter, 'Critical']); } }}>
                              <Icon status="danger"><ExclamationCircleIcon /></Icon>
                              <strong style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>{criticalAlerts}</strong>
                            </div>
                          </Tooltip>
                          <Tooltip content={`Warning: ${warningAlerts}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => { if (!severityFilter.includes('Warning')) { setSeverityFilter([...severityFilter, 'Warning']); } }}>
                              <Icon status="warning"><ExclamationTriangleIcon /></Icon>
                              <strong style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}>{warningAlerts}</strong>
                            </div>
                          </Tooltip>
                          <Tooltip content={`Info: ${infoAlerts}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => { if (!severityFilter.includes('Info')) { setSeverityFilter([...severityFilter, 'Info']); } }}>
                              <Icon status="info"><InfoCircleIcon /></Icon>
                              <strong style={{ color: 'var(--pf-t--global--color--status--info--default)' }}>{infoAlerts}</strong>
                            </div>
                          </Tooltip>
                          <Tooltip content={`Healthy: ${healthyClusters} - Click to filter`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => { setSeverityFilter([]); setGroupBy('severity'); }}>
                              <Icon status="success"><CheckCircleIcon /></Icon>
                              <strong style={{ color: 'var(--pf-t--global--color--status--success--default)' }}>{healthyClusters}</strong>
                            </div>
                          </Tooltip>
                        </div>
                      </FlexItem>
                    )}
                  </Flex>
                </CardHeader>
                <Divider />
                {/* Layout settings toolbar - under divider */}
                {clusterCardView === 'all-clusters' && (
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                      <FlexItem>
                        <ToggleGroup isCompact>
                          <ToggleGroupItem
                            icon={<ThLargeIcon />}
                            text="Treemap"
                            aria-label="Treemap view"
                            isSelected={viewMode === 'treemap'}
                            onChange={() => setViewMode('treemap')}
                          />
                          <ToggleGroupItem
                            icon={<ListIcon />}
                            text="Table"
                            aria-label="Table view"
                            isSelected={viewMode === 'summary'}
                            onChange={() => setViewMode('summary')}
                          />
                        </ToggleGroup>
                      </FlexItem>
                      <FlexItem>
                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{viewMode === 'treemap' ? 'Treemap layout' : 'Table layout'}</span>
                      </FlexItem>
                      <FlexItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                          <span style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)' }}>Sort by</span>
                          <Dropdown
                            isOpen={isSortByOpen}
                            onOpenChange={setIsSortByOpen}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                variant="plainText"
                                onClick={() => setIsSortByOpen(!isSortByOpen)}
                                isExpanded={isSortByOpen}
                                style={{ padding: '4px 8px' }}
                              >
                                {sortBy === 'severity' ? 'Severity (high-low)' : sortBy === 'alertCount' ? 'Alert count' : 'Cluster name'}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              {[
                                { value: 'severity' as const, label: 'Severity (high-low)' },
                                { value: 'alertCount' as const, label: 'Alert count' },
                                { value: 'clusterName' as const, label: 'Cluster name' },
                              ].map(opt => (
                                <DropdownItem key={opt.value} onClick={() => { setSortBy(opt.value); setIsSortByOpen(false); }}>
                                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                    <FlexItem>{opt.label}</FlexItem>
                                    {sortBy === opt.value && (
                                      <FlexItem><CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} /></FlexItem>
                                    )}
                                  </Flex>
                                </DropdownItem>
                              ))}
                            </DropdownList>
                          </Dropdown>
                        </Flex>
                      </FlexItem>
                      <FlexItem>
                        <Tooltip content="Only available for Treemap view" trigger={viewMode === 'summary' ? 'mouseenter' : 'manual'}>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                            <span style={{ fontSize: '13px', color: viewMode === 'summary' ? 'var(--pf-t--global--text--color--disabled)' : 'var(--pf-t--global--text--color--subtle)' }}>Group clusters by</span>
                            <Dropdown
                              isOpen={isGroupByOpen}
                              onOpenChange={setIsGroupByOpen}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  variant="plainText"
                                  onClick={() => viewMode !== 'summary' && setIsGroupByOpen(!isGroupByOpen)}
                                  isExpanded={isGroupByOpen}
                                  isDisabled={viewMode === 'summary'}
                                  style={{ padding: '4px 8px' }}
                                >
                                  {groupBy === 'none' ? 'None' : groupBy === 'cloudProvider' ? 'Provider' : groupBy === 'environment' ? 'Environment' : groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                {[
                                  { value: 'none' as const, label: 'None' },
                                  { value: 'region' as const, label: 'Region' },
                                  { value: 'cloudProvider' as const, label: 'Cloud provider' },
                                  { value: 'severity' as const, label: 'Severity' },
                                ].map(opt => (
                                  <DropdownItem key={opt.value} onClick={() => { setGroupBy(opt.value); setIsGroupByOpen(false); }}>
                                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                      <FlexItem>{opt.label}</FlexItem>
                                      {groupBy === opt.value && (
                                        <FlexItem><CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} /></FlexItem>
                                      )}
                                    </Flex>
                                  </DropdownItem>
                                ))}
                                <DropdownItem onClick={() => { setGroupBy('team'); setIsGroupByOpen(false); }}>
                                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                    <FlexItem>Team</FlexItem>
                                    <FlexItem style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      {groupBy === 'team' && <CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} />}
                                      <Button
                                        variant="plain"
                                        size="sm"
                                        icon={<EditAltIcon />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTempTeamCategories([...teamCategories]);
                                          setNewTeamPatternInputs({});
                                          setIsTeamSettingsOpen(true);
                                          setIsGroupByOpen(false);
                                        }}
                                        aria-label="Configure team settings"
                                      />
                                    </FlexItem>
                                  </Flex>
                                </DropdownItem>
                                <DropdownItem onClick={() => { setGroupBy('environment'); setIsGroupByOpen(false); }}>
                                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                    <FlexItem>Environment</FlexItem>
                                    <FlexItem style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      {groupBy === 'environment' && <CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} />}
                                      <Button
                                        variant="plain"
                                        size="sm"
                                        icon={<EditAltIcon />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTempEnvironmentCategories([...environmentCategories]);
                                          setNewPatternInputs({});
                                          setIsEnvironmentSettingsOpen(true);
                                          setIsGroupByOpen(false);
                                        }}
                                        aria-label="Configure environment settings"
                                      />
                                    </FlexItem>
                                  </Flex>
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </Flex>
                        </Tooltip>
                      </FlexItem>
                      <FlexItem>
                        <Tooltip content="Only available for Treemap view" trigger={viewMode === 'summary' ? 'mouseenter' : 'manual'}>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                            <span style={{ fontSize: '13px', color: viewMode === 'summary' ? 'var(--pf-t--global--text--color--disabled)' : 'var(--pf-t--global--text--color--subtle)' }}>Box sizing</span>
                            <Dropdown
                              isOpen={isSizeByOpen}
                              onOpenChange={setIsSizeByOpen}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  variant="plainText"
                                  onClick={() => viewMode !== 'summary' && setIsSizeByOpen(!isSizeByOpen)}
                                  isExpanded={isSizeByOpen}
                                  isDisabled={viewMode === 'summary'}
                                  style={{ padding: '4px 8px' }}
                                >
                                  {sizeByOptions.find(o => o.value === importanceSizing)?.label || 'None (equal size)'}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                {sizeByOptions.map(opt => (
                                  <DropdownItem key={opt.value} onClick={() => { setImportanceSizing(opt.value as ImportanceSizing); setIsSizeByOpen(false); }}>
                                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                      <FlexItem>{opt.label}</FlexItem>
                                      {importanceSizing === opt.value && (
                                        <FlexItem><CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} /></FlexItem>
                                      )}
                                    </Flex>
                                  </DropdownItem>
                                ))}
                              </DropdownList>
                            </Dropdown>
                          </Flex>
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  </div>
                )}
                <CardBody>
                  {clusterCardView === 'single-cluster-components' && selectedClusterInCard ? (
                    /* Single Cluster Components View */
                    <div>
                      {/* Cluster Details Summary */}
                      {(() => {
                        const firingAlerts = selectedClusterInCard.alerts.filter(a => a.status === 'firing');
                        const criticalCount = firingAlerts.filter(a => a.severity === 'Critical').length;
                        const warningCount = firingAlerts.filter(a => a.severity === 'Warning').length;
                        const infoCount = firingAlerts.filter(a => a.severity === 'Info').length;
                        const healthStatus = criticalCount > 0 ? 'Critical' : warningCount > 0 ? 'Warning' : 'Healthy';
                        const healthColor = criticalCount > 0 ? 'red' : warningCount > 0 ? 'orange' : 'green';
                        const healthIcon = criticalCount > 0 ? <ExclamationCircleIcon /> : warningCount > 0 ? <ExclamationTriangleIcon /> : <CheckCircleIcon />;

                        // ACM Status config
                        const acmStatusConfig: Record<ACMClusterStatus, { color: 'green' | 'red' | 'orange' | 'blue' | 'grey'; icon: React.ReactNode }> = {
                          'Ready': { color: 'green', icon: <CheckCircleIcon /> },
                          'Offline': { color: 'red', icon: <ExclamationCircleIcon /> },
                          'Failed': { color: 'red', icon: <ExclamationCircleIcon /> },
                          'Pending Import': { color: 'blue', icon: <ClockIcon /> },
                          'Installing': { color: 'blue', icon: <SyncIcon /> },
                          'Degraded': { color: 'orange', icon: <ExclamationTriangleIcon /> },
                          'Hibernating': { color: 'grey', icon: <PauseCircleIcon /> },
                          'Unknown': { color: 'grey', icon: <QuestionCircleIcon /> },
                          'Detaching': { color: 'orange', icon: <SyncIcon /> },
                        };
                        const statusConfig = acmStatusConfig[selectedClusterInCard.acmStatus] || acmStatusConfig['Unknown'];

                        return (
                          <div style={{
                            backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                          }}>
                            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                              <FlexItem>
                                <Stack hasGutter>
                                  <StackItem>
                                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                                      <FlexItem>
                                        <Title headingLevel="h3">{selectedClusterInCard.name}</Title>
                                      </FlexItem>
                                      <FlexItem>
                                        <Label color={statusConfig.color} icon={statusConfig.icon} isCompact>
                                          {selectedClusterInCard.acmStatus}
                                        </Label>
                                      </FlexItem>
                                    </Flex>
                                  </StackItem>
                                  <StackItem>
                                    <Flex gap={{ default: 'gapLg' }}>
                                      <FlexItem>
                                        <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                                          Region: <strong>{selectedClusterInCard.region}</strong>
                                        </Content>
                                      </FlexItem>
                                      <FlexItem>
                                        <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                                          Nodes: <strong>{selectedClusterInCard.nodeCount}</strong>
                                        </Content>
                                      </FlexItem>
                                      <FlexItem>
                                        <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                                          Pods: <strong>{selectedClusterInCard.podCount || Math.floor(Math.random() * 500) + 100}</strong>
                                        </Content>
                                      </FlexItem>
                                    </Flex>
                                  </StackItem>
                                </Stack>
                              </FlexItem>
                              <FlexItem>
                                <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsFlexEnd' }} gap={{ default: 'gapSm' }}>
                                  <FlexItem>
                                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                      <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Health:</Content>
                                      <Label color={healthColor} icon={healthIcon}>{healthStatus}</Label>
                                    </Flex>
                                  </FlexItem>
                                  <FlexItem>
                                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                      <Badge>{firingAlerts.length} alerts</Badge>
                                      {criticalCount > 0 && <Label color="red" isCompact icon={<ExclamationCircleIcon />}>{criticalCount}</Label>}
                                      {warningCount > 0 && <Label color="orange" isCompact icon={<ExclamationTriangleIcon />}>{warningCount}</Label>}
                                      {infoCount > 0 && <Label color="blue" isCompact icon={<InfoCircleIcon />}>{infoCount}</Label>}
                                      {firingAlerts.length === 0 && <Label color="green" isCompact icon={<CheckCircleIcon />}>Healthy</Label>}
                                    </Flex>
                                  </FlexItem>
                                </Flex>
                              </FlexItem>
                            </Flex>
                          </div>
                        );
                      })()}

                      {/* Alert Scopes - Cluster and Namespace */}
                      <Grid hasGutter>
                        {/* Cluster Components */}
                        <GridItem span={6}>
                          <Card isCompact>
                            <CardHeader>
                              <CardTitle>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <FlexItem><Icon status="info"><CubesIcon /></Icon></FlexItem>
                                  <FlexItem>
                                    <span>Alert scope: Cluster</span>
                                  </FlexItem>
                                </Flex>
                              </CardTitle>
                            </CardHeader>
                            <CardBody>
                              <Content component="small" style={{ marginBottom: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                Alerts related to the health and stability of the cluster's control plane, including API server, etcd, and scheduler.
                              </Content>
                              <Stack hasGutter>
                                {(() => {
                                  const clusterAlerts = selectedClusterInCard.alerts.filter(
                                    a => a.status === 'firing' && a.group === 'Cluster'
                                  );
                                  const componentStats: Record<string, { count: number; critical: number; warning: number; info: number }> = {};
                                  clusterAlerts.forEach(alert => {
                                    if (!componentStats[alert.component]) {
                                      componentStats[alert.component] = { count: 0, critical: 0, warning: 0, info: 0 };
                                    }
                                    componentStats[alert.component].count++;
                                    if (alert.severity === 'Critical') componentStats[alert.component].critical++;
                                    else if (alert.severity === 'Warning') componentStats[alert.component].warning++;
                                    else componentStats[alert.component].info++;
                                  });

                                  const components = Object.entries(componentStats).sort((a, b) => {
                                    if (a[1].critical !== b[1].critical) return b[1].critical - a[1].critical;
                                    if (a[1].warning !== b[1].warning) return b[1].warning - a[1].warning;
                                    if (a[1].info !== b[1].info) return b[1].info - a[1].info;
                                    return b[1].count - a[1].count;
                                  });

                                  if (components.length === 0) {
                                    return (
                                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                        <Icon status="success"><CheckCircleIcon /></Icon>
                                        <span>No cluster component alerts</span>
                                      </Flex>
                                    );
                                  }

                                  return components.map(([component, stats]) => {
                                    const criticalCount = stats.critical;
                                    const warningCount = stats.warning;
                                    const healthIcon = criticalCount > 0 ? <ExclamationCircleIcon /> : warningCount > 0 ? <ExclamationTriangleIcon /> : <InfoCircleIcon />;

                                    return (
                                      <Button
                                        key={component}
                                        variant="link"
                                        isBlock
                                        style={{ textAlign: 'left', padding: '8px 12px', border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '4px' }}
                                        onClick={() => handleComponentClickInCard(selectedClusterInCard, component as AlertComponent)}
                                      >
                                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                          <FlexItem>
                                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                              <Icon status={criticalCount > 0 ? 'danger' : warningCount > 0 ? 'warning' : 'info'}>{healthIcon}</Icon>
                                              <span>{component}</span>
                                            </Flex>
                                          </FlexItem>
                                          <FlexItem>
                                            <Flex gap={{ default: 'gapSm' }}>
                                              {criticalCount > 0 && <Label color="red" isCompact>{criticalCount} Critical</Label>}
                                              {warningCount > 0 && <Label color="orange" isCompact>{warningCount} Warning</Label>}
                                            </Flex>
                                          </FlexItem>
                                        </Flex>
                                      </Button>
                                    );
                                  });
                                })()}
                              </Stack>
                            </CardBody>
                          </Card>
                        </GridItem>

                        {/* Namespace Components */}
                        <GridItem span={6}>
                          <Card isCompact>
                            <CardHeader>
                              <CardTitle>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <FlexItem><Icon status="info"><CubeIcon /></Icon></FlexItem>
                                  <FlexItem>
                                    <span>Alert scope: Namespace</span>
                                  </FlexItem>
                                </Flex>
                              </CardTitle>
                            </CardHeader>
                            <CardBody>
                              <Content component="small" style={{ marginBottom: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                Alerts focused on user applications and services, reporting on pod crashes, replica mismatches, and resource quota violations.
                              </Content>
                              <Stack hasGutter>
                                {(() => {
                                  const namespaceAlerts = selectedClusterInCard.alerts.filter(
                                    a => a.status === 'firing' && a.group === 'Namespace'
                                  );
                                  const componentStats: Record<string, { count: number; critical: number; warning: number; info: number }> = {};
                                  namespaceAlerts.forEach(alert => {
                                    if (!componentStats[alert.component]) {
                                      componentStats[alert.component] = { count: 0, critical: 0, warning: 0, info: 0 };
                                    }
                                    componentStats[alert.component].count++;
                                    if (alert.severity === 'Critical') componentStats[alert.component].critical++;
                                    else if (alert.severity === 'Warning') componentStats[alert.component].warning++;
                                    else componentStats[alert.component].info++;
                                  });

                                  const components = Object.entries(componentStats).sort((a, b) => {
                                    if (a[1].critical !== b[1].critical) return b[1].critical - a[1].critical;
                                    if (a[1].warning !== b[1].warning) return b[1].warning - a[1].warning;
                                    if (a[1].info !== b[1].info) return b[1].info - a[1].info;
                                    return b[1].count - a[1].count;
                                  });

                                  if (components.length === 0) {
                                    return (
                                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                        <Icon status="success"><CheckCircleIcon /></Icon>
                                        <span>No namespace component alerts</span>
                                      </Flex>
                                    );
                                  }

                                  return components.map(([component, stats]) => {
                                    const criticalCount = stats.critical;
                                    const warningCount = stats.warning;
                                    const healthIcon = criticalCount > 0 ? <ExclamationCircleIcon /> : warningCount > 0 ? <ExclamationTriangleIcon /> : <InfoCircleIcon />;

                                    return (
                                      <Button
                                        key={component}
                                        variant="link"
                                        isBlock
                                        style={{ textAlign: 'left', padding: '8px 12px', border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '4px' }}
                                        onClick={() => handleComponentClickInCard(selectedClusterInCard, component as AlertComponent)}
                                      >
                                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                          <FlexItem>
                                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                              <Icon status={criticalCount > 0 ? 'danger' : warningCount > 0 ? 'warning' : 'info'}>{healthIcon}</Icon>
                                              <span>{component}</span>
                                            </Flex>
                                          </FlexItem>
                                          <FlexItem>
                                            <Flex gap={{ default: 'gapSm' }}>
                                              {criticalCount > 0 && <Label color="red" isCompact>{criticalCount} Critical</Label>}
                                              {warningCount > 0 && <Label color="orange" isCompact>{warningCount} Warning</Label>}
                                            </Flex>
                                          </FlexItem>
                                        </Flex>
                                      </Button>
                                    );
                                  });
                                })()}
                              </Stack>
                            </CardBody>
                          </Card>
                        </GridItem>
                      </Grid>
                    </div>
                  ) : viewMode === 'treemap' ? (
                    <TreemapHeatmap
                      key={`treemap-${importanceSizing}-${groupBy}-${sortBy}-${sortedClusters.length}-${clusterFilter.join(',')}`}
                      clusters={sortedClusters}
                      groupBy={groupBy}
                      importanceSizing={importanceSizing}
                      severityFilter={severityFilter}
                      onDrillDown={handleDrillDown}
                      activeLegendFilters={treemapLegendFilters}
                      environmentCategories={environmentCategories}
                      teamCategories={teamCategories}
                      onLegendClick={(status) => {
                        setTreemapLegendFilters(prev => {
                          if (prev.includes(status)) {
                            const newFilters = prev.filter(s => s !== status);
                            return newFilters;
                          } else {
                            return [...prev, status];
                          }
                        });
                      }}
                    />
                  ) : (
                    /* Table View */
                    <Table aria-label="Clusters table">
                      <Thead>
                        <Tr>
                          <Th
                            sort={{
                              sortBy: { index: activeSortIndex || 0, direction: activeSortDirection },
                              onSort: (_event, index, direction) => {
                                setActiveSortIndex(index);
                                setActiveSortDirection(direction);
                              },
                              columnIndex: 0
                            }}
                          >
                            Status
                          </Th>
                          <Th
                            sort={{
                              sortBy: { index: activeSortIndex || 0, direction: activeSortDirection },
                              onSort: (_event, index, direction) => {
                                setActiveSortIndex(index);
                                setActiveSortDirection(direction);
                              },
                              columnIndex: 1
                            }}
                          >
                            Cluster
                          </Th>
                          <Th
                            sort={{
                              sortBy: { index: activeSortIndex || 0, direction: activeSortDirection },
                              onSort: (_event, index, direction) => {
                                setActiveSortIndex(index);
                                setActiveSortDirection(direction);
                              },
                              columnIndex: 2
                            }}
                          >
                            Region
                          </Th>
                          <Th
                            sort={{
                              sortBy: { index: activeSortIndex || 0, direction: activeSortDirection },
                              onSort: (_event, index, direction) => {
                                setActiveSortIndex(index);
                                setActiveSortDirection(direction);
                              },
                              columnIndex: 3
                            }}
                          >
                            Total alerts
                          </Th>
                          <Th
                            sort={{
                              sortBy: { index: activeSortIndex || 0, direction: activeSortDirection },
                              onSort: (_event, index, direction) => {
                                setActiveSortIndex(index);
                                setActiveSortDirection(direction);
                              },
                              columnIndex: 4
                            }}
                          >
                            Severity Breakdown
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {clustersForDisplay.slice((page - 1) * perPage, page * perPage).map(cluster => {
                          const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
                          const criticalCount = firingAlerts.filter(a => a.severity === 'Critical').length;
                          const warningCount = firingAlerts.filter(a => a.severity === 'Warning').length;
                          const infoCount = firingAlerts.filter(a => a.severity === 'Info').length;
                          const alertStatus = getClusterAlertStatus(cluster);
                          const statusConfig = {
                            critical: { color: 'red' as const, icon: <ExclamationCircleIcon /> },
                            warning: { color: 'orange' as const, icon: <ExclamationTriangleIcon /> },
                            info: { color: 'purple' as const, icon: <InfoCircleIcon /> },
                            healthy: { color: 'green' as const, icon: <CheckCircleIcon /> },
                          }[alertStatus];

                          return (
                            <Tr key={cluster.id} isClickable onRowClick={() => handleDrillDown(cluster)}>
                              <Td>
                                <Label
                                  color={statusConfig.color}
                                  icon={statusConfig.icon}
                                  isCompact
                                >
                                  {alertStatus.charAt(0).toUpperCase() + alertStatus.slice(1)}
                                </Label>
                              </Td>
                              <Td>
                                <strong>{cluster.name}</strong>
                              </Td>
                              <Td>{cluster.region}</Td>
                              <Td>
                                <Badge>{firingAlerts.length}</Badge>
                              </Td>
                              <Td>
                                <Flex gap={{ default: 'gapSm' }}>
                                  {criticalCount > 0 && <FlexItem><Label color="red" isCompact icon={<ExclamationCircleIcon />}>{criticalCount}</Label></FlexItem>}
                                  {warningCount > 0 && <FlexItem><Label color="orange" isCompact icon={<ExclamationTriangleIcon />}>{warningCount}</Label></FlexItem>}
                                  {infoCount > 0 && <FlexItem><Label color="purple" isCompact icon={<InfoCircleIcon />}>{infoCount}</Label></FlexItem>}
                                  {firingAlerts.length === 0 && <FlexItem><Label color="green" isCompact icon={<CheckCircleIcon />}>Healthy</Label></FlexItem>}
                                </Flex>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  )}
                </CardBody>
                {viewMode === 'summary' && (
                  <CardFooter>
                    <Pagination
                      itemCount={clustersForDisplay.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={(_, p) => setPage(p)}
                      onPerPageSelect={(_, pp) => setPerPage(pp)}
                      isCompact
                    />
                  </CardFooter>
                )}
              </Card>
            </div>
          </StackItem>

          {/* Cross-Cluster Insights Cards */}
          <CrossClusterInsightsCards
            clusters={timeFilteredClusters || filteredClusters}
            onAlertRuleClick={onAlertRuleClick}
            onComponentClick={onComponentClick}
            onClusterClick={onClusterClick}
            onViewAllFiringAlerts={onViewAllFiringAlerts}
            onViewAllClusters={onViewAllClusters}
          />

          {/* Alerts Timeline Card - Last */}
          <StackItem>
            <AlertsTimelineCard
              trendData={mockTrendData}
              onAlertClick={onAlertRuleClick}
              onViewContributingAlerts={onViewContributingAlerts}
              triggeredFromDate={triggeredFromDate}
              triggeredFromTime={triggeredFromTime}
              triggeredToDate={triggeredToDate}
              triggeredToTime={triggeredToTime}
            />
          </StackItem>
        </Stack>
      </div>
    </div>
  );
};
