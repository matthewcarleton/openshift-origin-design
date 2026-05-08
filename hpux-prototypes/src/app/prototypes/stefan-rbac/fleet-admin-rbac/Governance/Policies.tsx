import * as React from 'react';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Label,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  PaginationVariant,
  Flex,
  FlexItem,
  Checkbox,
  Title,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ExpandableRowContent } from '@patternfly/react-table';
import { 
  EllipsisVIcon, 
  FilterIcon, 
  CaretDownIcon, 
  ColumnsIcon, 
  DownloadIcon,
  AngleRightIcon,
  AngleDownIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { useNavigate } from 'react-router-dom';

// Mock data for policies
const mockPolicies = [
  {
    id: 1,
    name: 'policy-1',
    projects: ['default', 'openshift-*'],
    remediation: 'enforce',
    policySet: 'security-policies',
    violations: 3,
    totalClusters: 15,
    source: 'Git',
  },
  {
    id: 2,
    name: 'policy-2',
    projects: ['default'],
    remediation: 'inform',
    policySet: 'compliance-policies',
    violations: 0,
    totalClusters: 15,
    source: 'Local',
  },
];

const Policies: React.FunctionComponent = () => {
  useDocumentTitle('ACM RBAC | Governance');
  const navigate = useNavigate();
  
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState('Name');
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = React.useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = React.useState(false);
  const [isColumnManagementOpen, setIsColumnManagementOpen] = React.useState(false);
  const [selectedPolicies, setSelectedPolicies] = React.useState<Set<number>>(new Set());
  const [openActionMenuId, setOpenActionMenuId] = React.useState<number | null>(null);
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set());
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [openStatusMenuId, setOpenStatusMenuId] = React.useState<number | null>(null);
  const [openRemediationMenuId, setOpenRemediationMenuId] = React.useState<number | null>(null);

  const toggleRowMenu = (policyId: number) => {
    setOpenActionMenuId(openActionMenuId === policyId ? null : policyId);
  };

  const toggleExpanded = (policyId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(policyId)) {
      newExpanded.delete(policyId);
    } else {
      newExpanded.add(policyId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSelectPolicy = (policyId: number, checked: boolean) => {
    const newSelected = new Set(selectedPolicies);
    if (checked) {
      newSelected.add(policyId);
    } else {
      newSelected.delete(policyId);
    }
    setSelectedPolicies(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedPolicies.map(p => p.id);
      setSelectedPolicies(new Set(allIds));
    } else {
      setSelectedPolicies(new Set());
    }
  };

  const filteredPolicies = React.useMemo(() => {
    return mockPolicies.filter(policy => 
      policy.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const paginatedPolicies = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredPolicies.slice(start, start + perPage);
  }, [filteredPolicies, page, perPage]);

  const isAllSelected = paginatedPolicies.length > 0 && 
    paginatedPolicies.every(p => selectedPolicies.has(p.id));

  return (
    <>
      <div className="table-content-card">
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <Dropdown
                  isOpen={isBulkSelectorOpen}
                  onSelect={() => setIsBulkSelectorOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsBulkSelectorOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => {
                        if (selectedPolicies.size > 0) {
                          setSelectedPolicies(new Set());
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
                            isChecked={isAllSelected}
                            onChange={(event, checked) => {
                              event.stopPropagation();
                              handleSelectAll(checked);
                            }}
                            aria-label="Select all"
                            id="select-all-policies-checkbox"
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
                    <DropdownItem onClick={() => setSelectedPolicies(new Set())}>
                      Select none
                    </DropdownItem>
                    <DropdownItem onClick={() => handleSelectAll(true)}>
                      Select page ({paginatedPolicies.length} items)
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
                      isExpanded={isFilterOpen}
                      icon={<FilterIcon />}
                    >
                      {filterType}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => { setFilterType('Name'); setIsFilterOpen(false); }}>
                      Name
                    </DropdownItem>
                    <DropdownItem onClick={() => { setFilterType('Projects'); setIsFilterOpen(false); }}>
                      Projects
                    </DropdownItem>
                    <DropdownItem onClick={() => { setFilterType('Source'); setIsFilterOpen(false); }}>
                      Source
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <SearchInput
                  placeholder="Search policies"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                  style={{ width: '250px' }}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="primary" onClick={() => navigate('/governance/policies/create')}>
                  Create policy
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  isOpen={isActionsDropdownOpen}
                  onSelect={() => setIsActionsDropdownOpen(false)}
                  onOpenChange={(isOpen) => setIsActionsDropdownOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                      isExpanded={isActionsDropdownOpen}
                    >
                      Actions
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem 
                      isDisabled={selectedPolicies.size === 0}
                      onClick={() => console.log('Enforce selected policies')}
                    >
                      Enforce
                    </DropdownItem>
                    <DropdownItem 
                      isDisabled={selectedPolicies.size === 0}
                      onClick={() => console.log('Disable selected policies')}
                    >
                      Disable
                    </DropdownItem>
                    <DropdownItem 
                      isDisabled={selectedPolicies.size === 0}
                      onClick={() => console.log('Delete selected policies')}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="plain" aria-label="Column management">
                  <ColumnsIcon />
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="plain" aria-label="Export">
                  <DownloadIcon />
                </Button>
              </ToolbarItem>
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredPolicies.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={(_event, pageNumber) => setPage(pageNumber)}
                  onPerPageSelect={(_event, newPerPage) => {
                    setPerPage(newPerPage);
                    setPage(1);
                  }}
                  variant={PaginationVariant.top}
                  isCompact
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table aria-label="Policies table" variant="compact">
            <Thead>
              <Tr>
                <Th />
                <Th />
                <Th>Name</Th>
                <Th>Projects</Th>
                <Th>Remediation</Th>
                <Th>Policy set</Th>
                <Th>Cluster violations</Th>
                <Th>Source</Th>
                <Th />
              </Tr>
            </Thead>
            {paginatedPolicies.map((policy, rowIndex) => (
              <Tbody key={policy.id} isExpanded={expandedRows.has(policy.id)}>
                <Tr>
                  <Td
                    expand={{
                      rowIndex,
                      isExpanded: expandedRows.has(policy.id),
                      onToggle: () => toggleExpanded(policy.id),
                    }}
                  />
                  <Td
                    select={{
                      rowIndex,
                      onSelect: (_event, isSelecting) => handleSelectPolicy(policy.id, isSelecting),
                      isSelected: selectedPolicies.has(policy.id),
                    }}
                  />
                  <Td dataLabel="Name">
                    <Button 
                      variant="link" 
                      isInline
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      {policy.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Projects">
                    {policy.projects.map((proj, idx) => (
                      <Label key={idx} color="grey" style={{ marginRight: '4px' }}>
                        {proj}
                      </Label>
                    ))}
                  </Td>
                  <Td dataLabel="Remediation">
                    <Label color={policy.remediation === 'enforce' ? 'red' : 'blue'}>
                      {policy.remediation}
                    </Label>
                  </Td>
                  <Td dataLabel="Policy set">
                    {policy.policySet ? (
                      <Button 
                        variant="link" 
                        isInline
                        style={{ padding: 0, fontSize: 'inherit' }}
                      >
                        {policy.policySet}
                      </Button>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td dataLabel="Cluster violations">
                    {policy.violations > 0 ? (
                      <Label color="red">{policy.violations}/{policy.totalClusters}</Label>
                    ) : (
                      <Label color="green">0/{policy.totalClusters}</Label>
                    )}
                  </Td>
                  <Td dataLabel="Source">{policy.source}</Td>
                  <Td isActionCell>
                    <Dropdown
                      isOpen={openActionMenuId === policy.id}
                      onSelect={() => setOpenActionMenuId(null)}
                      onOpenChange={(isOpen: boolean) => !isOpen && setOpenActionMenuId(null)}
                      popperProps={{
                        position: 'end'
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          aria-label="Actions menu"
                          variant="plain"
                          onClick={() => toggleRowMenu(policy.id)}
                          isExpanded={openActionMenuId === policy.id}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                      shouldFocusToggleOnSelect
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => console.log('Add to policy set', policy.id)}>
                          Add to policy set
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            if (openStatusMenuId === policy.id) {
                              setOpenStatusMenuId(null);
                            } else {
                              setOpenStatusMenuId(policy.id);
                              setOpenRemediationMenuId(null);
                            }
                          }}
                          description={
                            openStatusMenuId === policy.id ? (
                              <div style={{ paddingLeft: '16px', marginTop: '8px' }}>
                                <DropdownItem onClick={() => console.log('Enable', policy.id)}>
                                  Enable
                                </DropdownItem>
                                <DropdownItem onClick={() => console.log('Disable', policy.id)}>
                                  Disable
                                </DropdownItem>
                              </div>
                            ) : undefined
                          }
                        >
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsNone' }}>
                            <FlexItem>Status</FlexItem>
                            <FlexItem>
                              {openStatusMenuId === policy.id ? <AngleDownIcon /> : <AngleRightIcon />}
                            </FlexItem>
                          </Flex>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            if (openRemediationMenuId === policy.id) {
                              setOpenRemediationMenuId(null);
                            } else {
                              setOpenRemediationMenuId(policy.id);
                              setOpenStatusMenuId(null);
                            }
                          }}
                          description={
                            openRemediationMenuId === policy.id ? (
                              <div style={{ paddingLeft: '16px', marginTop: '8px' }}>
                                <DropdownItem onClick={() => console.log('Enforce', policy.id)}>
                                  Enforce
                                </DropdownItem>
                                <DropdownItem onClick={() => console.log('Inform only', policy.id)}>
                                  Inform only
                                </DropdownItem>
                              </div>
                            ) : undefined
                          }
                        >
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsNone' }}>
                            <FlexItem>Remediation</FlexItem>
                            <FlexItem>
                              {openRemediationMenuId === policy.id ? <AngleDownIcon /> : <AngleRightIcon />}
                            </FlexItem>
                          </Flex>
                        </DropdownItem>
                        <DropdownItem onClick={() => console.log('Edit', policy.id)}>
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => console.log('Delete', policy.id)}>
                          Delete
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
                <Tr isExpanded={expandedRows.has(policy.id)}>
                  <Td colSpan={9}>
                    <ExpandableRowContent>
                      <div style={{ padding: '16px' }}>
                        <Title headingLevel="h4" size="md" style={{ marginBottom: '8px' }}>
                          Policy Details
                        </Title>
                        <p>Additional information about {policy.name} would be displayed here.</p>
                        <p>This could include compliance status, affected resources, history, etc.</p>
                      </div>
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              </Tbody>
            ))}
          </Table>

          <div style={{ padding: '16px' }}>
            <Pagination
              itemCount={filteredPolicies.length}
              perPage={perPage}
              page={page}
              onSetPage={(_event, pageNumber) => setPage(pageNumber)}
              onPerPageSelect={(_event, newPerPage) => {
                setPerPage(newPerPage);
                setPage(1);
              }}
              variant={PaginationVariant.bottom}
            />
          </div>
        </div>
    </>
  );
};

export { Policies };

