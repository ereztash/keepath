import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import { StatCard } from '@keepath/shared-ui';

export default function FinanceDashboard() {
  // These will be replaced with real data from API
  const stats = {
    revenue: 125000,
    profit: 45000,
    expenses: 80000,
    runway: 18,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Finance Dashboard</h2>
        <p className="text-muted-foreground">Overview of your financial metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={stats.revenue}
          format="currency"
          color="success"
          trend={12.5}
        />
        <StatCard
          icon={TrendingUp}
          label="Net Profit"
          value={stats.profit}
          format="currency"
          color="primary"
          trend={8.3}
        />
        <StatCard
          icon={CreditCard}
          label="Total Expenses"
          value={stats.expenses}
          format="currency"
          color="warning"
          trend={-3.2}
        />
        <StatCard
          icon={Wallet}
          label="Runway"
          value={`${stats.runway} months`}
          format="none"
          color="primary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          <p className="text-sm text-muted-foreground">Chart will go here</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Profit Margins by Offer</h3>
          <p className="text-sm text-muted-foreground">Chart will go here</p>
        </div>
      </div>
    </div>
  );
}
