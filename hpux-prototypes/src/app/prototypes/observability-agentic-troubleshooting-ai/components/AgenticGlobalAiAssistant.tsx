import React, { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerPanelBody,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  SearchInput,
  Badge,
  Label,
  LabelGroup,
  Flex,
  FlexItem,
  Pagination,
  PaginationVariant,
  Tooltip,
  TextInput,
  Stack,
  StackItem,
  ExpandableSection,
  Bullseye,
  Alert,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateActions,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Grid,
  GridItem,
  Icon,
  Spinner,
  CodeBlock,
  CodeBlockCode,
  CodeBlockAction,
} from '@patternfly/react-core';
import {
  UserIcon,
  RobotIcon,
  FilterIcon,
  StarIcon,
  TimesIcon,
  MicrophoneIcon,
  PaperPlaneIcon,
  PlusIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckIcon,
  CheckCircleIcon,
  ExternalLinkAltIcon,
  AngleRightIcon,
  ServerIcon,
  CpuIcon,
  ClockIcon,
  PencilAltIcon,
  TrashIcon,
  MinusIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import {
  ChartBar,
  ChartGroup,
  ChartAxis,
  ChartThemeColor,
  ChartArea,
  ChartLine,
  ChartDonut,
  ChartLegend,
  ChartVoronoiContainer,
  ChartDonutUtilization,
  ChartDonutThreshold,
  ChartContainer,
  ChartLabel,
} from '@patternfly/react-charts/victory';
import { Charts } from '@patternfly/react-charts/echarts';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import { MessageBox } from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotHeader, { ChatbotHeaderMain, ChatbotHeaderTitle, ChatbotHeaderActions } from '@patternfly/chatbot/dist/esm/ChatbotHeader';
import '@patternfly/chatbot/dist/css/main.css';
import '../pages/dashboards-perses.css';

// Import custom profile images
import userProfilePicUrl from '../assets/user-profile.png';
import olsLogoUrl from '../assets/ols-logo.png';
import { persesAgenticBridge, agenticGlobalAiApi, type DiscussLightspeedContext } from '../persesAgenticBridge';
import { useSimulation } from '../simulation/SimulationProvider';
import { getSimulationSnapshot } from '../simulation/simulationStore';
import type { SimulationHandoff } from '../simulation/simulationTypes';
import {
  buildDiscussOpening,
  buildObserveToChatHandoff,
  buildRecentTurnsForAdvisor,
  buildSituationBriefing,
  composeAdvisorReply,
  seedAdvisorMemoryFromHandoffAlert,
  seedAdvisorMemoryFromSnapshot,
} from '../simulation/olsAdvisorBrain';
import { resetConversationMemory } from '../simulation/olsConversationMemory';

/** Viewport inset for OLS chrome dock (`right` / `bottom` on `.ols-ai-chrome-dock`). */
const OLS_LAUNCHER_VIEWPORT_MARGIN_PX = 24;

const OLS_AI_CHAT_TOP_VAR = '--ols-ai-chat-top';
/** Dock inset from viewport inline-end / block-end (px on `documentElement`). */
const OLS_AI_CHROME_INLINE_END_VAR = '--ols-ai-chrome-inline-end';
const OLS_AI_CHROME_BOTTOM_VAR = '--ols-ai-chrome-bottom';

/** Vertical gap between chat card bottom and launcher (must match `.ols-ai-chrome-launcher-gap` in CSS). */
const OLS_CHAT_GAP_ABOVE_LAUNCHER_PX = 8;

/** Shorter chat card (px): dock height minus launcher stack minus this value (see `syncOlsDrawerHeight`). */
const OLS_CHAT_BOTTOM_TRIM_PX = 48;

/** Set on `.ols-ai-chrome-dock` while the drawer is open — `height` on `.ols-prototype-ai-drawer` (CSS). */
const OLS_AI_PROTOTYPE_DRAWER_H_VAR = '--ols-ai-prototype-drawer-h';

/** Popper tooltip above `.ols-ai-chrome-dock` (dock `z-index` is 10000). */
const OLS_LAUNCHER_TOOLTIP_ZINDEX = 10050;

/** PatternFly `Masthead` root in AppLayout — `top` of the fixed chat aligns to this element’s bottom edge. */
const OLS_PAGE_MASTHEAD_SELECTOR = '.pf-v6-c-masthead';
/** If masthead markup differs, fall back to the page header region that wraps it. */
const OLS_PAGE_HEADER_FALLBACK_SELECTOR = '.pf-v6-c-page__header';

/**
 * PF chatbot CSS pins `.pf-chatbot__button` with `position: fixed` + logical insets, which ignores the host
 * wrapper and adds extra horizontal offset. Inline styles win over those rules (no `!important` on PF).
 */
const OLS_LAUNCHER_TOGGLE_BUTTON_STYLE = {
  position: 'relative' as const,
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  insetInlineStart: 'auto',
  insetInlineEnd: 'auto',
  insetBlockStart: 'auto',
  insetBlockEnd: 'auto',
};

// Helper function to create SVG data URL
const createIconDataUrl = (svgContent: string): string => {
  const encoded = encodeURIComponent(svgContent);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
};

// Simple SVG icons as data URLs
// User icon - simple person silhouette
const userIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="64" height="64">
  <path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
</svg>`;

// Robot icon - simple robot head
const robotIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="64" height="64">
  <path fill="currentColor" d="M32 224h32v192H32c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm544-32c17.7 0 32 14.3 32 32v128c0 17.7-14.3 32-32 32h-32V224h32zm-120 96c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8v-64c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v64zm192 0c0 4.4-3.6 8-8 8h-16c-4.4 0-8-3.6-8-8v-64c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v64zM592 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h544c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM160 368H64v-64h96v64zm0-128H64v-64h96v64zm160 128h-96v-64h96v64zm0-128h-96v-64h96v64zm160 128h-96v-64h96v64zm0-128h-96v-64h96v64z"/>
</svg>`;

// Avatar configuration - use custom images, fallback to icon data URLs if images fail to load
const userAvatarSrc = userProfilePicUrl || createIconDataUrl(userIconSvg);
/** Lightspeed assistant avatar in message threads — matches header / launcher branding. */
const botAvatarSrc = olsLogoUrl || createIconDataUrl(robotIconSvg);

// Welcome prompts will be defined inside the component to access handleSendMessage

/** Display name for assistant messages (OpenShift Lightspeed–style shell). */
const BOT_DISPLAY_NAME = 'OpenShift Lightspeed';

/** OLS logo for panel header and empty-state intro (48×48; matches launcher control size). */
const LightspeedHeaderMark = () => (
  <img src={olsLogoUrl} alt="" className="lightspeed-header-ols-logo" width={48} height={48} />
);

/** Full-size logo inside the floating launcher button (closed state). */
const OlsFloatingLauncherLogo = () => (
  <img src={olsLogoUrl} alt="" className="ols-floating-launcher__logo" />
);

/** Reusable disclaimer shown before manual instructions (info Alert). */
const DISCLAIMER_TEXT = 'I cannot carry out direct actions on a cluster. Here are instructions on how you can proceed.';

/** Disclaimer Alert component for chatbot manual-instruction responses. */
const ChatbotDisclaimerAlert: React.FC = () => (
  <Alert variant="info" title={DISCLAIMER_TEXT} style={{ marginTop: '12px', marginBottom: '12px' }} />
);

/** CLI command for scaling web-head in marketing-prod (for copy/paste). */
const SCALE_COMMAND = `kubectl scale deployment web-head -n marketing-prod --replicas=2`;

/** PromQL query used for the Top 3 CPU-Consuming Namespaces chart (query disclosure). */
const CPU_NAMESPACE_PROMQL =
  'topk(5, sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate) by (namespace))';

/** Inline copy icon SVG (same path as PF CopyIcon) so it is always visible regardless of theme/PF overrides. */
const CopyIconSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 448 512"
    width="1em"
    height="1em"
    fill="currentColor"
    role="img"
    aria-hidden
    {...props}
  >
    <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z" />
  </svg>
);

