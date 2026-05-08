import * as React from 'react';
import {
  Title,
  Content,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Breadcrumb,
  BreadcrumbItem,
  MenuToggle,
  Select,
  SelectOption,
  SelectList,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Button,
  Progress,
  ProgressSize,
} from '@patternfly/react-core';
import { AngleRightIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

const Overview: React.FunctionComponent = () => {
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [currency, setCurrency] = React.useState('USD ($) - United States Dollar');
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [topItemsTab, setTopItemsTab] = React.useState<string | number>(0);
  const [comparisonOpen, setComparisonOpen] = React.useState(false);
  const [comparison, setComparison] = React.useState('cumulative');
  const [perspectiveOpen, setPerspectiveOpen] = React.useState(false);
  const [perspective, setPerspective] = React.useState('All cloud filtered by OpenShift');
  const [infraTopTab, setInfraTopTab] = React.useState<string | number>(0);
  const [infraComparisonOpen, setInfraComparisonOpen] = React.useState(false);
  const [infraComparison, setInfraComparison] = React.useState('cumulative');
  const [showCostAsOpen, setShowCostAsOpen] = React.useState(false);
  const [showCostAs, setShowCostAs] = React.useState('Amortized');
  const [periodTypeOpen, setPeriodTypeOpen] = React.useState(false);
  const [periodType, setPeriodType] = React.useState<'calendar' | 'billing'>('calendar');
  
  // Get buffer configuration from localStorage
  const getBufferDays = (provider: 'aws' | 'gcp' | 'azure' = 'aws'): { before: number; after: number } => {
    try {
      const savedConfig = localStorage.getItem('bufferConfiguration');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        if (config.bufferMode === 'default') {
          return { before: 3, after: 3 };
        } else if (config.bufferMode === 'custom') {
          if (config.customMode === 'all') {
            return {
              before: parseInt(config.allProvidersBefore || '3', 10),
              after: parseInt(config.allProvidersAfter || '3', 10),
            };
          } else if (config.customMode === 'per-provider') {
            return {
              before: parseInt(config.providerBuffers?.[provider]?.before || '3', 10),
              after: parseInt(config.providerBuffers?.[provider]?.after || '3', 10),
            };
          }
        }
      }
    } catch (e) {
      console.error('Failed to load buffer configuration:', e);
    }
    return { before: 3, after: 3 }; // Default fallback
  };

  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  const handleTopItemsTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setTopItemsTab(tabIndex);
  };

  const handleInfraTopTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setInfraTopTab(tabIndex);
  };
  
  // Get date range text based on period type and buffer configuration
  const getDateRangeText = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const monthName = now.toLocaleDateString('en-US', { month: 'short' });
    const currentDay = now.getDate();
    
    if (periodType === 'calendar') {
      // Standard calendar month
      return `${monthName} 1–${currentDay}`;
    } else {
      // Billing with buffer - determine which cloud provider
      let provider: 'aws' | 'gcp' | 'azure' = 'aws';
      if (perspective.includes('Google Cloud')) {
        provider = 'gcp';
      } else if (perspective.includes('Microsoft Azure')) {
        provider = 'azure';
      }
      
      const bufferDays = getBufferDays(provider);
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const prevMonthName = new Date(prevMonthYear, prevMonth).toLocaleDateString('en-US', { month: 'short' });
      const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
      
      // Calculate start date based on buffer (days before month end)
      const bufferStart = lastDayOfPrevMonth - (bufferDays.before - 1);
      
      return `${prevMonthName} ${bufferStart}–${monthName} ${currentDay}`;
    }
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="/cost-management/overview">Cost Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Overview</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Overview
        </Title>
        <Content>
          <p>Monitor and analyze cost data across all cloud providers and OpenShift clusters.</p>
        </Content>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }} style={{ marginTop: '24px' }}>
          {/* Currency Row */}
          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                <Title headingLevel="h2" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                  Currency
                </Title>
                <Button variant="plain" aria-label="A dialog with a description of perspectives">
                  <OutlinedQuestionCircleIcon />
                </Button>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                <Title headingLevel="h2" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                  Currency
                </Title>
                <div style={{ minWidth: '280px' }}>
                  <Select
                    isOpen={currencyOpen}
                    onSelect={() => setCurrencyOpen(false)}
                    onOpenChange={(isOpen) => setCurrencyOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} onClick={() => setCurrencyOpen(!currencyOpen)} isExpanded={currencyOpen} style={{ width: '100%' }}>
                        {currency}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="USD ($) - United States Dollar">USD ($) - United States Dollar</SelectOption>
                    </SelectList>
                  </Select>
                </div>
              </Flex>
            </FlexItem>
          </Flex>

          {/* Tabs Row */}
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab eventKey={0} title={<TabTitleText>OpenShift</TabTitleText>} />
            <Tab eventKey={1} title={<TabTitleText>Infrastructure</TabTitleText>} />
          </Tabs>

          {/* Perspective and Date Row */}
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              {activeTabKey === 0 ? (
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                    Perspective
                  </Title>
                  <div style={{ marginBottom: '6px', marginTop: '6px' }}>All OpenShift</div>
                </Flex>
              ) : (
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                    Perspective
                  </Title>
                  <Select
                    isOpen={perspectiveOpen}
                    onSelect={(_event, value) => {
                      setPerspective(value as string);
                      setPerspectiveOpen(false);
                    }}
                    onOpenChange={(isOpen) => setPerspectiveOpen(isOpen)}
                    selected={perspective}
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setPerspectiveOpen(!perspectiveOpen)} 
                        isExpanded={perspectiveOpen}
                      >
                        {perspective}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="All cloud filtered by OpenShift">All cloud filtered by OpenShift</SelectOption>
                      <SelectOption value="Amazon Web Services">Amazon Web Services</SelectOption>
                      <SelectOption value="Amazon Web Services filtered by OpenShift">Amazon Web Services filtered by OpenShift</SelectOption>
                      <SelectOption value="Google Cloud">Google Cloud</SelectOption>
                      <SelectOption value="Google Cloud filtered by OpenShift">Google Cloud filtered by OpenShift</SelectOption>
                      <SelectOption value="Microsoft Azure">Microsoft Azure</SelectOption>
                      <SelectOption value="Microsoft Azure filtered by OpenShift">Microsoft Azure filtered by OpenShift</SelectOption>
                    </SelectList>
                  </Select>
                  
                  {/* Period Type Selector */}
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>
                    Period type
                  </Title>
                  <Select
                    isOpen={periodTypeOpen}
                    onSelect={(_event, value) => {
                      setPeriodType(value as 'calendar' | 'billing');
                      setPeriodTypeOpen(false);
                    }}
                    onOpenChange={(isOpen) => setPeriodTypeOpen(isOpen)}
                    selected={periodType}
                    toggle={(toggleRef) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setPeriodTypeOpen(!periodTypeOpen)} 
                        isExpanded={periodTypeOpen}
                      >
                        {periodType === 'calendar' ? 'Calendar' : 'Billing'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="calendar" description="Standard monthly periods (1st to last day of month). Shows when services were used.">
                        Calendar
                      </SelectOption>
                      <SelectOption 
                        value="billing" 
                        description={
                          <>
                            Includes buffer zones (default: 3 days before/after month boundaries) to match your invoice. <Link to="/cost-management/settings">Customize in Settings</Link>.
                          </>
                        }
                      >
                        Billing
                      </SelectOption>
                    </SelectList>
                  </Select>
                  
                  {/* Show cost as dropdown - only for Amazon Web Services */}
                  {perspective === 'Amazon Web Services' && (
                    <>
                      <Title headingLevel="h3" size="md" style={{ marginBottom: 0, marginRight: 'var(--pf-t--global--spacer--md)', whiteSpace: 'nowrap' }}>
                        Show cost as
                      </Title>
                      <Select
                        isOpen={showCostAsOpen}
                        onSelect={(_event, value) => {
                          setShowCostAs(value as string);
                          setShowCostAsOpen(false);
                        }}
                        onOpenChange={(isOpen) => setShowCostAsOpen(isOpen)}
                        selected={showCostAs}
                        toggle={(toggleRef) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setShowCostAsOpen(!showCostAsOpen)} 
                            isExpanded={showCostAsOpen}
                          >
                            {showCostAs}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption 
                            value="Amortized"
                            description="Recurring and/or upfront costs are distributed evenly across the month"
                          >
                            Amortized
                          </SelectOption>
                          <SelectOption 
                            value="Blended"
                            description="Using a blended rate to calcuate cost usage"
                          >
                            Blended
                          </SelectOption>
                          <SelectOption 
                            value="Unblended"
                            description="Usage cost on the day you are charged"
                          >
                            Unblended
                          </SelectOption>
                        </SelectList>
                      </Select>
                    </>
                  )}
                </Flex>
              )}
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }} style={{ textAlign: 'end' }}>
              {activeTabKey === 1 ? getDateRangeText() : 'October 1 – 23'}
            </FlexItem>
          </Flex>
        </Flex>
      </div>

      {/* Content Section */}
      <div className="template-page-content">
      {/* Main Content - OpenShift Tab */}
      {activeTabKey === 0 && (
          <Grid hasGutter>
          {/* Main Cost Card - Full Width */}
          <GridItem span={12}>
            <Card>
              <Grid hasGutter>
                {/* Cost Summary - 8 columns */}
                <GridItem span={12} xl={8}>
                  <div style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">All OpenShift cost</Title>
                    </CardTitle>
                    <CardBody>
                      <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                          $85,930.55
                        </div>
                        <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Cost</div>
                      </div>
                      <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                        <Select
                          isOpen={comparisonOpen}
                          onSelect={(_event, value) => {
                            setComparison(value as string);
                            setComparisonOpen(false);
                          }}
                          onOpenChange={(isOpen) => setComparisonOpen(isOpen)}
                          selected={comparison}
                          toggle={(toggleRef) => (
                            <MenuToggle 
                              ref={toggleRef} 
                              onClick={() => setComparisonOpen(!comparisonOpen)}
                              isExpanded={comparisonOpen}
                              style={{ width: '100%' }}
                            >
                              {comparison === 'cumulative' 
                                ? 'All OpenShift cumulative cost comparison ($)' 
                                : 'All OpenShift daily cost comparison ($)'}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            <SelectOption value="daily">All OpenShift daily cost comparison ($)</SelectOption>
                            <SelectOption value="cumulative">All OpenShift cumulative cost comparison ($)</SelectOption>
                          </SelectList>
                        </Select>
                      </div>
                      {/* Placeholder for chart */}
                      <div style={{ 
                        height: '282px', 
                        backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 'var(--pf-t--global--border--radius--default)',
                        color: 'var(--pf-t--global--text--color--subtle)'
                      }}>
                        Cost Trend Chart
                      </div>
                    </CardBody>
                  </div>
                </GridItem>

                {/* Top Projects/Clusters - 4 columns */}
                <GridItem span={12} xl={4}>
                  <div style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
                    <CardBody>
                      <Tabs activeKey={topItemsTab} onSelect={handleTopItemsTabClick} isFilled>
                        <Tab eventKey={0} title={<TabTitleText>Top projects</TabTitleText>} />
                        <Tab eventKey={1} title={<TabTitleText>Top clusters</TabTitleText>} />
                      </Tabs>

                      <TabContent eventKey={0} id="top-projects-content" activeKey={topItemsTab} hidden={topItemsTab !== 0}>
                        <div style={{ marginTop: '2rem' }}>
                          <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={27.28}
                                title="netobserv"
                                size={ProgressSize.sm}
                                label="$23,442.25  (27.28 %)"
                              />
                            </li>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={23.90}
                                title="netobserv-privileged"
                                size={ProgressSize.sm}
                                label="$20,534.82  (23.9 %)"
                              />
                            </li>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={7.67}
                                title="analytics"
                                size={ProgressSize.sm}
                                label="$6,594.71  (7.67 %)"
                              />
                            </li>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={41.15}
                                title="104 Others"
                                size={ProgressSize.sm}
                                label="$35,358.78  (41.15 %)"
                              />
                            </li>
                          </ul>
                        </div>
                      </TabContent>

                      <TabContent eventKey={1} id="top-clusters-content" activeKey={topItemsTab} hidden={topItemsTab !== 1}>
                        <div style={{ marginTop: '2rem' }}>
                          <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={70.53}
                                title="demolab"
                                size={ProgressSize.sm}
                                label="$60,609.54  (70.53 %)"
                              />
                            </li>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={21.16}
                                title="OpenShift on GCP - Nise Populator"
                                size={ProgressSize.sm}
                                label="$18,185.87  (21.16 %)"
                              />
                            </li>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={6.32}
                                title="Openshift on AWS"
                                size={ProgressSize.sm}
                                label="$5,430.88  (6.32 %)"
                              />
                            </li>
                            <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                              <Progress
                                value={1.98}
                                title="2 Others"
                                size={ProgressSize.sm}
                                label="$1,704.27  (1.98 %)"
                              />
                            </li>
                          </ul>
                        </div>
                      </TabContent>
                    </CardBody>
                    <CardTitle style={{ padding: 'var(--pf-t--global--spacer--md)', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
                      {topItemsTab === 0 ? (
                        <Link to="/cost-management/openshift?group_by[project]=*">All projects</Link>
                      ) : (
                        <Link to="/cost-management/openshift?group_by[cluster]=*">All clusters</Link>
                      )}
                    </CardTitle>
                  </div>
                </GridItem>
              </Grid>
            </Card>
          </GridItem>

          {/* CPU Usage Card */}
          <GridItem span={12} lg={6} xl={4}>
            <Card isFullHeight>
              <CardTitle>
                <Title headingLevel="h2" size="lg">CPU usage and requests</Title>
              </CardTitle>
              <CardBody>
                <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>15,603.33</div>
                  <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>core-hours</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>Usage</div>
                </div>
                <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>34,241.48</div>
                  <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>core-hours</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>Requests</div>
                </div>
                <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  Daily usage and requests comparison (core-hours)
                </Title>
                <div style={{ 
                  height: '180px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--pf-t--global--border--radius--default)',
                  color: 'var(--pf-t--global--text--color--subtle)'
                }}>
                  CPU Chart
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* Memory Usage Card */}
          <GridItem span={12} lg={6} xl={4}>
            <Card isFullHeight>
              <CardTitle>
                <Title headingLevel="h2" size="lg">Memory usage and requests</Title>
              </CardTitle>
              <CardBody>
                <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>94,375.41</div>
                  <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>GiB-hours</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>Usage</div>
                </div>
                <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>82,099.01</div>
                  <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>GiB-hours</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>Requests</div>
                </div>
                <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  Daily usage and requests comparison (GiB-hours)
                </Title>
                <div style={{ 
                  height: '180px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--pf-t--global--border--radius--default)',
                  color: 'var(--pf-t--global--text--color--subtle)'
                }}>
                  Memory Chart
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* Volume Usage Card */}
          <GridItem span={12} lg={6} xl={4}>
            <Card isFullHeight>
              <CardTitle>
                <Title headingLevel="h2" size="lg">Volume usage and requests</Title>
              </CardTitle>
              <CardBody>
                <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>507</div>
                  <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>GiB-month</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>Usage</div>
                </div>
                <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>959.62</div>
                  <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>GiB-month</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>Requests</div>
                </div>
                <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                  Daily usage and requests comparison (GiB-month)
                </Title>
                <div style={{ 
                  height: '180px', 
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--pf-t--global--border--radius--default)',
                  color: 'var(--pf-t--global--text--color--subtle)'
                }}>
                  Volume Chart
                </div>
              </CardBody>
            </Card>
          </GridItem>

          {/* Optimizations Card */}
          <GridItem span={12} lg={6} xl={4}>
            <Card isFullHeight>
              <CardTitle>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <Title headingLevel="h2" size="lg">Optimizations</Title>
                  <Button variant="plain" aria-label="A dialog with a description of optimizations">
                    <OutlinedQuestionCircleIcon />
                  </Button>
                </Flex>
              </CardTitle>
              <CardBody>
                <Link to="/cost-management/optimizations">56 optimizations</Link>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}

      {/* Main Content - Infrastructure Tab */}
      {activeTabKey === 1 && (
          <Grid hasGutter>
            {/* Infrastructure content will go here */}
            <GridItem span={12}>
              <Card>
                <Grid hasGutter>
                  {/* Cost Summary - 8 columns */}
                  <GridItem span={12} xl={8}>
                    <div style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
                      <CardTitle>
                        <Title headingLevel="h2" size="lg">
                          {perspective === 'Amazon Web Services' 
                            ? 'Amazon Web Services cost'
                            : perspective === 'Amazon Web Services filtered by OpenShift'
                              ? 'Amazon Web Services filtered by OpenShift cost'
                              : perspective === 'Google Cloud'
                                ? 'Google Cloud cost'
                                : perspective === 'Google Cloud filtered by OpenShift'
                                  ? 'Google Cloud filtered by OpenShift cost'
                                  : perspective === 'Microsoft Azure'
                                    ? 'Microsoft Azure cost'
                                    : perspective === 'Microsoft Azure filtered by OpenShift'
                                      ? 'Microsoft Azure filtered by OpenShift cost'
                                      : 'All cloud filtered by OpenShift cost'}
                        </Title>
                      </CardTitle>
                      <CardBody>
                        <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                            {perspective === 'Amazon Web Services' ? '$20,729.73' :
                             perspective === 'Amazon Web Services filtered by OpenShift' ? '$6,514.36' :
                             perspective === 'Google Cloud' ? '$6,564.76' :
                             perspective === 'Google Cloud filtered by OpenShift' ? '$6,557.15' :
                             perspective === 'Microsoft Azure' ? '$118.82' :
                             perspective === 'Microsoft Azure filtered by OpenShift' ? '$42.33' :
                             '$13,113.84'}
                          </div>
                          <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Cost</div>
                        </div>
                        <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                          <Select
                            isOpen={infraComparisonOpen}
                            onSelect={(_event, value) => {
                              setInfraComparison(value as string);
                              setInfraComparisonOpen(false);
                            }}
                            onOpenChange={(isOpen) => setInfraComparisonOpen(isOpen)}
                            selected={infraComparison}
                            toggle={(toggleRef) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setInfraComparisonOpen(!infraComparisonOpen)}
                                isExpanded={infraComparisonOpen}
                                style={{ width: '100%' }}
                              >
                                {perspective === 'Amazon Web Services' || perspective === 'Amazon Web Services filtered by OpenShift'
                                  ? (infraComparison === 'cumulative' 
                                      ? 'Amazon Web Services cumulative cost comparison ($)' 
                                      : 'Amazon Web Services daily cost comparison ($)')
                                  : perspective === 'Google Cloud' || perspective === 'Google Cloud filtered by OpenShift'
                                    ? (infraComparison === 'cumulative'
                                        ? 'Google Cloud cumulative cost comparison ($)'
                                        : 'Google Cloud daily cost comparison ($)')
                                    : perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift'
                                      ? (infraComparison === 'cumulative'
                                          ? 'Microsoft Azure cumulative cost comparison ($)'
                                          : 'Microsoft Azure daily cost comparison ($)')
                                      : (infraComparison === 'cumulative' 
                                          ? 'All cloud filtered by OpenShift cumulative cost comparison ($)' 
                                          : 'All cloud filtered by OpenShift daily cost comparison ($)')}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              {perspective === 'Amazon Web Services' || perspective === 'Amazon Web Services filtered by OpenShift' ? (
                                <>
                                  <SelectOption value="daily">Amazon Web Services daily cost comparison ($)</SelectOption>
                                  <SelectOption value="cumulative">Amazon Web Services cumulative cost comparison ($)</SelectOption>
                                </>
                              ) : perspective === 'Google Cloud' || perspective === 'Google Cloud filtered by OpenShift' ? (
                                <>
                                  <SelectOption value="daily">Google Cloud daily cost comparison ($)</SelectOption>
                                  <SelectOption value="cumulative">Google Cloud cumulative cost comparison ($)</SelectOption>
                                </>
                              ) : perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift' ? (
                                <>
                                  <SelectOption value="daily">Microsoft Azure daily cost comparison ($)</SelectOption>
                                  <SelectOption value="cumulative">Microsoft Azure cumulative cost comparison ($)</SelectOption>
                                </>
                              ) : (
                                <>
                                  <SelectOption value="daily">All cloud filtered by OpenShift daily cost comparison ($)</SelectOption>
                                  <SelectOption value="cumulative">All cloud filtered by OpenShift cumulative cost comparison ($)</SelectOption>
                                </>
                              )}
                            </SelectList>
                          </Select>
                        </div>
                        {/* Placeholder for chart */}
                        <div style={{ 
                          height: '282px', 
                          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--pf-t--global--border--radius--default)',
                          color: 'var(--pf-t--global--text--color--subtle)'
                        }}>
                          Cost Trend Chart
                        </div>
                      </CardBody>
                    </div>
                  </GridItem>

                  {/* Top Services/Accounts/Regions - 4 columns */}
                  <GridItem span={12} xl={4}>
                    <div style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
                      <CardBody>
                        <Tabs activeKey={infraTopTab} onSelect={handleInfraTopTabClick} isFilled>
                          <Tab eventKey={0} title={<TabTitleText>Top services</TabTitleText>} />
                          <Tab eventKey={1} title={<TabTitleText>Top accounts</TabTitleText>} />
                          <Tab eventKey={2} title={<TabTitleText>Top regions</TabTitleText>} />
                        </Tabs>

                        <TabContent eventKey={0} id="top-services-content" activeKey={infraTopTab} hidden={infraTopTab !== 0}>
                          <div style={{ marginTop: '2rem' }}>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                              {perspective === 'Amazon Web Services' ? (
                                <>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={47.36} title="AmazonEC2" size={ProgressSize.sm} label="$9,816.74  (47.36 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={42.27} title="Red Hat Enterprise Linux 7" size={ProgressSize.sm} label="$8,761.96  (42.27 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={3.88} title="Red Hat OpenShift Service on AWS" size={ProgressSize.sm} label="$805.28  (3.88 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={6.49} title="20 Others" size={ProgressSize.sm} label="$1,345.74  (6.49 %)" />
                                  </li>
                                </>
                              ) : perspective === 'Amazon Web Services filtered by OpenShift' ? (
                                <>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={57.93} title="AmazonEC2" size={ProgressSize.sm} label="$3,773.60  (57.93 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={12.36} title="Red Hat OpenShift Service on AWS" size={ProgressSize.sm} label="$805.28  (12.36 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={11.21} title="Red Hat Enterprise Linux 8" size={ProgressSize.sm} label="$730.20  (11.21 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={18.50} title="6 Others" size={ProgressSize.sm} label="$1,205.28  (18.5 %)" />
                                  </li>
                                </>
                              ) : perspective === 'Google Cloud' ? (
                                <>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={46.12} title="Compute Engine" size={ProgressSize.sm} label="$3,027.91  (46.12 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={28.78} title="Cloud Storage" size={ProgressSize.sm} label="$1,889.43  (28.78 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={6.14} title="BigQuery" size={ProgressSize.sm} label="$403.26  (6.14 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={18.96} title="13 Others" size={ProgressSize.sm} label="$1,244.16  (18.96 %)" />
                                  </li>
                                </>
                              ) : perspective === 'Google Cloud filtered by OpenShift' ? (
                                <>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={50.00} title="Compute Engine" size={ProgressSize.sm} label="$3,278.58  (50 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={41.41} title="Cloud Storage" size={ProgressSize.sm} label="$2,716.39  (41.41 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={8.26} title="BigQuery" size={ProgressSize.sm} label="$541.62  (8.26 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={0.32} title="1 Other" size={ProgressSize.sm} label="$20.56  (0.32 %)" />
                                  </li>
                                </>
                              ) : perspective === 'Microsoft Azure' ? (
                                <>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={34.66} title="Virtual Machines" size={ProgressSize.sm} label="$14.67  (34.66 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={31.61} title="Virtual Network" size={ProgressSize.sm} label="$13.38  (31.61 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={26.43} title="Storage" size={ProgressSize.sm} label="$11.19  (26.43 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={7.29} title="1 Other" size={ProgressSize.sm} label="$3.09  (7.29 %)" />
                                  </li>
                                </>
                              ) : perspective === 'Microsoft Azure filtered by OpenShift' ? (
                                <>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={34.66} title="Virtual Machines" size={ProgressSize.sm} label="$14.67  (34.66 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={31.61} title="Virtual Network" size={ProgressSize.sm} label="$13.38  (31.61 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={26.43} title="Storage" size={ProgressSize.sm} label="$11.19  (26.43 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={7.29} title="1 Other" size={ProgressSize.sm} label="$3.09  (7.29 %)" />
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={46.12} title="Compute Engine" size={ProgressSize.sm} label="$6,048.00  (46.12 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={28.78} title="AmazonEC2" size={ProgressSize.sm} label="$3,773.60  (28.78 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={6.14} title="Red Hat OpenShift Service on AWS" size={ProgressSize.sm} label="$805.28  (6.14 %)" />
                                  </li>
                                  <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                    <Progress value={18.96} title="13 Others" size={ProgressSize.sm} label="$2,486.96  (18.96 %)" />
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </TabContent>

                        <TabContent eventKey={1} id="top-accounts-content" activeKey={infraTopTab} hidden={infraTopTab !== 1}>
                          <div style={{ marginTop: '2rem' }}>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={50.00}
                                  title="example_2_id"
                                  size={ProgressSize.sm}
                                  label="$6,557.15  (50 %)"
                                />
                              </li>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={41.41}
                                  title="673985673683"
                                  size={ProgressSize.sm}
                                  label="$5,430.88  (41.41 %)"
                                />
                              </li>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={8.26}
                                  title="soconcar"
                                  size={ProgressSize.sm}
                                  label="$1,083.48  (8.26 %)"
                                />
                              </li>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={0.32}
                                  title="1 Other"
                                  size={ProgressSize.sm}
                                  label="$42.33  (0.32 %)"
                                />
                              </li>
                            </ul>
                          </div>
                        </TabContent>

                        <TabContent eventKey={2} id="top-regions-content" activeKey={infraTopTab} hidden={infraTopTab !== 2}>
                          <div style={{ marginTop: '2rem' }}>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={50.00}
                                  title="us-west1-a"
                                  size={ProgressSize.sm}
                                  label="$6,557.15  (50 %)"
                                />
                              </li>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={37.67}
                                  title="us-east-1"
                                  size={ProgressSize.sm}
                                  label="$4,940.41  (37.67 %)"
                                />
                              </li>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={8.26}
                                  title="us-east-2"
                                  size={ProgressSize.sm}
                                  label="$1,083.48  (8.26 %)"
                                />
                              </li>
                              <li style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                                <Progress
                                  value={4.06}
                                  title="31 Others"
                                  size={ProgressSize.sm}
                                  label="$532.80  (4.06 %)"
                                />
                              </li>
                            </ul>
                          </div>
                        </TabContent>
                      </CardBody>
                    </div>
                  </GridItem>
                </Grid>
              </Card>
            </GridItem>

            {/* Compute Services Card */}
            <GridItem span={12} lg={6} xl={4}>
              <Card isFullHeight>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">
                    {perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift'
                      ? 'Virtual machines usage'
                      : 'Compute (EC2) instances usage'}
                  </Title>
                </CardTitle>
                <CardBody>
                  <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    <div><span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {perspective === 'Amazon Web Services' ? '113,154.33' :
                       perspective === 'Amazon Web Services filtered by OpenShift' ? '37,328.98' :
                       perspective === 'Google Cloud' ? '40,404.74' :
                       perspective === 'Google Cloud filtered by OpenShift' ? '40,404.74' :
                       perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift' ? '51.76' :
                       '40,404.74'}
                    </span> <span style={{ fontSize: '0.875rem' }}>hours</span></div>
                    <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Usage</div>
                  </div>
                  <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {perspective === 'Amazon Web Services' ? '$9,494.61' :
                       perspective === 'Amazon Web Services filtered by OpenShift' ? '$3,620.61' :
                       perspective === 'Google Cloud' ? '$9,683.28' :
                       perspective === 'Google Cloud filtered by OpenShift' ? '$9,683.28' :
                       perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift' ? '$14.67' :
                       '$9,683.28'}
                    </div>
                    <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Cost</div>
                  </div>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    Daily usage comparison (hours)
                  </Title>
                  <div style={{ 
                    height: '180px', 
                    backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--pf-t--global--border--radius--default)',
                    color: 'var(--pf-t--global--text--color--subtle)'
                  }}>
                    Compute Chart
                  </div>
                </CardBody>
              </Card>
            </GridItem>

            {/* Storage Services Card */}
            <GridItem span={12} lg={6} xl={4}>
              <Card isFullHeight>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">Storage services usage</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    <div><span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {perspective === 'Amazon Web Services' ? '6,365.49' :
                       perspective === 'Amazon Web Services filtered by OpenShift' ? '5,604.22' :
                       perspective === 'Google Cloud' ? '6,159.33' :
                       perspective === 'Google Cloud filtered by OpenShift' ? '6,159.33' :
                       perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift' ? '51.12' :
                       '6,159.33'}
                    </span> <span style={{ fontSize: '0.875rem' }}>GB-month</span></div>
                    <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Usage</div>
                  </div>
                  <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {perspective === 'Amazon Web Services' ? '$359.48' :
                       perspective === 'Amazon Web Services filtered by OpenShift' ? '$293.55' :
                       perspective === 'Google Cloud' ? '$805.13' :
                       perspective === 'Google Cloud filtered by OpenShift' ? '$805.13' :
                       perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift' ? '$7.58' :
                       '$805.13'}
                    </div>
                    <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Cost</div>
                  </div>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    Daily usage comparison (GB-month)
                  </Title>
                  <div style={{ 
                    height: '180px', 
                    backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--pf-t--global--border--radius--default)',
                    color: 'var(--pf-t--global--text--color--subtle)'
                  }}>
                    Storage Chart
                  </div>
                </CardBody>
              </Card>
            </GridItem>

            {/* Network Services Card */}
            <GridItem span={12} lg={6} xl={4}>
              <Card isFullHeight>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">Network services cost</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {perspective === 'Amazon Web Services' ? '$73.47' :
                       perspective === 'Amazon Web Services filtered by OpenShift' ? '$48.20' :
                       perspective === 'Google Cloud' ? '$64.12' :
                       perspective === 'Google Cloud filtered by OpenShift' ? '$64.12' :
                       perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift' ? '$13.38' :
                       '$64.12'}
                    </div>
                    <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Cost</div>
                  </div>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    Cumulative cost comparison ($)
                  </Title>
                  <div style={{ 
                    height: '180px', 
                    backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--pf-t--global--border--radius--default)',
                    color: 'var(--pf-t--global--text--color--subtle)'
                  }}>
                    Network Chart
                  </div>
                </CardBody>
              </Card>
            </GridItem>

            {/* Database Services Card */}
            <GridItem span={12} lg={6} xl={4}>
              <Card isFullHeight>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">Database services cost</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {perspective === 'Amazon Web Services' ? '$238.29' :
                       perspective === 'Amazon Web Services filtered by OpenShift' ? '$237.78' :
                       perspective === 'Google Cloud' ? '$243.47' :
                       perspective === 'Google Cloud filtered by OpenShift' ? '$243.47' :
                       perspective === 'Microsoft Azure' || perspective === 'Microsoft Azure filtered by OpenShift' ? '$3.09' :
                       '$243.47'}
                    </div>
                    <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>Cost</div>
                  </div>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    Cumulative cost comparison ($)
                  </Title>
                  <div style={{ 
                    height: '180px', 
                    backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--pf-t--global--border--radius--default)',
                    color: 'var(--pf-t--global--text--color--subtle)'
                  }}>
                    Database Chart
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
      )}
      </div>
    </>
  );
};

export { Overview };

