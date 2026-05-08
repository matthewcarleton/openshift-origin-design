import React, { useMemo } from 'react';
import {
  Title,
  Content,
  Card,
  CardBody,
  CardTitle,
  Stack,
  StackItem,
  List,
  ListItem,
  Flex,
  FlexItem,
  Divider,
  Badge,
  Alert,
  AlertVariant,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { WizardData } from './Step2ObservabilityComponents';

interface Step3ReviewAndInstallProps {
  data: WizardData;
  onDataChange: (data: Partial<WizardData>) => void;
}

// UI Plugin definitions (matching Step2ObservabilityComponents)
interface UIPlugin {
  id: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  dependencies?: string[];
}

const uiPlugins: UIPlugin[] = [
  {
    id: 'monitoring-ui',
    name: 'Monitoring UI Plugin (Metrics)',
    description: 'Adds the Metrics, Alerting, and Incidents pages to the Observe menu.',
    defaultEnabled: true,
    dependencies: ['metrics-alerting'],
  },
  {
    id: 'logging-ui',
    name: 'Logging UI Plugin (Logs)',
    description: 'Log exploration.',
    defaultEnabled: false,
    dependencies: ['loki'],
  },
  {
    id: 'tracing-ui',
    name: 'Tracing UI Plugin (Traces)',
    description: 'Distributed traces.',
    defaultEnabled: false,
    dependencies: ['tempo'],
  },
  {
    id: 'troubleshooting-panel',
    name: 'Troubleshooting Panel UI (Signal correlation)',
    description: 'Signal correlation.',
    defaultEnabled: false,
    dependencies: ['korrel8r'],
  },
  {
    id: 'perses',
    name: 'Custom dashboards UI (Perses)',
    description: 'Enables the Perses dashboard engine for creating and visualizing custom metrics and dashboards directly in the Console.',
    defaultEnabled: false,
    dependencies: ['metrics-alerting'],
  },
  {
    id: 'incident-detection-ui',
    name: 'Incident Detection UI Plugin (Alerts)',
    description: 'Incident detection and alerting.',
    defaultEnabled: false,
    dependencies: ['loki'],
  },
  {
    id: 'network-ui',
    name: 'Network UI Plugin (Flows)',
    description: 'Network traffic visualization.',
    defaultEnabled: false,
    dependencies: ['network-traffic'],
  },
];

export const Step3ReviewAndInstall: React.FC<Step3ReviewAndInstallProps> = ({
  data,
  onDataChange,
}) => {
  // Calculate resources based on selected capabilities
  const estimatedResources = useMemo(() => {
    // Base values
    let cpu = 12; // Base CPU cores
    let memory = 28; // Base memory in GB
    let localCache = 100; // Base local cache in GB
    let objectStorage = 1.2; // Base object storage in TB/month (only used if Thanos is ON)
    const hasThanos = data.selectedCapabilities.includes('thanos');
    const hasLoki = data.selectedCapabilities.includes('loki');
    const hasNetObserve = data.selectedCapabilities.includes('network-traffic');

    // If NetObserve is ON: Increase CPU estimates due to high-volume flow processing
    if (hasNetObserve) {
      cpu += 3; // Additional CPU for flow processing
    }

    // If Logging (Loki) is ON: Increase Local Cache by ~40%
    if (hasLoki) {
      localCache = Math.round(localCache * 1.4); // 100 * 1.4 = 140 GB
    }

    // If Logging (Loki) is ON and Thanos is ON: Increase Object Storage by ~40%
    if (hasLoki && hasThanos) {
      objectStorage = Math.round(objectStorage * 1.4 * 10) / 10; // 1.2 * 1.4 = 1.68 TB, rounded to 1 decimal
    }

    return {
      cpu,
      memory,
      localCache,
      objectStorage,
      hasThanos,
    };
  }, [data.selectedCapabilities]);

  // BOM Table data structure
  interface BOMItem {
    name: string;
    id: string;
    version?: string;
    channel?: string;
    type: 'operator' | 'storage';
  }

  // Get operators to install based on selected capabilities from Step 2
  // Maps each selected capability to its corresponding operator with version info
  const bomData = useMemo(() => {
    const items: BOMItem[] = [];
    
    if (!data.selectedCapabilities || !Array.isArray(data.selectedCapabilities)) {
      return items;
    }
    
    // Cluster Observability Operator - included if metrics-alerting is selected (required)
    // This operator includes: Prometheus, Alertmanager, and optionally Thanos and Korrel8r as operands
    if (data.selectedCapabilities.includes('metrics-alerting')) {
      const versionInfo = data.operatorVersions?.['metrics-alerting'];
      items.push({ 
        name: 'Cluster Observability Operator (Prometheus)', 
        id: 'metrics-alerting',
        version: versionInfo?.version,
        channel: versionInfo?.channel,
        type: 'operator'
      });
    }
    
    // Long-term Storage (Thanos) - shown as a component when selected
    // Note: Thanos is technically an operand of Cluster Observability Operator, but we display it separately for clarity
    if (data.selectedCapabilities.includes('thanos')) {
      const versionInfo = data.operatorVersions?.['thanos'];
      items.push({ 
        name: 'Long-term Storage (Thanos)', 
        id: 'thanos',
        version: versionInfo?.version,
        channel: versionInfo?.channel,
        type: 'operator'
      });
    }
    
    // Map capabilities to their corresponding operators
    const capabilityToOperatorMap: { [key: string]: string } = {
      'loki': 'Centralized Logging (Loki)',
      'tempo': 'Distributed Tracing (Tempo)',
      'network-traffic': 'Network Traffic Analysis (NetObserve)',
      'opentelemetry': 'Telemetry Pipeline (OpenTelemetry)',
      'incident-detection': 'Incident Detection (Native)',
    };
    
    // Add operators for each selected capability
    data.selectedCapabilities.forEach(capabilityId => {
      // Skip thanos (already handled above) and korrel8r as they are operands of Cluster Observability Operator
      if (capabilityId === 'thanos' || capabilityId === 'korrel8r') {
        return;
      }
      
      const operatorName = capabilityToOperatorMap[capabilityId];
      if (operatorName) {
        const versionInfo = data.operatorVersions?.[capabilityId];
        items.push({ 
          name: operatorName, 
          id: capabilityId,
          version: versionInfo?.version,
          channel: versionInfo?.channel,
          type: 'operator'
        });
      }
    });
    
    // Add storage items
    if (data.selectedStorage && Array.isArray(data.selectedStorage) && data.selectedStorage.length > 0) {
      data.selectedStorage.forEach(storageId => {
        const storageNameMap: { [key: string]: string } = {
          'odf': 'OpenShift Data Foundation (ODF)',
          'lvm': 'Logical Volume Manager (LVM)',
        };
        const versionInfo = data.storageVersions?.[storageId];
        items.push({
          name: storageNameMap[storageId] || storageId,
          id: storageId,
          version: versionInfo?.version,
          channel: versionInfo?.channel,
          type: 'storage'
        });
      });
    }
    
    return items;
  }, [data.selectedCapabilities, data.selectedStorage, data.operatorVersions, data.storageVersions]);

  // Separate operators and storage for grouped display
  const operatorsBOM = useMemo(() => bomData.filter(item => item.type === 'operator'), [bomData]);
  const storageBOM = useMemo(() => bomData.filter(item => item.type === 'storage'), [bomData]);

  // Get UI components to install based on selected UI plugins from Step 2
  const uiComponentsToInstall = useMemo(() => {
    const components: string[] = [];
    
    if (!data.selectedUIPlugins || !Array.isArray(data.selectedUIPlugins)) {
      return components;
    }
    
    // Map selected UI plugin IDs to their names
    data.selectedUIPlugins.forEach(pluginId => {
      const plugin = uiPlugins.find(p => p.id === pluginId);
      if (plugin && !components.includes(plugin.name)) {
        components.push(plugin.name);
      }
    });
    
    return components;
  }, [data.selectedUIPlugins]);

  return (
    <div style={{ maxWidth: '800px', marginTop: '24px', marginLeft: '24px' }}>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" size="2xl" style={{ fontSize: '24px', marginBottom: '24px' }}>
            Review and Install
          </Title>
        </StackItem>

        {/* Installation Details */}
        <StackItem>
          <Card>
            <CardTitle>Installation details</CardTitle>
            <CardBody>
              <List>
                <ListItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Content style={{ fontWeight: '600', fontSize: '14px' }}>Namespace:</Content>
                    </FlexItem>
                    <FlexItem>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Badge style={{ backgroundColor: '#1e4f18', color: '#fff', marginRight: '4px' }}>PR</Badge>
                        <Content style={{ fontSize: '14px', fontWeight: '600' }}>
                          {data.installationNamespace === 'recommended'
                            ? 'openshift-cluster-observability-operator'
                            : data.selectedProject || 'Not selected'}
                        </Content>
                      </span>
                    </FlexItem>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Content style={{ fontWeight: '600', fontSize: '14px' }}>Scope:</Content>
                    </FlexItem>
                    <FlexItem>
                      <Content style={{ fontSize: '14px' }}>
                        {data.installationMode === 'all-namespaces' ? 'All namespaces' : 'A specific namespace'}
                      </Content>
                    </FlexItem>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Content style={{ fontWeight: '600', fontSize: '14px' }}>Cluster monitoring (recommended):</Content>
                    </FlexItem>
                    <FlexItem>
                      <Content style={{ fontSize: '14px' }}>
                        {data.enableClusterMonitoring ? 'Enabled' : 'Disabled'}
                      </Content>
                    </FlexItem>
                  </Flex>
                  {!data.enableClusterMonitoring && 
                   (data.selectedPersona === 'administrator' || data.selectedPersona === 'sre') && (
                    <div style={{ marginTop: '8px', width: '100%' }}>
                      <Alert
                        variant={AlertVariant.info}
                        isInline
                        title="Cluster monitoring disabled"
                      >
                        You might miss critical alerts regarding the health of the Observability Operator itself. For high availability environments, enabling cluster monitoring is recommended.
                      </Alert>
                    </div>
                  )}
                </ListItem>
                <ListItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Content style={{ fontWeight: '600', fontSize: '14px' }}>Update Channel:</Content>
                    </FlexItem>
                    <FlexItem>
                      <Content style={{ fontSize: '14px' }}>{data.updateChannel || 'stable'}</Content>
                    </FlexItem>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Content style={{ fontWeight: '600', fontSize: '14px' }}>Update approval:</Content>
                    </FlexItem>
                    <FlexItem>
                      <Content style={{ fontSize: '14px' }}>
                        {(data.updateApproval || 'manual') === 'automatic' ? 'Automatic' : 'Manual'}
                      </Content>
                    </FlexItem>
                  </Flex>
                  {(data.updateApproval || 'manual') === 'manual' && (
                    <div style={{ marginTop: '8px', width: '100%' }}>
                      <Alert
                        variant={AlertVariant.info}
                        isInline
                        title="Manual approval applies to all operators in a namespace"
                      >
                        Installing an operator with manual approval causes all operators installed in namespace openshift-cluster-observability-operator to function as manual approval strategy and will be updated altogether. Install operators into separate namespaces for handling their updates independently. To allow automatic approval, all operators installed in the namespace must use automatic approval strategy.
                      </Alert>
                    </div>
                  )}
                  {(data.updateApproval || 'manual') === 'automatic' && (
                    <div style={{ marginTop: '8px', width: '100%' }}>
                      <Alert
                        variant={AlertVariant.warning}
                        isInline
                        title="Automatic updates selected in production"
                      >
                        Enabling automatic updates allows the operator to upgrade immediately when a new version is released. This may cause brief service interruptions or configuration changes during production hours.
                      </Alert>
                    </div>
                  )}
                </ListItem>
              </List>
            </CardBody>
          </Card>
        </StackItem>

        {/* BOM Table - Operators and Storage */}
        <StackItem>
          <Card>
            <CardTitle>Bill of Materials</CardTitle>
            <CardBody>
              {bomData.length > 0 ? (
                <Table variant="compact" aria-label="BOM table">
                  <Thead>
                    <Tr>
                      <Th width={25} style={{ fontSize: '14px' }}>Service</Th>
                      <Th width={25} style={{ fontSize: '14px' }}>Version</Th>
                      <Th width={25} style={{ fontSize: '14px' }}>Update Channel</Th>
                      <Th width={25} style={{ fontSize: '14px' }}>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* Observability Services Section */}
                    {operatorsBOM.length > 0 && (
                      <>
                        <Tr>
                          <Th colSpan={4} style={{ backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', fontWeight: '600', fontSize: '14px', padding: '12px 8px' }}>
                            Observability Services
                          </Th>
                        </Tr>
                        {operatorsBOM.map((item) => (
                          <Tr key={`operator-${item.id}`}>
                            <Td>{item.name}</Td>
                            <Td>
                              {item.version ? (
                                <Badge isRead style={{ fontSize: '12px' }}>
                                  v{item.version}
                                </Badge>
                              ) : (
                                'N/A'
                              )}
                            </Td>
                            <Td>{item.channel || 'N/A'}</Td>
                            <Td>
                              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <CheckCircleIcon style={{ color: '#3d7317', fontSize: '16px' }} />
                                <span style={{ fontSize: '14px', color: 'var(--pf-v5-global--success-color--100)' }}>Ready to install</span>
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </>
                    )}
                    
                    {/* Infrastructure Storage Section */}
                    {storageBOM.length > 0 && (
                      <>
                        <Tr>
                          <Th colSpan={4} style={{ backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', fontWeight: '600', fontSize: '14px', padding: '12px 8px' }}>
                            Storage Infrastructure
                          </Th>
                        </Tr>
                        {storageBOM.map((item) => (
                          <Tr key={`storage-${item.id}`}>
                            <Td>{item.name}</Td>
                            <Td>
                              {item.version ? (
                                <Badge isRead style={{ fontSize: '12px' }}>
                                  v{item.version}
                                </Badge>
                              ) : (
                                'N/A'
                              )}
                            </Td>
                            <Td>{item.channel || 'N/A'}</Td>
                            <Td>
                              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <CheckCircleIcon style={{ color: '#3d7317', fontSize: '16px' }} />
                                <span style={{ fontSize: '14px', color: 'var(--pf-v5-global--success-color--100)' }}>Ready to install</span>
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </>
                    )}
                  </Tbody>
                </Table>
              ) : (
                <Content style={{ color: '#6a6e73' }}>
                  No operators or storage selected. Please go back to Step 2 to select capabilities.
                </Content>
              )}
            </CardBody>
          </Card>
        </StackItem>

        {/* UI Components to Install */}
        <StackItem>
          <Card>
            <CardTitle>UI components to install</CardTitle>
            <CardBody>
              {uiComponentsToInstall.length > 0 ? (
                <List>
                  {uiComponentsToInstall.map((component) => (
                    <ListItem key={component}>{component}</ListItem>
                  ))}
                </List>
              ) : (
                <Content style={{ color: '#6a6e73' }}>
                  No UI components selected. Please go back to Step 2 to select UI plugins.
                </Content>
              )}
            </CardBody>
          </Card>
        </StackItem>

        {/* Estimated Resources */}
        <StackItem>
          <Card>
            <CardTitle>Estimated resources</CardTitle>
            <CardBody>
              <Stack hasGutter>
                {/* Compute Resources */}
                <StackItem>
                  <Content style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                    Compute Resources
                  </Content>
                  <List>
                    <ListItem>
                      <Content style={{ fontSize: '14px' }}>
                        CPU: ~{estimatedResources.cpu} Cores (Burstable)
                      </Content>
                    </ListItem>
                    <ListItem>
                      <Content style={{ fontSize: '14px' }}>
                        Memory: ~{estimatedResources.memory} GB (Total RSS)
                      </Content>
                    </ListItem>
                  </List>
                </StackItem>

                {/* Storage Infrastructure */}
                <StackItem>
                  <Content style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                    Storage Infrastructure
                  </Content>
                  <List>
                    {data.selectedStorage && data.selectedStorage.length > 0 ? (
                      <ListItem>
                        <Content style={{ fontSize: '14px' }}>
                          Storage Backend: {data.selectedStorage.map((storageId) => {
                            return storageId === 'odf' 
                              ? 'OpenShift Data Foundation (ODF)'
                              : storageId === 'lvm'
                              ? 'Logical Volume Manager (LVM)'
                              : storageId;
                          }).join(', ')}
                        </Content>
                      </ListItem>
                    ) : (
                      <ListItem>
                        <Content style={{ fontSize: '14px', color: '#6a6e73' }}>
                          Storage Backend: Not selected
                        </Content>
                      </ListItem>
                    )}
                    <ListItem>
                      <Content style={{ fontSize: '14px' }}>
                        Local Cache (PV): {estimatedResources.localCache} GB (Standard-SSD)
                      </Content>
                    </ListItem>
                    {estimatedResources.hasThanos && (
                      <>
                        <ListItem>
                          <Content style={{ fontSize: '14px' }}>
                            Long-term Storage: Connected to 'obs-bucket-s3'
                          </Content>
                        </ListItem>
                        <ListItem>
                          <Content style={{ fontSize: '14px' }}>
                            Retention Estimate: ~{estimatedResources.objectStorage} TB / Month (Object Storage)
                          </Content>
                        </ListItem>
                      </>
                    )}
                  </List>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </StackItem>

      </Stack>
    </div>
  );
};
