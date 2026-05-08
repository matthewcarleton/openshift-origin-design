import { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, Loader2, CheckCircle2, Sparkles } from "@/lib/pfIcons";
import { useNavigate } from "react-router";
import { useChat } from "../contexts/ChatContext";

interface Operator {
  name: string;
  version: string;
  newVersion: string | null;
  status: string;
  statusType: string;
  updatePlan: string;
  clusterCompatibility: string;
  support: string;
  supportBadge: string;
  supportType: string;
  lastUpdated: string;
  required?: boolean;
}

interface RequiredUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  operators: Operator[];
}

export function RequiredUpdateModal({ isOpen, onClose, operators }: RequiredUpdateModalProps) {
  const [updateStage, setUpdateStage] = useState<'confirmation' | 'ai-analysis' | 'updating' | 'complete'>('confirmation');
  const [currentProgress, setCurrentProgress] = useState(0);
  const navigate = useNavigate();
  const { setIsOpen: setIsAIOpen, addMessage } = useChat();

  const requiredOperators = operators.filter(op => op.required && op.newVersion);

  const handleStartUpdate = () => {
    setUpdateStage('ai-analysis');
    
    // Add AI message
    addMessage({
      type: 'ai',
      content: `🤖 **Analyzing Required Operator Updates**\n\nI'm analyzing the compatibility and dependencies for:\n• ${requiredOperators.map(op => op.name).join('\n• ')}\n\nThis will take about 10-15 seconds...`,
    });
    setIsAIOpen(true);

    // Simulate AI analysis
    setTimeout(() => {
      addMessage({
        type: 'ai',
        content: `✅ **Analysis Complete**\n\n**Compatibility Check:** All operators are compatible with OpenShift 5.0.16\n\n**Update Order:**\n1. Abot Operator-v3.0.0 → v3.1.0\n2. Airflow Helm Operator → v5.7.3\n\n**Estimated Time:** 8-12 minutes\n\n**Impact Assessment:**\n• No downtime expected\n• Rolling updates will be used\n• Workloads will continue running\n\n**Recommendation:** ✅ Safe to proceed`,
      });
      
      setUpdateStage('updating');
      
      // Simulate update progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setCurrentProgress(progress);
        
        if (progress === 50) {
          addMessage({
            type: 'ai',
            content: `⏳ **Update Progress: 50%**\n\n✅ Abot Operator-v3.0.0 updated successfully\n🔄 Updating Airflow Helm Operator...`,
          });
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          setUpdateStage('complete');
          addMessage({
            type: 'ai',
            content: `🎉 **All Required Operators Updated!**\n\n✅ Abot Operator-v3.0.0 → v3.1.0\n✅ Airflow Helm Operator → v5.7.3\n\n**Next Steps:**\n1. Proceed with cluster update to OpenShift 5.0.16\n2. Monitor operator health for the next 24 hours\n3. Review update logs for any warnings\n\nWould you like to proceed with the cluster update now?`,
          });
        }
      }, 300);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[10000]" onClick={updateStage === 'updating' ? undefined : onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-[700px] max-h-[80vh] overflow-hidden">
        <div className="app-glass-panel">
          {/* Header */}
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px]">
              <AlertTriangle className="size-[24px] text-[#f0ab00]" />
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white">
                {updateStage === 'complete' ? 'Update Complete' : 'Required Operator Updates'}
              </h2>
            </div>
            {updateStage !== 'updating' && (
              <button
                onClick={onClose}
                className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] rounded-[4px] transition-colors"
              >
                <X className="size-[20px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-[24px] py-[20px] max-h-[500px] overflow-y-auto">
            {updateStage === 'confirmation' && (
              <>
                <div className="mb-[20px]">
                  <p className="text-[14px] text-[#151515] dark:text-[#b0b0b0] mb-[8px]">
                    The following operators must be updated before you can update to <strong>OpenShift 5.0.16</strong>:
                  </p>
                </div>

                {/* Operators Table */}
                <div className="bg-[#f8f8f8] dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[16px] mb-[20px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          Name
                        </th>
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          Current
                        </th>
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          New Version
                        </th>
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredOperators.map((op, index) => (
                        <tr key={op.name} className={index !== requiredOperators.length - 1 ? "border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]" : ""}>
                          <td className="py-[12px] text-[14px] text-[#151515] dark:text-white">
                            {op.name}
                          </td>
                          <td className="py-[12px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                            {op.version}
                          </td>
                          <td className="py-[12px] text-[14px] text-[#0066cc] dark:text-[#4dabf7] font-semibold">
                            {op.newVersion}
                          </td>
                          <td className="py-[12px]">
                            <span className="px-[8px] py-[2px] bg-[#e7f6fd] dark:bg-[rgba(43,154,243,0.15)] text-[#2b9af3] dark:text-[#73bcf7] rounded-[999px] text-[12px] font-semibold">
                              {op.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#e7f6fd] dark:bg-[rgba(43,154,243,0.1)] border border-[#2b9af3]/20 rounded-[12px] p-[16px] mb-[20px]">
                  <div className="flex items-start gap-[12px]">
                    <Sparkles className="size-[20px] text-[#2b9af3] dark:text-[#73bcf7] shrink-0 mt-[2px]" />
                    <div>
                      <p className="text-[13px] text-[#151515] dark:text-white font-semibold mb-[4px]">
                        AI-Powered Update Analysis
                      </p>
                      <p className="text-[13px] text-[#151515] dark:text-[#b0b0b0]">
                        OpenShift LightSpeed will analyze compatibility, dependencies, and potential risks before updating.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {updateStage === 'ai-analysis' && (
              <div className="text-center py-[40px]">
                <Loader2 className="size-[48px] text-[#0066cc] dark:text-[#4dabf7] animate-spin mx-auto mb-[20px]" />
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[8px]">
                  Analyzing Updates with AI
                </h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                  Checking compatibility, dependencies, and potential risks...
                </p>
              </div>
            )}

            {updateStage === 'updating' && (
              <div className="py-[20px]">
                <div className="mb-[24px]">
                  <div className="flex items-center justify-between mb-[12px]">
                    <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[16px] text-[#151515] dark:text-white">
                      Updating Operators
                    </h3>
                    <span className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] font-semibold">
                      {currentProgress}%
                    </span>
                  </div>
                  <div className="w-full h-[8px] bg-[#e0e0e0] dark:bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0066cc] dark:bg-[#4dabf7] transition-all duration-300 ease-out"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-[12px]">
                  {requiredOperators.map((op, index) => (
                    <div key={op.name} className="flex items-center gap-[12px] p-[12px] bg-[#f8f8f8] dark:bg-[rgba(255,255,255,0.03)] rounded-[8px]">
                      {currentProgress > (index + 1) * 50 ? (
                        <CheckCircle2 className="size-[20px] text-[#3e8635] dark:text-[#5ba352] shrink-0" />
                      ) : currentProgress > index * 50 ? (
                        <Loader2 className="size-[20px] text-[#0066cc] dark:text-[#4dabf7] animate-spin shrink-0" />
                      ) : (
                        <div className="size-[20px] shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-[14px] text-[#151515] dark:text-white font-medium">
                          {op.name}
                        </p>
                        <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                          {currentProgress > (index + 1) * 50 
                            ? `Updated to ${op.newVersion}`
                            : currentProgress > index * 50
                            ? 'Updating...'
                            : 'Waiting...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] text-center mt-[20px]">
                  Do not close this window. This may take several minutes.
                </p>
              </div>
            )}

            {updateStage === 'complete' && (
              <div className="text-center py-[40px]">
                <div className="size-[64px] bg-[#3e8635]/10 dark:bg-[rgba(91,163,82,0.15)] rounded-full flex items-center justify-center mx-auto mb-[20px]">
                  <CheckCircle2 className="size-[36px] text-[#3e8635] dark:text-[#5ba352]" />
                </div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white mb-[12px]">
                  All Required Operators Updated
                </h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[24px]">
                  You can now proceed with the cluster update to OpenShift 5.0.16
                </p>

                <div className="bg-[#f3faf2] dark:bg-[rgba(62,134,53,0.1)] rounded-[12px] p-[16px] text-left mb-[20px]">
                  <p className="text-[13px] text-[#151515] dark:text-white font-semibold mb-[8px]">
                    Updated Operators:
                  </p>
                  <ul className="space-y-[4px]">
                    {requiredOperators.map(op => (
                      <li key={op.name} className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] flex items-center gap-[8px]">
                        <CheckCircle2 className="size-[14px] text-[#3e8635] dark:text-[#5ba352]" />
                        {op.name} → {op.newVersion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            {updateStage === 'confirmation' && (
              <>
                <button
                  onClick={onClose}
                  className="px-[16px] py-[10px] bg-transparent hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] text-[#151515] dark:text-white rounded-[8px] font-semibold text-[14px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartUpdate}
                  className="px-[16px] py-[10px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]"
                >
                  <Sparkles className="size-[16px]" />
                  Start AI-Assisted Update
                </button>
              </>
            )}

            {updateStage === 'ai-analysis' && (
              <div className="flex items-center gap-[8px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                <Loader2 className="size-[16px] animate-spin" />
                Analyzing...
              </div>
            )}

            {updateStage === 'updating' && (
              <div className="flex items-center gap-[8px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                <Loader2 className="size-[16px] animate-spin" />
                Updating operators...
              </div>
            )}

            {updateStage === 'complete' && (
              <>
                <button
                  onClick={onClose}
                  className="px-[16px] py-[10px] bg-transparent hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] text-[#151515] dark:text-white rounded-[8px] font-semibold text-[14px] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate('/administration/cluster-settings')}
                  className="px-[16px] py-[10px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[8px] font-semibold text-[14px] transition-colors"
                >
                  View Cluster Update Plan
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOperators: string[];
  operators: Operator[];
  /** Called when the simulated bulk install completes — parent should update table rows. */
  onBulkComplete?: (updatedOperatorNames: string[]) => void;
}

export function BulkUpdateModal({ isOpen, onClose, selectedOperators, operators, onBulkComplete }: BulkUpdateModalProps) {
  const [updateStage, setUpdateStage] = useState<'confirmation' | 'ai-analysis' | 'updating' | 'complete'>('confirmation');
  const [currentProgress, setCurrentProgress] = useState(0);
  /** Snapshot of operators being updated — parent clears `newVersion` after completion, so we must not rely on live `operators` for the success screen. */
  const [bulkRun, setBulkRun] = useState<Operator[]>([]);
  const bulkRunRef = useRef<Operator[]>([]);
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { setIsOpen: setIsAIOpen, addMessage } = useChat();

  const selectedOps = operators.filter(op => selectedOperators.includes(op.name) && op.newVersion);

  /** Rows to show in the modal after a run has started (confirmation still uses live selectedOps). */
  const activeRunOps = bulkRun.length > 0 ? bulkRun : selectedOps;

  const clearBulkTimers = () => {
    if (analysisTimeoutRef.current !== null) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleStartUpdate = () => {
    if (selectedOps.length === 0) return;
    const snapshot = selectedOps.map((o) => ({ ...o }));
    bulkRunRef.current = snapshot;
    setBulkRun(snapshot);

    setUpdateStage('ai-analysis');

    addMessage({
      type: 'ai',
      content: `🤖 **Analyzing Bulk Operator Updates**\n\nI'm analyzing ${snapshot.length} operator(s) for compatibility and dependencies:\n\n${snapshot.map(op => `• ${op.name} (${op.version} → ${op.newVersion})`).join('\n')}\n\nThis will take about 10-15 seconds...`,
    });
    setIsAIOpen(true);

    analysisTimeoutRef.current = setTimeout(() => {
      analysisTimeoutRef.current = null;
      const runOps = bulkRunRef.current;
      if (runOps.length === 0) return;

      addMessage({
        type: 'ai',
        content: `✅ **Bulk Update Analysis Complete**\n\n**Compatibility Check:** All selected operators are compatible\n\n**Update Order:** ${runOps.map((op, i) => `\n${i + 1}. ${op.name} → ${op.newVersion}`).join('')}\n\n**Estimated Time:** ${runOps.length * 4}-${runOps.length * 6} minutes\n\n**Impact Assessment:**\n• No conflicts detected\n• Rolling updates will be used\n• Minimal service disruption\n\n**Recommendation:** ✅ Safe to proceed`,
      });

      setUpdateStage('updating');

      let progress = 0;
      const progressPerOperator = 100 / runOps.length;

      progressIntervalRef.current = setInterval(() => {
        progress += 2;
        setCurrentProgress(Math.min(progress, 100));

        const completedOps = Math.floor(progress / progressPerOperator);

        if (completedOps > 0 && progress % progressPerOperator < 2) {
          const op = runOps[completedOps - 1];
          addMessage({
            type: 'ai',
            content: `✅ **${op.name}** updated successfully (${op.version} → ${op.newVersion})`,
          });
        }

        if (progress >= 100) {
          if (progressIntervalRef.current !== null) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          onBulkComplete?.(runOps.map((o) => o.name));
          setUpdateStage('complete');
          addMessage({
            type: 'ai',
            content: `🎉 **All ${runOps.length} Operators Updated Successfully!**\n\n${runOps.map(op => `✅ ${op.name} → ${op.newVersion}`).join('\n')}\n\n**Next Steps:**\n1. Monitor operator health for the next 24 hours\n2. Review update logs for any warnings\n3. Test affected workloads\n\nAll systems are running normally!`,
          });
        }
      }, 150);
    }, 3000);
  };

  // Reset state when modal opens; clear timers when it closes
  useEffect(() => {
    if (isOpen) {
      setUpdateStage('confirmation');
      setCurrentProgress(0);
      setBulkRun([]);
      bulkRunRef.current = [];
      clearBulkTimers();
    } else {
      clearBulkTimers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[10000]" onClick={updateStage === 'updating' ? undefined : onClose} />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-[700px] max-h-[80vh] overflow-hidden">
        <div className="app-glass-panel">
          {/* Header */}
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px]">
              <div className="size-[24px] bg-[#0066cc] dark:bg-[#4dabf7] rounded-full flex items-center justify-center text-white text-[12px] font-bold">
                {activeRunOps.length}
              </div>
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white">
                {updateStage === 'complete' ? 'Update Complete' : 'Approve Operator Updates'}
              </h2>
            </div>
            {updateStage !== 'updating' && (
              <button
                onClick={onClose}
                className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] rounded-[4px] transition-colors"
              >
                <X className="size-[20px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-[24px] py-[20px] max-h-[500px] overflow-y-auto">
            {updateStage === 'confirmation' && (
              <>
                <div className="mb-[20px]">
                  <p className="text-[14px] text-[#151515] dark:text-[#b0b0b0] mb-[8px]">
                    You selected <strong>{selectedOperators.length} operator(s)</strong> in the table.
                    {activeRunOps.length > 0 ? (
                      <> The following <strong>{activeRunOps.length}</strong> have an <strong>update available</strong> and will be approved in this run:</>
                    ) : (
                      <> None of the selected operators currently have an update available in the catalog—choose rows that show <strong>Update available</strong>, or use the row actions menu.</>
                    )}
                  </p>
                </div>

                {/* Operators Table */}
                {activeRunOps.length > 0 ? (
                <div className="bg-[#f8f8f8] dark:bg-[rgba(255,255,255,0.03)] rounded-[12px] p-[16px] mb-[20px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          Name
                        </th>
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          Current
                        </th>
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          New Version
                        </th>
                        <th className="text-left pb-[12px] font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[13px] text-[#151515] dark:text-white">
                          Plan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRunOps.map((op, index) => (
                        <tr key={op.name} className={index !== activeRunOps.length - 1 ? "border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]" : ""}>
                          <td className="py-[12px] text-[14px] text-[#151515] dark:text-white">
                            {op.name}
                            {op.required && (
                              <span className="ml-[8px] px-[6px] py-[2px] bg-[#f0ab00] text-white rounded-[4px] text-[10px] font-semibold">
                                Required
                              </span>
                            )}
                          </td>
                          <td className="py-[12px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                            {op.version}
                          </td>
                          <td className="py-[12px] text-[14px] text-[#0066cc] dark:text-[#4dabf7] font-semibold">
                            {op.newVersion}
                          </td>
                          <td className="py-[12px] text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                            {op.updatePlan}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : null}

                {activeRunOps.length > 0 ? (
                <div className="bg-[#e7f6fd] dark:bg-[rgba(43,154,243,0.1)] border border-[#2b9af3]/20 rounded-[12px] p-[16px] mb-[20px]">
                  <div className="flex items-start gap-[12px]">
                    <Sparkles className="size-[20px] text-[#2b9af3] dark:text-[#73bcf7] shrink-0 mt-[2px]" />
                    <div>
                      <p className="text-[13px] text-[#151515] dark:text-white font-semibold mb-[4px]">
                        AI-Powered Update Analysis
                      </p>
                      <p className="text-[13px] text-[#151515] dark:text-[#b0b0b0]">
                        OpenShift LightSpeed will analyze compatibility, update order, and potential conflicts before updating.
                      </p>
                    </div>
                  </div>
                </div>
                ) : null}
              </>
            )}

            {updateStage === 'ai-analysis' && (
              <div className="text-center py-[40px]">
                <Loader2 className="size-[48px] text-[#0066cc] dark:text-[#4dabf7] animate-spin mx-auto mb-[20px]" />
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[18px] text-[#151515] dark:text-white mb-[8px]">
                  Analyzing {activeRunOps.length} Operator Updates with AI
                </h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                  Checking compatibility, update order, and potential conflicts...
                </p>
              </div>
            )}

            {updateStage === 'updating' && (
              <div className="py-[20px]">
                <div className="mb-[24px]">
                  <div className="flex items-center justify-between mb-[12px]">
                    <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[16px] text-[#151515] dark:text-white">
                      Updating {activeRunOps.length} Operators
                    </h3>
                    <span className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] font-semibold">
                      {currentProgress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-[8px] bg-[#e0e0e0] dark:bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0066cc] dark:bg-[#4dabf7] transition-all duration-300 ease-out"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-[12px]">
                  {activeRunOps.map((op, index) => {
                    const progressPerOp = 100 / activeRunOps.length;
                    const isComplete = currentProgress > (index + 1) * progressPerOp;
                    const isInProgress = currentProgress > index * progressPerOp && !isComplete;
                    
                    return (
                      <div key={op.name} className="flex items-center gap-[12px] p-[12px] bg-[#f8f8f8] dark:bg-[rgba(255,255,255,0.03)] rounded-[8px]">
                        {isComplete ? (
                          <CheckCircle2 className="size-[20px] text-[#3e8635] dark:text-[#5ba352] shrink-0" />
                        ) : isInProgress ? (
                          <Loader2 className="size-[20px] text-[#0066cc] dark:text-[#4dabf7] animate-spin shrink-0" />
                        ) : (
                          <div className="size-[20px] shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-[14px] text-[#151515] dark:text-white font-medium">
                            {op.name}
                          </p>
                          <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                            {isComplete 
                              ? `Updated to ${op.newVersion}`
                              : isInProgress
                              ? 'Updating...'
                              : 'Waiting...'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] text-center mt-[20px]">
                  Do not close this window. This may take several minutes.
                </p>
              </div>
            )}

            {updateStage === 'complete' && (
              <div className="text-center py-[40px]">
                <div className="size-[64px] bg-[#3e8635]/10 dark:bg-[rgba(91,163,82,0.15)] rounded-full flex items-center justify-center mx-auto mb-[20px]">
                  <CheckCircle2 className="size-[36px] text-[#3e8635] dark:text-[#5ba352]" />
                </div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[20px] text-[#151515] dark:text-white mb-[12px]">
                  {activeRunOps.length} Operator{activeRunOps.length !== 1 ? "s" : ""} Updated Successfully
                </h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[24px]">
                  All selected operators have been updated to their latest versions
                </p>

                <div className="bg-[#f3faf2] dark:bg-[rgba(62,134,53,0.1)] rounded-[12px] p-[16px] text-left mb-[20px]">
                  <p className="text-[13px] text-[#151515] dark:text-white font-semibold mb-[8px]">
                    Updated Operators:
                  </p>
                  <ul className="space-y-[4px]">
                    {activeRunOps.map(op => (
                      <li key={op.name} className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] flex items-center gap-[8px]">
                        <CheckCircle2 className="size-[14px] text-[#3e8635] dark:text-[#5ba352]" />
                        {op.name} → {op.newVersion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            {updateStage === 'confirmation' && (
              <>
                <button
                  onClick={onClose}
                  className="px-[16px] py-[10px] bg-transparent hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.08)] text-[#151515] dark:text-white rounded-[8px] font-semibold text-[14px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartUpdate}
                  disabled={selectedOps.length === 0}
                  className={`px-[16px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px] ${
                    selectedOps.length === 0
                      ? "bg-[#d2d2d2] dark:bg-[#4d4d4d] text-[#8a8d90] cursor-not-allowed"
                      : "bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white cursor-pointer"
                  }`}
                >
                  <Sparkles className="size-[16px]" />
                  Start AI-Assisted Update
                </button>
              </>
            )}

            {updateStage === 'ai-analysis' && (
              <div className="flex items-center gap-[8px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                <Loader2 className="size-[16px] animate-spin" />
                Analyzing...
              </div>
            )}

            {updateStage === 'updating' && (
              <div className="flex items-center gap-[8px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                <Loader2 className="size-[16px] animate-spin" />
                Updating {activeRunOps.length} operators...
              </div>
            )}

            {updateStage === 'complete' && (
              <button
                onClick={onClose}
                className="px-[16px] py-[10px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[8px] font-semibold text-[14px] transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}