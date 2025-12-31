import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { CreateMissionDto, UpdateMissionDto } from './dto';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all missions' })
  async getMissions(
    @Query('organizationId') organizationId: string = 'org_default',
    @Query('status') status?: string,
    @Query('department') department?: string
  ) {
    return this.missionsService.getAllMissions(organizationId, { status, department });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get missions statistics' })
  async getStats(@Query('organizationId') organizationId: string = 'org_default') {
    return this.missionsService.getStats(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mission by ID' })
  async getMission(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.missionsService.getMission(id, organizationId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new mission' })
  async createMission(
    @Body() createMissionDto: CreateMissionDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.missionsService.createMission(organizationId, createMissionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update mission' })
  async updateMission(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.missionsService.updateMission(id, organizationId, updateMissionDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark mission as completed' })
  async completeMission(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.missionsService.completeMission(id, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mission' })
  async deleteMission(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.missionsService.deleteMission(id, organizationId);
  }
}
