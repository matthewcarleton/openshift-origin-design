import * as React from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabContent,
  Button,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Grid,
  GridItem,
  Progress,
  List,
  ListItem,
  Modal,
  ModalVariant,
  Content,
  Label,
} from '@patternfly/react-core';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { dataService } from '../../../../data/dataService';

const ClusterDetail: React.FunctionComponent = () => {
  const { clusterId } = useParams<{ clusterId: string }>();
  const [activeTab, setActiveTab] = React.useState<string | number>(0);
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [currency, setCurrency] = React.useState('USD ($) - United States Dollar');
  const [isClusterInfoModalOpen, setIsClusterInfoModalOpen] = React.useState(false);

  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTab(tabIndex);
  };

  // Get cluster data from database
  const cluster = dataService.getClusterById(clusterId || '');
  const clusterProjects = dataService.getProjectsByClusterId(clusterId || '');
  const clusterNodes = dataService.getNodesByClusterId(clusterId || '');
  
  // Get cost model if assigned
  const costModel = cluster?.costModelId ? dataService.getCostModelById(cluster.costModelId) : null;

  // If cluster not found, show error
  if (!cluster) {
    return (
      <PageSection>
        <Title headingLevel="h1">Cluster not found</Title>
        <p>The cluster with ID "{clusterId}" was not found.</p>
        <Link to="/cost-management/openshift">Back to OpenShift</Link>
      </PageSection>
    );
  }

  // Transform cluster data for the UI
  const clusterData = {
    name: cluster.displayName,
    id: cluster.id,
    totalCost: dataService.formatCurrency(cluster.cost),
    dateRange: 'October 1 – 24',
    dataStatus: 'Data integration and finalization',
    cpuMaximum: `${cluster.cpuCapacity.toLocaleString()} core`,
    cpuUnusedCapacity: ((100 - cluster.cpuUsagePercent) * cluster.cpuCapacity / 100).toFixed(2),
    cpuUnusedRequests: (cluster.cpuUsagePercent * cluster.cpuCapacity / 100 * 0.1).toFixed(2),
    memoryMaximum: `${cluster.memoryCapacityGiB.toLocaleString()} GiB`,
    memoryUnusedCapacity: ((100 - cluster.memoryUsagePercent) * cluster.memoryCapacityGiB / 100).toFixed(2),
    memoryUnusedRequests: '0',
    volumeMaximum: `${cluster.storageCapacityGiB.toLocaleString()} GiB`,
    volumeUnusedCapacity: ((100 - cluster.storageUsagePercent) * cluster.storageCapacityGiB / 100).toFixed(2),
    volumeUnusedRequests: (cluster.storageUsagePercent * cluster.storageCapacityGiB / 100 * 0.04).toFixed(2),
  };

  // Transform projects for display
  const totalProjectsCost = clusterProjects.reduce((sum, p) => sum + p.cost, 0);
  const projects = clusterProjects
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 3)
    .map(proj => ({
      name: proj.name,
      cost: dataService.formatCurrency(proj.cost),
      percentage: (proj.cost / cluster.cost) * 100
    }));
  
  // Add "Others" if there are more than 3 projects
  if (clusterProjects.length > 3) {
    const othersCost = clusterProjects.slice(3).reduce((sum, p) => sum + p.cost, 0);
    projects.push({
      name: `${clusterProjects.length - 3} Others`,
      cost: dataService.formatCurrency(othersCost),
      percentage: (othersCost / cluster.cost) * 100
    });
  }

  // Hardcoded storage types for now
  const storageTypes = [
    { name: 'gp3-csi', cost: '$21.44', percentage: 100 },
    { name: 'gp2', cost: '$0.00', percentage: 0 },
    { name: 'No-storageclass', cost: '$0.00', percentage: 0 },
  ];

  return (
    <>
      <PageSection
        style={{
          paddingBottom: 0,
          paddingTop: 'var(--pf-t--global--spacer--sm)',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
        }}
      >
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem flex={{ default: 'flex_1' }}>
            <Breadcrumb style={{ paddingTop: 'var(--pf-t--global--spacer--sm)' }}>
              <BreadcrumbItem to="/">OpenShift</BreadcrumbItem>
              <BreadcrumbItem to="/cost-management/overview">Cost Management</BreadcrumbItem>
              <BreadcrumbItem to="/cost-management/openshift">OpenShift</BreadcrumbItem>
            </Breadcrumb>
          </FlexItem>
          <FlexItem alignSelf={{ default: 'alignSelfFlexEnd' }}>
            {/* Placeholder for favorite icon */}
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection style={{
        paddingBottom: 0,
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
      }}>
        <div style={{ paddingBottom: 'var(--pf-t--global--spacer--sm)' }}>
          <nav aria-label="Back to details" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center' }}>
              <li>
                <Link to="/cost-management/openshift?filter[limit]=10&filter[offset]=0&filter[time_scope_value]=-1&group_by[cluster]=*">
                  Back to OpenShift cluster details
                </Link>
              </li>
            </ol>
          </nav>

          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
            {/* Left side: Cluster name and details */}
            <FlexItem>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <Title headingLevel="h1" size="2xl">{clusterData.name}</Title>
                </FlexItem>
                <FlexItem>
                  <div style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    {clusterData.id}{' '}
                    <Button 
                      variant="link" 
                      style={{ fontSize: '0.75rem', padding: 0 }}
                      onClick={() => setIsClusterInfoModalOpen(true)}
                    >
                      Cluster information
                    </Button>
                  </div>
                </FlexItem>
                <FlexItem>
                  <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" style={{ marginRight: '0.5rem' }} />
                    <span style={{ color: 'rgb(56, 56, 56)', fontSize: '0.75rem', marginRight: '0.5rem' }}>{clusterData.dataStatus}</span>
                    <Button variant="link" style={{ fontSize: '0.75rem', padding: 0 }}>
                      Data details
                    </Button>
                  </div>
                </FlexItem>
              </Flex>
            </FlexItem>

            {/* Right side: Currency selector and cost */}
            <FlexItem>
              <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsFlexEnd' }}>
                <FlexItem style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                  <Flex alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <span style={{ marginRight: 'var(--pf-t--global--spacer--md)', fontSize: '0.875rem' }}>Currency</span>
                    </FlexItem>
                    <FlexItem>
                      <Select
                        isOpen={currencyOpen}
                        onSelect={() => setCurrencyOpen(false)}
                        onOpenChange={(isOpen) => setCurrencyOpen(isOpen)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setCurrencyOpen(!currencyOpen)}
                            isExpanded={currencyOpen}
                          >
                            {currency}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="USD ($) - United States Dollar">USD ($) - United States Dollar</SelectOption>
                        </SelectList>
                      </Select>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Title headingLevel="h2" size="4xl" style={{ marginTop: 0, marginBottom: 0, textAlign: 'right' }}>
                    {clusterData.totalCost}
                  </Title>
                </FlexItem>
                <FlexItem>
                  <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>Clusters total cost ({clusterData.dateRange})</div>
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>

          <div style={{ display: 'flex', marginTop: 'var(--pf-t--global--spacer--lg)' }}>
            <Tabs activeKey={activeTab} onSelect={handleTabClick} style={{ flex: 1 }}>
              <Tab eventKey={0} title="Cost overview" id="cost-overview-tab" />
              <Tab eventKey={1} title="Historical data" id="historical-data-tab" />
              <Tab eventKey={2} title="Virtualization" id="virtualization-tab" />
            </Tabs>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <TabContent eventKey={0} id="cost-overview-content" activeKey={activeTab} hidden={activeTab !== 0}>
          <Grid hasGutter>
            <GridItem xl={12} xl2={6}>
              <Grid hasGutter>
                <GridItem>
                  <Card>
                    <CardTitle>
                      <Flex alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Title headingLevel="h2" size="lg">Cost breakdown</Title>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Help">
                            <OutlinedQuestionCircleIcon />
                          </Button>
                        </FlexItem>
                      </Flex>
                    </CardTitle>
                    <CardBody>
                      <div style={{ height: '332px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        Cost breakdown chart (waterfall chart)
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">Cost breakdown by projects</Title>
                    </CardTitle>
                    <CardBody>
                      <List isPlain>
                        {projects.map((project, index) => (
                          <ListItem key={index} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                            <Progress
                              value={project.percentage}
                              title={project.name}
                              label={`${project.cost}  (${project.percentage.toFixed(2)} %)`}
                              size="sm"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                    <div style={{ padding: 'var(--pf-t--global--spacer--md)', paddingTop: 0, marginLeft: '-15px' }}>
                      <Button variant="link">View all projects</Button>
                    </div>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">Storage cost breakdown by type</Title>
                    </CardTitle>
                    <CardBody>
                      <List isPlain>
                        {storageTypes.map((storage, index) => (
                          <ListItem key={index} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                            <Progress
                              value={storage.percentage}
                              title={storage.name}
                              label={`${storage.cost}  (${storage.percentage} %)`}
                              size="sm"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </GridItem>

            <GridItem xl={12} xl2={6}>
              <Grid hasGutter>
                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">CPU</Title>
                    </CardTitle>
                    <CardBody>
                      <div style={{ marginBottom: '1rem' }}>{clusterData.cpuMaximum} maximum</div>
                      <Grid hasGutter>
                        <GridItem md={12} lg={6}>
                          <div>Unused capacity</div>
                          <div style={{ fontWeight: 700 }}>{clusterData.cpuUnusedCapacity}</div>
                          <div>core-hours (89% of capacity)</div>
                        </GridItem>
                        <GridItem md={12} lg={6}>
                          <div>Unused requests</div>
                          <div style={{ fontWeight: 700 }}>{clusterData.cpuUnusedRequests}</div>
                          <div>core-hours (9% of capacity)</div>
                        </GridItem>
                      </Grid>
                      <div style={{ height: '147px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        CPU bullet chart
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">Memory</Title>
                    </CardTitle>
                    <CardBody>
                      <div style={{ marginBottom: '1rem' }}>{clusterData.memoryMaximum} maximum</div>
                      <Grid hasGutter>
                        <GridItem md={12} lg={6}>
                          <div>Unused capacity</div>
                          <div style={{ fontWeight: 700 }}>{clusterData.memoryUnusedCapacity}</div>
                          <div>GiB-hours (86% of capacity)</div>
                        </GridItem>
                        <GridItem md={12} lg={6}>
                          <div>Unused requests</div>
                          <div style={{ fontWeight: 700 }}>{clusterData.memoryUnusedRequests}</div>
                          <div>GiB-hours (0% of capacity)</div>
                        </GridItem>
                      </Grid>
                      <div style={{ height: '147px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        Memory bullet chart
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">Volume</Title>
                    </CardTitle>
                    <CardBody>
                      <div style={{ marginBottom: '1rem' }}>{clusterData.volumeMaximum} maximum</div>
                      <Grid hasGutter>
                        <GridItem md={12} lg={6}>
                          <div>Unused capacity</div>
                          <div style={{ fontWeight: 700 }}>{clusterData.volumeUnusedCapacity}</div>
                          <div>GiB-month (96% of capacity)</div>
                        </GridItem>
                        <GridItem md={12} lg={6}>
                          <div>Unused requests</div>
                          <div style={{ fontWeight: 700 }}>{clusterData.volumeUnusedRequests}</div>
                          <div>GiB-month (4% of capacity)</div>
                        </GridItem>
                      </Grid>
                      <div style={{ height: '147px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        Volume bullet chart
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </TabContent>

        <TabContent eventKey={1} id="historical-data-content" activeKey={activeTab} hidden={activeTab !== 1}>
          <Card>
            <CardBody>
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                Historical data content
              </div>
            </CardBody>
          </Card>
        </TabContent>

        <TabContent eventKey={2} id="virtualization-content" activeKey={activeTab} hidden={activeTab !== 2}>
          <Card>
            <CardBody>
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                Virtualization content
              </div>
            </CardBody>
          </Card>
        </TabContent>
      </PageSection>

      {/* Cluster Information Modal */}
      <Modal
        variant={ModalVariant.medium}
        title="Cluster information"
        isOpen={isClusterInfoModalOpen}
        onClose={() => setIsClusterInfoModalOpen(false)}
        aria-labelledby="cluster-info-modal-title"
      >
        <Content className="textContentOverride" style={{ padding: '24px' }}>
          <h3>Cluster id</h3>
          <List isPlain>
            <ListItem>
              <span style={{ marginRight: '1rem' }}>{clusterData.id}</span>
              <a href={`/openshift/details/${clusterData.id}`}>OpenShift cluster details</a>
            </ListItem>
          </List>

          <h3>Cost management operator version</h3>
          <List isPlain>
            <ListItem>
              <span style={{ marginRight: '1rem' }}>{cluster.operatorVersion}</span>
              <Label color="green" icon={<CheckCircleIcon />}>Up to date</Label>
            </ListItem>
          </List>

          <h3>Red Hat integration</h3>
          <List isPlain>
            <ListItem>
              <span style={{ marginRight: '1rem' }}>OpenShift source:</span>
              <a href={`/settings/integrations/detail/${cluster.integrationId}`}>{clusterData.name}</a>
            </ListItem>
            <ListItem>
              <span style={{ marginRight: '1rem' }}>Cost model:</span>
              {costModel ? (
                <a href={`/openshift/cost-management/settings/cost-model/${costModel.id}`}>{costModel.name}</a>
              ) : (
                <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No cost model assigned</span>
              )}
            </ListItem>
          </List>

          {cluster.awsIntegrationId && (
            <>
              <h3>Cloud integration</h3>
              <List isPlain>
                <ListItem>
                  <span style={{ marginRight: '1rem' }}>Amazon Web Services source:</span>
                  <a href={`/settings/integrations/detail/${cluster.awsIntegrationId}`}>AWS Integration</a>
                </ListItem>
              </List>
            </>
          )}

          <h3>Nodes</h3>
          <List isPlain>
            <ListItem>
              <span style={{ marginRight: '1rem' }}>Total nodes:</span>
              <strong>{clusterNodes.length}</strong>
            </ListItem>
            {clusterNodes.length > 0 && (
              <ListItem>
                <div style={{ marginTop: '0.5rem' }}>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {clusterNodes.map(node => (
                      <li key={node.id} style={{ marginBottom: '0.25rem' }}>
                        {node.name} <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>({node.nodeType}, {node.instanceType}, {node.architecture || 'x86_64'})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ListItem>
            )}
          </List>
        </Content>
      </Modal>
    </>
  );
};

export { ClusterDetail };

