import * as React from 'react';
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Badge,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Content,
  Label,
  LabelGroup,
  SearchInput,
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
import { FilterIcon, BookmarkIcon, CheckIcon, ClockIcon, CogIcon } from '@patternfly/react-icons';
import type { AlertSeverity, AlertGroup, AlertComponent, SavedFilter, GroupByOption, SortByOption, ImportanceSizing, ClusterData } from '../data/types';
import { getSeverityLabelColor } from '../data/utils';

type QuickTimeRange = 'last-5m' | 'last-15m' | 'last-30m' | 'last-1h' | 'last-4h' | 'last-6h' | 'last-12h' | 'last-24h' | 'last-2d' | 'last-7d' | 'custom';

const quickTimeRangeOptions: { value: QuickTimeRange; label: string; minutes: number | null }[] = [
  { value: 'last-5m', label: 'Last 5 minutes', minutes: 5 },
  { value: 'last-15m', label: 'Last 15 minutes', minutes: 15 },
  { value: 'last-30m', label: 'Last 30 minutes', minutes: 30 },
  { value: 'last-1h', label: 'Last 1 hour', minutes: 60 },
  { value: 'last-4h', label: 'Last 4 hours', minutes: 240 },
  { value: 'last-6h', label: 'Last 6 hours', minutes: 360 },
  { value: 'last-12h', label: 'Last 12 hours', minutes: 720 },
  { value: 'last-24h', label: 'Last 24 hours', minutes: 1440 },
  { value: 'last-2d', label: 'Last 2 days', minutes: 2880 },
  { value: 'last-7d', label: 'Last 7 days', minutes: 10080 },
  { value: 'custom', label: 'Custom time range', minutes: null },
];

export interface FleetOverviewToolbarProps {
  isFilterPanelOpen: boolean;
  setIsFilterPanelOpen: (open: boolean) => void;
  hasActiveFilters: boolean;
  regionFilter: string[];
  clusterFilter: string[];
  severityFilter: AlertSeverity[];
  hasGroupFilterChanges: boolean;
  groupFilter: AlertGroup[];
  componentFilter: AlertComponent[];
  setRegionFilter: (v: string[]) => void;
  setClusterFilter: (v: string[]) => void;
  setNamespaceFilter: (v: string[]) => void;
  setLabelFilter: (v: string[]) => void;
  setSeverityFilter: (v: AlertSeverity[]) => void;
  setGroupFilter: (v: AlertGroup[]) => void;
  setComponentFilter: (v: AlertComponent[]) => void;
  namespaceFilter: string[];
  labelFilter: string[];
  searchValue: string;
  setSearchValue: (v: string) => void;
  isSavedFiltersDropdownOpen: boolean;
  setIsSavedFiltersDropdownOpen: (open: boolean) => void;
  selectedSavedFilter: SavedFilter | null;
  setSelectedSavedFilter: (f: SavedFilter | null) => void;
  savedFilters: SavedFilter[];
  setSavedFilters: React.Dispatch<React.SetStateAction<SavedFilter[]>>;
  setGroupBy: (v: GroupByOption) => void;
  setSortBy: (v: SortByOption) => void;
  setImportanceSizing: (v: ImportanceSizing) => void;
  setIsManageSavedFiltersModalOpen: (open: boolean) => void;
  triggeredFromDate: string;
  setTriggeredFromDate: (v: string) => void;
  triggeredFromTime: string;
  setTriggeredFromTime: (v: string) => void;
  triggeredToDate: string;
  setTriggeredToDate: (v: string) => void;
  triggeredToTime: string;
  setTriggeredToTime: (v: string) => void;
  quickTimeRange: QuickTimeRange;
  setQuickTimeRange: (v: QuickTimeRange) => void;
  isQuickTimeRangeOpen: boolean;
  setIsQuickTimeRangeOpen: (open: boolean) => void;
  isCustomTimeRangePopoverOpen: boolean;
  setIsCustomTimeRangePopoverOpen: (open: boolean) => void;
  showFilterAnimation: boolean;
  mainComponentFilter: string | null;
  setMainComponentFilter: (v: string | null) => void;
  mainAlertNameFilter: string | null;
  setMainAlertNameFilter: (v: string | null) => void;
  clearFilters: () => void;
  setNewFilterName: (v: string) => void;
  setIsSaveFilterModalOpen: (open: boolean) => void;
  addToast: (title: string, variant: 'success' | 'danger' | 'warning' | 'info', description?: string) => void;
  // For cluster card view
  setSelectedClusterInCard: (v: ClusterData | null) => void;
  setClusterCardView: (v: 'all-clusters' | 'single-cluster-components') => void;
  setSelectedClusterForAlerts: (v: ClusterData | null) => void;
  setFiringAlertsCardView: (v: 'all-clusters' | 'single-cluster') => void;
}

