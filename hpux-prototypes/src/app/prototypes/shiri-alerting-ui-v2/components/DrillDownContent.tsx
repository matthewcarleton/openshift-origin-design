import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Flex,
  FlexItem,
  Title,
  Content,
  Stack,
  StackItem,
  Divider,
  Button,
  Label,
  LabelGroup,
  Tabs,
  Tab,
  TabTitleText,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  EmptyState,
  EmptyStateBody,
  SearchInput,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
  Dropdown,
  DropdownList,
  DropdownItem,
  DatePicker,
  TimePicker,
  Badge,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Switch,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Icon,
  Pagination,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCheck,
  DataListItemCells,
  DataListCell,
  DataListControl,
  CodeBlock,
  CodeBlockCode,
  ToggleGroup,
  ToggleGroupItem,
  Alert as PfAlert,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ExpandableRowContent,
} from '@patternfly/react-table';
import {
  Chart,
  ChartArea,
  ChartGroup,
  ChartVoronoiContainer,
  ChartAxis,
  ChartScatter,
} from '@patternfly/react-charts/victory';
import {
  FilterIcon,
  TimesIcon,
  CheckIcon,
  EllipsisVIcon,
  ListIcon,
  WrenchIcon,
  ChartLineIcon,
  PortIcon,
  ExternalLinkAltIcon,
  SearchPlusIcon,
  SearchMinusIcon,
  UndoIcon,
  BookmarkIcon,
  ColumnsIcon,
  GripVerticalIcon,
  EditIcon,
  TrashIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  CogIcon,
} from '@patternfly/react-icons';
import type {
  AlertSeverity,
  AlertGroup,
  AlertComponent,
  AlertData,
  ClusterData,
  SavedFilter,
  ColumnConfig,
  SortConfig,
} from '../data/types';
import {
  getSeverityLabelColor,
  getStatusLabelColor,
  getSeverityIcon,
} from '../data/utils';

const MAX_VISIBLE_COLUMNS = 8;

export interface DrillDownContentProps {
  selectedCluster: ClusterData | null;
  // Drawer state
  isDrawerExpanded: boolean;
  setIsDrawerExpanded: (value: boolean) => void;
  selectedAlertDetail: AlertData | null;
  setSelectedAlertDetail: (value: AlertData | null) => void;
  setAlertDetailDrawerTab: (tab: number) => void;
  // Drill-down filter state
  drillDownFilterOpen: boolean;
  setDrillDownFilterOpen: (value: boolean) => void;
  drillDownSeverityFilter: AlertSeverity[];
  setDrillDownSeverityFilter: (value: AlertSeverity[]) => void;
  drillDownGroupFilter: AlertGroup[];
  setDrillDownGroupFilter: (value: AlertGroup[]) => void;
  drillDownComponentFilter: AlertComponent[];
  setDrillDownComponentFilter: (value: AlertComponent[]) => void;
  isDrillDownComponentOpen: boolean;
  setIsDrillDownComponentOpen: (value: boolean) => void;
  drillDownStateFilter: string[];
  setDrillDownStateFilter: (value: string[]) => void;
  drillDownSourceFilter: string[];
  setDrillDownSourceFilter: (value: string[]) => void;
  drillDownTriggeredFrom: string;
  setDrillDownTriggeredFrom: (value: string) => void;
  drillDownTriggeredTo: string;
  setDrillDownTriggeredTo: (value: string) => void;
  drillDownSearchValue: string;
  setDrillDownSearchValue: (value: string) => void;
  hasDrillDownActiveFilters: boolean;
  clearDrillDownFilters: () => void;
  // Saved filters
  drillDownSavedFilters: SavedFilter[];
  setDrillDownSavedFilters: (value: SavedFilter[] | ((prev: SavedFilter[]) => SavedFilter[])) => void;
  selectedDrillDownSavedFilter: SavedFilter | null;
  setSelectedDrillDownSavedFilter: (value: SavedFilter | null) => void;
  isDrillDownSavedFiltersDropdownOpen: boolean;
  setIsDrillDownSavedFiltersDropdownOpen: (value: boolean) => void;
  isDrillDownSaveFilterModalOpen: boolean;
  setIsDrillDownSaveFilterModalOpen: (value: boolean) => void;
  drillDownNewFilterName: string;
  setDrillDownNewFilterName: (value: string) => void;
  isDrillDownManageSavedFiltersModalOpen: boolean;
  setIsDrillDownManageSavedFiltersModalOpen: (value: boolean) => void;
  drillDownEditingFilterId: string | null;
  setDrillDownEditingFilterId: (value: string | null) => void;
  drillDownEditingFilterName: string;
  setDrillDownEditingFilterName: (value: string) => void;
  // Table state
  drillDownFilteredAlerts: AlertData[];
  aggregatedAlerts: Array<{ key: string; alertName: string; severity: AlertSeverity; count: number; alerts: AlertData[] }>;
  isAggregated: boolean;
  setIsAggregated: (value: boolean) => void;
  drillDownPage: number;
  setDrillDownPage: (value: number) => void;
  drillDownPerPage: number;
  setDrillDownPerPage: (value: number) => void;
  drillDownSortConfigs: SortConfig[];
  handleDrillDownSort: (column: SortConfig['column']) => void;
  expandedAlertRows: string[];
  setExpandedAlertRows: (value: string[] | ((prev: string[]) => string[])) => void;
  // Column management
  columns: ColumnConfig[];
  defaultColumns: ColumnConfig[];
  tempColumns: ColumnConfig[];
  setTempColumns: (value: ColumnConfig[] | ((prev: ColumnConfig[]) => ColumnConfig[])) => void;
  setColumns: (value: ColumnConfig[]) => void;
  isManageColumnsModalOpen: boolean;
  setIsManageColumnsModalOpen: (value: boolean) => void;
  openManageColumnsModal: () => void;
  handleTempColumnToggle: (key: string) => void;
  handleSelectAllColumns: () => void;
  handleDeselectAllColumns: () => void;
  handleRestoreDefaultColumns: () => void;
  handleSaveColumns: () => void;
  addToast: (title: string, variant: 'success' | 'danger' | 'warning' | 'info', description?: string) => void;
}

