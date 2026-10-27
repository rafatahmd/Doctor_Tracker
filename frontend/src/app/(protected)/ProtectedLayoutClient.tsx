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
      <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.02_250)_0%,_var(--background)_50%)] dark:bg-[radial-gradient(ellipse_at_top,_oklch(0.24_0.035_265)_0%,_var(--background)_48%)]">
        <Sidebar />
        <div className="lg:pl-64">
          <div className="h-[4.25rem] lg:hidden" aria-hidden />
          <Header />
          <main className="px-4 sm:px-6 lg:px-8 py-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
