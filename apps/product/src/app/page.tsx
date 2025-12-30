'use client';

import { useState } from 'react';
import { Plus, Target, Trophy, Clock, Star } from 'lucide-react';
import { Button, EmptyState, StatusBadge } from '@keepath/shared-ui';
import type { Mission } from '@keepath/types';

const MISSION_TYPE_CONFIG = {
  QUICK_WIN: { label: 'Quick Win', xp: '10-50 XP', icon: Star, color: 'text-yellow-600' },
  WEEKLY_CHALLENGE: { label: 'Weekly Challenge', xp: '50-100 XP', icon: Target, color: 'text-blue-600' },
  MILESTONE: { label: 'Milestone', xp: '100-250 XP', icon: Trophy, color: 'text-purple-600' },
  NINETY_DAY_GOAL: { label: '90-Day Goal', xp: '250-500 XP', icon: Trophy, color: 'text-green-600' },
};

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const totalXP = missions.filter((m) => m.status === 'COMPLETED').reduce((sum, m) => sum + m.xpReward, 0);

  const filteredMissions = missions.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter.toUpperCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Missions</h2>
          <p className="text-muted-foreground">Gamified task management with XP rewards</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-purple-900">Total XP: {totalXP}</span>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Mission
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      {filteredMissions.length === 0 ? (
        <div className="bg-white rounded-lg border p-8">
          <EmptyState
            icon={Target}
            title="No missions yet"
            description="Create your first mission to start earning XP and tracking progress."
            actionLabel="Create Mission"
            onAction={() => setShowForm(true)}
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMissions.map((mission) => {
            const config = MISSION_TYPE_CONFIG[mission.type];
            const Icon = config.icon;

            return (
              <div key={mission.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <h3 className="text-lg font-semibold">{mission.title}</h3>
                      <StatusBadge variant={mission.status.toLowerCase() as any}>
                        {mission.status.replace('_', ' ')}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-purple-600 font-medium">
                        <Trophy className="h-4 w-4" />
                        {mission.xpReward} XP
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        {mission.duration} days
                      </span>
                      <span className="text-gray-600">{mission.department}</span>
                    </div>
                  </div>
                  {mission.status !== 'COMPLETED' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setMissions(
                          missions.map((m) =>
                            m.id === mission.id ? { ...m, status: 'COMPLETED' as any } : m
                          )
                        );
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <MissionForm
          onClose={() => setShowForm(false)}
          onSubmit={(mission) => {
            setMissions([...missions, mission as Mission]);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function MissionForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (mission: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'QUICK_WIN',
    department: 'PRODUCT',
    duration: 1,
    xpReward: 25,
    priority: 'MEDIUM',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'PENDING',
      subtasks: [],
      id: Math.random().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Create New Mission</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="QUICK_WIN">Quick Win (10-50 XP)</option>
              <option value="WEEKLY_CHALLENGE">Weekly Challenge (50-100 XP)</option>
              <option value="MILESTONE">Milestone (100-250 XP)</option>
              <option value="NINETY_DAY_GOAL">90-Day Goal (250-500 XP)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="PRODUCT">Product</option>
              <option value="FINANCE">Finance</option>
              <option value="MARKETING">Marketing</option>
              <option value="SALES">Sales</option>
              <option value="OPERATIONS">Operations</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (days)</label>
              <input
                type="number"
                required
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">XP Reward</label>
              <input
                type="number"
                required
                min="10"
                max="500"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.xpReward}
                onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 25 })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Mission
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
