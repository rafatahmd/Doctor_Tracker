'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  UserCog,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TopbarShell } from '@/components/layout/Header';

const baseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/users', label: 'Users', icon: UserCog, adminOnly: true },
];

function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const navItems = baseNavItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <nav className="flex-1 space-y-1 px-3 py-2">
      <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-sidebar-foreground/45">
        Menu
      </p>
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/25'
                : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                isActive
                  ? 'bg-white/15'
                  : 'bg-sidebar-accent/80 group-hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="size-4" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col overflow-hidden bg-sidebar text-sidebar-foreground',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sidebar-primary/15 via-transparent to-sidebar-primary/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-sidebar-primary/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <div className="border-b border-sidebar-border px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-sidebar-primary/20 ring-1 ring-sidebar-primary/35">
            <Stethoscope className="size-6 text-sidebar-primary" />
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-sidebar-foreground">
              Doctor Tracker
            </span>
            <span className="text-xs text-sidebar-foreground/50">Admin workspace</span>
          </div>
        </div>
      </div>

      <NavLinks onItemClick={onItemClick} />

      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-sidebar-accent/60 px-3 py-3 ring-1 ring-sidebar-border/80">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/25 text-sm font-semibold text-sidebar-primary-foreground ring-2 ring-sidebar-primary/30">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/55">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-red-300"
          onClick={logout}
        >
          <LogOut className="mr-2 size-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 hidden w-64 flex-col border-r border-sidebar-border shadow-[4px_0_32px_-8px_rgba(0,0,0,0.35)] lg:flex">
        <SidebarShell>
          <SidebarContent />
        </SidebarShell>
      </aside>

      <TopbarShell className="fixed left-0 right-0 top-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 text-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 shadow-xs">
              <Stethoscope className="size-5 text-primary" />
            </div>
            <div>
              <span className="block text-sm font-bold leading-tight tracking-tight">
                Doctor Tracker
              </span>
              <span className="text-[0.65rem] font-medium text-muted-foreground">
                Healthcare admin
              </span>
            </div>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/15 bg-white/60 text-foreground shadow-xs transition-colors hover:bg-primary/5 dark:bg-background/40">
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
              <SidebarShell className="pt-2">
                <SidebarContent onItemClick={() => setMobileOpen(false)} />
              </SidebarShell>
            </SheetContent>
          </Sheet>
        </div>
      </TopbarShell>
    </>
  );
}
