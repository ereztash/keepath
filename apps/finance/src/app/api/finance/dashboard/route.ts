import { NextResponse } from 'next/server';
import { prisma } from '@keepath/database';

export async function GET(request: Request) {
  try {
    // For now, using a hardcoded organization ID
    // In production, this would come from the authenticated session
    const organizationId = 'org_default';

    // Calculate revenue from sales
    const sales = await prisma.sale.findMany({
      where: {
        organizationId,
        status: 'CLOSED',
      },
      include: {
        offer: true,
      },
    });

    const revenue = sales.reduce((sum, sale) => sum + sale.amount, 0);

    // Calculate profit from sales
    const profit = sales.reduce((sum, sale) => sum + sale.offer.profitPerSale, 0);

    // Calculate expenses (team costs + marketing spend)
    const teamMembers = await prisma.teamMember.findMany({
      where: { organizationId },
    });

    const marketingChannels = await prisma.marketingChannel.findMany({
      where: { organizationId },
    });

    const teamCosts = teamMembers.reduce((sum, member) => sum + member.monthlyCost, 0);
    const marketingSpend = marketingChannels.reduce((sum, channel) => sum + channel.monthlySpend, 0);
    const expenses = teamCosts + marketingSpend;

    // Calculate burn rate and runway
    const burnRate = expenses - profit;
    const runway = burnRate > 0 ? Math.floor(profit / burnRate) : 999;

    return NextResponse.json({
      revenue,
      profit,
      expenses,
      burnRate,
      runway,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
