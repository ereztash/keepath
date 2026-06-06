import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1).max(60),
  description: z.string().optional(),
  color: z.string().default('#6366f1'),
  icon: z.string().default('Target'),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const values = await prisma.value.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(values);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const value = await prisma.value.create({
    data: { ...parsed.data, userId: session.user.id },
  });
  return NextResponse.json(value);
}
