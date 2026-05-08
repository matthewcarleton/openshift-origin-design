import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Content,
  Divider,
  Dropdown,
  DropdownList,
  DropdownItem,
  Flex,
  FlexItem,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Label,
  LabelGroup,
  List,
  ListItem,
  MenuToggle,
  Modal,
  PageSection,
  PageSectionVariants,
  SearchInput,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon, TimesIcon, ExternalLinkAltIcon, SearchIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';
import { MigrationGuide } from './MigrationGuide';
// Types moved to local file
type CatalogMode = 'available' | 'installed' | 'v0' | 'v1';
interface InstalledItem {
  id: string;
  name: string;
  namespace?: string;
  version?: string;
  status?: string;
  mode?: CatalogMode;
  description?: string;
  provider?: string;
  type?: string;
  installedAt?: string;
}
import './OperatorHub.css';

type CatalogItem = {
  id: string;
  name: string;
  description: string;
  provider: string;
  tags: string[];
  catalog: string;
  priority?: number;
  status?: string;
  badges?: string[];
  providerType?: 'redhat' | 'community' | 'internal';
  installState?: 'available' | 'installed' | 'preview';
  updateAvailable?: boolean;
  categories?: string[];
  type: string;
  matchingModes: CatalogMode[];
  repositoryUrl?: string;
  ctaLabel?: string;
  documentationUrl?: string;
};

type FacetOption = { id: string; label: string };

const CATEGORY_OPTIONS: FacetOption[] = [
  { id: 'all', label: 'All items' },
  { id: 'ai-ml', label: 'AI/Machine Learning' },
  { id: 'application-runtime', label: 'Application Runtime' },
  { id: 'big-data', label: 'Big Data' },
  { id: 'ci-cd', label: 'CI/CD' },
  { id: 'cloud-provider', label: 'Cloud Provider' },
  { id: 'database', label: 'Databases' },
  { id: 'developer-tools', label: 'Developer Tools' },
  { id: 'integration-delivery', label: 'Integration & Delivery' },
  { id: 'languages', label: 'Languages' },
  { id: 'logging-tracing', label: 'Logging & Tracing' },
  { id: 'middleware', label: 'Middleware' },
  { id: 'modernization', label: 'Modernization & Migration' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'networking', label: 'Networking' },
  { id: 'observability', label: 'Observability' },
  { id: 'openshift-optional', label: 'OpenShift Optional' },
  { id: 'security', label: 'Security' },
  { id: 'storage', label: 'Storage' },
  { id: 'streaming-messaging', label: 'Streaming & Messaging' },
  { id: 'other', label: 'Other' },
];

const CATEGORY_LABEL_MAP = CATEGORY_OPTIONS.reduce<Record<string, string>>((acc, option) => {
  acc[option.id] = option.label;
  return acc;
}, {});

const TYPE_OPTIONS: FacetOption[] = [
  { id: 'builder-images', label: 'Builder images' },
  { id: 'devfiles', label: 'Devfiles' },
  { id: 'helm-charts', label: 'Helm Charts' },
  { id: 'operators', label: 'Operators' },
  { id: 'templates', label: 'Templates' },
];

