'use client';

import { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { Button, EmptyState, StatusBadge } from '@keepath/shared-ui';
import { formatCurrency } from '@keepath/shared-ui';
import type { Offer } from '@keepath/types';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Offers</h2>
          <p className="text-muted-foreground">Manage your products and services</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Offer
        </Button>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white rounded-lg border p-8">
          <EmptyState
            icon={Package}
            title="No offers yet"
            description="Create your first offer to start tracking profit margins and sales."
            actionLabel="Create Offer"
            onAction={() => setShowForm(true)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit/Sale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{offer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(offer.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(offer.deliveryCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.profitMargin.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(offer.profitPerSale)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge variant={offer.status.toLowerCase() as any}>
                      {offer.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <OfferForm
          onClose={() => setShowForm(false)}
          onSubmit={(offer) => {
            setOffers([...offers, offer as Offer]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function OfferForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (offer: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    deliveryCost: 0,
  });

  const profitMargin = formData.price > 0
    ? ((formData.price - formData.deliveryCost) / formData.price) * 100
    : 0;

  const profitPerSale = formData.price - formData.deliveryCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      profitMargin,
      profitPerSale,
      status: 'ACTIVE',
      isMain: false,
      id: Math.random().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Offer</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Cost</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.deliveryCost}
              onChange={(e) => setFormData({ ...formData, deliveryCost: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Profit Margin:</span>
              <span className="text-purple-600 font-semibold">{profitMargin.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Profit per Sale:</span>
              <span className="text-purple-600 font-semibold">{formatCurrency(profitPerSale)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Offer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
