'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Compass, LayoutDashboard, Target, Calendar, Flag, MessageSquare, BookHeart, LogOut } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/intentions', label: 'Intentions', icon: Target },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/missions', label: 'Missions', icon: Flag },
  { href: '/coach', label: 'Coach', icon: MessageSquare },
  { href: '/reflect', label: 'Reflect', icon: BookHeart },
];

export function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
          <Compass className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-slate-900">Keepath</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((l) => {
          const active = pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2">
          {session?.user?.image && (
            <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="p-1.5 text-slate-400 hover:text-slate-600"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