const TYPE_LABEL_MAP = TYPE_OPTIONS.reduce<Record<string, string>>((acc, option) => {
  acc[option.id] = option.label;
  return acc;
}, {});

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'net-olm-v0',
    name: '.NET',
    description: 'A helm chart to build and deploy .NET applications.',
    provider: 'Provided by Red Hat',
    tags: ['Helm Charts'],
    catalog: 'redhat-operators',
    priority: 100,
    matchingModes: ['v0', 'v1'],
    providerType: 'redhat',
    installState: 'available',
    categories: ['languages', 'application-runtime'],
    type: 'helm-charts',
    repositoryUrl: 'https://github.com/redhat-developer/s2i-dotnetcore',
  },
  {
    id: 'acm-v0',
    name: 'Advanced Cluster Management for Kubernetes',
    description: 'Advanced provisioning and management of OpenShift and Kubernetes clusters.',
    provider: 'Provided by Red Hat',
    tags: ['Red Hat'],
    catalog: 'redhat-operators',
    priority: 100,
    matchingModes: ['v0', 'v1'],
    providerType: 'redhat',
    installState: 'available',
    categories: ['integration-delivery', 'observability'],
    type: 'operators',
    documentationUrl: 'https://access.redhat.com/documentation/en-us/red_hat_advanced_cluster_management_for_kubernetes/',
  },
  {
    id: 'ansible-automation-v1',
    name: 'Ansible Automation Platform',
    description: 'Manage everything automation with declarative ClusterExtensions.',
    provider: 'Provided by Red Hat',
    tags: ['OLMv1'],
    catalog: 'redhat-operators-v1',
    priority: 200,
    badges: ['Least privilege ready'],
    matchingModes: ['v1'],
    providerType: 'redhat',
    installState: 'available',
    categories: ['ci-cd'],
    type: 'operators',
    documentationUrl: 'https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/',
  },
  {
    id: 'apiserver-source-v1',
    name: 'ApiServerSource',
    description: 'Connect Kubernetes events and GitOps workflows via ClusterExtensions.',
    provider: 'Provided by Red Hat',
    tags: ['Event Sources'],
    catalog: 'community-extensions',
    priority: 50,
    badges: ['GitOps friendly'],
    matchingModes: ['v0', 'v1'],
    providerType: 'community',
    installState: 'available',
    categories: ['streaming-messaging'],
    type: 'event-sources',
  },
  {
    id: 'metering-dual',
    name: 'Application Services Metering Operator',
    description: 'Collect usage across Application Services portfolios into a single view.',
    provider: 'Provided by Red Hat',
    tags: ['Community'],
    catalog: 'redhat-operators',
    priority: 100,
    badges: ['Available in both catalogs'],
    matchingModes: ['v0', 'v1'],
    providerType: 'redhat',
    installState: 'installed',
    categories: ['observability'],
    type: 'operators',
  },
  {
    id: 'custom-internal-v1',
    name: 'Internal Cost Insights',
    description: 'Visualize platform spend with curated extensions scoped by service account.',
    provider: 'Provided by Internal',
    tags: ['Internal'],
    catalog: 'internal-secure',
    priority: 10,
    status: 'Tech preview',
    badges: ['Requires review'],
    matchingModes: ['v1'],
    providerType: 'internal',
    installState: 'preview',
    categories: ['other'],
    type: 'operators',
  },
  {
    id: 'serverless-func',
    name: 'Serverless Functions',
    description: 'Deploy event-driven workloads with OLMv1 ClusterExtensions.',
    provider: 'Provided by Red Hat',
    tags: ['Serverless'],
    catalog: 'redhat-operators-v1',
    priority: 180,
    badges: ['OLMv1 first'],
    matchingModes: ['v1'],
    providerType: 'redhat',
    installState: 'available',
    categories: ['application-runtime', 'streaming-messaging'],
    type: 'operators',
  },
  {
    id: 'keda-v1',
    name: 'KEDA Autoscaler',
    description: 'Event driven autoscaling for Kubernetes workloads.',
    provider: 'Provided by Community',
    tags: ['Community'],
    catalog: 'community-extensions',
    priority: 40,
    matchingModes: ['v0', 'v1'],
    providerType: 'community',
    installState: 'available',
    categories: ['modernization'],
    type: 'operators',
  },
  {
    id: 'openshift-data-foundation',
    name: 'OpenShift Data Foundation',
    description: 'Software-defined storage for OpenShift clusters.',
    provider: 'Provided by Red Hat',
    tags: ['Storage'],
    catalog: 'redhat-operators',
    priority: 160,
    matchingModes: ['v0', 'v1'],
    providerType: 'redhat',
    installState: 'installed',
    categories: ['storage'],
    type: 'operators',
  },
  {
    id: 'openshift-gitops',
    name: 'OpenShift GitOps',
    description: 'Manage cluster state declaratively using Argo CD.',
    provider: 'Provided by Red Hat',
    tags: ['GitOps'],
    catalog: 'redhat-operators-v1',
    priority: 190,
    matchingModes: ['v1'],
    providerType: 'redhat',
    installState: 'available',
    categories: ['ci-cd', 'modernization'],
    type: 'operators',
  },
  {
    id: 'nvidia-gpu',
    name: 'NVIDIA GPU Operator',
    description: 'Automate deployment of the NVIDIA software stack for AI workloads.',
    provider: 'Provided by Nvidia',
    tags: ['AI'],
    catalog: 'community-extensions',
    priority: 150,
    matchingModes: ['v0', 'v1'],
    providerType: 'community',
    installState: 'available',
    categories: ['ai-ml'],
    type: 'operators',
  },
];

