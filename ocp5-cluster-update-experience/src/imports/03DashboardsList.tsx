import svgPaths from "./svg-98k82gpx98";
import img03DashboardsList from "figma:asset/0063c8b2c924b83b2301cb4476c9f3da3f438e88.png";
import imgDots5X5Pink1 from "figma:asset/6acd1121226888e7c74cf5e50f4bc97a45723314.png";
import imgCodeBlackR1 from "figma:asset/68e30c613d38d047f7aa03749ba333083dfa1f93.png";
import imgAppsLeft1 from "figma:asset/0d40235a80a695badf3fddcf7f1e71231b6400c0.png";
import imgCloudBlob02Dark1 from "figma:asset/f2888f0b04f9a772cf6d5fae7c108b82af90ae55.png";
import imgCursorWhiteS1 from "figma:asset/50c656736ef6b9fc53ec4260e54cc14a6e7f3416.png";
import { imgGroup } from "./svg-21wsi";

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="[text-decoration-skip-ink:none] decoration-solid font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#06c] text-[12px] underline whitespace-nowrap">Dashboards</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
      <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.08px)] size-[12px] top-[calc(50%-0.25px)]" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8419 7.50208">
            <path d={svgPaths.p2c283a00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Project Resource Overview</p>
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] relative shrink-0 text-[#151515] text-[28px] w-full">Project Resource Overview</p>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] w-full">View and manage dashboards</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-star">
        <div className="absolute inset-[6.25%_2.52%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.1948 14">
            <path d={svgPaths.p2f016100} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex gap-[16px] items-center opacity-0 relative shrink-0">
      <Frame2 />
      <div className="bg-[#06c] content-stretch flex gap-[4px] items-center justify-center px-[24px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
        <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Create</p>
      </div>
    </div>
  );
}

function Meta() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Meta">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-save">
        <div className="absolute inset-[6.25%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
            <path d={svgPaths.p81f4900} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Save</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#06c] content-stretch flex h-[40px] items-center mix-blend-luminosity px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
      <Meta />
    </div>
  );
}

function Meta1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Meta">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">Cancel</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center mix-blend-luminosity px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#06c] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <Meta1 />
    </div>
  );
}

function ToolbarAction() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Toolbar Action">
      <Button />
      <Button1 />
    </div>
  );
}

function Primary() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Primary">
      <ToolbarAction />
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex h-[60px] items-center justify-between relative shrink-0 w-full">
      <Frame91 />
      <Frame92 />
      <Primary />
    </div>
  );
}

function Meta2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Meta">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-add">
        <div className="absolute inset-[6.25%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
            <path d={svgPaths.p353fb200} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Add widget</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#06c] content-stretch flex gap-[16px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
      <Meta2 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="nav-arrow-down">
        <div className="absolute bottom-[37.5%] flex items-center justify-center left-1/4 right-1/4 top-[37.5%]">
          <div className="-rotate-90 flex-none h-[12px] w-[6px]">
            <div className="relative size-full" data-name="Vector">
              <div className="absolute inset-[-9.38%_-18.75%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.5 9.5">
                  <path d={svgPaths.p2052b680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Meta">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-ai-experience">
        <div className="absolute inset-[4.67%_4.68%_3.13%_3.11%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4417 18.4399">
            <path d={svgPaths.pfdf4c80} fill="var(--fill-0, #0066CC)" id="icon" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">Ask AI</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#06c] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <Meta3 />
    </div>
  );
}

function ToolbarAction1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Toolbar Action">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Primary1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Primary">
      <ToolbarAction1 />
    </div>
  );
}

function Meta4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Meta">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-calendar">
        <div className="absolute inset-[6.25%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.4999">
            <path d={svgPaths.p1cf12d00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Last 30 min</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
      <Meta4 />
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-down">
        <div className="absolute bottom-[26.04%] left-[5%] right-[5%] top-1/4" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.8 5.87523">
            <path d={svgPaths.p3cf27e80} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Tooltip() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#3f3f46] content-stretch flex items-center justify-center left-1/2 opacity-0 px-[8px] py-[4px] rounded-[4px] top-[calc(50%+32px)]" data-name="Tooltip">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Display time range</p>
    </div>
  );
}

function DisplayTimeRangeAction() {
  return (
    <div className="bg-[rgba(199,199,199,0.25)] content-stretch flex gap-[4px] items-center relative rounded-[999px] shrink-0" data-name="Display Time Range Action">
      <Button4 />
      <Tooltip />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-refresh">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.75 18.75">
            <path d={svgPaths.pd5a0e80} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Refresh</p>
    </div>
  );
}

function ManualRefreshAction() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Manual Refresh Action">
      <Button5 />
    </div>
  );
}

function Meta5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Meta">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">10 sec</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
      <Meta5 />
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-down">
        <div className="absolute bottom-[26.04%] left-[5%] right-[5%] top-1/4" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.8 5.87523">
            <path d={svgPaths.p3cf27e80} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function AutoRefreshAction() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Auto Refresh Action">
      <Button6 />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#3f3f46] content-stretch flex items-center justify-center left-1/2 opacity-0 px-[8px] py-[4px] rounded-[4px] top-[calc(50%+32px)]" data-name="Tooltip">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">Auto refresh</p>
      </div>
    </div>
  );
}

function Refresh() {
  return (
    <div className="bg-[rgba(199,199,199,0.25)] content-stretch flex gap-[4px] items-center relative rounded-[999px] shrink-0" data-name="Refresh">
      <ManualRefreshAction />
      <div className="flex h-[20px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="h-0 opacity-25 relative w-[20px]" data-name="Separator">
            <div className="absolute bottom-full left-0 right-0 top-0" data-name="Line">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                  <line id="Line" stroke="var(--stroke-0, #D1D5DC)" x2="20" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AutoRefreshAction />
    </div>
  );
}

function Secondary() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Secondary">
      <DisplayTimeRangeAction />
      <Refresh />
    </div>
  );
}

function ArtifactToolbarDashboard() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative rounded-[999px] shrink-0 w-full" data-name="Artifact Toolbar - Dashboard">
      <Primary1 />
      <Secondary />
    </div>
  );
}

function TitleBlock() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 text-center w-full" data-name="Title block">
      <p className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[26px] relative shrink-0 text-[#151515] text-[20px] w-full">This dashboard is empty</p>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#4d4d4d] text-[14px] w-full">Add widgets and sections from the toolbar, or ask AI to build them based on your project needs.</p>
    </div>
  );
}

function Content() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[24px] w-full" data-name="Content">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-dashed inset-0 pointer-events-none rounded-[24px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[48px] items-center justify-center pb-[64px] relative size-full">
          <div className="h-[256px] relative shrink-0 w-[338.301px]" data-name="Illustration - Dark">
            <div className="absolute inset-[16.64%_0_42.33%_68.95%]" data-name="Dots_5x5_Pink 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgDots5X5Pink1} />
            </div>
            <div className="absolute inset-[56.38%_14.43%_8.24%_16.5%] rounded-bl-[64px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[64px]" style={{ backgroundImage: "linear-gradient(111.234deg, rgb(238, 0, 0) 0%, rgb(61, 39, 133) 99.987%)" }} />
            <div className="absolute bg-[rgba(0,0,0,0.48)] blur-[16px] inset-[56.72%_48.89%_12.87%_23.86%]" />
            <div className="absolute inset-[37%_34.72%_0_17.6%]" data-name="Code_Black_R 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCodeBlackR1} />
            </div>
            <div className="absolute inset-[0_7.7%_1.78%_17.97%]" data-name="Apps_Left 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppsLeft1} />
            </div>
            <div className="absolute inset-[14.38%_59.78%_32.47%_0]" data-name="Cloud_Blob_02_Dark 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCloudBlob02Dark1} />
            </div>
            <div className="absolute inset-[50.24%_19.44%_28.43%_64.43%]" data-name="Cursor_White_S 1">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCursorWhiteS1} />
            </div>
          </div>
          <TitleBlock />
        </div>
      </div>
    </div>
  );
}

