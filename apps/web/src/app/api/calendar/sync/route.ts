import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { syncEventsToDB } from '@/lib/google-calendar';
import { weekEnd, weekStart } from '@/lib/dates';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const week = body.week ? new Date(body.week) : new Date();
  const start = weekStart(week);
  const end = weekEnd(week);

  try {
    const events = await syncEventsToDB(session.user.id, start, end);
    return NextResponse.json({ ok: true, count: events.length });
  } catch (err) {
    console.error('Calendar sync error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    );
  }
}