const UPDATE_IDS = ['acm-v0', 'metering-dual', 'openshift-data-foundation', 'openshift-gitops', 'nvidia-gpu'];

const V1_CATALOG_OPTIONS = [
  { id: 'all', label: 'All catalogs' },
  { id: 'redhat-operators-v1', label: 'Red Hat (ClusterCatalog)' },
  { id: 'community-extensions', label: 'Community extensions' },
  { id: 'internal-secure', label: 'Internal secure registry' },
];

const DEFAULT_CATEGORY = 'all';
const DEFAULT_TYPE = 'operators';
const PROVIDER_OPTIONS: FacetOption[] = [
  { id: 'redhat', label: 'Red Hat' },
  { id: 'community', label: 'Community' },
  { id: 'internal', label: 'Internal' },
];

const STATE_OPTIONS: FacetOption[] = [
  { id: 'available', label: 'Available' },
  { id: 'installed', label: 'Installed' },
  { id: 'preview', label: 'Tech preview' },
];

const MAX_VISIBLE_CATEGORIES = 7;
const CATEGORY_EXPANDED_TEXT = (remaining: number) => `Show ${remaining} more`;
const CATEGORY_COLLAPSED_TEXT = 'Show fewer';

const getInstallBadgeColor = (mode: CatalogMode) => (mode === 'v1' ? 'blue' : 'green');

const isItemInstalledInMode = (items: InstalledItem[], item: CatalogItem, mode: CatalogMode) =>
  items.some((installed) => installed.id === item.id && installed.mode === mode);