export const FleetOverviewToolbar: React.FunctionComponent<FleetOverviewToolbarProps> = (props) => {
  const {
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    hasActiveFilters,
    regionFilter,
    clusterFilter,
    severityFilter,
    hasGroupFilterChanges,
    groupFilter,
    componentFilter,
    setRegionFilter,
    setClusterFilter,
    setNamespaceFilter,
    setLabelFilter,
    setSeverityFilter,
    setGroupFilter,
    setComponentFilter,
    namespaceFilter,
    labelFilter,
    searchValue,
    setSearchValue,
    isSavedFiltersDropdownOpen,
    setIsSavedFiltersDropdownOpen,
    selectedSavedFilter,
    setSelectedSavedFilter,
    savedFilters,
    setSavedFilters,
    setGroupBy,
    setSortBy,
    setImportanceSizing,
    setIsManageSavedFiltersModalOpen,
    triggeredFromDate,
    setTriggeredFromDate,
    triggeredFromTime,
    setTriggeredFromTime,
    triggeredToDate,
    setTriggeredToDate,
    triggeredToTime,
    setTriggeredToTime,
    quickTimeRange,
    setQuickTimeRange,
    isQuickTimeRangeOpen,
    setIsQuickTimeRangeOpen,
    isCustomTimeRangePopoverOpen,
    setIsCustomTimeRangePopoverOpen,
    showFilterAnimation,
    mainComponentFilter,
    setMainComponentFilter,
    mainAlertNameFilter,
    setMainAlertNameFilter,
    clearFilters,
    setNewFilterName,
    setIsSaveFilterModalOpen,
    addToast,
    setSelectedClusterInCard,
    setClusterCardView,
    setSelectedClusterForAlerts,
    setFiringAlertsCardView,
  } = props;

  return (
    <div style={{
      padding: '16px 8px',
      backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
    }}>
      <Toolbar className="pf-m-align-items-center" style={{ backgroundColor: 'transparent', paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <ToolbarContent className="pf-m-align-items-center">
          <ToolbarItem>
            <Button
              variant={isFilterPanelOpen ? 'secondary' : 'control'}
              icon={<FilterIcon />}
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            >
              Filters {hasActiveFilters && <Badge isRead style={{ marginLeft: '4px' }}>{
                regionFilter.length +
                clusterFilter.length +
                severityFilter.length +
                (hasGroupFilterChanges ? groupFilter.length : 0) +
                componentFilter.length
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
                          setSeverityFilter(filter.filters.severity as AlertSeverity[]);
                          setGroupFilter(filter.filters.group as AlertGroup[]);
                          setComponentFilter(filter.filters.component as AlertComponent[]);
                          setRegionFilter(filter.filters.region || []);
                          setClusterFilter(filter.filters.cluster || []);
                          setNamespaceFilter(filter.filters.namespace || []);
                          setLabelFilter(filter.filters.label || []);
                          setSearchValue(filter.filters.searchValue || '');

                          if (filter.viewSettings) {
                            if (filter.viewSettings.groupBy !== undefined) {
                              setGroupBy(filter.viewSettings.groupBy);
                            }
                            if (filter.viewSettings.sortBy !== undefined) {
                              setSortBy(filter.viewSettings.sortBy);
                            }
                            if (filter.viewSettings.importanceSizing !== undefined) {
                              setImportanceSizing(filter.viewSettings.importanceSizing);
                            }
                          }

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
              placeholder="Search clusters"
              value={searchValue}
              onChange={(_, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
              style={{ width: '100%' }}
            />
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Popover
              isVisible={isCustomTimeRangePopoverOpen}
              shouldClose={() => setIsCustomTimeRangePopoverOpen(false)}
              headerContent="Custom time range"
              minWidth="360px"
              maxWidth="360px"
              bodyContent={
                <Stack hasGutter>
                  <StackItem>
                    <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px', display: 'block' }}>From</Content>
                    <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'nowrap' }}>
                      <FlexItem>
                        <DatePicker
                          value={triggeredFromDate || ''}
                          onChange={(_, str) => setTriggeredFromDate(str)}
                          placeholder="YYYY-MM-DD"
                          style={{ width: '170px' }}
                        />
                      </FlexItem>
                      <FlexItem>
                        <TimePicker
                          time={triggeredFromTime || ''}
                          onChange={(_, time) => setTriggeredFromTime(time)}
                          placeholder="HH:MM"
                          aria-label="From time"
                          is24Hour
                          style={{ width: '100px' }}
                          menuAppendTo={() => document.body}
                        />
                      </FlexItem>
                    </Flex>
                  </StackItem>
                  <StackItem>
                    <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px', display: 'block' }}>To</Content>
                    <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'nowrap' }}>
                      <FlexItem>
                        <DatePicker
                          value={triggeredToDate || ''}
                          onChange={(_, str) => setTriggeredToDate(str)}
                          placeholder="YYYY-MM-DD"
                          style={{ width: '170px' }}
                        />
                      </FlexItem>
                      <FlexItem>
                        <TimePicker
                          time={triggeredToTime || ''}
                          onChange={(_, time) => setTriggeredToTime(time)}
                          placeholder="HH:MM"
                          aria-label="To time"
                          is24Hour
                          style={{ width: '100px' }}
                          menuAppendTo={() => document.body}
                        />
                      </FlexItem>
                    </Flex>
                  </StackItem>
                  <StackItem>
                    <Button variant="primary" onClick={() => setIsCustomTimeRangePopoverOpen(false)} style={{ width: '100%' }}>
                      Apply
                    </Button>
                  </StackItem>
                </Stack>
              }
              position="bottom-end"
            >
              <Dropdown
                isOpen={isQuickTimeRangeOpen}
                onOpenChange={setIsQuickTimeRangeOpen}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plainText"
                    onClick={() => setIsQuickTimeRangeOpen(!isQuickTimeRangeOpen)}
                    isExpanded={isQuickTimeRangeOpen}
                    icon={<ClockIcon />}
                    style={{ minWidth: '140px', padding: '4px 8px' }}
                  >
                    {quickTimeRangeOptions.find(o => o.value === quickTimeRange)?.label}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {quickTimeRangeOptions.map(opt => (
                    <DropdownItem
                      key={opt.value}
                      onClick={() => {
                        if (opt.value === 'custom') {
                          setQuickTimeRange('custom');
                          setIsQuickTimeRangeOpen(false);
                          setIsCustomTimeRangePopoverOpen(true);
                        } else {
                          setQuickTimeRange(opt.value);
                          setIsQuickTimeRangeOpen(false);
                        }
                      }}
                    >
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                        <FlexItem>{opt.label}</FlexItem>
                        {quickTimeRange === opt.value && (
                          <FlexItem>
                            <CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} />
                          </FlexItem>
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

      {hasActiveFilters && (
        <div style={{
          marginTop: '16px',
          marginBottom: '0px',
        }}>
          <Flex
            gap={{ default: 'gapSm' }}
            alignItems={{ default: 'alignItemsCenter' }}
            style={{
              padding: showFilterAnimation ? '8px 12px' : undefined,
              borderRadius: showFilterAnimation ? '6px' : undefined,
              backgroundColor: showFilterAnimation ? 'var(--pf-t--global--color--brand--default)' : undefined,
              animation: showFilterAnimation ? 'filterChipsHighlight 1.5s ease-out' : undefined,
            }}
          >
            <style>{`
              @keyframes filterChipsHighlight {
                0% { background-color: rgba(0, 102, 204, 0.25); }
                100% { background-color: transparent; }
              }
            `}</style>
            <FlexItem>
              <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                {hasGroupFilterChanges && (
                  <LabelGroup categoryName="Alert scope">
                    {groupFilter.map(g => (
                      <Label key={g} variant="outline" onClose={() => {
                        if (g === 'Cluster') {
                          setGroupFilter(['Namespace']);
                        } else {
                          setGroupFilter(['Cluster']);
                        }
                      }}>{g}</Label>
                    ))}
                  </LabelGroup>
                )}
                {severityFilter.length > 0 && (
                  <LabelGroup categoryName="Severity">
                    {severityFilter.map(s => (
                      <Label key={s} color={getSeverityLabelColor(s)} onClose={() => setSeverityFilter(severityFilter.filter(x => x !== s))}>{s}</Label>
                    ))}
                  </LabelGroup>
                )}
                {componentFilter.length > 0 && (
                  <LabelGroup categoryName={
                    groupFilter.length > 0 && groupFilter.length < 2
                      ? `Affected component (in: Alert scope: ${groupFilter.join(', Alert scope: ')})`
                      : "Affected component"
                  }>
                    {componentFilter.map(c => (
                      <Label key={c} variant="outline" onClose={() => setComponentFilter(componentFilter.filter(x => x !== c))}>{c}</Label>
                    ))}
                  </LabelGroup>
                )}
                {regionFilter.length > 0 && (
                  <LabelGroup categoryName="Region">
                    {regionFilter.map(r => (
                      <Label key={r} variant="outline" onClose={() => setRegionFilter(regionFilter.filter(x => x !== r))}>{r}</Label>
                    ))}
                  </LabelGroup>
                )}
                {clusterFilter.length > 0 && (
                  <LabelGroup categoryName="Cluster">
                    {clusterFilter.map(c => (
                      <Label key={c} variant="outline" onClose={() => {
                        const newFilter = clusterFilter.filter(x => x !== c);
                        setClusterFilter(newFilter);
                        if (newFilter.length === 0) {
                          setSelectedClusterInCard(null);
                          setClusterCardView('all-clusters');
                          setSelectedClusterForAlerts(null);
                          setFiringAlertsCardView('all-clusters');
                        }
                      }}>{c}</Label>
                    ))}
                  </LabelGroup>
                )}
                {namespaceFilter.length > 0 && (
                  <LabelGroup categoryName="Namespace">
                    {namespaceFilter.map(n => (
                      <Label key={n} variant="outline" onClose={() => setNamespaceFilter(namespaceFilter.filter(x => x !== n))}>{n}</Label>
                    ))}
                  </LabelGroup>
                )}
                {labelFilter.length > 0 && (
                  <LabelGroup categoryName="Label">
                    {labelFilter.map(l => (
                      <Label key={l} variant="outline" onClose={() => setLabelFilter(labelFilter.filter(x => x !== l))}>{l}</Label>
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
              </Flex>
            </FlexItem>
            {hasActiveFilters && (
              <FlexItem>
                <Flex gap={{ default: 'gapSm' }}>
                  <FlexItem>
                    <Button variant="link" onClick={() => {
                      clearFilters();
                      setSelectedSavedFilter(null);
                    }}>
                      Clear filters
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="link" onClick={() => setIsFilterPanelOpen(true)}>
                      Edit filters
                    </Button>
                  </FlexItem>
                  {selectedSavedFilter && (() => {
                    const savedSeverity = selectedSavedFilter.filters.severity || [];
                    const savedGroup = selectedSavedFilter.filters.group || [];
                    const savedComponent = selectedSavedFilter.filters.component || [];
                    const savedSearchValue = selectedSavedFilter.filters.searchValue || '';
                    const savedRegion = selectedSavedFilter.filters.region || [];
                    const savedCluster = selectedSavedFilter.filters.cluster || [];
                    const savedNamespace = selectedSavedFilter.filters.namespace || [];
                    const savedLabel = selectedSavedFilter.filters.label || [];

                    const hasChanges =
                      JSON.stringify([...severityFilter].sort()) !== JSON.stringify([...savedSeverity].sort()) ||
                      JSON.stringify([...groupFilter].sort()) !== JSON.stringify([...savedGroup].sort()) ||
                      JSON.stringify([...componentFilter].sort()) !== JSON.stringify([...savedComponent].sort()) ||
                      JSON.stringify([...regionFilter].sort()) !== JSON.stringify([...savedRegion].sort()) ||
                      JSON.stringify([...clusterFilter].sort()) !== JSON.stringify([...savedCluster].sort()) ||
                      JSON.stringify([...namespaceFilter].sort()) !== JSON.stringify([...savedNamespace].sort()) ||
                      JSON.stringify([...labelFilter].sort()) !== JSON.stringify([...savedLabel].sort()) ||
                      searchValue !== savedSearchValue;

                    return hasChanges ? (
                      <FlexItem>
                        <Button variant="link" onClick={() => {
                          const updatedFilters = {
                            severity: severityFilter,
                            group: groupFilter,
                            component: componentFilter,
                            source: [] as string[],
                            searchValue,
                            region: regionFilter,
                            cluster: clusterFilter,
                            namespace: namespaceFilter,
                            label: labelFilter,
                          };
                          setSavedFilters(savedFilters.map(f =>
                            f.id === selectedSavedFilter.id
                              ? { ...f, filters: updatedFilters }
                              : f
                          ));
                          setSelectedSavedFilter({
                            ...selectedSavedFilter,
                            filters: updatedFilters
                          });
                          addToast(`Filter "${selectedSavedFilter.name}" updated`, 'success');
                        }}>
                          Update saved filter
                        </Button>
                      </FlexItem>
                    ) : null;
                  })()}
                  <FlexItem>
                    <Button variant="link" onClick={() => {
                      setNewFilterName('');
                      setIsSaveFilterModalOpen(true);
                    }}>
                      Add to saved filters
                    </Button>
                  </FlexItem>
                </Flex>
              </FlexItem>
            )}
          </Flex>
        </div>
      )}
    </div>
  );
};
