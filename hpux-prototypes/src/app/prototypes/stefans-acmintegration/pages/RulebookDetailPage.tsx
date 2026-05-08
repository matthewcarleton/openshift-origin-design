import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';
import {
  PlayIcon,
  PauseIcon,
  PencilAltIcon,
  CopyIcon,
  TrashIcon,
  CheckIcon,
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
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Checkbox,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { WizardTemplate } from '../components/WizardTemplate';

interface Hook {
  id: number;
  name: string;
  type: 'ServiceNow' | 'Webhook' | 'Slack' | 'Email' | 'Custom';
  trigger: 'Pre-rule' | 'Post-rule' | 'On-success' | 'On-failure';
  status: 'Active' | 'Inactive';
  description: string;
  rule?: string; // Optional: specific rule this hook applies to
  configuration: Record<string, string>;
}

interface Rulebook {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Error';
  rules: number;
  eventSources: string[];
  lastModified: string;
  createdBy: string;
  version: string;
  yamlContent: string;
  hooks?: Hook[];
}

const RulebookDetailPage: React.FC = () => {
  const { rulebookId } = useParams<{ rulebookId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [yamlContent, setYamlContent] = useState('');
  const [isHookWizardOpen, setIsHookWizardOpen] = useState(false);
  const [hookWizardData, setHookWizardData] = useState<any>({});
  const [openKebabId, setOpenKebabId] = useState<number | null>(null);

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'yaml') {
      setActiveTab(1);
    } else if (tabParam === 'event-sources') {
      setActiveTab(2);
    } else if (tabParam === 'rules') {
      setActiveTab(3);
    }
  }, [searchParams]);

  // Mock data - in real app, fetch based on rulebookId
  const rulebookData: Rulebook = {
    id: parseInt(rulebookId || '1'),
    name: 'VM Post-Provisioning Automation',
    description: 'Automatically performs post-provisioning tasks and creates network resources when a VM is created',
    status: 'Active',
    rules: 2,
    eventSources: ['VM Creation Webhook', 'Ansible Automation Platform'],
    lastModified: '2024-01-15 14:30',
    createdBy: 'admin@example.com',
    version: '1.2.0',
    yamlContent: `---
- name: VM Post-Provisioning Automation
  hosts: localhost
  gather_facts: false
  sources:
    - name: vm_creation_webhook
      type: webhook
      source_url: "https://eda.example.com/webhooks/vm-creation"
  
  rules:
    - name: On VM Created
      condition:
        event:
          meta:
            source: "vm_creation_webhook"
          body:
            event_type: "vm.created"
      action:
        run_job_template:
          name: "Post-provisioning Tasks"
          organization: "Default"
          extra_vars:
            vm_name: "{{ event.body.vm_name }}"
            namespace: "{{ event.body.namespace }}"
            vm_ip: "{{ event.body.vm_ip }}"
      
    - name: On Post-Provisioning Complete
      condition:
        event:
          meta:
            source: "ansible_automation_platform"
          body:
            job_status: "successful"
            job_template: "Post-provisioning Tasks"
      action:
        run_job_template:
          name: "Create Network Resources"
          organization: "Default"
          extra_vars:
            vm_name: "{{ event.body.vm_name }}"
            namespace: "{{ event.body.namespace }}"
`,
    hooks: [
      {
        id: 1,
        name: 'Create ServiceNow Ticket',
        type: 'ServiceNow',
        trigger: 'Pre-rule',
        status: 'Active',
        description: 'Creates ServiceNow ticket when rule triggers',
        rule: 'On VM Created',
        configuration: {
          instance: 'https://servicenow.example.com',
          table: 'incident',
          short_description: 'VM Automation: {{ event.body.vm_name }}',
        },
      },
      {
        id: 2,
        name: 'Update ServiceNow Ticket',
        type: 'ServiceNow',
        trigger: 'Post-rule',
        status: 'Active',
        description: 'Updates ServiceNow ticket after rule completes',
        rule: 'On VM Created',
        configuration: {
          instance: 'https://servicenow.example.com',
          update_fields: 'state,work_notes',
        },
      },
    ],
  };

  useEffect(() => {
    setYamlContent(rulebookData.yamlContent);
  }, []);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning'> = {
      'Active': 'success',
      'Inactive': 'warning',
      'Error': 'danger',
    };
    return <Badge isRead={status === 'Inactive'}>{status}</Badge>;
  };

  const handleSave = () => {
    // In real app, save YAML content
    console.log('Saving rulebook YAML:', yamlContent);
    setIsEditing(false);
  };

  const handleValidate = () => {
    // In real app, validate YAML syntax
    console.log('Validating rulebook YAML');
    alert('Rulebook YAML is valid!');
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/rulebooks')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/rulebooks')}>
            Rulebooks
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{rulebookData.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Flex spaceItems={{ default: 'spaceItemsLg' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem grow={{ default: 'grow' }}>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
              {rulebookData.name}
            </Title>
            <Content>
              <p>{rulebookData.description}</p>
            </Content>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button
                  variant={rulebookData.status === 'Active' ? 'danger' : 'primary'}
                  icon={rulebookData.status === 'Active' ? <PauseIcon /> : <PlayIcon />}
                  onClick={() => console.log(`${rulebookData.status === 'Active' ? 'Deactivate' : 'Activate'} rulebook`)}
                >
                  {rulebookData.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              </FlexItem>
              <FlexItem>
                <Button variant="secondary" icon={<PencilAltIcon />} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel Edit' : 'Edit'}
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
              aria-label="Rulebook detail tabs"
            >
              <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <DescriptionList columnModifier={{ default: '2Col' }}>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>{rulebookData.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>{getStatusBadge(rulebookData.status)}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Version</DescriptionListTerm>
                      <DescriptionListDescription>{rulebookData.version}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Rules</DescriptionListTerm>
                      <DescriptionListDescription>{rulebookData.rules}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Event Sources</DescriptionListTerm>
                      <DescriptionListDescription>
                        {rulebookData.eventSources.map((source, idx) => (
                          <React.Fragment key={source}>
                            <Button
                              variant="link"
                              isInline
                              onClick={() => navigate(`/automation/events?tab=sources&name=${source}`)}
                            >
                              {source}
                            </Button>
                            {idx < rulebookData.eventSources.length - 1 && ', '}
                          </React.Fragment>
                        ))}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Last Modified</DescriptionListTerm>
                      <DescriptionListDescription>{rulebookData.lastModified}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Created By</DescriptionListTerm>
                      <DescriptionListDescription>{rulebookData.createdBy}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </div>
              </Tab>

              <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Button variant="secondary" icon={<CheckIcon />} onClick={handleValidate}>
                        Validate
                      </Button>
                    </FlexItem>
                    {isEditing && (
                      <FlexItem>
                        <Button variant="primary" onClick={handleSave}>
                          Save
                        </Button>
                      </FlexItem>
                    )}
                  </Flex>
                  <div style={{ border: '1px solid var(--pf-t--global--border--color--default)', borderRadius: '4px' }}>
                    {isEditing ? (
                      <textarea
                        value={yamlContent}
                        onChange={(e) => setYamlContent(e.target.value)}
                        style={{
                          width: '100%',
                          minHeight: '500px',
                          fontFamily: 'var(--pf-t--global--font--family--mono)',
                          fontSize: '14px',
                          padding: '16px',
                          border: 'none',
                          resize: 'vertical',
                        }}
                      />
                    ) : (
                      <CodeBlock>
                        <CodeBlockCode>{yamlContent}</CodeBlockCode>
                      </CodeBlock>
                    )}
                  </div>
                </div>
              </Tab>

              <Tab eventKey={2} title={<TabTitleText>Event Sources</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Button variant="primary" onClick={() => console.log('Add event source')}>
                        Add Event Source
                      </Button>
                    </FlexItem>
                  </Flex>
                  <DescriptionList>
                    {rulebookData.eventSources.map((source) => (
                      <DescriptionListGroup key={source}>
                        <DescriptionListTerm>
                          <Button
                            variant="link"
                            isInline
                            onClick={() => navigate(`/automation/event-sources?name=${source}`)}
                          >
                            {source}
                          </Button>
                        </DescriptionListTerm>
                        <DescriptionListDescription>
                          <Button variant="link" onClick={() => console.log(`Remove ${source}`)}>
                            Remove
                          </Button>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    ))}
                  </DescriptionList>
                </div>
              </Tab>

              <Tab eventKey={3} title={<TabTitleText>Rules</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Rules defined in this rulebook:</p>
                    <ul>
                      <li>
                        <strong>On VM Created</strong> - Triggers when a VM creation event is received
                        <Button variant="link" isInline onClick={() => navigate('/automation/rule-activations?rule=On VM Created')}>
                          View activation →
                        </Button>
                      </li>
                      <li>
                        <strong>On Post-Provisioning Complete</strong> - Triggers when post-provisioning job completes
                        <Button variant="link" isInline onClick={() => navigate('/automation/rule-activations?rule=On Post-Provisioning Complete')}>
                          View activation →
                        </Button>
                      </li>
                    </ul>
                  </Content>
                </div>
              </Tab>

              <Tab eventKey={4} title={<TabTitleText>Hooks</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Flex spaceItems={{ default: 'spaceItemsMd' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Content>
                        <p>Configure pre-rule and post-rule hooks to integrate with external systems like ServiceNow, Slack, or custom webhooks.</p>
                      </Content>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="primary" icon={<PlusIcon />} onClick={() => setIsHookWizardOpen(true)}>
                        Add hook
                      </Button>
                    </FlexItem>
                  </Flex>
                  
                  {rulebookData.hooks && rulebookData.hooks.length > 0 ? (
                    <Table aria-label="Hooks table">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Type</Th>
                          <Th>Trigger</Th>
                          <Th>Rule</Th>
                          <Th>Status</Th>
                          <Th>Description</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {rulebookData.hooks.map((hook) => (
                          <Tr key={hook.id}>
                            <Td dataLabel="Name">
                              <strong>{hook.name}</strong>
                            </Td>
                            <Td dataLabel="Type">
                              <Badge>{hook.type}</Badge>
                            </Td>
                            <Td dataLabel="Trigger">
                              <Badge isRead={hook.trigger === 'Pre-rule'}>
                                {hook.trigger}
                              </Badge>
                            </Td>
                            <Td dataLabel="Rule">{hook.rule || 'All rules'}</Td>
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
                        No hooks configured. Click "Add hook" to create pre-rule or post-rule integrations.
                      </p>
                    </Content>
                  )}
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
        description="Configure a pre-rule or post-rule hook to integrate with external systems like ServiceNow, Slack, or custom webhooks."
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
                        <DropdownItem value="Pre-rule">Pre-rule (before rule executes)</DropdownItem>
                        <DropdownItem value="Post-rule">Post-rule (after rule completes)</DropdownItem>
                        <DropdownItem value="On-success">On-success (only if rule succeeds)</DropdownItem>
                        <DropdownItem value="On-failure">On-failure (only if rule fails)</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>
                  <FormGroup label="Apply to Rule" fieldId="rule" style={{ marginTop: '16px' }}>
                    <Dropdown
                      isOpen={hookWizardData.ruleDropdownOpen || false}
                      onSelect={(_event, value) => {
                        setHookWizardData({ ...hookWizardData, rule: value as string, ruleDropdownOpen: false });
                      }}
                      onOpenChange={(isOpen: boolean) => setHookWizardData({ ...hookWizardData, ruleDropdownOpen: isOpen })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setHookWizardData({ ...hookWizardData, ruleDropdownOpen: !hookWizardData.ruleDropdownOpen })}
                          isExpanded={hookWizardData.ruleDropdownOpen || false}
                          variant="default"
                        >
                          {hookWizardData.rule || 'All rules'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem value="">All rules</DropdownItem>
                        <DropdownItem value="On VM Created">On VM Created</DropdownItem>
                        <DropdownItem value="On Post-Provisioning Complete">On Post-Provisioning Complete</DropdownItem>
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
                      {hookWizardData.trigger === 'Pre-rule' && (
                        <FormGroup label="Short Description Template" fieldId="shortDescription" style={{ marginTop: '16px' }}>
                          <TextInput
                            id="shortDescription"
                            value={hookWizardData.shortDescription || 'Automation: {{ event.body.vm_name }}'}
                            onChange={(_event, value) => setHookWizardData({ ...hookWizardData, shortDescription: value })}
                            placeholder="Use {{ variables }} for templating"
                          />
                        </FormGroup>
                      )}
                      {hookWizardData.trigger === 'Post-rule' && (
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
                          value={hookWizardData.subject || 'Rule {{ rule_name }} - {{ status }}'}
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
                  {hookWizardData.type === 'ServiceNow' && hookWizardData.trigger === 'Pre-rule' && (
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
                          <HelperTextItem>Use template variables like {'{{ event.body.vm_name }}'}</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                      <FormGroup label="Description Template" fieldId="descriptionTemplate" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="descriptionTemplate"
                          value={hookWizardData.descriptionTemplate || 'Automation rule: {{ rule_name }}\n\nEvent: {{ event.body }}\n\nVariables:\n{{ variables }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, descriptionTemplate: value })}
                          rows={6}
                          placeholder="Use {{ variables }} for templating"
                        />
                        <HelperText>
                          <HelperTextItem>This will be the ticket description. Use template variables to include event details.</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'ServiceNow' && hookWizardData.trigger === 'Post-rule' && (
                    <>
                      <FormGroup label="State Mapping" fieldId="stateMapping" style={{ marginTop: '16px' }}>
                        <Content>
                          <p style={{ marginBottom: '8px' }}>Map rule execution status to ServiceNow state:</p>
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
                          value={hookWizardData.workNotes || 'Rule {{ rule_name }} executed with status: {{ rule_status }}\n\nEvent processed: {{ event }}'}
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
                          value={hookWizardData.payload || JSON.stringify({ rule_name: '{{ rule_name }}', event: '{{ event }}', status: '{{ status }}' }, null, 2)}
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
                          value={hookWizardData.slackMessage || 'Rule {{ rule_name }} {{ status }}\n\nEvent: {{ event }}\n\nDuration: {{ duration }}'}
                          onChange={(_event, value) => setHookWizardData({ ...hookWizardData, slackMessage: value })}
                          rows={6}
                          placeholder="Use {{ variables }} for templating"
                        />
                        <HelperText>
                          <HelperTextItem>Main message text. Use Slack markdown formatting.</HelperTextItem>
                        </HelperText>
                      </FormGroup>
                      <FormGroup label="Include Event Details" fieldId="slackIncludeEvent" style={{ marginTop: '16px' }}>
                        <Checkbox
                          id="slackIncludeEvent"
                          isChecked={hookWizardData.slackIncludeEvent || false}
                          onChange={(_event, checked) => setHookWizardData({ ...hookWizardData, slackIncludeEvent: checked })}
                          label="Include event details in attachment"
                        />
                      </FormGroup>
                    </>
                  )}
                  {hookWizardData.type === 'Email' && (
                    <>
                      <FormGroup label="Email Body Template" fieldId="emailBody" style={{ marginTop: '16px' }}>
                        <TextArea
                          id="emailBody"
                          value={hookWizardData.emailBody || 'Rule: {{ rule_name }}\nStatus: {{ status }}\n\nEvent: {{ event }}\n\nDuration: {{ duration }}'}
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
                      <FormGroup label="Include Event Details" fieldId="emailIncludeEvent" style={{ marginTop: '16px' }}>
                        <Checkbox
                          id="emailIncludeEvent"
                          isChecked={hookWizardData.emailIncludeEvent || false}
                          onChange={(_event, checked) => setHookWizardData({ ...hookWizardData, emailIncludeEvent: checked })}
                          label="Include event details as attachment"
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
                      placeholder="e.g., event.body.event_type == 'vm.created' AND event.meta.source == 'webhook'"
                    />
                    <HelperText>
                      <HelperTextItem>Optional: JavaScript expression. Hook only triggers if condition evaluates to true.</HelperTextItem>
                    </HelperText>
                  </FormGroup>
                  <FormGroup label="Filter by Event Source" fieldId="filterEventSource" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="filterEventSource"
                      value={hookWizardData.filterEventSource || ''}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, filterEventSource: value })}
                      placeholder="Leave empty for all event sources, or specify event source name"
                    />
                    <HelperText>
                      <HelperTextItem>Optional: Only trigger for specific event sources. Use comma-separated list for multiple.</HelperTextItem>
                    </HelperText>
                  </FormGroup>
                  <FormGroup label="Filter by Event Type" fieldId="filterEventType" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="filterEventType"
                      value={hookWizardData.filterEventType || ''}
                      onChange={(_event, value) => setHookWizardData({ ...hookWizardData, filterEventType: value })}
                      placeholder="Leave empty for all event types, or specify event type"
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
                        <DropdownItem value="fail">Fail rule on error</DropdownItem>
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
                  <p><strong>Rule:</strong> {hookWizardData.rule || 'All rules'}</p>
                  <p><strong>Description:</strong> {hookWizardData.description || 'Not specified'}</p>
                  {hookWizardData.instance && <p><strong>ServiceNow Instance:</strong> {hookWizardData.instance}</p>}
                  {hookWizardData.table && <p><strong>Table:</strong> {hookWizardData.table}</p>}
                  {hookWizardData.priority && <p><strong>Priority:</strong> {hookWizardData.priority}</p>}
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

export default RulebookDetailPage;

