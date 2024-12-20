import { supabase } from '../lib/supabase';
import type { Region } from '../types/region';

export async function fetchRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}