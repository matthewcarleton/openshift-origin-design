import * as React from 'react';
import {
  PageSection,
  Title,
  Content,
  Card,
  CardTitle,
  CardBody,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Button,
  Grid,
  GridItem,
  Label,
} from '@patternfly/react-core';
import {
  BellIcon,
  CubesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from '@patternfly/react-icons';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FunctionComponent = () => {
  const navigate = useNavigate();

  // Mock summary data
  const summaryData = {
    totalClusters: 45,
    healthyClusters: 38,
    clustersWithWarnings: 5,
    clustersWithCritical: 2,
    totalAlerts: 127,
    criticalAlerts: 8,
    warningAlerts: 34,
    infoAlerts: 85,
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Stack hasGutter>
        {/* Page Header */}
        <StackItem>
          <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">
                Fleet Overview
              </Title>
            </FlexItem>
            <FlexItem>
              <Content component="p" className="pf-v6-u-color-200">
                Welcome to OpenShift Advanced Cluster Manager. Monitor and manage your multi-cluster environment.
              </Content>
            </FlexItem>
          </Flex>
        </StackItem>

        {/* Summary Cards */}
        <StackItem>
          <Grid hasGutter>
            <GridItem sm={12} md={6} lg={3}>
              <Card isCompact>
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <CubesIcon style={{ fontSize: '1.5rem' }} color="var(--pf-t--global--icon--color--regular)" />
                        </FlexItem>
                        <FlexItem>
                          <Content component="small" className="pf-v6-u-color-200">Clusters in Fleet</Content>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h2" size="3xl">{summaryData.totalClusters}</Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex gap={{ default: 'gapSm' }}>
                        <Label color="green" isCompact icon={<CheckCircleIcon />}>{summaryData.healthyClusters} Healthy</Label>
                        <Label color="orange" isCompact icon={<ExclamationTriangleIcon />}>{summaryData.clustersWithWarnings} Warning</Label>
                        <Label color="red" isCompact icon={<ExclamationCircleIcon />}>{summaryData.clustersWithCritical} Critical</Label>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem sm={12} md={6} lg={3}>
              <Card isCompact>
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <BellIcon style={{ fontSize: '1.5rem' }} color="var(--pf-t--global--icon--color--regular)" />
                        </FlexItem>
                        <FlexItem>
                          <Content component="small" className="pf-v6-u-color-200">Total Alerts</Content>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h2" size="3xl">{summaryData.totalAlerts}</Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex gap={{ default: 'gapSm' }}>
                        <Label color="red" isCompact>{summaryData.criticalAlerts} Critical</Label>
                        <Label color="orange" isCompact>{summaryData.warningAlerts} Warning</Label>
                        <Label color="blue" isCompact>{summaryData.infoAlerts} Info</Label>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem sm={12} md={6} lg={3}>
              <Card isCompact>
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <CheckCircleIcon style={{ fontSize: '1.5rem' }} color="var(--pf-t--global--color--status--success--default)" />
                        </FlexItem>
                        <FlexItem>
                          <Content component="small" className="pf-v6-u-color-200">Healthy Clusters</Content>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h2" size="3xl">{summaryData.healthyClusters}</Title>
                    </FlexItem>
                    <FlexItem>
                      <Content component="small" className="pf-v6-u-color-200">
                        {Math.round((summaryData.healthyClusters / summaryData.totalClusters) * 100)}% of fleet
                      </Content>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem sm={12} md={6} lg={3}>
              <Card isCompact>
                <CardBody>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <ExclamationCircleIcon style={{ fontSize: '1.5rem' }} color="var(--pf-t--global--color--status--danger--default)" />
                        </FlexItem>
                        <FlexItem>
                          <Content component="small" className="pf-v6-u-color-200">Clusters Need Attention</Content>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h2" size="3xl">{summaryData.clustersWithCritical + summaryData.clustersWithWarnings}</Title>
                    </FlexItem>
                    <FlexItem>
                      <Button 
                        variant="link" 
                        isInline 
                        icon={<ArrowRightIcon />} 
                        iconPosition="end"
                        onClick={() => navigate('/observe/alerting')}
                      >
                        View alerts
                      </Button>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </StackItem>

        {/* Quick Access Card */}
        <StackItem>
          <Card>
            <CardTitle>Quick Access</CardTitle>
            <CardBody>
              <Grid hasGutter>
                <GridItem sm={12} md={6} lg={4}>
                  <Card isCompact isClickable onClick={() => navigate('/observe/alerting')}>
                    <CardBody>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                        <FlexItem>
                          <BellIcon style={{ fontSize: '2rem' }} color="var(--pf-t--global--color--status--danger--default)" />
                        </FlexItem>
                        <FlexItem>
                          <Stack>
                            <StackItem>
                              <Title headingLevel="h3" size="md">Multi-cluster Alerting</Title>
                            </StackItem>
                            <StackItem>
                              <Content component="small" className="pf-v6-u-color-200">
                                View and manage alerts across all clusters
                              </Content>
                            </StackItem>
                          </Stack>
                        </FlexItem>
                        <FlexItem align={{ default: 'alignRight' }}>
                          <ArrowRightIcon />
                        </FlexItem>
                      </Flex>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem sm={12} md={6} lg={4}>
                  <Card isCompact isClickable onClick={() => navigate('/infrastructure/clusters')}>
                    <CardBody>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                        <FlexItem>
                          <CubesIcon style={{ fontSize: '2rem' }} color="var(--pf-t--global--icon--color--regular)" />
                        </FlexItem>
                        <FlexItem>
                          <Stack>
                            <StackItem>
                              <Title headingLevel="h3" size="md">Infrastructure</Title>
                            </StackItem>
                            <StackItem>
                              <Content component="small" className="pf-v6-u-color-200">
                                Manage clusters and infrastructure
                              </Content>
                            </StackItem>
                          </Stack>
                        </FlexItem>
                        <FlexItem align={{ default: 'alignRight' }}>
                          <ArrowRightIcon />
                        </FlexItem>
                      </Flex>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem sm={12} md={6} lg={4}>
                  <Card isCompact isClickable onClick={() => navigate('/observe/dashboards')}>
                    <CardBody>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
                        <FlexItem>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--pf-t--global--icon--color--regular)' }}>
                            <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"/>
                          </svg>
                        </FlexItem>
                        <FlexItem>
                          <Stack>
                            <StackItem>
                              <Title headingLevel="h3" size="md">Dashboards</Title>
                            </StackItem>
                            <StackItem>
                              <Content component="small" className="pf-v6-u-color-200">
                                View metrics and performance dashboards
                              </Content>
                            </StackItem>
                          </Stack>
                        </FlexItem>
                        <FlexItem align={{ default: 'alignRight' }}>
                          <ArrowRightIcon />
                        </FlexItem>
                      </Flex>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

export { Dashboard };
