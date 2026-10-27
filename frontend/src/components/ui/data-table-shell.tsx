import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Table } from '@/components/ui/table';

export const dataTableShellClassName =
  'overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.04] dark:bg-card dark:ring-white/[0.06]';

export const dataTableTableClassName = cn(
  'bg-card',
  '[&_[data-slot=table-header]]:bg-muted/25',
  '[&_[data-slot=table-body]_tr]:bg-card',
  '[&_[data-slot=table-body]_tr:hover]:bg-muted/35'
);

export const dataTableHeaderRowClassName =
  'border-b border-border/80 bg-muted/25 hover:bg-muted/25';

export const dataTableHeadClassName =
  'h-11 bg-muted/25 px-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pl-6 last:pr-6';

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

/** Card shell + table with shared background (matches doctors list). */
export function DataTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DataTableShell>
      <Table className={cn(dataTableTableClassName, className)}>{children}</Table>
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
