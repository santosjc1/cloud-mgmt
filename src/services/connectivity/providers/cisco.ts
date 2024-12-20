import type { ConnectivityResult } from '../types';

export async function checkCiscoConnectivity(
  url: string,
  username: string,
  password: string
): Promise<ConnectivityResult> {
  try {
    const response = await fetch(`${url}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
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