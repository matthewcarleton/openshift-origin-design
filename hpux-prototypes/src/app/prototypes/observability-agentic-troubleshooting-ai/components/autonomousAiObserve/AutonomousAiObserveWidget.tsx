import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  Button,
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  Content,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  Label,
  MenuToggle,
  type MenuToggleElement,
  Progress,
  Stack,
  StackItem,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  GlobeIcon,
  MagicIcon,
} from '@patternfly/react-icons';
import type { AgentPulseStatus, ClusterHealth, ClusterRecord, ViewMode } from './data';
import {
  ALERTS,
  AWAY_DIGEST_ITEMS,
  buildClusterAwayDigestItems,
  buildClusterSeverityBreakdown,
  buildFleetSeverityBreakdown,
  CLUSTERS,
  DEFAULT_CORE_PLATFORMS_CLUSTER_ID,
  computeFleetStats,
  fleetCriticalAttributionCount,
  fleetWideCriticalAddsForCluster,
  getAlertsForCluster,
  getClusterById,
} from './data';
import { AlertKpiTooltip } from './AlertKpiTooltip';
import { AgentPulseLabel } from './AgentPulseLabel';
import { ObserveAlertItem } from './ObserveAlertItem';
import './autonomous-ai-observe.css';
import { SimulationProvider } from '../../simulation/SimulationProvider';
import { syncObserveSimulationState } from '../../simulation/simulationStore';
import { agenticGlobalAiApi } from '../../persesAgenticBridge';
import { useActivePerspective } from '@app/shared/contexts/ActivePerspectiveContext';
import { FLEET_INSIGHT_ICON_BOX_STYLE } from '../../pages/alerting-fleet-copy/data/fleetInsightsConfig';
import {
  clearFocusedClusterSession,
  readFocusedClusterIdFromSession,
  writeFocusedClusterIdToSession,
} from './focusClusterSession';

const WIDGET_ID = 'ols-autonomous-ai-observe-widget';
const AGENT_TOKEN_LIMIT = 20000;
const AGENT_TOKEN_USED = 7500;

function formatTokenCount(value: number): string {
  if (value >= 1000) {
    const thousands = value / 1000;
    const formatted =
      Number.isInteger(thousands) || value >= 10000 ? `${Math.round(thousands)}` : `${thousands.toFixed(1)}`;
    return `${formatted}K`;
  }
  return `${value}`;
}

const AgentTokenCounter: React.FC = () => {
  const usagePct = Math.min(100, Math.round((AGENT_TOKEN_USED / AGENT_TOKEN_LIMIT) * 100));
  const usedLabel = formatTokenCount(AGENT_TOKEN_USED);
  const limitLabel = formatTokenCount(AGENT_TOKEN_LIMIT);
  const creditsLeft = Math.max(0, AGENT_TOKEN_LIMIT - AGENT_TOKEN_USED);
  const creditsLeftLabel = creditsLeft.toLocaleString();

  return (
    <div
      className="ols-aio-token-counter"
      aria-label={`Credits usage ${AGENT_TOKEN_USED} out of ${AGENT_TOKEN_LIMIT}`}
    >
      <div className="ols-aio-token-counter__row">
        <span className="ols-aio-token-counter__label">Credits</span>
        <span className="ols-aio-token-counter__value">
          <strong>{usedLabel}</strong>
          {' / '}
          {limitLabel}
        </span>
      </div>
      <Tooltip content={`${creditsLeftLabel} remediation credits left`} position="top" isContentLeftAligned>
        <div className="ols-aio-token-counter__progress-wrap">
          <Progress
            value={usagePct}
            min={0}
            max={100}
            measureLocation="none"
            size="sm"
            aria-label={`${creditsLeftLabel} remediation credits left`}
          />
        </div>
      </Tooltip>
    </div>
  );
};

function fleetAwayDismissKey(text: string): string {
  return `fleet:${text}`;
}

function clusterAwayDismissKey(clusterId: string, text: string): string {
  return `cluster:${clusterId}:${text}`;
}

/** Chip label for cluster-scoped digest rows (non-dismissed count). */
function awayDigestClusterEventCountLabel(visibleCount: number): string {
  if (visibleCount <= 0) {
    return '0 new events';
  }
  if (visibleCount === 1) {
    return '1 new event';
  }
  return `${visibleCount} new events`;
}

/** Multi-cluster Alerting deep-link with optional `cluster`, `severity`, `scope=ai-hub` (see `MultiClusterAlertsPage`). */
function alertingHref(options: {
  tab: 'alerts' | 'fleet-overview';
  severity?: 'critical' | 'warning';
  clusterId?: string;
  /** Fleet KPI drill: limit Alerting to AI Hub mock clusters only (excludes generated filler clusters). */
  aiHubFleetScope?: boolean;
}): string {
  const params = new URLSearchParams();
  params.set('tab', options.tab);
  if (options.severity) {
    params.set('severity', options.severity);
  }
  if (options.clusterId) {
    params.set('cluster', options.clusterId);
  }
  if (options.aiHubFleetScope) {
    params.set('scope', 'ai-hub');
  }
  return `/core/observe/alerting?${params.toString()}`;
}

function clusterDrillHref(clusterId: string, target: 'alert-critical' | 'alert-warning' | 'nodes'): string {
  const enc = encodeURIComponent(clusterId);
  if (target === 'alert-critical') {
    return alertingHref({ tab: 'alerts', severity: 'critical', clusterId });
  }
  if (target === 'alert-warning') {
    return alertingHref({ tab: 'alerts', severity: 'warning', clusterId });
  }
  return `/core/observe/nodes?scope=cluster&cluster=${enc}`;
}

