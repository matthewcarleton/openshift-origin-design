import * as React from 'react';
import { getPatternFlyBodyFontFamily } from '@app/chartFontFamily';
import ReactECharts from 'echarts-for-react';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  CardFooter,
  Flex,
  FlexItem,
  Icon,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  SearchInput,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Button,
  Label,
  LabelGroup,
  Popover,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Divider,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Badge,
  Stack,
  StackItem,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  EmptyState,
  EmptyStateBody,
  Tabs,
  Tab,
  TabTitleText,
  TabTitleIcon,
  Switch,
  Checkbox,
  Dropdown,
  DropdownList,
  DropdownItem,
  ToggleGroup,
  ToggleGroupItem,
  Pagination,
  Tooltip,
  Progress,
  ProgressSize,
  Split,
  SplitItem,
  Breadcrumb,
  BreadcrumbItem,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCheck,
  DataListItemCells,
  DataListCell,
  DataListControl,
  DatePicker,
  TimePicker,
  Alert as PfAlert,
  AlertGroup as PfAlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  CodeBlock,
  CodeBlockCode,
  ClipboardCopy,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
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
  ChartDonut,
  ChartThemeColor,
  ChartArea,
  ChartGroup,
  ChartVoronoiContainer,
  ChartAxis,
  ChartBar,
  ChartStack,
} from '@patternfly/react-charts/victory';
import {
  BellIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  CubesIcon,
  FilterIcon,
  TimesIcon,
  SortAmountDownIcon,
  EllipsisVIcon,
  SyncIcon,
  ClockIcon,
  ListIcon,
  ThLargeIcon,
  TachometerAltIcon,
  CogIcon,
  OutlinedBellIcon,
  ServerIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  HistoryIcon,
  CheckIcon,
  BanIcon,
  RedoIcon,
  GripVerticalIcon,
  ColumnsIcon,
  SaveIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  SearchIcon,
  PlusIcon,
  AngleRightIcon,
  AngleDownIcon,
  BookmarkIcon,
  MapMarkerAltIcon,
  ClusterIcon,
  CubeIcon,
  CloudIcon,
} from '@patternfly/react-icons';

// ========================================
// DATA TYPES
// ========================================

type AlertSeverity = 'Critical' | 'Warning' | 'Info';
type AlertStatus = 'firing' | 'acknowledged' | 'resolved' | 'pending';
type ClusterStatus = 'critical' | 'warning' | 'info' | 'healthy';
type AlertGroup = 'Cluster' | 'Namespace';
type AlertComponent = 'kube-apiserver' | 'Storage' | 'Network' | 'etcd' | 'Scheduler' | 'Controller' | 'Workload' | 'Pod' | 'Quota';
type GroupByOption = 'none' | 'region' | 'cloudProvider' | 'team' | 'severity';
type SortByOption = 'severity' | 'alertCount' | 'clusterName' | 'lastFired';
type ViewMode = 'treemap' | 'summary';
type ImportanceSizing = 'nodeCount' | 'cpuCores' | 'totalMemory' | 'podCount' | 'vmCount' | 'totalAlerts' | 'cpuRequests' | 'memoryRequests';
type UserRole = 'admin' | 'namespaceOwner';

interface AlertData {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  alertName: string;
  clusterName: string;
  namespace: string;
  labels: Record<string, string>;
  summary: string;
  lastFired: string;
  lastFiredTimestamp: Date;
  details: string;
  source: string;
  count: number;
  group: AlertGroup;
  component: AlertComponent;
  description?: string;
  resource?: string;
}

interface ClusterData {
  id: string;
  name: string;
  region: string;
  cloudProvider: string;
  team: string;
  namespaces: string[];
  labels: Record<string, string>;
  alerts: AlertData[];
  nodeCount: number;
  podCount: number;
  cpuUsage: number;
  memoryUsage: number;
  cpuCores: number;
  totalMemory: number;
  vmCount: number;
  cpuRequests: number;
  memoryRequests: number;
}

interface TrendData {
  timestamp: string;
  critical: number;
  warning: number;
  info: number;
}

interface ColumnConfig {
  key: string;
  label: string;
  isVisible: boolean;
  isDisabled: boolean;
  order: number;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: {
    severity: AlertSeverity[];
    group: AlertGroup[];
    component: AlertComponent[];
    source: string[];
    searchValue: string;
  };
  hidden?: boolean;
}

interface ToastNotification {
  id: string;
  title: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  description?: string;
}

// ========================================
// MOCK DATA GENERATION
// ========================================

const now = new Date();
const mockTrendData: TrendData[] = [
  { timestamp: '6h ago', critical: 5, warning: 12, info: 8 },
  { timestamp: '5h ago', critical: 4, warning: 15, info: 10 },
  { timestamp: '4h ago', critical: 7, warning: 11, info: 6 },
  { timestamp: '3h ago', critical: 3, warning: 18, info: 9 },
  { timestamp: '2h ago', critical: 6, warning: 14, info: 7 },
  { timestamp: '1h ago', critical: 4, warning: 10, info: 5 },
  { timestamp: 'Now', critical: 5, warning: 8, info: 4 },
];

// Generate 45 clusters with comprehensive data
const generateMockClusters = (): ClusterData[] => {
  const regions = ['US East', 'US West', 'US Central', 'EU Central', 'EU West', 'Asia Pacific', 'South America'];
  const providers = ['AWS', 'GCP', 'Azure'];
  const teams = ['Platform', 'Data', 'QA', 'Development', 'Security', 'ML'];
  const envs = ['prod', 'staging', 'dev'];
  const alertNames = ['HighMemoryUsage', 'HighCPUUsage', 'PodCrashLoopBackOff', 'NodeNotReady', 'DiskPressure', 'NetworkLatency', 'ServiceUnavailable', 'QuotaWarning', 'CertExpiring', 'ETCDHighLatency'];
  const components: AlertComponent[] = ['kube-apiserver', 'Storage', 'Network', 'etcd', 'Scheduler', 'Controller', 'Workload', 'Pod', 'Quota'];
  const groups: AlertGroup[] = ['Cluster', 'Namespace'];
  const sources = ['Platform', 'User'];

  const clusters: ClusterData[] = [];

  for (let i = 1; i <= 45; i++) {
    const env = envs[Math.floor(Math.random() * envs.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const nodeCount = Math.floor(Math.random() * 20) + 3;
    const podCount = nodeCount * (Math.floor(Math.random() * 15) + 5);

    // Generate alerts for this cluster
    const alertCount = Math.floor(Math.random() * 6);
    const alerts: AlertData[] = [];

    for (let j = 0; j < alertCount; j++) {
      const severity: AlertSeverity = Math.random() < 0.2 ? 'Critical' : Math.random() < 0.5 ? 'Warning' : 'Info';
      const status: AlertStatus = Math.random() < 0.7 ? 'firing' : Math.random() < 0.9 ? 'acknowledged' : 'resolved';
      const alertName = alertNames[Math.floor(Math.random() * alertNames.length)];
      const minutesAgo = Math.floor(Math.random() * 120) + 1;

      alerts.push({
        id: `alert-${i}-${j}`,
        severity,
        status,
        alertName,
        clusterName: `cluster-${env}-${region.toLowerCase().replace(' ', '-')}-${i}`,
        namespace: Math.random() < 0.5 ? 'production' : Math.random() < 0.7 ? 'kube-system' : 'monitoring',
        labels: { env, severity: severity.toLowerCase(), team },
        summary: `${alertName} detected on cluster-${i}`,
        lastFired: minutesAgo < 60 ? `${minutesAgo} min ago` : `${Math.floor(minutesAgo / 60)} hour ago`,
        lastFiredTimestamp: new Date(now.getTime() - minutesAgo * 60000),
        details: `Detailed information about ${alertName}. This requires attention.`,
        source: sources[Math.floor(Math.random() * sources.length)],
        count: Math.floor(Math.random() * 10) + 1,
        group: groups[Math.floor(Math.random() * groups.length)],
        component: components[Math.floor(Math.random() * components.length)],
        description: `This alert indicates ${alertName.toLowerCase()} condition.`,
        resource: Math.random() < 0.3 ? `node-${Math.floor(Math.random() * 10) + 1}` : undefined,
      });
    }

    clusters.push({
      id: `cluster-${i}`,
      name: `${env}-${provider.toLowerCase()}-${region.toLowerCase().replace(' ', '-')}-${i}`,
      region,
      cloudProvider: provider,
      team,
      namespaces: ['production', 'kube-system', 'monitoring', 'logging'].slice(0, Math.floor(Math.random() * 3) + 2),
      labels: { env, tier: env === 'prod' ? 'critical' : 'standard' },
      alerts,
      nodeCount,
      podCount,
      cpuUsage: Math.floor(Math.random() * 60) + 20,
      memoryUsage: Math.floor(Math.random() * 60) + 25,
      cpuCores: nodeCount * 4,
      totalMemory: nodeCount * 16,
      vmCount: Math.floor(Math.random() * 10),
      cpuRequests: Math.floor(Math.random() * 50) + 10,
      memoryRequests: Math.floor(Math.random() * 40) + 15,
    });
  }

  return clusters;
};

const mockClusters: ClusterData[] = generateMockClusters();

// ========================================
// HELPER FUNCTIONS
// ========================================

const getClusterStatus = (cluster: ClusterData): ClusterStatus => {
  const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
  if (firingAlerts.some(a => a.severity === 'Critical')) return 'critical';
  if (firingAlerts.some(a => a.severity === 'Warning')) return 'warning';
  if (firingAlerts.some(a => a.severity === 'Info')) return 'info';
  return 'healthy';
};

const getStatusBackgroundColor = (status: ClusterStatus): string => {
  switch (status) {
    case 'critical': return '#c9190b';
    case 'warning': return '#f0ab00';
    case 'info': return '#6753ac';
    case 'healthy': return '#3e8635';
  }
};

const getSeverityLabelColor = (severity: AlertSeverity): 'red' | 'orange' | 'purple' => {
  switch (severity) {
    case 'Critical': return 'red';
    case 'Warning': return 'orange';
    case 'Info': return 'purple';
  }
};

const getStatusLabelColor = (status: AlertStatus): 'red' | 'blue' | 'green' => {
  switch (status) {
    case 'firing': return 'red';
    case 'acknowledged': return 'blue';
    case 'resolved': return 'green';
    case 'pending': return 'blue';
    default: return 'blue';
  }
};

const getSeverityIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case 'Critical': return <ExclamationCircleIcon />;
    case 'Warning': return <ExclamationTriangleIcon />;
    case 'Info': return <InfoCircleIcon />;
  }
};

const getUniqueValues = <T, K extends keyof T>(items: T[], key: K): string[] => {
  return Array.from(new Set(items.map(item => String(item[key])))).sort();
};

const getAllLabels = (clusters: ClusterData[]): string[] => {
  const labels = new Set<string>();
  clusters.forEach(cluster => {
    Object.entries(cluster.labels).forEach(([key, value]) => {
      labels.add(`${key}:${value}`);
    });
  });
  return Array.from(labels).sort();
};

const getAllNamespaces = (clusters: ClusterData[]): string[] => {
  const namespaces = new Set<string>();
  clusters.forEach(cluster => {
    cluster.namespaces.forEach(ns => namespaces.add(ns));
  });
  return Array.from(namespaces).sort();
};

const getAllAlerts = (clusters: ClusterData[]): AlertData[] => {
  return clusters.flatMap(c => c.alerts).sort((a, b) => b.lastFiredTimestamp.getTime() - a.lastFiredTimestamp.getTime());
};

const getTileValue = (cluster: ClusterData, sizing: ImportanceSizing, severityFilter: AlertSeverity[]): number => {
  switch (sizing) {
    case 'nodeCount': return cluster.nodeCount;
    case 'cpuCores': return cluster.cpuCores;
    case 'totalMemory': return cluster.totalMemory;
    case 'podCount': return cluster.podCount;
    case 'vmCount': return cluster.vmCount || 1;
    case 'cpuRequests': return cluster.cpuRequests;
    case 'memoryRequests': return cluster.memoryRequests;
    case 'totalAlerts':
      if (severityFilter.length === 0) {
        return cluster.alerts.filter(a => a.status === 'firing').length || 1;
      }
      return cluster.alerts.filter(a => a.status === 'firing' && severityFilter.includes(a.severity)).length || 1;
    default: return cluster.nodeCount;
  }
};

// ========================================
// TREEMAP HEATMAP COMPONENT
// ========================================

interface TreemapHeatmapProps {
  clusters: ClusterData[];
  groupBy: GroupByOption;
  importanceSizing: ImportanceSizing;
  severityFilter: AlertSeverity[];
  onDrillDown: (cluster: ClusterData) => void;
}

