import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  EmptyStateActions,
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
  Banner,
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
  Wizard,
  WizardStep,
  WizardHeader,
  TextArea,
  Radio,
  FormGroup,
  Form,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  ExpandableSection,
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
  ChartLine,
  ChartScatter,
  ChartLegend,
  Chart,
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
  BellSlashIcon,
  ChartLineIcon,
  WrenchIcon,
  PortIcon,
  ExternalLinkAltIcon,
  SearchPlusIcon,
  SearchMinusIcon,
  UndoIcon,
  QuestionCircleIcon,
  PauseCircleIcon,
} from '@patternfly/react-icons';

// ========================================
// DATA TYPES
// ========================================

type AlertSeverity = 'Critical' | 'Warning' | 'Info';
type AlertStatus = 'firing' | 'acknowledged' | 'resolved' | 'pending';
type ClusterAlertStatus = 'critical' | 'warning' | 'info' | 'healthy'; // Based on firing alerts
type ACMClusterStatus = 'Ready' | 'Offline' | 'Failed' | 'Pending Import' | 'Installing' | 'Degraded' | 'Hibernating' | 'Unknown' | 'Detaching';
type AlertGroup = 'Cluster' | 'Namespace';
type AlertComponent = 'kube-apiserver' | 'Storage' | 'Network' | 'etcd' | 'Scheduler' | 'Controller' | 'Workload' | 'Pod' | 'Quota';
type GroupByOption = 'none' | 'region' | 'cloudProvider' | 'team' | 'severity';
type SortByOption = 'severity' | 'alertCount' | 'clusterName' | 'lastFired';
type ViewMode = 'treemap' | 'summary';
type ImportanceSizing = 'nodeCount' | 'cpuCores' | 'totalMemory' | 'podCount' | 'totalAlerts' | 'cpuRequests' | 'memoryRequests';
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
  acmStatus: ACMClusterStatus; // ACM lifecycle status
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
    region?: string[];
    cluster?: string[];
    namespace?: string[];
    label?: string[];
  };
  hidden?: boolean;
}

interface ToastNotification {
  id: string;
  title: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  description?: string;
}

// Alert Rule Types for Management
type AlertRuleState = 'Active' | 'Reconciling' | 'Partial success' | 'Failed' | 'Disabled';
type AlertRuleSource = 'User' | 'Platform';

interface AlertRuleActiveAlert {
  id: string;
  message: string;
  cluster: string;
  activeSince: string;
  state: 'Firing' | 'Pending' | 'Resolved';
  value: string;
  resource: string;
}

interface AlertRuleModification {
  date: string;
  user: string;
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  state: AlertRuleState;
  stateProgress?: number; // For reconciling state, 0-100
  appliedClusters?: number; // For reconciling state
  totalClusters?: number; // For reconciling state
  targetClusters: string[];
  group: AlertGroup;
  component: AlertComponent;
  source: AlertRuleSource;
  expression: string;
  forDuration: string;
  prometheusRule: string;
  labels: string[];
  summary: string;
  runbookUrl?: string;
  dashboards?: string;
  notificationMatchers?: string[];
  receivedBy?: string;
  receivers?: string[];
  createdAt: string;
  createdBy: string;
  modificationHistory: AlertRuleModification[];
  activeAlerts: AlertRuleActiveAlert[];
  enabled: boolean;
}

// Mock Alert Rules Data
const mockAlertRules: AlertRule[] = [
  {
    id: 'ar1',
    name: 'NodeCPUHigh',
    description: 'Node CPU utilization exceeds threshold',
    severity: 'Critical',
    state: 'Reconciling',
    stateProgress: 50,
    appliedClusters: 7,
    totalClusters: 14,
    targetClusters: ['OCP-Prod-East', 'OCP-Prod-West', 'OCP-Stage-AppC'],
    group: 'Cluster',
    component: 'kube-apiserver',
    source: 'User',
    expression: 'intstr.FromString("kubevirt_vmi_non_evictable * on(name, namespace) group_left() kubevirt_vmi_info{phase=\'running\'} == 1"),',
    forDuration: '60 seconds',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['label-label1', 'label2'],
    summary: 'EtcdLeaderElectionFailed',
    runbookUrl: 'https://mygitrunbook.com',
    dashboards: 'ocp-perses-clusterhealthdashboard',
    notificationMatchers: ['env=prod', 'region=us.east'],
    receivedBy: 'Slack',
    receivers: ['mst-it.slack.com', 'mst-critical.slack.com'],
    createdAt: '12 July, 2025 In OCP-Prod-West cluster',
    createdBy: 'adiadmin@nyp.com',
    modificationHistory: [
      { date: '12 July, 2025 12:36:01 PM', user: 'person1@company.com' },
      { date: '18 July, 2025 02:12:19 AM', user: 'person2@company.com' },
    ],
    activeAlerts: [
      { id: 'aa1', message: 'Node k8s-node-01 CPU utilization is critically high (96.2%).', cluster: 'OCP-Prod-East', activeSince: 'Jul 15, 2025, 8:14 AM', state: 'Firing', value: '---', resource: 'k8s-node-01' },
      { id: 'aa2', message: 'Node k8s-node-04 CPU utilization is critically high (95.8%).', cluster: 'OCP-Prod-East', activeSince: 'Jul 15, 2025, 8:20 AM', state: 'Firing', value: '---', resource: 'k8s-node-04' },
      { id: 'aa3', message: 'Node k8s-node-02 CPU utilization is critically high (98.1%).', cluster: 'OCP-Prod-West', activeSince: 'Jul 15, 2025, 8:25 AM', state: 'Firing', value: '---', resource: 'k8s-node-02' },
      { id: 'aa4', message: 'Node k8s-node-03 CPU utilization is critically high (97.5%).', cluster: 'OCP-Stage-AppC', activeSince: 'Jul 15, 2025, 8:14 AM', state: 'Firing', value: '---', resource: 'k8s-node-01' },
    ],
    enabled: true,
  },
  {
    id: 'ar2',
    name: 'API Server Request Latency High',
    description: 'API Server request latency exceeds threshold',
    severity: 'Warning',
    state: 'Active',
    targetClusters: ['OCP-Prod-East'],
    group: 'Cluster',
    component: 'kube-apiserver',
    source: 'User',
    expression: 'histogram_quantile(0.99, sum(rate(apiserver_request_duration_seconds_bucket[5m])) by (le)) > 1',
    forDuration: '5 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['api', 'latency'],
    summary: 'API Server latency is high',
    createdAt: '10 July, 2025',
    createdBy: 'admin@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar3',
    name: 'Kube-State-Metrics Down',
    description: 'Kube-state-metrics is not running',
    severity: 'Critical',
    state: 'Partial success',
    targetClusters: ['OCP-Prod-East', 'OCP-Prod-West', 'OCP-Stage-AppC', 'OCP-Dev-1', 'OCP-Dev-2'],
    group: 'Cluster',
    component: 'kube-apiserver',
    source: 'User',
    expression: 'absent(up{job="kube-state-metrics"} == 1)',
    forDuration: '2 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['monitoring'],
    summary: 'Kube-state-metrics is down',
    createdAt: '5 July, 2025',
    createdBy: 'admin@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar4',
    name: 'Cluster Storage Disk Usage Critical',
    description: 'Cluster storage disk usage exceeds 90%',
    severity: 'Critical',
    state: 'Failed',
    targetClusters: ['OCP-Prod-East', 'OCP-Prod-West', 'OCP-Stage-AppC', 'OCP-Dev-1'],
    group: 'Cluster',
    component: 'kube-apiserver',
    source: 'User',
    expression: 'node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1',
    forDuration: '10 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['storage', 'disk'],
    summary: 'Disk usage is critical',
    createdAt: '1 July, 2025',
    createdBy: 'admin@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar5',
    name: 'ImageRegistryPersistentVolumeFull',
    description: 'Image registry PV is full',
    severity: 'Critical',
    state: 'Failed',
    targetClusters: ['OCP-Prod-East', 'OCP-Prod-West', 'OCP-Stage-AppC', 'OCP-Dev-1', 'OCP-Dev-2', 'OCP-Dev-3', 'OCP-Test-1'],
    group: 'Namespace',
    component: 'kube-apiserver',
    source: 'User',
    expression: 'kubelet_volume_stats_available_bytes{persistentvolumeclaim=~"image-registry.*"} / kubelet_volume_stats_capacity_bytes < 0.05',
    forDuration: '5 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['registry', 'storage'],
    summary: 'Image registry PV is nearly full',
    createdAt: '28 June, 2025',
    createdBy: 'admin@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar6',
    name: 'MDSCacheUsageHigh',
    description: 'MDS cache usage is high',
    severity: 'Critical',
    state: 'Failed',
    targetClusters: ['OCP-Prod-East', 'OCP-Prod-West', 'OCP-Stage-AppC', 'OCP-Dev-1', 'OCP-Dev-2', 'OCP-Dev-3', 'OCP-Test-1', 'OCP-Test-2'],
    group: 'Cluster',
    component: 'kube-apiserver',
    source: 'Platform',
    expression: 'ceph_mds_cache_size_bytes / ceph_mds_cache_limit_bytes > 0.9',
    forDuration: '10 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['ceph', 'mds'],
    summary: 'MDS cache usage exceeds 90%',
    createdAt: '25 June, 2025',
    createdBy: 'platform@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar7',
    name: 'Etcd Quorum Lost',
    description: 'Etcd cluster has lost quorum',
    severity: 'Warning',
    state: 'Active',
    targetClusters: Array.from({ length: 19 }, (_, i) => `Cluster-${i + 1}`),
    group: 'Cluster',
    component: 'etcd',
    source: 'User',
    expression: 'sum(etcd_server_has_leader) by (cluster) < count(etcd_server_has_leader) by (cluster)',
    forDuration: '1 minute',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['etcd', 'quorum'],
    summary: 'Etcd quorum is lost',
    createdAt: '20 June, 2025',
    createdBy: 'admin@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar8',
    name: 'MDSCacheUsageHigh',
    description: 'MDS cache usage is high (namespace level)',
    severity: 'Warning',
    state: 'Active',
    targetClusters: ['OCP-Prod-East'],
    group: 'Namespace',
    component: 'etcd',
    source: 'Platform',
    expression: 'ceph_mds_cache_size_bytes / ceph_mds_cache_limit_bytes > 0.8',
    forDuration: '5 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['ceph', 'mds'],
    summary: 'MDS cache usage exceeds 80%',
    createdAt: '15 June, 2025',
    createdBy: 'platform@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar9',
    name: 'Virtual Machine Memory Exhausted',
    description: 'Virtual machine memory is exhausted',
    severity: 'Critical',
    state: 'Reconciling',
    stateProgress: 75,
    appliedClusters: 3,
    totalClusters: 4,
    targetClusters: ['OCP-Prod-East', 'OCP-Prod-West', 'OCP-Stage-AppC', 'OCP-Dev-1'],
    group: 'Namespace',
    component: 'Pod',
    source: 'User',
    expression: 'kubevirt_vmi_memory_used_bytes / kubevirt_vmi_memory_available_bytes > 0.95',
    forDuration: '5 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['vm', 'memory'],
    summary: 'VM memory is exhausted',
    createdAt: '10 June, 2025',
    createdBy: 'admin@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar10',
    name: 'VMCannotBeEvicted',
    description: 'VM cannot be evicted',
    severity: 'Critical',
    state: 'Reconciling',
    stateProgress: 30,
    appliedClusters: 3,
    totalClusters: 11,
    targetClusters: Array.from({ length: 11 }, (_, i) => `VM-Cluster-${i + 1}`),
    group: 'Namespace',
    component: 'Pod',
    source: 'Platform',
    expression: 'kubevirt_vmi_non_evictable == 1',
    forDuration: '10 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['vm', 'eviction'],
    summary: 'VM cannot be evicted',
    createdAt: '5 June, 2025',
    createdBy: 'platform@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
  {
    id: 'ar11',
    name: 'NodeCPUHigh',
    description: 'Node CPU high at namespace level',
    severity: 'Critical',
    state: 'Active',
    targetClusters: Array.from({ length: 18 }, (_, i) => `NS-Cluster-${i + 1}`),
    group: 'Namespace',
    component: 'kube-apiserver',
    source: 'User',
    expression: 'node:node_cpu_utilisation:avg1m > 0.9',
    forDuration: '5 minutes',
    prometheusRule: 'PrometheusRule-default (namespace: openshift-monitoring)',
    labels: ['cpu', 'node'],
    summary: 'Node CPU is high',
    createdAt: '1 June, 2025',
    createdBy: 'admin@company.com',
    modificationHistory: [],
    activeAlerts: [],
    enabled: true,
  },
];

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

    // Assign ACM status - most clusters are Ready, some have other statuses
    const acmStatuses: ACMClusterStatus[] = ['Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 'Ready', 
      'Degraded', 'Degraded', 'Offline', 'Unknown', 'Hibernating', 'Pending Import', 'Installing'];
    const acmStatus = acmStatuses[Math.floor(Math.random() * acmStatuses.length)];

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
      acmStatus,
    });
  }

  return clusters;
};

const mockClusters: ClusterData[] = generateMockClusters();

// ========================================
// HELPER FUNCTIONS
// ========================================

const getClusterAlertStatus = (cluster: ClusterData): ClusterAlertStatus => {
  const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
  if (firingAlerts.some(a => a.severity === 'Critical')) return 'critical';
  if (firingAlerts.some(a => a.severity === 'Warning')) return 'warning';
  if (firingAlerts.some(a => a.severity === 'Info')) return 'info';
  return 'healthy';
};

