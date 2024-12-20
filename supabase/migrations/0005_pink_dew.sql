/*
  # Add regions support
  
  1. New Tables
    - `regions`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `code` (text, unique)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Changes
    - Add `region_id` to `resource_groups` table
    
  3. Security
    - Enable RLS on regions table
    - Add policies for authenticated users
*/

-- Create regions table
CREATE TABLE regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- Regions Policies
CREATE POLICY "Users can view all regions"
  ON regions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a function to safely insert initial regions
CREATE OR REPLACE FUNCTION insert_initial_regions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_auth_user_id uuid;
BEGIN
    -- Get the first authenticated user from auth.users
    SELECT id INTO v_auth_user_id FROM auth.users LIMIT 1;
    
    IF v_auth_user_id IS NULL THEN
        RAISE EXCEPTION 'No user found in auth.users';
    END IF;

    -- Insert regions
    INSERT INTO regions (name, code, created_by)
    VALUES 
        ('Canada Central', 'CAN-CENTRAL', v_auth_user_id),
        ('Canada East', 'CAN-EAST', v_auth_user_id),
        ('Winnipeg', 'CAN-WPG', v_auth_user_id),
        ('Brampton', 'CAN-BRM', v_auth_user_id);
END;
$$;

-- Execute the function to insert regions
SELECT insert_initial_regions();

-- Add nullable region_id first
ALTER TABLE resource_groups 
ADD COLUMN region_id uuid REFERENCES regions;

-- Update existing resource groups to use the first region
DO $$
DECLARE
    v_region_id uuid;
BEGIN
    -- Get the ID of Canada Central region
    SELECT id INTO v_region_id FROM regions WHERE code = 'CAN-CENTRAL' LIMIT 1;
    
    -- Update all existing resource groups to use this region
    UPDATE resource_groups SET region_id = v_region_id;
END $$;

-- Now make region_id NOT NULL
ALTER TABLE resource_groups 
ALTER COLUMN region_id SET NOT NULL;

-- Clean up the temporary function
DROP FUNCTION insert_initial_regions();