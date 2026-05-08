import * as React from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
  Select,
  SelectOption,
  SelectList,
  TextArea,
  TextInput,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  LabelGroup,
  Popover,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { FilterIcon, EllipsisVIcon, CogIcon, AngleLeftIcon, AngleRightIcon, SyncAltIcon, RedoIcon, CheckIcon, PlusCircleIcon, ColumnsIcon, ServerIcon, ProjectDiagramIcon, ExclamationCircleIcon, OffIcon, PauseCircleIcon, MulticlusterIcon, CubesIcon, AngleDoubleDownIcon, AngleDoubleUpIcon, CaretDownIcon, DesktopIcon, CheckCircleIcon, ExternalLinkAltIcon, QuestionCircleIcon, InProgressIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import './VirtualMachines.css';
import { getAllClusterSets, getClustersByClusterSet, getNamespacesByCluster, getVirtualMachinesByNamespace, getVirtualMachinesByCluster, getVirtualMachinesByClusterSet, getAllVirtualMachines, getAllNamespaces, getAllClusters, getVirtualMachineById, getNamespaceById, getClusterById } from '@app/data';
import { MigrateVMsWizard } from './MigrateVMsWizard';
import { CloneVMsWizard } from './CloneVMsWizard';
import { VirtualMachineDetail } from './VirtualMachineDetail';
import { useImpersonation } from '@app/shared/contexts/ImpersonationContext';
import { VirtualMachine } from '@app/data/schemas/virtualization';

// GLOBAL variable for clone mode (outside React to avoid timing issues)
let globalIsCloneMode = false;

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

// Helper function to get VMs from multiple selected projects
const getVMsForMultipleProjects = (projectIds: string[], impersonatingUser: string | null): VirtualMachine[] => {
  const allowedNamespaceIds = impersonatingUser ? ['ns-project-starlight-dev', 'ns-project-starlight-dev-b'] : null;
  
  let vms: VirtualMachine[] = [];
  projectIds.forEach(projectId => {
    const projectVMs = getVirtualMachinesByNamespace(projectId);
    vms.push(...projectVMs);
  });
  
  // Filter VMs based on impersonation context
  if (allowedNamespaceIds) {
    vms = vms.filter(vm => allowedNamespaceIds.includes(vm.namespaceId));
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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on a detail page
  const isDetailPage = location.pathname.includes('/virtual-machines/') && location.pathname.split('/').length > 3;
  
  const [searchValue, setSearchValue] = React.useState('');
  const [sidebarSearch, setSidebarSearch] = React.useState('');
  const [showOnlyWithVMs, setShowOnlyWithVMs] = React.useState(true);
  const [isTreeExpanded, setIsTreeExpanded] = React.useState(true);
  const [expandedNodes, setExpandedNodes] = React.useState<string[]>([]);
  const [treeKey, setTreeKey] = React.useState(0);
  const [selectedVMs, setSelectedVMs] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(420);
  const [isResizing, setIsResizing] = React.useState(false);
  const [selectedTreeNode, setSelectedTreeNode] = React.useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = React.useState<string[]>([]); // Multi-select for projects
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
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = React.useState(false);
  
  // Create project form state
  const [projectName, setProjectName] = React.useState('');
  const [projectCluster, setProjectCluster] = React.useState('');
  const [projectDisplayName, setProjectDisplayName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [isClusterDropdownOpen, setIsClusterDropdownOpen] = React.useState(false);
  const [clusterSearchValue, setClusterSearchValue] = React.useState('');

  // Add Escape key handler to deselect VMs
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedVMs.length > 0) {
        setSelectedVMs([]);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedVMs]);
  
  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string>('All');
  const [osFilter, setOSFilter] = React.useState<string>('All');
  
  const [selectedCluster, setSelectedCluster] = React.useState('test');
  
  // Summary card expand/collapse state
  const [isSummaryExpanded, setIsSummaryExpanded] = React.useState(true);
  
  // Manage columns modal state
  const [isManageColumnsOpen, setIsManageColumnsOpen] = React.useState(false);
  const [isMigrateWizardOpen, setIsMigrateWizardOpen] = React.useState(false);
  const [isCloneWizardOpen, setIsCloneWizardOpen] = React.useState(false);
  const [isCreateVMWizardOpen, setIsCreateVMWizardOpen] = React.useState(false);
  const [isMigrationInProgress, setIsMigrationInProgress] = React.useState(false);
  const [migratingVMIds, setMigratingVMIds] = React.useState<string[]>([]);
  const [vmUpdateTrigger, setVmUpdateTrigger] = React.useState(0); // Force re-render when VMs change
  const [isCancelMigrationModalOpen, setIsCancelMigrationModalOpen] = React.useState(false);
  const [originalVMLocations, setOriginalVMLocations] = React.useState<Record<string, { clusterId: string; namespaceId: string }>>({});
  const [targetLocation, setTargetLocation] = React.useState<{ clusterId: string; namespaceId: string } | null>(null);
  const [allMigrationsComplete, setAllMigrationsComplete] = React.useState(false);
  const [migrationPopoverVMId, setMigrationPopoverVMId] = React.useState<string | null>(null);
  const [currentMigrationPlanId, setCurrentMigrationPlanId] = React.useState<string | null>(null);
  
  // Sorting state
  const [sortBy, setSortBy] = React.useState<string>('status');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Sort handler - disabled during migration
  const handleSort = (column: string) => {
    // Don't allow sorting during migration
    if (isMigrationInProgress) {
      return;
    }
    
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column with ascending direction
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Debug: Log when clone wizard state changes
  React.useEffect(() => {
    console.log('🔔 isCloneWizardOpen changed to:', isCloneWizardOpen);
  }, [isCloneWizardOpen]);

  // Keep migrated VMs visible until user refreshes the page
  // Don't auto-clear migration state on navigation
  // VMs will remain visible showing their migration status until page reload
  
  // Check if all migrations are complete
  React.useEffect(() => {
    if (isMigrationInProgress && migratingVMIds.length > 0) {
      const allVMs = getAllVirtualMachines();
      const allMigrated = migratingVMIds.every(vmId => {
        const vm = allVMs.find((v: any) => v.id === vmId);
        return vm?.status === 'Migrated';
      });
      
      if (allMigrated && !allMigrationsComplete) {
        setAllMigrationsComplete(true);
        console.log('🎉 All VMs have completed migration!');
      }
    }
  }, [vmUpdateTrigger, migratingVMIds, isMigrationInProgress, allMigrationsComplete]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [vmToDelete, setVmToDelete] = React.useState<string | null>(null);
  const [dropTargetClusterId, setDropTargetClusterId] = React.useState<string | undefined>(undefined);
  const [dropTargetNamespaceId, setDropTargetNamespaceId] = React.useState<string | undefined>(undefined);
  const [isWizardFromDragDrop, setIsWizardFromDragDrop] = React.useState(false);
  const [isDragDropValidationModalOpen, setIsDragDropValidationModalOpen] = React.useState(false);
  const [pendingDragDropAction, setPendingDragDropAction] = React.useState<{
    vmIds: string[];
    targetClusterId: string;
    targetNamespaceId: string;
    isClone: boolean;
  } | null>(null);
  
  // Advanced search form state
  const [advancedSearchName, setAdvancedSearchName] = React.useState('');
  const [advancedSearchCluster, setAdvancedSearchCluster] = React.useState('all');
  const [advancedSearchProject, setAdvancedSearchProject] = React.useState('all');
  const [advancedSearchDescription, setAdvancedSearchDescription] = React.useState('');
  const [advancedSearchStatus, setAdvancedSearchStatus] = React.useState('');
  const [advancedSearchOS, setAdvancedSearchOS] = React.useState('');
  const [advancedSearchVCPUOperator, setAdvancedSearchVCPUOperator] = React.useState('greater');
  const [advancedSearchVCPUValue, setAdvancedSearchVCPUValue] = React.useState('');
  const [advancedSearchMemoryOperator, setAdvancedSearchMemoryOperator] = React.useState('greater');
  const [advancedSearchMemoryValue, setAdvancedSearchMemoryValue] = React.useState('');
  const [advancedSearchMemoryUnit, setAdvancedSearchMemoryUnit] = React.useState('GiB');
  const [advancedSearchStorageClass, setAdvancedSearchStorageClass] = React.useState('');
  const [advancedSearchGPU, setAdvancedSearchGPU] = React.useState(false);
  const [advancedSearchHostDevices, setAdvancedSearchHostDevices] = React.useState(false);
  const [advancedSearchDateCreated, setAdvancedSearchDateCreated] = React.useState('any');
  const [advancedSearchIPAddress, setAdvancedSearchIPAddress] = React.useState('');
  const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(true);
  const [isNetworkExpanded, setIsNetworkExpanded] = React.useState(false);
  
  // Track if advanced search filters are active
  const [isAdvancedSearchActive, setIsAdvancedSearchActive] = React.useState(false);
  
  // Advanced search dropdown states
  const [isAdvSearchClusterOpen, setIsAdvSearchClusterOpen] = React.useState(false);
  const [isAdvSearchProjectOpen, setIsAdvSearchProjectOpen] = React.useState(false);
  const [isAdvSearchStatusOpen, setIsAdvSearchStatusOpen] = React.useState(false);
  const [isAdvSearchOSOpen, setIsAdvSearchOSOpen] = React.useState(false);
  const [isAdvSearchVCPUOpOpen, setIsAdvSearchVCPUOpOpen] = React.useState(false);
  const [isAdvSearchMemoryOpOpen, setIsAdvSearchMemoryOpOpen] = React.useState(false);
  const [isAdvSearchMemoryUnitOpen, setIsAdvSearchMemoryUnitOpen] = React.useState(false);
  const [isAdvSearchStorageOpen, setIsAdvSearchStorageOpen] = React.useState(false);
  const [isAdvSearchDateOpen, setIsAdvSearchDateOpen] = React.useState(false);
  
  const [openRowMenuId, setOpenRowMenuId] = React.useState<string | null>(null);
  const [openRowMigrateMenuId, setOpenRowMigrateMenuId] = React.useState<string | null>(null);
  const [rowMigrateMenuPosition, setRowMigrateMenuPosition] = React.useState<{ top: number; left: number } | null>(null);
  
  // Tree view context menu state
  const [treeContextMenuOpen, setTreeContextMenuOpen] = React.useState<string | null>(null);
  const [treeContextMenuPosition, setTreeContextMenuPosition] = React.useState<{ top: number; left: number } | null>(null);
  
  // Drag and drop state
  const [draggedVMId, setDraggedVMId] = React.useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = React.useState<string | null>(null);
  const [isDragCloneMode, setIsDragCloneMode] = React.useState(false);
  const isDragCloneModeRef = React.useRef(false); // Use ref for immediate access
  const [selectedColumns, setSelectedColumns] = React.useState({
    name: true,
    namespace: false,
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
  
  // Get VMs based on selected tree node or multiple projects and apply filters
  const filteredVMs = React.useMemo(() => {
    // Get VMs from database based on selected tree node or multiple projects
    let vmsFromDB = selectedProjects.length > 0
      ? getVMsForMultipleProjects(selectedProjects, impersonatingUser)
      : getVMsForSelection(selectedTreeNode, impersonatingUser, hubClusterOnly);
    
    // During migration, ensure migrating VMs stay visible in the table
    // VMs remain in their original location showing migration status until page refresh
    if (migratingVMIds.length > 0) {
      const allVMsForMigration = getAllVirtualMachines();
      const migratingVMs = allVMsForMigration.filter(vm => 
        migratingVMIds.includes(vm.id) && 
        !vmsFromDB.some(existingVm => existingVm.id === vm.id)
      );
      vmsFromDB = [...vmsFromDB, ...migratingVMs];
    }
    
    // Transform VMs from database to table format and apply filters
    return vmsFromDB
      .filter(vm => {
        // Apply advanced search filters if active
        if (isAdvancedSearchActive) {
          // Name filter
          if (advancedSearchName && !vm.name.toLowerCase().includes(advancedSearchName.toLowerCase())) {
            return false;
          }
          
          // Cluster filter
          if (advancedSearchCluster !== 'all' && vm.clusterId !== advancedSearchCluster) {
            return false;
          }
          
          // Project filter
          if (advancedSearchProject !== 'all' && vm.namespaceId !== advancedSearchProject) {
            return false;
          }
          
          // Status filter
          if (advancedSearchStatus && vm.status !== advancedSearchStatus) {
            return false;
          }
          
          // OS filter
          if (advancedSearchOS && vm.os !== advancedSearchOS) {
            return false;
          }
          
          // vCPU filter
          if (advancedSearchVCPUValue) {
            const vcpuValue = parseInt(advancedSearchVCPUValue);
            if (advancedSearchVCPUOperator === 'greater' && vm.cpu <= vcpuValue) return false;
            if (advancedSearchVCPUOperator === 'less' && vm.cpu >= vcpuValue) return false;
            if (advancedSearchVCPUOperator === 'equals' && vm.cpu !== vcpuValue) return false;
          }
          
          // Memory filter
          if (advancedSearchMemoryValue) {
            const memoryValue = parseInt(advancedSearchMemoryValue);
            const vmMemory = parseInt(vm.memory);
            if (advancedSearchMemoryOperator === 'greater' && vmMemory <= memoryValue) return false;
            if (advancedSearchMemoryOperator === 'less' && vmMemory >= memoryValue) return false;
            if (advancedSearchMemoryOperator === 'equals' && vmMemory !== memoryValue) return false;
          }
          
          // IP Address filter
          if (advancedSearchIPAddress && !vm.ipAddress.includes(advancedSearchIPAddress)) {
            return false;
          }
          
          return true;
        }
        
        // Regular filters
        const matchesStatus = statusFilter === 'All' || vm.status === statusFilter;
        const matchesOS = osFilter === 'All' || vm.os === osFilter;
        
        // Enhanced search: searches across name, IP address, cluster, and namespace
        const searchLower = searchValue.toLowerCase();
        const matchesSearch = !searchValue || 
          vm.name.toLowerCase().includes(searchLower) ||
          vm.ipAddress.toLowerCase().includes(searchLower) ||
          vm.clusterId.toLowerCase().includes(searchLower) ||
          vm.namespaceId.toLowerCase().includes(searchLower);
        
        return matchesStatus && matchesOS && matchesSearch;
      })
      .map((vm, index) => {
        // Generate conditions for this VM
        const conditions: string[] = [];
        if (vm.status === 'Running') {
          conditions.push('LiveMigratable=True');
          conditions.push('DataVolumesReady=True');
        } else if (vm.status === 'Starting') {
          conditions.push('DataVolumesReady=True');
        }
        
        // Some VMs don't have node or IP (e.g., when stopped or starting)
        const hasNode = vm.status === 'Running' || vm.status === 'Paused';
        const hasIP = vm.status === 'Running';
        
        // Get cluster, cluster set, and namespace/project names
        const cluster = getAllClusters().find(c => c.id === vm.clusterId);
        const clusterName = cluster?.name || vm.clusterId;
        
        // Find cluster set by checking which cluster set contains this cluster
        const clusterSet = getAllClusterSets().find(cs => 
          getClustersByClusterSet(cs.id).some(c => c.id === vm.clusterId)
        );
        const clusterSetName = clusterSet?.name || '-';
        
        const namespace = getAllNamespaces().find(ns => ns.id === vm.namespaceId);
        const projectName = namespace?.name || vm.namespaceId;
        
        return {
          id: vm.id, // Keep the original VM ID
          originalId: vm.id, // Store for linking
        name: vm.name,
          namespace: vm.namespaceId,
          project: projectName,
          cluster: clusterName,
          clusterSet: clusterSetName,
        status: vm.status,
        os: vm.os,
        cpu: `${vm.cpu} vCPU`,
        memory: `${vm.memory}`,
        disk: `${vm.storage}`,
          ip: hasIP ? vm.ipAddress : undefined,
          node: hasNode ? `worker-node-0${(index % 5) + 1}` : undefined,
          conditions,
          created: vm.created || 'N/A',
          network: 'pod-network',
          deletionProtection: index % 3 === 0,
          storageClass: 'standard',
        labels: ['app:web', 'env:prod'], // Placeholder
        moreLabels: 0,
        };
      });
  }, [
    selectedTreeNode, selectedProjects, statusFilter, osFilter, searchValue, impersonatingUser, hubClusterOnly,
    isAdvancedSearchActive, advancedSearchName, advancedSearchCluster, advancedSearchProject,
    advancedSearchStatus, advancedSearchOS, advancedSearchVCPUValue, advancedSearchVCPUOperator,
    advancedSearchMemoryValue, advancedSearchMemoryOperator, advancedSearchIPAddress, vmUpdateTrigger, migratingVMIds
  ]);

  // Sort VMs based on sortBy and sortDirection
  // During migration, prioritize migrating/pending VMs at the top
  const sortedVMs = React.useMemo(() => {
    // During migration, show migration-related VMs at the top
    // Order: Migrated (completed, stay at top) → Migrating (in progress) → Pending (waiting) → Other
    if (isMigrationInProgress) {
      const sorted = [...filteredVMs].sort((a, b) => {
        const migrationStatusOrder = ['Migrated', 'Migrating', 'Pending'];
        const aIsMigrating = migrationStatusOrder.includes(a.status);
        const bIsMigrating = migrationStatusOrder.includes(b.status);
        
        // Both are migration-related: sort by migration status order
        if (aIsMigrating && bIsMigrating) {
          const aIndex = migrationStatusOrder.indexOf(a.status);
          const bIndex = migrationStatusOrder.indexOf(b.status);
          return aIndex - bIndex;
        }
        
        // Only a is migration-related: a comes first
        if (aIsMigrating) return -1;
        
        // Only b is migration-related: b comes first
        if (bIsMigrating) return 1;
        
        // Neither is migration-related: keep original order
        return 0;
      });
      
      // Debug: Log status distribution during migration
      const statusCounts = sorted.reduce((acc, vm) => {
        acc[vm.status] = (acc[vm.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('📊 VM Status Distribution:', statusCounts);
      
      return sorted;
    }
    
    if (!sortBy) return filteredVMs;
    
    const sorted = [...filteredVMs].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      // Special sorting for status: Running first
      if (sortBy === 'status') {
        const statusOrder = ['Running', 'Starting', 'Migrating', 'Paused', 'Pending', 'Migrated', 'Stopping', 'Stopped', 'Error'];
        const aIndex = statusOrder.indexOf(aValue);
        const bIndex = statusOrder.indexOf(bValue);
        
        if (sortDirection === 'asc') {
          return aIndex - bIndex;
        } else {
          return bIndex - aIndex;
        }
      }
      
      // Default string comparison for other columns
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      return 0;
    });
    
    return sorted;
  }, [filteredVMs, sortBy, sortDirection, isMigrationInProgress, allMigrationsComplete]);

  // Get unique statuses and operating systems for filter options
  const allVMs = React.useMemo(() => {
    return selectedProjects.length > 0
      ? getVMsForMultipleProjects(selectedProjects, impersonatingUser)
      : getVMsForSelection(selectedTreeNode, impersonatingUser, hubClusterOnly);
  }, [selectedTreeNode, selectedProjects, impersonatingUser, hubClusterOnly, vmUpdateTrigger]);
  
  // Determine which context columns to show based on tree selection
  const contextColumns = React.useMemo(() => {
    // Multi-project selection always shows project column
    if (selectedProjects.length > 0) {
      return { showClusterSet: false, showCluster: false, showProject: true };
    }
    if (!selectedTreeNode || selectedTreeNode === 'all-cluster-sets') {
      return { showClusterSet: true, showCluster: true, showProject: true };
    }
    if (selectedTreeNode === 'all-projects-hub') {
      // For Core Platforms "All projects" view, don't show cluster set or cluster
      return { showClusterSet: false, showCluster: false, showProject: false };
    }
    if (selectedTreeNode.startsWith('clusterset-')) {
      return { showClusterSet: false, showCluster: true, showProject: true };
    }
    if (selectedTreeNode.startsWith('cluster-')) {
      return { showClusterSet: false, showCluster: false, showProject: true };
    }
    return { showClusterSet: false, showCluster: false, showProject: false };
  }, [selectedTreeNode, selectedProjects]);
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

  // Get breadcrumb hierarchy from selected tree node
  const breadcrumbHierarchy = React.useMemo(() => {
    // Handle multi-project selection
    if (selectedProjects.length > 1) {
      const namespaces = selectedProjects
        .map(id => getAllNamespaces().find(ns => ns.id === id))
        .filter((ns): ns is NonNullable<typeof ns> => ns !== undefined);
      
      // Find common cluster and cluster set if all projects are from the same cluster
      let commonCluster: ReturnType<typeof getAllClusters>[0] | null = null;
      let commonClusterSet: ReturnType<typeof getAllClusterSets>[0] | null = null;
      let isStandalone = false;
      
      if (namespaces.length > 0 && namespaces[0]) {
        const firstClusterId = namespaces[0].clusterId;
        const allSameCluster = namespaces.every(ns => ns && ns.clusterId === firstClusterId);
        
        if (allSameCluster) {
          commonCluster = getAllClusters().find(c => c.id === firstClusterId) || null;
          if (commonCluster) {
            // Check if it's a standalone cluster (no cluster set or empty clusterSetId)
            if (!commonCluster.clusterSetId || commonCluster.clusterSetId === '') {
              isStandalone = true;
            } else {
              commonClusterSet = getAllClusterSets().find(cs => cs.id === commonCluster!.clusterSetId) || null;
            }
          }
        }
      }
      
      return {
        clusterSet: commonClusterSet,
        cluster: commonCluster,
        namespace: null,
        isAllSelected: false,
        isMultiProject: true,
        selectedNamespaces: namespaces,
        isStandalone
      };
    }
    
    // Handle standalone clusters parent node
    if (selectedTreeNode === 'standalone-clusters') {
      return { 
        clusterSet: null, 
        cluster: null, 
        namespace: null,
        isAllSelected: false,
        isMultiProject: false,
        selectedNamespaces: [],
        isStandalone: true
      };
    }
    
    // Default to "All" when nothing is selected or root is selected
    if (!selectedTreeNode || selectedTreeNode === 'all-cluster-sets') {
      return { 
        clusterSet: null, 
        cluster: null, 
        namespace: null,
        isAllSelected: true,
        isMultiProject: false,
        selectedNamespaces: [],
        isStandalone: false
      };
    }

    const parts = selectedTreeNode.split('-');
    const type = parts[0];
    const id = parts.slice(1).join('-');

    let clusterSet;
    let cluster;
    let namespace;
    let isStandalone = false;

    if (type === 'clusterset') {
      clusterSet = getAllClusterSets().find(cs => cs.id === id);
    } else if (type === 'cluster') {
      cluster = getAllClusters().find(c => c.id === id);
      if (cluster) {
        // Check if it's a standalone cluster (no cluster set or empty clusterSetId)
        if (!cluster.clusterSetId || cluster.clusterSetId === '') {
          isStandalone = true;
        } else {
          clusterSet = getAllClusterSets().find(cs => cs.id === cluster.clusterSetId);
        }
      }
    } else if (type === 'namespace') {
      namespace = getAllNamespaces().find(ns => ns.id === id);
      if (namespace) {
        cluster = getAllClusters().find(c => c.id === namespace.clusterId);
        if (cluster) {
          // Check if it's a standalone cluster (no cluster set or empty clusterSetId)
          if (!cluster.clusterSetId || cluster.clusterSetId === '') {
            isStandalone = true;
          } else {
            clusterSet = getAllClusterSets().find(cs => cs.id === cluster.clusterSetId);
          }
        }
      }
    } else if (type === 'vm') {
      const vm = getAllVirtualMachines().find(v => v.id === id);
      if (vm) {
        namespace = getAllNamespaces().find(ns => ns.id === vm.namespaceId);
        if (namespace) {
          cluster = getAllClusters().find(c => c.id === namespace.clusterId);
          if (cluster) {
            // Check if it's a standalone cluster (no cluster set or empty clusterSetId)
            if (!cluster.clusterSetId || cluster.clusterSetId === '') {
              isStandalone = true;
            } else {
              clusterSet = getAllClusterSets().find(cs => cs.id === cluster.clusterSetId);
            }
          }
        }
      }
    }

    return { clusterSet, cluster, namespace, isAllSelected: false, isMultiProject: false, selectedNamespaces: [], isStandalone };
  }, [selectedTreeNode, selectedProjects]);

  // Handle selecting all VMs
  const handleSelectAllVMs = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedVMs(sortedVMs.map(vm => vm.id));
    } else {
      setSelectedVMs([]);
    }
  };

  // Handle selecting VMs on current page only
  const handleSelectPage = () => {
    const paginatedVMs = sortedVMs.slice((page - 1) * perPage, page * perPage);
    const paginatedIds = paginatedVMs.map(vm => vm.id);
    setSelectedVMs(paginatedIds);
    setIsBulkSelectOpen(false);
  };

  // Handle selecting all filtered VMs
  const handleSelectAll = () => {
    setSelectedVMs(sortedVMs.map(vm => vm.id));
    setIsBulkSelectOpen(false);
  };

  // Handle deselecting all VMs
  const handleDeselectAll = () => {
    setSelectedVMs([]);
    setIsBulkSelectOpen(false);
  };

  // Check if all VMs on current page are selected
  const isAllPageSelected = React.useMemo(() => {
    const paginatedVMs = sortedVMs.slice((page - 1) * perPage, page * perPage);
    return paginatedVMs.length > 0 && paginatedVMs.every(vm => selectedVMs.includes(vm.id));
  }, [sortedVMs, page, perPage, selectedVMs]);

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
      namespace: false,
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

  
  const handleSelectVM = (vmId: string, isSelected: boolean) => {
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
  const toggleRowMenu = (vmId: string) => {
    setOpenRowMenuId(openRowMenuId === vmId ? null : vmId);
    setOpenRowMigrateMenuId(null);
  };

  const handleRowMigrateVM = (vmId: string) => {
    setSelectedVMs([vmId]);
    // Clear drop targets (not from drag-and-drop)
    setDropTargetClusterId(undefined);
    setDropTargetNamespaceId(undefined);
    setIsWizardFromDragDrop(false);
    setIsMigrateWizardOpen(true);
    setOpenRowMenuId(null);
    setOpenRowMigrateMenuId(null);
  };

  // Helper function to validate VMs during drag and drop
  const validateAndOpenWizard = (vmIds: string[], targetClusterId: string, targetNamespaceId: string, isClone: boolean) => {
    console.log('=== validateAndOpenWizard ===');
    console.log('isClone:', isClone);
    console.log('vmIds:', vmIds);
    console.log('Will open:', isClone ? '✨ CLONE WIZARD ✨' : '🔄 MIGRATE WIZARD');
    console.log('============================');
    
    // For clone operations, just open the clone wizard directly without validation
    if (isClone) {
      console.log('🎯 CLONE MODE - Setting up clone wizard...');
      setSelectedVMs(vmIds);
      setDropTargetClusterId(targetClusterId);
      setDropTargetNamespaceId(targetNamespaceId);
      setIsWizardFromDragDrop(true);
      setIsCloneWizardOpen(true);
      console.log('✅ Clone wizard state set - modal should open now!');
      return;
    }
    
    // For migration operations, validate VM status
    // Get VM data
    const vmsData = vmIds
      .map(id => getVirtualMachineById(id))
      .filter((vm): vm is NonNullable<typeof vm> => vm !== null && vm !== undefined);

    // Calculate status counts
    const runningVMs = vmsData.filter(vm => vm.status === 'Running');
    const nonRunningVMs = vmsData.filter(vm => vm.status !== 'Running');

    // Detect multi-project
    const projectsMap: Record<string, { id: string; name: string; vmCount: number }> = {};
    vmsData.forEach(vm => {
      if (!projectsMap[vm.namespaceId]) {
        const namespace = getNamespaceById(vm.namespaceId);
        projectsMap[vm.namespaceId] = {
          id: vm.namespaceId,
          name: namespace?.name || vm.namespaceId,
          vmCount: 0
        };
      }
      projectsMap[vm.namespaceId].vmCount++;
    });
    const isMultiProject = Object.keys(projectsMap).length > 1;

    // Check if we need to show validation modal
    const allStopped = runningVMs.length === 0;
    const someNonRunning = nonRunningVMs.length > 0;

    if (allStopped || someNonRunning || isMultiProject) {
      // Store pending action and show modal
      setPendingDragDropAction({
        vmIds,
        targetClusterId,
        targetNamespaceId,
        isClone
      });
      setIsDragDropValidationModalOpen(true);
    } else {
      // All VMs are running and from single project - proceed directly
      setSelectedVMs(vmIds);
      setDropTargetClusterId(targetClusterId);
      setDropTargetNamespaceId(targetNamespaceId);
      setIsWizardFromDragDrop(true);
      setIsMigrateWizardOpen(true);
    }
  };

  // Handle continuing after validation modal
  const handleContinueAfterValidation = () => {
    if (!pendingDragDropAction) return;

    // Get VM data
    const vmsData = pendingDragDropAction.vmIds
      .map(id => getVirtualMachineById(id))
      .filter((vm): vm is NonNullable<typeof vm> => vm !== null && vm !== undefined);

    // Filter to only running VMs
    const runningVMs = vmsData.filter(vm => vm.status === 'Running');

    if (runningVMs.length > 0) {
      setSelectedVMs(runningVMs.map(vm => vm.id));
      setDropTargetClusterId(pendingDragDropAction.targetClusterId);
      setDropTargetNamespaceId(pendingDragDropAction.targetNamespaceId);
      setIsWizardFromDragDrop(true);
      if (pendingDragDropAction.isClone) {
        setIsCloneWizardOpen(true);
      } else {
        setIsMigrateWizardOpen(true);
      }
    }

    setIsDragDropValidationModalOpen(false);
    setPendingDragDropAction(null);
    setDraggedVMId(null);
    setDropTargetId(null);
    // isDragCloneMode will be reset in drop handler after reading it
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
          const namespaceId = `namespace-${namespace.id}`;
          const isSelected = selectedTreeNode === namespaceId;
          const isMultiSelected = selectedProjects.includes(namespace.id);
          const classNameToApply = `custom-tree-node ${isMultiSelected ? 'multi-selected' : ''}`;
          const isDropTarget = dropTargetId === namespaceId;
          const canDrop = draggedVMId && draggedVMId !== namespaceId;
          
          return {
            namespace,
            vmsInNamespace,
            node: {
              name: (
                <div 
                  draggable={vmsInNamespace.length > 0}
                  className={classNameToApply}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%', 
                    paddingRight: '16px',
                    backgroundColor: isDropTarget && canDrop ? '#d4edda' : (isSelected || isMultiSelected) ? '#E7F1FA' : 'transparent',
                    padding: '4px 8px',
                    margin: '0 -8px',
                    borderRadius: '4px',
                    fontWeight: (isSelected || isMultiSelected) ? 600 : 400,
                    border: isDropTarget && canDrop ? '3px dashed #28a745' : (isMultiSelected ? '2px solid #0066CC' : '2px solid transparent'),
                    transition: 'all 0.2s ease',
                    cursor: vmsInNamespace.length > 0 ? 'grab' : draggedVMId ? 'copy' : 'default',
                    opacity: draggedVMId === `project-${namespaceId}` ? 0.5 : 1,
                    position: 'relative',
                  }}
                  onClick={(e) => {
                    console.log('🖱️ Project clicked (Core Platforms):', namespace.name, 'Ctrl:', e.ctrlKey, 'Cmd:', e.metaKey);
                    if (e.ctrlKey || e.metaKey) {
                      // Handle multi-selection with Ctrl/Cmd
                      e.preventDefault();
                      e.stopPropagation();
                      const updatedProjects = selectedProjects.includes(namespace.id)
                        ? selectedProjects.filter(id => id !== namespace.id)
                        : [...selectedProjects, namespace.id];
                      console.log('✅ Multi-select updated (Core Platforms):', updatedProjects);
                      setSelectedProjects(updatedProjects);
                      setSelectedTreeNode(null);
                      setPage(1);
                    } else {
                      // Handle single-click selection
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProjects([]);
                      setSelectedTreeNode(namespaceId);
                      setPage(1);
                    }
                  }}
                  onDragStart={(e) => {
                    if (vmsInNamespace.length > 0) {
                      // Detect Ctrl/Cmd for clone mode
                      const isCloneMode = e.ctrlKey || e.metaKey;
                      setIsDragCloneMode(isCloneMode);
                      console.log('🎯 PROJECT DRAG START - Clone mode:', isCloneMode, 'Ctrl:', e.ctrlKey, 'Cmd:', e.metaKey);
                      
                      const projectVMIds = vmsInNamespace.map(vm => vm.id);
                      setDraggedVMId(`project-${namespaceId}`);
                      e.dataTransfer.setData('text/plain', JSON.stringify(projectVMIds));
                      e.dataTransfer.effectAllowed = isCloneMode ? 'copy' : 'move';
                    }
                  }}
                  onDragEnd={() => {
                    setDraggedVMId(null);
                    setDropTargetId(null);
                    // isDragCloneMode will be reset in drop handler after reading it
                  }}
                  onDragOver={(e) => {
                    console.log('🔵 DRAG OVER PROJECT (Core):', namespace.name, 'draggedVMId:', draggedVMId);
                    if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                      console.log('   ✅ Allowing drop on project');
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    } else {
                      console.log('   ❌ NOT allowing drop - condition failed');
                    }
                  }}
                  onDragEnter={(e) => {
                    if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                      e.preventDefault();
                      setDropTargetId(namespaceId);
                    }
                  }}
                  onDragLeave={(e) => {
                    if (e.currentTarget === e.target) {
                      setDropTargetId(null);
                    }
                  }}
                      onDrop={(e) => {
                        e.preventDefault();
                        console.log('💧 DROP (Core) - globalIsCloneMode =', globalIsCloneMode);
                        
                        if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                          let vmsToProcess: string[] = [];
                      
                      if (draggedVMId.startsWith('project-')) {
                        const dataStr = e.dataTransfer.getData('text/plain');
                        try {
                          vmsToProcess = JSON.parse(dataStr);
                        } catch {
                          vmsToProcess = [];
                        }
                      } else if (draggedVMId.startsWith('multiple-')) {
                        const dataStr = e.dataTransfer.getData('text/plain');
                        try {
                          vmsToProcess = JSON.parse(dataStr);
                        } catch {
                          vmsToProcess = selectedVMs;
                        }
                      } else {
                        // Single VM
                        const vmIdParts = draggedVMId.split('-');
                        const vmOriginalId = vmIdParts.slice(1).join('-');
                        vmsToProcess = [vmOriginalId];
                      }
                      
                      // SIMPLE: Check global variable and open the appropriate wizard
                      if (globalIsCloneMode) {
                        console.log('✨ Opening CLONE wizard');
                        setSelectedVMs(vmsToProcess);
                        setIsCloneWizardOpen(true);
                      } else {
                        console.log('🔄 Opening MIGRATE wizard');
                        validateAndOpenWizard(vmsToProcess, namespace.clusterId, namespace.id, false);
                      }
                      
                      // Reset
                      globalIsCloneMode = false;
                    }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tooltip content="Project">
                      <ProjectDiagramIcon />
                    </Tooltip>
                    <span>{namespace.name}</span>
                  </span>
                  <Label isCompact color="grey" style={{ flexShrink: 0 }}>{vmsInNamespace.length}</Label>
                  {draggedVMId === `project-${namespaceId}` && vmsInNamespace.length > 0 && (
                    <Label 
                      color={isDragCloneMode ? "green" : "blue"}
                      isCompact 
                      style={{ 
                        position: 'absolute', 
                        top: '-8px', 
                        right: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {isDragCloneMode ? `Clone Project (${vmsInNamespace.length} VMs)` : `Migrate Project (${vmsInNamespace.length} VMs)`}
                    </Label>
                  )}
                </div>
              ),
              id: namespaceId,
              defaultExpanded: false,
              children: vmsInNamespace.map(vm => {
                const vmId = `vm-${vm.id}`;
                const vmOriginalId = vm.id;
                const isVMSelected = selectedVMs.includes(vmOriginalId);
                const isDraggingMultiple = draggedVMId && draggedVMId.startsWith('multiple-');
                const dragCount = isDraggingMultiple ? parseInt(draggedVMId.split('-')[1]) : 0;
                
                return {
                  name: (
                    <span
                      draggable
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: isVMSelected ? 'var(--pf-t--global--background--color--primary--clicked)' : 'transparent',
                        padding: '4px 8px',
                        margin: '0 -8px',
                        borderRadius: '4px',
                        borderLeft: isDropTarget && canDrop ? '3px solid #28a745' : '3px solid transparent',
                        cursor: 'grab',
                        opacity: draggedVMId === vmId || (isDraggingMultiple && isVMSelected) ? 0.5 : 1,
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                      onDragStart={(e) => {
                        // SIMPLE: Set global variable directly
                        globalIsCloneMode = e.ctrlKey || e.metaKey;
                        console.log('🚀 DRAG START (Core):', vm.name, 'CLONE MODE =', globalIsCloneMode);
                        
                        // If this VM is part of a multi-selection, drag all selected VMs
                        if (isVMSelected && selectedVMs.length > 1) {
                          setDraggedVMId(`multiple-${selectedVMs.length}`);
                          e.dataTransfer.setData('text/plain', JSON.stringify(selectedVMs));
                          console.log('   Dragging multiple VMs:', selectedVMs.length);
                        } else {
                          setDraggedVMId(vmId);
                          e.dataTransfer.setData('text/plain', vmOriginalId);
                          console.log('   Dragging single VM');
                        }
                        e.dataTransfer.effectAllowed = globalIsCloneMode ? 'copy' : 'move';
                      }}
                      onDragEnd={() => {
                        setDraggedVMId(null);
                        setDropTargetId(null);
                        // isDragCloneMode will be reset in drop handler after reading it
                      }}
                      onDragOver={(e) => {
                        // Allow dropping on the VM's parent project area
                        if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                          e.preventDefault();
                          e.stopPropagation();
                          e.dataTransfer.dropEffect = 'move';
                        }
                      }}
                      onDragEnter={(e) => {
                        // Highlight parent project when dragging over its VMs
                        if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                          e.preventDefault();
                          e.stopPropagation();
                          setDropTargetId(namespaceId);
                        }
                      }}
                      onDrop={(e) => {
                        console.log('💥 VM DROP (Core):', vm.name);
                        // Allow dropping on VMs to trigger parent project drop action
                        if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('💧 VM DROP - globalIsCloneMode =', globalIsCloneMode);
                          
                          let vmsToProcess: string[] = [];
                          if (draggedVMId.startsWith('project-')) {
                            const dataStr = e.dataTransfer.getData('text/plain');
                            try {
                              vmsToProcess = JSON.parse(dataStr);
                            } catch {
                              vmsToProcess = [];
                            }
                          } else if (draggedVMId.startsWith('multiple-')) {
                            const dataStr = e.dataTransfer.getData('text/plain');
                            try {
                              vmsToProcess = JSON.parse(dataStr);
                            } catch {
                              vmsToProcess = selectedVMs;
                            }
                          } else {
                            const vmIdParts = draggedVMId.split('-');
                            const vmOriginalId = vmIdParts.slice(1).join('-');
                            vmsToProcess = [vmOriginalId];
                          }
                          
                          // SIMPLE: Check global variable and open the appropriate wizard
                          if (globalIsCloneMode) {
                            console.log('✨ Opening CLONE wizard');
                            setSelectedVMs(vmsToProcess);
                            setIsCloneWizardOpen(true);
                          } else {
                            console.log('🔄 Opening MIGRATE wizard');
                            validateAndOpenWizard(vmsToProcess, namespace.clusterId, namespace.id, false);
                          }
                          
                          // Reset
                          globalIsCloneMode = false;
                        }
                      }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (e.shiftKey && selectedVMs.length > 0) {
                          // Shift+click: Select range
                          const allVMsInView = getAllVirtualMachines();
                          const lastSelectedId = selectedVMs[selectedVMs.length - 1];
                          const lastIndex = allVMsInView.findIndex(v => v.id === lastSelectedId);
                          const currentIndex = allVMsInView.findIndex(v => v.id === vmOriginalId);
                          
                          if (lastIndex !== -1 && currentIndex !== -1) {
                            const start = Math.min(lastIndex, currentIndex);
                            const end = Math.max(lastIndex, currentIndex);
                            const rangeIds = allVMsInView.slice(start, end + 1).map(v => v.id);
                            const combinedIds = selectedVMs.concat(rangeIds);
                            setSelectedVMs(Array.from(new Set(combinedIds)));
                          }
                        } else if (e.ctrlKey || e.metaKey) {
                          // Ctrl/Cmd+click: Toggle individual
                          if (isVMSelected) {
                            setSelectedVMs(selectedVMs.filter(id => id !== vmOriginalId));
                          } else {
                            setSelectedVMs([...selectedVMs, vmOriginalId]);
                          }
                        } else {
                          // Regular click: Single select
                          setSelectedVMs([vmOriginalId]);
                        }
                      }}
                    >
                      <Tooltip content="Virtual machine">
                        <DesktopIcon />
                      </Tooltip>
                      <span>{vm.name}</span>
                      {draggedVMId === vmId && (
                        <Label 
                          color={isDragCloneMode ? "green" : "blue"}
                          isCompact 
                          style={{ 
                            position: 'absolute', 
                            top: '-8px', 
                            right: '8px',
                            fontSize: '11px'
                          }}
                        >
                          {isDragCloneMode ? 'Clone' : 'Migrate'}
                        </Label>
                      )}
                      {isDraggingMultiple && isVMSelected && dragCount > 1 && (
                        <Label 
                          color={isDragCloneMode ? "green" : "blue"}
                          isCompact 
                          style={{ 
                            position: 'absolute', 
                            top: '-8px', 
                            right: '8px',
                            fontSize: '11px'
                          }}
                        >
                          {isDragCloneMode ? `Clone ${dragCount}` : `Migrate ${dragCount}`}
                        </Label>
                      )}
                    </span>
                  ),
                  id: vmId,
                };
              }),
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
        
        const clusterSetId = `clusterset-${clusterSet.id}`;
        const isSelected = selectedTreeNode === clusterSetId;
        
        return {
          name: (
            <span 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: isSelected ? '#E7F1FA' : 'transparent',
                padding: '4px 8px',
                margin: '0 -8px',
                borderRadius: '4px',
                fontWeight: isSelected ? 600 : 400
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                setTreeContextMenuPosition({ top: rect.bottom, left: rect.left });
                setTreeContextMenuOpen(clusterSetId);
              }}
            >
              <Tooltip content="Cluster set">
                <MulticlusterIcon />
              </Tooltip>
              <span>{clusterSet.name}</span>
            </span>
          ),
          id: clusterSetId,
          defaultExpanded: expandedNodes.length > 0 
            ? expandedNodes.includes(`clusterset-${clusterSet.id}`) 
            : (isTreeExpanded || false),
          children: clustersInSet.map(cluster => {
            const namespacesInCluster = getNamespacesByCluster(cluster.id)
              .filter(namespace => !allowedNamespaceIds || allowedNamespaceIds.includes(namespace.id))
              // Filter out projects with 0 VMs if toggle is enabled
              .filter(namespace => {
                if (!showOnlyWithVMs) return true;
                const vmsInNamespace = getVirtualMachinesByNamespace(namespace.id);
                return vmsInNamespace.length > 0;
              });
            
            const clusterId = `cluster-${cluster.id}`;
            const isSelected = selectedTreeNode === clusterId;
            
            // Calculate total VMs in this cluster
            const vmsInCluster = getVirtualMachinesByCluster(cluster.id);
            
            return {
              name: (
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%', 
                    paddingRight: '16px',
                    backgroundColor: isSelected ? '#E7F1FA' : 'transparent',
                    padding: '4px 8px',
                    margin: '0 -8px',
                    borderRadius: '4px',
                    fontWeight: isSelected ? 600 : 400
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTreeContextMenuPosition({ top: rect.bottom, left: rect.left });
                    setTreeContextMenuOpen(clusterId);
                  }}
                >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tooltip content="Cluster">
                    <ServerIcon />
                  </Tooltip>
                  <span>{cluster.name}</span>
                </span>
                  <Label isCompact color="grey" style={{ flexShrink: 0 }}>{vmsInCluster.length}</Label>
                </div>
              ),
              id: clusterId,
              defaultExpanded: expandedNodes.length > 0 
                ? expandedNodes.includes(`cluster-${cluster.id}`) 
                : (isTreeExpanded || false),
              children: namespacesInCluster.map(namespace => {
                const vmsInNamespace = getVirtualMachinesByNamespace(namespace.id);
                const namespaceId = `namespace-${namespace.id}`;
                const isSelected = selectedTreeNode === namespaceId;
                const isMultiSelected = selectedProjects.includes(namespace.id);
                const classNameToApply = `custom-tree-node ${isMultiSelected ? 'multi-selected' : ''}`;
                const isDropTarget = dropTargetId === namespaceId;
                const canDrop = draggedVMId && draggedVMId !== namespaceId;
                
                return {
                  name: (
                    <div 
                      draggable={vmsInNamespace.length > 0}
                      className={classNameToApply}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        width: '100%', 
                        paddingRight: '16px',
                        backgroundColor: isDropTarget && canDrop ? '#d4edda' : (isSelected || isMultiSelected) ? '#E7F1FA' : 'transparent',
                        padding: '4px 8px',
                        margin: '0 -8px',
                        borderRadius: '4px',
                        fontWeight: (isSelected || isMultiSelected) ? 600 : 400,
                        border: isDropTarget && canDrop ? '3px dashed #28a745' : (isMultiSelected ? '2px solid #0066CC' : '2px solid transparent'),
                        transition: 'all 0.2s ease',
                        cursor: vmsInNamespace.length > 0 ? 'grab' : draggedVMId ? 'copy' : 'default',
                        opacity: draggedVMId === `project-${namespaceId}` ? 0.5 : 1,
                        position: 'relative',
                      }}
                      onClick={(e) => {
                        console.log('🖱️ Project clicked (Fleet):', namespace.name, 'Ctrl:', e.ctrlKey, 'Cmd:', e.metaKey);
                        if (e.ctrlKey || e.metaKey) {
                          // Handle multi-selection with Ctrl/Cmd
                          e.preventDefault();
                          e.stopPropagation();
                          const updatedProjects = selectedProjects.includes(namespace.id)
                            ? selectedProjects.filter(id => id !== namespace.id)
                            : [...selectedProjects, namespace.id];
                          console.log('✅ Multi-select updated (Fleet):', updatedProjects);
                          setSelectedProjects(updatedProjects);
                          setSelectedTreeNode(null);
                          setPage(1);
                        } else {
                          // Handle single-click selection
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedProjects([]);
                          setSelectedTreeNode(namespaceId);
                          setPage(1);
                        }
                      }}
                      onDragStart={(e) => {
                        if (vmsInNamespace.length > 0) {
                          // Detect Ctrl/Cmd for clone mode
                          const isCloneMode = e.ctrlKey || e.metaKey;
                          setIsDragCloneMode(isCloneMode);
                          console.log('🎯 PROJECT DRAG START (Fleet) - Clone mode:', isCloneMode, 'Ctrl:', e.ctrlKey, 'Cmd:', e.metaKey);
                          
                          const projectVMIds = vmsInNamespace.map(vm => vm.id);
                          setDraggedVMId(`project-${namespaceId}`);
                          e.dataTransfer.setData('text/plain', JSON.stringify(projectVMIds));
                          e.dataTransfer.effectAllowed = isCloneMode ? 'copy' : 'move';
                        }
                      }}
                      onDragEnd={() => {
                        setDraggedVMId(null);
                        setDropTargetId(null);
                        // DON'T reset isDragCloneMode here - onDragEnd fires BEFORE onDrop!
                      }}
                      onDragOver={(e) => {
                        console.log('✅ NEW CODE LOADED ✅ DRAG OVER PROJECT (Fleet):', namespace.name, 'draggedVMId:', draggedVMId);
                        if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                          console.log('   ✅ Allowing drop on project');
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                        } else {
                          console.log('   ❌ NOT allowing drop - condition failed');
                        }
                      }}
                      onDragEnter={(e) => {
                        if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                          e.preventDefault();
                          setDropTargetId(namespaceId);
                        }
                      }}
                      onDragLeave={(e) => {
                        if (e.currentTarget === e.target) {
                          setDropTargetId(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        console.log('💧 DROP (Fleet) - globalIsCloneMode =', globalIsCloneMode);
                        
                        if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                          let vmsToProcess: string[] = [];
                          
                          if (draggedVMId.startsWith('project-')) {
                            const dataStr = e.dataTransfer.getData('text/plain');
                            try {
                              vmsToProcess = JSON.parse(dataStr);
                            } catch {
                              vmsToProcess = [];
                            }
                          } else if (draggedVMId.startsWith('multiple-')) {
                            const dataStr = e.dataTransfer.getData('text/plain');
                            try {
                              vmsToProcess = JSON.parse(dataStr);
                            } catch {
                              vmsToProcess = selectedVMs;
                            }
                          } else {
                            // Single VM
                            const vmIdParts = draggedVMId.split('-');
                            const vmOriginalId = vmIdParts.slice(1).join('-');
                            vmsToProcess = [vmOriginalId];
                          }
                          
                          // SIMPLE: Check global variable and open the appropriate wizard
                          if (globalIsCloneMode) {
                            console.log('✨ Opening CLONE wizard');
                            setSelectedVMs(vmsToProcess);
                            setIsCloneWizardOpen(true);
                          } else {
                            console.log('🔄 Opening MIGRATE wizard');
                            validateAndOpenWizard(vmsToProcess, namespace.clusterId, namespace.id, false);
                          }
                          
                          // Reset
                          globalIsCloneMode = false;
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTreeContextMenuPosition({ top: rect.bottom, left: rect.left });
                        setTreeContextMenuOpen(namespaceId);
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tooltip content="Project">
                          <ProjectDiagramIcon />
                        </Tooltip>
                        <span>{namespace.name}</span>
                      </span>
                      <Label isCompact color="grey" style={{ flexShrink: 0 }}>{vmsInNamespace.length}</Label>
                      {draggedVMId === `project-${namespaceId}` && vmsInNamespace.length > 0 && (
                        <Label 
                          color={isDragCloneMode ? "green" : "blue"}
                          isCompact 
                          style={{ 
                            position: 'absolute', 
                            top: '-8px', 
                            right: '8px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {isDragCloneMode ? `Clone Project (${vmsInNamespace.length} VMs)` : `Migrate Project (${vmsInNamespace.length} VMs)`}
                        </Label>
                      )}
                    </div>
                  ),
                  id: namespaceId,
                  defaultExpanded: expandedNodes.length > 0 
                    ? expandedNodes.includes(`namespace-${namespace.id}`) 
                    : (isTreeExpanded || false),
                  children: vmsInNamespace.map(vm => {
                    const vmId = `vm-${vm.id}`;
                    const isSelected = selectedTreeNode === vmId;
                    
                    const vmOriginalId = vm.id;
                    const isVMSelected = selectedVMs.includes(vmOriginalId);
                    const isDraggingMultiple = draggedVMId && draggedVMId.startsWith('multiple-');
                    const dragCount = isDraggingMultiple ? parseInt(draggedVMId.split('-')[1]) : 0;
                    
                    return {
                      name: (
                        <span 
                          draggable
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: isVMSelected ? 'var(--pf-t--global--background--color--primary--clicked)' : (isSelected ? '#E7F1FA' : 'transparent'),
                            padding: '4px 8px',
                            margin: '0 -8px',
                            borderRadius: '4px',
                            borderLeft: isDropTarget && canDrop ? '3px solid #28a745' : '3px solid transparent',
                            fontWeight: isSelected ? 600 : 400,
                            cursor: 'grab',
                            opacity: draggedVMId === vmId || (isDraggingMultiple && isVMSelected) ? 0.5 : 1,
                            position: 'relative',
                            transition: 'all 0.2s ease',
                          }}
                          onDragStart={(e) => {
                            // SIMPLE: Set global variable directly
                            globalIsCloneMode = e.ctrlKey || e.metaKey;
                            console.log('🚀 DRAG START (Fleet):', vm.name, 'CLONE MODE =', globalIsCloneMode);
                            
                            // If this VM is part of a multi-selection, drag all selected VMs
                            if (isVMSelected && selectedVMs.length > 1) {
                              setDraggedVMId(`multiple-${selectedVMs.length}`);
                              e.dataTransfer.setData('text/plain', JSON.stringify(selectedVMs));
                              console.log('   Dragging multiple VMs:', selectedVMs.length);
                            } else {
                              setDraggedVMId(vmId);
                              e.dataTransfer.setData('text/plain', vmOriginalId);
                              console.log('   Dragging single VM');
                            }
                            e.dataTransfer.effectAllowed = globalIsCloneMode ? 'copy' : 'move';
                          }}
                          onDragEnd={() => {
                            setDraggedVMId(null);
                            setDropTargetId(null);
                            // isDragCloneMode will be reset in drop handler after reading it
                          }}
                          onDragOver={(e) => {
                            // Allow dropping on the VM's parent project area
                            if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                              e.preventDefault();
                              e.stopPropagation();
                              e.dataTransfer.dropEffect = 'move';
                            }
                          }}
                          onDragEnter={(e) => {
                            // Highlight parent project when dragging over its VMs
                            if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                              e.preventDefault();
                              e.stopPropagation();
                              setDropTargetId(namespaceId);
                            }
                          }}
                          onDrop={(e) => {
                            console.log('💥 VM DROP (Fleet):', vm.name);
                            // Allow dropping on VMs to trigger parent project drop action
                            if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('💧 VM DROP - globalIsCloneMode =', globalIsCloneMode);
                              
                              let vmsToProcess: string[] = [];
                              if (draggedVMId.startsWith('project-')) {
                                const dataStr = e.dataTransfer.getData('text/plain');
                                try {
                                  vmsToProcess = JSON.parse(dataStr);
                                } catch {
                                  vmsToProcess = [];
                                }
                              } else if (draggedVMId.startsWith('multiple-')) {
                                const dataStr = e.dataTransfer.getData('text/plain');
                                try {
                                  vmsToProcess = JSON.parse(dataStr);
                                } catch {
                                  vmsToProcess = selectedVMs;
                                }
                              } else {
                                const vmIdParts = draggedVMId.split('-');
                                const vmOriginalId = vmIdParts.slice(1).join('-');
                                vmsToProcess = [vmOriginalId];
                              }
                              
                              // SIMPLE: Check global variable and open the appropriate wizard
                              if (globalIsCloneMode) {
                                console.log('✨ Opening CLONE wizard');
                                setSelectedVMs(vmsToProcess);
                                setIsCloneWizardOpen(true);
                              } else {
                                console.log('🔄 Opening MIGRATE wizard');
                                validateAndOpenWizard(vmsToProcess, namespace.clusterId, namespace.id, false);
                              }
                              
                              // Reset
                              globalIsCloneMode = false;
                            }
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTreeContextMenuPosition({ top: rect.bottom, left: rect.left });
                            setTreeContextMenuOpen(vmId);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (e.shiftKey && selectedVMs.length > 0) {
                              // Shift+click: Select range
                              const allVMsInView = getAllVirtualMachines();
                              const lastSelectedId = selectedVMs[selectedVMs.length - 1];
                              const lastIndex = allVMsInView.findIndex(v => v.id === lastSelectedId);
                              const currentIndex = allVMsInView.findIndex(v => v.id === vmOriginalId);
                              
                              if (lastIndex !== -1 && currentIndex !== -1) {
                                const start = Math.min(lastIndex, currentIndex);
                                const end = Math.max(lastIndex, currentIndex);
                                const rangeIds = allVMsInView.slice(start, end + 1).map(v => v.id);
                                const combinedIds = selectedVMs.concat(rangeIds);
                                setSelectedVMs(Array.from(new Set(combinedIds)));
                              }
                            } else if (e.ctrlKey || e.metaKey) {
                              // Ctrl/Cmd+click: Toggle individual
                              if (isVMSelected) {
                                setSelectedVMs(selectedVMs.filter(id => id !== vmOriginalId));
                              } else {
                                setSelectedVMs([...selectedVMs, vmOriginalId]);
                              }
                            } else {
                              // Regular click: Single select
                              setSelectedVMs([vmOriginalId]);
                            }
                          }}
                        >
                          <Tooltip content="Virtual machine">
                            <DesktopIcon />
                          </Tooltip>
                          <span>{vm.name}</span>
                          {draggedVMId === vmId && (
                            <Label 
                              color={isDragCloneMode ? "green" : "blue"}
                              isCompact 
                              style={{ 
                                position: 'absolute', 
                                top: '-8px', 
                                right: '8px',
                                fontSize: '11px'
                              }}
                            >
                              {isDragCloneMode ? 'Clone' : 'Migrate'}
                            </Label>
                          )}
                          {isDraggingMultiple && isVMSelected && dragCount > 1 && (
                            <Label 
                              color={isDragCloneMode ? "green" : "blue"}
                              isCompact 
                              style={{ 
                                position: 'absolute', 
                                top: '-8px', 
                                right: '8px',
                                fontSize: '11px'
                              }}
                            >
                              {isDragCloneMode ? `Clone ${dragCount}` : `Migrate ${dragCount}`}
                            </Label>
                          )}
                        </span>
                      ),
                      id: vmId,
                    };
                  }),
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

    // Build standalone cluster node (testcluster - not in any cluster set)
    const standaloneCluster = {
      id: 'testcluster',
      name: 'testcluster',
      clusterSetId: null as string | null,
    };
    
    const standaloneNamespaces = getNamespacesByCluster('testcluster')
      .filter(namespace => !allowedNamespaceIds || allowedNamespaceIds.includes(namespace.id))
      .filter(namespace => {
        if (!showOnlyWithVMs) return true;
        const vmsInNamespace = getVirtualMachinesByNamespace(namespace.id);
        return vmsInNamespace.length > 0;
      });
    
    const standaloneClusterId = `cluster-${standaloneCluster.id}`;
    const isStandaloneSelected = selectedTreeNode === standaloneClusterId;
    const standaloneVMsCount = getVirtualMachinesByCluster('testcluster').length;
    
    const standaloneClusterNode = {
      name: (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%', 
            paddingRight: '16px',
            backgroundColor: isStandaloneSelected ? '#E7F1FA' : 'transparent',
            padding: '4px 8px',
            margin: '0 -8px',
            borderRadius: '4px',
            fontWeight: isStandaloneSelected ? 600 : 400
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            setTreeContextMenuPosition({ top: rect.bottom, left: rect.left });
            setTreeContextMenuOpen(standaloneClusterId);
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tooltip content="Cluster">
              <ServerIcon />
            </Tooltip>
            <span>{standaloneCluster.name}</span>
          </span>
          <Label isCompact color="grey" style={{ flexShrink: 0 }}>{standaloneVMsCount}</Label>
        </div>
      ),
      id: standaloneClusterId,
      defaultExpanded: expandedNodes.length > 0 
        ? expandedNodes.includes(`cluster-${standaloneCluster.id}`) 
        : (isTreeExpanded || false),
      children: standaloneNamespaces.map(namespace => {
        const vmsInNamespace = getVirtualMachinesByNamespace(namespace.id);
        const namespaceId = `namespace-${namespace.id}`;
        const isSelected = selectedTreeNode === namespaceId;
        const isMultiSelected = selectedProjects.includes(namespace.id);
        const classNameToApply = `custom-tree-node ${isMultiSelected ? 'multi-selected' : ''}`;
        const isDropTarget = dropTargetId === namespaceId;
        const canDrop = draggedVMId && draggedVMId !== namespaceId;
        
        return {
          name: (
            <div 
              draggable={vmsInNamespace.length > 0}
              className={classNameToApply}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                width: '100%', 
                paddingRight: '16px',
                backgroundColor: isDropTarget && canDrop ? '#d4edda' : (isSelected || isMultiSelected) ? '#E7F1FA' : 'transparent',
                padding: '4px 8px',
                margin: '0 -8px',
                borderRadius: '4px',
                fontWeight: (isSelected || isMultiSelected) ? 600 : 400,
                border: isDropTarget && canDrop ? '2px dashed #28a745' : (isMultiSelected ? '2px solid #0066CC' : '2px solid transparent'),
                transition: 'all 0.2s ease',
                cursor: vmsInNamespace.length > 0 ? 'grab' : 'default',
                opacity: draggedVMId === `project-${namespaceId}` ? 0.5 : 1,
                position: 'relative',
              }}
              onClick={(e) => {
                console.log('🖱️ Project clicked (Standalone):', namespace.name, 'Ctrl:', e.ctrlKey, 'Cmd:', e.metaKey);
                if (e.ctrlKey || e.metaKey) {
                  // Handle multi-selection with Ctrl/Cmd
                  e.preventDefault();
                  e.stopPropagation();
                  const updatedProjects = selectedProjects.includes(namespace.id)
                    ? selectedProjects.filter(id => id !== namespace.id)
                    : [...selectedProjects, namespace.id];
                  console.log('✅ Multi-select updated (Standalone):', updatedProjects);
                  setSelectedProjects(updatedProjects);
                  setSelectedTreeNode(null);
                  setPage(1);
                } else {
                  // Handle single-click selection
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedProjects([]);
                  setSelectedTreeNode(namespaceId);
                  setPage(1);
                }
              }}
              onDragStart={(e) => {
                if (vmsInNamespace.length > 0) {
                  const isCloneMode = e.ctrlKey || e.metaKey;
                  setIsDragCloneMode(isCloneMode);
                  console.log('🎯 PROJECT DRAG START (Standalone) - Clone mode:', isCloneMode);
                  
                  const projectVMIds = vmsInNamespace.map(vm => vm.id);
                  setDraggedVMId(`project-${namespaceId}`);
                  e.dataTransfer.setData('text/plain', JSON.stringify(projectVMIds));
                  e.dataTransfer.effectAllowed = isCloneMode ? 'copy' : 'move';
                }
              }}
              onDragEnd={() => {
                setDraggedVMId(null);
                setDropTargetId(null);
                // isDragCloneMode will be reset in drop handler after reading it
              }}
              onDragOver={(e) => {
                console.log('🔵 DRAG OVER PROJECT (Standalone):', namespace.name, 'draggedVMId:', draggedVMId);
                if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                  console.log('   ✅ Allowing drop on project');
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                } else {
                  console.log('   ❌ NOT allowing drop - condition failed');
                }
              }}
              onDragEnter={(e) => {
                if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                  e.preventDefault();
                  setDropTargetId(namespaceId);
                }
              }}
              onDragLeave={(e) => {
                if (e.currentTarget === e.target) {
                  setDropTargetId(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                console.log('💧 DROP (Standalone) - globalIsCloneMode =', globalIsCloneMode);
                
                if (draggedVMId && draggedVMId !== `project-${namespaceId}`) {
                  let vmsToProcess: string[] = [];
                  
                  if (draggedVMId.startsWith('project-')) {
                    const dataStr = e.dataTransfer.getData('text/plain');
                    try {
                      vmsToProcess = JSON.parse(dataStr);
                    } catch {
                      vmsToProcess = [];
                    }
                  } else if (draggedVMId.startsWith('multiple-')) {
                    const dataStr = e.dataTransfer.getData('text/plain');
                    try {
                      vmsToProcess = JSON.parse(dataStr);
                    } catch {
                      vmsToProcess = selectedVMs;
                    }
                  } else {
                    const vmIdParts = draggedVMId.split('-');
                    const vmOriginalId = vmIdParts.slice(1).join('-');
                    vmsToProcess = [vmOriginalId];
                  }
                  
                  // SIMPLE: Check global variable and open the appropriate wizard
                  if (globalIsCloneMode) {
                    console.log('✨ Opening CLONE wizard');
                    setSelectedVMs(vmsToProcess);
                    setIsCloneWizardOpen(true);
                  } else {
                    console.log('🔄 Opening MIGRATE wizard');
                    validateAndOpenWizard(vmsToProcess, standaloneCluster.id, namespace.id, false);
                  }
                  
                  // Reset
                  globalIsCloneMode = false;
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                setTreeContextMenuPosition({ top: rect.bottom, left: rect.left });
                setTreeContextMenuOpen(namespaceId);
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tooltip content="Project">
                  <ProjectDiagramIcon />
                </Tooltip>
                <span>{namespace.name}</span>
              </span>
              <Label isCompact color="grey" style={{ flexShrink: 0 }}>{vmsInNamespace.length}</Label>
            </div>
          ),
          id: namespaceId,
          defaultExpanded: expandedNodes.length > 0 
            ? expandedNodes.includes(`namespace-${namespace.id}`) 
            : (isTreeExpanded || false),
          children: vmsInNamespace.map(vm => {
            const vmId = `vm-${vm.id}`;
            const isSelected = selectedTreeNode === vmId;
            const vmOriginalId = vm.id;
            const isVMSelected = selectedVMs.includes(vmOriginalId);
            const isDraggingMultiple = draggedVMId && draggedVMId.startsWith('multiple-');
            const dragCount = isDraggingMultiple ? parseInt(draggedVMId.split('-')[1]) : 0;
            
            return {
              name: (
                <span 
                  draggable
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isVMSelected ? 'var(--pf-t--global--background--color--primary--clicked)' : (isSelected ? '#E7F1FA' : 'transparent'),
                    padding: '4px 8px',
                    margin: '0 -8px',
                    borderRadius: '4px',
                    borderLeft: isDropTarget && canDrop ? '3px solid #28a745' : '3px solid transparent',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'grab',
                    opacity: draggedVMId === vmId || (isDraggingMultiple && isVMSelected) ? 0.5 : 1,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                  onDragStart={(e) => {
                    // SIMPLE: Set global variable directly
                    globalIsCloneMode = e.ctrlKey || e.metaKey;
                    console.log('🚀 DRAG START (Standalone):', vm.name, 'CLONE MODE =', globalIsCloneMode);
                    
                    if (isVMSelected && selectedVMs.length > 1) {
                      setDraggedVMId(`multiple-${selectedVMs.length}`);
                      e.dataTransfer.setData('text/plain', JSON.stringify(selectedVMs));
                    } else {
                      setDraggedVMId(vmId);
                      e.dataTransfer.setData('text/plain', vmOriginalId);
                    }
                    e.dataTransfer.effectAllowed = globalIsCloneMode ? 'copy' : 'move';
                  }}
                  onDragEnd={() => {
                    setDraggedVMId(null);
                    setDropTargetId(null);
                    // isDragCloneMode will be reset in drop handler after reading it
                  }}
                  onDragOver={(e) => {
                    // Allow dropping on the VM's parent project area
                    if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = 'move';
                    }
                  }}
                  onDragEnter={(e) => {
                    // Highlight parent project when dragging over its VMs
                    if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                      e.preventDefault();
                      e.stopPropagation();
                      setDropTargetId(namespaceId);
                    }
                  }}
                  onDrop={(e) => {
                    console.log('💥 VM DROP (Standalone):', vm.name);
                    // Allow dropping on VMs to trigger parent project drop action
                    if (draggedVMId && draggedVMId !== vmId && draggedVMId !== `project-${namespaceId}`) {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('💧 VM DROP - globalIsCloneMode =', globalIsCloneMode);
                      
                      let vmsToProcess: string[] = [];
                      if (draggedVMId.startsWith('project-')) {
                        const dataStr = e.dataTransfer.getData('text/plain');
                        try {
                          vmsToProcess = JSON.parse(dataStr);
                        } catch {
                          vmsToProcess = [];
                        }
                      } else if (draggedVMId.startsWith('multiple-')) {
                        const dataStr = e.dataTransfer.getData('text/plain');
                        try {
                          vmsToProcess = JSON.parse(dataStr);
                        } catch {
                          vmsToProcess = selectedVMs;
                        }
                      } else {
                        const vmIdParts = draggedVMId.split('-');
                        const vmOriginalId = vmIdParts.slice(1).join('-');
                        vmsToProcess = [vmOriginalId];
                      }
                      
                      // SIMPLE: Check global variable and open the appropriate wizard
                      if (globalIsCloneMode) {
                        console.log('✨ Opening CLONE wizard');
                        setSelectedVMs(vmsToProcess);
                        setIsCloneWizardOpen(true);
                      } else {
                        console.log('🔄 Opening MIGRATE wizard');
                        validateAndOpenWizard(vmsToProcess, standaloneCluster.id, namespace.id, false);
                      }
                      
                      // Reset
                      globalIsCloneMode = false;
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.shiftKey && selectedVMs.length > 0) {
                      const allVMsInView = getAllVirtualMachines();
                      const lastSelectedId = selectedVMs[selectedVMs.length - 1];
                      const lastIndex = allVMsInView.findIndex(v => v.id === lastSelectedId);
                      const currentIndex = allVMsInView.findIndex(v => v.id === vmOriginalId);
                      
                      if (lastIndex !== -1 && currentIndex !== -1) {
                        const start = Math.min(lastIndex, currentIndex);
                        const end = Math.max(lastIndex, currentIndex);
                        const rangeIds = allVMsInView.slice(start, end + 1).map(v => v.id);
                        const combinedIds = selectedVMs.concat(rangeIds);
                        setSelectedVMs(Array.from(new Set(combinedIds)));
                      }
                    } else if (e.ctrlKey || e.metaKey) {
                      if (isVMSelected) {
                        setSelectedVMs(selectedVMs.filter(id => id !== vmOriginalId));
                      } else {
                        setSelectedVMs([...selectedVMs, vmOriginalId]);
                      }
                    } else {
                      setSelectedVMs([vmOriginalId]);
                    }
                  }}
                >
                  <Tooltip content="Virtual machine">
                    <DesktopIcon />
                  </Tooltip>
                  <span>{vm.name}</span>
                </span>
              ),
              id: vmId,
              defaultExpanded: false,
              children: [],
            };
          }),
        };
      }),
    };

    // Wrap all cluster sets under "All cluster sets" parent node
    // Wrap standalone clusters under "Standalone clusters" parent node
    // Hide standalone clusters section if toggle is on and there are no VMs/projects
    const shouldShowStandalone = !showOnlyWithVMs || (standaloneNamespaces.length > 0 && standaloneVMsCount > 0);
    
    const treeNodes = [
      {
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
      },
    ];
    
    if (shouldShowStandalone) {
      treeNodes.push({
        name: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <ServerIcon />
              <span>Standalone clusters</span>
            </span>
            <Label isCompact color="grey" style={{ flexShrink: 0 }}>{standaloneVMsCount}</Label>
          </div>
        ),
        id: 'standalone-clusters',
        defaultExpanded: true,
        children: [standaloneClusterNode],
      });
    }
    
    return treeNodes;
  }, [dbClusterSets, impersonatingUser, hubClusterOnly, showProjectsOnly, showOnlyWithVMs, expandedNodes, isTreeExpanded, selectedTreeNode, draggedVMId, dropTargetId]);
  
  const sidebar = (
    <div 
      ref={sidebarRef}
      className="vm-sidebar" 
      style={{ width: `${sidebarWidth}px`, minWidth: '200px', maxWidth: '600px' }}
      onClick={(e) => {
        // Deselect all VMs when clicking on empty space in sidebar
        const target = e.target as HTMLElement;
        
        // Check if we're clicking on the actual VM item (with the blue background)
        const isClickingVM = target.closest('[draggable="true"]')?.querySelector('svg[data-icon-name="DesktopIcon"]');
        
        // Check if clicking on empty tree space or non-VM elements
        const isEmptySpace = 
          target === e.currentTarget || 
          target.classList?.contains('vm-sidebar') ||
          target.classList?.contains('pf-v6-c-tree-view__list') ||
          target.classList?.contains('pf-v6-c-tree-view') ||
          target.classList?.contains('pf-v6-c-tree-view__list-item');
        
        // Only clear if not clicking on a VM and clicking on empty space
        if (!isClickingVM && isEmptySpace && selectedVMs.length > 0) {
          setSelectedVMs([]);
        }
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Switch
          id="show-vms-only"
          label="Show only projects with VirtualMachines"
          isChecked={showOnlyWithVMs}
          onChange={(_event, checked) => setShowOnlyWithVMs(checked)}
        />
      </div>

      <Divider style={{ margin: '16px calc(-16px - 8px) 16px -16px', width: 'calc(100% + 32px + 8px)' }} />

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
              onClick={() => {
                setIsTreeExpanded(!isTreeExpanded);
                setExpandedNodes([]); // Reset specific expansions
                setTreeKey(prev => prev + 1); // Force tree re-render
              }}
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
            setIsCreateProjectModalOpen(true);
          }}
        >
          Create project
        </Button>
      </div>

      <TreeView
        key={treeKey}
        data={treeData}
        onSelect={(_event, item) => {
          if (item.id) {
            // For namespace items, let the onClick handler on the div manage the selection
            // Don't interfere with it here
            if (item.id.startsWith('namespace-')) {
              return;
            }
            
            // If we're on a detail page, navigate back to the main table view first
            if (isDetailPage) {
              navigate('/virtualization/virtual-machines');
            }
            
            // Handle selection for non-namespace nodes (cluster sets, clusters, VMs)
            setSelectedProjects([]);
            setSelectedTreeNode(item.id);
            setPage(1); // Reset to first page when changing selection
          }
        }}
      />
      
      {/* Context Menu */}
      {treeContextMenuOpen && treeContextMenuPosition && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => {
              setTreeContextMenuOpen(null);
              setTreeContextMenuPosition(null);
            }}
          />
          <Dropdown
            isOpen={true}
            onSelect={() => {
              setTreeContextMenuOpen(null);
              setTreeContextMenuPosition(null);
            }}
            toggle={() => null}
          >
            <div
              style={{
                position: 'fixed',
                top: `${treeContextMenuPosition.top}px`,
                left: `${treeContextMenuPosition.left}px`,
                zIndex: 1000,
                backgroundColor: 'var(--pf-t--global--background--color--floating--default)',
                border: '1px solid var(--pf-t--global--border--color--default)',
                borderRadius: 'var(--pf-t--global--border--radius--small)',
                boxShadow: 'var(--pf-t--global--box-shadow--md)',
                minWidth: '200px',
              }}
            >
              <DropdownList>
                {treeContextMenuOpen.startsWith('clusterset-') && (
                  <>
                    <DropdownItem key="view">View cluster set details</DropdownItem>
                    <DropdownItem key="manage">Manage cluster set</DropdownItem>
                  </>
                )}
                {treeContextMenuOpen.startsWith('cluster-') && (
                  <>
                    <DropdownItem key="view">View cluster details</DropdownItem>
                    <DropdownItem key="import">Import resources</DropdownItem>
                    <DropdownItem key="manage">Manage cluster</DropdownItem>
                  </>
                )}
                {treeContextMenuOpen.startsWith('namespace-') && (() => {
                  const namespaceId = treeContextMenuOpen.split('-').slice(1).join('-');
                  const isMultiSelected = selectedProjects.length > 1;
                  const selectedCount = selectedProjects.length;
                  
                  return (
                    <>
                      {!isMultiSelected && (
                        <>
                          <DropdownItem key="view">View project details</DropdownItem>
                          <DropdownItem key="create">Create virtual machine</DropdownItem>
                          <DropdownItem key="manage">Manage project access</DropdownItem>
                          <DropdownItem key="edit">Edit project</DropdownItem>
                        </>
                      )}
                      {isMultiSelected && (
                        <>
                          <DropdownItem 
                            key="migrate"
                            onClick={() => {
                              // Get all VMs from all selected projects
                              const allVMs = selectedProjects.flatMap(projectId => 
                                getVirtualMachinesByNamespace(projectId)
                              );
                              const allVMIds = allVMs.map(vm => vm.id);
                              setSelectedVMs(allVMIds);
                              setDropTargetClusterId(undefined);
                              setDropTargetNamespaceId(undefined);
                              setIsWizardFromDragDrop(false);
                              setIsMigrateWizardOpen(true);
                              setTreeContextMenuOpen(null);
                              setTreeContextMenuPosition(null);
                            }}
                          >
                            Migrate VMs from {selectedCount} projects
                          </DropdownItem>
                        </>
                      )}
                      <Divider />
                      <DropdownItem key="delete">
                        Delete {isMultiSelected ? `${selectedCount} projects` : 'project'}
                      </DropdownItem>
                    </>
                  );
                })()}
                {treeContextMenuOpen.startsWith('vm-') && (
                  <>
                    <DropdownItem 
                      key="view"
                      onClick={() => {
                        const vmId = treeContextMenuOpen.split('-').slice(1).join('-');
                        navigate(`/virtualization/virtual-machines/${vmId}`);
                        setTreeContextMenuOpen(null);
                        setTreeContextMenuPosition(null);
                      }}
                    >
                      View details
                    </DropdownItem>
                    <DropdownItem key="console">Open console</DropdownItem>
                    <DropdownItem 
                      key="start"
                      onClick={() => {
                        const vmId = treeContextMenuOpen.split('-').slice(1).join('-');
                        console.log('Start VM:', vmId);
                        // Update VM status to Running
                        setTreeContextMenuOpen(null);
                        setTreeContextMenuPosition(null);
                      }}
                    >
                      Start
                    </DropdownItem>
                    <DropdownItem 
                      key="stop"
                      onClick={() => {
                        const vmId = treeContextMenuOpen.split('-').slice(1).join('-');
                        console.log('Stop VM:', vmId);
                        // Update VM status to Stopped
                        setTreeContextMenuOpen(null);
                        setTreeContextMenuPosition(null);
                      }}
                    >
                      Stop
                    </DropdownItem>
                    <DropdownItem 
                      key="restart"
                      onClick={() => {
                        const vmId = treeContextMenuOpen.split('-').slice(1).join('-');
                        console.log('Restart VM:', vmId);
                        // Update VM status to Starting then Running
                        setTreeContextMenuOpen(null);
                        setTreeContextMenuPosition(null);
                      }}
                    >
                      Restart
                    </DropdownItem>
                    <DropdownItem 
                      key="migrate"
                      onClick={() => {
                        const vmId = treeContextMenuOpen.split('-').slice(1).join('-');
                        setSelectedVMs([vmId]);
                        // Clear drop targets (not from drag-and-drop)
                        setDropTargetClusterId(undefined);
                        setDropTargetNamespaceId(undefined);
                        setIsWizardFromDragDrop(false);
                        setIsMigrateWizardOpen(true);
                        setTreeContextMenuOpen(null);
                        setTreeContextMenuPosition(null);
                      }}
                    >
                      Migrate
                    </DropdownItem>
                    <Divider />
                    <DropdownItem 
                      key="delete"
                      onClick={() => {
                        const vmId = treeContextMenuOpen.split('-').slice(1).join('-');
                        setVmToDelete(vmId);
                        setIsDeleteModalOpen(true);
                        setTreeContextMenuOpen(null);
                        setTreeContextMenuPosition(null);
                      }}
                    >
                      Delete
                    </DropdownItem>
                  </>
                )}
              </DropdownList>
            </div>
          </Dropdown>
        </>
      )}
      
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
      {/* Create Project Modal */}
      <Modal
        variant={ModalVariant.medium}
        isOpen={isCreateProjectModalOpen}
        onClose={() => {
          setIsCreateProjectModalOpen(false);
          setProjectName('');
          setProjectCluster('');
          setProjectDisplayName('');
          setProjectDescription('');
          setClusterSearchValue('');
        }}
        aria-label="Create project"
      >
        <div style={{ padding: '24px' }}>
          <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            Create project
          </Title>
          
          <Content component="p" style={{ 
            marginBottom: 'var(--pf-t--global--spacer--md)',
            fontSize: '15px',
            lineHeight: '1.6'
          }}>
            An OpenShift project is an alternative representation of a Kubernetes namespace.
          </Content>
          
          <Button 
            component="a" 
            variant="link" 
            isInline 
            icon={<ExternalLinkAltIcon />}
            iconPosition="end"
            style={{ padding: 0, marginBottom: '24px' }}
          >
            Learn more about working with projects
          </Button>

          <Form>
            <FormGroup
              label={
                <span>
                  Name{' '}
                  <Tooltip content="A unique name for the project">
                    <Button variant="plain" aria-label="More info" style={{ padding: 0, marginLeft: '4px', verticalAlign: 'middle' }}>
                      <QuestionCircleIcon style={{ fontSize: '14px' }} />
                    </Button>
                  </Tooltip>
                </span>
              }
              isRequired
              fieldId="project-name"
            >
              <TextInput
                isRequired
                type="text"
                id="project-name"
                value={projectName}
                onChange={(_event, value) => setProjectName(value)}
              />
            </FormGroup>

            <FormGroup
              label="Cluster"
              fieldId="project-cluster"
            >
              <Select
                isOpen={isClusterDropdownOpen}
                selected={projectCluster}
                onSelect={(_event, selection) => {
                  setProjectCluster(selection as string);
                  setIsClusterDropdownOpen(false);
                  setClusterSearchValue('');
                }}
                onOpenChange={(isOpen) => {
                  setIsClusterDropdownOpen(isOpen);
                  if (!isOpen) {
                    setClusterSearchValue('');
                  }
                }}
                toggle={(toggleRef) => (
                  <MenuToggle 
                    ref={toggleRef}
                    onClick={() => setIsClusterDropdownOpen(!isClusterDropdownOpen)}
                    isExpanded={isClusterDropdownOpen}
                    style={{ width: '100%' }}
                  >
                    {projectCluster || 'Select cluster'}
                  </MenuToggle>
                )}
              >
                <div style={{ padding: '8px' }}>
                  <TextInput
                    type="text"
                    placeholder="Search clusters..."
                    value={clusterSearchValue}
                    onChange={(_event, value) => setClusterSearchValue(value)}
                    aria-label="Search clusters"
                  />
                </div>
                <Divider />
                <SelectList>
                  {getAllClusters()
                    .filter(cluster => 
                      cluster.name.toLowerCase().includes(clusterSearchValue.toLowerCase())
                    )
                    .map(cluster => (
                      <SelectOption key={cluster.id} value={cluster.name}>
                        {cluster.name}
                      </SelectOption>
                    ))}
                  {getAllClusters().filter(cluster => 
                    cluster.name.toLowerCase().includes(clusterSearchValue.toLowerCase())
                  ).length === 0 && (
                    <SelectOption isDisabled>No clusters found</SelectOption>
                  )}
                </SelectList>
              </Select>
            </FormGroup>

            <FormGroup
              label="Display name"
              fieldId="project-display-name"
            >
              <TextInput
                type="text"
                id="project-display-name"
                value={projectDisplayName}
                onChange={(_event, value) => setProjectDisplayName(value)}
              />
            </FormGroup>

            <FormGroup
              label="Description"
              fieldId="project-description"
            >
              <TextArea
                id="project-description"
                value={projectDescription}
                onChange={(_event, value) => setProjectDescription(value)}
                rows={3}
              />
            </FormGroup>
          </Form>

          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <Button 
              key="create" 
              variant="primary" 
              isDisabled={!projectName}
              onClick={() => {
                console.log('Create project:', { projectName, projectCluster, projectDisplayName, projectDescription });
                setIsCreateProjectModalOpen(false);
                setProjectName('');
                setProjectCluster('');
                setProjectDisplayName('');
                setProjectDescription('');
                setClusterSearchValue('');
              }}
            >
              Create
            </Button>
            <Button 
              key="cancel" 
              variant="link" 
              onClick={() => {
                setIsCreateProjectModalOpen(false);
                setProjectName('');
                setProjectCluster('');
                setProjectDisplayName('');
                setProjectDescription('');
                setClusterSearchValue('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

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

      {/* Advanced Search Modal */}
      <Modal
        width="60%"
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        tabIndex={0}
        aria-label="Advanced search"
      >
        {/* Sticky Header */}
        <div style={{ 
          padding: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--pf-t--global--border--color--default)',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title headingLevel="h1" size="2xl">
            Advanced search
          </Title>
          <Button
            variant="plain"
            aria-label="Close"
            onClick={() => setIsAdvancedSearchOpen(false)}
            style={{ padding: '8px' }}
          >
            <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 352 512" aria-hidden="true">
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
            </svg>
          </Button>
        </div>
        
        {/* Scrollable Content */}
        <div style={{ 
          padding: '24px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <Form>
            {/* Details Section */}
            <ExpandableSection
              toggleText="Details"
              onToggle={(_event, isExpanded) => setIsDetailsExpanded(isExpanded)}
              isExpanded={isDetailsExpanded}
              isIndented
            >
              <FormGroup label="Name" fieldId="adv-search-name">
                <TextInput
                  id="adv-search-name"
                  value={advancedSearchName}
                  onChange={(_event, value) => setAdvancedSearchName(value)}
                  placeholder="Name"
                />
              </FormGroup>

              <FormGroup label="Cluster" fieldId="adv-search-cluster">
                <Dropdown
                  isOpen={isAdvSearchClusterOpen}
                  onSelect={() => setIsAdvSearchClusterOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchClusterOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchClusterOpen(!isAdvSearchClusterOpen)}
                      isExpanded={isAdvSearchClusterOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchCluster === 'all' ? 'All clusters' : advancedSearchCluster}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="all" onClick={() => setAdvancedSearchCluster('all')}>
                      All clusters
                    </DropdownItem>
                    {getAllClusters().map(cluster => (
                      <DropdownItem key={cluster.id} onClick={() => setAdvancedSearchCluster(cluster.name)}>
                        {cluster.name}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Project" fieldId="adv-search-project">
                <Dropdown
                  isOpen={isAdvSearchProjectOpen}
                  onSelect={() => setIsAdvSearchProjectOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchProjectOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchProjectOpen(!isAdvSearchProjectOpen)}
                      isExpanded={isAdvSearchProjectOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchProject === 'all' ? 'All projects' : advancedSearchProject}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem key="all" onClick={() => setAdvancedSearchProject('all')}>
                      All projects
                    </DropdownItem>
                    {getAllNamespaces().map(project => (
                      <DropdownItem key={project.id} onClick={() => setAdvancedSearchProject(project.name)}>
                        {project.name}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Description" fieldId="adv-search-description">
                <TextInput
                  id="adv-search-description"
                  value={advancedSearchDescription}
                  onChange={(_event, value) => setAdvancedSearchDescription(value)}
                  placeholder="Description"
                />
              </FormGroup>

              <FormGroup label="Status" fieldId="adv-search-status">
                <Dropdown
                  isOpen={isAdvSearchStatusOpen}
                  onSelect={() => setIsAdvSearchStatusOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchStatusOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchStatusOpen(!isAdvSearchStatusOpen)}
                      isExpanded={isAdvSearchStatusOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchStatus || 'Select status'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    {availableStatuses.filter(s => s !== 'All').map(status => (
                      <DropdownItem key={status} onClick={() => setAdvancedSearchStatus(status)}>
                        {status}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Operating system" fieldId="adv-search-os">
                <Dropdown
                  isOpen={isAdvSearchOSOpen}
                  onSelect={() => setIsAdvSearchOSOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchOSOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchOSOpen(!isAdvSearchOSOpen)}
                      isExpanded={isAdvSearchOSOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchOS || 'Select OS'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    {availableOSs.filter(os => os !== 'All').map(os => (
                      <DropdownItem key={os} onClick={() => setAdvancedSearchOS(os)}>
                        {os}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="vCPU" fieldId="adv-search-vcpu">
                <Split hasGutter>
                  <SplitItem>
                    <Dropdown
                      isOpen={isAdvSearchVCPUOpOpen}
                      onSelect={() => setIsAdvSearchVCPUOpOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsAdvSearchVCPUOpOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsAdvSearchVCPUOpOpen(!isAdvSearchVCPUOpOpen)}
                          isExpanded={isAdvSearchVCPUOpOpen}
                          style={{ width: '150px' }}
                        >
                          Greater than
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem>Greater than</DropdownItem>
                        <DropdownItem>Less than</DropdownItem>
                        <DropdownItem>Equal to</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </SplitItem>
                  <SplitItem isFilled>
                    <TextInput
                      id="adv-search-vcpu-value"
                      type="number"
                      value={advancedSearchVCPUValue}
                      onChange={(_event, value) => setAdvancedSearchVCPUValue(value)}
                      placeholder="vCPU value"
                    />
                  </SplitItem>
                </Split>
              </FormGroup>

              <FormGroup label="Memory" fieldId="adv-search-memory">
                <Split hasGutter>
                  <SplitItem>
                    <Dropdown
                      isOpen={isAdvSearchMemoryOpOpen}
                      onSelect={() => setIsAdvSearchMemoryOpOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsAdvSearchMemoryOpOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsAdvSearchMemoryOpOpen(!isAdvSearchMemoryOpOpen)}
                          isExpanded={isAdvSearchMemoryOpOpen}
                          style={{ width: '150px' }}
                        >
                          Greater than
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem>Greater than</DropdownItem>
                        <DropdownItem>Less than</DropdownItem>
                        <DropdownItem>Equal to</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </SplitItem>
                  <SplitItem isFilled>
                    <TextInput
                      id="adv-search-memory-value"
                      type="number"
                      value={advancedSearchMemoryValue}
                      onChange={(_event, value) => setAdvancedSearchMemoryValue(value)}
                      placeholder="Memory value"
                    />
                  </SplitItem>
                  <SplitItem>
                    <Dropdown
                      isOpen={isAdvSearchMemoryUnitOpen}
                      onSelect={() => setIsAdvSearchMemoryUnitOpen(false)}
                      onOpenChange={(isOpen: boolean) => setIsAdvSearchMemoryUnitOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsAdvSearchMemoryUnitOpen(!isAdvSearchMemoryUnitOpen)}
                          isExpanded={isAdvSearchMemoryUnitOpen}
                          style={{ width: '100px' }}
                        >
                          GiB
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        <DropdownItem onClick={() => setAdvancedSearchMemoryUnit('GiB')}>GiB</DropdownItem>
                        <DropdownItem onClick={() => setAdvancedSearchMemoryUnit('MiB')}>MiB</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </SplitItem>
                </Split>
              </FormGroup>

              <FormGroup label="Storage class" fieldId="adv-search-storage">
                <Dropdown
                  isOpen={isAdvSearchStorageOpen}
                  onSelect={() => setIsAdvSearchStorageOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchStorageOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchStorageOpen(!isAdvSearchStorageOpen)}
                      isExpanded={isAdvSearchStorageOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchStorageClass || 'Select storage class'}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => setAdvancedSearchStorageClass('standard')}>standard</DropdownItem>
                    <DropdownItem onClick={() => setAdvancedSearchStorageClass('premium')}>premium</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FormGroup>

              <FormGroup label="Hardware devices" fieldId="adv-search-hardware">
                <Checkbox
                  id="adv-search-gpu"
                  label="GPU devices"
                  isChecked={advancedSearchGPU}
                  onChange={(_event, checked) => setAdvancedSearchGPU(checked)}
                  style={{ marginBottom: '8px' }}
                />
                <Checkbox
                  id="adv-search-host-devices"
                  label="Host devices"
                  isChecked={advancedSearchHostDevices}
                  onChange={(_event, checked) => setAdvancedSearchHostDevices(checked)}
                />
              </FormGroup>

              <FormGroup label="Date created" fieldId="adv-search-date">
                <Dropdown
                  isOpen={isAdvSearchDateOpen}
                  onSelect={() => setIsAdvSearchDateOpen(false)}
                  onOpenChange={(isOpen: boolean) => setIsAdvSearchDateOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsAdvSearchDateOpen(!isAdvSearchDateOpen)}
                      isExpanded={isAdvSearchDateOpen}
                      style={{ width: '100%' }}
                    >
                      {advancedSearchDateCreated === 'any' ? 'Any time' : advancedSearchDateCreated}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem onClick={() => setAdvancedSearchDateCreated('any')}>Any time</DropdownItem>
                    <DropdownItem onClick={() => setAdvancedSearchDateCreated('today')}>Today</DropdownItem>
                    <DropdownItem onClick={() => setAdvancedSearchDateCreated('week')}>Last 7 days</DropdownItem>
                    <DropdownItem onClick={() => setAdvancedSearchDateCreated('month')}>Last 30 days</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FormGroup>
            </ExpandableSection>

            {/* Divider between sections */}
            <Divider style={{ margin: '16px 0' }} />

            {/* Network Section */}
            <ExpandableSection
              toggleText="Network"
              onToggle={(_event, isExpanded) => setIsNetworkExpanded(isExpanded)}
              isExpanded={isNetworkExpanded}
              isIndented
            >
              <FormGroup label="IP address" fieldId="adv-search-ip">
                <TextInput
                  id="adv-search-ip"
                  value={advancedSearchIPAddress}
                  onChange={(_event, value) => setAdvancedSearchIPAddress(value)}
                  placeholder="IP address"
                />
              </FormGroup>

              <FormGroup label="Network Attachment Definitions" fieldId="adv-search-nad">
                <TextInput
                  id="adv-search-nad"
                  value=""
                  placeholder="Find by name"
                />
              </FormGroup>
            </ExpandableSection>
          </Form>
          
          {/* Spacer below last field */}
          <div style={{ height: '24px' }} />
        </div>
        
        {/* Sticky Footer with Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          padding: '16px 24px 24px 24px',
          borderTop: '1px solid var(--pf-t--global--border--color--default)',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          position: 'sticky',
          bottom: 0,
          marginTop: '-24px'
        }}>
          <Button variant="primary" onClick={() => {
            // Apply advanced search filters
            setIsAdvancedSearchActive(true);
            setIsAdvancedSearchOpen(false);
          }}>
            Search
          </Button>
          <Button variant="secondary" onClick={() => {
            // Reset all advanced search fields
            setAdvancedSearchName('');
            setAdvancedSearchCluster('all');
            setAdvancedSearchProject('all');
            setAdvancedSearchDescription('');
            setAdvancedSearchStatus('');
            setAdvancedSearchOS('');
            setAdvancedSearchVCPUValue('');
            setAdvancedSearchMemoryValue('');
            setAdvancedSearchStorageClass('');
            setAdvancedSearchGPU(false);
            setAdvancedSearchHostDevices(false);
            setAdvancedSearchDateCreated('any');
            setAdvancedSearchIPAddress('');
            // Deactivate advanced search filters
            setIsAdvancedSearchActive(false);
          }}>
            Reset
          </Button>
        </div>
      </Modal>

      <div className="vm-page">
        <div className="vm-header">
        <div style={{ padding: '24px' }}>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }} flexWrap={{ default: 'nowrap' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">Virtual machines</Title>
            </FlexItem>
            <FlexItem flex={{ default: 'flex_1' }}>
              <div style={{ position: 'relative' }}>
                <div ref={searchInputRef}>
                  <SearchInput
                    placeholder="Search cluster sets, clusters, projects, and VMs"
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
                {isSearchMenuOpen && (() => {
                  // Get all data from database and filter by search
                  const searchLower = sidebarSearch.toLowerCase();
                  
                  // Helper function to expand parent nodes
                  const expandParentNodes = (nodeId: string) => {
                    const nodesToExpand: string[] = ['all-cluster-sets']; // Always expand root
                    
                    if (nodeId.startsWith('vm-')) {
                      // Find VM and expand its parent path
                      const vm = getAllVirtualMachines().find(v => v.id === nodeId.replace('vm-', ''));
                      if (vm) {
                        const cluster = getAllClusters().find(c => c.id === vm.clusterId);
                        if (cluster) {
                          nodesToExpand.push(`clusterset-${cluster.clusterSetId}`);
                          nodesToExpand.push(`cluster-${cluster.id}`);
                          nodesToExpand.push(`namespace-${vm.namespaceId}`);
                        }
                      }
                    } else if (nodeId.startsWith('namespace-')) {
                      // Find namespace and expand its parent path
                      const namespace = getAllNamespaces().find(ns => ns.id === nodeId.replace('namespace-', ''));
                      if (namespace) {
                        const cluster = getAllClusters().find(c => c.id === namespace.clusterId);
                        if (cluster) {
                          nodesToExpand.push(`clusterset-${cluster.clusterSetId}`);
                          nodesToExpand.push(`cluster-${cluster.id}`);
                        }
                      }
                    } else if (nodeId.startsWith('cluster-')) {
                      // Find cluster and expand its parent path
                      const cluster = getAllClusters().find(c => c.id === nodeId.replace('cluster-', ''));
                      if (cluster) {
                        nodesToExpand.push(`clusterset-${cluster.clusterSetId}`);
                      }
                    }
                    
                    return nodesToExpand;
                  };
                  
                  // Search cluster sets
                  const matchingClusterSets = getAllClusterSets()
                    .filter(cs => cs.name.toLowerCase().includes(searchLower))
                    .slice(0, 3);
                  
                  // Search clusters
                  const matchingClusters = getAllClusters()
                    .filter(cluster => cluster.name.toLowerCase().includes(searchLower))
                    .slice(0, 5);
                  
                  // Search projects/namespaces
                  const allMatchingProjects = getAllNamespaces()
                    .filter(ns => ns.name.toLowerCase().includes(searchLower));
                  
                  // Filter projects based on toggle
                  const matchingProjects = allMatchingProjects
                    .filter(ns => {
                      if (!showOnlyWithVMs) return true;
                      const vmsInNamespace = getVirtualMachinesByNamespace(ns.id);
                      return vmsInNamespace.length > 0;
                    })
                    .slice(0, 5);
                  
                  // Count hidden projects (those with 0 VMs when toggle is on)
                  const hiddenProjectsCount = showOnlyWithVMs 
                    ? allMatchingProjects.filter(ns => {
                        const vmsInNamespace = getVirtualMachinesByNamespace(ns.id);
                        return vmsInNamespace.length === 0;
                      }).length
                    : 0;
                  
                  // Search virtual machines
                  const matchingVMs = getAllVirtualMachines()
                    .filter(vm => vm.name.toLowerCase().includes(searchLower))
                    .slice(0, 5);
                  
                  const hasResults = matchingClusterSets.length > 0 || matchingClusters.length > 0 || 
                                    matchingProjects.length > 0 || matchingVMs.length > 0 || hiddenProjectsCount > 0;
                  
                  return (
                  <div
                    className="search-dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      zIndex: 1000,
                        maxHeight: '400px',
                        overflowY: 'auto',
                    }}
                  >
                    <Menu>
                      <MenuContent>
                        <MenuList>
                            {matchingClusterSets.length > 0 && (
                              <>
                                <MenuItem isDisabled>
                                  <strong>Cluster Sets</strong>
                                </MenuItem>
                                {matchingClusterSets.map((clusterSet) => (
                              <MenuItem 
                                    key={clusterSet.id}
                                    icon={<MulticlusterIcon />}
                                onClick={() => {
                                      const nodeId = `clusterset-${clusterSet.id}`;
                                      setSelectedTreeNode(nodeId);
                                      const nodesToExpand = [...expandParentNodes(nodeId), nodeId];
                                      setExpandedNodes(nodesToExpand);
                                      setTreeKey(prev => prev + 1);
                                      setSidebarSearch(clusterSet.name);
                                  setIsSearchMenuOpen(false);
                                      setPage(1);
                                }}
                              >
                                <span>
                                  <span style={{ color: 'var(--pf-t--global--color--brand--default)', fontWeight: 600 }}>
                                        {clusterSet.name.substring(0, sidebarSearch.length)}
                                  </span>
                                      {clusterSet.name.substring(sidebarSearch.length)}
                                </span>
                              </MenuItem>
                            ))}
                          <Divider />
                              </>
                            )}
                            {matchingClusters.length > 0 && (
                              <>
                          <MenuItem isDisabled>
                                  <strong>Clusters</strong>
                          </MenuItem>
                                {matchingClusters.map((cluster) => (
                                  <MenuItem 
                                    key={cluster.id}
                                    icon={<ServerIcon />}
                                    onClick={() => {
                                      const nodeId = `cluster-${cluster.id}`;
                                      setSelectedTreeNode(nodeId);
                                      const nodesToExpand = [...expandParentNodes(nodeId), nodeId];
                                      setExpandedNodes(nodesToExpand);
                                      setTreeKey(prev => prev + 1);
                                      setSidebarSearch(cluster.name);
                                      setIsSearchMenuOpen(false);
                                      setPage(1);
                                    }}
                                  >
                                    <span>
                                      <span style={{ color: 'var(--pf-t--global--color--brand--default)', fontWeight: 600 }}>
                                        {cluster.name.substring(0, sidebarSearch.length)}
                                      </span>
                                      {cluster.name.substring(sidebarSearch.length)}
                                    </span>
                          </MenuItem>
                                ))}
                          <Divider />
                              </>
                            )}
                            {(matchingProjects.length > 0 || hiddenProjectsCount > 0) && (
                              <>
                                <MenuItem isDisabled>
                                  <strong>Projects</strong>
                                </MenuItem>
                                {matchingProjects.map((project) => {
                                  const cluster = getAllClusters().find(c => c.id === project.clusterId);
                                  return (
                                    <MenuItem 
                                      key={project.id}
                                      icon={<ProjectDiagramIcon />}
                                      onClick={() => {
                                        const nodeId = `namespace-${project.id}`;
                                        setSelectedTreeNode(nodeId);
                                        const nodesToExpand = [...expandParentNodes(nodeId), nodeId];
                                        setExpandedNodes(nodesToExpand);
                                        setTreeKey(prev => prev + 1);
                                        setSidebarSearch(project.name);
                                        setIsSearchMenuOpen(false);
                                        setPage(1);
                                      }}
                                    >
                                      <span>
                                        <span style={{ color: 'var(--pf-t--global--color--brand--default)', fontWeight: 600 }}>
                                          {project.name.substring(0, sidebarSearch.length)}
                                        </span>
                                        {project.name.substring(sidebarSearch.length)}
                                        {cluster && (
                                          <span style={{ color: '#6A6E73', fontSize: '0.875rem', marginLeft: '8px' }}>
                                            ({cluster.name})
                                          </span>
                                        )}
                                      </span>
                                    </MenuItem>
                                  );
                                })}
                                {hiddenProjectsCount > 0 && (
                                  <>
                                    <MenuItem isDisabled>
                                      <span style={{ 
                                        color: 'var(--pf-t--global--text--color--subtle)', 
                                        fontSize: '0.875rem'
                                      }}>
                                        {hiddenProjectsCount} project{hiddenProjectsCount > 1 ? 's' : ''} hidden (no VMs)
                                      </span>
                                    </MenuItem>
                                    <MenuItem 
                                      onClick={() => {
                                        setShowOnlyWithVMs(false);
                                        // Keep search open so user sees the newly revealed projects
                                      }}
                                    >
                                      <Button 
                                        variant="link" 
                                        isInline 
                                        style={{ padding: 0, fontSize: '0.875rem' }}
                                      >
                                        Show all projects
                                </Button>
                          </MenuItem>
                                  </>
                                )}
                                <Divider />
                              </>
                            )}
                            {matchingVMs.length > 0 && (
                              <>
                                <MenuItem isDisabled>
                                  <strong>Virtual Machines</strong>
                                </MenuItem>
                                {matchingVMs.map((vm) => {
                                  const cluster = getAllClusters().find(c => c.id === vm.clusterId);
                                  const project = getAllNamespaces().find(n => n.id === vm.namespaceId);
                                  return (
                                    <MenuItem 
                                      key={vm.id}
                                      icon={<DesktopIcon />}
                                      onClick={() => {
                                        const nodeId = `vm-${vm.id}`;
                                        setSelectedTreeNode(nodeId);
                                        const nodesToExpand = [...expandParentNodes(nodeId), nodeId];
                                        setExpandedNodes(nodesToExpand);
                                        setTreeKey(prev => prev + 1);
                                        setSidebarSearch(vm.name);
                                        setIsSearchMenuOpen(false);
                                        setPage(1);
                                      }}
                                    >
                                      <span>
                                        <span style={{ color: 'var(--pf-t--global--color--brand--default)', fontWeight: 600 }}>
                                          {vm.name.substring(0, sidebarSearch.length)}
                                        </span>
                                        {vm.name.substring(sidebarSearch.length)}
                                        {project && cluster && (
                                          <span style={{ color: '#6A6E73', fontSize: '0.875rem', marginLeft: '8px' }}>
                                            ({project.name} · {cluster.name})
                                          </span>
                                        )}
                                      </span>
                                    </MenuItem>
                                  );
                                })}
                              </>
                            )}
                            {!hasResults && (
                              <div style={{ padding: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: '#151515' }}>
                                  No results found for "{sidebarSearch}"
                                </div>
                                <div style={{ color: '#6A6E73' }}>
                                  Try using the{' '}
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => {
                                      setIsAdvancedSearchOpen(true);
                                      setIsSearchMenuOpen(false);
                                    }}
                                    style={{ padding: 0, fontSize: 'inherit' }}
                                  >
                                    advanced search
                                  </Button>
                                </div>
                              </div>
                            )}
                        </MenuList>
                      </MenuContent>
                    </Menu>
                  </div>
                  );
                })()}
              </div>
            </FlexItem>
            <FlexItem>
              <Button 
                variant="control" 
                aria-label="Advanced search"
                onClick={() => setIsAdvancedSearchOpen(true)}
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
              <Button variant="secondary" isDisabled={!isAdvancedSearchActive}>Save search</Button>
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
                  <DropdownItem isDisabled>
                    <div style={{ 
                      padding: '16px',
                      textAlign: 'center',
                      color: 'var(--pf-t--global--text--color--subtle)',
                      width: '280px',
                      whiteSpace: 'normal',
                      lineHeight: '1.5'
                    }}>
                      When you search for something and click 'Save search', it'll show up here.
                    </div>
                  </DropdownItem>
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
          
          {/* Divider between header and search results */}
          {isAdvancedSearchActive && (
            <div style={{ 
              margin: '24px 0',
              borderTop: '1px solid var(--pf-t--global--border--color--default)',
              width: '100%'
            }} />
          )}
          
          {/* Search Results Toolbar with Filters */}
          {isAdvancedSearchActive && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title headingLevel="h2" size="xl">Search results</Title>
                <Button 
                  variant="link" 
                  icon={<AngleLeftIcon />}
                  onClick={() => {
                    setIsAdvancedSearchActive(false);
                    // Reset all advanced search fields
                    setAdvancedSearchName('');
                    setAdvancedSearchCluster('all');
                    setAdvancedSearchProject('all');
                    setAdvancedSearchDescription('');
                    setAdvancedSearchStatus('');
                    setAdvancedSearchOS('');
                    setAdvancedSearchVCPUValue('');
                    setAdvancedSearchMemoryValue('');
                    setAdvancedSearchStorageClass('');
                    setAdvancedSearchGPU(false);
                    setAdvancedSearchHostDevices(false);
                    setAdvancedSearchDateCreated('any');
                    setAdvancedSearchIPAddress('');
                  }}
                >
                  Back to VirtualMachines list
                </Button>
              </div>
              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'nowrap' }}>
                <FlexItem>
                  <MenuToggle
                    variant="default"
                    onClick={() => {}}
                    isExpanded={false}
                  >
                    Cluster: {advancedSearchCluster !== 'all' ? getAllClusters().find(c => c.id === advancedSearchCluster)?.name : 'All'}
                  </MenuToggle>
                </FlexItem>
                <FlexItem>
                  <MenuToggle
                    variant="default"
                    onClick={() => {}}
                    isExpanded={false}
                  >
                    Project: {advancedSearchProject !== 'all' ? getAllNamespaces().find(ns => ns.id === advancedSearchProject)?.name : 'All'}
                  </MenuToggle>
                </FlexItem>
                <FlexItem>
                  <MenuToggle
                    variant="default"
                    onClick={() => {}}
                    isExpanded={false}
                  >
                    Storage class: {advancedSearchStorageClass || 'All'}
                  </MenuToggle>
                </FlexItem>
                <FlexItem>
                  <MenuToggle
                    variant="default"
                    onClick={() => {}}
                    isExpanded={false}
                  >
                    Hardware devices: {advancedSearchGPU || advancedSearchHostDevices ? 'Selected' : 'All'}
                  </MenuToggle>
                </FlexItem>
                <FlexItem>
                  <MenuToggle
                    variant="default"
                    onClick={() => {}}
                    isExpanded={false}
                  >
                    Scheduling: {advancedSearchDateCreated !== 'any' ? advancedSearchDateCreated : 'All'}
                  </MenuToggle>
                </FlexItem>
                <FlexItem>
                  <MenuToggle
                    variant="default"
                    onClick={() => {}}
                    isExpanded={false}
                  >
                    Node: All
                  </MenuToggle>
                </FlexItem>
              </Flex>
              <Flex style={{ marginTop: '12px' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                {advancedSearchName && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchName('')}
                      closeBtnAriaLabel="Remove name filter"
                    >
                      Name: {advancedSearchName}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchCluster !== 'all' && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchCluster('all')}
                      closeBtnAriaLabel="Remove cluster filter"
                    >
                      Cluster: {getAllClusters().find(c => c.id === advancedSearchCluster)?.name || advancedSearchCluster}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchProject !== 'all' && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchProject('all')}
                      closeBtnAriaLabel="Remove project filter"
                    >
                      Project: {getAllNamespaces().find(ns => ns.id === advancedSearchProject)?.name || advancedSearchProject}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchStatus && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchStatus('')}
                      closeBtnAriaLabel="Remove status filter"
                    >
                      Status: {advancedSearchStatus}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchOS && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchOS('')}
                      closeBtnAriaLabel="Remove OS filter"
                    >
                      Operating system: {advancedSearchOS}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchVCPUValue && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchVCPUValue('')}
                      closeBtnAriaLabel="Remove vCPU filter"
                    >
                      vCPU: {advancedSearchVCPUOperator} {advancedSearchVCPUValue}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchMemoryValue && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchMemoryValue('')}
                      closeBtnAriaLabel="Remove memory filter"
                    >
                      Memory: {advancedSearchMemoryOperator} {advancedSearchMemoryValue} {advancedSearchMemoryUnit}
                    </Label>
                  </FlexItem>
                )}
                {advancedSearchIPAddress && (
                  <FlexItem>
                    <Label 
                      color="grey" 
                      onClose={() => setAdvancedSearchIPAddress('')}
                      closeBtnAriaLabel="Remove IP address filter"
                    >
                      IP address: {advancedSearchIPAddress}
                    </Label>
                  </FlexItem>
                )}
                {(advancedSearchName || advancedSearchCluster !== 'all' || advancedSearchProject !== 'all' || 
                  advancedSearchStatus || advancedSearchOS || advancedSearchVCPUValue || 
                  advancedSearchMemoryValue || advancedSearchIPAddress) && (
                  <FlexItem>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setAdvancedSearchName('');
                        setAdvancedSearchCluster('all');
                        setAdvancedSearchProject('all');
                        setAdvancedSearchStatus('');
                        setAdvancedSearchOS('');
                        setAdvancedSearchVCPUValue('');
                        setAdvancedSearchMemoryValue('');
                        setAdvancedSearchIPAddress('');
                      }}
                    >
                      Clear all filters
                    </Button>
                  </FlexItem>
                )}
              </Flex>
            </div>
          )}
        </div>
      </div>
      
      <div 
        className={`vm-content-wrapper ${isSidebarCollapsed || isAdvancedSearchActive ? 'sidebar-collapsed' : ''}`}
        onClick={(e) => {
          // Clear VM selection when clicking in main content area
          const target = e.target as HTMLElement;
          // Don't clear if:
          // - Clicking on the sidebar itself
          // - Clicking on toolbar elements (buttons, dropdowns, inputs)
          // - Clicking on the table (checkboxes, rows)
          const isToolbarElement = target.closest('.pf-v6-c-toolbar') || 
                                   target.closest('.pf-v6-c-dropdown') || 
                                   target.closest('.pf-v6-c-menu') ||
                                   target.closest('button') ||
                                   target.closest('.pf-v6-c-table');
          
          if (!target.closest('.vm-sidebar') && !isToolbarElement && selectedVMs.length > 0) {
            setSelectedVMs([]);
          }
        }}
      >
        {!isSidebarCollapsed && !isAdvancedSearchActive && sidebar}
        
        {!isAdvancedSearchActive && (
        <Button
          variant="plain"
          className="sidebar-toggle"
          style={{ left: isSidebarCollapsed ? '0px' : `${sidebarWidth - 14}px` }}
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <AngleRightIcon /> : <AngleLeftIcon />}
        </Button>
        )}
        
        <div className="vm-main-content">
          {isDetailPage ? (
            <VirtualMachineDetail />
          ) : (
          <>
          {!isAdvancedSearchActive && breadcrumbHierarchy && (
          <div style={{ marginBottom: '16px', marginLeft: '-8px' }}>
            <Button
              variant="plain"
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              style={{
                padding: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--pf-t--global--text--color--regular)',
                background: 'transparent',
                border: 'none'
              }}
            >
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center',
                transition: 'transform 0.2s',
                transform: isSummaryExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                marginRight: '4px'
              }}>
                <CaretDownIcon style={{ fontSize: '12px' }} />
              </span>
              {breadcrumbHierarchy.isAllSelected ? (
                <>
                  <MulticlusterIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                  <span style={{ marginRight: '4px' }}>All cluster sets</span>
                  <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                  <ServerIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                  <span style={{ marginRight: '4px' }}>All clusters</span>
                  <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                  <ProjectDiagramIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                  <span>All projects</span>
                </>
              ) : breadcrumbHierarchy.isMultiProject ? (
                <>
                  {breadcrumbHierarchy.isStandalone ? (
                    <>
                      <ServerIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                      <span style={{ marginRight: '4px' }}>Standalone clusters</span>
                      <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                    </>
                  ) : breadcrumbHierarchy.clusterSet ? (
                    <>
                      <MulticlusterIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                      <span style={{ marginRight: '4px' }}>{breadcrumbHierarchy.clusterSet.name} (cluster set)</span>
                      <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                    </>
                  ) : null}
                  {breadcrumbHierarchy.cluster && (
                    <>
                      <ServerIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                      <span style={{ marginRight: '4px' }}>{breadcrumbHierarchy.cluster.name} (cluster)</span>
                      <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                    </>
                  )}
                  <ProjectDiagramIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                  {breadcrumbHierarchy.selectedNamespaces.map((ns, index) => (
                    <React.Fragment key={ns.id}>
                      {index > 0 && <span style={{ marginRight: '4px' }}>, </span>}
                      <span style={{ 
                        marginRight: index < breadcrumbHierarchy.selectedNamespaces.length - 1 ? 0 : '4px',
                        fontWeight: 600,
                        color: 'var(--pf-t--global--color--brand--default)'
                      }}>
                        {ns.name}
                      </span>
                    </React.Fragment>
                  ))}
                  <span style={{ marginLeft: '4px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    ({breadcrumbHierarchy.selectedNamespaces.length} projects)
                  </span>
                </>
              ) : (
                <>
                  {breadcrumbHierarchy.isStandalone ? (
                    <>
                      {/* Standalone cluster breadcrumb */}
                      <ServerIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                      <span style={{ marginRight: '4px' }}>Standalone clusters</span>
                      {breadcrumbHierarchy.cluster && (
                        <>
                          <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                          <ServerIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                          <span style={{ marginRight: '4px' }}>{breadcrumbHierarchy.cluster.name} (cluster)</span>
                          {breadcrumbHierarchy.namespace && (
                            <>
                              <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                              <ProjectDiagramIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                              <span>{breadcrumbHierarchy.namespace.name} (project)</span>
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Regular cluster set breadcrumb */}
                      {breadcrumbHierarchy.clusterSet && (
                        <>
                          <MulticlusterIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                          <span style={{ marginRight: '4px' }}>{breadcrumbHierarchy.clusterSet.name} (cluster set)</span>
                          {breadcrumbHierarchy.cluster && (
                            <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                          )}
                        </>
                      )}
                      {breadcrumbHierarchy.cluster && (
                        <>
                          <ServerIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                          <span style={{ marginRight: '4px' }}>{breadcrumbHierarchy.cluster.name} (cluster)</span>
                          {breadcrumbHierarchy.namespace && (
                            <AngleRightIcon style={{ fontSize: '12px', marginRight: '4px' }} />
                          )}
                        </>
                      )}
                      {breadcrumbHierarchy.namespace && (
                        <>
                          <ProjectDiagramIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                          <span>{breadcrumbHierarchy.namespace.name} (project)</span>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
          )}

          {!isAdvancedSearchActive && isSummaryExpanded && (
          <Card style={{ marginBottom: '16px' }}>
            <CardBody>
                <Flex>
                  <FlexItem flex={{ default: 'flex_1' }} style={{ paddingRight: '24px' }}>
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>Virtual Machines ({allVMs.length})</Title>
                      </FlexItem>
                      <FlexItem>
                        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                          <FlexItem>
                            <Button
                              variant="plain"
                              onClick={() => setStatusFilter('Error')}
                              style={{ padding: '8px', cursor: 'pointer' }}
                            >
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <ExclamationCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--danger--default)', fontSize: '16px' }} />
                                </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>{vmStatusCounts.Error}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Error</FlexItem>
                            </Flex>
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              onClick={() => setStatusFilter('Running')}
                              style={{ padding: '8px', cursor: 'pointer' }}
                            >
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <SyncAltIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)', fontSize: '16px' }} />
                                </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>{vmStatusCounts.Running}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Running</FlexItem>
                            </Flex>
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              onClick={() => setStatusFilter('Stopped')}
                              style={{ padding: '8px', cursor: 'pointer' }}
                            >
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <OffIcon style={{ color: 'var(--pf-t--global--icon--color--regular)', fontSize: '16px' }} />
                                </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>{vmStatusCounts.Stopped}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Stopped</FlexItem>
                            </Flex>
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              onClick={() => setStatusFilter('Paused')}
                              style={{ padding: '8px', cursor: 'pointer' }}
                            >
                            <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <PauseCircleIcon style={{ color: 'var(--pf-t--global--icon--color--regular)', fontSize: '16px' }} />
                                </FlexItem>
                                  <FlexItem style={{ fontSize: '24px', color: 'var(--pf-t--global--color--brand--default)' }}>{vmStatusCounts.Paused}</FlexItem>
                              </Flex>
                              <FlexItem style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>Paused</FlexItem>
                            </Flex>
                            </Button>
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
            </CardBody>
          </Card>
          )}
          
          {/* Search Results Content Area */}
          {isAdvancedSearchActive && filteredVMs.length === 0 ? (
            <EmptyState>
              <Title headingLevel="h2" size="lg">
                No results found
              </Title>
              <EmptyStateBody>
                No virtual machines match the selected filters. Try adjusting your search criteria.
              </EmptyStateBody>
              <EmptyStateActions>
                <Button 
                  variant="primary"
                  onClick={() => {
                    setAdvancedSearchName('');
                    setAdvancedSearchCluster('all');
                    setAdvancedSearchProject('all');
                    setAdvancedSearchStatus('');
                    setAdvancedSearchOS('');
                    setAdvancedSearchVCPUValue('');
                    setAdvancedSearchMemoryValue('');
                    setAdvancedSearchIPAddress('');
                  }}
                >
                  Clear all filters
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : selectedTreeNode === 'cluster-testcluster' && filteredVMs.length === 0 ? (
            <EmptyState>
              <Title headingLevel="h2" size="lg">
                No projects
              </Title>
              <EmptyStateBody>
                This cluster does not have any projects yet. Create a project to get started.
              </EmptyStateBody>
              <EmptyStateActions>
                <Button variant="primary">
                  Create project
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : selectedTreeNode && selectedTreeNode.startsWith('namespace-') && filteredVMs.length === 0 ? (
            <EmptyState>
              <Title headingLevel="h2" size="lg">
                No virtual machines
              </Title>
              <EmptyStateBody>
                This project does not have any virtual machines yet. Create a virtual machine to get started.
              </EmptyStateBody>
              <EmptyStateActions>
                <Button 
                  variant="primary"
                  onClick={() => {
                    // Open create VM wizard
                    setIsCreateVMWizardOpen(true);
                  }}
                >
                  Create VirtualMachine
                </Button>
              </EmptyStateActions>
            </EmptyState>
          ) : (
          <>
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
                              isChecked={isAllPageSelected || selectedVMs.length > 0}
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
                          {selectedVMs.length > 0 && (
                            <FlexItem>
                              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                                {selectedVMs.length} selected
                              </span>
                            </FlexItem>
                          )}
                          <FlexItem>
                            <CaretDownIcon />
                          </FlexItem>
                        </Flex>
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="select-none" onClick={handleDeselectAll}>
                        Select none
                      </DropdownItem>
                      <DropdownItem key="select-page" onClick={handleSelectPage}>
                        Select page ({sortedVMs.slice((page - 1) * perPage, page * perPage).length} items)
                      </DropdownItem>
                      <DropdownItem key="select-all" onClick={handleSelectAll}>
                        Select all ({sortedVMs.length} items)
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                {!isAdvancedSearchActive && (
                  <>
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
                  </>
                )}
                {!isAdvancedSearchActive && statusFilter !== 'All' && (
                  <ToolbarItem>
                    <LabelGroup categoryName="Status">
                      <Label color="blue" onClose={() => setStatusFilter('All')}>
                        {statusFilter}
                      </Label>
                    </LabelGroup>
                  </ToolbarItem>
                )}
                <ToolbarItem>
                  <SearchInput
                    placeholder="Search by name, IP, cluster, or namespace"
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
                        key="clone" 
                        onClick={(e) => {
                          console.log('🖱️ BULK CLONE clicked - selectedVMs:', selectedVMs);
                          setIsToolbarActionsOpen(false);
                          setIsCloneWizardOpen(true);
                        }}
                      >
                        Clone
                      </DropdownItem>
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
                      <DropdownItem key="edit" onClick={() => {
                        console.log('🖱️ EDIT VMs clicked - THIS WORKS!');
                      }}>
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
                                // Clear drop targets (not from drag-and-drop)
                                setDropTargetClusterId(undefined);
                                setDropTargetNamespaceId(undefined);
                                setIsWizardFromDragDrop(false);
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
                      itemCount={sortedVMs.length}
                      perPage={perPage}
                      page={page}
                      onSetPage={onSetPage}
                      onPerPageSelect={onPerPageSelect}
                      variant={PaginationVariant.top}
                      isCompact
                    />
                  </div>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            {/* Migration in progress banner */}
            {isMigrationInProgress && (() => {
              const handleNavigateToTarget = () => {
                if (targetLocation?.namespaceId && targetLocation?.clusterId) {
                  // Get the target namespace and cluster info
                  const targetNamespace = getNamespaceById(targetLocation.namespaceId);
                  const targetCluster = getClusterById(targetLocation.clusterId);
                  
                  if (targetNamespace && targetCluster) {
                    // Build the tree path to expand
                    const nodesToExpand: string[] = [];
                    
                    // Check if cluster belongs to a cluster set
                    if (targetCluster.clusterSetId) {
                      // Fleet Virtualization: Expand cluster set and cluster
                      nodesToExpand.push(`clusterset-${targetCluster.clusterSetId}`);
                      nodesToExpand.push(`cluster-${targetCluster.id}`);
                    } else {
                      // Standalone cluster: Expand standalone clusters section and the cluster
                      nodesToExpand.push('standalone-clusters');
                      nodesToExpand.push(`cluster-${targetCluster.id}`);
                    }
                    
                    // Expand all parent nodes to make target project visible
                    // Merge with existing expanded nodes
                    setExpandedNodes(prev => {
                      const newExpanded = [...prev];
                      nodesToExpand.forEach(nodeId => {
                        if (!newExpanded.includes(nodeId)) {
                          newExpanded.push(nodeId);
                        }
                      });
                      return newExpanded;
                    });
                    
                    // Select the target project in the tree
                    setSelectedTreeNode(`namespace-${targetLocation.namespaceId}`);
                    
                    // Clear any multi-project selection
                    setSelectedProjects([]);
                    
                    console.log(`📍 Navigating to target project: ${targetNamespace.name} in cluster ${targetCluster.name}`);
                  }
                }
              };
              
              return (
                <Alert
                  variant={allMigrationsComplete ? "success" : "info"}
                  title={allMigrationsComplete ? "All virtual machines have been migrated" : "Virtual machines in this project are migrating"}
                  isExpandable
                  style={{ marginBottom: '16px' }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    {allMigrationsComplete 
                      ? `All ${migratingVMIds.length} VMs have completed migration. Navigate to the target project to see them in their new location.`
                      : "The migration is in progress. You can check the VM status and details."
                    }
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Button 
                      variant="link" 
                      isInline 
                      style={{ padding: 0 }}
                      onClick={() => {
                        if (currentMigrationPlanId) {
                          navigate(`/virtualization/migration/${currentMigrationPlanId}`);
                        }
                      }}
                    >
                      View migration plan details
                    </Button>
                    {allMigrationsComplete ? (
                      <Button
                        variant="link"
                        isInline
                        style={{ padding: 0 }}
                        onClick={handleNavigateToTarget}
                      >
                        Navigate to target project
                      </Button>
                    ) : (
                      <Button
                        variant="link"
                        isInline
                        style={{ padding: 0 }}
                        onClick={() => setIsCancelMigrationModalOpen(true)}
                      >
                        Cancel migration All {migratingVMIds.length} VMs and revert changes
                      </Button>
                    )}
                  </div>
                </Alert>
              );
            })()}
            
            <Table aria-label="Virtual machines table" variant="compact">
              <Thead>
                <Tr>
                  <Th></Th>
                  {selectedColumns.name && <Th>Name</Th>}
                  {contextColumns.showClusterSet && <Th>Cluster set</Th>}
                  {contextColumns.showCluster && <Th>Cluster</Th>}
                  {contextColumns.showProject && <Th>Project</Th>}
                  {selectedColumns.namespace && <Th>Namespace</Th>}
                  {selectedColumns.status && (
                    isMigrationInProgress ? (
                      <Th>Status</Th>
                    ) : (
                      <Th
                        sort={{
                          sortBy: {
                            index: sortBy === 'status' ? 0 : undefined,
                            direction: sortDirection
                          },
                          onSort: () => handleSort('status'),
                          columnIndex: 0
                        }}
                      >
                        Status
                      </Th>
                    )
                  )}
                  {selectedColumns.conditions && <Th>Conditions</Th>}
                  {selectedColumns.node && <Th>Node</Th>}
                  {selectedColumns.ipAddress && <Th>IP address</Th>}
                  {selectedColumns.created && <Th>Created</Th>}
                  {selectedColumns.memory && <Th>Memory</Th>}
                  {selectedColumns.cpu && <Th>CPU</Th>}
                  {selectedColumns.network && <Th>Network</Th>}
                  {selectedColumns.deletionProtection && <Th>Deletion protection</Th>}
                  {selectedColumns.storageClass && <Th>Storage class</Th>}
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedVMs.slice((page - 1) * perPage, page * perPage).map((vm) => (
                  <Tr key={vm.id}>
                    <Td>
                      <Checkbox
                        id={`select-vm-${vm.id}`}
                        aria-label={`Select ${vm.name}`}
                        isChecked={selectedVMs.includes(vm.id)}
                        onChange={(_event, checked) => handleSelectVM(vm.id, checked)}
                      />
                    </Td>
                    {selectedColumns.name && (
                      <Td dataLabel="Name">
                        <Link to={`/virtualization/virtual-machines/${vm.id}`} style={{ color: 'var(--pf-t--global--color--brand--default)', textDecoration: 'none' }}>
                          {vm.name}
                        </Link>
                      </Td>
                    )}
                    {contextColumns.showClusterSet && (
                      <Td dataLabel="Cluster set">{vm.clusterSet}</Td>
                    )}
                    {contextColumns.showCluster && (
                      <Td dataLabel="Cluster">{vm.cluster}</Td>
                    )}
                    {contextColumns.showProject && (
                      <Td dataLabel="Project">{vm.project}</Td>
                    )}
                    {selectedColumns.namespace && (
                      <Td dataLabel="Namespace">{vm.namespace || 'default'}</Td>
                    )}
                    {selectedColumns.status && (
                    <Td dataLabel="Status">
                      {(() => {
                        // Get the actual VM from database to access migrationProgress
                        const { getAllVirtualMachines } = require('@app/data');
                        const allVMs = getAllVirtualMachines();
                        const actualVM = allVMs.find((v: any) => v.id === vm.originalId);
                        const percentage = actualVM?.migrationProgress ?? 0;
                        
                        if (vm.status === 'Migrating') {
                          const targetCluster = targetLocation ? getClusterById(targetLocation.clusterId) : null;
                          const targetNamespace = targetLocation ? getNamespaceById(targetLocation.namespaceId) : null;
                          
                          return (
                            <Popover
                              aria-label="Migration details"
                              headerContent={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <InProgressIcon />
                                  <span>Virtual machine is migrating</span>
                                </div>
                              }
                              bodyContent={
                                <div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <div style={{ marginBottom: '8px' }}>This VM is migrating to</div>
                                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                      <li>{targetCluster?.name || 'Unknown cluster'}</li>
                                      <li>{targetNamespace?.name || 'Unknown project'}</li>
                                    </ul>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '16px' }}>
                                    <Button 
                                      variant="link" 
                                      isInline 
                                      style={{ padding: 0, justifyContent: 'flex-start' }}
                                      onClick={() => {
                                        setMigrationPopoverVMId(null);
                                        if (currentMigrationPlanId) {
                                          navigate(`/virtualization/migration/${currentMigrationPlanId}`);
                                        }
                                      }}
                                    >
                                      View migration plan
                                    </Button>
                                    <Button 
                                      variant="link" 
                                      isInline 
                                      style={{ padding: 0, justifyContent: 'flex-start' }}
                                      onClick={() => {
                                        setMigrationPopoverVMId(null);
                                        setIsCancelMigrationModalOpen(true);
                                      }}
                                    >
                                      Cancel and revert migration plan
                                    </Button>
                                  </div>
                                </div>
                              }
                              isVisible={migrationPopoverVMId === vm.id}
                              shouldClose={() => setMigrationPopoverVMId(null)}
                            >
                              <div 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px',
                                  cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMigrationPopoverVMId(migrationPopoverVMId === vm.id ? null : vm.id);
                                }}
                              >
                                <span style={{ textDecoration: 'underline' }}>Migrating</span>
                                <InProgressIcon style={{ animation: 'spin 2s linear infinite' }} />
                                <span>{percentage}%</span>
                              </div>
                            </Popover>
                          );
                        } else if (vm.status === 'Pending') {
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ textDecoration: 'underline' }}>Pending</span>
                              <PauseCircleIcon style={{ color: 'var(--pf-t--global--text--color--subtle)' }} />
                              <span>0</span>
                            </div>
                          );
                        } else if (vm.status === 'Migrated') {
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ textDecoration: 'underline' }}>Migrated</span>
                              <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                              <span>100%</span>
                            </div>
                          );
                        } else {
                          return (
                            <Label color={vm.status === 'Running' ? 'green' : vm.status === 'Error' ? 'red' : 'grey'}>
                              {vm.status}
                            </Label>
                          );
                        }
                      })()}
                    </Td>
                    )}
                    {selectedColumns.conditions && (
                      <Td dataLabel="Conditions">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {vm.conditions && vm.conditions.length > 0 ? (
                            vm.conditions.map((condition, idx) => (
                              <div key={idx}>
                                <Label color="grey" isCompact>{condition}</Label>
                              </div>
                            ))
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                    </Td>
                    )}
                    {selectedColumns.node && (
                      <Td dataLabel="Node">{vm.node || '-'}</Td>
                    )}
                    {selectedColumns.ipAddress && (
                      <Td dataLabel="IP address">{vm.ip || '-'}</Td>
                    )}
                    {selectedColumns.created && (
                      <Td dataLabel="Created">{vm.created || 'N/A'}</Td>
                    )}
                    {selectedColumns.memory && (
                      <Td dataLabel="Memory">{vm.memory}</Td>
                    )}
                    {selectedColumns.cpu && (
                      <Td dataLabel="CPU">{vm.cpu}</Td>
                    )}
                    {selectedColumns.network && (
                      <Td dataLabel="Network">{vm.network || 'pod-network'}</Td>
                    )}
                    {selectedColumns.deletionProtection && (
                      <Td dataLabel="Deletion protection">
                        <Label color={vm.deletionProtection ? 'blue' : 'grey'}>
                          {vm.deletionProtection ? 'Enabled' : 'Disabled'}
                        </Label>
                    </Td>
                    )}
                    {selectedColumns.storageClass && (
                      <Td dataLabel="Storage class">{vm.storageClass || 'standard'}</Td>
                    )}
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
                            key="clone" 
                            onClick={(e) => {
                              console.log('🖱️ ROW CLONE clicked for VM:', vm.name, vm.id);
                              setSelectedVMs([vm.id]);
                              setOpenRowMenuId(null);
                              setIsCloneWizardOpen(true);
                            }}
                          >
                            Clone
                          </DropdownItem>
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
                          <DropdownItem key="edit" onClick={() => {
                            console.log('🖱️ ROW EDIT clicked for VM:', vm.name, '- THIS WORKS!');
                          }}>
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
                    itemCount={sortedVMs.length}
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
          </>
          )}
          </>
          )}
        </div>
      </div>
    </div>

    <MigrateVMsWizard
      isOpen={isMigrateWizardOpen}
      onClose={() => {
        setIsMigrateWizardOpen(false);
        setDropTargetClusterId(undefined);
        setDropTargetNamespaceId(undefined);
        setIsWizardFromDragDrop(false);
      }}
      onMigrationStart={(
        vmIds: string[], 
        originalLocations: Record<string, { clusterId: string; namespaceId: string }>,
        targetLoc: { clusterId: string; namespaceId: string },
        migrationPlanId: string
      ) => {
        setIsMigrationInProgress(true);
        setMigratingVMIds(vmIds);
        setOriginalVMLocations(originalLocations);
        setTargetLocation(targetLoc);
        setCurrentMigrationPlanId(migrationPlanId);
        setAllMigrationsComplete(false); // Reset completion state for new migration
        console.log(`📋 Tracking migration plan: ${migrationPlanId}`);
        // Note: We keep the current sort state, but sorting functionality is disabled
        // This preserves the order that VMs were in when migration started
      }}
      onVMStatusChange={() => {
        // Trigger re-render when VM statuses change
        setVmUpdateTrigger(prev => prev + 1);
      }}
      selectedVMs={selectedVMs}
      preselectedTargetCluster={dropTargetClusterId}
      preselectedTargetNamespace={dropTargetNamespaceId}
      isFromDragAndDrop={isWizardFromDragDrop}
    />

    {/* Clone VM Wizard - Debug logging */}
    {(() => {
      console.log('🔄 Rendering CloneVMsWizard with isOpen:', isCloneWizardOpen, 'selectedVMs:', selectedVMs);
      return null;
    })()}
    <CloneVMsWizard
      isOpen={isCloneWizardOpen}
      onClose={() => {
        console.log('❌ CloneVMsWizard onClose called');
        setIsCloneWizardOpen(false);
      }}
      selectedVMs={selectedVMs}
    />

    {/* Cancel Migration Confirmation Modal */}
    {isCancelMigrationModalOpen && (() => {
      // Count VMs by status
      const { getAllVirtualMachines } = require('@app/data');
      const { virtualMachines } = require('@app/data/mockDatabase');
      const allVirtualMachines = getAllVirtualMachines();
      
      let notStarted = 0;
      let inProgress = 0;
      let successfullyMigrated = 0;
      
      migratingVMIds.forEach(vmId => {
        const vm = allVirtualMachines.find((v: any) => v.id === vmId);
        if (vm) {
          if (vm.status === 'Pending') {
            notStarted++;
          } else if (vm.status === 'Migrating') {
            inProgress++;
          } else if (vm.status === 'Migrated') {
            successfullyMigrated++;
          }
        }
      });
      
      const handleCancelAndRevert = () => {
        // Revert all migrating VMs back to Running status
        // No need to restore location since we never changed it
        migratingVMIds.forEach(vmId => {
          const vmIndex = virtualMachines.findIndex((vm: any) => vm.id === vmId);
          if (vmIndex !== -1) {
            // Restore status to Running and clear progress
            virtualMachines[vmIndex].status = 'Running' as any;
            virtualMachines[vmIndex].migrationProgress = 0;
            console.log(`🔄 Reverted VM ${virtualMachines[vmIndex].name} to Running`);
          }
        });
        
        // Clear migration state (this also re-enables sorting)
        setIsMigrationInProgress(false);
        setMigratingVMIds([]);
        setOriginalVMLocations({});
        setTargetLocation(null);
        setCurrentMigrationPlanId(null);
        setAllMigrationsComplete(false);
        setIsCancelMigrationModalOpen(false);
        
        // Trigger UI update to refresh table and remove migrated VMs
        setVmUpdateTrigger(prev => prev + 1);
        
        console.log('✅ Migration cancelled and all VMs reverted');
        
        // Force a slight delay to ensure UI updates
        setTimeout(() => {
          setVmUpdateTrigger(prev => prev + 1);
        }, 100);
      };
      
      return (
        <Modal
          variant={ModalVariant.small}
          isOpen={isCancelMigrationModalOpen}
          onClose={() => setIsCancelMigrationModalOpen(false)}
          aria-labelledby="cancel-migration-title"
          aria-describedby="cancel-migration-description"
        >
          <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
              <ExclamationCircleIcon 
                style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--pf-t--global--icon--color--status--danger--default)',
                  marginTop: '2px'
                }} 
              />
              <div style={{ flex: 1 }}>
                <Title headingLevel="h2" size="xl" id="cancel-migration-title">
                  Cancel migration?
                </Title>
              </div>
              <Button
                variant="plain"
                onClick={() => setIsCancelMigrationModalOpen(false)}
                style={{ marginTop: '-8px', marginRight: '-8px' }}
              >
                <span style={{ fontSize: '1.25rem' }}>×</span>
              </Button>
            </div>
            
            {/* Description */}
            <div id="cancel-migration-description" style={{ marginBottom: '24px', fontSize: '0.875rem' }}>
              Migration is in progress. If you cancel the migration plan, you can't resume it and will need to create a new plan.
            </div>
            
            {/* Migration process status */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, marginBottom: '12px' }}>Migration process</div>
              <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PauseCircleIcon style={{ color: 'var(--pf-t--global--text--color--subtle)' }} />
                  <span>{notStarted} not started migrating</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <InProgressIcon />
                  <span>{inProgress} in progress</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                  <span>{successfullyMigrated} successfully migrated</span>
                </div>
              </div>
            </div>
            
            {/* Warning */}
            <Alert
              variant="warning"
              isInline
              title="All VMs (included in the migration plan) changes will be reverted."
              style={{ marginBottom: '24px' }}
            />
            
            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                variant="danger" 
                onClick={handleCancelAndRevert}
              >
                Cancel migration and revert changes
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsCancelMigrationModalOpen(false)}
              >
                Back
              </Button>
            </div>
          </div>
        </Modal>
      );
    })()}

    {/* Create VM Modal */}
    {isCreateVMWizardOpen && (
      <Modal
        variant="medium"
        title="Create VirtualMachine"
        isOpen={isCreateVMWizardOpen}
        onClose={() => setIsCreateVMWizardOpen(false)}
      >
        <Content style={{ padding: '24px' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
            Create a new virtual machine
          </Title>
          <p style={{ marginBottom: '24px' }}>
            This feature will allow you to create a new virtual machine in the selected project.
          </p>
        </Content>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'flex-end', 
          padding: '24px',
          borderTop: '1px solid var(--pf-t--global--border--color--default)'
        }}>
          <Button
            variant="secondary"
            onClick={() => setIsCreateVMWizardOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Create VM logic would go here
              setIsCreateVMWizardOpen(false);
            }}
          >
            Create
          </Button>
        </div>
      </Modal>
    )}

    {/* Drag & Drop Validation Modal */}
    {pendingDragDropAction && (() => {
      const vmsData = pendingDragDropAction.vmIds
        .map(id => getVirtualMachineById(id))
        .filter((vm): vm is NonNullable<typeof vm> => vm !== null && vm !== undefined);
      
      const runningVMs = vmsData.filter(vm => vm.status === 'Running');
      const nonRunningVMs = vmsData.filter(vm => vm.status !== 'Running');
      const allStopped = runningVMs.length === 0;
      
      // Detect multi-project
      const projectsMap: Record<string, { id: string; name: string; vmCount: number }> = {};
      vmsData.forEach(vm => {
        if (!projectsMap[vm.namespaceId]) {
          const namespace = getNamespaceById(vm.namespaceId);
          projectsMap[vm.namespaceId] = {
            id: vm.namespaceId,
            name: namespace?.name || vm.namespaceId,
            vmCount: 0
          };
        }
        projectsMap[vm.namespaceId].vmCount++;
      });
      const isMultiProject = Object.keys(projectsMap).length > 1;
      const projects = Object.values(projectsMap);
      const projectCount = projects.length;
      
      // Count all by status
      const statusBreakdown: Record<string, number> = {};
      vmsData.forEach(vm => {
        statusBreakdown[vm.status] = (statusBreakdown[vm.status] || 0) + 1;
      });
      
      // Helper function to get icon and color for each status
      const getStatusIcon = (status: string, vmId?: string) => {
        // Get actual percentage from VM if available
        let percentage = '0';
        if (vmId) {
          const { getAllVirtualMachines } = require('@app/data');
          const allVMs = getAllVirtualMachines();
          const actualVM = allVMs.find((v: any) => v.id === vmId);
          percentage = actualVM?.migrationProgress?.toString() ?? '0';
        }
        
        switch (status) {
          case 'Running':
            return { Icon: CheckCircleIcon, color: 'var(--pf-t--global--icon--color--status--success--default)' };
          case 'Stopped':
            return { Icon: OffIcon, color: 'var(--pf-t--global--text--color--regular)' };
          case 'Error':
            return { Icon: ExclamationCircleIcon, color: 'var(--pf-t--global--icon--color--status--danger--default)' };
          case 'Paused':
            return { Icon: PauseCircleIcon, color: 'var(--pf-t--global--icon--color--status--warning--default)' };
          case 'Starting':
          case 'Stopping':
            return { Icon: PauseCircleIcon, color: 'var(--pf-t--global--text--color--subtle)' };
          case 'Migrating':
            return { Icon: SyncAltIcon, color: 'var(--pf-t--global--icon--color--status--info--default)', progress: `${percentage}%` };
          case 'Pending':
            return { Icon: PauseCircleIcon, color: 'var(--pf-t--global--text--color--subtle)', progress: '0' };
          case 'Migrated':
            return { Icon: CheckCircleIcon, color: 'var(--pf-t--global--icon--color--status--success--default)', progress: '100%' };
          default:
            return { Icon: OffIcon, color: 'var(--pf-t--global--text--color--regular)' };
        }
      };

      return (
        <Modal
          variant={ModalVariant.small}
          isOpen={isDragDropValidationModalOpen}
          onClose={() => {
            setIsDragDropValidationModalOpen(false);
            setPendingDragDropAction(null);
            setDraggedVMId(null);
            setDropTargetId(null);
            // isDragCloneMode will be reset in drop handler after reading it
          }}
          aria-label="VM migration warning"
        >
          <div style={{ padding: '24px' }}>
            {/* Scenario 1: All VMs are stopped - BLOCK */}
            {allStopped ? (
              <>
                <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  Cannot proceed with migration
                </Title>

                <Content component="p" style={{ 
                  marginBottom: 'var(--pf-t--global--spacer--lg)',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  To (live) migrate a VM, it must be running. All <strong>{vmsData.length}</strong> selected virtual {vmsData.length === 1 ? 'machine is' : 'machines are'} stopped. Please start at least one VM to proceed with migration.
                </Content>

                {/* Show project info if multi-project */}
                {isMultiProject && (
                  <>
                    <Alert
                      variant="warning"
                      isInline
                      title={`VMs from ${projectCount} different projects selected`}
                      style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
                    >
                      <Content component="p" style={{ fontSize: '14px', marginTop: '8px' }}>
                        The selected virtual machines are from multiple projects. All VMs must be running to proceed with migration.
                      </Content>
                    </Alert>

                    <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                      <Content component="p" style={{ 
                        fontWeight: 'bold', 
                        marginBottom: 'var(--pf-t--global--spacer--sm)',
                        fontSize: '15px'
                      }}>
                        Source projects
                      </Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pf-t--global--spacer--sm)' }}>
                        {projects.map(project => (
                          <div key={project.id} style={{ fontSize: '15px' }}>
                            <strong>{project.name}</strong>: {project.vmCount} {project.vmCount === 1 ? 'VM' : 'VMs'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                  <Content component="p" style={{ 
                    fontWeight: 'bold', 
                    marginBottom: 'var(--pf-t--global--spacer--sm)',
                    fontSize: '15px'
                  }}>
                    Virtual machines statuses
                  </Content>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pf-t--global--spacer--sm)' }}>
                    {Object.entries(statusBreakdown).map(([status, count]) => {
                      const { Icon, color } = getStatusIcon(status);
                      return (
                        <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Icon style={{ color }} />
                          <span style={{ fontSize: '15px' }}>
                            <strong>{count}</strong> {count === 1 ? 'VM' : 'VMs'} {status.toLowerCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer with only Close button */}
                <div style={{ 
                  marginTop: 'var(--pf-t--global--spacer--lg)',
                  paddingTop: 'var(--pf-t--global--spacer--md)',
                  borderTop: '1px solid var(--pf-t--global--border--color--default)'
                }}>
                  <div style={{ 
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end'
                  }}>
                    <Button variant="primary" onClick={() => {
                      setIsDragDropValidationModalOpen(false);
                      setPendingDragDropAction(null);
                      setDraggedVMId(null);
                      setDropTargetId(null);
                      // isDragCloneMode will be reset in drop handler after reading it
                    }}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Scenarios 2-4: Some issues but can proceed */}
                <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  {isMultiProject && nonRunningVMs.length > 0
                    ? 'Multiple projects and VM statuses detected'
                    : isMultiProject
                    ? 'Multiple projects detected'
                    : 'Not all VMs will migrate'}
                </Title>

                {/* Multi-project warning */}
                {isMultiProject && (
                  <>
                    <Alert
                      variant="warning"
                      isInline
                      title={`VMs from ${projectCount} different projects selected`}
                      style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
                    >
                      <Content component="p" style={{ fontSize: '14px', marginTop: '8px' }}>
                        You have selected virtual machines from multiple projects. All VMs will be migrated to a single target project.
                      </Content>
                    </Alert>

                    <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                      <Content component="p" style={{ 
                        fontWeight: 'bold', 
                        marginBottom: 'var(--pf-t--global--spacer--sm)',
                        fontSize: '15px'
                      }}>
                        Source projects
                      </Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pf-t--global--spacer--sm)' }}>
                        {projects.map(project => (
                          <div key={project.id} style={{ fontSize: '15px' }}>
                            <strong>{project.name}</strong>: {project.vmCount} {project.vmCount === 1 ? 'VM' : 'VMs'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* VM status warning */}
                {nonRunningVMs.length > 0 && (
                  <>
                    <Content component="p" style={{ 
                      marginBottom: 'var(--pf-t--global--spacer--lg)',
                      fontSize: '16px',
                      lineHeight: '1.6'
                    }}>
                      To (live) migrate a VM, it must be running. <strong>{nonRunningVMs.length}</strong> out of selected <strong>{vmsData.length}</strong> virtual {nonRunningVMs.length === 1 ? 'machine is' : 'machines are'} not running.
                    </Content>
                    
                    <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                      <Content component="p" style={{ 
                        fontWeight: 'bold', 
                        marginBottom: 'var(--pf-t--global--spacer--sm)',
                        fontSize: '15px'
                      }}>
                        Virtual machines statuses
                      </Content>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pf-t--global--spacer--sm)' }}>
                        {Object.entries(statusBreakdown)
                          .sort(([statusA], [statusB]) => {
                            if (statusA === 'Running') return -1;
                            if (statusB === 'Running') return 1;
                            return statusA.localeCompare(statusB);
                          })
                          .map(([status, count]) => {
                            const { Icon, color } = getStatusIcon(status);
                            return (
                              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Icon style={{ color }} />
                                <span style={{ fontSize: '15px' }}>
                                  <strong>{count}</strong> {count === 1 ? 'VM' : 'VMs'} {status.toLowerCase()}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}
                
                <Content component="p" style={{ 
                  color: 'var(--pf-t--global--text--color--subtle)',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {nonRunningVMs.length > 0 
                    ? `If you would like to continue, only the selected ${runningVMs.length} running ${runningVMs.length === 1 ? 'VM' : 'VMs'} will be available for migration.`
                    : 'You can proceed with the migration of all selected VMs.'
                  }
                </Content>

                {/* Footer with buttons */}
                <div style={{ 
                  marginTop: 'var(--pf-t--global--spacer--lg)',
                  paddingTop: 'var(--pf-t--global--spacer--md)',
                  borderTop: '1px solid var(--pf-t--global--border--color--default)'
                }}>
                  <div style={{ 
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'flex-end'
                  }}>
                    <Button variant="link" onClick={() => {
                      setIsDragDropValidationModalOpen(false);
                      setPendingDragDropAction(null);
                      setDraggedVMId(null);
                      setDropTargetId(null);
                      // isDragCloneMode will be reset in drop handler after reading it
                    }}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleContinueAfterValidation}>
                      Continue to next step
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      );
    })()}

    <Modal
      variant={ModalVariant.small}
      isOpen={isDeleteModalOpen}
      onClose={() => {
        setIsDeleteModalOpen(false);
        setVmToDelete(null);
      }}
      aria-label="Delete virtual machine"
    >
      <div style={{ padding: '24px' }}>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: '16px' }}>
          Delete virtual machine
        </Title>
        <Content style={{ marginBottom: '24px' }}>
          Are you sure you want to delete this virtual machine? This action cannot be undone.
        </Content>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button 
            variant="secondary" 
            onClick={() => {
              setIsDeleteModalOpen(false);
              setVmToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={() => {
              console.log('Delete VM:', vmToDelete);
              // TODO: Actually delete the VM from data
              setIsDeleteModalOpen(false);
              setVmToDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>

    </>
  );
};

export { VirtualMachines };

