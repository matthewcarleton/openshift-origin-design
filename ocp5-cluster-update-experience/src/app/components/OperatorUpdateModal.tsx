import { useState } from "react";
import { X, AlertCircle, CheckCircle, Loader2 } from "@/lib/pfIcons";

interface OperatorUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorName: string;
  currentVersion: string;
  targetVersion: string;
}

export default function OperatorUpdateModal({
  isOpen,
  onClose,
  operatorName,
  currentVersion,
  targetVersion,
}: OperatorUpdateModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStep, setUpdateStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const updateSteps = [
    "Validating operator compatibility...",
    "Downloading operator images...",
    "Updating operator subscription...",
    "Applying new operator version...",
    "Verifying operator health...",
  ];

  const handleUpdate = () => {
    setIsUpdating(true);
    setUpdateStep(0);

    // Simulate update process
    const interval = setInterval(() => {
      setUpdateStep((prev) => {
        if (prev < updateSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsUpdating(false);
          setIsComplete(true);
          return prev;
        }
      });
    }, 1500);
  };

  const handleClose = () => {
    if (!isUpdating) {
      setIsComplete(false);
      setUpdateStep(0);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm">
      <div className="app-glass-panel max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-[24px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white">
            {isComplete ? "Update Complete" : "Update Operator"}
          </h2>
          {!isUpdating && (
            <button
              onClick={handleClose}
              className="p-[8px] rounded-[999px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <X className="size-[20px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-[24px]">
          {!isComplete && !isUpdating && (
            <>
              <div className="mb-[24px]">
                <p className="text-[14px] text-[#151515] dark:text-white mb-[16px]">
                  You are about to update <strong>{operatorName}</strong>
                </p>
                <div className="bg-[#f5f5f5] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px] space-y-[8px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Current version:</span>
                    <span className="text-[13px] font-semibold text-[#151515] dark:text-white">{currentVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Target version:</span>
                    <span className="text-[13px] font-semibold text-[#0066cc] dark:text-[#4dabf7]">{targetVersion}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#fffbf0] dark:bg-[rgba(255,152,0,0.1)] border border-[#ffb300] dark:border-[#ffb74d] rounded-[8px] p-[16px] mb-[24px]">
                <div className="flex items-start gap-[12px]">
                  <AlertCircle className="size-[16px] text-[#ff9800] dark:text-[#ffb74d] shrink-0 mt-[2px]" />
                  <div>
                    <p className="font-semibold text-[#151515] dark:text-white text-[14px] mb-[4px]">
                      Important
                    </p>
                    <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                      This update may cause temporary disruption to workloads using this operator. Please review the changelog and ensure compatibility before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isUpdating && (
            <div className="py-[24px]">
              <div className="space-y-[20px]">
                {updateSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-[12px]">
                    {index < updateStep && (
                      <CheckCircle className="size-[20px] text-[#3e8635] dark:text-[#81c784] shrink-0" />
                    )}
                    {index === updateStep && (
                      <Loader2 className="size-[20px] text-[#0066cc] dark:text-[#4dabf7] shrink-0 animate-spin" />
                    )}
                    {index > updateStep && (
                      <div className="size-[20px] rounded-full border-2 border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.2)] shrink-0" />
                    )}
                    <span
                      className={`text-[14px] ${
                        index <= updateStep
                          ? "text-[#151515] dark:text-white font-medium"
                          : "text-[#4d4d4d] dark:text-[#b0b0b0]"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isComplete && (
            <div className="text-center py-[24px]">
              <CheckCircle className="size-[48px] text-[#3e8635] dark:text-[#81c784] mx-auto mb-[16px]" />
              <p className="font-semibold text-[16px] text-[#151515] dark:text-white mb-[8px]">
                Operator Updated Successfully
              </p>
              <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                {operatorName} has been updated to version {targetVersion}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] p-[24px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          {!isComplete && !isUpdating && (
            <>
              <button
                onClick={handleClose}
                className="px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white transition-colors"
              >
                Update operator
              </button>
            </>
          )}
          {isComplete && (
            <button
              onClick={handleClose}
              className="px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
