import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

export default function SidebarHeader() {
  const { toggle, isOpen } = useSidebar();

  return (
    <div className="flex items-center space-x-3 mb-8">
      <button
        onClick={toggle}
        className="p-1 text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>
      {isOpen && <h1 className="text-xl font-bold text-gray-300">Cloud Portal</h1>}
    </div>
  );
}