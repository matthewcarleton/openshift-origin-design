import { useState } from "react";
import FavoriteButton from "../../components/FavoriteButton";

export default function DynamicPluginsPage() {
  const plugins = [
    {
      name: "console-plugin-template",
      version: "1.2.0",
      status: "Enabled",
      description: "Example console plugin with custom navigation",
    },
    {
      name: "monitoring-plugin",
      version: "2.0.1",
      status: "Enabled",
      description: "Enhanced monitoring and metrics visualization",
    },
    {
      name: "topology-plugin",
      version: "1.5.3",
      status: "Enabled",
      description: "Advanced topology view with custom visualizations",
    },
    {
      name: "dev-console-plugin",
      version: "3.1.0",
      status: "Disabled",
      description: "Developer-focused console enhancements",
    },
  ];

  return (
    <div className="ocs-app-page-outer">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
          Dynamic Plugins
        </h1>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="Dynamic Plugins" path="/administration/dynamic-plugins" />
          <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold transition-colors">
            Install Plugin
          </button>
        </div>
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[48px]">
        <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] dark:text-[#b0b0b0] text-[16px] mb-[24px]">
          Dynamic plugins extend the OpenShift Console functionality without requiring a rebuild.
        </p>
        <div className="space-y-[16px]">
          {plugins.map((plugin) => (
            <div
              key={plugin.name}
              className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[16px] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-[12px] mb-[8px]">
                    <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px]">
                      {plugin.name}
                    </h3>
                    <span className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[14px]">v{plugin.version}</span>
                    <span
                      className={`px-[12px] py-[4px] rounded-[999px] text-[13px] font-semibold ${
                        plugin.status === "Enabled"
                          ? "bg-[#3e8635] text-white"
                          : "bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] text-[#4d4d4d] dark:text-[#b0b0b0]"
                      }`}
                    >
                      {plugin.status}
                    </span>
                  </div>
                  <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[14px] mb-[16px]">{plugin.description}</p>
                  <div className="flex gap-[12px]">
                    <button
                      className={`px-[16px] py-[8px] rounded-[8px] font-semibold text-[14px] transition-colors ${
                        plugin.status === "Enabled"
                          ? "bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.15)]"
                          : "bg-[#0066cc] dark:bg-[#4dabf7] text-white hover:bg-[#004080] dark:hover:bg-[#339af0]"
                      }`}
                    >
                      {plugin.status === "Enabled" ? "Disable" : "Enable"}
                    </button>
                    <button className="px-[16px] py-[8px] rounded-[8px] font-semibold text-[14px] bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.15)] transition-colors">
                      Configure
                    </button>
                    <button className="px-[16px] py-[8px] rounded-[8px] font-semibold text-[14px] text-[#c9190b] dark:text-[#ff6b6b] hover:bg-[rgba(201,25,11,0.1)] dark:hover:bg-[rgba(255,107,107,0.1)] transition-colors">
                      Uninstall
                    </button>
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