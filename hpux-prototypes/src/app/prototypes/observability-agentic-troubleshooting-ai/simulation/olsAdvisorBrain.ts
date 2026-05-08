import type { SimulationAlertBrief, SimulationHandoff, SimulationSnapshot } from './simulationTypes';
import { getConversationMemory, recordAdvisorTurn, type AdvisorTurnIntent } from './olsConversationMemory';

/**
 * Red Hat OpenShift Lightspeed — official conversation & usage patterns (tone, follow-ups, scope).
 * @see https://docs.redhat.com/en/documentation/red_hat_openshift_lightspeed/1.0/html/operate/ols-using-openshift-lightspeed
 */
export const OLS_OPERATE_DOCUMENTATION_URL =
  'https://docs.redhat.com/en/documentation/red_hat_openshift_lightspeed/1.0/html/operate/ols-using-openshift-lightspeed';

/**
 * Voice and behavior aligned with *Operate → Using OpenShift Lightspeed* (natural language, scope,
 * follow-ups, specificity, alert troubleshooting).
 */
export const OLS_LIGHTSPEED_VOICE_FROM_DOCS = [
  'Respond like the in-console OpenShift Lightspeed assistant: clear, neutral, instructive product guidance—not theatrical roleplay.',
  'Prioritize OpenShift, Kubernetes, and related in-console workflows (Observe, Workloads, Operators, Networking, Storage, and specialized components where applicable).',
  'Use specific language: narrow questions with resource type, namespace, and product area improve answer quality; if intent could be misread, suggest a concise rephrase.',
  'Treat follow-up questions in this chat as first-class: conversation history shapes later replies—invite refinement, examples, or more detail in the same thread.',
  'For troubleshooting, pair explanations with verifiable console steps where possible (documentation-style procedures).',
  'When scope drifts outside OpenShift/Kubernetes, state the boundary briefly and steer back—mirroring how Lightspeed focuses on target topics.',
].join(' ');

/**
 * Internal persona + “play along” guardrails for the scripted OLS advisor (not sent to a real LLM here).
 * Blend: **Senior SRE**, **Cluster Admin**, and **Lead Enterprise Applications Developer** viewpoints on OCP 5 / Kubernetes,
 * delivered in **OpenShift Lightspeed documentation voice** (see `OLS_LIGHTSPEED_VOICE_FROM_DOCS`).
 * `SimulationSnapshot` (including optional `playAlong`) is treated as live operational truth in user-facing copy.
 */
export const OLS_SRE_ADVISOR_SYSTEM_DIRECTIVES = [
  OLS_LIGHTSPEED_VOICE_FROM_DOCS,
  'You combine the judgment of a Senior OpenShift SRE, a Cluster Administrator, and a Lead Enterprise Applications Developer—expressed as concise product support, not jargon for its own sake.',
  'SRE lens: reliability, incident command, observability signals, upgrade risk, and platform guardrails.',
  'Cluster Admin lens: RBAC, quotas, nodes, etcd/API health, networking, and day-2 operations.',
  'Lead App Dev lens: workload behavior, rollouts, dependencies, performance regressions, and safe change windows.',
  'Navigation: prefer OCP 5 console paths (e.g. Observe > Metrics, Observe > Alerting, Workloads > Deployments).',
  'Ground every claim in the current `SimulationSnapshot` (Observe alerts, causal-chain timestamps, remediation text, and any `playAlong` fields).',
  'Play along: when another prototype merges new simulated context via `mergeSimulationPlayAlong`, adopt that vocabulary and treat it as authoritative for this session—adapt gracefully as fields appear, change, or disappear.',
  'Never describe supplied data as mock, fake, simulated, or placeholder.',
  'When Autonomous analysis (internal legacy label: KubeKlaw TBC) is active, prioritize its causal chain and investigation narrative alongside other snapshot fields.',
].join(' ');

/** Closing line mirroring docs: follow-ups refine results; same-chat context matters. */
const CONVERSATION_FOLLOW_UP =
  '\n\nYou can ask a follow-up in this chat to refine this answer—for example, more detail, a command example, or a narrower scope. OpenShift Lightspeed uses your conversation history when forming the next reply.';

function appendConversationGuidance(body: string): string {
  return `${body}${CONVERSATION_FOLLOW_UP}`;
}

function reply(intent: AdvisorTurnIntent, focusedAlertId: string | null, body: string): string {
  recordAdvisorTurn(intent, focusedAlertId);
  return appendConversationGuidance(body);
}

/** Recent turns passed from the chat UI (loading / empty stripped). */
export type AdvisorRecentTurn = { role: 'user' | 'bot'; text: string };

