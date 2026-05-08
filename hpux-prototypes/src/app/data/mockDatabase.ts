// Mock Database - Single Source of Truth for all application data

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
// CLUSTER SETS
// ============================================================================

export const clusterSets: ClusterSet[] = [
  {
    id: 'cs-na-prod',
    name: 'petemobile-na-prod',
    description: 'North America Production Clusters',
    region: 'North America',
    type: 'production',
    clusterIds: ['cluster-us-west-prod-01', 'cluster-us-east-prod-02', 'cluster-na-edge-ny-01'],
  },
  {
    id: 'cs-eu-prod',
    name: 'petemobile-eu-prod',
    description: 'Europe Production Clusters',
    region: 'Europe',
    type: 'production',
    clusterIds: ['cluster-eu-west-prod-01', 'cluster-eu-east-prod-02', 'cluster-eu-edge-berlin-01'],
  },
  {
    id: 'cs-sa-prod',
    name: 'petemobile-sa-prod',
    description: 'South America Production Clusters',
    region: 'South America',
    type: 'production',
    clusterIds: [
      'cluster-sa-prod-brazil-01',
      'cluster-sa-prod-argentina-02',
      'cluster-sa-prod-chile-03',
      'cluster-sa-prod-colombia-04',
      'cluster-sa-prod-peru-05',
    ],
  },
  {
    id: 'cs-apac-prod',
    name: 'petemobile-apac-prod',
    description: 'Asia-Pacific Production Clusters',
    region: 'Asia-Pacific',
    type: 'production',
    clusterIds: [
      'cluster-apac-prod-japan-01',
      'cluster-apac-prod-korea-02',
      'cluster-apac-prod-australia-03',
      'cluster-apac-prod-singapore-04',
      'cluster-apac-prod-india-05',
    ],
  },
  {
    id: 'cs-dev',
    name: 'petemobile-dev-clusters',
    description: 'Development and QA Clusters',
    region: 'North America',
    type: 'development',
    clusterIds: ['cluster-dev-team-a', 'cluster-dev-team-b', 'cluster-qa-env'],
  },
];

// ============================================================================
// CLUSTERS
// ============================================================================

