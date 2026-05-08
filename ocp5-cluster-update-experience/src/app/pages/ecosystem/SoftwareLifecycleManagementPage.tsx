import { useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, Info, CheckCircle } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function SoftwareLifecycleManagementPage() {
  const [selectedTab, setSelectedTab] = useState<"operators" | "cluster">("operators");

  const operatorUpdates = [
    {
      id: "abot-operator",
      name: "Abot Operator",
      currentVersion: "3.0.0",
      targetVersion: "3.1.0",
      status: "update-available",
      updatePlan: "Manual",
      clusterCompatibility: "Compatible",
      requiredByClusterUpdate: true,
    },
    {
      id: "airflow-helm",
      name: "Airflow Helm Operator",
      currentVersion: "5.7.2",
      targetVersion: "5.7.3",
      status: "update-available",
      updatePlan: "Manual",
      clusterCompatibility: "Compatible",
      requiredByClusterUpdate: true,
    },
    {
      id: "ansible-automation",
      name: "Ansible Automation Platform",
      currentVersion: "1.5.0",
      targetVersion: "1.6.0",
      status: "update-available",
      updatePlan: "Automatic",
      clusterCompatibility: "Compatible",
      requiredByClusterUpdate: false,
    },
    {
      id: "bare-metal-event",
      name: "Bare Metal Event Relay",
      currentVersion: "1.1.1",
      targetVersion: "1.2.0",
      status: "update-available",
      updatePlan: "Automatic",
      clusterCompatibility: "Compatible",
      requiredByClusterUpdate: false,
    },
  ];

  const clusterUpdate = {
    currentVersion: "4.21.0",
    targetVersion: "4.22.0",
    channel: "candidate-4.22",
    status: "available",
    blockedByOperators: ["Abot Operator", "Airflow Helm Operator"],
  };

  return (
    <div className="ocs-app-page-outer h-full min-h-0 overflow-y-auto">
        <Breadcrumbs
          items={[
            { label: "Ecosystem", path: "/ecosystem" },
            { label: "Software Lifecycle Management" },
          ]}
        >

        <div className="mb-[24px]">
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Software Lifecycle Management
          </h1>
          <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Coordinate operator and cluster updates to maintain system stability and compatibility.
          </p>
        </div>

        {/* Alert about cluster update being blocked */}
        {clusterUpdate.blockedByOperators.length > 0 && (
          <div className="mb-[24px] bg-[#fef6e6] dark:bg-[rgba(240,171,0,0.15)] border-l-4 border-[#f0ab00] dark:border-[#f4c145] rounded-[8px] p-[16px]">
            <div className="flex items-start gap-[12px]">
              <AlertTriangle className="size-[20px] text-[#f0ab00] dark:text-[#f4c145] shrink-0 mt-[2px]" />
              <div className="flex-1">
                <p className="text-[14px] text-[#151515] dark:text-white font-semibold mb-[4px]">
                  Cluster update requires operator updates
                </p>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
                  The following operators must be updated before the cluster can update to OpenShift {clusterUpdate.targetVersion}:
                </p>
                <ul className="list-disc list-inside text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[12px]">
                  {clusterUpdate.blockedByOperators.map((op) => (
                    <li key={op}>{op}</li>
                  ))}
                </ul>
                <div className="flex gap-[12px]">
                  <button
                    onClick={() => setSelectedTab("operators")}
                    className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline font-semibold"
                  >
                    Update operators now
                  </button>
                  <Link
                    to="/administration/cluster-settings"
                    className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline font-semibold"
                  >
                    View cluster settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px]">
          <div className="flex gap-[24px]">
            <button
              onClick={() => setSelectedTab("operators")}
              className={`pb-[12px] border-b-2 transition-colors ${
                selectedTab === "operators"
                  ? "border-[#0066cc] dark:border-[#4dabf7] font-semibold text-[#151515] dark:text-white"
                  : "border-transparent text-[#4d4d4d] dark:text-[#b0b0b0] hover:text-[#151515] dark:hover:text-white"
              } text-[14px] -mb-[1px]`}
            >
              Operator Updates
            </button>
            <button
              onClick={() => setSelectedTab("cluster")}
              className={`pb-[12px] border-b-2 transition-colors ${
                selectedTab === "cluster"
                  ? "border-[#0066cc] dark:border-[#4dabf7] font-semibold text-[#151515] dark:text-white"
                  : "border-transparent text-[#4d4d4d] dark:text-[#b0b0b0] hover:text-[#151515] dark:hover:text-white"
              } text-[14px] -mb-[1px]`}
            >
              Cluster Update
            </button>
          </div>
        </div>

        {/* Operator Updates Tab */}
        {selectedTab === "operators" && (
          <>
            <div className="mb-[24px]">
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white mb-[12px]">
                Pending Operator Updates
              </h2>
              <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                {operatorUpdates.length} operators have updates available
              </p>
            </div>

            <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
                    <th className="text-left py-[16px] px-[20px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                      Name ↕
                    </th>
                    <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                      Current Version
                    </th>
                    <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                      Target Version
                    </th>
                    <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                      Update Plan
                    </th>
                    <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                      Compatibility
                    </th>
                    <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operatorUpdates.map((op, index) => (
                    <tr
                      key={op.id}
                      className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors ${
                        index === operatorUpdates.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="py-[16px] px-[20px]">
                        <div className="flex items-center gap-[8px]">
                          <Link
                            to={`/ecosystem/installed-operators/${op.id}`}
                            className="font-['Red_Hat_Text:Medium',sans-serif] font-medium text-[#0066cc] dark:text-[#4dabf7] text-[14px] hover:underline no-underline"
                          >
                            {op.name}
                          </Link>
                          {op.requiredByClusterUpdate && (
                            <span className="px-[8px] py-[2px] bg-[#f0ab00] dark:bg-[rgba(240,171,0,0.15)] text-white dark:text-[#f4c145] rounded-[4px] text-[11px] font-semibold">
                              Required
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-[16px] px-[12px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        {op.currentVersion}
                      </td>
                      <td className="py-[16px] px-[12px] text-[14px] text-[#0066cc] dark:text-[#4dabf7] font-semibold">
                        {op.targetVersion}
                      </td>
                      <td className="py-[16px] px-[12px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        {op.updatePlan}
                      </td>
                      <td className="py-[16px] px-[12px]">
                        <span className="flex items-center gap-[6px] text-[13px] text-[#3e8635] dark:text-[#5ba352]">
                          <CheckCircle className="size-[14px]" />
                          {op.clusterCompatibility}
                        </span>
                      </td>
                      <td className="py-[16px] px-[12px]">
                        <Link
                          to={`/ecosystem/installed-operators/${op.id}/update`}
                          className="px-[16px] py-[8px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[8px] font-semibold text-[13px] transition-colors inline-block"
                        >
                          Update
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Cluster Update Tab */}
        {selectedTab === "cluster" && (
          <>
            <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[16px] p-[24px] mb-[24px]">
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white mb-[16px]">
                Cluster Update Status
              </h2>
              <div className="grid grid-cols-2 gap-[24px] mb-[24px]">
                <div>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Current Version</p>
                  <p className="text-[20px] font-semibold text-[#151515] dark:text-white">
                    {clusterUpdate.currentVersion}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Target Version</p>
                  <p className="text-[20px] font-semibold text-[#0066cc] dark:text-[#4dabf7]">
                    {clusterUpdate.targetVersion}
                  </p>
                </div>
              </div>

              <div className="mb-[24px]">
                <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[4px]">Update Channel</p>
                <p className="text-[14px] text-[#151515] dark:text-white">{clusterUpdate.channel}</p>
              </div>

              {clusterUpdate.blockedByOperators.length > 0 ? (
                <div className="bg-[#fef6e6] dark:bg-[rgba(240,171,0,0.15)] border-l-4 border-[#f0ab00] dark:border-[#f4c145] rounded-[8px] p-[16px] mb-[24px]">
                  <div className="flex items-start gap-[12px]">
                    <AlertTriangle className="size-[20px] text-[#f0ab00] dark:text-[#f4c145] shrink-0 mt-[2px]" />
                    <div>
                      <p className="text-[14px] text-[#151515] dark:text-white font-semibold mb-[4px]">
                        Cluster update blocked
                      </p>
                      <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        {clusterUpdate.blockedByOperators.length} operator(s) must be updated first
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f3faf2] dark:bg-[rgba(62,134,53,0.15)] border-l-4 border-[#3e8635] dark:border-[#5ba352] rounded-[8px] p-[16px] mb-[24px]">
                  <div className="flex items-start gap-[12px]">
                    <CheckCircle className="size-[20px] text-[#3e8635] dark:text-[#5ba352] shrink-0 mt-[2px]" />
                    <div>
                      <p className="text-[14px] text-[#151515] dark:text-white font-semibold mb-[4px]">
                        Ready to update
                      </p>
                      <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        All operator dependencies are satisfied
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-[12px]">
                <Link
                  to="/administration/cluster-settings"
                  className="px-[16px] py-[10px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[8px] font-semibold text-[14px] transition-colors"
                >
                  View cluster settings
                </Link>
                {clusterUpdate.blockedByOperators.length > 0 && (
                  <button
                    onClick={() => setSelectedTab("operators")}
                    className="px-[16px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] text-[#151515] dark:text-white rounded-[8px] font-semibold text-[14px] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                  >
                    Update required operators
                  </button>
                )}
              </div>
            </div>
          </>
        )}
        </Breadcrumbs>
    </div>
  );
}
