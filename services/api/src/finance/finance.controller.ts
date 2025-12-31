import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { CreateOfferDto, UpdateOfferDto } from './dto';

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get finance dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard data' })
  async getDashboard(@Query('organizationId') organizationId: string = 'org_default') {
    return this.financeService.getDashboard(organizationId);
  }

  @Get('offers')
  @ApiOperation({ summary: 'Get all offers' })
  async getOffers(@Query('organizationId') organizationId: string = 'org_default') {
    return this.financeService.getAllOffers(organizationId);
  }

  @Get('offers/:id')
  @ApiOperation({ summary: 'Get offer by ID' })
  async getOffer(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.financeService.getOffer(id, organizationId);
  }

  @Post('offers')
  @ApiOperation({ summary: 'Create new offer' })
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.financeService.createOffer(organizationId, createOfferDto);
  }

  @Put('offers/:id')
  @ApiOperation({ summary: 'Update offer' })
  async updateOffer(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.financeService.updateOffer(id, organizationId, updateOfferDto);
  }

  @Delete('offers/:id')
  @ApiOperation({ summary: 'Delete offer' })
  async deleteOffer(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.financeService.deleteOffer(id, organizationId);
  }

  @Get('budget')
  @ApiOperation({ summary: 'Get budget breakdown' })
  async getBudget(@Query('organizationId') organizationId: string = 'org_default') {
    return this.financeService.getBudget(organizationId);
  }
}
