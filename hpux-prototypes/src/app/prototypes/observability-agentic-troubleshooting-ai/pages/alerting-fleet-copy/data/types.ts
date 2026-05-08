import * as React from 'react';

export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type AlertStatus = 'firing' | 'acknowledged' | 'resolved' | 'pending';
export type ClusterAlertStatus = 'critical' | 'warning' | 'info' | 'healthy';
export type ACMClusterStatus = 'Ready' | 'Offline' | 'Failed' | 'Pending Import' | 'Installing' | 'Degraded' | 'Hibernating' | 'Unknown' | 'Detaching';
export type AlertGroup = 'Cluster' | 'Namespace';
export type AlertComponent = 'kube-apiserver' | 'Storage' | 'Network' | 'etcd' | 'Scheduler' | 'Controller' | 'Workload' | 'Pod' | 'Quota';
export type GroupByOption = 'none' | 'region' | 'cloudProvider' | 'team' | 'severity' | 'environment';
export type SortByOption = 'severity' | 'alertCount' | 'clusterName' | 'lastFired';
export type ViewMode = 'treemap' | 'summary';
export type ImportanceSizing = 'none' | 'nodeCount' | 'cpuCores' | 'totalMemory' | 'podCount' | 'vmCount' | 'totalAlerts' | 'cpuRequests' | 'memoryRequests';
export type UserRole = 'admin' | 'namespaceOwner';
export type SortDirection = 'asc' | 'desc';
export type NavigationView = 'fleet-overview' | 'cluster-components' | 'component-alerts';
export type AlertsGroupByOption = 'none' | 'time' | 'severity' | 'alertName' | 'impact' | 'component' | 'cluster';

export interface SortConfig {
  column: 'alertName' | 'severity' | 'clusters' | 'total' | 'group' | 'component' | 'startTime';
  direction: SortDirection;
  priority: number;
}

export interface ComponentHealthData {
  component: AlertComponent;
  displayName: string;
  icon: React.ReactNode;
  alertCount: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  healthStatus: 'critical' | 'warning' | 'info' | 'healthy';
  lastAlert?: string;
}

export interface AlertData {
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
  runbookUrl?: string;
}

export interface ClusterData {
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
  acmStatus: ACMClusterStatus;
}

export interface AggregatedAlert {
  alertName: string;
  severity: AlertSeverity;
  totalCount: number;
  clusters: { name: string; cluster: ClusterData; count: number; lastFired: string; lastFiredTimestamp: Date }[];
  component: AlertComponent;
  group: AlertGroup;
}

export interface TrendData {
  timestamp: string;
  critical: number;
  warning: number;
  info: number;
  topAlerts?: string[];
}

export interface ColumnConfig {
  key: string;
  label: string;
  isVisible: boolean;
  isDisabled: boolean;
  order: number;
}

export interface SavedFilter {
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
  viewSettings?: {
    groupBy?: GroupByOption;
    sortBy?: SortByOption;
    importanceSizing?: ImportanceSizing;
  };
  hidden?: boolean;
  isDefault?: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  description?: string;
}

export type AlertRuleState = 'Active' | 'Reconciling' | 'Partial success' | 'Failed' | 'Disabled';
export type AlertRuleSource = 'User' | 'Platform';

export interface AlertRuleActiveAlert {
  id: string;
  message: string;
  cluster: string;
  activeSince: string;
  state: 'Firing' | 'Pending' | 'Resolved';
  value: string;
  resource: string;
}

export interface AlertRuleModification {
  date: string;
  user: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  state: AlertRuleState;
  stateProgress?: number;
  appliedClusters?: number;
  totalClusters?: number;
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

export interface EnvironmentCategory {
  id: string;
  label: string;
  color: string;
  patterns: string[];
}

export interface TeamCategory {
  id: string;
  label: string;
  color: string;
  patterns: string[];
}
