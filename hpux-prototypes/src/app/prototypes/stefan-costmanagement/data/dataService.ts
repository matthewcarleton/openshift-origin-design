import mockDatabase from './mockDatabase.json';

// Type definitions
export interface Company {
  name: string;
  industry: string;
  totalMonthlyCost: number;
  currency: string;
}

export interface Cluster {
  id: string;
  name: string;
  displayName: string;
  status: string;
  version: string;
  nodeCount: number;
  cost: number;
  monthOverMonthChange: number;
  region: string;
  provider: string;
  costModelId: string;
  operatorVersion: string;
  integrationId: string;
  awsIntegrationId?: string;
  cpuCapacity: number;
  memoryCapacityGiB: number;
  storageCapacityGiB: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  storageUsagePercent: number;
}

export interface Project {
  id: string;
  name: string;
  clusterId: string;
  cost: number;
  cpuUsage: number;
  memoryUsageGiB: number;
  storageUsageGiB: number;
  tags: {
    [key: string]: string;
  };
}

export interface Node {
  id: string;
  name: string;
  clusterId: string;
  provider: string;
  instanceType: string;
  nodeType: string;
  cost: number;
  cpuCapacity: number;
  memoryCapacityGiB: number;
  monthOverMonthChange: number;
  architecture: string;
}

export interface AWSAccount {
  id: string;
  name: string;
  displayName: string;
  accountNumber: string;
  cost: number;
  usageDateCost: number;
  invoiceMonthCost: number;
  crossOverAmount: number;
  hasCrossOver: boolean;
  crossOverDirection: 'to-next-month' | 'from-prev-month';
  crossOverNote?: string;
  crossOverPeriod?: {
    usageDates: string[];
    invoiceMonth: string;
    daysInThreshold: number;
  };
  monthOverMonthChange: number;
  costModelId: string;
  services: AWSService[];
}

export interface AWSService {
  name: string;
  code: string;
  cost: number;
  regions: ServiceRegion[];
}

export interface ServiceRegion {
  name: string;
  cost: number;
}

export interface GCPAccount {
  id: string;
  name: string;
  displayName: string;
  billingAccountId: string;
  cost: number;
  usageDateCost: number;
  invoiceMonthCost: number;
  crossOverAmount: number;
  hasCrossOver: boolean;
  crossOverDirection: 'to-next-month' | 'from-prev-month';
  crossOverNote?: string;
  crossOverPeriod?: {
    usageDates: string[];
    invoiceMonth: string;
    daysInThreshold: number;
  };
  monthOverMonthChange: number;
  costModelId: string;
  projects: GCPProject[];
}

export interface GCPProject {
  id: string;
  name: string;
  displayName: string;
  cost: number;
  tags: {
    [key: string]: string;
  };
  services: GCPService[];
}

export interface GCPService {
  name: string;
  code: string;
  cost: number;
  regions: ServiceRegion[];
  note?: string;
}

export interface AzureAccount {
  id: string;
  name: string;
  displayName: string;
  subscriptionId: string;
  cost: number;
  usageDateCost: number;
  invoiceMonthCost: number;
  crossOverAmount: number;
  hasCrossOver: boolean;
  crossOverDirection: 'to-next-month' | 'from-prev-month';
  crossOverNote?: string;
  crossOverPeriod?: {
    usageDates: string[];
    invoiceMonth: string;
    daysInThreshold: number;
  };
  monthOverMonthChange: number;
  costModelId: string;
  services: AzureService[];
}

export interface AzureService {
  name: string;
  code: string;
  cost: number;
  regions: ServiceRegion[];
}

export interface CostModel {
  id: string;
  name: string;
  description: string;
  sourceType: string;
  currency: string;
  markupRate: number;
  isDiscount: boolean;
  lastModified: string;
  createdDate: string;
}

export interface Tag {
  id: string;
  key: string;
  values: string[];
  enabled: boolean;
  integrations: string[];
}

export interface TagMapping {
  id: string;
  parentKey: string;
  childKeys: Array<{
    source: string;
    key: string;
    description: string;
  }>;
  enabled: boolean;
  lastModified: string;
}

