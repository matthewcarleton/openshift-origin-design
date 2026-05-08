import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Flex,
  FlexItem,
  Title,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Tabs,
  Tab,
  TabTitleText,
  Stack,
  StackItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Badge,
  Label,
  Tooltip,
  Card,
  CardBody,
  Select,
  SelectOption,
  SelectList,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  CodeBlock,
  CodeBlockCode,
  Content,
} from '@patternfly/react-core';
import {
  EllipsisVIcon,
  TimesIcon,
  AngleDownIcon,
  AngleRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  QuestionCircleIcon,
  ClockIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';
import type { AlertRule } from '../data/types';

export interface AlertRuleDrawerProps {
  isOpen: boolean;
  selectedAlertRule: AlertRule | null;
  onClose: () => void;
  activeTab: string | number;
  onTabChange: (tabKey: string | number) => void;
  expandedClusters: string[];
  onExpandedClustersChange: (clusters: string[]) => void;
  expandedAlerts: string[];
  onExpandedAlertsChange: (alerts: string[]) => void;
  targetClusterFilter: string;
  onTargetClusterFilterChange: (val: string) => void;
  isTargetClusterFilterOpen: boolean;
  onTargetClusterFilterOpenChange: (open: boolean) => void;
  timelineRange: string;
  onTimelineRangeChange: (val: string) => void;
  isTimelineRangeOpen: boolean;
  onTimelineRangeOpenChange: (open: boolean) => void;
}

export const AlertRuleDrawer: React.FunctionComponent<AlertRuleDrawerProps> = ({
  isOpen,
  selectedAlertRule,
  onClose,
  activeTab,
  onTabChange,
  expandedClusters,
  onExpandedClustersChange,
  expandedAlerts,
  onExpandedAlertsChange,
  targetClusterFilter,
  onTargetClusterFilterChange,
  isTargetClusterFilterOpen,
  onTargetClusterFilterOpenChange,
  timelineRange,
  onTimelineRangeChange,
  isTimelineRangeOpen,
  onTimelineRangeOpenChange,
}) => {
  if (!isOpen || !selectedAlertRule) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const toggleClusterExpanded = (cluster: string) => {
    if (expandedClusters.includes(cluster)) {
      onExpandedClustersChange(expandedClusters.filter((c) => c !== cluster));
    } else {
      onExpandedClustersChange([...expandedClusters, cluster]);
    }
  };

  const toggleAlertExpanded = (alertId: string) => {
    if (expandedAlerts.includes(alertId)) {
      onExpandedAlertsChange(expandedAlerts.filter((a) => a !== alertId));
    } else {
      onExpandedAlertsChange([...expandedAlerts, alertId]);
    }
  };

  return (
    <div style={{ position: 'fixed', top: '76px', left: 0, right: 0, bottom: 0, zIndex: 400 }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
        }}
        onClick={handleClose}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '550px',
          maxWidth: '90vw',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
            flexShrink: 0,
          }}
        >
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
            <FlexItem>
              <Title headingLevel="h2" size="lg">
                Alert rule details
              </Title>
            </FlexItem>
            <FlexItem>
              <Flex gap={{ default: 'gapSm' }}>
                <FlexItem>
                  <Dropdown
                    isOpen={false}
                    onOpenChange={() => {}}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} variant="plain" aria-label="Actions">
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownItem>Duplicate</DropdownItem>
                      <DropdownItem isDanger>Delete</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FlexItem>
                <FlexItem>
                  <Button variant="plain" aria-label="Close" onClick={handleClose}>
                    <TimesIcon />
                  </Button>
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Tabs activeKey={activeTab} onSelect={(_, tabKey) => onTabChange(tabKey)} isFilled style={{ padding: '0 16px', flexShrink: 0 }}>
            <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>}>
              <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                <Stack hasGutter>
                  <StackItem>
                    <DescriptionList isCompact isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                            <FlexItem>
                              <Badge style={{ backgroundColor: 'var(--pf-t--global--color--status--info--default)', color: 'white' }}>AR</Badge>
                            </FlexItem>
                            <FlexItem>
                              <strong>{selectedAlertRule.name}</strong>
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Description</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.description}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Target clusters</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Stack hasGutter>
                            {selectedAlertRule.targetClusters.slice(0, 5).map((cluster, idx) => (
                              <StackItem key={idx}>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                  <FlexItem>
                                    <Button
                                      variant="plain"
                                      onClick={() => toggleClusterExpanded(cluster)}
                                      style={{ padding: 0 }}
                                    >
                                      {expandedClusters.includes(cluster) ? <AngleDownIcon /> : <AngleRightIcon />}
                                    </Button>
                                  </FlexItem>
                                  <FlexItem>
                                    <CheckCircleIcon color="var(--pf-t--global--color--status--success--default)" />
                                  </FlexItem>
                                  <FlexItem>{cluster}</FlexItem>
                                </Flex>
                                {expandedClusters.includes(cluster) && (
                                  <div style={{ paddingLeft: '48px', marginTop: '8px' }}>
                                    <DescriptionList isCompact isHorizontal>
                                      <DescriptionListGroup>
                                        <DescriptionListTerm>Environment</DescriptionListTerm>
                                        <DescriptionListDescription>Production</DescriptionListDescription>
                                      </DescriptionListGroup>
                                      <DescriptionListGroup>
                                        <DescriptionListTerm>Region</DescriptionListTerm>
                                        <DescriptionListDescription>us-west-2 (Secondary)</DescriptionListDescription>
                                      </DescriptionListGroup>
                                      <DescriptionListGroup>
                                        <DescriptionListTerm>Version</DescriptionListTerm>
                                        <DescriptionListDescription>K8s 1.28.3</DescriptionListDescription>
                                      </DescriptionListGroup>
                                    </DescriptionList>
                                  </div>
                                )}
                              </StackItem>
                            ))}
                          </Stack>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Source</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.source}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Alert scope</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.group}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Affected component</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.component}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Labels</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex gap={{ default: 'gapSm' }}>
                            {selectedAlertRule.labels.map((label, idx) => (
                              <FlexItem key={idx}>
                                <Label isCompact variant="outline">
                                  {label}
                                </Label>
                              </FlexItem>
                            ))}
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Severity</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Label
                            color={
                              selectedAlertRule.severity === 'Critical'
                                ? 'red'
                                : selectedAlertRule.severity === 'Warning'
                                  ? 'orange'
                                  : 'purple'
                            }
                            icon={
                              selectedAlertRule.severity === 'Critical' ? (
                                <ExclamationCircleIcon />
                              ) : selectedAlertRule.severity === 'Warning' ? (
                                <ExclamationTriangleIcon />
                              ) : (
                                <InfoCircleIcon />
                              )
                            }
                          >
                            {selectedAlertRule.severity}
                          </Label>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Expression</DescriptionListTerm>
                        <DescriptionListDescription>
                          <code
                            style={{
                              backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                              padding: '8px',
                              borderRadius: '4px',
                              display: 'block',
                              fontSize: '12px',
                              wordBreak: 'break-all',
                            }}
                          >
                            {selectedAlertRule.expression}
                          </code>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                            <FlexItem>For</FlexItem>
                            <FlexItem>
                              <Tooltip content="Duration the alert must be firing before it is considered active">
                                <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                              </Tooltip>
                            </FlexItem>
                          </Flex>
                        </DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.forDuration}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                            <FlexItem>PrometheusRule</FlexItem>
                            <FlexItem>
                              <Tooltip content="The Prometheus rule resource that contains this alert">
                                <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                              </Tooltip>
                            </FlexItem>
                          </Flex>
                        </DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.prometheusRule}</DescriptionListDescription>
                      </DescriptionListGroup>
                      {selectedAlertRule.runbookUrl && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Runbook</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Button variant="link" isInline>
                              {selectedAlertRule.runbookUrl}
                            </Button>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                      {selectedAlertRule.dashboards && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>Dashboards</FlexItem>
                              <FlexItem>
                                <Tooltip content="Related dashboards for this alert">
                                  <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </DescriptionListTerm>
                          <DescriptionListDescription>{selectedAlertRule.dashboards}</DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                    </DescriptionList>
                  </StackItem>

                  <StackItem>
                    <Title headingLevel="h4" size="md" style={{ marginTop: '16px', marginBottom: '16px' }}>
                      Notifications
                    </Title>
                    <DescriptionList isCompact isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Summary</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.summary}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Description</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.description}</DescriptionListDescription>
                      </DescriptionListGroup>
                      {selectedAlertRule.notificationMatchers && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Notification matchers</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Flex gap={{ default: 'gapSm' }}>
                              {selectedAlertRule.notificationMatchers.map((matcher, idx) => (
                                <FlexItem key={idx}>
                                  <Label isCompact variant="outline">
                                    {matcher}
                                  </Label>
                                </FlexItem>
                              ))}
                            </Flex>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                      {selectedAlertRule.receivedBy && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Received by</DescriptionListTerm>
                          <DescriptionListDescription>{selectedAlertRule.receivedBy}</DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                      {selectedAlertRule.receivers && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Receivers</DescriptionListTerm>
                          <DescriptionListDescription>{selectedAlertRule.receivers.join(', ')}</DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                    </DescriptionList>
                  </StackItem>

                  <StackItem>
                    <Title headingLevel="h4" size="md" style={{ marginTop: '16px', marginBottom: '16px' }}>
                      Alert rule history
                    </Title>
                    <DescriptionList isCompact isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Created at</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.createdAt}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Created by</DescriptionListTerm>
                        <DescriptionListDescription>{selectedAlertRule.createdBy}</DescriptionListDescription>
                      </DescriptionListGroup>
                      {selectedAlertRule.modificationHistory.length > 0 && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Modified at</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Stack hasGutter>
                              {selectedAlertRule.modificationHistory.map((mod, idx) => (
                                <StackItem key={idx}>
                                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                    <FlexItem>
                                      {mod.date} by {mod.user}
                                    </FlexItem>
                                    <FlexItem>
                                      <Button variant="link" isInline>
                                        View changes
                                      </Button>
                                    </FlexItem>
                                  </Flex>
                                </StackItem>
                              ))}
                            </Stack>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                    </DescriptionList>
                  </StackItem>
                </Stack>
              </div>
            </Tab>
            <Tab eventKey="active-alerts" title={<TabTitleText>Active alerts</TabTitleText>}>
              <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                <Stack hasGutter>
                  <StackItem>
                    <Card>
                      <CardBody>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <Title headingLevel="h4" size="md">
                              Target clusters alerts
                            </Title>
                          </FlexItem>
                          <FlexItem>
                            <Select
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => onTargetClusterFilterOpenChange(!isTargetClusterFilterOpen)}
                                  isExpanded={isTargetClusterFilterOpen}
                                >
                                  {targetClusterFilter === 'all'
                                    ? `All target clusters (${selectedAlertRule.targetClusters.length})`
                                    : targetClusterFilter}
                                </MenuToggle>
                              )}
                              isOpen={isTargetClusterFilterOpen}
                              onOpenChange={onTargetClusterFilterOpenChange}
                              onSelect={(_, val) => {
                                onTargetClusterFilterChange(val as string);
                                onTargetClusterFilterOpenChange(false);
                              }}
                            >
                              <SelectList>
                                <SelectOption value="all">All target clusters ({selectedAlertRule.targetClusters.length})</SelectOption>
                                {selectedAlertRule.targetClusters.map((cluster, idx) => (
                                  <SelectOption key={idx} value={cluster}>
                                    {cluster}
                                  </SelectOption>
                                ))}
                              </SelectList>
                            </Select>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </StackItem>
                  <StackItem>
                    <Accordion asDefinitionList={false}>
                      <AccordionItem isExpanded>
                        <AccordionToggle onClick={() => {}} id="alerts-timeline-toggle-v2">
                          Alerts timeline
                        </AccordionToggle>
                        <AccordionContent>
                          <Stack hasGutter>
                            <StackItem>
                              <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <FlexItem>
                                  <Select
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => onTimelineRangeOpenChange(!isTimelineRangeOpen)}
                                        isExpanded={isTimelineRangeOpen}
                                        variant="secondary"
                                      >
                                        <ClockIcon /> {timelineRange}
                                      </MenuToggle>
                                    )}
                                    isOpen={isTimelineRangeOpen}
                                    onOpenChange={onTimelineRangeOpenChange}
                                    onSelect={(_, val) => {
                                      onTimelineRangeChange(val as string);
                                      onTimelineRangeOpenChange(false);
                                    }}
                                  >
                                    <SelectList>
                                      <SelectOption value="15 minutes">15 minutes</SelectOption>
                                      <SelectOption value="30 minutes">30 minutes</SelectOption>
                                      <SelectOption value="1 hour">1 hour</SelectOption>
                                      <SelectOption value="6 hours">6 hours</SelectOption>
                                      <SelectOption value="24 hours">24 hours</SelectOption>
                                    </SelectList>
                                  </Select>
                                </FlexItem>
                                <FlexItem>
                                  <Button variant="link">
                                    Reset zoom
                                  </Button>
                                </FlexItem>
                              </Flex>
                            </StackItem>
                            <StackItem>
                              <div
                                style={{
                                  height: '200px',
                                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                                  borderRadius: '4px',
                                  padding: '16px',
                                }}
                              >
                                <ReactECharts
                                  option={{
                                    grid: { top: 20, right: 20, bottom: 40, left: 40 },
                                    xAxis: {
                                      type: 'category',
                                      data: ['12:15 PM', '12:20 PM', '12:25 PM', '12:30 PM', '12:35 PM', '12:40 PM'],
                                      axisLine: { lineStyle: { color: 'var(--pf-t--global--border--color--default)' } },
                                      axisLabel: { color: 'var(--pf-t--global--text--color--subtle)' },
                                    },
                                    yAxis: {
                                      type: 'value',
                                      min: 0,
                                      max: 10,
                                      axisLine: { lineStyle: { color: 'var(--pf-t--global--border--color--default)' } },
                                      axisLabel: { color: 'var(--pf-t--global--text--color--subtle)' },
                                      splitLine: {
                                        lineStyle: {
                                          color: 'var(--pf-t--global--border--color--default)',
                                          type: 'dashed',
                                        },
                                      },
                                    },
                                    series: [
                                      {
                                        name: 'Series 1',
                                        type: 'line',
                                        data: [7, 5, 8, 9, 8, 10],
                                        lineStyle: { color: 'var(--pf-t--global--color--status--info--default)' },
                                        itemStyle: { color: 'var(--pf-t--global--color--status--info--default)' },
                                      },
                                      {
                                        name: 'Series 2',
                                        type: 'line',
                                        data: [6, 4, 6, 5, 6, 4],
                                        lineStyle: {
                                          color: 'var(--pf-t--global--color--status--info--default)',
                                          type: 'dashed',
                                        },
                                        itemStyle: { color: 'var(--pf-t--global--color--status--info--default)' },
                                      },
                                    ],
                                    tooltip: { trigger: 'axis' },
                                  }}
                                  style={{ height: '100%' }}
                                />
                              </div>
                            </StackItem>
                            <StackItem>
                              <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <FlexItem>Inspect metric</FlexItem>
                                <FlexItem>
                                  <Tooltip content="Inspect the metric in the console">
                                    <ExternalLinkAltIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                                  </Tooltip>
                                </FlexItem>
                              </Flex>
                            </StackItem>
                          </Stack>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </StackItem>
                  <StackItem>
                    <Title headingLevel="h4" size="md">
                      Active alerts
                    </Title>
                  </StackItem>
                  {selectedAlertRule.activeAlerts.length === 0 ? (
                    <StackItem>
                      <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                        No active alerts
                      </Content>
                    </StackItem>
                  ) : (
                    selectedAlertRule.activeAlerts.map((alert, idx) => (
                      <StackItem key={idx}>
                        <Card
                          isClickable
                          onClick={() => toggleAlertExpanded(alert.id)}
                        >
                          <CardBody>
                            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem style={{ flex: 1 }}>
                                <Content>{alert.message}</Content>
                              </FlexItem>
                              <FlexItem>{expandedAlerts.includes(alert.id) ? <AngleDownIcon /> : <AngleRightIcon />}</FlexItem>
                            </Flex>
                            {expandedAlerts.includes(alert.id) && (
                              <div
                                style={{
                                  marginTop: '16px',
                                  paddingTop: '16px',
                                  borderTop: '1px solid var(--pf-t--global--border--color--default)',
                                }}
                              >
                                <DescriptionList isCompact isHorizontal>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Name</DescriptionListTerm>
                                    <DescriptionListDescription>{selectedAlertRule.description}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Active since</DescriptionListTerm>
                                    <DescriptionListDescription>{alert.activeSince}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>State</DescriptionListTerm>
                                    <DescriptionListDescription>{alert.state}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Value</DescriptionListTerm>
                                    <DescriptionListDescription>{alert.value}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Resource</DescriptionListTerm>
                                    <DescriptionListDescription>{alert.resource}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Cluster</DescriptionListTerm>
                                    <DescriptionListDescription>{alert.cluster}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      </StackItem>
                    ))
                  )}
                </Stack>
              </div>
            </Tab>
            <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>}>
              <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                <CodeBlock>
                  <CodeBlockCode>
                    {`apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: ${selectedAlertRule.name.toLowerCase().replace(/\s+/g, '-')}
  namespace: openshift-monitoring
  labels:
    prometheus: cluster-monitoring
spec:
  groups:
  - name: ${selectedAlertRule.group.toLowerCase()}-alerts
    rules:
    - alert: ${selectedAlertRule.name}
      expr: ${selectedAlertRule.expression}
      for: ${selectedAlertRule.forDuration}
      labels:
        severity: ${selectedAlertRule.severity.toLowerCase()}
        component: ${selectedAlertRule.component}
        group: ${selectedAlertRule.group.toLowerCase()}
      annotations:
        summary: "${selectedAlertRule.summary}"
        description: "${selectedAlertRule.description}"
        runbook_url: "${selectedAlertRule.runbookUrl || ''}"
        dashboard: "${selectedAlertRule.dashboards || ''}"
# Target clusters: ${selectedAlertRule.targetClusters.join(', ')}`}
                  </CodeBlockCode>
                </CodeBlock>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