type ObserveMetricStatCardProps = {
  /** Row label in `CardHeader` (same pattern as Fleet summary KPI tiles). */
  cardTitle: string;
  /** Status / severity icon shown before the linked statistic in `CardBody`. */
  titleIcon?: React.ReactNode;
  statistic: React.ReactNode;
  statisticAriaLabel: string;
  onStatisticClick: () => void;
  caption: React.ReactNode;
  /** When false, the KPI is display-only. */
  statisticInteractive?: boolean;
  /** Hover breakdown (PatternFly `Tooltip`); omit when not applicable. */
  statisticTooltip?: React.ReactNode;
};

/**
 * Nested compact metric card: `CardTitle` in header; body row is icon + KPI value (link drill or plain text).
 * Used for Fleet summary and Cluster health tiles.
 */
const ObserveMetricStatCard: React.FC<ObserveMetricStatCardProps> = ({
  cardTitle,
  titleIcon,
  statistic,
  statisticAriaLabel,
  onStatisticClick,
  caption,
  statisticInteractive = true,
  statisticTooltip,
}) => {
  const statisticTrigger =
    statisticInteractive ? (
      <Button
        variant="link"
        isInline
        className="ols-aio-card-stat-number--drill"
        onClick={onStatisticClick}
        aria-label={statisticAriaLabel}
      >
        {statistic}
      </Button>
    ) : (
      <span className="ols-aio-card-stat-number--readonly" aria-label={statisticAriaLabel}>
        {statistic}
      </span>
    );

  const statisticNode =
    statisticTooltip !== undefined && statisticTooltip !== null ? (
      <Tooltip
        content={statisticTooltip}
        position="top"
        isContentLeftAligned
        maxWidth="min(600px, 92vw)"
      >
        {statisticTrigger}
      </Tooltip>
    ) : (
      statisticTrigger
    );

  return (
  <Card isCompact>
    <CardHeader>
      <CardTitle component="h4">{cardTitle}</CardTitle>
    </CardHeader>
    <CardBody>
      <div className="ols-aio-stat-figure">
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'nowrap' }}>
          {titleIcon ? (
            <span className="ols-aio-metric-kpi-stat-icon" aria-hidden="true">
              {titleIcon}
            </span>
          ) : null}
          {statisticNode}
        </Flex>
      </div>
      <Content
        component="p"
        className="ols-aio-text-subtle-sm"
        style={{
          marginTop: 'var(--pf-t--global--spacer--xs)',
          marginBottom: 0,
        }}
      >
        {caption}
      </Content>
    </CardBody>
  </Card>
  );
};

function fleetAgentStatus(clusters: ClusterRecord[]): AgentPulseStatus {
  if (clusters.some((c) => c.agentStatus === 'escalated')) {
    return 'escalated';
  }
  if (clusters.some((c) => c.agentStatus === 'remediating')) {
    return 'remediating';
  }
  if (clusters.some((c) => c.agentStatus === 'investigating')) {
    return 'investigating';
  }
  return 'idle';
}

/** Maps cluster health to PatternFly `Label` status (semantic color + icon). */
function healthToLabelStatus(health: ClusterHealth): 'success' | 'warning' | 'danger' {
  if (health === 'healthy') {
    return 'success';
  }
  if (health === 'degraded') {
    return 'warning';
  }
  return 'danger';
}

