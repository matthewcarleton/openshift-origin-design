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
  Checkbox,
  Label,
  Popover,
  Divider,
  SelectGroup,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { 
  FilterIcon, 
  ExportIcon, 
  EllipsisVIcon,
  CheckCircleIcon,
  PauseIcon,
  SortAmountDownIcon,
  OutlinedQuestionCircleIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { dataService } from '../../../data/dataService';

interface AccountItem {
  id: string;
  name: string;
  momChange: number;
  momPrevCost: string;
  cost: string;
  costPercent: string;
  hasCrossOver: boolean;
  crossOverAmount: number;
  crossOverDirection: 'to-next-month' | 'from-prev-month';
  crossOverNote?: string;
  crossOverPeriod?: {
    usageDates: string[];
    invoiceMonth: string;
    daysInThreshold: number;
  };
}

const GCP: React.FunctionComponent = () => {
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [groupByOpen, setGroupByOpen] = React.useState(false);
  const [groupBy, setGroupBy] = React.useState('Account');
  const [dateRangeOpen, setDateRangeOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState('mtd');
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [operatorOpen, setOperatorOpen] = React.useState(false);
  const [perspectiveOpen, setPerspectiveOpen] = React.useState(false);
  const [perspective, setPerspective] = React.useState<'calendar' | 'billing'>('calendar');
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [sortIndex, setSortIndex] = React.useState<number>(3);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [selectAll, setSelectAll] = React.useState(false);

  // Get data from database
  const dbAccounts = dataService.getGCPAccounts();
  const totalGCPCost = dataService.getGCPTotalCost();
  
  // Get buffer configuration for GCP from localStorage
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
          } else if (config.customMode === 'per-provider') {
            return {
              before: parseInt(config.providerBuffers?.gcp?.before || '3', 10),
              after: parseInt(config.providerBuffers?.gcp?.after || '3', 10),
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
  
  // Calculate total cost based on perspective
  const getTotalCost = () => {
    if (perspective === 'calendar') {
      // Calendar: sum of usage date costs
      return dbAccounts.reduce((sum, account) => sum + account.usageDateCost, 0);
    } else {
      // Billing: sum of invoice month costs (includes cross-over)
      return dbAccounts.reduce((sum, account) => sum + account.invoiceMonthCost, 0);
    }
  };
  
  // Get date range text based on perspective and buffer configuration
  const getDateRangeText = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const monthName = now.toLocaleDateString('en-US', { month: 'short' });
    const currentDay = now.getDate();
    
    if (perspective === 'calendar') {
      // Standard calendar month
      return `${monthName} 1–${currentDay}, ${year}`;
    } else {
      // Billing with custom buffer
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const prevMonthName = new Date(prevMonthYear, prevMonth).toLocaleDateString('en-US', { month: 'short' });
      const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
      
      // Calculate start date based on buffer (days before month end)
      const bufferStart = lastDayOfPrevMonth - (bufferDays.before - 1);
      
      return `${prevMonthName} ${bufferStart}–${monthName} ${currentDay}, ${year}`;
    }
  };
  
  const displayTotal = getTotalCost();
  const dateRangeText = getDateRangeText();

  // Transform accounts data for the UI based on selected perspective
  const accounts: AccountItem[] = dbAccounts.map(account => {
    // Calendar = usage date costs (when services were used)
    // Billing = invoice month costs (includes 3-day buffer, matches invoice)
    const displayCost = perspective === 'calendar' ? account.usageDateCost : account.invoiceMonthCost;
    const percentage = (displayCost / totalGCPCost) * 100;
    
    // Calculate MoM based on perspective
    // For calendar: compare actual usage periods (excluding 3-day threshold)
    // For billing: compare full invoice amounts (includes cross-over)
    let momChange = account.monthOverMonthChange;
    let prevCost = displayCost / (1 + (momChange / 100));
    
    // Adjust MoM calculation for calendar perspective if there's cross-over
    if (perspective === 'calendar' && account.hasCrossOver) {
      // When comparing calendar dates, we need to account for the 3-day threshold shift
      // Example: Oct usage (missing 29-31) vs Sept usage (missing 28-30)
      const adjustedMomChange = ((account.usageDateCost - account.invoiceMonthCost) / account.invoiceMonthCost) * 100;
      momChange = adjustedMomChange;
      prevCost = account.usageDateCost / (1 + (adjustedMomChange / 100));
    }
    
    return {
      id: account.billingAccountId,
      name: account.displayName,
      momChange: momChange,
      momPrevCost: dataService.formatCurrency(prevCost),
      cost: dataService.formatCurrency(displayCost),
      costPercent: percentage.toFixed(2),
      hasCrossOver: account.hasCrossOver,
      crossOverAmount: account.crossOverAmount,
      crossOverDirection: account.crossOverDirection,
      crossOverNote: account.crossOverNote,
      crossOverPeriod: account.crossOverPeriod,
    };
  });

  const totalItems = accounts.length;
  
  // Calculate total cross-over amount
  const totalCrossOver = dbAccounts.reduce((sum, account) => sum + (account.hasCrossOver ? account.crossOverAmount : 0), 0);
  const hasCrossOverData = dbAccounts.some(account => account.hasCrossOver);

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
          <BreadcrumbItem isActive>Google Cloud</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Google Cloud
        </Title>
        <Content>
          <p>View and manage GCP cost data, accounts, and integrations.</p>
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

          {/* Integration Status and Total Cost Row */}
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <span style={{ marginRight: '0.5rem' }}>Integrations status</span>
              <span style={{ marginRight: '0.5rem' }}>1</span>
              <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" style={{ fontSize: '0.75rem', paddingRight: '0.5rem' }} />
              <span style={{ marginRight: '0.5rem' }}>1</span>
              <PauseIcon style={{ fontSize: '0.75rem', paddingRight: '0.5rem' }} />
              <Button variant="link" style={{ fontSize: 'var(--pf-t--global--font--size--body--sm)', padding: 0 }}>
                View all
              </Button>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }} style={{ textAlign: 'end' }}>
              <Title headingLevel="h2" size="3xl" style={{ marginBottom: 0 }}>${displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Title>
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
                      <SelectOption value="Account">Account</SelectOption>
                      <SelectOption value="Google Cloud project">Google Cloud project</SelectOption>
                      <SelectOption value="Region">Region</SelectOption>
                      <SelectOption value="Service">Service</SelectOption>
                      <SelectOption value="Tag">Tag</SelectOption>
                    </SelectList>
                  </Select>
                </Flex>

                {/* Period Type Selector */}
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                    Period type
                  </Title>
                  <Select
                    isOpen={perspectiveOpen}
                    onSelect={(_event, value) => {
                      setPerspective(value as 'calendar' | 'billing');
                      setPerspectiveOpen(false);
                    }}
                    onOpenChange={(isOpen) => setPerspectiveOpen(isOpen)}
                    selected={perspective}
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setPerspectiveOpen(!perspectiveOpen)} 
                        isExpanded={perspectiveOpen}
                      >
                        {perspective === 'calendar' ? 'Calendar' : 'Billing'}
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
                            Includes buffer zones (default: 3 days before/after month boundaries) to match your invoice. <Link to="/cost-management-integrated/settings">Customize in Settings</Link>.
                          </>
                        }
                      >
                        Billing
                      </SelectOption>
                    </SelectList>
                  </Select>
                </Flex>

                {/* Date Range */}
                <Select
                  isOpen={dateRangeOpen}
                  onSelect={(_event, value) => {
                    setDateRange(value as string);
                    setDateRangeOpen(false);
                  }}
                  onOpenChange={(isOpen) => setDateRangeOpen(isOpen)}
                  selected={dateRange}
                  toggle={(toggleRef) => (
                    <MenuToggle 
                      ref={toggleRef} 
                      onClick={() => setDateRangeOpen(!dateRangeOpen)} 
                      isExpanded={dateRangeOpen}
                    >
                      {dateRange === 'mtd' ? 'Month to date' :
                       dateRange === 'this' ? 'This month' :
                       dateRange === 'prev' ? 'Previous month' :
                       'Month to date'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="mtd">Month to date</SelectOption>
                    <SelectOption value="this">This month</SelectOption>
                    <SelectOption value="prev">Previous month</SelectOption>
                  </SelectList>
                </Select>
              </Flex>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }} style={{ textAlign: 'end' }}>
              {dateRangeText}
            </FlexItem>
          </Flex>
        </Flex>
      </div>

      {/* Content Section */}
      <div className="template-page-content">
        <Card>
          <CardBody>
            {/* Toolbar */}
            <Toolbar id="gcp-toolbar">
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
                            Account
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="Account">Account</SelectOption>
                          <SelectOption value="Service">Service</SelectOption>
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
                        placeholder="Filter by account"
                        value={searchValue}
                        onChange={(_event, value) => setSearchValue(value)}
                        onClear={() => setSearchValue('')}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarToggleGroup>

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
                    widgetId="gcp-pagination-top"
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
            <Table aria-label="Google Cloud details table" variant="compact" gridBreakPoint="grid-2xl">
              <Thead>
                <Tr>
                  <Th />
                  <Th sort={getSortParams(1)} modifier="nowrap">Account names</Th>
                  <Th modifier="nowrap">{perspective === 'calendar' ? 'Month over month change' : 'Period over period change'}</Th>
                  <Th 
                    sort={getSortParams(3)} 
                    modifier="nowrap"
                    style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', paddingRight: 0 }}
                  >
                    Cost
                  </Th>
                  <Th modifier="nowrap" />
                </Tr>
              </Thead>
              <Tbody>
                {accounts.map((account, index) => (
                  <Tr key={account.id}>
                    <Td 
                      select={{
                        rowIndex: index,
                        onSelect: () => {},
                        isSelected: false,
                      }}
                    />
                    <Td dataLabel="Account names" modifier="nowrap">
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          {groupBy === 'Account' ? (
                            <Link to={`/cost-management-integrated/gcp/account-details/${account.id}`}>
                              {account.name}
                            </Link>
                          ) : (
                            <Link to={`/cost-management-integrated/gcp/breakdown?breakdown_title=${account.name}&group_by[account]=${account.id}&id=${account.id}`}>
                              {account.name}
                            </Link>
                          )}
                        </FlexItem>
                      </Flex>
                    </Td>
                    <Td dataLabel={perspective === 'calendar' ? 'Month over month change' : 'Period over period change'} modifier="nowrap">
                      <div>
                        {perspective === 'calendar' ? (
                          // Calendar mode: Show month over month change
                          <>
                            <div style={{ color: account.momChange < 0 ? 'var(--pf-t--global--color--status--success--default)' : 'var(--pf-t--global--color--status--danger--default)' }}>
                              {Math.abs(account.momChange).toFixed(1)} %
                              {account.momChange < 0 && (
                                <SortAmountDownIcon style={{ marginLeft: '4px', position: 'relative', bottom: '0.25rem' }} />
                              )}
                            </div>
                            <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                              {account.momPrevCost} for {account.hasCrossOver ? 'Sept 1 – 27 (calendar)' : 'September 1 – 23'}
                            </div>
                          </>
                        ) : (
                          // Billing mode: Show period over period change AND cross-over difference
                          <>
                            <div style={{ color: account.momChange < 0 ? 'var(--pf-t--global--color--status--success--default)' : 'var(--pf-t--global--color--status--danger--default)' }}>
                              {Math.abs(account.momChange).toFixed(1)} %
                              {account.momChange < 0 && (
                                <SortAmountDownIcon style={{ marginLeft: '4px', position: 'relative', bottom: '0.25rem' }} />
                              )}
                            </div>
                            <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                              {account.momPrevCost} for previous billing period
                            </div>
                            {account.hasCrossOver && (
                              <div style={{ color: 'var(--pf-t--global--icon--color--status--warning--default)', fontSize: '0.75rem', marginTop: '4px' }}>
                                {account.crossOverDirection === 'to-next-month' ? '-' : '+'}{dataService.formatCurrency(account.crossOverAmount)} cross-over
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Td>
                    <Td dataLabel="Cost" modifier="nowrap" style={{ textAlign: 'right' }}>
                      {account.cost}
                      <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem' }}>
                        {account.costPercent} % of cost
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
                widgetId="gcp-pagination-bottom"
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

export { GCP };


