/**
 * Create alert rule — full-page wizard (prototype)
 *
 * Steps: Alert rule definition → Metadata and notifications → Target clusters → Review and create
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  Flex,
  FlexItem,
  Button,
  Label,
  Badge,
  Stack,
  StackItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Switch,
  Checkbox,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Wizard,
  WizardStep,
  TextArea,
  Radio,
  FormGroup,
  Form,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Alert as PfAlert,
  Divider,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@patternfly/react-core';
import { PromqlExpressionField } from '../components/PromqlExpressionField';
import './createAlertRulePage.css';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  QuestionCircleIcon,
  ExternalLinkAltIcon,
  TimesIcon,
} from '@patternfly/react-icons';

// Types
type AlertSeverity = 'Critical' | 'Warning' | 'Info';
type AlertComponent = 'kube-apiserver' | 'Storage' | 'Network' | 'etcd' | 'Scheduler' | 'Controller' | 'Workload' | 'Pod' | 'Quota';

interface ClusterData {
  name: string;
  namespace: string;
  infrastructure: string;
  status: 'Ready' | 'Not ready';
  region: string;
  version: string;
  labels: Record<string, string>;
  environment: string;
}

const FLEET_CLUSTER_COUNT = 110;

/** Red Hat style: required marker visible only to sighted users */
const RequiredMark: React.FC = () => (
  <span style={{ color: '#c9190b' }} aria-hidden="true">
    {' '}
    *
  </span>
);

function buildFleetMockClusters(): ClusterData[] {
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-south-1'];
  const base: ClusterData[] = [
    { name: 'prod-web-us-east-1', namespace: 'aks-central', infrastructure: 'Microsoft Azure', status: 'Ready', region: 'us-east-1', version: 'v1.31.6', labels: { team: 'platform', tier: 'production', env: 'prod' }, environment: 'Production' },
    { name: 'prod-web-us-west-2', namespace: 'aks-central', infrastructure: 'AWS', status: 'Not ready', region: 'us-west-2', version: 'ARO 4.17.12', labels: { team: 'platform', tier: 'production', env: 'prod' }, environment: 'Staging' },
    { name: 'prod-db-us-east-1', namespace: 'Default', infrastructure: 'VMware vSphere', status: 'Ready', region: 'us-west-2', version: 'v1.31.6-eks-bc8f', labels: { team: 'database', tier: 'production', env: 'prod' }, environment: 'Production' },
    { name: 'OCP-Stage-AppB', namespace: 'boston', infrastructure: 'AWS', status: 'Ready', region: 'eu-west-1', version: 'OpenShift 4.17.8', labels: { app: 'staging', team: 'appb', env: 'dev' }, environment: 'Development' },
    { name: 'legacy-monolith-03', namespace: 'boston', infrastructure: 'VMware vSphere', status: 'Not ready', region: 'us-east-1', version: 'OpenShift 4.21.1', labels: { legacy: 'true', team: 'ops', env: 'prod' }, environment: 'Production' },
    { name: 'OCP-Stage-AppC', namespace: 'k3s-east', infrastructure: 'Other', status: 'Ready', region: 'eu-west-1', version: 'OpenShift 4.19.8', labels: { app: 'staging', team: 'appc', env: 'dev' }, environment: 'Staging' },
    { name: 'OCP-Stage-AppD', namespace: 'k3s-west', infrastructure: 'AWS', status: 'Ready', region: 'eu-central-1', version: 'OpenShift 4.21.1', labels: { app: 'staging', team: 'appd', env: 'prod' }, environment: 'Production' },
    { name: 'dev-k8s-sandbox-01', namespace: 'k3s-east', infrastructure: 'Other', status: 'Ready', region: 'us-east-2', version: 'OpenShift 4.21.1', labels: { sandbox: 'true', team: 'dev', env: 'dev' }, environment: 'Development' },
    { name: 'prod-api-eu-central', namespace: 'eks-europe', infrastructure: 'AWS', status: 'Ready', region: 'eu-central-1', version: 'OpenShift 4.18.5', labels: { api: 'true', tier: 'production', env: 'prod' }, environment: 'Production' },
    { name: 'stage-ml-us-west', namespace: 'gke-ml', infrastructure: 'Google Cloud', status: 'Not ready', region: 'us-west-1', version: 'OpenShift 4.20.3', labels: { ml: 'true', team: 'data', env: 'staging' }, environment: 'Staging' },
  ];
  for (let i = base.length; i < FLEET_CLUSTER_COUNT; i++) {
    const ready = i % 11 !== 0;
    base.push({
      name: `fleet-ocp-${String(i + 1).padStart(3, '0')}`,
      namespace: 'multicluster-engine',
      infrastructure: i % 3 === 0 ? 'AWS' : i % 3 === 1 ? 'Bare metal' : 'Google Cloud',
      status: ready ? 'Ready' : 'Not ready',
      region: regions[i % regions.length],
      version: `OpenShift 4.${18 + (i % 4)}.${(i % 8) + 1}`,
      labels: { env: i % 4 === 0 ? 'prod' : 'dev', team: `team-${(i % 9) + 1}`, shard: String((i % 3) + 1) },
      environment: i % 3 === 0 ? 'Production' : i % 3 === 1 ? 'Staging' : 'Development',
    });
  }
  return base;
}

const mockClusters: ClusterData[] = buildFleetMockClusters();

type ClusterFilterAttribute = 'name' | 'label' | 'version';

interface ClusterTableFilter {
  id: string;
  attribute: ClusterFilterAttribute;
  value: string;
}

function clusterFilterAttributeLabel(attr: ClusterFilterAttribute): string {
  switch (attr) {
    case 'name':
      return 'Name';
    case 'label':
      return 'Label';
    case 'version':
      return 'Version';
  }
}

function clusterFilterValuePlaceholder(attr: ClusterFilterAttribute): string {
  switch (attr) {
    case 'name':
      return 'Filter by name...';
    case 'label':
      return 'Enter label...';
    case 'version':
      return 'Type to narrow versions...';
  }
}

function formatClusterLabelsTooltip(labels: Record<string, string>): string {
  return Object.entries(labels)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
}

function clusterMatchesTableFilter(cluster: ClusterData, f: ClusterTableFilter): boolean {
  const q = f.value.trim().toLowerCase();
  if (!q) return true;
  if (f.attribute === 'name') {
    return cluster.name.toLowerCase().includes(q);
  }
  if (f.attribute === 'label') {
    return Object.entries(cluster.labels).some(
      ([k, val]) =>
        `${k}=${val}`.toLowerCase().includes(q) || k.toLowerCase().includes(q) || val.toLowerCase().includes(q),
    );
  }
  if (f.attribute === 'version') {
    return cluster.version.toLowerCase().includes(q);
  }
  return true;
}

function clusterTableChipText(f: ClusterTableFilter): string {
  return `${clusterFilterAttributeLabel(f.attribute)}: ${f.value}`;
}

// Available components for typeahead
const availableComponents: AlertComponent[] = ['kube-apiserver', 'Storage', 'Network', 'etcd', 'Scheduler', 'Controller', 'Workload', 'Pod', 'Quota'];

const CreateAlertRulePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  
  // YAML mode toggle
  const [isYamlMode, setIsYamlMode] = React.useState(false);
  
  // Step 1: Alert rules definition
  const [alertRuleName, setAlertRuleName] = React.useState('');
  const [alertRuleExpression, setAlertRuleExpression] = React.useState('');
  const [isQueryValidating, setIsQueryValidating] = React.useState(false);
  const [queryValidationResult, setQueryValidationResult] = React.useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });
  const [alertRuleFireImmediately, setAlertRuleFireImmediately] = React.useState(false);
  const [alertRuleForDuration, setAlertRuleForDuration] = React.useState(5);
  const [alertRuleForUnit, setAlertRuleForUnit] = React.useState<'Seconds' | 'Minutes' | 'Hours'>('Minutes');
  const [isAlertRuleForUnitOpen, setIsAlertRuleForUnitOpen] = React.useState(false);
  const [alertRuleSeverity, setAlertRuleSeverity] = React.useState<'Critical' | 'Warning' | 'Info'>('Critical');
  const [isAlertRuleSeverityOpen, setIsAlertRuleSeverityOpen] = React.useState(false);
  const [alertRuleGroup, setAlertRuleGroup] = React.useState<'Cluster' | 'Namespace'>('Cluster');
  const [isAlertRuleGroupOpen, setIsAlertRuleGroupOpen] = React.useState(false);
  const [alertRuleComponent, setAlertRuleComponent] = React.useState<string>('');
  const [isAlertRuleComponentOpen, setIsAlertRuleComponentOpen] = React.useState(false);
  const [componentInputValue, setComponentInputValue] = React.useState('');
  const [customComponents, setCustomComponents] = React.useState<string[]>([]);
  const [alertRuleAppendTo, setAlertRuleAppendTo] = React.useState('');
  const [isAlertRuleAppendToOpen, setIsAlertRuleAppendToOpen] = React.useState(false);
  const [alertRuleSource, setAlertRuleSource] = React.useState<'Platform' | 'User'>('User');
  const [isAlertRuleSourceOpen, setIsAlertRuleSourceOpen] = React.useState(false);
  
  // Step 2: Metadata and notifications
  const [alertRuleSummary, setAlertRuleSummary] = React.useState('');
  const [alertRuleDescription, setAlertRuleDescription] = React.useState('');
  const [alertRuleLabels, setAlertRuleLabels] = React.useState<string[]>([]);
  const [alertRuleLabelsInput, setAlertRuleLabelsInput] = React.useState('');
  const [alertRuleAddRunbook, setAlertRuleAddRunbook] = React.useState(false);
  const [alertRuleRunbookUrl, setAlertRuleRunbookUrl] = React.useState('');
  const [alertRuleRouteByLabel, setAlertRuleRouteByLabel] = React.useState(false);
  const [alertRuleRoutingLabels, setAlertRuleRoutingLabels] = React.useState<string[]>([]);
  const [alertRuleRoutingLabelsInput, setAlertRuleRoutingLabelsInput] = React.useState('');
  const [alertRuleReceiveByEmail, setAlertRuleReceiveByEmail] = React.useState(false);
  const [alertRuleReceiveBySlack, setAlertRuleReceiveBySlack] = React.useState(false);
  const [alertRuleReceiveByPagerDuty, setAlertRuleReceiveByPagerDuty] = React.useState(false);
  const [alertRuleReceiveByWebhook, setAlertRuleReceiveByWebhook] = React.useState(false);
  const [alertRuleReceiveByWeChat, setAlertRuleReceiveByWeChat] = React.useState(false);
  const [alertRuleSlackReceivers, setAlertRuleSlackReceivers] = React.useState<string[]>([]);
  const [isAlertRuleSlackReceiversOpen, setIsAlertRuleSlackReceiversOpen] = React.useState(false);
  
  // Step 3: Target clusters
  const [alertRuleTargetAllClusters, setAlertRuleTargetAllClusters] = React.useState(true);
  const [alertRuleSelectedClusters, setAlertRuleSelectedClusters] = React.useState<string[]>([]);
  const [clusterTableFilters, setClusterTableFilters] = React.useState<ClusterTableFilter[]>([]);
  const [clusterFilterAttribute, setClusterFilterAttribute] = React.useState<ClusterFilterAttribute>('name');
  const [clusterFilterValueInput, setClusterFilterValueInput] = React.useState('');
  const [isClusterFilterAttributeMenuOpen, setIsClusterFilterAttributeMenuOpen] = React.useState(false);
  const [isClusterVersionMenuOpen, setIsClusterVersionMenuOpen] = React.useState(false);
  const [clusterTablePage, setClusterTablePage] = React.useState(1);
  const [clusterPerPage, setClusterPerPage] = React.useState(20);
  const [viewSelectedClustersOnly, setViewSelectedClustersOnly] = React.useState(false);
  const [isTargetListModalOpen, setIsTargetListModalOpen] = React.useState(false);

  const [environmentFilters, setEnvironmentFilters] = React.useState<string[]>([]);
  const [regionFilters, setRegionFilters] = React.useState<string[]>([]);
  
  // All available components (built-in + custom)
  const allComponents = React.useMemo(() => {
    return [...availableComponents, ...customComponents];
  }, [customComponents]);
  
  // Filter components based on input
  const filteredComponents = React.useMemo(() => {
    if (!componentInputValue) return allComponents;
    return allComponents.filter(c => c.toLowerCase().includes(componentInputValue.toLowerCase()));
  }, [componentInputValue, allComponents]);
  
  // Handle component selection with creatable
  const handleComponentSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    if (value === 'create-new') {
      // Create new component
      if (componentInputValue && !allComponents.includes(componentInputValue)) {
        setCustomComponents([...customComponents, componentInputValue]);
        setAlertRuleComponent(componentInputValue);
      }
    } else {
      setAlertRuleComponent(value as string);
    }
    setIsAlertRuleComponentOpen(false);
    setComponentInputValue('');
  };
  
  const uniqueClusterVersions = React.useMemo(() => {
    const set = new Set(mockClusters.map((c) => c.version));
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, []);

  const filteredVersionOptions = React.useMemo(() => {
    const q = clusterFilterValueInput.trim().toLowerCase();
    if (!q) return uniqueClusterVersions;
    return uniqueClusterVersions.filter((v) => v.toLowerCase().includes(q));
  }, [uniqueClusterVersions, clusterFilterValueInput]);

  const filteredClusters = React.useMemo(() => {
    return mockClusters.filter((cluster) => {
      if (viewSelectedClustersOnly && !alertRuleSelectedClusters.includes(cluster.name)) {
        return false;
      }
      for (const f of clusterTableFilters) {
        if (!clusterMatchesTableFilter(cluster, f)) return false;
      }
      if (environmentFilters.length > 0 && !environmentFilters.includes(cluster.environment)) return false;
      if (regionFilters.length > 0 && !regionFilters.includes(cluster.region)) return false;
      return true;
    });
  }, [
    clusterTableFilters,
    environmentFilters,
    regionFilters,
    viewSelectedClustersOnly,
    alertRuleSelectedClusters,
  ]);

  const addClusterTextFilter = React.useCallback(() => {
    const raw = clusterFilterValueInput.trim();
    if (!raw || clusterFilterAttribute === 'version') return;
    const id = `cf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setClusterTableFilters((prev) => [...prev, { id, attribute: clusterFilterAttribute, value: raw }]);
    setClusterFilterValueInput('');
  }, [clusterFilterValueInput, clusterFilterAttribute]);

  const addClusterVersionFilter = React.useCallback((version: string) => {
    const v = version.trim();
    if (!v) return;
    const id = `cf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setClusterTableFilters((prev) => {
      if (prev.some((f) => f.attribute === 'version' && f.value === v)) return prev;
      return [...prev, { id, attribute: 'version', value: v }];
    });
    setIsClusterVersionMenuOpen(false);
  }, []);

  const clearAllClusterFilters = React.useCallback(() => {
    setClusterTableFilters([]);
    setEnvironmentFilters([]);
    setRegionFilters([]);
    setViewSelectedClustersOnly(false);
    setClusterFilterValueInput('');
  }, []);

  React.useEffect(() => {
    setClusterTablePage(1);
  }, [clusterTableFilters, environmentFilters, regionFilters, viewSelectedClustersOnly]);

  const pagedClusters = React.useMemo(() => {
    const start = (clusterTablePage - 1) * clusterPerPage;
    return filteredClusters.slice(start, start + clusterPerPage);
  }, [filteredClusters, clusterTablePage, clusterPerPage]);

  const filteredClusterNames = React.useMemo(() => filteredClusters.map((c) => c.name), [filteredClusters]);
  const allFilteredSelected =
    filteredClusterNames.length > 0 && filteredClusterNames.every((n) => alertRuleSelectedClusters.includes(n));
  const someFilteredSelected = filteredClusterNames.some((n) => alertRuleSelectedClusters.includes(n));

  const targetClusterSummaryText = React.useMemo(() => {
    const parts: string[] = clusterTableFilters.map((f) => clusterTableChipText(f));
    if (environmentFilters.length) parts.push(`environment ∈ {${environmentFilters.join(', ')}}`);
    if (regionFilters.length) parts.push(`region ∈ {${regionFilters.join(', ')}}`);
    if (viewSelectedClustersOnly) parts.push('view: selected only');
    return parts.length ? parts.join('; ') : 'no filters';
  }, [clusterTableFilters, environmentFilters, regionFilters, viewSelectedClustersOnly]);

  const reviewTargetNames = React.useMemo(() => {
    if (alertRuleTargetAllClusters) return mockClusters.map((c) => c.name);
    return [...alertRuleSelectedClusters].sort((a, b) => a.localeCompare(b));
  }, [alertRuleTargetAllClusters, alertRuleSelectedClusters]);

  const reviewTargetCount = reviewTargetNames.length;
  const reviewFilterSummary = alertRuleTargetAllClusters
    ? 'Fleet-wide (all clusters)'
    : targetClusterSummaryText === 'no filters'
      ? 'No filters'
      : targetClusterSummaryText;
  
  // Handle navigation back - return to Management > Alert rules
  const handleClose = () => {
    navigate('/observe/alerting?tab=management&subtab=alert-rules');
  };
  
  // Handle create - return to Management > Alert rules
  const handleCreate = () => {
    // TODO: Implement actual creation logic
    navigate('/observe/alerting?tab=management&subtab=alert-rules');
  };
  
  // Get unique environments and regions
  const uniqueEnvironments = React.useMemo(() => Array.from(new Set(mockClusters.map(c => c.environment))), []);
  const uniqueRegions = React.useMemo(() => Array.from(new Set(mockClusters.map(c => c.region))), []);
  
  return (
    <div
      className="create-alert-rule-page"
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)' }}
    >
      {/* Page Header with Breadcrumb */}
      <div style={{ padding: '16px 24px', backgroundColor: 'var(--pf-t--global--background--color--primary--default)', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
        <Breadcrumb>
          <BreadcrumbItem>Observe</BreadcrumbItem>
          <BreadcrumbItem>Multi-cluster alerting</BreadcrumbItem>
          <BreadcrumbItem component="button" onClick={() => navigate(-1)}>Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Create alert rule</BreadcrumbItem>
        </Breadcrumb>
        
        <div style={{ marginTop: '16px' }}>
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">Create alert rule</Title>
            </FlexItem>
            <FlexItem>
              <Switch
                id="yaml-mode-switch"
                label="YAML"
                isChecked={isYamlMode}
                onChange={(_, checked) => setIsYamlMode(checked)}
              />
            </FlexItem>
          </Flex>
          <Content component="p" style={{ marginTop: '8px', color: 'var(--pf-t--global--text--color--subtle)' }}>
            Ensure the stability and performance of your OpenShift clusters by creating custom alert rules that notify you when critical conditions are detected in your observability data.
          </Content>
        </div>
      </div>
      
      {/* Wizard Content */}
      <div
        className="carw-wizard-shell"
        style={{ flex: 1, overflow: 'hidden', backgroundColor: 'var(--pf-t--global--background--color--primary--default)', minHeight: 0 }}
      >
        <Wizard onClose={handleClose} height="100%">
          {/* Step 1: Alert rules definition */}
          <WizardStep
            name="Alert rules details"
            id="step-alert-rules-definition"
          >
            <div style={{ padding: '24px', maxWidth: '800px' }}>
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>Alert rule definition</Title>
              
              <Form>
                {/* Alert name */}
                <FormGroup
                  label={
                    <Flex alignItems={{ default: 'alignItemsFlexStart' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>
                        Alert name
                        <RequiredMark />
                      </FlexItem>
                      <FlexItem>
                        <Tooltip content="A unique name for the alert rule. Must be in PascalCase.">
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  fieldId="alert-rule-name"
                >
                  <TextInput
                    id="alert-rule-name"
                    value={alertRuleName}
                    onChange={(_, value) => setAlertRuleName(value)}
                    placeholder="e.g., NodeCPUHigh, EtcdLeaderElectionFailed"
                    required
                    aria-required="true"
                  />
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem variant={alertRuleName.length > 50 ? 'error' : 'default'}>
                        — Must not exceed 50 characters
                      </HelperTextItem>
                      <HelperTextItem>
                        — Must be in PascalCase (No spaces with the first letter of each word capitalized)
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
                
                {/* Expression */}
                <FormGroup
                  label={
                    <Flex alignItems={{ default: 'alignItemsFlexStart' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>
                        Expression
                        <RequiredMark />
                      </FlexItem>
                      <FlexItem>
                        <Tooltip content="A PromQL expression that defines when the alert should fire.">
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  fieldId="alert-rule-expression"
                >
                  <Stack hasGutter>
                    <StackItem className="carw-promql-wrap">
                      <PromqlExpressionField
                        id="alert-rule-expression"
                        value={alertRuleExpression}
                        onChange={(value) => {
                          setAlertRuleExpression(value);
                          if (queryValidationResult.status) {
                            setQueryValidationResult({ status: null, message: '' });
                          }
                        }}
                        placeholder={'sum(etcd_server_has_leader) by (cluster) < count(etcd_server_has_leader) or on(cluster) ...'}
                        rows={4}
                        validated={
                          queryValidationResult.status === 'error'
                            ? 'error'
                            : queryValidationResult.status === 'success'
                              ? 'success'
                              : 'default'
                        }
                        aria-required="true"
                      />
                    </StackItem>
                    <StackItem>
                      <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsFlexStart' }} direction={{ default: 'column' }}>
                        <FlexItem>
                          <Button
                            variant="secondary"
                            size="sm"
                            isDisabled={!alertRuleExpression.trim() || isQueryValidating}
                            isLoading={isQueryValidating}
                            onClick={() => {
                              setIsQueryValidating(true);
                              setTimeout(() => {
                                const expr = alertRuleExpression.trim();
                                if (expr.includes('|||') || expr.match(/\(\s*\)/)) {
                                  setQueryValidationResult({
                                    status: 'error',
                                    message: 'Invalid PromQL syntax detected',
                                  });
                                } else if (!expr) {
                                  setQueryValidationResult({
                                    status: 'error',
                                    message: 'Expression cannot be empty',
                                  });
                                } else {
                                  setQueryValidationResult({
                                    status: 'success',
                                    message: 'Query syntax is valid',
                                  });
                                }
                                setIsQueryValidating(false);
                              }, 800);
                            }}
                          >
                            {isQueryValidating ? 'Validating…' : 'Run query'}
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <div aria-live="polite" aria-atomic="true">
                            {queryValidationResult.status ? (
                              <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                                {queryValidationResult.status === 'success' ? (
                                  <>
                                    <FlexItem>
                                      <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                                    </FlexItem>
                                    <FlexItem>
                                      <Content component="small" style={{ color: 'var(--pf-t--global--text--color--status--success--default)' }}>
                                        {queryValidationResult.message}
                                      </Content>
                                    </FlexItem>
                                  </>
                                ) : (
                                  <>
                                    <FlexItem>
                                      <ExclamationCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)' }} />
                                    </FlexItem>
                                    <FlexItem>
                                      <Content component="small" style={{ color: 'var(--pf-t--global--text--color--status--danger--default)' }}>
                                        {queryValidationResult.message}
                                      </Content>
                                    </FlexItem>
                                  </>
                                )}
                              </Flex>
                            ) : null}
                          </div>
                        </FlexItem>
                      </Flex>
                    </StackItem>
                  </Stack>
                </FormGroup>
                
                {/* Fire alert options */}
                <FormGroup fieldId="alert-rule-fire-options" className="carw-radio-stack">
                  <Radio
                    id="fire-immediately"
                    name="fire-option"
                    label="Fire alert immediately when expression is met"
                    description="Use for alerts that should open as soon as the query returns a non-empty result."
                    isChecked={alertRuleFireImmediately}
                    onChange={() => setAlertRuleFireImmediately(true)}
                  />
                  <Radio
                    id="fire-after-duration"
                    name="fire-option"
                    label="Fire alert only if the expression is met for the following period of time"
                    description="Waits for the condition to remain true before opening the alert."
                    isChecked={!alertRuleFireImmediately}
                    onChange={() => setAlertRuleFireImmediately(false)}
                  />
                  
                  {!alertRuleFireImmediately && (
                    <div style={{ marginTop: '16px', marginLeft: '24px' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <Content component="p">
                            <strong>For</strong>{' '}
                            <Tooltip content="The duration the expression must be true before the alert fires.">
                              <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                            </Tooltip>
                          </Content>
                        </FlexItem>
                      </Flex>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} style={{ marginTop: '8px' }}>
                        <FlexItem>
                          <Button variant="control" onClick={() => setAlertRuleForDuration(Math.max(1, alertRuleForDuration - 1))}>-</Button>
                        </FlexItem>
                        <FlexItem>
                          <TextInput
                            id="alert-rule-for-duration"
                            type="number"
                            value={alertRuleForDuration}
                            onChange={(_, value) => setAlertRuleForDuration(Number(value) || 1)}
                            style={{ width: '80px', textAlign: 'center' }}
                          />
                        </FlexItem>
                        <FlexItem>
                          <Button variant="control" onClick={() => setAlertRuleForDuration(alertRuleForDuration + 1)}>+</Button>
                        </FlexItem>
                        <FlexItem>
                          <Select
                            isOpen={isAlertRuleForUnitOpen}
                            onOpenChange={setIsAlertRuleForUnitOpen}
                            onSelect={(_, value) => { setAlertRuleForUnit(value as 'Seconds' | 'Minutes' | 'Hours'); setIsAlertRuleForUnitOpen(false); }}
                            selected={alertRuleForUnit}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleForUnitOpen(!isAlertRuleForUnitOpen)} isExpanded={isAlertRuleForUnitOpen} style={{ width: '120px' }}>
                                {alertRuleForUnit}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="Seconds">Seconds</SelectOption>
                              <SelectOption value="Minutes">Minutes</SelectOption>
                              <SelectOption value="Hours">Hours</SelectOption>
                            </SelectList>
                          </Select>
                        </FlexItem>
                      </Flex>
                    </div>
                  )}
                </FormGroup>
                
                {/* Source */}
                <FormGroup
                  label={
                    <>
                      Source
                      <RequiredMark />
                    </>
                  }
                  fieldId="alert-rule-source"
                >
                  <Select
                    isOpen={isAlertRuleSourceOpen}
                    onOpenChange={setIsAlertRuleSourceOpen}
                    onSelect={(_, value) => { 
                      setAlertRuleSource(value as 'Platform' | 'User'); 
                      setIsAlertRuleSourceOpen(false);
                      // Reset append to when source changes
                      setAlertRuleAppendTo('');
                    }}
                    selected={alertRuleSource}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleSourceOpen(!isAlertRuleSourceOpen)} isExpanded={isAlertRuleSourceOpen} style={{ width: '100%' }}>
                        {alertRuleSource}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Platform">Platform</SelectOption>
                      <SelectOption value="User">User</SelectOption>
                    </SelectList>
                  </Select>
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        Platform alerts are managed in openshift-monitoring namespace as AlertingRules. User alerts are custom PrometheusRules.
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
                
                {/* Severity */}
                <FormGroup
                  label={
                    <>
                      Severity
                      <RequiredMark />
                    </>
                  }
                  fieldId="alert-rule-severity"
                >
                  <Select
                    isOpen={isAlertRuleSeverityOpen}
                    onOpenChange={setIsAlertRuleSeverityOpen}
                    onSelect={(_, value) => { setAlertRuleSeverity(value as 'Critical' | 'Warning' | 'Info'); setIsAlertRuleSeverityOpen(false); }}
                    selected={alertRuleSeverity}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleSeverityOpen(!isAlertRuleSeverityOpen)} isExpanded={isAlertRuleSeverityOpen} style={{ width: '100%' }}>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <FlexItem>
                            {alertRuleSeverity === 'Critical' && <ExclamationCircleIcon color="var(--pf-t--global--color--status--danger--default)" />}
                            {alertRuleSeverity === 'Warning' && <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />}
                            {alertRuleSeverity === 'Info' && <InfoCircleIcon color="var(--pf-t--global--color--status--info--default)" />}
                          </FlexItem>
                          <FlexItem>{alertRuleSeverity}</FlexItem>
                        </Flex>
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Critical">
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <ExclamationCircleIcon color="var(--pf-t--global--color--status--danger--default)" />
                          <span>Critical</span>
                        </Flex>
                      </SelectOption>
                      <SelectOption value="Warning">
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--default)" />
                          <span>Warning</span>
                        </Flex>
                      </SelectOption>
                      <SelectOption value="Info">
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <InfoCircleIcon color="var(--pf-t--global--color--status--info--default)" />
                          <span>Info</span>
                        </Flex>
                      </SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>
                
                {/* Alert scope and Affected component */}
                <Flex gap={{ default: 'gapMd' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <FormGroup
                      label={
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <FlexItem>Alert scope</FlexItem>
                          <FlexItem>
                            <Tooltip content="Indicates whether the alert affects the entire cluster or a specific namespace.">
                              <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                            </Tooltip>
                          </FlexItem>
                        </Flex>
                      }
                      fieldId="alert-rule-group"
                    >
                      <Select
                        isOpen={isAlertRuleGroupOpen}
                        onOpenChange={setIsAlertRuleGroupOpen}
                        onSelect={(_, value) => { setAlertRuleGroup(value as 'Cluster' | 'Namespace'); setIsAlertRuleGroupOpen(false); }}
                        selected={alertRuleGroup}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleGroupOpen(!isAlertRuleGroupOpen)} isExpanded={isAlertRuleGroupOpen} style={{ width: '100%' }}>
                            {alertRuleGroup}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="Cluster">Cluster</SelectOption>
                          <SelectOption value="Namespace">Namespace</SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <FormGroup
                      label={
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <FlexItem>Affected component</FlexItem>
                          <FlexItem>
                            <Tooltip content="The specific services, operators, or nodes affected by this alert.">
                              <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                            </Tooltip>
                          </FlexItem>
                        </Flex>
                      }
                      fieldId="alert-rule-component"
                    >
                      {/* Typeahead with creatable */}
                      <Select
                        isOpen={isAlertRuleComponentOpen}
                        onOpenChange={setIsAlertRuleComponentOpen}
                        onSelect={handleComponentSelect}
                        selected={alertRuleComponent || undefined}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleComponentOpen(!isAlertRuleComponentOpen)} isExpanded={isAlertRuleComponentOpen} style={{ width: '100%' }} variant="typeahead">
                            <TextInputGroup isPlain>
                              <TextInputGroupMain
                                value={componentInputValue || alertRuleComponent}
                                onChange={(_, value) => {
                                  setComponentInputValue(value);
                                  if (!isAlertRuleComponentOpen) setIsAlertRuleComponentOpen(true);
                                }}
                                onClick={() => setIsAlertRuleComponentOpen(true)}
                                placeholder="Select or create a component"
                                autoComplete="off"
                              />
                              {(componentInputValue || alertRuleComponent) && (
                                <TextInputGroupUtilities>
                                  <Button
                                    variant="plain"
                                    onClick={() => {
                                      setComponentInputValue('');
                                      setAlertRuleComponent('');
                                    }}
                                    aria-label="Clear input"
                                  >
                                    <TimesIcon />
                                  </Button>
                                </TextInputGroupUtilities>
                              )}
                            </TextInputGroup>
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          {filteredComponents.map(component => (
                            <SelectOption key={component} value={component}>
                              {component}
                            </SelectOption>
                          ))}
                          {componentInputValue && !allComponents.includes(componentInputValue) && (
                            <SelectOption value="create-new" description="Create new component">
                              <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                                <span>Create "{componentInputValue}"</span>
                              </Flex>
                            </SelectOption>
                          )}
                        </SelectList>
                      </Select>
                    </FormGroup>
                  </FlexItem>
                </Flex>
                
                {/* Append to */}
                <FormGroup
                  label={
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>Append to</FlexItem>
                      <FlexItem>
                        <Tooltip content={alertRuleSource === 'Platform' 
                          ? "Select which AlertingRule Custom Resource will contain this alert definition."
                          : "Select which PrometheusRule Custom Resource will contain this alert definition."
                        }>
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  fieldId="alert-rule-append-to"
                >
                  <Select
                    isOpen={isAlertRuleAppendToOpen}
                    onOpenChange={setIsAlertRuleAppendToOpen}
                    onSelect={(_, value) => { setAlertRuleAppendTo(value as string); setIsAlertRuleAppendToOpen(false); }}
                    selected={alertRuleAppendTo || undefined}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleAppendToOpen(!isAlertRuleAppendToOpen)} isExpanded={isAlertRuleAppendToOpen} style={{ width: '100%' }}>
                        {alertRuleAppendTo || (alertRuleSource === 'Platform' ? 'Select an AlertingRule CR' : 'Select a PrometheusRule CR')}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {alertRuleSource === 'Platform' ? (
                        <>
                          <SelectOption value="AlertingRule-platform">AlertingRule-platform (namespace: openshift-monitoring)</SelectOption>
                          <SelectOption value="AlertingRule-cluster">AlertingRule-cluster (namespace: openshift-monitoring)</SelectOption>
                          <SelectOption value="AlertingRule-default">AlertingRule-default (namespace: openshift-monitoring)</SelectOption>
                        </>
                      ) : (
                        <>
                          <SelectOption value="PrometheusRule-default">PrometheusRule-default (namespace: openshift-monitoring)</SelectOption>
                          <SelectOption value="PrometheusRule-custom">PrometheusRule-custom (namespace: openshift-monitoring)</SelectOption>
                          <SelectOption value="PrometheusRule-cluster">PrometheusRule-cluster (namespace: openshift-monitoring)</SelectOption>
                        </>
                      )}
                    </SelectList>
                  </Select>
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        This selection determines which Kubernetes {alertRuleSource === 'Platform' ? 'AlertingRule' : 'PrometheusRule'} Custom Resource will contain this alert definition.
                      </HelperTextItem>
                      <HelperTextItem>The location cannot be changed later without recreating the alert.</HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
              </Form>
            </div>
          </WizardStep>
          
          {/* Step 2: Metadata and notifications */}
          <WizardStep
            name="Metadata and notifications"
            id="step-metadata-notifications"
          >
            <div style={{ padding: '24px', maxWidth: '800px' }}>
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>Metadata and notifications</Title>
              
              <Form>
                {/* Summary */}
                <FormGroup
                  label={
                    <>
                      Summary
                      <RequiredMark />
                    </>
                  }
                  fieldId="alert-rule-summary"
                >
                  <TextInput
                    id="alert-rule-summary"
                    value={alertRuleSummary}
                    onChange={(_, value) => setAlertRuleSummary(value)}
                    placeholder="Node CPU Critical - {{ $labels.instance }}"
                    required
                    aria-required="true"
                  />
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>Describe what happened. Summary can be templated.</HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
                
                {/* Description (templated) */}
                <FormGroup
                  label={
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>Description (templated)</FlexItem>
                      <FlexItem>
                        <Tooltip content="Template annotations with placeholders that can be filled with specific values when the annotation is applied.">
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  fieldId="alert-rule-description"
                >
                  <TextArea
                    id="alert-rule-description"
                    value={alertRuleDescription}
                    onChange={(_, value) => setAlertRuleDescription(value)}
                    placeholder="VM {{ $labels.name }} in namespace {{ $labels.namespace }} is using {{ $value }} % of its CPU budget on node {{ $labels.node }}."
                    rows={4}
                  />
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        Templating an annotation allows you to create a reusable structure for annotations with placeholders that can be filled with specific values when the annotation is applied. <Button variant="link" isInline>Learn how to template annotations<ExternalLinkAltIcon /></Button>
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
                
                {/* Labels */}
                <FormGroup
                  label={
                    <>
                      Labels (key=value)
                      <RequiredMark />
                    </>
                  }
                  fieldId="alert-rule-labels"
                >
                  <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    {alertRuleLabels.map((label, idx) => (
                      <FlexItem key={idx}>
                        <Label color="blue" onClose={() => setAlertRuleLabels(alertRuleLabels.filter((_, i) => i !== idx))}>
                          {label}
                        </Label>
                      </FlexItem>
                    ))}
                    <FlexItem flex={{ default: 'flex_1' }}>
                      <TextInput
                        id="alert-rule-labels-input"
                        value={alertRuleLabelsInput}
                        onChange={(_, value) => setAlertRuleLabelsInput(value)}
                        placeholder="Add label..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && alertRuleLabelsInput.trim()) {
                            setAlertRuleLabels([...alertRuleLabels, alertRuleLabelsInput.trim()]);
                            setAlertRuleLabelsInput('');
                          }
                        }}
                      />
                    </FlexItem>
                  </Flex>
                </FormGroup>
                
                {/* Add Runbook URL */}
                <FormGroup fieldId="alert-rule-runbook">
                  <Checkbox
                    id="alert-rule-add-runbook"
                    label="Add Runbook URL"
                    isChecked={alertRuleAddRunbook}
                    onChange={(_, checked) => setAlertRuleAddRunbook(checked)}
                    body={<span style={{ display: 'block', marginTop: '4px', color: 'var(--pf-t--global--text--color--subtle)' }}>Runbooks provide clear, step-by-step instructions for completing a specific task. Add a URL to your alert rule that will be shown when the alert is firing.</span>}
                  />
                  {alertRuleAddRunbook && (
                    <FormGroup
                      label={
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <FlexItem>URL</FlexItem>
                          <FlexItem>
                            <Tooltip content="The URL to the runbook for this alert.">
                              <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                            </Tooltip>
                          </FlexItem>
                        </Flex>
                      }
                      isRequired
                      fieldId="alert-rule-runbook-url"
                    >
                      <TextInput
                        id="alert-rule-runbook-url"
                        value={alertRuleRunbookUrl}
                        onChange={(_, value) => setAlertRuleRunbookUrl(value)}
                        placeholder="https://"
                      />
                    </FormGroup>
                  )}
                </FormGroup>
                
                {/* Notification section */}
                <div style={{ marginTop: '24px' }}>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>Notification</Title>
                  
                  {/* Route alerts by label */}
                  <FormGroup fieldId="alert-rule-route-by-label">
                    <Checkbox
                      id="alert-rule-route-by-label"
                      label="Route alerts by label"
                      isChecked={alertRuleRouteByLabel}
                      onChange={(_, checked) => setAlertRuleRouteByLabel(checked)}
                      body={<span style={{ display: 'block', marginTop: '4px', color: 'var(--pf-t--global--text--color--subtle)' }}>Automatically sends alerts to the appropriate receivers using labels such as cluster, region, and owner_team.</span>}
                    />
                    {alertRuleRouteByLabel && (
                      <div style={{ marginTop: '8px', marginLeft: '24px' }}>
                        <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          {alertRuleRoutingLabels.map((label, idx) => (
                            <FlexItem key={idx}>
                              <Label color="blue" onClose={() => setAlertRuleRoutingLabels(alertRuleRoutingLabels.filter((_, i) => i !== idx))}>
                                {label}
                              </Label>
                            </FlexItem>
                          ))}
                          <FlexItem flex={{ default: 'flex_1' }}>
                            <TextInput
                              id="alert-rule-routing-labels-input"
                              value={alertRuleRoutingLabelsInput}
                              onChange={(_, value) => setAlertRuleRoutingLabelsInput(value)}
                              placeholder="Add routing label..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && alertRuleRoutingLabelsInput.trim()) {
                                  setAlertRuleRoutingLabels([...alertRuleRoutingLabels, alertRuleRoutingLabelsInput.trim()]);
                                  setAlertRuleRoutingLabelsInput('');
                                }
                              }}
                            />
                          </FlexItem>
                        </Flex>
                      </div>
                    )}
                  </FormGroup>
                  
                  {/* Receive by */}
                  <FormGroup
                    label={
                      <Flex alignItems={{ default: 'alignItemsFlexStart' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>Receivers</FlexItem>
                        <FlexItem>
                          <Tooltip content="Select the notification channels for this alert.">
                            <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                          </Tooltip>
                        </FlexItem>
                      </Flex>
                    }
                    fieldId="alert-rule-receive-by"
                  >
                    <Stack hasGutter className="carw-radio-stack">
                      <StackItem>
                        <Checkbox
                          id="alert-rule-receive-email"
                          label="Email"
                          isChecked={alertRuleReceiveByEmail}
                          onChange={(_, checked) => setAlertRuleReceiveByEmail(checked)}
                        />
                      </StackItem>
                      <StackItem>
                        <Checkbox
                          id="alert-rule-receive-slack"
                          label="Slack"
                          isChecked={alertRuleReceiveBySlack}
                          onChange={(_, checked) => setAlertRuleReceiveBySlack(checked)}
                        />
                        {alertRuleReceiveBySlack && (
                          <div style={{ marginTop: '8px', marginLeft: '24px' }}>
                            <Select
                              isOpen={isAlertRuleSlackReceiversOpen}
                              onOpenChange={setIsAlertRuleSlackReceiversOpen}
                              onSelect={(_, value) => {
                                const val = value as string;
                                if (alertRuleSlackReceivers.includes(val)) {
                                  setAlertRuleSlackReceivers(alertRuleSlackReceivers.filter(r => r !== val));
                                } else {
                                  setAlertRuleSlackReceivers([...alertRuleSlackReceivers, val]);
                                }
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setIsAlertRuleSlackReceiversOpen(!isAlertRuleSlackReceiversOpen)} isExpanded={isAlertRuleSlackReceiversOpen}>
                                  Select receivers {alertRuleSlackReceivers.length > 0 && <Badge isRead>{alertRuleSlackReceivers.length} selected</Badge>}
                                </MenuToggle>
                              )}
                            >
                              <SelectList>
                                <SelectOption value="mst-it.slack.com" hasCheckbox isSelected={alertRuleSlackReceivers.includes('mst-it.slack.com')}>mst-it.slack.com</SelectOption>
                                <SelectOption value="mst-critical.slack.com" hasCheckbox isSelected={alertRuleSlackReceivers.includes('mst-critical.slack.com')}>mst-critical.slack.com</SelectOption>
                                <SelectOption value="alerts-channel.slack.com" hasCheckbox isSelected={alertRuleSlackReceivers.includes('alerts-channel.slack.com')}>alerts-channel.slack.com</SelectOption>
                              </SelectList>
                            </Select>
                          </div>
                        )}
                      </StackItem>
                      <StackItem>
                        <Checkbox
                          id="alert-rule-receive-pagerduty"
                          label="PagerDuty"
                          isChecked={alertRuleReceiveByPagerDuty}
                          onChange={(_, checked) => setAlertRuleReceiveByPagerDuty(checked)}
                        />
                      </StackItem>
                      <StackItem>
                        <Checkbox
                          id="alert-rule-receive-webhook"
                          label="Webhook"
                          isChecked={alertRuleReceiveByWebhook}
                          onChange={(_, checked) => setAlertRuleReceiveByWebhook(checked)}
                          isDisabled
                        />
                      </StackItem>
                      <StackItem>
                        <Checkbox
                          id="alert-rule-receive-wechat"
                          label="WeChat"
                          isChecked={alertRuleReceiveByWeChat}
                          onChange={(_, checked) => setAlertRuleReceiveByWeChat(checked)}
                          isDisabled
                        />
                      </StackItem>
                    </Stack>
                    <Content component="p" style={{ marginTop: '12px', marginBottom: 0, fontSize: '0.875rem' }}>
                      <Button variant="link" isInline component="a" href="#administration-alertmanager">
                        Configure receivers in Alertmanager
                      </Button>{' '}
                      (opens Administration settings).
                    </Content>
                  </FormGroup>
                  
                  <PfAlert variant="info" isInline title="Receivers must be pre-configured before they appear in this list." style={{ marginTop: '16px' }}>
                    <Button variant="link" isInline>Learn more<ExternalLinkAltIcon /></Button>
                  </PfAlert>
                </div>
              </Form>
            </div>
          </WizardStep>
          
          {/* Step 3: Target clusters */}
          <WizardStep
            name="Target clusters"
            id="step-target-clusters"
          >
            <div style={{ padding: '24px', maxWidth: '1200px' }}>
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '8px' }}>Target clusters</Title>
              <Content component="p" style={{ marginBottom: '24px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                Define which clusters the alert rule applies to.
              </Content>
              
              <Form>
                {/* Apply to */}
                <FormGroup
                  label={
                    <Flex alignItems={{ default: 'alignItemsFlexStart' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>Apply to</FlexItem>
                      <FlexItem>
                        <Tooltip content="Choose whether to apply this alert rule to all clusters or specific ones.">
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  fieldId="alert-rule-apply-to"
                  className="carw-radio-stack"
                >
                  <Radio
                    id="apply-all-clusters"
                    name="apply-to"
                    label={`All clusters (${mockClusters.length})`}
                    description="Apply the rule fleet-wide without selecting individual clusters."
                    isChecked={alertRuleTargetAllClusters}
                    onChange={() => setAlertRuleTargetAllClusters(true)}
                  />
                  <Radio
                    id="apply-specific-clusters"
                    name="apply-to"
                    label="Specific clusters"
                    description="Pick clusters from the fleet table (supports filters and pagination)."
                    isChecked={!alertRuleTargetAllClusters}
                    onChange={() => setAlertRuleTargetAllClusters(false)}
                  />
                </FormGroup>
                
                {!alertRuleTargetAllClusters && (
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '8px' }}>
                    <Flex
                      className="carw-cluster-filter-toolbar"
                      gap={{ default: 'gapMd' }}
                      alignItems={{ default: 'alignItemsCenter' }}
                      flexWrap={{ default: 'wrap' }}
                      style={{ marginBottom: '12px' }}
                    >
                      <FlexItem>
                        <Checkbox
                          id="select-all-clusters"
                          label="Select all in view"
                          isChecked={
                            allFilteredSelected ? true : someFilteredSelected ? null : false
                          }
                          onChange={(_, checked) => {
                            if (checked) {
                              const set = new Set(alertRuleSelectedClusters);
                              filteredClusterNames.forEach((n) => set.add(n));
                              setAlertRuleSelectedClusters(Array.from(set));
                            } else {
                              setAlertRuleSelectedClusters(
                                alertRuleSelectedClusters.filter((n) => !filteredClusterNames.includes(n))
                              );
                            }
                          }}
                        />
                      </FlexItem>
                      <FlexItem>
                        <Select
                          isOpen={isClusterFilterAttributeMenuOpen}
                          onOpenChange={setIsClusterFilterAttributeMenuOpen}
                          selected={clusterFilterAttribute}
                          onSelect={(_, value) => {
                            setClusterFilterAttribute(value as ClusterFilterAttribute);
                            setIsClusterFilterAttributeMenuOpen(false);
                            setClusterFilterValueInput('');
                            setIsClusterVersionMenuOpen(false);
                          }}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setIsClusterFilterAttributeMenuOpen(!isClusterFilterAttributeMenuOpen)}
                              isExpanded={isClusterFilterAttributeMenuOpen}
                              style={{ minWidth: '10rem' }}
                              aria-label="Filter attribute"
                            >
                              {clusterFilterAttributeLabel(clusterFilterAttribute)}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            <SelectOption value="name">Name</SelectOption>
                            <SelectOption value="label">Label</SelectOption>
                            <SelectOption value="version">Version</SelectOption>
                          </SelectList>
                        </Select>
                      </FlexItem>
                      <FlexItem flex={{ default: 'flex_1' }} style={{ minWidth: 0, width: '100%' }}>
                        {clusterFilterAttribute === 'version' ? (
                          <Stack hasGutter style={{ width: '100%' }}>
                            <StackItem>
                              <TextInput
                                id="cluster-filter-version-typeahead"
                                aria-label={clusterFilterValuePlaceholder('version')}
                                placeholder={clusterFilterValuePlaceholder('version')}
                                value={clusterFilterValueInput}
                                onChange={(_, v) => setClusterFilterValueInput(v)}
                                style={{ width: '100%' }}
                              />
                            </StackItem>
                            <StackItem>
                              <Select
                                isOpen={isClusterVersionMenuOpen}
                                onOpenChange={setIsClusterVersionMenuOpen}
                                selected={undefined}
                                onSelect={(_, value) => {
                                  const v = String(value);
                                  if (v !== '__none__') addClusterVersionFilter(v);
                                }}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsClusterVersionMenuOpen(!isClusterVersionMenuOpen)}
                                    isExpanded={isClusterVersionMenuOpen}
                                    style={{ width: '100%' }}
                                    aria-label="Choose OpenShift or Kubernetes version"
                                  >
                                    Select version
                                  </MenuToggle>
                                )}
                              >
                                <SelectList>
                                  {filteredVersionOptions.length === 0 ? (
                                    <SelectOption value="__none__" isDisabled>
                                      No versions match
                                    </SelectOption>
                                  ) : (
                                    filteredVersionOptions.map((ver) => (
                                      <SelectOption key={ver} value={ver}>
                                        {ver}
                                      </SelectOption>
                                    ))
                                  )}
                                </SelectList>
                              </Select>
                            </StackItem>
                            <StackItem>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  const raw = clusterFilterValueInput.trim();
                                  if (!raw) return;
                                  const id = `cf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                                  setClusterTableFilters((prev) => [...prev, { id, attribute: 'version', value: raw }]);
                                  setClusterFilterValueInput('');
                                }}
                              >
                                Add filter
                              </Button>
                            </StackItem>
                          </Stack>
                        ) : (
                          <TextInput
                            id="cluster-filter-value"
                            aria-label={clusterFilterValuePlaceholder(clusterFilterAttribute)}
                            placeholder={clusterFilterValuePlaceholder(clusterFilterAttribute)}
                            value={clusterFilterValueInput}
                            onChange={(_, v) => setClusterFilterValueInput(v)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addClusterTextFilter();
                              }
                            }}
                            style={{ width: '100%' }}
                          />
                        )}
                      </FlexItem>
                      {clusterFilterAttribute !== 'version' && (
                        <FlexItem>
                          <Button variant="secondary" onClick={addClusterTextFilter}>
                            Add filter
                          </Button>
                        </FlexItem>
                      )}
                    </Flex>

                    {clusterTableFilters.length > 0 && (
                      <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '12px' }}>
                        {clusterTableFilters.map((f) => (
                          <FlexItem key={f.id}>
                            <Label color="blue" onClose={() => setClusterTableFilters((prev) => prev.filter((x) => x.id !== f.id))}>
                              {clusterTableChipText(f)}
                            </Label>
                          </FlexItem>
                        ))}
                      </Flex>
                    )}

                    <Flex
                      justifyContent={{ default: 'justifyContentSpaceBetween' }}
                      alignItems={{ default: 'alignItemsCenter' }}
                      flexWrap={{ default: 'wrap' }}
                      gap={{ default: 'gapMd' }}
                      style={{ marginBottom: '12px' }}
                    >
                      <FlexItem>
                        <Content component="p" style={{ margin: 0, fontSize: '0.875rem' }}>
                          <strong>{alertRuleSelectedClusters.filter((n) => filteredClusterNames.includes(n)).length}</strong>
                          {' '}of <strong>{filteredClusters.length}</strong> clusters in view selected
                        </Content>
                      </FlexItem>
                      <FlexItem>
                        <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                          <Button variant="link" isInline onClick={() => setAlertRuleSelectedClusters([])}>
                            Clear selection
                          </Button>
                          <Button variant="link" isInline onClick={() => setViewSelectedClustersOnly((v) => !v)}>
                            {viewSelectedClustersOnly ? 'Show all in view' : 'View selected only'}
                          </Button>
                        </Flex>
                      </FlexItem>
                    </Flex>
                    
                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }} flexWrap={{ default: 'wrap' }}>
                      {environmentFilters.length > 0 && (
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                            <Label color="grey" isCompact>Environment</Label>
                            {environmentFilters.map((env, idx) => (
                              <Label key={idx} color="blue" isCompact onClose={() => setEnvironmentFilters(environmentFilters.filter(e => e !== env))}>
                                {env}
                              </Label>
                            ))}
                            <Button variant="plain" size="sm" onClick={() => setEnvironmentFilters([])}>
                              <TimesIcon />
                            </Button>
                          </Flex>
                        </FlexItem>
                      )}
                      {regionFilters.length > 0 && (
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
                            <Label color="grey" isCompact>Region</Label>
                            {regionFilters.slice(0, 3).map((reg, idx) => (
                              <Label key={idx} color="blue" isCompact onClose={() => setRegionFilters(regionFilters.filter(r => r !== reg))}>
                                {reg}
                              </Label>
                            ))}
                            {regionFilters.length > 3 && <Badge isRead>{regionFilters.length - 3} more</Badge>}
                            <Button variant="plain" size="sm" onClick={() => setRegionFilters([])}>
                              <TimesIcon />
                            </Button>
                          </Flex>
                        </FlexItem>
                      )}
                    </Flex>
                    
                    <div className="carw-cluster-scroll">
                      {filteredClusters.length === 0 ? (
                        <EmptyState>
                          <Title headingLevel="h4" size="lg">
                            No clusters match the selected filters
                          </Title>
                          <EmptyStateBody>
                            Adjust or remove filters to see clusters in the fleet table.
                          </EmptyStateBody>
                          <EmptyStateActions>
                            <Button variant="link" onClick={clearAllClusterFilters}>
                              Clear all filters
                            </Button>
                          </EmptyStateActions>
                        </EmptyState>
                      ) : (
                        <Table aria-label="Target clusters table" variant="compact">
                          <Thead>
                            <Tr>
                              <Th screenReaderText="Select row" />
                              <Th>Name</Th>
                              <Th>Namespace</Th>
                              <Th>Infrastructure</Th>
                              <Th>Status</Th>
                              <Th>Region</Th>
                              <Th>Version</Th>
                              <Th>Labels</Th>
                              <Th>Environment</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {pagedClusters.map((cluster) => (
                              <Tr key={cluster.name}>
                                <Td>
                                  <Checkbox
                                    id={`cluster-${cluster.name}`}
                                    isChecked={alertRuleSelectedClusters.includes(cluster.name)}
                                    onChange={(_, checked) => {
                                      if (checked) {
                                        setAlertRuleSelectedClusters([...alertRuleSelectedClusters, cluster.name]);
                                      } else {
                                        setAlertRuleSelectedClusters(alertRuleSelectedClusters.filter((c) => c !== cluster.name));
                                      }
                                    }}
                                  />
                                </Td>
                                <Td>
                                  <span style={{ fontWeight: 600 }}>{cluster.name}</span>
                                </Td>
                                <Td>{cluster.namespace}</Td>
                                <Td>{cluster.infrastructure}</Td>
                                <Td>
                                  {cluster.status === 'Ready' ? (
                                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'nowrap' }}>
                                      <CheckCircleIcon style={{ color: 'var(--pf-t--global--palette--green-500, #3e8635)' }} aria-hidden />
                                      <span style={{ fontWeight: 600, color: 'var(--pf-t--global--text--color--regular)' }}>Ready</span>
                                    </Flex>
                                  ) : (
                                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'nowrap' }}>
                                      <ExclamationCircleIcon style={{ color: 'var(--pf-t--global--palette--red-400, #c9190b)' }} aria-hidden />
                                      <span style={{ fontWeight: 600, color: 'var(--pf-t--global--text--color--regular)' }}>Not ready</span>
                                    </Flex>
                                  )}
                                </Td>
                                <Td>{cluster.region}</Td>
                                <Td>{cluster.version}</Td>
                                <Td>
                                  <Tooltip content={formatClusterLabelsTooltip(cluster.labels)}>
                                    <span tabIndex={0} style={{ cursor: 'default', textDecoration: 'underline dotted' }}>
                                      {Object.keys(cluster.labels).length} labels
                                    </span>
                                  </Tooltip>
                                </Td>
                                <Td>{cluster.environment}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      )}
                    </div>
                    <Pagination
                      itemCount={filteredClusters.length}
                      perPage={clusterPerPage}
                      page={clusterTablePage}
                      onSetPage={(_, page) => setClusterTablePage(page)}
                      onPerPageSelect={(_, perPage) => {
                        setClusterPerPage(perPage);
                        setClusterTablePage(1);
                      }}
                      variant="bottom"
                      isCompact
                      titles={{ paginationAriaLabel: 'Clusters table pagination' }}
                    />
                  </div>
                )}
              </Form>
            </div>
          </WizardStep>
          
          {/* Step 4: Review and create */}
          <WizardStep
            name="Review and create"
            id="step-review-create"
            footer={{
              nextButtonText: 'Create alert rule',
              onNext: handleCreate
            }}
          >
            <div style={{ padding: '24px', maxWidth: '900px' }}>
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>Review and create</Title>
              
              {/* Alert rules definition section */}
              <div style={{ marginBottom: '24px' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">Alert rule definition</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="link">Edit step</Button>
                  </FlexItem>
                </Flex>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Alert name</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleName || 'EtcdLeaderElectionFailed'}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Expression</DescriptionListTerm>
                    <DescriptionListDescription style={{ fontFamily: 'var(--pf-t--global--font--family--mono)' }}>
                      {alertRuleExpression || 'intstr.FromString("kubevirt_vmi_non_evictable * on(name, namespace) group_left() kubevirt_vmi_info{phase=\'running\'} == 1"),'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>For</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleForDuration} {alertRuleForUnit.toLowerCase()}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Severity</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label 
                        color={alertRuleSeverity === 'Critical' ? 'red' : alertRuleSeverity === 'Warning' ? 'orange' : 'purple'}
                        icon={alertRuleSeverity === 'Critical' ? <ExclamationCircleIcon /> : alertRuleSeverity === 'Warning' ? <ExclamationTriangleIcon /> : <InfoCircleIcon />}
                        isCompact
                      >
                        {alertRuleSeverity}
                      </Label>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Alert scope</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleGroup}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Affected component</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleComponent || 'etcd'}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Source</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleSource}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>{alertRuleSource === 'Platform' ? 'AlertingRule' : 'PrometheusRule'}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {alertRuleAppendTo || (alertRuleSource === 'Platform' ? 'AlertingRule-platform' : 'PrometheusRule-default')} (namespace: openshift-monitoring)
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </div>
              
              {/* Metadata and notifications section */}
              <div style={{ marginBottom: '24px' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">Metadata and notifications</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="link">Edit step</Button>
                  </FlexItem>
                </Flex>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Summary</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleSummary || 'EtcdLeaderElectionFailed'}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Description</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleDescription || 'etcd leader election is failing or etcd quorum is lost'}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Labels</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Flex gap={{ default: 'gapSm' }}>
                        {(alertRuleLabels.length > 0 ? alertRuleLabels : ['label-label1', 'lable2']).map((label, idx) => (
                          <Label key={idx} color="grey" isCompact>{label}</Label>
                        ))}
                      </Flex>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Runbook URL</DescriptionListTerm>
                    <DescriptionListDescription>
                      {alertRuleRunbookUrl || 'https://github.com/openshift/runbooks/blob/master/alerts/cluster-monitoring-operator/AlertmanagerFailedToSendAlerts.md'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Notify by</DescriptionListTerm>
                    <DescriptionListDescription>
                      {alertRuleReceiveBySlack ? 'Slack' : alertRuleReceiveByEmail ? 'Email' : alertRuleReceiveByPagerDuty ? 'PagerDuty' : 'None selected'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Receivers</DescriptionListTerm>
                    <DescriptionListDescription>
                      {alertRuleSlackReceivers.length > 0 ? alertRuleSlackReceivers.join(', ') : 'mst-it.slack.com, mst-critical.slack.com'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </div>
              
              {/* Target clusters section */}
              <div style={{ marginBottom: '24px' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">Target clusters</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="link">Edit step</Button>
                  </FlexItem>
                </Flex>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Number of clusters</DescriptionListTerm>
                    <DescriptionListDescription>{reviewTargetCount}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Target summary</DescriptionListTerm>
                    <DescriptionListDescription>
                      {reviewTargetCount > 5 ? (
                        <div>
                          <Content component="p" style={{ margin: 0, marginBottom: '8px', fontSize: '1rem' }}>
                            <strong>{reviewTargetCount} clusters targeted</strong>{' '}
                            (Filtered by: {reviewFilterSummary})
                          </Content>
                          <Button variant="link" isInline onClick={() => setIsTargetListModalOpen(true)}>
                            Expand
                          </Button>
                        </div>
                      ) : reviewTargetCount === 0 ? (
                        <Content component="p" style={{ margin: 0, fontSize: '1rem' }}>
                          No clusters selected.
                        </Content>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '1rem' }}>
                          {reviewTargetNames.map((name) => (
                            <li key={name}>{name}</li>
                          ))}
                        </ul>
                      )}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </div>
              
              {/* Download YAML - Only on step 4 */}
              <Divider style={{ marginBottom: '24px' }} />
              <Button variant="secondary">Download YAML file</Button>
            </div>
          </WizardStep>
        </Wizard>
      </div>

      <Modal
        isOpen={isTargetListModalOpen}
        onClose={() => setIsTargetListModalOpen(false)}
        variant="medium"
        aria-labelledby="carw-target-modal-title"
      >
        <ModalHeader title="Clusters targeted" labelId="carw-target-modal-title" />
        <ModalBody>
          <Content component="p" style={{ marginBottom: '16px', fontSize: '0.875rem' }}>
            Filtered by: <strong>{reviewFilterSummary}</strong>
          </Content>
          <ul
            style={{ maxHeight: '50vh', overflow: 'auto', margin: 0, paddingLeft: '1.25rem', fontSize: '1rem' }}
            aria-label="Target cluster names"
          >
            {reviewTargetNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsTargetListModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export { CreateAlertRulePage };
