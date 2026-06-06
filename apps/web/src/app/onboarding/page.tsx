'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Briefcase, BookOpen, Dumbbell, Users, Sparkles, Brain, Home, Palette, Music, Target, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Briefcase, BookOpen, Dumbbell, Users, Sparkles, Brain, Home, Palette, Music, Target,
};

const SUGGESTED = [
  { name: 'Family', icon: 'Heart', color: '#ec4899' },
  { name: 'Deep Work', icon: 'Brain', color: '#6366f1' },
  { name: 'Health', icon: 'Dumbbell', color: '#10b981' },
  { name: 'Learning', icon: 'BookOpen', color: '#f59e0b' },
  { name: 'Friends', icon: 'Users', color: '#06b6d4' },
  { name: 'Creativity', icon: 'Palette', color: '#8b5cf6' },
];

interface Draft {
  name: string;
  icon: string;
  color: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [customName, setCustomName] = useState('');
  const [saving, setSaving] = useState(false);

  function addValue(d: Draft) {
    if (drafts.find((x) => x.name === d.name)) return;
    setDrafts([...drafts, d]);
  }
  function removeValue(name: string) {
    setDrafts(drafts.filter((d) => d.name !== name));
  }
  function addCustom() {
    if (!customName.trim()) return;
    addValue({ name: customName.trim(), icon: 'Target', color: '#6366f1' });
    setCustomName('');
  }

  async function handleSave() {
    if (drafts.length < 2) {
      toast.error('Pick at least 2 values');
      return;
    }
    setSaving(true);
    try {
      await Promise.all(
        drafts.map((d, i) =>
          fetch('/api/values', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...d, sortOrder: i }),
          })
        )
      );
      router.push('/intentions?onboarding=true');
    } catch {
      toast.error('Something went wrong');
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">What matters to you?</h1>
          <p className="text-slate-600">
            Choose the areas of your life you want to invest time in. You can change these later.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 mb-6">
          <h2 className="text-sm font-medium text-slate-500 mb-3">SUGGESTED</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUGGESTED.map((s) => {
              const Icon = ICONS_MAP[s.icon];
              const selected = drafts.find((d) => d.name === s.name);
              return (
                <button
                  key={s.name}
                  onClick={() => (selected ? removeValue(s.name) : addValue(s))}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${
                    selected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{s.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="Or write your own…"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addCustom}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-sm flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>

        {drafts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 mb-6">
            <h2 className="text-sm font-medium text-slate-500 mb-3">YOUR VALUES ({drafts.length})</h2>
            <div className="flex flex-wrap gap-2">
              {drafts.map((d) => {
                const Icon = ICONS_MAP[d.icon] || Target;
                return (
                  <div
                    key={d.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${d.color}15`, color: d.color }}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="text-sm font-medium">{d.name}</span>
                    <button onClick={() => removeValue(d.name)}>
                      <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || drafts.length < 2}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition"
        >
          {saving ? 'Saving…' : 'Continue to set hours'}
        </button>
      </div>
    </div>
  );
}
