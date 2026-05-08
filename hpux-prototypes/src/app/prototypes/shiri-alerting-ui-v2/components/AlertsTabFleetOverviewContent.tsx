import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Button,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Content,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Label,
  LabelGroup,
  Badge,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Popover,
  DatePicker,
  TimePicker,
  Divider,
} from '@patternfly/react-core';
import { ArrowLeftIcon, FilterIcon, BookmarkIcon, CheckIcon, ClockIcon, CogIcon } from '@patternfly/react-icons';
import type { AlertSeverity, AlertGroup, AlertComponent, ClusterData, SavedFilter, AlertsGroupByOption } from '../data/types';
import { getSeverityLabelColor } from '../data/utils';
import { FilterPanel } from './FilterPanel';
import { AllAlertsCard } from './AllAlertsCard';

type QuickTimeRange = 'last-5m' | 'last-15m' | 'last-30m' | 'last-1h' | 'last-4h' | 'last-6h' | 'last-12h' | 'last-24h' | 'last-2d' | 'last-7d' | 'custom';

const quickTimeRangeOptions: { value: QuickTimeRange; label: string }[] = [
  { value: 'last-5m', label: 'Last 5 minutes' },
  { value: 'last-15m', label: 'Last 15 minutes' },
  { value: 'last-30m', label: 'Last 30 minutes' },
  { value: 'last-1h', label: 'Last 1 hour' },
  { value: 'last-4h', label: 'Last 4 hours' },
  { value: 'last-6h', label: 'Last 6 hours' },
  { value: 'last-12h', label: 'Last 12 hours' },
  { value: 'last-24h', label: 'Last 24 hours' },
  { value: 'last-2d', label: 'Last 2 days' },
  { value: 'last-7d', label: 'Last 7 days' },
  { value: 'custom', label: 'Custom time range' },
];

