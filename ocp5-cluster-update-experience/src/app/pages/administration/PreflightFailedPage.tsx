import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, Sparkles, TriangleAlert, RefreshCw } from "@/lib/pfIcons";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useChat } from "../../contexts/ChatContext";

type ErrorScenario = {
  failedChecks: Array<{
    name: string;
    severity: "critical" | "warning";
    message: string;
    remediation: string;
    aiSuggestion?: string;
  }>;
  passedChecks: string[];
  aiContext: string;
};

const errorScenarios: Record<string, ErrorScenario> = {
  storage: {
    failedChecks: [
      {
        name: "Node Storage Capacity",
        severity: "critical",
        message: "Worker node 'worker-east-01' has insufficient storage. Only 5% free space remaining.",
        remediation: "Free up storage or expand node capacity to at least 20% free space before updating.",
        aiSuggestion: "I can help you identify which pods are consuming the most storage and suggest cleanup strategies.",
      },
    ],
    passedChecks: [
      "Cluster health check",
      "Operator compatibility",
      "Network connectivity",
      "etcd health",
      "API compatibility",
    ],
    aiContext: `I see that your pre-checks have failed with a storage capacity issue:

**Critical Issue:**
• Worker node 'worker-east-01' has insufficient storage (5% free)

**Diagnosis:**
This node needs at least 20% free storage to safely handle the update process. The update requires temporary storage for image downloads and rollback capabilities.

**Recommended Actions:**
1. Check pod logs and clean up old log files
2. Remove unused container images: \`oc adm prune images\`
3. Clear completed pods: \`oc delete pods --field-selector status.phase=Succeeded\`
4. Review PersistentVolumeClaims and expand if needed

Would you like me to guide you through any of these steps?`,
  },
  api: {
    failedChecks: [
      {
        name: "API Compatibility",
        severity: "warning",
        message: "Deprecated API 'apps/v1beta1' is still in use by 3 deployments.",
        remediation: "Update deployments to use 'apps/v1' API before proceeding with cluster update.",
        aiSuggestion: "I can help you identify which deployments are using deprecated APIs and how to migrate them.",
      },
    ],
    passedChecks: [
      "Cluster health check",
      "Operator compatibility",
      "Network connectivity",
      "etcd health",
      "Storage capacity",
    ],
    aiContext: `I see that your pre-checks have detected deprecated API usage:

**Warning:**
• 3 deployments are using deprecated API 'apps/v1beta1'

**Diagnosis:**
The apps/v1beta1 API was deprecated and will be removed in the target version. These deployments must be migrated to apps/v1 to ensure they continue working after the update.

**Recommended Actions:**
1. List affected deployments: \`oc get deployments --all-namespaces -o json | grep "apps/v1beta1"\`
2. For each deployment, update the apiVersion field from "apps/v1beta1" to "apps/v1"
3. Review and update any CI/CD pipelines or GitOps configurations
4. Re-run pre-checks to verify

Would you like me to provide specific commands for migrating these deployments?`,
  },
  operator: {
    failedChecks: [
      {
        name: "Operator Compatibility",
        severity: "critical",
        message: "Airflow Helm Operator v2.1.0 is incompatible with target cluster version 4.22.0.",
        remediation: "Update Airflow Helm Operator to v2.4.0 or newer before updating the cluster.",
        aiSuggestion: "I can guide you through updating the operator to a compatible version.",
      },
    ],
    passedChecks: [
      "Cluster health check",
      "Network connectivity",
      "etcd health",
      "Storage capacity",
      "API compatibility",
    ],
    aiContext: `I see that your pre-checks have detected an operator compatibility issue:

**Critical Issue:**
• Airflow Helm Operator v2.1.0 is incompatible with cluster version 4.22.0

**Diagnosis:**
The current version of Airflow Helm Operator uses APIs and features that are not compatible with OpenShift 4.22.0. You need to update to v2.4.0 or newer which includes compatibility fixes.

**Recommended Actions:**
1. Check the operator's update channel: \`oc get subscription airflow-helm-operator -n openshift-operators\`
2. Update the operator subscription to allow v2.4.0
3. Wait for the operator to update automatically
4. Verify the new version: \`oc get csv -n openshift-operators | grep airflow\`
5. Re-run pre-checks

Would you like detailed steps for updating this operator?`,
  },
  network: {
    failedChecks: [
      {
        name: "Network Connectivity",
        severity: "critical",
        message: "Unable to reach OpenShift image registry at registry.redhat.io. Connection timeout after 30s.",
        remediation: "Verify network connectivity and firewall rules allow access to required external registries.",
        aiSuggestion: "I can help you diagnose network connectivity issues and verify your firewall configuration.",
      },
    ],
    passedChecks: [
      "Cluster health check",
      "Operator compatibility",
      "etcd health",
      "Storage capacity",
    ],
    aiContext: `I see that your pre-checks have detected a network connectivity issue:

**Critical Issue:**
• Unable to reach OpenShift image registry at registry.redhat.io

**Diagnosis:**
The cluster cannot connect to the external image registry needed to pull update images. This could be due to firewall rules, proxy configuration, or network routing issues.

**Recommended Actions:**
1. Test connectivity: \`curl -I https://registry.redhat.io\`
2. Check proxy configuration: \`oc get proxy cluster -o yaml\`
3. Verify firewall allows HTTPS (443) to registry.redhat.io
4. Check DNS resolution: \`nslookup registry.redhat.io\`
5. Review network policies that might block egress traffic

Would you like me to help you diagnose which component is causing the connectivity issue?`,
  },
  etcd: {
    failedChecks: [
      {
        name: "etcd Health",
        severity: "critical",
        message: "etcd cluster member 'etcd-master-2' is reporting high latency (>500ms) and failing health checks.",
        remediation: "Investigate and resolve etcd performance issues before attempting cluster update.",
        aiSuggestion: "I can help you diagnose etcd performance issues and identify the root cause.",
      },
    ],
    passedChecks: [
      "Cluster health check",
      "Operator compatibility",
      "Network connectivity",
      "Storage capacity",
    ],
    aiContext: `I see that your pre-checks have detected an etcd health issue:

**Critical Issue:**
• etcd cluster member 'etcd-master-2' is reporting high latency (>500ms)

**Diagnosis:**
etcd is the critical data store for your cluster. High latency or health check failures can indicate disk I/O issues, network problems between control plane nodes, or resource exhaustion.

**Recommended Actions:**
1. Check etcd logs: \`oc logs -n openshift-etcd etcd-master-2\`
2. Verify disk I/O performance on the master node
3. Check etcd metrics: \`oc exec -n openshift-etcd etcd-master-2 -- etcdctl endpoint status\`
4. Review control plane node resources (CPU, memory, disk)
5. Check network latency between control plane nodes

Would you like me to help you investigate the specific cause of this latency issue?`,
  },
  multiple: {
    failedChecks: [
      {
        name: "Node Storage Capacity",
        severity: "critical",
        message: "Worker node 'worker-east-01' has insufficient storage. Only 5% free space remaining.",
        remediation: "Free up storage or expand node capacity to at least 20% free space before updating.",
      },
      {
        name: "API Compatibility",
        severity: "warning",
        message: "Deprecated API 'apps/v1beta1' is still in use by 3 deployments.",
        remediation: "Update deployments to use 'apps/v1' API before proceeding with cluster update.",
      },
      {
        name: "Operator Compatibility",
        severity: "warning",
        message: "Ansible Automation Platform operator version 3.1.0 requires manual approval before update.",
        remediation: "Review operator update requirements and approve update if compatible.",
      },
    ],
    passedChecks: [
      "Cluster health check",
      "Network connectivity",
      "etcd health",
    ],
    aiContext: `I see that your pre-checks have failed with multiple issues:

**Critical Issues:**
• Worker node 'worker-east-01' has insufficient storage (5% free)

**Warnings:**
• 3 deployments are using deprecated API 'apps/v1beta1'
• Ansible Automation Platform operator requires manual approval

**Diagnosis:**
You have a combination of storage, API compatibility, and operator update issues that need to be addressed before the cluster can be safely updated.

**Recommended Priority:**
1. **First:** Resolve the critical storage issue on worker-east-01
2. **Second:** Migrate deployments from deprecated APIs
3. **Third:** Review and approve operator updates

Would you like me to help you tackle these issues one at a time? I recommend starting with the storage issue since it's critical.`,
  },
};

