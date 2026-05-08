// Custom hook to access the correct database based on use case context
import { useUseCaseContext } from '@app/contexts/UseCaseContext';

export const useData = () => {
  const { database } = useUseCaseContext();
  return database;
};

