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
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Grid,
  GridItem,
  List,
  ListItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Link, useParams } from 'react-router-dom';
import { OutlinedQuestionCircleIcon, TagIcon, FilterIcon, ExportIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { dataService } from '../../../../data/dataService';

const NodeDetail: React.FunctionComponent = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [activeTab, setActiveTab] = React.useState<string | number>(0);
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [currency, setCurrency] = React.useState('USD ($) - United States Dollar');

  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTab(tabIndex);
  };

  // Get node data from database
  const node = dataService.getNodeById(nodeId || '');
  
  if (!node) {
    return (
      <PageSection>
        <Title headingLevel="h1" size="2xl">Node not found</Title>
        <p>The node with ID "{nodeId}" was not found.</p>
        <Link to="/cost-management-integrated/openshift?filter[limit]=10&filter[offset]=0&filter[time_scope_value]=-1&group_by[node]=*">
          Back to OpenShift
        </Link>
      </PageSection>
    );
  }

  const nodeData = {
    name: node.name,
    id: node.id,
    totalCost: node.cost,
    dateRange: 'October 1 – 24',
    cluster: node.clusterId,
    provider: node.provider,
    instanceType: node.instanceType,
    nodeType: node.nodeType,
    architecture: node.architecture || 'x86_64',
  };

  // Hardcoded storage types for now
  const storageTypes = [
    { name: 'gp3-csi', cost: '$0.21', percentage: 100 },
    { name: 'No-storageclass', cost: '$0.00', percentage: 0 },
  ];

  // Hardcoded virtual machines
  const virtualMachines = [
    {
      name: 'rhel-9-violet-anaconda-98',
      project: 'vm-testing',
      cluster: 'demolab',
      storage: '0',
      tags: 3,
      cost: 1.37,
    },
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
              <BreadcrumbItem to="/cost-management-integrated/overview">Cost Management</BreadcrumbItem>
              <BreadcrumbItem to="/cost-management-integrated/openshift">OpenShift</BreadcrumbItem>
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
                <Link to="/cost-management-integrated/openshift?filter[limit]=10&filter[offset]=0&filter[time_scope_value]=-1&group_by[node]=*">
                  Back to OpenShift node details
                </Link>
              </li>
            </ol>
          </nav>

          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
            {/* Left side: Node name */}
            <FlexItem>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--pf-t--global--spacer--xs)' }}>
                    <Title headingLevel="h2" size="md" style={{ marginBottom: 0, marginRight: 'var(--pf-t--global--spacer--md)', whiteSpace: 'nowrap' }}>
                      Currency
                    </Title>
                    <Select
                      id="currency-select"
                      isOpen={currencyOpen}
                      selected={currency}
                      onSelect={(_event, value) => {
                        setCurrency(value as string);
                        setCurrencyOpen(false);
                      }}
                      onOpenChange={(isOpen) => setCurrencyOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle ref={toggleRef} onClick={() => setCurrencyOpen(!currencyOpen)} isExpanded={currencyOpen} style={{ width: '200px' }}>
                          {currency}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="USD ($) - United States Dollar">USD ($) - United States Dollar</SelectOption>
                      </SelectList>
                    </Select>
                  </div>
                </FlexItem>
                <FlexItem>
                  <Title headingLevel="h1" size="2xl">{nodeData.name}</Title>
                </FlexItem>
              </Flex>
            </FlexItem>

            {/* Right side: Cost */}
            <FlexItem alignSelf={{ default: 'alignSelfFlexStart' }}>
              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                <Title headingLevel="h2" size="4xl" style={{ marginTop: 0, marginBottom: 0, textAlign: 'right' }}>
                  <span>${nodeData.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </Title>
                <div style={{ textAlign: 'right' }}>Node total cost ({nodeData.dateRange})</div>
              </div>
            </FlexItem>
          </Flex>

          {/* Tabs */}
          <Tabs activeKey={activeTab} onSelect={handleTabClick} style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
            <Tab eventKey={0} title={<TabTitleText>Cost overview</TabTitleText>} tabContentId="tab-0" />
            <Tab eventKey={1} title={<TabTitleText>Historical data</TabTitleText>} tabContentId="tab-1" />
            <Tab eventKey={2} title={<TabTitleText>Virtualization</TabTitleText>} tabContentId="tab-2" />
          </Tabs>
        </div>
      </PageSection>

      {/* Tab Content - Cost overview */}
      <PageSection style={{ display: activeTab === 0 ? 'block' : 'none' }}>
        <TabContent eventKey={0} id="tab-0" activeKey={activeTab}>
          <Grid hasGutter>
            <GridItem xl={6} xl2={6}>
              <Grid hasGutter>
                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">
                        Cost breakdown
                        <OutlinedQuestionCircleIcon style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                      </Title>
                    </CardTitle>
                    <CardBody>
                      <div style={{ height: '332px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        Cost breakdown chart placeholder
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">Storage cost breakdown by type</Title>
                    </CardTitle>
                    <CardBody>
                      <List isPlain>
                        {storageTypes.map((type, index) => (
                          <ListItem key={index}>
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span>{type.name}</span>
                                <span>{type.cost} ({type.percentage} %)</span>
                              </div>
                              <div style={{ height: '8px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '4px' }}>
                                <div style={{ width: `${type.percentage}%`, height: '100%', backgroundColor: 'var(--pf-t--global--color--brand--default)', borderRadius: '4px' }}></div>
                              </div>
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem xl={6} xl2={6}>
              <Grid hasGutter>
                <GridItem>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h2" size="lg">CPU</Title>
                    </CardTitle>
                    <CardBody>
                      <div style={{ marginBottom: '1rem' }}>96 core maximum</div>
                      <Grid hasGutter>
                        <GridItem md={12} lg={6}>
                          <div>Unused capacity</div>
                          <div style={{ fontWeight: 700 }}>8,871.62</div>
                          <div>core-hours (96% of capacity)</div>
                        </GridItem>
                        <GridItem md={12} lg={6}>
                          <div>Unused requests</div>
                          <div style={{ fontWeight: 700 }}>248.72</div>
                          <div>core-hours (3% of capacity)</div>
                        </GridItem>
                      </Grid>
                      <div style={{ height: '148px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        CPU chart placeholder
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
                      <div style={{ marginBottom: '1rem' }}>377.51 GiB maximum</div>
                      <Grid hasGutter>
                        <GridItem md={12} lg={6}>
                          <div>Unused capacity</div>
                          <div style={{ fontWeight: 700 }}>34,187.39</div>
                          <div>GiB-hours (94% of capacity)</div>
                        </GridItem>
                        <GridItem md={12} lg={6}>
                          <div>Unused requests</div>
                          <div style={{ fontWeight: 700 }}>0</div>
                          <div>GiB-hours (0% of capacity)</div>
                        </GridItem>
                      </Grid>
                      <div style={{ height: '148px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        Memory chart placeholder
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
                      <div style={{ marginBottom: '1rem' }}>32 GiB maximum</div>
                      <Grid hasGutter>
                        <GridItem md={12} lg={6}>
                          <div>Unused capacity</div>
                          <div style={{ fontWeight: 700 }}>0.76</div>
                          <div>GiB-month (16% of capacity)</div>
                        </GridItem>
                        <GridItem md={12} lg={6}>
                          <div>Unused requests</div>
                          <div style={{ fontWeight: 700 }}>4.04</div>
                          <div>GiB-month (84% of capacity)</div>
                        </GridItem>
                      </Grid>
                      <div style={{ height: '148px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                        Volume chart placeholder
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </TabContent>
      </PageSection>

      {/* Tab Content - Historical data */}
      <PageSection style={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <TabContent eventKey={1} id="tab-1" activeKey={activeTab}>
          <Grid hasGutter>
            <GridItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">Cost comparison</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Cost comparison chart placeholder
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">CPU usage, request, and limit comparison</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    CPU comparison chart placeholder
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">Memory usage, request, and limit comparison</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Memory comparison chart placeholder
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">Network usage comparison</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Network usage chart placeholder
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h2" size="lg">Storage usage comparison</Title>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Storage usage chart placeholder
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </TabContent>
      </PageSection>

      {/* Tab Content - Virtualization */}
      <PageSection style={{ display: activeTab === 2 ? 'block' : 'none' }}>
        <TabContent eventKey={2} id="tab-2" activeKey={activeTab}>
          <Card>
            <CardBody>
              <Toolbar id="toolbar">
                <ToolbarContent>
                  <ToolbarItem>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" aria-label="Select all items" />
                      <MenuToggle>
                        <span>Select</span>
                      </MenuToggle>
                    </div>
                  </ToolbarItem>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <FilterIcon />
                    </ToolbarItem>
                    <ToolbarItem>
                      <MenuToggle>Cluster</MenuToggle>
                    </ToolbarItem>
                    <ToolbarItem>
                      <MenuToggle>includes</MenuToggle>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput placeholder="Filter by cluster" aria-label="Filter by cluster" />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem alignSelf="end">
                    <ExportIcon />
                  </ToolbarItem>
                  <ToolbarItem variant="pagination">
                    <Pagination
                      itemCount={virtualMachines.length}
                      perPage={10}
                      page={1}
                      variant={PaginationVariant.top}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
              <Table aria-label="Virtual machines table" variant="compact">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Virtual machine names</Th>
                    <Th>Project names</Th>
                    <Th>Cluster names</Th>
                    <Th>Storage</Th>
                    <Th>Tags</Th>
                    <Th style={{ textAlign: 'right' }}>Cost</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {virtualMachines.map((vm, index) => (
                    <Tr key={index}>
                      <Td>
                        <input type="checkbox" aria-label={`Select row ${index}`} />
                      </Td>
                      <Td>{vm.name}</Td>
                      <Td>{vm.project}</Td>
                      <Td>{vm.cluster}</Td>
                      <Td>{vm.storage}</Td>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <TagIcon />
                          <Link to="#">{vm.tags}</Link>
                        </div>
                      </Td>
                      <Td style={{ textAlign: 'right' }}>${vm.cost.toFixed(2)}</Td>
                      <Td>
                        <MenuToggle aria-label="More options">
                          <EllipsisVIcon />
                        </MenuToggle>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
                <Pagination
                  itemCount={virtualMachines.length}
                  perPage={10}
                  page={1}
                  variant={PaginationVariant.bottom}
                />
              </div>
            </CardBody>
          </Card>
        </TabContent>
      </PageSection>
    </>
  );
};

export default NodeDetail;

