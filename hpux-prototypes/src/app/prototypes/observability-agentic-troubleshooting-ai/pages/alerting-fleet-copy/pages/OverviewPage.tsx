/**
 * Overview Page for Multi-cluster Alerting UI V2
 * 
 * Provides high-level fleet metrics, cluster health, alerts summary with timeline.
 * Clicking on alert details navigates to the alerting page with pre-applied filters.
 * Based on single-cluster overview mockup, adapted for multi-cluster fleet view.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardExpandableContent,
  Content,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Icon,
  Label,
  Progress,
  ProgressMeasureLocation,
  Stack,
  StackItem,
  Title,
  Button,
  Tooltip,
  Tabs,
  Tab,
  TabTitleText,
  Badge,
  ToggleGroup,
  ToggleGroupItem,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Dropdown,
  DropdownList,
  DropdownItem,
  Checkbox,
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
  ClusterIcon,
  CubesIcon,
  ServerIcon,
  OutlinedBellIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  SyncIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CogIcon,
  ExternalLinkAltIcon,
  ListIcon,
  ChartLineIcon,
  WrenchIcon,
  SearchIcon,
  BellIcon,
  HistoryIcon,
  FilterIcon,
  EllipsisVIcon,
} from '@patternfly/react-icons';

// Types
type AlertSeverity = 'Critical' | 'Warning' | 'Info';
type AlertGroup = 'Cluster' | 'Namespace';
type AlertComponent = 'ETCD' | 'API Server' | 'Scheduler' | 'Controller Manager' | 'Network' | 'Storage' | 'Nodes' | 'Pods' | 'Services' | 'Deployments' | 'StatefulSets';
type ACMClusterStatus = 'Ready' | 'Offline' | 'Pending Import' | 'Failed' | 'Unknown' | 'Hibernating' | 'Detaching' | 'Installing' | 'Degraded';
type OperatorStatus = 'Running' | 'Pending' | 'Failed';

interface AlertData {
  id: string;
  alertName: string;
  severity: AlertSeverity;
  status: 'firing' | 'pending' | 'resolved' | 'acknowledged';
  group: AlertGroup;
  component: AlertComponent;
  source: string;
  namespace: string;
  labels: Record<string, string>;
  triggeredAt: Date;
  duration: string;
  total: number;
  resource?: string;
  runbookUrl?: string;
  description?: string;
}

interface ClusterData {
  id: string;
  name: string;
  region: string;
  cloudProvider: string;
  nodeCount: number;
  podCount: number;
  namespaces: string[];
  labels: Record<string, string>;
  alerts: AlertData[];
  acmStatus: ACMClusterStatus;
  nodesReady: number;
  podsReady: number;
}

interface EventData {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
}

// Generate mock data
const now = new Date();

const generateMockClusters = (): ClusterData[] => {
  const alertNames = [
    'HighCPUUsage', 'MemoryPressure', 'ETCDLatencyHigh', 'PodCrashLooping', 
    'NodeNotReady', 'StorageIOHigh', 'NetworkLatencyHigh', 'KubeAPIServerDown',
    'SchedulerUnhealthy', 'ControllerManagerDown', 'CertificateExpiring',
    'DeploymentReplicaMismatch', 'ServiceEndpointDown', 'QuotaExceeded'
  ];
  const components: AlertComponent[] = ['ETCD', 'API Server', 'Scheduler', 'Controller Manager', 'Network', 'Storage', 'Nodes', 'Pods', 'Services', 'Deployments'];
  const groups: AlertGroup[] = ['Cluster', 'Namespace'];
  
  const clusters: ClusterData[] = [];
  
  for (let i = 1; i <= 45; i++) {
    const nodeCount = Math.floor(Math.random() * 20) + 3;
    const podCount = nodeCount * (Math.floor(Math.random() * 15) + 5);
    const nodesReady = nodeCount - Math.floor(Math.random() * 2);
    const podsReady = podCount - Math.floor(Math.random() * 10);
    
    const alertCount = Math.floor(Math.random() * 5);
    const alerts: AlertData[] = [];
    
    for (let j = 0; j < alertCount; j++) {
      const severity: AlertSeverity = Math.random() < 0.2 ? 'Critical' : Math.random() < 0.5 ? 'Warning' : 'Info';
      const minutesAgo = Math.floor(Math.random() * 1440) + 5;
      
      alerts.push({
        id: `alert-${i}-${j}`,
        alertName: alertNames[Math.floor(Math.random() * alertNames.length)],
        severity,
        status: 'firing',
        group: groups[Math.floor(Math.random() * groups.length)],
        component: components[Math.floor(Math.random() * components.length)],
        source: 'Prometheus',
        namespace: Math.random() < 0.5 ? 'kube-system' : 'production',
        labels: {},
        triggeredAt: new Date(now.getTime() - minutesAgo * 60000),
        duration: minutesAgo < 60 ? `${minutesAgo} minutes` : `${Math.floor(minutesAgo / 60)} hours`,
        total: Math.floor(Math.random() * 5) + 1,
      });
    }
    
    const acmStatuses: ACMClusterStatus[] = ['Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Degraded', 'Offline', 'Hibernating'];
    
    clusters.push({
      id: `cluster-${i}`,
      name: `cluster-${i}`,
      region: ['US East', 'US West', 'EU Central', 'Asia Pacific'][Math.floor(Math.random() * 4)],
      cloudProvider: ['AWS', 'GCP', 'Azure', 'On-Premise'][Math.floor(Math.random() * 4)],
      nodeCount,
      podCount,
      nodesReady,
      podsReady,
      namespaces: ['default', 'kube-system', 'monitoring'],
      labels: {},
      alerts,
      acmStatus: acmStatuses[Math.floor(Math.random() * acmStatuses.length)],
    });
  }
  
  return clusters;
};

const mockClusters = generateMockClusters();

const mockEvents: EventData[] = [
  { id: 'e1', type: 'error', title: 'Readiness probe failed', message: 'Readiness probe failed: Get https://10.131.0.7:5000/healthz: dial tcp 10.131.0.7:5000: connect: connection refused', timestamp: new Date(now.getTime() - 15 * 60000) },
  { id: 'e2', type: 'success', title: 'Successful assignment', message: 'Successfully assigned default/example to ip-10-0-130-149.ec2.internal', timestamp: new Date(now.getTime() - 32 * 60000) },
  { id: 'e3', type: 'info', title: 'Pulling image', message: 'Pulling image "openshift/hello-openshift"', timestamp: new Date(now.getTime() - 45 * 60000) },
  { id: 'e4', type: 'success', title: 'Created container', message: 'Created container hello-openshift', timestamp: new Date(now.getTime() - 60 * 60000) },
  { id: 'e5', type: 'warning', title: 'CPU utilization over 50%', message: 'Migrated 2 pods to other hosts', timestamp: new Date(now.getTime() - 90 * 60000) },
  { id: 'e6', type: 'error', title: 'Rook-osd-10-328949', message: 'Rebuild initiated as Disk 5 failed', timestamp: new Date(now.getTime() - 120 * 60000) },
];

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [lastRefresh, setLastRefresh] = React.useState(new Date());
  const [alertsTimeRange, setAlertsTimeRange] = React.useState('Last 7 days');
  const [isTimeRangeOpen, setIsTimeRangeOpen] = React.useState(false);
  const [clusterAlertsFilter, setClusterAlertsFilter] = React.useState(true);
  const [namespaceAlertsFilter, setNamespaceAlertsFilter] = React.useState(true);
  const [severityTabFilter, setSeverityTabFilter] = React.useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');

  // Calculate metrics
  const totalClusters = mockClusters.length;
  const healthyClusters = mockClusters.filter(c => c.alerts.filter(a => a.status === 'firing').length === 0 && c.acmStatus === 'Ready').length;
  const totalNodes = mockClusters.reduce((sum, c) => sum + c.nodeCount, 0);
  const nodesReady = mockClusters.reduce((sum, c) => sum + c.nodesReady, 0);
  const totalPods = mockClusters.reduce((sum, c) => sum + c.podCount, 0);
  const podsReady = mockClusters.reduce((sum, c) => sum + c.podsReady, 0);
  
  // Alert metrics
  const allFiringAlerts = mockClusters.flatMap(c => c.alerts.filter(a => a.status === 'firing'));
  const clusterAlerts = allFiringAlerts.filter(a => a.group === 'Cluster');
  const namespaceAlerts = allFiringAlerts.filter(a => a.group === 'Namespace');
  const totalAlerts = allFiringAlerts.length;
  const criticalAlerts = allFiringAlerts.filter(a => a.severity === 'Critical').length;
  const warningAlerts = allFiringAlerts.filter(a => a.severity === 'Warning').length;
  const infoAlerts = allFiringAlerts.filter(a => a.severity === 'Info').length;

  // Recently firing alerts (top 5)
  const recentlyFiringAlerts = React.useMemo(() => {
    let filtered = [...allFiringAlerts];
    if (severityTabFilter !== 'All') {
      filtered = filtered.filter(a => a.severity === severityTabFilter);
    }
    return filtered
      .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
      .slice(0, 5);
  }, [allFiringAlerts, severityTabFilter]);

  // Alerts timeline data (last 7 days) - with anomaly spike
  const alertsTimelineData = React.useMemo(() => {
    const days = 7;
    const data: { date: string; critical: number; warning: number; info: number; isAnomaly?: boolean; topAlerts?: string[] }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Add anomaly spike at 2 days ago (index 5)
      const isAnomalyDay = i === 2;
      
      data.push({
        date: dateStr,
        critical: isAnomalyDay ? 28 : Math.floor(Math.random() * 8) + (i === 0 ? criticalAlerts : 0),
        warning: isAnomalyDay ? 45 : Math.floor(Math.random() * 12) + (i === 0 ? warningAlerts : 0),
        info: isAnomalyDay ? 32 : Math.floor(Math.random() * 15) + (i === 0 ? infoAlerts : 0),
        isAnomaly: isAnomalyDay,
        topAlerts: isAnomalyDay ? ['EtcdMembersDown', 'KubeAPILatencyHigh', 'NodeMemoryPressure'] : undefined,
      });
    }
    
    return data;
  }, [criticalAlerts, warningAlerts, infoAlerts]);

  // Core operators status (aggregate across fleet)
  const coreOperatorsStatus = {
    total: totalClusters * 12, // Assuming 12 core operators per cluster
    running: Math.floor(totalClusters * 12 * 0.85),
    pending: Math.floor(totalClusters * 12 * 0.05),
    failed: Math.floor(totalClusters * 12 * 0.10),
  };

  // Workload operators status
  const workloadOperatorsStatus = {
    total: totalClusters * 12,
    running: Math.floor(totalClusters * 12 * 0.90),
    pending: Math.floor(totalClusters * 12 * 0.03),
    failed: Math.floor(totalClusters * 12 * 0.07),
  };

  // Operation statuses
  const operationStatuses = [
    { name: 'Dynamic plugins', status: 'healthy' as const },
    { name: 'Insights', status: 'healthy' as const },
    { name: 'Control panel', status: 'warning' as const },
    { name: 'Hardware', status: 'healthy' as const },
    { name: 'Storage', status: 'degraded' as const },
  ];

  // Navigate to alerting page with filters
  const navigateToAlerts = (filters: { severity?: AlertSeverity; group?: AlertGroup; component?: AlertComponent }) => {
    const params = new URLSearchParams();
    if (filters.severity) params.set('severity', filters.severity);
    if (filters.group) params.set('group', filters.group);
    if (filters.component) params.set('component', filters.component);
    
    navigate(`/core/observe/alerting?${params.toString()}`);
  };

  // Cluster status breakdown
  const statusBreakdown = React.useMemo(() => {
    const counts: Record<ACMClusterStatus, number> = {
      'Ready': 0, 'Offline': 0, 'Pending Import': 0, 'Failed': 0, 
      'Unknown': 0, 'Hibernating': 0, 'Detaching': 0, 'Installing': 0, 'Degraded': 0
    };
    mockClusters.forEach(c => counts[c.acmStatus]++);
    return counts;
  }, []);

  // Donut chart option generator
  const getDonutOption = (running: number, pending: number, failed: number, total: number) => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: [
        { value: running, name: 'Running', itemStyle: { color: 'var(--pf-t--global--color--status--success--default)' } },
        { value: pending, name: 'Pending', itemStyle: { color: 'var(--pf-t--global--color--status--info--default)' } },
        { value: failed, name: 'Failed', itemStyle: { color: 'var(--pf-t--global--color--status--danger--default)' } },
      ],
    }],
  });

  // Alerts timeline chart with anomaly detection
  const alertsTimelineOption = {
    tooltip: { 
      trigger: 'axis',
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const dataPoint = alertsTimelineData[dataIndex];
        let content = `<strong>${dataPoint.date}</strong><br/>`;
        params.forEach((param: any) => {
          content += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
        });
        if (dataPoint.isAnomaly && dataPoint.topAlerts) {
          content += `<br/><strong style="color: var(--pf-t--global--color--status--danger--default);">⚠️ Anomaly detected</strong><br/>`;
          content += `<strong>Top contributing alerts:</strong><br/>`;
          dataPoint.topAlerts.forEach((alert, idx) => {
            content += `${idx + 1}. ${alert}<br/>`;
          });
        }
        return content;
      }
    },
    legend: { 
      data: ['Critical', 'Warning', 'Info'],
      right: 0,
      top: 0,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: { 
      type: 'category', 
      boundaryGap: false, 
      data: alertsTimelineData.map(d => d.date),
      axisLine: { lineStyle: { color: 'var(--pf-t--global--border--color--default)' } },
      axisLabel: { color: 'var(--pf-t--global--text--color--subtle)' },
    },
    yAxis: { 
      type: 'value',
      axisLine: { lineStyle: { color: 'var(--pf-t--global--border--color--default)' } },
      axisLabel: { color: 'var(--pf-t--global--text--color--subtle)' },
      splitLine: { lineStyle: { color: 'var(--pf-t--global--border--color--default)', type: 'dashed' } },
      // Add marker line for anomaly threshold
      markLine: alertsTimelineData.some(d => d.isAnomaly) ? {
        silent: true,
        lineStyle: { type: 'dashed', color: 'var(--pf-t--global--color--status--danger--default)', width: 1 },
        data: [{ yAxis: 50, label: { show: false } }],
      } : undefined,
    },
    series: [
      { 
        name: 'Critical', 
        type: 'line', 
        stack: 'Total', 
        areaStyle: {}, 
        emphasis: { focus: 'series' }, 
        data: alertsTimelineData.map((d, idx) => ({
          value: d.critical,
          itemStyle: d.isAnomaly ? { 
            borderWidth: 3,
            borderColor: 'var(--pf-t--global--color--status--danger--default)',
            shadowBlur: 10,
            shadowColor: 'var(--pf-t--global--color--status--danger--default)'
          } : {}
        })), 
        itemStyle: { color: 'var(--pf-t--global--color--status--danger--default)' },
      },
      { 
        name: 'Warning', 
        type: 'line', 
        stack: 'Total', 
        areaStyle: {}, 
        emphasis: { focus: 'series' }, 
        data: alertsTimelineData.map((d, idx) => ({
          value: d.warning,
          itemStyle: d.isAnomaly ? { 
            borderWidth: 3,
            borderColor: 'var(--pf-t--global--color--status--warning--default)',
            shadowBlur: 10,
            shadowColor: 'var(--pf-t--global--color--status--warning--default)'
          } : {}
        })), 
        itemStyle: { color: 'var(--pf-t--global--color--status--warning--default)' },
      },
      { 
        name: 'Info', 
        type: 'line', 
        stack: 'Total', 
        areaStyle: {}, 
        emphasis: { focus: 'series' }, 
        data: alertsTimelineData.map((d, idx) => ({
          value: d.info,
          itemStyle: d.isAnomaly ? { 
            borderWidth: 3,
            borderColor: 'var(--pf-t--global--color--status--info--default)',
            shadowBlur: 10,
            shadowColor: 'var(--pf-t--global--color--status--info--default)'
          } : {}
        })), 
        itemStyle: { color: 'var(--pf-t--global--color--status--info--default)' },
      },
    ],
  };

  const getEventIcon = (type: EventData['type']) => {
    switch (type) {
      case 'error': return <Icon status="danger"><ExclamationCircleIcon /></Icon>;
      case 'warning': return <Icon status="warning"><ExclamationTriangleIcon /></Icon>;
      case 'success': return <Icon status="success"><CheckCircleIcon /></Icon>;
      case 'info': return <Icon status="info"><InfoCircleIcon /></Icon>;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 24px',
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        borderBottom: '1px solid var(--pf-t--global--border--color--default)'
      }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
            <FlexItem>
              <Breadcrumb>
                <BreadcrumbItem>Observe</BreadcrumbItem>
                <BreadcrumbItem isActive>Overview</BreadcrumbItem>
              </Breadcrumb>
            </FlexItem>
            <FlexItem>
              <Title headingLevel="h1" size="xl">Overview</Title>
            </FlexItem>
          </Flex>
          <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                <ClockIcon /> {lastRefresh.toLocaleTimeString()}
              </Content>
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" icon={<SyncIcon />} onClick={() => setLastRefresh(new Date())}>
                Refresh
              </Button>
            </FlexItem>
          </Flex>
        </Flex>
      </div>

      {/* Tab navigation */}
      <div style={{ 
        padding: '0 24px',
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        borderBottom: '1px solid var(--pf-t--global--border--color--default)'
      }}>
        <Tabs activeKey="fleet" aria-label="Overview tabs">
          <Tab eventKey="fleet" title={<TabTitleText>Fleet</TabTitleText>} />
        </Tabs>
      </div>

      {/* Main Content with Sidebar */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Sidebar - Details & Events */}
        <div style={{ 
          width: '280px', 
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          borderRight: '1px solid var(--pf-t--global--border--color--default)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Fleet Details */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
            <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>Fleet Details</Title>
            <Stack hasGutter>
              <StackItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Total clusters</Content>
                <Content component="p"><strong>{totalClusters}</strong></Content>
              </StackItem>
              <StackItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Healthy Clusters</Content>
                <Content component="p"><strong>{healthyClusters}</strong> / {totalClusters}</Content>
              </StackItem>
              <StackItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Total nodes</Content>
                <Content component="p"><strong>{totalNodes}</strong></Content>
              </StackItem>
              <StackItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Total pods</Content>
                <Content component="p"><strong>{totalPods.toLocaleString()}</strong></Content>
              </StackItem>
              <StackItem>
                <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Firing Alerts</Content>
                <Content component="p"><strong style={{ color: criticalAlerts > 0 ? 'var(--pf-t--global--color--status--danger--default)' : undefined }}>{totalAlerts}</strong></Content>
              </StackItem>
            </Stack>
            <div style={{ marginTop: '16px' }}>
              <Button variant="link" isInline icon={<CogIcon />} iconPosition="end">
                View settings
              </Button>
            </div>
          </div>

          {/* Events */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                <Title headingLevel="h3" size="md">Events</Title>
                <Dropdown
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle ref={toggleRef} variant="plain" aria-label="Events menu">
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  isOpen={false}
                >
                  <DropdownList>
                    <DropdownItem>View all</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </Flex>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px' }}>
              <Stack hasGutter>
                {mockEvents.map(event => (
                  <StackItem key={event.id}>
                    <div style={{ marginBottom: '8px' }}>
                      <Flex alignItems={{ default: 'alignItemsFlexStart' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>{getEventIcon(event.type)}</FlexItem>
                        <FlexItem style={{ flex: 1 }}>
                          <Content component="p" style={{ fontWeight: 'bold', marginBottom: '4px' }}>{event.title}</Content>
                          <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', wordBreak: 'break-word' }}>
                            {event.message}
                          </Content>
                          <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', display: 'block', marginTop: '4px' }}>
                            {formatTime(event.timestamp)}
                          </Content>
                        </FlexItem>
                      </Flex>
                    </div>
                    <Divider />
                  </StackItem>
                ))}
              </Stack>
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
              <Button variant="link" isInline icon={<CogIcon />} iconPosition="end">
                View settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <Stack hasGutter>
            {/* Fleet Health Section */}
            <StackItem>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                      <FlexItem>Fleet Health</FlexItem>
                      <FlexItem>
                        <Button variant="link" size="sm">View details</Button>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '16px' }}>
                    Monitor key performance metrics, resource usage, and availability for an at-a-glance view of your fleet's health.
                  </Content>
                  
                  <Grid hasGutter>
                    {/* Overall Health */}
                    <GridItem md={4}>
                      <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                          <FlexItem>
                            <Content component="p"><strong>Overall Health</strong></Content>
                          </FlexItem>
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              {healthyClusters === totalClusters ? (
                                <>
                                  <Icon status="success" size="lg"><CheckCircleIcon /></Icon>
                                  <Title headingLevel="h3" size="lg" style={{ color: 'var(--pf-t--global--color--status--success--default)' }}>Healthy</Title>
                                </>
                              ) : criticalAlerts > 0 ? (
                                <>
                                  <Icon status="danger" size="lg"><ExclamationCircleIcon /></Icon>
                                  <Title headingLevel="h3" size="lg" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>Critical Issues</Title>
                                </>
                              ) : (
                                <>
                                  <Icon status="warning" size="lg"><ExclamationTriangleIcon /></Icon>
                                  <Title headingLevel="h3" size="lg" style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}>Degraded</Title>
                                </>
                              )}
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                              {healthyClusters} of {totalClusters} clusters healthy
                            </Content>
                          </FlexItem>
                        </Flex>
                      </Card>
                    </GridItem>

                    {/* Nodes Ready */}
                    <GridItem md={4}>
                      <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                          <FlexItem>
                            <Content component="p"><strong>Nodes ready</strong></Content>
                          </FlexItem>
                          <FlexItem>
                            <Title headingLevel="h3" size="lg">{nodesReady} / {totalNodes}</Title>
                          </FlexItem>
                          <FlexItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                              {((nodesReady / totalNodes) * 100).toFixed(1)}% readiness
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <ReactECharts option={getDonutOption(nodesReady, totalNodes - nodesReady - Math.floor((totalNodes - nodesReady) / 2), Math.floor((totalNodes - nodesReady) / 2), totalNodes)} style={{ height: '80px' }} />
                          </FlexItem>
                          <FlexItem>
                            <Flex gap={{ default: 'gapMd' }}>
                              <FlexItem><Label color="green" isCompact>Running: {nodesReady}</Label></FlexItem>
                              <FlexItem><Label color="blue" isCompact>Pending: {Math.floor((totalNodes - nodesReady) / 2)}</Label></FlexItem>
                              <FlexItem><Label color="red" isCompact>Failed: {totalNodes - nodesReady - Math.floor((totalNodes - nodesReady) / 2)}</Label></FlexItem>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </Card>
                    </GridItem>

                    {/* Pods Ready */}
                    <GridItem md={4}>
                      <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                          <FlexItem>
                            <Content component="p"><strong>Pods ready</strong></Content>
                          </FlexItem>
                          <FlexItem>
                            <Title headingLevel="h3" size="lg">{podsReady.toLocaleString()} / {totalPods.toLocaleString()}</Title>
                          </FlexItem>
                          <FlexItem>
                            <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                              {((podsReady / totalPods) * 100).toFixed(1)}% readiness
                            </Content>
                          </FlexItem>
                          <FlexItem>
                            <ReactECharts option={getDonutOption(podsReady, Math.floor((totalPods - podsReady) / 3), totalPods - podsReady - Math.floor((totalPods - podsReady) / 3), totalPods)} style={{ height: '80px' }} />
                          </FlexItem>
                          <FlexItem>
                            <Flex gap={{ default: 'gapMd' }}>
                              <FlexItem><Label color="green" isCompact>Running: {podsReady.toLocaleString()}</Label></FlexItem>
                              <FlexItem><Label color="blue" isCompact>Pending: {Math.floor((totalPods - podsReady) / 3)}</Label></FlexItem>
                              <FlexItem><Label color="red" isCompact>Failed: {(totalPods - podsReady - Math.floor((totalPods - podsReady) / 3))}</Label></FlexItem>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </Card>
                    </GridItem>
                  </Grid>

                  {/* Second row - Operators and Statuses */}
                  <Grid hasGutter style={{ marginTop: '16px' }}>
                    <GridItem md={4}>
                      <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <Content component="p"><strong>Core operators</strong></Content>
                              <Tooltip content="Core operators across all clusters"><InfoCircleIcon /></Tooltip>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Title headingLevel="h3" size="lg">{coreOperatorsStatus.total}</Title>
                          </FlexItem>
                          <FlexItem>
                            <ReactECharts option={getDonutOption(coreOperatorsStatus.running, coreOperatorsStatus.pending, coreOperatorsStatus.failed, coreOperatorsStatus.total)} style={{ height: '80px' }} />
                          </FlexItem>
                          <FlexItem>
                            <Flex gap={{ default: 'gapMd' }}>
                              <FlexItem><Label color="green" isCompact>Running: {coreOperatorsStatus.running}</Label></FlexItem>
                              <FlexItem><Label color="blue" isCompact>Pending: {coreOperatorsStatus.pending}</Label></FlexItem>
                              <FlexItem><Label color="red" isCompact>Failed: {coreOperatorsStatus.failed}</Label></FlexItem>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </Card>
                    </GridItem>

                    <GridItem md={4}>
                      <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <Content component="p"><strong>Workload operators</strong></Content>
                              <Tooltip content="Workload operators across all clusters"><InfoCircleIcon /></Tooltip>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Title headingLevel="h3" size="lg">{workloadOperatorsStatus.total}</Title>
                          </FlexItem>
                          <FlexItem>
                            <ReactECharts option={getDonutOption(workloadOperatorsStatus.running, workloadOperatorsStatus.pending, workloadOperatorsStatus.failed, workloadOperatorsStatus.total)} style={{ height: '80px' }} />
                          </FlexItem>
                          <FlexItem>
                            <Flex gap={{ default: 'gapMd' }}>
                              <FlexItem><Label color="green" isCompact>Running: {workloadOperatorsStatus.running}</Label></FlexItem>
                              <FlexItem><Label color="blue" isCompact>Pending: {workloadOperatorsStatus.pending}</Label></FlexItem>
                              <FlexItem><Label color="red" isCompact>Failed: {workloadOperatorsStatus.failed}</Label></FlexItem>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </Card>
                    </GridItem>

                    <GridItem md={4}>
                      <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <Content component="p"><strong>Operation statuses</strong></Content>
                              <Tooltip content="Status of key operations"><InfoCircleIcon /></Tooltip>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Grid hasGutter>
                              {operationStatuses.map(op => (
                                <GridItem span={6} key={op.name}>
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                    <Icon status={op.status === 'healthy' ? 'success' : op.status === 'warning' ? 'warning' : 'danger'}>
                                      {op.status === 'healthy' ? <CheckCircleIcon /> : op.status === 'warning' ? <ExclamationTriangleIcon /> : <ExclamationCircleIcon />}
                                    </Icon>
                                    <Content component="small">{op.name}</Content>
                                  </Flex>
                                </GridItem>
                              ))}
                            </Grid>
                          </FlexItem>
                        </Flex>
                      </Card>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </StackItem>

            {/* Alerts Section */}
            <StackItem>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <Icon status="danger"><BellIcon /></Icon>
                      <span>Alerts</span>
                    </Flex>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '16px' }}>
                    Review and triage immediate, critical cluster health issues. For advanced filtering and alert management capabilities, go to{' '}
                    <Button variant="link" isInline onClick={() => navigate('/core/observe/alerting')}>Alerting</Button>.
                  </Content>

                  {/* Alert type filters */}
                  <Flex gap={{ default: 'gapMd' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Checkbox 
                        id="cluster-alerts-check" 
                        label={`Cluster alerts (${clusterAlerts.length})`} 
                        isChecked={clusterAlertsFilter}
                        onChange={(_, checked) => setClusterAlertsFilter(checked)}
                      />
                    </FlexItem>
                    <FlexItem>
                      <Checkbox 
                        id="namespace-alerts-check" 
                        label={`Namespace alerts (${namespaceAlerts.length})`} 
                        isChecked={namespaceAlertsFilter}
                        onChange={(_, checked) => setNamespaceAlertsFilter(checked)}
                      />
                    </FlexItem>
                  </Flex>

                  <Grid hasGutter>
                    {/* Alert summary cards */}
                    <GridItem md={5}>
                      <Grid hasGutter>
                        <GridItem span={6}>
                          <Card isPlain isClickable onClick={() => navigate('/core/observe/alerting')} style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                            <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                              <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Total firing alerts</Content>
                              <Title headingLevel="h2" size="2xl">{totalAlerts}</Title>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                <Icon status="success"><ArrowUpIcon /></Icon>
                                <Content component="small" style={{ color: 'var(--pf-t--global--color--status--success--default)' }}>
                                  Increased by 5% (24 hours)
                                </Content>
                              </Flex>
                            </Flex>
                          </Card>
                        </GridItem>
                        <GridItem span={6}>
                          <Card isPlain isClickable onClick={() => navigateToAlerts({ severity: 'Critical' })} style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                            <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                              <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Critical alerts</Content>
                              <Title headingLevel="h2" size="2xl" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
                                <ExclamationCircleIcon /> {criticalAlerts}
                              </Title>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                <Icon status="danger"><ArrowUpIcon /></Icon>
                                <Content component="small" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
                                  Increased by 2% (24 hours)
                                </Content>
                              </Flex>
                            </Flex>
                          </Card>
                        </GridItem>
                        <GridItem span={6}>
                          <Card isPlain isClickable onClick={() => navigateToAlerts({ severity: 'Warning' })} style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                            <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                              <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Warning alerts</Content>
                              <Title headingLevel="h2" size="2xl" style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}>
                                <ExclamationTriangleIcon /> {warningAlerts}
                              </Title>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                <Icon status="success"><ArrowDownIcon /></Icon>
                                <Content component="small" style={{ color: 'var(--pf-t--global--color--status--success--default)' }}>
                                  Decreased by 4% (24 hours)
                                </Content>
                              </Flex>
                            </Flex>
                          </Card>
                        </GridItem>
                        <GridItem span={6}>
                          <Card isPlain isClickable onClick={() => navigateToAlerts({ severity: 'Info' })} style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                            <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                              <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Info alerts</Content>
                              <Title headingLevel="h2" size="2xl" style={{ color: 'var(--pf-t--global--color--status--info--default)' }}>
                                <InfoCircleIcon /> {infoAlerts}
                              </Title>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                <Icon status="danger"><ArrowUpIcon /></Icon>
                                <Content component="small" style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>
                                  Increased by 6% (24 hours)
                                </Content>
                              </Flex>
                            </Flex>
                          </Card>
                        </GridItem>
                      </Grid>
                    </GridItem>

                    {/* Alert velocity and trends */}
                    <GridItem md={7}>
                      <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px' }}>
                        <Stack hasGutter>
                          <StackItem>
                            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <Content component="p"><strong>Alert velocity and trends</strong></Content>
                              <Dropdown
                                isOpen={isTimeRangeOpen}
                                onOpenChange={setIsTimeRangeOpen}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle ref={toggleRef} onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)} isExpanded={isTimeRangeOpen}>
                                    {alertsTimeRange}
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  {['Last 24 hours', 'Last 7 days', 'Last 30 days'].map(range => (
                                    <DropdownItem key={range} onClick={() => { setAlertsTimeRange(range); setIsTimeRangeOpen(false); }}>
                                      {range}
                                    </DropdownItem>
                                  ))}
                                </DropdownList>
                              </Dropdown>
                            </Flex>
                          </StackItem>
                          <StackItem>
                            <ReactECharts option={alertsTimelineOption} style={{ height: '200px' }} />
                          </StackItem>
                          {alertsTimelineData.some(d => d.isAnomaly) && (
                            <StackItem>
                              <Flex 
                                gap={{ default: 'gapSm' }} 
                                alignItems={{ default: 'alignItemsCenter' }}
                                style={{ 
                                  padding: '12px',
                                  backgroundColor: 'var(--pf-t--global--background--color--status--danger--default)',
                                  borderRadius: '4px',
                                  border: '1px solid var(--pf-t--global--border--color--status--danger--default)'
                                }}
                              >
                                <FlexItem>
                                  <ExclamationTriangleIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)' }} />
                                </FlexItem>
                                <FlexItem flex={{ default: 'flex_1' }}>
                                  <Stack>
                                    <StackItem>
                                      <strong style={{ color: 'var(--pf-t--global--text--color--status--danger--default)' }}>
                                        Anomaly detected 2 days ago
                                      </strong>
                                    </StackItem>
                                    <StackItem>
                                      <Content component="small" style={{ color: 'var(--pf-t--global--text--color--status--danger--default)' }}>
                                        Top contributing alerts:
                                      </Content>
                                      <Flex gap={{ default: 'gapSm' }} style={{ marginTop: '4px' }}>
                                        {alertsTimelineData.find(d => d.isAnomaly)?.topAlerts?.map((alert, idx) => (
                                          <FlexItem key={idx}>
                                            <Label 
                                              color="red" 
                                              isCompact
                                              onClick={() => navigateToAlerts({})}
                                              style={{ cursor: 'pointer' }}
                                            >
                                              {idx + 1}. {alert}
                                            </Label>
                                          </FlexItem>
                                        ))}
                                      </Flex>
                                    </StackItem>
                                  </Stack>
                                </FlexItem>
                                <FlexItem>
                                  <Button 
                                    variant="link" 
                                    isDanger 
                                    isInline 
                                    onClick={() => navigateToAlerts({})}
                                  >
                                    View details
                                  </Button>
                                </FlexItem>
                              </Flex>
                            </StackItem>
                          )}
                        </Stack>
                      </Card>
                    </GridItem>
                  </Grid>

                  {/* Recently firing alerts table */}
                  <div style={{ marginTop: '24px' }}>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                        <Content component="p"><strong>Recently firing alerts</strong></Content>
                        <Button variant="link" isInline onClick={() => navigate('/core/observe/alerting')}>View all alerts</Button>
                      </Flex>
                      <ToggleGroup aria-label="Severity filter">
                        {(['All', 'Critical', 'Warning', 'Info'] as const).map(sev => (
                          <ToggleGroupItem
                            key={sev}
                            text={sev}
                            isSelected={severityTabFilter === sev}
                            onChange={() => setSeverityTabFilter(sev)}
                          />
                        ))}
                      </ToggleGroup>
                    </Flex>

                    <Table aria-label="Recently firing alerts" variant="compact">
                      <Thead>
                        <Tr>
                          <Th>Alert name</Th>
                          <Th>Severity</Th>
                          <Th>Total</Th>
                          <Th>Duration</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {recentlyFiringAlerts.map(alert => (
                          <Tr key={alert.id} isClickable onRowClick={() => navigateToAlerts({ severity: alert.severity })}>
                            <Td>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                <Badge style={{ backgroundColor: 'var(--pf-t--global--color--nonstatus--purple--default)', color: 'white' }}>A</Badge>
                                <span>{alert.alertName}</span>
                              </Flex>
                            </Td>
                            <Td>
                              <Label 
                                color={alert.severity === 'Critical' ? 'red' : alert.severity === 'Warning' ? 'orange' : 'blue'} 
                                icon={alert.severity === 'Critical' ? <ExclamationCircleIcon /> : alert.severity === 'Warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                                isCompact
                              >
                                {alert.severity}
                              </Label>
                            </Td>
                            <Td>{alert.total}</Td>
                            <Td>{alert.duration}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>

                  {/* Troubleshooting tools */}
                  <Card isPlain style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
                    <Title headingLevel="h4" size="md" style={{ marginBottom: '12px' }}>Troubleshooting tools</Title>
                    <Stack hasGutter>
                      <StackItem>
                        <Button variant="link" isInline icon={<ChartLineIcon />} iconPosition="start">
                          View logs <Badge isRead style={{ marginLeft: '4px' }}>β</Badge>
                        </Button>
                      </StackItem>
                      <StackItem>
                        <Button variant="link" isInline icon={<ChartLineIcon />} iconPosition="start">
                          View metrics
                        </Button>
                      </StackItem>
                      <StackItem>
                        <Button variant="link" isInline icon={<WrenchIcon />} iconPosition="start">
                          Troubleshoot <Badge isRead style={{ marginLeft: '4px' }}>β</Badge>
                        </Button>
                      </StackItem>
                      <StackItem>
                        <Button variant="link" isInline icon={<BellIcon />} iconPosition="start">
                          Incident
                        </Button>
                      </StackItem>
                      <Divider />
                      <StackItem>
                        <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end">
                          How to troubleshoot with COO?
                        </Button>
                      </StackItem>
                      <StackItem>
                        <Button variant="link" isInline icon={<ExternalLinkAltIcon />} iconPosition="end">
                          What's new with OpenShift Observability
                        </Button>
                      </StackItem>
                    </Stack>
                  </Card>
                </CardBody>
              </Card>
            </StackItem>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
