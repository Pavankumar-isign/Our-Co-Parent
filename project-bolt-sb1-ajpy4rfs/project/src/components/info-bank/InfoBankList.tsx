import { useEffect } from 'react';
import { useInfoBankStore } from '../../store/useInfoBankStore';
import { format } from 'date-fns';
import { FileText, Edit, Trash, Lock, Users, Plus } from 'lucide-react';
import { InfoBankSection } from '../../types';

interface InfoBankListProps {
  section: InfoBankSection;
}

export default function InfoBankList({ section }: InfoBankListProps) {
  const { 
    entries, 
    isLoading, 
    error, 
    fetchEntries,
    deleteEntry,
    setSelectedEntry,
    openEntryModal
  } = useInfoBankStore();

  useEffect(() => {
    fetchEntries(section);
  }, [section, fetchEntries]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {section.replace('_', ' ').toLowerCase()}
        </h2>
        <button
          onClick={() => openEntryModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Entry
        </button>
      </div>

      <div className="space-y-4">
        {entries.map(entry => (
          <div
            key={entry.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-gray-600">{entry.description}</p>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              {entry.isPrivate ? (
                <span className="inline-flex items-center text-sm text-gray-500">
                  <Lock size={14} className="mr-1" />
                  Private
                </span>
              ) : (
                <span className="inline-flex items-center text-sm text-gray-500">
                  <Users size={14} className="mr-1" />
                  Shared
                </span>
              )}

              {entry.files && entry.files.length > 0 && (
                <span className="inline-flex items-center text-sm text-gray-500">
                  <FileText size={14} className="mr-1" />
                  {entry.files.length} file(s)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}