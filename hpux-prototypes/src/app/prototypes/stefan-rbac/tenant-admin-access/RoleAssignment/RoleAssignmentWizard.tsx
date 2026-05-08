import * as React from 'react';
import {
  Button,
  Checkbox,
  Content,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Label,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  Pagination,
  PaginationVariant,
  Radio,
  SearchInput,
  Tabs,
  Tab,
  TabTitleText,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { CaretDownIcon, FilterIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { getAllUsers, getAllGroups, getAllClusters, getAllClusterSets, getAllNamespaces, getAllRoles } from '@app/data';

interface RoleAssignmentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (wizardData: {
    identityType: 'user' | 'group';
    identityId: number | null;
    identityName: string;
    roleId: number | null;
    roleName: string;
    resourceSummary: string;
    selectedClusters?: number[];
    selectedProjects?: number[];
    selectedClusterSets?: number[];
  }) => void;
  clusterName?: string;
  clusterSetName?: string;
  context?: 'clusters' | 'identities' | 'roles' | 'projects';
  preselectedIdentity?: {
    type: 'user' | 'group';
    id: number;
    name: string;
  };
  preselectedRole?: {
    id: number;
    name: string;
    type: string;
  };
}

// Get data from centralized database (static, non-contextual)
const dbUsers = getAllUsers();
const dbGroups = getAllGroups();
// Tenant Admin Access: Only show project-scoped roles (exclude cluster-set roles which are fleet admin only)
const dbRoles = getAllRoles().filter(role => role.category !== 'open-cluster-management');

// Transform static data for wizard format (preserve database IDs as numbers)
const mockUsers = dbUsers.map((user, index) => ({
  id: index + 1,
  dbId: user.id, // Preserve original database ID for lookup
  name: `${user.firstName} ${user.lastName}`,
  username: user.username,
  provider: 'LDAP',
}));

const mockGroups = dbGroups.map((group, index) => ({
  id: index + 1,
  dbId: group.id, // Preserve original database ID for lookup
  name: group.name,
  users: group.userIds.length,
}));

const mockRoles = dbRoles.map((role, index) => ({
  id: index + 1,
  dbId: role.id, // Preserve original database ID for lookup
  name: role.name,
  type: role.type,
  description: role.description,
}));

const RoleAssignmentWizard: React.FunctionComponent<RoleAssignmentWizardProps> = ({ 
  isOpen, 
  onClose,
  onComplete,
  clusterName,
  clusterSetName,
  context = 'clusters',
  preselectedIdentity,
  preselectedRole 
}) => {
  // Get contextual data from database
  const dbClusters = getAllClusters();
  // Tenant Admin Access: Only show these 5 specific cluster sets
  const TENANT_ADMIN_CLUSTER_SETS = [
    'petemobile-na-prod',
    'petemobile-eu-prod',
    'petemobile-sa-prod',
    'petemobile-apac-prod',
    'petemobile-dev-clusters',
  ];
  const dbClusterSets = getAllClusterSets().filter(cs => TENANT_ADMIN_CLUSTER_SETS.includes(cs.name));
  const dbNamespaces = getAllNamespaces();
  
  // Find current cluster or cluster set from context
  const currentCluster = clusterName ? dbClusters.find(c => c.name === clusterName) : undefined;
  const currentClusterSet = clusterSetName ? dbClusterSets.find(cs => cs.name === clusterSetName) : undefined;
  
  // Filter clusters based on cluster set context
  const contextFilteredClusters = React.useMemo(() => {
    if (currentClusterSet) {
      // If in a cluster set, only show clusters from that set
      return dbClusters.filter(cluster => currentClusterSet.clusterIds.includes(cluster.id));
    }
    // Otherwise show all clusters
    return dbClusters;
  }, [currentClusterSet, dbClusters]);
  
  const mockClusters = contextFilteredClusters.map((cluster, index) => ({
    id: index + 1,
    name: cluster.name,
    infrastructure: 'Amazon Web Services', // Placeholder - could extend schema
    controlPlane: 'Standalone',
    distribution: `Kubernetes ${cluster.kubernetesVersion}`,
    labels: ['12 labels'], // Placeholder
    dbId: cluster.id, // Keep track of database ID for filtering namespaces
    clusterSetId: cluster.clusterSetId,
    status: cluster.status,
  }));

  const mockClusterSets = dbClusterSets.map((clusterSet, index) => ({
    id: index + 1,
    name: clusterSet.name,
    clusters: clusterSet.clusterIds.length,
    dbId: clusterSet.id, // Keep track of database ID
  }));

  const mockProjects = dbNamespaces.map((namespace, index) => ({
    id: index + 1,
    name: namespace.name,
    displayName: namespace.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    type: namespace.type,
    status: 'Active' as 'Active' | 'Terminating' | 'Failed',
    requester: index % 3 === 0 ? 'Walter Joseph Kovacs' : index % 3 === 1 ? 'Adrian Veidt' : 'Daniel Dreiberg',
    cluster: dbClusters.find(c => c.id === namespace.clusterId)?.name || 'Unknown',
    dbClusterId: namespace.clusterId, // Keep track of cluster ID for filtering
  }));

  // Determine initial step based on context
  const getInitialStep = () => {
    if (context === 'identities') return 1; // For identities, step 1 is "Select resources"
    if (context === 'roles') return 1; // Start with user/group selection
    if (context === 'projects') return 1; // For projects, start with user/group selection
    return 1; // Default for clusters - start with user/group selection
  };

  const [currentStep, setCurrentStep] = React.useState(getInitialStep());
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  
  // Step 1: Select user or group
  const [selectedIdentityType, setSelectedIdentityType] = React.useState<'user' | 'group'>(
    preselectedIdentity?.type || 'user'
  );
  const [selectedUser, setSelectedUser] = React.useState<number | null>(
    preselectedIdentity?.type === 'user' ? preselectedIdentity.id : null
  );
  const [selectedGroup, setSelectedGroup] = React.useState<number | null>(
    preselectedIdentity?.type === 'group' ? preselectedIdentity.id : null
  );
  const [userSearchValue, setUserSearchValue] = React.useState('');
  const [isUserFilterOpen, setIsUserFilterOpen] = React.useState(false);
  const [userFilterType, setUserFilterType] = React.useState('User');
  const [usersPage, setUsersPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(10);
  const [groupsPage, setGroupsPage] = React.useState(1);
  const [groupsPerPage, setGroupsPerPage] = React.useState(10);
  
  
  // Step 2: Select resources
  const [resourceScope, setResourceScope] = React.useState<'all' | 'specific'>('specific');
  // Option B: Hierarchical dropdown states
  const [clusterSetScope, setClusterSetScope] = React.useState<'all' | 'specific'>('all');
  const [clusterScope, setClusterScope] = React.useState<'everything' | 'narrow-down'>('everything');
  // In single cluster context (when clusterName is provided), skip cluster selection
  // In multi-cluster context (cluster set or no specific cluster), start with initial selection screen
  // For identities and roles context, always start with no substeps visible (show main selection first)
  // For clusters context, also start with initial selection screen (Apply to all / Assign specific)
  const [showSpecifyClusters, setShowSpecifyClusters] = React.useState(false);
  const [showIncludeProjects, setShowIncludeProjects] = React.useState(false);
  const [showSpecifyProjects, setShowSpecifyProjects] = React.useState(false);
  const [selectedClusters, setSelectedClusters] = React.useState<number[]>([]);
  const [clusterSearchValue, setClusterSearchValue] = React.useState('');
  const [isClusterFilterOpen, setIsClusterFilterOpen] = React.useState(false);
  const [clusterViewMode, setClusterViewMode] = React.useState<'all' | 'selected'>('all');
  const [projectScope, setProjectScope] = React.useState<'cluster' | 'project'>('cluster');
  const [selectedProjects, setSelectedProjects] = React.useState<number[]>([]);
  const [selectedCommonProject, setSelectedCommonProject] = React.useState<number | null>(null);
  const [projectSearchValue, setProjectSearchValue] = React.useState('');
  const [isProjectFilterOpen, setIsProjectFilterOpen] = React.useState(false);
  const [projectViewMode, setProjectViewMode] = React.useState<'all' | 'selected'>('all');
  
  // Track which substeps have been visited (to keep them visible after step 2)
  // In single cluster context, cluster selection is never visited
  // For identities and roles context, start with nothing visited (they use cluster sets flow)
  const [hasVisitedSpecifyClusters, setHasVisitedSpecifyClusters] = React.useState((context === 'identities' || context === 'roles') ? false : !clusterName);
  const [hasVisitedIncludeProjects, setHasVisitedIncludeProjects] = React.useState(false);
  const [hasVisitedSpecifyProjects, setHasVisitedSpecifyProjects] = React.useState(false);
  
  // For Identities and Roles context - cluster sets selection
  // Both identities and roles start with false to show initial "Apply to all" / "Assign specific" selection
  const [showSpecifyClusterSets, setShowSpecifyClusterSets] = React.useState(false);
  const [selectedClusterSets, setSelectedClusterSets] = React.useState<number[]>([]);
  const [clusterSetSearchValue, setClusterSetSearchValue] = React.useState('');
  const [hasVisitedSpecifyClusterSets, setHasVisitedSpecifyClusterSets] = React.useState(false);
  const [showIncludeClusters, setShowIncludeClusters] = React.useState(false);
  const [hasVisitedIncludeClusters, setHasVisitedIncludeClusters] = React.useState(false);
  
  // Step 3: Select role
  const [selectedRole, setSelectedRole] = React.useState<number | null>(
    preselectedRole?.id || null
  );
  const [roleSearchValue, setRoleSearchValue] = React.useState('');
  const [isRoleFilterOpen, setIsRoleFilterOpen] = React.useState(false);

  const resetWizard = () => {
    setCurrentStep(getInitialStep());
    setActiveTabKey(0);
    setSelectedIdentityType('user');
    // Reset substep visibility based on context
    // All contexts now start with initial selection screen (Apply to all / Assign specific)
    setShowSpecifyClusters(false);
    setShowIncludeProjects(false);
    setShowSpecifyProjects(false);
    // Reset identities and roles-specific state
    setShowSpecifyClusterSets(false);
    setShowIncludeClusters(false);
    setSelectedClusterSets([]);
    setResourceScope('specific');
    setClusterSetScope('all'); // Option B
    setClusterScope('everything'); // Option B
    setProjectScope('cluster');
    // Reset hasVisited flags to ensure clean state on next wizard open
    setHasVisitedSpecifyClusters(false);
    setHasVisitedIncludeProjects(false);
    setHasVisitedSpecifyProjects(false);
    setHasVisitedSpecifyClusterSets(false);
    setHasVisitedIncludeClusters(false);
    // Reset selections
    setSelectedUser(preselectedIdentity?.type === 'user' ? preselectedIdentity.id : null);
    setSelectedGroup(preselectedIdentity?.type === 'group' ? preselectedIdentity.id : null);
    setSelectedClusters([]);
    setSelectedProjects([]);
    setSelectedCommonProject(null);
    setSelectedRole(preselectedRole?.id || null);
    // Reset search values
    setUserSearchValue('');
    setClusterSearchValue('');
    setProjectSearchValue('');
    setRoleSearchValue('');
    setClusterSetSearchValue('');
    // Reset pagination
    setUsersPage(1);
    setGroupsPage(1);
  };

  // Track when substeps are shown
  React.useEffect(() => {
    if (showSpecifyClusters) setHasVisitedSpecifyClusters(true);
    if (showIncludeProjects) setHasVisitedIncludeProjects(true);
    if (showSpecifyProjects) setHasVisitedSpecifyProjects(true);
    if (showSpecifyClusterSets) setHasVisitedSpecifyClusterSets(true);
    if (showIncludeClusters) setHasVisitedIncludeClusters(true);
  }, [showSpecifyClusters, showIncludeProjects, showSpecifyProjects, showSpecifyClusterSets, showIncludeClusters]);

  // Track previous isOpen state to only reset when wizard opens (not closes)
  const prevIsOpenRef = React.useRef(isOpen);
  
  React.useEffect(() => {
    // Only reset when wizard opens (transitions from false to true)
    if (isOpen && !prevIsOpenRef.current) {
      resetWizard();
    }
    prevIsOpenRef.current = isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };
  
  // When moving to step 2 from step 1, ensure we start with the proper substep
  // Removed automatic substep triggering - flow is now controlled by handleNext button
  // This allows the initial "Apply to all / Assign specific" selection screen to show properly

  const handleNext = () => {
    const isSingleClusterContext = !!clusterName;
    
    // === PROJECTS CONTEXT (Simplified) ===
    if (context === 'projects') {
      if (currentStep === 1) {
        // Step 1: Select users/groups → Step 2: Select role
        // Validate selection
        if (selectedIdentityType === 'user' && !selectedUser) return;
        if (selectedIdentityType === 'group' && !selectedGroup) return;
        setCurrentStep(2);
        return;
      } else if (currentStep === 2) {
        // Step 2: Select role → Step 3: Review
        if (!selectedRole) return;
        setCurrentStep(3);
        return;
      }
    }
    
    // === IDENTITIES CONTEXT ===
    if (context === 'identities') {
      if (currentStep === 1) {
        // Step 1: Navigate through initial selection and substeps
        // Flow: Initial selection → [Cluster sets → Include clusters → Specify clusters → Include projects → Specify projects]
        
        // If on the initial selection screen (no substeps active)
        if (!showSpecifyClusterSets && !showIncludeClusters && !showSpecifyClusters && !showIncludeProjects && !showSpecifyProjects) {
          if (resourceScope === 'all') {
            // "Apply to all resources" → skip directly to role selection
            setCurrentStep(2);
            return;
          } else if (resourceScope === 'specific') {
            // "Assign specific resources" → show cluster sets selection
            setShowSpecifyClusterSets(true);
            return;
          }
        }
        
        if (showSpecifyClusterSets) {
          // From "Specify cluster sets" → go to "Include clusters"
          if (selectedClusterSets.length === 0) return; // Need at least one cluster set
          setShowSpecifyClusterSets(false);
          setShowIncludeClusters(true);
          return;
        }
        
        if (showIncludeClusters) {
          setShowIncludeClusters(false);
          
          // If "Propagate to everything" → skip cluster and project selection, go to role selection
          if (clusterSetScope === 'all') {
            // Fall through to move to step 2
          } else if (clusterSetScope === 'specific') {
            // If "Assign specific resources" → show cluster selection
            setShowSpecifyClusters(true);
            return;
          }
        }
        
        if (showSpecifyClusters) {
          // From "Specify clusters" → go to "Include projects"
          if (selectedClusters.length === 0) return; // Need at least one cluster
          setShowSpecifyClusters(false);
          setShowIncludeProjects(true);
          return;
        }
        
        if (showIncludeProjects) {
          setShowIncludeProjects(false);
          
          // If "Full access" (cluster scope) → go to next step
          if (projectScope === 'cluster') {
            // Fall through to move to step 2
          } else if (projectScope === 'project') {
            // If "Partial access" (project scope) → show project selection
            setShowSpecifyProjects(true);
            return;
          }
        }
        
        if (showSpecifyProjects) {
          // From "Specify projects" → validate and go to step 2
          // If multiple clusters selected, it's common projects (single-select)
          if (selectedClusters.length > 1) {
            if (selectedCommonProject === null) return; // Need one common project selected
          } else {
            // If single cluster, it's multi-select
            if (selectedProjects.length === 0) return; // Need at least one project
          }
          setShowSpecifyProjects(false);
          // Fall through to move to step 2
        }
        
        // Move to Step 2: Select role
        setCurrentStep(2);
        return;
      } else if (currentStep === 2) {
        // Step 2: Select role → Step 3: Review
        setCurrentStep(3);
        return;
      }
    }
    
    // === ROLES CONTEXT ===
    if (context === 'roles') {
      if (currentStep === 1) {
        // Step 1: Select user or group → Step 2: Select resources
        setCurrentStep(2);
        return;
      } else if (currentStep === 2) {
        // Step 2: Navigate through initial selection and substeps (same as identities)
        // Flow: Initial selection → [Cluster sets → Include clusters → Specify clusters → Include projects → Specify projects]
        
        // If on the initial selection screen (no substeps active)
        if (!showSpecifyClusterSets && !showIncludeClusters && !showSpecifyClusters && !showIncludeProjects && !showSpecifyProjects) {
          if (resourceScope === 'all') {
            // "Apply to all resources" → skip directly to review
            setCurrentStep(3);
            return;
          } else if (resourceScope === 'specific') {
            // "Assign specific resources" → show cluster sets selection
            setShowSpecifyClusterSets(true);
            return;
          }
        }
        
        if (showSpecifyClusterSets) {
          // From "Specify cluster sets" → go to "Include clusters"
          if (selectedClusterSets.length === 0) return; // Need at least one cluster set
          setShowSpecifyClusterSets(false);
          setShowIncludeClusters(true);
          return;
        }
        
        if (showIncludeClusters) {
          setShowIncludeClusters(false);
          
          // If "Propagate to everything" → skip cluster and project selection, go to review
          if (clusterSetScope === 'all') {
            // Fall through to move to step 3
          } else if (clusterSetScope === 'specific') {
            // If "Assign specific resources" → show cluster selection
            setShowSpecifyClusters(true);
            return;
          }
        }
        
        if (showSpecifyClusters) {
          // From "Specify clusters" → go to "Include projects"
          if (selectedClusters.length === 0) return; // Need at least one cluster
          setShowSpecifyClusters(false);
          setShowIncludeProjects(true);
          return;
        }
        
        if (showIncludeProjects) {
          setShowIncludeProjects(false);
          
          // If "Full access" (cluster scope) → go to next step
          if (projectScope === 'cluster') {
            // Fall through to move to step 3
          } else if (projectScope === 'project') {
            // If "Partial access" (project scope) → show project selection
            setShowSpecifyProjects(true);
            return;
          }
        }
        
        if (showSpecifyProjects) {
          // From "Specify projects" → validate and go to step 3
          // If multiple clusters selected, it's common projects (single-select)
          if (selectedClusters.length > 1) {
            if (selectedCommonProject === null) return; // Need one common project selected
          } else {
            // If single cluster, it's multi-select
            if (selectedProjects.length === 0) return; // Need at least one project
          }
          setShowSpecifyProjects(false);
          // Fall through to move to step 3
        }
        
        // Move to Step 3: Review (skip role selection)
        setCurrentStep(3);
        return;
      }
    }
    
    // === CLUSTERS CONTEXT - OPTION B SUB-STEPS ===
    if (context === 'clusters' && currentStep === 2 && !isSingleClusterContext) {
      // SUB-STEP 1: Initial selection
      if (!showSpecifyClusters && !showIncludeProjects && !showSpecifyProjects) {
        if (clusterSetScope === 'all') {
          // "Everything in the cluster set" → skip to role selection (step 3)
          setCurrentStep(3);
          return;
        } else if (clusterSetScope === 'specific') {
          // "Cluster or Clusters" → show SUB-STEP 2 (select clusters)
          setShowSpecifyClusters(true);
          return;
        }
      }
      
      // SUB-STEP 2: Select clusters
      if (showSpecifyClusters && !showIncludeProjects && !showSpecifyProjects) {
        if (selectedClusters.length === 0) return; // Need at least one cluster
        // Go to SUB-STEP 3 (choose cluster scope)
        setShowSpecifyClusters(false);
        setShowIncludeProjects(true);
        return;
      }
      
      // SUB-STEP 3: Choose cluster scope
      if (showIncludeProjects && !showSpecifyProjects && selectedClusters.length > 0) {
        if (clusterScope === 'everything') {
          // "Everything on clusters" → skip to role selection (step 3)
          setShowIncludeProjects(false);
          setCurrentStep(3);
          return;
        } else if (clusterScope === 'narrow-down') {
          // "Narrow down to projects" → show SUB-STEP 4 (select projects)
          setShowIncludeProjects(false);
          setShowSpecifyProjects(true);
          return;
        }
      }
      
      // SUB-STEP 4: Select projects
      if (showSpecifyProjects && selectedClusters.length > 0) {
        // Validate selections (both single and multiple clusters now support multi-select)
        if (selectedProjects.length === 0) return; // Need at least one project
        
        // Go to role selection (step 3)
        setShowSpecifyProjects(false);
        setCurrentStep(3);
        return;
      }
    }
    
    // === CLUSTERS / ROLES CONTEXT ===
    if (currentStep === 2 && resourceScope === 'specific') {
      // Single cluster context: handle project scope selection
      if (isSingleClusterContext) {
        // If not showing projects yet, handle project scope selection
        if (!showSpecifyProjects) {
          // If "Full access" (cluster scope) → go to next step
          if (projectScope === 'cluster') {
            // Fall through to move to next step
          } else if (projectScope === 'project') {
            // If "Partial access" (project scope) → show "Specify projects"
            setShowSpecifyProjects(true);
            return;
          }
        } else {
          // From "Specify projects" substep → validate and go to next step
          if (selectedProjects.length === 0) return; // Need at least one project
          setShowSpecifyProjects(false);
          // Fall through to move to next step
        }
      } else {
        // Multi-cluster context: original logic
        // From "Specify clusters" substep → go to "Include projects" if clusters selected
        if (showSpecifyClusters) {
          if (selectedClusters.length > 0) {
            setShowSpecifyClusters(false);
            setShowIncludeProjects(true);
            return;
          } else {
            // No clusters selected, can't proceed
            return;
          }
        }
        
        // From "Include projects" substep
        if (showIncludeProjects) {
          setShowIncludeProjects(false);
          
          // If "Full access" (cluster scope) → skip project selection, go to next step
          if (projectScope === 'cluster') {
            // Fall through to move to next step
          } else if (projectScope === 'project') {
            // If "Partial access" (project scope) → show project selection
            // Logic: 1 cluster = "Specify projects", >1 cluster = "Specify common projects"
            setShowSpecifyProjects(true);
            return;
          }
        }
        
        // From "Specify projects" or "Specify common projects" substep → go to next step
        if (showSpecifyProjects) {
          // Validate selection based on cluster count
          if (selectedClusters.length === 1) {
            // Multi-select projects - need at least one selected
            if (selectedProjects.length === 0) return;
          } else {
            // Single-select common project - need one selected
            if (selectedCommonProject === null) return;
          }
          setShowSpecifyProjects(false);
          // Fall through to move to next step
        }
      }
    }
    
    // Determine next step based on context
    let nextStep = currentStep + 1;
    
    if (context === 'roles') {
      // Skip step 3 (role selection)
      if (currentStep === 2) nextStep = 4; // Go from resources to review
    }
    
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    const isSingleClusterContext = !!clusterName;
    
    // === PROJECTS CONTEXT (Simplified) ===
    if (context === 'projects') {
      if (currentStep === 3) {
        // Step 3 (Review) → Step 2 (Select role)
        setCurrentStep(2);
        return;
      } else if (currentStep === 2) {
        // Step 2 (Select role) → Step 1 (Select users/groups)
        setCurrentStep(1);
        return;
      }
      // Can't go back from Step 1
      return;
    }
    
    // === IDENTITIES CONTEXT ===
    if (context === 'identities') {
      if (currentStep === 3) {
        // Step 3 (Review) → Step 2 (Select role)
        setCurrentStep(2);
        return;
      } else if (currentStep === 2) {
        // Step 2 (Select role) → Step 1 (Select resources)
        setCurrentStep(1);
        return;
      } else if (currentStep === 1) {
        // Step 1: Handle substep back navigation
        if (showSpecifyProjects) {
          // From "Specify projects" → back to "Include projects"
          setShowSpecifyProjects(false);
          setShowIncludeProjects(true);
          return;
        }
        
        if (showIncludeProjects) {
          // From "Include projects" → back to "Specify clusters"
          setShowIncludeProjects(false);
          setShowSpecifyClusters(true);
          return;
        }
        
        if (showSpecifyClusters) {
          // From "Specify clusters" → back to "Include clusters"
          setShowSpecifyClusters(false);
          setShowIncludeClusters(true);
          return;
        }
        
        if (showIncludeClusters) {
          // From "Include clusters" → back to "Specify cluster sets"
          setShowIncludeClusters(false);
          setShowSpecifyClusterSets(true);
          return;
        }
        
        if (showSpecifyClusterSets) {
          // From "Specify cluster sets" → back to initial selection screen
          setShowSpecifyClusterSets(false);
          return;
        }
        
        // If on the initial selection screen, can't go back further
      }
      return;
    }
    
    // === ROLES CONTEXT ===
    if (context === 'roles') {
      if (currentStep === 3) {
        // Step 3 (Review) → Step 2 (Select resources)
        setCurrentStep(2);
        return;
      } else if (currentStep === 2) {
        // Step 2: Handle substep back navigation (same as identities)
        if (showSpecifyProjects) {
          // From "Specify projects" → back to "Include projects"
          setShowSpecifyProjects(false);
          setShowIncludeProjects(true);
          return;
        }
        
        if (showIncludeProjects) {
          // From "Include projects" → back to "Specify clusters"
          setShowIncludeProjects(false);
          setShowSpecifyClusters(true);
          return;
        }
        
        if (showSpecifyClusters) {
          // From "Specify clusters" → back to "Include clusters"
          setShowSpecifyClusters(false);
          setShowIncludeClusters(true);
          return;
        }
        
        if (showIncludeClusters) {
          // From "Include clusters" → back to "Specify cluster sets"
          setShowIncludeClusters(false);
          setShowSpecifyClusterSets(true);
          return;
        }
        
        if (showSpecifyClusterSets) {
          // From "Specify cluster sets" → back to initial selection screen
          setShowSpecifyClusterSets(false);
          return;
        }
        
        // From initial selection screen → go back to Step 1: Select user or group
        setCurrentStep(1);
        return;
      } else if (currentStep === 1) {
        // Can't go back from Step 1 (Select user or group) in roles context
        return;
      }
      return;
    }
    
    // === CLUSTERS CONTEXT - OPTION B SUB-STEPS BACK NAVIGATION ===
    if (context === 'clusters' && currentStep === 2 && !isSingleClusterContext) {
      // SUB-STEP 4: Select projects → back to SUB-STEP 3 (cluster scope)
      if (showSpecifyProjects) {
        setShowSpecifyProjects(false);
        setShowIncludeProjects(true);
        return;
      }
      
      // SUB-STEP 3: Cluster scope → back to SUB-STEP 2 (select clusters)
      if (showIncludeProjects) {
        setShowIncludeProjects(false);
        setShowSpecifyClusters(true);
        return;
      }
      
      // SUB-STEP 2: Select clusters → back to SUB-STEP 1 (initial selection)
      if (showSpecifyClusters) {
        setShowSpecifyClusters(false);
        return;
      }
      
      // SUB-STEP 1: Initial selection → back to previous main step
      // Fall through to go to previous step (step 1)
    }
    
    // === SINGLE CLUSTER CONTEXT ===
    if (currentStep === 2 && isSingleClusterContext) {
      // From "Specify projects" substep → go back to project scope selection
      if (showSpecifyProjects) {
        setShowSpecifyProjects(false);
        return;
      }
      // From project scope selection → go back to previous step
      // Fall through
    }
    
    // Determine previous step based on context
    let prevStep = currentStep - 1;
    
    setCurrentStep(prevStep);
  };

  const handleFinish = () => {
    console.log('Role assignment created');
    
    // Gather wizard data to pass back
    if (onComplete) {
      // Get identity name (look up by ID in mockUsers/mockGroups which use index-based IDs)
      let identityName = 'Unknown';
      if (selectedIdentityType === 'user' && selectedUser !== null) {
        const user = mockUsers.find(u => u.id === selectedUser);
        identityName = user?.name || 'Unknown User';
      } else if (selectedIdentityType === 'group' && selectedGroup !== null) {
        const group = mockGroups.find(g => g.id === selectedGroup);
        identityName = group?.name || 'Unknown Group';
      }
      
      // Get role name (look up by ID in mockRoles which uses index-based IDs)
      let roleName = 'Unknown Role';
      if (selectedRole !== null) {
        const role = mockRoles.find(r => r.id === selectedRole);
        roleName = role?.name || 'Unknown Role';
      }
      
      // Build resource summary
      let resourceSummary = 'All resources';
      if (context === 'projects') {
        resourceSummary = clusterName || 'This project';
      } else if (clusterName) {
        resourceSummary = clusterName;
      } else if (clusterSetName) {
        resourceSummary = clusterSetName;
      } else if (selectedClusterSets.length > 0) {
        resourceSummary = `${selectedClusterSets.length} cluster set${selectedClusterSets.length > 1 ? 's' : ''}`;
      } else if (selectedClusters.length > 0) {
        resourceSummary = `${selectedClusters.length} cluster${selectedClusters.length > 1 ? 's' : ''}`;
      } else if (selectedProjects.length > 0) {
        resourceSummary = `${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}`;
      } else if (resourceScope === 'all') {
        resourceSummary = 'All resources';
      }
      
      onComplete({
        identityType: selectedIdentityType,
        identityId: selectedIdentityType === 'user' ? selectedUser : selectedGroup,
        identityName,
        roleId: selectedRole,
        roleName,
        resourceSummary,
        selectedClusters,
        selectedProjects,
        selectedClusterSets
      });
    } else {
      handleClose();
    }
  };

  const handleTabClick = React.useCallback((_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
    if (tabIndex === 0) {
      setSelectedIdentityType('user');
    } else {
      setSelectedIdentityType('group');
    }
  }, []);

  const toggleClusterSetSelection = (clusterSetId: number) => {
    if (selectedClusterSets.includes(clusterSetId)) {
      setSelectedClusterSets(selectedClusterSets.filter((id) => id !== clusterSetId));
    } else {
      setSelectedClusterSets([...selectedClusterSets, clusterSetId]);
    }
  };

  const toggleClusterSelection = (clusterId: number) => {
    if (selectedClusters.includes(clusterId)) {
      setSelectedClusters(selectedClusters.filter((id) => id !== clusterId));
    } else {
      setSelectedClusters([...selectedClusters, clusterId]);
    }
  };

  const toggleProjectSelection = (projectId: number) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  const displayClusters = mockClusters
    .filter((cluster) => cluster.name.toLowerCase().includes(clusterSearchValue.toLowerCase()))
    .filter((cluster) => clusterViewMode === 'all' || selectedClusters.includes(cluster.id));

  const filteredProjects = mockProjects
    .filter((project) => project.name.toLowerCase().includes(projectSearchValue.toLowerCase()))
    .filter((project) => {
      // If we're in a single cluster context, only show projects from that cluster
      if (currentCluster) {
        return project.dbClusterId === currentCluster.id;
      }
      
      // If we're in a cluster set context and clusters are selected, only show projects from those clusters
      if (currentClusterSet && selectedClusters.length > 0) {
        // Get the database IDs of the selected clusters
        const selectedClusterDbIds = mockClusters
          .filter(c => selectedClusters.includes(c.id))
          .map(c => c.dbId);
        return selectedClusterDbIds.includes(project.dbClusterId);
      }
      
      // If we're in a cluster set context but no clusters selected yet, show all projects from the cluster set
      if (currentClusterSet) {
        // Get all cluster IDs in the current cluster set
        return currentClusterSet.clusterIds.includes(project.dbClusterId);
      }
      
      // Apply view mode filter
      return projectViewMode === 'all' || selectedProjects.includes(project.id);
    });

  const filteredRoles = mockRoles.filter((role) =>
    role.name.toLowerCase().includes(roleSearchValue.toLowerCase())
  );

  const getSelectedIdentityName = () => {
    if (selectedIdentityType === 'user' && selectedUser) {
      return mockUsers.find((u) => u.id === selectedUser)?.name;
    }
    if (selectedIdentityType === 'group' && selectedGroup) {
      return mockGroups.find((g) => g.id === selectedGroup)?.name;
    }
    return '';
  };

  const getSelectedClusterNames = () => {
    return selectedClusters.map((id) => mockClusters.find((c) => c.id === id)?.name).join(', ');
  };

  const getSelectedProjectNames = () => {
    if (clusterName || selectedClusters.length === 1) {
      // Single cluster context or single cluster selection - show multiple selected projects
      return selectedProjects.map((id) => mockProjects.find((p) => p.id === id)?.name).join(', ');
    } else {
      // Multiple clusters - show single selected common project
      return selectedCommonProject ? mockProjects.find((p) => p.id === selectedCommonProject)?.name : '';
    }
  };

  const getSelectedRoleName = () => {
    return mockRoles.find((r) => r.id === selectedRole)?.name;
  };

  // Step 1: Select user or group
  const Step1SelectUserOrGroup = React.useMemo(() => (
    <div>
      <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
        Select user, or group you want to grant access to
      </Title>
      <Content component="p" className="pf-v6-u-mb-md">
        Select the user or group you want to grant access to. If you don't see the group you want to select, create a new group in{' '}
        <Button variant="link" isInline component="a" href="#" onClick={(e) => e.preventDefault()}>
          Groups
        </Button>
        .
      </Content>

      <Tabs 
        key="identity-selection-tabs"
        activeKey={activeTabKey} 
        onSelect={handleTabClick} 
        aria-label="Identity type tabs"
      >
        <Tab eventKey={0} title={<TabTitleText>Users</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
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
                        variant="plain"
                        onClick={() => setIsUserFilterOpen(!isUserFilterOpen)}
                        isExpanded={isUserFilterOpen}
                      >
                        <FilterIcon /> Filters
                      </MenuToggle>
                    )}
                    popperProps={{
                      appendTo: () => document.body,
                      
                    }}
                  >
                    <DropdownList>
                      <DropdownItem key="all">All users</DropdownItem>
                      <DropdownItem key="ldap">LDAP</DropdownItem>
                      <DropdownItem key="local">Local</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <SearchInput
                    id="wizard-users-search"
                    aria-label="Search users"
                    placeholder="Search"
                    value={userSearchValue}
                    onChange={(_event, value) => setUserSearchValue(value)}
                    onClear={() => setUserSearchValue('')}
                  />
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={mockUsers.filter((user) => user.name.toLowerCase().includes(userSearchValue.toLowerCase())).length}
                    perPage={usersPerPage}
                    page={usersPage}
                    onSetPage={(_event, pageNumber) => setUsersPage(pageNumber)}
                    widgetId="users-pagination"
                    onPerPageSelect={(_event, perPage) => {
                      setUsersPerPage(perPage);
                      setUsersPage(1);
                    }}
                    variant={PaginationVariant.top}
                    isCompact
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            <Table aria-label="Users table" variant="compact">
              <Thead>
                <Tr>
                  <Th />
                  <Th>Name</Th>
                  <Th>Identity provider</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockUsers
                  .filter((user) => user.name.toLowerCase().includes(userSearchValue.toLowerCase()))
                  .slice((usersPage - 1) * usersPerPage, usersPage * usersPerPage)
                  .map((user) => (
                    <Tr key={user.id}>
                      <Td>
                        <Radio
                          isChecked={selectedUser === user.id}
                          name="selected-user"
                          onChange={() => setSelectedUser(user.id)}
                          id={`user-${user.id}`}
                        />
                      </Td>
                      <Td dataLabel="Name">
                        <div>{user.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>{user.username}</div>
                      </Td>
                      <Td dataLabel="Identity provider">{user.provider}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>

            <Toolbar>
              <ToolbarContent>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={mockUsers.filter((user) => user.name.toLowerCase().includes(userSearchValue.toLowerCase())).length}
                    perPage={usersPerPage}
                    page={usersPage}
                    onSetPage={(_event, pageNumber) => setUsersPage(pageNumber)}
                    widgetId="users-bottom-pagination"
                    onPerPageSelect={(_event, perPage) => {
                      setUsersPerPage(perPage);
                      setUsersPage(1);
                    }}
                    variant={PaginationVariant.bottom}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </div>
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Groups</TabTitleText>}>
          <div style={{ paddingTop: '24px' }}>
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
                        variant="plain"
                        onClick={() => setIsUserFilterOpen(!isUserFilterOpen)}
                        isExpanded={isUserFilterOpen}
                      >
                        <FilterIcon /> Filters
                      </MenuToggle>
                    )}
                    popperProps={{
                      appendTo: () => document.body,
                      
                    }}
                  >
                    <DropdownList>
                      <DropdownItem key="all">All groups</DropdownItem>
                      <DropdownItem key="ldap">LDAP</DropdownItem>
                      <DropdownItem key="local">Local</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
                <ToolbarItem>
                  <SearchInput
                    aria-label="Search groups"
                    placeholder="Search"
                    value={userSearchValue}
                    onChange={(_event, value) => setUserSearchValue(value)}
                    onClear={() => setUserSearchValue('')}
                  />
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={mockGroups.filter((group) => group.name.toLowerCase().includes(userSearchValue.toLowerCase())).length}
                    perPage={groupsPerPage}
                    page={groupsPage}
                    onSetPage={(_event, pageNumber) => setGroupsPage(pageNumber)}
                    widgetId="groups-pagination"
                    onPerPageSelect={(_event, perPage) => {
                      setGroupsPerPage(perPage);
                      setGroupsPage(1);
                    }}
                    variant={PaginationVariant.top}
                    isCompact
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            <Table aria-label="Groups table" variant="compact">
              <Thead>
                <Tr>
                  <Th />
                  <Th>Name</Th>
                  <Th>Users</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockGroups
                  .filter((group) => group.name.toLowerCase().includes(userSearchValue.toLowerCase()))
                  .slice((groupsPage - 1) * groupsPerPage, groupsPage * groupsPerPage)
                  .map((group) => (
                    <Tr key={group.id}>
                      <Td>
                        <Radio
                          isChecked={selectedGroup === group.id}
                          name="selected-group"
                          onChange={() => setSelectedGroup(group.id)}
                          id={`group-${group.id}`}
                        />
                      </Td>
                      <Td dataLabel="Name">{group.name}</Td>
                      <Td dataLabel="Users">{group.users}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>

            <Toolbar>
              <ToolbarContent>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={mockGroups.filter((group) => group.name.toLowerCase().includes(userSearchValue.toLowerCase())).length}
                    perPage={groupsPerPage}
                    page={groupsPage}
                    onSetPage={(_event, pageNumber) => setGroupsPage(pageNumber)}
                    widgetId="groups-bottom-pagination"
                    onPerPageSelect={(_event, perPage) => {
                      setGroupsPerPage(perPage);
                      setGroupsPage(1);
                    }}
                    variant={PaginationVariant.bottom}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </div>
        </Tab>
      </Tabs>
    </div>
  ), [activeTabKey, handleTabClick, userSearchValue, isUserFilterOpen, usersPage, usersPerPage, groupsPage, groupsPerPage, selectedUser, selectedGroup]);

  // Step 2: Select resources
  // Identities-specific: Step 1 = Select resources (with Apply to all / Assign specific)
  const Step1SelectResourcesForIdentities = () => {
    return (
    <div>
      {/* Initial selection screen - show when no substeps are active */}
      {!showSpecifyClusterSets && !showIncludeClusters && !showSpecifyClusters && !showIncludeProjects && !showSpecifyProjects && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Select resources
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Manage resource assignments.
          </Content>

          <Form>
            <FormGroup>
              <Radio
                isChecked={resourceScope === 'all'}
                name="resource-scope"
                onChange={() => setResourceScope('all')}
                label="Apply to all resources"
                description="This permission will apply to all cluster sets, clusters, projects, and resources currently managed by ACM, and any new ones added in the future."
                id="radio-all-resources"
              />
              <Radio
                isChecked={resourceScope === 'specific'}
                name="resource-scope"
                onChange={() => setResourceScope('specific')}
                label="Assign specific resources"
                description="Select exactly which cluster sets, clusters and projects this permission will apply to."
                id="radio-specific-resources"
                className="pf-v6-u-mt-md"
              />
            </FormGroup>
          </Form>
        </>
      )}
      
      {showSpecifyClusterSets && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Specify cluster sets
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Select cluster sets to define scope
          </Content>

          <Flex className="pf-v6-u-mb-md">
            <FlexItem>
              <SearchInput
                aria-label="Search cluster sets"
                placeholder="Search"
                value={clusterSetSearchValue}
                onChange={(_event, value) => setClusterSetSearchValue(value)}
                onClear={() => setClusterSetSearchValue('')}
              />
            </FlexItem>
          </Flex>

          <Table aria-label="Cluster sets table" variant="compact" className="pf-v6-u-mt-md">
            <Thead>
              <Tr>
                <Th />
                <Th>Name</Th>
                <Th>Clusters</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockClusterSets
                .filter((cs) => cs.name.toLowerCase().includes(clusterSetSearchValue.toLowerCase()))
                .map((clusterSet) => (
                <Tr key={clusterSet.id}>
                  <Td
                    select={{
                      rowIndex: clusterSet.id,
                      onSelect: () => toggleClusterSetSelection(clusterSet.id),
                      isSelected: selectedClusterSets.includes(clusterSet.id),
                    }}
                  />
                  <Td dataLabel="Name">{clusterSet.name}</Td>
                  <Td dataLabel="Clusters">{clusterSet.clusters}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}

      {showIncludeClusters && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Select clusters
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Manage resource assignments.
          </Content>

          <Form>
            <FormGroup>
              <Radio
                isChecked={clusterSetScope === 'all'}
                name="cluster-set-scope"
                onChange={() => setClusterSetScope('all')}
                label="Propagate to everything in selected cluster sets"
                description="The selected role will cover all current and new clusters and namespaces."
                id="radio-propagate-all"
              />
              <Radio
                isChecked={clusterSetScope === 'specific'}
                name="cluster-set-scope"
                onChange={() => setClusterSetScope('specific')}
                label="Assign specific resources on selected cluster sets"
                description="Choose which clusters and specify projects within those clusters this role assignment applies to."
                id="radio-assign-specific"
                className="pf-v6-u-mt-md"
              />
            </FormGroup>
          </Form>
        </>
      )}

      {showSpecifyClusters && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Specify clusters
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Select clusters from the selected cluster sets
          </Content>

          <Flex className="pf-v6-u-mb-md">
            <FlexItem>
              <Dropdown
                isOpen={isClusterFilterOpen}
                onSelect={() => setIsClusterFilterOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsClusterFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} onClick={() => setIsClusterFilterOpen(!isClusterFilterOpen)} isExpanded={isClusterFilterOpen}>
                    Filter
                  </MenuToggle>
                )}
                popperProps={{
                  appendTo: () => document.body,
                  
                }}
              >
                <DropdownList>
                  <DropdownItem>All clusters</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
            <FlexItem>
              <SearchInput
                aria-label="Search clusters"
                placeholder="Search"
                value={clusterSearchValue}
                onChange={(_event, value) => setClusterSearchValue(value)}
                onClear={() => setClusterSearchValue('')}
              />
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <ToggleGroup aria-label="Cluster view toggle">
                <ToggleGroupItem
                  text="All"
                  buttonId="cluster-view-all"
                  isSelected={clusterViewMode === 'all'}
                  onChange={() => setClusterViewMode('all')}
                />
                <ToggleGroupItem
                  text={`Selected ${selectedClusters.length}`}
                  buttonId="cluster-view-selected"
                  isSelected={clusterViewMode === 'selected'}
                  onChange={() => setClusterViewMode('selected')}
                />
              </ToggleGroup>
            </FlexItem>
          </Flex>

          <Table aria-label="Clusters table" variant="compact" className="pf-v6-u-mt-md">
            <Thead>
              <Tr>
                <Th />
                <Th>Name</Th>
                <Th>Infrastructure</Th>
                <Th>Control plane type</Th>
                <Th>Distribution version</Th>
                <Th>Labels</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayClusters.map((cluster) => (
                <Tr key={cluster.id}>
                  <Td
                    select={{
                      rowIndex: cluster.id,
                      onSelect: () => toggleClusterSelection(cluster.id),
                      isSelected: selectedClusters.includes(cluster.id),
                    }}
                  />
                  <Td dataLabel="Name">{cluster.name}</Td>
                  <Td dataLabel="Infrastructure">{cluster.infrastructure}</Td>
                  <Td dataLabel="Control plane type">{cluster.controlPlane}</Td>
                  <Td dataLabel="Distribution version">{cluster.distribution}</Td>
                  <Td dataLabel="Labels">{cluster.labels[0]}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}

      {showIncludeProjects && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Include projects
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Define project scope on selected {selectedClusters.length === 1 ? 'cluster' : 'clusters'}
          </Content>

          <Form>
            <FormGroup>
              <Radio
                isChecked={projectScope === 'cluster'}
                name="project-scope"
                onChange={() => setProjectScope('cluster')}
                label={selectedClusters.length === 1 ? "Apply to cluster / Full cluster scope" : "Apply to all projects on these clusters"}
                description={selectedClusters.length === 1 
                  ? "Role binds a cluster role to the cluster. It includes all existing and new projects." 
                  : "This also includes any new projects created in the future."}
                id="radio-all-projects"
              />
              <Radio
                isChecked={projectScope === 'project'}
                name="project-scope"
                onChange={() => setProjectScope('project')}
                label={selectedClusters.length === 1 ? "Apply to project(s) / Partial / Project-specific access" : "Apply to common projects"}
                description={selectedClusters.length === 1 
                  ? "Scope with projects by name to bind a role by." 
                  : "Find a project name and apply this role to all instances of it on your selected clusters."}
                id="radio-specific-projects"
                className="pf-v6-u-mt-md"
              />
            </FormGroup>
          </Form>
        </>
      )}

      {showSpecifyProjects && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            {selectedClusters.length > 1 ? 'Specify common projects' : 'Specify projects'}
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            {selectedClusters.length > 1 
              ? 'Find a project name and apply this role to all instances of it on your selected clusters.'
              : 'Select specific projects for role assignment'}
          </Content>

          <Flex className="pf-v6-u-mb-md">
            <FlexItem>
              <Dropdown
                isOpen={isProjectFilterOpen}
                onSelect={() => setIsProjectFilterOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsProjectFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} onClick={() => setIsProjectFilterOpen(!isProjectFilterOpen)} isExpanded={isProjectFilterOpen}>
                    Filter
                  </MenuToggle>
                )}
                popperProps={{
                  appendTo: () => document.body,
                  
                }}
              >
                <DropdownList>
                  <DropdownItem>All projects</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
            <FlexItem>
              <SearchInput
                aria-label="Search projects"
                placeholder="Search"
                value={projectSearchValue}
                onChange={(_event, value) => setProjectSearchValue(value)}
                onClear={() => setProjectSearchValue('')}
              />
            </FlexItem>
            {selectedClusters.length === 1 && (
              <FlexItem align={{ default: 'alignRight' }}>
                <ToggleGroup aria-label="Project view toggle">
                  <ToggleGroupItem
                    text="All"
                    buttonId="project-view-all"
                    isSelected={projectViewMode === 'all'}
                    onChange={() => setProjectViewMode('all')}
                  />
                  <ToggleGroupItem
                    text={`Selected ${selectedProjects.length}`}
                    buttonId="project-view-selected"
                    isSelected={projectViewMode === 'selected'}
                    onChange={() => setProjectViewMode('selected')}
                  />
                </ToggleGroup>
              </FlexItem>
            )}
          </Flex>

          <Table aria-label="Projects table" variant="compact" className="pf-v6-u-mt-md">
            <Thead>
              <Tr>
                <Th />
                <Th>Project</Th>
                <Th>Cluster</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProjects.map((project) => (
                <Tr key={project.id}>
                  {selectedClusters.length > 1 ? (
                    // Radio buttons for common projects (multiple clusters)
                    <Td
                      select={{
                        rowIndex: project.id,
                        onSelect: () => setSelectedCommonProject(project.id),
                        isSelected: selectedCommonProject === project.id,
                        variant: 'radio',
                      }}
                    />
                  ) : (
                    // Checkboxes for single cluster projects
                    <Td
                      select={{
                        rowIndex: project.id,
                        onSelect: () => toggleProjectSelection(project.id),
                        isSelected: selectedProjects.includes(project.id),
                      }}
                    />
                  )}
                  <Td dataLabel="Project">{project.name}</Td>
                  <Td dataLabel="Cluster">{project.cluster}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </div>
    );
  };

  const Step2SelectResources = () => {
    // If we have a clusterName, we're in single cluster context
    const isSingleClusterContext = !!clusterName;
    
    // Filter projects based on selected cluster(s) and search
    const filteredProjects = React.useMemo(() => {
      let projects = mockProjects;
      
      // Filter by selected cluster(s)
      if (isSingleClusterContext) {
        const currentCluster = mockClusters.find(c => c.name === clusterName);
        if (currentCluster) {
          projects = projects.filter(p => p.dbClusterId === currentCluster.dbId);
        }
      } else if (selectedClusters.length > 0) {
        const selectedClusterDbIds = selectedClusters.map(id => mockClusters.find(c => c.id === id)?.dbId).filter(Boolean);
        projects = projects.filter(p => selectedClusterDbIds.includes(p.dbClusterId));
      }
      
      // Filter by search
      if (projectSearchValue) {
        projects = projects.filter(p => p.name.toLowerCase().includes(projectSearchValue.toLowerCase()));
      }
      
      // For multiple clusters, find common projects
      if (!isSingleClusterContext && selectedClusters.length > 1) {
        const projectsByName = new Map<string, typeof mockProjects>();
        projects.forEach(project => {
          if (!projectsByName.has(project.name)) {
            projectsByName.set(project.name, []);
          }
          projectsByName.get(project.name)?.push(project);
        });
        
        // Only keep projects that exist in ALL selected clusters
        const commonProjectNames = Array.from(projectsByName.entries())
          .filter(([_, projs]) => projs.length === selectedClusters.length)
          .map(([name]) => name);
        
        projects = projects.filter(p => commonProjectNames.includes(p.name));
        
        // Deduplicate by name for display (show one row per project name)
        const seen = new Set<string>();
        projects = projects.filter(p => {
          if (seen.has(p.name)) return false;
          seen.add(p.name);
          return true;
        });
      }
      
      return projects;
    }, [selectedClusters, projectSearchValue, isSingleClusterContext, clusterName]);
    
    return (
    <div>
      {/* OPTION B: For cluster set context - Logical sub-steps */}
      
      {/* SUB-STEP 1: Initial selection - Choose cluster set scope */}
      {!isSingleClusterContext && !showSpecifyClusters && !showIncludeProjects && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Select resources
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Choose which resources to assign this role to
          </Content>

          <FormGroup label="Resource scope">
            <FormSelect
              value={clusterSetScope}
              onChange={(_event, value) => {
                setClusterSetScope(value as 'all' | 'specific');
                setSelectedClusters([]);
                setSelectedProjects([]);
                setClusterScope('everything');
              }}
              aria-label="Resource scope selection"
            >
              <FormSelectOption value="all" label="Everything in the cluster set" />
              <FormSelectOption value="specific" label="Cluster or Clusters" />
            </FormSelect>
            <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              {clusterSetScope === 'all' 
                ? 'Apply to all clusters and all resources within them, including any created in the future'
                : 'Select specific clusters, then choose to apply to full clusters or narrow down to specific projects'}
            </div>
          </FormGroup>

          {clusterSetScope === 'all' && (
            <Content component="p" className="pf-v6-u-mt-md" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              This role assignment will apply to all clusters in the cluster set and all resources within them, including any resources created in the future.
            </Content>
          )}
        </>
      )}

      {/* SUB-STEP 2: Select clusters (only if "Cluster or Clusters" was chosen) */}
      {!isSingleClusterContext && showSpecifyClusters && !showIncludeProjects && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Select clusters
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Choose one or more clusters from the cluster set
          </Content>

          <SearchInput
            aria-label="Search clusters"
            placeholder="Search"
            value={clusterSearchValue}
            onChange={(_event, value) => setClusterSearchValue(value)}
            onClear={() => setClusterSearchValue('')}
            className="pf-v6-u-mb-md"
          />

          <Table aria-label="Clusters table" variant="compact">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox
                    id="select-all-clusters"
                    aria-label="Select all clusters"
                    isChecked={mockClusters.length > 0 && mockClusters.every(c => selectedClusters.includes(c.id))}
                    onChange={(_, isChecked) => {
                      if (isChecked) {
                        setSelectedClusters(mockClusters.map(c => c.id));
                      } else {
                        setSelectedClusters([]);
                      }
                      // Reset downstream
                      setSelectedProjects([]);
                      setClusterScope('everything');
                    }}
                  />
                </Th>
                <Th>Name</Th>
                <Th>Namespace</Th>
                <Th>Status</Th>
                <Th>Infrastructure</Th>
                <Th>Control plane type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockClusters
                .filter(cluster => cluster.name.toLowerCase().includes(clusterSearchValue.toLowerCase()))
                .map((cluster) => (
                  <Tr key={cluster.id}>
                    <Td>
                      <Checkbox
                        id={`select-cluster-${cluster.id}`}
                        aria-label={`Select ${cluster.name}`}
                        isChecked={selectedClusters.includes(cluster.id)}
                        onChange={() => {
                          const newSelection = selectedClusters.includes(cluster.id)
                            ? selectedClusters.filter(id => id !== cluster.id)
                            : [...selectedClusters, cluster.id];
                          setSelectedClusters(newSelection);
                          // Reset downstream
                          setSelectedProjects([]);
                          setClusterScope('everything');
                        }}
                      />
                    </Td>
                    <Td dataLabel="Name">{cluster.name}</Td>
                    <Td dataLabel="Namespace">{mockClusterSets.find(cs => cs.dbId === cluster.clusterSetId)?.name || 'N/A'}</Td>
                    <Td dataLabel="Status">
                      <Label color={cluster.status === 'Ready' ? 'green' : 'red'}>
                        {cluster.status}
                      </Label>
                    </Td>
                    <Td dataLabel="Infrastructure">Amazon Web Services</Td>
                    <Td dataLabel="Control plane type">Standalone</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </>
      )}

      {/* SUB-STEP 3: Choose cluster scope (after clusters are selected) */}
      {!isSingleClusterContext && showIncludeProjects && !showSpecifyProjects && selectedClusters.length > 0 && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            {selectedClusters.length === 1 ? 'Choose cluster scope' : 'Choose scope'}
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            {selectedClusters.length === 1 
              ? 'Apply full cluster access or narrow down to specific projects within this cluster'
              : `Apply full access across all ${selectedClusters.length} clusters or narrow down to common projects that exist across all of them`}
          </Content>

          <FormGroup label="Scope">
            <FormSelect
              value={clusterScope}
              onChange={(_event, value) => {
                setClusterScope(value as 'everything' | 'narrow-down');
                setSelectedProjects([]);
              }}
              aria-label="Cluster scope selection"
            >
              <FormSelectOption 
                value="everything" 
                label={selectedClusters.length === 1 ? 'Full cluster access' : 'Full access on all clusters'} 
              />
              <FormSelectOption 
                value="narrow-down" 
                label={selectedClusters.length === 1 ? 'Select specific projects (multiple)' : 'Select common projects (multiple)'} 
              />
            </FormSelect>
            <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              {clusterScope === 'everything' 
                ? (selectedClusters.length === 1 
                    ? 'Apply to all projects and resources in this cluster, including any created in the future'
                    : `Apply to all projects and resources across all ${selectedClusters.length} clusters, including any created in the future`)
                : (selectedClusters.length === 1 
                    ? 'Select one or more specific projects from this cluster'
                    : `Select one or more common projects that exist across the ${selectedClusters.length} selected clusters`)}
            </div>
          </FormGroup>

          {clusterScope === 'everything' && (
            <Content component="p" className="pf-v6-u-mt-md" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              {selectedClusters.length === 1 
                ? 'Full cluster access: This role assignment will apply to all projects and resources in the selected cluster, including any created in the future.'
                : `Full access across ${selectedClusters.length} clusters: This role assignment will apply to all projects and resources across all selected clusters, including any created in the future.`}
            </Content>
          )}
          
          {clusterScope === 'narrow-down' && (
            <Content component="p" className="pf-v6-u-mt-md" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
              {selectedClusters.length === 1 
                ? 'You will be able to select one or more specific projects from this cluster.'
                : `You will select one or more common projects that exist with the same name across all ${selectedClusters.length} selected clusters.`}
            </Content>
          )}
        </>
      )}

      {/* SUB-STEP 4: Select projects (if narrow down was chosen) */}
      {!isSingleClusterContext && showSpecifyProjects && selectedClusters.length > 0 && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            {selectedClusters.length === 1 ? 'Select specific projects' : 'Select common projects'}
          </Title>
          {selectedClusters.length > 1 && (
            <Content component="p" className="pf-v6-u-mb-md">
              Select one or more common projects that exist with the same name across all {selectedClusters.length} selected clusters. The role will be assigned to each selected project in all clusters where it exists.
            </Content>
          )}
          {selectedClusters.length === 1 && (
            <Content component="p" className="pf-v6-u-mb-md">
              Select one or more specific projects from this cluster. The role will be assigned only to the selected projects.
            </Content>
          )}
          
          <SearchInput
            aria-label="Search projects"
            placeholder="Search"
            value={projectSearchValue}
            onChange={(_event, value) => setProjectSearchValue(value)}
            onClear={() => setProjectSearchValue('')}
            className="pf-v6-u-mb-md"
          />

          <Table aria-label="Projects table" variant="compact">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox
                    id="select-all-projects"
                    aria-label="Select all projects"
                    isChecked={filteredProjects.length > 0 && filteredProjects.every(p => selectedProjects.includes(p.id))}
                    onChange={(_, isChecked) => {
                      if (isChecked) {
                        setSelectedProjects(filteredProjects.map(p => p.id));
                      } else {
                        setSelectedProjects([]);
                      }
                    }}
                  />
                </Th>
                <Th width={selectedClusters.length === 1 ? 25 : 40}>Project name</Th>
                {selectedClusters.length === 1 ? (
                  <>
                    <Th width={20}>Display name</Th>
                    <Th width={10}>Status</Th>
                    <Th width={10}>Type</Th>
                    <Th width={15}>Requester</Th>
                  </>
                ) : (
                  <Th width={40}>Clusters</Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {selectedClusters.length === 1 ? (
                // Single cluster - show all project details
                filteredProjects.map((project) => (
                  <Tr key={project.id}>
                    <Td>
                      <Checkbox
                        id={`select-project-${project.id}`}
                        aria-label={`Select ${project.name}`}
                        isChecked={selectedProjects.includes(project.id)}
                        onChange={() => {
                          const newSelection = selectedProjects.includes(project.id)
                            ? selectedProjects.filter(id => id !== project.id)
                            : [...selectedProjects, project.id];
                          setSelectedProjects(newSelection);
                        }}
                      />
                    </Td>
                    <Td dataLabel="Project name">{project.name}</Td>
                    <Td dataLabel="Display name">{project.displayName}</Td>
                    <Td dataLabel="Status">
                      <Label color={project.status === 'Active' ? 'green' : project.status === 'Terminating' ? 'orange' : 'red'}>
                        {project.status}
                      </Label>
                    </Td>
                    <Td dataLabel="Type">
                      <Label color="blue">{project.type}</Label>
                    </Td>
                    <Td dataLabel="Requester">{project.requester}</Td>
                  </Tr>
                ))
              ) : (
                // Multiple clusters - show common projects with cluster list
                (() => {
                  // Get selected cluster names
                  const selectedClusterNames = mockClusters
                    .filter(c => selectedClusters.includes(c.id))
                    .map(c => c.name);

                  // Build a map of common project names
                  const commonProjectsMap = new Map<string, { projects: typeof mockProjects, clusterNames: string[] }>();
                  
                  filteredProjects.forEach(project => {
                    if (!commonProjectsMap.has(project.name)) {
                      commonProjectsMap.set(project.name, { projects: [], clusterNames: [] });
                    }
                    const entry = commonProjectsMap.get(project.name)!;
                    entry.projects.push(project);
                    const clusterName = mockClusters.find(c => c.dbId === project.dbClusterId)?.name;
                    if (clusterName) {
                      entry.clusterNames.push(clusterName);
                    }
                  });

                  // Filter to only projects that exist in ALL selected clusters
                  const commonProjects = Array.from(commonProjectsMap.entries())
                    .filter(([_, entry]) => entry.clusterNames.length === selectedClusters.length)
                    .map(([name, entry]) => ({
                      name,
                      projects: entry.projects,
                      clusterNames: entry.clusterNames.sort()
                    }));

                  return commonProjects.map((item, index) => {
                    const isSelected = item.projects.every(p => selectedProjects.includes(p.id));
                    
                    return (
                      <Tr key={index}>
                        <Td>
                          <Checkbox
                            id={`select-common-project-${index}`}
                            aria-label={`Select ${item.name}`}
                            isChecked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                // Remove all instances of this project
                                setSelectedProjects(selectedProjects.filter(id => !item.projects.some(p => p.id === id)));
                              } else {
                                // Add all instances of this project
                                setSelectedProjects([...selectedProjects, ...item.projects.map(p => p.id)]);
                              }
                            }}
                          />
                        </Td>
                        <Td dataLabel="Project name">{item.name}</Td>
                        <Td dataLabel="Clusters">
                          {item.clusterNames.map((clusterName, idx) => (
                            <Label key={idx} color="blue" className={idx > 0 ? 'pf-v6-u-ml-xs' : ''}>
                              {clusterName}
                            </Label>
                          ))}
                        </Td>
                      </Tr>
                    );
                  });
                })()
              )}
            </Tbody>
          </Table>
        </>
      )}

      {/* Single cluster context - keep original logic */}
      {isSingleClusterContext && !showSpecifyProjects && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
            Select resources
          </Title>
          <Content component="p" className="pf-v6-u-mb-md">
            Define project scope on {clusterName}
          </Content>

          <Form>
            <FormGroup>
              <Radio
                isChecked={projectScope === 'cluster'}
                name="project-scope"
                onChange={() => setProjectScope('cluster')}
                label="Apply to cluster / Full cluster scope"
                description="Not binds a cluster role to the cluster. It includes all existing and new projects."
                id="radio-cluster-scope"
              />
              <Radio
                isChecked={projectScope === 'project'}
                name="project-scope"
                onChange={() => setProjectScope('project')}
                label="Apply to project(s) / Partial / Project-specific access"
                description="Scope with projects by name to bind a role by."
                id="radio-project-scope"
                className="pf-v6-u-mt-md"
              />
            </FormGroup>
          </Form>
        </>
      )}

      {showSpecifyProjects && (
        <>
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-md">
            {isSingleClusterContext || selectedClusters.length === 1 ? 'Specify projects' : 'Specify common projects'}
          </Title>
          {!isSingleClusterContext && selectedClusters.length > 1 && (
            <Content component="p" className="pf-v6-u-mb-md">
              Common projects are projects with the same name across selected clusters. Select one common project.
            </Content>
          )}

          <Flex className="pf-v6-u-mb-md">
            <FlexItem>
              <Dropdown
                isOpen={isProjectFilterOpen}
                onSelect={() => setIsProjectFilterOpen(false)}
                onOpenChange={(isOpen: boolean) => setIsProjectFilterOpen(isOpen)}
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle ref={toggleRef} onClick={() => setIsProjectFilterOpen(!isProjectFilterOpen)} isExpanded={isProjectFilterOpen}>
                    Filter
                  </MenuToggle>
                )}
                popperProps={{
                  appendTo: () => document.body,
                  
                }}
              >
                <DropdownList>
                  <DropdownItem>All projects</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
            <FlexItem>
              <SearchInput
                aria-label="Search projects"
                placeholder="Search"
                value={projectSearchValue}
                onChange={(_event, value) => setProjectSearchValue(value)}
                onClear={() => setProjectSearchValue('')}
              />
            </FlexItem>
            {(isSingleClusterContext || selectedClusters.length === 1) && (
              <FlexItem align={{ default: 'alignRight' }}>
                <ToggleGroup aria-label="Project view toggle">
                  <ToggleGroupItem
                    text="All"
                    buttonId="project-view-all"
                    isSelected={projectViewMode === 'all'}
                    onChange={() => setProjectViewMode('all')}
                  />
                  <ToggleGroupItem
                    text={`Selected ${selectedProjects.length}`}
                    buttonId="project-view-selected"
                    isSelected={projectViewMode === 'selected'}
                    onChange={() => setProjectViewMode('selected')}
                  />
                </ToggleGroup>
              </FlexItem>
            )}
          </Flex>

          <Table aria-label="Projects table" variant="compact" className="pf-v6-u-mt-md">
            <Thead>
              <Tr>
                <Th />
                <Th>Project</Th>
                {/* Only show Cluster column when selecting from multiple clusters */}
                {!isSingleClusterContext && selectedClusters.length > 1 && <Th>Cluster</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {filteredProjects.map((project) => (
                <Tr key={project.id}>
                  {(isSingleClusterContext || selectedClusters.length === 1) ? (
                    // Multi-select with checkboxes for single cluster context or single cluster selection
                    <Td
                      select={{
                        rowIndex: project.id,
                        onSelect: () => toggleProjectSelection(project.id),
                        isSelected: selectedProjects.includes(project.id),
                      }}
                    />
                  ) : (
                    // Single-select with radio buttons for multiple clusters
                    <Td>
                      <Radio
                        isChecked={selectedCommonProject === project.id}
                        name="selected-common-project"
                        onChange={() => setSelectedCommonProject(project.id)}
                        id={`common-project-${project.id}`}
                      />
                    </Td>
                  )}
                  <Td dataLabel="Project">{project.name}</Td>
                  {/* Only show Cluster cell when selecting from multiple clusters */}
                  {!isSingleClusterContext && selectedClusters.length > 1 && (
                    <Td dataLabel="Cluster">{project.cluster}</Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </div>
    );
  };

  // Step 3: Select role
  const Step3SelectRole = () => (
    <div>
      <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-sm">
        Select role
      </Title>
      <Content component="p" className="pf-v6-u-mb-md">
        Select one role to assign.{' '}
        <Button variant="link" isInline component="a" href="#" onClick={(e) => e.preventDefault()}>
          Roles
        </Button>
      </Content>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <Dropdown
              isOpen={isRoleFilterOpen}
              onSelect={() => setIsRoleFilterOpen(false)}
              onOpenChange={(isOpen: boolean) => setIsRoleFilterOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  variant="plain"
                  onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
                  isExpanded={isRoleFilterOpen}
                >
                  <FilterIcon /> Filters
                </MenuToggle>
              )}
              popperProps={{
                appendTo: () => document.body,
                
              }}
            >
              <DropdownList>
                <DropdownItem key="all">All roles</DropdownItem>
                <DropdownItem key="kubevirt">kubevirt.io</DropdownItem>
                <DropdownItem key="admin">Admin roles</DropdownItem>
                <DropdownItem key="viewer">Viewer roles</DropdownItem>
                <DropdownItem key="editor">Editor roles</DropdownItem>
              </DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
            <SearchInput
              aria-label="Search roles"
              placeholder="Search"
              value={roleSearchValue}
              onChange={(_event, value) => setRoleSearchValue(value)}
              onClear={() => setRoleSearchValue('')}
            />
          </ToolbarItem>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={filteredRoles.length}
              perPage={10}
              page={1}
              onSetPage={() => {}}
              widgetId="roles-pagination"
              onPerPageSelect={() => {}}
              variant={PaginationVariant.top}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Roles table" variant="compact">
        <Thead>
          <Tr>
            <Th />
            <Th>Role</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredRoles.map((role) => (
            <Tr key={role.id}>
              <Td>
                <Radio
                  isChecked={selectedRole === role.id}
                  name="selected-role"
                  onChange={() => setSelectedRole(role.id)}
                  id={`role-${role.id}`}
                />
              </Td>
              <Td dataLabel="Role">
                <div>{role.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>{role.type}</div>
              </Td>
              <Td dataLabel="Description">
                <strong>{role.description.split(':')[0]}:</strong>
                {role.description.split(':')[1]}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination
              itemCount={filteredRoles.length}
              perPage={10}
              page={1}
              onSetPage={() => {}}
              widgetId="roles-bottom-pagination"
              onPerPageSelect={() => {}}
              variant={PaginationVariant.bottom}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    </div>
  );

  // Step 4: Review
  const Step4Review = () => (
    <div>
      <Title headingLevel="h2" size="xl" className="pf-v6-u-mb-lg">
        Review
      </Title>

      <div style={{ borderTop: '1px solid var(--pf-t--global--border--color--default)', paddingTop: '1rem', marginBottom: '1rem' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h3" size="md">Select user or group</Title>
          </FlexItem>
          <FlexItem>
            <Button variant="link" onClick={() => setCurrentStep(1)} isInline>
              Edit step
            </Button>
          </FlexItem>
        </Flex>
        <div style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
          <div><strong>{selectedIdentityType === 'user' ? 'User' : 'Group'}</strong></div>
          <div>{getSelectedIdentityName()}</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--pf-t--global--border--color--default)', paddingTop: '1rem', marginBottom: '1rem' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h3" size="md">Select resources</Title>
          </FlexItem>
          <FlexItem>
            <Button variant="link" onClick={() => { setCurrentStep(2); setShowSpecifyClusters(true); setShowIncludeProjects(false); setShowSpecifyProjects(false); }} isInline>
              Edit step
            </Button>
          </FlexItem>
        </Flex>
        <div style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
          <div style={{ marginBottom: '0.25rem' }}>
            <strong>Select resources</strong>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>Assign to specific</div>
          
          <div style={{ marginBottom: '0.25rem' }}>
            <strong>Specify clusters</strong>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>{getSelectedClusterNames()}</div>
          
          <div style={{ marginBottom: '0.25rem' }}>
            <strong>Include projects</strong>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>Common projects</div>
          
          <div style={{ marginBottom: '0.25rem' }}>
            <strong>Projects</strong>
          </div>
          <div>{getSelectedProjectNames()}</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--pf-t--global--border--color--default)', paddingTop: '1rem', marginBottom: '1rem' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h3" size="md">Select role</Title>
          </FlexItem>
          <FlexItem>
            <Button variant="link" onClick={() => setCurrentStep(3)} isInline>
              Edit step
            </Button>
          </FlexItem>
        </Flex>
        <div style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
          <div><strong>Role</strong></div>
          <div>{getSelectedRoleName()}</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--pf-t--global--border--color--default)', paddingTop: '1rem' }}>
        <Title headingLevel="h3" size="md">YAML</Title>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    if (context === 'projects') {
      // Projects context: Step 1 = Users/Groups, Step 2 = Role, Step 3 = Review
      switch (currentStep) {
        case 1:
          return Step1SelectUserOrGroup;
        case 2:
          return <Step3SelectRole />;
        case 3:
          return <Step4Review />;
        default:
          return null;
      }
    }
    
    if (context === 'identities') {
      // Identities context: Step 1 = Resources, Step 2 = Role, Step 3 = Review
      switch (currentStep) {
        case 1:
          return <Step1SelectResourcesForIdentities />;
        case 2:
          return <Step3SelectRole />;
        case 3:
          return <Step4Review />;
        default:
          return null;
      }
    }
    
    if (context === 'roles') {
      // Roles context: Step 1 = User/Group, Step 2 = Resources, Step 3 = Review
      switch (currentStep) {
        case 1:
          return Step1SelectUserOrGroup;
        case 2:
          return <Step1SelectResourcesForIdentities />;
        case 3:
          return <Step4Review />;
        default:
          return null;
      }
    }
    
    // Clusters context
    switch (currentStep) {
      case 1:
        return Step1SelectUserOrGroup;
      case 2:
        return <Step2SelectResources />;
      case 3:
        return <Step3SelectRole />;
      case 4:
        return <Step4Review />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    if (context === 'projects') {
      const titles = ['', 'Select users or groups', 'Select role', 'Review'];
      return titles[currentStep] || '';
    }
    
    if (context === 'identities') {
      if (currentStep === 1) {
        // Step 1 for Identities: Select resources with substeps
        if (showSpecifyClusterSets) return 'Specify cluster sets';
        if (showIncludeClusters) return 'Select clusters';
        if (showSpecifyClusters) return 'Specify clusters';
        if (showIncludeProjects) return 'Include projects';
        if (showSpecifyProjects) return selectedClusters.length > 1 ? 'Specify common projects' : 'Specify projects';
        return 'Select resources';
      }
      const titles = ['', 'Select resources', 'Select role', 'Review'];
      return titles[currentStep] || '';
    }
    
    if (context === 'roles') {
      if (currentStep === 2) {
        // Step 2 for Roles: Select resources with substeps (same as identities)
        if (showSpecifyClusterSets) return 'Specify cluster sets';
        if (showIncludeClusters) return 'Select clusters';
        if (showSpecifyClusters) return 'Specify clusters';
        if (showIncludeProjects) return 'Include projects';
        if (showSpecifyProjects) return selectedClusters.length > 1 ? 'Specify common projects' : 'Specify projects';
        return 'Select resources';
      }
      const titles = ['', 'Select user or group', 'Select resources', 'Review'];
      return titles[currentStep] || '';
    }
    
    // Clusters context
    if (currentStep === 2) {
      if (showSpecifyClusters) return 'Specify clusters';
      if (showIncludeProjects) return 'Include projects';
      if (showSpecifyProjects) return 'Specify common projects';
      return 'Select resources';
    }
    
    const titles = ['', 'Select user or group', 'Select resources', 'Select role', 'Review'];
    return titles[currentStep];
  };

  const renderStepIndicator = (stepNum: number, label: string, isSubStep: boolean = false, showConnector: boolean = true) => {
    const isActive = currentStep === stepNum;
    const isCompleted = currentStep > stepNum;
    
    // Render substeps without circles
    if (isSubStep) {
      // Check if this substep is currently active
      let isSubStepActive = false;
      
      if (context === 'identities' && currentStep === 1) {
        isSubStepActive = 
          (label === 'Specify cluster sets' && showSpecifyClusterSets) ||
          (label === 'Include clusters' && showIncludeClusters) ||
          (label === 'Specify clusters' && showSpecifyClusters) ||
          (label === 'Include projects' && showIncludeProjects) ||
          ((label === 'Specify common projects' || label === 'Specify projects') && showSpecifyProjects);
      } else if (context === 'roles' && currentStep === 2) {
        isSubStepActive = 
          (label === 'Specify cluster sets' && showSpecifyClusterSets) ||
          (label === 'Include clusters' && showIncludeClusters) ||
          (label === 'Specify clusters' && showSpecifyClusters) ||
          (label === 'Include projects' && showIncludeProjects) ||
          ((label === 'Specify common projects' || label === 'Specify projects') && showSpecifyProjects);
      } else if (currentStep === 2) {
        isSubStepActive = 
          (label === 'Specify clusters' && showSpecifyClusters) ||
          (label === 'Include projects' && showIncludeProjects) ||
          ((label === 'Specify common projects' || label === 'Specify projects') && showSpecifyProjects);
      }
      
      return (
        <div style={{ position: 'relative', marginBottom: '0.25rem', paddingLeft: '3.5rem' }}>
          <span
            style={{ 
              display: 'inline-block',
              padding: '0.5rem 0.75rem',
              fontSize: '14px',
              color: '#6a6e73',
              cursor: 'default',
              backgroundColor: isSubStepActive ? '#f0f0f0' : 'transparent',
              borderRadius: '4px'
            }}
          >
            {label}
          </span>
        </div>
      );
    }
    
    // Check if this step has substeps (step 2 has expandable substeps)
    const hasSubsteps = stepNum === 2;
    
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
              {hasSubsteps && isActive && (
                <CaretDownIcon style={{ fontSize: '12px', color: '#151515' }} />
              )}
            </div>
          </FlexItem>
        </Flex>
      </div>
    );
  };

  const isNextButtonDisabled = () => {
    const isSingleClusterContext = !!clusterName;
    
    // === PROJECTS CONTEXT (Simplified) ===
    if (context === 'projects') {
      if (currentStep === 1) {
        // Step 1: Select users or groups
        if (selectedIdentityType === 'user') {
          return selectedUser === null;
        } else {
          return selectedGroup === null;
        }
      }
      
      if (currentStep === 2) {
        // Step 2: Select role
        return selectedRole === null;
      }
      
      // Step 3 is Review, no validation needed
      return false;
    }
    
    // === IDENTITIES CONTEXT ===
    if (context === 'identities') {
      if (currentStep === 1) {
        // Step 1: Select resources (with substeps)
        if (showSpecifyClusterSets) {
          return selectedClusterSets.length === 0;
        }
        if (showSpecifyClusters) {
          return selectedClusters.length === 0;
        }
        if (showIncludeProjects) {
          return false; // Can always proceed from project scope selection
        }
        if (showSpecifyProjects) {
          // If multiple clusters selected, it's common projects (radio/single-select)
          if (selectedClusters.length > 1) {
            return selectedCommonProject === null;
          }
          // If single cluster, it's multi-select checkboxes
          return selectedProjects.length === 0;
        }
        // On main "Apply to all / Assign specific" selection, can always proceed
        return false;
      }
      
      if (currentStep === 2) {
        // Step 2: Select role
        return selectedRole === null;
      }
      
      return false;
    }
    
    // === ROLES CONTEXT ===
    if (context === 'roles') {
      if (currentStep === 1) {
        // Step 1: Select user or group
        if (selectedIdentityType === 'user') {
          return selectedUser === null;
        } else {
          return selectedGroup === null;
        }
      }
      
      if (currentStep === 2) {
        // Step 2: Select resources (with substeps - same as identities)
        if (showSpecifyClusterSets) {
          return selectedClusterSets.length === 0;
        }
        if (showIncludeClusters) {
          return false; // Can always proceed from cluster scope selection
        }
        if (showSpecifyClusters) {
          return selectedClusters.length === 0;
        }
        if (showIncludeProjects) {
          return false; // Can always proceed from project scope selection
        }
        if (showSpecifyProjects) {
          // If multiple clusters selected, it's common projects (radio/single-select)
          if (selectedClusters.length > 1) {
            return selectedCommonProject === null;
          }
          // If single cluster, it's multi-select checkboxes
          return selectedProjects.length === 0;
        }
        return false;
      }
      
      // Step 3 is Review, no validation needed
      return false;
    }
    
    // === CLUSTERS CONTEXT ===
    // Step 1: Select user or group
    if (currentStep === 1) {
      if (selectedIdentityType === 'user') {
        return selectedUser === null;
      } else {
        return selectedGroup === null;
      }
    }
    
    // Step 2: Select resources
    if (currentStep === 2) {
      // Single cluster context
      if (isSingleClusterContext) {
        // If showing "Specify projects", need at least one project selected
        if (showSpecifyProjects) {
          return selectedProjects.length === 0;
        }
        // If on project scope selection, can always proceed (always has a selection)
        return false;
      }
      
      // Multi-cluster context: original logic
      // If in "Specify clusters" substep
      if (showSpecifyClusters) {
        return selectedClusters.length === 0;
      }
      
      // If in "Include projects" substep, can always proceed
      if (showIncludeProjects) {
        return false;
      }
      
      // If in "Specify projects" substep
      if (showSpecifyProjects) {
        if (selectedClusters.length === 1) {
          // Multi-select projects - need at least one
          return selectedProjects.length === 0;
        } else {
          // Single-select common project - need one selected
          return selectedCommonProject === null;
        }
      }
      
      return false;
    }
    
    // Step 3: Select role
    if (currentStep === 3) {
      return selectedRole === null;
    }
    
    return false;
  };

    return (
      <Modal
        variant={ModalVariant.large}
        isOpen={isOpen}
        onClose={handleClose}
        aria-labelledby="role-assignment-wizard-title"
        style={{ 
          '--pf-v6-c-modal-box--m-body--PaddingTop': '0',
          '--pf-v6-c-modal-box--m-body--PaddingRight': '0',
          '--pf-v6-c-modal-box--m-body--PaddingBottom': '0',
          '--pf-v6-c-modal-box--m-body--PaddingLeft': '0'
        } as React.CSSProperties}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header Section */}
          <div style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '1.5rem', 
            borderBottom: '1px solid #d2d2d2',
            flexShrink: 0
          }}>
            <Title headingLevel="h1" size="2xl" id="role-assignment-wizard-title">
              {`Create role assignment${clusterName ? ` for ${clusterName}` : ''}`}
            </Title>
            <Content component="p" style={{ marginTop: '0.5rem', color: '#6a6e73' }}>
              A role assignment specifies a distinct action users or groups can perform when associated with a particular role.{' '}
              <Button variant="link" isInline component="a" href="#" onClick={(e) => e.preventDefault()}>
                See example of the yaml file and learn more about User management
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
              {context === 'projects' ? (
                // Projects context: Simplified flow - Users/Groups → Roles → Review
                <>
                  {renderStepIndicator(1, 'Select users or groups', false, true)}
                  {renderStepIndicator(2, 'Select role', false, true)}
                  {renderStepIndicator(3, 'Review', false, false)}
                </>
              ) : context === 'identities' ? (
                // Identities context: New flow with cluster sets
                <>
                  {renderStepIndicator(1, 'Select resources', false, true)}
                  {(hasVisitedSpecifyClusterSets || (currentStep === 1 && showSpecifyClusterSets)) && renderStepIndicator(1, 'Specify cluster sets', true, true)}
                  {(hasVisitedIncludeClusters || (currentStep === 1 && showIncludeClusters)) && renderStepIndicator(1, 'Include clusters', true, true)}
                  {(hasVisitedSpecifyClusters || (currentStep === 1 && showSpecifyClusters)) && renderStepIndicator(1, 'Specify clusters', true, true)}
                  {(hasVisitedIncludeProjects || (currentStep === 1 && showIncludeProjects)) && renderStepIndicator(1, 'Include projects', true, true)}
                  {(hasVisitedSpecifyProjects || (currentStep === 1 && showSpecifyProjects)) && renderStepIndicator(1, selectedClusters.length > 1 ? 'Specify common projects' : 'Specify projects', true, false)}
                  {renderStepIndicator(2, 'Select role', false, true)}
                  {renderStepIndicator(3, 'Review', false, false)}
                </>
              ) : context === 'roles' ? (
                // Roles context: User/Group → Resources (cluster sets flow) → Review
                <>
                  {renderStepIndicator(1, 'Select user or group', false, true)}
                  {renderStepIndicator(2, 'Select resources', false, true)}
                  {(hasVisitedSpecifyClusterSets || (currentStep === 2 && showSpecifyClusterSets)) && renderStepIndicator(2, 'Specify cluster sets', true, true)}
                  {(hasVisitedIncludeClusters || (currentStep === 2 && showIncludeClusters)) && renderStepIndicator(2, 'Include clusters', true, true)}
                  {(hasVisitedSpecifyClusters || (currentStep === 2 && showSpecifyClusters)) && renderStepIndicator(2, 'Specify clusters', true, true)}
                  {(hasVisitedIncludeProjects || (currentStep === 2 && showIncludeProjects)) && renderStepIndicator(2, 'Include projects', true, true)}
                  {(hasVisitedSpecifyProjects || (currentStep === 2 && showSpecifyProjects)) && renderStepIndicator(2, selectedClusters.length > 1 ? 'Specify common projects' : 'Specify projects', true, false)}
                  {renderStepIndicator(3, 'Review', false, false)}
                </>
              ) : clusterName ? (
                // Single cluster context: Show simplified steps without cluster selection
                <>
                  {renderStepIndicator(1, 'Select user or group', false, true)}
                  {renderStepIndicator(2, 'Select resources', false, true)}
                  {(hasVisitedSpecifyProjects || (currentStep === 2 && showSpecifyProjects)) && renderStepIndicator(2, 'Specify projects', true, false)}
                  {renderStepIndicator(3, 'Select role', false, true)}
                  {renderStepIndicator(4, 'Review', false, false)}
                </>
              ) : (
                // Cluster set context: OPTION B - Show sub-steps with breadcrumb progression
                <>
                  {renderStepIndicator(1, 'Select user or group', false, true)}
                  {renderStepIndicator(2, 'Select resources', false, true)}
                  
                  {/* SUB-STEP 1: Choose resource scope - Always visible when on step 2 */}
                  {currentStep === 2 && (
                    <>
                      {/* Show initial selection screen as a sub-step */}
                      {!showSpecifyClusters && !showIncludeProjects && !showSpecifyProjects ? (
                        renderStepIndicator(2, clusterSetScope === 'all' ? 'Everything in cluster set' : 'Choose resource scope', true, true)
                      ) : (
                        // Show as visited if we're past this step
                        clusterSetScope === 'specific' && renderStepIndicator(2, 'Choose resource scope', true, true)
                      )}
                      
                      {/* SUB-STEP 2: Select clusters - Show if "Cluster or Clusters" was chosen */}
                      {clusterSetScope === 'specific' && (
                        <>
                          {showSpecifyClusters && !showIncludeProjects && !showSpecifyProjects ? (
                            renderStepIndicator(2, 'Select clusters', true, true)
                          ) : (selectedClusters.length > 0 || showIncludeProjects || showSpecifyProjects) && (
                            renderStepIndicator(2, 'Select clusters', true, true)
                          )}
                          
                          {/* SUB-STEP 3: Define cluster scope - Show if clusters were selected */}
                          {selectedClusters.length > 0 && (
                            <>
                              {showIncludeProjects && !showSpecifyProjects ? (
                                renderStepIndicator(2, 
                                  selectedClusters.length === 1 
                                    ? (clusterScope === 'everything' ? 'Full cluster access' : 'Choose: Full cluster or specific projects')
                                    : (clusterScope === 'everything' ? 'Full access on all clusters' : 'Choose: Full access or common projects'),
                                  true, 
                                  true
                                )
                              ) : clusterScope === 'narrow-down' && showSpecifyProjects && (
                                renderStepIndicator(2, 
                                  selectedClusters.length === 1 
                                    ? 'Full cluster or specific projects'
                                    : 'Full access or common projects',
                                  true, 
                                  true
                                )
                              )}
                              
                              {/* SUB-STEP 4: Select projects - Show if "narrow down" was chosen */}
                              {clusterScope === 'narrow-down' && showSpecifyProjects && (
                                renderStepIndicator(2, 
                                  selectedClusters.length === 1 
                                    ? 'Select specific projects' 
                                    : 'Select common projects', 
                                  true, 
                                  false
                                )
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                  
                  {renderStepIndicator(3, 'Select role', false, true)}
                  {renderStepIndicator(4, 'Review', false, false)}
                </>
              )}
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
                {getCurrentStepContent()}
              </div>
              
              {/* Footer with Buttons - only spans right content area */}
              <div style={{ 
                borderTop: '1px solid #d2d2d2', 
                padding: '1rem 1.5rem', 
                backgroundColor: '#ffffff',
                flexShrink: 0
              }}>
                {((context === 'projects' && currentStep > 1) ||
                  (context === 'identities' && (currentStep > 1 || showSpecifyClusterSets || showIncludeClusters || showSpecifyClusters || showIncludeProjects || showSpecifyProjects)) || 
                  (context === 'roles' && (currentStep > 1 || showSpecifyClusterSets || showIncludeClusters || showSpecifyClusters || showIncludeProjects || showSpecifyProjects)) || 
                  (context === 'clusters' && currentStep > 1)) && (
                  <Button variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                )}{' '}
                {((context === 'projects' && currentStep < 3) ||
                  (context === 'identities' && currentStep < 3) || 
                  (context === 'roles' && currentStep < 3) || 
                  (context === 'clusters' && currentStep < 4)) ? (
                  <Button variant="primary" onClick={handleNext} isDisabled={isNextButtonDisabled()}>
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
      </Modal>
  );
};

export { RoleAssignmentWizard };
