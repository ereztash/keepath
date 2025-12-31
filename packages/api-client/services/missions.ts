import { apiClient } from '../client';
import type { Mission } from '@keepath/types';

export interface MissionStats {
  totalMissions: number;
  totalXP: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  completionRate: number;
}

export interface CreateMissionData {
  title: string;
  description: string;
  type: 'QUICK_WIN' | 'WEEKLY_CHALLENGE' | 'MILESTONE' | 'NINETY_DAY_GOAL';
  department: 'FINANCE' | 'MARKETING' | 'SALES' | 'PRODUCT' | 'OPERATIONS';
  duration: number;
  xpReward: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedToId?: string;
  subtasks?: any[];
}

export const missionsService = {
  getMissions: (organizationId?: string, filters?: { status?: string; department?: string }) => {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.department) params.append('department', filters.department);

    return apiClient.get<Mission[]>(`/missions?${params.toString()}`);
  },

  getMission: (id: string, organizationId?: string) =>
    apiClient.get<Mission>(
      `/missions/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  createMission: (data: CreateMissionData, organizationId?: string) =>
    apiClient.post<Mission>(
      `/missions${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  updateMission: (id: string, data: Partial<CreateMissionData>, organizationId?: string) =>
    apiClient.put<Mission>(
      `/missions/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`,
      data
    ),

  completeMission: (id: string, organizationId?: string) =>
    apiClient.patch<Mission>(
      `/missions/${id}/complete${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  deleteMission: (id: string, organizationId?: string) =>
    apiClient.delete<void>(
      `/missions/${id}${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),

  getStats: (organizationId?: string) =>
    apiClient.get<MissionStats>(
      `/missions/stats${organizationId ? `?organizationId=${organizationId}` : ''}`
    ),
};
