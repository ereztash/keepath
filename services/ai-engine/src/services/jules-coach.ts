import { aiClient } from './ai-client';
import { prisma } from '@keepath/database';

const JULES_SYSTEM_PROMPT = `You are Jules, a no-BS business coach for Keepath users.

Your personality:
- Direct and honest, but caring
- Focus on actionable advice, not theory
- Challenge users when they need it
- Celebrate wins
- Ask tough questions

You have access to the user's business data:
- Finance: revenue, profit, expenses, offers
- Marketing: channels, leads, CPL, conversion rates
- Sales: pipeline, win rate, team performance
- Missions: goals, XP, completion rate

Your role:
1. Help users set better goals
2. Identify bottlenecks and opportunities
3. Create missions based on business needs
4. Provide insights from their data
5. Keep them accountable

Communication style:
- Short, punchy sentences
- Use real numbers from their data
- Ask one question at a time
- Give specific next steps
- No fluff or corporate speak`;

export class JulesCoach {
  async chat(
    userId: string,
    organizationId: string,
    message: string,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<string> {
    // Get business context
    const context = await this.getBusinessContext(organizationId);

    // Build messages with system prompt and context
    const messages = [
      {
        role: 'system',
        content: JULES_SYSTEM_PROMPT + '\n\nCurrent business data:\n' + context,
      },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    return aiClient.chat(messages, 'anthropic');
  }

  async chatStream(
    userId: string,
    organizationId: string,
    message: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const context = await this.getBusinessContext(organizationId);

    const messages = [
      {
        role: 'system',
        content: JULES_SYSTEM_PROMPT + '\n\nCurrent business data:\n' + context,
      },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    await aiClient.chatStream(messages, onChunk, 'anthropic');
  }

  private async getBusinessContext(organizationId: string): Promise<string> {
    // Finance data
    const sales = await prisma.sale.findMany({
      where: { organizationId, status: 'CLOSED' },
      take: 10,
      orderBy: { date: 'desc' },
    });

    const offers = await prisma.offer.findMany({
      where: { organizationId, status: 'ACTIVE' },
    });

    // Marketing data
    const channels = await prisma.marketingChannel.findMany({
      where: { organizationId, status: 'ACTIVE' },
    });

    // Missions data
    const missions = await prisma.mission.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Team data
    const team = await prisma.teamMember.findMany({
      where: { organizationId },
    });

    // Build context string
    const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalLeads = channels.reduce((sum, c) => sum + c.leads, 0);
    const completedMissions = missions.filter((m) => m.status === 'COMPLETED').length;
    const totalXP = missions
      .filter((m) => m.status === 'COMPLETED')
      .reduce((sum, m) => sum + m.xpReward, 0);

    return `
Finance:
- Recent revenue: $${totalRevenue.toFixed(2)}
- Active offers: ${offers.length}
- Avg offer price: $${offers.length > 0 ? (offers.reduce((sum, o) => sum + o.price, 0) / offers.length).toFixed(2) : 0}

Marketing:
- Total leads (all channels): ${totalLeads}
- Active channels: ${channels.length}
- Best channel: ${channels.length > 0 ? channels.reduce((best, c) => (c.costPerLead < best.costPerLead ? c : best)).source : 'N/A'}

Team:
- Team size: ${team.length}
- Monthly team cost: $${team.reduce((sum, t) => sum + t.monthlyCost, 0).toFixed(2)}

Missions/Goals:
- Completed missions: ${completedMissions}/${missions.length}
- Total XP earned: ${totalXP}
- Recent mission: ${missions[0]?.title || 'None'}
`;
  }

  async generateMissionSuggestions(
    organizationId: string
  ): Promise<Array<{ title: string; description: string; type: string; xp: number }>> {
    const context = await this.getBusinessContext(organizationId);

    const prompt = `Based on this business data, suggest 3 high-impact missions the user should complete this week.

${context}

For each mission, provide:
1. Title (short, actionable)
2. Description (1-2 sentences)
3. Type (QUICK_WIN, WEEKLY_CHALLENGE, MILESTONE, or NINETY_DAY_GOAL)
4. XP reward (10-500 based on impact)

Return as JSON array.`;

    const response = await aiClient.chat(
      [{ role: 'user', content: prompt }],
      'openai'
    );

    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  }

  async analyzeMetrics(
    organizationId: string,
    metric: string
  ): Promise<string> {
    const context = await this.getBusinessContext(organizationId);

    const prompt = `Analyze the ${metric} metric for this business and provide:
1. Current status
2. Key insights
3. Specific action to improve it

${context}

Be direct and actionable.`;

    return aiClient.chat([{ role: 'user', content: prompt }], 'anthropic');
  }
}

export const julesCoach = new JulesCoach();
