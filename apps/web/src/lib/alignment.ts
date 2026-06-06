import { prisma } from '@keepath/database';
import { weekEnd, weekStart } from './dates';

export interface AlignmentBreakdownItem {
  valueId: string;
  valueName: string;
  valueColor: string;
  targetHours: number;
  actualHours: number;
  score: number;
}

export interface AlignmentResult {
  weekStart: Date;
  overallScore: number;
  totalTargetHours: number;
  totalActualHours: number;
  breakdown: AlignmentBreakdownItem[];
}

/**
 * Compute alignment between weekly intentions and actual time spent.
 * Score per value: min(actual/target, 1) * 100. Over-investment doesn't penalize.
 * Overall score: weighted average across values.
 */
export async function computeAlignment(userId: string, week: Date): Promise<AlignmentResult> {
  const start = weekStart(week);
  const end = weekEnd(week);

  const [intentions, events] = await Promise.all([
    prisma.weeklyIntention.findMany({
      where: { userId, weekStart: start },
      include: { value: true },
    }),
    prisma.calendarEvent.findMany({
      where: { userId, startTime: { gte: start, lte: end } },
      include: { categorizations: true },
    }),
  ]);

  // Sum actual hours per value
  const actualByValue = new Map<string, number>();
  for (const event of events) {
    if (event.isAllDay) continue;
    const cat = event.categorizations[0];
    if (!cat) continue;
    const hours = event.durationMinutes / 60;
    actualByValue.set(cat.valueId, (actualByValue.get(cat.valueId) ?? 0) + hours);
  }

  const breakdown: AlignmentBreakdownItem[] = intentions.map((intent) => {
    const actualHours = actualByValue.get(intent.valueId) ?? 0;
    const score =
      intent.targetHours > 0 ? Math.min(actualHours / intent.targetHours, 1) * 100 : 0;
    return {
      valueId: intent.valueId,
      valueName: intent.value.name,
      valueColor: intent.value.color,
      targetHours: intent.targetHours,
      actualHours: Math.round(actualHours * 10) / 10,
      score: Math.round(score),
    };
  });

  const totalTargetHours = breakdown.reduce((s, b) => s + b.targetHours, 0);
  const totalActualHours = breakdown.reduce((s, b) => s + b.actualHours, 0);
  const overallScore =
    breakdown.length > 0
      ? Math.round(breakdown.reduce((s, b) => s + b.score, 0) / breakdown.length)
      : 0;

  return {
    weekStart: start,
    overallScore,
    totalTargetHours,
    totalActualHours: Math.round(totalActualHours * 10) / 10,
    breakdown,
  };
}

export async function saveAlignmentScore(userId: string, result: AlignmentResult) {
  await prisma.alignmentScore.upsert({
    where: { userId_weekStart: { userId, weekStart: result.weekStart } },
    create: {
      userId,
      weekStart: result.weekStart,
      overallScore: result.overallScore,
      breakdown: result.breakdown as unknown as object,
      totalActualHours: result.totalActualHours,
      totalTargetHours: result.totalTargetHours,
    },
    update: {
      overallScore: result.overallScore,
      breakdown: result.breakdown as unknown as object,
      totalActualHours: result.totalActualHours,
      totalTargetHours: result.totalTargetHours,
      computedAt: new Date(),
    },
  });
}