function ToggleContent() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Toggle content">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Projects: All projects</p>
    </div>
  );
}

function DropdownCaretValidation() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Dropdown Caret & Validation">
      <div className="relative shrink-0 size-[21px]" data-name="(🚫 don't change!) Caret dropdown">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16619 4.66654">
            <path d={svgPaths.p1436a2c0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MenuToggle() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[37px] items-center left-[16px] px-[16px] py-[8px] rounded-[999px] top-[16px] w-[189px]" data-name="Menu Toggle">
      <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <ToggleContent />
      <DropdownCaretValidation />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-center p-[16px] relative rounded-[16px] shrink-0 size-[48px]">
      <div aria-hidden="true" className="absolute bg-[#151515] inset-0 mix-blend-luminosity pointer-events-none rounded-[16px]" />
      <div aria-hidden="true" className="absolute border-2 border-[#f56e6e] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="rh-ui-icon-dark-mode">
        <div className="absolute inset-[11.37%_11.38%_9.37%_9.38%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.02 19.0201">
            <path d={svgPaths.p116ee100} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center left-[24px] top-[24px]">
      <Frame4 />
      <p className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] relative shrink-0 text-[#151515] text-[28px] whitespace-nowrap">Good evening</p>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Title">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-information">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.75 18.75">
            <path d={svgPaths.p258dd700} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[16px] whitespace-nowrap">Details</p>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Card Header">
      <Title />
      <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center p-[4px] relative shrink-0" data-name="Link Button">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none" />
        <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">View settings</p>
      </div>
    </div>
  );
}

function DescriptionListItem() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full" data-name="Description List Item">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px] text-white w-full">Cluster API address</p>
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal overflow-hidden relative shrink-0 text-[#4d4d4d] text-[12px] text-ellipsis w-full whitespace-nowrap">{`https://api.rhamilto.devcluster.openshift.com:6443`}</p>
    </div>
  );
}

function DescriptionListItem1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Description List Item">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">Cluster ID</p>
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#4d4d4d] text-[12px] w-[min-content]">03242ee9-8986-4f0f-acc0-65aad26ba6a5</p>
      <div className="content-stretch flex items-center relative shrink-0" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] underline whitespace-nowrap">OpenShift Cluster Manager</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0.6%_0.55%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.4853 27.6615">
        <g id="Group">
          <path d={svgPaths.p4696980} fill="var(--fill-0, white)" id="Vector" />
          <g id="Group_2">
            <path clipRule="evenodd" d={svgPaths.p2fbaf00} fill="var(--fill-0, #FF9900)" fillRule="evenodd" id="Vector_2" />
            <path clipRule="evenodd" d={svgPaths.p23244380} fill="var(--fill-0, #FF9900)" fillRule="evenodd" id="Vector_3" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function AmazonWebServicesLogo() {
  return (
    <div className="h-[28px] overflow-clip relative shrink-0 w-[47px]" data-name="Amazon_Web_Services_Logo (1) 1">
      <Group />
    </div>
  );
}

function DescriptionListItem2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Description List Item">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">Infrastructure provider</p>
      <AmazonWebServicesLogo />
    </div>
  );
}

function DescriptionListItem3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full" data-name="Description List Item">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px] text-white w-full">OpenShift version</p>
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal relative shrink-0 text-[#4d4d4d] text-[12px] w-full">4.22.0-0.ci-2026-03-02-064936</p>
    </div>
  );
}

function DescriptionListItem4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Description List Item">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] min-w-full relative shrink-0 text-[14px] text-white w-[min-content]">Service Level Agreement (SLA)</p>
      <div className="font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#4d4d4d] text-[14px] w-[min-content]">
        <p className="mb-0">Self-support, 60 day trial</p>
        <p>Warning alert:59 days remaining</p>
      </div>
      <div className="content-stretch flex items-center relative shrink-0" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] underline whitespace-nowrap">Manage subscription settings</p>
      </div>
    </div>
  );
}

function DescriptionListItem5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full" data-name="Description List Item">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px] text-white w-full">Update channel</p>
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal relative shrink-0 text-[#4d4d4d] text-[12px] w-full">stable-4.22</p>
    </div>
  );
}

function CardMain() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Card Main">
      <DescriptionListItem />
      <DescriptionListItem1 />
      <DescriptionListItem2 />
      <DescriptionListItem3 />
      <DescriptionListItem4 />
      <DescriptionListItem5 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[rgba(41,41,41,0.2)] relative rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)] shrink-0 w-full" data-name="Card">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
        <CardHeader />
        <CardMain />
      </div>
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Title">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-server-stack">
        <div className="absolute inset-[3.13%_6.25%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 18.75">
            <path d={svgPaths.p1ef87c00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[16px] whitespace-nowrap">Cluster inventory</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[45px]">
      <div className="bg-[#8476d1] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">N</p>
      </div>
    </div>
  );
}

function Frame109() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame5 />
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Nodes</p>
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame109 />
      <div className="bg-[#e0e0e0] content-stretch flex items-center justify-center min-w-[32px] px-[8px] relative rounded-[999px] shrink-0 w-[32px]" data-name="Badge">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] min-h-px min-w-px relative text-[#151515] text-[12px] text-center">6</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[45px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame6 />
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Pods</p>
    </div>
  );
}

function Frame83() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame108 />
      <div className="bg-[#e0e0e0] content-stretch flex items-center justify-center min-w-[32px] px-[8px] relative rounded-[999px] shrink-0 w-[38px]" data-name="Badge">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] min-h-px min-w-px relative text-[#151515] text-[12px] text-center">273</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[45px]">
      <div className="bg-[#2b9af3] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[35px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">SC</p>
      </div>
    </div>
  );
}

function Frame107() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame7 />
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">StorageClasses</p>
    </div>
  );
}

function Frame82() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame107 />
      <div className="bg-[#e0e0e0] content-stretch flex items-center justify-center min-w-[32px] px-[8px] relative rounded-[999px] shrink-0 w-[32px]" data-name="Badge">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] min-h-px min-w-px relative text-[#151515] text-[12px] text-center">2</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[45px]">
      <div className="bg-[#2b9af3] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[45px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">PVC</p>
      </div>
    </div>
  );
}

function Frame106() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame8 />
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">PersistentVolumeClaims</p>
    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame106 />
      <div className="bg-[#e0e0e0] content-stretch flex items-center justify-center min-w-[32px] px-[8px] relative rounded-[999px] shrink-0 w-[32px]" data-name="Badge">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] min-h-px min-w-px relative text-[#151515] text-[12px] text-center">0</p>
      </div>
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame80 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame83 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame82 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame81 />
    </div>
  );
}

function Frame85() {
  return (
    <div className="bg-[rgba(41,41,41,0.2)] relative rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
        <Title1 />
        <Frame84 />
      </div>
    </div>
  );
}

function Frame105() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[24px] top-[104px] w-[365px]">
      <Card />
      <Frame85 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-history">
        <div className="absolute inset-[3.13%_3.13%_3.12%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.75 18.7501">
            <path d={svgPaths.p1af00480} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[16px] whitespace-nowrap">Activity</p>
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Title">
      <Frame79 />
      <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center p-[4px] relative shrink-0" data-name="Link Button">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none" />
        <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">View all events</p>
      </div>
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 text-[14px] text-white w-full">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold relative shrink-0 w-full">Ongoing</p>
      <p className="font-['Red_Hat_Text:Regular',sans-serif] font-normal relative shrink-0 w-full">There are no ongoing activities.</p>
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Recent events</p>
      <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center p-[4px] relative shrink-0" data-name="Link Button">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none" />
        <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">Pause</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame77() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame9 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Pulling image "nginx"`}</p>
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">12:52 PM</p>
      <Frame77 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame88() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame10 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Back-off restarting failed container task-pv-container in pod task-pv-pod_robb(295e1f3c-bea0-42b7-b557-ce829dc542b6)</p>
    </div>
  );
}

