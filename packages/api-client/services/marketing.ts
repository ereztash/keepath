import { apiClient } from '../client';
import type { MarketingChannel } from '@keepath/types';

export interface MarketingDashboard {
  totalLeads: number;
  totalSpend: number;
  avgCPL: number;
  bestChannel: string;
  channels: number;
}

export interface CreateChannelData {
  source: string;
  funnelStage: 'AWARENESS' | 'CONSIDERATION' | 'CONVERSION' | 'RETENTION';
  visitors: number;
  leads: number;
  monthlySpend: number;
  status?: 'ACTIVE' | 'PAUSED' | 'TESTING';
}

export const marketingService = {
  getDashboard: (organizationId?: string) =>
    apiClient.get<MarketingDashboard>(
      `/marketing/dashboard${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getChannels: (organizationId?: string) =>
    apiClient.get<MarketingChannel[]>(
      `/marketing/channels${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getChannel: (id: string, organizationId?: string) =>
    apiClient.get<MarketingChannel>(
      `/marketing/channels/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  createChannel: (data: CreateChannelData, organizationId?: string) =>
    apiClient.post<MarketingChannel>(
      `/marketing/channels${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  updateChannel: (id: string, data: Partial<CreateChannelData>, organizationId?: string) =>
    apiClient.put<MarketingChannel>(
      `/marketing/channels/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  deleteChannel: (id: string, organizationId?: string) =>
    apiClient.delete<void>(
      `/marketing/channels/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getAnalytics: (organizationId?: string, period?: string) =>
    apiClient.get<any>(
      `/marketing/analytics${organizationId || period ? '?' : ''}${organizationId ? `organizationId=${organizationId}` : ''}${period ? `&period=${period}` : ''}`
    ),
};
