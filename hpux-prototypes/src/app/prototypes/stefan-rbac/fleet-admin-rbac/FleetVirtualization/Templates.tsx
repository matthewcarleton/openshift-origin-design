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
  Content,
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
  FilterIcon,
  ExternalLinkAltIcon,
  StarIcon,
  EllipsisVIcon,
  CubeIcon,
  ServerIcon,
  DesktopIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useImpersonation } from '@app/contexts/ImpersonationContext';

export const Templates: React.FunctionComponent = () => {
  useDocumentTitle('Templates');
  const { impersonatingUser, impersonatingGroups } = useImpersonation();
  
  // Check if impersonating dev-team-alpha group
  const isImpersonatingDevTeam = impersonatingGroups.includes('dev-team-alpha');

  // State management
  const [isClusterOpen, setIsClusterOpen] = React.useState(false);
  const [selectedCluster, setSelectedCluster] = React.useState('All clusters');
  const [isProjectOpen, setIsProjectOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState('All projects');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isNameSortOpen, setIsNameSortOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [hideDeprecated, setHideDeprecated] = React.useState(true);
  const [openKebabId, setOpenKebabId] = React.useState<string | null>(null);

  // Template data (all templates)
  const allTemplates = [
    { id: '1', name: 'vm-s390x-template', os: 'Fedora', architecture: '-', workload: 'Server', bootSource: 'Container disk', sourceAvailable: true, cluster: 'cluster-hub', project: 'openshift' },
    { id: '2', name: 'centos-stream9-server-small', os: 'CentOS', architecture: 'amd64', workload: 'Server', bootSource: 'PVC', sourceAvailable: false, cluster: 'cluster-us-west-prod-01', project: 'openshift' },
    { id: '3', name: 'fedora-server-small', os: 'Fedora', architecture: 'amd64', workload: 'Server', bootSource: 'PVC (auto import)', sourceAvailable: true, cluster: 'cluster-hub', project: 'openshift' },
    { id: '4', name: 'rhel7-server-small', os: 'RHEL', architecture: 'amd64', workload: 'Server', bootSource: 'PVC', sourceAvailable: false, cluster: 'cluster-us-east-prod-02', project: 'openshift' },
    { id: '5', name: 'rhel8-server-small', os: 'RHEL', architecture: 'amd64', workload: 'Server', bootSource: 'PVC (auto import)', sourceAvailable: true, cluster: 'cluster-hub', project: 'openshift' },
    { id: '6', name: 'rhel9-server-small', os: 'RHEL', architecture: 'amd64', workload: 'Server', bootSource: 'PVC (auto import)', sourceAvailable: true, cluster: 'cluster-hub', project: 'openshift' },
    { id: '7', name: 'windows10-desktop-medium', os: 'Windows', architecture: 'amd64', workload: 'Desktop', bootSource: 'PVC', sourceAvailable: false, cluster: 'dev-team-a-cluster', project: 'starlight' },
    { id: '8', name: 'windows11-desktop-medium', os: 'Windows', architecture: 'amd64', workload: 'Desktop', bootSource: 'PVC', sourceAvailable: false, cluster: 'dev-team-a-cluster', project: 'starlight' },
    { id: '9', name: 'windows2k19-server-medium', os: 'Windows', architecture: 'amd64', workload: 'Server', bootSource: 'PVC', sourceAvailable: false, cluster: 'dev-team-b-cluster', project: 'starlight' },
    { id: '10', name: 'windows2k22-server-medium', os: 'Windows', architecture: 'amd64', workload: 'Server', bootSource: 'PVC', sourceAvailable: false, cluster: 'dev-team-b-cluster', project: 'starlight' },
  ];
  
  // Filter templates based on impersonation context
  const templates = React.useMemo(() => {
    if (isImpersonatingDevTeam) {
      // Only show templates from dev-team-a-cluster and dev-team-b-cluster
      return allTemplates.filter(template => 
        template.cluster === 'dev-team-a-cluster' || template.cluster === 'dev-team-b-cluster'
      );
    }
    return allTemplates;
  }, [isImpersonatingDevTeam]);

  return (
    <div 
      className="templates-page-container"
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
          VirtualMachine Templates
        </Title>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button variant="plain" aria-label="Favorite">
            <StarIcon />
          </Button>
          <Button variant="primary">Create Template</Button>
        </div>
      </div>

      {/* 16px spacing */}
      <div style={{ height: '16px' }} />

      {/* Subtitle with link */}
      <Content style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
        Supported operating systems are labeled below.{' '}
        <a href="#" style={{ color: 'var(--pf-t--global--color--brand--default)', textDecoration: 'none' }}>
          Learn more about Red Hat support <ExternalLinkAltIcon style={{ fontSize: '12px', marginLeft: '4px' }} />
        </a>
      </Content>

      {/* 16px spacing */}
      <div style={{ height: '16px' }} />

      {/* Toolbar */}
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Dropdown
              isOpen={isClusterOpen}
              onSelect={() => setIsClusterOpen(false)}
              onOpenChange={(isOpen) => setIsClusterOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsClusterOpen(!isClusterOpen)}
                  isExpanded={isClusterOpen}
                >
                  {selectedCluster}
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="all-clusters" onClick={() => setSelectedCluster('All clusters')}>
                  All clusters
                </DropdownItem>
                <DropdownItem key="hub" onClick={() => setSelectedCluster('hub-cluster')}>
                  hub-cluster
                </DropdownItem>
                <DropdownItem key="us-west" onClick={() => setSelectedCluster('us-west-prod-01')}>
                  us-west-prod-01
                </DropdownItem>
                <DropdownItem key="us-east" onClick={() => setSelectedCluster('us-east-prod-02')}>
                  us-east-prod-02
                </DropdownItem>
                <DropdownItem key="dev-a" onClick={() => setSelectedCluster('dev-team-a-cluster')}>
                  dev-team-a-cluster
                </DropdownItem>
                <DropdownItem key="dev-b" onClick={() => setSelectedCluster('dev-team-b-cluster')}>
                  dev-team-b-cluster
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <Dropdown
              isOpen={isProjectOpen}
              onSelect={() => setIsProjectOpen(false)}
              onOpenChange={(isOpen) => setIsProjectOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsProjectOpen(!isProjectOpen)}
                  isExpanded={isProjectOpen}
                >
                  {selectedProject}
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="all-projects" onClick={() => setSelectedProject('All projects')}>
                  All projects
                </DropdownItem>
                <DropdownItem key="openshift" onClick={() => setSelectedProject('openshift')}>
                  openshift
                </DropdownItem>
                <DropdownItem key="monitoring" onClick={() => setSelectedProject('openshift-monitoring')}>
                  openshift-monitoring
                </DropdownItem>
                <DropdownItem key="gitops" onClick={() => setSelectedProject('openshift-gitops')}>
                  openshift-gitops
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <Dropdown
              isOpen={isFilterOpen}
              onSelect={() => setIsFilterOpen(false)}
              onOpenChange={(isOpen) => setIsFilterOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  isExpanded={isFilterOpen}
                  icon={<FilterIcon />}
                >
                  Filter
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="all">All templates</DropdownItem>
                <DropdownItem key="default">Default templates</DropdownItem>
                <DropdownItem key="user">User templates</DropdownItem>
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
              <EllipsisVIcon style={{ transform: 'rotate(90deg)' }} />
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      {/* 8px spacing */}
      <div style={{ height: '8px' }} />

      {/* Active filters */}
      {hideDeprecated && (
        <div>
          <Label
            color="blue"
            onClose={() => setHideDeprecated(false)}
            style={{ marginRight: '8px' }}
          >
            Hide deprecated templates
          </Label>
        </div>
      )}

      {/* 8px spacing */}
      {hideDeprecated && <div style={{ height: '8px' }} />}

      {/* Clear all filters link */}
      <div style={{ marginBottom: '16px' }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setHideDeprecated(false);
            setSearchValue('');
          }}
          style={{
            color: 'var(--pf-t--global--color--brand--default)',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          Clear all filters
        </a>
      </div>

      {/* Templates table */}
      <Table variant="compact">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Cluster</Th>
            <Th>Project</Th>
            <Th>Architecture</Th>
            <Th>Workload profile</Th>
            <Th>Boot source</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {templates.map((template) => (
            <Tr key={template.id}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {template.os === 'Fedora' && <CubeIcon style={{ fontSize: '20px', color: '#51A2DA' }} />}
                    {template.os === 'CentOS' && <CubeIcon style={{ fontSize: '20px', color: '#932279' }} />}
                    {template.os === 'RHEL' && <ServerIcon style={{ fontSize: '20px', color: '#EE0000' }} />}
                    {template.os === 'Windows' && <DesktopIcon style={{ fontSize: '20px', color: '#00BCF2' }} />}
                  </div>
                  <a
                    href="#"
                    style={{
                      color: 'var(--pf-t--global--color--brand--default)',
                      textDecoration: 'none'
                    }}
                  >
                    {template.name}
                  </a>
                </div>
              </Td>
              <Td>{template.cluster}</Td>
              <Td>{template.project}</Td>
              <Td>{template.architecture}</Td>
              <Td>{template.workload}</Td>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{template.bootSource}</span>
                  {template.sourceAvailable && (
                    <Label color="blue" isCompact>Source available</Label>
                  )}
                </div>
              </Td>
              <Td isActionCell>
                <Dropdown
                  isOpen={openKebabId === template.id}
                  onSelect={() => setOpenKebabId(null)}
                  onOpenChange={(isOpen) => setOpenKebabId(isOpen ? template.id : null)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setOpenKebabId(openKebabId === template.id ? null : template.id)}
                      isExpanded={openKebabId === template.id}
                      variant="plain"
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  popperProps={{ position: 'right' }}
                >
                  <DropdownList>
                    <DropdownItem key="edit">Edit template</DropdownItem>
                    <DropdownItem key="clone">Clone template</DropdownItem>
                    <DropdownItem key="delete">Delete template</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

