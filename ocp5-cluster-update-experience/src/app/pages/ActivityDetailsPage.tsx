import { Link, useParams } from "react-router";

export default function ActivityDetailsPage() {
  const { id } = useParams();

  const activities = [
    { id: "1", time: "12:52 PM", badge: "P", color: "#009596", text: 'Pulling image "nginx"', namespace: "default", pod: "nginx-deployment-7d89c6f8b-xyz12" },
    { id: "2", time: "12:40 PM", badge: "P", color: "#009596", text: "Back-off restarting failed container", namespace: "robb", pod: "task-pv-pod" },
    { id: "3", time: "12:14 PM", badge: "J", color: "#004080", text: "Job completed", namespace: "default", pod: "batch-job-12345" },
    { id: "4", time: "11:53 PM", badge: "CJ", color: "#2b9af3", text: "Saw completed job: image-pruner-29543040", namespace: "openshift-image-registry", pod: "image-pruner-29543040" },
    { id: "5", time: "11:38 PM", badge: "P", color: "#009596", text: "Created container: image-pruner", namespace: "openshift-image-registry", pod: "image-pruner-29543040-cd4vd" },
    { id: "all", time: "Various", badge: "ALL", color: "#4d4d4d", text: "All Activity Events", namespace: "All namespaces", pod: "Multiple pods" },
  ];

  const activity = activities.find((a) => a.id === id) || activities[0];

  return (
    <div className="ocs-app-page-outer">
      <div className="mb-[24px]">
        <Link to="/" className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal text-[#06c] text-[14px] no-underline hover:opacity-70 transition-opacity">
          ← Back to Home
        </Link>
      </div>
      <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] text-[28px] mb-[24px]">
        Activity Details
      </h1>
      <div className="bg-[rgba(255,255,255,0.5)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[32px]">
        <div className="flex gap-[16px] items-start mb-[32px]">
          <div className="content-stretch flex items-center justify-center relative shrink-0">
            <div
              className="content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[999px] shrink-0"
              style={{ backgroundColor: activity.color }}
            >
              <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[18px] text-white">
                {activity.badge}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[20px] mb-[8px]">
              {activity.text}
            </p>
            <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px] mb-[16px]">
              {activity.time}
            </p>
          </div>
        </div>

        <div className="space-y-[24px]">
          <div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[14px] mb-[8px]">
              Namespace
            </p>
            <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px]">
              {activity.namespace}
            </p>
          </div>

          <div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[14px] mb-[8px]">
              Pod
            </p>
            <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px]">
              {activity.pod}
            </p>
          </div>

          <div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[14px] mb-[8px]">
              Event Type
            </p>
            <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px]">
              {activity.badge === "P" && "Pod Event"}
              {activity.badge === "J" && "Job Event"}
              {activity.badge === "CJ" && "CronJob Event"}
              {activity.badge === "ALL" && "All Events"}
            </p>
          </div>

          <div>
            <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] text-[14px] mb-[8px]">
              Details
            </p>
            <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal text-[#4d4d4d] text-[14px] leading-[1.5]">
              {activity.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
