import { useState } from "react";
import FavoriteButton from "../../components/FavoriteButton";

export default function LimitRangesPage() {
  const limitRanges = [
    {
      name: "core-resource-limits",
      namespace: "default",
      type: "Container",
      maxCpu: "2 cores",
      maxMemory: "4Gi",
      defaultCpu: "500m",
      defaultMemory: "512Mi",
    },
    {
      name: "pod-limits",
      namespace: "my-application",
      type: "Pod",
      maxCpu: "4 cores",
      maxMemory: "8Gi",
      defaultCpu: "1 core",
      defaultMemory: "1Gi",
    },
  ];

  return (
    <div className="ocs-app-page-outer">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
          LimitRanges
        </h1>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="LimitRanges" path="/administration/limit-ranges" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold transition-colors">
            Create LimitRange
          </button>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[48px]">
        <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] dark:text-[#b0b0b0] text-[16px] mb-[24px]">
          LimitRanges define minimum, maximum, and default values for compute resources in a namespace.
        </p>
        <div className="space-y-[16px]">
          {limitRanges.map((limitRange) => (
            <div
              key={limitRange.name}
              className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[16px] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-start justify-between mb-[16px]">
                <div>
                  <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px] mb-[4px]">
                    {limitRange.name}
                  </h3>
                  <div className="flex gap-[16px] text-[14px]">
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Namespace: <span className="font-semibold">{limitRange.namespace}</span>
                    </p>
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0]">
                      Type: <span className="font-semibold">{limitRange.type}</span>
                    </p>
                  </div>
                </div>
                <button className="text-[#0066cc] dark:text-[#4dabf7] hover:underline font-semibold text-[14px]">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="space-y-[12px]">
                  <div className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px]">
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[12px] mb-[4px]">Max CPU</p>
                    <p className="font-semibold text-[#151515] dark:text-white text-[16px]">{limitRange.maxCpu}</p>
                  </div>
                  <div className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px]">
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[12px] mb-[4px]">Default CPU</p>
                    <p className="font-semibold text-[#151515] dark:text-white text-[16px]">{limitRange.defaultCpu}</p>
                  </div>
                </div>
                <div className="space-y-[12px]">
                  <div className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px]">
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[12px] mb-[4px]">Max Memory</p>
                    <p className="font-semibold text-[#151515] dark:text-white text-[16px]">{limitRange.maxMemory}</p>
                  </div>
                  <div className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px]">
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[12px] mb-[4px]">Default Memory</p>
                    <p className="font-semibold text-[#151515] dark:text-white text-[16px]">{limitRange.defaultMemory}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}