import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MarketingService } from './marketing.service';
import { CreateChannelDto, UpdateChannelDto } from './dto';

@ApiTags('marketing')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get marketing dashboard metrics' })
  async getDashboard(@Query('organizationId') organizationId: string = 'org_default') {
    return this.marketingService.getDashboard(organizationId);
  }

  @Get('channels')
  @ApiOperation({ summary: 'Get all marketing channels' })
  async getChannels(@Query('organizationId') organizationId: string = 'org_default') {
    return this.marketingService.getAllChannels(organizationId);
  }

  @Get('channels/:id')
  @ApiOperation({ summary: 'Get channel by ID' })
  async getChannel(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.marketingService.getChannel(id, organizationId);
  }

  @Post('channels')
  @ApiOperation({ summary: 'Create new marketing channel' })
  async createChannel(
    @Body() createChannelDto: CreateChannelDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.marketingService.createChannel(organizationId, createChannelDto);
  }

  @Put('channels/:id')
  @ApiOperation({ summary: 'Update marketing channel' })
  async updateChannel(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.marketingService.updateChannel(id, organizationId, updateChannelDto);
  }

  @Delete('channels/:id')
  @ApiOperation({ summary: 'Delete marketing channel' })
  async deleteChannel(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.marketingService.deleteChannel(id, organizationId);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get marketing analytics' })
  async getAnalytics(
    @Query('organizationId') organizationId: string = 'org_default',
    @Query('period') period: string = '30d'
  ) {
    return this.marketingService.getAnalytics(organizationId, period);
  }
}
