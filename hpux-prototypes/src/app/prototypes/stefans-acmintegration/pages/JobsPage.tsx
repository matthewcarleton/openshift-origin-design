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
} from '@patternfly/react-core';
import { WizardTemplate } from '../components/WizardTemplate';
import {
  CaretDownIcon,
  FilterIcon,
  EllipsisVIcon,
  RedoIcon,
  BanIcon,
  DownloadIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

interface Job {
  id: number;
  name: string;
  template: string;
  type: 'Job template' | 'Workflow';
  status: 'Success' | 'Failed' | 'Running' | 'Pending';
  started: string;
  finished: string;
  duration: string;
  cluster: string;
  vm: string;
}

const JobsPage: React.FC = () => {
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

  // Job data based on the article workflow
  const allJobs: Job[] = [
    {
      id: 1,
      name: 'Create VM #1234',
      template: 'Create VM',
      type: 'Job template',
      status: 'Success',
      started: '2024-01-15 10:30:15',
      finished: '2024-01-15 10:32:45',
      duration: '2m 30s',
      cluster: 'us-west-prod-01',
      vm: 'webserver-vm-01',
    },
    {
      id: 2,
      name: 'Sync Inventory #1235',
      template: 'Sync Inventory',
      type: 'Job template',
      status: 'Success',
      started: '2024-01-15 10:33:00',
      finished: '2024-01-15 10:33:12',
      duration: '12s',
      cluster: 'us-west-prod-01',
      vm: 'webserver-vm-01',
    },
    {
      id: 3,
      name: 'Post-provisioning Tasks #1236',
      template: 'Post-provisioning Tasks',
      type: 'Job template',
      status: 'Success',
      started: '2024-01-15 10:35:00',
      finished: '2024-01-15 10:37:22',
      duration: '2m 22s',
      cluster: 'us-west-prod-01',
      vm: 'webserver-vm-01',
    },
    {
      id: 4,
      name: 'Create Network Resources #1237',
      template: 'Create Network Resources',
      type: 'Job template',
      status: 'Success',
      started: '2024-01-15 10:40:00',
      finished: '2024-01-15 10:40:18',
      duration: '18s',
      cluster: 'us-west-prod-01',
      vm: 'webserver-vm-01',
    },
    {
      id: 5,
      name: 'Create Webserver OCP Virt #1238',
      template: 'Create Webserver OCP Virt',
      type: 'Workflow',
      status: 'Success',
      started: '2024-01-15 10:45:00',
      finished: '2024-01-15 10:50:15',
      duration: '5m 15s',
      cluster: 'us-west-prod-01',
      vm: 'webserver-vm-01',
    },
    {
      id: 6,
      name: 'Create VM #1239',
      template: 'Create VM',
      type: 'Job template',
      status: 'Running',
      started: '2024-01-15 11:00:00',
      finished: '-',
      duration: '-',
      cluster: 'us-east-prod-02',
      vm: 'app-server-vm-01',
    },
    {
      id: 7,
      name: 'Post-provisioning Tasks #1240',
      template: 'Post-provisioning Tasks',
      type: 'Job template',
      status: 'Failed',
      started: '2024-01-15 09:15:00',
      finished: '2024-01-15 09:17:30',
      duration: '2m 30s',
      cluster: 'us-west-prod-01',
      vm: 'db-server-vm-02',
    },
  ];

  // Filter and search
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      if (searchValue && !job.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !job.template.toLowerCase().includes(searchValue.toLowerCase()) &&
          !job.vm.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredJobs.slice(start, end);
  }, [filteredJobs, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredJobs.map(j => j.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedJobs.forEach(j => newSelected.add(j.id));
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

  const isAllSelected = paginatedJobs.length > 0 && paginatedJobs.every(j => selectedItems.has(j.id));

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      'Success': 'success',
      'Failed': 'danger',
      'Running': 'warning',
      'Pending': 'info',
    };
    return <Badge isRead={false}>{status}</Badge>;
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/jobs')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/jobs')}>
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Jobs</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Jobs
        </Title>
        <Content>
          <p>View and manage Ansible job executions for VM automation across OpenShift clusters.</p>
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
                            id="bulk-select-checkbox-jobs"
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
                      Select page ({paginatedJobs.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredJobs.length} items)
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
                    <DropdownItem key="template">Template</DropdownItem>
                    <DropdownItem key="cluster">Cluster</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search jobs"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Primary Action Button */}
              <ToolbarItem>
                <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                  Run job
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredJobs.length}
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
          <Table aria-label="Jobs table">
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
                    isHeaderSelectDisabled: filteredJobs.length === 0,
                  }}
                />
                <Th>Name</Th>
                <Th>Template</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Cluster</Th>
                <Th>VM</Th>
                <Th>Started</Th>
                <Th>Duration</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedJobs.map((job) => (
                <Tr key={job.id}>
                  <Td
                    select={{
                      rowIndex: job.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(job.id, isSelecting),
                      isSelected: selectedItems.has(job.id),
                    }}
                  />
                  <Td dataLabel="Name">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/jobs/${job.id}`)}>
                      {job.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Template">{job.template}</Td>
                  <Td dataLabel="Type">{job.type}</Td>
                  <Td dataLabel="Status">{getStatusBadge(job.status)}</Td>
                  <Td dataLabel="Cluster">{job.cluster}</Td>
                  <Td dataLabel="VM">{job.vm}</Td>
                  <Td dataLabel="Started">{job.started}</Td>
                  <Td dataLabel="Duration">{job.duration}</Td>
                  <Td isActionCell>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Button variant="link" onClick={() => navigate(`/automation/jobs/${job.id}`)}>
                          View
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        <Dropdown
                          isOpen={openKebabId === job.id}
                          onSelect={() => setOpenKebabId(null)}
                          onOpenChange={(isOpen) => setOpenKebabId(isOpen ? job.id : null)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setOpenKebabId(openKebabId === job.id ? null : job.id)}
                              isExpanded={openKebabId === job.id}
                              variant="plain"
                              aria-label="Job actions"
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            <DropdownItem key="output" onClick={() => navigate(`/automation/jobs/${job.id}?tab=output`)}>
                              View output
                            </DropdownItem>
                            {job.status === 'Running' && (
                              <DropdownItem key="cancel" icon={<BanIcon />} onClick={() => console.log(`Cancel ${job.name}`)} isDanger>
                                Cancel job
                              </DropdownItem>
                            )}
                            <DropdownItem key="rerun" icon={<RedoIcon />} onClick={() => console.log(`Rerun ${job.name}`)}>
                              Rerun job
                            </DropdownItem>
                            <DropdownItem key="download" icon={<DownloadIcon />} onClick={() => console.log(`Download ${job.name}`)}>
                              Download artifacts
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
              itemCount={filteredJobs.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
      </div>

      {/* Run Job Wizard */}
      <WizardTemplate
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardData({});
        }}
        onFinish={(data) => {
          console.log('Job launched:', data);
          setIsWizardOpen(false);
          setWizardData({});
          // In a real app, navigate to the new job execution
        }}
        title="Run Job"
        description="Launch a job execution from an existing template or workflow."
        steps={[
          {
            number: 1,
            name: 'Select Template',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Select Template
                </Title>
                <Form>
                  <FormGroup label="Template" isRequired fieldId="template">
                    <Select
                      selected={wizardData.template || ''}
                      onSelect={(_event, value) => setWizardData({ ...wizardData, template: value })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {}}
                          isExpanded={false}
                          variant="default"
                        >
                          {wizardData.template || 'Select template'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="Create VM">Create VM</SelectOption>
                        <SelectOption value="Create Network Resources">Create Network Resources</SelectOption>
                        <SelectOption value="Create Webserver OCP Virt">Create Webserver OCP Virt</SelectOption>
                        <SelectOption value="VM Post-Provisioning">VM Post-Provisioning</SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>
                  <FormGroup label="Inventory" fieldId="inventory" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="inventory"
                      value={wizardData.inventory || 'KubeVirt Inventory'}
                      onChange={(_event, value) => setWizardData({ ...wizardData, inventory: value })}
                      placeholder="KubeVirt Inventory"
                      readOnly
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 2,
            name: 'Parameters',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Job Parameters
                </Title>
                <Form>
                  <FormGroup label="Job Name" isRequired fieldId="jobName">
                    <TextInput
                      id="jobName"
                      value={wizardData.jobName || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, jobName: value })}
                      placeholder="Enter job name (optional - auto-generated if empty)"
                    />
                  </FormGroup>
                  <FormGroup label="Extra Variables" fieldId="extraVars" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="extraVars"
                      value={wizardData.extraVars || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, extraVars: value })}
                      placeholder='{"key": "value"} (optional)'
                    />
                  </FormGroup>
                  <FormGroup label="Limit" fieldId="limit" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="limit"
                      value={wizardData.limit || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, limit: value })}
                      placeholder="Limit execution to specific hosts (optional)"
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
                  <p><strong>Template:</strong> {wizardData.template || 'Not specified'}</p>
                  <p><strong>Inventory:</strong> {wizardData.inventory || 'Not specified'}</p>
                  <p><strong>Job Name:</strong> {wizardData.jobName || 'Auto-generated'}</p>
                  {wizardData.extraVars && <p><strong>Extra Variables:</strong> {wizardData.extraVars}</p>}
                  {wizardData.limit && <p><strong>Limit:</strong> {wizardData.limit}</p>}
                </Content>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default JobsPage;