export const clusters: Cluster[] = [
  // Hub Cluster - The central ACM management cluster
  {
    id: 'cluster-hub',
    name: 'hub-cluster',
    clusterSetId: 'cs-na-prod',
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
  // North America Production
  {
    id: 'cluster-us-west-prod-01',
    name: 'us-west-prod-01',
    clusterSetId: 'cs-na-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'North America',
    location: 'US West',
    nodes: 45,
    namespaceIds: ['ns-core-ntwk-usw01', 'ns-5g-api-prod-usw01', 'ns-data-analytics-usw01'],
  },
  {
    id: 'cluster-us-east-prod-02',
    name: 'us-east-prod-02',
    clusterSetId: 'cs-na-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'North America',
    location: 'US East',
    nodes: 52,
    namespaceIds: ['ns-core-billing-use02', 'ns-security-ops-use02', 'ns-log-viewer-use02'],
  },
  {
    id: 'cluster-na-edge-ny-01',
    name: 'na-edge-ny-01',
    clusterSetId: 'cs-na-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'North America',
    location: 'New York Edge',
    nodes: 18,
    namespaceIds: ['ns-edge-core-app-ny01', 'ns-location-services-ny01'],
  },

  // Europe Production
  {
    id: 'cluster-eu-west-prod-01',
    name: 'eu-west-prod-01',
    clusterSetId: 'cs-eu-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Europe',
    location: 'EU West',
    nodes: 48,
    namespaceIds: ['ns-core-ntwk-euw01', 'ns-eu-5g-api-euw01', 'ns-data-analytics-euw01'],
  },
  {
    id: 'cluster-eu-east-prod-02',
    name: 'eu-east-prod-02',
    clusterSetId: 'cs-eu-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Europe',
    location: 'EU East',
    nodes: 44,
    namespaceIds: ['ns-core-billing-eue02', 'ns-security-ops-eue02', 'ns-log-viewer-eue02'],
  },
  {
    id: 'cluster-eu-edge-berlin-01',
    name: 'eu-edge-berlin-01',
    clusterSetId: 'cs-eu-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Europe',
    location: 'Berlin Edge',
    nodes: 20,
    namespaceIds: ['ns-edge-core-app-ber01', 'ns-location-services-ber01'],
  },

  // South America Production
  {
    id: 'cluster-sa-prod-brazil-01',
    name: 'sa-prod-brazil-01',
    clusterSetId: 'cs-sa-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'South America',
    location: 'Brazil',
    nodes: 38,
    namespaceIds: ['ns-core-network-sa-br01', 'ns-billing-api-br01', 'ns-customer-data-br01', 'ns-monitor-tools-br01', 'ns-db-service-br01'],
  },
  {
    id: 'cluster-sa-prod-argentina-02',
    name: 'sa-prod-argentina-02',
    clusterSetId: 'cs-sa-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'South America',
    location: 'Argentina',
    nodes: 35,
    namespaceIds: ['ns-core-network-sa-ar02', 'ns-billing-api-ar02', 'ns-customer-data-ar02', 'ns-monitor-tools-ar02', 'ns-db-service-ar02'],
  },
  {
    id: 'cluster-sa-prod-chile-03',
    name: 'sa-prod-chile-03',
    clusterSetId: 'cs-sa-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'South America',
    location: 'Chile',
    nodes: 32,
    namespaceIds: ['ns-core-network-sa-cl03', 'ns-billing-api-cl03', 'ns-customer-data-cl03', 'ns-monitor-tools-cl03', 'ns-db-service-cl03'],
  },
  {
    id: 'cluster-sa-prod-colombia-04',
    name: 'sa-prod-colombia-04',
    clusterSetId: 'cs-sa-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'South America',
    location: 'Colombia',
    nodes: 30,
    namespaceIds: ['ns-core-network-sa-co04', 'ns-billing-api-co04', 'ns-customer-data-co04', 'ns-monitor-tools-co04', 'ns-db-service-co04'],
  },
  {
    id: 'cluster-sa-prod-peru-05',
    name: 'sa-prod-peru-05',
    clusterSetId: 'cs-sa-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'South America',
    location: 'Peru',
    nodes: 28,
    namespaceIds: ['ns-core-network-sa-pe05', 'ns-billing-api-pe05', 'ns-customer-data-pe05', 'ns-monitor-tools-pe05', 'ns-db-service-pe05'],
  },

  // Asia-Pacific Production
  {
    id: 'cluster-apac-prod-japan-01',
    name: 'apac-prod-japan-01',
    clusterSetId: 'cs-apac-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Asia-Pacific',
    location: 'Japan',
    nodes: 50,
    namespaceIds: ['ns-core-network-apac-jp01', 'ns-billing-api-apac-jp01', 'ns-customer-data-jp01', 'ns-monitor-tools-jp01', 'ns-db-service-jp01'],
  },
  {
    id: 'cluster-apac-prod-korea-02',
    name: 'apac-prod-korea-02',
    clusterSetId: 'cs-apac-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Asia-Pacific',
    location: 'Korea',
    nodes: 46,
    namespaceIds: ['ns-core-network-apac-kr02', 'ns-billing-api-apac-kr02', 'ns-customer-data-kr02', 'ns-monitor-tools-kr02', 'ns-db-service-kr02'],
  },
  {
    id: 'cluster-apac-prod-australia-03',
    name: 'apac-prod-australia-03',
    clusterSetId: 'cs-apac-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Asia-Pacific',
    location: 'Australia',
    nodes: 42,
    namespaceIds: ['ns-core-network-apac-au03', 'ns-billing-api-apac-au03', 'ns-customer-data-au03', 'ns-monitor-tools-au03', 'ns-db-service-au03'],
  },
  {
    id: 'cluster-apac-prod-singapore-04',
    name: 'apac-prod-singapore-04',
    clusterSetId: 'cs-apac-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Asia-Pacific',
    location: 'Singapore',
    nodes: 48,
    namespaceIds: ['ns-core-network-apac-sg04', 'ns-billing-api-apac-sg04', 'ns-customer-data-sg04', 'ns-monitor-tools-sg04', 'ns-db-service-sg04'],
  },
  {
    id: 'cluster-apac-prod-india-05',
    name: 'apac-prod-india-05',
    clusterSetId: 'cs-apac-prod',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'Asia-Pacific',
    location: 'India',
    nodes: 44,
    namespaceIds: ['ns-core-network-apac-in05', 'ns-billing-api-apac-in05', 'ns-customer-data-in05', 'ns-monitor-tools-in05', 'ns-db-service-in05'],
  },

  // Development Clusters
  {
    id: 'cluster-dev-team-a',
    name: 'dev-team-a-cluster',
    clusterSetId: 'cs-dev',
    status: 'Ready',
    kubernetesVersion: '1.29.0',
    region: 'North America',
    location: 'US East Dev',
    nodes: 12,
    namespaceIds: ['ns-project-starlight-dev', 'ns-project-starfleet-dev', 'ns-project-pegasus-dev'],
  },
  {
    id: 'cluster-dev-team-b',
    name: 'dev-team-b-cluster',
    clusterSetId: 'cs-dev',
    status: 'Ready',
    kubernetesVersion: '1.29.0',
    region: 'North America',
    location: 'US East Dev',
    nodes: 12,
    namespaceIds: ['ns-project-starlight-dev-b', 'ns-project-quasar-dev', 'ns-project-falcon-dev'],
  },
  {
    id: 'cluster-qa-env',
    name: 'qa-env-cluster',
    clusterSetId: 'cs-dev',
    status: 'Ready',
    kubernetesVersion: '1.28.3',
    region: 'North America',
    location: 'US East QA',
    nodes: 15,
    namespaceIds: ['ns-qa-testing', 'ns-qa-performance'],
  },
  // Standalone cluster - not part of any cluster set
  {
    id: 'testcluster',
    name: 'testcluster',
    clusterSetId: '',
    status: 'Ready',
    kubernetesVersion: '1.29.0',
    region: 'North America',
    location: 'US Central Test',
    nodes: 3,
    namespaceIds: [],
  },
];

// Note: Due to size constraints, I'm creating a representative sample of namespaces and VMs
// In a real implementation, you'd generate these programmatically or use a data generator

export const namespaces: Namespace[] = [
  // Hub Cluster namespaces
  { id: 'ns-hub-acm', name: 'open-cluster-management', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'acm' } },
  { id: 'ns-hub-openshift-marketplace', name: 'openshift-marketplace', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'marketplace' } },
  { id: 'ns-hub-openshift-operators', name: 'openshift-operators', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'operators' } },
  { id: 'ns-hub-monitoring', name: 'openshift-monitoring', clusterId: 'cluster-hub', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-hub-logging', name: 'openshift-logging', clusterId: 'cluster-hub', type: 'monitoring', labels: { env: 'prod', app: 'logging' } },
  { id: 'ns-hub-multicluster-engine', name: 'multicluster-engine', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'mce' } },
  { id: 'ns-hub-ansible-automation', name: 'ansible-automation-platform', clusterId: 'cluster-hub', type: 'application', labels: { env: 'prod', app: 'ansible' } },
  { id: 'ns-hub-argo-cd', name: 'openshift-gitops', clusterId: 'cluster-hub', type: 'application', labels: { env: 'prod', app: 'argocd' } },
  { id: 'ns-hub-gitops', name: 'gitops-apps', clusterId: 'cluster-hub', type: 'application', labels: { env: 'prod', app: 'gitops' } },
  { id: 'ns-hub-policies', name: 'acm-policies', clusterId: 'cluster-hub', type: 'application', labels: { env: 'prod', app: 'policies' } },
  { id: 'ns-hub-apps', name: 'application-samples', clusterId: 'cluster-hub', type: 'application', labels: { env: 'dev', app: 'samples' } },
  { id: 'ns-hub-dev-team', name: 'dev-team-workspace', clusterId: 'cluster-hub', type: 'development', labels: { env: 'dev', team: 'developers' } },
  { id: 'ns-hub-qa-team', name: 'qa-team-workspace', clusterId: 'cluster-hub', type: 'qa', labels: { env: 'qa', team: 'qa-engineers' } },
  { id: 'ns-hub-demo-apps', name: 'demo-applications', clusterId: 'cluster-hub', type: 'application', labels: { env: 'demo', app: 'demos' } },
  { id: 'ns-hub-backup-restore', name: 'backup-restore', clusterId: 'cluster-hub', type: 'infrastructure', labels: { env: 'prod', app: 'backup' } },
  
  // US West Prod 01 namespaces
  { id: 'ns-core-ntwk-usw01', name: 'core-ntwk', clusterId: 'cluster-us-west-prod-01', type: 'infrastructure', labels: { env: 'prod', region: 'us-west' } },
  { id: 'ns-5g-api-prod-usw01', name: '5g-api-prod', clusterId: 'cluster-us-west-prod-01', type: 'application', labels: { env: 'prod', app: '5g' } },
  { id: 'ns-data-analytics-usw01', name: 'data-analytics', clusterId: 'cluster-us-west-prod-01', type: 'application', labels: { env: 'prod', app: 'analytics' } },
  
  // US East Prod 02 namespaces
  { id: 'ns-core-billing-use02', name: 'core-billing', clusterId: 'cluster-us-east-prod-02', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-security-ops-use02', name: 'security-ops', clusterId: 'cluster-us-east-prod-02', type: 'infrastructure', labels: { env: 'prod', app: 'security' } },
  { id: 'ns-log-viewer-use02', name: 'log-viewer', clusterId: 'cluster-us-east-prod-02', type: 'monitoring', labels: { env: 'prod', app: 'logging' } },
  
  // NA Edge NY 01 namespaces
  { id: 'ns-edge-core-app-ny01', name: 'edge-core-app', clusterId: 'cluster-na-edge-ny-01', type: 'application', labels: { env: 'prod', type: 'edge' } },
  { id: 'ns-location-services-ny01', name: 'location-services', clusterId: 'cluster-na-edge-ny-01', type: 'application', labels: { env: 'prod', app: 'location' } },
  
  // EU West Prod 01 namespaces
  { id: 'ns-core-ntwk-euw01', name: 'core-ntwk', clusterId: 'cluster-eu-west-prod-01', type: 'infrastructure', labels: { env: 'prod', region: 'eu-west' } },
  { id: 'ns-eu-5g-api-euw01', name: 'eu-5g-api', clusterId: 'cluster-eu-west-prod-01', type: 'application', labels: { env: 'prod', app: '5g' } },
  { id: 'ns-data-analytics-euw01', name: 'data-analytics', clusterId: 'cluster-eu-west-prod-01', type: 'application', labels: { env: 'prod', app: 'analytics' } },
  
  // EU East Prod 02 namespaces
  { id: 'ns-core-billing-eue02', name: 'core-billing', clusterId: 'cluster-eu-east-prod-02', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-security-ops-eue02', name: 'security-ops', clusterId: 'cluster-eu-east-prod-02', type: 'infrastructure', labels: { env: 'prod', app: 'security' } },
  { id: 'ns-log-viewer-eue02', name: 'log-viewer', clusterId: 'cluster-eu-east-prod-02', type: 'monitoring', labels: { env: 'prod', app: 'logging' } },
  
  // EU Edge Berlin 01 namespaces
  { id: 'ns-edge-core-app-ber01', name: 'edge-core-app', clusterId: 'cluster-eu-edge-berlin-01', type: 'application', labels: { env: 'prod', type: 'edge' } },
  { id: 'ns-location-services-ber01', name: 'location-services', clusterId: 'cluster-eu-edge-berlin-01', type: 'application', labels: { env: 'prod', app: 'location' } },
  
  // SA Brazil 01 namespaces
  { id: 'ns-core-network-sa-br01', name: 'core-network-sa', clusterId: 'cluster-sa-prod-brazil-01', type: 'infrastructure', labels: { env: 'prod', region: 'sa' } },
  { id: 'ns-billing-api-br01', name: 'billing-api', clusterId: 'cluster-sa-prod-brazil-01', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-br01', name: 'customer-data', clusterId: 'cluster-sa-prod-brazil-01', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-br01', name: 'monitor-tools', clusterId: 'cluster-sa-prod-brazil-01', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-br01', name: 'db-service', clusterId: 'cluster-sa-prod-brazil-01', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // SA Argentina 02 namespaces
  { id: 'ns-core-network-sa-ar02', name: 'core-network-sa', clusterId: 'cluster-sa-prod-argentina-02', type: 'infrastructure', labels: { env: 'prod', region: 'sa' } },
  { id: 'ns-billing-api-ar02', name: 'billing-api', clusterId: 'cluster-sa-prod-argentina-02', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-ar02', name: 'customer-data', clusterId: 'cluster-sa-prod-argentina-02', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-ar02', name: 'monitor-tools', clusterId: 'cluster-sa-prod-argentina-02', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-ar02', name: 'db-service', clusterId: 'cluster-sa-prod-argentina-02', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // SA Chile 03 namespaces
  { id: 'ns-core-network-sa-cl03', name: 'core-network-sa', clusterId: 'cluster-sa-prod-chile-03', type: 'infrastructure', labels: { env: 'prod', region: 'sa' } },
  { id: 'ns-billing-api-cl03', name: 'billing-api', clusterId: 'cluster-sa-prod-chile-03', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-cl03', name: 'customer-data', clusterId: 'cluster-sa-prod-chile-03', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-cl03', name: 'monitor-tools', clusterId: 'cluster-sa-prod-chile-03', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-cl03', name: 'db-service', clusterId: 'cluster-sa-prod-chile-03', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // SA Colombia 04 namespaces
  { id: 'ns-core-network-sa-co04', name: 'core-network-sa', clusterId: 'cluster-sa-prod-colombia-04', type: 'infrastructure', labels: { env: 'prod', region: 'sa' } },
  { id: 'ns-billing-api-co04', name: 'billing-api', clusterId: 'cluster-sa-prod-colombia-04', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-co04', name: 'customer-data', clusterId: 'cluster-sa-prod-colombia-04', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-co04', name: 'monitor-tools', clusterId: 'cluster-sa-prod-colombia-04', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-co04', name: 'db-service', clusterId: 'cluster-sa-prod-colombia-04', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // SA Peru 05 namespaces
  { id: 'ns-core-network-sa-pe05', name: 'core-network-sa', clusterId: 'cluster-sa-prod-peru-05', type: 'infrastructure', labels: { env: 'prod', region: 'sa' } },
  { id: 'ns-billing-api-pe05', name: 'billing-api', clusterId: 'cluster-sa-prod-peru-05', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-pe05', name: 'customer-data', clusterId: 'cluster-sa-prod-peru-05', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-pe05', name: 'monitor-tools', clusterId: 'cluster-sa-prod-peru-05', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-pe05', name: 'db-service', clusterId: 'cluster-sa-prod-peru-05', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // APAC Japan 01 namespaces
  { id: 'ns-core-network-apac-jp01', name: 'core-network-apac', clusterId: 'cluster-apac-prod-japan-01', type: 'infrastructure', labels: { env: 'prod', region: 'apac' } },
  { id: 'ns-billing-api-apac-jp01', name: 'billing-api-apac', clusterId: 'cluster-apac-prod-japan-01', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-jp01', name: 'customer-data', clusterId: 'cluster-apac-prod-japan-01', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-jp01', name: 'monitor-tools', clusterId: 'cluster-apac-prod-japan-01', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-jp01', name: 'db-service', clusterId: 'cluster-apac-prod-japan-01', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // APAC Korea 02 namespaces
  { id: 'ns-core-network-apac-kr02', name: 'core-network-apac', clusterId: 'cluster-apac-prod-korea-02', type: 'infrastructure', labels: { env: 'prod', region: 'apac' } },
  { id: 'ns-billing-api-apac-kr02', name: 'billing-api-apac', clusterId: 'cluster-apac-prod-korea-02', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-kr02', name: 'customer-data', clusterId: 'cluster-apac-prod-korea-02', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-kr02', name: 'monitor-tools', clusterId: 'cluster-apac-prod-korea-02', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-kr02', name: 'db-service', clusterId: 'cluster-apac-prod-korea-02', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // APAC Australia 03 namespaces
  { id: 'ns-core-network-apac-au03', name: 'core-network-apac', clusterId: 'cluster-apac-prod-australia-03', type: 'infrastructure', labels: { env: 'prod', region: 'apac' } },
  { id: 'ns-billing-api-apac-au03', name: 'billing-api-apac', clusterId: 'cluster-apac-prod-australia-03', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-au03', name: 'customer-data', clusterId: 'cluster-apac-prod-australia-03', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-au03', name: 'monitor-tools', clusterId: 'cluster-apac-prod-australia-03', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-au03', name: 'db-service', clusterId: 'cluster-apac-prod-australia-03', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // APAC Singapore 04 namespaces
  { id: 'ns-core-network-apac-sg04', name: 'core-network-apac', clusterId: 'cluster-apac-prod-singapore-04', type: 'infrastructure', labels: { env: 'prod', region: 'apac' } },
  { id: 'ns-billing-api-apac-sg04', name: 'billing-api-apac', clusterId: 'cluster-apac-prod-singapore-04', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-sg04', name: 'customer-data', clusterId: 'cluster-apac-prod-singapore-04', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-sg04', name: 'monitor-tools', clusterId: 'cluster-apac-prod-singapore-04', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-sg04', name: 'db-service', clusterId: 'cluster-apac-prod-singapore-04', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // APAC India 05 namespaces
  { id: 'ns-core-network-apac-in05', name: 'core-network-apac', clusterId: 'cluster-apac-prod-india-05', type: 'infrastructure', labels: { env: 'prod', region: 'apac' } },
  { id: 'ns-billing-api-apac-in05', name: 'billing-api-apac', clusterId: 'cluster-apac-prod-india-05', type: 'application', labels: { env: 'prod', app: 'billing' } },
  { id: 'ns-customer-data-in05', name: 'customer-data', clusterId: 'cluster-apac-prod-india-05', type: 'database', labels: { env: 'prod', app: 'data' } },
  { id: 'ns-monitor-tools-in05', name: 'monitor-tools', clusterId: 'cluster-apac-prod-india-05', type: 'monitoring', labels: { env: 'prod', app: 'monitoring' } },
  { id: 'ns-db-service-in05', name: 'db-service', clusterId: 'cluster-apac-prod-india-05', type: 'database', labels: { env: 'prod', app: 'database' } },
  
  // Dev Team A namespaces
  { id: 'ns-project-starlight-dev', name: 'project-starlight-dev', clusterId: 'cluster-dev-team-a', type: 'development', labels: { env: 'dev', team: 'team-a' } },
  { id: 'ns-project-starfleet-dev', name: 'project-starfleet-dev', clusterId: 'cluster-dev-team-a', type: 'development', labels: { env: 'dev', team: 'team-a' } },
  { id: 'ns-project-pegasus-dev', name: 'project-pegasus-dev', clusterId: 'cluster-dev-team-a', type: 'development', labels: { env: 'dev', team: 'team-a' } },
  
  // Dev Team B namespaces
  { id: 'ns-project-starlight-dev-b', name: 'project-starlight-dev', clusterId: 'cluster-dev-team-b', type: 'development', labels: { env: 'dev', team: 'team-b' } },
  { id: 'ns-project-quasar-dev', name: 'project-quasar-dev', clusterId: 'cluster-dev-team-b', type: 'development', labels: { env: 'dev', team: 'team-b' } },
  { id: 'ns-project-falcon-dev', name: 'project-falcon-dev', clusterId: 'cluster-dev-team-b', type: 'development', labels: { env: 'dev', team: 'team-b' } },
  
  // QA namespaces
  { id: 'ns-qa-testing', name: 'qa-testing-ns', clusterId: 'cluster-qa-env', type: 'qa', labels: { env: 'qa', type: 'testing' } },
  { id: 'ns-qa-performance', name: 'qa-performance-ns', clusterId: 'cluster-qa-env', type: 'qa', labels: { env: 'qa', type: 'performance' } },
];

// Sample Virtual Machines (representative set - in production, you'd generate 15,000)
export const virtualMachines: VirtualMachine[] = [
  // Hub Cluster VMs - openshift-monitoring namespace
  { id: 'vm-hub-mon-001', name: 'prometheus-main', clusterId: 'cluster-hub', namespaceId: 'ns-hub-monitoring', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '16 GiB', storage: '200 GiB', ipAddress: '10.0.1.10', node: 'node-hub-01', created: '2024-01-05T08:00:00Z' },
  { id: 'vm-hub-mon-002', name: 'alertmanager', clusterId: 'cluster-hub', namespaceId: 'ns-hub-monitoring', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '8 GiB', storage: '100 GiB', ipAddress: '10.0.1.11', node: 'node-hub-02', created: '2024-01-05T08:10:00Z' },
  { id: 'vm-hub-mon-003', name: 'grafana-dashboard', clusterId: 'cluster-hub', namespaceId: 'ns-hub-monitoring', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '8 GiB', storage: '50 GiB', ipAddress: '10.0.1.12', node: 'node-hub-03', created: '2024-01-05T08:20:00Z' },
  { id: 'vm-hub-mon-004', name: 'thanos-querier', clusterId: 'cluster-hub', namespaceId: 'ns-hub-monitoring', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '16 GiB', storage: '100 GiB', ipAddress: '10.0.1.13', node: 'node-hub-04', created: '2024-01-05T08:30:00Z' },
  { id: 'vm-hub-mon-005', name: 'node-exporter-hub', clusterId: 'cluster-hub', namespaceId: 'ns-hub-monitoring', status: 'Running', os: 'RHEL 9', cpu: 1, memory: '4 GiB', storage: '20 GiB', ipAddress: '10.0.1.14', node: 'node-hub-05', created: '2024-01-05T08:40:00Z' },
  
  // Hub Cluster VMs - openshift-gitops namespace
  { id: 'vm-hub-gitops-001', name: 'argocd-server', clusterId: 'cluster-hub', namespaceId: 'ns-hub-argo-cd', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '8 GiB', storage: '50 GiB', ipAddress: '10.0.2.10', node: 'node-hub-06', created: '2024-01-05T09:00:00Z' },
  { id: 'vm-hub-gitops-002', name: 'argocd-repo-server', clusterId: 'cluster-hub', namespaceId: 'ns-hub-argo-cd', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '16 GiB', storage: '100 GiB', ipAddress: '10.0.2.11', node: 'node-hub-07', created: '2024-01-05T09:10:00Z' },
  { id: 'vm-hub-gitops-003', name: 'argocd-application-controller', clusterId: 'cluster-hub', namespaceId: 'ns-hub-argo-cd', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '16 GiB', storage: '75 GiB', ipAddress: '10.0.2.12', node: 'node-hub-08', created: '2024-01-05T09:20:00Z' },
  { id: 'vm-hub-gitops-004', name: 'argocd-redis', clusterId: 'cluster-hub', namespaceId: 'ns-hub-argo-cd', status: 'Running', os: 'RHEL 9', cpu: 2, memory: '8 GiB', storage: '30 GiB', ipAddress: '10.0.2.13', node: 'node-hub-01', created: '2024-01-05T09:30:00Z' },
  { id: 'vm-hub-gitops-005', name: 'argocd-dex-server', clusterId: 'cluster-hub', namespaceId: 'ns-hub-argo-cd', status: 'Running', os: 'RHEL 9', cpu: 1, memory: '4 GiB', storage: '20 GiB', ipAddress: '10.0.2.14', node: 'node-hub-02', created: '2024-01-05T09:40:00Z' },
  
  // US West Prod 01 VMs
  { id: 'vm-usw01-001', name: 'ntwk-gateway-001', clusterId: 'cluster-us-west-prod-01', namespaceId: 'ns-core-ntwk-usw01', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '16 GiB', storage: '100 GiB', ipAddress: '10.1.1.10', node: 'node-usw01-01', created: '2024-01-15T10:00:00Z' },
  { id: 'vm-usw01-002', name: 'ntwk-router-002', clusterId: 'cluster-us-west-prod-01', namespaceId: 'ns-core-ntwk-usw01', status: 'Running', os: 'RHEL 9', cpu: 8, memory: '32 GiB', storage: '200 GiB', ipAddress: '10.1.1.11', node: 'node-usw01-02', created: '2024-01-15T10:05:00Z' },
  { id: 'vm-usw01-003', name: '5g-api-server-001', clusterId: 'cluster-us-west-prod-01', namespaceId: 'ns-5g-api-prod-usw01', status: 'Running', os: 'RHEL 8', cpu: 8, memory: '32 GiB', storage: '150 GiB', ipAddress: '10.1.2.10', node: 'node-usw01-03', created: '2024-01-16T09:00:00Z' },
  { id: 'vm-usw01-004', name: '5g-api-server-002', clusterId: 'cluster-us-west-prod-01', namespaceId: 'ns-5g-api-prod-usw01', status: 'Running', os: 'RHEL 8', cpu: 8, memory: '32 GiB', storage: '150 GiB', ipAddress: '10.1.2.11', node: 'node-usw01-04', created: '2024-01-16T09:05:00Z' },
  { id: 'vm-usw01-005', name: 'analytics-worker-001', clusterId: 'cluster-us-west-prod-01', namespaceId: 'ns-data-analytics-usw01', status: 'Running', os: 'Ubuntu 22.04', cpu: 16, memory: '64 GiB', storage: '500 GiB', ipAddress: '10.1.3.10', node: 'node-usw01-05', created: '2024-01-17T08:00:00Z' },
  
  // Dev Team A VMs
  { id: 'vm-dev-a-001', name: 'starlight-app-001', clusterId: 'cluster-dev-team-a', namespaceId: 'ns-project-starlight-dev', status: 'Running', os: 'Fedora 39', cpu: 2, memory: '8 GiB', storage: '50 GiB', ipAddress: '10.100.1.10', node: 'node-dev-a-01', created: '2024-02-01T10:00:00Z' },
  { id: 'vm-dev-a-002', name: 'starlight-db-001', clusterId: 'cluster-dev-team-a', namespaceId: 'ns-project-starlight-dev', status: 'Running', os: 'RHEL 9', cpu: 4, memory: '16 GiB', storage: '100 GiB', ipAddress: '10.100.1.11', node: 'node-dev-a-02', created: '2024-02-01T10:05:00Z' },
  { id: 'vm-dev-a-003', name: 'starfleet-api-001', clusterId: 'cluster-dev-team-a', namespaceId: 'ns-project-starfleet-dev', status: 'Stopped', os: 'Fedora 38', cpu: 2, memory: '8 GiB', storage: '50 GiB', ipAddress: '10.100.2.10', node: 'node-dev-a-03', created: '2024-02-02T09:00:00Z' },
  { id: 'vm-dev-a-004', name: 'pegasus-service-001', clusterId: 'cluster-dev-team-a', namespaceId: 'ns-project-pegasus-dev', status: 'Error', os: 'RHEL 8', cpu: 4, memory: '16 GiB', storage: '75 GiB', ipAddress: '10.100.3.10', node: 'node-dev-a-04', created: '2024-02-03T08:00:00Z' },
  
  // Add more VMs as needed...
];

// ============================================================================
// USERS
// ============================================================================

export const users: User[] = [
  // Dev Team Alpha (60 users)
  { id: 'user-001', username: 'walter.kovacs', firstName: 'Walter', lastName: 'Kovacs', email: 'walter.kovacs@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:00:00Z', lastLogin: '2025-01-10T14:30:00Z' },
  { id: 'user-002', username: 'sarah.chen', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:05:00Z', lastLogin: '2025-01-12T09:15:00Z' },
  { id: 'user-003', username: 'michael.rodriguez', firstName: 'Michael', lastName: 'Rodriguez', email: 'michael.rodriguez@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:10:00Z', lastLogin: '2025-01-11T16:45:00Z' },
  { id: 'user-004', username: 'emily.johnson', firstName: 'Emily', lastName: 'Johnson', email: 'emily.johnson@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:15:00Z', lastLogin: '2025-01-13T11:20:00Z' },
  { id: 'user-005', username: 'david.kim', firstName: 'David', lastName: 'Kim', email: 'david.kim@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:20:00Z', lastLogin: '2025-01-09T08:30:00Z' },
  { id: 'user-006', username: 'jessica.martinez', firstName: 'Jessica', lastName: 'Martinez', email: 'jessica.martinez@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:25:00Z', lastLogin: '2025-01-14T13:00:00Z' },
  { id: 'user-007', username: 'james.wilson', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:30:00Z', lastLogin: '2025-01-08T15:45:00Z' },
  { id: 'user-008', username: 'amanda.taylor', firstName: 'Amanda', lastName: 'Taylor', email: 'amanda.taylor@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:35:00Z', lastLogin: '2025-01-13T10:30:00Z' },
  { id: 'user-009', username: 'chris.nguyen', firstName: 'Chris', lastName: 'Nguyen', email: 'chris.nguyen@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:40:00Z', lastLogin: '2025-01-12T16:00:00Z' },
  { id: 'user-010', username: 'sophia.patel', firstName: 'Sophia', lastName: 'Patel', email: 'sophia.patel@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:45:00Z', lastLogin: '2025-01-11T14:15:00Z' },
  { id: 'user-011', username: 'daniel.brown', firstName: 'Daniel', lastName: 'Brown', email: 'daniel.brown@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:50:00Z', lastLogin: '2025-01-10T11:30:00Z' },
  { id: 'user-012', username: 'natalie.anderson', firstName: 'Natalie', lastName: 'Anderson', email: 'natalie.anderson@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T10:55:00Z', lastLogin: '2025-01-14T10:45:00Z' },
  { id: 'user-013', username: 'kevin.lee', firstName: 'Kevin', lastName: 'Lee', email: 'kevin.lee@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:00:00Z', lastLogin: '2025-01-13T15:20:00Z' },
  { id: 'user-014', username: 'monica.davis', firstName: 'Monica', lastName: 'Davis', email: 'monica.davis@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:05:00Z', lastLogin: '2025-01-12T12:40:00Z' },
  { id: 'user-015', username: 'ryan.thomas', firstName: 'Ryan', lastName: 'Thomas', email: 'ryan.thomas@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:10:00Z', lastLogin: '2025-01-11T09:50:00Z' },
  { id: 'user-016', username: 'laura.white', firstName: 'Laura', lastName: 'White', email: 'laura.white@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:15:00Z', lastLogin: '2025-01-10T13:25:00Z' },
  { id: 'user-017', username: 'andrew.harris', firstName: 'Andrew', lastName: 'Harris', email: 'andrew.harris@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:20:00Z', lastLogin: '2025-01-14T14:55:00Z' },
  { id: 'user-018', username: 'jennifer.clark', firstName: 'Jennifer', lastName: 'Clark', email: 'jennifer.clark@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:25:00Z', lastLogin: '2025-01-13T08:30:00Z' },
  { id: 'user-019', username: 'matthew.lewis', firstName: 'Matthew', lastName: 'Lewis', email: 'matthew.lewis@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:30:00Z', lastLogin: '2025-01-12T17:10:00Z' },
  { id: 'user-020', username: 'ashley.walker', firstName: 'Ashley', lastName: 'Walker', email: 'ashley.walker@petemobile.com', status: 'Active', groupIds: ['group-dev-team-alpha'], identityProviderId: 'idp-001', created: '2023-01-15T11:35:00Z', lastLogin: '2025-01-11T10:45:00Z' },
  
  // Manager Project Starlight (5 users)
  { id: 'user-061', username: 'rachel.morrison', firstName: 'Rachel', lastName: 'Morrison', email: 'rachel.morrison@petemobile.com', status: 'Active', groupIds: ['group-manager-project-starlight'], identityProviderId: 'idp-002', created: '2023-02-01T09:00:00Z', lastLogin: '2025-01-14T08:00:00Z' },
  { id: 'user-062', username: 'thomas.anderson', firstName: 'Thomas', lastName: 'Anderson', email: 'thomas.anderson@petemobile.com', status: 'Active', groupIds: ['group-manager-project-starlight'], identityProviderId: 'idp-002', created: '2023-02-01T09:05:00Z', lastLogin: '2025-01-13T14:30:00Z' },
  { id: 'user-063', username: 'lisa.patel', firstName: 'Lisa', lastName: 'Patel', email: 'lisa.patel@petemobile.com', status: 'Active', groupIds: ['group-manager-project-starlight'], identityProviderId: 'idp-002', created: '2023-02-01T09:10:00Z', lastLogin: '2025-01-12T11:15:00Z' },
  { id: 'user-064', username: 'robert.zhang', firstName: 'Robert', lastName: 'Zhang', email: 'robert.zhang@petemobile.com', status: 'Active', groupIds: ['group-manager-project-starlight'], identityProviderId: 'idp-002', created: '2023-02-01T09:15:00Z', lastLogin: '2025-01-11T16:45:00Z' },
  { id: 'user-065', username: 'michelle.garcia', firstName: 'Michelle', lastName: 'Garcia', email: 'michelle.garcia@petemobile.com', status: 'Active', groupIds: ['group-manager-project-starlight'], identityProviderId: 'idp-002', created: '2023-02-01T09:20:00Z', lastLogin: '2025-01-14T09:30:00Z' },
  
  // Network Ops Team (20 users)
  { id: 'user-066', username: 'alex.thompson', firstName: 'Alex', lastName: 'Thompson', email: 'alex.thompson@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:00:00Z', lastLogin: '2025-01-13T12:00:00Z' },
  { id: 'user-067', username: 'olivia.brown', firstName: 'Olivia', lastName: 'Brown', email: 'olivia.brown@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:05:00Z', lastLogin: '2025-01-12T15:30:00Z' },
  { id: 'user-068', username: 'noah.jackson', firstName: 'Noah', lastName: 'Jackson', email: 'noah.jackson@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:10:00Z', lastLogin: '2025-01-11T13:45:00Z' },
  { id: 'user-069', username: 'emma.martin', firstName: 'Emma', lastName: 'Martin', email: 'emma.martin@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:15:00Z', lastLogin: '2025-01-10T16:20:00Z' },
  { id: 'user-070', username: 'liam.garcia', firstName: 'Liam', lastName: 'Garcia', email: 'liam.garcia@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:20:00Z', lastLogin: '2025-01-14T11:55:00Z' },
  { id: 'user-071', username: 'ava.martinez', firstName: 'Ava', lastName: 'Martinez', email: 'ava.martinez@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:25:00Z', lastLogin: '2025-01-13T09:30:00Z' },
  { id: 'user-072', username: 'william.lopez', firstName: 'William', lastName: 'Lopez', email: 'william.lopez@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:30:00Z', lastLogin: '2025-01-12T14:15:00Z' },
  { id: 'user-073', username: 'isabella.gonzalez', firstName: 'Isabella', lastName: 'Gonzalez', email: 'isabella.gonzalez@petemobile.com', status: 'Active', groupIds: ['group-network-ops'], identityProviderId: 'idp-003', created: '2023-01-20T10:35:00Z', lastLogin: '2025-01-11T12:40:00Z' },
  
  // Billing API Team (15 users)
  { id: 'user-081', username: 'ethan.rodriguez', firstName: 'Ethan', lastName: 'Rodriguez', email: 'ethan.rodriguez@petemobile.com', status: 'Active', groupIds: ['group-billing-api'], identityProviderId: 'idp-001', created: '2023-01-25T09:00:00Z', lastLogin: '2025-01-13T10:00:00Z' },
  { id: 'user-082', username: 'mia.hernandez', firstName: 'Mia', lastName: 'Hernandez', email: 'mia.hernandez@petemobile.com', status: 'Active', groupIds: ['group-billing-api'], identityProviderId: 'idp-001', created: '2023-01-25T09:05:00Z', lastLogin: '2025-01-12T14:30:00Z' },
  { id: 'user-083', username: 'mason.moore', firstName: 'Mason', lastName: 'Moore', email: 'mason.moore@petemobile.com', status: 'Active', groupIds: ['group-billing-api'], identityProviderId: 'idp-001', created: '2023-01-25T09:10:00Z', lastLogin: '2025-01-11T11:15:00Z' },
  { id: 'user-084', username: 'charlotte.taylor', firstName: 'Charlotte', lastName: 'Taylor', email: 'charlotte.taylor@petemobile.com', status: 'Active', groupIds: ['group-billing-api'], identityProviderId: 'idp-001', created: '2023-01-25T09:15:00Z', lastLogin: '2025-01-14T08:45:00Z' },
  { id: 'user-085', username: 'lucas.thomas', firstName: 'Lucas', lastName: 'Thomas', email: 'lucas.thomas@petemobile.com', status: 'Active', groupIds: ['group-billing-api'], identityProviderId: 'idp-001', created: '2023-01-25T09:20:00Z', lastLogin: '2025-01-13T16:20:00Z' },
  
  // 5G Platform Team (25 users)
  { id: 'user-096', username: 'harper.jackson', firstName: 'Harper', lastName: 'Jackson', email: 'harper.jackson@petemobile.com', status: 'Active', groupIds: ['group-5g-platform'], identityProviderId: 'idp-001', created: '2023-02-05T10:00:00Z', lastLogin: '2025-01-12T09:00:00Z' },
  { id: 'user-097', username: 'elijah.white', firstName: 'Elijah', lastName: 'White', email: 'elijah.white@petemobile.com', status: 'Active', groupIds: ['group-5g-platform'], identityProviderId: 'idp-001', created: '2023-02-05T10:05:00Z', lastLogin: '2025-01-11T15:30:00Z' },
  { id: 'user-098', username: 'evelyn.harris', firstName: 'Evelyn', lastName: 'Harris', email: 'evelyn.harris@petemobile.com', status: 'Active', groupIds: ['group-5g-platform'], identityProviderId: 'idp-001', created: '2023-02-05T10:10:00Z', lastLogin: '2025-01-10T12:45:00Z' },
  { id: 'user-099', username: 'logan.clark', firstName: 'Logan', lastName: 'Clark', email: 'logan.clark@petemobile.com', status: 'Active', groupIds: ['group-5g-platform'], identityProviderId: 'idp-001', created: '2023-02-05T10:15:00Z', lastLogin: '2025-01-14T14:20:00Z' },
  { id: 'user-100', username: 'abigail.lewis', firstName: 'Abigail', lastName: 'Lewis', email: 'abigail.lewis@petemobile.com', status: 'Active', groupIds: ['group-5g-platform'], identityProviderId: 'idp-001', created: '2023-02-05T10:20:00Z', lastLogin: '2025-01-13T11:00:00Z' },
  
  // Security Ops Team (12 users)
  { id: 'user-121', username: 'sebastian.walker', firstName: 'Sebastian', lastName: 'Walker', email: 'sebastian.walker@petemobile.com', status: 'Active', groupIds: ['group-security-ops'], identityProviderId: 'idp-003', created: '2023-02-10T09:00:00Z', lastLogin: '2025-01-12T08:30:00Z' },
  { id: 'user-122', username: 'amelia.allen', firstName: 'Amelia', lastName: 'Allen', email: 'amelia.allen@petemobile.com', status: 'Active', groupIds: ['group-security-ops'], identityProviderId: 'idp-003', created: '2023-02-10T09:05:00Z', lastLogin: '2025-01-11T16:00:00Z' },
  { id: 'user-123', username: 'jack.young', firstName: 'Jack', lastName: 'Young', email: 'jack.young@petemobile.com', status: 'Active', groupIds: ['group-security-ops'], identityProviderId: 'idp-003', created: '2023-02-10T09:10:00Z', lastLogin: '2025-01-10T13:15:00Z' },
  { id: 'user-124', username: 'sofia.king', firstName: 'Sofia', lastName: 'King', email: 'sofia.king@petemobile.com', status: 'Active', groupIds: ['group-security-ops'], identityProviderId: 'idp-003', created: '2023-02-10T09:15:00Z', lastLogin: '2025-01-14T10:45:00Z' },
  
  // Database Admins (8 users)
  { id: 'user-133', username: 'henry.wright', firstName: 'Henry', lastName: 'Wright', email: 'henry.wright@petemobile.com', status: 'Active', groupIds: ['group-database-admins'], identityProviderId: 'idp-002', created: '2023-02-15T10:00:00Z', lastLogin: '2025-01-13T09:30:00Z' },
  { id: 'user-134', username: 'scarlett.green', firstName: 'Scarlett', lastName: 'Green', email: 'scarlett.green@petemobile.com', status: 'Active', groupIds: ['group-database-admins'], identityProviderId: 'idp-002', created: '2023-02-15T10:05:00Z', lastLogin: '2025-01-12T15:45:00Z' },
  { id: 'user-135', username: 'owen.adams', firstName: 'Owen', lastName: 'Adams', email: 'owen.adams@petemobile.com', status: 'Active', groupIds: ['group-database-admins'], identityProviderId: 'idp-002', created: '2023-02-15T10:10:00Z', lastLogin: '2025-01-11T11:20:00Z' },
  { id: 'user-136', username: 'grace.baker', firstName: 'Grace', lastName: 'Baker', email: 'grace.baker@petemobile.com', status: 'Active', groupIds: ['group-database-admins'], identityProviderId: 'idp-002', created: '2023-02-15T10:15:00Z', lastLogin: '2025-01-14T13:00:00Z' },
];

// Note: For brevity, I'm showing a sample. In production, you'd generate all 400 users

// ============================================================================
// GROUPS
// ============================================================================

export const groups: Group[] = [
  {
    id: 'group-dev-team-alpha',
    name: 'dev-team-alpha',
    description: 'Development Team Alpha - Primary application development team',
    type: 'team',
    userIds: [
      'user-001', 'user-002', 'user-003', 'user-004', 'user-005', 'user-006', 'user-007', 'user-008',
      'user-009', 'user-010', 'user-011', 'user-012', 'user-013', 'user-014', 'user-015', 'user-016',
      'user-017', 'user-018', 'user-019', 'user-020'
    ],
  },
  {
    id: 'group-manager-project-starlight',
    name: 'manager-project-starlight',
    description: 'Project Starlight Management Team',
    type: 'project',
    userIds: ['user-061', 'user-062', 'user-063', 'user-064', 'user-065'],
  },
  {
    id: 'group-network-ops',
    name: 'network-ops-team',
    description: 'Network Operations Team - Manages core network infrastructure',
    type: 'team',
    userIds: ['user-066', 'user-067', 'user-068', 'user-069', 'user-070', 'user-071', 'user-072', 'user-073'],
  },
  {
    id: 'group-billing-api',
    name: 'billing-api-team',
    description: 'Billing API Development and Maintenance Team',
    type: 'team',
    userIds: ['user-081', 'user-082', 'user-083', 'user-084', 'user-085'],
  },
  {
    id: 'group-5g-platform',
    name: '5g-platform-developers',
    description: '5G Platform Development Team',
    type: 'team',
    userIds: ['user-096', 'user-097', 'user-098', 'user-099', 'user-100'],
  },
  {
    id: 'group-security-ops',
    name: 'security-ops-team',
    description: 'Security Operations Team',
    type: 'team',
    userIds: ['user-121', 'user-122', 'user-123', 'user-124'],
  },
  {
    id: 'group-database-admins',
    name: 'database-admins',
    description: 'Database Administration Team',
    type: 'team',
    userIds: ['user-133', 'user-134', 'user-135', 'user-136'],
  },
  {
    id: 'group-monitoring',
    name: 'monitoring-team',
    description: 'Infrastructure Monitoring Team',
    type: 'team',
    userIds: [],
  },
  {
    id: 'group-edge-platform',
    name: 'edge-platform-team',
    description: 'Edge Computing Platform Team',
    type: 'team',
    userIds: [],
  },
  {
    id: 'group-qa-testing',
    name: 'qa-testing-team',
    description: 'Quality Assurance and Testing Team',
    type: 'team',
    userIds: [],
  },
  {
    id: 'group-sa-region-ops',
    name: 'sa-region-ops',
    description: 'South America Regional Operations',
    type: 'regional',
    userIds: [],
  },
  {
    id: 'group-apac-region-ops',
    name: 'apac-region-ops',
    description: 'Asia-Pacific Regional Operations',
    type: 'regional',
    userIds: [],
  },
  {
    id: 'group-eu-region-ops',
    name: 'eu-region-ops',
    description: 'Europe Regional Operations',
    type: 'regional',
    userIds: [],
  },
];

// ============================================================================
// SERVICE ACCOUNTS
// ============================================================================

export const serviceAccounts: ServiceAccount[] = [
  { id: 'sa-001', name: 'ci-cd-automation', namespace: 'default', description: 'CI/CD Pipeline Automation Service Account', created: '2023-01-10T10:00:00Z' },
  { id: 'sa-002', name: 'monitoring-agent', namespace: 'kube-system', description: 'Monitoring and Metrics Collection Agent', created: '2023-01-10T10:05:00Z' },
  { id: 'sa-003', name: 'backup-service', namespace: 'kube-system', description: 'Automated Backup Service Account', created: '2023-01-10T10:10:00Z' },
  { id: 'sa-004', name: 'log-aggregator', namespace: 'kube-system', description: 'Log Aggregation and Forwarding Service', created: '2023-01-10T10:15:00Z' },
  { id: 'sa-005', name: 'metrics-collector', namespace: 'kube-system', description: 'Metrics Collection Service Account', created: '2023-01-10T10:20:00Z' },
  { id: 'sa-006', name: 'network-policy-controller', namespace: 'kube-system', description: 'Network Policy Controller Service Account', created: '2023-01-10T10:25:00Z' },
  { id: 'sa-007', name: 'ingress-controller', namespace: 'kube-system', description: 'Ingress Controller Service Account', created: '2023-01-10T10:30:00Z' },
  { id: 'sa-008', name: 'storage-provisioner', namespace: 'kube-system', description: 'Dynamic Storage Provisioner', created: '2023-01-10T10:35:00Z' },
];

// ============================================================================
// IDENTITY PROVIDERS
// ============================================================================

export const identityProviders: IdentityProvider[] = [
  { 
    id: 'idp-001', 
    name: 'PeteMobile LDAP', 
    type: 'LDAP', 
    status: 'Active', 
    description: 'Corporate LDAP Directory',
    clusterIds: [
      'cluster-us-west-prod-01',
      'cluster-us-east-prod-02',
      'cluster-eu-west-prod-01',
      'cluster-eu-east-prod-02',
      'cluster-sa-prod-brazil-01',
      'cluster-sa-prod-argentina-02',
      'cluster-apac-prod-japan-01',
      'cluster-apac-prod-korea-02',
    ],
  },
  { 
    id: 'idp-002', 
    name: 'PeteMobile SSO', 
    type: 'SAML', 
    status: 'Active', 
    description: 'Enterprise Single Sign-On',
    clusterIds: [
      'cluster-na-edge-ny-01',
      'cluster-eu-edge-berlin-01',
      'cluster-sa-prod-chile-03',
      'cluster-sa-prod-colombia-04',
      'cluster-sa-prod-peru-05',
      'cluster-apac-prod-australia-03',
      'cluster-apac-prod-singapore-04',
      'cluster-apac-prod-india-05',
    ],
  },
  { 
    id: 'idp-003', 
    name: 'GitHub Enterprise', 
    type: 'OpenID Connect', 
    status: 'Active', 
    description: 'GitHub Enterprise Authentication',
    clusterIds: [
      'cluster-dev-team-a',
      'cluster-dev-team-b',
      'cluster-qa-env',
    ],
  },
];

// ============================================================================
// ROLES
// ============================================================================

export const roles: Role[] = [
  // Default KubeVirt Roles
  {
    id: 'role-kubevirt-admin',
    name: 'kubevirt.io:admin',
    displayName: 'Virtualization admin',
    type: 'default',
    category: 'kubevirt',
    description: 'Full administrative access to KubeVirt resources',
    permissions: ['virtualmachines.*', 'virtualmachineinstances.*', 'templates.*', 'instancetypes.*'],
  },
  {
    id: 'role-kubevirt-edit',
    name: 'kubevirt.io:edit',
    displayName: 'Virtualization edit',
    type: 'default',
    category: 'kubevirt',
    description: 'Edit access to KubeVirt resources',
    permissions: ['virtualmachines.create', 'virtualmachines.update', 'virtualmachines.delete', 'virtualmachines.start', 'virtualmachines.stop'],
  },
  {
    id: 'role-kubevirt-view',
    name: 'kubevirt.io:view',
    displayName: 'Virtualization view',
    type: 'default',
    category: 'kubevirt',
    description: 'Read-only access to KubeVirt resources',
    permissions: ['virtualmachines.get', 'virtualmachines.list', 'virtualmachineinstances.get', 'virtualmachineinstances.list'],
  },
  {
    id: 'role-virtualmachine-admin',
    name: 'kubevirt.io:vm:admin',
    displayName: 'Virtual machine admin',
    type: 'default',
    category: 'kubevirt',
    description: 'Full administrative access to virtual machines',
    permissions: ['virtualmachines.*'],
  },
  {
    id: 'role-virtualmachine-editor',
    name: 'kubevirt.io:vm:editor',
    displayName: 'Virtual machine editor',
    type: 'default',
    category: 'kubevirt',
    description: 'Edit virtual machines',
    permissions: ['virtualmachines.create', 'virtualmachines.update', 'virtualmachines.start', 'virtualmachines.stop'],
  },
  
  // Custom Roles
  {
    id: 'role-starlight-developer',
    name: 'petemobile.io:starlight:developer',
    displayName: 'Starlight project developer',
    type: 'custom',
    category: 'application',
    description: 'Developer access for Project Starlight',
    permissions: ['virtualmachines.create', 'virtualmachines.update', 'virtualmachines.start', 'virtualmachines.stop', 'pods.create', 'pods.delete'],
    created: '2024-02-01T10:00:00Z',
  },
  {
    id: 'role-billing-api-operator',
    name: 'petemobile.io:billing:operator',
    displayName: 'Billing API operator',
    type: 'custom',
    category: 'application',
    description: 'Operator access for billing API services',
    permissions: ['virtualmachines.get', 'virtualmachines.list', 'virtualmachines.restart', 'services.get', 'services.list'],
    created: '2024-01-20T10:00:00Z',
  },
  {
    id: 'role-network-infra-admin',
    name: 'petemobile.io:network:admin',
    displayName: 'Network infrastructure admin',
    type: 'custom',
    category: 'namespace',
    description: 'Administrative access to network infrastructure',
    permissions: ['virtualmachines.*', 'networkpolicies.*', 'services.*', 'ingresses.*'],
    created: '2024-01-15T10:00:00Z',
  },
  {
    id: 'role-5g-platform-maintainer',
    name: 'petemobile.io:5g:maintainer',
    displayName: '5G platform maintainer',
    type: 'custom',
    category: 'application',
    description: 'Maintenance access for 5G platform services',
    permissions: ['virtualmachines.get', 'virtualmachines.list', 'virtualmachines.update', 'virtualmachines.restart'],
    created: '2024-01-18T10:00:00Z',
  },
  {
    id: 'role-edge-compute-operator',
    name: 'petemobile.io:edge:operator',
    displayName: 'Edge compute operator',
    type: 'custom',
    category: 'cluster',
    description: 'Operator access for edge computing clusters',
    permissions: ['virtualmachines.*', 'nodes.get', 'nodes.list', 'pods.get', 'pods.list'],
    created: '2024-01-25T10:00:00Z',
  },
  {
    id: 'role-database-admin',
    name: 'petemobile.io:database:admin',
    displayName: 'Database admin',
    type: 'custom',
    category: 'namespace',
    description: 'Administrative access to database virtual machines',
    permissions: ['virtualmachines.*', 'persistentvolumeclaims.*', 'secrets.*'],
    created: '2024-01-12T10:00:00Z',
  },
];

// ============================================================================
// ROLE BINDINGS (Sample)
// ============================================================================

export const roleBindings: RoleBinding[] = [
  // Dev Team Alpha has starlight-project-developer role on dev cluster
  {
    id: 'rb-001',
    roleId: 'role-starlight-developer',
    subjectType: 'group',
    subjectId: 'group-dev-team-alpha',
    scope: 'namespace',
    scopeId: 'ns-project-starlight-dev',
  },
  // Manager Project Starlight has kubevirt-admin on starlight namespace
  {
    id: 'rb-002',
    roleId: 'role-kubevirt-admin',
    subjectType: 'group',
    subjectId: 'group-manager-project-starlight',
    scope: 'namespace',
    scopeId: 'ns-project-starlight-dev',
  },
  // Network Ops has network-infrastructure-admin on all core-ntwk namespaces
  {
    id: 'rb-003',
    roleId: 'role-network-infra-admin',
    subjectType: 'group',
    subjectId: 'group-network-ops',
    scope: 'clusterSet',
    scopeId: 'cs-na-prod',
  },
  // Add more role bindings as needed
];

// ============================================================================
// INSTANCE TYPES & TEMPLATES
// ============================================================================

export const instanceTypes: InstanceType[] = [
  { id: 'it-small', name: 'small', cpu: 2, memory: '4 GiB', description: 'Small instance for development and testing' },
  { id: 'it-medium', name: 'medium', cpu: 4, memory: '16 GiB', description: 'Medium instance for general workloads' },
  { id: 'it-large', name: 'large', cpu: 8, memory: '32 GiB', description: 'Large instance for demanding applications' },
  { id: 'it-xlarge', name: 'xlarge', cpu: 16, memory: '64 GiB', description: 'Extra large instance for compute-intensive workloads' },
];

export const templates: Template[] = [
  { id: 'tpl-rhel9', name: 'rhel-9-server', os: 'RHEL 9', cpu: 4, memory: '16 GiB', storage: '100 GiB', description: 'Red Hat Enterprise Linux 9 Server' },
  { id: 'tpl-rhel8', name: 'rhel-8-server', os: 'RHEL 8', cpu: 4, memory: '16 GiB', storage: '100 GiB', description: 'Red Hat Enterprise Linux 8 Server' },
  { id: 'tpl-fedora39', name: 'fedora-39-workstation', os: 'Fedora 39', cpu: 2, memory: '8 GiB', storage: '50 GiB', description: 'Fedora 39 Workstation' },
  { id: 'tpl-ubuntu2204', name: 'ubuntu-22-04-server', os: 'Ubuntu 22.04', cpu: 4, memory: '16 GiB', storage: '80 GiB', description: 'Ubuntu 22.04 LTS Server' },
  { id: 'tpl-windows2022', name: 'windows-server-2022', os: 'Windows Server 2022', cpu: 8, memory: '32 GiB', storage: '200 GiB', description: 'Windows Server 2022 Standard' },
];

// ============================================================================
// MIGRATION PLANS
// ============================================================================

export const migrationPlans: MigrationPlan[] = [];

// ============================================================================
// GENERATE ADDITIONAL DATA
// ============================================================================

import {
  generateDevTeamAlphaUsers,
  generateGroupUsers,
  generateVirtualMachines,
} from './dataGenerator';

// Complete dev-team-alpha to 60 users (currently have 8, need 52 more)
const additionalDevTeamAlphaUsers = generateDevTeamAlphaUsers(9, 52);
users.push(...additionalDevTeamAlphaUsers);

// Update dev-team-alpha group with all user IDs
const devTeamAlphaGroup = groups.find(g => g.id === 'group-dev-team-alpha');
if (devTeamAlphaGroup) {
  devTeamAlphaGroup.userIds = users
    .filter(u => u.groupIds.includes('group-dev-team-alpha'))
    .map(u => u.id);
}

// Generate users for network-ops-team (20 users)
const networkOpsUsers = generateGroupUsers('group-network-ops', 'network-ops-team', 66 + 52, 18); // Start after dev-team users
users.push(...networkOpsUsers);
const networkOpsGroup = groups.find(g => g.id === 'group-network-ops');
if (networkOpsGroup) {
  networkOpsGroup.userIds.push(...networkOpsUsers.map(u => u.id));
}

// Generate users for billing-api-team (15 users)
const billingApiUsers = generateGroupUsers('group-billing-api', 'billing-api-team', 136, 15);
users.push(...billingApiUsers);
const billingApiGroup = groups.find(g => g.id === 'group-billing-api');
if (billingApiGroup) {
  billingApiGroup.userIds = billingApiUsers.map(u => u.id);
}

// Generate users for 5g-platform-developers (25 users)
const fivegPlatformUsers = generateGroupUsers('group-5g-platform', '5g-platform-developers', 151, 25);
users.push(...fivegPlatformUsers);
const fivegPlatformGroup = groups.find(g => g.id === 'group-5g-platform');
if (fivegPlatformGroup) {
  fivegPlatformGroup.userIds = fivegPlatformUsers.map(u => u.id);
}

// Generate users for security-ops-team (12 users)
const securityOpsUsers = generateGroupUsers('group-security-ops', 'security-ops-team', 176, 12);
users.push(...securityOpsUsers);
const securityOpsGroup = groups.find(g => g.id === 'group-security-ops');
if (securityOpsGroup) {
  securityOpsGroup.userIds = securityOpsUsers.map(u => u.id);
}

// Generate users for database-admins (8 users)
const databaseAdminUsers = generateGroupUsers('group-database-admins', 'database-admins', 188, 8);
users.push(...databaseAdminUsers);
const databaseAdminsGroup = groups.find(g => g.id === 'group-database-admins');
if (databaseAdminsGroup) {
  databaseAdminsGroup.userIds = databaseAdminUsers.map(u => u.id);
}

// Generate users for monitoring-team (10 users)
const monitoringUsers = generateGroupUsers('group-monitoring', 'monitoring-team', 196, 10);
users.push(...monitoringUsers);
const monitoringGroup = groups.find(g => g.id === 'group-monitoring');
if (monitoringGroup) {
  monitoringGroup.userIds = monitoringUsers.map(u => u.id);
}

// Generate users for edge-platform-team (18 users)
const edgePlatformUsers = generateGroupUsers('group-edge-platform', 'edge-platform-team', 206, 18);
users.push(...edgePlatformUsers);
const edgePlatformGroup = groups.find(g => g.id === 'group-edge-platform');
if (edgePlatformGroup) {
  edgePlatformGroup.userIds = edgePlatformUsers.map(u => u.id);
}

// Generate users for qa-testing-team (15 users)
const qaTestingUsers = generateGroupUsers('group-qa-testing', 'qa-testing-team', 224, 15);
users.push(...qaTestingUsers);
const qaTestingGroup = groups.find(g => g.id === 'group-qa-testing');
if (qaTestingGroup) {
  qaTestingGroup.userIds = qaTestingUsers.map(u => u.id);
}

// Generate users for regional ops (10 each)
const saRegionOpsUsers = generateGroupUsers('group-sa-region-ops', 'sa-region-ops', 239, 10);
users.push(...saRegionOpsUsers);
const saRegionOpsGroup = groups.find(g => g.id === 'group-sa-region-ops');
if (saRegionOpsGroup) {
  saRegionOpsGroup.userIds = saRegionOpsUsers.map(u => u.id);
}

const apacRegionOpsUsers = generateGroupUsers('group-apac-region-ops', 'apac-region-ops', 249, 10);
users.push(...apacRegionOpsUsers);
const apacRegionOpsGroup = groups.find(g => g.id === 'group-apac-region-ops');
if (apacRegionOpsGroup) {
  apacRegionOpsGroup.userIds = apacRegionOpsUsers.map(u => u.id);
}

const euRegionOpsUsers = generateGroupUsers('group-eu-region-ops', 'eu-region-ops', 259, 10);
users.push(...euRegionOpsUsers);
const euRegionOpsGroup = groups.find(g => g.id === 'group-eu-region-ops');
if (euRegionOpsGroup) {
  euRegionOpsGroup.userIds = euRegionOpsUsers.map(u => u.id);
}

// Generate Virtual Machines for each cluster (~80-100 VMs per cluster)
// This will give us ~1,500-2,000 VMs total (scalable to 15,000 if needed)

// US West Prod 01 - Add more VMs (currently has 5, add 75 more)
const usWestVMs = generateVirtualMachines('cluster-us-west-prod-01', 'ns-core-ntwk-usw01', 6, 75);
virtualMachines.push(...usWestVMs);

// US East Prod 02 - Add VMs
const usEastVMs = generateVirtualMachines('cluster-us-east-prod-02', 'ns-core-billing-use02', 1, 80);
virtualMachines.push(...usEastVMs);

// EU West Prod 01 - Add VMs
const euWestVMs = generateVirtualMachines('cluster-eu-west-prod-01', 'ns-core-ntwk-euw01', 1, 85);
virtualMachines.push(...euWestVMs);

// EU East Prod 02 - Add VMs
const euEastVMs = generateVirtualMachines('cluster-eu-east-prod-02', 'ns-core-billing-eue02', 1, 80);
virtualMachines.push(...euEastVMs);

// SA Brazil 01 - Add VMs
const saBrazilVMs = generateVirtualMachines('cluster-sa-prod-brazil-01', 'ns-core-network-sa-br01', 1, 70);
virtualMachines.push(...saBrazilVMs);

// SA Argentina 02 - Add VMs
const saArgentinaVMs = generateVirtualMachines('cluster-sa-prod-argentina-02', 'ns-core-network-sa-ar02', 1, 65);
virtualMachines.push(...saArgentinaVMs);

// SA Chile 03 - Add VMs
const saChileVMs = generateVirtualMachines('cluster-sa-prod-chile-03', 'ns-core-network-sa-cl03', 1, 60);
virtualMachines.push(...saChileVMs);

// SA Colombia 04 - Add VMs
const saColombiaVMs = generateVirtualMachines('cluster-sa-prod-colombia-04', 'ns-core-network-sa-co04', 1, 55);
virtualMachines.push(...saColombiaVMs);

// SA Peru 05 - Add VMs
const saPeruVMs = generateVirtualMachines('cluster-sa-prod-peru-05', 'ns-core-network-sa-pe05', 1, 50);
virtualMachines.push(...saPeruVMs);

// APAC Japan 01 - Add VMs
const apacJapanVMs = generateVirtualMachines('cluster-apac-prod-japan-01', 'ns-core-network-apac-jp01', 1, 90);
virtualMachines.push(...apacJapanVMs);

// APAC Korea 02 - Add VMs
const apacKoreaVMs = generateVirtualMachines('cluster-apac-prod-korea-02', 'ns-core-network-apac-kr02', 1, 85);
virtualMachines.push(...apacKoreaVMs);

// APAC Australia 03 - Add VMs
const apacAustraliaVMs = generateVirtualMachines('cluster-apac-prod-australia-03', 'ns-core-network-apac-au03', 1, 80);
virtualMachines.push(...apacAustraliaVMs);

// APAC Singapore 04 - Add VMs
const apacSingaporeVMs = generateVirtualMachines('cluster-apac-prod-singapore-04', 'ns-core-network-apac-sg04', 1, 85);
virtualMachines.push(...apacSingaporeVMs);

// APAC India 05 - Add VMs
const apacIndiaVMs = generateVirtualMachines('cluster-apac-prod-india-05', 'ns-core-network-apac-in05', 1, 80);
virtualMachines.push(...apacIndiaVMs);

// NA Edge NY 01 - Add VMs
const naEdgeNYVMs = generateVirtualMachines('cluster-na-edge-ny-01', 'ns-edge-core-app-ny01', 1, 40);
virtualMachines.push(...naEdgeNYVMs);

// EU Edge Berlin 01 - Add VMs
const euEdgeBerlinVMs = generateVirtualMachines('cluster-eu-edge-berlin-01', 'ns-edge-core-app-ber01', 1, 40);
virtualMachines.push(...euEdgeBerlinVMs);

// Dev Team A - Add more VMs (currently has 4, add 16 more)
const devTeamAVMs = generateVirtualMachines('cluster-dev-team-a', 'ns-project-starlight-dev', 5, 16);
virtualMachines.push(...devTeamAVMs);

// Dev Team B - Add VMs
const devTeamBVMs = generateVirtualMachines('cluster-dev-team-b', 'ns-project-starlight-dev-b', 1, 18);
virtualMachines.push(...devTeamBVMs);

// QA Env - Add VMs
const qaEnvVMs = generateVirtualMachines('cluster-qa-env', 'ns-qa-testing', 1, 25);
virtualMachines.push(...qaEnvVMs);

// Total VMs: ~1,300+ (can be scaled to 15,000 by generating more per cluster)
// Total Users: ~270+ (can be scaled to 400+ by adding more groups/users)

// ============================================================================
// EXPORT ALL DATA
// ============================================================================

export const mockDatabase = {
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

export default mockDatabase;