export default function PreflightFailedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const errorType = location.state?.errorType || "storage";
  const aiMode = location.state?.aiMode || false;

  const { setIsOpen: setIsAIOpen } = useChat();
  const [showRemediation, setShowRemediation] = useState<number | null>(null);

  const scenario = errorScenarios[errorType] || errorScenarios.storage;
  const { failedChecks, passedChecks } = scenario;

  // Auto-open AI panel if in AI mode
  useEffect(() => {
    if (aiMode) {
      setIsAIOpen(true);
    }
  }, [aiMode]);

  const handleAskAI = () => {
    setIsAIOpen(true);
  };

  const handleRerunPreCheck = () => {
    navigate('/administration/cluster-update/preflight', {
      state: { aiMode: false, simulateError: false }
    });
  };

  return (
    <div className="ocs-app-page-outer h-full min-h-0 overflow-y-auto">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Administrator" },
            { label: "Cluster Settings", path: "/administration/cluster-settings" },
            { label: "Pre-check Failed" },
          ]}
        >

        <div className="mb-[24px]">
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            Pre-check Failed
          </h1>
          <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Some issues were detected that must be resolved before updating
          </p>
        </div>

        {/* Overall Status Card */}
        <div className="bg-[#fef6f5] dark:bg-[rgba(201,25,11,0.1)] border-2 border-[#c9190b] dark:border-[#ee0000] rounded-[16px] p-[24px] mb-[24px]">
          <div className="flex items-start gap-[16px]">
            <div className="flex-shrink-0 bg-[#c9190b] dark:bg-[#ee0000] rounded-[12px] p-[12px]">
              <XCircle className="size-[32px] text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[20px] mb-[8px]">
                Pre-checks Failed
              </h2>
              <p className="text-[14px] text-[#151515] dark:text-white mb-[16px]">
                We found <span className="font-semibold">{failedChecks.length} {failedChecks.length === 1 ? 'issue' : 'issues'}</span> that must be resolved before you can safely update to version 4.22.0.
              </p>
              <button
                onClick={handleAskAI}
                className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[20px] py-[10px] rounded-[8px] font-semibold text-[14px] transition-colors flex items-center gap-[8px]"
              >
                <Sparkles className="size-[16px]" />
                Get AI help to fix issues
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[24px] mb-[24px]">
          {/* Failed Checks */}
          <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[16px] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px] mb-[20px]">
              <XCircle className="size-[24px] text-[#c9190b]" />
              <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px]">
                Failed Checks ({failedChecks.length})
              </h3>
            </div>

            <div className="space-y-[16px]">
              {failedChecks.map((check, index) => (
                <div key={index} className="border-l-4 border-[#c9190b] bg-[#fef6f6] dark:bg-[rgba(201,25,11,0.05)] rounded-r-[8px] p-[16px]">
                  <div className="flex items-start gap-[12px] mb-[8px]">
                    {check.severity === "critical" ? (
                      <XCircle className="size-[18px] text-[#c9190b] flex-shrink-0 mt-[2px]" />
                    ) : (
                      <AlertTriangle className="size-[18px] text-[#ff9800] flex-shrink-0 mt-[2px]" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-[8px] mb-[4px]">
                        <h4 className="font-semibold text-[14px] text-[#151515] dark:text-white">
                          {check.name}
                        </h4>
                        <span className={`px-[8px] py-[2px] rounded-[999px] text-[11px] font-semibold uppercase ${
                          check.severity === "critical"
                            ? "bg-[#c9190b] text-white"
                            : "bg-[#ff9800] text-white"
                        }`}>
                          {check.severity}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[8px]">
                        {check.message}
                      </p>
                      <div className="bg-white dark:bg-[rgba(0,0,0,0.2)] rounded-[999px] p-[12px] mb-[8px]">
                        <p className="text-[12px] text-[#151515] dark:text-white">
                          <span className="font-semibold">Recommended action:</span> {check.remediation}
                        </p>
                      </div>
                      {check.aiSuggestion && (
                        <button
                          onClick={() => {
                            setShowRemediation(index);
                            handleAskAI();
                          }}
                          className="text-[#0066cc] dark:text-[#4dabf7] hover:underline text-[12px] font-semibold flex items-center gap-[4px]"
                        >
                          <Sparkles className="size-[12px]" />
                          Ask AI for help with this issue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Passed Checks */}
          <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[16px] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-[12px] mb-[20px]">
              <CheckCircle className="size-[24px] text-[#3e8635]" />
              <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[18px]">
                Passed Checks ({passedChecks.length})
              </h3>
            </div>

            <div className="space-y-[12px]">
              {passedChecks.map((check, index) => (
                <div key={index} className="flex items-center gap-[12px] p-[12px] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.1)] rounded-[8px]">
                  <CheckCircle className="size-[16px] text-[#3e8635] dark:text-[#81c784] flex-shrink-0" />
                  <span className="text-[14px] text-[#151515] dark:text-white">{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-[rgba(255,255,255,0.03)] rounded-[16px] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[16px]">
            Next Steps
          </h3>
          <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mb-[20px]">
            Choose how you'd like to proceed:
          </p>

          <div className="flex gap-[12px]">
            <button
              onClick={handleAskAI}
              className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[24px] py-[12px] rounded-[8px] font-semibold transition-colors flex items-center gap-[8px]"
            >
              <Sparkles className="size-[16px]" />
              Ask AI to help resolve issues
            </button>
            <button
              onClick={handleRerunPreCheck}
              className="bg-white dark:bg-[rgba(255,255,255,0.05)] border-2 border-[#c7c7c7] dark:border-[#707070] text-[#151515] dark:text-white px-[24px] py-[12px] rounded-[8px] font-semibold transition-colors flex items-center gap-[8px] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.05)]"
            >
              <RefreshCw className="size-[16px]" />
              Re-run preflight
            </button>
            <button
              onClick={() => navigate('/administration/cluster-settings')}
              className="border-2 border-[#c7c7c7] dark:border-[#707070] text-[#151515] dark:text-white px-[24px] py-[12px] rounded-[8px] font-semibold transition-colors hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.05)]"
            >
              Return to update plan
            </button>
          </div>
        </div>
        </Breadcrumbs>

    </div>
  );
}