import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  SearchInput,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
  Flex,
  FlexItem,
  Pagination,
  PaginationVariant,
  Badge,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';
import { WizardTemplate } from '../components/WizardTemplate';
import {
  CaretDownIcon,
  FilterIcon,
  PlayIcon,
  EllipsisVIcon,
  PencilAltIcon,
  CopyIcon,
  TrashIcon,
  CalendarAltIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

interface Template {
  id: number;
  name: string;
  type: 'Job template' | 'Workflow';
  description: string;
  lastRun: string;
  status: 'Success' | 'Failed' | 'Running' | 'Never run';
  inventory: string;
}

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  // Toolbar state
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  
  // Kebab menu state
  const [openKebabId, setOpenKebabId] = useState<number | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardData, setWizardData] = useState<any>({});

  // Template data based on the article
  const allTemplates: Template[] = [
    {
      id: 1,
      name: 'Create VM',
      type: 'Job template',
      description: 'Creates a project, VM, and injects SSH key via cloud-init. Waits for VM to be up and IP assigned.',
      lastRun: '2024-01-15 10:30',
      status: 'Success',
      inventory: 'KubeVirt Inventory',
    },
    {
      id: 2,
      name: 'Post-provisioning Tasks',
      type: 'Job template',
      description: 'Connects to VM and installs httpd package, starts the service. Executes via container groups.',
      lastRun: '2024-01-15 10:35',
      status: 'Success',
      inventory: 'KubeVirt Inventory',
    },
    {
      id: 3,
      name: 'Create Network Resources',
      type: 'Job template',
      description: 'Creates service and route to expose web server running on VM to external clients.',
      lastRun: '2024-01-15 10:40',
      status: 'Success',
      inventory: 'KubeVirt Inventory',
    },
    {
      id: 4,
      name: 'Create Webserver OCP Virt',
      type: 'Workflow',
      description: 'Orchestrates VM creation, inventory sync, post-provisioning, and networking setup in sequence.',
      lastRun: '2024-01-15 10:45',
      status: 'Success',
      inventory: 'KubeVirt Inventory',
    },
    {
      id: 5,
      name: 'Sync Inventory',
      type: 'Job template',
      description: 'Syncs KubeVirt inventory to import newly created VMs into Ansible Automation Platform inventory.',
      lastRun: '2024-01-15 10:33',
      status: 'Success',
      inventory: 'KubeVirt Inventory',
    },
  ];

  // Filter and search
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      if (searchValue && !template.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !template.description.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedTemplates = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredTemplates.slice(start, end);
  }, [filteredTemplates, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredTemplates.map(t => t.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedTemplates.forEach(t => newSelected.add(t.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleSelectItem = (itemId: number, isSelecting: boolean) => {
    const newSelected = new Set(selectedItems);
    if (isSelecting) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const isAllSelected = paginatedTemplates.length > 0 && paginatedTemplates.every(t => selectedItems.has(t.id));

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
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Templates</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Templates
        </Title>
        <Content>
          <p>Manage Ansible job templates and workflows for automating VM Day-1 and Day-2 activities across OpenShift clusters.</p>
        </Content>
      </div>

      {/* Content Area */}
      <div className="template-page-content">
        <div className="table-content-card">
          {/* Toolbar */}
          <Toolbar>
            <ToolbarContent style={{ gap: '8px' }}>
              {/* Bulk Selector */}
              <ToolbarItem>
                <Dropdown
                  isOpen={isBulkSelectorOpen}
                  onSelect={() => setIsBulkSelectorOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsBulkSelectorOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => {
                        if (selectedItems.size > 0) {
                          handleDeselectAll();
                        } else {
                          setIsBulkSelectorOpen(!isBulkSelectorOpen);
                        }
                      }}
                      variant="plain"
                      style={{
                        border: '1px solid var(--pf-t--global--border--color--default)',
                        borderRadius: 'var(--pf-t--global--border--radius--small)',
                        padding: '6px 8px',
                        minWidth: 'auto',
                      }}
                    >
                      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Checkbox
                            id="bulk-select-checkbox"
                            isChecked={isAllSelected}
                            onChange={(event, checked) => {
                              event.stopPropagation();
                              if (checked) {
                                handleSelectAll();
                              } else {
                                handleDeselectAll();
                              }
                            }}
                            aria-label="Select all"
                          />
                        </FlexItem>
                        <FlexItem>
                          <CaretDownIcon />
                        </FlexItem>
                      </Flex>
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="select-page" onClick={handleSelectPage}>
                      Select page ({paginatedTemplates.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredTemplates.length} items)
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Filter Dropdown */}
              <ToolbarItem>
                <Dropdown
                  isOpen={isFilterOpen}
                  onSelect={() => setIsFilterOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsFilterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      isExpanded={isFilterOpen}
                      variant="default"
                    >
                      <FilterIcon /> Filter
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="type">Type</DropdownItem>
                    <DropdownItem key="status">Status</DropdownItem>
                    <DropdownItem key="inventory">Inventory</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search templates"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Primary Action Button */}
              <ToolbarItem>
                <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                  Create template
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredTemplates.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={onSetPage}
                  onPerPageSelect={onPerPageSelect}
                  variant={PaginationVariant.top}
                  isCompact
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          {/* Table */}
          <Table aria-label="Templates table">
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_event, isSelecting) => {
                      if (isSelecting) {
                        handleSelectAll();
                      } else {
                        handleDeselectAll();
                      }
                    },
                    isSelected: isAllSelected,
                    isHeaderSelectDisabled: filteredTemplates.length === 0,
                  }}
                />
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th>Inventory</Th>
                <Th>Last run</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedTemplates.map((template) => (
                <Tr key={template.id}>
                  <Td
                    select={{
                      rowIndex: template.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(template.id, isSelecting),
                      isSelected: selectedItems.has(template.id),
                    }}
                  />
                  <Td dataLabel="Name">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/templates/${template.id}`)}>
                      {template.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Type">{template.type}</Td>
                  <Td dataLabel="Description">{template.description}</Td>
                  <Td dataLabel="Inventory">{template.inventory}</Td>
                  <Td dataLabel="Last run">{template.lastRun}</Td>
                  <Td dataLabel="Status">{getStatusBadge(template.status)}</Td>
                  <Td isActionCell>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Button variant="plain" icon={<PlayIcon />} onClick={() => console.log(`Launch ${template.name}`)} aria-label="Launch template">
                          Launch
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        <Dropdown
                          isOpen={openKebabId === template.id}
                          onSelect={() => setOpenKebabId(null)}
                          onOpenChange={(isOpen) => setOpenKebabId(isOpen ? template.id : null)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setOpenKebabId(openKebabId === template.id ? null : template.id)}
                              isExpanded={openKebabId === template.id}
                              variant="plain"
                              aria-label="Template actions"
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            <DropdownItem key="edit" icon={<PencilAltIcon />} onClick={() => console.log(`Edit ${template.name}`)}>
                              Edit template
                            </DropdownItem>
                            <DropdownItem key="copy" icon={<CopyIcon />} onClick={() => console.log(`Copy ${template.name}`)}>
                              Copy template
                            </DropdownItem>
                            <DropdownItem key="schedule" icon={<CalendarAltIcon />} onClick={() => console.log(`Schedule ${template.name}`)}>
                              Schedule
                            </DropdownItem>
                            <DropdownItem key="jobs" onClick={() => navigate(`/automation/jobs?template=${template.id}`)}>
                              View jobs
                            </DropdownItem>
                            <DropdownItem key="delete" icon={<TrashIcon />} onClick={() => console.log(`Delete ${template.name}`)} isDanger>
                              Delete template
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FlexItem>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Pagination at bottom */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
            <Pagination
              itemCount={filteredTemplates.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
      </div>

      {/* Create Template Wizard */}
      <WizardTemplate
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardData({});
        }}
        onFinish={(data) => {
          console.log('Template created:', data);
          setIsWizardOpen(false);
          setWizardData({});
          // In a real app, refresh the table or navigate to the new template
        }}
        title="Create Template"
        description="Create a new Ansible job template or workflow for automating VM operations."
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
                      value={wizardData.name || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, name: value })}
                      placeholder="Enter template name"
                    />
                  </FormGroup>
                  <FormGroup label="Type" isRequired fieldId="type" style={{ marginTop: '16px' }}>
                    <Dropdown
                      isOpen={wizardData.typeDropdownOpen || false}
                      onSelect={(_event, value) => {
                        setWizardData({ ...wizardData, type: value as string, typeDropdownOpen: false });
                      }}
                      onOpenChange={(isOpen: boolean) => setWizardData({ ...wizardData, typeDropdownOpen: isOpen })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setWizardData({ ...wizardData, typeDropdownOpen: !wizardData.typeDropdownOpen })}
                          isExpanded={wizardData.typeDropdownOpen || false}
                          variant="default"
                        >
                          {wizardData.type || 'Select type'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem value="Job template">Job template</DropdownItem>
                        <DropdownItem value="Workflow">Workflow</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>
                  <FormGroup label="Description" fieldId="description" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="description"
                      value={wizardData.description || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, description: value })}
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
                  <FormGroup label="Inventory" isRequired fieldId="inventory">
                    <TextInput
                      id="inventory"
                      value={wizardData.inventory || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, inventory: value })}
                      placeholder="KubeVirt Inventory"
                    />
                  </FormGroup>
                  <FormGroup label="Playbook" fieldId="playbook" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="playbook"
                      value={wizardData.playbook || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, playbook: value })}
                      placeholder="playbook.yml (optional)"
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 3,
            name: 'Review',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Review
                </Title>
                <Content>
                  <p><strong>Name:</strong> {wizardData.name || 'Not specified'}</p>
                  <p><strong>Type:</strong> {wizardData.type || 'Not specified'}</p>
                  <p><strong>Description:</strong> {wizardData.description || 'Not specified'}</p>
                  <p><strong>Inventory:</strong> {wizardData.inventory || 'Not specified'}</p>
                  <p><strong>Playbook:</strong> {wizardData.playbook || 'Not specified'}</p>
                </Content>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default TemplatesPage;

