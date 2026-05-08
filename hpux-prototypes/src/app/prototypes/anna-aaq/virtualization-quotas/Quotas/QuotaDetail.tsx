import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Card,
  CardBody,
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabTitleText,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  Content,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td, ActionsColumn } from '@patternfly/react-table';
import { ChartDonut } from '@patternfly/react-charts/victory';
import { ArrowsAltVIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { useQuotas } from '@app/shared/contexts/QuotasContext';

export const QuotaDetail: React.FC = () => {
  const { quotaName } = useParams<{ quotaName: string }>();
  const navigate = useNavigate();
  const { findQuotaByName, deleteQuota } = useQuotas();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  useDocumentTitle(`${quotaName} - Quota Details`);

  // Find the quota in context
  const contextQuota = findQuotaByName(quotaName || '');

  const handleDeleteClick = () => {
    setIsActionsOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contextQuota) {
      deleteQuota(contextQuota.id);
    }
    setIsDeleteModalOpen(false);
    navigate('/core/virtualization/quotas');
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  // Mock data - in a real app, this would be fetched based on quotaName
  const quotaData = {
    name: quotaName || 'dev-cluster-virt-quota',
    scope: 'Project-scoped',
    labelSelector: 'No labels',
    projectAnnotation: 'No selector',
    project: 'open-cluster-management',
    createdAt: 'Oct 22, 2025 2:14 pm',
    cpuUsed: 32,
    cpuTotal: 64,
    memoryUsed: 64,
    memoryTotal: 256,
    vmUsed: 10,
    vmTotal: 12,
  };

  const cpuPercentage = Math.round((quotaData.cpuUsed / quotaData.cpuTotal) * 100);

  const resourceDetails = [
    { type: 'CPU limit', capacity: 0, used: 0, max: 0 },
    { type: 'Memory limit', capacity: 0, used: 0, max: 0 },
    { type: 'VM limit', capacity: 0, used: 0, max: 0 },
  ];

  return (
    <div className="quotas-page-container">
      <div className="page-header-section">
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/core/virtualization/quotas'); }}>
            Quotas
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Virtualization quota details</BreadcrumbItem>
        </Breadcrumb>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title headingLevel="h1" size="2xl">
            {quotaData.name}
          </Title>
          
          <Dropdown
            isOpen={isActionsOpen}
            onSelect={() => setIsActionsOpen(false)}
            onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                isExpanded={isActionsOpen}
              >
                Actions
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem 
                key="edit"
                onClick={() => navigate('/core/virtualization/quotas/create', { state: { editMode: true, quotaData } })}
              >
                Edit
              </DropdownItem>
              <DropdownItem 
                key="delete"
                onClick={handleDeleteClick}
              >
                Delete
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </div>

        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
        >
          <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>} />
        </Tabs>
      </div>

      <div className="page-content-section">
        {activeTabKey === 0 && (
          <>
            {/* Utilization Cards */}
            <Grid hasGutter style={{ marginBottom: '24px' }}>
              {/* CPU quota utilization */}
              <GridItem span={4}>
                <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', height: '100%' }}>
                  <CardBody>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <Title headingLevel="h3" size="lg" style={{ color: '#151515', marginBottom: '16px' }}>
                        CPU quota utilization
                      </Title>
                      <div style={{ height: '250px', width: '230px', margin: '0 auto' }}>
                        <ChartDonut
                          ariaDesc="CPU quota utilization"
                          ariaTitle="CPU quota utilization"
                          constrainToVisibleArea={true}
                          data={[
                            { x: 'Used', y: quotaData.cpuUsed },
                            { x: 'Available', y: quotaData.cpuTotal - quotaData.cpuUsed }
                          ]}
                          labels={({ datum }) => `${datum.y} cores ${datum.x.toLowerCase()}`}
                          legendData={[
                            { name: `${quotaData.cpuUsed} cores used` },
                            { name: `${quotaData.cpuTotal - quotaData.cpuUsed} cores available` }
                          ]}
                          legendOrientation="vertical"
                          legendPosition="bottom"
                          padding={{
                            bottom: 85,
                            left: 20,
                            right: 20,
                            top: 20
                          }}
                          subTitle={`of ${quotaData.cpuTotal} cores`}
                          title={`${cpuPercentage}%`}
                          width={230}
                          height={250}
                          colorScale={['#0066cc', '#73bcf7']}
                          style={{
                            labels: {
                              fontSize: 18
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Memory utilization */}
              <GridItem span={4}>
                <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', height: '100%' }}>
                  <CardBody>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <Title headingLevel="h3" size="lg" style={{ color: '#151515', marginBottom: '16px' }}>
                        Memory utilization
                      </Title>
                      <div style={{ height: '250px', width: '230px', margin: '0 auto' }}>
                        <ChartDonut
                          ariaDesc="Memory utilization"
                          ariaTitle="Memory utilization"
                          constrainToVisibleArea={true}
                          data={[
                            { x: 'Used', y: quotaData.memoryUsed },
                            { x: 'Available', y: quotaData.memoryTotal - quotaData.memoryUsed }
                          ]}
                          labels={({ datum }) => `${datum.y} GiB ${datum.x.toLowerCase()}`}
                          legendData={[
                            { name: `${quotaData.memoryUsed} GiB used` },
                            { name: `${quotaData.memoryTotal - quotaData.memoryUsed} GiB available` }
                          ]}
                          legendOrientation="vertical"
                          legendPosition="bottom"
                          padding={{
                            bottom: 85,
                            left: 20,
                            right: 20,
                            top: 20
                          }}
                          subTitle={`of ${quotaData.memoryTotal} GiB`}
                          title={`${quotaData.memoryUsed} GiB`}
                          width={230}
                          height={250}
                          colorScale={['#ec7a08', '#f4b678']}
                          style={{
                            labels: {
                              fontSize: 18
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>

              {/* VM utilization */}
              <GridItem span={4}>
                <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', height: '100%' }}>
                  <CardBody>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <Title headingLevel="h3" size="lg" style={{ color: '#151515', marginBottom: '16px' }}>
                        VM utilization
                      </Title>
                      <div style={{ height: '250px', width: '230px', margin: '0 auto' }}>
                        <ChartDonut
                          ariaDesc="VM utilization"
                          ariaTitle="VM utilization"
                          constrainToVisibleArea={true}
                          data={[
                            { x: 'Used', y: quotaData.vmUsed },
                            { x: 'Available', y: quotaData.vmTotal - quotaData.vmUsed }
                          ]}
                          labels={({ datum }) => `${datum.y} VMs ${datum.x.toLowerCase()}`}
                          legendData={[
                            { name: `${quotaData.vmUsed} VMs used` },
                            { name: `${quotaData.vmTotal - quotaData.vmUsed} VMs available` }
                          ]}
                          legendOrientation="vertical"
                          legendPosition="bottom"
                          padding={{
                            bottom: 85,
                            left: 20,
                            right: 20,
                            top: 20
                          }}
                          subTitle={`of ${quotaData.vmTotal} VMs`}
                          title={`${quotaData.vmUsed}`}
                          width={230}
                          height={250}
                          colorScale={['#c9190b', '#f4b678']}
                          style={{
                            labels: {
                              fontSize: 18
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Details Section */}
            <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2', marginBottom: '24px' }}>
              <CardBody>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
                  Details
                </Title>
                <DescriptionList isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Name</DescriptionListTerm>
                    <DescriptionListDescription>{quotaData.name}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Scope</DescriptionListTerm>
                    <DescriptionListDescription>{quotaData.scope}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Label selector</DescriptionListTerm>
                    <DescriptionListDescription>{quotaData.labelSelector}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Project annotation</DescriptionListTerm>
                    <DescriptionListDescription>{quotaData.projectAnnotation}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Project</DescriptionListTerm>
                    <DescriptionListDescription>{quotaData.project}</DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Created at</DescriptionListTerm>
                    <DescriptionListDescription>{quotaData.createdAt}</DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
            </Card>

            {/* Virtualization quota details Table */}
            <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2' }}>
              <CardBody>
                <Title headingLevel="h2" size="xl" style={{ marginBottom: '16px' }}>
                  Virtualization quota details
                </Title>
                <Table variant="compact">
                  <Thead>
                    <Tr>
                      <Th>
                        Resource type <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                      </Th>
                      <Th>
                        Capacity <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                      </Th>
                      <Th>
                        Used <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                      </Th>
                      <Th>
                        Max <ArrowsAltVIcon style={{ marginLeft: '4px', fontSize: '12px' }} />
                      </Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {resourceDetails.map((resource, index) => (
                      <Tr key={index}>
                        <Td>{resource.type}</Td>
                        <Td>{resource.capacity}</Td>
                        <Td>{resource.used}</Td>
                        <Td>{resource.max}</Td>
                        <Td>
                          <ActionsColumn
                            items={[
                              {
                                title: 'Edit',
                                onClick: () => console.log('Edit', resource.type),
                              },
                              {
                                title: 'Delete',
                                onClick: () => console.log('Delete', resource.type),
                              },
                            ]}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </>
        )}

        {activeTabKey === 1 && (
          <Card style={{ backgroundColor: '#ffffff', border: '1px solid #d2d2d2' }}>
            <CardBody>
              <pre style={{ fontFamily: 'var(--pf-t--global--font--family--mono)', fontSize: '14px' }}>
                {`apiVersion: quota.openshift.io/v1
kind: ApplicationAwareClusterResourceQuota
metadata:
  name: ${quotaData.name}
spec:
  quota:
    hard:
      cpu: "${quotaData.cpuTotal}"
      memory: "${quotaData.memoryTotal}Gi"
      vms: "${quotaData.vmTotal}"
  selector:
    annotations:
      openshift.io/requester: ${quotaData.project}`}
              </pre>
            </CardBody>
          </Card>
        )}
      </div>

      <Modal
        variant={ModalVariant.medium}
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        aria-label="Delete quota confirmation"
      >
        <div style={{ padding: '24px' }}>
          <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            Delete quota?
          </Title>
          
          <Content component="p" style={{ 
            marginBottom: 'var(--pf-t--global--spacer--lg)',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Are you sure you want to delete quota <strong>{quotaName}</strong>? This action cannot be undone.
          </Content>

          <div style={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px'
          }}>
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

