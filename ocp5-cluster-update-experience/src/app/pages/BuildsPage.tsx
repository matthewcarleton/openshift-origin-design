import { useState } from "react";
import { Search, RefreshCw, MoreVertical, Package, CheckCircle, XCircle, Clock, Play, GitBranch } from "@/lib/pfIcons";
import Breadcrumbs from "../components/Breadcrumbs";
import FavoriteButton from "../components/FavoriteButton";

type ResourceType = "all" | "buildconfigs" | "builds" | "imagestreams";

interface BuildResource {
  name: string;
  namespace: string;
  type: "BuildConfig" | "Build" | "ImageStream";
  status: "Complete" | "Running" | "Failed" | "Pending" | "New";
  duration?: string;
  from?: string;
  to?: string;
  strategy?: string;
  tags?: string[];
  age: string;
}

export default function BuildsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceFilter, setResourceFilter] = useState<ResourceType>("all");
  const [selectedNamespace, setSelectedNamespace] = useState("all");

  const resources: BuildResource[] = [
    // Build Configs
    { name: "api-gateway-bc", namespace: "production", type: "BuildConfig", status: "Complete", strategy: "Source", from: "Git", to: "api-gateway:latest", age: "8d" },
    { name: "auth-service-bc", namespace: "production", type: "BuildConfig", status: "Complete", strategy: "Docker", from: "Git", to: "auth-service:latest", age: "15d" },
    { name: "frontend-app-bc", namespace: "production", type: "BuildConfig", status: "Complete", strategy: "Source", from: "Git", to: "frontend-app:latest", age: "3d" },
    { name: "worker-service-bc", namespace: "production", type: "BuildConfig", status: "Complete", strategy: "Source", from: "Git", to: "worker-service:latest", age: "12d" },
    
    // Builds
    { name: "api-gateway-1", namespace: "production", type: "Build", status: "Complete", duration: "3m 24s", strategy: "Source", from: "Git@main:a3f2d1", to: "api-gateway:latest", age: "2d" },
    { name: "api-gateway-2", namespace: "production", type: "Build", status: "Running", duration: "1m 15s", strategy: "Source", from: "Git@main:b4e3c2", to: "api-gateway:latest", age: "5m" },
    { name: "auth-service-1", namespace: "production", type: "Build", status: "Complete", duration: "2m 48s", strategy: "Docker", from: "Git@main:c5f4d3", to: "auth-service:latest", age: "1d" },
    { name: "frontend-app-1", namespace: "production", type: "Build", status: "Failed", duration: "45s", strategy: "Source", from: "Git@main:d6g5e4", to: "frontend-app:latest", age: "12h" },
    { name: "frontend-app-2", namespace: "production", type: "Build", status: "Complete", duration: "4m 12s", strategy: "Source", from: "Git@main:e7h6f5", to: "frontend-app:latest", age: "6h" },
    { name: "worker-service-1", namespace: "production", type: "Build", status: "Complete", duration: "3m 56s", strategy: "Source", from: "Git@main:f8i7g6", to: "worker-service:latest", age: "3d" },
    { name: "test-build-1", namespace: "development", type: "Build", status: "Pending", strategy: "Source", from: "Git@dev:g9j8h7", to: "test-app:dev", age: "10m" },
    
    // Image Streams
    { name: "api-gateway", namespace: "production", type: "ImageStream", status: "Complete", tags: ["latest", "v2.1.0", "v2.0.5"], age: "8d" },
    { name: "auth-service", namespace: "production", type: "ImageStream", status: "Complete", tags: ["latest", "v1.8.3", "v1.8.2"], age: "15d" },
    { name: "frontend-app", namespace: "production", type: "ImageStream", status: "Complete", tags: ["latest", "v3.2.1", "v3.2.0", "v3.1.9"], age: "3d" },
    { name: "worker-service", namespace: "production", type: "ImageStream", status: "Complete", tags: ["latest", "v1.5.2"], age: "12d" },
    { name: "nginx-base", namespace: "production", type: "ImageStream", status: "Complete", tags: ["1.21", "1.20"], age: "45d" },
    { name: "nodejs-base", namespace: "production", type: "ImageStream", status: "Complete", tags: ["18", "16", "14"], age: "67d" },
  ];

  const namespaces = ["all", "production", "development", "staging"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="size-[16px] text-[#3e8635] dark:text-[#81c784]" />;
      case "Running":
        return <Clock className="size-[16px] text-[#0066cc] dark:text-[#4dabf7] animate-spin" />;
      case "Pending":
      case "New":
        return <Clock className="size-[16px] text-[#ff9800] dark:text-[#ffb74d]" />;
      case "Failed":
        return <XCircle className="size-[16px] text-[#d32f2f] dark:text-[#ef5350]" />;
      default:
        return <Package className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]";
      case "Running":
        return "text-[#0066cc] dark:text-[#4dabf7] bg-[#e7f1fa] dark:bg-[rgba(79,171,247,0.15)]";
      case "Pending":
      case "New":
        return "text-[#ff9800] dark:text-[#ffb74d] bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)]";
      case "Failed":
        return "text-[#d32f2f] dark:text-[#ef5350] bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)]";
      default:
        return "text-[#4d4d4d] dark:text-[#b0b0b0] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]";
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      resourceFilter === "all" ||
      (resourceFilter === "buildconfigs" && resource.type === "BuildConfig") ||
      (resourceFilter === "builds" && resource.type === "Build") ||
      (resourceFilter === "imagestreams" && resource.type === "ImageStream");
    const matchesNamespace = selectedNamespace === "all" || resource.namespace === selectedNamespace;
    return matchesSearch && matchesType && matchesNamespace;
  });

  const stats = {
    buildConfigs: resources.filter(r => r.type === "BuildConfig").length,
    builds: resources.filter(r => r.type === "Build").length,
    imageStreams: resources.filter(r => r.type === "ImageStream").length,
    running: resources.filter(r => r.status === "Running").length,
  };

  return (
    <div className="ocs-app-page-outer">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Builds", path: "/builds" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Builds
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            View and manage BuildConfigs, Builds, and ImageStreams
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Builds" path="/builds" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]">
            <Play className="size-[16px]" />
            Create Build
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <GitBranch className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Build Configs</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.buildConfigs}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Package className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Builds</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.builds}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Package className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Image Streams</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.imageStreams}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Clock className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Running</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#0066cc] dark:text-[#4dabf7]">{stats.running}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex-1 relative">
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
            <input
              type="text"
              placeholder="Search builds..."
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
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value as ResourceType)}
            className="px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] text-[#151515] dark:text-white text-[14px] cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="buildconfigs">Build Configs</option>
            <option value="builds">Builds</option>
            <option value="imagestreams">Image Streams</option>
          </select>
          <button className="p-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <RefreshCw className="size-[16px] text-[#151515] dark:text-white" />
          </button>
        </div>
      </div>

      {/* Resources Table */}
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
                  Details
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
              {filteredResources.map((resource, index) => (
                <tr
                  key={index}
                  className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                >
                  <td className="px-[20px] py-[16px]">
                    <div className="flex items-center gap-[8px]">
                      <Package className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
                      <span className="font-mono text-[13px] text-[#151515] dark:text-white">{resource.name}</span>
                    </div>
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <span className="px-[10px] py-[4px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-[999px] text-[12px] text-[#151515] dark:text-white font-mono">
                      {resource.namespace}
                    </span>
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                    {resource.type === "BuildConfig" ? "BC" : resource.type === "Build" ? "Build" : "IS"}
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <div className="flex items-center gap-[6px]">
                      {getStatusIcon(resource.status)}
                      <span className={`px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <div className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] font-mono">
                      {resource.type === "Build" && resource.duration && (
                        <div>Duration: {resource.duration}</div>
                      )}
                      {resource.from && <div>From: {resource.from}</div>}
                      {resource.tags && (
                        <div className="flex gap-[4px] flex-wrap mt-[4px]">
                          {resource.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-[6px] py-[2px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-[4px] text-[11px]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                    {resource.age}
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

        {filteredResources.length === 0 && (
          <div className="p-[48px] text-center">
            <Package className="size-[48px] text-[#4d4d4d] dark:text-[#b0b0b0] mx-auto mb-[16px]" />
            <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
              No build resources found matching your filters
            </p>
          </div>
        )}
      </div>
      </Breadcrumbs>
    </div>
  );
}