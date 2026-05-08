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
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';
import {
  PencilAltIcon,
  CheckCircleIcon,
} from '@patternfly/react-icons';

interface EventSource {
  id: number;
  name: string;
  type: 'Webhook' | 'Kafka' | 'Database' | 'File' | 'Custom';
  description: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  eventsReceived: number;
  lastEvent: string;
  rulebooks: string[];
  url?: string;
  topic?: string;
  credentials?: string;
  testPayload?: any;
}

const EventSourceDetailPage: React.FC = () => {
  const { sourceId } = useParams<{ sourceId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | number>(0);

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'events') {
      setActiveTab(1);
    } else if (tabParam === 'test') {
      setActiveTab(2);
    }
  }, [searchParams]);

  // Mock data - in real app, fetch based on sourceId
  const sourceData: EventSource = {
    id: parseInt(sourceId || '1'),
    name: 'VM Creation Webhook',
    type: 'Webhook',
    description: 'Receives VM lifecycle events from OpenShift Virtualization on remote clusters',
    status: 'Connected',
    eventsReceived: 1247,
    lastEvent: '2024-01-15 15:30:22',
    rulebooks: ['VM Post-Provisioning Automation'],
    url: 'https://eda.example.com/webhooks/vm-creation',
    credentials: 'webhook-credentials-01',
    testPayload: {
      event_type: 'vm.created',
      vm_name: 'test-vm-01',
      namespace: 'workloads',
      vm_ip: '10.0.0.42',
      timestamp: '2024-01-15T15:30:22Z',
    },
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning'> = {
      'Connected': 'success',
      'Disconnected': 'warning',
      'Error': 'danger',
    };
    return <Badge isRead={status === 'Disconnected'}>{status}</Badge>;
  };

  const handleTest = () => {
    console.log('Testing event source with payload:', sourceData.testPayload);
    alert('Test event sent! Check Event Stream to see if it was received.');
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/events')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/events?tab=sources')}>
            Events
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{sourceData.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Flex spaceItems={{ default: 'spaceItemsLg' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem grow={{ default: 'grow' }}>
            <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
              {sourceData.name}
            </Title>
            <Content>
              <p>{sourceData.description}</p>
            </Content>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button variant="secondary" icon={<CheckCircleIcon />} onClick={handleTest}>
                  Test
                </Button>
              </FlexItem>
              <FlexItem>
                <Button variant="secondary" icon={<PencilAltIcon />} onClick={() => console.log('Edit event source')}>
                  Edit
                </Button>
              </FlexItem>
            </Flex>
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
              aria-label="Event source detail tabs"
            >
              <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <DescriptionList columnModifier={{ default: '2Col' }}>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>{sourceData.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Type</DescriptionListTerm>
                      <DescriptionListDescription>{sourceData.type}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>{getStatusBadge(sourceData.status)}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    {sourceData.url && (
                      <DescriptionListGroup>
                        <DescriptionListTerm>URL</DescriptionListTerm>
                        <DescriptionListDescription>
                          <code style={{ backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)', padding: '2px 6px', borderRadius: '3px' }}>
                            {sourceData.url}
                          </code>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    )}
                    
                    {sourceData.topic && (
                      <DescriptionListGroup>
                        <DescriptionListTerm>Topic</DescriptionListTerm>
                        <DescriptionListDescription>{sourceData.topic}</DescriptionListDescription>
                      </DescriptionListGroup>
                    )}
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Events Received</DescriptionListTerm>
                      <DescriptionListDescription>{sourceData.eventsReceived.toLocaleString()}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Last Event</DescriptionListTerm>
                      <DescriptionListDescription>{sourceData.lastEvent}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Credentials</DescriptionListTerm>
                      <DescriptionListDescription>
                        {sourceData.credentials ? (
                          <Button variant="link" isInline onClick={() => console.log('View credentials')}>
                            {sourceData.credentials}
                          </Button>
                        ) : (
                          'None'
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Rulebooks</DescriptionListTerm>
                      <DescriptionListDescription>
                        {sourceData.rulebooks.length > 0 ? (
                          sourceData.rulebooks.map((rulebook, idx) => (
                            <React.Fragment key={rulebook}>
                              <Button
                                variant="link"
                                isInline
                                onClick={() => navigate(`/automation/rulebooks?name=${rulebook}`)}
                              >
                                {rulebook}
                              </Button>
                              {idx < sourceData.rulebooks.length - 1 && ', '}
                            </React.Fragment>
                          ))
                        ) : (
                          'None'
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </div>
              </Tab>

              <Tab eventKey={1} title={<TabTitleText>Events</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Recent events from this source:</p>
                    <Button variant="link" onClick={() => navigate(`/automation/events?tab=history&source=${encodeURIComponent(sourceData.name)}`)}>
                      View all events in Event History →
                    </Button>
                    <div style={{ marginTop: '16px' }}>
                      <Button variant="link" onClick={() => navigate('/automation/events?tab=stream')}>
                        View live events in Event Stream →
                      </Button>
                    </div>
                  </Content>
                </div>
              </Tab>

              <Tab eventKey={2} title={<TabTitleText>Test</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Content>
                    <p>Test payload that will be sent to this event source:</p>
                    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                      <CodeBlock>
                        <CodeBlockCode>{JSON.stringify(sourceData.testPayload, null, 2)}</CodeBlockCode>
                      </CodeBlock>
                    </div>
                    <Button variant="primary" onClick={handleTest}>
                      Send Test Event
                    </Button>
                    <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--pf-v5-global--Color--200)' }}>
                      After sending, check the Event Stream page to see if the event was received and processed.
                    </div>
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

export default EventSourceDetailPage;

