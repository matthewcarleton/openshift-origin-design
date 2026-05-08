import { Link } from "react-router";
import svgPaths from "../../imports/svg-929lpcd05l";

export default function ClusterInventoryPage() {
  const inventoryItems = [
    { label: "Nodes", badge: "N", color: "#8476d1", count: 6, description: "Worker and master nodes in the cluster" },
    { label: "Pods", badge: "P", color: "#009596", count: 273, description: "Running application containers" },
    { label: "Deployments", badge: "D", color: "#004080", count: 42, description: "Deployment configurations" },
    { label: "Services", badge: "S", color: "#2b9af3", count: 58, description: "Service endpoints" },
    { label: "StorageClasses", badge: "SC", color: "#2b9af3", count: 2, description: "Available storage classes" },
    { label: "PersistentVolumeClaims", badge: "PVC", color: "#2b9af3", count: 0, description: "Persistent volume claims" },
    { label: "ConfigMaps", badge: "CM", color: "#009596", count: 87, description: "Configuration data" },
    { label: "Secrets", badge: "SEC", color: "#8476d1", count: 63, description: "Sensitive data storage" },
  ];

  return (
    <div className="ocs-app-page-outer">
      <div className="mb-[24px]">
        <Link to="/" className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal text-[#06c] text-[14px] no-underline hover:opacity-70 transition-opacity">
          ← Back to Home
        </Link>
      </div>
      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="overflow-clip relative shrink-0 size-[24px]">
          <div className="absolute inset-[3.13%_6.25%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 18.75">
              <path d={svgPaths.p1ef87c00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
            </svg>
          </div>
        </div>
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] text-[28px]">
          Cluster Inventory
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-[24px]">
        {inventoryItems.map((item, index) => (
          <div key={index} className="bg-[rgba(255,255,255,0.5)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[32px]">
            <div className="flex items-start justify-between mb-[16px]">
              <div className="flex gap-[16px] items-center">
                <div
                  className="content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[999px] shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[16px] text-white">
                    {item.badge}
                  </p>
                </div>
                <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] text-[#151515] text-[18px]">
                  {item.label}
                </p>
              </div>
              <div className="bg-[#e0e0e0] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[999px] shrink-0">
                <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] text-[#151515] text-[20px]">
                  {item.count}
                </p>
              </div>
            </div>
            <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
