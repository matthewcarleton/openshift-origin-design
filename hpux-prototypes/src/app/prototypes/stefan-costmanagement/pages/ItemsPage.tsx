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
} from '@patternfly/react-core';
import {
  CaretDownIcon,
  FilterIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

/**
 * Items Page
 * 
 * This is an example page created using the Standard Page Template Pattern.
 * It demonstrates the complete structure:
 * - Breadcrumbs Section (16px padding)
 * - Heading Section (24px padding)
 * - Content Area (24px padding) with Card containing:
 *   - Toolbar (bulk selector, filter, search, primary button, pagination)
 *   - Table (with selection checkboxes)
 *   - Pagination (bottom)
 * 
 * See PAGE_TEMPLATE.md for complete documentation.
 */
export const ItemsPage: React.FC = () => {
  const navigate = useNavigate();

  // Toolbar state
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Example table data
  const columns = ['Name', 'Type', 'Status', 'Created', 'Actions'];
  const allRows = [
    { id: 1, name: 'Item Alpha', type: 'Resource', status: 'Active', created: '2024-01-15', actions: 'View' },
    { id: 2, name: 'Item Beta', type: 'Service', status: 'Inactive', created: '2024-01-16', actions: 'View' },
    { id: 3, name: 'Item Gamma', type: 'Resource', status: 'Active', created: '2024-01-17', actions: 'View' },
    { id: 4, name: 'Item Delta', type: 'Component', status: 'Pending', created: '2024-01-18', actions: 'View' },
    { id: 5, name: 'Item Epsilon', type: 'Resource', status: 'Active', created: '2024-01-19', actions: 'View' },
    { id: 6, name: 'Item Zeta', type: 'Service', status: 'Inactive', created: '2024-01-20', actions: 'View' },
    { id: 7, name: 'Item Eta', type: 'Component', status: 'Active', created: '2024-01-21', actions: 'View' },
    { id: 8, name: 'Item Theta', type: 'Resource', status: 'Pending', created: '2024-01-22', actions: 'View' },
    { id: 9, name: 'Item Iota', type: 'Service', status: 'Active', created: '2024-01-23', actions: 'View' },
    { id: 10, name: 'Item Kappa', type: 'Component', status: 'Inactive', created: '2024-01-24', actions: 'View' },
    { id: 11, name: 'Item Lambda', type: 'Resource', status: 'Active', created: '2024-01-25', actions: 'View' },
    { id: 12, name: 'Item Mu', type: 'Service', status: 'Pending', created: '2024-01-26', actions: 'View' },
  ];

  // Filter and search rows
  const filteredRows = useMemo(() => {
    return allRows.filter(row => {
      if (searchValue && 
          !row.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !row.status.toLowerCase().includes(searchValue.toLowerCase()) &&
          !row.type.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [searchValue]);

  // Pagination
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredRows.slice(start, end);
  }, [filteredRows, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    const newSelected = new Set(filteredRows.map(row => row.id));
    setSelectedItems(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedItems);
    paginatedRows.forEach(row => newSelected.add(row.id));
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

  const isAllSelected = paginatedRows.length > 0 && paginatedRows.every(row => selectedItems.has(row.id));

  return (
    <>
      {/* Breadcrumbs Section - 16px padding */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Items</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section - 24px padding (Title + Description) */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Items
        </Title>
        <Content>
          <p>This is an example page created using the Standard Page Template Pattern. It demonstrates the complete structure with breadcrumbs, heading, toolbar, table, and pagination.</p>
        </Content>
      </div>

      {/* Content Area - 24px padding */}
      <div className="template-page-content">
        {/* Card wrapping toolbar and table */}
        <div className="table-content-card">
          {/* Toolbar with pagination at top */}
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
                            id="select-all-checkbox"
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
                      Select page ({paginatedRows.length} items)
                    </DropdownItem>
                    <DropdownItem key="select-all" onClick={handleSelectAll}>
                      Select all ({filteredRows.length} items)
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
                    <DropdownItem key="type">Type</DropdownItem>
                    <DropdownItem key="created">Created date</DropdownItem>
                    <DropdownItem key="name">Name</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>

              {/* Search Bar */}
              <ToolbarItem>
                <SearchInput
                  placeholder="Search"
                  value={searchValue}
                  onChange={(_event, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                />
              </ToolbarItem>

              {/* Create Button */}
              <ToolbarItem>
                <Button variant="primary" onClick={() => console.log('Create clicked')}>
                  Create Item
                </Button>
              </ToolbarItem>

              {/* Pagination at top */}
              <ToolbarItem align={{ default: 'alignEnd' }}>
                <Pagination
                  itemCount={filteredRows.length}
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
          <Table aria-label="Items table">
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
                    isHeaderSelectDisabled: filteredRows.length === 0,
                  }}
                />
                {columns.map((column, index) => (
                  <Th key={index}>{column}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedRows.map((row) => (
                <Tr key={row.id}>
                  <Td
                    select={{
                      rowIndex: row.id,
                      onSelect: (_event, isSelecting) => handleSelectItem(row.id, isSelecting),
                      isSelected: selectedItems.has(row.id),
                    }}
                  />
                  <Td dataLabel={columns[0]}>{row.name}</Td>
                  <Td dataLabel={columns[1]}>{row.type}</Td>
                  <Td dataLabel={columns[2]}>{row.status}</Td>
                  <Td dataLabel={columns[3]}>{row.created}</Td>
                  <Td dataLabel={columns[4]}>{row.actions}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Pagination at bottom */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
            <Pagination
              itemCount={filteredRows.length}
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

