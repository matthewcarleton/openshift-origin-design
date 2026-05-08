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
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  SearchInput,
} from '@patternfly/react-core';
import {
  RedoIcon,
  BanIcon,
  DownloadIcon,
  SearchIcon,
  SyncIcon,
} from '@patternfly/react-icons';

interface Job {
  id: number;
  name: string;
  template: string;
  type: 'Job template' | 'Workflow';
  status: 'Success' | 'Failed' | 'Running' | 'Pending';
  started: string;
  finished: string;
  duration: string;
  cluster: string;
  vm: string;
  output?: string;
  artifacts?: Record<string, string>;
}

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | number>(2); // Default to Output tab
  const [isStdoutDropdownOpen, setIsStdoutDropdownOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [outputSearchValue, setOutputSearchValue] = useState('');

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'output') {
      setActiveTab(2);
    } else if (tabParam === 'details') {
      setActiveTab(1);
    } else {
      // Default to Output tab
      setActiveTab(2);
    }
  }, [searchParams]);

  // Mock data - in real app, fetch based on jobId
  const jobData: Job = {
    id: parseInt(jobId || '195'),
    name: 'Configure VMs',
    template: 'Configure VMs',
    type: 'Job template',
    status: 'Running',
    started: '2024-01-15 14:28:00',
    finished: '',
    duration: '',
    cluster: 'us-west-prod-01',
    vm: '',
    output: `ok: [linuxvm-app-dev-09]
ok: [linuxvm-db-prod-05]
ok: [linuxvm-web-dev-07]
ok: [linuxvm-web-prod-02]
ok: [linuxvm-web-prod-01]

TASK [Install Apache] ************************************************** 14:28:18
changed: [linuxvm-app-prod-03]
changed: [linuxvm-app-prod-04]
changed: [linuxvm-db-prod-05]
changed: [linuxvm-app-dev-09]
changed: [linuxvm-db-prod-06]
changed: [linuxvm-web-dev-07]
changed: [linuxvm-web-prod-01]`,
    artifacts: {
      'vm_ip': '10.0.0.42',
      'vm_name': 'webserver-vm-01',
      'project_name': 'webserver-project',
    },
  };

  // Split output into lines for line numbers
  const outputLines = (jobData.output || 'No output available').split('\n');

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      'Success': 'success',
      'Failed': 'danger',
      'Running': 'warning',
      'Pending': 'info',
    };
    return <Badge isRead={false}>{status}</Badge>;
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/jobs')}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem to="#" onClick={() => navigate('/automation/jobs')}>
            Jobs
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{jobData.id} - {jobData.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Output
        </Title>
      </div>

      {/* Content Area */}
      <div className="template-page-content">
        <Card>
          <CardBody>
            <Tabs
              activeKey={activeTab}
              onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}
              aria-label="Job detail tabs"
            >
              <Tab eventKey={0} title={<TabTitleText>Back to Jobs</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <Button variant="link" onClick={() => navigate('/automation/jobs')}>
                    ← Back to Jobs
                  </Button>
                </div>
              </Tab>

              <Tab eventKey={1} title={<TabTitleText>Details</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  <DescriptionList columnModifier={{ default: '2Col' }}>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Template</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.template}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Type</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.type}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>{getStatusBadge(jobData.status)}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Cluster</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.cluster}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>VM</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.vm}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Started</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.started}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Finished</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.finished}</DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    <DescriptionListGroup>
                      <DescriptionListTerm>Duration</DescriptionListTerm>
                      <DescriptionListDescription>{jobData.duration}</DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </div>
              </Tab>

              <Tab eventKey={2} title={<TabTitleText>Output</TabTitleText>}>
                <div style={{ padding: '24px 0' }}>
                  {/* Job Name and Status */}
                  <div style={{ marginBottom: '16px' }}>
                    <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <strong>{jobData.name}</strong>
                      </FlexItem>
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                          {jobData.status === 'Running' && (
                            <FlexItem>
                              <SyncIcon style={{ animation: 'spin 2s linear infinite' }} />
                            </FlexItem>
                          )}
                          <FlexItem>
                            <Badge isRead={false}>{jobData.status}</Badge>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </div>

                  {/* Output Controls */}
                  <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--pf-t--global--border--color--default)', paddingBottom: '16px' }}>
                    <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Dropdown
                          isOpen={isStdoutDropdownOpen}
                          onSelect={() => setIsStdoutDropdownOpen(false)}
                          onOpenChange={(isOpen) => setIsStdoutDropdownOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setIsStdoutDropdownOpen(!isStdoutDropdownOpen)}
                              isExpanded={isStdoutDropdownOpen}
                              variant="default"
                            >
                              Stdout
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="stdout">Stdout</DropdownItem>
                            <DropdownItem value="stderr">Stderr</DropdownItem>
                            <DropdownItem value="all">All</DropdownItem>
                          </DropdownList>
                        </Dropdown>
                      </FlexItem>
                      <FlexItem>
                        <SearchInput
                          placeholder="Search output"
                          value={outputSearchValue}
                          onChange={(_event, value) => setOutputSearchValue(value)}
                          onClear={() => setOutputSearchValue('')}
                        />
                      </FlexItem>
                      <FlexItem align={{ default: 'alignRight' }}>
                        <Button
                          variant={isFollowing ? 'primary' : 'secondary'}
                          onClick={() => setIsFollowing(!isFollowing)}
                        >
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                      </FlexItem>
                    </Flex>
                  </div>

                  {/* Output Content with Line Numbers */}
                  <div style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    fontFamily: 'var(--pf-t--global--font--family--mono)',
                    fontSize: '12px',
                    padding: '16px',
                    borderRadius: '4px',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    lineHeight: '1.5',
                  }}>
                    {outputLines.map((line, index) => (
                      <div key={index} style={{ display: 'flex', marginBottom: '2px' }}>
                        <span style={{
                          color: '#858585',
                          marginRight: '16px',
                          minWidth: '40px',
                          textAlign: 'right',
                          userSelect: 'none',
                        }}>
                          {index + 1}
                        </span>
                        <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
                          {line || ' '}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default JobDetailPage;

