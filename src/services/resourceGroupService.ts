import { supabase } from '../lib/supabase';
import type { ResourceGroup } from '../types/resourceGroup';
import type { Subnet } from '../types/subnet';

export async function fetchResourceGroups(): Promise<ResourceGroup[]> {
  const { data, error } = await supabase
    .from('resource_groups')
    .select(`
      *,
      region:regions (
        name,
        code
      )
    `)
    .order('name');

  if (error) throw error;
  return data;
}

export async function fetchResourceGroupResources(id: string): Promise<{
  subnets: Subnet[];
}> {
  const { data: subnets, error: subnetsError } = await supabase
    .from('subnets')
    .select('*')
    .eq('resource_group_id', id)
    .order('name');

  if (subnetsError) throw subnetsError;

  return {
    subnets: subnets || []
  };
}

export async function createResourceGroup(
  name: string, 
  description: string | null,
  region_id: string
): Promise<ResourceGroup> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('resource_groups')
    .insert([{ 
      name, 
      description,
      region_id,
      created_by: user.id 
    }])
    .select(`
      *,
      region:regions (
        name,
        code
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteResourceGroup(id: string): Promise<void> {
  // First check if the resource group has any resources
  const { subnets } = await fetchResourceGroupResources(id);
  
  if (subnets.length > 0) {
    throw new Error('Cannot delete resource group: It contains resources that must be deleted first');
  }

  const { error } = await supabase
    .from('resource_groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
}