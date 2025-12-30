'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, TrendingUp, Lightbulb, BarChart } from 'lucide-react';
import { Button } from '@keepath/shared-ui';

const TABS = [
  { id: 'snapshot', label: 'Snapshot', icon: BarChart },
  { id: 'goals', label: 'Goals', icon: TrendingUp },
  { id: 'reflection', label: 'Reflection', icon: Lightbulb },
  { id: 'why', label: 'Why', icon: CheckCircle },
  { id: 'review', label: 'Review', icon: Calendar },
];

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState('snapshot');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Weekly Goal Planner</h2>
        <p className="text-muted-foreground">Plan, reflect, and review your week</p>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'snapshot' && <SnapshotTab />}
          {activeTab === 'goals' && <GoalsTab />}
          {activeTab === 'reflection' && <ReflectionTab />}
          {activeTab === 'why' && <WhyTab />}
          {activeTab === 'review' && <ReviewTab />}
        </div>
      </div>
    </div>
  );
}

function SnapshotTab() {
  const [snapshot, setSnapshot] = useState({
    leads: 0,
    sales: 0,
    revenue: 0,
    profit: 0,
    hours: 0,
    mood: 7,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Weekly Snapshot</h3>
      <p className="text-sm text-muted-foreground">Record your key metrics for the week</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Leads Generated</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={snapshot.leads}
            onChange={(e) => setSnapshot({ ...snapshot, leads: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sales Closed</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={snapshot.sales}
            onChange={(e) => setSnapshot({ ...snapshot, sales: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Revenue ($)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={snapshot.revenue}
            onChange={(e) => setSnapshot({ ...snapshot, revenue: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profit ($)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={snapshot.profit}
            onChange={(e) => setSnapshot({ ...snapshot, profit: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hours Worked</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={snapshot.hours}
            onChange={(e) => setSnapshot({ ...snapshot, hours: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mood (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
            value={snapshot.mood}
            onChange={(e) => setSnapshot({ ...snapshot, mood: parseInt(e.target.value) })}
          />
          <div className="text-center text-2xl mt-1">{snapshot.mood}</div>
        </div>
      </div>

      <Button className="w-full mt-4">Save Snapshot</Button>
    </div>
  );
}

function GoalsTab() {
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Weekly Goals</h3>
      <p className="text-sm text-muted-foreground">Set 3-5 goals for this week</p>

      <div className="space-y-2">
        {goals.map((goal, index) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <span>{goal}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter a new goal..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newGoal.trim()) {
              setGoals([...goals, newGoal.trim()]);
              setNewGoal('');
            }
          }}
        />
        <Button
          onClick={() => {
            if (newGoal.trim()) {
              setGoals([...goals, newGoal.trim()]);
              setNewGoal('');
            }
          }}
        >
          Add Goal
        </Button>
      </div>
    </div>
  );
}

function ReflectionTab() {
  const [reflection, setReflection] = useState({
    wins: [''],
    blockers: [''],
    learnings: [''],
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Weekly Reflection</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Wins 🎉</label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
          placeholder="What went well this week?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Blockers 🚧</label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
          placeholder="What held you back?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Learnings 💡</label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
          placeholder="What did you learn?"
        />
      </div>

      <Button className="w-full">Save Reflection</Button>
    </div>
  );
}

function WhyTab() {
  const [why, setWhy] = useState('');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Why</h3>
      <p className="text-sm text-muted-foreground">
        Reconnect with your purpose and long-term vision
      </p>

      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        rows={8}
        placeholder="Why are you doing this? What's your bigger vision?"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
      />

      <Button className="w-full">Save Your Why</Button>
    </div>
  );
}

function ReviewTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review</h3>
      <p className="text-sm text-muted-foreground">
        Compare your actuals vs goals and see your progress
      </p>

      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-muted-foreground">No data to review yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Fill out your snapshot and goals to see your review
        </p>
      </div>
    </div>
  );
}
