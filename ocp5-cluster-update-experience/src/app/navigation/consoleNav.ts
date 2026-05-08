/**
 * OpenShift console–style navigation for the prototype shell.
 * Only routes that exist as real pages are listed (no ConsoleStub placeholders).
 */

export type SubNavEntry = { path: string; label: string } | "separator";

export const HOME_SUB: SubNavEntry[] = [{ path: "/", label: "Overview" }];

export const ECOSYSTEM_SUB: SubNavEntry[] = [
  { path: "/ecosystem/software-catalog", label: "Software Catalog" },
  { path: "/ecosystem/installed-operators", label: "Installed Operators" },
  { path: "/ecosystem/helm", label: "Helm" },
];

export const WORKLOADS_SUB: SubNavEntry[] = [
  { path: "/workloads/topology", label: "Topology" },
  { path: "/workloads/pods", label: "Pods" },
  { path: "/workloads/deployments", label: "Deployments" },
  { path: "/workloads/statefulsets", label: "StatefulSets" },
  { path: "/workloads/daemonsets", label: "DaemonSets" },
  { path: "/workloads/jobs", label: "Jobs" },
  { path: "/workloads/cronjobs", label: "CronJobs" },
];

export const NETWORKING_SUB: SubNavEntry[] = [{ path: "/networking", label: "Services" }];

export const STORAGE_SUB: SubNavEntry[] = [{ path: "/storage", label: "PersistentVolumes" }];

export const BUILDS_SUB: SubNavEntry[] = [{ path: "/builds", label: "BuildConfigs" }];

export const OBSERVE_SUB: SubNavEntry[] = [{ path: "/observe", label: "Alerting" }];

export const COMPUTE_SUB: SubNavEntry[] = [{ path: "/compute", label: "Nodes" }];

export const USER_MANAGEMENT_SUB: SubNavEntry[] = [{ path: "/user-management", label: "Users" }];

export const ADMINISTRATION_SUB: SubNavEntry[] = [
  { path: "/administration/cluster-update", label: "Cluster Update" },
  { path: "/administration/cluster-settings", label: "Cluster Settings" },
  { path: "/administration/namespaces", label: "Namespaces" },
  { path: "/administration/resource-quotas", label: "ResourceQuotas" },
  { path: "/administration/limit-ranges", label: "LimitRanges" },
  { path: "/administration/custom-resource-definitions", label: "CustomResourceDefinitions" },
  { path: "/administration/dynamic-plugins", label: "Dynamic Plugins" },
];
