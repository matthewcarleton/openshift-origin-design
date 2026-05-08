import { useState } from "react";
import { X, AlertTriangle } from "@/lib/pfIcons";

interface AbortUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AbortUpdateModal({ isOpen, onClose, onConfirm }: AbortUpdateModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText === "abort update";

  if (!isOpen) return null;

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setConfirmText("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm">
      <div className="app-glass-panel max-w-[500px] w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-[24px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white">
            Abort Cluster Update
          </h2>
          <button
            onClick={handleClose}
            className="p-[8px] rounded-[999px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <X className="size-[20px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-[24px]">
          <div className="bg-[#fff4f4] dark:bg-[rgba(201,37,45,0.1)] border-2 border-[#c92325] dark:border-[#f5a1a3] rounded-[8px] p-[16px] mb-[24px]">
            <div className="flex items-start gap-[12px]">
              <AlertTriangle className="size-[20px] text-[#c92325] dark:text-[#f5a1a3] shrink-0 mt-[2px]" />
              <div>
                <p className="font-semibold text-[#151515] dark:text-white text-[14px] mb-[8px]">
                  Warning: This action cannot be undone
                </p>
                <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
                  Aborting the update will:
                </p>
                <ul className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] list-disc list-inside space-y-[4px]">
                  <li>Roll back any incomplete changes</li>
                  <li>Leave the cluster in a mixed-version state</li>
                  <li>Require manual intervention to stabilize</li>
                  <li>Potentially impact cluster availability</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-[14px] text-[#151515] dark:text-white mb-[16px]">
            Only abort if the update has encountered critical failures. Consider pausing instead if you need to temporarily halt the update.
          </p>

          <div>
            <label className="block text-[14px] font-semibold text-[#151515] dark:text-white mb-[8px]">
              Type <code className="bg-[#f5f5f5] dark:bg-[rgba(255,255,255,0.1)] px-[6px] py-[2px] rounded-[4px] font-mono text-[13px]">abort update</code> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter text to confirm"
              className="w-full px-[12px] py-[10px] bg-white dark:bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)] rounded-[8px] text-[14px] text-[#151515] dark:text-white focus:outline-none focus:border-[#c92325] dark:focus:border-[#f5a1a3] transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] p-[24px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={handleClose}
            className="px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className={`px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] text-white transition-colors ${
              isConfirmed
                ? "bg-[#c9190b] hover:bg-[#a30000] dark:bg-[#ee0000] dark:hover:bg-[#c92325]"
                : "bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.1)] cursor-not-allowed"
            }`}
          >
            Abort update
          </button>
        </div>
      </div>
    </div>
  );
}
