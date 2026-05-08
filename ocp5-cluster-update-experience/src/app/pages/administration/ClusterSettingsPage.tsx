import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Clock, ExternalLink, ChevronDown, ChevronUp, Loader2 } from "@/lib/pfIcons";
import { Link } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs";
import FavoriteButton from "../../components/FavoriteButton";

type SettingsTab = "details" | "cluster-operators" | "configuration";

interface ClusterOperator {
  name: string;
  version: string;
  available: boolean;
  progressing: boolean;
  degraded: boolean;
  message?: string;
  lastTransition: string;
}

const CLUSTER_OPERATORS: ClusterOperator[] = [
  { name: "authentication", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "2h ago" },
  { name: "cloud-controller-manager", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "cloud-credential", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "cluster-autoscaler", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "config-operator", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "console", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "1d ago" },
  { name: "dns", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "etcd", version: "5.0.12", available: true, progressing: false, degraded: true, message: "EtcdMembersDegraded: unhealthy member", lastTransition: "45m ago" },
  { name: "image-registry", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "ingress", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "insights", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "kube-apiserver", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "6h ago" },
  { name: "kube-controller-manager", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "6h ago" },
  { name: "kube-scheduler", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "6h ago" },
  { name: "kube-storage-version-migrator", version: "5.0.12", available: true, progressing: true, degraded: false, message: "StorageVersionMigration in progress", lastTransition: "15m ago" },
  { name: "machine-api", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "machine-approver", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "machine-config", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "2d ago" },
  { name: "marketplace", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "monitoring", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "1d ago" },
  { name: "network", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "node-tuning", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "openshift-apiserver", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "6h ago" },
  { name: "openshift-controller-manager", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "6h ago" },
  { name: "openshift-samples", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "operator-lifecycle-manager", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "operator-lifecycle-manager-catalog", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "service-ca", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
  { name: "storage", version: "5.0.12", available: true, progressing: false, degraded: false, lastTransition: "3d ago" },
];

interface ConfigResource {
  name: string;
  apiVersion: string;
  kind: string;
}

const CONFIG_RESOURCES: ConfigResource[] = [
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "APIServer" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Authentication" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Build" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Console" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "DNS" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "FeatureGate" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Image" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Infrastructure" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Ingress" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Network" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Node" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "OAuth" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "OperatorHub" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Project" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Proxy" },
  { name: "cluster", apiVersion: "config.openshift.io/v1", kind: "Scheduler" },
];

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-[4px] text-[12px] font-['Red_Hat_Text:Regular',sans-serif] ${ok ? "text-[#3e8635]" : "text-[#c9190b]"}`}>
      {ok ? <CheckCircle className="size-[13px]" /> : <AlertCircle className="size-[13px]" />}
      {label}
    </span>
  );
}

function ClusterOperatorsTab() {
  const [filter, setFilter] = useState("");
  const [expandedOp, setExpandedOp] = useState<string | null>(null);

  const filtered = CLUSTER_OPERATORS.filter((op) => op.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px] overflow-hidden">
      <div className="p-[16px] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#151515] dark:text-white font-['Red_Hat_Display:SemiBold',sans-serif]">
          {filtered.length} ClusterOperators
        </span>
        <input
          type="text"
          placeholder="Filter by name…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[13px] px-[10px] py-[6px] rounded-[6px] border border-[#d2d2d2] dark:border-[rgba(255,255,255,0.15)] bg-white dark:bg-[rgba(255,255,255,0.05)] text-[#151515] dark:text-white w-[220px] font-['Red_Hat_Text:Regular',sans-serif] outline-none focus:border-[#0066cc]"
        />
      </div>

      <table className="w-full text-[13px] font-['Red_Hat_Text:Regular',sans-serif]">
        <thead>
          <tr className="border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-left text-[12px] text-[#6a6e73] dark:text-[#8a8d90] uppercase tracking-wide">
            <th className="px-[16px] py-[10px] font-medium">Name</th>
            <th className="px-[16px] py-[10px] font-medium">Version</th>
            <th className="px-[16px] py-[10px] font-medium">Available</th>
            <th className="px-[16px] py-[10px] font-medium">Progressing</th>
            <th className="px-[16px] py-[10px] font-medium">Degraded</th>
            <th className="px-[16px] py-[10px] font-medium">Last Transition</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((op) => (
            <>
              <tr
                key={op.name}
                onClick={() => setExpandedOp(expandedOp === op.name ? null : op.name)}
                className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors ${op.degraded ? "bg-[#fff5f5] dark:bg-[rgba(201,25,11,0.06)]" : ""}`}
              >
                <td className="px-[16px] py-[10px]">
                  <div className="flex items-center gap-[6px]">
                    {expandedOp === op.name ? <ChevronUp className="size-[14px] text-[#6a6e73]" /> : <ChevronDown className="size-[14px] text-[#6a6e73]" />}
                    <span className="font-medium text-[#151515] dark:text-white">{op.name}</span>
                  </div>
                </td>
                <td className="px-[16px] py-[10px] font-mono text-[#4d4d4d] dark:text-[#b0b0b0]">{op.version}</td>
                <td className="px-[16px] py-[10px]"><StatusBadge ok={op.available} label={op.available ? "True" : "False"} /></td>
                <td className="px-[16px] py-[10px]">
                  {op.progressing
                    ? <span className="inline-flex items-center gap-[4px] text-[12px] text-[#0066cc] dark:text-[#4dabf7]"><Clock className="size-[13px]" /> True</span>
                    : <span className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">False</span>}
                </td>
                <td className="px-[16px] py-[10px]"><StatusBadge ok={!op.degraded} label={op.degraded ? "True" : "False"} /></td>
                <td className="px-[16px] py-[10px] text-[#4d4d4d] dark:text-[#b0b0b0]">{op.lastTransition}</td>
              </tr>
              {expandedOp === op.name && (
                <tr key={`${op.name}-detail`} className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
                  <td colSpan={6} className="px-[16px] py-[12px] bg-[#fafafa] dark:bg-[rgba(255,255,255,0.02)]">
                    <div className="grid grid-cols-2 gap-[16px] text-[13px]">
                      <div>
                        <span className="text-[11px] uppercase tracking-wide text-[#6a6e73] dark:text-[#8a8d90] block mb-[4px]">Operator</span>
                        <span className="font-mono text-[#151515] dark:text-white">{op.name}</span>
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wide text-[#6a6e73] dark:text-[#8a8d90] block mb-[4px]">Version</span>
                        <span className="font-mono text-[#151515] dark:text-white">{op.version}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[11px] uppercase tracking-wide text-[#6a6e73] dark:text-[#8a8d90] block mb-[4px]">Message</span>
                        <span className="text-[#4d4d4d] dark:text-[#b0b0b0]">{op.message || "All is well"}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConfigurationTab() {
  const [filter, setFilter] = useState("");
  const filtered = CONFIG_RESOURCES.filter(
    (r) => r.kind.toLowerCase().includes(filter.toLowerCase()) || r.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px] overflow-hidden">
      <div className="p-[16px] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <span className="text-[14px] font-semibold text-[#151515] dark:text-white font-['Red_Hat_Display:SemiBold',sans-serif]">
          {filtered.length} Configuration Resources
        </span>
        <input
          type="text"
          placeholder="Filter by kind…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[13px] px-[10px] py-[6px] rounded-[6px] border border-[#d2d2d2] dark:border-[rgba(255,255,255,0.15)] bg-white dark:bg-[rgba(255,255,255,0.05)] text-[#151515] dark:text-white w-[220px] font-['Red_Hat_Text:Regular',sans-serif] outline-none focus:border-[#0066cc]"
        />
      </div>

      <table className="w-full text-[13px] font-['Red_Hat_Text:Regular',sans-serif]">
        <thead>
          <tr className="border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-left text-[12px] text-[#6a6e73] dark:text-[#8a8d90] uppercase tracking-wide">
            <th className="px-[16px] py-[10px] font-medium">Name</th>
            <th className="px-[16px] py-[10px] font-medium">Kind</th>
            <th className="px-[16px] py-[10px] font-medium">API Version</th>
            <th className="px-[16px] py-[10px] font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={`${r.kind}-${r.name}`} className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <td className="px-[16px] py-[10px] font-medium text-[#151515] dark:text-white">{r.name}</td>
              <td className="px-[16px] py-[10px]">
                <span className="px-[8px] py-[3px] rounded-[4px] bg-[#f0f0f0] dark:bg-[rgba(255,255,255,0.08)] text-[12px] font-mono text-[#151515] dark:text-white">
                  {r.kind}
                </span>
              </td>
              <td className="px-[16px] py-[10px] font-mono text-[#4d4d4d] dark:text-[#b0b0b0]">{r.apiVersion}</td>
              <td className="px-[16px] py-[10px] text-right">
                <a href={`https://docs.openshift.com/container-platform/latest/rest_api/config_apis/${r.kind.toLowerCase()}-${r.apiVersion.split("/")[0]}-${r.apiVersion.split("/")[1]}.html`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[4px] text-[12px] text-[#0066cc] dark:text-[#4dabf7] no-underline hover:underline">
                  API Reference <ExternalLink className="size-[11px]" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ClusterSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("details");
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [updateVersion, setUpdateVersion] = useState("5.1.10");

  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem("clusterUpdateInProgress");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setIsUpdateInProgress(true);
          setUpdateVersion(data.version || "5.1.10");
        } catch { setIsUpdateInProgress(false); }
      } else {
        setIsUpdateInProgress(false);
      }
    };
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden ocs-app-page-outer ocs-app-page-outer--end-3xl">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "Cluster Settings" },
        ]}
      >

      <div className="mb-[24px]">
        <div className="flex items-center justify-between mb-[16px]">
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
            Cluster Settings
          </h1>
          <FavoriteButton name="Cluster Settings" path="/administration/cluster-settings" />
        </div>
        <div className="flex gap-[24px] text-[14px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          {([["details", "Details"], ["cluster-operators", "ClusterOperators"], ["configuration", "Configuration"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`pb-[12px] bg-transparent border-0 cursor-pointer font-['Red_Hat_Text:Regular',sans-serif] text-[14px] -mb-[1px] transition-colors ${activeTab === key ? "border-b-2 border-[#0066cc] dark:border-[#4dabf7] font-semibold text-[#151515] dark:text-white" : "text-[#4d4d4d] dark:text-[#b0b0b0] hover:text-[#151515] dark:hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "details" && (
        <>
          {isUpdateInProgress && (
            <div className="flex items-center gap-[12px] bg-[#e7f1fa] dark:bg-[rgba(0,102,204,0.08)] px-[16px] py-[12px] mb-[16px] rounded-[8px] border border-[#0066cc] dark:border-[#4dabf7]">
              <Loader2 className="size-[18px] text-[#0066cc] dark:text-[#4dabf7] shrink-0 animate-spin" />
              <p className="text-[#151515] dark:text-white text-[14px] font-['Red_Hat_Text:Regular',sans-serif] flex-1">
                <span className="font-medium">An update to {updateVersion} is in progress.</span> View the update status on the Cluster Update page.
              </p>
              <Link to="/administration/cluster-update/in-progress" state={{ version: updateVersion }} className="flex items-center gap-[4px] text-[#0066cc] dark:text-[#4dabf7] text-[13px] no-underline hover:underline whitespace-nowrap font-['Red_Hat_Text:Regular',sans-serif] font-medium">
                Review update progress <ExternalLink className="size-[14px]" />
              </Link>
            </div>
          )}

          <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[24px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] mb-[24px]">
            <div className="space-y-[20px]">
              <div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[8px]">Subscription</h3>
                <a href="https://console.redhat.com/openshift" target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline">OpenShift Cluster Manager</a>
              </div>
              <div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[8px]">Service Level Agreement (SLA)</h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">Self-support, 60 day trial</p>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">59 days remaining</p>
                <a href="https://console.redhat.com/openshift/subscriptions" target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline">Manage subscription settings</a>
              </div>
              <div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[8px]">Cluster ID</h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-mono">b86faa3-b06c-4a82-8fa7-54b80a92d4b2</p>
              </div>
              <div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[8px]">Desired release image</h3>
                <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] font-mono break-all">registry.ci.openshift.org/ocp/release@sha256:6dbbd6b0fa89c1c0223ae79b32fb3ff1a4fc2f3a96b352bf7fd487cd2023cd0c3ae499bfdd6b6c74297bf93f9bc2ea6b8c5b6dfda8e74297bf93</p>
              </div>
              <div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[8px]">Upstream configuration</h3>
                <a href="https://docs.openshift.com/container-platform/latest/updating/understanding_updates/understanding-update-channels-releases.html" target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline">https://apenshift-release.apps.ci.ci24.p1.openshiftapps.com/graph</a>
              </div>
              <div>
                <h3 className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[#151515] dark:text-white text-[16px] mb-[8px]">Cluster autoscaler</h3>
                <a href="https://docs.openshift.com/container-platform/latest/machine_management/applying-autoscaling.html" target="_blank" rel="noopener noreferrer" className="text-[14px] text-[#0066cc] dark:text-[#4dabf7] hover:underline">Create autoscaler</a>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "cluster-operators" && <ClusterOperatorsTab />}

      {activeTab === "configuration" && <ConfigurationTab />}
      </Breadcrumbs>
    </div>
  );
}
