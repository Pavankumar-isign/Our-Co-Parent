 
import { useState } from 'react';
import { User, Shield, Bell, Users, CreditCard, Palette } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';  

type Tab = 'profile' | 'security' | 'notifications' | 'connected' | 'subscription' | 'personalization';

export default function AccountLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'connected', label: 'Connected Accounts', icon: Users },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'personalization', label: 'Personalization', icon: Palette },
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
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {/* {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'connected' && <ConnectedAccounts />}
          {activeTab === 'subscription' && <SubscriptionSettings />}
          {activeTab === 'personalization' && <PersonalizationSettings />} */}
        </div>
      </div>
    </div>
  );
}
 