import * as React from 'react';
import {
  Page,
  PageSection,
  Title,
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Checkbox,
  Label,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Pagination,
  PaginationVariant,
  Switch,
  Content,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  TreeView,
  TreeViewDataItem,
  Divider,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Breadcrumb,
  BreadcrumbItem,
  ExpandableSection,
  Split,
  SplitItem,
  Modal,
  ModalVariant,
  Alert,
  Form,
  FormGroup,
  Tooltip,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { FilterIcon, EllipsisVIcon, CogIcon, AngleLeftIcon, AngleRightIcon, SyncAltIcon, RedoIcon, CheckIcon, PlusCircleIcon, ColumnsIcon, ServerIcon, ProjectDiagramIcon, ExclamationCircleIcon, OffIcon, PauseCircleIcon, MulticlusterIcon, CubesIcon, AngleDoubleDownIcon, AngleDoubleUpIcon, CaretDownIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import './VirtualMachines.css';
import { getAllClusterSets, getClustersByClusterSet, getNamespacesByCluster, getVirtualMachinesByNamespace, getVirtualMachinesByCluster, getVirtualMachinesByClusterSet, getAllVirtualMachines } from '@app/data';
import { MigrateVMsWizard } from './MigrateVMsWizard';
import { useImpersonation } from '@app/contexts/ImpersonationContext';
import { VirtualMachine } from '@app/data/schemas/virtualization';

// Mock VM search suggestions
const vmSearchSuggestions = [
  'vm-centos-stream8-fuchsia-tarsier-90',
  'vm-centos-stream8-violet-sawfish-64',
  'vm-diplomatic-alpaca',
  'vm-fedora-brown-salmon-50',
  'vm-rhel-8-apricot-cheetah-33',
];

// Mock VM data
// Helper function to get VMs based on selected tree node and impersonation context
const getVMsForSelection = (selectedNodeId: string | null, impersonatingUser: string | null, hubClusterOnly?: boolean): VirtualMachine[] => {
  // Define access scope for impersonated users
  const allowedNamespaceIds = impersonatingUser ? ['ns-project-starlight-dev', 'ns-project-starlight-dev-b'] : null;
  
  let vms: VirtualMachine[] = [];
  
  if (!selectedNodeId) {
    // No selection, show all VMs (or filtered for impersonation/hub cluster)
    vms = hubClusterOnly ? getVirtualMachinesByCluster('cluster-hub') : getAllVirtualMachines();
  } else if (selectedNodeId.startsWith('clusterset-')) {
    const clusterSetId = selectedNodeId.replace('clusterset-', '');
    vms = getVirtualMachinesByClusterSet(clusterSetId);
  } else if (selectedNodeId.startsWith('cluster-')) {
    const clusterId = selectedNodeId.replace('cluster-', '');
    vms = getVirtualMachinesByCluster(clusterId);
  } else if (selectedNodeId.startsWith('namespace-')) {
    const namespaceId = selectedNodeId.replace('namespace-', '');
    vms = getVirtualMachinesByNamespace(namespaceId);
  } else if (selectedNodeId.startsWith('vm-')) {
    // If a specific VM is selected, show just that VM
    const vmId = selectedNodeId.replace('vm-', '');
    const allVMs = getAllVirtualMachines();
    const vm = allVMs.find(v => v.id === vmId);
    vms = vm ? [vm] : [];
  } else {
    vms = hubClusterOnly ? getVirtualMachinesByCluster('cluster-hub') : getAllVirtualMachines();
  }
  
  // Filter VMs based on impersonation context
  if (allowedNamespaceIds) {
    vms = vms.filter(vm => allowedNamespaceIds.includes(vm.namespaceId));
  }
  
  // Filter VMs to hub cluster only if hubClusterOnly is true
  if (hubClusterOnly && !impersonatingUser) {
    vms = vms.filter(vm => vm.clusterId === 'cluster-hub');
  }
  
  return vms;
};

interface VirtualMachinesProps {
  hubClusterOnly?: boolean;
  showProjectsOnly?: boolean;
}

const VirtualMachines: React.FunctionComponent<VirtualMachinesProps> = ({ hubClusterOnly = false, showProjectsOnly = false }) => {
  useDocumentTitle('Virtual machines');
  const { impersonatingUser } = useImpersonation();
  
  const [searchValue, setSearchValue] = React.useState('');
  const [sidebarSearch, setSidebarSearch] = React.useState('');
  const [showOnlyWithVMs, setShowOnlyWithVMs] = React.useState(true);
  const [isTreeExpanded, setIsTreeExpanded] = React.useState(true);
  const [selectedVMs, setSelectedVMs] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(420);
  const [isResizing, setIsResizing] = React.useState(false);
  const [selectedTreeNode, setSelectedTreeNode] = React.useState<string | null>(null);
  const [migrateMenuPosition, setMigrateMenuPosition] = React.useState<{ top: number; left: number } | null>(null);
  const searchInputRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const migrateItemRef = React.useRef<HTMLDivElement>(null);
  
  // Dropdown states
  const [isBulkSelectOpen, setIsBulkSelectOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = React.useState(false);
  const [isOSFilterOpen, setIsOSFilterOpen] = React.useState(false);
  const [isMenuToggleOpen, setIsMenuToggleOpen] = React.useState(false);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [isToolbarActionsOpen, setIsToolbarActionsOpen] = React.useState(false);
  const [isMigrateMenuOpen, setIsMigrateMenuOpen] = React.useState(false);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isRefreshDropdownOpen, setIsRefreshDropdownOpen] = React.useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string>('All');
  const [osFilter, setOSFilter] = React.useState<string>('All');
  
  // Refresh state
  const [refreshMode, setRefreshMode] = React.useState<'auto' | 'manual'>('auto');
  const [lastUpdated, setLastUpdated] = React.useState(new Date());
  
  const [selectedCluster, setSelectedCluster] = React.useState('test');
  
  // Manage columns modal state
  const [isManageColumnsOpen, setIsManageColumnsOpen] = React.useState(false);
  const [isMigrateWizardOpen, setIsMigrateWizardOpen] = React.useState(false);
  const [openRowMenuId, setOpenRowMenuId] = React.useState<number | null>(null);
  const [openRowMigrateMenuId, setOpenRowMigrateMenuId] = React.useState<number | null>(null);
  const [rowMigrateMenuPosition, setRowMigrateMenuPosition] = React.useState<{ top: number; left: number } | null>(null);
  const [selectedColumns, setSelectedColumns] = React.useState({
    name: true,
    namespace: true,
    status: true,
    conditions: true,
    node: true,
    ipAddress: true,
    created: false,
    memory: false,
    cpu: false,
    network: false,
    deletionProtection: false,
    storageClass: false,
  });
  
  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.classList.remove('resizing-sidebar');
    };

    if (isResizing) {
      document.body.classList.add('resizing-sidebar');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.classList.remove('resizing-sidebar');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Close search menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchMenuOpen && searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        const dropdown = document.querySelector('.search-dropdown-menu');
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setIsSearchMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchMenuOpen]);
  
  // Get VMs based on selected tree node and apply filters
  const filteredVMs = React.useMemo(() => {
    // Get VMs from database based on selected tree node
    const vmsFromDB = getVMsForSelection(selectedTreeNode, impersonatingUser, hubClusterOnly);
    
    // Transform VMs from database to table format and apply filters
    return vmsFromDB
      .filter(vm => {
        const matchesStatus = statusFilter === 'All' || vm.status === statusFilter;
        const matchesOS = osFilter === 'All' || vm.os === osFilter;
        const matchesSearch = !searchValue || vm.name.toLowerCase().includes(searchValue.toLowerCase());
        return matchesStatus && matchesOS && matchesSearch;
      })
      .map((vm, index) => ({
        id: index + 1,
        name: vm.name,
        status: vm.status,
        os: vm.os,
        cpu: `${vm.cpu} vCPU`,
        memory: `${vm.memory}`,
        disk: `${vm.storage}`,
        ip: vm.ipAddress,
        labels: ['app:web', 'env:prod'], // Placeholder
        moreLabels: 0,
      }));
  }, [selectedTreeNode, statusFilter, osFilter, searchValue, impersonatingUser, hubClusterOnly]);

  // Get unique statuses and operating systems for filter options
  const allVMs = React.useMemo(() => getVMsForSelection(selectedTreeNode, impersonatingUser, hubClusterOnly), [selectedTreeNode, impersonatingUser, hubClusterOnly]);
  const availableStatuses = React.useMemo(() => 
    ['All', ...Array.from(new Set(allVMs.map(vm => vm.status)))],
    [allVMs]
  );
  const availableOSs = React.useMemo(() => 
    ['All', ...Array.from(new Set(allVMs.map(vm => vm.os)))],
    [allVMs]
  );

  // Calculate status counts for summary card
  const vmStatusCounts = React.useMemo(() => {
    const counts = {
      Error: 0,
      Running: 0,
      Stopped: 0,
      Paused: 0,
      Migrating: 0,
    };
    
    allVMs.forEach(vm => {
      if (counts.hasOwnProperty(vm.status)) {
        counts[vm.status as keyof typeof counts]++;
      }
    });
    
    return counts;
  }, [allVMs]);

  // Handle selecting all VMs
  const handleSelectAllVMs = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedVMs(filteredVMs.map(vm => vm.id));
    } else {
      setSelectedVMs([]);
    }
  };

  // Handle selecting VMs on current page only
  const handleSelectPage = () => {
    const paginatedVMs = filteredVMs.slice((page - 1) * perPage, page * perPage);
    const paginatedIds = paginatedVMs.map(vm => vm.id);
    setSelectedVMs(paginatedIds);
    setIsBulkSelectOpen(false);
  };

  // Handle selecting all filtered VMs
  const handleSelectAll = () => {
    setSelectedVMs(filteredVMs.map(vm => vm.id));
    setIsBulkSelectOpen(false);
  };

  // Handle deselecting all VMs
  const handleDeselectAll = () => {
    setSelectedVMs([]);
    setIsBulkSelectOpen(false);
  };

  // Check if all VMs on current page are selected
  const isAllPageSelected = React.useMemo(() => {
    const paginatedVMs = filteredVMs.slice((page - 1) * perPage, page * perPage);
    return paginatedVMs.length > 0 && paginatedVMs.every(vm => selectedVMs.includes(vm.id));
  }, [filteredVMs, page, perPage, selectedVMs]);

  // Manage columns handlers
  const handleToggleColumn = (column: string) => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column as keyof typeof selectedColumns],
    });
  };

  const handleRestoreDefaultColumns = () => {
    setSelectedColumns({
      name: true,
      namespace: true,
      status: true,
      conditions: true,
      node: true,
      ipAddress: true,
      created: false,
      memory: false,
      cpu: false,
      network: false,
      deletionProtection: false,
      storageClass: false,
    });
  };

  const handleSaveColumns = () => {
    setIsManageColumnsOpen(false);
    // In a real app, you would save these preferences
  };

  
  const handleSelectVM = (vmId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedVMs([...selectedVMs, vmId]);
    } else {
      setSelectedVMs(selectedVMs.filter(id => id !== vmId));
    }
  };
  
  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };
  
  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
  };
  
  // Per-row actions dropdown handlers
  const toggleRowMenu = (vmId: number) => {
    setOpenRowMenuId(openRowMenuId === vmId ? null : vmId);
    setOpenRowMigrateMenuId(null);
  };

  const handleRowMigrateVM = (vmId: number) => {
    setSelectedVMs([vmId]);
    setIsMigrateWizardOpen(true);
    setOpenRowMenuId(null);
    setOpenRowMigrateMenuId(null);
  };
  
  // Tree view data for sidebar
  // Build tree data from centralized database
  const dbClusterSets = React.useMemo(() => getAllClusterSets(), []);
  
  const treeData: TreeViewDataItem[] = React.useMemo(() => {
    // Define access scope for impersonated users
    // For Walter Kovacs (dev-team-alpha), limit to specific resources
    const allowedClusterSetIds = impersonatingUser ? ['cs-dev'] : null;
    const allowedClusterIds = impersonatingUser ? ['cluster-dev-team-a', 'cluster-dev-team-b'] : 
                                hubClusterOnly ? ['cluster-hub'] : null;
    const allowedNamespaceIds = impersonatingUser ? ['ns-project-starlight-dev', 'ns-project-starlight-dev-b'] : null;

    // If showProjectsOnly is true, show only projects/namespaces from the hub cluster
    // Wrapped under "All projects" parent node
    if (showProjectsOnly && hubClusterOnly) {
      const hubNamespaces = getNamespacesByCluster('cluster-hub')
        .filter(namespace => !allowedNamespaceIds || allowedNamespaceIds.includes(namespace.id));
      
      const projectNodes = hubNamespaces
        .map(namespace => {
          const vmsInNamespace = getVirtualMachinesByNamespace(namespace.id);
          
          return {
            namespace,
            vmsInNamespace,
            node: {
              name: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ProjectDiagramIcon />
                    <span>{namespace.name}</span>
                  </span>
                  <Label isCompact color="grey" style={{ flexShrink: 0 }}>{vmsInNamespace.length}</Label>
                </div>
              ),
              id: `namespace-${namespace.id}`,
              defaultExpanded: false,
              children: vmsInNamespace.map(vm => ({
                name: vm.name,
                id: `vm-${vm.id}`,
              })),
            }
          };
        })
        // Filter out projects with 0 VMs if toggle is enabled
        .filter(item => !showOnlyWithVMs || item.vmsInNamespace.length > 0)
        .map(item => item.node);

      // Count total VMs across all visible projects
      const totalVMs = projectNodes.reduce((sum, node) => {
        return sum + (node.children?.length || 0);
      }, 0);

      // Wrap all projects under "All projects" parent node
      return [{
        name: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <CubesIcon />
              <span>All projects</span>
            </span>
            <Label isCompact color="grey" style={{ flexShrink: 0 }}>{totalVMs}</Label>
          </div>
        ),
        id: 'all-projects-hub',
        defaultExpanded: true,
        children: projectNodes,
      }];
    }

    // Build cluster set nodes for Fleet virtualization
    const clusterSetNodes = dbClusterSets
      .filter(clusterSet => !allowedClusterSetIds || allowedClusterSetIds.includes(clusterSet.id))
      .map(clusterSet => {
        const clustersInSet = getClustersByClusterSet(clusterSet.id)
          .filter(cluster => !allowedClusterIds || allowedClusterIds.includes(cluster.id));
        
        return {
          name: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MulticlusterIcon />
              <span>{clusterSet.name}</span>
            </span>
          ),
          id: `clusterset-${clusterSet.id}`,
          children: clustersInSet.map(cluster => {
            const namespacesInCluster = getNamespacesByCluster(cluster.id)
              .filter(namespace => !allowedNamespaceIds || allowedNamespaceIds.includes(namespace.id))
              // Filter out projects with 0 VMs if toggle is enabled
              .filter(namespace => {
                if (!showOnlyWithVMs) return true;
                const vmsInNamespace = getVirtualMachinesByNamespace(namespace.id);
                return vmsInNamespace.length > 0;
              });
            
            return {
              name: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ServerIcon />
                  <span>{cluster.name}</span>
                </span>
              ),
              id: `cluster-${cluster.id}`,
              children: namespacesInCluster.map(namespace => {
                const vmsInNamespace = getVirtualMachinesByNamespace(namespace.id);
                
                return {
                  name: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ProjectDiagramIcon />
                        <span>{namespace.name}</span>
                      </span>
                      <Label isCompact color="grey" style={{ flexShrink: 0 }}>{vmsInNamespace.length}</Label>
                    </div>
                  ),
                  id: `namespace-${namespace.id}`,
                  defaultExpanded: false,
                  children: vmsInNamespace.map(vm => ({
                    name: vm.name,
                    id: `vm-${vm.id}`,
                  })),
                };
              }),
            };
          }),
        };
      });

    // Calculate total VMs across all cluster sets
    const totalVMsInClusterSets = clusterSetNodes.reduce((total, clusterSetNode) => {
      return total + (clusterSetNode.children?.reduce((clusterTotal, clusterNode) => {
        return clusterTotal + (clusterNode.children?.reduce((namespaceTotal, namespaceNode) => {
          return namespaceTotal + (namespaceNode.children?.length || 0);
        }, 0) || 0);
      }, 0) || 0);
    }, 0);

    // Wrap all cluster sets under "All cluster sets" parent node
    return [{
      name: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <MulticlusterIcon />
            <span>All cluster sets</span>
          </span>
          <Label isCompact color="grey" style={{ flexShrink: 0 }}>{totalVMsInClusterSets}</Label>
        </div>
      ),
      id: 'all-cluster-sets',
      defaultExpanded: true,
      children: clusterSetNodes,
    }];
  }, [dbClusterSets, impersonatingUser, hubClusterOnly, showProjectsOnly, showOnlyWithVMs]);
  
  const sidebar = (
    <div 
      ref={sidebarRef}
      className="vm-sidebar" 
      style={{ width: `${sidebarWidth}px`, minWidth: '200px', maxWidth: '600px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Switch
          id="show-vms-only"
          label="Show only projects with VirtualMachines"
          isChecked={showOnlyWithVMs}
          onChange={(_event, checked) => setShowOnlyWithVMs(checked)}
        />
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Header above tree view */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '8px 0',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tooltip content={isTreeExpanded ? 'Collapse all' : 'Expand all'}>
            <Button
              variant="plain"
              aria-label={isTreeExpanded ? 'Collapse all' : 'Expand all'}
              onClick={() => setIsTreeExpanded(!isTreeExpanded)}
              style={{ padding: '4px' }}
            >
              {isTreeExpanded ? <AngleDoubleUpIcon /> : <AngleDoubleDownIcon />}
            </Button>
          </Tooltip>
          <span style={{ fontWeight: 500 }}>Projects</span>
        </div>
        <Button 
          variant="link" 
          icon={<PlusCircleIcon />}
          iconPosition="start"
          onClick={() => {
            // TODO: Open create project modal/wizard
            console.log('Create project clicked');
          }}
        >
          Create project
        </Button>
      </div>

      <TreeView
        data={treeData}
        allExpanded={isTreeExpanded}
        hasGuides
        onSelect={(_event, item) => {
          if (item.id) {
            setSelectedTreeNode(item.id);
            setPage(1); // Reset to first page when changing selection
          }
        }}
      />
      
      <div
        className="sidebar-resize-handle"
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '5px',
          cursor: 'col-resize',
        }}
      >
        <div
          className="resize-grip"
          style={{
            position: 'absolute',
            right: '-2px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '60px',
            cursor: 'col-resize',
          }}
        />
      </div>
    </div>
  );
  
  return (
    <>
      <Modal
        variant={ModalVariant.medium}
        title="Manage columns"
        isOpen={isManageColumnsOpen}
        onClose={() => setIsManageColumnsOpen(false)}
      >
        <div style={{ padding: '24px' }}>
          <Content component="p" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            Selected columns will appear in the table.
          </Content>

          <Alert
            variant="info"
            isInline
            title={
              <div>
                <div>You can select up to 8 columns</div>
                <div style={{ marginTop: '4px' }}>The namespace column is only shown when in "All projects"</div>
              </div>
            }
            style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
          />

          <Grid hasGutter span={6}>
          <GridItem span={6}>
            <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
              Default VirtualMachine columns
            </Title>
            <Form>
              <Checkbox
                id="column-name"
                label="Name"
                isChecked={selectedColumns.name}
                onChange={() => handleToggleColumn('name')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-namespace"
                label="Namespace"
                isChecked={selectedColumns.namespace}
                onChange={() => handleToggleColumn('namespace')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-status"
                label="Status"
                isChecked={selectedColumns.status}
                onChange={() => handleToggleColumn('status')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-conditions"
                label="Conditions"
                isChecked={selectedColumns.conditions}
                onChange={() => handleToggleColumn('conditions')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-node"
                label="Node"
                isChecked={selectedColumns.node}
                onChange={() => handleToggleColumn('node')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-ipAddress"
                label="IP address"
                isChecked={selectedColumns.ipAddress}
                onChange={() => handleToggleColumn('ipAddress')}
              />
            </Form>
          </GridItem>

          <GridItem span={6}>
            <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
              Additional columns
            </Title>
            <Form>
              <Checkbox
                id="column-created"
                label="Created"
                isChecked={selectedColumns.created}
                onChange={() => handleToggleColumn('created')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-memory"
                label="Memory"
                isChecked={selectedColumns.memory}
                onChange={() => handleToggleColumn('memory')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-cpu"
                label="CPU"
                isChecked={selectedColumns.cpu}
                onChange={() => handleToggleColumn('cpu')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-network"
                label="Network"
                isChecked={selectedColumns.network}
                onChange={() => handleToggleColumn('network')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-deletionProtection"
                label="Deletion protection"
                isChecked={selectedColumns.deletionProtection}
                onChange={() => handleToggleColumn('deletionProtection')}
                style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}
              />
              <Checkbox
                id="column-storageClass"
                label="Storage class"
                isChecked={selectedColumns.storageClass}
                onChange={() => handleToggleColumn('storageClass')}
              />
            </Form>
          </GridItem>
        </Grid>

        <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)', display: 'flex', gap: 'var(--pf-t--global--spacer--sm)' }}>
          <Button key="save" variant="primary" onClick={handleSaveColumns}>
            Save
          </Button>
          <Button key="restore" variant="secondary" onClick={handleRestoreDefaultColumns}>
            Restore default columns
          </Button>
          <Button key="cancel" variant="link" onClick={() => setIsManageColumnsOpen(false)}>
            Cancel
          </Button>
        </div>
        </div>
      </Modal>

      <div className="vm-page">
        <div className="vm-header">
        <div style={{ padding: '24px' }}>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }} flexWrap={{ default: 'nowrap' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">Virtual machines</Title>
            </FlexItem>
            <FlexItem flex={{ default: 'flex_1' }}>
              <div style={{ position: 'relative' }}>
                <div ref={searchInputRef}>
                  <SearchInput
                    placeholder="Search VirtualMachines"
                    value={sidebarSearch}
                    onChange={(_event, value) => {
                      setSidebarSearch(value);
                      setIsSearchMenuOpen(value.length > 0);
                    }}
                    onClear={() => {
                      setSidebarSearch('');
                      setIsSearchMenuOpen(false);
                    }}
                    onFocus={() => sidebarSearch.length > 0 && setIsSearchMenuOpen(true)}
                  />
                </div>
                {isSearchMenuOpen && (
                  <div
                    className="search-dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      zIndex: 1000,
                    }}
                  >
                    <Menu>
                      <MenuContent>
                        <MenuList>
                          {vmSearchSuggestions
                            .filter(vm => vm.toLowerCase().includes(sidebarSearch.toLowerCase()))
                            .map((vm, index) => (
                              <MenuItem 
                                key={index}
                                onClick={() => {
                                  setSidebarSearch(vm);
                                  setIsSearchMenuOpen(false);
                                }}
                              >
                                <span>
                                  <span style={{ color: 'var(--pf-t--global--color--brand--default)', fontWeight: 600 }}>
                                    {vm.substring(0, sidebarSearch.length)}
                                  </span>
                                  {vm.substring(sidebarSearch.length)}
                                </span>
                              </MenuItem>
                            ))}
                          <Divider />
                          <MenuItem isDisabled>
                            <strong>Related suggestions</strong>
                          </MenuItem>
                          <MenuItem onClick={() => setIsSearchMenuOpen(false)}>
                            Label <Label color="blue" isCompact>(3)</Label>
                          </MenuItem>
                          <MenuItem onClick={() => setIsSearchMenuOpen(false)}>
                            IP <Label color="blue" isCompact>(2)</Label>
                          </MenuItem>
                          <Divider />
                          <MenuItem>
                            <Flex spaceItems={{ default: 'spaceItemsMd' }} style={{ width: '100%', padding: '8px 0' }}>
                              <FlexItem>
                                <Button variant="primary" size="sm" onClick={() => setIsSearchMenuOpen(false)}>Search</Button>
                              </FlexItem>
                              <FlexItem>
                                <Button variant="secondary" size="sm" onClick={() => setIsSearchMenuOpen(false)}>
                                  <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512" style={{ marginRight: '8px' }}>
                                    <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/>
                                  </svg>
                                  Advanced search
                                </Button>
                              </FlexItem>
                            </Flex>
                          </MenuItem>
                        </MenuList>
                      </MenuContent>
                    </Menu>
                  </div>
                )}
              </div>
            </FlexItem>
            <FlexItem>
              <Button 
                variant="control" 
                aria-label="Filter"
                style={{
                  border: '0.5px solid var(--pf-t--global--border--color--default)',
                  padding: '0.5rem',
                  minWidth: '36px',
                  height: '36px'
                }}
              >
                <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512">
                  <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/>
                </svg>
              </Button>
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" isDisabled>Save search</Button>
            </FlexItem>
            <FlexItem>
              <Dropdown
                isOpen={isActionsOpen}
                onSelect={() => setIsActionsOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle 
                    ref={toggleRef} 
                    onClick={() => setIsActionsOpen(!isActionsOpen)}
                    isExpanded={isActionsOpen}
                    variant="secondary"
                  >
                    Saved searches
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="search1">Search 1</DropdownItem>
                  <DropdownItem key="search2">Search 2</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
            <FlexItem>
              <Divider orientation={{ default: 'vertical' }} />
            </FlexItem>
            <FlexItem>
              <Dropdown
                isOpen={isCreateOpen}
                onSelect={() => setIsCreateOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsCreateOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle 
                    ref={toggleRef} 
                    onClick={() => setIsCreateOpen(!isCreateOpen)}
                    isExpanded={isCreateOpen}
                    variant="primary"
                  >
                    Create
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="from-template">From template</DropdownItem>
                  <DropdownItem key="from-yaml">From YAML</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
          </Flex>
        </div>
      </div>
      
      <div className={`vm-content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {!isSidebarCollapsed && sidebar}
        
        <Button
          variant="plain"
          className="sidebar-toggle"
          style={{ left: isSidebarCollapsed ? '-14px' : `${sidebarWidth - 14}px` }}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <AngleRightIcon /> : <AngleLeftIcon />}
        </Button>
        
        <div className="vm-main-content">
          <Breadcrumb style={{ marginBottom: '16px' }}>
            <BreadcrumbItem to="#">All clusters</BreadcrumbItem>
            <BreadcrumbItem to="#">Cluster: hub</BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>Project: default</BreadcrumbItem>
          </Breadcrumb>

          <Card style={{ marginBottom: '16px' }}>
            <CardBody>
              <ExpandableSection toggleText="Summary" isExpanded={true}>
                <Flex style={{ marginTop: '16px' }}>
                  <FlexItem flex={{ default: 'flex_1' }} style={{ paddingRight: '24px' }}>
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>Virtual Machines ({allVMs.length})</Title>
                      </FlexItem>
                      <FlexItem>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                          <FlexItem>
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <ExclamationCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)', fontSize: '16px' }} />
                                </FlexItem>
                                <FlexItem style={{ fontSize: '24px' }}>{vmStatusCounts.Error}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Error</FlexItem>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <SyncAltIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)', fontSize: '16px' }} />
                                </FlexItem>
                                <FlexItem style={{ fontSize: '24px' }}>{vmStatusCounts.Running}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Running</FlexItem>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <OffIcon style={{ color: 'var(--pf-t--global--icon--color--regular)', fontSize: '16px' }} />
                                </FlexItem>
                                <FlexItem style={{ fontSize: '24px' }}>{vmStatusCounts.Stopped}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Stopped</FlexItem>
                            </Flex>
                          </FlexItem>
                          <FlexItem>
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <PauseCircleIcon style={{ color: 'var(--pf-t--global--icon--color--regular)', fontSize: '16px' }} />
                                </FlexItem>
                                <FlexItem style={{ fontSize: '24px' }}>{vmStatusCounts.Paused}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Paused</FlexItem>
                            </Flex>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                  
                  <Divider orientation={{ default: 'vertical' }} style={{ margin: '0 24px' }} />
                  
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>Usage</Title>
                      </FlexItem>
                      <FlexItem>
                        <Grid>
                          <GridItem span={4}>
                            <Flex direction={{ default: 'column' }}>
                              <FlexItem style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>CPU</FlexItem>
                              <FlexItem style={{ fontSize: '16px' }}>-</FlexItem>
                              <FlexItem style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '4px' }}>Requested of -</FlexItem>
                            </Flex>
                          </GridItem>
                          <GridItem span={4}>
                            <Flex direction={{ default: 'column' }}>
                              <FlexItem style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Memory</FlexItem>
                              <FlexItem style={{ fontSize: '16px' }}>0 B</FlexItem>
                              <FlexItem style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '4px' }}>Used of 0 B</FlexItem>
                            </Flex>
                          </GridItem>
                          <GridItem span={4}>
                            <Flex direction={{ default: 'column' }}>
                              <FlexItem style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Storage</FlexItem>
                              <FlexItem style={{ fontSize: '16px' }}>0 B</FlexItem>
                              <FlexItem style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '4px' }}>Used of 0 B</FlexItem>
                            </Flex>
                          </GridItem>
                        </Grid>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
              </ExpandableSection>
            </CardBody>
          </Card>
          
          <div className="table-content-card">
            <Toolbar>
              <ToolbarContent style={{ gap: '8px' }}>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isBulkSelectOpen}
                    onSelect={() => {}}
                    onOpenChange={(isOpen: boolean) => setIsBulkSelectOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsBulkSelectOpen(!isBulkSelectOpen)}
                        isExpanded={isBulkSelectOpen}
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
                              id="select-all-vms-checkbox"
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
                        Select page ({filteredVMs.slice((page - 1) * perPage, page * perPage).length} items)
                      </DropdownItem>
                      <DropdownItem key="select-all" onClick={handleSelectAll}>
                        Select all ({filteredVMs.length} items)
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isStatusFilterOpen}
                    onSelect={() => setIsStatusFilterOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsStatusFilterOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                        isExpanded={isStatusFilterOpen}
                        variant="default"
                      >
                        Status: {statusFilter}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      {availableStatuses.map(status => (
                        <DropdownItem 
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setIsStatusFilterOpen(false);
                          }}
                        >
                          {status}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isOSFilterOpen}
                    onSelect={() => setIsOSFilterOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsOSFilterOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsOSFilterOpen(!isOSFilterOpen)}
                        isExpanded={isOSFilterOpen}
                        variant="default"
                      >
                        Operating system: {osFilter}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      {availableOSs.map(os => (
                        <DropdownItem 
                          key={os}
                          onClick={() => {
                            setOSFilter(os);
                            setIsOSFilterOpen(false);
                          }}
                        >
                          {os}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <SearchInput
                    placeholder="Search by name"
                    value={searchValue}
                    onChange={(_event, value) => setSearchValue(value)}
                    onClear={() => setSearchValue('')}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    isOpen={isToolbarActionsOpen}
                    onSelect={() => {
                      if (!isMigrateMenuOpen) {
                        setIsToolbarActionsOpen(false);
                      }
                    }}
                    onOpenChange={(isOpen: boolean) => {
                      console.log('[Toolbar Actions] onOpenChange:', isOpen);
                      setIsToolbarActionsOpen(isOpen);
                      if (!isOpen) {
                        setIsMigrateMenuOpen(false);
                      }
                    }}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => {
                          console.log('[Toolbar Actions] Toggle clicked, current state:', isToolbarActionsOpen, 'selected VMs:', selectedVMs.length);
                          setIsToolbarActionsOpen(!isToolbarActionsOpen);
                        }}
                        isExpanded={isToolbarActionsOpen}
                        variant="secondary"
                        isDisabled={selectedVMs.length === 0}
                      >
                        Actions
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="start" onClick={() => console.log('Start VMs')}>
                        Start
                      </DropdownItem>
                      <DropdownItem key="restart" onClick={() => console.log('Restart VMs')}>
                        Restart
                      </DropdownItem>
                      <DropdownItem key="pause" onClick={() => console.log('Pause VMs')}>
                        Pause
                      </DropdownItem>
                      <Divider key="divider-1" />
                      <DropdownItem 
                        key="migrate"
                        description="Migrate VirtualMachines"
                        onMouseEnter={(e) => {
                          console.log('[Migrate] Mouse entered');
                          const target = e.currentTarget as HTMLElement;
                          const rect = target.getBoundingClientRect();
                          console.log('[Migrate] Position:', rect);
                          setMigrateMenuPosition({
                            top: rect.top,
                            left: rect.right
                          });
                          setIsMigrateMenuOpen(true);
                        }}
                        onMouseLeave={(e) => {
                          console.log('[Migrate] Mouse left');
                          // Small delay to allow moving to flyout menu
                          setTimeout(() => {
                            const flyout = document.querySelector('.migrate-flyout-menu:hover');
                            if (!flyout) {
                              setIsMigrateMenuOpen(false);
                              setMigrateMenuPosition(null);
                            }
                          }, 100);
                        }}
                        style={{ position: 'relative', overflow: 'visible' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span>Migrate</span>
                          <AngleRightIcon />
                        </div>
                      </DropdownItem>
                      <Divider key="divider-2" />
                      <DropdownItem key="edit" onClick={() => console.log('Edit VMs')}>
                        Edit
                      </DropdownItem>
                      <DropdownItem key="view-related" onClick={() => console.log('View related resources')}>
                        View related resources
                      </DropdownItem>
                      <DropdownItem key="delete" onClick={() => console.log('Delete VMs')}>
                        Delete
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                  {isMigrateMenuOpen && migrateMenuPosition && (
                    <div 
                      className="migrate-flyout-menu"
                      style={{
                        position: 'fixed',
                        top: `${migrateMenuPosition.top}px`,
                        left: `${migrateMenuPosition.left}px`,
                        zIndex: 10001,
                        backgroundColor: 'white',
                        boxShadow: 'var(--pf-t--global--box-shadow--lg)',
                        borderRadius: '4px',
                        minWidth: '300px',
                      }}
                      onMouseEnter={() => {
                        console.log('[Flyout] Mouse entered flyout');
                        setIsMigrateMenuOpen(true);
                      }}
                      onMouseLeave={() => {
                        console.log('[Flyout] Mouse left flyout');
                        setIsMigrateMenuOpen(false);
                        setMigrateMenuPosition(null);
                      }}
                    >
                      <Menu>
                        <MenuContent>
                          <MenuList>
                            <MenuItem
                              onClick={() => {
                                console.log('Migrate across clusters');
                                setIsMigrateWizardOpen(true);
                                setIsToolbarActionsOpen(false);
                                setIsMigrateMenuOpen(false);
                              }}
                              description="Migrate VirtualMachines across your clusters"
                            >
                              Migrate across clusters
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                console.log('Migrate compute');
                                setIsToolbarActionsOpen(false);
                                setIsMigrateMenuOpen(false);
                              }}
                              description="Migrate VirtualMachines to a different node"
                            >
                              Compute
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                console.log('Migrate storage');
                                setIsToolbarActionsOpen(false);
                                setIsMigrateMenuOpen(false);
                              }}
                              description="Migrate Storage to a different StorageClass"
                            >
                              Storage
                            </MenuItem>
                          </MenuList>
                        </MenuContent>
                      </Menu>
                    </div>
                  )}
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    variant="plain"
                    aria-label="Manage columns"
                    style={{ marginLeft: '8px' }}
                    onClick={() => setIsManageColumnsOpen(true)}
                  >
                    <ColumnsIcon />
                  </Button>
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pagination
                      itemCount={filteredVMs.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={onSetPage}
                      onPerPageSelect={onPerPageSelect}
                      variant={PaginationVariant.top}
                      isCompact
                    />
                    <span style={{ whiteSpace: 'nowrap', color: 'var(--pf-t--global--text--color--regular)' }}>
                      Last updated: {refreshMode === 'auto' ? 'Live' : '13 minutes ago'}
                    </span>
                    <Dropdown
                      isOpen={isRefreshDropdownOpen}
                      onSelect={() => setIsRefreshDropdownOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsRefreshDropdownOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsRefreshDropdownOpen(!isRefreshDropdownOpen)}
                          isExpanded={isRefreshDropdownOpen}
                          variant="default"
                          aria-label="Refresh settings"
                          icon={refreshMode === 'auto' ? <SyncAltIcon /> : <RedoIcon />}
                        >
                        </MenuToggle>
                      )}
                      popperProps={{ position: 'right' }}
                    >
                      <DropdownList>
                        <DropdownItem
                          key="manual"
                          onClick={() => setRefreshMode('manual')}
                          description="New data only adds when you click to refresh the page."
                        >
                          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem>
                              <RedoIcon />
                            </FlexItem>
                            <FlexItem>Manual refresh</FlexItem>
                          </Flex>
                        </DropdownItem>
                        <DropdownItem
                          key="auto"
                          onClick={() => setRefreshMode('auto')}
                          description="Keeps your data updated automatically. This setting changes to manual refresh after 10 minutes of inactivity."
                        >
                          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem>
                              <SyncAltIcon />
                            </FlexItem>
                            <FlexItem>Auto refresh</FlexItem>
                            {refreshMode === 'auto' && (
                              <FlexItem>
                                <CheckIcon color="var(--pf-t--global--color--brand--default)" />
                              </FlexItem>
                            )}
                          </Flex>
                        </DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </div>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            
            <Table aria-label="Virtual machines table" variant="compact">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Name</Th>
                  <Th>Status</Th>
                  <Th>CPU usage</Th>
                  <Th>Memory usage</Th>
                  <Th>Disk usage</Th>
                  <Th>IP address</Th>
                  <Th>Labels</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredVMs.slice((page - 1) * perPage, page * perPage).map((vm) => (
                  <Tr key={vm.id}>
                    <Td>
                      <Checkbox
                        id={`select-vm-${vm.id}`}
                        aria-label={`Select ${vm.name}`}
                        isChecked={selectedVMs.includes(vm.id)}
                        onChange={(_event, checked) => handleSelectVM(vm.id, checked)}
                      />
                    </Td>
                    <Td dataLabel="Name">{vm.name}</Td>
                    <Td dataLabel="Status">
                      <Label color={vm.status === 'Running' ? 'green' : vm.status === 'Error' ? 'red' : 'grey'}>
                        {vm.status}
                      </Label>
                    </Td>
                    <Td dataLabel="CPU usage">{vm.cpu}</Td>
                    <Td dataLabel="Memory usage">{vm.memory}</Td>
                    <Td dataLabel="Disk usage">{vm.disk}</Td>
                    <Td dataLabel="IP address">{vm.ip}</Td>
                    <Td dataLabel="Labels">
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        {vm.labels.slice(0, 2).map((label, idx) => (
                          <FlexItem key={idx}>
                            <Label>{label}</Label>
                          </FlexItem>
                        ))}
                        {vm.moreLabels > 0 && (
                          <FlexItem>
                            <Label>{vm.moreLabels} more</Label>
                          </FlexItem>
                        )}
                      </Flex>
                    </Td>
                    <Td isActionCell style={{ textAlign: 'right', position: 'relative' }}>
                      <Dropdown
                        isOpen={openRowMenuId === vm.id}
                        onSelect={() => {
                          if (!openRowMigrateMenuId) {
                            setOpenRowMenuId(null);
                          }
                        }}
                        onOpenChange={(isOpen: boolean) => {
                          if (!isOpen) {
                            setOpenRowMenuId(null);
                            setOpenRowMigrateMenuId(null);
                          }
                        }}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            aria-label="Row actions menu"
                            variant="plain"
                            onClick={() => toggleRowMenu(vm.id)}
                            isExpanded={openRowMenuId === vm.id}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                        shouldFocusToggleOnSelect
                        popperProps={{
                          position: 'right',
                          enableFlip: true,
                        }}
                      >
                        <DropdownList>
                          <DropdownItem key="start" onClick={() => console.log('Start', vm.name)}>
                            Start
                          </DropdownItem>
                          <DropdownItem key="restart" onClick={() => console.log('Restart', vm.name)}>
                            Restart
                          </DropdownItem>
                          <DropdownItem key="pause" onClick={() => console.log('Pause', vm.name)}>
                            Pause
                          </DropdownItem>
                          <Divider key="divider-1" />
                          <DropdownItem 
                            key="migrate"
                            description="Migrate VirtualMachine"
                            onMouseEnter={(e) => {
                              const target = e.currentTarget as HTMLElement;
                              const rect = target.getBoundingClientRect();
                              setRowMigrateMenuPosition({
                                top: rect.top,
                                left: rect.left - 300 // Position to the left, 300px is the flyout width
                              });
                              setOpenRowMigrateMenuId(vm.id);
                            }}
                            onMouseLeave={() => {
                              setTimeout(() => {
                                const flyout = document.querySelector('.migrate-row-flyout-menu:hover');
                                if (!flyout) {
                                  setOpenRowMigrateMenuId(null);
                                  setRowMigrateMenuPosition(null);
                                }
                              }, 100);
                            }}
                            style={{ position: 'relative', overflow: 'visible' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <span>Migrate</span>
                              <AngleRightIcon />
                            </div>
                          </DropdownItem>
                          <Divider key="divider-2" />
                          <DropdownItem key="edit" onClick={() => console.log('Edit', vm.name)}>
                            Edit
                          </DropdownItem>
                          <DropdownItem key="view-related" onClick={() => console.log('View related resources', vm.name)}>
                            View related resources
                          </DropdownItem>
                          <DropdownItem key="delete" onClick={() => console.log('Delete', vm.name)}>
                            Delete
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                      {openRowMigrateMenuId === vm.id && rowMigrateMenuPosition && (
                        <div 
                          className="migrate-row-flyout-menu"
                          style={{
                            position: 'fixed',
                            top: `${rowMigrateMenuPosition.top}px`,
                            left: `${rowMigrateMenuPosition.left}px`,
                            zIndex: 10001,
                            backgroundColor: 'white',
                            boxShadow: 'var(--pf-t--global--box-shadow--lg)',
                            borderRadius: '4px',
                            minWidth: '300px',
                          }}
                          onMouseEnter={() => {
                            setOpenRowMigrateMenuId(vm.id);
                          }}
                          onMouseLeave={() => {
                            setOpenRowMigrateMenuId(null);
                            setRowMigrateMenuPosition(null);
                          }}
                        >
                          <Menu>
                            <MenuContent>
                              <MenuList>
                                <MenuItem
                                  onClick={() => handleRowMigrateVM(vm.id)}
                                  description="Migrate VirtualMachine across your clusters"
                                >
                                  Migrate across clusters
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    console.log('Migrate compute', vm.name);
                                    setOpenRowMenuId(null);
                                    setOpenRowMigrateMenuId(null);
                                  }}
                                  description="Migrate VirtualMachine to a different node"
                                >
                                  Migrate compute
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    console.log('Migrate storage', vm.name);
                                    setOpenRowMenuId(null);
                                    setOpenRowMigrateMenuId(null);
                                  }}
                                  description="Migrate VirtualMachine storage"
                                >
                                  Migrate storage
                                </MenuItem>
                              </MenuList>
                            </MenuContent>
                          </Menu>
                        </div>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={filteredVMs.length}
                    perPage={perPage}
                    page={page}
                    onSetPage={onSetPage}
                    onPerPageSelect={onPerPageSelect}
                    variant={PaginationVariant.bottom}
                    perPageOptions={[
                      { title: '10', value: 10 },
                      { title: '20', value: 20 },
                      { title: '50', value: 50 },
                    ]}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </div>
        </div>
      </div>
    </div>

    <MigrateVMsWizard
      isOpen={isMigrateWizardOpen}
      onClose={() => setIsMigrateWizardOpen(false)}
      selectedVMs={selectedVMs}
    />
    </>
  );
};

export { VirtualMachines };

