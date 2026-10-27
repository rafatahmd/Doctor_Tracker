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
      <div className="min-h-dvh bg-background bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.02_250)_0%,_var(--background)_50%)] dark:bg-[radial-gradient(ellipse_at_top,_oklch(0.24_0.035_265)_0%,_var(--background)_48%)]">
        <Sidebar />
        <div className="flex h-dvh min-h-0 flex-col overflow-hidden lg:pl-64">
          <div className="h-[4.25rem] shrink-0 lg:hidden" aria-hidden />
          <Header />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
