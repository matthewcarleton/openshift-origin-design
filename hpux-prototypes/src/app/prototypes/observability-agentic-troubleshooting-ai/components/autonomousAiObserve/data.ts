/**
 * Mock dataset for Autonomous analysis — values match cursor-prompt-cluster-monitoring-console.md
 */

export type ClusterHealth = 'critical' | 'degraded' | 'healthy';
export type AgentPulseStatus = 'investigating' | 'remediating' | 'escalated' | 'idle';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type ReasoningStepStatus = 'done' | 'active' | 'pending' | 'alert';
export type ViewMode = 'fleet' | 'cluster';

export interface ClusterRecord {
  id: string;
  name: string;
  region: string;
  provider: string;
  env: 'prod' | 'staging' | 'dev';
  version: string;
  nodes: number;
  health: ClusterHealth;
  agentStatus: AgentPulseStatus;
}

export interface ReasoningStep {
  id: string;
  time?: string;
  status: ReasoningStepStatus;
  title: string;
  detail?: string;
  /** PatternFly icon component name hint — resolved in UI */
  icon: 'exclamation' | 'database' | 'network' | 'search' | 'check';
}

/**
 * Structured “AI insight” for transparency above the Active Reasoning Chain:
 * category → headline (agent move) → evidence (signals) → optional narrative (synthesis).
 */
export interface AlertAiInsight {
  /** e.g. "AI insight · Correlation" */
  categoryLabel: string;
  /** Short headline — anchor / grouping / scope */
  headline: string;
  /** Evidence line — metrics, clusters, time windows */
  evidence: string;
  /** Optional first-person or plain-language synthesis */
  narrative?: string;
}

export interface AlertRecord {
  id: string;
  clusterId: string;
  severity: AlertSeverity;
  title: string;
  service: string;
  age: string;
  /** ISO 8601 instant when the alert began firing (OpenShift-style header date). */
  firedAt: string;
  /** One-line user-facing description under the alert name (OpenShift-style message). */
  message: string;
  agentStatus: AgentPulseStatus;
  steps: ReasoningStep[];
  rcaSummary: string;
  rootCauseRef: string;
  rootCauseTail: string;
  confidence: number;
  logLines: string;
  blastRadius: string[];
  remediationSummary: string;
  remediationCommands: string;
  estimatedRecovery: string;
  /** Downtime / blast-radius framing for advisor responses (plain language, no “simulated”). */
  remediationRiskSummary: string;
  /** How Autonomous analysis reached the current conclusion (evidence chain, console-style). */
  agentInvestigationNarrative: string;
  /** Labeled AI transparency block (title / evidence / narrative). */
  aiInsight: AlertAiInsight;
}

/**
 * Fleet-scoped critical incident (not tied to a single clusterId) — surfaced only in Fleet management view.
 */
export interface FleetWideCriticalIncident {
  id: string;
  title: string;
  severity: AlertSeverity;
  firedAt: string;
  agentStatus: AgentPulseStatus;
  /** Clusters included in the causal story (ids into `CLUSTERS`). */
  affectedClusterIds: string[];
  correlatedAlertCount: number;
  /** Structured AI insight (replaces a single undifferentiated summary paragraph). */
  aiInsight: AlertAiInsight;
  /** When ingress-to-workload loss began (display string, e.g. for subtitles). */
  symptomStartedDisplay: string;
  /** Active reasoning chain (same shape as per-cluster alerts). */
  steps: ReasoningStep[];
  /** Aggregated RCA — timestamped finding (GitOps, etc.). */
  aggregatedFinding: string;
  /** Aggregated RCA — root cause narrative. */
  rootCauseNarrative: string;
  /** Remediation hub — governor-facing proposal. */
  remediationProposal: string;
  /** Remediation hub — risk / recovery framing. */
  riskAssessment: string;
  estimatedRecovery: string;
}

