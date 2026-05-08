import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Content,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Card,
  CardBody,
  PageSection,
  Tabs,
  Tab,
  TabTitleText,
  Breadcrumb,
  BreadcrumbItem,
  SearchInput,
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  PaginationVariant,
  ExpandableSection,
  Flex,
  FlexItem,
  Icon,
  Tooltip,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Checkbox,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { InfoCircleIcon, CheckIcon, ExclamationTriangleIcon, CaretDownIcon } from '@patternfly/react-icons';
import { CubesIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { ClusterSetRoleAssignmentWizard } from '../RoleAssignment/ClusterSetRoleAssignmentWizard';
import { ClusterRoleAssignmentWizard } from '../RoleAssignment/ClusterRoleAssignmentWizard';
import { getAllClusterSets, getClustersByClusterSet, getAllRoles } from '@app/data/queries';

// Interface for role assignment entries
interface RoleAssignment {
  id: string;
  name: string;
  type: 'User' | 'Group';
  clusters: string[];
  projects: string[];
  roles: Array<{
    name: string;
    displayName: string;
    category: string;
  }>;
  status: 'Active' | 'Inactive';
  assignedDate: string;
  assignedBy: string;
  origin: string;
}

const ClusterDetail: React.FunctionComponent = () => {
  const { clusterName } = useParams<{ clusterName: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [roleAssignments, setRoleAssignments] = React.useState<RoleAssignment[]>([]);
  const [selectedAssignments, setSelectedAssignments] = React.useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState<string>('all');
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  
  // Detect if this is a cluster set (contains 'petemobile' prefix) vs individual cluster
  const isClusterSet = clusterName?.startsWith('petemobile') || false;
  
  useDocumentTitle(`ACM | ${clusterName}`);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const handleCreateRoleAssignment = () => {
    setIsWizardOpen(true);
  };

  const handleWizardComplete = (wizardData: any) => {
    // Determine clusters
    let clustersList: string[] = [];
    let projectsList: string[] = [];
    
    if (isClusterSet) {
      // For cluster sets, show the resource scope
      if (wizardData.resourceScope === 'all') {
        clustersList = ['All clusters in cluster set'];
        projectsList = ['All projects'];
      } else {
        clustersList = [`${wizardData.selectedClusters?.length || 0} selected cluster(s)`];
        projectsList = ['All projects'];
      }
    } else {
      // For individual clusters
      clustersList = [clusterName || ''];
      projectsList = ['All projects'];
    }
    
    // Get full role information
    const allRoles = getAllRoles();
    const selectedRole = allRoles.find(r => r.name === wizardData.roleName);
    
    const roleInfo = {
      name: selectedRole?.name || wizardData.roleName || 'Unknown Role',
      displayName: selectedRole?.displayName || wizardData.roleName || 'Unknown Role',
      category: selectedRole?.category || 'openshift',
    };
    
    // Create a new role assignment from the wizard selections
    const newAssignment: RoleAssignment = {
      id: `ra-${Date.now()}`,
      name: wizardData.identityName || 'Unknown',
      type: wizardData.identityType === 'user' ? 'User' : 'Group',
      clusters: clustersList,
      projects: projectsList,
      roles: [roleInfo],
      status: 'Active',
      assignedDate: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      assignedBy: 'Walter Joseph Kovacs',
      origin: 'Hub cluster'
    };
    
    setRoleAssignments([...roleAssignments, newAssignment]);
    setIsWizardOpen(false);
    
    // Show success alert (auto-dismiss handled by Alert timeout prop)
    setShowSuccessAlert(true);
  };

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
  };

  const OverviewTab = () => (
    <div>
      <Card>
        <CardBody>
          <ExpandableSection
            toggleText="Details"
            isExpanded={true}
          >
            <DescriptionList isHorizontal>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>Cluster resource name</FlexItem>
                    <FlexItem>
                      <Tooltip content="Information about cluster resource name">
                        <InfoCircleIcon />
                      </Tooltip>
                    </FlexItem>
                  </Flex>
                </DescriptionListTerm>
                <DescriptionListDescription>{clusterName}</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Control plane type</DescriptionListTerm>
                <DescriptionListDescription>Standalone</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <Label color="green" icon={<CheckIcon />}>
                    Ready
                  </Label>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Infrastructure</DescriptionListTerm>
                <DescriptionListDescription>
                  <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>Microsoft Azure</FlexItem>
                  </Flex>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Distribution version</DescriptionListTerm>
                <DescriptionListDescription>v1.33.3</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Labels</DescriptionListTerm>
                <DescriptionListDescription>
                  <div>
                    <Button variant="plain" isInline>
                      <Icon><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></Icon>
                    </Button>
                    <div className="pf-v6-u-mt-sm">
                      <Flex spaceItems={{ default: 'spaceItemsSm' }} wrap="wrap">
                        <Label color="grey" isCompact>name={clusterName}</Label>
                        <Label color="grey" isCompact>vendor=AKS</Label>
                        <Label color="grey" isCompact>cloud=Azure</Label>
                        <Label color="grey" isCompact>cluster.open-cluster-management.io/clusterset=xks-clusters</Label>
                        <Label color="grey" isCompact>app-demo=true</Label>
                        <Label color="grey" isCompact>feature.open-cluster-management.io/addon-application-manager=available</Label>
                        <Label color="grey" isCompact>feature.open-cluster-management.io/addon-cert-policy-controller=available</Label>
                        <Label color="grey" isCompact>feature.open-cluster-management.io/addon-cluster-proxy=available</Label>
                      </Flex>
                    </div>
                  </div>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Cluster API address</DescriptionListTerm>
                <DescriptionListDescription>
                  <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                    <FlexItem>
                      <Button variant="link" isInline>
                        https://sberens-aks-dns-0a38ymwa.hcp.centralus.azmk8s.io:443
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="plain" isInline>
                        <Icon><path d="M8 2C6.9 2 6 2.9 6 4v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H8zm0 2h8v12H8V4z"/></Icon>
                      </Button>
                    </FlexItem>
                  </Flex>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Console URL</DescriptionListTerm>
                <DescriptionListDescription>-</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Cluster ID</DescriptionListTerm>
                <DescriptionListDescription>-</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Username & password</DescriptionListTerm>
                <DescriptionListDescription>-</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Created by</DescriptionListTerm>
                <DescriptionListDescription>-</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Cluster set</DescriptionListTerm>
                <DescriptionListDescription>
                  <Button variant="link" isInline>xks-clusters</Button>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </ExpandableSection>
        </CardBody>
      </Card>

      <div style={{ height: '32px' }}></div>

      <Card>
        <CardBody>
          <ExpandableSection
            toggleText="Status"
            isExpanded={true}
          >
            <div className="pf-v6-u-mt-md">
              <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                <FlexItem>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>2</div>
                    <div>Nodes</div>
                    <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>0 nodes inactive</div>
                  </div>
                </FlexItem>
                <FlexItem>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>1</div>
                    <div>Applications</div>
                  </div>
                </FlexItem>
                <FlexItem>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c9190b' }}>1</div>
                    <div style={{ color: '#c9190b' }}>
                      <Icon><ExclamationTriangleIcon /></Icon> Policy violations
                    </div>
                  </div>
                </FlexItem>
                <FlexItem>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</div>
                    <div>No potential issues found</div>
                  </div>
                </FlexItem>
              </Flex>
            </div>
          </ExpandableSection>
        </CardBody>
      </Card>
    </div>
  );

  const NodesTab = () => {
    const mockNodes = [
      {
        id: 1,
        name: 'aks-agentpool-62974295-vmss000000',
        status: 'Ready',
        role: 'Worker',
        region: 'centralus',
        zone: '0',
        instanceType: 'Standard_D4ds_v5',
        cpu: '4',
        ram: '15.6 Gi'
      },
      {
        id: 2,
        name: 'aks-agentpool-62974295-vmss000001',
        status: 'Ready',
        role: 'Worker',
        region: 'centralus',
        zone: '0',
        instanceType: 'Standard_D4ds_v5',
        cpu: '4',
        ram: '15.6 Gi'
      }
    ];

    const filteredNodes = mockNodes.filter(node =>
      node.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const paginatedNodes = filteredNodes.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return (
      <div className="table-content-card">
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                placeholder="Search for a node"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Nodes table" variant="compact">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Region</Th>
              <Th>Instance type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedNodes.map((node) => (
              <Tr key={node.id}>
                <Td dataLabel="Name">
                  <Button variant="link" isInline>
                    {node.name}
                  </Button>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {node.instanceType}
                  </div>
                </Td>
                <Td dataLabel="Status">
                  <Label color="green" icon={<CheckIcon />}>
                    {node.status}
                  </Label>
                </Td>
                <Td dataLabel="Region">{node.region}</Td>
                <Td dataLabel="Instance type">{node.cpu} CPU / {node.ram} RAM</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={filteredNodes.length}
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

  const AddOnsTab = () => {
    const mockAddOns = [
      { id: 1, name: 'application-manager', status: 'Available', version: 'v1.2.3', updated: '2 hours ago' },
      { id: 2, name: 'cert-policy-controller', status: 'Available', version: 'v2.1.0', updated: '5 hours ago' },
      { id: 3, name: 'cluster-proxy', status: 'Available', version: 'v1.5.2', updated: '1 day ago' },
      { id: 4, name: 'config-policy-controller', status: 'Available', version: 'v3.0.1', updated: '3 days ago' },
      { id: 5, name: 'gitops-addon', status: 'Available', version: 'v1.8.0', updated: '5 days ago' },
      { id: 6, name: 'governance-policy-framework', status: 'Available', version: 'v2.4.1', updated: '1 week ago' },
      { id: 7, name: 'managed-serviceaccount', status: 'Available', version: 'v1.0.5', updated: '2 weeks ago' },
      { id: 8, name: 'observability-controller', status: 'Available', version: 'v4.1.2', updated: '3 weeks ago' },
      { id: 9, name: 'search-collector', status: 'Available', version: 'v2.3.0', updated: '1 month ago' },
      { id: 10, name: 'work-manager', status: 'Available', version: 'v1.7.4', updated: '1 month ago' }
    ];

    const filteredAddOns = mockAddOns.filter(addon =>
      addon.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const paginatedAddOns = filteredAddOns.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return (
      <div className="table-content-card">
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                placeholder="Search for an add-on"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Add-ons table" variant="compact">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedAddOns.map((addon) => (
              <Tr key={addon.id}>
                <Td dataLabel="Name">
                  <div>{addon.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {addon.version}
                  </div>
                </Td>
                <Td dataLabel="Status">
                  <Label color="green" icon={<CheckIcon />}>
                    {addon.status}
                  </Label>
                </Td>
                <Td dataLabel="Updated">{addon.updated}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={filteredAddOns.length}
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

  const RoleAssignmentsTab = () => {
  const [bulkSelectorDropdownOpen, setBulkSelectorDropdownOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState('Name');
  const [isRoleFilterOpen, setIsRoleFilterOpen] = React.useState(false);

  const handleDeleteAssignment = (assignmentId: string) => {
    setRoleAssignments(roleAssignments.filter(ra => ra.id !== assignmentId));
    setSelectedAssignments(prev => {
      const newSet = new Set(prev);
      newSet.delete(assignmentId);
      return newSet;
    });
  };

  const handleSelectAssignment = (assignmentId: string, isSelecting: boolean) => {
    setSelectedAssignments(prev => {
      const newSet = new Set(prev);
      if (isSelecting) {
        newSet.add(assignmentId);
      } else {
        newSet.delete(assignmentId);
      }
      return newSet;
    });
  };

  const handleSelectPage = () => {
    const newSelected = new Set(selectedAssignments);
    paginatedAssignments.forEach(assignment => newSelected.add(assignment.id));
    setSelectedAssignments(newSelected);
    setBulkSelectorDropdownOpen(false);
  };

  const handleSelectAllAssignments = () => {
    const allIds = roleAssignments.map(ra => ra.id);
    setSelectedAssignments(new Set(allIds));
    setBulkSelectorDropdownOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedAssignments(new Set());
  };

  const handleBulkDelete = () => {
    setRoleAssignments(roleAssignments.filter(ra => !selectedAssignments.has(ra.id)));
    setSelectedAssignments(new Set());
    setIsBulkActionsOpen(false);
  };

    // Show empty state if no assignments
    if (roleAssignments.length === 0) {
      return (
        <div className="table-content-card">
          <EmptyState>
            <CubesIcon />
            <Title headingLevel="h2" size="lg">
              No role assignments created yet
            </Title>
            <EmptyStateBody>
              Control what users and groups can access or view by assigning them a role for your managed resources.
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
        </div>
      );
    }

    // Show table if there are assignments
    const filteredAssignments = roleAssignments.filter(assignment => {
      const matchesSearch = 
        (filterType === 'Name' && assignment.name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (filterType === 'Identity type' && assignment.type.toLowerCase().includes(searchValue.toLowerCase())) ||
        (filterType === 'Cluster' && assignment.clusters.some(c => c.toLowerCase().includes(searchValue.toLowerCase()))) ||
        (filterType === 'Project' && assignment.projects.some(p => p.toLowerCase().includes(searchValue.toLowerCase()))) ||
        (filterType === 'Role' && assignment.roles.some(r => 
          r.displayName.toLowerCase().includes(searchValue.toLowerCase()) || 
          r.name.toLowerCase().includes(searchValue.toLowerCase())
        )) ||
        (filterType === 'Status' && assignment.status.toLowerCase().includes(searchValue.toLowerCase())) ||
        (filterType === 'Assigned by' && assignment.assignedBy?.toLowerCase().includes(searchValue.toLowerCase())) ||
        (filterType === 'Origin' && assignment.origin.toLowerCase().includes(searchValue.toLowerCase()));
      return matchesSearch || searchValue === '';
    });

    const paginatedAssignments = filteredAssignments.slice(
      (page - 1) * perPage,
      page * perPage
    );

    const isAllPageSelected = paginatedAssignments.length > 0 && paginatedAssignments.every(assignment => selectedAssignments.has(assignment.id));
    const areSomeSelected = selectedAssignments.size > 0;

    return (
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
                      if (selectedAssignments.size > 0) {
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
                          id="select-all-role-assignments-checkbox"
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
                    Select page ({paginatedAssignments.length} items)
                  </DropdownItem>
                  <DropdownItem key="select-all" onClick={handleSelectAllAssignments}>
                    Select all ({filteredAssignments.length} items)
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                isOpen={isRoleFilterOpen}
                onSelect={() => setIsRoleFilterOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsRoleFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle 
                    ref={toggleRef} 
                    onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)} 
                    isExpanded={isRoleFilterOpen}
                    variant="default"
                  >
                    {filterType}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem value="Name" onClick={() => setFilterType('Name')}>
                    Name
                  </DropdownItem>
                  <DropdownItem value="Identity type" onClick={() => setFilterType('Identity type')}>
                    Identity type
                  </DropdownItem>
                  <DropdownItem value="Cluster" onClick={() => setFilterType('Cluster')}>
                    Cluster
                  </DropdownItem>
                  <DropdownItem value="Project" onClick={() => setFilterType('Project')}>
                    Project
                  </DropdownItem>
                  <DropdownItem value="Role" onClick={() => setFilterType('Role')}>
                    Role
                  </DropdownItem>
                  <DropdownItem value="Status" onClick={() => setFilterType('Status')}>
                    Status
                  </DropdownItem>
                  <DropdownItem value="Assigned by" onClick={() => setFilterType('Assigned by')}>
                    Assigned by
                  </DropdownItem>
                  <DropdownItem value="Origin" onClick={() => setFilterType('Origin')}>
                    Origin
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder={`Search by ${filterType.toLowerCase()}`}
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
            {areSomeSelected && (
              <>
                <ToolbarItem variant="separator" />
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
                      >
                        Actions ({selectedAssignments.size} selected)
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
              </>
            )}
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
              <Th />
              <Th sort={{ sortBy: {}, columnIndex: 0 }}>Name</Th>
              <Th sort={{ sortBy: {}, columnIndex: 1 }}>Type</Th>
              {isClusterSet && <Th sort={{ sortBy: {}, columnIndex: 2 }}>Clusters</Th>}
              <Th sort={{ sortBy: {}, columnIndex: isClusterSet ? 3 : 2 }}>Projects</Th>
              <Th sort={{ sortBy: {}, columnIndex: isClusterSet ? 4 : 3 }}>Roles</Th>
              <Th sort={{ sortBy: {}, columnIndex: isClusterSet ? 5 : 4 }}>Status</Th>
              <Th sort={{ sortBy: {}, columnIndex: isClusterSet ? 6 : 5 }}>Assigned date</Th>
              <Th sort={{ sortBy: {}, columnIndex: isClusterSet ? 7 : 6 }}>Assigned by</Th>
              <Th sort={{ sortBy: {}, columnIndex: isClusterSet ? 8 : 7 }}>Origin</Th>
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
                <Td dataLabel="Name">
                  <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                    {assignment.name}
                  </Button>
                </Td>
                <Td dataLabel="Type">{assignment.type}</Td>
                {isClusterSet && (
                  <Td dataLabel="Clusters">
                    {assignment.clusters && assignment.clusters.length > 0 ? (
                      assignment.clusters.map((cluster, idx) => (
                        <span key={idx}>
                          <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                            {cluster}
                          </Button>
                          {idx < assignment.clusters.length - 1 && ', '}
                        </span>
                      ))
                    ) : (
                      '-'
                    )}
                  </Td>
                )}
                <Td dataLabel="Projects">
                  {assignment.projects.map((ns, idx) => (
                    <span key={idx}>
                      <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                        {ns}
                      </Button>
                      {idx < assignment.projects.length - 1 && ', '}
                    </span>
                  ))}
                </Td>
                <Td dataLabel="Roles">
                  {assignment.roles.map((role, idx) => (
                    <span key={idx}>
                      <div>
                        <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                          {role.displayName}
                        </Button>
                        <div className="pf-v6-u-font-size-sm pf-v6-u-color-200">
                          {role.name}
                        </div>
                      </div>
                      {idx < assignment.roles.length - 1 && ', '}
                    </span>
                  ))}
                </Td>
                <Td dataLabel="Status">
                  <Label color="green" icon={<span>✓</span>}>
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

  // New tabs for Cluster Set
  const SubmarinerAddOnsTab = () => (
    <div className="table-content-card">
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              placeholder="Search for a Submariner add-on"
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Submariner add-ons table" variant="compact">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Version</Th>
            <Th>Updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td dataLabel="Name">submariner-addon</Td>
            <Td dataLabel="Status">
              <Label color="green" icon={<CheckIcon />}>
                Available
              </Label>
            </Td>
            <Td dataLabel="Version">0.14.0</Td>
            <Td dataLabel="Updated">2 hours ago</Td>
          </Tr>
          <Tr>
            <Td dataLabel="Name">submariner-gateway</Td>
            <Td dataLabel="Status">
              <Label color="green" icon={<CheckIcon />}>
                Available
              </Label>
            </Td>
            <Td dataLabel="Version">0.14.0</Td>
            <Td dataLabel="Updated">2 hours ago</Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );

  const ClusterListTab = () => {
    // Get cluster set data from centralized database
    const allClusterSets = getAllClusterSets();
    const currentClusterSet = allClusterSets.find(cs => cs.name === clusterName);
    const clustersInSet = currentClusterSet ? getClustersByClusterSet(currentClusterSet.id) : [];

    // Filter clusters based on search
    const filteredClusters = clustersInSet.filter(cluster =>
      cluster.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Map cluster status to label color
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Ready':
          return 'green';
        case 'Not Ready':
          return 'red';
        case 'Degraded':
          return 'orange';
        default:
          return 'grey';
      }
    };

    return (
      <div className="table-content-card">
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                placeholder="Search for a cluster"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Clusters in set table" variant="compact">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Provider</Th>
              <Th>Region</Th>
              <Th>Nodes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredClusters.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <EmptyState>
                    <CubesIcon />
                    <Title headingLevel="h2" size="lg">
                      No clusters found
                    </Title>
                    <EmptyStateBody>
                      {searchValue ? 'No clusters match your search criteria.' : 'No clusters in this cluster set.'}
                    </EmptyStateBody>
                  </EmptyState>
                </Td>
              </Tr>
            ) : (
              filteredClusters.map((cluster) => (
                <Tr key={cluster.id}>
                  <Td dataLabel="Name">
                    <Button 
                      variant="link" 
                      isInline 
                      onClick={() => navigate(`/infrastructure/clusters/${cluster.name}`)}
                      style={{ paddingLeft: 0 }}
                    >
                      {cluster.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Status">
                    <Label color={getStatusColor(cluster.status)} icon={<CheckIcon />}>
                      {cluster.status}
                    </Label>
                  </Td>
                  <Td dataLabel="Provider">Amazon Web Services</Td>
                  <Td dataLabel="Region">{cluster.location}</Td>
                  <Td dataLabel="Nodes">{cluster.nodes}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>
    );
  };

  const ClusterPoolsTab = () => (
    <div className="table-content-card">
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              placeholder="Search for a cluster pool"
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary">Create cluster pool</Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Cluster pools table" variant="compact">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Size</Th>
            <Th>Available</Th>
            <Th>Provider</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td dataLabel="Name">production-pool</Td>
            <Td dataLabel="Status">
              <Label color="green" icon={<CheckIcon />}>
                Ready
              </Label>
            </Td>
            <Td dataLabel="Size">10</Td>
            <Td dataLabel="Available">7</Td>
            <Td dataLabel="Provider">AWS</Td>
          </Tr>
          <Tr>
            <Td dataLabel="Name">dev-pool</Td>
            <Td dataLabel="Status">
              <Label color="green" icon={<CheckIcon />}>
                Ready
              </Label>
            </Td>
            <Td dataLabel="Size">5</Td>
            <Td dataLabel="Available">4</Td>
            <Td dataLabel="Provider">Azure</Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="clusters-page-container">
        <div className="page-header-section">
          <Breadcrumb className="pf-v6-u-mb-md">
            <BreadcrumbItem
              to="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/infrastructure/clusters');
              }}
            >
              Clusters
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{clusterName}</BreadcrumbItem>
          </Breadcrumb>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <Title headingLevel="h1" size="lg">
              {clusterName}
            </Title>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Button variant="link" isInline>
                Grafana <Icon><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></Icon>
              </Button>
              <Button variant="plain" isInline>
                Actions <Icon><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></Icon>
              </Button>
            </div>
          </div>
          
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Cluster detail tabs">
            <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} aria-label="Overview tab" />
            {isClusterSet ? (
              <>
                <Tab eventKey={1} title={<TabTitleText>Submariner add-ons</TabTitleText>} aria-label="Submariner add-ons tab" />
                <Tab eventKey={2} title={<TabTitleText>Cluster list</TabTitleText>} aria-label="Cluster list tab" />
                <Tab eventKey={3} title={<TabTitleText>Cluster pools</TabTitleText>} aria-label="Cluster pools tab" />
                <Tab eventKey={4} title={<TabTitleText>Role assignments</TabTitleText>} aria-label="Role assignments tab" />
              </>
            ) : (
              <>
                <Tab eventKey={1} title={<TabTitleText>Nodes</TabTitleText>} aria-label="Nodes tab" />
                <Tab eventKey={2} title={<TabTitleText>Add-ons</TabTitleText>} aria-label="Add-ons tab" />
                <Tab eventKey={3} title={<TabTitleText>Role assignments</TabTitleText>} aria-label="Role assignments tab" />
              </>
            )}
          </Tabs>
        </div>

        <div className="page-content-section">
          {activeTabKey === 0 && <OverviewTab />}
          {isClusterSet ? (
            <>
              {activeTabKey === 1 && <SubmarinerAddOnsTab />}
              {activeTabKey === 2 && <ClusterListTab />}
              {activeTabKey === 3 && <ClusterPoolsTab />}
              {activeTabKey === 4 && <RoleAssignmentsTab />}
            </>
          ) : (
            <>
              {activeTabKey === 1 && <NodesTab />}
              {activeTabKey === 2 && <AddOnsTab />}
              {activeTabKey === 3 && <RoleAssignmentsTab />}
            </>
          )}
        </div>
      </div>

          {isClusterSet ? (
            <ClusterSetRoleAssignmentWizard
              isOpen={isWizardOpen}
              onClose={() => setIsWizardOpen(false)}
              onComplete={handleWizardComplete}
              clusterSetName={clusterName || ''}
            />
          ) : (
            <ClusterRoleAssignmentWizard 
              isOpen={isWizardOpen} 
              onClose={() => setIsWizardOpen(false)}
              onComplete={handleWizardComplete}
              clusterName={clusterName || ''}
            />
          )}

          {/* Success Alert */}
          <AlertGroup isToast isLiveRegion>
            {showSuccessAlert && (
              <Alert
                variant="success"
                title="Role assignment created"
                actionClose={
                  <AlertActionCloseButton onClose={() => setShowSuccessAlert(false)} />
                }
                timeout={10000}
                onTimeout={() => setShowSuccessAlert(false)}
              />
            )}
          </AlertGroup>
    </>
  );
};

export { ClusterDetail };

