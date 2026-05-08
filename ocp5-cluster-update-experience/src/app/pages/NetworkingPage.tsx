import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, RefreshCw, MoreVertical, Network, Globe, Lock, Shield, ExternalLink,
  Plus, X, CheckCircle2, AlertTriangle, ArrowUpRight, Copy, ChevronRight,
  Edit, Trash2, Eye, Terminal, ArrowLeftRight, Filter
} from "@/lib/pfIcons";
import Breadcrumbs from "../components/Breadcrumbs";
import FavoriteButton from "../components/FavoriteButton";

type TabType = "services" | "routes" | "ingresses" | "networkpolicies";

interface Service {
  name: string;
  namespace: string;
  type: "ClusterIP" | "NodePort" | "LoadBalancer" | "ExternalName";
  clusterIP: string;
  externalIP: string;
  ports: { port: number; targetPort: number; protocol: string; nodePort?: number }[];
  selector: Record<string, string>;
  age: string;
  endpoints: number;
}

interface Route {
  name: string;
  namespace: string;
  host: string;
  path: string;
  service: string;
  targetPort: string;
  tls: "edge" | "passthrough" | "reencrypt" | "none";
  status: "Accepted" | "Rejected" | "Pending";
  age: string;
}

interface Ingress {
  name: string;
  namespace: string;
  host: string;
  ingressClass: string;
  rules: { host: string; path: string; service: string; port: number }[];
  tls: boolean;
  age: string;
}

interface NetworkPolicy {
  name: string;
  namespace: string;
  podSelector: string;
  policyTypes: ("Ingress" | "Egress")[];
  ingressRules: number;
  egressRules: number;
  age: string;
}

const SERVICES: Service[] = [
  { name: "frontend-svc", namespace: "production", type: "ClusterIP", clusterIP: "10.96.45.101", externalIP: "<none>", ports: [{ port: 80, targetPort: 8080, protocol: "TCP" }], selector: { app: "frontend" }, age: "12d", endpoints: 3 },
  { name: "api-gateway-svc", namespace: "production", type: "LoadBalancer", clusterIP: "10.96.45.102", externalIP: "34.123.45.67", ports: [{ port: 443, targetPort: 8443, protocol: "TCP" }, { port: 80, targetPort: 8080, protocol: "TCP" }], selector: { app: "api-gateway" }, age: "8d", endpoints: 3 },
  { name: "cart-svc", namespace: "production", type: "ClusterIP", clusterIP: "10.96.45.103", externalIP: "<none>", ports: [{ port: 8080, targetPort: 8080, protocol: "TCP" }], selector: { app: "cart-service" }, age: "5d", endpoints: 2 },
  { name: "postgres-svc", namespace: "production", type: "ClusterIP", clusterIP: "10.96.45.104", externalIP: "<none>", ports: [{ port: 5432, targetPort: 5432, protocol: "TCP" }], selector: { app: "postgres" }, age: "89d", endpoints: 1 },
  { name: "redis-svc", namespace: "production", type: "ClusterIP", clusterIP: "10.96.45.105", externalIP: "<none>", ports: [{ port: 6379, targetPort: 6379, protocol: "TCP" }], selector: { app: "redis" }, age: "45d", endpoints: 1 },
  { name: "prometheus-svc", namespace: "monitoring", type: "ClusterIP", clusterIP: "10.96.45.106", externalIP: "<none>", ports: [{ port: 9090, targetPort: 9090, protocol: "TCP" }], selector: { app: "prometheus" }, age: "67d", endpoints: 2 },
  { name: "grafana-svc", namespace: "monitoring", type: "NodePort", clusterIP: "10.96.45.107", externalIP: "<none>", ports: [{ port: 3000, targetPort: 3000, protocol: "TCP", nodePort: 32000 }], selector: { app: "grafana" }, age: "23d", endpoints: 1 },
  { name: "elasticsearch-svc", namespace: "logging", type: "ClusterIP", clusterIP: "10.96.45.108", externalIP: "<none>", ports: [{ port: 9200, targetPort: 9200, protocol: "TCP" }, { port: 9300, targetPort: 9300, protocol: "TCP" }], selector: { app: "elasticsearch" }, age: "156d", endpoints: 3 },
];