function Frame87() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">12:40 PM</p>
      <Frame88 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#004080] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">J</p>
      </div>
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame11 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Job completed</p>
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">12:14 PM</p>
      <Frame90 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#2b9af3] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">CJ</p>
      </div>
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame12 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Saw completed job: image-pruner-29543040, condition: Complete</p>
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">11:53 PM</p>
      <Frame95 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame13 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Created container: image-pruner</p>
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">11:38 PM</p>
      <Frame97 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame99() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame14 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Add eth0 [10.128.2.28/23] from ovn-kubernetes</p>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">11:03 PM</p>
      <Frame99 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#004080] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">J</p>
      </div>
    </div>
  );
}

function Frame101() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame15 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Created pod: image-pruner-29543040-cd4vd</p>
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">10:11 PM</p>
      <Frame101 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame16 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Started container image-pruner</p>
    </div>
  );
}

function Frame102() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">10:59 PM</p>
      <Frame103 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame110() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame17 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Container image "registry.ci.openshift.org/ocp/4.22-2026-03-02-064936@sha256:90d1438ef55d33eb710df14baa14206c204718c931735dc099d098b1dc33ca90" already present on machine`}</p>
    </div>
  );
}

function Frame104() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">10:52 PM</p>
      <Frame110 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#2b9af3] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">CJ</p>
      </div>
    </div>
  );
}

function Frame112() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame18 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Created job image-pruner-29543040</p>
    </div>
  );
}

function Frame111() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">9:49 PM</p>
      <Frame112 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame114() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame19 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Successfully assigned openshift-image-registry/image-pruner-29543040-cd4vd to ip-10-0-8-40.ec2.internal</p>
    </div>
  );
}

function Frame113() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">9:48 PM</p>
      <Frame114 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#004080] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">J</p>
      </div>
    </div>
  );
}

function Frame116() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame20 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Job completed</p>
    </div>
  );
}

function Frame115() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">9:43 PM</p>
      <Frame116 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame118() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame21 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Started container insights-gathering</p>
    </div>
  );
}

function Frame117() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">9:39 PM</p>
      <Frame118 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame120() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame22 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Created container: insights-gathering</p>
    </div>
  );
}

function Frame119() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">9:33 PM</p>
      <Frame120 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#004080] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">J</p>
      </div>
    </div>
  );
}

function Frame122() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame23 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Created pod: periodic-gathering-5xsjm-vbfbg</p>
    </div>
  );
}

function Frame121() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">8:17 PM</p>
      <Frame122 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame124() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame24 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Container image "registry.ci.openshift.org/ocp/4.22-2026-03-02-064936@sha256:c737ec56c29d06111f2cde30d379c5882582b23753604fd158274fa4b9f4d794" already present on machine`}</p>
    </div>
  );
}

function Frame123() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">8:02 PM</p>
      <Frame124 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame126() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame25 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Add eth0 [10.131.0.37/23] from ovn-kubernetes</p>
    </div>
  );
}

function Frame125() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">7:45 PM</p>
      <Frame126 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame128() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame26 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">Successfully assigned openshift-insights/periodic-gathering-5xsjm-vbfbg to ip-10-0-66-225.ec2.internal</p>
    </div>
  );
}

function Frame127() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">7:36 PM</p>
      <Frame128 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame130() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame27 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`(combined from similar events): Successfully pulled image "nginx" in 303ms (303ms including waiting). Image size: 164487518 bytes`}</p>
    </div>
  );
}

function Frame129() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">7:36 PM</p>
      <Frame130 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame132() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame28 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Pulling image "nginx"`}</p>
    </div>
  );
}

function Frame131() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">7:35 PM</p>
      <Frame132 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame134() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame29 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Pulling image "nginx"`}</p>
    </div>
  );
}

function Frame133() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">7:28 PM</p>
      <Frame134 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame136() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame30 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Pulling image "nginx"`}</p>
    </div>
  );
}

function Frame135() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">7:23 PM</p>
      <Frame136 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame138() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame31 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Pulling image "nginx"`}</p>
    </div>
  );
}

function Frame137() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">12:52 PM</p>
      <Frame138 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[35px]">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
    </div>
  );
}

function Frame140() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <Frame32 />
      <p className="flex-[1_0_0] font-['Red_Hat_Text:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px overflow-hidden relative text-[14px] text-ellipsis text-white whitespace-nowrap">{`Pulling image "nginx"`}</p>
    </div>
  );
}

function Frame139() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-right text-white w-[58px]">12:52 PM</p>
      <Frame140 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame78 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame87 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame89 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame94 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame96 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame98 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame100 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame102 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame104 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame111 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame113 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame115 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame117 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame119 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame121 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame123 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame125 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame127 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame129 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame131 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame133 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame135 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame137 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Activity Item">
        <Frame139 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative w-full">
      <Frame74 />
      <Frame72 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="absolute bg-[rgba(41,41,41,0.2)] bottom-[2.89%] content-stretch flex flex-col gap-[24px] items-start left-3/4 overflow-clip p-[24px] right-[1.54%] rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)] top-[10.74%]">
      <Title2 />
      <Frame76 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame75 />
    </div>
  );
}

function Title3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Title">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-in-progress">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.75 18.75">
            <path d={svgPaths.p240a9f00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[16px] whitespace-nowrap">Status</p>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Title3 />
      <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center p-[4px] relative shrink-0" data-name="Link Button">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none" />
        <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">View alerts</p>
      </div>
    </div>
  );
}

function StatusItem() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Status Item">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-check-circle-fill">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p31309b40} fill="var(--fill-0, #3D7317)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Cluster</p>
    </div>
  );
}

function StatusItem1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Status Item">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-check-circle-fill">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p31309b40} fill="var(--fill-0, #3D7317)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Control Plane</p>
    </div>
  );
}

function StatusItem2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Status Item">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-check-circle-fill">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p31309b40} fill="var(--fill-0, #3D7317)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Operators</p>
    </div>
  );
}

function StatusItem3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Status Item">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-check-circle-fill">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p31309b40} fill="var(--fill-0, #3D7317)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Dynamic Plugins</p>
    </div>
  );
}

function StatusItem4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Status Item">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-check-circle-fill">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p31309b40} fill="var(--fill-0, #3D7317)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Insights</p>
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-start flex flex-wrap gap-[23px_34px] items-start relative shrink-0 w-full">
      <StatusItem />
      <StatusItem1 />
      <StatusItem2 />
      <StatusItem3 />
      <StatusItem4 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">CannotRetrieveUpdates</p>
      <div className="content-stretch flex items-center relative shrink-0" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] underline whitespace-nowrap">View details</p>
      </div>
    </div>
  );
}

function Frame143() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame70 />
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[12px] w-full">Mar 3, 2026, 10:37 AM</p>
    </div>
  );
}

