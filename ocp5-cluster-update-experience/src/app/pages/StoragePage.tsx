import { useState } from "react";
import { Search, RefreshCw, MoreVertical, HardDrive, Database, Folder, CheckCircle, XCircle, Clock } from "@/lib/pfIcons";
import Breadcrumbs from "../components/Breadcrumbs";
import FavoriteButton from "../components/FavoriteButton";

type ResourceType = "all" | "pv" | "pvc" | "storageclass";

interface StorageResource {
  name: string;
  namespace?: string;
  type: "PersistentVolume" | "PersistentVolumeClaim" | "StorageClass";
  status: "Bound" | "Available" | "Released" | "Pending" | "Failed";
  capacity?: string;
  accessMode?: string;
  storageClass?: string;
  volumeMode?: string;
  reclaim?: string;
  provisioner?: string;
  age: string;
}

export default function StoragePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceFilter, setResourceFilter] = useState<ResourceType>("all");
  const [selectedNamespace, setSelectedNamespace] = useState("all");

  const resources: StorageResource[] = [
    // Persistent Volumes
    { name: "pv-postgres-data-0", type: "PersistentVolume", status: "Bound", capacity: "100Gi", accessMode: "RWO", storageClass: "gp3-encrypted", reclaim: "Retain", age: "89d" },
    { name: "pv-postgres-data-1", type: "PersistentVolume", status: "Bound", capacity: "100Gi", accessMode: "RWO", storageClass: "gp3-encrypted", reclaim: "Retain", age: "89d" },
    { name: "pv-elasticsearch-0", type: "PersistentVolume", status: "Bound", capacity: "500Gi", accessMode: "RWO", storageClass: "gp3-standard", reclaim: "Delete", age: "156d" },
    { name: "pv-elasticsearch-1", type: "PersistentVolume", status: "Bound", capacity: "500Gi", accessMode: "RWO", storageClass: "gp3-standard", reclaim: "Delete", age: "156d" },
    { name: "pv-prometheus-data", type: "PersistentVolume", status: "Bound", capacity: "250Gi", accessMode: "RWO", storageClass: "gp3-standard", reclaim: "Retain", age: "67d" },
    { name: "pv-backup-storage", type: "PersistentVolume", status: "Available", capacity: "1Ti", accessMode: "RWX", storageClass: "efs-standard", reclaim: "Retain", age: "120d" },
    { name: "pv-shared-assets", type: "PersistentVolume", status: "Bound", capacity: "200Gi", accessMode: "RWX", storageClass: "efs-standard", reclaim: "Delete", age: "45d" },
    { name: "pv-redis-data", type: "PersistentVolume", status: "Bound", capacity: "50Gi", accessMode: "RWO", storageClass: "gp3-standard", reclaim: "Delete", age: "45d" },
    
    // Persistent Volume Claims
    { name: "postgres-data-0", namespace: "production", type: "PersistentVolumeClaim", status: "Bound", capacity: "100Gi", accessMode: "RWO", storageClass: "gp3-encrypted", volumeMode: "Filesystem", age: "89d" },
    { name: "postgres-data-1", namespace: "production", type: "PersistentVolumeClaim", status: "Bound", capacity: "100Gi", accessMode: "RWO", storageClass: "gp3-encrypted", volumeMode: "Filesystem", age: "89d" },
    { name: "elasticsearch-data-0", namespace: "logging", type: "PersistentVolumeClaim", status: "Bound", capacity: "500Gi", accessMode: "RWO", storageClass: "gp3-standard", volumeMode: "Filesystem", age: "156d" },
    { name: "elasticsearch-data-1", namespace: "logging", type: "PersistentVolumeClaim", status: "Bound", capacity: "500Gi", accessMode: "RWO", storageClass: "gp3-standard", volumeMode: "Filesystem", age: "156d" },
    { name: "prometheus-data", namespace: "monitoring", type: "PersistentVolumeClaim", status: "Bound", capacity: "250Gi", accessMode: "RWO", storageClass: "gp3-standard", volumeMode: "Filesystem", age: "67d" },
    { name: "shared-assets", namespace: "production", type: "PersistentVolumeClaim", status: "Bound", capacity: "200Gi", accessMode: "RWX", storageClass: "efs-standard", volumeMode: "Filesystem", age: "45d" },
    { name: "redis-data", namespace: "production", type: "PersistentVolumeClaim", status: "Bound", capacity: "50Gi", accessMode: "RWO", storageClass: "gp3-standard", volumeMode: "Filesystem", age: "45d" },
    { name: "temp-storage", namespace: "development", type: "PersistentVolumeClaim", status: "Pending", capacity: "10Gi", accessMode: "RWO", storageClass: "gp3-standard", volumeMode: "Filesystem", age: "5m" },
    
    // Storage Classes
    { name: "gp3-encrypted", type: "StorageClass", status: "Available", provisioner: "ebs.csi.aws.com", reclaim: "Retain", age: "234d" },
    { name: "gp3-standard", type: "StorageClass", status: "Available", provisioner: "ebs.csi.aws.com", reclaim: "Delete", age: "234d" },
    { name: "efs-standard", type: "StorageClass", status: "Available", provisioner: "efs.csi.aws.com", reclaim: "Delete", age: "234d" },
    { name: "io2-high-performance", type: "StorageClass", status: "Available", provisioner: "ebs.csi.aws.com", reclaim: "Delete", age: "234d" },
  ];

  const namespaces = ["all", "production", "development", "logging", "monitoring"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Bound":
      case "Available":
        return <CheckCircle className="size-[16px] text-[#3e8635] dark:text-[#81c784]" />;
      case "Pending":
        return <Clock className="size-[16px] text-[#ff9800] dark:text-[#ffb74d]" />;
      case "Failed":
      case "Released":
        return <XCircle className="size-[16px] text-[#d32f2f] dark:text-[#ef5350]" />;
      default:
        return <HardDrive className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Bound":
      case "Available":
        return "text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]";
      case "Pending":
        return "text-[#ff9800] dark:text-[#ffb74d] bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)]";
      case "Failed":
      case "Released":
        return "text-[#d32f2f] dark:text-[#ef5350] bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)]";
      default:
        return "text-[#4d4d4d] dark:text-[#b0b0b0] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)]";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PersistentVolume":
        return <HardDrive className="size-[16px] text-[#0066cc] dark:text-[#4dabf7]" />;
      case "PersistentVolumeClaim":
        return <Database className="size-[16px] text-[#3e8635] dark:text-[#81c784]" />;
      case "StorageClass":
        return <Folder className="size-[16px] text-[#ff9800] dark:text-[#ffb74d]" />;
      default:
        return <HardDrive className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />;
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = 
      resourceFilter === "all" || 
      (resourceFilter === "pv" && resource.type === "PersistentVolume") ||
      (resourceFilter === "pvc" && resource.type === "PersistentVolumeClaim") ||
      (resourceFilter === "storageclass" && resource.type === "StorageClass");
    const matchesNamespace = 
      selectedNamespace === "all" || 
      !resource.namespace || 
      resource.namespace === selectedNamespace;
    return matchesSearch && matchesType && matchesNamespace;
  });

  const stats = {
    pv: resources.filter(r => r.type === "PersistentVolume").length,
    pvc: resources.filter(r => r.type === "PersistentVolumeClaim").length,
    storageClasses: resources.filter(r => r.type === "StorageClass").length,
    totalCapacity: "2.5Ti",
  };

  return (
    <div className="ocs-app-page-outer">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Storage", path: "/storage" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Storage
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Manage PersistentVolumes, PersistentVolumeClaims, and StorageClasses
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Storage" path="/storage" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]">
            <HardDrive className="size-[16px]" />
            Create Volume
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <HardDrive className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Persistent Volumes</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.pv}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Database className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Volume Claims</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.pvc}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Folder className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Storage Classes</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.storageClasses}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <HardDrive className="size-[20px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Total Capacity</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.totalCapacity}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex-1 relative">
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
            <input
              type="text"
              placeholder="Search storage resources..."
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
            <option value="pv">Persistent Volumes</option>
            <option value="pvc">Volume Claims</option>
            <option value="storageclass">Storage Classes</option>
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
                  Capacity
                </th>
                <th className="text-left px-[20px] py-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white uppercase tracking-wide">
                  Storage Class
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
                      {getTypeIcon(resource.type)}
                      <span className="font-mono text-[13px] text-[#151515] dark:text-white">{resource.name}</span>
                    </div>
                  </td>
                  <td className="px-[20px] py-[16px]">
                    {resource.namespace ? (
                      <span className="px-[10px] py-[4px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-[999px] text-[12px] text-[#151515] dark:text-white font-mono">
                        {resource.namespace}
                      </span>
                    ) : (
                      <span className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">—</span>
                    )}
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                    {resource.type === "PersistentVolume" ? "PV" : resource.type === "PersistentVolumeClaim" ? "PVC" : "SC"}
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <div className="flex items-center gap-[6px]">
                      {getStatusIcon(resource.status)}
                      <span className={`px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#151515] dark:text-white font-mono">
                    {resource.capacity || "—"}
                  </td>
                  <td className="px-[20px] py-[16px] text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] font-mono">
                    {resource.storageClass || resource.provisioner || "—"}
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
            <HardDrive className="size-[48px] text-[#4d4d4d] dark:text-[#b0b0b0] mx-auto mb-[16px]" />
            <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
              No storage resources found matching your filters
            </p>
          </div>
        )}
      </div>
      </Breadcrumbs>
    </div>
  );
}