import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Table } from '@/components/ui/table';

export const dataTableShellClassName =
  'overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.04] dark:bg-card dark:ring-white/[0.06]';

/** Dashboard / detail pages scroll inside main; list pages use table-only scroll. */
export const scrollablePageClassName =
  'min-h-0 flex-1 overflow-x-hidden overflow-y-auto';

/** List pages: header, filters, and pagination fixed; table area scrolls. */
export const listPageLayoutClassName =
  'flex min-h-0 flex-1 flex-col gap-6 overflow-hidden [&>*:not([data-table-slot])]:shrink-0';

export const listPageTableSlotClassName =
  'flex min-h-0 flex-1 flex-col overflow-hidden';

const dataTableScrollRegionClassName = cn(
  'max-h-full min-h-0 overflow-auto overscroll-contain [scrollbar-gutter:stable]',
  '[&_[data-slot=table-container]]:overflow-visible'
);

export const dataTableTableClassName = cn(
  'bg-card',
  '[&_[data-slot=table-header]]:bg-muted/25',
  '[&_[data-slot=table-body]_tr]:bg-card',
  '[&_[data-slot=table-body]_tr:hover]:bg-muted/35'
);

export const dataTableHeaderRowClassName =
  'border-b border-border/80 bg-muted/25 hover:bg-muted/25';

export const dataTableHeadClassName =
  'sticky top-0 z-10 h-11 bg-muted/95 px-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-[inset_0_-1px_0_0_var(--border)] backdrop-blur-sm first:pl-6 last:pr-6';

export const dataTableCellClassName = 'bg-card px-4 py-3.5 align-middle first:pl-6 last:pr-6';

export const dataTableBodyRowClassName =
  'border-border/60 bg-card transition-colors hover:bg-muted/35';

/** Primary-tint pill used for specialization, condition, roles, etc. */
export const dataTableHighlightBadgeClassName =
  'border-0 bg-primary/10 font-normal text-primary hover:bg-primary/10';

export function DataTableShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(dataTableShellClassName, className)}>{children}</div>
  );
}

/** Card shell + table; when fillHeight, body scrolls with sticky header (not the page). */
export function DataTable({
  children,
  className,
  fillHeight = true,
}: {
  children: ReactNode;
  className?: string;
  fillHeight?: boolean;
}) {
  return (
    <DataTableShell
      className={fillHeight ? 'max-h-full min-h-0 overflow-hidden' : undefined}
    >
      <div
        className={cn(
          fillHeight && dataTableScrollRegionClassName,
          !fillHeight && 'overflow-x-auto'
        )}
      >
        <Table className={cn(dataTableTableClassName, className)}>{children}</Table>
      </div>
    </DataTableShell>
  );
}

export function DataTableEmptyState({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <DataTableShell>
      <div className="flex flex-col items-center justify-center gap-3 bg-card py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
          <Icon className="size-7" aria-hidden />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
    </DataTableShell>
  );
}

export const dataTableActionsTriggerClassName =
  'inline-flex size-8 items-center justify-center rounded-lg bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