/** Default cluster when Core platforms loads Observe with no session-stored focus. */
export const DEFAULT_CORE_PLATFORMS_CLUSTER_ID = 'prod-east-2';

export const CLUSTERS: ClusterRecord[] = [
  {
    id: 'prod-east-2',
    name: 'prod-east-2',
    region: 'us-east-2',
    provider: 'AWS',
    env: 'prod',
    version: '4.15.8',
    nodes: 24,
    health: 'critical',
    agentStatus: 'investigating',
  },
  {
    id: 'prod-eu-west-1',
    name: 'prod-eu-west-1',
    region: 'eu-west-1',
    provider: 'AWS',
    env: 'prod',
    version: '4.15.8',
    nodes: 18,
    health: 'critical',
    agentStatus: 'remediating',
  },
  {
    id: 'stg-central',
    name: 'stg-central',
    region: 'us-central-1',
    provider: 'GCP',
    env: 'staging',
    version: '4.16.2',
    nodes: 8,
    health: 'critical',
    agentStatus: 'investigating',
  },
  {
    id: 'edge-apac-1',
    name: 'edge-apac-1',
    region: 'ap-southeast-1',
    provider: 'Azure',
    env: 'prod',
    version: '4.15.6',
    nodes: 12,
    health: 'degraded',
    agentStatus: 'investigating',
  },
  {
    id: 'prod-us-west-2',
    name: 'prod-us-west-2',
    region: 'us-west-2',
    provider: 'AWS',
    env: 'prod',
    version: '4.15.8',
    nodes: 16,
    health: 'healthy',
    agentStatus: 'idle',
  },
];

