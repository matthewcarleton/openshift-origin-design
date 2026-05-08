import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText,
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Button,
  MenuToggle,
  Pagination,
  PaginationVariant,
  Grid,
  GridItem,
  Content,
  InputGroup,
  InputGroupItem,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Label,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { FilterIcon, SearchIcon, ArrowRightIcon, MinusCircleIcon, CheckCircleIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '../../../../utils/useDocumentTitle';
import { dataService } from '../../../../data/dataService';

const CostModelDetail: React.FunctionComponent = () => {
  const { costModelId } = useParams<{ costModelId: string }>();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  // Get cost model from database
  const costModel = costModelId ? dataService.getCostModelById(costModelId) : null;

  // Get clusters that use this cost model to show assigned integrations
  const allClusters = dataService.getAllClusters();
  const assignedClusters = costModel ? allClusters.filter(cluster => cluster.costModelId === costModel.id) : [];

  useDocumentTitle(`Cost Management | ${costModel?.name || 'Cost Model Details'}`);

  if (!costModel) {
    return (
      <PageSection>
        <Title headingLevel="h1">Cost model not found</Title>
        <p>The cost model with ID "{costModelId}" was not found.</p>
        <Link to="/cost-management/settings">Back to Settings</Link>
      </PageSection>
    );
  }

  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <>
      <header style={{ padding: '1.5rem 1.5rem 0px', backgroundColor: 'var(--pf-t--global--background--color--100)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Breadcrumb style={{ paddingBottom: 'var(--pf-t--global--spacer--md)' }}>
            <BreadcrumbItem>
              <Link to="/cost-management/settings">Cost models</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{costModel.name}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Split>
          <SplitItem isFilled style={{ width: '97%', overflowWrap: 'break-word' }}>
            <Title headingLevel="h1" size="2xl" style={{ paddingBottom: 'var(--pf-t--global--spacer--sm)' }}>
              {costModel.name}
            </Title>
          </SplitItem>
          <SplitItem>
            <MenuToggle
              variant="plain"
              aria-label="More options"
              isExpanded={false}
            >
              <EllipsisVIcon />
            </MenuToggle>
          </SplitItem>
        </Split>
        <Content style={{ paddingBottom: '1rem', paddingTop: '1.5rem' }}>
          <dl>
            <dt>Last updated</dt>
            <dd>{costModel.lastModified}</dd>
            <dt>Currency</dt>
            <dd>{costModel.currency} ($) - United States Dollar</dd>
          </dl>
        </Content>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Cost model details tabs"
          role="region"
        >
          <Tab eventKey={0} title={<TabTitleText>Price list</TabTitleText>} aria-label="Price list" />
          <Tab eventKey={1} title={<TabTitleText>Cost calculations</TabTitleText>} aria-label="Cost calculations" />
          <Tab eventKey={2} title={<TabTitleText>Integrations</TabTitleText>} aria-label="Integrations" />
        </Tabs>
      </header>

      <PageSection>
        {activeTabKey === 0 && (
          <Card>
            <CardBody>
              <Toolbar id="price-list-toolbar" style={{ gap: '1rem' }}>
                <ToolbarContent>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <MenuToggle isFullWidth>Metric</MenuToggle>
                    </ToolbarItem>
                    <ToolbarItem>
                      <MenuToggle>Filter by metrics</MenuToggle>
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem>
                    <Button variant="primary">Add rate</Button>
                  </ToolbarItem>
                  <ToolbarItem variant="pagination">
                    <Pagination
                      itemCount={4}
                      perPage={4}
                      page={1}
                      variant={PaginationVariant.top}
                      titles={{
                        paginationAriaLabel: 'Price list top pagination'
                      }}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Create a price list" variant="compact">
                <Thead>
                  <Tr>
                    <Th sort={{ sortBy: {}, columnIndex: 0 }}>Metric</Th>
                    <Th>Description</Th>
                    <Th sort={{ sortBy: {}, columnIndex: 2 }}>Measurement</Th>
                    <Th>Calculation type</Th>
                    <Th>Rate</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>CPU</Td>
                    <Td>computation</Td>
                    <Td>Effective-usage (core-hours)</Td>
                    <Td>Infrastructure</Td>
                    <Td>$0.25</Td>
                    <Td isActionCell>
                      <MenuToggle variant="plain" aria-label="Kebab toggle">
                        <EllipsisVIcon />
                      </MenuToggle>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Cluster</Td>
                    <Td>subscriptions</Td>
                    <Td>Count (cluster-month)</Td>
                    <Td>Infrastructure</Td>
                    <Td>$1,000</Td>
                    <Td isActionCell>
                      <MenuToggle variant="plain" aria-label="Kebab toggle">
                        <EllipsisVIcon />
                      </MenuToggle>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Node</Td>
                    <Td>operation</Td>
                    <Td>Count (node-month)</Td>
                    <Td>Infrastructure</Td>
                    <Td>
                      <button type="button" style={{ border: 'none', background: 'none', color: 'var(--pf-t--global--color--brand--default)', cursor: 'pointer', textDecoration: 'underline' }}>
                        Various
                      </button>
                    </Td>
                    <Td isActionCell>
                      <MenuToggle variant="plain" aria-label="Kebab toggle">
                        <EllipsisVIcon />
                      </MenuToggle>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Cluster</Td>
                    <Td></Td>
                    <Td>Count (cluster-month)</Td>
                    <Td>Infrastructure</Td>
                    <Td>$10,000</Td>
                    <Td isActionCell>
                      <MenuToggle variant="plain" aria-label="Kebab toggle">
                        <EllipsisVIcon />
                      </MenuToggle>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>

              <Pagination
                itemCount={4}
                perPage={4}
                page={1}
                variant={PaginationVariant.bottom}
                titles={{
                  paginationAriaLabel: 'Price list bottom pagination'
                }}
                style={{ paddingTop: '0.5rem' }}
              />
            </CardBody>
          </Card>
        )}

        {activeTabKey === 1 && (
          <Grid hasGutter>
            <GridItem lg={6}>
              <Card style={{ minHeight: '330px' }}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <Title headingLevel="h2" size="md">Markup or Discount</Title>
                    <Button variant="link" aria-label="Edit markup">Edit</Button>
                  </div>
                  <div style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                    This Percentage is applied to raw cost calculations by multiplying the cost with this percentage. Costs calculated from price list rates will not be effected.
                  </div>
                  <div style={{ fontSize: '1.25rem', textAlign: 'center', marginTop: '2rem' }}>
                    {costModel.markupRate} % {costModel.isDiscount ? 'Discount' : 'Markup'}
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem lg={6}>
              <Card style={{ minHeight: '330px' }}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <Title headingLevel="h2" size="md">Cost distribution</Title>
                    <Button variant="link" aria-label="Edit distribution">Edit</Button>
                  </div>
                  <div style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                    The following is the type of metric that is set to be used when distributing costs to the project level breakdowns.
                  </div>
                  <div style={{ fontSize: '1.25rem', textAlign: 'center', marginTop: '2rem' }}>
                    <div>Distribute costs based on CPU usage</div>
                    <div>Distribute platform costs</div>
                    <div>Distribute worker unallocated capacity</div>
                    <div>Distribute network costs</div>
                    <div>Distribute storage costs</div>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        )}

        {activeTabKey === 2 && (
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                Integration: {costModel.sourceType}
              </Title>
              <Toolbar id="assign-sources-toolbar">
                <ToolbarContent>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <InputGroup>
                        <InputGroupItem isFill>
                          <TextInputGroup>
                            <TextInputGroupMain
                              icon={<SearchIcon />}
                              placeholder="Filter by name..."
                              aria-label="Search input"
                            />
                          </TextInputGroup>
                        </InputGroupItem>
                        <InputGroupItem>
                          <Button variant="control" aria-label="Search">
                            <ArrowRightIcon />
                          </Button>
                        </InputGroupItem>
                      </InputGroup>
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem>
                    <Button variant="primary">Assign integration</Button>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>

              <Table aria-label="Integrations table" variant="compact">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Operator version</Th>
                    <Th>Last processed</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {assignedClusters.length > 0 ? (
                    assignedClusters.map((cluster) => (
                      <Tr key={cluster.id}>
                        <Td>{cluster.displayName}</Td>
                        <Td>
                          <Label color="green" icon={<CheckCircleIcon />} isCompact>
                            {cluster.operatorVersion}
                          </Label>
                        </Td>
                        <Td>Oct 24, 2025, 11:01 UTC</Td>
                        <Td isActionCell>
                          <Button variant="plain" size="sm" aria-label="Unassign">
                            <MinusCircleIcon />
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                        No integrations assigned to this cost model
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}
      </PageSection>
    </>
  );
};

export default CostModelDetail;

