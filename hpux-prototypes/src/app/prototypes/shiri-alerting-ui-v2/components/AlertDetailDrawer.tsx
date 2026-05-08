import * as React from 'react';
import {
  Content,
  Title,
  Flex,
  FlexItem,
  Button,
  Label,
  Stack,
  StackItem,
  Icon,
  Tabs,
  Tab,
  TabTitleText,
  Popover,
} from '@patternfly/react-core';
import {
  BellIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  TimesIcon,
  ClockIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';
import type { AlertData } from '../data/types';
import { AlertTimelineVisualization } from './AlertTimelineVisualization';

export interface AlertDetailDrawerProps {
  isExpanded: boolean;
  selectedAlert: AlertData | null;
  activeTab: number;
  onClose: () => void;
  onTabChange: (tabKey: number) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  isExpanded,
  selectedAlert,
  activeTab,
  onClose,
  onTabChange,
}) => {
  if (!isExpanded || !selectedAlert) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', top: '76px', left: 0, right: 0, bottom: 0, zIndex: 400 }}>
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
        }}
        onClick={onClose}
      />
      {/* Drawer Panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '550px',
          maxWidth: '90vw',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header - Sticky */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--pf-t--global--border--color--default)',
            flexShrink: 0,
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          }}
        >
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
            <FlexItem style={{ flex: 1 }}>
              <Title headingLevel="h2" size="lg">
                {selectedAlert.alertName}
              </Title>
              <Content
                component="p"
                style={{ color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}
              >
                {selectedAlert.description ||
                  `This alert indicates ${selectedAlert.alertName.toLowerCase()} condition.`}
              </Content>
              {/* Cluster and Namespace badges */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  borderRadius: '6px',
                  border: '1px solid var(--pf-t--global--border--color--default)',
                }}
              >
                <Flex gap={{ default: 'gapLg' }}>
                  <FlexItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <Label
                        isCompact
                        style={{
                          backgroundColor: 'var(--pf-t--global--color--nonstatus--blue--default)',
                          color: 'white',
                        }}
                      >
                        Cluster
                      </Label>
                      <strong style={{ fontSize: '14px' }}>
                        {selectedAlert.clusterName || 'N/A'}
                      </strong>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <Label
                        isCompact
                        style={{
                          backgroundColor: 'var(--pf-t--global--color--nonstatus--purple--default)',
                          color: 'white',
                        }}
                      >
                        Namespace
                      </Label>
                      <strong style={{ fontSize: '14px' }}>{selectedAlert.namespace}</strong>
                    </Flex>
                  </FlexItem>
                </Flex>
              </div>
            </FlexItem>
            <FlexItem>
              <Button variant="plain" aria-label="Close" onClick={onClose}>
                <TimesIcon />
              </Button>
            </FlexItem>
          </Flex>
        </div>
        {/* Drawer Body - Scrollable */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          <Tabs activeKey={activeTab} onSelect={(_, tabKey) => onTabChange(tabKey as number)}>
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
              <div style={{ padding: '16px 0' }}>
                <Stack hasGutter>
                  {/* Name */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Name
                    </Content>
                    <Content component="p">
                      <strong>{selectedAlert.alertName}</strong>
                    </Content>
                  </StackItem>

                  {/* Description */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Description
                    </Content>
                    <Content component="p">
                      {selectedAlert.description ||
                        `${selectedAlert.component} usage on a ${selectedAlert.group} component is critically high.`}
                    </Content>
                  </StackItem>

                  {/* Alert scope */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Alert scope
                    </Content>
                    <Content component="p">{selectedAlert.group}</Content>
                  </StackItem>

                  {/* Affected component */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Affected component
                    </Content>
                    <Content component="p">{selectedAlert.component}</Content>
                  </StackItem>

                  {/* State */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      State
                    </Content>
                    <Stack>
                      <StackItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <Icon status="warning">
                            <BellIcon />
                          </Icon>
                          <span>Firing</span>
                        </Flex>
                      </StackItem>
                      <StackItem style={{ marginLeft: '24px' }}>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <Icon>
                            <ClockIcon />
                          </Icon>
                          <Content component="small">
                            Since {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}{' '}
                            {new Date().toLocaleTimeString()}
                          </Content>
                        </Flex>
                      </StackItem>
                    </Stack>
                  </StackItem>

                  {/* Labels */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Labels
                    </Content>
                    <Flex gap={{ default: 'gapSm' }} style={{ marginTop: '4px' }}>
                      <Label
                        isCompact
                        style={{ backgroundColor: 'var(--pf-t--global--background--color--secondary--default)' }}
                      >
                        label-label1
                      </Label>
                      <Label
                        isCompact
                        style={{ backgroundColor: 'var(--pf-t--global--background--color--secondary--default)' }}
                      >
                        label2
                      </Label>
                    </Flex>
                  </StackItem>

                  {/* Severity */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Severity
                    </Content>
                    <div style={{ marginTop: '4px' }}>
                      <Label
                        color={
                          selectedAlert.severity === 'Critical'
                            ? 'red'
                            : selectedAlert.severity === 'Warning'
                              ? 'orange'
                              : 'blue'
                        }
                        icon={
                          selectedAlert.severity === 'Critical' ? (
                            <ExclamationCircleIcon />
                          ) : selectedAlert.severity === 'Warning' ? (
                            <ExclamationTriangleIcon />
                          ) : (
                            <InfoCircleIcon />
                          )
                        }
                      >
                        {selectedAlert.severity}
                      </Label>
                    </div>
                  </StackItem>

                  {/* Source */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Source
                    </Content>
                    <Content component="p">Platform</Content>
                  </StackItem>

                  {/* Namespace */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Namespace
                    </Content>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} style={{ marginTop: '4px' }}>
                      <Label
                        isCompact
                        style={{ backgroundColor: 'var(--pf-t--global--color--nonstatus--green--default)', color: 'white' }}
                      >
                        NS
                      </Label>
                      <span>{selectedAlert.namespace}</span>
                    </Flex>
                  </StackItem>

                  {/* Resource */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Resource
                    </Content>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} style={{ marginTop: '4px' }}>
                      <Label
                        isCompact
                        style={{ backgroundColor: 'var(--pf-t--global--color--nonstatus--orange--default)', color: 'white' }}
                      >
                        N
                      </Label>
                      <Button variant="link" isInline>
                        node-001-nb
                      </Button>
                    </Flex>
                  </StackItem>

                  {/* Alert rule */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Alert rule
                    </Content>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} style={{ marginTop: '4px' }}>
                      <Label
                        isCompact
                        style={{ backgroundColor: 'var(--pf-t--global--color--nonstatus--purple--default)', color: 'white' }}
                      >
                        AR
                      </Label>
                      <Button variant="link" isInline>
                        {selectedAlert.alertName}
                      </Button>
                    </Flex>
                  </StackItem>

                  {/* Runbook */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Runbook
                    </Content>
                    <Content component="p">
                      <Button variant="link" isInline component="a" href="https://mygitrunbook.com" target="_blank" icon={<ExternalLinkAltIcon />} iconPosition="end">
                        https://mygitrunbook.com
                      </Button>
                    </Content>
                  </StackItem>

                  {/* Dashboard */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{
                        color: 'var(--pf-t--global--text--color--subtle)',
                        fontWeight: 600,
                        borderBottom: '1px dashed var(--pf-t--global--border--color--default)',
                        display: 'inline-block',
                      }}
                    >
                      Dashboard
                    </Content>
                    <Content component="p">ocp-perses-clusterhealthdashboard</Content>
                  </StackItem>

                  {/* Follow-up steps */}
                  <StackItem>
                    <Content
                      component="small"
                      style={{ color: 'var(--pf-t--global--text--color--subtle)', fontWeight: 600 }}
                    >
                      Follow-up steps
                    </Content>
                    <Stack hasGutter style={{ marginTop: '8px' }}>
                      <StackItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <Button variant="link" isInline>
                            View logs
                          </Button>
                          <Popover
                            headerIcon={<BellIcon />}
                            headerContent="Install logging operator to view logs"
                            bodyContent="You can deploy logging by installing the Red Hat OpenShift Logging Operator. The Red Hat OpenShift Logging Operator creates and manages the components of the logging stack."
                            footerContent={
                              <Flex gap={{ default: 'gapMd' }}>
                                <Button variant="secondary">Go to operator page</Button>
                                <Button variant="link">Cancel</Button>
                              </Flex>
                            }
                          >
                            <Button variant="plain" aria-label="More info about View logs" style={{ padding: '0 4px' }}>
                              <Icon status="info">
                                <InfoCircleIcon />
                              </Icon>
                            </Button>
                          </Popover>
                        </Flex>
                      </StackItem>
                      <StackItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <Button variant="link" isInline>
                            Troubleshoot
                          </Button>
                          <Popover
                            headerContent="Install Korrel8r operator to correlate observability signals"
                            bodyContent="Korrel8r helps navigate from problem symptoms to related resources and signal data that can reveal the cause. It can follow relationships between disjointed observability 'silos' (logs, metrics, alerts and more) to bring together all the data available to solve a problem."
                            footerContent={
                              <Flex gap={{ default: 'gapMd' }}>
                                <Button variant="secondary">Go to operator page</Button>
                                <Button variant="link">Cancel</Button>
                              </Flex>
                            }
                          >
                            <Button variant="plain" aria-label="More info about Troubleshoot" style={{ padding: '0 4px' }}>
                              <Icon status="info">
                                <InfoCircleIcon />
                              </Icon>
                            </Button>
                          </Popover>
                        </Flex>
                      </StackItem>
                      <StackItem>
                        <Button variant="link" isInline>
                          See metrics
                        </Button>
                      </StackItem>
                      <StackItem>
                        <Button variant="link" isInline>
                          See related incident
                        </Button>
                      </StackItem>
                    </Stack>
                  </StackItem>
                </Stack>
              </div>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Alert timeline</TabTitleText>}>
              <div style={{ padding: '16px 0' }}>
                <AlertTimelineVisualization
                  alertName={selectedAlert.alertName}
                  severity={selectedAlert.severity}
                />
              </div>
            </Tab>
            <Tab eventKey={2} title={<TabTitleText>YAML</TabTitleText>}>
              <div style={{ padding: '16px 0' }}>
                <Content component="p" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Alert YAML definition would appear here.
                </Content>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
