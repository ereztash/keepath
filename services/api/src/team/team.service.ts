import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async getAllMembers(organizationId: string) {
    return this.prisma.teamMember.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMember(id: string, organizationId: string) {
    return this.prisma.teamMember.findFirst({
      where: { id, organizationId },
    });
  }

  async createMember(organizationId: string, data: CreateTeamMemberDto) {
    return this.prisma.teamMember.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateMember(id: string, organizationId: string, data: UpdateTeamMemberDto) {
    return this.prisma.teamMember.update({
      where: { id },
      data,
    });
  }

  async deleteMember(id: string, organizationId: string) {
    return this.prisma.teamMember.delete({
      where: { id },
    });
  }

  async getStats(organizationId: string) {
    const members = await this.prisma.teamMember.findMany({
      where: { organizationId },
    });

    const totalCost = members.reduce((sum, m) => sum + m.monthlyCost, 0);
    const avgPerformance = members.length > 0
      ? members.reduce((sum, m) => sum + m.performance, 0) / members.length
      : 0;

    const byDepartment = members.reduce(
      (acc, m) => {
        if (!acc[m.department]) {
          acc[m.department] = { count: 0, cost: 0 };
        }
        acc[m.department].count++;
        acc[m.department].cost += m.monthlyCost;
        return acc;
      },
      {} as Record<string, { count: number; cost: number }>
    );

    return {
      totalMembers: members.length,
      totalCost,
      avgPerformance,
      byDepartment,
    };
  }
}
