import { financeService } from './services/finance';
import { marketingService } from './services/marketing';
import { salesService } from './services/sales';
import { missionsService } from './services/missions';

export interface DashboardAggregation {
  finance: {
    revenue: number;
    profit: number;
    expenses: number;
    burnRate: number;
    runway: number;
  };
  marketing: {
    totalLeads: number;
    totalSpend: number;
    avgCPL: number;
    bestChannel: string;
  };
  sales: {
    totalSales: number;
    avgDealSize: number;
    winRate: number;
    topSeller: string;
  };
  missions: {
    totalMissions: number;
    totalXP: number;
    completionRate: number;
  };
}

export class AggregationService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getDashboardData(organizationId?: string): Promise<DashboardAggregation> {
    const cacheKey = `dashboard:${organizationId || 'default'}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Fetch all data in parallel
    const [finance, marketing, sales, missions] = await Promise.all([
      financeService.getDashboard(organizationId),
      marketingService.getDashboard(organizationId),
      salesService.getDashboard(organizationId),
      missionsService.getStats(organizationId),
    ]);

    const data: DashboardAggregation = {
      finance: {
        revenue: finance.revenue,
        profit: finance.profit,
        expenses: finance.expenses,
        burnRate: finance.burnRate,
        runway: finance.runway,
      },
      marketing: {
        totalLeads: marketing.totalLeads,
        totalSpend: marketing.totalSpend,
        avgCPL: marketing.avgCPL,
        bestChannel: marketing.bestChannel,
      },
      sales: {
        totalSales: sales.totalSales,
        avgDealSize: sales.avgDealSize,
        winRate: sales.winRate,
        topSeller: sales.topSeller,
      },
      missions: {
        totalMissions: missions.totalMissions,
        totalXP: missions.totalXP,
        completionRate: missions.completionRate,
      },
    };

    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export const aggregationService = new AggregationService();
