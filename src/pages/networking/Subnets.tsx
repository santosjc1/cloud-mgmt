import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/modals/Modal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import SubnetForm from '../../components/forms/SubnetForm';
import ThreeDotsMenu from '../../components/menus/ThreeDotsMenu';
import { fetchSubnets, createSubnet, deleteSubnet } from '../../services/subnetService';
import { fetchResourceGroups, createResourceGroup } from '../../services/resourceGroupService';
import { fetchRegions } from '../../services/regionService';
import type { Subnet } from '../../types/subnet';
import type { ResourceGroup } from '../../types/resourceGroup';
import type { Region } from '../../types/region';

interface SubnetWithResourceGroup extends Subnet {
  resource_groups: {
    name: string;
    region: {
      name: string;
      code: string;
    };
  };
}

export default function Subnets() {
  const [subnets, setSubnets] = useState<SubnetWithResourceGroup[]>([]);
  const [resourceGroups, setResourceGroups] = useState<ResourceGroup[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    subnet: SubnetWithResourceGroup | null;
  }>({
    isOpen: false,
    subnet: null,
  });

  const columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { 
      header: 'Resource Group', 
      accessor: (subnet: SubnetWithResourceGroup) => subnet.resource_groups.name,
      sortable: true,
      sortAccessor: (subnet: SubnetWithResourceGroup) => subnet.resource_groups.name
    },
    {
      header: 'Region',
      accessor: (subnet: SubnetWithResourceGroup) => 
        `${subnet.resource_groups.region.name} (${subnet.resource_groups.region.code})`,
      sortable: true,
      sortAccessor: (subnet: SubnetWithResourceGroup) => subnet.resource_groups.region.name
    },
    { header: 'IPv4', accessor: 'ipv4', sortable: true },
    { header: 'Type', accessor: 'type', sortable: true },
    { header: 'Platform', accessor: 'platform', sortable: true },
    { header: 'Gateway', accessor: 'gateway', sortable: true },
    { header: 'Gateway Name', accessor: 'gw_name', sortable: true },
    { 
      header: 'VLAN ID', 
      accessor: (subnet: SubnetWithResourceGroup) => subnet.type === 'Overlay' ? '-' : subnet.vlan_id,
      sortable: true,
      sortAccessor: (subnet: SubnetWithResourceGroup) => subnet.vlan_id || 0
    },
    {
      header: '',
      accessor: (subnet: SubnetWithResourceGroup) => (
        <div className="flex justify-end">
          <ThreeDotsMenu
            actions={[
              {
                label: 'Delete',
                icon: <Trash2 size={16} />,
                onClick: () => handleDeleteClick(subnet),
                variant: 'danger'
              }
            ]}
          />
        </div>
      )
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subnetsData, resourceGroupsData, regionsData] = await Promise.all([
        fetchSubnets(),
        fetchResourceGroups(),
        fetchRegions()
      ]);
      setSubnets(subnetsData);
      setResourceGroups(resourceGroupsData);
      setRegions(regionsData);
    } catch (error: any) {
      toast.error('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubnet = async (data: Omit<Subnet, 'id' | 'created_at' | 'created_by'>) => {
    setIsSubmitting(true);
    try {
      const newSubnet = await createSubnet(data);
      setSubnets(prev => [...prev, newSubnet]);
      setIsModalOpen(false);
      toast.success('Subnet created successfully');
    } catch (error: any) {
      toast.error('Error creating subnet: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateResourceGroup = async (
    name: string, 
    description: string,
    region_id: string
  ) => {
    try {
      const newResourceGroup = await createResourceGroup(name, description, region_id);
      setResourceGroups(prev => [...prev, newResourceGroup]);
      toast.success('Resource group created successfully');
    } catch (error: any) {
      toast.error('Error creating resource group: ' + error.message);
      throw error;
    }
  };

  const handleDeleteClick = (subnet: SubnetWithResourceGroup) => {
    setDeleteConfirmation({
      isOpen: true,
      subnet,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.subnet) return;

    setIsSubmitting(true);
    try {
      await deleteSubnet(deleteConfirmation.subnet.id);
      setSubnets(prev => prev.filter(s => s.id !== deleteConfirmation.subnet?.id));
      toast.success('Subnet deleted successfully');
      setDeleteConfirmation({ isOpen: false, subnet: null });
    } catch (error: any) {
      toast.error('Error deleting subnet: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subnets</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Subnet
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable columns={columns} data={subnets} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Subnet"
      >
        <SubnetForm
          resourceGroups={resourceGroups}
          regions={regions}
          onSubmit={handleCreateSubnet}
          onCreateResourceGroup={handleCreateResourceGroup}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, subnet: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Subnet"
        message={`Are you sure you want to delete the subnet "${deleteConfirmation.subnet?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isSubmitting}
      />
    </div>
  );
}