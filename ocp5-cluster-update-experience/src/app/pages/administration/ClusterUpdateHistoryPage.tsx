import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, XCircle, Clock, Download, Eye, Trash2, MoreVertical } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";

interface UpdateRecord {
  id: string;
  fromVersion: string;
  toVersion: string;
  status: "completed" | "failed" | "in-progress";
  startedAt: string;
  completedAt?: string;
  duration?: string;
  updatedBy: string;
  notes?: string;
  preCheckData?: any;
}

export default function ClusterUpdateHistoryPage() {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [records, setRecords] = useState<UpdateRecord[]>([
    {
      id: "update-001",
      fromVersion: "4.20.0",
      toVersion: "4.21.0",
      status: "completed",
      startedAt: "2024-03-10 14:30:00",
      completedAt: "2024-03-10 16:42:15",
      duration: "2h 12min",
      updatedBy: "admin@redhat.com",
      notes: "Successful update with AI guidance. No issues encountered.",
      preCheckData: {
        clusterHealth: "Passed",
        apiChanges: 3,
        operatorReadiness: "All compatible"
      }
    },
    {
      id: "update-002",
      fromVersion: "4.19.2",
      toVersion: "4.20.0",
      status: "completed",
      startedAt: "2024-02-15 09:15:00",
      completedAt: "2024-02-15 11:08:30",
      duration: "1h 53min",
      updatedBy: "admin@redhat.com",
      notes: "Standard update. Operator updates included.",
      preCheckData: {
        clusterHealth: "Passed",
        apiChanges: 2,
        operatorReadiness: "All compatible"
      }
    },
    {
      id: "update-003",
      fromVersion: "4.19.0",
      toVersion: "4.19.2",
      status: "completed",
      startedAt: "2024-01-20 22:00:00",
      completedAt: "2024-01-20 23:25:45",
      duration: "1h 25min",
      updatedBy: "admin@redhat.com",
      notes: "Security patch update. Completed during maintenance window.",
      preCheckData: {
        clusterHealth: "Passed",
        apiChanges: 0,
        operatorReadiness: "All compatible"
      }
    },
    {
      id: "update-004",
      fromVersion: "4.18.5",
      toVersion: "4.19.0",
      status: "failed",
      startedAt: "2024-01-05 10:30:00",
      completedAt: "2024-01-05 12:15:20",
      duration: "1h 45min (failed)",
      updatedBy: "admin@redhat.com",
      notes: "Update failed due to etcd health check. Rolled back successfully.",
      preCheckData: {
        clusterHealth: "Failed - etcd issues",
        apiChanges: 5,
        operatorReadiness: "Incompatible operator detected"
      }
    },
    {
      id: "update-005",
      fromVersion: "4.18.0",
      toVersion: "4.18.5",
      status: "completed",
      startedAt: "2023-12-12 18:00:00",
      completedAt: "2023-12-12 19:18:30",
      duration: "1h 18min",
      updatedBy: "system",
      notes: "Automated security update.",
      preCheckData: {
        clusterHealth: "Passed",
        apiChanges: 0,
        operatorReadiness: "All compatible"
      }
    }
  ]);

  const handleReview = (record: UpdateRecord) => {
    // Navigate to a comprehensive review page
    navigate(`/administration/cluster-update/history/${record.id}/review`);
    setOpenMenuId(null);
  };

  const handleDownload = (record: UpdateRecord) => {
    // Generate YAML format instead of txt
    const yamlContent = `---
apiVersion: openshift.io/v1
kind: ClusterUpdateReport
metadata:
  name: ${record.id}
  createdAt: "${new Date().toISOString()}"
spec:
  updateID: ${record.id}
  status: ${record.status}
  fromVersion: ${record.fromVersion}
  toVersion: ${record.toVersion}
  timeline:
    started: "${record.startedAt}"
    ${record.completedAt ? `completed: "${record.completedAt}"` : 'status: "In Progress"'}
    duration: "${record.duration || 'N/A'}"
  updatedBy: ${record.updatedBy}
  preChecks:
    clusterHealth: "${record.preCheckData?.clusterHealth || 'N/A'}"
    apiChanges: ${record.preCheckData?.apiChanges || 0}
    operatorReadiness: "${record.preCheckData?.operatorReadiness || 'N/A'}"
  notes: |
    ${record.notes || 'No notes available'}
  reportGenerated: "${new Date().toISOString()}"
`;

    const blob = new Blob([yamlContent], { type: 'application/x-yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cluster-update-${record.id}-${record.fromVersion}-to-${record.toVersion}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setOpenMenuId(null);
  };

  const handleDelete = (recordId: string) => {
    if (confirm("Are you sure you want to delete this update record? This action cannot be undone.")) {
      setRecords(records.filter(r => r.id !== recordId));
      setOpenMenuId(null);
    }
  };

  const toggleMenu = (recordId: string) => {
    setOpenMenuId(openMenuId === recordId ? null : recordId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="size-[16px] text-[#3e8635] dark:text-[#5ba352]" />;
      case "failed":
        return <XCircle className="size-[16px] text-[#c92325] dark:text-[#f5a1a3]" />;
      case "in-progress":
        return <Clock className="size-[16px] text-[#0066cc] dark:text-[#4dabf7]" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)] text-[#3e8635] dark:text-[#81c784] rounded-[999px] text-[12px] font-semibold">
            {getStatusIcon(status)}
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-[#fff4f4] dark:bg-[rgba(201,37,45,0.15)] text-[#c92325] dark:text-[#f5a1a3] rounded-[999px] text-[12px] font-semibold">
            {getStatusIcon(status)}
            Failed
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-[#e7f1fa] dark:bg-[rgba(43,154,243,0.15)] text-[#0066cc] dark:text-[#73bcf7] rounded-[999px] text-[12px] font-semibold">
            {getStatusIcon(status)}
            In Progress
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ocs-app-page-outer h-full min-h-0 overflow-y-auto">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Cluster Settings", path: "/administration/cluster-settings" },
            { label: "Update History" },
          ]}
        >

        <div className="mb-[24px]">
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[16px]">
            Cluster Update
          </h1>
          <div className="flex gap-[24px] text-[14px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <button 
              className="pb-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] hover:text-[#151515] dark:hover:text-white"
              onClick={() => navigate('/administration/cluster-settings')}
            >
              Update plan
            </button>
            <button
              className="pb-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] hover:text-[#151515] dark:hover:text-white"
              onClick={() => navigate('/administration/cluster-update/operators')}
            >
              Cluster operators
            </button>
            <button className="pb-[12px] border-b-2 border-[#0066cc] dark:border-[#4dabf7] font-semibold text-[#151515] dark:text-white -mb-[1px]">
              Update history
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">Total Updates</p>
            <p className="text-[32px] font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium text-[#151515] dark:text-white">
              {records.length}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">Successful Updates</p>
            <p className="text-[32px] font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium text-[#3e8635] dark:text-[#5ba352]">
              {records.filter(r => r.status === "completed").length}
            </p>
          </div>
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">Failed Updates</p>
            <p className="text-[32px] font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium text-[#c92325] dark:text-[#f5a1a3]">
              {records.filter(r => r.status === "failed").length}
            </p>
          </div>
        </div>

        {/* Update History Table */}
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
          <div className="p-[24px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white">
              Update Records
            </h2>
          </div>

          {records.length === 0 ? (
            <div className="p-[48px] text-center">
              <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                No update records found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)]">
                  <tr>
                    <th className="text-left px-[20px] py-[12px] text-[12px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Status
                    </th>
                    <th className="text-left px-[20px] py-[12px] text-[12px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">
                      From Version
                    </th>
                    <th className="text-left px-[20px] py-[12px] text-[12px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">
                      To Version
                    </th>
                    <th className="text-left px-[20px] py-[12px] text-[12px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Started
                    </th>
                    <th className="text-left px-[20px] py-[12px] text-[12px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Duration
                    </th>
                    <th className="text-left px-[20px] py-[12px] text-[12px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Updated By
                    </th>
                    <th className="text-right px-[20px] py-[12px] text-[12px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr
                      key={record.id}
                      className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] last:border-b-0 hover:bg-[rgba(0,0,0,0.01)] dark:hover:bg-[rgba(255,255,255,0.01)]`}
                    >
                      <td className="px-[20px] py-[16px]">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-[20px] py-[16px] text-[14px] text-[#151515] dark:text-white font-semibold">
                        {record.fromVersion}
                      </td>
                      <td className="px-[20px] py-[16px] text-[14px] text-[#151515] dark:text-white font-semibold">
                        {record.toVersion}
                      </td>
                      <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        {record.startedAt}
                      </td>
                      <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        {record.duration || 'N/A'}
                      </td>
                      <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                        {record.updatedBy}
                      </td>
                      <td className="px-[20px] py-[16px] text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => toggleMenu(record.id)}
                            className="p-[8px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[999px] transition-colors"
                          >
                            <MoreVertical className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
                          </button>

                          {openMenuId === record.id && (
                            <>
                              {/* Backdrop to close menu */}
                              <div
                                className="fixed inset-0 z-[9998]"
                                onClick={() => setOpenMenuId(null)}
                              />

                              {/* Menu */}
                              <div className="absolute right-0 top-full mt-[4px] bg-white dark:bg-[#2a2a2a] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] py-[8px] min-w-[160px] z-[9999]">
                                <button
                                  onClick={() => handleReview(record)}
                                  className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] text-left text-[14px] text-[#151515] dark:text-white transition-colors"
                                >
                                  <Eye className="size-[16px]" />
                                  Review
                                </button>
                                <button
                                  onClick={() => handleDownload(record)}
                                  className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] text-left text-[14px] text-[#151515] dark:text-white transition-colors"
                                >
                                  <Download className="size-[16px]" />
                                  Download
                                </button>
                                <div className="h-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] my-[8px]" />
                                <button
                                  onClick={() => handleDelete(record.id)}
                                  className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[rgba(201,37,45,0.1)] dark:hover:bg-[rgba(245,161,163,0.1)] text-left text-[14px] text-[#c92325] dark:text-[#f5a1a3] transition-colors"
                                >
                                  <Trash2 className="size-[16px]" />
                                  Delete
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
          )}
        </div>
        </Breadcrumbs>
    </div>
  );
}