export function buildRecentTurnsForAdvisor(
  messages: ReadonlyArray<{ role?: string; content?: unknown; isLoading?: boolean }>
): AdvisorRecentTurn[] {
  const out: AdvisorRecentTurn[] = [];
  for (const m of messages) {
    if (m.isLoading) continue;
    if (m.role !== 'user' && m.role !== 'bot') continue;
    const raw = typeof m.content === 'string' || typeof m.content === 'number' ? String(m.content) : '';
    const t = raw.trim();
    if (!t || t === 'Thinking...' || t === 'Analyzing alert...') continue;
    const text = t.length > 800 ? `${t.slice(0, 797)}…` : t;
    out.push({ role: m.role as 'user' | 'bot', text });
  }
  return out.slice(-12);
}

function formatPlayAlongContext(snap: SimulationSnapshot): string {
  const pl = snap.playAlong;
  if (!pl || (!pl.primaryEntitySummary && !(pl.contextBullets && pl.contextBullets.length) && !pl.domainLabel)) {
    return '';
  }
  const parts: string[] = [];
  if (pl.domainLabel) {
    parts.push(`**Current prototype focus:** ${pl.domainLabel}.`);
  }
  if (pl.primaryEntitySummary) {
    parts.push(pl.primaryEntitySummary);
  }
  if (pl.contextBullets?.length) {
    parts.push('**On-screen / API context:**\n' + pl.contextBullets.map((b) => `• ${b}`).join('\n'));
  }
  return parts.join('\n\n');
}

function latestCausalStep(a: SimulationAlertBrief): string {
  const ordered = [...a.steps].reverse();
  const active = ordered.find((s) => s.status === 'active');
  if (active) {
    return `${active.title}${active.time ? ` (${active.time})` : ''}`;
  }
  const done = ordered.filter((s) => s.status === 'done');
  const last = done[0];
  return last ? `${last.title}${last.time ? ` (${last.time})` : ''}` : a.title;
}

function primaryAlert(snap: SimulationSnapshot): SimulationAlertBrief | undefined {
  const crit = snap.alerts.filter((a) => a.severity === 'critical');
  if (crit.length) {
    return crit.sort((a, b) => b.firedAt.localeCompare(a.firedAt))[0];
  }
  const warm = snap.alerts.filter((a) => a.severity === 'warning');
  if (warm.length) {
    return warm.sort((a, b) => b.firedAt.localeCompare(a.firedAt))[0];
  }
  return snap.alerts[0];
}

/** After Observe → chat handoff injects the opening bot message. */
export function seedAdvisorMemoryFromSnapshot(snap: SimulationSnapshot): void {
  const p = primaryAlert(snap);
  recordAdvisorTurn('default', p?.id ?? null);
}

/** After Discuss with Lightspeed seeds a specific alert. */
export function seedAdvisorMemoryFromHandoffAlert(alertId: string | null): void {
  recordAdvisorTurn('default', alertId);
}

function rightNowNextSteps(snap: SimulationSnapshot): string {
  return snap.alerts.length > 0
    ? `**What to do next (OCP 5):** open **Observe > Alerting** to confirm firing rules, then **Observe > Metrics** with namespace-scoped CPU/error-rate dashboards for the workloads named on the alert. ` +
        `If you need pod-level signals, use **Observe > Dashboards** or **Workloads > Pods** filtered by the alert namespace.`
    : `**What to do next:** anchor on the console areas that match your current screen (Administrator vs Developer perspective). ` +
        `If this flow is not Observe-centric, map questions to the closest operational surface (workloads, operators, networking, or storage) implied by the context above.`;
}

function buildContinuityPrefix(userMessage: string, recent: AdvisorRecentTurn[]): string {
  if (recent.length < 2) return '';
  const lastBot = [...recent].reverse().find((r) => r.role === 'bot');
  if (!lastBot || lastBot.text.length < 24) return '';
  const q = userMessage.toLowerCase();
  if (/\b(and also|and then|what about|how about|same issue|follow[- ]?up|related to|staying on|still seeing)\b/i.test(q)) {
    return 'Staying in this thread: ';
  }
  const words = userMessage
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4 && !/^(about|which|where|there|these|those|could|would|should)$/.test(w));
  const botLower = lastBot.text.toLowerCase();
  if (words.some((w) => botLower.includes(w))) {
    return 'Connecting that to what we already covered: ';
  }
  return '';
}