export const ALERTS: AlertRecord[] = [
  {
    id: 'alrt-8821',
    clusterId: 'prod-east-2',
    severity: 'critical',
    title: 'PaymentsAPI5xxSurge',
    service: 'payments / payments-api',
    age: '4m',
    firedAt: '2026-04-29T18:18:00.000Z',
    message: 'Server errors from payments-api are elevated; clients may see failed or slow checkouts.',
    agentStatus: 'investigating',
    steps: [
      {
        id: 's1',
        time: '14:22:01',
        status: 'done',
        title: 'Detected anomaly in payments-api',
        detail: 'Latency p99 spike → 4.2s',
        icon: 'exclamation',
      },
      {
        id: 's2',
        time: '14:22:04',
        status: 'done',
        title: 'Fetched Kube Events',
        detail: '32 events across 4 namespaces',
        icon: 'database',
      },
      {
        id: 's3',
        time: '14:22:09',
        status: 'done',
        title: 'Correlated with network policies',
        detail: 'egress rule changed 3m ago',
        icon: 'network',
      },
      {
        id: 's4',
        time: '14:22:14',
        status: 'active',
        title: 'Analyzing pod restart patterns',
        detail: 'checking CrashLoopBackOff signatures',
        icon: 'search',
      },
      {
        id: 's5',
        time: '00:00:00',
        status: 'pending',
        title: 'Generate remediation plan',
        icon: 'check',
      },
    ],
    rcaSummary:
      'NetworkPolicy applied at 14:18 UTC blocks egress to redis cache, causing connection timeouts in payments-api pods and cascading 5xx errors at the gateway.',
    rootCauseRef: 'payments-egress-v3',
    rootCauseTail: 'redis-cache.svc.cluster.local:6379',
    confidence: 87,
    logLines: `E 14:21:58 dial tcp 10.0.4.12:6379:
  i/o timeout
W 14:21:59 redis pool exhausted (32/32)
E 14:22:00 payment_intent failed:
  upstream connect error`,
    blastRadius: ['payments-api-7f4c', 'payments-api-9b2d', 'checkout-svc', 'ingress-gw', 'redis-cache-0'],
    remediationSummary:
      'Roll back NetworkPolicy payments-egress-v3 to revision v2 and restart affected payments-api pods. No data-plane impact expected.',
    remediationCommands: `$ kubectl rollout undo netpol/payments-egress-v3 -n payments
$ kubectl rollout restart deploy/payments-api -n payments`,
    estimatedRecovery: '~45s',
    remediationRiskSummary:
      'Medium–High — rolling back netpol and restarting payments-api can cause sub-minute errors on checkout paths while endpoints converge.',
    agentInvestigationNarrative:
      'Autonomous analysis correlated Kube events, NetworkPolicy change timestamps, and pod restart signatures on payments-api before locking onto egress to redis-cache.',
    aiInsight: {
      categoryLabel: 'AI insight · Correlation',
      headline: 'Scoped egress failure to redis behind payments-api',
      evidence:
        'Kube events + NetworkPolicy timestamps align with redis dial timeouts on payments-api replicas.',
      narrative:
        "I've tied the 5xx surge to egress blocked to redis-cache — next I'm validating rollback blast radius before recommending undo.",
    },
  },
  {
    id: 'alrt-8819',
    clusterId: 'prod-east-2',
    severity: 'critical',
    title: 'EtcdDiskPressureOnMaster2',
    service: 'openshift-etcd / etcd-master-2',
    age: '11m',
    firedAt: '2026-04-29T18:11:00.000Z',
    message: 'etcd data volume is low on disk space; control plane stability may be at risk.',
    agentStatus: 'investigating',
    steps: [
      {
        id: 'e1',
        time: '14:15:32',
        status: 'done',
        title: 'DiskPressure condition on master-2',
        detail: 'node tainted automatically',
        icon: 'exclamation',
      },
      {
        id: 'e2',
        time: '14:15:40',
        status: 'done',
        title: 'Inspected etcd WAL size',
        detail: '12.4 GB / 8 GB threshold',
        icon: 'database',
      },
      {
        id: 'e3',
        time: '14:15:55',
        status: 'active',
        title: 'Compacting historical revisions',
        detail: 'rev 88_421_003 → 88_700_112',
        icon: 'search',
      },
      {
        id: 'e4',
        status: 'pending',
        title: 'Validate quorum post-compaction',
        icon: 'check',
      },
    ],
    rcaSummary:
      'etcd WAL exceeded 8 GB threshold on master-2 due to skipped auto-compaction window during last upgrade. Disk pressure risks quorum stability.',
    rootCauseRef: 'etcd-master-2',
    rootCauseTail: '/var/lib/etcd',
    confidence: 92,
    logLines: `W 14:15:30 mvcc: storage backend quota exceeded
W 14:15:31 apply request took too long (412ms)
E 14:15:32 DiskPressure: available 4% (<10%)`,
    blastRadius: ['etcd-master-2', 'kube-apiserver-2', 'controller-manager'],
    remediationSummary:
      'Trigger etcd defrag on master-2 after compaction completes; expand PV by 20 GB and reschedule auto-compaction every 6h.',
    remediationCommands: `$ etcdctl --endpoints=master-2:2379 defrag
$ oc patch pvc etcd-master-2 -p '{"spec":{"resources":{"requests":{"storage":"60Gi"}}}}'`,
    estimatedRecovery: '~3m',
    remediationRiskSummary:
      'High — etcd maintenance on a control-plane member can briefly lengthen API write latency; schedule during a maintenance window if possible.',
    agentInvestigationNarrative:
      'Autonomous analysis read node conditions, etcd WAL metrics, and compaction state on master-2 to confirm disk pressure as the limiting factor.',
    aiInsight: {
      categoryLabel: 'AI insight · Capacity',
      headline: 'Prioritized etcd WAL under DiskPressure on master-2',
      evidence:
        'Node condition timeline matches WAL growth beyond quota; compaction lag explains sustained API latency.',
      narrative:
        "I'm treating skipped compaction after upgrade as the primary risk — expanding disk and defrag reduces quorum hazard next.",
    },
  },
  {
    id: 'alrt-8814',
    clusterId: 'prod-eu-west-1',
    severity: 'warning',
    title: 'CheckoutSvcCPUThrottling',
    service: 'payments / checkout-svc',
    age: '22m',
    firedAt: '2026-04-29T18:00:00.000Z',
    message: 'Pods are CPU-throttled because requests and limits are below current demand.',
    agentStatus: 'remediating',
    steps: [
      {
        id: 'c1',
        time: '14:04:10',
        status: 'done',
        title: 'CPU throttling > 35% sustained',
        detail: 'across 3/4 replicas',
        icon: 'exclamation',
      },
      {
        id: 'c2',
        time: '14:04:18',
        status: 'done',
        title: 'Reviewed HPA history',
        detail: 'scaled 4→4 (max reached)',
        icon: 'database',
      },
      {
        id: 'c3',
        time: '14:04:25',
        status: 'done',
        title: 'Profiled hot path',
        detail: 'JSON serialization 41% of CPU',
        icon: 'search',
      },
      {
        id: 'c4',
        time: '14:04:30',
        status: 'done',
        title: 'Plan ready',
        detail: 'raise HPA max + bump requests',
        icon: 'check',
      },
    ],
    rcaSummary:
      'checkout-svc hit HPA ceiling of 4 replicas while sustained traffic grew 2.1x week-over-week. CPU requests under-provisioned for current shape.',
    rootCauseRef: 'checkout-svc',
    rootCauseTail: 'hpa: max=4 cpu.req=250m',
    confidence: 78,
    logLines: `I 14:03:55 cpu_throttled_seconds_total +0.42/s
I 14:04:02 hpa: desired=6 current=4 (capped)
W 14:04:10 request latency p95 = 1.8s`,
    blastRadius: ['checkout-svc-a1', 'checkout-svc-b2', 'checkout-svc-c3', 'checkout-svc-d4'],
    remediationSummary:
      'Raise HPA max replicas to 8 and bump CPU request from 250m → 500m. Safe rolling update; no downtime expected.',
    remediationCommands: `$ oc patch hpa checkout-svc -p '{"spec":{"maxReplicas":8}}'
$ oc set resources deploy/checkout-svc --requests=cpu=500m`,
    estimatedRecovery: '~90s',
    remediationRiskSummary:
      'Low–Medium — HPA and resource bumps are rolling; expect brief CPU scheduling noise only.',
    agentInvestigationNarrative:
      'Autonomous analysis compared HPA events, replica saturation, and container CPU throttling metrics on checkout-svc to justify raising limits.',
    aiInsight: {
      categoryLabel: 'AI insight · Performance',
      headline: 'CPU starvation before horizontal scale could help',
      evidence:
        'HPA maxReplicas reached while cpu_throttled_seconds grows — requests sit below sustained load shape.',
      narrative:
        "I've queued a safe HPA max + CPU request bump; expecting rolling noise only during the rollout.",
    },
  },
  {
    id: 'alrt-8830',
    clusterId: 'edge-apac-1',
    severity: 'warning',
    title: 'IngressTLSCertExpiresIn36h',
    service: 'openshift-ingress / router-default',
    age: '2m',
    firedAt: '2026-04-29T18:24:00.000Z',
    message: 'Router TLS certificate is nearing expiry; renew before clients see trust or handshake errors.',
    agentStatus: 'investigating',
    steps: [
      {
        id: 't1',
        time: '14:24:00',
        status: 'done',
        title: 'Cert-manager probe flagged renewal',
        detail: 'expiry: 2026-04-27 02:11 UTC',
        icon: 'exclamation',
      },
      {
        id: 't2',
        time: '14:24:08',
        status: 'done',
        title: 'Checked ACME challenge readiness',
        detail: 'DNS-01 provider reachable',
        icon: 'network',
      },
      {
        id: 't3',
        time: '14:24:14',
        status: 'active',
        title: 'Drafting renewal CertificateRequest',
        icon: 'search',
      },
      {
        id: 't4',
        status: 'pending',
        title: 'Apply & verify chain',
        icon: 'check',
      },
    ],
    rcaSummary:
      'Wildcard cert *.apac.example.com nearing expiry; auto-renewal disabled during last edge maintenance window and never re-enabled.',
    rootCauseRef: 'wildcard-apac',
    rootCauseTail: 'auto-renew=false',
    confidence: 95,
    logLines: `I 14:23:55 cert-manager: 36h to expiry
W 14:23:56 renewBefore window entered
I 14:24:00 issuer letsencrypt-prod ready`,
    blastRadius: ['router-default', '*.apac.example.com'],
    remediationSummary:
      'Re-enable auto-renewal on the wildcard Certificate resource and trigger an immediate renewal via cert-manager.',
    remediationCommands: `$ oc annotate certificate wildcard-apac cert-manager.io/renew=true --overwrite
$ oc delete certificaterequest -l cert=wildcard-apac`,
    estimatedRecovery: '~2m',
    remediationRiskSummary:
      'Medium — ingress reload on renewal can drop a small number of in-flight TLS handshakes during router rollout.',
    agentInvestigationNarrative:
      'Autonomous analysis verified cert-manager issuer health, renewal windows, and router-default attachment for the wildcard before prioritizing renewal.',
    aiInsight: {
      categoryLabel: 'AI insight · Security posture',
      headline: 'Renewal path clear before clients hit trust errors',
      evidence:
        'cert-manager issuer healthy; DNS-01 challenge ready — expiry window entered for wildcard router cert.',
      narrative:
        "I'm driving an immediate CertificateRequest so ingress reload happens before the 36h cut-off.",
    },
  },
];