/** Copy button for CodeBlock header: inline SVG + Tooltip (triggerRef keeps button visible). */
const CodeBlockCopyButton: React.FC<{
  id: string;
  ariaLabel: string;
  textToCopy: string;
  copied: boolean;
  onCopy: () => void;
  onTooltipHidden: () => void;
}> = ({ id, ariaLabel, textToCopy, copied, onCopy, onTooltipHidden }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <Tooltip
      content={copied ? 'Copied!' : 'Copy to clipboard'}
      triggerRef={buttonRef}
      exitDelay={copied ? 1500 : 600}
      onTooltipHidden={onTooltipHidden}
    >
      <button
        ref={buttonRef}
        type="button"
        id={id}
        className="pf-chatbot__button--copy pf-chatbot__code-block-copy-button"
        aria-label={ariaLabel}
        onClick={() => {
          navigator.clipboard.writeText(textToCopy);
          onCopy();
        }}
      >
        <CopyIconSvg />
      </button>
    </Tooltip>
  );
};

/** CodeBlock with copy button for the CPU chart PromQL query (query disclosure below the chart).
 *  Wrapper constrains width so the block does not extend the chat bubble; long lines wrap (standard PF behavior). */
const CpuChartQueryCodeBlock: React.FC = () => {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ marginTop: '12px', maxWidth: '100%', minWidth: 0 }}>
      <CodeBlock
        className="pf-chatbot__message-code-block"
        actions={
          <CodeBlockAction>
            <span className="pf-chatbot__code-block-language pf-chatbot__message-code-block-language">PROMQL</span>
            <CodeBlockCopyButton
              id="cpu-promql-copy"
              ariaLabel="Copy PromQL query"
              textToCopy={CPU_NAMESPACE_PROMQL}
              copied={copied}
              onCopy={() => setCopied(true)}
              onTooltipHidden={() => setCopied(false)}
            />
          </CodeBlockAction>
        }
      >
        <CodeBlockCode id="cpu-promql-content">{CPU_NAMESPACE_PROMQL}</CodeBlockCode>
      </CodeBlock>
    </div>
  );
};

/** CodeBlock with copy button for scaling CLI (used in chatbot manual-instruction messages). */
const ScalingStepsCodeBlock: React.FC = () => {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ marginTop: '12px', maxWidth: '100%', minWidth: 0 }}>
      <Content>
        <p>The recommended path is to scale the <strong>web-head</strong> deployment in <strong>marketing-prod</strong>. Copy and run the command below in your terminal:</p>
      </Content>
      <CodeBlock
        className="pf-chatbot__message-code-block"
        actions={
          <CodeBlockAction>
            <span className="pf-chatbot__code-block-language pf-chatbot__message-code-block-language">BASH</span>
            <CodeBlockCopyButton
              id="scaling-cmd-copy"
              ariaLabel="Copy scaling command"
              textToCopy={SCALE_COMMAND}
              copied={copied}
              onCopy={() => setCopied(true)}
              onTooltipHidden={() => setCopied(false)}
            />
          </CodeBlockAction>
        }
      >
        <CodeBlockCode id="scaling-cmd-content">{SCALE_COMMAND}</CodeBlockCode>
      </CodeBlock>
    </div>
  );
};

const PILL_COMPLETED_BG = '#9FCCF7';
const PILL_COMPLETED_TEXT = '#151515';

