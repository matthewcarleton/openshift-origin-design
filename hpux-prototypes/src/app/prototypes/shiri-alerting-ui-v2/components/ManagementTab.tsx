import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Content,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Flex,
  FlexItem,
  SearchInput,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Button,
  Label,
  Divider,
  Badge,
  Stack,
  StackItem,
  Switch,
  Checkbox,
  Dropdown,
  DropdownList,
  DropdownItem,
  Popover,
  Progress,
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
  FilterIcon,
  TimesIcon,
  EllipsisVIcon,
  SyncIcon,
  BanIcon,
  PauseCircleIcon,
  ColumnsIcon,
} from '@patternfly/react-icons';
import type {
  AlertSeverity,
  AlertGroup,
  AlertComponent,
  AlertRuleState,
  AlertRuleSource,
  AlertRule,
} from '../data/types';
import { getSeverityLabelColor, getSeverityIcon } from '../data/utils';
import { SilenceRulesManagement } from './SilenceRulesManagement';

export interface ManagementTabProps {
  managementSubTab: string | number;
  isAlertRulesFilterPanelOpen: boolean;
  setIsAlertRulesFilterPanelOpen: (open: boolean) => void;
  alertRulesClusterFilter: string[];
  setAlertRulesClusterFilter: (value: string[]) => void;
  alertRulesNamespaceFilter: string[];
  setAlertRulesNamespaceFilter: (value: string[]) => void;
  alertRulesGroupFilter: AlertGroup[];
  setAlertRulesGroupFilter: (value: AlertGroup[]) => void;
  alertRulesComponentFilter: AlertComponent[];
  setAlertRulesComponentFilter: (value: AlertComponent[]) => void;
  alertRulesSeverityFilter: AlertSeverity[];
  setAlertRulesSeverityFilter: (value: AlertSeverity[]) => void;
  alertRulesStateFilter: AlertRuleState[];
  setAlertRulesStateFilter: (value: AlertRuleState[]) => void;
  alertRulesSourceFilter: AlertRuleSource[];
  setAlertRulesSourceFilter: (value: AlertRuleSource[]) => void;
  alertRulesSearchValue: string;
  setAlertRulesSearchValue: (value: string) => void;
  isAlertRulesComponentDropdownOpen: boolean;
  setIsAlertRulesComponentDropdownOpen: (open: boolean) => void;
  selectedAlertRuleIds: string[];
  setSelectedAlertRuleIds: React.Dispatch<React.SetStateAction<string[]>>;
  mockAlertRules: AlertRule[];
  isBulkActionsMenuOpen: boolean;
  setIsBulkActionsMenuOpen: (open: boolean) => void;
  setAlertRulesToDisable: (value: AlertRule[]) => void;
  setIsDisableAlertRuleModalOpen: (open: boolean) => void;
  setAlertRulesForLabelEdit: (value: AlertRule[]) => void;
  setIsEditAlertRuleLabelsModalOpen: (open: boolean) => void;
  setAlertRulesForComponentEdit: (value: AlertRule[]) => void;
  setIsChangeAlertRuleComponentModalOpen: (open: boolean) => void;
  setSelectedAlertRule: (value: AlertRule | null) => void;
  setIsAlertRuleDrawerOpen: (open: boolean) => void;
  setAlertRuleDrawerTab: (value: string | number) => void;
  alertRuleActionMenuOpen: string | null;
  setAlertRuleActionMenuOpen: (value: string | null) => void;
}

