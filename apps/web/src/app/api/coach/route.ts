import { auth } from '@/lib/auth';
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic';
import { computeAlignment } from '@/lib/alignment';
import { weekStart } from '@/lib/dates';
import { prisma } from '@keepath/database';

export const runtime = 'nodejs';
export const maxDuration = 60;

function systemPrompt(context: string): string {
  return `You are Jules, a calm and honest personal time alignment coach.

You help the user notice the gap between what they SAY matters to them and how they actually spend their time.

You are NOT a productivity hype coach. You are direct, warm, and concrete. You ask one good question at a time. You don't shower praise. You don't lecture. You reflect back what you see and let the user choose what to do.

Respond in the same language the user writes in (Hebrew or English).

USER'S CURRENT WEEK CONTEXT:
${context}`;
}

async function buildContext(userId: string): Promise<string> {
  const alignment = await computeAlignment(userId, new Date());
  const week = weekStart();
  const checkIn = await prisma.weeklyCheckIn.findUnique({
    where: { userId_weekStart: { userId, weekStart: week } },
  });

  const lines = [
    `Week: ${alignment.weekStart.toDateString()}`,
    `Overall alignment score: ${alignment.overallScore}/100`,
    `Total target hours: ${alignment.totalTargetHours}`,
    `Total actual hours: ${alignment.totalActualHours}`,
    '',
    'Per-value breakdown:',
    ...alignment.breakdown.map(
      (b) => `- ${b.valueName}: ${b.actualHours}h / ${b.targetHours}h target (${b.score}%)`
    ),
  ];

  if (checkIn) {
    lines.push('', `Current mood: ${checkIn.mood}/10`);
  }

  return lines.join('\n');
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { messages, conversationId } = await req.json();
  const context = await buildContext(session.user.id);

  let convId = conversationId;
  if (!convId) {
    const conv = await prisma.conversation.create({
      data: { userId: session.user.id, title: messages[0]?.content?.slice(0, 60) || 'Chat' },
    });
    convId = conv.id;
  }

  const userMessage = messages[messages.length - 1];
  if (userMessage?.role === 'user') {
    await prisma.message.create({
      data: { conversationId: convId, role: 'user', content: userMessage.content },
    });
  }

  const stream = await anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: systemPrompt(context),
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  let fullText = '';

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullText += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        await prisma.message.create({
          data: { conversationId: convId, role: 'assistant', content: fullText },
        });
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Conversation-Id': convId,
    },
  });
}
