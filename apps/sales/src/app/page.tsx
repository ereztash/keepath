import { DollarSign, Target, TrendingUp, Award } from 'lucide-react';
import { StatCard, formatCurrency } from '@keepath/shared-ui';

export default function SalesDashboard() {
  const stats = {
    totalSales: 145000,
    avgDealSize: 2900,
    winRate: 42,
    topSeller: 'Sarah Johnson',
  };

  const recentSales = [
    { id: 1, client: 'Acme Corp', amount: 5000, seller: 'Sarah Johnson', date: '2024-01-15', status: 'CLOSED' },
    { id: 2, client: 'Tech Solutions', amount: 3500, seller: 'Mike Brown', date: '2024-01-14', status: 'CLOSED' },
    { id: 3, client: 'Digital Agency', amount: 7200, seller: 'Sarah Johnson', date: '2024-01-13', status: 'CLOSED' },
    { id: 4, client: 'StartupXYZ', amount: 2100, seller: 'Alex Chen', date: '2024-01-12', status: 'PENDING' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sales Dashboard</h2>
        <p className="text-muted-foreground">Track your sales performance and pipeline</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Total Sales"
          value={stats.totalSales}
          format="currency"
          color="success"
          trend={18.5}
        />
        <StatCard
          icon={Target}
          label="Avg Deal Size"
          value={stats.avgDealSize}
          format="currency"
          color="primary"
          trend={7.2}
        />
        <StatCard
          icon={TrendingUp}
          label="Win Rate"
          value={`${stats.winRate}%`}
          format="none"
          color="success"
          trend={5.1}
        />
        <StatCard
          icon={Award}
          label="Top Seller"
          value={stats.topSeller}
          format="none"
          color="primary"
        />
      </div>

      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(sale.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.seller}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sale.status === 'CLOSED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
