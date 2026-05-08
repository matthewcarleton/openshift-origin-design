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
  Checkbox,
  Label,
  Tooltip,
  Icon,
  Pagination,
  PaginationVariant,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Title,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { SyncAltIcon, CogIcon, EllipsisVIcon, TrashIcon, CaretDownIcon } from '@patternfly/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllGroups } from '@app/data';
import { useImpersonation } from '@app/shared/contexts/ImpersonationContext';
import { GroupRoleAssignmentWizard } from '../RoleAssignment/GroupRoleAssignmentWizard';

// Get groups from centralized database
const dbGroups = getAllGroups();

// Transform groups from database to component format
const mockGroups = dbGroups.map((group, index) => {
  // Most groups are synced from Identity Providers, only a few are Local
  const isLocal = group.name === 'local-admins' || group.name === 'test-group' || index % 7 === 0;
  
  const syncSources = ['PeteMobile LDAP', 'PeteMobile SSO', 'GitHub Enterprise'];
  const syncSource = isLocal ? 'Local' : syncSources[index % syncSources.length];
  
  const syncTimes = ['2 hours ago', '5 hours ago', '1 day ago', '3 days ago', 'Yesterday'];
  const lastSynced = isLocal ? null : syncTimes[index % syncTimes.length];
  
  return {
    id: index + 1,
    name: group.name,
    members: group.userIds.length,
    created: '2024-01-15', // Could be added to schema later
    syncSource,
    lastSynced,
  };
});

