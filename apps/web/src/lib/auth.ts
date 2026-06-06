import NextAuth, { type NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@keepath/database';

const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
].join(' ');

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  session: { strategy: 'database' },
  pages: { signIn: '/signin' },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id: string }).id = user.id;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      if (account.provider !== 'google') return;
      if (!account.access_token || !account.refresh_token) return;
      const userId = user.id;
      if (!userId) return;
      const expiresAt = account.expires_at
        ? new Date(account.expires_at * 1000)
        : new Date(Date.now() + 3600 * 1000);
      await prisma.googleConnection.upsert({
        where: { userId },
        create: {
          userId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt,
          scope: account.scope || GOOGLE_SCOPES,
        },
        update: {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt,
          scope: account.scope || GOOGLE_SCOPES,
        },
      });
    },
  },
};

const nextAuth = NextAuth(authConfig);

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