export interface CostCategory {
  id: string;
  name: string;
  description: string;
  rules: Array<{
    type: string;
    key?: string;
    operator: string;
    value: string | string[];
  }>;
  color: string;
  enabled: boolean;
  estimatedMonthlyCost: number;
  createdDate: string;
  lastModified: string;
}

export interface PlatformProject {
  id: string;
  name: string;
  displayName: string;
  type: string;
  description: string;
  isPlatformOverhead: boolean;
  isSystemNamespace: boolean;
  costAllocationMethod: string;
  enabled: boolean;
}

// Data Service Class
class DataService {
  private data = mockDatabase;

  // Company Information
  getCompany(): Company {
    return this.data.company;
  }

  // OpenShift Data
  getAllClusters(): Cluster[] {
    return this.data.openshift.clusters.map(cluster => ({
      ...cluster,
      integrationId: cluster.integrationId || '',
    })) as Cluster[];
  }

  getClusterById(clusterId: string): Cluster | undefined {
    const cluster = this.data.openshift.clusters.find(c => c.id === clusterId);
    if (!cluster) return undefined;
    return {
      ...cluster,
      integrationId: cluster.integrationId || '',
    } as Cluster;
  }

  getOpenShiftTotalCost(): number {
    return this.data.openshift.totalCost;
  }

  getOpenShiftMoMChange(): number {
    return this.data.openshift.monthOverMonthChange;
  }

  // Projects
  getAllProjects(): Project[] {
    return this.data.openshift.projects.map(project => ({
      ...project,
      tags: Object.fromEntries(
        Object.entries(project.tags || {}).filter(([_, v]) => v !== undefined)
      ) as { [key: string]: string }
    })) as Project[];
  }

  getProjectsByClusterId(clusterId: string): Project[] {
    return this.getAllProjects().filter(p => p.clusterId === clusterId);
  }

  getProjectById(projectId: string): Project | undefined {
    return this.getAllProjects().find(p => p.id === projectId);
  }

  // Nodes
  getAllNodes(): Node[] {
    return this.data.openshift.nodes;
  }

  getNodesByClusterId(clusterId: string): Node[] {
    return this.data.openshift.nodes.filter(n => n.clusterId === clusterId);
  }

  getNodeById(nodeId: string): Node | undefined {
    return this.data.openshift.nodes.find(n => n.id === nodeId);
  }

  getNodesByType(nodeType: string): Node[] {
    return this.data.openshift.nodes.filter(n => n.nodeType === nodeType);
  }

  // AWS Data
  getAWSAccounts(): AWSAccount[] {
    return this.data.aws.accounts.map(account => ({
      ...account,
      crossOverDirection: (account.crossOverDirection === 'to-next-month' || account.crossOverDirection === 'from-prev-month')
        ? account.crossOverDirection
        : 'to-next-month' as 'to-next-month' | 'from-prev-month'
    })) as AWSAccount[];
  }

  getAWSAccountById(accountId: string): AWSAccount | undefined {
    const account = this.data.aws.accounts.find(a => a.id === accountId);
    if (!account) return undefined;
    return {
      ...account,
      crossOverDirection: (account.crossOverDirection === 'to-next-month' || account.crossOverDirection === 'from-prev-month')
        ? account.crossOverDirection
        : 'to-next-month' as 'to-next-month' | 'from-prev-month'
    } as AWSAccount;
  }

  getAWSTotalCost(): number {
    return this.data.aws.totalCost;
  }

  getAWSMoMChange(): number {
    return this.data.aws.monthOverMonthChange;
  }

  getAWSIntegrations(): any[] {
    return this.data.integrations?.aws || [];
  }

  // Get all AWS services across all accounts
  getAllAWSServices(): { serviceName: string; cost: number }[] {
    const servicesMap = new Map<string, number>();
    
    this.data.aws.accounts.forEach(account => {
      account.services.forEach(service => {
        const currentCost = servicesMap.get(service.name) || 0;
        servicesMap.set(service.name, currentCost + service.cost);
      });
    });

    return Array.from(servicesMap.entries()).map(([serviceName, cost]) => ({
      serviceName,
      cost
    }));
  }

