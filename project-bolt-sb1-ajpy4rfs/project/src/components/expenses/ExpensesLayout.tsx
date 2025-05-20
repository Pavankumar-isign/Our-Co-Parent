import { useState } from 'react';
import { DollarSign, ListPlus, FileText, BarChart3 } from 'lucide-react';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import ExpenseReports from './ExpenseReports';

type Tab = 'list' | 'create' | 'reports';

export default function ExpensesLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('list');

  const tabs = [
    { id: 'list', label: 'Expenses', icon: DollarSign },
    { id: 'create', label: 'New Expense', icon: ListPlus },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
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
          {activeTab === 'list' && <ExpenseList />}
          {activeTab === 'create' && <ExpenseForm />}
          {activeTab === 'reports' && <ExpenseReports />}
        </div>
      </div>
    </div>
  );
}