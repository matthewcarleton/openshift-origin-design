export type CatalogMode = 'v0' | 'v1';

export interface InstalledItem {
  id: string;
  mode: CatalogMode;
  name: string;
  description: string;
  provider?: string;
  type: string;
  version?: string;
  installedAt: string;
}
