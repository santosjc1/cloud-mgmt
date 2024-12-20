import type { ConnectivityResult } from '../types';

export async function checkNSXConnectivity(
  url: string,
  username: string,
  password: string,
  thumbprint: string
): Promise<ConnectivityResult> {
  try {
    const response = await fetch(`${url}/api/v1/cluster/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        'X-NSX-Thumbprint': thumbprint
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to connect: ${response.statusText}`);
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}