const getStatusBackgroundColor = (status: ClusterAlertStatus): string => {
  switch (status) {
    case 'critical': return '#c9190b';
    case 'warning': return '#f0ab00';
    case 'info': return '#6753ac';
    case 'healthy': return '#3e8635';
    default: return '#3e8635';
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
  onLegendClick?: (severity: 'Critical' | 'Warning' | 'Info' | 'Healthy') => void;
  activeLegendFilters?: ('Critical' | 'Warning' | 'Info' | 'Healthy')[];
}

const TreemapHeatmap: React.FC<TreemapHeatmapProps> = ({
  clusters,
  groupBy,
  importanceSizing,
  severityFilter,
  onDrillDown,
  onLegendClick,
  activeLegendFilters = [],
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

  const buildTreemapData = () => {
    // Filter clusters based on severity filter - hide healthy clusters when filtering
    let filteredClusters = clusters;
    if (severityFilter.length > 0 || activeLegendFilters.length > 0) {
      filteredClusters = clusters.filter(cluster => {
        const clusterStatus = getClusterAlertStatus(cluster);
        const statusCapitalized = clusterStatus.charAt(0).toUpperCase() + clusterStatus.slice(1);
        
        // If legend filters are active, use them
        if (activeLegendFilters.length > 0) {
          return activeLegendFilters.includes(statusCapitalized as 'Critical' | 'Warning' | 'Info' | 'Healthy');
        }
        
        // If severity filter is active, filter out healthy clusters
        if (severityFilter.length > 0) {
          // Hide healthy clusters when severity filter is set
          if (clusterStatus === 'healthy') return false;
          // Only show clusters with matching severity
          const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
          return firingAlerts.some(a => severityFilter.includes(a.severity));
        }
        return true;
      });
    }

    if (groupBy === 'none') {
      return filteredClusters.map(cluster => ({
        name: cluster.name,
        value: getTileValue(cluster, importanceSizing, severityFilter),
        itemStyle: { color: getClusterColor(cluster) },
        cluster,
      }));
    }

    const groups: Record<string, ClusterData[]> = {};
    filteredClusters.forEach(cluster => {
      let key: string;
      if (groupBy === 'severity') {
        key = getClusterAlertStatus(cluster).charAt(0).toUpperCase() + getClusterAlertStatus(cluster).slice(1);
      } else {
        key = String(cluster[groupBy as keyof ClusterData]);
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(cluster);
    });

    return Object.entries(groups)
      .filter(([_, groupClusters]) => groupClusters.length > 0)
      .map(([groupName, groupClusters]) => ({
        name: groupName,
        children: groupClusters.map(cluster => ({
          name: cluster.name,
          value: getTileValue(cluster, importanceSizing, severityFilter),
          itemStyle: { color: getClusterColor(cluster) },
          cluster,
        })),
      }));
  };

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const raw = e.target;
      const el =
        raw instanceof Element ? raw : (raw as Node).parentElement;
      const link = el?.closest?.('[data-treemap-view-all]') as HTMLElement | null;
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      const id = link.getAttribute('data-treemap-view-all');
      if (!id) return;
      const cluster = clusters.find(c => c.id === id);
      if (cluster) onDrillDown(cluster);
    };
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, [clusters, onDrillDown]);

  const option = {
    tooltip: {
      confine: true,
      enterable: true,
      hideDelay: 200,
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
        const statusColor = getClusterColor(cluster);
        
        // Calculate component health - get worst severity per component
        const componentHealth: Record<string, { severity: string; color: string }> = {};
        firingAlerts.forEach(alert => {
          const comp = alert.component;
          const currentSeverity = componentHealth[comp]?.severity;
          // Determine priority: Critical > Warning > Info
          if (!currentSeverity || 
              (alert.severity === 'Critical') ||
              (alert.severity === 'Warning' && currentSeverity !== 'Critical') ||
              (alert.severity === 'Info' && currentSeverity !== 'Critical' && currentSeverity !== 'Warning')) {
            componentHealth[comp] = {
              severity: alert.severity,
              color: alert.severity === 'Critical' ? pfColors.critical : 
                     alert.severity === 'Warning' ? pfColors.warning : pfColors.info
            };
          }
        });
        
        // Build component health HTML
        const componentHealthHtml = Object.entries(componentHealth)
          .sort((a, b) => {
            const order = { Critical: 0, Warning: 1, Info: 2 };
            return (order[a[1].severity as keyof typeof order] || 3) - (order[b[1].severity as keyof typeof order] || 3);
          })
          .slice(0, 5) // Limit to 5 components
          .map(([comp, health]) => `
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${health.color};"></span>
              <span style="font-size: 12px; color: #151515;">${comp}</span>
              <span style="font-size: 11px; color: ${health.color}; font-weight: 500;">${health.severity.toLowerCase()}</span>
            </div>
          `).join('');
        
        const moreComponents = Object.keys(componentHealth).length > 5 
          ? `<div style="font-size: 11px; color: #6a6e73; margin-top: 4px;">+${Object.keys(componentHealth).length - 5} more components</div>` 
          : '';
        
        const totalAlerts = cluster.alerts.filter(a => a.status === 'firing').length;
        
        return `
          <div style="font-family: 'RedHatText', 'Helvetica Neue', Helvetica, Arial, sans-serif; min-width: 220px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};"></span>
              <span style="font-size: 14px; font-weight: 600; color: #151515;">Cluster ${cluster.name}</span>
            </div>
            <div style="font-size: 12px; color: #6a6e73; margin-bottom: 12px;">${cluster.region} · ${cluster.cloudProvider}</div>
            ${Object.keys(componentHealth).length > 0 ? `
              <div style="margin-bottom: 8px;">
                <div style="font-size: 11px; font-weight: 600; color: #6a6e73; margin-bottom: 6px;">Component's health</div>
                ${componentHealthHtml}
                ${moreComponents}
              </div>
            ` : `
              <div style="font-size: 12px; color: ${pfColors.healthy}; margin-bottom: 8px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${pfColors.healthy}; margin-right: 6px;"></span>
                All components healthy
              </div>
            `}
            <div style="font-size: 12px; color: #6a6e73; padding-top: 8px; border-top: 1px solid #d2d2d2; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px;">
              <span>Nodes: <strong style="color: #151515;">${cluster.nodeCount}</strong></span>
              <span>Pods: <strong style="color: #151515;">${cluster.podCount}</strong></span>
              <span>Memory: <strong style="color: #151515;">${cluster.totalMemory} GB</strong></span>
              <span>VMs: <strong style="color: #151515;">${cluster.vmCount || 0}</strong></span>
              <span>Alerts: <strong style="color: ${totalAlerts > 0 ? statusColor : '#151515'};">${totalAlerts}</strong></span>
            </div>
            <div style="font-size: 12px; color: #6a6e73; margin-top: 10px;">Select the cluster to view all alerts</div>
            <div style="margin-top: 8px;">
              <a href="#" data-treemap-view-all="${cluster.id}" style="font-size: 12px; font-weight: 600; color: #0066cc; text-decoration: underline; cursor: pointer;">View all alerts</a>
            </div>
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
        height: 28,
        color: '#151515',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: chartBodyFont,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        borderRadius: [6, 6, 0, 0],
        padding: [6, 12],
        formatter: (params: any) => {
          const childCount = params.data?.children?.length || 0;
          return childCount > 0 ? `${params.name} (${childCount})` : params.name;
        },
      },
      itemStyle: { 
        borderColor: '#ffffff', 
        borderWidth: 3, 
        gapWidth: 3,
        borderRadius: 6,
      },
      emphasis: { 
        itemStyle: { 
          borderColor: '#0066cc', 
          borderWidth: 3,
          borderRadius: 6,
          shadowBlur: 8,
          shadowColor: 'rgba(0, 102, 204, 0.3)',
        },
      },
      levels: [
        { 
          itemStyle: { 
            borderColor: '#ffffff', 
            borderWidth: 4, 
            gapWidth: 4,
            borderRadius: 8,
          },
          upperLabel: {
            show: groupBy !== 'none',
            height: 28,
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: '#f5f5f5',
            borderRadius: [6, 6, 0, 0],
          },
        },
        { 
          itemStyle: { 
            borderColor: '#ffffff', 
            borderWidth: 3, 
            gapWidth: 3,
            borderRadius: 6,
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
          notMerge={true}
          lazyUpdate={false}
        />
      </div>
      {/* Legend - PatternFly aligned, clickable */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px', 
        padding: '16px',
        borderTop: '1px solid var(--pf-t--global--border--color--default, #d2d2d2)',
        marginTop: '12px',
        backgroundColor: 'var(--pf-t--global--background--color--secondary--default, #f5f5f5)',
        borderRadius: '0 0 var(--pf-t--global--border--radius--small, 3px) var(--pf-t--global--border--radius--small, 3px)',
      }}>
        {(['Critical', 'Warning', 'Info', 'Healthy'] as const).map(status => {
          const colorMap = { Critical: pfColors.critical, Warning: pfColors.warning, Info: pfColors.info, Healthy: pfColors.healthy };
          const isActive = activeLegendFilters.length === 0 || activeLegendFilters.includes(status);
          return (
            <div 
              key={status}
              onClick={() => onLegendClick?.(status)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: isActive ? '#ffffff' : '#f0f0f0',
                borderRadius: 'var(--pf-t--global--border--radius--small, 3px)',
                border: isActive 
                  ? `2px solid ${colorMap[status]}` 
                  : '1px solid var(--pf-t--global--border--color--default, #d2d2d2)',
                cursor: 'pointer',
                opacity: isActive ? 1 : 0.5,
                transition: 'all 0.15s ease-in-out',
              }}
            >
              <span style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '3px', 
                background: colorMap[status],
                opacity: isActive ? 1 : 0.4,
              }}></span>
              <span style={{ 
                fontSize: '13px', 
                color: isActive ? '#151515' : '#6a6e73', 
                fontWeight: 500 
              }}>{status}</span>
            </div>
          );
        })}
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
  onClose: () => void;
  savedFilters: SavedFilter[];
  onApplySavedFilter: (filter: SavedFilter) => void;
  onSaveFilter: (name: string) => void;
  onDeleteSavedFilter: (id: string) => void;
  // Counts for filter options
  regionCounts?: Record<string, number>;
  clusterCounts?: Record<string, number>;
  namespaceCounts?: Record<string, number>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  regionFilter, setRegionFilter,
  clusterFilter, setClusterFilter,
  namespaceFilter, setNamespaceFilter,
  labelFilter, setLabelFilter,
  severityFilter, setSeverityFilter,
  groupFilter, setGroupFilter,
  componentFilter, setComponentFilter,
  regions, clusterNames, namespaces, availableLabels,
  onClose,
  savedFilters, onApplySavedFilter, onSaveFilter, onDeleteSavedFilter,
  regionCounts = {}, clusterCounts = {}, namespaceCounts = {},
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
  const [isLabelOpen, setIsLabelOpen] = React.useState(false);
  const [isComponentOpen, setIsComponentOpen] = React.useState(false);

  // Search values for dropdowns
  const [regionSearchValue, setRegionSearchValue] = React.useState('');
  const [clusterSearchValue, setClusterSearchValue] = React.useState('');
  const [namespaceSearchValue, setNamespaceSearchValue] = React.useState('');
  const [labelSearchValue, setLabelSearchValue] = React.useState('');
  const [componentSearchValue, setComponentSearchValue] = React.useState('');

  const hasActiveFilters = regionFilter.length > 0 || clusterFilter.length > 0 || namespaceFilter.length > 0 || 
    labelFilter.length > 0 || severityFilter.length > 0 || groupFilter.length > 0 || componentFilter.length > 0;

  const clearAllFilters = () => {
    setRegionFilter([]);
    setClusterFilter([]);
    setNamespaceFilter([]);
    setLabelFilter([]);
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
  const filteredLabels = availableLabels.filter(l => l.toLowerCase().includes(labelSearchValue.toLowerCase()));
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
                    {region} {regionCounts[region] !== undefined && `(${regionCounts[region]})`}
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
                    {cluster} {clusterCounts[cluster] !== undefined && `(${clusterCounts[cluster]})`}
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
                    {ns} {namespaceCounts[ns] !== undefined && `(${namespaceCounts[ns]})`}
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
            {labelFilter.length > 0 && (
              <LabelGroup style={{ marginTop: '8px' }}>
                {labelFilter.map(l => (
                  <Label key={l} color="yellow" onClose={() => setLabelFilter(labelFilter.filter(x => x !== l))} icon={<FilterIcon />}>
                    {l}
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
// ALL ALERTS CARD (COMBINED WITH INSIGHTS)
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
  componentFilter: string | null;
  onClearAlertNameFilter: () => void;
  onClearComponentFilter: () => void;
  onClusterClick: (cluster: ClusterData) => void;
  onAlertClick: (alert: AlertData) => void;
  onAlertRuleClick: (alertName: string) => void;
  onComponentClick: (componentName: string) => void;
}

const AllAlertsCard: React.FC<AllAlertsCardProps> = ({
  clusters,
  alertNameFilter,
  componentFilter,
  onClearAlertNameFilter,
  onClearComponentFilter,
  onClusterClick,
  onAlertClick,
  onAlertRuleClick,
  onComponentClick,
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [severityFilter, setSeverityFilter] = React.useState<AlertSeverity[]>([]);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [expandedAlerts, setExpandedAlerts] = React.useState<string[]>([]);
  const [isAggregated, setIsAggregated] = React.useState(true);
  const [openActionMenuId, setOpenActionMenuId] = React.useState<string | null>(null);
  
  // Silence modal state
  const [isSilenceModalOpen, setIsSilenceModalOpen] = React.useState(false);
  const [silenceAlertName, setSilenceAlertName] = React.useState<string>('');
  const [silenceSeverity, setSilenceSeverity] = React.useState<string>('');
  const [silenceClusterName, setSilenceClusterName] = React.useState<string>('');
  const [silenceFromDate, setSilenceFromDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [silenceFromTime, setSilenceFromTime] = React.useState<string>('00:00');
  const [silenceDurationType, setSilenceDurationType] = React.useState<'for' | 'until'>('for');
  const [silenceDuration, setSilenceDuration] = React.useState<number>(2);
  const [silenceDurationUnit, setSilenceDurationUnit] = React.useState<'Hours' | 'Days' | 'Weeks'>('Hours');
  const [silenceUntilDate, setSilenceUntilDate] = React.useState<string>('');
  const [silenceUntilTime, setSilenceUntilTime] = React.useState<string>('');
  const [silenceComment, setSilenceComment] = React.useState<string>('');
  const [isSilenceDurationUnitOpen, setIsSilenceDurationUnitOpen] = React.useState(false);
  const [isSilenceParamsExpanded, setIsSilenceParamsExpanded] = React.useState(true);
  
  // Acknowledge modal state
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = React.useState(false);
  const [acknowledgeAlertName, setAcknowledgeAlertName] = React.useState<string>('');
  const [acknowledgeSeverity, setAcknowledgeSeverity] = React.useState<string>('');
  const [acknowledgeClusterName, setAcknowledgeClusterName] = React.useState<string>('');
  const [acknowledgeComment, setAcknowledgeComment] = React.useState<string>('');
  const [acknowledgeSilenceChecked, setAcknowledgeSilenceChecked] = React.useState(false);
  const [acknowledgeDurationType, setAcknowledgeDurationType] = React.useState<'for' | 'until'>('for');
  const [acknowledgeDuration, setAcknowledgeDuration] = React.useState<number>(2);
  const [acknowledgeDurationUnit, setAcknowledgeDurationUnit] = React.useState<'Hours' | 'Days' | 'Weeks'>('Hours');
  const [acknowledgeUntilDate, setAcknowledgeUntilDate] = React.useState<string>('');
  const [acknowledgeUntilTime, setAcknowledgeUntilTime] = React.useState<string>('');
  const [isAcknowledgeDurationUnitOpen, setIsAcknowledgeDurationUnitOpen] = React.useState(false);
  
  // Open silence modal with alert info
  const openSilenceModal = (alertName: string, severity: string, clusterName: string) => {
    setSilenceAlertName(alertName);
    setSilenceSeverity(severity);
    setSilenceClusterName(clusterName);
    setSilenceFromDate(new Date().toISOString().split('T')[0]);
    setSilenceFromTime('00:00');
    setSilenceDurationType('for');
    setSilenceDuration(2);
    setSilenceDurationUnit('Hours');
    setSilenceUntilDate('');
    setSilenceUntilTime('');
    setSilenceComment('');
    setIsSilenceModalOpen(true);
    setOpenActionMenuId(null);
  };
  
  // Open acknowledge modal with alert info
  const openAcknowledgeModal = (alertName: string, severity: string, clusterName: string) => {
    setAcknowledgeAlertName(alertName);
    setAcknowledgeSeverity(severity);
    setAcknowledgeClusterName(clusterName);
    setAcknowledgeComment('');
    setAcknowledgeSilenceChecked(false);
    setAcknowledgeDurationType('for');
    setAcknowledgeDuration(2);
    setAcknowledgeDurationUnit('Hours');
    setAcknowledgeUntilDate('');
    setAcknowledgeUntilTime('');
    setIsAcknowledgeModalOpen(true);
    setOpenActionMenuId(null);
  };

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
      if (componentFilter && alert.component !== componentFilter) return false;
      if (severityFilter.length > 0 && !severityFilter.includes(alert.severity)) return false;
      if (searchValue && !alert.alertName.toLowerCase().includes(searchValue.toLowerCase())) return false;
      return true;
    });
  }, [aggregatedAlerts, alertNameFilter, componentFilter, severityFilter, searchValue]);

  // Filter individual alerts (for non-aggregated view)
  const filteredAlerts = React.useMemo(() => {
    return allAlerts.filter(alert => {
      if (alertNameFilter && alert.alertName !== alertNameFilter) return false;
      if (componentFilter && alert.component !== componentFilter) return false;
      if (severityFilter.length > 0 && !severityFilter.includes(alert.severity)) return false;
      if (searchValue && !alert.alertName.toLowerCase().includes(searchValue.toLowerCase()) && 
          !alert.clusterName.toLowerCase().includes(searchValue.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.lastFiredTimestamp.getTime() - a.lastFiredTimestamp.getTime());
  }, [allAlerts, alertNameFilter, componentFilter, severityFilter, searchValue]);

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
              Firing Alerts
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
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                          <Switch
                            id="aggregate-all-alerts-switch"
                            label="Aggregate identical alerts"
                            isChecked={isAggregated}
                            onChange={(_, checked) => {
                              setIsAggregated(checked);
                              setPage(1);
                              setExpandedAlerts([]);
                            }}
                          />
                          <Tooltip content="Combine alerts with the same name and severity into a single row to reduce noise and simplify your view.">
                            <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', cursor: 'help' }} />
                          </Tooltip>
                        </Flex>
                      </ToolbarItem>
                      {alertNameFilter && (
                        <ToolbarItem>
                          <Label color="blue" onClose={onClearAlertNameFilter}>
                            Alert: {alertNameFilter}
                          </Label>
                        </ToolbarItem>
                      )}
                      {componentFilter && (
                        <ToolbarItem>
                          <Label color="green" onClose={onClearComponentFilter}>
                            Component: {componentFilter}
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
                    <Th>Alert Name</Th>
                    <Th>Severity</Th>
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
                          <strong>{agg.alertName}</strong>
                        </Td>
                        <Td>
                          <Label color={getSeverityLabelColor(agg.severity)} icon={getSeverityIcon(agg.severity)} isCompact>
                            {agg.severity}
                          </Label>
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
                                      <Th>Cluster name</Th>
                                      <Th>Last Fired</Th>
                                      <Th>Actions</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {agg.clusters.map(clusterInfo => (
                                      <Tr key={clusterInfo.name}>
                                        <Td>
                                          <ClusterIcon /> {clusterInfo.name}
                                        </Td>
                                        <Td>{clusterInfo.lastFired}</Td>
                                        <Td>
                                          <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                            <FlexItem>
                                              <Button 
                                                variant="link" 
                                                isInline 
                                                onClick={() => onClusterClick(clusterInfo.cluster)}
                                              >
                                                View cluster alerts
                                              </Button>
                                            </FlexItem>
                                            <FlexItem>
                                              <Dropdown
                                                isOpen={openActionMenuId === `${agg.alertName}-${clusterInfo.name}`}
                                                onOpenChange={(isOpen) => setOpenActionMenuId(isOpen ? `${agg.alertName}-${clusterInfo.name}` : null)}
                                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                                  <MenuToggle 
                                                    ref={toggleRef} 
                                                    variant="plain" 
                                                    aria-label="Alert actions"
                                                    onClick={() => setOpenActionMenuId(
                                                      openActionMenuId === `${agg.alertName}-${clusterInfo.name}` 
                                                        ? null 
                                                        : `${agg.alertName}-${clusterInfo.name}`
                                                    )}
                                                    isExpanded={openActionMenuId === `${agg.alertName}-${clusterInfo.name}`}
                                                  >
                                                    <EllipsisVIcon />
                                                  </MenuToggle>
                                                )}
                                                popperProps={{ position: 'right' }}
                                              >
                                                <DropdownList>
                                                  <DropdownItem 
                                                    key="silence" 
                                                    onClick={() => openSilenceModal(agg.alertName, agg.severity, clusterInfo.name)}
                                                    description="Temporarily stop notifications for this alert."
                                                  >
                                                    Silence alert
                                                  </DropdownItem>
                                                  <DropdownItem 
                                                    key="acknowledge" 
                                                    onClick={() => openAcknowledgeModal(agg.alertName, agg.severity, clusterInfo.name)}
                                                    description="Mark the alert as being addressed by your teammates."
                                                  >
                                                    Acknowledge
                                                  </DropdownItem>
                                                  <Divider component="li" />
                                                  <DropdownItem key="rule" onClick={() => setOpenActionMenuId(null)}>
                                                    View alert rule
                                                  </DropdownItem>
                                                  <DropdownItem key="logs" onClick={() => setOpenActionMenuId(null)}>
                                                    View logs
                                                  </DropdownItem>
                                                  <DropdownItem key="metrics" onClick={() => setOpenActionMenuId(null)}>
                                                    View metrics
                                                  </DropdownItem>
                                                  <DropdownItem key="incident" onClick={() => setOpenActionMenuId(null)}>
                                                    See related incident
                                                  </DropdownItem>
                                                  <DropdownItem key="troubleshoot" onClick={() => setOpenActionMenuId(null)}>
                                                    Troubleshoot
                                                  </DropdownItem>
                                                </DropdownList>
                                              </Dropdown>
                                            </FlexItem>
                                          </Flex>
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
                    <Th>Alert Name</Th>
                    <Th>Severity</Th>
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
                        <Button variant="link" isInline onClick={() => onAlertClick(alert)}>
                          {alert.alertName}
                        </Button>
                      </Td>
                      <Td>
                        <Label color={getSeverityLabelColor(alert.severity)} icon={getSeverityIcon(alert.severity)} isCompact>
                          {alert.severity}
                        </Label>
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
      
      {/* Silence Alert Modal */}
      <Modal
        isOpen={isSilenceModalOpen}
        onClose={() => setIsSilenceModalOpen(false)}
        aria-labelledby="silence-alert-modal-title"
        aria-describedby="silence-alert-modal-body"
        variant="medium"
      >
        <ModalHeader
          title="Silence alert"
          labelId="silence-alert-modal-title"
          description={
            <Stack hasGutter>
              <StackItem>
                Temporarily stop notifications for <strong>{silenceAlertName}</strong> alert.
              </StackItem>
              <StackItem>
                <Content component="small">
                  When the alert state is set to 'Silenced', all alert notifications will be muted until the specified time. The creator of this silence is <strong>admin@nyy.com</strong>.
                </Content>
              </StackItem>
            </Stack>
          }
        />
        <ModalBody id="silence-alert-modal-body">
          <Stack hasGutter>
            {/* Alert silence parameters accordion */}
            <StackItem>
              <Accordion togglePosition="start">
                <AccordionItem isExpanded={isSilenceParamsExpanded}>
                  <AccordionToggle
                    onClick={() => setIsSilenceParamsExpanded(!isSilenceParamsExpanded)}
                    id="silence-params-toggle"
                  >
                    Alert silence parameters
                  </AccordionToggle>
                  <AccordionContent hidden={!isSilenceParamsExpanded}>
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>alertname</DescriptionListTerm>
                        <DescriptionListDescription>{silenceAlertName}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>severity</DescriptionListTerm>
                        <DescriptionListDescription>{silenceSeverity.toLowerCase()}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>namespace</DescriptionListTerm>
                        <DescriptionListDescription>default</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>managed_cluster</DescriptionListTerm>
                        <DescriptionListDescription>#{silenceClusterName}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>prometheus</DescriptionListTerm>
                        <DescriptionListDescription>openshift-monitoring/k8s</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </StackItem>
            
            {/* Silence duration */}
            <StackItem>
              <Stack hasGutter>
                <StackItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                    <FlexItem>
                      <Content component="p"><strong>Silence notifications for this alert</strong> <span style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>*</span></Content>
                    </FlexItem>
                    <FlexItem>
                      <Tooltip content="Specify when the silence should start and for how long it should last.">
                        <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                </StackItem>
                
                {/* From row */}
                <StackItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                    <FlexItem style={{ width: '60px' }}>From</FlexItem>
                    <FlexItem>
                      <DatePicker 
                        value={silenceFromDate} 
                        onChange={(_, value) => setSilenceFromDate(value)} 
                      />
                    </FlexItem>
                    <FlexItem>
                      <TimePicker 
                        time={silenceFromTime} 
                        onChange={(_, time) => setSilenceFromTime(time)} 
                        is24Hour
                      />
                    </FlexItem>
                  </Flex>
                </StackItem>
                
                {/* For row */}
                <StackItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                    <FlexItem style={{ width: '60px' }}>
                      <input 
                        type="radio" 
                        id="duration-for" 
                        name="duration-type" 
                        checked={silenceDurationType === 'for'} 
                        onChange={() => setSilenceDurationType('for')} 
                        style={{ marginRight: '8px' }}
                      />
                      <label htmlFor="duration-for">For</label>
                    </FlexItem>
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <Button 
                          variant="control" 
                          onClick={() => setSilenceDuration(Math.max(1, silenceDuration - 1))}
                          isDisabled={silenceDurationType !== 'for'}
                        >
                          -
                        </Button>
                        <TextInputGroup isDisabled={silenceDurationType !== 'for'}>
                          <TextInputGroupMain 
                            type="number" 
                            value={silenceDuration} 
                            onChange={(_, value) => setSilenceDuration(Number(value) || 1)} 
                            style={{ width: '60px', textAlign: 'center' }}
                          />
                        </TextInputGroup>
                        <Button 
                          variant="control" 
                          onClick={() => setSilenceDuration(silenceDuration + 1)}
                          isDisabled={silenceDurationType !== 'for'}
                        >
                          +
                        </Button>
                        {silenceDurationType === 'for' ? (
                          <Select
                            isOpen={isSilenceDurationUnitOpen}
                            onOpenChange={setIsSilenceDurationUnitOpen}
                            onSelect={(_, value) => { setSilenceDurationUnit(value as 'Hours' | 'Days' | 'Weeks'); setIsSilenceDurationUnitOpen(false); }}
                            selected={silenceDurationUnit}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsSilenceDurationUnitOpen(!isSilenceDurationUnitOpen)} 
                                isExpanded={isSilenceDurationUnitOpen}
                                style={{ width: '120px' }}
                              >
                                {silenceDurationUnit}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="Hours">Hours</SelectOption>
                              <SelectOption value="Days">Days</SelectOption>
                              <SelectOption value="Weeks">Weeks</SelectOption>
                            </SelectList>
                          </Select>
                        ) : (
                          <MenuToggle 
                            isDisabled
                            style={{ width: '120px' }}
                          >
                            {silenceDurationUnit}
                          </MenuToggle>
                        )}
                      </Flex>
                    </FlexItem>
                  </Flex>
                </StackItem>
                
                {/* Until row */}
                <StackItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                    <FlexItem style={{ width: '60px' }}>
                      <input 
                        type="radio" 
                        id="duration-until" 
                        name="duration-type" 
                        checked={silenceDurationType === 'until'} 
                        onChange={() => setSilenceDurationType('until')} 
                        style={{ marginRight: '8px' }}
                      />
                      <label htmlFor="duration-until">Until</label>
                    </FlexItem>
                    <FlexItem>
                      <DatePicker 
                        value={silenceUntilDate} 
                        onChange={(_, value) => setSilenceUntilDate(value)} 
                        isDisabled={silenceDurationType !== 'until'}
                      />
                    </FlexItem>
                    <FlexItem>
                      <TimePicker 
                        time={silenceUntilTime} 
                        onChange={(_, time) => setSilenceUntilTime(time)} 
                        is24Hour
                        isDisabled={silenceDurationType !== 'until'}
                      />
                    </FlexItem>
                  </Flex>
                </StackItem>
              </Stack>
            </StackItem>
            
            {/* Comment */}
            <StackItem>
              <Stack hasGutter>
                <StackItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                    <FlexItem>
                      <Content component="p"><strong>Comment (optional)</strong></Content>
                    </FlexItem>
                    <FlexItem>
                      <Tooltip content="Add a comment to help your team understand why this alert was silenced.">
                        <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                </StackItem>
                <StackItem>
                  <TextInputGroup>
                    <TextInputGroupMain 
                      type="text" 
                      placeholder="I'm on it!"
                      value={silenceComment} 
                      onChange={(_, value) => setSilenceComment(value)} 
                    />
                  </TextInputGroup>
                </StackItem>
                <StackItem>
                  <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Add a short comment to provide more details. Let others in the team know how this alert is being addressed.
                  </Content>
                </StackItem>
              </Stack>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsSilenceModalOpen(false)}>
            Silence alert
          </Button>
          <Button variant="link" onClick={() => setIsSilenceModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* Acknowledge Alert Modal */}
      <Modal
        isOpen={isAcknowledgeModalOpen}
        onClose={() => setIsAcknowledgeModalOpen(false)}
        aria-labelledby="acknowledge-alert-modal-title"
        aria-describedby="acknowledge-alert-modal-body"
        variant="medium"
      >
        <ModalHeader
          title="Acknowledge alert"
          labelId="acknowledge-alert-modal-title"
          description={`Mark ${acknowledgeAlertName} alert as acknowledged to indicate it's being addressed.`}
        />
        <ModalBody id="acknowledge-alert-modal-body">
          <Stack hasGutter>
            {/* Comment - Required */}
            <StackItem>
              <Stack hasGutter>
                <StackItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                    <FlexItem>
                      <Content component="p"><strong>Comment</strong> <span style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}>*</span></Content>
                    </FlexItem>
                    <FlexItem>
                      <Tooltip content="Add a comment to help your team understand how this alert is being addressed.">
                        <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                </StackItem>
                <StackItem>
                  <TextInputGroup>
                    <TextInputGroupMain 
                      type="text" 
                      placeholder="I'm on it!"
                      value={acknowledgeComment} 
                      onChange={(_, value) => setAcknowledgeComment(value)} 
                    />
                  </TextInputGroup>
                </StackItem>
                <StackItem>
                  <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Add a short comment to provide more details. Let others in the team know how this alert is being addressed.
                  </Content>
                </StackItem>
              </Stack>
            </StackItem>
            
            {/* Silence notifications checkbox */}
            <StackItem>
              <Checkbox
                id="acknowledge-silence-checkbox"
                label="Silence notifications for this alert"
                isChecked={acknowledgeSilenceChecked}
                onChange={(_, checked) => setAcknowledgeSilenceChecked(checked)}
              />
            </StackItem>
            
            {/* Duration options - only shown when silence checkbox is checked */}
            {acknowledgeSilenceChecked && (
              <StackItem>
                <Stack hasGutter>
                  {/* For row */}
                  <StackItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                      <FlexItem style={{ width: '60px' }}>
                        <input 
                          type="radio" 
                          id="ack-duration-for" 
                          name="ack-duration-type" 
                          checked={acknowledgeDurationType === 'for'} 
                          onChange={() => setAcknowledgeDurationType('for')} 
                          style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="ack-duration-for">For</label>
                      </FlexItem>
                      <FlexItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <Button 
                            variant="control" 
                            onClick={() => setAcknowledgeDuration(Math.max(1, acknowledgeDuration - 1))}
                            isDisabled={acknowledgeDurationType !== 'for'}
                          >
                            -
                          </Button>
                          <TextInputGroup isDisabled={acknowledgeDurationType !== 'for'}>
                            <TextInputGroupMain 
                              type="number" 
                              value={acknowledgeDuration} 
                              onChange={(_, value) => setAcknowledgeDuration(Number(value) || 1)} 
                              style={{ width: '60px', textAlign: 'center' }}
                            />
                          </TextInputGroup>
                          <Button 
                            variant="control" 
                            onClick={() => setAcknowledgeDuration(acknowledgeDuration + 1)}
                            isDisabled={acknowledgeDurationType !== 'for'}
                          >
                            +
                          </Button>
                          {acknowledgeDurationType === 'for' ? (
                            <Select
                              isOpen={isAcknowledgeDurationUnitOpen}
                              onOpenChange={setIsAcknowledgeDurationUnitOpen}
                              onSelect={(_, value) => { setAcknowledgeDurationUnit(value as 'Hours' | 'Days' | 'Weeks'); setIsAcknowledgeDurationUnitOpen(false); }}
                              selected={acknowledgeDurationUnit}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle 
                                  ref={toggleRef} 
                                  onClick={() => setIsAcknowledgeDurationUnitOpen(!isAcknowledgeDurationUnitOpen)} 
                                  isExpanded={isAcknowledgeDurationUnitOpen}
                                  style={{ width: '120px' }}
                                >
                                  {acknowledgeDurationUnit}
                                </MenuToggle>
                              )}
                            >
                              <SelectList>
                                <SelectOption value="Hours">Hours</SelectOption>
                                <SelectOption value="Days">Days</SelectOption>
                                <SelectOption value="Weeks">Weeks</SelectOption>
                              </SelectList>
                            </Select>
                          ) : (
                            <MenuToggle 
                              isDisabled
                              style={{ width: '120px' }}
                            >
                              {acknowledgeDurationUnit}
                            </MenuToggle>
                          )}
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </StackItem>
                  
                  {/* Until row */}
                  <StackItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                      <FlexItem style={{ width: '60px' }}>
                        <input 
                          type="radio" 
                          id="ack-duration-until" 
                          name="ack-duration-type" 
                          checked={acknowledgeDurationType === 'until'} 
                          onChange={() => setAcknowledgeDurationType('until')} 
                          style={{ marginRight: '8px' }}
                        />
                        <label htmlFor="ack-duration-until">Until</label>
                      </FlexItem>
                      <FlexItem>
                        <DatePicker 
                          value={acknowledgeUntilDate} 
                          onChange={(_, value) => setAcknowledgeUntilDate(value)} 
                          isDisabled={acknowledgeDurationType !== 'until'}
                        />
                      </FlexItem>
                      <FlexItem>
                        <TimePicker 
                          time={acknowledgeUntilTime} 
                          onChange={(_, time) => setAcknowledgeUntilTime(time)} 
                          is24Hour
                          isDisabled={acknowledgeDurationType !== 'until'}
                        />
                      </FlexItem>
                    </Flex>
                  </StackItem>
                </Stack>
              </StackItem>
            )}
            
            {/* Info alert */}
            <StackItem>
              <PfAlert variant="info" isInline title={`Alert will be shown as "Acknowledged by admin@nyf.com"`} />
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsAcknowledgeModalOpen(false)} isDisabled={!acknowledgeComment.trim()}>
            Acknowledge alert
          </Button>
          <Button variant="link" onClick={() => setIsAcknowledgeModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

// ========================================
// CROSS-CLUSTER INSIGHTS CARDS
// ========================================

interface CrossClusterInsightsCardsProps {
  clusters: ClusterData[];
  onAlertRuleClick: (alertName: string) => void;
  onComponentClick: (componentName: string) => void;
}

const CrossClusterInsightsCards: React.FC<CrossClusterInsightsCardsProps> = ({
  clusters,
  onAlertRuleClick,
  onComponentClick,
}) => {
  // Calculate alert rule counts across all clusters
  const alertRuleCounts = React.useMemo(() => {
    const counts: Record<string, { count: number; severity: AlertSeverity; clusters: string[] }> = {};
    clusters.forEach(cluster => {
      cluster.alerts.filter(a => a.status === 'firing').forEach(alert => {
        if (!counts[alert.alertName]) {
          counts[alert.alertName] = { count: 0, severity: alert.severity, clusters: [] };
        }
        counts[alert.alertName].count++;
        if (!counts[alert.alertName].clusters.includes(cluster.name)) {
          counts[alert.alertName].clusters.push(cluster.name);
        }
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
  }, [clusters]);

  // Calculate component counts across all clusters
  const componentCounts = React.useMemo(() => {
    const counts: Record<string, { count: number; critical: number; warning: number; info: number; clusters: string[] }> = {};
    clusters.forEach(cluster => {
      cluster.alerts.filter(a => a.status === 'firing').forEach(alert => {
        if (!counts[alert.component]) {
          counts[alert.component] = { count: 0, critical: 0, warning: 0, info: 0, clusters: [] };
        }
        counts[alert.component].count++;
        if (alert.severity === 'Critical') counts[alert.component].critical++;
        if (alert.severity === 'Warning') counts[alert.component].warning++;
        if (alert.severity === 'Info') counts[alert.component].info++;
        if (!counts[alert.component].clusters.includes(cluster.name)) {
          counts[alert.component].clusters.push(cluster.name);
        }
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
  }, [clusters]);

  return (
    <>
      {/* Top Firing Alerts Card */}
      <StackItem>
        <Card>
          <CardHeader>
            <CardTitle>Top alerts</CardTitle>
          </CardHeader>
          <CardBody>
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
                  <Tr key={rule.name} isClickable onRowClick={() => onAlertRuleClick(rule.name)}>
                    <Td>
                      <Button variant="link" isInline onClick={(e) => { e.stopPropagation(); onAlertRuleClick(rule.name); }}>
                        {rule.name}
                      </Button>
                    </Td>
                    <Td>
                      <Label color={getSeverityLabelColor(rule.severity)} isCompact>{rule.severity}</Label>
                    </Td>
                    <Td><Badge>{rule.count}</Badge></Td>
                    <Td>
                      <Popover
                        headerContent="Clusters"
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
          </CardBody>
        </Card>
      </StackItem>

      {/* Most affected components */}
      <StackItem>
        <Card>
          <CardHeader>
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
              <CardTitle>Most affected components</CardTitle>
              <Tooltip content="Kubernetes subsystems (such as kube-apiserver, etcd, kubelet) with active firing alerts.">
                <Button variant="plain" aria-label="More info about affected components" icon={<QuestionCircleIcon />} />
              </Tooltip>
            </Flex>
          </CardHeader>
          <CardBody>
            <Table aria-label="Most impacted components" variant="compact">
              <Thead>
                <Tr>
                  <Th>Component</Th>
                  <Th>Clusters</Th>
                  <Th>Total</Th>
                  <Th>Breakdown</Th>
                </Tr>
              </Thead>
              <Tbody>
                {componentCounts.map(comp => (
                  <Tr key={comp.name} isClickable onRowClick={() => onComponentClick(comp.name)}>
                    <Td>
                      <Button variant="link" isInline onClick={(e) => { e.stopPropagation(); onComponentClick(comp.name); }}>
                        {comp.name}
                      </Button>
                    </Td>
                    <Td>
                      <Popover
                        headerContent="Clusters with this component impacted"
                        bodyContent={
                          <Stack hasGutter>
                            {comp.clusters.map(c => (
                              <StackItem key={c}>{c}</StackItem>
                            ))}
                          </Stack>
                        }
                      >
                        <Badge isRead style={{ cursor: 'pointer' }}>{comp.clusters.length} clusters</Badge>
                      </Popover>
                    </Td>
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
                    <Td colSpan={4}>
                      <Content component="small" className="pf-v6-u-color-200">No impacted components</Content>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </StackItem>
    </>
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
        <CardTitle>Alert velocity and trends</CardTitle>
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
  const status = getClusterAlertStatus(cluster);
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Main page tabs - initialize from URL params
  const [mainPageTab, setMainPageTab] = React.useState<string | number>(() => {
    const tab = searchParams.get('tab');
    return tab === 'management' ? 'management' : tab === 'incidents' ? 'incidents' : 'alerts';
  });
  const [alertsSubTab, setAlertsSubTab] = React.useState<'clusters-health' | 'firing-alerts'>('clusters-health');
  const [managementSubTab, setManagementSubTab] = React.useState<string | number>(() => {
    const subtab = searchParams.get('subtab');
    return subtab === 'silence-rules' ? 'silence-rules' : 'alert-rules';
  });
  
  // Handle URL parameter changes for tab navigation
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    const subtab = searchParams.get('subtab');
    if (tab === 'management') {
      setMainPageTab('management');
      if (subtab === 'silence-rules') {
        setManagementSubTab('silence-rules');
      } else {
        setManagementSubTab('alert-rules');
      }
    }
  }, [searchParams]);
  
  // View state
  const [isDrillDownView, setIsDrillDownView] = React.useState(false);
  const [selectedCluster, setSelectedCluster] = React.useState<ClusterData | null>(null);

  // Filter states
  const [regionFilter, setRegionFilter] = React.useState<string[]>([]);
  const [clusterFilter, setClusterFilter] = React.useState<string[]>([]);
  const [namespaceFilter, setNamespaceFilter] = React.useState<string[]>([]);
  const [labelFilter, setLabelFilter] = React.useState<string[]>([]);
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
  // Treemap legend filters
  const [treemapLegendFilters, setTreemapLegendFilters] = React.useState<('Critical' | 'Warning' | 'Info' | 'Healthy')[]>([]);
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
  
  // Alert Rule Drawer state
  const [isAlertRuleDrawerOpen, setIsAlertRuleDrawerOpen] = React.useState(false);
  const [selectedAlertRule, setSelectedAlertRule] = React.useState<AlertRule | null>(null);
  const [alertRuleDrawerTab, setAlertRuleDrawerTab] = React.useState<string | number>('details');
  const [alertRuleExpandedClusters, setAlertRuleExpandedClusters] = React.useState<string[]>([]);
  const [alertRuleExpandedAlerts, setAlertRuleExpandedAlerts] = React.useState<string[]>([]);
  const [alertRuleTimelineRange, setAlertRuleTimelineRange] = React.useState('30 minutes');
  const [isAlertRuleTimelineRangeOpen, setIsAlertRuleTimelineRangeOpen] = React.useState(false);
  const [alertRuleTargetClusterFilter, setAlertRuleTargetClusterFilter] = React.useState<string>('all');
  const [isAlertRuleTargetClusterFilterOpen, setIsAlertRuleTargetClusterFilterOpen] = React.useState(false);
  
  // Alert Rules Filter Panel state
  const [isAlertRulesFilterPanelOpen, setIsAlertRulesFilterPanelOpen] = React.useState(false);
  const [alertRulesClusterFilter, setAlertRulesClusterFilter] = React.useState<string[]>([]);
  const [alertRulesNamespaceFilter, setAlertRulesNamespaceFilter] = React.useState<string[]>([]);
  const [alertRulesGroupFilter, setAlertRulesGroupFilter] = React.useState<AlertGroup[]>([]);
  const [alertRulesComponentFilter, setAlertRulesComponentFilter] = React.useState<AlertComponent[]>([]);
  const [alertRulesSeverityFilter, setAlertRulesSeverityFilter] = React.useState<AlertSeverity[]>([]);
  const [alertRulesStateFilter, setAlertRulesStateFilter] = React.useState<AlertRuleState[]>([]);
  const [alertRulesSourceFilter, setAlertRulesSourceFilter] = React.useState<AlertRuleSource[]>([]);
  const [alertRulesSearchValue, setAlertRulesSearchValue] = React.useState('');
  const [isAlertRulesComponentDropdownOpen, setIsAlertRulesComponentDropdownOpen] = React.useState(false);
  
  // Alert Rules Selection and Actions state
  const [selectedAlertRuleIds, setSelectedAlertRuleIds] = React.useState<string[]>([]);
  const [alertRuleActionMenuOpen, setAlertRuleActionMenuOpen] = React.useState<string | null>(null);
  const [isBulkActionsMenuOpen, setIsBulkActionsMenuOpen] = React.useState(false);
  
  // Disable Alert Rule Modal state
  const [isDisableAlertRuleModalOpen, setIsDisableAlertRuleModalOpen] = React.useState(false);
  const [alertRulesToDisable, setAlertRulesToDisable] = React.useState<AlertRule[]>([]);
  const [disableAlertRuleExpandedIds, setDisableAlertRuleExpandedIds] = React.useState<string[]>([]);

  // Toast notifications
  const [toasts, setToasts] = React.useState<ToastNotification[]>([]);

  // All alerts card state
  const [mainAlertNameFilter, setMainAlertNameFilter] = React.useState<string | null>(null);
  const [mainComponentFilter, setMainComponentFilter] = React.useState<string | null>(null);

  // Last refresh
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  // Get unique filter options
  const regions = getUniqueValues(mockClusters, 'region');
  const clusterNames = getUniqueValues(mockClusters, 'name');
  const namespaces = getAllNamespaces(mockClusters);
  const allAlerts = getAllAlerts(mockClusters);
  
  // Get unique labels from all clusters and alerts
  const availableLabels = React.useMemo(() => {
    const labelsSet = new Set<string>();
    mockClusters.forEach(cluster => {
      // Add cluster labels
      Object.entries(cluster.labels).forEach(([key, value]) => {
        labelsSet.add(`${key}=${value}`);
      });
      // Add alert labels
      cluster.alerts.forEach(alert => {
        Object.entries(alert.labels).forEach(([key, value]) => {
          labelsSet.add(`${key}=${value}`);
        });
      });
    });
    return Array.from(labelsSet).sort();
  }, []);

  // Calculate counts for filter options (shows number of clusters per option)
  const regionCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    mockClusters.forEach(cluster => {
      counts[cluster.region] = (counts[cluster.region] || 0) + 1;
    });
    return counts;
  }, []);

  const clusterCounts = React.useMemo(() => {
    // For clusters, show the number of firing alerts
    const counts: Record<string, number> = {};
    mockClusters.forEach(cluster => {
      counts[cluster.name] = cluster.alerts.filter(a => a.status === 'firing').length;
    });
    return counts;
  }, []);

  const namespaceCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    mockClusters.forEach(cluster => {
      cluster.namespaces.forEach(ns => {
        counts[ns] = (counts[ns] || 0) + 1;
      });
    });
    return counts;
  }, []);

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
          const statusDiff = statusOrder[getClusterAlertStatus(a)] - statusOrder[getClusterAlertStatus(b)];
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
    setLabelFilter([]);
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
    labelFilter.length > 0 || severityFilter.length > 0 || groupFilter.length > 0 || componentFilter.length > 0 || searchValue.length > 0;

  const hasDrillDownActiveFilters = drillDownSeverityFilter.length > 0 || drillDownGroupFilter.length > 0 || 
    drillDownComponentFilter.length > 0 || drillDownSourceFilter.length > 0 || drillDownStateFilter.length > 0 ||
    drillDownSearchValue.length > 0 || drillDownTriggeredFrom.length > 0 || drillDownTriggeredTo.length > 0;

  // Size by options based on role
  const sizeByOptions = userRole === 'admin' 
    ? [
        { value: 'nodeCount', label: 'Number of nodes' },
        { value: 'cpuCores', label: 'Total CPU cores' },
        { value: 'totalMemory', label: 'Total memory (GiB)' },
        { value: 'podCount', label: 'Total pods' },
        { value: 'totalAlerts', label: 'Total alerts' },
      ]
    : [
        { value: 'podCount', label: 'Total pods' },
        { value: 'cpuRequests', label: 'Total CPU requests' },
        { value: 'memoryRequests', label: 'Total memory requests' },
        { value: 'totalAlerts', label: 'Total alerts' },
      ];

  // ========================================
  // DRILL-DOWN VIEW - Now integrated into Alerts tab
  // The drill-down content is rendered within the mainPageTab === 'alerts' section
  // ========================================
  
  // Render drill-down drawer and table content
  const renderDrillDownContent = () => {
    if (!selectedCluster) return null;
    return (
      <>
        {/* Main Content */}
          <Drawer isExpanded={isDrawerExpanded} position="end" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                  <DescriptionListTerm>Component</DescriptionListTerm>
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
              <DrawerContentBody style={{ overflow: 'auto', height: '100%' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', width: '100%', minHeight: 0 }}>
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
                      {/* Summary by impact group and severity - Improved Design */}
                      <StackItem>
                        <Card>
                          <CardHeader>
                            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem>
                                <CardTitle>
                                  <Button 
                                    variant="plain" 
                                    onClick={() => setIsSummaryAccordionExpanded(!isSummaryAccordionExpanded)}
                                    style={{ padding: 0 }}
                                  >
                                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                      <FlexItem>
                                        {isSummaryAccordionExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                                      </FlexItem>
                                      <FlexItem>
                                        <strong>Summary by impact group and severity</strong>
                                      </FlexItem>
                                      <FlexItem>
                                        <Badge isRead>{selectedCluster.alerts.filter(a => a.status === 'firing').length} firing alerts</Badge>
                                      </FlexItem>
                                    </Flex>
                                  </Button>
                                </CardTitle>
                              </FlexItem>
                            </Flex>
                          </CardHeader>
                          {isSummaryAccordionExpanded && (
                            <CardBody>
                              <Grid hasGutter>
                                {/* Cluster Group */}
                                <GridItem md={6}>
                                  <Card isPlain isCompact style={{ backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', border: '1px solid var(--pf-t--global--border--color--default)' }}>
                                    <CardHeader>
                                      <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                        <FlexItem><Icon size="md"><CubeIcon /></Icon></FlexItem>
                                        <FlexItem><strong>Cluster</strong></FlexItem>
                                        <FlexItem><Badge isRead>{selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.status === 'firing').length}</Badge></FlexItem>
                                      </Flex>
                                    </CardHeader>
                                    <CardBody>
                                      <Stack hasGutter>
                                        <StackItem>
                                          <Button variant="link" isInline onClick={() => { setDrillDownGroupFilter(['Cluster']); setDrillDownSeverityFilter(['Critical']); }}>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon status="danger"><ExclamationCircleIcon /></Icon></FlexItem>
                                              <FlexItem style={{ fontFamily: 'var(--pf-t--global--font--family--body)', fontSize: '14px', fontWeight: 400, lineHeight: '21px', color: 'var(--pf-t--global--text--color--link--default)' }}>
                                                <strong>{selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.severity === 'Critical' && a.status === 'firing').length}</strong> Critical
                                              </FlexItem>
                                            </Flex>
                                          </Button>
                                        </StackItem>
                                        <StackItem>
                                          <Button variant="link" isInline onClick={() => { setDrillDownGroupFilter(['Cluster']); setDrillDownSeverityFilter(['Warning']); }}>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon status="warning"><ExclamationTriangleIcon /></Icon></FlexItem>
                                              <FlexItem style={{ fontFamily: 'var(--pf-t--global--font--family--body)', fontSize: '14px', fontWeight: 400, lineHeight: '21px', color: 'var(--pf-t--global--text--color--link--default)' }}>
                                                <strong>{selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.severity === 'Warning' && a.status === 'firing').length}</strong> Warning
                                              </FlexItem>
                                            </Flex>
                                          </Button>
                                        </StackItem>
                                        <StackItem>
                                          <Button variant="link" isInline onClick={() => { setDrillDownGroupFilter(['Cluster']); setDrillDownSeverityFilter(['Info']); }}>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon status="info"><InfoCircleIcon /></Icon></FlexItem>
                                              <FlexItem style={{ fontFamily: 'var(--pf-t--global--font--family--body)', fontSize: '14px', fontWeight: 400, lineHeight: '21px', color: 'var(--pf-t--global--text--color--link--default)' }}>
                                                <strong>{selectedCluster.alerts.filter(a => a.group === 'Cluster' && a.severity === 'Info' && a.status === 'firing').length}</strong> Info
                                              </FlexItem>
                                            </Flex>
                                          </Button>
                                        </StackItem>
                                      </Stack>
                                    </CardBody>
                                  </Card>
                                </GridItem>

                                {/* Namespace Group */}
                                <GridItem md={6}>
                                  <Card isPlain isCompact style={{ backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', border: '1px solid var(--pf-t--global--border--color--default)' }}>
                                    <CardHeader>
                                      <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                        <FlexItem><Icon size="md"><CubesIcon /></Icon></FlexItem>
                                        <FlexItem><strong>Namespace</strong></FlexItem>
                                        <FlexItem><Badge isRead>{selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.status === 'firing').length}</Badge></FlexItem>
                                      </Flex>
                                    </CardHeader>
                                    <CardBody>
                                      <Stack hasGutter>
                                        <StackItem>
                                          <Button variant="link" isInline onClick={() => { setDrillDownGroupFilter(['Namespace']); setDrillDownSeverityFilter(['Critical']); }}>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon status="danger"><ExclamationCircleIcon /></Icon></FlexItem>
                                              <FlexItem style={{ fontFamily: 'var(--pf-t--global--font--family--body)', fontSize: '14px', fontWeight: 400, lineHeight: '21px', color: 'var(--pf-t--global--text--color--link--default)' }}>
                                                <strong>{selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.severity === 'Critical' && a.status === 'firing').length}</strong> Critical
                                              </FlexItem>
                                            </Flex>
                                          </Button>
                                        </StackItem>
                                        <StackItem>
                                          <Button variant="link" isInline onClick={() => { setDrillDownGroupFilter(['Namespace']); setDrillDownSeverityFilter(['Warning']); }}>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon status="warning"><ExclamationTriangleIcon /></Icon></FlexItem>
                                              <FlexItem style={{ fontFamily: 'var(--pf-t--global--font--family--body)', fontSize: '14px', fontWeight: 400, lineHeight: '21px', color: 'var(--pf-t--global--text--color--link--default)' }}>
                                                <strong>{selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.severity === 'Warning' && a.status === 'firing').length}</strong> Warning
                                              </FlexItem>
                                            </Flex>
                                          </Button>
                                        </StackItem>
                                        <StackItem>
                                          <Button variant="link" isInline onClick={() => { setDrillDownGroupFilter(['Namespace']); setDrillDownSeverityFilter(['Info']); }}>
                                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                              <FlexItem><Icon status="info"><InfoCircleIcon /></Icon></FlexItem>
                                              <FlexItem style={{ fontFamily: 'var(--pf-t--global--font--family--body)', fontSize: '14px', fontWeight: 400, lineHeight: '21px', color: 'var(--pf-t--global--text--color--link--default)' }}>
                                                <strong>{selectedCluster.alerts.filter(a => a.group === 'Namespace' && a.severity === 'Info' && a.status === 'firing').length}</strong> Info
                                              </FlexItem>
                                            </Flex>
                                          </Button>
                                        </StackItem>
                                      </Stack>
                                    </CardBody>
                                  </Card>
                                </GridItem>
                              </Grid>
                            </CardBody>
                          )}
                        </Card>
                      </StackItem>

                      {/* Alerts Table */}
                      <StackItem>
                        <Card>
                          <CardHeader style={{ padding: '24px 24px 0 24px' }}>
                            <Toolbar style={{ padding: 0, margin: 0, paddingBottom: '24px', minHeight: 'auto' }}>
                              <ToolbarContent style={{ padding: 0, alignItems: 'center' }}>
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
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                                    <Switch
                                      id="aggregate-switch"
                                      label="Aggregate identical alerts"
                                      isChecked={isAggregated}
                                      onChange={(_, checked) => setIsAggregated(checked)}
                                    />
                                    <Tooltip content="Combine alerts with the same name and severity into a single row to reduce noise and simplify your view.">
                                      <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)', cursor: 'help' }} />
                                    </Tooltip>
                                  </Flex>
                                </ToolbarItem>
                                <ToolbarItem variant="separator" />
                                <ToolbarItem align={{ default: 'alignEnd' }}>
                                  <Tooltip content="Manage columns">
                                    <Button variant="plain" icon={<ColumnsIcon />} onClick={openManageColumnsModal} aria-label="Manage columns" />
                                  </Tooltip>
                                </ToolbarItem>
                              </ToolbarContent>
                            </Toolbar>

                            {/* Active filter chips */}
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
                                      // Check if current filters differ from saved filter
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
                                            // Update the existing saved filter with current filter values
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
                                            // Update the selected filter reference
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
                    {drillDownSavedFilters.map((filter, index) => (
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

  // ========================================
  // MAIN VIEW (Multi-cluster Alerting Page)
  // ========================================
  return (
    <div className="alerting-page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Version Banner */}
      <Banner status="info" screenReaderText="Info notification">
        <Flex justifyContent={{ default: 'justifyContentCenter' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            This is an older version of the alerting interface.
          </FlexItem>
          <FlexItem>
            <Button 
              component="a" 
              href="/prototypes/shiri-alerting-ui-v2/observe/alerting" 
              variant="link" 
              isInline
            >
              View updated prototype (Version 2)
            </Button>
          </FlexItem>
        </Flex>
      </Banner>
      
      {/* Sticky Header Section - Breadcrumbs + Header + Tabs + Toolbar */}
      <div style={{ 
        flexShrink: 0,
        backgroundColor: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
        borderBottom: '1px solid var(--pf-t--global--border--color--default, #d2d2d2)',
        zIndex: 100,
      }}>
        <div className="alerting-page-header" style={{ padding: '24px 24px 0 24px' }}>
          <Stack hasGutter>
            {/* Breadcrumbs */}
            <StackItem>
              <Breadcrumb>
                <BreadcrumbItem to="/">Home</BreadcrumbItem>
                <BreadcrumbItem to="/observe/alerting">Observe</BreadcrumbItem>
                {isDrillDownView && selectedCluster && (
                  <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); handleBackToList(); }}>Alerting</BreadcrumbItem>
                )}
                {isDrillDownView && selectedCluster ? (
                  <BreadcrumbItem isActive>Cluster alerts: {selectedCluster.name}</BreadcrumbItem>
                ) : (
                  <BreadcrumbItem isActive>Alerting</BreadcrumbItem>
                )}
              </Breadcrumb>
            </StackItem>

            {/* Header */}
            <StackItem>
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
            </StackItem>

            {/* Main Page Tabs */}
            <StackItem>
              <Tabs activeKey={mainPageTab} onSelect={(_, key) => setMainPageTab(key)} aria-label="Main alerting tabs" isFilled={false}>
                <Tab eventKey="alerts" title={<span><BellIcon /> Alerts</span>} />
                <Tab eventKey="incidents" title={<span><PortIcon /> Incidents</span>} />
                <Tab eventKey="management" title={<span><CogIcon /> Management</span>} />
              </Tabs>
            </StackItem>

            {/* Alerts Sub-tabs */}
            {mainPageTab === 'alerts' && !isDrillDownView && (
              <div style={{ marginTop: '-1px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
                <Tabs 
                  activeKey={alertsSubTab} 
                  onSelect={(_, key) => setAlertsSubTab(key as 'clusters-health' | 'firing-alerts')}
                  aria-label="Alerts sub-tabs" 
                  isSubtab
                >
                  <Tab eventKey="clusters-health" title={<TabTitleText>Clusters health</TabTitleText>} />
                  <Tab eventKey="firing-alerts" title={<TabTitleText>Firing alerts</TabTitleText>} />
                </Tabs>
              </div>
            )}

            {/* Management Sub-tabs - styled like Alerts sub-tabs */}
            {mainPageTab === 'management' && (
              <div style={{ marginTop: '-1px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
                <Tabs 
                  activeKey={managementSubTab} 
                  onSelect={(_, key) => setManagementSubTab(key)}
                  aria-label="Management sub-tabs" 
                  isSubtab
                >
                  <Tab 
                    eventKey="alert-rules" 
                    title={
                      <TabTitleText>
                        Alert rules <Badge isRead style={{ marginLeft: '8px' }}>21</Badge>
                      </TabTitleText>
                    } 
                  />
                  <Tab 
                    eventKey="silence-rules" 
                    title={
                      <TabTitleText>
                        Silence rules <Badge isRead style={{ marginLeft: '8px' }}>2</Badge>
                      </TabTitleText>
                    } 
                  />
                </Tabs>
              </div>
            )}

          </Stack>
        </div>

        {/* Toolbar section - inside sticky header */}
        {mainPageTab === 'alerts' && !isDrillDownView && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--pf-t--global--border--color--default, #d2d2d2)' }}>
            <Toolbar className="pf-m-align-items-center">
              <ToolbarContent className="pf-m-align-items-center">
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
                          setRegionFilter(filter.filters.region || []);
                          setClusterFilter(filter.filters.cluster || []);
                          setNamespaceFilter(filter.filters.namespace || []);
                          setLabelFilter(filter.filters.label || []);
                          setSearchValue(filter.filters.searchValue || '');
                          setIsSavedFiltersDropdownOpen(false);
                        }}
                      >
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                          <FlexItem>{filter.name}</FlexItem>
                          {selectedSavedFilter?.id === filter.id && (
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
          <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginTop: '8px', marginBottom: '16px' }}>
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
                {labelFilter.map(l => (
                  <Label key={l} color="yellow" onClose={() => setLabelFilter(labelFilter.filter(x => x !== l))} icon={<FilterIcon />}>{l}</Label>
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
                {selectedSavedFilter && (() => {
                  // Check if current filters differ from saved filter
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
                        // Update the existing saved filter with current filter values
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
                        // Update the selected filter reference
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
          </Flex>
        )}
          </div>
        )}
      </div>
      {/* End Sticky Header Section */}

      {/* Scrollable Content Area */}
      {mainPageTab === 'alerts' && !isDrillDownView && (
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Filter Side Panel - Sticky */}
        {isFilterPanelOpen && (
          <div style={{ 
            width: '280px', 
            minWidth: '280px', 
            flexShrink: 0, 
            height: '100%',
            overflowY: 'auto',
            borderRight: '1px solid var(--pf-t--global--border--color--default, #d2d2d2)',
            backgroundColor: 'var(--pf-t--global--background--color--primary--default, #ffffff)',
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
            />
          </div>
        )}

        {/* Main Content Area - Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <Stack hasGutter>
              {/* Stats Cards - Clusters health tab */}
              {alertsSubTab === 'clusters-health' && (
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
              )}

              {/* Cluster Overview Card - Clusters health tab */}
              {alertsSubTab === 'clusters-health' && (
              <StackItem>
                <Card>
                  <CardHeader>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Flex gap={{ default: 'gapXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <CardTitle>Fleet alerts</CardTitle>
                          <Tooltip content="Overview of all clusters in your fleet. Each tile represents an individual cluster.">
                            <Button variant="plain" aria-label="More information about Fleet alerts" icon={<InfoCircleIcon />} />
                          </Tooltip>
                        </Flex>
                      </FlexItem>
                      <FlexItem>
                        <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                          {/* Group By - shown for both views, disabled for Table */}
                          <FlexItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <label style={{ 
                                color: viewMode === 'summary' ? 'var(--pf-t--global--text--color--disabled)' : 'var(--pf-t--global--text--color--regular)', 
                                fontSize: 'var(--pf-t--global--font--size--sm)', 
                                fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                                lineHeight: '36px',
                                textAlign: 'center'
                              }}>Group by</label>
                              <Select
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle 
                                    ref={toggleRef} 
                                    onClick={() => viewMode !== 'summary' && setIsGroupByOpen(!isGroupByOpen)} 
                                    isExpanded={isGroupByOpen} 
                                    isDisabled={viewMode === 'summary'}
                                    style={{ width: '140px' }}
                                  >
                                    {groupBy === 'none' ? 'None' : groupBy === 'cloudProvider' ? 'Provider' : groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
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
                                  <SelectOption value="cloudProvider">Cloud provider</SelectOption>
                                  <SelectOption value="team">Team</SelectOption>
                                  <SelectOption value="severity">Severity</SelectOption>
                                </SelectList>
                              </Select>
                            </Flex>
                          </FlexItem>

                          {/* Size By - shown for both views, disabled for Table */}
                          <FlexItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <label style={{ 
                                color: viewMode === 'summary' ? 'var(--pf-t--global--text--color--disabled)' : 'var(--pf-t--global--text--color--regular)', 
                                fontSize: 'var(--pf-t--global--font--size--sm)', 
                                fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                                lineHeight: '36px',
                                textAlign: 'center'
                              }}>Size by</label>
                              <Select
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle 
                                    ref={toggleRef} 
                                    onClick={() => viewMode !== 'summary' && setIsSizeByOpen(!isSizeByOpen)} 
                                    isExpanded={isSizeByOpen} 
                                    isDisabled={viewMode === 'summary'}
                                    style={{ width: '140px' }}
                                  >
                                    {sizeByOptions.find(o => o.value === importanceSizing)?.label || 'Number of nodes'}
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
                            </Flex>
                          </FlexItem>

                          {/* Sort By - for both views */}
                          <FlexItem>
                            <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <label style={{ 
                                color: 'var(--pf-t--global--text--color--regular)', 
                                fontSize: 'var(--pf-t--global--font--size--sm)', 
                                fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                                lineHeight: '36px',
                                textAlign: 'center'
                              }}>Sort by</label>
                              <Select
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle ref={toggleRef} onClick={() => setIsSortByOpen(!isSortByOpen)} isExpanded={isSortByOpen} style={{ width: '140px' }}>
                                    {sortBy === 'severity' ? 'Severity (high-low)' : sortBy === 'alertCount' ? 'Alert count' : 'Cluster name'}
                                  </MenuToggle>
                                )}
                                onSelect={(_, value) => { setSortBy(value as SortByOption); setIsSortByOpen(false); }}
                                isOpen={isSortByOpen}
                                onOpenChange={setIsSortByOpen}
                                selected={sortBy}
                              >
                                <SelectList>
                                  <SelectOption value="severity">Severity (high-low)</SelectOption>
                                  <SelectOption value="alertCount">Alert count</SelectOption>
                                  <SelectOption value="clusterName">Cluster name</SelectOption>
                                </SelectList>
                              </Select>
                            </Flex>
                          </FlexItem>

                          {/* View Toggle - moved to the end */}
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
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    {viewMode === 'treemap' ? (
                      <TreemapHeatmap
                        clusters={sortedClusters}
                        groupBy={groupBy}
                        importanceSizing={importanceSizing}
                        severityFilter={severityFilter}
                        onDrillDown={handleDrillDown}
                        activeLegendFilters={treemapLegendFilters}
                        onLegendClick={(status) => {
                          setTreemapLegendFilters(prev => {
                            if (prev.includes(status)) {
                              // Remove from filter
                              const newFilters = prev.filter(s => s !== status);
                              return newFilters;
                            } else {
                              // Add to filter (or start fresh if empty)
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
                            <Th>Cluster Status</Th>
                            <Th>Cluster</Th>
                            <Th>Region</Th>
                            <Th>Group</Th>
                            <Th>Component</Th>
                            <Th>Total Alerts</Th>
                            <Th>Severity Breakdown</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {sortedClusters.slice((page - 1) * perPage, page * perPage).map(cluster => {
                            const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
                            const criticalCount = firingAlerts.filter(a => a.severity === 'Critical').length;
                            const warningCount = firingAlerts.filter(a => a.severity === 'Warning').length;
                            const infoCount = firingAlerts.filter(a => a.severity === 'Info').length;
                            // Get unique groups and components
                            const groups = Array.from(new Set(firingAlerts.map(a => a.group)));
                            const components = Array.from(new Set(firingAlerts.map(a => a.component)));
                            // ACM Cluster Status configuration with colors and icons
                            const acmStatusConfig: Record<ACMClusterStatus, { 
                              color: 'green' | 'red' | 'orange' | 'blue' | 'grey'; 
                              icon: React.ReactNode; 
                              description: string 
                            }> = {
                              'Ready': { 
                                color: 'green', 
                                icon: <CheckCircleIcon />, 
                                description: 'The cluster is online, agents are reporting, and the hub can manage it.' 
                              },
                              'Offline': { 
                                color: 'red', 
                                icon: <ExclamationCircleIcon />, 
                                description: 'The hub cannot reach the managed cluster. This is critical for connectivity.' 
                              },
                              'Failed': { 
                                color: 'red', 
                                icon: <ExclamationCircleIcon />, 
                                description: 'An operation (creation, import, or destroy) failed to complete.' 
                              },
                              'Pending Import': { 
                                color: 'blue', 
                                icon: <ClockIcon />, 
                                description: 'The cluster definition exists, but the import command hasn\'t been applied yet.' 
                              },
                              'Installing': { 
                                color: 'blue', 
                                icon: <SyncIcon />, 
                                description: 'The cluster is currently being provisioned by the Hive operator.' 
                              },
                              'Degraded': { 
                                color: 'orange', 
                                icon: <ExclamationTriangleIcon />, 
                                description: 'The cluster is reachable, but some core operators or services are failing.' 
                              },
                              'Hibernating': { 
                                color: 'grey', 
                                icon: <PauseCircleIcon />, 
                                description: 'The cluster is powered off (stopped) to save costs on cloud providers.' 
                              },
                              'Unknown': { 
                                color: 'grey', 
                                icon: <QuestionCircleIcon />, 
                                description: 'The status cannot be determined, often during an agent update or hub restart.' 
                              },
                              'Detaching': { 
                                color: 'orange', 
                                icon: <SyncIcon />, 
                                description: 'The cluster is in the process of being removed from ACM management.' 
                              },
                            };
                            
                            const statusConfig = acmStatusConfig[cluster.acmStatus] || acmStatusConfig['Unknown'];
                            
                            return (
                              <Tr key={cluster.id} isClickable onRowClick={() => handleDrillDown(cluster)}>
                                <Td>
                                  <Tooltip content={statusConfig.description}>
                                    <Label 
                                      color={statusConfig.color}
                                      icon={statusConfig.icon}
                                      isCompact
                                    >
                                      {cluster.acmStatus}
                                    </Label>
                                  </Tooltip>
                                </Td>
                                <Td>
                                  <strong>{cluster.name}</strong>
                                </Td>
                                <Td>{cluster.region}</Td>
                                <Td>
                                  {groups.length > 0 ? (
                                    <Label isCompact color="blue">{groups[0]}</Label>
                                  ) : (
                                    <span>-</span>
                                  )}
                                </Td>
                                <Td>
                                  {components.length > 0 ? (
                                    <Label isCompact variant="outline">{components[0]}</Label>
                                  ) : (
                                    <span>-</span>
                                  )}
                                </Td>
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
              )}

              {/* Cross-Cluster Insights Cards - on Clusters health tab */}
              {alertsSubTab === 'clusters-health' && (
                <CrossClusterInsightsCards
                  clusters={filteredClusters}
                  onAlertRuleClick={(alertName) => {
                    setMainAlertNameFilter(alertName);
                    setAlertsSubTab('firing-alerts');
                  }}
                  onComponentClick={(componentName) => {
                    setMainComponentFilter(componentName);
                    setAlertsSubTab('firing-alerts');
                  }}
                />
              )}

              {/* Alerts Timeline Card - on Clusters health tab */}
              {alertsSubTab === 'clusters-health' && (
                <StackItem>
                  <AlertsTimelineCard trendData={mockTrendData} />
                </StackItem>
              )}

              {/* All Alerts Card - on Firing alerts tab */}
              {alertsSubTab === 'firing-alerts' && (
                <StackItem>
                  <AllAlertsCard
                    clusters={filteredClusters}
                    alertNameFilter={mainAlertNameFilter}
                    componentFilter={mainComponentFilter}
                    onClearAlertNameFilter={() => setMainAlertNameFilter(null)}
                    onClearComponentFilter={() => setMainComponentFilter(null)}
                    onClusterClick={handleDrillDown}
                    onAlertClick={(alert) => {
                      setSelectedAlertDetail(alert);
                      setIsDrawerExpanded(true);
                    }}
                    onAlertRuleClick={(alertName) => {
                      setMainAlertNameFilter(alertName);
                    }}
                    onComponentClick={(componentName) => {
                      setMainComponentFilter(componentName);
                    }}
                  />
                </StackItem>
              )}
            </Stack>
          </div>
        </div>
      )}

      {/* Alerts Tab - Drill-down View (Cluster Alerts) */}
      {mainPageTab === 'alerts' && isDrillDownView && selectedCluster && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0, // Important for flex children to allow scrolling
          overflow: 'hidden',
        }}>
          {/* Cluster Sub-Header - Fixed at top */}
          <div style={{ padding: '24px 24px 16px 24px', flexShrink: 0 }}>
            <Content component="p" style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', margin: '0 0 12px 0' }}>
              Cluster alerts
            </Content>
            {/* Cluster name and status in one row - center aligned */}
            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>{selectedCluster.name}</Title>
              </FlexItem>
              <FlexItem>
                <Label 
                  color={getClusterAlertStatus(selectedCluster) === 'healthy' ? 'green' : getClusterAlertStatus(selectedCluster) === 'critical' ? 'red' : getClusterAlertStatus(selectedCluster) === 'warning' ? 'orange' : 'purple'}
                  icon={getClusterAlertStatus(selectedCluster) === 'healthy' ? <CheckCircleIcon /> : getClusterAlertStatus(selectedCluster) === 'critical' ? <ExclamationCircleIcon /> : getClusterAlertStatus(selectedCluster) === 'warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                >
                  {getClusterAlertStatus(selectedCluster).charAt(0).toUpperCase() + getClusterAlertStatus(selectedCluster).slice(1)}
                </Label>
              </FlexItem>
              <FlexItem>
                <Label color="blue" icon={<CubesIcon />}>{selectedCluster.nodeCount} Nodes</Label>
              </FlexItem>
              <FlexItem>
                <Label variant="outline">{selectedCluster.region} • {selectedCluster.cloudProvider}</Label>
              </FlexItem>
            </Flex>
          </div>

          {/* Scrollable content area */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '0 24px 24px 24px' }}>
            {/* Render the full drill-down content (drawer, table, modals) - includes Summary section */}
            {renderDrillDownContent()}
          </div>
        </div>
      )}

      {/* Incidents Tab Content */}
      {mainPageTab === 'incidents' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Card>
            <CardBody>
              <EmptyState 
                titleText="Automated visibility across your fleet" 
                headingLevel="h4" 
                icon={PortIcon}
                variant="lg"
              >
                <EmptyStateBody>
                  Gain better visibility into your cluster health with automated incident detection. 
                  By installing the Red Hat OpenShift incident detection Operator, you can use analytics 
                  to quickly identify and troubleshoot potential problems before they affect your users.
                </EmptyStateBody>
                <EmptyStateActions style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                  <Button variant="primary" icon={<PlusIcon />}>Install Operator</Button>
                </EmptyStateActions>
              </EmptyState>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Management Tab Content */}
      {mainPageTab === 'management' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Stack hasGutter>
            <StackItem>
              {managementSubTab === 'alert-rules' && (
                <div style={{ display: 'flex', gap: '16px' }}>
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
                            {/* Impact Group - Checkboxes */}
                            <StackItem>
                              <Content component="small" className="pf-v6-u-mb-sm"><strong>Impact group</strong></Content>
                              <Stack hasGutter>
                                {(['Cluster', 'Namespace'] as AlertGroup[]).map(grp => (
                                  <StackItem key={grp}>
                                    <Checkbox
                                      id={`ar-grp-${grp}`}
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
                              <Content component="small" className="pf-v6-u-mb-sm"><strong>Component</strong></Content>
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
                                      id={`ar-state-${state}`}
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
                                      id={`ar-source-${source}`}
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
                              id="select-all-rules" 
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
                              {(alertRulesClusterFilter.length + alertRulesNamespaceFilter.length + alertRulesGroupFilter.length + alertRulesComponentFilter.length + alertRulesSeverityFilter.length + alertRulesStateFilter.length + alertRulesSourceFilter.length) > 0 && (
                                <Badge style={{ marginLeft: '8px' }}>{alertRulesClusterFilter.length + alertRulesNamespaceFilter.length + alertRulesGroupFilter.length + alertRulesComponentFilter.length + alertRulesSeverityFilter.length + alertRulesStateFilter.length + alertRulesSourceFilter.length}</Badge>
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
                                <DropdownItem key="edit-labels">
                                  <div>
                                    <div><strong>Edit labels</strong></div>
                                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Modify labels for all selected alert rules.</div>
                                  </div>
                                </DropdownItem>
                                <DropdownItem key="edit-components">
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
                            <Button variant="primary" onClick={() => navigate('/observe/alerting/create-alert-rule')}>Create a new alert rule</Button>
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
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>Alert rule Name</FlexItem>
                              <FlexItem><SortAmountDownIcon /></FlexItem>
                              <FlexItem>
                                <Tooltip content="Name of the alert rule">
                                  <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </Th>
                          <Th>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>State</FlexItem>
                              <FlexItem><SortAmountDownIcon /></FlexItem>
                            </Flex>
                          </Th>
                          <Th>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>Severity</FlexItem>
                              <FlexItem><SortAmountDownIcon /></FlexItem>
                            </Flex>
                          </Th>
                          <Th>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>Target clusters</FlexItem>
                              <FlexItem><SortAmountDownIcon /></FlexItem>
                              <FlexItem>
                                <Tooltip content="Number of clusters this rule applies to">
                                  <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </Th>
                          <Th>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>Group</FlexItem>
                              <FlexItem><SortAmountDownIcon /></FlexItem>
                              <FlexItem>
                                <Tooltip content="Group categorization for the alert">
                                  <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </Th>
                          <Th>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>Component</FlexItem>
                              <FlexItem><SortAmountDownIcon /></FlexItem>
                              <FlexItem>
                                <Tooltip content="Component that the alert relates to">
                                  <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                                </Tooltip>
                              </FlexItem>
                            </Flex>
                          </Th>
                          <Th>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>Source</FlexItem>
                              <FlexItem><SortAmountDownIcon /></FlexItem>
                              <FlexItem>
                                <Tooltip content="Origin of the alert rule (User or Platform)">
                                  <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                                </Tooltip>
                              </FlexItem>
                            </Flex>
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
                                id={`rule-${rule.id}`} 
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
                                id={`switch-${rule.id}`} 
                                isChecked={rule.enabled} 
                                aria-label={`Enable ${rule.name}`}
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
              {managementSubTab === 'silence-rules' && (
                <Card>
                  <CardHeader>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <CardTitle>Silence Rules</CardTitle>
                      </FlexItem>
                      <FlexItem>
                        <Button variant="primary" icon={<PlusIcon />}>Create Silence</Button>
                      </FlexItem>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Table aria-label="Silence rules table" variant="compact">
                      <Thead>
                        <Tr>
                          <Th>Silence Name</Th>
                          <Th>Matchers</Th>
                          <Th>Status</Th>
                          <Th>Starts</Th>
                          <Th>Ends</Th>
                          <Th>Created By</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td><strong>Maintenance Window</strong></Td>
                          <Td>
                            <Flex gap={{ default: 'gapXs' }}>
                              <Label isCompact variant="outline">cluster=prod-east-1</Label>
                            </Flex>
                          </Td>
                          <Td><Label color="green" isCompact>Active</Label></Td>
                          <Td>Dec 18, 2025 00:00</Td>
                          <Td>Dec 18, 2025 04:00</Td>
                          <Td>admin@redhat.com</Td>
                          <Td>
                            <Button variant="link" isInline>Edit</Button>
                            <Button variant="link" isInline style={{ marginLeft: '8px' }}>Expire</Button>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td><strong>Known Issue - etcd</strong></Td>
                          <Td>
                            <Flex gap={{ default: 'gapXs' }}>
                              <Label isCompact variant="outline">alertname=EtcdHighLatency</Label>
                            </Flex>
                          </Td>
                          <Td><Label color="green" isCompact>Active</Label></Td>
                          <Td>Dec 15, 2025 12:00</Td>
                          <Td>Dec 22, 2025 12:00</Td>
                          <Td>sre@redhat.com</Td>
                          <Td>
                            <Button variant="link" isInline>Edit</Button>
                            <Button variant="link" isInline style={{ marginLeft: '8px' }}>Expire</Button>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td><strong>Upgrade Silence</strong></Td>
                          <Td>
                            <Flex gap={{ default: 'gapXs' }}>
                              <Label isCompact variant="outline">severity=warning</Label>
                              <Label isCompact variant="outline">region=EU West</Label>
                            </Flex>
                          </Td>
                          <Td><Label color="grey" isCompact>Expired</Label></Td>
                          <Td>Dec 10, 2025 08:00</Td>
                          <Td>Dec 10, 2025 16:00</Td>
                          <Td>ops@redhat.com</Td>
                          <Td>
                            <Button variant="link" isInline>Recreate</Button>
                            <Button variant="link" isInline style={{ marginLeft: '8px' }}>Delete</Button>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              )}
            </StackItem>
          </Stack>
        </div>
      )}

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
                    searchValue,
                    region: regionFilter,
                    cluster: clusterFilter,
                    namespace: namespaceFilter,
                    label: labelFilter,
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
                        <Tooltip content="Drag to reorder">
                          <span style={{ cursor: 'grab', display: 'flex', alignItems: 'center', padding: '8px' }}>
                            <GripVerticalIcon />
                          </span>
                        </Tooltip>
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
                                      setEditingFilterId(filter.id);
                                      setEditingFilterName(filter.name);
                                    }}
                                    aria-label="Edit filter name"
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
          <Button variant="primary" onClick={() => {
            setIsManageSavedFiltersModalOpen(false);
            setEditingFilterId(null);
            setEditingFilterName('');
          }}>
            Done
          </Button>
        </ModalFooter>
      </Modal>

      {/* Alert Rule Details Drawer */}
      {isAlertRuleDrawerOpen && selectedAlertRule && (
      <div style={{ position: 'fixed', top: '76px', left: 0, right: 0, bottom: 0, zIndex: 400 }}>
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            cursor: 'pointer'
          }}
          onClick={() => { setIsAlertRuleDrawerOpen(false); setSelectedAlertRule(null); }}
        />
        <div style={{ 
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
          overflow: 'hidden'
        }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--pf-t--global--border--color--default)', flexShrink: 0 }}>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                    <FlexItem>
                      <Title headingLevel="h2" size="lg">Alert rule details</Title>
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
                          <Button variant="plain" aria-label="Close" onClick={() => { setIsAlertRuleDrawerOpen(false); setSelectedAlertRule(null); }}>
                            <TimesIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Tabs activeKey={alertRuleDrawerTab} onSelect={(_, tabKey) => setAlertRuleDrawerTab(tabKey)} isFilled style={{ padding: '0 16px', flexShrink: 0 }}>
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
                                  <FlexItem><strong>{selectedAlertRule.name}</strong></FlexItem>
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
                                            onClick={() => {
                                              if (alertRuleExpandedClusters.includes(cluster)) {
                                                setAlertRuleExpandedClusters(alertRuleExpandedClusters.filter(c => c !== cluster));
                                              } else {
                                                setAlertRuleExpandedClusters([...alertRuleExpandedClusters, cluster]);
                                              }
                                            }}
                                            style={{ padding: 0 }}
                                          >
                                            {alertRuleExpandedClusters.includes(cluster) ? <AngleDownIcon /> : <AngleRightIcon />}
                                          </Button>
                                        </FlexItem>
                                        <FlexItem>
                                          <CheckCircleIcon color="var(--pf-t--global--color--status--success--default)" />
                                        </FlexItem>
                                        <FlexItem>{cluster}</FlexItem>
                                      </Flex>
                                      {alertRuleExpandedClusters.includes(cluster) && (
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
                              <DescriptionListTerm>Group</DescriptionListTerm>
                              <DescriptionListDescription>{selectedAlertRule.group}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Component</DescriptionListTerm>
                              <DescriptionListDescription>{selectedAlertRule.component}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Labels</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Flex gap={{ default: 'gapSm' }}>
                                  {selectedAlertRule.labels.map((label, idx) => (
                                    <FlexItem key={idx}>
                                      <Label isCompact variant="outline">{label}</Label>
                                    </FlexItem>
                                  ))}
                                </Flex>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Severity</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Label 
                                  color={selectedAlertRule.severity === 'Critical' ? 'red' : selectedAlertRule.severity === 'Warning' ? 'orange' : 'purple'} 
                                  icon={selectedAlertRule.severity === 'Critical' ? <ExclamationCircleIcon /> : selectedAlertRule.severity === 'Warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                                >
                                  {selectedAlertRule.severity}
                                </Label>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Expression</DescriptionListTerm>
                              <DescriptionListDescription>
                                <code style={{ 
                                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', 
                                  padding: '8px', 
                                  borderRadius: '4px',
                                  display: 'block',
                                  fontSize: '12px',
                                  wordBreak: 'break-all'
                                }}>
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
                                  <Button variant="link" isInline>{selectedAlertRule.runbookUrl}</Button>
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
                          <Title headingLevel="h4" size="md" style={{ marginTop: '16px', marginBottom: '16px' }}>Notifications</Title>
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
                                        <Label isCompact variant="outline">{matcher}</Label>
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
                          <Title headingLevel="h4" size="md" style={{ marginTop: '16px', marginBottom: '16px' }}>Alert rule history</Title>
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
                                          <FlexItem>{mod.date} by {mod.user}</FlexItem>
                                          <FlexItem>
                                            <Button variant="link" isInline>View changes</Button>
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
                                  <Title headingLevel="h4" size="md">Target clusters alerts</Title>
                                </FlexItem>
                                <FlexItem>
                                  <Select
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                      <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleTargetClusterFilterOpen(!isAlertRuleTargetClusterFilterOpen)} isExpanded={isAlertRuleTargetClusterFilterOpen}>
                                        {alertRuleTargetClusterFilter === 'all' ? `All target clusters (${selectedAlertRule.targetClusters.length})` : alertRuleTargetClusterFilter}
                                      </MenuToggle>
                                    )}
                                    isOpen={isAlertRuleTargetClusterFilterOpen}
                                    onOpenChange={setIsAlertRuleTargetClusterFilterOpen}
                                    onSelect={(_, val) => { setAlertRuleTargetClusterFilter(val as string); setIsAlertRuleTargetClusterFilterOpen(false); }}
                                  >
                                    <SelectList>
                                      <SelectOption value="all">All target clusters ({selectedAlertRule.targetClusters.length})</SelectOption>
                                      {selectedAlertRule.targetClusters.map((cluster, idx) => (
                                        <SelectOption key={idx} value={cluster}>{cluster}</SelectOption>
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
                              <AccordionToggle onClick={() => {}} id="alerts-timeline-toggle">
                                Alerts timeline
                              </AccordionToggle>
                              <AccordionContent>
                                <Stack hasGutter>
                                  <StackItem>
                                    <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                                      <FlexItem>
                                        <Select
                                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                            <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleTimelineRangeOpen(!isAlertRuleTimelineRangeOpen)} isExpanded={isAlertRuleTimelineRangeOpen} variant="secondary">
                                              <ClockIcon /> {alertRuleTimelineRange}
                                            </MenuToggle>
                                          )}
                                          isOpen={isAlertRuleTimelineRangeOpen}
                                          onOpenChange={setIsAlertRuleTimelineRangeOpen}
                                          onSelect={(_, val) => { setAlertRuleTimelineRange(val as string); setIsAlertRuleTimelineRangeOpen(false); }}
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
                                        <Button variant="link">Reset zoom</Button>
                                      </FlexItem>
                                    </Flex>
                                  </StackItem>
                                  <StackItem>
                                    <div style={{ height: '200px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '4px', padding: '16px' }}>
                                      {/* Mock chart area */}
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
                                            splitLine: { lineStyle: { color: 'var(--pf-t--global--border--color--default)', type: 'dashed' } },
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
                                              lineStyle: { color: 'var(--pf-t--global--color--status--info--default)', type: 'dashed' },
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
                          <Title headingLevel="h4" size="md">Active alerts</Title>
                        </StackItem>
                        {selectedAlertRule.activeAlerts.length === 0 ? (
                          <StackItem>
                            <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No active alerts</Content>
                          </StackItem>
                        ) : (
                          selectedAlertRule.activeAlerts.map((alert, idx) => (
                            <StackItem key={idx}>
                              <Card isClickable onClick={() => {
                                if (alertRuleExpandedAlerts.includes(alert.id)) {
                                  setAlertRuleExpandedAlerts(alertRuleExpandedAlerts.filter(a => a !== alert.id));
                                } else {
                                  setAlertRuleExpandedAlerts([...alertRuleExpandedAlerts, alert.id]);
                                }
                              }}>
                                <CardBody>
                                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                                    <FlexItem style={{ flex: 1 }}>
                                      <Content>{alert.message}</Content>
                                    </FlexItem>
                                    <FlexItem>
                                      {alertRuleExpandedAlerts.includes(alert.id) ? <AngleDownIcon /> : <AngleRightIcon />}
                                    </FlexItem>
                                  </Flex>
                                  {alertRuleExpandedAlerts.includes(alert.id) && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
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
      )}
      
      {/* Disable Alert Rule Modal */}
      <Modal
        isOpen={isDisableAlertRuleModalOpen}
        onClose={() => setIsDisableAlertRuleModalOpen(false)}
        aria-labelledby="disable-alert-rule-modal-title"
        aria-describedby="disable-alert-rule-modal-body"
        variant="medium"
      >
        <ModalHeader
          title={
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
              <FlexItem>
                <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />
              </FlexItem>
              <FlexItem>
                {alertRulesToDisable.length === 1 ? 'Disable alert rule?' : 'Disable alert rules?'}
              </FlexItem>
            </Flex>
          }
          labelId="disable-alert-rule-modal-title"
          description="Stop the rule from running altogether."
        />
        <ModalBody id="disable-alert-rule-modal-body">
          <Stack hasGutter>
            {alertRulesToDisable.length === 1 ? (
              <>
                {/* Single alert rule disable */}
                <StackItem>
                  <Content component="p">
                    If you disable this alert rule, you'll no longer receive notifications when the conditions it monitors are met. This can lead to undetected issues that might impact your system's performance or availability.
                  </Content>
                </StackItem>
                <StackItem>
                  <Content component="p"><strong>Alert Details:</strong></Content>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li><strong>Name</strong>: {alertRulesToDisable[0]?.name}</li>
                    <li><strong>Description</strong>: {alertRulesToDisable[0]?.description}</li>
                    <li><strong>Severity</strong>: {alertRulesToDisable[0]?.severity}</li>
                    <li><strong>Group</strong>: {alertRulesToDisable[0]?.group}</li>
                    <li><strong>Component:</strong> {alertRulesToDisable[0]?.component}</li>
                  </ul>
                </StackItem>
              </>
            ) : (
              <>
                {/* Bulk alert rules disable */}
                <StackItem>
                  <Content component="p"><strong>Are you sure you want to disable {alertRulesToDisable.length} selected alert rule{alertRulesToDisable.length > 1 ? 's' : ''}?</strong></Content>
                  <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Disabling an alert rule means you will no longer receive notifications when the conditions it monitors are met. This could lead to undetected issues that might impact your system's performance or availability.
                  </Content>
                </StackItem>
                <StackItem>
                  <Card>
                    <CardBody>
                      <Content component="p"><strong>The following Alerts will be disabled:</strong></Content>
                      <div style={{ marginTop: '16px' }}>
                        {alertRulesToDisable.map((rule) => (
                          <div key={rule.id} style={{ marginBottom: '8px' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                              <FlexItem>
                                <Button 
                                  variant="plain" 
                                  aria-label="Toggle details"
                                  onClick={() => {
                                    if (disableAlertRuleExpandedIds.includes(rule.id)) {
                                      setDisableAlertRuleExpandedIds(disableAlertRuleExpandedIds.filter(id => id !== rule.id));
                                    } else {
                                      setDisableAlertRuleExpandedIds([...disableAlertRuleExpandedIds, rule.id]);
                                    }
                                  }}
                                >
                                  {disableAlertRuleExpandedIds.includes(rule.id) ? <AngleDownIcon /> : <AngleRightIcon />}
                                </Button>
                              </FlexItem>
                              <FlexItem>
                                {rule.severity === 'Critical' && <ExclamationCircleIcon color="var(--pf-t--global--color--status--danger--default)" />}
                                {rule.severity === 'Warning' && <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />}
                                {rule.severity === 'Info' && <InfoCircleIcon color="var(--pf-t--global--color--status--info--default)" />}
                              </FlexItem>
                              <FlexItem>{rule.name}</FlexItem>
                            </Flex>
                            {disableAlertRuleExpandedIds.includes(rule.id) && (
                              <div style={{ marginLeft: '48px', marginTop: '8px', padding: '8px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '4px' }}>
                                <Content component="small">
                                  <div><strong>Description:</strong> {rule.description}</div>
                                  <div><strong>Severity:</strong> {rule.severity}</div>
                                  <div><strong>Group:</strong> {rule.group}</div>
                                  <div><strong>Component:</strong> {rule.component}</div>
                                </Content>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </StackItem>
              </>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="primary" 
            onClick={() => {
              addToast(`${alertRulesToDisable.length === 1 ? 'Alert rule' : `${alertRulesToDisable.length} alert rules`} disabled successfully`, 'success');
              setIsDisableAlertRuleModalOpen(false);
              setAlertRulesToDisable([]);
              setSelectedAlertRuleIds([]);
            }}
          >
            Disable {alertRulesToDisable.length > 1 ? `${alertRulesToDisable.length} alerts` : 'alert'}
          </Button>
          <Button variant="secondary" onClick={() => {
            // Open silence modal instead
            setIsDisableAlertRuleModalOpen(false);
          }}>
            Silence instead
          </Button>
          <Button variant="link" onClick={() => {
            setIsDisableAlertRuleModalOpen(false);
            setAlertRulesToDisable([]);
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export { MultiClusterAlertingDashboard };