/** Custom pill buttons we control so both show solid blue when selected (avoids PF QuickResponse styling issues). */
const CustomQuickResponsePills: React.FC<{
  containerId: string;
  pills: Array<{ id: string; content: string; onClick: () => void }>;
  selectedQuickResponses: Array<{ containerId: string; content: string }>;
}> = ({ containerId, pills, selectedQuickResponses }) => {
  const selectedSet = useMemo(
    () => new Set(selectedQuickResponses.filter((p) => p.containerId === containerId).map((p) => p.content)),
    [containerId, selectedQuickResponses]
  );
  return (
    <LabelGroup className="pf-chatbot__message-quick-response" style={{ marginTop: 8 }}>
      {pills.map(({ id, content, onClick }) => {
        const selected = selectedSet.has(content);
        return (
          <Label
            key={id}
            color="blue"
            variant="outline"
            isClickable={!selected}
            onClick={selected ? undefined : onClick}
            icon={selected ? <CheckIcon /> : undefined}
            style={
              selected
                ? {
                    backgroundColor: PILL_COMPLETED_BG,
                    borderColor: PILL_COMPLETED_BG,
                    color: PILL_COMPLETED_TEXT,
                    cursor: 'default'
                  }
                : undefined
            }
            className={selected ? 'pf-chatbot__message-quick-response--selected' : ''}
          >
            {content}
          </Label>
        );
      })}
    </LabelGroup>
  );
};

/** Message with optional custom pills (we render pills ourselves for consistent completed state). */
type MessageWithCustomPills = MessageProps & {
  customPillsConfig?: {
    containerId: string;
    pills: Array<{ id: string; content: string; onClick: () => void }>;
  };
};

/**
 * Globally mounted AI assistant (floating toggle + drawer) for this prototype.
 * Perses-specific UI is driven via persesAgenticBridge when that page registers callbacks.
 * Cluster truth + Autonomous analysis scope: `simulationStore` / `olsAdvisorBrain` (persona: `OLS_SRE_ADVISOR_SYSTEM_DIRECTIVES`).
 */
