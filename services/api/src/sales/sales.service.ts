import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto, UpdateSaleDto } from './dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(organizationId: string) {
    const sales = await this.prisma.sale.findMany({
      where: { organizationId, status: 'CLOSED' },
      include: { offer: true, soldBy: true },
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const avgDealSize = sales.length > 0 ? totalSales / sales.length : 0;

    // Calculate win rate (assuming we track all deals, not just closed)
    const allDeals = await this.prisma.sale.count({ where: { organizationId } });
    const closedDeals = sales.length;
    const winRate = allDeals > 0 ? (closedDeals / allDeals) * 100 : 0;

    // Find top seller
    const salesBySeller: Record<string, { count: number; total: number; name: string }> = {};
    sales.forEach((sale) => {
      if (!salesBySeller[sale.soldById]) {
        salesBySeller[sale.soldById] = { count: 0, total: 0, name: sale.soldBy.name };
      }
      salesBySeller[sale.soldById].count++;
      salesBySeller[sale.soldById].total += sale.amount;
    });

    const topSeller = Object.entries(salesBySeller).sort(
      ([, a], [, b]) => b.total - a.total
    )[0]?.[1]?.name || 'N/A';

    return {
      totalSales,
      avgDealSize,
      winRate,
      topSeller,
      salesCount: sales.length,
    };
  }

  async getAllSales(organizationId: string) {
    return this.prisma.sale.findMany({
      where: { organizationId },
      include: {
        offer: true,
        soldBy: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async getSale(id: string, organizationId: string) {
    return this.prisma.sale.findFirst({
      where: { id, organizationId },
      include: {
        offer: true,
        soldBy: true,
      },
    });
  }

  async createSale(organizationId: string, data: CreateSaleDto) {
    return this.prisma.sale.create({
      data: {
        ...data,
        organizationId,
      },
      include: {
        offer: true,
        soldBy: true,
      },
    });
  }

  async updateSale(id: string, organizationId: string, data: UpdateSaleDto) {
    return this.prisma.sale.update({
      where: { id },
      data,
      include: {
        offer: true,
        soldBy: true,
      },
    });
  }

  async deleteSale(id: string, organizationId: string) {
    return this.prisma.sale.delete({
      where: { id },
    });
  }

  async getLeaderboard(organizationId: string) {
    const sales = await this.prisma.sale.findMany({
      where: { organizationId, status: 'CLOSED' },
      include: { soldBy: true },
    });

    const salesBySeller: Record<
      string,
      { name: string; sales: number; revenue: number; deals: number }
    > = {};

    sales.forEach((sale) => {
      if (!salesBySeller[sale.soldById]) {
        salesBySeller[sale.soldById] = {
          name: sale.soldBy.name,
          sales: 0,
          revenue: 0,
          deals: 0,
        };
      }
      salesBySeller[sale.soldById].deals++;
      salesBySeller[sale.soldById].revenue += sale.amount;
    });

    const leaderboard = Object.entries(salesBySeller)
      .map(([id, data]) => ({
        id,
        ...data,
        avgDealSize: data.deals > 0 ? data.revenue / data.deals : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return leaderboard;
  }

  async getAnalytics(organizationId: string) {
    const sales = await this.prisma.sale.findMany({
      where: { organizationId },
      include: { offer: true, soldBy: true },
    });

    const byOffer: Record<string, { name: string; count: number; revenue: number }> = {};
    const byMonth: Record<string, { count: number; revenue: number }> = {};

    sales.forEach((sale) => {
      // By offer
      if (!byOffer[sale.offerId]) {
        byOffer[sale.offerId] = { name: sale.offer.name, count: 0, revenue: 0 };
      }
      byOffer[sale.offerId].count++;
      byOffer[sale.offerId].revenue += sale.amount;

      // By month
      const month = sale.date.toISOString().slice(0, 7);
      if (!byMonth[month]) {
        byMonth[month] = { count: 0, revenue: 0 };
      }
      byMonth[month].count++;
      byMonth[month].revenue += sale.amount;
    });

    return {
      byOffer: Object.entries(byOffer).map(([id, data]) => ({ offerId: id, ...data })),
      byMonth: Object.entries(byMonth)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month)),
    };
  }
}
