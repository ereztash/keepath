'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Target, Save } from 'lucide-react';
import { formatWeekRange } from '@/lib/dates';

interface Value {
  id: string;
  name: string;
  color: string;
}

interface Intention {
  id: string;
  valueId: string;
  targetHours: number;
  value: Value;
}

export default function IntentionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading…</div>}>
      <IntentionsInner />
    </Suspense>
  );
}

function IntentionsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const isOnboarding = params.get('onboarding') === 'true';
  const qc = useQueryClient();

  const { data: values } = useQuery<Value[]>({
    queryKey: ['values'],
    queryFn: () => fetch('/api/values').then((r) => r.json()),
  });

  const { data: intentions } = useQuery<Intention[]>({
    queryKey: ['intentions'],
    queryFn: () => fetch('/api/intentions').then((r) => r.json()),
  });

  const [hoursMap, setHoursMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!values || !intentions) return;
    const map: Record<string, number> = {};
    for (const v of values) {
      const existing = intentions.find((i) => i.valueId === v.id);
      map[v.id] = existing?.targetHours ?? 5;
    }
    setHoursMap(map);
  }, [values, intentions]);

  const [saving, setSaving] = useState(false);
  async function handleSave() {
    if (!values) return;
    setSaving(true);
    const weekStart = new Date().toISOString();
    try {
      await Promise.all(
        values.map((v) =>
          fetch('/api/intentions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              valueId: v.id,
              weekStart,
              targetHours: hoursMap[v.id] ?? 0,
            }),
          })
        )
      );
      qc.invalidateQueries({ queryKey: ['intentions'] });
      qc.invalidateQueries({ queryKey: ['alignment'] });
      toast.success('Intentions saved');
      if (isOnboarding) {
        router.push('/dashboard');
      }
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }

  const totalHours = Object.values(hoursMap).reduce((s, h) => s + h, 0);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {isOnboarding ? 'How will you invest your time?' : 'This week\'s intentions'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {formatWeekRange(new Date())} · Set hours per value
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        {values?.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">
            No values yet. <a href="/onboarding" className="text-indigo-600 underline">Add some</a>.
          </p>
        )}
        <div className="space-y-5">
          {values?.map((v) => (
            <div key={v.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: v.color }}
                  >
                    <Target className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-slate-900">{v.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={0.5}
                    value={hoursMap[v.id] ?? 0}
                    onChange={(e) =>
                      setHoursMap({ ...hoursMap, [v.id]: parseFloat(e.target.value) || 0 })
                    }
                    className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-500">hours</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={0.5}
                value={hoursMap[v.id] ?? 0}
                onChange={(e) =>
                  setHoursMap({ ...hoursMap, [v.id]: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
            </div>
          ))}
        </div>

        {values && values.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Total: <span className="font-semibold text-slate-900">{totalHours}h</span> of 168h in the week
            </span>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
      >
        <Save className="h-4 w-4" />
        {saving ? 'Saving…' : isOnboarding ? 'Save & go to dashboard' : 'Save intentions'}
      </button>
    </div>
  );
}
