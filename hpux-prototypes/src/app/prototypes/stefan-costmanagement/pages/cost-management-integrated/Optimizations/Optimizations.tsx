import * as React from 'react';
import {
  Title,
  Content,
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarToggleGroup,
  MenuToggle,
  Select,
  SelectOption,
  SelectList,
  SearchInput,
  Button,
  Pagination,
  PaginationVariant,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Label,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { 
  FilterIcon, 
  ExportIcon,
  ExclamationTriangleIcon,
  SortAmountDownIcon,
  SortAmountUpIcon,
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

interface OptimizationItem {
  id: string;
  projectName: string;
  workloadName: string;
  workloadType: string;
  clusterName: string;
  currentMemory: string | null;
  currentCPU: string | null;
  recommendedMemory: string | null;
  recommendedCPU: string | null;
  memoryChange: number | null;
  cpuChange: number | null;
  lastReported: string;
}

const Optimizations: React.FunctionComponent = () => {
  const [activeView, setActiveView] = React.useState<string>('projects');
  const [optimizeForOpen, setOptimizeForOpen] = React.useState(false);
  const [optimizeFor, setOptimizeFor] = React.useState('Performance');
  const [timeRangeOpen, setTimeRangeOpen] = React.useState(false);
  const [timeRange, setTimeRange] = React.useState('Last 24 hrs');
  const [projectFilterOpen, setProjectFilterOpen] = React.useState(false);
  const [projectFilter, setProjectFilter] = React.useState('Project');
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [sortIndex, setSortIndex] = React.useState<number>(0);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleViewChange = (isSelected: boolean, event: any) => {
    const id = event.currentTarget.id;
    console.log('Toggle clicked:', id, 'isSelected:', isSelected);
    setActiveView(id);
  };

  // Mock data for Containers view
  const containersData: OptimizationItem[] = [
    {
      id: 'c1',
      projectName: 'thanos',
      workloadName: 'thanos-receive',
      workloadType: 'platform',
      clusterName: 'demolab',
      currentMemory: '64MiB',
      currentCPU: '300mcore',
      recommendedMemory: '50MiB',
      recommendedCPU: '250mcore',
      memoryChange: -12,
      cpuChange: +12,
      lastReported: '3 hours ago',
    },
    {
      id: 'c2',
      projectName: 'thanos',
      workloadName: 'thanos-receive',
      workloadType: 'platform',
      clusterName: 'demolab',
      currentMemory: null,
      currentCPU: null,
      recommendedMemory: '23.13Mi',
      recommendedCPU: null,
      memoryChange: null,
      cpuChange: null,
      lastReported: '3 hours ago',
    },
    {
      id: 'c3',
      projectName: 'cost-management-metrics-operator',
      workloadName: 'cost-mgmt-proxy',
      workloadType: 'platform',
      clusterName: 'demolab',
      currentMemory: '64MiB',
      currentCPU: '300mcore',
      recommendedMemory: '50MiB',
      recommendedCPU: '250mcore',
      memoryChange: -12,
      cpuChange: +12,
      lastReported: '3 hours ago',
    },
    {
      id: 'c4',
      projectName: 'thanos',
      workloadName: 'grafana-operator-controller-manager',
      workloadType: 'platform',
      clusterName: 'demolab',
      currentMemory: null,
      currentCPU: null,
      recommendedMemory: '23.13Mi',
      recommendedCPU: null,
      memoryChange: null,
      cpuChange: null,
      lastReported: '3 hours ago',
    },
    {
      id: 'c5',
      projectName: 'thanos',
      workloadName: 'grafana-operator-controller-manager',
      workloadType: 'platform',
      clusterName: 'demolab',
      currentMemory: null,
      currentCPU: null,
      recommendedMemory: null,
      recommendedCPU: null,
      memoryChange: null,
      cpuChange: null,
      lastReported: '3 hours ago',
    },
    {
      id: 'c6',
      projectName: 'cost-management-metrics-operator',
      workloadName: 'costmanagement-metrics-operator',
      workloadType: 'project',
      clusterName: 'demolab',
      currentMemory: null,
      currentCPU: null,
      recommendedMemory: null,
      recommendedCPU: null,
      memoryChange: null,
      cpuChange: null,
      lastReported: '3 hours ago',
    },
    {
      id: 'c7',
      projectName: 'thanos',
      workloadName: 'grafana-deployment',
      workloadType: 'project',
      clusterName: 'demolab',
      currentMemory: null,
      currentCPU: null,
      recommendedMemory: null,
      recommendedCPU: null,
      memoryChange: null,
      cpuChange: null,
      lastReported: '3 hours ago',
    },
    {
      id: 'c8',
      projectName: 'thanos',
      workloadName: 'thanos-querier',
      workloadType: 'project',
      clusterName: 'demolab',
      currentMemory: null,
      currentCPU: null,
      recommendedMemory: null,
      recommendedCPU: null,
      memoryChange: null,
      cpuChange: null,
      lastReported: '3 hours ago',
    },
    {
      id: 'c9',
      projectName: 'thanos',
      workloadName: 'thanos-querier',
      workloadType: 'project',
      clusterName: 'demolab',
      currentMemory: null,
      currentCPU: null,
      recommendedMemory: null,
      recommendedCPU: null,
      memoryChange: null,
      cpuChange: null,
      lastReported: '3 hours ago',
    },
    {
      id: 'c10',
      projectName: 'costmanagement-metrics-operator',
      workloadName: 'cost-mgmt-ui-console-plugin',
      workloadType: 'project',
      clusterName: 'demolab',
      currentMemory: '64MiB',
      currentCPU: '300mcore',
      recommendedMemory: '50MiB',
      recommendedCPU: '250mcore',
      memoryChange: -12,
      cpuChange: +12,
      lastReported: '3 hours ago',
    },
  ];

  // Mock data for Projects view (different structure)
  const projectsData: OptimizationItem[] = [
    {
      id: 'p1',
      projectName: 'thanos',
      workloadName: 'thanos-receive',
      workloadType: 'platform',
      clusterName: 'demolab',
      currentMemory: '128MiB',
      currentCPU: '600mcore',
      recommendedMemory: '100MiB',
      recommendedCPU: '500mcore',
      memoryChange: -22,
      cpuChange: -17,
      lastReported: '3 hours ago',
    },
    {
      id: 'p2',
      projectName: 'cost-management',
      workloadName: 'cost-mgmt-proxy',
      workloadType: 'platform',
      clusterName: 'demolab',
      currentMemory: '256MiB',
      currentCPU: '800mcore',
      recommendedMemory: '200MiB',
      recommendedCPU: '700mcore',
      memoryChange: -22,
      cpuChange: -13,
      lastReported: '2 hours ago',
    },
  ];

  const data = activeView === 'projects' ? projectsData : containersData;
  const totalItems = activeView === 'projects' ? 500 : 500;
  
  // Debugging: Log when view changes
  React.useEffect(() => {
    console.log('Active view changed to:', activeView);
    console.log('Data items:', data.length);
  }, [activeView, data.length]);

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortIndex,
      direction: sortDirection,
    },
    onSort: (_event, index, direction) => {
      setSortIndex(index);
      setSortDirection(direction);
    },
    columnIndex,
  });

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="/cost-management-integrated/overview">Cost Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Optimizations</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Optimizations
        </Title>
        <Content>
          <p>Get detailed recommendations for how to optimize your Red Hat OpenShift cost and performance.</p>
        </Content>
      </div>

      {/* Content Section */}
      <div className="template-page-content">
        {/* Tabs and Dropdowns Section */}
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }}>
              <FlexItem>
                <ToggleGroup aria-label="Optimization view toggle">
                  <ToggleGroupItem
                    text="Projects"
                    buttonId="projects"
                    isSelected={activeView === 'projects'}
                    onChange={(isSelected, event) => {
                      console.log('Projects clicked', isSelected);
                      setActiveView('projects');
                    }}
                  />
                  <ToggleGroupItem
                    text="Containers"
                    buttonId="containers"
                    isSelected={activeView === 'containers'}
                    onChange={(isSelected, event) => {
                      console.log('Containers clicked', isSelected);
                      setActiveView('containers');
                    }}
                  />
                </ToggleGroup>
              </FlexItem>
              <FlexItem>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <Title headingLevel="h2" size="md">
                    Optimize for
                  </Title>
                  <Select
                    isOpen={optimizeForOpen}
                    onSelect={(_event, value) => {
                      setOptimizeFor(value as string);
                      setOptimizeForOpen(false);
                    }}
                    onOpenChange={(isOpen) => setOptimizeForOpen(isOpen)}
                    selected={optimizeFor}
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setOptimizeForOpen(!optimizeForOpen)} 
                        isExpanded={optimizeForOpen}
                      >
                        {optimizeFor}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Performance">Performance</SelectOption>
                      <SelectOption value="Cost">Cost</SelectOption>
                    </SelectList>
                  </Select>
                </Flex>
              </FlexItem>
              <FlexItem>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <Title headingLevel="h2" size="md">
                    View optimizations based on
                  </Title>
                  <Select
                    isOpen={timeRangeOpen}
                    onSelect={(_event, value) => {
                      setTimeRange(value as string);
                      setTimeRangeOpen(false);
                    }}
                    onOpenChange={(isOpen) => setTimeRangeOpen(isOpen)}
                    selected={timeRange}
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setTimeRangeOpen(!timeRangeOpen)} 
                        isExpanded={timeRangeOpen}
                      >
                        {timeRange}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Last 24 hrs">Last 24 hrs</SelectOption>
                      <SelectOption value="Last 7 days">Last 7 days</SelectOption>
                      <SelectOption value="Last 14 days">Last 14 days</SelectOption>
                    </SelectList>
                  </Select>
                </Flex>
              </FlexItem>
            </Flex>
          </FlexItem>

          {/* Card with Table */}
          <FlexItem>
            <Card>
              <CardBody>
                {/* Toolbar */}
                <Toolbar id="optimizations-toolbar">
                  <ToolbarContent>
                    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                      <ToolbarGroup variant="filter-group">
                        <ToolbarItem>
                          <Select
                            isOpen={projectFilterOpen}
                            onSelect={(_event, value) => {
                              setProjectFilter(value as string);
                              setProjectFilterOpen(false);
                            }}
                            onOpenChange={(isOpen) => setProjectFilterOpen(isOpen)}
                            selected={projectFilter}
                            toggle={(toggleRef) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setProjectFilterOpen(!projectFilterOpen)} 
                                isExpanded={projectFilterOpen}
                                icon={<FilterIcon />}
                              >
                                {projectFilter}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="Project">Project</SelectOption>
                              <SelectOption value="Workload">Workload</SelectOption>
                              <SelectOption value="Cluster">Cluster</SelectOption>
                            </SelectList>
                          </Select>
                        </ToolbarItem>
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Filter by project"
                            value={searchValue}
                            onChange={(_event, value) => setSearchValue(value)}
                            onClear={() => setSearchValue('')}
                          />
                        </ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarToggleGroup>
                    <ToolbarItem>
                      <Button variant="link" icon={<ExportIcon />}>
                        Export
                      </Button>
                    </ToolbarItem>
                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={totalItems}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_evt, newPage) => setPage(newPage)}
                        widgetId="optimizations-pagination-top"
                        onPerPageSelect={(_evt, newPerPage, newPage) => {
                          setPerPage(newPerPage);
                          setPage(newPage);
                        }}
                        isCompact
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                {/* Table */}
                <Table aria-label="Optimizations table" variant="compact">
                  <Thead>
                    {activeView === 'projects' ? (
                      // Projects view - simplified columns
                      <>
                        <Tr>
                          <Th 
                            sort={getSortParams(0)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Project names
                          </Th>
                          <Th 
                            sort={getSortParams(1)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Project types
                          </Th>
                          <Th 
                            sort={getSortParams(2)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Cluster names
                          </Th>
                          <Th 
                            colSpan={2}
                            style={{ 
                              textAlign: 'left',
                              fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                              backgroundColor: 'white',
                              paddingTop: 'var(--pf-t--global--spacer--sm)',
                              paddingRight: 'var(--pf-t--global--spacer--md)',
                              paddingBottom: '4px',
                              paddingLeft: 'var(--pf-t--global--spacer--md)'
                            }}
                          >
                            Memory
                          </Th>
                          <Th 
                            colSpan={2}
                            style={{ 
                              textAlign: 'left',
                              fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                              backgroundColor: 'white',
                              paddingTop: 'var(--pf-t--global--spacer--sm)',
                              paddingRight: 'var(--pf-t--global--spacer--md)',
                              paddingBottom: '4px',
                              paddingLeft: 'var(--pf-t--global--spacer--md)'
                            }}
                          >
                            CPU
                          </Th>
                          <Th 
                            sort={getSortParams(6)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Last reported
                          </Th>
                        </Tr>
                        <Tr>
                          <Th 
                            sort={getSortParams(3)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Current
                          </Th>
                          <Th 
                            sort={getSortParams(4)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Change
                          </Th>
                          <Th 
                            sort={getSortParams(5)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Current
                          </Th>
                          <Th 
                            sort={getSortParams(6)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Change
                          </Th>
                        </Tr>
                      </>
                    ) : (
                      // Containers view - columns matching screenshot
                      <>
                        <Tr>
                          <Th 
                            sort={getSortParams(0)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Container names
                          </Th>
                          <Th 
                            sort={getSortParams(1)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Workload names
                          </Th>
                          <Th 
                            sort={getSortParams(2)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Workload types
                          </Th>
                          <Th 
                            sort={getSortParams(3)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Cluster names
                          </Th>
                          <Th 
                            colSpan={2}
                            style={{ 
                              textAlign: 'left',
                              fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                              backgroundColor: 'white',
                              paddingTop: 'var(--pf-t--global--spacer--sm)',
                              paddingRight: 'var(--pf-t--global--spacer--md)',
                              paddingBottom: '4px',
                              paddingLeft: 'var(--pf-t--global--spacer--md)'
                            }}
                          >
                            Memory
                          </Th>
                          <Th 
                            colSpan={2}
                            style={{ 
                              textAlign: 'left',
                              fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                              backgroundColor: 'white',
                              paddingTop: 'var(--pf-t--global--spacer--sm)',
                              paddingRight: 'var(--pf-t--global--spacer--md)',
                              paddingBottom: '4px',
                              paddingLeft: 'var(--pf-t--global--spacer--md)'
                            }}
                          >
                            CPU
                          </Th>
                          <Th 
                            sort={getSortParams(8)}
                            rowSpan={2}
                            modifier="wrap"
                            style={{ verticalAlign: 'middle' }}
                          >
                            Last reported
                          </Th>
                        </Tr>
                        <Tr>
                          <Th 
                            sort={getSortParams(4)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Current
                          </Th>
                          <Th 
                            sort={getSortParams(5)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Change
                          </Th>
                          <Th 
                            sort={getSortParams(6)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Current
                          </Th>
                          <Th 
                            sort={getSortParams(7)} 
                            modifier="wrap"
                            style={{
                              color: 'var(--pf-t--global--text--color--subtle)',
                              fontWeight: 'var(--pf-t--global--font--weight--body--default)',
                              fontSize: 'var(--pf-t--global--font--size--body--sm)',
                              paddingTop: '0'
                            }}
                          >
                            Change
                          </Th>
                        </Tr>
                      </>
                    )}
                  </Thead>
                  <Tbody>
                    {data.map((item) => (
                      <Tr key={item.id}>
                        {activeView === 'projects' ? (
                          // Projects view - simplified cells
                          <>
                            <Td dataLabel="Project names">
                              <Link to={`/cost-management-integrated/optimizations/${item.id}`}>
                                {item.projectName}
                              </Link>
                            </Td>
                            <Td dataLabel="Project types">{item.workloadType}</Td>
                            <Td dataLabel="Cluster names">{item.clusterName}</Td>
                            <Td dataLabel="Memory - Current">
                              {item.currentMemory || 'N/A'}
                            </Td>
                            <Td dataLabel="Memory - Change">
                              {item.memoryChange !== null ? (
                                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  <FlexItem>
                                    {item.memoryChange < 0 ? (
                                      <SortAmountDownIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)' }} />
                                    ) : (
                                      <SortAmountUpIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                                    )}
                                  </FlexItem>
                                  <FlexItem>{item.memoryChange}%</FlexItem>
                                </Flex>
                              ) : (
                                'N/A'
                              )}
                            </Td>
                            <Td dataLabel="CPU - Current">
                              {item.currentCPU || '0%'}
                            </Td>
                            <Td dataLabel="CPU - Change">
                              {item.cpuChange !== null ? (
                                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  <FlexItem>
                                    {item.cpuChange < 0 ? (
                                      <SortAmountDownIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)' }} />
                                    ) : (
                                      <SortAmountUpIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                                    )}
                                  </FlexItem>
                                  <FlexItem>+{item.cpuChange}%</FlexItem>
                                </Flex>
                              ) : (
                                'N/A'
                              )}
                            </Td>
                            <Td dataLabel="Last reported">{item.lastReported}</Td>
                          </>
                        ) : (
                          // Containers view - cells matching screenshot
                          <>
                            <Td dataLabel="Container names">
                              <Link to={`/cost-management-integrated/optimizations/${item.id}`}>
                                {item.workloadName}
                              </Link>
                            </Td>
                            <Td dataLabel="Workload names">{item.projectName}</Td>
                            <Td dataLabel="Workload types">{item.workloadType}</Td>
                            <Td dataLabel="Cluster names">{item.clusterName}</Td>
                            <Td dataLabel="Memory - Current">
                              {item.currentMemory || 'N/A'}
                            </Td>
                            <Td dataLabel="Memory - Change">
                              {item.memoryChange !== null ? (
                                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  <FlexItem>
                                    {item.memoryChange < 0 ? (
                                      <SortAmountDownIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)' }} />
                                    ) : (
                                      <SortAmountUpIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                                    )}
                                  </FlexItem>
                                  <FlexItem>{item.memoryChange}%</FlexItem>
                                </Flex>
                              ) : (
                                'N/A'
                              )}
                            </Td>
                            <Td dataLabel="CPU - Current">
                              {item.currentCPU || '0%'}
                            </Td>
                            <Td dataLabel="CPU - Change">
                              {item.cpuChange !== null ? (
                                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  <FlexItem>
                                    {item.cpuChange < 0 ? (
                                      <SortAmountDownIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)' }} />
                                    ) : (
                                      <SortAmountUpIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                                    )}
                                  </FlexItem>
                                  <FlexItem>+{item.cpuChange}%</FlexItem>
                                </Flex>
                              ) : (
                                'N/A'
                              )}
                            </Td>
                            <Td dataLabel="Last reported">{item.lastReported}</Td>
                          </>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Bottom Pagination */}
                <div style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                  <Pagination
                    itemCount={totalItems}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_evt, newPage) => setPage(newPage)}
                    widgetId="optimizations-pagination-bottom"
                    onPerPageSelect={(_evt, newPerPage, newPage) => {
                      setPerPage(newPerPage);
                      setPage(newPage);
                    }}
                    variant={PaginationVariant.bottom}
                  />
                </div>
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </div>
    </>
  );
};

export { Optimizations };

