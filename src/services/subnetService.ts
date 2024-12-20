import { supabase } from '../lib/supabase';
import type { Subnet } from '../types/subnet';

export async function fetchSubnets(): Promise<Subnet[]> {
  const { data, error } = await supabase
    .from('subnets')
    .select(`
      *,
      resource_groups (
        name,
        region:regions (
          name,
          code
        )
      )
    `)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createSubnet(subnet: Omit<Subnet, 'id' | 'created_at' | 'created_by'>): Promise<Subnet> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('subnets')
    .insert([{ 
      ...subnet, 
      created_by: user.id 
    }])
    .select(`
      *,
      resource_groups (
        name,
        region:regions (
          name,
          code
        )
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubnet(id: string): Promise<void> {
  const { error } = await supabase
    .from('subnets')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteSubnets(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('subnets')
    .delete()
    .in('id', ids);

  if (error) throw error;
}