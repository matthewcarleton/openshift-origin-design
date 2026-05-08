import * as React from 'react';
import {
  PageSection,
  Title,
  TreeView,
  TreeViewDataItem,
  Breadcrumb,
  BreadcrumbItem,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Content,
} from '@patternfly/react-core';
import { CubeIcon, CubesIcon, ProjectDiagramIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { useNavigate } from 'react-router-dom';

const Inventory: React.FunctionComponent = () => {
  useDocumentTitle('ACM | Inventory');
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [activeItems, setActiveItems] = React.useState<TreeViewDataItem[]>([]);
  const [allExpanded, setAllExpanded] = React.useState(false);

  // Mock inventory data based on user's specification
  const inventoryData: TreeViewDataItem[] = [
    {
      name: 'petemobile-na-prod',
      id: 'clusterset-1',
      icon: <ProjectDiagramIcon />,
      defaultExpanded: false,
      children: [
        {
          name: 'Us-west-prod-01',
          id: 'cluster-1-1',
          icon: <CubesIcon />,
          children: [
            {
              name: 'core-ntwk',
              id: 'ns-1-1-1',
              icon: <CubeIcon />,
            },
            {
              name: '5g-api-prod',
              id: 'ns-1-1-2',
              icon: <CubeIcon />,
            },
            {
              name: 'data-analytics',
              id: 'ns-1-1-3',
              icon: <CubeIcon />,
            },
          ],
        },
        {
          name: 'Us-east-prod-02',
          id: 'cluster-1-2',
          icon: <CubesIcon />,
          children: [
            {
              name: 'core-billing',
              id: 'ns-1-2-1',
              icon: <CubeIcon />,
            },
            {
              name: 'Security-ops',
              id: 'ns-1-2-2',
              icon: <CubeIcon />,
            },
            {
              name: 'Log-viewer',
              id: 'ns-1-2-3',
              icon: <CubeIcon />,
            },
          ],
        },
        {
          name: 'Na-edge-ny-01',
          id: 'cluster-1-3',
          icon: <CubesIcon />,
          children: [
            {
              name: 'edge-core-app',
              id: 'ns-1-3-1',
              icon: <CubeIcon />,
            },
            {
              name: 'Location-services',
              id: 'ns-1-3-2',
              icon: <CubeIcon />,
            },
          ],
        },
      ],
    },
    {
      name: 'petemobile-eu-prod',
      id: 'clusterset-2',
      icon: <ProjectDiagramIcon />,
      defaultExpanded: false,
      children: [
        {
          name: 'Eu-west-prod-01',
          id: 'cluster-2-1',
          icon: <CubesIcon />,
          children: [
            {
              name: 'core-ntwk',
              id: 'ns-2-1-1',
              icon: <CubeIcon />,
            },
            {
              name: 'eu-5g-api',
              id: 'ns-2-1-2',
              icon: <CubeIcon />,
            },
            {
              name: 'Data-analytics',
              id: 'ns-2-1-3',
              icon: <CubeIcon />,
            },
          ],
        },
        {
          name: 'Eu-east-prod-02',
          id: 'cluster-2-2',
          icon: <CubesIcon />,
          children: [
            {
              name: 'core-billing',
              id: 'ns-2-2-1',
              icon: <CubeIcon />,
            },
            {
              name: 'Security-ops',
              id: 'ns-2-2-2',
              icon: <CubeIcon />,
            },
            {
              name: 'Log-viewer',
              id: 'ns-2-2-3',
              icon: <CubeIcon />,
            },
          ],
        },
        {
          name: 'Eu-edge-berlin-01',
          id: 'cluster-2-3',
          icon: <CubesIcon />,
          children: [
            {
              name: 'edge-core-app',
              id: 'ns-2-3-1',
              icon: <CubeIcon />,
            },
            {
              name: 'Location-services',
              id: 'ns-2-3-2',
              icon: <CubeIcon />,
            },
          ],
        },
      ],
    },
    {
      name: 'petemobile-dev-clusters',
      id: 'clusterset-3',
      icon: <ProjectDiagramIcon />,
      defaultExpanded: false,
      children: [
        {
          name: 'Dev-team-a-cluster',
          id: 'cluster-3-1',
          icon: <CubesIcon />,
          children: [
            {
              name: 'Project-starlight-dev',
              id: 'ns-3-1-1',
              icon: <CubeIcon />,
            },
            {
              name: 'project-starfleet-dev',
              id: 'ns-3-1-2',
              icon: <CubeIcon />,
            },
            {
              name: 'project-pegasus-dev',
              id: 'ns-3-1-3',
              icon: <CubeIcon />,
            },
          ],
        },
        {
          name: 'Dev-team-b-cluster',
          id: 'cluster-3-2',
          icon: <CubesIcon />,
          children: [
            {
              name: 'project-starlight-dev',
              id: 'ns-3-2-1',
              icon: <CubeIcon />,
            },
            {
              name: 'project-quasar-dev',
              id: 'ns-3-2-2',
              icon: <CubeIcon />,
            },
            {
              name: 'project-falcon-dev',
              id: 'ns-3-2-3',
              icon: <CubeIcon />,
            },
          ],
        },
        {
          name: 'Qa-env-cluster',
          id: 'cluster-3-3',
          icon: <CubesIcon />,
          children: [
            {
              name: 'qa-testing-ns',
              id: 'ns-3-3-1',
              icon: <CubeIcon />,
            },
            {
              name: 'qa-performance-ns',
              id: 'ns-3-3-2',
              icon: <CubeIcon />,
            },
          ],
        },
      ],
    },
  ];

  const filterTreeData = (items: TreeViewDataItem[], searchTerm: string): TreeViewDataItem[] => {
    if (!searchTerm) return items;

    const results: TreeViewDataItem[] = [];
    
    for (const item of items) {
      const itemName = typeof item.name === 'string' ? item.name : String(item.name);
      const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const filteredChildren = item.children ? filterTreeData(item.children, searchTerm) : undefined;

      if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
        results.push({
          ...item,
          children: filteredChildren,
          defaultExpanded: true,
        });
      }
    }
    
    return results;
  };

  const filteredData = filterTreeData(inventoryData, searchValue);

  const onSelect = (_evt: React.MouseEvent, item: TreeViewDataItem) => {
    setActiveItems([item]);
  };

  return (
    <PageSection>
      <Breadcrumb className="pf-v6-u-mb-md">
        <BreadcrumbItem
          to="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/infrastructure');
          }}
        >
          Infrastructure
        </BreadcrumbItem>
        <BreadcrumbItem isActive>Inventory</BreadcrumbItem>
      </Breadcrumb>

      <Title headingLevel="h1" size="lg" className="pf-v6-u-mb-md">
        Inventory
      </Title>

      <Content component="p" className="pf-v6-u-mb-md">
        Browse your infrastructure resources organized by cluster sets, clusters, and namespaces. Use the tree view to
        explore the hierarchy and search to quickly find specific resources.
      </Content>

      <Toolbar className="pf-v6-u-mb-md">
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              placeholder="Search inventory"
              value={searchValue}
              onChange={(_event, value) => setSearchValue(value)}
              onClear={() => setSearchValue('')}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <div style={{ maxWidth: '800px' }}>
        <TreeView
          data={filteredData}
          activeItems={activeItems}
          onSelect={onSelect}
          allExpanded={allExpanded || !!searchValue}
          hasGuides
        />
      </div>

      <div className="pf-v6-u-mt-md">
        <Content component="p" style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
          <strong>Legend:</strong>{' '}
          <ProjectDiagramIcon className="pf-v6-u-ml-sm pf-v6-u-mr-xs" /> Cluster Sets |{' '}
          <CubesIcon className="pf-v6-u-ml-sm pf-v6-u-mr-xs" /> Clusters |{' '}
          <CubeIcon className="pf-v6-u-ml-sm pf-v6-u-mr-xs" /> Namespaces
        </Content>
      </div>
    </PageSection>
  );
};

export { Inventory };
