/*
  # Create secure auth users access function
  
  1. New Function
    - Creates a function to safely access auth.users email data
    - Enables secure access to user email information
    - Returns only necessary fields (id, email)
  
  2. Security
    - Function is security definer to access auth schema
    - Limited to authenticated users
    - Returns only email and id fields for security
*/

-- Create function to safely access auth user emails
CREATE OR REPLACE FUNCTION get_user_emails()
RETURNS TABLE (
  id uuid,
  email text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only allow authenticated users to access this function
  IF auth.role() = 'authenticated' THEN
    RETURN QUERY
    SELECT au.id, au.email::text
    FROM auth.users au;
  ELSE
    RAISE EXCEPTION 'Not authenticated';
  END IF;
END;
$$;