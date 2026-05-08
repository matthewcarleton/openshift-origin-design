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
  Switch,
  Checkbox,
  Tabs,
  Tab,
  TabContent,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { 
  FilterIcon, 
  ExportIcon, 
  EllipsisVIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SortAmountDownIcon,
  SortAmountUpIcon,
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { dataService } from '../../../data/dataService';

interface ProjectItem {
  id: string;
  name: string;
  includesOverhead: boolean;
  optimizations: number;
  momChange: number;
  momPrevCost: string;
  cost: string;
  costPercent: string;
}

interface ClusterItem {
  id: string;
  name: string;
  clusterId: string;
  momChange: number;
  momPrevCost: string;
  cost: string;
  costPercent: string;
}

interface NodeItem {
  id: string;
  name: string;
  momChange: number | null;
  momPrevCost: string;
  cost: string;
  costPercent: string;
}

const CostManagementOpenShift: React.FunctionComponent = () => {
  const [activeTab, setActiveTab] = React.useState<string | number>(0);
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [groupByOpen, setGroupByOpen] = React.useState(false);
  const [groupBy, setGroupBy] = React.useState('Project');
  const [overheadOpen, setOverheadOpen] = React.useState(false);
  const [dateRangeOpen, setDateRangeOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [operatorOpen, setOperatorOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [sortIndex, setSortIndex] = React.useState<number>(5);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [sumPlatformCosts, setSumPlatformCosts] = React.useState(false);
  const [selectAll, setSelectAll] = React.useState(false);
  const [tagKeyOpen, setTagKeyOpen] = React.useState(false);
  const [tagKey, setTagKey] = React.useState('');

  // Get data from database
  const dbProjects = dataService.getAllProjects();
  const dbClusters = dataService.getAllClusters();
  const dbNodes = dataService.getAllNodes();
  const totalOpenShiftCost = dataService.getOpenShiftTotalCost();

  // Transform projects data for the UI
  const projects: ProjectItem[] = dbProjects.map(proj => {
    const percentage = (proj.cost / totalOpenShiftCost) * 100;
    const prevCost = proj.cost / (1 + 0.03); // Approximate previous cost
    
    return {
      id: proj.id,
      name: proj.name,
      includesOverhead: proj.name.includes('unallocated') || proj.name.includes('openshift'),
      optimizations: Math.floor(Math.random() * 8), // Random for demo
      momChange: ((proj.cost - prevCost) / prevCost) * 100,
      momPrevCost: dataService.formatCurrency(prevCost),
      cost: dataService.formatCurrency(proj.cost),
      costPercent: percentage.toFixed(2),
    };
  });

  // Keep the original hardcoded projects for now (commented out below)
  /* const projects: ProjectItem[] = [
    {
      id: 'netobserv',
      name: 'netobserv',
      includesOverhead: true,
      optimizations: 0,
      momChange: -4.07,
      momPrevCost: '$24,436.97',
      cost: '$23,442.25',
      costPercent: '27.28',
    },
    {
      id: 'netobserv-privileged',
      name: 'netobserv-privileged',
      includesOverhead: true,
      optimizations: 0,
      momChange: -4.07,
      momPrevCost: '$21,406.24',
      cost: '$20,534.82',
      costPercent: '23.90',
    },
    {
      id: 'analytics',
      name: 'analytics',
      includesOverhead: true,
      optimizations: 3,
      momChange: -0.66,
      momPrevCost: '$6,638.44',
      cost: '$6,594.71',
      costPercent: '7.67',
    },
    {
      id: 'thanos',
      name: 'thanos',
      includesOverhead: true,
      optimizations: 7,
      momChange: 0.14,
      momPrevCost: '$6,205.90',
      cost: '$6,214.58',
      costPercent: '7.23',
    },
    {
      id: 'cost-management',
      name: 'cost-management',
      includesOverhead: true,
      optimizations: 3,
      momChange: -4.47,
      momPrevCost: '$5,778.25',
      cost: '$5,519.84',
      costPercent: '6.42',
    },
    {
      id: 'fall',
      name: 'fall',
      includesOverhead: true,
      optimizations: 2,
      momChange: -4.32,
      momPrevCost: '$3,487.26',
      cost: '$3,336.63',
      costPercent: '3.88',
    },
    {
      id: 'snowdown',
      name: 'snowdown',
      includesOverhead: true,
      optimizations: 2,
      momChange: -4.32,
      momPrevCost: '$3,487.26',
      cost: '$3,336.63',
      costPercent: '3.88',
    },
    {
      id: 'costmanagement-metrics-operator',
      name: 'costmanagement-metrics-operator',
      includesOverhead: true,
      optimizations: 3,
      momChange: -9.72,
      momPrevCost: '$3,517.70',
      cost: '$3,175.65',
      costPercent: '3.70',
    },
    {
      id: 'koku-metrics-operator',
      name: 'koku-metrics-operator',
      includesOverhead: true,
      optimizations: 0,
      momChange: -16.4,
      momPrevCost: '$2,986.94',
      cost: '$2,497.18',
      costPercent: '2.91',
    },
    {
      id: 'default',
      name: 'default',
      includesOverhead: true,
      optimizations: 0,
      momChange: -16.34,
      momPrevCost: '$2,868.16',
      cost: '$2,399.55',
      costPercent: '2.79',
    },
  ]; */

  // Transform clusters data for the UI
  const clusters: ClusterItem[] = dbClusters.map(cluster => {
    const percentage = (cluster.cost / totalOpenShiftCost) * 100;
    const prevCost = cluster.cost / (1 + (cluster.monthOverMonthChange / 100));
    
    return {
      id: cluster.id,
      name: cluster.displayName,
      clusterId: cluster.id,
      momChange: cluster.monthOverMonthChange,
      momPrevCost: dataService.formatCurrency(prevCost),
      cost: dataService.formatCurrency(cluster.cost),
      costPercent: percentage.toFixed(2),
    };
  });

  // Keep the original hardcoded clusters for now (commented out below)
  /* const clusters: ClusterItem[] = [
    {
      id: '023d9b0e-7ca6-481d-b04f-ea606becd54e',
      name: 'demolab',
      clusterId: '023d9b0e-7ca6-481d-b04f-ea606becd54e',
      momChange: -4.22,
      momPrevCost: '$63,279.28',
      cost: '$60,609.54',
      costPercent: '70.53',
    },
    {
      id: 'c32se93c-73z3-3s3d-cs23-d3245sj45349',
      name: 'OpenShift on GCP - Nise Populator',
      clusterId: 'c32se93c-73z3-3s3d-cs23-d3245sj45349',
      momChange: -4.49,
      momPrevCost: '$19,040.60',
      cost: '$18,185.87',
      costPercent: '21.16',
    },
    {
      id: '8a3e59b7-23a8-4ed1-b1cf-afd5afea54b9',
      name: 'Openshift on AWS',
      clusterId: '8a3e59b7-23a8-4ed1-b1cf-afd5afea54b9',
      momChange: -17.11,
      momPrevCost: '$6,551.61',
      cost: '$5,430.88',
      costPercent: '6.32',
    },
    {
      id: 'a94ea9bc-9e4f-4b91-89c2-c7099ec08427',
      name: 'OCP-OnPrem01',
      clusterId: 'a94ea9bc-9e4f-4b91-89c2-c7099ec08427',
      momChange: -3.23,
      momPrevCost: '$1,717.33',
      cost: '$1,661.94',
      costPercent: '1.93',
    },
    {
      id: 'eb93b259-1369-4f90-88ce-e68c6ba879a9',
      name: 'Openshift on Azure',
      clusterId: 'eb93b259-1369-4f90-88ce-e68c6ba879a9',
      momChange: 49.74,
      momPrevCost: '$28.27',
      cost: '$42.33',
      costPercent: '0.05',
    },
  ]; */

  // Transform nodes data for the UI
  const nodes: NodeItem[] = dbNodes.map(node => {
    const percentage = (node.cost / totalOpenShiftCost) * 100;
    const prevCost = node.monthOverMonthChange !== 0 
      ? node.cost / (1 + (node.monthOverMonthChange / 100))
      : 0;
    
    return {
      id: node.id,
      name: node.name,
      momChange: node.monthOverMonthChange !== 0 ? node.monthOverMonthChange : null,
      momPrevCost: prevCost > 0 ? dataService.formatCurrency(prevCost) : '',
      cost: dataService.formatCurrency(node.cost),
      costPercent: percentage.toFixed(2),
    };
  });

  const totalItems = groupBy === 'Project' ? projects.length : groupBy === 'Cluster' ? clusters.length : nodes.length;

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
          <BreadcrumbItem isActive>OpenShift</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          OpenShift
        </Title>
        <Content>
          View and manage cost data for your OpenShift clusters, projects, and nodes.
        </Content>
        
        {/* Tabs */}
        <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
          <Tabs activeKey={activeTab} onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}>
            <Tab eventKey={0} title="Cost overview" id="cost-overview-tab" />
            <Tab eventKey={1} title="Historical data" id="historical-data-tab" />
          </Tabs>
        </div>
        
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }} style={{ marginTop: '24px' }}>
          {/* Currency Row */}
          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                <Title headingLevel="h2" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                  Currency
                </Title>
                <Select
                  isOpen={currencyOpen}
                  onSelect={() => setCurrencyOpen(false)}
                  onOpenChange={(isOpen) => setCurrencyOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle 
                      ref={toggleRef} 
                      onClick={() => setCurrencyOpen(!currencyOpen)} 
                      isExpanded={currencyOpen}
                      style={{ width: '280px' }}
                    >
                      USD ($) - United States Dollar
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="USD">USD ($) - United States Dollar</SelectOption>
                  </SelectList>
                </Select>
              </Flex>
            </FlexItem>
          </Flex>

          {/* Integration Status and Total Cost Row */}
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <span style={{ marginRight: '0.5rem' }}>Integrations status</span>
              <span style={{ marginRight: '0.5rem' }}>5</span>
              <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" style={{ fontSize: '0.75rem', paddingRight: '0.5rem' }} />
              <span style={{ marginRight: '0.5rem' }}>7</span>
              <ExclamationTriangleIcon color="var(--pf-t--global--icon--color--status--warning--default)" style={{ fontSize: '0.75rem', paddingRight: '0.5rem' }} />
              <Button variant="link" style={{ fontSize: 'var(--pf-t--global--font--size--body--sm)', padding: 0 }}>
                View all
              </Button>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }} style={{ textAlign: 'end' }}>
              <Title headingLevel="h2" size="3xl" style={{ marginBottom: 0 }}>$87,851.85</Title>
            </FlexItem>
          </Flex>

          {/* Controls and Date Row */}
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                {/* Group by */}
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                    Group by
                  </Title>
                  <Select
                    isOpen={groupByOpen}
                    onSelect={(_event, value) => {
                      setGroupBy(value as string);
                      setGroupByOpen(false);
                    }}
                    onOpenChange={(isOpen) => setGroupByOpen(isOpen)}
                    selected={groupBy}
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setGroupByOpen(!groupByOpen)} 
                        isExpanded={groupByOpen}
                      >
                        {groupBy}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Cluster">Cluster</SelectOption>
                      <SelectOption value="Node">Node</SelectOption>
                      <SelectOption value="Project">Project</SelectOption>
                      <SelectOption value="Tag">Tag</SelectOption>
                    </SelectList>
                  </Select>
                </Flex>

                {/* Tag Key Selector - only show when Tag is selected */}
                {groupBy === 'Tag' && (
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <Select
                      isOpen={tagKeyOpen}
                      onSelect={(_event, value) => {
                        setTagKey(value as string);
                        setTagKeyOpen(false);
                      }}
                      onOpenChange={(isOpen) => setTagKeyOpen(isOpen)}
                      selected={tagKey}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setTagKeyOpen(!tagKeyOpen)}
                          isExpanded={tagKeyOpen}
                          variant="typeahead"
                        >
                          <SearchInput
                            value={tagKey}
                            onChange={(_event, value) => setTagKey(value)}
                            onClear={() => setTagKey('')}
                            placeholder="Choose key"
                            aria-label="Type to filter"
                          />
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="app">app</SelectOption>
                        <SelectOption value="environment">environment</SelectOption>
                        <SelectOption value="version">version</SelectOption>
                      </SelectList>
                    </Select>
                  </Flex>
                )}

                {/* Overhead cost */}
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <Title headingLevel="h2" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                    Overhead cost
                  </Title>
                  <Select
                    isOpen={overheadOpen}
                    onSelect={() => setOverheadOpen(false)}
                    onOpenChange={(isOpen) => setOverheadOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setOverheadOpen(!overheadOpen)} 
                        isExpanded={overheadOpen}
                      >
                        Distribute through cost models
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="distribute">Distribute through cost models</SelectOption>
                    </SelectList>
                  </Select>
                </Flex>

                {/* Date Range */}
                <Select
                  isOpen={dateRangeOpen}
                  onSelect={() => setDateRangeOpen(false)}
                  onOpenChange={(isOpen) => setDateRangeOpen(isOpen)}
                  toggle={(toggleRef) => (
                    <MenuToggle 
                      ref={toggleRef} 
                      onClick={() => setDateRangeOpen(!dateRangeOpen)} 
                      isExpanded={dateRangeOpen}
                    >
                      Month to date
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="mtd">Month to date</SelectOption>
                    <SelectOption value="ytd">Year to date</SelectOption>
                  </SelectList>
                </Select>
              </Flex>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }} style={{ textAlign: 'end' }}>
              October 1 – 24
            </FlexItem>
          </Flex>
        </Flex>
      </div>

      {/* Content Section */}
      <div className="template-page-content">
        <TabContent eventKey={0} id="cost-overview-content" activeKey={activeTab} hidden={activeTab !== 0}>
          <Card>
          <CardBody>
            {/* Toolbar */}
            <Toolbar id="openshift-toolbar">
              <ToolbarContent>
                <ToolbarItem>
                  <Checkbox
                    id="bulk-select"
                    aria-label="Select all items"
                    isChecked={selectAll}
                    onChange={(_event, checked) => setSelectAll(checked)}
                  />
                </ToolbarItem>

                <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <Select
                        isOpen={categoryOpen}
                        onSelect={() => setCategoryOpen(false)}
                        onOpenChange={(isOpen) => setCategoryOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setCategoryOpen(!categoryOpen)} 
                            isExpanded={categoryOpen}
                            icon={<FilterIcon />}
                          >
                            {groupBy}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value={groupBy}>{groupBy}</SelectOption>
                        </SelectList>
                      </Select>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Select
                        isOpen={operatorOpen}
                        onSelect={() => setOperatorOpen(false)}
                        onOpenChange={(isOpen) => setOperatorOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setOperatorOpen(!operatorOpen)} 
                            isExpanded={operatorOpen}
                          >
                            includes
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="includes">includes</SelectOption>
                          <SelectOption value="excludes">excludes</SelectOption>
                        </SelectList>
                      </Select>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder={`Filter by ${groupBy.toLowerCase()}`}
                        value={searchValue}
                        onChange={(_event, value) => setSearchValue(value)}
                        onClear={() => setSearchValue('')}
                        aria-label={`Input for ${groupBy.toLowerCase()} name`}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarToggleGroup>

                <ToolbarGroup>
                  <ToolbarItem visibility={{ default: 'hidden', xl: 'visible', '2xl': 'visible', lg: 'hidden' }}>
                    <Button variant="link">Manage columns</Button>
                  </ToolbarItem>
                </ToolbarGroup>

                <ToolbarGroup>
                  <ToolbarItem visibility={{ default: 'hidden', xl: 'visible', '2xl': 'visible', lg: 'hidden' }} style={{ paddingTop: '8px' }}>
                    <Switch
                      id="platform-costs"
                      label="Sum platform costs"
                      isChecked={sumPlatformCosts}
                      onChange={(_event, checked) => setSumPlatformCosts(checked)}
                    />
                  </ToolbarItem>
                </ToolbarGroup>

                <ToolbarGroup>
                  <ToolbarItem>
                    <Button variant="plain" aria-label="Export data" isDisabled>
                      <ExportIcon />
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem visibility={{ default: 'visible', xl: 'hidden' }}>
                    <MenuToggle variant="plain" aria-label="More options">
                      <EllipsisVIcon />
                    </MenuToggle>
                  </ToolbarItem>
                </ToolbarGroup>

                <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={totalItems}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_evt, newPage) => setPage(newPage)}
                    widgetId="openshift-pagination-top"
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
            <Table aria-label="OpenShift details table" variant="compact" gridBreakPoint="grid-2xl">
              <Thead>
                <Tr>
                  <Th />
                  <Th sort={getSortParams(1)} modifier="nowrap">
                    {groupBy === 'Cluster' ? 'Cluster names' : groupBy === 'Node' ? 'Node names' : 'Project names'}
                  </Th>
                  {groupBy === 'Project' && <Th modifier="nowrap" />}
                  {groupBy === 'Project' && <Th modifier="nowrap">Optimizations</Th>}
                  <Th modifier="nowrap">Month over month change</Th>
                  <Th 
                    sort={getSortParams(groupBy === 'Project' ? 5 : 3)} 
                    modifier="nowrap"
                    style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', paddingRight: 0 }}
                  >
                    Cost
                  </Th>
                  <Th modifier="nowrap" />
                </Tr>
              </Thead>
              <Tbody>
                {groupBy === 'Project' && projects.map((project, index) => (
                  <Tr key={project.id}>
                    <Td 
                      select={{
                        rowIndex: index,
                        onSelect: () => {},
                        isSelected: false,
                      }}
                    />
                    <Td dataLabel="Project names" modifier="nowrap">
                      <Link to={`/cost-management-integrated/openshift/breakdown?breakdown_title=${project.name}&group_by[project]=${project.id}&id=${project.id}`}>
                        {project.name}
                      </Link>
                    </Td>
                    <Td modifier="nowrap">
                      {project.includesOverhead && (
                        <Label color="orange" variant="outline">Includes overhead</Label>
                      )}
                    </Td>
                    <Td dataLabel="Optimizations" modifier="nowrap">
                      {project.optimizations > 0 ? (
                        <Link to={`/cost-management-integrated/openshift/breakdown?breakdown_title=${project.name}&group_by[project]=${project.id}&id=${project.id}&optimizationsTab=true`}>
                          {project.optimizations}
                        </Link>
                      ) : (
                        project.optimizations
                      )}
                    </Td>
                    <Td dataLabel="Month over month change" modifier="nowrap">
                      <div>
                        <div style={{ color: project.momChange < 0 ? 'var(--pf-t--global--color--status--success--default)' : 'var(--pf-t--global--color--status--danger--default)' }}>
                          {Math.abs(project.momChange)} %
                          {project.momChange < 0 ? (
                            <SortAmountDownIcon style={{ marginLeft: '4px', position: 'relative', bottom: '0.25rem' }} />
                          ) : (
                            <SortAmountUpIcon style={{ marginLeft: '4px', position: 'relative' }} />
                          )}
                        </div>
                        <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                          {project.momPrevCost} for September 1 – 23
                        </div>
                      </div>
                    </Td>
                    <Td dataLabel="Cost" modifier="nowrap" style={{ textAlign: 'right' }}>
                      {project.cost}
                      <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                        {project.costPercent} % of cost
                      </div>
                    </Td>
                    <Td isActionCell>
                      <MenuToggle variant="plain" aria-label="More options">
                        <EllipsisVIcon />
                      </MenuToggle>
                    </Td>
                  </Tr>
                ))}
                
                {groupBy === 'Cluster' && clusters.map((cluster, index) => (
                  <Tr key={cluster.id}>
                    <Td 
                      select={{
                        rowIndex: index,
                        onSelect: () => {},
                        isSelected: false,
                      }}
                    />
                    <Td dataLabel="Cluster names" modifier="nowrap">
                      <Link to={`/cost-management-integrated/openshift/cluster/${cluster.clusterId}`}>
                        {cluster.name}
                      </Link>
                      <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                        {cluster.clusterId}
                      </div>
                    </Td>
                    <Td dataLabel="Month over month change" modifier="nowrap">
                      <div>
                        <div style={{ color: cluster.momChange < 0 ? 'var(--pf-t--global--color--status--success--default)' : 'var(--pf-t--global--color--status--danger--default)' }}>
                          {Math.abs(cluster.momChange)} %
                          {cluster.momChange < 0 ? (
                            <SortAmountDownIcon style={{ marginLeft: '4px', position: 'relative', bottom: '0.25rem' }} />
                          ) : (
                            <SortAmountUpIcon style={{ marginLeft: '4px', position: 'relative' }} />
                          )}
                        </div>
                        <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                          {cluster.momPrevCost} for September 1 – 23
                        </div>
                      </div>
                    </Td>
                    <Td dataLabel="Cost" modifier="nowrap" style={{ textAlign: 'right' }}>
                      {cluster.cost}
                      <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                        {cluster.costPercent} % of cost
                      </div>
                    </Td>
                    <Td isActionCell>
                      <MenuToggle variant="plain" aria-label="More options">
                        <EllipsisVIcon />
                      </MenuToggle>
                    </Td>
                  </Tr>
                ))}
                
                {groupBy === 'Node' && nodes.map((node, index) => (
                  <Tr key={node.id}>
                    <Td 
                      select={{
                        rowIndex: index,
                        onSelect: () => {},
                        isSelected: false,
                      }}
                    />
                    <Td dataLabel="Node names" modifier="nowrap">
                      <Link to={`/cost-management-integrated/openshift/node/${node.id}`}>
                        {node.name}
                      </Link>
                    </Td>
                    <Td dataLabel="Month over month change" modifier="nowrap">
                      {node.momChange === null ? (
                        'No data available for September 1 – 23'
                      ) : (
                        <div>
                          <div style={{ color: node.momChange < 0 ? 'var(--pf-t--global--color--status--success--default)' : 'var(--pf-t--global--color--status--danger--default)' }}>
                            {Math.abs(node.momChange)} %
                            {node.momChange < 0 ? (
                              <SortAmountDownIcon style={{ marginLeft: '4px', position: 'relative', bottom: '0.25rem' }} />
                            ) : (
                              <SortAmountUpIcon style={{ marginLeft: '4px', position: 'relative' }} />
                            )}
                          </div>
                          <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                            {node.momPrevCost} for September 1 – 23
                          </div>
                        </div>
                      )}
                    </Td>
                    <Td dataLabel="Cost" modifier="nowrap" style={{ textAlign: 'right' }}>
                      {node.cost}
                      <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                        {node.costPercent} % of cost
                      </div>
                    </Td>
                    <Td isActionCell>
                      <MenuToggle variant="plain" aria-label="More options">
                        <EllipsisVIcon />
                      </MenuToggle>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Bottom Pagination */}
            <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
              <Pagination
                itemCount={totalItems}
                perPage={perPage}
                page={page}
                onSetPage={(_evt, newPage) => setPage(newPage)}
                widgetId="openshift-pagination-bottom"
                onPerPageSelect={(_evt, newPerPage, newPage) => {
                  setPerPage(newPerPage);
                  setPage(newPage);
                }}
                variant={PaginationVariant.bottom}
                isCompact={false}
              />
            </div>
          </CardBody>
        </Card>
        </TabContent>

        <TabContent eventKey={1} id="historical-data-content" activeKey={activeTab} hidden={activeTab !== 1}>
          <Card>
            <CardBody>
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                Historical data content
              </div>
            </CardBody>
          </Card>
        </TabContent>
      </div>
    </>
  );
};

export { CostManagementOpenShift };

