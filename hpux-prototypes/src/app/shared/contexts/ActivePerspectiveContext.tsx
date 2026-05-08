import React, { createContext, useContext } from 'react';

/** Display names used by `AppLayout` perspective switcher (sidebar, top). */
export type AppShellPerspectiveName = 'Core platforms' | 'Fleet management' | 'Fleet virtualization';

export type AppShellPerspectiveKey = 'core-platforms' | 'fleet-management' | 'fleet-virtualization';

export type ActivePerspectiveContextValue = {
  activePerspective: AppShellPerspectiveName | string;
  /** Switch the shell perspective when the option is enabled for this session (e.g. drill-down from fleet tiles). */
  setPerspectiveByKey: (key: AppShellPerspectiveKey) => void;
};

const ActivePerspectiveContext = createContext<ActivePerspectiveContextValue | null>(null);

export const ActivePerspectiveProvider: React.FC<{
  value: ActivePerspectiveContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <ActivePerspectiveContext.Provider value={value}>{children}</ActivePerspectiveContext.Provider>
);

/**
 * Current console perspective from the main nav switcher. When used outside `AppLayout` (e.g. tests),
 * defaults to Fleet management with a no-op setter.
 */
export function useActivePerspective(): ActivePerspectiveContextValue {
  const v = useContext(ActivePerspectiveContext);
  if (!v) {
    return {
      activePerspective: 'Fleet management',
      setPerspectiveByKey: () => {},
    };
  }
  return v;
}
