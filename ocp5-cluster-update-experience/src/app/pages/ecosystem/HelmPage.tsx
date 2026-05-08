import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

export default function HelmPage() {
  return (
    <div className="ocs-app-page-outer h-full min-h-0 overflow-y-auto">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Ecosystem", path: "/ecosystem" },
            { label: "Helm" },
          ]}
        >

        <div className="mb-[24px]">
          <div className="flex items-center justify-between mb-[8px]">
            <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
              Helm
            </h1>
            <FavoriteButton name="Helm" path="/ecosystem/helm" />
          </div>
          <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Discover and install Helm charts from the integrated chart repositories.
          </p>
        </div>

        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[48px] text-center border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Helm charts management coming soon
          </p>
        </div>
        </Breadcrumbs>
    </div>
  );
}