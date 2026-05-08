/**
 * Create Alert Rule - Full Page Wizard
 * 
 * A 4-step wizard for creating custom alert rules:
 * 1. Alert rules definition
 * 2. Metadata and notifications
 * 3. Target clusters
 * 4. Review and create
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
  SearchInput,
  Alert as PfAlert,
  Divider,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
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

// Mock cluster data for target clusters step
interface ClusterData {
  name: string;
  namespace: string;
  infrastructure: string;
  status: 'Ready' | 'Offline' | 'Degraded';
  region: string;
  version: string;
  labels: Record<string, string>;
  environment: string;
}

const mockClusters: ClusterData[] = [
  { name: 'prod-web-us-east-1', namespace: 'aks-central', infrastructure: 'Microsoft Azure', status: 'Ready', region: 'us-east-1', version: 'v1.31.6', labels: { team: 'platform', tier: 'production' }, environment: 'Production' },
  { name: 'prod-web-us-west-2', namespace: 'aks-central', infrastructure: 'AWS', status: 'Ready', region: 'us-west-2', version: 'ARO 4.17.12', labels: { team: 'platform', tier: 'production' }, environment: 'Staging' },
  { name: 'prod-db-us-east-1', namespace: 'Default', infrastructure: 'VMware vSphere', status: 'Ready', region: 'us-west-2', version: 'v1.31.6-eks-bc8f', labels: { team: 'database', tier: 'production' }, environment: 'Production' },
  { name: 'OCP-Stage-AppB', namespace: 'boston', infrastructure: 'AWS', status: 'Ready', region: 'eu-west-1', version: 'OpenShift 4.17.8', labels: { app: 'staging', team: 'appb' }, environment: 'Development' },
  { name: 'legacy-monolith-03', namespace: 'boston', infrastructure: 'VMware vSphere', status: 'Ready', region: 'us-east-1', version: 'OpenShift 4.21.1', labels: { legacy: 'true', team: 'ops' }, environment: 'Production' },
  { name: 'OCP-Stage-AppC', namespace: 'k3s-east', infrastructure: 'Other', status: 'Ready', region: 'eu-west-1', version: 'OpenShift 4.19.8', labels: { app: 'staging', team: 'appc' }, environment: 'Staging' },
  { name: 'OCP-Stage-AppD', namespace: 'k3s-west', infrastructure: 'AWS', status: 'Ready', region: 'eu-central-1', version: 'OpenShift 4.21.1', labels: { app: 'staging', team: 'appd' }, environment: 'Production' },
  { name: 'dev-k8s-sandbox-01', namespace: 'k3s-east', infrastructure: 'Other', status: 'Ready', region: 'us-east-2', version: 'OpenShift 4.21.1', labels: { sandbox: 'true', team: 'dev' }, environment: 'Development' },
  { name: 'prod-api-eu-central', namespace: 'eks-europe', infrastructure: 'AWS', status: 'Ready', region: 'eu-central-1', version: 'OpenShift 4.18.5', labels: { api: 'true', tier: 'production' }, environment: 'Production' },
  { name: 'stage-ml-us-west', namespace: 'gke-ml', infrastructure: 'Google Cloud', status: 'Ready', region: 'us-west-1', version: 'OpenShift 4.20.3', labels: { ml: 'true', team: 'data' }, environment: 'Staging' },
];

// Available components for typeahead
const availableComponents: AlertComponent[] = ['kube-apiserver', 'Storage', 'Network', 'etcd', 'Scheduler', 'Controller', 'Workload', 'Pod', 'Quota'];

const CreateAlertRulePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  
  // YAML mode toggle
  const [isYamlMode, setIsYamlMode] = React.useState(false);
  
  // Step 1: Alert rules definition
  const [alertRuleName, setAlertRuleName] = React.useState('');
  const [alertRuleExpression, setAlertRuleExpression] = React.useState('');
  const [alertRuleFireImmediately, setAlertRuleFireImmediately] = React.useState(false);
  const [alertRuleForDuration, setAlertRuleForDuration] = React.useState(1);
  const [alertRuleForUnit, setAlertRuleForUnit] = React.useState<'Seconds' | 'Minutes' | 'Hours'>('Seconds');
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
  const [alertRuleClusterSearch, setAlertRuleClusterSearch] = React.useState('');
  
  // Attribute-value filter state
  const [filterAttribute, setFilterAttribute] = React.useState<'Name' | 'Label' | 'Version'>('Name');
  const [isFilterAttributeOpen, setIsFilterAttributeOpen] = React.useState(false);
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
  
  // Filter clusters based on search and filters
  const filteredClusters = React.useMemo(() => {
    return mockClusters.filter(cluster => {
      // Search filter
      if (alertRuleClusterSearch) {
        const searchLower = alertRuleClusterSearch.toLowerCase();
        if (filterAttribute === 'Name' && !cluster.name.toLowerCase().includes(searchLower)) return false;
        if (filterAttribute === 'Label') {
          const labelMatch = Object.entries(cluster.labels).some(([k, v]) => 
            `${k}=${v}`.toLowerCase().includes(searchLower) || k.toLowerCase().includes(searchLower) || v.toLowerCase().includes(searchLower)
          );
          if (!labelMatch) return false;
        }
        if (filterAttribute === 'Version' && !cluster.version.toLowerCase().includes(searchLower)) return false;
      }
      // Environment filter
      if (environmentFilters.length > 0 && !environmentFilters.includes(cluster.environment)) return false;
      // Region filter
      if (regionFilters.length > 0 && !regionFilters.includes(cluster.region)) return false;
      return true;
    });
  }, [alertRuleClusterSearch, filterAttribute, environmentFilters, regionFilters]);
  
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)' }}>
      {/* Page Header with Breadcrumb */}
      <div style={{ padding: '16px 24px', backgroundColor: 'var(--pf-t--global--background--color--primary--default)', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
        <Breadcrumb>
          <BreadcrumbItem to="/observe/alerting">Observe</BreadcrumbItem>
          <BreadcrumbItem to="/observe/alerting">alerting</BreadcrumbItem>
          <BreadcrumbItem isActive>Create new alert rules</BreadcrumbItem>
        </Breadcrumb>
        
        <div style={{ marginTop: '16px' }}>
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">Create Alert rules</Title>
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
      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
        <Wizard onClose={handleClose} height="100%">
          {/* Step 1: Alert rules definition */}
          <WizardStep
            name="Alert rules details"
            id="step-alert-rules-definition"
          >
            <div style={{ padding: '24px', maxWidth: '800px' }}>
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>Alert rules definition</Title>
              
              <Form>
                {/* Alert name */}
                <FormGroup
                  label={
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>Alert name</FlexItem>
                      <FlexItem>
                        <Tooltip content="A unique name for the alert rule. Must be in PascalCase.">
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  isRequired
                  fieldId="alert-rule-name"
                >
                  <TextInput
                    id="alert-rule-name"
                    value={alertRuleName}
                    onChange={(_, value) => setAlertRuleName(value)}
                    placeholder="e.g., NodeCPUHigh, EtcdLeaderElectionFailed"
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
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>Expression</FlexItem>
                      <FlexItem>
                        <Tooltip content="A PromQL expression that defines when the alert should fire.">
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  isRequired
                  fieldId="alert-rule-expression"
                >
                  <TextArea
                    id="alert-rule-expression"
                    value={alertRuleExpression}
                    onChange={(_, value) => setAlertRuleExpression(value)}
                    placeholder="sum(etcd_server_has_leader) by (cluster) < count(etcd_server_has_leader) | | by (cluster)"
                    rows={4}
                    style={{ fontFamily: 'var(--pf-t--global--font--family--mono)' }}
                  />
                </FormGroup>
                
                {/* Fire alert options */}
                <FormGroup fieldId="alert-rule-fire-options">
                  <Radio
                    id="fire-immediately"
                    name="fire-option"
                    label="Fire alert immediately when expression is met"
                    isChecked={alertRuleFireImmediately}
                    onChange={() => setAlertRuleFireImmediately(true)}
                  />
                  <Radio
                    id="fire-after-duration"
                    name="fire-option"
                    label="Fire alert only if the expression is met for the following period of time"
                    isChecked={!alertRuleFireImmediately}
                    onChange={() => setAlertRuleFireImmediately(false)}
                    style={{ marginTop: '8px' }}
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
                
                {/* Severity */}
                <FormGroup
                  label="Severity"
                  isRequired
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
                
                {/* Alert group and Component */}
                <Flex gap={{ default: 'gapMd' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <FormGroup
                      label="Alert group"
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
                      label="Component"
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
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem>The high-level impact group and component area the alert relates to</HelperTextItem>
                  </HelperText>
                </FormHelperText>
                
                {/* Append to */}
                <FormGroup
                  label={
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>Append to</FlexItem>
                      <FlexItem>
                        <Tooltip content="Select which Kubernetes PrometheusRule Custom Resource will contain this alert definition.">
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
                        {alertRuleAppendTo || 'Select a PrometheusRule CR'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="PrometheusRule-default">PrometheusRule-default (namespace: openshift-monitoring)</SelectOption>
                      <SelectOption value="PrometheusRule-custom">PrometheusRule-custom (namespace: openshift-monitoring)</SelectOption>
                      <SelectOption value="PrometheusRule-cluster">PrometheusRule-cluster (namespace: openshift-monitoring)</SelectOption>
                    </SelectList>
                  </Select>
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>This selection determines which Kubernetes PrometheusRule Custom Resource will contain this alert definition.</HelperTextItem>
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
                  label="Summary"
                  isRequired
                  fieldId="alert-rule-summary"
                >
                  <TextInput
                    id="alert-rule-summary"
                    value={alertRuleSummary}
                    onChange={(_, value) => setAlertRuleSummary(value)}
                    placeholder="Node CPU Critical - {{ $labels.instance }}"
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
                  label="Labels (key=value)"
                  isRequired
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
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>Receive by</FlexItem>
                        <FlexItem>
                          <Tooltip content="Select the notification channels for this alert.">
                            <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                          </Tooltip>
                        </FlexItem>
                      </Flex>
                    }
                    fieldId="alert-rule-receive-by"
                  >
                    <Stack hasGutter>
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
                  </FormGroup>
                  
                  {/* Info alert about receivers */}
                  <PfAlert variant="info" isInline title="Receivers must be pre-configured under Administration > Cluster Settings > Alert Manager details" style={{ marginTop: '16px' }}>
                    <Button variant="link" isInline>Configure Alertmanager</Button>
                    {' '}
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
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                      <FlexItem>Apply to</FlexItem>
                      <FlexItem>
                        <Tooltip content="Choose whether to apply this alert rule to all clusters or specific ones.">
                          <QuestionCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
                        </Tooltip>
                      </FlexItem>
                    </Flex>
                  }
                  fieldId="alert-rule-apply-to"
                >
                  <Radio
                    id="apply-all-clusters"
                    name="apply-to"
                    label={`All clusters (${mockClusters.length})`}
                    isChecked={alertRuleTargetAllClusters}
                    onChange={() => setAlertRuleTargetAllClusters(true)}
                  />
                  <Radio
                    id="apply-specific-clusters"
                    name="apply-to"
                    label="Specific clusters"
                    isChecked={!alertRuleTargetAllClusters}
                    onChange={() => setAlertRuleTargetAllClusters(false)}
                    style={{ marginTop: '8px' }}
                  />
                </FormGroup>
                
                {!alertRuleTargetAllClusters && (
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '8px' }}>
                    {/* Toolbar with attribute-value filter */}
                    <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                      <FlexItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                          <FlexItem>
                            <Checkbox 
                              id="select-all-clusters" 
                              isChecked={alertRuleSelectedClusters.length === filteredClusters.length && filteredClusters.length > 0}
                              onChange={(_, checked) => {
                                if (checked) {
                                  setAlertRuleSelectedClusters(filteredClusters.map(c => c.name));
                                } else {
                                  setAlertRuleSelectedClusters([]);
                                }
                              }}
                            />
                          </FlexItem>
                          <FlexItem>
                            <MenuToggle>
                              {alertRuleSelectedClusters.length} selected
                            </MenuToggle>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                      
                      {/* Attribute dropdown (Name / Label / Version) */}
                      <FlexItem>
                        <Select
                          isOpen={isFilterAttributeOpen}
                          onOpenChange={setIsFilterAttributeOpen}
                          onSelect={(_, value) => { setFilterAttribute(value as 'Name' | 'Label' | 'Version'); setIsFilterAttributeOpen(false); }}
                          selected={filterAttribute}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle ref={toggleRef} onClick={() => setIsFilterAttributeOpen(!isFilterAttributeOpen)} isExpanded={isFilterAttributeOpen}>
                              {filterAttribute}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            <SelectOption value="Name">Name</SelectOption>
                            <SelectOption value="Label">Label</SelectOption>
                            <SelectOption value="Version">Version</SelectOption>
                          </SelectList>
                        </Select>
                      </FlexItem>
                      
                      {/* Search input */}
                      <FlexItem flex={{ default: 'flex_1' }}>
                        <SearchInput
                          placeholder={`Find by ${filterAttribute.toLowerCase()}`}
                          value={alertRuleClusterSearch}
                          onChange={(_, value) => setAlertRuleClusterSearch(value)}
                          onClear={() => setAlertRuleClusterSearch('')}
                        />
                      </FlexItem>
                    </Flex>
                    
                    {/* Filter chips */}
                    <Flex gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }} flexWrap={{ default: 'wrap' }}>
                      {/* Environment filter group */}
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
                      
                      {/* Region filter group */}
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
                    
                    {/* Clusters Table */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: 'var(--pf-t--global--background--color--primary--default)' }}>
                      <Table aria-label="Target clusters table" variant="compact">
                        <Thead>
                          <Tr>
                            <Th screenReaderText="Select" />
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
                          {filteredClusters.map((cluster) => (
                            <Tr key={cluster.name}>
                              <Td>
                                <Checkbox
                                  id={`cluster-${cluster.name}`}
                                  isChecked={alertRuleSelectedClusters.includes(cluster.name)}
                                  onChange={(_, checked) => {
                                    if (checked) {
                                      setAlertRuleSelectedClusters([...alertRuleSelectedClusters, cluster.name]);
                                    } else {
                                      setAlertRuleSelectedClusters(alertRuleSelectedClusters.filter(c => c !== cluster.name));
                                    }
                                  }}
                                />
                              </Td>
                              <Td>
                                <Button variant="link" isInline>{cluster.name}</Button>
                              </Td>
                              <Td>{cluster.namespace}</Td>
                              <Td>{cluster.infrastructure}</Td>
                              <Td>
                                <Label color="green" isCompact icon={<CheckCircleIcon />}>
                                  {cluster.status}
                                </Label>
                              </Td>
                              <Td>{cluster.region}</Td>
                              <Td>{cluster.version}</Td>
                              <Td>
                                <Button variant="link" isInline size="sm">{Object.keys(cluster.labels).length} Labels</Button>
                              </Td>
                              <Td>{cluster.environment}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
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
              <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>Review alert rules</Title>
              
              {/* Alert rules definition section */}
              <div style={{ marginBottom: '24px' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <Title headingLevel="h3" size="lg">Alert rules definition</Title>
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
                    <DescriptionListTerm>Group</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleGroup}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Component</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleComponent || 'etcd'}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>PrometheusRule</DescriptionListTerm>
                    <DescriptionListDescription>{alertRuleAppendTo || 'PrometheusRule-default'} (namespace: openshift-monitoring)</DescriptionListDescription>
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
                    <DescriptionListTerm>Receive by</DescriptionListTerm>
                    <DescriptionListDescription>
                      {alertRuleReceiveBySlack ? 'Slack' : alertRuleReceiveByEmail ? 'Email' : alertRuleReceiveByPagerDuty ? 'PagerDuty' : 'Slack'}
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
                    <DescriptionListDescription>
                      {alertRuleTargetAllClusters ? `${mockClusters.length} target clusters` : `${alertRuleSelectedClusters.length} target clusters`}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Cluster names</DescriptionListTerm>
                    <DescriptionListDescription>
                      {alertRuleTargetAllClusters 
                        ? `${mockClusters.slice(0, 4).map(c => c.name).join(', ')} `
                        : alertRuleSelectedClusters.slice(0, 4).join(', ')
                      }
                      {(alertRuleTargetAllClusters ? mockClusters.length : alertRuleSelectedClusters.length) > 4 && (
                        <Button variant="link" isInline>
                          {(alertRuleTargetAllClusters ? mockClusters.length : alertRuleSelectedClusters.length) - 4} more
                        </Button>
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
    </div>
  );
};

export { CreateAlertRulePage };
