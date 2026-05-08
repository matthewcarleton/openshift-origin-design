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
  Select,
  SelectOption,
  SelectList,
  TextArea,
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
  CodeIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

interface Rulebook {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Error';
  rules: number;
  eventSources: number;
  lastModified: string;
  createdBy: string;
  version: string;
}

const RulebooksPage: React.FC = () => {
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

  // Rulebook data
  const allRulebooks: Rulebook[] = [
    {
      id: 1,
      name: 'VM Lifecycle Events',
      description: 'Handles VM creation, deletion, and state change events. Triggers post-provisioning tasks and cleanup jobs.',
      status: 'Active',
      rules: 5,
      eventSources: 2,
      lastModified: '2024-01-15 14:30',
      createdBy: 'admin@example.com',
      version: '1.2.0',
    },
    {
      id: 2,
      name: 'Cluster Health Monitoring',
      description: 'Monitors cluster health metrics and triggers remediation actions when thresholds are exceeded.',
      status: 'Active',
      rules: 8,
      eventSources: 3,
      lastModified: '2024-01-14 10:15',
      createdBy: 'admin@example.com',
      version: '2.0.1',
    },
    {
      id: 3,
      name: 'Network Policy Violations',
      description: 'Detects network policy violations and automatically applies remediation rules.',
      status: 'Inactive',
      rules: 3,
      eventSources: 1,
      lastModified: '2024-01-10 09:20',
      createdBy: 'admin@example.com',
      version: '1.0.0',
    },
    {
      id: 4,
      name: 'Resource Quota Alerts',
      description: 'Monitors resource quota usage and triggers scaling actions when limits are approached.',
      status: 'Active',
      rules: 4,
      eventSources: 2,
      lastModified: '2024-01-12 16:45',
      createdBy: 'admin@example.com',
      version: '1.1.0',
    },
    {
      id: 5,
      name: 'Security Incident Response',
      description: 'Automated response to security incidents detected across managed clusters.',
      status: 'Error',
      rules: 6,
      eventSources: 4,
      lastModified: '2024-01-13 11:30',
      createdBy: 'admin@example.com',
      version: '1.3.0',
    },
  ];

  // Filter and search
  const filteredRulebooks = useMemo(() => {
    return allRulebooks.filter(rulebook => {
      if (searchValue && !rulebook.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !rulebook.description.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedRulebooks = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredRulebooks.slice(start, end);
  }, [filteredRulebooks, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredRulebooks.map(r => r.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedRulebooks.forEach(r => newSelected.add(r.id));
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

  const isAllSelected = paginatedRulebooks.length > 0 && paginatedRulebooks.every(r => selectedItems.has(r.id));

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning'> = {
      'Active': 'success',
      'Inactive': 'warning',
      'Error': 'danger',
    };
    return <Badge isRead={status === 'Inactive'}>{status}</Badge>;
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
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Rulebooks</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Rulebooks
        </Title>
        <Content>
          <p>Create and manage rulebooks that define event processing logic. Rulebooks contain rules that match events from event sources and trigger Ansible job templates to automate your infrastructure.</p>
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
                            id="bulk-select-checkbox-rulebooks"
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
                      Select page ({paginatedRulebooks.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredRulebooks.length} items)
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
                    <DropdownItem key="version">Version</DropdownItem>
                    <DropdownItem key="created-by">Created By</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search rulebooks"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Primary Action Button */}
              <ToolbarItem>
                <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                  Create rulebook
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredRulebooks.length}
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
          <Table aria-label="Rulebooks table">
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
                    isHeaderSelectDisabled: filteredRulebooks.length === 0,
                  }}
                />
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Rules</Th>
                <Th>Event Sources</Th>
                <Th>Version</Th>
                <Th>Last Modified</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedRulebooks.map((rulebook) => (
                <Tr key={rulebook.id}>
                  <Td
                    select={{
                      rowIndex: rulebook.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(rulebook.id, isSelecting),
                      isSelected: selectedItems.has(rulebook.id),
                    }}
                  />
                  <Td dataLabel="Name">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/rulebooks/${rulebook.id}`)}>
                      {rulebook.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Description">{rulebook.description}</Td>
                  <Td dataLabel="Status">{getStatusBadge(rulebook.status)}</Td>
                  <Td dataLabel="Rules">{rulebook.rules}</Td>
                  <Td dataLabel="Event Sources">{rulebook.eventSources}</Td>
                  <Td dataLabel="Version">{rulebook.version}</Td>
                  <Td dataLabel="Last Modified">{rulebook.lastModified}</Td>
                  <Td isActionCell>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Button variant="plain" icon={<PlayIcon />} onClick={() => console.log(`Activate ${rulebook.name}`)} aria-label="Activate rulebook">
                          {rulebook.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        <Dropdown
                          isOpen={openKebabId === rulebook.id}
                          onSelect={() => setOpenKebabId(null)}
                          onOpenChange={(isOpen) => setOpenKebabId(isOpen ? rulebook.id : null)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setOpenKebabId(openKebabId === rulebook.id ? null : rulebook.id)}
                              isExpanded={openKebabId === rulebook.id}
                              variant="plain"
                              aria-label="Rulebook actions"
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            <DropdownItem key="edit" icon={<PencilAltIcon />} onClick={() => console.log(`Edit ${rulebook.name}`)}>
                              Edit rulebook
                            </DropdownItem>
                            <DropdownItem key="view-yaml" icon={<CodeIcon />} onClick={() => navigate(`/automation/rulebooks/${rulebook.id}?tab=yaml`)}>
                              View YAML
                            </DropdownItem>
                            <DropdownItem key="copy" icon={<CopyIcon />} onClick={() => console.log(`Copy ${rulebook.name}`)}>
                              Copy rulebook
                            </DropdownItem>
                            <DropdownItem key="validate" onClick={() => console.log(`Validate ${rulebook.name}`)}>
                              Validate
                            </DropdownItem>
                            <DropdownItem key="delete" icon={<TrashIcon />} onClick={() => console.log(`Delete ${rulebook.name}`)} isDanger>
                              Delete rulebook
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
              itemCount={filteredRulebooks.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
      </div>

      {/* Create Rulebook Wizard */}
      <WizardTemplate
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardData({});
        }}
        onFinish={(data) => {
          console.log('Rulebook created:', data);
          setIsWizardOpen(false);
          setWizardData({});
        }}
        title="Create Rulebook"
        description="Create a new rulebook to define event processing logic and automation workflows."
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
                      placeholder="Enter rulebook name"
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
                  <FormGroup label="Decision Environment" isRequired fieldId="environment" style={{ marginTop: '16px' }}>
                    <Select
                      selected={wizardData.environment || ''}
                      onSelect={(_event, value) => setWizardData({ ...wizardData, environment: value })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {}}
                          isExpanded={false}
                          variant="default"
                        >
                          {wizardData.environment || 'Select decision environment'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="prod-env-01">prod-env-01</SelectOption>
                        <SelectOption value="dev-env-01">dev-env-01</SelectOption>
                        <SelectOption value="staging-env-01">staging-env-01</SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 2,
            name: 'YAML Content',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Rulebook YAML
                </Title>
                <Form>
                  <FormGroup label="YAML Content" isRequired fieldId="yaml">
                    <TextArea
                      id="yaml"
                      value={wizardData.yaml || `---
- name: ${wizardData.name || 'New Rulebook'}
  hosts: localhost
  gather_facts: false
  sources:
    - name: example_source
      type: webhook
  
  rules:
    - name: Example Rule
      condition:
        event:
          meta:
            source: "example_source"
      action:
        run_job_template:
          name: "Example Template"
`}
                      onChange={(_event, value) => setWizardData({ ...wizardData, yaml: value })}
                      placeholder="Enter rulebook YAML"
                      rows={15}
                      style={{ fontFamily: 'var(--pf-t--global--font--family--mono)', fontSize: '14px' }}
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
                  <p><strong>Decision Environment:</strong> {wizardData.environment || 'Not specified'}</p>
                </Content>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default RulebooksPage;

