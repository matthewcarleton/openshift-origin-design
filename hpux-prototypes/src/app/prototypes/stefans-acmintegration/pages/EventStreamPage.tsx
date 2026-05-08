import React, { useState, useEffect, useMemo } from 'react';
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
  Badge,
  CodeBlock,
  CodeBlockCode,
  Card,
  CardBody,
} from '@patternfly/react-core';
import {
  CaretDownIcon,
  FilterIcon,
  PlayIcon,
  PauseIcon,
  SyncAltIcon,
} from '@patternfly/react-icons';

interface Event {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  status: 'Processed' | 'Failed' | 'Pending';
  payload: any;
  rulebook?: string;
  rule?: string;
}

const EventStreamPage: React.FC = () => {
  const navigate = useNavigate();
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Mock event stream data
  const mockEvents: Event[] = [
    {
      id: 'evt-001',
      timestamp: '2024-01-15 15:30:22.123',
      source: 'VM Creation Webhook',
      type: 'vm.created',
      status: 'Processed',
      payload: {
        vm_name: 'webserver-vm-01',
        namespace: 'workloads',
        vm_ip: '10.0.0.42',
        event_type: 'vm.created',
      },
      rulebook: 'VM Post-Provisioning Automation',
      rule: 'On VM Created',
    },
    {
      id: 'evt-002',
      timestamp: '2024-01-15 15:30:25.456',
      source: 'Ansible Automation Platform',
      type: 'job.completed',
      status: 'Processed',
      payload: {
        job_id: 1234,
        job_template: 'Post-provisioning Tasks',
        job_status: 'successful',
        vm_name: 'webserver-vm-01',
      },
      rulebook: 'VM Post-Provisioning Automation',
      rule: 'On Post-Provisioning Complete',
    },
    {
      id: 'evt-003',
      timestamp: '2024-01-15 15:30:28.789',
      source: 'Cluster Metrics Kafka Topic',
      type: 'cluster.health.warning',
      status: 'Pending',
      payload: {
        cluster: 'us-west-prod-01',
        metric: 'cpu_usage',
        value: 85,
        threshold: 80,
      },
    },
  ];

  // Simulate event stream
  useEffect(() => {
    if (!isStreaming) return;

    // Add initial events
    setEvents(mockEvents);

    // Simulate new events arriving
    const interval = setInterval(() => {
      const newEvent: Event = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
        source: selectedSource || 'VM Creation Webhook',
        type: 'vm.created',
        status: 'Pending',
        payload: {
          vm_name: `vm-${Math.floor(Math.random() * 1000)}`,
          namespace: 'workloads',
          event_type: 'vm.created',
        },
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
    }, 5000); // New event every 5 seconds

    return () => clearInterval(interval);
  }, [isStreaming, selectedSource]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (searchValue && !event.type.toLowerCase().includes(searchValue.toLowerCase()) && 
          !event.source.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      if (selectedSource && event.source !== selectedSource) {
        return false;
      }
      return true;
    });
  }, [events, searchValue, selectedSource]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning'> = {
      'Processed': 'success',
      'Failed': 'danger',
      'Pending': 'warning',
    };
    return <Badge isRead={status === 'Pending'}>{status}</Badge>;
  };

  const eventSources = Array.from(new Set(events.map(e => e.source)));

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/event-stream')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/event-stream')}>
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Event Stream</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Flex spaceItems={{ default: 'spaceItemsLg' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem grow={{ default: 'grow' }}>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
              Event Stream
            </Title>
            <Content>
              <p>Monitor events in real-time as they flow through the Event-Driven Ansible system. Use this view to debug event processing, verify event sources are working, and watch rules trigger in real-time.</p>
            </Content>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button
                  variant={isStreaming ? 'danger' : 'primary'}
                  icon={isStreaming ? <PauseIcon /> : <PlayIcon />}
                  onClick={() => setIsStreaming(!isStreaming)}
                >
                  {isStreaming ? 'Pause' : 'Resume'}
                </Button>
              </FlexItem>
              <FlexItem>
                <Button variant="secondary" icon={<SyncAltIcon />} onClick={() => setEvents([])}>
                  Clear
                </Button>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </div>

      {/* Content Area */}
      <div className="template-page-content">
        <div className="table-content-card">
          {/* Toolbar */}
          <Toolbar>
            <ToolbarContent style={{ gap: '8px' }}>
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
                      <FilterIcon /> Filter by Source
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="all" onClick={() => setSelectedSource(null)}>
                      All Sources
                    </DropdownItem>
                    {eventSources.map(source => (
                      <DropdownItem key={source} onClick={() => setSelectedSource(source)}>
                        {source}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search events by type or source"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Status Indicator */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Badge isRead={!isStreaming}>
                  {isStreaming ? 'Streaming' : 'Paused'} • {filteredEvents.length} events
                </Badge>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          {/* Event Stream */}
          <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '16px' }}>
            {filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--pf-v5-global--Color--200)' }}>
                <p>No events to display. {isStreaming ? 'Waiting for events...' : 'Stream is paused.'}</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} style={{ marginBottom: '16px' }}>
                  <CardBody>
                    <Flex spaceItems={{ default: 'spaceItemsLg' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                      <FlexItem grow={{ default: 'grow' }}>
                        <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                          <FlexItem>
                            <strong>{event.timestamp}</strong>
                          </FlexItem>
                          <FlexItem>
                            {getStatusBadge(event.status)}
                          </FlexItem>
                          <FlexItem>
                            <Badge>{event.source}</Badge>
                          </FlexItem>
                          <FlexItem>
                            <code style={{ backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', padding: '2px 6px', borderRadius: '3px' }}>
                              {event.type}
                            </code>
                          </FlexItem>
                        </Flex>
                        {event.rulebook && (
                          <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--pf-v5-global--Color--200)' }}>
                            Rulebook: <Button variant="link" isInline onClick={() => navigate(`/automation/rulebooks?name=${event.rulebook}`)}>{event.rulebook}</Button>
                            {event.rule && ` • Rule: ${event.rule}`}
                          </div>
                        )}
                        <div style={{ marginTop: '12px' }}>
                          <CodeBlock>
                            <CodeBlockCode>{JSON.stringify(event.payload, null, 2)}</CodeBlockCode>
                          </CodeBlock>
                        </div>
                      </FlexItem>
                      <FlexItem>
                        <Button variant="link" onClick={() => navigate(`/automation/event-history?event=${event.id}`)}>
                          View Details
                        </Button>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventStreamPage;

