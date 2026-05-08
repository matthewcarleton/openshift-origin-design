// Access Control Schema Types

export interface Role {
  id: string;
  name: string;
  displayName: string; // Natural language name like "Virtualization admin"
  type: 'default' | 'custom';
  category: 'kubevirt' | 'cluster' | 'namespace' | 'application' | 'open-cluster-management';
  description: string;
  permissions: string[];
  created?: string;
}

export interface RoleBinding {
  id: string;
  roleId: string;
  subjectType: 'user' | 'group' | 'serviceAccount';
  subjectId: string;
  scope: 'cluster' | 'namespace' | 'clusterSet';
  scopeId: string; // clusterId, namespaceId, or clusterSetId
}

