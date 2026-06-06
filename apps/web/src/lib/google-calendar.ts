import { google, calendar_v3 } from 'googleapis';
import { prisma } from '@keepath/database';

export async function getCalendarClient(userId: string) {
  const conn = await prisma.googleConnection.findUnique({ where: { userId } });
  if (!conn) throw new Error('No Google connection for user');

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2.setCredentials({
    access_token: conn.accessToken,
    refresh_token: conn.refreshToken,
    expiry_date: conn.expiresAt.getTime(),
  });

  // Auto-refresh if expired
  if (conn.expiresAt.getTime() < Date.now() + 60_000) {
    const { credentials } = await oauth2.refreshAccessToken();
    if (credentials.access_token) {
      await prisma.googleConnection.update({
        where: { userId },
        data: {
          accessToken: credentials.access_token,
          expiresAt: new Date(credentials.expiry_date || Date.now() + 3600_000),
          ...(credentials.refresh_token && { refreshToken: credentials.refresh_token }),
        },
      });
      oauth2.setCredentials(credentials);
    }
  }

  return google.calendar({ version: 'v3', auth: oauth2 });
}

export async function listEventsInRange(
  userId: string,
  timeMin: Date,
  timeMax: Date
): Promise<calendar_v3.Schema$Event[]> {
  const calendar = await getCalendarClient(userId);
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 250,
  });
  return res.data.items || [];
}

export async function syncEventsToDB(userId: string, timeMin: Date, timeMax: Date) {
  const events = await listEventsInRange(userId, timeMin, timeMax);

  const persisted = await Promise.all(
    events
      .filter((e) => e.start && e.id && e.status !== 'cancelled')
      .map(async (e) => {
        const isAllDay = !!e.start?.date;
        const startTime = new Date(e.start?.dateTime || e.start?.date!);
        const endTime = new Date(e.end?.dateTime || e.end?.date!);
        const durationMinutes = Math.max(
          1,
          Math.round((endTime.getTime() - startTime.getTime()) / 60_000)
        );

        return prisma.calendarEvent.upsert({
          where: {
            userId_googleEventId: { userId, googleEventId: e.id! },
          },
          create: {
            userId,
            googleEventId: e.id!,
            calendarId: 'primary',
            title: e.summary || '(no title)',
            description: e.description || null,
            location: e.location || null,
            startTime,
            endTime,
            durationMinutes,
            isAllDay,
            status: e.status || 'confirmed',
          },
          update: {
            title: e.summary || '(no title)',
            description: e.description || null,
            location: e.location || null,
            startTime,
            endTime,
            durationMinutes,
            isAllDay,
            status: e.status || 'confirmed',
            syncedAt: new Date(),
          },
        });
      })
  );

  await prisma.googleConnection.update({
    where: { userId },
    data: { lastSyncedAt: new Date() },
  });

  return persisted;
}