export interface AlertsTabFleetOverviewContentProps {
  showFilterAnimation: boolean;
  isDrawerExpanded: boolean;
  cameFromFleetOverview: boolean;
  onBackToFleetOverview: () => void;
  alertsTabIsFilterPanelOpen: boolean;
  setAlertsTabIsFilterPanelOpen: (open: boolean) => void;
  // Filter state
  alertsTabRegionFilter: string[];
  setAlertsTabRegionFilter: (v: string[]) => void;
  alertsTabClusterFilter: string[];
  setAlertsTabClusterFilter: (v: string[]) => void;
  alertsTabNamespaceFilter: string[];
  setAlertsTabNamespaceFilter: (v: string[]) => void;
  alertsTabLabelFilter: string[];
  setAlertsTabLabelFilter: (v: string[]) => void;
  alertsTabSeverityFilter: AlertSeverity[];
  setAlertsTabSeverityFilter: (v: AlertSeverity[]) => void;
  alertsTabGroupFilter: AlertGroup[];
  setAlertsTabGroupFilter: (v: AlertGroup[]) => void;
  alertsTabComponentFilter: AlertComponent[];
  setAlertsTabComponentFilter: (v: AlertComponent[]) => void;
  alertsTabSearchValue: string;
  setAlertsTabSearchValue: (v: string) => void;
  alertsTabTriggeredFromDate: string;
  setAlertsTabTriggeredFromDate: (v: string) => void;
  alertsTabTriggeredFromTime: string;
  setAlertsTabTriggeredFromTime: (v: string) => void;
  alertsTabTriggeredToDate: string;
  setAlertsTabTriggeredToDate: (v: string) => void;
  alertsTabTriggeredToTime: string;
  setAlertsTabTriggeredToTime: (v: string) => void;
  alertsTabQuickTimeRange: QuickTimeRange;
  setAlertsTabQuickTimeRange: (v: QuickTimeRange) => void;
  alertsTabIsQuickTimeRangeOpen: boolean;
  setAlertsTabIsQuickTimeRangeOpen: (open: boolean) => void;
  alertsTabIsCustomTimeRangePopoverOpen: boolean;
  setAlertsTabIsCustomTimeRangePopoverOpen: (open: boolean) => void;
  alertStateFilter: string[];
  setAlertStateFilter: (v: string[]) => void;
  alertSourceFilter: string[];
  setAlertSourceFilter: (v: string[]) => void;
  contributingAlertsFilter: string[];
  setContributingAlertsFilter: (v: string[]) => void;
  // Filter panel data
  regions: string[];
  clusterNames: string[];
  clusters: ClusterData[];
  namespaces: string[];
  availableLabels: string[];
  regionCounts: Record<string, number>;
  clusterCounts: Record<string, number>;
  namespaceCounts: Record<string, number>;
  // Saved filters
  savedFilters: SavedFilter[];
  setSavedFilters: React.Dispatch<React.SetStateAction<SavedFilter[]>>;
  selectedSavedFilter: SavedFilter | null;
  setSelectedSavedFilter: (f: SavedFilter | null) => void;
  isSavedFiltersDropdownOpen: boolean;
  setIsSavedFiltersDropdownOpen: (open: boolean) => void;
  setIsManageSavedFiltersModalOpen: (open: boolean) => void;
  setNewFilterName: (v: string) => void;
  setIsSaveFilterModalOpen: (open: boolean) => void;
  // Alerts card
  firingAlertsCardView: 'all-clusters' | 'single-cluster';
  selectedClusterForAlerts: ClusterData | null;
  filteredClustersForAlerts: ClusterData[];
  totalAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
  infoAlerts: number;
  healthyClusters: number;
  mainAlertNameFilter: string | null;
  mainComponentFilter: string | null;
  setMainAlertNameFilter: (v: string | null) => void;
  setMainComponentFilter: (v: string | null) => void;
  alertsGroupBy: AlertsGroupByOption;
  setAlertsGroupBy: (v: AlertsGroupByOption) => void;
  onClusterClick: (cluster: ClusterData) => void;
  onAlertClick: (alert: import('../data/types').AlertData, initialTab?: number) => void;
  setMainPageTab: (v: string | number) => void;
  setManagementSubTab: (v: string | number) => void;
  clearAlertsTabFilters: () => void;
  hasAlertsTabActiveFilters: boolean;
  hasAlertsTabGroupFilterChanges: boolean;
}

