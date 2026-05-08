import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { ArrowLeft, CheckCircle, Loader2 } from "@/lib/pfIcons";

const checks = [
  { name: "Cluster version operator", description: "Verify CVO health" },
  { name: "API server availability", description: "Check kube-apiserver readiness" },
  { name: "etcd cluster health", description: "Verify etcd quorum and disk latency" },
  { name: "Node readiness", description: "All 15 nodes reporting Ready" },
  { name: "Pod disruption budgets", description: "Validate PDBs allow drain" },
  { name: "Persistent volume claims", description: "Check PVC binding" },
  { name: "Network policy validation", description: "Verify CNI compatibility" },
];

export default function PreflightChecksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const version = (location.state as any)?.version || new URLSearchParams(location.search).get("version") || "5.1.10";
  const [running, setRunning] = useState(false);
  const [completedIndex, setCompletedIndex] = useState(-1);
  const allDone = completedIndex >= checks.length - 1;

  const runChecks = () => {
    setRunning(true);
    setCompletedIndex(-1);
  };

  useEffect(() => {
    if (!running || allDone) return;
    const timer = setTimeout(() => {
      setCompletedIndex((prev) => prev + 1);
    }, 600);
    return () => clearTimeout(timer);
  }, [running, completedIndex, allDone]);

  return (
    <div className="ocs-app-page-outer ocs-app-page-outer--end-3xl">
      <Link to={`/administration/cluster-update/version/${version}`} className="flex items-center gap-[6px] text-[#0066cc] dark:text-[#4dabf7] text-[14px] no-underline hover:underline mb-[16px] font-['Red_Hat_Text:Regular',sans-serif]">
        <ArrowLeft className="size-[16px]" /> Back to version detail
      </Link>

      <h1 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[28px] mb-[4px]">
        Pre-Checks &mdash; {version}
      </h1>
      <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[14px] mb-[24px] font-['Red_Hat_Text:Regular',sans-serif]">
        Validating cluster readiness before initiating the update.
      </p>

      <div className="rounded-[16px] border border-[#e0e0e0] dark:border-[rgba(255,255,255,0.1)] p-[24px]">
        {!running && (
          <button
            onClick={runChecks}
            className="bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] text-[#151515] dark:text-white px-[20px] py-[10px] rounded-[8px] cursor-pointer text-[14px] font-['Red_Hat_Text:Regular',sans-serif] font-semibold hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.08)] transition-colors mb-[24px]"
          >
            Run checks
          </button>
        )}

        {running && (
          <div className="flex flex-col gap-0">
            {checks.map((check, i) => {
              const passed = i <= completedIndex;
              const isRunning = i === completedIndex + 1 && !allDone;
              const pending = i > completedIndex + 1 || (!allDone && i > completedIndex);

              return (
                <div key={i} className="flex items-start gap-[16px]">
                  {/* Vertical connector + icon */}
                  <div className="flex flex-col items-center">
                    {i > 0 && (
                      <div className={`w-[2px] h-[16px] ${passed || isRunning ? "bg-[#3e8635]" : "bg-[#d2d2d2] dark:bg-[rgba(255,255,255,0.15)]"}`} />
                    )}
                    <div className="shrink-0">
                      {passed ? (
                        <CheckCircle className="size-[24px] text-[#3e8635]" />
                      ) : isRunning ? (
                        <Loader2 className="size-[24px] text-[#0066cc] animate-spin" />
                      ) : (
                        <div className="size-[24px] rounded-full border-2 border-[#d2d2d2] dark:border-[rgba(255,255,255,0.2)]" />
                      )}
                    </div>
                    {i < checks.length - 1 && (
                      <div className={`w-[2px] h-[16px] ${passed ? "bg-[#3e8635]" : "bg-[#d2d2d2] dark:bg-[rgba(255,255,255,0.15)]"}`} />
                    )}
                  </div>

                  {/* Text */}
                  <div className="pt-[2px] pb-[8px]">
                    {i > 0 && <div className="h-[16px]" />}
                    <p className={`font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[14px] ${
                      passed ? "text-[#151515] dark:text-white" : isRunning ? "text-[#0066cc] dark:text-[#4dabf7]" : "text-[#8a8d90] dark:text-[#6a6a6a]"
                    }`}>
                      {check.name}
                    </p>
                    <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px] font-['Red_Hat_Text:Regular',sans-serif]">{check.description}</p>
                    {i < checks.length - 1 && <div className="h-[16px]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {allDone && (
          <div className="mt-[24px] flex items-center gap-[16px]">
            <div className="flex items-center gap-[8px] bg-[rgba(62,134,53,0.1)] rounded-[8px] px-[16px] py-[10px]">
              <CheckCircle className="size-[18px] text-[#3e8635]" />
              <span className="text-[#3e8635] text-[14px] font-['Red_Hat_Text:Regular',sans-serif] font-semibold">All checks passed</span>
            </div>
            <button
              onClick={() => navigate("/administration/cluster-update/in-progress", { state: { version } })}
              className="bg-[#0066cc] hover:bg-[#004080] text-white border-0 px-[20px] py-[10px] rounded-[8px] cursor-pointer text-[14px] font-['Red_Hat_Text:Regular',sans-serif] font-semibold transition-colors"
            >
              Begin update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}