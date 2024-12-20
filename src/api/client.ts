import { supabase } from '../lib/supabase';

// Generic API response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Base API client with common functionality
export class ApiClient {
  protected async get<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(path)
        .select('*');
      
      if (error) throw error;
      return { data: data as T, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  protected async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(path)
        .insert([body])
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as T, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }

  protected async delete(path: string, id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(path)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  }
}