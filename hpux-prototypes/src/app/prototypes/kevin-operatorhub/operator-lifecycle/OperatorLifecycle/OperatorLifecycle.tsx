import React, { useState, useMemo } from 'react';
import {
  Page,
  PageSection,
  Title,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  CardFooter,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Button,
  Flex,
  FlexItem,
  Divider,
  Alert,
  Badge,
  Label,
  LabelGroup,
  Modal,
  ModalVariant,
  Tabs,
  Tab,
  TabTitleText,
  Gallery,
  GalleryItem,
  List,
  ListItem,
  Progress,
  ProgressSize,
  Checkbox,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  ExternalLinkAltIcon,
  CogIcon,
  ClockIcon,
  BanIcon,
  PlayIcon,
  PauseIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';

interface InstallPlan {
  id: string;
  name: string;
  namespace: string;
  operatorName: string;
  currentVersion: string;
  targetVersion: string;
  status: 'Pending' | 'Approved' | 'Installing' | 'Complete' | 'Failed';
  riskLevel: 'Low' | 'Medium' | 'High';
  crdChanges: {
    additions: number;
    removals: number;
    modifications: number;
  };
  rbacChanges: {
    clusterRoles: number;
    webhooks: boolean;
  };
  releaseNotes?: string;
  blockingIssues: string[];
  ocpCompatibility: {
    min: string;
    max: string;
    current: string;
    compatible: boolean;
  };
}

const mockInstallPlans: InstallPlan[] = [
  {
    id: 'install-plan-1',
    name: 'install-prometheus-operator-v0.65.1',
    namespace: 'openshift-monitoring',
    operatorName: 'Prometheus Operator',
    currentVersion: '0.64.1',
    targetVersion: '0.65.1',
    status: 'Pending',
    riskLevel: 'Low',
    crdChanges: { additions: 0, removals: 0, modifications: 2 },
    rbacChanges: { clusterRoles: 0, webhooks: false },
    releaseNotes: 'https://github.com/prometheus-operator/prometheus-operator/releases/tag/v0.65.1',
    blockingIssues: [],
    ocpCompatibility: { min: '4.10', max: '4.16', current: '4.15', compatible: true },
  },
  {
    id: 'install-plan-2', 
    name: 'install-elasticsearch-operator-v5.8.0',
    namespace: 'openshift-logging',
    operatorName: 'Elasticsearch Operator',
    currentVersion: '5.7.2',
    targetVersion: '5.8.0',
    status: 'Pending',
    riskLevel: 'High',
    crdChanges: { additions: 1, removals: 2, modifications: 3 },
    rbacChanges: { clusterRoles: 3, webhooks: true },
    releaseNotes: 'https://docs.openshift.com/container-platform/latest/logging/cluster-logging-elasticsearch.html',
    blockingIssues: ['CRD removal detected', 'New cluster-wide RBAC required'],
    ocpCompatibility: { min: '4.12', max: '4.15', current: '4.15', compatible: true },
  },
  {
    id: 'install-plan-3',
    name: 'install-jaeger-operator-v1.51.0',
    namespace: 'openshift-distributed-tracing',
    operatorName: 'Red Hat OpenShift distributed tracing platform',
    currentVersion: '1.49.0',
    targetVersion: '1.51.0',
    status: 'Pending',
    riskLevel: 'Medium',
    crdChanges: { additions: 2, removals: 0, modifications: 1 },
    rbacChanges: { clusterRoles: 1, webhooks: false },
    releaseNotes: 'https://access.redhat.com/documentation/en-us/openshift_container_platform/latest/html/distributed_tracing',
    blockingIssues: [],
    ocpCompatibility: { min: '4.11', max: '4.17', current: '4.15', compatible: true },
  },
  {
    id: 'install-plan-4',
    name: 'install-aws-load-balancer-operator-v1.1.0',
    namespace: 'aws-load-balancer-operator',
    operatorName: 'AWS Load Balancer Operator',
    currentVersion: '1.0.1',
    targetVersion: '1.1.0',
    status: 'Pending',
    riskLevel: 'High',
    crdChanges: { additions: 0, removals: 1, modifications: 0 },
    rbacChanges: { clusterRoles: 2, webhooks: true },
    releaseNotes: 'https://docs.openshift.com/container-platform/latest/networking/aws_load_balancer_operator/',
    blockingIssues: ['Operator max version 4.15, cluster upgrading to 4.16'],
    ocpCompatibility: { min: '4.11', max: '4.15', current: '4.15', compatible: false },
  },
];

const OperatorLifecycle: React.FunctionComponent = () => {
  useDocumentTitle('Operator Lifecycle Management');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | ''>('');
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

  const filteredPlans = useMemo(() => {
    return mockInstallPlans.filter(plan =>
      plan.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectPlan = (planId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedPlans);
    if (isSelected) {
      newSelected.add(planId);
    } else {
      newSelected.delete(planId);
    }
    setSelectedPlans(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedPlans(new Set(filteredPlans.map(plan => plan.id)));
    } else {
      setSelectedPlans(new Set());
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return <Badge color="green">Low Risk</Badge>;
      case 'Medium':
        return <Badge color="orange">Medium Risk</Badge>;
      case 'High':
        return <Badge color="red">High Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <ClockIcon color="orange" />;
      case 'Approved':
        return <PlayIcon color="blue" />;
      case 'Complete':
        return <CheckCircleIcon color="green" />;
      case 'Failed':
        return <BanIcon color="red" />;
      default:
        return <InfoCircleIcon />;
    }
  };

  const getCompatibilityIndicator = (plan: InstallPlan) => {
    if (!plan.ocpCompatibility.compatible) {
      return (
        <Alert
          variant="warning"
          title="Compatibility Issue"
          isInline
          isPlain
        >
          <div style={{ fontSize: '14px' }}>
            Operator max version {plan.ocpCompatibility.max} blocks cluster upgrade beyond OCP {plan.ocpCompatibility.max}
          </div>
        </Alert>
      );
    }
    return null;
  };

  const renderSafetySummary = (plan: InstallPlan) => (
    <div style={{ fontSize: '14px' }}>
      <div style={{ marginBottom: '8px' }}>
        <strong>Impact Summary:</strong>
      </div>
      <List isPlain>
        <ListItem>
          <strong>CRD Changes:</strong> {plan.crdChanges.additions} additions, {plan.crdChanges.removals} removals, {plan.crdChanges.modifications} modifications
        </ListItem>
        <ListItem>
          <strong>RBAC Changes:</strong> {plan.rbacChanges.clusterRoles} new cluster roles
          {plan.rbacChanges.webhooks && ', webhook additions'}
        </ListItem>
        <ListItem>
          <strong>OCP Compatibility:</strong> {plan.ocpCompatibility.min} - {plan.ocpCompatibility.max}
        </ListItem>
      </List>
      
      {plan.blockingIssues.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <strong>⚠️ Blocking Issues:</strong>
          <List isPlain style={{ marginLeft: '16px' }}>
            {plan.blockingIssues.map((issue, index) => (
              <ListItem key={index} style={{ color: 'var(--pf-v6-global--danger-color--100)' }}>
                {issue}
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );

  const handleBulkAction = (action: 'approve' | 'reject') => {
    setBulkAction(action);
    setIsBulkModalOpen(true);
  };

  const confirmBulkAction = () => {
    console.log(`${bulkAction}ing ${selectedPlans.size} install plans:`, Array.from(selectedPlans));
    setIsBulkModalOpen(false);
    setSelectedPlans(new Set());
    setBulkAction('');
  };

  const isAllSelected = selectedPlans.size === filteredPlans.length && filteredPlans.length > 0;
  const isPartiallySelected = selectedPlans.size > 0 && selectedPlans.size < filteredPlans.length;

  const handleTabClick = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Page>
      <PageSection style={{ padding: '32px', backgroundColor: 'var(--pf-v6-global--BackgroundColor--100)' }}>
        <div style={{ marginBottom: '32px' }}>
          <Title headingLevel="h1" size="2xl">
            Software Lifecycle Management
          </Title>
          <p style={{ marginTop: '8px', fontSize: '16px', color: 'var(--pf-v6-global--Color--200)' }}>
            Track install plans, approvals, and running updates across OLM v0 subscriptions and OLMv1 extensions.
          </p>
        </div>

        <Alert
          variant="info"
          title="Crawl Phase - Enhanced InstallPlan Management"
          style={{ marginBottom: '32px' }}
        >
          <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
            This interface provides improved visibility and bulk operations for InstallPlan approval, 
            safety summaries, and compatibility checking - reducing manual CLI operations by 70%.
          </div>
        </Alert>

        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>InstallPlan Management</TabTitleText>}>
            <div style={{ padding: '24px 0' }}>
              <Card>
                <CardHeader>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <SearchInput
                          placeholder="Search install plans..."
                          value={searchTerm}
                          onChange={(_event, value) => setSearchTerm(value)}
                          onClear={() => setSearchTerm('')}
                        />
                      </ToolbarItem>
                      <ToolbarItem>
                        <Button
                          variant="primary"
                          isDisabled={selectedPlans.size === 0}
                          onClick={() => handleBulkAction('approve')}
                        >
                          Approve Selected ({selectedPlans.size})
                        </Button>
                      </ToolbarItem>
                      <ToolbarItem>
                        <Button
                          variant="secondary"
                          isDisabled={selectedPlans.size === 0}
                          onClick={() => handleBulkAction('reject')}
                        >
                          Reject Selected
                        </Button>
                      </ToolbarItem>
                      <ToolbarItem>
                        <Button
                          variant="link"
                          isDisabled={selectedPlans.size === 0}
                          onClick={() => setIsPreviewModalOpen(true)}
                        >
                          Preview All Changes
                        </Button>
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                </CardHeader>

                <CardBody style={{ padding: '0' }}>
                  <Table variant="compact">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            id="select-all-plans"
                            isChecked={isAllSelected ? true : isPartiallySelected ? null : false}
                            onChange={(_event, checked) => handleSelectAll(checked)}
                            aria-label="Select all install plans"
                          />
                        </Th>
                        <Th>Operator</Th>
                        <Th>Version Upgrade</Th>
                        <Th>Status</Th>
                        <Th>Risk Assessment</Th>
                        <Th>Compatibility</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPlans.map((plan) => (
                        <Tr key={plan.id}>
                          <Td>
                            <Checkbox
                              id={`select-${plan.id}`}
                              isChecked={selectedPlans.has(plan.id)}
                              onChange={(_event, checked) => handleSelectPlan(plan.id, checked)}
                              aria-label={`Select ${plan.operatorName}`}
                            />
                          </Td>
                          <Td>
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{plan.operatorName}</div>
                              <div style={{ fontSize: '12px', color: 'var(--pf-v6-global--Color--200)' }}>
                                {plan.namespace}
                              </div>
                            </div>
                          </Td>
                          <Td>
                            <div>
                              <div>{plan.currentVersion} → {plan.targetVersion}</div>
                              {plan.releaseNotes && (
                                <Button
                                  variant="link"
                                  isInline
                                  icon={<ExternalLinkAltIcon />}
                                  component="a"
                                  href={plan.releaseNotes}
                                  target="_blank"
                                  style={{ fontSize: '12px', padding: '0' }}
                                >
                                  Release Notes
                                </Button>
                              )}
                            </div>
                          </Td>
                          <Td>
                            <Flex alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem>{getStatusIcon(plan.status)}</FlexItem>
                              <FlexItem>{plan.status}</FlexItem>
                            </Flex>
                          </Td>
                          <Td>
                            <div>
                              {getRiskBadge(plan.riskLevel)}
                              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                                CRD: {plan.crdChanges.additions}+ {plan.crdChanges.removals}- {plan.crdChanges.modifications}~
                                {plan.rbacChanges.clusterRoles > 0 && `, RBAC: ${plan.rbacChanges.clusterRoles}`}
                              </div>
                            </div>
                          </Td>
                          <Td>
                            {plan.ocpCompatibility.compatible ? (
                              <Badge color="green">Compatible</Badge>
                            ) : (
                              <Badge color="red">Blocks OCP {plan.ocpCompatibility.max}+</Badge>
                            )}
                          </Td>
                          <Td>
                            <Button variant="link" size="sm">
                              Review Details
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Individual plan details */}
              <div style={{ marginTop: '32px' }}>
                <Gallery hasGutter minWidths={{ default: '400px' }}>
                  {filteredPlans.slice(0, 2).map((plan) => (
                    <GalleryItem key={plan.id}>
                      <Card isCompact>
                        <CardHeader>
                          <CardTitle>
                            <Flex alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem>{getStatusIcon(plan.status)}</FlexItem>
                              <FlexItem flex={{ default: 'flex_1' }}>
                                {plan.operatorName}
                              </FlexItem>
                              <FlexItem>{getRiskBadge(plan.riskLevel)}</FlexItem>
                            </Flex>
                          </CardTitle>
                        </CardHeader>
                        <CardBody>
                          {renderSafetySummary(plan)}
                          {getCompatibilityIndicator(plan)}
                        </CardBody>
                        <CardFooter>
                          <Flex>
                            <FlexItem>
                              <Button variant="primary" size="sm">
                                Approve
                              </Button>
                            </FlexItem>
                            <FlexItem>
                              <Button variant="secondary" size="sm">
                                Reject
                              </Button>
                            </FlexItem>
                          </Flex>
                        </CardFooter>
                      </Card>
                    </GalleryItem>
                  ))}
                </Gallery>
              </div>
            </div>
          </Tab>

          <Tab eventKey={1} title={<TabTitleText>Cluster Compatibility</TabTitleText>}>
            <div style={{ padding: '24px 0' }}>
              <Alert
                variant="warning"
                title="Upgrade Blocking Operators Detected"
                style={{ marginBottom: '32px' }}
              >
                <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                  2 operators have version ceilings that will block cluster upgrade to OCP 4.16+. 
                  Review and update these operators before proceeding with cluster maintenance.
                </div>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>
                    OpenShift Version Compatibility Matrix
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ marginBottom: '24px' }}>
                    <Progress
                      value={75}
                      title="Cluster Upgrade Readiness"
                      size={ProgressSize.lg}
                      label="3 of 4 operators compatible with OCP 4.16+"
                    />
                  </div>

                  <Table variant="compact">
                    <Thead>
                      <Tr>
                        <Th>Operator</Th>
                        <Th>Current Version</Th>
                        <Th>Min OCP</Th>
                        <Th>Max OCP</Th>
                        <Th>Status</Th>
                        <Th>Action Required</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockInstallPlans.map((plan) => (
                        <Tr key={plan.id}>
                          <Td>{plan.operatorName}</Td>
                          <Td>{plan.currentVersion}</Td>
                          <Td>{plan.ocpCompatibility.min}</Td>
                          <Td>{plan.ocpCompatibility.max}</Td>
                          <Td>
                            {plan.ocpCompatibility.compatible ? (
                              <Label color="green">Compatible</Label>
                            ) : (
                              <Label color="red">Blocks Upgrade</Label>
                            )}
                          </Td>
                          <Td>
                            {!plan.ocpCompatibility.compatible ? (
                              <Button variant="link" size="sm">
                                Upgrade to compatible version
                              </Button>
                            ) : (
                              <span style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                                No action needed
                              </span>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab eventKey={2} title={<TabTitleText>Version Pinning</TabTitleText>}>
            <div style={{ padding: '24px 0' }}>
              <Alert
                variant="info"
                title="Pin Specific Versions for Disconnected Environments"
                style={{ marginBottom: '32px' }}
              >
                <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                  Select specific operator versions to pin for mirroring in disconnected environments. 
                  Platform-aligned versions are recommended for stability.
                </div>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Operator Version Pinning</CardTitle>
                  <Button variant="primary">
                    Pin Recommended Versions for OCP 4.15
                  </Button>
                </CardHeader>
                <CardBody>
                  <Table variant="compact">
                    <Thead>
                      <Tr>
                        <Th>Operator</Th>
                        <Th>Available Channels</Th>
                        <Th>Recommended Version</Th>
                        <Th>Platform Aligned</Th>
                        <Th>Pin Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockInstallPlans.map((plan, index) => (
                        <Tr key={plan.id}>
                          <Td>{plan.operatorName}</Td>
                          <Td>
                            <LabelGroup>
                              <Label color="blue">stable-4.15</Label>
                              <Label>fast-4.15</Label>
                              <Label>candidate</Label>
                            </LabelGroup>
                          </Td>
                          <Td>
                            <Badge color="green">{plan.targetVersion}</Badge>
                          </Td>
                          <Td>
                            {index % 2 === 0 ? (
                              <CheckCircleIcon color="green" />
                            ) : (
                              <InfoCircleIcon color="orange" />
                            )}
                          </Td>
                          <Td>
                            <Button variant="link" size="sm">
                              Pin Version
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </PageSection>

      {/* Bulk Action Confirmation Modal */}
      <Modal
        variant={ModalVariant.medium}
        title={`${bulkAction === 'approve' ? 'Approve' : 'Reject'} Selected InstallPlans`}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      >
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', marginBottom: '16px' }}>
            You are about to {bulkAction} <strong>{selectedPlans.size}</strong> InstallPlan(s). 
            This action will {bulkAction === 'approve' ? 'begin operator upgrades' : 'cancel pending upgrades'}.
          </p>
          
          <Alert
            variant={bulkAction === 'approve' ? 'warning' : 'info'}
            title={bulkAction === 'approve' ? 'Review Risk Assessment' : 'Confirmation Required'}
            isInline
          >
            {bulkAction === 'approve' ? (
              <div>
                Some selected plans contain <strong>High Risk</strong> changes including CRD removals 
                and cluster-wide RBAC modifications. Ensure you have reviewed the safety summaries.
              </div>
            ) : (
              <div>
                Rejecting these InstallPlans will prevent the operator upgrades from proceeding.
              </div>
            )}
          </Alert>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setIsBulkModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant={bulkAction === 'approve' ? 'primary' : 'danger'}
            onClick={confirmBulkAction}
          >
            {bulkAction === 'approve' ? 'Approve All' : 'Reject All'}
          </Button>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        variant={ModalVariant.large}
        title="Preview All Selected Changes"
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      >
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', marginBottom: '16px' }}>
            Detailed impact analysis for {selectedPlans.size} selected InstallPlan(s):
          </p>
          
          {Array.from(selectedPlans).map(planId => {
            const plan = mockInstallPlans.find(p => p.id === planId);
            if (!plan) return null;
            
            return (
              <Card key={planId} style={{ marginBottom: '16px' }}>
                <CardHeader>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>{plan.operatorName}</FlexItem>
                      <FlexItem>{getRiskBadge(plan.riskLevel)}</FlexItem>
                    </Flex>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  {renderSafetySummary(plan)}
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setIsPreviewModalOpen(false)}>
            Close Preview
          </Button>
          <Button variant="primary" onClick={() => {
            setIsPreviewModalOpen(false);
            handleBulkAction('approve');
          }}>
            Proceed with Approval
          </Button>
        </div>
      </Modal>
    </Page>
  );
};

export { OperatorLifecycle };

