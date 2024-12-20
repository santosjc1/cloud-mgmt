import type { Region } from './region';

export type DataSourceType = 'NSX' | 'Cisco' | 'Palo Alto' | 'vCenter';
export type DataSourceStatus = 'connected' | 'not_configured' | 'error';

export interface DataSourceConfig {
  url: string;
  username?: string;
  password?: string;
  api_key?: string;
  thumbprint?: string;
  datacenter?: string;
}

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  url: string;
  status: DataSourceStatus;
  region: Region;
  created_at: string;
  created_by: string;
}