export const GroupsTable: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startImpersonation } = useImpersonation();
  const [searchValue, setSearchValue] = React.useState('');
  const [filterType, setFilterType] = React.useState('Group');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedGroups, setSelectedGroups] = React.useState<Set<number>>(new Set());
  const [bulkSelectorDropdownOpen, setBulkSelectorDropdownOpen] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [openRowMenuId, setOpenRowMenuId] = React.useState<number | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = React.useState(false);
  const [impersonateGroupName, setImpersonateGroupName] = React.useState('');
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [selectedGroupForWizard, setSelectedGroupForWizard] = React.useState('');
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = React.useState(false);
  const [newlyCreatedGroup, setNewlyCreatedGroup] = React.useState<string | null>(null);
  const [editedGroupName, setEditedGroupName] = React.useState<string | null>(null);
  const [additionalGroups, setAdditionalGroups] = React.useState<any[]>([]);

  // Check for newly created or edited group from navigation state
  React.useEffect(() => {
    const state = location.state as any;
    
    // Handle new group creation
    if (state?.newGroup && state?.showSuccessAlert) {
      const groupName = state.newGroup.name;
      const memberCount = state.newGroup.members.length;
      const preauthorizedMembers = state.newGroup.preauthorizedMembers || [];
      const totalMembers = memberCount + preauthorizedMembers.length;
      
      setAdditionalGroups(prev => {
        // Check if this group already exists in the current state
        const groupExists = prev.some(g => g.name === groupName);
        
        if (groupExists) {
          return prev; // Return unchanged if group already exists
        }
        
        // Generate unique ID using timestamp and random number
        const newId = Date.now() + Math.floor(Math.random() * 1000);
        
        const newGroup = {
          id: newId,
          name: groupName,
          members: totalMembers,
          activeMembers: state.newGroup.members,
          preauthorizedMembers: preauthorizedMembers,
          created: new Date().toLocaleDateString(),
          syncSource: 'Local',
          lastSynced: null,
        };
        
        return [newGroup, ...prev];
      });
      
      setNewlyCreatedGroup(groupName);
      setShowSuccessAlert(true);
      
      // Auto-dismiss alert after 8 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 8000);
      
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: null });
    }
    
    // Handle group edit
    if (state?.updatedGroup && state?.showEditSuccessAlert) {
      const updatedGroupData = state.updatedGroup;
      const originalName = updatedGroupData.originalName;
      const newName = updatedGroupData.name;
      const memberCount = updatedGroupData.members.length;
      const preauthorizedMembers = updatedGroupData.preauthorizedMembers || [];
      const totalMembers = memberCount + preauthorizedMembers.length;
      
      setAdditionalGroups(prev => {
        return prev.map(group => {
          if (group.name === originalName) {
            return {
              ...group,
              name: newName,
              members: totalMembers,
              activeMembers: updatedGroupData.members,
              preauthorizedMembers: preauthorizedMembers,
            };
          }
          return group;
        });
      });
      
      setEditedGroupName(newName);
      setShowEditSuccessAlert(true);
      
      // Auto-dismiss alert after 8 seconds
      setTimeout(() => {
        setShowEditSuccessAlert(false);
      }, 8000);
      
      // Clear navigation state
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  const allGroups = [...additionalGroups, ...mockGroups];
  const paginatedGroups = allGroups.slice((page - 1) * perPage, page * perPage);

  const handleSelectPage = () => {
    const newSelected = new Set(selectedGroups);
    paginatedGroups.forEach(group => newSelected.add(group.id));
    setSelectedGroups(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleSelectAll = () => {
    const newSelected = new Set(mockGroups.map(group => group.id));
    setSelectedGroups(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedGroups(new Set());
  };

  const handleGroupSelect = (groupId: number, isSelected: boolean) => {
    const newSelected = new Set(selectedGroups);
    if (isSelected) {
      newSelected.add(groupId);
    } else {
      newSelected.delete(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const isAllPageSelected = paginatedGroups.length > 0 && paginatedGroups.every(group => selectedGroups.has(group.id));

  const handleSyncGroups = () => {
    console.log('Syncing groups from external identity providers...');
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      console.log('Groups synced successfully');
    }, 2000);
  };

  const handleConfigureSync = () => {
    console.log('Opening group sync configuration...');
    // Navigate to sync configuration page or open modal
  };

  const handleDeleteGroup = (groupId: number, groupName: string) => {
    console.log('Delete group:', groupId, groupName);
    // In a real application, this would delete the group
    setOpenRowMenuId(null);
  };

  const toggleRowMenu = (groupId: number) => {
    setOpenRowMenuId(openRowMenuId === groupId ? null : groupId);
  };

  const handleImpersonateGroup = (groupName: string) => {
    setImpersonateGroupName(groupName);
    setIsImpersonateModalOpen(true);
    setOpenRowMenuId(null);
  };

  const handleCreateRoleAssignment = (groupName: string) => {
    setSelectedGroupForWizard(groupName);
    setIsWizardOpen(true);
    setOpenRowMenuId(null);
  };

  const handleWizardComplete = (data: any) => {
    console.log('Role assignment created:', data);
    setIsWizardOpen(false);
  };

  const handleImpersonateConfirm = () => {
    // Close modal immediately and start impersonation with a placeholder user and the group
    setIsImpersonateModalOpen(false);
    // Use the first user from the group as placeholder (in a real app, you'd select a specific user)
    startImpersonation('group-member', [impersonateGroupName]);
    // Clear the form state
    setImpersonateGroupName('');
  };

  const handleImpersonateCancel = () => {
    setIsImpersonateModalOpen(false);
    setImpersonateGroupName('');
  };

  return (
    <>
      {/* Success Alert */}
      <AlertGroup isToast isLiveRegion>
        {showSuccessAlert && (
          <Alert
            variant="success"
            title={`Local group "${newlyCreatedGroup}" successfully created`}
            timeout={8000}
            onTimeout={() => setShowSuccessAlert(false)}
            actionClose={<AlertActionCloseButton onClose={() => setShowSuccessAlert(false)} />}
          />
        )}
        {showEditSuccessAlert && (
          <Alert
            variant="info"
            title={`Local group "${editedGroupName}" successfully updated`}
            timeout={8000}
            onTimeout={() => setShowEditSuccessAlert(false)}
            actionClose={<AlertActionCloseButton onClose={() => setShowEditSuccessAlert(false)} />}
          />
        )}
      </AlertGroup>
      
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
                    if (selectedGroups.size > 0) {
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
                        isChecked={isAllPageSelected}
                        onChange={(event, checked) => {
                          event.stopPropagation();
                          if (checked) {
                            handleSelectPage();
                          } else {
                            handleDeselectAll();
                          }
                        }}
                        aria-label="Select all"
                        id="select-all-groups-checkbox"
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
                  Select page ({paginatedGroups.length} items)
                </DropdownItem>
                <DropdownItem key="select-all" onClick={handleSelectAll}>
                  Select all ({allGroups.length} items)
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
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
                <DropdownItem value="Group" onClick={() => setFilterType('Group')}>
                  Group
                </DropdownItem>
                <DropdownItem value="User" onClick={() => setFilterType('User')}>
                  User
                </DropdownItem>
                <DropdownItem value="Service account" onClick={() => setFilterType('Service account')}>
                  Service account
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              placeholder="Search groups"
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary" onClick={() => navigate('/user-management/groups/create')}>Create local group</Button>
          </ToolbarItem>
          <ToolbarItem>
            <Dropdown
              isOpen={isActionsOpen}
              onSelect={() => setIsActionsOpen(false)}
              onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle 
                  ref={toggleRef} 
                  onClick={() => setIsActionsOpen(!isActionsOpen)} 
                  isExpanded={isActionsOpen}
                  variant="plain"
                >
                  Actions
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem 
                  key="sync-groups"
                  icon={<SyncAltIcon />}
                  onClick={handleSyncGroups}
                  isDisabled={isSyncing}
                  description="Sync groups from connected identity providers"
                >
                  {isSyncing ? 'Syncing...' : 'Sync groups'}
                </DropdownItem>
                <DropdownItem 
                  key="configure-sync"
                  icon={<CogIcon />}
                  onClick={handleConfigureSync}
                  description="Configure group sync from identity providers"
                >
                  Configure sync
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={allGroups.length}
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
      <Table aria-label="Groups table" variant="compact">
        <Thead>
          <Tr>
            <Th />
            <Th width={20}>Group</Th>
            <Th width={15}>Members</Th>
            <Th width={20}>Sync Source</Th>
            <Th width={20}>Last Synced</Th>
            <Th width={15}>Created</Th>
            <Th width={10}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedGroups.map((group) => (
            <Tr key={group.id}>
              <Td
                select={{
                  rowIndex: group.id,
                  onSelect: (_event, isSelecting) => handleGroupSelect(group.id, isSelecting),
                  isSelected: selectedGroups.has(group.id),
                }}
              />
              <Td dataLabel="Group" width={20}>
                <Button 
                  variant="link"
                  isInline
                  onClick={() => navigate(`/user-management/groups/${group.name}`, {
                    state: { groupData: group }
                  })}
                >
                  {group.name}
                </Button>
              </Td>
              <Td dataLabel="Members" width={15}>{group.members}</Td>
              <Td dataLabel="Sync Source" width={20}>
                {group.syncSource === 'Local' ? (
                  <Label color="grey">{group.syncSource}</Label>
                ) : (
                  <Label color="blue" icon={<SyncAltIcon />}>{group.syncSource}</Label>
                )}
              </Td>
              <Td dataLabel="Last Synced" width={20}>
                {group.lastSynced ? (
                  <span>{group.lastSynced}</span>
                ) : (
                  <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>—</span>
                )}
              </Td>
              <Td dataLabel="Created" width={15}>{group.created}</Td>
              <Td dataLabel="Actions" width={10} style={{ textAlign: 'right' }}>
                  <Dropdown
                    isOpen={openRowMenuId === group.id}
                    onSelect={() => setOpenRowMenuId(null)}
                    onOpenChange={(isOpen: boolean) => {
                      if (!isOpen) {
                        setOpenRowMenuId(null);
                      }
                    }}
                    popperProps={{
                      position: 'end'
                    }}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        aria-label="Actions menu"
                        variant="plain"
                        onClick={() => toggleRowMenu(group.id)}
                        isExpanded={openRowMenuId === group.id}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                  >
                  <DropdownList>
                    {group.syncSource === 'Local' && (
                      <DropdownItem
                        key="edit"
                        onClick={() => navigate(`/user-management/groups/edit/${group.name}`, {
                          state: { groupData: group }
                        })}
                      >
                        Edit
                      </DropdownItem>
                    )}
                    <DropdownItem
                      key="create-role-assignment"
                      onClick={() => handleCreateRoleAssignment(group.name)}
                    >
                      Create role assignment
                    </DropdownItem>
                    <DropdownItem
                      key="impersonate"
                      onClick={() => handleImpersonateGroup(group.name)}
                    >
                      Impersonate
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      onClick={() => handleDeleteGroup(group.id, group.name)}
                      isDisabled={group.syncSource !== 'Local'}
                      description={group.syncSource !== 'Local' ? 'Synced groups cannot be deleted locally' : undefined}
                    >
                      Delete group
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
          itemCount={allGroups.length}
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
        variant={ModalVariant.small}
        isOpen={isImpersonateModalOpen}
        onClose={handleImpersonateCancel}
        aria-labelledby="impersonate-group-modal-title"
        aria-describedby="impersonate-group-modal-description"
      >
        <ModalHeader>
          <Title headingLevel="h1" size="2xl" id="impersonate-group-modal-title">
            Impersonate group
          </Title>
        </ModalHeader>
        <ModalBody style={{ padding: '24px' }}>
          <Alert 
            variant="warning" 
            isInline 
            title="You are about to impersonate a group"
            style={{ marginBottom: '16px' }}
          >
            This will allow you to see the system from the perspective of users in this group.
          </Alert>

          <div style={{ marginBottom: '16px' }}>
            <strong>Group:</strong> {impersonateGroupName}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleImpersonateConfirm}>
            Impersonate
          </Button>
          <Button variant="link" onClick={handleImpersonateCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <GroupRoleAssignmentWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)}
        groupName={selectedGroupForWizard}
        onComplete={handleWizardComplete}
      />
    </>
  );
};
