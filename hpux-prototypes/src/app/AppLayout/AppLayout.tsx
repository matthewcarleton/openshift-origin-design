import * as React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSection,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Icon,
  Modal,
  ModalVariant,
  Title,
  Content,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Alert,
  Tabs,
  Tab,
  TabTitleText,
  Card,
  CardBody,
  Label,
  Divider,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Banner,
  Spinner,
} from '@patternfly/react-core';
import { IAppRoute, IAppRouteGroup, routes } from '@app/routes';
import { prototypeRegistry } from '@app/core/PrototypeRegistry';
import { RouteConfig } from '@app/core/types';
// DEPRECATED: These components have been moved to prototypes. Each prototype uses its own local copy.
// import { VirtualMachines } from '@app/VirtualMachines/VirtualMachines';
// import { HubVirtualMachines } from '@app/CorePlatforms/HubVirtualMachines';
// import { IdentityProvider } from '@app/IdentityProvider/IdentityProvider';
// DEPRECATED: FleetVirtualization components moved to prototypes
// Each prototype now has its own local copies
// import { OverviewPage } from '@app/FleetVirtualization/EmptyPages';
// import { Catalog } from '@app/FleetVirtualization/Catalog';
// import { Templates } from '@app/FleetVirtualization/Templates';
// import { InstanceTypes } from '@app/FleetVirtualization/InstanceTypes';
// import { MigrationPlans } from '@app/use-case-cclm/Migration/MigrationPlans'; // DEPRECATED - migrated to prototypes
import {
  BarsIcon,
  CaretDownIcon,
  CogIcon,
  QuestionCircleIcon,
  BellIcon,
  EllipsisVIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { useImpersonation } from '@app/shared/contexts/ImpersonationContext';
import { useUseCaseContext } from '@app/shared/contexts/UseCaseContext';
import {
  ActivePerspectiveProvider,
  type AppShellPerspectiveKey,
} from '@app/shared/contexts/ActivePerspectiveContext';
import { UseCaseBanner } from '@app/UseCaseSelector/UseCaseBanner';
import virtIcon from '@app/bgimages/virt-icon.png';
import multiclusterIcon from '@app/bgimages/pficon-multicluster.svg';
import redHatOpenShiftLogo from '@app/bgimages/redhatopenshift.svg';

interface IAppLayout {
  children: React.ReactNode;
  customToolbarItems?: React.ReactNode; // Custom items to add to masthead toolbar
  useCaseTitle?: string; // Optional use case title (for backward compat)
  useCasePersona?: string; // Optional persona (for backward compat)
  topBanner?: React.ReactNode; // Banner to show above masthead
  enabledPerspectives?: string[]; // List of enabled perspectives for this prototype
  currentPrototypeId?: string; // Current prototype ID for conditional navigation
}

// Custom Core Platforms icon component
const CorePlatformsIcon: React.FC<{ size?: string }> = ({ size = '20px' }) => (
  <svg 
    viewBox="0 0 640 512" 
    fill="currentColor" 
    aria-hidden="true" 
    role="img" 
    width={size} 
    height={size}
    style={{ display: 'inline-block' }}
  >
    <path d="M512.1 191l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0L552 6.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zm-10.5-58.8c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.7-82.4 14.3-52.8 52.8zM386.3 286.1l33.7 16.8c10.1 5.8 14.5 18.1 10.5 29.1-8.9 24.2-26.4 46.4-42.6 65.8-7.4 8.9-20.2 11.1-30.3 5.3l-29.1-16.8c-16 13.7-34.6 24.6-54.9 31.7v33.6c0 11.6-8.3 21.6-19.7 23.6-24.6 4.2-50.4 4.4-75.9 0-11.5-2-20-11.9-20-23.6V418c-20.3-7.2-38.9-18-54.9-31.7L74 403c-10 5.8-22.9 3.6-30.3-5.3-16.2-19.4-33.3-41.6-42.2-65.7-4-10.9.4-23.2 10.5-29.1l33.3-16.8c-3.9-20.9-3.9-42.4 0-63.4L12 205.8c-10.1-5.8-14.6-18.1-10.5-29 8.9-24.2 26-46.4 42.2-65.8 7.4-8.9 20.2-11.1 30.3-5.3l29.1 16.8c16-13.7 34.6-24.6 54.9-31.7V57.1c0-11.5 8.2-21.5 19.6-23.5 24.6-4.2 50.5-4.4 76-.1 11.5 2 20 11.9 20 23.6v33.6c20.3 7.2 38.9 18 54.9 31.7l29.1-16.8c10-5.8 22.9-3.6 30.3 5.3 16.2 19.4 33.2 41.6 42.1 65.8 4 10.9.1 23.2-10 29.1l-33.7 16.8c3.9 21 3.9 42.5 0 63.5zm-117.6 21.1c59.2-77-28.7-164.9-105.7-105.7-59.2 77 28.7 164.9 105.7 105.7zm243.4 182.7l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0l8.2-14.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zM501.6 431c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.6-82.4 14.3-52.8 52.8z"></path>
  </svg>
);

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children, customToolbarItems, useCaseTitle, useCasePersona, topBanner, enabledPerspectives, currentPrototypeId }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [perspectiveOpen, setPerspectiveOpen] = React.useState(false);
  const [activePerspective, setActivePerspective] = React.useState('Fleet management');
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const { impersonatingUser, impersonatingGroups, isLoading, stopImpersonation } = useImpersonation();
  const { useCase } = useUseCaseContext();
  const navigate = useNavigate();
  const hasNavigatedRef = React.useRef(false);
  const hasShownModalRef = React.useRef(false);

  // Responsive sidebar: automatically close on small screens (mobile)
  React.useEffect(() => {
    const handleResize = () => {
      // PatternFly breakpoint: md = 768px, so we close sidebar below that
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Set initial state based on screen size
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When impersonation starts, switch to Fleet virtualization perspective and navigate to Virtual machines (only once)
  React.useEffect(() => {
    if (impersonatingUser && !hasNavigatedRef.current) {
      setActivePerspective('Fleet virtualization');
      navigate('/virtualization/virtual-machines');
      hasNavigatedRef.current = true;
    } else if (!impersonatingUser) {
      // Reset the flag when impersonation stops
      hasNavigatedRef.current = false;
    }
  }, [impersonatingUser, navigate]);

  // Automatically open the task modal when entering a use case (only once per use case selection)
  // Skip modal for empty states use cases
  React.useEffect(() => {
    if (useCase && useCase !== 'use-case-empty-states' && useCase !== 'use-case-aaq-empty-states' && !hasShownModalRef.current) {
      setIsTaskModalOpen(true);
      hasShownModalRef.current = true;
    } else if (!useCase) {
      // Reset the flag when returning to use case selector
      hasShownModalRef.current = false;
    }
  }, [useCase]);

  // Set the active perspective based on the use case or prototype
  React.useEffect(() => {
    if (useCase === 'use-case-aaq' || useCase === 'use-case-aaq-empty-states' || useCase === 'use-case-operator-lifecycle' || currentPrototypeId === 'operator-lifecycle' || currentPrototypeId === 'virtualization-quotas') {
      setActivePerspective('Core platforms');
    } else if (useCase === 'use-case-cclm' || currentPrototypeId === 'cross-cluster-migration') {
      setActivePerspective('Fleet virtualization');
    } else if (useCase === 'use-case-1' || useCase === 'use-case-2' || useCase === 'use-case-empty-states' || currentPrototypeId === 'fleet-admin-rbac' || currentPrototypeId === 'fleet-admin-rbac-v1.1' || currentPrototypeId === 'tenant-admin-access' || currentPrototypeId === 'stefans-acmintegration') {
      setActivePerspective('Fleet management');
    } else if (enabledPerspectives && enabledPerspectives.length > 0) {
      // Set to first enabled perspective for prototypes
      const perspectiveMap = {
        'core-platforms': 'Core platforms',
        'fleet-management': 'Fleet management',
        'fleet-virtualization': 'Fleet virtualization',
      };
      const firstEnabled = enabledPerspectives[0];
      if (perspectiveMap[firstEnabled as keyof typeof perspectiveMap]) {
        setActivePerspective(perspectiveMap[firstEnabled as keyof typeof perspectiveMap]);
      }
    }
  }, [useCase, enabledPerspectives, currentPrototypeId]);


  // All perspectives - mark as disabled if not in enabledPerspectives
  const allPerspectives = [
    { name: 'Core platforms', key: 'core-platforms', disabled: false },
    { name: 'Fleet management', key: 'fleet-management', disabled: false },
    { name: 'Fleet virtualization', key: 'fleet-virtualization', disabled: false },
  ];

  // Mark perspectives as disabled if they're not in enabledPerspectives
  const perspectivesWithDisabled = allPerspectives.map(p => {
    if (enabledPerspectives && enabledPerspectives.length > 0) {
      const isEnabled = enabledPerspectives.includes(p.key);
      return { ...p, disabled: !isEnabled };
    }
    return p;
  });

  // Filter perspectives: only show Fleet virtualization when impersonating
  const perspectives = impersonatingUser
    ? perspectivesWithDisabled.filter((p) => p.name === 'Fleet virtualization')
    : perspectivesWithDisabled;

  const setPerspectiveByKey = React.useCallback(
    (key: AppShellPerspectiveKey) => {
      const row = perspectivesWithDisabled.find((p) => p.key === key);
      if (row && !row.disabled) {
        setActivePerspective(row.name);
      }
    },
    [perspectivesWithDisabled]
  );

  const activePerspectiveContextValue = React.useMemo(
    () => ({
      activePerspective,
      setPerspectiveByKey,
    }),
    [activePerspective, setPerspectiveByKey]
  );

  // Core platforms navigation routes
  const corePlatformsRoutes: IAppRouteGroup[] = [
    {
      label: 'Home',
      routes: [
        { element: <></>, label: 'Overview', path: '/core/home/overview', title: 'Overview' },
        { element: <></>, label: 'Projects', path: '/core/home/projects', title: 'Projects' },
        { element: <></>, label: 'Search', path: '/core/home/search', title: 'Search' },
        { element: <></>, label: 'Software Catalog', path: '/core/home/catalog', title: 'Software Catalog' },
        { element: <></>, label: 'API Explorer', path: '/core/home/api-explorer', title: 'API Explorer' },
        { element: <></>, label: 'Events', path: '/core/home/events', title: 'Events' },
      ],
    },
    {
      label: 'Favorites',
      routes: [
        { element: <></>, label: 'No favorites added', path: '/core/favorites/none', title: 'No favorites added' },
      ],
    },
    {
      label: 'Operators',
      routes: [
        { element: <></>, label: 'OperatorHub', path: '/core/operators/hub', title: 'OperatorHub' },
        { element: <></>, label: 'Installed Operators', path: '/core/operators/installed', title: 'Installed Operators' },
      ],
    },
    {
      label: 'Helm',
      routes: [
        { element: <></>, label: 'Repositories', path: '/core/helm/repositories', title: 'Repositories' },
        { element: <></>, label: 'Releases', path: '/core/helm/releases', title: 'Releases' },
      ],
    },
    {
      label: 'Workloads',
      routes: [
        { element: <></>, label: 'Topology', path: '/core/workloads/topology', title: 'Topology' },
        { element: <></>, label: 'Pods', path: '/core/workloads/pods', title: 'Pods' },
        { element: <></>, label: 'Deployments', path: '/core/workloads/deployments', title: 'Deployments' },
        { element: <></>, label: 'DeploymentConfigs', path: '/core/workloads/deploymentconfigs', title: 'DeploymentConfigs' },
        { element: <></>, label: 'StatefulSets', path: '/core/workloads/statefulsets', title: 'StatefulSets' },
        { element: <></>, label: 'Secrets', path: '/core/workloads/secrets', title: 'Secrets' },
        { element: <></>, label: 'ConfigMaps', path: '/core/workloads/configmaps', title: 'ConfigMaps' },
        { element: <></>, label: 'CronJobs', path: '/core/workloads/cronjobs', title: 'CronJobs' },
        { element: <></>, label: 'Jobs', path: '/core/workloads/jobs', title: 'Jobs' },
        { element: <></>, label: 'DaemonSets', path: '/core/workloads/daemonsets', title: 'DaemonSets' },
        { element: <></>, label: 'ReplicaSets', path: '/core/workloads/replicasets', title: 'ReplicaSets' },
        { element: <></>, label: 'ReplicationControllers', path: '/core/workloads/replicationcontrollers', title: 'ReplicationControllers' },
        { element: <></>, label: 'HorizontalPodAutoscalers', path: '/core/workloads/hpas', title: 'HorizontalPodAutoscalers' },
        { element: <></>, label: 'PodDisruptionBudgets', path: '/core/workloads/pdbs', title: 'PodDisruptionBudgets' },
      ],
    },
    {
      label: 'Virtualization',
      routes: [
        { element: <></>, label: 'Overview', path: '/core/virtualization/overview', title: 'Overview' },
        { element: <></>, label: 'Catalog', path: '/core/virtualization/catalog', title: 'Catalog' },
        { element: <></>, label: 'VirtualMachines', path: '/core/virtualization/vms', title: 'VirtualMachines' },
        { element: <></>, label: 'Templates', path: '/core/virtualization/templates', title: 'Templates' },
        { element: <></>, label: 'InstanceTypes', path: '/core/virtualization/instancetypes', title: 'InstanceTypes' },
        { element: <></>, label: 'Preferences', path: '/core/virtualization/preferences', title: 'Preferences' },
        { element: <></>, label: 'Bootable volumes', path: '/core/virtualization/bootable-volumes', title: 'Bootable volumes' },
        { element: <></>, label: 'MigrationPolicies', path: '/core/virtualization/migration-policies', title: 'MigrationPolicies' },
        { element: <></>, label: 'Checkups', path: '/core/virtualization/checkups', title: 'Checkups' },
        ...(useCase === 'use-case-aaq' || useCase === 'use-case-aaq-empty-states' || currentPrototypeId === 'aaq-empty-states' || currentPrototypeId === 'virtualization-quotas' ? [{ element: <></>, label: 'Quotas', path: '/core/virtualization/quotas', title: 'Quotas' }] : []),
      ],
    },
    {
      label: 'Migration',
      routes: [
        { element: <></>, label: 'Overview', path: '/core/migration/overview', title: 'Overview' },
        { element: <></>, label: 'Providers for virtualization', path: '/core/migration/providers', title: 'Providers for virtualization' },
        { element: <></>, label: 'Plans for virtualization', path: '/core/migration/plans', title: 'Plans for virtualization' },
        { element: <></>, label: 'StorageMaps for virtualization', path: '/core/migration/storage-maps', title: 'StorageMaps for virtualization' },
        { element: <></>, label: 'NetworkMaps for virtualization', path: '/core/migration/network-maps', title: 'NetworkMaps for virtualization' },
      ],
    },
    {
      label: 'GitOps',
      routes: [
        { element: <></>, label: 'Applications', path: '/core/gitops/applications', title: 'Applications' },
        { element: <></>, label: 'ApplicationSets', path: '/core/gitops/applicationsets', title: 'ApplicationSets' },
      ],
    },
    {
      label: 'Serverless',
      routes: [
        { element: <></>, label: 'Serving', path: '/core/serverless/serving', title: 'Serving' },
        { element: <></>, label: 'Functions', path: '/core/serverless/functions', title: 'Functions' },
      ],
    },
    {
      label: 'Networking',
      routes: [
        { element: <></>, label: 'Services', path: '/core/networking/services', title: 'Services' },
        { element: <></>, label: 'Routes', path: '/core/networking/routes', title: 'Routes' },
        { element: <></>, label: 'Ingresses', path: '/core/networking/ingresses', title: 'Ingresses' },
        { element: <></>, label: 'NetworkPolicies', path: '/core/networking/network-policies', title: 'NetworkPolicies' },
        { element: <></>, label: 'NetworkAttachmentDefinitions', path: '/core/networking/network-attachment-definitions', title: 'NetworkAttachmentDefinitions' },
        { element: <></>, label: 'UserDefinedNetworks', path: '/core/networking/user-defined-networks', title: 'UserDefinedNetworks' },
      ],
    },
    {
      label: 'Storage',
      routes: [
        { element: <></>, label: 'PersistentVolumes', path: '/core/storage/pvs', title: 'PersistentVolumes' },
        { element: <></>, label: 'PersistentVolumeClaims', path: '/core/storage/pvcs', title: 'PersistentVolumeClaims' },
        { element: <></>, label: 'StorageClasses', path: '/core/storage/classes', title: 'StorageClasses' },
        { element: <></>, label: 'VolumeSnapshots', path: '/core/storage/volume-snapshots', title: 'VolumeSnapshots' },
        { element: <></>, label: 'VolumeSnapshotClasses', path: '/core/storage/volume-snapshot-classes', title: 'VolumeSnapshotClasses' },
        { element: <></>, label: 'VolumeSnapshotContents', path: '/core/storage/volume-snapshot-contents', title: 'VolumeSnapshotContents' },
      ],
    },
    {
      label: 'Builds',
      routes: [
        { element: <></>, label: 'BuildConfigs', path: '/core/builds/configs', title: 'BuildConfigs' },
        { element: <></>, label: 'Builds', path: '/core/builds/builds', title: 'Builds' },
        { element: <></>, label: 'ImageStreams', path: '/core/builds/image-streams', title: 'ImageStreams' },
      ],
    },
    {
      label: 'Pipelines',
      routes: [
        { element: <></>, label: 'Overview', path: '/core/pipelines/overview', title: 'Overview' },
        { element: <></>, label: 'Pipelines', path: '/core/pipelines/pipelines', title: 'Pipelines' },
        { element: <></>, label: 'Tasks', path: '/core/pipelines/tasks', title: 'Tasks' },
        { element: <></>, label: 'Triggers', path: '/core/pipelines/triggers', title: 'Triggers' },
      ],
    },
    {
      label: 'Observe',
      routes: [
        { element: <></>, label: 'Alerting', path: '/core/observe/alerting', title: 'Alerting' },
        { element: <></>, label: 'Metrics', path: '/core/observe/metrics', title: 'Metrics' },
        { element: <></>, label: 'Dashboards', path: '/core/observe/dashboards', title: 'Dashboards' },
        { element: <></>, label: 'Targets', path: '/core/observe/targets', title: 'Targets' },
        { element: <></>, label: 'Incidents', path: '/core/observe/incidents', title: 'Incidents' },
        { element: <></>, label: 'Dashboards (Perses)', path: '/core/observe/dashboards-perses', title: 'Dashboards (Perses)' },
      ],
    },
    {
      label: 'Compute',
      routes: [
        { element: <></>, label: 'Nodes', path: '/core/compute/nodes', title: 'Nodes' },
        { element: <></>, label: 'Hardware Devices', path: '/core/compute/hardware-devices', title: 'Hardware Devices' },
      ],
    },
    {
      label: 'User Management',
      routes: [
        { element: <></>, label: 'Identities', path: '/user-management/identities', title: 'Identities' },
        { element: <></>, label: 'Identity providers', path: '/core/user-management/identity-providers', title: 'Identity providers' },
        { element: <></>, label: 'Roles', path: '/user-management/roles', title: 'Roles' },
      ],
    },
    {
      label: 'Administration',
      routes: [
        { element: <></>, label: 'Cluster Settings', path: '/core/administration/settings', title: 'Cluster Settings' },
        { element: <></>, label: 'Namespaces', path: '/core/administration/namespaces', title: 'Namespaces' },
        { element: <></>, label: 'ResourceQuotas', path: '/core/administration/resource-quotas', title: 'ResourceQuotas' },
        { element: <></>, label: 'LimitRanges', path: '/core/administration/limit-ranges', title: 'LimitRanges' },
        { element: <></>, label: 'Image Vulnerabilities', path: '/core/administration/image-vulnerabilities', title: 'Image Vulnerabilities' },
        { element: <></>, label: 'CustomResourceDefinitions', path: '/core/administration/crds', title: 'CustomResourceDefinitions' },
        { element: <></>, label: 'Dynamic Plugins', path: '/core/administration/dynamic-plugins', title: 'Dynamic Plugins' },
      ],
    },
  ];

  // Fleet virtualization navigation routes
  const fleetVirtualizationRoutes: IAppRouteGroup[] = [
    {
      label: '',
      routes: [
        {
          element: <></>,
          label: 'Overview',
          path: '/virtualization/overview',
          title: 'Overview',
        },
        {
          element: <></>,
          label: 'Catalog',
          path: '/virtualization/catalog',
          title: 'Catalog',
        },
        {
          element: <></>,
          label: 'Virtual machines',
          path: '/virtualization/virtual-machines',
          title: 'Virtual machines',
        },
      ],
    },
    ...((useCase === 'use-case-cclm' || currentPrototypeId === 'cross-cluster-migration') ? [{
      label: 'Migration',
      routes: [
        {
          element: <></>,
          label: 'Migration plans',
          path: '/virtualization/migration',
          title: 'Migration plans',
        },
      ],
    }] : []),
    {
      label: '',
      routes: [
        {
          element: <></>,
          label: 'InstanceTypes',
          path: '/virtualization/instance-types',
          title: 'InstanceTypes',
        },
        {
          element: <></>,
          label: 'Templates',
          path: '/virtualization/templates',
          title: 'Templates',
        },
      ],
    },
    {
      label: '',
      routes: [],
    },
    {
      label: 'User management',
      routes: [
        {
          element: <></>,
          label: 'Identities',
          path: '/user-management/identities',
          title: 'Identities',
        },
        {
          element: <></>,
          label: 'Roles',
          path: '/user-management/roles',
          title: 'Roles',
        },
        {
          element: <></>,
          label: 'Identity providers',
          path: '/user-management/identity-providers',
          title: 'Identity providers',
        },
      ],
    },
  ];

  const onPerspectiveSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    const perspectiveName = value as string;
    const perspective = perspectives.find((p) => p.name === perspectiveName);
    if (perspective && !perspective.disabled) {
      setActivePerspective(perspectiveName);
      setPerspectiveOpen(false);
    }
  };

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={redHatOpenShiftLogo} alt="Red Hat OpenShift" style={{ height: '40px' }} />
            <Label color="orange" isCompact>UXD prototype - work in progress</Label>
            <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--regular)' }}>
              Contact: {useCaseTitle && useCaseTitle.trim() !== ''
                ? useCaseTitle
                : useCase === 'use-case-aaq' || useCase === 'use-case-aaq-empty-states' 
                ? 'Anna Walker (slack @Anna Walker)' 
                : useCase === 'use-case-operator-lifecycle'
                ? 'Kevin Hatchoua (slack @Kevin Hatchoua)'
                : 'Stefan Kukla (slack @stefan)'}
            </span>
          </div>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight isStatic>
          <ToolbarContent>
            {/* Custom toolbar items (e.g. Prototype Selector) */}
            {customToolbarItems && (
              <ToolbarGroup>
                <ToolbarItem>
                  {customToolbarItems}
                </ToolbarItem>
              </ToolbarGroup>
            )}
            
            <ToolbarGroup align={{ default: 'alignEnd' }}>
              <ToolbarItem>
                <Button variant="plain" aria-label="Settings">
                  <Icon>
                    <CogIcon />
                  </Icon>
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="plain" aria-label="Help">
                  <Icon>
                    <QuestionCircleIcon />
                  </Icon>
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="plain" aria-label="Notifications">
                  <Icon>
                    <BellIcon />
                  </Icon>
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="plain" aria-label="User menu">
                  <span style={{ color: '#000000' }}>
                    {useCasePersona && useCasePersona.trim() !== ''
                      ? useCasePersona
                      : useCase === 'use-case-1' 
                      ? 'Adrian Veidt' 
                      : useCase === 'use-case-2' 
                      ? 'Walter Joseph Kovacs' 
                      : useCase === 'use-case-cclm'
                      ? 'Nelson Gardner'
                      : useCase === 'use-case-operator-lifecycle'
                      ? 'Kevin Hatchoua'
                      : useCase === 'use-case-empty-states' || useCase === 'use-case-aaq-empty-states'
                      ? 'Jane Designer'
                      : 'Dan Dreiberg'}
                  </span>
                  <Icon>
                    <CaretDownIcon />
                  </Icon>
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );

  const location = useLocation();

  const navRouteMatchesLocation = (route: IAppRoute): boolean => {
    if (route.path && route.path === location.pathname) {
      return true;
    }
    if (route.routes?.length) {
      return route.routes.some((child) => navRouteMatchesLocation(child));
    }
    return false;
  };

  const renderNavItem = (route: IAppRoute, keyId: string) => (
    <NavItem key={keyId} id={keyId.replace(/\s+/g, '-')} isActive={route.path === location.pathname}>
      <NavLink to={route.path}>{route.label}</NavLink>
    </NavItem>
  );

  const renderNavRoute = (route: IAppRoute, keyId: string): React.ReactNode => {
    if (route.routes && route.routes.length > 0 && route.label) {
      const active = navRouteMatchesLocation(route);
      return (
        <NavExpandable
          key={keyId}
          id={keyId.replace(/\s+/g, '-')}
          title={route.label}
          isActive={active}
          isExpanded={active}
        >
          {route.routes.map((child, i) => renderNavRoute(child, `${keyId}-c${i}`))}
        </NavExpandable>
      );
    }
    if (route.label) {
      return renderNavItem(route, keyId);
    }
    return null;
  };

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => {
    // For disabled groups, render as non-expandable nav items (just the group title, not clickable)
    if (group.disabled) {
      return (
        <NavItem key={`${group.label}-${groupIndex}`} disabled>
          {group.label}
        </NavItem>
      );
    }

    const groupActive = group.routes.some((route) => navRouteMatchesLocation(route));

    // For enabled groups, render as expandable
    return (
      <NavExpandable
        key={`${group.label}-${groupIndex}`}
        id={`${group.label}-${groupIndex}`}
        title={group.label}
        isActive={groupActive}
        isExpanded={groupActive}
      >
        {group.routes.map((route, idx) => renderNavRoute(route, `nav-${group.label}-${groupIndex}-r${idx}`))}
      </NavExpandable>
    );
  };

  const PerspectiveSelector = () => {
    return (
      <div className="perspective-selector" style={{ position: 'relative' }}>
        <button
            onClick={() => !impersonatingUser && setPerspectiveOpen(!perspectiveOpen)}
          style={{
            width: '100%',
            padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
            border: `1px solid var(--pf-t--global--border--color--default)`,
            borderRadius: perspectiveOpen 
              ? 'var(--pf-t--global--border--radius--small) var(--pf-t--global--border--radius--small) 0 0'
              : 'var(--pf-t--global--border--radius--small)',
            background: 'var(--pf-t--global--background--color--primary--default)',
            textAlign: 'left',
            cursor: impersonatingUser ? 'default' : 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 'var(--pf-t--global--font--size--body--default)',
            fontWeight: 'var(--pf-t--global--font--weight--body--default)',
            color: 'var(--pf-t--global--text--color--regular)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--pf-t--global--spacer--sm)' }}>
            {activePerspective === 'Fleet virtualization' ? (
              <img src={virtIcon} alt="Fleet virtualization" style={{ width: '20px', height: '20px' }} />
            ) : activePerspective === 'Fleet management' ? (
              <img src={multiclusterIcon} alt="Fleet management" style={{ width: '20px', height: '20px' }} />
            ) : (
              <CorePlatformsIcon size="20px" />
            )}
            <span>{activePerspective}</span>
          </div>
          {!impersonatingUser && <CaretDownIcon />}
        </button>
        
        {perspectiveOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '-1px',
              backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
              border: `1px solid var(--pf-t--global--border--color--default)`,
              borderRadius: '0 0 var(--pf-t--global--border--radius--small) var(--pf-t--global--border--radius--small)',
              boxShadow: 'var(--pf-t--global--box-shadow--lg)',
              zIndex: 9999,
              overflow: 'hidden',
            }}
          >
          {perspectives.map((perspective, index) => (
              <div
              key={index}
                onClick={() => {
                  if (!perspective.disabled) {
                    setActivePerspective(perspective.name);
                    setPerspectiveOpen(false);
                  }
                }}
                style={{
                  padding: 'var(--pf-t--global--spacer--sm) var(--pf-t--global--spacer--md)',
                  cursor: perspective.disabled ? 'not-allowed' : 'pointer',
                  opacity: perspective.disabled ? 0.6 : 1,
                  backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                  fontSize: 'var(--pf-t--global--font--size--body--default)',
                  color: perspective.disabled 
                    ? 'var(--pf-t--global--text--color--disabled)' 
                    : 'var(--pf-t--global--text--color--regular)',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--pf-t--global--spacer--sm)',
                }}
                onMouseEnter={(e) => {
                  if (!perspective.disabled) {
                    e.currentTarget.style.backgroundColor = 'var(--pf-t--global--background--color--action--hover--default)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--pf-t--global--background--color--primary--default)';
                }}
            >
              {perspective.name === 'Fleet virtualization' ? (
                <img src={virtIcon} alt="" style={{ width: '16px', height: '16px' }} />
              ) : perspective.name === 'Fleet management' ? (
                <img src={multiclusterIcon} alt="" style={{ width: '16px', height: '16px' }} />
              ) : (
                <CorePlatformsIcon size="16px" />
              )}
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <span>{perspective.name}</span>
                {perspective.disabled && (
                  <span style={{ 
                    marginLeft: 'var(--pf-t--global--spacer--xs)',
                    fontSize: 'var(--pf-t--global--font--size--body--default)',
                    color: 'var(--pf-t--global--text--color--disabled)'
                  }}>(disabled)</span>
                )}
              </span>
              </div>
          ))}
          </div>
        )}
    </div>
  );
  };

  // Check if RBAC prototype is active
  const isRBACPrototype = currentPrototypeId === 'fleet-admin-rbac' || 
                          currentPrototypeId === 'fleet-admin-rbac-v1.1' ||
                          currentPrototypeId === 'tenant-admin-access' || 
                          currentPrototypeId === 'acm-empty-states';

  // Helper function to create blank page route
  const createBlankRoute = (label: string, path: string, title: string): IAppRoute => ({
    element: <PageSection />,
    label,
    path,
    title,
  });

  // Helper function to convert prototype routes to navigation groups
  const convertPrototypeRoutesToNavigation = (prototypeRoutes: RouteConfig[]): IAppRouteGroup[] => {
    const routeConfigToNavLeaf = (route: RouteConfig): IAppRoute => ({
      element: route.element,
      label: route.label || '',
      path: route.path,
      title: route.title || '',
    });

    /** Flatten `navigation.subMenu` into nested `IAppRoute.routes` (e.g. Observe → AI Hub → …). */
    const buildGroupedNavRoutes = (routesInGroup: RouteConfig[]): IAppRoute[] => {
      const sorted = [...routesInGroup].sort((a, b) => (a.navigation?.order ?? 999) - (b.navigation?.order ?? 999));
      const seenSubMenus = new Set<string>();
      const out: IAppRoute[] = [];
      for (const r of sorted) {
        const sm = r.navigation?.subMenu?.trim();
        if (sm) {
          if (!seenSubMenus.has(sm)) {
            seenSubMenus.add(sm);
            const subRoutes = sorted
              .filter((x) => (x.navigation?.subMenu?.trim() ?? '') === sm)
              .sort((a, b) => (a.navigation?.subMenuOrder ?? 999) - (b.navigation?.subMenuOrder ?? 999));
            const leaves = subRoutes.map(routeConfigToNavLeaf);
            out.push({
              label: sm,
              element: <></>,
              path: leaves[0]?.path ?? '',
              title: sm,
              routes: leaves,
            });
          }
          continue;
        }
        out.push(routeConfigToNavLeaf(r));
      }
      return out;
    };

    // Group routes by navigation.group (empty string is valid for top-level items)
    const groupsMap = new Map<string, RouteConfig[]>();
    const ungroupedRoutes: RouteConfig[] = [];

    prototypeRoutes.forEach((route) => {
      if (route.label && route.navigation !== undefined) {
        const groupName = route.navigation.group || '';
        // Handle routes with empty group (top-level items)
        if (groupName === '') {
          ungroupedRoutes.push(route);
        } else {
          if (!groupsMap.has(groupName)) {
            groupsMap.set(groupName, []);
          }
          groupsMap.get(groupName)!.push(route);
        }
      }
    });

    // Convert to IAppRouteGroup[] format, sorted by order
    const groups: Array<{ group: IAppRouteGroup; firstOrder: number }> = [];

    // Add ungrouped routes (empty group) as individual groups
    ungroupedRoutes.sort((a, b) => {
      const orderA = a.navigation?.order || 999;
      const orderB = b.navigation?.order || 999;
      return orderA - orderB;
    });

    ungroupedRoutes.forEach((route) => {
      const order = route.navigation?.order || 999;
      groups.push({
        group: {
          label: '',
          routes: [routeConfigToNavLeaf(route)],
        },
        firstOrder: order,
      });
    });

    // Add grouped routes
    groupsMap.forEach((routes, groupName) => {
      routes.sort((a, b) => {
        const orderA = a.navigation?.order || 999;
        const orderB = b.navigation?.order || 999;
        return orderA - orderB;
      });

      const firstOrder = routes[0]?.navigation?.order || 999;

      groups.push({
        group: {
          label: groupName,
          routes: buildGroupedNavRoutes(routes),
        },
        firstOrder,
      });
    });

    // Sort groups by first route's order (or alphabetically)
    groups.sort((a, b) => {
      if (a.firstOrder !== b.firstOrder) return a.firstOrder - b.firstOrder;
      return a.group.label.localeCompare(b.group.label);
    });

    return groups.map((g) => g.group);
  };

  // Select routes based on active perspective
  let activeRoutes: IAppRouteGroup[] = [];
  
  if (isRBACPrototype && currentPrototypeId) {
    // RBAC prototypes: Show all navigation items, but use blank pages for hidden content
    if (activePerspective === 'Fleet management') {
      // Fleet management: Show all items, but only Clusters and User management have content
      const baseRoutes = routes.filter(route => route.label !== 'Core Platforms');
      activeRoutes = baseRoutes
        .filter((route): route is IAppRouteGroup => 'routes' in route && Array.isArray(route.routes))
        .map(group => {
          if (!group.routes || group.routes.length === 0) {
            // Skip groups with no routes
            return group;
          }
          
          if (group.label === 'Infrastructure') {
            // Only show Clusters, blank pages for others
            return {
              ...group,
              routes: group.routes.map(route => 
                route.label === 'Clusters' 
                  ? route 
                  : createBlankRoute(route.label || '', route.path, route.title)
              ),
            };
          } else if (group.label === 'User management') {
            // Keep User management as is (will be added below)
            return group;
          } else {
            // All other groups show blank pages
            return {
              ...group,
              routes: group.routes.map(route => 
                createBlankRoute(route.label || '', route.path, route.title)
              ),
            };
          }
        });
      
      // Ensure User management exists
      const hasUserManagement = activeRoutes.some(r => r.label === 'User management');
      if (!hasUserManagement) {
        const infrastructureIndex = activeRoutes.findIndex(r => r.label === 'Infrastructure');
        activeRoutes.splice(infrastructureIndex + 1, 0, {
          label: 'User management',
          routes: [
            { element: <div />, label: 'Identities', path: '/user-management/identities', title: 'ACM | Identities' },
            { element: <div />, label: 'Roles', path: '/user-management/roles', title: 'ACM | Roles' },
            { element: <></>, label: 'Identity providers', path: '/user-management/identity-providers', title: 'ACM | Identity Providers' },
          ],
        });
      }
    } else if (activePerspective === 'Fleet virtualization') {
      // Fleet virtualization: Show all items, but only Virtual machines and User management have content
      activeRoutes = fleetVirtualizationRoutes.map(group => {
        if (!group.routes || group.routes.length === 0) {
          // Skip groups with no routes
          return group;
        }
        
        if (group.label === '') {
          // Show Virtual machines, blank pages for others
          return {
            ...group,
            routes: group.routes.map(route => 
              route.label === 'Virtual machines'
                ? route
                : createBlankRoute(route.label || '', route.path, route.title)
            ),
          };
        } else if (group.label === 'User management') {
          // Keep User management as is
          return group;
        } else {
          // All other groups show blank pages
          return {
            ...group,
            routes: group.routes.map(route => 
              createBlankRoute(route.label || '', route.path, route.title)
            ),
          };
        }
      });
    } else if (activePerspective === 'Core platforms') {
      // Core platforms: Show all items, but only Projects, Virtualization, and User management have content
      activeRoutes = corePlatformsRoutes.map(group => {
        if (!group.routes || group.routes.length === 0) {
          // Skip groups with no routes
          return group;
        }
        
        if (group.label === 'Home') {
          // Only show Projects, blank pages for others
          return {
            ...group,
            routes: group.routes.map(route => 
              route.label === 'Projects'
                ? route
                : createBlankRoute(route.label || '', route.path, route.title)
            ),
          };
        } else if (group.label === 'Virtualization' || group.label === 'User Management') {
          // Keep Virtualization and User Management as is
          return group;
        } else {
          // All other groups show blank pages
          return {
            ...group,
            routes: group.routes.map(route => 
              createBlankRoute(route.label || '', route.path, route.title)
            ),
          };
        }
      });
    }
  } else {
    // Normal routing for non-RBAC prototypes
    // Start with default routes for the perspective
    activeRoutes = 
      activePerspective === 'Core platforms' ? corePlatformsRoutes :
      activePerspective === 'Fleet virtualization' ? fleetVirtualizationRoutes : 
      routes.filter(route => route.label !== 'Core Platforms') as IAppRouteGroup[];
    
    // If prototype has custom routes, merge them with default routes
    if (currentPrototypeId) {
      const prototype = prototypeRegistry.get(currentPrototypeId);
      if (prototype && prototype.routes && prototype.routes.length > 0) {
        // Filter prototype routes by perspective
        let filteredRoutes = prototype.routes;
        
        if (activePerspective === 'Fleet management') {
          // Fleet management: non-core (and non-virt) fleet routes, plus **Observe** pages under `/core/observe`
          // (multi-cluster Observe / AI Hub UX lives here while the rest of `/core` stays Core platforms–only).
          filteredRoutes = prototype.routes.filter((route) => {
            if (route.navigation === undefined) {
              return false;
            }
            const p = route.path;
            if (p.startsWith('/virtualization')) {
              return false;
            }
            if (p.startsWith('/core') && !p.startsWith('/core/observe')) {
              return false;
            }
            return true;
          });
          
          // For Cost Management prototype, filter by selected option (A or B)
          if (currentPrototypeId === 'stefan-costmanagement') {
            const selectedOption = sessionStorage.getItem('costManagementOption');
            if (selectedOption === 'integrated') {
              // Option B selected: Hide Option A routes (only show integrated routes if they have navigation)
              filteredRoutes = filteredRoutes.filter(route => 
                route.path.startsWith('/cost-management-integrated')
              );
            } else {
              // Option A selected (or default): Only show Option A routes
              filteredRoutes = filteredRoutes.filter(route => 
                route.path.startsWith('/cost-management') && 
                !route.path.startsWith('/cost-management-integrated')
              );
            }
          }
        } else if (activePerspective === 'Fleet virtualization') {
          // Fleet virtualization: routes that start with /virtualization or /user-management
          filteredRoutes = prototype.routes.filter(route => 
            (route.path.startsWith('/virtualization') || route.path.startsWith('/user-management')) &&
            route.navigation !== undefined
          );
        } else if (activePerspective === 'Core platforms') {
          // Core platforms: routes that start with /core
          filteredRoutes = prototype.routes.filter(route => 
            route.path.startsWith('/core') &&
            route.navigation !== undefined
          );
        }
        
        // If prototype has routes for this perspective, merge them with default routes
        if (filteredRoutes.length > 0) {
          const prototypeNavGroups = convertPrototypeRoutesToNavigation(filteredRoutes);
          
          // Merge prototype navigation groups with default routes
          // For each prototype group, check if a group with the same label exists in default routes
          prototypeNavGroups.forEach(protoGroup => {
            const existingGroupIndex = activeRoutes.findIndex(r => r.label === protoGroup.label);
            if (existingGroupIndex >= 0) {
              // Replace existing group with prototype group (prototype routes take precedence)
              activeRoutes[existingGroupIndex] = protoGroup;
            } else {
              // Add new group at the end
              activeRoutes.push(protoGroup);
            }
          });
        }
      }
    }
  }

  // Filter out "User management" from Fleet virtualization when impersonating
  if (impersonatingUser && activePerspective === 'Fleet virtualization') {
    activeRoutes = activeRoutes.filter((route) => route.label !== 'User management');
  }

  // For stefan-newfeature prototype: only show Home (non-expandable) and hide all other navigation
  if (currentPrototypeId === 'stefan-newfeature' && activePerspective === 'Core platforms') {
    // Find Home route - check prototype routes first, then default routes
    let homeRoute: IAppRoute | undefined;
    
    // Check if prototype has a Home route
    const prototype = prototypeRegistry.get('stefan-newfeature');
    if (prototype && prototype.routes) {
      const protoHomeRoute = prototype.routes.find(r => 
        r.label === 'Home' && r.path.startsWith('/core')
      );
      if (protoHomeRoute) {
        homeRoute = {
          label: protoHomeRoute.label || 'Home',
          path: protoHomeRoute.path,
          title: protoHomeRoute.title || protoHomeRoute.label || 'Home',
          element: protoHomeRoute.element || <></>
        };
      }
    }
    
    // If not found in prototype routes, check default Home group
    if (!homeRoute) {
      const homeGroup = activeRoutes.find(route => route.label === 'Home');
      if (homeGroup && homeGroup.routes && homeGroup.routes.length > 0) {
        homeRoute = homeGroup.routes[0];
      }
    }
    
    // Replace all navigation with just Home (as a single non-expandable item)
    if (homeRoute) {
      activeRoutes = [{
        label: homeRoute.label || 'Home',
        path: homeRoute.path,
        title: homeRoute.title || homeRoute.label || 'Home',
        element: homeRoute.element || <></>
      } as unknown as IAppRouteGroup]; // Cast to IAppRouteGroup for type compatibility
    } else {
      // If no Home route found, show empty navigation
      activeRoutes = [];
    }
  }

  const Navigation = (
    <Nav id="nav-primary-simple">
      <PerspectiveSelector />
      <NavList id="nav-list-simple">
        {activeRoutes.map((route, idx) => {
          // Handle groups with empty labels (for dividers)
          if (route.routes && route.label === '') {
            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div
                    style={{
                      borderTop: '1px solid var(--pf-t--global--border--color--default)',
                      margin: 'var(--pf-t--global--spacer--md) 0',
                    }}
                  />
                )}
                {route.routes.map(
                  (subRoute, subIdx) =>
                    subRoute.label && renderNavRoute(subRoute, `nav-flat-${idx}-r${subIdx}`)
                )}
              </React.Fragment>
            );
          }
          // Handle regular routes and groups
          if (route.label) {
            if ('routes' in route && route.routes) {
              return renderNavGroup(route, idx);
            } else if (!('routes' in route) && 'path' in route && 'element' in route && 'title' in route) {
              return renderNavRoute(route as unknown as IAppRoute, `nav-top-${idx}`);
            }
          }
          return null;
        })}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer?.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );

  return (
    <>
    {topBanner && topBanner}
    <UseCaseBanner />
    <div style={{ paddingTop: useCase ? '48px' : '0' }}>
    <Page
      mainContainerId={pageId}
      masthead={masthead}
      sidebar={sidebarOpen && Sidebar}
      skipToContent={PageSkipToContent}
    >
      {impersonatingUser && (
        <Banner isSticky style={{ padding: '16px 24px', backgroundColor: '#E7F1FA', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            You are currently impersonating as <strong>{impersonatingUser}</strong>.
            {impersonatingGroups.length > 0 && (
              <> You have also preselected the following group{impersonatingGroups.length > 1 ? 's' : ''}: <strong>{impersonatingGroups.join(', ')}</strong>.</>
            )}{' '}
            <Button variant="link" isInline onClick={stopImpersonation} style={{ padding: 0, fontSize: 'inherit' }}>
              Stop impersonating
            </Button>
          </div>
        </Banner>
      )}
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 200px)'
        }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <ActivePerspectiveProvider value={activePerspectiveContextValue}>{children}</ActivePerspectiveProvider>
      )}
    </Page>

      {/* Floating Action Button */}
      <Button
        variant="primary"
        onClick={() => setIsTaskModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
        }}
        aria-label="View task details"
      >
        <InfoCircleIcon />
      </Button>

      {/* Task Details Modal */}
      <Modal
        variant={ModalVariant.medium}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        aria-label="Research task instructions"
      >
        <div style={{ padding: '24px' }}>
          <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            Your task
          </Title>
          
          <Content component="p" style={{ 
            marginBottom: 'var(--pf-t--global--spacer--lg)',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Complete the task, navigate naturally, there are no wrong approaches. Share what you are looking for and what you expect to happen.
          </Content>

          {useCase === 'use-case-1' && (
            <>
              <Content component="p" style={{ 
                marginBottom: 'var(--pf-t--global--spacer--md)',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Get in the role of Adrian Veidt, Fleet administrator in a telco company called Petemobile.
              </Content>

              <Card style={{ backgroundColor: '#f0f8ff', border: '1px solid #cce5ff' }}>
                <CardBody>
                  <Content component="p" style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--sm)',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    Your task is to:
                  </Content>

                  <Content component="p" style={{ 
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0
                  }}>
                    Give user <strong>Walter Kovacs</strong><br />
                    Role <strong>Cluster set admin</strong><br />
                    on these cluster sets <strong>petemobile-na-prod</strong>, <strong>petemobile-eu-prod</strong>, <strong>petemobile-sa-prod</strong>, <strong>petemobile-apac-prod</strong>, <strong>petemobile-dev-clusters</strong>
                  </Content>
                </CardBody>
              </Card>
            </>
          )}

          {useCase === 'use-case-2' && (
            <>
              <Content component="p" style={{ 
                marginBottom: 'var(--pf-t--global--spacer--md)',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Get in the role of Walter Joseph Kovacs, Tenant administrator in a telco company called Petemobile.
              </Content>

              <Card style={{ backgroundColor: '#f0f8ff', border: '1px solid #cce5ff' }}>
                <CardBody>
                  <Content component="p" style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--sm)',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    Your task is to:
                  </Content>

                  <Content component="p" style={{ 
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0
                  }}>
                    Give group <strong>dev-team-alpha</strong><br />
                    Role <strong>Virtualization admin</strong><br />
                    on the project <strong>project-starlight-dev</strong>, that span across clusters <strong>dev-team-a</strong> and <strong>dev-team-b</strong>, on the cluster set <strong>petemobile-dev-clusters</strong>
                  </Content>
                </CardBody>
              </Card>
            </>
          )}

          {useCase === 'use-case-aaq' && (
            <>
              <Content component="p" style={{ 
                marginBottom: 'var(--pf-t--global--spacer--md)',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Get in the role of Dan Dreiberg, Virtualization administrator managing OpenShift Virtualization (CNV) at Petemobile, a telco company.
              </Content>

              <Card style={{ backgroundColor: '#f0f8ff', border: '1px solid #cce5ff' }}>
                <CardBody>
                  <Content component="p" style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--sm)',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    Your task is to:
                  </Content>

                  <Content component="p" style={{ 
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0
                  }}>
                    Create a quota, based on your needs.
                  </Content>
                </CardBody>
              </Card>
            </>
          )}

          {useCase === 'use-case-cclm' && (
            <>
              <Content component="p" style={{ 
                marginBottom: 'var(--pf-t--global--spacer--md)',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Get in the role of Nelson Gardner, Platform administrator managing OpenShift Virtualization at Petemobile, a telco company.
              </Content>

              <Card style={{ backgroundColor: '#f0f8ff', border: '1px solid #cce5ff' }}>
                <CardBody>
                  <Content component="p" style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--sm)',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    Your task is to:
                  </Content>

                  <Content component="p" style={{ 
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0
                  }}>
                    Move <strong>80 running VMs</strong> from <strong>core-billing</strong> project in the <strong>us-east-prod-02</strong> cluster to <strong>us-west-prod-01</strong> cluster. Because you are planning to delete the Cluster.
                  </Content>
                </CardBody>
              </Card>
            </>
          )}

          {useCase === 'use-case-operator-lifecycle' && (
            <>
              <Content component="p" style={{ 
                marginBottom: 'var(--pf-t--global--spacer--md)',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Get in the role of Kevin Hatchoua, OpenShift Administrator managing operator lifecycle at Petemobile, a telco company.
              </Content>

              <Card style={{ backgroundColor: '#f0f8ff', border: '1px solid #cce5ff' }}>
                <CardBody>
                  <Content component="p" style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--sm)',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    Your task is to:
                  </Content>

                  <Content component="p" style={{ 
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0
                  }}>
                    Explore the unified software catalog to discover and browse operators available from multiple sources (Marketplace, Community, Red Hat).
                  </Content>
                </CardBody>
              </Card>
            </>
          )}

          {useCase === 'use-case-empty-states' && (
            <>
              <Content component="p" style={{ 
                marginBottom: 'var(--pf-t--global--spacer--md)',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Get in the role of Jane Designer, UX Designer exploring ACM RBAC empty state patterns.
              </Content>

              <Card style={{ backgroundColor: '#f0f8ff', border: '1px solid #cce5ff' }}>
                <CardBody>
                  <Content component="p" style={{ 
                    marginBottom: 'var(--pf-t--global--spacer--sm)',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    Your task is to:
                  </Content>

                  <Content component="p" style={{ 
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0
                  }}>
                    Explore and evaluate ACM RBAC empty state designs across clusters, users, groups, roles, and projects pages.
                  </Content>
                </CardBody>
              </Card>
            </>
          )}

          <div style={{
            marginTop: 'var(--pf-t--global--spacer--lg)',
            paddingTop: 'var(--pf-t--global--spacer--md)',
            borderTop: '1px solid var(--pf-t--global--border--color--default)'
          }}>
            <Content component="p" style={{ 
              fontSize: '14px',
              color: 'var(--pf-t--global--text--color--subtle)',
              textAlign: 'center',
              marginBottom: 'var(--pf-t--global--spacer--md)'
            }}>
              You can reopen this task at any time by clicking the info icon in the bottom right corner.
            </Content>

            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <Button variant="primary" onClick={() => setIsTaskModalOpen(false)}>
                Start task
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
};

export { AppLayout };
