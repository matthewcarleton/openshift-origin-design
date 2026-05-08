import svgPaths from "./svg-yy72driuyu";

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Adminstration</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
      <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.08px)] size-[12px] top-[calc(50%-0.25px)]" data-name="🖼️ Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.84198 7.50225">
            <path d={svgPaths.pb9ebf00} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Cluster Update</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Red_Hat_Display_VF:Bold',sans-serif] font-bold leading-[31.2px] relative shrink-0 text-[#151515] text-[24px] whitespace-nowrap">Cluster Update</p>
    </div>
  );
}

function InputGroup() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-end relative rounded-[999px] shrink-0" data-name="Input group">
      <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[999px] shrink-0 size-[37px]" data-name="Icon Button (Plain Button)">
        <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="🖼️ Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.1951 14">
              <path d={svgPaths.pa22ebc0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonActionsMenu() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0" data-name="Button + Actions menu">
      <InputGroup />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0">
      <ButtonActionsMenu />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative w-full">
          <Frame14 />
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function TabNameWrapper() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="Tab name wrapper">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] text-center whitespace-nowrap">Update Plan</p>
    </div>
  );
}

function TabName() {
  return (
    <div className="content-stretch flex gap-[4px] h-[45px] items-center justify-center px-[8px] py-[4px] relative shrink-0" data-name="Tab name">
      <TabNameWrapper />
    </div>
  );
}

function TabContent() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Tab content">
      <TabName />
    </div>
  );
}

function TabAccentLine() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Tab + accent line">
      <TabContent />
      <div className="h-0 relative shrink-0 w-full" data-name="Accent line">
        <div className="absolute inset-[-3px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 3">
            <line id="Accent line" stroke="var(--stroke-0, #004080)" strokeLinecap="round" strokeWidth="3" x1="1.5" x2="108.5" y1="1.5" y2="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TabNameWrapper1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative shrink-0" data-name="Tab name wrapper">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#4d4d4d] text-[14px] text-center whitespace-nowrap">Cluster Operators</p>
    </div>
  );
}

function TabName1() {
  return (
    <div className="content-stretch flex h-[45px] items-center justify-center px-[8px] py-[4px] relative shrink-0" data-name="Tab name">
      <TabNameWrapper1 />
    </div>
  );
}

function TabContent1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Tab content">
      <TabName1 />
    </div>
  );
}

function TabNameWrapper2() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative shrink-0" data-name="Tab name wrapper">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#4d4d4d] text-[14px] text-center whitespace-nowrap">Update History</p>
    </div>
  );
}

function TabName2() {
  return (
    <div className="content-stretch flex h-[45px] items-center justify-center px-[8px] py-[4px] relative shrink-0" data-name="Tab name">
      <TabNameWrapper2 />
    </div>
  );
}

function TabContent2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Tab content">
      <TabName2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px overflow-clip relative">
      <div className="h-[45px] max-w-[24px] relative shrink-0 w-[24px]" data-name="Tab items - Horizontal">
        <div aria-hidden="true" className="absolute border-[#c7c7c7] border-b border-solid inset-0 pointer-events-none" />
      </div>
      <div className="content-stretch flex items-center relative shrink-0" data-name="UNIFIED Tab - Horizontal - Default">
        <TabAccentLine />
      </div>
      <div className="content-stretch flex items-center relative shrink-0" data-name="UNIFIED Tab - Horizontal - Default">
        <div aria-hidden="true" className="absolute border-[#c7c7c7] border-b border-solid inset-0 pointer-events-none" />
        <TabContent1 />
      </div>
      <div className="content-stretch flex items-center relative shrink-0" data-name="UNIFIED Tab - Horizontal - Default">
        <div aria-hidden="true" className="absolute border-[#c7c7c7] border-b border-solid inset-0 pointer-events-none" />
        <TabContent2 />
      </div>
    </div>
  );
}

function TabConfigHorizontalDefaultWithOverflow() {
  return (
    <div className="relative shrink-0 w-full" data-name="Tab config - Horizontal - Default with overflow">
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] w-full">
        <Frame2 />
      </div>
      <div aria-hidden="true" className="absolute border-[#c7c7c7] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#151515] text-[16px] top-[-1px] whitespace-nowrap">Update method</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Heading">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[#151515] text-[14px] text-center whitespace-nowrap">Manual upgrades</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <Heading />
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#151515] text-[12px] text-center whitespace-nowrap">Manually manage version upgrades for the cluster. You will need to approve each update individually.</p>
    </div>
  );
}

