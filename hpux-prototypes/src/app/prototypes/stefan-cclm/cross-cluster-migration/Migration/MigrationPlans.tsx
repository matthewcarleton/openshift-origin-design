import React from 'react';
import {
  Title,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  MenuToggle,
  MenuToggleElement,
  Dropdown,
  DropdownList,
  DropdownItem,
  Pagination,
  PaginationVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Label,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { PlusCircleIcon, EllipsisVIcon, FilterIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { getAllMigrationPlans, getClusterById, getNamespaceById } from '@app/data/queries';

const MigrationPlans: React.FunctionComponent = () => {
  useDocumentTitle('Migration plans');
  const navigate = useNavigate();
  
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  
  // Get all migration plans - re-fetch when refreshTrigger changes
  const allPlans = React.useMemo(() => getAllMigrationPlans(), [refreshTrigger]);
  
  // Refresh plans on mount
  React.useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  // Filter plans based on search
  const filteredPlans = React.useMemo(() => {
    return allPlans.filter(plan =>
      plan.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [allPlans, searchValue]);
  
  // Paginate
  const paginatedPlans = React.useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredPlans.slice(start, end);
  }, [filteredPlans, page, perPage]);
  
  const handleRowClick = (planId: string) => {
    navigate(`/virtualization/migration/${planId}`);
  };
  
  if (allPlans.length === 0) {
    return (
      <div className="migration-plans-page-container">
        <div className="page-header-section">
          <Breadcrumb>
            <BreadcrumbItem to="/virtualization/overview">Migration</BreadcrumbItem>
            <BreadcrumbItem isActive>Migration plans</BreadcrumbItem>
          </Breadcrumb>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <div>
              <Title headingLevel="h1" size="2xl">
                Migration plans
              </Title>
              <div style={{ marginTop: '8px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                Explore your migration plans, to quickly find and see their status and details.
              </div>
            </div>
            <Button variant="primary" onClick={() => navigate('/virtualization/migration/create')}>
              Create plan
            </Button>
          </div>
        </div>
        
        <div className="page-content-section">
          <EmptyState>
            <PlusCircleIcon style={{ fontSize: '48px', color: 'var(--pf-t--global--icon--color--subtle)', marginBottom: '16px' }} />
            <Title headingLevel="h2" size="lg">
              No migration plans
            </Title>
            <EmptyStateBody>
              Create a migration plan to move virtualization workloads from source to target clusters.
            </EmptyStateBody>
            <EmptyStateActions>
              <Button variant="primary" onClick={() => navigate('/virtualization/migration/create')}>
                Create migration plan
              </Button>
            </EmptyStateActions>
          </EmptyState>
        </div>
      </div>
    );
  }
  
  return (
    <div className="migration-plans-page-container">
      {/* Header */}
      <div className="page-header-section">
        <Breadcrumb>
          <BreadcrumbItem to="/virtualization/overview">Migration</BreadcrumbItem>
          <BreadcrumbItem isActive>Migration plans</BreadcrumbItem>
        </Breadcrumb>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <div>
            <Title headingLevel="h1" size="2xl">
              Migration plans
            </Title>
            <div style={{ marginTop: '8px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Explore your migration plans, to quickly find and see their status and details.
            </div>
          </div>
          <Button variant="primary" onClick={() => navigate('/virtualization/migration/create')}>
            Create plan
          </Button>
        </div>
      </div>
      
      <div className="page-content-section">
        <div className="table-content-card">
          {/* Toolbar */}
          <Toolbar>
          <ToolbarContent>
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
                  >
                    <FilterIcon /> Filter
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="all">All statuses</DropdownItem>
                  <DropdownItem key="in-progress">In progress</DropdownItem>
                  <DropdownItem key="completed">Completed</DropdownItem>
                  <DropdownItem key="ready">Ready to migrate</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={false}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                  >
                    Menu toggle
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="action1">Action</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Search by name"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={filteredPlans.length}
                perPage={perPage}
                page={page}
                onSetPage={(_evt, newPage) => setPage(newPage)}
                onPerPageSelect={(_evt, newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                }}
                variant={PaginationVariant.top}
                isCompact
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        
        {/* Table */}
        <Table aria-label="Migration plans table" variant="compact">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Source provider</Th>
            <Th>Migration readiness</Th>
            <Th>VirtualMachines</Th>
            <Th>Migration status</Th>
            <Th>Migration type</Th>
            <Th>Migration started</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedPlans.map((plan) => (
            <Tr
              key={plan.id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRowClick(plan.id)}
            >
              <Td dataLabel="Name">
                <a
                  href={`#/virtualization/migration/${plan.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRowClick(plan.id);
                  }}
                  style={{ color: 'var(--pf-t--global--color--brand--default)' }}
                >
                  {plan.name}
                </a>
              </Td>
              <Td dataLabel="Source provider">
                {(() => {
                  const sourceCluster = getClusterById(plan.sourceClusterId);
                  return sourceCluster ? sourceCluster.name : '-';
                })()}
              </Td>
              <Td dataLabel="Migration readiness">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                  {plan.migrationReadiness}
                </div>
              </Td>
              <Td dataLabel="VirtualMachines">
                <a
                  href={`#/virtualization/migration/${plan.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRowClick(plan.id);
                  }}
                  style={{ color: 'var(--pf-t--global--color--brand--default)' }}
                >
                  {plan.vmIds.length} VM
                </a>
              </Td>
              <Td dataLabel="Migration status">
                <Label color={plan.status === 'In progress' ? 'blue' : plan.status === 'Completed' ? 'green' : 'grey'}>
                  {plan.status}
                </Label>
              </Td>
              <Td dataLabel="Migration type">
                <Label color="grey">{plan.migrationType}</Label>
              </Td>
              <Td dataLabel="Migration started">
                {plan.startedAt ? new Date(plan.startedAt).toLocaleString() : '-'}
              </Td>
              <Td isActionCell style={{ textAlign: 'right' }}>
                <Dropdown
                  isOpen={isMenuOpen === plan.id}
                  onSelect={() => setIsMenuOpen(null)}
                  onOpenChange={(isOpen: boolean) => {
                    if (!isOpen) setIsMenuOpen(null);
                  }}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      aria-label="Actions"
                      variant="plain"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(isMenuOpen === plan.id ? null : plan.id);
                      }}
                      isExpanded={isMenuOpen === plan.id}
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  popperProps={{
                    position: 'right',
                  }}
                >
                  <DropdownList>
                    <DropdownItem key="view">View details</DropdownItem>
                    <DropdownItem key="delete">Delete</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      {/* Bottom Pagination */}
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={filteredPlans.length}
              perPage={perPage}
              page={page}
              onSetPage={(_evt, newPage) => setPage(newPage)}
              onPerPageSelect={(_evt, newPerPage) => {
                setPerPage(newPerPage);
                setPage(1);
              }}
              variant={PaginationVariant.bottom}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      </div>
      </div>
    </div>
  );
};

export { MigrationPlans };