/** Fleet-wide critical: regional ingress — causal grouping, aggregated RCA, governor remediation (fleet view only). */
export const FLEET_WIDE_REGIONAL_INGRESS: FleetWideCriticalIncident = {
  id: 'fleet-alrt-regional-ingress-us-east',
  title: 'RegionalIngressFailure',
  severity: 'critical',
  firedAt: '2026-04-29T15:05:00.000Z',
  agentStatus: 'investigating',
  affectedClusterIds: ['prod-east-2', 'prod-eu-west-1', 'stg-central'],
  correlatedAlertCount: 112,
  aiInsight: {
    categoryLabel: 'AI insight · Fleet correlation',
    headline: 'Anchored blast to ingress dataplane',
    evidence:
      'OpenShift Ingress metrics show coordinated drop across prod-east-2, prod-eu-west-1, and stg-central',
    narrative:
      'I have correlated 112 alerts across prod-east-2, prod-eu-west-1, and stg-central. All symptoms point to a total loss of Ingress-to-Workload communication starting at 10:05 AM.',
  },
  symptomStartedDisplay: '10:05 AM',
  steps: [
    {
      id: 'fw1',
      time: '10:04',
      status: 'done',
      title: 'Grouped fleet alerts by ingress symptom',
      detail: '112 firing alerts share 502/503 at router → Service hop within a 6-minute window',
      icon: 'database',
    },
    {
      id: 'fw2',
      time: '10:05',
      status: 'done',
      title: 'Anchored blast to ingress dataplane',
      detail: 'OpenShift Ingress metrics show coordinated drop across prod-east-2, prod-eu-west-1, and stg-central',
      icon: 'network',
    },
    {
      id: 'fw3',
      time: '10:06',
      status: 'done',
      title: 'Global GitOps sync detected 2 minutes prior to alert storm',
      detail: 'Argo CD application cluster-gitops-policies completed sync at 10:03 AM',
      icon: 'search',
    },
    {
      id: 'fw4',
      time: '10:07',
      status: 'active',
      title: 'Diffed applied NetworkPolicy objects',
      detail: 'New deny-all-ingress policy lacks allow-rule for openshift-ingress namespace',
      icon: 'exclamation',
    },
    {
      id: 'fw5',
      time: '—',
      status: 'pending',
      title: 'Governor approval for fleet rollback',
      icon: 'check',
    },
  ],
  aggregatedFinding:
    'Global GitOps Sync detected 2 minutes prior to alert storm — Argo CD application cluster-gitops-policies applied revision r4821 at 10:03 AM.',
  rootCauseNarrative:
    'A new NetworkPolicy (deny-all-ingress) was applied globally. It lacks an allow-rule for the OpenShift Ingress Controller namespace, so router → workload traffic is denied fleet-wide.',
  remediationProposal:
    'Roll back NetworkPolicy deny-all-ingress to version v2.1.0 across all 3 clusters (prod-east-2, prod-eu-west-1, stg-central).',
  riskAssessment: 'Low risk. This will restore traffic immediately.',
  estimatedRecovery: '~45s',
};

