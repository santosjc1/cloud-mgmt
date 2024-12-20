import React from 'react';
import { useForm } from 'react-hook-form';
import { fetchRegions } from '../../services/regionService';
import type { Region } from '../../types/region';

interface AddDataSourceFormData {
  type: 'NSX' | 'Cisco' | 'Palo Alto' | 'vCenter';
  region_id: string;
}

interface AddDataSourceFormProps {
  onSubmit: (data: { type: 'NSX' | 'Cisco' | 'Palo Alto' | 'vCenter', region: Region }) => void;
  onCancel: () => void;
}

export default function AddDataSourceForm({ onSubmit, onCancel }: AddDataSourceFormProps) {
  const [regions, setRegions] = React.useState<Region[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm<AddDataSourceFormData>();

  React.useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      const regions = await fetchRegions();
      setRegions(regions);
    } catch (error) {
      console.error('Failed to load regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data: AddDataSourceFormData) => {
    const region = regions.find(r => r.id === data.region_id);
    if (!region) return;
    
    onSubmit({
      type: data.type,
      region
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register('type', { required: 'Type is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select a type</option>
          <option value="NSX">NSX</option>
          <option value="Cisco">Cisco</option>
          <option value="Palo Alto">Palo Alto</option>
          <option value="vCenter">vCenter</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Region</label>
        <select
          {...register('region_id', { required: 'Region is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select a region</option>
          {regions.map(region => (
            <option key={region.id} value={region.id}>
              {region.name} ({region.code})
            </option>
          ))}
        </select>
        {errors.region_id && (
          <p className="mt-1 text-sm text-red-600">{errors.region_id.message}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </form>
  );
}