function capitalizeLabelWord(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/** Type label text (prod / staging / dev) — first letter capitalized. */
function clusterTypeLabelText(env: ClusterRecord['env']): string {
  return capitalizeLabelWord(env);
}

/** Health label text shown on the tile (matches `ClusterHealth` vocabulary). */
function clusterHealthLabelText(health: ClusterHealth): string {
  if (health === 'degraded') {
    return 'Degraded';
  }
  return capitalizeLabelWord(health);
}

/** “While you were away” header chip — fleet scope, not tied to dismissed digest rows. */
function awayDigestNewEventsLabel(clusterCount: number): string {
  if (clusterCount <= 1) {
    return 'New events across 1 cluster';
  }
  return `New events across ${clusterCount} clusters`;
}

export const AutonomousAiObserveWidget: React.FC = () => {
  const navigate = useNavigate();
  const { activePerspective } = useActivePerspective();
  const isMultiCluster = CLUSTERS.length > 1;
  /** In Fleet management only: drill into one cluster without leaving the perspective (vs Core platforms). */
  const [fleetClusterDrillDown, setFleetClusterDrillDown] = useState(false);
  const prevPerspectiveRef = React.useRef(activePerspective);

  const showFleetOverview = useMemo(
    () => isMultiCluster && activePerspective === 'Fleet management' && !fleetClusterDrillDown,
    [isMultiCluster, activePerspective, fleetClusterDrillDown]
  );

  const viewMode: ViewMode = useMemo(() => (showFleetOverview ? 'fleet' : 'cluster'), [showFleetOverview]);

  /** Restores session handoff; Core platforms applies `DEFAULT_CORE_PLATFORMS_CLUSTER_ID` when still empty. */
  const [selectedClusterId, setSelectedClusterId] = useState(() => readFocusedClusterIdFromSession() ?? '');

  React.useEffect(() => {
    const prev = prevPerspectiveRef.current;
    prevPerspectiveRef.current = activePerspective;
    if (activePerspective === 'Fleet management' && prev === 'Core platforms') {
      setFleetClusterDrillDown(false);
    }
  }, [activePerspective]);

  React.useEffect(() => {
    if (activePerspective !== 'Core platforms') {
      return;
    }
    if (selectedClusterId) {
      return;
    }
    setSelectedClusterId(DEFAULT_CORE_PLATFORMS_CLUSTER_ID);
  }, [activePerspective, selectedClusterId]);
  const [widgetExpanded, setWidgetExpanded] = useState(true);
  const [awayOpen, setAwayOpen] = useState(true);
  const [fleetSummaryOpen, setFleetSummaryOpen] = useState(true);
  const [clustersOpen, setClustersOpen] = useState(true);
  const [cAwayOpen, setCAwayOpen] = useState(true);
  const [cHealthOpen, setCHealthOpen] = useState(true);
  const [cAlertsOpen, setCAlertsOpen] = useState(true);
  const [isClusterSwitcherOpen, setIsClusterSwitcherOpen] = useState(false);
  /** Fleet digest rows use `fleet:${text}`; cluster rows use `cluster:${clusterId}:${text}`. */
  const [dismissedAwayKeys, setDismissedAwayKeys] = useState<Set<string>>(() => new Set());

  const visibleFleetAwayDigestItems = useMemo(
    () => AWAY_DIGEST_ITEMS.filter((item) => !dismissedAwayKeys.has(fleetAwayDismissKey(item.text))),
    [dismissedAwayKeys]
  );

  const visibleClusterAwayDigestItems = useMemo(() => {
    return buildClusterAwayDigestItems(selectedClusterId).filter(
      (item) => !dismissedAwayKeys.has(clusterAwayDismissKey(selectedClusterId, item.text))
    );
  }, [dismissedAwayKeys, selectedClusterId]);

  const fleetWhileYouWereAwayChipLabel = useMemo(() => awayDigestNewEventsLabel(CLUSTERS.length), []);

  const clusterWhileYouWereAwayChipLabel = useMemo(
    () => awayDigestClusterEventCountLabel(visibleClusterAwayDigestItems.length),
    [visibleClusterAwayDigestItems.length]
  );

  const dismissFleetAwayDigest = useCallback((text: string) => {
    setDismissedAwayKeys((prev) => new Set(prev).add(fleetAwayDismissKey(text)));
  }, []);

  const dismissClusterAwayDigest = useCallback(
    (clusterId: string, text: string) => {
      setDismissedAwayKeys((prev) => new Set(prev).add(clusterAwayDismissKey(clusterId, text)));
    },
    []
  );

  const dismissAllFleetAwayDigests = useCallback(() => {
    setDismissedAwayKeys((prev) => {
      const next = new Set(prev);
      AWAY_DIGEST_ITEMS.forEach((i) => next.add(fleetAwayDismissKey(i.text)));
      return next;
    });
  }, []);

  const dismissAllClusterAwayDigests = useCallback((clusterId: string) => {
    const rows = buildClusterAwayDigestItems(clusterId);
    setDismissedAwayKeys((prev) => {
      const next = new Set(prev);
      rows.forEach((r) => next.add(clusterAwayDismissKey(clusterId, r.text)));
      return next;
    });
  }, []);

  const fleetStats = useMemo(
    () => computeFleetStats(CLUSTERS, ALERTS, fleetCriticalAttributionCount()),
    []
  );

  const fleetCriticalBreakdown = useMemo(() => buildFleetSeverityBreakdown('critical'), []);
  const fleetWarningBreakdown = useMemo(() => buildFleetSeverityBreakdown('warning'), []);

  const fleetPulse = useMemo(() => fleetAgentStatus(CLUSTERS), []);
  const totalFleetNodes = useMemo(() => CLUSTERS.reduce((s, c) => s + c.nodes, 0), []);

  const selectedCluster = useMemo(
    () => (selectedClusterId ? getClusterById(selectedClusterId) : undefined),
    [selectedClusterId]
  );

  useEffect(() => {
    if (selectedClusterId && CLUSTERS.some((c) => c.id === selectedClusterId)) {
      writeFocusedClusterIdToSession(selectedClusterId);
    } else {
      clearFocusedClusterSession();
    }
  }, [selectedClusterId]);

  useEffect(() => {
    if (fleetClusterDrillDown) {
      setCAwayOpen(false);
    }
  }, [fleetClusterDrillDown]);

  const clusterAlerts = useMemo(() => getAlertsForCluster(selectedClusterId), [selectedClusterId]);

  const simulationAlerts = useMemo(
    () => (showFleetOverview ? ALERTS : clusterAlerts),
    [showFleetOverview, clusterAlerts]
  );

  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = {};
    clusterAlerts.forEach((a, index) => {
      next[a.id] = index === 0;
    });
    setExpandedAlerts(next);
  }, [clusterAlerts]);

  const toggleAlert = useCallback((id: string, open: boolean) => {
    setExpandedAlerts((prev) => ({ ...prev, [id]: open }));
  }, []);

  useEffect(() => {
    syncObserveSimulationState({
      viewMode,
      selectedCluster: selectedCluster ?? null,
      clusterAlerts: simulationAlerts,
      expandedAlerts,
      observeWidgetExpanded: widgetExpanded,
      isMultiCluster,
      fleetAgentPulse: fleetPulse,
    });
  }, [
    viewMode,
    selectedCluster,
    simulationAlerts,
    expandedAlerts,
    widgetExpanded,
    isMultiCluster,
    fleetPulse,
  ]);

  const discussLightspeed = useCallback(
    (payload: { alertId: string; cardId: string; diagnosisName: string }) => {
      agenticGlobalAiApi.openDiscussWithLightspeed?.(payload);
    },
    []
  );

  const onWidgetExpand = useCallback((_e: React.MouseEvent, id: string) => {
    if (id === WIDGET_ID) {
      setWidgetExpanded((v) => !v);
    }
  }, []);

  const subtitle = useMemo(() => {
    if (showFleetOverview) {
      return `Fleet management · ${CLUSTERS.length} clusters · ${totalFleetNodes} nodes · full fleet view`;
    }
    if (!selectedCluster) {
      return activePerspective === 'Fleet management' && fleetClusterDrillDown
        ? 'Fleet management · select a cluster to drill down'
        : 'Core platforms · select a cluster to load cluster-scoped monitoring';
    }
    if (activePerspective === 'Fleet management' && fleetClusterDrillDown) {
      return `Fleet management · ${selectedCluster.name} · drill-down · ${selectedCluster.provider} · ${selectedCluster.region}`;
    }
    return `Core platforms · ${selectedCluster.name} · ${selectedCluster.provider} · ${selectedCluster.region}`;
  }, [
    showFleetOverview,
    activePerspective,
    fleetClusterDrillDown,
    selectedCluster,
    totalFleetNodes,
  ]);

  const headerPulse: AgentPulseStatus = showFleetOverview ? fleetPulse : selectedCluster?.agentStatus ?? 'idle';

  const criticalOnCluster = clusterAlerts.filter((a) => a.severity === 'critical').length;
  const warningOnCluster = clusterAlerts.filter((a) => a.severity === 'warning').length;

  const clusterCriticalBreakdown = useMemo(
    () => (selectedClusterId ? buildClusterSeverityBreakdown(selectedClusterId, 'critical') : []),
    [selectedClusterId]
  );
  const clusterWarningBreakdown = useMemo(
    () => (selectedClusterId ? buildClusterSeverityBreakdown(selectedClusterId, 'warning') : []),
    [selectedClusterId]
  );

  const degradedCount = CLUSTERS.filter((c) => c.health !== 'healthy').length;

  return (
    <SimulationProvider>
    <>
      {/* Core platforms: cluster picker. Fleet management drill-down: picker without leaving Fleet perspective. */}
      {isMultiCluster &&
      (activePerspective === 'Core platforms' ||
        (activePerspective === 'Fleet management' && fleetClusterDrillDown)) ? (
        <Flex
          className="ols-aio-context-selectors"
          alignItems={{ default: 'alignItemsCenter' }}
          flexWrap={{ default: 'wrap' }}
          gap={{ default: 'gapMd' }}
          style={{
            width: '100%',
            marginBottom: 'var(--pf-t--global--spacer--md)',
          }}
        >
          {activePerspective === 'Fleet management' && fleetClusterDrillDown ? (
            <FlexItem>
              <Button
                variant="link"
                icon={<ArrowLeftIcon />}
                onClick={() => setFleetClusterDrillDown(false)}
                aria-label="Return to full fleet Autonomous analysis view"
              >
                Back to fleet overview
              </Button>
            </FlexItem>
          ) : null}
          <FlexItem>
            <Dropdown
              isOpen={isClusterSwitcherOpen}
              onOpenChange={setIsClusterSwitcherOpen}
              shouldFocusToggleOnSelect
              onSelect={(_event, value) => {
                const id = String(value);
                if (CLUSTERS.some((c) => c.id === id)) {
                  setSelectedClusterId(id);
                }
                setIsClusterSwitcherOpen(false);
              }}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsClusterSwitcherOpen((o) => !o)}
                  isExpanded={isClusterSwitcherOpen}
                  variant="default"
                  aria-label="Select cluster context"
                >
                  {selectedCluster ? selectedCluster.name : 'Select a cluster'}
                </MenuToggle>
              )}
            >
              <DropdownGroup label="Clusters" labelHeadingLevel="h2">
                <DropdownList>
                  {CLUSTERS.map((c) => (
                    <DropdownItem key={c.id} value={c.id} isSelected={selectedClusterId === c.id}>
                      {c.name} · {c.provider} · {c.region}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </DropdownGroup>
            </Dropdown>
          </FlexItem>
        </Flex>
      ) : null}

      <Card id={WIDGET_ID} isCompact isExpanded={widgetExpanded}>
      <CardHeader
        onExpand={onWidgetExpand}
        toggleButtonProps={{
          id: `${WIDGET_ID}-toggle`,
          'aria-label': widgetExpanded ? 'Collapse Autonomous analysis' : 'Expand Autonomous analysis',
        }}
        actions={{
          actions: (
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
              <FlexItem>
                <AgentPulseLabel status={headerPulse} id={`${WIDGET_ID}-header-pulse`} />
              </FlexItem>
              <FlexItem>
                <AgentTokenCounter />
              </FlexItem>
            </Flex>
          ),
        }}
      >
        <Flex alignItems={{ default: 'alignItemsFlexStart' }} flexWrap={{ default: 'wrap' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'nowrap' }}>
              <div style={FLEET_INSIGHT_ICON_BOX_STYLE} aria-hidden="true">
                <MagicIcon style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <Title headingLevel="h2" size="md">
                  Autonomous analysis
                </Title>
                <Content
                  component="p"
                  className="ols-aio-text-subtle-sm"
                  style={{
                    marginTop: 'var(--pf-t--global--spacer--xs)',
                    marginBottom: 0,
                    fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                  }}
                >
                  {subtitle}
                </Content>
              </div>
            </Flex>
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          {showFleetOverview ? (
            <Stack hasGutter>
              <StackItem>
                <Card className="ols-aio-subcard" isCompact isExpanded={awayOpen} id={`${WIDGET_ID}-away`}>
                  <CardHeader
                    onExpand={() => setAwayOpen((o) => !o)}
                    toggleButtonProps={{
                      id: `${WIDGET_ID}-away-toggle`,
                      'aria-label': 'Toggle While you were away section',
                    }}
                  >
                    <Stack>
                      <StackItem>
                        <Flex
                          justifyContent={{ default: 'justifyContentSpaceBetween' }}
                          alignItems={{ default: 'alignItemsCenter' }}
                          flexWrap={{ default: 'wrap' }}
                        >
                          <FlexItem>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }} gap={{ default: 'gapSm' }}>
                              <CardTitle component="h3">While you were away</CardTitle>
                              <Label color="blue" isCompact>
                                {fleetWhileYouWereAwayChipLabel}
                              </Label>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </StackItem>
                      <StackItem style={{ marginTop: 'var(--pf-t--global--spacer--xs)' }}>
                        <Flex
                          justifyContent={{ default: 'justifyContentSpaceBetween' }}
                          alignItems={{ default: 'alignItemsCenter' }}
                          flexWrap={{ default: 'wrap' }}
                        >
                          <span className="ols-aio-text-subtle-sm">Since your last visit · 38m ago</span>
                          <Button
                            variant="link"
                            isInline
                            isDisabled={visibleFleetAwayDigestItems.length === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAllFleetAwayDigests();
                            }}
                            aria-label="Dismiss all digest alerts"
                          >
                            Dismiss all
                          </Button>
                        </Flex>
                      </StackItem>
                    </Stack>
                  </CardHeader>
                  <CardExpandableContent>
                    <CardBody>
                      {visibleFleetAwayDigestItems.length === 0 ? (
                        <EmptyState variant={EmptyStateVariant.lg} style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                          <EmptyStateBody>
                            <Title headingLevel="h4" size="lg">
                              You&apos;re all caught up
                            </Title>
                            <Content
                              component="p"
                              style={{ marginTop: 'var(--pf-t--global--spacer--sm)', marginBottom: 0 }}
                            >
                              There are currently no active alerts requiring your attention.
                            </Content>
                          </EmptyStateBody>
                        </EmptyState>
                      ) : (
                        <Stack hasGutter style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                          {visibleFleetAwayDigestItems.map((item) => (
                            <StackItem key={item.text}>
                              <Alert
                                isInline
                                variant={item.tone}
                                title={item.text}
                                actionClose={
                                  <AlertActionCloseButton
                                    onClose={() => dismissFleetAwayDigest(item.text)}
                                    aria-label={`Dismiss: ${item.text}`}
                                  />
                                }
                              >
                                <Content
                                  component="p"
                                  className="ols-aio-text-subtle-sm"
                                  style={{
                                    marginTop: 'var(--pf-t--global--spacer--xs)',
                                    marginBottom: 0,
                                  }}
                                >
                                  {item.meta}
                                </Content>
                              </Alert>
                            </StackItem>
                          ))}
                        </Stack>
                      )}
                    </CardBody>
                  </CardExpandableContent>
                </Card>
              </StackItem>

              <StackItem>
                <Card className="ols-aio-subcard" isCompact isExpanded={fleetSummaryOpen} id={`${WIDGET_ID}-fleet-summary`}>
                  <CardHeader
                    onExpand={() => setFleetSummaryOpen((o) => !o)}
                    toggleButtonProps={{
                      id: `${WIDGET_ID}-fleet-summary-toggle`,
                      'aria-label': 'Toggle Fleet Summary section',
                    }}
                    actions={{
                      actions: (
                        <Button
                          variant="link"
                          isInline
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(alertingHref({ tab: 'fleet-overview', aiHubFleetScope: true }));
                          }}
                          aria-label="Open Alerting Fleet overview filtered to currently surfaced Autonomous analysis alerts"
                        >
                          View alerts
                        </Button>
                      ),
                    }}
                  >
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <CardTitle component="h3">Fleet Summary</CardTitle>
                    </Flex>
                  </CardHeader>
                  <CardExpandableContent>
                    <CardBody>
                      <Grid hasGutter>
                        <GridItem span={12} md={6} lg={3}>
                          <ObserveMetricStatCard
                            cardTitle="Critical alerts"
                            titleIcon={
                              <ExclamationCircleIcon
                                style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}
                              />
                            }
                            statistic={fleetStats.criticalCount}
                            statisticAriaLabel="Open Alerting, Alerts tab, critical severity, AI Hub clusters only (matches Observe fleet counts)"
                            statisticInteractive
                            onStatisticClick={() =>
                              navigate(alertingHref({ tab: 'alerts', severity: 'critical', aiHubFleetScope: true }))
                            }
                            statisticTooltip={
                              <AlertKpiTooltip bucketLabel="Critical alerts" rows={fleetCriticalBreakdown} />
                            }
                            caption="Across all clusters"
                          />
                        </GridItem>
                        <GridItem span={12} md={6} lg={3}>
                          <ObserveMetricStatCard
                            cardTitle="Warning alerts"
                            titleIcon={
                              <ExclamationTriangleIcon
                                style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}
                              />
                            }
                            statistic={fleetStats.warningCount}
                            statisticAriaLabel="Open Alerting, Alerts tab, warning severity, AI Hub clusters only (matches Observe fleet counts)"
                            statisticInteractive
                            onStatisticClick={() =>
                              navigate(alertingHref({ tab: 'alerts', severity: 'warning', aiHubFleetScope: true }))
                            }
                            statisticTooltip={
                              <AlertKpiTooltip bucketLabel="Warning alerts" rows={fleetWarningBreakdown} />
                            }
                            caption="Across all clusters"
                          />
                        </GridItem>
                        <GridItem span={12} md={6} lg={3}>
                          <ObserveMetricStatCard
                            cardTitle="Clusters degraded"
                            titleIcon={
                              <ExclamationTriangleIcon
                                style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}
                              />
                            }
                            statistic={
                              <>
                                {degradedCount} / {fleetStats.totalClusters}
                              </>
                            }
                            statisticAriaLabel="Clusters degraded versus total fleet size"
                            statisticInteractive={false}
                            onStatisticClick={() => {}}
                            caption="Non-healthy"
                          />
                        </GridItem>
                        <GridItem span={12} md={6} lg={3}>
                          <ObserveMetricStatCard
                            cardTitle="Total nodes"
                            statistic={fleetStats.totalNodes}
                            statisticAriaLabel="Total nodes in fleet"
                            statisticInteractive={false}
                            onStatisticClick={() => {}}
                            caption={`${fleetStats.totalClusters} clusters`}
                          />
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </CardExpandableContent>
                </Card>
              </StackItem>

              <StackItem>
                <Card className="ols-aio-subcard" isCompact isExpanded={clustersOpen} id={`${WIDGET_ID}-clusters`}>
                  <CardHeader
                    onExpand={() => setClustersOpen((o) => !o)}
                    toggleButtonProps={{
                      id: `${WIDGET_ID}-clusters-toggle`,
                      'aria-label': 'Toggle Clusters section',
                    }}
                  >
                    <Stack>
                      <StackItem>
                        <CardTitle component="h3" style={{ marginBottom: 0 }}>
                          Clusters
                        </CardTitle>
                      </StackItem>
                      <StackItem>
                        <Content
                          component="p"
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            color: 'var(--pf-t--global--text--color--subtle)',
                          }}
                        >
                          Click any cluster to drill in.
                        </Content>
                      </StackItem>
                    </Stack>
                  </CardHeader>
                  <CardExpandableContent>
                    <CardBody>
                      <Gallery hasGutter>
                        {CLUSTERS.map((c) => {
                          const crit =
                            ALERTS.filter((a) => a.clusterId === c.id && a.severity === 'critical').length +
                            fleetWideCriticalAddsForCluster(c.id);
                          const warn = ALERTS.filter((a) => a.clusterId === c.id && a.severity === 'warning').length;
                          const healthStatus = healthToLabelStatus(c.health);
                          const healthIcon =
                            c.health === 'healthy' ? (
                              <CheckCircleIcon />
                            ) : c.health === 'degraded' ? (
                              <ExclamationTriangleIcon />
                            ) : (
                              <ExclamationCircleIcon />
                            );
                          return (
                            <GalleryItem key={c.id}>
                              <div
                                className={
                                  selectedClusterId === c.id
                                    ? 'ols-aio-cluster-gallery-tile ols-aio-cluster-gallery-tile--current'
                                    : 'ols-aio-cluster-gallery-tile'
                                }
                                role="button"
                                tabIndex={0}
                                aria-label={`Drill into ${c.name} in Autonomous analysis (Fleet management)`}
                                onClick={() => {
                                  setSelectedClusterId(c.id);
                                  setFleetClusterDrillDown(true);
                                }}
                                onKeyDown={(event: React.KeyboardEvent) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setSelectedClusterId(c.id);
                                    setFleetClusterDrillDown(true);
                                  }
                                }}
                              >
                                <Card isCompact>
                                  <CardBody>
                                  <Flex
                                    justifyContent={{ default: 'justifyContentSpaceBetween' }}
                                    alignItems={{ default: 'alignItemsFlexStart' }}
                                    flexWrap={{ default: 'nowrap' }}
                                  >
                                    <FlexItem style={{ flex: '1 1 auto', minWidth: 0, marginRight: 'var(--pf-t--global--spacer--sm)' }}>
                                      <Title
                                        headingLevel="h4"
                                        size="md"
                                        style={{
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {c.name}
                                      </Title>
                                      <Flex
                                        alignItems={{ default: 'alignItemsCenter' }}
                                        flexWrap={{ default: 'nowrap' }}
                                        style={{ marginTop: 'var(--pf-t--global--spacer--xs)', minWidth: 0 }}
                                      >
                                        <GlobeIcon
                                          style={{
                                            marginRight: 'var(--pf-t--global--spacer--xs)',
                                            flexShrink: 0,
                                          }}
                                        />
                                        <span
                                          className="ols-aio-text-subtle-sm"
                                          style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            minWidth: 0,
                                          }}
                                        >
                                          {c.provider} · {c.region}
                                        </span>
                                      </Flex>
                                    </FlexItem>
                                    <FlexItem style={{ flexShrink: 0 }}>
                                      <Label status={healthStatus} icon={healthIcon} isCompact>
                                        {clusterHealthLabelText(c.health)}
                                      </Label>
                                    </FlexItem>
                                  </Flex>
                                  <Flex
                                    justifyContent={{ default: 'justifyContentSpaceBetween' }}
                                    alignItems={{ default: 'alignItemsCenter' }}
                                    style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                                  >
                                    <Label color="grey" variant="outline" isCompact>
                                      {clusterTypeLabelText(c.env)}
                                    </Label>
                                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }} flexWrap={{ default: 'wrap' }}>
                                      {crit === 0 && warn === 0 ? (
                                        <span className="ols-aio-text-subtle-sm">no alerts</span>
                                      ) : (
                                        <>
                                          {crit > 0 ? (
                                            <Flex
                                              alignItems={{ default: 'alignItemsCenter' }}
                                              gap={{ default: 'gapSm' }}
                                              flexWrap={{ default: 'nowrap' }}
                                            >
                                              <span className="ols-aio-metric-kpi-stat-icon" aria-hidden="true">
                                                <ExclamationCircleIcon
                                                  style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}
                                                />
                                              </span>
                                              <Button
                                                variant="link"
                                                isInline
                                                className="ols-aio-card-stat-number--drill"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  navigate(clusterDrillHref(c.id, 'alert-critical'));
                                                }}
                                                aria-label={`Open critical alerts for ${c.name}`}
                                              >
                                                {crit}
                                              </Button>
                                            </Flex>
                                          ) : null}
                                          {warn > 0 ? (
                                            <Flex
                                              alignItems={{ default: 'alignItemsCenter' }}
                                              gap={{ default: 'gapSm' }}
                                              flexWrap={{ default: 'nowrap' }}
                                            >
                                              <span className="ols-aio-metric-kpi-stat-icon" aria-hidden="true">
                                                <ExclamationTriangleIcon
                                                  style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}
                                                />
                                              </span>
                                              <Button
                                                variant="link"
                                                isInline
                                                className="ols-aio-card-stat-number--drill"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  navigate(clusterDrillHref(c.id, 'alert-warning'));
                                                }}
                                                aria-label={`Open warning alerts for ${c.name}`}
                                              >
                                                {warn}
                                              </Button>
                                            </Flex>
                                          ) : null}
                                        </>
                                      )}
                                    </Flex>
                                  </Flex>
                                  <Flex
                                    justifyContent={{ default: 'justifyContentSpaceBetween' }}
                                    style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                                  >
                                    <span
                                      className="ols-aio-text-subtle-sm"
                                      style={{ fontVariantNumeric: 'tabular-nums' }}
                                    >
                                      v{c.version}
                                    </span>
                                    <span
                                      className="ols-aio-text-subtle-sm"
                                      style={{ fontVariantNumeric: 'tabular-nums' }}
                                    >
                                      {c.nodes} nodes
                                    </span>
                                  </Flex>
                                  </CardBody>
                                </Card>
                              </div>
                            </GalleryItem>
                          );
                        })}
                      </Gallery>
                    </CardBody>
                  </CardExpandableContent>
                </Card>
              </StackItem>
            </Stack>
          ) : selectedCluster ? (
            <Stack hasGutter>
              <StackItem>
                <Card className="ols-aio-subcard" isCompact isExpanded={cAwayOpen} id={`${WIDGET_ID}-c-away`}>
                  <CardHeader
                    onExpand={() => setCAwayOpen((o) => !o)}
                    toggleButtonProps={{
                      id: `${WIDGET_ID}-c-away-toggle`,
                      'aria-label': 'Toggle While you were away section',
                    }}
                  >
                    <Stack>
                      <StackItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                          <CardTitle component="h3">
                            {isMultiCluster ? `While you were away — ${selectedCluster.name}` : 'While you were away'}
                          </CardTitle>
                          <Label color="blue" isCompact>
                            {clusterWhileYouWereAwayChipLabel}
                          </Label>
                        </Flex>
                      </StackItem>
                      <StackItem style={{ marginTop: 'var(--pf-t--global--spacer--xs)' }}>
                        <Flex
                          justifyContent={{ default: 'justifyContentSpaceBetween' }}
                          alignItems={{ default: 'alignItemsCenter' }}
                          flexWrap={{ default: 'wrap' }}
                        >
                          <span className="ols-aio-text-subtle-sm">Since your last visit · 38m ago</span>
                          <Button
                            variant="link"
                            isInline
                            isDisabled={visibleClusterAwayDigestItems.length === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAllClusterAwayDigests(selectedClusterId);
                            }}
                            aria-label="Dismiss all digest alerts for this cluster"
                          >
                            Dismiss all
                          </Button>
                        </Flex>
                      </StackItem>
                    </Stack>
                  </CardHeader>
                  <CardExpandableContent>
                    <CardBody>
                      {visibleClusterAwayDigestItems.length === 0 ? (
                        <EmptyState variant={EmptyStateVariant.lg} style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                          <EmptyStateBody>
                            <Title headingLevel="h4" size="lg">
                              You&apos;re all caught up
                            </Title>
                            <Content
                              component="p"
                              style={{ marginTop: 'var(--pf-t--global--spacer--sm)', marginBottom: 0 }}
                            >
                              There are currently no active digest items for {selectedCluster.name}.
                            </Content>
                          </EmptyStateBody>
                        </EmptyState>
                      ) : (
                        <Stack hasGutter style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                          {visibleClusterAwayDigestItems.map((item) => (
                            <StackItem key={clusterAwayDismissKey(selectedClusterId, item.text)}>
                              <Alert
                                isInline
                                variant={item.tone}
                                title={item.text}
                                actionClose={
                                  <AlertActionCloseButton
                                    onClose={() => dismissClusterAwayDigest(selectedClusterId, item.text)}
                                    aria-label={`Dismiss: ${item.text}`}
                                  />
                                }
                              >
                                <Content
                                  component="p"
                                  className="ols-aio-text-subtle-sm"
                                  style={{
                                    marginTop: 'var(--pf-t--global--spacer--xs)',
                                    marginBottom: 0,
                                  }}
                                >
                                  {item.meta}
                                </Content>
                              </Alert>
                            </StackItem>
                          ))}
                        </Stack>
                      )}
                    </CardBody>
                  </CardExpandableContent>
                </Card>
              </StackItem>

              <StackItem>
                <Card className="ols-aio-subcard" isCompact isExpanded={cHealthOpen} id={`${WIDGET_ID}-c-health`}>
                  <CardHeader
                    onExpand={() => setCHealthOpen((o) => !o)}
                    toggleButtonProps={{
                      id: `${WIDGET_ID}-c-health-toggle`,
                      'aria-label': 'Toggle cluster health section',
                    }}
                  >
                    <Flex alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                      <FlexItem style={{ marginRight: 'var(--pf-t--global--spacer--sm)' }}>
                        <Title headingLevel="h3" size="lg">
                          Cluster health
                        </Title>
                      </FlexItem>
                      <Label color="grey" variant="outline" isCompact>
                        {selectedCluster.name}
                      </Label>
                    </Flex>
                  </CardHeader>
                  <CardExpandableContent>
                    <CardBody>
                      <Grid hasGutter>
                        <GridItem span={12} md={4}>
                          <ObserveMetricStatCard
                            cardTitle="Critical alerts"
                            titleIcon={
                              <ExclamationCircleIcon
                                style={{ color: 'var(--pf-t--global--color--status--danger--default)' }}
                              />
                            }
                            statistic={criticalOnCluster}
                            statisticAriaLabel={`Open Alerting Alerts tab, critical filter, for ${selectedCluster.name}`}
                            onStatisticClick={() =>
                              navigate(
                                alertingHref({
                                  tab: 'alerts',
                                  severity: 'critical',
                                  clusterId: selectedCluster.id,
                                  aiHubFleetScope: true,
                                })
                              )
                            }
                            statisticInteractive
                            statisticTooltip={
                              <AlertKpiTooltip bucketLabel="Critical alerts" rows={clusterCriticalBreakdown} />
                            }
                            caption={`on ${selectedCluster.name}`}
                          />
                        </GridItem>
                        <GridItem span={12} md={4}>
                          <ObserveMetricStatCard
                            cardTitle="Warning alerts"
                            titleIcon={
                              <ExclamationTriangleIcon
                                style={{ color: 'var(--pf-t--global--color--status--warning--default)' }}
                              />
                            }
                            statistic={warningOnCluster}
                            statisticAriaLabel={`Open Alerting Alerts tab, warning filter, for ${selectedCluster.name}`}
                            onStatisticClick={() =>
                              navigate(
                                alertingHref({
                                  tab: 'alerts',
                                  severity: 'warning',
                                  clusterId: selectedCluster.id,
                                  aiHubFleetScope: true,
                                })
                              )
                            }
                            statisticInteractive
                            statisticTooltip={
                              <AlertKpiTooltip bucketLabel="Warning alerts" rows={clusterWarningBreakdown} />
                            }
                            caption={`on ${selectedCluster.name}`}
                          />
                        </GridItem>
                        <GridItem span={12} md={4}>
                          <ObserveMetricStatCard
                            cardTitle="Nodes / Version"
                            statistic={
                              <>
                                {selectedCluster.nodes} / {selectedCluster.version}
                              </>
                            }
                            statisticAriaLabel={`Nodes and version for ${selectedCluster.name}`}
                            onStatisticClick={() => {}}
                            statisticInteractive={false}
                            caption={`${selectedCluster.provider} · ${selectedCluster.region}`}
                          />
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </CardExpandableContent>
                </Card>
              </StackItem>

              <StackItem>
                <Card className="ols-aio-subcard" isCompact isExpanded={cAlertsOpen} id={`${WIDGET_ID}-c-alerts`}>
                  <CardHeader
                    onExpand={() => setCAlertsOpen((o) => !o)}
                    toggleButtonProps={{
                      id: `${WIDGET_ID}-c-alerts-toggle`,
                      'aria-label': 'Toggle Top alerts section',
                    }}
                  >
                    <Flex alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'wrap' }}>
                      <FlexItem style={{ marginRight: 'var(--pf-t--global--spacer--sm)' }}>
                        <Title headingLevel="h3" size="lg">
                          Top alerts
                        </Title>
                      </FlexItem>
                      <Label color="grey" variant="outline" isCompact>
                        {clusterAlerts.length} on {selectedCluster.name}
                      </Label>
                    </Flex>
                  </CardHeader>
                  <CardExpandableContent>
                    <CardBody>
                      {clusterAlerts.length === 0 ? (
                        <EmptyState variant={EmptyStateVariant.lg}>
                          <EmptyStateBody>
                            <Title headingLevel="h4" size="lg">
                              No active alerts
                            </Title>
                            <Content component="p" style={{ marginTop: 'var(--pf-t--global--spacer--sm)', marginBottom: 0 }}>
                              Agent is idle on {selectedCluster.name}.
                            </Content>
                          </EmptyStateBody>
                        </EmptyState>
                      ) : (
                        <Stack hasGutter>
                          {clusterAlerts.map((a) => (
                            <ObserveAlertItem
                              key={a.id}
                              alert={a}
                              isExpanded={expandedAlerts[a.id] ?? false}
                              onToggle={(open) => toggleAlert(a.id, open)}
                              onDiscussWithLightspeed={discussLightspeed}
                            />
                          ))}
                        </Stack>
                      )}
                    </CardBody>
                  </CardExpandableContent>
                </Card>
              </StackItem>
            </Stack>
          ) : (
            <EmptyState variant={EmptyStateVariant.lg}>
              <EmptyStateBody>
                <Title headingLevel="h4" size="lg">
                  Select a cluster
                </Title>
                <Content
                  component="p"
                  style={{ marginTop: 'var(--pf-t--global--spacer--sm)', marginBottom: 0, maxWidth: 520 }}
                >
                  No cluster is selected. Use the <strong>cluster menu</strong> above to choose which environment to
                  inspect first.
                </Content>
              </EmptyStateBody>
            </EmptyState>
          )}
        </CardBody>
      </CardExpandableContent>
    </Card>
    </>
    </SimulationProvider>
  );
};
