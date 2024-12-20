import React from 'react';
import { useForm } from 'react-hook-form';

interface PaloAltoConfig {
  url: string;
  username: string;
  password: string;
  api_key?: string;
}

interface PaloAltoConfigFormProps {
  onSubmit: (data: PaloAltoConfig) => Promise<void>;
  isSubmitting: boolean;
}

export default function PaloAltoConfigForm({ onSubmit, isSubmitting }: PaloAltoConfigFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PaloAltoConfig>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Panorama URL</label>
        <input
          {...register('url', { required: 'Panorama URL is required' })}
          type="url"
          placeholder="https://panorama.example.com"
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
        <label className="block text-sm font-medium text-gray-700">API Key (Optional)</label>
        <input
          {...register('api_key')}
          type="password"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        />
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