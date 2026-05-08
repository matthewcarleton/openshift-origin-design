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
  PencilAltIcon,
  CopyIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

interface EventSource {
  id: number;
  name: string;
  type: 'Webhook' | 'Kafka' | 'Database' | 'File' | 'Custom';
  description: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  eventsReceived: number;
  lastEvent: string;
  rulebooks: number;
  url?: string;
  topic?: string;
}

const EventSourcesPage: React.FC = () => {
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

  // Event source data
  const allEventSources: EventSource[] = [
    {
      id: 1,
      name: 'VM Webhook Endpoint',
      type: 'Webhook',
      description: 'Receives VM lifecycle events from OpenShift Virtualization',
      status: 'Connected',
      eventsReceived: 1247,
      lastEvent: '2024-01-15 15:30:22',
      rulebooks: 2,
      url: 'https://eda.example.com/webhooks/vm-events',
    },
    {
      id: 2,
      name: 'Cluster Metrics Kafka Topic',
      type: 'Kafka',
      description: 'Consumes cluster health metrics from Kafka broker',
      status: 'Connected',
      eventsReceived: 8934,
      lastEvent: '2024-01-15 15:30:15',
      rulebooks: 1,
      topic: 'cluster-metrics',
    },
    {
      id: 3,
      name: 'Database Change Trigger',
      type: 'Database',
      description: 'Monitors database changes for policy violations',
      status: 'Disconnected',
      eventsReceived: 0,
      lastEvent: 'Never',
      rulebooks: 1,
    },
    {
      id: 4,
      name: 'Security Events Webhook',
      type: 'Webhook',
      description: 'Receives security incident alerts from security tools',
      status: 'Connected',
      eventsReceived: 342,
      lastEvent: '2024-01-15 15:28:10',
      rulebooks: 1,
      url: 'https://eda.example.com/webhooks/security',
    },
    {
      id: 5,
      name: 'File Watcher - Config Changes',
      type: 'File',
      description: 'Monitors configuration file changes in shared storage',
      status: 'Error',
      eventsReceived: 156,
      lastEvent: '2024-01-15 14:20:05',
      rulebooks: 0,
    },
  ];

  // Filter and search
  const filteredEventSources = useMemo(() => {
    return allEventSources.filter(source => {
      if (searchValue && !source.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !source.description.toLowerCase().includes(searchValue.toLowerCase()) &&
          !source.type.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedEventSources = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredEventSources.slice(start, end);
  }, [filteredEventSources, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredEventSources.map(s => s.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedEventSources.forEach(s => newSelected.add(s.id));
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

  const isAllSelected = paginatedEventSources.length > 0 && paginatedEventSources.every(s => selectedItems.has(s.id));

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning'> = {
      'Connected': 'success',
      'Disconnected': 'warning',
      'Error': 'danger',
    };
    return <Badge isRead={status === 'Disconnected'}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Webhook':
        return <CheckCircleIcon />;
      case 'Kafka':
        return <CheckCircleIcon />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/event-sources')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/event-sources')}>
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Event Sources</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Event Sources
        </Title>
        <Content>
          <p>Configure and manage event sources that generate events to trigger rulebooks and automation workflows.</p>
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
                            id="bulk-select-checkbox-eventsources"
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
                      Select page ({paginatedEventSources.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredEventSources.length} items)
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
                    <DropdownItem key="rulebooks">Rulebooks</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search event sources"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Primary Action Button */}
              <ToolbarItem>
                <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                  Create event source
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredEventSources.length}
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
          <Table aria-label="Event sources table">
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
                    isHeaderSelectDisabled: filteredEventSources.length === 0,
                  }}
                />
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Events Received</Th>
                <Th>Last Event</Th>
                <Th>Rulebooks</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedEventSources.map((source) => (
                <Tr key={source.id}>
                  <Td
                    select={{
                      rowIndex: source.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(source.id, isSelecting),
                      isSelected: selectedItems.has(source.id),
                    }}
                  />
                  <Td dataLabel="Name">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/event-sources/${source.id}`)}>
                      {source.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Type">{source.type}</Td>
                  <Td dataLabel="Description">{source.description}</Td>
                  <Td dataLabel="Status">{getStatusBadge(source.status)}</Td>
                  <Td dataLabel="Events Received">{source.eventsReceived.toLocaleString()}</Td>
                  <Td dataLabel="Last Event">{source.lastEvent}</Td>
                  <Td dataLabel="Rulebooks">{source.rulebooks}</Td>
                  <Td isActionCell>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Button variant="plain" onClick={() => console.log(`Test ${source.name}`)}>
                          Test
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        <Dropdown
                          isOpen={openKebabId === source.id}
                          onSelect={() => setOpenKebabId(null)}
                          onOpenChange={(isOpen) => setOpenKebabId(isOpen ? source.id : null)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setOpenKebabId(openKebabId === source.id ? null : source.id)}
                              isExpanded={openKebabId === source.id}
                              variant="plain"
                              aria-label="Event source actions"
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            <DropdownItem key="edit" icon={<PencilAltIcon />} onClick={() => console.log(`Edit ${source.name}`)}>
                              Edit event source
                            </DropdownItem>
                            <DropdownItem key="copy" icon={<CopyIcon />} onClick={() => console.log(`Copy ${source.name}`)}>
                              Copy event source
                            </DropdownItem>
                            <DropdownItem key="view-events" onClick={() => navigate(`/automation/event-history?source=${source.id}`)}>
                              View events
                            </DropdownItem>
                            <DropdownItem key="delete" icon={<TrashIcon />} onClick={() => console.log(`Delete ${source.name}`)} isDanger>
                              Delete event source
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
              itemCount={filteredEventSources.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
      </div>

      {/* Create Event Source Wizard */}
      <WizardTemplate
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardData({});
        }}
        onFinish={(data) => {
          console.log('Event source created:', data);
          setIsWizardOpen(false);
          setWizardData({});
        }}
        title="Create Event Source"
        description="Configure a new event source to receive events from webhooks, Kafka, databases, or other sources."
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
                      placeholder="Enter event source name"
                    />
                  </FormGroup>
                  <FormGroup label="Type" isRequired fieldId="type" style={{ marginTop: '16px' }}>
                    <Select
                      selected={wizardData.type || ''}
                      onSelect={(_event, value) => setWizardData({ ...wizardData, type: value })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {}}
                          isExpanded={false}
                          variant="default"
                        >
                          {wizardData.type || 'Select type'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="Webhook">Webhook</SelectOption>
                        <SelectOption value="Kafka">Kafka</SelectOption>
                        <SelectOption value="Database">Database</SelectOption>
                        <SelectOption value="File">File</SelectOption>
                        <SelectOption value="Custom">Custom</SelectOption>
                      </SelectList>
                    </Select>
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
                  {wizardData.type === 'Webhook' && (
                    <FormGroup label="Webhook URL" isRequired fieldId="url">
                      <TextInput
                        id="url"
                        value={wizardData.url || ''}
                        onChange={(_event, value) => setWizardData({ ...wizardData, url: value })}
                        placeholder="https://eda.example.com/webhooks/..."
                      />
                    </FormGroup>
                  )}
                  {wizardData.type === 'Kafka' && (
                    <>
                      <FormGroup label="Kafka Topic" isRequired fieldId="topic">
                        <TextInput
                          id="topic"
                          value={wizardData.topic || ''}
                          onChange={(_event, value) => setWizardData({ ...wizardData, topic: value })}
                          placeholder="Enter Kafka topic name"
                        />
                      </FormGroup>
                      <FormGroup label="Broker URL" isRequired fieldId="broker" style={{ marginTop: '16px' }}>
                        <TextInput
                          id="broker"
                          value={wizardData.broker || ''}
                          onChange={(_event, value) => setWizardData({ ...wizardData, broker: value })}
                          placeholder="kafka://broker.example.com:9092"
                        />
                      </FormGroup>
                    </>
                  )}
                  {wizardData.type === 'Database' && (
                    <FormGroup label="Database Connection String" isRequired fieldId="connection">
                      <TextInput
                        id="connection"
                        value={wizardData.connection || ''}
                        onChange={(_event, value) => setWizardData({ ...wizardData, connection: value })}
                        placeholder="postgresql://user:pass@host:5432/db"
                      />
                    </FormGroup>
                  )}
                  <FormGroup label="Credentials" fieldId="credentials" style={{ marginTop: '16px' }}>
                    <Select
                      selected={wizardData.credentials || ''}
                      onSelect={(_event, value) => setWizardData({ ...wizardData, credentials: value })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {}}
                          isExpanded={false}
                          variant="default"
                        >
                          {wizardData.credentials || 'Select credentials (optional)'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="">None</SelectOption>
                        <SelectOption value="webhook-credentials-01">webhook-credentials-01</SelectOption>
                        <SelectOption value="kafka-credentials-01">kafka-credentials-01</SelectOption>
                      </SelectList>
                    </Select>
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
                  {wizardData.url && <p><strong>URL:</strong> {wizardData.url}</p>}
                  {wizardData.topic && <p><strong>Topic:</strong> {wizardData.topic}</p>}
                  {wizardData.broker && <p><strong>Broker:</strong> {wizardData.broker}</p>}
                  {wizardData.connection && <p><strong>Connection:</strong> {wizardData.connection}</p>}
                  {wizardData.credentials && <p><strong>Credentials:</strong> {wizardData.credentials}</p>}
                </Content>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default EventSourcesPage;

