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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DataTable,
  DataTableEmptyState,
  dataTableActionsTriggerClassName,
  dataTableBodyRowClassName,
  dataTableCellClassName,
  dataTableHeadClassName,
  dataTableHeaderRowClassName,
  dataTableHighlightBadgeClassName,
} from '@/components/ui/data-table-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { Doctor } from '@/hooks/useDoctors';
import { format } from 'date-fns';
import { MoreHorizontal, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface DoctorTableProps {
  doctors: Doctor[];
  isLoading: boolean;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  canMutate?: boolean;
}

function DoctorTableSkeleton({ canMutate }: { canMutate: boolean }) {
  return (
    <DataTable>
        <TableHeader>
          <TableRow className={dataTableHeaderRowClassName}>
            <TableHead className={dataTableHeadClassName}>Name</TableHead>
            <TableHead className={dataTableHeadClassName}>Specialization</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden md:table-cell`}>
              Hospital
            </TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>
              Phone
            </TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>
              Email
            </TableHead>
            <TableHead className={`${dataTableHeadClassName} text-center`}>Patients</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>
              Created
            </TableHead>
            {canMutate && <TableHead className={`${dataTableHeadClassName} w-12`} />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className={dataTableBodyRowClassName}>
              <TableCell className={dataTableCellClassName}>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className={dataTableCellClassName}>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden md:table-cell`}>
                <Skeleton className="h-4 w-36" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden lg:table-cell`}>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden lg:table-cell`}>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} text-center`}>
                <Skeleton className="mx-auto h-5 w-8" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden sm:table-cell`}>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              {canMutate && (
                <TableCell className={dataTableCellClassName}>
                  <Skeleton className="size-8 rounded-lg" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
    </DataTable>
  );
}

export function DoctorTable({
  doctors,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  canMutate = true,
}: DoctorTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return <DoctorTableSkeleton canMutate={canMutate} />;
  }

  if (doctors.length === 0) {
    return <DataTableEmptyState icon={Users} title="No doctors found" />;
  }

  return (
    <>
      <DataTable>
          <TableHeader>
            <TableRow className={dataTableHeaderRowClassName}>
              <TableHead className={dataTableHeadClassName}>Name</TableHead>
              <TableHead className={dataTableHeadClassName}>Specialization</TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden md:table-cell`}>
                Hospital
              </TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>
                Phone
              </TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>
                Email
              </TableHead>
              <TableHead className={`${dataTableHeadClassName} text-center`}>Patients</TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>
                Created
              </TableHead>
              {canMutate && <TableHead className={`${dataTableHeadClassName} w-12`} />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow
                key={doctor._id}
                className={`${dataTableBodyRowClassName} cursor-pointer`}
                onClick={() => router.push(`/doctors/${doctor._id}`)}
              >
                <TableCell className={`${dataTableCellClassName} font-medium text-foreground`}>
                  {doctor.name}
                </TableCell>
                <TableCell className={dataTableCellClassName}>
                  <Badge variant="secondary" className={dataTableHighlightBadgeClassName}>
                    {doctor.specialization}
                  </Badge>
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground md:table-cell`}>
                  {doctor.hospital}
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground lg:table-cell`}>
                  {doctor.phone}
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground lg:table-cell`}>
                  {doctor.email || '—'}
                </TableCell>
                <TableCell className={`${dataTableCellClassName} text-center`}>
                  <Badge variant="outline" className="min-w-8 justify-center font-normal">
                    {doctor.patientCount || 0}
                  </Badge>
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground sm:table-cell`}>
                  {format(new Date(doctor.createdAt), 'MMM d, yyyy')}
                </TableCell>
                {canMutate && onEdit && onDelete && (
                  <TableCell className={dataTableCellClassName} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={dataTableActionsTriggerClassName}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/doctors/${doctor._id}`)}
                        >
                          <Eye className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(doctor)}>
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(doctor._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
      </DataTable>

      {canMutate && onDelete && (
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this doctor? This will also delete all patients
                associated with this doctor. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteId) {
                    onDelete(deleteId);
                    setDeleteId(null);
                  }
                }}
                className="bg-destructive hover:bg-destructive/90"
                loading={isDeleting}
                loadingText="Deleting..."
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
