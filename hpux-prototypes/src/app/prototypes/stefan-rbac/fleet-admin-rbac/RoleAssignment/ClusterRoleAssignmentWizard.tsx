import * as React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Title,
  Content,
  Form,
  FormGroup,
  Radio,
  SearchInput,
  Tabs,
  Tab,
  TabTitleText,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
  Label,
  Flex,
  FlexItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Alert,
  Pagination,
  PaginationVariant,
  EmptyState,
  EmptyStateBody,
  TextInput,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { CaretDownIcon, CheckCircleIcon, CircleIcon, AngleLeftIcon, AngleRightIcon, ResourcesEmptyIcon, SyncAltIcon, TimesIcon, FilterIcon } from '@patternfly/react-icons';
import { getAllUsers, getAllGroups, getAllRoles, getAllClusters, getAllNamespaces, getAllClusterSets, getAllIdentityProviders } from '@app/data/queries';

const dbUsers = getAllUsers();
const dbGroups = getAllGroups();
const dbRoles = getAllRoles();
const dbClusters = getAllClusters();
const dbNamespaces = getAllNamespaces();
const dbClusterSets = getAllClusterSets();
const dbIdentityProviders = getAllIdentityProviders();

const mockUsers = dbUsers.map((user, index) => ({
  id: index + 1,
  dbId: user.id,
  name: `${user.firstName} ${user.lastName}`,
  username: user.username,
  provider: 'LDAP',
  created: new Date(user.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
}));

const mockGroups = dbGroups.map((group, index) => {
  // Determine sync source and last synced (same logic as GroupsTable)
  const isLocal = group.name === 'local-admins' || group.name === 'test-group' || index % 7 === 0;
  const syncSources = ['PeteMobile LDAP', 'PeteMobile SSO', 'GitHub Enterprise'];
  const syncSource = isLocal ? 'Local' : syncSources[index % syncSources.length];
  const syncTimes = ['2 hours ago', '5 hours ago', '1 day ago', '3 days ago', 'Yesterday'];
  const lastSynced = isLocal ? null : syncTimes[index % syncTimes.length];
  
  return {
  id: index + 1,
  dbId: group.id,
  name: group.name,
  users: group.userIds.length,
    syncSource,
    lastSynced,
    created: '2024-01-15',
  };
});

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

interface ClusterRoleAssignmentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  clusterName: string;
}

