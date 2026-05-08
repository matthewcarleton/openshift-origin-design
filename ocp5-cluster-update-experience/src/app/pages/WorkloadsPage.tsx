import { useState } from "react";
import { Search, Filter, RefreshCw, MoreVertical, Package, AlertCircle, CheckCircle, Clock, XCircle, PlayCircle } from "@/lib/pfIcons";
import Breadcrumbs from "../components/Breadcrumbs";
import FavoriteButton from "../components/FavoriteButton";

type WorkloadType = "all" | "pods" | "deployments" | "statefulsets" | "daemonsets" | "jobs" | "cronjobs";
type StatusFilter = "all" | "running" | "pending" | "failed" | "succeeded";

interface Workload {
  name: string;
  namespace: string;
  type: "Pod" | "Deployment" | "StatefulSet" | "DaemonSet" | "Job" | "CronJob";
  status: "Running" | "Pending" | "Failed" | "Succeeded" | "Completed";
  ready: string;
  restarts: number;
  age: string;
  image?: string;
}

export default function WorkloadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [workloadFilter, setWorkloadFilter] = useState<WorkloadType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedNamespace, setSelectedNamespace] = useState("all");

  const workloads: Workload[] = [
    { name: "nginx-deployment-7d8c9f6b-4xk2p", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 0, age: "12d", image: "nginx:1.21" },
    { name: "nginx-deployment-7d8c9f6b-mx8qz", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 2, age: "12d", image: "nginx:1.21" },
    { name: "nginx-deployment-7d8c9f6b-n5p9r", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 0, age: "12d", image: "nginx:1.21" },
    { name: "redis-master-0", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 1, age: "45d", image: "redis:7.0" },
    { name: "postgres-statefulset-0", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 0, age: "89d", image: "postgres:14" },
    { name: "postgres-statefulset-1", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 0, age: "89d", image: "postgres:14" },
    { name: "elasticsearch-data-0", namespace: "logging", type: "Pod", status: "Running", ready: "1/1", restarts: 3, age: "156d", image: "elasticsearch:8.5" },
    { name: "elasticsearch-data-1", namespace: "logging", type: "Pod", status: "Running", ready: "1/1", restarts: 2, age: "156d", image: "elasticsearch:8.5" },
    { name: "fluentd-daemonset-7g8h2", namespace: "logging", type: "Pod", status: "Running", ready: "1/1", restarts: 5, age: "156d", image: "fluentd:v1.14" },
    { name: "fluentd-daemonset-k9m3n", namespace: "logging", type: "Pod", status: "Running", ready: "1/1", restarts: 4, age: "156d", image: "fluentd:v1.14" },
    { name: "fluentd-daemonset-p2r5t", namespace: "logging", type: "Pod", status: "Running", ready: "1/1", restarts: 6, age: "156d", image: "fluentd:v1.14" },
    { name: "prometheus-server-0", namespace: "monitoring", type: "Pod", status: "Running", ready: "1/1", restarts: 1, age: "67d", image: "prometheus:v2.40" },
    { name: "grafana-deployment-6f8d9c-x4k8p", namespace: "monitoring", type: "Pod", status: "Running", ready: "1/1", restarts: 0, age: "23d", image: "grafana:9.3" },
    { name: "alertmanager-0", namespace: "monitoring", type: "Pod", status: "Running", ready: "1/1", restarts: 2, age: "67d", image: "alertmanager:v0.25" },
    { name: "api-gateway-7c9d8f-5n6p7", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 0, age: "8d", image: "api-gateway:v2.1" },
    { name: "api-gateway-7c9d8f-8q9r2", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 1, age: "8d", image: "api-gateway:v2.1" },
    { name: "auth-service-5b6c7d-3m4n5", namespace: "production", type: "Pod", status: "Running", ready: "1/1", restarts: 0, age: "15d", image: "auth-service:v1.8" },
    { name: "backup-job-1710720000", namespace: "production", type: "Pod", status: "Succeeded", ready: "0/1", restarts: 0, age: "2d", image: "backup:latest" },
    { name: "database-migration-job", namespace: "production", type: "Pod", status: "Completed", ready: "0/1", restarts: 0, age: "5d", image: "migration:v1.2" },
    { name: "test-runner-7h8i9j", namespace: "development", type: "Pod", status: "Pending", ready: "0/1", restarts: 0, age: "5m", image: "test-runner:latest" },
    { name: "cache-cleanup-job-failed", namespace: "production", type: "Pod", status: "Failed", ready: "0/1", restarts: 3, age: "1h", image: "cache-cleanup:v1.0" },
    
    { name: "nginx-deployment", namespace: "production", type: "Deployment", status: "Running", ready: "3/3", restarts: 0, age: "12d" },
    { name: "api-gateway", namespace: "production", type: "Deployment", status: "Running", ready: "2/2", restarts: 0, age: "8d" },
    { name: "auth-service", namespace: "production", type: "Deployment", status: "Running", ready: "1/1", restarts: 0, age: "15d" },
    { name: "grafana-deployment", namespace: "monitoring", type: "Deployment", status: "Running", ready: "1/1", restarts: 0, age: "23d" },
    
    { name: "postgres-statefulset", namespace: "production", type: "StatefulSet", status: "Running", ready: "2/2", restarts: 0, age: "89d" },
    { name: "elasticsearch-data", namespace: "logging", type: "StatefulSet", status: "Running", ready: "2/2", restarts: 0, age: "156d" },
    { name: "prometheus-server", namespace: "monitoring", type: "StatefulSet", status: "Running", ready: "1/1", restarts: 0, age: "67d" },
    
    { name: "fluentd-daemonset", namespace: "logging", type: "DaemonSet", status: "Running", ready: "3/3", restarts: 0, age: "156d" },
    { name: "node-exporter", namespace: "monitoring", type: "DaemonSet", status: "Running", ready: "8/8", restarts: 0, age: "89d" },
    
    { name: "backup-job", namespace: "production", type: "CronJob", status: "Succeeded", ready: "1/1", restarts: 0, age: "45d" },
    { name: "cache-cleanup", namespace: "production", type: "CronJob", status: "Failed", ready: "0/1", restarts: 0, age: "30d" },
  ];

  const namespaces = ["all", "production", "development", "logging", "monitoring"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <CheckCircle className="size-[16px] text-[#3e8635] dark:text-[#81c784]" />;
      case "Pending":
        return <Clock className="size-[16px] text-[#ff9800] dark:text-[#ffb74d]" />;
      case "Failed":
        return <XCircle className="size-[16px] text-[#d32f2f] dark:text-[#ef5350]" />;
      case "Succeeded":
      case "Completed":
        return <CheckCircle className="size-[16px] text-[#0066cc] dark:text-[#4dabf7]" />;
      default:
        return <AlertCircle className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]";
      case "Pending":
        return "text-[#ff9800] dark:text-[#ffb74d] bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)]";
      case "Failed":
        return "text-[#d32f2f] dark:text-[#ef5350] bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)]";
      case "Succeeded":
      case "Completed":
        return "text-[#0066cc] dark:text-[#4dabf7] bg-[#e7f1fa] dark:bg-[rgba(79,171,247,0.15)]";
      default:
        return "text-[#4d4d4d] dark:text-[#b0b0b0] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]";
    }
  };

  const filteredWorkloads = workloads.filter((workload) => {
    const matchesSearch = workload.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = workloadFilter === "all" || workload.type.toLowerCase() === workloadFilter;
    const matchesStatus = statusFilter === "all" || workload.status.toLowerCase() === statusFilter;
    const matchesNamespace = selectedNamespace === "all" || workload.namespace === selectedNamespace;
    return matchesSearch && matchesType && matchesStatus && matchesNamespace;
  });

  const stats = {
    total: workloads.length,
    running: workloads.filter(w => w.status === "Running").length,
    pending: workloads.filter(w => w.status === "Pending").length,
    failed: workloads.filter(w => w.status === "Failed").length,
  };

  return (
    <div className="ocs-app-page-outer">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Workloads", path: "/workloads" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Workloads
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Manage your Pods, Deployments, StatefulSets, DaemonSets, Jobs, and CronJobs
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Workloads" path="/workloads" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]">
            <PlayCircle className="size-[16px]" />
            Create Workload
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">Total Workloads</p>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">Running</p>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#3e8635] dark:text-[#81c784]">{stats.running}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">Pending</p>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#ff9800] dark:text-[#ffb74d]">{stats.pending}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">Failed</p>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#d32f2f] dark:text-[#ef5350]">{stats.failed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex-1 relative">
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
            <input
              type="text"
              placeholder="Search workloads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-[40px] pr-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] text-[#151515] dark:text-white text-[14px] focus:outline-none focus:border-[#0066cc] dark:focus:border-[#4dabf7]"
            />
          </div>
          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] text-[#151515] dark:text-white text-[14px] cursor-pointer"
          >
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>
                {ns === "all" ? "All Namespaces" : ns}
              </option>
            ))}
          </select>
          <select
            value={workloadFilter}
            onChange={(e) => setWorkloadFilter(e.target.value as WorkloadType)}
            className="px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] text-[#151515] dark:text-white text-[14px] cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="pods">Pods</option>
            <option value="deployments">Deployments</option>
            <option value="statefulsets">StatefulSets</option>
            <option value="daemonsets">DaemonSets</option>
            <option value="jobs">Jobs</option>
            <option value="cronjobs">CronJobs</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] text-[#151515] dark:text-white text-[14px] cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="succeeded">Succeeded</option>
          </select>
          <button className="p-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <RefreshCw className="size-[16px] text-[#151515] dark:text-white" />
          </button>
        </div>
      </div>

      {/* Workloads Table */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.03)] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
              <tr>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Namespace
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Type
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Ready
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Restarts
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Age
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkloads.map((workload, index) => (
                <tr
                  key={index}
                  className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                >
                  <td className="px-[20px] py-[16px]">
                    <div className="flex items-center gap-[8px]">
                      <Package className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
                      <span className="font-mono text-[13px] text-[#151515] dark:text-white">{workload.name}</span>
                    </div>
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <span className="px-[10px] py-[4px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-[999px] text-[12px] text-[#151515] dark:text-white font-mono">
                      {workload.namespace}
                    </span>
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                    {workload.type}
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <div className="flex items-center gap-[6px]">
                      {getStatusIcon(workload.status)}
                      <span className={`px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold ${getStatusColor(workload.status)}`}>
                        {workload.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#151515] dark:text-white font-mono">
                    {workload.ready}
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#151515] dark:text-white">
                    {workload.restarts > 0 ? (
                      <span className="text-[#ff9800] dark:text-[#ffb74d] font-semibold">{workload.restarts}</span>
                    ) : (
                      <span className="text-[#4d4d4d] dark:text-[#b0b0b0]">{workload.restarts}</span>
                    )}
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                    {workload.age}
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <button className="p-[6px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] rounded-[999px] transition-colors">
                      <MoreVertical className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkloads.length === 0 && (
          <div className="p-[48px] text-center">
            <Package className="size-[48px] text-[#4d4d4d] dark:text-[#b0b0b0] mx-auto mb-[16px]" />
            <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
              No workloads found matching your filters
            </p>
          </div>
        )}
      </div>
      </Breadcrumbs>
    </div>
  );
}