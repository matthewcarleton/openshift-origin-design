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
  TextArea,
} from '@patternfly/react-core';
import { WizardTemplate } from '../components/WizardTemplate';
import {
  CaretDownIcon,
  FilterIcon,
  EllipsisVIcon,
  PencilAltIcon,
  TrashIcon,
  ServerIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

interface DecisionEnvironment {
  id: number;
  name: string;
  description: string;
  status: 'Running' | 'Stopped' | 'Error';
  rulebooks: number;
  activeRules: number;
  cpu: string;
  memory: string;
  pods: number;
  lastActivity: string;
}

const DecisionEnvironmentsPage: React.FC = () => {
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

  // Decision environment data
  const allEnvironments: DecisionEnvironment[] = [
    {
      id: 1,
      name: 'prod-env-01',
      description: 'Production decision environment for critical automation workflows',
      status: 'Running',
      rulebooks: 3,
      activeRules: 8,
      cpu: '4 cores',
      memory: '8Gi',
      pods: 2,
      lastActivity: '2024-01-15 15:30:22',
    },
    {
      id: 2,
      name: 'dev-env-01',
      description: 'Development decision environment for testing rulebooks',
      status: 'Running',
      rulebooks: 2,
      activeRules: 3,
      cpu: '2 cores',
      memory: '4Gi',
      pods: 1,
      lastActivity: '2024-01-15 14:20:15',
    },
    {
      id: 3,
      name: 'staging-env-01',
      description: 'Staging decision environment for pre-production testing',
      status: 'Stopped',
      rulebooks: 1,
      activeRules: 0,
      cpu: '2 cores',
      memory: '4Gi',
      pods: 0,
      lastActivity: '2024-01-14 10:15:30',
    },
  ];

  // Filter and search
  const filteredEnvironments = useMemo(() => {
    return allEnvironments.filter(env => {
      if (searchValue && !env.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !env.description.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedEnvironments = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredEnvironments.slice(start, end);
  }, [filteredEnvironments, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredEnvironments.map(e => e.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedEnvironments.forEach(e => newSelected.add(e.id));
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

  const isAllSelected = paginatedEnvironments.length > 0 && paginatedEnvironments.every(e => selectedItems.has(e.id));

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning'> = {
      'Running': 'success',
      'Stopped': 'warning',
      'Error': 'danger',
    };
    return <Badge isRead={status === 'Stopped'}>{status}</Badge>;
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/decision-environments')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/decision-environments')}>
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Decision Environments</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Decision Environments
        </Title>
        <Content>
          <p>Manage runtime environments that execute rulebooks and process events in Event-Driven Ansible.</p>
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
                            id="bulk-select-checkbox-environments"
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
                      Select page ({paginatedEnvironments.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredEnvironments.length} items)
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
                    <DropdownItem key="status">Status</DropdownItem>
                    <DropdownItem key="rulebooks">Rulebooks</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search decision environments"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Primary Action Button */}
              <ToolbarItem>
                <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                  Create decision environment
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredEnvironments.length}
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
          <Table aria-label="Decision environments table">
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
                    isHeaderSelectDisabled: filteredEnvironments.length === 0,
                  }}
                />
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Rulebooks</Th>
                <Th>Active Rules</Th>
                <Th>Resources</Th>
                <Th>Pods</Th>
                <Th>Last Activity</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedEnvironments.map((env) => (
                <Tr key={env.id}>
                  <Td
                    select={{
                      rowIndex: env.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(env.id, isSelecting),
                      isSelected: selectedItems.has(env.id),
                    }}
                  />
                  <Td dataLabel="Name">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/decision-environments/${env.id}`)}>
                      {env.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Description">{env.description}</Td>
                  <Td dataLabel="Status">{getStatusBadge(env.status)}</Td>
                  <Td dataLabel="Rulebooks">{env.rulebooks}</Td>
                  <Td dataLabel="Active Rules">{env.activeRules}</Td>
                  <Td dataLabel="Resources">{env.cpu} / {env.memory}</Td>
                  <Td dataLabel="Pods">{env.pods}</Td>
                  <Td dataLabel="Last Activity">{env.lastActivity}</Td>
                  <Td isActionCell>
                    <Dropdown
                      isOpen={openKebabId === env.id}
                      onSelect={() => setOpenKebabId(null)}
                      onOpenChange={(isOpen) => setOpenKebabId(isOpen ? env.id : null)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setOpenKebabId(openKebabId === env.id ? null : env.id)}
                          isExpanded={openKebabId === env.id}
                          variant="plain"
                          aria-label="Environment actions"
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                      popperProps={{ position: 'right' }}
                    >
                      <DropdownList>
                        <DropdownItem key="edit" icon={<PencilAltIcon />} onClick={() => console.log(`Edit ${env.name}`)}>
                          Edit environment
                        </DropdownItem>
                        <DropdownItem key="logs" icon={<ServerIcon />} onClick={() => navigate(`/automation/decision-environments/${env.id}?tab=logs`)}>
                          View logs
                        </DropdownItem>
                        <DropdownItem key="delete" icon={<TrashIcon />} onClick={() => console.log(`Delete ${env.name}`)} isDanger>
                          Delete environment
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Pagination at bottom */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
            <Pagination
              itemCount={filteredEnvironments.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
      </div>

      {/* Create Decision Environment Wizard */}
      <WizardTemplate
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardData({});
        }}
        onFinish={(data) => {
          console.log('Decision environment created:', data);
          setIsWizardOpen(false);
          setWizardData({});
        }}
        title="Create Decision Environment"
        description="Create a new decision environment to execute rulebooks and process events."
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
                      placeholder="Enter environment name (e.g., prod-env-01)"
                    />
                  </FormGroup>
                  <FormGroup label="Description" fieldId="description" style={{ marginTop: '16px' }}>
                    <TextArea
                      id="description"
                      value={wizardData.description || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, description: value })}
                      placeholder="Enter description (optional)"
                      rows={4}
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 2,
            name: 'Resource Allocation',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Resource Allocation
                </Title>
                <Form>
                  <FormGroup label="CPU Cores" isRequired fieldId="cpu">
                    <TextInput
                      id="cpu"
                      type="number"
                      value={wizardData.cpu || '2'}
                      onChange={(_event, value) => setWizardData({ ...wizardData, cpu: value })}
                      placeholder="2"
                    />
                  </FormGroup>
                  <FormGroup label="Memory" isRequired fieldId="memory" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="memory"
                      value={wizardData.memory || '4Gi'}
                      onChange={(_event, value) => setWizardData({ ...wizardData, memory: value })}
                      placeholder="4Gi"
                    />
                  </FormGroup>
                  <FormGroup label="Max Pods" fieldId="maxPods" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="maxPods"
                      type="number"
                      value={wizardData.maxPods || '5'}
                      onChange={(_event, value) => setWizardData({ ...wizardData, maxPods: value })}
                      placeholder="5"
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
                  <p><strong>Description:</strong> {wizardData.description || 'Not specified'}</p>
                  <p><strong>CPU:</strong> {wizardData.cpu || 'Not specified'} cores</p>
                  <p><strong>Memory:</strong> {wizardData.memory || 'Not specified'}</p>
                  <p><strong>Max Pods:</strong> {wizardData.maxPods || 'Not specified'}</p>
                </Content>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default DecisionEnvironmentsPage;

