import type { ConnectivityCheck, ConnectivityResult } from './types';
import { checkNSXConnectivity } from './providers/nsx';
import { checkCiscoConnectivity } from './providers/cisco';
import { checkPaloAltoConnectivity } from './providers/paloalto';
import { checkVCenterConnectivity } from './providers/vcenter';

export async function verifyConnectivity(check: ConnectivityCheck): Promise<ConnectivityResult> {
  const { type, config } = check;

  switch (type) {
    case 'NSX':
      if (!config.username || !config.password || !config.thumbprint) {
        return { success: false, error: 'Missing required NSX configuration' };
      }
      return checkNSXConnectivity(
        config.url,
        config.username,
        config.password,
        config.thumbprint
      );

    case 'Cisco':
      if (!config.username || !config.password) {
        return { success: false, error: 'Missing required Cisco configuration' };
      }
      return checkCiscoConnectivity(
        config.url,
        config.username,
        config.password
      );

    case 'Palo Alto':
      if (!config.username || !config.password) {
        return { success: false, error: 'Missing required Palo Alto configuration' };
      }
      return checkPaloAltoConnectivity(
        config.url,
        config.username,
        config.password,
        config.api_key
      );

    case 'vCenter':
      if (!config.username || !config.password) {
        return { success: false, error: 'Missing required vCenter configuration' };
      }
      return checkVCenterConnectivity(
        config.url,
        config.username,
        config.password,
        config.datacenter
      );

    default:
      return {
        success: false,
        error: `Unsupported platform type: ${type}`
      };
  }
}