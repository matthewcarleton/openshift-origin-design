import * as React from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Tabs,
  Tab,
  TabTitleText,
  MenuToggle,
  Select,
  SelectOption,
  SelectList,
  Button,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';
import { Link, useParams } from 'react-router-dom';
import { AngleLeftIcon } from '@patternfly/react-icons';

const OptimizationDetail: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [timeRangeOpen, setTimeRangeOpen] = React.useState(false);
  const [timeRange, setTimeRange] = React.useState('Last 24 hrs');

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  // Mock data - would come from API
  const optimizationData = {
    name: 'thanos',
    lastReported: '3 hours ago',
    clusterName: 'demolab',
    projectType: 'namespace',
    currentConfig: {
      requests: {
        memory: '"64MiB"',
        cpu: '"300mcore"',
      },
      limits: {
        memory: '"90MiB"',
        cpu: '"400mcore"',
      },
    },
    recommendedConfig: {
      requests: {
        memory: '"50MiB"',
        memoryChange: -12.5,
        cpu: '"250mcore"',
        cpuChange: -16.67,
      },
      limits: {
        memory: '"80MiB"',
        memoryChange: -21.97,
        cpu: '"350mcore"',
        cpuChange: -12.5,
      },
    },
  };

  const currentConfigCode = `resources:
  requests:
    memory: ${optimizationData.currentConfig.requests.memory}
    CPU: ${optimizationData.currentConfig.requests.cpu}
  limits:
    memory: ${optimizationData.currentConfig.limits.memory}
    CPU: ${optimizationData.currentConfig.limits.cpu}`;

  const recommendedConfigCode = `resources:
  requests:
    memory: ${optimizationData.recommendedConfig.requests.memory} # ${optimizationData.recommendedConfig.requests.memoryChange}%
    CPU: ${optimizationData.recommendedConfig.requests.cpu} # ${optimizationData.recommendedConfig.requests.cpuChange}%
  limits:
    memory: ${optimizationData.recommendedConfig.limits.memory} # ${optimizationData.recommendedConfig.limits.memoryChange}%
    CPU: ${optimizationData.recommendedConfig.limits.cpu} # ${optimizationData.recommendedConfig.limits.cpuChange}%`;

  return (
    <>
      {/* Breadcrumb Section */}
      <PageSection 
        style={{ 
          paddingBottom: 0,
          paddingTop: 'var(--pf-t--global--spacer--sm)',
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
        }}
      >
        <Breadcrumb style={{ paddingTop: 'var(--pf-t--global--spacer--sm)' }}>
          <BreadcrumbItem to="/">OpenShift</BreadcrumbItem>
          <BreadcrumbItem to="/cost-management/overview">Cost Management</BreadcrumbItem>
          <BreadcrumbItem to="/cost-management/optimizations">Optimizations</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {/* Header Section */}
      <PageSection style={{ paddingBottom: 'var(--pf-t--global--spacer--md)', paddingTop: 'var(--pf-t--global--spacer--md)' }}>
        <Link to="/cost-management/optimizations" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
          <AngleLeftIcon style={{ marginRight: 'var(--pf-t--global--spacer--xs)' }} />
          Back to Optimizations
        </Link>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
          {optimizationData.name}
        </Title>
        <DescriptionList isHorizontal isCompact>
          <DescriptionListGroup>
            <DescriptionListTerm>Last reported</DescriptionListTerm>
            <DescriptionListDescription>{optimizationData.lastReported}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Cluster name</DescriptionListTerm>
            <DescriptionListDescription>{optimizationData.clusterName}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Project type</DescriptionListTerm>
            <DescriptionListDescription>{optimizationData.projectType}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>

      {/* View Optimizations Dropdown */}
      <PageSection style={{ paddingTop: 0, paddingBottom: 'var(--pf-t--global--spacer--md)' }}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Title headingLevel="h2" size="md">
              View optimizations based on
            </Title>
          </FlexItem>
          <FlexItem>
            <Select
              isOpen={timeRangeOpen}
              onSelect={(_event, value) => {
                setTimeRange(value as string);
                setTimeRangeOpen(false);
              }}
              onOpenChange={(isOpen) => setTimeRangeOpen(isOpen)}
              selected={timeRange}
              toggle={(toggleRef) => (
                <MenuToggle 
                  ref={toggleRef} 
                  onClick={() => setTimeRangeOpen(!timeRangeOpen)} 
                  isExpanded={timeRangeOpen}
                >
                  {timeRange}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="Last 24 hrs">Last 24 hrs</SelectOption>
                <SelectOption value="Last 7 days">Last 7 days</SelectOption>
                <SelectOption value="Last 14 days">Last 14 days</SelectOption>
              </SelectList>
            </Select>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Tabs */}
      <PageSection style={{ paddingTop: 0, paddingBottom: 'var(--pf-t--global--spacer--md)' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Optimization tabs"
          role="region"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Cost optimizations</TabTitleText>}
            tabContentId="cost-tab"
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Performance optimizations</TabTitleText>}
            tabContentId="performance-tab"
          />
        </Tabs>
      </PageSection>

      {/* Configuration Cards */}
      <PageSection style={{ paddingTop: 0 }}>
        <Grid hasGutter>
          <GridItem span={6}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  Current configuration
                </Title>
                <CodeBlock>
                  <CodeBlockCode style={{ fontFamily: 'var(--pf-t--global--font--family--mono)', fontSize: '0.875rem' }}>
                    {currentConfigCode}
                  </CodeBlockCode>
                </CodeBlock>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card>
              <CardBody style={{ position: 'relative' }}>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  <Title headingLevel="h3" size="md">
                    Recommended configuration
                  </Title>
                  <Button variant="plain" aria-label="Copy to clipboard">
                    <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 448 512" aria-hidden="true" role="img">
                      <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path>
                    </svg>
                  </Button>
                </Flex>
                <CodeBlock>
                  <CodeBlockCode style={{ fontFamily: 'var(--pf-t--global--font--family--mono)', fontSize: '0.875rem' }}>
                    {recommendedConfigCode}
                  </CodeBlockCode>
                </CodeBlock>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>

      {/* Charts Section */}
      <PageSection>
        <Grid hasGutter>
          <GridItem span={6}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  CPU utilization
                </Title>
                <div style={{ 
                  height: '300px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  border: '1px dashed var(--pf-t--global--border--color--default)',
                  borderRadius: 'var(--pf-t--global--border--radius--small)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, color: 'var(--pf-t--global--text--color--subtle)' }}>
                      CPU Utilization Chart
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Jan 1 - Jan 7
                    </p>
                  </div>
                </div>
                <Flex style={{ marginTop: 'var(--pf-t--global--spacer--md)', justifyContent: 'center' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#06c', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.875rem' }}>Actual usage (Jan 1 - 7)</span>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#c9190b', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.875rem' }}>Recommended Limit (Jan 7)</span>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#009596', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.875rem' }}>Recommended Request (Jan 7)</span>
                    </Flex>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card>
              <CardBody>
                <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  Memory utilization
                </Title>
                <div style={{ 
                  height: '300px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  border: '1px dashed var(--pf-t--global--border--color--default)',
                  borderRadius: 'var(--pf-t--global--border--radius--small)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Memory Utilization Chart
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Jan 1 - Jan 7
                    </p>
                  </div>
                </div>
                <Flex style={{ marginTop: 'var(--pf-t--global--spacer--md)', justifyContent: 'center' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#06c', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.875rem' }}>Actual usage (Jan 1 - 7)</span>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#c9190b', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.875rem' }}>Recommended Limit (Jan 7)</span>
                    </Flex>
                  </FlexItem>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#009596', borderRadius: '2px' }}></div>
                      <span style={{ fontSize: '0.875rem' }}>Recommended Request (Jan 7)</span>
                    </Flex>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default OptimizationDetail;

