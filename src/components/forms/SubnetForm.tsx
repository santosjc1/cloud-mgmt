import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import Modal from '../modals/Modal';
import ResourceGroupForm from './ResourceGroupForm';
import type { ResourceGroup } from '../../types/resourceGroup';
import type { Region } from '../../types/region';
import type { Platform } from '../../types/subnet';

interface SubnetFormData {
  name: string;
  ipv4: string;
  type: 'VLAN' | 'Overlay';
  gateway: string;
  vlan_id?: number;
  platform: Platform;
  gw_name: string;
  resource_group_id: string;
}

interface SubnetFormProps {
  resourceGroups: ResourceGroup[];
  regions: Region[];
  onSubmit: (data: SubnetFormData) => Promise<void>;
  onCreateResourceGroup: (name: string, description: string, region_id: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function SubnetForm({ 
  resourceGroups, 
  regions,
  onSubmit, 
  onCreateResourceGroup,
  isSubmitting 
}: SubnetFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SubnetFormData>();
  const subnetType = watch('type');
  const [isResourceGroupModalOpen, setIsResourceGroupModalOpen] = useState(false);
  const [isCreatingResourceGroup, setIsCreatingResourceGroup] = useState(false);

  const handleCreateResourceGroup = async (data: { 
    name: string; 
    description: string;
    region_id: string;
  }) => {
    setIsCreatingResourceGroup(true);
    try {
      await onCreateResourceGroup(data.name, data.description, data.region_id);
      setIsResourceGroupModalOpen(false);
    } finally {
      setIsCreatingResourceGroup(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Resource Group</label>
            <button
              type="button"
              onClick={() => setIsResourceGroupModalOpen(true)}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus size={16} className="mr-1" />
              New Resource Group
            </button>
          </div>
          <select
            {...register('resource_group_id', { required: 'Resource group is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a resource group</option>
            {resourceGroups.map((rg) => (
              <option key={rg.id} value={rg.id}>
                {rg.name} ({rg.region.name})
              </option>
            ))}
          </select>
          {errors.resource_group_id && (
            <p className="mt-1 text-sm text-red-600">{errors.resource_group_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a type</option>
            <option value="VLAN">VLAN</option>
            <option value="Overlay">Overlay</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Platform</label>
          <select
            {...register('platform', { required: 'Platform is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a platform</option>
            <option value="NSX">NSX</option>
            <option value="Cisco">Cisco</option>
            <option value="Palo Alto">Palo Alto</option>
          </select>
          {errors.platform && (
            <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">IPv4 CIDR</label>
          <input
            {...register('ipv4', { 
              required: 'IPv4 CIDR is required',
              pattern: {
                value: /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/,
                message: 'Invalid CIDR format (e.g., 192.168.1.0/24)'
              }
            })}
            placeholder="192.168.1.0/24"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.ipv4 && (
            <p className="mt-1 text-sm text-red-600">{errors.ipv4.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gateway</label>
          <input
            {...register('gateway', { 
              required: 'Gateway is required',
              pattern: {
                value: /^(\d{1,3}\.){3}\d{1,3}$/,
                message: 'Invalid IP address format'
              }
            })}
            placeholder="192.168.1.1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.gateway && (
            <p className="mt-1 text-sm text-red-600">{errors.gateway.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gateway Name</label>
          <input
            {...register('gw_name', { required: 'Gateway name is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            placeholder="Enter gateway name"
          />
          {errors.gw_name && (
            <p className="mt-1 text-sm text-red-600">{errors.gw_name.message}</p>
          )}
        </div>

        {subnetType === 'VLAN' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">VLAN ID</label>
            <input
              type="number"
              {...register('vlan_id', { 
                required: 'VLAN ID is required for VLAN type',
                min: { value: 1, message: 'VLAN ID must be at least 1' },
                max: { value: 4094, message: 'VLAN ID must be at most 4094' }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.vlan_id && (
              <p className="mt-1 text-sm text-red-600">{errors.vlan_id.message}</p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Subnet'}
          </button>
        </div>
      </form>

      <Modal
        isOpen={isResourceGroupModalOpen}
        onClose={() => setIsResourceGroupModalOpen(false)}
        title="Create Resource Group"
      >
        <ResourceGroupForm
          regions={regions}
          onSubmit={handleCreateResourceGroup}
          isSubmitting={isCreatingResourceGroup}
        />
      </Modal>
    </>
  );
}