  // Get all AWS regions with costs
  getAllAWSRegions(): { regionName: string; cost: number }[] {
    const regionsMap = new Map<string, number>();
    
    this.data.aws.accounts.forEach(account => {
      account.services.forEach(service => {
        service.regions.forEach(region => {
          const currentCost = regionsMap.get(region.name) || 0;
          regionsMap.set(region.name, currentCost + region.cost);
        });
      });
    });

    return Array.from(regionsMap.entries()).map(([regionName, cost]) => ({
      regionName,
      cost
    }));
  }

  // GCP Data
  getGCPAccounts(): GCPAccount[] {
    return this.data.gcp.accounts.map(account => ({
      ...account,
      crossOverDirection: (account.crossOverDirection === 'to-next-month' || account.crossOverDirection === 'from-prev-month')
        ? account.crossOverDirection
        : 'to-next-month' as 'to-next-month' | 'from-prev-month'
    })) as GCPAccount[];
  }

  getGCPAccountById(accountId: string): GCPAccount | undefined {
    const account = this.data.gcp.accounts.find(a => a.billingAccountId === accountId);
    if (!account) return undefined;
    return {
      ...account,
      crossOverDirection: (account.crossOverDirection === 'to-next-month' || account.crossOverDirection === 'from-prev-month')
        ? account.crossOverDirection
        : 'to-next-month' as 'to-next-month' | 'from-prev-month'
    } as GCPAccount;
  }

  getGCPTotalCost(): number {
    return this.data.gcp.totalCost;
  }

  getGCPMoMChange(): number {
    return this.data.gcp.monthOverMonthChange;
  }

  // Get all GCP projects across all accounts
  getAllGCPProjects(): { projectId: string; projectName: string; cost: number }[] {
    const projects: { projectId: string; projectName: string; cost: number }[] = [];
    
    this.data.gcp.accounts.forEach(account => {
      account.projects.forEach(project => {
        projects.push({
          projectId: project.id,
          projectName: project.name,
          cost: project.cost
        });
      });
    });

    return projects;
  }

  // Get all GCP services across all accounts
  getAllGCPServices(): { serviceName: string; cost: number }[] {
    const servicesMap = new Map<string, number>();
    
    this.data.gcp.accounts.forEach(account => {
      account.projects.forEach(project => {
        project.services.forEach(service => {
          const currentCost = servicesMap.get(service.name) || 0;
          servicesMap.set(service.name, currentCost + service.cost);
        });
      });
    });

    return Array.from(servicesMap.entries()).map(([serviceName, cost]) => ({
      serviceName,
      cost
    }));
  }

  // Get all GCP regions with costs
  getAllGCPRegions(): { regionName: string; cost: number }[] {
    const regionsMap = new Map<string, number>();
    
    this.data.gcp.accounts.forEach(account => {
      account.projects.forEach(project => {
        project.services.forEach(service => {
          service.regions.forEach(region => {
            const currentCost = regionsMap.get(region.name) || 0;
            regionsMap.set(region.name, currentCost + region.cost);
          });
        });
      });
    });

    return Array.from(regionsMap.entries()).map(([regionName, cost]) => ({
      regionName,
      cost
    }));
  }

  // Azure Data
  getAzureAccounts(): AzureAccount[] {
    return this.data.azure.accounts.map(account => ({
      ...account,
      crossOverDirection: (account.crossOverDirection === 'to-next-month' || account.crossOverDirection === 'from-prev-month')
        ? account.crossOverDirection
        : 'to-next-month' as 'to-next-month' | 'from-prev-month'
    })) as AzureAccount[];
  }

  getAzureAccountById(accountId: string): AzureAccount | undefined {
    const account = this.data.azure.accounts.find(a => a.id === accountId);
    if (!account) return undefined;
    return {
      ...account,
      crossOverDirection: (account.crossOverDirection === 'to-next-month' || account.crossOverDirection === 'from-prev-month')
        ? account.crossOverDirection
        : 'to-next-month' as 'to-next-month' | 'from-prev-month'
    } as AzureAccount;
  }

  getAzureTotalCost(): number {
    return this.data.azure.totalCost;
  }

  getAzureMoMChange(): number {
    return this.data.azure.monthOverMonthChange;
  }

