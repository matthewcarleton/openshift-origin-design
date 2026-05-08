import type {
  AlertSeverity,
  AlertStatus,
  ACMClusterStatus,
  AlertGroup,
  AlertComponent,
  AlertData,
  ClusterData,
  TrendData,
  AlertRule,
  AlertRuleState,
  AlertRuleSource,
  AlertRuleActiveAlert,
  AlertRuleModification,
} from './types';

// Mock Alert Rules Data
export const mockAlertRules: AlertRule[] = [
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

export const now = new Date();
export const mockTrendData: TrendData[] = [
  { timestamp: '24h ago', critical: 3, warning: 9, info: 5 },
  { timestamp: '23h ago', critical: 4, warning: 10, info: 6 },
  { timestamp: '22h ago', critical: 2, warning: 8, info: 4 },
  { timestamp: '21h ago', critical: 5, warning: 11, info: 7 },
  { timestamp: '20h ago', critical: 3, warning: 7, info: 5 },
  { timestamp: '19h ago', critical: 4, warning: 12, info: 6 },
  { timestamp: '18h ago', critical: 6, warning: 14, info: 8 },
  { timestamp: '17h ago', critical: 5, warning: 10, info: 7 },
  { timestamp: '16h ago', critical: 3, warning: 9, info: 5 },
  { timestamp: '15h ago', critical: 4, warning: 11, info: 6 },
  { timestamp: '14h ago', critical: 2, warning: 8, info: 4 },
  { timestamp: '13h ago', critical: 5, warning: 13, info: 7 },
  { timestamp: '12h ago', critical: 6, warning: 15, info: 9 },
  { timestamp: '11h ago', critical: 4, warning: 10, info: 5 },
  { timestamp: '10h ago', critical: 3, warning: 9, info: 6 },
  { timestamp: '9h ago', critical: 5, warning: 12, info: 7 },
  { timestamp: '8h ago', critical: 4, warning: 11, info: 6 },
  { timestamp: '7h ago', critical: 3, warning: 10, info: 5 },
  { timestamp: '6h ago', critical: 5, warning: 12, info: 8 },
  { timestamp: '5h ago', critical: 4, warning: 15, info: 10 },
  { timestamp: '4h ago', critical: 7, warning: 11, info: 6 },
  { timestamp: '3h ago', critical: 3, warning: 18, info: 9 },
  { timestamp: '2h ago', critical: 28, warning: 45, info: 23, topAlerts: ['ETCDHighLatency', 'HighMemoryUsage', 'NodeNotReady'] },
  { timestamp: '1h ago', critical: 4, warning: 10, info: 5 },
  { timestamp: 'Now', critical: 5, warning: 8, info: 4 },
];

// Generate 45 clusters with comprehensive data
export const generateMockClusters = (): ClusterData[] => {
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
      const severity: AlertSeverity = Math.random() < 0.1 ? 'Critical' : Math.random() < 0.5 ? 'Warning' : 'Info';
      const status: AlertStatus = Math.random() < 0.7 ? 'firing' : Math.random() < 0.9 ? 'acknowledged' : 'resolved';
      const alertName = alertNames[Math.floor(Math.random() * alertNames.length)];

      // Generate varied time ranges — heavily weighted toward recent to ensure
      // alerts are visible with the default "Last 6 hours" time filter
      const timeBucket = Math.random();
      let minutesAgo: number;
      if (timeBucket < 0.35) {
        // Within last hour
        minutesAgo = Math.floor(Math.random() * 55) + 5;
      } else if (timeBucket < 0.60) {
        // 1-4 hours ago
        minutesAgo = Math.floor(Math.random() * 180) + 61;
      } else if (timeBucket < 0.80) {
        // 4-12 hours ago
        minutesAgo = Math.floor(Math.random() * 480) + 241;
      } else if (timeBucket < 0.90) {
        // 12-24 hours ago
        minutesAgo = Math.floor(Math.random() * 720) + 721;
      } else if (timeBucket < 0.95) {
        // 1-7 days ago
        minutesAgo = Math.floor(Math.random() * 8640) + 1440;
      } else {
        // 7-30 days ago
        minutesAgo = Math.floor(Math.random() * 33120) + 10080;
      }

      // Format the lastFired string based on time
      let lastFiredStr: string;
      if (minutesAgo < 60) {
        lastFiredStr = `${minutesAgo} min ago`;
      } else if (minutesAgo < 1440) {
        lastFiredStr = `${Math.floor(minutesAgo / 60)} hour${Math.floor(minutesAgo / 60) > 1 ? 's' : ''} ago`;
      } else {
        const daysAgo = Math.floor(minutesAgo / 1440);
        lastFiredStr = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      }

      const ackAt = status === 'acknowledged' ? new Date(now.getTime() - Math.floor(Math.random() * minutesAgo * 0.5) * 60000) : undefined;

      alerts.push({
        id: `alert-${i}-${j}`,
        severity,
        status,
        alertName,
        clusterName: `cluster-${env}-${region.toLowerCase().replace(' ', '-')}-${i}`,
        namespace: Math.random() < 0.5 ? 'production' : Math.random() < 0.7 ? 'kube-system' : 'monitoring',
        labels: { env, severity: severity.toLowerCase(), team },
        summary: `${alertName} detected on cluster-${i}`,
        lastFired: lastFiredStr,
        lastFiredTimestamp: new Date(now.getTime() - minutesAgo * 60000),
        details: `Detailed information about ${alertName}. This requires attention.`,
        source: sources[Math.floor(Math.random() * sources.length)],
        count: Math.floor(Math.random() * 10) + 1,
        group: groups[Math.floor(Math.random() * groups.length)],
        component: components[Math.floor(Math.random() * components.length)],
        description: `This alert indicates ${alertName.toLowerCase()} condition.`,
        resource: Math.random() < 0.3 ? `node-${Math.floor(Math.random() * 10) + 1}` : undefined,
        runbookUrl: Math.random() < 0.7 ? `https://runbooks.example.com/alerts/${alertName}` : undefined,
        acknowledgedBy: status === 'acknowledged' ? 'admin@nyf.com' : undefined,
        acknowledgedAt: ackAt,
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

export const mockClusters: ClusterData[] = generateMockClusters();
