// Single Cluster Database - For single-cluster scenarios
// Contains data for one cluster (hub-cluster) with all related resources

import {
  ClusterSet,
  Cluster,
  Namespace,
} from './schemas/infrastructure';
import {
  VirtualMachine,
  InstanceType,
  Template,
  MigrationPlan,
} from './schemas/virtualization';
import {
  User,
  Group,
  ServiceAccount,
  IdentityProvider,
} from './schemas/identity';
import {
  Role,
  RoleBinding,
} from './schemas/access';

// ============================================================================
// SINGLE CLUSTER SET (for single cluster scenarios)
// ============================================================================

export const clusterSets: ClusterSet[] = [
  {
    id: 'cs-single',
    name: 'single-cluster-set',
    description: 'Single Cluster Set',
    region: 'North America',
    type: 'production',
    clusterIds: ['cluster-hub'],
  },
];

// ============================================================================
// SINGLE CLUSTER
// ============================================================================

export const clusters: Cluster[] = [
  {
    id: 'cluster-hub',
    name: 'hub-cluster',
    clusterSetId: 'cs-single',
    status: 'Ready',
    kubernetesVersion: '1.29.2',
    region: 'North America',
    location: 'US Central',
    nodes: 8,
    namespaceIds: [
      'ns-hub-acm',
      'ns-hub-openshift-marketplace',
      'ns-hub-openshift-operators',
      'ns-hub-monitoring',
      'ns-hub-logging',
      'ns-hub-multicluster-engine',
      'ns-hub-ansible-automation',
      'ns-hub-argo-cd',
      'ns-hub-gitops',
      'ns-hub-policies',
      'ns-hub-apps',
      'ns-hub-dev-team',
      'ns-hub-qa-team',
      'ns-hub-demo-apps',
      'ns-hub-backup-restore',
    ],
  },
];

// ============================================================================
// NAMESPACES (for hub cluster only)
// ============================================================================

export const namespaces: Namespace[] = [
  { id: 'ns-hub-acm', name: 'open-cluster-management', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'acm' } },
  { id: 'ns-hub-openshift-marketplace', name: 'openshift-marketplace', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'marketplace' } },
  { id: 'ns-hub-openshift-operators', name: 'openshift-operators', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'operators' } },
  { id: 'ns-hub-monitoring', name: 'openshift-monitoring', clusterId: 'cluster-hub', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-hub-logging', name: 'openshift-logging', clusterId: 'cluster-hub', type: 'monitoring', labels: { env: 'prod', app: 'logging' } },
  { id: 'ns-hub-multicluster-engine', name: 'multicluster-engine', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'mce' } },
  { id: 'ns-hub-ansible-automation', name: 'ansible-automation-platform', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'ansible' } },
  { id: 'ns-hub-argo-cd', name: 'openshift-gitops', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'gitops' } },
  { id: 'ns-hub-gitops', name: 'gitops', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'gitops' } },
  { id: 'ns-hub-policies', name: 'open-cluster-management-policies', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'policies' } },
  { id: 'ns-hub-apps', name: 'apps', clusterId: 'cluster-hub', type: 'application', labels: { env: 'prod', app: 'applications' } },
  { id: 'ns-hub-dev-team', name: 'dev-team', clusterId: 'cluster-hub', type: 'development', labels: { env: 'dev', app: 'development' } },
  { id: 'ns-hub-qa-team', name: 'qa-team', clusterId: 'cluster-hub', type: 'development', labels: { env: 'qa', app: 'testing' } },
  { id: 'ns-hub-demo-apps', name: 'demo-apps', clusterId: 'cluster-hub', type: 'application', labels: { env: 'demo', app: 'demos' } },
  { id: 'ns-hub-backup-restore', name: 'backup-restore', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'backup' } },
];

// ============================================================================
// VIRTUAL MACHINES (for hub cluster only - sample of 50 VMs)
// ============================================================================

