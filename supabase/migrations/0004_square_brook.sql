/*
  # Add Resource Groups and Subnets

  1. New Tables
    - `resource_groups`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)
    
    - `subnets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `ipv4` (text)
      - `type` (enum: VLAN, Overlay)
      - `gateway` (text)
      - `vlan_id` (integer, nullable)
      - `resource_group_id` (uuid, references resource_groups)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create subnet type enum
CREATE TYPE subnet_type AS ENUM ('VLAN', 'Overlay');

-- Create resource groups table
CREATE TABLE resource_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Create subnets table
CREATE TABLE subnets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ipv4 text NOT NULL,
  type subnet_type NOT NULL,
  gateway text NOT NULL,
  vlan_id integer,
  resource_group_id uuid REFERENCES resource_groups NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  CONSTRAINT valid_vlan_id CHECK (
    (type = 'VLAN' AND vlan_id IS NOT NULL) OR
    (type = 'Overlay' AND vlan_id IS NULL)
  )
);

-- Enable RLS
ALTER TABLE resource_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE subnets ENABLE ROW LEVEL SECURITY;

-- Resource Groups Policies
CREATE POLICY "Users can view all resource groups"
  ON resource_groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create resource groups"
  ON resource_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Subnets Policies
CREATE POLICY "Users can view all subnets"
  ON subnets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create subnets"
  ON subnets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);