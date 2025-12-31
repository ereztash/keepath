import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { FinanceModule } from './finance/finance.module';
import { MarketingModule } from './marketing/marketing.module';
import { SalesModule } from './sales/sales.module';
import { MissionsModule } from './missions/missions.module';
import { TeamModule } from './team/team.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    FinanceModule,
    MarketingModule,
    SalesModule,
    MissionsModule,
    TeamModule,
  ],
})
export class AppModule {}
