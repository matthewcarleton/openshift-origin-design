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
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { CaretDownIcon, CheckCircleIcon, CircleIcon, AngleLeftIcon, AngleRightIcon, ResourcesEmptyIcon, TimesIcon, SyncAltIcon, TrashIcon } from '@patternfly/react-icons';
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

const mockRoles = dbRoles.map((role, index) => ({
  id: index + 1,
  name: role.name,
  type: role.type,
}));

interface RoleDetailRoleAssignmentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  roleName: string;
}

export const RoleDetailRoleAssignmentWizard: React.FC<RoleDetailRoleAssignmentWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  roleName,
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [clustersPage, setClustersPage] = React.useState(1);
  const [clustersPerPage, setClustersPerPage] = React.useState(10);
  
  // Step 1: Select user or group
  const [identityType, setIdentityType] = React.useState<'user' | 'group'>('user');
  const [selectedUser, setSelectedUser] = React.useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = React.useState<number | null>(null);
  const [userSearch, setUserSearch] = React.useState('');
  const [groupSearch, setGroupSearch] = React.useState('');
  
  // Pre-authorization fields (for users only)
  const [isPreauthorizing, setIsPreauthorizing] = React.useState(false);
  const [preauthorizeEmail, setPreauthorizeEmail] = React.useState('');
  const [preauthorizeIdpId, setPreauthorizeIdpId] = React.useState<string>('');
  const [isIdpDropdownOpen, setIsIdpDropdownOpen] = React.useState(false);
  const [preauthorizedUserEntry, setPreauthorizedUserEntry] = React.useState<any>(null);
  const [usersPage, setUsersPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(10);
  const [groupsPage, setGroupsPage] = React.useState(1);
  const [groupsPerPage, setGroupsPerPage] = React.useState(10);
  const [isUserFilterOpen, setIsUserFilterOpen] = React.useState(false);
  const [userFilterType, setUserFilterType] = React.useState('User');
  const [isGroupFilterOpen, setIsGroupFilterOpen] = React.useState(false);
  const [groupFilterType, setGroupFilterType] = React.useState('Group');
  
  // Step 2: Resources - Hierarchical structure
  const [resourceScope, setResourceScope] = React.useState<'everything' | 'cluster-sets' | 'clusters'>('everything');
  const [isResourceScopeOpen, setIsResourceScopeOpen] = React.useState(false);
  
  // Cluster sets selection
  const [selectedClusterSets, setSelectedClusterSets] = React.useState<number[]>([]);
  const [clusterSetSearch, setClusterSetSearch] = React.useState('');
  const [isClusterSetFilterOpen, setIsClusterSetFilterOpen] = React.useState(false);
  const [clusterSetFilterType, setClusterSetFilterType] = React.useState('Name');
  
  // Clusters selection (can be multiple)
  const [selectedClusters, setSelectedClusters] = React.useState<number[]>([]);
  const [clusterSearch, setClusterSearch] = React.useState('');
  const [isClusterFilterOpen, setIsClusterFilterOpen] = React.useState(false);
  const [clusterFilterType, setClusterFilterType] = React.useState('Name');
  
  // Cluster scope - after selecting clusters
  const [clusterScope, setClusterScope] = React.useState<'everything' | 'projects'>('everything');
  const [isClusterScopeOpen, setIsClusterScopeOpen] = React.useState(false);
  
  // Cluster set scope - after selecting cluster sets
  const [clusterSetScope, setClusterSetScope] = React.useState<'everything' | 'partial'>('everything');
  const [isClusterSetScopeOpen, setIsClusterSetScopeOpen] = React.useState(false);
  
  // Projects selection
  const [selectedProjects, setSelectedProjects] = React.useState<number[]>([]);
  const [projectSearch, setProjectSearch] = React.useState('');
  const [isProjectFilterOpen, setIsProjectFilterOpen] = React.useState(false);
  const [projectFilterType, setProjectFilterType] = React.useState('Project');
  
  // Substep tracking
  const [showClusterSetSelection, setShowClusterSetSelection] = React.useState(false);
  const [showScopeSelection, setShowScopeSelection] = React.useState(false);
  const [showProjectSelection, setShowProjectSelection] = React.useState(false);
  
  // Carousel for example tree views
  const [exampleIndex, setExampleIndex] = React.useState(0);
  
  // Drawer for examples
  const [isDrawerExpanded, setIsDrawerExpanded] = React.useState(false);
  
  // Legacy states for disabled example sections (kept for TypeScript compatibility)
  const [clusterSetExampleIndex, setClusterSetExampleIndex] = React.useState(0);
  const [clusterExampleIndex, setClusterExampleIndex] = React.useState(0);
  const [isEverythingExampleExpanded, setIsEverythingExampleExpanded] = React.useState(false);
  const [isClusterSetExampleExpanded, setIsClusterSetExampleExpanded] = React.useState(false);
  const [isClusterExampleExpanded, setIsClusterExampleExpanded] = React.useState(false);
  
  // Bulk selector dropdowns
  const [isClusterSetBulkSelectorOpen, setIsClusterSetBulkSelectorOpen] = React.useState(false);
  const [isClusterBulkSelectorOpen, setIsClusterBulkSelectorOpen] = React.useState(false);
  const [isProjectBulkSelectorOpen, setIsProjectBulkSelectorOpen] = React.useState(false);

  // Create common project functionality
  const [isCreatingCommonProject, setIsCreatingCommonProject] = React.useState(false);
  const [commonProjectName, setCommonProjectName] = React.useState('');
  const [commonProjectDisplayName, setCommonProjectDisplayName] = React.useState('');
  const [commonProjectDescription, setCommonProjectDescription] = React.useState('');
  const [createdCommonProjects, setCreatedCommonProjects] = React.useState<any[]>([]);

  // Ref for wizard content to enable scrolling
  const wizardContentRef = React.useRef<HTMLDivElement>(null);

  // Scroll to top when substeps change
  React.useEffect(() => {
    if (wizardContentRef.current) {
      wizardContentRef.current.scrollTop = 0;
    }
  }, [showProjectSelection, showScopeSelection, showClusterSetSelection]);

  const resetWizard = () => {
    setCurrentStep(1);
    setIdentityType('user');
    setSelectedUser(null);
    setSelectedGroup(null);
    setUserSearch('');
    setGroupSearch('');
    setUsersPage(1);
    setUsersPerPage(10);
    setGroupsPage(1);
    setGroupsPerPage(10);
    setResourceScope('everything');
    setIsResourceScopeOpen(false);
    setSelectedClusterSets([]);
    setClusterSetSearch('');
    setSelectedClusters([]);
    setClusterSearch('');
    setClusterScope('everything');
    setSelectedProjects([]);
    setProjectSearch('');
    setShowClusterSetSelection(false);
    setShowScopeSelection(false);
    setShowProjectSelection(false);
    setIsEverythingExampleExpanded(false);
    setIsClusterSetExampleExpanded(false);
    setIsClusterExampleExpanded(false);
    setIsCreatingCommonProject(false);
    setCommonProjectName('');
    setCommonProjectDisplayName('');
    setCommonProjectDescription('');
    setCreatedCommonProjects([]);
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Step 1: Select user or group - simple progression
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Step 2 (was Step 1): Handle hierarchical navigation within resources
      if (resourceScope === 'everything') {
        // No substeps needed, go directly to step 3 (review)
        setCurrentStep(3);
      } else if (resourceScope === 'cluster-sets') {
        if (selectedClusterSets.length > 0 && !showScopeSelection) {
          // Cluster sets selected (from inline table), show scope selection
          setShowScopeSelection(true);
        } else if (showScopeSelection && clusterSetScope === 'everything' && !showProjectSelection) {
          // User chose full access to cluster sets, move to review
          setCurrentStep(3);
        } else if (showScopeSelection && clusterSetScope === 'partial' && selectedClusters.length > 0 && !showProjectSelection) {
          // User chose partial access and selected clusters (table shows inline), now show cluster-level access selection
          setClusterScope('everything'); // Reset to default for the new substep
          setSelectedProjects([]); // Clear any previous project selections
          setShowProjectSelection(true);
        } else if (showProjectSelection && clusterScope === 'everything') {
          // User chose full cluster access, move to review
          setCurrentStep(3);
        } else if (showProjectSelection && clusterScope === 'projects' && selectedProjects.length > 0) {
          // User chose partial access and selected projects, move to review
          setCurrentStep(3);
        }
      } else if (resourceScope === 'clusters') {
        if (selectedClusters.length > 0 && !showScopeSelection) {
          // Clusters selected (from inline table), show access level selection
          setShowScopeSelection(true);
        } else if (showScopeSelection && clusterScope === 'everything') {
          // User chose full access, move to review
          setCurrentStep(3);
        } else if (showScopeSelection && clusterScope === 'projects' && selectedProjects.length > 0) {
          // User chose partial access and selected projects, move to review
          setCurrentStep(3);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      // Step 1: Can't go back from first step
      return;
    } else if (currentStep === 2) {
      // Step 2: Handle hierarchical navigation backwards within resources
      if (showProjectSelection) {
        // Go back from project selection to cluster/scope selection
        setShowProjectSelection(false);
        setClusterScope('everything');
        setSelectedProjects([]);
      } else if (showScopeSelection) {
        // Go back from scope selection to inline table selection
        setShowScopeSelection(false);
        setClusterScope('everything');
        setSelectedProjects([]);
      } else {
        // At the beginning of resources step, go back to user/group selection
        setCurrentStep(1);
      }
    } else if (currentStep === 3) {
      // Go back from review to resources
      setCurrentStep(2);
    }
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
      
      onComplete({
        assignmentMode: 'preauthorize',
        identityType: 'user',
        preauthorizeEmail,
        preauthorizeIdpId: preauthorizeIdpId || undefined,
        preauthorizeIdpName: idpName,
        identityName: preauthorizeEmail,
        roleName,
        resourceScope,
        selectedClusterSets,
        selectedClusters,
        selectedProjects,
        clusterScope,
        clusterSetScope,
        status: 'Pending'
      });
    } else {
      // Existing user/group mode
      if (identityType === 'user' && selectedUser !== null) {
        const user = mockUsers.find(u => u.id === selectedUser);
        identityName = user?.name || 'Unknown User';
        identityTypeValue = 'user';
      } else if (identityType === 'group' && selectedGroup !== null) {
        const group = mockGroups.find(g => g.id === selectedGroup);
        identityName = group?.name || 'Unknown Group';
        identityTypeValue = 'group';
      }

      onComplete({
        assignmentMode: 'existing',
        identityType: identityTypeValue,
        identityId: identityType === 'user' ? selectedUser : selectedGroup,
        identityName,
        roleName,
        resourceScope,
        selectedClusterSets,
        selectedClusters,
        selectedProjects,
        clusterScope,
        clusterSetScope,
        status: 'Active'
      });
    }
    
    resetWizard();
  };

  const isNextDisabled = () => {
    const disabled = (() => {
    if (currentStep === 1) {
        // Step 1: User or Group selection
        if (identityType === 'user') {
          // For users: must select a user (either existing or saved pre-auth user)
          // Next button disabled when selectedUser is null (including after deleting pre-auth user)
          if (selectedUser === null) return true;
          
          // Additional check: ensure selected user exists in current filtered users
          // This handles cases where pre-auth user was deleted
          const userExists = filteredUsers.some(u => u.id === selectedUser);
          return !userExists;
        } else {
          // For groups: must select a group
          return selectedGroup === null;
        }
    }
    if (currentStep === 2) {
        // Step 2: Resources - 'everything' doesn't require any selection
        if (resourceScope === 'everything') return false;
        
        // For 'cluster-sets' path
        if (resourceScope === 'cluster-sets') {
          // Must select at least one cluster set (table is inline)
          if (!showScopeSelection && selectedClusterSets.length === 0) return true;
          // If scope selection shown with "everything", allow Next
          if (showScopeSelection && !showProjectSelection && clusterSetScope === 'everything') return false;
          // If partial access is selected with inline cluster table, must select at least one cluster
          if (showScopeSelection && !showProjectSelection && clusterSetScope === 'partial' && selectedClusters.length === 0) return true;
          // If partial access with clusters selected, allow Next to show cluster-level access
          if (showScopeSelection && !showProjectSelection && clusterSetScope === 'partial' && selectedClusters.length > 0) return false;
          // If project selection shown (cluster-level access), check cluster scope
          if (showProjectSelection && clusterScope === 'everything') return false;
          // If partial cluster access, must select at least one project
          if (showProjectSelection && clusterScope === 'projects' && selectedProjects.length === 0) return true;
          // Special case: if multiple clusters selected with no common projects, disable Next
          if (showProjectSelection && clusterScope === 'projects' && selectedClusters.length > 1) {
            const hasCommonProjects = filteredProjectsForClusters.length > 0;
            if (!hasCommonProjects) return true;
          }
          return false;
        }
        
        // For 'clusters' path
      if (resourceScope === 'clusters') {
          // Must select at least one cluster (table is inline)
          if (!showScopeSelection && selectedClusters.length === 0) return true;
          // If scope selection is shown, check scope type
          if (showScopeSelection && clusterScope === 'everything') return false;
          // If partial access (projects) is selected, must select at least one project
          if (showScopeSelection && clusterScope === 'projects' && selectedProjects.length === 0) return true;
          return false;
        }
        
      return false;
    }
      
    return false;
    })();
    
    return disabled;
  };

  // Filter functions for users and groups
  const filteredUsers = React.useMemo(() => {
    // If we have a pre-authorized user saved, show only that
    if (preauthorizedUserEntry) {
      return [preauthorizedUserEntry];
    }
    
    // Otherwise show filtered existing users
    return mockUsers.filter(user => {
      if (!userSearch) return true;
      
      // Search in both name and username for "User" filter
      return user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
             user.username.toLowerCase().includes(userSearch.toLowerCase());
    });
  }, [preauthorizedUserEntry, userSearch]);

  const filteredGroups = mockGroups.filter(group => {
    if (!groupSearch) return true;
    
    return group.name.toLowerCase().includes(groupSearch.toLowerCase());
  });

  // Pagination handlers for users and groups
  const onSetUsersPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setUsersPage(newPage);
  };

  const onUsersPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setUsersPerPage(newPerPage);
    setUsersPage(1);
  };

  const onSetGroupsPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setGroupsPage(newPage);
  };

  const onGroupsPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setGroupsPerPage(newPerPage);
    setGroupsPage(1);
  };

  // Mock cluster sets data
  const mockClusterSets = React.useMemo(() => {
    return dbClusterSets.map((clusterSet, index) => ({
      id: index + 1,
      dbId: clusterSet.id,
      name: clusterSet.name,
      clusterCount: dbClusters.filter(c => c.clusterSetId === clusterSet.id).length,
    }));
  }, []);

  // Mock clusters data - ALL clusters for specific cluster selection
  const mockClusters = React.useMemo(() => {
    return dbClusters.map((cluster, index) => ({
      id: index + 1,
      dbId: cluster.id,
      name: cluster.name,
      status: cluster.status,
      clusterSet: dbClusterSets.find(cs => cs.id === cluster.clusterSetId)?.name || 'Unknown',
      infrastructure: index % 3 === 0 ? 'Amazon Web Services' : index % 3 === 1 ? 'Microsoft Azure' : 'Google Cloud Platform',
      controlPlaneType: 'Standalone',
      kubernetesVersion: cluster.kubernetesVersion,
      labels: Math.floor(Math.random() * 10) + 1,
      nodes: cluster.nodes,
    }));
  }, []);

  const filteredClusterSets = mockClusterSets.filter(clusterSet =>
    clusterSet.name.toLowerCase().includes(clusterSetSearch.toLowerCase())
  );

  const filteredClusters = mockClusters.filter(cluster =>
    cluster.name.toLowerCase().includes(clusterSearch.toLowerCase())
  );

  // Filtered clusters for the selected cluster sets
  const filteredClustersForClusterSets = React.useMemo(() => {
    if (selectedClusterSets.length === 0) return [];
    
    // Get the database IDs of selected cluster sets
    const selectedClusterSetDbIds = selectedClusterSets
      .map(id => mockClusterSets.find(cs => cs.id === id)?.dbId)
      .filter(Boolean);
    
    // Filter clusters that belong to the selected cluster sets
    return mockClusters.filter(cluster => {
      const dbCluster = dbClusters.find(c => c.id === cluster.dbId);
      return dbCluster && selectedClusterSetDbIds.includes(dbCluster.clusterSetId);
    }).filter(cluster =>
      cluster.name.toLowerCase().includes(clusterSearch.toLowerCase())
    );
  }, [selectedClusterSets, clusterSearch, mockClusterSets, mockClusters]);

  // Mock projects data - ALL namespaces
  const mockProjects = React.useMemo(() => {
    return dbNamespaces.map((namespace, index) => ({
      id: index + 1,
      name: namespace.name,
      displayName: namespace.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: namespace.type,
      status: 'Active' as 'Active' | 'Terminating' | 'Failed',
      clusterId: namespace.clusterId,
      clusterName: dbClusters.find(c => c.id === namespace.clusterId)?.name || 'Unknown',
    }));
  }, []);

  // Filtered projects based on selected clusters
  const filteredProjectsForClusters = React.useMemo(() => {
    if (selectedClusters.length === 0) return [];
    
    // Get cluster database IDs from selected cluster IDs
      const selectedClusterDbIds = selectedClusters
        .map(id => mockClusters.find(c => c.id === id)?.dbId)
        .filter(Boolean) as string[];
      
    // Filter projects that belong to selected clusters
    let projects = mockProjects.filter(p => selectedClusterDbIds.includes(p.clusterId));
      
    // If multiple clusters selected, show only COMMON projects (same name across all selected clusters)
      if (selectedClusters.length > 1) {
        const projectsByName = new Map<string, typeof mockProjects>();
        projects.forEach(project => {
          if (!projectsByName.has(project.name)) {
            projectsByName.set(project.name, []);
          }
          projectsByName.get(project.name)?.push(project);
        });
        
        // Find project names that appear in ALL selected clusters
        const commonProjectNames = Array.from(projectsByName.entries())
          .filter(([_, projs]) => projs.length === selectedClusters.length)
          .map(([name]) => name);
        
      // Show only common projects
        projects = projects.filter(p => commonProjectNames.includes(p.name));
    }
    
    // Apply search filter
    if (projectSearch) {
      projects = projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase()));
    }
    
    return projects;
  }, [selectedClusters, projectSearch, mockProjects, mockClusters]);

  // Render step indicator to match the original wizard
  const renderStepIndicator = (stepNum: number, label: string, isSubStep: boolean = false) => {
    const isActive = currentStep === stepNum;
    const isCompleted = currentStep > stepNum;
    
    // Render substeps without circles
    if (isSubStep) {
      return (
        <div style={{ position: 'relative', marginBottom: '0.25rem', paddingLeft: '3.5rem' }}>
          <span
            style={{ 
              display: 'inline-block',
              padding: '0.5rem 0.75rem',
              fontSize: '14px',
              color: '#6a6e73',
              cursor: 'default',
              borderRadius: '4px'
            }}
          >
            {label}
          </span>
        </div>
      );
    }
    
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
      <div style={{ position: 'relative', height: '100%' }}>
        {/* Overlay Drawer Panel */}
        {isDrawerExpanded && (
          <div 
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '500px',
              maxWidth: '50%',
              height: '100%',
              backgroundColor: 'white',
              zIndex: 1000,
              boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
              overflow: 'auto'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #d2d2d2'
            }}>
              <Title headingLevel="h3" size="xl">
                Example scopes
              </Title>
              <Button 
                variant="plain" 
                onClick={() => setIsDrawerExpanded(false)}
                aria-label="Close drawer"
              >
                <TimesIcon />
              </Button>
            </div>
            <div style={{ padding: '16px' }}>
              <Content component="p" style={{ marginBottom: '16px', fontSize: '14px', color: '#6a6e73' }}>
                These examples show different ways to scope role assignments.
              </Content>
              {/* Carousel navigation */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Button 
                  variant="plain" 
                  onClick={() => setExampleIndex(Math.max(0, exampleIndex - 1))}
                  isDisabled={exampleIndex === 0}
                  aria-label="Previous example"
                >
                  <AngleLeftIcon />
                </Button>
                <span style={{ fontSize: '14px', color: '#6a6e73' }}>
                  Example {exampleIndex + 1} of 9
                </span>
                <Button 
                  variant="plain" 
                  onClick={() => setExampleIndex(Math.min(8, exampleIndex + 1))}
                  isDisabled={exampleIndex === 8}
                  aria-label="Next example"
                >
                  <AngleRightIcon />
                </Button>
              </div>
              {/* Example content */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '6px',
                border: '1px solid #d2d2d2',
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                <Content component="p" style={{ fontSize: '13px', marginBottom: '12px', color: '#151515', fontWeight: 600 }}>
                  {exampleIndex === 0 && 'Example scope: Full access to all resources'}
                  {exampleIndex === 1 && 'Example scope: Single cluster set → Single cluster → Partial access'}
                  {exampleIndex === 2 && 'Example scope: Single cluster set → Multiple clusters → Common projects'}
                  {exampleIndex === 3 && 'Example scope: Multiple cluster sets → Full access'}
                  {exampleIndex === 4 && 'Example scope: Multiple cluster sets → Partial access → Common projects'}
                  {exampleIndex === 5 && 'Example scope: Single cluster → Full access'}
                  {exampleIndex === 6 && 'Example scope: Single cluster → Partial access'}
                  {exampleIndex === 7 && 'Example scope: Multiple clusters → Full access'}
                  {exampleIndex === 8 && 'Example scope: Multiple clusters → Common projects'}
                </Content>
                <div style={{ paddingLeft: '8px', fontSize: '12px', lineHeight: '1.6' }}>
                  {/* Example 0: Full access to all resources */}
                  {exampleIndex === 0 && (
                    <>
                      {/* First cluster set with hierarchy */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      {/* Cluster 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      {/* Project 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      {/* VM 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      {/* VM 2 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      {/* Project 2 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      {/* VM 3 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      {/* VM 4 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      {/* Project 3 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                      {/* VM 5 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                      {/* VM 6 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                      {/* Additional cluster sets abbreviated for brevity */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 1: Single cluster set → Single cluster → Partial access */}
                  {exampleIndex === 1 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 2: Single cluster set → Multiple clusters → Common projects */}
                  {exampleIndex === 2 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 3: Multiple cluster sets → Full access */}
                  {exampleIndex === 3 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 4: Multiple cluster sets → Partial access → Common projects */}
                  {exampleIndex === 4 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 5: Single cluster → Full access */}
                  {exampleIndex === 5 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 6: Single cluster → Partial access */}
                  {exampleIndex === 6 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 7: Multiple clusters → Full access */}
                  {exampleIndex === 7 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                    </>
                  )}
                  
                  {/* Example 8: Multiple clusters → Common projects */}
                  {exampleIndex === 8 && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main wizard content */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header Section */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '1.5rem', 
          borderBottom: '1px solid #d2d2d2',
          flexShrink: 0
        }}>
          <Title headingLevel="h1" size="2xl" id="role-wizard-title">
            Create role assignment for {roleName}
          </Title>
          <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
            A role assignment specifies a distinct action users or groups can perform when associated with a particular role.{' '}
            <Button variant="link" isInline component="a" href="#" onClick={(e) => e.preventDefault()}>
              Learn more about user management, including an example YAML file.
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
            
            {/* Substeps for cluster-sets - keep visible even on later steps */}
            {resourceScope === 'cluster-sets' && (
              <>
                {/* Show "Select cluster sets" substep when cluster sets option is selected */}
                {selectedClusterSets.length >= 0 && (
                  <div style={{ marginLeft: '3.5rem', marginTop: '0', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#6a6e73',
                      cursor: 'default',
                      backgroundColor: currentStep === 2 && !showScopeSelection ? '#f5f5f5' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '0'
                    }}>
                      Select cluster sets
                    </div>
                  </div>
                )}
                {showScopeSelection && (
                  <div style={{ marginLeft: '3.5rem', marginTop: '0', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#6a6e73',
                      cursor: 'default',
                      backgroundColor: currentStep === 2 && showScopeSelection && !showProjectSelection ? '#f5f5f5' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '0'
                    }}>
                      Define cluster set granularity
                    </div>
                  </div>
                )}
                {showProjectSelection && (
                  <div style={{ marginLeft: '3.5rem', marginTop: '0', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#6a6e73',
                      cursor: 'default',
                      backgroundColor: currentStep === 2 ? '#f5f5f5' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '0'
                    }}>
                      Define cluster granularity
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Substeps for clusters - keep visible even on later steps */}
            {resourceScope === 'clusters' && (
              <>
                {/* Show "Select clusters" substep when clusters option is selected */}
                {selectedClusters.length >= 0 && (
                  <div style={{ marginLeft: '3.5rem', marginTop: '0', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#6a6e73',
                      cursor: 'default',
                      backgroundColor: currentStep === 2 && !showScopeSelection ? '#f5f5f5' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '0'
                    }}>
                      Select clusters
                    </div>
                  </div>
                )}
                {showScopeSelection && (
                  <div style={{ marginLeft: '3.5rem', marginTop: '0', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#6a6e73',
                      cursor: 'default',
                      backgroundColor: currentStep === 2 && showScopeSelection && !showProjectSelection ? '#f5f5f5' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '0'
                    }}>
                      Define cluster granularity
                    </div>
                  </div>
                )}
                {showProjectSelection && (
                  <div style={{ marginLeft: '3.5rem', marginTop: '0', marginBottom: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.5rem 0.75rem',
                      fontSize: '14px',
                      color: '#6a6e73',
                      cursor: 'default',
                      backgroundColor: currentStep === 2 ? '#f5f5f5' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '0'
                    }}>
                      Select projects
                    </div>
                  </div>
                )}
              </>
            )}
            
            {renderStepIndicator(3, 'Review')}
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
            <div 
              ref={wizardContentRef}
              style={{ 
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
                  setIdentityType('user');
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
              activeKey={identityType}
              onSelect={(_event, tabIndex) => {
                setIdentityType(tabIndex as 'user' | 'group');
                setSelectedUser(null);
                setSelectedGroup(null);
                setIsPreauthorizing(false);
                setPreauthorizeEmail('');
                setPreauthorizeIdpId('');
                setPreauthorizedUserEntry(null);
                setUserSearch('');
                setGroupSearch('');
              }}
              aria-label="Select user or group"
              style={{ marginBottom: '24px' }}
            >
              <Tab 
                eventKey="user" 
                title={<TabTitleText>Users</TabTitleText>}
                aria-label="Users tab"
                style={{
                  borderBottom: identityType === 'user' ? '3px solid #0066cc' : 'none',
                  color: identityType === 'user' ? '#0066cc' : '#6a6e73',
                  fontWeight: identityType === 'user' ? 600 : 400
                }}
              />
              <Tab 
                eventKey="group" 
                title={<TabTitleText>Groups</TabTitleText>}
                aria-label="Groups tab"
                style={{
                  borderBottom: identityType === 'group' ? '3px solid #0066cc' : 'none',
                  color: identityType === 'group' ? '#0066cc' : '#6a6e73',
                  fontWeight: identityType === 'group' ? 600 : 400
                }}
              />
            </Tabs>

            {identityType === 'user' && (
              <>
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
                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={filteredUsers.length}
                        page={usersPage}
                        perPage={usersPerPage}
                        onSetPage={onSetUsersPage}
                        onPerPageSelect={onUsersPerPageSelect}
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
                      {filteredUsers
                        .slice((usersPage - 1) * usersPerPage, usersPage * usersPerPage)
                        .map((user) => (
                          <Tr
                            key={user.id}
                            isSelectable
                            isClickable
                            isRowSelected={selectedUser === user.id}
                            onRowClick={() => setSelectedUser(user.id)}
                          >
                            <Td>
                              <Radio
                                id={`user-${user.id}`}
                                name="user-selection"
                                isChecked={selectedUser === user.id}
                                onChange={() => setSelectedUser(user.id)}
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
                                      style={{ padding: 0, fontSize: 'inherit' }}
                                    >
                                      {user.name}
                                    </Button>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>{user.username}</div>
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
                                        // Clear pre-auth user and return to regular users table
                                        setPreauthorizedUserEntry(null);
                                        // Clear selection to keep Next button disabled
                                        setSelectedUser(null);
                                        setPreauthorizeEmail('');
                                        setPreauthorizeIdpId('');
                                        setUserSearch('');
                                        // User must now select an existing user from the table to proceed
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
                      No users match "{userSearch}". You can pre-authorize this user to grant them access when they log in for the first time.
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
                            // Create a temporary user entry for the pre-authorized user
                            const idpName = preauthorizeIdpId 
                              ? dbIdentityProviders.find(idp => idp.id === preauthorizeIdpId)?.name 
                              : 'Any';
                            
                            const tempUserId = -1; // Negative ID to distinguish from real users
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
                            // Don't auto-select - user must explicitly select the pre-auth user
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
              </>
            )}

            {identityType === 'group' && (
              <>
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
                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={filteredGroups.length}
                        page={groupsPage}
                        perPage={groupsPerPage}
                        onSetPage={onSetGroupsPage}
                        onPerPageSelect={onGroupsPerPageSelect}
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
                    {filteredGroups
                      .slice((groupsPage - 1) * groupsPerPage, groupsPage * groupsPerPage)
                      .map((group) => (
                        <Tr
                          key={group.id}
                          isSelectable
                          isClickable
                          isRowSelected={selectedGroup === group.id}
                          onRowClick={() => setSelectedGroup(group.id)}
                        >
                          <Td>
                            <Radio
                              id={`group-${group.id}`}
                              name="group-selection"
                              isChecked={selectedGroup === group.id}
                              onChange={() => setSelectedGroup(group.id)}
                            />
                          </Td>
                          <Td dataLabel="Group" width={20}>
                            <Button 
                              variant="link" 
                              isInline 
                              component="a" 
                              href={`#/user-management/identities/groups/${encodeURIComponent(group.name)}`}
                              target="_blank"
                              style={{ padding: 0, fontSize: 'inherit' }}
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
              </>
            )}
          </>
        )}

        {/* Step 2: Select Resources */}
        {currentStep === 2 && (
          <>
            {/* Only show title, description, and initial dropdown when NOT in any substep */}
            {!showClusterSetSelection && !showScopeSelection && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
                Select resources
            </Title>
              <Button 
                variant="link" 
                onClick={() => setIsDrawerExpanded(true)}
                style={{ padding: 0 }}
              >
                View examples
              </Button>
            </div>
            <Content component="p" style={{ marginBottom: '16px', color: '#6a6e73', fontSize: '14px' }}>
                  Define the scope of access by selecting which resources this role will apply to.
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
                      {resourceScope === 'everything' && 'Global access'}
                      {resourceScope === 'cluster-sets' && 'Select cluster sets'}
                      {resourceScope === 'clusters' && 'Select clusters'}
                  </MenuToggle>
                )}
                shouldFocusToggleOnSelect
                popperProps={{
                  appendTo: () => document.body,
                  
                  
                }}
              >
                <DropdownList>
                    <DropdownItem
                      key="everything"
                      onClick={() => {
                      setResourceScope('everything');
                      setSelectedClusterSets([]);
                      setSelectedClusters([]);
                      setSelectedProjects([]);
                        setShowClusterSetSelection(false);
                      setShowScopeSelection(false);
                      setIsResourceScopeOpen(false);
                    }}
                      description="Grant access to all resources across all clusters registered in ACM"
                    >
                      Global access
                    </DropdownItem>
                    <DropdownItem
                      key="cluster-sets"
                      onClick={() => {
                        setResourceScope('cluster-sets');
                        setSelectedClusterSets([]);
                        setSelectedClusters([]);
                        setSelectedProjects([]);
                        setShowClusterSetSelection(false);
                        setShowScopeSelection(false);
                        setClusterSetScope('everything'); // Reset to default
                        setIsResourceScopeOpen(false);
                      }}
                      description="Grant access to 1 or more cluster sets. Optionally, narrow this access to specific clusters and projects."
                    >
                      Select cluster sets
                  </DropdownItem>
                  <DropdownItem
                    key="clusters"
                    onClick={() => {
                      setResourceScope('clusters');
                        setSelectedClusterSets([]);
                      setSelectedClusters([]);
                      setSelectedProjects([]);
                        setShowClusterSetSelection(false);
                      setShowScopeSelection(false);
                        setClusterScope('everything'); // Reset to default
                      setIsResourceScopeOpen(false);
                    }}
                      description="Grant access to 1 or more clusters. Optionally, narrow this access to projects."
                  >
                      Select clusters
                  </DropdownItem>
                </DropdownList>
              </Dropdown>

                {/* Cluster sets table - inline below dropdown */}
                {resourceScope === 'cluster-sets' && (
                  <div style={{ marginTop: '16px' }}>
                    <Toolbar>
                      <ToolbarContent>
                        {/* Bulk selector dropdown */}
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isClusterSetBulkSelectorOpen}
                            onSelect={() => setIsClusterSetBulkSelectorOpen(false)}
                            onOpenChange={(isOpen: boolean) => setIsClusterSetBulkSelectorOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => {
                                  if (selectedClusterSets.length > 0) {
                                    setSelectedClusterSets([]);
                                  } else {
                                    setIsClusterSetBulkSelectorOpen(!isClusterSetBulkSelectorOpen);
                                  }
                                }}
                                variant="plain"
                                style={{
                                  padding: '0',
                                  minWidth: 'auto',
                                  height: 'auto'
                                }}
                              >
                                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  <FlexItem>
                                    <Checkbox
                                      isChecked={filteredClusterSets.length > 0 && filteredClusterSets.every(cs => selectedClusterSets.includes(cs.id))}
                                      onChange={(event, checked) => {
                                        event.stopPropagation();
                                        if (checked) {
                                          // Select all visible
                                          const allIds = filteredClusterSets.map(cs => cs.id);
                                          const combined = [...selectedClusterSets, ...allIds];
                                          setSelectedClusterSets(Array.from(new Set(combined)));
                                        } else {
                                          // Deselect all visible
                                          const visibleIds = filteredClusterSets.map(cs => cs.id);
                                          setSelectedClusterSets(selectedClusterSets.filter(id => !visibleIds.includes(id)));
                                        }
                                      }}
                                      aria-label="Select all"
                                      id="select-all-cluster-sets-checkbox"
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
                              <DropdownItem
                                onClick={() => {
                                  setSelectedClusterSets([]);
                                  setIsClusterSetBulkSelectorOpen(false);
                                }}
                              >
                                Select none
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  // Select all visible on current view
                                  const allIds = filteredClusterSets.map(cs => cs.id);
                                  const combined = [...selectedClusterSets, ...allIds];
                                  setSelectedClusterSets(Array.from(new Set(combined)));
                                  setIsClusterSetBulkSelectorOpen(false);
                                }}
                              >
                                Select page ({filteredClusterSets.length} items)
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  // Select all cluster sets
                                  setSelectedClusterSets(mockClusterSets.map(cs => cs.id));
                                  setIsClusterSetBulkSelectorOpen(false);
                                }}
                              >
                                Select all ({mockClusterSets.length} items)
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isClusterSetFilterOpen}
                            onSelect={() => setIsClusterSetFilterOpen(false)}
                            onOpenChange={(isOpen: boolean) => setIsClusterSetFilterOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsClusterSetFilterOpen(!isClusterSetFilterOpen)} 
                                isExpanded={isClusterSetFilterOpen}
                                variant="default"
                              >
                                {clusterSetFilterType}
                              </MenuToggle>
                            )}
                            popperProps={{
                              appendTo: () => document.body
                            }}
                          >
                            <DropdownList>
                              <DropdownItem onClick={() => { setClusterSetFilterType('Name'); setIsClusterSetFilterOpen(false); }}>
                                Name
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Search cluster sets"
                            value={clusterSetSearch}
                            onChange={(_event, value) => setClusterSetSearch(value)}
                            onClear={() => setClusterSetSearch('')}
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                    <Table aria-label="Cluster sets table" variant="compact">
                      <Thead>
                        <Tr>
                          <Th />
                          <Th>Cluster set name</Th>
                          <Th>Clusters</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredClusterSets.map((clusterSet) => (
                          <Tr
                            key={clusterSet.id}
                            isSelectable
                            isClickable
                            isRowSelected={selectedClusterSets.includes(clusterSet.id)}
                            onRowClick={() => {
                              if (selectedClusterSets.includes(clusterSet.id)) {
                                setSelectedClusterSets(selectedClusterSets.filter(id => id !== clusterSet.id));
                              } else {
                                setSelectedClusterSets([...selectedClusterSets, clusterSet.id]);
                              }
                            }}
                          >
                            <Td>
                              <Checkbox
                                id={`cluster-set-${clusterSet.id}`}
                                isChecked={selectedClusterSets.includes(clusterSet.id)}
                                onChange={() => {
                                  if (selectedClusterSets.includes(clusterSet.id)) {
                                    setSelectedClusterSets(selectedClusterSets.filter(id => id !== clusterSet.id));
                                  } else {
                                    setSelectedClusterSets([...selectedClusterSets, clusterSet.id]);
                                  }
                                }}
                              />
                            </Td>
                            <Td dataLabel="Cluster set name">
                              <div style={{ fontWeight: selectedClusterSets.includes(clusterSet.id) ? '600' : 'normal' }}>
                                {clusterSet.name}
                              </div>
                            </Td>
                            <Td dataLabel="Clusters">{clusterSet.clusterCount}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </div>
                )}

                {/* Clusters table - inline below dropdown */}
                {resourceScope === 'clusters' && (
                  <div style={{ marginTop: '16px' }}>
                    <Toolbar>
                      <ToolbarContent>
                        {/* Bulk selector dropdown */}
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isClusterBulkSelectorOpen}
                            onSelect={() => setIsClusterBulkSelectorOpen(false)}
                            onOpenChange={(isOpen: boolean) => setIsClusterBulkSelectorOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => {
                                  if (selectedClusters.length > 0) {
                                    setSelectedClusters([]);
                                  } else {
                                    setIsClusterBulkSelectorOpen(!isClusterBulkSelectorOpen);
                                  }
                                }}
                                variant="plain"
                                style={{
                                  padding: '0',
                                  minWidth: 'auto',
                                  height: 'auto'
                                }}
                              >
                                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                  <FlexItem>
                                    <Checkbox
                                      isChecked={filteredClusters.length > 0 && filteredClusters.every(c => selectedClusters.includes(c.id))}
                                      onChange={(event, checked) => {
                                        event.stopPropagation();
                                        if (checked) {
                                          const allIds = filteredClusters.map(c => c.id);
                                          setSelectedClusters(allIds);
                                        } else {
                                          setSelectedClusters([]);
                                        }
                                        setIsClusterBulkSelectorOpen(false);
                                      }}
                                      aria-label="Select all"
                                      id="select-all-clusters-direct-checkbox"
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
                              <DropdownItem onClick={() => {
                                setSelectedClusters([]);
                                setIsClusterBulkSelectorOpen(false);
                              }}>
                                Select none
                              </DropdownItem>
                              <DropdownItem onClick={() => {
                                const pageIds = filteredClusters
                                  .slice((clustersPage - 1) * clustersPerPage, clustersPage * clustersPerPage)
                                  .map(c => c.id);
                                setSelectedClusters(pageIds);
                                setIsClusterBulkSelectorOpen(false);
                              }}>
                                Select page ({filteredClusters.slice((clustersPage - 1) * clustersPerPage, clustersPage * clustersPerPage).length} items)
                              </DropdownItem>
                              <DropdownItem onClick={() => {
                                const allIds = mockClusters.map(c => c.id);
                                setSelectedClusters(allIds);
                                setIsClusterBulkSelectorOpen(false);
                              }}>
                                Select all ({mockClusters.length} items)
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <Dropdown
                            isOpen={isClusterFilterOpen}
                            onSelect={() => setIsClusterFilterOpen(false)}
                            onOpenChange={(isOpen: boolean) => setIsClusterFilterOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsClusterFilterOpen(!isClusterFilterOpen)} 
                                isExpanded={isClusterFilterOpen}
                                variant="default"
                              >
                                {clusterFilterType}
                              </MenuToggle>
                            )}
                            popperProps={{
                              appendTo: () => document.body
                            }}
                          >
                            <DropdownList>
                              <DropdownItem onClick={() => { setClusterFilterType('Cluster'); setIsClusterFilterOpen(false); }}>
                                Cluster
                              </DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </ToolbarItem>
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Search clusters"
                            value={clusterSearch}
                            onChange={(_event, value) => setClusterSearch(value)}
                            onClear={() => setClusterSearch('')}
                          />
                        </ToolbarItem>
                        <ToolbarItem align={{ default: 'alignEnd' }}>
                          <Pagination
                            itemCount={filteredClusters.length}
                            perPage={clustersPerPage}
                            page={clustersPage}
                            onSetPage={(_event, pageNumber) => setClustersPage(pageNumber)}
                            onPerPageSelect={(_event, perPage) => {
                              setClustersPerPage(perPage);
                              setClustersPage(1);
                            }}
                            variant="top"
                            isCompact
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                    <Table aria-label="Clusters table" variant="compact">
                      <Thead>
                        <Tr>
                          <Th />
                          <Th>Cluster name</Th>
                          <Th>Cluster set</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredClusters
                          .slice((clustersPage - 1) * clustersPerPage, clustersPage * clustersPerPage)
                          .map((cluster) => (
                          <Tr
                            key={cluster.id}
                            isSelectable
                            isClickable
                            isRowSelected={selectedClusters.includes(cluster.id)}
                            onRowClick={() => {
                              if (selectedClusters.includes(cluster.id)) {
                                setSelectedClusters(selectedClusters.filter(id => id !== cluster.id));
                              } else {
                                setSelectedClusters([...selectedClusters, cluster.id]);
                              }
                            }}
                          >
                            <Td>
                              <Checkbox
                                id={`cluster-${cluster.id}`}
                                isChecked={selectedClusters.includes(cluster.id)}
                                onChange={() => {
                                  if (selectedClusters.includes(cluster.id)) {
                                    setSelectedClusters(selectedClusters.filter(id => id !== cluster.id));
                                  } else {
                                    setSelectedClusters([...selectedClusters, cluster.id]);
                                  }
                                }}
                              />
                            </Td>
                            <Td dataLabel="Cluster name">
                              <div style={{ fontWeight: selectedClusters.includes(cluster.id) ? '600' : 'normal' }}>
                                {cluster.name}
                              </div>
                            </Td>
                            <Td dataLabel="Cluster set">{cluster.clusterSet || '-'}</Td>
                            <Td dataLabel="Status">
                              <Label color={cluster.status === 'Ready' ? 'green' : 'grey'}>
                                {cluster.status}
                              </Label>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Pagination
                      itemCount={filteredClusters.length}
                      perPage={clustersPerPage}
                      page={clustersPage}
                      onSetPage={(_event, pageNumber) => setClustersPage(pageNumber)}
                      onPerPageSelect={(_event, perPage) => {
                        setClustersPerPage(perPage);
                        setClustersPage(1);
                      }}
                      variant="bottom"
                    />
                  </div>
                )}

                {/* Cluster sets scope - examples removed (now in drawer) */}
                {resourceScope === 'cluster-sets' && false && (
                  <div style={{ display: 'none' }}>
              <div style={{ 
                    padding: '16px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '6px',
                    border: '1px solid #d2d2d2',
                    marginTop: '24px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Content component="p" style={{ fontSize: '13px', color: '#151515', fontWeight: 600, margin: 0 }}>
                        {clusterSetExampleIndex === 0 && 'Example 1: Single cluster set → Single cluster → Partial access'}
                        {clusterSetExampleIndex === 1 && 'Example 2: Single cluster set → Multiple clusters → Common projects'}
                        {clusterSetExampleIndex === 2 && 'Example 3: Multiple cluster sets → Full access'}
                        {clusterSetExampleIndex === 3 && 'Example 4: Multiple cluster sets → Partial access → Common projects'}
                  </Content>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Button 
                        variant="plain" 
                          onClick={() => setClusterSetExampleIndex(Math.max(0, clusterSetExampleIndex - 1))}
                          isDisabled={clusterSetExampleIndex === 0}
                        aria-label="Previous example"
                      >
                        <AngleLeftIcon />
                      </Button>
                      <span style={{ fontSize: '12px', color: '#6a6e73' }}>
                          {clusterSetExampleIndex + 1} of 4
                      </span>
                      <Button 
                        variant="plain" 
                          onClick={() => setClusterSetExampleIndex(Math.min(3, clusterSetExampleIndex + 1))}
                          isDisabled={clusterSetExampleIndex === 3}
                        aria-label="Next example"
                      >
                        <AngleRightIcon />
                      </Button>
                    </div>
                </div>
                <div style={{ paddingLeft: '8px', fontSize: '12px', lineHeight: '1.6' }}>
                      {/* EXAMPLE 1: Single cluster set → Single cluster → Partial access */}
                      {clusterSetExampleIndex === 0 && (
                    <>
                          {/* Use the same full hierarchy as "Everything" but with conditional highlighting */}
                          {/* CLUSTER SET 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      
                          {/* Cluster 1 in Set 1 - HIGHLIGHTED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      
                          {/* Project 1 on Cluster 1 - HIGHLIGHTED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Project</span>
                          </div>
                          
                          {/* VM 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 on Cluster 1 - NOT selected */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                          <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          
                          {/* VM 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 4 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Cluster 2 in Set 1 - NOT selected */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 on Cluster 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          
                          {/* VM 5 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 6 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 on Cluster 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          
                          {/* VM 7 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 8 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* CLUSTER SET 2 - All empty */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster set</span>
                          </div>
                          
                          {/* Cluster 1 in Set 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          
                          {/* Project 1 on Cluster 1 in Set 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 on Cluster 1 in Set 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Cluster 2 in Set 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 on Cluster 2 in Set 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 on Cluster 2 in Set 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* CLUSTER SET 3 - All empty */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster set</span>
                          </div>
                          
                          {/* Cluster 1 in Set 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 on Cluster 1 in Set 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 on Cluster 1 in Set 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Cluster 2 in Set 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 on Cluster 2 in Set 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 on Cluster 2 in Set 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                        </>
                      )}

                      {/* EXAMPLE 2: Single cluster set → Multiple clusters → Common projects */}
                      {clusterSetExampleIndex === 1 && (
                        <>
                          {/* This is the same full tree structure as Example 1 */}
                          {/* CLUSTER SET 1 - CHECKED with both clusters and common project checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      
                          {/* Cluster 1 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                          </div>
                          
                          {/* Common Project - CHECKED with highlighting */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                          </div>
                          
                          {/* VM 1 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* VM 2 - CHECKED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Project 2 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                          <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                          {/* VM 3 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                          <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* VM 4 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Cluster 2 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                          </div>
                          
                          {/* Common Project - CHECKED with highlighting */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                          </div>
                          
                          {/* VM 5 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 6 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                          <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          
                          {/* VM 7 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 8 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Copy the exact same structure for CS2 and CS3, all unchecked */}
                          {/* CLUSTER SET 2 - All unchecked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster set</span>
                          </div>
                          
                          {/* Cluster 1 in CS2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* I'll abbreviate CS2 and CS3 to save space - both clusters with 2 projects, 2 VMs each, all unchecked */}
                          
                          {/* CLUSTER SET 3 - All unchecked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster set</span>
                          </div>
                          
                          {/* Cluster 1 in CS3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                        </>
                      )}

                      {/* EXAMPLE 3: Multiple cluster sets → Full access */}
                      {clusterSetExampleIndex === 2 && (
                        <>
                          {/* Cluster set 1 - selected */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                          </div>
                          
                          {/* Cluster 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          
                          {/* VM 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* VM 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          
                          {/* VM 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 4 */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Cluster 2 in CS1 - ALL CHECKED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      
                          {/* Project 1 on Cluster 2 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Project 2 on Cluster 2 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* CLUSTER SET 2 - ALL CHECKED with highlighting */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                          </div>
                          
                          {/* Cluster 1 in CS2 - CHECKED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 on Cluster 1 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Project 2 on Cluster 1 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Cluster 2 in CS2 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 on Cluster 2 - CHECKED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Project 2 on Cluster 2 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* CLUSTER SET 3 - ALL UNCHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      
                          {/* Cluster 1 in CS3 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Abbreviated - all remaining items in CS3 are unchecked */}
                          
                          {/* Cluster 2 in CS3 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                        </>
                      )}

                      {/* EXAMPLE 4: Multiple cluster sets → Partial access → Specific clusters and common projects */}
                      {clusterSetExampleIndex === 3 && (
                        <>
                          {/* CLUSTER SET 1 - Partial selection */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                      </div>
                      
                          {/* Cluster 1 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                      </div>
                      
                          {/* Common Project - CHECKED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                          </div>
                          
                          {/* VM 1 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* VM 2 - CHECKED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Project 2 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                          {/* VM 3 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* VM 4 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Cluster 2 in CS1 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      
                          {/* Project 1 on Cluster 2 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* Project 2 on Cluster 2 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* CLUSTER SET 2 - Partial selection */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster set</span>
                          </div>
                          
                          {/* Cluster 1 in CS2 - CHECKED */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Cluster</span>
                          </div>
                          
                          {/* Common Project in CS2 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515', fontWeight: 600, backgroundColor: '#e7f1fa', padding: '2px 6px', borderRadius: '3px' }}>Common project</span>
                          </div>
                          
                          {/* VM 1 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* VM 2 - CHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                          {/* VM 3 - NOT checked */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                          {/* VM 4 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                          
                          {/* Cluster 2 in CS2 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Project 1 on Cluster 2 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* Project 2 on Cluster 2 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                            <span style={{ marginLeft: '60px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          {/* CLUSTER SET 3 - ALL UNCHECKED */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                        <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster set</span>
                      </div>
                      
                          {/* Cluster 1 in CS3 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          
                          {/* Abbreviated - all remaining items in CS3 are unchecked */}
                          
                          {/* Cluster 2 in CS3 - NOT checked */}
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  </div>
                )}

                {/* Clusters scope - examples removed (now in drawer) */}
                {false && (
                  <div style={{ display: 'none' }}>
                      <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '6px',
                    border: '1px solid #d2d2d2',
                    marginTop: '24px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Content component="p" style={{ fontSize: '13px', color: '#151515', fontWeight: 600, margin: 0 }}>
                        {clusterExampleIndex === 0 && 'Example 1: Single cluster → Full access'}
                        {clusterExampleIndex === 1 && 'Example 2: Single cluster → Partial access'}
                        {clusterExampleIndex === 2 && 'Example 3: Multiple clusters → Full access'}
                        {clusterExampleIndex === 3 && 'Example 4: Multiple clusters → Common projects'}
                      </Content>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button 
                          variant="plain" 
                          onClick={() => setClusterExampleIndex(Math.max(0, clusterExampleIndex - 1))}
                          isDisabled={clusterExampleIndex === 0}
                          aria-label="Previous example"
                        >
                          <AngleLeftIcon />
                        </Button>
                        <span style={{ fontSize: '12px', color: '#6a6e73' }}>
                          {clusterExampleIndex + 1} of 4
                        </span>
                        <Button 
                          variant="plain" 
                          onClick={() => setClusterExampleIndex(Math.min(3, clusterExampleIndex + 1))}
                          isDisabled={clusterExampleIndex === 3}
                          aria-label="Next example"
                        >
                          <AngleRightIcon />
                        </Button>
                      </div>
                    </div>
                    
                    <div style={{ paddingLeft: '8px', fontSize: '12px', lineHeight: '1.6' }}>
                      {/* EXAMPLE 1: Single cluster → Full access */}
                      {clusterExampleIndex === 0 && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                        </>
                      )}
                      
                      {/* EXAMPLE 2: Single cluster → Partial access */}
                      {clusterExampleIndex === 1 && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                        </>
                      )}
                      
                      {/* EXAMPLE 3: Multiple clusters → Full access */}
                      {clusterExampleIndex === 2 && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                        </>
                      )}
                      
                      {/* EXAMPLE 4: Multiple clusters → Common projects */}
                      {clusterExampleIndex === 3 && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Common project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Cluster</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Common project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                            <span style={{ marginLeft: '20px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Project</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                            <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                            <span style={{ marginLeft: '40px' }}></span>
                            <ResourcesEmptyIcon style={{ color: '#151515', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                            <span style={{ color: '#151515' }}>Virtual machine</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  </div>
                )}

                {/* Everything scope - no selection needed */}
                {resourceScope === 'everything' && (
                  <>
                    <Content component="p" style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px', marginBottom: '16px' }}>
                      This role assignment will apply to all resources registered in Advanced Cluster Management.
                    </Content>
                    
                    {/* Tree view example for "Everything" - removed (now in drawer) */}
                    {false && (
                    <div style={{ display: 'none' }}>
                      <div style={{ 
                      padding: '16px', 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: '6px',
                      border: '1px solid #d2d2d2',
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}>
                      <Content component="p" style={{ fontSize: '13px', marginBottom: '12px', color: '#151515', fontWeight: 600 }}>
                        Example scope: Full access to all resources
                      </Content>
                      <div style={{ paddingLeft: '8px', fontSize: '12px', lineHeight: '1.6' }}>
                        {/* CLUSTER SET 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster set</span>
                        </div>
                        
                        {/* Cluster 1 in Set 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                          <span style={{ marginLeft: '20px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster</span>
                        </div>
                        
                        {/* Project 1 on Cluster 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                      {/* VM 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                        {/* VM 2 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                        {/* Project 2 on Cluster 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                      {/* VM 3 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                      {/* VM 4 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                        <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                        {/* Cluster 2 in Set 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                        <span style={{ marginLeft: '20px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Cluster</span>
                      </div>
                      
                        {/* Project 1 on Cluster 2 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                        {/* VM 5 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                        {/* VM 6 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                        {/* Project 2 on Cluster 2 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                        <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Project</span>
                      </div>
                      
                        {/* VM 7 */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                        <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                      
                        {/* VM 8 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                        <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                        <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#151515' }}>Virtual machine</span>
                      </div>
                        
                        {/* CLUSTER SET 2 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster set</span>
                </div>
                
                        {/* Cluster 1 in Set 2 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                          <span style={{ marginLeft: '20px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster</span>
              </div>
                        
                        {/* Project 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        {/* Project 2 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        {/* Cluster 2 in Set 2 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                          <span style={{ marginLeft: '20px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster</span>
                        </div>
                        
                        {/* Project 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        {/* Project 2 (last) */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        {/* CLUSTER SET 3 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', marginTop: '12px' }}>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster set</span>
                        </div>
                        
                        {/* Cluster 1 in Set 3 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                          <span style={{ marginLeft: '20px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster</span>
                        </div>
                        
                        {/* Project 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        {/* Project 2 (last in set 3, cluster 1) */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        {/* Cluster 2 in Set 3 (last) */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '6px', top: '50%' }}></span>
                          <span style={{ marginLeft: '20px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Cluster</span>
                        </div>
                        
                        {/* Project 1 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        {/* Project 2 (last) */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '50%' }}></span>
                          <span style={{ marginLeft: '40px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Project</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '1px', height: 'calc(100% + 6px)', borderLeft: '1px solid #d2d2d2', position: 'absolute', left: '26px', top: '-6px' }}></span>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', position: 'relative' }}>
                          <span style={{ width: '14px', height: '1px', borderTop: '1px solid #d2d2d2', position: 'absolute', left: '46px', top: '50%' }}></span>
                          <span style={{ marginLeft: '60px' }}></span>
                          <CheckCircleIcon style={{ color: '#3E8635', marginRight: '8px', fontSize: '12px', flexShrink: 0 }} />
                          <span style={{ color: '#151515' }}>Virtual machine</span>
                        </div>
                      </div>
                    </div>
                    </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* SUB-STEP 1: Cluster Sets Table - for 'cluster-sets' path */}
            {resourceScope === 'cluster-sets' && showClusterSetSelection && !showScopeSelection && (
              <div>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '12px' }}>
                  Select cluster sets
                </Title>
                <Content component="p" style={{ marginBottom: '16px', fontSize: '14px', color: '#6a6e73' }}>
                  Select one or more cluster sets to limit the scope.
                </Content>
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isClusterSetFilterOpen}
                        onSelect={() => setIsClusterSetFilterOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsClusterSetFilterOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsClusterSetFilterOpen(!isClusterSetFilterOpen)} 
                            isExpanded={isClusterSetFilterOpen}
                            variant="default"
                          >
                            {clusterSetFilterType}
                          </MenuToggle>
                        )}
                        popperProps={{
                          appendTo: () => document.body,
                          
                          
                        }}
                      >
                        <DropdownList>
                          <DropdownItem onClick={() => { setClusterSetFilterType('Cluster set'); setIsClusterSetFilterOpen(false); }}>
                            Cluster set
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder="Search cluster sets"
                        value={clusterSetSearch}
                        onChange={(_event, value) => setClusterSetSearch(value)}
                        onClear={() => setClusterSetSearch('')}
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>
                <Table aria-label="Cluster sets table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th width={10}></Th>
                      <Th>Cluster set name</Th>
                      <Th>Clusters</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredClusterSets.map((clusterSet) => (
                      <Tr
                        key={clusterSet.id}
                        isSelectable
                        isClickable
                        isRowSelected={selectedClusterSets.includes(clusterSet.id)}
                        onRowClick={() => {
                          if (selectedClusterSets.includes(clusterSet.id)) {
                            setSelectedClusterSets(selectedClusterSets.filter(id => id !== clusterSet.id));
                          } else {
                            setSelectedClusterSets([...selectedClusterSets, clusterSet.id]);
                          }
                        }}
                      >
                        <Td>
                          <Checkbox
                            id={`cluster-set-${clusterSet.id}`}
                            isChecked={selectedClusterSets.includes(clusterSet.id)}
                            onChange={() => {
                              if (selectedClusterSets.includes(clusterSet.id)) {
                                setSelectedClusterSets(selectedClusterSets.filter(id => id !== clusterSet.id));
                              } else {
                                setSelectedClusterSets([...selectedClusterSets, clusterSet.id]);
                              }
                            }}
                          />
                        </Td>
                        <Td dataLabel="Cluster set name">
                          <div style={{ fontWeight: selectedClusterSets.includes(clusterSet.id) ? '600' : 'normal' }}>
                            {clusterSet.name}
                          </div>
                        </Td>
                        <Td dataLabel="Clusters">{clusterSet.clusterCount}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            )}

            {/* SUB-STEP 2: Choose Access Level - separate substep after selecting cluster sets */}
            {resourceScope === 'cluster-sets' && showScopeSelection && !showProjectSelection && (() => {
              return (
              <div key="cluster-sets-scope-selection">
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '12px' }}>
                  Choose access level
                </Title>
                <Content component="p" style={{ marginBottom: '24px', color: '#6a6e73', fontSize: '14px' }}>
                  Define the level of access for the {selectedClusterSets.length} selected cluster set{selectedClusterSets.length > 1 ? 's' : ''}.
                </Content>
                
                <FormGroup label="Access level" style={{ marginBottom: '16px' }}>
                  <Dropdown
                    isOpen={isClusterSetScopeOpen}
                    onSelect={() => setIsClusterSetScopeOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsClusterSetScopeOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsClusterSetScopeOpen(!isClusterSetScopeOpen)} 
                        isExpanded={isClusterSetScopeOpen}
                        variant="default"
                        style={{ width: '100%' }}
                      >
                        {clusterSetScope === 'everything'
                          ? 'Cluster set role assignment'
                          : 'Cluster role assignment'}
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                    popperProps={{
                      appendTo: () => document.body,
                      
                      
                    }}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="everything"
                        onClick={() => {
                          setClusterSetScope('everything');
                          setSelectedClusters([]);
                          setIsClusterSetScopeOpen(false);
                        }}
                        description={selectedClusterSets.length === 1
                          ? 'Grant access to all current and future resources on the cluster set.'
                          : 'Grant access to all current and future resources on the cluster sets.'}
                      >
                        Cluster set role assignment
                      </DropdownItem>
                      <DropdownItem
                        key="partial"
                        onClick={() => {
                          setClusterSetScope('partial');
                          setIsClusterSetScopeOpen(false);
                        }}
                        description={selectedClusterSets.length === 1
                          ? 'Grant access to specific clusters on the cluster set. Optionally, narrow this access to projects on the selected clusters.'
                          : 'Grant access to specific clusters on the cluster sets. Optionally, narrow this access to common projects on the selected clusters.'}
                      >
                        Cluster role assignment
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FormGroup>

                {/* Message for cluster set role assignment */}
                {clusterSetScope === 'everything' && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#6a6e73'
                  }}>
                    This role assignment will apply to all current and future resources on the cluster set.
                  </div>
                )}

                {/* Show clusters table BELOW the dropdown if partial access is selected */}
                {clusterSetScope === 'partial' && (
              <div style={{ marginTop: '24px' }}>
                    <Content component="p" style={{ marginBottom: '16px', fontSize: '14px', color: '#6a6e73' }}>
                      Select one or more clusters from the selected cluster sets.
                    </Content>
                    <Toolbar>
                  <ToolbarContent>
                    {/* Bulk selector dropdown for clusters */}
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isClusterBulkSelectorOpen}
                        onSelect={() => setIsClusterBulkSelectorOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsClusterBulkSelectorOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => {
                              if (selectedClusters.length > 0) {
                                // Deselect all
                                setSelectedClusters([]);
                              } else {
                                // Open dropdown
                                setIsClusterBulkSelectorOpen(!isClusterBulkSelectorOpen);
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
                                  isChecked={filteredClustersForClusterSets.length > 0 && filteredClustersForClusterSets.every(c => selectedClusters.includes(c.id))}
                                  onChange={(event, checked) => {
                                    event.stopPropagation();
                                    if (checked) {
                                      // Select all visible
                                      const allIds = filteredClustersForClusterSets.map(c => c.id);
                                      const combined = [...selectedClusters, ...allIds];
                                      setSelectedClusters(Array.from(new Set(combined)));
                                    } else {
                                      // Deselect all visible
                                      const visibleIds = filteredClustersForClusterSets.map(c => c.id);
                                      setSelectedClusters(selectedClusters.filter(id => !visibleIds.includes(id)));
                                    }
                                  }}
                                  aria-label="Select all"
                                  id="select-all-clusters-checkbox"
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
                          <DropdownItem
                            onClick={() => {
                              setSelectedClusters([]);
                              setIsClusterBulkSelectorOpen(false);
                            }}
                          >
                            Select none
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              // Select all visible on current view
                              const allIds = filteredClustersForClusterSets.map(c => c.id);
                              const combined = [...selectedClusters, ...allIds];
                              setSelectedClusters(Array.from(new Set(combined)));
                              setIsClusterBulkSelectorOpen(false);
                            }}
                          >
                            Select page ({filteredClustersForClusterSets.length} items)
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              // Select all clusters from cluster sets (unfiltered by search)
                              const selectedClusterSetDbIds = selectedClusterSets
                                .map(id => mockClusterSets.find(cs => cs.id === id)?.dbId)
                                .filter(Boolean);
                              const allClustersFromSets = mockClusters.filter(cluster => {
                                const dbCluster = dbClusters.find(c => c.id === cluster.dbId);
                                return dbCluster && selectedClusterSetDbIds.includes(dbCluster.clusterSetId);
                              });
                              setSelectedClusters(allClustersFromSets.map(c => c.id));
                              setIsClusterBulkSelectorOpen(false);
                            }}
                          >
                            Select all ({(() => {
                              const selectedClusterSetDbIds = selectedClusterSets
                                .map(id => mockClusterSets.find(cs => cs.id === id)?.dbId)
                                .filter(Boolean);
                              return mockClusters.filter(cluster => {
                                const dbCluster = dbClusters.find(c => c.id === cluster.dbId);
                                return dbCluster && selectedClusterSetDbIds.includes(dbCluster.clusterSetId);
                              }).length;
                            })()} items)
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isClusterFilterOpen}
                        onSelect={() => setIsClusterFilterOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsClusterFilterOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsClusterFilterOpen(!isClusterFilterOpen)} 
                            isExpanded={isClusterFilterOpen}
                            variant="default"
                          >
                            {clusterFilterType}
                          </MenuToggle>
                        )}
                        popperProps={{
                          appendTo: () => document.body,
                          
                          
                        }}
                      >
                        <DropdownList>
                          <DropdownItem onClick={() => { setClusterFilterType('Name'); setIsClusterFilterOpen(false); }}>
                            Name
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder="Search clusters"
                        value={clusterSearch}
                        onChange={(_event, value) => setClusterSearch(value)}
                        onClear={() => setClusterSearch('')}
                      />
                    </ToolbarItem>
                    <ToolbarItem align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={filteredClustersForClusterSets.length}
                        perPage={clustersPerPage}
                        page={clustersPage}
                        onSetPage={(_event, pageNumber) => setClustersPage(pageNumber)}
                        onPerPageSelect={(_event, perPage) => {
                          setClustersPerPage(perPage);
                          setClustersPage(1);
                        }}
                        variant="top"
                        isCompact
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>
                <Table aria-label="Clusters table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th />
                      <Th>Name</Th>
                      <Th>Status</Th>
                      <Th>Infrastructure</Th>
                          <Th>Kubernetes version</Th>
                      <Th>Nodes</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                        {filteredClustersForClusterSets
                          .slice((clustersPage - 1) * clustersPerPage, clustersPage * clustersPerPage)
                          .map((cluster) => (
                      <Tr
                        key={cluster.id}
                        isSelectable
                        isClickable
                        isRowSelected={selectedClusters.includes(cluster.id)}
                        onRowClick={() => {
                          if (selectedClusters.includes(cluster.id)) {
                            setSelectedClusters(selectedClusters.filter(id => id !== cluster.id));
                          } else {
                            setSelectedClusters([...selectedClusters, cluster.id]);
                          }
                        }}
                      >
                        <Td>
                          <Checkbox
                            id={`cluster-${cluster.id}`}
                            isChecked={selectedClusters.includes(cluster.id)}
                            onChange={() => {
                              if (selectedClusters.includes(cluster.id)) {
                                setSelectedClusters(selectedClusters.filter(id => id !== cluster.id));
                              } else {
                                setSelectedClusters([...selectedClusters, cluster.id]);
                              }
                            }}
                          />
                        </Td>
                            <Td dataLabel="Name">
                              <div style={{ fontWeight: selectedClusters.includes(cluster.id) ? '600' : 'normal' }}>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.open(`${window.location.origin}${window.location.pathname}#/infrastructure/clusters/${encodeURIComponent(cluster.name)}`, '_blank');
                                  }}
                                  style={{ 
                                    color: 'var(--pf-t--global--color--brand--default)',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                  {cluster.name}
                                </a>
                              </div>
                            </Td>
                            <Td dataLabel="Status">
                          <Label color={cluster.status === 'Ready' ? 'green' : 'red'}>
                            {cluster.status}
                          </Label>
                        </Td>
                            <Td dataLabel="Infrastructure">{cluster.infrastructure}</Td>
                            <Td dataLabel="Kubernetes version">{cluster.kubernetesVersion}</Td>
                            <Td dataLabel="Nodes">{cluster.nodes}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Pagination
                  itemCount={filteredClustersForClusterSets.length}
                  perPage={clustersPerPage}
                  page={clustersPage}
                  onSetPage={(_event, pageNumber) => setClustersPage(pageNumber)}
                  onPerPageSelect={(_event, perPage) => {
                    setClustersPerPage(perPage);
                    setClustersPage(1);
                  }}
                  variant="bottom"
                />
                  </div>
                )}
              </div>
              );
            })()}

            {/* SUB-STEP 3: Choose Cluster-Level Access - separate substep after selecting clusters */}
            {resourceScope === 'cluster-sets' && showProjectSelection && selectedClusters.length > 0 && (() => {
              return (
              <div key="cluster-level-access-selection">
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '12px' }}>
                  Define cluster granularity
                </Title>
                <Content component="p" style={{ marginBottom: '24px', color: '#6a6e73', fontSize: '14px' }}>
                  Define the level of access for the {selectedClusters.length} selected cluster{selectedClusters.length > 1 ? 's' : ''}.
                    </Content>
                
                <FormGroup label="Access level for selected clusters" style={{ marginBottom: '16px' }}>
                  <Dropdown
                    isOpen={isClusterScopeOpen}
                    onSelect={() => setIsClusterScopeOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsClusterScopeOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsClusterScopeOpen(!isClusterScopeOpen)} 
                        isExpanded={isClusterScopeOpen}
                        variant="default"
                        style={{ width: '100%' }}
                      >
                        {clusterScope === 'everything'
                          ? 'Cluster role assignment'
                          : (selectedClusters.length === 1 ? 'Project role assignment' : 'Common projects role assignments')}
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                    popperProps={{
                      appendTo: () => document.body,
                      
                      
                    }}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="everything"
                        onClick={() => {
                          setClusterScope('everything');
                          setSelectedProjects([]);
                          setIsClusterScopeOpen(false);
                        }}
                        description={selectedClusters.length === 1
                          ? 'Grant access to all current and future resources on the cluster.'
                          : 'Grant access to all current and future resources on the clusters'}
                      >
                        Cluster role assignment
                      </DropdownItem>
                      <DropdownItem
                        key="projects"
                        onClick={() => {
                          setClusterScope('projects');
                          setSelectedProjects([]);
                          setIsClusterScopeOpen(false);
                        }}
                        description={selectedClusters.length === 1
                          ? 'Grant access to specific projects on the cluster.'
                          : 'Grant access to projects with the same name across selected clusters'}
                      >
                        {selectedClusters.length === 1 ? 'Project role assignment' : 'Common projects role assignments'}
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FormGroup>

                {/* Show message when cluster role assignment (everything) is selected */}
                {clusterScope === 'everything' && (
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#6a6e73'
                  }}>
                    This role assignment will apply to all current and future resources on the selected {selectedClusters.length === 1 ? 'cluster' : 'clusters'}.
                  </div>
                )}

                {/* Show projects table below if partial access is selected */}
                {clusterScope === 'projects' && (
              <div style={{ marginTop: '24px' }}>
                    <Toolbar>
                  <ToolbarContent>
                    {/* Bulk selector dropdown */}
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isProjectBulkSelectorOpen}
                        onSelect={() => setIsProjectBulkSelectorOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsProjectBulkSelectorOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => {
                              if (selectedProjects.length > 0) {
                                setSelectedProjects([]);
                              } else {
                                setIsProjectBulkSelectorOpen(!isProjectBulkSelectorOpen);
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
                                  isChecked={(() => {
                                    let allVisibleProjectIds: number[] = [];
                                    if (selectedClusters.length === 1) {
                                      const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                      allVisibleProjectIds = [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].map(p => p.id);
                                    } else {
                                      const grouped = [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                        const existing = acc.find(g => g.name === project.name);
                                        if (!existing) {
                                          acc.push({ name: project.name, projects: [project] });
                                        } else {
                                          existing.projects.push(project);
                                        }
                                        return acc;
                                      }, [] as any[]);
                                      allVisibleProjectIds = grouped.flatMap(g => g.projects.map((p: any) => p.id));
                                    }
                                    return allVisibleProjectIds.length > 0 && allVisibleProjectIds.every(id => selectedProjects.includes(id));
                                  })()}
                                  onChange={(event, checked) => {
                                    event.stopPropagation();
                                    let allVisibleProjectIds: number[] = [];
                                    if (selectedClusters.length === 1) {
                                      const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                      allVisibleProjectIds = [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].map(p => p.id);
                                    } else {
                                      const grouped = [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                        const existing = acc.find(g => g.name === project.name);
                                        if (!existing) {
                                          acc.push({ name: project.name, projects: [project] });
                                        } else {
                                          existing.projects.push(project);
                                        }
                                        return acc;
                                      }, [] as any[]);
                                      allVisibleProjectIds = grouped.flatMap(g => g.projects.map((p: any) => p.id));
                                    }
                                    if (checked) {
                                      const combined = [...selectedProjects, ...allVisibleProjectIds];
                                      setSelectedProjects(Array.from(new Set(combined)));
                                    } else {
                                      setSelectedProjects(selectedProjects.filter(id => !allVisibleProjectIds.includes(id)));
                                    }
                                  }}
                                  aria-label="Select all"
                                  id="select-all-projects-checkbox"
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
                          <DropdownItem
                            onClick={() => {
                              let allVisibleProjectIds: number[] = [];
                              if (selectedClusters.length === 1) {
                                const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                allVisibleProjectIds = [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].map(p => p.id);
                              } else {
                                const grouped = [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                  const existing = acc.find(g => g.name === project.name);
                                  if (!existing) {
                                    acc.push({ name: project.name, projects: [project] });
                                  } else {
                                    existing.projects.push(project);
                                  }
                                  return acc;
                                }, [] as any[]);
                                allVisibleProjectIds = grouped.flatMap(g => g.projects.map((p: any) => p.id));
                              }
                              const combined = [...selectedProjects, ...allVisibleProjectIds];
                              setSelectedProjects(Array.from(new Set(combined)));
                              setIsProjectBulkSelectorOpen(false);
                            }}
                          >
                            Select all ({(() => {
                              if (selectedClusters.length === 1) {
                                const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                return [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].length;
                              } else {
                                return [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                  const existing = acc.find(g => g.name === project.name);
                                  if (!existing) {
                                    acc.push({ name: project.name, projects: [project] });
                                  }
                                  return acc;
                                }, [] as any[]).length;
                              }
                            })()} items)
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
                    {selectedClusters.length > 1 && (filteredProjectsForClusters.length > 0 || createdCommonProjects.length > 0) && (
                      <ToolbarItem>
                        <Button 
                          variant="primary"
                          onClick={() => setIsCreatingCommonProject(true)}
                        >
                          Create common project
                        </Button>
                      </ToolbarItem>
                    )}
                  </ToolbarContent>
                </Toolbar>
                
                {/* Form for creating common projects - replaces table when active */}
                {isCreatingCommonProject ? (
                  <div style={{ padding: '16px', backgroundColor: '#f5f5f5', marginBottom: '16px', borderRadius: '4px' }}>
                    <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                      Create common project
                    </Title>
                    <Form style={{ maxWidth: '600px' }}>
                      <FormGroup label="Name" isRequired>
                        <TextInput
                          type="text"
                          value={commonProjectName}
                          onChange={(_event, value) => setCommonProjectName(value)}
                          placeholder="Enter project name"
                        />
                      </FormGroup>
                      
                      <FormGroup label="Display name">
                        <TextInput
                          type="text"
                          value={commonProjectDisplayName}
                          onChange={(_event, value) => setCommonProjectDisplayName(value)}
                          placeholder="Enter display name (optional)"
                        />
                      </FormGroup>
                      
                      <FormGroup label="Description">
                        <TextInput
                          type="text"
                          value={commonProjectDescription}
                          onChange={(_event, value) => setCommonProjectDescription(value)}
                          placeholder="Enter description (optional)"
                        />
                      </FormGroup>
                      
                      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                        <Button 
                          variant="primary"
                          onClick={() => {
                            // Create a project for each selected cluster
                            const newProjects = selectedClusters.map((clusterIndex) => {
                              const cluster = dbClusters[clusterIndex - 1];
                              return {
                                id: Date.now() + Math.random(), // Temporary ID
                                name: commonProjectName,
                                displayName: commonProjectDisplayName || commonProjectName,
                                description: commonProjectDescription,
                                type: 'application' as const,
                                status: 'Active' as const,
                                clusterId: cluster.id,
                                clusterName: cluster.name,
                                created: new Date().toISOString(),
                                labels: {},
                                isPending: true,
                              };
                            });
                            
                            setCreatedCommonProjects([...createdCommonProjects, ...newProjects]);
                            // Auto-select the newly created projects
                            setSelectedProjects(newProjects.map(p => p.id));
                            // Close form and clear fields
                            setIsCreatingCommonProject(false);
                            setCommonProjectName('');
                            setCommonProjectDisplayName('');
                            setCommonProjectDescription('');
                          }}
                          isDisabled={!commonProjectName.trim()}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="link"
                          onClick={() => {
                            setIsCreatingCommonProject(false);
                            setCommonProjectName('');
                            setCommonProjectDisplayName('');
                            setCommonProjectDescription('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </div>
                ) : (
                <Table aria-label="Projects table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th />
                          <Th>Name</Th>
                          {createdCommonProjects.length === 0 && <Th>Type</Th>}
                        <Th>Clusters</Th>
                        {createdCommonProjects.length > 0 && <Th>Actions</Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                        {filteredProjectsForClusters.length === 0 && createdCommonProjects.length === 0 ? (
                          <Tr>
                            <Td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                              <EmptyState>
                                <Title headingLevel="h4" size="lg" style={{ marginBottom: '12px' }}>
                                  {selectedClusters.length > 1 ? "No common projects found" : "No projects available"}
                                </Title>
                                <EmptyStateBody>
                                  {selectedClusters.length > 1 
                                    ? 'Go back and select different clusters, or create projects with the same name on these clusters.'
                                    : 'No projects are available in the selected cluster.'}
                                </EmptyStateBody>
                                {selectedClusters.length > 1 && (
                                  <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => {
                                    setIsCreatingCommonProject(true);
                                  }}>
                                    Create common project
                                  </Button>
                                )}
                              </EmptyState>
                          </Td>
                        </Tr>
                        ) : selectedClusters.length === 1 ? (
                          // Single cluster: Show ALL projects (including created), allow multiple selection
                          (() => {
                            const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                            return [
                              ...filteredProjectsForClusters,
                              ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))
                            ];
                          })().map((project) => (
                        <Tr
                          key={project.id}
                          isSelectable
                          isClickable
                          isRowSelected={selectedProjects.includes(project.id)}
                          onRowClick={() => {
                            if (selectedProjects.includes(project.id)) {
                              setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                            } else {
                              setSelectedProjects([...selectedProjects, project.id]);
                            }
                          }}
                        >
                          <Td>
                            <Checkbox
                              id={`project-${project.id}`}
                              isChecked={selectedProjects.includes(project.id)}
                              onChange={() => {
                                if (selectedProjects.includes(project.id)) {
                                  setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                                } else {
                                  setSelectedProjects([...selectedProjects, project.id]);
                                }
                              }}
                            />
                          </Td>
                              <Td dataLabel="Name">
                                <div style={{ fontWeight: selectedProjects.includes(project.id) ? '600' : 'normal' }}>
                                  {project.displayName || project.name}
                                </div>
                              </Td>
                              {createdCommonProjects.length === 0 && (
                                <Td dataLabel="Type">
                                  <Label color="blue">{project.type}</Label>
                                </Td>
                              )}
                              <Td dataLabel="Clusters">
                                <Label color="grey">{project.clusterName}</Label>
                          </Td>
                          {createdCommonProjects.length > 0 && (
                            <Td isActionCell>
                              {(project as any).isPending ? (
                                <Button
                                  variant="link"
                                  isDanger
                                  aria-label={`Delete ${project.name}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCreatedCommonProjects(
                                      createdCommonProjects.filter(p => p.id !== project.id)
                                    );
                                    setSelectedProjects(
                                      selectedProjects.filter(id => id !== project.id)
                                    );
                                  }}
                                >
                                  <TrashIcon /> Delete
                                </Button>
                              ) : null}
                            </Td>
                          )}
                        </Tr>
                        ))
                    ) : (
                          // Multiple clusters: Show COMMON projects grouped by name, allow multiple selection
                      (() => {
                            // Group projects by name to show as common (including created common projects)
                            const commonProjects = new Map<string, typeof filteredProjectsForClusters>();
                            const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                            
                            // Add existing projects from database
                            filteredProjectsForClusters.forEach(project => {
                              if (!commonProjects.has(project.name)) {
                                commonProjects.set(project.name, []);
                              }
                              commonProjects.get(project.name)?.push(project);
                            });
                            
                            // Add created common projects
                            createdCommonProjects
                              .filter(project => selectedClusterIds.includes(project.clusterId))
                              .forEach(project => {
                                if (!commonProjects.has(project.name)) {
                                  commonProjects.set(project.name, []);
                                }
                                commonProjects.get(project.name)?.push(project);
                              });
                            
                            return Array.from(commonProjects.entries()).map(([name, projects]) => {
                              const projectIds = projects.map(p => p.id);
                              const isSelected = projectIds.every(id => selectedProjects.includes(id));
                          
                              return (
                                <Tr
                                  key={name}
                                  isSelectable
                                  isClickable
                                  isRowSelected={isSelected}
                                  onRowClick={() => {
                                    if (isSelected) {
                                      setSelectedProjects(selectedProjects.filter(id => !projectIds.includes(id)));
                                    } else {
                                      setSelectedProjects([...selectedProjects, ...projectIds]);
                                    }
                                  }}
                                >
                                  <Td>
                                    <Checkbox
                                      id={`project-${name}`}
                                      isChecked={isSelected}
                                      onChange={() => {
                                        if (isSelected) {
                                          setSelectedProjects(selectedProjects.filter(id => !projectIds.includes(id)));
                                        } else {
                                          setSelectedProjects([...selectedProjects, ...projectIds]);
                                        }
                                      }}
                                    />
                                  </Td>
                                  <Td dataLabel="Name">
                                    <div style={{ fontWeight: isSelected ? '600' : 'normal' }}>
                                      {name}
                                    </div>
                                  </Td>
                                  {createdCommonProjects.length === 0 && (
                                    <Td dataLabel="Type">
                                      <Label color="blue">{projects[0].type}</Label>
                                    </Td>
                                  )}
                                  <Td dataLabel="Clusters">
                                    {projects.map((p, idx) => (
                                      <Label key={idx} color="grey" style={{ marginRight: '4px' }}>
                                        {p.clusterName}
                                      </Label>
                                    ))}
                                  </Td>
                                  {createdCommonProjects.length > 0 && (
                                    <Td isActionCell>
                                      {projects.some((p: any) => p.isPending) ? (
                                        <Button
                                          variant="link"
                                          isDanger
                                          aria-label={`Delete ${name}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const projectIdsToRemove = projects.map(p => p.id);
                                            setCreatedCommonProjects(
                                              createdCommonProjects.filter(p => !projectIdsToRemove.includes(p.id))
                                            );
                                            setSelectedProjects(
                                              selectedProjects.filter(id => !projectIdsToRemove.includes(id))
                                            );
                                          }}
                                        >
                                          <TrashIcon /> Delete
                                        </Button>
                                      ) : null}
                                    </Td>
                                  )}
                                </Tr>
                              );
                            });
                          })()
                        )}
                      </Tbody>
                    </Table>
                    )}
                  </div>
                )}
              </div>
              );
            })()}


            {/* SUB-STEP: Choose Access Level after selecting clusters (for 'clusters' path only) */}
            {resourceScope === 'clusters' && showScopeSelection && !showProjectSelection && (() => {
                          return (
              <div key="clusters-access-level-selection">
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '12px' }}>
                  Choose access level
                </Title>
                <Content component="p" style={{ marginBottom: '16px', fontSize: '14px', color: '#6a6e73' }}>
                  Define the level of access for the {selectedClusters.length} selected cluster{selectedClusters.length > 1 ? 's' : ''}.
                                </Content>
                
                <FormGroup label="Access level" style={{ marginBottom: '16px' }}>
                  <Dropdown
                    isOpen={isClusterScopeOpen}
                    onSelect={() => setIsClusterScopeOpen(false)}
                    onOpenChange={(isOpen: boolean) => setIsClusterScopeOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsClusterScopeOpen(!isClusterScopeOpen)} 
                        isExpanded={isClusterScopeOpen}
                        variant="default"
                        style={{ width: '100%' }}
                      >
                        {clusterScope === 'everything'
                          ? 'Cluster role assignment'
                          : (selectedClusters.length === 1 ? 'Project role assignment' : 'Common projects role assignments')}
                      </MenuToggle>
                    )}
                    shouldFocusToggleOnSelect
                    popperProps={{
                      appendTo: () => document.body,
                      
                      
                    }}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="everything"
                        onClick={() => {
                          setClusterScope('everything');
                          setSelectedProjects([]);
                          setShowProjectSelection(false);
                          setIsClusterScopeOpen(false);
                        }}
                        description={selectedClusters.length === 1
                          ? 'Grant access to all current and future resources on the cluster.'
                          : 'Grant access to all current and future resources on the clusters'}
                      >
                        Cluster role assignment
                      </DropdownItem>
                      <DropdownItem
                        key="projects"
                        onClick={() => {
                          setClusterScope('projects');
                          setSelectedProjects([]);
                          setIsClusterScopeOpen(false);
                        }}
                        description={selectedClusters.length === 1
                          ? 'Grant access to specific projects on the cluster.'
                          : 'Grant access to projects with the same name across selected clusters'}
                      >
                        {selectedClusters.length === 1 ? 'Project role assignment' : 'Common projects role assignments'}
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </FormGroup>

                {/* Message for cluster role assignment */}
                {clusterScope === 'everything' && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#6a6e73'
                  }}>
                    This role assignment will apply to all current and future resources on the selected {selectedClusters.length === 1 ? 'cluster' : 'clusters'}.
                  </div>
                )}

              {/* Projects table shown inline if partial access is selected */}
              {clusterScope === 'projects' && (
              <div style={{ marginTop: '24px' }}>
                    <Toolbar>
                  <ToolbarContent>
                    {/* Bulk selector dropdown */}
                    <ToolbarItem>
                      <Dropdown
                        isOpen={isProjectBulkSelectorOpen}
                        onSelect={() => setIsProjectBulkSelectorOpen(false)}
                        onOpenChange={(isOpen: boolean) => setIsProjectBulkSelectorOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => {
                              if (selectedProjects.length > 0) {
                                setSelectedProjects([]);
                              } else {
                                setIsProjectBulkSelectorOpen(!isProjectBulkSelectorOpen);
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
                                  isChecked={(() => {
                                    let allVisibleProjectIds: number[] = [];
                                    if (selectedClusters.length === 1) {
                                      const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                      allVisibleProjectIds = [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].map(p => p.id);
                                    } else {
                                      const grouped = [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                        const existing = acc.find(g => g.name === project.name);
                                        if (!existing) {
                                          acc.push({ name: project.name, projects: [project] });
                                        } else {
                                          existing.projects.push(project);
                                        }
                                        return acc;
                                      }, [] as any[]);
                                      allVisibleProjectIds = grouped.flatMap(g => g.projects.map((p: any) => p.id));
                                    }
                                    return allVisibleProjectIds.length > 0 && allVisibleProjectIds.every(id => selectedProjects.includes(id));
                                  })()}
                                  onChange={(event, checked) => {
                                    event.stopPropagation();
                                    let allVisibleProjectIds: number[] = [];
                                    if (selectedClusters.length === 1) {
                                      const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                      allVisibleProjectIds = [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].map(p => p.id);
                                    } else {
                                      const grouped = [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                        const existing = acc.find(g => g.name === project.name);
                                        if (!existing) {
                                          acc.push({ name: project.name, projects: [project] });
                                        } else {
                                          existing.projects.push(project);
                                        }
                                        return acc;
                                      }, [] as any[]);
                                      allVisibleProjectIds = grouped.flatMap(g => g.projects.map((p: any) => p.id));
                                    }
                                    if (checked) {
                                      const combined = [...selectedProjects, ...allVisibleProjectIds];
                                      setSelectedProjects(Array.from(new Set(combined)));
                                    } else {
                                      setSelectedProjects(selectedProjects.filter(id => !allVisibleProjectIds.includes(id)));
                                    }
                                  }}
                                  aria-label="Select all"
                                  id="select-all-projects-checkbox"
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
                          <DropdownItem
                            onClick={() => {
                              setSelectedProjects([]);
                              setIsProjectBulkSelectorOpen(false);
                            }}
                          >
                            Select none
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              let allVisibleProjectIds: number[] = [];
                              if (selectedClusters.length === 1) {
                                const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                allVisibleProjectIds = [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].map(p => p.id);
                              } else {
                                const grouped = [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                  const existing = acc.find(g => g.name === project.name);
                                  if (!existing) {
                                    acc.push({ name: project.name, projects: [project] });
                                  }
                                  return acc;
                                }, [] as any[]);
                                allVisibleProjectIds = grouped.flatMap(g => g.projects.map((p: any) => p.id));
                              }
                              const combined = [...selectedProjects, ...allVisibleProjectIds];
                              setSelectedProjects(Array.from(new Set(combined)));
                              setIsProjectBulkSelectorOpen(false);
                            }}
                          >
                            Select page ({(() => {
                              if (selectedClusters.length === 1) {
                                const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                return [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].length;
                              } else {
                                return [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                  const existing = acc.find(g => g.name === project.name);
                                  if (!existing) {
                                    acc.push({ name: project.name, projects: [project] });
                                  }
                                  return acc;
                                }, [] as any[]).length;
                              }
                            })()} items)
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              let allVisibleProjectIds: number[] = [];
                              if (selectedClusters.length === 1) {
                                const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                allVisibleProjectIds = [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].map(p => p.id);
                              } else {
                                const grouped = [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                  const existing = acc.find(g => g.name === project.name);
                                  if (!existing) {
                                    acc.push({ name: project.name, projects: [project] });
                                  }
                                  return acc;
                                }, [] as any[]);
                                allVisibleProjectIds = grouped.flatMap(g => g.projects.map((p: any) => p.id));
                              }
                              const combined = [...selectedProjects, ...allVisibleProjectIds];
                              setSelectedProjects(Array.from(new Set(combined)));
                              setIsProjectBulkSelectorOpen(false);
                            }}
                          >
                            Select all ({(() => {
                              if (selectedClusters.length === 1) {
                                const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                                return [...filteredProjectsForClusters, ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))].length;
                              } else {
                                return [...filteredProjectsForClusters, ...createdCommonProjects].reduce((acc, project) => {
                                  const existing = acc.find(g => g.name === project.name);
                                  if (!existing) {
                                    acc.push({ name: project.name, projects: [project] });
                                  }
                                  return acc;
                                }, [] as any[]).length;
                              }
                            })()} items)
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
                    {selectedClusters.length > 1 && (filteredProjectsForClusters.length > 0 || createdCommonProjects.length > 0) && (
                      <ToolbarItem>
                        <Button 
                          variant="primary"
                          onClick={() => setIsCreatingCommonProject(true)}
                        >
                          Create common project
                        </Button>
                      </ToolbarItem>
                    )}
                  </ToolbarContent>
                </Toolbar>
                
                {/* Form for creating common projects - replaces table when active */}
                {isCreatingCommonProject ? (
                  <div style={{ padding: '16px', backgroundColor: '#f5f5f5', marginBottom: '16px', borderRadius: '4px' }}>
                    <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                      Create common project
                    </Title>
                    <Form style={{ maxWidth: '600px' }}>
                      <FormGroup label="Name" isRequired>
                        <TextInput
                          type="text"
                          value={commonProjectName}
                          onChange={(_event, value) => setCommonProjectName(value)}
                          placeholder="Enter project name"
                        />
                      </FormGroup>
                      
                      <FormGroup label="Display name">
                        <TextInput
                          type="text"
                          value={commonProjectDisplayName}
                          onChange={(_event, value) => setCommonProjectDisplayName(value)}
                          placeholder="Enter display name (optional)"
                        />
                      </FormGroup>
                      
                      <FormGroup label="Description">
                        <TextInput
                          type="text"
                          value={commonProjectDescription}
                          onChange={(_event, value) => setCommonProjectDescription(value)}
                          placeholder="Enter description (optional)"
                        />
                      </FormGroup>

                      <div style={{ marginTop: 'var(--pf-t--global--spacer--md)', display: 'flex', gap: 'var(--pf-t--global--spacer--sm)' }}>
                        <Button 
                          variant="primary"
                          onClick={() => {
                            // Create temporary project entries for each selected cluster
                            const newProjects = selectedClusters.map((clusterIndex) => {
                              const cluster = dbClusters[clusterIndex - 1]; // Convert 1-based index to 0-based
                              const tempId = -(Date.now() + Math.random()); // Negative ID to distinguish from real projects
                              
                              return {
                                id: tempId,
                                dbId: `temp-${Date.now()}-${cluster?.id}`,
                                name: commonProjectName,
                                displayName: commonProjectDisplayName,
                                description: commonProjectDescription,
                                clusterId: cluster?.id || '',
                                clusterName: cluster?.name || 'Unknown',
                                type: 'application', // Default type
                                labels: {},
                                isPending: true,
                              };
                            });
                            
                            setCreatedCommonProjects([...createdCommonProjects, ...newProjects]);
                            // Auto-select the newly created projects
                            setSelectedProjects(newProjects.map(p => p.id));
                            // Close form and clear fields
                            setIsCreatingCommonProject(false);
                            setCommonProjectName('');
                            setCommonProjectDisplayName('');
                            setCommonProjectDescription('');
                          }}
                          isDisabled={!commonProjectName.trim()}
                        >
                          Save
                        </Button>
                        <Button 
                          variant="link"
                          onClick={() => {
                            setIsCreatingCommonProject(false);
                            setCommonProjectName('');
                            setCommonProjectDisplayName('');
                            setCommonProjectDescription('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </div>
                ) : (
                <Table aria-label="Projects table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th />
                      <Th>Name</Th>
                      {createdCommonProjects.length === 0 && <Th>Type</Th>}
                      <Th>Clusters</Th>
                      {createdCommonProjects.length > 0 && <Th>Actions</Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                        {filteredProjectsForClusters.length === 0 && createdCommonProjects.length === 0 ? (
                          <Tr>
                            <Td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                              <EmptyState>
                                <Title headingLevel="h4" size="lg" style={{ marginBottom: '12px' }}>
                                  {selectedClusters.length > 1 ? "No common projects found" : "No projects available"}
                                </Title>
                                <EmptyStateBody>
                                  {selectedClusters.length > 1 
                                    ? 'Go back and select different clusters, or create projects with the same name on these clusters.'
                                    : 'No projects are available in the selected cluster.'}
                                </EmptyStateBody>
                                {selectedClusters.length > 1 && (
                                  <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => {
                                    setIsCreatingCommonProject(true);
                                  }}>
                                    Create common project
                                  </Button>
                                )}
                              </EmptyState>
                              </Td>
                            </Tr>
                        ) : filteredProjectsForClusters.length === 0 && createdCommonProjects.length > 0 ? (
                          // Show only created common projects
                          (() => {
                            // Convert selected cluster indices to actual cluster IDs
                            const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                            return createdCommonProjects
                              .filter(project => selectedClusterIds.includes(project.clusterId))
                          })()
                            
                            .reduce((acc, project) => {
                              const existing = acc.find(p => p.name === project.name);
                              if (!existing) {
                                acc.push({
                                  name: project.name,
                                  type: project.type,
                                  projects: [project]
                                });
                              } else {
                                existing.projects.push(project);
                              }
                              return acc;
                            }, [] as any[])
                            .map((commonProject) => {
                              const projectIds = commonProject.projects.map((p: any) => p.id);
                              const isSelected = projectIds.every((id: number) => selectedProjects.includes(id));
                              
                              return (
                                <Tr
                                  key={commonProject.name}
                                  isSelectable
                                  isClickable
                                  isRowSelected={isSelected}
                                  onRowClick={() => {
                                    if (isSelected) {
                                      setSelectedProjects(selectedProjects.filter(id => !projectIds.includes(id)));
                                    } else {
                                      setSelectedProjects([...selectedProjects, ...projectIds]);
                                    }
                                  }}
                                >
                                  <Td>
                                    <Checkbox
                                      id={`project-${commonProject.name}`}
                                      isChecked={isSelected}
                                      onChange={() => {
                                        if (isSelected) {
                                          setSelectedProjects(selectedProjects.filter(id => !projectIds.includes(id)));
                                        } else {
                                          setSelectedProjects([...selectedProjects, ...projectIds]);
                                        }
                                      }}
                                    />
                                  </Td>
                                  <Td dataLabel="Name">
                                    <div style={{ fontWeight: isSelected ? '600' : 'normal' }}>
                                      {commonProject.name}
                                    </div>
                                  </Td>
                                  <Td dataLabel="Clusters">
                                    {commonProject.projects.map((p: any, idx: number) => (
                                      <Label key={idx} color="grey" style={{ marginRight: '4px' }}>
                                        {p.clusterName}
                                      </Label>
                                    ))}
                                  </Td>
                                  <Td isActionCell>
                                    <Button
                                      variant="link"
                                      isDanger
                                      aria-label={`Delete ${commonProject.name}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Remove these projects from created list
                                        const projectIdsToRemove = commonProject.projects.map((p: any) => p.id);
                                        setCreatedCommonProjects(
                                          createdCommonProjects.filter(p => !projectIdsToRemove.includes(p.id))
                                        );
                                        // Also remove from selection if selected
                                        setSelectedProjects(
                                          selectedProjects.filter(id => !projectIdsToRemove.includes(id))
                                        );
                                      }}
                                    >
                                      <TrashIcon /> Delete
                                    </Button>
                                  </Td>
                                </Tr>
                              );
                            })
                        ) : selectedClusters.length === 1 ? (
                          // Single cluster: Show ALL projects (including created), allow multiple selection
                          (() => {
                            const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                            return [
                              ...filteredProjectsForClusters,
                              ...createdCommonProjects.filter(p => selectedClusterIds.includes(p.clusterId))
                            ];
                          })().map((project) => (
                        <Tr
                          key={project.id}
                          isSelectable
                          isClickable
                          isRowSelected={selectedProjects.includes(project.id)}
                          onRowClick={() => {
                            if (selectedProjects.includes(project.id)) {
                              setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                            } else {
                              setSelectedProjects([...selectedProjects, project.id]);
                            }
                          }}
                        >
                          <Td>
                            <Checkbox
                              id={`project-${project.id}`}
                              isChecked={selectedProjects.includes(project.id)}
                              onChange={() => {
                                if (selectedProjects.includes(project.id)) {
                                  setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                                } else {
                                  setSelectedProjects([...selectedProjects, project.id]);
                                }
                              }}
                            />
                          </Td>
                              <Td dataLabel="Name">
                                <div style={{ fontWeight: selectedProjects.includes(project.id) ? '600' : 'normal' }}>
                                  {project.name}
                                </div>
                              </Td>
                              {createdCommonProjects.length === 0 && (
                                <Td dataLabel="Type">
                                  <Label color="blue">{project.type}</Label>
                                </Td>
                              )}
                              <Td dataLabel="Clusters">
                                <Label color="grey">{project.clusterName}</Label>
                          </Td>
                          {createdCommonProjects.length > 0 && (
                            <Td isActionCell>
                              {(project as any).isPending && (
                                <Button
                                  variant="link"
                                  isDanger
                                  aria-label={`Delete ${project.name}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCreatedCommonProjects(createdCommonProjects.filter(p => p.id !== project.id));
                                    setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                                  }}
                                >
                                  <TrashIcon /> Delete
                                </Button>
                              )}
                            </Td>
                          )}
                        </Tr>
                        ))
                    ) : (
                          // Multiple clusters: Show COMMON projects, allow multiple selection
                      (() => {
                            // Group projects by name to show as common (including created common projects)
                            const commonProjects = new Map<string, typeof filteredProjectsForClusters>();
                            const selectedClusterIds = selectedClusters.map(idx => dbClusters[idx - 1]?.id).filter(Boolean);
                            
                            // Add existing projects from database
                            filteredProjectsForClusters.forEach(project => {
                              if (!commonProjects.has(project.name)) {
                                commonProjects.set(project.name, []);
                              }
                              commonProjects.get(project.name)?.push(project);
                            });
                            
                            // Add created common projects
                            createdCommonProjects
                              .filter(project => selectedClusterIds.includes(project.clusterId))
                              .forEach(project => {
                                if (!commonProjects.has(project.name)) {
                                  commonProjects.set(project.name, []);
                                }
                                commonProjects.get(project.name)?.push(project);
                              });
                            
                            return Array.from(commonProjects.entries()).map(([name, projects]) => {
                              const projectIds = projects.map(p => p.id);
                              const isSelected = projectIds.every(id => selectedProjects.includes(id));
                          
                          return (
                            <Tr
                                  key={name}
                              isSelectable
                              isClickable
                              isRowSelected={isSelected}
                              onRowClick={() => {
                                if (isSelected) {
                                  setSelectedProjects(selectedProjects.filter(id => !projectIds.includes(id)));
                                } else {
                                  setSelectedProjects([...selectedProjects, ...projectIds]);
                                }
                              }}
                            >
                              <Td>
                                    <Checkbox
                                      id={`project-${name}`}
                                  isChecked={isSelected}
                                  onChange={() => {
                                    if (isSelected) {
                                      setSelectedProjects(selectedProjects.filter(id => !projectIds.includes(id)));
                                    } else {
                                      setSelectedProjects([...selectedProjects, ...projectIds]);
                                    }
                                  }}
                                />
                              </Td>
                                  <Td dataLabel="Name">
                                    <div style={{ fontWeight: isSelected ? '600' : 'normal' }}>
                                      {name}
                                    </div>
                                  </Td>
                                  {createdCommonProjects.length === 0 && (
                                    <Td dataLabel="Type">
                                      <Label color="blue">{projects[0].type}</Label>
                                    </Td>
                                  )}
                                  <Td dataLabel="Clusters">
                                    {projects.map((p, idx) => (
                                      <Label key={idx} color="grey" style={{ marginRight: '4px' }}>
                                        {p.clusterName}
                                  </Label>
                                ))}
                              </Td>
                              {createdCommonProjects.length > 0 && (
                                <Td isActionCell>
                                  {projects.some((p: any) => p.isPending) ? (
                                    <Button
                                      variant="link"
                                      isDanger
                                      aria-label={`Delete ${name}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Remove all projects with this name from created list
                                        const projectIdsToRemove = projects
                                          .filter((p: any) => p.isPending)
                                          .map((p: any) => p.id);
                                        setCreatedCommonProjects(
                                          createdCommonProjects.filter(p => !projectIdsToRemove.includes(p.id))
                                        );
                                        // Also remove from selection if selected
                                        setSelectedProjects(
                                          selectedProjects.filter(id => !projectIdsToRemove.includes(id))
                                        );
                                      }}
                                    >
                                      <TrashIcon /> Delete
                                    </Button>
                                  ) : null}
                                </Td>
                              )}
                            </Tr>
                          );
                        });
                      })()
                    )}
                  </Tbody>
                </Table>
                )}
              </div>
            )}
              </div>
              );
            })()}
          </>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '24px' }}>
              Review
            </Title>
            
            {/* User or Group section */}
            <div style={{ 
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #d2d2d2'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title headingLevel="h3" size="md" style={{ margin: 0 }}>
                  {isPreauthorizing ? 'Pre-auth user' : (identityType === 'user' ? 'User' : 'Group')}
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
                  <Content component="p" style={{ 
                    marginBottom: '4px', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: '#151515'
                  }}>
                    {identityType === 'user' 
                      ? mockUsers.find(u => u.id === selectedUser)?.name || 'Unknown User'
                      : mockGroups.find(g => g.id === selectedGroup)?.name || 'Unknown Group'
                    }
                  </Content>
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
                {resourceScope === 'everything' && (
                  <>
                    <Content component="p" style={{ 
                      marginBottom: '4px', 
                      fontSize: '14px', 
                      fontWeight: 600,
                      color: '#151515'
                    }}>
                      Scope
                    </Content>
                    <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                      Global / Applies to all resources registered in ACM
                    </Content>
                  </>
                )}
                
                {resourceScope === 'cluster-sets' && (
                  <>
                    {selectedClusterSets.length > 0 && (
                      <>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          Cluster sets
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '12px' }}>
                          {selectedClusterSets.map(id => mockClusterSets.find(cs => cs.id === id)?.name).filter(Boolean).join(', ')}
                        </Content>
                      </>
                    )}
                    
                    {selectedClusters.length > 0 && (
                      <>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          Clusters
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '12px' }}>
                          {selectedClusters.map(id => mockClusters.find(c => c.id === id)?.name).filter(Boolean).join(', ')}
                        </Content>
                      </>
                    )}
                    
                    {selectedClusters.length > 0 && (
                      <>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          Projects
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                          {clusterScope === 'everything' ? 'Full access' : 
                            selectedProjects.length > 0 
                              ? selectedProjects.map(id => {
                                  const project = mockProjects.find(p => p.id === id);
                                  const createdProject = createdCommonProjects.find(p => p.id === id);
                                  return project?.name || createdProject?.name;
                                }).filter(Boolean).join(', ')
                              : 'None selected'
                          }
                        </Content>
                      </>
                    )}
                    
                    {selectedClusters.length === 0 && selectedClusterSets.length > 0 && (
                      <>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          Access level
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                          Cluster set role assignment
                        </Content>
                      </>
                    )}
                  </>
                )}
                
                {resourceScope === 'clusters' && (
                  <>
                    {selectedClusters.length > 0 && (
                      <>
                        <Content component="p" style={{ 
                          marginBottom: '4px', 
                          fontSize: '14px', 
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          Clusters
                        </Content>
                        <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '12px' }}>
                          {selectedClusters.map(id => mockClusters.find(c => c.id === id)?.name).filter(Boolean).join(', ')}
                        </Content>
                      </>
                    )}
                    
                    <Content component="p" style={{ 
                      marginBottom: '4px', 
                      fontSize: '14px', 
                      fontWeight: 600,
                      color: '#151515'
                    }}>
                      Projects
                    </Content>
                    <Content component="p" style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '8px' }}>
                      {clusterScope === 'everything' ? 'Full access' : 
                        selectedProjects.length > 0 
                          ? selectedProjects.map(id => {
                              const project = mockProjects.find(p => p.id === id);
                              const createdProject = createdCommonProjects.find(p => p.id === id);
                              return project?.name || createdProject?.name;
                            }).filter(Boolean).join(', ')
                          : 'None selected'
                      }
                    </Content>
                  </>
                )}
              </div>
            </div>

            {/* Role section */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <Title headingLevel="h3" size="md" style={{ margin: 0 }}>
                  Role
                </Title>
              </div>
              <div style={{ marginLeft: '16px' }}>
                <Content component="p" style={{ fontSize: '14px', color: '#151515', fontWeight: 600 }}>
                  {roleName}
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
              {(currentStep > 1 || showScopeSelection || showProjectSelection) && (
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              )}{' '}
              {currentStep < 3 ? (
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
      </div>
    </Modal>
  );
};
