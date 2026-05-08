import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Card,
  CardBody,
  Tabs,
  Tab,
  TabTitleText,
  Badge,
  Button,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import {
  PlayIcon,
  PauseIcon,
  ChartLineIcon,
} from '@patternfly/react-icons';

interface RuleActivation {
  id: number;
  name: string;
  rulebook: string;
  rule: string;
  status: 'Running' | 'Stopped' | 'Error' | 'Pending';
  eventsProcessed: number;
  lastExecution: string;
  successRate: number;
  avgExecutionTime: string;
  decisionEnvironment: string;
  metrics: {
    eventsPerHour: number[];
    successRate: number[];
    executionTime: number[];
    timestamps: string[];
  };
}

const RuleActivationDetailPage: React.FC = () => {
  const { activationId } = useParams<{ activationId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | number>(0);

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'metrics') {
      setActiveTab(1);
    } else if (tabParam === 'history') {
      setActiveTab(2);
    }
  }, [searchParams]);

  // Mock data - in real app, fetch based on activationId
  const activationData: RuleActivation = {
    id: parseInt(activationId || '1'),
    name: 'VM Created Handler',
    rulebook: 'VM Post-Provisioning Automation',
    rule: 'On VM Created',
    status: 'Running',
    eventsProcessed: 1247,
    lastExecution: '2024-01-15 15:30:22',
    successRate: 98.5,
    avgExecutionTime: '2.3s',
    decisionEnvironment: 'prod-env-01',
    metrics: {
      eventsPerHour: [45, 52, 48, 61, 55, 58, 49],
      successRate: [98, 99, 97, 98, 99, 98, 99],
      executionTime: [2.1, 2.3, 2.2, 2.4, 2.3, 2.2, 2.3],
      timestamps: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
    },
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      'Running': 'success',
      'Stopped': 'warning',
      'Error': 'danger',
      'Pending': 'info',
    };
    return <Badge isRead={status === 'Stopped'}>{status}</Badge>;
  };

  // Prepare chart data
  const eventsChartData = activationData.metrics.timestamps.map((timestamp, idx) => ({
    name: 'Events',
    x: timestamp,
    y: activationData.metrics.eventsPerHour[idx],
  }));

  const successChartData = activationData.metrics.timestamps.map((timestamp, idx) => ({
    name: 'Success Rate',
    x: timestamp,
    y: activationData.metrics.successRate[idx],
  }));

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/rule-activations')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/rule-activations')}>
            Rule Activations
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{activationData.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Flex spaceItems={{ default: 'spaceItemsLg' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem grow={{ default: 'grow' }}>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
              {activationData.name}
            </Title>
            <Content>
              <p>Rule activation from rulebook: <Button variant="link" isInline onClick={() => navigate(`/automation/rulebooks?name=${activationData.rulebook}`)}>{activationData.rulebook}</Button></p>
            </Content>
          </FlexItem>
          <FlexItem>
            <Button
              variant={activationData.status === 'Running' ? 'danger' : 'primary'}
              icon={activationData.status === 'Running' ? <PauseIcon /> : <PlayIcon />}
              onClick={() => console.log(`${activationData.status === 'Running' ? 'Stop' : 'Start'} activation`)}
            >
              {activationData.status === 'Running' ? 'Stop' : 'Start'}
            </Button>
          </FlexItem>
        </Flex>
      </div>

      {/* Content Area */}
      <div className="template-page-content">
        <Card>
          <CardBody>
            <Tabs
              activeKey={activeTab}
              onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}
              aria-label="Rule activation detail tabs"
            >
              <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <DescriptionList columnModifier={{ default: '2Col' }}>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>{activationData.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Rulebook</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Button variant="link" isInline onClick={() => navigate(`/automation/rulebooks?name=${activationData.rulebook}`)}>
                          {activationData.rulebook}
                        </Button>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Rule</DescriptionListTerm>
                      <DescriptionListDescription>{activationData.rule}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>{getStatusBadge(activationData.status)}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Events Processed</DescriptionListTerm>
                      <DescriptionListDescription>{activationData.eventsProcessed.toLocaleString()}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Success Rate</DescriptionListTerm>
                      <DescriptionListDescription>{activationData.successRate}%</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Average Execution Time</DescriptionListTerm>
                      <DescriptionListDescription>{activationData.avgExecutionTime}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Decision Environment</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Button variant="link" isInline onClick={() => navigate(`/automation/decision-environments?name=${activationData.decisionEnvironment}`)}>
                          {activationData.decisionEnvironment}
                        </Button>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Last Execution</DescriptionListTerm>
                      <DescriptionListDescription>{activationData.lastExecution}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </div>
              </Tab>

              <Tab eventKey={1} title={<TabTitleText>Metrics</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <div style={{ marginBottom: '32px' }}>
                    <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                      Events Processed per Hour
                    </Title>
                    <div style={{ 
                      padding: '24px', 
                      backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
                      borderRadius: '4px',
                      border: '1px solid var(--pf-t--global--border--color--default)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px' }}>
                        {activationData.metrics.eventsPerHour.map((value, idx) => (
                          <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                            <div 
                              style={{ 
                                height: `${(value / 70) * 200}px`,
                                backgroundColor: 'var(--pf-v5-global--primary-color--100)',
                                margin: '0 4px',
                                borderRadius: '4px 4px 0 0',
                                minHeight: '4px'
                              }}
                              title={`${value} events`}
                            />
                            <div style={{ marginTop: '8px', fontSize: '12px' }}>
                              {activationData.metrics.timestamps[idx]}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--pf-v5-global--Color--200)' }}>
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                      Success Rate (%)
                    </Title>
                    <div style={{ 
                      padding: '24px', 
                      backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
                      borderRadius: '4px',
                      border: '1px solid var(--pf-t--global--border--color--default)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px' }}>
                        {activationData.metrics.successRate.map((value, idx) => (
                          <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                            <div 
                              style={{ 
                                height: `${(value / 100) * 200}px`,
                                backgroundColor: 'var(--pf-v5-global--success-color--100)',
                                margin: '0 4px',
                                borderRadius: '4px 4px 0 0',
                                minHeight: '4px'
                              }}
                              title={`${value}%`}
                            />
                            <div style={{ marginTop: '8px', fontSize: '12px' }}>
                              {activationData.metrics.timestamps[idx]}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--pf-v5-global--Color--200)' }}>
                              {value}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab eventKey={2} title={<TabTitleText>Execution History</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Recent rule executions:</p>
                    <Button variant="link" onClick={() => navigate('/automation/events?tab=history&rule=' + encodeURIComponent(activationData.name))}>
                      View all executions in Event History →
                    </Button>
                  </Content>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default RuleActivationDetailPage;

