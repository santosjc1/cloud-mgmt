/*
  # Add delete policy for resource groups

  1. Security
    - Add policy to allow users to delete their own resource groups
*/

-- Add delete policy for resource groups
CREATE POLICY "Users can delete own resource groups"
  ON resource_groups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);