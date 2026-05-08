import * as React from 'react';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  PaginationVariant,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Title,
  Alert,
  Form,
  FormGroup,
  Label,
  Checkbox,
  Divider,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { EllipsisVIcon, HelpIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '@app/data/queries';
import { useImpersonation } from '@app/shared/contexts/ImpersonationContext';

// Get users from centralized database
const dbUsers = getAllUsers();

// Transform users from database to component format
const mockUsers = dbUsers.map((user, index) => ({
  id: index + 1,
  name: `${user.firstName} ${user.lastName}`,
  username: user.username,
  identityProvider: 'LDAP',
  created: new Date(user.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
}));

export const UsersTable: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { startImpersonation } = useImpersonation();
  const [searchValue, setSearchValue] = React.useState('');
  const [filterType, setFilterType] = React.useState('User');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [openRowMenuId, setOpenRowMenuId] = React.useState<number | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = React.useState(false);
  const [impersonateUsername, setImpersonateUsername] = React.useState('');
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = React.useState(false);

  const paginatedUsers = mockUsers.slice((page - 1) * perPage, page * perPage);

  const toggleRowMenu = (userId: number) => {
    setOpenRowMenuId(openRowMenuId === userId ? null : userId);
  };

  const handleImpersonateUser = (userName: string, username: string) => {
    setImpersonateUsername(username);
    setIsImpersonateModalOpen(true);
    setOpenRowMenuId(null);
  };

  const handleImpersonateConfirm = () => {
    // Close modal immediately and start impersonation with the selected username and groups
    setIsImpersonateModalOpen(false);
    startImpersonation(impersonateUsername, selectedGroups);
    // Clear the form state
    setImpersonateUsername('');
    setSelectedGroups([]);
    setIsGroupDropdownOpen(false);
  };

  const handleImpersonateCancel = () => {
    setIsImpersonateModalOpen(false);
    setImpersonateUsername('');
    setSelectedGroups([]);
    setIsGroupDropdownOpen(false);
  };

  const handleGroupToggle = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleRemoveGroup = (groupToRemove: string) => {
    setSelectedGroups(prev => prev.filter(g => g !== groupToRemove));
  };

  const availableGroups = ['dev-team-alpha'];

  const handleSelectAll = () => {
    if (selectedGroups.length === availableGroups.length) {
      // If all are selected, deselect all
      setSelectedGroups([]);
    } else {
      // Otherwise, select all
      setSelectedGroups([...availableGroups]);
    }
  };

  const isAllSelected = selectedGroups.length === availableGroups.length;
  const isSomeSelected = selectedGroups.length > 0 && selectedGroups.length < availableGroups.length;

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
                <DropdownItem value="User" onClick={() => setFilterType('User')}>
                  User
                </DropdownItem>
                <DropdownItem value="Group" onClick={() => setFilterType('Group')}>
                  Group
                </DropdownItem>
                <DropdownItem value="Service account" onClick={() => setFilterType('Service account')}>
                  Service account
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder="Search users"
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={mockUsers.length}
              perPage={perPage}
              page={page}
              onSetPage={(_event, pageNumber) => setPage(pageNumber)}
              onPerPageSelect={(_event, perPage) => {
                setPerPage(perPage);
                setPage(1);
              }}
              variant={PaginationVariant.top}
              isCompact
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Users table" variant="compact">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Identity provider</Th>
            <Th>Created</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedUsers.map((user) => (
            <Tr key={user.id}>
              <Td dataLabel="User">
                <Button
                  variant="link"
                  isInline
                  onClick={() => navigate(`/user-management/identities/${user.name}`)}
                >
                  {user.name}
                </Button>
                <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>{user.username}</div>
              </Td>
              <Td dataLabel="Identity provider">{user.identityProvider}</Td>
              <Td dataLabel="Created">{user.created}</Td>
              <Td dataLabel="Actions" style={{ textAlign: 'right' }}>
                <Dropdown
                  isOpen={openRowMenuId === user.id}
                  onSelect={() => setOpenRowMenuId(null)}
                  onOpenChange={(isOpen: boolean) => {
                    if (!isOpen) {
                      setOpenRowMenuId(null);
                    }
                  }}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      aria-label="Actions menu"
                      variant="plain"
                      onClick={() => toggleRowMenu(user.id)}
                      isExpanded={openRowMenuId === user.id}
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  shouldFocusToggleOnSelect
                >
                  <DropdownList>
                    <DropdownItem
                      key="impersonate"
                      onClick={() => handleImpersonateUser(user.name, user.username)}
                    >
                      Impersonate
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div style={{ padding: '16px' }}>
        <Pagination
          itemCount={mockUsers.length}
          perPage={perPage}
          page={page}
          onSetPage={(_event, pageNumber) => setPage(pageNumber)}
          onPerPageSelect={(_event, perPage) => {
            setPerPage(perPage);
            setPage(1);
          }}
          variant={PaginationVariant.bottom}
        />
      </div>

      <Modal
        variant={ModalVariant.small}
        isOpen={isImpersonateModalOpen}
        onClose={handleImpersonateCancel}
      >
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Title headingLevel="h1" size="2xl">
              Impersonate user
            </Title>
            <Tooltip content="Impersonate a user to test their permissions">
              <HelpIcon style={{ fontSize: '16px', cursor: 'help', color: 'var(--pf-t--global--icon--color--subtle)' }} />
            </Tooltip>
          </div>
        </ModalHeader>
        <ModalBody style={{ padding: '24px' }}>
          <Form>
            <Alert
              variant="warning"
              isInline
              title="Impersonating a user or group grants you their exact permissions."
              style={{ marginBottom: '24px' }}
            />
            
            <FormGroup
              label={
                <span>
                  Username{' '}
                  <Tooltip content="The username of the user or group to impersonate">
                    <button
                      type="button"
                      aria-label="More info for username field"
                      onClick={e => e.preventDefault()}
                      className="pf-v6-c-form__group-label-help"
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </span>
              }
              fieldId="impersonate-username"
            >
              <div style={{ padding: '8px 0', fontWeight: 'normal' }}>
                {impersonateUsername}
              </div>
            </FormGroup>

            <FormGroup
              label={
                <span>
                  Groups{' '}
                  <Tooltip content="Optional: Specify additional groups for this impersonation session">
                    <button
                      type="button"
                      aria-label="More info for groups field"
                      onClick={e => e.preventDefault()}
                      className="pf-v6-c-form__group-label-help"
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </span>
              }
              fieldId="impersonate-groups"
            >
              <Dropdown
                isOpen={isGroupDropdownOpen}
                onOpenChange={(isOpen: boolean) => setIsGroupDropdownOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                    isExpanded={isGroupDropdownOpen}
                    isFullWidth
                  >
                    {selectedGroups.length > 0 ? `${selectedGroups.length} group(s) selected` : 'Select groups'}
                  </MenuToggle>
                )}
                popperProps={{
                  appendTo: () => document.body
                }}
              >
                <DropdownList>
                  <DropdownItem onClick={handleSelectAll}>
                    <Checkbox
                      id="select-all"
                      isChecked={isAllSelected}
                      onChange={handleSelectAll}
                      label="Select all"
                    />
                  </DropdownItem>
                  <Divider />
                  <DropdownItem onClick={() => handleGroupToggle('dev-team-alpha')}>
                    <Checkbox
                      id="dev-team-alpha"
                      isChecked={selectedGroups.includes('dev-team-alpha')}
                      onChange={() => handleGroupToggle('dev-team-alpha')}
                      label="dev-team-alpha"
                    />
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
              
              {selectedGroups.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {selectedGroups.map((group) => (
                    <Label
                      key={group}
                      color="blue"
                      onClose={() => handleRemoveGroup(group)}
                    >
                      {group}
                    </Label>
                  ))}
                </div>
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button key="confirm" variant="primary" onClick={handleImpersonateConfirm}>
            Impersonate
          </Button>
          <Button key="cancel" variant="link" onClick={handleImpersonateCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

