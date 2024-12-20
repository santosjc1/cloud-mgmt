import type { ConnectivityResult } from '../types';

export async function checkVCenterConnectivity(
  url: string,
  username: string,
  password: string,
  datacenter?: string
): Promise<ConnectivityResult> {
  try {
    // First get session token
    const tokenResponse = await fetch(`${url}/api/session`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        'Content-Type': 'application/json'
      }
    });

    if (!tokenResponse.ok) {
      throw new Error('Invalid credentials');
    }

    const token = await tokenResponse.text();

    // If datacenter is specified, verify it exists
    if (datacenter) {
      const dcResponse = await fetch(`${url}/api/vcenter/datacenter`, {
        headers: {
          'vmware-api-session-id': token
        }
      });

      if (!dcResponse.ok) {
        throw new Error('Failed to verify datacenter');
      }

      const datacenters = await dcResponse.json();
      if (!datacenters.find((dc: any) => dc.name === datacenter)) {
        throw new Error(`Datacenter "${datacenter}" not found`);
      }
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}