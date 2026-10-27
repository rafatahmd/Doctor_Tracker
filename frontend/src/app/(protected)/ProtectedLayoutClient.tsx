'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export function ProtectedLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.02_250)_0%,_var(--background)_50%)]">
        <Sidebar />
        <div className="lg:pl-64">
          <div className="h-14 lg:hidden" />
          <Header />
          <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
