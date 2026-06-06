import { prisma } from './index';

/**
 * Demo seed for investor walkthrough.
 * Creates a demo user with values, intentions, calendar events, and AI categorizations.
 * Run with: cd packages/database && npx tsx seed.ts
 */
async function main() {
  const email = 'demo@keepath.app';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Demo user exists, clearing...');
    await prisma.user.delete({ where: { email } });
  }

  const user = await prisma.user.create({
    data: { email, name: 'Demo User' },
  });
  console.log('Created user:', user.id);

  const values = await Promise.all(
    [
      { name: 'Deep Work', color: '#6366f1', icon: 'Brain' },
      { name: 'Family', color: '#ec4899', icon: 'Heart' },
      { name: 'Health', color: '#10b981', icon: 'Dumbbell' },
      { name: 'Learning', color: '#f59e0b', icon: 'BookOpen' },
    ].map((v, i) =>
      prisma.value.create({
        data: { ...v, userId: user.id, sortOrder: i },
      })
    )
  );
  console.log(`Created ${values.length} values`);

  const monday = new Date();
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  await Promise.all(
    [
      { valueId: values[0].id, hours: 20 },
      { valueId: values[1].id, hours: 15 },
      { valueId: values[2].id, hours: 5 },
      { valueId: values[3].id, hours: 4 },
    ].map((i) =>
      prisma.weeklyIntention.create({
        data: {
          userId: user.id,
          valueId: i.valueId,
          weekStart: monday,
          targetHours: i.hours,
        },
      })
    )
  );
  console.log('Created weekly intentions');

  // Sample events scattered across the week
  const samples = [
    { title: 'Deep work block', day: 0, hour: 9, duration: 3, valueIdx: 0 },
    { title: 'Team standup', day: 0, hour: 13, duration: 0.5, valueIdx: 0 },
    { title: 'Kids pickup', day: 0, hour: 16, duration: 2, valueIdx: 1 },
    { title: 'Strategy work', day: 1, hour: 10, duration: 2.5, valueIdx: 0 },
    { title: 'Gym', day: 1, hour: 17, duration: 1, valueIdx: 2 },
    { title: 'Dinner with family', day: 1, hour: 19, duration: 2, valueIdx: 1 },
    { title: 'Reading: "Deep Work"', day: 2, hour: 7, duration: 1, valueIdx: 3 },
    { title: 'Deep work block', day: 2, hour: 9, duration: 4, valueIdx: 0 },
    { title: 'Coffee with mentor', day: 2, hour: 15, duration: 1, valueIdx: 3 },
    { title: 'Run', day: 3, hour: 7, duration: 1, valueIdx: 2 },
    { title: 'Deep work', day: 3, hour: 9, duration: 3, valueIdx: 0 },
    { title: 'Kids bedtime story', day: 3, hour: 20, duration: 0.5, valueIdx: 1 },
    { title: 'Weekly review', day: 4, hour: 16, duration: 1, valueIdx: 0 },
  ];

  for (const s of samples) {
    const start = new Date(monday);
    start.setDate(monday.getDate() + s.day);
    start.setHours(s.hour, 0, 0, 0);
    const end = new Date(start.getTime() + s.duration * 3600_000);

    const event = await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        googleEventId: `demo-${s.day}-${s.hour}-${s.title}`,
        calendarId: 'primary',
        title: s.title,
        startTime: start,
        endTime: end,
        durationMinutes: Math.round(s.duration * 60),
        isAllDay: false,
        status: 'confirmed',
      },
    });

    await prisma.eventCategorization.create({
      data: {
        eventId: event.id,
        valueId: values[s.valueIdx].id,
        confidence: 0.9,
        reasoning: `${s.title} → ${values[s.valueIdx].name}`,
      },
    });
  }
  console.log(`Created ${samples.length} events with categorizations`);

  console.log('\n✅ Demo seed complete. User:', email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
