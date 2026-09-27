import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { SessionStatsSummary } from '../types';

interface SessionChartsProps {
  stats: SessionStatsSummary;
}

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6'];
const STATUS_COLORS = ['#16a34a', '#94a3b8'];

export default function SessionCharts({ stats }: SessionChartsProps) {
  if (stats.totalSessions === 0) return null;

  const categoryChartData = Object.entries(stats.categoryBreakdown).map(([category, minutes]) => ({
    category,
    minutes,
  }));

  const inProgressCount = stats.totalSessions - stats.completedCount;
  const statusChartData = [
    { name: 'Completed', value: stats.completedCount },
    { name: 'In Progress', value: inProgressCount },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs transition-colors">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Duration by Category (min)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }} />
              <Bar dataKey="minutes" fill="#2563eb" radius={[6, 6, 0, 0]}>
                {categoryChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs transition-colors">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Completion Rate</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                {statusChartData.map((_, index) => (
                  <Cell key={`status-${index}`} fill={STATUS_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}