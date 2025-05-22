 
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, Baby } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

const childSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  notes: z.string().optional(),
});

const childrenSchema = z.object({
  children: z.array(childSchema).min(1, 'At least one child is required'),
});

type ChildrenFormData = z.infer<typeof childrenSchema>;

interface ChildrenSetupModalProps {
  onClose: () => void;
}

export default function ChildrenSetupModal({ onClose }: ChildrenSetupModalProps) {
  const { addChildren, isLoading } = useUserStore();

  const { register, control, handleSubmit, formState: { errors } } = useForm<ChildrenFormData>({
    resolver: zodResolver(childrenSchema),
    defaultValues: {
      children: [{ name: '', dateOfBirth: '', gender: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
  });

  const onSubmit = async (data: ChildrenFormData) => {
    try {
      await addChildren(data.children);
      onClose();
    } catch (error) {
      console.error('Failed to add children:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Children</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg relative">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Child {index + 1}
                </h3>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register(`children.${index}.name`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.children?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.children[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      {...register(`children.${index}.dateOfBirth`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.children?.[index]?.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.children[index]?.dateOfBirth?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      {...register(`children.${index}.gender`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.children?.[index]?.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.children[index]?.gender?.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Notes (Optional)
                    </label>
                    <textarea
                      {...register(`children.${index}.notes`)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => append({ name: '', dateOfBirth: '', gender: '', notes: '' })}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Add Another Child
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Baby size={16} className="mr-2" />
              )}
              Save Children
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 