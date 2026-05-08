import * as React from 'react';
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Grid,
  GridItem,
  Card,
  CardBody,
  TextArea,
  Split,
  SplitItem,
  Content,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Checkbox,
  Pagination,
  PaginationVariant,
  Label,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  ToggleGroup,
  ToggleGroupItem,
  Flex,
  FlexItem,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { DownloadIcon, TimesIcon, FilterIcon, CaretDownIcon, SyncAltIcon } from '@patternfly/react-icons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { getAllUsers, getAllIdentityProviders, getIdentityProviderById, getGroupByName, getUsersByGroup } from '@app/data/queries';

const CreateGroup: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupName: groupNameParam } = useParams<{ groupName?: string }>();
  
  // Determine if we're in edit mode
  const isEditMode = location.pathname.includes('/edit/');
  const groupData = location.state?.groupData;
  
  useDocumentTitle(isEditMode ? 'ACM RBAC | Edit Local Group' : 'ACM RBAC | Create Local Group');
  
  const [groupName, setGroupName] = React.useState('example');
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [yamlCode, setYamlCode] = React.useState('');
  const [userSearch, setUserSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [filterType, setFilterType] = React.useState('Name');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [userViewMode, setUserViewMode] = React.useState<'all' | 'selected'>('all');
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = React.useState(false);
  const [originalGroupName, setOriginalGroupName] = React.useState('');
  
  // Pre-authorization states
  const [isPreauthorizing, setIsPreauthorizing] = React.useState(false);
  const [preauthorizeEmail, setPreauthorizeEmail] = React.useState('');
  const [preauthorizeIdpId, setPreauthorizeIdpId] = React.useState<string | null>(null);
  const [isIdpDropdownOpen, setIsIdpDropdownOpen] = React.useState(false);
  const [preauthorizedMembers, setPreauthorizedMembers] = React.useState<Array<{
    identifier: string;
    idpId: string | null;
    idpName: string;
  }>>([]);

  // Get all users and identity providers from the database
  const allUsers = getAllUsers();
  const allIdentityProviders = getAllIdentityProviders();
  
  const mockUsers = allUsers.map((user) => {
    const identityProvider = getIdentityProviderById(user.identityProviderId);
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      email: user.email,
      ldap: identityProvider?.name || 'Unknown',
      isPending: false,
      provider: identityProvider?.name || 'Unknown',
    };
  });
  
  // Add pre-authorized members to the user list
  const preauthorizedUsers = preauthorizedMembers.map((member, index) => ({
    id: -(index + 1), // Negative IDs for pre-auth users
    name: member.identifier,
    username: member.identifier,
    email: member.identifier,
    ldap: member.idpName,
    isPending: true,
    provider: member.idpName,
  }));
  
  const allUsersWithPreauth = [...preauthorizedUsers, ...mockUsers];

  // Load group data in edit mode
  React.useEffect(() => {
    if (isEditMode && groupNameParam) {
      const group = getGroupByName(groupNameParam);
      if (group) {
        setGroupName(group.name);
        setOriginalGroupName(group.name);
        
        // Get the users in this group
        const groupUsers = getUsersByGroup(group.id);
        const usernames = groupUsers.map(user => user.username);
        setSelectedUsers(usernames);
      }
    }
  }, [isEditMode, groupNameParam]);

  // Filter users based on view mode, search and filter type
  const filteredUsers = allUsersWithPreauth.filter(user => {
    // First filter by view mode
    if (userViewMode === 'selected' && !selectedUsers.includes(user.username)) {
      return false;
    }
    
    // Then filter by search
    if (!userSearch) return true;
    
    const searchLower = userSearch.toLowerCase();
    switch (filterType) {
      case 'Name':
        return user.name.toLowerCase().includes(searchLower);
      case 'Username':
        return user.username.toLowerCase().includes(searchLower);
      case 'Email':
        return user.email.toLowerCase().includes(searchLower);
      case 'LDAP':
        return user.ldap.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  // Pagination
  const startIdx = (page - 1) * perPage;
  const endIdx = startIdx + perPage;
  const paginatedUsers = filteredUsers.slice(startIdx, endIdx);

  const handleUserToggle = (username: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers([...selectedUsers, username]);
    } else {
      setSelectedUsers(selectedUsers.filter(u => u !== username));
    }
  };

  const handleSelectAllUsers = (isChecked: boolean) => {
    if (isChecked) {
      const allUsernames = filteredUsers.map(u => u.username);
      setSelectedUsers(allUsernames);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectPageUsers = () => {
    const pageUsernames = paginatedUsers.map(u => u.username);
    const newSelected = Array.from(new Set([...selectedUsers, ...pageUsernames]));
    setSelectedUsers(newSelected);
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const isAllPageSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.includes(u.username));

  const handleRemoveUser = (username: string) => {
    setSelectedUsers(selectedUsers.filter(u => u !== username));
  };

  const generateYAML = () => {
    // Combine existing users and pre-authorized members
    const allMembers = [
      ...selectedUsers,
      ...preauthorizedMembers.map(m => `${m.identifier} # Pending`)
    ];
    
    const usersSection = allMembers.length > 0
      ? `users:\n${allMembers.map(u => `  - ${u}`).join('\n')}`
      : 'users: []';

    return `apiVersion: user.openshift.io/v1
kind: Group
metadata:
  name: ${groupName || 'example'}
${usersSection}`;
  };

  // Update YAML code whenever form changes
  React.useEffect(() => {
    setYamlCode(generateYAML());
  }, [groupName, selectedUsers, preauthorizedMembers]);

  const handleCopyYAML = () => {
    const yaml = generateYAML();
    navigator.clipboard.writeText(yaml);
  };

  const handleDownloadYAML = () => {
    const yaml = generateYAML();
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${groupName || 'group'}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (isEditMode) {
      // Update the existing group
      const updatedGroup = {
        name: groupName,
        members: selectedUsers,
        preauthorizedMembers: preauthorizedMembers,
        originalName: originalGroupName,
      };
      
      // Navigate back to Identities page with the updated group data
      navigate('/user-management/identities', { 
        state: { 
          updatedGroup,
          showEditSuccessAlert: true 
        } 
      });
    } else {
      // Create the group data
      const newGroup = {
        name: groupName,
        members: selectedUsers,
        preauthorizedMembers: preauthorizedMembers,
        created: new Date().toISOString(),
      };
      
      // Navigate back to Identities page with the new group data
      navigate('/user-management/identities', { 
        state: { 
          newGroup,
          showSuccessAlert: true 
        } 
      });
    }
  };

  const handleCancel = () => {
    navigate('/identities');
  };

  // Validation
  const isFormValid = groupName.trim() !== '' && (selectedUsers.length > 0 || preauthorizedMembers.length > 0);

  return (
    <div className="identities-page-container">
      <div className="page-header-section">
        {/* Breadcrumb */}
        <Breadcrumb style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/identities'); }}>
            Identities
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{isEditMode ? 'Edit local group' : 'Create local group'}</BreadcrumbItem>
        </Breadcrumb>

        {/* Page Title */}
        <Split style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
          <SplitItem isFilled>
            <Title headingLevel="h1" size="2xl">{isEditMode ? 'Edit local group' : 'Create local group'}</Title>
          </SplitItem>
          <SplitItem>
            <Button variant="secondary" onClick={handleCancel} style={{ marginRight: 'var(--pf-t--global--spacer--sm)' }}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              isDisabled={!isFormValid}
            >
              {isEditMode ? 'Save' : 'Create'}
            </Button>
          </SplitItem>
        </Split>
      </div>

      <div className="page-content-section">
        <Grid hasGutter style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
          <GridItem span={8}>
          <Card>
            <CardBody style={{ padding: 'var(--pf-t--global--spacer--xl)' }}>
              <Form>
                <FormGroup label="Group name" isRequired fieldId="group-name">
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm">
                    Enter a unique name for this group.
                  </Content>
                  <TextInput
                    isRequired
                    type="text"
                    id="group-name"
                    name="group-name"
                    value={groupName}
                    onChange={(_event, value) => setGroupName(value)}
                    placeholder="Enter group name"
                    validated={groupName.trim() === '' ? 'error' : 'default'}
                  />
                  {groupName.trim() === '' && (
                    <Content component="p" className="pf-v6-u-font-size-sm" style={{ color: 'var(--pf-t--global--color--status--danger--default)', marginTop: 'var(--pf-t--global--spacer--sm)' }}>
                      Group name is required
                    </Content>
                  )}
                </FormGroup>

                <FormGroup label="Members" isRequired fieldId="group-members" style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    Select at least one user to add as a member of this group, or{' '}
                    <Button
                      variant="link"
                      isInline
                      onClick={() => {
                        setIsPreauthorizing(true);
                        setUserSearch('');
                      }}
                      style={{ padding: 0, fontSize: 'inherit' }}
                    >
                      add pre-authorized member
                    </Button>
                    .
                  </Content>

                  {/* User selection table */}
                  <Toolbar style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                    <ToolbarContent>
                      <ToolbarItem>
                        <Dropdown
                          isOpen={isBulkSelectorOpen}
                          onSelect={() => setIsBulkSelectorOpen(false)}
                          onOpenChange={(isOpen: boolean) => setIsBulkSelectorOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setIsBulkSelectorOpen(!isBulkSelectorOpen)}
                              isExpanded={isBulkSelectorOpen}
                              style={{
                                border: '1px solid var(--pf-t--global--border--color--default)',
                                borderRadius: 'var(--pf-t--global--border--radius--small)',
                                padding: '6px 8px',
                                minWidth: 'auto',
                              }}
                            >
                              <Checkbox
                                isChecked={isAllPageSelected}
                                onChange={(event, checked) => {
                                  event.stopPropagation();
                                  if (checked) {
                                    handleSelectPageUsers();
                                  } else {
                                    handleDeselectAll();
                                  }
                                }}
                                aria-label="Select all"
                                id="select-all-users-checkbox"
                              />
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem key="select-none" onClick={() => { handleDeselectAll(); setIsBulkSelectorOpen(false); }}>
                              Select none (0 items)
                            </DropdownItem>
                            <DropdownItem key="select-page" onClick={handleSelectPageUsers}>
                              Select page ({paginatedUsers.length} items)
                            </DropdownItem>
                            <DropdownItem key="select-all" onClick={() => { handleSelectAllUsers(true); setIsBulkSelectorOpen(false); }}>
                              Select all ({filteredUsers.length} items)
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
                              icon={<FilterIcon />}
                            >
                              {filterType}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem key="name" onClick={() => setFilterType('Name')}>
                              Name
                            </DropdownItem>
                            <DropdownItem key="username" onClick={() => setFilterType('Username')}>
                              Username
                            </DropdownItem>
                            <DropdownItem key="email" onClick={() => setFilterType('Email')}>
                              Email
                            </DropdownItem>
                            <DropdownItem key="ldap" onClick={() => setFilterType('LDAP')}>
                              LDAP
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </ToolbarItem>
                      <ToolbarItem style={{ flex: 1 }}>
                        <SearchInput
                          placeholder={`Search by ${filterType.toLowerCase()}`}
                          value={userSearch}
                          onChange={(_event, value) => {
                            setUserSearch(value);
                            setPage(1);
                          }}
                          onClear={() => {
                            setUserSearch('');
                            setPage(1);
                          }}
                        />
                      </ToolbarItem>
                      <ToolbarItem>
                        <ToggleGroup aria-label="User view toggle">
                          <ToggleGroupItem
                            text="All"
                            buttonId="user-view-all"
                            isSelected={userViewMode === 'all'}
                            onChange={() => {
                              setUserViewMode('all');
                              setPage(1);
                            }}
                          />
                          <ToggleGroupItem
                            text={`Selected (${selectedUsers.length})`}
                            buttonId="user-view-selected"
                            isSelected={userViewMode === 'selected'}
                            onChange={() => {
                              setUserViewMode('selected');
                              setPage(1);
                            }}
                          />
                        </ToggleGroup>
                      </ToolbarItem>
                      <ToolbarItem variant="pagination">
                        <Pagination
                          itemCount={filteredUsers.length}
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

                  {/* Pre-authorization form */}
                  {isPreauthorizing && (
                    <div style={{ 
                      padding: 'var(--pf-t--global--spacer--lg)',
                      marginBottom: 'var(--pf-t--global--spacer--md)',
                      border: '1px solid var(--pf-t--global--border--color--default)',
                      borderRadius: 'var(--pf-t--global--border--radius--small)'
                    }}>
                      <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                        Pre-authorize member
                      </Title>
                      
                      <Form>
                        <FormGroup label="User identifier" isRequired fieldId="preauth-identifier">
                          <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm">
                            Enter the email address or username that will be used when this person logs in for the first time.
                          </Content>
                          <TextInput
                            isRequired
                            type="text"
                            id="preauth-identifier"
                            value={preauthorizeEmail}
                            onChange={(_event, value) => setPreauthorizeEmail(value)}
                            placeholder="e.g., john.doe@company.com"
                          />
                        </FormGroup>

                        <FormGroup label="Identity Provider (optional)" fieldId="preauth-idp" style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                          <Dropdown
                            isOpen={isIdpDropdownOpen}
                            onSelect={() => setIsIdpDropdownOpen(false)}
                            onOpenChange={(isOpen: boolean) => setIsIdpDropdownOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsIdpDropdownOpen(!isIdpDropdownOpen)}
                                isExpanded={isIdpDropdownOpen}
                                style={{ width: '100%' }}
                              >
                                {preauthorizeIdpId !== null 
                                  ? allIdentityProviders.find(idp => idp.id === preauthorizeIdpId)?.name || 'Any identity provider'
                                  : 'Any identity provider'}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              <DropdownItem 
                                key="any" 
                                onClick={() => {
                                  setPreauthorizeIdpId(null);
                                  setIsIdpDropdownOpen(false);
                                }}
                              >
                                Any identity provider
                              </DropdownItem>
                              {allIdentityProviders.map((idp) => (
                                <DropdownItem 
                                  key={idp.id} 
                                  onClick={() => {
                                    setPreauthorizeIdpId(idp.id);
                                    setIsIdpDropdownOpen(false);
                                  }}
                                >
                                  {idp.name}
                                </DropdownItem>
                              ))}
                            </DropdownList>
                          </Dropdown>
                        </FormGroup>

                        <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                          <Button
                            variant="primary"
                            onClick={() => {
                              const idpName = preauthorizeIdpId !== null
                                ? allIdentityProviders.find(idp => idp.id === preauthorizeIdpId)?.name || 'Any'
                                : 'Any';
                              
                              // Add to pre-authorized members
                              setPreauthorizedMembers([
                                ...preauthorizedMembers,
                                {
                                  identifier: preauthorizeEmail,
                                  idpId: preauthorizeIdpId,
                                  idpName: idpName,
                                }
                              ]);
                              
                              // Auto-select the pre-authorized member
                              setSelectedUsers([...selectedUsers, preauthorizeEmail]);
                              
                              // Reset form
                              setPreauthorizeEmail('');
                              setPreauthorizeIdpId(null);
                              setIsPreauthorizing(false);
                            }}
                            isDisabled={preauthorizeEmail.trim() === ''}
                            style={{ marginRight: 'var(--pf-t--global--spacer--sm)' }}
                          >
                            Add pre-authorized member
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => {
                              setIsPreauthorizing(false);
                              setPreauthorizeEmail('');
                              setPreauthorizeIdpId(null);
                            }}
                          >
                            Cancel and select users instead
                          </Button>
                        </div>
                      </Form>
                    </div>
                  )}

                  {/* Empty state when no users found and not preauthorizing */}
                  {!isPreauthorizing && filteredUsers.length === 0 && userSearch.trim() !== '' && (
                    <EmptyState>
                      <EmptyStateBody>
                        <Content>No users found matching "{userSearch}"</Content>
                        <Button
                          variant="primary"
                          icon={<SyncAltIcon />}
                          onClick={() => {
                            setIsPreauthorizing(true);
                            setPreauthorizeEmail(userSearch);
                          }}
                          style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                        >
                          Pre-authorize '{userSearch}'
                        </Button>
                      </EmptyStateBody>
                    </EmptyState>
                  )}

                  {/* Users table */}
                  {!isPreauthorizing && filteredUsers.length > 0 && (
                  <Table aria-label="Users table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th />
                        <Th>Name</Th>
                        <Th>Username</Th>
                        <Th>Email</Th>
                        <Th>LDAP</Th>
                        <Th>Status</Th>
                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedUsers.map(user => (
                        <Tr 
                          key={user.id}
                          isClickable
                          onRowClick={() => handleUserToggle(user.username, !selectedUsers.includes(user.username))}
                        >
                          <Td>
                            <Checkbox
                              id={`select-${user.id}`}
                              isChecked={selectedUsers.includes(user.username)}
                              onChange={(event, isChecked) => {
                                event.stopPropagation();
                                handleUserToggle(user.username, isChecked);
                              }}
                              aria-label={`Select ${user.name}`}
                              onClick={(event) => event.stopPropagation()}
                            />
                          </Td>
                          <Td>
                            {user.isPending ? (
                              <span style={{ fontWeight: 'bold' }}>{user.name}</span>
                            ) : (
                              <Button 
                                variant="link" 
                                isInline 
                                style={{ paddingLeft: 0 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/user-management/identities/${user.username}`);
                                }}
                              >
                                {user.name}
                              </Button>
                            )}
                          </Td>
                          <Td>{user.isPending ? '—' : user.username}</Td>
                          <Td>{user.isPending ? '—' : user.email}</Td>
                          <Td>{user.isPending && user.provider === 'Any' ? '—' : user.ldap}</Td>
                          <Td>
                            {user.isPending ? (
                              <Label color="orange">Pending</Label>
                            ) : (
                              '—'
                            )}
                          </Td>
                          <Td isActionCell>
                            {user.isPending && (
                              <ActionsColumn
                                items={[
                                  {
                                    title: 'Delete',
                                    onClick: (event) => {
                                      event.stopPropagation();
                                      // Remove from pre-authorized members
                                      setPreauthorizedMembers(
                                        preauthorizedMembers.filter(m => m.identifier !== user.username)
                                      );
                                    },
                                  },
                                ]}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  )}

                  {!isPreauthorizing && filteredUsers.length > 0 && (
                  <div style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                    <Pagination
                      itemCount={filteredUsers.length}
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
                  )}
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem span={4}>
          <Card style={{ position: 'sticky', top: 'var(--pf-t--global--spacer--lg)' }}>
            <CardBody style={{ padding: 'var(--pf-t--global--spacer--xl)' }}>
              <Split style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                <SplitItem isFilled>
                  <Title headingLevel="h2" size="lg">Live YAML</Title>
                </SplitItem>
                <SplitItem>
                  <Button 
                    variant="plain" 
                    icon={<DownloadIcon />}
                    onClick={handleDownloadYAML}
                    aria-label="Download YAML"
                  />
                </SplitItem>
              </Split>
              <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                Auto-generated from the form. You can manually edit the YAML directly.
              </Content>
              <div style={{ position: 'relative' }}>
                <TextArea
                  value={yamlCode}
                  onChange={(_event, value) => setYamlCode(value)}
                  style={{
                    fontFamily: 'var(--pf-t--global--font--family--mono)',
                    fontSize: '14px',
                    minHeight: '400px',
                    resize: 'vertical',
                  }}
                  aria-label="YAML editor"
                />
                <Button
                  variant="plain"
                  onClick={handleCopyYAML}
                  style={{
                    position: 'absolute',
                    top: 'var(--pf-t--global--spacer--sm)',
                    right: 'var(--pf-t--global--spacer--sm)',
                  }}
                  aria-label="Copy YAML"
                >
                  Copy
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      </div>
    </div>
  );
};

export default CreateGroup;

