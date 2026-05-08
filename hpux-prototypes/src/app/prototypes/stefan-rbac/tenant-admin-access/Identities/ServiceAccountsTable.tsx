import * as React from 'react';
import {
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
  Checkbox,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { getAllServiceAccounts } from '@app/data';

// Get service accounts from centralized database
const dbServiceAccounts = getAllServiceAccounts();

// Transform service accounts from database to component format
const mockServiceAccounts = dbServiceAccounts.map((sa, index) => ({
  id: index + 1,
  name: sa.name,
  namespace: sa.namespace,
  description: sa.description,
  created: new Date(sa.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
}));

export const ServiceAccountsTable: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [filterType, setFilterType] = React.useState('Service account');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedServiceAccounts, setSelectedServiceAccounts] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);

  const paginatedServiceAccounts = mockServiceAccounts.slice((page - 1) * perPage, page * perPage);

  const handleServiceAccountSelect = (saId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedServiceAccounts([...selectedServiceAccounts, saId]);
    } else {
      setSelectedServiceAccounts(selectedServiceAccounts.filter(id => id !== saId));
    }
  };

  const handleSelectAllServiceAccounts = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedServiceAccounts(mockServiceAccounts.map(sa => sa.id));
    } else {
      setSelectedServiceAccounts([]);
    }
  };

  return (
    <div className="table-content-card">
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
                  variant="default"
                >
                  {filterType}
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem value="Service account" onClick={() => setFilterType('Service account')}>
                  Service account
                </DropdownItem>
                <DropdownItem value="User" onClick={() => setFilterType('User')}>
                  User
                </DropdownItem>
                <DropdownItem value="Group" onClick={() => setFilterType('Group')}>
                  Group
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder="Search for a service account"
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary">Create service account</Button>
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={mockServiceAccounts.length}
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
      <Table aria-label="Service accounts table" variant="compact">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                id="select-all-service-accounts"
                isChecked={paginatedServiceAccounts.length > 0 && paginatedServiceAccounts.every(sa => selectedServiceAccounts.includes(sa.id))}
                onChange={(event, checked) => {
                  if (checked) {
                    setSelectedServiceAccounts(Array.from(new Set([...selectedServiceAccounts, ...paginatedServiceAccounts.map(sa => sa.id)])));
                  } else {
                    const pageSaIds = paginatedServiceAccounts.map(sa => sa.id);
                    setSelectedServiceAccounts(selectedServiceAccounts.filter(id => !pageSaIds.includes(id)));
                  }
                }}
                aria-label="Select all service accounts on page"
                style={{ transform: 'scale(0.7)' }}
              />
            </Th>
            <Th>Service account</Th>
            <Th>Namespace</Th>
            <Th>Description</Th>
            <Th>Created</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedServiceAccounts.map((sa) => (
            <Tr key={sa.id}>
              <Td>
                <Checkbox
                  id={`select-service-account-${sa.id}`}
                  isChecked={selectedServiceAccounts.includes(sa.id)}
                  onChange={(event, checked) => handleServiceAccountSelect(sa.id, checked)}
                  aria-label={`Select ${sa.name}`}
                  style={{ transform: 'scale(0.7)' }}
                />
              </Td>
              <Td dataLabel="Service account">
                <Button
                  variant="link"
                  isInline
                  onClick={() => console.log(`Navigate to service account: ${sa.name}`)}
                >
                  {sa.name}
                </Button>
              </Td>
              <Td dataLabel="Namespace">{sa.namespace}</Td>
              <Td dataLabel="Description">{sa.description}</Td>
              <Td dataLabel="Created">{sa.created}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div style={{ padding: '16px' }}>
        <Pagination
          itemCount={mockServiceAccounts.length}
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
  );
};
