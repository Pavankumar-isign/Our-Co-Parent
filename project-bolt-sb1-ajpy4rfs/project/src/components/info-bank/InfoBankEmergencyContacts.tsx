import { useEffect } from 'react';
import { useInfoBankStore } from '../../store/useInfoBankStore';
import { format } from 'date-fns';
import { Phone, Star, Edit, Trash } from 'lucide-react';

export default function InfoBankEmergencyContacts() {
  const { 
    emergencyContacts, 
    isLoading, 
    error, 
    fetchEmergencyContacts,
    deleteEntry,
    setSelectedEntry 
  } = useInfoBankStore();

  useEffect(() => {
    fetchEmergencyContacts();
  }, [fetchEmergencyContacts]);

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
    <div className="space-y-4">
      {emergencyContacts.map(contact => (
        <div
          key={contact.id}
          className="bg-white rounded-lg shadow p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-100 rounded-full">
                <Phone size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{contact.title}</h3>
                <p className="text-sm text-gray-500">
                  Added on {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedEntry(contact)}
                className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => deleteEntry(contact.id)}
                className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                title="Delete"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-gray-600">{contact.description}</p>
          </div>

          {contact.associatedMembers && contact.associatedMembers.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Associated Members:</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {contact.associatedMembers.map(member => (
                  <span
                    key={member}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}