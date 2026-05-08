import { Link } from "react-router";
import svgPaths from "../../imports/svg-929lpcd05l";
import FavoriteButton from "../components/FavoriteButton";

export default function AlertsPage() {
  const alerts = [
    {
      severity: "warning",
      name: "CannotRetrieveUpdates",
      time: "Mar 3, 2026, 10:37 AM",
      description: "Failure to retrieve updates means that cluster administrators will need to monitor for available updates on their own or risk falling behind on security or other bugfixes.",
    },
    {
      severity: "warning",
      name: "AlertmanagerReceiversNotConfigured",
      time: "Mar 3, 2026, 10:36 AM",
      description: "Alerts are not configured to be sent to a notification system, meaning that you may not be notified in a timely fashion when important failures occur.",
    },
  ];

  return (
    <div className="ocs-app-page-outer">
      <div className="mb-[24px]">
        <Link to="/" className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal text-[#06c] text-[14px] no-underline hover:opacity-70 transition-opacity">
          ← Back to Home
        </Link>
      </div>
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] text-[28px]">
          Cluster Alerts
        </h1>
        <FavoriteButton name="Cluster Alerts" path="/alerts" />
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[32px]">
        <div className="space-y-[24px]">
          {alerts.map((alert, index) => (
            <div key={index}>
              <div className="flex gap-[16px] items-start">
                <div className="overflow-clip relative shrink-0 size-[20px] mt-1">
                  <div className="absolute inset-[3.13%_-0.07%_6.25%_0]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0113 14.5">
                      <path d={svgPaths.p212c7270} fill="var(--fill-0, #FFCC17)" id="Vector" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-[8px]">
                    <div>
                      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[16px] mb-[4px]">
                        {alert.name}
                      </p>
                      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal text-[#4d4d4d] text-[12px]">
                        {alert.time}
                      </p>
                    </div>
                    {alert.name === "AlertmanagerReceiversNotConfigured" && (
                      <a href="https://docs.openshift.com/container-platform/latest/monitoring/configuring-the-monitoring-stack.html" target="_blank" rel="noopener noreferrer" className="[text-decoration-skip-ink:none] decoration-solid font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] text-[#06c] text-[14px] underline whitespace-nowrap hover:opacity-70 transition-opacity">
                        Configure
                      </a>
                    )}
                  </div>
                  <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[1.5] text-[#4d4d4d] text-[14px]">
                    {alert.description}
                  </p>
                </div>
              </div>
              {index < alerts.length - 1 && <div className="h-px bg-[#c7c7c7] opacity-25 mt-[24px]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}