function TileContent() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Tile content">
      <Frame3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Heading">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[#151515] text-[14px] text-center whitespace-nowrap">Agent-based upgrades</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
      <Heading1 />
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#151515] text-[12px] text-center whitespace-nowrap">Let the AI agent manage upgrades automatically. It analyzes optimal windows and performs safety checks before upgrading.</p>
    </div>
  );
}

function TileContent1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Tile content">
      <Frame4 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-white content-stretch flex gap-[24px] items-center overflow-clip relative shrink-0">
      <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Tile">
        <div className="bg-white content-stretch flex flex-col items-center justify-center p-[24px] relative rounded-[16px] shrink-0 w-[146px]" data-name=".Card tile Base component">
          <div aria-hidden="true" className="absolute border-2 border-[#06c] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <TileContent />
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Tile">
        <div className="bg-white content-stretch flex flex-col items-center justify-center p-[24px] relative rounded-[16px] shrink-0 w-[146px]" data-name=".Card tile Base component">
          <div aria-hidden="true" className="absolute border border-[#c7c7c7] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <TileContent1 />
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] items-start overflow-clip p-[24px] relative rounded-[16px] shrink-0 w-[1385px]">
      <Container />
      <Frame18 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#151515] text-[16px] top-[-1px] whitespace-nowrap">Cluster ID</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Menlo:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4d4d4d] text-[14px] top-0 whitespace-nowrap">b86faa3-b06c-4a82-8fa7-54b80a92d4b2</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[53px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Paragraph />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#151515] text-[16px] top-[-1px] whitespace-nowrap">Current Version</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Menlo:Regular',sans-serif] leading-[21px] left-0 not-italic text-[#4d4d4d] text-[14px] top-0 whitespace-nowrap">5.0.0</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[53px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Paragraph1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[126px] items-start relative shrink-0 w-[1257px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 whitespace-nowrap">
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[#151515] text-[14px]">Channel</p>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#f4784a] text-[12px]">*</p>
    </div>
  );
}

function ToggleContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Toggle content">
      <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#151515] text-[14px]">fast-5.1</p>
    </div>
  );
}

function DropdownCaretValidation() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip pl-[8px] relative shrink-0" data-name="Dropdown Caret & Validation">
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

function Input() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full" data-name="Input">
      <div className="bg-white flex-[1_0_0] h-[37px] min-h-px min-w-px relative rounded-[999px]" data-name="Menu Toggle">
        <div aria-hidden="true" className="absolute border border-[#c7c7c7] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center px-[16px] py-[8px] relative size-full">
            <ToggleContent />
            <DropdownCaretValidation />
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <div className="content-stretch flex items-center relative shrink-0" data-name="Input Label">
        <Frame5 />
      </div>
      <Input />
    </div>
  );
}

function InputFieldsOptional() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[650px] relative shrink-0 w-[650px]" data-name="Input Fields - Optional">
      <InputField />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] h-[251px] items-start overflow-clip p-[24px] relative rounded-[16px] shrink-0 w-[1385px]">
      <Container1 />
      <InputFieldsOptional />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#151515] text-[16px] top-[-1px] whitespace-nowrap">Available Updates</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading5 />
    </div>
  );
}

function TextLeftOfBadge() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Text Left of Badge">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#004d99] text-[14px] whitespace-nowrap">5.2</p>
    </div>
  );
}

function ToggleTextFrame() {
  return (
    <div className="content-center flex flex-[1_0_0] flex-wrap gap-[5px] items-center min-h-px min-w-px relative" data-name="Toggle Text Frame">
      <TextLeftOfBadge />
      <div className="bg-[#e0e0e0] content-stretch flex items-center justify-center min-w-[32px] px-[8px] relative rounded-[999px] shrink-0 w-[73px]" data-name="Badge">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[18px] min-h-px min-w-px relative text-[#151515] text-[12px] text-center">3 releases</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-center justify-center p-[8px] relative rounded-[999px] shrink-0 size-[37px]" data-name="Icon Button (Plain Button)">
        <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <div className="relative shrink-0 size-[16px]" data-name="IconWrapper">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.33px)] size-[16px] top-[calc(50%-0.11px)]" data-name="🖼️ Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99631 6.45616">
              <path d={svgPaths.p17369480} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
            </svg>
          </div>
        </div>
      </div>
      <ToggleTextFrame />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="Checkbox Input">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#c7c7c7] border-solid left-1/2 rounded-[4px] size-[16px] top-1/2" data-name="Rectangle" />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative text-[#06c] text-[14px] underline">My application</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[37px] relative rounded-[999px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start p-[8px] relative size-full">
          <p className="flex-[1_0_0] font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] min-h-px min-w-px relative self-stretch text-[#151515] text-[14px]">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
  );
}

function ExpandableSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="Expandable Section">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] py-[8px] relative w-full">
        <Frame6 />
        <div className="bg-white h-[64px] relative shrink-0 w-full" data-name="Basic Row">
          <div aria-hidden="true" className="absolute border-[#c7c7c7] border-b border-solid inset-0 pointer-events-none" />
          <div className="content-stretch flex items-start px-[8px] relative size-full">
            <div className="relative self-stretch shrink-0" data-name="Table Cell/Left controls">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex gap-[8px] h-full items-center px-[8px] py-[16px] relative">
                  <div className="bg-[rgba(255,255,255,0)] content-stretch flex h-[32px] items-center justify-center p-[8px] relative rounded-[999px] shrink-0" data-name="Icon Button (Plain Button)">
                    <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none rounded-[999px]" />
                    <div className="h-[14px] relative shrink-0 w-[16px]" data-name="IconWrapper">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.09px)] size-[14px] top-[calc(50%-0.29px)]" data-name="🖼️ Icon">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.64865 8.75263">
                          <path d={svgPaths.p145de3c0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <Frame10 />
                </div>
              </div>
            </div>
            <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Table Cell/Default Content Cell">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center p-[16px] relative size-full">
                  <Frame8 />
                </div>
              </div>
            </div>
            <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Table Cell/Default Content Cell">
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
            <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Table Cell/Default Content Cell">
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
            <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Table Cell/Default Content Cell">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center p-[16px] relative size-full">
                  <div className="content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="Status=Success, Type=Outlined, Size=Default, State=Default">
                    <div aria-hidden="true" className="absolute border border-[#3d7317] border-solid inset-0 pointer-events-none rounded-[999px]" />
                    <div className="relative shrink-0 size-[16px]" data-name="IconWrapper">
                      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[12px] top-1/2" data-name="🖼️ Icon">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                          <path d={svgPaths.p3aad3100} fill="var(--fill-0, #3D7317)" id="ð¼ï¸ Icon" />
                        </svg>
                      </div>
                    </div>
                    <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#151515] text-[12px] whitespace-nowrap">Label</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Frame7 />
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] items-start overflow-clip p-[24px] relative rounded-[16px] shrink-0 w-[1385px]">
      <Container4 />
      <div className="content-stretch flex items-center px-[16px] py-[8px] relative shrink-0 w-[800px]" data-name="Expandable Section">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link Button">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none" />
          <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.41px)] size-[14px] top-[calc(50%+0.21px)]" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.64865 8.75263">
                <path d={svgPaths.p145de3c0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
          <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">5.1</p>
        </div>
      </div>
      <ExpandableSection />
      <div className="content-stretch flex items-center px-[16px] py-[8px] relative shrink-0 w-[800px]" data-name="Expandable Section">
        <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0" data-name="Link Button">
          <div aria-hidden="true" className="absolute border-0 border-[rgba(255,255,255,0)] border-solid inset-0 pointer-events-none" />
          <div className="relative shrink-0 size-[21px]" data-name="IconWrapper">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.41px)] size-[14px] top-[calc(50%+0.21px)]" data-name="🖼️ Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.64925 8.75273">
                <path d={svgPaths.p14b76af0} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
              </svg>
            </div>
          </div>
          <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] whitespace-nowrap">5.1</p>
        </div>
      </div>
    </div>
  );
}

export default function Frame12() {
  return (
    <div className="backdrop-blur-[0px] bg-white relative rounded-[16px] size-full">
      <div className="content-stretch flex flex-col gap-[16px] items-center overflow-clip py-[16px] relative rounded-[inherit] size-full">
        <div className="content-stretch flex items-start relative shrink-0 w-[1385px]" data-name="🧰 Breadcrumbs">
          <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Breadcrumb items">
            <Frame />
          </div>
          <div className="content-stretch flex items-start pr-[8px] relative shrink-0" data-name="Breadcrumb items">
            <Frame1 />
          </div>
        </div>
        <Frame15 />
        <TabConfigHorizontalDefaultWithOverflow />
        <Frame17 />
        <Frame16 />
        <Frame19 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_10px_0px_rgba(41,41,41,0.15)]" />
    </div>
  );
}