  // Get all Azure services across all accounts
  getAllAzureServices(): { serviceName: string; cost: number }[] {
    const servicesMap = new Map<string, number>();
    
    this.data.azure.accounts.forEach(account => {
      account.services.forEach(service => {
        const currentCost = servicesMap.get(service.name) || 0;
        servicesMap.set(service.name, currentCost + service.cost);
      });
    });

    return Array.from(servicesMap.entries()).map(([serviceName, cost]) => ({
      serviceName,
      cost
    }));
  }

  // Get all Azure regions with costs
  getAllAzureRegions(): { regionName: string; cost: number }[] {
    const regionsMap = new Map<string, number>();
    
    this.data.azure.accounts.forEach(account => {
      account.services.forEach(service => {
        service.regions.forEach(region => {
          const currentCost = regionsMap.get(region.name) || 0;
          regionsMap.set(region.name, currentCost + region.cost);
        });
      });
    });

    return Array.from(regionsMap.entries()).map(([regionName, cost]) => ({
      regionName,
      cost
    }));
  }

  // Cost Models
  getAllCostModels(): CostModel[] {
    return this.data.costModels;
  }

  getCostModelById(modelId: string): CostModel | undefined {
    return this.data.costModels.find(m => m.id === modelId);
  }

  // Tags
  getAllTags(): Tag[] {
    return this.data.tags;
  }

  getEnabledTags(): Tag[] {
    return this.data.tags.filter(t => t.enabled);
  }

  // Tag Mappings
  getAllTagMappings(): TagMapping[] {
    return this.data.tagMappings.mappings;
  }

  getEnabledTagMappings(): TagMapping[] {
    return this.data.tagMappings.mappings.filter(m => m.enabled);
  }

  getTagMappingById(mappingId: string): TagMapping | undefined {
    return this.data.tagMappings.mappings.find(m => m.id === mappingId);
  }

  getTagMappingsByParentKey(parentKey: string): TagMapping[] {
    return this.data.tagMappings.mappings.filter(m => m.parentKey === parentKey);
  }

  // Cost Categories
  getAllCostCategories(): CostCategory[] {
    return this.data.costCategories.categories;
  }

  getEnabledCostCategories(): CostCategory[] {
    return this.data.costCategories.categories.filter(c => c.enabled);
  }

  getCostCategoryById(categoryId: string): CostCategory | undefined {
    return this.data.costCategories.categories.find(c => c.id === categoryId);
  }

  // Platform Projects
  getAllPlatformProjects(): PlatformProject[] {
    return this.data.platformProjects.projects;
  }

  getEnabledPlatformProjects(): PlatformProject[] {
    return this.data.platformProjects.projects.filter(p => p.enabled);
  }

  getPlatformProjectById(projectId: string): PlatformProject | undefined {
    return this.data.platformProjects.projects.find(p => p.id === projectId);
  }

  getPlatformProjectsByType(type: string): PlatformProject[] {
    return this.data.platformProjects.projects.filter(p => p.type === type);
  }

  getOverheadPlatformProjects(): PlatformProject[] {
    return this.data.platformProjects.projects.filter(p => p.isPlatformOverhead);
  }

  getPlatformSettings() {
    return this.data.platformProjects.settings;
  }

  // Utility Functions
  formatCurrency(amount: number): string {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getTotalCost(): number {
    return this.data.company.totalMonthlyCost;
  }

  // Get summary for overview page
  getOverviewSummary() {
    return {
      totalCost: this.getTotalCost(),
      openshift: {
        cost: this.getOpenShiftTotalCost(),
        momChange: this.getOpenShiftMoMChange(),
        percentage: (this.getOpenShiftTotalCost() / this.getTotalCost()) * 100
      },
      aws: {
        cost: this.getAWSTotalCost(),
        momChange: this.getAWSMoMChange(),
        percentage: (this.getAWSTotalCost() / this.getTotalCost()) * 100
      },
      gcp: {
        cost: this.getGCPTotalCost(),
        momChange: this.getGCPMoMChange(),
        percentage: (this.getGCPTotalCost() / this.getTotalCost()) * 100
      },
      azure: {
        cost: this.getAzureTotalCost(),
        momChange: this.getAzureMoMChange(),
        percentage: (this.getAzureTotalCost() / this.getTotalCost()) * 100
      }
    };
  }
}

// Export singleton instance
export const dataService = new DataService();

