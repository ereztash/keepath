import { prisma } from './index';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create organization
  const org = await prisma.organization.upsert({
    where: { id: 'org_default' },
    update: {},
    create: {
      id: 'org_default',
      name: 'Demo Company',
      settings: {},
    },
  });

  console.log('✅ Created organization:', org.name);

  // Create users
  const user1 = await prisma.user.upsert({
    where: { id: 'user_1' },
    update: {},
    create: {
      id: 'user_1',
      email: 'admin@keepath.com',
      name: 'Admin User',
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 'user_2' },
    update: {},
    create: {
      id: 'user_2',
      email: 'demo@keepath.com',
      name: 'Demo User',
      role: 'USER',
      organizationId: org.id,
    },
  });

  console.log('✅ Created users:', user1.email, user2.email);

  // Create team members
  const teamMembers = [
    {
      id: 'team_1',
      name: 'Sarah Johnson',
      role: 'Sales Manager',
      department: 'SALES',
      monthlyCost: 6000,
      kpiMetric: 'Monthly Sales',
      kpiTarget: 50000,
      currentKpi: 55000,
      performance: 110,
      capacity: 85,
    },
    {
      id: 'team_2',
      name: 'Mike Brown',
      role: 'Sales Rep',
      department: 'SALES',
      monthlyCost: 4500,
      kpiMetric: 'Monthly Sales',
      kpiTarget: 30000,
      currentKpi: 28500,
      performance: 95,
      capacity: 90,
    },
    {
      id: 'team_3',
      name: 'Alex Chen',
      role: 'Marketing Lead',
      department: 'MARKETING',
      monthlyCost: 5500,
      kpiMetric: 'Leads Generated',
      kpiTarget: 500,
      currentKpi: 520,
      performance: 104,
      capacity: 80,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {},
      create: {
        ...member,
        organizationId: org.id,
      } as any,
    });
  }

  console.log('✅ Created team members:', teamMembers.length);

  // Create offers
  const offers = [
    {
      id: 'offer_1',
      name: 'Premium Package',
      description: 'Our comprehensive premium offering',
      price: 2500,
      deliveryCost: 500,
      profitMargin: 80,
      profitPerSale: 2000,
      isMain: true,
      status: 'ACTIVE',
    },
    {
      id: 'offer_2',
      name: 'Standard Package',
      description: 'Perfect for small to medium businesses',
      price: 1200,
      deliveryCost: 300,
      profitMargin: 75,
      profitPerSale: 900,
      isMain: false,
      status: 'ACTIVE',
    },
    {
      id: 'offer_3',
      name: 'Basic Package',
      description: 'Great starter package',
      price: 500,
      deliveryCost: 150,
      profitMargin: 70,
      profitPerSale: 350,
      isMain: false,
      status: 'ACTIVE',
    },
  ];

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { id: offer.id },
      update: {},
      create: {
        ...offer,
        organizationId: org.id,
      } as any,
    });
  }

  console.log('✅ Created offers:', offers.length);

  // Create marketing channels
  const channels = [
    {
      id: 'channel_1',
      source: 'Google Ads',
      funnelStage: 'AWARENESS',
      visitors: 5000,
      leads: 250,
      convRate: 5,
      monthlySpend: 3000,
      costPerLead: 12,
      status: 'ACTIVE',
    },
    {
      id: 'channel_2',
      source: 'Facebook Ads',
      funnelStage: 'CONSIDERATION',
      visitors: 3500,
      leads: 175,
      convRate: 5,
      monthlySpend: 2500,
      costPerLead: 14.29,
      status: 'ACTIVE',
    },
    {
      id: 'channel_3',
      source: 'Email Marketing',
      funnelStage: 'CONVERSION',
      visitors: 2000,
      leads: 150,
      convRate: 7.5,
      monthlySpend: 500,
      costPerLead: 3.33,
      status: 'ACTIVE',
    },
  ];

  for (const channel of channels) {
    await prisma.marketingChannel.upsert({
      where: { id: channel.id },
      update: {},
      create: {
        ...channel,
        organizationId: org.id,
      } as any,
    });
  }

  console.log('✅ Created marketing channels:', channels.length);

  // Create sales
  const sales = [
    {
      id: 'sale_1',
      clientName: 'Acme Corp',
      offerId: 'offer_1',
      amount: 2500,
      soldById: 'team_1',
      date: new Date('2024-01-15'),
      status: 'CLOSED',
    },
    {
      id: 'sale_2',
      clientName: 'Tech Solutions Inc',
      offerId: 'offer_2',
      amount: 1200,
      soldById: 'team_2',
      date: new Date('2024-01-14'),
      status: 'CLOSED',
    },
    {
      id: 'sale_3',
      clientName: 'Digital Agency',
      offerId: 'offer_1',
      amount: 2500,
      soldById: 'team_1',
      date: new Date('2024-01-13'),
      status: 'CLOSED',
    },
    {
      id: 'sale_4',
      clientName: 'StartupXYZ',
      offerId: 'offer_3',
      amount: 500,
      soldById: 'team_2',
      date: new Date('2024-01-12'),
      status: 'PENDING',
    },
  ];

  for (const sale of sales) {
    await prisma.sale.upsert({
      where: { id: sale.id },
      update: {},
      create: {
        ...sale,
        organizationId: org.id,
      } as any,
    });
  }

  console.log('✅ Created sales:', sales.length);

  // Create missions
  const missions = [
    {
      id: 'mission_1',
      title: 'Close 5 deals this week',
      description: 'Focus on converting warm leads into closed sales',
      type: 'WEEKLY_CHALLENGE',
      department: 'SALES',
      duration: 7,
      xpReward: 100,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      subtasks: [
        { id: '1', title: 'Follow up with 10 prospects', completed: true },
        { id: '2', title: 'Send proposals', completed: true },
        { id: '3', title: 'Close 5 deals', completed: false },
      ],
    },
    {
      id: 'mission_2',
      title: 'Reduce CPL by 20%',
      description: 'Optimize ad campaigns to lower cost per lead',
      type: 'MILESTONE',
      department: 'MARKETING',
      duration: 30,
      xpReward: 200,
      priority: 'MEDIUM',
      status: 'PENDING',
      subtasks: [],
    },
    {
      id: 'mission_3',
      title: 'Update pricing page',
      description: 'Refresh pricing to reflect new offers',
      type: 'QUICK_WIN',
      department: 'PRODUCT',
      duration: 1,
      xpReward: 25,
      priority: 'LOW',
      status: 'COMPLETED',
      subtasks: [],
    },
  ];

  for (const mission of missions) {
    await prisma.mission.upsert({
      where: { id: mission.id },
      update: {},
      create: {
        ...mission,
        organizationId: org.id,
        assignedToId: user2.id,
      } as any,
    });
  }

  console.log('✅ Created missions:', missions.length);

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
