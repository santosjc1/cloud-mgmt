import React from 'react';
import { useForm } from 'react-hook-form';
import type { Region } from '../../types/region';

interface ResourceGroupFormData {
  name: string;
  description: string;
  region_id: string;
}

interface ResourceGroupFormProps {
  regions: Region[];
  onSubmit: (data: ResourceGroupFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function ResourceGroupForm({ regions, onSubmit, isSubmitting }: ResourceGroupFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ResourceGroupFormData>();

  return (
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
        <label className="block text-sm font-medium text-gray-700">Region</label>
        <select
          {...register('region_id', { required: 'Region is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select a region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name} ({region.code})
            </option>
          ))}
        </select>
        {errors.region_id && (
          <p className="mt-1 text-sm text-red-600">{errors.region_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          rows={3}
        />
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Resource Group'}
        </button>
      </div>
    </form>
  );
}