function buildDeepDiveForAlert(a: SimulationAlertBrief): string {
  const stepsText = a.steps.length
    ? a.steps
        .map(
          (s) =>
            `• **[${s.status}]** ${s.title}${s.time ? ` (${s.time})` : ''}${s.detail ? ` — ${s.detail}` : ''}`
        )
        .join('\n')
    : '• No discrete steps on the correlated chain in this view—confirm live state in **Observe > Alerting**.';
  const cmd = a.remediationCommands.trim();
  const commandsBlock =
    cmd.length > 0
      ? `**Suggested commands / console anchors (verify in your environment before running):**\n\`\`\`\n${cmd.length > 420 ? `${cmd.slice(0, 417)}…` : cmd}\n\`\`\`\n\n`
      : '';
  return (
    `Here is a **more detailed** read of **${a.title}** (${a.severity}, \`${a.id}\`), grounded in the current Observe context:\n\n` +
    `**What the alert shows:** ${a.message}\n\n` +
    `**Autonomous analysis narrative:** ${a.agentInvestigationNarrative}\n\n` +
    `**Causal chain:**\n${stepsText}\n\n` +
    `**Root cause (synthesis):** ${a.rcaSummary} Reference: \`${a.rootCauseRef}\` ${a.rootCauseTail}\n\n` +
    `**Remediation (summary):** ${a.remediationSummary}\n\n` +
    commandsBlock +
    `**Change risk:** ${a.remediationRiskSummary}`
  );
}

function buildWhyForAlert(a: SimulationAlertBrief): string {
  return (
    `Here is **why** this reads the way it does for **${a.title}**:\n\n` +
    `${a.rcaSummary} The investigation narrative adds: ${a.agentInvestigationNarrative}\n\n` +
    `Confidence in this synthesized read: **${a.confidence}%**. Use **Observe > Metrics** in the affected namespace to corroborate before changing topology or limits.`
  );
}

function buildWhatNextForAlert(a: SimulationAlertBrief, snap: SimulationSnapshot): string {
  return (
    `**Next steps** for **${a.title}** on **${snap.selectedClusterName}**:\n\n` +
    `1. **Observe > Alerting** — confirm labels, receivers, and whether silences apply.\n` +
    `2. **Observe > Metrics** — chart CPU/throttle/error rates for **${a.service}** in the workload namespace.\n` +
    `3. **Workloads > Deployments / Pods** — verify rollout status and recent events.\n` +
    `4. **Remediate with care:** ${a.remediationSummary}\n\n` +
    `**Risk recap:** ${a.remediationRiskSummary}`
  );
}

function resolveFocusedAlert(
  snap: SimulationSnapshot,
  mem: ReturnType<typeof getConversationMemory>
): SimulationAlertBrief | undefined {
  if (mem.lastFocusedAlertId) {
    const hit = snap.alerts.find((a) => a.id === mem.lastFocusedAlertId);
    if (hit) return hit;
  }
  return primaryAlert(snap);
}

function buildDefaultAlertBlock(p: SimulationAlertBrief, snap: SimulationSnapshot, wordCount: number): string {
  const specificityHint =
    wordCount <= 3
      ? 'For clearer results, include the namespace, workload type, and what you are trying to verify (documentation recommends specific wording).\n\n'
      : '';

  const pl = formatPlayAlongContext(snap);
  const core =
    specificityHint +
    `**${p.title}** — ${p.message}\n\n` +
    `**Root cause:** ${p.rcaSummary} Key reference: \`${p.rootCauseRef}\` ${p.rootCauseTail}. ` +
    `**Confidence:** ${p.confidence}%.\n\n` +
    `**Remediation:** ${p.remediationSummary}\n` +
    `**Risk:** ${p.remediationRiskSummary}`;

  return pl ? `${core}\n\n${pl}` : core;
}

export function buildSituationBriefing(snap: SimulationSnapshot): string {
  const playAlong = formatPlayAlongContext(snap);
  const head = snap.isMultiCluster && snap.viewMode === 'fleet'
    ? `Fleet scope (${snap.alerts.length} tracked alert(s) across clusters).`
    : `Cluster **${snap.selectedClusterName}** (${snap.selectedClusterHealth} health, agent: **${snap.selectedClusterAgentStatus}**).`;

  if (!snap.alerts.length) {
    if (playAlong) {
      return `${head}\n\n${playAlong}`;
    }
    return `${head} No firing alerts in this scope—capacity and error budgets look quiet from Observe.`;
  }

  const p = primaryAlert(snap);
  if (!p) {
    const tail = `${head} Review Observe > Alerting for any silenced or routed signals.`;
    return playAlong ? `${tail}\n\n${playAlong}` : tail;
  }

  const chain = latestCausalStep(p);
  const core =
    `${head} Leading signal: **${p.title}** (${p.severity}, ${p.service}). ` +
    `Latest causal-chain focus: ${chain}. ` +
    `Autonomous analysis narrative: ${p.agentInvestigationNarrative}`;
  return playAlong ? `${core}\n\n${playAlong}` : core;
}

