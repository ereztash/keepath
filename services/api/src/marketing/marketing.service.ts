import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto } from './dto';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(organizationId: string) {
    const channels = await this.prisma.marketingChannel.findMany({
      where: { organizationId },
    });

    const totalLeads = channels.reduce((sum, ch) => sum + ch.leads, 0);
    const totalSpend = channels.reduce((sum, ch) => sum + ch.monthlySpend, 0);
    const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;

    // Find best channel by CPL
    const bestChannel = channels.length > 0
      ? channels.reduce((best, ch) => (ch.costPerLead < best.costPerLead ? ch : best))
      : null;

    return {
      totalLeads,
      totalSpend,
      avgCPL,
      bestChannel: bestChannel?.source || 'N/A',
      channels: channels.length,
    };
  }

  async getAllChannels(organizationId: string) {
    return this.prisma.marketingChannel.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getChannel(id: string, organizationId: string) {
    return this.prisma.marketingChannel.findFirst({
      where: { id, organizationId },
    });
  }

  async createChannel(organizationId: string, data: CreateChannelDto) {
    const convRate = data.visitors > 0 ? (data.leads / data.visitors) * 100 : 0;
    const costPerLead = data.leads > 0 ? data.monthlySpend / data.leads : 0;

    return this.prisma.marketingChannel.create({
      data: {
        ...data,
        convRate,
        costPerLead,
        organizationId,
      },
    });
  }

  async updateChannel(id: string, organizationId: string, data: UpdateChannelDto) {
    const existing = await this.prisma.marketingChannel.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      throw new Error('Channel not found');
    }

    const visitors = data.visitors ?? existing.visitors;
    const leads = data.leads ?? existing.leads;
    const monthlySpend = data.monthlySpend ?? existing.monthlySpend;

    const convRate = visitors > 0 ? (leads / visitors) * 100 : 0;
    const costPerLead = leads > 0 ? monthlySpend / leads : 0;

    return this.prisma.marketingChannel.update({
      where: { id },
      data: {
        ...data,
        convRate,
        costPerLead,
      },
    });
  }

  async deleteChannel(id: string, organizationId: string) {
    return this.prisma.marketingChannel.delete({
      where: { id },
    });
  }

  async getAnalytics(organizationId: string, period: string = '30d') {
    const channels = await this.prisma.marketingChannel.findMany({
      where: { organizationId },
    });

    return {
      period,
      channelComparison: channels.map((ch) => ({
        name: ch.source,
        leads: ch.leads,
        spend: ch.monthlySpend,
        cpl: ch.costPerLead,
        convRate: ch.convRate,
      })),
      topPerformers: channels
        .sort((a, b) => a.costPerLead - b.costPerLead)
        .slice(0, 3)
        .map((ch) => ({
          name: ch.source,
          cpl: ch.costPerLead,
          convRate: ch.convRate,
        })),
    };
  }
}
