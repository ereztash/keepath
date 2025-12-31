import { apiClient } from '../client';
import type { Sale } from '@keepath/types';

export interface SalesDashboard {
  totalSales: number;
  avgDealSize: number;
  winRate: number;
  topSeller: string;
  salesCount: number;
}

export interface CreateSaleData {
  clientName: string;
  offerId: string;
  amount: number;
  soldById: string;
  date?: string;
  status?: 'PENDING' | 'CLOSED' | 'LOST';
}

export const salesService = {
  getDashboard: (organizationId?: string) =>
    apiClient.get<SalesDashboard>(
      `/sales/dashboard${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getSales: (organizationId?: string) =>
    apiClient.get<Sale[]>(
      `/sales${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getSale: (id: string, organizationId?: string) =>
    apiClient.get<Sale>(
      `/sales/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  createSale: (data: CreateSaleData, organizationId?: string) =>
    apiClient.post<Sale>(
      `/sales${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  updateSale: (id: string, data: Partial<CreateSaleData>, organizationId?: string) =>
    apiClient.put<Sale>(
      `/sales/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  deleteSale: (id: string, organizationId?: string) =>
    apiClient.delete<void>(
      `/sales/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getLeaderboard: (organizationId?: string) =>
    apiClient.get<any>(
      `/sales/leaderboard${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getAnalytics: (organizationId?: string) =>
    apiClient.get<any>(
      `/sales/analytics${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),
};
