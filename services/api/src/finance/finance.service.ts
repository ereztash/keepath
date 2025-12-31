import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto } from './dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(organizationId: string) {
    // Get all closed sales
    const sales = await this.prisma.sale.findMany({
      where: {
        organizationId,
        status: 'CLOSED',
      },
      include: {
        offer: true,
      },
    });

    const revenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const profit = sales.reduce((sum, sale) => sum + sale.offer.profitPerSale, 0);

    // Calculate expenses
    const teamMembers = await this.prisma.teamMember.findMany({
      where: { organizationId },
    });

    const marketingChannels = await this.prisma.marketingChannel.findMany({
      where: { organizationId },
    });

    const teamCosts = teamMembers.reduce((sum, member) => sum + member.monthlyCost, 0);
    const marketingSpend = marketingChannels.reduce((sum, channel) => sum + channel.monthlySpend, 0);
    const expenses = teamCosts + marketingSpend;

    const burnRate = expenses - profit;
    const runway = burnRate > 0 ? Math.floor(profit / burnRate) : 999;

    return {
      revenue,
      profit,
      expenses,
      burnRate,
      runway,
    };
  }

  async getAllOffers(organizationId: string) {
    return this.prisma.offer.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOffer(id: string, organizationId: string) {
    return this.prisma.offer.findFirst({
      where: { id, organizationId },
    });
  }

  async createOffer(organizationId: string, data: CreateOfferDto) {
    const profitMargin = ((data.price - data.deliveryCost) / data.price) * 100;
    const profitPerSale = data.price - data.deliveryCost;

    return this.prisma.offer.create({
      data: {
        ...data,
        profitMargin,
        profitPerSale,
        organizationId,
      },
    });
  }

  async updateOffer(id: string, organizationId: string, data: UpdateOfferDto) {
    const profitMargin = data.price && data.deliveryCost
      ? ((data.price - data.deliveryCost) / data.price) * 100
      : undefined;
    const profitPerSale = data.price && data.deliveryCost
      ? data.price - data.deliveryCost
      : undefined;

    return this.prisma.offer.update({
      where: { id },
      data: {
        ...data,
        ...(profitMargin !== undefined && { profitMargin }),
        ...(profitPerSale !== undefined && { profitPerSale }),
      },
    });
  }

  async deleteOffer(id: string, organizationId: string) {
    return this.prisma.offer.delete({
      where: { id },
    });
  }

  async getBudget(organizationId: string) {
    const teamMembers = await this.prisma.teamMember.findMany({
      where: { organizationId },
    });

    const marketingChannels = await this.prisma.marketingChannel.findMany({
      where: { organizationId },
    });

    const teamCost = teamMembers.reduce((sum, member) => sum + member.monthlyCost, 0);
    const marketingCost = marketingChannels.reduce((sum, channel) => sum + channel.monthlySpend, 0);

    return {
      categories: [
        { name: 'Team', actual: teamCost, planned: teamCost * 1.1 },
        { name: 'Marketing', actual: marketingCost, planned: marketingCost * 1.05 },
        { name: 'Operations', actual: 0, planned: 15000 },
        { name: 'Other', actual: 0, planned: 10000 },
      ],
      total: {
        actual: teamCost + marketingCost,
        planned: teamCost * 1.1 + marketingCost * 1.05 + 25000,
      },
    };
  }
}
