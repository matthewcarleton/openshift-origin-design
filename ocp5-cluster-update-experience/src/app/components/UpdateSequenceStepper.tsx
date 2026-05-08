import { Check } from "@/lib/pfIcons";

interface UpdateStep {
  version: string;
  status: 'complete' | 'current' | 'pending' | 'intermediate';
  label?: string;
  requiresVersion?: string;
}

interface UpdateSequenceStepperProps {
  steps: UpdateStep[];
  showExpanded?: boolean;
}

export default function UpdateSequenceStepper({ steps, showExpanded = false }: UpdateSequenceStepperProps) {
  const currentIndex = steps.findIndex(step => step.status === 'current');
  
  return (
    <div className="relative">
      {/* Horizontal Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isComplete = step.status === 'complete';
          const isCurrent = step.status === 'current';
          const isPending = step.status === 'pending';
          const isIntermediate = step.status === 'intermediate';
          
          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Node */}
              <div className="relative flex flex-col items-center">
                {/* Circle */}
                <div 
                  className={`size-[32px] rounded-full border-2 flex items-center justify-center transition-all ${
                    isComplete 
                      ? 'bg-[#3e8635] dark:bg-[#4cbb17] border-[#3e8635] dark:border-[#4cbb17]' 
                      : isCurrent
                      ? 'bg-white dark:bg-[#0f0f0f] border-[#0066cc] dark:border-[#4dabf7]'
                      : isIntermediate
                      ? 'bg-[#f0f0f0] dark:bg-[#2a2a2a] border-[#d2d2d2] dark:border-[#4d4d4d]'
                      : 'bg-white dark:bg-[#0f0f0f] border-[#d2d2d2] dark:border-[#4d4d4d]'
                  }`}
                >
                  {isComplete ? (
                    <Check className="size-[16px] text-white" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div className="size-[12px] rounded-full bg-[#0066cc] dark:bg-[#4dabf7]" />
                  ) : isIntermediate ? (
                    <div className="size-[8px] rounded-full bg-[#d2d2d2] dark:bg-[#4d4d4d]" />
                  ) : null}
                </div>
                
                {/* Label */}
                <div className="absolute top-[40px] min-w-[80px] flex flex-col items-center">
                  <p className={`text-[13px] font-semibold whitespace-nowrap ${
                    isCurrent 
                      ? 'text-[#151515] dark:text-white' 
                      : 'text-[#4d4d4d] dark:text-[#b0b0b0]'
                  }`}>
                    {step.version}
                  </p>
                  {step.label && (
                    <p className="text-[11px] text-[#4d4d4d] dark:text-[#b0b0b0] whitespace-nowrap">
                      {step.label}
                    </p>
                  )}
                  {step.requiresVersion && showExpanded && (
                    <div className="mt-[8px] flex flex-col items-center">
                      <div className="size-[24px] rounded-full border-2 border-[#ee0000] dark:border-[#ff6b6b] bg-white dark:bg-[#0f0f0f] flex items-center justify-center mb-[4px]">
                        <svg className="size-[12px] text-[#ee0000] dark:text-[#ff6b6b]" fill="none" viewBox="0 0 16 16">
                          <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 10a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm0-6a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z" fill="currentColor" />
                        </svg>
                      </div>
                      <p className="text-[11px] text-[#0066cc] dark:text-[#4dabf7] font-semibold whitespace-nowrap">
                        Requires {step.requiresVersion}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-[2px] mx-[8px] relative">
                  <div className="absolute inset-0 bg-[#d2d2d2] dark:bg-[#4d4d4d]" />
                  <div 
                    className={`absolute inset-0 bg-[#0066cc] dark:bg-[#4dabf7] transition-all ${
                      index < currentIndex ? 'w-full' : 'w-0'
                    }`} 
                  />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Arrow at the end */}
        <div className="ml-[8px]">
          <svg className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" fill="none" viewBox="0 0 20 20">
            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      {/* More indicator for collapsed view */}
      {!showExpanded && steps.some(s => s.status === 'intermediate') && (
        <div className="absolute left-1/2 top-[90px] transform -translate-x-1/2">
          <div className="bg-white dark:bg-[#1a1a1a] border border-[#0066cc] dark:border-[#4dabf7] rounded-[16px] px-[12px] py-[4px]">
            <p className="text-[11px] text-[#0066cc] dark:text-[#4dabf7] font-semibold whitespace-nowrap">
              +{steps.filter(s => s.status === 'intermediate').length} more
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