function Frame142() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <Frame143 />
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[1.5] overflow-hidden relative shrink-0 text-[#4d4d4d] text-[14px] text-ellipsis w-full">{`Failure to retrieve updates means that cluster administrators will need to monitor for available updates on their own or risk falling behind on security or other bugfixes. If the failure is expected, you can clear spec.channel in the ClusterVersion object to tell the cluster-version operator to not retrieve updates. Failure reason VersionNotFound . For more information refer to \`oc get clusterversion/version -o=jsonpath="{.status.conditions[?(.type=='RetrievedUpdates')]}{'\n'}"\` or`}</p>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-warning-fill">
        <div className="absolute inset-[3.13%_-0.07%_6.25%_0]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0113 14.5">
            <path d={svgPaths.p212c7270} fill="var(--fill-0, #FFCC17)" id="Vector" />
          </svg>
        </div>
      </div>
      <Frame142 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">AlertmanagerReceiversNotConfigured</p>
      <div className="content-stretch flex items-center relative shrink-0" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] underline whitespace-nowrap">Configure</p>
      </div>
    </div>
  );
}

function Frame145() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame73 />
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[12px] w-full">Mar 3, 2026, 10:36 AM</p>
    </div>
  );
}

function Frame144() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <Frame145 />
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[1.5] overflow-hidden relative shrink-0 text-[#4d4d4d] text-[14px] text-ellipsis w-full">Alerts are not configured to be sent to a notification system, meaning that you may not be notified in a timely fashion when important failures occur. Check the OpenShift documentation to learn how to configure notifications with Alertmanager.</p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-warning-fill">
        <div className="absolute inset-[3.13%_-0.07%_6.25%_0]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0113 14.5">
            <path d={svgPaths.p212c7270} fill="var(--fill-0, #FFCC17)" id="Vector" />
          </svg>
        </div>
      </div>
      <Frame144 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame65 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame71 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="bg-[rgba(41,41,41,0.2)] relative rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
        <Frame68 />
        <Frame66 />
        <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
          <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
        </div>
        <Frame67 />
      </div>
    </div>
  );
}

function Title4() {
  return (
    <div className="content-stretch flex gap-[16px] h-[21px] items-center relative shrink-0 w-[162px]" data-name="Title">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="rh-ui-icon-speedometer">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.75 18.75">
            <path d={svgPaths.p9139970} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[16px] whitespace-nowrap">Cluster utilization</p>
    </div>
  );
}

function ToggleContent1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Toggle content">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Filter by Node type</p>
    </div>
  );
}

function DropdownCaretValidation1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Dropdown Caret & Validation">
      <div className="relative shrink-0 size-[21px]" data-name="(🚫 don't change!) Caret dropdown">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16631 4.66654">
            <path d={svgPaths.p15d40600} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ToggleContent2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Toggle content">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">1 hour</p>
    </div>
  );
}

function DropdownCaretValidation2() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Dropdown Caret & Validation">
      <div className="relative shrink-0 size-[21px]" data-name="(🚫 don't change!) Caret dropdown">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16619 4.66654">
            <path d={svgPaths.p1436a2c0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame148() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="content-stretch flex gap-[8px] h-[37px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0 w-[181px]" data-name="Menu Toggle">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <ToggleContent1 />
        <DropdownCaretValidation1 />
      </div>
      <div className="content-stretch flex gap-[8px] h-[37px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0 w-[98px]" data-name="Menu Toggle">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <ToggleContent2 />
        <DropdownCaretValidation2 />
      </div>
    </div>
  );
}

function Frame147() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Title4 />
      <Frame148 />
    </div>
  );
}

function Frame150() {
  return (
    <div className="content-stretch flex font-['Red_Hat_Mono:Regular',sans-serif] gap-[62px] items-center justify-end relative shrink-0 text-[#4d4d4d] text-[12px] w-[342px] whitespace-nowrap">
      <p className="relative shrink-0">7:45 PM</p>
      <p className="relative shrink-0">8:00 PM</p>
      <p className="relative shrink-0">8:15 PM</p>
    </div>
  );
}

function Frame149() {
  return (
    <div className="content-stretch flex font-normal gap-[24px] items-center leading-[normal] relative shrink-0 w-full">
      <p className="flex-[1_0_0] font-['Red_Hat_Display:Regular',sans-serif] min-h-px min-w-px relative text-[14px] text-white">Resource</p>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] relative shrink-0 text-[14px] text-white whitespace-nowrap">Usage</p>
      <Frame150 />
    </div>
  );
}

function Frame152() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px] text-white w-full">CPU</p>
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal relative shrink-0 text-[#4d4d4d] text-[12px] w-full">21.76 cores / 24 cores</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[53.73%_0_23.41%_14.91%]" data-name="Group">
      <div className="absolute inset-[66.63%_0_33.37%_20.47%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
            <path d="M0 0.5H272" id="Vector" stroke="var(--stroke-0, #EDEDED)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.63%_79.53%_33.37%_19.01%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
            <path d="M5 0.5H0" id="Vector" stroke="var(--stroke-0, #C7C7C7)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Red_Hat_Mono:Regular',sans-serif] font-normal inset-[53.73%_82.75%_23.41%_14.91%] leading-[normal] text-[#4d4d4d] text-[12px] whitespace-nowrap">5</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[20.36%_0_56.79%_12.87%]" data-name="Group">
      <div className="absolute inset-[33.26%_0_66.74%_20.47%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
            <path d="M0 0.5H272" id="Vector" stroke="var(--stroke-0, #EDEDED)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[33.26%_79.53%_66.74%_19.01%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
            <path d="M5 0.5H0" id="Vector" stroke="var(--stroke-0, #C7C7C7)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Red_Hat_Mono:Regular',sans-serif] font-normal inset-[20.36%_82.75%_56.79%_12.87%] leading-[normal] text-[#4d4d4d] text-[12px] whitespace-nowrap">10</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_12.87%]" data-name="Group">
      <div className="absolute inset-[18.57%_79.53%_0_20.47%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector" />
        </svg>
      </div>
      <Group2 />
      <Group3 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[85.47%_1.02%_0_19.44%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.503px_-46.828px] mask-size-[272px_57px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-9.94%_-0.37%_-9.83%_-0.37%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 274 12.1831">
          <g id="Group">
            <path d={svgPaths.pdd6aa00} fill="var(--fill-0, #0066CC)" fillOpacity="0.15" id="Vector" stroke="var(--stroke-0, #0066CC)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute inset-[44.76%_1.02%_0_19.44%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.503px_-18.33px] mask-size-[272px_57px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-2.59%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 39.67">
          <g id="Group">
            <g id="Vector" />
            <path d={svgPaths.p39ac8700} id="Vector_2" stroke="var(--stroke-0, #CA6C0F)" strokeDasharray="3 3" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[44.76%_1.02%_0_19.44%]" data-name="Group">
      <Group7 />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Clip path group">
      <Group6 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Group">
      <ClipPathGroup />
      <ClipPathGroup1 />
    </div>
  );
}

function Cpu() {
  return (
    <div className="h-[70px] overflow-clip relative shrink-0 w-[342px]" data-name="cpu">
      <Group1 />
      <Group4 />
    </div>
  );
}

function Frame151() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame152 />
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[12px] whitespace-nowrap">2.24</p>
      <Cpu />
    </div>
  );
}

