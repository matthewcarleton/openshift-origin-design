import { useState } from "react";
import { Search, RefreshCw, MoreVertical, CheckCircle, Package } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

interface Deployment {
  name: string;
  namespace: string;
  ready: string;
  upToDate: string;
  available: string;
  age: string;
}

export default function DeploymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("all");

  const deployments: Deployment[] = [
    { name: "nginx-deployment", namespace: "production", ready: "3/3", upToDate: "3", available: "3", age: "12d" },
    { name: "api-gateway", namespace: "production", ready: "2/2", upToDate: "2", available: "2", age: "8d" },
    { name: "auth-service", namespace: "production", ready: "1/1", upToDate: "1", available: "1", age: "15d" },
    { name: "grafana-deployment", namespace: "monitoring", ready: "1/1", upToDate: "1", available: "1", age: "23d" },
    { name: "frontend-app", namespace: "production", ready: "4/4", upToDate: "4", available: "4", age: "30d" },
    { name: "backend-api", namespace: "production", ready: "6/6", upToDate: "6", available: "6", age: "45d" },
  ];

  const namespaces = ["all", "production", "development", "logging", "monitoring"];

  const filteredDeployments = deployments.filter((deployment) => {
    const matchesSearch = deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNamespace = selectedNamespace === "all" || deployment.namespace === selectedNamespace;
    return matchesSearch && matchesNamespace;
  });

  return (
    <div className="ocs-app-page-outer w-full">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Workloads", path: "/workloads" },
          { label: "Deployments", path: "/workloads/deployments" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Deployments
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Manage declarative updates for Pods and ReplicaSets
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Deployments" path="/workloads/deployments" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]">
            <Package className="size-[16px]" />
            Create Deployment
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px]">
        <div className="flex items-center gap-[12px] mb-[8px]">
          <CheckCircle className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
          <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Total Deployments</p>
        </div>
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{deployments.length}</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[20px] mb-[16px]">
        <div className="flex items-center gap-[16px] flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              <input
                type="text"
                placeholder="Search deployments..."
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
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">READY</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">UP-TO-DATE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">AVAILABLE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">AGE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredDeployments.map((deployment, index) => (
              <tr
                key={index}
                className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
              >
                <td className="px-[20px] py-[16px] text-[14px] text-[#151515] dark:text-white font-['Red_Hat_Mono:Regular',sans-serif]">
                  {deployment.name}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{deployment.namespace}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {deployment.ready}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{deployment.upToDate}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{deployment.available}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{deployment.age}</td>
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