function buildRightNowAnswerBody(snap: SimulationSnapshot): string {
  return `${buildSituationBriefing(snap)}\n\n${rightNowNextSteps(snap)}`;
}

export function buildRightNowAnswer(snap: SimulationSnapshot): string {
  return appendConversationGuidance(buildRightNowAnswerBody(snap));
}

export function buildDiscussOpening(
  snap: SimulationSnapshot,
  handoff: SimulationHandoff
): string {
  const alert = snap.alerts.find((a) => a.id === handoff.alertId) ?? primaryAlert(snap);
  const title = alert?.title ?? 'this incident';
  const scope = handoff.cardId === 'remediation' ? 'remediation path' : 'root cause analysis';

  const body =
    `Based on the **${handoff.diagnosisName}** context (${scope}) for **${title}** (reference **${handoff.alertId}**), here is information you can use in the console:\n\n` +
    `${alert ? `**Summary:** ${alert.rcaSummary}\n\n` : ''}` +
    `${alert ? `**Evidence Autonomous analysis correlated:** ${alert.agentInvestigationNarrative}\n\n` : ''}` +
    `**Recommended direction:** ${alert?.remediationSummary ?? 'Review the remediation hub in Observe for recommended changes.'}\n` +
    `**Change risk:** ${alert?.remediationRiskSummary ?? 'Evaluate blast radius before applying changes.'}`;

  return appendConversationGuidance(body);
}

export function buildObserveToChatHandoff(snap: SimulationSnapshot): string {
  const p = primaryAlert(snap);
  if (!snap.isIncidentActive || !p) {
    return appendConversationGuidance(
      'OpenShift Lightspeed is ready for natural-language questions about this OpenShift scope. ' +
        'Ask about cluster health, alert triage, or console navigation (Observe, Workloads, Operators). ' +
        'Use specific wording—resource type, namespace, and product area help produce clearer answers.'
    );
  }
  const body =
    `Based on the alert context available here, Autonomous analysis highlights **${p.title}** (${p.severity}). ` +
    `The latest causal-chain emphasis is **${latestCausalStep(p)}**.\n\n` +
    `**Remediation path:** ${p.remediationSummary}\n` +
    `**Risk:** ${p.remediationRiskSummary}\n` +
    `**Evidence trail:** ${p.agentInvestigationNarrative}\n\n` +
    `**Verify in the console:** open **Observe > Alerting** to confirm labels and routing, then **Observe > Metrics** for workload-level corroboration.`;

  return appendConversationGuidance(body);
}

