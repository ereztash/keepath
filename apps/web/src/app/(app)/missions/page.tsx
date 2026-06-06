'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Flag } from 'lucide-react';
import { toast } from 'sonner';

interface Mission {
  id: string;
  title: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  xpReward: number;
  dueDate: string | null;
  completedAt: string | null;
}

export default function MissionsPage() {
  const qc = useQueryClient();
  const { data: missions } = useQuery<Mission[]>({
    queryKey: ['missions'],
    queryFn: () => fetch('/api/missions').then((r) => r.json()),
  });

  const [newTitle, setNewTitle] = useState('');

  const create = useMutation({
    mutationFn: (title: string) =>
      fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      setNewTitle('');
      qc.invalidateQueries({ queryKey: ['missions'] });
    },
  });

  const toggle = useMutation({
    mutationFn: (m: Mission) =>
      fetch(`/api/missions/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: m.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
        }),
      }),
    onSuccess: (_, m) => {
      qc.invalidateQueries({ queryKey: ['missions'] });
      if (m.status !== 'COMPLETED') toast.success(`+${m.xpReward} XP`);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => fetch(`/api/missions/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['missions'] }),
  });

  const pending = missions?.filter((m) => m.status !== 'COMPLETED') || [];
  const completed = missions?.filter((m) => m.status === 'COMPLETED') || [];
  const totalXp = completed.reduce((s, m) => s + m.xpReward, 0);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Missions</h1>
          <p className="text-slate-500 text-sm">Concrete actions toward what matters</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">{totalXp} XP</div>
          <div className="text-xs text-slate-500">{completed.length} completed</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newTitle.trim()) create.mutate(newTitle.trim());
          }}
          className="flex gap-2"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What's the next mission?"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </form>
      </div>

      {pending.length === 0 && completed.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <Flag className="h-8 w-8 mx-auto mb-3 text-slate-300" />
          No missions yet. Add the first one above.
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
              <div className="px-6 py-3 text-xs font-medium text-slate-500 border-b border-slate-100 bg-slate-50">
                ACTIVE ({pending.length})
              </div>
              <div className="divide-y divide-slate-100">
                {pending.map((m) => (
                  <MissionRow key={m.id} m={m} onToggle={() => toggle.mutate(m)} onDelete={() => remove.mutate(m.id)} />
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 text-xs font-medium text-slate-500 border-b border-slate-100 bg-slate-50">
                COMPLETED ({completed.length})
              </div>
              <div className="divide-y divide-slate-100">
                {completed.map((m) => (
                  <MissionRow key={m.id} m={m} onToggle={() => toggle.mutate(m)} onDelete={() => remove.mutate(m.id)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MissionRow({ m, onToggle, onDelete }: { m: Mission; onToggle: () => void; onDelete: () => void }) {
  const done = m.status === 'COMPLETED';
  return (
    <div className="px-6 py-3 flex items-center gap-3 group">
      <button onClick={onToggle}>
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : (
          <Circle className="h-5 w-5 text-slate-300 hover:text-indigo-500" />
        )}
      </button>
      <span className={`flex-1 ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
        {m.title}
      </span>
      <span className="text-xs text-slate-500">{m.xpReward} XP</span>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 transition">
        <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
      </button>
    </div>
  );
}
