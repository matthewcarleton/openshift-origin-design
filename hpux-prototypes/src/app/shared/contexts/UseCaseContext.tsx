import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockDatabase } from '@app/data/mockDatabase';
import { globalMockDatabase } from '@app/data/globalMockDatabase';

/**
 * @deprecated This context is deprecated. Use PrototypeContext from @app/core instead.
 * 
 * This is kept for backward compatibility during migration.
 * Old use-case-* prototypes have been migrated to src/app/prototypes/
 */

// Use case types for the application (DEPRECATED - migrated to prototypes/)
export type UseCaseType = null;

interface UseCaseContextType {
  useCase: UseCaseType;
  setUseCase: (useCase: any) => void; // Changed to any for backward compatibility
  database: typeof mockDatabase | typeof globalMockDatabase;
  useCaseTitle: string;
  useCasePersona: string;
}

const UseCaseContext = createContext<UseCaseContextType | undefined>(undefined);

export const UseCaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [useCase, setUseCase] = useState<UseCaseType>(null);

  // DEPRECATED: Old use-cases migrated to src/app/prototypes/
  // This context is kept for backward compatibility only
  const database = mockDatabase;
  const useCaseTitle = '';
  const useCasePersona = '';

  return (
    <UseCaseContext.Provider 
      value={{ 
        useCase, 
        setUseCase, 
        database, 
        useCaseTitle, 
        useCasePersona 
      }}
    >
      {children}
    </UseCaseContext.Provider>
  );
};

export const useUseCaseContext = () => {
  const context = useContext(UseCaseContext);
  if (!context) {
    throw new Error('useUseCaseContext must be used within UseCaseProvider');
  }
  return context;
};

