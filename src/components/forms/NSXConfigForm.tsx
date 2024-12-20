import React from 'react';
import { useForm } from 'react-hook-form';
import type { NSXManagerConfig } from '../../services/regionService';
import type { Region } from '../../types/region';

interface NSXConfigFormProps {
  onSubmit: (data: NSXManagerConfig) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Region & Partial<NSXManagerConfig>;
}

export default function NSXConfigForm({ onSubmit, isSubmitting, initialData }: NSXConfigFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<NSXManagerConfig>({
    defaultValues: {
      url: initialData?.nsx_manager_url || '',
      username: initialData?.nsx_manager_username || '',
      password: '',
      thumbprint: initialData?.nsx_manager_thumbprint || '',
      sync_enabled: initialData?.sync_enabled || false,
      sync_interval_minutes: initialData?.sync_interval_minutes || 5,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">NSX Manager URL</label>
        <input
          {...register('url', { required: 'NSX Manager URL is required' })}
          type="url"
          placeholder="https://nsx.example.com"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          {...register('username', { required: 'Username is required' })}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password', { required: 'Password is required' })}
          type="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">SSL Thumbprint</label>
        <input
          {...register('thumbprint', { required: 'SSL Thumbprint is required' })}
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.thumbprint && (
          <p className="mt-1 text-sm text-red-600">{errors.thumbprint.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          {...register('sync_enabled')}
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">Enable Sync</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sync Interval (minutes)</label>
        <input
          {...register('sync_interval_minutes', { 
            required: 'Sync interval is required',
            min: { value: 1, message: 'Minimum interval is 1 minute' }
          })}
          type="number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.sync_interval_minutes && (
          <p className="mt-1 text-sm text-red-600">{errors.sync_interval_minutes.message}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}