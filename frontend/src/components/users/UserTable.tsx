'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DataTable,
  DataTableEmptyState,
  dataTableBodyRowClassName,
  dataTableCellClassName,
  dataTableHeadClassName,
  dataTableHeaderRowClassName,
  dataTableHighlightBadgeClassName,
} from '@/components/ui/data-table-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { AppUser } from '@/hooks/useUsers';
import { ROLE_LABELS, ROLES } from '@/lib/roles';
import { format } from 'date-fns';
import { UserCog } from 'lucide-react';

interface UserTableProps {
  users: AppUser[];
  isLoading: boolean;
}

function UserTableSkeleton() {
  return (
    <DataTable>
        <TableHeader>
          <TableRow className={dataTableHeaderRowClassName}>
            <TableHead className={dataTableHeadClassName}>Name</TableHead>
            <TableHead className={dataTableHeadClassName}>Email</TableHead>
            <TableHead className={dataTableHeadClassName}>Role</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>
              Created
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className={dataTableBodyRowClassName}>
              <TableCell className={dataTableCellClassName}>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className={dataTableCellClassName}>
                <Skeleton className="h-4 w-44" />
              </TableCell>
              <TableCell className={dataTableCellClassName}>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden sm:table-cell`}>
                <Skeleton className="h-4 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
    </DataTable>
  );
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <UserTableSkeleton />;
  }

  if (users.length === 0) {
    return <DataTableEmptyState icon={UserCog} title="No users found" />;
  }

  return (
    <DataTable>
        <TableHeader>
          <TableRow className={dataTableHeaderRowClassName}>
            <TableHead className={dataTableHeadClassName}>Name</TableHead>
            <TableHead className={dataTableHeadClassName}>Email</TableHead>
            <TableHead className={dataTableHeadClassName}>Role</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>
              Created
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              className={`${dataTableBodyRowClassName} cursor-pointer`}
              onClick={() => router.push(`/users/${user._id}`)}
            >
              <TableCell className={`${dataTableCellClassName} font-medium text-foreground`}>
                {user.name}
              </TableCell>
              <TableCell className={`${dataTableCellClassName} text-muted-foreground`}>
                {user.email}
              </TableCell>
              <TableCell className={dataTableCellClassName}>
                <Badge
                  variant={user.role === ROLES.ADMIN ? 'secondary' : 'outline'}
                  className={
                    user.role === ROLES.ADMIN
                      ? dataTableHighlightBadgeClassName
                      : 'font-normal'
                  }
                >
                  {ROLE_LABELS[user.role]}
                </Badge>
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground sm:table-cell`}>
                {format(new Date(user.createdAt), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
    </DataTable>
  );
}
