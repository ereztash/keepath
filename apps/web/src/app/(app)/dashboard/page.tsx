'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlignmentRing } from '@/components/alignment-ring';
import { RefreshCw, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Breakdown {
  valueId: string;
  valueName: string;
  valueColor: string;
  targetHours: number;
  actualHours: number;
  score: number;
}

interface Alignment {
  weekStart: string;
  overallScore: number;
  totalTargetHours: number;
  totalActualHours: number;
  breakdown: Breakdown[];
}

export default function DashboardPage() {
  const qc = useQueryClient();

  const { data: alignment, isLoading } = useQuery<Alignment>({
    queryKey: ['alignment'],
    queryFn: () => fetch('/api/alignment').then((r) => r.json()),
  });

  const sync = useMutation({
    mutationFn: async () => {
      const r = await fetch('/api/calendar/sync', { method: 'POST' });
      if (!r.ok) throw new Error((await r.json()).error || 'Sync failed');
      return r.json();
    },
    onSuccess: (data) => {
      toast.success(`Synced ${data.count} events`);
      qc.invalidateQueries({ queryKey: ['alignment'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const categorize = useMutation({
    mutationFn: async () => {
      const r = await fetch('/api/calendar/categorize', { method: 'POST' });
      return r.json();
    },
    onSuccess: (data) => {
      toast.success(`AI categorized ${data.categorized} events`);
      qc.invalidateQueries({ queryKey: ['alignment'] });
    },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">This week</h1>
          <p className="text-slate-500 text-sm">
            How your calendar matches what you said matters.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => sync.mutate()}
            disabled={sync.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
            Sync calendar
          </button>
          <button
            onClick={() => categorize.mutate()}
            disabled={categorize.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${categorize.isPending ? 'animate-pulse' : ''}`} />
            AI categorize
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">Loading…</div>
      ) : !alignment || alignment.breakdown.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col items-center justify-center">
              <AlignmentRing score={alignment.overallScore} />
              <p className="text-sm text-slate-500 mt-4 text-center">
                Across {alignment.breakdown.length} values you set this week
              </p>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Time spent</h2>
              <div className="grid grid-cols-2 gap-6">
                <Metric
                  label="Planned this week"
                  value={`${alignment.totalTargetHours}h`}
                  sub="across your values"
                />
                <Metric
                  label="Actually spent"
                  value={`${alignment.totalActualHours}h`}
                  sub="from your calendar"
                />
              </div>
              <p className="mt-6 text-sm text-slate-600 leading-relaxed">
                {storyLine(alignment)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">By value</h2>
              <Link
                href="/intentions"
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Edit intentions <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {alignment.breakdown.map((b) => (
                <ValueRow key={b.valueId} b={b} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function ValueRow({ b }: { b: Breakdown }) {
  const pct = Math.min(100, b.score);
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: b.valueColor }}
          />
          <span className="font-medium text-slate-900">{b.valueName}</span>
        </div>
        <div className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{b.actualHours}h</span>
          <span className="text-slate-400"> / {b.targetHours}h</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: b.valueColor }}
        />
      </div>
    </div>
  );
}

function storyLine(a: Alignment): string {
  const gap = a.totalTargetHours - a.totalActualHours;
  const worst = [...a.breakdown].sort((x, y) => x.score - y.score)[0];
  if (a.overallScore >= 80) return `Strong week — you showed up for what matters.`;
  if (worst && worst.score < 40) {
    return `${worst.valueName} got ${worst.actualHours}h out of ${worst.targetHours}h. Want to talk it through with Jules?`;
  }
  if (gap > 0) return `You planned ${a.totalTargetHours}h, spent ${a.totalActualHours}h. Where did the rest go?`;
  return `You hit most of your intentions. The gaps are normal — notice them, don't punish.`;
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-slate-900 mb-1">No data for this week yet</h3>
      <p className="text-sm text-slate-500 mb-6">
        Set your intentions, sync your calendar, and let AI categorize what you did.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/intentions"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          Set intentions
        </Link>
      </div>
    </div>
  );
}
