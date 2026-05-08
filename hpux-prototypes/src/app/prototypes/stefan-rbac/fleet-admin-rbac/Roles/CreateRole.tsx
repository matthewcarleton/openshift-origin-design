import * as React from 'react';
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Checkbox,
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Grid,
  GridItem,
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  Split,
  SplitItem,
  Content,
  Drawer,
  DrawerPanelContent,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  SearchInput,
  ToggleGroup,
  ToggleGroupItem,
  Label,
  Divider,
  Modal,
  ModalVariant,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ExpandableSection,
  Radio,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { PlusCircleIcon, MinusCircleIcon, DownloadIcon } from '@patternfly/react-icons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDocumentTitle } from '@app/shared/utils/useDocumentTitle';

interface PermissionRule {
  id: number;
  apiGroups: string;
  resources: string;
  verbs: string[];
}

const CreateRole: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roleName: roleNameParam } = useParams<{ roleName: string }>();
  
  // Determine if we're in edit mode
  const isEditMode = location.pathname.includes('/edit/');
  const roleData = location.state?.roleData;
  
  useDocumentTitle(isEditMode ? 'ACM RBAC | Edit Custom Role' : 'ACM RBAC | Create Custom Role');
  
  const [roleName, setRoleName] = React.useState(isEditMode && roleData ? roleData.name : 'my-custom-role');
  const [description, setDescription] = React.useState(isEditMode && roleData ? roleData.description || '' : '');
  const [category, setCategory] = React.useState(isEditMode && roleData ? roleData.category || '' : '');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = React.useState(false);
  const [labels, setLabels] = React.useState<Array<{ id: number; key: string; value: string }>>([]);
  const [permissionRules, setPermissionRules] = React.useState<PermissionRule[]>([
    { id: 1, apiGroups: '', resources: '', verbs: ['get'] },
  ]);
  const [expandedRules, setExpandedRules] = React.useState<Record<number, boolean>>({ 1: true });
  const [yamlCode, setYamlCode] = React.useState('');
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerType, setDrawerType] = React.useState<'apiGroups' | 'resources'>('resources');
  const [activeRuleId, setActiveRuleId] = React.useState<number | null>(null);
  const [catalogSearch, setCatalogSearch] = React.useState('');
  const [catalogFilter, setCatalogFilter] = React.useState<'All' | 'Core' | 'KubeVirt' | 'Networking' | 'Storage'>('All');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [templateSearch, setTemplateSearch] = React.useState('');
  
  // Navigation access control - perspectives and their pages
  interface PerspectiveAccess {
    mode: 'full' | 'none' | 'partial';
    pages: Record<string, boolean>;
  }

  const [navigationAccess, setNavigationAccess] = React.useState<Record<string, PerspectiveAccess>>({
    'Fleet Management': {
      mode: 'full',
      pages: {
        'Overview': true,
        'Clusters': true,
        'Automation': true,
        'Host inventory': true,
        'Identities': true,
        'Identity providers': true,
        'Roles': true,
      }
    },
    'Fleet Virtualization': {
      mode: 'full',
      pages: {
        'Overview': true,
        'Catalog': true,
        'Virtual machines': true,
        'Virtual machine templates': true,
        'Disks': true,
        'Network interfaces': true,
        'Snapshots': true,
        'Migrations': true,
        'Events': true,
      }
    },
    'Core Platforms': {
      mode: 'full',
      pages: {
        'Overview': true,
        'Projects': true,
        'Workloads': true,
        'Networking': true,
        'Storage': true,
        'Builds': true,
        'Pipelines': true,
        'Identities': true,
        'Identity providers': true,
        'Roles': true,
      }
    },
  });

  // State for perspective dropdown toggles
  const [perspectiveDropdowns, setPerspectiveDropdowns] = React.useState<Record<string, boolean>>({});

  // Available categories from existing roles
  const existingCategories = [
    'Virtualization',
    'OpenShift Cluster Management',
    'OpenShift Namespace Management',
    'Application Management',
    'OpenShift',
  ];

  const handleSelectAllPages = (perspective: string, selectAll: boolean) => {
    const access = navigationAccess[perspective];
    const updatedPages = Object.keys(access.pages).reduce((acc, page) => {
      acc[page] = selectAll;
      return acc;
    }, {} as Record<string, boolean>);
    
    setNavigationAccess({
      ...navigationAccess,
      [perspective]: {
        ...access,
        pages: updatedPages
      }
    });
  };

  // Grouped verbs for better UX
  const verbGroups = [
    {
      category: 'Read Operations',
      description: 'View and monitor resources',
      verbs: [
        { name: 'get', label: 'Get', description: 'Read individual resources' },
        { name: 'list', label: 'List', description: 'List multiple resources' },
        { name: 'watch', label: 'Watch', description: 'Watch for resource changes' },
      ]
    },
    {
      category: 'Write Operations',
      description: 'Create and modify resources',
      verbs: [
        { name: 'create', label: 'Create', description: 'Create new resources' },
        { name: 'update', label: 'Update', description: 'Update existing resources' },
        { name: 'patch', label: 'Patch', description: 'Partially update resources' },
      ]
    },
    {
      category: 'Delete Operations',
      description: 'Remove resources',
      verbs: [
        { name: 'delete', label: 'Delete', description: 'Delete individual resources' },
        { name: 'deletecollection', label: 'Delete Collection', description: 'Delete multiple resources at once' },
      ]
    },
    {
      category: 'Advanced Operations',
      description: 'Special permissions (use with caution)',
      verbs: [
        { name: 'bind', label: 'Bind', description: 'Bind roles to users or groups' },
        { name: 'escalate', label: 'Escalate', description: 'Grant permissions above current role' },
        { name: 'impersonate', label: 'Impersonate', description: 'Impersonate another user' },
        { name: 'use', label: 'Use', description: 'Use named resources (e.g., SecurityContextConstraints)' },
        { name: 'approve', label: 'Approve', description: 'Approve certificate signing requests' },
        { name: '*', label: 'All (*)', description: 'All operations (admin level)' },
      ]
    },
  ];

  const roleTemplates = [
    {
      name: 'Virtual Machine Operator',
      category: 'Virtual Machine Management',
      description: 'Manage virtual machines including create, delete, start, stop operations',
    },
    {
      name: 'Virtual Machine Viewer',
      category: 'Virtual Machine Management',
      description: 'Read-only access to virtual machines and related resources',
    },
    {
      name: 'Storage Administrator',
      category: 'Storage Management',
      description: 'Manage storage resources for virtualization workloads',
    },
    {
      name: 'Network Administrator',
      category: 'Network Management',
      description: 'Configure networking for virtual machines',
    },
    {
      name: 'Namespace Admin',
      category: 'Administration',
      description: 'Full control within a single namespace for day-to-day administration',
    },
    {
      name: 'Application Developer',
      category: 'Workloads',
      description: 'Create and manage workloads in a namespace without elevated cluster permissions',
    },
    {
      name: 'Namespace Viewer',
      category: 'Observability',
      description: 'Read-only access to common resources within a namespace',
    },
    {
      name: 'Security Auditor',
      category: 'Security',
      description: 'Audit-focused read-only role across RBAC and workloads',
    },
  ];

  const catalogApiGroups = [
    { name: '', description: 'Core Kubernetes APIs (pods, services, etc.)', category: 'Core' },
    { name: 'apps', description: 'Deployments, StatefulSets, DaemonSets', category: 'Core' },
    { name: 'batch', description: 'Jobs and CronJobs', category: 'Core' },
    { name: 'kubevirt.io', description: 'KubeVirt virtualization APIs', category: 'KubeVirt' },
    { name: 'cdi.kubevirt.io', description: 'Containerized Data Importer', category: 'KubeVirt' },
    { name: 'instancetype.kubevirt.io', description: 'VM instance types', category: 'KubeVirt' },
    { name: 'networking.k8s.io', description: 'Network policies and ingress', category: 'Networking' },
    { name: 'k8s.cni.cncf.io', description: 'Network attachment definitions', category: 'Networking' },
    { name: 'storage.k8s.io', description: 'Storage classes and volume attachments', category: 'Storage' },
    { name: 'snapshot.storage.k8s.io', description: 'Volume snapshots', category: 'Storage' },
    { name: 'rbac.authorization.k8s.io', description: 'Roles and role bindings', category: 'Core' },
  ];

  const catalogResources = [
    { name: 'pods', description: 'Basic compute units', category: 'Core' },
    { name: 'services', description: 'Network services', category: 'Core' },
    { name: 'persistentvolumeclaims', description: 'Storage claims', category: 'Storage' },
    { name: 'secrets', description: 'Sensitive data', category: 'Core' },
    { name: 'configmaps', description: 'Configuration data', category: 'Core' },
    { name: 'virtualmachines', description: 'Virtual machine definitions', category: 'KubeVirt' },
    { name: 'virtualmachineinstances', description: 'Running VM instances', category: 'KubeVirt' },
    { name: 'virtualmachineinstancepresets', description: 'VM template presets', category: 'KubeVirt' },
    { name: 'datavolumes', description: 'Data volume imports', category: 'KubeVirt' },
    { name: 'datasources', description: 'Data sources for VMs', category: 'KubeVirt' },
    { name: 'network-attachment-definitions', description: 'Network attachment definitions', category: 'Networking' },
  ];

  const filteredTemplates = roleTemplates.filter(template =>
    template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
    template.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
    template.category.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const filteredCatalogApiGroups = catalogApiGroups.filter(apiGroup => {
    const matchesSearch = apiGroup.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                         apiGroup.description.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesFilter = catalogFilter === 'All' || apiGroup.category === catalogFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredCatalogResources = catalogResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                         resource.description.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesFilter = catalogFilter === 'All' || resource.category === catalogFilter;
    return matchesSearch && matchesFilter;
  });

  const groupedApiGroups = filteredCatalogApiGroups.reduce((acc, apiGroup) => {
    if (!acc[apiGroup.category]) {
      acc[apiGroup.category] = [];
    }
    acc[apiGroup.category].push(apiGroup);
    return acc;
  }, {} as Record<string, typeof catalogApiGroups>);

  const groupedResources = filteredCatalogResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof catalogResources>);

  const handleAddRule = () => {
    const newRule: PermissionRule = {
      id: Date.now(),
      apiGroups: '',
      resources: '',
      verbs: [],
    };
    setPermissionRules([...permissionRules, newRule]);
    setExpandedRules({ ...expandedRules, [newRule.id]: true });
  };

  const handleRemoveRule = (ruleId: number) => {
    setPermissionRules(permissionRules.filter(rule => rule.id !== ruleId));
    const newExpandedRules = { ...expandedRules };
    delete newExpandedRules[ruleId];
    setExpandedRules(newExpandedRules);
  };

  const toggleRuleExpansion = (ruleId: number) => {
    setExpandedRules({
      ...expandedRules,
      [ruleId]: !expandedRules[ruleId]
    });
  };

  const handleCopyYAML = () => {
    const yaml = generateYAML();
    navigator.clipboard.writeText(yaml);
  };

  const handleDownloadYAML = () => {
    const yaml = generateYAML();
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roleName || 'role'}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Update YAML code whenever form changes
  React.useEffect(() => {
    setYamlCode(generateYAML());
  }, [roleName, description, permissionRules, navigationAccess]);

  const handleRuleChange = (ruleId: number, field: keyof PermissionRule, value: any) => {
    setPermissionRules(permissionRules.map(rule => 
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    ));
  };

  const handleVerbToggle = (ruleId: number, verb: string, isChecked: boolean) => {
    setPermissionRules(permissionRules.map(rule => {
      if (rule.id === ruleId) {
        const newVerbs = isChecked
          ? [...rule.verbs, verb]
          : rule.verbs.filter(v => v !== verb);
        return { ...rule, verbs: newVerbs };
      }
      return rule;
    }));
  };

  const handleVerbGroupToggle = (ruleId: number, groupVerbs: string[], isChecked: boolean) => {
    setPermissionRules(permissionRules.map(rule => {
      if (rule.id === ruleId) {
        let verbs: string[];
        if (isChecked) {
          // Add all verbs from the group that aren't already selected
          verbs = Array.from(new Set([...rule.verbs, ...groupVerbs]));
        } else {
          // Remove all verbs from the group
          verbs = rule.verbs.filter(v => !groupVerbs.includes(v));
        }
        return { ...rule, verbs };
      }
      return rule;
    }));
  };

  const handleAddLabel = () => {
    const newId = labels.length > 0 ? Math.max(...labels.map(l => l.id)) + 1 : 1;
    setLabels([...labels, { id: newId, key: '', value: '' }]);
  };

  const handleLabelChange = (id: number, field: 'key' | 'value', value: string) => {
    setLabels(labels.map(label => 
      label.id === id ? { ...label, [field]: value } : label
    ));
  };

  const handleRemoveLabel = (id: number) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  const generateYAML = () => {
    const rules = permissionRules.map(rule => ({
      apiGroups: rule.apiGroups ? rule.apiGroups.split(',').map(g => g.trim()) : ['*'],
      resources: rule.resources ? rule.resources.split(',').map(r => r.trim()) : ['*'],
      verbs: rule.verbs.length > 0 ? rule.verbs : ['get'],
    }));

    const navigationAccessAnnotations = Object.entries(navigationAccess)
      .flatMap(([perspective, access]) => {
        const perspectiveKey = perspective.toLowerCase().replace(/\s+/g, '-');
        if (access.mode === 'full') {
          return [`    acm.io/nav-${perspectiveKey}: "bundle"`];
        } else if (access.mode === 'partial') {
          const enabledPages = Object.entries(access.pages)
            .filter(([_, enabled]) => enabled)
            .map(([page, _]) => page);
          return [`    acm.io/nav-${perspectiveKey}: "${enabledPages.join(',')}"`];
        } else {
          // mode === 'none', so don't add this perspective
          return [];
        }
      })
      .join('\n');

    return `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ${roleName || 'unnamed-role'}${description ? `
  annotations:
    description: "${description}"
${navigationAccessAnnotations}` : `
  annotations:
${navigationAccessAnnotations}`}
rules:
${rules.map(rule => `- apiGroups:
${rule.apiGroups.map(g => `  - "${g}"`).join('\n')}
  resources:
${rule.resources.map(r => `  - "${r}"`).join('\n')}
  verbs:
${rule.verbs.map(v => `  - "${v}"`).join('\n')}`).join('\n')}`;
  };

  const handleCreateRole = () => {
    console.log('Creating role:', {
      name: roleName,
      description,
      rules: permissionRules,
      navigationAccess,
    });
    navigate('/user-management/roles');
  };

  const handleCancel = () => {
    navigate('/user-management/roles');
  };

  const handleOpenDrawer = (ruleId: number, type: 'apiGroups' | 'resources') => {
    // If opening a different drawer type, reset search
    if (isDrawerOpen && drawerType !== type) {
      setCatalogSearch('');
      setCatalogFilter('All');
    }
    setActiveRuleId(ruleId);
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  const handleAddApiGroupFromCatalog = (apiGroupName: string) => {
    if (activeRuleId !== null) {
      setPermissionRules(permissionRules.map(rule => {
        if (rule.id === activeRuleId) {
          const currentApiGroups = rule.apiGroups ? rule.apiGroups.split(',').map(g => g.trim()).filter(g => g) : [];
          if (!currentApiGroups.includes(apiGroupName)) {
            return { ...rule, apiGroups: [...currentApiGroups, apiGroupName].join(', ') };
          }
        }
        return rule;
      }));
    }
  };

  const handleAddResourceFromCatalog = (resourceName: string) => {
    if (activeRuleId !== null) {
      setPermissionRules(permissionRules.map(rule => {
        if (rule.id === activeRuleId) {
          const currentResources = rule.resources ? rule.resources.split(',').map(r => r.trim()).filter(r => r) : [];
          if (!currentResources.includes(resourceName)) {
            return { ...rule, resources: [...currentResources, resourceName].join(', ') };
          }
        }
        return rule;
      }));
    }
  };

  const handleUseTemplate = (templateName: string) => {
    console.log('Using template:', templateName);
    // Here you would load the template configuration
    setIsTemplateModalOpen(false);
  };

  const drawerPanelContent = (
    <DrawerPanelContent style={{ minWidth: '500px' }}>
      <DrawerHead>
        <Title headingLevel="h2" size="xl">
          {drawerType === 'apiGroups' ? 'Browse API Groups' : 'Browse Resources'}
        </Title>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setIsDrawerOpen(false)} />
        </DrawerActions>
      </DrawerHead>
      <div style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
        <SearchInput
          placeholder={drawerType === 'apiGroups' ? 'Search API groups...' : 'Search resources...'}
          value={catalogSearch}
          onChange={(_event, value) => setCatalogSearch(value)}
          onClear={() => setCatalogSearch('')}
          style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
        />
        
        <Content component="p" className="pf-v6-u-font-size-sm pf-v6-u-color-200" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
          Filter by category
        </Content>
        
        <ToggleGroup aria-label="Resource category filter" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
          <ToggleGroupItem
            text="All"
            buttonId="filter-all"
            isSelected={catalogFilter === 'All'}
            onChange={() => setCatalogFilter('All')}
          />
          <ToggleGroupItem
            text="Core"
            buttonId="filter-core"
            isSelected={catalogFilter === 'Core'}
            onChange={() => setCatalogFilter('Core')}
          />
          <ToggleGroupItem
            text="KubeVirt"
            buttonId="filter-kubevirt"
            isSelected={catalogFilter === 'KubeVirt'}
            onChange={() => setCatalogFilter('KubeVirt')}
          />
          <ToggleGroupItem
            text="Networking"
            buttonId="filter-networking"
            isSelected={catalogFilter === 'Networking'}
            onChange={() => setCatalogFilter('Networking')}
          />
          <ToggleGroupItem
            text="Storage"
            buttonId="filter-storage"
            isSelected={catalogFilter === 'Storage'}
            onChange={() => setCatalogFilter('Storage')}
          />
        </ToggleGroup>

        {drawerType === 'apiGroups' ? (
          Object.entries(groupedApiGroups).map(([category, apiGroups]) => (
            <div key={category} style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
              <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                {category}
              </Title>
              {apiGroups.map((apiGroup) => (
                <div 
                  key={apiGroup.name || 'core'} 
                  style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>
                      {apiGroup.name || '""'} <span style={{ fontWeight: 'normal', fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>(empty string)</span>
                    </div>
                    <Content component="small" className="pf-v6-u-color-200">
                      {apiGroup.description}
                    </Content>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleAddApiGroupFromCatalog(apiGroup.name)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ))
        ) : (
          Object.entries(groupedResources).map(([category, resources]) => (
            <div key={category} style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
              <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                {category}
              </Title>
              {resources.map((resource) => (
                <div 
                  key={resource.name} 
                  style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>
                      {resource.name}
                    </div>
                    <Content component="small" className="pf-v6-u-color-200">
                      {resource.description}
                    </Content>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleAddResourceFromCatalog(resource.name)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </DrawerPanelContent>
  );

  return (
    <>
      <Modal
        variant={ModalVariant.large}
        title="Select templates"
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      >
        <div style={{ padding: '16px 16px 0 16px' }}>
          <SearchInput
            placeholder="Search by name, description, or category"
            value={templateSearch}
            onChange={(_event, value) => setTemplateSearch(value)}
            onClear={() => setTemplateSearch('')}
            style={{ maxWidth: '500px' }}
          />
        </div>
        <Table aria-label="Role templates table" variant="compact">
          <Thead>
            <Tr>
              <Th width={25}>Name</Th>
              <Th width={20}>Category</Th>
              <Th width={40}>Description</Th>
              <Th width={15}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTemplates.map((template) => (
              <Tr key={template.name}>
                <Td dataLabel="Name" width={25} style={{ textAlign: 'left' }}>{template.name}</Td>
                <Td dataLabel="Category" width={20} style={{ textAlign: 'left' }}>
                  <Label color="grey">{template.category}</Label>
                </Td>
                <Td dataLabel="Description" width={40} style={{ textAlign: 'left' }}>{template.description}</Td>
                <Td dataLabel="Actions" width={15} style={{ textAlign: 'left' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUseTemplate(template.name)}
                  >
                    Use template
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px', borderTop: '1px solid var(--pf-t--global--border--color--default)' }}>
          <Button variant="primary" onClick={() => setIsTemplateModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      <Drawer isExpanded={isDrawerOpen} onExpand={() => setIsDrawerOpen(true)}>
        <DrawerContent panelContent={drawerPanelContent}>
          <DrawerContentBody>
            <div style={{ padding: '24px' }}>
              <Breadcrumb style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                <BreadcrumbItem to="#" onClick={(e) => { e.preventDefault(); navigate('/user-management/roles'); }}>
                  Roles
                </BreadcrumbItem>
                <BreadcrumbItem isActive>{isEditMode ? 'Edit custom role' : 'Create custom role'}</BreadcrumbItem>
              </Breadcrumb>

              <Split hasGutter style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                <SplitItem isFilled>
                  <Title headingLevel="h1" size="2xl">
                    {isEditMode ? 'Edit custom role' : 'Create custom role'}
                  </Title>
                </SplitItem>
                <SplitItem>
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/user-management/roles')}
                  >
                    Cancel
                  </Button>
                </SplitItem>
              </Split>

              <Content component="p" className="pf-v6-u-color-200" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                Create a custom role to control what users can see and do across your cluster resources. Define permissions, navigation access, and resource scopes to implement fine-grained access control.
              </Content>

              <Button variant="link" isInline onClick={() => setIsTemplateModalOpen(true)} style={{ paddingLeft: 0, marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                Select templates
              </Button>

      <Grid hasGutter span={6}>
        <GridItem span={6}>
          <Card>
            <CardBody>
              <Split hasGutter>
                <SplitItem isFilled>
                  <Title headingLevel="h2" size="lg">Role Configuration</Title>
                </SplitItem>
                <SplitItem>
                  <Button variant="plain">Clear All</Button>
                </SplitItem>
              </Split>

              <Form style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                <FormGroup label="Role Name" isRequired fieldId="role-name">
                  <TextInput
                    isRequired
                    type="text"
                    id="role-name"
                    name="role-name"
                    value={roleName}
                    onChange={(_event, value) => setRoleName(value)}
                  />
                  <Content component="small" className="pf-v6-u-color-200">
                    Use lowercase letters, numbers, and hyphens only
                  </Content>
                </FormGroup>

                <FormGroup label="Labels" fieldId="labels">
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                    Add key/value labels to organize and find this role (for example by organization or team).
                  </Content>
                  
                  {labels.map((label) => (
                    <Split hasGutter key={label.id} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                      <SplitItem isFilled>
                        <TextInput
                          type="text"
                          id={`label-key-${label.id}`}
                          placeholder="Key (e.g., team, environment)"
                          value={label.key}
                          onChange={(_event, value) => handleLabelChange(label.id, 'key', value)}
                        />
                      </SplitItem>
                      <SplitItem isFilled>
                        <TextInput
                          type="text"
                          id={`label-value-${label.id}`}
                          placeholder="Value (e.g., platform, production)"
                          value={label.value}
                          onChange={(_event, value) => handleLabelChange(label.id, 'value', value)}
                        />
                      </SplitItem>
                      <SplitItem>
                        <Button 
                          variant="plain" 
                          icon={<MinusCircleIcon />} 
                          onClick={() => handleRemoveLabel(label.id)}
                          aria-label="Remove label"
                        />
                      </SplitItem>
                    </Split>
                  ))}
                  
                  <Button variant="link" isInline icon={<PlusCircleIcon />} style={{ paddingLeft: 0 }} onClick={handleAddLabel}>
                    Add label
                  </Button>
                </FormGroup>

                <FormGroup label="Description" fieldId="description">
                  <TextArea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(_event, value) => setDescription(value)}
                    placeholder="Explain what this role is for and who should use it"
                    rows={4}
                  />
                </FormGroup>

                <FormGroup label="Category" fieldId="category">
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm" style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                    Assign this role to a category to help organize and filter roles.
                  </Content>
                  
                  {!isCreatingNewCategory ? (
                    <Split hasGutter>
                      <SplitItem isFilled>
                        <Dropdown
                          isOpen={isCategoryDropdownOpen}
                          onSelect={(event, value) => {
                            if (value === 'create-new') {
                              setIsCreatingNewCategory(true);
                              setCategory('');
                            } else {
                              setCategory(value as string);
                            }
                            setIsCategoryDropdownOpen(false);
                          }}
                          onOpenChange={(isOpen: boolean) => setIsCategoryDropdownOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle
                              ref={toggleRef}
                              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                              isExpanded={isCategoryDropdownOpen}
                              isFullWidth
                            >
                              {category || 'Select a category'}
                            </MenuToggle>
                          )}
                        >
                          <DropdownList>
                            <DropdownItem value="create-new">
                              Create new category
                            </DropdownItem>
                            <Divider />
                            {existingCategories.map((cat) => (
                              <DropdownItem key={cat} value={cat}>
                                {cat}
                              </DropdownItem>
                            ))}
                          </DropdownList>
                        </Dropdown>
                      </SplitItem>
                      {category && !existingCategories.includes(category) && (
                        <SplitItem>
                          <Button
                            variant="plain"
                            onClick={() => setCategory('')}
                            aria-label="Clear custom category"
                          >
                            <MinusCircleIcon />
                          </Button>
                        </SplitItem>
                      )}
                    </Split>
                  ) : (
                    <Split hasGutter>
                      <SplitItem isFilled>
                        <TextInput
                          type="text"
                          id="new-category"
                          name="new-category"
                          value={category}
                          onChange={(_event, value) => setCategory(value)}
                          placeholder="Enter new category name"
                        />
                      </SplitItem>
                      <SplitItem>
                        <Button
                          variant="primary"
                          onClick={() => {
                            if (category.trim()) {
                              setIsCreatingNewCategory(false);
                            }
                          }}
                          isDisabled={!category.trim()}
                        >
                          Confirm
                        </Button>
                      </SplitItem>
                      <SplitItem>
                        <Button
                          variant="link"
                          onClick={() => {
                            setIsCreatingNewCategory(false);
                            setCategory('');
                          }}
                        >
                          Cancel
                        </Button>
                      </SplitItem>
                    </Split>
                  )}
                </FormGroup>

                <Divider style={{ margin: 'var(--pf-t--global--spacer--lg) 0' }} />

                <FormGroup label="Navigation Access" fieldId="navigation-access">
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    Control which perspectives and pages are visible to users with this role. You can grant access to entire perspectives or select specific pages within each perspective.
                  </Content>
                  
                  {Object.entries(navigationAccess).map(([perspective, access]) => {
                    const allPagesSelected = Object.values(access.pages).every(selected => selected);
                    const isDropdownOpen = perspectiveDropdowns[perspective] || false;
                    
                    const getAccessModeLabel = (mode: 'full' | 'none' | 'partial') => {
                      switch (mode) {
                        case 'full': return 'Full access';
                        case 'none': return 'No access';
                        case 'partial': return 'Partial access';
                      }
                    };
                    
                    return (
                      <div key={perspective} style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                        <Split hasGutter style={{ alignItems: 'center', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                          <SplitItem>
                            <Content component="p" style={{ fontWeight: 600, margin: 0 }}>
                              {perspective}
                            </Content>
                          </SplitItem>
                          <SplitItem>
                            <Dropdown
                              isOpen={isDropdownOpen}
                              onSelect={() => {
                                setPerspectiveDropdowns({
                                  ...perspectiveDropdowns,
                                  [perspective]: false
                                });
                              }}
                              onOpenChange={(isOpen: boolean) => {
                                setPerspectiveDropdowns({
                                  ...perspectiveDropdowns,
                                  [perspective]: isOpen
                                });
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                  ref={toggleRef}
                                  onClick={() => {
                                    setPerspectiveDropdowns({
                                      ...perspectiveDropdowns,
                                      [perspective]: !isDropdownOpen
                                    });
                                  }}
                                  isExpanded={isDropdownOpen}
                                  variant="default"
                                  style={{ minWidth: '160px' }}
                                >
                                  {getAccessModeLabel(access.mode)}
                                </MenuToggle>
                              )}
                            >
                              <DropdownList>
                                <DropdownItem
                                  key="full"
                                  onClick={() => {
                                    setNavigationAccess({
                                      ...navigationAccess,
                                      [perspective]: { ...access, mode: 'full' }
                                    });
                                  }}
                                >
                                  Full access
                                </DropdownItem>
                                <DropdownItem
                                  key="none"
                                  onClick={() => {
                                    setNavigationAccess({
                                      ...navigationAccess,
                                      [perspective]: { ...access, mode: 'none' }
                                    });
                                  }}
                                >
                                  No access
                                </DropdownItem>
                                <DropdownItem
                                  key="partial"
                                  onClick={() => {
                                    setNavigationAccess({
                                      ...navigationAccess,
                                      [perspective]: { ...access, mode: 'partial' }
                                    });
                                  }}
                                >
                                  Partial access
                                </DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </SplitItem>
                        </Split>
                        
                        {access.mode === 'partial' && (
                          <div style={{ 
                            paddingLeft: 'var(--pf-t--global--spacer--xl)', 
                            marginTop: 'var(--pf-t--global--spacer--sm)',
                            borderLeft: '2px solid var(--pf-t--global--border--color--default)',
                            paddingTop: 'var(--pf-t--global--spacer--sm)',
                            paddingBottom: 'var(--pf-t--global--spacer--sm)',
                          }}>
                            <Split hasGutter style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                              <SplitItem>
                                <Content component="p" className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold">
                                  Select pages:
                                </Content>
                              </SplitItem>
                              <SplitItem>
                                <Button
                                  variant="link"
                                  isInline
                                  onClick={() => handleSelectAllPages(perspective, !allPagesSelected)}
                                  style={{ paddingLeft: 0, fontSize: 'var(--pf-t--global--font--size--sm)' }}
                                >
                                  {allPagesSelected ? 'Deselect all' : 'Select all'}
                                </Button>
                              </SplitItem>
                            </Split>
                            <Grid hasGutter span={6}>
                              {Object.keys(access.pages).map(page => (
                                <GridItem span={6} key={page}>
                                  <Checkbox
                                    id={`${perspective}-${page}`}
                                    label={page}
                                    isChecked={access.pages[page]}
                                    onChange={(_event, checked) => {
                                      setNavigationAccess({
                                        ...navigationAccess,
                                        [perspective]: {
                                          ...access,
                                          pages: {
                                            ...access.pages,
                                            [page]: checked
                                          }
                                        }
                                      });
                                    }}
                                  />
                                </GridItem>
                              ))}
                            </Grid>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </FormGroup>

                <Divider style={{ margin: 'var(--pf-t--global--spacer--lg) 0' }} />

                <Split hasGutter style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
                  <SplitItem isFilled>
                    <Title headingLevel="h3" size="md">Permission Rules</Title>
                  </SplitItem>
                  <SplitItem>
                    <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={handleAddRule}>
                      Add Rule
                    </Button>
                  </SplitItem>
                </Split>

                {permissionRules.map((rule, index) => (
                  <Card key={rule.id} style={{ marginTop: 'var(--pf-t--global--spacer--md)', overflow: 'visible' }}>
                    <CardBody style={{ overflow: 'visible' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--pf-t--global--spacer--md)', overflow: 'visible' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <ExpandableSection
                            toggleText={`Rule ${index + 1}`}
                            isExpanded={expandedRules[rule.id] || false}
                            onToggle={() => toggleRuleExpansion(rule.id)}
                          >
                            <FormGroup 
                              label="API Groups" 
                              fieldId={`api-groups-${rule.id}`}
                              style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                            >
                              <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm">
                                Enter one or more API groups for this rule. Separate multiple values with commas.
                              </Content>
                              <TextInput
                                type="text"
                                id={`api-groups-${rule.id}`}
                                value={rule.apiGroups}
                                onChange={(_event, value) => handleRuleChange(rule.id, 'apiGroups', value)}
                                placeholder="Enter API groups"
                              />
                              <Button 
                                variant="link" 
                                isInline 
                                style={{ paddingLeft: 0, marginTop: 'var(--pf-t--global--spacer--sm)' }}
                                onClick={() => handleOpenDrawer(rule.id, 'apiGroups')}
                              >
                                Browse API catalog
                              </Button>
                            </FormGroup>

                            <Divider style={{ margin: 'var(--pf-t--global--spacer--lg) 0' }} />

                            <FormGroup label="Resources" fieldId={`resources-${rule.id}`}>
                              <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm">
                                Enter one or more resource types for the selected API groups. Separate multiple values with commas.
                              </Content>
                              <TextInput
                                type="text"
                                id={`resources-${rule.id}`}
                                value={rule.resources}
                                onChange={(_event, value) => handleRuleChange(rule.id, 'resources', value)}
                                placeholder="Enter resources"
                              />
                              <Button 
                                variant="link" 
                                isInline 
                                style={{ paddingLeft: 0, marginTop: 'var(--pf-t--global--spacer--sm)' }}
                                onClick={() => handleOpenDrawer(rule.id, 'resources')}
                              >
                                Browse resources catalog
                              </Button>
                            </FormGroup>

                            <Divider style={{ margin: 'var(--pf-t--global--spacer--lg) 0' }} />

                            <FormGroup label="Verbs (Permissions)" fieldId={`verbs-${rule.id}`}>
                              <Split hasGutter style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                                <SplitItem isFilled>
                                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm">
                                    Select the actions this rule allows on the chosen resources.
                                  </Content>
                                </SplitItem>
                                <SplitItem>
                                  <Button
                                    variant="link"
                                    isInline
                                    onClick={() => {
                                      const allVerbs = verbGroups.flatMap(g => g.verbs.map(v => v.name));
                                      const allSelected = allVerbs.every(v => rule.verbs.includes(v));
                                      if (allSelected) {
                                        // Deselect all
                                        setPermissionRules(permissionRules.map(r => 
                                          r.id === rule.id ? { ...r, verbs: [] } : r
                                        ));
                                      } else {
                                        // Select all
                                        setPermissionRules(permissionRules.map(r => 
                                          r.id === rule.id ? { ...r, verbs: allVerbs } : r
                                        ));
                                      }
                                    }}
                                    style={{ fontSize: 'var(--pf-t--global--font--size--sm)' }}
                                  >
                                    {(() => {
                                      const allVerbs = verbGroups.flatMap(g => g.verbs.map(v => v.name));
                                      const allSelected = allVerbs.every(v => rule.verbs.includes(v));
                                      return allSelected ? 'Deselect all categories' : 'Select all categories';
                                    })()}
                                  </Button>
                                </SplitItem>
                              </Split>
                              
                              {verbGroups.map((group, groupIndex) => {
                                const groupVerbNames = group.verbs.map(v => v.name);
                                const allGroupSelected = groupVerbNames.every(v => rule.verbs.includes(v));
                                const someGroupSelected = groupVerbNames.some(v => rule.verbs.includes(v)) && !allGroupSelected;
                                
                                return (
                                  <div 
                                    key={group.category} 
                                    style={{ 
                                      marginBottom: groupIndex < verbGroups.length - 1 ? 'var(--pf-t--global--spacer--md)' : 0,
                                      padding: 'var(--pf-t--global--spacer--md)',
                                      border: '1px solid var(--pf-t--global--border--color--default)',
                                      borderRadius: 'var(--pf-t--global--border--radius--default)',
                                      backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                                    }}
                                  >
                                    <Split hasGutter style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                                      <SplitItem isFilled>
                                        <Content component="p" style={{ fontWeight: 600, margin: 0 }}>
                                          {group.category}
                                        </Content>
                                        <Content component="small" className="pf-v6-u-color-200" style={{ fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                                          {group.description}
                                        </Content>
                                      </SplitItem>
                                      <SplitItem>
                                        <Button
                                          variant="link"
                                          isInline
                                          onClick={() => handleVerbGroupToggle(rule.id, groupVerbNames, !allGroupSelected)}
                                          style={{ fontSize: 'var(--pf-t--global--font--size--sm)' }}
                                        >
                                          {allGroupSelected ? 'Deselect all' : 'Select all'}
                                        </Button>
                                      </SplitItem>
                                    </Split>
                                    
                                    <Grid hasGutter span={3}>
                                      {group.verbs.map(verb => (
                                        <GridItem span={3} key={verb.name}>
                                          <Checkbox
                                            id={`verb-${rule.id}-${verb.name}`}
                                            label={
                                              <span title={verb.description}>
                                                <strong>{verb.label}</strong>
                                                <br />
                                                <span style={{ fontSize: 'var(--pf-t--global--font--size--sm)', color: 'var(--pf-t--global--color--200)' }}>
                                                  {verb.description}
                                                </span>
                                              </span>
                                            }
                                            isChecked={rule.verbs.includes(verb.name)}
                                            onChange={(_event, checked) => handleVerbToggle(rule.id, verb.name, checked)}
                                          />
                                        </GridItem>
                                      ))}
                                    </Grid>
                                  </div>
                                );
                              })}
                            </FormGroup>
                          </ExpandableSection>
                        </div>
                        {permissionRules.length > 1 && (
                          <Button 
                            variant="plain" 
                            icon={<MinusCircleIcon />} 
                            onClick={() => handleRemoveRule(rule.id)}
                            aria-label="Remove rule"
                            style={{ marginTop: '4px' }}
                          />
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </Form>
            </CardBody>
          </Card>

          <div style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
            <Button variant="primary" onClick={handleCreateRole}>
              {isEditMode ? 'Save' : 'Create Role'}
            </Button>{' '}
            <Button variant="link" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </GridItem>

        <GridItem span={6}>
          <Card isFullHeight>
            <CardBody>
              <Split hasGutter style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                <SplitItem isFilled>
                  <Title headingLevel="h2" size="lg">Live YAML</Title>
                </SplitItem>
                <SplitItem>
                  <Button 
                    variant="plain" 
                    icon={<DownloadIcon />}
                    onClick={handleDownloadYAML}
                    aria-label="Download YAML"
                  />
                </SplitItem>
              </Split>
              <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                Auto-generated from the form. You can manually edit the YAML directly.
              </Content>
              <div style={{ position: 'relative' }}>
                <TextArea
                  value={yamlCode}
                  onChange={(_event, value) => setYamlCode(value)}
                  style={{
                    fontFamily: 'var(--pf-t--global--font--family--mono)',
                    fontSize: '14px',
                    minHeight: '600px',
                    resize: 'vertical',
                  }}
                  aria-label="YAML editor"
                />
                <Button
                  variant="plain"
                  onClick={handleCopyYAML}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 1,
                  }}
                  aria-label="Copy YAML"
                >
                  Copy
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
            </div>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { CreateRole };

