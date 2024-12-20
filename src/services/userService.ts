import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export async function fetchUsers(): Promise<Profile[]> {
  // First get all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');

  if (profilesError) throw profilesError;

  // Then get the emails using our secure function
  const { data: userEmails, error: emailsError } = await supabase
    .rpc('get_user_emails');

  if (emailsError) throw emailsError;

  // Create an email lookup map
  const emailMap = new Map(userEmails.map(u => [u.id, u.email]));

  // Combine the data
  return profiles.map(profile => ({
    ...profile,
    email: emailMap.get(profile.id) || '',
  }));
}