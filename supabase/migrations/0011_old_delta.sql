/*
  # Add Data Sources Table

  1. New Tables
    - `data_sources`
      - `id` (uuid, primary key)
      - `type` (data_source_type enum)
      - `name` (text)
      - `url` (text)
      - `status` (data_source_status enum)
      - `region_id` (uuid, foreign key to regions)
      - `created_at` (timestamptz)
      - `created_by` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `data_sources` table
    - Add policies for authenticated users to manage data sources
*/

-- Create enum types
CREATE TYPE data_source_type AS ENUM ('NSX', 'Cisco', 'Palo Alto');
CREATE TYPE data_source_status AS ENUM ('connected', 'not_configured', 'error');

-- Create data sources table
CREATE TABLE data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type data_source_type NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  status data_source_status NOT NULL DEFAULT 'not_configured',
  region_id uuid REFERENCES regions NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  UNIQUE(region_id, type)
);

-- Enable RLS
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all data sources"
  ON data_sources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create data sources"
  ON data_sources
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own data sources"
  ON data_sources
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own data sources"
  ON data_sources
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);