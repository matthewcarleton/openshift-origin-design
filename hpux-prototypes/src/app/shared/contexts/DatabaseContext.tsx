// Database Context - Routes to correct database based on active perspective
// Core platforms → singleClusterDatabase
// Fleet virtualization → globalMockDatabase
// Fleet management → globalMockDatabase

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { globalMockDatabase } from '@app/data/globalMockDatabase';
import { singleClusterDatabase } from '@app/data/singleClusterDatabase';

type PerspectiveName = 'Core platforms' | 'Fleet virtualization' | 'Fleet management';

interface DatabaseContextType {
  activePerspective: PerspectiveName;
  setActivePerspective: (perspective: PerspectiveName) => void;
  database: typeof globalMockDatabase;
  isSingleCluster: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

interface DatabaseProviderProps {
  children: ReactNode;
  initialPerspective?: PerspectiveName;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ 
  children, 
  initialPerspective = 'Fleet management' 
}) => {
  const [activePerspective, setActivePerspective] = useState<PerspectiveName>(initialPerspective);

  // Determine which database to use based on perspective
  const isSingleCluster = activePerspective === 'Core platforms';
  const database = isSingleCluster ? singleClusterDatabase : globalMockDatabase;

  // Listen for perspective changes from AppLayout and update window for queries.ts
  useEffect(() => {
    // Initialize window with current perspective
    (window as any).__activePerspective = initialPerspective;
    
    const handlePerspectiveChange = (event: CustomEvent<PerspectiveName>) => {
      setActivePerspective(event.detail);
      // Store in window for queries.ts to access
      (window as any).__activePerspective = event.detail;
    };

    window.addEventListener('perspective-changed' as any, handlePerspectiveChange);
    return () => {
      window.removeEventListener('perspective-changed' as any, handlePerspectiveChange);
    };
  }, [initialPerspective]);

  return (
    <DatabaseContext.Provider value={{ activePerspective, setActivePerspective, database, isSingleCluster }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};

// Helper function to get database based on perspective name
export const getDatabaseForPerspective = (perspective: PerspectiveName) => {
  return perspective === 'Core platforms' ? singleClusterDatabase : globalMockDatabase;
};

