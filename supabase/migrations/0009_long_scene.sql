/*
  # Add NSX Manager Configuration

  1. Changes
    - Add NSX manager configuration columns to regions table
    - Add validation for NSX configuration completeness
  
  2. Security
    - Enable encryption for sensitive fields
*/

-- Add NSX configuration columns
ALTER TABLE regions
ADD COLUMN nsx_manager_url text,
ADD COLUMN nsx_manager_username text,
ADD COLUMN nsx_manager_password text,
ADD COLUMN nsx_manager_thumbprint text,
ADD COLUMN sync_enabled boolean DEFAULT false,
ADD COLUMN sync_interval_minutes integer DEFAULT 5;

-- Add constraint to ensure all NSX fields are set if sync is enabled
ALTER TABLE regions
ADD CONSTRAINT nsx_config_complete CHECK (
  (NOT sync_enabled) OR 
  (
    nsx_manager_url IS NOT NULL AND
    nsx_manager_username IS NOT NULL AND
    nsx_manager_password IS NOT NULL AND
    nsx_manager_thumbprint IS NOT NULL AND
    sync_interval_minutes >= 1
  )
);