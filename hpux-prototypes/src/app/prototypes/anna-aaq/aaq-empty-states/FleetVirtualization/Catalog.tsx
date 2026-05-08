import * as React from 'react';
import {
  Title,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Tabs,
  Tab,
  TabTitleText,
  Card,
  CardBody,
  Divider,
  Content,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  FormGroup,
  TextInput,
  Form,
  Split,
  SplitItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Pagination,
  PaginationVariant,
  Switch,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  Checkbox,
  ExpandableSection,
  Label,
  Badge,
  ToolbarToggleGroup,
  ToolbarGroup,
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
  PlusCircleIcon, 
  CubeIcon,
  ListIcon,
  NetworkIcon,
  ClockIcon,
  MemoryIcon,
  CpuIcon,
  ServerIcon,
  FilterIcon,
  ColumnsIcon,
  MinusIcon,
  PlusIcon,
  ExternalLinkAltIcon,
  ThIcon,
  ThLargeIcon,
  InfoCircleIcon,
  DesktopIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useImpersonation } from '@app/contexts/ImpersonationContext';

export const Catalog: React.FunctionComponent = () => {
  useDocumentTitle('Catalog');
  const { impersonatingUser, impersonatingGroups } = useImpersonation();
  
  // Check if impersonating dev-team-alpha group
  const isImpersonatingDevTeam = impersonatingGroups.includes('dev-team-alpha');

  // Dropdowns state
  const [isClusterOpen, setIsClusterOpen] = React.useState(false);
  const [isProjectOpen, setIsProjectOpen] = React.useState(false);
  const [selectedCluster, setSelectedCluster] = React.useState('dev-team-a-cluster');
  const [selectedProject, setSelectedProject] = React.useState('starlight');

  // Tabs state
  const [activeTab, setActiveTab] = React.useState<string | number>(0);
  const [activeProviderTab, setActiveProviderTab] = React.useState<string | number>(0);

  // Instance type dropdowns
  const [selectedInstanceTypes, setSelectedInstanceTypes] = React.useState<{[key: string]: string}>({
    network: 'N1',
    overcommitted: 'O1',
    memoryIntensive: 'M1',
    realtime: 'RT1',
    computeExclusive: 'CX1',
    generalPurpose: 'U1',
  });
  const [openInstanceTypeDropdown, setOpenInstanceTypeDropdown] = React.useState<string | null>(null);

  // VM Details
  const [vmName, setVmName] = React.useState('');
  const [diskSize, setDiskSize] = React.useState(30);
  const [diskUnit, setDiskUnit] = React.useState('GiB');
  const [storageClass, setStorageClass] = React.useState('ocs-storagecluster-ceph-rbd');
  const [storageClassOpen, setStorageClassOpen] = React.useState(false);
  const [diskUnitOpen, setDiskUnitOpen] = React.useState(false);
  const [sshKeyInjection, setSshKeyInjection] = React.useState(false);

  // Boot volume table toolbar state
  const [volumeDropdownOpen, setVolumeDropdownOpen] = React.useState(false);
  const [volumeFilter2Open, setVolumeFilter2Open] = React.useState(false);
  const [volumeFilterOpen, setVolumeFilterOpen] = React.useState(false);
  const [volumeSearchValue, setVolumeSearchValue] = React.useState('');
  const [volumePage, setVolumePage] = React.useState(1);
  const [volumePerPage, setVolumePerPage] = React.useState(10);
  const [selectedVolume, setSelectedVolume] = React.useState('');

  // Template catalog state
  const [templateView, setTemplateView] = React.useState<'grid' | 'list'>('grid');
  const [templateSearchValue, setTemplateSearchValue] = React.useState('');
  const [showAllTemplates, setShowAllTemplates] = React.useState(true);
  const [showDefaultTemplates, setShowDefaultTemplates] = React.useState(true);
  const [showUserTemplates, setShowUserTemplates] = React.useState(false);
  const [hideDeprecated, setHideDeprecated] = React.useState(true);
  const [bootSourceAvailable, setBootSourceAvailable] = React.useState(false);
  const [osFilterExpanded, setOsFilterExpanded] = React.useState(true);
  const [workloadFilterExpanded, setWorkloadFilterExpanded] = React.useState(true);
  const [archFilterExpanded, setArchFilterExpanded] = React.useState(true);
  const [selectedOS, setSelectedOS] = React.useState<string[]>([]);
  const [selectedWorkload, setSelectedWorkload] = React.useState<string[]>([]);
  const [selectedArch, setSelectedArch] = React.useState<string[]>([]);
  const [templateClusterOpen, setTemplateClusterOpen] = React.useState(false);
  const [selectedTemplateCluster, setSelectedTemplateCluster] = React.useState('All clusters');
  const [templateProjectOpen, setTemplateProjectOpen] = React.useState(false);
  const [selectedTemplateProject, setSelectedTemplateProject] = React.useState('All projects');

  // Data - filtered based on impersonation
  const clusters = React.useMemo(() => {
    if (isImpersonatingDevTeam) {
      return [
        { id: 'cluster-dev-team-a', name: 'dev-team-a-cluster' },
        { id: 'cluster-dev-team-b', name: 'dev-team-b-cluster' },
      ];
    }
    return [
      { id: 'cluster-hub', name: 'hub-cluster' },
      { id: 'cluster-us-west-prod-01', name: 'us-west-prod-01' },
      { id: 'cluster-us-east-prod-02', name: 'us-east-prod-02' },
      { id: 'cluster-dev-team-a', name: 'dev-team-a-cluster' },
      { id: 'cluster-dev-team-b', name: 'dev-team-b-cluster' },
    ];
  }, [isImpersonatingDevTeam]);

  const projects = React.useMemo(() => {
    if (isImpersonatingDevTeam) {
      return [
        { id: 'ns-project-starlight-dev', name: 'starlight' },
      ];
    }
    return [
      { id: 'ns-hub-acm', name: 'open-cluster-management' },
      { id: 'ns-hub-monitoring', name: 'openshift-monitoring' },
      { id: 'ns-hub-argo-cd', name: 'openshift-gitops' },
      { id: 'ns-project-starlight-dev', name: 'starlight' },
    ];
  }, [isImpersonatingDevTeam]);

  // Boot volumes data
  const bootVolumes = [
    { id: '1', name: 'fedora', architecture: '-', namespace: 'openshift-virtualization-os-images', os: 'Fedora (amd64)', storageClass: 'ocs-storagecluster-ceph-rbd-virtualization', size: '30 GiB' },
    { id: '2', name: 'rhel10', architecture: '-', namespace: 'openshift-virtualization-os-images', os: 'Red Hat Enterprise Linux 10 (amd64)', storageClass: 'ocs-storagecluster-ceph-rbd-virtualization', size: '30 GiB' },
    { id: '3', name: 'rhel8', architecture: '-', namespace: 'openshift-virtualization-os-images', os: 'Red Hat Enterprise Linux 8 (amd64)', storageClass: 'ocs-storagecluster-ceph-rbd-virtualization', size: '30 GiB' },
    { id: '4', name: 'rhel9', architecture: '-', namespace: 'openshift-virtualization-os-images', os: 'Red Hat Enterprise Linux 9 (amd64)', storageClass: 'ocs-storagecluster-ceph-rbd-virtualization', size: '30 GiB' },
  ];

  // Template catalog data
  const vmTemplates = [
    { id: '1', name: 'CentOS Stream 9 VM', shortName: 'centos-stream9-server-small', os: 'CentOS', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Server', cpu: 1, memory: '2 GiB', sourceAvailable: false },
    { id: '2', name: 'Fedora VM', shortName: 'fedora-server-small', os: 'Fedora', architecture: 'amd64', project: 'openshift', bootSource: 'PVC (auto import)', workload: 'Server', cpu: 1, memory: '2 GiB', sourceAvailable: true },
    { id: '3', name: 'Red Hat Enterprise Linux 7 VM', shortName: 'rhel7-server-small', os: 'RHEL', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Server', cpu: 1, memory: '2 GiB', sourceAvailable: false },
    { id: '4', name: 'Red Hat Enterprise Linux 8 VM', shortName: 'rhel8-server-small', os: 'RHEL', architecture: 'amd64', project: 'openshift', bootSource: 'PVC (auto import)', workload: 'Server', cpu: 1, memory: '2 GiB', sourceAvailable: true },
    { id: '5', name: 'Red Hat Enterprise Linux 9 VM', shortName: 'rhel9-server-small', os: 'RHEL', architecture: 'amd64', project: 'openshift', bootSource: 'PVC (auto import)', workload: 'Server', cpu: 1, memory: '2 GiB', sourceAvailable: true },
    { id: '6', name: 'Microsoft Windows 10 VM', shortName: 'windows10-desktop-medium', os: 'Windows', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Desktop', cpu: 1, memory: '4 GiB', sourceAvailable: false },
    { id: '7', name: 'Microsoft Windows 11 VM', shortName: 'windows11-desktop-medium', os: 'Windows', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Desktop', cpu: 2, memory: '4 GiB', sourceAvailable: false },
    { id: '8', name: 'Microsoft Windows Server 2016 VM', shortName: 'windows2k16-server-medium', os: 'Windows', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Server', cpu: 1, memory: '4 GiB', sourceAvailable: false },
    { id: '9', name: 'Microsoft Windows Server 2019 VM', shortName: 'windows2k19-server-medium', os: 'Windows', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Server', cpu: 1, memory: '4 GiB', sourceAvailable: false },
    { id: '10', name: 'Microsoft Windows Server 2022 VM', shortName: 'windows2k22-server-medium', os: 'Windows', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Server', cpu: 1, memory: '4 GiB', sourceAvailable: false },
    { id: '11', name: 'Microsoft Windows Server 2025 VM', shortName: 'windows2k25-server-medium', os: 'Windows', architecture: 'amd64', project: 'openshift', bootSource: 'PVC', workload: 'Server', cpu: 1, memory: '4 GiB', sourceAvailable: false },
  ];

  const instanceTypeCategories = [
    { 
      id: 'network', 
      name: 'Network', 
      icon: <NetworkIcon />,
      series: ['N1', 'N2', 'N4'],
      description: 'Optimized for network-intensive workloads'
    },
    { 
      id: 'overcommitted', 
      name: 'Overcommitted', 
      icon: <ServerIcon />,
      series: ['O1', 'O2', 'O4'],
      description: 'Suitable for development and testing'
    },
    { 
      id: 'memoryIntensive', 
      name: 'Memory Intensive', 
      icon: <MemoryIcon />,
      series: ['M1', 'M2', 'M4'],
      description: 'High memory allocation for data processing'
    },
    { 
      id: 'realtime', 
      name: 'Realtime', 
      icon: <ClockIcon />,
      series: ['RT1', 'RT2', 'RT4'],
      description: 'Low latency for time-sensitive applications'
    },
    { 
      id: 'computeExclusive', 
      name: 'Compute Exclusive', 
      icon: <CpuIcon />,
      series: ['CX1', 'CX2', 'CX4'],
      description: 'Dedicated CPU cores for compute workloads'
    },
    { 
      id: 'generalPurpose', 
      name: 'General Purpose', 
      icon: <CubeIcon />,
      series: ['U1', 'U2', 'U4'],
      description: 'Balanced resources for general workloads'
    },
  ];

  return (
    <div className="catalog-page-container">
      {/* White header section */}
      <div className="page-header-section">
        {/* Top dropdowns */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
          <FormGroup label="Cluster" isRequired>
            <Dropdown
              isOpen={isClusterOpen}
              onSelect={() => setIsClusterOpen(false)}
              onOpenChange={(isOpen) => setIsClusterOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsClusterOpen(!isClusterOpen)}
                  isExpanded={isClusterOpen}
                  style={{ width: '250px' }}
                >
                  {selectedCluster}
                </MenuToggle>
              )}
            >
              <DropdownList>
                {clusters.map((cluster) => (
                  <DropdownItem
                    key={cluster.id}
                    onClick={() => setSelectedCluster(cluster.name)}
                  >
                    {cluster.name}
                  </DropdownItem>
                ))}
              </DropdownList>
            </Dropdown>
          </FormGroup>
          <FormGroup label="Project" isRequired>
            <Dropdown
              isOpen={isProjectOpen}
              onSelect={() => setIsProjectOpen(false)}
              onOpenChange={(isOpen) => setIsProjectOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsProjectOpen(!isProjectOpen)}
                  isExpanded={isProjectOpen}
                  style={{ width: '250px' }}
                >
                  {selectedProject}
                </MenuToggle>
              )}
            >
              <DropdownList>
                {projects.map((project) => (
                  <DropdownItem
                    key={project.id}
                    onClick={() => setSelectedProject(project.name)}
                  >
                    {project.name}
                  </DropdownItem>
                ))}
              </DropdownList>
            </Dropdown>
          </FormGroup>
        </div>

        <Divider style={{ marginBottom: '24px' }} />

        {/* Title and Description */}
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '8px' }}>
          Catalog
        </Title>
        <Content component="p" style={{ marginBottom: '24px', color: 'var(--pf-t--global--text--color--subtle)' }}>
          Create VirtualMachines from InstanceTypes or use pre-configured templates
        </Content>

        {/* Main Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}
        >
          <Tab
            eventKey={0}
            title={
              <TabTitleText>
                <CubeIcon style={{ marginRight: '8px' }} />
                InstanceTypes
              </TabTitleText>
            }
          />
          <Tab
            eventKey={1}
            title={
              <TabTitleText>
                <ListIcon style={{ marginRight: '8px' }} />
                Template catalog
              </TabTitleText>
            }
          />
        </Tabs>
      </div>

      {/* Content area */}
      <div className="page-content-section">
        {activeTab === 0 && (
          <>
          {/* Step wizard card */}
          <Card style={{ marginTop: '24px' }}>
            <CardBody>
              {/* Step 1: Select volume to boot from */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--pf-t--global--color--brand--default)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      marginRight: '12px'
                    }}>
                      1
                    </div>
                    <Title headingLevel="h2" size="xl">
                      Select volume to boot from
                    </Title>
                  </div>
                  <Button variant="primary" size="sm">
                    Add volume
                  </Button>
                </div>

                <div style={{ marginLeft: '44px' }}>
                  {/* Toolbar */}
                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem>
                        <Dropdown
                          isOpen={volumeFilter2Open}
                          onSelect={() => setVolumeFilter2Open(false)}
                          onOpenChange={(isOpen) => setVolumeFilter2Open(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setVolumeFilter2Open(!volumeFilter2Open)}
                              isExpanded={volumeFilter2Open}
                              icon={<FilterIcon />}
                            >
                              Filter
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem key="all">All namespaces</DropdownItem>
                            <DropdownItem key="namespace1">openshift-virtualization</DropdownItem>
                            <DropdownItem key="namespace2">default</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </ToolbarItem>
                      <ToolbarItem>
                        <Dropdown
                          isOpen={volumeFilterOpen}
                          onSelect={() => setVolumeFilterOpen(false)}
                          onOpenChange={(isOpen) => setVolumeFilterOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setVolumeFilterOpen(!volumeFilterOpen)}
                              isExpanded={volumeFilterOpen}
                              icon={<FilterIcon />}
                            >
                              Filter
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem key="all">All volumes</DropdownItem>
                            <DropdownItem key="fedora">Fedora</DropdownItem>
                            <DropdownItem key="rhel">RHEL</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </ToolbarItem>
                      <ToolbarItem>
                        <SearchInput
                          placeholder="Search volumes"
                          value={volumeSearchValue}
                          onChange={(_event, value) => setVolumeSearchValue(value)}
                          onClear={() => setVolumeSearchValue('')}
                        />
                      </ToolbarItem>
                      <ToolbarItem>
                        <Button
                          variant="plain"
                          aria-label="Manage columns"
                        >
                          <ColumnsIcon />
                        </Button>
                      </ToolbarItem>
                      <ToolbarItem align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={bootVolumes.length}
                          perPage={volumePerPage}
                          page={volumePage}
                          onSetPage={(_event, pageNumber) => setVolumePage(pageNumber)}
                          onPerPageSelect={(_event, newPerPage) => {
                            setVolumePerPage(newPerPage);
                            setVolumePage(1);
                          }}
                          variant={PaginationVariant.top}
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>

                  <Table variant="compact">
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>Volume name</Th>
                        <Th>Architecture</Th>
                        <Th>Namespace</Th>
                        <Th>Operating system</Th>
                        <Th>Storage class</Th>
                        <Th>Size</Th>
                        <Th>Description</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bootVolumes.map((volume) => (
                        <Tr key={volume.id}>
                          <Td>
                            <input
                              type="radio"
                              name="bootVolume"
                              checked={selectedVolume === volume.id}
                              onChange={() => setSelectedVolume(volume.id)}
                            />
                          </Td>
                          <Td>{volume.name}</Td>
                          <Td>{volume.architecture}</Td>
                          <Td>{volume.namespace}</Td>
                          <Td>{volume.os}</Td>
                          <Td>{volume.storageClass}</Td>
                          <Td>{volume.size}</Td>
                          <Td>-</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>

              <Divider style={{ margin: '32px 0' }} />

              {/* Step 2: Select InstanceType */}
              <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--pf-t--global--color--brand--default)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      marginRight: '12px'
                    }}>
                      2
                    </div>
                    <Title headingLevel="h2" size="xl">
                      Select InstanceType
                    </Title>
                  </div>

                  <div style={{ marginLeft: '44px' }}>
                    <Tabs
                      activeKey={activeProviderTab}
                      onSelect={(_event, tabIndex) => setActiveProviderTab(tabIndex)}
                    >
                      <Tab eventKey={0} title={<TabTitleText>Red Hat provided</TabTitleText>}>
                        <Grid hasGutter style={{ marginTop: '24px' }}>
                          {instanceTypeCategories.map((category) => (
                            <GridItem key={category.id} span={2}>
                              <Card isCompact>
                                <CardBody style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                                    {category.icon}
                                  </div>
                                  <Title headingLevel="h3" size="md" style={{ marginBottom: '4px' }}>
                                    {category.name}
                                  </Title>
                                  <Content component="p" style={{ 
                                    fontSize: '12px', 
                                    color: 'var(--pf-t--global--text--color--subtle)',
                                    marginBottom: '16px',
                                    minHeight: '36px'
                                  }}>
                                    {category.description}
                                  </Content>
                                  <Dropdown
                                    isOpen={openInstanceTypeDropdown === category.id}
                                    onSelect={() => setOpenInstanceTypeDropdown(null)}
                                    onOpenChange={(isOpen) => setOpenInstanceTypeDropdown(isOpen ? category.id : null)}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                      <MenuToggle
                                        ref={toggleRef}
                                        onClick={() => setOpenInstanceTypeDropdown(
                                          openInstanceTypeDropdown === category.id ? null : category.id
                                        )}
                                        isExpanded={openInstanceTypeDropdown === category.id}
                                        style={{ width: '100%' }}
                                      >
                                        {selectedInstanceTypes[category.id]} series
                                      </MenuToggle>
                                    )}
                                  >
                                    <DropdownList>
                                      {category.series.map((series) => (
                                        <DropdownItem
                                          key={series}
                                          onClick={() => {
                                            setSelectedInstanceTypes({
                                              ...selectedInstanceTypes,
                                              [category.id]: series
                                            });
                                          }}
                                        >
                                          {series} series
                                        </DropdownItem>
                                      ))}
                                    </DropdownList>
                                  </Dropdown>
                                </CardBody>
                              </Card>
                            </GridItem>
                          ))}
                        </Grid>
                      </Tab>
                      <Tab eventKey={1} title={<TabTitleText>User provided</TabTitleText>}>
                        <div style={{ padding: '24px', textAlign: 'center' }}>
                          <Content>No user-provided InstanceTypes available</Content>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>

                <Divider style={{ margin: '32px 0' }} />

                {/* Step 3: VirtualMachine details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--pf-t--global--color--brand--default)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      marginRight: '12px'
                    }}>
                      3
                    </div>
                    <Title headingLevel="h2" size="xl">
                      VirtualMachine details
                    </Title>
                  </div>

                  <div style={{ marginLeft: '44px' }}>
                    <Grid hasGutter>
                      <GridItem span={6}>
                        {/* Name */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Name</div>
                          <TextInput
                            type="text"
                            value={vmName}
                            onChange={(_event, value) => setVmName(value)}
                            placeholder="Enter VirtualMachine name"
                            style={{ flex: 1 }}
                          />
                        </div>
                        
                        {/* Operating system */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Operating system</div>
                          <div style={{ flex: 1 }}>Fedora (amd64)</div>
                        </div>
                        
                        {/* InstanceType */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>InstanceType</div>
                          <div style={{ flex: 1 }}>N1</div>
                        </div>
                        
                        {/* CPU | Memory */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>CPU | Memory</div>
                          <div style={{ flex: 1 }}>2 CPU | 4 GiB Memory</div>
                        </div>
                      </GridItem>
                      
                      <GridItem span={6}>
                        {/* Cluster */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Cluster</div>
                          <div style={{ flex: 1 }}>{selectedCluster}</div>
                        </div>
                        
                        {/* Project */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Project</div>
                          <div style={{ flex: 1 }}>{selectedProject}</div>
                        </div>
                        
                        {/* Disk size */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Disk size</div>
                          <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Button
                              variant="control"
                              onClick={() => setDiskSize(Math.max(1, diskSize - 1))}
                              aria-label="Minus"
                            >
                              <MinusIcon />
                            </Button>
                            <TextInput
                              type="number"
                              value={diskSize}
                              onChange={(_event, value) => setDiskSize(parseInt(value) || 0)}
                              style={{ width: '100px', textAlign: 'center' }}
                            />
                            <Button
                              variant="control"
                              onClick={() => setDiskSize(diskSize + 1)}
                              aria-label="Plus"
                            >
                              <PlusIcon />
                            </Button>
                            <Dropdown
                              isOpen={diskUnitOpen}
                              onSelect={() => setDiskUnitOpen(false)}
                              onOpenChange={(isOpen) => setDiskUnitOpen(isOpen)}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setDiskUnitOpen(!diskUnitOpen)}
                                  isExpanded={diskUnitOpen}
                                  style={{ width: '100px' }}
                                >
                                  {diskUnit}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem key="gib" onClick={() => setDiskUnit('GiB')}>GiB</DropdownItem>
                                <DropdownItem key="gb" onClick={() => setDiskUnit('GB')}>GB</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </div>
                        </div>
                        
                        {/* Storage class */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Storage class</div>
                          <div style={{ flex: 1 }}>
                            <Dropdown
                              isOpen={storageClassOpen}
                              onSelect={() => setStorageClassOpen(false)}
                              onOpenChange={(isOpen) => setStorageClassOpen(isOpen)}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setStorageClassOpen(!storageClassOpen)}
                                  isExpanded={storageClassOpen}
                                  style={{ width: '100%' }}
                                >
                                  {storageClass}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem key="rbd" onClick={() => setStorageClass('ocs-storagecluster-ceph-rbd')}>
                                  ocs-storagecluster-ceph-rbd
                                </DropdownItem>
                                <DropdownItem key="fs" onClick={() => setStorageClass('ocs-storagecluster-cephfs')}>
                                  ocs-storagecluster-cephfs
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </div>
                        </div>
                        
                        {/* Public SSH key */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Public SSH key</div>
                          <div style={{ flex: 1 }}>
                            <Button
                              variant="link"
                              icon={<ExternalLinkAltIcon />}
                              iconPosition="end"
                              onClick={() => {
                                // TODO: Open SSH key configuration
                                console.log('Configure SSH key');
                              }}
                            >
                              Not configured
                            </Button>
                          </div>
                        </div>
                        
                        {/* Dynamic SSH key injection */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                          <div style={{ minWidth: '150px', fontWeight: 500 }}>Dynamic SSH key injection</div>
                          <div style={{ flex: 1 }}>
                            <Switch
                              id="ssh-key-injection-switch"
                              aria-label="Dynamic SSH key injection"
                              isChecked={sshKeyInjection}
                              onChange={(_event, checked) => setSshKeyInjection(checked)}
                            />
                          </div>
                        </div>
                      </GridItem>
                    </Grid>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Bottom actions */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <Button variant="primary">Create VirtualMachine</Button>
              <Button variant="secondary">Customize VirtualMachine</Button>
              <Button variant="link">Cancel</Button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                <Button variant="secondary">View YAML</Button>
                <Button variant="secondary">View CLI</Button>
              </div>
            </div>
          </>
        )}

        {activeTab === 1 && (
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
            {/* Left sidebar with filters */}
            <div style={{ width: '250px', flexShrink: 0 }}>
              <Card>
                <CardBody>
                  {/* Template cluster dropdown */}
                  <FormGroup label="Cluster" style={{ marginBottom: '16px' }}>
                    <Dropdown
                      isOpen={templateClusterOpen}
                      onSelect={() => setTemplateClusterOpen(false)}
                      onOpenChange={(isOpen) => setTemplateClusterOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setTemplateClusterOpen(!templateClusterOpen)}
                          isExpanded={templateClusterOpen}
                          style={{ width: '100%' }}
                        >
                          {selectedTemplateCluster}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem key="all-clusters" onClick={() => setSelectedTemplateCluster('All clusters')}>
                          All clusters
                        </DropdownItem>
                        <DropdownItem key="hub" onClick={() => setSelectedTemplateCluster('hub-cluster')}>
                          hub-cluster
                        </DropdownItem>
                        <DropdownItem key="us-west" onClick={() => setSelectedTemplateCluster('us-west-prod-01')}>
                          us-west-prod-01
                        </DropdownItem>
                        <DropdownItem key="us-east" onClick={() => setSelectedTemplateCluster('us-east-prod-02')}>
                          us-east-prod-02
                        </DropdownItem>
                        <DropdownItem key="dev-a" onClick={() => setSelectedTemplateCluster('dev-team-a-cluster')}>
                          dev-team-a-cluster
                        </DropdownItem>
                        <DropdownItem key="dev-b" onClick={() => setSelectedTemplateCluster('dev-team-b-cluster')}>
                          dev-team-b-cluster
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>

                  {/* Template project dropdown */}
                  <FormGroup label="Template project" style={{ marginBottom: '16px' }}>
                    <Dropdown
                      isOpen={templateProjectOpen}
                      onSelect={() => setTemplateProjectOpen(false)}
                      onOpenChange={(isOpen) => setTemplateProjectOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setTemplateProjectOpen(!templateProjectOpen)}
                          isExpanded={templateProjectOpen}
                          style={{ width: '100%' }}
                        >
                          {selectedTemplateProject}
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem key="all" onClick={() => setSelectedTemplateProject('All projects')}>
                          All projects
                        </DropdownItem>
                        <DropdownItem key="openshift" onClick={() => setSelectedTemplateProject('openshift')}>
                          openshift
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FormGroup>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Template type filters */}
                  <div style={{ marginBottom: '16px' }}>
                    <Checkbox
                      id="all-templates"
                      label="All templates"
                      isChecked={showAllTemplates}
                      onChange={(_event, checked) => setShowAllTemplates(checked)}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <Checkbox
                      id="default-templates"
                      label="Default templates"
                      isChecked={showDefaultTemplates}
                      onChange={(_event, checked) => setShowDefaultTemplates(checked)}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <Checkbox
                      id="user-templates"
                      label="User templates"
                      isChecked={showUserTemplates}
                      onChange={(_event, checked) => setShowUserTemplates(checked)}
                    />
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Hide deprecated */}
                  <div style={{ marginBottom: '16px' }}>
                    <Checkbox
                      id="hide-deprecated"
                      label="Hide deprecated templates"
                      isChecked={hideDeprecated}
                      onChange={(_event, checked) => setHideDeprecated(checked)}
                    />
                  </div>

                  {/* Boot source available */}
                  <div style={{ marginBottom: '16px' }}>
                    <Checkbox
                      id="boot-source-available"
                      label="Boot source available"
                      isChecked={bootSourceAvailable}
                      onChange={(_event, checked) => setBootSourceAvailable(checked)}
                    />
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Operating system filter */}
                  <ExpandableSection
                    toggleText="Operating system"
                    isExpanded={osFilterExpanded}
                    onToggle={(_event, isExpanded) => setOsFilterExpanded(isExpanded)}
                  >
                    <div style={{ paddingLeft: '8px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="os-centos"
                          label="CentOS"
                          isChecked={selectedOS.includes('CentOS')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedOS([...selectedOS, 'CentOS']);
                            } else {
                              setSelectedOS(selectedOS.filter(os => os !== 'CentOS'));
                            }
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="os-fedora"
                          label="Fedora"
                          isChecked={selectedOS.includes('Fedora')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedOS([...selectedOS, 'Fedora']);
                            } else {
                              setSelectedOS(selectedOS.filter(os => os !== 'Fedora'));
                            }
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="os-other"
                          label="Other"
                          isChecked={selectedOS.includes('Other')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedOS([...selectedOS, 'Other']);
                            } else {
                              setSelectedOS(selectedOS.filter(os => os !== 'Other'));
                            }
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="os-rhel"
                          label="RHEL"
                          isChecked={selectedOS.includes('RHEL')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedOS([...selectedOS, 'RHEL']);
                            } else {
                              setSelectedOS(selectedOS.filter(os => os !== 'RHEL'));
                            }
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="os-windows"
                          label="Windows"
                          isChecked={selectedOS.includes('Windows')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedOS([...selectedOS, 'Windows']);
                            } else {
                              setSelectedOS(selectedOS.filter(os => os !== 'Windows'));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </ExpandableSection>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Workload filter */}
                  <ExpandableSection
                    toggleText="Workload"
                    isExpanded={workloadFilterExpanded}
                    onToggle={(_event, isExpanded) => setWorkloadFilterExpanded(isExpanded)}
                  >
                    <div style={{ paddingLeft: '8px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="workload-desktop"
                          label="Desktop"
                          isChecked={selectedWorkload.includes('Desktop')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedWorkload([...selectedWorkload, 'Desktop']);
                            } else {
                              setSelectedWorkload(selectedWorkload.filter(w => w !== 'Desktop'));
                            }
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="workload-high-performance"
                          label="High performance"
                          isChecked={selectedWorkload.includes('High performance')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedWorkload([...selectedWorkload, 'High performance']);
                            } else {
                              setSelectedWorkload(selectedWorkload.filter(w => w !== 'High performance'));
                            }
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="workload-server"
                          label="Server"
                          isChecked={selectedWorkload.includes('Server')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedWorkload([...selectedWorkload, 'Server']);
                            } else {
                              setSelectedWorkload(selectedWorkload.filter(w => w !== 'Server'));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </ExpandableSection>

                  <Divider style={{ margin: '16px 0' }} />

                  {/* Architecture filter */}
                  <ExpandableSection
                    toggleText="Architecture"
                    isExpanded={archFilterExpanded}
                    onToggle={(_event, isExpanded) => setArchFilterExpanded(isExpanded)}
                  >
                    <div style={{ paddingLeft: '8px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Checkbox
                          id="arch-amd64"
                          label="amd64"
                          isChecked={selectedArch.includes('amd64')}
                          onChange={(_event, checked) => {
                            if (checked) {
                              setSelectedArch([...selectedArch, 'amd64']);
                            } else {
                              setSelectedArch(selectedArch.filter(a => a !== 'amd64'));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </ExpandableSection>
                </CardBody>
              </Card>
            </div>

            {/* Main content area */}
            <div style={{ flex: 1 }}>
              {/* Header with title and info icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Title headingLevel="h2" size="xl">Default templates</Title>
                <InfoCircleIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
              </div>

              {/* Toolbar */}
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem style={{ flex: 1 }}>
                    <SearchInput
                      placeholder="Filter by keyword..."
                      value={templateSearchValue}
                      onChange={(_event, value) => setTemplateSearchValue(value)}
                      onClear={() => setTemplateSearchValue('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <span style={{ marginRight: '16px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      {vmTemplates.length} items
                    </span>
                  </ToolbarItem>
                  <ToolbarItem>
                    <div style={{ 
                      display: 'inline-flex', 
                      backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                      borderRadius: '8px',
                      padding: '4px',
                      gap: '4px'
                    }}>
                      <Button
                        variant="plain"
                        onClick={() => setTemplateView('list')}
                        style={{ 
                          borderRadius: '4px',
                          backgroundColor: templateView === 'list' ? 'var(--pf-t--global--color--brand--default)' : 'transparent',
                          color: templateView === 'list' ? '#ffffff' : 'var(--pf-t--global--text--color--regular)',
                          padding: '8px 16px',
                          border: 'none'
                        }}
                      >
                        <ThIcon />
                      </Button>
                      <Button
                        variant="plain"
                        onClick={() => setTemplateView('grid')}
                        style={{ 
                          borderRadius: '4px',
                          backgroundColor: templateView === 'grid' ? 'var(--pf-t--global--color--brand--default)' : 'transparent',
                          color: templateView === 'grid' ? '#ffffff' : 'var(--pf-t--global--text--color--regular)',
                          padding: '8px 16px',
                          border: 'none'
                        }}
                      >
                        <ThLargeIcon />
                      </Button>
                    </div>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              {/* Template cards grid or table */}
              {templateView === 'grid' ? (
                <Grid hasGutter style={{ marginTop: '24px' }}>
                  {vmTemplates.map((template) => (
                    <GridItem key={template.id} span={4}>
                      <Card isClickable style={{ height: '100%' }}>
                        <CardBody>
                          {/* Icon and header */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ 
                              width: '48px', 
                              height: '48px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px',
                              flexShrink: 0
                            }}>
                              {template.os === 'Fedora' && <CubeIcon style={{ fontSize: '32px', color: '#51A2DA' }} />}
                              {template.os === 'CentOS' && <CubeIcon style={{ fontSize: '32px', color: '#932279' }} />}
                              {template.os === 'RHEL' && <ServerIcon style={{ fontSize: '32px', color: '#EE0000' }} />}
                              {template.os === 'Windows' && <DesktopIcon style={{ fontSize: '32px', color: '#00BCF2' }} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Title headingLevel="h3" size="md" style={{ marginBottom: '4px' }}>
                                {template.name}
                              </Title>
                              <Content component="p" style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                {template.shortName}
                              </Content>
                            </div>
                            {template.sourceAvailable && (
                              <Badge style={{ marginLeft: '8px', flexShrink: 0 }}>Source available</Badge>
                            )}
                          </div>

                          {/* Template details */}
                          <div style={{ fontSize: '14px' }}>
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                              <div style={{ minWidth: '120px', fontWeight: 500 }}>Architecture</div>
                              <Badge isRead>{template.architecture}</Badge>
                            </div>
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                              <div style={{ minWidth: '120px', fontWeight: 500 }}>Project</div>
                              <div>{template.project}</div>
                            </div>
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                              <div style={{ minWidth: '120px', fontWeight: 500 }}>Boot source</div>
                              <div>{template.bootSource}</div>
                            </div>
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                              <div style={{ minWidth: '120px', fontWeight: 500 }}>Workload</div>
                              <div>{template.workload}</div>
                            </div>
                            <div style={{ display: 'flex', marginBottom: '8px' }}>
                              <div style={{ minWidth: '120px', fontWeight: 500 }}>CPU</div>
                              <div>{template.cpu}</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                              <div style={{ minWidth: '120px', fontWeight: 500 }}>Memory</div>
                              <div>{template.memory}</div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </GridItem>
                  ))}
                </Grid>
              ) : (
                <Table variant="compact" style={{ marginTop: '24px' }}>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Architecture</Th>
                      <Th>Workload</Th>
                      <Th>Boot source</Th>
                      <Th>CPU | Memory</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {vmTemplates.map((template) => (
                      <Tr key={template.id} style={{ cursor: 'pointer' }}>
                        <Td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {template.os === 'Fedora' && <CubeIcon style={{ fontSize: '24px', color: '#51A2DA' }} />}
                              {template.os === 'CentOS' && <CubeIcon style={{ fontSize: '24px', color: '#932279' }} />}
                              {template.os === 'RHEL' && <ServerIcon style={{ fontSize: '24px', color: '#EE0000' }} />}
                              {template.os === 'Windows' && <DesktopIcon style={{ fontSize: '24px', color: '#00BCF2' }} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500 }}>{template.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                {template.shortName}
                              </div>
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <Badge isRead>{template.architecture}</Badge>
                        </Td>
                        <Td>{template.workload}</Td>
                        <Td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div>{template.bootSource}</div>
                            {template.sourceAvailable && (
                              <Badge>Source available</Badge>
                            )}
                          </div>
                        </Td>
                        <Td>CPU {template.cpu} | Memory {template.memory}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};