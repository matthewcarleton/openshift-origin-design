import { Link } from "react-router";
import { Package, ListChecks, AlertTriangle } from "@/lib/pfIcons";
import FavoriteButton from "../components/FavoriteButton";

export default function EcosystemPage() {
  return (
    <div className="ocs-app-page-outer">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
          Ecosystem
        </h1>
        <FavoriteButton name="Ecosystem" path="/ecosystem" />
      </div>

      {/* Cluster update dependency banner */}
      <div className="mb-[24px] bg-[#fef6e6] dark:bg-[rgba(240,171,0,0.1)] border-l-4 border-[#f0ab00] dark:border-[#f4c145] rounded-[8px] p-[16px]">
        <div className="flex items-start gap-[12px]">
          <AlertTriangle className="size-[20px] text-[#f0ab00] dark:text-[#f4c145] shrink-0 mt-[2px]" />
          <div className="flex-1">
            <p className="text-[14px] text-[#151515] dark:text-white font-semibold mb-[4px]">
              2 operator updates required for cluster update
            </p>
            <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
              Abot Operator and Airflow Helm Operator must be updated before the cluster can update to 4.22.0.
            </p>
            <div className="flex gap-[12px]">
              <Link
                to="/ecosystem/installed-operators"
                className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline no-underline font-semibold"
              >
                View installed software
              </Link>
              <Link
                to="/administration/cluster-settings"
                className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline no-underline font-semibold"
              >
                View cluster settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[16px]">
        <Link to="/ecosystem/software-catalog" className="no-underline">
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)] transition-shadow cursor-pointer">
            <Package className="size-[24px] text-[#0066cc] dark:text-[#4dabf7] mb-[16px]" />
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[16px] text-[#151515] dark:text-white mb-[8px]">
              Software Catalog
            </h2>
            <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
              Browse and install operators, extensions, and integrations.
            </p>
          </div>
        </Link>

        <Link to="/ecosystem/installed-operators" className="no-underline">
          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)] transition-shadow cursor-pointer">
            <ListChecks className="size-[24px] text-[#0066cc] dark:text-[#4dabf7] mb-[16px]" />
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[16px] text-[#151515] dark:text-white mb-[8px]">
              Installed Operators
            </h2>
            <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
              Manage installed operators and schedule updates. <span className="text-[#0066cc] dark:text-[#4dabf7] font-semibold">4 updates available</span>
            </p>
          </div>
        </Link>


      </div>
    </div>
  );
}