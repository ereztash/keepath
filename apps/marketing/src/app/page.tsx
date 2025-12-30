import { Users, DollarSign, TrendingUp, Target } from 'lucide-react';
import { StatCard } from '@keepath/shared-ui';

export default function MarketingDashboard() {
  const stats = {
    totalLeads: 1250,
    totalSpend: 15000,
    avgCPL: 12,
    bestChannel: 'Google Ads',
  };

  const funnelData = [
    { stage: 'Awareness', count: 10000, color: 'bg-blue-500' },
    { stage: 'Consideration', count: 5000, color: 'bg-purple-500' },
    { stage: 'Conversion', count: 1250, color: 'bg-green-500' },
    { stage: 'Retention', count: 800, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketing Dashboard</h2>
        <p className="text-muted-foreground">Track your lead generation and channel performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={stats.totalLeads}
          format="number"
          color="primary"
          trend={15.2}
        />
        <StatCard
          icon={DollarSign}
          label="Total Spend"
          value={stats.totalSpend}
          format="currency"
          color="warning"
          trend={8.5}
        />
        <StatCard
          icon={Target}
          label="Avg Cost Per Lead"
          value={stats.avgCPL}
          format="currency"
          color="success"
          trend={-5.3}
        />
        <StatCard
          icon={TrendingUp}
          label="Best Channel"
          value={stats.bestChannel}
          format="none"
          color="primary"
        />
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-6">Marketing Funnel</h3>
        <div className="space-y-4">
          {funnelData.map((stage, index) => {
            const maxWidth = funnelData[0].count;
            const width = (stage.count / maxWidth) * 100;

            return (
              <div key={stage.stage}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-sm text-muted-foreground">{stage.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${stage.color}`}
                    style={{ width: `${width}%` }}
                  >
                    {index > 0 && (
                      <span className="ml-2">
                        {((stage.count / funnelData[index - 1].count) * 100).toFixed(1)}% conv
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
