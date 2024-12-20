import { ApiClient, ApiResponse } from './client';
import type { Region } from '../types/region';

class RegionsApi extends ApiClient {
  private readonly basePath = 'regions';

  async list(): Promise<ApiResponse<Region[]>> {
    return this.get<Region[]>(this.basePath);
  }
}

export const regionsApi = new RegionsApi();