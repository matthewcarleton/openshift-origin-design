import svgPaths from "./svg-innwssclr1";

function TextFields() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[416px]" data-name="Text fields">
      <p className="font-['Red_Hat_Text_VF:Bold',sans-serif] font-bold leading-[21px] relative shrink-0 text-[#151515] text-[14px] w-[416px]">Select channel</p>
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[#4d4d4d] text-[12px] w-[416px]">The current version is available in the channels listed in the dropdown below. Select a channel that reflects the desired version. Critical security updates will be delivered to any vulnerable channels.</p>
    </div>
  );
}

function Group() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="group">
      <TextFields />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative self-stretch" data-name="header">
      <Group />
    </div>
  );
}

function MainFieldGroup() {
  return (
    <div className="content-stretch flex flex-col h-[142px] items-start relative shrink-0 w-[518px]" data-name="Main field group">
      <div className="content-stretch flex h-[111px] items-start py-[16px] relative shrink-0 w-full" data-name="Field group header">
        <Header />
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Inline link">
        <p className="[text-decoration-skip-ink:none] decoration-solid font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#06c] text-[14px] underline whitespace-nowrap">Learn more about OpenShift udate channels</p>
        <div className="h-[23px] relative shrink-0 w-[24px]" data-name="IconWrapper">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[14px] top-[calc(50%+0.5px)]" data-name="🖼️ Icon">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
              <path d={svgPaths.p857e700} fill="var(--fill-0, #0066CC)" id="ð¼ï¸ Icon" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start overflow-clip py-[8px] relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="Radio button">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Radio Button">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, white)" id="Radio Button" r="7.5" stroke="var(--stroke-0, #0066CC)" />
          </svg>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[10px] top-1/2" data-name="Oval Copy">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <circle cx="5" cy="5" fill="var(--fill-0, #0066CC)" id="Oval Copy" r="5" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Next Z-stream release in your current channel</p>
    </div>
  );
}

function ToggleContent() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[365px]" data-name="Toggle content">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">candidate-4.22</p>
    </div>
  );
}

function DontChangeCaretDropdown() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="(🚫 don't change!) Caret dropdown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="(ð« don't change!) Caret dropdown">
          <path d={svgPaths.pbf6de80} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
        </g>
      </svg>
    </div>
  );
}

function DropdownCaretValidation() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Dropdown Caret & Validation">
      <DontChangeCaretDropdown />
    </div>
  );
}

function MenuToggle() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37px] min-h-px min-w-px relative rounded-[999px]" data-name="Menu Toggle">
      <div aria-hidden="true" className="absolute border border-[#c7c7c7] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative size-full">
          <ToggleContent />
          <DropdownCaretValidation />
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-[418px]" data-name="Input">
      <MenuToggle />
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <Frame1 />
      <Input />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start overflow-clip py-[8px] relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="Radio button">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[16px] top-1/2" data-name="Radio Button">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, white)" id="Radio Button" r="7.5" stroke="var(--stroke-0, #C7C7C7)" />
          </svg>
        </div>
      </div>
      <p className="font-['Red_Hat_Text_VF:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">Latest release channel</p>
    </div>
  );
}

function ToggleContent1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[365px]" data-name="Toggle content">
      <p className="font-['Red_Hat_Text_VF:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#151515] text-[14px] whitespace-nowrap">stable-5.00.01</p>
    </div>
  );
}

function DontChangeCaretDropdown1() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="(🚫 don't change!) Caret dropdown">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="(ð« don't change!) Caret dropdown">
          <path d={svgPaths.pbf6de80} fill="var(--fill-0, #1F1F1F)" id="ð¼ï¸ Icon" />
        </g>
      </svg>
    </div>
  );
}

function DropdownCaretValidation1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0" data-name="Dropdown Caret & Validation">
      <DontChangeCaretDropdown1 />
    </div>
  );
}

function MenuToggle1() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37px] min-h-px min-w-px relative rounded-[999px]" data-name="Menu Toggle">
      <div aria-hidden="true" className="absolute border border-[#c7c7c7] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative size-full">
          <ToggleContent1 />
          <DropdownCaretValidation1 />
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-[418px]" data-name="Input">
      <MenuToggle1 />
    </div>
  );
}

function InputField1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input Field">
      <Frame2 />
      <Input1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[234px] items-start py-[8px] relative shrink-0 w-[518px]">
      <InputField />
      <InputField1 />
    </div>
  );
}

export default function FieldGroup() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Field group">
      <MainFieldGroup />
      <Frame />
    </div>
  );
}