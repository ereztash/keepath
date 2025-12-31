import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto, UpdateMissionDto } from './dto';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async getAllMissions(organizationId: string, filters?: { status?: string; department?: string }) {
    return this.prisma.mission.findMany({
      where: {
        organizationId,
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.department && { department: filters.department as any }),
      },
      include: {
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMission(id: string, organizationId: string) {
    return this.prisma.mission.findFirst({
      where: { id, organizationId },
      include: {
        assignedTo: true,
      },
    });
  }

  async createMission(organizationId: string, data: CreateMissionDto) {
    return this.prisma.mission.create({
      data: {
        ...data,
        organizationId,
        subtasks: data.subtasks || [],
      },
      include: {
        assignedTo: true,
      },
    });
  }

  async updateMission(id: string, organizationId: string, data: UpdateMissionDto) {
    return this.prisma.mission.update({
      where: { id },
      data,
      include: {
        assignedTo: true,
      },
    });
  }

  async completeMission(id: string, organizationId: string) {
    return this.prisma.mission.update({
      where: { id },
      data: {
        status: 'COMPLETED',
      },
      include: {
        assignedTo: true,
      },
    });
  }

  async deleteMission(id: string, organizationId: string) {
    return this.prisma.mission.delete({
      where: { id },
    });
  }

  async getStats(organizationId: string) {
    const missions = await this.prisma.mission.findMany({
      where: { organizationId },
    });

    const totalXP = missions
      .filter((m) => m.status === 'COMPLETED')
      .reduce((sum, m) => sum + m.xpReward, 0);

    const byStatus = missions.reduce(
      (acc, m) => {
        acc[m.status] = (acc[m.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byType = missions.reduce(
      (acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalMissions: missions.length,
      totalXP,
      byStatus,
      byType,
      completionRate:
        missions.length > 0
          ? ((byStatus.COMPLETED || 0) / missions.length) * 100
          : 0,
    };
  }
}
