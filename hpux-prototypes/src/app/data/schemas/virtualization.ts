// Virtualization Schema Types

export interface VirtualMachine {
  id: string;
  name: string;
  clusterId: string;
  namespaceId: string;
  status: 'Running' | 'Stopped' | 'Error' | 'Paused' | 'Starting' | 'Stopping' | 'Migrating' | 'Pending' | 'Migrated';
  os: 'RHEL 8' | 'RHEL 9' | 'Fedora 38' | 'Fedora 39' | 'Windows Server 2019' | 'Windows Server 2022' | 'Ubuntu 22.04';
  cpu: number; // cores
  memory: string; // e.g., "8 GiB"
  storage: string; // e.g., "50 GiB"
  ipAddress: string;
  node: string;
  created: string; // ISO date string
  migrationProgress?: number; // 0-100 for migration percentage
}

export interface InstanceType {
  id: string;
  name: string;
  cpu: number;
  memory: string;
  description: string;
}

export interface Template {
  id: string;
  name: string;
  os: string;
  description: string;
  cpu: number;
  memory: string;
  storage: string;
}

export interface MigrationPlan {
  id: string;
  name: string;
  namespace: string;
  sourceProvider: string;
  targetProvider: string;
  sourceClusterId: string;
  targetClusterId: string;
  targetNamespaceId: string;
  vmIds: string[]; // IDs of VMs being migrated
  status: 'Ready to migrate' | 'In progress' | 'Completed' | 'Failed' | 'Cancelled';
  migrationReadiness: 'Ready to migrate' | 'Not ready';
  migrationType: 'Live' | 'Cold';
  createdAt: string; // ISO date string
  startedAt?: string; // ISO date string
  completedAt?: string; // ISO date string
  owner?: string;
  transferNetwork?: string;
  conditions: MigrationCondition[];
}

export interface MigrationCondition {
  type: string;
  status: boolean;
  updated: string; // ISO date string
  reason: string;
  message: string;
}

