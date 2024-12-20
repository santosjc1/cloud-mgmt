import type { ConnectivityResult } from '../types';

export async function checkPaloAltoConnectivity(
  url: string,
  username: string,
  password: string,
  apiKey?: string
): Promise<ConnectivityResult> {
  try {
    // Try API key first if provided
    if (apiKey) {
      const keyResponse = await fetch(`${url}/api/?type=keygen&key=${apiKey}`);
      if (keyResponse.ok) {
        return { success: true };
      }
    }

    // Fall back to username/password
    const response = await fetch(`${url}/api/?type=keygen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        type: 'keygen',
        user: username,
        password: password
      })
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