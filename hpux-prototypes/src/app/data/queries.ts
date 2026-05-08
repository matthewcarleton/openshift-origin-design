// Query Helper Functions for Mock Database

import {
  clusterSets,
  clusters,
  namespaces,
  virtualMachines,
  users,
  groups,
  serviceAccounts,
  identityProviders,
  roles,
  roleBindings,
  instanceTypes,
  templates,
  migrationPlans,
} from './mockDatabase';

// ============================================================================
// CLUSTER SET QUERIES
// ============================================================================

export const getAllClusterSets = () => clusterSets;

export const getClusterSetById = (id: string) => 
  clusterSets.find(cs => cs.id === id);

export const getClusterSetsByRegion = (region: string) =>
  clusterSets.filter(cs => cs.region === region);

export const getClusterSetsByType = (type: 'production' | 'development' | 'staging') =>
  clusterSets.filter(cs => cs.type === type);

// ============================================================================
// CLUSTER QUERIES
// ============================================================================

export const getAllClusters = () => clusters;

export const getClusterById = (id: string) =>
  clusters.find(c => c.id === id);

export const getClustersByClusterSet = (clusterSetId: string) =>
  clusters.filter(c => c.clusterSetId === clusterSetId);

export const getClustersByRegion = (region: string) =>
  clusters.filter(c => c.region === region);

export const getClustersByStatus = (status: string) =>
  clusters.filter(c => c.status === status);

// ============================================================================
// NAMESPACE QUERIES
// ============================================================================

export const getAllNamespaces = () => namespaces;

export const getNamespaceById = (id: string) =>
  namespaces.find(ns => ns.id === id);

export const getNamespacesByCluster = (clusterId: string) =>
  namespaces.filter(ns => ns.clusterId === clusterId);

export const getNamespacesByType = (type: string) =>
  namespaces.filter(ns => ns.type === type);

export const createNamespace = (namespace: Omit<import('./schemas/infrastructure').Namespace, 'id'>) => {
  const id = `namespace-${Date.now()}`;
  const newNamespace: import('./schemas/infrastructure').Namespace = {
    id,
    ...namespace,
  };
  namespaces.push(newNamespace);
  return newNamespace;
};

// ============================================================================
// VIRTUAL MACHINE QUERIES
// ============================================================================

export const getAllVirtualMachines = () => virtualMachines;

export const getVirtualMachineById = (id: string) =>
  virtualMachines.find(vm => vm.id === id);

export const getVirtualMachinesByCluster = (clusterId: string) =>
  virtualMachines.filter(vm => vm.clusterId === clusterId);

export const getVirtualMachinesByNamespace = (namespaceId: string) =>
  virtualMachines.filter(vm => vm.namespaceId === namespaceId);

export const getVirtualMachinesByStatus = (status: string) =>
  virtualMachines.filter(vm => vm.status === status);

export const getVirtualMachinesByOS = (os: string) =>
  virtualMachines.filter(vm => vm.os === os);

export const getVirtualMachinesByClusterSet = (clusterSetId: string) => {
  const clusterSet = getClusterSetById(clusterSetId);
  if (!clusterSet) return [];
  return virtualMachines.filter(vm => clusterSet.clusterIds.includes(vm.clusterId));
};

// ============================================================================
// USER QUERIES
// ============================================================================

export const getAllUsers = () => users;

export const getUserById = (id: string) =>
  users.find(u => u.id === id);

export const getUserByUsername = (username: string) =>
  users.find(u => u.username === username);

export const getUsersByGroup = (groupId: string) =>
  users.filter(u => u.groupIds.includes(groupId));

export const getUsersByStatus = (status: 'Active' | 'Inactive') =>
  users.filter(u => u.status === status);

// ============================================================================
// GROUP QUERIES
// ============================================================================

export const getAllGroups = () => groups;

export const getGroupById = (id: string) =>
  groups.find(g => g.id === id);

export const getGroupByName = (name: string) =>
  groups.find(g => g.name === name);

export const getGroupsByType = (type: string) =>
  groups.filter(g => g.type === type);

export const getGroupsForUser = (userId: string) =>
  groups.filter(g => g.userIds.includes(userId));

export const getUsersByIdentityProvider = (identityProviderId: string) =>
  users.filter(u => u.identityProviderId === identityProviderId);

// ============================================================================
// SERVICE ACCOUNT QUERIES
// ============================================================================

export const getAllServiceAccounts = () => serviceAccounts;

export const getServiceAccountById = (id: string) =>
  serviceAccounts.find(sa => sa.id === id);

export const getServiceAccountsByNamespace = (namespace: string) =>
  serviceAccounts.filter(sa => sa.namespace === namespace);

// ============================================================================
// IDENTITY PROVIDER QUERIES
// ============================================================================

export const getAllIdentityProviders = () => identityProviders;

export const getIdentityProviderById = (id: string) =>
  identityProviders.find(idp => idp.id === id);

export const getIdentityProvidersByStatus = (status: 'Active' | 'Inactive') =>
  identityProviders.filter(idp => idp.status === status);

export const getIdentityProvidersByType = (type: string) =>
  identityProviders.filter(idp => idp.type === type);

