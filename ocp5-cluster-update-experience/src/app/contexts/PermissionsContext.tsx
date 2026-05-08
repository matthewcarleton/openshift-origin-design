import { createContext, useContext, useState, ReactNode } from 'react';

interface ImpersonatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface PermissionsContextType {
  impersonatedUser: ImpersonatedUser | null;
  hasAdminPermissions: boolean;
  setImpersonatedUser: (user: ImpersonatedUser | null) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [impersonatedUser, setImpersonatedUser] = useState<ImpersonatedUser | null>(null);

  // Check if current user has admin permissions
  // Only Cluster Admin role has full admin permissions
  const hasAdminPermissions = !impersonatedUser || impersonatedUser.role === 'Cluster Admin';

  return (
    <PermissionsContext.Provider value={{ impersonatedUser, hasAdminPermissions, setImpersonatedUser }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}
