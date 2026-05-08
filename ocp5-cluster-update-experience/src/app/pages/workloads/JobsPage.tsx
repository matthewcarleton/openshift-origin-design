import { useState } from "react";
import { Search, RefreshCw, MoreVertical, CheckCircle, Clock, XCircle, PlayCircle } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

interface Job {
  name: string;
  namespace: string;
  completions: string;
  duration: string;
  age: string;
  status: "Complete" | "Running" | "Failed";
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const jobs: Job[] = [
    { name: "backup-job-1710720000", namespace: "production", completions: "1/1", duration: "45s", age: "2d", status: "Complete" },
    { name: "database-migration-job", namespace: "production", completions: "1/1", duration: "2m30s", age: "5d", status: "Complete" },
    { name: "data-export-1710800000", namespace: "production", completions: "1/1", duration: "1m15s", age: "1d", status: "Complete" },
    { name: "cleanup-job-1710850000", namespace: "production", completions: "0/1", duration: "15s", age: "12h", status: "Failed" },
    { name: "batch-processing-1710900000", namespace: "production", completions: "0/1", duration: "30s", age: "6h", status: "Running" },
    { name: "report-generation-1710920000", namespace: "production", completions: "1/1", duration: "3m45s", age: "4h", status: "Complete" },
    { name: "index-rebuild-1710930000", namespace: "production", completions: "0/1", duration: "1m", age: "2h", status: "Running" },
  ];

  const namespaces = ["all", "production", "development", "logging", "monitoring"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="size-[16px] text-[#3e8635] dark:text-[#81c784]" />;
      case "Running":
        return <PlayCircle className="size-[16px] text-[#0066cc] dark:text-[#4dabf7]" />;
      case "Failed":
        return <XCircle className="size-[16px] text-[#d32f2f] dark:text-[#ef5350]" />;
      default:
        return <Clock className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]";
      case "Running":
        return "text-[#0066cc] dark:text-[#4dabf7] bg-[#e7f1fa] dark:bg-[rgba(79,171,247,0.15)]";
      case "Failed":
        return "text-[#d32f2f] dark:text-[#ef5350] bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)]";
      default:
        return "text-[#4d4d4d] dark:text-[#b0b0b0] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNamespace = selectedNamespace === "all" || job.namespace === selectedNamespace;
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesNamespace && matchesStatus;
  });

  const stats = {
    complete: jobs.filter((j) => j.status === "Complete").length,
    running: jobs.filter((j) => j.status === "Running").length,
    failed: jobs.filter((j) => j.status === "Failed").length,
  };

  return (
    <div className="ocs-app-page-outer w-full">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Workloads", path: "/workloads" },
          { label: "Jobs", path: "/workloads/jobs" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Jobs
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Create and manage one-off tasks that run to completion
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Jobs" path="/workloads/jobs" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]">
            <PlayCircle className="size-[16px]" />
            Create Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <CheckCircle className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Complete</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.complete}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <PlayCircle className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Running</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.running}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <XCircle className="size-[20px] text-[#d32f2f] dark:text-[#ef5350]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Failed</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.failed}</p>
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
                placeholder="Search jobs..."
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
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-[16px] py-[10px] bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[8px] text-[14px] text-[#151515] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#4dabf7]"
          >
            <option value="all">All Statuses</option>
            <option value="complete">Complete</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
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
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">COMPLETIONS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">DURATION</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">STATUS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">AGE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, index) => (
              <tr
                key={index}
                className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
              >
                <td className="px-[20px] py-[16px] text-[14px] text-[#151515] dark:text-white font-['Red_Hat_Mono:Regular',sans-serif]">
                  {job.name}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{job.namespace}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {job.completions}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{job.duration}</td>
                <td className="px-[20px] py-[16px]">
                  <div className="flex items-center gap-[8px]">
                    {getStatusIcon(job.status)}
                    <span className={`px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{job.age}</td>
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
