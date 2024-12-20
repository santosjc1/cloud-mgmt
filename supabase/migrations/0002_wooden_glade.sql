-- Create a function to safely get user emails from auth.users
CREATE OR REPLACE FUNCTION get_auth_users(user_ids uuid[])
RETURNS TABLE (
  id uuid,
  email text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.email::text
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
END;
$$;