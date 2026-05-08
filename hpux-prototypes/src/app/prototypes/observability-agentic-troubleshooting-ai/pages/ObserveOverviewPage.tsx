import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Stack,
  StackItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
} from '@patternfly/react-core';

/**
 * Observe → Observability overview.
 * Layout matches the OpenShift-style full-page pattern (`create-policy-breadcrumb`, `create-policy-header`).
 * Section chrome uses expandable PatternFly Cards (same composition as card HTML demos — header title + expand).
 * @see https://www.patternfly.org/components/card/html-demos
 */
type OverviewSectionKey = 'stack' | 'installed' | 'recommended';

const CARD_IDS: Record<OverviewSectionKey, string> = {
  stack: 'ols-observe-card-stack',
  installed: 'ols-observe-card-installed',
  recommended: 'ols-observe-card-recommended',
};

const createExpandedState = (initial: Partial<Record<OverviewSectionKey, boolean>> = {}) =>
  ({
    stack: initial.stack ?? false,
    installed: initial.installed ?? false,
    recommended: initial.recommended ?? false,
  }) as Record<OverviewSectionKey, boolean>;

export const ObserveOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(createExpandedState);

  const toggleSection = useCallback((key: OverviewSectionKey) => {
    return (_event: React.MouseEvent, _cardId: string) => {
      setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };
  }, []);

  return (
    <div
      className="ols-observe-overview-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div className="create-policy-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/core/home/overview');
            }}
          >
            Home
          </BreadcrumbItem>
          <BreadcrumbItem
            to="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/core/observe/overview');
            }}
          >
            Observe
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Overview</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="create-policy-header">
        <Title headingLevel="h1" size="2xl">
          Observability overview
        </Title>
        <Content component="p" style={{ marginTop: '8px', color: '#6a6e73' }}>
          Investigate AI-driven root cause analysis, monitor your installed observability components, and explore
          recommended operators to expand your metrics.
        </Content>
      </div>

      <div
        id="ols-observe-overview-main"
        role="main"
        aria-label="Observability overview content"
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            padding: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <Stack hasGutter>
            <StackItem>
              <Card id={CARD_IDS.stack} isExpanded={expanded.stack} isCompact>
                <CardHeader
                  onExpand={toggleSection('stack')}
                  toggleButtonProps={{
                    id: `${CARD_IDS.stack}-toggle`,
                    'aria-label': 'Toggle Stack summary',
                  }}
                >
                  <CardTitle component="h2">Stack summary</CardTitle>
                </CardHeader>
                <CardExpandableContent>
                  <CardBody>
                    <Content component="p" style={{ margin: 0, maxWidth: '960px', color: '#3c3f42' }}>
                      High-level view of metrics, logging, and tracing collectors, scrape targets, and health of core
                      observability namespaces—placeholder until wired to real inventory.
                    </Content>
                  </CardBody>
                </CardExpandableContent>
              </Card>
            </StackItem>
            <StackItem>
              <Card id={CARD_IDS.installed} isExpanded={expanded.installed} isCompact>
                <CardHeader
                  onExpand={toggleSection('installed')}
                  toggleButtonProps={{
                    id: `${CARD_IDS.installed}-toggle`,
                    'aria-label': 'Toggle Installed operators and add-ons',
                  }}
                >
                  <CardTitle component="h2">Installed operators and add-ons</CardTitle>
                </CardHeader>
                <CardExpandableContent>
                  <CardBody>
                    <Content component="p" style={{ margin: 0, maxWidth: '960px', color: '#3c3f42' }}>
                      Installed observability operators and add-ons (for example user workload monitoring, distributed
                      tracing platform) with version and upgrade status—stub content for the prototype.
                    </Content>
                  </CardBody>
                </CardExpandableContent>
              </Card>
            </StackItem>
            <StackItem>
              <Card id={CARD_IDS.recommended} isExpanded={expanded.recommended} isCompact>
                <CardHeader
                  onExpand={toggleSection('recommended')}
                  toggleButtonProps={{
                    id: `${CARD_IDS.recommended}-toggle`,
                    'aria-label': 'Toggle Recommended operators',
                  }}
                >
                  <CardTitle component="h2">Recommended operators</CardTitle>
                </CardHeader>
                <CardExpandableContent>
                  <CardBody>
                    <Content component="p" style={{ margin: 0, maxWidth: '960px', color: '#3c3f42' }}>
                      Curated install paths for common next steps (user-defined metrics, tracing, cost metrics, and so
                      on). Replace with catalog-backed recommendations when available.
                    </Content>
                  </CardBody>
                </CardExpandableContent>
              </Card>
            </StackItem>
          </Stack>
        </div>
      </div>
    </div>
  );
};
