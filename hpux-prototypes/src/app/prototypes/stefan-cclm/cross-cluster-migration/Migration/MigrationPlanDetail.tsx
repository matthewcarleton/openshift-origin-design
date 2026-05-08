import React from 'react';
import {
  Title,
  Button,
  Tabs,
  Tab,
  TabTitleText,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Divider,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { CheckCircleIcon, PencilAltIcon } from '@patternfly/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { getMigrationPlanById, getClusterById, getNamespaceById, getVirtualMachineById } from '@app/data/queries';

const MigrationPlanDetail: React.FunctionComponent = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  
  // Get migration plan
  const plan = planId ? getMigrationPlanById(planId) : null;
  const targetCluster = plan ? getClusterById(plan.targetClusterId) : null;
  const targetNamespace = plan ? getNamespaceById(plan.targetNamespaceId) : null;
  const sourceCluster = plan ? getClusterById(plan.sourceClusterId) : null;
  
  useDocumentTitle(plan?.name || 'Migration plan details');
  
  if (!plan) {
    return (
      <div className="migration-plan-detail-page-container">
        <div className="page-header-section">
          <Title headingLevel="h1">Migration plan not found</Title>
        </div>
      </div>
    );
  }
  
  return (
    <div className="migration-plan-detail-page-container">
      {/* Header */}
      <div className="page-header-section">
        <Breadcrumb>
          <BreadcrumbItem to="/virtualization/overview">Migration</BreadcrumbItem>
          <BreadcrumbItem to="/virtualization/migration">Migration plans</BreadcrumbItem>
          <BreadcrumbItem isActive>Migration plan details</BreadcrumbItem>
        </Breadcrumb>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Title headingLevel="h1" size="2xl">
              Migration plan details
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
              <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                Ready to migrate
              </span>
            </div>
          </div>
          <Button variant="secondary">Actions</Button>
        </div>
      </div>
      
      <div className="page-content-section">
        {/* Tabs */}
        <Tabs
        activeKey={activeTabKey}
        onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
        aria-label="Migration plan details tabs"
      >
        <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
            {/* Plan details section */}
            <Card>
              <CardBody>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>
                  Plan details
                </Title>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color={plan.status === 'In progress' ? 'blue' : plan.status === 'Completed' ? 'green' : 'grey'}>
                        {plan.status}
                      </Label>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Namespace</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color="blue">{plan.namespace}</Label>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Created at</DescriptionListTerm>
                    <DescriptionListDescription>
                      {new Date(plan.createdAt).toLocaleString()}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Owner</DescriptionListTerm>
                    <DescriptionListDescription>
                      {plan.owner || 'No owner'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
            
            {/* Settings section */}
            <Card style={{ marginTop: '24px' }}>
              <CardBody>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>
                  Settings
                </Title>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Transfer Network</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>{plan.transferNetwork || 'Providers default'}</FlexItem>
                        <FlexItem>
                          <Button variant="link" isInline icon={<PencilAltIcon />}>
                            Edit
                          </Button>
                        </FlexItem>
                      </Flex>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Target namespace</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>{targetNamespace?.name || plan.targetNamespaceId}</FlexItem>
                        <FlexItem>
                          <Button variant="link" isInline icon={<PencilAltIcon />}>
                            Edit
                          </Button>
                        </FlexItem>
                      </Flex>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
            
            {/* Providers section */}
            <Card style={{ marginTop: '24px' }}>
              <CardBody>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>
                  Providers
                </Title>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Source provider</DescriptionListTerm>
                    <DescriptionListDescription>
                      {plan.sourceProvider || 'host'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Target provider</DescriptionListTerm>
                    <DescriptionListDescription>
                      {plan.targetProvider || 'host'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>
            
            {/* Migrations section */}
            <Card style={{ marginTop: '24px' }}>
              <CardBody>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>
                  Migrations
                </Title>
                <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Migrations not found
                </div>
              </CardBody>
            </Card>
            
            {/* Conditions section */}
            <Card style={{ marginTop: '24px' }}>
              <CardBody>
                <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>
                  Conditions
                </Title>
                <Table aria-label="Conditions table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Status</Th>
                      <Th>Updated</Th>
                      <Th>Reason</Th>
                      <Th>Message</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {plan.conditions.map((condition, index) => (
                      <Tr key={index}>
                        <Td dataLabel="Type">{condition.type}</Td>
                        <Td dataLabel="Status">{condition.status ? 'True' : 'False'}</Td>
                        <Td dataLabel="Updated">{new Date(condition.updated).toLocaleString()}</Td>
                        <Td dataLabel="Reason">{condition.reason}</Td>
                        <Td dataLabel="Message">{condition.message}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
            <Card>
              <CardBody>
                <pre style={{ 
                  fontFamily: 'var(--pf-t--global--font--family--mono)', 
                  fontSize: '13px', 
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
{`apiVersion: forklift.konveyor.io/v1beta1
kind: Plan
metadata:
  name: ${plan.name}
  namespace: ${plan.namespace}
  creationTimestamp: ${plan.createdAt}
spec:
  provider:
    source:
      name: ${plan.sourceProvider}
    destination:
      name: ${plan.targetProvider}
  targetNamespace: ${targetNamespace?.name || plan.targetNamespaceId}
  transferNetwork: ${plan.transferNetwork || 'pod'}
  vms:
${plan.vmIds.map(vmId => {
  const vm = getVirtualMachineById(vmId);
  return `    - name: ${vm?.name || vmId}`;
}).join('\n')}
status:
  conditions:
${plan.conditions.map(c => `    - type: ${c.type}
      status: ${c.status ? 'True' : 'False'}
      lastTransitionTime: ${c.updated}
      reason: ${c.reason}
      message: ${c.message}`).join('\n')}
  observedGeneration: 1`}
                </pre>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab eventKey={2} title={<TabTitleText>Virtual Machines</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
            <Card>
              <CardBody>
                <Table aria-label="Virtual machines table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Source cluster</Th>
                      <Th>Target cluster</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {plan.vmIds.map((vmId) => {
                      const vm = getVirtualMachineById(vmId);
                      if (!vm) return null;
                      
                      return (
                        <Tr key={vmId}>
                          <Td dataLabel="Name">{vm.name}</Td>
                          <Td dataLabel="Source cluster">{sourceCluster?.name || '-'}</Td>
                          <Td dataLabel="Target cluster">{targetCluster?.name || '-'}</Td>
                          <Td dataLabel="Status">
                            <Label color={vm.status === 'Running' ? 'green' : 'grey'}>
                              {vm.status}
                            </Label>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab eventKey={3} title={<TabTitleText>Resources</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
            <Card>
              <CardBody>
                <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  No resources information available
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab eventKey={4} title={<TabTitleText>Mappings</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
            <Card>
              <CardBody>
                <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  No mappings configured
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab eventKey={5} title={<TabTitleText>Hooks</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
            <Card>
              <CardBody>
                <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                  No hooks configured
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
      </div>
    </div>
  );
};

export { MigrationPlanDetail };

