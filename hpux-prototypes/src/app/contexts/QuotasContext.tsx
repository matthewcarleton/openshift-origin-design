import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Quota {
  id: number;
  name: string;
  scope: string;
  cpuUsed: number;
  cpuTotal: number;
  memoryUsed: number;
  memoryTotal: number;
  vmUsed: number;
  vmTotal: number;
  status: string;
  created: string;
}

interface QuotasContextType {
  quotas: Quota[];
  addQuota: (quota: Omit<Quota, 'id' | 'cpuUsed' | 'memoryUsed' | 'vmUsed' | 'status' | 'created'>) => void;
  updateQuota: (id: number, quota: Partial<Quota>) => void;
  deleteQuota: (id: number) => void;
  findQuotaByName: (name: string) => Quota | undefined;
}

const QuotasContext = createContext<QuotasContextType | undefined>(undefined);

export const QuotasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with mock data
  const [quotas, setQuotas] = useState<Quota[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: 'dev-cluster-virt-quota',
      scope: 'open-cluster-management',
      cpuUsed: 32,
      cpuTotal: 64,
      memoryUsed: 64,
      memoryTotal: 256,
      vmUsed: 10,
      vmTotal: 12,
      status: 'Active',
      created: 'Oct 22, 2025 2:14 pm',
    }))
  );

  const addQuota = (quota: Omit<Quota, 'id' | 'cpuUsed' | 'memoryUsed' | 'vmUsed' | 'status' | 'created'>) => {
    // Generate realistic usage values (30-60% of total)
    const cpuUsagePercent = 0.3 + Math.random() * 0.3; // 30-60%
    const memoryUsagePercent = 0.3 + Math.random() * 0.3; // 30-60%
    const vmUsagePercent = 0.3 + Math.random() * 0.3; // 30-60%
    
    const newQuota: Quota = {
      ...quota,
      id: Math.max(...quotas.map(q => q.id), 0) + 1,
      cpuUsed: Math.floor(quota.cpuTotal * cpuUsagePercent),
      memoryUsed: Math.floor(quota.memoryTotal * memoryUsagePercent),
      vmUsed: Math.floor(quota.vmTotal * vmUsagePercent),
      status: 'Active',
      created: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
    };
    setQuotas([newQuota, ...quotas]);
  };

  const updateQuota = (id: number, updatedFields: Partial<Quota>) => {
    setQuotas(quotas.map(quota => 
      quota.id === id ? { ...quota, ...updatedFields } : quota
    ));
  };

  const deleteQuota = (id: number) => {
    setQuotas(quotas.filter(quota => quota.id !== id));
  };

  const findQuotaByName = (name: string) => {
    return quotas.find(quota => quota.name === name);
  };

  return (
    <QuotasContext.Provider value={{ quotas, addQuota, updateQuota, deleteQuota, findQuotaByName }}>
      {children}
    </QuotasContext.Provider>
  );
};

export const useQuotas = () => {
  const context = useContext(QuotasContext);
  if (context === undefined) {
    throw new Error('useQuotas must be used within a QuotasProvider');
  }
  return context;
};