function Frame154() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px] text-white w-full">Memory</p>
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal relative shrink-0 text-[#4d4d4d] text-[12px] w-full">62.32 GiB / 92.12 GiB</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[56.87%_0_20.27%_4.39%]" data-name="Group">
      <div className="absolute inset-[69.77%_0_30.23%_20.47%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
            <path d="M0 0.5H272" id="Vector" stroke="var(--stroke-0, #EDEDED)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[69.77%_79.53%_30.23%_19.01%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
            <path d="M5 0.5H0" id="Vector" stroke="var(--stroke-0, #C7C7C7)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Red_Hat_Mono:Regular',sans-serif] font-normal inset-[56.87%_82.75%_20.27%_4.39%] leading-[normal] text-[#4d4d4d] text-[12px] whitespace-nowrap">20 GiB</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[26.64%_0_50.5%_4.39%]" data-name="Group">
      <div className="absolute inset-[39.54%_0_60.46%_20.47%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
            <path d="M0 0.5H272" id="Vector" stroke="var(--stroke-0, #EDEDED)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[39.54%_79.53%_60.46%_19.01%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
            <path d="M5 0.5H0" id="Vector" stroke="var(--stroke-0, #C7C7C7)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Red_Hat_Mono:Regular',sans-serif] font-normal inset-[26.64%_82.75%_50.5%_4.39%] leading-[normal] text-[#4d4d4d] text-[12px] whitespace-nowrap">40 GiB</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_4.39%]" data-name="Group">
      <div className="absolute inset-[18.57%_79.53%_0_20.47%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector" />
        </svg>
      </div>
      <Group9 />
      <Group10 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute inset-[55.06%_1.02%_0_19.44%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.504px_-25.541px] mask-size-[272px_57px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-3.18%_-0.37%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 274 33.4592">
          <g id="Group">
            <path d={svgPaths.p2b498800} fill="var(--fill-0, #0066CC)" fillOpacity="0.15" id="Vector" stroke="var(--stroke-0, #0066CC)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Clip path group">
      <Group12 />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute inset-[44.76%_1.02%_0_19.44%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.504px_-18.33px] mask-size-[272px_57px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-2.59%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 39.67">
          <g id="Group">
            <g id="Vector" />
            <path d={svgPaths.p19b3aa00} id="Vector_2" stroke="var(--stroke-0, #CA6C0F)" strokeDasharray="3 3" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[44.76%_1.02%_0_19.44%]" data-name="Group">
      <Group14 />
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Clip path group">
      <Group13 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Group">
      <ClipPathGroup2 />
      <ClipPathGroup3 />
    </div>
  );
}

function Memory() {
  return (
    <div className="h-[70px] overflow-clip relative shrink-0 w-[342px]" data-name="memory">
      <Group8 />
      <Group11 />
    </div>
  );
}

function Frame153() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame154 />
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[12px] whitespace-nowrap">29.79 GiB</p>
      <Memory />
    </div>
  );
}

function Frame156() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold relative shrink-0 text-[14px] text-white w-full">Filesystem</p>
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal relative shrink-0 text-[#4d4d4d] text-[12px] w-full">610 GiB / 718.7 GiB</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[36.08%_0_41.06%_2.34%]" data-name="Group">
      <div className="absolute inset-[48.98%_0_51.02%_20.47%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
            <path d="M0 0.5H272" id="Vector" stroke="var(--stroke-0, #EDEDED)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[48.98%_79.53%_51.02%_19.01%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
            <path d="M5 0.5H0" id="Vector" stroke="var(--stroke-0, #C7C7C7)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Red_Hat_Mono:Regular',sans-serif] font-normal inset-[36.08%_82.75%_41.06%_2.34%] leading-[normal] text-[#4d4d4d] text-[12px] whitespace-nowrap">100 GiB</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_2.34%]" data-name="Group">
      <div className="absolute inset-[18.57%_79.53%_0_20.47%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector" />
        </svg>
      </div>
      <Group16 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute inset-[44.76%_1.02%_0_19.44%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.504px_-18.33px] mask-size-[272px_57px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-2.59%_-0.37%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 274 40.67">
          <g id="Group">
            <path d={svgPaths.p339331c0} fill="var(--fill-0, #0066CC)" fillOpacity="0.15" id="Vector" stroke="var(--stroke-0, #0066CC)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup4() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Clip path group">
      <Group18 />
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Group">
      <ClipPathGroup4 />
    </div>
  );
}

function File() {
  return (
    <div className="h-[70px] overflow-clip relative shrink-0 w-[342px]" data-name="file">
      <Group15 />
      <Group17 />
    </div>
  );
}

function Frame155() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame156 />
      <p className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[12px] whitespace-nowrap">108.6 GiB</p>
      <File />
    </div>
  );
}

function Frame158() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">Network transfer</p>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-[23.16%_0_53.98%_2.92%]" data-name="Group">
      <div className="absolute inset-[36.06%_0_63.94%_20.47%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
            <path d="M0 0.5H272" id="Vector" stroke="var(--stroke-0, #EDEDED)" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[36.06%_79.53%_63.94%_19.01%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 1">
            <path d="M5 0.5H0" id="Vector" stroke="var(--stroke-0, #C7C7C7)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Red_Hat_Mono:Regular',sans-serif] font-normal inset-[23.16%_84.21%_53.98%_2.92%] leading-[normal] text-[#4d4d4d] text-[12px] whitespace-nowrap">5 MBps</p>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_2.92%]" data-name="Group">
      <div className="absolute inset-[18.57%_79.53%_0_20.47%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector" />
        </svg>
      </div>
      <Group20 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute inset-[45.41%_1.02%_0_19.44%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.504px_-18.788px] mask-size-[272px_57px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-0.68%_-0.37%_-2.62%_-0.37%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 274 39.4728">
          <g id="Group">
            <path d={svgPaths.p15dabc80} fill="var(--fill-0, #0066CC)" fillOpacity="0.15" id="Vector" stroke="var(--stroke-0, #0066CC)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup5() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Clip path group">
      <Group22 />
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute inset-[44.76%_1.02%_0_19.44%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3.504px_-18.33px] mask-size-[272px_57px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-0.7%_-0.37%_-2.59%_-0.37%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 274 39.9392">
          <g id="Group">
            <path d={svgPaths.pb27a100} fill="var(--fill-0, #92C5F9)" fillOpacity="0.15" id="Vector" stroke="var(--stroke-0, #92C5F9)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup6() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Clip path group">
      <Group23 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[18.57%_0_0_20.47%]" data-name="Group">
      <ClipPathGroup5 />
      <ClipPathGroup6 />
    </div>
  );
}

function Network() {
  return (
    <div className="h-[70px] overflow-clip relative shrink-0 w-[342px]" data-name="network">
      <Group19 />
      <Group21 />
    </div>
  );
}

function Frame157() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame158 />
      <div className="font-['Red_Hat_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[12px] whitespace-nowrap">
        <p className="mb-0">5.10 MBps in</p>
        <p>5.16 MBps out</p>
      </div>
      <Network />
    </div>
  );
}

function Frame184() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame151 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame153 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame155 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <Frame157 />
    </div>
  );
}

function Frame185() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame149 />
      <Frame184 />
    </div>
  );
}

function Frame146() {
  return (
    <div className="bg-[rgba(41,41,41,0.2)] relative rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative w-full">
        <Frame147 />
        <Frame185 />
      </div>
    </div>
  );
}

function Frame141() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[413px] top-[104px] w-[730px]">
      <Frame69 />
      <Frame146 />
    </div>
  );
}

function Frame160() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[190px]">
      <p className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] relative shrink-0 text-[#151515] text-[28px] w-full">Dashboards</p>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] w-full">View and manage dashboards</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-star">
        <div className="absolute inset-[6.25%_2.52%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.1948 14">
            <path d={svgPaths.p2f016100} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame161() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame33 />
      <div className="bg-[#06c] content-stretch flex gap-[4px] items-center justify-center px-[24px] py-[8px] relative rounded-[999px] shrink-0" data-name="Button">
        <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[14px] text-white whitespace-nowrap">Create</p>
      </div>
    </div>
  );
}

function Frame159() {
  return (
    <div className="absolute content-stretch flex inset-[7.95%_2.06%_85.85%_2.06%] items-center justify-between">
      <Frame160 />
      <Frame161 />
    </div>
  );
}

function ToggleContent3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Toggle content">
      <div className="relative shrink-0 size-[24px]" data-name="Custom icon">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.29px)] size-[14px] top-1/2" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.4165 13.9999">
            <path d={svgPaths.p25b37480} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Name</p>
    </div>
  );
}

