import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/modals/Modal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ResourceGroupForm from '../../components/forms/ResourceGroupForm';
import ResourceGroupDetails from '../../components/ResourceGroupDetails';
import ThreeDotsMenu from '../../components/menus/ThreeDotsMenu';
import { fetchResourceGroups, fetchResourceGroupResources, createResourceGroup, deleteResourceGroup } from '../../services/resourceGroupService';
import { fetchRegions } from '../../services/regionService';
import type { ResourceGroup } from '../../types/resourceGroup';
import type { Region } from '../../types/region';

export default function ResourceGroups() {
  const [resourceGroups, setResourceGroups] = useState<ResourceGroup[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
    resources: { subnets: any[] };
  } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    resourceGroup: ResourceGroup | null;
  }>({
    isOpen: false,
    resourceGroup: null,
  });

  const columns = [
    { 
      header: 'Name', 
      accessor: (rg: ResourceGroup) => (
        <button
          onClick={() => handleResourceGroupClick(rg)}
          className="text-blue-600 hover:text-blue-800"
        >
          {rg.name}
        </button>
      ),
      sortable: true,
      sortAccessor: (rg: ResourceGroup) => rg.name
    },
    { header: 'Description', accessor: 'description', sortable: true },
    { 
      header: 'Region', 
      accessor: (rg: ResourceGroup) => `${rg.region.name} (${rg.region.code})`,
      sortable: true,
      sortAccessor: (rg: ResourceGroup) => rg.region.name
    },
    {
      header: '',
      accessor: (rg: ResourceGroup) => (
        <div className="flex justify-end">
          <ThreeDotsMenu
            actions={[
              {
                label: 'Delete',
                icon: <Trash2 size={16} />,
                onClick: () => handleDeleteClick(rg),
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
      const [resourceGroupsData, regionsData] = await Promise.all([
        fetchResourceGroups(),
        fetchRegions()
      ]);
      setResourceGroups(resourceGroupsData);
      setRegions(regionsData);
    } catch (error: any) {
      toast.error('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResourceGroup = async (
    name: string, 
    description: string,
    region_id: string
  ) => {
    setIsSubmitting(true);
    try {
      const newResourceGroup = await createResourceGroup(name, description, region_id);
      setResourceGroups(prev => [...prev, newResourceGroup]);
      setIsModalOpen(false);
      toast.success('Resource group created successfully');
    } catch (error: any) {
      toast.error('Error creating resource group: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResourceGroupClick = async (resourceGroup: ResourceGroup) => {
    try {
      const resources = await fetchResourceGroupResources(resourceGroup.id);
      setSelectedGroup({
        id: resourceGroup.id,
        name: resourceGroup.name,
        resources
      });
    } catch (error: any) {
      toast.error('Error loading resource group details: ' + error.message);
    }
  };

  const handleDeleteClick = (resourceGroup: ResourceGroup) => {
    setDeleteConfirmation({
      isOpen: true,
      resourceGroup,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.resourceGroup) return;

    setIsSubmitting(true);
    try {
      await deleteResourceGroup(deleteConfirmation.resourceGroup.id);
      setResourceGroups(prev => 
        prev.filter(group => group.id !== deleteConfirmation.resourceGroup?.id)
      );
      if (selectedGroup?.id === deleteConfirmation.resourceGroup.id) {
        setSelectedGroup(null);
      }
      toast.success('Resource group deleted successfully');
      setDeleteConfirmation({ isOpen: false, resourceGroup: null });
    } catch (error: any) {
      toast.error('Error deleting resource group: ' + error.message);
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
        <h1 className="text-2xl font-bold">Resource Groups</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Resource Group
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTable columns={columns} data={resourceGroups} />
        </div>

        {selectedGroup && (
          <ResourceGroupDetails
            resourceGroupId={selectedGroup.id}
            resourceGroupName={selectedGroup.name}
            subnets={selectedGroup.resources.subnets}
            onResourcesDeleted={() => handleResourceGroupClick({
              id: selectedGroup.id,
              name: selectedGroup.name
            } as ResourceGroup)}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Resource Group"
      >
        <ResourceGroupForm
          regions={regions}
          onSubmit={({ name, description, region_id }) => 
            handleCreateResourceGroup(name, description, region_id)
          }
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, resourceGroup: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Resource Group"
        message={`Are you sure you want to delete the resource group "${deleteConfirmation.resourceGroup?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isSubmitting}
      />
    </div>
  );
}