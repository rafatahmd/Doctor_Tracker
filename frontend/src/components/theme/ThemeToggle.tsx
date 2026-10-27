'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  variant?: 'icon' | 'sidebar';
  className?: string;
};

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  if (!mounted) {
    if (variant === 'sidebar') {
      return (
        <Button
          type="button"
          variant="ghost"
          className={cn('w-full justify-start text-sidebar-foreground/70', className)}
          disabled
          aria-hidden
        >
          <Sun className="mr-2 size-4 opacity-0" />
          Theme
        </Button>
      );
    }
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn('size-9', className)}
        disabled
        aria-label="Theme"
      />
    );
  }

  if (variant === 'sidebar') {
    return (
      <Button
        type="button"
        variant="ghost"
        className={cn(
          'w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          className
        )}
        onClick={toggle}
      >
        {isDark ? (
          <>
            <Sun className="mr-2 size-4" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="mr-2 size-4" />
            Dark Mode
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('size-9 shrink-0', className)}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
