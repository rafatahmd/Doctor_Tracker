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
import { Skeleton } from '@/components/ui/skeleton';
import { AppUser } from '@/hooks/useUsers';
import { ROLE_LABELS, ROLES } from '@/lib/roles';
import { format } from 'date-fns';
import { UserCog } from 'lucide-react';

interface UserTableProps {
  users: AppUser[];
  isLoading: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-16">
          <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/80 hover:bg-transparent">
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</TableHead>
            <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</TableHead>
            <TableHead className="hidden h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              className="cursor-pointer"
              onClick={() => router.push(`/users/${user._id}`)}
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === ROLES.ADMIN ? 'default' : 'secondary'}
                  className="font-normal"
                >
                  {ROLE_LABELS[user.role]}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {format(new Date(user.createdAt), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