export const AlertsTabFleetOverviewContent: React.FunctionComponent<AlertsTabFleetOverviewContentProps> = (props) => {
  const {
    showFilterAnimation,
    isDrawerExpanded,
    cameFromFleetOverview,
    onBackToFleetOverview,
    alertsTabIsFilterPanelOpen,
    setAlertsTabIsFilterPanelOpen,
    alertsTabRegionFilter,
    setAlertsTabRegionFilter,
    alertsTabClusterFilter,
    setAlertsTabClusterFilter,
    alertsTabNamespaceFilter,
    setAlertsTabNamespaceFilter,
    alertsTabLabelFilter,
    setAlertsTabLabelFilter,
    alertsTabSeverityFilter,
    setAlertsTabSeverityFilter,
    alertsTabGroupFilter,
    setAlertsTabGroupFilter,
    alertsTabComponentFilter,
    setAlertsTabComponentFilter,
    alertsTabSearchValue,
    setAlertsTabSearchValue,
    alertsTabTriggeredFromDate,
    setAlertsTabTriggeredFromDate,
    alertsTabTriggeredFromTime,
    setAlertsTabTriggeredFromTime,
    alertsTabTriggeredToDate,
    setAlertsTabTriggeredToDate,
    alertsTabTriggeredToTime,
    setAlertsTabTriggeredToTime,
    alertsTabQuickTimeRange,
    setAlertsTabQuickTimeRange,
    alertsTabIsQuickTimeRangeOpen,
    setAlertsTabIsQuickTimeRangeOpen,
    alertsTabIsCustomTimeRangePopoverOpen,
    setAlertsTabIsCustomTimeRangePopoverOpen,
    alertStateFilter,
    setAlertStateFilter,
    alertSourceFilter,
    setAlertSourceFilter,
    contributingAlertsFilter,
    setContributingAlertsFilter,
    regions,
    clusterNames,
    clusters,
    namespaces,
    availableLabels,
    regionCounts,
    clusterCounts,
    namespaceCounts,
    savedFilters,
    setSavedFilters,
    selectedSavedFilter,
    setSelectedSavedFilter,
    isSavedFiltersDropdownOpen,
    setIsSavedFiltersDropdownOpen,
    setIsManageSavedFiltersModalOpen,
    setNewFilterName,
    setIsSaveFilterModalOpen,
    firingAlertsCardView,
    selectedClusterForAlerts,
    filteredClustersForAlerts,
    totalAlerts,
    criticalAlerts,
    warningAlerts,
    infoAlerts,
    healthyClusters,
    mainAlertNameFilter,
    mainComponentFilter,
    setMainAlertNameFilter,
    setMainComponentFilter,
    alertsGroupBy,
    setAlertsGroupBy,
    onClusterClick,
    onAlertClick,
    setMainPageTab,
    setManagementSubTab,
    clearAlertsTabFilters,
    hasAlertsTabActiveFilters,
    hasAlertsTabGroupFilterChanges,
  } = props;

  return (
    <Drawer isExpanded={isDrawerExpanded} position="end" style={{ flex: 1, minHeight: 0 }}>
      {showFilterAnimation && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--pf-t--global--color--brand--default)',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 100,
            animation: 'filterFlash 1.5s ease-out',
          }}
        />
      )}
      <style>{`
        @keyframes filterFlash {
          0% { opacity: 0.15; }
          20% { opacity: 0.08; }
          100% { opacity: 0; }
        }
        @keyframes pulseHighlight {
          0% { box-shadow: 0 0 0 0 rgba(0, 102, 204, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(0, 102, 204, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 102, 204, 0); }
        }
      `}</style>
      <DrawerContent panelContent={null}>
        <DrawerContentBody style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {cameFromFleetOverview && (
            <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--pf-t--global--border--color--default)', flexShrink: 0 }}>
              <Button variant="link" isInline icon={<ArrowLeftIcon />} onClick={onBackToFleetOverview}>
                Back to Fleet overview
              </Button>
            </div>
          )}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {alertsTabIsFilterPanelOpen && (
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
                  regionFilter={alertsTabRegionFilter}
                  setRegionFilter={setAlertsTabRegionFilter}
                  clusterFilter={alertsTabClusterFilter}
                  setClusterFilter={setAlertsTabClusterFilter}
                  namespaceFilter={alertsTabNamespaceFilter}
                  setNamespaceFilter={setAlertsTabNamespaceFilter}
                  labelFilter={alertsTabLabelFilter}
                  setLabelFilter={setAlertsTabLabelFilter}
                  severityFilter={alertsTabSeverityFilter}
                  setSeverityFilter={setAlertsTabSeverityFilter}
                  groupFilter={alertsTabGroupFilter}
                  setGroupFilter={setAlertsTabGroupFilter}
                  componentFilter={alertsTabComponentFilter}
                  setComponentFilter={setAlertsTabComponentFilter}
                  regions={regions}
                  clusterNames={clusterNames}
                  clusters={clusters}
                  namespaces={namespaces}
                  availableLabels={availableLabels}
                  regionCounts={regionCounts}
                  clusterCounts={clusterCounts}
                  namespaceCounts={namespaceCounts}
                  onClose={() => setAlertsTabIsFilterPanelOpen(false)}
                  savedFilters={savedFilters}
                  onApplySavedFilter={(filter) => {
                    setAlertsTabSeverityFilter(filter.filters.severity);
                    setAlertsTabGroupFilter(filter.filters.group);
                    setAlertsTabComponentFilter(filter.filters.component);
                  }}
                  onSaveFilter={(name) => {
                    const newFilter: SavedFilter = {
                      id: `sf-${Date.now()}`,
                      name,
                      filters: { severity: alertsTabSeverityFilter, group: alertsTabGroupFilter, component: alertsTabComponentFilter, source: [], searchValue: alertsTabSearchValue },
                    };
                    setSavedFilters([...savedFilters, newFilter]);
                  }}
                  onDeleteSavedFilter={(id) => setSavedFilters(savedFilters.filter(f => f.id !== id))}
                  showAlertFilters={true}
                  stateFilter={alertStateFilter}
                  setStateFilter={setAlertStateFilter}
                  sourceFilter={alertSourceFilter}
                  setSourceFilter={setAlertSourceFilter}
                  triggeredFromDate={alertsTabTriggeredFromDate}
                  setTriggeredFromDate={setAlertsTabTriggeredFromDate}
                  triggeredFromTime={alertsTabTriggeredFromTime}
                  setTriggeredFromTime={setAlertsTabTriggeredFromTime}
                  triggeredToDate={alertsTabTriggeredToDate}
                  setTriggeredToDate={setAlertsTabTriggeredToDate}
                  triggeredToTime={alertsTabTriggeredToTime}
                  setTriggeredToTime={setAlertsTabTriggeredToTime}
                  filterContext="alerts"
                />
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              <Stack hasGutter style={{ gap: '16px' }}>
                <StackItem>
                  <AllAlertsCard
                    showMetrics={firingAlertsCardView === 'all-clusters'}
                    totalAlerts={totalAlerts}
                    criticalAlerts={criticalAlerts}
                    warningAlerts={warningAlerts}
                    infoAlerts={infoAlerts}
                    healthyAlerts={healthyClusters}
                    affectedClusters={filteredClustersForAlerts.filter(c => c.alerts.some(a => a.status === 'firing')).length}
                    onCriticalClick={() => {
                      if (!alertsTabSeverityFilter.includes('Critical')) {
                        setAlertsTabSeverityFilter([...alertsTabSeverityFilter, 'Critical']);
                      }
                    }}
                    onWarningClick={() => {
                      if (!alertsTabSeverityFilter.includes('Warning')) {
                        setAlertsTabSeverityFilter([...alertsTabSeverityFilter, 'Warning']);
                      }
                    }}
                    onInfoClick={() => {
                      if (!alertsTabSeverityFilter.includes('Info')) {
                        setAlertsTabSeverityFilter([...alertsTabSeverityFilter, 'Info']);
                      }
                    }}
                    clusters={firingAlertsCardView === 'single-cluster' && selectedClusterForAlerts
                      ? [selectedClusterForAlerts]
                      : filteredClustersForAlerts}
                    alertNameFilter={mainAlertNameFilter}
                    componentFilter={mainComponentFilter}
                    groupFilter={alertsTabGroupFilter}
                    onClearAlertNameFilter={() => setMainAlertNameFilter(null)}
                    onClearComponentFilter={() => setMainComponentFilter(null)}
                    onClusterClick={onClusterClick}
                    onAlertClick={onAlertClick}
                    onAlertRuleClick={() => {
                      setMainPageTab('management');
                      setManagementSubTab('alert-rules');
                    }}
                    onComponentClick={(componentName) => {
                      setMainComponentFilter(componentName);
                    }}
                    singleClusterView={firingAlertsCardView === 'single-cluster'}
                    groupBy={alertsGroupBy}
                    onGroupByChange={setAlertsGroupBy}
                    triggeredFromDate={alertsTabTriggeredFromDate}
                    triggeredFromTime={alertsTabTriggeredFromTime}
                    triggeredToDate={alertsTabTriggeredToDate}
                    onClusterFilterChange={setAlertsTabClusterFilter}
                    onNamespaceFilterChange={setAlertsTabNamespaceFilter}
                    triggeredToTime={alertsTabTriggeredToTime}
                    stateFilter={alertStateFilter}
                    sourceFilter={alertSourceFilter}
                    alertNamesFilter={contributingAlertsFilter}
                    filterToolbar={
                      <>
                        <Toolbar className="pf-m-align-items-center" style={{ backgroundColor: 'transparent', paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
                          <ToolbarContent className="pf-m-align-items-center">
                            <ToolbarItem>
                              <Button
                                variant={alertsTabIsFilterPanelOpen ? 'secondary' : 'control'}
                                icon={<FilterIcon />}
                                onClick={() => setAlertsTabIsFilterPanelOpen(!alertsTabIsFilterPanelOpen)}
                              >
                                Filters {hasAlertsTabActiveFilters && <Badge isRead style={{ marginLeft: '4px' }}>{
                                  alertsTabRegionFilter.length +
                                  alertsTabClusterFilter.length +
                                  alertsTabSeverityFilter.length +
                                  (hasAlertsTabGroupFilterChanges ? alertsTabGroupFilter.length : 0) +
                                  alertsTabComponentFilter.length +
                                  alertStateFilter.length +
                                  alertSourceFilter.length +
                                  contributingAlertsFilter.length
                                }</Badge>}
                              </Button>
                            </ToolbarItem>
                            <ToolbarItem>
                              <Dropdown
                                isOpen={isSavedFiltersDropdownOpen}
                                onOpenChange={setIsSavedFiltersDropdownOpen}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsSavedFiltersDropdownOpen(!isSavedFiltersDropdownOpen)}
                                    isExpanded={isSavedFiltersDropdownOpen}
                                    icon={<BookmarkIcon />}
                                  >
                                    {selectedSavedFilter ? selectedSavedFilter.name : 'My saved filters'}
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  {(() => {
                                    const visibleFilters = savedFilters.filter(f => !f.hidden);
                                    return visibleFilters.length === 0 ? (
                                      <DropdownItem isDisabled>No saved filters</DropdownItem>
                                    ) : (
                                      visibleFilters.map(filter => (
                                        <DropdownItem
                                          key={filter.id}
                                          onClick={() => {
                                            setSelectedSavedFilter(filter);
                                            setAlertsTabSeverityFilter(filter.filters.severity as AlertSeverity[]);
                                            setAlertsTabGroupFilter(filter.filters.group as AlertGroup[]);
                                            setAlertsTabComponentFilter(filter.filters.component as AlertComponent[]);
                                            setAlertsTabRegionFilter(filter.filters.region || []);
                                            setAlertsTabClusterFilter(filter.filters.cluster || []);
                                            setAlertsTabNamespaceFilter(filter.filters.namespace || []);
                                            setAlertsTabLabelFilter(filter.filters.label || []);
                                            setAlertsTabSearchValue(filter.filters.searchValue || '');
                                            setIsSavedFiltersDropdownOpen(false);
                                          }}
                                        >
                                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                            <FlexItem>{filter.name}{filter.isDefault ? ' ★' : ''}</FlexItem>
                                            {selectedSavedFilter?.id === filter.id && (
                                              <FlexItem>
                                                <CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} />
                                              </FlexItem>
                                            )}
                                          </Flex>
                                        </DropdownItem>
                                      ))
                                    );
                                  })()}
                                  <Divider />
                                  <DropdownItem
                                    onClick={() => {
                                      setIsManageSavedFiltersModalOpen(true);
                                      setIsSavedFiltersDropdownOpen(false);
                                    }}
                                  >
                                    <CogIcon /> Manage saved filters
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </ToolbarItem>
                            <ToolbarItem style={{ flex: 1 }}>
                              <SearchInput
                                placeholder="Search alert name"
                                value={alertsTabSearchValue}
                                onChange={(_, value) => setAlertsTabSearchValue(value)}
                                onClear={() => setAlertsTabSearchValue('')}
                                style={{ width: '100%' }}
                              />
                            </ToolbarItem>
                            <ToolbarItem align={{ default: 'alignEnd' }}>
                              <Popover
                                isVisible={alertsTabIsCustomTimeRangePopoverOpen}
                                shouldClose={() => setAlertsTabIsCustomTimeRangePopoverOpen(false)}
                                headerContent="Custom time range"
                                minWidth="360px"
                                maxWidth="360px"
                                bodyContent={
                                  <Stack hasGutter>
                                    <StackItem>
                                      <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px', display: 'block' }}>From</Content>
                                      <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'nowrap' }}>
                                        <FlexItem>
                                          <DatePicker value={alertsTabTriggeredFromDate || ''} onChange={(_, str) => setAlertsTabTriggeredFromDate(str)} placeholder="YYYY-MM-DD" style={{ width: '170px' }} />
                                        </FlexItem>
                                        <FlexItem>
                                          <TimePicker time={alertsTabTriggeredFromTime || ''} onChange={(_, time) => setAlertsTabTriggeredFromTime(time)} placeholder="HH:MM" aria-label="From time" is24Hour style={{ width: '100px' }} menuAppendTo={() => document.body} />
                                        </FlexItem>
                                      </Flex>
                                    </StackItem>
                                    <StackItem>
                                      <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px', display: 'block' }}>To</Content>
                                      <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'nowrap' }}>
                                        <FlexItem>
                                          <DatePicker value={alertsTabTriggeredToDate || ''} onChange={(_, str) => setAlertsTabTriggeredToDate(str)} placeholder="YYYY-MM-DD" style={{ width: '170px' }} />
                                        </FlexItem>
                                        <FlexItem>
                                          <TimePicker time={alertsTabTriggeredToTime || ''} onChange={(_, time) => setAlertsTabTriggeredToTime(time)} placeholder="HH:MM" aria-label="To time" is24Hour style={{ width: '100px' }} menuAppendTo={() => document.body} />
                                        </FlexItem>
                                      </Flex>
                                    </StackItem>
                                    <StackItem>
                                      <Button variant="primary" onClick={() => setAlertsTabIsCustomTimeRangePopoverOpen(false)} style={{ width: '100%' }}>Apply</Button>
                                    </StackItem>
                                  </Stack>
                                }
                                position="bottom-end"
                              >
                                <Dropdown
                                  isOpen={alertsTabIsQuickTimeRangeOpen}
                                  onOpenChange={setAlertsTabIsQuickTimeRangeOpen}
                                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                    <MenuToggle ref={toggleRef} variant="plainText" onClick={() => setAlertsTabIsQuickTimeRangeOpen(!alertsTabIsQuickTimeRangeOpen)} isExpanded={alertsTabIsQuickTimeRangeOpen} icon={<ClockIcon />} style={{ minWidth: '140px', padding: '4px 8px' }}>
                                      {quickTimeRangeOptions.find(o => o.value === alertsTabQuickTimeRange)?.label}
                                    </MenuToggle>
                                  )}
                                >
                                  <DropdownList>
                                    {quickTimeRangeOptions.map(opt => (
                                      <DropdownItem key={opt.value} onClick={() => {
                                        if (opt.value === 'custom') {
                                          setAlertsTabQuickTimeRange('custom');
                                          setAlertsTabIsQuickTimeRangeOpen(false);
                                          setAlertsTabIsCustomTimeRangePopoverOpen(true);
                                        } else {
                                          setAlertsTabQuickTimeRange(opt.value);
                                          setAlertsTabIsQuickTimeRangeOpen(false);
                                        }
                                      }}>
                                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                          <FlexItem>{opt.label}</FlexItem>
                                          {alertsTabQuickTimeRange === opt.value && (
                                            <FlexItem><CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} /></FlexItem>
                                          )}
                                        </Flex>
                                      </DropdownItem>
                                    ))}
                                  </DropdownList>
                                </Dropdown>
                              </Popover>
                            </ToolbarItem>
                          </ToolbarContent>
                        </Toolbar>
                        {(alertsTabSeverityFilter.length > 0 || hasAlertsTabGroupFilterChanges || alertsTabComponentFilter.length > 0 || alertsTabRegionFilter.length > 0 || alertsTabClusterFilter.length > 0 || alertsTabNamespaceFilter.length > 0 || alertsTabLabelFilter.length > 0 || mainComponentFilter !== null || mainAlertNameFilter !== null || alertStateFilter.length > 0 || alertSourceFilter.length > 0 || contributingAlertsFilter.length > 0) && (
                          <div style={{ marginTop: '8px' }}>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem>
                                <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  {hasAlertsTabGroupFilterChanges && (
                                    <LabelGroup categoryName="Alert scope">
                                      {alertsTabGroupFilter.map(g => (
                                        <Label key={g} variant="outline" onClose={() => {
                                          if (g === 'Cluster') { setAlertsTabGroupFilter(['Namespace']); } else { setAlertsTabGroupFilter(['Cluster']); }
                                        }}>{g}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertsTabSeverityFilter.length > 0 && (
                                    <LabelGroup categoryName="Severity">
                                      {alertsTabSeverityFilter.map(s => (
                                        <Label key={s} color={getSeverityLabelColor(s)} onClose={() => setAlertsTabSeverityFilter(alertsTabSeverityFilter.filter(x => x !== s))}>{s}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertsTabComponentFilter.length > 0 && (
                                    <LabelGroup categoryName="Affected component">
                                      {alertsTabComponentFilter.map(c => (
                                        <Label key={c} variant="outline" onClose={() => setAlertsTabComponentFilter(alertsTabComponentFilter.filter(x => x !== c))}>{c}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertsTabRegionFilter.length > 0 && (
                                    <LabelGroup categoryName="Region">
                                      {alertsTabRegionFilter.map(r => (
                                        <Label key={r} variant="outline" onClose={() => setAlertsTabRegionFilter(alertsTabRegionFilter.filter(x => x !== r))}>{r}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertsTabClusterFilter.length > 0 && (
                                    <LabelGroup categoryName="Cluster">
                                      {alertsTabClusterFilter.map(c => (
                                        <Label key={c} variant="outline" onClose={() => setAlertsTabClusterFilter(alertsTabClusterFilter.filter(x => x !== c))}>{c}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertsTabNamespaceFilter.length > 0 && (
                                    <LabelGroup categoryName="Namespace">
                                      {alertsTabNamespaceFilter.map(n => (
                                        <Label key={n} variant="outline" onClose={() => setAlertsTabNamespaceFilter(alertsTabNamespaceFilter.filter(x => x !== n))}>{n}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertsTabLabelFilter.length > 0 && (
                                    <LabelGroup categoryName="Label">
                                      {alertsTabLabelFilter.map(l => (
                                        <Label key={l} variant="outline" onClose={() => setAlertsTabLabelFilter(alertsTabLabelFilter.filter(x => x !== l))}>{l}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertStateFilter.length > 0 && (
                                    <LabelGroup categoryName="State">
                                      {alertStateFilter.map(s => (
                                        <Label key={s} variant="outline" onClose={() => setAlertStateFilter(alertStateFilter.filter(x => x !== s))}>{s.charAt(0).toUpperCase() + s.slice(1)}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {alertSourceFilter.length > 0 && (
                                    <LabelGroup categoryName="Source">
                                      {alertSourceFilter.map(s => (
                                        <Label key={s} variant="outline" onClose={() => setAlertSourceFilter(alertSourceFilter.filter(x => x !== s))}>{s}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                  {mainComponentFilter && (
                                    <LabelGroup categoryName="Component">
                                      <Label variant="outline" onClose={() => setMainComponentFilter(null)}>{mainComponentFilter}</Label>
                                    </LabelGroup>
                                  )}
                                  {mainAlertNameFilter && (
                                    <LabelGroup categoryName="Alert">
                                      <Label variant="outline" onClose={() => setMainAlertNameFilter(null)}>{mainAlertNameFilter}</Label>
                                    </LabelGroup>
                                  )}
                                  {contributingAlertsFilter.length > 0 && (
                                    <LabelGroup categoryName="Spike alerts">
                                      {contributingAlertsFilter.map(a => (
                                        <Label key={a} variant="outline" onClose={() => setContributingAlertsFilter(contributingAlertsFilter.filter(x => x !== a))}>{a}</Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                </Flex>
                              </FlexItem>
                              <FlexItem>
                                <Flex gap={{ default: 'gapSm' }}>
                                  <FlexItem>
                                    <Button variant="link" onClick={() => { clearAlertsTabFilters(); setSelectedSavedFilter(null); }}>Clear filters</Button>
                                  </FlexItem>
                                  <FlexItem>
                                    <Button variant="link" onClick={() => setAlertsTabIsFilterPanelOpen(true)}>Edit filters</Button>
                                  </FlexItem>
                                  {selectedSavedFilter && (() => {
                                    const saved = selectedSavedFilter.filters;
                                    const hasChanges =
                                      JSON.stringify([...alertsTabSeverityFilter].sort()) !== JSON.stringify([...(saved.severity || [])].sort()) ||
                                      JSON.stringify([...alertsTabGroupFilter].sort()) !== JSON.stringify([...(saved.group || [])].sort()) ||
                                      JSON.stringify([...alertsTabComponentFilter].sort()) !== JSON.stringify([...(saved.component || [])].sort()) ||
                                      JSON.stringify([...alertSourceFilter].sort()) !== JSON.stringify([...(saved.source || [])].sort()) ||
                                      JSON.stringify([...alertsTabRegionFilter].sort()) !== JSON.stringify([...(saved.region || [])].sort()) ||
                                      JSON.stringify([...alertsTabClusterFilter].sort()) !== JSON.stringify([...(saved.cluster || [])].sort()) ||
                                      JSON.stringify([...alertsTabNamespaceFilter].sort()) !== JSON.stringify([...(saved.namespace || [])].sort()) ||
                                      JSON.stringify([...alertsTabLabelFilter].sort()) !== JSON.stringify([...(saved.label || [])].sort()) ||
                                      alertsTabSearchValue !== (saved.searchValue || '');
                                    return hasChanges ? (
                                      <FlexItem>
                                        <Button variant="link" onClick={() => {
                                          const updatedFilters = {
                                            severity: alertsTabSeverityFilter,
                                            group: alertsTabGroupFilter,
                                            component: alertsTabComponentFilter,
                                            source: alertSourceFilter,
                                            searchValue: alertsTabSearchValue,
                                            region: alertsTabRegionFilter,
                                            cluster: alertsTabClusterFilter,
                                            namespace: alertsTabNamespaceFilter,
                                            label: alertsTabLabelFilter,
                                          };
                                          setSavedFilters((prev: SavedFilter[]) => prev.map(f =>
                                            f.id === selectedSavedFilter.id ? { ...f, filters: updatedFilters } : f
                                          ));
                                          setSelectedSavedFilter({ ...selectedSavedFilter, filters: updatedFilters });
                                        }}>Update saved filter</Button>
                                      </FlexItem>
                                    ) : null;
                                  })()}
                                  <FlexItem>
                                    <Button variant="link" onClick={() => { setNewFilterName(''); setIsSaveFilterModalOpen(true); }}>Save as new filter</Button>
                                  </FlexItem>
                                </Flex>
                              </FlexItem>
                            </Flex>
                          </div>
                        )}
                      </>
                    }
                  />
                </StackItem>
              </Stack>
            </div>
          </div>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