export const getClustersByIdentityProvider = (identityProviderId: string) => {
  const provider = identityProviders.find(idp => idp.id === identityProviderId);
  if (!provider) return [];
  return clusters.filter(c => provider.clusterIds.includes(c.id));
};

// ============================================================================
// ROLE QUERIES
// ============================================================================

export const getAllRoles = () => roles;

export const getRoleById = (id: string) =>
  roles.find(r => r.id === id);

export const getRoleByName = (name: string) =>
  roles.find(r => r.name === name);

export const getRolesByType = (type: 'default' | 'custom') =>
  roles.filter(r => r.type === type);

export const getRolesByCategory = (category: string) =>
  roles.filter(r => r.category === category);

// ============================================================================
// ROLE BINDING QUERIES
// ============================================================================

export const getAllRoleBindings = () => roleBindings;

export const getRoleBindingById = (id: string) =>
  roleBindings.find(rb => rb.id === id);

export const getRoleBindingsByRole = (roleId: string) =>
  roleBindings.filter(rb => rb.roleId === roleId);

export const getRoleBindingsBySubject = (subjectId: string) =>
  roleBindings.filter(rb => rb.subjectId === subjectId);

export const getRoleBindingsByScope = (scopeId: string) =>
  roleBindings.filter(rb => rb.scopeId === scopeId);

// ============================================================================
// INSTANCE TYPE & TEMPLATE QUERIES
// ============================================================================

export const getAllInstanceTypes = () => instanceTypes;

export const getInstanceTypeById = (id: string) =>
  instanceTypes.find(it => it.id === id);

export const getAllTemplates = () => templates;

export const getTemplateById = (id: string) =>
  templates.find(t => t.id === id);

export const getTemplatesByOS = (os: string) =>
  templates.filter(t => t.os.includes(os));

// ============================================================================
// COMPLEX QUERIES (combining multiple data sources)
// ============================================================================

export const getClusterWithDetails = (clusterId: string) => {
  const cluster = getClusterById(clusterId);
  if (!cluster) return null;
  
  return {
    ...cluster,
    clusterSet: getClusterSetById(cluster.clusterSetId),
    namespaces: getNamespacesByCluster(clusterId),
    virtualMachines: getVirtualMachinesByCluster(clusterId),
  };
};

export const getNamespaceWithDetails = (namespaceId: string) => {
  const namespace = getNamespaceById(namespaceId);
  if (!namespace) return null;
  
  return {
    ...namespace,
    cluster: getClusterById(namespace.clusterId),
    virtualMachines: getVirtualMachinesByNamespace(namespaceId),
  };
};

export const getUserWithDetails = (userId: string) => {
  const user = getUserById(userId);
  if (!user) return null;
  
  return {
    ...user,
    groups: user.groupIds.map(gid => getGroupById(gid)).filter(Boolean),
    roleBindings: getRoleBindingsBySubject(userId),
  };
};

export const getGroupWithDetails = (groupId: string) => {
  const group = getGroupById(groupId);
  if (!group) return null;
  
  return {
    ...group,
    users: group.userIds.map(uid => getUserById(uid)).filter(Boolean),
    roleBindings: getRoleBindingsBySubject(groupId),
  };
};

// ============================================================================
// STATISTICS QUERIES
// ============================================================================

export const getStatistics = () => {
  return {
    totalClusterSets: clusterSets.length,
    totalClusters: clusters.length,
    totalNamespaces: namespaces.length,
    totalVirtualMachines: virtualMachines.length,
    totalUsers: users.length,
    totalGroups: groups.length,
    totalServiceAccounts: serviceAccounts.length,
    totalRoles: roles.length,
    vmsByStatus: {
      running: virtualMachines.filter(vm => vm.status === 'Running').length,
      stopped: virtualMachines.filter(vm => vm.status === 'Stopped').length,
      error: virtualMachines.filter(vm => vm.status === 'Error').length,
      paused: virtualMachines.filter(vm => vm.status === 'Paused').length,
    },
    clustersByRegion: {
      northAmerica: clusters.filter(c => c.region === 'North America').length,
      europe: clusters.filter(c => c.region === 'Europe').length,
      southAmerica: clusters.filter(c => c.region === 'South America').length,
      asiaPacific: clusters.filter(c => c.region === 'Asia-Pacific').length,
    },
  };
};

// ============================================================================
// MIGRATION PLAN QUERIES
// ============================================================================

export const getAllMigrationPlans = () => migrationPlans;

export const getMigrationPlanById = (id: string) =>
  migrationPlans.find(mp => mp.id === id);

export const getMigrationPlansByStatus = (status: string) =>
  migrationPlans.filter(mp => mp.status === status);

export const createMigrationPlan = (plan: Omit<import('./schemas/virtualization').MigrationPlan, 'id'>) => {
  const id = `migration-plan-${Date.now()}`;
  const newPlan: import('./schemas/virtualization').MigrationPlan = {
    id,
    ...plan,
  };
  migrationPlans.push(newPlan);
  return newPlan;
};

export const updateMigrationPlan = (id: string, updates: Partial<import('./schemas/virtualization').MigrationPlan>) => {
  const index = migrationPlans.findIndex(mp => mp.id === id);
  if (index !== -1) {
    migrationPlans[index] = { ...migrationPlans[index], ...updates };
    return migrationPlans[index];
  }
  return null;
};