function DropdownCaretValidation3() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Dropdown Caret & Validation">
      <div className="relative shrink-0 size-[21px]" data-name="(🚫 don't change!) Caret dropdown">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16619 4.66654">
            <path d={svgPaths.p1436a2c0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame162() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="bg-white content-stretch flex gap-[8px] h-[37px] items-center px-[16px] py-[8px] relative rounded-[999px] shrink-0" data-name="Menu Toggle">
        <div aria-hidden="true" className="absolute border border-[#c7c7c7] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <ToggleContent3 />
        <DropdownCaretValidation3 />
      </div>
      <div className="bg-white content-center flex flex-wrap gap-[8px] h-[37px] items-center max-h-[37px] p-[8px] relative rounded-[999px] shrink-0 w-[483px]" data-name="Basic Search input">
        <div aria-hidden="true" className="absolute border border-[#c7c7c7] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9988 14.0013">
              <path d={svgPaths.p3bfe43f0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
            </svg>
          </div>
        </div>
        <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px overflow-hidden relative text-[#4d4d4d] text-[14px] text-ellipsis whitespace-nowrap">Find by name</p>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium relative shrink-0">1 - 20</p>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal relative shrink-0">of</p>
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium relative shrink-0">523</p>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Toolbar">
      <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[999px] shrink-0" data-name="Page quantity selector">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <Frame34 />
        <div className="relative shrink-0 size-[16px]" data-name="fa-caret-down">
          <div className="absolute inset-[33.33%_20.83%]" data-name="caret-down">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
              <path clipRule="evenodd" d={svgPaths.p1fb76600} fill="var(--fill-0, #1F1F1F)" fillRule="evenodd" id="caret-down" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Page selector">
        <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[37px]" data-name="Icon Button (Plain Button)">
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.2px)] size-[14px] top-[calc(50%-0.29px)]" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.9014 8.75249">
                <path d={svgPaths.p28ac800} fill="var(--fill-0, #A3A3A3)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
        <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[37px]" data-name="Icon Button (Plain Button)">
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.09px)] size-[14px] top-[calc(50%-0.29px)]" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.65153 8.75249">
                <path d={svgPaths.p279b3680} fill="var(--fill-0, #A3A3A3)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white content-center flex flex-wrap gap-[8px] h-[37px] items-center max-h-[37px] px-[16px] py-[8px] relative rounded-[999px] shrink-0 w-[46px]" data-name="Text inputs">
          <div aria-hidden="true" className="absolute border border-[#c7c7c7] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px overflow-hidden relative text-[#151515] text-[14px] text-ellipsis whitespace-nowrap">10</p>
        </div>
        <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">of 27</p>
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[37px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.09px)] size-[14px] top-[calc(50%-0.29px)]" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.64871 8.75259">
                <path d={svgPaths.p25857100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[37px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.2px)] size-[14px] top-[calc(50%-0.29px)]" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.8992 8.75261">
                <path d={svgPaths.p1e8b4600} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Dashboard</p>
      <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.08px)] size-[12px] top-1/2" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.16096 12.0003">
            <path d={svgPaths.p182b0800} fill="var(--fill-0, #707070)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Project</p>
      <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.08px)] size-[12px] top-1/2" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.16097 11.9994">
            <path d={svgPaths.p1c08c600} fill="var(--fill-0, #707070)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Created on</p>
      <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.08px)] size-[12px] top-1/2" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.16097 11.9994">
            <path d={svgPaths.p11627300} fill="var(--fill-0, #707070)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[4px] shrink-0">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Last modified</p>
      <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.08px)] size-[12px] top-1/2" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.16097 11.9994">
            <path d={svgPaths.p138b5800} fill="var(--fill-0, #707070)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Header">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Column Header/Header cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[16px] relative size-full">
              <Frame35 />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Column Header/Header cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[16px] relative size-full">
              <Frame36 />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Column Header/Header cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[16px] relative size-full">
              <Frame37 />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Column Header/Header cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center px-[8px] py-[16px] relative size-full">
              <Frame38 />
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center opacity-0 p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame164() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Project Resource Overview</p>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame164 />
    </div>
  );
}

function TableCellDefaultContentCell() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame42 />
        </div>
      </div>
    </div>
  );
}

function Frame165() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">test-lab-alpha</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame165 />
    </div>
  );
}

function TableCellDefaultContentCell1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame41 />
        </div>
      </div>
    </div>
  );
}

function TableRow() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell1 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame166() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Production Overview</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame166 />
    </div>
  );
}

function TableCellDefaultContentCell2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame43 />
        </div>
      </div>
    </div>
  );
}

function Frame167() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">payments-prod</p>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame167 />
    </div>
  );
}

function TableCellDefaultContentCell3() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame44 />
        </div>
      </div>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell2 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell3 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame168() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">API Response Times</p>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame168 />
    </div>
  );
}

function TableCellDefaultContentCell4() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame45 />
        </div>
      </div>
    </div>
  );
}

function Frame169() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">customer-portal</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame169 />
    </div>
  );
}

function TableCellDefaultContentCell5() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame46 />
        </div>
      </div>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell4 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell5 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame170() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Database Health</p>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame170 />
    </div>
  );
}

function TableCellDefaultContentCell6() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

function Frame171() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">inventory-db</p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame171 />
    </div>
  );
}

function TableCellDefaultContentCell7() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame48 />
        </div>
      </div>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell6 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell7 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame172() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">User Traffic Stats</p>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame172 />
    </div>
  );
}

function TableCellDefaultContentCell8() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame49 />
        </div>
      </div>
    </div>
  );
}

function Frame173() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">marketing-site</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame173 />
    </div>
  );
}

function TableCellDefaultContentCell9() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame50 />
        </div>
      </div>
    </div>
  );
}

function TableRow4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell8 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell9 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame174() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Resource Usage</p>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame174 />
    </div>
  );
}

function TableCellDefaultContentCell10() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame51 />
        </div>
      </div>
    </div>
  );
}

function Frame175() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">billing-app</p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame175 />
    </div>
  );
}

function TableCellDefaultContentCell11() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame52 />
        </div>
      </div>
    </div>
  );
}

function TableRow5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell10 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell11 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame176() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Error Tracking</p>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame176 />
    </div>
  );
}

function TableCellDefaultContentCell12() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame53 />
        </div>
      </div>
    </div>
  );
}

function Frame177() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">mobile-backend</p>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame177 />
    </div>
  );
}

function TableCellDefaultContentCell13() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame54 />
        </div>
      </div>
    </div>
  );
}

function TableRow6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell12 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell13 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame178() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Batch Job Status</p>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame178 />
    </div>
  );
}

function TableCellDefaultContentCell14() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame55 />
        </div>
      </div>
    </div>
  );
}

function Frame179() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">data-processor</p>
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame179 />
    </div>
  );
}

function TableCellDefaultContentCell15() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame56 />
        </div>
      </div>
    </div>
  );
}

function TableRow7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell14 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell15 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame180() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Container Security</p>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame180 />
    </div>
  );
}

function TableCellDefaultContentCell16() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame57 />
        </div>
      </div>
    </div>
  );
}

function Frame181() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">security-audit</p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame181 />
    </div>
  );
}

function TableCellDefaultContentCell17() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame58 />
        </div>
      </div>
    </div>
  );
}

function TableRow8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell16 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell17 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame182() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#5e40be] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[27px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">D</p>
      </div>
      <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">Legacy App Monitor</p>
      </div>
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame182 />
    </div>
  );
}

function TableCellDefaultContentCell18() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Frame59 />
        </div>
      </div>
    </div>
  );
}

