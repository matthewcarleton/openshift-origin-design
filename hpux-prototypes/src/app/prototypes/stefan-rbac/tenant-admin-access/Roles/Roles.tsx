import * as React from 'react';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Label,
  Split,
  SplitItem,
  Modal,
  ModalVariant,
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  ToggleGroup,
  ToggleGroupItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  PaginationVariant,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { EllipsisVIcon, FilterIcon, CaretDownIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { useNavigate } from 'react-router-dom';
import { getAllRoles } from '@app/data';
import { RoleDetailRoleAssignmentWizard } from '../RoleAssignment/RoleDetailRoleAssignmentWizard';

// Get roles from centralized database
// Tenant Admin Access: Only show project-scoped roles (exclude cluster-set roles which are fleet admin only)
const allRoles = getAllRoles();
const dbRoles = allRoles.filter(role => role.category !== 'open-cluster-management');

// Map category to display category (plugin/source)
const getCategoryDisplay = (category: string): string => {
  switch (category) {
    case 'kubevirt':
      return 'Virtualization';
    case 'cluster':
      return 'OpenShift Cluster Management';
    case 'namespace':
      return 'OpenShift Namespace Management';
    case 'application':
      return 'Application Management';
    default:
      return 'OpenShift';
  }
};

// Transform roles from database to component format
const mockRoles = dbRoles.map((role, index) => ({
  id: index + 1,
  name: role.name,
  displayName: role.displayName,
  type: role.type === 'default' ? 'Default' : 'Custom',
  category: getCategoryDisplay(role.category),
  description: role.description,
  resources: role.category === 'kubevirt' 
    ? ['VirtualMachines', 'VirtualMachineInstances'] 
    : role.category === 'cluster' 
    ? ['Clusters', 'ClusterSets'] 
    : role.category === 'namespace'
    ? ['Namespaces', 'Projects']
    : ['Applications', 'Deployments'],
  permissions: role.permissions,
}));

const Roles: React.FunctionComponent = () => {
  useDocumentTitle('ACM RBAC | Roles');
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newRoleName, setNewRoleName] = React.useState('');
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Default' | 'Custom'>('All');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All categories');
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = React.useState(false);
  const [bulkSelectorDropdownOpen, setBulkSelectorDropdownOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<{
    index: number;
    direction: 'asc' | 'desc';
  }>({ index: 0, direction: 'asc' });
  const [selectedRoles, setSelectedRoles] = React.useState<Set<number>>(new Set());
  const [openActionMenuId, setOpenActionMenuId] = React.useState<number | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isRoleAssignmentWizardOpen, setIsRoleAssignmentWizardOpen] = React.useState(false);
  const [selectedRoleForAssignment, setSelectedRoleForAssignment] = React.useState<string>('');
  
  // Get unique categories from roles
  const uniqueCategories = React.useMemo(() => {
    const categories = new Set(mockRoles.map(role => role.category));
    return ['All categories', ...Array.from(categories).sort()];
  }, []);

  const availablePermissions = ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch'];

  const handleCreateRole = () => {
    navigate('/user-management/roles/create');
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setNewRoleName('');
    setSelectedPermissions([]);
  };

  const handleSaveRole = () => {
    // In a real application, this would make an API call
    console.log('Creating role:', { name: newRoleName, permissions: selectedPermissions });
    handleModalClose();
  };

  const handlePermissionChange = (checked: boolean, permission: string) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permission]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    }
  };

  const handleSort = (_event: React.MouseEvent, columnIndex: number, direction: 'asc' | 'desc') => {
    setSortBy({ index: columnIndex, direction });
  };

  const sortedRoles = React.useMemo(() => {
    // Filter by type first
    let filtered = typeFilter === 'All' 
      ? mockRoles 
      : mockRoles.filter(role => role.type === typeFilter);
    
    // Then filter by category
    if (categoryFilter !== 'All categories') {
      filtered = filtered.filter(role => role.category === categoryFilter);
    }
    
    // Then sort
    const sorted = [...filtered];
    if (sortBy.index === 0) {
      sorted.sort((a, b) => {
        const comparison = a.displayName.localeCompare(b.displayName);
        return sortBy.direction === 'asc' ? comparison : -comparison;
      });
    }
    return sorted;
  }, [sortBy, typeFilter, categoryFilter]);

  const paginatedRoles = sortedRoles.slice((page - 1) * perPage, page * perPage);

  // Only consider Custom roles for "select all" logic
  const selectableRoles = paginatedRoles.filter(role => role.type !== 'Default');
  const isAllSelected = selectableRoles.length > 0 && selectableRoles.every(role => selectedRoles.has(role.id));
  const isPartiallySelected = selectedRoles.size > 0 && !isAllSelected;

  const handleSelectPage = () => {
    const newSelected = new Set(selectedRoles);
    // Only select Custom roles on this page
    paginatedRoles.forEach(role => {
      if (role.type !== 'Default') {
        newSelected.add(role.id);
      }
    });
    setSelectedRoles(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleSelectAllRoles = () => {
    const newSelected = new Set<number>();
    // Only select Custom roles across all pages
    sortedRoles.forEach(role => {
      if (role.type !== 'Default') {
        newSelected.add(role.id);
      }
    });
    setSelectedRoles(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedRoles(new Set());
  };

  const handleSelectRole = (roleId: number, isSelecting: boolean) => {
    const newSelected = new Set(selectedRoles);
    if (isSelecting) {
      newSelected.add(roleId);
    } else {
      newSelected.delete(roleId);
    }
    setSelectedRoles(newSelected);
  };

  const handleDeleteRoles = () => {
    console.log('Delete roles:', Array.from(selectedRoles));
    // Implement delete logic here
    setSelectedRoles(new Set());
  };

  const handleDuplicateRole = (roleId: number, roleName: string) => {
    console.log('Duplicate role:', roleId, roleName);
    // In a real application, this would duplicate the role
    setOpenActionMenuId(null);
  };

  const handleDeleteRole = (roleId: number, roleName: string) => {
    console.log('Delete role:', roleId, roleName);
    // In a real application, this would delete the role
    setOpenActionMenuId(null);
  };

  const handleCreateRoleAssignment = (roleName: string) => {
    setSelectedRoleForAssignment(roleName);
    setIsRoleAssignmentWizardOpen(true);
    setOpenActionMenuId(null);
  };

  const toggleActionMenu = (roleId: number) => {
    setOpenActionMenuId(openActionMenuId === roleId ? null : roleId);
  };

  return (
    <>
      <div className="table-content-card">
        <Toolbar>
          <ToolbarContent style={{ gap: '8px' }}>
            <ToolbarItem>
              <Dropdown
                isOpen={bulkSelectorDropdownOpen}
                onSelect={() => setBulkSelectorDropdownOpen(false)}
                onOpenChange={(isOpen: boolean) => setBulkSelectorDropdownOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => {
                      if (selectedRoles.size > 0) {
                        handleDeselectAll();
                      } else {
                        setBulkSelectorDropdownOpen(!bulkSelectorDropdownOpen);
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
                              handleSelectPage();
                            } else {
                              handleDeselectAll();
                            }
                          }}
                          aria-label="Select all"
                          id="select-all-roles-checkbox"
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
                    Select page ({selectableRoles.length} items)
                  </DropdownItem>
                  <DropdownItem key="select-all" onClick={handleSelectAllRoles}>
                    Select all ({sortedRoles.filter(r => r.type !== 'Default').length} items)
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isCategoryFilterOpen}
                onSelect={() => setIsCategoryFilterOpen(false)}
                onOpenChange={(isOpen) => setIsCategoryFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
                    isExpanded={isCategoryFilterOpen}
                    icon={<FilterIcon />}
                  >
                    {categoryFilter}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {uniqueCategories.map((category) => (
                    <DropdownItem
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Search roles"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                style={{ width: '250px' }}
              />
            </ToolbarItem>
            <ToolbarItem>
              <ToggleGroup aria-label="Role type filter">
                <ToggleGroupItem
                  text="All"
                  buttonId="all-toggle"
                  isSelected={typeFilter === 'All'}
                  onChange={() => setTypeFilter('All')}
                />
                <ToggleGroupItem
                  text="Default"
                  buttonId="default-toggle"
                  isSelected={typeFilter === 'Default'}
                  onChange={() => setTypeFilter('Default')}
                />
                <ToggleGroupItem
                  text="Custom"
                  buttonId="custom-toggle"
                  isSelected={typeFilter === 'Custom'}
                  onChange={() => setTypeFilter('Custom')}
                />
              </ToggleGroup>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary" onClick={handleCreateRole}>
                Create custom role
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button 
                variant="secondary" 
                onClick={handleDeleteRoles}
                isDisabled={selectedRoles.size === 0}
              >
                Delete role
              </Button>
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={sortedRoles.length}
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
        <Table aria-label="Roles table" variant="compact">
          <Thead>
            <Tr>
              <Th />
              <Th 
                width={25}
                sort={{ 
                  sortBy, 
                  onSort: handleSort, 
                  columnIndex: 0 
                }}
              >
                Role
              </Th>
              <Th width={35}>Description</Th>
              <Th width={20}>Category</Th>
              <Th width={15}>Type</Th>
              <Th width={10}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRoles.map((role) => (
              <Tr key={role.id}>
                <Td
                  select={{
                    rowIndex: role.id,
                    onSelect: (_event, isSelecting) => handleSelectRole(role.id, isSelecting),
                    isSelected: selectedRoles.has(role.id),
                    isDisabled: role.type === 'Default',
                  }}
                />
                <Td dataLabel="Role" width={25} style={{ textAlign: 'left' }}>
                  <div>
                    <Button 
                      variant="link" 
                      isInline 
                      onClick={() => navigate(`/user-management/roles/${role.name}`)} 
                      style={{ paddingLeft: 0, display: 'block' }}
                    >
                      {role.displayName}
                    </Button>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      {role.name}
                    </div>
                  </div>
                </Td>
                <Td dataLabel="Description" width={35} style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  {role.description}
                </Td>
                <Td dataLabel="Category" width={20}>
                  {role.category}
                </Td>
                <Td dataLabel="Type" width={15}>
                  <Label color={role.type === 'Default' ? 'blue' : 'green'}>{role.type}</Label>
                </Td>
                <Td dataLabel="Actions" width={10} style={{ textAlign: 'right' }}>
                  <Dropdown
                    isOpen={openActionMenuId === role.id}
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
                        onClick={() => toggleActionMenu(role.id)}
                        isExpanded={openActionMenuId === role.id}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                  >
                    <DropdownList>
                      <DropdownItem
                        key="create-assignment"
                        onClick={() => handleCreateRoleAssignment(role.name)}
                      >
                        Create role assignment
                      </DropdownItem>
                      {role.type === 'Custom' && (
                        <DropdownItem
                          key="edit"
                          onClick={() => navigate(`/user-management/roles/edit/${role.name}`, {
                            state: { roleData: role }
                          })}
                        >
                          Edit role
                        </DropdownItem>
                      )}
                      <DropdownItem
                        key="duplicate"
                        onClick={() => handleDuplicateRole(role.id, role.name)}
                      >
                        Duplicate role
                      </DropdownItem>
                      {role.type === 'Custom' && (
                        <DropdownItem
                          key="delete"
                          onClick={() => handleDeleteRole(role.id, role.name)}
                        >
                          Delete role
                        </DropdownItem>
                      )}
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div style={{ padding: '16px' }}>
          <Pagination
            itemCount={sortedRoles.length}
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

      <Modal
        variant={ModalVariant.medium}
        title="Create Custom Role"
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
      >
        <Form>
          <FormGroup label="Role Name" isRequired fieldId="role-name">
            <TextInput
              isRequired
              type="text"
              id="role-name"
              name="role-name"
              value={newRoleName}
              onChange={(_event, value) => setNewRoleName(value)}
            />
          </FormGroup>
          <FormGroup label="Permissions" isRequired fieldId="permissions">
            {availablePermissions.map((permission) => (
              <Checkbox
                key={permission}
                label={permission}
                id={`permission-${permission}`}
                isChecked={selectedPermissions.includes(permission)}
                onChange={(_event, checked) => handlePermissionChange(checked, permission)}
              />
            ))}
          </FormGroup>
        </Form>
        <div className="pf-v6-u-mt-md">
          <Button variant="primary" onClick={handleSaveRole}>
            Create
          </Button>{' '}
          <Button variant="link" onClick={handleModalClose}>
            Cancel
          </Button>
        </div>
      </Modal>

      {isRoleAssignmentWizardOpen && (
        <RoleDetailRoleAssignmentWizard
          isOpen={isRoleAssignmentWizardOpen}
          onClose={() => {
            setIsRoleAssignmentWizardOpen(false);
            setSelectedRoleForAssignment('');
          }}
          onComplete={(data) => {
            console.log('Role assignment created:', data);
            setIsRoleAssignmentWizardOpen(false);
            setSelectedRoleForAssignment('');
          }}
          roleName={selectedRoleForAssignment}
        />
      )}
    </>
  );
};

export { Roles };

