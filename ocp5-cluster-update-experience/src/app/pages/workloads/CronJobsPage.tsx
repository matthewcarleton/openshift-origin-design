import { useState } from "react";
import { Search, RefreshCw, MoreVertical, CheckCircle, Clock, Calendar } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

interface CronJob {
  name: string;
  namespace: string;
  schedule: string;
  suspend: boolean;
  active: number;
  lastSchedule: string;
  age: string;
}

export default function CronJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("all");

  const cronjobs: CronJob[] = [
    { name: "backup-job", namespace: "production", schedule: "0 2 * * *", suspend: false, active: 0, lastSchedule: "12h", age: "45d" },
    { name: "cache-cleanup", namespace: "production", schedule: "*/15 * * * *", suspend: false, active: 0, lastSchedule: "5m", age: "30d" },
    { name: "report-generator", namespace: "production", schedule: "0 8 * * 1", suspend: false, active: 0, lastSchedule: "2d", age: "60d" },
    { name: "log-rotation", namespace: "logging", schedule: "0 0 * * *", suspend: false, active: 0, lastSchedule: "18h", age: "90d" },
    { name: "metrics-aggregation", namespace: "monitoring", schedule: "*/5 * * * *", suspend: false, active: 1, lastSchedule: "2m", age: "75d" },
    { name: "database-cleanup", namespace: "production", schedule: "0 3 * * 0", suspend: true, active: 0, lastSchedule: "7d", age: "120d" },
  ];

  const namespaces = ["all", "production", "development", "logging", "monitoring"];

  const filteredCronJobs = cronjobs.filter((cj) => {
    const matchesSearch = cj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cj.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNamespace = selectedNamespace === "all" || cj.namespace === selectedNamespace;
    return matchesSearch && matchesNamespace;
  });

  const stats = {
    total: cronjobs.length,
    active: cronjobs.filter((cj) => cj.active > 0).length,
    suspended: cronjobs.filter((cj) => cj.suspend).length,
  };

  return (
    <div className="ocs-app-page-outer w-full">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Workloads", path: "/workloads" },
          { label: "CronJobs", path: "/workloads/cronjobs" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            CronJobs
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Manage time-based Jobs that run on a repeating schedule
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="CronJobs" path="/workloads/cronjobs" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]">
            <Calendar className="size-[16px]" />
            Create CronJob
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <CheckCircle className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Total CronJobs</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Clock className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Active Jobs</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.active}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Clock className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Suspended</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.suspended}</p>
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
                placeholder="Search cronjobs..."
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
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">SCHEDULE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">SUSPEND</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">ACTIVE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">LAST SCHEDULE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">AGE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCronJobs.map((cj, index) => (
              <tr
                key={index}
                className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
              >
                <td className="px-[20px] py-[16px] text-[14px] text-[#151515] dark:text-white font-['Red_Hat_Mono:Regular',sans-serif]">
                  {cj.name}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{cj.namespace}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {cj.schedule}
                </td>
                <td className="px-[20px] py-[16px]">
                  <span className={`px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold ${
                    cj.suspend
                      ? "text-[#ff9800] dark:text-[#ffb74d] bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)]"
                      : "text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]"
                  }`}>
                    {cj.suspend ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{cj.active}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{cj.lastSchedule}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{cj.age}</td>
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
