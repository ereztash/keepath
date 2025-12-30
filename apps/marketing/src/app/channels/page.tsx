'use client';

import { useState } from 'react';
import { Plus, Radio } from 'lucide-react';
import { Button, EmptyState, StatusBadge, formatCurrency } from '@keepath/shared-ui';
import type { MarketingChannel } from '@keepath/types';

export default function ChannelsPage() {
  const [channels, setChannels] = useState<MarketingChannel[]>([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Channels</h2>
          <p className="text-muted-foreground">Track performance across all channels</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>

      {channels.length === 0 ? (
        <div className="bg-white rounded-lg border p-8">
          <EmptyState
            icon={Radio}
            title="No channels yet"
            description="Add your first marketing channel to start tracking leads and ROI."
            actionLabel="Add Channel"
            onAction={() => setShowForm(true)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conv Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {channels.map((channel) => (
                <tr key={channel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{channel.source}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.funnelStage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.visitors.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {channel.leads.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {channel.convRate.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(channel.monthlySpend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(channel.costPerLead)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge variant={channel.status.toLowerCase() as any}>
                      {channel.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ChannelForm
          onClose={() => setShowForm(false)}
          onSubmit={(channel) => {
            setChannels([...channels, channel as MarketingChannel]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ChannelForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (channel: any) => void }) {
  const [formData, setFormData] = useState({
    source: '',
    funnelStage: 'AWARENESS',
    visitors: 0,
    leads: 0,
    monthlySpend: 0,
  });

  const convRate = formData.visitors > 0 ? (formData.leads / formData.visitors) * 100 : 0;
  const costPerLead = formData.leads > 0 ? formData.monthlySpend / formData.leads : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      convRate,
      costPerLead,
      status: 'ACTIVE',
      id: Math.random().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Marketing Channel</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <input
              type="text"
              required
              placeholder="e.g. Google Ads, Facebook, Email"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Funnel Stage</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.funnelStage}
              onChange={(e) => setFormData({ ...formData, funnelStage: e.target.value })}
            >
              <option value="AWARENESS">Awareness</option>
              <option value="CONSIDERATION">Consideration</option>
              <option value="CONVERSION">Conversion</option>
              <option value="RETENTION">Retention</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Visitors</label>
            <input
              type="number"
              required
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.visitors}
              onChange={(e) => setFormData({ ...formData, visitors: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Leads</label>
            <input
              type="number"
              required
              min="0"
              max={formData.visitors}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.leads}
              onChange={(e) => setFormData({ ...formData, leads: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Spend</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.monthlySpend}
              onChange={(e) => setFormData({ ...formData, monthlySpend: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Conversion Rate:</span>
              <span className="text-purple-600 font-semibold">{convRate.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Cost Per Lead:</span>
              <span className="text-purple-600 font-semibold">{formatCurrency(costPerLead)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Channel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
