/**
 * Prototype Layout Wrapper
 *
 * Wraps each prototype with AppLayout. Version / use-case switching and Copy URL for hub embeds
 * live in the hub fullscreen top bar (`/embed/hpux-prototypes`).
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  PageSection,
  Button,
  Drawer,
  DrawerContent,
} from '@patternfly/react-core';
import { OutlinedStickyNoteIcon } from '@patternfly/react-icons';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { PrototypeModule } from './types';
import { QuotasProvider } from '@app/shared/contexts/QuotasContext';
import { DesignNotesDrawerPanel } from './DesignNotesDrawer';

interface PrototypeLayoutProps {
  prototype: PrototypeModule;
}

export const PrototypeLayout: React.FC<PrototypeLayoutProps> = ({ prototype }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const ownerDisplayName = prototype.config.owner.slack
    ? `${prototype.config.owner.name} (slack ${prototype.config.owner.slack})`
    : prototype.config.owner.name;

  // Handle root route redirect for specific prototypes
  useEffect(() => {
    const withQs = (partial: { pathname: string }) => ({
      ...partial,
      search: location.search,
      hash: location.hash,
    });

    // Only normalize `/` (or empty) → default entry route. Broader "substring" redirects used to fire on
    // every pathname change and overwrote in-prototype links (e.g. fleet RBAC → roles, operator-lifecycle → installed).
    if (prototype.config.id === 'virtualization-quotas') {
      if (location.pathname === '/' || location.pathname === '') {
        navigate(withQs({ pathname: '/core/virtualization/quotas' }), { replace: true });
      }
    } else if (prototype.config.id === 'operator-lifecycle') {
      if (location.pathname === '/' || location.pathname === '') {
        navigate(withQs({ pathname: '/core/operators/hub' }), { replace: true });
      }
    } else if (prototype.config.id === 'cross-cluster-migration') {
      if (location.pathname === '/' || location.pathname === '') {
        navigate(withQs({ pathname: '/virtualization/virtual-machines' }), { replace: true });
      }
    } else if (prototype.config.id === 'fleet-admin-rbac' || prototype.config.id === 'fleet-admin-rbac-v1.1') {
      if (location.pathname === '/' || location.pathname === '') {
        navigate(withQs({ pathname: '/infrastructure/clusters' }), { replace: true });
      }
    } else if (prototype.config.id === 'stefans-acmintegration') {
      if (location.pathname === '/' || location.pathname === '') {
        navigate(withQs({ pathname: '/automation/decision-environments' }), { replace: true });
      }
    } else if (prototype.config.id === 'stefan-costmanagement') {
      if (location.pathname === '/' || location.pathname === '') {
        const option = sessionStorage.getItem('costManagementOption');
        if (option === 'integrated') {
          navigate(withQs({ pathname: '/cost-management-integrated/overview' }), { replace: true });
        } else {
          navigate(withQs({ pathname: '/cost-management/overview' }), { replace: true });
        }
      }
    } else {
      // For other prototypes, check if we're on the root path and prototype has a redirect route
      if (location.pathname === '/' || location.pathname === '') {
        const rootRoute = prototype.routes.find(route => route.path === '/');
        if (rootRoute && rootRoute.element && React.isValidElement(rootRoute.element)) {
          // If root route is a Navigate component, extract the 'to' prop
          const navigateElement = rootRoute.element as React.ReactElement<{ to: string; replace?: boolean }>;
          if (navigateElement.type === Navigate || (navigateElement.props && navigateElement.props.to)) {
            const targetPath = navigateElement.props.to;
            if (targetPath) {
              navigate(withQs({ pathname: targetPath }), { replace: true });
            }
          }
        }
      }
    }
  }, [location.pathname, location.search, location.hash, prototype.routes, prototype.config.id, navigate]);

  const hasDesignNotes = Boolean(prototype.config.designNotes);

  const designNotesButton = hasDesignNotes ? (
    <Button
      variant="primary"
      size="sm"
      icon={<OutlinedStickyNoteIcon />}
      onClick={() => setIsDrawerOpen(prev => !prev)}
      aria-expanded={isDrawerOpen}
    >
      Design Notes
    </Button>
  ) : null;

  const drawerPanelContent = hasDesignNotes ? (
    <DesignNotesDrawerPanel
      prototype={prototype}
      onClose={() => setIsDrawerOpen(false)}
    />
  ) : <></>;

  return (
    <QuotasProvider>
      <Drawer
        isExpanded={isDrawerOpen && hasDesignNotes}
        position="end"
        style={{ height: '100vh' }}
      >
        <DrawerContent
          panelContent={drawerPanelContent}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <AppLayout
            useCaseTitle={ownerDisplayName}
            useCasePersona={prototype.config.persona.name}
            enabledPerspectives={prototype.config.perspectives}
            currentPrototypeId={prototype.config.id}
            customToolbarItems={designNotesButton}
          >
            <Routes>
              {prototype.routes.map((route, index) => (
                <Route
                  key={route.path || index}
                  path={route.path}
                  element={route.element}
                />
              ))}

              {/* Fallback / catch-all route - show blank page instead of defaulting to first route */}
              <Route path="*" element={<PageSection />} />
            </Routes>
          </AppLayout>
        </DrawerContent>
      </Drawer>
    </QuotasProvider>
  );
};
