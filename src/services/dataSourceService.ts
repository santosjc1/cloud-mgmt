import { supabase } from '../lib/supabase';
import { verifyConnectivity } from './connectivity';
import type { DataSource, DataSourceConfig } from '../types/dataSource';

export async function fetchDataSources(): Promise<DataSource[]> {
  const { data, error } = await supabase
    .from('data_sources')
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

export async function createDataSource(
  type: DataSource['type'],
  regionId: string,
  config: DataSourceConfig
): Promise<DataSource> {
  // First verify connectivity
  const connectivityResult = await verifyConnectivity({ type, config });
  if (!connectivityResult.success) {
    throw new Error(`Connection failed: ${connectivityResult.error}`);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('data_sources')
    .insert([{
      type,
      name: `${type} - ${regionId}`,
      url: config.url,
      username: config.username,
      password: config.password,
      api_key: config.api_key,
      thumbprint: config.thumbprint,
      datacenter: config.datacenter,
      region_id: regionId,
      created_by: user.id,
      status: 'connected'
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

export async function updateDataSource(
  id: string,
  config: Partial<DataSourceConfig>
): Promise<void> {
  // Get current data source to determine type
  const { data: currentSource, error: fetchError } = await supabase
    .from('data_sources')
    .select('type')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  // Verify connectivity with new config
  const connectivityResult = await verifyConnectivity({
    type: currentSource.type,
    config: config as DataSourceConfig
  });

  if (!connectivityResult.success) {
    throw new Error(`Connection failed: ${connectivityResult.error}`);
  }

  const { error } = await supabase
    .from('data_sources')
    .update({
      url: config.url,
      username: config.username,
      password: config.password,
      api_key: config.api_key,
      thumbprint: config.thumbprint,
      datacenter: config.datacenter,
      status: 'connected'
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteDataSource(id: string): Promise<void> {
  const { error } = await supabase
    .from('data_sources')
    .delete()
    .eq('id', id);

  if (error) throw error;
}