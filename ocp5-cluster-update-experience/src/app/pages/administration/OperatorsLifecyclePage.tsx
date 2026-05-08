import { AlertCircle, CheckCircle, Clock, Info, MoreVertical } from "@/lib/pfIcons";
import { useState } from "react";
import { useNavigate } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function OperatorsLifecyclePage() {
  const navigate = useNavigate();
  const [openKebabIndex, setOpenKebabIndex] = useState<number | null>(null);

  const handleTabClick = (tab: string) => {
    if (tab === 'plan') {
      navigate('/administration/cluster-settings');
    } else if (tab === 'operators') {
      navigate('/administration/cluster-update/operators');
    }
  };

  const operators = [
    {
      name: "Abot Operator",
      version: "v3.0.0",
      supportStatus: "Full Support",
      lifecycleStage: "Active",
      remainingTime: "18 months",
      fullSupportEnd: "Sep 2027",
      maintenanceEnd: "Sep 2028",
      eusEnd: "N/A",
      platformCompatibility: "4.20-4.24",
      updatePolicy: "Semi-automatic",
      channel: "stable-v3",
      statusColor: "text-[#3e8635] dark:text-[#81c784]",
      bgColor: "bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]",
    },
    {
      name: "Airflow Helm Operator",
      version: "v2.1.0",
      supportStatus: "Full Support",
      lifecycleStage: "Active",
      remainingTime: "24 months",
      fullSupportEnd: "Mar 2028",
      maintenanceEnd: "Mar 2029",
      eusEnd: "N/A",
      platformCompatibility: "4.18-4.23",
      updatePolicy: "Manual",
      channel: "stable-v2",
      statusColor: "text-[#3e8635] dark:text-[#81c784]",
      bgColor: "bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]",
    },
    {
      name: "Ansible Automation Platform",
      version: "v3.1.0",
      supportStatus: "Maintenance Support",
      lifecycleStage: "Maintenance",
      remainingTime: "6 months",
      fullSupportEnd: "Sep 2025",
      maintenanceEnd: "Mar 2027",
      eusEnd: "N/A",
      platformCompatibility: "4.16-4.22",
      updatePolicy: "Fully automatic",
      channel: "stable-v3",
      statusColor: "text-[#ff9800] dark:text-[#ffb74d]",
      bgColor: "bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.1)]",
    },
    {
      name: "OpenShift GitOps",
      version: "v1.8.5",
      supportStatus: "End of Life",
      lifecycleStage: "EOL",
      remainingTime: "Expired",
      fullSupportEnd: "Dec 2025",
      maintenanceEnd: "Jun 2026",
      eusEnd: "N/A",
      platformCompatibility: "4.12-4.20",
      updatePolicy: "Manual",
      channel: "stable-v1.8",
      statusColor: "text-[#c9190b] dark:text-[#ff6b6b]",
      bgColor: "bg-[#fdecea] dark:bg-[rgba(201,25,11,0.1)]",
    },
    {
      name: "Red Hat OpenShift Service Mesh",
      version: "v2.4.0",
      supportStatus: "Full Support",
      lifecycleStage: "Active",
      remainingTime: "30 months",
      fullSupportEnd: "Sep 2028",
      maintenanceEnd: "Sep 2029",
      eusEnd: "Sep 2030",
      platformCompatibility: "4.21-4.25",
      updatePolicy: "Semi-automatic",
      channel: "stable-v2.4",
      statusColor: "text-[#3e8635] dark:text-[#81c784]",
      bgColor: "bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]",
    },
  ];

  const summary = {
    totalOperators: 5,
    fullSupport: 3,
    maintenance: 1,
    endOfLife: 1,
  };

  return (
    <div className="ocs-app-page-outer h-full min-h-0 overflow-y-auto">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Cluster Settings", path: "/administration/cluster-settings" },
          ]}
        >

        <div className="mb-[24px]">
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[16px]">
            Cluster Update
          </h1>
          <div className="flex gap-[24px] text-[14px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <button
              className="pb-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] hover:text-[#151515] dark:hover:text-white"
              onClick={() => handleTabClick('plan')}
            >
              Update plan
            </button>
            <button
              className="pb-[12px] border-b-2 border-[#0066cc] dark:border-[#4dabf7] font-semibold text-[#151515] dark:text-white -mb-[1px]"
              onClick={() => handleTabClick('operators')}
            >
              Cluster operators
            </button>
            <button 
              className="pb-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] hover:text-[#151515] dark:hover:text-white"
              onClick={() => navigate('/administration/cluster-update/history')}
            >
              Update history
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px] mb-[8px]">Total Operators</p>
            <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold text-[#151515] dark:text-white text-[32px]">
              {summary.totalOperators}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px] mb-[8px]">Full Support</p>
            <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold text-[#3e8635] dark:text-[#81c784] text-[32px]">
              {summary.fullSupport}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px] mb-[8px]">Maintenance</p>
            <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold text-[#ff9800] dark:text-[#ffb74d] text-[32px]">
              {summary.maintenance}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px] mb-[8px]">End of Life</p>
            <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold text-[#c9190b] dark:text-[#ff6b6b] text-[32px]">
              {summary.endOfLife}
            </p>
          </div>
        </div>

        {/* Alert for EOL Operators */}
        {summary.endOfLife > 0 && (
          <div className="bg-[#fef6f5] dark:bg-[rgba(201,25,11,0.1)] border border-[#c9190b] dark:border-[#ee0000] rounded-[12px] p-[16px] mb-[24px]">
            <div className="flex items-start gap-[12px]">
              <AlertCircle className="size-[20px] text-[#c9190b] dark:text-[#ee0000] shrink-0 mt-[2px]" />
              <div>
                <p className="font-semibold text-[#151515] dark:text-white text-[14px] mb-[4px]">
                  Critical update required
                </p>
                <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                  2 operators have reached end of life and require immediate attention
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Operators Lifecycle Table */}
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[32px]">
          <div className="flex items-center justify-between mb-[24px]">
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[20px]">
              Installed Extensions Lifecycle Status
            </h2>
            <div className="flex gap-[12px]">
              <button className="bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] text-[#151515] dark:text-white px-[16px] py-[8px] rounded-[8px] font-semibold text-[14px] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                Export Report
              </button>
              <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[16px] py-[8px] rounded-[8px] font-semibold text-[14px] transition-colors">
                Plan Maintenance Window
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Operator Name
                  </th>
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Version
                  </th>
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Support Status
                  </th>
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Lifecycle Stage
                  </th>
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Time Remaining
                  </th>
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Platform Compatibility
                  </th>
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Update Policy
                  </th>
                  <th className="text-left py-[16px] px-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[13px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {operators.map((op, index) => (
                  <tr
                    key={op.name}
                    className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors ${
                      index === operators.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-[16px] px-[12px]">
                      <p className="font-['Red_Hat_Text:Medium',sans-serif] font-medium text-[#151515] dark:text-white text-[14px]">
                        {op.name}
                      </p>
                      <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">Channel: {op.channel}</p>
                    </td>
                    <td className="py-[16px] px-[12px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                      {op.version}
                    </td>
                    <td className="py-[16px] px-[12px]">
                      <span className={`px-[12px] py-[6px] rounded-[8px] text-[12px] font-semibold inline-flex items-center gap-[6px] ${op.bgColor} ${op.statusColor}`}>
                        {op.supportStatus === "End of Life" ? (
                          <AlertCircle className="size-[14px]" />
                        ) : op.supportStatus === "Maintenance Support" ? (
                          <Clock className="size-[14px]" />
                        ) : (
                          <CheckCircle className="size-[14px]" />
                        )}
                        {op.supportStatus}
                      </span>
                    </td>
                    <td className="py-[16px] px-[12px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                      {op.lifecycleStage}
                    </td>
                    <td className="py-[16px] px-[12px]">
                      <p className={`text-[14px] font-medium ${op.statusColor}`}>
                        {op.remainingTime}
                      </p>
                      <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        Full: {op.fullSupportEnd}
                      </p>
                    </td>
                    <td className="py-[16px] px-[12px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                      {op.platformCompatibility}
                    </td>
                    <td className="py-[16px] px-[12px]">
                      <span className="px-[10px] py-[4px] bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] text-[#151515] dark:text-white rounded-[999px] text-[12px] font-medium">
                        {op.updatePolicy}
                      </span>
                    </td>
                    <td className="py-[16px] px-[12px]">
                      <div className="relative">
                        <button
                          className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] rounded-[4px] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenKebabIndex(openKebabIndex === index ? null : index);
                          }}
                        >
                          <MoreVertical className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
                        </button>
                        
                        {openKebabIndex === index && (
                          <>
                            <div 
                              className="fixed inset-0 z-[9998]" 
                              onClick={() => setOpenKebabIndex(null)}
                            />
                            <div className="absolute right-0 mt-[4px] w-[220px] app-glass-panel app-glass-panel--radius-sm z-[9999] py-[4px]">
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  navigate(`/ecosystem/installed-operators/${op.name}`);
                                  setOpenKebabIndex(null);
                                }}
                              >
                                View details
                              </button>
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  navigate(`/ecosystem/installed-operators/${op.name}/update`);
                                  setOpenKebabIndex(null);
                                }}
                              >
                                Update operator
                              </button>
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  navigate(`/ecosystem/installed-operators/${op.name}/yaml`);
                                  setOpenKebabIndex(null);
                                }}
                              >
                                View YAML
                              </button>
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  navigate(`/ecosystem/installed-operators/${op.name}/logs`);
                                  setOpenKebabIndex(null);
                                }}
                              >
                                View logs
                              </button>
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  navigate(`/ecosystem/installed-operators/${op.name}/events`);
                                  setOpenKebabIndex(null);
                                }}
                              >
                                View events
                              </button>
                              <div className="my-[4px] h-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  navigate(`/ecosystem/installed-operators/${op.name}/subscription`);
                                  setOpenKebabIndex(null);
                                }}
                              >
                                Edit subscription
                              </button>
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  setOpenKebabIndex(null);
                                }}
                              >
                                {op.updatePolicy.includes('automatic') ? 'Pause automatic updates' : 'Enable automatic updates'}
                              </button>
                              <div className="my-[4px] h-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                onClick={() => {
                                  window.open(`https://docs.openshift.com/container-platform/operators/${op.name}`, '_blank');
                                  setOpenKebabIndex(null);
                                }}
                              >
                                View documentation
                              </button>
                              <div className="my-[4px] h-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
                              <button
                                className="w-full text-left px-[16px] py-[8px] text-[14px] text-[#c9190b] dark:text-[#ff6b6b] hover:bg-[rgba(201,25,11,0.05)] dark:hover:bg-[rgba(255,107,107,0.05)] transition-colors"
                                onClick={() => {
                                  setOpenKebabIndex(null);
                                }}
                              >
                                Uninstall
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lifecycle Legend */}
          <div className="mt-[32px] pt-[24px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-start gap-[12px] mb-[16px]">
              <Info className="size-[20px] text-[#0066cc] dark:text-[#4dabf7] shrink-0 mt-[2px]" />
              <div>
                <p className="font-semibold text-[#151515] dark:text-white text-[14px] mb-[8px]">
                  Lifecycle Stages Explained
                </p>
                <div className="grid grid-cols-3 gap-[16px] text-[13px]">
                  <div>
                    <p className="font-semibold text-[#3e8635] dark:text-[#81c784] mb-[4px]">Full Support</p>
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Receives bug fixes, security updates, and new features
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#ff9800] dark:text-[#ffb74d] mb-[4px]">Maintenance Support</p>
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Receives critical security fixes only
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#c9190b] dark:text-[#ff6b6b] mb-[4px]">End of Life (EOL)</p>
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0]">
                      No longer receives any updates or support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Breadcrumbs>
    </div>
  );
}