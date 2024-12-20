/*
  # Add subnet delete policy

  1. Changes
    - Add RLS policy to allow users to delete their own subnets
  
  2. Security
    - Users can only delete subnets they created
    - Maintains data integrity by only allowing deletion of user's own data
*/

-- Add delete policy for subnets
CREATE POLICY "Users can delete own subnets"
  ON subnets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);