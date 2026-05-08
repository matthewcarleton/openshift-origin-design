import * as React from 'react';
import {
  Wizard,
  WizardStep,
  WizardHeader,
  useWizardContext,
  Button,
  Title,
  Content,
  Form,
  FormGroup,
  TextInput,
  FormSelect,
  FormSelectOption,
  Radio,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Label,
  LabelGroup,
  Dropdown,
  DropdownList,
  DropdownItem,
  Checkbox,
  Flex,
  FlexItem,
  Pagination,
  PaginationVariant,
  Modal,
  ModalVariant,
  Tooltip,
  Divider,
  TextArea,
} from '@patternfly/react-core';
import { CheckCircleIcon, CogsIcon, ExclamationCircleIcon, OffIcon, PauseCircleIcon, CaretDownIcon, InProgressIcon, PencilAltIcon, CheckIcon, TimesIcon, ExternalLinkAltIcon, QuestionCircleIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { getAllClusters, getAllNamespaces, getVirtualMachinesByNamespace, getVirtualMachinesByCluster, createMigrationPlan, createNamespace } from '@app/data';

const CreateMigrationPlan: React.FunctionComponent = () => {
  useDocumentTitle('Create migration plan');
  const navigate = useNavigate();

  // Form state
  const [name, setName] = React.useState('');
  const [migrationReason, setMigrationReason] = React.useState('Not stated');
  const [customReason, setCustomReason] = React.useState('');
  const [sourceCluster, setSourceCluster] = React.useState('');
  const [sourceProjects, setSourceProjects] = React.useState<string[]>([]); // Changed to array for multi-select
  const [targetCluster, setTargetCluster] = React.useState('');
  const [targetProject, setTargetProject] = React.useState('');
  const [vmSelectionMode, setVmSelectionMode] = React.useState<'all' | 'manual'>('all');
  const [selectedVMsForMigration, setSelectedVMsForMigration] = React.useState<Set<string>>(new Set());
  const [showProgress, setShowProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentMigrationPlanId, setCurrentMigrationPlanId] = React.useState<string>('');

  // Pagination state for VM table
  const [vmTablePage, setVmTablePage] = React.useState(1);
  const [vmTablePerPage, setVmTablePerPage] = React.useState(10);

  // Select dropdown states
  const [isSourceClusterOpen, setIsSourceClusterOpen] = React.useState(false);
  const [isSourceProjectOpen, setIsSourceProjectOpen] = React.useState(false);
  const [isTargetClusterOpen, setIsTargetClusterOpen] = React.useState(false);
  const [isTargetProjectOpen, setIsTargetProjectOpen] = React.useState(false);
  const [isReasonSelectOpen, setIsReasonSelectOpen] = React.useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = React.useState(false);
  
  // Create project form state
  const [projectName, setProjectName] = React.useState('');
  const [projectCluster, setProjectCluster] = React.useState('');
  const [projectDisplayName, setProjectDisplayName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [isProjectClusterDropdownOpen, setIsProjectClusterDropdownOpen] = React.useState(false);
  const [projectClusterSearchValue, setProjectClusterSearchValue] = React.useState('');
  const [namespacesRefreshTrigger, setNamespacesRefreshTrigger] = React.useState(0);

  // Search filter states
  const [sourceClusterFilter, setSourceClusterFilter] = React.useState('');
  const [sourceProjectFilter, setSourceProjectFilter] = React.useState('');
  const [targetClusterFilter, setTargetClusterFilter] = React.useState('');
  const [targetProjectFilter, setTargetProjectFilter] = React.useState('');

  // Bulk selector state for VM table
  const [isBulkSelectorOpen, setIsBulkSelectorOpen] = React.useState(false);

  // Migration readiness check states
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
    resource: false,
  });
  const [selectedCheck, setSelectedCheck] = React.useState<'network' | 'storage' | 'compute' | 'version' | 'resource'>('network');
  const [selectedTargetNetwork, setSelectedTargetNetwork] = React.useState('network1');
  const [selectedTargetStorage, setSelectedTargetStorage] = React.useState('storage1');
  const [isNetworkEditMode, setIsNetworkEditMode] = React.useState(false);
  const [isStorageEditMode, setIsStorageEditMode] = React.useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = React.useState(false);
  const [isStorageDropdownOpen, setIsStorageDropdownOpen] = React.useState(false);
  const [tempTargetNetwork, setTempTargetNetwork] = React.useState('network1');
  const [tempTargetStorage, setTempTargetStorage] = React.useState('storage1');

  // Track the current wizard step
  const [currentWizardStep, setCurrentWizardStep] = React.useState(0);

  // Derived state for all checks completed
  const allChecksCompleted = React.useMemo(() => {
    return Object.values(checksCompleted).every(check => check === true);
  }, [checksCompleted]);

  // Run migration readiness checks sequentially when step becomes active
  React.useEffect(() => {
    if (currentWizardStep === 2) { // Migration readiness is step 2 (0-indexed: General=0, Placement=1, Migration readiness=2)
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
  }, [currentWizardStep]);

  // Handler to restart checks
  const handleRunChecksAgain = () => {
    // Reset all checks first
    setChecksCompleted({
      network: false,
      storage: false,
      compute: false,
      version: false,
      resource: false
    });

    // Run checks again sequentially with delays
    const checkOrder: Array<keyof typeof checksCompleted> = ['network', 'storage', 'compute', 'version', 'resource'];
    
    checkOrder.forEach((checkName, index) => {
      setTimeout(() => {
        setChecksCompleted(prev => ({
          ...prev,
          [checkName]: true
        }));
      }, (index + 1) * 800); // 800ms delay between each check
    });
  };

  const clusters = getAllClusters();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allNamespaces = React.useMemo(() => getAllNamespaces(), [namespacesRefreshTrigger]);

  // Predefined migration reasons (matching modal wizard)
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

  // Calculate VM counts per cluster
  const clusterVMCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    clusters.forEach(cluster => {
      const vms = getVirtualMachinesByCluster(cluster.id);
      counts[cluster.id] = vms.length;
    });
    return counts;
  }, [clusters]);

  // Calculate VM counts per namespace
  const namespaceVMCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allNamespaces.forEach(ns => {
      const vms = getVirtualMachinesByNamespace(ns.id);
      counts[ns.id] = vms.length;
    });
    return counts;
  }, [allNamespaces]);

  const sourceProjectOptions = sourceCluster
    ? allNamespaces.filter(ns => ns.clusterId === sourceCluster)
    : [];

  const targetProjectOptions = targetCluster
    ? allNamespaces.filter(ns => ns.clusterId === targetCluster)
    : [];

  // Filtered options for search
  const filteredSourceClusters = clusters.filter(cluster =>
    cluster.name.toLowerCase().includes(sourceClusterFilter.toLowerCase())
  );

  const filteredSourceProjects = sourceProjectOptions.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(sourceProjectFilter.toLowerCase());
    const hasVMs = (namespaceVMCounts[project.id] || 0) > 0;
    return matchesSearch && hasVMs;
  });

  const filteredTargetClusters = clusters.filter(cluster =>
    cluster.name.toLowerCase().includes(targetClusterFilter.toLowerCase())
  );

  const filteredTargetProjects = targetProjectOptions.filter(project =>
    project.name.toLowerCase().includes(targetProjectFilter.toLowerCase())
  );

  // Get VMs from all selected source projects and calculate status counts
  const sourceVMs = React.useMemo(() => {
    if (!sourceCluster || sourceProjects.length === 0) return [];
    // Combine VMs from all selected projects, adding project info to each VM
    const allVMs: any[] = [];
    sourceProjects.forEach(projectId => {
      const vms = getVirtualMachinesByNamespace(projectId);
      const projectName = allNamespaces.find(ns => ns.id === projectId)?.name || projectId;
      // Add project info to each VM
      const vmsWithProject = vms.map(vm => ({ ...vm, projectId, projectName }));
      allVMs.push(...vmsWithProject);
    });
    return allVMs;
  }, [sourceCluster, sourceProjects, allNamespaces]);

  // Paginated VMs for the table
  const paginatedVMs = React.useMemo(() => {
    const start = (vmTablePage - 1) * vmTablePerPage;
    const end = start + vmTablePerPage;
    return sourceVMs.slice(start, end);
  }, [sourceVMs, vmTablePage, vmTablePerPage]);

  const vmStatusCounts = React.useMemo(() => {
    const breakdown: Record<string, number> = {};
    let running = 0;
    let nonRunning = 0;

    sourceVMs.forEach(vm => {
      const status = vm.status || 'Unknown';
      breakdown[status] = (breakdown[status] || 0) + 1;
      
      if (status === 'Running') {
        running++;
      } else {
        nonRunning++;
      }
    });

    return {
      total: sourceVMs.length,
      running,
      nonRunning,
      breakdown
    };
  }, [sourceVMs]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running':
        return { Icon: CheckCircleIcon, color: 'var(--pf-t--global--icon--color--status--success--default)' };
      case 'Stopped':
        return { Icon: OffIcon, color: 'var(--pf-t--global--icon--color--status--danger--default)' };
      case 'Error':
        return { Icon: ExclamationCircleIcon, color: 'var(--pf-t--global--icon--color--status--danger--default)' };
      case 'Paused':
        return { Icon: PauseCircleIcon, color: 'var(--pf-t--global--icon--color--status--warning--default)' };
      default:
        return { Icon: ExclamationCircleIcon, color: 'var(--pf-t--global--icon--color--subtle)' };
    }
  };

  // VM selection helpers
  const runningVMs = sourceVMs.filter(vm => vm.status === 'Running');
  const runningVMIds = runningVMs.map(vm => vm.id);

  const handleSelectAllRunning = () => {
    setSelectedVMsForMigration(new Set(runningVMIds));
    setIsBulkSelectorOpen(false);
  };

  const handleDeselectAll = () => {
    setSelectedVMsForMigration(new Set());
    setIsBulkSelectorOpen(false);
  };

  const handleSelectVM = (vmId: string, isSelecting: boolean) => {
    const newSelected = new Set(selectedVMsForMigration);
    if (isSelecting) {
      newSelected.add(vmId);
    } else {
      newSelected.delete(vmId);
    }
    setSelectedVMsForMigration(newSelected);
  };

  const areAllRunningSelected = runningVMs.length > 0 && runningVMs.every(vm => selectedVMsForMigration.has(vm.id));

  const onClose = () => {
    navigate('/virtualization/migration');
  };

  // Derived state for progress screen
  const isCompleted = progress >= 100;

  // Handlers for progress screen buttons
  const handleViewMigrationPlan = () => {
    if (currentMigrationPlanId) {
      navigate(`/virtualization/migration/${currentMigrationPlanId}`);
    }
  };

  const handleClose = () => {
    if (isCompleted) {
      window.location.reload();
    } else {
      navigate('/virtualization/migration');
    }
  };

  const handleRevertMigration = () => {
    setShowProgress(false);
    setProgress(0);
    navigate('/virtualization/migration');
  };

  const onMigrate = () => {
    // Determine which VMs to migrate based on selection mode
    const allVMIds = vmSelectionMode === 'all' 
      ? sourceVMs.filter(vm => vm.status === 'Running').map(vm => vm.id)
      : Array.from(selectedVMsForMigration);

    // Get target namespace for display
    const targetNamespace = allNamespaces.find(ns => ns.id === targetProject);
    
    // Create migration plan with "In progress" status
    const migrationPlan = createMigrationPlan({
      name: name || `Migration plan: ${allVMIds.length} VMs`,
      namespace: targetNamespace?.name || targetProject,
      sourceProvider: 'host',
      targetProvider: 'host',
      sourceClusterId: sourceCluster,
      targetClusterId: targetCluster,
      targetNamespaceId: targetProject,
      vmIds: allVMIds,
      status: 'In progress',
      migrationReadiness: 'Ready to migrate',
      migrationType: 'Live',
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(), // Migration starts immediately
      transferNetwork: 'Providers default',
      conditions: [
        {
          type: 'Ready',
          status: true,
          updated: new Date().toISOString(),
          reason: 'Migrating',
          message: 'The migration plan is in progress',
        },
      ],
    });
    
    console.log(`📋 Created migration plan: ${migrationPlan.id} (In progress)`);
    
    // Store the migration plan ID for navigation
    setCurrentMigrationPlanId(migrationPlan.id);
    
    // Show progress screen and simulate migration progress
    setShowProgress(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const onSaveForLater = () => {
    // Determine which VMs to include based on selection mode
    const allVMIds = vmSelectionMode === 'all' 
      ? sourceVMs.map(vm => vm.id) // Include all VMs, not just running ones
      : Array.from(selectedVMsForMigration);

    // Get target namespace for display
    const targetNamespace = allNamespaces.find(ns => ns.id === targetProject);
    
    // Create migration plan with "Ready to migrate" status
    const migrationPlan = createMigrationPlan({
      name: name || `Migration plan: ${allVMIds.length} VMs`,
      namespace: targetNamespace?.name || targetProject,
      sourceProvider: 'host',
      targetProvider: 'host',
      sourceClusterId: sourceCluster,
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
    
    // Navigate to migration plans list
    navigate('/virtualization/migration');
  };

  // Custom footer component for the wizard
  const CustomFooter = () => {
    try {
      const { activeStep, goToNextStep, goToPrevStep } = useWizardContext();
      const stepName = activeStep?.name || '';
      const isReviewStep = stepName === 'Review';
      const isFirstStep = stepName === 'General information';
      const isPlacementStep = stepName === 'Placement';

      // Update current wizard step based on step name
      React.useEffect(() => {
        const stepMap: Record<string, number> = {
          'General information': 0,
          'Placement': 1,
          'Migration readiness': 2,
          'Review': 3
        };
        const stepNameStr = typeof stepName === 'string' ? stepName : String(stepName);
        const stepIndex = stepMap[stepNameStr] ?? 0;
        setCurrentWizardStep(stepIndex);
      }, [stepName]);

      // Validation logic
      const isPlacementValid = sourceCluster && sourceProjects.length > 0 && targetCluster && targetProject;
      const isMigrationReadinessStep = stepName === 'Migration readiness';
      const canProceed = isMigrationReadinessStep 
        ? allChecksCompleted 
        : (!isPlacementStep || isPlacementValid);

      const handleNext = () => {
        console.log('Next clicked, current step:', stepName);
        goToNextStep();
      };

      const handleBack = () => {
        console.log('Back clicked, current step:', stepName);
        goToPrevStep();
      };

      const handleClose = () => {
        console.log('Cancel clicked');
        navigate('/virtualization/migration');
      };

      const handleMigrate = () => {
        console.log('Migrate clicked');
        onMigrate();
      };

      const handleSaveForLater = () => {
        console.log('Save for later clicked');
        onSaveForLater();
      };

      if (isReviewStep) {
        return (
          <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', borderTop: '1px solid var(--pf-t--global--border--color--default)', backgroundColor: '#fff' }}>
            <Button variant="primary" onClick={handleMigrate}>
              Migrate
            </Button>
            <Button variant="secondary" onClick={handleSaveForLater}>
              Save for later
            </Button>
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="link" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        );
      }

      return (
        <div style={{ display: 'flex', gap: '16px', padding: '16px 24px', borderTop: '1px solid var(--pf-t--global--border--color--default)', backgroundColor: '#fff' }}>
          <Button variant="primary" onClick={handleNext} isDisabled={!canProceed}>
            Next
          </Button>
          {!isFirstStep && (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button variant="link" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      );
    } catch (error) {
      console.error('Error in CustomFooter:', error);
      return null;
    }
  };

  const renderGeneralInformationStep = () => (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
        General information
      </Title>
      
      <Form>
        <FormGroup label="Name">
          <TextInput
            type="text"
            value={name}
            onChange={(_event, value) => setName(value)}
            placeholder="Random-generated-name-with-a-date"
          />
          <Content component="p" style={{ 
            marginTop: '8px', 
            fontSize: '14px',
            color: 'var(--pf-t--global--text--color--subtle)' 
          }}>
            If you don't create a name, we'll generate a migration plan name for you.
          </Content>
        </FormGroup>

        <FormGroup label="Migration reason (optional)" style={{ marginTop: '24px' }}>
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
                style={{ width: '100%' }}
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
          <Content component="p" style={{ 
            marginTop: '8px', 
            fontSize: '14px',
            color: 'var(--pf-t--global--text--color--subtle)' 
          }}>
            Select a reason for migration
          </Content>
        </FormGroup>
      </Form>
    </div>
  );

  const renderPlacementStep = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title headingLevel="h2" size="xl">
          Placement *
        </Title>
        <Button variant="link" onClick={() => {
          setSourceCluster('');
          setSourceProjects([]);
          setTargetCluster('');
          setTargetProject('');
        }}>
          Clear all
        </Button>
      </div>

      <Content component="p" style={{ 
        marginBottom: '24px',
        fontSize: '14px',
        color: 'var(--pf-t--global--text--color--subtle)' 
      }}>
        Select target placement
      </Content>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        {/* Source Card */}
        <div style={{ 
          flex: 1,
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: '8px',
          padding: '24px',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title headingLevel="h3" size="md">Source</Title>
            <Button variant="link" onClick={() => { setSourceCluster(''); setSourceProjects([]); }}>
              Clear all
            </Button>
          </div>

          <Form>
            <FormGroup label="Cluster" isRequired>
              <Select
                isOpen={isSourceClusterOpen}
                onSelect={(_event, value) => {
                  setSourceCluster(value as string);
                  setSourceProjects([]);
                  setSourceClusterFilter('');
                  setIsSourceClusterOpen(false);
                }}
                onOpenChange={(isOpen) => {
                  setIsSourceClusterOpen(isOpen);
                  if (!isOpen) {
                    setSourceClusterFilter('');
                  }
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsSourceClusterOpen(!isSourceClusterOpen)}
                    isExpanded={isSourceClusterOpen}
                    style={{ width: '100%' }}
                  >
                    {sourceCluster ? clusters.find(c => c.id === sourceCluster)?.name : 'Select Cluster'}
                  </MenuToggle>
                )}
              >
                <TextInputGroup style={{ padding: '4px' }}>
                  <TextInputGroupMain
                    value={sourceClusterFilter}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(_event, value) => setSourceClusterFilter(value)}
                    placeholder="Search clusters..."
                  />
                </TextInputGroup>
                <SelectList>
                  {filteredSourceClusters.map(cluster => (
                    <SelectOption key={cluster.id} value={cluster.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>{cluster.name}</span>
                        <Label isCompact color="blue">{clusterVMCounts[cluster.id] || 0} VMs</Label>
                      </div>
                    </SelectOption>
                  ))}
                  {filteredSourceClusters.length === 0 && (
                    <SelectOption isDisabled>No results found</SelectOption>
                  )}
                </SelectList>
              </Select>
            </FormGroup>

            <FormGroup label="Projects (select one or more)" isRequired style={{ marginTop: '16px' }}>
              <Select
                isOpen={isSourceProjectOpen}
                selected={sourceProjects}
                onSelect={(_event, value) => {
                  // Toggle selection for multi-select
                  if (sourceProjects.includes(value as string)) {
                    setSourceProjects(sourceProjects.filter(id => id !== value));
                  } else {
                    setSourceProjects([...sourceProjects, value as string]);
                  }
                }}
                onOpenChange={(isOpen) => {
                  setIsSourceProjectOpen(isOpen);
                  if (!isOpen) {
                    setSourceProjectFilter('');
                  }
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsSourceProjectOpen(!isSourceProjectOpen)}
                    isExpanded={isSourceProjectOpen}
                    isDisabled={!sourceCluster}
                    style={{ width: '100%', minHeight: sourceProjects.length > 0 ? '48px' : 'auto' }}
                  >
                    {sourceProjects.length > 0 ? (
                      <LabelGroup
                        numLabels={999}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
                      >
                        {sourceProjects.map(projectId => {
                          const project = allNamespaces.find(ns => ns.id === projectId);
                          const vmCount = namespaceVMCounts[projectId] || 0;
                          return (
                            <Label
                              key={projectId}
                              color="blue"
                              onClose={(e) => {
                                e.stopPropagation();
                                setSourceProjects(sourceProjects.filter(id => id !== projectId));
                              }}
                            >
                              {project?.name || projectId} ({vmCount} VMs)
                            </Label>
                          );
                        })}
                      </LabelGroup>
                    ) : (
                      sourceCluster ? 'Select Projects' : 'To select projects, fill cluster first'
                    )}
                  </MenuToggle>
                )}
              >
                <TextInputGroup style={{ padding: '4px' }}>
                  <TextInputGroupMain
                    value={sourceProjectFilter}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(_event, value) => setSourceProjectFilter(value)}
                    placeholder="Search projects..."
                  />
                </TextInputGroup>
                <SelectList>
                  {filteredSourceProjects.map(project => {
                    const vmCount = namespaceVMCounts[project.id] || 0;
                    const isSelected = sourceProjects.includes(project.id);
                    return (
                      <SelectOption 
                        key={project.id} 
                        value={project.id}
                        isSelected={isSelected}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span>{project.name}</span>
                          <Label isCompact color="blue">{vmCount} VMs</Label>
                        </div>
                      </SelectOption>
                    );
                  })}
                  {filteredSourceProjects.length === 0 && sourceCluster && (
                    <SelectOption isDisabled>No results found</SelectOption>
                  )}
                </SelectList>
              </Select>
            </FormGroup>
          </Form>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '24px 0' }}>
          <span style={{ fontSize: '24px', color: 'var(--pf-t--global--text--color--subtle)' }}>→</span>
        </div>

        {/* Target Card */}
        <div style={{ 
          flex: 1,
          border: '1px solid var(--pf-t--global--border--color--default)',
          borderRadius: '8px',
          padding: '24px',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title headingLevel="h3" size="md">Target *</Title>
            <Button variant="link" onClick={() => { setTargetCluster(''); setTargetProject(''); }}>
              Clear all
            </Button>
          </div>

          <Form>
            <FormGroup label="Cluster" isRequired>
              <Select
                isOpen={isTargetClusterOpen}
                onSelect={(_event, value) => {
                  setTargetCluster(value as string);
                  setTargetProject('');
                  setTargetClusterFilter('');
                  setIsTargetClusterOpen(false);
                }}
                onOpenChange={(isOpen) => {
                  setIsTargetClusterOpen(isOpen);
                  if (!isOpen) {
                    setTargetClusterFilter('');
                  }
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsTargetClusterOpen(!isTargetClusterOpen)}
                    isExpanded={isTargetClusterOpen}
                    style={{ width: '100%' }}
                  >
                    {targetCluster ? clusters.find(c => c.id === targetCluster)?.name : 'Select Cluster'}
                  </MenuToggle>
                )}
              >
                <TextInputGroup style={{ padding: '4px' }}>
                  <TextInputGroupMain
                    value={targetClusterFilter}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(_event, value) => setTargetClusterFilter(value)}
                    placeholder="Search clusters..."
                  />
                </TextInputGroup>
                <SelectList>
                  {filteredTargetClusters.map(cluster => (
                    <SelectOption key={cluster.id} value={cluster.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>{cluster.name}</span>
                        <Label isCompact color="blue">{clusterVMCounts[cluster.id] || 0} VMs</Label>
                      </div>
                    </SelectOption>
                  ))}
                  {filteredTargetClusters.length === 0 && (
                    <SelectOption isDisabled>No results found</SelectOption>
                  )}
                </SelectList>
              </Select>
            </FormGroup>

            <FormGroup label="Project" isRequired style={{ marginTop: '16px' }}>
              <Select
                isOpen={isTargetProjectOpen}
                onSelect={(_event, value) => {
                  setTargetProject(value as string);
                  setTargetProjectFilter('');
                  setIsTargetProjectOpen(false);
                }}
                onOpenChange={(isOpen) => {
                  setIsTargetProjectOpen(isOpen);
                  if (!isOpen) {
                    setTargetProjectFilter('');
                  }
                }}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsTargetProjectOpen(!isTargetProjectOpen)}
                    isExpanded={isTargetProjectOpen}
                    isDisabled={!targetCluster}
                    style={{ width: '100%' }}
                  >
                    {targetProject 
                      ? targetProjectOptions.find(p => p.id === targetProject)?.name 
                      : (targetCluster ? 'Select Project' : 'To select project, fill cluster first')}
                  </MenuToggle>
                )}
              >
                <TextInputGroup style={{ padding: '4px' }}>
                  <TextInputGroupMain
                    value={targetProjectFilter}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(_event, value) => setTargetProjectFilter(value)}
                    placeholder="Search projects..."
                  />
                </TextInputGroup>
                <div style={{ padding: '8px 4px', borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                  <Button 
                    variant="link" 
                    isInline 
                    onClick={() => {
                      setIsTargetProjectOpen(false);
                      // Pre-populate the cluster field with the selected target cluster
                      const selectedClusterName = clusters.find(c => c.id === targetCluster)?.name || '';
                      setProjectCluster(selectedClusterName);
                      setIsCreateProjectModalOpen(true);
                    }}
                    style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                  >
                    + Create project
                  </Button>
                </div>
                <SelectList>
                  {filteredTargetProjects.map(project => {
                    const vmCount = namespaceVMCounts[project.id] || 0;
                    return (
                      <SelectOption key={project.id} value={project.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span>{project.name}</span>
                          <Label isCompact color="blue">{vmCount} VMs</Label>
                        </div>
                      </SelectOption>
                    );
                  })}
                  {filteredTargetProjects.length === 0 && targetCluster && (
                    <SelectOption isDisabled>No results found</SelectOption>
                  )}
                </SelectList>
              </Select>
            </FormGroup>
          </Form>
        </div>
      </div>

      <div>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
          Virtual machines
        </Title>

        {/* VM Status Information */}
        {sourceCluster && sourceProjects.length > 0 && vmStatusCounts.total > 0 && (
          <div style={{ 
            marginBottom: '16px',
            padding: '16px',
            backgroundColor: vmStatusCounts.nonRunning > 0 
              ? 'var(--pf-t--global--background--color--status--warning--default)' 
              : 'var(--pf-t--global--background--color--status--success--default)',
            borderRadius: '8px',
            border: `1px solid ${vmStatusCounts.nonRunning > 0 
              ? 'var(--pf-t--global--border--color--status--warning--default)' 
              : 'var(--pf-t--global--border--color--status--success--default)'}`
          }}>
            <Content component="p" style={{ 
              fontWeight: 'bold',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Virtual machines in source
            </Content>
            
            {/* Project Mapping Info */}
            {sourceProjects.length > 0 && targetCluster && targetProject && (
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                <Content component="p" style={{ fontSize: '14px', marginBottom: '8px' }}>
                  {sourceProjects.length === 1 ? (
                    <>Migrating from <strong>{allNamespaces.find(ns => ns.id === sourceProjects[0])?.name}</strong> to <strong>{targetProjectOptions.find(p => p.id === targetProject)?.name}</strong></>
                  ) : (
                    <>Migrating from <strong>{sourceProjects.length} source projects</strong> to <strong>{targetProjectOptions.find(p => p.id === targetProject)?.name}</strong></>
                  )}
                </Content>
                {sourceProjects.length > 1 && (
                  <div style={{ fontSize: '13px' }}>
                    {sourceProjects.map((projectId, index) => {
                      const projectName = allNamespaces.find(ns => ns.id === projectId)?.name || projectId;
                      return (
                        <span key={projectId}>
                          {index > 0 && ', '}
                          <strong>{projectName}</strong>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {Object.entries(vmStatusCounts.breakdown)
                .sort(([statusA], [statusB]) => {
                  if (statusA === 'Running') return -1;
                  if (statusB === 'Running') return 1;
                  return statusA.localeCompare(statusB);
                })
                .map(([status, count]) => {
                  const { Icon, color } = getStatusIcon(status);
                  return (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon style={{ color }} />
                      <span style={{ fontSize: '14px' }}>
                        <strong>{count}</strong> {count === 1 ? 'VM' : 'VMs'} {status.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
            </div>
            {vmStatusCounts.nonRunning > 0 && (
              <Content component="p" style={{ 
                marginTop: '12px',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                Note: Only <strong>{vmStatusCounts.running}</strong> running {vmStatusCounts.running === 1 ? 'VM' : 'VMs'} will be available for migration.
              </Content>
            )}
          </div>
        )}

        {sourceCluster && sourceProjects.length > 0 && vmStatusCounts.total === 0 && (
          <Alert
            variant="warning"
            isInline
            title="No virtual machines found in the selected source projects"
            style={{ marginBottom: '16px' }}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Radio
            name="vm-selection"
            id="select-all-vms"
            label="Select all virtual machines from the source projects"
            isChecked={vmSelectionMode === 'all'}
            onChange={() => setVmSelectionMode('all')}
            isDisabled={!sourceCluster || sourceProjects.length === 0}
          />
          <Radio
            name="vm-selection"
            id="manual-select-vms"
            label="Manually select specific virtual machines from the source projects"
            isChecked={vmSelectionMode === 'manual'}
            onChange={() => setVmSelectionMode('manual')}
            isDisabled={!sourceCluster || sourceProjects.length === 0}
          />
        </div>

        {/* VM Selection Table */}
        {vmSelectionMode === 'manual' && sourceCluster && sourceProjects.length > 0 && sourceVMs.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Dropdown
                isOpen={isBulkSelectorOpen}
                onSelect={() => setIsBulkSelectorOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsBulkSelectorOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => {
                      if (selectedVMsForMigration.size > 0) {
                        handleDeselectAll();
                      } else {
                        setIsBulkSelectorOpen(!isBulkSelectorOpen);
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
                          isChecked={areAllRunningSelected}
                          onChange={(event, checked) => {
                            event.stopPropagation();
                            if (checked) {
                              handleSelectAllRunning();
                            } else {
                              handleDeselectAll();
                            }
                          }}
                          aria-label="Select all running VMs"
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
                  <DropdownItem key="select-none" onClick={handleDeselectAll}>
                    Select none
                  </DropdownItem>
                  <DropdownItem key="select-all-running" onClick={handleSelectAllRunning}>
                    Select all running ({runningVMs.length} VMs)
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
              {selectedVMsForMigration.size > 0 && (
                <Content component="p" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {selectedVMsForMigration.size} selected
                </Content>
              )}
              <Pagination
                itemCount={sourceVMs.length}
                perPage={vmTablePerPage}
                page={vmTablePage}
                onSetPage={(_evt, newPage) => setVmTablePage(newPage)}
                onPerPageSelect={(_evt, newPerPage) => {
                  setVmTablePerPage(newPerPage);
                  setVmTablePage(1);
                }}
                variant={PaginationVariant.top}
                isCompact
              />
            </div>

            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th />
                  <Th>Name</Th>
                  <Th>Project</Th>
                  <Th>Status</Th>
                  <Th>Node</Th>
                  <Th>IP Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedVMs.map((vm, rowIndex) => {
                  const isRunning = vm.status === 'Running';
                  const isSelected = selectedVMsForMigration.has(vm.id);
                  const { Icon, color } = getStatusIcon(vm.status || 'Unknown');

                  return (
                    <Tr key={vm.id}>
                      <Td
                        select={{
                          rowIndex,
                          onSelect: (_event, isSelecting) => handleSelectVM(vm.id, isSelecting),
                          isSelected: isSelected,
                          isDisabled: !isRunning,
                        }}
                      />
                      <Td dataLabel="Name" style={{ opacity: isRunning ? 1 : 0.6 }}>
                        {vm.name}
                      </Td>
                      <Td dataLabel="Project" style={{ opacity: isRunning ? 1 : 0.6 }}>
                        {vm.projectName || '-'}
                      </Td>
                      <Td dataLabel="Status">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon style={{ color }} />
                          <span>{vm.status}</span>
                        </div>
                      </Td>
                      <Td dataLabel="Node" style={{ opacity: isRunning ? 1 : 0.6 }}>
                        {vm.node || '-'}
                      </Td>
                      <Td dataLabel="IP Address" style={{ opacity: isRunning ? 1 : 0.6 }}>
                        {vm.ipAddress || '-'}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            {/* Bottom Pagination */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <Pagination
                itemCount={sourceVMs.length}
                perPage={vmTablePerPage}
                page={vmTablePage}
                onSetPage={(_evt, newPage) => setVmTablePage(newPage)}
                onPerPageSelect={(_evt, newPerPage) => {
                  setVmTablePerPage(newPerPage);
                  setVmTablePage(1);
                }}
                variant={PaginationVariant.bottom}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

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
                        setTempTargetNetwork(value as string);
                      }}
                      onOpenChange={(isOpen) => {
                        setIsNetworkDropdownOpen(isOpen);
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {
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
                        setTempTargetStorage(value as string);
                      }}
                      onOpenChange={(isOpen) => {
                        setIsStorageDropdownOpen(isOpen);
                      }}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => {
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
        const sourceClusterObj = clusters.find(c => c.id === sourceCluster);
        const targetClusterObj = clusters.find(c => c.id === targetCluster);
        return (
          <div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>Version compatibility</Title>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, marginBottom: '12px' }}>OpenShift version</div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>Source cluster</div>
                  <div>{sourceClusterObj?.kubernetesVersion || '4.20'}</div>
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
        // Calculate total VM resources from selected VMs only
        const vmsToCalculate = vmSelectionMode === 'all' 
          ? sourceVMs 
          : sourceVMs.filter(vm => selectedVMsForMigration.has(vm.id));
        
        const totalVMResources = vmsToCalculate.reduce((acc, vm) => {
          // Extract numbers from strings like "50 GB", "8 GiB"
          let storage = 0;
          let memory = 0;
          let cpu = 0;
          
          if (vm.storage) {
            const storageMatch = String(vm.storage).match(/(\d+)/);
            if (storageMatch) storage = parseInt(storageMatch[1]);
          }
          if (vm.memory) {
            const memoryMatch = String(vm.memory).match(/(\d+)/);
            if (memoryMatch) memory = parseInt(memoryMatch[1]);
          }
          if (vm.cpu) {
            // CPU might be a number already or a string
            cpu = typeof vm.cpu === 'number' ? vm.cpu : parseInt(String(vm.cpu).match(/(\d+)/)?.[1] || '0');
          }
          
          return {
            storage: acc.storage + storage,
            memory: acc.memory + memory,
            cpu: acc.cpu + cpu
          };
        }, { storage: 0, memory: 0, cpu: 0 });

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
                Target cluster capacity ({clusters.find(c => c.id === targetCluster)?.name || 'Target cluster'})
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

              <div style={{ marginBottom: '20px' }}>
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

  const renderMigrationReadinessStep = () => (
    <div style={{ 
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header and status section with padding */}
      <div style={{ 
        padding: '24px 24px 0 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title headingLevel="h2" size="xl">
            Migration readiness
          </Title>
          <Button 
            variant="link"
            style={{ 
              padding: 0,
              backgroundColor: 'transparent',
              opacity: allChecksCompleted ? 1 : 0.5,
              cursor: allChecksCompleted ? 'pointer' : 'not-allowed'
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
      </div>

      {/* Divider section - extends full width */}
      <div style={{ 
        display: 'flex', 
        gap: '0',
        flex: 1,
        position: 'relative',
        borderTop: '1px solid var(--pf-t--global--border--color--default)'
      }}>
        {/* Left sidebar with checks */}
        <div style={{ 
          width: '220px', 
          flexShrink: 0,
          borderRight: '1px solid var(--pf-t--global--border--color--default)',
          paddingRight: '20px',
          paddingLeft: '24px',
          paddingTop: '24px',
          paddingBottom: '24px'
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
          paddingTop: '24px',
          paddingBottom: '24px',
          paddingLeft: '48px',
          paddingRight: '24px'
        }}>
          {renderCheckDetail()}
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const sourceClusterName = clusters.find(c => c.id === sourceCluster)?.name || '';
    const sourceProjectNames = sourceProjects.map(id => 
      allNamespaces.find(p => p.id === id)?.name || id
    );
    const targetClusterName = clusters.find(c => c.id === targetCluster)?.name || '';
    const targetProjectName = targetProjectOptions.find(p => p.id === targetProject)?.name || '';

    return (
      <div style={{ padding: '24px' }}>
        <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-lg">
          Review
        </Title>

        {/* General information */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>General information</h3>
            <Button variant="link" style={{ padding: 0 }}>
              Edit step
            </Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', fontSize: '0.875rem' }}>
            <div style={{ fontWeight: 'bold' }}>Name</div>
            <div>{name || `Migration-${new Date().toISOString().split('T')[0]}`}</div>
            <div style={{ fontWeight: 'bold' }}>Migration reason</div>
            <div>{actualMigrationReason}</div>
          </div>
        </div>

        {/* Placement */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Placement</h3>
            <Button variant="link" style={{ padding: 0 }}>
              Edit step
            </Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 40px 200px 1fr', gap: '12px', fontSize: '0.875rem', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>Source cluster</div>
            <div>{sourceClusterName}</div>
            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
            <div style={{ fontWeight: 'bold' }}>Target cluster</div>
            <div>{targetClusterName}</div>
            
            <div style={{ fontWeight: 'bold' }}>Source project{sourceProjectNames.length > 1 ? 's' : ''}</div>
            <div>
              {sourceProjectNames.length > 0 ? (
                sourceProjectNames.length === 1 ? (
                  sourceProjectNames[0]
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {sourceProjectNames.map((name, idx) => (
                      <span key={idx}>{name}</span>
                    ))}
                  </div>
                )
              ) : (
                'N/A'
              )}
            </div>
            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--pf-t--global--text--color--subtle)' }}>→</div>
            <div style={{ fontWeight: 'bold' }}>Target project</div>
            <div>{targetProjectName || 'Not selected'}</div>
          </div>
        </div>

        {/* Migration readiness */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Migration readiness</h3>
            <Button variant="link" style={{ padding: 0 }}>
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
    );
  };

  // Progress screen (shown after clicking Migrate)
  const progressScreen = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      padding: '64px 48px',
      backgroundColor: '#fff'
    }}>
      {/* Icon */}
      <div style={{ marginBottom: '32px' }}>
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
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Breadcrumb section */}
        <div className="create-policy-breadcrumb">
          <Breadcrumb>
            <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/virtualization/migration'); }}>
              Migration
            </BreadcrumbItem>
            <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/virtualization/migration'); }}>
              Migration plans
            </BreadcrumbItem>
            <BreadcrumbItem isActive>Create migration plan</BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* Page header with title and description */}
        <div className="create-policy-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <Title headingLevel="h1" size="2xl">
              Create migration plan
            </Title>
            <Button variant="secondary" size="sm">
              Edit YAML
            </Button>
          </div>
          <Content component="p" style={{ color: '#6a6e73' }}>
            Create a migration plan to move virtualization workloads from source providers to target providers.
          </Content>
        </div>

        {/* Wizard content or progress screen */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {showProgress ? progressScreen : (
              <Wizard onClose={onClose} footer={<CustomFooter />}>
                <WizardStep name="General information" id="general-information-step">
                  {renderGeneralInformationStep()}
                </WizardStep>
                <WizardStep name="Placement" id="placement-step">
                  {renderPlacementStep()}
                </WizardStep>
                <WizardStep name="Migration readiness" id="migration-readiness-step">
                  {renderMigrationReadinessStep()}
                </WizardStep>
                <WizardStep name="Review" id="review-step">
                  {renderReviewStep()}
                </WizardStep>
              </Wizard>
            )}
          </div>
        </div>
      </div>

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
          setProjectClusterSearchValue('');
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
                const cluster = clusters.find(c => c.name === projectCluster);
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
                setProjectClusterSearchValue('');
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
                setProjectClusterSearchValue('');
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

export { CreateMigrationPlan };

