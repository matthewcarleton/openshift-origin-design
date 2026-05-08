import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabTitleText,
  Flex,
  FlexItem,
  Card,
  CardBody,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Content,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import { StarIcon, ArrowRightIcon, InfoCircleIcon, CubesIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { 
  Toolbar, 
  ToolbarContent, 
  ToolbarItem, 
  SearchInput, 
  Pagination, 
  PaginationVariant 
} from '@patternfly/react-core';
import { RoleAssignmentWizard } from '../RoleAssignment/RoleAssignmentWizard';

// Interface for role assignment entries
interface RoleAssignment {
  id: string;
  name: string;
  type: 'User' | 'Group';
  clusters: string[];
  namespaces: string[];
  roles: string[];
  status: 'Active' | 'Inactive';
  assignedDate: string;
  assignedBy: string;
  origin: string;
}

export const ProjectDetail: React.FC = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<string>('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleCreateRoleAssignment = () => {
    setIsWizardOpen(true);
  };

  const handleWizardComplete = (wizardData: any) => {
    // For projects context, clusters and namespaces are scoped to the current project
    const clustersList = ['hub-cluster']; // Projects are typically on the hub cluster
    const namespacesList = [projectName || 'Unknown project'];
    
    // Create a new role assignment from the wizard selections
    const newAssignment: RoleAssignment = {
      id: `ra-${Date.now()}`,
      name: wizardData.identityName || 'Unknown',
      type: wizardData.identityType === 'user' ? 'User' : 'Group',
      clusters: clustersList,
      namespaces: namespacesList,
      roles: [wizardData.roleName || 'Unknown Role'],
      status: 'Active',
      assignedDate: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      assignedBy: 'Walter Joseph Kovacs',
      origin: 'Hub cluster'
    };
    
    setRoleAssignments([...roleAssignments, newAssignment]);
    setIsWizardOpen(false);
    
    // Show success alert (auto-dismiss handled by Alert timeout prop)
    setShowSuccessAlert(true);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setRoleAssignments(roleAssignments.filter(ra => ra.id !== assignmentId));
    setSelectedAssignments(prev => {
      const newSet = new Set(prev);
      newSet.delete(assignmentId);
      return newSet;
    });
  };

  const handleSelectAssignment = (assignmentId: string, isSelecting: boolean) => {
    setSelectedAssignments(prev => {
      const newSet = new Set(prev);
      if (isSelecting) {
        newSet.add(assignmentId);
      } else {
        newSet.delete(assignmentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelecting: boolean) => {
    if (isSelecting) {
      const allIds = roleAssignments.map(ra => ra.id);
      setSelectedAssignments(new Set(allIds));
    } else {
      setSelectedAssignments(new Set());
    }
  };

  const handleBulkDelete = () => {
    setRoleAssignments(roleAssignments.filter(ra => !selectedAssignments.has(ra.id)));
    setSelectedAssignments(new Set());
    setIsBulkActionsOpen(false);
  };

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
  };

  return (
    <>
      <div className="detail-page-header">
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <BreadcrumbItem>
            <Button variant="link" isInline onClick={() => navigate('/core/home/projects')} style={{ paddingLeft: 0 }}>
              Projects
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Project details</BreadcrumbItem>
        </Breadcrumb>

        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '24px' }}>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--pf-t--global--color--nonstatus--green--default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--pf-t--global--color--nonstatus--white--default)',
                    fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                  }}
                >
                  PR
                </div>
              </FlexItem>
              <FlexItem>
                <Title headingLevel="h1" size="2xl">{projectName}</Title>
              </FlexItem>
              <FlexItem>
                <Label color="green" icon={<span>✓</span>}>Active</Label>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Button variant="plain" icon={<StarIcon />} />
              </FlexItem>
              <FlexItem>
                <Dropdown
                  isOpen={isActionsOpen}
                  onSelect={() => setIsActionsOpen(false)}
                  onOpenChange={(isOpen) => setIsActionsOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle ref={toggleRef} onClick={() => setIsActionsOpen(!isActionsOpen)} isExpanded={isActionsOpen}>
                      Actions
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    <DropdownItem value="edit">Edit Project</DropdownItem>
                    <DropdownItem value="delete">Delete Project</DropdownItem>
                  </DropdownList>
                </Dropdown>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>

        <Tabs activeKey={activeTabKey} onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}>
          <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey={2} title={<TabTitleText>YAML</TabTitleText>} />
          <Tab eventKey={3} title={<TabTitleText>Workloads</TabTitleText>} />
          <Tab eventKey={4} title={<TabTitleText>Role assignments</TabTitleText>} />
          <Tab eventKey={5} title={<TabTitleText>Vulnerabilities</TabTitleText>} />
        </Tabs>
      </div>

      <div className="detail-page-content">
        {activeTabKey === 0 && (
          <>
            {showGettingStarted && (
              <Card style={{ marginBottom: '24px' }}>
                <CardBody>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                    <FlexItem flex={{ default: 'flex_1' }}>
                      <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">
                        <InfoCircleIcon style={{ marginRight: '8px' }} />
                        Getting started resources
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="plain" onClick={() => setShowGettingStarted(false)}>✕</Button>
                    </FlexItem>
                  </Flex>
                  
                  <Grid hasGutter>
                    <GridItem span={4}>
                      <Card style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', border: 'none' }}>
                        <CardBody>
                          <Title headingLevel="h3" size="md" className="pf-v6-u-mb-sm">📱 Create applications using samples</Title>
                          <Content className="pf-v6-u-mb-md pf-v6-u-font-size-sm pf-v6-u-color-200">
                            Choose a code sample to get started with your application with.
                          </Content>
                          <Content className="pf-v6-u-mb-xs pf-v6-u-font-weight-bold">Basic Quarkus <ArrowRightIcon style={{ fontSize: '12px' }} /></Content>
                          <Content className="pf-v6-u-mb-md pf-v6-u-font-weight-bold">Basic Spring Boot <ArrowRightIcon style={{ fontSize: '12px' }} /></Content>
                          <Button variant="link" isInline style={{ paddingLeft: 0 }}>View all samples</Button>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem span={4}>
                      <Card style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', border: 'none' }}>
                        <CardBody>
                          <Title headingLevel="h3" size="md" className="pf-v6-u-mb-sm">🔧 Build with guided documentation</Title>
                          <Content className="pf-v6-u-mb-md pf-v6-u-font-size-sm pf-v6-u-color-200">
                            Follow guided documentation to build applications and familiarize yourself with key features.
                          </Content>
                          <Content className="pf-v6-u-mb-xs">Deploying an application with a pipeline <ArrowRightIcon style={{ fontSize: '12px' }} /></Content>
                          <Content className="pf-v6-u-mb-md">Exploring Serverless applications <ArrowRightIcon style={{ fontSize: '12px' }} /></Content>
                          <Button variant="link" isInline style={{ paddingLeft: 0 }}>View all quick starts</Button>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem span={4}>
                      <Card style={{ backgroundColor: 'var(--pf-t--global--background--color--primary--default)', border: 'none' }}>
                        <CardBody>
                          <Title headingLevel="h3" size="md" className="pf-v6-u-mb-sm">📦 Explore new developer features</Title>
                          <Content className="pf-v6-u-mb-md pf-v6-u-font-size-sm pf-v6-u-color-200">
                            Explore new features and resources within the developer perspective.
                          </Content>
                          <Content className="pf-v6-u-mb-xs">Try the sample AI Chatbot Helm chart <ArrowRightIcon style={{ fontSize: '12px' }} /></Content>
                          <Content className="pf-v6-u-mb-md">Start building your application quickly in topology <ArrowRightIcon style={{ fontSize: '12px' }} /></Content>
                          <Button variant="link" isInline style={{ paddingLeft: 0 }}>What's new in OpenShift 4.19 🔗</Button>
                        </CardBody>
                      </Card>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            )}

            <Grid hasGutter>
              <GridItem span={3}>
                <Card style={{ marginBottom: '24px' }}>
                  <CardBody>
                    <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">Details</Title>
                    <Button variant="link" isInline style={{ paddingLeft: 0, float: 'right', marginTop: '-40px' }}>View all</Button>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>{projectName}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Requester</DescriptionListTerm>
                        <DescriptionListDescription>No requester</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Labels</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Label color="blue" isCompact>kubernetes.io/metadata.name=aap</Label>
                          <Label color="blue" isCompact className="pf-v6-u-mt-xs">openshift-pipelines.tekton.dev/namespace-reconcile=...</Label>
                          <Label color="blue" isCompact className="pf-v6-u-mt-xs">pod-security.kubernetes.io/audit=baseline</Label>
                          <Button variant="link" isInline style={{ paddingLeft: 0, fontSize: '12px' }}>View all</Button>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Description</DescriptionListTerm>
                        <DescriptionListDescription>No description</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </CardBody>
                </Card>

                <Card style={{ marginBottom: '24px' }}>
                  <CardBody>
                    <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">Inventory</Title>
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>14 Deployments</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>0 DeploymentConfigs</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>2 StatefulSets</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>20 Pods</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>1 PersistentVolumeClaim</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>8 Services</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>3 Routes</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>23 ConfigMaps</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>36 Secrets</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>0 VolumeSnapshots</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm><Button variant="link" isInline style={{ paddingLeft: 0 }}>0 VirtualMachines</Button></DescriptionListTerm>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem span={6}>
                <Card style={{ marginBottom: '24px' }}>
                  <CardBody>
                    <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">Status</Title>
                    <Button variant="link" isInline style={{ paddingLeft: 0, float: 'right', marginTop: '-40px' }}>View details</Button>
                    <Grid hasGutter>
                      <GridItem span={6}>
                        <Label color="green" icon={<span>✓</span>}>Active</Label>
                      </GridItem>
                      <GridItem span={6}>
                        <Label color="blue" icon={<InfoCircleIcon />}>Vulnerabilities</Label>
                        <Content className="pf-v6-u-font-size-sm">0 vulnerable images</Content>
                      </GridItem>
                    </Grid>
                    <div className="pf-v6-u-mt-md" style={{ padding: '16px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '4px' }}>
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem><InfoCircleIcon color="var(--pf-t--global--icon--color--status--info--default)" /></FlexItem>
                        <FlexItem>
                          <Content className="pf-v6-u-font-weight-bold">InsightsRecommendationActive</Content>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">13 Oct 2025, 08:23</Content>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-mt-xs">
                            Insights recommendation: "Red Hat's ability to manage a ROSA with HCP cluster is limited when workloads use pod disruption budgets that prevent any disruptions" with total risk "Moderate" was detected on the cluster...
                          </Content>
                          <Button variant="link" isInline style={{ paddingLeft: 0, fontSize: '12px' }}>View details</Button>
                        </FlexItem>
                      </Flex>
                    </div>
                    <div className="pf-v6-u-mt-md" style={{ padding: '16px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '4px' }}>
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem><InfoCircleIcon color="var(--pf-t--global--icon--color--status--info--default)" /></FlexItem>
                        <FlexItem>
                          <Content className="pf-v6-u-font-weight-bold">CDIDataImportCronOutdated</Content>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">13 Oct 2025, 06:47</Content>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-mt-xs">
                            DataImportCron (recurring polling of VM templates disk image sources, also known as golden images)...
                          </Content>
                          <Button variant="link" isInline style={{ paddingLeft: 0, fontSize: '12px' }}>View details</Button>
                        </FlexItem>
                      </Flex>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">Utilization</Title>
                    <Grid hasGutter>
                      <GridItem span={12}>
                        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm">CPU</Content>
                        <Button variant="link" isInline style={{ fontSize: '14px', color: 'var(--pf-t--global--color--brand--default)' }}>100.4m</Button>
                        <div style={{ 
                          height: '80px', 
                          marginTop: '8px', 
                          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">[CPU utilization chart]</Content>
                        </div>
                      </GridItem>
                      <GridItem span={12}>
                        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-mt-md">Memory</Content>
                        <Button variant="link" isInline style={{ fontSize: '14px', color: 'var(--pf-t--global--color--brand--default)' }}>6.38 GiB</Button>
                        <div style={{ 
                          height: '80px', 
                          marginTop: '8px', 
                          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">[Memory utilization chart]</Content>
                        </div>
                      </GridItem>
                      <GridItem span={12}>
                        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-mt-md">Filesystem</Content>
                        <Button variant="link" isInline style={{ fontSize: '14px', color: 'var(--pf-t--global--color--brand--default)' }}>438.2 MiB</Button>
                        <div style={{ 
                          height: '80px', 
                          marginTop: '8px', 
                          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">[Filesystem utilization chart]</Content>
                        </div>
                      </GridItem>
                      <GridItem span={12}>
                        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-mt-md">Network transfer</Content>
                        <Button variant="link" isInline style={{ fontSize: '14px', color: 'var(--pf-t--global--color--brand--default)' }}>47.87 KBps in</Button>
                        <Button variant="link" isInline style={{ fontSize: '14px', color: 'var(--pf-t--global--color--brand--default)', marginLeft: '8px' }}>27.21 KBps out</Button>
                        <div style={{ 
                          height: '80px', 
                          marginTop: '8px', 
                          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">[Network transfer chart]</Content>
                        </div>
                      </GridItem>
                      <GridItem span={12}>
                        <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-mt-md">Pod count</Content>
                        <Button variant="link" isInline style={{ fontSize: '14px', color: 'var(--pf-t--global--color--brand--default)' }}>19</Button>
                        <div style={{ 
                          height: '80px', 
                          marginTop: '8px', 
                          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">[Pod count chart]</Content>
                        </div>
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem span={3}>
                <Card style={{ marginBottom: '24px' }}>
                  <CardBody>
                    <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">Activity</Title>
                    <Button variant="link" isInline style={{ paddingLeft: 0, float: 'right', marginTop: '-40px' }}>View events</Button>
                    <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm">Ongoing</Content>
                    <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">There are no ongoing activities.</Content>
                    <Content className="pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-mt-md">Recent events</Content>
                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem><Label color="blue" isCompact>Pause</Label></FlexItem>
                          <FlexItem>
                            <Content className="pf-v6-u-font-size-sm">18:52</Content>
                            <Button variant="link" isInline style={{ paddingLeft: 0, fontSize: '12px' }}>ushif20-munich-lab-132 sno-v...</Button>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem><Label color="blue" isCompact>Decision</Label></FlexItem>
                          <FlexItem>
                            <Content className="pf-v6-u-font-size-sm">18:52</Content>
                            <Button variant="link" isInline style={{ paddingLeft: 0, fontSize: '12px' }}>test-placement-1-deci...</Button>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            <Card className="pf-v6-u-mt-md">
              <CardBody>
                <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">ResourceQuotas</Title>
                <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">No ResourceQuotas</Content>
              </CardBody>
            </Card>

            <Card className="pf-v6-u-mt-md">
              <CardBody>
                <Title headingLevel="h3" size="md" className="pf-v6-u-mb-md">AppliedClusterResourceQuotas</Title>
                <Content className="pf-v6-u-font-size-sm pf-v6-u-color-200">No AppliedClusterResourceQuotas</Content>
              </CardBody>
            </Card>
          </>
        )}

        {activeTabKey === 1 && (
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">Project Details</Title>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>{projectName}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Status</DescriptionListTerm>
                  <DescriptionListDescription>Active</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        )}

        {activeTabKey === 2 && (
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">YAML</Title>
              <pre
                style={{
                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                  padding: 'var(--pf-t--global--spacer--md)',
                  borderRadius: 'var(--pf-t--global--border--radius--medium)',
                  fontFamily: 'var(--pf-t--global--font--family--mono)',
                  fontSize: 'var(--pf-t--global--font--size--body--sm)',
                  lineHeight: 'var(--pf-t--global--font--line-height--body)',
                  overflow: 'auto',
                }}
              >
                {`apiVersion: v1
kind: Namespace
metadata:
  name: ${projectName}
  labels:
    kubernetes.io/metadata.name: ${projectName}
spec:
  finalizers:
  - kubernetes`}
              </pre>
            </CardBody>
          </Card>
        )}

        {activeTabKey === 3 && (
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">Workloads</Title>
              <Content>Workloads content goes here...</Content>
            </CardBody>
          </Card>
        )}

        {activeTabKey === 4 && (
          <>
            {roleAssignments.length === 0 ? (
              <Card>
                <CardBody>
                  <EmptyState>
                    <CubesIcon />
                    <Title headingLevel="h2" size="lg">
                      No role assignment created yet
                    </Title>
                    <EmptyStateBody>
                      Control what users and groups can access or view by assigning them roles for this project.
                    </EmptyStateBody>
                    <EmptyStateActions>
                      <Button variant="primary" onClick={handleCreateRoleAssignment}>
                        Create role assignment
                      </Button>
                    </EmptyStateActions>
                    <EmptyStateBody>
                      <Button component="a" href="#" variant="link">
                        Link to documentation
                      </Button>
                    </EmptyStateBody>
                  </EmptyState>
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody>
                  {(() => {
                    let filteredAssignments = roleAssignments.filter(assignment =>
                      assignment.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                      assignment.roles.some(role => role.toLowerCase().includes(searchValue.toLowerCase()))
                    );

                    // Apply filter
                    if (filterValue === 'user') {
                      filteredAssignments = filteredAssignments.filter(a => a.type === 'User');
                    } else if (filterValue === 'group') {
                      filteredAssignments = filteredAssignments.filter(a => a.type === 'Group');
                    } else if (filterValue === 'active') {
                      filteredAssignments = filteredAssignments.filter(a => a.status === 'Active');
                    }

                    const paginatedAssignments = filteredAssignments.slice(
                      (page - 1) * perPage,
                      page * perPage
                    );

                    const areAllSelected = roleAssignments.length > 0 && selectedAssignments.size === roleAssignments.length;
                    const areSomeSelected = selectedAssignments.size > 0;

                    return (
                      <>
                        <Toolbar>
                          <ToolbarContent>
                            <ToolbarItem>
                              <Dropdown
                                isOpen={isFilterOpen}
                                onSelect={() => setIsFilterOpen(false)}
                                onOpenChange={(isOpen) => setIsFilterOpen(isOpen)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    isExpanded={isFilterOpen}
                                  >
                                    Filter: {filterValue === 'all' ? 'All' : filterValue === 'user' ? 'User' : filterValue === 'group' ? 'Group' : 'Active'}
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  <DropdownItem key="all" onClick={() => setFilterValue('all')}>
                                    All
                                  </DropdownItem>
                                  <DropdownItem key="user" onClick={() => setFilterValue('user')}>
                                    User
                                  </DropdownItem>
                                  <DropdownItem key="group" onClick={() => setFilterValue('group')}>
                                    Group
                                  </DropdownItem>
                                  <DropdownItem key="active" onClick={() => setFilterValue('active')}>
                                    Active
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </ToolbarItem>
                            <ToolbarItem>
                              <SearchInput
                                placeholder="Search role assignments"
                                value={searchValue}
                                onChange={(_event, value) => setSearchValue(value)}
                                onClear={() => setSearchValue('')}
                              />
                            </ToolbarItem>
                            <ToolbarItem variant="separator" />
                            <ToolbarItem>
                              <Dropdown
                                isOpen={isBulkActionsOpen}
                                onSelect={() => setIsBulkActionsOpen(false)}
                                onOpenChange={(isOpen) => setIsBulkActionsOpen(isOpen)}
                                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                                    isExpanded={isBulkActionsOpen}
                                    variant="secondary"
                                    isDisabled={!areSomeSelected}
                                  >
                                    Actions {areSomeSelected ? `(${selectedAssignments.size} selected)` : ''}
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  <DropdownItem key="delete" onClick={handleBulkDelete}>
                                    Delete selected
                                  </DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </ToolbarItem>
                            <ToolbarItem>
                              <Button variant="primary" onClick={handleCreateRoleAssignment}>
                                Create role assignment
                              </Button>
                            </ToolbarItem>
                          </ToolbarContent>
                        </Toolbar>
                        
                        <Table aria-label="Role assignments table" variant="compact">
                          <Thead>
                            <Tr>
                              <Th style={{ backgroundColor: '#f0f0f0' }} />
                              <Th colSpan={2} style={{ backgroundColor: '#f0f0f0', fontWeight: 600 }}>Subject</Th>
                              <Th colSpan={7} style={{ backgroundColor: '#f0f0f0', fontWeight: 600 }}>Scope</Th>
                              <Th style={{ backgroundColor: '#f0f0f0' }}></Th>
                            </Tr>
                            <Tr>
                              <Th
                                select={{
                                  onSelect: (_event, isSelecting) => handleSelectAll(isSelecting),
                                  isSelected: areAllSelected,
                                }}
                              />
                              <Th sort={{ sortBy: {}, columnIndex: 0 }}>Name</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 1 }}>Type</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 2 }}>Clusters</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 3 }}>Namespaces</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 4 }}>Roles</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 5 }}>Status</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 6 }}>Assigned date</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 7 }}>Assigned by</Th>
                              <Th sort={{ sortBy: {}, columnIndex: 8 }}>Origin</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {paginatedAssignments.map((assignment, rowIndex) => (
                              <Tr key={assignment.id}>
                                <Td
                                  select={{
                                    rowIndex,
                                    onSelect: (_event, isSelecting) => handleSelectAssignment(assignment.id, isSelecting),
                                    isSelected: selectedAssignments.has(assignment.id),
                                  }}
                                />
                                <Td dataLabel="Name">
                                  <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                                    {assignment.name}
                                  </Button>
                                </Td>
                                <Td dataLabel="Type">{assignment.type}</Td>
                            <Td dataLabel="Clusters">
                              {assignment.clusters.map((cluster, idx) => (
                                <span key={idx}>
                                  <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                                    {cluster}
                                  </Button>
                                  {idx < assignment.clusters.length - 1 && ', '}
                                </span>
                              ))}
                            </Td>
                            <Td dataLabel="Namespaces">
                              {assignment.namespaces.map((ns, idx) => (
                                <span key={idx}>
                                  <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                                    {ns}
                                  </Button>
                                  {idx < assignment.namespaces.length - 1 && ', '}
                                </span>
                              ))}
                            </Td>
                            <Td dataLabel="Roles">
                              {assignment.roles.map((role, idx) => (
                                <span key={idx}>
                                  <Button variant="link" isInline style={{ paddingLeft: 0 }}>
                                    {role}
                                  </Button>
                                  {idx < assignment.roles.length - 1 && ', '}
                                </span>
                              ))}
                            </Td>
                            <Td dataLabel="Status">
                              <Label color="green" icon={<span>✓</span>}>
                                {assignment.status}
                              </Label>
                            </Td>
                            <Td dataLabel="Assigned date">{assignment.assignedDate}</Td>
                            <Td dataLabel="Assigned by">{assignment.assignedBy}</Td>
                            <Td dataLabel="Origin">{assignment.origin}</Td>
                            <Td isActionCell>
                              <ActionsColumn
                                items={[
                                  {
                                    title: 'Edit',
                                    onClick: () => console.log('Edit', assignment.id)
                                  },
                                  {
                                    isSeparator: true
                                  },
                                  {
                                    title: 'Delete',
                                    onClick: () => handleDeleteAssignment(assignment.id)
                                  }
                                ]}
                              />
                            </Td>
                          </Tr>
                        ))}
                            </Tbody>
                          </Table>
                          
                          <Toolbar>
                            <ToolbarContent>
                              <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                                <Pagination
                                  itemCount={filteredAssignments.length}
                                  page={page}
                                  perPage={perPage}
                                  onSetPage={onSetPage}
                                  onPerPageSelect={onPerPageSelect}
                                  variant={PaginationVariant.bottom}
                                />
                              </ToolbarItem>
                            </ToolbarContent>
                          </Toolbar>
                        </>
                      );
                    })()}
                </CardBody>
              </Card>
            )}
          </>
        )}

        {activeTabKey === 5 && (
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="lg" className="pf-v6-u-mb-md">Vulnerabilities</Title>
              <Content>Vulnerabilities content goes here...</Content>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Role Assignment Wizard */}
      <RoleAssignmentWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
        context="projects"
      />

      {/* Success Alert */}
      <AlertGroup isToast isLiveRegion>
        {showSuccessAlert && (
          <Alert
            variant="success"
            title="Role assignment created"
            actionClose={
              <AlertActionCloseButton onClose={() => setShowSuccessAlert(false)} />
            }
            timeout={10000}
            onTimeout={() => setShowSuccessAlert(false)}
          />
        )}
      </AlertGroup>
    </>
  );
};

