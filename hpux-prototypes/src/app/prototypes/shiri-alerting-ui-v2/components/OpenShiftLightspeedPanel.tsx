import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  Button,
  Content,
  Flex,
  FlexItem,
  Label,
  TextArea,
  Title,
} from '@patternfly/react-core';
import {
  CopyIcon,
  ExpandArrowsAltIcon,
  ExternalLinkAltIcon,
  MinusIcon,
  PaperPlaneIcon,
  PlusIcon,
  TimesIcon,
  TrashIcon,
  UserIcon,
} from '@patternfly/react-icons';

export type LightspeedInvestigateContext = {
  sourceType: 'alert' | 'component';
  sourceName: string;
  aiInsightText: string;
};

const BACKDROP_Z = 6000;
const PANEL_Z = 6001;

/** Minimal “burst” mark for the panel header (decorative, not the Red Hat trademark). */
const LightspeedMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="#e00" />
    <path
      fill="#fff"
      d="M12 4.5l1.6 4.9h5.2l-4.2 3 1.6 4.9L12 14.3 7.8 17.3l1.6-4.9-4.2-3h5.2L12 4.5z"
    />
  </svg>
);

const DISCLAIMER_STYLE: React.CSSProperties = {
  border: '1px solid #6753ac',
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 'var(--pf-t--global--font--size--sm)',
  color: 'var(--pf-t--global--text--color--regular)',
  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
};

const PANEL_STYLE: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: 'min(440px, 100vw)',
  maxWidth: '100%',
  backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
  boxShadow: '-6px 0 24px rgba(3, 3, 3, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: PANEL_Z,
};

const USER_QUERY = (ctx: LightspeedInvestigateContext) =>
  `Why is “${ctx.sourceName}” affecting my fleet? Investigate blast radius and check correlation with infrastructure signals.`;

const scopeBullets = (ctx: LightspeedInvestigateContext): string[] => {
  if (ctx.sourceType === 'alert') {
    return [
      `${ctx.sourceName}: firing across multiple clusters in this fleet view.`,
      `Correlated signals: elevated control-plane and node pressure in overlapping regions (mock).`,
      `Suggested next steps: open alert details, review runbooks, and compare change windows.`,
    ];
  }
  return [
    `${ctx.sourceName}: component-level firing alerts span several clusters (mock).`,
    `Correlated signals: dependent workloads and etcd / API latency where this component appears.`,
    `Suggested next steps: drill into component health and namespace-scoped alerts.`,
  ];
};

export interface OpenShiftLightspeedPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: LightspeedInvestigateContext | null;
}

export const OpenShiftLightspeedPanel: React.FC<OpenShiftLightspeedPanelProps> = ({ isOpen, onClose, context }) => {
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    if (isOpen && context) {
      setMessage('');
    }
  }, [isOpen, context?.sourceName, context?.sourceType]);

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !context || typeof document === 'undefined') {
    return null;
  }

  const node = (
    <>
      <div
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 3, 3, 0.45)',
          zIndex: BACKDROP_Z,
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="openshift-lightspeed-panel-title"
        style={PANEL_STYLE}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
            flexShrink: 0,
          }}
        >
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                <LightspeedMark />
                <Title headingLevel="h2" size="md" id="openshift-lightspeed-panel-title">
                  Red Hat OpenShift Lightspeed
                </Title>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Flex gap={{ default: 'gapXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                <Button variant="plain" aria-label="Clear conversation" icon={<TrashIcon />} onClick={() => setMessage('')} />
                <Button variant="plain" aria-label="Copy" icon={<CopyIcon />} />
                <Button variant="plain" aria-label="Expand" icon={<ExpandArrowsAltIcon />} />
                <Button variant="plain" aria-label="Minimize panel" icon={<MinusIcon />} onClick={onClose} />
              </Flex>
            </FlexItem>
          </Flex>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={DISCLAIMER_STYLE}>
            OpenShift Lightspeed uses AI technology. Do not include personal information or sensitive cluster credentials in
            your prompts.
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <UserIcon style={{ flexShrink: 0, width: 32, height: 32, color: 'var(--pf-t--global--icon--color--subtle)' }} />
            <div style={{ minWidth: 0 }}>
              <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)', display: 'block', marginBottom: 4 }}>
                You
              </Content>
              <Content component="p" style={{ margin: 0, fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                {USER_QUERY(context)}
              </Content>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <LightspeedMark size={28} />
            <div style={{ minWidth: 0 }}>
              <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 4 }}>
                <Content component="small" style={{ margin: 0, fontWeight: 600 }}>
                  OpenShift Lightspeed
                </Content>
                <Label isCompact color="grey">
                  AI
                </Label>
              </Flex>
              <Content component="p" style={{ margin: '0 0 8px', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                <strong>Scope (what is failing)</strong>
              </Content>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                {scopeBullets(context).map((line) => (
                  <li key={line} style={{ marginBottom: 6 }}>
                    {line}
                  </li>
                ))}
              </ul>
              <Content component="p" style={{ margin: '12px 0 0', fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                From fleet insight: {context.aiInsightText}
              </Content>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px 16px',
            borderTop: '1px solid var(--pf-t--global--border--color--default)',
            flexShrink: 0,
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          }}
        >
          <div style={{ position: 'relative', border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: 8 }}>
            <TextArea
              aria-label="Message to OpenShift Lightspeed"
              placeholder="Send a message…"
              value={message}
              onChange={(_, v) => setMessage(v)}
              style={{ minHeight: 88, border: 'none', boxShadow: 'none', resize: 'vertical' }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px 8px',
                gap: 8,
              }}
            >
              <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ flexWrap: 'wrap' }}>
                <Button variant="plain" aria-label="Add context" icon={<PlusIcon />} />
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 6px 2px 10px',
                    borderRadius: 16,
                    border: '1px solid var(--pf-t--global--border--color--default)',
                    fontSize: 'var(--pf-t--global--font--size--sm)',
                    backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  }}
                >
                  Troubleshooting
                  <Button variant="plain" aria-label="Remove Troubleshooting context" icon={<TimesIcon />} style={{ padding: 2 }} />
                </span>
              </Flex>
              <Button variant="plain" aria-label="Send message" icon={<PaperPlaneIcon />} />
            </div>
          </div>
          <Content component="small" style={{ display: 'block', marginTop: 10, color: 'var(--pf-t--global--text--color--subtle)' }}>
            Always review AI generated content prior to use.
          </Content>
          <Button
            variant="link"
            isInline
            component="a"
            href="mailto:openshift-lightspeed@redhat.com"
            icon={<ExternalLinkAltIcon />}
            iconPosition="end"
            style={{ marginTop: 8, paddingLeft: 0 }}
          >
            For questions or feedback about OpenShift Lightspeed, email the Red Hat team
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(node, document.body);
};
