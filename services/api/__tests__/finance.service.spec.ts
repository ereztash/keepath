import { Test, TestingModule } from '@nestjs/testing';
import { FinanceService } from '../src/finance/finance.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('FinanceService', () => {
  let service: FinanceService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        {
          provide: PrismaService,
          useValue: {
            sale: {
              findMany: jest.fn(),
            },
            teamMember: {
              findMany: jest.fn(),
            },
            marketingChannel: {
              findMany: jest.fn(),
            },
            offer: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should calculate dashboard metrics correctly', async () => {
      const mockSales = [
        { amount: 1000, offer: { profitPerSale: 800 } },
        { amount: 1500, offer: { profitPerSale: 1200 } },
      ];

      jest.spyOn(prisma.sale, 'findMany').mockResolvedValue(mockSales as any);
      jest.spyOn(prisma.teamMember, 'findMany').mockResolvedValue([
        { monthlyCost: 5000 },
        { monthlyCost: 4000 },
      ] as any);
      jest.spyOn(prisma.marketingChannel, 'findMany').mockResolvedValue([
        { monthlySpend: 2000 },
      ] as any);

      const result = await service.getDashboard('org_1');

      expect(result.revenue).toBe(2500);
      expect(result.profit).toBe(2000);
      expect(result.expenses).toBe(11000);
    });
  });

  describe('createOffer', () => {
    it('should calculate profit margin correctly', async () => {
      const offerData = {
        name: 'Test Offer',
        description: 'Test Description',
        price: 1000,
        deliveryCost: 200,
      };

      jest.spyOn(prisma.offer, 'create').mockResolvedValue({
        id: '1',
        ...offerData,
        profitMargin: 80,
        profitPerSale: 800,
        organizationId: 'org_1',
        isMain: false,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.createOffer('org_1', offerData);

      expect(result.profitMargin).toBe(80);
      expect(result.profitPerSale).toBe(800);
    });
  });
});
