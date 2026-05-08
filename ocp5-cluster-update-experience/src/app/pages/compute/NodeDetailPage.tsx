import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Server, Droplet, RotateCw, Trash2, CheckCircle2, Activity } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

export default function NodeDetailPage() {
  const { nodeName } = useParams();
  const navigate = useNavigate();
  const [showDrainModal, setShowDrainModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock node data - in real app, this would be fetched based on nodeName
  const nodeData = {
    "worker-east-01": {
      name: "worker-east-01",
      pool: "Worker pool east-1b",
      status: "Ready",
      version: "v1.25.0",
      platform: "AWS",
      instanceType: "m5.2xlarge",
      zone: "us-east-1b",
      ipAddress: "10.0.1.45",
      cpu: "8 cores",
      memory: "32 GB",
      storage: "120 GB",
      cpuUsage: "45%",
      memoryUsage: "68%",
      storageUsage: "85%",
      pods: "42/110"
    },
    "worker-east-02": {
      name: "worker-east-02",
      pool: "Worker pool east-1c",
      status: "Ready",
      version: "v1.25.0",
      platform: "AWS",
      instanceType: "m5.2xlarge",
      zone: "us-east-1c",
      ipAddress: "10.0.2.67",
      cpu: "8 cores",
      memory: "32 GB",
      storage: "120 GB",
      cpuUsage: "38%",
      memoryUsage: "52%",
      storageUsage: "62%",
      pods: "35/110"
    }
  };

  const decodedName = decodeURIComponent(nodeName || "");
  const node = nodeData[decodedName as keyof typeof nodeData] || nodeData["worker-east-01"];

  const handleDrain = () => {
    setShowDrainModal(false);
    // Trigger drain workflow
    navigate('/compute');
  };

  const handleRestart = () => {
    setShowRestartModal(false);
    // Trigger restart workflow
    navigate('/compute');
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    // Trigger delete workflow
    navigate('/compute');
  };

  return (
    <div className="ocs-app-page-outer h-full min-h-0 overflow-y-auto">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Compute", path: "/compute" },
            { label: "Nodes", path: "/compute" },
            { label: node.name },
          ]}
        >

        {/* Header */}
        <div className="mb-[24px]">
          <button
            onClick={() => navigate('/compute')}
            className="flex items-center gap-[8px] text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline mb-[16px]"
          >
            <ArrowLeft className="size-[16px]" />
            Back to Compute
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-[16px]">
              <div className="size-[64px] bg-gradient-to-br from-[#0066cc] to-[#004080] dark:from-[#4dabf7] dark:to-[#339af0] rounded-[12px] flex items-center justify-center">
                <Server className="size-[32px] text-white" />
              </div>
              <div>
                <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium text-[28px] text-[#151515] dark:text-white mb-[8px]">
                  {node.name}
                </h1>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[12px]">
                  {node.pool} • {node.instanceType}
                </p>
                <div className="flex items-center gap-[8px]">
                  <CheckCircle2 className="size-[16px] text-[#3e8635] dark:text-[#7cc674]" />
                  <span className="text-[14px] text-[#151515] dark:text-white">
                    Status: <strong>{node.status}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-[12px]">
              <FavoriteButton name={node.name} path={`/compute/nodes/${nodeName}`} />
              <button
                onClick={() => setShowDrainModal(true)}
                className="flex items-center gap-[8px] px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.03)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                <Droplet className="size-[16px]" />
                Drain node
              </button>
              <button
                onClick={() => setShowRestartModal(true)}
                className="flex items-center gap-[8px] px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.03)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                <RotateCw className="size-[16px]" />
                Restart
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-[8px] px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.03)] border border-[#c9190b] dark:border-[#ee0000] text-[#c9190b] dark:text-[#ee0000] hover:bg-[rgba(201,25,11,0.05)] dark:hover:bg-[rgba(201,25,11,0.15)] rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                <Trash2 className="size-[16px]" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-[24px]">
          {/* Left Column */}
          <div className="space-y-[24px]">
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[24px]">
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[16px]">
                Node Details
              </h2>
              <div className="space-y-[16px]">
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Kubernetes Version</p>
                  <p className="text-[14px] text-[#151515] dark:text-white">{node.version}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Platform</p>
                  <p className="text-[14px] text-[#151515] dark:text-white">{node.platform}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Availability Zone</p>
                  <p className="text-[14px] text-[#151515] dark:text-white">{node.zone}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Internal IP</p>
                  <p className="text-[14px] text-[#151515] dark:text-white font-mono">{node.ipAddress}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[24px]">
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[16px]">
                Resources
              </h2>
              <div className="space-y-[16px]">
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">CPU</p>
                  <p className="text-[14px] text-[#151515] dark:text-white">{node.cpu}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Memory</p>
                  <p className="text-[14px] text-[#151515] dark:text-white">{node.memory}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Storage</p>
                  <p className="text-[14px] text-[#151515] dark:text-white">{node.storage}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Pods</p>
                  <p className="text-[14px] text-[#151515] dark:text-white">{node.pods}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-[24px]">
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[24px]">
              <div className="flex items-center gap-[8px] mb-[16px]">
                <Activity className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
                <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white">
                  Resource Usage
                </h2>
              </div>
              <div className="space-y-[20px]">
                <div>
                  <div className="flex justify-between mb-[8px]">
                    <p className="text-[14px] text-[#151515] dark:text-white">CPU Usage</p>
                    <p className="text-[14px] font-semibold text-[#151515] dark:text-white">{node.cpuUsage}</p>
                  </div>
                  <div className="h-[8px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0066cc] dark:bg-[#4dabf7]" style={{ width: node.cpuUsage }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-[8px]">
                    <p className="text-[14px] text-[#151515] dark:text-white">Memory Usage</p>
                    <p className="text-[14px] font-semibold text-[#151515] dark:text-white">{node.memoryUsage}</p>
                  </div>
                  <div className="h-[8px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff9800] dark:bg-[#ffb74d]" style={{ width: node.memoryUsage }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-[8px]">
                    <p className="text-[14px] text-[#151515] dark:text-white">Storage Usage</p>
                    <p className="text-[14px] font-semibold text-[#c9190b] dark:text-[#ee0000]">{node.storageUsage}</p>
                  </div>
                  <div className="h-[8px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c9190b] dark:bg-[#ee0000]" style={{ width: node.storageUsage }}></div>
                  </div>
                </div>
              </div>
            </div>

            {parseFloat(node.storageUsage) > 80 && (
              <div className="bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.1)] rounded-[12px] border border-[#ff9800] dark:border-[#ffb74d] p-[24px]">
                <div className="flex items-start gap-[12px]">
                  <Activity className="size-[20px] text-[#ff9800] dark:text-[#ffb74d] mt-[2px]" />
                  <div>
                    <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[16px] text-[#151515] dark:text-white mb-[8px]">
                      High Storage Usage
                    </h3>
                    <p className="text-[14px] text-[#151515] dark:text-white mb-[16px]">
                      This node is experiencing high storage usage ({node.storageUsage}). Consider draining the node and cleaning up unused resources.
                    </p>
                    <button
                      onClick={() => setShowDrainModal(true)}
                      className="flex items-center gap-[8px] px-[16px] py-[10px] bg-[#ff9800] hover:bg-[#f57c00] dark:bg-[#ffb74d] dark:hover:bg-[#ff9800] text-white rounded-[8px] font-semibold text-[14px] transition-colors"
                    >
                      <Droplet className="size-[16px]" />
                      Drain node
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Breadcrumbs>

      {/* Drain Modal */}
      {showDrainModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="app-glass-panel p-[24px] max-w-[500px] w-full mx-[16px]">
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white mb-[16px]">
              Drain {node.name}
            </h2>
            <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[24px]">
              Draining will safely evict all pods from this node. The node will be marked as unschedulable until uncordoned.
            </p>
            <div className="flex gap-[12px] justify-end">
              <button
                onClick={() => setShowDrainModal(false)}
                className="px-[16px] py-[10px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] text-[#151515] dark:text-white rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDrain}
                className="px-[16px] py-[10px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                Drain node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restart Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="app-glass-panel p-[24px] max-w-[500px] w-full mx-[16px]">
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white mb-[16px]">
              Restart {node.name}
            </h2>
            <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[24px]">
              Restarting the node will cause a brief interruption. All pods will be rescheduled to other available nodes.
            </p>
            <div className="flex gap-[12px] justify-end">
              <button
                onClick={() => setShowRestartModal(false)}
                className="px-[16px] py-[10px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] text-[#151515] dark:text-white rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestart}
                className="px-[16px] py-[10px] bg-[#ff9800] hover:bg-[#f57c00] dark:bg-[#ffb74d] dark:hover:bg-[#ff9800] text-white rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                Restart node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="app-glass-panel p-[24px] max-w-[500px] w-full mx-[16px]">
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white mb-[16px]">
              Delete {node.name}
            </h2>
            <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[24px]">
              Are you sure you want to delete this node? This action cannot be undone. The node will be permanently removed from the cluster.
            </p>
            <div className="flex gap-[12px] justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-[16px] py-[10px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] text-[#151515] dark:text-white rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-[16px] py-[10px] bg-[#c9190b] hover:bg-[#a30000] dark:bg-[#ee0000] dark:hover:bg-[#c9190b] text-white rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                Delete node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}