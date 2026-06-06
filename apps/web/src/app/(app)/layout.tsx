import { Nav } from '@/components/nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Nav />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
