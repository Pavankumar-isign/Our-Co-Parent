import { useState } from 'react';
import { FileText, Activity, Heart, School, Phone, Folder } from 'lucide-react';
import InfoBankList from './InfoBankList';
import InfoBankForm from './InfoBankForm';
import InfoBankEmergencyContacts from './InfoBankEmergencyContacts';
import { InfoBankSection } from '../../types';

type Tab = InfoBankSection | 'create';

export default function InfoBankLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('FAMILY_VITALS');

  const tabs = [
    { id: 'FAMILY_VITALS', label: 'Family Vitals', icon: FileText },
    { id: 'HEALTH', label: 'Health', icon: Heart },
    { id: 'EDUCATION', label: 'Education', icon: School },
    { id: 'ACTIVITIES', label: 'Activities', icon: Activity },
    { id: 'EMERGENCY_CONTACTS', label: 'Emergency Contacts', icon: Phone },
    { id: 'MY_FILES', label: 'My Files', icon: Folder },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'EMERGENCY_CONTACTS' ? (
            <InfoBankEmergencyContacts />
          ) : (
            <InfoBankList section={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}