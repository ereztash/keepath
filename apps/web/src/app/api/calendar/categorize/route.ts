import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { categorizeUserEvents } from '@/lib/categorize';
import { weekEnd, weekStart } from '@/lib/dates';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const week = body.week ? new Date(body.week) : new Date();
  const start = weekStart(week);
  const end = weekEnd(week);

  const result = await categorizeUserEvents(session.user.id, start, end);
  return NextResponse.json(result);
}
