import { useState } from "react";
import FavoriteButton from "../../components/FavoriteButton";

export default function CustomResourceDefinitionsPage() {
  const crds = [
    {
      name: "deployments.apps",
      group: "apps",
      version: "v1",
      scope: "Namespaced",
      kind: "Deployment",
    },
    {
      name: "services.core",
      group: "core",
      version: "v1",
      scope: "Namespaced",
      kind: "Service",
    },
    {
      name: "routes.route.openshift.io",
      group: "route.openshift.io",
      version: "v1",
      scope: "Namespaced",
      kind: "Route",
    },
    {
      name: "clusterserviceversions.operators.coreos.com",
      group: "operators.coreos.com",
      version: "v1alpha1",
      scope: "Namespaced",
      kind: "ClusterServiceVersion",
    },
    {
      name: "prometheuses.monitoring.coreos.com",
      group: "monitoring.coreos.com",
      version: "v1",
      scope: "Namespaced",
      kind: "Prometheus",
    },
  ];

  return (
    <div className="ocs-app-page-outer">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
          CustomResourceDefinitions
        </h1>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="CustomResourceDefinitions" path="/administration/custom-resource-definitions" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold transition-colors">
            Create CRD
          </button>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[32px]">
        <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] dark:text-[#b0b0b0] text-[16px] mb-[24px]">
          CustomResourceDefinitions extend the Kubernetes API to support custom resource types.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Name
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Group
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Version
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Scope
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Kind
                </th>
                <th className="text-left py-[16px] px-[16px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[14px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {crds.map((crd, index) => (
                <tr
                  key={crd.name}
                  className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors ${
                    index === crds.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="py-[16px] px-[16px] font-['Red_Hat_Text:Medium',sans-serif] font-medium text-[#151515] dark:text-white">
                    {crd.name}
                  </td>
                  <td className="py-[16px] px-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">{crd.group}</td>
                  <td className="py-[16px] px-[16px]">
                    <span className="bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] px-[8px] py-[4px] rounded-[999px] text-[13px] font-semibold text-[#151515] dark:text-white">
                      {crd.version}
                    </span>
                  </td>
                  <td className="py-[16px] px-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">{crd.scope}</td>
                  <td className="py-[16px] px-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">{crd.kind}</td>
                  <td className="py-[16px] px-[16px]">
                    <button className="text-[#0066cc] dark:text-[#4dabf7] hover:underline font-semibold text-[14px]">
                      View
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