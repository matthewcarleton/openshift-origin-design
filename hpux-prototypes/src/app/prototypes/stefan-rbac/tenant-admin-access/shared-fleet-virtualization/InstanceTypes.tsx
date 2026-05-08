import * as React from 'react';
import {
  Title,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Label,
  Tabs,
  Tab,
  TabTitleText,
  Pagination,
  PaginationVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
} from '@patternfly/react-core';
import { 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from '@patternfly/react-table';
import { 
  StarIcon,
  EllipsisVIcon,
  ThIcon,
  ThLargeIcon,
  PlusCircleIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useImpersonation } from '@app/contexts/ImpersonationContext';

export const InstanceTypes: React.FunctionComponent = () => {
  useDocumentTitle('InstanceTypes');
  const { impersonatingUser, impersonatingGroups } = useImpersonation();
  
  // Check if impersonating dev-team-alpha group
  const isImpersonatingDevTeam = impersonatingGroups.includes('dev-team-alpha');

  // State management
  const [activeTabKey, setActiveTabKey] = React.useState<number>(0);
  const [isNameSortOpen, setIsNameSortOpen] = React.useState(false);
  const [isClusterFilterOpen, setIsClusterFilterOpen] = React.useState(false);
  const [isProjectFilterOpen, setIsProjectFilterOpen] = React.useState(false);
  const [selectedCluster, setSelectedCluster] = React.useState('All clusters');
  const [selectedProject, setSelectedProject] = React.useState('All projects');
  const [searchValue, setSearchValue] = React.useState('');
  const [openKebabId, setOpenKebabId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);

  // Instance types data (all instance types)
  const allInstanceTypes = [
    { id: '1', name: 'cx1.2xlarge', cpu: 8, memory: '16 GiB', vendor: 'redhat.com', cluster: 'cluster-hub', project: 'openshift' },
    { id: '2', name: 'cx1.2xlargelgi', cpu: 8, memory: '16 GiB', vendor: 'redhat.com', cluster: 'cluster-hub', project: 'openshift' },
    { id: '3', name: 'cx1.4xlarge', cpu: 16, memory: '32 GiB', vendor: 'redhat.com', cluster: 'cluster-us-west-prod-01', project: 'openshift' },
    { id: '4', name: 'cx1.4xlargelgi', cpu: 16, memory: '32 GiB', vendor: 'redhat.com', cluster: 'cluster-us-west-prod-01', project: 'openshift' },
    { id: '5', name: 'cx1.8xlarge', cpu: 32, memory: '64 GiB', vendor: 'redhat.com', cluster: 'cluster-us-east-prod-02', project: 'openshift' },
    { id: '6', name: 'cx1.8xlargelgi', cpu: 32, memory: '64 GiB', vendor: 'redhat.com', cluster: 'cluster-us-east-prod-02', project: 'openshift' },
    { id: '7', name: 'cx1.large', cpu: 2, memory: '4 GiB', vendor: 'redhat.com', cluster: 'cluster-hub', project: 'openshift' },
    { id: '8', name: 'cx1.largelgi', cpu: 2, memory: '4 GiB', vendor: 'redhat.com', cluster: 'cluster-hub', project: 'openshift' },
    { id: '9', name: 'cx1.medium', cpu: 1, memory: '2 GiB', vendor: 'redhat.com', cluster: 'dev-team-a-cluster', project: 'starlight' },
    { id: '10', name: 'cx1.mediumlgi', cpu: 1, memory: '2 GiB', vendor: 'redhat.com', cluster: 'dev-team-a-cluster', project: 'starlight' },
    { id: '11', name: 'cx1.xlarge', cpu: 4, memory: '8 GiB', vendor: 'redhat.com', cluster: 'dev-team-b-cluster', project: 'starlight' },
    { id: '12', name: 'cx1.xlargelgi', cpu: 4, memory: '8 GiB', vendor: 'redhat.com', cluster: 'dev-team-b-cluster', project: 'starlight' },
    { id: '13', name: 'm1.2xlarge', cpu: 8, memory: '32 GiB', vendor: 'redhat.com', cluster: 'cluster-hub', project: 'openshift' },
    { id: '14', name: 'm1.4xlarge', cpu: 16, memory: '64 GiB', vendor: 'redhat.com', cluster: 'cluster-us-west-prod-01', project: 'openshift' },
    { id: '15', name: 'm1.8xlarge', cpu: 32, memory: '128 GiB', vendor: 'redhat.com', cluster: 'cluster-us-east-prod-02', project: 'openshift' },
  ];
  
  // Filter instance types based on impersonation context
  const instanceTypes = React.useMemo(() => {
    if (isImpersonatingDevTeam) {
      // Only show instance types from dev-team-a-cluster and dev-team-b-cluster
      return allInstanceTypes.filter(instanceType => 
        instanceType.cluster === 'dev-team-a-cluster' || instanceType.cluster === 'dev-team-b-cluster'
      );
    }
    return allInstanceTypes;
  }, [isImpersonatingDevTeam]);

  // Get unique clusters and projects for filter dropdowns
  const uniqueClusters = React.useMemo(() => {
    const clusters = Array.from(new Set(instanceTypes.map(it => it.cluster)));
    return ['All clusters', ...clusters.sort()];
  }, [instanceTypes]);

  const uniqueProjects = React.useMemo(() => {
    const projects = Array.from(new Set(instanceTypes.map(it => it.project)));
    return ['All projects', ...projects.sort()];
  }, [instanceTypes]);

  const totalItems = 55; // Simulating total of 55 items as shown in screenshot

  return (
    <div 
      className="instance-types-page-container"
      style={{
        padding: '24px',
        width: '100%',
        maxWidth: '100%',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title headingLevel="h1" size="2xl">
          VirtualMachineClusterInstanceTypes
        </Title>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button variant="plain" aria-label="Favorite">
            <StarIcon />
          </Button>
          <Button variant="primary">Create</Button>
        </div>
      </div>

      {/* 16px spacing */}
      <div style={{ height: '16px' }} />

      {/* Tabs */}
      <Tabs activeKey={activeTabKey} onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex as number)}>
        <Tab eventKey={0} title={<TabTitleText>Cluster InstanceTypes</TabTitleText>} />
        <Tab eventKey={1} title={<TabTitleText>User InstanceTypes</TabTitleText>} />
      </Tabs>

      {/* 16px spacing */}
      <div style={{ height: '16px' }} />

      {/* Toolbar */}
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Dropdown
              isOpen={isClusterFilterOpen}
              onSelect={(event, value) => {
                setSelectedCluster(value as string);
                setIsClusterFilterOpen(false);
              }}
              onOpenChange={(isOpen) => setIsClusterFilterOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsClusterFilterOpen(!isClusterFilterOpen)}
                  isExpanded={isClusterFilterOpen}
                >
                  {selectedCluster}
                </MenuToggle>
              )}
            >
              <DropdownList>
                {uniqueClusters.map((cluster) => (
                  <DropdownItem key={cluster} value={cluster}>
                    {cluster}
                  </DropdownItem>
                ))}
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <Dropdown
              isOpen={isProjectFilterOpen}
              onSelect={(event, value) => {
                setSelectedProject(value as string);
                setIsProjectFilterOpen(false);
              }}
              onOpenChange={(isOpen) => setIsProjectFilterOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsProjectFilterOpen(!isProjectFilterOpen)}
                  isExpanded={isProjectFilterOpen}
                >
                  {selectedProject}
                </MenuToggle>
              )}
            >
              <DropdownList>
                {uniqueProjects.map((project) => (
                  <DropdownItem key={project} value={project}>
                    {project}
                  </DropdownItem>
                ))}
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <Dropdown
              isOpen={isNameSortOpen}
              onSelect={() => setIsNameSortOpen(false)}
              onOpenChange={(isOpen) => setIsNameSortOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsNameSortOpen(!isNameSortOpen)}
                  isExpanded={isNameSortOpen}
                >
                  Name
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="name-asc">Name (A-Z)</DropdownItem>
                <DropdownItem key="name-desc">Name (Z-A)</DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem style={{ flex: 1 }}>
            <SearchInput
              placeholder="Search by name..."
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="plain" aria-label="View options">
              <ThIcon />
            </Button>
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={totalItems}
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

      {/* 16px spacing */}
      <div style={{ height: '16px' }} />

      {/* Instance types table */}
      {activeTabKey === 0 && (
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Cluster</Th>
              <Th>Project</Th>
              <Th>CPU</Th>
              <Th>Memory</Th>
              <Th>Vendor</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {instanceTypes.map((instanceType) => (
              <Tr key={instanceType.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Label color="blue" isCompact>VMCI</Label>
                    <a
                      href="#"
                      style={{
                        color: 'var(--pf-t--global--color--brand--default)',
                        textDecoration: 'none'
                      }}
                    >
                      {instanceType.name}
                    </a>
                  </div>
                </Td>
                <Td>{instanceType.cluster}</Td>
                <Td>{instanceType.project}</Td>
                <Td>{instanceType.cpu}</Td>
                <Td>{instanceType.memory}</Td>
                <Td>{instanceType.vendor}</Td>
                <Td isActionCell>
                  <Dropdown
                    isOpen={openKebabId === instanceType.id}
                    onSelect={() => setOpenKebabId(null)}
                    onOpenChange={(isOpen) => setOpenKebabId(isOpen ? instanceType.id : null)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setOpenKebabId(openKebabId === instanceType.id ? null : instanceType.id)}
                        isExpanded={openKebabId === instanceType.id}
                        variant="plain"
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                    popperProps={{ position: 'right' }}
                  >
                    <DropdownList>
                      <DropdownItem key="edit">Edit instance type</DropdownItem>
                      <DropdownItem key="clone">Clone instance type</DropdownItem>
                      <DropdownItem key="delete">Delete instance type</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {activeTabKey === 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <EmptyState>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '24px' }}>
                <PlusCircleIcon style={{ fontSize: '64px', color: 'var(--pf-t--global--icon--color--subtle)' }} />
              </div>
              <Title headingLevel="h2" size="lg" style={{ marginBottom: '16px' }}>
                No VirtualMachineInstanceTypes found
              </Title>
              <EmptyStateBody>
                Click <strong>Create VirtualMachineInstanceType</strong> to create your first VirtualMachineInstanceType
              </EmptyStateBody>
              <EmptyStateActions style={{ marginTop: '24px' }}>
                <Button variant="primary">Create VirtualMachineInstanceType</Button>
              </EmptyStateActions>
            </div>
          </EmptyState>
        </div>
      )}
    </div>
  );
};

