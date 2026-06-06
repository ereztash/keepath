import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';
import { z } from 'zod';

const reassignSchema = z.object({
  valueId: z.string(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = reassignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const event = await prisma.calendarEvent.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.eventCategorization.deleteMany({ where: { eventId: event.id } });
  await prisma.eventCategorization.create({
    data: {
      eventId: event.id,
      valueId: parsed.data.valueId,
      confidence: 1.0,
      isManual: true,
    },
  });
  return NextResponse.json({ ok: true });
}
