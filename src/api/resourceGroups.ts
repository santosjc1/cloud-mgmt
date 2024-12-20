import { ApiClient, ApiResponse } from './client';
import type { ResourceGroup } from '../types/resourceGroup';

class ResourceGroupsApi extends ApiClient {
  private readonly basePath = 'resource_groups';

  async list(): Promise<ApiResponse<ResourceGroup[]>> {
    return this.get<ResourceGroup[]>(`${this.basePath}?select=*,region:regions(name,code)`);
  }

  async create(data: Omit<ResourceGroup, 'id' | 'created_at' | 'created_by'>): Promise<ApiResponse<ResourceGroup>> {
    return this.post<ResourceGroup>(this.basePath, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.delete(this.basePath, id);
  }

  async getResources(id: string): Promise<ApiResponse<{ subnets: any[] }>> {
    try {
      const { data: subnets, error: subnetsError } = await supabase
        .from('subnets')
        .select('*')
        .eq('resource_group_id', id)
        .order('name');

      if (subnetsError) throw subnetsError;

      return {
        data: { subnets: subnets || [] },
        error: null
      };
    } catch (error: any) {
      return { data: null, error };
    }
  }
}

export const resourceGroupsApi = new ResourceGroupsApi();