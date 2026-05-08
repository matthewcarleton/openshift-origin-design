import * as React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
  Icon,
  Label,
  LabelGroup,
  Grid,
  Content,
  Stack,
  StackItem,
  Divider,
  Badge,
  Tooltip,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Title,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CubesIcon,
  ClockIcon,
  CogIcon,
  TachometerAltIcon,
  ServerIcon,
  CubeIcon,
  PortIcon,
  AngleRightIcon,
  MapMarkerAltIcon,
  CloudIcon,
  QuestionCircleIcon,
  ClusterIcon,
} from '@patternfly/react-icons';
import type { ClusterData, AlertComponent, AlertGroup, ComponentHealthData } from '../data/types';
import { AlertKpiTooltip } from '../../../components/autonomousAiObserve/AlertKpiTooltip';
import '../../../components/autonomousAiObserve/autonomous-ai-observe.css';
import { buildFleetAlertKpiRows, FLEET_ALERT_KPI_TOOLTIP_PROPS } from '../utils/alertKpiBreakdown';

interface ClusterComponentsHealthProps {
  cluster: ClusterData;
  onComponentClick: (component: AlertComponent) => void;
  onBackToFleet: () => void;
  groupFilter?: AlertGroup[];
}

export const ClusterComponentsHealth: React.FC<ClusterComponentsHealthProps> = ({
  cluster,
  onComponentClick,
  onBackToFleet,
  groupFilter = [],
}) => {
  // Define component metadata with icons
  // Components are organized by Alert Scope:
  // - Cluster: Components related to cluster control plane health (API server, etcd, scheduler, controller, network)
  // - Namespace: Components related to user applications and services (workloads, pods, storage, quotas)
  const componentMeta: Record<AlertComponent, { displayName: string; icon: React.ReactNode; impactGroup: 'Cluster' | 'Namespace' }> = {
    'kube-apiserver': { displayName: 'API Server', icon: <ServerIcon />, impactGroup: 'Cluster' },
    'etcd': { displayName: 'etcd', icon: <CubesIcon />, impactGroup: 'Cluster' },
    'Scheduler': { displayName: 'Scheduler', icon: <ClockIcon />, impactGroup: 'Cluster' },
    'Controller': { displayName: 'Controller Manager', icon: <CogIcon />, impactGroup: 'Cluster' },
    'Network': { displayName: 'Network', icon: <PortIcon />, impactGroup: 'Cluster' },
    'Storage': { displayName: 'Storage', icon: <CubeIcon />, impactGroup: 'Namespace' },
    'Workload': { displayName: 'Workloads', icon: <CubesIcon />, impactGroup: 'Namespace' },
    'Pod': { displayName: 'Pods', icon: <CubeIcon />, impactGroup: 'Namespace' },
    'Quota': { displayName: 'Resource Quotas', icon: <TachometerAltIcon />, impactGroup: 'Namespace' },
  };

  // Calculate component health data from cluster alerts
  const componentHealthData: ComponentHealthData[] = React.useMemo(() => {
    const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
    const components: AlertComponent[] = ['kube-apiserver', 'etcd', 'Scheduler', 'Controller', 'Storage', 'Network', 'Workload', 'Pod', 'Quota'];
    
    // Filter components by alert scope if groupFilter is active
    const filteredComponents = groupFilter.length > 0 
      ? components.filter(component => groupFilter.includes(componentMeta[component].impactGroup))
      : components;
    
    return filteredComponents.map(component => {
      const componentAlerts = firingAlerts.filter(a => a.component === component);
      const criticalCount = componentAlerts.filter(a => a.severity === 'Critical').length;
      const warningCount = componentAlerts.filter(a => a.severity === 'Warning').length;
      const infoCount = componentAlerts.filter(a => a.severity === 'Info').length;
      
      let healthStatus: 'critical' | 'warning' | 'info' | 'healthy' = 'healthy';
      if (criticalCount > 0) healthStatus = 'critical';
      else if (warningCount > 0) healthStatus = 'warning';
      else if (infoCount > 0) healthStatus = 'info';
      
      const lastAlert = componentAlerts.length > 0 
        ? componentAlerts.sort((a, b) => b.lastFiredTimestamp.getTime() - a.lastFiredTimestamp.getTime())[0]?.lastFired
        : undefined;
      
      return {
        component,
        displayName: componentMeta[component].displayName,
        icon: componentMeta[component].icon,
        alertCount: componentAlerts.length,
        criticalCount,
        warningCount,
        infoCount,
        healthStatus,
        lastAlert,
      };
    }).sort((a, b) => {
      // Sort by health status (critical first, then warning, info, healthy)
      const statusOrder = { critical: 0, warning: 1, info: 2, healthy: 3 };
      return statusOrder[a.healthStatus] - statusOrder[b.healthStatus];
    });
  }, [cluster.alerts, groupFilter]);

  // Calculate cluster health status based on highest severity alert
  const clusterHealthStatus = React.useMemo((): 'critical' | 'warning' | 'info' | 'healthy' => {
    const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
    const hasCritical = firingAlerts.some(a => a.severity === 'Critical');
    const hasWarning = firingAlerts.some(a => a.severity === 'Warning');
    const hasInfo = firingAlerts.some(a => a.severity === 'Info');
    
    if (hasCritical) return 'critical';
    if (hasWarning) return 'warning';
    if (hasInfo) return 'info';
    return 'healthy';
  }, [cluster.alerts]);

  const firingAlertsAll = React.useMemo(
    () => cluster.alerts.filter((a) => a.status === 'firing'),
    [cluster.alerts]
  );

  const getHealthStatusColor = (status: 'critical' | 'warning' | 'info' | 'healthy') => {
    switch (status) {
      case 'critical': return 'var(--pf-t--global--color--status--danger--default)';
      case 'warning': return 'var(--pf-t--global--color--status--warning--default)';
      case 'info': return 'var(--pf-t--global--color--status--info--default)';
      case 'healthy': return 'var(--pf-t--global--color--status--success--default)';
    }
  };

  const getHealthStatusIcon = (status: 'critical' | 'warning' | 'info' | 'healthy') => {
    switch (status) {
      case 'critical': return <Icon status="danger"><ExclamationCircleIcon /></Icon>;
      case 'warning': return <Icon status="warning"><ExclamationTriangleIcon /></Icon>;
      case 'info': return <Icon status="info"><InfoCircleIcon /></Icon>;
      case 'healthy': return <Icon status="success"><CheckCircleIcon /></Icon>;
    }
  };

  // Group components by Alert Scope
  const clusterComponents = componentHealthData.filter(c => componentMeta[c.component].impactGroup === 'Cluster');
  const namespaceComponents = componentHealthData.filter(c => componentMeta[c.component].impactGroup === 'Namespace');
  
  // Calculate totals for each alert scope
  const clusterGroupAlerts = cluster.alerts.filter(a => a.status === 'firing' && a.group === 'Cluster');
  const namespaceGroupAlerts = cluster.alerts.filter(a => a.status === 'firing' && a.group === 'Namespace');

  const renderComponentCard = (data: ComponentHealthData) => {
    const componentFiring = cluster.alerts.filter((a) => a.status === 'firing' && a.component === data.component);
    return (
      <Card 
        key={data.component} 
        isClickable 
        isSelectable
        onClick={() => onComponentClick(data.component)}
        style={{ 
          cursor: 'pointer',
          borderLeft: `4px solid ${
            data.healthStatus === 'critical' ? 'var(--pf-t--global--color--status--danger--default)' :
            data.healthStatus === 'warning' ? 'var(--pf-t--global--color--status--warning--default)' :
            data.healthStatus === 'info' ? 'var(--pf-t--global--color--status--info--default)' :
            'var(--pf-t--global--color--status--success--default)'
          }`,
        }}
      >
        <CardBody>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Icon size="lg">{data.icon}</Icon>
                </FlexItem>
                <FlexItem>
                  <Stack>
                    <StackItem>
                      <Title headingLevel="h4" size="md">{data.displayName}</Title>
                    </StackItem>
                    {data.lastAlert && (
                      <StackItem>
                        <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                          Last alert: {data.lastAlert}
                        </Content>
                      </StackItem>
                    )}
                  </Stack>
                </FlexItem>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  {data.alertCount > 0 ? (
                    <LabelGroup>
                      {data.criticalCount > 0 && (
                        <Tooltip
                          content={
                            <AlertKpiTooltip
                              bucketLabel="Critical alerts"
                              rows={buildFleetAlertKpiRows(componentFiring, { severity: 'Critical' })}
                            />
                          }
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Label color="red" icon={<ExclamationCircleIcon />}>
                            {data.criticalCount}
                          </Label>
                        </Tooltip>
                      )}
                      {data.warningCount > 0 && (
                        <Tooltip
                          content={
                            <AlertKpiTooltip
                              bucketLabel="Warning alerts"
                              rows={buildFleetAlertKpiRows(componentFiring, { severity: 'Warning' })}
                            />
                          }
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Label color="orange" icon={<ExclamationTriangleIcon />}>
                            {data.warningCount}
                          </Label>
                        </Tooltip>
                      )}
                      {data.infoCount > 0 && (
                        <Tooltip
                          content={
                            <AlertKpiTooltip
                              bucketLabel="Info alerts"
                              rows={buildFleetAlertKpiRows(componentFiring, { severity: 'Info' })}
                            />
                          }
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Label color="blue" icon={<InfoCircleIcon />}>
                            {data.infoCount}
                          </Label>
                        </Tooltip>
                      )}
                    </LabelGroup>
                  ) : (
                    <Label color="green" icon={<CheckCircleIcon />}>Healthy</Label>
                  )}
                </FlexItem>
                <FlexItem>
                  <AngleRightIcon />
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    );
  };

  return (
    <div style={{ 
      flex: 1,
      minHeight: 0,
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
      overflow: 'hidden',
    }}>
      {/* Breadcrumb Navigation */}
      <div style={{ 
        padding: '16px 8px', 
        borderBottom: '1px solid var(--pf-t--global--border--color--default)',
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        flexShrink: 0,
      }}>
        <Breadcrumb>
          <BreadcrumbItem>Observe</BreadcrumbItem>
          <BreadcrumbItem>
            <Button variant="link" isInline onClick={onBackToFleet}>
              All Clusters (Treemap)
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{cluster.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Main Content - Scrollable */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px' }}>
        <Stack hasGutter>
          {/* Cluster Health Status Card */}
          <StackItem>
            <Card>
              <CardBody>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Flex gap={{ default: 'gapLg' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        {/* Cluster Health Status Indicator */}
                        <div style={{ 
                          width: '64px', 
                          height: '64px', 
                          borderRadius: '50%', 
                          backgroundColor: getHealthStatusColor(clusterHealthStatus),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Icon size="xl" style={{ color: 'white' }}>
                            {clusterHealthStatus === 'critical' ? <ExclamationCircleIcon /> :
                             clusterHealthStatus === 'warning' ? <ExclamationTriangleIcon /> :
                             clusterHealthStatus === 'info' ? <InfoCircleIcon /> :
                             <CheckCircleIcon />}
                          </Icon>
                        </div>
                      </FlexItem>
                      <FlexItem>
                        <Stack>
                          <StackItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem>
                                <Title headingLevel="h2" size="xl">{cluster.name}</Title>
                              </FlexItem>
                              <FlexItem>
                                <Label 
                                  color={clusterHealthStatus === 'critical' ? 'red' : 
                                         clusterHealthStatus === 'warning' ? 'orange' : 
                                         clusterHealthStatus === 'info' ? 'blue' : 'green'}
                                >
                                  {clusterHealthStatus.charAt(0).toUpperCase() + clusterHealthStatus.slice(1)}
                                </Label>
                              </FlexItem>
                            </Flex>
                          </StackItem>
                          <StackItem>
                            <Flex gap={{ default: 'gapMd' }}>
                              <FlexItem>
                                <Label color="grey" icon={<MapMarkerAltIcon />}>{cluster.region}</Label>
                              </FlexItem>
                              <FlexItem>
                                <Label color="grey" icon={<CloudIcon />}>{cluster.cloudProvider}</Label>
                              </FlexItem>
                            </Flex>
                          </StackItem>
                          <StackItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                              {cluster.nodeCount} nodes • {cluster.podCount} pods
                            </Content>
                          </StackItem>
                        </Stack>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex gap={{ default: 'gapLg' }}>
                      <FlexItem>
                        <Stack>
                          <StackItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Total alerts</Content>
                          </StackItem>
                          <StackItem>
                            <Tooltip
                              content={<AlertKpiTooltip bucketLabel="Firing alerts" rows={buildFleetAlertKpiRows(firingAlertsAll)} />}
                              {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                            >
                              <span style={{ display: 'inline-block' }}>
                                <Title headingLevel="h3" size="lg">
                                  {firingAlertsAll.length}
                                </Title>
                              </span>
                            </Tooltip>
                          </StackItem>
                        </Stack>
                      </FlexItem>
                      <Divider orientation={{ default: 'vertical' }} />
                      <FlexItem>
                        <Stack>
                          <StackItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Critical</Content>
                          </StackItem>
                          <StackItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <Icon status="danger"><ExclamationCircleIcon /></Icon>
                              <Tooltip
                                content={
                                  <AlertKpiTooltip
                                    bucketLabel="Critical alerts"
                                    rows={buildFleetAlertKpiRows(firingAlertsAll, { severity: 'Critical' })}
                                  />
                                }
                                {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                              >
                                <span style={{ display: 'inline-block' }}>
                                  <Title headingLevel="h3" size="lg" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
                                    {firingAlertsAll.filter((a) => a.severity === 'Critical').length}
                                  </Title>
                                </span>
                              </Tooltip>
                            </Flex>
                          </StackItem>
                        </Stack>
                      </FlexItem>
                      <FlexItem>
                        <Stack>
                          <StackItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Warning</Content>
                          </StackItem>
                          <StackItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <Icon status="warning"><ExclamationTriangleIcon /></Icon>
                              <Tooltip
                                content={
                                  <AlertKpiTooltip
                                    bucketLabel="Warning alerts"
                                    rows={buildFleetAlertKpiRows(firingAlertsAll, { severity: 'Warning' })}
                                  />
                                }
                                {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                              >
                                <span style={{ display: 'inline-block' }}>
                                  <Title headingLevel="h3" size="lg" style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}>
                                    {firingAlertsAll.filter((a) => a.severity === 'Warning').length}
                                  </Title>
                                </span>
                              </Tooltip>
                            </Flex>
                          </StackItem>
                        </Stack>
                      </FlexItem>
                      <FlexItem>
                        <Stack>
                          <StackItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Info</Content>
                          </StackItem>
                          <StackItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <Icon status="info"><InfoCircleIcon /></Icon>
                              <Tooltip
                                content={
                                  <AlertKpiTooltip
                                    bucketLabel="Info alerts"
                                    rows={buildFleetAlertKpiRows(firingAlertsAll, { severity: 'Info' })}
                                  />
                                }
                                {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                              >
                                <span style={{ display: 'inline-block' }}>
                                  <Title headingLevel="h3" size="lg" style={{ color: 'var(--pf-t--global--color--status--info--default)' }}>
                                    {firingAlertsAll.filter((a) => a.severity === 'Info').length}
                                  </Title>
                                </span>
                              </Tooltip>
                            </Flex>
                          </StackItem>
                        </Stack>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </StackItem>

          {/* Alert Scope: Cluster */}
          <StackItem>
            <Card isPlain>
              <CardHeader>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem><Icon size="lg"><ClusterIcon /></Icon></FlexItem>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">Cluster</Title>
                      </FlexItem>
                      <FlexItem>
                        <Tooltip content="Monitor the health and stability of your control plane with these alerts. They cover foundational components like the Kubernetes API server, etcd database, and the scheduler. You can also add your own custom cluster components to this group to keep your foundation strong.">
                          <QuestionCircleIcon style={{ cursor: 'help', color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                      <FlexItem>
                        <Tooltip
                          content={<AlertKpiTooltip bucketLabel="Firing alerts" rows={buildFleetAlertKpiRows(clusterGroupAlerts)} />}
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Badge isRead>{clusterGroupAlerts.length} alerts</Badge>
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex gap={{ default: 'gapSm' }}>
                      {clusterGroupAlerts.filter(a => a.severity === 'Critical').length > 0 && (
                        <Tooltip
                          content={
                            <AlertKpiTooltip
                              bucketLabel="Critical alerts"
                              rows={buildFleetAlertKpiRows(clusterGroupAlerts, { severity: 'Critical' })}
                            />
                          }
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Label color="red" icon={<ExclamationCircleIcon />}>
                            {clusterGroupAlerts.filter(a => a.severity === 'Critical').length} Critical
                          </Label>
                        </Tooltip>
                      )}
                      {clusterGroupAlerts.filter(a => a.severity === 'Warning').length > 0 && (
                        <Tooltip
                          content={
                            <AlertKpiTooltip
                              bucketLabel="Warning alerts"
                              rows={buildFleetAlertKpiRows(clusterGroupAlerts, { severity: 'Warning' })}
                            />
                          }
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Label color="orange" icon={<ExclamationTriangleIcon />}>
                            {clusterGroupAlerts.filter(a => a.severity === 'Warning').length} Warning
                          </Label>
                        </Tooltip>
                      )}
                    </Flex>
                  </FlexItem>
                </Flex>
              </CardHeader>
              <CardBody>
                <Content component="p" style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Alerts related to the health and stability of the cluster's control plane. Covers foundational components like the Kubernetes API server, etcd database, scheduler, and network.
                </Content>
                <Grid hasGutter md={6} lg={4}>
                  {clusterComponents.map(renderComponentCard)}
                </Grid>
              </CardBody>
            </Card>
          </StackItem>

          {/* Alert Scope: Namespace */}
          <StackItem>
            <Card isPlain>
              <CardHeader>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem><Icon size="lg"><CubesIcon /></Icon></FlexItem>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">Namespace</Title>
                      </FlexItem>
                      <FlexItem>
                        <Tooltip content="Track the performance and resources of your worker cluster to stay ahead of issues. This group includes alerts for high CPU or memory use, disk pressure, and node network connectivity. You can also add custom node components to this group to better manage your specific application environments.">
                          <QuestionCircleIcon style={{ cursor: 'help', color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                      <FlexItem>
                        <Tooltip
                          content={<AlertKpiTooltip bucketLabel="Firing alerts" rows={buildFleetAlertKpiRows(namespaceGroupAlerts)} />}
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Badge isRead>{namespaceGroupAlerts.length} alerts</Badge>
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex gap={{ default: 'gapSm' }}>
                      {namespaceGroupAlerts.filter(a => a.severity === 'Critical').length > 0 && (
                        <Tooltip
                          content={
                            <AlertKpiTooltip
                              bucketLabel="Critical alerts"
                              rows={buildFleetAlertKpiRows(namespaceGroupAlerts, { severity: 'Critical' })}
                            />
                          }
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Label color="red" icon={<ExclamationCircleIcon />}>
                            {namespaceGroupAlerts.filter(a => a.severity === 'Critical').length} Critical
                          </Label>
                        </Tooltip>
                      )}
                      {namespaceGroupAlerts.filter(a => a.severity === 'Warning').length > 0 && (
                        <Tooltip
                          content={
                            <AlertKpiTooltip
                              bucketLabel="Warning alerts"
                              rows={buildFleetAlertKpiRows(namespaceGroupAlerts, { severity: 'Warning' })}
                            />
                          }
                          {...FLEET_ALERT_KPI_TOOLTIP_PROPS}
                        >
                          <Label color="orange" icon={<ExclamationTriangleIcon />}>
                            {namespaceGroupAlerts.filter(a => a.severity === 'Warning').length} Warning
                          </Label>
                        </Tooltip>
                      )}
                    </Flex>
                  </FlexItem>
                </Flex>
              </CardHeader>
              <CardBody>
                <Content component="p" style={{ marginBottom: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Alerts focused on user applications and services. Reports on the health and behavior of workloads, including pod crashes, replica mismatches, storage issues, and resource quota violations within a namespace.
                </Content>
                <Grid hasGutter md={6} lg={4}>
                  {namespaceComponents.map(renderComponentCard)}
                </Grid>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </div>
    </div>
  );
};
