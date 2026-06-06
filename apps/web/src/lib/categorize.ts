import { anthropic, CLAUDE_MODEL } from './anthropic';
import { prisma } from '@keepath/database';

interface CategoryResult {
  valueId: string;
  confidence: number;
  reasoning: string;
}

/**
 * Use Claude to categorize a single calendar event against the user's values.
 * Returns the most likely value match with confidence and short reasoning.
 */
export async function categorizeEvent(
  event: { title: string; description?: string | null; location?: string | null },
  values: { id: string; name: string; description?: string | null }[]
): Promise<CategoryResult | null> {
  if (values.length === 0) return null;

  const valuesList = values
    .map((v) => `- ID:${v.id} | ${v.name}${v.description ? ` — ${v.description}` : ''}`)
    .join('\n');

  const eventDescription = [
    `Title: ${event.title}`,
    event.description && `Description: ${event.description}`,
    event.location && `Location: ${event.location}`,
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `You are categorizing a calendar event against a user's life values.

User's values:
${valuesList}

Calendar event:
${eventDescription}

Pick the SINGLE most likely value this event serves. Respond ONLY with JSON in this exact format:
{"valueId": "<id from list above>", "confidence": <0.0-1.0>, "reasoning": "<one short sentence>"}

If no value clearly matches, pick the closest one with low confidence (under 0.4).`;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const parsed = JSON.parse(match[0]) as CategoryResult;
    if (!values.find((v) => v.id === parsed.valueId)) return null;
    return parsed;
  } catch (err) {
    console.error('Categorization failed:', err);
    return null;
  }
}

/**
 * Categorize all uncategorized events for a user in the given window.
 */
export async function categorizeUserEvents(userId: string, weekStart: Date, weekEnd: Date) {
  const [values, events] = await Promise.all([
    prisma.value.findMany({ where: { userId, isActive: true } }),
    prisma.calendarEvent.findMany({
      where: {
        userId,
        startTime: { gte: weekStart, lte: weekEnd },
        categorizations: { none: {} },
      },
    }),
  ]);

  if (values.length === 0 || events.length === 0) {
    return { categorized: 0, total: events.length };
  }

  let count = 0;
  // Sequential to avoid rate limits on demo
  for (const event of events) {
    const result = await categorizeEvent(event, values);
    if (!result) continue;

    await prisma.eventCategorization.create({
      data: {
        eventId: event.id,
        valueId: result.valueId,
        confidence: result.confidence,
        reasoning: result.reasoning,
        isManual: false,
      },
    });
    count++;
  }

  return { categorized: count, total: events.length };
}
