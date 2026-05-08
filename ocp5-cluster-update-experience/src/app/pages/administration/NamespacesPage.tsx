import { useState } from "react";
import FavoriteButton from "../../components/FavoriteButton";

export default function NamespacesPage() {
  const namespaces = [
    { name: "default", status: "Active", pods: 12, age: "45d" },
    { name: "kube-system", status: "Active", pods: 28, age: "45d" },
    { name: "kube-public", status: "Active", pods: 2, age: "45d" },
    { name: "openshift-console", status: "Active", pods: 6, age: "45d" },
    { name: "openshift-monitoring", status: "Active", pods: 15, age: "45d" },
    { name: "my-application", status: "Active", pods: 8, age: "12d" },
  ];

  return (
    <div className="ocs-app-page-outer">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
          Namespaces
        </h1>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Namespaces" path="/administration/namespaces" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold transition-colors">
            Create Namespace
          </button>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[32px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Name
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Status
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Pods
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Age
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {namespaces.map((ns, index) => (
                <tr
                  key={ns.name}
                  className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors ${
                    index === namespaces.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-[16px] px-[16px] font-['Red_Hat_Text:Medium',sans-serif] font-medium text-[#151515] dark:text-white">
                    {ns.name}
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <span className="bg-[#3e8635] text-white px-[12px] py-[4px] rounded-[999px] text-[13px] font-semibold">
                      {ns.status}
                    </span>
                  </td>
                  <td className="py-[16px] px-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">{ns.pods}</td>
                  <td className="py-[16px] px-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">{ns.age}</td>
                  <td className="py-[16px] px-[16px]">
                    <button className="text-[#0066cc] dark:text-[#4dabf7] hover:underline font-semibold text-[14px]">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}