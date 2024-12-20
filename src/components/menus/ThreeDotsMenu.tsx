import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';

interface MenuAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'danger';
}

interface ThreeDotsMenuProps {
  actions: MenuAction[];
}

export default function ThreeDotsMenu({ actions }: ThreeDotsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100
                  ${action.variant === 'danger' ? 'text-red-600' : 'text-gray-700'}`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}