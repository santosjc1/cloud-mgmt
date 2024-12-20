import React, { useState } from 'react';
import { Network, Trash2 } from 'lucide-react';
import DataTable from './tables/DataTable';
import ConfirmationModal from './modals/ConfirmationModal';
import { deleteSubnets } from '../services/subnetService';
import type { Subnet } from '../types/subnet';

interface ResourceGroupDetailsProps {
  resourceGroupId: string;
  resourceGroupName: string;
  subnets: Subnet[];
  onResourcesDeleted: () => void;
}

export default function ResourceGroupDetails({ 
  resourceGroupId, 
  resourceGroupName,
  subnets,
  onResourcesDeleted
}: ResourceGroupDetailsProps) {
  const [selectedSubnets, setSelectedSubnets] = useState<Subnet[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'IPv4', accessor: 'ipv4' },
    { header: 'Type', accessor: 'type' },
    { header: 'Gateway', accessor: 'gateway' },
    { 
      header: 'VLAN ID', 
      accessor: (subnet: Subnet) => subnet.type === 'Overlay' ? '-' : subnet.vlan_id 
    }
  ];

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      await deleteSubnets(selectedSubnets.map(subnet => subnet.id));
      setSelectedSubnets([]);
      onResourcesDeleted();
      setShowDeleteConfirmation(false);
    } catch (error: any) {
      console.error('Error deleting subnets:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Resources in {resourceGroupName}</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Network size={20} className="text-gray-500" />
              <h3 className="text-lg font-medium">Networking</h3>
            </div>
            {selectedSubnets.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
              >
                <Trash2 size={16} />
                <span>Delete Selected ({selectedSubnets.length})</span>
              </button>
            )}
          </div>
          
          {subnets.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={subnets}
              selectable
              selectedItems={selectedSubnets}
              onSelectionChange={setSelectedSubnets}
            />
          ) : (
            <p className="text-gray-500 italic">No networking resources found</p>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteSelected}
        title="Delete Selected Resources"
        message={`Are you sure you want to delete ${selectedSubnets.length} selected subnet${
          selectedSubnets.length === 1 ? '' : 's'
        }? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}