export const ClusterRoleAssignmentWizard: React.FC<ClusterRoleAssignmentWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  clusterName,
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [activeTabKey, setActiveTabKey] = React.useState(0);
  
  // Carousel for example tree views (0, 1, or 2 for three examples)
  // Step 1: Identity
  const [selectedUser, setSelectedUser] = React.useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = React.useState<number | null>(null);
  const [userSearch, setUserSearch] = React.useState('');
  const [groupSearch, setGroupSearch] = React.useState('');
  const [usersPage, setUsersPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(10);
  const [groupsPage, setGroupsPage] = React.useState(1);
  const [groupsPerPage, setGroupsPerPage] = React.useState(10);
  const [isUserFilterOpen, setIsUserFilterOpen] = React.useState(false);
  const [userFilterType, setUserFilterType] = React.useState('User');
  const [isGroupFilterOpen, setIsGroupFilterOpen] = React.useState(false);
  const [groupFilterType, setGroupFilterType] = React.useState('Group');
  
  // Pre-authorization fields (for users only)
  const [isPreauthorizing, setIsPreauthorizing] = React.useState(false);
  const [preauthorizeEmail, setPreauthorizeEmail] = React.useState('');
  const [preauthorizeIdpId, setPreauthorizeIdpId] = React.useState<string>('');
  const [isIdpDropdownOpen, setIsIdpDropdownOpen] = React.useState(false);
  const [preauthorizedUserEntry, setPreauthorizedUserEntry] = React.useState<any>(null);
  
  // Step 2: Resources - Simplified for single cluster
  const [resourceScope, setResourceScope] = React.useState<'full' | 'partial'>('full');
  const [isResourceScopeOpen, setIsResourceScopeOpen] = React.useState(false);
  
  // Project selection for partial access
  const [selectedProjects, setSelectedProjects] = React.useState<number[]>([]);
  const [projectSearch, setProjectSearch] = React.useState('');
  const [isProjectFilterOpen, setIsProjectFilterOpen] = React.useState(false);
  const [projectFilterType, setProjectFilterType] = React.useState('Name');
  const [projectsPage, setProjectsPage] = React.useState(1);
  const [projectsPerPage, setProjectsPerPage] = React.useState(10);
  const [isProjectBulkSelectorOpen, setIsProjectBulkSelectorOpen] = React.useState(false);
  
  // Step 3: Role
  const [selectedRole, setSelectedRole] = React.useState<number | null>(null);
  const [roleSearch, setRoleSearch] = React.useState('');
  const [rolesPage, setRolesPage] = React.useState(1);
  const [rolesPerPage, setRolesPerPage] = React.useState(10);
  const [isRoleFilterOpen, setIsRoleFilterOpen] = React.useState(false);
  const [roleFilterType, setRoleFilterType] = React.useState('All');
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = React.useState(false);
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  
  // Bulk selector dropdowns
  const [isUserBulkSelectorOpen, setIsUserBulkSelectorOpen] = React.useState(false);
  const [isGroupBulkSelectorOpen, setIsGroupBulkSelectorOpen] = React.useState(false);
  const [isClusterBulkSelectorOpen, setIsClusterBulkSelectorOpen] = React.useState(false);
  
  // Selected items for bulk operations
  const [selectedUsers, setSelectedUsers] = React.useState<Set<number>>(new Set());
  const [selectedGroups, setSelectedGroups] = React.useState<Set<number>>(new Set());

  const resetWizard = () => {
    setCurrentStep(1);
    setActiveTabKey(0);
    setSelectedUser(null);
    setSelectedGroup(null);
    setIsPreauthorizing(false);
    setPreauthorizeEmail('');
    setPreauthorizeIdpId('');
    setPreauthorizedUserEntry(null);
    setUserSearch('');
    setGroupSearch('');
    setResourceScope('full');
    setIsResourceScopeOpen(false);
    setSelectedProjects([]);
    setProjectSearch('');
    setProjectsPage(1);
    setProjectsPerPage(10);
    setSelectedRole(null);
    setRoleSearch('');
    setRolesPage(1);
    setRolesPerPage(10);
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const handleNext = () => {
    // Simple step progression for simplified wizard
        setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      // Don't go back before step 1
      return;
    }
    // Simple step back
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    // Get the identity name and type
    let identityName = '';
    let identityTypeValue = '';
    
    if (isPreauthorizing) {
      // Pre-authorization mode (users only)
      const idpName = preauthorizeIdpId 
        ? dbIdentityProviders.find(idp => idp.id === preauthorizeIdpId)?.name 
        : undefined;
      
      const roleName = mockRoles.find(r => r.id === selectedRole)?.name || 'Unknown';
      
      onComplete({
        assignmentMode: 'preauthorize',
        identityType: 'user',
        preauthorizeEmail,
        preauthorizeIdpId: preauthorizeIdpId || undefined,
        preauthorizeIdpName: idpName,
        identityName: preauthorizeEmail,
        roleId: selectedRole,
        roleName,
        resourceScope,
        selectedProjects,
        status: 'Pending'
      });
    } else {
      // Existing user/group mode
      const identityType = activeTabKey === 0 ? 'user' : 'group';
      const identityId = activeTabKey === 0 ? selectedUser : selectedGroup;
      identityName = activeTabKey === 0 
        ? mockUsers.find(u => u.id === selectedUser)?.name || 'Unknown'
        : mockGroups.find(g => g.id === selectedGroup)?.name || 'Unknown';
      
      const roleName = mockRoles.find(r => r.id === selectedRole)?.name || 'Unknown';

      onComplete({
        assignmentMode: 'existing',
        identityType,
        identityId,
        identityName,
        roleId: selectedRole,
        roleName,
        resourceScope,
        selectedProjects,
        status: 'Active'
      });
    }
    
    resetWizard();
  };

  const isNextDisabled = () => {
    if (currentStep === 1) {
      if (activeTabKey === 0) {
        // For users: must select a user (existing or saved pre-auth user)
        if (selectedUser === null) return true;
        
        // Additional check: ensure selected user exists in current filtered users
        const userExists = filteredUsers.some(u => u.id === selectedUser);
        return !userExists;
      } else {
        // For groups: must select a group
        return selectedGroup === null;
      }
    }
    if (currentStep === 2) {
      // For partial access, must select at least one project
      if (resourceScope === 'partial' && selectedProjects.length === 0) {
        return true;
      }
      return false;
    }
    if (currentStep === 3) {
      return selectedRole === null;
    }
    return false;
  };

  // Get the single cluster and its projects
  const mockClusters = React.useMemo(() => {
    // Find the cluster by name
    const cluster = dbClusters.find(c => c.name === clusterName);
    if (!cluster) return [];
    
    return [{
      id: 1,
      dbId: cluster.id,
      name: cluster.name,
      status: cluster.status,
      infrastructure: 'Amazon Web Services', // Simplified for single cluster
      controlPlaneType: 'Standalone',
      kubernetesVersion: cluster.kubernetesVersion,
      labels: 5,
      nodes: cluster.nodes,
    }];
  }, [clusterName]);

  // Filter projects based on this specific cluster
  const mockProjects = React.useMemo(() => {
    // Find the cluster by name
    const cluster = dbClusters.find(c => c.name === clusterName);
    if (!cluster) return [];
    
    // Filter namespaces that belong to this cluster
    const namespacesInCluster = dbNamespaces.filter(namespace => 
      namespace.clusterId === cluster.id
    );
    
    return namespacesInCluster.map((namespace, index) => ({
      id: index + 1,
      name: namespace.name,
      displayName: namespace.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: namespace.type,
      clusterId: namespace.clusterId,
      clusterName: cluster.name,
    }));
  }, [clusterName]);

  const filteredUsers = React.useMemo(() => {
    // If we have a pre-authorized user saved, show only that
    if (preauthorizedUserEntry) {
      return [preauthorizedUserEntry];
    }
    
    // Otherwise show filtered existing users
    return mockUsers.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [preauthorizedUserEntry, userSearch]);

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const filteredRoles = mockRoles.filter(role => {
    // Filter by search (search both displayName and technical name)
    const matchesSearch = role.displayName.toLowerCase().includes(roleSearch.toLowerCase()) ||
                          role.name.toLowerCase().includes(roleSearch.toLowerCase());
    
    // Filter by type
    const matchesType = roleFilterType === 'All' || role.type === roleFilterType;
    
    // Filter by category
    const matchesCategory = categoryFilter === 'All' || role.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Filter projects based on selected clusters and search
  const filteredProjects = React.useMemo(() => {
    let projects = mockProjects;
    
    // Filter by search
    if (projectSearch) {
      projects = projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase()));
    }
    
    return projects;
  }, [projectSearch, mockProjects]);

  // Render step indicator to match the original wizard
  const renderStepIndicator = (stepNum: number, label: string) => {
    const isActive = currentStep === stepNum;
    const isCompleted = currentStep > stepNum;
    
    return (
      <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          flexWrap={{ default: 'nowrap' }}
          style={{ 
            cursor: isCompleted ? 'pointer' : 'default',
            padding: '0.75rem 0.75rem',
            position: 'relative',
            zIndex: 2
          }}
          onClick={() => isCompleted && setCurrentStep(stepNum)}
        >
          <FlexItem style={{ flexShrink: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#0066cc' : '#d2d2d2',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {stepNum}
            </div>
          </FlexItem>
          <FlexItem style={{ marginLeft: '12px', flex: '1' }}>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: isActive ? '0.5rem 0.75rem' : '0',
              backgroundColor: isActive ? '#f0f0f0' : 'transparent',
              borderRadius: '4px',
              gap: '0.5rem'
            }}>
              <span style={{ 
                fontWeight: isActive ? '600' : 'normal', 
                fontSize: '14px',
                color: isActive ? '#151515' : '#6a6e73',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {label}
              </span>
            </div>
          </FlexItem>
        </Flex>
      </div>
    );
  };

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={handleClose}
      aria-labelledby="cluster-set-wizard-title"
      style={{ 
        '--pf-v6-c-modal-box--m-body--PaddingTop': '0',
        '--pf-v6-c-modal-box--m-body--PaddingRight': '0',
        '--pf-v6-c-modal-box--m-body--PaddingBottom': '0',
        '--pf-v6-c-modal-box--m-body--PaddingLeft': '0'
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header Section */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '1.5rem', 
          borderBottom: '1px solid #d2d2d2',
          flexShrink: 0
        }}>
          <Title headingLevel="h1" size="2xl" id="cluster-wizard-title">
            Create role assignment for {clusterName}
          </Title>
          <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
            A role assignment specifies a distinct action users or groups can perform when associated with a particular role.{' '}
            <Button variant="link" isInline component="a" href="#" onClick={(e) => e.preventDefault()}>
              See example of the yaml file and learn more about User management
            </Button>
          </Content>
        </div>

        {/* Body with Steps Navigation and Content */}
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          minHeight: 0, 
          alignItems: 'stretch', 
          overflow: 'hidden',
          margin: 0,
          padding: 0
        }}>
          {/* Left Navigation Panel */}
          <div style={{ 
            width: '300px', 
            padding: '1.5rem 1rem',
            borderRight: '1px solid #d2d2d2',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            margin: 0
          }}>
            {renderStepIndicator(1, 'Identities')}
            {renderStepIndicator(2, 'Scope')}
            {renderStepIndicator(3, 'Role')}
            {renderStepIndicator(4, 'Review')}
          </div>
          
          {/* Right Content Area with Footer */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: 0, 
            overflow: 'hidden',
            margin: 0,
            padding: 0
          }}>
            {/* Content Area - scrollable */}
            <div style={{ 
              flex: '1 1 0',
              padding: '1.5rem 1.5rem 1.5rem 1.5rem', 
              backgroundColor: '#ffffff',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>

        {/* Step 1: Select User or Group */}
        {currentStep === 1 && (
          <>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '8px' }}>
              Identities
            </Title>
            <Content component="p" style={{ marginBottom: '24px', color: '#6a6e73', fontSize: '14px' }}>
              Select a user or group to assign this role, or{' '}
              <Button 
                variant="link" 
                isInline 
                onClick={() => {
                  setActiveTabKey(0);
                  setIsPreauthorizing(true);
                  setSelectedUser(null);
                  setSelectedGroup(null);
                  setPreauthorizeEmail('');
                  setPreauthorizeIdpId('');
                  setPreauthorizedUserEntry(null);
                  setUserSearch('');
                }}
                style={{ padding: 0, fontSize: '14px', verticalAlign: 'baseline' }}
              >
                add pre-authorized user
              </Button>
            </Content>
            
            <Tabs
              activeKey={activeTabKey}
              onSelect={(_event, tabIndex) => {
                setActiveTabKey(Number(tabIndex));
                setSelectedUser(null);
                setSelectedGroup(null);
                setIsPreauthorizing(false);
                setPreauthorizeEmail('');
                setPreauthorizeIdpId('');
                setPreauthorizedUserEntry(null);
                setUserSearch('');
                setGroupSearch('');
              }}
              aria-label="Identities tabs"
              className="custom-tabs-selected"
              style={{ 
                marginBottom: 'var(--pf-t--global--spacer--md)'
              }}
            >
              <Tab eventKey={0} title={<TabTitleText>Users</TabTitleText>}>
                <div style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <Dropdown
                          isOpen={isUserFilterOpen}
                          onSelect={() => setIsUserFilterOpen(false)}
                          onOpenChange={(isOpen: boolean) => setIsUserFilterOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle 
                              ref={toggleRef} 
                              onClick={() => setIsUserFilterOpen(!isUserFilterOpen)} 
                              isExpanded={isUserFilterOpen}
                              variant="default"
                            >
                              {userFilterType}
                            </MenuToggle>
                          )}
                          popperProps={{
                            appendTo: () => document.body,
                            
                            
                          }}
                        >
                          <DropdownList>
                            <DropdownItem onClick={() => { setUserFilterType('User'); setIsUserFilterOpen(false); }}>
                              User
                            </DropdownItem>
                            <DropdownItem onClick={() => { setUserFilterType('Group'); setIsUserFilterOpen(false); }}>
                              Group
                            </DropdownItem>
                            <DropdownItem onClick={() => { setUserFilterType('Service account'); setIsUserFilterOpen(false); }}>
                              Service account
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </ToolbarItem>
                      <ToolbarItem>
                        <SearchInput
                          placeholder="Search users"
                          value={userSearch}
                          onChange={(_event, value) => setUserSearch(value)}
                          onClear={() => setUserSearch('')}
                        />
                      </ToolbarItem>
                      <ToolbarItem align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={filteredUsers.length}
                          perPage={usersPerPage}
                          page={usersPage}
                          onSetPage={(_event, pageNumber) => setUsersPage(pageNumber)}
                          onPerPageSelect={(_event, perPage) => {
                            setUsersPerPage(perPage);
                            setUsersPage(1);
                          }}
                          variant={PaginationVariant.top}
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                  
                  {!isPreauthorizing && filteredUsers.length > 0 && (
                  <Table aria-label="Users table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th width={10}></Th>
                        <Th>User</Th>
                        <Th>Identity provider</Th>
                        <Th>Created</Th>
                        {preauthorizedUserEntry && <Th></Th>}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredUsers.slice((usersPage - 1) * usersPerPage, usersPage * usersPerPage).map((user) => (
                        <Tr
                          key={user.id}
                          isSelectable
                          isClickable
                          isRowSelected={selectedUser === user.id}
                          onRowClick={() => {
                            setSelectedUser(user.id);
                            setSelectedUsers(new Set([user.id]));
                          }}
                        >
                          <Td>
                            <Radio
                              id={`user-${user.id}`}
                              name="user-selection"
                              isChecked={selectedUser === user.id}
                              onChange={() => {
                                setSelectedUser(user.id);
                                setSelectedUsers(new Set([user.id]));
                              }}
                            />
                          </Td>
                          <Td dataLabel="User">
                            <div>
                              {user.isPending ? (
                                <span style={{ fontSize: 'inherit', fontWeight: 600 }}>{user.name}</span>
                              ) : (
                                <>
                                  <Button 
                                    variant="link" 
                                    isInline 
                                    component="a" 
                                    href={`#/user-management/identities/${encodeURIComponent(user.username)}`}
                                    target="_blank"
                                    style={{ padding: 0, fontSize: 'inherit', fontWeight: selectedUser === user.id ? '600' : 'normal' }}
                                  >
                                    {user.name}
                                  </Button>
                                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                    {user.username}
                                  </div>
                                </>
                              )}
                            </div>
                          </Td>
                          <Td dataLabel="Identity provider">
                            {user.isPending && user.provider === 'Any' ? '—' : user.provider}
                          </Td>
                          <Td dataLabel="Created">
                            {user.isPending ? (
                              <Label color="orange">Pending</Label>
                            ) : (
                              user.created
                            )}
                          </Td>
                          {user.isPending && (
                            <Td isActionCell>
                              <ActionsColumn
                                items={[
                                  {
                                    title: 'Delete',
                                    onClick: (event) => {
                                      event.stopPropagation();
                                      setPreauthorizedUserEntry(null);
                                      setSelectedUser(null);
                                      setPreauthorizeEmail('');
                                      setPreauthorizeIdpId('');
                                      setUserSearch('');
                                    }
                                  }
                                ]}
                              />
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  )}
                  
                  {!isPreauthorizing && filteredUsers.length === 0 && userSearch.trim() !== '' && (
                    <EmptyState>
                      <ResourcesEmptyIcon />
                      <Title headingLevel="h2" size="lg">
                        No users found
                      </Title>
                      <EmptyStateBody>
                        No users match your search criteria.
                      </EmptyStateBody>
                      <Button 
                        variant="primary"
                        onClick={() => {
                          setIsPreauthorizing(true);
                          setPreauthorizeEmail(userSearch);
                          setSelectedUser(null);
                        }}
                      >
                        Pre-authorize "{userSearch}"
                      </Button>
                    </EmptyState>
                  )}
                  
                  {isPreauthorizing && (
                    <div style={{ marginTop: '16px' }}>
                      <Content component="p" style={{ marginBottom: 'var(--pf-t--global--spacer--md)', fontSize: '14px', color: '#6a6e73' }}>
                        This role assignment will activate automatically on the user's first login.
                      </Content>
                      
                      <Form>
                        <FormGroup 
                          label="User identifier" 
                          isRequired 
                          fieldId="preauthorize-email"
                        >
                          <TextInput
                            isRequired
                            type="text"
                            id="preauthorize-email"
                            name="preauthorize-email"
                            value={preauthorizeEmail}
                            onChange={(_event, value) => setPreauthorizeEmail(value)}
                            placeholder="user@company.com or username"
                          />
                        </FormGroup>
                        
                        <FormGroup 
                          label="Identity Provider (optional)" 
                          fieldId="preauthorize-idp"
                          style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                        >
                          <Content component="p" style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                            Select the identity provider if known
                          </Content>
                          <Dropdown
                            isOpen={isIdpDropdownOpen}
                            onSelect={() => setIsIdpDropdownOpen(false)}
                            onOpenChange={(isOpen: boolean) => setIsIdpDropdownOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsIdpDropdownOpen(!isIdpDropdownOpen)} 
                                isExpanded={isIdpDropdownOpen}
                                variant="default"
                                style={{ width: '100%' }}
                              >
                                {preauthorizeIdpId 
                                  ? dbIdentityProviders.find(idp => idp.id === preauthorizeIdpId)?.name 
                                  : 'Any identity provider'}
                              </MenuToggle>
                            )}
                          >
                            <DropdownList>
                              {dbIdentityProviders.map((idp) => (
                                <DropdownItem 
                                  key={idp.id}
                                  onClick={() => {
                                    setPreauthorizeIdpId(idp.id);
                                    setIsIdpDropdownOpen(false);
                                  }}
                                >
                                  <Flex alignItems={{ default: 'alignItemsCenter' }}>
                                    <FlexItem>
                                      <Label color="blue" icon={<SyncAltIcon />}>{idp.type}</Label>
                                    </FlexItem>
                                    <FlexItem>{idp.name}</FlexItem>
                                  </Flex>
                                </DropdownItem>
                              ))}
                            </DropdownList>
                          </Dropdown>
                        </FormGroup>

                        <div style={{ marginTop: 'var(--pf-t--global--spacer--md)', display: 'flex', gap: 'var(--pf-t--global--spacer--sm)' }}>
                          <Button 
                            variant="primary"
                            onClick={() => {
                              const idpName = preauthorizeIdpId 
                                ? dbIdentityProviders.find(idp => idp.id === preauthorizeIdpId)?.name 
                                : 'Any';
                              
                              const tempUserId = -1;
                              const newUserEntry = {
                                id: tempUserId,
                                dbId: '',
                                name: preauthorizeEmail,
                                username: preauthorizeEmail,
                                provider: idpName,
                                created: 'Pending',
                                isPending: true,
                              };
                              
                              setPreauthorizedUserEntry(newUserEntry);
                              setSelectedUser(null);
                              setIsPreauthorizing(false);
                            }}
                            isDisabled={!preauthorizeEmail.trim()}
                          >
                            Save pre-authorized user
                          </Button>
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setIsPreauthorizing(false);
                              setPreauthorizeEmail('');
                              setPreauthorizeIdpId('');
                              setPreauthorizedUserEntry(null);
                              setUserSearch('');
                            }}
                          >
                            Cancel and search users instead
                          </Button>
                        </div>
                      </Form>
                    </div>
                  )}
                  
                  {!isPreauthorizing && filteredUsers.length > 0 && (
                  <Pagination
                    itemCount={filteredUsers.length}
                    perPage={usersPerPage}
                    page={usersPage}
                    onSetPage={(_event, pageNumber) => setUsersPage(pageNumber)}
                    onPerPageSelect={(_event, perPage) => {
                      setUsersPerPage(perPage);
                      setUsersPage(1);
                    }}
                    variant={PaginationVariant.bottom}
                    style={{ marginTop: '16px' }}
                  />
                  )}
                </div>
              </Tab>
              
              <Tab eventKey={1} title={<TabTitleText>Groups</TabTitleText>}>
                <div style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <Dropdown
                          isOpen={isGroupFilterOpen}
                          onSelect={() => setIsGroupFilterOpen(false)}
                          onOpenChange={(isOpen: boolean) => setIsGroupFilterOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle 
                              ref={toggleRef} 
                              onClick={() => setIsGroupFilterOpen(!isGroupFilterOpen)} 
                              isExpanded={isGroupFilterOpen}
                              variant="default"
                            >
                              {groupFilterType}
                            </MenuToggle>
                          )}
                          popperProps={{
                            appendTo: () => document.body,
                            
                            
                          }}
                        >
                          <DropdownList>
                            <DropdownItem onClick={() => { setGroupFilterType('Group'); setIsGroupFilterOpen(false); }}>
                              Group
                            </DropdownItem>
                            <DropdownItem onClick={() => { setGroupFilterType('User'); setIsGroupFilterOpen(false); }}>
                              User
                            </DropdownItem>
                            <DropdownItem onClick={() => { setGroupFilterType('Service account'); setIsGroupFilterOpen(false); }}>
                              Service account
                            </DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </ToolbarItem>
                      <ToolbarItem>
                        <SearchInput
                          placeholder="Search groups"
                          value={groupSearch}
                          onChange={(_event, value) => setGroupSearch(value)}
                          onClear={() => setGroupSearch('')}
                        />
                      </ToolbarItem>
                      <ToolbarItem align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={filteredGroups.length}
                          perPage={groupsPerPage}
                          page={groupsPage}
                          onSetPage={(_event, pageNumber) => setGroupsPage(pageNumber)}
                          onPerPageSelect={(_event, perPage) => {
                            setGroupsPerPage(perPage);
                            setGroupsPage(1);
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
                        <Th width={10}></Th>
                        <Th width={20}>Group</Th>
                        <Th width={15}>Members</Th>
                        <Th width={20}>Sync Source</Th>
                        <Th width={20}>Last Synced</Th>
                        <Th width={15}>Created</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredGroups.slice((groupsPage - 1) * groupsPerPage, groupsPage * groupsPerPage).map((group) => (
                        <Tr
                          key={group.id}
                          isSelectable
                          isClickable
                          isRowSelected={selectedGroup === group.id}
                          onRowClick={() => {
                            setSelectedGroup(group.id);
                            setSelectedGroups(new Set([group.id]));
                          }}
                        >
                          <Td>
                            <Radio
                              id={`group-${group.id}`}
                              name="group-selection"
                              isChecked={selectedGroup === group.id}
                              onChange={() => {
                                setSelectedGroup(group.id);
                                setSelectedGroups(new Set([group.id]));
                              }}
                            />
                          </Td>
                          <Td dataLabel="Group" width={20}>
                            <Button 
                              variant="link" 
                              isInline 
                              component="a" 
                              href={`#/user-management/identities/groups/${encodeURIComponent(group.name)}`}
                              target="_blank"
                              style={{ padding: 0, fontSize: 'inherit', fontWeight: selectedGroup === group.id ? '600' : 'normal' }}
                            >
                              {group.name}
                            </Button>
                          </Td>
                          <Td dataLabel="Members" width={15}>{group.users}</Td>
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
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  <Pagination
                    itemCount={filteredGroups.length}
                    perPage={groupsPerPage}
                    page={groupsPage}
                    onSetPage={(_event, pageNumber) => setGroupsPage(pageNumber)}
                    onPerPageSelect={(_event, perPage) => {
                      setGroupsPerPage(perPage);
                      setGroupsPage(1);
                    }}
                    variant={PaginationVariant.bottom}
                    style={{ marginTop: '16px' }}
                  />
                </div>
              </Tab>
            </Tabs>
          </>
        )}

        {/* Step 2: Select Resources */}
        {currentStep === 2 && (
          <>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '8px' }}>
              Scope
            </Title>
            <Content component="p" style={{ marginBottom: '16px', color: '#6a6e73', fontSize: '14px' }}>
              Define the scope of access for this role assignment on the {clusterName} cluster.
            </Content>

              <Dropdown
                isOpen={isResourceScopeOpen}
                onSelect={() => setIsResourceScopeOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsResourceScopeOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle 
                    ref={toggleRef} 
                    onClick={() => setIsResourceScopeOpen(!isResourceScopeOpen)} 
                    isExpanded={isResourceScopeOpen}
                    variant="default"
                    style={{ width: '100%' }}
                  >
                  {resourceScope === 'full' ? 'Cluster role assignment' : 'Project role assignment'}
                  </MenuToggle>
                )}
                shouldFocusToggleOnSelect
                popperProps={{
                  appendTo: () => document.body,
                  
                  
                }}
              >
                <DropdownList>
                  <DropdownItem
                  key="full"
                    onClick={() => {
                    setResourceScope('full');
                      setSelectedProjects([]);
                      setIsResourceScopeOpen(false);
                    }}
                  description="Grant access to all current and future resources on the cluster."
                  >
                  Cluster role assignment
                  </DropdownItem>
                  <DropdownItem
                  key="partial"
                    onClick={() => {
                    setResourceScope('partial');
                      setSelectedProjects([]);
                      setIsResourceScopeOpen(false);
                    }}
                  description="Grant access to specific projects on the cluster."
                  >
                  Project role assignment
                  </DropdownItem>
                </DropdownList>
              </Dropdown>

            {/* Projects table for partial access */}
            {resourceScope === 'partial' && (
              <div style={{ marginTop: '24px' }}>
                <Toolbar style={{ marginBottom: '16px' }}>
                  <ToolbarContent>
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isProjectBulkSelectorOpen}
                        onSelect={() => setIsProjectBulkSelectorOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsProjectBulkSelectorOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsProjectBulkSelectorOpen(!isProjectBulkSelectorOpen)}
                            isExpanded={isProjectBulkSelectorOpen}
                            variant="default"
                            style={{
                              borderRadius: '8px',
                              height: '36px',
                              minWidth: '50px',
                              padding: '0 8px',
                            }}
                          >
                          <Checkbox
                              isChecked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                              onChange={(_event, checked) => {
                                if (checked) {
                                  setSelectedProjects(filteredProjects.slice((projectsPage - 1) * projectsPerPage, projectsPage * projectsPerPage).map(p => p.id));
                              } else {
                                  setSelectedProjects([]);
                                }
                              }}
                              aria-label="Select all projects"
                              id="bulk-select-projects"
                            />
                      </MenuToggle>
                    )}
                    popperProps={{
                      appendTo: () => document.body,
                          
                          
                    }}
                  >
                    <DropdownList>
                          <DropdownItem onClick={() => {
                            setSelectedProjects(filteredProjects.slice((projectsPage - 1) * projectsPerPage, projectsPage * projectsPerPage).map(p => p.id));
                            setIsProjectBulkSelectorOpen(false);
                          }}>
                            Select page ({Math.min(projectsPerPage, filteredProjects.length - (projectsPage - 1) * projectsPerPage)} items)
                      </DropdownItem>
                          <DropdownItem onClick={() => {
                            setSelectedProjects(filteredProjects.map(p => p.id));
                            setIsProjectBulkSelectorOpen(false);
                          }}>
                            Select all ({filteredProjects.length} items)
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isProjectFilterOpen}
                        onSelect={() => setIsProjectFilterOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsProjectFilterOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsProjectFilterOpen(!isProjectFilterOpen)} 
                            isExpanded={isProjectFilterOpen}
                            variant="default"
                          >
                            {projectFilterType}
                          </MenuToggle>
                        )}
                        popperProps={{
                          appendTo: () => document.body,
                          
                          
                        }}
                      >
                        <DropdownList>
                          <DropdownItem onClick={() => { setProjectFilterType('Name'); setIsProjectFilterOpen(false); }}>
                            Name
                          </DropdownItem>
                          <DropdownItem onClick={() => { setProjectFilterType('Type'); setIsProjectFilterOpen(false); }}>
                            Type
                          </DropdownItem>
                            <DropdownItem onClick={() => { setProjectFilterType('Display name'); setIsProjectFilterOpen(false); }}>
                              Display name
                            </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder="Search projects"
                        value={projectSearch}
                        onChange={(_event, value) => setProjectSearch(value)}
                        onClear={() => setProjectSearch('')}
                      />
                    </ToolbarItem>
                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={filteredProjects.length}
                        perPage={projectsPerPage}
                        page={projectsPage}
                        onSetPage={(_event, page) => setProjectsPage(page)}
                        onPerPageSelect={(_event, perPage) => {
                          setProjectsPerPage(perPage);
                          setProjectsPage(1);
                        }}
                        variant={PaginationVariant.top}
                        isCompact
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                <Table aria-label="Projects table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th width={10}></Th>
                      <Th>Project name</Th>
                          <Th>Display name</Th>
                          <Th>Type</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredProjects.length === 0 ? (
                        <Tr>
                          <Td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                            <Content component="p" style={{ color: '#6a6e73' }}>
                              No projects found in this cluster.
                            </Content>
                          </Td>
                        </Tr>
                      ) : (
                        filteredProjects
                          .slice((projectsPage - 1) * projectsPerPage, projectsPage * projectsPerPage)
                          .map((project) => (
                        <Tr key={project.id}>
                          <Td
                            select={{
                              rowIndex: project.id,
                              onSelect: (_event, isSelecting) => {
                                setSelectedProjects(prev => {
                                  const newSelected = new Set(prev);
                                  if (isSelecting) {
                                    newSelected.add(project.id);
                            } else {
                                    newSelected.delete(project.id);
                                  }
                                  return Array.from(newSelected);
                                });
                              },
                              isSelected: selectedProjects.includes(project.id),
                            }}
                          />
                          <Td dataLabel="Project name">{project.name}</Td>
                          <Td dataLabel="Display name">{project.displayName}</Td>
                          <Td dataLabel="Type">{project.type}</Td>
                            </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
                
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={filteredProjects.length}
                        perPage={projectsPerPage}
                        page={projectsPage}
                        onSetPage={(_event, page) => setProjectsPage(page)}
                        onPerPageSelect={(_event, perPage) => {
                          setProjectsPerPage(perPage);
                          setProjectsPage(1);
                        }}
                        variant={PaginationVariant.bottom}
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>
              </div>
            )}
          </>
        )}

        {/* Step 3: Select Role */}
        {currentStep === 3 && (
          <>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
              Role
            </Title>
            
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isCategoryFilterOpen}
                    onSelect={() => setIsCategoryFilterOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsCategoryFilterOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)} 
                        isExpanded={isCategoryFilterOpen}
                        variant="default"
                        icon={<FilterIcon />}
                      >
                        {categoryFilter}
                      </MenuToggle>
                    )}
                    popperProps={{
                      appendTo: () => document.body,
                    }}
                  >
                    <DropdownList>
                      {['All', 'Virtualization', 'OpenShift Cluster Management', 'OpenShift Namespace Management', 'Application Management', 'OpenShift'].map((category) => (
                        <DropdownItem
                          key={category}
                          onClick={() => { 
                            setCategoryFilter(category); 
                            setIsCategoryFilterOpen(false);
                            setRolesPage(1);
                          }}
                        >
                          {category}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem style={{ minWidth: '180px', maxWidth: '240px' }}>
                  <SearchInput
                    placeholder="Search roles"
                    value={roleSearch}
                    onChange={(_event, value) => setRoleSearch(value)}
                    onClear={() => setRoleSearch('')}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <ToggleGroup aria-label="Role type filter">
                    <ToggleGroupItem
                      text="All"
                      isSelected={roleFilterType === 'All'}
                      onChange={() => {
                        setRoleFilterType('All');
                        setRolesPage(1);
                      }}
                    />
                    <ToggleGroupItem
                      text="Default"
                      isSelected={roleFilterType === 'Default'}
                      onChange={() => {
                        setRoleFilterType('Default');
                        setRolesPage(1);
                      }}
                    />
                    <ToggleGroupItem
                      text="Custom"
                      isSelected={roleFilterType === 'Custom'}
                      onChange={() => {
                        setRoleFilterType('Custom');
                        setRolesPage(1);
                      }}
                    />
                  </ToggleGroup>
                </ToolbarItem>
                <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={filteredRoles.length}
                    perPage={rolesPerPage}
                    page={rolesPage}
                    onSetPage={(_event, pageNumber) => setRolesPage(pageNumber)}
                    onPerPageSelect={(_event, perPage) => {
                      setRolesPerPage(perPage);
                      setRolesPage(1);
                    }}
                    variant={PaginationVariant.top}
                    isCompact
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Table aria-label="Roles table" variant="compact" style={{ tableLayout: 'fixed', width: '100%' }}>
              <Thead>
                <Tr>
                  <Th width={10}></Th>
                  <Th width={25}>Role</Th>
                  <Th width={35}>Description</Th>
                  <Th width={20}>Category</Th>
                  <Th width={10}>Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRoles.slice((rolesPage - 1) * rolesPerPage, rolesPage * rolesPerPage).map((role) => (
                  <Tr
                    key={role.id}
                    isSelectable
                    isClickable
                    isRowSelected={selectedRole === role.id}
                    onRowClick={() => setSelectedRole(role.id)}
                  >
                    <Td>
                      <Radio
                        id={`role-${role.id}`}
                        name="role-selection"
                        isChecked={selectedRole === role.id}
                        onChange={() => setSelectedRole(role.id)}
                      />
                    </Td>
                    <Td dataLabel="Role" style={{ textAlign: 'left', wordBreak: 'break-word' }}>
                      <div>
                        <div style={{ fontWeight: selectedRole === role.id ? '600' : 'normal' }}>
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`${window.location.origin}${window.location.pathname}#/user-management/roles/${encodeURIComponent(role.name)}`, '_blank');
                            }}
                            style={{ 
                              color: 'var(--pf-t--global--color--brand--default)',
                              textDecoration: 'none',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            {role.displayName}
                          </a>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {role.name}
                        </div>
                      </div>
                    </Td>
                    <Td dataLabel="Description" style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', wordBreak: 'break-word' }}>
                      {role.description}
                    </Td>
                    <Td dataLabel="Category" style={{ wordBreak: 'break-word' }}>
                      {role.category}
                    </Td>
                    <Td dataLabel="Type">
                      <Label color={role.type === 'Default' ? 'blue' : 'green'}>{role.type}</Label>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination
              itemCount={filteredRoles.length}
              perPage={rolesPerPage}
              page={rolesPage}
              onSetPage={(_event, pageNumber) => setRolesPage(pageNumber)}
              onPerPageSelect={(_event, perPage) => {
                setRolesPerPage(perPage);
                setRolesPage(1);
              }}
              variant={PaginationVariant.bottom}
            />
          </>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
              Review
            </Title>
            
            {/* Select user or group section */}
            <div style={{ 
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #d2d2d2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title headingLevel="h3" size="md" style={{ margin: 0 }}>
                  {isPreauthorizing ? 'Pre-auth user' : (activeTabKey === 0 ? 'User' : 'Group')}
                </Title>
                <Button 
                  variant="link" 
                  isInline 
                  onClick={() => setCurrentStep(1)}
                  style={{ fontSize: '14px' }}
                >
                  Edit step
                </Button>
              </div>
              <div style={{ marginLeft: '16px' }}>
                {isPreauthorizing ? (
                  <>
                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Label color="orange" icon={<TimesIcon />}>Pending</Label>
                      </FlexItem>
                      <FlexItem>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          User identifier
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73' }}>
                          {preauthorizeEmail}
                        </Content>
                      </FlexItem>
                      <FlexItem>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          Identity Provider
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73' }}>
                          {preauthorizeIdpId 
                            ? dbIdentityProviders.find(idp => idp.id === preauthorizeIdpId)?.name || 'Unknown IDP'
                            : 'Any (not specified)'}
                        </Content>
                      </FlexItem>
                      <FlexItem>
                        <Alert variant="info" isInline title="Will activate on first login" style={{ marginTop: '8px' }}>
                          <Content component="p" style={{ fontSize: '0.875rem' }}>
                            This role assignment will automatically become active when the user logs in for the first time.
                          </Content>
                        </Alert>
                      </FlexItem>
                    </Flex>
                  </>
                ) : (
                  <>
                    <Content component="p" style={{ 
                      marginBottom: '4px', 
                      fontSize: '14px', 
                      fontWeight: 600,
                      color: '#151515'
                    }}>
                      {activeTabKey === 0 ? 'User' : 'Group'}
                    </Content>
                    <Content component="p" style={{ fontSize: '14px', color: '#6a6e73' }}>
                      {activeTabKey === 0 
                        ? mockUsers.find(u => u.id === selectedUser)?.name
                        : mockGroups.find(g => g.id === selectedGroup)?.name}
                    </Content>
                  </>
                )}
              </div>
            </div>

            {/* Select resources section */}
            <div style={{ 
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #d2d2d2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title headingLevel="h3" size="md" style={{ margin: 0 }}>
                  Scope
                </Title>
                <Button 
                  variant="link" 
                  isInline 
                  onClick={() => setCurrentStep(2)}
                  style={{ fontSize: '14px' }}
                >
                  Edit step
                </Button>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <Content component="p" style={{ 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: '#151515'
                }}>
                  Scope
                </Content>
                <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                  Cluster: {clusterName}
                    </Content>
                    <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                  Access: {resourceScope === 'full' ? 'Full access (all projects)' : 'Partial access (specific projects)'}
                    </Content>

                {resourceScope === 'partial' && selectedProjects.length > 0 && (
                      <>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515',
                          marginTop: '12px'
                        }}>
                      Selected projects
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73' }}>
                          {selectedProjects.map(id => {
                            const project = mockProjects.find(p => p.id === id);
                            return project?.name;
                          }).filter(Boolean).join(', ')}
                        </Content>
                  </>
                )}
              </div>
            </div>

            {/* Select role section */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title headingLevel="h3" size="md" style={{ margin: 0 }}>
                  Role
                </Title>
                <Button 
                  variant="link" 
                  isInline 
                  onClick={() => setCurrentStep(3)}
                  style={{ fontSize: '14px' }}
                >
                  Edit step
                </Button>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <Content component="p" style={{ 
                  marginBottom: '4px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: '#151515'
                }}>
                  Role
                </Content>
                <Content component="p" style={{ fontSize: '14px', color: '#6a6e73' }}>
                  {mockRoles.find(r => r.id === selectedRole)?.name}
                </Content>
              </div>
            </div>
          </>
        )}

            </div>
            
            {/* Footer with Buttons - only spans right content area */}
            <div style={{ 
              borderTop: '1px solid #d2d2d2', 
              padding: '1rem 1.5rem 1rem 1.5rem', 
              backgroundColor: '#ffffff',
              flexShrink: 0
            }}>
              {currentStep > 1 && (
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              )}{' '}
              {currentStep < 4 ? (
                <Button variant="primary" onClick={handleNext} isDisabled={isNextDisabled()}>
                  Next
                </Button>
              ) : (
                <Button variant="primary" onClick={handleFinish}>
                  Create
                </Button>
              )}{' '}
              <Button variant="link" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

