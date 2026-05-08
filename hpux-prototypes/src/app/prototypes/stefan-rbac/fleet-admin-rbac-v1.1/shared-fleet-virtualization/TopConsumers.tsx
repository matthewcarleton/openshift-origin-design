import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Title,
  Content,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';

const TopConsumers: React.FunctionComponent = () => {
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 minutes');
  const [topCountOpen, setTopCountOpen] = useState(false);
  const [selectedTopCount, setSelectedTopCount] = useState('Show top 5');

  // Dropdowns for each resource card
  const [cpuSortOpen, setCpuSortOpen] = useState(false);
  const [cpuVMOpen, setCpuVMOpen] = useState(false);
  const [cpuSort, setCpuSort] = useState('By CPU');
  const [cpuVM, setCpuVM] = useState('VM');

  const [memorySortOpen, setMemorySortOpen] = useState(false);
  const [memoryVMOpen, setMemoryVMOpen] = useState(false);
  const [memorySort, setMemorySort] = useState('By memory');
  const [memoryVM, setMemoryVM] = useState('VM');

  const [memorySwapSortOpen, setMemorySwapSortOpen] = useState(false);
  const [memorySwapVMOpen, setMemorySwapVMOpen] = useState(false);
  const [memorySwapSort, setMemorySwapSort] = useState('By memory swap traffic');
  const [memorySwapVM, setMemorySwapVM] = useState('VM');

  const [vcpuWaitSortOpen, setVcpuWaitSortOpen] = useState(false);
  const [vcpuWaitVMOpen, setVcpuWaitVMOpen] = useState(false);
  const [vcpuWaitSort, setVcpuWaitSort] = useState('By vCPU wait');
  const [vcpuWaitVM, setVcpuWaitVM] = useState('VM');

  const [throughputSortOpen, setThroughputSortOpen] = useState(false);
  const [throughputVMOpen, setThroughputVMOpen] = useState(false);
  const [throughputSort, setThroughputSort] = useState('By throughput');
  const [throughputVM, setThroughputVM] = useState('VM');

  const [iopsSortOpen, setIopsSortOpen] = useState(false);
  const [iopsVMOpen, setIopsVMOpen] = useState(false);
  const [iopsSort, setIopsSort] = useState('By IOPS');
  const [iopsVM, setIopsVM] = useState('VM');

  const [readLatencySortOpen, setReadLatencySortOpen] = useState(false);
  const [readLatencyVMOpen, setReadLatencyVMOpen] = useState(false);
  const [readLatencySort, setReadLatencySort] = useState('By read latency');
  const [readLatencyVM, setReadLatencyVM] = useState('VM');

  const [writeLatencySortOpen, setWriteLatencySortOpen] = useState(false);
  const [writeLatencyVMOpen, setWriteLatencyVMOpen] = useState(false);
  const [writeLatencySort, setWriteLatencySort] = useState('By write latency');
  const [writeLatencyVM, setWriteLatencyVM] = useState('VM');

  // Mock data for CPU consumers
  const cpuConsumers = [
    { name: 'rhel-10-lavender-butterfly-16', usage: 3.17, maxUsage: 3.17 },
    { name: 'example-1', usage: 3.08, maxUsage: 3.17 },
  ];

  // Mock data for Memory consumers
  const memoryConsumers = [
    { name: 'example-1', usage: 0.436, maxUsage: 0.436 },
    { name: 'rhel-10-lavender-butterfly-16', usage: 0.425, maxUsage: 0.436 },
  ];

  // Mock data for Storage throughput
  const throughputConsumers = [
    { name: 'rhel-10-lavender-butterfly-16', usage: 239.8, maxUsage: 239.8 },
    { name: 'example-1', usage: 0.861, maxUsage: 239.8 },
  ];

  // Mock data for Storage IOPS
  const iopsConsumers = [
    { name: 'rhel-10-lavender-butterfly-16', usage: 0.03, maxUsage: 0.03 },
    { name: 'example-1', usage: 0.00, maxUsage: 0.03 },
  ];

  // Mock data for Storage write latency
  const writeLatencyConsumers = [
    { name: 'rhel-10-lavender-butterfly-16', usage: 0.008, maxUsage: 0.008 },
    { name: 'example-1', usage: 0.001, maxUsage: 0.008 },
  ];

  const renderResourceCard = (
    title: string,
    sortValue: string,
    sortOpen: boolean,
    setSortOpen: (open: boolean) => void,
    onSortSelect: (value: string) => void,
    vmValue: string,
    vmOpen: boolean,
    setVMOpen: (open: boolean) => void,
    onVMSelect: (value: string) => void,
    consumers: Array<{ name: string; usage: number; maxUsage: number }>,
    unit: string,
    noDataMessage?: string
  ) => (
    <Card>
      <CardBody>
        <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
          {title}
        </Title>
        <Toolbar style={{ padding: 0, marginBottom: '16px' }}>
          <ToolbarContent style={{ padding: 0 }}>
            <ToolbarItem>
              <Dropdown
                isOpen={sortOpen}
                onSelect={() => setSortOpen(false)}
                onOpenChange={(isOpen) => setSortOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setSortOpen(!sortOpen)}
                    isExpanded={sortOpen}
                  >
                    {sortValue}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="sort" onClick={() => onSortSelect(sortValue)}>
                    {sortValue}
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={vmOpen}
                onSelect={() => setVMOpen(false)}
                onOpenChange={(isOpen) => setVMOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setVMOpen(!vmOpen)}
                    isExpanded={vmOpen}
                  >
                    {vmValue}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="vm" onClick={() => onVMSelect('VM')}>
                    VM
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        {/* Resource and Usage headers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          <div>Resource</div>
          <div>Usage</div>
        </div>

        {/* Consumer bars */}
        {consumers.length > 0 ? (
          consumers.map((consumer) => (
            <div key={consumer.name} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                <div style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{consumer.name}</div>
                <div style={{ fontWeight: 500 }}>{consumer.usage.toFixed(consumer.usage < 1 ? 3 : 2)} {unit}</div>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#d2d2d2', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(consumer.usage / consumer.maxUsage) * 100}%`,
                    height: '100%',
                    backgroundColor: '#0066cc',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <Content style={{ textAlign: 'center', padding: '24px 0', color: 'var(--pf-t--global--text--color--subtle)' }}>
            {noDataMessage || 'No data available'}
          </Content>
        )}
      </CardBody>
    </Card>
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      {/* Top toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title headingLevel="h2" size="xl">
          Top consumers
        </Title>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="#" style={{ color: 'var(--pf-t--global--color--brand--default)', textDecoration: 'none' }}>
            View virtualization dashboard
          </a>
          <Dropdown
            isOpen={timeRangeOpen}
            onSelect={() => setTimeRangeOpen(false)}
            onOpenChange={(isOpen) => setTimeRangeOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setTimeRangeOpen(!timeRangeOpen)}
                isExpanded={timeRangeOpen}
              >
                {selectedTimeRange}
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem key="5min" onClick={() => setSelectedTimeRange('Last 5 minutes')}>
                Last 5 minutes
              </DropdownItem>
              <DropdownItem key="30min" onClick={() => setSelectedTimeRange('Last 30 minutes')}>
                Last 30 minutes
              </DropdownItem>
              <DropdownItem key="1hour" onClick={() => setSelectedTimeRange('Last 1 hour')}>
                Last 1 hour
              </DropdownItem>
              <DropdownItem key="6hours" onClick={() => setSelectedTimeRange('Last 6 hours')}>
                Last 6 hours
              </DropdownItem>
              <DropdownItem key="24hours" onClick={() => setSelectedTimeRange('Last 24 hours')}>
                Last 24 hours
              </DropdownItem>
            </DropdownList>
          </Dropdown>
          <Dropdown
            isOpen={topCountOpen}
            onSelect={() => setTopCountOpen(false)}
            onOpenChange={(isOpen) => setTopCountOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setTopCountOpen(!topCountOpen)}
                isExpanded={topCountOpen}
              >
                {selectedTopCount}
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem key="top5" onClick={() => setSelectedTopCount('Show top 5')}>
                Show top 5
              </DropdownItem>
              <DropdownItem key="top10" onClick={() => setSelectedTopCount('Show top 10')}>
                Show top 10
              </DropdownItem>
              <DropdownItem key="top25" onClick={() => setSelectedTopCount('Show top 25')}>
                Show top 25
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </div>
      </div>

      {/* Grid of resource cards */}
      <Grid hasGutter>
        {/* Row 1 */}
        <GridItem span={6}>
          {renderResourceCard(
            'CPU',
            cpuSort,
            cpuSortOpen,
            setCpuSortOpen,
            setCpuSort,
            cpuVM,
            cpuVMOpen,
            setCpuVMOpen,
            setCpuVM,
            cpuConsumers,
            'm'
          )}
        </GridItem>
        <GridItem span={6}>
          {renderResourceCard(
            'Memory',
            memorySort,
            memorySortOpen,
            setMemorySortOpen,
            setMemorySort,
            memoryVM,
            memoryVMOpen,
            setMemoryVMOpen,
            setMemoryVM,
            memoryConsumers,
            'GiB'
          )}
        </GridItem>

        {/* Row 2 */}
        <GridItem span={6}>
          {renderResourceCard(
            'Memory swap traffic',
            memorySwapSort,
            memorySwapSortOpen,
            setMemorySwapSortOpen,
            setMemorySwapSort,
            memorySwapVM,
            memorySwapVMOpen,
            setMemorySwapVMOpen,
            setMemorySwapVM,
            [],
            'KiB/s',
            'No data available'
          )}
        </GridItem>
        <GridItem span={6}>
          {renderResourceCard(
            'vCPU wait',
            vcpuWaitSort,
            vcpuWaitSortOpen,
            setVcpuWaitSortOpen,
            setVcpuWaitSort,
            vcpuWaitVM,
            vcpuWaitVMOpen,
            setVcpuWaitVMOpen,
            setVcpuWaitVM,
            [],
            's',
            'No data available'
          )}
        </GridItem>

        {/* Row 3 */}
        <GridItem span={6}>
          {renderResourceCard(
            'Storage throughput',
            throughputSort,
            throughputSortOpen,
            setThroughputSortOpen,
            setThroughputSort,
            throughputVM,
            throughputVMOpen,
            setThroughputVMOpen,
            setThroughputVM,
            throughputConsumers,
            'B'
          )}
        </GridItem>
        <GridItem span={6}>
          {renderResourceCard(
            'Storage IOPS',
            iopsSort,
            iopsSortOpen,
            setIopsSortOpen,
            setIopsSort,
            iopsVM,
            iopsVMOpen,
            setIopsVMOpen,
            setIopsVM,
            iopsConsumers,
            'IOPS'
          )}
        </GridItem>

        {/* Row 4 */}
        <GridItem span={6}>
          {renderResourceCard(
            'Storage read latency',
            readLatencySort,
            readLatencySortOpen,
            setReadLatencySortOpen,
            setReadLatencySort,
            readLatencyVM,
            readLatencyVMOpen,
            setReadLatencyVMOpen,
            setReadLatencyVM,
            [],
            's',
            'No data available'
          )}
        </GridItem>
        <GridItem span={6}>
          {renderResourceCard(
            'Storage write latency',
            writeLatencySort,
            writeLatencySortOpen,
            setWriteLatencySortOpen,
            setWriteLatencySort,
            writeLatencyVM,
            writeLatencyVMOpen,
            setWriteLatencyVMOpen,
            setWriteLatencyVM,
            writeLatencyConsumers,
            's'
          )}
        </GridItem>
      </Grid>
    </div>
  );
};

export default TopConsumers;

