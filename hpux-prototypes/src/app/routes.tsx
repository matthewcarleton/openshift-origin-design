import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Support } from '@app/Support/Support';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
// DEPRECATED: HubVirtualMachines moved to prototypes
// import { HubVirtualMachines } from '@app/CorePlatforms/HubVirtualMachines';
import { NotFound } from '@app/NotFound/NotFound';
import { Search } from '@app/Search/Search';
// DEPRECATED: Shared Fleet Virtualization components moved to prototypes
// Each prototype now has its own local copies
// import Virtualization from '@app/shared-fleet-virtualization/Virtualization';
// import { Catalog } from '@app/shared-fleet-virtualization/Catalog';
// import { Templates } from '@app/shared-fleet-virtualization/Templates';
// import { InstanceTypes } from '@app/shared-fleet-virtualization/InstanceTypes';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  disabled?: boolean;
  /** When set, sidebar renders this entry as a nested expandable (sub-menu) with these child links. */
  routes?: IAppRoute[];
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
  disabled?: boolean;
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

// DEPRECATED: These routes are from the old use-case system
// All prototypes now live in src/app/prototypes/ and are loaded via deep links
// This file is kept only for any shared/common routes that aren't prototype-specific
const routes: AppRouteConfig[] = [
  {
    label: 'Home',
    routes: [
      {
        element: <Dashboard />,
        label: 'Overview',
        path: '/',
        title: 'ACM | Home',
      },
    ],
  },
  {
    element: <Search />,
    label: 'Search',
    path: '/search',
    title: 'ACM | Search',
  },
  {
    label: 'Infrastructure',
    routes: [
      {
        element: <Dashboard />,
        label: 'Clusters',
        path: '/infrastructure/clusters',
        title: 'ACM | Clusters',
      },
      {
        element: <Dashboard />,
        label: 'Automation',
        path: '/infrastructure/automation',
        title: 'ACM | Automation',
      },
      {
        element: <Dashboard />,
        label: 'Host inventory',
        path: '/infrastructure/host-inventory',
        title: 'ACM | Host Inventory',
      },
    ],
  },
  {
    label: 'Applications',
    disabled: true,
    routes: [
      {
        element: <Dashboard />,
        label: 'Overview',
        path: '/applications/overview',
        title: 'ACM | Applications',
      },
    ],
  },
  {
    label: 'Credentials',
    disabled: true,
    routes: [
      {
        element: <Dashboard />,
        label: 'Overview',
        path: '/credentials/overview',
        title: 'ACM | Credentials',
      },
    ],
  },
  {
    label: 'Observe',
    disabled: true,
    routes: [
      {
        element: <Dashboard />,
        label: 'Overview',
        path: '/observe/overview',
        title: 'ACM | Observe',
      },
    ],
  },
  {
    label: 'Edge management',
    disabled: true,
    routes: [
      {
        element: <Dashboard />,
        label: 'Overview',
        path: '/edge-management/overview',
        title: 'ACM | Edge Management',
      },
    ],
  },
];

// Additional routes without navigation labels (won't appear in sidebar)
const hiddenRoutes: IAppRoute[] = [];

const flattenedRoutes: IAppRoute[] = [
  ...routes.reduce((flattened, route): IAppRoute[] => {
    // `IAppRouteGroup` has child `routes` but no `path`; `IAppRoute` may also have nested `routes` for sidebar only.
    if ('routes' in route && route.routes && !('path' in route)) {
      return [...flattened, ...route.routes];
    }
    return [...flattened, route as IAppRoute];
  }, [] as IAppRoute[]),
  ...hiddenRoutes,
];

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
