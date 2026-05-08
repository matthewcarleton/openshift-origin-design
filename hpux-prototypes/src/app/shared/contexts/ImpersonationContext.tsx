import * as React from 'react';

interface ImpersonationContextType {
  impersonatingUser: string | null;
  impersonatingGroups: string[];
  isLoading: boolean;
  startImpersonation: (username: string, groups: string[]) => void;
  stopImpersonation: () => void;
}

const ImpersonationContext = React.createContext<ImpersonationContextType | undefined>(undefined);

export const ImpersonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [impersonatingUser, setImpersonatingUser] = React.useState<string | null>(null);
  const [impersonatingGroups, setImpersonatingGroups] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const startImpersonation = (username: string, groups: string[] = []) => {
    setIsLoading(true);
    // Simulate loading for 1-3 seconds (we'll use 2 seconds)
    setTimeout(() => {
      setImpersonatingUser(username);
      setImpersonatingGroups(groups);
      setIsLoading(false);
    }, 2000);
  };

  const stopImpersonation = () => {
    setImpersonatingUser(null);
    setImpersonatingGroups([]);
  };

  return (
    <ImpersonationContext.Provider value={{ impersonatingUser, impersonatingGroups, isLoading, startImpersonation, stopImpersonation }}>
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const context = React.useContext(ImpersonationContext);
  if (context === undefined) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
};

