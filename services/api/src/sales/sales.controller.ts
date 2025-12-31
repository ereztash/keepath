import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './dto';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get sales dashboard metrics' })
  async getDashboard(@Query('organizationId') organizationId: string = 'org_default') {
    return this.salesService.getDashboard(organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  async getSales(@Query('organizationId') organizationId: string = 'org_default') {
    return this.salesService.getAllSales(organizationId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get sales leaderboard' })
  async getLeaderboard(@Query('organizationId') organizationId: string = 'org_default') {
    return this.salesService.getLeaderboard(organizationId);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get sales analytics' })
  async getAnalytics(@Query('organizationId') organizationId: string = 'org_default') {
    return this.salesService.getAnalytics(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  async getSale(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.salesService.getSale(id, organizationId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new sale' })
  async createSale(
    @Body() createSaleDto: CreateSaleDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.salesService.createSale(organizationId, createSaleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sale' })
  async updateSale(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.salesService.updateSale(id, organizationId, updateSaleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sale' })
  async deleteSale(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string = 'org_default'
  ) {
    return this.salesService.deleteSale(id, organizationId);
  }
}