export const virtualMachines: VirtualMachine[] = [
  // Monitoring VMs
  { id: 'vm-hub-mon-01', name: 'prometheus-server', namespaceId: 'ns-hub-monitoring', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.10', node: 'node-1', created: '2024-01-15T10:00:00Z' },
  { id: 'vm-hub-mon-02', name: 'grafana-dashboard', namespaceId: 'ns-hub-monitoring', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-15T10:05:00Z' },
  { id: 'vm-hub-mon-03', name: 'alertmanager', namespaceId: 'ns-hub-monitoring', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-15T10:10:00Z' },
  
  // Logging VMs
  { id: 'vm-hub-log-01', name: 'elasticsearch-master', namespaceId: 'ns-hub-logging', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 8, memory: '16 GiB', storage: '500 GiB', ipAddress: '10.0.1.16', node: 'node-1', created: '2024-01-15T11:00:00Z' },
  { id: 'vm-hub-log-02', name: 'kibana-dashboard', namespaceId: 'ns-hub-logging', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-15T11:05:00Z' },
  { id: 'vm-hub-log-03', name: 'logstash-processor', namespaceId: 'ns-hub-logging', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '200 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-15T11:10:00Z' },
  
  // ACM VMs
  { id: 'vm-hub-acm-01', name: 'acm-hub-operator', namespaceId: 'ns-hub-acm', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-10T09:00:00Z' },
  { id: 'vm-hub-acm-02', name: 'acm-grc-policy', namespaceId: 'ns-hub-acm', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-10T09:05:00Z' },
  { id: 'vm-hub-acm-03', name: 'acm-work-manager', namespaceId: 'ns-hub-acm', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-10T09:10:00Z' },
  
  // GitOps VMs
  { id: 'vm-hub-gitops-01', name: 'argo-cd-server', namespaceId: 'ns-hub-argo-cd', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-12T08:00:00Z' },
  { id: 'vm-hub-gitops-02', name: 'argo-cd-repo-server', namespaceId: 'ns-hub-argo-cd', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '100 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-12T08:05:00Z' },
  { id: 'vm-hub-gitops-03', name: 'argo-cd-application-controller', namespaceId: 'ns-hub-argo-cd', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '50 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-12T08:10:00Z' },
  
  // Application VMs
  { id: 'vm-hub-app-01', name: 'web-app-frontend', namespaceId: 'ns-hub-apps', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-20T10:00:00Z' },
  { id: 'vm-hub-app-02', name: 'web-app-backend', namespaceId: 'ns-hub-apps', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-20T10:05:00Z' },
  { id: 'vm-hub-app-03', name: 'web-app-database', namespaceId: 'ns-hub-apps', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 8, memory: '16 GiB', storage: '500 GiB', ipAddress: '10.0.1.16', node: 'node-1', created: '2024-01-20T10:10:00Z' },
  { id: 'vm-hub-app-04', name: 'api-gateway', namespaceId: 'ns-hub-apps', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-20T10:15:00Z' },
  { id: 'vm-hub-app-05', name: 'cache-redis', namespaceId: 'ns-hub-apps', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-20T10:20:00Z' },
  
  // Development VMs
  { id: 'vm-hub-dev-01', name: 'dev-jenkins', namespaceId: 'ns-hub-dev-team', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '200 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-18T09:00:00Z' },
  { id: 'vm-hub-dev-02', name: 'dev-gitlab', namespaceId: 'ns-hub-dev-team', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '300 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-18T09:05:00Z' },
  { id: 'vm-hub-dev-03', name: 'dev-nexus', namespaceId: 'ns-hub-dev-team', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '500 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-18T09:10:00Z' },
  { id: 'vm-hub-dev-04', name: 'dev-test-runner', namespaceId: 'ns-hub-dev-team', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-18T09:15:00Z' },
  
  // QA VMs
  { id: 'vm-hub-qa-01', name: 'qa-test-env', namespaceId: 'ns-hub-qa-team', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-19T08:00:00Z' },
  { id: 'vm-hub-qa-02', name: 'qa-selenium-grid', namespaceId: 'ns-hub-qa-team', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-19T08:05:00Z' },
  { id: 'vm-hub-qa-03', name: 'qa-performance-test', namespaceId: 'ns-hub-qa-team', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 8, memory: '16 GiB', storage: '200 GiB', ipAddress: '10.0.1.16', node: 'node-1', created: '2024-01-19T08:10:00Z' },
  
  // Demo VMs
  { id: 'vm-hub-demo-01', name: 'demo-app-1', namespaceId: 'ns-hub-demo-apps', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-21T10:00:00Z' },
  { id: 'vm-hub-demo-02', name: 'demo-app-2', namespaceId: 'ns-hub-demo-apps', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-21T10:05:00Z' },
  { id: 'vm-hub-demo-03', name: 'demo-app-3', namespaceId: 'ns-hub-demo-apps', clusterId: 'cluster-hub', status: 'Stopped', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', ipAddress: '10.0.1.4', node: 'node-1', created: '2024-01-21T10:10:00Z' },
  
  // Backup VMs
  { id: 'vm-hub-backup-01', name: 'backup-server', namespaceId: 'ns-hub-backup-restore', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 8, memory: '16 GiB', storage: '2000 GiB', ipAddress: '10.0.1.16', node: 'node-1', created: '2024-01-16T09:00:00Z' },
  { id: 'vm-hub-backup-02', name: 'restore-server', namespaceId: 'ns-hub-backup-restore', clusterId: 'cluster-hub', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '8 GiB', storage: '1000 GiB', ipAddress: '10.0.1.8', node: 'node-1', created: '2024-01-16T09:05:00Z' },
];

// ============================================================================
// USERS (sample of 20 users)
// ============================================================================

export const users: User[] = [
  { id: 'user-single-01', username: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', status: 'Active', groupIds: ['group-admins'], identityProviderId: 'idp-001', created: '2024-01-01T00:00:00Z', lastLogin: '2025-01-15T10:00:00Z' },
  { id: 'user-single-02', username: 'dev.user', firstName: 'Dev', lastName: 'User', email: 'dev@example.com', status: 'Active', groupIds: ['group-developers'], identityProviderId: 'idp-001', created: '2024-01-02T00:00:00Z', lastLogin: '2025-01-15T09:00:00Z' },
  { id: 'user-single-03', username: 'ops.user', firstName: 'Ops', lastName: 'User', email: 'ops@example.com', status: 'Active', groupIds: ['group-operators'], identityProviderId: 'idp-001', created: '2024-01-03T00:00:00Z', lastLogin: '2025-01-15T08:00:00Z' },
  { id: 'user-single-04', username: 'qa.user', firstName: 'QA', lastName: 'User', email: 'qa@example.com', status: 'Active', groupIds: ['group-qa'], identityProviderId: 'idp-001', created: '2024-01-04T00:00:00Z', lastLogin: '2025-01-14T17:00:00Z' },
  { id: 'user-single-05', username: 'viewer.user', firstName: 'Viewer', lastName: 'User', email: 'viewer@example.com', status: 'Active', groupIds: ['group-viewers'], identityProviderId: 'idp-001', created: '2024-01-05T00:00:00Z', lastLogin: '2025-01-14T16:00:00Z' },
];

// ============================================================================
// GROUPS
// ============================================================================

export const groups: Group[] = [
  { id: 'group-admins', name: 'admins', description: 'Administrators', type: 'team', userIds: ['user-single-01'] },
  { id: 'group-developers', name: 'developers', description: 'Development Team', type: 'team', userIds: ['user-single-02'] },
  { id: 'group-operators', name: 'operators', description: 'Operations Team', type: 'team', userIds: ['user-single-03'] },
  { id: 'group-qa', name: 'qa', description: 'QA Team', type: 'team', userIds: ['user-single-04'] },
  { id: 'group-viewers', name: 'viewers', description: 'View Only Users', type: 'team', userIds: ['user-single-05'] },
];

// ============================================================================
// SERVICE ACCOUNTS
// ============================================================================

export const serviceAccounts: ServiceAccount[] = [
  { id: 'sa-hub-ci-cd', name: 'ci-cd-automation', namespace: 'ns-hub-dev-team', description: 'CI/CD automation service account', created: '2024-01-10T00:00:00Z' },
  { id: 'sa-hub-monitoring', name: 'monitoring-agent', namespace: 'ns-hub-monitoring', description: 'Monitoring agent service account', created: '2024-01-10T00:00:00Z' },
  { id: 'sa-hub-backup', name: 'backup-service', namespace: 'ns-hub-backup-restore', description: 'Backup service account', created: '2024-01-10T00:00:00Z' },
];

// ============================================================================
// IDENTITY PROVIDERS
// ============================================================================

export const identityProviders: IdentityProvider[] = [
  { id: 'idp-001', name: 'LDAP', type: 'LDAP', status: 'Active', description: 'LDAP Identity Provider', clusterIds: ['cluster-hub'] },
];

// ============================================================================
// ROLES
// ============================================================================

export const roles: Role[] = [
  { id: 'role-admin', name: 'kubevirt-admin', displayName: 'KubeVirt Admin', type: 'default', category: 'kubevirt', description: 'Full administrative access to virtual machines', permissions: ['*'] },
  { id: 'role-edit', name: 'kubevirt-edit', displayName: 'KubeVirt Edit', type: 'default', category: 'kubevirt', description: 'Edit access to virtual machines', permissions: ['create', 'update', 'delete'] },
  { id: 'role-view', name: 'kubevirt-view', displayName: 'KubeVirt View', type: 'default', category: 'kubevirt', description: 'View-only access to virtual machines', permissions: ['read'] },
];

// ============================================================================
// ROLE BINDINGS
// ============================================================================

export const roleBindings: RoleBinding[] = [
  { id: 'rb-admin-01', roleId: 'role-admin', subjectType: 'user', subjectId: 'user-single-01', scope: 'cluster', scopeId: 'cluster-hub' },
  { id: 'rb-dev-01', roleId: 'role-edit', subjectType: 'group', subjectId: 'group-developers', scope: 'namespace', scopeId: 'ns-hub-dev-team' },
  { id: 'rb-viewer-01', roleId: 'role-view', subjectType: 'group', subjectId: 'group-viewers', scope: 'cluster', scopeId: 'cluster-hub' },
];

// ============================================================================
// INSTANCE TYPES
// ============================================================================

export const instanceTypes: InstanceType[] = [
  { id: 'it-small', name: 'small', cpu: 2, memory: '4 GiB', description: 'Small instance type with 2 CPU cores and 4 GiB memory' },
  { id: 'it-medium', name: 'medium', cpu: 4, memory: '8 GiB', description: 'Medium instance type with 4 CPU cores and 8 GiB memory' },
  { id: 'it-large', name: 'large', cpu: 8, memory: '16 GiB', description: 'Large instance type with 8 CPU cores and 16 GiB memory' },
  { id: 'it-xlarge', name: 'xlarge', cpu: 16, memory: '32 GiB', description: 'Extra large instance type with 16 CPU cores and 32 GiB memory' },
];

// ============================================================================
// TEMPLATES
// ============================================================================

export const templates: Template[] = [
  { id: 'tpl-rhel9', name: 'RHEL 9', os: 'RHEL 9', cpu: 2, memory: '4 GiB', storage: '50 GiB', description: 'Red Hat Enterprise Linux 9 template' },
  { id: 'tpl-rhel8', name: 'RHEL 8', os: 'RHEL 8', cpu: 2, memory: '4 GiB', storage: '50 GiB', description: 'Red Hat Enterprise Linux 8 template' },
  { id: 'tpl-fedora', name: 'Fedora', os: 'Fedora', cpu: 2, memory: '4 GiB', storage: '50 GiB', description: 'Fedora Linux template' },
  { id: 'tpl-ubuntu', name: 'Ubuntu', os: 'Ubuntu', cpu: 2, memory: '4 GiB', storage: '50 GiB', description: 'Ubuntu Linux template' },
];

// ============================================================================
// MIGRATION PLANS
// ============================================================================

export const migrationPlans: MigrationPlan[] = [];

// ============================================================================
// EXPORT SINGLE CLUSTER DATABASE
// ============================================================================

export const singleClusterDatabase = {
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
};

export default singleClusterDatabase;

