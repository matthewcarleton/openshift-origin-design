// Infrastructure Schema Types

export interface ClusterSet {
  id: string;
  name: string;
  description: string;
  region: 'North America' | 'Europe' | 'South America' | 'Asia-Pacific' | 'Global';
  type: 'production' | 'development' | 'staging';
  clusterIds: string[];
}

export interface Cluster {
  id: string;
  name: string;
  clusterSetId: string;
  status: 'Ready' | 'Not Ready' | 'Degraded' | 'Unknown';
  kubernetesVersion: string;
  region: string;
  location: string;
  nodes: number;
  namespaceIds: string[];
}

export interface Namespace {
  id: string;
  name: string;
  clusterId: string;
  type: 'infrastructure' | 'application' | 'development' | 'qa' | 'database' | 'monitoring';
  labels: Record<string, string>;
}

