import React, { useState, useMemo } from 'react';
import {
  Page,
  PageSection,
  Title,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Button,
  Flex,
  FlexItem,
  Badge,
  Label,
  LabelGroup,
  Gallery,
  GalleryItem,
  Alert,
  Progress,
  ProgressSize,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InfoCircleIcon,
  ExternalLinkAltIcon,
  CogIcon,
  SyncIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';

interface InstalledOperator {
  id: string;
  name: string;
  displayName: string;
  namespace: string;
  version: string;
  availableVersion?: string;
  channel: string;
  source: string;
  status: 'Succeeded' | 'Installing' | 'Failed' | 'Pending';
  health: 'Healthy' | 'Warning' | 'Critical';
  olmVersion: 'v0' | 'v1';
  lastUpdated: string;
  upgradeAvailable: boolean;
  managedBy: string;
}

const mockInstalledOperators: InstalledOperator[] = [
  {
    id: 'prometheus-operator',
    name: 'prometheus-operator',
    displayName: 'Prometheus Operator',
    namespace: 'openshift-monitoring',
    version: '0.64.1',
    availableVersion: '0.65.1',
    channel: 'stable',
    source: 'redhat-operators',
    status: 'Succeeded',
    health: 'Healthy',
    olmVersion: 'v0',
    lastUpdated: '2 days ago',
    upgradeAvailable: true,
    managedBy: 'OLM',
  },
  {
    id: 'elasticsearch-operator',
    name: 'elasticsearch-operator',
    displayName: 'OpenShift Elasticsearch Operator',
    namespace: 'openshift-logging',
    version: '5.7.2',
    availableVersion: '5.8.0',
    channel: 'stable-5.7',
    source: 'redhat-operators',
    status: 'Succeeded',
    health: 'Warning',
    olmVersion: 'v0',
    lastUpdated: '1 week ago',
    upgradeAvailable: true,
    managedBy: 'OLM',
  },
  {
    id: 'jaeger-operator',
    name: 'jaeger-operator',
    displayName: 'Red Hat OpenShift distributed tracing platform',
    namespace: 'openshift-distributed-tracing',
    version: '1.51.0',
    channel: 'stable',
    source: 'redhat-operators',
    status: 'Succeeded',
    health: 'Healthy',
    olmVersion: 'v1',
    lastUpdated: '3 days ago',
    upgradeAvailable: false,
    managedBy: 'OLM',
  },
  {
    id: 'aws-load-balancer-operator',
    name: 'aws-load-balancer-operator',
    displayName: 'AWS Load Balancer Operator',
    namespace: 'aws-load-balancer-operator',
    version: '1.0.1',
    availableVersion: '1.1.0',
    channel: 'stable-v1',
    source: 'certified-operators',
    status: 'Failed',
    health: 'Critical',
    olmVersion: 'v1',
    lastUpdated: '5 days ago',
    upgradeAvailable: true,
    managedBy: 'OLM',
  },
  {
    id: 'grafana-operator',
    name: 'grafana-operator',
    displayName: 'Grafana Operator',
    namespace: 'grafana-system',
    version: '5.0.0',
    channel: 'v5',
    source: 'community-operators',
    status: 'Succeeded',
    health: 'Healthy',
    olmVersion: 'v1',
    lastUpdated: '1 day ago',
    upgradeAvailable: false,
    managedBy: 'OLM',
  },
];

const InstalledSoftware: React.FunctionComponent = () => {
  useDocumentTitle('Installed Software');

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperators = useMemo(() => {
    return mockInstalledOperators.filter(operator =>
      operator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.namespace.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Succeeded':
        return <CheckCircleIcon color="green" />;
      case 'Failed':
        return <ExclamationTriangleIcon color="red" />;
      case 'Installing':
        return <SyncIcon color="blue" />;
      case 'Pending':
        return <InfoCircleIcon color="orange" />;
      default:
        return <InfoCircleIcon />;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'Healthy':
        return <Badge color="green">Healthy</Badge>;
      case 'Warning':
        return <Badge color="orange">Warning</Badge>;
      case 'Critical':
        return <Badge color="red">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getOlmVersionLabel = (olmVersion: string) => {
    return (
      <Badge isRead={olmVersion === 'v0'}>
        OLM {olmVersion}
      </Badge>
    );
  };

  const upgradeableCount = filteredOperators.filter(op => op.upgradeAvailable).length;
  const healthyCount = filteredOperators.filter(op => op.health === 'Healthy').length;
  const healthPercentage = Math.round((healthyCount / filteredOperators.length) * 100);

  return (
    <Page>
      <PageSection style={{ padding: '32px', backgroundColor: 'var(--pf-v6-global--BackgroundColor--100)' }}>
        <div style={{ marginBottom: '32px' }}>
          <Title headingLevel="h1" size="2xl">
            Installed Software
          </Title>
          <p style={{ marginTop: '8px', fontSize: '16px', color: 'var(--pf-v6-global--Color--200)' }}>
            Monitor and manage your installed operators and applications
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ marginBottom: '32px' }}>
          <Gallery hasGutter minWidths={{ default: '250px' }}>
            <GalleryItem>
              <Card isCompact>
                <CardHeader>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>Total Installed</FlexItem>
                      <FlexItem>
                        <Badge>{filteredOperators.length}</Badge>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ fontSize: '14px' }}>
                    Operators and applications currently running in your cluster
                  </div>
                </CardBody>
              </Card>
            </GalleryItem>

            <GalleryItem>
              <Card isCompact>
                <CardHeader>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>Updates Available</FlexItem>
                      <FlexItem>
                        <Badge color={upgradeableCount > 0 ? 'orange' : 'green'}>
                          {upgradeableCount}
                        </Badge>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{ fontSize: '14px' }}>
                    {upgradeableCount > 0 ? 'New versions available for upgrade' : 'All software is up to date'}
                  </div>
                </CardBody>
              </Card>
            </GalleryItem>

            <GalleryItem>
              <Card isCompact>
                <CardHeader>
                  <CardTitle>Cluster Health</CardTitle>
                </CardHeader>
                <CardBody>
                  <Progress
                    value={healthPercentage}
                    title="Overall Health"
                    size={ProgressSize.sm}
                    label={`${healthyCount} of ${filteredOperators.length} healthy`}
                  />
                </CardBody>
              </Card>
            </GalleryItem>
          </Gallery>
        </div>

        {upgradeableCount > 0 && (
          <Alert
            variant="info"
            title={`${upgradeableCount} software updates available`}
            style={{ marginBottom: '32px' }}
            actionLinks={
              <Button variant="link" component="a" href="/operator-lifecycle">
                Manage Upgrades
              </Button>
            }
          >
            Review and approve pending software updates to keep your cluster secure and up-to-date.
          </Alert>
        )}

        {/* Installed Software Table */}
        <Card>
          <CardHeader>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <SearchInput
                    placeholder="Search installed software..."
                    value={searchTerm}
                    onChange={(_event, value) => setSearchTerm(value)}
                    onClear={() => setSearchTerm('')}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="primary" component="a" href="/software-catalog">
                    Install New Software
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="secondary" component="a" href="/operator-lifecycle">
                    Manage Lifecycle
                  </Button>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </CardHeader>

          <CardBody style={{ padding: '0' }}>
            <Table variant="compact">
              <Thead>
                <Tr>
                  <Th>Software</Th>
                  <Th>Version</Th>
                  <Th>Status</Th>
                  <Th>Health</Th>
                  <Th>Channel</Th>
                  <Th>OLM Version</Th>
                  <Th>Last Updated</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOperators.map((operator) => (
                  <Tr key={operator.id}>
                    <Td>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{operator.displayName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--pf-v6-global--Color--200)' }}>
                          {operator.namespace}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div>
                        <div>{operator.version}</div>
                        {operator.upgradeAvailable && operator.availableVersion && (
                          <div style={{ fontSize: '12px', color: 'var(--pf-v6-global--warning-color--100)' }}>
                            → {operator.availableVersion} available
                          </div>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <Flex alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>{getStatusIcon(operator.status)}</FlexItem>
                        <FlexItem>{operator.status}</FlexItem>
                      </Flex>
                    </Td>
                    <Td>
                      {getHealthBadge(operator.health)}
                    </Td>
                    <Td>
                      <div>
                        <div>{operator.channel}</div>
                        <div style={{ fontSize: '12px', color: 'var(--pf-v6-global--Color--200)' }}>
                          {operator.source}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      {getOlmVersionLabel(operator.olmVersion)}
                    </Td>
                    <Td>{operator.lastUpdated}</Td>
                    <Td>
                      <Flex>
                        <FlexItem>
                          <Button variant="link" size="sm">
                            <CogIcon /> Configure
                          </Button>
                        </FlexItem>
                        {operator.upgradeAvailable && (
                          <FlexItem>
                            <Button variant="link" size="sm">
                              <SyncIcon /> Update
                            </Button>
                          </FlexItem>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};

export { InstalledSoftware };
