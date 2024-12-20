import type { DataSourceType } from '../../types/dataSource';

export interface ConnectivityResult {
  success: boolean;
  error?: string;
}

export interface ConnectivityCheck {
  type: DataSourceType;
  config: {
    url: string;
    username?: string;
    password?: string;
    api_key?: string;
    thumbprint?: string;
    datacenter?: string;
  };
}