export const ManagementTab: React.FunctionComponent<ManagementTabProps> = (props) => {
  const navigate = useNavigate();
  const {
    managementSubTab,
    isAlertRulesFilterPanelOpen,
    setIsAlertRulesFilterPanelOpen,
    alertRulesClusterFilter,
    setAlertRulesClusterFilter,
    alertRulesNamespaceFilter,
    setAlertRulesNamespaceFilter,
    alertRulesGroupFilter,
    setAlertRulesGroupFilter,
    alertRulesComponentFilter,
    setAlertRulesComponentFilter,
    alertRulesSeverityFilter,
    setAlertRulesSeverityFilter,
    alertRulesStateFilter,
    setAlertRulesStateFilter,
    alertRulesSourceFilter,
    setAlertRulesSourceFilter,
    alertRulesSearchValue,
    setAlertRulesSearchValue,
    isAlertRulesComponentDropdownOpen,
    setIsAlertRulesComponentDropdownOpen,
    selectedAlertRuleIds,
    setSelectedAlertRuleIds,
    mockAlertRules,
    isBulkActionsMenuOpen,
    setIsBulkActionsMenuOpen,
    setAlertRulesToDisable,
    setIsDisableAlertRuleModalOpen,
    setAlertRulesForLabelEdit,
    setIsEditAlertRuleLabelsModalOpen,
    setAlertRulesForComponentEdit,
    setIsChangeAlertRuleComponentModalOpen,
    setSelectedAlertRule,
    setIsAlertRuleDrawerOpen,
    setAlertRuleDrawerTab,
    alertRuleActionMenuOpen,
    setAlertRuleActionMenuOpen,
  } = props;

  const activeFilterCount =
    alertRulesClusterFilter.length +
    alertRulesNamespaceFilter.length +
    alertRulesGroupFilter.length +
    alertRulesComponentFilter.length +
    alertRulesSeverityFilter.length +
    alertRulesStateFilter.length +
    alertRulesSourceFilter.length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0px 8px' }}>
      <Stack hasGutter>
        <StackItem>
          {managementSubTab === 'alert-rules' && (
            <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
              {/* Filter Panel - Matching Alerts filter panel style */}
              {isAlertRulesFilterPanelOpen && (
                <div style={{ width: '280px', minWidth: '280px', maxWidth: '280px', flexShrink: 0 }}>
                  <Card>
                    <CardHeader>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem><CardTitle><FilterIcon /> Filters</CardTitle></FlexItem>
                        <FlexItem>
                          <Button variant="plain" onClick={() => setIsAlertRulesFilterPanelOpen(false)}><TimesIcon /></Button>
                        </FlexItem>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stack hasGutter>
                        {/* Severity - Labels */}
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Severity</strong></Content>
                          <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                            {(['Critical', 'Warning', 'Info'] as AlertSeverity[]).map(sev => (
                              <FlexItem key={sev}>
                                <Label
                                  color={getSeverityLabelColor(sev)}
                                  icon={getSeverityIcon(sev)}
                                  onClick={() => {
                                    if (alertRulesSeverityFilter.includes(sev)) {
                                      setAlertRulesSeverityFilter(alertRulesSeverityFilter.filter(s => s !== sev));
                                    } else {
                                      setAlertRulesSeverityFilter([...alertRulesSeverityFilter, sev]);
                                    }
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    opacity: alertRulesSeverityFilter.length > 0 && !alertRulesSeverityFilter.includes(sev) ? 0.5 : 1,
                                    outline: alertRulesSeverityFilter.includes(sev) ? '2px solid var(--pf-t--global--border--color--clicked)' : 'none',
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
                        {/* Alert Scope - Checkboxes */}
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Alert scope</strong></Content>
                          <Stack hasGutter>
                            {(['Cluster', 'Namespace'] as AlertGroup[]).map(grp => (
                              <StackItem key={grp}>
                                <Checkbox
                                  id={`ar-v2-grp-${grp}`}
                                  label={grp}
                                  isChecked={alertRulesGroupFilter.includes(grp)}
                                  onChange={(_, checked) => {
                                    if (checked) setAlertRulesGroupFilter([...alertRulesGroupFilter, grp]);
                                    else setAlertRulesGroupFilter(alertRulesGroupFilter.filter(g => g !== grp));
                                  }}
                                />
                              </StackItem>
                            ))}
                          </Stack>
                        </StackItem>
                        <Divider />
                        {/* Component - Dropdown */}
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Affected component</strong></Content>
                          <Select
                            role="menu"
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsAlertRulesComponentDropdownOpen(!isAlertRulesComponentDropdownOpen)}
                                isExpanded={isAlertRulesComponentDropdownOpen}
                                style={{ width: '100%' }}
                              >
                                {alertRulesComponentFilter.length === 0 ? 'All components' : `${alertRulesComponentFilter.length} selected`}
                              </MenuToggle>
                            )}
                            onSelect={(_, value) => {
                              const comp = value as AlertComponent;
                              if (alertRulesComponentFilter.includes(comp)) {
                                setAlertRulesComponentFilter(alertRulesComponentFilter.filter(c => c !== comp));
                              } else {
                                setAlertRulesComponentFilter([...alertRulesComponentFilter, comp]);
                              }
                            }}
                            isOpen={isAlertRulesComponentDropdownOpen}
                            onOpenChange={setIsAlertRulesComponentDropdownOpen}
                          >
                            <SelectList>
                              {(['kube-apiserver', 'etcd', 'Storage', 'Network', 'Scheduler', 'Controller', 'Workload', 'Pod', 'Quota'] as AlertComponent[]).map(comp => (
                                <SelectOption
                                  key={comp}
                                  value={comp}
                                  hasCheckbox
                                  isSelected={alertRulesComponentFilter.includes(comp)}
                                >
                                  {comp}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </Select>
                        </StackItem>
                        <Divider />
                        {/* State - Checkboxes */}
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>State</strong></Content>
                          <Stack hasGutter>
                            {(['Active', 'Reconciling', 'Partial success', 'Failed', 'Disabled'] as AlertRuleState[]).map(state => (
                              <StackItem key={state}>
                                <Checkbox
                                  id={`ar-v2-state-${state}`}
                                  label={state}
                                  isChecked={alertRulesStateFilter.includes(state)}
                                  onChange={(_, checked) => {
                                    if (checked) setAlertRulesStateFilter([...alertRulesStateFilter, state]);
                                    else setAlertRulesStateFilter(alertRulesStateFilter.filter(s => s !== state));
                                  }}
                                />
                              </StackItem>
                            ))}
                          </Stack>
                        </StackItem>
                        <Divider />
                        {/* Source - Checkboxes */}
                        <StackItem>
                          <Content component="small" className="pf-v6-u-mb-sm"><strong>Source</strong></Content>
                          <Stack hasGutter>
                            {(['User', 'Platform'] as AlertRuleSource[]).map(source => (
                              <StackItem key={source}>
                                <Checkbox
                                  id={`ar-v2-source-${source}`}
                                  label={source}
                                  isChecked={alertRulesSourceFilter.includes(source)}
                                  onChange={(_, checked) => {
                                    if (checked) setAlertRulesSourceFilter([...alertRulesSourceFilter, source]);
                                    else setAlertRulesSourceFilter(alertRulesSourceFilter.filter(s => s !== source));
                                  }}
                                />
                              </StackItem>
                            ))}
                          </Stack>
                        </StackItem>
                        <Divider />
                        {/* Clear Filters */}
                        <StackItem>
                          <Button
                            variant="link"
                            onClick={() => {
                              setAlertRulesClusterFilter([]);
                              setAlertRulesNamespaceFilter([]);
                              setAlertRulesGroupFilter([]);
                              setAlertRulesComponentFilter([]);
                              setAlertRulesSeverityFilter([]);
                              setAlertRulesStateFilter([]);
                              setAlertRulesSourceFilter([]);
                            }}
                          >
                            Clear all filters
                          </Button>
                        </StackItem>
                      </Stack>
                    </CardBody>
                  </Card>
                </div>
              )}
              {/* Main Table Card */}
              <Card style={{ flex: 1 }}>
                <CardHeader>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      {/* Toolbar area */}
                      <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Checkbox
                            id="select-all-rules-v2"
                            isChecked={selectedAlertRuleIds.length === mockAlertRules.length && mockAlertRules.length > 0}
                            onChange={(_, checked) => {
                              if (checked) {
                                setSelectedAlertRuleIds(mockAlertRules.map(r => r.id));
                              } else {
                                setSelectedAlertRuleIds([]);
                              }
                            }}
                          />
                        </FlexItem>
                        <FlexItem>
                          <Button
                            variant={isAlertRulesFilterPanelOpen ? 'secondary' : 'tertiary'}
                            icon={<FilterIcon />}
                            onClick={() => setIsAlertRulesFilterPanelOpen(!isAlertRulesFilterPanelOpen)}
                          >
                            Filter
                            {activeFilterCount > 0 && (
                              <Badge style={{ marginLeft: '8px' }}>{activeFilterCount}</Badge>
                            )}
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <SearchInput
                            placeholder="Search by rule name"
                            style={{ width: '250px' }}
                            value={alertRulesSearchValue}
                            onChange={(_, value) => setAlertRulesSearchValue(value)}
                            onClear={() => setAlertRulesSearchValue('')}
                          />
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" icon={<ColumnsIcon />} aria-label="Manage columns" />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Flex gap={{ default: 'gapMd' }}>
                        <FlexItem>
                          {/* Bulk Actions Dropdown */}
                          <Dropdown
                            isOpen={isBulkActionsMenuOpen}
                            onOpenChange={setIsBulkActionsMenuOpen}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                variant="secondary"
                                onClick={() => setIsBulkActionsMenuOpen(!isBulkActionsMenuOpen)}
                                isDisabled={selectedAlertRuleIds.length === 0}
                              >
                                Actions {selectedAlertRuleIds.length > 0 && <Badge isRead style={{ marginLeft: '4px' }}>{selectedAlertRuleIds.length}</Badge>}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem
                                key="disable"
                                onClick={() => {
                                  const rulesToDisable = mockAlertRules.filter(r => selectedAlertRuleIds.includes(r.id));
                                  setAlertRulesToDisable(rulesToDisable);
                                  setIsDisableAlertRuleModalOpen(true);
                                  setIsBulkActionsMenuOpen(false);
                                }}
                              >
                                <div>
                                  <div><strong>Disable</strong></div>
                                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Stop the rule from running and sending alerts.</div>
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                key="edit-labels"
                                onClick={() => {
                                  const selected = mockAlertRules.filter((r) => selectedAlertRuleIds.includes(r.id));
                                  setAlertRulesForLabelEdit(selected);
                                  setIsEditAlertRuleLabelsModalOpen(true);
                                  setIsBulkActionsMenuOpen(false);
                                }}
                              >
                                <div>
                                  <div><strong>Edit labels</strong></div>
                                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Modify labels for all selected alert rules.</div>
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                key="edit-components"
                                onClick={() => {
                                  const selected = mockAlertRules.filter((r) => selectedAlertRuleIds.includes(r.id));
                                  setAlertRulesForComponentEdit(selected);
                                  setIsChangeAlertRuleComponentModalOpen(true);
                                  setIsBulkActionsMenuOpen(false);
                                }}
                              >
                                <div>
                                  <div><strong>Edit components</strong></div>
                                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Change the component type for all selected alert rules.</div>
                                </div>
                              </DropdownItem>
                              <Divider />
                              <DropdownItem key="delete" isDisabled style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                                <div>
                                  <div>Delete</div>
                                </div>
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="primary" onClick={() => navigate('/observe/alerting-v2/create-alert-rule')}>Create a new alert rule</Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardHeader>
                <CardBody style={{ padding: 0 }}>
                  <Table aria-label="Alert rules table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th screenReaderText="Select" />
                        <Th>
                          Alert rule Name
                        </Th>
                        <Th>State</Th>
                        <Th>Severity</Th>
                        <Th
                          info={{
                            tooltip: "Number of clusters this rule applies to",
                            ariaLabel: "More information about target clusters"
                          }}
                        >
                          Target clusters
                        </Th>
                        <Th
                          info={{
                            tooltip: "Indicates whether the alert affects the entire cluster or a specific namespace",
                            ariaLabel: "More information about alert scope"
                          }}
                        >
                          Alert scope
                        </Th>
                        <Th
                          info={{
                            tooltip: "The specific services, operators, or nodes affected by this alert.",
                            ariaLabel: "More information about affected component"
                          }}
                        >
                          Affected component
                        </Th>
                        <Th
                          info={{
                            tooltip: "Origin of the alert rule (User or Platform)",
                            ariaLabel: "More information about source"
                          }}
                        >
                          Source
                        </Th>
                        <Th screenReaderText="Enabled" />
                        <Th screenReaderText="Actions" />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockAlertRules
                        .filter(rule => {
                          // Search filter
                          if (alertRulesSearchValue && !rule.name.toLowerCase().includes(alertRulesSearchValue.toLowerCase())) return false;
                          // Cluster filter
                          if (alertRulesClusterFilter.length > 0 && !rule.targetClusters.some(c => alertRulesClusterFilter.includes(c))) return false;
                          // Group filter
                          if (alertRulesGroupFilter.length > 0 && !alertRulesGroupFilter.includes(rule.group)) return false;
                          // Component filter
                          if (alertRulesComponentFilter.length > 0 && !alertRulesComponentFilter.includes(rule.component)) return false;
                          // Severity filter
                          if (alertRulesSeverityFilter.length > 0 && !alertRulesSeverityFilter.includes(rule.severity)) return false;
                          // State filter
                          if (alertRulesStateFilter.length > 0 && !alertRulesStateFilter.includes(rule.state)) return false;
                          // Source filter
                          if (alertRulesSourceFilter.length > 0 && !alertRulesSourceFilter.includes(rule.source)) return false;
                          return true;
                        })
                        .map((rule) => (
                          <Tr key={rule.id}>
                            <Td>
                              <Checkbox
                                id={`rule-v2-${rule.id}`}
                                isChecked={selectedAlertRuleIds.includes(rule.id)}
                                onChange={(_, checked) => {
                                  if (checked) {
                                    setSelectedAlertRuleIds([...selectedAlertRuleIds, rule.id]);
                                  } else {
                                    setSelectedAlertRuleIds(selectedAlertRuleIds.filter(id => id !== rule.id));
                                  }
                                }}
                              />
                            </Td>
                            <Td>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                <FlexItem>
                                  <Badge style={{ backgroundColor: 'var(--pf-t--global--color--status--info--default)', color: 'white' }}>AR</Badge>
                                </FlexItem>
                                <FlexItem>
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => {
                                      setSelectedAlertRule(rule);
                                      setIsAlertRuleDrawerOpen(true);
                                      setAlertRuleDrawerTab('details');
                                    }}
                                  >
                                    {rule.name}
                                  </Button>
                                </FlexItem>
                              </Flex>
                            </Td>
                            <Td>
                              {rule.state === 'Active' && (
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--default)" />
                                  <span>Active</span>
                                </Flex>
                              )}
                              {rule.state === 'Reconciling' && (
                                <Popover
                                  headerIcon={<SyncIcon />}
                                  headerContent="Reconciliation in progress"
                                  bodyContent={
                                    <Stack hasGutter>
                                      <StackItem>
                                        <Content>The rule configuration has been accepted but is currently being processed. You'll receive a notification when processing is complete.</Content>
                                      </StackItem>
                                      <StackItem>
                                        <div style={{ marginBottom: '8px' }}>Configuration in progress</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <Progress
                                            value={rule.stateProgress || 0}
                                            size="sm"
                                            style={{ flex: 1 }}
                                            aria-label="Progress"
                                          />
                                          <span>{rule.stateProgress || 0}%</span>
                                        </div>
                                        <div style={{ marginTop: '8px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                          Rule applied to {rule.appliedClusters || 0} of {rule.totalClusters || 0} clusters
                                        </div>
                                      </StackItem>
                                      <StackItem>
                                        <Flex gap={{ default: 'gapMd' }}>
                                          <Button variant="secondary" size="sm">Close</Button>
                                          <Button variant="link" size="sm">Learn more</Button>
                                        </Flex>
                                      </StackItem>
                                    </Stack>
                                  }
                                >
                                  <Button variant="link" isInline style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <SyncIcon /> Reconciling
                                  </Button>
                                </Popover>
                              )}
                              {rule.state === 'Partial success' && (
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <ExclamationCircleIcon color="var(--pf-t--global--color--status--warning--default)" />
                                  <span>Partial success</span>
                                </Flex>
                              )}
                              {rule.state === 'Failed' && (
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <BanIcon color="var(--pf-t--global--color--status--danger--default)" />
                                  <span>Failed</span>
                                </Flex>
                              )}
                              {rule.state === 'Disabled' && (
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <PauseCircleIcon color="var(--pf-t--global--text--color--subtle)" />
                                  <span>Disabled</span>
                                </Flex>
                              )}
                            </Td>
                            <Td>
                              <Label
                                color={rule.severity === 'Critical' ? 'red' : rule.severity === 'Warning' ? 'orange' : 'purple'}
                                isCompact
                                icon={rule.severity === 'Critical' ? <ExclamationCircleIcon /> : rule.severity === 'Warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                              >
                                {rule.severity}
                              </Label>
                            </Td>
                            <Td>
                              <Popover
                                headerContent={`This alert rule is applied on ${rule.targetClusters.length} clusters`}
                                bodyContent={
                                  <Stack hasGutter>
                                    <StackItem>
                                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                        {rule.targetClusters.slice(0, 5).map((cluster, idx) => (
                                          <li key={idx}>{cluster}</li>
                                        ))}
                                      </ul>
                                    </StackItem>
                                    {rule.targetClusters.length > 5 && (
                                      <StackItem>
                                        <Button
                                          variant="link"
                                          isInline
                                          onClick={() => {
                                            setSelectedAlertRule(rule);
                                            setIsAlertRuleDrawerOpen(true);
                                            setAlertRuleDrawerTab('details');
                                          }}
                                        >
                                          See alert rule details
                                        </Button>
                                      </StackItem>
                                    )}
                                  </Stack>
                                }
                              >
                                <Button variant="link" isInline>
                                  {rule.targetClusters.length} cluster{rule.targetClusters.length > 1 ? 's' : ''}
                                </Button>
                              </Popover>
                            </Td>
                            <Td>{rule.group}</Td>
                            <Td>{rule.component}</Td>
                            <Td>{rule.source}</Td>
                            <Td>
                              <Switch
                                id={`switch-v2-${rule.id}`}
                                isChecked={rule.enabled}
                                aria-label={`Enable ${rule.name}`}
                                onChange={(_, checked) => {
                                  if (!checked) {
                                    // When turning off (disabling), show the disable modal
                                    setAlertRulesToDisable([rule]);
                                    setIsDisableAlertRuleModalOpen(true);
                                  }
                                  // For enabling, just toggle (in real app would update state)
                                }}
                              />
                            </Td>
                            <Td>
                              <Dropdown
                                isOpen={alertRuleActionMenuOpen === rule.id}
                                onOpenChange={(isOpen) => setAlertRuleActionMenuOpen(isOpen ? rule.id : null)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    variant="plain"
                                    aria-label="Actions"
                                    onClick={() => setAlertRuleActionMenuOpen(alertRuleActionMenuOpen === rule.id ? null : rule.id)}
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  {/* User-defined alert rule actions */}
                                  {rule.source === 'User' && (
                                    <>
                                      <DropdownItem key="edit">
                                        <div>
                                          <div><strong>Edit alert rule</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Modify the criteria and notification settings for an existing alert rule.</div>
                                        </div>
                                      </DropdownItem>
                                      <DropdownItem
                                        key="disable"
                                        onClick={() => {
                                          setAlertRulesToDisable([rule]);
                                          setIsDisableAlertRuleModalOpen(true);
                                          setAlertRuleActionMenuOpen(null);
                                        }}
                                      >
                                        <div>
                                          <div><strong>Disable</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Stop the rule from running altogether.</div>
                                        </div>
                                      </DropdownItem>
                                      <DropdownItem key="duplicate">
                                        <div>
                                          <div><strong>Duplicate</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Copy an alert rule and modify as new.</div>
                                        </div>
                                      </DropdownItem>
                                      <DropdownItem key="silence">
                                        <div>
                                          <div><strong>Silence alert rule</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Temporarily stop notifications for this alert rule.</div>
                                        </div>
                                      </DropdownItem>
                                      <Divider />
                                      <DropdownItem key="delete" isDanger>
                                        <div>
                                          <div><strong>Delete</strong></div>
                                        </div>
                                      </DropdownItem>
                                    </>
                                  )}
                                  {/* Platform-defined alert rule actions */}
                                  {rule.source === 'Platform' && (
                                    <>
                                      <DropdownItem key="edit">
                                        <div>
                                          <div><strong>Edit alert rule</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Limited fields available for platform alerts.</div>
                                        </div>
                                      </DropdownItem>
                                      <DropdownItem
                                        key="disable"
                                        onClick={() => {
                                          setAlertRulesToDisable([rule]);
                                          setIsDisableAlertRuleModalOpen(true);
                                          setAlertRuleActionMenuOpen(null);
                                        }}
                                      >
                                        <div>
                                          <div><strong>Disable</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Stop the rule from running altogether.</div>
                                        </div>
                                      </DropdownItem>
                                      <DropdownItem key="duplicate">
                                        <div>
                                          <div><strong>Duplicate</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Copy an alert rule and modify as a new user-defined rule.</div>
                                        </div>
                                      </DropdownItem>
                                      <DropdownItem key="silence">
                                        <div>
                                          <div><strong>Silence alert rule</strong></div>
                                          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Temporarily stop notifications for this alert rule.</div>
                                        </div>
                                      </DropdownItem>
                                      <Divider />
                                      <DropdownItem key="delete" isDisabled style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                                        <div>
                                          <div>Delete</div>
                                          <div style={{ fontSize: '12px' }}>Available only for user defined alerts</div>
                                        </div>
                                      </DropdownItem>
                                    </>
                                  )}
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          )}
          {managementSubTab === 'silence-rules' && <SilenceRulesManagement />}
        </StackItem>
      </Stack>
    </div>
  );
};
