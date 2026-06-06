'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Sparkles, Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Value {
  id: string;
  name: string;
  color: string;
}

interface Cat {
  id: string;
  valueId: string;
  confidence: number;
  reasoning: string | null;
  value: Value;
}

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isAllDay: boolean;
  categorizations: Cat[];
}

export default function CalendarPage() {
  const qc = useQueryClient();
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => fetch('/api/calendar/events').then((r) => r.json()),
  });

  const { data: values } = useQuery<Value[]>({
    queryKey: ['values'],
    queryFn: () => fetch('/api/values').then((r) => r.json()),
  });

  const categorize = useMutation({
    mutationFn: () => fetch('/api/calendar/categorize', { method: 'POST' }).then((r) => r.json()),
    onSuccess: (data) => {
      toast.success(`Categorized ${data.categorized}/${data.total} events`);
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['alignment'] });
    },
  });

  const reassign = useMutation({
    mutationFn: ({ eventId, valueId }: { eventId: string; valueId: string }) =>
      fetch(`/api/calendar/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valueId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['alignment'] });
      toast.success('Updated');
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your week</h1>
          <p className="text-slate-500 text-sm">
            Synced events from Google Calendar with AI categorization
          </p>
        </div>
        <button
          onClick={() => categorize.mutate()}
          disabled={categorize.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          <Sparkles className={`h-4 w-4 ${categorize.isPending ? 'animate-pulse' : ''}`} />
          AI categorize new
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-slate-400 py-12">Loading…</p>
      ) : !events?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CalendarIcon className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">No events yet. Sync your calendar from the dashboard.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {events.map((e) => {
              const cat = e.categorizations[0];
              const hours = e.durationMinutes / 60;
              return (
                <div key={e.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="text-xs text-slate-500 w-24 shrink-0">
                    <div className="font-medium text-slate-700">
                      {format(new Date(e.startTime), 'EEE')}
                    </div>
                    <div>{format(new Date(e.startTime), 'MMM d, HH:mm')}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{e.title}</p>
                    {cat?.reasoning && (
                      <p className="text-xs text-slate-500 truncate">{cat.reasoning}</p>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 w-12 text-right">
                    {hours.toFixed(1)}h
                  </div>
                  <div className="w-40 shrink-0">
                    {editingId === e.id ? (
                      <select
                        autoFocus
                        onBlur={() => setEditingId(null)}
                        onChange={(ev) => {
                          reassign.mutate({ eventId: e.id, valueId: ev.target.value });
                          setEditingId(null);
                        }}
                        defaultValue={cat?.valueId || ''}
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1"
                      >
                        <option value="" disabled>
                          Pick value
                        </option>
                        {values?.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingId(e.id)}
                        className="group flex items-center gap-2 w-full"
                      >
                        {cat ? (
                          <span
                            className="text-xs px-2 py-1 rounded-md font-medium truncate flex-1 text-left"
                            style={{
                              backgroundColor: `${cat.value.color}15`,
                              color: cat.value.color,
                            }}
                          >
                            {cat.value.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 px-2 py-1 italic flex-1 text-left">
                            Uncategorized
                          </span>
                        )}
                        <Edit className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
