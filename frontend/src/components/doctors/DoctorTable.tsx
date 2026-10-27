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
import { Button } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Doctor } from '@/hooks/useDoctors';
import { format } from 'date-fns';
import { MoreHorizontal, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface DoctorTableProps {
  doctors: Doctor[];
  isLoading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function DoctorTable({
  doctors,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: DoctorTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead className="hidden md:table-cell">Hospital</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead className="text-center">Patients</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-36" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No doctors found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/80 hover:bg-transparent">
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</TableHead>
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Specialization</TableHead>
              <TableHead className="hidden h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Hospital</TableHead>
              <TableHead className="hidden h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">Phone</TableHead>
              <TableHead className="hidden h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">Email</TableHead>
              <TableHead className="h-11 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Patients</TableHead>
              <TableHead className="hidden h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow
                key={doctor._id}
                className="cursor-pointer"
                onClick={() => router.push(`/doctors/${doctor._id}`)}
              >
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal text-primary/90 bg-primary/10 hover:bg-primary/10">
                    {doctor.specialization}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{doctor.hospital}</TableCell>
                <TableCell className="hidden lg:table-cell">{doctor.phone}</TableCell>
                <TableCell className="hidden lg:table-cell">{doctor.email || '—'}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{doctor.patientCount || 0}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {format(new Date(doctor.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/doctors/${doctor._id}`);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(doctor);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(doctor._id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