/**
 * Extra critical count for a cluster when it appears on the active fleet-scoped critical
 * (`FLEET_WIDE_REGIONAL_INGRESS` is not stored as `AlertRecord` rows on `clusterId`).
 */
export function fleetWideCriticalAddsForCluster(clusterId: string): number {
  if (FLEET_WIDE_REGIONAL_INGRESS.severity !== 'critical') {
    return 0;
  }
  return FLEET_WIDE_REGIONAL_INGRESS.affectedClusterIds.includes(clusterId) ? 1 : 0;
}

/** +1 per cluster in `FLEET_WIDE_REGIONAL_INGRESS.affectedClusterIds` — aligns Fleet Summary critical with Σ cluster tiles. */
export function fleetCriticalAttributionCount(): number {
  if (FLEET_WIDE_REGIONAL_INGRESS.severity !== 'critical') {
    return 0;
  }
  return FLEET_WIDE_REGIONAL_INGRESS.affectedClusterIds.length;
}

/**
 * Synthetic per-cluster row for the fleet-wide ingress incident so Active alerts and drill-down
 * match fleet KPIs (`fleetWideCriticalAddsForCluster`). Not stored on `ALERTS` to avoid duplicating
 * one incident across three cluster rows in fleet-wide tables.
 */
export function buildFleetWideIngressAlertRecordForCluster(clusterId: string): AlertRecord | null {
  if (fleetWideCriticalAddsForCluster(clusterId) === 0) {
    return null;
  }
  const fw = FLEET_WIDE_REGIONAL_INGRESS;
  return {
    id: `${fw.id}__${clusterId}`,
    clusterId,
    severity: 'critical',
    title: fw.title,
    service: 'openshift-ingress / fleet-correlated',
    age: fw.symptomStartedDisplay,
    firedAt: fw.firedAt,
    message: fw.aiInsight.narrative ?? fw.aiInsight.evidence,
    agentStatus: fw.agentStatus,
    steps: fw.steps,
    rcaSummary: `${fw.aggregatedFinding} ${fw.rootCauseNarrative}`.trim(),
    rootCauseRef: 'cluster-gitops-policies',
    rootCauseTail: fw.rootCauseNarrative.slice(0, 120),
    confidence: 94,
    logLines: `Fleet ingress symptom · ${fw.correlatedAlertCount} correlated alerts · deny-all-ingress NetworkPolicy roll-forward detected.`,
    blastRadius: [...fw.affectedClusterIds, 'router-default', 'openshift-ingress'],
    remediationSummary: fw.remediationProposal,
    remediationCommands:
      'Use Remediation hub in Fleet management for governor-approved rollback across affected clusters.',
    estimatedRecovery: fw.estimatedRecovery,
    remediationRiskSummary: fw.riskAssessment,
    agentInvestigationNarrative: fw.aiInsight.narrative ?? fw.aiInsight.evidence,
    aiInsight: { ...fw.aiInsight },
  };
}

