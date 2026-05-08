import * as React from 'react';
import {
  Title,
  Content,
  Card,
  CardBody,
  CardTitle,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarToggleGroup,
  MenuToggle,
  Select,
  SelectOption,
  SelectList,
  SearchInput,
  Button,
  Pagination,
  PaginationVariant,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Tabs,
  Tab,
  TabContent,
  InputGroup,
  InputGroupItem,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Label,
  Checkbox,
  Modal,
  ModalVariant,
  Wizard,
  WizardStep,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  ActionList,
  ActionListItem,
  ActionListGroup,
  Stack,
  StackItem,
  Radio,
  List,
  ListItem,
  Popover,
  Grid,
  GridItem,
  Alert,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import {
  FilterIcon,
  SearchIcon,
  ArrowRightIcon,
  MinusCircleIcon,
  EllipsisVIcon,
  TimesIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { dataService } from '../../../data/dataService';

interface CostModel {
  id: string;
  name: string;
  description: string;
  integration: string;
  assignedIntegrations: number;
  lastUpdated: string;
}

interface TagItem {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
  integration: string;
}

interface CategoryItem {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
}

interface PlatformProject {
  id: string;
  name: string;
  isDefault: boolean;
  group: string;
  clusters: string[];
}

const CostManagementSettings: React.FunctionComponent = () => {
  const [activeTab, setActiveTab] = React.useState<string | number>(0);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [sortIndex, setSortIndex] = React.useState<number>(0);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Currency tab state
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [showCostAsOpen, setShowCostAsOpen] = React.useState(false);
  const [perspectiveOpen, setPerspectiveOpen] = React.useState(false);
  const [perspective, setPerspective] = React.useState<'calendar' | 'billing'>('calendar');
  const [bufferMode, setBufferMode] = React.useState<'default' | 'custom'>('default');
  const [customMode, setCustomMode] = React.useState<'all' | 'per-provider'>('all');
  const [allProvidersBefore, setAllProvidersBefore] = React.useState('3');
  const [allProvidersAfter, setAllProvidersAfter] = React.useState('3');
  const [providerBuffers, setProviderBuffers] = React.useState<{
    aws: { before: string; after: string };
    gcp: { before: string; after: string };
    azure: { before: string; after: string };
  }>({
    aws: { before: '3', after: '3' },
    gcp: { before: '3', after: '3' },
    azure: { before: '3', after: '3' },
  });

  // Load buffer configuration from localStorage on mount
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('bufferConfiguration');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setBufferMode(config.bufferMode || 'default');
        setCustomMode(config.customMode || 'all');
        setAllProvidersBefore(config.allProvidersBefore || '3');
        setAllProvidersAfter(config.allProvidersAfter || '3');
        setProviderBuffers(config.providerBuffers || {
          aws: { before: '3', after: '3' },
          gcp: { before: '3', after: '3' },
          azure: { before: '3', after: '3' },
        });
      } catch (e) {
        console.error('Failed to load buffer configuration:', e);
      }
    }
  }, []);

  // Save buffer configuration to localStorage whenever it changes
  React.useEffect(() => {
    const config = {
      bufferMode,
      customMode,
      allProvidersBefore,
      allProvidersAfter,
      providerBuffers,
    };
    localStorage.setItem('bufferConfiguration', JSON.stringify(config));
  }, [bufferMode, customMode, allProvidersBefore, allProvidersAfter, providerBuffers]);

  // Tags tab state
  const [tagsSubTab, setTagsSubTab] = React.useState<string | number>(0);
  const [tagsPage, setTagsPage] = React.useState(1);
  const [tagsPerPage, setTagsPerPage] = React.useState(10);
  const [tagsCategoryOpen, setTagsCategoryOpen] = React.useState(false);
  const [tagsSearchValue, setTagsSearchValue] = React.useState('');
  const [tagsSortIndex, setTagsSortIndex] = React.useState<number>(1);
  const [tagsSortDirection, setTagsSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [selectAllTags, setSelectAllTags] = React.useState(false);

  // Categories tab state
  const [categoriesPage, setCategoriesPage] = React.useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = React.useState(10);
  const [categoriesCategoryOpen, setCategoriesCategoryOpen] = React.useState(false);
  const [categoriesSearchValue, setCategoriesSearchValue] = React.useState('');
  const [categoriesSortIndex, setCategoriesSortIndex] = React.useState<number>(1);
  const [categoriesSortDirection, setCategoriesSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [selectAllCategories, setSelectAllCategories] = React.useState(false);

  // Platform projects tab state
  const [projectsPage, setProjectsPage] = React.useState(1);
  const [projectsPerPage, setProjectsPerPage] = React.useState(10);
  const [projectsCategoryOpen, setProjectsCategoryOpen] = React.useState(false);
  const [projectsSearchValue, setProjectsSearchValue] = React.useState('');
  const [projectsSortIndex, setProjectsSortIndex] = React.useState<number>(3);
  const [projectsSortDirection, setProjectsSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [selectAllProjects, setSelectAllProjects] = React.useState(false);

  // Map tags tab state
  const [mapTagsPage, setMapTagsPage] = React.useState(1);
  const [mapTagsPerPage, setMapTagsPerPage] = React.useState(10);
  const [mapTagsCategoryOpen, setMapTagsCategoryOpen] = React.useState(false);
  const [mapTagsSearchValue, setMapTagsSearchValue] = React.useState('');
  const [mapTagsSortIndex, setMapTagsSortIndex] = React.useState<number>(1);
  const [mapTagsSortDirection, setMapTagsSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [expandedMapTags, setExpandedMapTags] = React.useState<Set<string>>(new Set());

  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [wizardName, setWizardName] = React.useState('');
  const [wizardDescription, setWizardDescription] = React.useState('');
  const [wizardIntegrationOpen, setWizardIntegrationOpen] = React.useState(false);
  const [wizardIntegration, setWizardIntegration] = React.useState('');
  const [wizardCurrencyOpen, setWizardCurrencyOpen] = React.useState(false);
  const [wizardCurrency, setWizardCurrency] = React.useState('USD ($) - United States Dollar');
  const [wizardIsDiscount, setWizardIsDiscount] = React.useState(false);
  const [wizardMarkupRate, setWizardMarkupRate] = React.useState('0');
  const [wizardSelectedIntegrations, setWizardSelectedIntegrations] = React.useState<string[]>([]);
  const [wizardIntegrationSearchValue, setWizardIntegrationSearchValue] = React.useState('');

  // OCP Wizard - Price list state
  const [ocpShowCreateRate, setOcpShowCreateRate] = React.useState(false);
  const [ocpPriceListRates, setOcpPriceListRates] = React.useState<any[]>([]);
  const [ocpRateDescription, setOcpRateDescription] = React.useState('');
  const [ocpRateMetricOpen, setOcpRateMetricOpen] = React.useState(false);
  const [ocpRateMetric, setOcpRateMetric] = React.useState('CPU');
  const [ocpRateMeasurementOpen, setOcpRateMeasurementOpen] = React.useState(false);
  const [ocpRateMeasurement, setOcpRateMeasurement] = React.useState('Request (core-hours)');
  const [ocpRateCalculationType, setOcpRateCalculationType] = React.useState<'infrastructure' | 'supplementary'>('supplementary');
  const [ocpRateByTag, setOcpRateByTag] = React.useState(false);
  const [ocpRateTagKey, setOcpRateTagKey] = React.useState('');
  const [ocpRateTagValues, setOcpRateTagValues] = React.useState<Array<{value: string, rate: string, description: string, isDefault: boolean}>>([{value: '', rate: '', description: '', isDefault: false}]);
  const [ocpExpandedRates, setOcpExpandedRates] = React.useState<Set<number>>(new Set());

  // OCP Wizard - Cost calculations state
  const [ocpMarkupDiscount, setOcpMarkupDiscount] = React.useState<'markup' | 'discount'>('markup');
  const [ocpMarkupRate, setOcpMarkupRate] = React.useState('0');

  // OCP Wizard - Cost distribution state
  const [ocpDistributionType, setOcpDistributionType] = React.useState<'cpu' | 'memory'>('cpu');
  const [ocpDistributePlatform, setOcpDistributePlatform] = React.useState(true);
  const [ocpDistributeWorker, setOcpDistributeWorker] = React.useState(true);
  const [ocpDistributeNetwork, setOcpDistributeNetwork] = React.useState(true);
  const [ocpDistributeStorage, setOcpDistributeStorage] = React.useState(true);

  // AWS Wizard - Private offers state
  const [awsShowCreateCommitment, setAwsShowCreateCommitment] = React.useState(false);
  const [awsCommitments, setAwsCommitments] = React.useState<Array<{
    id: number;
    commitment: string;
    rate: string;
    startDate: string;
  }>>([]);
  const [awsNewCommitment, setAwsNewCommitment] = React.useState('0');
  const [awsNewRate, setAwsNewRate] = React.useState('0');
  const [awsNewStartDate, setAwsNewStartDate] = React.useState('');

  // Helper function to get commitment status
  const getCommitmentStatus = (startDate: string): {
    status: 'active' | 'not-started';
    label: string;
    variant: 'green' | 'blue';
    daysInfo: string;
  } => {
    const today = new Date();
    const start = new Date(startDate);
    const daysUntilStart = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (today < start) {
      return {
        status: 'not-started',
        label: 'Not started',
        variant: 'blue',
        daysInfo: `Starts in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}`
      };
    } else {
      const daysSinceStart = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: 'active',
        label: 'Active',
        variant: 'green',
        daysInfo: `Active for ${daysSinceStart} day${daysSinceStart !== 1 ? 's' : ''}`
      };
    }
  };

  // Function to reset wizard state
  const resetWizardState = () => {
    setWizardName('');
    setWizardDescription('');
    setWizardIntegration('');
    setWizardCurrency('USD ($) - United States Dollar');
    setWizardIsDiscount(false);
    setWizardMarkupRate('0');
    setWizardSelectedIntegrations([]);
    setWizardIntegrationSearchValue('');
    
    // Reset OCP-specific state
    setOcpShowCreateRate(false);
    setOcpPriceListRates([]);
    setOcpRateDescription('');
    setOcpRateMetric('CPU');
    setOcpRateMeasurement('Request (core-hours)');
    setOcpRateCalculationType('supplementary');
    setOcpRateByTag(false);
    setOcpRateTagKey('');
    setOcpRateTagValues([{value: '', rate: '', description: '', isDefault: false}]);
    setOcpExpandedRates(new Set());
    setOcpMarkupDiscount('markup');
    setOcpMarkupRate('0');
    setOcpDistributionType('cpu');
    setOcpDistributePlatform(true);
    setOcpDistributeWorker(true);
    setOcpDistributeNetwork(true);
    setOcpDistributeStorage(true);
    
    // Reset AWS-specific state
    setAwsShowCreateCommitment(false);
    setAwsCommitments([]);
    setAwsNewCommitment('0');
    setAwsNewRate('0');
    setAwsNewStartDate('');
  };

  // Get AWS integrations from database
  const awsIntegrations = dataService.getAWSIntegrations();

  // Mock OCP integrations data
  const ocpIntegrations = [
    { id: 'acm-demo-romeo-hub', name: 'acm-demo-romeo-hub', operatorVersion: 'Not available', assignedCostModel: 'OCP' },
    { id: 'democluster46-go', name: 'DemoCluster4.6-Go', operatorVersion: 'Not available', assignedCostModel: 'Go Operator' },
    { id: 'demolab', name: 'demolab', operatorVersion: 'Up to date', assignedCostModel: 'Cost Model' },
    { id: 'dnakabaa-sa', name: 'dnakabaa-sa-scope-source-create-test', operatorVersion: 'Not available', assignedCostModel: 'openshift on prem' },
    { id: 'enablement-demo', name: 'Enablement Demo 202301', operatorVersion: 'Not available', assignedCostModel: 'middle' },
    { id: 'mbu-demo', name: 'MBU Demo Cluster', operatorVersion: 'Not available', assignedCostModel: 'Effective cost demo' },
    { id: 'ocp-onprem01', name: 'OCP-OnPrem01', operatorVersion: 'Up to date', assignedCostModel: 'Monthly Cost Demo' },
    { id: 'openshift-aws', name: 'Openshift on AWS', operatorVersion: 'Up to date', assignedCostModel: '' },
    { id: 'openshift-azure', name: 'Openshift on Azure', operatorVersion: 'Up to date', assignedCostModel: '' },
    { id: 'openshift-gcp', name: 'OpenShift on GCP - Nise Populator', operatorVersion: 'Up to date', assignedCostModel: 'advanced' },
  ];

  // Get cost models from database
  const dbCostModels = dataService.getAllCostModels();
  
  // Count how many integrations use each cost model
  const getCostModelUsage = (modelId: string): number => {
    const clusters = dataService.getAllClusters();
    const awsAccounts = dataService.getAWSAccounts();
    const gcpAccounts = dataService.getGCPAccounts();
    const azureAccounts = dataService.getAzureAccounts();

    let count = 0;
    count += clusters.filter(c => c.costModelId === modelId).length;
    count += awsAccounts.filter(a => a.costModelId === modelId).length;
    count += gcpAccounts.filter(a => a.costModelId === modelId).length;
    count += azureAccounts.filter(a => a.costModelId === modelId).length;

    return count;
  };

  // Transform database cost models to UI format
  const costModels: CostModel[] = dbCostModels.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description,
    integration: model.sourceType,
    assignedIntegrations: getCostModelUsage(model.id),
    lastUpdated: model.lastModified,
  }));

  const totalItems = costModels.length;

  // Get tags from database
  const dbTags = dataService.getAllTags();
  
  // Transform database tags to UI format - expand each tag with its values for pagination
  const tags: TagItem[] = dbTags.flatMap(tag => 
    tag.values.map((value, index) => ({
      id: `${tag.id}-${index}`,
      name: `${tag.key}:${value}`,
      status: (tag.enabled ? 'enabled' : 'disabled') as 'enabled' | 'disabled',
      integration: tag.integrations.join(', '),
    }))
  );
  const totalTags = tags.length;

  // Get cost categories from database
  const dbCategories = dataService.getAllCostCategories();
  
  // Transform database categories to UI format
  const categories: CategoryItem[] = dbCategories.map(category => ({
    id: category.id,
    name: category.name,
    status: (category.enabled ? 'enabled' : 'disabled') as 'enabled' | 'disabled',
  }));
  const totalCategories = categories.length;

  // Get platform projects from database
  const dbPlatformProjects = dataService.getAllPlatformProjects();
  const allClusters = dataService.getAllClusters();
  
  // Transform database platform projects to UI format
  // Show all clusters for platform projects (they apply to all)
  const projects: PlatformProject[] = dbPlatformProjects.map(project => ({
    id: project.id,
    name: project.name,
    isDefault: project.isPlatformOverhead,
    group: project.type === 'platform' ? 'Platform' : 'Unallocated',
    clusters: allClusters.map(c => c.displayName), // Platform projects apply to all clusters
  }));
  const totalProjects = projects.length;

  // Tag mappings data
  interface TagMapping {
    id: string;
    parentTag: string;
    integration: string;
    childTags: Array<{ name: string; integration: string }>;
  }

  // Get tag mappings from database
  const dbTagMappings = dataService.getAllTagMappings();
  
  // Transform database tag mappings to UI format
  const tagMappings: TagMapping[] = dbTagMappings.map(mapping => ({
    id: mapping.id,
    parentTag: mapping.parentKey,
    integration: 'Multi-cloud', // Mappings apply across providers
    childTags: mapping.childKeys.map(child => ({
      name: child.key,
      integration: child.source,
    })),
  }));
  const totalMapTags = tagMappings.length;

  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTab(tabIndex);
  };

  const handleTagsSubTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setTagsSubTab(tabIndex);
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortIndex,
      direction: sortDirection,
    },
    onSort: (_event, index, direction) => {
      setSortIndex(index);
      setSortDirection(direction);
    },
    columnIndex,
  });

  const getTagsSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: tagsSortIndex,
      direction: tagsSortDirection,
    },
    onSort: (_event, index, direction) => {
      setTagsSortIndex(index);
      setTagsSortDirection(direction);
    },
    columnIndex,
  });

  const getCategoriesSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: categoriesSortIndex,
      direction: categoriesSortDirection,
    },
    onSort: (_event, index, direction) => {
      setCategoriesSortIndex(index);
      setCategoriesSortDirection(direction);
    },
    columnIndex,
  });

  const getProjectsSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: projectsSortIndex,
      direction: projectsSortDirection,
    },
    onSort: (_event, index, direction) => {
      setProjectsSortIndex(index);
      setProjectsSortDirection(direction);
    },
    columnIndex,
  });

  const getMapTagsSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: mapTagsSortIndex,
      direction: mapTagsSortDirection,
    },
    onSort: (_event, index, direction) => {
      setMapTagsSortIndex(index);
      setMapTagsSortDirection(direction);
    },
    columnIndex,
  });

  const toggleMapTagExpansion = (tagId: string) => {
    setExpandedMapTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="template-page-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem to="/cost-management-integrated/overview">Cost Management</BreadcrumbItem>
          <BreadcrumbItem isActive>Settings</BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Heading Section */}
      <div className="template-page-heading">
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
          Settings
        </Title>
        <Content>
          <p>Configure cost management settings, integrations, cost models, and tag mappings.</p>
        </Content>
        <div style={{ marginTop: '24px' }}>
          <Tabs activeKey={activeTab} onSelect={handleTabClick}>
            <Tab eventKey={0} title="Cost models" id="cost-models-tab" />
            <Tab eventKey={1} title="Currency and calculations" id="currency-tab" />
            <Tab eventKey={2} title="Tags and labels" id="tags-tab" />
            <Tab eventKey={3} title="Cost categories" id="categories-tab" />
            <Tab eventKey={4} title="Platform projects" id="projects-tab" />
          </Tabs>
        </div>
      </div>

      {/* Content Section */}
      <div className="template-page-content">
        <TabContent eventKey={0} id="cost-models-tab-content" activeKey={activeTab} hidden={activeTab !== 0}>
          <Card>
            <CardBody>
              <p>
                Cost models can help you analyze and predict future costs. Associate a price to metrics provided by your integrations to calculate your charges for resource usage.{' '}
                <a href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/using_cost_models" rel="noreferrer" target="_blank">
                  Learn more
                </a>
              </p>

              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                {/* Toolbar */}
                <Toolbar id="cost-models-toolbar">
                  <ToolbarContent>
                    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                      <ToolbarGroup variant="filter-group">
                        <ToolbarItem>
                          <Select
                            isOpen={categoryOpen}
                            onSelect={() => setCategoryOpen(false)}
                            onOpenChange={(isOpen) => setCategoryOpen(isOpen)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setCategoryOpen(!categoryOpen)}
                                isExpanded={categoryOpen}
                                icon={<FilterIcon />}
                              >
                                Name
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="Name">Name</SelectOption>
                              <SelectOption value="Description">Description</SelectOption>
                            </SelectList>
                          </Select>
                        </ToolbarItem>
                        <ToolbarItem>
                          <InputGroup id="cost-model-filter-input">
                            <InputGroupItem isFill>
                              <TextInputGroup>
                                <TextInputGroupMain
                                  icon={<SearchIcon />}
                                  value={searchValue}
                                  onChange={(_event, value) => setSearchValue(value)}
                                  placeholder="Filter by name"
                                  aria-label="Filter by name"
                                />
                                {searchValue && (
                                  <TextInputGroupUtilities>
                                    <Button variant="plain" onClick={() => setSearchValue('')} aria-label="Clear filter">
                                      <MinusCircleIcon />
                                    </Button>
                                  </TextInputGroupUtilities>
                                )}
                              </TextInputGroup>
                            </InputGroupItem>
                            <InputGroupItem>
                              <Button variant="control" aria-label="Search" type="submit">
                                <ArrowRightIcon />
                              </Button>
                            </InputGroupItem>
                          </InputGroup>
                        </ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarToggleGroup>

                    <ToolbarGroup>
                      <ToolbarItem>
                        <Button variant="primary" onClick={() => setIsWizardOpen(true)}>Create cost model</Button>
                      </ToolbarItem>
                    </ToolbarGroup>

                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={totalItems}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_evt, newPage) => setPage(newPage)}
                        widgetId="options-menu-top-pagination"
                        onPerPageSelect={(_evt, newPerPage, newPage) => {
                          setPerPage(newPerPage);
                          setPage(newPage);
                        }}
                        isCompact
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                {/* Table */}
                <Table aria-label="Cost models table" variant="compact" gridBreakPoint="grid-2xl">
                  <Thead>
                    <Tr>
                      <Th sort={getSortParams(0)}>Name</Th>
                      <Th>Description</Th>
                      <Th sort={getSortParams(2)}>Integration</Th>
                      <Th>Assigned integrations</Th>
                      <Th sort={getSortParams(4)}>Last updated</Th>
                      <Th />
                      <Th aria-label="Cost model actions" />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {costModels.map((model) => (
                      <Tr key={model.id}>
                        <Td dataLabel="Name">
                          <Link to={`/cost-management-integrated/settings/cost-model/${model.id}`}>
                            {model.name}
                          </Link>
                        </Td>
                        <Td dataLabel="Description">{model.description}</Td>
                        <Td dataLabel="Integration">{model.integration}</Td>
                        <Td dataLabel="Assigned integrations">{model.assignedIntegrations}</Td>
                        <Td dataLabel="Last updated">{model.lastUpdated}</Td>
                        <Td isActionCell>
                          <Button variant="plain" aria-label="Delete" size="sm">
                            <MinusCircleIcon />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Bottom Pagination */}
                <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
                  <Pagination
                    itemCount={totalItems}
                    perPage={perPage}
                    page={page}
                    onSetPage={(_evt, newPage) => setPage(newPage)}
                    widgetId="options-menu-bottom-pagination"
                    onPerPageSelect={(_evt, newPerPage, newPage) => {
                      setPerPage(newPerPage);
                      setPage(newPage);
                    }}
                    variant={PaginationVariant.bottom}
                    isCompact={false}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </TabContent>

        <TabContent eventKey={1} id="currency-tab-content" activeKey={activeTab} hidden={activeTab !== 1}>
          <Card>
            <CardBody>
              <Title headingLevel="h2" size="md" style={{ paddingBottom: 'var(--pf-t--global--spacer--sm)' }}>
                Currency
              </Title>
              <p>Select the preferred currency view for your organization</p>

              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)', width: 'fit-content' }}>
                <Flex alignItems={{ default: 'alignItemsCenter' }}>
                  <Select
                    isOpen={currencyOpen}
                    onSelect={() => setCurrencyOpen(false)}
                    onOpenChange={(isOpen) => setCurrencyOpen(isOpen)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setCurrencyOpen(!currencyOpen)}
                        isExpanded={currencyOpen}
                        style={{ width: '100%' }}
                      >
                        USD ($) - United States Dollar
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="USD">USD ($) - United States Dollar</SelectOption>
                    </SelectList>
                  </Select>
                </Flex>
              </div>

              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                <Title headingLevel="h2" size="md" style={{ paddingBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  Show cost as (Amazon Web Services only)
                </Title>
                <p>
                  Select the preferred way of calculating upfront costs of savings plans or subscription fees. This feature is available for Amazon Web Services cost only.
                </p>

                <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)', width: 'fit-content' }}>
                  <Flex alignItems={{ default: 'alignItemsCenter' }}>
                    <Select
                      isOpen={showCostAsOpen}
                      onSelect={() => setShowCostAsOpen(false)}
                      onOpenChange={(isOpen) => setShowCostAsOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setShowCostAsOpen(!showCostAsOpen)}
                          isExpanded={showCostAsOpen}
                          style={{ width: '100%' }}
                        >
                          Amortized
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="amortized">Amortized</SelectOption>
                        <SelectOption value="unblended">Unblended</SelectOption>
                      </SelectList>
                    </Select>
                  </Flex>
                </div>
              </div>

              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                <Title headingLevel="h2" size="md" style={{ paddingBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  Period type configuration
                </Title>
                <p>
                  Configure how cross-over costs are calculated between calendar months and billing periods for cloud providers (AWS, Google Cloud, Azure).
                </p>

                <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)', width: 'fit-content' }}>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
                    {/* Default Period Type Selector */}
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem style={{ minWidth: '150px' }}>
                          <strong>Default period type</strong>
                        </FlexItem>
                        <FlexItem>
                          <Select
                            isOpen={perspectiveOpen}
                            onSelect={(_event, value) => {
                              setPerspective(value as 'calendar' | 'billing');
                              setPerspectiveOpen(false);
                            }}
                            onOpenChange={(isOpen) => setPerspectiveOpen(isOpen)}
                            selected={perspective}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setPerspectiveOpen(!perspectiveOpen)}
                                isExpanded={perspectiveOpen}
                                style={{ width: '250px' }}
                              >
                                {perspective === 'calendar' ? 'Calendar' : 'Billing'}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="calendar" description="Standard monthly periods (1st to last day of month)">
                                Calendar
                              </SelectOption>
                              <SelectOption value="billing" description="Includes buffer zones to match cloud provider invoices">
                                Billing
                              </SelectOption>
                            </SelectList>
                          </Select>
                        </FlexItem>
                      </Flex>
                    </FlexItem>

                  </Flex>
                </div>
              </div>

              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                <Title headingLevel="h2" size="md" style={{ paddingBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  Billing cross over period
                </Title>
                <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                  <FormGroup fieldId="buffer-mode">
                    <Stack hasGutter>
                      <StackItem>
                        <Radio
                          id="buffer-default"
                          name="buffer-mode"
                          label="Default"
                          description="Use recommended 3-day buffer period for all cloud providers (3 days before month end, 3 days after month start)"
                          isChecked={bufferMode === 'default'}
                          onChange={() => setBufferMode('default')}
                        />
                      </StackItem>
                      <StackItem>
                        <Radio
                          id="buffer-custom"
                          name="buffer-mode"
                          label="Custom"
                          description="Configure custom buffer period per cloud provider"
                          isChecked={bufferMode === 'custom'}
                          onChange={() => setBufferMode('custom')}
                        />
                      </StackItem>
                    </Stack>
                  </FormGroup>

                  {bufferMode === 'custom' && (
                    <div style={{ marginTop: 'var(--pf-t--global--spacer--md)', marginLeft: 'var(--pf-t--global--spacer--lg)' }}>
                      <Stack hasGutter>
                        {/* Option 1: Apply same to all */}
                        <StackItem>
                          <Radio
                            id="custom-all"
                            name="custom-mode"
                            label="Apply the same to all"
                            description="Use the same custom buffer period for all cloud providers"
                            isChecked={customMode === 'all'}
                            onChange={() => setCustomMode('all')}
                          />
                          {customMode === 'all' && (
                          <div style={{ marginLeft: 'var(--pf-t--global--spacer--lg)' }}>
                            <Stack hasGutter>
                              <StackItem>
                                <FormGroup label="Days before month end" fieldId="all-buffer-before">
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    <FlexItem>
                                      <TextInput
                                        type="number"
                                        id="all-buffer-before"
                                        value={allProvidersBefore}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setAllProvidersBefore(value);
                                          } else if (value === '') {
                                            setAllProvidersBefore('0');
                                          }
                                        }}
                                        style={{ width: '100px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FlexItem>
                                    <FlexItem>
                                      <span style={{ fontSize: 'var(--pf-t--global--font--size--body--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                        (0-7 days)
                                      </span>
                                    </FlexItem>
                                  </Flex>
                                </FormGroup>
                              </StackItem>

                              <StackItem>
                                <FormGroup label="Days after month start" fieldId="all-buffer-after">
                                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                    <FlexItem>
                                      <TextInput
                                        type="number"
                                        id="all-buffer-after"
                                        value={allProvidersAfter}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setAllProvidersAfter(value);
                                          } else if (value === '') {
                                            setAllProvidersAfter('0');
                                          }
                                        }}
                                        style={{ width: '100px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FlexItem>
                                    <FlexItem>
                                      <span style={{ fontSize: 'var(--pf-t--global--font--size--body--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                        (0-7 days)
                                      </span>
                                    </FlexItem>
                                  </Flex>
                                </FormGroup>
                              </StackItem>
                            </Stack>
                          </div>
                          )}
                        </StackItem>

                        {/* Option 2: Customize per provider */}
                        <StackItem>
                          <Radio
                            id="custom-per-provider"
                            name="custom-mode"
                            label="Customize per cloud provider"
                            description="Configure different buffer periods for each cloud provider"
                            isChecked={customMode === 'per-provider'}
                            onChange={() => setCustomMode('per-provider')}
                          />
                          {customMode === 'per-provider' && (
                          <div style={{ marginLeft: 'var(--pf-t--global--spacer--lg)' }}>
                            <Stack hasGutter>
                              {/* Amazon Web Services */}
                              <StackItem>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                                  <FlexItem style={{ minWidth: '200px' }}>
                                    <strong>Amazon Web Services</strong>
                                  </FlexItem>
                                  <FlexItem>
                                    <FormGroup label="Days before" fieldId="aws-buffer-before" style={{ marginBottom: 0 }}>
                                      <TextInput
                                        type="number"
                                        id="aws-buffer-before"
                                        value={providerBuffers.aws.before}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              aws: { ...providerBuffers.aws, before: value }
                                            });
                                          } else if (value === '') {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              aws: { ...providerBuffers.aws, before: '0' }
                                            });
                                          }
                                        }}
                                        style={{ width: '80px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FormGroup>
                                  </FlexItem>
                                  <FlexItem>
                                    <FormGroup label="Days after" fieldId="aws-buffer-after" style={{ marginBottom: 0 }}>
                                      <TextInput
                                        type="number"
                                        id="aws-buffer-after"
                                        value={providerBuffers.aws.after}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              aws: { ...providerBuffers.aws, after: value }
                                            });
                                          } else if (value === '') {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              aws: { ...providerBuffers.aws, after: '0' }
                                            });
                                          }
                                        }}
                                        style={{ width: '80px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FormGroup>
                                  </FlexItem>
                                </Flex>
                              </StackItem>

                              {/* Google Cloud */}
                              <StackItem>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                                  <FlexItem style={{ minWidth: '200px' }}>
                                    <strong>Google Cloud</strong>
                                  </FlexItem>
                                  <FlexItem>
                                    <FormGroup label="Days before" fieldId="gcp-buffer-before" style={{ marginBottom: 0 }}>
                                      <TextInput
                                        type="number"
                                        id="gcp-buffer-before"
                                        value={providerBuffers.gcp.before}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              gcp: { ...providerBuffers.gcp, before: value }
                                            });
                                          } else if (value === '') {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              gcp: { ...providerBuffers.gcp, before: '0' }
                                            });
                                          }
                                        }}
                                        style={{ width: '80px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FormGroup>
                                  </FlexItem>
                                  <FlexItem>
                                    <FormGroup label="Days after" fieldId="gcp-buffer-after" style={{ marginBottom: 0 }}>
                                      <TextInput
                                        type="number"
                                        id="gcp-buffer-after"
                                        value={providerBuffers.gcp.after}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              gcp: { ...providerBuffers.gcp, after: value }
                                            });
                                          } else if (value === '') {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              gcp: { ...providerBuffers.gcp, after: '0' }
                                            });
                                          }
                                        }}
                                        style={{ width: '80px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FormGroup>
                                  </FlexItem>
                                </Flex>
                              </StackItem>

                              {/* Microsoft Azure */}
                              <StackItem>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                                  <FlexItem style={{ minWidth: '200px' }}>
                                    <strong>Microsoft Azure</strong>
                                  </FlexItem>
                                  <FlexItem>
                                    <FormGroup label="Days before" fieldId="azure-buffer-before" style={{ marginBottom: 0 }}>
                                      <TextInput
                                        type="number"
                                        id="azure-buffer-before"
                                        value={providerBuffers.azure.before}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              azure: { ...providerBuffers.azure, before: value }
                                            });
                                          } else if (value === '') {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              azure: { ...providerBuffers.azure, before: '0' }
                                            });
                                          }
                                        }}
                                        style={{ width: '80px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FormGroup>
                                  </FlexItem>
                                  <FlexItem>
                                    <FormGroup label="Days after" fieldId="azure-buffer-after" style={{ marginBottom: 0 }}>
                                      <TextInput
                                        type="number"
                                        id="azure-buffer-after"
                                        value={providerBuffers.azure.after}
                                        onChange={(_event, value) => {
                                          const numValue = parseInt(value, 10);
                                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 7) {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              azure: { ...providerBuffers.azure, after: value }
                                            });
                                          } else if (value === '') {
                                            setProviderBuffers({
                                              ...providerBuffers,
                                              azure: { ...providerBuffers.azure, after: '0' }
                                            });
                                          }
                                        }}
                                        style={{ width: '80px' }}
                                        min={0}
                                        max={7}
                                      />
                                    </FormGroup>
                                  </FlexItem>
                                </Flex>
                              </StackItem>
                            </Stack>
                          </div>
                          )}
                        </StackItem>
                      </Stack>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </TabContent>

        <TabContent eventKey={2} id="tags-tab-content" activeKey={activeTab} hidden={activeTab !== 2}>
          <Card>
            <CardTitle>
              <Tabs activeKey={tagsSubTab} onSelect={handleTagsSubTabClick}>
                <Tab eventKey={0} title="Enable tags and labels" id="enable-tags-tab" />
                <Tab eventKey={1} title="Map tags and labels" id="map-tags-tab" />
              </Tabs>
            </CardTitle>
            <CardBody>
              <TabContent eventKey={0} id="enable-tags-content" activeKey={tagsSubTab} hidden={tagsSubTab !== 0}>
                <p>
                  Enable your tags and labels to be used as tag keys for report grouping and filtering. Your account is limited to 200 active tags at a time. Changes will be reflected within 24 hours.{' '}
                  <a href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/managing_cost_data_using_tagging/assembly-configuring-tags-and-labels-in-cost-management" rel="noreferrer" target="_blank">
                    Learn more
                  </a>
                </p>

                <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                  {/* Toolbar */}
                  <Toolbar id="tags-toolbar">
                    <ToolbarContent>
                      <ToolbarItem>
                        <Checkbox
                          id="tags-bulk-select"
                          aria-label="Select all items"
                          isChecked={selectAllTags}
                          onChange={(_event, checked) => setSelectAllTags(checked)}
                        />
                      </ToolbarItem>

                      <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                        <ToolbarGroup variant="filter-group">
                          <ToolbarItem>
                            <Select
                              isOpen={tagsCategoryOpen}
                              onSelect={() => setTagsCategoryOpen(false)}
                              onOpenChange={(isOpen) => setTagsCategoryOpen(isOpen)}
                              toggle={(toggleRef) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setTagsCategoryOpen(!tagsCategoryOpen)}
                                  isExpanded={tagsCategoryOpen}
                                  icon={<FilterIcon />}
                                >
                                  Name
                                </MenuToggle>
                              )}
                            >
                              <SelectList>
                                <SelectOption value="Name">Name</SelectOption>
                              </SelectList>
                            </Select>
                          </ToolbarItem>
                          <ToolbarItem>
                            <InputGroup id="tags-category-input-key">
                              <InputGroupItem isFill>
                                <TextInputGroup>
                                  <TextInputGroupMain
                                    icon={<SearchIcon />}
                                    value={tagsSearchValue}
                                    onChange={(_event, value) => setTagsSearchValue(value)}
                                    placeholder="Filter by name"
                                    aria-label="Input for name"
                                  />
                                </TextInputGroup>
                              </InputGroupItem>
                              <InputGroupItem>
                                <Button variant="control" aria-label="Search" type="submit">
                                  <ArrowRightIcon />
                                </Button>
                              </InputGroupItem>
                            </InputGroup>
                          </ToolbarItem>
                        </ToolbarGroup>
                      </ToolbarToggleGroup>

                      <ToolbarGroup>
                        <ToolbarItem>
                          <Button variant="primary" isDisabled>Enable tags</Button>
                        </ToolbarItem>
                        <ToolbarItem style={{ marginLeft: 'var(--pf-t--global--spacer--md)' }}>
                          <Button variant="secondary" isDisabled>Disable tags</Button>
                        </ToolbarItem>
                      </ToolbarGroup>

                      <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={totalTags}
                          perPage={tagsPerPage}
                          page={tagsPage}
                          onSetPage={(_evt, newPage) => setTagsPage(newPage)}
                          widgetId="tags-pagination-top"
                          onPerPageSelect={(_evt, newPerPage, newPage) => {
                            setTagsPerPage(newPerPage);
                            setTagsPage(newPage);
                          }}
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>

                  {/* Table */}
                  <Table aria-label="Details table" variant="compact" gridBreakPoint="grid-2xl">
                    <Thead>
                      <Tr>
                        <Th />
                        <Th sort={getTagsSortParams(1)}>Name</Th>
                        <Th sort={getTagsSortParams(2)}>Status</Th>
                        <Th sort={getTagsSortParams(3)}>Integration</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tags.map((tag, index) => (
                        <Tr key={tag.id}>
                          <Td
                            select={{
                              rowIndex: index,
                              onSelect: () => {},
                              isSelected: false,
                            }}
                          />
                          <Td dataLabel="Name" modifier="nowrap">{tag.name}</Td>
                          <Td dataLabel="Status" modifier="nowrap">
                            <Label color={tag.status === 'enabled' ? 'green' : undefined}>
                              {tag.status === 'enabled' ? 'Enabled' : 'Disabled'}
                            </Label>
                          </Td>
                          <Td dataLabel="Integration" modifier="nowrap">{tag.integration}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  {/* Bottom Pagination */}
                  <div style={{ paddingBottom: '1rem', paddingTop: '0.5rem' }}>
                    <Pagination
                      itemCount={totalTags}
                      perPage={tagsPerPage}
                      page={tagsPage}
                      onSetPage={(_evt, newPage) => setTagsPage(newPage)}
                      widgetId="tags-pagination-bottom"
                      onPerPageSelect={(_evt, newPerPage, newPage) => {
                        setTagsPerPage(newPerPage);
                        setTagsPage(newPage);
                      }}
                      variant={PaginationVariant.bottom}
                      isCompact={false}
                    />
                  </div>
                </div>
              </TabContent>

              <TabContent eventKey={1} id="map-tags-content" activeKey={tagsSubTab} hidden={tagsSubTab !== 1}>
                <div>
                  Combine multiple tags across your cloud integrations to group and filter similar tags with one tag key. <b>You must enable tags to use tag mapping.</b> Changes will be reflected within 24 hours.{' '}
                  <a href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/managing_cost_data_using_tagging" rel="noreferrer" target="_blank">
                    Learn more
                  </a>
                </div>

                <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                  {/* Toolbar */}
                  <Toolbar id="map-tags-toolbar">
                    <ToolbarContent>
                      <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                        <ToolbarGroup variant="filter-group">
                          <ToolbarItem>
                            <Select
                              isOpen={mapTagsCategoryOpen}
                              onSelect={() => setMapTagsCategoryOpen(false)}
                              onOpenChange={(isOpen) => setMapTagsCategoryOpen(isOpen)}
                              toggle={(toggleRef) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => setMapTagsCategoryOpen(!mapTagsCategoryOpen)}
                                  isExpanded={mapTagsCategoryOpen}
                                  icon={<FilterIcon />}
                                >
                                  Parent tag Key
                                </MenuToggle>
                              )}
                            >
                              <SelectList>
                                <SelectOption value="Parent tag Key">Parent tag Key</SelectOption>
                              </SelectList>
                            </Select>
                          </ToolbarItem>
                          <ToolbarItem>
                            <InputGroup id="category-input-parent">
                              <InputGroupItem isFill>
                                <TextInputGroup>
                                  <TextInputGroupMain
                                    icon={<SearchIcon />}
                                    value={mapTagsSearchValue}
                                    onChange={(_event, value) => setMapTagsSearchValue(value)}
                                    placeholder="Filter by parent tag key"
                                    aria-label="Input for parent tag key"
                                  />
                                </TextInputGroup>
                              </InputGroupItem>
                              <InputGroupItem>
                                <Button variant="control" aria-label="Search" type="submit">
                                  <ArrowRightIcon />
                                </Button>
                              </InputGroupItem>
                            </InputGroup>
                          </ToolbarItem>
                        </ToolbarGroup>
                      </ToolbarToggleGroup>

                      <ToolbarGroup>
                        <ToolbarItem>
                          <Button variant="primary">Create tag mapping</Button>
                        </ToolbarItem>
                      </ToolbarGroup>

                      <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                        <Pagination
                          itemCount={totalMapTags}
                          perPage={mapTagsPerPage}
                          page={mapTagsPage}
                          onSetPage={(_evt, newPage) => setMapTagsPage(newPage)}
                          widgetId="pagination-top-pagination"
                          onPerPageSelect={(_evt, newPerPage, newPage) => {
                            setMapTagsPerPage(newPerPage);
                            setMapTagsPage(newPage);
                          }}
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>

                  {/* Table */}
                  <Table aria-label="Details table" variant="compact" gridBreakPoint="grid-2xl" className="tableOverride">
                    <Thead>
                      <Tr>
                        <Th />
                        <Th sort={getMapTagsSortParams(1)}>Tag keys</Th>
                        <Th sort={getMapTagsSortParams(2)}>Integration</Th>
                        <Th />
                      </Tr>
                    </Thead>
                    {tagMappings.map((mapping, index) => {
                      const isExpanded = expandedMapTags.has(mapping.id);
                      return (
                        <Tbody key={mapping.id} isExpanded={isExpanded}>
                          <Tr>
                            <Td
                              expand={{
                                rowIndex: index,
                                isExpanded,
                                onToggle: () => toggleMapTagExpansion(mapping.id),
                              }}
                            />
                            <Td dataLabel="Tag keys" modifier="nowrap">
                              {mapping.parentTag}
                            </Td>
                            <Td dataLabel="Integration" modifier="nowrap">
                              {mapping.integration}
                            </Td>
                            <Td isActionCell>
                              <MenuToggle variant="plain" aria-label="More options">
                                <EllipsisVIcon />
                              </MenuToggle>
                            </Td>
                          </Tr>
                          {mapping.childTags.map((childTag, childIndex) => (
                            <Tr key={`${mapping.id}-child-${childIndex}`} isExpanded={isExpanded}>
                              <Td />
                              <Td dataLabel="Tag keys" modifier="nowrap" style={{ paddingLeft: '1rem' }}>
                                {childTag.name}
                              </Td>
                              <Td dataLabel="Integration" modifier="nowrap" style={{ paddingLeft: '1rem' }}>
                                {childTag.integration}
                              </Td>
                              <Td isActionCell style={{ paddingRight: '3rem' }}>
                                <Button variant="plain" aria-label="Remove child tag" size="sm">
                                  <MinusCircleIcon />
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      );
                    })}
                  </Table>

                  {/* Bottom Pagination */}
                  <div style={{ paddingBottom: '1rem', paddingTop: '0.5rem' }}>
                    <Pagination
                      itemCount={totalMapTags}
                      perPage={mapTagsPerPage}
                      page={mapTagsPage}
                      onSetPage={(_evt, newPage) => setMapTagsPage(newPage)}
                      widgetId="pagination-bottom-bottom-pagination"
                      onPerPageSelect={(_evt, newPerPage, newPage) => {
                        setMapTagsPerPage(newPerPage);
                        setMapTagsPage(newPage);
                      }}
                      variant={PaginationVariant.bottom}
                      isCompact={false}
                    />
                  </div>
                </div>
              </TabContent>
            </CardBody>
          </Card>
        </TabContent>

        <TabContent eventKey={3} id="categories-tab-content" activeKey={activeTab} hidden={activeTab !== 3}>
          <Card>
            <CardBody>
              <p>
                Enable your AWS cost categories to be used for report grouping and filtering. Changes will be reflected within 24 hours.{' '}
                <a href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/managing_cost_data_using_tagging/assembly-configuring-tags-and-labels-in-cost-management#configuring-categories_configuring-tags-int" rel="noreferrer" target="_blank">
                  Learn more
                </a>
              </p>

              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                {/* Toolbar */}
                <Toolbar id="categories-toolbar">
                  <ToolbarContent>
                    <ToolbarItem>
                      <Checkbox
                        id="categories-bulk-select"
                        aria-label="Select all items"
                        isChecked={selectAllCategories}
                        onChange={(_event, checked) => setSelectAllCategories(checked)}
                      />
                    </ToolbarItem>

                    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                      <ToolbarGroup variant="filter-group">
                        <ToolbarItem>
                          <Select
                            isOpen={categoriesCategoryOpen}
                            onSelect={() => setCategoriesCategoryOpen(false)}
                            onOpenChange={(isOpen) => setCategoriesCategoryOpen(isOpen)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setCategoriesCategoryOpen(!categoriesCategoryOpen)}
                                isExpanded={categoriesCategoryOpen}
                                icon={<FilterIcon />}
                              >
                                Name
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="Name">Name</SelectOption>
                            </SelectList>
                          </Select>
                        </ToolbarItem>
                        <ToolbarItem>
                          <InputGroup id="categories-input-key">
                            <InputGroupItem isFill>
                              <TextInputGroup>
                                <TextInputGroupMain
                                  icon={<SearchIcon />}
                                  value={categoriesSearchValue}
                                  onChange={(_event, value) => setCategoriesSearchValue(value)}
                                  placeholder="Filter by name"
                                  aria-label="Input for name"
                                />
                              </TextInputGroup>
                            </InputGroupItem>
                            <InputGroupItem>
                              <Button variant="control" aria-label="Search" type="submit">
                                <ArrowRightIcon />
                              </Button>
                            </InputGroupItem>
                          </InputGroup>
                        </ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarToggleGroup>

                    <ToolbarGroup>
                      <ToolbarItem>
                        <Button variant="primary" isDisabled>Enable categories</Button>
                      </ToolbarItem>
                      <ToolbarItem style={{ marginLeft: 'var(--pf-t--global--spacer--md)' }}>
                        <Button variant="secondary" isDisabled>Disable categories</Button>
                      </ToolbarItem>
                    </ToolbarGroup>

                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={totalCategories}
                        perPage={categoriesPerPage}
                        page={categoriesPage}
                        onSetPage={(_evt, newPage) => setCategoriesPage(newPage)}
                        widgetId="categories-pagination-top"
                        onPerPageSelect={(_evt, newPerPage, newPage) => {
                          setCategoriesPerPage(newPerPage);
                          setCategoriesPage(newPage);
                        }}
                        isCompact
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                {/* Table */}
                <Table aria-label="Details table" variant="compact" gridBreakPoint="grid-2xl">
                  <Thead>
                    <Tr>
                      <Th />
                      <Th sort={getCategoriesSortParams(1)}>Name</Th>
                      <Th sort={getCategoriesSortParams(2)}>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categories.map((category, index) => (
                      <Tr key={category.id}>
                        <Td
                          select={{
                            rowIndex: index,
                            onSelect: () => {},
                            isSelected: false,
                          }}
                        />
                        <Td dataLabel="Name" modifier="nowrap">{category.name}</Td>
                        <Td dataLabel="Status" modifier="nowrap">
                          <Label color={category.status === 'enabled' ? 'green' : undefined}>
                            {category.status === 'enabled' ? 'Enabled' : 'Disabled'}
                          </Label>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Bottom Pagination */}
                <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
                  <Pagination
                    itemCount={totalCategories}
                    perPage={categoriesPerPage}
                    page={categoriesPage}
                    onSetPage={(_evt, newPage) => setCategoriesPage(newPage)}
                    widgetId="categories-pagination-bottom"
                    onPerPageSelect={(_evt, newPerPage, newPage) => {
                      setCategoriesPerPage(newPerPage);
                      setCategoriesPage(newPage);
                    }}
                    variant={PaginationVariant.bottom}
                    isCompact={false}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </TabContent>

        <TabContent eventKey={4} id="projects-tab-content" activeKey={activeTab} hidden={activeTab !== 4}>
          <Card>
            <CardBody>
              <p>
                Associate additional projects with OpenShift Platform project costs to charge for utilization of resources. Changes will be reflected in this month's cost calculations within 24 hrs.{' '}
                <a href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-using-cost-models#adding-openshift-projects" rel="noreferrer" target="_blank">
                  Learn more
                </a>
              </p>

              <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                {/* Toolbar */}
                <Toolbar id="projects-toolbar">
                  <ToolbarContent>
                    <ToolbarItem>
                      <Checkbox
                        id="projects-bulk-select"
                        aria-label="Select all items"
                        isChecked={selectAllProjects}
                        onChange={(_event, checked) => setSelectAllProjects(checked)}
                      />
                    </ToolbarItem>

                    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                      <ToolbarGroup variant="filter-group">
                        <ToolbarItem>
                          <Select
                            isOpen={projectsCategoryOpen}
                            onSelect={() => setProjectsCategoryOpen(false)}
                            onOpenChange={(isOpen) => setProjectsCategoryOpen(isOpen)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setProjectsCategoryOpen(!projectsCategoryOpen)}
                                isExpanded={projectsCategoryOpen}
                                icon={<FilterIcon />}
                              >
                                Name
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              <SelectOption value="Name">Name</SelectOption>
                            </SelectList>
                          </Select>
                        </ToolbarItem>
                        <ToolbarItem>
                          <TextInputGroup>
                            <TextInputGroupMain
                              icon={<SearchIcon />}
                              value={projectsSearchValue}
                              onChange={(_event, value) => setProjectsSearchValue(value)}
                              placeholder="Filter by name"
                              aria-label="Input for name"
                            />
                          </TextInputGroup>
                        </ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarToggleGroup>

                    <ToolbarGroup>
                      <ToolbarItem>
                        <Button variant="primary" isDisabled>Add projects</Button>
                      </ToolbarItem>
                      <ToolbarItem style={{ marginLeft: 'var(--pf-t--global--spacer--md)' }}>
                        <Button variant="secondary" isDisabled>Remove projects</Button>
                      </ToolbarItem>
                    </ToolbarGroup>

                    <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                      <Pagination
                        itemCount={totalProjects}
                        perPage={projectsPerPage}
                        page={projectsPage}
                        onSetPage={(_evt, newPage) => setProjectsPage(newPage)}
                        widgetId="projects-pagination-top"
                        onPerPageSelect={(_evt, newPerPage, newPage) => {
                          setProjectsPerPage(newPerPage);
                          setProjectsPage(newPage);
                        }}
                        isCompact
                      />
                    </ToolbarItem>
                  </ToolbarContent>
                </Toolbar>

                {/* Table */}
                <Table aria-label="Details table" variant="compact" gridBreakPoint="grid-2xl">
                  <Thead>
                    <Tr>
                      <Th />
                      <Th sort={getProjectsSortParams(1)}>Name</Th>
                      <Th />
                      <Th sort={getProjectsSortParams(3)}>Group</Th>
                      <Th>Clusters</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {projects.map((project, index) => (
                      <Tr key={project.id}>
                        <Td
                          select={{
                            rowIndex: index,
                            onSelect: () => {},
                            isSelected: false,
                            isDisabled: project.isDefault,
                          }}
                        />
                        <Td dataLabel="Name" modifier="nowrap">{project.name}</Td>
                        <Td modifier="nowrap">
                          {project.isDefault && (
                            <Label color="green">Default</Label>
                          )}
                        </Td>
                        <Td dataLabel="Group" modifier="nowrap">
                          <Label color="green">Platform</Label>
                        </Td>
                        <Td dataLabel="Clusters" modifier="nowrap">
                          <div style={{ marginRight: '4rem', marginTop: '0.5rem' }}>
                            {project.clusters.length === 1 ? (
                              <span>{project.clusters[0]}</span>
                            ) : project.clusters.length === 2 ? (
                              <>
                                <span>{project.clusters[0]}</span>
                                <span>, {project.clusters[1]}</span>
                              </>
                            ) : (
                              <>
                                <span>{project.clusters[0]}</span>
                                <span>, {project.clusters[1]}</span>
                                <Link to="#">, {project.clusters.length - 2} more...</Link>
                              </>
                            )}
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Bottom Pagination */}
                <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
                  <Pagination
                    itemCount={totalProjects}
                    perPage={projectsPerPage}
                    page={projectsPage}
                    onSetPage={(_evt, newPage) => setProjectsPage(newPage)}
                    widgetId="projects-pagination-bottom"
                    onPerPageSelect={(_evt, newPerPage, newPage) => {
                      setProjectsPerPage(newPerPage);
                      setProjectsPage(newPage);
                    }}
                    variant={PaginationVariant.bottom}
                    isCompact={false}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </TabContent>
      </div>

      {/* Create Cost Model Wizard */}
      <Modal
        variant={ModalVariant.large}
        isOpen={isWizardOpen}
        onClose={() => {
          resetWizardState();
          setIsWizardOpen(false);
        }}
        aria-labelledby="create-cost-model-wizard-title"
      >
        <Wizard
          onClose={() => {
            resetWizardState();
            setIsWizardOpen(false);
          }}
          header={
            <div style={{ 
              padding: '24px', 
              backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
              borderBottom: '1px solid var(--pf-t--global--border--color--default)'
            }}>
              <Title headingLevel="h1" size="2xl" style={{ marginBottom: '8px' }}>
                Create a cost model
              </Title>
              <p style={{ color: 'var(--pf-t--global--text--color--subtle)', margin: 0 }}>
                A cost model allows you to associate a price to metrics provided by your integrations to charge for utilization of resources.
              </p>
            </div>
          }
        >
          <WizardStep
            name="Enter information"
            id="general-info-step"
            footer={{ isNextDisabled: !wizardName.trim() || !wizardIntegration }}
          >
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size="xl" style={{ display: 'inline-block', marginRight: '1em' }}>
                  Enter general information
                </Title>
                <a
                  href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html-single/using_cost_models/index#assembly-setting-up-cost-models"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn more
                </a>
              </StackItem>
              <StackItem>
                <Form style={{ width: '350px' }}>
                  <FormGroup 
                    label="Name" 
                    isRequired 
                    fieldId="name"
                  >
                    <TextInput
                      isRequired
                      type="text"
                      id="name"
                      name="name"
                      value={wizardName}
                      onChange={(_event, value) => setWizardName(value)}
                    />
                  </FormGroup>

                  <FormGroup label="Description" fieldId="description">
                    <TextArea
                      type="text"
                      id="description"
                      name="description"
                      value={wizardDescription}
                      onChange={(_event, value) => setWizardDescription(value)}
                      style={{
                        maxWidth: '450px',
                        minWidth: '350px',
                        minHeight: '75px',
                        maxHeight: '150px',
                      }}
                    />
                  </FormGroup>

                  <FormGroup 
                    label="Integration" 
                    isRequired 
                    fieldId="source-type-selector"
                  >
                    <Select
                      isOpen={wizardIntegrationOpen}
                      onSelect={(_event, value) => {
                        setWizardIntegration(value as string);
                        setWizardIntegrationOpen(false);
                      }}
                      onOpenChange={(isOpen) => setWizardIntegrationOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setWizardIntegrationOpen(!wizardIntegrationOpen)}
                          isExpanded={wizardIntegrationOpen}
                          style={{ width: '100%' }}
                          aria-label="Select integration"
                        >
                          {wizardIntegration || 'Select integration'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="OpenShift Container Platform">OpenShift Container Platform</SelectOption>
                        <SelectOption value="Amazon Web Services">Amazon Web Services</SelectOption>
                        <SelectOption value="Microsoft Azure">Microsoft Azure</SelectOption>
                        <SelectOption value="Google Cloud Platform">Google Cloud Platform</SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Currency" fieldId="currency-units-selector">
                    <Select
                      isOpen={wizardCurrencyOpen}
                      onSelect={() => setWizardCurrencyOpen(false)}
                      onOpenChange={(isOpen) => setWizardCurrencyOpen(isOpen)}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setWizardCurrencyOpen(!wizardCurrencyOpen)}
                          isExpanded={wizardCurrencyOpen}
                          style={{ width: '100%' }}
                          aria-label="Select currency"
                        >
                          {wizardCurrency}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="USD ($) - United States Dollar">USD ($) - United States Dollar</SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>
                </Form>
              </StackItem>
            </Stack>
          </WizardStep>

          {/* Step 2: Cost calculations - only for AWS/Azure/GCP */}
          {wizardIntegration === 'Amazon Web Services' && (
            <WizardStep
              name="Cost calculations"
              id="cost-calculations-step"
            >
              <Stack hasGutter>
                <StackItem>
                  <Title headingLevel="h2" size="xl" style={{ display: 'inline-block', marginRight: '1em' }}>
                    Cost calculations (optional)
                  </Title>
                  <a
                    href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-setting-up-cost-models#creating-an-AWS-Azure-cost-model_setting-up-cost-models"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Learn more
                  </a>
                </StackItem>

                <StackItem>
                  <Title headingLevel="h3" size="md">Markup or Discount</Title>
                  <Content>
                    <p>
                      Use markup/discount to manipulate how the raw costs are being calculated for your integrations. Note, costs calculated from price list rates will not be affected by this.
                    </p>
                  </Content>
                </StackItem>

                <StackItem>
                  <Flex style={{ marginTop: '6px' }}>
                    <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                      <div>
                        <Radio
                          name="discount"
                          id="markup"
                          isChecked={!wizardIsDiscount}
                          onChange={() => setWizardIsDiscount(false)}
                          label="Markup (+)"
                          style={{ marginBottom: '6px' }}
                        />
                        <Radio
                          name="discount"
                          id="discount"
                          isChecked={wizardIsDiscount}
                          onChange={() => setWizardIsDiscount(true)}
                          label="Discount (-)"
                        />
                      </div>
                    </Flex>

                    <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                      <Form style={{ marginLeft: '20px' }}>
                        <FormGroup>
                          <InputGroup>
                            <InputGroupItem isFill={false}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0 var(--pf-t--global--spacer--sm)',
                                  border: '1px solid var(--pf-t--global--border--color--default)',
                                  borderRight: '0',
                                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                                  alignItems: 'center',
                                  height: '36px',
                                  lineHeight: '34px',
                                }}
                              >
                                {wizardIsDiscount ? 'Discount (-)' : 'Markup (+)'}
                              </span>
                            </InputGroupItem>
                            <InputGroupItem isFill>
                              <TextInput
                                type="text"
                                id="markup-input-box"
                                aria-label="Rate"
                                value={wizardMarkupRate}
                                onChange={(_event, value) => setWizardMarkupRate(value)}
                                placeholder="0"
                                style={{ borderLeft: '0', width: '175px' }}
                              />
                            </InputGroupItem>
                            <InputGroupItem isFill={false}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0 var(--pf-t--global--spacer--sm)',
                                  border: '1px solid var(--pf-t--global--border--color--default)',
                                  borderLeft: '0',
                                  backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                                  alignItems: 'center',
                                  height: '36px',
                                  lineHeight: '34px',
                                }}
                              >
                                %
                              </span>
                            </InputGroupItem>
                          </InputGroup>
                        </FormGroup>
                      </Form>
                    </Flex>
                  </Flex>
                </StackItem>

                <StackItem style={{ marginLeft: '30px' }}>
                  <Content>
                    <h3>Examples</h3>
                  </Content>
                  <List>
                    <ListItem>
                      <span>A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your integrations.</span>
                    </ListItem>
                    <ListItem>
                      <span>A markup rate of (+) 100% doubles the base costs of your integrations.</span>
                    </ListItem>
                    <ListItem>
                      <span>A discount rate of (-) 100% reduces the base costs of your integrations to 0.</span>
                    </ListItem>
                    <ListItem>
                      <span>A discount rate of (-) 25% reduces the base costs of your integrations to 75% of the original value.</span>
                    </ListItem>
                  </List>
                </StackItem>
              </Stack>
            </WizardStep>
          )}

          {/* Step 3: Private offers - only for AWS */}
          {wizardIntegration === 'Amazon Web Services' && (
            <WizardStep
              name="Private offers"
              id="private-offers-step"
            >
              <Stack hasGutter>
                <StackItem>
                  <Title headingLevel="h2" size="xl">
                    {awsShowCreateCommitment ? 'Create a private offer' : 'Private offers (optional)'}
                  </Title>
                </StackItem>

                {!awsShowCreateCommitment && (
                  <>
                    <StackItem>
                      <Content>
                        <p>
                          If you have private offers or hybrid commitments, enter your committed resources. This commitment applies across all clusters associated with this AWS account.
                        </p>
                      </Content>
                    </StackItem>

                    <StackItem>
                      {awsCommitments.length === 0 ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                              <svg style={{ width: '48px', height: '48px' }} fill="currentColor" viewBox="0 0 512 512">
                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" />
                              </svg>
                            </div>
                            <Title headingLevel="h2" size="lg" style={{ marginBottom: '8px' }}>
                              No private offers have been created.
                            </Title>
                            <div style={{ marginBottom: '16px' }}>
                              To skip this step, click the <strong>next</strong> button.<br />
                              You can create a private offer or modify one at a later time.
                            </div>
                            <Button variant="primary" onClick={() => setAwsShowCreateCommitment(true)}>
                              Create commitment
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Toolbar id="private-offers-toolbar">
                            <ToolbarContent>
                              <ToolbarItem>
                                <Button variant="primary" onClick={() => setAwsShowCreateCommitment(true)}>
                                  Create commitment
                                </Button>
                              </ToolbarItem>
                              <ToolbarItem variant="pagination">
                                <Pagination
                                  itemCount={awsCommitments.length}
                                  perPage={10}
                                  page={1}
                                  variant={PaginationVariant.top}
                                  titles={{
                                    paginationAriaLabel: 'Private offers pagination',
                                  }}
                                />
                              </ToolbarItem>
                            </ToolbarContent>
                          </Toolbar>
                        <Table aria-label="Private offers table">
                          <Thead>
                            <Tr>
                              <Th>Product</Th>
                              <Th>Commitment (vCPUs/month)</Th>
                              <Th>Rate</Th>
                              <Th>Start date</Th>
                              <Th>Status</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {awsCommitments.map((commitment) => {
                              const status = getCommitmentStatus(commitment.startDate);
                              return (
                                <Tr key={commitment.id}>
                                  <Td>Red Hat OpenShift on AWS</Td>
                                  <Td>{commitment.commitment}</Td>
                                  <Td>${commitment.rate}</Td>
                                  <Td>{new Date(commitment.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Td>
                                  <Td>
                                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsNone' }}>
                                      <FlexItem>
                                        <Label color={status.variant} isCompact>
                                          {status.label}
                                        </Label>
                                      </FlexItem>
                                      <FlexItem>
                                        <span style={{ fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                          {status.daysInfo}
                                        </span>
                                      </FlexItem>
                                    </Flex>
                                  </Td>
                                  <Td isActionCell>
                                    <Button
                                      variant="plain"
                                      aria-label="Delete commitment"
                                      onClick={() => {
                                        setAwsCommitments(awsCommitments.filter(c => c.id !== commitment.id));
                                      }}
                                    >
                                      <TimesIcon />
                                    </Button>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                        </>
                      )}
                    </StackItem>
                  </>
                )}

                {/* Create commitment form */}
                {awsShowCreateCommitment && (
                  <>
                    <StackItem>
                      <Content>
                        <p>
                          Enter your committed resources for Red Hat OpenShift on AWS. This commitment applies across all clusters associated with this AWS account.
                        </p>
                      </Content>
                    </StackItem>

                    <StackItem>
                      <Card>
                        <CardTitle>
                          <Title headingLevel="h3" size="lg">
                            Red Hat OpenShift on AWS
                          </Title>
                        </CardTitle>
                        <CardBody>
                          <Form>
                            <Grid hasGutter span={6}>
                              <GridItem>
                                <FormGroup
                                  label="Commitment"
                                  fieldId="rosa-commitment"
                                  isRequired
                                >
                                  <InputGroup style={{ maxWidth: '300px' }}>
                                    <InputGroupItem>
                                      <TextInput
                                        id="rosa-commitment"
                                        type="number"
                                        aria-label="ROSA commitment in vCPUs per month"
                                        placeholder="0"
                                        value={awsNewCommitment}
                                        onChange={(_event, value) => setAwsNewCommitment(value)}
                                        style={{ width: '120px' }}
                                      />
                                    </InputGroupItem>
                                    <InputGroupItem>
                                      <span style={{ 
                                        padding: '0 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'var(--pf-t--global--text--color--regular)'
                                      }}>
                                        vCPUs/month
                                      </span>
                                    </InputGroupItem>
                                  </InputGroup>
                                  <div style={{ marginTop: '0.5rem', fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                    Enter the total vCPUs committed per month.
                                  </div>
                                </FormGroup>
                              </GridItem>

                              <GridItem>
                                <FormGroup
                                  label="Rate"
                                  fieldId="rosa-rate"
                                  isRequired
                                >
                                  <InputGroup style={{ maxWidth: '300px' }}>
                                    <InputGroupItem>
                                      <span style={{ 
                                        padding: '8px 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--pf-t--global--text--color--regular)',
                                        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                                        border: '1px solid var(--pf-t--global--border--color--default)',
                                        borderRadius: 'var(--pf-t--global--border--radius--small)',
                                        minWidth: '40px'
                                      }}>
                                        $
                                      </span>
                                    </InputGroupItem>
                                    <InputGroupItem>
                                      <TextInput
                                        id="rosa-rate"
                                        type="number"
                                        aria-label="Rate per vCPU"
                                        placeholder="0.00"
                                        value={awsNewRate}
                                        onChange={(_event, value) => setAwsNewRate(value)}
                                        style={{ width: '120px' }}
                                      />
                                    </InputGroupItem>
                                    <InputGroupItem>
                                      <span style={{ 
                                        padding: '0 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: 'var(--pf-t--global--text--color--regular)'
                                      }}>
                                        per vCPU
                                      </span>
                                    </InputGroupItem>
                                  </InputGroup>
                                  <div style={{ marginTop: '0.5rem', fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                    Enter the rate per vCPU.
                                  </div>
                                </FormGroup>
                              </GridItem>
                            </Grid>

                            <FormGroup
                              label="Start date"
                              fieldId="contract-start-date"
                              isRequired
                            >
                              <div style={{ display: 'inline-block', maxWidth: '184px' }}>
                                <TextInput
                                  id="contract-start-date"
                                  type="date"
                                  aria-label="Contract start date"
                                  value={awsNewStartDate}
                                  onChange={(_event, value) => setAwsNewStartDate(value)}
                                />
                              </div>
                              <div style={{ marginTop: '0.5rem', fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--text--color--subtle)' }}>
                                Specify when this monthly commitment begins.
                              </div>
                            </FormGroup>

                            <ActionList>
                              <ActionListItem>
                                <Button
                                  variant="primary"
                                  onClick={() => {
                                    if (awsNewCommitment && awsNewRate && awsNewStartDate) {
                                      setAwsCommitments([
                                        ...awsCommitments,
                                        {
                                          id: Date.now(),
                                          commitment: awsNewCommitment,
                                          rate: awsNewRate,
                                          startDate: awsNewStartDate
                                        }
                                      ]);
                                      setAwsNewCommitment('0');
                                      setAwsNewRate('0');
                                      setAwsNewStartDate('');
                                      setAwsShowCreateCommitment(false);
                                    }
                                  }}
                                  isDisabled={!awsNewCommitment || !awsNewRate || !awsNewStartDate || awsNewCommitment === '0' || awsNewRate === '0'}
                                >
                                  Create commitment
                                </Button>
                              </ActionListItem>
                              <ActionListItem>
                                <Button
                                  variant="link"
                                  onClick={() => {
                                    setAwsNewCommitment('0');
                                    setAwsNewRate('0');
                                    setAwsNewStartDate('');
                                    setAwsShowCreateCommitment(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </ActionListItem>
                            </ActionList>
                          </Form>
                        </CardBody>
                      </Card>
                    </StackItem>
                  </>
                )}
              </Stack>
            </WizardStep>
          )}

          {/* Step 4: Assign integrations - only for AWS */}
          {wizardIntegration === 'Amazon Web Services' && (
            <WizardStep
              name="Assign an integration to the cost model"
              id="assign-integrations-step"
            >
              <Stack hasGutter>
                <StackItem>
                  <Title headingLevel="h2" size="xl">Assign integrations to the cost model (optional)</Title>
                </StackItem>

                <StackItem>
                  <Content>
                    <p>
                      Select one or more integrations to this cost model. You can skip this step and assign the cost model to a integration at a later time. An integration will be unavailable for selection if a cost model is already assigned to it.
                    </p>
                  </Content>
                </StackItem>

                <StackItem>
                  <Content>
                    <h3>Select from the following Amazon Web Services integrations:</h3>
                  </Content>
                </StackItem>

                <StackItem>
                  <Toolbar id="assign-sources-toolbar">
                    <ToolbarContent>
                      <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
                        <ToolbarItem>
                          <SearchInput
                            placeholder="Filter by name..."
                            value={wizardIntegrationSearchValue}
                            onChange={(_event, value) => setWizardIntegrationSearchValue(value)}
                            onClear={() => setWizardIntegrationSearchValue('')}
                          />
                        </ToolbarItem>
                      </ToolbarToggleGroup>
                      <ToolbarItem variant="pagination">
                        <Pagination
                          itemCount={awsIntegrations.length}
                          perPage={10}
                          page={1}
                          widgetId="assign-integrations-pagination-top"
                          isCompact
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>

                  <Table aria-label="Assign integrations to cost model table" variant="compact" gridBreakPoint="grid-md">
                    <Thead>
                      <Tr>
                        <Th />
                        <Th>Name</Th>
                        <Th>Cost model assigned</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {awsIntegrations.map((integration, idx) => (
                        <Tr key={integration.id}>
                          <Td
                            select={{
                              rowIndex: idx,
                              onSelect: (_event, isSelecting) => {
                                setWizardSelectedIntegrations(
                                  isSelecting
                                    ? [...wizardSelectedIntegrations, integration.id]
                                    : wizardSelectedIntegrations.filter((id) => id !== integration.id)
                                );
                              },
                              isSelected: wizardSelectedIntegrations.includes(integration.id),
                              isDisabled: integration.assignedCostModel !== '',
                            }}
                          />
                          <Td dataLabel="Name">{integration.name}</Td>
                          <Td dataLabel="Cost model assigned">
                            {integration.assignedCostModel ? (
                              dataService.getCostModelById(integration.assignedCostModel)?.name || integration.assignedCostModel
                            ) : (
                              <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>None</span>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <Toolbar>
                    <ToolbarContent>
                      <ToolbarItem variant="pagination">
                        <Pagination
                          itemCount={awsIntegrations.length}
                          perPage={10}
                          page={1}
                          widgetId="assign-integrations-pagination-bottom"
                          variant={PaginationVariant.bottom}
                          style={{ paddingTop: '0.5rem' }}
                        />
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                </StackItem>
              </Stack>
            </WizardStep>
          )}

          {/* Step 5: Review details - only for AWS */}
          {wizardIntegration === 'Amazon Web Services' && (
            <WizardStep
              name="Review details"
              id="review-step"
            >
              <Stack hasGutter>
                <StackItem>
                  <Title headingLevel="h2" size="xl">Review details</Title>
                </StackItem>

                <StackItem>
                  <Content>
                    <p>
                      Review and confirm your cost model configuration and assignments. Click <strong>Create</strong> to create the cost model, or <strong>Back</strong> to revise.
                    </p>
                  </Content>
                </StackItem>

                <StackItem>
                  <Content>
                    <dl>
                      <dt>Name</dt>
                      <dd>{wizardName}</dd>
                      <dt>Description</dt>
                      <dd>{wizardDescription || ''}</dd>
                      <dt>Currency</dt>
                      <dd>{wizardCurrency}</dd>
                      <dt>Markup/Discount</dt>
                      <dd>{wizardIsDiscount ? '-' : '+'}{wizardMarkupRate} %</dd>
                      <dt>Assign integrations</dt>
                      <dd>
                        {wizardSelectedIntegrations.length > 0
                          ? wizardSelectedIntegrations
                              .map((id) => awsIntegrations.find((i) => i.id === id)?.name)
                              .filter(Boolean)
                              .join(', ')
                          : ''}
                      </dd>
                    </dl>
                  </Content>
                </StackItem>
              </Stack>
            </WizardStep>
          )}

          {/* OpenShift Container Platform Wizard Steps */}
          {/* Step 2: Price list - only for OCP */}
          {wizardIntegration === 'OpenShift Container Platform' && (
            <WizardStep
                name="Price list"
                id="ocp-price-list-step"
              >
                <Stack hasGutter>
                  <StackItem>
                    <Title headingLevel="h2" size="xl">
                      {ocpShowCreateRate ? 'Create a price list' : 'Create a price list'}
                    </Title>
                  </StackItem>

                  {!ocpShowCreateRate && (
                    <>
                      <StackItem>
                        <Content>
                          <p>The following is a list of rates you have set so far for this price list.</p>
                        </Content>
                      </StackItem>

                      <StackItem>
                        {ocpPriceListRates.length === 0 ? (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                                <svg style={{ width: '48px', height: '48px' }} fill="currentColor" viewBox="0 0 512 512">
                                  <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" />
                                </svg>
                              </div>
                              <Title headingLevel="h2" size="lg" style={{ marginBottom: '8px' }}>
                                A price list has not been created.
                              </Title>
                              <div style={{ marginBottom: '16px' }}>
                                To skip this step, click the <strong>next</strong> button.<br />
                                You can create a price list or modify one at a later time.
                              </div>
                              <Button variant="primary" onClick={() => setOcpShowCreateRate(true)}>
                                Create rate
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Toolbar id="price-list-toolbar" style={{ gap: '1rem' }}>
                              <ToolbarContent>
                                <ToolbarGroup>
                                  <ToolbarItem>
                                    <Select
                                      toggle={(toggleRef: React.Ref<any>) => (
                                        <MenuToggle
                                          ref={toggleRef}
                                          onClick={() => {}}
                                          isExpanded={false}
                                          isDisabled={ocpPriceListRates.length === 0}
                                          style={{ width: '200px' }}
                                        >
                                          Metric
                                        </MenuToggle>
                                      )}
                                      isOpen={false}
                                    >
                                      <SelectList>
                                        <SelectOption value="">Select metric</SelectOption>
                                      </SelectList>
                                    </Select>
                                  </ToolbarItem>
                                  <ToolbarItem></ToolbarItem>
                                  <ToolbarItem>
                                    <Select
                                      toggle={(toggleRef: React.Ref<any>) => (
                                        <MenuToggle
                                          ref={toggleRef}
                                          onClick={() => {}}
                                          isExpanded={false}
                                          isDisabled={ocpPriceListRates.length === 0}
                                        >
                                          Filter by metrics
                                        </MenuToggle>
                                      )}
                                      isOpen={false}
                                    >
                                      <SelectList>
                                        <SelectOption value="">Select filter</SelectOption>
                                      </SelectList>
                                    </Select>
                                  </ToolbarItem>
                                </ToolbarGroup>
                                <ToolbarItem>
                                  <Button variant="primary" onClick={() => setOcpShowCreateRate(true)}>
                                    Create rate
                                  </Button>
                                </ToolbarItem>
                                <ToolbarItem variant="pagination">
                                  <Pagination
                                    itemCount={ocpPriceListRates.length}
                                    perPage={10}
                                    page={1}
                                    variant={PaginationVariant.top}
                                    titles={{
                                      paginationAriaLabel: 'Assign integrations top pagination',
                                    }}
                                  />
                                </ToolbarItem>
                              </ToolbarContent>
                            </Toolbar>
                            
                            <Table aria-label="Price list rates table">
                              <Thead>
                                <Tr>
                                  <Th>Metric</Th>
                                  <Th>Description</Th>
                                  <Th>Measurement</Th>
                                  <Th>Calculation type</Th>
                                  <Th>Rate</Th>
                                  <Th></Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {ocpPriceListRates.map((rate, index) => (
                                  <React.Fragment key={index}>
                                    <Tr>
                                      <Td>{rate.metric}</Td>
                                      <Td>{rate.description}</Td>
                                      <Td>{rate.measurement}</Td>
                                      <Td>{rate.calculationType}</Td>
                                      <Td>
                                        <Button
                                          variant="link"
                                          onClick={() => {
                                            const newExpanded = new Set(ocpExpandedRates);
                                            if (ocpExpandedRates.has(index)) {
                                              newExpanded.delete(index);
                                            } else {
                                              newExpanded.add(index);
                                            }
                                            setOcpExpandedRates(newExpanded);
                                          }}
                                        >
                                          Various
                                        </Button>
                                      </Td>
                                      <Td>
                                        <Button variant="plain" aria-label="Actions">
                                          <EllipsisVIcon />
                                        </Button>
                                      </Td>
                                    </Tr>
                                    {ocpExpandedRates.has(index) && (
                                      <Tr isExpanded>
                                        <Td colSpan={6}>
                                          <Table variant="compact" borders={false}>
                                            <Thead>
                                              <Tr>
                                                <Th>Tag key</Th>
                                                <Th>Tag value</Th>
                                                <Th>Rate</Th>
                                                <Th>Description</Th>
                                                <Th>Default</Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              {rate.tagValues.map((tv: any, tvIndex: number) => (
                                                <Tr key={tvIndex}>
                                                  <Td>{rate.tagKey}</Td>
                                                  <Td>{tv.value}</Td>
                                                  <Td>${tv.rate}</Td>
                                                  <Td>{tv.description}</Td>
                                                  <Td>{tv.isDefault ? 'Yes' : 'No'}</Td>
                                                </Tr>
                                              ))}
                                            </Tbody>
                                          </Table>
                                        </Td>
                                      </Tr>
                                    )}
                                  </React.Fragment>
                                ))}
                              </Tbody>
                            </Table>

                            <Toolbar>
                              <ToolbarContent>
                                <ToolbarItem variant="pagination">
                                  <Pagination
                                    itemCount={ocpPriceListRates.length}
                                    perPage={10}
                                    page={1}
                                    variant={PaginationVariant.bottom}
                                    titles={{
                                      paginationAriaLabel: 'Assign integrations bottom pagination',
                                    }}
                                    style={{ paddingTop: '0.5rem' }}
                                  />
                                </ToolbarItem>
                              </ToolbarContent>
                            </Toolbar>
                          </>
                        )}
                      </StackItem>
                    </>
                  )}

                  {ocpShowCreateRate && (
                    <>
                      <StackItem>
                        <Content>
                          <h3>
                            Select the metric you want to assign a price to, and specify a measurement unit and rate. You can optionally set multiple rates for particular tags.
                          </h3>
                        </Content>
                      </StackItem>

                      <StackItem>
                        <Form>
                          <FormGroup label="Description" fieldId="description" style={{ width: '360px' }}>
                            <TextInput
                              id="description"
                              value={ocpRateDescription}
                              onChange={(_event, val) => setOcpRateDescription(val)}
                            />
                          </FormGroup>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <FormGroup label="Metric" isRequired fieldId="metric-selector" style={{ width: '360px' }}>
                              <Select
                                toggle={(toggleRef: React.Ref<any>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setOcpRateMetricOpen(!ocpRateMetricOpen)}
                                    isExpanded={ocpRateMetricOpen}
                                    style={{ width: '100%' }}
                                    aria-label="Select metric"
                                  >
                                    {ocpRateMetric}
                                  </MenuToggle>
                                )}
                                isOpen={ocpRateMetricOpen}
                                onOpenChange={(isOpen) => setOcpRateMetricOpen(isOpen)}
                                onSelect={(_e, value) => {
                                  setOcpRateMetric(value as string);
                                  setOcpRateMetricOpen(false);
                                }}
                              >
                                <SelectList>
                                  <SelectOption value="CPU">CPU</SelectOption>
                                  <SelectOption value="Cluster">Cluster</SelectOption>
                                  <SelectOption value="Memory">Memory</SelectOption>
                                  <SelectOption value="Node">Node</SelectOption>
                                  <SelectOption value="Persistent volume claims">Persistent volume claims</SelectOption>
                                  <SelectOption value="Project">Project</SelectOption>
                                  <SelectOption value="Storage">Storage</SelectOption>
                                  <SelectOption value="Virtual machine">Virtual machine</SelectOption>
                                </SelectList>
                              </Select>
                            </FormGroup>

                            <FormGroup label="Measurement" isRequired fieldId="measurement-selector" style={{ width: '360px' }}>
                              <Select
                                toggle={(toggleRef: React.Ref<any>) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setOcpRateMeasurementOpen(!ocpRateMeasurementOpen)}
                                    isExpanded={ocpRateMeasurementOpen}
                                    style={{ width: '100%' }}
                                    aria-label="Select measurement"
                                  >
                                    {ocpRateMeasurement}
                                  </MenuToggle>
                                )}
                                isOpen={ocpRateMeasurementOpen}
                                onOpenChange={(isOpen) => setOcpRateMeasurementOpen(isOpen)}
                                onSelect={(_e, value) => {
                                  setOcpRateMeasurement(value as string);
                                  setOcpRateMeasurementOpen(false);
                                }}
                              >
                                <SelectList>
                                  <SelectOption value="Request (core-hours)">Request (core-hours)</SelectOption>
                                  <SelectOption value="Usage (core-hours)">Usage (core-hours)</SelectOption>
                                  <SelectOption value="Effective-usage (core-hours)">Effective-usage (core-hours)</SelectOption>
                                </SelectList>
                              </Select>
                            </FormGroup>
                          </div>

                          <FormGroup label="Calculation type" fieldId="calculation">
                            <Radio
                              id="calculation-infra"
                              name="calculation"
                              label="Infrastructure"
                              isChecked={ocpRateCalculationType === 'infrastructure'}
                              onChange={() => setOcpRateCalculationType('infrastructure')}
                            />
                            <Radio
                              id="calculation-suppl"
                              name="calculation"
                              label="Supplementary"
                              isChecked={ocpRateCalculationType === 'supplementary'}
                              onChange={() => setOcpRateCalculationType('supplementary')}
                              style={{ marginLeft: '16px' }}
                            />
                          </FormGroup>

                          <Checkbox
                            id="enter-rate-by-tag"
                            label="Enter rate by tag"
                            isChecked={ocpRateByTag}
                            onChange={(_event, checked) => setOcpRateByTag(checked)}
                          />

                          {ocpRateByTag && (
                            <>
                              <FormGroup label="Filter by tag key" isRequired fieldId="tag-key" style={{ width: '360px' }}>
                                <TextInput
                                  id="tag-key"
                                  value={ocpRateTagKey}
                                  onChange={(_event, val) => setOcpRateTagKey(val)}
                                  placeholder="Enter a tag key"
                                />
                              </FormGroup>

                              {ocpRateTagValues.map((tagValue, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '16px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '16px' }}>=</span>
                                  </div>
                                  <FormGroup label="Tag value" isRequired fieldId={`tagValue_${index}`} style={{ minWidth: '200px' }}>
                                    <TextInput
                                      id={`tagValue_${index}`}
                                      value={tagValue.value}
                                      onChange={(_event, val) => {
                                        const newValues = [...ocpRateTagValues];
                                        newValues[index].value = val;
                                        setOcpRateTagValues(newValues);
                                      }}
                                      placeholder="Enter a tag value"
                                    />
                                  </FormGroup>
                                  <FormGroup label="Rate" isRequired fieldId={`rate_${index}`} style={{ minWidth: '200px' }}>
                                    <InputGroup>
                                      <InputGroupItem isFill>
                                        <span style={{ marginRight: '8px', fontWeight: 700 }}>$</span>
                                        <TextInput
                                          id={`rate_${index}`}
                                          value={tagValue.rate}
                                          onChange={(_event, val) => {
                                            const newValues = [...ocpRateTagValues];
                                            newValues[index].rate = val;
                                            setOcpRateTagValues(newValues);
                                          }}
                                          placeholder="0.00"
                                          aria-label="Assign rate"
                                        />
                                      </InputGroupItem>
                                    </InputGroup>
                                  </FormGroup>
                                  <FormGroup label="Description" fieldId={`desc_${index}`} style={{ minWidth: '200px' }}>
                                    <TextInput
                                      id={`desc_${index}`}
                                      value={tagValue.description}
                                      onChange={(_event, val) => {
                                        const newValues = [...ocpRateTagValues];
                                        newValues[index].description = val;
                                        setOcpRateTagValues(newValues);
                                      }}
                                      placeholder="Enter a tag description"
                                    />
                                  </FormGroup>
                                  <FormGroup label="Default" fieldId={`isDefault_${index}`}>
                                    <Checkbox
                                      id={`isDefault_${index}`}
                                      isChecked={tagValue.isDefault}
                                      onChange={(_event, checked) => {
                                        const newValues = [...ocpRateTagValues];
                                        newValues[index].isDefault = checked;
                                        setOcpRateTagValues(newValues);
                                      }}
                                    />
                                  </FormGroup>
                                  <FormGroup label={<div>&nbsp;</div>} fieldId="remove-tag">
                                    <Button
                                      variant="plain"
                                      aria-label="Remove tag value"
                                      isDisabled={ocpRateTagValues.length === 1}
                                      onClick={() => {
                                        const newValues = ocpRateTagValues.filter((_, i) => i !== index);
                                        setOcpRateTagValues(newValues);
                                      }}
                                    >
                                      <MinusCircleIcon />
                                    </Button>
                                  </FormGroup>
                                </div>
                              ))}

                              <Button
                                variant="link"
                                icon={<svg fill="currentColor" height="1em" width="1em" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" /></svg>}
                                onClick={() => {
                                  setOcpRateTagValues([...ocpRateTagValues, { value: '', rate: '', description: '', isDefault: false }]);
                                }}
                                style={{ paddingLeft: 0 }}
                              >
                                Add more tag values
                              </Button>
                            </>
                          )}
                        </Form>
                      </StackItem>

                      <StackItem>
                        <FormGroup>
                          <ActionList>
                            <ActionListItem>
                              <Button
                                variant="primary"
                                isDisabled={!ocpRateMetric || !ocpRateMeasurement}
                                onClick={() => {
                                  const newRate = {
                                    metric: ocpRateMetric,
                                    description: ocpRateDescription,
                                    measurement: ocpRateMeasurement,
                                    calculationType: ocpRateCalculationType,
                                    tagKey: ocpRateTagKey,
                                    tagValues: ocpRateTagValues,
                                  };
                                  setOcpPriceListRates([...ocpPriceListRates, newRate]);
                                  setOcpShowCreateRate(false);
                                  setOcpRateDescription('');
                                  setOcpRateTagKey('');
                                  setOcpRateTagValues([{ value: '', rate: '', description: '', isDefault: false }]);
                                  setOcpRateByTag(false);
                                }}
                              >
                                Create rate
                              </Button>
                            </ActionListItem>
                            <ActionListItem>
                              <Button variant="link" onClick={() => setOcpShowCreateRate(false)}>
                                Cancel
                              </Button>
                            </ActionListItem>
                          </ActionList>
                        </FormGroup>
                      </StackItem>
                    </>
                  )}
                </Stack>
              </WizardStep>
          )}

          {/* Step 3: Cost calculations - only for OCP */}
          {wizardIntegration === 'OpenShift Container Platform' && (
            <WizardStep
                name="Cost calculations"
                id="ocp-cost-calculations-step"
              >
                <Stack hasGutter>
                  <StackItem>
                    <Title headingLevel="h2" size="xl" style={{ display: 'inline-block', marginRight: '1em' }}>
                      Cost calculations (optional)
                    </Title>
                    <a
                      href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-setting-up-cost-models"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Learn more
                    </a>
                  </StackItem>

                  <StackItem>
                    <Title headingLevel="h3" size="md">Markup or Discount</Title>
                    <Content>
                      <p>
                        Use markup/discount to manipulate how the raw costs are being calculated for your integrations. Note, costs calculated from price list rates will not be affected by this.
                      </p>
                    </Content>
                  </StackItem>

                  <StackItem>
                    <Flex style={{ marginTop: '6px' }}>
                      <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
                        <Radio
                          id="markup"
                          name="discount"
                          label="Markup (+)"
                          isChecked={ocpMarkupDiscount === 'markup'}
                          onChange={() => setOcpMarkupDiscount('markup')}
                          style={{ marginBottom: '6px' }}
                        />
                        <Radio
                          id="discount"
                          name="discount"
                          label="Discount (-)"
                          isChecked={ocpMarkupDiscount === 'discount'}
                          onChange={() => setOcpMarkupDiscount('discount')}
                        />
                      </FlexItem>
                      <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
                        <Form>
                          <FormGroup style={{ marginLeft: '20px' }}>
                            <InputGroup>
                              <InputGroupItem>
                                <span style={{ padding: '8px', border: '1px solid var(--pf-t--global--border--color--default)', borderRight: '0' }}>
                                  {ocpMarkupDiscount === 'markup' ? 'Markup (+)' : 'Discount (-)'}
                                </span>
                              </InputGroupItem>
                              <InputGroupItem isFill>
                                <TextInput
                                  id="markup-input-box"
                                  value={ocpMarkupRate}
                                  onChange={(_event, val) => setOcpMarkupRate(val)}
                                  placeholder="0"
                                  style={{ borderLeft: '0', width: '175px' }}
                                  aria-label="Rate"
                                />
                              </InputGroupItem>
                              <InputGroupItem>
                                <span style={{ padding: '8px', border: '1px solid var(--pf-t--global--border--color--default)', borderLeft: '0' }}>
                                  %
                                </span>
                              </InputGroupItem>
                            </InputGroup>
                          </FormGroup>
                        </Form>
                      </FlexItem>
                    </Flex>
                  </StackItem>

                  <StackItem>
                    <div style={{ marginLeft: '30px' }}>
                      <Content>
                        <h3>Examples</h3>
                      </Content>
                      <List>
                        <ListItem>
                          A markup or discount rate of (+/-) 0% (the default) makes no adjustments to the base costs of your integrations.
                        </ListItem>
                        <ListItem>A markup rate of (+) 100% doubles the base costs of your integrations.</ListItem>
                        <ListItem>A discount rate of (-) 100% reduces the base costs of your integrations to 0.</ListItem>
                        <ListItem>
                          A discount rate of (-) 25% reduces the base costs of your integrations to 75% of the original value.
                        </ListItem>
                      </List>
                    </div>
                  </StackItem>
                </Stack>
              </WizardStep>
          )}

          {/* Step 4: Cost distribution - only for OCP */}
          {wizardIntegration === 'OpenShift Container Platform' && (
            <WizardStep
                name="Cost distribution"
                id="ocp-cost-distribution-step"
              >
                <Stack hasGutter>
                  <StackItem>
                    <Title headingLevel="h2" size="xl" style={{ display: 'inline-block', marginRight: '1em' }}>
                      Cost distribution
                    </Title>
                    <a
                      href="https://docs.redhat.com/en/documentation/cost_management_service/1-latest/html/using_cost_models/assembly-using-cost-models#distributing_costs"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Learn more
                    </a>
                  </StackItem>

                  <StackItem>
                    <Title headingLevel="h3" size="md">Distribution type</Title>
                    <Content>
                      <p>Choose how your raw costs are distributed at the project level.</p>
                    </Content>
                  </StackItem>

                  <StackItem>
                    <Form>
                      <FormGroup>
                        <Radio
                          id="cpu-distribution"
                          name="distribution-type"
                          label="CPU"
                          value="cpu"
                          isChecked={ocpDistributionType === 'cpu'}
                          onChange={() => setOcpDistributionType('cpu')}
                        />
                        <Radio
                          id="memory-distribution"
                          name="distribution-type"
                          label="Memory"
                          value="memory"
                          isChecked={ocpDistributionType === 'memory'}
                          onChange={() => setOcpDistributionType('memory')}
                          style={{ marginLeft: '16px' }}
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>

                  <StackItem>
                    <Title headingLevel="h3" size="md">
                      Distribute these costs to projects, based on the above description type
                    </Title>
                  </StackItem>

                  <StackItem>
                    <Form>
                      <FormGroup>
                        <Checkbox
                          id="distribute-platform"
                          label="Platform overhead (OpenShift services)"
                          isChecked={ocpDistributePlatform}
                          onChange={(_event, checked) => setOcpDistributePlatform(checked)}
                          aria-label="Platform overhead (OpenShift services)"
                        />
                        <Checkbox
                          id="distribute-worker"
                          label="Worker unallocated (unused and non-reserved resources)"
                          isChecked={ocpDistributeWorker}
                          onChange={(_event, checked) => setOcpDistributeWorker(checked)}
                          aria-label="Worker unallocated (unused and non-reserved resources)"
                        />
                        <Checkbox
                          id="distribute-network"
                          label="Network traffic"
                          isChecked={ocpDistributeNetwork}
                          onChange={(_event, checked) => setOcpDistributeNetwork(checked)}
                          aria-label="Network traffic"
                        />
                        <Checkbox
                          id="distribute-storage"
                          label="Storage"
                          isChecked={ocpDistributeStorage}
                          onChange={(_event, checked) => setOcpDistributeStorage(checked)}
                          aria-label="Storage"
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>
                </Stack>
              </WizardStep>
          )}

          {/* Step 5: Assign integrations - only for OCP */}
          {wizardIntegration === 'OpenShift Container Platform' && (
            <WizardStep
                name="Assign an integration to the cost model"
                id="ocp-assign-integrations-step"
              >
                <Stack hasGutter>
                  <StackItem>
                    <Title headingLevel="h2" size="xl">Assign integrations to the cost model (optional)</Title>
                  </StackItem>

                  <StackItem>
                    <Content>
                      <p>
                        Select one or more integrations to this cost model. You can skip this step and assign the cost model to a integration at a later time. An integration will be unavailable for selection if a cost model is already assigned to it.
                      </p>
                    </Content>
                  </StackItem>

                  <StackItem>
                    <Content>
                      <h3>Select from the following Red Hat OpenShift integrations:</h3>
                    </Content>
                  </StackItem>

                  <StackItem>
                    <Toolbar id="assign-sources-toolbar">
                      <ToolbarContent>
                        <ToolbarGroup>
                          <ToolbarItem>
                            <InputGroup id="assign-source-search-input">
                              <InputGroupItem isFill>
                                <TextInputGroup>
                                  <TextInputGroupMain
                                    icon={<SearchIcon />}
                                    value={wizardIntegrationSearchValue}
                                    onChange={(_event, value) => setWizardIntegrationSearchValue(value)}
                                    placeholder="Filter by name..."
                                    aria-label="Filter by name..."
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
                        <ToolbarItem variant="pagination">
                          <Pagination
                            itemCount={ocpIntegrations.length}
                            perPage={10}
                            page={1}
                            variant={PaginationVariant.top}
                            titles={{
                              paginationAriaLabel: 'Assign integrations bottom pagination',
                            }}
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>

                    <Table aria-label="Assign integrations to cost model table">
                      <Thead>
                        <Tr>
                          <Th></Th>
                          <Th>Name</Th>
                          <Th>Operator version</Th>
                          <Th style={{ minWidth: '125px' }}>Cost model assigned</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {ocpIntegrations.slice(0, 10).map((integration, idx) => (
                          <Tr key={integration.id}>
                            <Td
                              select={{
                                rowIndex: idx,
                                onSelect: (_event, isSelecting) => {
                                  setWizardSelectedIntegrations(
                                    isSelecting
                                      ? [...wizardSelectedIntegrations, integration.id]
                                      : wizardSelectedIntegrations.filter((id) => id !== integration.id)
                                  );
                                },
                                isSelected: wizardSelectedIntegrations.includes(integration.id),
                                isDisabled: integration.assignedCostModel !== '',
                              }}
                            />
                            <Td>{integration.name}</Td>
                            <Td>
                              <Label color={integration.operatorVersion === 'Up to date' ? 'green' : 'blue'} isCompact>
                                {integration.operatorVersion}
                              </Label>
                            </Td>
                            <Td>{integration.assignedCostModel}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                    <Toolbar>
                      <ToolbarContent>
                        <ToolbarItem variant="pagination">
                          <Pagination
                            itemCount={ocpIntegrations.length}
                            perPage={10}
                            page={1}
                            variant={PaginationVariant.bottom}
                            titles={{
                              paginationAriaLabel: 'Integrations bottom pagination',
                            }}
                            style={{ paddingTop: '0.5rem' }}
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
                  </StackItem>
                </Stack>
              </WizardStep>
          )}

          {/* Step 6: Review details - only for OCP */}
          {wizardIntegration === 'OpenShift Container Platform' && (
            <WizardStep
                name="Review details"
                id="ocp-review-step"
              >
                <Stack hasGutter>
                  <StackItem>
                    <Title headingLevel="h2" size="xl">Review details</Title>
                  </StackItem>

                  <StackItem>
                    <Content>
                      <p>
                        Review and confirm your cost model configuration and assignments. Click <strong>Create</strong> to create the cost model, or <strong>Back</strong> to revise.
                      </p>
                    </Content>
                  </StackItem>

                  <StackItem>
                    <Content>
                      <dl>
                        <dt>Name</dt>
                        <dd>{wizardName}</dd>
                        <dt>Description</dt>
                        <dd>{wizardDescription || ''}</dd>
                        <dt>Currency</dt>
                        <dd>{wizardCurrency}</dd>
                        <dt>Price list</dt>
                        <dd>
                          {ocpPriceListRates.length > 0 && (
                            <Table aria-label="Price list rates table" variant="compact">
                              <Thead>
                                <Tr>
                                  <Th>Metric</Th>
                                  <Th>Description</Th>
                                  <Th>Measurement</Th>
                                  <Th>Calculation type</Th>
                                  <Th>Rate</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {ocpPriceListRates.map((rate, index) => (
                                  <React.Fragment key={index}>
                                    <Tr>
                                      <Td>{rate.metric}</Td>
                                      <Td>{rate.description}</Td>
                                      <Td>{rate.measurement}</Td>
                                      <Td>{rate.calculationType}</Td>
                                      <Td>
                                        <Button
                                          variant="link"
                                          onClick={() => {
                                            const newExpanded = new Set(ocpExpandedRates);
                                            if (ocpExpandedRates.has(index)) {
                                              newExpanded.delete(index);
                                            } else {
                                              newExpanded.add(index);
                                            }
                                            setOcpExpandedRates(newExpanded);
                                          }}
                                        >
                                          Various
                                        </Button>
                                      </Td>
                                    </Tr>
                                    {ocpExpandedRates.has(index) && (
                                      <Tr isExpanded>
                                        <Td colSpan={6}>
                                          <Table variant="compact" borders={false}>
                                            <Thead>
                                              <Tr>
                                                <Th>Tag key</Th>
                                                <Th>Tag value</Th>
                                                <Th>Rate</Th>
                                                <Th>Description</Th>
                                                <Th>Default</Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              {rate.tagValues.map((tv: any, tvIndex: number) => (
                                                <Tr key={tvIndex}>
                                                  <Td>{rate.tagKey}</Td>
                                                  <Td>{tv.value}</Td>
                                                  <Td>${tv.rate}</Td>
                                                  <Td>{tv.description}</Td>
                                                  <Td>{tv.isDefault ? 'Yes' : 'No'}</Td>
                                                </Tr>
                                              ))}
                                            </Tbody>
                                          </Table>
                                        </Td>
                                      </Tr>
                                    )}
                                  </React.Fragment>
                                ))}
                              </Tbody>
                            </Table>
                          )}
                        </dd>
                        <dt>Markup/Discount</dt>
                        <dd>{ocpMarkupDiscount === 'markup' ? '+' : '-'}{ocpMarkupRate} %</dd>
                        <dt>Cost distribution</dt>
                        <dd>Distribute costs based on {ocpDistributionType === 'cpu' ? 'CPU' : 'Memory'} usage</dd>
                        {ocpDistributePlatform && <dd>Distribute platform costs</dd>}
                        {ocpDistributeWorker && <dd>Distribute worker unallocated capacity</dd>}
                        {ocpDistributeNetwork && <dd>Distribute network costs</dd>}
                        {ocpDistributeStorage && <dd>Distribute storage costs</dd>}
                        <dt>Assign integrations</dt>
                        <dd>
                          {wizardSelectedIntegrations.length > 0
                            ? wizardSelectedIntegrations
                                .map((id) => ocpIntegrations.find((i) => i.id === id)?.name)
                                .filter(Boolean)
                                .join(', ')
                            : ''}
                        </dd>
                      </dl>
                    </Content>
                  </StackItem>
                </Stack>
              </WizardStep>
          )}
        </Wizard>
      </Modal>
    </>
  );
};

export { CostManagementSettings };


