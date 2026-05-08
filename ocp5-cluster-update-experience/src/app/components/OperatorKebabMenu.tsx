import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, RefreshCw, Trash2 } from "@/lib/pfIcons";
import { useNavigate } from "react-router";

interface OperatorKebabMenuProps {
  operatorName: string;
  operatorVersion: string;
  updateAvailable?: boolean;
  updateVersion?: string;
  onUpdate?: () => void;
  onUninstall?: () => void;
}

export default function OperatorKebabMenu({ 
  operatorName, 
  operatorVersion, 
  updateAvailable,
  updateVersion,
  onUpdate,
  onUninstall 
}: OperatorKebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleViewDetails = () => {
    setIsOpen(false);
    navigate(`/ecosystem/installed-operators/${encodeURIComponent(operatorName)}`);
  };

  const handleUpdate = () => {
    setIsOpen(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleUninstall = () => {
    setIsOpen(false);
    if (onUninstall) {
      onUninstall();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-[8px] rounded-[999px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        aria-label="More actions"
      >
        <MoreVertical className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-[4px] w-[220px] app-glass-panel app-glass-panel--radius-sm z-[9999]">
          <div className="py-[8px]">
            <button
              onClick={handleViewDetails}
              className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors text-left"
            >
              <Eye className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              <span className="text-[14px] text-[#151515] dark:text-white">View operator details</span>
            </button>

            {updateAvailable && (
              <button
                onClick={handleUpdate}
                className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-colors text-left"
              >
                <RefreshCw className="size-[16px] text-[#0066cc] dark:text-[#4dabf7]" />
                <div className="flex-1">
                  <span className="text-[14px] text-[#151515] dark:text-white block">Update operator</span>
                  {updateVersion && (
                    <span className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">to v{updateVersion}</span>
                  )}
                </div>
              </button>
            )}

            <div className="h-[1px] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)] my-[8px]" />

            <button
              onClick={handleUninstall}
              className="w-full px-[16px] py-[10px] flex items-center gap-[12px] hover:bg-[rgba(201,25,11,0.05)] dark:hover:bg-[rgba(201,25,11,0.15)] transition-colors text-left"
            >
              <Trash2 className="size-[16px] text-[#c9190b] dark:text-[#ee0000]" />
              <span className="text-[14px] text-[#c9190b] dark:text-[#ee0000]">Uninstall operator</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}