const ROUTES: Route[] = [
  { name: "frontend-route", namespace: "production", host: "shop.apps.ocp.example.com", path: "/", service: "frontend-svc", targetPort: "8080-tcp", tls: "edge", status: "Accepted", age: "12d" },
  { name: "api-route", namespace: "production", host: "api.apps.ocp.example.com", path: "/v1", service: "api-gateway-svc", targetPort: "8443-tcp", tls: "reencrypt", status: "Accepted", age: "8d" },
  { name: "auth-route", namespace: "production", host: "auth.apps.ocp.example.com", path: "/", service: "auth-svc", targetPort: "8080-tcp", tls: "edge", status: "Accepted", age: "15d" },
  { name: "grafana-route", namespace: "monitoring", host: "grafana.apps.ocp.example.com", path: "/", service: "grafana-svc", targetPort: "3000-tcp", tls: "edge", status: "Accepted", age: "23d" },
  { name: "kibana-route", namespace: "logging", host: "kibana.apps.ocp.example.com", path: "/", service: "kibana-svc", targetPort: "5601-tcp", tls: "edge", status: "Pending", age: "2d" },
];

const INGRESSES: Ingress[] = [
  { name: "main-ingress", namespace: "production", host: "*.production.example.com", ingressClass: "openshift-default", rules: [{ host: "shop.production.example.com", path: "/", service: "frontend-svc", port: 80 }, { host: "api.production.example.com", path: "/v1", service: "api-gateway-svc", port: 443 }], tls: true, age: "45d" },
  { name: "monitoring-ingress", namespace: "monitoring", host: "*.monitoring.example.com", ingressClass: "openshift-default", rules: [{ host: "grafana.monitoring.example.com", path: "/", service: "grafana-svc", port: 3000 }], tls: true, age: "67d" },
];

const NETWORK_POLICIES: NetworkPolicy[] = [
  { name: "deny-all-default", namespace: "production", podSelector: "<all pods>", policyTypes: ["Ingress", "Egress"], ingressRules: 0, egressRules: 0, age: "89d" },
  { name: "allow-frontend-ingress", namespace: "production", podSelector: "app=frontend", policyTypes: ["Ingress"], ingressRules: 2, egressRules: 0, age: "89d" },
  { name: "allow-api-to-db", namespace: "production", podSelector: "app=api-gateway", policyTypes: ["Egress"], ingressRules: 0, egressRules: 1, age: "89d" },
  { name: "allow-monitoring", namespace: "monitoring", podSelector: "<all pods>", policyTypes: ["Ingress"], ingressRules: 1, egressRules: 0, age: "67d" },
  { name: "allow-logging-ingress", namespace: "logging", podSelector: "app=elasticsearch", policyTypes: ["Ingress"], ingressRules: 3, egressRules: 0, age: "156d" },
];

