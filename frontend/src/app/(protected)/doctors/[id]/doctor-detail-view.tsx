'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoctor } from '@/hooks/useDoctors';
import {
  useDoctorPatients,
  useAddDoctorPatient,
  useRemoveDoctorPatient,
  PatientFilters,
  PatientFormData,
} from '@/hooks/usePatients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { DataPagination } from '@/components/ui/data-pagination';
import { PatientForm } from '@/components/patients/PatientForm';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export function DoctorDetailView() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const [filters, setFilters] = useState<PatientFilters>({ page: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

  const { data: doctor, isLoading: isLoadingDoctor, error } = useDoctor(doctorId);
  const { data: patientsData, isLoading: isLoadingPatients } = useDoctorPatients(doctorId, filters);
  const addPatient = useAddDoctorPatient();
  const removePatient = useRemoveDoctorPatient();

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleAddPatient = async (data: PatientFormData) => {
    try {
      await addPatient.mutateAsync({ doctorId, data });
      toast.success('Patient added successfully');
      setIsFormOpen(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleRemovePatient = async (patientId: string) => {
    try {
      await removePatient.mutateAsync({ doctorId, patientId });
      toast.success('Patient removed successfully');
      setDeletePatientId(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to remove patient');
    }
  };

  if (isLoadingDoctor) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <p className="text-muted-foreground">Doctor not found</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/doctors')}>
            Back to Doctors
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.push('/doctors')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Doctors
      </Button>

      {/* Doctor Info Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{doctor.name}</CardTitle>
              <Badge variant="secondary" className="mt-2">
                {doctor.specialization}
              </Badge>
            </div>
            <Badge variant="outline" className="w-fit">
              {doctor.patientCount || 0} Patients
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hospital</p>
                <p className="font-medium">{doctor.hospital}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{doctor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{doctor.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold">Patients</h2>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patients Table */}
        {isLoadingPatients ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : patientsData?.patients.length === 0 ? (
          <div className="rounded-md border">
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No patients found</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Age</TableHead>
                  <TableHead className="hidden sm:table-cell">Gender</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsData?.patients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{patient.age || '-'}</TableCell>
                    <TableCell className="hidden sm:table-cell">{patient.gender || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.condition}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{patient.phone || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(new Date(patient.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeletePatientId(patient._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {patientsData?.pagination && patientsData.pagination.totalCount > 0 && (
          <DataPagination
            currentPage={patientsData.pagination.currentPage}
            totalPages={patientsData.pagination.totalPages}
            totalCount={patientsData.pagination.totalCount}
            hasNextPage={patientsData.pagination.hasNextPage}
            hasPrevPage={patientsData.pagination.hasPrevPage}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        )}
      </div>

      {/* Add Patient Dialog */}
      <PatientForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        doctorId={doctorId}
        onSubmit={handleAddPatient}
        isLoading={addPatient.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePatientId} onOpenChange={() => setDeletePatientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this patient from this doctor?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePatientId && handleRemovePatient(deletePatientId)}
              className="bg-destructive hover:bg-destructive/90"
              disabled={removePatient.isPending}
            >
              {removePatient.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
