import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { computeAlignment, saveAlignmentScore } from '@/lib/alignment';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const weekParam = url.searchParams.get('week');
  const week = weekParam ? new Date(weekParam) : new Date();

  const result = await computeAlignment(session.user.id, week);
  await saveAlignmentScore(session.user.id, result);
  return NextResponse.json(result);
}