const OperatorHub: React.FunctionComponent = () => {
  useDocumentTitle('Software Catalog');
  const navigate = useNavigate();

  const [mode, setMode] = React.useState<CatalogMode>('v1');
  const [search, setSearch] = React.useState('');
  const [selectedCatalog, setSelectedCatalog] = React.useState(V1_CATALOG_OPTIONS[0]);
  const [providerFilters, setProviderFilters] = React.useState<string[]>([]);
  const [stateFilters, setStateFilters] = React.useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState(DEFAULT_CATEGORY);
  const [selectedType, setSelectedType] = React.useState(DEFAULT_TYPE);
  const [isCategoryExpanded, setCategoryExpanded] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<CatalogItem | undefined>();
  const [isInstallOpen, setInstallOpen] = React.useState(false);
  const [installTarget, setInstallTarget] = React.useState<CatalogItem | undefined>();
  const [installedItems, setInstalledItems] = React.useState<InstalledItem[]>([]);
  const [isManageSourcesOpen, setManageSourcesOpen] = React.useState(false);
  const [isAddSourceOpen, setAddSourceOpen] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(true);
  const [updatesBannerDismissed, setUpdatesBannerDismissed] = React.useState(false);
  const [isMigrationGuideOpen, setIsMigrationGuideOpen] = React.useState(false);
  const [navigateToLifecycle, setNavigateToLifecycle] = React.useState(false);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [drawerWidth, setDrawerWidth] = React.useState(35); // percentage of viewport
  const [isResizing, setIsResizing] = React.useState(false);

  // Handle drawer resize
  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      if (newWidth >= 30 && newWidth <= 70) {
        setDrawerWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  React.useEffect(() => {
    if (navigateToLifecycle) {
      navigate('/software/lifecycle');
      setNavigateToLifecycle(false);
    }
  }, [navigateToLifecycle, navigate]);

  const showOllmControls = selectedType === 'operators';

  React.useEffect(() => {
    if (!showOllmControls && mode === 'v0') {
      setMode('v1');
    }
  }, [showOllmControls, mode]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { [DEFAULT_CATEGORY]: CATALOG_ITEMS.length };
    CATEGORY_OPTIONS.filter((option) => option.id !== DEFAULT_CATEGORY).forEach((option) => {
      counts[option.id] = CATALOG_ITEMS.filter((item) => item.categories?.includes(option.id)).length;
    });
    return counts;
  }, []);

  const orderedCategories = React.useMemo(() => {
    const options = CATEGORY_OPTIONS.filter((option) => option.id !== DEFAULT_CATEGORY);
    return isCategoryExpanded ? options : options.slice(0, MAX_VISIBLE_CATEGORIES);
  }, [isCategoryExpanded]);

  const typeCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: CATALOG_ITEMS.length };
    TYPE_OPTIONS.forEach((option) => {
      counts[option.id] = CATALOG_ITEMS.filter((item) => item.type === option.id).length;
    });
    return counts;
  }, []);

  const itemsByFacet = React.useMemo(() =>
    CATALOG_ITEMS.filter((item) => {
      const matchesCategory = categoryFilters.length === 0 || 
        (item.categories && item.categories.some(cat => categoryFilters.includes(cat)));
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesCategory && matchesType;
    }),
  [categoryFilters, selectedType]);

  const itemsForMode = React.useMemo(() => {
    if (!showOllmControls) {
      return itemsByFacet;
    }
    return itemsByFacet.filter((item) => item.matchingModes.includes(mode));
  }, [itemsByFacet, showOllmControls, mode]);

  const filteredItems = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return itemsForMode.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.provider.toLowerCase().includes(normalizedSearch);

      const matchesCatalog =
        !showOllmControls || mode === 'v0' || selectedCatalog.id === 'all' || item.catalog === selectedCatalog.id;

      const matchesProvider =
        providerFilters.length === 0 || (item.providerType && providerFilters.includes(item.providerType));

      const matchesState = stateFilters.length === 0 || (item.installState && stateFilters.includes(item.installState));

      return matchesSearch && matchesCatalog && matchesProvider && matchesState;
    });
  }, [itemsForMode, search, showOllmControls, selectedCatalog, mode, providerFilters, stateFilters]);

  const itemsWithUpdateState = React.useMemo(
    () =>
      filteredItems.map((item) =>
        UPDATE_IDS.includes(item.id)
          ? {
              ...item,
              updateAvailable: true,
              installState: 'installed' as const,
            }
          : item,
      ),
    [filteredItems],
  );

  const displayedItems = itemsWithUpdateState;

  const getInstallStateForMode = React.useMemo(() => {
    const map = new Map<string, CatalogMode[]>();
    installedItems.forEach((item) => {
      if (item.mode) {
        const current = map.get(item.id) ?? [];
        if (!current.includes(item.mode)) {
          current.push(item.mode);
          map.set(item.id, current);
        }
      }
    });
    return map;
  }, [installedItems]);

  const cardPrimaryCtaLabel = (item: CatalogItem) => {
    if (item.updateAvailable || isItemInstalledInMode(installedItems, item, showOllmControls ? mode : 'v1')) {
      return 'Update software';
    }
    return 'Install';
  };

  const handleInstall = (item: CatalogItem) => {
    setInstallTarget(item);
    setInstallOpen(true);
  };

  const handleConfirmInstall = () => {
    if (!installTarget) {
      return;
    }
    const installMode: CatalogMode = showOllmControls ? mode : 'v1';
    const record: InstalledItem = {
      id: installTarget.id,
      mode: installMode,
      name: installTarget.name,
      description: installTarget.description,
      provider: installTarget.provider,
      type: installTarget.type,
      installedAt: new Date().toISOString(),
    };

    setInstalledItems((prev) => {
      const others = prev.filter((item) => item.id !== record.id || item.mode !== record.mode);
      return [...others, record];
    });
    setInstallOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategory(DEFAULT_CATEGORY);
    setSelectedType(DEFAULT_TYPE);
    setCategoryFilters([]);
    setProviderFilters([]);
    setStateFilters([]);
    setSelectedCatalog(V1_CATALOG_OPTIONS[0]);
  };

  const hasFilters =
    selectedCategory !== DEFAULT_CATEGORY ||
    selectedType !== DEFAULT_TYPE ||
    categoryFilters.length > 0 ||
    providerFilters.length > 0 ||
    stateFilters.length > 0 ||
    (showOllmControls && selectedCatalog.id !== V1_CATALOG_OPTIONS[0].id);

  const renderInstallModal = () => (
    <Modal
      title={mode === 'v1' && showOllmControls ? 'Create extension (OLMv1)' : 'Install operator (OLM v0)'}
      isOpen={isInstallOpen && Boolean(installTarget)}
      onClose={() => setInstallOpen(false)}
      variant="medium"
    >
      {installTarget && (
        <Stack hasGutter>
          <StackItem>
            <div className="catalog-install__summary">
              <LabelGroup numLabels={3} collapsedText="Show more" expandedText="Show less">
                <Label variant="outline" isCompact>
                  {TYPE_LABEL_MAP[installTarget.type] ?? installTarget.type}
                </Label>
                {installTarget.categories?.map((categoryId) => (
                  <Label key={`${installTarget.id}-${categoryId}`} variant="outline" isCompact>
                    {CATEGORY_LABEL_MAP[categoryId] ?? categoryId}
                  </Label>
                ))}
              </LabelGroup>
              <Button variant="link" onClick={() => setSelectedItem(installTarget)}>
                View details
              </Button>
            </div>
          </StackItem>
          <StackItem>
            <Title headingLevel="h3" size="lg">
              {installTarget.name}
            </Title>
          </StackItem>
          <StackItem>
            <Title headingLevel="h4" size="md">
              Installation target
              </Title>
            <List isPlain>
              <ListItem>{mode === 'v1' && showOllmControls ? 'ClusterExtension (OLMv1)' : 'Subscription (OLM v0)'}</ListItem>
              <ListItem>Source catalog: {installTarget.catalog}</ListItem>
              <ListItem>Provider: {installTarget.provider}</ListItem>
            </List>
          </StackItem>
          {mode === 'v1' && showOllmControls && (
            <StackItem>
              <Title headingLevel="h4" size="md">
                Service account
              </Title>
              <SearchInput placeholder="Select or create service account" aria-label="Service account" />
            </StackItem>
          )}
          <StackItem>
            <Title headingLevel="h4" size="md">
              Version selection
              </Title>
            <SearchInput placeholder="e.g. >=1.0.0 <2.0.0" aria-label="Version range" />
          </StackItem>
          <StackItem>
            <Button variant="primary" onClick={handleConfirmInstall}>
              Confirm install
                </Button>
          </StackItem>
        </Stack>
      )}
    </Modal>
  );

  return (
    <React.Fragment>
      <div className="software-catalog-page">
        {/* Breadcrumb */}
        <div className="software-catalog-breadcrumb">
          <Breadcrumb>
            <BreadcrumbItem to="#">Ecosystem</BreadcrumbItem>
            <BreadcrumbItem to="#" isActive>Software Catalog</BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <div className="software-catalog-header">
          <Title headingLevel="h1" size="2xl">
            Software Catalog
          </Title>
          <p className="software-catalog-description">
            Add shared applications, services, event sources, or source-to-image builders to your Project from the software catalog. Cluster administrators can customize the content made available in the catalog.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="software-catalog-toolbar">
          <SearchInput
            placeholder="Find by name"
            value={search}
            onChange={(_, value) => setSearch(value)}
            onClear={() => setSearch('')}
            style={{ width: '300px' }}
          />
          <Dropdown
            isOpen={isActionsOpen}
            onSelect={() => setIsActionsOpen(false)}
            onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
            toggle={(toggleRef: React.Ref<any>) => (
              <MenuToggle ref={toggleRef} onClick={() => setIsActionsOpen(!isActionsOpen)} isExpanded={isActionsOpen}>
                Actions
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem onClick={() => setManageSourcesOpen(true)}>Manage catalog sources</DropdownItem>
              <DropdownItem onClick={() => setAddSourceOpen(true)}>Add catalog source</DropdownItem>
            </DropdownList>
          </Dropdown>
        </div>

        {/* Main Content: Sidebar + Content */}
        <div className="software-catalog-main">
          <Sidebar className="catalog-app__sidebar">
            <SidebarPanel variant="sticky">
              <Stack>
                <StackItem className="catalog-facets__catalog-version-section">
                  <div className="catalog-facets__heading-row">
                    <Title headingLevel="h2" size="md" className="catalog-facets__heading">
                      Catalog version
                    </Title>
                    <Tooltip content="Select catalog version">
                      <Button variant="plain" aria-label="Catalog version help" className="pf-u-p-0">
                        <OutlinedQuestionCircleIcon />
                      </Button>
                    </Tooltip>
                  </div>
                  <FormGroup>
                    <FormSelect 
                      value="olmv1" 
                      aria-label="Catalog version"
                    >
                      <FormSelectOption label="Operator Lifecycle Management v1" value="olmv1" />
                      <FormSelectOption label="Operator Lifecycle Management v0" value="olmv0" />
                    </FormSelect>
                  </FormGroup>
                </StackItem>

                <StackItem className="catalog-facets__type-section">
                  <div className="catalog-facets__heading-row">
                    <Title headingLevel="h2" size="md" className="catalog-facets__heading">
                      Type
                    </Title>
                    <Tooltip content="Filter catalog items by delivery format">
                      <Button variant="plain" aria-label="Type filter help" className="pf-u-p-0">
                        <OutlinedQuestionCircleIcon />
                      </Button>
                    </Tooltip>
                  </div>
                  <List isPlain className="catalog-facets__list">
                    {TYPE_OPTIONS.map((option) => (
                      <ListItem key={option.id}>
                        <Button
                          variant="plain"
                          className={`catalog-facets__button ${
                            selectedType === option.id ? 'catalog-facets__button--active' : ''
                          }`}
                          onClick={() => setSelectedType(option.id)}
                        >
                          {option.label} ({typeCounts[option.id] ?? 0})
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </StackItem>

                <Divider />

                <StackItem>
                  <List isPlain className="catalog-facets__list">
                    {orderedCategories.map((option) => (
                      <ListItem key={option.id}>
                        <Checkbox
                          id={`category-${option.id}`}
                          label={option.label}
                          isChecked={categoryFilters.includes(option.id)}
                          onChange={(event, checked) =>
                            setCategoryFilters((prev) =>
                              checked
                                ? [...prev, option.id]
                                : prev.filter((id) => id !== option.id),
                            )
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  {CATEGORY_OPTIONS.length - 1 > MAX_VISIBLE_CATEGORIES && (
                    <Button
                      variant="link"
                      isInline
                      className="catalog-facets__show-more"
                      onClick={() => setCategoryExpanded((prev) => !prev)}
                    >
                      {isCategoryExpanded
                        ? CATEGORY_COLLAPSED_TEXT
                        : CATEGORY_EXPANDED_TEXT(CATEGORY_OPTIONS.length - 1 - MAX_VISIBLE_CATEGORIES)}
                    </Button>
                  )}
                </StackItem>

                <Divider />

                <StackItem>
                  <Title headingLevel="h2" size="md" className="catalog-facets__heading">
                    Provider
                  </Title>
                  <List isPlain className="catalog-facets__list">
                    {PROVIDER_OPTIONS.map((provider) => (
                      <ListItem key={provider.id}>
                        <Checkbox
                          id={`provider-${provider.id}`}
                          label={provider.label}
                          isChecked={providerFilters.includes(provider.id)}
                          onChange={(event, checked) =>
                            setProviderFilters((prev) =>
                              checked
                                ? [...prev, provider.id]
                                : prev.filter((id) => id !== provider.id),
                            )
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </StackItem>

                <Divider />

                <StackItem>
                  <Title headingLevel="h2" size="md" className="catalog-facets__heading">
                    Install state
                </Title>
                  <List isPlain className="catalog-facets__list">
                    {STATE_OPTIONS.map((state) => (
                      <ListItem key={state.id}>
                        <Checkbox
                          id={`state-${state.id}`}
                          label={state.label}
                          isChecked={stateFilters.includes(state.id)}
                          onChange={(event, checked) =>
                            setStateFilters((prev) =>
                              checked
                                ? [...prev, state.id]
                                : prev.filter((id) => id !== state.id),
                            )
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </StackItem>

                <StackItem>
                  <Switch
                    id="toggle-installed"
                    label="Show installed only"
                    isChecked={stateFilters.includes('installed')}
                    onChange={(event, isChecked) =>
                      setStateFilters((prev) => {
                        if (isChecked) {
                          return prev.includes('installed') ? prev : [...prev, 'installed'];
                        }
                        return prev.filter((id) => id !== 'installed');
                      })
                    }
                  />
                </StackItem>

                {hasFilters && (
                  <StackItem>
                    <Button variant="link" onClick={resetFilters}>
                      Clear filters
                    </Button>
                  </StackItem>
                )}
              </Stack>
            </SidebarPanel>

            <SidebarContent>
              {displayedItems.length === 0 ? (
                <Bullseye className="pf-u-p-xl">
                  <Stack hasGutter>
                    <StackItem>
                      <div className="catalog-empty__icon">
                        <SearchIcon />
                      </div>
                    </StackItem>
                    <StackItem>
                      <Title headingLevel="h3" size="lg">
                        No software found
                      </Title>
                    </StackItem>
                    <StackItem>
                      <p>Adjust your search or filter criteria to find software.</p>
                    </StackItem>
                  </Stack>
                </Bullseye>
              ) : (
                <div className="catalog-grid">
                  {displayedItems.map((item) => {
                    const catalogLabel = item.catalog === 'marketplace' ? 'Marketplace' : 
                                       item.catalog === 'community-extensions' ? 'Community' : 
                                       'Red Hat';
                    const labelColor = item.catalog === 'marketplace' ? 'blue' : 
                                      item.catalog === 'community-extensions' ? 'orange' : 
                                      'red';
                    
                    return (
                      <Card 
                        key={item.id}
                        isClickable 
                        isSelectable 
                        className="catalog-card"
                        onClick={() => setSelectedItem(item)}
                      >
                        <CardHeader className="catalog-card__header">
                          <div className="catalog-card__icon">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                              <rect width="40" height="40" rx="4" fill="#0066CC" fillOpacity="0.1"/>
                              <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#0066CC"/>
                            </svg>
                          </div>
                          <div className="catalog-card__label">
                            <Label color={labelColor} isCompact>
                              {catalogLabel}
                            </Label>
                          </div>
                        </CardHeader>
                        <CardBody className="catalog-card__body">
                          <Title headingLevel="h3" size="md" className="catalog-card__title">
                            {item.name}
                          </Title>
                          <div className="catalog-card__provider">
                            Provided by {item.provider}
                          </div>
                          <p className="catalog-card__description">{item.description}</p>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              )}
            </SidebarContent>
          </Sidebar>
        </div>
      </div>

      {renderInstallModal()}

      <Modal
        title="Manage catalog sources"
        isOpen={isManageSourcesOpen}
        onClose={() => setManageSourcesOpen(false)}
        variant="medium"
      >
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h3" size="md">
              Existing sources
            </Title>
          </StackItem>
          <StackItem>
            <List isPlain>
              {V1_CATALOG_OPTIONS.filter((option) => option.id !== 'all').map((option) => (
                <ListItem key={option.id}>{option.label}</ListItem>
              ))}
            </List>
          </StackItem>
          <StackItem>
            <Button variant="secondary" onClick={() => setAddSourceOpen(true)}>
              Add catalog source
            </Button>
          </StackItem>
        </Stack>
      </Modal>

      <Modal title="Add catalog source" isOpen={isAddSourceOpen} onClose={() => setAddSourceOpen(false)} variant="medium">
        <Stack hasGutter>
          <StackItem>
            <SearchInput placeholder="Catalog name" aria-label="Catalog name" />
          </StackItem>
          <StackItem>
            <SearchInput placeholder="Image reference" aria-label="Catalog image" />
          </StackItem>
          <StackItem>
            <Button variant="primary" onClick={() => setAddSourceOpen(false)}>
              Save catalog source
            </Button>
          </StackItem>
        </Stack>
      </Modal>

      <MigrationGuide isOpen={isMigrationGuideOpen} onClose={() => setIsMigrationGuideOpen(false)} />

      {/* Operator Details Drawer - Rendered via Portal */}
      {selectedItem && ReactDOM.createPortal(
        <div 
          style={{
            position: 'fixed',
            top: '73px',
            right: 0,
            bottom: 0,
            left: 'auto',
            width: `${drawerWidth}vw`,
            backgroundColor: '#ffffff',
            borderLeft: '1px solid #d2d2d2',
            boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
          }}
        >
          {/* Resize Handle */}
          <div
            onMouseDown={() => setIsResizing(true)}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '12px',
              cursor: 'col-resize',
              backgroundColor: 'transparent',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
            }}
            onMouseLeave={(e) => {
              if (!isResizing) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {/* Visual drag indicator - three vertical dots */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              opacity: 0.4,
            }}>
              <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#6a6e73' }} />
              <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#6a6e73' }} />
              <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#6a6e73' }} />
            </div>
          </div>

          {/* Header */}
          <div style={{ padding: '24px', paddingLeft: '36px', borderBottom: '1px solid #e0e0e0' }}>
            <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
              <FlexItem>
                <Title headingLevel="h2" size="xl">{selectedItem.name}</Title>
              </FlexItem>
              <FlexItem>
                <Button variant="plain" onClick={() => setSelectedItem(undefined)}>
                  <TimesIcon />
                </Button>
              </FlexItem>
            </Flex>
            <div style={{ color: '#6a6e73', fontSize: '14px', marginTop: '8px' }}>
              Provided by {selectedItem.provider}
            </div>
            <div style={{ marginTop: '16px' }}>
              <Button variant="primary">Install</Button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingLeft: '36px' }}>
            <Flex>
              <FlexItem style={{ width: '200px', marginRight: '32px' }}>
                <Stack hasGutter>
                  <StackItem>
                    <FormGroup label="Channel" isRequired>
                      <FormSelect aria-label="Channel">
                        <FormSelectOption label="stable" value="stable" />
                      </FormSelect>
                    </FormGroup>
                  </StackItem>
                  <StackItem>
                    <FormGroup label="Version" isRequired>
                      <FormSelect aria-label="Version">
                        <FormSelectOption label="v4.12.0" value="v4.12.0" />
                      </FormSelect>
                    </FormGroup>
                  </StackItem>
                  <StackItem>
                    <FormGroup label="OLM version" isRequired>
                      <FormSelect aria-label="OLM version">
                        <FormSelectOption label="OLM v0" value="v0" />
                      </FormSelect>
                    </FormGroup>
                  </StackItem>
                </Stack>
              </FlexItem>
              <FlexItem flex={{ default: 'flex_1' }}>
                <Stack hasGutter>
                  {selectedItem.catalog === 'marketplace' && (
                    <StackItem>
                      <Alert variant="info" isInline title={<>This is a <strong>Marketplace Operator</strong></>}>
                        <p>Purchase required for use. Purchase a subscription from <a href="#">Red Hat Marketplace</a>.</p>
                      </Alert>
                    </StackItem>
                  )}
                  <StackItem>
                    <Title headingLevel="h3" size="md">Description</Title>
                    <div style={{ marginTop: '8px' }}>{selectedItem.description}</div>
                  </StackItem>
                  <StackItem>
                    <Title headingLevel="h3" size="md">Related software</Title>
                    <List>
                      <ListItem><a href="#">OpenShift Logging</a></ListItem>
                      <ListItem><a href="#">OpenShift Monitoring</a></ListItem>
                    </List>
                  </StackItem>
                </Stack>
              </FlexItem>
            </Flex>
          </div>
        </div>,
        document.body
      )}
    </React.Fragment>
  );
};

export { OperatorHub };