function Frame183() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="bg-[#009596] content-stretch flex flex-col items-center justify-center px-[8px] relative rounded-[999px] shrink-0 w-[26px]" data-name="OCP Badge">
        <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-white w-full">P</p>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">old-auth-service</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <Frame183 />
    </div>
  );
}

function TableCellDefaultContentCell19() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
          <Frame60 />
        </div>
      </div>
    </div>
  );
}

function TableRow9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell18 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <TableCellDefaultContentCell19 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.125 13.125">
                    <path d={svgPaths.p2d797b00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Mar 4, 2026, 7:46 AM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] w-full">My application</p>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-h-px min-w-px relative">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] w-full">My application</p>
    </div>
  );
}

function TableRow10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Table Row">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
              <Frame61 />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-center flex flex-wrap items-center p-[16px] relative size-full">
              <Frame62 />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 14">
                    <path d={svgPaths.p1fd24000} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Code branch</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Table Cell/Default Content Cell">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[4px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 14">
                    <path d={svgPaths.p1fd24000} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                  </svg>
                </div>
              </div>
              <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">Code branch</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center p-[16px] relative shrink-0" data-name="Table Cell/Right Action">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[32px]" data-name="Icon Button (Plain Button)">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
          <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-5.96px)] size-[14px] top-1/2" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08301 14">
                <path d={svgPaths.pc0b9100} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableBody() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Table Body">
      <TableRow />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow1 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow2 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow3 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow4 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow5 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow6 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow7 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow8 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow9 />
      <div className="content-stretch flex h-px items-start opacity-25 relative shrink-0 w-full" data-name="Divider">
        <div className="bg-[#c7c7c7] flex-[1_0_0] h-px min-h-px min-w-px" />
      </div>
      <TableRow10 />
    </div>
  );
}

function Frame163() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[22.93%_2.06%_4.13%_2.06%] items-start overflow-clip">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function ToggleContent4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Toggle content">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Projects: All projects</p>
    </div>
  );
}

function DropdownCaretValidation4() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Dropdown Caret & Validation">
      <div className="relative shrink-0 size-[21px]" data-name="(🚫 don't change!) Caret dropdown">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16619 4.66654">
            <path d={svgPaths.p1436a2c0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MenuToggle1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] inset-[1.65%_86.83%_94.52%_1.03%] items-center px-[16px] py-[8px] rounded-[999px]" data-name="Menu Toggle">
      <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <ToggleContent4 />
      <DropdownCaretValidation4 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="rh-ui-icon-menu-bars">
        <div className="absolute inset-[15.63%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5 16.5">
            <path d={svgPaths.p28fa3580} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="h-[40px] overflow-clip relative shrink-0 w-[118px]" data-name="Red Hat OpenShift/Red Hat OpenShift logo - Full color">
        <div className="absolute inset-[59.9%_57.93%_9.21%_31.48%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.494 12.3569">
            <path d={svgPaths.p3149000} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[68.2%_49.06%_0.82%_43.51%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.7702 12.392">
            <path d={svgPaths.p37667600} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[68.2%_40.71%_9.29%_52.02%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.5808 9.003">
            <path d={svgPaths.p3cfc2e80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[68.11%_32.77%_9.68%_60.67%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.74413 8.8842">
            <path d={svgPaths.p1e248880} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[59.97%_23.44%_9.27%_68.16%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.91486 12.3026">
            <path d={svgPaths.p156d0f00} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[59.43%_15.64%_9.68%_77.8%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.74249 12.3569">
            <path d={svgPaths.p1486fc00} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[59.73%_12.38%_9.68%_85.87%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.06637 12.2368">
            <path d={svgPaths.p24ec5f00} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[58.23%_6.15%_9.68%_88.58%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.21902 12.8363">
            <path d={svgPaths.p1e268b00} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[61.95%_0.33%_9.31%_94.49%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.11361 11.4946">
            <path d={svgPaths.p7d1a200} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[0.82%_73.15%_39.93%_0.28%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.3504 23.6969">
            <path d={svgPaths.p1ed3c680} fill="var(--fill-0, #EE0000)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[17.94%_77.21%_56.61%_5.45%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4506 10.1798">
            <path d={svgPaths.p2a2f3d80} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[13.96%_14.32%_53.8%_31.75%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63.6313 12.8934">
            <path d={svgPaths.pd33a670} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute inset-[3.91%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.75 14.75">
        <g id="Group">
          <path d={svgPaths.p1388cf00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          <path d={svgPaths.p33d09900} fill="var(--fill-0, #1F1F1F)" id="Vector_2" />
          <path d={svgPaths.p2e5b1680} fill="var(--fill-0, #1F1F1F)" id="Vector_3" />
          <path d={svgPaths.p38df6f80} fill="var(--fill-0, #1F1F1F)" id="Vector_4" />
          <path d={svgPaths.p2e0e5700} fill="var(--fill-0, #1F1F1F)" id="Vector_5" />
          <path d={svgPaths.p385e8600} fill="var(--fill-0, #1F1F1F)" id="Vector_6" />
          <path d={svgPaths.p9155f00} fill="var(--fill-0, #1F1F1F)" id="Vector_7" />
          <path d={svgPaths.p36882e80} fill="var(--fill-0, #1F1F1F)" id="Vector_8" />
          <path d={svgPaths.p14445380} fill="var(--fill-0, #1F1F1F)" id="Vector_9" />
        </g>
      </svg>
    </div>
  );
}

function UiIcon() {
  return (
    <div className="absolute contents inset-[3.91%]" data-name="UI icon">
      <Group24 />
    </div>
  );
}

function Apps() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0 size-[40px]" data-name="Apps">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-switcher-menu">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g id="Bounding box">
            <g id="Vector" />
          </g>
        </svg>
        <UiIcon />
      </div>
    </div>
  );
}

function UiIcon1() {
  return (
    <div className="absolute contents inset-0" data-name="UI icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path d={svgPaths.p2238de70} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          <path d={svgPaths.p228cba80} fill="var(--fill-0, #1F1F1F)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Add() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0 size-[40px]" data-name="Add">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-add-circle">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g id="Bounding box">
            <g id="Vector" />
          </g>
        </svg>
        <UiIcon1 />
      </div>
    </div>
  );
}

function UiIcon2() {
  return (
    <div className="absolute contents inset-0" data-name="UI icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path d={svgPaths.p14c76000} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          <path d={svgPaths.p228cba80} fill="var(--fill-0, #1F1F1F)" id="Vector_2" />
          <path d={svgPaths.pfe94800} fill="var(--fill-0, #1F1F1F)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Help() {
  return (
    <div className="content-stretch flex items-center justify-center p-[8px] relative shrink-0 size-[40px]" data-name="Help">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-question-mark-circle">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g id="Bounding box">
            <g id="Vector" />
          </g>
        </svg>
        <UiIcon2 />
      </div>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Apps />
      <div className="bg-white content-stretch flex gap-[4px] h-[37px] items-center justify-center min-w-[40px] p-[8px] relative rounded-[999px] shrink-0 w-[60px]" data-name="Overflow menu">
        <div aria-hidden="true" className="absolute border border-[#8c8c8c] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <div className="h-[21px] relative shrink-0 w-[16px]" data-name="IconWrapper">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1562 13.125">
              <path d={svgPaths.p16b90300} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
            </svg>
          </div>
        </div>
        <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px] text-center">10</p>
      </div>
      <Add />
      <div className="content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[40px]" data-name="Lightspeed">
        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-ai-experience">
          <div className="absolute inset-[4.67%_4.68%_3.13%_3.11%]" data-name="icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7534 14.7519">
              <path d={svgPaths.p36bc1600} fill="var(--fill-0, #1F1F1F)" id="icon" />
            </svg>
          </div>
        </div>
      </div>
      <Help />
    </div>
  );
}

function AvatarMd() {
  return (
    <div className="bg-[#b9dafc] content-stretch flex items-center justify-center p-[4px] relative rounded-[999px] shrink-0 size-[36px]" data-name="avatar-MD">
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#151515] text-[14px] text-center whitespace-nowrap">JS</p>
    </div>
  );
}

function Frame186() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0">
      <Frame64 />
      <AvatarMd />
    </div>
  );
}

function Frame39() {
  return (
    <div className="absolute bg-white content-stretch flex h-[69px] items-center justify-between left-0 px-[32px] py-[16px] top-0 w-[1920px]">
      <div aria-hidden="true" className="absolute border-[#e0e0e0] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_4px_0px_rgba(41,41,41,0.15)]" />
      <Frame40 />
      <Frame186 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Heading">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[16px] relative size-full">
          <p className="font-['Red_Hat_Display:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#151515] text-[12px] uppercase whitespace-nowrap">Core platform</p>
          <div className="flex items-center justify-center relative shrink-0 size-[12px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
            <div className="flex-none rotate-90">
              <div className="overflow-clip relative size-[12px]" data-name="rh-micron-caret-right">
                <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
                    <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-home">
        <div className="absolute inset-[4.22%_3.13%_3.12%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14.8251">
            <path d={svgPaths.p2884b900} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Home</p>
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-star">
        <div className="absolute inset-[6.25%_2.52%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.1948 14">
            <path d={svgPaths.p2f016100} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Favorites</p>
    </div>
  );
}

function Content3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-topology">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p864ee00} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Ecosystem</p>
    </div>
  );
}

function Content4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-package">
        <div className="absolute inset-[3.13%_3.13%_4.29%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14.8141">
            <path d={svgPaths.p34d28180} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Workloads</p>
    </div>
  );
}

function Content5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-network">
        <div className="absolute inset-[6.25%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d={svgPaths.p1b70bd80} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Networking</p>
    </div>
  );
}

function Content6() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-storage">
        <div className="absolute inset-[3.13%_6.25%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
            <path d={svgPaths.p2d096000} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Storage</p>
    </div>
  );
}

function Content7() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-build">
        <div className="absolute inset-[3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9994 14.9995">
            <path d={svgPaths.p5608080} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Builds</p>
    </div>
  );
}

