export default function ClusterUpdatePage() {
  return (
    <div className="ocs-app-page-outer">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
          Cluster Update
        </h1>
      </div>
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] p-[48px]">
        <div className="mb-[32px]">
          <div className="flex items-center justify-between mb-[16px]">
            <div>
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[20px] mb-[8px]">
                Current Version
              </h2>
              <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[16px]">4.14.8</p>
            </div>
            <div className="bg-[#3e8635] px-[16px] py-[8px] rounded-[8px]">
              <p className="text-white text-[14px] font-semibold">Up to date</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] pt-[32px]">
          <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px] mb-[16px]">
            Update Channel
          </h3>
          <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[20px] border-2 border-[#0066cc] dark:border-[#4dabf7]">
              <p className="font-semibold text-[#151515] dark:text-white mb-[4px]">stable-4.14</p>
              <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px]">Recommended</p>
            </div>
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] cursor-pointer hover:border-[#0066cc] dark:hover:border-[#4dabf7] transition-colors">
              <p className="font-semibold text-[#151515] dark:text-white mb-[4px]">fast-4.14</p>
              <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px]">Latest features</p>
            </div>
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] cursor-pointer hover:border-[#0066cc] dark:hover:border-[#4dabf7] transition-colors">
              <p className="font-semibold text-[#151515] dark:text-white mb-[4px]">eus-4.14</p>
              <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px]">Extended support</p>
            </div>
          </div>
          
          <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px] mb-[16px]">
            Update History
          </h3>
          <div className="space-y-[12px]">
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[16px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#151515] dark:text-white">4.14.8</p>
                  <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px]">Updated on March 8, 2026</p>
                </div>
                <div className="bg-[#3e8635] px-[12px] py-[4px] rounded-[999px]">
                  <p className="text-white text-[12px]">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[16px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#151515] dark:text-white">4.14.5</p>
                  <p className="text-[#4d4d4d] dark:text-[#b0b0b0] text-[13px]">Updated on February 15, 2026</p>
                </div>
                <div className="bg-[#3e8635] px-[12px] py-[4px] rounded-[999px]">
                  <p className="text-white text-[12px]">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}