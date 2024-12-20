export type Platform = 'NSX' | 'Cisco' | 'Palo Alto';

export interface Subnet {
  id: string;
  name: string;
  ipv4: string;
  type: 'VLAN' | 'Overlay';
  gateway: string;
  vlan_id: number | null;
  platform: Platform;
  gw_name: string;
  resource_group_id: string;
  created_at: string;
  created_by: string;
}