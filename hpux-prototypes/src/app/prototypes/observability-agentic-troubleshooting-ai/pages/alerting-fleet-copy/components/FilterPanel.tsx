import * as React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Content,
  Divider,
  Flex,
  FlexItem,
  Button,
  Label,
  Stack,
  StackItem,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  SearchInput,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  TimesIcon,
  FilterIcon,
  MapMarkerAltIcon,
  ClusterIcon,
  CubesIcon,
  CogIcon,
  HelpIcon,
} from '@patternfly/react-icons';
import type { AlertSeverity, AlertGroup, AlertComponent, ClusterData, SavedFilter } from '../data/types';
import { getSeverityLabelColor, getSeverityIcon } from '../data/utils';

export interface FilterPanelProps {
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
  clusters: ClusterData[]; // For cascading region-cluster filter
  namespaces: string[];
  availableLabels: string[];
  onClose: () => void;
  savedFilters: SavedFilter[];
  onApplySavedFilter: (filter: SavedFilter) => void;
  onSaveFilter: (name: string) => void;
  onDeleteSavedFilter: (id: string) => void;
  // Counts for filter options
  regionCounts?: Record<string, number>;
  clusterCounts?: Record<string, number>;
  namespaceCounts?: Record<string, number>;
  // Scope-based filters (show additional alert-specific filters)
  showAlertFilters?: boolean;
  stateFilter?: string[];
  setStateFilter?: (v: string[]) => void;
  sourceFilter?: string[];
  setSourceFilter?: (v: string[]) => void;
  triggeredFromDate?: string;
  setTriggeredFromDate?: (v: string) => void;
  triggeredFromTime?: string;
  setTriggeredFromTime?: (v: string) => void;
  triggeredToDate?: string;
  setTriggeredToDate?: (v: string) => void;
  triggeredToTime?: string;
  setTriggeredToTime?: (v: string) => void;
  // Filter context for dynamic title (fleet vs alerts)
  filterContext?: 'fleet' | 'alerts';
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  regionFilter, setRegionFilter,
  clusterFilter, setClusterFilter,
  namespaceFilter, setNamespaceFilter,
  labelFilter, setLabelFilter,
  severityFilter, setSeverityFilter,
  groupFilter, setGroupFilter,
  componentFilter, setComponentFilter,
  regions, clusterNames, clusters, namespaces, availableLabels,
  onClose,
  savedFilters, onApplySavedFilter, onSaveFilter, onDeleteSavedFilter,
  regionCounts = {}, clusterCounts = {}, namespaceCounts = {},
  showAlertFilters = false,
  stateFilter = [],
  setStateFilter,
  sourceFilter = [],
  setSourceFilter,
  triggeredFromDate,
  setTriggeredFromDate,
  triggeredFromTime,
  setTriggeredFromTime,
  triggeredToDate,
  setTriggeredToDate,
  triggeredToTime,
  setTriggeredToTime,
  filterContext = 'fleet',
}) => {
  const allSeverities: AlertSeverity[] = ['Critical', 'Warning', 'Info'];
  const allGroups: AlertGroup[] = ['Cluster', 'Namespace'];
  const clusterComponents: AlertComponent[] = ['kube-apiserver', 'etcd', 'Scheduler', 'Controller', 'Network'];
  const namespaceComponents: AlertComponent[] = ['Workload', 'Pod', 'Storage', 'Quota', 'Network'];
  const allComponents: AlertComponent[] = ['kube-apiserver', 'Storage', 'Network', 'etcd', 'Scheduler', 'Controller', 'Workload', 'Pod', 'Quota'];
  const allStates = ['firing', 'pending', 'acknowledged'];
  const stateCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allStates.forEach(s => { counts[s] = 0; });
    clusters.forEach(c => c.alerts.forEach(a => {
      if (counts[a.status] !== undefined) counts[a.status]++;
    }));
    return counts;
  }, [clusters]);
  const allSources = ['Platform', 'User-defined'];
  const sourceCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allSources.forEach(s => { counts[s] = 0; });
    clusters.forEach(c => c.alerts.forEach(a => {
      if (counts[a.source] !== undefined) counts[a.source]++;
    }));
    return counts;
  }, [clusters]);

  // Dropdown open states
  const [isRegionOpen, setIsRegionOpen] = React.useState(false);
  const [isClusterOpen, setIsClusterOpen] = React.useState(false);
  const [isNamespaceOpen, setIsNamespaceOpen] = React.useState(false);
  const [isLabelOpen, setIsLabelOpen] = React.useState(false);
  const [isComponentOpen, setIsComponentOpen] = React.useState(false);
  const [isStateOpen, setIsStateOpen] = React.useState(false);
  const [isSourceOpen, setIsSourceOpen] = React.useState(false);

  // Search values for dropdowns
  const [regionSearchValue, setRegionSearchValue] = React.useState('');
  const [clusterSearchValue, setClusterSearchValue] = React.useState('');
  const [namespaceSearchValue, setNamespaceSearchValue] = React.useState('');
  const [labelSearchValue, setLabelSearchValue] = React.useState('');
  const [componentSearchValue, setComponentSearchValue] = React.useState('');

  // Check if filters differ from Global View default
  const isGlobalView = groupFilter.length === 2 && groupFilter.includes('Cluster') && groupFilter.includes('Namespace');
  const hasGroupFilterChanges = !isGlobalView;

  const hasActiveFilters = regionFilter.length > 0 || clusterFilter.length > 0 || namespaceFilter.length > 0 ||
    labelFilter.length > 0 || severityFilter.length > 0 || hasGroupFilterChanges || componentFilter.length > 0;

  // Auto-clear cluster selections when their regions are deselected
  React.useEffect(() => {
    if (regionFilter.length > 0 && clusterFilter.length > 0) {
      const validClusterNames = clusters
        .filter(cluster => regionFilter.includes(cluster.region))
        .map(cluster => cluster.name);

      const updatedClusterFilter = clusterFilter.filter(clusterName =>
        validClusterNames.includes(clusterName)
      );

      if (updatedClusterFilter.length !== clusterFilter.length) {
        setClusterFilter(updatedClusterFilter);
      }
    }
  }, [regionFilter, clusters]); // Only watch regionFilter changes

  // Auto-clear namespace selections when their clusters are deselected
  React.useEffect(() => {
    if (clusterFilter.length > 0 && namespaceFilter.length > 0) {
      const validNamespaces = clusters
        .filter(cluster => clusterFilter.includes(cluster.name))
        .flatMap(cluster => cluster.namespaces);
      const uniqueValidNamespaces = Array.from(new Set(validNamespaces));

      const updatedNamespaceFilter = namespaceFilter.filter(namespaceName =>
        uniqueValidNamespaces.includes(namespaceName)
      );

      if (updatedNamespaceFilter.length !== namespaceFilter.length) {
        setNamespaceFilter(updatedNamespaceFilter);
      }
    }
  }, [clusterFilter, clusters]); // Only watch clusterFilter changes

  const clearAllFilters = () => {
    setRegionFilter([]);
    setClusterFilter([]);
    setNamespaceFilter([]);
    setLabelFilter([]);
    setSeverityFilter([]);
    setGroupFilter(['Cluster', 'Namespace']); // Reset to default with both groups selected
    setComponentFilter([]);
    setTriggeredFromDate?.('');
    setTriggeredFromTime?.('');
    setTriggeredToDate?.('');
    setTriggeredToTime?.('');
  };

  // Get available components based on selected groups
  const getAvailableComponents = (): AlertComponent[] => {
    if (groupFilter.length === 0) return allComponents;
    let components: AlertComponent[] = [];
    if (groupFilter.includes('Cluster')) {
      components = [...components, ...clusterComponents];
    }
    if (groupFilter.includes('Namespace')) {
      components = [...components, ...namespaceComponents];
    }
    return Array.from(new Set(components));
  };

  const availableComponents = getAvailableComponents();

  // Filtered options based on search and cascading filters
  const filteredRegions = regions.filter(r => r.toLowerCase().includes(regionSearchValue.toLowerCase()));

  // Cascade filter: If regions are selected, only show clusters from those regions
  const filteredClusters = React.useMemo(() => {
    let availableClusters = clusterNames;

    // If regions are selected, filter clusters to only those in selected regions
    if (regionFilter.length > 0) {
      const clusterNamesInSelectedRegions = clusters
        .filter(cluster => regionFilter.includes(cluster.region))
        .map(cluster => cluster.name);
      availableClusters = clusterNames.filter(name => clusterNamesInSelectedRegions.includes(name));
    }

    // Apply search filter
    return availableClusters.filter(c => c.toLowerCase().includes(clusterSearchValue.toLowerCase()));
  }, [clusterNames, clusters, regionFilter, clusterSearchValue]);

  // Cascade filter: If clusters are selected, only show namespaces from those clusters
  const filteredNamespaces = React.useMemo(() => {
    let availableNamespaces = namespaces;

    // If clusters are selected, filter namespaces to only those in selected clusters
    if (clusterFilter.length > 0) {
      const namespacesInSelectedClusters = clusters
        .filter(cluster => clusterFilter.includes(cluster.name))
        .flatMap(cluster => cluster.namespaces);
      const uniqueNamespaces = Array.from(new Set(namespacesInSelectedClusters));
      availableNamespaces = namespaces.filter(name => uniqueNamespaces.includes(name));
    }

    // Apply search filter
    return availableNamespaces.filter(n => n.toLowerCase().includes(namespaceSearchValue.toLowerCase()));
  }, [namespaces, clusters, clusterFilter, namespaceSearchValue]);

  const filteredLabels = availableLabels.filter(l => l.toLowerCase().includes(labelSearchValue.toLowerCase()));
  const filteredComponents = availableComponents.filter(c => c.toLowerCase().includes(componentSearchValue.toLowerCase()));

  const filterTitle = filterContext === 'alerts' ? 'Filter fleet alerts' : 'Filter fleet';

  return (
    <Card>
      <CardHeader>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem><CardTitle><FilterIcon /> {filterTitle}</CardTitle></FlexItem>
          <FlexItem>
            <Button variant="plain" aria-label="Close filters" onClick={onClose}>
              <TimesIcon />
            </Button>
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack hasGutter>
          {/* Region Dropdown */}
          <StackItem>
            <Content component="small" className="pf-v6-u-mb-sm"><strong>Region</strong></Content>
            <Select
              role="menu"
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  isExpanded={isRegionOpen}
                  style={{ width: '100%' }}
                  icon={<MapMarkerAltIcon />}
                >
                  {regionFilter.length > 0 ? `${regionFilter.length} selected` : 'Select regions'}
                </MenuToggle>
              )}
              isOpen={isRegionOpen}
              onOpenChange={setIsRegionOpen}
              onSelect={(_, value) => {
                const val = value as string;
                if (regionFilter.includes(val)) {
                  setRegionFilter(regionFilter.filter(r => r !== val));
                } else {
                  setRegionFilter([...regionFilter, val]);
                }
              }}
            >
              <div style={{ padding: '8px' }}>
                <SearchInput
                  placeholder="Search regions..."
                  value={regionSearchValue}
                  onChange={(_, value) => setRegionSearchValue(value)}
                  onClear={() => setRegionSearchValue('')}
                />
              </div>
              <Divider />
              <SelectList>
                {filteredRegions.map(region => (
                  <SelectOption key={region} value={region} hasCheckbox isSelected={regionFilter.includes(region)}>
                    {region} {regionCounts[region] !== undefined && `(${regionCounts[region]})`}
                  </SelectOption>
                ))}
                {filteredRegions.length === 0 && (
                  <SelectOption isDisabled>No regions found</SelectOption>
                )}
              </SelectList>
            </Select>
          </StackItem>

          <Divider />

          {/* Cluster Dropdown */}
          <StackItem>
            <Content component="small" className="pf-v6-u-mb-sm"><strong>Cluster</strong></Content>
            <Select
              role="menu"
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsClusterOpen(!isClusterOpen)}
                  isExpanded={isClusterOpen}
                  style={{ width: '100%' }}
                  icon={<ClusterIcon />}
                >
                  {clusterFilter.length > 0 ? `${clusterFilter.length} selected` : 'Select clusters'}
                </MenuToggle>
              )}
              isOpen={isClusterOpen}
              onOpenChange={setIsClusterOpen}
              onSelect={(_, value) => {
                const val = value as string;
                if (clusterFilter.includes(val)) {
                  setClusterFilter(clusterFilter.filter(c => c !== val));
                } else {
                  setClusterFilter([...clusterFilter, val]);
                }
              }}
            >
              <div style={{ padding: '8px' }}>
                <SearchInput
                  placeholder="Search clusters..."
                  value={clusterSearchValue}
                  onChange={(_, value) => setClusterSearchValue(value)}
                  onClear={() => setClusterSearchValue('')}
                />
              </div>
              <Divider />
              <SelectList style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredClusters.map(cluster => (
                  <SelectOption key={cluster} value={cluster} hasCheckbox isSelected={clusterFilter.includes(cluster)}>
                    {cluster} {clusterCounts[cluster] !== undefined && `(${clusterCounts[cluster]})`}
                  </SelectOption>
                ))}
                {filteredClusters.length === 0 && (
                  <SelectOption isDisabled>No clusters found</SelectOption>
                )}
              </SelectList>
            </Select>
            <div style={{
              fontSize: '12px',
              color: 'var(--pf-t--global--text--color--subtle)',
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              {regionFilter.length > 0 ? 'Filtered by region' : 'Showing all clusters'}
            </div>
          </StackItem>

          <Divider />

          {/* Namespace Dropdown */}
          <StackItem>
            <Content component="small" className="pf-v6-u-mb-sm"><strong>Namespace</strong></Content>
            <Select
              role="menu"
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsNamespaceOpen(!isNamespaceOpen)}
                  isExpanded={isNamespaceOpen}
                  style={{ width: '100%' }}
                  icon={<CubesIcon />}
                >
                  {namespaceFilter.length > 0 ? `${namespaceFilter.length} selected` : 'Select namespaces'}
                </MenuToggle>
              )}
              isOpen={isNamespaceOpen}
              onOpenChange={setIsNamespaceOpen}
              onSelect={(_, value) => {
                const val = value as string;
                if (namespaceFilter.includes(val)) {
                  setNamespaceFilter(namespaceFilter.filter(n => n !== val));
                } else {
                  setNamespaceFilter([...namespaceFilter, val]);
                }
              }}
            >
              <div style={{ padding: '8px' }}>
                <SearchInput
                  placeholder="Search namespaces..."
                  value={namespaceSearchValue}
                  onChange={(_, value) => setNamespaceSearchValue(value)}
                  onClear={() => setNamespaceSearchValue('')}
                />
              </div>
              <Divider />
              <SelectList style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredNamespaces.map(ns => (
                  <SelectOption key={ns} value={ns} hasCheckbox isSelected={namespaceFilter.includes(ns)}>
                    {ns} {namespaceCounts[ns] !== undefined && `(${namespaceCounts[ns]})`}
                  </SelectOption>
                ))}
                {filteredNamespaces.length === 0 && (
                  <SelectOption isDisabled>No namespaces found</SelectOption>
                )}
              </SelectList>
            </Select>
            <div style={{
              fontSize: '12px',
              color: 'var(--pf-t--global--text--color--subtle)',
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              {clusterFilter.length > 0 ? 'Filtered by cluster' : 'Showing all namespaces'}
            </div>
          </StackItem>

          <Divider />

          {/* Labels Dropdown */}
          <StackItem>
            <Content component="small" className="pf-v6-u-mb-sm"><strong>Labels</strong></Content>
            <Select
              role="menu"
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsLabelOpen(!isLabelOpen)}
                  isExpanded={isLabelOpen}
                  style={{ width: '100%' }}
                  icon={<FilterIcon />}
                >
                  {labelFilter.length > 0 ? `${labelFilter.length} selected` : 'Select labels'}
                </MenuToggle>
              )}
              isOpen={isLabelOpen}
              onOpenChange={setIsLabelOpen}
              onSelect={(_, value) => {
                const val = value as string;
                if (labelFilter.includes(val)) {
                  setLabelFilter(labelFilter.filter(l => l !== val));
                } else {
                  setLabelFilter([...labelFilter, val]);
                }
              }}
            >
              <div style={{ padding: '8px' }}>
                <SearchInput
                  placeholder="Search labels..."
                  value={labelSearchValue}
                  onChange={(_, value) => setLabelSearchValue(value)}
                  onClear={() => setLabelSearchValue('')}
                />
              </div>
              <Divider />
              <SelectList style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredLabels.map(label => (
                  <SelectOption key={label} value={label} hasCheckbox isSelected={labelFilter.includes(label)}>
                    {label}
                  </SelectOption>
                ))}
                {filteredLabels.length === 0 && (
                  <SelectOption isDisabled>No labels found</SelectOption>
                )}
              </SelectList>
            </Select>
          </StackItem>

          <Divider />

          {/* Severity with colored labels */}
          <StackItem>
            <Content component="small" className="pf-v6-u-mb-sm"><strong>Severity</strong></Content>
            <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
              {allSeverities.map(sev => (
                <FlexItem key={sev}>
                  <Label
                    color={getSeverityLabelColor(sev)}
                    icon={getSeverityIcon(sev)}
                    onClick={() => {
                      if (severityFilter.includes(sev)) {
                        setSeverityFilter(severityFilter.filter(s => s !== sev));
                      } else {
                        setSeverityFilter([...severityFilter, sev]);
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      opacity: severityFilter.length === 0 || severityFilter.includes(sev) ? 1 : 0.5,
                      border: severityFilter.includes(sev) ? '2px solid var(--pf-t--global--border--color--default)' : '2px solid transparent'
                    }}
                  >
                    {sev}
                  </Label>
                </FlexItem>
              ))}
            </Flex>
            {severityFilter.length > 0 && (
              <Button variant="link" size="sm" onClick={() => setSeverityFilter([])} style={{ marginTop: '4px', padding: 0 }}>
                Clear severity
              </Button>
            )}
          </StackItem>

          <Divider />

          {/* Alert Scope Toggle Group */}
          <StackItem>
            <div className="pf-v6-u-mb-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: 'var(--pf-t--global--font--size--sm)', fontWeight: 700 }}>Alert scope</span>
              <Tooltip content="Indicates whether the alert affects the entire cluster or a specific namespace.">
                <HelpIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', cursor: 'help', fontSize: '12px' }} />
              </Tooltip>
            </div>
            <ToggleGroup isCompact>
              <ToggleGroupItem
                text="All"
                aria-label="All scopes"
                buttonId="alert-scope-all"
                isSelected={groupFilter.length === 2}
                onChange={(_, selected) => {
                  if (selected) {
                    setGroupFilter(['Cluster', 'Namespace']);
                  }
                }}
              />
              <ToggleGroupItem
                text="Cluster"
                aria-label="Cluster scope"
                buttonId="alert-scope-cluster"
                isSelected={groupFilter.length === 1 && groupFilter.includes('Cluster')}
                onChange={(_, selected) => {
                  if (selected) {
                    setGroupFilter(['Cluster']);
                  }
                }}
              />
              <ToggleGroupItem
                text="Namespace"
                aria-label="Namespace scope"
                buttonId="alert-scope-namespace"
                isSelected={groupFilter.length === 1 && groupFilter.includes('Namespace')}
                onChange={(_, selected) => {
                  if (selected) {
                    setGroupFilter(['Namespace']);
                  }
                }}
              />
            </ToggleGroup>
          </StackItem>

          <Divider />

          {/* Component Dropdown (based on selected group) */}
          <StackItem>
            <div className="pf-v6-u-mb-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: 'var(--pf-t--global--font--size--sm)', fontWeight: 700 }}>
                {groupFilter.length === 2 ? 'Affected component' : groupFilter.length > 0 ? `Affected component (in: ${groupFilter.map(g => `Alert scope: ${g}`).join(', ')})` : 'Affected component'}
              </span>
              <Tooltip content="The specific services, operators, or nodes affected by this alert.">
                <HelpIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', cursor: 'help', fontSize: '12px' }} />
              </Tooltip>
            </div>
            <Select
              role="menu"
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsComponentOpen(!isComponentOpen)}
                  isExpanded={isComponentOpen}
                  style={{ width: '100%' }}
                  icon={<CogIcon />}
                >
                  {componentFilter.length > 0 ? `${componentFilter.length} selected` : 'Select components'}
                </MenuToggle>
              )}
              isOpen={isComponentOpen}
              onOpenChange={setIsComponentOpen}
              onSelect={(_, value) => {
                const val = value as AlertComponent;
                if (componentFilter.includes(val)) {
                  setComponentFilter(componentFilter.filter(c => c !== val));
                } else {
                  setComponentFilter([...componentFilter, val]);
                }
              }}
            >
              <div style={{ padding: '8px' }}>
                <SearchInput
                  placeholder="Search components..."
                  value={componentSearchValue}
                  onChange={(_, value) => setComponentSearchValue(value)}
                  onClear={() => setComponentSearchValue('')}
                />
              </div>
              <Divider />
              <SelectList>
                {filteredComponents.map(comp => (
                  <SelectOption key={comp} value={comp} hasCheckbox isSelected={componentFilter.includes(comp)}>
                    {comp}
                  </SelectOption>
                ))}
                {filteredComponents.length === 0 && (
                  <SelectOption isDisabled>No components found</SelectOption>
                )}
              </SelectList>
            </Select>
            {/* Helper text for component filter */}
            <div style={{
              fontSize: '12px',
              color: 'var(--pf-t--global--text--color--subtle)',
              marginTop: '4px'
            }}>
              {componentFilter.length === 0 ? 'Showing all components' : `Showing ${componentFilter.length} selected component${componentFilter.length !== 1 ? 's' : ''}`}
            </div>
          </StackItem>

          {/* Alert-specific filters (shown when in firing alerts scope) */}
          {showAlertFilters && (
            <>
              <Divider />
              <StackItem>
                <Content component="small" style={{ fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                  Alert Filters
                </Content>
              </StackItem>

              {/* State Filter */}
              <StackItem>
                <Select
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsStateOpen(!isStateOpen)}
                      isExpanded={isStateOpen}
                      isFullWidth
                    >
                      {stateFilter.length === 0 ? 'State' : `${stateFilter.length} selected`}
                    </MenuToggle>
                  )}
                  onSelect={(_, value) => {
                    const val = value as string;
                    if (setStateFilter) {
                      if (stateFilter.includes(val)) {
                        setStateFilter(stateFilter.filter(s => s !== val));
                      } else {
                        setStateFilter([...stateFilter, val]);
                      }
                    }
                  }}
                  isOpen={isStateOpen}
                  onOpenChange={setIsStateOpen}
                  selected={stateFilter}
                >
                  <SelectList>
                    {allStates.map(state => (
                      <SelectOption
                        key={state}
                        value={state}
                        hasCheckbox
                        isSelected={stateFilter.includes(state)}
                      >
                        {state.charAt(0).toUpperCase() + state.slice(1)} ({stateCounts[state] || 0})
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </StackItem>

              {/* Source Filter */}
              <StackItem>
                <Select
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsSourceOpen(!isSourceOpen)}
                      isExpanded={isSourceOpen}
                      isFullWidth
                    >
                      {sourceFilter.length === 0 ? 'Source' : `${sourceFilter.length} selected`}
                    </MenuToggle>
                  )}
                  onSelect={(_, value) => {
                    const val = value as string;
                    if (setSourceFilter) {
                      if (sourceFilter.includes(val)) {
                        setSourceFilter(sourceFilter.filter(s => s !== val));
                      } else {
                        setSourceFilter([...sourceFilter, val]);
                      }
                    }
                  }}
                  isOpen={isSourceOpen}
                  onOpenChange={setIsSourceOpen}
                  selected={sourceFilter}
                >
                  <SelectList>
                    {allSources.map(source => (
                      <SelectOption
                        key={source}
                        value={source}
                        hasCheckbox
                        isSelected={sourceFilter.includes(source)}
                      >
                        {source} ({sourceCounts[source] || 0})
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </StackItem>
            </>
          )}

          {hasActiveFilters && (
            <>
              <Divider />
              <StackItem>
                <Button variant="link" onClick={clearAllFilters} icon={<TimesIcon />}>
                  Clear all filters
                </Button>
              </StackItem>
            </>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};
