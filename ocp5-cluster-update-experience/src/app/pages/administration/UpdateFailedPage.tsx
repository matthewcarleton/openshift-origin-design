import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { XCircle, Sparkles } from "@/lib/pfIcons";

export default function UpdateFailedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const version = (location.state as any)?.version || "5.1.10";

  useEffect(() => {
    localStorage.removeItem("clusterUpdateInProgress");
  }, []);

  return (
    <div className="ocs-app-page-outer ocs-app-page-outer--end-3xl">
      {/* Failure Banner */}
      <div className="flex flex-col items-center justify-center py-[48px] mb-[32px]">
        <div className="size-[72px] rounded-full bg-[rgba(201,25,11,0.1)] flex items-center justify-center mb-[20px]">
          <XCircle className="size-[40px] text-[#c9190b]" />
        </div>
        <h1 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[28px] mb-[8px] text-center">
          Update Failed
        </h1>
        <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[16px] font-['Red_Hat_Text:Regular',sans-serif] text-center max-w-[520px]">
          The update to {version} was interrupted. Your cluster has been safely rolled back to 5.0.0.
        </p>
      </div>

      {/* Failure Details Card */}
      <div className="rounded-[16px] border border-[#e0e0e0] dark:border-[rgba(255,255,255,0.1)] p-[24px] mb-[24px] max-w-[640px] mx-auto">
        <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px] mb-[16px]">Failure Details</h2>
        <div className="flex flex-col gap-[14px]">
          <Row label="Failed at" value="Worker node rollout (worker-7)" />
          <Row label="Error" value="MachineConfigPool degraded, node drain timeout" valueColor="#c9190b" />
          <Row label="Root cause" value={'PDB "billing-api-pdb" blocked eviction (maxUnavailable: 0)'} />
          <Row label="Rollback status" value="Complete — cluster restored to 5.0.0" valueColor="#3e8635" />
        </div>
      </div>

      {/* OLS Recommendation Card */}
      <div className="max-w-[640px] mx-auto rounded-[16px] p-[2px] bg-gradient-to-r from-[#6753ac] via-[#0066cc] to-[#009596] mb-[32px]">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[14px] p-[24px]">
          <div className="flex items-start gap-[12px] mb-[16px]">
            <div className="size-[32px] rounded-full bg-gradient-to-r from-[#6753ac] to-[#0066cc] flex items-center justify-center shrink-0">
              <Sparkles className="size-[16px] text-white" />
            </div>
            <div>
              <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[8px]">OLS Recommendation</h3>
              <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[14px] font-['Red_Hat_Text:Regular',sans-serif] leading-[1.5]">
                The PodDisruptionBudget <code className="bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] px-[4px] py-[1px] rounded text-[13px] font-['Red_Hat_Mono:Regular',sans-serif]">billing-api-pdb</code> has <code className="bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] px-[4px] py-[1px] rounded text-[13px] font-['Red_Hat_Mono:Regular',sans-serif]">maxUnavailable: 0</code>, which prevents node drain during rolling updates. Setting it temporarily to <code className="bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] px-[4px] py-[1px] rounded text-[13px] font-['Red_Hat_Mono:Regular',sans-serif]">maxUnavailable: 1</code> will allow the update to proceed while maintaining service availability.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[12px] ml-[44px]">
            <button
              onClick={() => { localStorage.setItem("clusterUpdateInProgress", JSON.stringify({ version, startedAt: Date.now() })); navigate("/administration/cluster-update/in-progress", { state: { version } }); }}
              className="bg-[#0066cc] hover:bg-[#004080] text-white border-0 px-[20px] py-[10px] rounded-[8px] cursor-pointer text-[14px] font-['Red_Hat_Text:Regular',sans-serif] font-semibold transition-colors"
            >
              Apply fix & retry
            </button>
            <button className="bg-transparent border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] text-[#151515] dark:text-white px-[20px] py-[10px] rounded-[8px] cursor-pointer text-[14px] font-['Red_Hat_Text:Regular',sans-serif] font-semibold hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              View CLI command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-start justify-between py-[4px] border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] last:border-0 gap-[24px]">
      <span className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[14px] font-['Red_Hat_Text:Regular',sans-serif] shrink-0">{label}</span>
      <span
        className={`text-[14px] font-['Red_Hat_Text:Regular',sans-serif] text-right ${!valueColor ? 'text-[#151515] dark:text-white' : ''}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  );
}