/** Digest rows for “While you were away” — fixed copy per spec */
export const AWAY_DIGEST_ITEMS: Array<{
  tone: 'danger' | 'success' | 'warning' | 'info';
  text: string;
  meta: string;
}> = [
  {
    tone: 'danger',
    text: '3 new critical alerts fired',
    meta: 'RegionalIngressFailure (fleet) · PaymentsAPI5xxSurge · EtcdDiskPressureOnMaster2',
  },
  {
    tone: 'success',
    text: 'Agent auto-remediated 3 incidents',
    meta: 'checkout-svc HPA · ingress restart · pod evict',
  },
  {
    tone: 'warning',
    text: '1 cluster degraded → recovered',
    meta: 'prod-eu-west-1 · 6m downtime',
  },
  {
    tone: 'info',
    text: 'Fleet alerts went 0 → 4 since last visit',
    meta: 'first event at 13:48 UTC',
  },
];

/** Shape shared by fleet mock digest rows and cluster-scoped digest rows. */
export type AwayDigestItem = {
  tone: 'danger' | 'success' | 'warning' | 'info';
  text: string;
  meta: string;
};

export function getClusterById(id: string): ClusterRecord | undefined {
  return CLUSTERS.find((c) => c.id === id);
}

/** Lower number = higher priority (shown first in UI). */
const ALERT_SEVERITY_SORT_ORDER: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

