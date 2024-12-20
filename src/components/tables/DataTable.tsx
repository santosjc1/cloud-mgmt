import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortAccessor?: (item: T) => string | number | null;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  getItemId?: (item: T) => string;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export default function DataTable<T>({ 
  columns, 
  data,
  selectable,
  selectedItems = [],
  onSelectionChange,
  getItemId = (item: any) => item.id,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedItems.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange([...data]);
    }
  };

  const handleSelectItem = (item: T) => {
    if (!onSelectionChange) return;
    const itemId = getItemId(item);
    const isSelected = selectedItems.some(selected => getItemId(selected) === itemId);
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => getItemId(selected) !== itemId));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = typeof column.accessor === 'string' ? column.accessor : column.header;
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key, direction });
  };

  const getSortValue = (item: T, column: Column<T>): string | number | null => {
    if (column.sortAccessor) {
      return column.sortAccessor(item);
    }

    if (typeof column.accessor === 'function') {
      const value = column.accessor(item);
      return value ? String(value) : null;
    }

    const value = item[column.accessor as keyof T];
    return value ? String(value) : null;
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const column = columns.find(col => 
        typeof col.accessor === 'string' ? col.accessor === sortConfig.key : col.header === sortConfig.key
      );
      if (!column) return 0;

      const aValue = getSortValue(a, column);
      const bValue = getSortValue(b, column);

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, columns]);

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const key = typeof column.accessor === 'string' ? column.accessor : column.header;
    if (sortConfig?.key !== key) {
      return <ChevronDown size={14} className="ml-1 text-gray-400" />;
    }

    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="ml-1 text-blue-600" />
      : <ChevronDown size={14} className="ml-1 text-blue-600" />;
  };

  return (
    <div className="overflow-x-auto border rounded-lg border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="w-12 px-6 py-3">
                <div className="flex items-center">
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 rounded border ${
                      selectedItems.length === data.length
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300'
                    } flex items-center justify-center`}
                  >
                    {selectedItems.length === data.length && <Check size={14} />}
                  </button>
                </div>
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer select-none' : ''
                }`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center">
                  {column.header}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, rowIndex) => {
            const itemId = getItemId(item);
            const isSelected = selectedItems.some(selected => getItemId(selected) === itemId);
            
            return (
              <tr 
                key={rowIndex}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {selectable && (
                  <td className="w-12 px-6 py-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleSelectItem(item)}
                        className={`w-5 h-5 rounded border ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300'
                        } flex items-center justify-center`}
                      >
                        {isSelected && <Check size={14} />}
                      </button>
                    </div>
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}