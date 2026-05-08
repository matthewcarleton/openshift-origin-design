# Mock Database Usage Examples

## Example 1: Display Clusters Page

```typescript
import React from 'react';
import {
  getAllClusters,
  getClusterSetById,
  getVirtualMachinesByCluster,
} from '@app/data';

export const ClustersPage: React.FC = () => {
  const clusters = getAllClusters();
  
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Cluster Set</Th>
          <Th>Status</Th>
          <Th>Region</Th>
          <Th>VMs</Th>
        </Tr>
      </Thead>
      <Tbody>
        {clusters.map(cluster => {
          const clusterSet = getClusterSetById(cluster.clusterSetId);
          const vms = getVirtualMachinesByCluster(cluster.id);
          
          return (
            <Tr key={cluster.id}>
              <Td>{cluster.name}</Td>
              <Td>{clusterSet?.name}</Td>
              <Td>{cluster.status}</Td>
              <Td>{cluster.region}</Td>
              <Td>{vms.length}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
```

## Example 2: Virtual Machines Page with Filters

```typescript
import React, { useState, useMemo } from 'react';
import {
  getAllVirtualMachines,
  getClusterById,
  getNamespaceById,
} from '@app/data';

export const VirtualMachinesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [osFilter, setOSFilter] = useState('All');
  
  const allVMs = getAllVirtualMachines();
  
  const filteredVMs = useMemo(() => {
    return allVMs.filter(vm => {
      const matchesStatus = statusFilter === 'All' || vm.status === statusFilter;
      const matchesOS = osFilter === 'All' || vm.os === osFilter;
      return matchesStatus && matchesOS;
    });
  }, [allVMs, statusFilter, osFilter]);
  
  return (
    <div>
      <Toolbar>
        <Select value={statusFilter} onChange={setStatusFilter}>
          <option>All</option>
          <option>Running</option>
          <option>Stopped</option>
          <option>Error</option>
          <option>Paused</option>
        </Select>
        
        <Select value={osFilter} onChange={setOSFilter}>
          <option>All</option>
          <option>RHEL 8</option>
          <option>RHEL 9</option>
          <option>Fedora 38</option>
          <option>Fedora 39</option>
          <option>Ubuntu 22.04</option>
        </Select>
      </Toolbar>
      
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Cluster</Th>
            <Th>Namespace</Th>
            <Th>Status</Th>
            <Th>OS</Th>
            <Th>CPU</Th>
            <Th>Memory</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredVMs.map(vm => {
            const cluster = getClusterById(vm.clusterId);
            const namespace = getNamespaceById(vm.namespaceId);
            
            return (
              <Tr key={vm.id}>
                <Td>{vm.name}</Td>
                <Td>{cluster?.name}</Td>
                <Td>{namespace?.name}</Td>
                <Td><Label color={getStatusColor(vm.status)}>{vm.status}</Label></Td>
                <Td>{vm.os}</Td>
                <Td>{vm.cpu}</Td>
                <Td>{vm.memory}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};
```

## Example 3: Identities Page (Users and Groups)

```typescript
import React, { useState } from 'react';
import {
  getAllUsers,
  getAllGroups,
  getGroupById,
  getUsersByGroup,
} from '@app/data';

export const IdentitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');
  const users = getAllUsers();
  const groups = getAllGroups();
  
  return (
    <Tabs activeKey={activeTab} onSelect={setActiveTab}>
      <Tab eventKey="users" title={`Users (${users.length})`}>
        <Table>
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Groups</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(user => (
              <Tr key={user.id}>
                <Td>{user.username}</Td>
                <Td>{user.firstName} {user.lastName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.groupIds.length}</Td>
                <Td><Label>{user.status}</Label></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Tab>
      
      <Tab eventKey="groups" title={`Groups (${groups.length})`}>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Type</Th>
              <Th>Members</Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.map(group => (
              <Tr key={group.id}>
                <Td>{group.name}</Td>
                <Td>{group.description}</Td>
                <Td>{group.type}</Td>
                <Td>{group.userIds.length}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Tab>
    </Tabs>
  );
};
```

## Example 4: Roles Page

```typescript
import React from 'react';
import {
  getAllRoles,
  getRolesByType,
} from '@app/data';

export const RolesPage: React.FC = () => {
  const defaultRoles = getRolesByType('default');
  const customRoles = getRolesByType('custom');
  
  return (
    <div>
      <Section title="Default Roles">
        <p>These are built-in KubeVirt roles provided by the platform.</p>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Description</Th>
              <Th>Permissions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {defaultRoles.map(role => (
              <Tr key={role.id}>
                <Td>{role.name}</Td>
                <Td><Label>{role.category}</Label></Td>
                <Td>{role.description}</Td>
                <Td>{role.permissions.length} permissions</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Section>
      
      <Section title="Custom Roles">
        <p>Custom roles created by administrators.</p>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Description</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customRoles.map(role => (
              <Tr key={role.id}>
                <Td>{role.name}</Td>
                <Td><Label>{role.category}</Label></Td>
                <Td>{role.description}</Td>
                <Td>{new Date(role.created!).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Section>
    </div>
  );
};
```

