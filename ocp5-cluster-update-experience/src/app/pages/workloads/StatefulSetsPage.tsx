import { useState } from "react";
import { Search, RefreshCw, MoreVertical, CheckCircle, Database } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

interface StatefulSet {
  name: string;
  namespace: string;
  ready: string;
  age: string;
  replicas: number;
}

export default function StatefulSetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("all");

  const statefulsets: StatefulSet[] = [
    { name: "postgres-statefulset", namespace: "production", ready: "2/2", age: "89d", replicas: 2 },
    { name: "elasticsearch-data", namespace: "logging", ready: "2/2", age: "156d", replicas: 2 },
    { name: "prometheus-server", namespace: "monitoring", ready: "1/1", age: "67d", replicas: 1 },
    { name: "redis-cluster", namespace: "production", ready: "3/3", age: "45d", replicas: 3 },
    { name: "cassandra-ring", namespace: "production", ready: "5/5", age: "120d", replicas: 5 },
    { name: "mongodb-replicaset", namespace: "production", ready: "3/3", age: "78d", replicas: 3 },
  ];

  const namespaces = ["all", "production", "development", "logging", "monitoring"];

  const filteredStatefulSets = statefulsets.filter((ss) => {
    const matchesSearch = ss.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ss.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNamespace = selectedNamespace === "all" || ss.namespace === selectedNamespace;
    return matchesSearch && matchesNamespace;
  });

  return (
    <div className="ocs-app-page-outer w-full">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Workloads", path: "/workloads" },
          { label: "StatefulSets", path: "/workloads/statefulsets" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            StatefulSets
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Manage stateful applications with stable network identifiers and persistent storage
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="StatefulSets" path="/workloads/statefulsets" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]">
            <Database className="size-[16px]" />
            Create StatefulSet
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px]">
        <div className="flex items-center gap-[12px] mb-[8px]">
          <CheckCircle className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
          <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Total StatefulSets</p>
        </div>
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{statefulsets.length}</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[20px] mb-[16px]">
        <div className="flex items-center gap-[16px] flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              <input
                type="text"
                placeholder="Search statefulsets..."
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
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">REPLICAS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">AGE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredStatefulSets.map((ss, index) => (
              <tr
                key={index}
                className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
              >
                <td className="px-[20px] py-[16px] text-[14px] text-[#151515] dark:text-white font-['Red_Hat_Mono:Regular',sans-serif]">
                  {ss.name}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{ss.namespace}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-['Red_Hat_Mono:Regular',sans-serif]">
                  {ss.ready}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{ss.replicas}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{ss.age}</td>
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