const TreemapHeatmap: React.FC<TreemapHeatmapProps> = ({
  clusters,
  groupBy,
  importanceSizing,
  severityFilter,
  onDrillDown,
}) => {
  const chartBodyFont = getPatternFlyBodyFontFamily();
  // PatternFly 6 color palette
  // Critical: Red, Warning: Orange, Info: Purple, Healthy: Green
  const pfColors = {
    critical: '#c9190b',    // PF danger/red
    warning: '#f0ab00',     // PF warning/orange  
    info: '#6753ac',        // PF purple
    healthy: '#3e8635',     // PF success/green
  };

  const getClusterColor = (cluster: ClusterData): string => {
    const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
    if (firingAlerts.some(a => a.severity === 'Critical')) return pfColors.critical;
    if (firingAlerts.some(a => a.severity === 'Warning')) return pfColors.warning;
    if (firingAlerts.some(a => a.severity === 'Info')) return pfColors.info;
    return pfColors.healthy;
  };

  const getStatusText = (cluster: ClusterData): string => {
    const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
    if (firingAlerts.some(a => a.severity === 'Critical')) return 'Critical';
    if (firingAlerts.some(a => a.severity === 'Warning')) return 'Warning';
    if (firingAlerts.some(a => a.severity === 'Info')) return 'Info';
    return 'Healthy';
  };

  const buildTreemapData = () => {
    if (groupBy === 'none') {
      return clusters.map(cluster => ({
        name: cluster.name,
        value: getTileValue(cluster, importanceSizing, severityFilter),
        itemStyle: { color: getClusterColor(cluster) },
        cluster,
      }));
    }

    const groups: Record<string, ClusterData[]> = {};
    clusters.forEach(cluster => {
      let key: string;
      if (groupBy === 'severity') {
        key = getClusterStatus(cluster).charAt(0).toUpperCase() + getClusterStatus(cluster).slice(1);
      } else {
        key = String(cluster[groupBy as keyof ClusterData]);
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(cluster);
    });

    return Object.entries(groups).map(([groupName, groupClusters]) => ({
      name: groupName,
      children: groupClusters.map(cluster => ({
        name: cluster.name,
        value: getTileValue(cluster, importanceSizing, severityFilter),
        itemStyle: { color: getClusterColor(cluster) },
        cluster,
      })),
    }));
  };

  const option = {
    tooltip: {
      confine: true,
      formatter: (info: any) => {
        if (!info.data?.cluster) {
          // Group header tooltip
          return `
            <div style="font-family: var(--pf-t--global--font--family--body);">
              <div style="font-size: 14px; font-weight: 600; color: #151515; margin-bottom: 4px;">${info.name}</div>
              <div style="font-size: 12px; color: #6a6e73;">${info.data?.children?.length || 0} clusters</div>
            </div>
          `;
        }
        const cluster = info.data.cluster as ClusterData;
        const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
        const critical = firingAlerts.filter(a => a.severity === 'Critical').length;
        const warning = firingAlerts.filter(a => a.severity === 'Warning').length;
        const infoCount = firingAlerts.filter(a => a.severity === 'Info').length;
        const totalAlerts = firingAlerts.length;
        const status = getStatusText(cluster);
        const statusColor = getClusterColor(cluster);
        
        return `
          <div style="font-family: var(--pf-t--global--font--family--body); min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};"></span>
              <span style="font-size: 14px; font-weight: 600; color: #151515;">${cluster.name}</span>
            </div>
            <div style="font-size: 12px; color: #6a6e73; margin-bottom: 8px;">${cluster.region} · ${cluster.cloudProvider}</div>
            <div style="display: flex; gap: 12px; margin-bottom: 8px;">
              <span style="font-size: 12px;"><span style="color: ${pfColors.critical}; font-weight: 600;">${critical}</span> Critical</span>
              <span style="font-size: 12px;"><span style="color: ${pfColors.warning}; font-weight: 600;">${warning}</span> Warning</span>
              <span style="font-size: 12px;"><span style="color: ${pfColors.info}; font-weight: 600;">${infoCount}</span> Info</span>
            </div>
            <div style="font-size: 12px; color: #6a6e73; padding-top: 8px; border-top: 1px solid #d2d2d2;">
              <span>Nodes: <strong style="color: #151515;">${cluster.nodeCount}</strong></span>
              <span style="margin-left: 12px;">Pods: <strong style="color: #151515;">${cluster.podCount}</strong></span>
            </div>
            <div style="font-size: 11px; color: #0066cc; margin-top: 8px;">Click to view alerts →</div>
          </div>
        `;
      },
      backgroundColor: '#ffffff',
      borderColor: '#d2d2d2',
      borderWidth: 1,
      borderRadius: 4,
      padding: 12,
      extraCssText: 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);',
      textStyle: { 
        color: '#151515', 
        fontSize: 12, 
        fontFamily: chartBodyFont,
      },
    },
    series: [{
      type: 'treemap',
      data: buildTreemapData(),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      roam: false,
      nodeClick: 'link',
      breadcrumb: {
        show: false,
      },
      label: {
        show: true,
        formatter: (params: any) => {
          const cluster = params.data?.cluster;
          if (cluster) {
            const firingAlerts = cluster.alerts.filter((a: AlertData) => a.status === 'firing');
            const alertCount = firingAlerts.length;
            return alertCount > 0 ? `{name|${params.name}}\n{count|${alertCount} alerts}` : `{name|${params.name}}`;
          }
          return `{name|${params.name}}`;
        },
        rich: {
          name: {
            fontSize: 11,
            fontWeight: 600,
            color: '#ffffff',
            fontFamily: chartBodyFont,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2,
          },
          count: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: chartBodyFont,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowBlur: 2,
          },
        },
        lineHeight: 14,
        align: 'center',
        verticalAlign: 'middle',
      },
      upperLabel: {
        show: groupBy !== 'none',
        height: 24,
        color: '#151515',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: chartBodyFont,
        backgroundColor: '#f5f5f5',
        borderRadius: 0,
        padding: [4, 8],
        formatter: (params: any) => {
          const childCount = params.data?.children?.length || 0;
          return childCount > 0 ? `${params.name} (${childCount})` : params.name;
        },
      },
      itemStyle: { 
        borderColor: '#ffffff', 
        borderWidth: 2, 
        gapWidth: 2,
      },
      emphasis: { 
        itemStyle: { 
          borderColor: '#0066cc', 
          borderWidth: 2,
        },
      },
      levels: [
        { 
          itemStyle: { 
            borderColor: '#ffffff', 
            borderWidth: 3, 
            gapWidth: 3,
          },
          upperLabel: {
            show: groupBy !== 'none',
            height: 26,
            fontSize: 13,
            fontWeight: 600,
          },
        },
        { 
          itemStyle: { 
            borderColor: '#ffffff', 
            borderWidth: 2, 
            gapWidth: 2,
          },
        },
      ],
      animation: true,
      animationDurationUpdate: 200,
      animationEasing: 'cubicOut',
    }],
  };

  const handleClick = (params: any) => {
    if (params.data?.cluster) {
      onDrillDown(params.data.cluster);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Treemap container - responsive height */}
      <div style={{ width: '100%', height: '400px', minHeight: '300px' }}>
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }} 
          onEvents={{ click: handleClick }}
          opts={{ renderer: 'svg' }}
        />
      </div>
      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px', 
        padding: '12px 16px',
        borderTop: '1px solid #d2d2d2',
        marginTop: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: pfColors.critical }}></span>
          <span style={{ fontSize: '12px', color: '#151515' }}>Critical</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: pfColors.warning }}></span>
          <span style={{ fontSize: '12px', color: '#151515' }}>Warning</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: pfColors.info }}></span>
          <span style={{ fontSize: '12px', color: '#151515' }}>Info</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: pfColors.healthy }}></span>
          <span style={{ fontSize: '12px', color: '#151515' }}>Healthy</span>
        </div>
      </div>
    </div>
  );
};

// ========================================
// FILTER PANEL COMPONENT
// ========================================

interface FilterPanelProps {
  regionFilter: string[];
  setRegionFilter: (v: string[]) => void;
  clusterFilter: string[];
  setClusterFilter: (v: string[]) => void;
  namespaceFilter: string[];
  setNamespaceFilter: (v: string[]) => void;
  severityFilter: AlertSeverity[];
  setSeverityFilter: (v: AlertSeverity[]) => void;
  groupFilter: AlertGroup[];
  setGroupFilter: (v: AlertGroup[]) => void;
  componentFilter: AlertComponent[];
  setComponentFilter: (v: AlertComponent[]) => void;
  regions: string[];
  clusterNames: string[];
  namespaces: string[];
  onClose: () => void;
  savedFilters: SavedFilter[];
  onApplySavedFilter: (filter: SavedFilter) => void;
  onSaveFilter: (name: string) => void;
  onDeleteSavedFilter: (id: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  regionFilter, setRegionFilter,
  clusterFilter, setClusterFilter,
  namespaceFilter, setNamespaceFilter,
  severityFilter, setSeverityFilter,
  groupFilter, setGroupFilter,
  componentFilter, setComponentFilter,
  regions, clusterNames, namespaces,
  onClose,
  savedFilters, onApplySavedFilter, onSaveFilter, onDeleteSavedFilter,
}) => {
  const allSeverities: AlertSeverity[] = ['Critical', 'Warning', 'Info'];
  const allGroups: AlertGroup[] = ['Cluster', 'Namespace'];
  const clusterComponents: AlertComponent[] = ['kube-apiserver', 'etcd', 'Scheduler', 'Controller', 'Network'];
  const namespaceComponents: AlertComponent[] = ['Workload', 'Pod', 'Storage', 'Quota', 'Network'];
  const allComponents: AlertComponent[] = ['kube-apiserver', 'Storage', 'Network', 'etcd', 'Scheduler', 'Controller', 'Workload', 'Pod', 'Quota'];

  // Dropdown open states
  const [isRegionOpen, setIsRegionOpen] = React.useState(false);
  const [isClusterOpen, setIsClusterOpen] = React.useState(false);
  const [isNamespaceOpen, setIsNamespaceOpen] = React.useState(false);
  const [isComponentOpen, setIsComponentOpen] = React.useState(false);

  // Search values for dropdowns
  const [regionSearchValue, setRegionSearchValue] = React.useState('');
  const [clusterSearchValue, setClusterSearchValue] = React.useState('');
  const [namespaceSearchValue, setNamespaceSearchValue] = React.useState('');
  const [componentSearchValue, setComponentSearchValue] = React.useState('');

  const hasActiveFilters = regionFilter.length > 0 || clusterFilter.length > 0 || namespaceFilter.length > 0 || 
    severityFilter.length > 0 || groupFilter.length > 0 || componentFilter.length > 0;

  const clearAllFilters = () => {
    setRegionFilter([]);
    setClusterFilter([]);
    setNamespaceFilter([]);
    setSeverityFilter([]);
    setGroupFilter([]);
    setComponentFilter([]);
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

  // Filtered options based on search
  const filteredRegions = regions.filter(r => r.toLowerCase().includes(regionSearchValue.toLowerCase()));
  const filteredClusters = clusterNames.filter(c => c.toLowerCase().includes(clusterSearchValue.toLowerCase()));
  const filteredNamespaces = namespaces.filter(n => n.toLowerCase().includes(namespaceSearchValue.toLowerCase()));
  const filteredComponents = availableComponents.filter(c => c.toLowerCase().includes(componentSearchValue.toLowerCase()));

  return (
    <Card>
      <CardHeader>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem><CardTitle><FilterIcon /> Filters</CardTitle></FlexItem>
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
                    {region}
                  </SelectOption>
                ))}
                {filteredRegions.length === 0 && (
                  <SelectOption isDisabled>No regions found</SelectOption>
                )}
              </SelectList>
            </Select>
            {regionFilter.length > 0 && (
              <LabelGroup style={{ marginTop: '8px' }}>
                {regionFilter.map(r => (
                  <Label key={r} color="teal" onClose={() => setRegionFilter(regionFilter.filter(x => x !== r))} icon={<MapMarkerAltIcon />}>
                    {r}
                  </Label>
                ))}
              </LabelGroup>
            )}
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
                    {cluster}
                  </SelectOption>
                ))}
                {filteredClusters.length === 0 && (
                  <SelectOption isDisabled>No clusters found</SelectOption>
                )}
              </SelectList>
            </Select>
            {clusterFilter.length > 0 && (
              <LabelGroup style={{ marginTop: '8px' }}>
                {clusterFilter.map(c => (
                  <Label key={c} color="purple" onClose={() => setClusterFilter(clusterFilter.filter(x => x !== c))} icon={<ClusterIcon />}>
                    {c}
                  </Label>
                ))}
              </LabelGroup>
            )}
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
                    {ns}
                  </SelectOption>
                ))}
                {filteredNamespaces.length === 0 && (
                  <SelectOption isDisabled>No namespaces found</SelectOption>
                )}
              </SelectList>
            </Select>
            {namespaceFilter.length > 0 && (
              <LabelGroup style={{ marginTop: '8px' }}>
                {namespaceFilter.map(n => (
                  <Label key={n} color="blue" onClose={() => setNamespaceFilter(namespaceFilter.filter(x => x !== n))} icon={<CubesIcon />}>
                    {n}
                  </Label>
                ))}
              </LabelGroup>
            )}
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

          {/* Group Checkboxes */}
          <StackItem>
            <Content component="small" className="pf-v6-u-mb-sm"><strong>Group</strong></Content>
            <Flex gap={{ default: 'gapMd' }}>
              {allGroups.map(grp => (
                <FlexItem key={grp}>
                  <Checkbox
                    id={`grp-${grp}`}
                    label={grp}
                    isChecked={groupFilter.includes(grp)}
                    onChange={(_, checked) => {
                      if (checked) {
                        setGroupFilter([...groupFilter, grp]);
                      } else {
                        setGroupFilter(groupFilter.filter(g => g !== grp));
                        // Clear component filter if no groups selected
                        if (groupFilter.length === 1) {
                          setComponentFilter([]);
                        }
                      }
                    }}
                  />
                </FlexItem>
              ))}
            </Flex>
          </StackItem>

          <Divider />

          {/* Component Dropdown (based on selected group) */}
          <StackItem>
            <Content component="small" className="pf-v6-u-mb-sm">
              <strong>
                {groupFilter.length > 0 ? `Component (in: ${groupFilter.join(', ')})` : 'Component'}
              </strong>
            </Content>
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
            {componentFilter.length > 0 && (
              <LabelGroup style={{ marginTop: '8px' }}>
                {componentFilter.map(c => (
                  <Label key={c} color="green" onClose={() => setComponentFilter(componentFilter.filter(x => x !== c))} icon={<CogIcon />}>
                    {c}
                  </Label>
                ))}
              </LabelGroup>
            )}
          </StackItem>

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

