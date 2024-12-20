import { ApiClient, ApiResponse } from './client';
import type { Subnet } from '../types/subnet';

class SubnetsApi extends ApiClient {
  private readonly basePath = 'subnets';

  async list(): Promise<ApiResponse<Subnet[]>> {
    return this.get<Subnet[]>(`${this.basePath}?select=*,resource_groups(name,region:regions(name,code))`);
  }

  async create(data: Omit<Subnet, 'id' | 'created_at' | 'created_by'>): Promise<ApiResponse<Subnet>> {
    return this.post<Subnet>(this.basePath, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.delete(this.basePath, id);
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.basePath)
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }
}

export const subnetsApi = new SubnetsApi();