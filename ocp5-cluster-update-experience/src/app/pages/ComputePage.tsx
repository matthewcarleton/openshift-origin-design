import { useState } from "react";
import { Link } from "react-router";
import { Server, Cpu, HardDrive, Activity, Search, RefreshCw } from "@/lib/pfIcons";
import Breadcrumbs from "../components/Breadcrumbs";
import FavoriteButton from "../components/FavoriteButton";

interface Node {
  name: string;
  status: string;
  role: string;
  version: string;
  cpu: string;
  memory: string;
  pods: string;
  age: string;
}

export default function ComputePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const nodes: Node[] = [
    { name: "master-01", status: "Ready", role: "Master", version: "v1.25.0", cpu: "4 cores", memory: "16 GB", pods: "15/50", age: "120d" },
    { name: "master-02", status: "Ready", role: "Master", version: "v1.25.0", cpu: "4 cores", memory: "16 GB", pods: "18/50", age: "120d" },
    { name: "master-03", status: "Ready", role: "Master", version: "v1.25.0", cpu: "4 cores", memory: "16 GB", pods: "12/50", age: "120d" },
    { name: "worker-east-01", status: "Ready", role: "Worker", version: "v1.25.0", cpu: "8 cores", memory: "32 GB", pods: "42/110", age: "89d" },
    { name: "worker-east-02", status: "Ready", role: "Worker", version: "v1.25.0", cpu: "8 cores", memory: "32 GB", pods: "35/110", age: "89d" },
    { name: "worker-west-01", status: "Ready", role: "Worker", version: "v1.25.0", cpu: "8 cores", memory: "32 GB", pods: "38/110", age: "67d" },
  ];

  const filteredNodes = nodes.filter((node) =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: nodes.length,
    ready: nodes.filter((n) => n.status === "Ready").length,
    masters: nodes.filter((n) => n.role === "Master").length,
    workers: nodes.filter((n) => n.role === "Worker").length,
  };

  return (
    <div className="ocs-app-page-outer w-full">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Compute", path: "/compute" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Compute
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Manage cluster nodes and compute resources
          </p>
        </div>
        <FavoriteButton name="Compute" path="/compute" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Server className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Total Nodes</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Activity className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Ready</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.ready}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Cpu className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Master Nodes</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.masters}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <HardDrive className="size-[20px] text-[#9c27b0] dark:text-[#ba68c8]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Worker Nodes</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.workers}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[20px] mb-[16px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-[40px] pr-[12px] py-[10px] bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[8px] text-[14px] text-[#151515] dark:text-white placeholder:text-[#4d4d4d] dark:placeholder:text-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#4dabf7]"
              />
            </div>
          </div>
          <button className="p-[10px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[8px] transition-colors">
            <RefreshCw className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
          </button>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <tr>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">NAME</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">STATUS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">ROLE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">VERSION</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">CPU</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">MEMORY</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">PODS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">AGE</th>
            </tr>
          </thead>
          <tbody>
            {filteredNodes.map((node, index) => (
              <tr
                key={index}
                className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                <td className="px-[20px] py-[16px]">
                  <Link to={`/compute/nodes/${node.name}`} className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline font-['Red_Hat_Mono:Regular',sans-serif]">
                    {node.name}
                  </Link>
                </td>
                <td className="px-[20px] py-[16px]">
                  <span className="px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]">
                    {node.status}
                  </span>
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{node.role}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {node.version}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{node.cpu}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{node.memory}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {node.pods}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{node.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Breadcrumbs>
    </div>
  );
}