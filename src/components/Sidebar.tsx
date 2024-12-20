import React from 'react';
import { Users, LogOut, Network, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../contexts/SidebarContext';
import SidebarHeader from './SidebarHeader';
import SidebarMenuItem from './SidebarMenuItem';

export default function Sidebar() {
  const { signOut } = useAuth();
  const { isOpen } = useSidebar();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="h-full flex flex-col p-4">
        <SidebarHeader />
        
        <nav className="space-y-2 flex-1">
          <SidebarMenuItem
            icon={<Users size={20} />}
            label="Identity Management"
            subItems={[
              { to: '/dashboard/identity/users', label: 'Users & Groups' },
              { to: '/dashboard/identity/resource-groups', label: 'Resource Groups' }
            ]}
          />
          <SidebarMenuItem
            icon={<Network size={20} />}
            label="Networking"
            subItems={[
              { to: '/dashboard/networking/subnets', label: 'Subnets' },
              { to: '/dashboard/networking/dns', label: 'DNS' }
            ]}
          />
          <SidebarMenuItem
            icon={<Settings size={20} />}
            label="System"
            subItems={[
              { to: '/dashboard/system/data-sources', label: 'Data Sources' }
            ]}
          />
        </nav>

        <button
          onClick={signOut}
          className="flex items-center space-x-2 p-2 rounded w-full mt-auto text-gray-300 hover:bg-gray-800 transition-colors duration-200"
        >
          <LogOut size={20} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}