// ========================================
// CROSS-CLUSTER INSIGHTS CARD
// ========================================

interface CrossClusterInsightsCardProps {
  clusters: ClusterData[];
  onAlertRuleClick: (alertName: string) => void;
  onClusterClick: (cluster: ClusterData) => void;
}

const CrossClusterInsightsCard: React.FC<CrossClusterInsightsCardProps> = ({
  clusters,
  onAlertRuleClick,
  onClusterClick,
}) => {
  const [itemCount, setItemCount] = React.useState<number>(5);
  const [isItemCountOpen, setIsItemCountOpen] = React.useState(false);

  // Calculate top firing alert rules
  const alertRuleCounts = React.useMemo(() => {
    const counts: Record<string, { count: number; clusters: string[]; severity: AlertSeverity }> = {};
    clusters.forEach(cluster => {
      cluster.alerts.filter(a => a.status === 'firing').forEach(alert => {
        if (!counts[alert.alertName]) {
          counts[alert.alertName] = { count: 0, clusters: [], severity: alert.severity };
        }
        counts[alert.alertName].count++;
        if (!counts[alert.alertName].clusters.includes(cluster.name)) {
          counts[alert.alertName].clusters.push(cluster.name);
        }
      });
    });
    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, itemCount);
  }, [clusters, itemCount]);

  // Calculate most impacted components
  const componentCounts = React.useMemo(() => {
    const counts: Record<string, { count: number; critical: number; warning: number; info: number }> = {};
    clusters.forEach(cluster => {
      cluster.alerts.filter(a => a.status === 'firing').forEach(alert => {
        if (!counts[alert.component]) {
          counts[alert.component] = { count: 0, critical: 0, warning: 0, info: 0 };
        }
        counts[alert.component].count++;
        if (alert.severity === 'Critical') counts[alert.component].critical++;
        else if (alert.severity === 'Warning') counts[alert.component].warning++;
        else counts[alert.component].info++;
      });
    });
    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, itemCount);
  }, [clusters, itemCount]);

  return (
    <Card>
      <CardHeader>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <CardTitle>Cross-Cluster Insights</CardTitle>
          </FlexItem>
          <FlexItem>
            <Select
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle ref={toggleRef} onClick={() => setIsItemCountOpen(!isItemCountOpen)} isExpanded={isItemCountOpen} style={{ width: '100px' }}>
                  Show {itemCount}
                </MenuToggle>
              )}
              onSelect={(_, value) => { setItemCount(Number(value)); setIsItemCountOpen(false); }}
              isOpen={isItemCountOpen}
              onOpenChange={setIsItemCountOpen}
              selected={itemCount}
            >
              <SelectList>
                <SelectOption value={5}>5</SelectOption>
                <SelectOption value={10}>10</SelectOption>
                <SelectOption value={20}>20</SelectOption>
              </SelectList>
            </Select>
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardBody>
        <Grid hasGutter>
          <GridItem md={6}>
            <Title headingLevel="h4" size="md" style={{ marginBottom: '16px' }}>Top Firing Alert Rules</Title>
            <Table aria-label="Top firing alert rules" variant="compact">
              <Thead>
                <Tr>
                  <Th>Alert Rule</Th>
                  <Th>Severity</Th>
                  <Th>Count</Th>
                  <Th>Clusters</Th>
                </Tr>
              </Thead>
              <Tbody>
                {alertRuleCounts.map(rule => (
                  <Tr key={rule.name}>
                    <Td>
                      <Button variant="link" isInline onClick={() => onAlertRuleClick(rule.name)}>
                        {rule.name}
                      </Button>
                    </Td>
                    <Td>
                      <Label color={getSeverityLabelColor(rule.severity)} isCompact>{rule.severity}</Label>
                    </Td>
                    <Td><Badge>{rule.count}</Badge></Td>
                    <Td>
                      <Popover
                        headerContent="Clusters firing this alert"
                        bodyContent={
                          <Stack hasGutter>
                            {rule.clusters.map(c => (
                              <StackItem key={c}>{c}</StackItem>
                            ))}
                          </Stack>
                        }
                      >
                        <Badge isRead style={{ cursor: 'pointer' }}>{rule.clusters.length} clusters</Badge>
                      </Popover>
                    </Td>
                  </Tr>
                ))}
                {alertRuleCounts.length === 0 && (
                  <Tr>
                    <Td colSpan={4}>
                      <Content component="small" className="pf-v6-u-color-200">No firing alerts</Content>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </GridItem>
          <GridItem md={6}>
            <Title headingLevel="h4" size="md" style={{ marginBottom: '16px' }}>Most Impacted Components</Title>
            <Table aria-label="Most impacted components" variant="compact">
              <Thead>
                <Tr>
                  <Th>Component</Th>
                  <Th>Total</Th>
                  <Th>Breakdown</Th>
                </Tr>
              </Thead>
              <Tbody>
                {componentCounts.map(comp => (
                  <Tr key={comp.name}>
                    <Td><Label isCompact variant="outline">{comp.name}</Label></Td>
                    <Td><Badge>{comp.count}</Badge></Td>
                    <Td>
                      <Flex gap={{ default: 'gapSm' }}>
                        {comp.critical > 0 && <FlexItem><Label color="red" isCompact>{comp.critical}</Label></FlexItem>}
                        {comp.warning > 0 && <FlexItem><Label color="orange" isCompact>{comp.warning}</Label></FlexItem>}
                        {comp.info > 0 && <FlexItem><Label color="purple" isCompact>{comp.info}</Label></FlexItem>}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
                {componentCounts.length === 0 && (
                  <Tr>
                    <Td colSpan={3}>
                      <Content component="small" className="pf-v6-u-color-200">No impacted components</Content>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};

// ========================================
// ALL ALERTS CARD (AGGREGATED VIEW)
// ========================================

interface AggregatedAlert {
  alertName: string;
  severity: AlertSeverity;
  totalCount: number;
  clusters: { name: string; cluster: ClusterData; count: number; lastFired: string }[];
  component: AlertComponent;
  group: AlertGroup;
}

interface AllAlertsCardProps {
  clusters: ClusterData[];
  alertNameFilter: string | null;
  onClearAlertNameFilter: () => void;
  onClusterClick: (cluster: ClusterData) => void;
  onAlertClick: (alert: AlertData) => void;
}

const AllAlertsCard: React.FC<AllAlertsCardProps> = ({
  clusters,
  alertNameFilter,
  onClearAlertNameFilter,
  onClusterClick,
  onAlertClick,
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [severityFilter, setSeverityFilter] = React.useState<AlertSeverity[]>([]);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [expandedAlerts, setExpandedAlerts] = React.useState<string[]>([]);
  const [isAggregated, setIsAggregated] = React.useState(true);

  // Get all alerts with cluster info
  const allAlerts = React.useMemo(() => {
    return clusters.flatMap(cluster => 
      cluster.alerts.map(alert => ({ ...alert, clusterName: cluster.name, cluster }))
    ).filter(a => a.status === 'firing');
  }, [clusters]);

  // Create aggregated alerts (grouped by alert name and severity)
  const aggregatedAlerts = React.useMemo(() => {
    const alertMap = new Map<string, AggregatedAlert>();
    
    allAlerts.forEach(alert => {
      const key = `${alert.alertName}-${alert.severity}`;
      
      if (!alertMap.has(key)) {
        alertMap.set(key, {
          alertName: alert.alertName,
          severity: alert.severity,
          totalCount: 0,
          clusters: [],
          component: alert.component,
          group: alert.group,
        });
      }
      
      const agg = alertMap.get(key)!;
      agg.totalCount++;
      
      const existingCluster = agg.clusters.find(c => c.name === alert.clusterName);
      if (existingCluster) {
        existingCluster.count++;
      } else {
        agg.clusters.push({
          name: alert.clusterName,
          cluster: (alert as any).cluster,
          count: 1,
          lastFired: alert.lastFired,
        });
      }
    });
    
    return Array.from(alertMap.values()).sort((a, b) => {
      // Sort by severity first, then by count
      const severityOrder = { Critical: 0, Warning: 1, Info: 2 };
      const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (sevDiff !== 0) return sevDiff;
      return b.totalCount - a.totalCount;
    });
  }, [allAlerts]);

  // Filter aggregated alerts
  const filteredAggregatedAlerts = React.useMemo(() => {
    return aggregatedAlerts.filter(alert => {
      if (alertNameFilter && alert.alertName !== alertNameFilter) return false;
      if (severityFilter.length > 0 && !severityFilter.includes(alert.severity)) return false;
      if (searchValue && !alert.alertName.toLowerCase().includes(searchValue.toLowerCase())) return false;
      return true;
    });
  }, [aggregatedAlerts, alertNameFilter, severityFilter, searchValue]);

  // Filter individual alerts (for non-aggregated view)
  const filteredAlerts = React.useMemo(() => {
    return allAlerts.filter(alert => {
      if (alertNameFilter && alert.alertName !== alertNameFilter) return false;
      if (severityFilter.length > 0 && !severityFilter.includes(alert.severity)) return false;
      if (searchValue && !alert.alertName.toLowerCase().includes(searchValue.toLowerCase()) && 
          !alert.clusterName.toLowerCase().includes(searchValue.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.lastFiredTimestamp.getTime() - a.lastFiredTimestamp.getTime());
  }, [allAlerts, alertNameFilter, severityFilter, searchValue]);

  const paginatedAggregatedAlerts = filteredAggregatedAlerts.slice((page - 1) * perPage, page * perPage);
  const paginatedAlerts = filteredAlerts.slice((page - 1) * perPage, page * perPage);

  const toggleExpanded = (alertKey: string) => {
    if (expandedAlerts.includes(alertKey)) {
      setExpandedAlerts(expandedAlerts.filter(k => k !== alertKey));
    } else {
      setExpandedAlerts([...expandedAlerts, alertKey]);
    }
  };

  const totalItems = isAggregated ? filteredAggregatedAlerts.length : filteredAlerts.length;

  return (
    <Card id="all-alerts-card">
      <CardHeader>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <CardTitle>
              All Alerts {isAggregated ? `(${filteredAggregatedAlerts.length} alert rules across ${allAlerts.length} instances)` : `(${filteredAlerts.length} instances)`}
            </CardTitle>
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <SearchInput
                    placeholder="Search alerts..."
                    value={searchValue}
                    onChange={(_, value) => setSearchValue(value)}
                    onClear={() => setSearchValue('')}
                    style={{ width: '250px' }}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Flex gap={{ default: 'gapSm' }}>
                    {(['Critical', 'Warning', 'Info'] as AlertSeverity[]).map(sev => (
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
                </ToolbarItem>
                <ToolbarItem>
                  <Switch
                    id="aggregate-all-alerts-switch"
                    label="Aggregate by rule"
                    isChecked={isAggregated}
                    onChange={(_, checked) => {
                      setIsAggregated(checked);
                      setPage(1);
                      setExpandedAlerts([]);
                    }}
                  />
                </ToolbarItem>
                {alertNameFilter && (
                  <ToolbarItem>
                    <Label color="blue" onClose={onClearAlertNameFilter}>
                      Alert: {alertNameFilter}
                    </Label>
                  </ToolbarItem>
                )}
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={totalItems}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_, p) => setPage(p)}
                    onPerPageSelect={(_, pp) => setPerPage(pp)}
                    isCompact
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </StackItem>
          <StackItem>
            {totalItems === 0 ? (
              <EmptyState titleText="No alerts found" icon={CheckCircleIcon}>
                <EmptyStateBody>No alerts match the current filters.</EmptyStateBody>
              </EmptyState>
            ) : isAggregated ? (
              /* Aggregated View */
              <Table aria-label="Aggregated alerts table" variant="compact" isExpandable>
                <Thead>
                  <Tr>
                    <Th screenReaderText="Expand" />
                    <Th>Severity</Th>
                    <Th>Alert Name</Th>
                    <Th>Clusters</Th>
                    <Th>Total Instances</Th>
                    <Th>Group</Th>
                    <Th>Component</Th>
                  </Tr>
                </Thead>
                {paginatedAggregatedAlerts.map((agg, idx) => {
                  const alertKey = `${agg.alertName}-${agg.severity}`;
                  const isExpanded = expandedAlerts.includes(alertKey);
                  return (
                    <Tbody key={alertKey} isExpanded={isExpanded}>
                      <Tr>
                        <Td
                          expand={{
                            rowIndex: idx,
                            isExpanded,
                            onToggle: () => toggleExpanded(alertKey),
                          }}
                        />
                        <Td>
                          <Label color={getSeverityLabelColor(agg.severity)} icon={getSeverityIcon(agg.severity)} isCompact>
                            {agg.severity}
                          </Label>
                        </Td>
                        <Td>
                          <strong>{agg.alertName}</strong>
                        </Td>
                        <Td>
                          <Badge isRead>{agg.clusters.length} cluster{agg.clusters.length !== 1 ? 's' : ''}</Badge>
                        </Td>
                        <Td>
                          <Badge>{agg.totalCount}</Badge>
                        </Td>
                        <Td><Label isCompact>{agg.group}</Label></Td>
                        <Td><Label isCompact variant="outline">{agg.component}</Label></Td>
                      </Tr>
                      <Tr isExpanded={isExpanded}>
                        <Td colSpan={7}>
                          <ExpandableRowContent>
                            <Stack hasGutter>
                              <StackItem>
                                <Content component="small" className="pf-v6-u-mb-sm">
                                  <strong>Clusters firing this alert:</strong>
                                </Content>
                              </StackItem>
                              <StackItem>
                                <Table aria-label="Clusters with alert" variant="compact">
                                  <Thead>
                                    <Tr>
                                      <Th>Cluster</Th>
                                      <Th>Instances</Th>
                                      <Th>Last Fired</Th>
                                      <Th>Actions</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {agg.clusters.map(clusterInfo => (
                                      <Tr key={clusterInfo.name}>
                                        <Td>
                                          <Button variant="link" isInline onClick={() => onClusterClick(clusterInfo.cluster)}>
                                            <ClusterIcon /> {clusterInfo.name}
                                          </Button>
                                        </Td>
                                        <Td><Badge isRead>{clusterInfo.count}</Badge></Td>
                                        <Td>{clusterInfo.lastFired}</Td>
                                        <Td>
                                          <Button 
                                            variant="link" 
                                            isInline 
                                            onClick={() => onClusterClick(clusterInfo.cluster)}
                                          >
                                            View cluster alerts
                                          </Button>
                                        </Td>
                                      </Tr>
                                    ))}
                                  </Tbody>
                                </Table>
                              </StackItem>
                            </Stack>
                          </ExpandableRowContent>
                        </Td>
                      </Tr>
                    </Tbody>
                  );
                })}
              </Table>
            ) : (
              /* Individual Alerts View */
              <Table aria-label="All alerts table" variant="compact">
                <Thead>
                  <Tr>
                    <Th>Severity</Th>
                    <Th>Alert Name</Th>
                    <Th>Cluster</Th>
                    <Th>Group</Th>
                    <Th>Component</Th>
                    <Th>State</Th>
                    <Th>Last Fired</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedAlerts.map((alert, idx) => (
                    <Tr key={`${alert.id}-${idx}`}>
                      <Td>
                        <Label color={getSeverityLabelColor(alert.severity)} icon={getSeverityIcon(alert.severity)} isCompact>
                          {alert.severity}
                        </Label>
                      </Td>
                      <Td>
                        <Button variant="link" isInline onClick={() => onAlertClick(alert)}>
                          {alert.alertName}
                        </Button>
                      </Td>
                      <Td>
                        <Button variant="link" isInline onClick={() => onClusterClick((alert as any).cluster)}>
                          {alert.clusterName}
                        </Button>
                      </Td>
                      <Td><Label isCompact>{alert.group}</Label></Td>
                      <Td><Label isCompact variant="outline">{alert.component}</Label></Td>
                      <Td><Label color={getStatusLabelColor(alert.status)} variant="outline" isCompact>{alert.status}</Label></Td>
                      <Td>{alert.lastFired}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};

// ========================================
// ALERTS TIMELINE CARD
// ========================================

interface AlertsTimelineCardProps {
  trendData: TrendData[];
}

const AlertsTimelineCard: React.FC<AlertsTimelineCardProps> = ({ trendData }) => {
  const chartBodyFont = getPatternFlyBodyFontFamily();
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#d2d2d2',
      borderWidth: 1,
      textStyle: { color: '#151515', fontFamily: chartBodyFont },
    },
    legend: {
      data: ['Critical', 'Warning', 'Info'],
      bottom: 0,
      textStyle: { fontFamily: chartBodyFont },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.map(d => d.timestamp),
      axisLabel: { fontFamily: chartBodyFont },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontFamily: chartBodyFont },
    },
    series: [
      {
        name: 'Critical',
        type: 'line',
        stack: 'Total',
        emphasis: { focus: 'series' },
        data: trendData.map(d => d.critical),
        itemStyle: { color: '#c9190b' },
        lineStyle: { color: '#c9190b' },
        areaStyle: { color: '#c9190b', opacity: 0.3 },
      },
      {
        name: 'Warning',
        type: 'line',
        stack: 'Total',
        emphasis: { focus: 'series' },
        data: trendData.map(d => d.warning),
        itemStyle: { color: '#f0ab00' },
        lineStyle: { color: '#f0ab00' },
        areaStyle: { color: '#f0ab00', opacity: 0.3 },
      },
      {
        name: 'Info',
        type: 'line',
        stack: 'Total',
        emphasis: { focus: 'series' },
        data: trendData.map(d => d.info),
        itemStyle: { color: '#6753ac' },
        lineStyle: { color: '#6753ac' },
        areaStyle: { color: '#6753ac', opacity: 0.3 },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Trend (Last 6 Hours)</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: '300px', width: '100%' }}>
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </div>
      </CardBody>
    </Card>
  );
};

// ========================================
// CLUSTER TILE COMPONENT
// ========================================

interface ClusterTileProps {
  cluster: ClusterData;
  onDrillDown: (cluster: ClusterData) => void;
}

const ClusterTile: React.FC<ClusterTileProps> = ({ cluster, onDrillDown }) => {
  const status = getClusterStatus(cluster);
  const bgColor = getStatusBackgroundColor(status);
  const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
  const criticalCount = firingAlerts.filter(a => a.severity === 'Critical').length;
  const warningCount = firingAlerts.filter(a => a.severity === 'Warning').length;
  const infoCount = firingAlerts.filter(a => a.severity === 'Info').length;

  const popoverContent = (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h4" size="md">{cluster.name}</Title>
      </StackItem>
      <Divider />
      <StackItem>
        <Grid hasGutter>
          <GridItem span={6}>
            <DescriptionList isCompact>
              <DescriptionListGroup>
                <DescriptionListTerm>Region</DescriptionListTerm>
                <DescriptionListDescription>{cluster.region}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Provider</DescriptionListTerm>
                <DescriptionListDescription>{cluster.cloudProvider}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </GridItem>
          <GridItem span={6}>
            <DescriptionList isCompact>
              <DescriptionListGroup>
                <DescriptionListTerm>Nodes</DescriptionListTerm>
                <DescriptionListDescription>{cluster.nodeCount}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Pods</DescriptionListTerm>
                <DescriptionListDescription>{cluster.podCount}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </GridItem>
        </Grid>
      </StackItem>
      <StackItem>
        <Stack hasGutter>
          <StackItem>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
              <FlexItem><Content component="small">CPU</Content></FlexItem>
              <FlexItem><Content component="small">{cluster.cpuUsage}%</Content></FlexItem>
            </Flex>
            <Progress value={cluster.cpuUsage} size={ProgressSize.sm} aria-label="CPU usage" />
          </StackItem>
          <StackItem>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
              <FlexItem><Content component="small">Memory</Content></FlexItem>
              <FlexItem><Content component="small">{cluster.memoryUsage}%</Content></FlexItem>
            </Flex>
            <Progress value={cluster.memoryUsage} size={ProgressSize.sm} aria-label="Memory usage" />
          </StackItem>
        </Stack>
      </StackItem>
      <Divider />
      <StackItem>
        <Flex gap={{ default: 'gapSm' }}>
          <FlexItem>
            <Label color="red" isCompact icon={<ExclamationCircleIcon />}>{criticalCount}</Label>
          </FlexItem>
          <FlexItem>
            <Label color="orange" isCompact icon={<ExclamationTriangleIcon />}>{warningCount}</Label>
          </FlexItem>
          <FlexItem>
            <Label color="purple" isCompact icon={<InfoCircleIcon />}>{infoCount}</Label>
          </FlexItem>
        </Flex>
      </StackItem>
    </Stack>
  );

  return (
    <Popover
      headerContent={<Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
        <FlexItem>
          <Icon status={status === 'healthy' ? 'success' : status === 'critical' ? 'danger' : status === 'warning' ? 'warning' : 'info'}>
            {status === 'healthy' ? <CheckCircleIcon /> : status === 'critical' ? <ExclamationCircleIcon /> : status === 'warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
          </Icon>
        </FlexItem>
        <FlexItem>Cluster Status</FlexItem>
      </Flex>}
      bodyContent={popoverContent}
      footerContent={
        <Button variant="link" isInline onClick={() => onDrillDown(cluster)}>
          View cluster details →
        </Button>
      }
      position="right"
      triggerAction="hover"
      withFocusTrap={false}
    >
      <div
        onClick={() => onDrillDown(cluster)}
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: bgColor,
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '11px',
          fontWeight: 600,
          textAlign: 'center',
          padding: '8px',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '4px' }}>
          {firingAlerts.length > 0 ? firingAlerts.length : '✓'}
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
          {cluster.name.replace('prod-', '').replace('staging-', 'stg-').replace('dev-', '')}
        </div>
      </div>
    </Popover>
  );
};

// ========================================
// MULTI SELECT COMPONENT
// ========================================

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onSelect: (selected: string[]) => void;
  hasSearch?: boolean;
  width?: string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  label,
  options,
  selected,
  onSelect,
  hasSearch = false,
  width = '180px',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const filteredOptions = hasSearch && searchValue
    ? options.filter(opt => opt.toLowerCase().includes(searchValue.toLowerCase()))
    : options;

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsOpen(!isOpen)}
      isExpanded={isOpen}
      style={{ width }}
      badge={selected.length > 0 ? <Badge isRead>{selected.length}</Badge> : undefined}
    >
      <FilterIcon /> {label}
    </MenuToggle>
  );

  const handleSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    const val = String(value);
    if (selected.includes(val)) {
      onSelect(selected.filter(s => s !== val));
    } else {
      onSelect([...selected, val]);
    }
  };

  return (
    <Select
      toggle={toggle}
      onSelect={handleSelect}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      {hasSearch && (
        <div style={{ padding: '8px' }}>
          <TextInputGroup>
            <TextInputGroupMain
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              placeholder="Search..."
            />
            {searchValue && (
              <TextInputGroupUtilities>
                <Button variant="plain" onClick={() => setSearchValue('')} aria-label="Clear search">
                  <TimesIcon />
                </Button>
              </TextInputGroupUtilities>
            )}
          </TextInputGroup>
        </div>
      )}
      <SelectList>
        {filteredOptions.map(option => (
          <SelectOption
            key={option}
            value={option}
            hasCheckbox
            isSelected={selected.includes(option)}
          >
            {option}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

// ========================================
// STATS CARD COMPONENT
// ========================================

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  color?: 'default' | 'danger' | 'warning' | 'success';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = 'default' }) => {
  const colorClass = color === 'danger' ? 'pf-v6-u-danger-color-100' 
    : color === 'warning' ? 'pf-v6-u-warning-color-100'
    : color === 'success' ? 'pf-v6-u-success-color-100'
    : '';

  return (
    <Card isFullHeight>
      <CardBody>
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
          <FlexItem>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Content component="small" className="pf-v6-u-color-200">{title}</Content>
              </FlexItem>
              <FlexItem>{icon}</FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Title headingLevel="h2" size="3xl" className={colorClass}>{value}</Title>
          </FlexItem>
          {trend && (
            <FlexItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                <FlexItem>
                  <Icon status={trend.isUp ? 'danger' : 'success'} size="sm">
                    {trend.isUp ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </Icon>
                </FlexItem>
                <FlexItem>
                  <Content component="small" className={trend.isUp ? 'pf-v6-u-danger-color-100' : 'pf-v6-u-success-color-100'}>
                    {trend.value}% from last hour
                  </Content>
                </FlexItem>
              </Flex>
            </FlexItem>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

const MultiClusterAlertingDashboard: React.FunctionComponent = () => {
  // View state
  const [isDrillDownView, setIsDrillDownView] = React.useState(false);
  const [selectedCluster, setSelectedCluster] = React.useState<ClusterData | null>(null);

  // Filter states
  const [regionFilter, setRegionFilter] = React.useState<string[]>([]);
  const [clusterFilter, setClusterFilter] = React.useState<string[]>([]);
  const [namespaceFilter, setNamespaceFilter] = React.useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = React.useState<AlertSeverity[]>([]);
  const [groupFilter, setGroupFilter] = React.useState<AlertGroup[]>([]);
  const [componentFilter, setComponentFilter] = React.useState<AlertComponent[]>([]);
  const [searchValue, setSearchValue] = React.useState('');

  // View and grouping
  const [viewMode, setViewMode] = React.useState<ViewMode>('treemap');
  const [groupBy, setGroupBy] = React.useState<GroupByOption>('none');
  const [sortBy, setSortBy] = React.useState<SortByOption>('severity');
  const [importanceSizing, setImportanceSizing] = React.useState<ImportanceSizing>('nodeCount');
  const [userRole] = React.useState<UserRole>('admin');
  const [isGroupByOpen, setIsGroupByOpen] = React.useState(false);
  const [isSortByOpen, setIsSortByOpen] = React.useState(false);
  const [isSizeByOpen, setIsSizeByOpen] = React.useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = React.useState(false);

  // Pagination
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  // Saved filters
  const [savedFilters, setSavedFilters] = React.useState<SavedFilter[]>([
    { id: 'sf1', name: 'Critical Only', filters: { severity: ['Critical'], group: [], component: [], source: [], searchValue: '' } },
    { id: 'sf2', name: 'Production Issues', filters: { severity: ['Critical', 'Warning'], group: ['Cluster'], component: [], source: [], searchValue: '' } },
    { id: 'sf3', name: 'Network Issues', filters: { severity: ['Critical', 'Warning'], group: [], component: ['Network'], source: [], searchValue: '' } },
  ]);
  const [isSavedFiltersDropdownOpen, setIsSavedFiltersDropdownOpen] = React.useState(false);
  const [selectedSavedFilter, setSelectedSavedFilter] = React.useState<SavedFilter | null>(null);
  const [isManageSavedFiltersModalOpen, setIsManageSavedFiltersModalOpen] = React.useState(false);
  const [editingFilterId, setEditingFilterId] = React.useState<string | null>(null);
  const [editingFilterName, setEditingFilterName] = React.useState('');
  const [isSaveFilterModalOpen, setIsSaveFilterModalOpen] = React.useState(false);
  const [newFilterName, setNewFilterName] = React.useState('');

  // Drill-down states
  const [drillDownSeverityFilter, setDrillDownSeverityFilter] = React.useState<AlertSeverity[]>([]);
  const [drillDownGroupFilter, setDrillDownGroupFilter] = React.useState<AlertGroup[]>([]);
  const [drillDownComponentFilter, setDrillDownComponentFilter] = React.useState<AlertComponent[]>([]);
  const [drillDownSourceFilter, setDrillDownSourceFilter] = React.useState<string[]>([]);
  const [drillDownSearchValue, setDrillDownSearchValue] = React.useState('');
  const [drillDownTriggeredFrom, setDrillDownTriggeredFrom] = React.useState('');
  const [drillDownTriggeredTo, setDrillDownTriggeredTo] = React.useState('');
  const [drillDownStateFilter, setDrillDownStateFilter] = React.useState<string[]>([]);
  const [drillDownFilterOpen, setDrillDownFilterOpen] = React.useState(false);
  const [isDrillDownComponentOpen, setIsDrillDownComponentOpen] = React.useState(false);
  const [isAggregated, setIsAggregated] = React.useState(true);
  const [isSummaryAccordionExpanded, setIsSummaryAccordionExpanded] = React.useState(true);
  
  // Drill-down saved filters
  const [drillDownSavedFilters, setDrillDownSavedFilters] = React.useState<SavedFilter[]>([
    { id: 'ddsf-1', name: 'Critical alerts only', filters: { severity: ['Critical'], group: [], component: [], source: [], searchValue: '' } },
    { id: 'ddsf-2', name: 'Platform alerts', filters: { severity: [], group: [], component: [], source: ['Platform'], searchValue: '' } },
  ]);
  const [selectedDrillDownSavedFilter, setSelectedDrillDownSavedFilter] = React.useState<SavedFilter | null>(null);
  const [isDrillDownSavedFiltersDropdownOpen, setIsDrillDownSavedFiltersDropdownOpen] = React.useState(false);
  const [isDrillDownSaveFilterModalOpen, setIsDrillDownSaveFilterModalOpen] = React.useState(false);
  const [drillDownNewFilterName, setDrillDownNewFilterName] = React.useState('');
  const [isDrillDownManageSavedFiltersModalOpen, setIsDrillDownManageSavedFiltersModalOpen] = React.useState(false);
  const [drillDownEditingFilterId, setDrillDownEditingFilterId] = React.useState<string | null>(null);
  const [drillDownEditingFilterName, setDrillDownEditingFilterName] = React.useState('');
  const [expandedAlertRows, setExpandedAlertRows] = React.useState<string[]>([]);
  const [selectedAlerts, setSelectedAlerts] = React.useState<string[]>([]);
  const [drillDownPage, setDrillDownPage] = React.useState(1);
  const [drillDownPerPage, setDrillDownPerPage] = React.useState(20);

  // Column management
  const defaultColumns: ColumnConfig[] = [
    { key: 'alertName', label: 'Alert Name', isVisible: true, isDisabled: true, order: 0 },
    { key: 'severity', label: 'Severity', isVisible: true, isDisabled: true, order: 1 },
    { key: 'total', label: 'Total', isVisible: true, isDisabled: false, order: 2 },
    { key: 'state', label: 'State', isVisible: true, isDisabled: false, order: 3 },
    { key: 'group', label: 'Group', isVisible: true, isDisabled: false, order: 4 },
    { key: 'component', label: 'Component', isVisible: true, isDisabled: false, order: 5 },
    { key: 'source', label: 'Source', isVisible: true, isDisabled: false, order: 6 },
    { key: 'description', label: 'Description', isVisible: false, isDisabled: false, order: 7 },
    { key: 'namespace', label: 'Namespace', isVisible: false, isDisabled: false, order: 8 },
    { key: 'resource', label: 'Resource', isVisible: false, isDisabled: false, order: 9 },
  ];
  const [columns, setColumns] = React.useState<ColumnConfig[]>(defaultColumns);
  const [tempColumns, setTempColumns] = React.useState<ColumnConfig[]>(defaultColumns);
  const [isManageColumnsModalOpen, setIsManageColumnsModalOpen] = React.useState(false);
  const MAX_VISIBLE_COLUMNS = 8;

  // Drawer state
  const [isDrawerExpanded, setIsDrawerExpanded] = React.useState(false);
  const [selectedAlertDetail, setSelectedAlertDetail] = React.useState<AlertData | null>(null);

  // Toast notifications
  const [toasts, setToasts] = React.useState<ToastNotification[]>([]);

  // All alerts card state
  const [mainAlertNameFilter, setMainAlertNameFilter] = React.useState<string | null>(null);

  // Last refresh
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  // Get unique filter options
  const regions = getUniqueValues(mockClusters, 'region');
  const clusterNames = getUniqueValues(mockClusters, 'name');
  const namespaces = getAllNamespaces(mockClusters);
  const allAlerts = getAllAlerts(mockClusters);

  // Filter clusters
  const filteredClusters = React.useMemo(() => {
    return mockClusters.filter(cluster => {
      if (regionFilter.length > 0 && !regionFilter.includes(cluster.region)) return false;
      if (clusterFilter.length > 0 && !clusterFilter.includes(cluster.name)) return false;
      if (namespaceFilter.length > 0 && !cluster.namespaces.some(ns => namespaceFilter.includes(ns))) return false;
      if (searchValue && !cluster.name.toLowerCase().includes(searchValue.toLowerCase())) return false;
      if (severityFilter.length > 0) {
        const hasMatchingAlert = cluster.alerts.some(a => a.status === 'firing' && severityFilter.includes(a.severity));
        if (!hasMatchingAlert && cluster.alerts.filter(a => a.status === 'firing').length > 0) return false;
      }
      return true;
    });
  }, [regionFilter, clusterFilter, namespaceFilter, searchValue, severityFilter]);

  // Sort clusters
  const sortedClusters = React.useMemo(() => {
    const sorted = [...filteredClusters];
    switch (sortBy) {
      case 'severity':
        sorted.sort((a, b) => {
          const statusOrder = { critical: 0, warning: 1, info: 2, healthy: 3 };
          const statusDiff = statusOrder[getClusterStatus(a)] - statusOrder[getClusterStatus(b)];
          if (statusDiff !== 0) return statusDiff;
          const aFiring = a.alerts.filter(al => al.status === 'firing').length;
          const bFiring = b.alerts.filter(al => al.status === 'firing').length;
          if (aFiring !== bFiring) return bFiring - aFiring;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'alertCount':
        sorted.sort((a, b) => b.alerts.filter(al => al.status === 'firing').length - a.alerts.filter(al => al.status === 'firing').length);
        break;
      case 'clusterName':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  }, [filteredClusters, sortBy]);

  // Metrics
  const totalAlerts = filteredClusters.reduce((sum, c) => sum + c.alerts.filter(a => a.status === 'firing').length, 0);
  const criticalAlerts = filteredClusters.reduce((sum, c) => sum + c.alerts.filter(a => a.severity === 'Critical' && a.status === 'firing').length, 0);
  const warningAlerts = filteredClusters.reduce((sum, c) => sum + c.alerts.filter(a => a.severity === 'Warning' && a.status === 'firing').length, 0);
  const healthyClusters = filteredClusters.filter(c => c.alerts.filter(a => a.status === 'firing').length === 0).length;

  // Drill-down filtered alerts
  const drillDownFilteredAlerts = React.useMemo(() => {
    if (!selectedCluster) return [];
    return selectedCluster.alerts.filter(alert => {
      if (drillDownSeverityFilter.length > 0 && !drillDownSeverityFilter.includes(alert.severity)) return false;
      if (drillDownGroupFilter.length > 0 && !drillDownGroupFilter.includes(alert.group)) return false;
      if (drillDownComponentFilter.length > 0 && !drillDownComponentFilter.includes(alert.component)) return false;
      if (drillDownSourceFilter.length > 0 && !drillDownSourceFilter.includes(alert.source)) return false;
      if (drillDownStateFilter.length > 0 && !drillDownStateFilter.includes(alert.status)) return false;
      if (drillDownSearchValue && !alert.alertName.toLowerCase().includes(drillDownSearchValue.toLowerCase())) return false;
      // Triggered date/time filter
      if (drillDownTriggeredFrom || drillDownTriggeredTo) {
        const alertTime = new Date(alert.lastFired).getTime();
        if (drillDownTriggeredFrom) {
          const fromTime = new Date(drillDownTriggeredFrom).getTime();
          if (alertTime < fromTime) return false;
        }
        if (drillDownTriggeredTo) {
          const toTime = new Date(drillDownTriggeredTo).getTime();
          if (alertTime > toTime) return false;
        }
      }
      return true;
    });
  }, [selectedCluster, drillDownSeverityFilter, drillDownGroupFilter, drillDownComponentFilter, drillDownSourceFilter, drillDownStateFilter, drillDownSearchValue, drillDownTriggeredFrom, drillDownTriggeredTo]);

  // Aggregated alerts for drill-down
  const aggregatedAlerts = React.useMemo(() => {
    const grouped: Record<string, { alerts: AlertData[]; severity: AlertSeverity; count: number }> = {};
    drillDownFilteredAlerts.forEach(alert => {
      const key = `${alert.alertName}-${alert.severity}`;
      if (!grouped[key]) {
        grouped[key] = { alerts: [], severity: alert.severity, count: 0 };
      }
      grouped[key].alerts.push(alert);
      grouped[key].count++;
    });
    return Object.entries(grouped).map(([key, data]) => ({
      key,
      alertName: data.alerts[0].alertName,
      severity: data.severity,
      count: data.count,
      alerts: data.alerts,
    }));
  }, [drillDownFilteredAlerts]);

  // Handlers
  const handleDrillDown = (cluster: ClusterData) => {
    setSelectedCluster(cluster);
    setIsDrillDownView(true);
    setExpandedAlertRows([]);
    setSelectedAlerts([]);
    clearDrillDownFilters();
  };

  const handleBackToList = () => {
    setIsDrillDownView(false);
    setSelectedCluster(null);
    setIsDrawerExpanded(false);
    setSelectedAlertDetail(null);
  };

  const clearDrillDownFilters = () => {
    setDrillDownSeverityFilter([]);
    setDrillDownGroupFilter([]);
    setDrillDownComponentFilter([]);
    setDrillDownSourceFilter([]);
    setDrillDownStateFilter([]);
    setDrillDownSearchValue('');
    setDrillDownTriggeredFrom('');
    setDrillDownTriggeredTo('');
  };

  const clearFilters = () => {
    setRegionFilter([]);
    setClusterFilter([]);
    setNamespaceFilter([]);
    setSeverityFilter([]);
    setGroupFilter([]);
    setComponentFilter([]);
    setSearchValue('');
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  const addToast = (title: string, variant: 'success' | 'danger' | 'warning' | 'info', description?: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, variant, description }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const openManageColumnsModal = () => {
    setTempColumns([...columns]);
    setIsManageColumnsModalOpen(true);
  };

  const handleTempColumnToggle = (key: string) => {
    setTempColumns(prev => prev.map(c => c.key === key ? { ...c, isVisible: !c.isVisible } : c));
  };

  const handleSaveColumns = () => {
    setColumns(tempColumns);
    setIsManageColumnsModalOpen(false);
  };

  const handleSelectAllColumns = () => {
    const visibleCount = tempColumns.filter(c => c.isVisible).length;
    if (visibleCount >= MAX_VISIBLE_COLUMNS) {
      addToast('Column limit reached', 'warning', `Maximum of ${MAX_VISIBLE_COLUMNS} columns allowed.`);
      return;
    }
    setTempColumns(prev => prev.map(c => ({ ...c, isVisible: true })));
  };

  const handleDeselectAllColumns = () => {
    setTempColumns(prev => prev.map(c => c.isDisabled ? c : { ...c, isVisible: false }));
  };

  const handleRestoreDefaultColumns = () => {
    setTempColumns([...defaultColumns]);
  };

  const hasActiveFilters = regionFilter.length > 0 || clusterFilter.length > 0 || namespaceFilter.length > 0 || 
    severityFilter.length > 0 || groupFilter.length > 0 || componentFilter.length > 0 || searchValue.length > 0;

  const hasDrillDownActiveFilters = drillDownSeverityFilter.length > 0 || drillDownGroupFilter.length > 0 || 
    drillDownComponentFilter.length > 0 || drillDownSourceFilter.length > 0 || drillDownStateFilter.length > 0 ||
    drillDownSearchValue.length > 0 || drillDownTriggeredFrom.length > 0 || drillDownTriggeredTo.length > 0;

  // Size by options based on role
  const sizeByOptions = userRole === 'admin' 
    ? [
        { value: 'nodeCount', label: 'Number of Nodes' },
        { value: 'cpuCores', label: 'Total CPU Cores' },
        { value: 'totalMemory', label: 'Total Memory' },
        { value: 'podCount', label: 'Total Pods' },
        { value: 'vmCount', label: 'Total VMs' },
        { value: 'totalAlerts', label: 'Total Alerts' },
      ]
    : [
        { value: 'podCount', label: 'Total Pods' },
        { value: 'cpuRequests', label: 'Total CPU Requests' },
        { value: 'memoryRequests', label: 'Total Memory Requests' },
        { value: 'totalAlerts', label: 'Total Alerts' },
      ];

  // ========================================
  // DRILL-DOWN VIEW (Cluster Alerts Page)
  // ========================================
  if (isDrillDownView && selectedCluster) {
    return (
      <>
        {/* Toast Notifications */}
        <PfAlertGroup isToast isLiveRegion>
          {toasts.map(toast => (
            <PfAlert
              key={toast.id}
              variant={toast.variant as AlertVariant}
              title={toast.title}
              actionClose={<AlertActionCloseButton onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />}
            >
              {toast.description}
            </PfAlert>
          ))}
        </PfAlertGroup>

        {/* Breadcrumbs */}
        <PageSection hasBodyWrapper={false} style={{ paddingBottom: 0 }}>
          <Breadcrumb>
            <BreadcrumbItem to="/">Home</BreadcrumbItem>
            <BreadcrumbItem to="/observe/alerting">Observe</BreadcrumbItem>
            <BreadcrumbItem to="/observe/alerting" onClick={(e) => { e.preventDefault(); handleBackToList(); }}>Alerting</BreadcrumbItem>
            <BreadcrumbItem isActive>Cluster alerts for {selectedCluster.name}</BreadcrumbItem>
          </Breadcrumb>
        </PageSection>

        {/* Header */}
        <PageSection hasBodyWrapper={false}>
          <Stack hasGutter>
            <StackItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                <FlexItem>
                  <Button variant="link" icon={<ArrowLeftIcon />} onClick={handleBackToList}>
                    Back to Multi-cluster alerting
                  </Button>
                </FlexItem>
              </Flex>
            </StackItem>
            <StackItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                <FlexItem>
                  <Icon size="lg" status="danger">
                    <OutlinedBellIcon />
                  </Icon>
                </FlexItem>
                <FlexItem>
                  <Title headingLevel="h1" size="2xl">Cluster alerts: {selectedCluster.name}</Title>
                </FlexItem>
              </Flex>
            </StackItem>
            <StackItem>
              <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Label 
                    color={getClusterStatus(selectedCluster) === 'healthy' ? 'green' : getClusterStatus(selectedCluster) === 'critical' ? 'red' : getClusterStatus(selectedCluster) === 'warning' ? 'orange' : 'purple'}
                    icon={getClusterStatus(selectedCluster) === 'healthy' ? <CheckCircleIcon /> : getClusterStatus(selectedCluster) === 'critical' ? <ExclamationCircleIcon /> : getClusterStatus(selectedCluster) === 'warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                  >
                    {getClusterStatus(selectedCluster).charAt(0).toUpperCase() + getClusterStatus(selectedCluster).slice(1)}
                  </Label>
                </FlexItem>
                <FlexItem>
                  <Label color="blue" icon={<CubesIcon />}>{selectedCluster.nodeCount} Nodes</Label>
                </FlexItem>
                <FlexItem>
                  <Label variant="outline">{selectedCluster.region} • {selectedCluster.cloudProvider}</Label>
                </FlexItem>
              </Flex>
            </StackItem>
          </Stack>
        </PageSection>

        {/* Main Content */}
        <PageSection hasBodyWrapper={false} isFilled>
          <Drawer isExpanded={isDrawerExpanded} position="end">
            <DrawerContent
              panelContent={
                selectedAlertDetail && (
                  <DrawerPanelContent widths={{ default: 'width_50' }} style={{ minWidth: '400px' }}>
                    <DrawerHead>
                      <Title headingLevel="h2" size="lg">{selectedAlertDetail.alertName}</Title>
                      <DrawerActions>
                        <DrawerCloseButton onClick={() => { setIsDrawerExpanded(false); setSelectedAlertDetail(null); }} />
                      </DrawerActions>
                    </DrawerHead>
                    <DrawerPanelBody>
                      <Tabs defaultActiveKey={0}>
                        <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
                          <Stack hasGutter style={{ padding: '16px 0' }}>
                            <StackItem>
                              <DescriptionList isHorizontal>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Severity</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <Label color={getSeverityLabelColor(selectedAlertDetail.severity)}>{selectedAlertDetail.severity}</Label>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>State</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    <Label color={getStatusLabelColor(selectedAlertDetail.status)} variant="outline">{selectedAlertDetail.status}</Label>
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Summary</DescriptionListTerm>
                                  <DescriptionListDescription>{selectedAlertDetail.summary}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Details</DescriptionListTerm>
                                  <DescriptionListDescription>{selectedAlertDetail.details}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Namespace</DescriptionListTerm>
                                  <DescriptionListDescription>{selectedAlertDetail.namespace}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Source</DescriptionListTerm>
                                  <DescriptionListDescription>{selectedAlertDetail.source}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Last Fired</DescriptionListTerm>
                                  <DescriptionListDescription>{selectedAlertDetail.lastFired}</DescriptionListDescription>
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
                              </DescriptionList>
                            </StackItem>
                            <StackItem>
                              <Flex gap={{ default: 'gapSm' }}>
                                <FlexItem><Button variant="secondary" onClick={() => addToast('Alert acknowledged', 'success')}>Acknowledge</Button></FlexItem>
                                <FlexItem><Button variant="secondary" onClick={() => addToast('Alert silenced', 'success')}>Silence</Button></FlexItem>
                                <FlexItem><Button variant="link">View alerting rule</Button></FlexItem>
                              </Flex>
                            </StackItem>
                          </Stack>
                        </Tab>
                        <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>}>
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
              <DrawerContentBody>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  {/* Filter Sidebar */}
                  {drillDownFilterOpen && (
                    <div style={{ width: '280px', minWidth: '280px', flexShrink: 0 }}>
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
                            {/* Group - Checkboxes */}
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
                            {/* Component - Dropdown based on selected group */}
                            <StackItem>
                              <Content component="small" className="pf-v6-u-mb-sm">
                                <strong>{drillDownGroupFilter.length > 0 ? `Component (in: ${drillDownGroupFilter.join(', ')})` : 'Component'}</strong>
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
                            {/* State - Checkboxes */}
                            <StackItem>
                              <Content component="small" className="pf-v6-u-mb-sm"><strong>State</strong></Content>
                              <Stack hasGutter>
                                {['firing', 'pending', 'resolved'].map(state => (
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
                            {/* Source - Checkboxes */}
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
                            {/* Triggered - Date/Time pickers */}
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
                      {/* Alerts Summary - Compact */}
                      <StackItem>
                        <Accordion asDefinitionList={false}>
                          <AccordionItem isExpanded={isSummaryAccordionExpanded}>
                            <AccordionToggle
                              onClick={() => setIsSummaryAccordionExpanded(!isSummaryAccordionExpanded)}
                              id="alerts-summary-toggle"
                            >
                              <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <FlexItem>Alerts summary</FlexItem>
                                <FlexItem>
                                  <Badge isRead>{selectedCluster.alerts.filter(a => a.status === 'firing').length}</Badge>
                                </FlexItem>
                              </Flex>
                            </AccordionToggle>
                            <AccordionContent id="alerts-summary-content" hidden={!isSummaryAccordionExpanded}>
                              <Flex gap={{ default: 'gapMd' }} style={{ marginTop: '12px' }}>
                                {/* Cluster Alerts - Compact */}
                                <FlexItem flex={{ default: 'flex_1' }}>
                                  <Tooltip content="Alerts related to core cluster components like API server, etcd, scheduler, and controllers.">
                                    <Card isCompact>
                                      <CardBody style={{ padding: '12px 16px' }}>
                                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                          <FlexItem>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon size="sm"><CubeIcon /></Icon></FlexItem>
                                              <FlexItem><strong>Cluster</strong></FlexItem>
                                              <FlexItem><Badge isRead>{selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.status === 'firing').length}</Badge></FlexItem>
                                            </Flex>
                                          </FlexItem>
                                          <FlexItem>
                                            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Cluster']); setDrillDownSeverityFilter(['Critical']); }}>
                                                  <Icon status="danger" size="sm"><ExclamationCircleIcon /></Icon>
                                                  <span style={{ marginLeft: '4px', color: 'var(--pf-t--global--color--status--danger--default)' }}>
                                                    {selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.severity === 'Critical' && a.status === 'firing').length}
                                                  </span>
                                                </Button>
                                              </FlexItem>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Cluster']); setDrillDownSeverityFilter(['Warning']); }}>
                                                  <Icon status="warning" size="sm"><ExclamationTriangleIcon /></Icon>
                                                  <span style={{ marginLeft: '4px', color: 'var(--pf-t--global--color--status--warning--default)' }}>
                                                    {selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.severity === 'Warning' && a.status === 'firing').length}
                                                  </span>
                                                </Button>
                                              </FlexItem>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Cluster']); setDrillDownSeverityFilter(['Info']); }}>
                                                  <Icon status="info" size="sm"><InfoCircleIcon /></Icon>
                                                  <span style={{ marginLeft: '4px', color: 'var(--pf-t--global--color--status--info--default)' }}>
                                                    {selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.severity === 'Info' && a.status === 'firing').length}
                                                  </span>
                                                </Button>
                                              </FlexItem>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Cluster']); setDrillDownSeverityFilter([]); }}>
                                                  View all →
                                                </Button>
                                              </FlexItem>
                                            </Flex>
                                          </FlexItem>
                                        </Flex>
                                      </CardBody>
                                    </Card>
                                  </Tooltip>
                                </FlexItem>

                                {/* Namespace Alerts - Compact */}
                                <FlexItem flex={{ default: 'flex_1' }}>
                                  <Tooltip content="Alerts related to workloads and resources within specific namespaces.">
                                    <Card isCompact>
                                      <CardBody style={{ padding: '12px 16px' }}>
                                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                          <FlexItem>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon size="sm"><CubesIcon /></Icon></FlexItem>
                                              <FlexItem><strong>Namespace</strong></FlexItem>
                                              <FlexItem><Badge isRead>{selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.status === 'firing').length}</Badge></FlexItem>
                                            </Flex>
                                          </FlexItem>
                                          <FlexItem>
                                            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Namespace']); setDrillDownSeverityFilter(['Critical']); }}>
                                                  <Icon status="danger" size="sm"><ExclamationCircleIcon /></Icon>
                                                  <span style={{ marginLeft: '4px', color: 'var(--pf-t--global--color--status--danger--default)' }}>
                                                    {selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.severity === 'Critical' && a.status === 'firing').length}
                                                  </span>
                                                </Button>
                                              </FlexItem>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Namespace']); setDrillDownSeverityFilter(['Warning']); }}>
                                                  <Icon status="warning" size="sm"><ExclamationTriangleIcon /></Icon>
                                                  <span style={{ marginLeft: '4px', color: 'var(--pf-t--global--color--status--warning--default)' }}>
                                                    {selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.severity === 'Warning' && a.status === 'firing').length}
                                                  </span>
                                                </Button>
                                              </FlexItem>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Namespace']); setDrillDownSeverityFilter(['Info']); }}>
                                                  <Icon status="info" size="sm"><InfoCircleIcon /></Icon>
                                                  <span style={{ marginLeft: '4px', color: 'var(--pf-t--global--color--status--info--default)' }}>
                                                    {selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.severity === 'Info' && a.status === 'firing').length}
                                                  </span>
                                                </Button>
                                              </FlexItem>
                                              <FlexItem>
                                                <Button variant="link" isInline size="sm" onClick={() => { setDrillDownGroupFilter(['Namespace']); setDrillDownSeverityFilter([]); }}>
                                                  View all →
                                                </Button>
                                              </FlexItem>
                                            </Flex>
                                          </FlexItem>
                                        </Flex>
                                      </CardBody>
                                    </Card>
                                  </Tooltip>
                                </FlexItem>
                              </Flex>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </StackItem>

                      {/* Alerts Table */}
                      <StackItem>
                        <Card>
                          <CardHeader>
                            <Toolbar>
                              <ToolbarContent style={{ padding: 'var(--pf-v6-global--spacer--md, 16px)', alignItems: 'center' }}>
                                {/* Saved Filters Dropdown */}
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
                                            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem>{filter.name}</FlexItem>
                                              <FlexItem>
                                                <Button 
                                                  variant="plain" 
                                                  size="sm"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDrillDownSavedFilters(drillDownSavedFilters.filter(f => f.id !== filter.id));
                                                    if (selectedDrillDownSavedFilter?.id === filter.id) {
                                                      setSelectedDrillDownSavedFilter(null);
                                                    }
                                                  }}
                                                >
                                                  <TimesIcon />
                                                </Button>
                                              </FlexItem>
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
                                {/* Filters Button */}
                                <ToolbarItem>
                                  <Button 
                                    variant={drillDownFilterOpen ? 'secondary' : 'control'} 
                                    icon={<FilterIcon />}
                                    onClick={() => setDrillDownFilterOpen(!drillDownFilterOpen)}
                                  >
                                    Filters {hasDrillDownActiveFilters && <Badge isRead style={{ marginLeft: '4px' }}>{drillDownSeverityFilter.length + drillDownGroupFilter.length + drillDownComponentFilter.length + drillDownSourceFilter.length + drillDownStateFilter.length + (drillDownTriggeredFrom ? 1 : 0) + (drillDownTriggeredTo ? 1 : 0)}</Badge>}
                                  </Button>
                                </ToolbarItem>
                                {/* Search Input */}
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
                                <ToolbarItem>
                                  <Button variant="secondary" icon={<ColumnsIcon />} onClick={openManageColumnsModal}>
                                    Manage columns
                                  </Button>
                                </ToolbarItem>
                                <ToolbarItem align={{ default: 'alignEnd' }}>
                                  <Pagination
                                    itemCount={isAggregated ? aggregatedAlerts.length : drillDownFilteredAlerts.length}
                                    perPage={drillDownPerPage}
                                    page={drillDownPage}
                                    onSetPage={(_, p) => setDrillDownPage(p)}
                                    onPerPageSelect={(_, pp) => setDrillDownPerPage(pp)}
                                    isCompact
                                  />
                                </ToolbarItem>
                              </ToolbarContent>
                            </Toolbar>

                            {/* Active filter chips */}
                            {hasDrillDownActiveFilters && (
                              <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ padding: '0 16px 16px' }}>
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
                          <CardBody>
                            {drillDownFilteredAlerts.length === 0 ? (
                              <EmptyState titleText="No alerts found" icon={CheckCircleIcon}>
                                <EmptyStateBody>No alerts match the current filters.</EmptyStateBody>
                              </EmptyState>
                            ) : (
                              <Table aria-label="Alerts table" isExpandable={isAggregated}>
                                <Thead>
                                  <Tr>
                                    {isAggregated && <Th screenReaderText="Expand" />}
                                    <Th>Severity</Th>
                                    <Th>Alert Name</Th>
                                    {isAggregated && columns.find(c => c.key === 'total')?.isVisible && <Th>Total</Th>}
                                    {columns.find(c => c.key === 'state')?.isVisible && <Th>State</Th>}
                                    {columns.find(c => c.key === 'group')?.isVisible && <Th>Group</Th>}
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
                                          <Button variant="link" isInline onClick={() => { setSelectedAlertDetail(alert); setIsDrawerExpanded(true); }}>
                                            <strong>{alert.alertName}</strong>
                                          </Button>
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
                            )}
                          </CardBody>
                        </Card>
                      </StackItem>
                    </Stack>
                  </div>
                </div>
              </DrawerContentBody>
            </DrawerContent>
          </Drawer>
        </PageSection>

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
                    {drillDownSavedFilters.map((filter, index) => (
                      <DataListItem key={filter.id} aria-labelledby={`filter-${filter.id}`}>
                        <DataListItemRow>
                          <DataListControl>
                            <Flex direction={{ default: 'column' }} gap={{ default: 'gapNone' }}>
                              <FlexItem>
                                <Button 
                                  variant="plain" 
                                  size="sm"
                                  isDisabled={index === 0}
                                  onClick={() => {
                                    const newFilters = [...drillDownSavedFilters];
                                    [newFilters[index - 1], newFilters[index]] = [newFilters[index], newFilters[index - 1]];
                                    setDrillDownSavedFilters(newFilters);
                                  }}
                                  aria-label="Move up"
                                >
                                  <ArrowUpIcon />
                                </Button>
                              </FlexItem>
                              <FlexItem>
                                <Button 
                                  variant="plain" 
                                  size="sm"
                                  isDisabled={index === drillDownSavedFilters.length - 1}
                                  onClick={() => {
                                    const newFilters = [...drillDownSavedFilters];
                                    [newFilters[index], newFilters[index + 1]] = [newFilters[index + 1], newFilters[index]];
                                    setDrillDownSavedFilters(newFilters);
                                  }}
                                  aria-label="Move down"
                                >
                                  <ArrowDownIcon />
                                </Button>
                              </FlexItem>
                            </Flex>
                          </DataListControl>
                          <DataListItemCells
                            dataListCells={[
                              <DataListCell key="name" id={`filter-${filter.id}`}>
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
                                    </TextInputGroupUtilities>
                                  </TextInputGroup>
                                ) : (
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                    <FlexItem>{filter.name}</FlexItem>
                                    <FlexItem>
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
                                    </FlexItem>
                                  </Flex>
                                )}
                              </DataListCell>,
                              <DataListCell key="filters" alignRight>
                                <LabelGroup>
                                  {filter.filters.severity.map(s => (
                                    <Label key={s} isCompact color={getSeverityLabelColor(s as AlertSeverity)}>{s}</Label>
                                  ))}
                                  {filter.filters.group.map(g => (
                                    <Label key={g} isCompact color="blue">{g}</Label>
                                  ))}
                                  {filter.filters.source?.map(s => (
                                    <Label key={s} isCompact color="grey">{s}</Label>
                                  ))}
                                </LabelGroup>
                              </DataListCell>,
                              <DataListCell key="actions" alignRight>
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
  }

  // ========================================
  // MAIN VIEW (Multi-cluster Alerting Page)
  // ========================================
  return (
    <>
      {/* Breadcrumbs */}
      <PageSection hasBodyWrapper={false} style={{ paddingBottom: 0 }}>
        <Breadcrumb>
          <BreadcrumbItem to="/">Home</BreadcrumbItem>
          <BreadcrumbItem to="/observe/alerting">Observe</BreadcrumbItem>
          <BreadcrumbItem isActive>Alerting</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {/* Header with Toolbar */}
      <PageSection hasBodyWrapper={false}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
              <FlexItem>
                <Icon size="lg" status="danger">
                  <OutlinedBellIcon />
                </Icon>
              </FlexItem>
              <FlexItem>
                <Title headingLevel="h1" size="2xl">Multi-cluster alerting</Title>
                <Content component="small" className="pf-v6-u-color-200">
                  Multi-cluster alerting and monitoring dashboard
                </Content>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
              <FlexItem>
                <Content component="small" className="pf-v6-u-color-200">
                  <ClockIcon /> Last updated: {lastRefresh.toLocaleTimeString()}
                </Content>
              </FlexItem>
              <FlexItem>
                <Button variant="secondary" icon={<SyncIcon />} onClick={handleRefresh}>
                  Refresh
                </Button>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Static Toolbar - Order: Saved filters, Filters, Search */}
      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0, paddingBottom: '8px' }}>
        <Toolbar>
          <ToolbarContent>
            {/* Saved Filters Dropdown - First */}
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
                    {selectedSavedFilter ? selectedSavedFilter.name : 'Saved filters'}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {savedFilters.length === 0 ? (
                    <DropdownItem isDisabled>No saved filters</DropdownItem>
                  ) : (
                    savedFilters.map(filter => (
                      <DropdownItem 
                        key={filter.id}
                        onClick={() => {
                          setSelectedSavedFilter(filter);
                          setSeverityFilter(filter.filters.severity as AlertSeverity[]);
                          setGroupFilter(filter.filters.group as AlertGroup[]);
                          setComponentFilter(filter.filters.component as AlertComponent[]);
                          setIsSavedFiltersDropdownOpen(false);
                        }}
                      >
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>{filter.name}</FlexItem>
                          <FlexItem>
                            <Button 
                              variant="plain" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSavedFilters(savedFilters.filter(f => f.id !== filter.id));
                                if (selectedSavedFilter?.id === filter.id) {
                                  setSelectedSavedFilter(null);
                                }
                              }}
                            >
                              <TimesIcon />
                            </Button>
                          </FlexItem>
                        </Flex>
                      </DropdownItem>
                    ))
                  )}
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
            {/* Filters Button - Second */}
            <ToolbarItem>
              <Button 
                variant={isFilterPanelOpen ? 'secondary' : 'control'} 
                icon={<FilterIcon />}
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              >
                Filters {hasActiveFilters && <Badge isRead style={{ marginLeft: '4px' }}>{regionFilter.length + clusterFilter.length + severityFilter.length + groupFilter.length + componentFilter.length}</Badge>}
              </Button>
            </ToolbarItem>
            {/* Search Input - Third */}
            <ToolbarItem>
              <SearchInput
                placeholder="Search clusters..."
                value={searchValue}
                onChange={(_, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                style={{ width: '300px' }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        {/* Active Filter Chips with Action Buttons */}
        {hasActiveFilters && (
          <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginTop: '8px' }}>
            <FlexItem>
              <LabelGroup categoryName="Active filters" numLabels={10}>
                {severityFilter.map(s => (
                  <Label key={s} color={getSeverityLabelColor(s)} onClose={() => setSeverityFilter(severityFilter.filter(x => x !== s))} icon={getSeverityIcon(s)}>{s}</Label>
                ))}
                {groupFilter.map(g => (
                  <Label key={g} color="blue" onClose={() => setGroupFilter(groupFilter.filter(x => x !== g))} icon={<CubeIcon />}>{g}</Label>
                ))}
                {componentFilter.map(c => (
                  <Label key={c} color="green" onClose={() => setComponentFilter(componentFilter.filter(x => x !== c))} icon={<CogIcon />}>{c}</Label>
                ))}
                {regionFilter.map(r => (
                  <Label key={r} color="teal" onClose={() => setRegionFilter(regionFilter.filter(x => x !== r))} icon={<MapMarkerAltIcon />}>{r}</Label>
                ))}
                {clusterFilter.map(c => (
                  <Label key={c} color="purple" onClose={() => setClusterFilter(clusterFilter.filter(x => x !== c))} icon={<ClusterIcon />}>{c}</Label>
                ))}
                {namespaceFilter.map(n => (
                  <Label key={n} color="blue" onClose={() => setNamespaceFilter(namespaceFilter.filter(x => x !== n))} icon={<CubesIcon />}>{n}</Label>
                ))}
              </LabelGroup>
            </FlexItem>
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
          </Flex>
        )}
      </PageSection>

      {/* Main Content - Filter panel pushes entire page */}
      <PageSection hasBodyWrapper={false} isFilled>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Filter Panel */}
          {isFilterPanelOpen && (
            <div style={{ width: '280px', minWidth: '280px', flexShrink: 0 }}>
              <FilterPanel
                regionFilter={regionFilter}
                setRegionFilter={setRegionFilter}
                clusterFilter={clusterFilter}
                setClusterFilter={setClusterFilter}
                namespaceFilter={namespaceFilter}
                setNamespaceFilter={setNamespaceFilter}
                severityFilter={severityFilter}
                setSeverityFilter={setSeverityFilter}
                groupFilter={groupFilter}
                setGroupFilter={setGroupFilter}
                componentFilter={componentFilter}
                setComponentFilter={setComponentFilter}
                regions={regions}
                clusterNames={clusterNames}
                namespaces={namespaces}
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
              />
            </div>
          )}

          {/* Main Content Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Stack hasGutter>
              {/* Stats Cards */}
              <StackItem>
                <Grid hasGutter>
                  <GridItem md={2}>
                    <StatsCard
                      title="Clusters in Fleet"
                      value={filteredClusters.length}
                      icon={<Icon><CubesIcon /></Icon>}
                    />
                  </GridItem>
                  <GridItem md={2}>
                    <StatsCard
                      title="Firing Alerts"
                      value={totalAlerts}
                      icon={<Icon><BellIcon /></Icon>}
                      trend={{ value: 12, isUp: true }}
                    />
                  </GridItem>
                  <GridItem md={2}>
                    <StatsCard
                      title="Critical"
                      value={criticalAlerts}
                      icon={<Icon status="danger"><ExclamationCircleIcon /></Icon>}
                      color="danger"
                      trend={{ value: 5, isUp: true }}
                    />
                  </GridItem>
                  <GridItem md={2}>
                    <StatsCard
                      title="Warning"
                      value={warningAlerts}
                      icon={<Icon status="warning"><ExclamationTriangleIcon /></Icon>}
                      color="warning"
                      trend={{ value: 8, isUp: false }}
                    />
                  </GridItem>
                  <GridItem md={2}>
                    <StatsCard
                      title="Info"
                      value={filteredClusters.reduce((sum, c) => sum + c.alerts.filter(a => a.severity === 'Info' && a.status === 'firing').length, 0)}
                      icon={<Icon status="info"><InfoCircleIcon /></Icon>}
                    />
                  </GridItem>
                  <GridItem md={2}>
                    <StatsCard
                      title="Healthy Clusters"
                      value={healthyClusters}
                      icon={<Icon status="success"><CheckCircleIcon /></Icon>}
                      color="success"
                    />
                  </GridItem>
                </Grid>
              </StackItem>

              {/* Cluster Overview Card */}
              <StackItem>
                <Card>
                  <CardHeader>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <CardTitle>Clusters Fleet alerts overview</CardTitle>
                      </FlexItem>
                      <FlexItem>
                        <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                          {/* View Toggle */}
                          <FlexItem>
                            <ToggleGroup>
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

                          {/* Group By - only for treemap */}
                          {viewMode === 'treemap' && (
                            <>
                              <FlexItem>
                                <Select
                                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                    <MenuToggle ref={toggleRef} onClick={() => setIsGroupByOpen(!isGroupByOpen)} isExpanded={isGroupByOpen} style={{ width: '150px' }}>
                                      Group: {groupBy === 'none' ? 'None' : groupBy === 'cloudProvider' ? 'Provider' : groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                                    </MenuToggle>
                                  )}
                                  onSelect={(_, value) => { setGroupBy(value as GroupByOption); setIsGroupByOpen(false); }}
                                  isOpen={isGroupByOpen}
                                  onOpenChange={setIsGroupByOpen}
                                  selected={groupBy}
                                >
                                  <SelectList>
                                    <SelectOption value="none">None</SelectOption>
                                    <SelectOption value="region">Region</SelectOption>
                                    <SelectOption value="cloudProvider">Cloud Provider</SelectOption>
                                    <SelectOption value="team">Team</SelectOption>
                                    <SelectOption value="severity">Severity</SelectOption>
                                  </SelectList>
                                </Select>
                              </FlexItem>

                              <FlexItem>
                                <Select
                                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                    <MenuToggle ref={toggleRef} onClick={() => setIsSizeByOpen(!isSizeByOpen)} isExpanded={isSizeByOpen} style={{ width: '180px' }}>
                                      Size: {sizeByOptions.find(o => o.value === importanceSizing)?.label || 'Nodes'}
                                    </MenuToggle>
                                  )}
                                  onSelect={(_, value) => { setImportanceSizing(value as ImportanceSizing); setIsSizeByOpen(false); }}
                                  isOpen={isSizeByOpen}
                                  onOpenChange={setIsSizeByOpen}
                                  selected={importanceSizing}
                                >
                                  <SelectList>
                                    {sizeByOptions.map(opt => (
                                      <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
                                    ))}
                                  </SelectList>
                                </Select>
                              </FlexItem>
                            </>
                          )}

                          {/* Sort By - for both views */}
                          <FlexItem>
                            <Select
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setIsSortByOpen(!isSortByOpen)} isExpanded={isSortByOpen} style={{ width: '150px' }}>
                                  Sort: {sortBy === 'severity' ? 'Severity' : sortBy === 'alertCount' ? 'Alert Count' : 'Name'}
                                </MenuToggle>
                              )}
                              onSelect={(_, value) => { setSortBy(value as SortByOption); setIsSortByOpen(false); }}
                              isOpen={isSortByOpen}
                              onOpenChange={setIsSortByOpen}
                              selected={sortBy}
                            >
                              <SelectList>
                                <SelectOption value="severity">Severity</SelectOption>
                                <SelectOption value="alertCount">Alert Count</SelectOption>
                                <SelectOption value="clusterName">Cluster Name</SelectOption>
                              </SelectList>
                            </Select>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {viewMode === 'treemap' ? (
                      <>
                        <TreemapHeatmap
                          clusters={sortedClusters}
                          groupBy={groupBy}
                          importanceSizing={importanceSizing}
                          severityFilter={severityFilter}
                          onDrillDown={handleDrillDown}
                        />
                        {/* Legend */}
                        <Flex gap={{ default: 'gapMd' }} justifyContent={{ default: 'justifyContentCenter' }} style={{ marginTop: '16px' }}>
                          <FlexItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <div style={{ width: '16px', height: '16px', backgroundColor: '#c9190b', borderRadius: '2px' }} />
                              <Content component="small">Critical</Content>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <div style={{ width: '16px', height: '16px', backgroundColor: '#f0ab00', borderRadius: '2px' }} />
                              <Content component="small">Warning</Content>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <div style={{ width: '16px', height: '16px', backgroundColor: '#6753ac', borderRadius: '2px' }} />
                              <Content component="small">Info</Content>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <div style={{ width: '16px', height: '16px', backgroundColor: '#3e8635', borderRadius: '2px' }} />
                              <Content component="small">Healthy</Content>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </>
                    ) : (
                      /* Table View */
                      <Table aria-label="Clusters table">
                        <Thead>
                          <Tr>
                            <Th>Status</Th>
                            <Th>Cluster Name</Th>
                            <Th>Region</Th>
                            <Th>Provider</Th>
                            <Th>Nodes</Th>
                            <Th>Alerts</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {sortedClusters.slice((page - 1) * perPage, page * perPage).map(cluster => (
                            <Tr key={cluster.id} isClickable onRowClick={() => handleDrillDown(cluster)}>
                              <Td>
                                <Icon status={getClusterStatus(cluster) === 'healthy' ? 'success' : getClusterStatus(cluster) === 'critical' ? 'danger' : getClusterStatus(cluster) === 'warning' ? 'warning' : 'info'}>
                                  {getClusterStatus(cluster) === 'healthy' ? <CheckCircleIcon /> : getClusterStatus(cluster) === 'critical' ? <ExclamationCircleIcon /> : getClusterStatus(cluster) === 'warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                                </Icon>
                              </Td>
                              <Td><strong>{cluster.name}</strong></Td>
                              <Td>{cluster.region}</Td>
                              <Td>{cluster.cloudProvider}</Td>
                              <Td>{cluster.nodeCount}</Td>
                              <Td>
                                <Flex gap={{ default: 'gapSm' }}>
                                  <FlexItem><Label color="red" isCompact>{cluster.alerts.filter(a => a.severity === 'Critical' && a.status === 'firing').length}</Label></FlexItem>
                                  <FlexItem><Label color="orange" isCompact>{cluster.alerts.filter(a => a.severity === 'Warning' && a.status === 'firing').length}</Label></FlexItem>
                                  <FlexItem><Label color="purple" isCompact>{cluster.alerts.filter(a => a.severity === 'Info' && a.status === 'firing').length}</Label></FlexItem>
                                </Flex>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    )}
                  </CardBody>
                  {viewMode === 'summary' && (
                    <CardFooter>
                      <Pagination
                        itemCount={sortedClusters.length}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_, p) => setPage(p)}
                        onPerPageSelect={(_, pp) => setPerPage(pp)}
                        isCompact
                      />
                    </CardFooter>
                  )}
                </Card>
              </StackItem>

              {/* Cross-Cluster Insights Card */}
              <StackItem>
                <CrossClusterInsightsCard
                  clusters={filteredClusters}
                  onAlertRuleClick={(alertName) => {
                    setMainAlertNameFilter(alertName);
                    // Scroll to All Alerts card
                    document.getElementById('all-alerts-card')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onClusterClick={handleDrillDown}
                />
              </StackItem>

              {/* All Alerts Card */}
              <StackItem>
                <AllAlertsCard
                  clusters={filteredClusters}
                  alertNameFilter={mainAlertNameFilter}
                  onClearAlertNameFilter={() => setMainAlertNameFilter(null)}
                  onClusterClick={handleDrillDown}
                  onAlertClick={(alert) => {
                    setSelectedAlertDetail(alert);
                    setIsDrawerExpanded(true);
                  }}
                />
              </StackItem>

              {/* Alerts Timeline Card - Last */}
              <StackItem>
                <AlertsTimelineCard trendData={mockTrendData} />
              </StackItem>
            </Stack>
          </div>
        </div>
      </PageSection>

      {/* Save Filter Modal */}
      <Modal
        variant="small"
        isOpen={isSaveFilterModalOpen}
        onClose={() => setIsSaveFilterModalOpen(false)}
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
                  value={newFilterName}
                  onChange={(_, value) => setNewFilterName(value)}
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
              if (newFilterName.trim()) {
                const newFilter: SavedFilter = {
                  id: `sf-${Date.now()}`,
                  name: newFilterName.trim(),
                  filters: { 
                    severity: severityFilter, 
                    group: groupFilter, 
                    component: componentFilter, 
                    source: [], 
                    searchValue 
                  },
                };
                setSavedFilters([...savedFilters, newFilter]);
                setSelectedSavedFilter(newFilter);
                setIsSaveFilterModalOpen(false);
                setNewFilterName('');
                addToast('Filter saved successfully', 'success');
              }
            }}
            isDisabled={!newFilterName.trim()}
          >
            Save
          </Button>
          <Button variant="link" onClick={() => setIsSaveFilterModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Manage Saved Filters Modal */}
      <Modal
        variant="medium"
        isOpen={isManageSavedFiltersModalOpen}
        onClose={() => {
          setIsManageSavedFiltersModalOpen(false);
          setEditingFilterId(null);
          setEditingFilterName('');
        }}
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
            {savedFilters.length === 0 ? (
              <EmptyState titleText="No saved filters" icon={BookmarkIcon}>
                <EmptyStateBody>You haven't saved any filters yet. Apply filters and click "Add to saved filters" to save them.</EmptyStateBody>
              </EmptyState>
            ) : (
              <DataList aria-label="Saved filters list" isCompact>
                {savedFilters.map((filter, index) => (
                  <DataListItem key={filter.id} aria-labelledby={`filter-${filter.id}`}>
                    <DataListItemRow>
                      <DataListControl>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapXs' }}>
                          <FlexItem>
                            <Button
                              variant="plain"
                              size="sm"
                              isDisabled={index === 0}
                              onClick={() => {
                                const newFilters = [...savedFilters];
                                [newFilters[index - 1], newFilters[index]] = [newFilters[index], newFilters[index - 1]];
                                setSavedFilters(newFilters);
                              }}
                              aria-label="Move up"
                            >
                              <ArrowUpIcon />
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              size="sm"
                              isDisabled={index === savedFilters.length - 1}
                              onClick={() => {
                                const newFilters = [...savedFilters];
                                [newFilters[index], newFilters[index + 1]] = [newFilters[index + 1], newFilters[index]];
                                setSavedFilters(newFilters);
                              }}
                              aria-label="Move down"
                            >
                              <ArrowDownIcon />
                            </Button>
                          </FlexItem>
                        </Flex>
                      </DataListControl>
                      <DataListItemCells
                        dataListCells={[
                          <DataListCell key="name" width={3}>
                            {editingFilterId === filter.id ? (
                              <TextInputGroup>
                                <TextInputGroupMain
                                  value={editingFilterName}
                                  onChange={(_, value) => setEditingFilterName(value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && editingFilterName.trim()) {
                                      setSavedFilters(savedFilters.map(f => 
                                        f.id === filter.id ? { ...f, name: editingFilterName.trim() } : f
                                      ));
                                      setEditingFilterId(null);
                                      setEditingFilterName('');
                                    } else if (e.key === 'Escape') {
                                      setEditingFilterId(null);
                                      setEditingFilterName('');
                                    }
                                  }}
                                  autoFocus
                                />
                                <TextInputGroupUtilities>
                                  <Button
                                    variant="plain"
                                    size="sm"
                                    onClick={() => {
                                      if (editingFilterName.trim()) {
                                        setSavedFilters(savedFilters.map(f => 
                                          f.id === filter.id ? { ...f, name: editingFilterName.trim() } : f
                                        ));
                                      }
                                      setEditingFilterId(null);
                                      setEditingFilterName('');
                                    }}
                                  >
                                    <CheckIcon />
                                  </Button>
                                  <Button
                                    variant="plain"
                                    size="sm"
                                    onClick={() => {
                                      setEditingFilterId(null);
                                      setEditingFilterName('');
                                    }}
                                  >
                                    <TimesIcon />
                                  </Button>
                                </TextInputGroupUtilities>
                              </TextInputGroup>
                            ) : (
                              <span id={`filter-${filter.id}`}>
                                <BookmarkIcon /> {filter.name}
                              </span>
                            )}
                          </DataListCell>,
                          <DataListCell key="filters" width={2}>
                            <Flex gap={{ default: 'gapXs' }} flexWrap={{ default: 'wrap' }}>
                              {filter.filters.severity.length > 0 && (
                                <FlexItem>
                                  <Label isCompact color="grey">{filter.filters.severity.length} severity</Label>
                                </FlexItem>
                              )}
                              {filter.filters.group.length > 0 && (
                                <FlexItem>
                                  <Label isCompact color="grey">{filter.filters.group.length} group</Label>
                                </FlexItem>
                              )}
                              {filter.filters.component.length > 0 && (
                                <FlexItem>
                                  <Label isCompact color="grey">{filter.filters.component.length} component</Label>
                                </FlexItem>
                              )}
                            </Flex>
                          </DataListCell>,
                          <DataListCell key="actions" width={1} alignRight>
                            <Flex gap={{ default: 'gapSm' }}>
                              <FlexItem>
                                <Button
                                  variant="plain"
                                  size="sm"
                                  onClick={() => {
                                    setEditingFilterId(filter.id);
                                    setEditingFilterName(filter.name);
                                  }}
                                  aria-label="Edit filter name"
                                >
                                  <EditIcon />
                                </Button>
                              </FlexItem>
                              <FlexItem>
                                <Button
                                  variant="plain"
                                  size="sm"
                                  onClick={() => {
                                    setSavedFilters(savedFilters.filter(f => f.id !== filter.id));
                                    if (selectedSavedFilter?.id === filter.id) {
                                      setSelectedSavedFilter(null);
                                    }
                                    addToast('Filter deleted', 'success');
                                  }}
                                  aria-label="Delete filter"
                                >
                                  <TrashIcon />
                                </Button>
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
          <Button variant="primary" onClick={() => {
            setIsManageSavedFiltersModalOpen(false);
            setEditingFilterId(null);
            setEditingFilterName('');
          }}>
            Done
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export { MultiClusterAlertingDashboard };