export const AgenticGlobalAiAssistant: React.FC = () => {
  const simulation = useSimulation();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedQuickResponses, setSelectedQuickResponses] = useState<Array<{ containerId: string; content: string }>>([]);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [announcement, setAnnouncement] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotToggleRef = useRef<HTMLDivElement>(null);
  const olsChromeDockRef = useRef<HTMLDivElement>(null);
  const olsLauncherStackRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<MessageProps[]>([]);
  const workflowStageRef = useRef<'idle' | 'stage1' | 'stage2' | 'stage3' | 'stage4'>('idle');
  /** Suppress duplicate Autonomous analysis → OLS intro when the drawer is reopened. */
  const observeIntroHandoffShownRef = useRef(false);

  const markQuickResponseSelected = useCallback((containerId: string, content: string) => {
    setSelectedQuickResponses((prev) => {
      if (prev.some((p) => p.containerId === containerId && p.content === content)) return prev;
      return [...prev, { containerId, content }];
    });
    setMessages((prev) =>
      prev.map((m: any) => {
        if (m?.quickResponseContainerProps?.id !== containerId || !Array.isArray(m?.quickResponses)) return m;
        // Derive from previous message state so we don't rely on stale closure (second pill's onClick was created with old selectedQuickResponses)
        const selectedContents = new Set(
          m.quickResponses.filter((qr: any) => qr?.isSelected).map((qr: any) => qr?.content)
        );
        selectedContents.add(content);
        return {
          ...m,
          quickResponses: m.quickResponses.map((qr: any) => {
            const selected = selectedContents.has(qr?.content);
            return {
              ...qr,
              icon: selected ? <CheckIcon /> : undefined,
              isSelected: selected,
              onClick: selected ? () => {} : qr?.onClick
            };
          })
        };
      })
    );
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /**
   * Masthead → `--ols-ai-chat-top`; dock insets → chrome vars (chat + launcher share one fixed stack in CSS).
   */
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(OLS_AI_CHROME_INLINE_END_VAR, `${OLS_LAUNCHER_VIEWPORT_MARGIN_PX}px`);
    root.style.setProperty(OLS_AI_CHROME_BOTTOM_VAR, `${OLS_LAUNCHER_VIEWPORT_MARGIN_PX}px`);
    root.style.setProperty('--ols-ai-chrome-chat-launcher-gap', `${OLS_CHAT_GAP_ABOVE_LAUNCHER_PX}px`);

    const resolveMastheadEl = () =>
      (document.querySelector(OLS_PAGE_MASTHEAD_SELECTOR) ??
        document.querySelector(OLS_PAGE_HEADER_FALLBACK_SELECTOR)) as HTMLElement | null;

    let topRafOuter = 0;
    let topRafInner = 0;

    const syncTop = () => {
      const el = resolveMastheadEl();
      const topPx = el ? Math.max(0, Math.round(el.getBoundingClientRect().bottom)) : 0;
      const next = `${topPx}px`;
      if (root.style.getPropertyValue(OLS_AI_CHAT_TOP_VAR) !== next) {
        root.style.setProperty(OLS_AI_CHAT_TOP_VAR, next);
      }
    };

    /** Same-frame layout writes from RO callbacks cause webpack dev overlay "ResizeObserver loop…"; defer past layout. */
    const scheduleTopSync = () => {
      cancelAnimationFrame(topRafOuter);
      cancelAnimationFrame(topRafInner);
      topRafOuter = requestAnimationFrame(() => {
        topRafInner = requestAnimationFrame(() => {
          topRafOuter = 0;
          topRafInner = 0;
          syncTop();
        });
      });
    };

    syncTop();
    window.addEventListener('resize', scheduleTopSync);
    window.addEventListener('scroll', scheduleTopSync, true);

    const observed = resolveMastheadEl();
    const ro = observed ? new ResizeObserver(scheduleTopSync) : undefined;
    if (observed && ro) {
      ro.observe(observed);
    }

    return () => {
      cancelAnimationFrame(topRafOuter);
      cancelAnimationFrame(topRafInner);
      window.removeEventListener('resize', scheduleTopSync);
      window.removeEventListener('scroll', scheduleTopSync, true);
      ro?.disconnect();
      root.style.removeProperty(OLS_AI_CHAT_TOP_VAR);
      root.style.removeProperty(OLS_AI_CHROME_INLINE_END_VAR);
      root.style.removeProperty(OLS_AI_CHROME_BOTTOM_VAR);
      root.style.removeProperty('--ols-ai-chrome-chat-launcher-gap');
    };
  }, []);

  /** Drawer height from dock − launcher row − bottom trim; `margin-bottom: auto` on the drawer absorbs leftover flex space. */
  useLayoutEffect(() => {
    const dock = olsChromeDockRef.current;
    const stack = olsLauncherStackRef.current;
    if (!dock || !stack) return;

    let rafOuter = 0;
    let rafInner = 0;

    const sync = () => {
      if (!isDrawerOpen) {
        dock.style.removeProperty(OLS_AI_PROTOTYPE_DRAWER_H_VAR);
        return;
      }
      const dh = dock.offsetHeight;
      const sh = stack.offsetHeight;
      const drawerH = Math.max(120, dh - sh - OLS_CHAT_BOTTOM_TRIM_PX);
      const next = `${drawerH}px`;
      if (dock.style.getPropertyValue(OLS_AI_PROTOTYPE_DRAWER_H_VAR) !== next) {
        dock.style.setProperty(OLS_AI_PROTOTYPE_DRAWER_H_VAR, next);
      }
    };

    /** RO + layout writes in the same turn trigger "ResizeObserver loop… undelivered notifications"; defer past layout. */
    const scheduleSync = () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      rafOuter = requestAnimationFrame(() => {
        rafInner = requestAnimationFrame(() => {
          rafOuter = 0;
          rafInner = 0;
          sync();
        });
      });
    };

    scheduleSync();
    const ro = new ResizeObserver(scheduleSync);
    ro.observe(dock);
    ro.observe(stack);
    window.addEventListener('resize', scheduleSync);
    return () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      ro.disconnect();
      window.removeEventListener('resize', scheduleSync);
      dock.style.removeProperty(OLS_AI_PROTOTYPE_DRAWER_H_VAR);
    };
  }, [isDrawerOpen]);

  const triggerQuickResponseByContent = useCallback(
    (desiredContent: string) => {
      const list = messagesRef.current as MessageWithCustomPills[];
      for (let i = list.length - 1; i >= 0; i--) {
        const m = list[i];
        if (m?.role !== 'bot') continue;
        const custom = m?.customPillsConfig;
        if (custom) {
          const pill = custom.pills.find((x) => String(x?.content || '').toLowerCase() === desiredContent.toLowerCase());
          if (pill) {
            markQuickResponseSelected(custom.containerId, String(pill.content));
            if (typeof pill.onClick === 'function') pill.onClick();
            return true;
          }
          continue;
        }
        const qrs = m?.quickResponses;
        if (Array.isArray(qrs)) {
          const qr = qrs.find((x: any) => String(x?.content || '').toLowerCase() === desiredContent.toLowerCase());
          if (qr) {
            const containerId = m?.quickResponseContainerProps?.id;
            if (containerId) markQuickResponseSelected(containerId, String(qr.content));
            if (typeof qr.onClick === 'function') qr.onClick();
            return true;
          }
        }
      }
      return false;
    },
    [markQuickResponseSelected]
  );

  const getWorkflowIntentQuickResponse = (text: string) => {
    const normalized = text.toLowerCase().replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    const stage = workflowStageRef.current;

    if (stage === 'stage1') {
      if (normalized.includes('root cause') || (normalized.includes('analyze') && normalized.includes('root'))) {
        return 'Analyze root cause';
      }
      if (normalized.includes('node capacity') || (normalized.includes('check') && normalized.includes('node'))) {
        return 'Check node capacity';
      }
    }

    if (stage === 'stage2') {
      if (normalized.includes('troubleshooting dashboard') || normalized.includes('see troubleshooting') || (normalized.includes('generate') && normalized.includes('dashboard'))) {
        return 'See troubleshooting dashboard';
      }
      if (normalized.includes('scaling steps') || normalized.includes('scale down') || normalized.includes('replica')) {
        return 'See scaling steps';
      }
    }

    if (stage === 'stage3') {
      if (normalized.includes('save') && normalized.includes('dashboard')) {
        return 'Save this dashboard';
      }
    }

    return null;
  };

  // Auto-scrolls to the latest message (matching demo pattern)
  useEffect(() => {
    // Don't scroll on first load if no messages
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Generate unique ID for messages
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  // Rejection trigger: "Fix it", "Scale it", "Apply this" → disclaimer + steps (no direct actions).
  const isRejectionTrigger = useCallback((text: string) => {
    const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');
    return (
      normalized.includes('fix it') ||
      normalized === 'fix it' ||
      normalized.includes('scale it') ||
      normalized === 'scale it' ||
      normalized.includes('apply this') ||
      normalized === 'apply this'
    );
  }, []);

  // Handle sending messages
  const handleSendMessage = useCallback((message: string | number) => {
    const messageText = String(message);
    if (!messageText.trim()) return;

    // Rejection trigger: respond with disclaimer + manual steps (CodeBlock).
    if (isRejectionTrigger(messageText)) {
      const date = new Date();
      const userMessage: MessageProps = {
        id: generateId(),
        role: 'user',
        content: messageText,
        name: 'User',
        avatar: userAvatarSrc,
        timestamp: date.toLocaleString(),
        avatarProps: { isBordered: true }
      };
      const botMessage: MessageProps = {
        id: generateId(),
        role: 'bot',
        content: DISCLAIMER_TEXT,
        name: BOT_DISPLAY_NAME,
        avatar: botAvatarSrc,
        isLoading: false,
        timestamp: date.toLocaleString(),
        extraContent: {
          afterMainContent: (
            <>
              <ChatbotDisclaimerAlert />
              <Content style={{ marginTop: '12px' }}>
                <p>The recommended path is to scale the <strong>web-head</strong> deployment in <strong>marketing-prod</strong>. You can resolve this by copying and running the command below in your terminal:</p>
              </Content>
              <ScalingStepsCodeBlock />
            </>
          )
        }
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
      setAnnouncement(`Message from ${BOT_DISPLAY_NAME}: ${DISCLAIMER_TEXT}`);
      return;
    }

    // Conversational shortcut: let typed responses trigger the existing quick response chips.
    const intent = getWorkflowIntentQuickResponse(messageText);
    if (intent) {
      const date = new Date();
      const userMessage: MessageProps = {
        id: generateId(),
        role: 'user',
        content: messageText,
        name: 'User',
        avatar: userAvatarSrc,
        timestamp: date.toLocaleString(),
        avatarProps: { isBordered: true }
      };

      setMessages((prev) => [...prev, userMessage]);
      setAnnouncement(`Message from User: ${messageText}.`);

      setTimeout(() => {
        triggerQuickResponseByContent(intent);
      }, 0);
      return;
    }

    setIsSendButtonDisabled(true);
    const date = new Date();

    // Add user message
    const userMessage: MessageProps = {
      id: generateId(),
      role: 'user',
      content: messageText,
      name: 'User',
      avatar: userAvatarSrc,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true }
    };

    // Add loading bot message
    const loadingBotMessage: MessageProps = {
      id: generateId(),
      role: 'bot',
      content: 'Thinking...',
      name: BOT_DISPLAY_NAME,
      avatar: botAvatarSrc,
      isLoading: true,
      timestamp: date.toLocaleString()
    };

    setMessages((prev) => [...prev, userMessage, loadingBotMessage]);
    setAnnouncement(`Message from User: ${messageText}. Message from ${BOT_DISPLAY_NAME} is loading.`);

    // Scripted “Senior SRE Advisor” reply grounded in Autonomous analysis / simulation snapshot
    setTimeout(() => {
      const snap = getSimulationSnapshot();
      const recent = buildRecentTurnsForAdvisor(messagesRef.current);
      const body = composeAdvisorReply(messageText, snap, recent);
      const botMessage: MessageProps = {
        id: generateId(),
        role: 'bot',
        content: body,
        name: BOT_DISPLAY_NAME,
        avatar: botAvatarSrc,
        isLoading: false,
        timestamp: date.toLocaleString(),
        actions: {
          positive: { onClick: () => undefined },
          negative: { onClick: () => undefined },
          copy: { onClick: () => undefined },
          download: { onClick: () => undefined },
          listen: { onClick: () => undefined },
        },
      };
      setMessages((prev) => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex((m) => m.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = botMessage;
        }
        return newMessages;
      });
      setAnnouncement(`Message from ${BOT_DISPLAY_NAME}: ${body}`);
      setIsSendButtonDisabled(false);
    }, 650);
  }, [isRejectionTrigger, triggerQuickResponseByContent, getWorkflowIntentQuickResponse]);

  // Handle starting troubleshooting workflow from alert
  const handleStartTroubleshooting = useCallback((alertName: string) => {
    persesAgenticBridge.closeNotificationsDrawer?.();

    setIsDrawerOpen(true);

    observeIntroHandoffShownRef.current = false;
    setMessages([]);
    resetConversationMemory();

    workflowStageRef.current = 'stage1';
    
    const date = new Date();
    
    // Add user message (simulated - user clicked "Troubleshoot with AI")
    const userMessage: MessageProps = {
      id: generateId(),
      role: 'user',
      content: `Troubleshoot ${alertName}`,
      name: 'User',
      avatar: userAvatarSrc,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true }
    };
    
    // Add loading bot message
    const loadingBotMessage: MessageProps = {
      id: generateId(),
      role: 'bot',
      content: 'Analyzing alert...',
      name: BOT_DISPLAY_NAME,
      avatar: botAvatarSrc,
      isLoading: true,
      timestamp: date.toLocaleString()
    };
    
    setMessages([userMessage, loadingBotMessage]);
    
    // Simulate AI analysis and show Stage 1 response (custom pills so both show solid blue when selected)
    setTimeout(() => {
      const stage1QuickResponsesId = `qr-stage1-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
      const stage1Message: MessageWithCustomPills = {
        id: generateId(),
        role: 'bot',
        content: 'I\'ve analyzed the KubeCPUOvercommit alert. The cluster is currently requesting 115% of available CPU. Would you like to analyze the root cause or check the node capacity?',
        name: BOT_DISPLAY_NAME,
        avatar: botAvatarSrc,
        isLoading: false,
        timestamp: date.toLocaleString(),
        customPillsConfig: {
          containerId: stage1QuickResponsesId,
          pills: [
            {
              id: 'analyze-root-cause',
              content: 'Analyze root cause',
              onClick: () => {
                markQuickResponseSelected(stage1QuickResponsesId, 'Analyze root cause');
                handleStage2();
              }
            },
            {
              id: 'check-node-capacity',
              content: 'Check node capacity',
              onClick: () => {
                markQuickResponseSelected(stage1QuickResponsesId, 'Check node capacity');
                // Will implement in next step
              }
            }
          ]
        }
      };
      
      setMessages((prev) => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = stage1Message;
        }
        return newMessages;
      });
      setAnnouncement('AI analysis complete. Review the alert details and select an action.');
    }, 2000);
  }, []);

  // Build bot message for "See scaling steps" pill: natural-language flow (no disclaimer Alert).
  const buildScalingStepsMessage = useCallback((): MessageProps => ({
    id: generateId(),
    role: 'bot',
    content: 'I recommend scaling down the **web-head** deployment in **marketing-prod**. You can resolve this by following the steps below.',
    name: BOT_DISPLAY_NAME,
    avatar: botAvatarSrc,
    isLoading: false,
    timestamp: new Date().toLocaleString(),
    extraContent: {
      afterMainContent: <ScalingStepsCodeBlock />
    }
  }), []);

  // Handle Stage 2: Root Cause Analysis
  const handleStage2 = useCallback(() => {
    workflowStageRef.current = 'stage2';
    
    const date = new Date();
    
    // Add loading bot message
    const loadingBotMessage: MessageProps = {
      id: generateId(),
      role: 'bot',
      content: 'Analyzing root cause...',
      name: BOT_DISPLAY_NAME,
      avatar: botAvatarSrc,
      isLoading: true,
      timestamp: date.toLocaleString()
    };
    
    setMessages((prev) => [...prev, loadingBotMessage]);
    
    // Simulate AI root cause analysis
    setTimeout(() => {
      const stage2QuickResponsesId = `qr-stage2-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
      // Mock data for top 3 CPU-consuming namespaces
      const cpuData = [
        { x: 'marketing-prod', y: 45 },
        { x: 'sales-prod', y: 32 },
        { x: 'support-prod', y: 23 }
      ];
      
      const stage2Message: MessageWithCustomPills = {
        id: generateId(),
        role: 'bot',
        content: 'I\'ve identified the root cause: the **web-head** deployment in the **marketing-prod** namespace is consuming 45% of the cluster\'s CPU capacity, exceeding the namespace quota. Would you like to see a troubleshooting dashboard or see scaling steps?',
        name: BOT_DISPLAY_NAME,
        avatar: botAvatarSrc,
        isLoading: false,
        timestamp: date.toLocaleString(),
        extraContent: {
          afterMainContent: (
            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Top 3 CPU-Consuming Namespaces</CardTitle>
                </CardHeader>
                <CardBody className="pf-v6-u-pb-0">
                  <div style={{ height: '200px', width: '100%' }}>
                    <Charts
                      height={200}
                      option={{
                        tooltip: {
                          trigger: 'axis',
                          axisPointer: {
                            type: 'shadow'
                          },
                          formatter: (params: any) => {
                            const param = params[0];
                            return `${param.name}<br/>CPU Usage: ${param.value}%`;
                          }
                        },
                        grid: {
                          left: '60px',
                          right: '20px',
                          bottom: '100px',
                          top: '20px',
                          containLabel: false
                        },
                        xAxis: {
                          type: 'category',
                          data: cpuData.map(d => d.x),
                          name: 'Namespace',
                          nameLocation: 'middle',
                          nameGap: 80,
                          nameTextStyle: {
                            color: 'var(--pf-t--global--text--color--default)'
                          },
                          axisLabel: {
                            color: 'var(--pf-t--global--text--color--default)',
                            formatter: (value: string) => {
                              return value.length > 12 ? `${value.substring(0, 12)}...` : value;
                            },
                            rotate: 45
                          }
                        },
                        yAxis: {
                          type: 'value',
                          name: 'CPU Usage (%)',
                          nameLocation: 'middle',
                          nameGap: 50,
                          nameTextStyle: {
                            color: 'var(--pf-t--global--text--color--default)'
                          },
                          axisLabel: {
                            color: 'var(--pf-t--global--text--color--default)',
                            formatter: '{value}%'
                          }
                        },
                        series: [
                          {
                            name: 'CPU Usage',
                            type: 'bar',
                            data: cpuData.map(d => d.y),
                            label: {
                              show: true,
                              position: 'top',
                              formatter: '{c}%',
                              color: 'var(--pf-t--global--text--color--default)'
                            },
                            itemStyle: {
                              color: '#0066cc'
                            }
                          }
                        ]
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
              <CpuChartQueryCodeBlock />
            </div>
          )
        },
        customPillsConfig: {
          containerId: stage2QuickResponsesId,
          pills: [
            {
              id: 'generate-dashboard',
              content: 'See troubleshooting dashboard',
              onClick: () => {
                markQuickResponseSelected(stage2QuickResponsesId, 'See troubleshooting dashboard');
                handleStage3();
              }
            },
            {
              id: 'scale-down-replicas',
              content: 'See scaling steps',
              onClick: () => {
                markQuickResponseSelected(stage2QuickResponsesId, 'See scaling steps');
                setMessages((prev) => [...prev, buildScalingStepsMessage()]);
              }
            }
          ]
        }
      };
      
      setMessages((prev) => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = stage2Message;
        }
        return newMessages;
      });
      setAnnouncement('Root cause analysis complete. The web-head deployment in marketing-prod is the culprit.');
    }, 2000);
  }, [generateId, setMessages, setAnnouncement, buildScalingStepsMessage]);

  // Handle Stage 3: Dashboard Generation
  const handleStage3 = useCallback(() => {
    workflowStageRef.current = 'stage3';
    persesAgenticBridge.setIsGeneratingDashboard?.(true);

    const date = new Date();

    // Add loading bot message
    const loadingBotMessage: MessageProps = {
      id: generateId(),
      role: 'bot',
      content: 'Building Perses Dashboard Definition...',
      name: BOT_DISPLAY_NAME,
      avatar: botAvatarSrc,
      isLoading: true,
      timestamp: date.toLocaleString()
    };
    
    setMessages((prev) => [...prev, loadingBotMessage]);
    
    // Simulate dashboard generation
    setTimeout(() => {
      const stage3QuickResponsesId = `qr-stage3-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
      const stage3Message: MessageWithCustomPills = {
        id: generateId(),
        role: 'bot',
        content: 'I\'ve generated a temporary troubleshooting dashboard for the **marketing-prod** namespace. Would you like to save this dashboard?',
        name: BOT_DISPLAY_NAME,
        avatar: botAvatarSrc,
        isLoading: false,
        timestamp: date.toLocaleString(),
        customPillsConfig: {
          containerId: stage3QuickResponsesId,
          pills: [
            {
              id: 'save-dashboard',
              content: 'Save this dashboard',
              onClick: () => {
                markQuickResponseSelected(stage3QuickResponsesId, 'Save this dashboard');
                // Placeholder: in a real flow would open save dialog
              }
            }
          ]
        }
      };
      
      setMessages((prev) => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = stage3Message;
        }
        return newMessages;
      });
      setAnnouncement('Troubleshooting dashboard generated. Review the investigation room below.');

      persesAgenticBridge.setShowTroubleshootingDashboard?.(true);
      persesAgenticBridge.setIsGeneratingDashboard?.(false);
    }, 3000);
  }, [generateId, setMessages, setAnnouncement]);

  const welcomePrompts = useMemo(
    () => [
      {
        title: 'What is happening right now?',
        message: 'What is happening right now on the cluster?',
      },
      {
        title: 'Where should I look in the console?',
        message: 'Where should I look in the OpenShift console to validate this incident?',
      },
      {
        title: 'Explain the autonomous findings',
        message: 'Summarize what Autonomous analysis found and the remediation risk.',
      },
    ],
    []
  );

  const situationLine = useMemo(() => buildSituationBriefing(simulation), [simulation]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    resetConversationMemory();
    setSelectedQuickResponses([]);
    workflowStageRef.current = 'idle';
    observeIntroHandoffShownRef.current = false;
    setAnnouncement(undefined);
  }, []);

  const toggleChatDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => {
      const next = !prev;
      if (next) {
        queueMicrotask(() => {
          if (observeIntroHandoffShownRef.current) {
            return;
          }
          const snap = getSimulationSnapshot();
          if (!snap.isIncidentActive) {
            return;
          }
          if (messagesRef.current.length > 0) {
            return;
          }
          observeIntroHandoffShownRef.current = true;
          const ts = new Date().toLocaleString();
          setMessages([
            {
              id: generateId(),
              role: 'bot',
              content: buildObserveToChatHandoff(snap),
              name: BOT_DISPLAY_NAME,
              avatar: botAvatarSrc,
              timestamp: ts,
            },
          ]);
          seedAdvisorMemoryFromSnapshot(snap);
          setAnnouncement(`Message from ${BOT_DISPLAY_NAME}: Autonomous analysis handoff.`);
        });
      }
      return next;
    });
  }, []);

  const handleOpenDiscussWithLightspeed = useCallback((ctx: DiscussLightspeedContext) => {
    observeIntroHandoffShownRef.current = true;
    const snap = getSimulationSnapshot();
    const handoff: SimulationHandoff = {
      source: ctx.cardId === 'remediation' ? 'discuss-remediation' : 'discuss-rca',
      alertId: ctx.alertId,
      cardId: ctx.cardId,
      diagnosisName: ctx.diagnosisName,
    };
    const ts = new Date().toLocaleString();
    const opening: MessageProps = {
      id: generateId(),
      role: 'bot',
      content: buildDiscussOpening(snap, handoff),
      name: BOT_DISPLAY_NAME,
      avatar: botAvatarSrc,
      timestamp: ts,
    };
    setMessages([opening]);
    seedAdvisorMemoryFromHandoffAlert(ctx.alertId);
    setAnnouncement(`Message from ${BOT_DISPLAY_NAME}: ${ctx.diagnosisName} context.`);
    setIsDrawerOpen(true);
  }, []);

  useEffect(() => {
    agenticGlobalAiApi.startTroubleshootingForAlert = handleStartTroubleshooting;
    agenticGlobalAiApi.openDiscussWithLightspeed = handleOpenDiscussWithLightspeed;
    return () => {
      agenticGlobalAiApi.startTroubleshootingForAlert = null;
      agenticGlobalAiApi.openDiscussWithLightspeed = null;
    };
  }, [handleStartTroubleshooting, handleOpenDiscussWithLightspeed]);

  const olsChromeDockClassName = `ols-ai-chrome-dock${isDrawerOpen ? ' ols-ai-chrome-dock--chat-open' : ''}`;

  return (
    <>
    {/* One fixed stacking column: chat (when open) + launcher — right edges align via shared dock width (dashboards-perses.css). */}
    {createPortal(
      <div ref={olsChromeDockRef} className={olsChromeDockClassName}>
        {isDrawerOpen && (
        <div className="ols-prototype-ai-drawer">
          <div className="ols-prototype-ai-drawer-inner" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#ffffff' }}>
            <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Chatbot displayMode={ChatbotDisplayMode.drawer}>
              <ChatbotHeader style={{ flexShrink: 0, display: 'flex', visibility: 'visible' }}>
                <ChatbotHeaderMain className="lightspeed-header-main">
                  <span className="lightspeed-header-mark" aria-hidden>
                    <LightspeedHeaderMark />
                  </span>
                  <ChatbotHeaderTitle className="lightspeed-header-title">
                    <Title headingLevel="h2" size="2xl" className="lightspeed-header-title-text">
                      Red Hat OpenShift Lightspeed
                    </Title>
                  </ChatbotHeaderTitle>
                </ChatbotHeaderMain>
                <ChatbotHeaderActions className="lightspeed-header-actions">
                  <Tooltip content="Clear chat history">
                    <Button
                      variant="plain"
                      aria-label="Clear chat history"
                      icon={<TrashIcon />}
                      onClick={handleClearChat}
                    />
                  </Tooltip>
                  <Tooltip content="Minimize">
                    <Button
                      variant="plain"
                      aria-label="Minimize assistant"
                      icon={<MinusIcon />}
                      onClick={() => setIsDrawerOpen(false)}
                    />
                  </Tooltip>
                  <Tooltip content="Open in console (prototype)">
                    <Button
                      variant="plain"
                      aria-label="Expand or pop out assistant"
                      icon={<ExternalLinkAltIcon />}
                      onClick={() => {
                        /* Prototype: no external console route */
                      }}
                    />
                  </Tooltip>
                </ChatbotHeaderActions>
              </ChatbotHeader>
              <ChatbotContent style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                <MessageBox announcement={announcement} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
                  {messages.length === 0 && (
                    <>
                      <div className="lightspeed-empty-intro">
                        <div className="lightspeed-empty-mark" aria-hidden>
                          <LightspeedHeaderMark />
                        </div>
                        <Content>
                          <p>
                            Ask questions in natural language about OpenShift and Kubernetes for this console scope.
                            Context from <strong>Autonomous analysis</strong> is available here:
                            {simulation.isIncidentActive
                              ? ` active incident view — ${situationLine}`
                              : ` ${situationLine}`}{' '}
                            Use follow-up questions in this chat to refine answers; specific wording (namespace, workload,
                            console page) improves results, as described in the OpenShift Lightspeed documentation.
                          </p>
                        </Content>
                        <Alert
                          variant="info"
                          isInline
                          title="Important"
                          className="lightspeed-important-alert"
                        >
                          This tool uses AI-generated responses. Avoid pasting secrets, credentials, or regulated data.
                          Always review output before acting on it.
                        </Alert>
                      </div>
                      <ChatbotWelcomePrompt
                        className="lightspeed-welcome-prompt--prompts-only"
                        title=""
                        description=""
                        prompts={welcomePrompts}
                      />
                    </>
                  )}
                  {messages.map((message, index) => {
                    const msg = message as MessageWithCustomPills;
                    const messageProps = msg.customPillsConfig
                      ? {
                          ...msg,
                          quickResponses: undefined,
                          quickResponseContainerProps: undefined,
                          extraContent: {
                            ...msg.extraContent,
                            afterMainContent: (
                              <>
                                {msg.extraContent?.afterMainContent}
                                <CustomQuickResponsePills
                                  containerId={msg.customPillsConfig.containerId}
                                  pills={msg.customPillsConfig.pills}
                                  selectedQuickResponses={selectedQuickResponses}
                                />
                              </>
                            )
                          }
                        }
                      : message;
                    if (index === messages.length - 1) {
                      return (
                        <React.Fragment key={message.id}>
                          <div ref={messagesEndRef}></div>
                          <Message {...messageProps} />
                        </React.Fragment>
                      );
                    }
                    return <Message key={message.id} {...messageProps} />;
                  })}
                </MessageBox>
              </ChatbotContent>
              <ChatbotFooter style={{ flexShrink: 0, display: 'flex', visibility: 'visible' }}>
                <MessageBar
                  displayMode={ChatbotDisplayMode.drawer}
                  onSendMessage={handleSendMessage}
                  hasAttachButton
                  alwayShowSendButton
                  placeholder="Send a message…"
                  isSendButtonDisabled={isSendButtonDisabled}
                />
                <ChatbotFootnote
                  className="lightspeed-footnote"
                  label="Always review AI-generated content prior to use."
                />
              </ChatbotFooter>
            </Chatbot>
            </div>
          </div>
        </div>
        )}
        <div ref={olsLauncherStackRef} className="ols-ai-chrome-launcher-stack">
          {isDrawerOpen && (
            <div
              aria-hidden
              className="ols-ai-chrome-launcher-gap"
              style={{
                flexShrink: 0,
                height: OLS_CHAT_GAP_ABOVE_LAUNCHER_PX,
                minHeight: OLS_CHAT_GAP_ABOVE_LAUNCHER_PX,
                width: '100%',
                pointerEvents: 'none',
              }}
            />
          )}
          <div
            id="ols-floating-launcher-host"
            className="chatbot-toggle-sticky-host"
            style={{ pointerEvents: 'none' }}
          >
          <div
            ref={chatbotToggleRef}
            className={isDrawerOpen ? 'chatbot-toggle-button drawer-open' : 'chatbot-toggle-button'}
            style={{ pointerEvents: 'auto' }}
          >
            <ChatbotToggle
              className="ols-launcher-floating-toggle"
              style={OLS_LAUNCHER_TOGGLE_BUTTON_STYLE}
              /* OLS launcher: always show the logo; PF swaps to chevron when `isChatbotVisible` is true. */
              isChatbotVisible={false}
              aria-expanded={isDrawerOpen}
              onToggleChatbot={toggleChatDrawer}
              isRound={false}
              closedToggleIcon={OlsFloatingLauncherLogo}
              toggleButtonLabel="Red Hat OpenShift Lightspeed"
              tooltipLabel="Red Hat OpenShift Lightspeed"
              tooltipProps={{
                zIndex: OLS_LAUNCHER_TOOLTIP_ZINDEX,
                position: 'top',
                enableFlip: true,
                className: 'ols-launcher-floating-tooltip',
              }}
            />
          </div>
        </div>
        </div>
      </div>,
      document.body
    )}
  </>
  );
};
