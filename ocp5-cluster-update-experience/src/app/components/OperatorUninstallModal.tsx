import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Loader2 } from "@/lib/pfIcons";

interface OperatorUninstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorName: string;
  operatorVersion: string;
}

export default function OperatorUninstallModal({
  isOpen,
  onClose,
  operatorName,
  operatorVersion,
}: OperatorUninstallModalProps) {
  const [isUninstalling, setIsUninstalling] = useState(false);
  const [uninstallStep, setUninstallStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const uninstallSteps = [
    "Removing operator resources...",
    "Cleaning up operator subscriptions...",
    "Removing custom resource definitions...",
    "Finalizing uninstallation...",
  ];

  const isConfirmed = confirmText === operatorName;

  const handleUninstall = () => {
    if (!isConfirmed) return;

    setIsUninstalling(true);
    setUninstallStep(0);

    // Simulate uninstall process
    const interval = setInterval(() => {
      setUninstallStep((prev) => {
        if (prev < uninstallSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsUninstalling(false);
          setIsComplete(true);
          return prev;
        }
      });
    }, 1500);
  };

  const handleClose = () => {
    if (!isUninstalling) {
      setIsComplete(false);
      setUninstallStep(0);
      setConfirmText("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm">
      <div className="app-glass-panel max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-[24px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white">
            {isComplete ? "Uninstallation Complete" : "Uninstall Operator"}
          </h2>
          {!isUninstalling && (
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
          {!isComplete && !isUninstalling && (
            <>
              <div className="bg-[#fff4f4] dark:bg-[rgba(201,37,45,0.1)] border-2 border-[#c92325] dark:border-[#f5a1a3] rounded-[8px] p-[16px] mb-[24px]">
                <div className="flex items-start gap-[12px]">
                  <AlertTriangle className="size-[20px] text-[#c92325] dark:text-[#f5a1a3] shrink-0 mt-[2px]" />
                  <div>
                    <p className="font-semibold text-[#151515] dark:text-white text-[14px] mb-[8px]">
                      Warning: This action cannot be undone
                    </p>
                    <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
                      Uninstalling this operator will:
                    </p>
                    <ul className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] list-disc list-inside space-y-[4px]">
                      <li>Remove all operator resources and subscriptions</li>
                      <li>Delete custom resource definitions (CRDs)</li>
                      <li>Potentially disrupt dependent workloads</li>
                      <li>Remove all operator configurations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-[24px]">
                <div className="bg-[#f5f5f5] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] p-[16px] space-y-[8px] mb-[16px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Operator:</span>
                    <span className="text-[13px] font-semibold text-[#151515] dark:text-white">{operatorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Version:</span>
                    <span className="text-[13px] font-semibold text-[#151515] dark:text-white">{operatorVersion}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-[#151515] dark:text-white mb-[8px]">
                    Type <code className="bg-[#f5f5f5] dark:bg-[rgba(255,255,255,0.1)] px-[6px] py-[2px] rounded-[4px] font-mono text-[13px]">{operatorName}</code> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Enter operator name"
                    className="w-full px-[12px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] text-[14px] text-[#151515] dark:text-white focus:outline-none focus:border-[#0066cc] dark:focus:border-[#4dabf7] transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {isUninstalling && (
            <div className="py-[24px]">
              <div className="space-y-[20px]">
                {uninstallSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-[12px]">
                    {index < uninstallStep && (
                      <CheckCircle className="size-[20px] text-[#3e8635] dark:text-[#81c784] shrink-0" />
                    )}
                    {index === uninstallStep && (
                      <Loader2 className="size-[20px] text-[#c9190b] dark:text-[#ee0000] shrink-0 animate-spin" />
                    )}
                    {index > uninstallStep && (
                      <div className="size-[20px] rounded-full border-2 border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.2)] shrink-0" />
                    )}
                    <span
                      className={`text-[14px] ${
                        index <= uninstallStep
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
                Operator Uninstalled Successfully
              </p>
              <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                {operatorName} has been removed from your cluster
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] p-[24px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          {!isComplete && !isUninstalling && (
            <>
              <button
                onClick={handleClose}
                className="px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUninstall}
                disabled={!isConfirmed}
                className={`px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] text-white transition-colors ${
                  isConfirmed
                    ? "bg-[#c9190b] hover:bg-[#a30000] dark:bg-[#ee0000] dark:hover:bg-[#c92325]"
                    : "bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.1)] cursor-not-allowed"
                }`}
              >
                Uninstall operator
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
