import * as React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Content,
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Title,
  Alert,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Divider,
  Label,
  Tooltip,
  TextArea,
} from '@patternfly/react-core';
import { CheckCircleIcon, OffIcon, ExclamationCircleIcon, PauseCircleIcon, PencilAltIcon, InProgressIcon, SearchIcon, TimesIcon, CheckIcon, ExternalLinkAltIcon, QuestionCircleIcon } from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';
import { 
  getVirtualMachineById, 
  getAllClusters, 
  getNamespacesByCluster,
  getClusterById,
  getNamespaceById,
  getAllVirtualMachines,
  createMigrationPlan,
  createNamespace,
  getVirtualMachinesByNamespace
} from '@app/data/queries';
const virtualMachines = getAllVirtualMachines();
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

interface MigrateVMsWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onMigrationStart?: (
    vmIds: string[], 
    originalLocations: Record<string, { clusterId: string; namespaceId: string }>,
    targetLocation: { clusterId: string; namespaceId: string },
    migrationPlanId: string
  ) => void;
  onVMStatusChange?: () => void;
  selectedVMs: string[];
  preselectedTargetCluster?: string;
  preselectedTargetNamespace?: string;
  isFromDragAndDrop?: boolean;
}

export const MigrateVMsWizard: React.FunctionComponent<MigrateVMsWizardProps> = ({
  isOpen,
  onClose,
  onMigrationStart,
  onVMStatusChange,
  selectedVMs,
  preselectedTargetCluster,
  preselectedTargetNamespace,
  isFromDragAndDrop = false,
}) => {
  const navigate = useNavigate();
  const [migrationName, setMigrationName] = React.useState('');
  const [migrationReason, setMigrationReason] = React.useState('Not stated');
  const [customReason, setCustomReason] = React.useState('');
  const [showProgress, setShowProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentMigrationPlanId, setCurrentMigrationPlanId] = React.useState<string>('');
  const [isCancelRevertModalOpen, setIsCancelRevertModalOpen] = React.useState(false);
  const [isReasonSelectOpen, setIsReasonSelectOpen] = React.useState(false);
  const [isVMDrawerOpen, setIsVMDrawerOpen] = React.useState(false);
  const [isStatusWarningModalOpen, setIsStatusWarningModalOpen] = React.useState(false);
  const [filteredVMIds, setFilteredVMIds] = React.useState<string[]>(selectedVMs);
  const [showWizardContent, setShowWizardContent] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(1);
  
  // Predefined migration reasons
  const predefinedReasons = [
    'Not stated',
    'Hardware maintenance',
    'Load balancing',
    'Disaster recovery',
    'Resource optimization',
    'Other'
  ];
  
  // Get the actual reason value (custom if "Other" is selected)
  const actualMigrationReason = migrationReason === 'Other' ? customReason : migrationReason;
  
  // Helper function to get icon and color for each status
  const getStatusIcon = (status: string) => {
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
      default:
        return { Icon: OffIcon, color: 'var(--pf-t--global--text--color--regular)' };
    }
  };
  
  // Get VM data
  const vmsToMigrate = React.useMemo(() => {
    return filteredVMIds.map(vmId => getVirtualMachineById(vmId)).filter(Boolean);
  }, [filteredVMIds]);
  
  // Get all selected VMs with their full data
  const allSelectedVMs = React.useMemo(() => {
    return selectedVMs
      .map(vmId => getVirtualMachineById(vmId))
      .filter((vm): vm is NonNullable<typeof vm> => vm !== null && vm !== undefined);
  }, [selectedVMs]);

  // Calculate VM status counts - break down by each status type
  const vmStatusCounts = React.useMemo(() => {
    const statusBreakdown: Record<string, number> = {};
    allSelectedVMs.forEach(vm => {
      statusBreakdown[vm.status] = (statusBreakdown[vm.status] || 0) + 1;
    });
    
    const running = allSelectedVMs.filter(vm => vm.status === 'Running');
    const nonRunning = allSelectedVMs.filter(vm => vm.status !== 'Running');
    
    return {
      running: running.length,
      nonRunning: nonRunning.length,
      total: allSelectedVMs.length,
      breakdown: statusBreakdown
    };
  }, [allSelectedVMs]);

  // Detect if VMs are from multiple projects
  const projectInfo = React.useMemo(() => {
    const projectsMap: Record<string, { id: string; name: string; vmCount: number }> = {};
    
    allSelectedVMs.forEach(vm => {
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
    
    const projects = Object.values(projectsMap);
    return {
      isMultiProject: projects.length > 1,
      projectCount: projects.length,
      projects: projects
    };
  }, [allSelectedVMs]);

  // Check VM statuses and project mixing when wizard opens
  React.useEffect(() => {
    if (isOpen && selectedVMs.length > 0) {
      console.log('VM Status & Project Check:', {
        total: vmStatusCounts.total,
        running: vmStatusCounts.running,
        nonRunning: vmStatusCounts.nonRunning,
        breakdown: vmStatusCounts.breakdown,
        projectCount: projectInfo.projectCount,
        isMultiProject: projectInfo.isMultiProject,
        projects: projectInfo.projects,
        vms: allSelectedVMs.map(vm => ({ id: vm.id, name: vm.name, status: vm.status, projectId: vm.namespaceId }))
      });

      // Scenario 1: All stopped + any project mix = BLOCK
      if (vmStatusCounts.running === 0) {
        setIsStatusWarningModalOpen(true);
        setShowWizardContent(false);
      }
      // Scenario 2: Some stopped + multi-project = WARN about both
      else if (vmStatusCounts.nonRunning > 0 && projectInfo.isMultiProject) {
        setIsStatusWarningModalOpen(true);
        setShowWizardContent(false);
      }
      // Scenario 3: All running + multi-project = WARN about projects
      else if (projectInfo.isMultiProject) {
        setIsStatusWarningModalOpen(true);
        setShowWizardContent(false);
      }
      // Scenario 4: Some stopped + single project = Current behavior
      else if (vmStatusCounts.nonRunning > 0) {
        setIsStatusWarningModalOpen(true);
        setShowWizardContent(false);
      }
      // All good, proceed
      else {
        setFilteredVMIds(selectedVMs);
        setShowWizardContent(true);
      }
    } else if (!isOpen) {
      // Reset when closed
      setShowWizardContent(false);
      setIsStatusWarningModalOpen(false);
    }
  }, [isOpen, selectedVMs, vmStatusCounts, projectInfo, allSelectedVMs]);
  
  // Get source info from first VM (assuming all VMs are from same source)
  const sourceVM = vmsToMigrate[0];
  const sourceCluster = sourceVM ? getClusterById(sourceVM.clusterId) : null;
  const sourceNamespace = sourceVM ? getNamespaceById(sourceVM.namespaceId) : null;
  
  // Get all clusters and namespaces
  const allClusters = React.useMemo(() => getAllClusters(), []);
  const [targetCluster, setTargetCluster] = React.useState('');
  const [targetProject, setTargetProject] = React.useState('');
  
  // Dropdown states for search functionality
  const [isTargetClusterOpen, setIsTargetClusterOpen] = React.useState(false);
  const [isTargetProjectOpen, setIsTargetProjectOpen] = React.useState(false);
  const [clusterSearchValue, setClusterSearchValue] = React.useState('');
  const [projectSearchValue, setProjectSearchValue] = React.useState('');
  
  // Create project modal state
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState('');
  const [projectCluster, setProjectCluster] = React.useState('');
  const [projectDisplayName, setProjectDisplayName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [namespacesRefreshTrigger, setNamespacesRefreshTrigger] = React.useState(0);
  
  // Edit inline states for network and storage mapping
  const [isNetworkEditMode, setIsNetworkEditMode] = React.useState(false);
  const [isStorageEditMode, setIsStorageEditMode] = React.useState(false);
  const [selectedTargetNetwork, setSelectedTargetNetwork] = React.useState('network1');
  const [selectedTargetStorage, setSelectedTargetStorage] = React.useState('storage1');
  const [tempTargetNetwork, setTempTargetNetwork] = React.useState('network1');
  const [tempTargetStorage, setTempTargetStorage] = React.useState('storage1');
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = React.useState(false);
  const [isStorageDropdownOpen, setIsStorageDropdownOpen] = React.useState(false);

  
  // Pre-select target cluster and namespace when provided (from drag-and-drop)
  React.useEffect(() => {
    if (isOpen && showWizardContent) {
      if (preselectedTargetCluster) {
        console.log('Pre-selecting target cluster from drag-and-drop:', preselectedTargetCluster);
        setTargetCluster(preselectedTargetCluster);
      }
      if (preselectedTargetNamespace) {
        console.log('Pre-selecting target namespace from drag-and-drop:', preselectedTargetNamespace);
        setTargetProject(preselectedTargetNamespace);
      }
    }
  }, [isOpen, showWizardContent, preselectedTargetCluster, preselectedTargetNamespace]);
  
  // Get namespaces for target cluster
  const targetNamespaces = React.useMemo(() => {
    if (!targetCluster) return [];
    return getNamespacesByCluster(targetCluster);
  }, [targetCluster, namespacesRefreshTrigger]);
  
  // Calculate VM counts per namespace
  const namespaceVMCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    targetNamespaces.forEach(namespace => {
      const vms = getVirtualMachinesByNamespace(namespace.id);
      counts[namespace.id] = vms.length;
    });
    return counts;
  }, [targetNamespaces]);
  
  // Filtered options for search
  const filteredClusters = React.useMemo(() => {
    if (!clusterSearchValue) return allClusters;
    return allClusters.filter(cluster => 
      cluster.name.toLowerCase().includes(clusterSearchValue.toLowerCase()) ||
      cluster.region?.toLowerCase().includes(clusterSearchValue.toLowerCase())
    );
  }, [allClusters, clusterSearchValue]);

  const filteredProjects = React.useMemo(() => {
    if (!projectSearchValue) return targetNamespaces;
    return targetNamespaces.filter(ns => 
      ns.name.toLowerCase().includes(projectSearchValue.toLowerCase())
    );
  }, [targetNamespaces, projectSearchValue]);
  
  // Validation
  const isSameLocation = React.useMemo(() => {
    if (!targetCluster || !targetProject || !sourceVM) return false;
    return targetCluster === sourceVM.clusterId && targetProject === sourceVM.namespaceId;
  }, [targetCluster, targetProject, sourceVM]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showProgress && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          // Increment by random amount between 1-5% every 200ms
          return Math.min(prev + Math.random() * 5 + 1, 100);
        });
      }, 200);
    }
    
    // When migration completes, just log it (don't auto-close)
    if (showProgress && progress >= 100) {
        console.log('✅ Migration completed successfully!');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showProgress, progress]);

  const handleClose = () => {
    // If migration was completed, reload the page to show updated VM locations
    if (showProgress && progress >= 100) {
      window.location.reload();
      return;
    }
    
    // Reset form
    setMigrationName('');
    setMigrationReason('Not stated');
    setCustomReason('');
    setShowProgress(false);
    setProgress(0);
    setIsReasonSelectOpen(false);
    setFilteredVMIds(selectedVMs);
    setIsStatusWarningModalOpen(false);
    setShowWizardContent(false);
    onClose();
  };

  const handleContinueWithRunningVMs = () => {
    const runningVMIds = allSelectedVMs
      .filter(vm => vm.status === 'Running')
      .map(vm => vm.id);
    
    console.log('Continuing with running VMs:', runningVMIds);
    setFilteredVMIds(runningVMIds);
    setIsStatusWarningModalOpen(false);
    setShowWizardContent(true); // Now show the wizard
  };

  const handleMigrateNow = () => {
    console.log('Starting migration:', {
      name: migrationName || `Migration-${new Date().toISOString().split('T')[0]}`,
      reason: actualMigrationReason,
      vms: selectedVMs,
      source: { cluster: sourceCluster?.name, namespace: sourceNamespace?.name },
      target: { cluster: targetCluster, namespace: targetProject },
    });
    
    // Filter only Running VMs and store their original locations
    const runningVMIds: string[] = [];
    const originalLocations: Record<string, { clusterId: string; namespaceId: string }> = {};
    
    selectedVMs.forEach(vmId => {
      const vmIndex = virtualMachines.findIndex(vm => vm.id === vmId);
      if (vmIndex !== -1 && virtualMachines[vmIndex].status === 'Running') {
        runningVMIds.push(vmId);
        // Store original location before migration
        originalLocations[vmId] = {
          clusterId: virtualMachines[vmIndex].clusterId,
          namespaceId: virtualMachines[vmIndex].namespaceId
        };
      }
    });
    
    console.log(`🚀 Migrating ${runningVMIds.length} running VMs out of ${selectedVMs.length} total selected`);
    
    // Create migration plan entry
    const targetNamespace = getNamespaceById(targetProject);
    const targetClusterObj = getClusterById(targetCluster);
    const migrationPlan = createMigrationPlan({
      name: migrationName || `Live migrating: ${runningVMIds.length} VMs`,
      namespace: targetNamespace?.name || targetProject,
      sourceProvider: 'host',
      targetProvider: 'host',
      sourceClusterId: sourceCluster?.id || runningVMIds[0] ? virtualMachines.find(vm => vm.id === runningVMIds[0])?.clusterId || '' : '',
      targetClusterId: targetCluster,
      targetNamespaceId: targetProject,
      vmIds: runningVMIds,
      status: 'In progress',
      migrationReadiness: 'Ready to migrate',
      migrationType: 'Live',
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      transferNetwork: 'Providers default',
      conditions: [
        {
          type: 'Ready',
          status: true,
          updated: new Date().toISOString(),
          reason: 'Evacuating',
          message: 'The migration plan is ready',
        },
      ],
    });
    
    console.log(`📋 Created migration plan: ${migrationPlan.id}`);
    
    // Store the migration plan ID for navigation
    setCurrentMigrationPlanId(migrationPlan.id);
    
    // Trigger migration state in parent component (only running VMs)
    if (onMigrationStart) {
      onMigrationStart(runningVMIds, originalLocations, {
        clusterId: targetCluster,
        namespaceId: targetProject
      }, migrationPlan.id);
    }
    
    // Set initial statuses for running VMs
    // IMPORTANT: We DON'T update cluster/namespace - VMs stay in source location
    // Only status and migrationProgress change to show progress to user
    // VMs will remain visible in source table until user refreshes the page
    runningVMIds.forEach((vmId, index) => {
      const vmIndex = virtualMachines.findIndex(vm => vm.id === vmId);
      if (vmIndex !== -1) {
        // Set first 5 VMs to "Migrating" at 0%, rest to "Pending"
        if (index < 5) {
          virtualMachines[vmIndex].status = 'Migrating' as any;
          virtualMachines[vmIndex].migrationProgress = 0;
          console.log(`✅ VM ${virtualMachines[vmIndex].name} → Migrating 0% (group 1)`);
        } else {
          virtualMachines[vmIndex].status = 'Pending' as any;
          virtualMachines[vmIndex].migrationProgress = 0;
          console.log(`⏳ VM ${virtualMachines[vmIndex].name} → Pending`);
        }
      }
    });
    
    // Trigger UI update
    if (onVMStatusChange) {
      onVMStatusChange();
    }
    
    // Progressive migration with percentage updates
    let currentGroup = 0;
    let currentPercentage = 0;
    const totalGroups = Math.ceil(runningVMIds.length / 5);
    const percentageSteps = [25, 50, 75, 100];
    let percentageIndex = 0;
    
    const migrationInterval = setInterval(() => {
      const startIndex = currentGroup * 5;
      const endIndex = Math.min(startIndex + 5, runningVMIds.length);
      
      // Update percentage for current group
      currentPercentage = percentageSteps[percentageIndex];
      
      for (let i = startIndex; i < endIndex; i++) {
        const vmId = runningVMIds[i];
        const vmIndex = virtualMachines.findIndex(vm => vm.id === vmId);
        if (vmIndex !== -1 && virtualMachines[vmIndex].status === 'Migrating') {
          virtualMachines[vmIndex].migrationProgress = currentPercentage;
          console.log(`📊 VM ${virtualMachines[vmIndex].name} → ${currentPercentage}%`);
          
          // If reached 100%, change status to Migrated
          if (currentPercentage === 100) {
            virtualMachines[vmIndex].status = 'Migrated' as any;
            console.log(`✅ VM ${virtualMachines[vmIndex].name} → Migrated (group ${currentGroup + 1})`);
          }
        }
      }
      
      percentageIndex++;
      
      // After reaching 100% for current group, move to next group
      if (percentageIndex >= percentageSteps.length) {
        percentageIndex = 0;
        currentGroup++;
        
        // Start next group if available
        if (currentGroup < totalGroups) {
          const nextStartIndex = currentGroup * 5;
          const nextEndIndex = Math.min(nextStartIndex + 5, runningVMIds.length);
          
          for (let i = nextStartIndex; i < nextEndIndex; i++) {
            const vmId = runningVMIds[i];
            const vmIndex = virtualMachines.findIndex(vm => vm.id === vmId);
            if (vmIndex !== -1 && virtualMachines[vmIndex].status === 'Pending') {
              virtualMachines[vmIndex].status = 'Migrating' as any;
              virtualMachines[vmIndex].migrationProgress = 0;
              console.log(`🚀 VM ${virtualMachines[vmIndex].name} → Migrating 0% (group ${currentGroup + 1})`);
            }
          }
        } else {
          // All done
          clearInterval(migrationInterval);
          console.log('🎉 All VMs migrated!');
        }
      }
      
      // Trigger UI update after each percentage change
      if (onVMStatusChange) {
        onVMStatusChange();
      }
    }, 1250); // 1.25 second intervals for percentage updates (25% → 50% → 75% → 100% = 5 seconds total per group)
    
    setShowProgress(true);
    setProgress(0);
  };

  const handleSave = () => {
    console.log('Saving migration plan for later:', {
      name: migrationName,
      reason: actualMigrationReason,
      vms: selectedVMs,
      source: { cluster: sourceCluster?.name, namespace: sourceNamespace?.name },
      target: { cluster: targetCluster, namespace: targetProject },
    });
    
    // Create migration plan entry with "Ready to migrate" status (not started yet)
    const targetNamespace = getNamespaceById(targetProject);
    const targetClusterObj = getClusterById(targetCluster);
    
    // Get all selected VMs (not just running ones)
    const allVMIds = selectedVMs;
    
    const migrationPlan = createMigrationPlan({
      name: migrationName || `Migration plan: ${allVMIds.length} VMs`,
      namespace: targetNamespace?.name || targetProject,
      sourceProvider: 'host',
      targetProvider: 'host',
      sourceClusterId: sourceCluster?.id || allVMIds[0] ? virtualMachines.find(vm => vm.id === allVMIds[0])?.clusterId || '' : '',
      targetClusterId: targetCluster,
      targetNamespaceId: targetProject,
      vmIds: allVMIds,
      status: 'Ready to migrate', // Plan is saved, not started
      migrationReadiness: 'Ready to migrate',
      migrationType: 'Live',
      createdAt: new Date().toISOString(),
      // No startedAt - migration hasn't started yet
      transferNetwork: 'Providers default',
      conditions: [
        {
          type: 'Ready',
          status: true,
          updated: new Date().toISOString(),
          reason: 'Saved',
          message: 'The migration plan is saved and ready to execute',
        },
      ],
    });
    
    console.log(`📋 Saved migration plan: ${migrationPlan.id} (Ready to migrate)`);
    
    // Close wizard without triggering migration
    handleClose();
  };

  const handleCancelMigration = () => {
    console.log('Migration cancelled from warning modal');
    setIsStatusWarningModalOpen(false);
    handleClose();
  };
  
  const handleViewMigrationPlan = () => {
    if (currentMigrationPlanId) {
      console.log(`Navigating to migration plan: ${currentMigrationPlanId}`);
      navigate(`/virtualization/migration/${currentMigrationPlanId}`);
      handleClose();
    }
  };
  
  const handleRevertMigration = () => {
    console.log('Opening cancel and revert confirmation modal');
    setIsCancelRevertModalOpen(true);
  };
  
  const handleConfirmCancelAndRevert = () => {
    console.log('Confirmed: Reverting migration and cancelling plan');
    // Close the modal
    setIsCancelRevertModalOpen(false);
    // Close the progress screen and wizard
    setShowProgress(false);
    setProgress(0);
    handleClose();
  };

  const generalInformationStep = (
    <div>
      <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
        General information
      </Title>
      
      <Form>
        <FormGroup label="Name">
          <TextInput
            type="text"
            id="migration-name"
            name="migration-name"
            value={migrationName}
            onChange={(_event, value) => setMigrationName(value)}
            placeholder={`Migration-${new Date().toISOString().split('T')[0]}`}
          />
          <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}>
            If you don't create a name, we'll generate a migration plan name for you
          </div>
        </FormGroup>

        <FormGroup label="Migration reason (optional)">
          <Select
            isOpen={isReasonSelectOpen}
            selected={migrationReason}
            onSelect={(_event, value) => {
              setMigrationReason(value as string);
              setIsReasonSelectOpen(false);
              // Clear custom reason if not selecting "Other"
              if (value !== 'Other') {
                setCustomReason('');
              }
            }}
            onOpenChange={(isOpen) => setIsReasonSelectOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsReasonSelectOpen(!isReasonSelectOpen)}
                isExpanded={isReasonSelectOpen}
                isFullWidth
              >
                {migrationReason}
              </MenuToggle>
            )}
          >
            <SelectList>
              {predefinedReasons.map((reason) => (
                <SelectOption key={reason} value={reason}>
                  {reason}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
          {migrationReason === 'Other' && (
            <>
              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '12px', marginBottom: '8px' }}>
                Specify your custom reason
              </div>
              <TextInput
                type="text"
                id="custom-reason"
                name="custom-reason"
                value={customReason}
                onChange={(_event, value) => setCustomReason(value)}
                placeholder="Type your custom reason here..."
              />
            </>
          )}
        </FormGroup>
      </Form>
    </div>
  );

  const targetPlacementStep = (
    <div>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
        Target placement
      </Title>
      
      {/* Validation warning */}
      {isSameLocation && (
        <Alert 
          variant="warning" 
          title="Same location selected" 
          style={{ marginBottom: '24px' }}
        >
          The target location is the same as the source. Please select a different cluster or project.
        </Alert>
      )}
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {/* Source Section */}
        <div style={{ 
          flex: 1, 
          border: '1px solid var(--pf-t--global--border--color--default)', 
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Source</h3>
          
          <FormGroup label="Cluster" style={{ marginBottom: '16px' }}>
            <TextInput
              type="text"
              value={sourceCluster?.name || 'N/A'}
              readOnly
              aria-label="Source cluster"
              style={{ 
                cursor: 'default', 
                pointerEvents: 'none',
                color: 'var(--pf-t--global--text--color--subtle)',
                backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
              }}
            />
          </FormGroup>

          <FormGroup label="Project">
            <TextInput
              type="text"
              value={sourceNamespace?.name || 'N/A'}
              readOnly
              aria-label="Source project"
              style={{ 
                cursor: 'default', 
                pointerEvents: 'none',
                color: 'var(--pf-t--global--text--color--subtle)',
                backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
              }}
            />
          </FormGroup>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
          →
        </div>

        {/* Target Section */}
        <div style={{ 
          flex: 1, 
          border: '1px solid var(--pf-t--global--border--color--default)', 
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: isFromDragAndDrop ? 'var(--pf-t--global--background--color--secondary--default)' : undefined
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Target *</h3>
            {!isFromDragAndDrop && (
              <Button 
                variant="link" 
                onClick={() => {
                  setTargetCluster('');
                  setTargetProject('');
                }}
                style={{ padding: 0, fontSize: '0.875rem' }}
              >
                Clear all
              </Button>
            )}
          </div>
          
          <FormGroup label="Cluster" style={{ marginBottom: '16px' }}>
            {isFromDragAndDrop ? (
              <TextInput
                type="text"
                value={allClusters.find(c => c.id === targetCluster)?.name || 'N/A'}
                readOnly
                aria-label="Target cluster"
                style={{ 
                  cursor: 'default', 
                  pointerEvents: 'none',
                  color: 'var(--pf-t--global--text--color--subtle)',
                  backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
                }}
              />
            ) : (
              <Select
                isOpen={isTargetClusterOpen}
                selected={targetCluster}
                onSelect={(_event, value) => {
                  setTargetCluster(value as string);
                  setTargetProject('');
                  setIsTargetClusterOpen(false);
                  setClusterSearchValue('');
                }}
                onOpenChange={(isOpen) => {
                  setIsTargetClusterOpen(isOpen);
                  if (!isOpen) {
                    setClusterSearchValue('');
                  }
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsTargetClusterOpen(!isTargetClusterOpen)}
                    isExpanded={isTargetClusterOpen}
                    isFullWidth
                  >
                    {targetCluster 
                      ? `${allClusters.find(c => c.id === targetCluster)?.name} (${allClusters.find(c => c.id === targetCluster)?.region})`
                      : 'Select cluster'}
                  </MenuToggle>
                )}
              >
                <TextInputGroup style={{ padding: '8px' }}>
                  <TextInputGroupMain
                    value={clusterSearchValue}
                    onChange={(_event, value) => setClusterSearchValue(value)}
                    placeholder="Search by name"
                    icon={<SearchIcon />}
                  />
                  {clusterSearchValue && (
                    <TextInputGroupUtilities>
                      <Button
                        variant="plain"
                        onClick={() => setClusterSearchValue('')}
                        aria-label="Clear search"
                      >
                        <TimesIcon />
                      </Button>
                    </TextInputGroupUtilities>
                  )}
                </TextInputGroup>
                <Divider />
                <SelectList>
                  {filteredClusters.length > 0 ? (
                    filteredClusters.map(cluster => (
                      <SelectOption key={cluster.id} value={cluster.id}>
                        {cluster.name} ({cluster.region})
                      </SelectOption>
                    ))
                  ) : (
                    <SelectOption isDisabled>No results found</SelectOption>
                  )}
                </SelectList>
              </Select>
            )}
          </FormGroup>

          <FormGroup label="Project">
            {isFromDragAndDrop ? (
              <TextInput
                type="text"
                value={targetNamespaces.find(ns => ns.id === targetProject)?.name || 'N/A'}
                readOnly
                aria-label="Target project"
                style={{ 
                  cursor: 'default', 
                  pointerEvents: 'none',
                  color: 'var(--pf-t--global--text--color--subtle)',
                  backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
                }}
              />
            ) : (
              <Select
                isOpen={isTargetProjectOpen}
                selected={targetProject}
                onSelect={(_event, value) => {
                  if (!targetCluster) return;
                  setTargetProject(value as string);
                  setIsTargetProjectOpen(false);
                  setProjectSearchValue('');
                }}
                onOpenChange={(isOpen) => {
                  if (!targetCluster) return;
                  setIsTargetProjectOpen(isOpen);
                  if (!isOpen) {
                    setProjectSearchValue('');
                  }
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => {
                      if (targetCluster) {
                        setIsTargetProjectOpen(!isTargetProjectOpen);
                      }
                    }}
                    isExpanded={isTargetProjectOpen}
                    isFullWidth
                isDisabled={!targetCluster}
                  >
                    {targetProject 
                      ? targetNamespaces.find(ns => ns.id === targetProject)?.name 
                      : (targetCluster ? 'Select project' : 'To select a project, pick a cluster')}
                  </MenuToggle>
                )}
              >
                <TextInputGroup style={{ padding: '8px' }}>
                  <TextInputGroupMain
                    value={projectSearchValue}
                    onChange={(_event, value) => setProjectSearchValue(value)}
                    placeholder="Search by name"
                    icon={<SearchIcon />}
                  />
                  {projectSearchValue && (
                    <TextInputGroupUtilities>
                      <Button
                        variant="plain"
                        onClick={() => setProjectSearchValue('')}
                        aria-label="Clear search"
                      >
                        <TimesIcon />
                      </Button>
                    </TextInputGroupUtilities>
                  )}
                </TextInputGroup>
                <div style={{ padding: '8px 4px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <Button 
                    variant="link" 
                    isInline 
                    onClick={() => {
                      setIsTargetProjectOpen(false);
                      // Pre-populate the cluster field with the selected target cluster
                      const selectedClusterName = allClusters.find(c => c.id === targetCluster)?.name || '';
                      setProjectCluster(selectedClusterName);
                      setIsCreateProjectModalOpen(true);
                    }}
                    style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                  >
                    + Create project
                  </Button>
                </div>
                <SelectList>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map(namespace => {
                      const vmCount = namespaceVMCounts[namespace.id] || 0;
                      return (
                        <SelectOption key={namespace.id} value={namespace.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <span>{namespace.name}</span>
                            <Label isCompact color="blue">{vmCount} VMs</Label>
                          </div>
                        </SelectOption>
                      );
                    })
                  ) : (
                    <SelectOption isDisabled>
                      {targetNamespaces.length === 0 ? 'No projects available' : 'No results found'}
                    </SelectOption>
                  )}
                </SelectList>
              </Select>
            )}
          </FormGroup>
        </div>
      </div>
    </div>
  );

  const [selectedCheck, setSelectedCheck] = React.useState<string>('network');
  
  // Migration readiness checking state
  const [checksCompleted, setChecksCompleted] = React.useState<{
    network: boolean;
    storage: boolean;
    compute: boolean;
    version: boolean;
    resource: boolean;
  }>({
    network: false,
    storage: false,
    compute: false,
    version: false,
    resource: false
  });

  const allChecksCompleted = Object.values(checksCompleted).every(check => check);

  // Run checks sequentially when user lands on Migration readiness step
  React.useEffect(() => {
    if (activeStep === 3) {
      // Reset all checks first
      setChecksCompleted({
        network: false,
        storage: false,
        compute: false,
        version: false,
        resource: false
      });

      // Run checks sequentially with delays
      const checkOrder: Array<keyof typeof checksCompleted> = ['network', 'storage', 'compute', 'version', 'resource'];
      
      checkOrder.forEach((checkName, index) => {
        setTimeout(() => {
          setChecksCompleted(prev => ({
            ...prev,
            [checkName]: true
          }));
        }, (index + 1) * 800); // 800ms delay between each check
      });
    }
  }, [activeStep]);

  // Get target cluster object
  const targetClusterObj = React.useMemo(() => {
    return targetCluster ? getClusterById(targetCluster) : null;
  }, [targetCluster]);

  // Get target namespace object
  const targetNamespaceObj = React.useMemo(() => {
    return targetProject ? getNamespaceById(targetProject) : null;
  }, [targetProject]);

  // Calculate total resources from selected VMs
  const totalVMResources = React.useMemo(() => {
    const totals = {
      storage: 0,
      memory: 0,
      cpu: 0
    };
    
    vmsToMigrate.forEach(vm => {
      if (!vm) return;
      
      // Extract numbers from strings like "50 GB", "8 GiB"
      if (vm.storage) {
        const storageMatch = vm.storage.match(/(\d+)/);
        if (storageMatch) totals.storage += parseInt(storageMatch[1]);
      }
      if (vm.memory) {
        const memoryMatch = vm.memory.match(/(\d+)/);
        if (memoryMatch) totals.memory += parseInt(memoryMatch[1]);
      }
      // CPU is already a number (cores)
      if (vm.cpu) {
        totals.cpu += vm.cpu;
      }
    });
    
    return totals;
  }, [vmsToMigrate]);

  const renderCheckDetail = () => {
    switch (selectedCheck) {
      case 'network':
        return (
          <div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>Network mapping</Title>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '150px' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', minHeight: '32px', display: 'flex', alignItems: 'center' }}>Source network</div>
                {isNetworkEditMode ? (
                  <TextInput
                    value="network1"
                    type="text"
                    aria-label="Source network"
                    readOnly
                    style={{
                      backgroundColor: '#ffffff',
                      width: '150px'
                    }}
                  />
                ) : (
                  <div>network1</div>
                )}
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--pf-t--global--text--color--subtle)', paddingTop: '32px' }}>→</div>
              <div style={{ minWidth: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', minHeight: '32px' }}>
                  <div style={{ fontWeight: 600 }}>Target network</div>
                  {!isNetworkEditMode ? (
                    <Button 
                      variant="link" 
                      style={{ 
                        padding: 0,
                        backgroundColor: 'transparent',
                        opacity: checksCompleted.network ? 1 : 0.5,
                        cursor: checksCompleted.network ? 'pointer' : 'not-allowed'
                      }} 
                      isDisabled={!checksCompleted.network}
                      onClick={() => {
                        console.log('Edit clicked - setting edit mode to true');
                        setTempTargetNetwork(selectedTargetNetwork);
                        setIsNetworkEditMode(true);
                        setTimeout(() => {
                          setIsNetworkDropdownOpen(true);
                        }, 50);
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <PencilAltIcon /> Edit
                      </span>
                    </Button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button 
                        variant="plain"
                        onClick={() => {
                          console.log('Confirm clicked - saving change');
                          setSelectedTargetNetwork(tempTargetNetwork);
                          setIsNetworkEditMode(false);
                          setIsNetworkDropdownOpen(false);
                        }}
                        style={{ padding: '4px' }}
                      >
                        <CheckIcon style={{ fontSize: '1rem', color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                      </Button>
                      <Button 
                        variant="plain"
                        onClick={() => {
                          console.log('Cancel clicked - reverting change');
                          setTempTargetNetwork(selectedTargetNetwork);
                          setIsNetworkEditMode(false);
                          setIsNetworkDropdownOpen(false);
                        }}
                        style={{ padding: '4px' }}
                      >
                        <TimesIcon style={{ fontSize: '1rem' }} />
                      </Button>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '8px' }}>
                  {isNetworkEditMode ? (
                    <Select
                      id="network-inline-select"
                      isOpen={isNetworkDropdownOpen}
                      selected={tempTargetNetwork}
                      onSelect={(_event, value) => {
                        console.log('Network selected:', value);
                        setTempTargetNetwork(value as string);
                        // Keep dropdown open after selection
                      }}
                      onOpenChange={(isOpen) => {
                        console.log('Dropdown open change:', isOpen);
                        setIsNetworkDropdownOpen(isOpen);
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {
                            console.log('Toggle clicked, current state:', isNetworkDropdownOpen);
                            setIsNetworkDropdownOpen(!isNetworkDropdownOpen);
                          }}
                          isExpanded={isNetworkDropdownOpen}
                          style={{
                            width: '200px',
                            backgroundColor: '#ffffff'
                          }}
                        >
                          {tempTargetNetwork}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="network1">network1</SelectOption>
                        <SelectOption value="network2">network2</SelectOption>
                        <SelectOption value="network3">network3</SelectOption>
                      </SelectList>
                    </Select>
                  ) : (
                    <div>{selectedTargetNetwork}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'storage':
        return (
          <div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>Storage mapping</Title>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '150px' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', minHeight: '32px', display: 'flex', alignItems: 'center' }}>Source storage</div>
                {isStorageEditMode ? (
                  <TextInput
                    value="storage1"
                    type="text"
                    aria-label="Source storage"
                    readOnly
                    style={{
                      backgroundColor: '#ffffff',
                      width: '150px'
                    }}
                  />
                ) : (
                  <div>storage1</div>
                )}
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--pf-t--global--text--color--subtle)', paddingTop: '32px' }}>→</div>
              <div style={{ minWidth: '150px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', minHeight: '32px' }}>
                  <div style={{ fontWeight: 600 }}>Target storage</div>
                  {!isStorageEditMode ? (
                    <Button 
                      variant="link" 
                      style={{ 
                        padding: 0,
                        backgroundColor: 'transparent',
                        opacity: checksCompleted.storage ? 1 : 0.5,
                        cursor: checksCompleted.storage ? 'pointer' : 'not-allowed'
                      }} 
                      isDisabled={!checksCompleted.storage}
                      onClick={() => {
                        console.log('Storage Edit clicked - setting edit mode to true');
                        setTempTargetStorage(selectedTargetStorage);
                        setIsStorageEditMode(true);
                        setTimeout(() => {
                          setIsStorageDropdownOpen(true);
                        }, 50);
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <PencilAltIcon /> Edit
                      </span>
                    </Button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button 
                        variant="plain"
                        onClick={() => {
                          console.log('Storage Confirm clicked - saving change');
                          setSelectedTargetStorage(tempTargetStorage);
                          setIsStorageEditMode(false);
                          setIsStorageDropdownOpen(false);
                        }}
                        style={{ padding: '4px' }}
                      >
                        <CheckIcon style={{ fontSize: '1rem', color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
                      </Button>
                      <Button 
                        variant="plain"
                        onClick={() => {
                          console.log('Storage Cancel clicked - reverting change');
                          setTempTargetStorage(selectedTargetStorage);
                          setIsStorageEditMode(false);
                          setIsStorageDropdownOpen(false);
                        }}
                        style={{ padding: '4px' }}
                      >
                        <TimesIcon style={{ fontSize: '1rem' }} />
                      </Button>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '8px' }}>
                  {isStorageEditMode ? (
                    <Select
                      id="storage-inline-select"
                      isOpen={isStorageDropdownOpen}
                      selected={tempTargetStorage}
                      onSelect={(_event, value) => {
                        console.log('Storage selected:', value);
                        setTempTargetStorage(value as string);
                        // Keep dropdown open after selection
                      }}
                      onOpenChange={(isOpen) => {
                        console.log('Storage dropdown open change:', isOpen);
                        setIsStorageDropdownOpen(isOpen);
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {
                            console.log('Storage toggle clicked, current state:', isStorageDropdownOpen);
                            setIsStorageDropdownOpen(!isStorageDropdownOpen);
                          }}
                          isExpanded={isStorageDropdownOpen}
                          style={{
                            width: '200px',
                            backgroundColor: '#ffffff'
                          }}
                        >
                          {tempTargetStorage}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="storage1">storage1</SelectOption>
                        <SelectOption value="storage2">storage2</SelectOption>
                        <SelectOption value="storage3">storage3</SelectOption>
                      </SelectList>
                    </Select>
                  ) : (
                    <div>{selectedTargetStorage}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'compute':
        return (
          <div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>Compute compatibility</Title>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>Source cluster compute</div>
                <div>Compute1</div>
              </div>
              <div style={{ fontSize: '1.5rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>Target cluster compute</div>
                <div>Compute1</div>
              </div>
            </div>
          </div>
        );
      case 'version':
        return (
          <div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>Version compatibility</Title>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, marginBottom: '12px' }}>OpenShift version</div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>Source cluster</div>
                  <div>{sourceCluster?.kubernetesVersion || '4.20'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>Target cluster</div>
                  <div>{targetClusterObj?.kubernetesVersion || '4.20'}</div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '12px' }}>Virtualization operator version</div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>Source cluster</div>
                  <div>4.19</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>Target cluster</div>
                  <div>4.19</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'resource':
        // Mock target capacity (in a real app, this would come from cluster metrics)
        const targetCapacity = {
          storage: { total: 500, used: 145, free: 355 },
          memory: { total: 128, used: 42, free: 86 },
          cpu: { total: 32, used: 11, free: 21 }
        };
        
        return (
          <div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>Resource capacity</Title>
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
              <div style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--pf-t--global--color--brand--default)',
                  borderRadius: '2px'
                }}></span>
                Source size
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                <div>Storage {totalVMResources.storage} GB</div>
                <div>Memory {totalVMResources.memory} GB</div>
                <div>CPU {totalVMResources.cpu} cores</div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '16px' }}>
                Target cluster capacity ({targetClusterObj?.name || 'test-south-eu'})
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Storage: {targetCapacity.storage.total} GB</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '24px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                  display: 'flex',
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: `${(targetCapacity.storage.used / targetCapacity.storage.total) * 100}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--text--color--regular)',
                    zIndex: 1
                  }}></div>
                  <div style={{ 
                    position: 'absolute',
                    left: `${(targetCapacity.storage.used / targetCapacity.storage.total) * 100}%`,
                    width: `${(totalVMResources.storage / targetCapacity.storage.total) * 100}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--color--brand--default)',
                    zIndex: 2
                  }}></div>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>■</span> {targetCapacity.storage.used} GB used
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--pf-t--global--color--brand--default)' }}>■</span> {totalVMResources.storage} GB source
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#d2d2d2' }}>■</span> {Math.max(0, targetCapacity.storage.free - totalVMResources.storage)} GB free after migration
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Memory: {targetCapacity.memory.total} GB</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '24px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                  display: 'flex',
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: `${(targetCapacity.memory.used / targetCapacity.memory.total) * 100}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--text--color--regular)',
                    zIndex: 1
                  }}></div>
                  <div style={{ 
                    position: 'absolute',
                    left: `${(targetCapacity.memory.used / targetCapacity.memory.total) * 100}%`,
                    width: `${(totalVMResources.memory / targetCapacity.memory.total) * 100}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--color--brand--default)',
                    zIndex: 2
                  }}></div>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>■</span> {targetCapacity.memory.used} GB used
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--pf-t--global--color--brand--default)' }}>■</span> {totalVMResources.memory} GB source
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#d2d2d2' }}>■</span> {Math.max(0, targetCapacity.memory.free - totalVMResources.memory)} GB free after migration
                  </span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>CPU: {targetCapacity.cpu.total} cores</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '24px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                  display: 'flex',
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: `${(targetCapacity.cpu.used / targetCapacity.cpu.total) * 100}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--text--color--regular)',
                    zIndex: 1
                  }}></div>
                  <div style={{ 
                    position: 'absolute',
                    left: `${(targetCapacity.cpu.used / targetCapacity.cpu.total) * 100}%`,
                    width: `${(totalVMResources.cpu / targetCapacity.cpu.total) * 100}%`, 
                    height: '100%', 
                    backgroundColor: 'var(--pf-t--global--color--brand--default)',
                    zIndex: 2
                  }}></div>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>■</span> {targetCapacity.cpu.used} cores used
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--pf-t--global--color--brand--default)' }}>■</span> {totalVMResources.cpu} cores source
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#d2d2d2' }}>■</span> {Math.max(0, targetCapacity.cpu.free - totalVMResources.cpu)} cores free after migration
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRunChecksAgain = () => {
    // Reset all checks
    setChecksCompleted({
      network: false,
      storage: false,
      compute: false,
      version: false,
      resource: false
    });

    // Run checks sequentially with delays
    const checkOrder: Array<keyof typeof checksCompleted> = ['network', 'storage', 'compute', 'version', 'resource'];
    
    checkOrder.forEach((checkName, index) => {
      setTimeout(() => {
        setChecksCompleted(prev => ({
          ...prev,
          [checkName]: true
        }));
      }, (index + 1) * 800);
    });
  };

  const migrationReadinessStep = (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Title headingLevel="h2" size="xl">
          Migration readiness
        </Title>
        <Button 
          variant="link" 
          style={{ 
            padding: 0,
            opacity: allChecksCompleted ? 1 : 0.5,
            cursor: allChecksCompleted ? 'pointer' : 'not-allowed',
            backgroundColor: 'transparent'
          }} 
          onClick={allChecksCompleted ? handleRunChecksAgain : undefined}
          isDisabled={!allChecksCompleted}
        >
          Run again
        </Button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px 16px',
        backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        {allChecksCompleted ? (
          <>
            <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
            <span style={{ fontWeight: 600 }}>Ready to migrate</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
          5 successful checks
        </span>
          </>
        ) : (
          <>
            <InProgressIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
            <span style={{ fontWeight: 600 }}>Migration readiness check in progress</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
              {5 - Object.values(checksCompleted).filter(Boolean).length} checks in progress
            </span>
          </>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0', 
        borderTop: '1px solid var(--pf-t--global--border--color--default)', 
        paddingTop: '24px',
        marginLeft: '-1.5rem',
        marginRight: '-1.5rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem'
      }}>
        {/* Left sidebar with checks */}
        <div style={{ 
          minWidth: '220px', 
          borderRight: '1px solid var(--pf-t--global--border--color--default)', 
          paddingRight: '20px',
          marginRight: '-1.5rem',
          marginTop: '-24px',
          paddingTop: '24px',
          paddingBottom: '8rem',
          marginBottom: '-8rem'
        }}>
          <div
            onClick={() => setSelectedCheck('network')}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'network' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {checksCompleted.network ? (
              <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
            ) : (
              <InProgressIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
            )}
            <span>Network mapping</span>
          </div>
          <div
            onClick={() => setSelectedCheck('storage')}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'storage' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {checksCompleted.storage ? (
              <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
            ) : (
              <InProgressIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
            )}
            <span>Storage mapping</span>
          </div>
          <div
            onClick={() => setSelectedCheck('compute')}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'compute' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {checksCompleted.compute ? (
              <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
            ) : (
              <InProgressIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
            )}
            <span>Compute compatibility</span>
          </div>
          <div
            onClick={() => setSelectedCheck('version')}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'version' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {checksCompleted.version ? (
              <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
            ) : (
              <InProgressIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
            )}
            <span>Version compatibility</span>
          </div>
          <div
            onClick={() => setSelectedCheck('resource')}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              backgroundColor: selectedCheck === 'resource' ? 'var(--pf-t--global--background--color--action--plain--clicked)' : 'transparent',
              borderRadius: '4px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {checksCompleted.resource ? (
              <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
            ) : (
              <InProgressIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />
            )}
            <span>Resource capacity</span>
          </div>
        </div>

        {/* Right panel with details */}
        <div style={{ 
          flex: 1,
          marginTop: '-24px',
          paddingTop: '24px',
          paddingBottom: '8rem',
          marginBottom: '-8rem',
          paddingLeft: '48px'
        }}>
          {renderCheckDetail()}
        </div>
      </div>
    </div>
  );

  const reviewStep = (
    <Drawer isExpanded={isVMDrawerOpen}>
      <DrawerContent
        panelContent={
          <DrawerPanelContent style={{ minWidth: '400px' }}>
            <DrawerHead>
              <Title headingLevel="h3" size="xl">
                Virtual machines ({vmsToMigrate.length})
              </Title>
              <DrawerActions>
                <DrawerCloseButton onClick={() => setIsVMDrawerOpen(false)} />
              </DrawerActions>
            </DrawerHead>
            <div style={{ padding: '16px' }}>
              <Table variant="compact" borders={false}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {vmsToMigrate.map((vm, index) => (
                    <Tr key={vm?.id}>
                      <Td>{vm?.name}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </DrawerPanelContent>
        }
      >
        <DrawerContentBody>
          <div>
            <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-lg">
              Review
            </Title>
            
            {/* General information section */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>General information</h3>
                <Button variant="link" onClick={() => setActiveStep(1)} style={{ padding: 0 }}>
                  Edit step
                </Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', fontSize: '0.875rem' }}>
                <div style={{ fontWeight: 'bold' }}>Virtual machines</div>
                <div>
                  <Button 
                    variant="link" 
                    onClick={() => setIsVMDrawerOpen(true)}
                    style={{ padding: 0, fontSize: '0.875rem' }}
                  >
                    {vmsToMigrate.length} virtual machine{vmsToMigrate.length !== 1 ? 's' : ''}
                  </Button>
                </div>
                <div style={{ fontWeight: 'bold' }}>Name</div>
                <div>{migrationName || `Migration-${new Date().toISOString().split('T')[0]}`}</div>
                <div style={{ fontWeight: 'bold' }}>Migration reason</div>
                <div>{actualMigrationReason}</div>
              </div>
            </div>

      {/* Placement section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Placement</h3>
          <Button variant="link" onClick={() => setActiveStep(2)} style={{ padding: 0 }}>
            Edit step
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 40px 200px 1fr', gap: '12px', fontSize: '0.875rem', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>Source cluster</div>
          <div>{sourceCluster?.name || 'N/A'}</div>
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
          <div style={{ fontWeight: 'bold' }}>Target cluster</div>
          <div>{allClusters.find(c => c.id === targetCluster)?.name || 'Not selected'}</div>
          
          <div style={{ fontWeight: 'bold' }}>Source project</div>
          <div>{sourceNamespace?.name || 'N/A'}</div>
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
          <div style={{ fontWeight: 'bold' }}>Target project</div>
          <div>{targetNamespaces.find(ns => ns.id === targetProject)?.name || 'Not selected'}</div>
        </div>
      </div>

      {/* Migration readiness section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Migration readiness</h3>
          <Button variant="link" onClick={() => setActiveStep(3)} style={{ padding: 0 }}>
            Edit step
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 'bold' }}>Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircleIcon style={{ color: 'var(--pf-t--global--icon--color--status--success--default)' }} />
            Ready to migrate
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        border: '1px solid var(--pf-t--global--border--color--default)',
        borderRadius: '8px',
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        marginBottom: '24px'
      }}>
        <span style={{ fontSize: '1.25rem', color: 'var(--pf-t--global--icon--color--status--info)' }}>ℹ</span>
        <span>During migration, VMs will be processed and moved in groups of 5.</span>
      </div>
          </div>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );

  const onNext = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    } else {
      handleSave();
    }
  };

  const onBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const getCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return generalInformationStep;
      case 2:
        return targetPlacementStep;
      case 3:
        return migrationReadinessStep;
      case 4:
        return reviewStep;
      default:
        return generalInformationStep;
    }
  };

  const getStepName = () => {
    switch (activeStep) {
      case 1:
        return 'General information';
      case 2:
        return 'Target placement';
      case 3:
        return 'Migration readiness';
      case 4:
        return 'Review';
      default:
        return '';
    }
  };

  const isCompleted = progress >= 100;

  const progressScreen = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Section */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '1.5rem', 
        borderBottom: '1px solid #d2d2d2',
        flexShrink: 0
      }}>
        <Title headingLevel="h1" size="2xl" id="migrate-vms-wizard-title">
          Migrate virtual machines
        </Title>
        <Content component="p" style={{ marginTop: '0.5rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
          Choose the target location for your VMs, then adjust your migration plan if necessary.
        </Content>
      </div>

      {/* Progress Content */}
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
        flex: 1,
        padding: '64px 48px',
        backgroundColor: '#fff'
      }}>
        {/* Icon */}
        <div style={{ fontSize: '4rem', marginBottom: '32px' }}>
          {isCompleted ? (
            <CheckCircleIcon 
              style={{ 
                color: 'var(--pf-t--global--icon--color--status--success--default)',
                width: '80px',
                height: '80px'
              }} 
            />
          ) : (
            <InProgressIcon 
              style={{ 
                color: 'var(--pf-t--global--icon--color--subtle)',
                width: '80px',
                height: '80px'
              }} 
            />
          )}
      </div>
        
        {/* Title */}
        <Title headingLevel="h2" size="2xl" style={{ marginBottom: '32px' }}>
          {isCompleted ? 'Migration completed' : 'Migration in progress'}
        </Title>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: '400px', marginBottom: '12px' }}>
        <div style={{ 
          width: '100%', 
            height: '8px', 
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
              backgroundColor: isCompleted ? 'var(--pf-t--global--icon--color--status--success--default)' : 'var(--pf-t--global--color--brand--default)',
              transition: 'width 0.2s ease-in-out, background-color 0.3s ease'
          }}></div>
        </div>
      </div>
        
        {/* Percentage */}
        <div style={{ marginBottom: '24px', fontSize: '0.875rem', fontWeight: 600 }}>
        {Math.round(progress)}%
      </div>
        
        {/* Message */}
        <div style={{ marginBottom: '40px', color: 'var(--pf-t--global--text--color--subtle)', fontSize: '0.9375rem' }}>
          {isCompleted 
            ? 'The migration is completed you can close the wizard.' 
            : 'The migration will continue if you close this popup'}
      </div>
        
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <Button variant="primary" onClick={handleViewMigrationPlan}>View migration plan</Button>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </div>
        
        {/* Bottom Link */}
        <Button 
          variant="link" 
          onClick={handleRevertMigration} 
          style={{ 
            color: 'var(--pf-t--global--icon--color--status--danger--default)',
            padding: 0
          }}
        >
          Cancel and revert changes
      </Button>
      </div>
    </div>
  );

  return (
    <>
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen && showWizardContent}
      onClose={handleClose}
      aria-labelledby="migrate-vms-wizard-title"
      style={{ 
        '--pf-v6-c-modal-box--m-body--PaddingTop': '0',
        '--pf-v6-c-modal-box--m-body--PaddingRight': '0',
        '--pf-v6-c-modal-box--m-body--PaddingBottom': '0',
        '--pf-v6-c-modal-box--m-body--PaddingLeft': '0'
      } as React.CSSProperties}
    >
      {showProgress ? progressScreen : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header Section */}
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '1.5rem', 
            borderBottom: '1px solid #d2d2d2',
            flexShrink: 0
          }}>
            <Title headingLevel="h1" size="2xl" id="migrate-vms-wizard-title">
              Migrate virtual machines
            </Title>
            <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
              Choose the target location for your VMs, then adjust your migration plan if necessary.
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
              <div
                onClick={() => setActiveStep(1)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 1 ? '#fafafa' : 'transparent',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeStep === 1 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  1
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                  General information
                </span>
              </div>
              <div
                onClick={() => setActiveStep(2)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 2 ? '#fafafa' : 'transparent',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeStep === 2 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  2
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                  Target placement
                </span>
              </div>
              <div
                onClick={() => setActiveStep(3)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 3 ? '#fafafa' : 'transparent',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeStep === 3 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  3
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                  Migration readiness
                </span>
              </div>
              <div
                onClick={() => setActiveStep(4)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: activeStep === 4 ? '#fafafa' : 'transparent',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                }}
              >
                <span style={{ 
                  marginRight: '12px', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeStep === 4 ? '#0066cc' : '#d2d2d2',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  4
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#151515' }}>
                  Review
                </span>
              </div>
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
                padding: '1.5rem', 
                backgroundColor: '#ffffff',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}>
                {getCurrentStep()}
              </div>
              
              {/* Footer with Buttons */}
              <div style={{ 
                borderTop: '1px solid #d2d2d2', 
                padding: '1rem 1.5rem', 
                backgroundColor: '#ffffff',
                flexShrink: 0,
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
              <Button variant="secondary" onClick={onBack} isDisabled={activeStep === 1}>
                Back
              </Button>
              {activeStep === 4 ? (
                <>
                  <Button 
                    variant="primary" 
                    onClick={handleMigrateNow}
                    isDisabled={!targetCluster || !targetProject || isSameLocation}
                  >
                    Migrate now
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleSave}
                    isDisabled={!targetCluster || !targetProject || isSameLocation}
                  >
                    Save and migrate later
                  </Button>
                </>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={onNext}
                  isDisabled={
                    (activeStep === 2 && (!targetCluster || !targetProject || isSameLocation)) ||
                    (activeStep === 3 && !allChecksCompleted)
                  }
                >
                  Next
                </Button>
              )}
              <Button variant="link" onClick={handleClose}>
                Cancel
              </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>

      {/* Status & Project Warning Modal */}
      <Modal
        isOpen={isStatusWarningModalOpen}
        variant={ModalVariant.small}
        onClose={handleCancelMigration}
        aria-label="VM migration warning"
      >
        <div style={{ padding: '24px' }}>
          {/* Scenario 1: All VMs are stopped - BLOCK */}
          {vmStatusCounts.running === 0 ? (
            <>
          <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                Cannot proceed with migration
          </Title>

          <Content component="p" style={{ 
            marginBottom: 'var(--pf-t--global--spacer--lg)',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
                To (live) migrate a VM, it must be running. All <strong>{vmStatusCounts.total}</strong> selected virtual machines are stopped. Please start at least one VM to proceed with migration.
              </Content>

              {/* Show project info if multi-project */}
              {projectInfo.isMultiProject && (
                <>
                  <Alert
                    variant="warning"
                    isInline
                    title={`VMs from ${projectInfo.projectCount} different projects selected`}
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
                      {projectInfo.projects.map(project => (
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
                  {Object.entries(vmStatusCounts.breakdown).map(([status, count]) => {
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

              {/* Footer with only Cancel button */}
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
                  <Button variant="primary" onClick={handleCancelMigration}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Scenarios 2-4: Some issues but can proceed */}
              <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                {projectInfo.isMultiProject && vmStatusCounts.nonRunning > 0
                  ? 'Multiple projects and VM statuses detected'
                  : projectInfo.isMultiProject
                  ? 'Multiple projects detected'
                  : 'Not all VMs will migrate'}
              </Title>

              {/* Multi-project warning */}
              {projectInfo.isMultiProject && (
                <>
                  <Alert
                    variant="warning"
                    isInline
                    title={`VMs from ${projectInfo.projectCount} different projects selected`}
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
                      {projectInfo.projects.map(project => (
                        <div key={project.id} style={{ fontSize: '15px' }}>
                          <strong>{project.name}</strong>: {project.vmCount} {project.vmCount === 1 ? 'VM' : 'VMs'}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* VM status warning */}
              {vmStatusCounts.nonRunning > 0 && (
                <>
                  <Content component="p" style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--lg)',
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }}>
                    To (live) migrate a VM, it must be running. <strong>{vmStatusCounts.nonRunning}</strong> out of selected <strong>{vmStatusCounts.total}</strong> virtual machines {vmStatusCounts.nonRunning === 1 ? 'is' : 'are'} not running.
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
              {Object.entries(vmStatusCounts.breakdown)
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
                {vmStatusCounts.nonRunning > 0 
                  ? `If you would like to continue, only the selected ${vmStatusCounts.running} running VMs will be available for migration.`
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
              <Button variant="link" onClick={handleCancelMigration}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleContinueWithRunningVMs}>
                Continue to next step
              </Button>
            </div>
          </div>
            </>
          )}
        </div>
      </Modal>

      {/* Cancel and Revert Confirmation Modal */}
      {isCancelRevertModalOpen && (
        <Modal
          variant={ModalVariant.small}
          isOpen={isCancelRevertModalOpen}
          onClose={() => setIsCancelRevertModalOpen(false)}
          aria-labelledby="cancel-revert-title"
          aria-describedby="cancel-revert-description"
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
                <Title headingLevel="h2" size="xl" id="cancel-revert-title">
                  Cancel and revert changes?
                </Title>
              </div>
              <Button
                variant="plain"
                onClick={() => setIsCancelRevertModalOpen(false)}
                style={{ marginTop: '-8px', marginRight: '-8px' }}
              >
                <span style={{ fontSize: '1.25rem' }}>×</span>
              </Button>
            </div>
            
            {/* Description */}
            <div id="cancel-revert-description" style={{ marginBottom: '24px', fontSize: '0.875rem' }}>
              Migration is in progress. If you cancel the migration plan, you can't resume it and will need to create a new plan.
            </div>
            
            {/* Warning Alert */}
            <Alert
              variant="warning"
              isInline
              title="All changes will be reverted"
              style={{ marginBottom: '24px' }}
            >
              <Content component="p" style={{ fontSize: '0.875rem' }}>
                All virtual machines will be reverted to their original state and location.
              </Content>
            </Alert>
            
            {/* Footer with buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end',
              paddingTop: 'var(--pf-t--global--spacer--md)',
              borderTop: '1px solid var(--pf-t--global--border--color--default)'
            }}>
              <Button 
                variant="secondary" 
                onClick={() => setIsCancelRevertModalOpen(false)}
              >
                Back
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmCancelAndRevert}
              >
                Cancel migration and revert changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

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
              <TextInput
                type="text"
                id="project-cluster"
                value={projectCluster}
                isDisabled
              />
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
                // Find the cluster ID from the cluster name
                const cluster = allClusters.find(c => c.name === projectCluster);
                if (cluster) {
                  // Create the new namespace/project
                  const newNamespace = createNamespace({
                    name: projectName,
                    clusterId: cluster.id,
                    type: 'application', // Default type
                    labels: {
                      displayName: projectDisplayName || projectName,
                      description: projectDescription || '',
                    }
                  });
                  
                  // Select the newly created project in the target project dropdown
                  setTargetProject(newNamespace.id);
                  
                  // Trigger refresh to update the UI
                  setNamespacesRefreshTrigger(prev => prev + 1);
                }
                
                // Close modal and clear form
                setIsCreateProjectModalOpen(false);
                setProjectName('');
                setProjectCluster('');
                setProjectDisplayName('');
                setProjectDescription('');
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
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

    </>
  );
};

