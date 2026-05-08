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
  Card,
  CardBody,
  Pagination,
  PaginationVariant,
  Form,
  FormGroup,
  TextInput,
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
import { WizardTemplate } from '../components/WizardTemplate';

/**
 * New Page
 * 
 * This is a new page template with breadcrumbs, title, description, and a table.
 * Follows PatternFly page structure with proper spacing:
 * - Breadcrumbs section: 16px padding
 * - Heading section: 24px padding
 * - Content area: 24px padding
 */
export const NewPage: React.FC = () => {
  const navigate = useNavigate();

  // Toolbar state
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardData, setWizardData] = useState<any>({});

  // Example table data
  const columns = ['Name', 'Status', 'Created', 'Actions'];
  const allRows = [
    { id: 1, name: 'Item 1', status: 'Active', created: '2024-01-15', actions: 'View' },
    { id: 2, name: 'Item 2', status: 'Inactive', created: '2024-01-16', actions: 'View' },
    { id: 3, name: 'Item 3', status: 'Active', created: '2024-01-17', actions: 'View' },
    { id: 4, name: 'Item 4', status: 'Pending', created: '2024-01-18', actions: 'View' },
  ];

  // Filter and search rows
  const filteredRows = useMemo(() => {
    return allRows.filter(row => {
      if (searchValue && !row.name.toLowerCase().includes(searchValue.toLowerCase()) && 
          !row.status.toLowerCase().includes(searchValue.toLowerCase())) {
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
  const isSomeSelected = selectedItems.size > 0 && !isAllSelected;

  return (
    <>
      {/* Breadcrumbs Section - 16px padding */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem isActive>New Page</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section - 24px padding (Title + Description) */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          New Page
        </Title>
        <Content>
          <p>This is a new page with breadcrumbs, title, description, and a table. Customize this content to match your needs.</p>
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
                <Button variant="primary" onClick={() => setIsWizardOpen(true)}>
                  Create
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
          <Table aria-label="Example table">
            <Thead>
              <Tr>
                <Th />
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
                  <Td dataLabel={columns[0]}>
                    <Button
                      variant="link"
                      onClick={() => navigate(`/new-page/${row.id}`)}
                      isInline
                    >
                      {row.name}
                    </Button>
                  </Td>
                  <Td dataLabel={columns[1]}>{row.status}</Td>
                  <Td dataLabel={columns[2]}>{row.created}</Td>
                  <Td dataLabel={columns[3]}>{row.actions}</Td>
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

      {/* Create Item Wizard */}
      <WizardTemplate
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardData({});
        }}
        onFinish={(data) => {
          console.log('Item created:', data);
          // In a real app, you would save the item here
          // Then refresh the table or navigate to the new item
          setIsWizardOpen(false);
          setWizardData({});
        }}
        title="Create Item"
        description="Create a new item by filling out the form below."
        steps={[
          {
            number: 1,
            name: 'Basic Information',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Basic Information
                </Title>
                <Form>
                  <FormGroup label="Name" isRequired fieldId="name">
                    <TextInput
                      id="name"
                      value={wizardData.name || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, name: value })}
                      placeholder="Enter item name"
                    />
                  </FormGroup>
                  <FormGroup label="Type" isRequired fieldId="type" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="type"
                      value={wizardData.type || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, type: value })}
                      placeholder="Enter item type"
                    />
                  </FormGroup>
                  <FormGroup label="Description" fieldId="description" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="description"
                      value={wizardData.description || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, description: value })}
                      placeholder="Enter description (optional)"
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 2,
            name: 'Configuration',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Configuration
                </Title>
                <Form>
                  <FormGroup label="Status" isRequired fieldId="status">
                    <TextInput
                      id="status"
                      value={wizardData.status || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, status: value })}
                      placeholder="Active, Inactive, or Pending"
                    />
                  </FormGroup>
                  <FormGroup label="Owner" fieldId="owner" style={{ marginTop: '16px' }}>
                    <TextInput
                      id="owner"
                      value={wizardData.owner || ''}
                      onChange={(_event, value) => setWizardData({ ...wizardData, owner: value })}
                      placeholder="Enter owner email (optional)"
                    />
                  </FormGroup>
                </Form>
              </div>
            ),
          },
          {
            number: 3,
            name: 'Review',
            component: (
              <div style={{ padding: '24px', maxWidth: '600px' }}>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
                  Review
                </Title>
                <Content>
                  <p><strong>Name:</strong> {wizardData.name || 'Not specified'}</p>
                  <p><strong>Type:</strong> {wizardData.type || 'Not specified'}</p>
                  <p><strong>Description:</strong> {wizardData.description || 'Not specified'}</p>
                  <p><strong>Status:</strong> {wizardData.status || 'Not specified'}</p>
                  <p><strong>Owner:</strong> {wizardData.owner || 'Not specified'}</p>
                </Content>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