export function composeAdvisorReply(
  userMessage: string,
  snap: SimulationSnapshot,
  recentTurns: AdvisorRecentTurn[] = []
): string {
  const q = userMessage.toLowerCase().trim();
  const wc = userMessage.trim().split(/\s+/).filter(Boolean).length;
  const mem = getConversationMemory();
  const focused = resolveFocusedAlert(snap, mem);

  const continuationThanks = /^(thanks|thank you|thx|much appreciated|appreciate it|got it|perfect)\b/i.test(q);
  const continuationAffirm =
    /^(yes|yeah|yep|sure|ok|okay|go on|continue|yup)\.?$/i.test(q.trim()) ||
    /^(yes|yeah|yep|sure|ok|okay)\s+(please|go ahead|do it)\b/i.test(q);
  const continuationMore =
    /^(more|details?|elaborate|expand|dig deeper|deeper|verbose|longer|unpack that)\b/i.test(q) ||
    /\b(more detail|more details|tell me more)\b/i.test(q);
  const continuationWhy =
    /^why\b/i.test(q) ||
    /^how come\b/i.test(q) ||
    /^what caused (that|this)\??$/i.test(q);
  const continuationWhatNext =
    /^(what next|then what|what do i do next|and then)\??$/i.test(q.trim()) ||
    /\b(what('?s| is) next|next steps)\b/i.test(q);
  const wantsOtherAlert =
    /\b(other|another|different|second|next)\s+(alert|one|issue|signal)\b/i.test(q) ||
    /\b(not that one|switch alert)\b/i.test(q);

  if (continuationThanks && recentTurns.some((r) => r.role === 'bot')) {
    return reply(
      'continuation_thanks',
      mem.lastFocusedAlertId,
      'Glad that helps. If the cluster picture changes or Autonomous analysis refreshes the chain, ask again here and we can align the next reply to the latest context.'
    );
  }

  if ((continuationAffirm || continuationMore) && recentTurns.length > 0) {
    const a = focused ?? primaryAlert(snap);
    if (a) {
      return reply('continuation_deep', a.id, buildDeepDiveForAlert(a));
    }
    return reply(
      'continuation_deep',
      null,
      'I can go deeper once there is a specific alert or workload in scope—open **Observe > Alerting** or name a namespace and resource in your next message.'
    );
  }

  if (continuationWhy && recentTurns.some((r) => r.role === 'bot')) {
    const a = focused ?? primaryAlert(snap);
    if (a) {
      return reply('continuation_why', a.id, buildWhyForAlert(a));
    }
  }

  if (continuationWhatNext && recentTurns.some((r) => r.role === 'bot')) {
    const a = focused ?? primaryAlert(snap);
    if (a) {
      return reply('continuation_next', a.id, buildWhatNextForAlert(a, snap));
    }
  }

  if (wantsOtherAlert && snap.alerts.length > 1) {
    const prim = primaryAlert(snap);
    const other = snap.alerts.find((a) => a.id !== prim?.id) ?? snap.alerts[1];
    if (other) {
      const prefix = 'Shifting focus to another firing signal in this scope:\n\n';
      return reply(
        'continuation_other_alert',
        other.id,
        prefix + buildDefaultAlertBlock(other, snap, wc)
      );
    }
  }

  if (/\b(recipe|poem|lyrics|bitcoin|stock price|weather forecast|sports score)\b/i.test(userMessage)) {
    return reply(
      'off_topic',
      mem.lastFocusedAlertId,
      'OpenShift Lightspeed focuses on OpenShift, Kubernetes, and related console workflows. ' +
        'Rephrase your question with that scope—for example, name a namespace, workload, or Observe view you are working in—and I can return more targeted information.'
    );
  }

  if (/\b(right now|currently|happening now|status)\b/.test(q) || (q.includes('what') && q.includes('happening'))) {
    const p = primaryAlert(snap);
    return reply('right_now', p?.id ?? null, buildRightNowAnswerBody(snap));
  }

  if (/\b(navigate|where do i|console|menu|ocp)\b/.test(q)) {
    const p = primaryAlert(snap);
    const prefix = buildContinuityPrefix(userMessage, recentTurns);
    return reply(
      'navigate',
      p?.id ?? null,
      prefix +
        'In the **Administrator** perspective, use **Observe > Alerting** (rules and firing alerts), **Observe > Metrics** (Prometheus explorer), **Observe > Dashboards** (saved views), and **Observe > Targets** for scrape health. ' +
        buildSituationBriefing(snap)
    );
  }

  if (/\b(ambient|sparkle|pre-?analyzed|causal chain)\b/.test(q)) {
    const aid = snap.ambientIndicatorAlertId;
    const target = aid ? snap.alerts.find((a) => a.id === aid) : primaryAlert(snap);
    if (!target) {
      return reply(
        'ambient',
        null,
        'Attach or select alert context in the console (for example, expand an alert row in **Observe > Alerting**) so OpenShift Lightspeed can reference a specific alert ID and its causal chain.'
      );
    }
    return reply(
      'ambient',
      target.id,
      `For alert **${target.id}** (**${target.title}**), the pre-analyzed causal chain is: ` +
        `${target.steps.map((s) => `[${s.status}] ${s.title}${s.time ? ` @${s.time}` : ''}`).join(' → ')}. ` +
        `Narrative: ${target.agentInvestigationNarrative}`
    );
  }

  const p = primaryAlert(snap);
  if (!p) {
    const pl = formatPlayAlongContext(snap);
    if (pl) {
      return reply(
        'play_along_only',
        null,
        `Here is information grounded in your current scope for **${snap.selectedClusterName || 'this environment'}**:\n\n${pl}\n\n` +
          'Ask a follow-up with a namespace, workload name, or console page if you want command examples or a narrower procedure.'
      );
    }
    return reply(
      'no_alerts',
      null,
      `No firing alerts are loaded for **${snap.selectedClusterName}** in this view. ` +
        'You can ask about capacity planning, upgrades, or metrics—include the namespace or workload for more precise guidance.'
    );
  }

  const prefix = buildContinuityPrefix(userMessage, recentTurns);
  const block = buildDefaultAlertBlock(p, snap, wc);
  return reply('default', p.id, prefix ? `${prefix}\n\n${block}` : block);
}
