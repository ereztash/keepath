import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

// Edge-safe auth: uses only auth.config (no Prisma).
const { auth } = NextAuth(authConfig);

const PUBLIC = ['/signin', '/api/auth'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|signin).*)'],
};
