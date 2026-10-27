'use client';

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
import { Patient } from '@/hooks/usePatients';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface PatientTableProps {
  patients: Patient[];
  isLoading: boolean;
  onEdit?: (patient: Patient) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  canMutate?: boolean;
}

function PatientTableSkeleton({ canMutate }: { canMutate: boolean }) {
  return (
    <DataTable>
        <TableHeader>
          <TableRow className={dataTableHeaderRowClassName}>
            <TableHead className={dataTableHeadClassName}>Name</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>Age</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>Gender</TableHead>
            <TableHead className={dataTableHeadClassName}>Condition</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden md:table-cell`}>Doctor</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>Phone</TableHead>
            <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>Created</TableHead>
            {canMutate && <TableHead className={`${dataTableHeadClassName} w-12`} />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i} className={dataTableBodyRowClassName}>
              <TableCell className={dataTableCellClassName}>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden sm:table-cell`}>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden sm:table-cell`}>
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell className={dataTableCellClassName}>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden md:table-cell`}>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden lg:table-cell`}>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className={`${dataTableCellClassName} hidden lg:table-cell`}>
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

export function PatientTable({
  patients,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
  canMutate = true,
}: PatientTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return <PatientTableSkeleton canMutate={canMutate} />;
  }

  if (patients.length === 0) {
    return <DataTableEmptyState icon={Users} title="No patients found" />;
  }

  return (
    <>
      <DataTable>
          <TableHeader>
            <TableRow className={dataTableHeaderRowClassName}>
              <TableHead className={dataTableHeadClassName}>Name</TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>Age</TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden sm:table-cell`}>Gender</TableHead>
              <TableHead className={dataTableHeadClassName}>Condition</TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden md:table-cell`}>Doctor</TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>Phone</TableHead>
              <TableHead className={`${dataTableHeadClassName} hidden lg:table-cell`}>Created</TableHead>
              {canMutate && <TableHead className={`${dataTableHeadClassName} w-12`} />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient._id} className={dataTableBodyRowClassName}>
                <TableCell className={`${dataTableCellClassName} font-medium text-foreground`}>
                  {patient.name}
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground sm:table-cell`}>
                  {patient.age ?? '—'}
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden sm:table-cell`}>
                  {patient.gender ? (
                    <Badge variant="outline" className="font-normal">
                      {patient.gender}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className={dataTableCellClassName}>
                  <Badge variant="secondary" className={dataTableHighlightBadgeClassName}>
                    {patient.condition}
                  </Badge>
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground md:table-cell`}>
                  {patient.doctor?.name || '—'}
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground lg:table-cell`}>
                  {patient.phone || '—'}
                </TableCell>
                <TableCell className={`${dataTableCellClassName} hidden text-muted-foreground lg:table-cell`}>
                  {format(new Date(patient.createdAt), 'MMM d, yyyy')}
                </TableCell>
                {canMutate && onEdit && onDelete && (
                  <TableCell className={dataTableCellClassName}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={dataTableActionsTriggerClassName}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(patient)}>
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(patient._id)}
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
              <AlertDialogTitle>Delete Patient</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this patient? This action cannot be undone.
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
