import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  CodeBlock,
  CodeBlockCode,
  Card,
  CardBody,
  Tabs,
  Tab,
  TabTitleText,
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
  PlayIcon,
  PauseIcon,
  SyncAltIcon,
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

interface StreamEvent {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  status: 'Processed' | 'Failed' | 'Pending';
  payload: any;
  rulebook?: string;
  rule?: string;
}

interface HistoryEvent {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  status: 'Processed' | 'Failed' | 'Pending';
  rulebook?: string;
  rule?: string;
  jobId?: number;
}

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | number>(0);

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'stream') {
      setActiveTab(1);
    } else if (tabParam === 'history') {
      setActiveTab(2);
    } else if (tabParam === 'sources') {
      setActiveTab(0);
    } else {
      // Default to Sources tab if no tab specified
      setActiveTab(0);
    }
  }, [searchParams]);

  // ========== EVENT SOURCES TAB ==========
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [openKebabId, setOpenKebabId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardData, setWizardData] = useState<any>({});
  
  // Shared search value for Stream and History tabs
  const [streamSearchValue, setStreamSearchValue] = useState('');
  const [historySearchValue, setHistorySearchValue] = useState('');

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
      description: 'Receives security incident events',
      status: 'Connected',
      eventsReceived: 342,
      lastEvent: '2024-01-15 15:25:05',
      rulebooks: 1,
      url: 'https://eda.example.com/webhooks/security',
    },
  ];

  const filteredEventSources = useMemo(() => {
    return allEventSources.filter((source) => {
      if (searchValue && !source.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          !source.description.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  const paginatedEventSources = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredEventSources.slice(start, end);
  }, [filteredEventSources, page, perPage]);

  // ========== EVENT STREAM TAB ==========
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const streamEvents: StreamEvent[] = [
    {
      id: 'evt-live-001',
      timestamp: '2024-01-15 15:30:22',
      source: 'VM Creation Webhook',
      type: 'vm.created',
      status: 'Processed',
      payload: { vm_name: 'webserver-vm-01', namespace: 'default' },
      rulebook: 'VM Post-Provisioning Automation',
      rule: 'On VM Created',
    },
    {
      id: 'evt-live-002',
      timestamp: '2024-01-15 15:30:20',
      source: 'Cluster Metrics Kafka Topic',
      type: 'cluster.health.warning',
      status: 'Processed',
      payload: { cluster: 'us-west-prod-01', cpu_usage: 85 },
      rulebook: 'Cluster Health Monitoring',
    },
  ];

  const filteredStreamEvents = useMemo(() => {
    return streamEvents.filter((event) => {
      if (selectedSource && event.source !== selectedSource) return false;
      if (streamSearchValue && !event.type.toLowerCase().includes(streamSearchValue.toLowerCase()) &&
          !event.source.toLowerCase().includes(streamSearchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [selectedSource, streamSearchValue]);

  // ========== EVENT HISTORY TAB ==========
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const allHistoryEvents: HistoryEvent[] = [
    {
      id: 'evt-001',
      timestamp: '2024-01-15 15:30:22',
      source: 'VM Creation Webhook',
      type: 'vm.created',
      status: 'Processed',
      rulebook: 'VM Post-Provisioning Automation',
      rule: 'On VM Created',
      jobId: 1234,
    },
    {
      id: 'evt-002',
      timestamp: '2024-01-15 15:30:25',
      source: 'Ansible Automation Platform',
      type: 'job.completed',
      status: 'Processed',
      rulebook: 'VM Post-Provisioning Automation',
      rule: 'On Post-Provisioning Complete',
      jobId: 1235,
    },
    {
      id: 'evt-003',
      timestamp: '2024-01-15 15:28:10',
      source: 'Cluster Metrics Kafka Topic',
      type: 'cluster.health.warning',
      status: 'Processed',
      rulebook: 'Cluster Health Monitoring',
      rule: 'On Health Threshold',
    },
    {
      id: 'evt-004',
      timestamp: '2024-01-15 15:25:05',
      source: 'Security Events Webhook',
      type: 'security.incident',
      status: 'Failed',
      rulebook: 'Security Incident Response',
      rule: 'On Security Incident',
    },
    {
      id: 'evt-005',
      timestamp: '2024-01-15 15:20:15',
      source: 'VM Creation Webhook',
      type: 'vm.created',
      status: 'Processed',
      rulebook: 'VM Post-Provisioning Automation',
      rule: 'On VM Created',
      jobId: 1233,
    },
  ];

  const filteredHistoryEvents = useMemo(() => {
    return allHistoryEvents.filter((event) => {
      if (statusFilter && event.status !== statusFilter) return false;
      if (typeFilter && event.type !== typeFilter) return false;
      if (historySearchValue && !event.type.toLowerCase().includes(historySearchValue.toLowerCase()) &&
          !event.source.toLowerCase().includes(historySearchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [statusFilter, typeFilter, historySearchValue]);

  const paginatedHistoryEvents = useMemo(() => {
    const start = (historyPage - 1) * historyPerPage;
    const end = start + historyPerPage;
    return filteredHistoryEvents.slice(start, end);
  }, [filteredHistoryEvents, historyPage, historyPerPage]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      'Connected': 'success',
      'Disconnected': 'warning',
      'Error': 'danger',
      'Processed': 'success',
      'Failed': 'danger',
      'Pending': 'warning',
    };
    return <Badge isRead={status === 'Disconnected' || status === 'Pending'}>{status}</Badge>;
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/events')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/events')}>
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Events</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Events
        </Title>
        <Content>
          <p>Configure event sources, monitor real-time event streams, and review historical event logs for your automation workflows.</p>
        </Content>
        <div style={{ marginTop: '24px' }}>
          <Tabs
            activeKey={activeTab}
            onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}
            aria-label="Events tabs"
          >
              {/* Sources Tab */}
              <Tab eventKey={0} title={<TabTitleText>Sources</TabTitleText>} />
              {/* Stream Tab */}
              <Tab eventKey={1} title={<TabTitleText>Stream</TabTitleText>} />
              {/* History Tab */}
              <Tab eventKey={2} title={<TabTitleText>History</TabTitleText>} />
            </Tabs>
          </div>
      </div>

      {/* Content Area */}
      <div className="template-page-content">
        {activeTab === 0 && (
          <div style={{ padding: '24px 0' }}>
            <div className="table-content-card">
                    {/* Toolbar */}
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isBulkSelectorOpen}
                            onSelect={() => setIsBulkSelectorOpen(false)}
                            onOpenChange={(isOpen) => setIsBulkSelectorOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => {
                                  if (selectedItems.size > 0) {
                                    setSelectedItems(new Set());
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
                                      isChecked={selectedItems.size === filteredEventSources.length && filteredEventSources.length > 0}
                                      onChange={(event, checked) => {
                                        event.stopPropagation();
                                        if (checked) {
                                          setSelectedItems(new Set(filteredEventSources.map(s => s.id)));
                                        } else {
                                          setSelectedItems(new Set());
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
                            popperProps={{ position: 'left' }}
                          >
                            <DropdownList>
                              <DropdownItem key="select-all" onClick={() => setSelectedItems(new Set(filteredEventSources.map(s => s.id)))}>
                                Select all
                              </DropdownItem>
                              <DropdownItem key="select-none" onClick={() => setSelectedItems(new Set())}>
                                Select none
                              </DropdownItem>
                              <DropdownItem key="select-page" onClick={() => {
                                const newSelected = new Set(selectedItems);
                                paginatedEventSources.forEach(s => newSelected.add(s.id));
                                setSelectedItems(newSelected);
                              }}>
                                Select page
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isFilterOpen}
                            onSelect={() => setIsFilterOpen(false)}
                            onOpenChange={(isOpen) => setIsFilterOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                variant="default"
                              >
                                <FilterIcon /> Filter
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem key="all">All types</DropdownItem>
                              <DropdownItem key="webhook">Webhook</DropdownItem>
                              <DropdownItem key="kafka">Kafka</DropdownItem>
                              <DropdownItem key="database">Database</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Search event sources"
                            value={searchValue}
                            onChange={(_event, value) => setSearchValue(value)}
                            onClear={() => setSearchValue('')}
                          />
                        </ToolbarItem>
                        <ToolbarItem align={{ default: 'alignEnd' }}>
                          <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                            Create event source
                          </Button>
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>

                    {/* Pagination at top */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0' }}>
                      <Pagination
                        itemCount={filteredEventSources.length}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_event, newPage) => setPage(newPage)}
                        onPerPageSelect={(_event, newPerPage) => {
                          setPerPage(newPerPage);
                          setPage(1);
                        }}
                        variant={PaginationVariant.top}
                        perPageOptions={[
                          { title: '10', value: 10 },
                          { title: '20', value: 20 },
                          { title: '50', value: 50 },
                        ]}
                      />
                    </div>

                    {/* Table */}
                    <Table aria-label="Event sources table">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Type</Th>
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
                            <Td dataLabel="Name">
                              <Button
                                variant="link"
                                isInline
                                onClick={() => navigate(`/automation/event-sources/${source.id}`)}
                              >
                                {source.name}
                              </Button>
                            </Td>
                            <Td dataLabel="Type">
                              <Badge>{source.type}</Badge>
                            </Td>
                            <Td dataLabel="Status">
                              {getStatusBadge(source.status)}
                            </Td>
                            <Td dataLabel="Events Received">{source.eventsReceived.toLocaleString()}</Td>
                            <Td dataLabel="Last Event">{source.lastEvent}</Td>
                            <Td dataLabel="Rulebooks">{source.rulebooks}</Td>
                            <Td isActionCell>
                              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
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
                                        aria-label="Actions"
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
                                      <DropdownItem key="view-events" onClick={() => {
                                        setActiveTab(2);
                                        navigate(`/automation/events?tab=history&source=${source.id}`);
                                      }}>
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
                        onSetPage={(_event, newPage) => setPage(newPage)}
                        onPerPageSelect={(_event, newPerPage) => {
                          setPerPage(newPerPage);
                          setPage(1);
                        }}
                        variant={PaginationVariant.bottom}
                        perPageOptions={[
                          { title: '10', value: 10 },
                          { title: '20', value: 20 },
                          { title: '50', value: 50 },
                        ]}
                      />
                    </div>
                  </div>
                </div>
        )}
        {activeTab === 1 && (
          <div style={{ padding: '24px 0' }}>
            <div className="table-content-card">
                    {/* Toolbar */}
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem>
                          <Button
                            variant={isStreaming ? 'danger' : 'primary'}
                            icon={isStreaming ? <PauseIcon /> : <PlayIcon />}
                            onClick={() => setIsStreaming(!isStreaming)}
                          >
                            {isStreaming ? 'Pause' : 'Resume'}
                          </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={false}
                            onSelect={() => {}}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                variant="default"
                              >
                                <FilterIcon /> Filter by source
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem value="">All sources</DropdownItem>
                              {allEventSources.map(source => (
                                <DropdownItem key={source.id} value={source.name} onClick={() => setSelectedSource(source.name)}>
                                  {source.name}
                                </DropdownItem>
                              ))}
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Search events"
                            value={streamSearchValue}
                            onChange={(_event, value) => setStreamSearchValue(value)}
                            onClear={() => setStreamSearchValue('')}
                          />
                        </ToolbarItem>
                        <ToolbarItem align={{ default: 'alignEnd' }}>
                          <Button variant="secondary" icon={<SyncAltIcon />} onClick={() => console.log('Refresh stream')}>
                            Refresh
                          </Button>
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>

                    {/* Event Cards */}
                    <div style={{ padding: '24px', maxHeight: '600px', overflowY: 'auto' }}>
                      {filteredStreamEvents.length > 0 ? (
                        filteredStreamEvents.map((event) => (
                          <Card key={event.id} style={{ marginBottom: '16px' }}>
                            <CardBody>
                              <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                                <FlexItem grow={{ default: 'grow' }}>
                                  <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                                    <FlexItem>
                                      {getStatusBadge(event.status)}
                                    </FlexItem>
                                    <FlexItem>
                                      <strong>{event.type}</strong>
                                    </FlexItem>
                                    <FlexItem>
                                      <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                                        {event.timestamp}
                                      </Content>
                                    </FlexItem>
                                  </Flex>
                                  <div style={{ marginTop: '8px' }}>
                                    <Content component="small">
                                      <strong>Source:</strong> {event.source}
                                    </Content>
                                  </div>
                                  {event.rulebook && (
                                    <div style={{ marginTop: '4px' }}>
                                      <Content component="small">
                                        <strong>Rulebook:</strong> {event.rulebook}
                                        {event.rule && ` → ${event.rule}`}
                                      </Content>
                                    </div>
                                  )}
                                  <div style={{ marginTop: '12px' }}>
                                    <CodeBlock>
                                      <CodeBlockCode>{JSON.stringify(event.payload, null, 2)}</CodeBlockCode>
                                    </CodeBlock>
                                  </div>
                                </FlexItem>
                              </Flex>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Content>
                          <p style={{ color: 'var(--pf-v5-global--Color--200)', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>
                            {isStreaming ? 'Waiting for events...' : 'Stream paused. Click Resume to start receiving events.'}
                          </p>
                        </Content>
                      )}
                    </div>
                  </div>
                </div>
        )}
        {activeTab === 2 && (
          <div style={{ padding: '24px 0' }}>
            <div className="table-content-card">
                    {/* Toolbar */}
                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isBulkSelectorOpen}
                            onSelect={() => setIsBulkSelectorOpen(false)}
                            onOpenChange={(isOpen) => setIsBulkSelectorOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsBulkSelectorOpen(!isBulkSelectorOpen)}
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
                                      id="bulk-select-history"
                                      isChecked={false}
                                      aria-label="Select all"
                                    />
                                  </FlexItem>
                                  <FlexItem>
                                    <CaretDownIcon />
                                  </FlexItem>
                                </Flex>
                              </MenuToggle>
                            )}
                            popperProps={{ position: 'left' }}
                          >
                            <DropdownList>
                              <DropdownItem key="select-all">Select all</DropdownItem>
                              <DropdownItem key="select-none">Select none</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isFilterOpen}
                            onSelect={() => setIsFilterOpen(false)}
                            onOpenChange={(isOpen) => setIsFilterOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                variant="default"
                              >
                                <FilterIcon /> Filter
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem key="status-all" onClick={() => setStatusFilter(null)}>
                                All statuses
                              </DropdownItem>
                              <DropdownItem key="status-processed" onClick={() => setStatusFilter('Processed')}>
                                Processed
                              </DropdownItem>
                              <DropdownItem key="status-failed" onClick={() => setStatusFilter('Failed')}>
                                Failed
                              </DropdownItem>
                              <DropdownItem key="status-pending" onClick={() => setStatusFilter('Pending')}>
                                Pending
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Search events"
                            value={historySearchValue}
                            onChange={(_event, value) => setHistorySearchValue(value)}
                            onClear={() => setHistorySearchValue('')}
                          />
                        </ToolbarItem>
                        <ToolbarItem align={{ default: 'alignEnd' }}>
                          <Button variant="secondary" icon={<DownloadIcon />} onClick={() => console.log('Export events')}>
                            Export
                          </Button>
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>

                    {/* Pagination at top */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0' }}>
                      <Pagination
                        itemCount={filteredHistoryEvents.length}
                        perPage={historyPerPage}
                        page={historyPage}
                        onSetPage={(_event, newPage) => setHistoryPage(newPage)}
                        onPerPageSelect={(_event, newPerPage) => {
                          setHistoryPerPage(newPerPage);
                          setHistoryPage(1);
                        }}
                        variant={PaginationVariant.top}
                        perPageOptions={[
                          { title: '10', value: 10 },
                          { title: '20', value: 20 },
                          { title: '50', value: 50 },
                        ]}
                      />
                    </div>

                    {/* Table */}
                    <Table aria-label="Event history table">
                      <Thead>
                        <Tr>
                          <Th>Timestamp</Th>
                          <Th>Source</Th>
                          <Th>Type</Th>
                          <Th>Status</Th>
                          <Th>Rulebook</Th>
                          <Th>Rule</Th>
                          <Th>Job</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {paginatedHistoryEvents.map((event) => (
                          <Tr key={event.id}>
                            <Td dataLabel="Timestamp">{event.timestamp}</Td>
                            <Td dataLabel="Source">
                              <Button
                                variant="link"
                                isInline
                                onClick={() => {
                                  setActiveTab(0);
                                  navigate(`/automation/events?tab=sources&source=${event.source}`);
                                }}
                              >
                                {event.source}
                              </Button>
                            </Td>
                            <Td dataLabel="Type">{event.type}</Td>
                            <Td dataLabel="Status">
                              {getStatusBadge(event.status)}
                            </Td>
                            <Td dataLabel="Rulebook">
                              {event.rulebook ? (
                                <Button
                                  variant="link"
                                  isInline
                                  onClick={() => navigate(`/automation/rulebooks?name=${event.rulebook}`)}
                                >
                                  {event.rulebook}
                                </Button>
                              ) : (
                                '-'
                              )}
                            </Td>
                            <Td dataLabel="Rule">{event.rule || '-'}</Td>
                            <Td dataLabel="Job">
                              {event.jobId ? (
                                <Button variant="link" isInline onClick={() => navigate(`/automation/jobs/${event.jobId}`)}>
                                  #{event.jobId}
                                </Button>
                              ) : (
                                '-'
                              )}
                            </Td>
                            <Td isActionCell>
                              <Button variant="link" onClick={() => console.log(`View ${event.id}`)}>
                                View
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                    {/* Pagination at bottom */}
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
                      <Pagination
                        itemCount={filteredHistoryEvents.length}
                        perPage={historyPerPage}
                        page={historyPage}
                        onSetPage={(_event, newPage) => setHistoryPage(newPage)}
                        onPerPageSelect={(_event, newPerPage) => {
                          setHistoryPerPage(newPerPage);
                          setHistoryPage(1);
                        }}
                        variant={PaginationVariant.bottom}
                        perPageOptions={[
                          { title: '10', value: 10 },
                          { title: '20', value: 20 },
                          { title: '50', value: 50 },
                        ]}
                      />
                    </div>
                  </div>
                </div>
        )}
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
        title="Create event source"
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
                        <DropdownItem value="Webhook">Webhook</DropdownItem>
                        <DropdownItem value="Kafka">Kafka</DropdownItem>
                        <DropdownItem value="Database">Database</DropdownItem>
                        <DropdownItem value="File">File</DropdownItem>
                        <DropdownItem value="Custom">Custom</DropdownItem>
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
                      <FormGroup label="Kafka Broker" isRequired fieldId="broker" style={{ marginTop: '16px' }}>
                        <TextInput
                          id="broker"
                          value={wizardData.broker || ''}
                          onChange={(_event, value) => setWizardData({ ...wizardData, broker: value })}
                          placeholder="kafka.example.com:9092"
                        />
                      </FormGroup>
                    </>
                  )}
                  {wizardData.type === 'Database' && (
                    <>
                      <FormGroup label="Database Connection" isRequired fieldId="connection">
                        <TextInput
                          id="connection"
                          value={wizardData.connection || ''}
                          onChange={(_event, value) => setWizardData({ ...wizardData, connection: value })}
                          placeholder="postgresql://host:port/database"
                        />
                      </FormGroup>
                      <FormGroup label="Table" isRequired fieldId="table" style={{ marginTop: '16px' }}>
                        <TextInput
                          id="table"
                          value={wizardData.table || ''}
                          onChange={(_event, value) => setWizardData({ ...wizardData, table: value })}
                          placeholder="Enter table name"
                        />
                      </FormGroup>
                    </>
                  )}
                  <FormGroup label="Credentials" fieldId="credentials" style={{ marginTop: '16px' }}>
                    <Dropdown
                      isOpen={wizardData.credentialsDropdownOpen || false}
                      onSelect={(_event, value) => {
                        setWizardData({ ...wizardData, credentials: value as string, credentialsDropdownOpen: false });
                      }}
                      onOpenChange={(isOpen: boolean) => setWizardData({ ...wizardData, credentialsDropdownOpen: isOpen })}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setWizardData({ ...wizardData, credentialsDropdownOpen: !wizardData.credentialsDropdownOpen })}
                          isExpanded={wizardData.credentialsDropdownOpen || false}
                          variant="default"
                        >
                          {wizardData.credentials || 'Select credentials (optional)'}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem value="">None</DropdownItem>
                        <DropdownItem value="webhook-credentials-01">webhook-credentials-01</DropdownItem>
                        <DropdownItem value="kafka-credentials-01">kafka-credentials-01</DropdownItem>
                        <DropdownItem value="db-credentials-01">db-credentials-01</DropdownItem>
                      </DropdownList>
                    </Dropdown>
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
                  {wizardData.url && <p><strong>Webhook URL:</strong> {wizardData.url}</p>}
                  {wizardData.topic && <p><strong>Kafka Topic:</strong> {wizardData.topic}</p>}
                  {wizardData.broker && <p><strong>Kafka Broker:</strong> {wizardData.broker}</p>}
                  {wizardData.connection && <p><strong>Database Connection:</strong> {wizardData.connection}</p>}
                  {wizardData.table && <p><strong>Table:</strong> {wizardData.table}</p>}
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

export default EventsPage;

