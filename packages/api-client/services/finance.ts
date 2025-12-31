import { apiClient } from '../client';
import type { Offer } from '@keepath/types';

export interface FinanceDashboard {
  revenue: number;
  profit: number;
  expenses: number;
  burnRate: number;
  runway: number;
}

export interface CreateOfferData {
  name: string;
  description: string;
  price: number;
  deliveryCost: number;
  isMain?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export const financeService = {
  getDashboard: (organizationId?: string) =>
    apiClient.get<FinanceDashboard>(
      `/finance/dashboard${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getOffers: (organizationId?: string) =>
    apiClient.get<Offer[]>(
      `/finance/offers${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getOffer: (id: string, organizationId?: string) =>
    apiClient.get<Offer>(
      `/finance/offers/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  createOffer: (data: CreateOfferData, organizationId?: string) =>
    apiClient.post<Offer>(
      `/finance/offers${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  updateOffer: (id: string, data: Partial<CreateOfferData>, organizationId?: string) =>
    apiClient.put<Offer>(
      `/finance/offers/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  deleteOffer: (id: string, organizationId?: string) =>
    apiClient.delete<void>(
      `/finance/offers/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getBudget: (organizationId?: string) =>
    apiClient.get<any>(
      `/finance/budget${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),
};
