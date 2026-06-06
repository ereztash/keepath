import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@keepath/database';
import { authConfig, GOOGLE_SCOPES } from './auth.config';

const nextAuth = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
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
});

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
