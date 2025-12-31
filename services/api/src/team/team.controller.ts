import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all team members' })
  async getMembers(@Query('organizationId') organizationId: string = 'org_default') {
    return this.teamService.getAllMembers(organizationId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get team statistics' })
  async getStats(@Query('organizationId') organizationId: string = 'org_default') {
    return this.teamService.getStats(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team member by ID' })
  async getMember(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.teamService.getMember(id, organizationId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new team member' })
  async createMember(
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.teamService.createMember(organizationId, createTeamMemberDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update team member' })
  async updateMember(
    @Param('id') id: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.teamService.updateMember(id, organizationId, updateTeamMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete team member' })
  async deleteMember(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.teamService.deleteMember(id, organizationId);
  }
}