// ── Detail Panel ──
function DetailPanel({ type, item, onClose }: { type: TabType; item: any; onClose: () => void }) {
  return (
    <div className="w-[380px] h-full border-l border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1a1a1a] flex flex-col overflow-hidden shrink-0">
      <div className="px-[16px] py-[14px] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] flex items-center gap-[12px]">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] text-[#151515] dark:text-white truncate">{item.name}</h3>
          <p className="text-[12px] text-[#6a6e73]">{item.namespace}</p>
        </div>
        <button onClick={onClose} className="p-[6px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[999px]">
          <X className="size-[16px] text-[#6a6e73]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-[16px]">
        {type === "services" && (() => {
          const svc = item as Service;
          return (
            <div className="flex flex-col gap-[16px]">
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Service Details</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[6px] text-[12px]">
                  <span className="text-[#6a6e73]">Type</span>
                  <span className="font-mono text-[#151515] dark:text-white">{svc.type}</span>
                  <span className="text-[#6a6e73]">Cluster IP</span>
                  <span className="font-mono text-[#151515] dark:text-white">{svc.clusterIP}</span>
                  <span className="text-[#6a6e73]">External IP</span>
                  <span className="font-mono text-[#151515] dark:text-white">{svc.externalIP}</span>
                  <span className="text-[#6a6e73]">Endpoints</span>
                  <span className="text-[#151515] dark:text-white">{svc.endpoints} ready</span>
                  <span className="text-[#6a6e73]">Age</span>
                  <span className="text-[#151515] dark:text-white">{svc.age}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Ports</p>
                <div className="flex flex-col gap-[4px]">
                  {svc.ports.map((p, i) => (
                    <div key={i} className="flex items-center gap-[8px] px-[10px] py-[6px] rounded-[999px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.03)] text-[12px] font-mono text-[#151515] dark:text-white">
                      <ArrowLeftRight className="size-[12px] text-[#6a6e73]" />
                      {p.port} → {p.targetPort}/{p.protocol}
                      {p.nodePort && <span className="text-[#6a6e73] text-[11px]">(NodePort: {p.nodePort})</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Selector</p>
                <div className="flex flex-wrap gap-[4px]">
                  {Object.entries(svc.selector).map(([k, v]) => (
                    <span key={k} className="px-[8px] py-[2px] text-[11px] rounded-[4px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] text-[#151515] dark:text-white font-mono">
                      {k}={v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
        {type === "routes" && (() => {
          const rt = item as Route;
          return (
            <div className="flex flex-col gap-[16px]">
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Route Details</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[6px] text-[12px]">
                  <span className="text-[#6a6e73]">Host</span>
                  <a href="#" className="font-mono text-[#0066cc] dark:text-[#4dabf7] flex items-center gap-[4px] hover:underline" onClick={(e) => e.preventDefault()}>
                    <ExternalLink className="size-[11px]" /> {rt.host}
                  </a>
                  <span className="text-[#6a6e73]">Path</span>
                  <span className="font-mono text-[#151515] dark:text-white">{rt.path}</span>
                  <span className="text-[#6a6e73]">Service</span>
                  <span className="font-mono text-[#151515] dark:text-white">{rt.service}</span>
                  <span className="text-[#6a6e73]">Target Port</span>
                  <span className="font-mono text-[#151515] dark:text-white">{rt.targetPort}</span>
                  <span className="text-[#6a6e73]">TLS</span>
                  <span className={`px-[6px] py-[1px] rounded-[4px] text-[11px] font-semibold w-fit ${rt.tls !== "none" ? "text-[#3e8635] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.1)]" : "text-[#6a6e73] bg-[rgba(0,0,0,0.05)]"}`}>
                    {rt.tls === "none" ? "Not Secured" : rt.tls}
                  </span>
                  <span className="text-[#6a6e73]">Status</span>
                  <span className={`flex items-center gap-[4px] text-[12px] ${rt.status === "Accepted" ? "text-[#3e8635]" : rt.status === "Rejected" ? "text-[#c9190b]" : "text-[#f0ab00]"}`}>
                    {rt.status === "Accepted" ? <CheckCircle2 className="size-[12px]" /> : <AlertTriangle className="size-[12px]" />}
                    {rt.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Traffic Flow</p>
                <div className="flex items-center gap-[8px] text-[11px] text-[#151515] dark:text-white font-mono">
                  <span className="px-[6px] py-[2px] rounded-[4px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)]">{rt.host}</span>
                  <ChevronRight className="size-[12px] text-[#6a6e73]" />
                  <span className="px-[6px] py-[2px] rounded-[4px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)]">{rt.service}</span>
                  <ChevronRight className="size-[12px] text-[#6a6e73]" />
                  <span className="px-[6px] py-[2px] rounded-[4px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)]">:{rt.targetPort}</span>
                </div>
              </div>
            </div>
          );
        })()}
        {type === "ingresses" && (() => {
          const ing = item as Ingress;
          return (
            <div className="flex flex-col gap-[16px]">
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Ingress Details</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[6px] text-[12px]">
                  <span className="text-[#6a6e73]">Class</span>
                  <span className="font-mono text-[#151515] dark:text-white">{ing.ingressClass}</span>
                  <span className="text-[#6a6e73]">TLS</span>
                  <span className={`flex items-center gap-[4px] ${ing.tls ? "text-[#3e8635]" : "text-[#6a6e73]"}`}>
                    <Lock className="size-[12px]" /> {ing.tls ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Rules ({ing.rules.length})</p>
                <div className="flex flex-col gap-[6px]">
                  {ing.rules.map((r, i) => (
                    <div key={i} className="px-[10px] py-[8px] rounded-[999px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.03)] text-[12px]">
                      <div className="font-mono text-[#151515] dark:text-white">{r.host}{r.path}</div>
                      <div className="text-[11px] text-[#6a6e73] mt-[2px]">→ {r.service}:{r.port}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
        {type === "networkpolicies" && (() => {
          const np = item as NetworkPolicy;
          return (
            <div className="flex flex-col gap-[16px]">
              <div>
                <p className="text-[11px] text-[#6a6e73] uppercase tracking-wider mb-[6px]">Policy Details</p>
                <div className="grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[6px] text-[12px]">
                  <span className="text-[#6a6e73]">Pod Selector</span>
                  <span className="font-mono text-[#151515] dark:text-white">{np.podSelector}</span>
                  <span className="text-[#6a6e73]">Policy Types</span>
                  <div className="flex gap-[4px]">
                    {np.policyTypes.map((pt) => (
                      <span key={pt} className="px-[6px] py-[1px] rounded-[4px] text-[11px] font-semibold bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] text-[#151515] dark:text-white">{pt}</span>
                    ))}
                  </div>
                  <span className="text-[#6a6e73]">Ingress Rules</span>
                  <span className="text-[#151515] dark:text-white">{np.ingressRules}</span>
                  <span className="text-[#6a6e73]">Egress Rules</span>
                  <span className="text-[#151515] dark:text-white">{np.egressRules}</span>
                </div>
              </div>
              {np.ingressRules === 0 && np.egressRules === 0 && (
                <div className="flex items-start gap-[8px] p-[10px] rounded-[8px] bg-[#fff4e5] dark:bg-[rgba(240,171,0,0.1)]">
                  <AlertTriangle className="size-[14px] text-[#f0ab00] mt-[1px] shrink-0" />
                  <p className="text-[12px] text-[#8a6d3b] dark:text-[#f0ab00]">
                    This policy has no rules and will deny all {np.policyTypes.join(" and ").toLowerCase()} traffic to matching pods.
                  </p>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="px-[16px] py-[12px] border-t border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] flex gap-[8px]">
        <button className="flex-1 flex items-center justify-center gap-[6px] px-[12px] py-[8px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[999px] text-[12px] font-semibold transition-colors">
          <Edit className="size-[12px]" /> Edit YAML
        </button>
        <button className="p-[8px] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,255,255,0.15)] rounded-[999px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-colors" title="Delete">
          <Trash2 className="size-[14px] text-[#c9190b]" />
        </button>
      </div>
    </div>
  );
}

export default function NetworkingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const namespaces = ["all", "production", "development", "logging", "monitoring"];

  const tabs: { key: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "services", label: "Services", icon: <Network className="size-[14px]" />, count: SERVICES.length },
    { key: "routes", label: "Routes", icon: <Globe className="size-[14px]" />, count: ROUTES.length },
    { key: "ingresses", label: "Ingresses", icon: <ExternalLink className="size-[14px]" />, count: INGRESSES.length },
    { key: "networkpolicies", label: "NetworkPolicies", icon: <Shield className="size-[14px]" />, count: NETWORK_POLICIES.length },
  ];

  const filterByNsAndSearch = <T extends { name: string; namespace: string }>(items: T[]) =>
    items.filter((i) => {
      const matchNs = selectedNamespace === "all" || i.namespace === selectedNamespace;
      const matchSearch = !searchTerm || i.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchNs && matchSearch;
    });

  const svcTypeColor: Record<string, string> = {
    ClusterIP: "text-[#0066cc] bg-[#e7f1fa] dark:bg-[rgba(79,171,247,0.15)]",
    NodePort: "text-[#6753ac] bg-[#f0ecf7] dark:bg-[rgba(103,83,172,0.15)]",
    LoadBalancer: "text-[#3e8635] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]",
    ExternalName: "text-[#ff9800] bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)]",
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Breadcrumbs items={[{ label: "Home", path: "/" }, { label: "Networking", path: "/networking" }]}>
      <div className="ocs-app-page-outer ocs-app-page-outer--pb-0">
        <div className="flex items-center justify-between mb-[16px]">
          <div>
            <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px]">
              Networking
            </h1>
            <p className="text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0] mt-[4px]">
              Manage cluster networking resources across namespaces
            </p>
          </div>
          <div className="flex items-center gap-[12px]">
            <FavoriteButton name="Networking" path="/networking" />
            <button className="bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white px-[16px] py-[9px] rounded-[8px] font-semibold text-[13px] transition-colors flex items-center gap-[6px]">
              <Plus className="size-[14px]" />
              Create {activeTab === "services" ? "Service" : activeTab === "routes" ? "Route" : activeTab === "ingresses" ? "Ingress" : "NetworkPolicy"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedItem(null); }}
              className={`flex items-center gap-[6px] px-[16px] py-[10px] text-[13px] transition-colors border-b-2 -mb-px ${activeTab === tab.key
                ? "text-[#0066cc] dark:text-[#4dabf7] border-[#0066cc] dark:border-[#4dabf7]"
                : "text-[#6a6e73] border-transparent hover:text-[#151515] dark:hover:text-white"}`}>
              {tab.icon}
              {tab.label}
              <span className={`ml-[4px] px-[6px] py-[1px] rounded-[10px] text-[11px] ${activeTab === tab.key ? "bg-[#e7f1fa] dark:bg-[rgba(79,171,247,0.15)] text-[#0066cc] dark:text-[#4dabf7]" : "bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.06)]"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-[24px] py-[12px]">
        <div className="flex items-center gap-[12px]">
          <div className="relative flex-1 max-w-[320px]">
            <Search className="absolute left-[10px] top-1/2 -translate-y-1/2 size-[14px] text-[#6a6e73]" />
            <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-[32px] pr-[12px] py-[8px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,255,255,0.15)] rounded-[999px] text-[13px] text-[#151515] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]" />
          </div>
          <select value={selectedNamespace} onChange={(e) => setSelectedNamespace(e.target.value)}
            className="px-[12px] py-[8px] bg-white dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,255,255,0.15)] rounded-[999px] text-[13px] text-[#151515] dark:text-white cursor-pointer">
            {namespaces.map((ns) => <option key={ns} value={ns}>{ns === "all" ? "All Namespaces" : ns}</option>)}
          </select>
          <button className="p-[8px] border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,255,255,0.15)] rounded-[999px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)]">
            <RefreshCw className="size-[14px] text-[#151515] dark:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden mx-[24px] mb-[24px]">
        <div className="flex-1 overflow-auto rounded-[12px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.03)]">
          <table className="w-full">
            <thead className="bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.03)] sticky top-0 z-10">
              {activeTab === "services" && (
                <tr>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Name</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Namespace</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Type</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Cluster IP</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Ports</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Endpoints</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Age</th>
                  <th className="w-[48px]"></th>
                </tr>
              )}
              {activeTab === "routes" && (
                <tr>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Name</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Namespace</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Host</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">TLS</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Service</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Status</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Age</th>
                  <th className="w-[48px]"></th>
                </tr>
              )}
              {activeTab === "ingresses" && (
                <tr>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Name</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Namespace</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Host</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Class</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Rules</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">TLS</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Age</th>
                  <th className="w-[48px]"></th>
                </tr>
              )}
              {activeTab === "networkpolicies" && (
                <tr>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Name</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Namespace</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Pod Selector</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Policy Types</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Rules</th>
                  <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#151515] dark:text-white uppercase tracking-wider">Age</th>
                  <th className="w-[48px]"></th>
                </tr>
              )}
            </thead>
            <tbody>
              {/* Services */}
              {activeTab === "services" && filterByNsAndSearch(SERVICES).map((svc) => (
                <tr key={svc.name} onClick={() => setSelectedItem(svc)}
                  className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors ${selectedItem?.name === svc.name ? "bg-[rgba(0,102,204,0.04)] dark:bg-[rgba(79,171,247,0.04)]" : ""}`}>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <Network className="size-[14px] text-[#0066cc] dark:text-[#4dabf7]" />
                      <span className="text-[13px] font-mono text-[#151515] dark:text-white">{svc.name}</span>
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className="px-[8px] py-[2px] rounded-[4px] text-[11px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] text-[#151515] dark:text-white font-mono">{svc.namespace}</span>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className={`px-[8px] py-[2px] rounded-[4px] text-[11px] font-semibold ${svcTypeColor[svc.type] || ""}`}>{svc.type}</span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] font-mono text-[#151515] dark:text-white">{svc.clusterIP}</td>
                  <td className="px-[16px] py-[12px] text-[12px] font-mono text-[#6a6e73]">
                    {svc.ports.map((p) => `${p.port}/${p.protocol}`).join(", ")}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className={`text-[12px] ${svc.endpoints > 0 ? "text-[#3e8635]" : "text-[#c9190b]"}`}>{svc.endpoints}</span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] text-[#6a6e73]">{svc.age}</td>
                  <td className="px-[16px] py-[12px]">
                    <button className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[4px]" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="size-[14px] text-[#6a6e73]" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Routes */}
              {activeTab === "routes" && filterByNsAndSearch(ROUTES).map((rt) => (
                <tr key={rt.name} onClick={() => setSelectedItem(rt)}
                  className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors ${selectedItem?.name === rt.name ? "bg-[rgba(0,102,204,0.04)] dark:bg-[rgba(79,171,247,0.04)]" : ""}`}>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <Globe className="size-[14px] text-[#3e8635] dark:text-[#81c784]" />
                      <span className="text-[13px] font-mono text-[#151515] dark:text-white">{rt.name}</span>
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className="px-[8px] py-[2px] rounded-[4px] text-[11px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] text-[#151515] dark:text-white font-mono">{rt.namespace}</span>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <a href="#" className="text-[12px] font-mono text-[#0066cc] dark:text-[#4dabf7] hover:underline flex items-center gap-[4px]" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      {rt.host} <ExternalLink className="size-[10px]" />
                    </a>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className={`flex items-center gap-[4px] text-[12px] ${rt.tls !== "none" ? "text-[#3e8635]" : "text-[#6a6e73]"}`}>
                      <Lock className="size-[12px]" /> {rt.tls}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] font-mono text-[#151515] dark:text-white">{rt.service}</td>
                  <td className="px-[16px] py-[12px]">
                    <span className={`flex items-center gap-[4px] text-[12px] ${rt.status === "Accepted" ? "text-[#3e8635]" : rt.status === "Rejected" ? "text-[#c9190b]" : "text-[#f0ab00]"}`}>
                      {rt.status === "Accepted" ? <CheckCircle2 className="size-[12px]" /> : <AlertTriangle className="size-[12px]" />}
                      {rt.status}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] text-[#6a6e73]">{rt.age}</td>
                  <td className="px-[16px] py-[12px]">
                    <button className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[4px]" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="size-[14px] text-[#6a6e73]" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Ingresses */}
              {activeTab === "ingresses" && filterByNsAndSearch(INGRESSES).map((ing) => (
                <tr key={ing.name} onClick={() => setSelectedItem(ing)}
                  className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors ${selectedItem?.name === ing.name ? "bg-[rgba(0,102,204,0.04)] dark:bg-[rgba(79,171,247,0.04)]" : ""}`}>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <ExternalLink className="size-[14px] text-[#ff9800] dark:text-[#ffb74d]" />
                      <span className="text-[13px] font-mono text-[#151515] dark:text-white">{ing.name}</span>
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className="px-[8px] py-[2px] rounded-[4px] text-[11px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] text-[#151515] dark:text-white font-mono">{ing.namespace}</span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] font-mono text-[#151515] dark:text-white">{ing.host}</td>
                  <td className="px-[16px] py-[12px] text-[12px] text-[#151515] dark:text-white">{ing.ingressClass}</td>
                  <td className="px-[16px] py-[12px] text-[12px] text-[#151515] dark:text-white">{ing.rules.length}</td>
                  <td className="px-[16px] py-[12px]">
                    <span className={`flex items-center gap-[4px] text-[12px] ${ing.tls ? "text-[#3e8635]" : "text-[#6a6e73]"}`}>
                      <Lock className="size-[12px]" /> {ing.tls ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] text-[#6a6e73]">{ing.age}</td>
                  <td className="px-[16px] py-[12px]">
                    <button className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[4px]" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="size-[14px] text-[#6a6e73]" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Network Policies */}
              {activeTab === "networkpolicies" && filterByNsAndSearch(NETWORK_POLICIES).map((np) => (
                <tr key={np.name} onClick={() => setSelectedItem(np)}
                  className={`border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors ${selectedItem?.name === np.name ? "bg-[rgba(0,102,204,0.04)] dark:bg-[rgba(79,171,247,0.04)]" : ""}`}>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <Shield className="size-[14px] text-[#d32f2f] dark:text-[#ef5350]" />
                      <span className="text-[13px] font-mono text-[#151515] dark:text-white">{np.name}</span>
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className="px-[8px] py-[2px] rounded-[4px] text-[11px] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] text-[#151515] dark:text-white font-mono">{np.namespace}</span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] font-mono text-[#151515] dark:text-white">{np.podSelector}</td>
                  <td className="px-[16px] py-[12px]">
                    <div className="flex gap-[4px]">
                      {np.policyTypes.map((pt) => (
                        <span key={pt} className="px-[6px] py-[1px] rounded-[4px] text-[11px] font-semibold bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] text-[#151515] dark:text-white">{pt}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] text-[#151515] dark:text-white">
                    {np.ingressRules + np.egressRules} total
                  </td>
                  <td className="px-[16px] py-[12px] text-[12px] text-[#6a6e73]">{np.age}</td>
                  <td className="px-[16px] py-[12px]">
                    <button className="p-[4px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[4px]" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="size-[14px] text-[#6a6e73]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selectedItem && <DetailPanel type={activeTab} item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </div>
      </Breadcrumbs>
    </div>
  );
}
