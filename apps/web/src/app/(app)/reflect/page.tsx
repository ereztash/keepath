'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BookHeart, Plus, X } from 'lucide-react';

interface CheckIn {
  id: string;
  mood: number;
  wins: string[];
  blockers: string[];
  learnings: string[];
  reflection: string | null;
}

export default function ReflectPage() {
  const qc = useQueryClient();
  const { data: checkIn } = useQuery<CheckIn | null>({
    queryKey: ['checkin'],
    queryFn: () => fetch('/api/checkin').then((r) => r.json()),
  });

  const [mood, setMood] = useState(5);
  const [wins, setWins] = useState<string[]>([]);
  const [blockers, setBlockers] = useState<string[]>([]);
  const [learnings, setLearnings] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    if (checkIn) {
      setMood(checkIn.mood);
      setWins(checkIn.wins);
      setBlockers(checkIn.blockers);
      setLearnings(checkIn.learnings);
      setReflection(checkIn.reflection || '');
    }
  }, [checkIn]);

  const save = useMutation({
    mutationFn: () =>
      fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, wins, blockers, learnings, reflection }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checkin'] });
      toast.success('Reflection saved');
    },
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookHeart className="h-6 w-6 text-pink-500" /> Weekly reflection
        </h1>
        <p className="text-slate-500 text-sm">A few honest minutes can change the next week.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          How are you feeling about this week? <span className="text-slate-400">({mood}/10)</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={mood}
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Drained</span>
          <span>Energized</span>
        </div>
      </div>

      <ListSection label="Wins" placeholder="Something you're proud of…" items={wins} setItems={setWins} color="emerald" />
      <ListSection
        label="Blockers"
        placeholder="What got in the way…"
        items={blockers}
        setItems={setBlockers}
        color="red"
      />
      <ListSection
        label="Learnings"
        placeholder="Something you noticed…"
        items={learnings}
        setItems={setLearnings}
        color="indigo"
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Anything else on your mind?
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={4}
          placeholder="Write freely…"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <button
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold"
      >
        {save.isPending ? 'Saving…' : 'Save reflection'}
      </button>
    </div>
  );
}

function ListSection({
  label,
  placeholder,
  items,
  setItems,
  color,
}: {
  label: string;
  placeholder: string;
  items: string[];
  setItems: (xs: string[]) => void;
  color: 'emerald' | 'red' | 'indigo';
}) {
  const [draft, setDraft] = useState('');
  const colorClass = {
    emerald: 'bg-emerald-50 text-emerald-800',
    red: 'bg-red-50 text-red-800',
    indigo: 'bg-indigo-50 text-indigo-800',
  }[color];

  function add() {
    if (!draft.trim()) return;
    setItems([...items, draft.trim()]);
    setDraft('');
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-3">{label}</label>
      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={add} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg ${colorClass}`}>
            <span className="text-sm">{it}</span>
            <button onClick={() => setItems(items.filter((_, j) => j !== i))}>
              <X className="h-3 w-3 opacity-60 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
