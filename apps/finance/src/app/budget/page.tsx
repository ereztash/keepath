'use client';

import { Wallet } from 'lucide-react';
import { StatCard } from '@keepath/shared-ui';

export default function BudgetPage() {
  const budgetData = {
    categories: [
      { name: 'Team', planned: 50000, actual: 48000 },
      { name: 'Marketing', planned: 20000, actual: 22000 },
      { name: 'Operations', planned: 15000, actual: 14500 },
      { name: 'Other', planned: 10000, actual: 9000 },
    ],
  };

  const totalPlanned = budgetData.categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalActual = budgetData.categories.reduce((sum, cat) => sum + cat.actual, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Budget Tracker</h2>
        <p className="text-muted-foreground">Monitor spending across categories</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          icon={Wallet}
          label="Total Planned"
          value={totalPlanned}
          format="currency"
          color="primary"
        />
        <StatCard
          icon={Wallet}
          label="Total Actual"
          value={totalActual}
          format="currency"
          color={totalActual > totalPlanned ? 'warning' : 'success'}
        />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Budget by Category</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {budgetData.categories.map((category) => {
              const variance = category.actual - category.planned;
              const variancePercent = (variance / category.planned) * 100;

              return (
                <div key={category.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{category.name}</span>
                    <div className="text-sm text-right">
                      <div className="font-semibold">
                        ${category.actual.toLocaleString()} / ${category.planned.toLocaleString()}
                      </div>
                      <div className={variance > 0 ? 'text-red-600' : 'text-green-600'}>
                        {variance > 0 ? '+' : ''}${variance.toLocaleString()} ({variancePercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.actual > category.planned ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((category.actual / category.planned) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
