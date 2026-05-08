import { Link } from "react-router";
import FavoriteButton from "../components/FavoriteButton";

export default function SettingsPage() {
  return (
    <div className="ocs-app-page-outer">
      <div className="mb-[24px]">
        <Link to="/" className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal text-[#06c] text-[14px] no-underline hover:opacity-70 transition-opacity">
          ← Back to Home
        </Link>
      </div>
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] text-[28px]">
          Cluster Settings
        </h1>
        <FavoriteButton name="Cluster Settings" path="/settings" />
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[32px]">
        <div className="space-y-[24px]">
          <div>
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[18px] mb-[8px]">
              General Settings
            </h2>
            <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px]">
              Configure cluster name, version, and update channels.
            </p>
          </div>
          <div className="h-px bg-[#c7c7c7] opacity-25" />
          <div>
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[18px] mb-[8px]">
              Authentication
            </h2>
            <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px]">
              Manage OAuth, identity providers, and authentication methods.
            </p>
          </div>
          <div className="h-px bg-[#c7c7c7] opacity-25" />
          <div>
            <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[18px] mb-[8px]">
              Network Configuration
            </h2>
            <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px]">
              Configure cluster network settings, DNS, and routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
