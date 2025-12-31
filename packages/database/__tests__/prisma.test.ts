import { prisma } from '../index';

describe('Prisma Client', () => {
  it('should connect to database', async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it('should disconnect from database', async () => {
    await expect(prisma.$disconnect()).resolves.not.toThrow();
  });
});
