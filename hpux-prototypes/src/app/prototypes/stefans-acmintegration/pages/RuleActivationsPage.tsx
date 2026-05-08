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
} from '@patternfly/react-core';
import {
  CaretDownIcon,
  FilterIcon,
  EllipsisVIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  ChartLineIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

interface RuleActivation {
  id: number;
  name: string;
  rulebook: string;
  rule: string;
  status: 'Running' | 'Stopped' | 'Error' | 'Pending';
  eventsProcessed: number;
  lastExecution: string;
  successRate: number;
  avgExecutionTime: string;
  decisionEnvironment: string;
}

const RuleActivationsPage: React.FC = () => {
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

  // Rule activation data
  const allRuleActivations: RuleActivation[] = [
    {
      id: 1,
      name: 'VM Created Handler',
      rulebook: 'VM Lifecycle Events',
      rule: 'on_vm_created',
      status: 'Running',
      eventsProcessed: 1247,
      lastExecution: '2024-01-15 15:30:22',
      successRate: 98.5,
      avgExecutionTime: '2.3s',
      decisionEnvironment: 'prod-env-01',
    },
    {
      id: 2,
      name: 'Cluster Health Check',
      rulebook: 'Cluster Health Monitoring',
      rule: 'on_health_threshold',
      status: 'Running',
      eventsProcessed: 8934,
      lastExecution: '2024-01-15 15:30:15',
      successRate: 99.2,
      avgExecutionTime: '1.8s',
      decisionEnvironment: 'prod-env-01',
    },
    {
      id: 3,
      name: 'Network Policy Violation',
      rulebook: 'Network Policy Violations',
      rule: 'on_policy_violation',
      status: 'Stopped',
      eventsProcessed: 0,
      lastExecution: 'Never',
      successRate: 0,
      avgExecutionTime: '-',
      decisionEnvironment: 'dev-env-01',
    },
    {
      id: 4,
      name: 'Quota Alert Handler',
      rulebook: 'Resource Quota Alerts',
      rule: 'on_quota_warning',
      status: 'Running',
      eventsProcessed: 342,
      lastExecution: '2024-01-15 15:28:10',
      successRate: 95.0,
      avgExecutionTime: '3.1s',
      decisionEnvironment: 'prod-env-01',
    },
    {
      id: 5,
      name: 'Security Incident Response',
      rulebook: 'Security Incident Response',
      rule: 'on_security_incident',
      status: 'Error',
      eventsProcessed: 156,
      lastExecution: '2024-01-15 14:20:05',
      successRate: 45.2,
      avgExecutionTime: '5.2s',
      decisionEnvironment: 'prod-env-01',
    },
  ];

  // Filter and search
  const filteredRuleActivations = useMemo(() => {
    return allRuleActivations.filter(activation => {
      if (searchValue && !activation.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !activation.rulebook.toLowerCase().includes(searchValue.toLowerCase()) &&
          !activation.rule.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedRuleActivations = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredRuleActivations.slice(start, end);
  }, [filteredRuleActivations, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredRuleActivations.map(a => a.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedRuleActivations.forEach(a => newSelected.add(a.id));
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

  const isAllSelected = paginatedRuleActivations.length > 0 && paginatedRuleActivations.every(a => selectedItems.has(a.id));

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      'Running': 'success',
      'Stopped': 'warning',
      'Error': 'danger',
      'Pending': 'info',
    };
    return <Badge isRead={status === 'Stopped'}>{status}</Badge>;
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/rule-activations')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/rule-activations')}>
            Automation
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Rule Activations</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Rule Activations
        </Title>
        <Content>
          <p>Activate and monitor rules from your rulebooks. View execution metrics, success rates, and manage which rules are currently processing events in your decision environments.</p>
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
                            id="bulk-select-checkbox-ruleactivations"
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
                      Select page ({paginatedRuleActivations.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredRuleActivations.length} items)
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
                    <DropdownItem key="rulebook">Rulebook</DropdownItem>
                    <DropdownItem key="environment">Decision Environment</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search rule activations"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredRuleActivations.length}
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
          <Table aria-label="Rule activations table">
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
                    isHeaderSelectDisabled: filteredRuleActivations.length === 0,
                  }}
                />
                <Th>Name</Th>
                <Th>Rulebook</Th>
                <Th>Rule</Th>
                <Th>Status</Th>
                <Th>Events Processed</Th>
                <Th>Success Rate</Th>
                <Th>Avg Execution Time</Th>
                <Th>Decision Environment</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedRuleActivations.map((activation) => (
                <Tr key={activation.id}>
                  <Td
                    select={{
                      rowIndex: activation.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(activation.id, isSelecting),
                      isSelected: selectedItems.has(activation.id),
                    }}
                  />
                  <Td dataLabel="Name">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/rule-activations/${activation.id}`)}>
                      {activation.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Rulebook">
                    <Button variant="link" isInline onClick={() => navigate(`/automation/rulebooks?name=${activation.rulebook}`)}>
                      {activation.rulebook}
                    </Button>
                  </Td>
                  <Td dataLabel="Rule">{activation.rule}</Td>
                  <Td dataLabel="Status">{getStatusBadge(activation.status)}</Td>
                  <Td dataLabel="Events Processed">{activation.eventsProcessed.toLocaleString()}</Td>
                  <Td dataLabel="Success Rate">{activation.successRate}%</Td>
                  <Td dataLabel="Avg Execution Time">{activation.avgExecutionTime}</Td>
                  <Td dataLabel="Decision Environment">{activation.decisionEnvironment}</Td>
                  <Td isActionCell>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Button 
                          variant="plain" 
                          icon={activation.status === 'Running' ? <PauseIcon /> : <PlayIcon />} 
                          onClick={() => console.log(`${activation.status === 'Running' ? 'Stop' : 'Start'} ${activation.name}`)}
                          aria-label={activation.status === 'Running' ? 'Stop activation' : 'Start activation'}
                        >
                          {activation.status === 'Running' ? 'Stop' : 'Start'}
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        <Dropdown
                          isOpen={openKebabId === activation.id}
                          onSelect={() => setOpenKebabId(null)}
                          onOpenChange={(isOpen) => setOpenKebabId(isOpen ? activation.id : null)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setOpenKebabId(openKebabId === activation.id ? null : activation.id)}
                              isExpanded={openKebabId === activation.id}
                              variant="plain"
                              aria-label="Rule activation actions"
                            >
                              <EllipsisVIcon />
                            </MenuToggle>
                          )}
                          popperProps={{ position: 'right' }}
                        >
                          <DropdownList>
                            <DropdownItem key="metrics" icon={<ChartLineIcon />} onClick={() => navigate(`/automation/rule-activations/${activation.id}?tab=metrics`)}>
                              View metrics
                            </DropdownItem>
                            <DropdownItem key="execution-history" onClick={() => navigate(`/automation/rule-activations/${activation.id}?tab=history`)}>
                              Execution history
                            </DropdownItem>
                            <DropdownItem key="delete" icon={<TrashIcon />} onClick={() => console.log(`Delete ${activation.name}`)} isDanger>
                              Delete activation
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
              itemCount={filteredRuleActivations.length}
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

export default RuleActivationsPage;

