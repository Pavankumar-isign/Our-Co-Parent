import { useEffect, useState } from 'react';
import { useExpenseStore } from '../../store/useExpenseStore';
import { format } from 'date-fns';
import { Check, X, DollarSign, FileText, Edit, Trash } from 'lucide-react';
import { ExpenseStatus } from '../../types';

export default function ExpenseList() {
  const { expenses, isLoading, error, fetchExpenses, approveExpense, rejectExpense, deleteExpense } = useExpenseStore();
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = selectedStatus === 'ALL' 
    ? expenses 
    : expenses.filter(e => e.status === selectedStatus);

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
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'PAID'] as const).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredExpenses.map(expense => (
          <div
            key={expense.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{expense.title}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(expense.purchaseDate), 'MMM d, yyyy')}
                </p>
                <div className="flex items-center mt-1">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-lg font-semibold text-gray-700">
                    {expense.amount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {expense.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => approveExpense(expense.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                      title="Approve"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => rejectExpense(expense.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </>
                )}
                {expense.receiptUrl && (
                  <a
                    href={expense.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                    title="View Receipt"
                  >
                    <FileText size={18} />
                  </a>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                expense.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                expense.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                expense.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {expense.status}
              </span>
            </div>
            {expense.description && (
              <p className="mt-2 text-sm text-gray-600">{expense.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}