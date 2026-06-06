import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { weekStart } from '@/lib/dates';
import { z } from 'zod';

const upsertSchema = z.object({
  weekStart: z.string().optional(),
  mood: z.number().int().min(1).max(10),
  wins: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  learnings: z.array(z.string()).default([]),
  reflection: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const weekParam = url.searchParams.get('week');
  const week = weekStart(weekParam ? new Date(weekParam) : new Date());

  const checkIn = await prisma.weeklyCheckIn.findUnique({
    where: { userId_weekStart: { userId: session.user.id, weekStart: week } },
  });
  return NextResponse.json(checkIn);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const week = weekStart(parsed.data.weekStart ? new Date(parsed.data.weekStart) : new Date());

  const checkIn = await prisma.weeklyCheckIn.upsert({
    where: { userId_weekStart: { userId: session.user.id, weekStart: week } },
    create: {
      userId: session.user.id,
      weekStart: week,
      mood: parsed.data.mood,
      wins: parsed.data.wins,
      blockers: parsed.data.blockers,
      learnings: parsed.data.learnings,
      reflection: parsed.data.reflection,
    },
    update: {
      mood: parsed.data.mood,
      wins: parsed.data.wins,
      blockers: parsed.data.blockers,
      learnings: parsed.data.learnings,
      reflection: parsed.data.reflection,
    },
  });
  return NextResponse.json(checkIn);
}
