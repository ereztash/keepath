import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.mission.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data = { ...parsed.data } as Record<string, unknown>;
  if (parsed.data.status === 'COMPLETED' && !existing.completedAt) {
    data.completedAt = new Date();
  } else if (parsed.data.status && parsed.data.status !== 'COMPLETED') {
    data.completedAt = null;
  }

  const mission = await prisma.mission.update({ where: { id: params.id }, data });
  return NextResponse.json(mission);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const existing = await prisma.mission.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.mission.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
