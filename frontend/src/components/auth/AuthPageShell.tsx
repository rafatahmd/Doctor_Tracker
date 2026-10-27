import type { ReactNode } from 'react';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthPageShell({
  title,
  description,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.48_0.14_250/0.18),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.48_0.14_250/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.48_0.14_250/0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_20%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl dark:bg-primary/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-chart-2/15 blur-3xl"
        aria-hidden
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link
          href="/login"
          className="mb-8 flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Stethoscope className="size-5 text-primary" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">Doctor Tracker</span>
        </Link>

        <div
          className={cn(
            'w-full max-w-[420px] rounded-2xl border border-border/60 bg-card/80 p-8 shadow-xl shadow-primary/5 backdrop-blur-md',
            'dark:border-border/40 dark:bg-card/70 dark:shadow-black/20'
          )}
        >
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}

          <div className="mt-8 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>

        <p className="mt-8 max-w-sm text-center text-xs text-muted-foreground/80">
          Secure access for healthcare teams to manage doctors, patients, and records.
        </p>
      </div>
    </div>
  );
}
