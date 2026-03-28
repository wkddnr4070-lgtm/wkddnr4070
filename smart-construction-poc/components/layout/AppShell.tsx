import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface AppShellProps {
  totalCount: number;
  children: ReactNode;
}

export function AppShell({ totalCount, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header totalCount={totalCount} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
