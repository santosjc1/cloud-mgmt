/*
  # Add Platform and Gateway Name columns to subnets table

  1. Changes
    - Add platform enum type for NSX, Cisco, and Palo Alto
    - Add platform column to subnets table
    - Add gw_name column to subnets table
    - Update existing rows with default values
*/

-- Create platform enum type
CREATE TYPE platform_type AS ENUM ('NSX', 'Cisco', 'Palo Alto');

-- Add new columns
ALTER TABLE subnets
ADD COLUMN platform platform_type,
ADD COLUMN gw_name text;

-- Set default values for existing rows
UPDATE subnets SET
  platform = 'NSX',
  gw_name = 'default-gw';

-- Make columns required
ALTER TABLE subnets
ALTER COLUMN platform SET NOT NULL,
ALTER COLUMN gw_name SET NOT NULL;