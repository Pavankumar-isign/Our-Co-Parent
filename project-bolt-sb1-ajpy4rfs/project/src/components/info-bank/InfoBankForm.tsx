import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInfoBankStore } from '../../store/useInfoBankStore';
import { FileText, Upload, Users, Lock } from 'lucide-react';
import { InfoBankSection } from '../../types';

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  section: z.nativeEnum(InfoBankSection),
  associatedMembers: z.array(z.string()),
  isPrivate: z.boolean(),
  isEmergencyContact: z.boolean()
});

type EntryFormData = z.infer<typeof entrySchema>;

export default function InfoBankForm() {
  const { createEntry, isLoading } = useInfoBankStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema)
  });

  const onSubmit = async (data: EntryFormData) => {
    try {
      await createEntry(data);
      reset();
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Section
        </label>
        <select
          {...register('section')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {Object.values(InfoBankSection).map(section => (
            <option key={section} value={section}>
              {section.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Files
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload size={24} className="mx-auto text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload files</span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, images up to 10MB
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('isPrivate')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700 flex items-center">
            <Lock size={14} className="mr-1" />
            Make this entry private
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('isEmergencyContact')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Mark as emergency contact
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <FileText size={16} className="mr-2" />
          )}
          Save Entry
        </button>
      </div>
    </form>
  );
}