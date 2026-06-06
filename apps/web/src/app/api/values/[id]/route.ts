import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  description: z.string().optional().nullable(),
  color: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.value.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const value = await prisma.value.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(value);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const existing = await prisma.value.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.value.update({
    where: { id: params.id },
    data: { isActive: false },
  });
  return NextResponse.json({ ok: true });
}
