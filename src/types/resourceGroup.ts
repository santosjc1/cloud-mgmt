export interface ResourceGroup {
  id: string;
  name: string;
  description: string | null;
  region_id: string;
  region: {
    name: string;
    code: string;
  };
  created_at: string;
  created_by: string;
}