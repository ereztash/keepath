import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { weekStart } from '@/lib/dates';
import { z } from 'zod';

const upsertSchema = z.object({
  valueId: z.string(),
  weekStart: z.string(), // ISO
  targetHours: z.number().min(0).max(168),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const weekParam = url.searchParams.get('week');
  const week = weekStart(weekParam ? new Date(weekParam) : new Date());

  const intentions = await prisma.weeklyIntention.findMany({
    where: { userId: session.user.id, weekStart: week },
    include: { value: true },
  });
  return NextResponse.json(intentions);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const owned = await prisma.value.findFirst({
    where: { id: parsed.data.valueId, userId: session.user.id },
    select: { id: true },
  });
  if (!owned) return NextResponse.json({ error: 'Value not found' }, { status: 404 });

  const week = weekStart(new Date(parsed.data.weekStart));

  const intention = await prisma.weeklyIntention.upsert({
    where: {
      userId_valueId_weekStart: {
        userId: session.user.id,
        valueId: parsed.data.valueId,
        weekStart: week,
      },
    },
    create: {
      userId: session.user.id,
      valueId: parsed.data.valueId,
      weekStart: week,
      targetHours: parsed.data.targetHours,
      notes: parsed.data.notes,
    },
    update: {
      targetHours: parsed.data.targetHours,
      notes: parsed.data.notes,
    },
    include: { value: true },
  });
  return NextResponse.json(intention);
}
