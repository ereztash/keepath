'use client';

import { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button, EmptyState, formatCurrency } from '@keepath/shared-ui';

export default function PipelinePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Pipeline</h2>
          <p className="text-muted-foreground">Manage and track all deals</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Sale
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-8">
        <EmptyState
          icon={ShoppingCart}
          title="No sales logged yet"
          description="Start logging your sales to track performance and trends."
          actionLabel="Log First Sale"
          onAction={() => setShowForm(true)}
        />
      </div>

      {showForm && (
        <SaleForm onClose={() => setShowForm(false)} onSubmit={() => setShowForm(false)} />
      )}
    </div>
  );
}

function SaleForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    clientName: '',
    offerId: '',
    amount: 0,
    soldById: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Log New Sale</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Offer</label>
            <select
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.offerId}
              onChange={(e) => setFormData({ ...formData, offerId: e.target.value })}
            >
              <option value="">Select an offer...</option>
              <option value="1">Premium Package - $2,500</option>
              <option value="2">Standard Package - $1,200</option>
              <option value="3">Basic Package - $500</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sold By</label>
            <select
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.soldById}
              onChange={(e) => setFormData({ ...formData, soldById: e.target.value })}
            >
              <option value="">Select team member...</option>
              <option value="1">Sarah Johnson</option>
              <option value="2">Mike Brown</option>
              <option value="3">Alex Chen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Log Sale
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
