'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/doctors': 'Doctors',
  '/patients': 'Patients',
  '/users': 'Users',
};

const pageDescriptions: Record<string, string> = {
  '/dashboard': 'Overview and analytics',
  '/doctors': 'Manage doctor records',
  '/patients': 'Browse and update patients',
  '/users': 'Accounts and roles',
};

/** Shared frosted topbar surface (header + mobile app bar). */
export function TopbarShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-sky-200/50',
        'shadow-[0_4px_24px_-8px_oklch(0.48_0.14_250/0.18)]',
        'dark:border-border/45 dark:shadow-[0_4px_24px_-8px_oklch(0_0_0/0.45)]',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,oklch(0.985_0.028_250)_0%,oklch(0.998_0.008_250)_42%,oklch(0.975_0.04_215)_100%)] dark:bg-[linear-gradient(118deg,oklch(0.22_0.045_265)_0%,oklch(0.19_0.04_265)_50%,oklch(0.21_0.05_250)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-28 -top-20 h-52 w-72 rounded-full bg-sky-400/25 blur-3xl dark:bg-primary/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-40 w-64 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-3xl dark:bg-teal-500/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-40%,oklch(0.58_0.14_250/0.14),transparent_60%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_-40%,oklch(0.55_0.14_250/0.22),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,oklch(0.48_0.14_250/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.48_0.14_250/0.04)_1px,transparent_1px)] [background-size:28px_28px] dark:opacity-[0.2]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-white/55 backdrop-blur-xl dark:bg-background/45"
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith('/doctors/') && pathname !== '/doctors') {
      return 'Doctor Details';
    }
    if (pathname.startsWith('/users/') && pathname !== '/users') {
      return 'User Details';
    }
    return pageTitles[pathname] || 'Doctor Tracker';
  };

  const getDescription = () => {
    if (pathname.startsWith('/doctors/') && pathname !== '/doctors') {
      return 'Profile and assigned patients';
    }
    if (pathname.startsWith('/users/') && pathname !== '/users') {
      return 'Account information';
    }
    return pageDescriptions[pathname];
  };

  const description = getDescription();

  return (
    <header className="sticky top-[4.25rem] z-40 lg:top-0">
      <TopbarShell>
        <div className="relative flex items-start justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="min-w-0">
            <div
              className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent sm:inset-x-6 lg:inset-x-8"
              aria-hidden
            />
            {description && (
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary/80">
                {description}
              </p>
            )}
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {getTitle()}
            </h1>
          </div>
          <ThemeToggle className="hidden lg:inline-flex" />
        </div>
      </TopbarShell>
    </header>
  );
}