export const DrillDownContent: React.FunctionComponent<DrillDownContentProps> = (props) => {
  const {
    selectedCluster,
    isDrawerExpanded,
    setIsDrawerExpanded,
    selectedAlertDetail,
    setSelectedAlertDetail,
    setAlertDetailDrawerTab,
    drillDownFilterOpen,
    setDrillDownFilterOpen,
    drillDownSeverityFilter,
    setDrillDownSeverityFilter,
    drillDownGroupFilter,
    setDrillDownGroupFilter,
    drillDownComponentFilter,
    setDrillDownComponentFilter,
    isDrillDownComponentOpen,
    setIsDrillDownComponentOpen,
    drillDownStateFilter,
    setDrillDownStateFilter,
    drillDownSourceFilter,
    setDrillDownSourceFilter,
    drillDownTriggeredFrom,
    setDrillDownTriggeredFrom,
    drillDownTriggeredTo,
    setDrillDownTriggeredTo,
    drillDownSearchValue,
    setDrillDownSearchValue,
    hasDrillDownActiveFilters,
    clearDrillDownFilters,
    drillDownSavedFilters,
    setDrillDownSavedFilters,
    selectedDrillDownSavedFilter,
    setSelectedDrillDownSavedFilter,
    isDrillDownSavedFiltersDropdownOpen,
    setIsDrillDownSavedFiltersDropdownOpen,
    isDrillDownSaveFilterModalOpen,
    setIsDrillDownSaveFilterModalOpen,
    drillDownNewFilterName,
    setDrillDownNewFilterName,
    isDrillDownManageSavedFiltersModalOpen,
    setIsDrillDownManageSavedFiltersModalOpen,
    drillDownEditingFilterId,
    setDrillDownEditingFilterId,
    drillDownEditingFilterName,
    setDrillDownEditingFilterName,
    drillDownFilteredAlerts,
    aggregatedAlerts,
    isAggregated,
    setIsAggregated,
    drillDownPage,
    setDrillDownPage,
    drillDownPerPage,
    setDrillDownPerPage,
    drillDownSortConfigs,
    handleDrillDownSort,
    expandedAlertRows,
    setExpandedAlertRows,
    columns,
    defaultColumns,
    tempColumns,
    setTempColumns,
    setColumns,
    isManageColumnsModalOpen,
    setIsManageColumnsModalOpen,
    openManageColumnsModal,
    handleTempColumnToggle,
    handleSelectAllColumns,
    handleDeselectAllColumns,
    handleRestoreDefaultColumns,
    handleSaveColumns,
    addToast,
  } = props;

  if (!selectedCluster) return null;

  return (
    <>
      {/* Main Content */}
      <Drawer isExpanded={isDrawerExpanded} position="end" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <DrawerContent
          panelContent={
            selectedAlertDetail && (
              <DrawerPanelContent
                widths={{ default: 'width_50' }}
                style={{
                  minWidth: '500px',
                  backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                  boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.16)',
                  height: '100%',
                }}
              >
                <DrawerHead style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Title headingLevel="h2" size="lg">{selectedAlertDetail.alertName}</Title>
                    </FlexItem>
                    <FlexItem>
                      <DrawerActions>
                        <DrawerCloseButton onClick={() => {
                          setIsDrawerExpanded(false);
                          setSelectedAlertDetail(null);
                          setAlertDetailDrawerTab(0);
                        }} />
                      </DrawerActions>
                    </FlexItem>
                  </Flex>
                </DrawerHead>
                <DrawerPanelBody style={{ flex: 1, overflow: 'auto' }}>
                  <Tabs defaultActiveKey={0}>
                    <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
                      <Stack hasGutter style={{ padding: '16px 0' }}>
                        <StackItem>
                          <DescriptionList isHorizontal isCompact>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Name</DescriptionListTerm>
                              <DescriptionListDescription><strong>{selectedAlertDetail.alertName}</strong></DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Description</DescriptionListTerm>
                              <DescriptionListDescription>{selectedAlertDetail.description || selectedAlertDetail.summary}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Source</DescriptionListTerm>
                              <DescriptionListDescription>{selectedAlertDetail.source}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Group</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Label isCompact color="blue">{selectedAlertDetail.group}</Label>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Affected component</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Label isCompact variant="outline">{selectedAlertDetail.component}</Label>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Labels</DescriptionListTerm>
                              <DescriptionListDescription>
                                <LabelGroup>
                                  {Object.entries(selectedAlertDetail.labels).map(([k, v]) => (
                                    <Label key={k} isCompact variant="outline">{k}={v}</Label>
                                  ))}
                                </LabelGroup>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Severity</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Label color={getSeverityLabelColor(selectedAlertDetail.severity)} icon={getSeverityIcon(selectedAlertDetail.severity)}>{selectedAlertDetail.severity}</Label>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>State</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  <FlexItem>
                                    <Label color={getStatusLabelColor(selectedAlertDetail.status)} variant="outline">{selectedAlertDetail.status}</Label>
                                  </FlexItem>
                                  {selectedAlertDetail.status === 'firing' && (
                                    <FlexItem>
                                      <Content component="small" className="pf-v6-u-color-200">
                                        Firing since {selectedAlertDetail.lastFired}
                                      </Content>
                                    </FlexItem>
                                  )}
                                </Flex>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Namespace</DescriptionListTerm>
                              <DescriptionListDescription>{selectedAlertDetail.namespace}</DescriptionListDescription>
                            </DescriptionListGroup>
                            {selectedAlertDetail.resource && (
                              <DescriptionListGroup>
                                <DescriptionListTerm>Resource</DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end">
                                    {selectedAlertDetail.resource}
                                  </Button>
                                </DescriptionListDescription>
                              </DescriptionListGroup>
                            )}
                            <DescriptionListGroup>
                              <DescriptionListTerm>Alert Rule</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end">
                                  View alert rule
                                </Button>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Runbook URL</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end">
                                  View runbook
                                </Button>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </StackItem>
                        <Divider />
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Actions</strong></Content>
                          <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                            <FlexItem>
                              <Button variant="secondary" icon={<ListIcon />} onClick={() => addToast('Opening logs...', 'info')}>
                                View logs
                              </Button>
                            </FlexItem>
                            <FlexItem>
                              <Button variant="secondary" icon={<WrenchIcon />} onClick={() => addToast('Opening troubleshoot...', 'info')}>
                                Troubleshoot
                              </Button>
                            </FlexItem>
                            <FlexItem>
                              <Button variant="secondary" icon={<ChartLineIcon />} onClick={() => addToast('Opening metrics...', 'info')}>
                                See metrics
                              </Button>
                            </FlexItem>
                            <FlexItem>
                              <Button variant="secondary" icon={<PortIcon />} onClick={() => addToast('Opening related incidents...', 'info')}>
                                See related incidents
                              </Button>
                            </FlexItem>
                          </Flex>
                        </StackItem>
                      </Stack>
                    </Tab>
                    <Tab eventKey={1} title={<TabTitleText>Alert Timeline</TabTitleText>}>
                      <Stack hasGutter style={{ padding: '16px 0' }}>
                        <StackItem>
                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem>
                              <ToggleGroup>
                                <ToggleGroupItem text="30s" aria-label="30 seconds" />
                                <ToggleGroupItem text="60s" aria-label="60 seconds" isSelected />
                                <ToggleGroupItem text="90s" aria-label="90 seconds" />
                                <ToggleGroupItem text="Day" aria-label="Day" />
                                <ToggleGroupItem text="Week" aria-label="Week" />
                              </ToggleGroup>
                            </FlexItem>
                            <FlexItem>
                              <Flex gap={{ default: 'gapSm' }}>
                                <FlexItem>
                                  <Tooltip content="Zoom in">
                                    <Button variant="plain" icon={<SearchPlusIcon />} aria-label="Zoom in" />
                                  </Tooltip>
                                </FlexItem>
                                <FlexItem>
                                  <Tooltip content="Zoom out">
                                    <Button variant="plain" icon={<SearchMinusIcon />} aria-label="Zoom out" />
                                  </Tooltip>
                                </FlexItem>
                                <FlexItem>
                                  <Tooltip content="Reset zoom">
                                    <Button variant="plain" icon={<UndoIcon />} aria-label="Reset zoom" />
                                  </Tooltip>
                                </FlexItem>
                              </Flex>
                            </FlexItem>
                          </Flex>
                        </StackItem>
                        <StackItem>
                          <div style={{ height: '250px', width: '100%' }}>
                            <Chart
                              ariaDesc="Alert timeline showing firing periods"
                              ariaTitle="Alert Timeline"
                              height={250}
                              padding={{ bottom: 50, left: 50, right: 20, top: 20 }}
                              containerComponent={
                                <ChartVoronoiContainer
                                  labels={({ datum }) => `${datum.name}: ${datum.y}`}
                                  constrainToVisibleArea
                                />
                              }
                            >
                              <ChartAxis
                                tickValues={[0, 10, 20, 30, 40, 50, 60]}
                                tickFormat={(t) => `${t}s ago`}
                              />
                              <ChartAxis
                                dependentAxis
                                tickFormat={(t) => t === 1 ? 'Firing' : t === 0 ? 'Resolved' : ''}
                                tickValues={[0, 1]}
                              />
                              <ChartGroup>
                                <ChartArea
                                  data={[
                                    { x: 0, y: 1, name: 'Status' },
                                    { x: 5, y: 1, name: 'Status' },
                                    { x: 10, y: 1, name: 'Status' },
                                    { x: 15, y: 0, name: 'Status' },
                                    { x: 20, y: 0, name: 'Status' },
                                    { x: 25, y: 1, name: 'Status' },
                                    { x: 30, y: 1, name: 'Status' },
                                    { x: 35, y: 1, name: 'Status' },
                                    { x: 40, y: 1, name: 'Status' },
                                    { x: 45, y: 1, name: 'Status' },
                                    { x: 50, y: 1, name: 'Status' },
                                    { x: 55, y: 1, name: 'Status' },
                                    { x: 60, y: 1, name: 'Status' },
                                  ]}
                                  interpolation="stepAfter"
                                  style={{
                                    data: {
                                      fill: 'var(--pf-t--chart--color--red--100)',
                                      fillOpacity: 0.3,
                                      stroke: 'var(--pf-t--chart--color--red--100)',
                                      strokeWidth: 2,
                                    }
                                  }}
                                />
                                <ChartScatter
                                  data={[
                                    { x: 0, y: 1, name: 'Alert fired' },
                                    { x: 15, y: 0, name: 'Alert resolved' },
                                    { x: 25, y: 1, name: 'Alert fired' },
                                  ]}
                                  style={{
                                    data: { fill: 'var(--pf-t--chart--color--red--100)' }
                                  }}
                                />
                              </ChartGroup>
                            </Chart>
                          </div>
                        </StackItem>
                        <StackItem>
                          <Content component="small" className="pf-v6-u-color-200">
                            Timeline shows alert firing and resolution events. Use the time range selector to adjust the view window.
                          </Content>
                        </StackItem>
                      </Stack>
                    </Tab>
                    <Tab eventKey={2} title={<TabTitleText>YAML</TabTitleText>}>
                      <CodeBlock style={{ marginTop: '16px' }}>
                        <CodeBlockCode>
{`apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: ${selectedAlertDetail.alertName.toLowerCase()}
  namespace: ${selectedAlertDetail.namespace}
spec:
  groups:
  - name: alerts
    rules:
    - alert: ${selectedAlertDetail.alertName}
      expr: # alert expression
      for: 5m
      labels:
        severity: ${selectedAlertDetail.severity.toLowerCase()}
      annotations:
        summary: "${selectedAlertDetail.summary}"`}
                        </CodeBlockCode>
                      </CodeBlock>
                    </Tab>
                  </Tabs>
                </DrawerPanelBody>
              </DrawerPanelContent>
            )
          }
        >
          <DrawerContentBody style={{ overflow: 'auto', flex: 1, padding: '0 24px 24px 24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', width: '100%' }}>
              {/* Filter Sidebar */}
              {drillDownFilterOpen && (
                <div style={{ width: '280px', minWidth: '280px', maxWidth: '280px', flexShrink: 0 }}>
                  <Card>
                    <CardHeader>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem><CardTitle><FilterIcon /> Filters</CardTitle></FlexItem>
                        <FlexItem>
                          <Button variant="plain" onClick={() => setDrillDownFilterOpen(false)}><TimesIcon /></Button>
                        </FlexItem>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stack hasGutter>
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Severity</strong></Content>
                          <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                            {(['Critical', 'Warning', 'Info'] as AlertSeverity[]).map(sev => (
                              <FlexItem key={sev}>
                                <Label
                                  color={getSeverityLabelColor(sev)}
                                  icon={getSeverityIcon(sev)}
                                  onClick={() => {
                                    if (drillDownSeverityFilter.includes(sev)) {
                                      setDrillDownSeverityFilter(drillDownSeverityFilter.filter(s => s !== sev));
                                    } else {
                                      setDrillDownSeverityFilter([...drillDownSeverityFilter, sev]);
                                    }
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    opacity: drillDownSeverityFilter.length > 0 && !drillDownSeverityFilter.includes(sev) ? 0.5 : 1,
                                    outline: drillDownSeverityFilter.includes(sev) ? '2px solid var(--pf-t--global--border--color--clicked)' : 'none',
                                    outlineOffset: '1px'
                                  }}
                                >
                                  {sev}
                                </Label>
                              </FlexItem>
                            ))}
                          </Flex>
                        </StackItem>
                        <Divider />
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Group</strong></Content>
                          <Stack hasGutter>
                            {(['Cluster', 'Namespace'] as AlertGroup[]).map(grp => (
                              <StackItem key={grp}>
                                <Checkbox
                                  id={`dd-grp-${grp}`}
                                  label={grp}
                                  isChecked={drillDownGroupFilter.includes(grp)}
                                  onChange={(_, checked) => {
                                    if (checked) setDrillDownGroupFilter([...drillDownGroupFilter, grp]);
                                    else setDrillDownGroupFilter(drillDownGroupFilter.filter(g => g !== grp));
                                  }}
                                />
                              </StackItem>
                            ))}
                          </Stack>
                        </StackItem>
                        <Divider />
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm">
                            <strong>{drillDownGroupFilter.length > 0 ? `Affected component (in: ${drillDownGroupFilter.map(g => `Alert scope: ${g}`).join(', ')})` : 'Affected component'}</strong>
                          </Content>
                          <Select
                            role="menu"
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsDrillDownComponentOpen(!isDrillDownComponentOpen)}
                                isExpanded={isDrillDownComponentOpen}
                                style={{ width: '100%' }}
                              >
                                {drillDownComponentFilter.length === 0 ? 'All components' : `${drillDownComponentFilter.length} selected`}
                              </MenuToggle>
                            )}
                            onSelect={(_, value) => {
                              const comp = value as AlertComponent;
                              if (drillDownComponentFilter.includes(comp)) {
                                setDrillDownComponentFilter(drillDownComponentFilter.filter(c => c !== comp));
                              } else {
                                setDrillDownComponentFilter([...drillDownComponentFilter, comp]);
                              }
                            }}
                            isOpen={isDrillDownComponentOpen}
                            onOpenChange={setIsDrillDownComponentOpen}
                          >
                            <SelectList>
                              {(() => {
                                const clusterComponents: AlertComponent[] = ['kube-apiserver', 'etcd', 'Scheduler', 'Controller', 'Network'];
                                const namespaceComponents: AlertComponent[] = ['Workload', 'Pod', 'Storage', 'Quota', 'Network'];
                                let availableComponents: AlertComponent[] = [];
                                if (drillDownGroupFilter.length === 0) {
                                  availableComponents = ['kube-apiserver', 'Storage', 'Network', 'etcd', 'Scheduler', 'Controller', 'Workload', 'Pod', 'Quota'];
                                } else {
                                  if (drillDownGroupFilter.includes('Cluster')) {
                                    availableComponents = [...availableComponents, ...clusterComponents];
                                  }
                                  if (drillDownGroupFilter.includes('Namespace')) {
                                    availableComponents = [...availableComponents, ...namespaceComponents];
                                  }
                                  availableComponents = Array.from(new Set(availableComponents));
                                }
                                return availableComponents.map(comp => (
                                  <SelectOption
                                    key={comp}
                                    value={comp}
                                    hasCheckbox
                                    isSelected={drillDownComponentFilter.includes(comp)}
                                  >
                                    {comp}
                                  </SelectOption>
                                ));
                              })()}
                            </SelectList>
                          </Select>
                        </StackItem>
                        <Divider />
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>State</strong></Content>
                          <Stack hasGutter>
                            {['firing', 'pending', 'acknowledged'].map(state => (
                              <StackItem key={state}>
                                <Checkbox
                                  id={`dd-state-${state}`}
                                  label={state.charAt(0).toUpperCase() + state.slice(1)}
                                  isChecked={drillDownStateFilter.includes(state)}
                                  onChange={(_, checked) => {
                                    if (checked) setDrillDownStateFilter([...drillDownStateFilter, state]);
                                    else setDrillDownStateFilter(drillDownStateFilter.filter(s => s !== state));
                                  }}
                                />
                              </StackItem>
                            ))}
                          </Stack>
                        </StackItem>
                        <Divider />
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Source</strong></Content>
                          <Stack hasGutter>
                            {['Platform', 'User'].map(src => (
                              <StackItem key={src}>
                                <Checkbox
                                  id={`dd-src-${src}`}
                                  label={src}
                                  isChecked={drillDownSourceFilter.includes(src)}
                                  onChange={(_, checked) => {
                                    if (checked) setDrillDownSourceFilter([...drillDownSourceFilter, src]);
                                    else setDrillDownSourceFilter(drillDownSourceFilter.filter(s => s !== src));
                                  }}
                                />
                              </StackItem>
                            ))}
                          </Stack>
                        </StackItem>
                        <Divider />
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Triggered</strong></Content>
                          <Stack hasGutter>
                            <StackItem>
                              <Content component="small" className="pf-v6-u-mb-xs">From</Content>
                              <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                                <FlexItem>
                                  <DatePicker
                                    value={drillDownTriggeredFrom ? drillDownTriggeredFrom.split('T')[0] : ''}
                                    onChange={(_event, value) => {
                                      if (value) {
                                        const currentTime = drillDownTriggeredFrom ? drillDownTriggeredFrom.split('T')[1] || '00:00' : '00:00';
                                        setDrillDownTriggeredFrom(`${value}T${currentTime}`);
                                      } else {
                                        setDrillDownTriggeredFrom('');
                                      }
                                    }}
                                    placeholder="YYYY-MM-DD"
                                    aria-label="Start date"
                                    style={{ width: '100%' }}
                                  />
                                </FlexItem>
                                <FlexItem>
                                  <TimePicker
                                    time={drillDownTriggeredFrom ? drillDownTriggeredFrom.split('T')[1] || '' : ''}
                                    onChange={(_event, time) => {
                                      if (drillDownTriggeredFrom) {
                                        const currentDate = drillDownTriggeredFrom.split('T')[0];
                                        setDrillDownTriggeredFrom(`${currentDate}T${time}`);
                                      } else {
                                        const today = new Date().toISOString().split('T')[0];
                                        setDrillDownTriggeredFrom(`${today}T${time}`);
                                      }
                                    }}
                                    placeholder="HH:MM"
                                    aria-label="Start time"
                                    is24Hour
                                    style={{ width: '100%' }}
                                    menuAppendTo={() => document.body}
                                  />
                                </FlexItem>
                              </Flex>
                            </StackItem>
                            <StackItem>
                              <Content component="small" className="pf-v6-u-mb-xs">To</Content>
                              <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                                <FlexItem>
                                  <DatePicker
                                    value={drillDownTriggeredTo ? drillDownTriggeredTo.split('T')[0] : ''}
                                    onChange={(_event, value) => {
                                      if (value) {
                                        const currentTime = drillDownTriggeredTo ? drillDownTriggeredTo.split('T')[1] || '23:59' : '23:59';
                                        setDrillDownTriggeredTo(`${value}T${currentTime}`);
                                      } else {
                                        setDrillDownTriggeredTo('');
                                      }
                                    }}
                                    placeholder="YYYY-MM-DD"
                                    aria-label="End date"
                                    style={{ width: '100%' }}
                                  />
                                </FlexItem>
                                <FlexItem>
                                  <TimePicker
                                    time={drillDownTriggeredTo ? drillDownTriggeredTo.split('T')[1] || '' : ''}
                                    onChange={(_event, time) => {
                                      if (drillDownTriggeredTo) {
                                        const currentDate = drillDownTriggeredTo.split('T')[0];
                                        setDrillDownTriggeredTo(`${currentDate}T${time}`);
                                      } else {
                                        const today = new Date().toISOString().split('T')[0];
                                        setDrillDownTriggeredTo(`${today}T${time}`);
                                      }
                                    }}
                                    placeholder="HH:MM"
                                    aria-label="End time"
                                    is24Hour
                                    style={{ width: '100%' }}
                                    menuAppendTo={() => document.body}
                                  />
                                </FlexItem>
                              </Flex>
                            </StackItem>
                          </Stack>
                        </StackItem>
                        {hasDrillDownActiveFilters && (
                          <>
                            <Divider />
                            <StackItem>
                              <Button variant="link" onClick={clearDrillDownFilters}>Clear all filters</Button>
                            </StackItem>
                          </>
                        )}
                      </Stack>
                    </CardBody>
                  </Card>
                </div>
              )}

              {/* Main Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Stack hasGutter>
                  <StackItem>
                    <Card>
                      <CardHeader style={{ padding: '24px 24px 0 24px' }}>
                        <Toolbar style={{ padding: 0, margin: 0, paddingBottom: '24px', minHeight: 'auto' }}>
                          <ToolbarContent style={{ alignItems: 'center' }}>
                            <ToolbarItem>
                              <Dropdown
                                isOpen={isDrillDownSavedFiltersDropdownOpen}
                                onOpenChange={setIsDrillDownSavedFiltersDropdownOpen}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsDrillDownSavedFiltersDropdownOpen(!isDrillDownSavedFiltersDropdownOpen)}
                                    isExpanded={isDrillDownSavedFiltersDropdownOpen}
                                    icon={<BookmarkIcon />}
                                  >
                                    {selectedDrillDownSavedFilter ? selectedDrillDownSavedFilter.name : 'Saved filters'}
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  {drillDownSavedFilters.length === 0 ? (
                                    <DropdownItem isDisabled>No saved filters</DropdownItem>
                                  ) : (
                                    drillDownSavedFilters.map(filter => (
                                      <DropdownItem
                                        key={filter.id}
                                        onClick={() => {
                                          setSelectedDrillDownSavedFilter(filter);
                                          setDrillDownSeverityFilter(filter.filters.severity as AlertSeverity[]);
                                          setDrillDownGroupFilter(filter.filters.group as AlertGroup[]);
                                          setDrillDownComponentFilter(filter.filters.component as AlertComponent[]);
                                          setDrillDownSourceFilter(filter.filters.source || []);
                                          setIsDrillDownSavedFiltersDropdownOpen(false);
                                        }}
                                      >
                                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                                          <FlexItem>{filter.name}</FlexItem>
                                          {selectedDrillDownSavedFilter?.id === filter.id && (
                                            <FlexItem>
                                              <CheckIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default)' }} />
                                            </FlexItem>
                                          )}
                                        </Flex>
                                      </DropdownItem>
                                    ))
                                  )}
                                  <Divider />
                                  <DropdownItem
                                    onClick={() => {
                                      setIsDrillDownManageSavedFiltersModalOpen(true);
                                      setIsDrillDownSavedFiltersDropdownOpen(false);
                                    }}
                                  >
                                    <CogIcon /> Manage saved filters
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </ToolbarItem>
                            <ToolbarItem>
                              <Button
                                variant={drillDownFilterOpen ? 'secondary' : 'control'}
                                icon={<FilterIcon />}
                                onClick={() => setDrillDownFilterOpen(!drillDownFilterOpen)}
                              >
                                Filters {hasDrillDownActiveFilters && <Badge isRead style={{ marginLeft: '4px' }}>{drillDownSeverityFilter.length + drillDownGroupFilter.length + drillDownComponentFilter.length + drillDownSourceFilter.length + drillDownStateFilter.length + (drillDownTriggeredFrom ? 1 : 0) + (drillDownTriggeredTo ? 1 : 0)}</Badge>}
                              </Button>
                            </ToolbarItem>
                            <ToolbarItem>
                              <SearchInput
                                placeholder="Search alerts..."
                                value={drillDownSearchValue}
                                onChange={(_, value) => setDrillDownSearchValue(value)}
                                onClear={() => setDrillDownSearchValue('')}
                                style={{ width: '250px' }}
                              />
                            </ToolbarItem>
                            <ToolbarItem variant="separator" />
                            <ToolbarItem style={{ display: 'flex', alignItems: 'center' }}>
                              <Switch
                                id="aggregate-switch"
                                label="Aggregate by name and severity"
                                isChecked={isAggregated}
                                onChange={(_, checked) => setIsAggregated(checked)}
                              />
                            </ToolbarItem>
                            <ToolbarItem variant="separator" />
                            <ToolbarItem align={{ default: 'alignEnd' }}>
                              <Tooltip content="Manage columns">
                                <Button variant="plain" icon={<ColumnsIcon />} onClick={openManageColumnsModal} aria-label="Manage columns" />
                              </Tooltip>
                            </ToolbarItem>
                          </ToolbarContent>
                        </Toolbar>

                        {hasDrillDownActiveFilters && (
                          <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ padding: '12px 0 0' }}>
                            <FlexItem>
                              <LabelGroup categoryName="Active filters">
                                {drillDownSeverityFilter.map(s => (
                                  <Label key={s} color={getSeverityLabelColor(s)} onClose={() => setDrillDownSeverityFilter(drillDownSeverityFilter.filter(x => x !== s))}>{s}</Label>
                                ))}
                                {drillDownGroupFilter.map(g => (
                                  <Label key={g} color="blue" onClose={() => setDrillDownGroupFilter(drillDownGroupFilter.filter(x => x !== g))}>{g}</Label>
                                ))}
                                {drillDownComponentFilter.map(c => (
                                  <Label key={c} color="green" onClose={() => setDrillDownComponentFilter(drillDownComponentFilter.filter(x => x !== c))}>{c}</Label>
                                ))}
                                {drillDownStateFilter.map(st => (
                                  <Label key={st} color="purple" onClose={() => setDrillDownStateFilter(drillDownStateFilter.filter(x => x !== st))}>{st}</Label>
                                ))}
                                {drillDownSourceFilter.map(s => (
                                  <Label key={s} color="grey" onClose={() => setDrillDownSourceFilter(drillDownSourceFilter.filter(x => x !== s))}>{s}</Label>
                                ))}
                                {drillDownTriggeredFrom && (
                                  <Label key="from" color="teal" onClose={() => setDrillDownTriggeredFrom('')}>From: {drillDownTriggeredFrom}</Label>
                                )}
                                {drillDownTriggeredTo && (
                                  <Label key="to" color="teal" onClose={() => setDrillDownTriggeredTo('')}>To: {drillDownTriggeredTo}</Label>
                                )}
                              </LabelGroup>
                            </FlexItem>
                            <FlexItem>
                              <Flex gap={{ default: 'gapSm' }}>
                                <FlexItem>
                                  <Button variant="link" onClick={() => { clearDrillDownFilters(); setSelectedDrillDownSavedFilter(null); }}>
                                    Clear filters
                                  </Button>
                                </FlexItem>
                                <FlexItem>
                                  <Button variant="link" onClick={() => setDrillDownFilterOpen(true)}>
                                    Edit filters
                                  </Button>
                                </FlexItem>
                                {selectedDrillDownSavedFilter && (() => {
                                  const savedSeverity = selectedDrillDownSavedFilter.filters.severity || [];
                                  const savedGroup = selectedDrillDownSavedFilter.filters.group || [];
                                  const savedComponent = selectedDrillDownSavedFilter.filters.component || [];
                                  const savedSource = selectedDrillDownSavedFilter.filters.source || [];
                                  const savedSearchValue = selectedDrillDownSavedFilter.filters.searchValue || '';

                                  const hasChanges =
                                    JSON.stringify([...drillDownSeverityFilter].sort()) !== JSON.stringify([...savedSeverity].sort()) ||
                                    JSON.stringify([...drillDownGroupFilter].sort()) !== JSON.stringify([...savedGroup].sort()) ||
                                    JSON.stringify([...drillDownComponentFilter].sort()) !== JSON.stringify([...savedComponent].sort()) ||
                                    JSON.stringify([...drillDownSourceFilter].sort()) !== JSON.stringify([...savedSource].sort()) ||
                                    drillDownSearchValue !== savedSearchValue;

                                  return hasChanges ? (
                                    <FlexItem>
                                      <Button variant="link" onClick={() => {
                                        setDrillDownSavedFilters(drillDownSavedFilters.map(f =>
                                          f.id === selectedDrillDownSavedFilter.id
                                            ? {
                                                ...f,
                                                filters: {
                                                  severity: drillDownSeverityFilter,
                                                  group: drillDownGroupFilter,
                                                  component: drillDownComponentFilter,
                                                  source: drillDownSourceFilter,
                                                  searchValue: drillDownSearchValue
                                                }
                                              }
                                            : f
                                        ));
                                        setSelectedDrillDownSavedFilter({
                                          ...selectedDrillDownSavedFilter,
                                          filters: {
                                            severity: drillDownSeverityFilter,
                                            group: drillDownGroupFilter,
                                            component: drillDownComponentFilter,
                                            source: drillDownSourceFilter,
                                            searchValue: drillDownSearchValue
                                          }
                                        });
                                        addToast(`Filter "${selectedDrillDownSavedFilter.name}" updated`, 'success');
                                      }}>
                                        Update saved filter
                                      </Button>
                                    </FlexItem>
                                  ) : null;
                                })()}
                                <FlexItem>
                                  <Button variant="link" onClick={() => { setDrillDownNewFilterName(''); setIsDrillDownSaveFilterModalOpen(true); }}>
                                    Add to saved filters
                                  </Button>
                                </FlexItem>
                              </Flex>
                            </FlexItem>
                          </Flex>
                        )}
                      </CardHeader>
                      <CardBody style={{ overflow: 'auto', padding: '0 24px 16px 24px' }}>
                        {drillDownFilteredAlerts.length === 0 ? (
                          <EmptyState titleText="No alerts found" icon={CheckCircleIcon}>
                            <EmptyStateBody>No alerts match the current filters.</EmptyStateBody>
                          </EmptyState>
                        ) : (
                          <div style={{ overflowX: 'auto', width: '100%' }}>
                            <Table aria-label="Alerts table" isExpandable={isAggregated} style={{ minWidth: '800px' }}>
                              <Thead>
                                <Tr>
                                  {isAggregated && <Th screenReaderText="Expand" />}
                                  <Th>Severity</Th>
                                  <Th>Alert Name</Th>
                                  {isAggregated && columns.find(c => c.key === 'total')?.isVisible && (
                                    <Th
                                      sort={{
                                        sortBy: {
                                          // Header row: [expand, Severity, Alert name, Total, ...] — Total is index 3
                                          index: drillDownSortConfigs.some((c) => c.column === 'total') ? 3 : -1,
                                          direction: drillDownSortConfigs.find((c) => c.column === 'total')?.direction || 'desc',
                                        },
                                        onSort: () => handleDrillDownSort('total'),
                                        columnIndex: 3,
                                      }}
                                    >
                                      Total
                                    </Th>
                                  )}
                                  {columns.find(c => c.key === 'state')?.isVisible && <Th>State</Th>}
                                  {columns.find(c => c.key === 'group')?.isVisible && <Th>Alert scope</Th>}
                                  {columns.find(c => c.key === 'component')?.isVisible && <Th>Component</Th>}
                                  {columns.find(c => c.key === 'source')?.isVisible && <Th>Source</Th>}
                                  <Th screenReaderText="Actions" />
                                </Tr>
                              </Thead>
                              {isAggregated ? (
                                aggregatedAlerts.slice((drillDownPage - 1) * drillDownPerPage, drillDownPage * drillDownPerPage).map((agg, idx) => (
                                  <Tbody key={agg.key} isExpanded={expandedAlertRows.includes(agg.key)}>
                                    <Tr>
                                      <Td
                                        expand={{
                                          rowIndex: idx,
                                          isExpanded: expandedAlertRows.includes(agg.key),
                                          onToggle: () => {
                                            if (expandedAlertRows.includes(agg.key)) {
                                              setExpandedAlertRows(expandedAlertRows.filter(k => k !== agg.key));
                                            } else {
                                              setExpandedAlertRows([...expandedAlertRows, agg.key]);
                                            }
                                          },
                                        }}
                                      />
                                      <Td><Label color={getSeverityLabelColor(agg.severity)} icon={getSeverityIcon(agg.severity)}>{agg.severity}</Label></Td>
                                      <Td>
                                        <Button variant="link" isInline onClick={() => { setSelectedAlertDetail(agg.alerts[0]); setIsDrawerExpanded(true); }}>
                                          <strong>{agg.alertName}</strong>
                                        </Button>
                                      </Td>
                                      {columns.find(c => c.key === 'total')?.isVisible && <Td><Badge>{agg.count}</Badge></Td>}
                                      {columns.find(c => c.key === 'state')?.isVisible && <Td><Label color={getStatusLabelColor(agg.alerts[0].status)} variant="outline">{agg.alerts[0].status}</Label></Td>}
                                      {columns.find(c => c.key === 'group')?.isVisible && <Td><Label isCompact>{agg.alerts[0].group}</Label></Td>}
                                      {columns.find(c => c.key === 'component')?.isVisible && <Td><Label isCompact variant="outline">{agg.alerts[0].component}</Label></Td>}
                                      {columns.find(c => c.key === 'source')?.isVisible && <Td>{agg.alerts[0].source}</Td>}
                                      <Td isActionCell>
                                        <Dropdown
                                          isOpen={false}
                                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                            <MenuToggle ref={toggleRef} variant="plain" aria-label="Actions"><EllipsisVIcon /></MenuToggle>
                                          )}
                                        >
                                          <DropdownList>
                                            <DropdownItem onClick={() => addToast('Alert acknowledged', 'success')}>Acknowledge</DropdownItem>
                                            <DropdownItem onClick={() => addToast('Alert silenced', 'success')}>Silence</DropdownItem>
                                          </DropdownList>
                                        </Dropdown>
                                      </Td>
                                    </Tr>
                                    <Tr isExpanded={expandedAlertRows.includes(agg.key)}>
                                      <Td colSpan={10}>
                                        <ExpandableRowContent>
                                          <Table aria-label="Expanded alerts" variant="compact">
                                            <Thead>
                                              <Tr>
                                                <Th>Namespace</Th>
                                                <Th>State</Th>
                                                <Th>Last Fired</Th>
                                                <Th>Source</Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              {agg.alerts.map(alert => (
                                                <Tr key={alert.id}>
                                                  <Td>{alert.namespace}</Td>
                                                  <Td><Label color={getStatusLabelColor(alert.status)} variant="outline" isCompact>{alert.status}</Label></Td>
                                                  <Td>{alert.lastFired}</Td>
                                                  <Td>{alert.source}</Td>
                                                </Tr>
                                              ))}
                                            </Tbody>
                                          </Table>
                                        </ExpandableRowContent>
                                      </Td>
                                    </Tr>
                                  </Tbody>
                                ))
                              ) : (
                                <Tbody>
                                  {drillDownFilteredAlerts.slice((drillDownPage - 1) * drillDownPerPage, drillDownPage * drillDownPerPage).map(alert => (
                                    <Tr key={alert.id}>
                                      <Td><Label color={getSeverityLabelColor(alert.severity)} icon={getSeverityIcon(alert.severity)}>{alert.severity}</Label></Td>
                                      <Td>
                                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'nowrap' }}>
                                          <Button variant="link" isInline onClick={() => { setSelectedAlertDetail(alert); setIsDrawerExpanded(true); }}>
                                            <strong>{alert.alertName}</strong>
                                          </Button>
                                          {(alert.acknowledgedBy && alert.acknowledgedAt) && (
                                            <Tooltip content={`Acknowledged by ${alert.acknowledgedBy} at ${alert.acknowledgedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${alert.acknowledgedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}>
                                              <Icon size="sm" status="info"><InfoCircleIcon /></Icon>
                                            </Tooltip>
                                          )}
                                        </Flex>
                                      </Td>
                                      {columns.find(c => c.key === 'state')?.isVisible && <Td><Label color={getStatusLabelColor(alert.status)} variant="outline">{alert.status}</Label></Td>}
                                      {columns.find(c => c.key === 'group')?.isVisible && <Td><Label isCompact>{alert.group}</Label></Td>}
                                      {columns.find(c => c.key === 'component')?.isVisible && <Td><Label isCompact variant="outline">{alert.component}</Label></Td>}
                                      {columns.find(c => c.key === 'source')?.isVisible && <Td>{alert.source}</Td>}
                                      <Td isActionCell>
                                        <Dropdown
                                          isOpen={false}
                                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                            <MenuToggle ref={toggleRef} variant="plain" aria-label="Actions"><EllipsisVIcon /></MenuToggle>
                                          )}
                                        >
                                          <DropdownList>
                                            <DropdownItem onClick={() => addToast('Alert acknowledged', 'success')}>Acknowledge</DropdownItem>
                                            <DropdownItem onClick={() => addToast('Alert silenced', 'success')}>Silence</DropdownItem>
                                          </DropdownList>
                                        </Dropdown>
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              )}
                            </Table>
                          </div>
                        )}
                      </CardBody>
                      <CardFooter style={{ padding: '16px 24px 24px 24px' }}>
                        <Pagination
                          itemCount={isAggregated ? aggregatedAlerts.length : drillDownFilteredAlerts.length}
                          perPage={drillDownPerPage}
                          page={drillDownPage}
                          onSetPage={(_, p) => setDrillDownPage(p)}
                          onPerPageSelect={(_, pp) => setDrillDownPerPage(pp)}
                          isCompact
                        />
                      </CardFooter>
                    </Card>
                  </StackItem>
                </Stack>
              </div>
            </div>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>

      {/* Column Management Modal */}
      <Modal
        isOpen={isManageColumnsModalOpen}
        onClose={() => setIsManageColumnsModalOpen(false)}
        variant="small"
        aria-labelledby="column-management-modal"
      >
        <ModalHeader title="Manage columns" labelId="column-management-modal" />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <Content component="p" className="pf-v6-u-color-200">
                Selected columns will appear in the table. Drag to reorder columns.
              </Content>
            </StackItem>
            <StackItem>
              <PfAlert variant="info" isInline isPlain title={`${tempColumns.filter(c => c.isVisible).length} of ${MAX_VISIBLE_COLUMNS} columns selected`} />
            </StackItem>
            <StackItem>
              <Flex gap={{ default: 'gapMd' }}>
                <FlexItem><Button variant="link" isInline onClick={handleSelectAllColumns}>Select all</Button></FlexItem>
                <FlexItem><Button variant="link" isInline onClick={handleDeselectAllColumns}>Deselect all</Button></FlexItem>
                <FlexItem><Button variant="link" isInline onClick={handleRestoreDefaultColumns}>Restore defaults</Button></FlexItem>
              </Flex>
            </StackItem>
            <StackItem>
              <DataList aria-label="Column management list" isCompact>
                {tempColumns.sort((a, b) => a.order - b.order).map(column => (
                  <DataListItem key={column.key} id={column.key} aria-labelledby={`column-${column.key}`}>
                    <DataListItemRow>
                      <DataListControl>
                        <Tooltip content={column.isDisabled ? "Required columns cannot be reordered" : "Drag to reorder"}>
                          <span style={{ cursor: column.isDisabled ? 'not-allowed' : 'grab', color: column.isDisabled ? 'var(--pf-t--global--color--nonstatus--gray--default)' : 'inherit', padding: '4px' }}>
                            <GripVerticalIcon />
                          </span>
                        </Tooltip>
                      </DataListControl>
                      <DataListCheck
                        aria-labelledby={`column-${column.key}`}
                        isChecked={column.isDisabled ? true : column.isVisible}
                        isDisabled={column.isDisabled}
                        onChange={() => handleTempColumnToggle(column.key)}
                        id={`check-${column.key}`}
                      />
                      <DataListItemCells
                        dataListCells={[
                          <DataListCell key={column.key} id={`column-${column.key}`}>
                            <span style={{ fontWeight: column.isDisabled ? 600 : 'normal' }}>{column.label}</span>
                          </DataListCell>
                        ]}
                      />
                    </DataListItemRow>
                  </DataListItem>
                ))}
              </DataList>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleSaveColumns}>Save</Button>
          <Button variant="link" onClick={() => setIsManageColumnsModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Save Filter Modal for Drill-Down */}
      <Modal
        variant="small"
        isOpen={isDrillDownSaveFilterModalOpen}
        onClose={() => setIsDrillDownSaveFilterModalOpen(false)}
      >
        <ModalHeader title="Save current filters" />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <Content component="p">Save the current filter configuration for quick access later.</Content>
            </StackItem>
            <StackItem>
              <TextInputGroup>
                <TextInputGroupMain
                  placeholder="Enter filter name..."
                  value={drillDownNewFilterName}
                  onChange={(_, value) => setDrillDownNewFilterName(value)}
                />
              </TextInputGroup>
            </StackItem>
            <StackItem>
              <Content component="small" className="pf-v6-u-color-200">
                <InfoCircleIcon /> Your saved filters are specific to your account and won't be visible to other users.
              </Content>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              if (drillDownNewFilterName.trim()) {
                const newFilter: SavedFilter = {
                  id: `ddsf-${Date.now()}`,
                  name: drillDownNewFilterName.trim(),
                  filters: {
                    severity: drillDownSeverityFilter,
                    group: drillDownGroupFilter,
                    component: drillDownComponentFilter,
                    source: drillDownSourceFilter,
                    searchValue: drillDownSearchValue
                  },
                };
                setDrillDownSavedFilters([...drillDownSavedFilters, newFilter]);
                setIsDrillDownSaveFilterModalOpen(false);
                setDrillDownNewFilterName('');
                addToast('Filter saved', 'success');
              }
            }}
            isDisabled={!drillDownNewFilterName.trim()}
          >
            Save
          </Button>
          <Button variant="link" onClick={() => setIsDrillDownSaveFilterModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Manage Saved Filters Modal for Drill-Down */}
      <Modal
        variant="medium"
        isOpen={isDrillDownManageSavedFiltersModalOpen}
        onClose={() => setIsDrillDownManageSavedFiltersModalOpen(false)}
      >
        <ModalHeader title="Manage saved filters" />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>
              <Content component="small" className="pf-v6-u-color-200">
                <InfoCircleIcon /> Your saved filters are specific to your account and won't be visible to other users.
              </Content>
            </StackItem>
            <StackItem>
              {drillDownSavedFilters.length === 0 ? (
                <EmptyState titleText="No saved filters" icon={BookmarkIcon}>
                  <EmptyStateBody>You haven't saved any filters yet. Use the "Add to saved filters" option when filters are active.</EmptyStateBody>
                </EmptyState>
              ) : (
                <DataList aria-label="Saved filters list" isCompact>
                  {drillDownSavedFilters.map((filter) => (
                    <DataListItem key={filter.id} aria-labelledby={`drilldown-filter-${filter.id}`}>
                      <DataListItemRow>
                        <DataListControl>
                          <Tooltip content="Drag to reorder">
                            <span style={{ cursor: 'grab', display: 'flex', alignItems: 'center', padding: '8px' }}>
                              <GripVerticalIcon />
                            </span>
                          </Tooltip>
                        </DataListControl>
                        <DataListItemCells
                          dataListCells={[
                            <DataListCell key="name" id={`drilldown-filter-${filter.id}`} width={3}>
                              {drillDownEditingFilterId === filter.id ? (
                                <TextInputGroup>
                                  <TextInputGroupMain
                                    value={drillDownEditingFilterName}
                                    onChange={(_, value) => setDrillDownEditingFilterName(value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && drillDownEditingFilterName.trim()) {
                                        setDrillDownSavedFilters(drillDownSavedFilters.map(f =>
                                          f.id === filter.id ? { ...f, name: drillDownEditingFilterName.trim() } : f
                                        ));
                                        setDrillDownEditingFilterId(null);
                                        setDrillDownEditingFilterName('');
                                      }
                                    }}
                                  />
                                  <TextInputGroupUtilities>
                                    <Button
                                      variant="plain"
                                      onClick={() => {
                                        if (drillDownEditingFilterName.trim()) {
                                          setDrillDownSavedFilters(drillDownSavedFilters.map(f =>
                                            f.id === filter.id ? { ...f, name: drillDownEditingFilterName.trim() } : f
                                          ));
                                        }
                                        setDrillDownEditingFilterId(null);
                                        setDrillDownEditingFilterName('');
                                      }}
                                      aria-label="Save name"
                                    >
                                      <CheckIcon />
                                    </Button>
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        setDrillDownEditingFilterId(null);
                                        setDrillDownEditingFilterName('');
                                      }}
                                    >
                                      <TimesIcon />
                                    </Button>
                                  </TextInputGroupUtilities>
                                </TextInputGroup>
                              ) : (
                                <span>
                                  <BookmarkIcon /> {filter.name}
                                </span>
                              )}
                            </DataListCell>,
                            <DataListCell key="filters" width={2}>
                              <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'wrap' }}>
                                {filter.filters.severity.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Severity: ${filter.filters.severity.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.severity.length} severity</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.group.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Group: ${filter.filters.group.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.group.length} group</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.component.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Component: ${filter.filters.component.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.component.length} component</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.source && filter.filters.source.length > 0 && (
                                  <FlexItem>
                                    <Tooltip content={`Source: ${filter.filters.source.join(', ')}`}>
                                      <Label isCompact color="grey">{filter.filters.source.length} source</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                                {filter.filters.searchValue && (
                                  <FlexItem>
                                    <Tooltip content={`Search: "${filter.filters.searchValue}"`}>
                                      <Label isCompact color="grey">search</Label>
                                    </Tooltip>
                                  </FlexItem>
                                )}
                              </Flex>
                            </DataListCell>,
                            <DataListCell key="actions" width={1} alignRight>
                              <Flex gap={{ default: 'gapSm' }}>
                                <FlexItem>
                                  <Tooltip content="Edit filter name">
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        setDrillDownEditingFilterId(filter.id);
                                        setDrillDownEditingFilterName(filter.name);
                                      }}
                                      aria-label="Edit name"
                                    >
                                      <EditIcon />
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                                <FlexItem>
                                  <Tooltip content="Delete filter">
                                    <Button
                                      variant="plain"
                                      size="sm"
                                      onClick={() => {
                                        setDrillDownSavedFilters(drillDownSavedFilters.filter(f => f.id !== filter.id));
                                        if (selectedDrillDownSavedFilter?.id === filter.id) {
                                          setSelectedDrillDownSavedFilter(null);
                                        }
                                      }}
                                      aria-label="Delete filter"
                                    >
                                      <TrashIcon />
                                    </Button>
                                  </Tooltip>
                                </FlexItem>
                              </Flex>
                            </DataListCell>,
                          ]}
                        />
                      </DataListItemRow>
                    </DataListItem>
                  ))}
                </DataList>
              )}
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsDrillDownManageSavedFiltersModalOpen(false)}>Done</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
