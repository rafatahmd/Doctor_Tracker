'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/doctors': 'Doctors',
  '/patients': 'Patients',
  '/users': 'Users',
};

export function Header() {
  const pathname = usePathname();
  
  // Get title based on pathname
  const getTitle = () => {
    if (pathname.startsWith('/doctors/') && pathname !== '/doctors') {
      return 'Doctor Details';
    }
    if (pathname.startsWith('/users/') && pathname !== '/users') {
      return 'User Details';
    }
    return pageTitles[pathname] || 'Doctor Tracker';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{getTitle()}</h1>
      </div>
    </header>
  );
}
