import React, { useState, useMemo } from 'react';
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
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';
import {
  CaretDownIcon,
  FilterIcon,
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

interface Event {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  status: 'Processed' | 'Failed' | 'Pending';
  rulebook?: string;
  rule?: string;
  jobId?: number;
}

const EventHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sourceFilter = searchParams.get('source');

  // Toolbar state
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Event history data
  const allEvents: Event[] = [
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
    {
      id: 'evt-006',
      timestamp: '2024-01-15 15:15:30',
      source: 'File Watcher - Config Changes',
      type: 'file.changed',
      status: 'Pending',
    },
    {
      id: 'evt-007',
      timestamp: '2024-01-15 15:10:45',
      source: 'VM Creation Webhook',
      type: 'vm.deleted',
      status: 'Processed',
    },
    {
      id: 'evt-008',
      timestamp: '2024-01-15 15:05:20',
      source: 'Cluster Metrics Kafka Topic',
      type: 'cluster.health.critical',
      status: 'Processed',
      rulebook: 'Cluster Health Monitoring',
      rule: 'On Health Threshold',
      jobId: 1232,
    },
  ];

  // Filter and search
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      if (searchValue && !event.type.toLowerCase().includes(searchValue.toLowerCase()) && 
          !event.source.toLowerCase().includes(searchValue.toLowerCase()) &&
          !event.id.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      if (sourceFilter && event.source !== sourceFilter) {
        return false;
      }
      if (statusFilter && event.status !== statusFilter) {
        return false;
      }
      if (typeFilter && event.type !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [searchValue, sourceFilter, statusFilter, typeFilter]);

  // Pagination
  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredEvents.slice(start, end);
  }, [filteredEvents, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredEvents.map(e => e.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedEvents.forEach(e => newSelected.add(e.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleSelectItem = (itemId: string, isSelecting: boolean) => {
    const newSelected = new Set(selectedItems);
    if (isSelecting) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const isAllSelected = paginatedEvents.length > 0 && paginatedEvents.every(e => selectedItems.has(e.id));

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning'> = {
      'Processed': 'success',
      'Failed': 'danger',
      'Pending': 'warning',
    };
    return <Badge isRead={status === 'Pending'}>{status}</Badge>;
  };

  const eventSources = Array.from(new Set(allEvents.map(e => e.source)));
  const eventTypes = Array.from(new Set(allEvents.map(e => e.type)));
  const eventStatuses = Array.from(new Set(allEvents.map(e => e.status)));

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/event-history')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/event-history')}>
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Event History</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Event History
        </Title>
        <Content>
          <p>Search and analyze historical events processed by Event-Driven Ansible. Use this view for auditing, troubleshooting automation issues, and understanding event patterns over time.</p>
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
                            id="bulk-select-checkbox-events"
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
                      Select page ({paginatedEvents.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredEvents.length} items)
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
                    <DropdownItem key="source" onClick={() => {
                      // Clear source filter by navigating without the source param
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('source');
                      navigate(`/automation/event-history?${newParams.toString()}`, { replace: true });
                      setIsFilterOpen(false);
                    }}>
                      Source: {sourceFilter || 'All'}
                    </DropdownItem>
                    <DropdownItem key="status" onClick={() => {
                      setStatusFilter(statusFilter ? null : 'Processed');
                      setIsFilterOpen(false);
                    }}>
                      Status: {statusFilter || 'All'}
                    </DropdownItem>
                    <DropdownItem key="type" onClick={() => {
                      setTypeFilter(typeFilter ? null : 'vm.created');
                      setIsFilterOpen(false);
                    }}>
                      Type: {typeFilter || 'All'}
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search events"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Export Button */}
              <ToolbarItem>
                <Button variant="secondary" icon={<DownloadIcon />} onClick={() => console.log('Export events')}>
                  Export
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredEvents.length}
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
          <Table aria-label="Event history table">
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
                    isHeaderSelectDisabled: filteredEvents.length === 0,
                  }}
                />
                <Th>ID</Th>
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
              {paginatedEvents.map((event, index) => (
                <Tr key={event.id}>
                  <Td
                    select={{
                      rowIndex: index,
                      onSelect: (_event, isSelecting) => handleSelectItem(event.id, isSelecting),
                      isSelected: selectedItems.has(event.id),
                    }}
                  />
                  <Td dataLabel="ID">
                    <code style={{ fontSize: '12px' }}>{event.id}</code>
                  </Td>
                  <Td dataLabel="Timestamp">{event.timestamp}</Td>
                  <Td dataLabel="Source">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/event-sources?name=${event.source}`)}>
                      {event.source}
                    </Button>
                  </Td>
                  <Td dataLabel="Type">
                    <code style={{ backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', padding: '2px 6px', borderRadius: '3px' }}>
                      {event.type}
                    </code>
                  </Td>
                  <Td dataLabel="Status">{getStatusBadge(event.status)}</Td>
                  <Td dataLabel="Rulebook">
                    {event.rulebook ? (
                      <Button variant="link" isInline onClick={() => navigate(`/automation/rulebooks?name=${event.rulebook}`)}>
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
                  <Td dataLabel="Actions">
                    <Button variant="link" onClick={() => navigate(`/automation/event-history/${event.id}`)}>
                      View Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Pagination at bottom */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
            <Pagination
              itemCount={filteredEvents.length}
              perPage={perPage}
              page={page}
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventHistoryPage;

