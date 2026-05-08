import * as React from 'react';
import {
  Title,
  Content,
  Card,
  CardBody,
  CardTitle,
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
  Checkbox,
  Label,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import {
  FilterIcon,
  ExportIcon,
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

interface ProjectData {
  id: string;
  name: string;
  includesOverhead: boolean;
  dailyCosts: { [key: string]: string };
}

const CostExplorer: React.FunctionComponent = () => {
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [billingPerspectiveOpen, setBillingPerspectiveOpen] = React.useState(false);
  const [billingPerspective, setBillingPerspective] = React.useState<'calendar' | 'billing'>('calendar');
  const [perspectiveOpen, setPerspectiveOpen] = React.useState(false);
  const [groupByOpen, setGroupByOpen] = React.useState(false);
  const [overheadOpen, setOverheadOpen] = React.useState(false);
  const [dateRangeOpen, setDateRangeOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [operatorOpen, setOperatorOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [sortIndex, setSortIndex] = React.useState<number>(1);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [selectAll, setSelectAll] = React.useState(false);

  // Get buffer configuration from localStorage
  const getBufferDays = (): { before: number; after: number } => {
    try {
      const savedConfig = localStorage.getItem('bufferConfiguration');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        if (config.bufferMode === 'default') {
          return { before: 3, after: 3 };
        } else if (config.bufferMode === 'custom') {
          if (config.customMode === 'all') {
            return {
              before: parseInt(config.allProvidersBefore || '3', 10),
              after: parseInt(config.allProvidersAfter || '3', 10),
            };
          }
        }
      }
    } catch (e) {
      console.error('Failed to load buffer configuration:', e);
    }
    return { before: 3, after: 3 }; // Default fallback
  };
  
  const bufferDays = getBufferDays();
  
  // Generate date columns based on perspective and buffer
  const generateDateColumns = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const monthName = now.toLocaleDateString('en-US', { month: 'short' });
    const currentDay = now.getDate();
    const columns: string[] = [];
    
    if (billingPerspective === 'calendar') {
      // Standard calendar month: Oct 1 - Oct 24
      for (let i = 1; i <= currentDay; i++) {
        columns.push(`${monthName} ${i}`);
      }
    } else {
      // Billing mode: includes buffer days from previous month
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const prevMonthDate = new Date(prevMonthYear, prevMonth);
      const prevMonthName = prevMonthDate.toLocaleDateString('en-US', { month: 'short' });
      const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
      
      // Add days from previous month (buffer before)
      const startDay = lastDayOfPrevMonth - (bufferDays.before - 1);
      for (let i = startDay; i <= lastDayOfPrevMonth; i++) {
        columns.push(`${prevMonthName} ${i}`);
      }
      
      // Add days from current month
      for (let i = 1; i <= currentDay; i++) {
        columns.push(`${monthName} ${i}`);
      }
    }
    
    return columns;
  };
  
  const dateColumns = generateDateColumns();
  
  // Get date range text based on perspective
  const getDateRangeText = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const currentDay = now.getDate();
    
    if (billingPerspective === 'calendar') {
      // Standard calendar month - use full month name
      return `${monthName} 1 – ${currentDay}`;
    } else {
      // Billing with buffer
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const prevMonthName = new Date(prevMonthYear, prevMonth).toLocaleDateString('en-US', { month: 'long' });
      const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
      
      // Calculate start date based on buffer (days before month end)
      const bufferStart = lastDayOfPrevMonth - (bufferDays.before - 1);
      
      return `${prevMonthName} ${bufferStart} – ${monthName} ${currentDay}`;
    }
  };
  
  const dateRangeText = getDateRangeText();

  // Mock project data
  const projects: ProjectData[] = [
    {
      id: 'netobserv',
      name: 'netobserv',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$1,095.80', 'Oct 2': '$983.18', 'Oct 3': '$1,040.15', 'Oct 4': '$1,101.70',
        'Oct 5': '$1,066.17', 'Oct 6': '$1,088.48', 'Oct 7': '$1,082.90', 'Oct 8': '$1,012.95',
        'Oct 9': '$916.40', 'Oct 10': '$998.69', 'Oct 11': '$1,114.25', 'Oct 12': '$1,118.74',
        'Oct 13': '$1,002.28', 'Oct 14': '$975.99', 'Oct 15': '$697.76', 'Oct 16': '$898.92',
        'Oct 17': '$1,113.52', 'Oct 18': '$1,168.16', 'Oct 19': '$1,169.62', 'Oct 20': '$1,154.92',
        'Oct 21': '$1,062.29', 'Oct 22': '$1,064.05', 'Oct 23': '$515.33',
      }
    },
    {
      id: 'netobserv-privileged',
      name: 'netobserv-privileged',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$958.54', 'Oct 2': '$859.94', 'Oct 3': '$910.95', 'Oct 4': '$964.27',
        'Oct 5': '$933.01', 'Oct 6': '$951.82', 'Oct 7': '$949.73', 'Oct 8': '$886.89',
        'Oct 9': '$791.42', 'Oct 10': '$865.07', 'Oct 11': '$975.92', 'Oct 12': '$979.71',
        'Oct 13': '$878.01', 'Oct 14': '$851.59', 'Oct 15': '$610.85', 'Oct 16': '$788.00',
        'Oct 17': '$991.31', 'Oct 18': '$1,023.23', 'Oct 19': '$1,023.98', 'Oct 20': '$1,012.63',
        'Oct 21': '$937.75', 'Oct 22': '$938.22', 'Oct 23': '$451.99',
      }
    },
    {
      id: 'analytics',
      name: 'analytics',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$225.61', 'Oct 2': '$288.94', 'Oct 3': '$288.91', 'Oct 4': '$295.74',
        'Oct 5': '$311.20', 'Oct 6': '$290.73', 'Oct 7': '$290.70', 'Oct 8': '$311.20',
        'Oct 9': '$311.16', 'Oct 10': '$311.22', 'Oct 11': '$288.99', 'Oct 12': '$290.69',
        'Oct 13': '$295.75', 'Oct 14': '$311.19', 'Oct 15': '$290.68', 'Oct 16': '$311.22',
        'Oct 17': '$290.69', 'Oct 18': '$295.77', 'Oct 19': '$295.71', 'Oct 20': '$295.72',
        'Oct 21': '$295.72', 'Oct 22': '$247.64', 'Oct 23': '$159.54',
      }
    },
    {
      id: 'thanos',
      name: 'thanos',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$289.04', 'Oct 2': '$256.66', 'Oct 3': '$275.43', 'Oct 4': '$281.01',
        'Oct 5': '$270.90', 'Oct 6': '$289.25', 'Oct 7': '$286.59', 'Oct 8': '$270.08',
        'Oct 9': '$267.70', 'Oct 10': '$291.87', 'Oct 11': '$284.42', 'Oct 12': '$283.20',
        'Oct 13': '$259.33', 'Oct 14': '$268.01', 'Oct 15': '$187.44', 'Oct 16': '$248.29',
        'Oct 17': '$290.91', 'Oct 18': '$297.09', 'Oct 19': '$296.69', 'Oct 20': '$313.81',
        'Oct 21': '$285.74', 'Oct 22': '$287.39', 'Oct 23': '$133.73',
      }
    },
    {
      id: 'cost-management',
      name: 'cost-management',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$158.40', 'Oct 2': '$253.91', 'Oct 3': '$253.91', 'Oct 4': '$253.91',
        'Oct 5': '$253.92', 'Oct 6': '$253.93', 'Oct 7': '$271.53', 'Oct 8': '$253.92',
        'Oct 9': '$253.91', 'Oct 10': '$253.93', 'Oct 11': '$253.93', 'Oct 12': '$253.92',
        'Oct 13': '$253.92', 'Oct 14': '$253.91', 'Oct 15': '$253.91', 'Oct 16': '$253.93',
        'Oct 17': '$253.92', 'Oct 18': '$253.92', 'Oct 19': '$253.90', 'Oct 20': '$253.92',
        'Oct 21': '$253.92', 'Oct 22': '$185.69', 'Oct 23': '$79.77',
      }
    },
    {
      id: 'fall',
      name: 'fall',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$115.43', 'Oct 2': '$150.78', 'Oct 3': '$150.80', 'Oct 4': '$150.79',
        'Oct 5': '$150.80', 'Oct 6': '$150.82', 'Oct 7': '$150.80', 'Oct 8': '$150.80',
        'Oct 9': '$150.80', 'Oct 10': '$150.79', 'Oct 11': '$150.78', 'Oct 12': '$150.79',
        'Oct 13': '$150.81', 'Oct 14': '$150.78', 'Oct 15': '$150.78', 'Oct 16': '$150.80',
        'Oct 17': '$150.81', 'Oct 18': '$150.82', 'Oct 19': '$150.80', 'Oct 20': '$150.76',
        'Oct 21': '$150.81', 'Oct 22': '$125.52', 'Oct 23': '$79.77',
      }
    },
    {
      id: 'snowdown',
      name: 'snowdown',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$115.43', 'Oct 2': '$150.78', 'Oct 3': '$150.80', 'Oct 4': '$150.79',
        'Oct 5': '$150.80', 'Oct 6': '$150.82', 'Oct 7': '$150.80', 'Oct 8': '$150.80',
        'Oct 9': '$150.80', 'Oct 10': '$150.79', 'Oct 11': '$150.78', 'Oct 12': '$150.79',
        'Oct 13': '$150.81', 'Oct 14': '$150.78', 'Oct 15': '$150.78', 'Oct 16': '$150.80',
        'Oct 17': '$150.81', 'Oct 18': '$150.82', 'Oct 19': '$150.80', 'Oct 20': '$150.76',
        'Oct 21': '$150.81', 'Oct 22': '$125.52', 'Oct 23': '$79.77',
      }
    },
    {
      id: 'costmanagement-metrics-operator',
      name: 'costmanagement-metrics-operator',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$144.67', 'Oct 2': '$132.31', 'Oct 3': '$133.01', 'Oct 4': '$158.42',
        'Oct 5': '$156.52', 'Oct 6': '$137.48', 'Oct 7': '$139.00', 'Oct 8': '$134.16',
        'Oct 9': '$116.29', 'Oct 10': '$136.54', 'Oct 11': '$160.47', 'Oct 12': '$167.82',
        'Oct 13': '$138.63', 'Oct 14': '$133.10', 'Oct 15': '$89.29', 'Oct 16': '$124.59',
        'Oct 17': '$157.15', 'Oct 18': '$166.25', 'Oct 19': '$168.88', 'Oct 20': '$147.50',
        'Oct 21': '$137.62', 'Oct 22': '$126.59', 'Oct 23': '$69.34',
      }
    },
    {
      id: 'koku-metrics-operator',
      name: 'koku-metrics-operator',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$144.05', 'Oct 2': '$126.86', 'Oct 3': '$136.40', 'Oct 4': '$139.87',
        'Oct 5': '$134.42', 'Oct 6': '$144.15', 'Oct 7': '$142.54', 'Oct 8': '$134.26',
        'Oct 9': '$132.98', 'Oct 10': '$144.06', 'Oct 11': '$140.92', 'Oct 12': '$140.44',
        'Oct 13': '$126.00', 'Oct 14': '$132.53', 'Oct 15': '$89.51', 'Oct 16': '$50.83',
        'Oct 17': '$92.29', 'Oct 18': '$0.01', 'Oct 19': '$0.01', 'Oct 20': '$0.01',
        'Oct 21': '$136.28', 'Oct 22': '$142.47', 'Oct 23': '$66.27',
      }
    },
    {
      id: 'default',
      name: 'default',
      includesOverhead: true,
      dailyCosts: {
        'Oct 1': '$135.52', 'Oct 2': '$118.73', 'Oct 3': '$126.80', 'Oct 4': '$137.04',
        'Oct 5': '$131.30', 'Oct 6': '$134.50', 'Oct 7': '$136.19', 'Oct 8': '$119.51',
        'Oct 9': '$125.54', 'Oct 10': '$144.70', 'Oct 11': '$141.20', 'Oct 12': '$140.63',
        'Oct 13': '$386.09', 'Oct 14': '$133.12', 'Oct 15': '$84.87', 'Oct 16': '$91.15',
        'Oct 17': '$112.52', 'Oct 18': '$0.04', 'Oct 19': '$0.04', 'Oct 20': '$0.04',
        'Oct 21': '$0.04', 'Oct 22': '$0.00', 'Oct 23': '$0.00',
      }
    },
  ];

  const totalItems = 107;

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
          <BreadcrumbItem to="/cost-management/overview">Cost Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Cost Explorer</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Cost Explorer
        </Title>
        <Content>
          <p>Explore and analyze cost data across projects, clusters, and time periods.</p>
        </Content>
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

          {/* Second Row: Perspective, Group by, Overhead cost */}
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
            {/* Perspective */}
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <Title headingLevel="h3" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                Perspective
              </Title>
              <Select
                isOpen={perspectiveOpen}
                onSelect={() => setPerspectiveOpen(false)}
                onOpenChange={(isOpen) => setPerspectiveOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setPerspectiveOpen(!perspectiveOpen)}
                    isExpanded={perspectiveOpen}
                  >
                    All OpenShift
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="all">All OpenShift</SelectOption>
                </SelectList>
              </Select>
            </Flex>

            {/* Group by */}
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <Title headingLevel="h3" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                Group by
              </Title>
              <Select
                isOpen={groupByOpen}
                onSelect={() => setGroupByOpen(false)}
                onOpenChange={(isOpen) => setGroupByOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setGroupByOpen(!groupByOpen)}
                    isExpanded={groupByOpen}
                  >
                    Project
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="Project">Project</SelectOption>
                  <SelectOption value="Cluster">Cluster</SelectOption>
                </SelectList>
              </Select>
            </Flex>

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
          </Flex>

          {/* Third Row: Filters and Total Cost */}
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Toolbar id="cost-explorer-top-toolbar">
                <ToolbarContent>
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
                              Project
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            <SelectOption value="Project">Project</SelectOption>
                            <SelectOption value="Cluster">Cluster</SelectOption>
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
                          placeholder="Filter by project"
                          value={searchValue}
                          onChange={(_event, value) => setSearchValue(value)}
                          onClear={() => setSearchValue('')}
                        />
                      </ToolbarItem>
                    </ToolbarGroup>
                  </ToolbarToggleGroup>

                  <ToolbarGroup>
                    <ToolbarItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <Title headingLevel="h2" size="md">
                          Period type
                        </Title>
                        <Select
                          isOpen={billingPerspectiveOpen}
                          onSelect={(_event, value) => {
                            setBillingPerspective(value as 'calendar' | 'billing');
                            setBillingPerspectiveOpen(false);
                          }}
                          onOpenChange={(isOpen) => setBillingPerspectiveOpen(isOpen)}
                          selected={billingPerspective}
                          toggle={(toggleRef) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setBillingPerspectiveOpen(!billingPerspectiveOpen)}
                              isExpanded={billingPerspectiveOpen}
                            >
                              {billingPerspective === 'calendar' ? 'Calendar' : 'Billing'}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            <SelectOption value="calendar" description="Standard monthly periods (1st to last day of month). Shows when services were used.">
                              Calendar
                            </SelectOption>
                            <SelectOption 
                              value="billing" 
                              description={
                                <>
                                  Includes buffer zones (default: 3 days before/after month boundaries) to match your invoice. <Link to="/cost-management/settings">Customize in Settings</Link>.
                                </>
                              }
                            >
                              Billing
                            </SelectOption>
                          </SelectList>
                        </Select>
                      </Flex>
                    </ToolbarItem>
                    <ToolbarItem>
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
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>
            </FlexItem>

            <FlexItem>
              <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsFlexEnd' }}>
                <FlexItem>
                  <Title headingLevel="h2" size="4xl" style={{ marginTop: 0, marginBottom: 0 }}>
                    $91,265.28
                  </Title>
                </FlexItem>
                <FlexItem>
                  {dateRangeText}
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </Flex>
      </div>

      {/* Content Section */}
      <div className="template-page-content">
        {/* Chart Card */}
        <Card style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
          <CardBody>
            <CardTitle>
              <Title headingLevel="h3" size="md">All OpenShift - Top 5 Costliest</Title>
            </CardTitle>
            <div style={{
              height: '300px',
              border: '1px dashed var(--pf-t--global--border--color--100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 'var(--pf-t--global--spacer--md)'
            }}>
              Stacked Bar Chart Placeholder (netobserv, netobserv-privileged, analytics, thanos, cost-management, 102 Others)
            </div>
          </CardBody>
        </Card>

        {/* Table Card */}
        <Card>
          <CardBody>
            {/* Toolbar */}
            <Toolbar id="explorer-toolbar">
              <ToolbarContent>
                <ToolbarItem>
                  <Checkbox
                    id="bulk-select"
                    aria-label="Select all items"
                    isChecked={selectAll}
                    onChange={(_event, checked) => setSelectAll(checked)}
                  />
                </ToolbarItem>

                <ToolbarGroup>
                  <ToolbarItem>
                    <Button variant="plain" aria-label="Export data" isDisabled>
                      <ExportIcon />
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>

                <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={totalItems}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_evt, newPage) => setPage(newPage)}
                    widgetId="explorer-pagination-top"
                    onPerPageSelect={(_evt, newPerPage, newPage) => {
                      setPerPage(newPerPage);
                      setPage(newPage);
                    }}
                    isCompact
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            {/* Table with horizontal scroll */}
            <div style={{ overflowX: 'auto' }}>
              <Table aria-label="Cost Explorer table" variant="compact" gridBreakPoint="grid-2xl">
                <Thead>
                  <Tr>
                    <Th
                      style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 3,
                        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                        minWidth: '53px'
                      }}
                    />
                    <Th
                      sort={getSortParams(1)}
                      modifier="nowrap"
                      style={{
                        position: 'sticky',
                        left: '53px',
                        zIndex: 3,
                        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                        minWidth: '254px'
                      }}
                    >
                      Project names
                    </Th>
                    <Th
                      modifier="nowrap"
                      style={{
                        position: 'sticky',
                        left: '307px',
                        zIndex: 3,
                        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                        minWidth: '145px',
                        borderRight: '1px solid var(--pf-t--global--border--color--default)'
                      }}
                    />
                    {dateColumns.map((date, index) => (
                      <Th key={date} sort={getSortParams(index + 3)} modifier="nowrap">
                        {date}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {projects.map((project, index) => (
                    <Tr key={project.id}>
                      <Td
                        select={{
                          rowIndex: index,
                          onSelect: () => {},
                          isSelected: false,
                        }}
                        style={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 2,
                          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                        }}
                      />
                      <Td
                        dataLabel="Project names"
                        modifier="nowrap"
                        style={{
                          position: 'sticky',
                          left: '53px',
                          zIndex: 2,
                          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                        }}
                      >
                        {project.name}
                      </Td>
                      <Td
                        modifier="nowrap"
                        style={{
                          position: 'sticky',
                          left: '307px',
                          zIndex: 2,
                          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                          borderRight: '1px solid var(--pf-t--global--border--color--default)'
                        }}
                      >
                        {project.includesOverhead && (
                          <Label color="orange" variant="outline">Includes overhead</Label>
                        )}
                      </Td>
                      {dateColumns.map((date) => (
                        <Td key={date} dataLabel={date} modifier="nowrap">
                          {project.dailyCosts[date]}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>

            {/* Bottom Pagination */}
            <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
              <Pagination
                itemCount={totalItems}
                perPage={perPage}
                page={page}
                onSetPage={(_evt, newPage) => setPage(newPage)}
                widgetId="explorer-pagination-bottom"
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
      </div>
    </>
  );
};

export { CostExplorer };

