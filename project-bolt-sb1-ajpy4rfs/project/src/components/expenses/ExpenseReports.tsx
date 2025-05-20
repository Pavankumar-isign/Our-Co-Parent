import { useEffect, useState } from 'react';
import { useExpenseStore } from '../../store/useExpenseStore';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ExpenseReports() {
  const { getExpenseReport, isLoading } = useExpenseStore();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await getExpenseReport();
      setReport(data);
    };
    fetchReport();
  }, [getExpenseReport]);

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const monthlyData = {
    labels: report.monthlyTotals.map((item: any) => item.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: report.monthlyTotals.map((item: any) => item.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const categoryData = {
    labels: report.categoryBreakdown.map((item: any) => item.category),
    datasets: [
      {
        data: report.categoryBreakdown.map((item: any) => item.amount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Total Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            ${report.totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Pending Reimbursements</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            ${report.pendingReimbursements.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {report.categoryBreakdown.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <Line data={monthlyData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <Pie data={categoryData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }} />
        </div>
      </div>
    </div>
  );
}