import { X, AlertTriangle } from "@/lib/pfIcons";

interface PauseUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PauseUpdateModal({ isOpen, onClose, onConfirm }: PauseUpdateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm">
      <div className="app-glass-panel max-w-[500px] w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-[24px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white">
            Pause Cluster Update
          </h2>
          <button
            onClick={onClose}
            className="p-[8px] rounded-[999px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <X className="size-[20px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-[24px]">
          <div className="bg-[#fffbf0] dark:bg-[rgba(255,152,0,0.1)] border border-[#ffb300] dark:border-[#ffb74d] rounded-[8px] p-[16px] mb-[24px]">
            <div className="flex items-start gap-[12px]">
              <AlertTriangle className="size-[16px] text-[#ff9800] dark:text-[#ffb74d] shrink-0 mt-[2px]" />
              <div>
                <p className="font-semibold text-[#151515] dark:text-white text-[14px] mb-[8px]">
                  Important
                </p>
                <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                  Pausing the update will halt the update process at a safe checkpoint. The cluster will remain operational but incomplete until you resume the update.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[14px] text-[#151515] dark:text-white mb-[4px]">
            Are you sure you want to pause the cluster update?
          </p>
          <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            You can resume the update later from the cluster update page.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] p-[24px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={onClose}
            className="px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] text-[#151515] dark:text-white hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] bg-[#ff9800] hover:bg-[#e68900] dark:bg-[#ffb74d] dark:hover:bg-[#ff9800] text-white transition-colors"
          >
            Pause update
          </button>
        </div>
      </div>
    </div>
  );
}
