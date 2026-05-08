import * as React from 'react';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import type { AlertSeverity, AlertStatus, ClusterAlertStatus, ClusterData, AlertData, ImportanceSizing } from './types';

export const getClusterAlertStatus = (cluster: ClusterData): ClusterAlertStatus => {
  const firingAlerts = cluster.alerts.filter(a => a.status === 'firing');
  if (firingAlerts.some(a => a.severity === 'Critical')) return 'critical';
  if (firingAlerts.some(a => a.severity === 'Warning')) return 'warning';
  if (firingAlerts.some(a => a.severity === 'Info')) return 'info';
  return 'healthy';
};

export const getStatusBackgroundColor = (status: ClusterAlertStatus): string => {
  switch (status) {
    case 'critical': return '#c9190b';
    case 'warning': return '#f0ab00';
    case 'info': return '#6753ac';
    case 'healthy': return '#3e8635';
    default: return '#3e8635';
  }
};

export const getSeverityLabelColor = (severity: AlertSeverity): 'red' | 'orange' | 'purple' => {
  switch (severity) {
    case 'Critical': return 'red';
    case 'Warning': return 'orange';
    case 'Info': return 'purple';
  }
};

export const getStatusLabelColor = (status: AlertStatus): 'red' | 'blue' | 'green' => {
  switch (status) {
    case 'firing': return 'red';
    case 'acknowledged': return 'blue';
    case 'resolved': return 'green';
    case 'pending': return 'blue';
    default: return 'blue';
  }
};

export const getSeverityIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case 'Critical': return React.createElement(ExclamationCircleIcon);
    case 'Warning': return React.createElement(ExclamationTriangleIcon);
    case 'Info': return React.createElement(InfoCircleIcon);
  }
};

export const getUniqueValues = <T, K extends keyof T>(items: T[], key: K): string[] => {
  return Array.from(new Set(items.map(item => String(item[key])))).sort();
};

/**
 * Fleet filter dropdown vocabulary (same as `generateMockFillerClusters` region names).
 * Cloud provider region IDs (e.g. us-east-2) map onto these to avoid duplicate menu entries.
 */
export const FLEET_REGION_FILTER_LABELS = [
  'US East',
  'US West',
  'US Central',
  'EU Central',
  'EU West',
  'Asia Pacific',
  'South America',
] as const;

const CANONICAL_SET = new Set<string>(FLEET_REGION_FILTER_LABELS);

/** Map common AWS / GCP style region codes to the fleet filter labels above. */
const CLOUD_REGION_ID_TO_FLEET_LABEL: Record<string, string> = {
  'us-east-1': 'US East',
  'us-east-2': 'US East',
  'us-west-1': 'US West',
  'us-west-2': 'US West',
  'us-central-1': 'US Central',
  'us-central-2': 'US Central',
  'us-central-3': 'US Central',
  'us-central1': 'US Central',
  'us-east1': 'US East',
  'eu-west-1': 'EU West',
  'eu-west-2': 'EU West',
  'eu-west-3': 'EU West',
  'eu-central-1': 'EU Central',
  'eu-central-2': 'EU Central',
  'eu-north-1': 'EU Central',
  'eu-south-1': 'EU Central',
  'ap-southeast-1': 'Asia Pacific',
  'ap-southeast-2': 'Asia Pacific',
  'ap-southeast-3': 'Asia Pacific',
  'ap-northeast-1': 'Asia Pacific',
  'ap-northeast-2': 'Asia Pacific',
  'ap-northeast-3': 'Asia Pacific',
  'ap-east-1': 'Asia Pacific',
  'ap-south-1': 'Asia Pacific',
  'ap-south-2': 'Asia Pacific',
  'sa-east-1': 'South America',
};

/**
 * Normalizes a cluster’s raw `region` (cloud ID or label) to a single fleet filter menu value.
 * Reuses {@link FLEET_REGION_FILTER_LABELS} when the code is known; otherwise uses ALL CAPS words
 * (e.g. me-central-1 → ME CENTRAL 1).
 */
export function toFleetRegionFilterLabel(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (CANONICAL_SET.has(t)) return t;
  const key = t.toLowerCase();
  if (CLOUD_REGION_ID_TO_FLEET_LABEL[key]) {
    return CLOUD_REGION_ID_TO_FLEET_LABEL[key];
  }
  if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(key)) {
    return key.split('-').map(part => part.toUpperCase()).join(' ');
  }
  return t;
}

/** Sorts region filter options: canonical order first, then any extra regions (e.g. ME CENTRAL 1) A–Z. */
export function sortFleetRegionFilterLabels(labels: string[]): string[] {
  const order: Map<string, number> = new Map(
    FLEET_REGION_FILTER_LABELS.map((l, i) => [l, i] as [string, number])
  );
  return [...labels].sort((a, b) => {
    const ia = order.get(a);
    const ib = order.get(b);
    if (ia !== undefined && ib !== undefined) return ia - ib;
    if (ia !== undefined) return -1;
    if (ib !== undefined) return 1;
    return a.localeCompare(b);
  });
}

export const getAllLabels = (clusters: ClusterData[]): string[] => {
  const labels = new Set<string>();
  clusters.forEach(cluster => {
    Object.entries(cluster.labels).forEach(([key, value]) => {
      labels.add(`${key}:${value}`);
    });
  });
  return Array.from(labels).sort();
};

export const getAllNamespaces = (clusters: ClusterData[]): string[] => {
  const namespaces = new Set<string>();
  clusters.forEach(cluster => {
    cluster.namespaces.forEach(ns => namespaces.add(ns));
  });
  return Array.from(namespaces).sort();
};

export const getAllAlerts = (clusters: ClusterData[]): AlertData[] => {
  return clusters.flatMap(c => c.alerts).sort((a, b) => b.lastFiredTimestamp.getTime() - a.lastFiredTimestamp.getTime());
};

export const getTileValue = (cluster: ClusterData, sizing: ImportanceSizing, severityFilter: AlertSeverity[]): number => {
  switch (sizing) {
    case 'none': return 1000;
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
