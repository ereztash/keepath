import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@keepath/database';

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  const valueCount = await prisma.value.count({
    where: { userId: session.user.id, isActive: true },
  });

  if (valueCount === 0) redirect('/onboarding');
  redirect('/dashboard');
}