## Example 5: Dashboard Statistics

```typescript
import React from 'react';
import { getStatistics, getClustersByRegion } from '@app/data';

export const Dashboard: React.FC = () => {
  const stats = getStatistics();
  
  return (
    <Grid>
      <GridItem span={3}>
        <Card>
          <CardTitle>Cluster Sets</CardTitle>
          <CardBody>
            <Title size="4xl">{stats.totalClusterSets}</Title>
          </CardBody>
        </Card>
      </GridItem>
      
      <GridItem span={3}>
        <Card>
          <CardTitle>Clusters</CardTitle>
          <CardBody>
            <Title size="4xl">{stats.totalClusters}</Title>
            <ul>
              <li>North America: {stats.clustersByRegion.northAmerica}</li>
              <li>Europe: {stats.clustersByRegion.europe}</li>
              <li>South America: {stats.clustersByRegion.southAmerica}</li>
              <li>Asia-Pacific: {stats.clustersByRegion.asiaPacific}</li>
            </ul>
          </CardBody>
        </Card>
      </GridItem>
      
      <GridItem span={3}>
        <Card>
          <CardTitle>Virtual Machines</CardTitle>
          <CardBody>
            <Title size="4xl">{stats.totalVirtualMachines}</Title>
            <ul>
              <li>Running: {stats.vmsByStatus.running}</li>
              <li>Stopped: {stats.vmsByStatus.stopped}</li>
              <li>Error: {stats.vmsByStatus.error}</li>
              <li>Paused: {stats.vmsByStatus.paused}</li>
            </ul>
          </CardBody>
        </Card>
      </GridItem>
      
      <GridItem span={3}>
        <Card>
          <CardTitle>Users & Groups</CardTitle>
          <CardBody>
            <Title size="4xl">{stats.totalUsers}</Title>
            <p>{stats.totalGroups} groups</p>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};
```

## Example 6: Cluster Detail Page with Full Context

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { getClusterWithDetails } from '@app/data';

export const ClusterDetailPage: React.FC = () => {
  const { clusterId } = useParams<{ clusterId: string }>();
  const clusterDetails = getClusterWithDetails(clusterId!);
  
  if (!clusterDetails) {
    return <EmptyState>Cluster not found</EmptyState>;
  }
  
  return (
    <div>
      <PageSection>
        <Title headingLevel="h1">{clusterDetails.name}</Title>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster Set</DescriptionListTerm>
            <DescriptionListDescription>
              {clusterDetails.clusterSet?.name}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Status</DescriptionListTerm>
            <DescriptionListDescription>
              <Label color={getStatusColor(clusterDetails.status)}>
                {clusterDetails.status}
              </Label>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Region</DescriptionListTerm>
            <DescriptionListDescription>
              {clusterDetails.region}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Kubernetes Version</DescriptionListTerm>
            <DescriptionListDescription>
              {clusterDetails.kubernetesVersion}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>
      
      <PageSection>
        <Title headingLevel="h2">Namespaces ({clusterDetails.namespaces.length})</Title>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Virtual Machines</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clusterDetails.namespaces.map(ns => {
              const nsVMs = clusterDetails.virtualMachines.filter(
                vm => vm.namespaceId === ns.id
              );
              return (
                <Tr key={ns.id}>
                  <Td>{ns.name}</Td>
                  <Td>{ns.type}</Td>
                  <Td>{nsVMs.length}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </PageSection>
      
      <PageSection>
        <Title headingLevel="h2">
          Virtual Machines ({clusterDetails.virtualMachines.length})
        </Title>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Namespace</Th>
              <Th>Status</Th>
              <Th>OS</Th>
              <Th>CPU</Th>
              <Th>Memory</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clusterDetails.virtualMachines.map(vm => {
              const ns = clusterDetails.namespaces.find(n => n.id === vm.namespaceId);
              return (
                <Tr key={vm.id}>
                  <Td>{vm.name}</Td>
                  <Td>{ns?.name}</Td>
                  <Td><Label color={getStatusColor(vm.status)}>{vm.status}</Label></Td>
                  <Td>{vm.os}</Td>
                  <Td>{vm.cpu}</Td>
                  <Td>{vm.memory}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </PageSection>
    </div>
  );
};
```

## Key Takeaways

1. **Import from `@app/data`** - All data and query functions are available
2. **Use query functions** - Don't access arrays directly, use the helper functions
3. **Relationships are maintained** - Use IDs to look up related data
4. **Type-safe** - All data has TypeScript interfaces
5. **Easy to mock** - Perfect for development and testing
6. **Ready for API** - Just swap query functions with API calls later

