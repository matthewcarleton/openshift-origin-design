// Data Generator - Programmatically generate additional mock data

import { User } from './schemas/identity';
import { VirtualMachine } from './schemas/virtualization';

// Helper to generate realistic names
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
];

const vmPrefixes = [
  'api-server', 'web-app', 'database', 'cache-node', 'worker',
  'gateway', 'proxy', 'load-balancer', 'router', 'controller',
  'service', 'app', 'backend', 'frontend', 'middleware',
];

const osTypes = ['RHEL 8', 'RHEL 9', 'Fedora 38', 'Fedora 39', 'Ubuntu 22.04', 'Windows Server 2019', 'Windows Server 2022'];
const statuses = ['Running', 'Running', 'Running', 'Running', 'Stopped', 'Error', 'Paused']; // Weighted towards Running

// Generate additional users for dev-team-alpha (complete to 60)
export function generateDevTeamAlphaUsers(startId: number, count: number): User[] {
  const users: User[] = [];
  const baseDate = new Date('2023-01-15T10:00:00Z');
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const created = new Date(baseDate.getTime() + i * 5 * 60 * 1000).toISOString(); // 5 minutes apart
    
    // Random last login within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const lastLogin = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    users.push({
      id: `user-${String(startId + i).padStart(3, '0')}`,
      username,
      firstName,
      lastName,
      email: `${username}@petemobile.com`,
      status: 'Active',
      groupIds: ['group-dev-team-alpha'],
      identityProviderId: 'idp-001', // PeteMobile LDAP
      created,
      lastLogin,
    });
  }
  
  return users;
}

// Generate users for other groups
export function generateGroupUsers(
  groupId: string,
  groupName: string,
  startId: number,
  count: number
): User[] {
  const users: User[] = [];
  const baseDate = new Date('2023-01-20T10:00:00Z');
  const now = new Date();
  
  // Assign identity providers based on group type
  const identityProviders = ['idp-001', 'idp-002', 'idp-003']; // LDAP, SAML, OpenID Connect
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const created = new Date(baseDate.getTime() + i * 5 * 60 * 1000).toISOString();
    
    // Random last login within the last 60 days
    const daysAgo = Math.floor(Math.random() * 60);
    const lastLogin = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    // Distribute users across identity providers
    const idpIndex = i % identityProviders.length;
    
    users.push({
      id: `user-${String(startId + i).padStart(3, '0')}`,
      username,
      firstName,
      lastName,
      email: `${username}@petemobile.com`,
      status: Math.random() > 0.95 ? 'Inactive' : 'Active', // 5% inactive
      groupIds: [groupId],
      identityProviderId: identityProviders[idpIndex],
      created,
      lastLogin,
    });
  }
  
  return users;
}

// Generate virtual machines for a cluster/namespace
export function generateVirtualMachines(
  clusterId: string,
  namespaceId: string,
  startId: number,
  count: number,
  namePrefix?: string
): VirtualMachine[] {
  const vms: VirtualMachine[] = [];
  const baseDate = new Date('2024-01-15T10:00:00Z');
  
  for (let i = 0; i < count; i++) {
    const prefix = namePrefix || vmPrefixes[Math.floor(Math.random() * vmPrefixes.length)];
    const vmNumber = String(i + 1).padStart(3, '0');
    const os = osTypes[Math.floor(Math.random() * osTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const cpu = [2, 4, 8, 16][Math.floor(Math.random() * 4)];
    const memory = [`${cpu * 4} GiB`, `${cpu * 8} GiB`][Math.floor(Math.random() * 2)];
    const storage = ['50 GiB', '100 GiB', '150 GiB', '200 GiB', '500 GiB'][Math.floor(Math.random() * 5)];
    const created = new Date(baseDate.getTime() + i * 10 * 60 * 1000).toISOString();
    
    // Generate IP address based on cluster
    const clusterOctet = parseInt(clusterId.split('-').pop() || '1', 10) || 1;
    const ipAddress = `10.${clusterOctet}.${Math.floor(i / 250)}.${(i % 250) + 10}`;
    
    vms.push({
      id: `vm-${clusterId.replace('cluster-', '')}-${String(startId + i).padStart(3, '0')}`,
      name: `${prefix}-${vmNumber}`,
      clusterId,
      namespaceId,
      status: status as any,
      os: os as any,
      cpu,
      memory,
      storage,
      ipAddress,
      node: `node-${clusterId.replace('cluster-', '')}-${String((i % 10) + 1).padStart(2, '0')}`,
      created,
    });
  }
  
  return vms;
}

