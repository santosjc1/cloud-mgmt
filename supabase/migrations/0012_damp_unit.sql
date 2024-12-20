/*
  # Update data sources schema

  1. Changes
    - Add vCenter to data source types
    - Add configuration columns for different platforms
    
  2. Security
    - Maintain existing RLS policies
*/

-- Update enum to include vCenter
ALTER TYPE data_source_type ADD VALUE 'vCenter';

-- Add configuration columns
ALTER TABLE data_sources
ADD COLUMN username text,
ADD COLUMN password text,
ADD COLUMN api_key text,
ADD COLUMN thumbprint text,
ADD COLUMN datacenter text;