import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { z } from 'zod';

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['QUICK_WIN', 'WEEKLY_CHALLENGE', 'MILESTONE', 'NINETY_DAY_GOAL']).default('QUICK_WIN'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  xpReward: z.number().int().default(10),
  dueDate: z.string().optional(),
  valueId: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const missions = await prisma.mission.findMany({
    where: { userId: session.user.id },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(missions);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { dueDate, ...rest } = parsed.data;
  const mission = await prisma.mission.create({
    data: {
      ...rest,
      userId: session.user.id,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
  return NextResponse.json(mission);
}