/** Critical before warning before info; stable within the same severity. */
export function sortAlertsBySeverityPriority(alerts: AlertRecord[]): AlertRecord[] {
  return [...alerts].sort(
    (a, b) => ALERT_SEVERITY_SORT_ORDER[a.severity] - ALERT_SEVERITY_SORT_ORDER[b.severity]
  );
}

/** Display suffix after `AI insight ·` for KPI tooltips and summaries. */
export function aiInsightCategoryShort(categoryLabel: string): string {
  const trimmed = categoryLabel.trim();
  const m = trimmed.match(/^AI insight\s*·\s*(.+)$/i);
  return m ? m[1].trim() : trimmed;
}

/**
 * Console-style grouping for tooltip “Category” (Policy, Security, …), derived from alert names/services.
 */
export function alertDomainCategoryFromText(title: string, componentOrService: string): string {
  const hay = `${title} ${componentOrService}`.toLowerCase();
  if (/cert|tls|wildcard|expir|renew/i.test(hay)) {
    return 'Security';
  }
  if (/networkpolicy|netpol|regionalingress|ingress.*failure/i.test(hay)) {
    return 'Policy';
  }
  if (/etcd|disk|wal|pressure|volume/i.test(hay)) {
    return 'Capacity';
  }
  if (/payment|checkout|hpa|quota|throttl/i.test(hay)) {
    return 'Workload';
  }
  return 'Platform';
}

export function alertDomainCategory(a: AlertRecord): string {
  return alertDomainCategoryFromText(a.title, a.service);
}

export type AlertKpiBreakdownRow = {
  title: string;
  severity: AlertSeverity;
  component: string;
  insightCategory: string;
  domainCategory: string;
};

function alertToBreakdownRow(a: AlertRecord): AlertKpiBreakdownRow {
  return {
    title: a.title,
    severity: a.severity,
    component: a.service,
    insightCategory: aiInsightCategoryShort(a.aiInsight.categoryLabel),
    domainCategory: alertDomainCategory(a),
  };
}

/** Fleet KPI counts include synthetic fleet-critical attributions; mirror that in tooltip rows. */
export function buildFleetSeverityBreakdown(severity: AlertSeverity): AlertKpiBreakdownRow[] {
  const rows = ALERTS.filter((a) => a.severity === severity).map(alertToBreakdownRow);
  if (severity === 'critical' && FLEET_WIDE_REGIONAL_INGRESS.severity === 'critical') {
    const fw = FLEET_WIDE_REGIONAL_INGRESS;
    fw.affectedClusterIds.forEach(() => {
      rows.push({
        title: fw.title,
        severity: 'critical',
        component: 'openshift-ingress / fleet-correlated',
        insightCategory: aiInsightCategoryShort(fw.aiInsight.categoryLabel),
        domainCategory: 'Policy',
      });
    });
  }
  return rows.sort((a, b) => a.title.localeCompare(b.title));
}

