import { useState } from 'react';
import { Inbox, Send, Archive, PenSquare } from 'lucide-react';
import MessageList from './MessageList';
import ComposeMessage from './ComposeMessage';

type Tab = 'inbox' | 'sent' | 'archived' | 'compose';

export default function MessageLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('inbox');

  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'archived', label: 'Archived', icon: Archive },
    { id: 'compose', label: 'New Message', icon: PenSquare },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const tabClass = `flex items-center px-6 py-4 text-sm font-medium ${
              isActive
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={tabClass}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'compose' ? (
            <ComposeMessage />
          ) : (
            <MessageList type={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}
