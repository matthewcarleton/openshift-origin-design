import { useState } from "react";
import FavoriteButton from "../../components/FavoriteButton";

export default function ResourceQuotasPage() {
  const quotas = [
    { name: "compute-quota", namespace: "default", cpu: "10 cores", memory: "20Gi", pods: "50" },
    { name: "storage-quota", namespace: "my-application", cpu: "5 cores", memory: "10Gi", pods: "25" },
    { name: "dev-quota", namespace: "development", cpu: "8 cores", memory: "16Gi", pods: "40" },
  ];

  return (
    <div className="ocs-app-page-outer">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
          ResourceQuotas
        </h1>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="ResourceQuotas" path="/administration/resource-quotas" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold transition-colors">
            Create ResourceQuota
          </button>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[48px]">
        <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] dark:text-[#b0b0b0] text-[16px] mb-[24px]">
          ResourceQuotas provide constraints that limit aggregate resource consumption per namespace.
        </p>
        <div className="space-y-[16px]">
          {quotas.map((quota) => (
            <div
              key={quota.name}
              className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[16px] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-start justify-between mb-[16px]">
                <div>
                  <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px] mb-[4px]">
                    {quota.name}
                  </h3>
                  <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[14px]">
                    Namespace: <span className="font-semibold">{quota.namespace}</span>
                  </p>
                </div>
                <button className="text-[#0066cc] dark:text-[#4dabf7] hover:underline font-semibold text-[14px]">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-[16px]">
                <div className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px]">
                  <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[12px] mb-[4px]">CPU Limit</p>
                  <p className="font-semibold text-[#151515] dark:text-white text-[16px]">{quota.cpu}</p>
                </div>
                <div className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px]">
                  <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[12px] mb-[4px]">Memory Limit</p>
                  <p className="font-semibold text-[#151515] dark:text-white text-[16px]">{quota.memory}</p>
                </div>
                <div className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px]">
                  <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[12px] mb-[4px]">Max Pods</p>
                  <p className="font-semibold text-[#151515] dark:text-white text-[16px]">{quota.pods}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}