function Content8() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-monitoring">
        <div className="absolute inset-[9.38%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
            <path d={svgPaths.p126bcb00} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Observe</p>
    </div>
  );
}

function Content9() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-server">
        <div className="absolute inset-[28.13%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 7">
            <path d={svgPaths.p2845b00} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Compute</p>
    </div>
  );
}

function Content10() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-users">
        <div className="absolute inset-[6.25%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
            <path d={svgPaths.pe92d880} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">User Management</p>
    </div>
  );
}

function Content11() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-settings">
        <div className="absolute inset-[3.13%_3.12%_3.13%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.9999 14.999">
            <path d={svgPaths.p17dcc480} fill="var(--fill-0, #707070)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Administration</p>
    </div>
  );
}

function Content12() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="opacity-0 overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-monitoring">
        <div className="absolute inset-[9.38%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
            <path d={svgPaths.p126bcb00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Alerting</p>
    </div>
  );
}

function Content13() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="opacity-0 overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-monitoring">
        <div className="absolute inset-[9.38%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
            <path d={svgPaths.p126bcb00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Metrics</p>
    </div>
  );
}

function Content14() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="opacity-0 overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-monitoring">
        <div className="absolute inset-[9.38%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
            <path d={svgPaths.p126bcb00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Dashboards</p>
      <div className="absolute left-[6px] size-[4px] top-[7.5px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
          <circle cx="2" cy="2" fill="var(--fill-0, #1F1F1F)" id="Ellipse 3" r="2" />
        </svg>
      </div>
    </div>
  );
}

function Content15() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Content">
      <div className="opacity-0 overflow-clip relative shrink-0 size-[16px]" data-name="rh-ui-icon-monitoring">
        <div className="absolute inset-[9.38%_3.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
            <path d={svgPaths.p126bcb00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Display:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4d4d4d] text-[14px] whitespace-nowrap">Targets</p>
    </div>
  );
}

function Group25() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-0 px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content1 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[44px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content2 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[88px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content3 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[132px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content4 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[176px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content5 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[220px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content6 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[264px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content7 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(199,199,199,0.25)] col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[308px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item Observe">
        <Content8 />
        <div className="flex items-center justify-center relative shrink-0 size-[12px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="overflow-clip relative size-[12px]" data-name="rh-micron-caret-right">
              <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
                  <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[528px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content9 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[572px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content10 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[616px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item">
        <Content11 />
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[352px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item Sub">
        <Content12 />
        <div className="opacity-0 overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[396px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item Sub">
        <Content13 />
        <div className="opacity-0 overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[440px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item Sub">
        <Content14 />
        <div className="opacity-0 overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 content-stretch flex h-[40px] items-center justify-between ml-0 mt-[484px] px-[16px] relative rounded-[24px] row-1 w-[244px]" data-name="Menu Item Sub">
        <Content15 />
        <div className="opacity-0 overflow-clip relative shrink-0 size-[12px]" data-name="rh-micron-caret-right">
          <div className="absolute bottom-[5%] left-1/4 right-[26.04%] top-[5%]" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.87538 10.8001">
              <path d={svgPaths.p10416800} fill="var(--fill-0, #707070)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame63() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[24px] h-[963px] items-start left-[24px] p-[24px] rounded-[16px] top-[93px] w-[292px]">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Heading />
      <Group25 />
      <div className="absolute flex h-[40px] items-center justify-center left-[12px] top-[372px] w-[4px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="bg-[#e00] h-[4px] rounded-[4px] w-[40px]" />
        </div>
      </div>
    </div>
  );
}

export default function Component03DashboardsList() {
  return (
    <div className="overflow-clip relative rounded-[32px] size-full" data-name="03 - Dashboards List">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[32px] size-full" src={img03DashboardsList} />
      <div className="absolute bg-[rgba(41,41,41,0.2)] content-stretch flex flex-col gap-[24px] h-[968px] items-start left-[calc(16.67%+20px)] opacity-0 overflow-clip pb-[24px] pt-[64px] px-[32px] rounded-[32px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.16)] top-[96px] w-[1556px]" data-name="Dashboard Single Content">
        <div className="content-stretch flex h-[18px] items-center relative shrink-0 w-full" data-name="🧰 Breadcrumbs">
          <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Breadcrumb items">
            <Frame />
          </div>
          <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Breadcrumb items">
            <Frame1 />
          </div>
        </div>
        <Frame93 />
        <ArtifactToolbarDashboard />
        <Content />
        <MenuToggle />
      </div>
      <div className="absolute h-[968px] left-[calc(16.67%+20px)] opacity-0 top-[96px] w-[1556px]" data-name="Home Content">
        <Frame3 />
        <Frame105 />
        <Frame86 />
        <Frame141 />
      </div>
      <div className="absolute h-[968px] left-[calc(16.67%+20px)] top-[88px] w-[1556px]" data-name="Dashboards Content">
        <div className="absolute backdrop-blur-[0px] bg-white border border-[#e0e0e0] border-solid inset-0 rounded-[16px] shadow-[0px_1px_6px_0px_rgba(41,41,41,0.15)]" data-name="Main Surface" />
        <Frame159 />
        <div className="absolute content-stretch flex inset-[16.63%_2.06%_79.55%_2.06%] items-center justify-between" data-name="Utility Row">
          <Frame162 />
          <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="🧰 Pagination">
            <Toolbar />
          </div>
        </div>
        <Frame163 />
        <MenuToggle1 />
      </div>
      <Frame39 />
      <Frame63 />
    </div>
  );
}