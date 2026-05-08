import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Card,
  CardBody,
  Tabs,
  Tab,
  TabTitleText,
  Badge,
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  HelperText,
  HelperTextItem,
  Checkbox,
} from '@patternfly/react-core';
import {
  PlayIcon,
  PencilAltIcon,
  CopyIcon,
  TrashIcon,
  CalendarAltIcon,
  PlusIcon,
  EllipsisVIcon,
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
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { WizardTemplate } from '../components/WizardTemplate';

interface Hook {
  id: number;
  name: string;
  type: 'ServiceNow' | 'Webhook' | 'Slack' | 'Email' | 'Custom';
  trigger: 'Pre-job' | 'Post-job' | 'On-success' | 'On-failure';
  status: 'Active' | 'Inactive';
  description: string;
  configuration: Record<string, string>;
}

interface Template {
  id: number;
  name: string;
  type: 'Job template' | 'Workflow';
  description: string;
  lastRun: string;
  status: 'Success' | 'Failed' | 'Running' | 'Never run';
  inventory: string;
  playbook: string;
  created: string;
  modified: string;
  createdBy: string;
  variables: Record<string, string>;
  hooks?: Hook[];
  workflowSteps?: Array<{
    name: string;
    type: string;
    order: number;
  }>;
  // Additional fields for Details tab
  jobType?: string;
  project?: string;
  verbosity?: string;
  jobSlicing?: string;
  forks?: string;
  timeout?: string;
  credentials?: string[];
  organization?: string;
  executionEnvironment?: string;
  limit?: string;
  showChanges?: string;
  lastModified?: string;
}

const TemplateDetailPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | number>(0);
  const [isHookWizardOpen, setIsHookWizardOpen] = useState(false);
  const [hookWizardData, setHookWizardData] = useState<any>({});
  const [openKebabId, setOpenKebabId] = useState<number | null>(null);
  const [variablesView, setVariablesView] = useState<'yaml' | 'json'>('yaml');

  // Mock data - in real app, fetch based on templateId
  const templateData: Template = {
    id: parseInt(templateId || '1'),
    name: 'Configure VMs',
    type: 'Job template',
    description: 'Creates a project, VM, and injects SSH key via cloud-init. Waits for VM to be up and IP assigned.',
    lastRun: '2024-01-15 10:30',
    status: 'Success',
    inventory: 'Parasol Inventory',
    playbook: 'lamp_stack.yml',
    created: '4/16/2024, 1:30:02 PM',
    modified: '4/16/2024, 1:30:02 PM',
    createdBy: 'admin',
    variables: {
      'vm_name': 'webserver-vm-01',
      'vm_memory': '4Gi',
      'vm_cpu': '2',
      'project_name': 'webserver-project',
      'ssh_key': '${SSH_PUBLIC_KEY}',
    },
    // Additional fields for Details tab
    jobType: 'run',
    project: 'OpenShift Virtualization',
    verbosity: '0 (Normal)',
    jobSlicing: '1',
    forks: '0',
    timeout: '0',
    credentials: ['SSH: hypervisor key', 'Kubernetes Bearer Token'],
    organization: 'Default',
    executionEnvironment: 'Default Execution Environment',
    limit: '',
    showChanges: 'On',
    lastModified: '4/16/2024, 1:30:02 PM by admin',
    hooks: [
      {
        id: 1,
        name: 'Create ServiceNow Ticket',
        type: 'ServiceNow',
        trigger: 'Pre-job',
        status: 'Active',
        description: 'Creates a ServiceNow ticket before job execution',
        configuration: {
          instance: 'https://servicenow.example.com',
          table: 'incident',
          short_description: 'VM Provisioning: {{ vm_name }}',
        },
      },
      {
        id: 2,
        name: 'Update ServiceNow Ticket',
        type: 'ServiceNow',
        trigger: 'Post-job',
        status: 'Active',
        description: 'Updates ServiceNow ticket with job results',
        configuration: {
          instance: 'https://servicenow.example.com',
          update_fields: 'state,work_notes',
        },
      },
      {
        id: 3,
        name: 'Slack Notification',
        type: 'Slack',
        trigger: 'On-success',
        status: 'Active',
        description: 'Sends success notification to Slack channel',
        configuration: {
          channel: '#automation',
          webhook_url: 'https://hooks.slack.com/services/...',
        },
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      'Success': 'success',
      'Failed': 'danger',
      'Running': 'warning',
      'Never run': 'info',
    };
    return <Badge isRead={status === 'Never run'}>{status}</Badge>;
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/templates')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/templates')}>
            Templates
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Configure VMs</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Flex spaceItems={{ default: 'spaceItemsLg' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem grow={{ default: 'grow' }}>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
              Details
            </Title>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button variant="link" onClick={() => navigate('/automation/templates')}>
                  Back to Templates
                </Button>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </div>

      {/* Content Area */}
      <div className="template-page-content">
        <Card>
          <CardBody>
            <Tabs
              activeKey={activeTab}
              onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}
              aria-label="Template detail tabs"
            >
              <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <DescriptionList columnModifier={{ default: '3Col' }}>
                    {/* Left Column */}
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Inventory</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Button variant="link" isInline onClick={() => console.log('View inventory')}>
                          {templateData.inventory}
                        </Button>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Playbook</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.playbook}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Verbosity</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.verbosity || '0 (Normal)'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Job Slicing</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.jobSlicing || '1'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Credentials</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} wrap="wrap">
                          {templateData.credentials?.map((cred, idx) => (
                            <FlexItem key={idx}>
                              <Badge>{cred}</Badge>
                            </FlexItem>
                          ))}
                        </Flex>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Variables</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                          <FlexItem>
                            <Button variant={variablesView === 'yaml' ? 'primary' : 'secondary'} size="sm" onClick={() => setVariablesView('yaml')}>
                              YAML
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button variant={variablesView === 'json' ? 'primary' : 'secondary'} size="sm" onClick={() => setVariablesView('json')}>
                              JSON
                            </Button>
                          </FlexItem>
                        </Flex>
                        <TextArea
                          value={variablesView === 'yaml' 
                            ? Object.entries(templateData.variables).map(([k, v]) => `${k}: ${v}`).join('\n')
                            : JSON.stringify(templateData.variables, null, 2)
                          }
                          readOnly
                          rows={6}
                          style={{ fontFamily: 'var(--pf-t--global--font--family--mono)', fontSize: '12px' }}
                        />
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    {/* Middle Column */}
                    <DescriptionListGroup>
                      <DescriptionListTerm>Job Type</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.jobType || 'run'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Project</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Button variant="link" isInline onClick={() => console.log('View project')}>
                          {templateData.project || 'OpenShift Virtualization'}
                        </Button>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Forks</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.forks || '0'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Timeout</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.timeout || '0'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Created</DescriptionListTerm>
                      <DescriptionListDescription>
                        {templateData.created}
                        {templateData.createdBy && (
                          <> by <Button variant="link" isInline onClick={() => console.log('View user')}>{templateData.createdBy}</Button></>
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    {/* Right Column */}
                    <DescriptionListGroup>
                      <DescriptionListTerm>Organization</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.organization || '-'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Execution Environment</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.executionEnvironment || '-'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Limit</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.limit || '-'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Show Changes</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.showChanges || 'On'}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Last Modified</DescriptionListTerm>
                      <DescriptionListDescription>{templateData.lastModified || templateData.modified}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </div>
              </Tab>

              <Tab eventKey={1} title={<TabTitleText>Access</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Configure user and team access permissions for this template.</p>
                    <p style={{ color: 'var(--pf-v5-global--Color--200)', fontStyle: 'italic', marginTop: '16px' }}>
                      Access control configuration will be available here.
                    </p>
                  </Content>
                </div>
              </Tab>

              <Tab eventKey={2} title={<TabTitleText>Notifications</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Flex spaceItems={{ default: 'spaceItemsMd' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Content>
                        <p>Configure pre-job and post-job hooks to integrate with external systems like ServiceNow, Slack, or custom webhooks.</p>
                      </Content>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="primary" icon={<PlusIcon />} onClick={() => setIsHookWizardOpen(true)}>
                        Add hook
                      </Button>
                    </FlexItem>
                  </Flex>
                  
                  {templateData.hooks && templateData.hooks.length > 0 ? (
                    <Table aria-label="Hooks table">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Type</Th>
                          <Th>Trigger</Th>
                          <Th>Status</Th>
                          <Th>Description</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {templateData.hooks.map((hook) => (
                          <Tr key={hook.id}>
                            <Td dataLabel="Name">
                              <strong>{hook.name}</strong>
                            </Td>
                            <Td dataLabel="Type">
                              <Badge>{hook.type}</Badge>
                            </Td>
                            <Td dataLabel="Trigger">
                              <Badge isRead={hook.trigger === 'Pre-job'}>
                                {hook.trigger}
                              </Badge>
                            </Td>
                            <Td dataLabel="Status">
                              <Badge isRead={hook.status === 'Inactive'}>
                                {hook.status}
                              </Badge>
                            </Td>
                            <Td dataLabel="Description">{hook.description}</Td>
                            <Td isActionCell>
                              <Dropdown
                                isOpen={openKebabId === hook.id}
                                onSelect={() => setOpenKebabId(null)}
                                onOpenChange={(isOpen) => setOpenKebabId(isOpen ? hook.id : null)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setOpenKebabId(openKebabId === hook.id ? null : hook.id)}
                                    isExpanded={openKebabId === hook.id}
                                    variant="plain"
                                    aria-label="Actions"
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                                popperProps={{ position: 'right' }}
                              >
                                <DropdownList>
                                  <DropdownItem key="edit" icon={<PencilAltIcon />} onClick={() => console.log(`Edit ${hook.name}`)}>
                                    Edit
                                  </DropdownItem>
                                  <DropdownItem key="test" onClick={() => console.log(`Test ${hook.name}`)}>
                                    Test hook
                                  </DropdownItem>
                                  <DropdownItem key="toggle" onClick={() => console.log(`Toggle ${hook.name}`)}>
                                    {hook.status === 'Active' ? 'Deactivate' : 'Activate'}
                                  </DropdownItem>
                                  <DropdownItem key="delete" icon={<TrashIcon />} onClick={() => console.log(`Delete ${hook.name}`)} isDanger>
                                    Delete
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Content>
                      <p style={{ color: 'var(--pf-v5-global--Color--200)', fontStyle: 'italic' }}>
                        No hooks configured. Click "Add hook" to create pre-job or post-job integrations.
                      </p>
                    </Content>
                  )}
                </div>
              </Tab>

              <Tab eventKey={3} title={<TabTitleText>Schedules</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Configure scheduled job executions for this template.</p>
                    <p style={{ color: 'var(--pf-v5-global--Color--200)', fontStyle: 'italic', marginTop: '16px' }}>
                      Schedule configuration will be available here.
                    </p>
                  </Content>
                </div>
              </Tab>

              <Tab eventKey={4} title={<TabTitleText>Jobs</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Recent job executions for this template will appear here.</p>
                    <Button variant="link" onClick={() => navigate('/automation/jobs')}>
                      View all jobs →
                    </Button>
                  </Content>
                </div>
              </Tab>

              <Tab eventKey={5} title={<TabTitleText>Survey</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Configure survey questions to prompt for variables when launching this template.</p>
                    <p style={{ color: 'var(--pf-v5-global--Color--200)', fontStyle: 'italic', marginTop: '16px' }}>
                      Survey configuration will be available here.
                    </p>
                  </Content>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      {/* Add Hook Wizard */}
      <WizardTemplate
        isOpen={isHookWizardOpen}
        onClose={() => {
          setIsHookWizardOpen(false);
          setHookWizardData({});
        }}
        onFinish={(data) => {
          console.log('Hook created:', data);
          setIsHookWizardOpen(false);
          setHookWizardData({});
        }}
        title="Add Hook"
        description="Configure a pre-job or post-job hook to integrate with external systems like ServiceNow, Slack, or custom webhooks."
        steps={[
          {
            number: 1,
            name: 'Basic Information',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Basic Information
                </Title>
                <Form>
                  <FormGroup label="Name" isRequired fieldId="name">
                    <TextInput
                      id="name"
                      value={hookWizardData.name || ''}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, name: value })}
                      placeholder="Enter hook name"
                    />
                  </FormGroup>
                  <FormGroup label="Type" isRequired fieldId="type" style={{ marginTop: '16px' }}>
                    <Dropdown
                      isOpen={hookWizardData.typeDropdownOpen || false}
                      onSelect={(_event, value) => {
                        setHookWizardData({ ...hookWizardData, type: value as string, typeDropdownOpen: false });
                      }}
                      onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, typeDropdownOpen: isOpen })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setHookWizardData({ ...hookWizardData, typeDropdownOpen: !hookWizardData.typeDropdownOpen })}
                          isExpanded={hookWizardData.typeDropdownOpen || false}
                          variant="default"
                        >
                          {hookWizardData.type || 'Select hook type'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem value="ServiceNow">ServiceNow</DropdownItem>
                        <DropdownItem value="Webhook">Webhook</DropdownItem>
                        <DropdownItem value="Slack">Slack</DropdownItem>
                        <DropdownItem value="Email">Email</DropdownItem>
                        <DropdownItem value="Custom">Custom</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>
                  <FormGroup label="Trigger" isRequired fieldId="trigger" style={{ marginTop: '16px' }}>
                    <Dropdown
                      isOpen={hookWizardData.triggerDropdownOpen || false}
                      onSelect={(_event, value) => {
                        setHookWizardData({ ...hookWizardData, trigger: value as string, triggerDropdownOpen: false });
                      }}
                      onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, triggerDropdownOpen: isOpen })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setHookWizardData({ ...hookWizardData, triggerDropdownOpen: !hookWizardData.triggerDropdownOpen })}
                          isExpanded={hookWizardData.triggerDropdownOpen || false}
                          variant="default"
                        >
                          {hookWizardData.trigger || 'Select trigger'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem value="Pre-job">Pre-job (before job starts)</DropdownItem>
                        <DropdownItem value="Post-job">Post-job (after job completes)</DropdownItem>
                        <DropdownItem value="On-success">On-success (only if job succeeds)</DropdownItem>
                        <DropdownItem value="On-failure">On-failure (only if job fails)</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>
                  <FormGroup label="Description" fieldId="description" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="description"
                      value={hookWizardData.description || ''}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, description: value })}
                      placeholder="Enter description (optional)"
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 2,
            name: 'Configuration',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Configuration
                </Title>
                <Form>
                  {hookWizardData.type === 'ServiceNow' && (
                    <>
                      <FormGroup label="ServiceNow Instance URL" isRequired fieldId="instance">
                        <TextInput
                          id="instance"
                          value={hookWizardData.instance || ''}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, instance: value })}
                          placeholder="https://your-instance.service-now.com"
                        />
                      </FormGroup>
                      <FormGroup label="Table" isRequired fieldId="table" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.tableDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, table: value as string, tableDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, tableDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, tableDropdownOpen: !hookWizardData.tableDropdownOpen })}
                              isExpanded={hookWizardData.tableDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.table || 'Select table'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="incident">Incident</DropdownItem>
                            <DropdownItem value="change_request">Change Request</DropdownItem>
                            <DropdownItem value="task">Task</DropdownItem>
                            <DropdownItem value="problem">Problem</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                      {hookWizardData.trigger === 'Pre-job' && (
                        <FormGroup label="Short Description Template" fieldId="shortDescription" style={{ marginTop: '16px' }}>
                          <TextInput
                            id="shortDescription"
                            value={hookWizardData.shortDescription || 'Automation: {{ job_name }}'}
                            onChange={(_event, value) => setHookWizardData({ ...hookWizardData, shortDescription: value })}
                            placeholder="Use {{ variables }} for templating"
                          />
                        </FormGroup>
                      )}
                      {hookWizardData.trigger === 'Post-job' && (
                        <FormGroup label="Update Fields" fieldId="updateFields" style={{ marginTop: '16px' }}>
                          <TextInput
                            id="updateFields"
                            value={hookWizardData.updateFields || 'state,work_notes'}
                            onChange={(_event, value) => setHookWizardData({ ...hookWizardData, updateFields: value })}
                            placeholder="Comma-separated field names"
                          />
                        </FormGroup>
                      )}
                      <FormGroup label="Credentials" fieldId="credentials" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.credentialsDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, credentials: value as string, credentialsDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, credentialsDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, credentialsDropdownOpen: !hookWizardData.credentialsDropdownOpen })}
                              isExpanded={hookWizardData.credentialsDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.credentials || 'Select credentials (optional)'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="">None</DropdownItem>
                            <DropdownItem value="servicenow-credentials-01">servicenow-credentials-01</DropdownItem>
                            <DropdownItem value="servicenow-credentials-02">servicenow-credentials-02</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'Webhook' && (
                    <>
                      <FormGroup label="Webhook URL" isRequired fieldId="webhookUrl">
                        <TextInput
                          id="webhookUrl"
                          value={hookWizardData.webhookUrl || ''}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, webhookUrl: value })}
                          placeholder="https://example.com/webhook"
                        />
                      </FormGroup>
                      <FormGroup label="HTTP Method" fieldId="method" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.methodDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, method: value as string, methodDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, methodDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, methodDropdownOpen: !hookWizardData.methodDropdownOpen })}
                              isExpanded={hookWizardData.methodDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.method || 'POST'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="POST">POST</DropdownItem>
                            <DropdownItem value="PUT">PUT</DropdownItem>
                            <DropdownItem value="PATCH">PATCH</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'Slack' && (
                    <>
                      <FormGroup label="Slack Webhook URL" isRequired fieldId="slackWebhook">
                        <TextInput
                          id="slackWebhook"
                          value={hookWizardData.slackWebhook || ''}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, slackWebhook: value })}
                          placeholder="https://hooks.slack.com/services/..."
                        />
                      </FormGroup>
                      <FormGroup label="Channel" fieldId="channel" style={{ marginTop: '16px' }}>
                        <TextInput
                          id="channel"
                          value={hookWizardData.channel || ''}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, channel: value })}
                          placeholder="#automation"
                        />
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'Email' && (
                    <>
                      <FormGroup label="Recipients" isRequired fieldId="recipients">
                        <TextInput
                          id="recipients"
                          value={hookWizardData.recipients || ''}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, recipients: value })}
                          placeholder="user@example.com, team@example.com"
                        />
                      </FormGroup>
                      <FormGroup label="Subject Template" fieldId="subject" style={{ marginTop: '16px' }}>
                        <TextInput
                          id="subject"
                          value={hookWizardData.subject || 'Job {{ job_name }} - {{ status }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, subject: value })}
                          placeholder="Use {{ variables }} for templating"
                        />
                      </FormGroup>
                    </>
                  )}
                </Form>
              </div>
            ),
          },
          {
            number: 3,
            name: hookWizardData.type === 'ServiceNow' ? 'Ticket Fields' : hookWizardData.type === 'Webhook' ? 'Headers & Payload' : hookWizardData.type === 'Slack' ? 'Message Format' : hookWizardData.type === 'Email' ? 'Email Body' : 'Advanced',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  {hookWizardData.type === 'ServiceNow' ? 'Ticket Fields Configuration' : hookWizardData.type === 'Webhook' ? 'Headers & Payload' : hookWizardData.type === 'Slack' ? 'Message Formatting' : hookWizardData.type === 'Email' ? 'Email Body Template' : 'Advanced Settings'}
                </Title>
                <Form>
                  {hookWizardData.type === 'ServiceNow' && hookWizardData.trigger === 'Pre-job' && (
                    <>
                      <FormGroup label="Priority" fieldId="priority" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.priorityDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, priority: value as string, priorityDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, priorityDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, priorityDropdownOpen: !hookWizardData.priorityDropdownOpen })}
                              isExpanded={hookWizardData.priorityDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.priority || 'Select priority (optional)'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="">None</DropdownItem>
                            <DropdownItem value="1">1 - Critical</DropdownItem>
                            <DropdownItem value="2">2 - High</DropdownItem>
                            <DropdownItem value="3">3 - Medium</DropdownItem>
                            <DropdownItem value="4">4 - Low</DropdownItem>
                            <DropdownItem value="5">5 - Planning</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                      <FormGroup label="Category" fieldId="category" style={{ marginTop: '16px' }}>
                        <TextInput
                          id="category"
                          value={hookWizardData.category || ''}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, category: value })}
                          placeholder="e.g., Infrastructure, Application, Network"
                        />
                        <HelperText>
                          <HelperTextItem>Use template variables like {'{{ job_name }}'} or {'{{ vm_name }}'}</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                      <FormGroup label="Assignment Group" fieldId="assignmentGroup" style={{ marginTop: '16px' }}>
                        <TextInput
                          id="assignmentGroup"
                          value={hookWizardData.assignmentGroup || ''}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, assignmentGroup: value })}
                          placeholder="e.g., Infrastructure Team"
                        />
                      </FormGroup>
                      <FormGroup label="Impact" fieldId="impact" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.impactDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, impact: value as string, impactDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, impactDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, impactDropdownOpen: !hookWizardData.impactDropdownOpen })}
                              isExpanded={hookWizardData.impactDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.impact || 'Select impact (optional)'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="">None</DropdownItem>
                            <DropdownItem value="1">1 - High</DropdownItem>
                            <DropdownItem value="2">2 - Medium</DropdownItem>
                            <DropdownItem value="3">3 - Low</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                      <FormGroup label="Urgency" fieldId="urgency" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.urgencyDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, urgency: value as string, urgencyDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, urgencyDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, urgencyDropdownOpen: !hookWizardData.urgencyDropdownOpen })}
                              isExpanded={hookWizardData.urgencyDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.urgency || 'Select urgency (optional)'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="">None</DropdownItem>
                            <DropdownItem value="1">1 - High</DropdownItem>
                            <DropdownItem value="2">2 - Medium</DropdownItem>
                            <DropdownItem value="3">3 - Low</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                      <FormGroup label="Description Template" fieldId="descriptionTemplate" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="descriptionTemplate"
                          value={hookWizardData.descriptionTemplate || 'Automation job: {{ job_name }}\n\nTemplate: {{ template_name }}\n\nVariables:\n{{ variables }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, descriptionTemplate: value })}
                          rows={6}
                          placeholder="Use {{ variables }} for templating"
                        />
                        <HelperText>
                          <HelperTextItem>This will be the ticket description. Use template variables to include job details.</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'ServiceNow' && hookWizardData.trigger === 'Post-job' && (
                    <>
                      <FormGroup label="State Mapping" fieldId="stateMapping" style={{ marginTop: '16px' }}>
                        <Content>
                          <p style={{ marginBottom: '8px' }}>Map job status to ServiceNow state:</p>
                        </Content>
                        <FormGroup label="On Success" fieldId="stateSuccess" style={{ marginTop: '8px' }}>
                          <Dropdown
                            isOpen={hookWizardData.stateSuccessDropdownOpen || false}
                            onSelect={(_event, value) => {
                              setHookWizardData({ ...hookWizardData, stateSuccess: value as string, stateSuccessDropdownOpen: false });
                            }}
                            onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, stateSuccessDropdownOpen: isOpen })}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setHookWizardData({ ...hookWizardData, stateSuccessDropdownOpen: !hookWizardData.stateSuccessDropdownOpen })}
                                isExpanded={hookWizardData.stateSuccessDropdownOpen || false}
                                variant="default"
                              >
                                {hookWizardData.stateSuccess || 'Resolved'}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem value="Resolved">Resolved</DropdownItem>
                              <DropdownItem value="Closed">Closed</DropdownItem>
                              <DropdownItem value="In Progress">In Progress</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FormGroup>
                        <FormGroup label="On Failure" fieldId="stateFailure" style={{ marginTop: '8px' }}>
                          <Dropdown
                            isOpen={hookWizardData.stateFailureDropdownOpen || false}
                            onSelect={(_event, value) => {
                              setHookWizardData({ ...hookWizardData, stateFailure: value as string, stateFailureDropdownOpen: false });
                            }}
                            onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, stateFailureDropdownOpen: isOpen })}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setHookWizardData({ ...hookWizardData, stateFailureDropdownOpen: !hookWizardData.stateFailureDropdownOpen })}
                                isExpanded={hookWizardData.stateFailureDropdownOpen || false}
                                variant="default"
                              >
                                {hookWizardData.stateFailure || 'In Progress'}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem value="In Progress">In Progress</DropdownItem>
                              <DropdownItem value="On Hold">On Hold</DropdownItem>
                              <DropdownItem value="New">New</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FormGroup>
                      </FormGroup>
                      <FormGroup label="Work Notes Template" fieldId="workNotes" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="workNotes"
                          value={hookWizardData.workNotes || 'Job {{ job_name }} completed with status: {{ job_status }}\n\nDuration: {{ job_duration }}\n\n{{ job_output }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, workNotes: value })}
                          rows={6}
                          placeholder="Use {{ variables }} for templating"
                        />
                        <HelperText>
                          <HelperTextItem>This will be added to the ticket's work notes field.</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'Webhook' && (
                    <>
                      <FormGroup label="Custom Headers" fieldId="headers" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="headers"
                          value={hookWizardData.headers || 'Content-Type: application/json\nX-API-Key: {{ api_key }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, headers: value })}
                          rows={4}
                          placeholder="Header-Name: Header-Value&#10;One per line"
                        />
                        <HelperText>
                          <HelperTextItem>One header per line. Format: Header-Name: Header-Value</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                      <FormGroup label="Payload Template" fieldId="payload" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="payload"
                          value={hookWizardData.payload || JSON.stringify({ job_name: '{{ job_name }}', status: '{{ job_status }}', timestamp: '{{ job_timestamp }}' }, null, 2)}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, payload: value })}
                          rows={10}
                          placeholder="JSON payload template"
                        />
                        <HelperText>
                          <HelperTextItem>Use {'{{ variables }}'} for dynamic values. Must be valid JSON.</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                      <FormGroup label="Authentication" fieldId="webhookAuth" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.webhookAuthDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, webhookAuth: value as string, webhookAuthDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, webhookAuthDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, webhookAuthDropdownOpen: !hookWizardData.webhookAuthDropdownOpen })}
                              isExpanded={hookWizardData.webhookAuthDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.webhookAuth || 'None'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="">None</DropdownItem>
                            <DropdownItem value="bearer">Bearer Token</DropdownItem>
                            <DropdownItem value="basic">Basic Auth</DropdownItem>
                            <DropdownItem value="api-key">API Key</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                      {hookWizardData.webhookAuth && (
                        <FormGroup label="Auth Credentials" fieldId="webhookCredentials" style={{ marginTop: '16px' }}>
                          <Dropdown
                            isOpen={hookWizardData.webhookCredentialsDropdownOpen || false}
                            onSelect={(_event, value) => {
                              setHookWizardData({ ...hookWizardData, webhookCredentials: value as string, webhookCredentialsDropdownOpen: false });
                            }}
                            onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, webhookCredentialsDropdownOpen: isOpen })}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setHookWizardData({ ...hookWizardData, webhookCredentialsDropdownOpen: !hookWizardData.webhookCredentialsDropdownOpen })}
                                isExpanded={hookWizardData.webhookCredentialsDropdownOpen || false}
                                variant="default"
                              >
                                {hookWizardData.webhookCredentials || 'Select credentials'}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem value="webhook-credentials-01">webhook-credentials-01</DropdownItem>
                              <DropdownItem value="webhook-credentials-02">webhook-credentials-02</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FormGroup>
                      )}
                    </>
                  )}
                  {hookWizardData.type === 'Slack' && (
                    <>
                      <FormGroup label="Message Color" fieldId="slackColor" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.slackColorDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, slackColor: value as string, slackColorDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, slackColorDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, slackColorDropdownOpen: !hookWizardData.slackColorDropdownOpen })}
                              isExpanded={hookWizardData.slackColorDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.slackColor || 'Select color'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="good">Green (Success)</DropdownItem>
                            <DropdownItem value="warning">Yellow (Warning)</DropdownItem>
                            <DropdownItem value="danger">Red (Failure)</DropdownItem>
                            <DropdownItem value="">Default</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                      <FormGroup label="Message Template" fieldId="slackMessage" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="slackMessage"
                          value={hookWizardData.slackMessage || 'Job {{ job_name }} {{ job_status }}\n\nTemplate: {{ template_name }}\n\nDuration: {{ job_duration }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, slackMessage: value })}
                          rows={6}
                          placeholder="Use {{ variables }} for templating"
                        />
                        <HelperText>
                          <HelperTextItem>Main message text. Use Slack markdown formatting.</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                      <FormGroup label="Include Job Output" fieldId="slackIncludeOutput" style={{ marginTop: '16px' }}>
                        <Checkbox
                          id="slackIncludeOutput"
                          isChecked={hookWizardData.slackIncludeOutput || false}
                          onChange={(_event, checked) => setHookWizardData({ ...hookWizardData, slackIncludeOutput: checked })}
                          label="Include job output in attachment"
                        />
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'Email' && (
                    <>
                      <FormGroup label="Email Body Template" fieldId="emailBody" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="emailBody"
                          value={hookWizardData.emailBody || 'Job: {{ job_name }}\nStatus: {{ job_status }}\nTemplate: {{ template_name }}\n\nDuration: {{ job_duration }}\n\n{{ job_output }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, emailBody: value })}
                          rows={10}
                          placeholder="Use {{ variables }} for templating"
                        />
                        <HelperText>
                          <HelperTextItem>Email body content. Use {'{{ variables }}'} for dynamic values.</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                      <FormGroup label="Email Format" fieldId="emailFormat" style={{ marginTop: '16px' }}>
                        <Dropdown
                          isOpen={hookWizardData.emailFormatDropdownOpen || false}
                          onSelect={(_event, value) => {
                            setHookWizardData({ ...hookWizardData, emailFormat: value as string, emailFormatDropdownOpen: false });
                          }}
                          onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, emailFormatDropdownOpen: isOpen })}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setHookWizardData({ ...hookWizardData, emailFormatDropdownOpen: !hookWizardData.emailFormatDropdownOpen })}
                              isExpanded={hookWizardData.emailFormatDropdownOpen || false}
                              variant="default"
                            >
                              {hookWizardData.emailFormat || 'Plain Text'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="plain">Plain Text</DropdownItem>
                            <DropdownItem value="html">HTML</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FormGroup>
                      <FormGroup label="Include Job Output" fieldId="emailIncludeOutput" style={{ marginTop: '16px' }}>
                        <Checkbox
                          id="emailIncludeOutput"
                          isChecked={hookWizardData.emailIncludeOutput || false}
                          onChange={(_event, checked) => setHookWizardData({ ...hookWizardData, emailIncludeOutput: checked })}
                          label="Include job output as attachment"
                        />
                      </FormGroup>
                    </>
                  )}
                </Form>
              </div>
            ),
          },
          {
            number: 4,
            name: 'Conditions & Filters',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Conditions & Filters
                </Title>
                <Content>
                  <p style={{ marginBottom: '16px' }}>Configure when this hook should trigger. Leave empty to always trigger.</p>
                </Content>
                <Form>
                  <FormGroup label="Condition Expression" fieldId="condition" style={{ marginTop: '16px' }}>
                    <TextArea
                      id="condition"
                      value={hookWizardData.condition || ''}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, condition: value })}
                      rows={4}
                      placeholder="e.g., job_status == 'successful' AND job_duration > 300"
                    />
                    <HelperText>
                      <HelperTextItem>Optional: JavaScript expression. Hook only triggers if condition evaluates to true.</HelperTextItem>
                    </HelperText>
                  </FormGroup>
                  <FormGroup label="Filter by Job Template" fieldId="filterTemplate" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="filterTemplate"
                      value={hookWizardData.filterTemplate || ''}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, filterTemplate: value })}
                      placeholder="Leave empty for all templates, or specify template name"
                    />
                    <HelperText>
                      <HelperTextItem>Optional: Only trigger for specific job templates. Use comma-separated list for multiple.</HelperTextItem>
                    </HelperText>
                  </FormGroup>
                  <FormGroup label="Filter by Cluster" fieldId="filterCluster" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="filterCluster"
                      value={hookWizardData.filterCluster || ''}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, filterCluster: value })}
                      placeholder="Leave empty for all clusters, or specify cluster name"
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 5,
            name: 'Advanced Settings',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Advanced Settings
                </Title>
                <Form>
                  <FormGroup label="Timeout (seconds)" fieldId="timeout" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="timeout"
                      type="number"
                      value={hookWizardData.timeout || '30'}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, timeout: value })}
                      placeholder="30"
                    />
                    <HelperText>
                      <HelperTextItem>Maximum time to wait for hook execution (default: 30 seconds)</HelperTextItem>
                    </HelperText>
                  </FormGroup>
                  <FormGroup label="Retry Attempts" fieldId="retries" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="retries"
                      type="number"
                      value={hookWizardData.retries || '0'}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, retries: value })}
                      placeholder="0"
                    />
                    <HelperText>
                      <HelperTextItem>Number of retry attempts if hook fails (default: 0, no retries)</HelperTextItem>
                    </HelperText>
                  </FormGroup>
                  <FormGroup label="Retry Delay (seconds)" fieldId="retryDelay" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="retryDelay"
                      type="number"
                      value={hookWizardData.retryDelay || '5'}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, retryDelay: value })}
                      placeholder="5"
                    />
                    <HelperText>
                      <HelperTextItem>Delay between retry attempts (default: 5 seconds)</HelperTextItem>
                    </HelperText>
                  </FormGroup>
                  <FormGroup label="Error Handling" fieldId="errorHandling" style={{ marginTop: '16px' }}>
                    <Dropdown
                      isOpen={hookWizardData.errorHandlingDropdownOpen || false}
                      onSelect={(_event, value) => {
                        setHookWizardData({ ...hookWizardData, errorHandling: value as string, errorHandlingDropdownOpen: false });
                      }}
                      onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, errorHandlingDropdownOpen: isOpen })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setHookWizardData({ ...hookWizardData, errorHandlingDropdownOpen: !hookWizardData.errorHandlingDropdownOpen })}
                          isExpanded={hookWizardData.errorHandlingDropdownOpen || false}
                          variant="default"
                        >
                          {hookWizardData.errorHandling || 'Continue on error'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem value="continue">Continue on error (log and continue)</DropdownItem>
                        <DropdownItem value="fail">Fail job/rule on error</DropdownItem>
                        <DropdownItem value="warn">Warn and continue</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>
                  <FormGroup label="Enable Hook" fieldId="enabled" style={{ marginTop: '16px' }}>
                    <Checkbox
                      id="enabled"
                      isChecked={hookWizardData.enabled !== false}
                      onChange={(_event, checked) => setHookWizardData({ ...hookWizardData, enabled: checked })}
                      label="Enable this hook immediately after creation"
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 6,
            name: 'Review',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Review
                </Title>
                <Content>
                  <p><strong>Name:</strong> {hookWizardData.name || 'Not specified'}</p>
                  <p><strong>Type:</strong> {hookWizardData.type || 'Not specified'}</p>
                  <p><strong>Trigger:</strong> {hookWizardData.trigger || 'Not specified'}</p>
                  <p><strong>Description:</strong> {hookWizardData.description || 'Not specified'}</p>
                  {hookWizardData.instance && <p><strong>ServiceNow Instance:</strong> {hookWizardData.instance}</p>}
                  {hookWizardData.table && <p><strong>Table:</strong> {hookWizardData.table}</p>}
                  {hookWizardData.priority && <p><strong>Priority:</strong> {hookWizardData.priority}</p>}
                  {hookWizardData.category && <p><strong>Category:</strong> {hookWizardData.category}</p>}
                  {hookWizardData.webhookUrl && <p><strong>Webhook URL:</strong> {hookWizardData.webhookUrl}</p>}
                  {hookWizardData.method && <p><strong>HTTP Method:</strong> {hookWizardData.method}</p>}
                  {hookWizardData.slackWebhook && <p><strong>Slack Webhook:</strong> {hookWizardData.slackWebhook}</p>}
                  {hookWizardData.slackColor && <p><strong>Slack Color:</strong> {hookWizardData.slackColor}</p>}
                  {hookWizardData.recipients && <p><strong>Email Recipients:</strong> {hookWizardData.recipients}</p>}
                  {hookWizardData.emailFormat && <p><strong>Email Format:</strong> {hookWizardData.emailFormat}</p>}
                  {hookWizardData.condition && <p><strong>Condition:</strong> {hookWizardData.condition}</p>}
                  {hookWizardData.timeout && <p><strong>Timeout:</strong> {hookWizardData.timeout} seconds</p>}
                  {hookWizardData.retries && <p><strong>Retries:</strong> {hookWizardData.retries}</p>}
                  {hookWizardData.errorHandling && <p><strong>Error Handling:</strong> {hookWizardData.errorHandling}</p>}
                  <p><strong>Enabled:</strong> {hookWizardData.enabled !== false ? 'Yes' : 'No'}</p>
                </Content>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default TemplateDetailPage;

