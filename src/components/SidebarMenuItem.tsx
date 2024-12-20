import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

interface MenuItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  subItems?: Array<{
    to: string;
    label: string;
  }>;
}

export default function SidebarMenuItem({ to, icon, label, subItems }: MenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (subItems) {
      const isCurrentPath = subItems.some(item => 
        location.pathname.startsWith(item.to)
      );
      setIsExpanded(isCurrentPath);
    }
  }, [location.pathname, subItems]);

  const handleParentClick = () => {
    if (!isOpen && subItems) {
      navigate(subItems[0].to);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  if (subItems) {
    return (
      <div>
        <button
          onClick={handleParentClick}
          className="w-full flex items-center justify-between p-2 rounded text-gray-300 hover:bg-gray-800 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            {icon}
            {isOpen && <span>{label}</span>}
          </div>
          {isOpen && (
            <span className="text-gray-400">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>
        {isExpanded && isOpen && (
          <div className="ml-8 space-y-1 mt-1">
            {subItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block p-2 rounded text-sm text-gray-300 transition-colors duration-200 ${
                    isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to!}
      className={({ isActive }) =>
        `flex items-center space-x-2 p-2 rounded text-gray-300 transition-colors duration-200 ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
        }`
      }
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
}