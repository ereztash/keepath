import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { weekEnd, weekStart } from '@/lib/dates';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const weekParam = url.searchParams.get('week');
  const week = weekParam ? new Date(weekParam) : new Date();
  const start = weekStart(week);
  const end = weekEnd(week);

  const events = await prisma.calendarEvent.findMany({
    where: { userId: session.user.id, startTime: { gte: start, lte: end } },
    include: { categorizations: { include: { value: true } } },
    orderBy: { startTime: 'asc' },
  });
  return NextResponse.json(events);
}
