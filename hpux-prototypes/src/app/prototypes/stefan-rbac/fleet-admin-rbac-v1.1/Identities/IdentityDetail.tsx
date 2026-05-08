import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Content,
  Card,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Flex,
  FlexItem,
  Icon,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  ToolbarGroup,
  Divider,
  ButtonVariant,
  Label,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import { CubesIcon, FilterIcon, CheckIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { GroupRoleAssignmentWizard } from '../RoleAssignment/GroupRoleAssignmentWizard';
import { getAllUsers, getGroupsForUser, getAllClusters, getAllClusterSets, getAllNamespaces } from '@app/data/queries';

const IdentityDetail: React.FunctionComponent = () => {
  const { identityName } = useParams<{ identityName: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  
  // Role assignments state
  interface RoleAssignment {
    id: string;
    name: string;
    type: 'User' | 'Group';
    clusters: string[];
    namespaces: string[];
    roles: string[];
    status: 'Active' | 'Inactive';
    assignedDate: string;
    assignedBy: string;
    origin: string;
  }
  
  const [roleAssignments, setRoleAssignments] = React.useState<RoleAssignment[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  
  useDocumentTitle(`ACM | ${identityName}`);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const handleCreateRoleAssignment = () => {
    setIsWizardOpen(true);
  };

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
  };

  const handleWizardComplete = (wizardData: any) => {
    // Get data from database
    const allClusters = getAllClusters();
    const allClusterSets = getAllClusterSets();
    const allNamespaces = getAllNamespaces();
    
    // Extract cluster names and project names from wizard data
    const clusterNames: string[] = [];
    const projectNames: string[] = [];
    
    if (wizardData.resourceScope === 'everything') {
      clusterNames.push('All resources');
      projectNames.push('All projects');
    } else if (wizardData.resourceScope === 'cluster-sets') {
      // Handle cluster sets
      if (wizardData.selectedClusterSets && wizardData.selectedClusterSets.length > 0) {
        const clusterSetNames = wizardData.selectedClusterSets
          .map((id: string) => allClusterSets.find(cs => cs.id === id)?.name)
          .filter(Boolean);
        clusterNames.push(...clusterSetNames);
        
        if (wizardData.selectedClusters && wizardData.selectedClusters.length > 0) {
          const selectedClusterNames = wizardData.selectedClusters
            .map((id: string) => allClusters.find(c => c.id === id)?.name)
            .filter(Boolean);
          clusterNames.length = 0; // Clear cluster set names
          clusterNames.push(...selectedClusterNames);
          
          if (wizardData.selectedProjects && wizardData.selectedProjects.length > 0) {
            const selectedProjectNames = wizardData.selectedProjects
              .map((id: string) => allNamespaces.find(n => n.id === id)?.name)
              .filter(Boolean);
            projectNames.push(...selectedProjectNames);
          } else {
            projectNames.push('All projects');
          }
        } else {
          projectNames.push('All projects');
        }
      }
    } else if (wizardData.resourceScope === 'clusters') {
      // Handle individual clusters
      if (wizardData.selectedClusters && wizardData.selectedClusters.length > 0) {
        const selectedClusterNames = wizardData.selectedClusters
          .map((id: string) => allClusters.find(c => c.id === id)?.name)
          .filter(Boolean);
        clusterNames.push(...selectedClusterNames);
        
        if (wizardData.selectedProjects && wizardData.selectedProjects.length > 0) {
          const selectedProjectNames = wizardData.selectedProjects
            .map((id: string) => allNamespaces.find(n => n.id === id)?.name)
            .filter(Boolean);
          projectNames.push(...selectedProjectNames);
        } else {
          projectNames.push('All projects');
        }
      }
    }
    
    // Create new role assignment
    const newAssignment: RoleAssignment = {
      id: `ra-${Date.now()}`,
      name: identityName || 'Unknown User',
      type: 'User',
      clusters: clusterNames.length > 0 ? clusterNames : ['All clusters'],
      namespaces: projectNames.length > 0 ? projectNames : ['All projects'],
      roles: [wizardData.roleName || 'Unknown Role'],
      status: 'Active',
      assignedDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      assignedBy: 'Walter Joseph Kovacs',
      origin: 'Hub cluster',
    };
    
    setRoleAssignments([...roleAssignments, newAssignment]);
    setIsWizardOpen(false);
    setShowSuccessAlert(true);
    
    // Hide alert after 10 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 10000);
  };

  const DetailsTab = () => (
    <Card>
      <CardBody>
        <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">
          General information
        </Title>
        <DescriptionList isHorizontal>
          <DescriptionListGroup>
            <DescriptionListTerm>Full name</DescriptionListTerm>
            <DescriptionListDescription>{identityName}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Username</DescriptionListTerm>
            <DescriptionListDescription>{identityName?.toLowerCase().replace(/\s+/g, '')}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Identity provider</DescriptionListTerm>
            <DescriptionListDescription>LDAP</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );

  const YAMLTab = () => (
    <Card>
      <CardBody>
        <div style={{ 
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', 
          border: '1px solid var(--pf-t--global--border--color--default)', 
          borderRadius: 'var(--pf-t--global--border--radius--medium)',
          padding: 'var(--pf-t--global--spacer--md)',
          fontFamily: 'var(--pf-t--global--font--family--mono)',
          fontSize: 'var(--pf-t--global--font--size--body--sm)',
          lineHeight: 'var(--pf-t--global--font--line-height--body)',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`kind: User
apiVersion: user.openshift.io/v1
metadata:
  name: ${identityName?.toLowerCase().replace(/\s+/g, '')}
  uid: b502a610-33cf-4f31-b404-e0b4fe7c29a5
  resourceVersion: '8608445'
  creationTimestamp: '2025-07-23T06:12:36Z'
managedFields:
  - manager: htpasswd
    operation: Update
    apiVersion: user.openshift.io/v1
    time: '2025-07-23T06:12:36Z'
    fieldsType: FieldsV1
    fieldsV1:
      f:identities: {}
identities:
  - 'htpasswd:${identityName?.toLowerCase().replace(/\s+/g, '')}'
groups: null`}
          </pre>
        </div>
      </CardBody>
    </Card>
  );

  const RoleAssignmentsTab = () => {
    const [selectedAssignments, setSelectedAssignments] = React.useState<Set<string>>(new Set());
    const [isBulkActionsOpen, setIsBulkActionsOpen] = React.useState(false);
    const [filterValue, setFilterValue] = React.useState<string>('all');

    const areAllSelected = selectedAssignments.size === roleAssignments.length && roleAssignments.length > 0;
    const areSomeSelected = selectedAssignments.size > 0;

    const handleSelectAll = (isSelecting: boolean) => {
      if (isSelecting) {
        setSelectedAssignments(new Set(roleAssignments.map(a => a.id)));
      } else {
        setSelectedAssignments(new Set());
      }
    };

    const handleSelectAssignment = (assignmentId: string, isSelecting: boolean) => {
      const newSelected = new Set(selectedAssignments);
      if (isSelecting) {
        newSelected.add(assignmentId);
      } else {
        newSelected.delete(assignmentId);
      }
      setSelectedAssignments(newSelected);
    };

    const handleBulkDelete = () => {
      const updatedAssignments = roleAssignments.filter(a => !selectedAssignments.has(a.id));
      setRoleAssignments(updatedAssignments);
      setSelectedAssignments(new Set());
      setIsBulkActionsOpen(false);
    };

    const handleDeleteAssignment = (assignmentId: string) => {
      const updatedAssignments = roleAssignments.filter(a => a.id !== assignmentId);
      setRoleAssignments(updatedAssignments);
    };

    // Filter and paginate assignments
    const filteredAssignments = roleAssignments.filter(assignment => {
      const matchesSearch = assignment.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchesFilter = filterValue === 'all' || 
        (filterValue === 'user' && assignment.type === 'User') ||
        (filterValue === 'group' && assignment.type === 'Group') ||
        (filterValue === 'active' && assignment.status === 'Active');
      return matchesSearch && matchesFilter;
    });

    const paginatedAssignments = filteredAssignments.slice(
      (page - 1) * perPage,
      page * perPage
    );

    if (roleAssignments.length === 0) {
      return (
        <Card>
          <CardBody>
            <EmptyState>
              <CubesIcon />
              <Title headingLevel="h2" size="lg">
                No role assignment created yet
              </Title>
              <EmptyStateBody>
                Description text that allows users to easily understand what this is for and how does it help them achieve their needs.
              </EmptyStateBody>
              <EmptyStateActions>
                <Button variant="primary" onClick={handleCreateRoleAssignment}>
                  Create role assignment
                </Button>
              </EmptyStateActions>
              <EmptyStateBody>
                <Button component="a" href="#" variant="link">
                  Link to documentation
                </Button>
              </EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      );
    }

    return (
      <div className="table-content-card">
        <Toolbar>
          <ToolbarContent>
            {selectedAssignments.size > 0 && (
              <>
                <ToolbarGroup>
                  <ToolbarItem>
                    <span style={{ fontWeight: 'bold', marginRight: '16px' }}>
                      {selectedAssignments.size} selected
                    </span>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isBulkActionsOpen}
                      onSelect={() => setIsBulkActionsOpen(false)}
                      onOpenChange={(isOpen) => setIsBulkActionsOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                          isExpanded={isBulkActionsOpen}
                          variant="secondary"
                          isDisabled={!areSomeSelected}
                        >
                          Actions {areSomeSelected ? `(${selectedAssignments.size} selected)` : ''}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem key="delete" onClick={handleBulkDelete}>
                          Delete selected
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarItem>
                  <Divider orientation={{ default: 'vertical' }} />
                </ToolbarItem>
              </>
            )}
            <ToolbarItem>
              <Dropdown
                isOpen={isFilterOpen}
                onSelect={() => setIsFilterOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    isExpanded={isFilterOpen}
                  >
                    Filter
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="all" onClick={() => setFilterValue('all')}>All</DropdownItem>
                  <DropdownItem key="user" onClick={() => setFilterValue('user')}>User</DropdownItem>
                  <DropdownItem key="group" onClick={() => setFilterValue('group')}>Group</DropdownItem>
                  <DropdownItem key="active" onClick={() => setFilterValue('active')}>Active</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Search role assignments"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary" onClick={handleCreateRoleAssignment}>
                Create role assignment
              </Button>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        
        <Table aria-label="Role assignments table" variant="compact">
          <Thead>
            <Tr>
              <Th style={{ backgroundColor: '#f0f0f0' }} />
              <Th colSpan={7} style={{ backgroundColor: '#f0f0f0', fontWeight: 600 }}>Scope</Th>
              <Th style={{ backgroundColor: '#f0f0f0' }}></Th>
            </Tr>
            <Tr>
              <Th
                select={{
                  onSelect: (_event, isSelecting) => handleSelectAll(isSelecting),
                  isSelected: areAllSelected,
                }}
              />
              <Th sort={{ sortBy: {}, columnIndex: 0 }}>Clusters</Th>
              <Th sort={{ sortBy: {}, columnIndex: 1 }}>Namespaces</Th>
              <Th sort={{ sortBy: {}, columnIndex: 2 }}>Roles</Th>
              <Th sort={{ sortBy: {}, columnIndex: 3 }}>Status</Th>
              <Th sort={{ sortBy: {}, columnIndex: 4 }}>Assigned date</Th>
              <Th sort={{ sortBy: {}, columnIndex: 5 }}>Assigned by</Th>
              <Th sort={{ sortBy: {}, columnIndex: 6 }}>Origin</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedAssignments.map((assignment, rowIndex) => (
              <Tr key={assignment.id}>
                <Td
                  select={{
                    rowIndex,
                    onSelect: (_event, isSelecting) => handleSelectAssignment(assignment.id, isSelecting),
                    isSelected: selectedAssignments.has(assignment.id),
                  }}
                />
                <Td dataLabel="Clusters">
                  {assignment.clusters.map((cluster, idx) => (
                    <span key={idx}>
                      <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                        {cluster}
                      </Button>
                      {idx < assignment.clusters.length - 1 && ', '}
                    </span>
                  ))}
                </Td>
                <Td dataLabel="Namespaces">
                  {assignment.namespaces.map((ns, idx) => (
                    <span key={idx}>
                      <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                        {ns}
                      </Button>
                      {idx < assignment.namespaces.length - 1 && ', '}
                    </span>
                  ))}
                </Td>
                <Td dataLabel="Roles">
                  {assignment.roles.map((role, idx) => (
                    <span key={idx}>
                      <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                        {role}
                      </Button>
                      {idx < assignment.roles.length - 1 && ', '}
                    </span>
                  ))}
                </Td>
                <Td dataLabel="Status">
                  <Label color="green" icon={<CheckIcon />}>
                    {assignment.status}
                  </Label>
                </Td>
                <Td dataLabel="Assigned date">{assignment.assignedDate}</Td>
                <Td dataLabel="Assigned by">{assignment.assignedBy}</Td>
                <Td dataLabel="Origin">{assignment.origin}</Td>
                <Td isActionCell>
                  <ActionsColumn
                    items={[
                      {
                        title: 'Edit',
                        onClick: () => console.log('Edit', assignment.id)
                      },
                      {
                        isSeparator: true
                      },
                      {
                        title: 'Delete',
                        onClick: () => handleDeleteAssignment(assignment.id)
                      }
                    ]}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={filteredAssignments.length}
                page={page}
                perPage={perPage}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                variant={PaginationVariant.bottom}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </div>
    );
  };

  const GroupsTab = () => {
    // Get user data from centralized database
    const allUsers = getAllUsers();
    const currentUser = allUsers.find(u => `${u.firstName} ${u.lastName}` === identityName || u.username === identityName);
    const userGroups = currentUser ? getGroupsForUser(currentUser.id) : [];
    
    // Transform groups from database to component format
    const mockGroups = userGroups.map((group, index) => ({
      id: index + 1,
      name: group.name,
      members: group.userIds.length,
      created: '2024-01-15', // Could be added to schema later
    }));

    const [selectedGroups, setSelectedGroups] = React.useState<Set<number>>(new Set());
    const [isBulkActionOpen, setIsBulkActionOpen] = React.useState(false);
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const filteredGroups = mockGroups.filter(group =>
      group.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const isAllSelected = selectedGroups.size === filteredGroups.length && filteredGroups.length > 0;
    const isPartiallySelected = selectedGroups.size > 0 && selectedGroups.size < filteredGroups.length;

    const handleSelectAll = (isSelecting: boolean) => {
      if (isSelecting) {
        setSelectedGroups(new Set(filteredGroups.map(group => group.id)));
      } else {
        setSelectedGroups(new Set());
      }
    };

    const handleSelectGroup = (groupId: number, isSelecting: boolean) => {
      const newSelected = new Set(selectedGroups);
      if (isSelecting) {
        newSelected.add(groupId);
      } else {
        newSelected.delete(groupId);
      }
      setSelectedGroups(newSelected);
    };

    const handleBulkAction = (action: string) => {
      console.log(`Bulk action: ${action} for groups:`, Array.from(selectedGroups));
      setIsBulkActionOpen(false);
      // Here you would implement the actual bulk action logic
    };

    const handleRemoveFromGroup = () => {
      console.log('Remove user from selected groups');
      // Implement remove logic
    };

    const handleAddToGroup = () => {
      console.log('Add user to a new group');
      // Implement add logic
    };

    return (
      <Card>
        <CardBody>
          <Toolbar>
            <ToolbarContent>
              {selectedGroups.size > 0 && (
                <>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <Content component="p" className="pf-v6-u-font-weight-bold">
                        {selectedGroups.size} selected
                      </Content>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isBulkActionOpen}
                        onSelect={() => setIsBulkActionOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsBulkActionOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsBulkActionOpen(!isBulkActionOpen)}
                            isExpanded={isBulkActionOpen}
                            variant="primary"
                          >
                            Actions
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem key="remove" onClick={() => handleBulkAction('remove')}>
                            Remove from groups
                          </DropdownItem>
                          <DropdownItem key="add" onClick={() => handleBulkAction('add')}>
                            Add to another group
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem>
                    <Divider orientation={{ default: 'vertical' }} />
                  </ToolbarItem>
                </>
              )}
              <ToolbarItem>
                <Dropdown
                  isOpen={isFilterOpen}
                  onSelect={() => setIsFilterOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsFilterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      variant="plain"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      isExpanded={isFilterOpen}
                    >
                      <FilterIcon /> Group
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="all">All groups</DropdownItem>
                    <DropdownItem key="system">System groups</DropdownItem>
                    <DropdownItem key="custom">Custom groups</DropdownItem>
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
                <Button variant={ButtonVariant.primary} onClick={handleRemoveFromGroup}>
                  Remove from group
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant={ButtonVariant.secondary} onClick={handleAddToGroup}>
                  Add to group
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          
          <Table aria-label="Groups table" variant="compact">
            <Thead>
              <Tr>
                      <Th
                        select={{
                          onSelect: (_event, isSelecting) => handleSelectAll(isSelecting),
                          isSelected: isAllSelected,
                        }}
                      />
                <Th width={50}>Group Name</Th>
                <Th width={25}>Members</Th>
                <Th width={25}>Created</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredGroups.map((group) => (
                <Tr key={group.id}>
                  <Td
                    select={{
                      rowIndex: group.id,
                      onSelect: (_event, isSelecting) => handleSelectGroup(group.id, isSelecting),
                      isSelected: selectedGroups.has(group.id),
                    }}
                  />
                  <Td dataLabel="Group Name">
                    <Button
                      variant="link"
                      isInline
                      onClick={() => navigate(`/user-management/groups/${group.name}`)}
                    >
                      {group.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Members">{group.members}</Td>
                  <Td dataLabel="Created">{group.created}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    );
  };

  const UsersTab = () => (
    <div className="table-content-card">
      <Card>
        <CardBody>
          <Content component="p">
            Users for {identityName}
          </Content>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <>
      <div className="identities-page-container">
        <div className="page-header-section">
          <Breadcrumb className="pf-v6-u-mb-md">
            <BreadcrumbItem
              to="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/user-management/identities');
              }}
            >
              User management
            </BreadcrumbItem>
            <BreadcrumbItem
              to="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/user-management/identities');
              }}
            >
              Identities
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{identityName}</BreadcrumbItem>
          </Breadcrumb>

          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexEnd' }} className="pf-v6-u-mb-md">
            <FlexItem>
              <Title headingLevel="h1" size="lg">
                {identityName}
              </Title>
              <Content component="p" className="pf-v6-u-font-size-sm pf-v6-u-color-200">
                {identityName?.toLowerCase().replace(/\s+/g, '')}
              </Content>
            </FlexItem>
            <FlexItem>
              <Button variant="plain" isInline>
                Actions <Icon><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></Icon>
              </Button>
            </FlexItem>
          </Flex>

          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Identity detail tabs">
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} aria-label="Details tab" />
            <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>} aria-label="YAML tab" />
            <Tab eventKey={2} title={<TabTitleText>Role assignments</TabTitleText>} aria-label="Role assignments tab" />
            <Tab eventKey={3} title={<TabTitleText>Groups</TabTitleText>} aria-label="Groups tab" />
          </Tabs>
        </div>

        <div className="page-content-section">
          {activeTabKey === 0 && <DetailsTab />}
          {activeTabKey === 1 && <YAMLTab />}
          {activeTabKey === 2 && <RoleAssignmentsTab />}
          {activeTabKey === 3 && <GroupsTab />}
        </div>
      </div>

      <GroupRoleAssignmentWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
        groupName={identityName || 'Unknown User'}
      />
    </>
  );
};

export { IdentityDetail };