export function getAlertsForCluster(clusterId: string): AlertRecord[] {
  const perCluster = sortAlertsBySeverityPriority(ALERTS.filter((a) => a.clusterId === clusterId));
  const fleetRow = buildFleetWideIngressAlertRecordForCluster(clusterId);
  if (!fleetRow) {
    return perCluster;
  }
  return sortAlertsBySeverityPriority([fleetRow, ...perCluster]);
}

export function buildClusterSeverityBreakdown(clusterId: string, severity: AlertSeverity): AlertKpiBreakdownRow[] {
  return getAlertsForCluster(clusterId)
    .filter((a) => a.severity === severity)
    .map(alertToBreakdownRow)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Cluster-scoped “While you were away” rows derived from alerts, fleet-wide incidents,
 * agent pulse, and health — used in Core platforms / single-cluster view only.
 */
export function buildClusterAwayDigestItems(clusterId: string): AwayDigestItem[] {
  const cluster = getClusterById(clusterId);
  if (!cluster) {
    return [];
  }

  const items: AwayDigestItem[] = [];
  const perClusterAlerts = sortAlertsBySeverityPriority(
    ALERTS.filter((a) => a.clusterId === clusterId)
  );

  if (fleetWideCriticalAddsForCluster(clusterId) > 0) {
    const summary = FLEET_WIDE_REGIONAL_INGRESS.aiInsight.narrative ?? FLEET_WIDE_REGIONAL_INGRESS.aiInsight.evidence;
    items.push({
      tone: 'danger',
      text: `Fleet incident: ${FLEET_WIDE_REGIONAL_INGRESS.title}`,
      meta: summary.length > 140 ? `${summary.slice(0, 140)}…` : summary,
    });
  }

  const crit = perClusterAlerts.filter((a) => a.severity === 'critical');
  const warn = perClusterAlerts.filter((a) => a.severity === 'warning');

  if (crit.length > 0) {
    items.push({
      tone: 'danger',
      text: `${crit.length} critical firing alert${crit.length !== 1 ? 's' : ''}`,
      meta: crit.map((a) => a.title).join(' · '),
    });
  }
  if (warn.length > 0) {
    items.push({
      tone: 'warning',
      text: `${warn.length} warning alert${warn.length !== 1 ? 's' : ''}`,
      meta: warn.map((a) => a.title).join(' · '),
    });
  }

  if (cluster.agentStatus !== 'idle') {
    items.push({
      tone: cluster.agentStatus === 'escalated' ? 'danger' : 'info',
      text: `Agent status: ${cluster.agentStatus}`,
      meta: `Single-cluster context · ${cluster.name}`,
    });
  }

  if (cluster.health !== 'healthy') {
    items.push({
      tone: cluster.health === 'critical' ? 'danger' : 'warning',
      text: `Cluster health is ${cluster.health}`,
      meta: `${cluster.nodes} nodes · ${cluster.provider} · ${cluster.region}`,
    });
  }

  if (items.length === 0) {
    items.push({
      tone: 'success',
      text: `No new issues on ${cluster.name}`,
      meta: 'Agent idle · monitoring continues',
    });
  }

  return items.slice(0, 6);
}

export function computeFleetStats(
  clusters: ClusterRecord[],
  alerts: AlertRecord[],
  /** Per-cluster attributions from fleet-scoped critical (e.g. `fleetCriticalAttributionCount()`). */
  fleetCriticalAttributionTotal = 0
) {
  const criticalCount =
    alerts.filter((a) => a.severity === 'critical').length + fleetCriticalAttributionTotal;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const degraded = clusters.filter((c) => c.health !== 'healthy').length;
  const totalNodes = clusters.reduce((sum, c) => sum + c.nodes, 0);
  return {
    criticalCount,
    warningCount,
    degraded,
    totalClusters: clusters.length,
    totalNodes,
  };
}
