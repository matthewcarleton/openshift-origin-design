import { useState } from "react";
import { Search, RefreshCw, MoreVertical, CheckCircle, Clock, XCircle, AlertCircle } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

type StatusFilter = "all" | "running" | "pending" | "failed" | "succeeded";

interface Pod {
  name: string;
  namespace: string;
  status: "Running" | "Pending" | "Failed" | "Succeeded";
  ready: string;
  restarts: number;
  age: string;
  image: string;
}

export default function PodsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedNamespace, setSelectedNamespace] = useState("all");

  const pods: Pod[] = [
    { name: "nginx-deployment-7d8c9f6b-4xk2p", namespace: "production", status: "Running", ready: "1/1", restarts: 0, age: "12d", image: "nginx:1.21" },
    { name: "nginx-deployment-7d8c9f6b-mx8qz", namespace: "production", status: "Running", ready: "1/1", restarts: 2, age: "12d", image: "nginx:1.21" },
    { name: "nginx-deployment-7d8c9f6b-n5p9r", namespace: "production", status: "Running", ready: "1/1", restarts: 0, age: "12d", image: "nginx:1.21" },
    { name: "redis-master-0", namespace: "production", status: "Running", ready: "1/1", restarts: 1, age: "45d", image: "redis:7.0" },
    { name: "postgres-statefulset-0", namespace: "production", status: "Running", ready: "1/1", restarts: 0, age: "89d", image: "postgres:14" },
    { name: "postgres-statefulset-1", namespace: "production", status: "Running", ready: "1/1", restarts: 0, age: "89d", image: "postgres:14" },
    { name: "elasticsearch-data-0", namespace: "logging", status: "Running", ready: "1/1", restarts: 3, age: "156d", image: "elasticsearch:8.5" },
    { name: "elasticsearch-data-1", namespace: "logging", status: "Running", ready: "1/1", restarts: 2, age: "156d", image: "elasticsearch:8.5" },
    { name: "fluentd-daemonset-7g8h2", namespace: "logging", status: "Running", ready: "1/1", restarts: 5, age: "156d", image: "fluentd:v1.14" },
    { name: "fluentd-daemonset-k9m3n", namespace: "logging", status: "Running", ready: "1/1", restarts: 4, age: "156d", image: "fluentd:v1.14" },
    { name: "fluentd-daemonset-p2r5t", namespace: "logging", status: "Running", ready: "1/1", restarts: 6, age: "156d", image: "fluentd:v1.14" },
    { name: "prometheus-server-0", namespace: "monitoring", status: "Running", ready: "1/1", restarts: 1, age: "67d", image: "prometheus:v2.40" },
    { name: "grafana-deployment-6f8d9c-x4k8p", namespace: "monitoring", status: "Running", ready: "1/1", restarts: 0, age: "23d", image: "grafana:9.3" },
    { name: "alertmanager-0", namespace: "monitoring", status: "Running", ready: "1/1", restarts: 2, age: "67d", image: "alertmanager:v0.25" },
    { name: "api-gateway-7c9d8f-5n6p7", namespace: "production", status: "Running", ready: "1/1", restarts: 0, age: "8d", image: "api-gateway:v2.1" },
    { name: "api-gateway-7c9d8f-8q9r2", namespace: "production", status: "Running", ready: "1/1", restarts: 1, age: "8d", image: "api-gateway:v2.1" },
    { name: "auth-service-5b6c7d-3m4n5", namespace: "production", status: "Running", ready: "1/1", restarts: 0, age: "15d", image: "auth-service:v1.8" },
    { name: "backup-job-1710720000", namespace: "production", status: "Succeeded", ready: "0/1", restarts: 0, age: "2d", image: "backup:latest" },
    { name: "database-migration-job", namespace: "production", status: "Succeeded", ready: "0/1", restarts: 0, age: "5d", image: "migration:v1.2" },
    { name: "test-runner-7h8i9j", namespace: "development", status: "Pending", ready: "0/1", restarts: 0, age: "5m", image: "test-runner:latest" },
    { name: "cache-cleanup-job-failed", namespace: "production", status: "Failed", ready: "0/1", restarts: 3, age: "1h", image: "cache-cleanup:v1.0" },
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
        return "text-[#0066cc] dark:text-[#4dabf7] bg-[#e7f1fa] dark:bg-[rgba(79,171,247,0.15)]";
      default:
        return "text-[#4d4d4d] dark:text-[#b0b0b0] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]";
    }
  };

  const filteredPods = pods.filter((pod) => {
    const matchesSearch = pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pod.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pod.status.toLowerCase() === statusFilter;
    const matchesNamespace = selectedNamespace === "all" || pod.namespace === selectedNamespace;
    return matchesSearch && matchesStatus && matchesNamespace;
  });

  const stats = {
    running: pods.filter((p) => p.status === "Running").length,
    pending: pods.filter((p) => p.status === "Pending").length,
    failed: pods.filter((p) => p.status === "Failed").length,
    succeeded: pods.filter((p) => p.status === "Succeeded").length,
  };

  return (
    <div className="ocs-app-page-outer w-full">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Workloads", path: "/workloads" },
          { label: "Pods", path: "/workloads/pods" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Pods
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            View and manage all pods across namespaces
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Pods" path="/workloads/pods" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors">
            Create Pod
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <CheckCircle className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Running</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.running}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Clock className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Pending</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.pending}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <XCircle className="size-[20px] text-[#d32f2f] dark:text-[#ef5350]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Failed</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.failed}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <CheckCircle className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Succeeded</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.succeeded}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[20px] mb-[16px]">
        <div className="flex items-center gap-[16px] flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              <input
                type="text"
                placeholder="Search pods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-[40px] pr-[12px] py-[10px] bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[8px] text-[14px] text-[#151515] dark:text-white placeholder:text-[#4d4d4d] dark:placeholder:text-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#4dabf7]"
              />
            </div>
          </div>
          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="px-[16px] py-[10px] bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[8px] text-[14px] text-[#151515] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#4dabf7]"
          >
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>
                {ns === "all" ? "All Namespaces" : ns}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-[16px] py-[10px] bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[8px] text-[14px] text-[#151515] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#4dabf7]"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="succeeded">Succeeded</option>
          </select>
          <button className="p-[10px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[8px] transition-colors">
            <RefreshCw className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <tr>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">NAME</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">NAMESPACE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">STATUS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">READY</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">RESTARTS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">IMAGE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">AGE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPods.map((pod, index) => (
              <tr
                key={index}
                className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
              >
                <td className="px-[20px] py-[16px] text-[14px] text-[#151515] dark:text-white font-['Red_Hat_Mono:Regular',sans-serif]">
                  {pod.name}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{pod.namespace}</td>
                <td className="px-[20px] py-[16px]">
                  <div className="flex items-center gap-[8px]">
                    {getStatusIcon(pod.status)}
                    <span className={`px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold ${getStatusColor(pod.status)}`}>
                      {pod.status}
                    </span>
                  </div>
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {pod.ready}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{pod.restarts}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {pod.image}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{pod.age}</td>
                <td className="px-[20px] py-[16px]">
                  <button className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[999px] transition-colors">
                    <MoreVertical className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Breadcrumbs>
    </div>
  );
}